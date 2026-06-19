import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../ProductDetail.css';

const PRICE_PER_HOUR = 300000;
const SERVICE_FEE = 10000;

const TIME_SLOTS = [
  '06:00', '07:00', '08:00', '09:00', '10:00', '11:00',
  '17:00', '18:00', '19:00',
];

const DISABLED_SLOTS = ['10:00', '18:00'];
const QUANTITY_OPTIONS = [1, 2, 3];

function BookingSidebar() {
  const navigate = useNavigate();

  const [date, setDate] = useState('2026-06-12');
  const [selectedSlot, setSelectedSlot] = useState('08:00');
  const [quantity, setQuantity] = useState(1);

  const total = PRICE_PER_HOUR * quantity + SERVICE_FEE;

  const handleBook = () => {
    navigate("/checkout", {
      state: {
        date,
        slot: selectedSlot,
        quantity,
        pricePerHour: PRICE_PER_HOUR,
        serviceFee: SERVICE_FEE,
        total
      }
    });
  };

  return (
    <div className="booking-card">
      <div className="price">
        {PRICE_PER_HOUR.toLocaleString('vi-VN')}đ <span>/ giờ</span>
      </div>

      <div className="form-group">
        <label>Chọn ngày</label>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="form-group">
        <label>Chọn giờ chơi</label>
        <div className="slots">
          {TIME_SLOTS.map((slot) => {
            const isDisabled = DISABLED_SLOTS.includes(slot);
            const isSelected = slot === selectedSlot;

            return (
              <div
                key={slot}
                className={`slot ${isDisabled ? 'disabled' : ''} ${isSelected ? 'selected' : ''}`}
                onClick={() => !isDisabled && setSelectedSlot(slot)}
              >
                {slot}
              </div>
            );
          })}
        </div>
      </div>

      <div className="form-group">
        <label>Số lượng giờ</label>
        <select value={quantity} onChange={(e) => setQuantity(Number(e.target.value))}>
          {QUANTITY_OPTIONS.map((q) => (
            <option key={q} value={q}>
              {q} giờ
            </option>
          ))}
        </select>
      </div>

      <div className="summary-row">
        <span>Giá sân ({quantity} giờ)</span>
        <span>{(PRICE_PER_HOUR * quantity).toLocaleString('vi-VN')}đ</span>
      </div>
      <div className="summary-row">
        <span>Phí dịch vụ</span>
        <span>{SERVICE_FEE.toLocaleString('vi-VN')}đ</span>
      </div>
      <div className="summary-total">
        <span>Tổng cộng</span>
        <span>{total.toLocaleString('vi-VN')}đ</span>
      </div>

      <button className="book-btn" onClick={handleBook}>
        Đặt sân ngay
      </button>

      <div className="note">Bạn sẽ không bị trừ tiền ở bước này</div>
    </div>
  );
}

export default BookingSidebar;