import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthModel from "../../models/authModel";

export default function InfoUserAdmin() {
    const [user, setUser] = useState(null);
    const idUser = sessionStorage.getItem('idUser');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const idAdmin = AuthModel.getIdAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/infoUser/${idUser}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setUser(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [idUser]);

    const handleSubmit = async (item) => {
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/delete-user/${item}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                navigate('/manage_user');
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return (
            <div className="error-container">{error}</div>
        );
    }

    if (loading) {
        return (
            <div className="loading-container">Đang tải...</div>
        );
    }

    return (
        <div className="info-user-container">
            {user ? (
                <div className="user-details">
                    <h2>THÔNG TIN NGỮNG DÙNG</h2>
                    <div className="info-item">
                        <span className="label">Tên đăng nhập:</span>
                        <p>{user.username}</p>
                    </div>
                    <div className="info-item">
                        <span className="label">Họ và tên:</span>
                        <p>{user.last_name_user} {user.first_name_user}</p>
                    </div>
                    <div className="info-item">
                        <span className="label">Giới tính:</span>
                        <p>{user.sex}</p>
                    </div>
                    <div className="info-item">
                        <span className="label">Ngày sinh:</span>
                        <p>{user.dateofbirth}</p>
                    </div>
                    <div className="info-item">
                        <span className="label">Số điện thoại:</span>
                        <p>{user.phone_number_user}</p>
                    </div>
                    <div className="info-item">
                        <span className="label">Email:</span>
                        <p>{user.email}</p>
                    </div>
                    <div className="info-item">
                        <span className="label">Địa chỉ:</span>
                        <p>{user.address}, {user.village}, {user.province}</p>
                    </div>
                    <div className="action-buttons">
                        {user.check_buy_success === 1 && (idAdmin === 1 || idAdmin === 2) ? (
                            <p className="status">Đã từng mua hàng</p>
                        ) : (
                            <button className="delete-btn" onClick={() => handleSubmit(user.id_user)}>
                                Xóa tài khoản
                            </button>
                        )}
                        <button className="back-btn" onClick={() => navigate(-1)}>
                            Quay lại
                        </button>
                    </div>
                </div>
            ) : (
                <div className="no-info">
                    <p>Không có thông tin! Vui lòng thử lại</p>
                    <button className="retry-btn" onClick={() => window.location.reload()}>
                        Thử lại
                    </button>
                </div>
            )}
            <style>{`
                .info-user-container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                    max-width: 600px;
                    margin: 0 auto;
                }
                .user-details {
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }
                .user-details h2 {
                    text-align: center;
                    margin-bottom: 20px;
                    color: #333;
                }
                .info-item {
                    display: flex;
                    align-items: center;
                    margin-bottom: 15px;
                }
                .label {
                    font-weight: bold;
                    color: #555;
                    width: 150px;
                    flex-shrink: 0;
                }
                .info-item p {
                    margin: 0;
                    color: #333;
                }
                .action-buttons {
                    display: flex;
                    gap: 10px;
                    justify-content: center;
                    margin-top: 20px;
                }
                .delete-btn, .back-btn, .retry-btn {
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background-color 0.3s;
                }
                .delete-btn {
                    background-color: #dc3545;
                    color: white;
                }
                .delete-btn:hover {
                    background-color: #c82333;
                }
                .back-btn {
                    background-color: #007bff;
                    color: white;
                }
                .back-btn:hover {
                    background-color: #0056b3;
                }
                .retry-btn {
                    background-color: #28a745;
                    color: white;
                }
                .retry-btn:hover {
                    background-color: #218838;
                }
                .status {
                    text-align: center;
                    color: #28a745;
                    font-weight: bold;
                }
                .no-info {
                    text-align: center;
                    padding: 20px;
                }
                .no-info p {
                    color: #dc3545;
                    margin-bottom: 10px;
                }
                .error-container {
                    text-align: center;
                    padding: 20px;
                    color: #dc3545;
                }
                .loading-container {
                    text-align: center;
                    padding: 20px;
                    color: #007bff;
                    font-size: 18px;
                }
            `}</style>
        </div>
    );
}