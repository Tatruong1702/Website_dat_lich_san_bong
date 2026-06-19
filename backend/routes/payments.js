import express from 'express';
import crypto from 'crypto';
import db from '../db.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

// 1. POST: Tạo mới giao dịch thanh toán
router.post("/", authenticate, async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { booking_id, payment_method, amount } = req.body;

    if (!booking_id || !payment_method || amount == null) {
      return res.status(400).json({ message: "Thiếu thông tin thanh toán." });
    }

    const [bookings] = await conn.query(
      "SELECT * FROM bookings WHERE booking_id = ? AND user_id = ?",
      [booking_id, req.user.user_id]
    );
    if (!bookings.length) {
      return res.status(404).json({ message: "Không tìm thấy đặt sân." });
    }
    if (bookings[0].status === "cancelled") {
      return res.status(400).json({ message: "Đặt sân đã bị hủy." });
    }

    const [existing] = await conn.query(
      "SELECT * FROM payments WHERE booking_id = ? AND status = 'paid'",
      [booking_id]
    );
    if (existing.length) {
      return res.status(409).json({ message: "Đặt sân này đã được thanh toán." });
    }

    await conn.beginTransaction();

    const transactionCode = `SB${Date.now()}${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    const [result] = await conn.query(
      `INSERT INTO payments (booking_id, payment_method, transaction_code, amount, status)
       VALUES (?, ?, ?, ?, 'pending')`,
      [booking_id, payment_method, transactionCode, amount]
    );
    const paymentId = result.insertId;

    await conn.commit();

    const redirectMethods = ["momo", "zalopay", "bank_transfer", "credit_card"];
    if (redirectMethods.includes(payment_method)) {
      const redirectUrl = buildGatewayUrl(payment_method, {
        transactionCode,
        amount,
        bookingId: booking_id,
        paymentId,
        returnUrl: `${process.env.FRONTEND_URL}/checkout/callback?payment_id=${paymentId}`,
      });
      return res.status(201).json({ payment_id: paymentId, redirect_url: redirectUrl });
    }

    await db.query(
      "UPDATE payments SET status = 'paid', paid_at = NOW() WHERE payment_id = ?",
      [paymentId]
    );
    await db.query(
      "UPDATE bookings SET status = 'confirmed' WHERE booking_id = ?",
      [booking_id]
    );

    const [payments] = await db.query(
      "SELECT * FROM payments WHERE payment_id = ?",
      [paymentId]
    );
    res.status(201).json(payments[0]);
  } catch (err) {
    await conn.rollback();
    console.error("[POST /payments]", err);
    res.status(500).json({ message: "Lỗi tạo thanh toán." });
  } finally {
    conn.release();
  }
});

// 2. GET: Kiểm tra/Xác thực thanh toán của người dùng
router.get("/:id/verify", authenticate, async (req, res) => {
  try {
    const [payments] = await db.query(
      `SELECT p.*, b.user_id
       FROM payments p
       JOIN bookings b ON p.booking_id = b.booking_id
       WHERE p.payment_id = ?`,
      [req.params.id]
    );
    if (!payments.length) return res.status(404).json({ message: "Không tìm thấy thanh toán." });

    const payment = payments[0];
    if (payment.user_id !== req.user.user_id) {
      return res.status(403).json({ message: "Không có quyền truy cập." });
    }

    res.json(payment);
  } catch (err) {
    console.error("[GET /payments/:id/verify]", err);
    res.status(500).json({ message: "Lỗi kiểm tra thanh toán." });
  }
});

// 3. POST: Xử lý Webhook/Callback từ cổng thanh toán (Momo, ZaloPay...)
router.post("/callback/:method", async (req, res) => {
  const conn = await db.getConnection();
  try {
    const { method } = req.params;
    const payload = req.body;

    const isValid = verifyGatewaySignature(method, payload, req.headers);
    if (!isValid) {
      console.warn(`[CALLBACK] Invalid signature for ${method}`);
      return res.status(400).json({ message: "Invalid signature" });
    }

    const { transactionCode, resultCode } = normalizeCallback(method, payload);
    const isPaid = resultCode === 0;

    const [payments] = await conn.query(
      "SELECT * FROM payments WHERE transaction_code = ?",
      [transactionCode]
    );
    if (!payments.length) return res.status(404).json({ message: "Payment not found" });

    const payment = payments[0];
    const newPaymentStatus = isPaid ? "paid" : "failed";
    const newBookingStatus = isPaid ? "confirmed" : "pending";

    await conn.beginTransaction();

    await conn.query(
      "UPDATE payments SET status = ?, paid_at = ? WHERE payment_id = ?",
      [newPaymentStatus, isPaid ? new Date() : null, payment.payment_id]
    );
    await conn.query(
      "UPDATE bookings SET status = ? WHERE booking_id = ?",
      [newBookingStatus, payment.booking_id]
    );

    if (isPaid) {
      const [bookings] = await conn.query(
        "SELECT user_id FROM bookings WHERE booking_id = ?",
        [payment.booking_id]
      );
      if (bookings.length) {
        await conn.query(
          `INSERT INTO notifications (user_id, title, message)
           VALUES (?, 'Thanh toán thành công', ?)`,
          [
            bookings[0].user_id,
            `Thanh toán cho đặt sân #${String(payment.booking_id).padStart(6, "0")} đã được xác nhận.`,
          ]
        );
      }
    }

    await conn.commit();
    res.json({ message: "OK" });
  } catch (err) {
    await conn.rollback();
    console.error("[POST /payments/callback]", err);
    res.status(500).json({ message: "Callback processing failed" });
  } finally {
    conn.release();
  }
});

// --- Hàm bổ trợ tạo URL và chuẩn hóa dữ liệu ---

function buildGatewayUrl(method, { transactionCode, amount, returnUrl }) {
  const base = {
    momo: "https://payment.momo.vn/gw_payment/transactionProcessor",
    zalopay: "https://sbgateway.zalopay.vn/openinapp",
    bank_transfer: `${process.env.FRONTEND_URL}/payment/bank-transfer`,
    credit_card: "https://sandbox.napas.com.vn/pay",
  };
  const url = new URL(base[method] || process.env.FRONTEND_URL);
  url.searchParams.set("order_id", transactionCode);
  url.searchParams.set("amount", amount);
  url.searchParams.set("redirect_url", returnUrl);
  return url.toString();
}

function verifyGatewaySignature(method, payload, headers) {
  if (process.env.NODE_ENV !== "production") return true;
  return false; 
}

function normalizeCallback(method, payload) {
  if (method === "momo") {
    return { transactionCode: payload.orderId, resultCode: payload.resultCode };
  }
  if (method === "zalopay") {
    return { transactionCode: payload.app_trans_id, resultCode: payload.return_code === 1 ? 0 : 1 };
  }
  return { transactionCode: payload.transaction_code, resultCode: payload.result_code };
}

export default router;