import React from "react";
import { Link } from "react-router-dom";
import "./HomeProduct.css";


const HomeProduct =()=>{
  const fields = [
    {
      id : 1,
      name : "Sân Mỹ Đình Arena",
      location : "Nam Từ Liêm, Hà Nội",
      price : "200.000đ/giờ",
      image : "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800"
    },

    {
      id : 2,
      name : "Sân Hoàng Mai Football",
      location : "Hoàng Mai, Hà Nội",
      price : "300.000đ/giờ",
      image : "https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=800"
    },

    {
      id : 3,
      name : "Sân Thanh Xuân Sport",
      location : "Thanh Xuân, Hà Nội",
      price : "250.000đ/giờ",
      image : "//images.unsplash.com/photo-1486286701208-1d58e9338013?w=800"
    },

    
  ];

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-overlay">
          <h1>
          HỆ THỐNG HỖ TRỢ TÌM KIẾM SÂN BÓNG NHANH
          </h1>
          <p> Đặt sân dễ dàng - Thanh toán tiện lợi - Hỗ trợ khách hàng 24/7</p>

          <div className="hero-search">
            <select >
              <option >Loại sân</option>
              <option >Sân 5 người</option>

              <option >Sân 7 người</option>

              <option >Sân 9 người</option>

            </select>

              <input type="text" placeholder="Nhập địa điểm hoặc tên sân" />

              <input type="text" placeholder="Nhập khu vực" />
              
              <button>Tìm Kiếm</button>


          </div>
        </div>

      </section>

      <section className="feature-section">

        <div className="feature-card">
          <div className="icon">📍</div>
          <h3>Tìm kiếm vị trí sân </h3>
          <p>Dễ dàng tìm kiếm sân bóng gần bạn theo khu vực.</p>
        </div>

        <div className="feature-card">
          <div className="icon">📅</div>
          <h3>Đặt lịch online </h3>
          <p>Đặt sân nhanh chóng mọi lúc mọi nơi.</p>
        </div>


        <div className="feature-card">
          <div className="icon">⚽</div>
          <h3>Tìm đối thủ </h3>
          <p>Kết nối cộng đồng bóng đá và giao lưu thi đấu.</p>
        </div>

      </section>

      


      <section className="featured-section">
        <h2>SÂN BÓNG NỔI BẬT</h2>

        <div className="field-grid">
          {fields.map((field) => (
            <div className="field-card" key={field.id}>
              <img src={field.image} alt={field.name} />
              

              <div className="field-content">
                <h3>{field.name}</h3>
                <p>{field.location}</p>
                <p className="price">{field.price}</p>

                <Link to={`/product/${field.id}`} className="booking-btn"  >Xem Chi Tiết & Đặt Sân</Link>
              </div>

            </div>
          ))}
        </div>
      </section>




      <section className="cta-section">
        <div className="cta-content">
          <h2>
          Bạn muốn đăng ký sử dụng phần mềm quản lý sân miễn phí?

          </h2>

          <div className="cta-form">
            <input placeholder="Họ và tên" />
            <input placeholder="Số điện thoại" />
            <input placeholder="Email" />

            <button>Gửi</button>
          </div>
        </div>
      </section>







    </div>
  );
};

export default HomeProduct;