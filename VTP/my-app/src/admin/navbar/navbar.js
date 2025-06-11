import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { imgicon_search, img_logo, button_01, button_02, button_03, logout, img_admin, history_sg, QL_ĐH, QL_RP, QL_admin, add_admin, QL_user, add_product, QL_product } from '../../components/img/ImageComponet';
import AuthModel from '../../models/authModel';
import { ToastContainer, toast } from 'react-toastify';

const NavbarAdmin = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLevel, setUserLevel] = useState(null);
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null);
    const [product, setProduct] = useState([]);
    const [user, setUser] = useState([]);
    const [order, setOrder] = useState([]);
    const navigate = useNavigate();
    const id = AuthModel.getIdAdmin();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                if (!AuthModel.isAuthenticated()) {
                    navigate('/admin/login');
                } else {
                    const username = AuthModel.getUsername();
                    const level = AuthModel.getAdminLevel();
                    setAdmin(username);
                    setUserLevel(level);
                    const hasShownToast = localStorage.getItem('hasShownLoginToast');
                    if (!hasShownToast && AuthModel.isAuthenticated()) {
                        toast.success('Đăng nhập thành công!', { autoClose: 2000 });
                        localStorage.setItem('hasShownLoginToast', 'true');
                    }
                }
            } catch (error) {
                console.error('Auth error:', error);
                toast.error('Đã xảy ra lỗi khi xác thực. Vui lòng đăng nhập lại.');
                AuthModel.logout();
                navigate('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        const fetchProduct = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/productAdmin', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                if (response.ok) setProduct(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchOrder = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/get-order', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                if (response.ok) setOrder(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/get-user', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const data = await response.json();
                if (response.ok) setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        fetchOrder();
        fetchProduct();
        checkAuth();
    }, [navigate]);

    const handleLogout = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (!id) {
                toast.error("Lỗi: Không tìm thấy ID admin.");
                return;
            }
            const response = await fetch(`http://localhost:5000/logout-admin/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
                AuthModel.logout();
                localStorage.removeItem('hasShownLoginToast');
                alert('Đăng xuất thành công!');
                navigate('/admin/login');
            } else {
                const data = await response.json();
                toast.error(data.message || 'Đăng xuất thất bại');
            }
        } catch (error) {
            console.error('Logout error:', error.message);
            toast.error('Đã xảy ra lỗi khi đăng xuất');
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="loading">Loading...</div>;

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setResults([]);
        try {
            const response = await fetch('http://localhost:5000/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ search })
            });
            const data = await response.json();
            if (response.ok) {
                setResults(data.data);
                sessionStorage.setItem('search', JSON.stringify(data.data));
                navigate('/admin/search');
                window.location.reload();
            } else {
                setError(data.message || 'Không tìm thấy sản phẩm');
            }
        } catch (error) {
            console.error('Lỗi tìm kiếm:', error);
            setError('Lỗi server khi tìm kiếm sản phẩm');
        }
    };

    const handleChange = (e) => setSearch(e.target.value);

    const menus = {
        1: [
            { to: 'statistics', label: 'THỐNG KÊ', icon: QL_admin },
            { to: 'manage_admin', label: 'QUẢN LÝ QUẢN TRỊ VIÊN', icon: QL_admin },
            { to: 'create_admin', label: 'THÊM QUẢN TRỊ VIÊN', icon: add_admin },
            { to: 'manage_user', label: 'QUẢN LÝ NGƯỜI DÙNG', icon: QL_user },
            { to: 'manage_order_all', label: 'QUẢN LÝ ĐƠN HÀNG', icon: QL_ĐH },
            { to: 'create_product', label: 'THÊM SẢN PHẨM', icon: add_product },
            { to: 'create_product_details', label: 'THÊM CHI TIẾT SẢN PHẨM', icon: add_product },
            { to: 'manage_product', label: 'QUẢN LÝ SẢN PHẨM', icon: QL_product },
            { to: 'manage_report', label: 'QUẢN LÝ REPORTED', icon: QL_RP },
            { to: `report/${id}`, label: 'LỊCH SỬ ĐỀ XUẤT', icon: history_sg },
        ],
        2: [
            { to: 'create_product', label: 'THÊM SẢN PHẨM', icon: add_product },
            { to: 'manage_admin_level', label: 'QUẢN LÝ QUẢN TRỊ VIÊN', icon: QL_admin },
            { to: 'manage_user', label: 'QUẢN LÝ NGƯỜI DÙNG', icon: QL_user },
            { to: 'create_product_details', label: 'THÊM CHI TIẾT SẢN PHẨM', icon: add_product },
            { to: 'manage_order', label: 'QUẢN LÍ ĐƠN HÀNG', icon: QL_ĐH },
            { to: 'manage_product', label: 'QUẢN LÝ SẢN PHẨM', icon: QL_product },
            { to: `report/${id}`, label: 'LỊCH SỬ ĐỀ XUẤT', icon: history_sg },
        ],
        3: [
            { to: 'manage_product', label: 'QUẢN LÝ SẢN PHẨM', icon: QL_product },
            { to: 'manage_order', label: 'QUẢN LÍ ĐƠN HÀNG', icon: QL_ĐH },
            { to: 'manage_user', label: 'QUẢN LÝ NGƯỜI DÙNG', icon: QL_user },
        ],
    };

    const userMenus = menus[userLevel] || [];

    return (
        <div className="container">
            <div className="sidebar">
                <div className="admin-profile">
                    <Link to={`/admin/${id}`} style={{ textDecoration: 'none', color: '#002856' }}>
                        <img src={img_admin} alt="admin" className="admin" />
                        <span>{admin}</span>
                    </Link>
                </div>
                <h4>Menu</h4>
                <div className="menu-list">
                    {userMenus.map((menu, index) => (
                        <Link key={index} to={menu.to} className="menu-section">
                            <img src={menu.icon} className="icon" alt={menu.label} /> {menu.label}
                        </Link>
                    ))}
                    <button onClick={handleLogout} className="menu-section logout-btn">
                        <img src={logout} className="icon" alt="Logout" /> Đăng xuất
                    </button>
                </div>
            </div>
            <div className="main-container">
                <div className="header">
                    <img src={img_logo} alt="logo" className="logo" />
                    <form onSubmit={handleSubmit} className="admin_search--container">
                        <input
                            className="admin_search--input"
                            type="text"
                            name="search"
                            value={search}
                            placeholder="Search"
                            onChange={handleChange}
                            onKeyPress={handleKeyPress}
                        />
                        <button type="submit" className="admin_search--button">
                            <img className="admin_search--icon" src={imgicon_search} alt="Search Icon" />
                        </button>
                    </form>
                </div>
                <div className="layout">
                    <div className="button">
                        <img className="icon" src={button_01} alt="Product" />
                        <div className="text">
                            <div>Quản lý sản phẩm</div>
                            <div className="count">{product.length}</div>
                        </div>
                    </div>
                    <div className="button">
                        <img className="icon" src={button_02} alt="Order" />
                        <div className="text">
                            <div>Quản lý đơn hàng</div>
                            <div className="count">{order.length}</div>
                        </div>
                    </div>
                    <div className="button">
                        <img className="icon" src={button_03} alt="User" />
                        <div className="text">
                            <div>Quản lý người dùng</div>
                            <div className="count">{user.length}</div>
                        </div>
                    </div>
                </div>
                <div className="main_content">
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
            <ToastContainer />
            <style>{`
                body {
                    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    display: flex;
                    background: #EDEEF0;
                    border-radius: 10px;
                    padding: 10px;
                    min-height: 100vh;
                }
                .sidebar {
                    width: 20%;
                    background: white;
                    padding: 20px;
                    border-radius: 10px;
                    margin-left: 15px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                }
                .sidebar h4 {
                    padding-left: 30px;
                    color: #002856;
                    margin: 20px 0;
                }
                .admin-profile {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin: 20px 0 0 30px;
                }
                .sidebar .admin {
                    height: 30px;
                    width: 30px;
                }
                .menu-list {
                    display: flex;
                    flex-direction: column;
                    gap: 5px;
                }
                .sidebar .menu-section {
                    background: white;
                    border-radius: 5px;
                    padding: 15px 30px;
                    font-size: 14px;
                    color: #002856;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    transition: background 0.3s, color 0.3s;
                    text-decoration: none;
                    font-weight: bold;
                }
                .sidebar .menu-section:hover {
                    background: #002856;
                    color: #FFFFFF;
                }
                .sidebar .menu-section .icon {
                    height: 18px;
                    width: 18px;
                }
                .sidebar .logout-btn {
                    background: none;
                    border: none;
                    text-align: left;
                }
                .main-container {
                    flex: 1;
                    padding: 0 20px;
                }
                .header {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }
                .logo {
                    height: 35px;
                    margin: 20px 0 5px 15px;
                }
                .admin_search--container {
                    display: flex;
                    align-items: center;
                    background-color: white;
                    border-radius: 25px;
                    width: 100%;
                    max-width: 900px;
                    border: 1px solid #ddd;
                    margin: 20px 0;
                    height: 40px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .admin_search--input {
                    padding-left: 20px;
                    border: none;
                    outline: none;
                    background: transparent;
                    flex: 1;
                    font-size: 12px;
                    color: #333;
                }
                .admin_search--input::placeholder {
                    color: #aaa;
                    font-weight: 600;
                    font-size: 12px;
                }
                .admin_search--button {
                    border: none;
                    outline: none;
                    height: 25px;
                    width: 30px;
                    background: white;
                    cursor: pointer;
                }
                .admin_search--icon {
                    width: 20px;
                    height: 20px;
                }
                .layout {
                    display: flex;
                    gap: 20px;
                    padding: 0 10px;
                }
                .layout .button {
                    display: flex;
                    align-items: center;
                    width: 180px;
                    height: 60px;
                    margin: 20px 0;
                    background: #FFFFFF;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    cursor: pointer;
                    transition: background 0.3s, box-shadow 0.3s;
                    gap: 15px;
                }
                .layout .button:hover {
                    background: #002856;
                    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
                }
                .layout .button .icon {
                    padding-left: 10px;
                    height: 40px;
                    width: 40px;
                }
                .layout .button .text {
                    font-size: 13px;
                    color: #002856;
                    font-weight: 500;
                }
                .layout .button:hover .text {
                    color: white;
                }
                .layout .button .count {
                    font-weight: bold;
                }
                .main_content {
                    width: 100%;
                    padding: 20px;
                    background: #FFFFFF;
                    border-radius: 10px;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    min-height: 500px;
                }
                .loading {
                    text-align: center;
                    padding: 20px;
                    color: #002856;
                    font-size: 18px;
                }
            `}</style>
        </div>
    );
};

export default NavbarAdmin;