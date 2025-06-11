import {useEffect} from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React from 'react';
import NavbarAdmin from '../admin/navbar/navbar.js';
import LoginAdmin from '../admin/login/login_admin.js';
import Manage_Product from '../admin/product/manage_product.js';
import Manage_User from '../admin/user/manage_user.js';
import InfoAdmin from '../admin/info/info_admin.js';
import InfoDetails from '../admin/info/info_details.js';
import ManageReported from '../admin/reported/manage_reported.js';
import Reported from '../admin/reported/reported.js';
import ReportedDetails from '../admin/reported/reported_details.js';
import CreateAdmin from '../admin/info/create_admin.js';
import ManageAdmin from '../admin/info/manage_admin.js';
import InfoAdminDetails from '../admin/info/info_admin_details.js';
import CreateInfoAdmin from '../admin/info/create_info_admin.js'
import ManageAdminLevel from '../admin/info/manage_admin_level.js';
import InfoAdminDetailsLevel from '../admin/info/info_admin_details_level.js';
import CreateProduct from '../admin/product/create_product.js';
import ManageOrder from '../admin/order/manage_order.js';
import ProductDetails from '../admin/product/product_detail.js';
import CreateProductDetails from '../admin/product/create_product_details.js';
import ProductFix from '../admin/product/product_fix.js';
import ReportedDetailsAll from '../admin/reported/reported_details_all.js';

// user
import Home from '../view/home.js';
import Sign from '../view/login/sign.js';
import Navbar from '../components/navbar/navbar.js';
import Product from '../view/product.js';
import Login from '../view/login/login.js';
import AuthUser from '../models/authUser.js';
import InfoUser from '../view/info/info_user.js';
import ChnageInfoUser from '../view/info/change_info_user.js';
import Cart from '../view/cart/cart.js';
import Contact from '../view/contact/contact.js';
import OrderHistory from '../view/order_history/OrderHistory.js';
import Favorites from '../view/favorites/Favorites.js';
import Findstore from '../view/findstore/find.js';
export default function Router() {
    useEffect(() => {
        const id = AuthUser.getIdUser();
    }, []); // Thêm dependency array để useEffect không chạy liên tục

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navbar />}>
                    <Route index element={<Home />} /> {/* Thêm route mặc định */}
                    <Route path="/home" element={<Home />} />
                    <Route path="/sign" element={<Sign />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/category/:selectedCategory" element={<Product />} />
                    <Route path="/category/:selectedCategory/classify/:selectedClassify/product" element={<Product />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/order-history" element={<OrderHistory />} /> {/* Thêm lại */}
                    <Route path="/favorites" element={<Favorites />} /> {/* Thêm lại */}
                    <Route path="/find" element={<Findstore/>} />
                    <Route path="/:id" element={<InfoUser />} />
                    <Route path="/change_info/:id" element={<ChnageInfoUser />} />
                </Route>
                <Route path="/admin/login" element={<LoginAdmin />} />
                <Route path="/admin" element={<NavbarAdmin />}>
                    <Route index element={<Manage_Product />} />
                    <Route path='/admin/:id' element={<InfoAdmin />}/>
                    <Route path='create_admin' element={<CreateAdmin />}/>
                    <Route path='create_admin/:id' element={<CreateInfoAdmin />}/>
                    <Route path='manage_admin' element={<ManageAdmin />}/>
                    <Route path='manage_admin_level' element={<ManageAdminLevel />}/>
                    <Route path="manage_admin_level/info_details/:id" element={<InfoAdminDetailsLevel />} />
                    <Route path='create_product' element={<CreateProduct />}/>
                    <Route path='create_product_details' element={<CreateProductDetails />}/>
                    <Route path="manage_product" element={<Manage_Product />} />
                    <Route path="manage_product/:id" element={<ProductDetails />} />
                    <Route path="manage_product/fix/:id" element={<ProductFix />} />
                    <Route path="manage_user" element={<Manage_User />} />
                    <Route path="info_details/:id" element={<InfoDetails />} />
                    <Route path="manage_admin/info_details/:id" element={<InfoAdminDetails />} />
                    <Route path="manage_report" element={<ManageReported />}/>
                    <Route path="report/:id" element={<Reported />}/>
                    <Route path="report-details/:id" element={<ReportedDetailsAll />}/>
                    <Route path="report/:id/report-details/:id" element={<ReportedDetails />}/>
                    <Route path="manage_order" element={<ManageOrder />}/>
                    {/* <Route path="/:id/delete" element={<DeleteUser />} /> */}
                </Route>
                <Route path="*" element={<div>404 - Trang không tìm thấy</div>} />
            </Routes>
        </BrowserRouter>
    );
}