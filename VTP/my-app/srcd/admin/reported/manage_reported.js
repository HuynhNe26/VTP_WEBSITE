import React, { useState, useEffect } from "react";
import dayjs from "dayjs";

export default function ManageReported() {
    const [reports, setReports] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true);
            try {
                const response = await fetch("http://localhost:5000/get-report", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(
                        `HTTP error! Status: ${response.status} - ${response.statusText}`
                    );
                }

                const data = await response.json();
                console.log("API Response:", data.data); 
                setReports(Array.isArray(data.data) ? data.data : []);
            } catch (err) {
                console.error("Fetch error:", err);
                setError(
                    err.message || "Không thể kết nối đến server. Vui lòng thử lại sau."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchReports();
    }, []);

    if (loading) return <div style={{ marginLeft: "300px" }}>Đang tải dữ liệu...</div>;
    if (error) return (
        <div style={{color: "red" }}>
            Lỗi: {error}
            <button 
                onClick={() => window.location.reload()} 
                style={{
                    marginLeft: "10px",
                    padding: "5px 10px",
                    border: "none",
                    backgroundColor: "#007bff",
                    color: "#fff",
                    cursor: "pointer",
                    borderRadius: "5px"
                }}
            >
                Thử lại
            </button>
        </div>
    );

    return (
        <div style={{ padding: "20px" }}>
            <h2 style={{ marginBottom: "20px" }}>ĐƠN ĐỀ XUẤT</h2>
            {reports.length > 0 ? (
                        <table style={tableStyle}>
                            <thead>
                                <tr style={tableHeaderRowStyle}>
                                    <th style={tableHeaderStyle}>STT</th>
                                    <th style={tableHeaderStyle}>Tên Đơn</th>
                                    <th style={tableHeaderStyle}>Ngày Tạo</th>
                                    <th style={tableHeaderStyle}>Hành Động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reports.map((item, index) => (
                                    <tr 
                                        key={item.id || index} 
                                        style={{ 
                                            borderBottom: "1px solid #ddd",
                                            backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                                            cursor: "pointer",
                                            transition: "background-color 0.2s",
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#f1f1f1"}
                                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "#f9f9f9" : "#fff"}
                                    >
                                        <td style={tableCellStyle}>{index + 1}</td>
                                        <td style={tableCellStyle}>
                                            {item.name_required || item.name || "Không có tên"}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {item.create_at 
                                                ? dayjs(item.create_at).format("DD/MM/YYYY HH:mm") 
                                                : "Không xác định"}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {item.status || "Chưa xử lý"}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
            ): (
                <div>Không có dữ liệu nào</div>
            )}
        </div>
    );
}

// Styles cho table
const tableStyle = {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#fff",
    boxShadow: "0px 4px 8px rgba(0,0,0,0.1)",
    borderRadius: "5px",
    overflow: "hidden"
};

const tableHeaderRowStyle = {
    backgroundColor: "#f5f5f5",
};

const tableHeaderStyle = {
    padding: "12px",
    textAlign: "left",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold",
};

const tableCellStyle = {
    padding: "12px",
    textAlign: "left",
};

