import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModel from "../../models/authModel";

export default function InfoDetails() {
    const [adminInfo, setAdminInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDiv, setShowDiv] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        village: "",
        province: "",
        role: "",
        description: "",
        name: "",
    });
    const id = AuthModel.getIdAdmin();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfo = async () => {
            if (!id) {
                setError("Không tìm thấy ID admin");
                setLoading(false);
                return;
            }

            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/get-info-admin/${id}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const text = await response.text(); // Lấy nội dung thô trước
                if (!text) {
                    throw new Error("Phản hồi từ server rỗng");
                }

                const data = JSON.parse(text); // Parse JSON thủ công để kiểm soát lỗi
                if (!data.data) {
                    throw new Error("Dữ liệu admin không tồn tại trong phản hồi");
                }

                setAdminInfo(data.data);
                setFormData({
                    firstName: data.data.first_name_admin || "",
                    lastName: data.data.last_name_admin || "",
                    email: data.data.email_admin || "",
                    phone: data.data.phone_number_admin || "",
                    address: data.data.address_admin || "",
                    village: data.data.village_admin || "",
                    province: data.data.province_admin || "",
                    role: data.data.role_job || "",
                    description: "",
                    name: "",
                });
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
        return date.toLocaleDateString("vi-VN");
    };

    const handleShow = () => {
        setShowDiv(!showDiv);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name) {
            setError("Vui lòng chọn tiêu đề đơn đề xuất");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/info-request/${id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Lỗi khi gửi yêu cầu chỉnh sửa: ${response.status} - ${errorText || "Không có chi tiết lỗi"}`);
            }

            const text = await response.text(); // Lấy nội dung thô trước
            const data = text ? JSON.parse(text) : {}; // Parse nếu có dữ liệu, nếu không thì trả về object rỗng
            console.log("Response data:", data);
            alert("Đề xuất biểu mẫu thành công!");
            localStorage.setItem("report", JSON.stringify(data.id_admin_information_required));
            navigate(`/admin/report/${id}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
            setShowDiv(false);
        }
    };

    if (loading) {
        return (
            <div style={{ padding: "20px", textAlign: "center" }}>
                <p>Loading admin information...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
                <p>Error: {error}</p>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            <h1 style={{ fontSize: "24px", color: "#333", textTransform: "uppercase", textAlign: "center" }}>
                Thông tin chi tiết của {adminInfo?.last_name_admin} {adminInfo?.first_name_admin}
            </h1>
            {adminInfo ? (
                <div>
                    <table style={{ width: "960px", borderCollapse: "collapse", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Họ và tên</th>
                                <th style={tableHeaderStyle}>Số điện thoại</th>
                                <th style={tableHeaderStyle}>Email</th>
                                <th style={tableHeaderStyle}>Địa chỉ</th>
                                <th style={tableHeaderStyle}>Ngày tạo</th>
                                <th style={tableHeaderStyle}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style={tableCellStyle}>
                                    {adminInfo.last_name_admin} {adminInfo.first_name_admin}
                                </td>
                                <td style={tableCellStyle}>{adminInfo.phone_number_admin}</td>
                                <td style={tableCellStyle}>{adminInfo.email_admin}</td>
                                <td style={tableCellStyle}>
                                    {adminInfo.address_admin}, {adminInfo.village_admin}, {adminInfo.province_admin}
                                </td>
                                <td style={tableCellStyle}>{formatDateVN(adminInfo.date_create_account)}</td>
                                <td style={tableCellStyle}>
                                    <button style={buttonStyle} onClick={handleShow}>
                                        Đề xuất chỉnh sửa
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                    {showDiv && (
                        <div style={{ marginTop: "20px", padding: "20px", backgroundColor: "#f8f9fa", borderRadius: "4px", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                            <h2 style={{ fontSize: "24px", color: "#333", textTransform: "uppercase", textAlign: "center" }}>
                                Đơn đề xuất chỉnh sửa thông tin
                            </h2>
                            <form style={formStyle} onSubmit={handleSubmit}>
                                <label style={labelStyle}>Tiêu đề đơn đề xuất</label>
                                <select name="name" style={inputStyle2} value={formData.name} onChange={handleInputChange}>
                                    <option value="">Vui lòng chọn tiêu đề!</option>
                                    <option value="Đề xuất đổi họ">Đề xuất đổi họ</option>
                                    <option value="Đề xuất đổi tên">Đề xuất đổi tên</option>
                                    <option value="Đề xuất đổi số điện thoại">Đề xuất đổi số điện thoại</option>
                                    <option value="Đề xuất đổi email">Đề xuất đổi email</option>
                                    <option value="Đề xuất đổi địa chỉ">Đề xuất đổi địa chỉ</option>
                                    <option value="Đề xuất đổi chức vụ">Đề xuất đổi chức vụ</option>
                                    <option value="Đề xuất đổi nhiều thông tin">Đề xuất đổi nhiều thông tin</option>
                                </select>

                                <label style={labelStyle}>Họ</label>
                                <input name="lastName" value={formData.lastName} onChange={handleInputChange} style={inputStyle} />

                                <label style={labelStyle}>Tên</label>
                                <input name="firstName" value={formData.firstName} onChange={handleInputChange} style={inputStyle} />

                                <label style={labelStyle}>Số điện thoại</label>
                                <input name="phone" value={formData.phone} onChange={handleInputChange} style={inputStyle} type="tel" />

                                <label style={labelStyle}>Email</label>
                                <input name="email" value={formData.email} onChange={handleInputChange} style={inputStyle} type="email" />

                                <label style={labelStyle}>Địa chỉ</label>
                                <div style={{ marginLeft: "20px" }}>
                                    <label style={labelStyle}>Số nhà/ Đường</label>
                                    <input name="address" value={formData.address} onChange={handleInputChange} style={inputStyle1} />

                                    <label style={labelStyle}>Huyện</label>
                                    <input name="village" value={formData.village} onChange={handleInputChange} style={inputStyle1} />

                                    <label style={labelStyle}>Tỉnh/ Thành phố</label>
                                    <input name="province" value={formData.province} onChange={handleInputChange} style={inputStyle1} />
                                </div>

                                <label style={labelStyle}>Chức vụ</label>
                                <input name="role" value={formData.role} onChange={handleInputChange} style={inputStyle} />

                                <label style={labelStyle}>Mô tả</label>
                                <textarea
                                    name="description"
                                    placeholder="Ghi rõ tình trạng của đơn chỉnh sửa thông tin!"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    style={{ ...inputStyle, minHeight: "100px", resize: "vertical" }}
                                />

                                <button
                                    type="submit"
                                    style={buttonStyle1}
                                    onMouseOver={(e) => (e.target.style.backgroundColor = "#218838")}
                                    onMouseOut={(e) => (e.target.style.backgroundColor = "#28a745")}
                                >
                                    Gửi yêu cầu chỉnh sửa
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            ) : (
                <p style={{ textAlign: "center", color: "#777" }}>No admin information available.</p>
            )}
        </div>
    );
}

// Reusable styles (giữ nguyên như cũ)
const tableHeaderStyle = {
    padding: "12px 15px",
    textAlign: "center",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f5f5f5",
    color: "#666",
    fontWeight: 600,
    textTransform: "uppercase",
    fontSize: "14px",
};

const tableCellStyle = {
    padding: "12px 15px",
    borderBottom: "1px solid #ddd",
    color: "#333",
    fontSize: "14px",
    textAlign: "center",
};

const buttonStyle = {
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    padding: "8px 12px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    transition: "background-color 0.3s ease",
};

const formStyle = {
    width: "100%",
    maxWidth: "500px",
    margin: "20px auto",
    padding: "20px",
    background: "#f8f9fa",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
};

const labelStyle = {
    fontWeight: "bold",
    marginTop: "10px",
    display: "block",
};

const inputStyle = {
    width: "480px",
    padding: "8px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
};

const inputStyle2 = {
    width: "500px",
    padding: "8px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
};

const inputStyle1 = {
    width: "460px",
    padding: "8px",
    marginTop: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "16px",
};

const buttonStyle1 = {
    width: "100%",
    padding: "10px",
    fontSize: "16px",
    color: "white",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    backgroundColor: "#28a745",
    transition: "background-color 0.3s",
    marginTop: "15px",
};