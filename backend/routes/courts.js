import express from 'express';
import db from '../db.js'; // Thêm đuôi .js để Node.js nhận diện đúng file cấu hình database

const router = express.Router();

// 1. GET: Lấy danh sách sân kèm bộ lọc (Tìm kiếm, Thành phố, Giá, Đánh giá...)
router.get("/", async (req, res) => {
  try {
    const { city, sport_type, min_price, max_price, q } = req.query;
    let sql = `
      SELECT c.court_id, c.court_name, c.sport_type, c.price_per_hour, c.image, c.status,
             v.venue_id, v.venue_name, v.address, v.city,
             COALESCE(AVG(r.rating), 0) AS avg_rating,
             COUNT(DISTINCT r.review_id) AS review_count
      FROM courts c
      JOIN venues v ON c.venue_id = v.venue_id
      LEFT JOIN reviews r ON r.court_id = c.court_id
      WHERE c.status = 1 AND v.status = 1
    `;
    const params = [];

    if (city) { sql += " AND v.city = ?"; params.push(city); }
    if (sport_type) { sql += " AND c.sport_type = ?"; params.push(sport_type); }
    if (min_price) { sql += " AND c.price_per_hour >= ?"; params.push(Number(min_price)); }
    if (max_price) { sql += " AND c.price_per_hour <= ?"; params.push(Number(max_price)); }
    if (q) {
      sql += " AND (c.court_name LIKE ? OR v.venue_name LIKE ? OR v.address LIKE ?)";
      const like = `%${q}%`;
      params.push(like, like, like);
    }

    sql += " GROUP BY c.court_id ORDER BY avg_rating DESC LIMIT 50";

    const [courts] = await db.query(sql, params);
    res.json(courts);
  } catch (err) {
    console.error("[GET /courts]", err);
    res.status(500).json({ message: "Lỗi tải danh sách sân." });
  }
});

// 2. GET: Chi tiết 1 sân cụ thể theo ID
router.get("/:id", async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, v.venue_name, v.address, v.city, v.description AS venue_description,
              COALESCE(AVG(r.rating), 0) AS avg_rating,
              COUNT(DISTINCT r.review_id) AS review_count
       FROM courts c
       JOIN venues v ON c.venue_id = v.venue_id
       LEFT JOIN reviews r ON r.court_id = c.court_id
       WHERE c.court_id = ? AND c.status = 1
       GROUP BY c.court_id`,
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ message: "Sân không tồn tại." });

    const [images] = await db.query(
      "SELECT image_url FROM court_images WHERE court_id = ?",
      [req.params.id]
    );

    res.json({ ...rows[0], images: images.map((i) => i.image_url) });
  } catch (err) {
    console.error("[GET /courts/:id]", err);
    res.status(500).json({ message: "Lỗi tải thông tin sân." });
  }
});

// 3. GET: Lấy các khung giờ trống/đã đặt của sân theo ngày
router.get("/:id/slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({ message: "Ngày không hợp lệ (YYYY-MM-DD)." });
    }

    const [bookings] = await db.query(
      `SELECT start_time, end_time FROM bookings
       WHERE court_id = ? AND booking_date = ? AND status NOT IN ('cancelled')`,
      [req.params.id, date]
    );

    const slots = [];
    for (let h = 6; h < 22; h++) {
      const time = `${String(h).padStart(2, "0")}:00`;
      const slotStart = h * 60;
      const slotEnd = slotStart + 60;

      const isBooked = bookings.some((b) => {
        const [bsh, bsm] = b.start_time.split(":").map(Number);
        const [beh, bem] = b.end_time.split(":").map(Number);
        const bookedStart = bsh * 60 + bsm;
        const bookedEnd = beh * 60 + bem;
        return slotStart < bookedEnd && slotEnd > bookedStart;
      });

      const now = new Date();
      const today = now.toISOString().split("T")[0];
      const isPast = date === today && h <= now.getHours();

      slots.push({
        time,
        status: isPast ? "past" : isBooked ? "booked" : "available",
      });
    }

    res.json(slots);
  } catch (err) {
    console.error("[GET /courts/:id/slots]", err);
    res.status(500).json({ message: "Lỗi tải lịch trống." });
  }
});

export default router;