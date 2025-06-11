import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModel from "../../models/authModel";

export default function ManageAdminLevel() {
    const [admin, setAdmin] = useState([]);
    const [idAdmin, setIdAdmin] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const id = AuthModel.getIdFactory();

    useEffect(() => {
        const fetchAdmin = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/get-admin-level/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Lỗi tải dữ liệu");
                }

                setAdmin(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchAdmin();
    }, []);

    const handleContinue = (id) => {
        sessionStorage.setItem('id_admin_details', id)
        navigate(`info_details/${id}`);
    };

    if (loading) {
        return <div style={{ textAlign: "center", fontSize: "18px", color: "#555" }}>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div style={{ textAlign: "center", fontSize: "18px", color: "red" }}>Lỗi: {error}</div>;
    }

    return (
        <div style={{ padding: "20px" }}>
            <h2>Quản lý Admin</h2>
            {admin ? (
                <div style={{ boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif" }}>
                        <thead>
                            <tr style={{ backgroundColor: "#3169BBFF", color: "white", textAlign: "center" }}>
                                <th style={{ padding: "12px", border: "1px solid #388E3C" }}>STT</th>
                                <th style={{ padding: "12px", border: "1px solid #388E3C" }}>Tên đăng nhập</th>
                                <th style={{ padding: "12px", border: "1px solid #388E3C" }}>Ngày đăng nhập</th>
                                <th style={{ padding: "12px", border: "1px solid #388E3C" }}>Ngày đăng xuất</th>
                                <th style={{ padding: "12px", border: "1px solid #388E3C" }}>Trạng thái</th>
                                <th style={{ padding: "12px", border: "1px solid #388E3C" }}>ID Công ty</th>
                                <th style={{ padding: "12px", border: "1px solid #388E3C" }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {admin.map((item, index) => (
                                <tr
                                    key={item.id_admin}
                                    style={{
                                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                                        textAlign: "center",
                                    }}
                                >
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{index + 1}</td>
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{item.username_admin}</td>
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{item.date_login}</td>
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{item.date_logout}</td>
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{item.status}</td>
                                    <td style={{ padding: "12px", border: "1px solid #ddd" }}>{item.id_factory}</td>
                                    <td style={{ 
                                        padding: "12px", 
                                        border: "1px solid #ddd", 
                                        display: "flex", 
                                        gap: "10px", 
                                        justifyContent: "center" 
                                    }}>  
                                        <button 
                                            onClick={() => handleContinue(item.id_admin)}
                                            style={{
                                                backgroundColor: "#007bff",
                                                color: "white",
                                                border: "none",
                                                padding: "8px 12px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Xem chi tiết
                                        </button>
                                        <button 
                                            style={{
                                                backgroundColor: "#dc3545",
                                                color: "white",
                                                border: "none",
                                                padding: "8px 12px",
                                                borderRadius: "4px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            Xóa
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p style={{ textAlign: "center", fontSize: "16px", color: "#777" }}>Không có dữ liệu</p>
            )}
        </div>
    );
}
