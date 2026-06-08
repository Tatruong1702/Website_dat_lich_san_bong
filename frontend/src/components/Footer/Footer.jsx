import './Footer.css';

function Footer() {
    return (
        <>
              {/* Footer */}
      <footer className="footer-links container">
        <div className="footer-column">
          <h4>CHƯƠNG TRÌNH & CHÍNH SÁCH</h4>
          <ul>
            <li><a href="#">Hướng dẫn thanh toán</a></li>
            <li><a href="#">Chính sách bảo mật</a></li>
            <li><a href="#">Chính sách đổi trả</a></li>
            <li><a href="#">Chính sách kiểm hàng</a></li>
            <li><a href="#">Chính sách vận chuyển</a></li>
          </ul>
        </div>
        <div className="footer-column">
          <h4>VỀ AEMEATH</h4>
          <ul>
            <li><a href="#">Giới thiệu</a></li>
            <li><a href="#">Liên hệ</a></li>
            <li><a href="#">Tuyển dụng</a></li>
          </ul>
        </div>
      </footer>
        </>
    );
}

export default Footer;
