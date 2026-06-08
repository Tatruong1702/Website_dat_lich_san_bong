import './Header.css';

function Header() {
  return (
    <>
    {/* Header */}  
      <header className="header">
        <div className="logo">Aemeath</div>
        <nav className="nav">
          <a href="#">Nam</a>
          <a href="#">Nữ</a>
          <a href="#">Phụ kiện</a>
          <a href="#">Bộ sưu tập</a>
        </nav>
        <div className="header-icons">
          <a href="#">Tìm kiếm</a>
          <a href="#">Giỏ hàng (0)</a>
        </div>
      </header>
      </>
  );
}

export default Header;