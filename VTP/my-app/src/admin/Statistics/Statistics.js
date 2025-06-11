import React, { useState, useEffect } from "react";
import AuthModel from "../../models/authModel";

export default function Statistics() {
    // Khai báo trạng thái
    const [stats, setStats] = useState(null); // Dữ liệu thống kê
    const [loading, setLoading] = useState(true); // Trạng thái tải
    const [error, setError] = useState(null); // Lỗi nếu có
    const id = AuthModel.getIdAdmin(); // Lấy ID admin từ AuthModel

    // Tải dữ liệu từ API khi component được mount
    useEffect(() => {
        const fetchStatistics = async () => {
            setLoading(true); // Bắt đầu tải
            try {
                const response = await fetch(`http://localhost:5000/get-statistics`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Id": `${id}`, // Gửi ID admin trong header
                    },
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "Lỗi khi tải dữ liệu thống kê");
                }

                const data = await response.json();
                setStats(data); // Cập nhật dữ liệu thống kê
            } catch (err) {
                setError(err.message); // Lưu lỗi nếu có
            } finally {
                setLoading(false); // Kết thúc tải
            }
        };

        fetchStatistics();
    }, [id]); // Chạy lại nếu ID thay đổi

    // Hiển thị khi đang tải
    if (loading) {
        return <div style={styles.loading}>Đang tải dữ liệu...</div>;
    }

    // Hiển thị khi có lỗi
    if (error) {
        return <div style={styles.error}>Lỗi: {error}</div>;
    }

    // Giao diện chính
    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Thống Kê</h1>
            {stats ? (
                <div style={styles.content}>
                    {/* Các thẻ thông tin */}
                    <div style={styles.stats}>
                        <div style={styles.statCard}>
                            <h2>Doanh thu</h2>
                            <p>{stats.revenue.toLocaleString()} VNĐ</p>
                        </div>
                        <div style={styles.statCard}>
                            <h2>Tổng đơn hàng</h2>
                            <p>{stats.totalOrders}</p>
                        </div>
                        <div style={styles.statCard}>
                            <h2>Đơn hàng đang chờ</h2>
                            <p>{stats.pendingOrders}</p>
                        </div>
                        <div style={styles.statCard}>
                            <h2>Đơn hàng đã giao</h2>
                            <p>{stats.deliveredOrders}</p>
                        </div>
                        <div style={styles.statCard}>
                            <h2>Đơn hàng bị hủy</h2>
                            <p>{stats.canceledOrders}</p>
                        </div>
                    </div>

                    {/* Bảng dữ liệu */}
                    <div style={styles.tables}>
                        {/* Top 5 sản phẩm bán chạy */}
                        <div style={styles.table}>
                            <h2>Top 5 sản phẩm bán chạy</h2>
                            <table style={styles.tableElement}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>STT</th>
                                        <th style={styles.th}>Tên sản phẩm</th>
                                        <th style={styles.th}>Số lượng bán</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.topProducts.map((product, index) => (
                                        <tr key={index} style={styles.tr}>
                                            <td style={styles.td}>{index + 1}</td>
                                            <td style={styles.td}>{product.name}</td>
                                            <td style={styles.td}>{product.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Tồn kho */}
                        <div style={styles.table}>
                            <h2>Tồn kho</h2>
                            <table style={styles.tableElement}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>Tên sản phẩm</th>
                                        <th style={styles.th}>Số lượng tồn</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {stats.inventory.map((product, index) => (
                                        <tr key={index} style={styles.tr}>
                                            <td style={styles.td}>{product.name}</td>
                                            <td style={styles.td}>{product.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div style={styles.noData}>Không có dữ liệu thống kê</div>
            )}
        </div>
    );
}

// CSS inline
const styles = {
    container: {
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
    },
    title: {
        color: "#1a73e8",
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "28px",
        fontWeight: "bold",
    },
    stats: {
        display: "flex",
        justifyContent: "space-around",
        marginBottom: "20px",
    },
    statCard: {
        backgroundColor: "#e0e0e0",
        padding: "20px",
        borderRadius: "5px",
        textAlign: "center",
        width: "18%",
    },
    tables: {
        display: "flex",
        justifyContent: "space-around",
    },
    table: {
        backgroundColor: "#e0e0e0",
        padding: "20px",
        borderRadius: "5px",
        width: "45%",
    },
    tableElement: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        backgroundColor: "#1a73e8",
        color: "#ffffff",
        padding: "12px",
        textAlign: "center",
        borderBottom: "2px solid #ffffff",
        fontWeight: "600",
        border: "1px solid #ddd",
    },
    tr: {
        borderBottom: "1px solid #ddd",
    },
    td: {
        padding: "15px",
        color: "#202124",
        textAlign: "center",
        border: "1px solid #ddd",
    },
    loading: {
        textAlign: "center",
        padding: "20px",
        fontSize: "18px",
    },
    error: {
        textAlign: "center",
        padding: "20px",
        color: "red",
        fontSize: "18px",
    },
    noData: {
        textAlign: "center",
        padding: "20px",
        fontSize: "18px",
    },
};