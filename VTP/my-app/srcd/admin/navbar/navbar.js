import React, { useEffect, useState } from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { imgicon_search, img_logo, button_01, button_02, button_03, logout, img_admin, history_sg, QL_ĐH, QL_RP, QL_admin, add_admin, QL_user, add_product, QL_product } from '../../components/img/ImageComponet';
import '../css/navbarad.css';
import AuthModel from '../../models/authModel';
import { ToastContainer, toast } from 'react-toastify';

const NavbarAdmin = () => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [userLevel, setUserLevel] = useState(null);
    const [results, setResults] = useState([]);
    const [search, setSearch] = useState("");
    const [error, setError] = useState(null)
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

    if (loading) {
        return <div>Loading...</div>;
    }

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
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ search })
            });

            const data = await response.json();

            if (response.ok) {
                setResults(data.data); 
                sessionStorage.setItem('search', JSON.stringify(data.data));
                navigate('/admin/search')   
                window.location.reload();

            } else {
                setError(data.message || 'Không tìm thấy sản phẩm');
            }
        } catch (error) {
            console.error('Lỗi tìm kiếm:', error);
            setError('Lỗi server khi tìm kiếm sản phẩm');
        }
    };

    const handleChange = (e) => {
        setSearch(e.target.value);
    }; 

    const menus = {
        1: [
            { to: 'manage_admin', label: 'QUẢN LÝ QUẢN TRỊ VIÊN', icon: QL_admin },
            { to: 'create_admin', label: 'THÊM QUẢN TRỊ VIÊN', icon: add_admin },
            { to: 'manage_user', label: 'QUẢN LÝ NGƯỜI DÙNG', icon: QL_user },
            { to: 'manage_order_all', label: 'QUẢN LÝ ĐƠN HÀNG', icon: QL_ĐH },
            { to: 'create_product', label: 'THÊM SẢN PHẨM', icon: add_product },
            { to: 'manage_product', label: 'QUẢN LÝ SẢN PHẨM', icon: QL_product },
            { to: 'manage_report', label: 'QUẢN LÝ REPORTED', icon: QL_RP },
            { to: `report/${id}`, label: 'LỊCH SỬ ĐỀ XUẤT', icon: history_sg },
        ],
        2: [
            { to: 'create_product', label: 'THÊM SẢN PHẨM', icon: add_product },
            { to: 'manage_admin_level', label: 'QUẢN LÝ QUẢN TRỊ VIÊN', icon: QL_admin },
            { to: 'manage_user', label: 'QUẢN LÝ NGƯỜI DÙNG', icon: QL_user },
            { to: 'create_product', label: 'THÊM SẢN PHẨM', icon: add_product },
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
        <div className="container" >
            <div className="sidebar">
                <div>
                    <Link to={`/admin/${id}`} style={{textDecoration: 'none', color: 'black'}}>
                        <img src={img_admin} alt="logo" className="admin" />
                        {admin}
                    </Link>
                </div>
                <h4 style={{ paddingLeft: '30px' }}>Menu</h4>
                <div>
                    {userMenus.map((menu, index) => (
                        <>
                            <Link key={index} to={menu.to} className="menu-section">
                                <img src={menu.icon} className="icon" /> {menu.label}
                            </Link>
                        </>
                    ))}
                    <button onClick={handleLogout} className='menu-section'>
                        <img src={logout} className="icon" />
                        Đăng xuất
                    </button>
                </div>
            </div>
            <div>
                <div style={{ display: 'flex' }}>
                    <img src={img_logo} alt="logo" className="logo" />
                    <div>
                        <form onSubmit={handleSubmit} className="admin_search--container">
                            <input
                                className="admin_search--input"
                                type="text"
                                name="search"
                                value={search}
                                placeholder="Search"
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="admin_search--button"
                            >
                                <img className="admin_search--icon"
                                    src={imgicon_search}
                                    alt="Search Icon"
                                />
                            </button>
                        </form>
                    </div>
                </div>
                <div className="layout">
                    <div className="button">
                        <img className="icon" src={button_01} />
                        <div className="text">
                            <div >Quản lí sản phẩm</div>
                            <div style={{ fontWeight: 'bold' }}>112.000</div>
                        </div>
                    </div>
                    <div className="button">
                        <img className="icon" src={button_02} />
                        <div className="text">
                            <div>Quản lí đơn hàng</div>
                            <div style={{ fontWeight: 'bold' }}>112.000</div>
                        </div>
                    </div>
                    <div className="button">
                        <img className="icon" src={button_03} />
                        <div className="text">
                            <div>Quản lí người dùng</div>
                            <div style={{ fontWeight: 'bold' }}>112.000</div>
                        </div>
                    </div>
                </div>
                <div className="main_content"> <main className="">
                    <Outlet />
                </main> </div>
            </div>
            <ToastContainer />
        </div>

    );
};

export default NavbarAdmin;