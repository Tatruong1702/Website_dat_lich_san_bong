import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyPayment } from "../../services/bookingService";
import { Card, Result, Spin, Button } from "antd";

export default function PaymentCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentId = searchParams.get("payment_id");

  const [status, setStatus] = useState("loading");

  useEffect(() => {
    if (!paymentId) {
      navigate("/");
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    const interval = setInterval(async () => {
      attempts++;
      try {
        const payment = await verifyPayment(paymentId);

        if (payment.status === "paid") {
          clearInterval(interval);
          setStatus("success");
          setTimeout(() => navigate(`/bookings/${payment.booking_id}`), 2500);
        } else if (payment.status === "failed") {
          clearInterval(interval);
          setStatus("failed");
        } else if (attempts >= maxAttempts) {
          clearInterval(interval);
          setStatus("failed");
        }
      } catch {
        clearInterval(interval);
        setStatus("failed");
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [paymentId, navigate]);

  return (
    <div style={{ minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center" }}>
      <Card style={{ width: 400, textAlign: "center" }}>
        
        {status === "loading" && (
          <div>
            <Spin size="large" />
            <p style={{ marginTop: 16, fontWeight: 600 }}>
              Đang xác nhận thanh toán...
            </p>
            <p style={{ color: "#888" }}>
              Vui lòng không tắt trang này
            </p>
          </div>
        )}

        {status === "success" && (
          <Result
            status="success"
            title="Thanh toán thành công!"
            subTitle="Đang chuyển đến trang đặt sân..."
          />
        )}

        {status === "failed" && (
          <Result
            status="error"
            title="Thanh toán thất bại"
            subTitle="Giao dịch không thành công. Vui lòng thử lại."
            extra={[
              <Button
                type="primary"
                key="retry"
                onClick={() => navigate(-2)}
              >
                Thử lại
              </Button>,
              <Button key="home" onClick={() => navigate("/")}>
                Về trang chủ
              </Button>,
            ]}
          />
        )}

      </Card>
    </div>
  );
}