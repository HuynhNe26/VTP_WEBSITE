import React, { useEffect, useState } from "react";
import AuthUser from "../../models/authUser";
import { useNavigate } from 'react-router-dom';
import { jsPDF } from "jspdf";

export default function OrderHistory() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const token = AuthUser.getToken();
    const userId = AuthUser.getIdUser();

    useEffect(() => {
        const fetchOrderHistory = async () => {
            if (!userId || !token) {
                setError('Vui lòng đăng nhập để xem lịch sử đơn hàng');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5000/order-history/${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                });

                const contentType = response.headers.get('content-type');
                if (!contentType || !contentType.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Phản hồi không phải JSON: ${text.substring(0, 100)}...`);
                }

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `Không thể lấy lịch sử đơn hàng: ${response.statusText}`);
                }

                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error('Lỗi khi lấy lịch sử đơn hàng:', err);
                setError(err.message || 'Lỗi kết nối server');
            } finally {
                setLoading(false);
            }
        };

        fetchOrderHistory();
    }, [navigate, token, userId]);

    const downloadInvoice = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5000/purchase-order/${orderId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể tải chi tiết đơn hàng');
            }

            const orderData = await response.json();

            const doc = new jsPDF();
            doc.setFont("Arial", "normal");
            doc.setFontSize(18);
            doc.text(`Hóa Đơn Đơn Hàng DH${orderId}`, 20, 20);
            doc.setFontSize(12);
            doc.text(`Ngày đặt: ${new Date(orderData.date_buy).toLocaleString('vi-VN')}`, 20, 30);
            doc.text(`Phương thức thanh toán: ${orderData.payment_method}`, 20, 40);
            doc.text(`Trạng thái: ${orderData.status}`, 20, 50);
            let y = 70;
            doc.setFontSize(14);
            doc.text("Thông tin khách hàng", 20, y);
            y += 10;
            doc.setFontSize(12);
            doc.text(`Họ và tên: ${orderData.name_user}`, 20, y); y += 10;
            doc.text(`Số điện thoại: ${orderData.phone_user}`, 20, y); y += 10;
            doc.text(`Địa chỉ: ${orderData.address}`, 20, y); y += 10;
            doc.text(`Người nhận: ${orderData.recieve}`, 20, y); y += 10;
            y += 10;
            doc.setFontSize(14);
            doc.text("Thông tin giao hàng", 20, y);
            y += 10;
            doc.setFontSize(12);
            doc.text(`Địa chỉ giao hàng: ${orderData.delivery_address}`, 20, y); y += 10;
            doc.text(`Tỉnh/Thành phố: ${orderData.delivery_province}`, 20, y); y += 10;
            doc.text(`Quận/Huyện: ${orderData.delivery_village}`, 20, y); y += 10;
            doc.text(`Phí giao hàng: ${orderData.delivery_price.toLocaleString('vi-VN')} VND`, 20, y); y += 10;
            y += 10;
            doc.setFontSize(14);
            doc.text("Thông tin thanh toán", 20, y);
            y += 10;
            doc.setFontSize(12);
            doc.text(`Phí giao hàng: ${orderData.delivery_price.toLocaleString('vi-VN')} VND`, 20, y); y += 10;
            doc.text(`Tổng tiền: ${orderData.total_price.toLocaleString('vi-VN')} VND`, 20, y); y += 10;
            y = 270;
            doc.setFontSize(10);
            doc.text(`Ngày xuất hóa đơn: ${new Date().toLocaleString('vi-VN')}`, 20, y);
            doc.save(`HoaDon_DH${orderId}.pdf`);
        } catch (err) {
            console.error('Lỗi khi tải hóa đơn:', err);
            setError(err.message || 'Không thể tải hóa đơn');
        }
    };

    const contactSupport = () => {
        navigate('/contact');
    };

    const cancelOrder = async (orderId) => {
        // Hiển thị thông báo xác nhận
        const confirmCancel = window.confirm(`Bạn có chắc chắn muốn hủy đơn hàng DH${orderId} không?`);
        if (!confirmCancel) {
            return; // Nếu người dùng chọn "Cancel", dừng hàm
        }

        try {
            const response = await fetch(`http://localhost:5000/cancel-order/${orderId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể hủy đơn hàng');
            }

            // Xóa đơn hàng khỏi danh sách
            setOrders(orders.filter(order => order.id_order !== orderId));

            // Hiển thị thông báo thành công
            alert(`Đơn hàng DH${orderId} đã được hủy thành công!`);
        } catch (err) {
            console.error('Lỗi khi hủy đơn hàng:', err);
            setError(err.message || 'Không thể hủy đơn hàng');
        }
    };

    if (!token || !AuthUser.isAuthenticated()) {
        return (
            <div className="order-history-container">
                <p className="auth-message">Vui lòng đăng nhập để xem lịch sử đơn hàng.</p>
                <button className="btn btn-primary" onClick={() => navigate('/login')}>
                    Đăng nhập
                </button>
            </div>
        );
    }

    if (loading) {
        return <div className="loading-text">Đang tải lịch sử đơn hàng...</div>;
    }

    if (error) {
        return (
            <div className="order-history-container">
                <div className="error-text">{error}</div>
                <button className="btn btn-primary" onClick={() => { setError(null); navigate('/'); }}>
                    Quay lại trang chủ
                </button>
            </div>
        );
    }

    return (
        <>
            <style>{`
                .order-history-container {
                    padding: 40px 20px;
                    min-height: 100vh;
                    width: 100vw;
                    background: linear-gradient(135deg, rgb(0, 110, 255) 0%, rgb(0, 53, 199) 100%);
                    box-shadow: none;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                }

                .order-history-title {
                    text-align: center;
                    color: rgb(255, 255, 255);
                    font-size: 2.5rem;
                    margin-bottom: 30px;
                    font-family: 'Arial', sans-serif;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                }

                .order-table {
                    width: 100%;
                    max-width: 1000px;
                    border-collapse: collapse;
                    background: #fff;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
                }

                .order-table th,
                .order-table td {
                    padding: 15px;
                    text-align: left;
                    font-family: 'Arial', sans-serif;
                }

                .order-table th {
                    background: rgb(60, 122, 255);
                    color: #fff;
                    font-size: 1.1rem;
                    font-weight: 600;
                    text-transform: uppercase;
                }

                .order-table td {
                    border-bottom: 1px solid #f0f0f0;
                    color: #5d5c61;
                    font-size: 1rem;
                }

                .status-confirmed,
                .status-pending,
                .status-failed,
                .status-canceled,
                .status-unknown {
                    display: inline-block;
                    padding: 5px 10px;
                    border-radius: 15px;
                    font-size: 0.9rem;
                    font-weight: 500;
                    text-align: center;
                    min-width: 100px;
                }

                .status-confirmed {
                    background: #b5ead7;
                    color: #2e7d32;
                }

                .status-pending {
                    background: #ffcc80;
                    color: #ef6c00;
                }

                .status-failed {
                    background: #ff9aa2;
                    color: #c62828;
                }

                .status-canceled {
                    background: #f5c6cb;
                    color: #b71c1c;
                }

                .status-unknown {
                    background: #e0e0e0;
                    color: #616161;
                }

                .btn-download, .btn-contact, .btn-cancel {
                    padding: 8px 15px;
                    border: none;
                    border-radius: 20px;
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }

                .btn-download {
                    background: rgb(0, 255, 34);
                    color: #2e7d32;
                }

                .btn-download:hover {
                    background: #9edcc4;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(181, 234, 215, 0.3);
                }

                .btn-contact {
                    background: rgb(255, 165, 0);
                    color: #fff;
                }

                .btn-contact:hover {
                    background: #ffcc80;
                }

                .btn-cancel {
                    background: rgb(255, 0, 0);
                    color: #fff;
                }

                .btn-cancel:hover {
                    background: #ff6666;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(255, 0, 0, 0.3);
                }

                .empty-order {
                    text-align: center;
                    color: #9394a5;
                    font-size: 1.2rem;
                    margin-top: 50px;
                }

                .btn {
                    padding: 12px 25px;
                    border: none;
                    border-radius: 25px;
                    font-size: 1rem;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    font-family: 'Arial', sans-serif;
                    text-transform: uppercase;
                }

                .btn-primary {
                    background: #a3bffa;
                    color: white;
                }

                .btn-primary:hover {
                    background: #8c9eff;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(163, 191, 250, 0.3);
                }

                .loading-text,
                .error-text {
                    text-align: center;
                    font-size: 1.2rem;
                    margin-top: 50px;
                }

                .loading-text {
                    color: #a3bffa;
                }

                .error-text {
                    color: rgb(255, 0, 21);
                }

                .auth-message {
                    color: #9394a5;
                    font-size: 1.1rem;
                    text-align: center;
                    margin-bottom: 20px;
                }
            `}</style>

            <div className="order-history-container">
                <h1 className="order-history-title">Lịch Sử Đơn Hàng</h1>
                {orders.length > 0 ? (
                    <table className="order-table">
                        <thead>
                            <tr>
                                <th>Mã Đơn Hàng</th>
                                <th>Ngày Đặt</th>
                                <th>Tổng Tiền</th>
                                <th>Phương Thức</th>
                                <th>Trạng Thái</th>
                                <th>Hóa Đơn</th>
                                <th>Hành Động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id_order || Math.random()}>
                                    <td>DH{order.id_order || 'N/A'}</td>
                                    <td>{order.date_buy ? new Date(order.date_buy).toLocaleString('vi-VN') : 'Không xác định'}</td>
                                    <td>{(order.total_price || 0).toLocaleString('vi-VN')} VND</td>
                                    <td>{order.payment_method || 'Không xác định'}</td>
                                    <td>
                                        <span className={
                                            order.status === 'confirmed' ? 'status-confirmed' :
                                            order.status === 'pending' ? 'status-pending' :
                                            order.status === 'failed' ? 'status-failed' :
                                            order.status === 'canceled' ? 'status-canceled' :
                                            'status-unknown'
                                        }>
                                            {order.status === 'confirmed' ? 'Đã Xác Nhận' :
                                             order.status === 'pending' ? 'Đang Chờ' :
                                             order.status === 'failed' ? 'Thất Bại' :
                                             order.status === 'canceled' ? 'Hủy' :
                                             'Không xác định'}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-download"
                                            onClick={() => downloadInvoice(order.id_order)}
                                        >
                                            Tải xuống
                                        </button>
                                    </td>
                                    <td>
                                        {order.payment_method === 'COD' && order.status === 'pending' ? (
                                            <button
                                                className="btn-cancel"
                                                onClick={() => cancelOrder(order.id_order)}
                                            >
                                                Hủy Đơn
                                            </button>
                                        ) : order.payment_method === 'Chuyển khoản' ? (
                                            <button
                                                className="btn-contact"
                                                onClick={contactSupport}
                                            >
                                                Liên Hệ
                                            </button>
                                        ) : null}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-order">
                        Bạn chưa có đơn hàng nào.
                        <div style={{ marginTop: '20px' }}>
                            <button className="btn btn-primary" onClick={() => navigate('/')}>
                                Bắt đầu mua sắm
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}