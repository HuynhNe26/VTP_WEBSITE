import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import AuthModel from "../../models/authModel";

export default function InfoAdmin() {
    const [adminInfo, setAdminInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const id = AuthModel.getIdAdmin();
    const username = AuthModel.getUsername();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/get-info-admin/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setAdminInfo(data.data);
                console.log(data)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [id]); 

    const formatDateVN = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { hour12: false });
    };
      
    
    const handleShow = (e) => {
        navigate(`/admin/info_details/${username}`)
    }

    if (loading) {
        return (
            <div style={{ padding: '20px' }}>
                <p>Loading admin information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', color: 'red' }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1 style={{ fontSize: '24px', color: '#333', textTransform: 'uppercase', textAlign: 'center' }}>THÔNG TIN QUẢN TRỊ VIÊN {adminInfo.last_name_admin} {adminInfo.first_name_admin}</h1>
            {adminInfo ? (
                <div>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Tên đăng nhập</th>
                                <th style={tableHeaderStyle}>Mật khẩu</th>
                                <th style={tableHeaderStyle}>Ngày đăng nhập</th>
                                <th style={tableHeaderStyle}>Ngày đăng xuất</th>
                                <th style={tableHeaderStyle}>ID công ty</th>
                                <th style={tableHeaderStyle}>Hành động</th>
                            </tr>
                            {/*Mật khẩu yêu cầu nhập mật khẩu riêng của admin để xem*/}
                        </thead>
                        <tbody>
                            <tr>
                                <td style={tableCellStyle}>
                                    {adminInfo.username_admin}
                                </td>
                                <td style={tableCellStyle}>{adminInfo.password_admin}</td>
                                <td style={tableCellStyle}>{formatDateVN(adminInfo.date_login)}</td>
                                <td style={tableCellStyle}>
                                    {formatDateVN(adminInfo.date_logout)}
                                </td>
                                <td style={tableCellStyle}>{adminInfo.id_factory}</td>
                                <td style={tableCellStyle}>
                                    <button 
                                        onClick={handleShow}
                                        style={buttonStyle}
                                    >
                                        Xem chi tiết
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            ) : (
                <p>Lỗi! Vui lòng thử tải lại!</p>
            )}
            <h1 style={{ fontSize: '24px', color: '#333', textTransform: 'uppercase', textAlign: 'center'}}>LỊCH SỬ ĐĂNG NHẬP QUẢN TRỊ VIÊN {adminInfo.last_name_admin} {adminInfo.first_name_admin}</h1>
        </div>
    );
}

// Reusable styles
const tableHeaderStyle = {
    padding: '12px 15px',
    textAlign: 'center',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#f5f5f5',
    color: '#666',
    fontWeight: 600,
    textTransform: 'uppercase',
    fontSize: '14px'
};

const tableCellStyle = {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd',
    color: '#333',
    fontSize: '14px',
    textAlign: 'center',
};

const buttonStyle = {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background-color 0.3s ease'
};