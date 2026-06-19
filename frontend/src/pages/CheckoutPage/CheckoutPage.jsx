import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Card,
  Button,
  Input,
  Row,
  Col,
  Steps,
  Alert,
  Spin,
  Typography,
} from "antd";

import {
  createBooking,
  createPayment,
  verifyPayment,
} from "../../services/bookingService";
import { formatCurrency } from "../../utils/format";

const { Title } = Typography;
const { Step } = Steps;

const STEPS = ["Xem lại", "Thanh toán", "Hoàn tất"];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ fallback khi refresh
  const bookingData =
    location.state || JSON.parse(localStorage.getItem("bookingData"));

  const [currentStep, setCurrentStep] = useState(0);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [promoDiscount, setPromoDiscount] = useState(0);
  const [promoError, setPromoError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  useEffect(() => {
    if (!bookingData) {
      navigate("/");
    } else {
      // lưu lại để tránh mất khi F5
      localStorage.setItem("bookingData", JSON.stringify(bookingData));
    }
  }, [bookingData]);

  if (!bookingData) return null;

  // ✅ map lại dữ liệu từ sidebar
  const subtotal = bookingData.total;
  const total = Math.max(0, subtotal - promoDiscount);

  const handleApplyPromo = () => {
    if (promoCode === "BBALL10") {
      setPromoDiscount(subtotal * 0.1);
      setPromoError("");
    } else {
      setPromoDiscount(0);
      setPromoError("Mã không hợp lệ");
    }
  };

  const handlePayment = async () => {
    if (!selectedPayment) {
      setError("Chọn phương thức thanh toán");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // ✅ tạo booking từ dữ liệu sidebar
      const booking = await createBooking({
        booking_date: bookingData.date,
        start_time: bookingData.slot,
        duration: bookingData.quantity,
        total_price: total,
      });

      const payment = await createPayment({
        booking_id: booking.booking_id,
        payment_method: selectedPayment,
        amount: total,
      });

      // redirect (VNPay / MoMo)
      if (payment.redirect_url) {
        window.location.href = payment.redirect_url;
        return;
      }

      const verified = await verifyPayment(payment.payment_id);

      setConfirmedBooking({ ...booking, payment: verified });
      setCurrentStep(2);

      localStorage.removeItem("bookingData");
    } catch (err) {
      setError("Thanh toán lỗi");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto", padding: 20 }}>
      <Title level={3}>Thanh toán</Title>

      <Steps current={currentStep}>
        {STEPS.map((s) => (
          <Step key={s} title={s} />
        ))}
      </Steps>

      {/* STEP 1 */}
      {currentStep === 0 && (
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={14}>
            <Card title="Thông tin đặt sân">
              <p>Ngày: {bookingData.date}</p>
              <p>Giờ: {bookingData.slot}</p>
              <p>Số giờ: {bookingData.quantity}</p>
            </Card>

            <Card title="Mã giảm giá" style={{ marginTop: 16 }}>
              <Input
                placeholder="Nhập mã"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
              />
              <Button type="primary" onClick={handleApplyPromo} style={{ marginTop: 10 }}>
                Áp dụng
              </Button>

              {promoError && <Alert type="error" message={promoError} style={{ marginTop: 10 }} />}
            </Card>
          </Col>

          <Col span={10}>
            <PriceCard subtotal={subtotal} discount={promoDiscount} total={total} />

            <Button
              type="primary"
              block
              size="large"
              style={{ marginTop: 16 }}
              onClick={() => setCurrentStep(1)}
            >
              Tiếp tục
            </Button>
          </Col>
        </Row>
      )}

      {/* STEP 2 */}
      {currentStep === 1 && (
        <Row gutter={16} style={{ marginTop: 20 }}>
          <Col span={14}>
            <Card title="Chọn thanh toán">
              <Button
                type={selectedPayment === "cash" ? "primary" : "default"}
                block
                onClick={() => setSelectedPayment("cash")}
              >
                Tiền mặt
              </Button>

              <Button
                type={selectedPayment === "momo" ? "primary" : "default"}
                block
                style={{ marginTop: 10 }}
                onClick={() => setSelectedPayment("momo")}
              >
                MoMo
              </Button>
            </Card>

            {error && <Alert type="error" message={error} style={{ marginTop: 10 }} />}
          </Col>

          <Col span={10}>
            <PriceCard subtotal={subtotal} discount={promoDiscount} total={total} />

            <Button
              type="primary"
              block
              size="large"
              onClick={handlePayment}
              disabled={!selectedPayment || isLoading}
              style={{ marginTop: 16 }}
            >
              {isLoading ? <Spin /> : `Thanh toán ${formatCurrency(total)}`}
            </Button>
          </Col>
        </Row>
      )}

      {/* STEP 3 */}
      {currentStep === 2 && confirmedBooking && (
        <Card style={{ marginTop: 20 }}>
          <Title level={4}>Đặt sân thành công 🎉</Title>
          <p>Mã đơn: {confirmedBooking.booking_id}</p>
          <p>Số tiền: {formatCurrency(total)}</p>

          <Button type="primary" onClick={() => navigate("/")}>
            Về trang chủ
          </Button>
        </Card>
      )}
    </div>
  );
}

function PriceCard({ subtotal, discount, total }) {
  return (
    <Card title="Thanh toán">
      <p>Tạm tính: {formatCurrency(subtotal)}</p>
      <p>Giảm: {formatCurrency(discount)}</p>
      <Title level={4}>Tổng: {formatCurrency(total)}</Title>
    </Card>
  );
}