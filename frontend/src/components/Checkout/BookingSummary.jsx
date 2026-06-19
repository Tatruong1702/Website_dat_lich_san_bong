import { formatCurrency, formatDate, formatTime } from "../../utils/format";

export default function BookingSummary({ bookingData }) {
  const {
    courtName,
    venueName,
    venueAddress,
    courtImage,
    bookingDate,
    startTime,
    endTime,
    durationHours,
    pricePerHour,
    totalPrice,
  } = bookingData;

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
      {/* Court image */}
      <div className="relative h-36">
        <img
          src={courtImage || "/images/court-placeholder.jpg"}
          alt={courtName}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-3 left-4 right-4 text-white">
          <h2 className="font-bold text-base leading-tight">{courtName}</h2>
          <p className="text-xs opacity-85 mt-0.5">{venueName}</p>
        </div>
      </div>

      <div className="p-5 space-y-4">
        {/* Location */}
        <div className="flex items-start gap-3 pb-4 border-b border-gray-100">
          <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
            <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">Địa chỉ</p>
            <p className="text-sm text-gray-700 mt-0.5">{venueAddress || "Chưa cập nhật địa chỉ"}</p>
          </div>
        </div>

        {/* Date & time */}
        <div className="grid grid-cols-2 gap-3">
          <InfoBlock
            icon={
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            }
            label="Ngày đặt"
            value={formatDate(bookingDate)}
          />
          <InfoBlock
            icon={
              <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            label="Thời gian"
            value={`${formatTime(startTime)} – ${formatTime(endTime)}`}
          />
        </div>

        {/* Duration + price breakdown */}
        <div className="bg-orange-50 rounded-xl p-4 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Thời lượng</span>
            <span className="font-medium text-gray-800">{durationHours} giờ</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Đơn giá</span>
            <span className="font-medium text-gray-800">{formatCurrency(pricePerHour)}/giờ</span>
          </div>
          <div className="h-px bg-orange-100 my-1" />
          <div className="flex justify-between text-sm font-bold">
            <span className="text-gray-800">Tổng tiền</span>
            <span className="text-orange-600 text-base">{formatCurrency(totalPrice)}</span>
          </div>
        </div>

        {/* Note */}
        <div className="flex items-start gap-2 text-xs text-gray-400">
          <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>Chính sách hủy: Có thể hủy miễn phí trước 24h. Hủy muộn hơn sẽ bị tính 50% phí.</span>
        </div>
      </div>
    </div>
  );
}

function InfoBlock({ icon, label, value }) {
  return (
    <div className="flex items-start gap-2.5">
      <div className="w-8 h-8 rounded-xl bg-orange-50 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wide">{label}</p>
        <p className="text-sm text-gray-800 font-medium mt-0.5">{value}</p>
      </div>
    </div>
  );
}
