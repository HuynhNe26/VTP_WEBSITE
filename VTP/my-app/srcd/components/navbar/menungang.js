import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/navbar.css';
import { img_love, img_login, img_shopping_cart } from '../img/ImageComponet';
import AuthUser from '../../models/authUser';

function MenuNgang({ onCategorySelect }) {
    const [categories, setCategories] = useState([]); // Đổi tên biến để rõ ràng hơn
    const [cartItemCount, setCartItemCount] = useState(0);
    const id = AuthUser.getIdUser();
    const username = AuthUser.getUsername();
    const navigate = useNavigate();

    // Hàm fetch danh mục sản phẩm
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:5000/');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                if (Array.isArray(data)) {
                    setCategories(data);
                } else {
                    console.error('Invalid response format:', data);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);

    // Hàm fetch số lượng sản phẩm trong giỏ hàng
    useEffect(() => {
        const fetchCartItems = async () => {
            try {
                let cartData = [];
                if (id) {
                    // Nếu người dùng đã đăng nhập, lấy dữ liệu từ server
                    const response = await fetch(`http://localhost:5000/cart/${id}`);
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    cartData = await response.json();
                } else {
                    // Nếu chưa đăng nhập, lấy dữ liệu từ localStorage
                    const localCart = localStorage.getItem('cart');
                    if (localCart) {
                        cartData = JSON.parse(localCart);
                    }
                }
                // Cập nhật số lượng sản phẩm
                setCartItemCount(Array.isArray(cartData) ? cartData.length : 0);
            } catch (error) {
                console.error('Error fetching cart items:', error);
                setCartItemCount(0);
            }
        };

        fetchCartItems();

        // Thiết lập interval để cập nhật giỏ hàng mỗi 30 giây
        const intervalId = setInterval(fetchCartItems, 30000);

        // Clear interval khi component unmount
        return () => clearInterval(intervalId);
    }, [id]);

    return (
        <div className="menungang">
            {/* Phần hiển thị danh mục sản phẩm */}
            <div>
                {categories.length === 0 && <p>No categories found.</p>}
                {categories.map((category) => (
                    <Link
                        to={`/category/${category.id_category}`}
                        key={category.id_category}
                        className="menungang__a"
                        onClick={() => onCategorySelect(category.id_category)}
                    >
                        {category.name_category}
                    </Link>
                ))}
            </div>

            {/* Phần hiển thị biểu tượng và số lượng giỏ hàng */}
            <div className="menungang__icons">
                {/* Biểu tượng yêu thích */}
                <Link to="/favorites" className="menungang__a">
                    <img style={{ height: '25px', width: '22px' }} src={img_love} alt="Love" />
                </Link>

                {/* Biểu tượng giỏ hàng với số lượng sản phẩm */}
                <Link to="/cart" className="menungang__a cart-icon-container" style={{ position: 'relative' }}>
                    <img style={{ height: '25px', width: '30px' }} src={img_shopping_cart} alt="Shopping Cart" />
                    {cartItemCount > 0 && (
                        <span
                            className="cart-count"
                            style={{
                                position: 'absolute',
                                top: '-8px',
                                right: '-8px',
                                background: 'red',
                                color: 'white',
                                borderRadius: '50%',
                                width: '20px',
                                height: '20px',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                fontSize: '12px',
                                fontWeight: 'bold',
                            }}
                        >
                            {cartItemCount}
                        </span>
                    )}
                </Link>

                {/* Phần hiển thị thông tin người dùng */}
                <div style={{ display: 'flex' }}>
                    {id ? (
                        <>
                            <Link to={`/${username}`} className="menungang__a login-icon">
                                {username}
                            </Link>
                            <button
                                onClick={() => {
                                    AuthUser.logout();
                                    navigate('/');
                                }}
                            >
                                Đăng xuất
                            </button>
                        </>
                    ) : (
                        <Link to="/login" className="menungang__a login-icon">
                            <img style={{ height: '25px', width: '30px' }} src={img_login} alt="Login" />
                            LOGIN
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}

export default MenuNgang;