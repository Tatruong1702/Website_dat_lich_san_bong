import './ProductList.css';
import { getProducts } from '../../services/productApi';
import { useState, useEffect } from 'react';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await getProducts();
                setProducts(data || []);
            } catch (err) {
                setError(err?.message || 'Không thể tải sản phẩm.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <main className="container plp-container">
            <aside className="filters">
                <div className="filter-group">
                    <h4>Loại sân</h4>
                    <ul>
                        <li>
                            <input type="checkbox" id="cat1" />
                            <label htmlFor="cat1">Tất cả</label>
                        </li>
                        <li>
                            <input type="checkbox" id="cat2" />
                            <label htmlFor="cat2">Sân 3x3</label>
                        </li>
                        <li>
                            <input type="checkbox" id="cat3" />
                            <label htmlFor="cat3">Sân 5x5</label>
                        </li>
                        <li>
                            <input type="checkbox" id="cat4" />
                            <label htmlFor="cat4">Sân tiêu chuẩn</label>
                        </li>
                    </ul>
                </div>

                <div className="filter-group">
                    <h4>Vị trí</h4>
                    <ul>
                        <li>
                            <input type="checkbox" id="loc1" />
                            <label htmlFor="loc1">Trong nhà</label>
                        </li>
                        <li>
                            <input type="checkbox" id="loc2" />
                            <label htmlFor="loc2">Ngoài trời</label>
                        </li>
                        <li>
                            <input type="checkbox" id="loc3" />
                            <label htmlFor="loc3">Cả hai</label>
                        </li>
                    </ul>
                </div>

                <div className="filter-group">
                    <h4>Khoảng giá (1 giờ)</h4>
                    <input type="range" min="0" max="5000000" className="price-slider" />
                    <div className="price-labels">
                        <span>0đ</span>
                        <span>5 triệu+</span>
                    </div>
                </div>
            </aside>

            <section className="products-section">
                <div className="products-header">
                    <h1>Danh sách sản phẩm</h1>
                    <select className="sort-select">
                        <option>Sắp xếp theo: Mới nhất</option>
                        <option>Giá: Thấp đến cao</option>
                        <option>Giá: Cao đến thấp</option>
                    </select>
                </div>

                {loading && <p className="loading">Đang tải danh sách sản phẩm...</p>}
                {error && <p className="error">Không thể tải sản phẩm. Vui lòng kiểm tra kết nối và thử lại.</p>}

                <div className="product-grid">
                    {!loading && !error && products.length === 0 && (
                        <p>Không tìm thấy sản phẩm nào phù hợp. Hãy thử điều chỉnh bộ lọc hoặc xem tất cả sản phẩm.</p>
                    )}

                    {!loading && !error && products.map((product) => (
                        <div className="product-card" key={product._id || product.id}>
                            <div className="product-image">
                                <img src={product.thumbnail || product.image || product.img || 'https://via.placeholder.com/500'} alt={product.product_name || product.name || product.title || 'Sản phẩm'} />
                                <div className="quick-add">Thêm vào giỏ hàng</div>
                            </div>
                            <div className="product-info">
                                <h3>{product.product_name || product.name || product.title || 'Sản phẩm'}</h3>
                                <p className="price">
                                    {product.sale_price ? (
                                        <>
                                            <span className="original-price">{Number(product.price).toLocaleString('vi-VN')}đ</span>
                                            {Number(product.sale_price).toLocaleString('vi-VN')}đ
                                        </>
                                    ) : (
                                        Number(product.price).toLocaleString('vi-VN') + 'đ'
                                    )}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
}

export default ProductList;