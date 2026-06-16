import './HomeProduct.css';
import { getProducts } from '../../services/productApi';
import { getBanners } from '../../services/bannerApi';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function HomeProduct() {
    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentBannerIndex, setcurrentBannerIndex] = useState(0);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const productsData = await getProducts();
            setProducts(productsData);
        } catch (err) {
            setError(err.message || 'Lỗi khi tải sản phẩm');
        } finally {
            setLoading(false);
        }
    };

    const fetchBanners = async () => {
        try {
            const bannersData = await getBanners();
            setBanners(bannersData);
        } catch (error) {
            setError(error.message || 'Lỗi khi tải banner');
        }finally {
            setLoading(false);
        }
    };

    const bannerImage = banners?.[currentBannerIndex]?.image_url
  || 'https://via.placeholder.com/1200x400?text=No+Banner';

    const heroStyle = {
        backgroundImage: `url(${bannerImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
    };

    // Giả sử có 3 cái banner tôi muốn nó chuyển sang banner khác sau mỗi 5s và có hiệu ưng chuyển tiếp mượt mà
    useEffect(() => {
        if (banners.length < 2) return;

        const interval = setInterval(() => {
            setcurrentBannerIndex(prevIndex => (prevIndex + 1) % banners.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [banners.length]);

    useEffect(() => {
        fetchProducts();
        fetchBanners();
    }, []);

    useEffect(() => {
        console.log('banners', banners);
        console.log('currentBannerIndex', currentBannerIndex, banners[currentBannerIndex]);
    }, [banners, currentBannerIndex]);

    const toggleIntro = () => { 
    const content = document.getElementById('introContent');
    const btn = document.getElementById('btnViewMore');
    if (content.classList.contains('expanded')) {
      content.classList.remove('expanded');
      btn.innerText = 'XEM THÊM';
      window.scrollTo({ top: content.offsetTop - 100, behavior: 'smooth' });
    } else {
      content.classList.add('expanded');
      btn.innerText = 'THU GỌN';
    }
  };

    return (
        <>
              {/* Hero Section */}
      <section className="hero" style={heroStyle} >

        <div className="hero-content">
          <p>BỘ SƯU TẬP MỚI</p>
          <h1>SỰ TỐI GIẢN <br /> LÀ ĐỈNH CAO CỦA TINH TẾ</h1>
          <a href="" className="btn-primary">Xem bộ sưu tập</a>
          <Link to="/product/1" className="btn-primary" style={{ marginLeft: '12px', background: '#ea580c' }}>Xem chi tiết sân bóng rổ</Link>
        </div>
      </section>

      {/* Product Section */}
      <section className="container">
        <div className="section-title">
          <h2>SẢN PHẨM NỔI BẬT</h2>
          <Link to="/productlist">Xem tất cả sản phẩm</Link>    
        </div>

        {loading && <p style={{ textAlign: 'center', padding: '20px' }}>Đang tải danh sách sản phẩm...</p>}
        {error && <p style={{ textAlign: 'center', padding: '20px', color: 'red' }}>Không thể tải sản phẩm. Vui lòng kiểm tra kết nối và thử lại.</p>}

        {!loading && !error && (
          <div className="product-grid">
            {products.length > 0 ? (
              products.map(item => (
                <div key={item.id} className="product-card">
                  <div className="product-image">
                    <img 
                      src={item.thumbnail || 'https://via.placeholder.com/300x250?text=No+Image'} 
                      alt={item.product_name}
                      />
                    <div className="quick-add">Thêm vào giỏ hàng</div>
                  </div>
                  <div className="product-info">  
                    <h3>{item.product_name || item.description}</h3>            
                    <p className='price'><span style={{fontSize: '10px', textDecoration: 'line-through', color: 'gray' }}>{Number(item.price).toLocaleString('vi-VN')}đ</span>  {Number(item.sale_price).toLocaleString('vi-VN')}đ</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center', padding: '20px' }}>Sản phẩm nổi bật sẽ được cập nhật sớm. Vui lòng quay lại sau.</p>
            )}
          </div>
        )}  

      </section>

      {/* Intro Section */}
      <section className="container intro-section">
        <p className="sub-title">Giới thiệu</p>
        <h2 className="intro-headline">VỀ AEMEATH - THƯƠNG HIỆU THỜI TRANG NAM</h2>

        <div className="intro-content" id="introContent">
          <p>Aemeath là thương hiệu thời trang nam cao cấp, chuyên cung cấp các sản phẩm veston, áo sơ mi, quần âu và phụ kiện chất lượng. Chúng tôi cam kết mang đến cho quý khách hàng những sản phẩm thời trang tinh tế, bền vững và phù hợp với mọi dịp.</p>
          <p>Với đội ngũ thiết kế chuyên nghiệp và quy trình sản xuất hiện đại, Aemeath luôn cập nhật những xu hướng thời trang mới nhất, kết hợp hài hòa giữa phong cách cổ điển và hiện đại. Mỗi sản phẩm đều được chăm chút tỉ mỉ từ chất liệu đến đường kim mũi chỉ.</p>
          <p>Khách hàng là trọng tâm của chúng tôi. Aemeath cung cấp dịch vụ tư vấn chuyên nghiệp, giao hàng tận nơi và chính sách đổi trả linh hoạt để đảm bảo sự hài lòng tối đa.</p>
        </div>

        <div className="text-center">
          <button className="btn-secondary" id="btnViewMore" onClick={toggleIntro}>XEM THÊM</button>
        </div>
      </section>

      {/* Brand Banner */}
      <section className="brand-banner">
        <div className="banner-overlay">
          <h2>AEMEATH - THƯƠNG HIỆU THỜI TRANG CAO CẤP</h2>
        </div>
      </section>
        </>
    );
}

export default HomeProduct;