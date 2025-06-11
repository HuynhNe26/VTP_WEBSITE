import React from "react";
import { img_logo } from "../img/ImageComponet";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

export default function Footer() {
    return (
        <div style={{
            backgroundColor: '#002147',
            color: 'white',
            padding: '30px 0px 0px 0px',
            marginTop: '50px'
        }}>
            <div style={{
                display: 'flex',
                maxWidth: '1200px',
                margin: '0px 0px 0px 60px',
                padding: '0 20px'
            }}>

                <div style={{ maxWidth: '1500px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                        <img src={img_logo} alt="Logo" style={{ width: '70px', marginRight: '10px' }} />
                        <span style={{ fontSize: '17px', fontWeight: 'bold' }}>VƯƠNG THIÊN PHÁT WOOD COMPANY</span>
                    </div>
                    <div style={{ marginBottom: '20px', lineHeight: '2', padding: '0px 10px 0px 20px ', fontSize: '14px', fontWeight: 'bold' }}>
                        LIÊN HỆ VỚI CHÚNG TÔI
                    </div>
                    <div style={{ display: 'flex', paddingBottom: '20px', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', paddingLeft: '25px', fontWeight: '500', textAlign: 'center', alignItems: 'center' }}>
                            <FaPhone /> &nbsp; 0774182334  &nbsp; | &nbsp;  0937569205
                        </div >
                        <div style={{ display: 'flex', paddingLeft: '100px', fontWeight: '500', textAlign: 'center', alignItems: 'center' }}>
                            <FaEnvelope /> &nbsp; vtpwood@gmail.com
                        </div>
                        <div style={{ display: 'flex', paddingLeft: '100px', fontWeight: '500', textAlign: 'center', alignItems: 'center' }}>
                            <FaMapMarkerAlt /> &nbsp; 1322/768, ấp Ông Hường, xã Thiện Tân, huyện Vĩnh Cửu, tỉnh Đồng Nai
                        </div>
                    </div>
                </div>
            </div>
            <div style={{ textAlign: 'center', alignItems: 'center', paddingTop: '20px' }}>© 2025 Vương Thiên Phát Wood Company. All Rights Reserved.</div>
        </div>
    );
}