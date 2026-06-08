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
                    <h4>Danh mục sản phẩm</h4>
                    <ul>
                        <li>
                            <input type="checkbox" id="cat1" />
                            <label htmlFor="cat1">Tất cả</label>
                        </li>
                        <li>
                            <input type="checkbox" id="cat2" />
                            <label htmlFor="cat2">Áo sơ mi</label>
                        </li>
                        <li>
                            <input type="checkbox" id="cat3" />
                            <label htmlFor="cat3">Quần & Shorts</label>
                        </li>
                        <li>
                            <input type="checkbox" id="cat4" />
                            <label htmlFor="cat4">Áo khoác</label>
                        </li>
                    </ul>
                </div>

                <div className="filter-group">
                    <h4>Kích cỡ</h4>
                    <div className="size-grid">
                        <button type="button">S</button>
                        <button type="button">M</button>
                        <button type="button">L</button>
                        <button type="button">XL</button>
                    </div>
                </div>

                <div className="filter-group">
                    <h4>Khoảng giá</h4>
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