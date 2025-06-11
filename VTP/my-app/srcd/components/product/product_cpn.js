import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/product.css';
import AuthUser from '../../models/authUser'; // Giả sử bạn có file AuthUser để lấy userId

function Product_cpn() {
    const { selectedCategory, selectedClassify } = useParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visibleProducts, setVisibleProducts] = useState(9);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
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
            }
        };
        fetchProduct();
    }, [selectedCategory, selectedClassify]);

    const handleViewMore = () => {
        setVisibleProducts(prev => prev + 6);
    };

    // Hàm thêm vào giỏ hàng (giữ nguyên)
    const handleAddToCart = (productId) => {
        setLoading(true);
        sessionStorage.setItem('cart', productId);
        navigate('/cart');
    };

    // Hàm thêm vào danh sách yêu thích
    const handleAddToFavorites = async (productId) => {
        setLoading(true);
        try {
            const userId = AuthUser.getIdUser(); // Lấy ID người dùng từ AuthUser
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
                alert(data.message); // Hiển thị thông báo thành công
            } else {
                alert(data.message); // Hiển thị thông báo lỗi (ví dụ: sản phẩm đã có trong danh sách)
            }
        } catch (error) {
            console.error('Lỗi khi thêm vào danh sách yêu thích:', error);
            alert('Lỗi kết nối server');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <div className="product">
            {products.length === 0 && <p>No products found for this classify.</p>}
            {products.slice(0, visibleProducts).map((product) => (
                <div className="product-item" key={product.id_product}>
                    <div>
                        {product.image_product && <img className="product_img" src={product.image_product} alt={product.name_product} />}
                    </div>
                    <div className="product-details">
                        <p className="product-name">{product.name_product}</p>
                        <p className="product-description">{product.description}</p>
                        <p className="product-price">Price: {product.price}</p>
                        <div className="product-reviews">
                            <span className="product-review-stars">★★★★★</span>
                            <span className="product-review-count">(4 reviews)</span>
                        </div>
                        <div className="product-buttons">
                            <button className="product-button_1">Quick View</button>
                            <button 
                                className="product-button_2" 
                                onClick={() => handleAddToCart(product.id_product)}
                            >
                                Add to Cart
                            </button>
                            <button 
                                className="product-button_3" 
                                onClick={() => handleAddToFavorites(product.id_product)} // Sửa để gọi hàm handleAddToFavorites
                            >
                                Add to Favorites
                            </button>
                        </div>
                    </div>
                </div>
            ))}
            {visibleProducts < products.length && (
                <div className="view-more-container">
                    <button onClick={handleViewMore} className="view-more-button">View More</button>
                </div>
            )}
        </div>
    );
}

export default Product_cpn;