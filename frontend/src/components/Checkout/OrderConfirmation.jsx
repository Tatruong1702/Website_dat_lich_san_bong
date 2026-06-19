import { useNavigate } from "react-router-dom";
import { formatCurrency, formatDate, formatTime } from "../../utils/format";

const PAYMENT_LABELS = {
  momo: "Ví MoMo",
  zalopay: "ZaloPay",
  bank_transfer: "Chuyển khoản ngân hàng",
  credit_card: "Thẻ tín dụng",
  cod: "Thanh toán tại sân",
};

export default function OrderConfirmation({ booking, total }) {
  const navigate = useNavigate();

  return (
    <div className="max-w-lg mx-auto">
      {/* Success banner */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-center text-white shadow-xl shadow-orange-200 mb-5">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-1">Đặt sân thành công!</h2>
        <p className="text-orange-100 text-sm">Xác nhận đã được gửi đến email của bạn</p>
      </div>

      {/* Booking detail card */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Chi tiết đặt sân</h3>
          <span className="text-xs bg-green-100 text-green-700 font-semibold px-3 py-1 rounded-full">
            ✓ Đã xác nhận
          </span>
        </div>

        {/* Booking ID */}
        <div className="bg-gray-50 rounded-xl px-4 py-3 flex items-center justify-between">
          <span className="text-sm text-gray-500">Mã đặt sân</span>
          <span className="font-mono font-bold text-gray-800 text-sm">
            #{String(booking.booking_id).padStart(6, "0")}
          </span>
        </div>

        <div className="space-y-3 text-sm">
          <DetailRow label="Sân" value={booking.court_name || "—"} />
          <DetailRow label="Ngày" value={formatDate(booking.booking_date)} />
          <DetailRow
            label="Thời gian"
            value={`${formatTime(booking.start_time)} – ${formatTime(booking.end_time)}`}
          />
          <DetailRow
            label="Thanh toán"
            value={PAYMENT_LABELS[booking.payment?.payment_method] || "—"}
          />
          <div className="h-px bg-gray-100" />
          <div className="flex justify-between font-bold text-base">
            <span className="text-gray-800">Tổng tiền</span>
            <span className="text-orange-600">{formatCurrency(total)}</span>
          </div>
        </div>
      </div>

      {/* Reminder */}
      <div className="mt-4 bg-amber-50 border border-amber-100 rounded-2xl p-4 flex gap-3">
        <span className="text-2xl">⏰</span>
        <div className="text-sm text-amber-800">
          <p className="font-semibold mb-1">Nhắc nhở quan trọng</p>
          <ul className="space-y-1 text-amber-700 text-xs">
            <li>• Vui lòng đến sân trước 10 phút</li>
            <li>• Mang theo mã đặt sân khi check-in</li>
            <li>• Hủy miễn phí trước 24h so với giờ đặt</li>
          </ul>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-5 space-y-3">
        <button
          onClick={() => navigate(`/bookings/${booking.booking_id}`)}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-2xl transition-colors shadow-lg shadow-orange-200"
        >
          Xem chi tiết đặt sân
        </button>
        <button
          onClick={() => navigate("/")}
          className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-4 rounded-2xl border border-gray-200 transition-colors"
        >
          Về trang chủ
        </button>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-800 text-right">{value}</span>
    </div>
  );
}
