import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModel from "../../models/authModel";

export default function Reported() {
    const [report, setReport] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const id = AuthModel.getIdAdmin();

    useEffect(() => {
        const fetchReport = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/get-report/${id}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                const data = await response.json();
                
                if (!response.ok) throw new Error(data.message || "Lỗi khi lấy dữ liệu");

                setReport(Array.isArray(data.rows) ? data.rows : ['Không có danh sách']);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]); 

    const formatDateVN = (dateString) => {
        if (!dateString) return "Không xác định";
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return "N/A";

        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();

        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    const handleViewDetails = (reportId) => {
        sessionStorage.setItem("id_report", reportId);
        navigate(`report-details/${reportId}`);
    };

    if (loading) return <div style={styles.loading}>Đang tải dữ liệu...</div>;
    if (error) return <div style={styles.error}>Lỗi: {error}</div>;

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>LỊCH SỬ ĐỀ XUẤT CHỈNH SỬA THÔNG TIN</h2>
            {report.length > 0 ? (
                <div style={styles.tableWrapper}>
                    <table style={styles.table}>
                        <thead>
                            <tr style={styles.tableHeader}>
                                <th style={styles.th}>STT</th>
                                <th style={styles.th}>Tên biểu mẫu</th>
                                <th style={styles.th}>Ngày tạo</th>
                                <th style={styles.th}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {report.map((item, index) => (
                                <tr
                                    key={item.id_admin_information_required || index}
                                    style={{
                                        ...styles.row,
                                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                                    }}
                                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#e0f7fa")}
                                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "white")}
                                >
                                    <td style={styles.td}>
                                        {item.id_admin_information_required ? (
                                            (index + 1)
                                        ): 
                                        (
                                            <p>N/A</p>
                                        )}
                                    </td>
                                    <td style={styles.td}>{item.description || "N/A"}</td>
                                    <td style={styles.td}>{formatDateVN(item.create_at || 'N/A')}</td>
                                    <td style={styles.td}>
                                    {item.id_admin_information_required ? (
                                        <button
                                            onClick={() => handleViewDetails(item.id_admin_information_required)}
                                            style={styles.button}
                                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1976D2")}
                                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#2196F3")}
                                        >
                                            Xem chi tiết
                                        </button>
                                    ): (
                                        <p>N/A</p>
                                    )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p style={styles.noData}>Không có dữ liệu báo cáo nào</p>
            )}
        </div>
    );
}

// ✅ Styles tối ưu
const styles = {
    container: { padding: "10px" },
    title: { textAlign: "center", fontSize: "22px", color: "#333", marginBottom: "20px" },
    loading: { textAlign: "center", fontSize: "18px", color: "#555" },
    error: { textAlign: "center", fontSize: "18px", color: "red" },
    tableWrapper: { boxShadow: "0 4px 8px rgba(0,0,0,0.1)", borderRadius: "8px", overflow: "hidden" },
    table: { width: "100%", borderCollapse: "collapse", fontFamily: "Arial, sans-serif" },
    tableHeader: { backgroundColor: "#3169BBFF", color: "white", textAlign: "center" },
    th: { padding: "12px", border: "1px solid #388E3C" },
    td: { padding: "5px", border: "1px solid #ddd", textAlign: "center" },
    row: { transition: "background-color 0.3s", textAlign: "center" },
    button: {
        padding: "8px 16px",
        backgroundColor: "#2196F3",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        transition: "background-color 0.3s",
    },
    noData: { textAlign: "center", fontSize: "16px", color: "#777" },
};
