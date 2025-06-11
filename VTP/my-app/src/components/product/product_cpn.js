import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/product.css';
import AuthUser from '../../models/authUser';
import { Link } from 'react-router-dom';

function Product_cpn() {
    const { selectedCategory, selectedClassify } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleProducts, setVisibleProducts] = useState(9);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:5000/category/${selectedCategory}/classify/${selectedClassify}/product`
                );
                const data = await response.json();
                if (Array.isArray(data) && data.length > 0) {
                    setProducts(data);
                } else {
                    setProducts([]);
                }
            } catch (error) {
                console.error("Error fetching classify data:", error);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [selectedCategory, selectedClassify]);

    const handleAddToFavorites = async (productId, e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan truyền lên Link
        setLoading(true);
        try {
            const userId = AuthUser.getIdUser();
            if (!userId) {
                alert('Vui lòng đăng nhập để thêm sản phẩm vào danh sách yêu thích');
                navigate('/login');
                return;
            }

            const response = await fetch('http://localhost:5000/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ userId, productId }),
            });

            const data = await response.json();
            if (response.ok) {
                alert(data.message);
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
            alert('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = (productId, e) => {
        e.stopPropagation(); // Ngăn sự kiện click lan truyền lên Link
        setLoading(true);
        try {
            // Lấy danh sách sản phẩm trong giỏ hàng từ sessionStorage
            const cart = JSON.parse(sessionStorage.getItem('cart') || '[]');
            // Thêm sản phẩm mới nếu chưa có
            if (!cart.includes(productId)) {
                cart.push(productId);
                sessionStorage.setItem('cart', JSON.stringify(cart));
            }
            navigate('/cart');
        } catch (error) {
            console.error('Lỗi khi thêm vào giỏ hàng:', error);
            alert('Lỗi khi thêm sản phẩm vào giỏ hàng');
        } finally {
            setLoading(false);
        }
    };

    const handleViewMore = () => {
        setVisibleProducts(prev => prev + 6);
    };

    if (loading) {
        return (
            <div className="loading">
                <h3>Đang tải sản phẩm...</h3>
            </div>
        );
    }

    return (
        <div className="product">
            {products.length === 0 ? (
                <div className="no-products">
                    <p>Không tìm thấy sản phẩm nào cho danh mục này.</p>
                    <button onClick={() => navigate(-1)}>Quay lại</button>
                </div>
            ) : (
                <>
                    {products.slice(0, visibleProducts).map((product) => (
                        <div className="product-item" key={product.id_product}>
                            <Link
                                style={{ textDecoration: 'none' }}
                                to={`/category/${selectedCategory}/classify/${selectedClassify}/product/${product.id_product}`}
                            >
                                <div>
                                    {product.image_product ? (
                                        <img
                                            className="product_img"
                                            src={product.image_product}
                                            alt={product.name_product}
                                        />
                                    ) : (
                                        <div className="no-image">Không có hình ảnh</div>
                                    )}
                                </div>
                                <div className="product-details">
                                    <p className="product-name">{product.name_product || 'Không có tên'}</p>
                                    <p className="product-description">{product.description || 'Không có mô tả'}</p>
                                    <p className="product-price">
                                        Giá: {product.price ? product.price.toLocaleString('vi-VN') + ' VND' : 'Liên hệ'}
                                    </p>
                                    <div className="product-reviews">
                                        <span className="product-review-stars">★★★★★</span>
                                        <span className="product-review-count">(4 Đánh giá)</span>
                                    </div>
                                </div>
                            </Link>
                            <div className="product-buttons">
                                <button
                                    className="product-button_2"
                                    onClick={(e) => handleAddToCart(product.id_product, e)}
                                    disabled={loading}
                                >
                                    Thêm giỏ hàng
                                </button>
                                <button
                                    className="product-button_3"
                                    onClick={(e) => handleAddToFavorites(product.id_product, e)}
                                    disabled={loading}
                                >
                                    Thêm vào yêu thích
                                </button>
                            </div>
                        </div>
                    ))}
                    {visibleProducts < products.length && (
                        <div className="view-more-container">
                            <button onClick={handleViewMore} className="view-more-button">
                                Xem thêm
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Product_cpn;