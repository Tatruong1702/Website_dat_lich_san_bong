import { Link } from 'react-router-dom';
import './ProductDetail.css';
import LeftColumn from './component/LeftColumn';
import BookingSidebar from './component/BookingSidebar';

function ProductDetail() {
  return (
    <>
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <Link to="/">Trang chủ</Link> / <Link to="/productlist">Sân bóng rổ</Link>
      </div>

      <div className="container">
        <LeftColumn />
        <BookingSidebar />
      </div>
    </>
  );
}

export default ProductDetail;