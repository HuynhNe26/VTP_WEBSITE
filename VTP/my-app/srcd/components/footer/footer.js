import React from "react";
import {Link, useNavigate} from 'react-router-dom'

export default function Footer() {
    return (
        <div style={{height: '450px', marginTop: '50px'}}>
            <div style={{display: 'flex', height: '300px'}}>
                <div>
                    <h3>LIÊN HỆ VỚI CHÚNG TÔI</h3>
                    <h5>Tên công ty: Vương Thiên Phát Wood Company</h5>
                    <h5>Liên hệ: 0774182334 | 0937569205</h5>
                    <h5>Địa chỉ: 1322/768, ấp Ông Hường, xã Thiện Tân, huyện Vĩnh Cửu, tỉnh Đồng Nai</h5>
                </div>
                <div>
                    <Link>TÌM HIỂU VỀ CHÚNG TÔI</Link>
                </div>
            </div>
            <div>

            </div>
        </div>
    )
}