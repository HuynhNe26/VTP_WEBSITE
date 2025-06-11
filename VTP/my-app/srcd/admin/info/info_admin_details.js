import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModel from "../../models/authModel";

export default function InfoAdminDetails() {
    const [adminInfo, setAdminInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDiv, setShowDiv] = useState(false);
    const [check, setCheck] = useState(null);
    const [report, setReport] = useState([]);
    const [formData, setFormData] = useState({
        lastName: "",
        firstName: "",
        phone: "",
        email: "",
        address: "",
        village: "",
        province: "",
        role: "",
        name: "",
        description: "",
        idRequired: "",
    });
    const id = sessionStorage.getItem("id_admin_details");
    const navigate = useNavigate();

    useEffect(() => {
        const fetchInfo = async () => {
            if (!id) {
                setError("Không tìm thấy ID admin trong session");
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

                const text = await response.text();
                if (!text) {
                    throw new Error("Phản hồi từ server rỗng");
                }

                const data = JSON.parse(text);
                console.log("API response:", data);
                setAdminInfo(data.data || {});
                setCheck(data.check || null);
                if (Array.isArray(data.check)) {
                    setReport(data.check);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInfo();
    }, [id]);

    const handleSelectChange = async (e) => {
        const selectedId = e.target.value;
        
        setFormData((prev) => ({ ...prev, name: selectedId }));

        if (selectedId) {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/get-data/${selectedId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                console.log("Selected data:", data);

                if (data && data.length > 0) {
                    const adminData = data[0];
                    setFormData((prev) => ({
                        ...prev,
                        lastName: adminData.last_name_admin_required || "",
                        firstName: adminData.first_name_admin_required || "",
                        phone: adminData.phone_number_admin_required || "",
                        email: adminData.email_admin_required || "",
                        address: adminData.address_admin_required || "",
                        village: adminData.village_admin_required || "",
                        province: adminData.province_admin_required || "",
                        role: adminData.role_job_required || "",
                        name: selectedId,
                        description: adminData.description || "",
                        idRequired: adminData.id_admin || "",
                    }));
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        } else {
            setFormData({
                lastName: "",
                firstName: "",
                phone: "",
                email: "",
                address: "",
                village: "",
                province: "",
                role: "",
                name: "",
                description: "",
                idRequired: "",
            });
        }
    };

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
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/change-info-admin/${formData.idRequired}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    lastName: formData.lastName,
                    firstName: formData.firstName,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    village: formData.village,
                    province: formData.province,
                    role: formData.role,
                }),
            });

            const text = await response.text();

            if (!response.ok) {
                throw new Error(`Lỗi khi cập nhật thông tin: ${response.status} - ${text || "Không có chi tiết lỗi"}`);
            }

            const data = text ? JSON.parse(text) : {};
            alert("Chỉnh sửa thông tin thành công!");
            navigate(`/admin/manage_admin/info_details/${id}`);
            setShowDiv(showDiv);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
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
                    <table style={{ width: "1200px", borderCollapse: "collapse", backgroundColor: "#fff", boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)" }}>
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Họ và tên</th>
                                <th style={tableHeaderStyle}>Số điện thoại</th>
                                <th style={tableHeaderStyle}>Email</th>
                                <th style={tableHeaderStyle}>Địa chỉ</th>
                                <th style={tableHeaderStyle}>Ngày tạo</th>
                                {check && <th style={tableHeaderStyle}>Hành động</th>}
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
                                {check && (
                                    <td style={tableCellStyle}>
                                        <button style={buttonStyle} onClick={handleShow}>
                                            Sửa thông tin
                                        </button>
                                    </td>
                                )}
                            </tr>
                        </tbody>
                    </table>

                    {showDiv && check ? (
                        <div>
                            <div style={{ marginBottom: "20px" }}>
                                <label style={labelStyle}>Đơn đề xuất</label>
                                <select
                                    name="name"
                                    style={inputStyle}
                                    value={formData.name}
                                    onChange={handleSelectChange}
                                >
                                    <option value="">Chọn đơn đề xuất</option>
                                    {report.length > 0 ? (
                                        report.map((item) => (
                                            <option key={item.id_admin_information_required} value={item.id_admin_information_required}>
                                                {item.name_required}
                                            </option>
                                        ))
                                    ) : (
                                        <option value="">Không có đơn đề xuất</option>
                                    )}
                                </select>
                            </div>
                            <div style={formStyle}>
                                <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
                                    ĐỔI THÔNG TIN CHI TIẾT CỦA {adminInfo.last_name_admin} {adminInfo.first_name_admin}
                                </h2>
                                <form onSubmit={handleSubmit}>
                                    <label style={labelStyle}>Họ</label>
                                    <input
                                        style={inputStyle}
                                        name="lastName"
                                        type="text"
                                        value={formData.lastName}
                                        onChange={handleInputChange}
                                    />

                                    <label style={labelStyle}>Tên</label>
                                    <input
                                        style={inputStyle}
                                        name="firstName"
                                        type="text"
                                        value={formData.firstName}
                                        onChange={handleInputChange}
                                    />

                                    <label style={labelStyle}>Số điện thoại</label>
                                    <input
                                        style={inputStyle}
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                    />

                                    <label style={labelStyle}>Email</label>
                                    <input
                                        style={inputStyle}
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                    />

                                    <label style={labelStyle}>Địa chỉ</label>
                                    <div style={{ marginLeft: "30px" }}>
                                        <label style={labelStyle}>Số nhà/ Đường</label>
                                        <input
                                            style={inputStyle1}
                                            name="address"
                                            type="text"
                                            value={formData.address}
                                            onChange={handleInputChange}
                                        />

                                        <label style={labelStyle}>Huyện</label>
                                        <input
                                            style={inputStyle1}
                                            name="village"
                                            type="text"
                                            value={formData.village}
                                            onChange={handleInputChange}
                                        />

                                        <label style={labelStyle}>Tỉnh</label>
                                        <input
                                            style={inputStyle1}
                                            name="province"
                                            type="text"
                                            value={formData.province}
                                            onChange={handleInputChange}
                                        />
                                    </div>

                                    <label style={labelStyle}>Chức vụ</label>
                                    <input
                                        style={inputStyle}
                                        name="role"
                                        type="text"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                    />

                                    <label style={labelStyle}>Mô tả</label>
                                    <textarea
                                        style={inputStyle2}
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                    />

                                    <input type="hidden" name="idRequired" value={formData.idRequired} />
                                    <button type="submit" style={buttonStyle1}>
                                        Xác nhận đổi thông tin
                                    </button>
                                </form>
                            </div>
                        </div>
                    ) : (
                        showDiv && <p style={{ textAlign: "center", color: "#777" }}>Không có đơn đề xuất để sửa.</p>
                    )}

                    {!showDiv && (
                        <div style={{ marginTop: "20px", textAlign: "center" }}>
                            <button style={buttonStyle} onClick={() => navigate(-1)}>
                                Quay lại
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <p style={{ textAlign: "center", color: "#777" }}>Chưa có thông tin quản trị viên!</p>
            )}
        </div>
    );
}

// Styles giữ nguyên
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