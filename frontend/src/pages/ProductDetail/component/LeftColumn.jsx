import '../ProductDetail.css';

const COURT_DATA = {
  title: 'Sân bóng rổ Sky Court',
  location: '123 Đường Nguyễn Văn Linh, Hà Nội',
  rating: 4.8,
  totalReviews: 126,
  description:
    'Sân bóng rổ được xây dựng theo tiêu chuẩn quốc tế với mặt sân gỗ chống trơn, khung rổ điều chỉnh độ cao và hệ thống chiếu sáng hiện đại. Phù hợp cho cả luyện tập cá nhân, thi đấu đội nhóm và tổ chức các giải phong trào.',
  badges: [
    { icon: 'ti-ruler-2', label: 'Sân tiêu chuẩn FIBA' },
    { icon: 'ti-sun', label: 'Trong nhà - có mái che' },
    { icon: 'ti-bulb', label: 'Đèn chiếu sáng ban đêm' },
    { icon: 'ti-car', label: 'Bãi đỗ xe miễn phí' },
  ],
  amenities: [
    { icon: 'ti-badge-wc', label: 'Phòng tắm & thay đồ' },
    { icon: 'ti-bottle', label: 'Khu vực nghỉ & nước uống' },
    { icon: 'ti-temperature', label: 'Hệ thống điều hòa' },
    { icon: 'ti-wifi', label: 'Wifi miễn phí' },
    { icon: 'ti-shopping-cart', label: 'Cho thuê bóng & áo' },
    { icon: 'ti-medical-cross', label: 'Tủ y tế cơ bản' },
  ],
  reviews: [
    {
      initials: 'MH',
      name: 'Minh Hoàng',
      date: '2 ngày trước',
      stars: '★★★★★',
      text: 'Sân đẹp, sạch sẽ, mặt sân không bị trơn. Sẽ quay lại lần sau.',
    },
    {
      initials: 'TL',
      name: 'Thu Linh',
      date: '1 tuần trước',
      stars: '★★★★☆',
      text: 'Đèn sáng tốt, có chỗ đậu xe rộng. Giá hợp lý cho khu vực này.',
    },
  ],
};

const GALLERY_IMAGES = [
  'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800',
  'https://images.unsplash.com/photo-1519861531473-9200262188bf?w=400',
  'https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?w=400',
];

function LeftColumn() {
  return (
    <div>
      {/* Gallery */}
      <div className="gallery">
        <img src={GALLERY_IMAGES[0]} alt="Sân bóng rổ" />
        <div className="side">
          <img src={GALLERY_IMAGES[1]} alt="Sân bóng rổ 2" />
          <div className="gallery-more">
            <img src={GALLERY_IMAGES[2]} alt="Sân bóng rổ 3" />
          </div>
        </div>
      </div>

      {/* Info Card */}
      <div className="info-card">
        {/* Title & Rating */}
        <div className="title-row">
          <div>
            <div className="court-title">{COURT_DATA.title}</div>
            <div className="location">
              <i className="ti ti-map-pin"></i> {COURT_DATA.location}
            </div>
          </div>
          <div className="rating">
            <i className="ti ti-star-filled"></i> {COURT_DATA.rating} ({COURT_DATA.totalReviews} đánh giá)
          </div>
        </div>

        {/* Badges */}
        <div className="badges">
          {COURT_DATA.badges.map((badge, idx) => (
            <div key={idx} className="badge">
              <i className={`ti ${badge.icon}`}></i> {badge.label}
            </div>
          ))}
        </div>

        {/* Description */}
        <div className="section">
          <h2>Giới thiệu</h2>
          <p className="desc">{COURT_DATA.description}</p>
        </div>

        {/* Amenities */}
        <div className="section">
          <h2>Tiện ích</h2>
          <div className="amenities-grid">
            {COURT_DATA.amenities.map((amenity, idx) => (
              <div key={idx} className="amenity">
                <span className="amenity-icon">
                  <i className={`ti ${amenity.icon}`}></i>
                </span>
                {amenity.label}
              </div>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="section">
          <h2>Vị trí</h2>
          <div className="map-box">
            <i className="ti ti-map"></i> Bản đồ vị trí sân
          </div>
        </div>

        {/* Reviews */}
        <div className="section">
          <h2>Đánh giá từ người chơi</h2>
          {COURT_DATA.reviews.map((review, idx) => (
            <div key={idx} className="review">
              <div className="review-head">
                <div className="avatar">{review.initials}</div>
                <div>
                  <div className="review-name">{review.name}</div>
                  <div className="review-date">{review.date}</div>
                </div>
              </div>
              <div className="review-stars">{review.stars}</div>
              <div className="review-text">{review.text}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LeftColumn;