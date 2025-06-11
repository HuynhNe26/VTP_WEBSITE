import React from 'react';
import imgicon_search from '../../img/icon/icon__search.png'; //TK
import img_shopping_cart from '../../img/icon/icon__shopping_cart.png'; //shopping
import img_address from '../../img/icon/icon_address.png'; //dchi
import img_login from '../../img/icon/icon_login.png'; //login
import img_love from '../../img/icon/icon_love.png'; //love
import img_store from '../../img/icon/icon_store.png'; //store
import img_logo from '../../img/logoVTP.png'; //logo
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
        </div>
    );
};
export { img_logo, imgicon_search, img_shopping_cart, img_address, img_login, img_love, img_store };
export default ImageComponent;
