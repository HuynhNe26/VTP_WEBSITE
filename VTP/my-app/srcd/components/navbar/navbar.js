import React from 'react';
import '../../css/navbar.css';
import { Outlet, Link } from "react-router-dom";
import { imgicon_search, img_logo, img_address, img_store } from '../img/ImageComponet';
import MenuNgang from './menungang';

const Navbar = ({ onCategorySelect }) => {
    return (
        <header className="header">
            <div className="header__navbar--1">
                <div className="header__navbar--logo">
                    <div>
                        <img style={{ height: '40px', width: '80px' }} src={img_logo} alt="img_logo" />
                    </div>
                    <div className="search--container">
                        <input type="text" placeholder="Search" className="search--input" style={{ fontWeight: 'bold', fontSize: '12px', paddingLeft: '10px' }} />
                        <span className="search--icon">
                            <img style={{ width: '25px', height: '20px', paddingRight: '10px' }} src={imgicon_search} alt="Imageicon_search" />
                        </span>
                    </div>
                    <div className="store-container">
                        <img style={{ height: '20px', width: '22px' }} src={img_store} alt="Image_store" />
                        <Link to="/find" style={{ textDecoration: 'none', fontWeight: '500', alignItems: 'center', padding: '0px 0px 10px 5px', color: '#003366', fontSize: '12px' }}>FIND A STORE</Link>
                    </div>
                    <div className="store-container" style={{ display: 'flex', alignItems: 'center', paddingLeft: '10px' }}>
                        <img style={{ height: '25px', width: '28px' }} src={img_address} alt="Image_address" />
                        <Link to="/contact" style={{ textDecoration: 'none', fontWeight: '500', alignItems: 'center', padding: '15px 0px 10px 5px', color: '#003366', fontSize: '12px' }}>YOUR STORE: SEARCH NOW</Link>
                    </div>
                </div>
            </div>
            <div className="header__navbar--2">
                <MenuNgang onCategorySelect={onCategorySelect} />
            </div>
            <div>
                <Outlet />
            </div>
        </header>
    );
};

export default Navbar;
