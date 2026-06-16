import React from 'react';
import './FieldList.css';

const mockFields = [
  { id: 1, name: "Sân Bóng Đá Đại Học FPT", address: "Khu công nghệ cao Hòa Lạc, Hà Nội", price: "300.000đ - 500.000đ", type: "7", rating: 4.8, image: "https://picsum.photos/400/300" },
  { id: 2, name: "Sân Cỏ Nhân Tạo Mỹ Đình", address: "Lê Đức Thọ, Mỹ Đình, Nam Từ Liêm", price: "400.000đ - 600.000đ", type: "11", rating: 4.5, image: "https://picsum.photos/400/300" },
  { id: 3, name: "Sân Bóng Chuyên Việt", address: "Số 2 Phạm Văn Đồng, Cầu Giấy", price: "250.000đ - 400.000đ", type: "5", rating: 4.2, image: "https://picsum.photos/400/300" },
  { id: 4, name: "Sân Bóng Tuyên Sơn", address: "Đường trục chính, Quận Đống Đa", price: "300.000đ - 450.000đ", type: "7", rating: 4.6, image: "https://picsum.photos/400/300" },
];

export default function FieldList() {
  return (
    <div className="field-container">
      
      <div className="filter-bar">
        <div className="filter-wrapper">
          <h1 className="filter-title">Danh Sách Sân Bóng Đá</h1>
          
          <div className="filter-grid">
            <input type="text" placeholder="Tìm kiếm tên sân..." className="filter-input" />
            <select className="filter-select">
              <option value="">Chọn Quận/Huyện</option>
              <option value="cau-giay">Cầu Giấy</option>
              <option value="nam-tu-liem">Nam Từ Liêm</option>
            </select>
            <select className="filter-select">
              <option value="">Chọn Loại Sân</option>
              <option value="5">Sân 5 người</option>
              <option value="7">Sân 7 người</option>
              <option value="11">Sân 11 người</option>
            </select>
            <button className="filter-button">Tìm Kiếm Ngay</button>
          </div>
        </div>
      </div>

      {/* 2. DANH SÁCH SÂN BÓNG */}
      <div className="content-wrapper">
        <p className="result-count">
          Tìm thấy <span className="result-count-bold">{mockFields.length}</span> sân bóng phù hợp
        </p>
        
        <div className="field-grid">
          {mockFields.map((field) => (
            <div key={field.id} className="field-card">
              
              <div className="card-image-box">
                <img src={field.image} alt={field.name} className="card-image" />
                <span className="card-tag">Sân {field.type} người</span>
              </div>

              <div className="card-info">
                <div>
                  <h3 className="field-name">{field.name}</h3>
                  <p className="field-address">📍 {field.address}</p>
                </div>

                <div className="card-meta">
                  <span className="field-rating">⭐ {field.rating}</span>
                  <span className="field-price">{field.price}</span>
                </div>

                <button className="btn-detail">Xem chi tiết & Đặt sân</button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 3. PHÂN TRANG */}
      <div className="pagination">
        <button className="btn-page" disabled>Trước</button>
        <button className="btn-page active">1</button>
        <button className="btn-page">2</button>
        <button className="btn-page">Tiếp</button>
      </div>

    </div>
  );
}