import React, { useState } from 'react';
import '../../css/navbar.css';
import { Outlet, Link, useNavigate } from "react-router-dom";
import { imgicon_search, img_logo, img_address, img_store } from '../img/ImageComponet';
import MenuNgang from './menungang';
import Footer from '../footer/footer.js';

const Navbar = ({ onCategorySelect }) => {
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setInput(e.target.value); // Loại bỏ khoảng trắng đầu chuỗi
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn tải lại trang
        if (input) {
            navigate(`/search/${input}`);
            window.location.reload();
            sessionStorage.setItem('search', input);
        } else {
            alert('Vui lòng nhập từ khóa tìm kiếm!');
        }
    };

    return (
        <header className="header">
            <div className="header__navbar--1">
                <div className="header__navbar--logo">
                    <div>
                        <img style={{ height: '40px', width: '80px' }} src={img_logo} alt="img_logo" />
                    </div>
                    <div>
                        <form onSubmit={handleSubmit} className="search--container">
                            <input
                                className="search--input"
                                type="text"
                                name="search"
                                value={input}
                                placeholder="Search"
                                onChange={handleChange}
                            />
                            <button
                                type="submit"
                                className="search--button"
                            >
                                <img
                                    style={{ width: '25px', height: '20px', paddingRight: '10px' }}
                                    src={imgicon_search}
                                    alt="Search Icon"
                                />
                            </button>
                        </form>
                    </div>
                    <div className="store-container">
                        <img style={{ height: '20px', width: '22px' }} src={img_store} alt="Image_store" />
                        <Link to="/find" style={{ textDecoration: 'none', fontWeight: '500', padding: '0px 0px 10px 5px', color: '#003366', fontSize: '12px' }}>
                            FIND A STORE
                        </Link>
                    </div>
                    <div className="store-container" style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
                        <img style={{ height: '25px', width: '28px' }} src={img_address} alt="Image_address" />
                        <Link to="/contact" style={{ textDecoration: 'none', fontWeight: '500', padding: '15px 0px 10px 5px', color: '#003366', fontSize: '12px' }}>
                            YOUR STORE: SEARCH NOW
                        </Link>
                    </div>
                </div>
            </div>

            <div className="header__navbar--2">
                <MenuNgang onCategorySelect={onCategorySelect} />
            </div>
            <div>
                <Outlet />
            </div>
            <div>
                <Footer />
            </div>
        </header>
    );
};

export default Navbar;