import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import AuthUser from "../../models/authUser";

export default function Favorites() {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const token = AuthUser.getToken();
    const userId = AuthUser.getIdUser();

    useEffect(() => {
        if (!token || !AuthUser.isAuthenticated() || !userId) {
            setError('Vui lòng đăng nhập để xem danh sách yêu thích');
            setTimeout(() => navigate('/login'), 2000);
            return;
        }

        const fetchFavorites = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/favorites/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Không thể tải danh sách yêu thích');
                }
                const data = await response.json();
                setFavorites(Array.isArray(data) ? data : []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [token, userId, navigate]);

    const handleRemoveItem = async (itemId) => {
        if (!token || !userId) {
            setError('Vui lòng đăng nhập để thực hiện thao tác này');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/favorites/${userId}/${itemId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Không thể xóa sản phẩm');
            }
            setFavorites(favorites.filter(item => item.id_product !== itemId));
        } catch (err) {
            setError(err.message || 'Lỗi khi xóa sản phẩm');
        }
    };

    const handleAddToCart = async (product) => {
        if (!token || !userId) {
            setError('Vui lòng đăng nhập để thêm vào giỏ hàng');
            return;
        }

        try {
            const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
            const productExists = savedCart.findIndex(item => item.id_product === product.id_product);

            let updatedCart;
            if (productExists >= 0) {
                updatedCart = savedCart.map(item =>
                    item.id_product === product.id_product
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                updatedCart = [...savedCart, { ...product, quantity: 1 }];
            }

            localStorage.setItem('cartItems', JSON.stringify(updatedCart));
            alert(`${product.name_product} đã được thêm vào giỏ hàng!`);
        } catch (err) {
            setError(err.message || 'Lỗi khi thêm vào giỏ hàng');
        }
    };

    if (!token || !AuthUser.isAuthenticated()) {
        return (
            <div className="favorites-container">
                <p className="auth-message">Vui lòng đăng nhập để xem danh sách yêu thích.</p>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Đăng nhập
                </button>
            </div>
        );
    }

    if (loading) {
        return <div className="loading-text">Đang tải danh sách yêu thích...</div>;
    }

    if (error) {
        return (
            <div className="favorites-container">
                <div className="error-text">{error}</div>
                <button className="btn btn-primary" onClick={() => { setError(null); navigate('/'); }}>
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .favorites-container {
                    padding: 40px 20px;
                    min-height: 100vh;
                    width: 100vw;
                    background: linear-gradient(135deg, rgb(0, 57, 131) 0%, rgb(4, 84, 255) 100%); /* Gradient pastel xanh nhạt - hồng phấn */
                    box-shadow: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .favorites-title {
                    text-align: center;
                    color: rgb(255, 255, 255); /* Màu trắng để nổi bật trên nền gradient */
                    font-size: 2.5rem;
                    margin-bottom: 30px;
                    font-family: 'Arial', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .favorites-table {
                    width: 100%;
                    max-width: 1200px;
                    border-collapse: collapse;
                    background: #fff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .favorites-table th,
                .favorites-table td {
                    padding: 15px;
                    text-align: left;
                    font-family: 'Arial', sans-serif;
                }

                .favorites-table th {
                    background: rgb(60, 122, 255); /* Màu xanh đậm pastel cho header */
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .favorites-table td {
                    border-bottom: 1px solid #f0f0f0;
                    color: #5d5c61;
                    font-size: 1rem;
                }

                .product-image {
                    width: 60px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 4px;
                }

                .product-price {
                    color: #e63946; /* Màu đỏ nổi bật cho giá */
                    font-weight: 500;
                }

                .action-buttons {
                    display: flex;
                    gap: 10px;
                }

                .btn {
                    padding: 8px 16px;
                    border: none;
                    border-radius: 25px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Arial', sans-serif;
                    text-transform: uppercase;
                }

                .btn-add-to-cart {
                    background: #b5ead7; /* Xanh mint pastel */
                    color: #2e7d32; /* Màu chữ xanh đậm */
                }

                .btn-add-to-cart:hover {
                    background: #a3d9c5;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(181, 234, 215, 0.3);
                }

                .btn-remove {
                    background: #ff9aa2; /* Hồng phấn pastel */
                    color: #c62828; /* Màu chữ đỏ đậm */
                }

                .btn-remove:hover {
                    background: #ff8089;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(255, 154, 162, 0.3);
                }

                .btn-primary {
                    background: #a3bffa; /* Tím lavender pastel */
                    color: white;
                    padding: 10px 20px;
                    font-size: 1rem;
                }

                .btn-primary:hover {
                    background: #8c9eff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(163, 191, 250, 0.3);
                }

                .btn-secondary {
                    background: #b5ead7; /* Xanh mint pastel */
                    color: #2e7d32;
                    padding: 10px 20px;
                    font-size: 1rem;
                }

                .btn-secondary:hover {
                    background: #a3d9c5;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(181, 234, 215, 0.3);
                }

                .empty-favorites {
                    text-align: center;
                    color: #9394a5;
                    font-size: 1.2rem;
                    margin-top: 50px;
                }

                .button-group {
                    margin-top: 20px;
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    max-width: 1200px;
                }

                .auth-message {
                    color: #9394a5;
                    font-size: 1.1rem;
                    text-align: center;
                    margin-bottom: 20px;
                }

                .loading-text,
                .error-text {
                    text-align: center;
                    font-size: 1.2rem;
                    margin-top: 50px;
                }

                .loading-text {
                    color: #a3bffa; /* Tím lavender pastel */
                }

                .error-text {
                    color: #ff9aa2; /* Hồng phấn pastel */
                }
            `}</style>

            <div className="favorites-container">
                <h1 className="favorites-title">Danh Sách Yêu Thích</h1>
                {favorites.length > 0 ? (
                    <table className="favorites-table">
                        <thead>
                            <tr>
                                <th>STT</th>
                                <th>Hình ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th>Đơn giá</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {favorites.map((item, index) => (
                                <tr key={item.id_product}>
                                    <td>{index + 1}</td>
                                    <td>
                                        {item.image_product && (
                                            <img
                                                src={item.image_product}
                                                alt={item.name_product}
                                                className="product-image"
                                            />
                                        )}
                                    </td>
                                    <td>{item.name_product}</td>
                                    <td className="product-price">{(item.price || 0).toLocaleString('vi-VN')} VND</td>
                                    <td className="action-buttons">
                                        <button
                                            className="btn btn-add-to-cart"
                                            onClick={() => handleAddToCart(item)}
                                        >
                                            Thêm vào giỏ
                                        </button>
                                        <button
                                            className="btn btn-remove"
                                            onClick={() => handleRemoveItem(item.id_product)}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-favorites">
                        Danh sách yêu thích của bạn đang trống. Hãy thêm sản phẩm bạn thích!
                        <div className="button-group">
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/')}
                            >
                                Bắt đầu mua sắm
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => navigate('/cart')}
                            >
                                Xem giỏ hàng
                            </button>
                        </div>
                    </div>
                )}
                {favorites.length > 0 && (
                    <div className="button-group">
                        <button
                            className="btn btn-primary"
                            onClick={() => navigate('/')}
                        >
                            Tiếp tục mua sắm
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => navigate('/cart')}
                        >
                            Xem giỏ hàng
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}