import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import AuthModel from "../../models/authModel";

export default function InfoRequired() {
    const [infoReported, setInfoReported] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const id = AuthModel.getIdAdmin();

    useEffect(() => {
        setLoading(true);
        const fetchReported = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get-reported/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();
                setInfoReported(data.data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReported();
    }, [id]);

    const handleViewDetails = (reportId) => {
        navigate(`/${reportId}`);
    };

    if (loading) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#666',
                fontSize: '16px'
            }}>
                Loading...
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '20px',
                color: '#dc3545',
                backgroundColor: '#f8d7da',
                borderRadius: '4px',
                textAlign: 'center'
            }}>
                Error: {error}
            </div>
        );
    }

    return (
        <div style={{
            padding: '20px',
            maxWidth: '1000px'
        }}>
            {infoReported && infoReported.length > 0 ? (
                <div>
                    <h2 style={{
                        color: '#333',
                        fontSize: '24px',
                        marginBottom: '20px',
                        fontWeight: 600
                    }}>
                        LỊCH SỬ YÊU CẦU CHỈNH SỬA THÔNG TIN QUẢN TRỊ VIÊN
                    </h2>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)'
                    }}>
                        <thead>
                            <tr>
                                <th style={{
                                    padding: '12px 15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: '#f5f5f5',
                                    color: '#666',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '14px'
                                }}>STT</th>
                                <th style={{
                                    padding: '12px 15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: '#f5f5f5',
                                    color: '#666',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '14px'
                                }}>Tiêu đề</th>
                                <th style={{
                                    padding: '12px 15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: '#f5f5f5',
                                    color: '#666',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '14px'
                                }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {infoReported.map((item, index) => (
                                <tr 
                                    key={item.id_admin_information_required || index}
                                    style={{ 
                                        transition: 'background-color 0.3s',
                                        ':hover': { backgroundColor: '#fafafa' } // Note: this pseudo-class won't work inline
                                    }}
                                >
                                    <td style={{
                                        padding: '12px 15px',
                                        borderBottom: '1px solid #ddd',
                                        color: '#333',
                                        fontSize: '14px'
                                    }}>{index + 1}</td>
                                    <td style={{
                                        padding: '12px 15px',
                                        borderBottom: '1px solid #ddd',
                                        color: '#333',
                                        fontSize: '14px'
                                    }}>{item.description}</td>
                                    <td style={{
                                        padding: '12px 15px',
                                        borderBottom: '1px solid #ddd',
                                        color: '#333',
                                        fontSize: '14px'
                                    }}>
                                        <button 
                                            style={{
                                                backgroundColor: '#007bff',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                transition: 'background-color 0.3s ease'
                                            }}
                                            onMouseOver={(e) => e.target.style.backgroundColor = '#0056b3'}
                                            onMouseOut={(e) => e.target.style.backgroundColor = '#007bff'}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleViewDetails(item.id_admin_information_required);
                                            }}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{
                    padding: '20px',
                    color: '#666',
                    fontSize: '16px',
                    textAlign: 'center',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '4px'
                }}>
                    Không có yêu cầu nào!
                </div>
            )}
        </div>
    );
}