import React from 'react';
//user
import imgicon_search from '../../img/icon/icon__search.png'; //TK
import img_shopping_cart from '../../img/icon/icon__shopping_cart.png'//shopping
import img_address from '../../img/icon/icon_address.png'; //dchi
import img_login from '../../img/icon/icon_login.png'; //login
import img_love from '../../img/icon/icon_love.png'; //love
import img_store from '../../img/icon/icon_store.png'; //store
import img_logo from '../../img/logoVTP.png'; //logo
//admin
import img_admin from '../../img/icon/admin.png'; //admin_login
import history_sg from '../../img/icon/history_sg.png';
import QL_ĐH from '../../img/icon/QL_ĐH.png';
import QL_RP from '../../img/icon/QL_RP.png';
import QL_admin from '../../img/icon/QL_admin.png';
import add_admin from '../../img/icon/add_admin.png';
import QL_user from '../../img/icon/QL_user.png';
import add_product from '../../img/icon/add_product.png';
import QL_product from '../../img/icon/QL_product.png';
import logout from '../../img/icon/logout.png';
import button_01 from '../../img/icon/button_01.png';
import button_02 from '../../img/icon/button_02.png';
import button_03 from '../../img/icon/button_03.png';
const ImageComponent = () => {
    return (
        <div>
            <img src={img_logo} alt="img_logo" />
            <img src={imgicon_search} alt="Imagicon_search" />
            <img src={img_shopping_cart} alt="Image_shopping_cart" />
            <img src={img_address} alt="Image_address" />
            <img src={img_login} alt="Image_login" />
            <img src={img_love} alt="Image_love" />
            <img src={img_store} alt="Image_store" />
            <img src={img_admin} alt="admin" />
            <img src={history_sg} alt="history_sg" />
            <img src={QL_ĐH} alt="QL_ĐH" />
            <img src={QL_RP} alt="QL_RP" />
            <img src={QL_admin} alt="QL_admin" />
            <img src={add_admin} alt="add_admin" />
            <img src={QL_user} alt="QL_user" />
            <img src={add_product} alt="add_prodcut" />
            <img src={QL_product} alt="QL_product" />
            <img src={logout} alt="logout" />
            <img src={button_01} alt="" />
            <img src={button_02} alt="" />
            <img src={button_03} alt="" />
        </div>
    );
};
export {
    img_logo, imgicon_search, img_shopping_cart, img_address, img_login, img_love, img_store, img_admin,
    history_sg, QL_ĐH, QL_RP, QL_admin, add_admin, QL_user, add_product, QL_product, logout, button_01, button_02, button_03
};
export default ImageComponent;
