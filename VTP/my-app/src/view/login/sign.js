import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Sign() {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        province: "",
        district: "",
        sex: "",
        dateofbirth: "",
        phone: "",
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const navigate = useNavigate();

    // Fetch provinces on mount
    useEffect(() => {
        fetch("https://provinces.open-api.vn/api/p/")
            .then((res) => res.json())
            .then((data) => setProvinces(data))
            .catch((error) => console.error("Error fetching provinces:", error));
    }, []);

    // Fetch districts when province changes
    useEffect(() => {
        if (inputs.province) {
            const selectedProvince = provinces.find((p) => p.name === inputs.province);
            if (selectedProvince) {
                fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
                    .then((res) => res.json())
                    .then((data) => setDistricts(data.districts || []))
                    .catch((error) => console.error("Error fetching districts:", error));
            }
        } else {
            setDistricts([]);
        }
    }, [inputs.province, provinces]);

    // Handle input changes
    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/sign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });
            const data = await response.json();
            if (response.ok) {
                navigate("/login");
            } else {
                console.error("Sign up failed:", data.message);
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    // Internal CSS defined as a styles object
    const styles = {
        container: {
            maxWidth: "500px",
            margin: "0 auto",
            padding: "20px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        },
        heading: {
            textAlign: "center",
            marginBottom: "20px",
            color: "#333",
        },
        formGroup: {
            marginBottom: "15px",
        },
        label: {
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
            color: "#555",
        },
        input: {
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
            boxSizing: "border-box",
        },
        textarea: {
            width: "100%",
            padding: "10px",
            border: "1px solid #ccc",
            borderRadius: "4px",
            fontSize: "16px",
            boxSizing: "border-box",
            resize: "vertical",
            minHeight: "80px",
        },
        button: {
            width: "100%",
            marginTop: '10px',
            padding: "12px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s",
        },
        button1: {
            width: "100%",
            marginTop: '10px',
            padding: "12px",
            backgroundColor: "#0FD816FF",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            transition: "background-color 0.3s",
        },
        buttonHover: {
            backgroundColor: "#0056b3",
        },
        buttonHover1: {
            backgroundColor: "#209F24FF",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Đăng Kí</h1>
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Tên Đăng Nhập</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={inputs.username}
                        onChange={handleChange}
                        placeholder="Vui lòng nhập tên đăng nhập!"
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Mật Khẩu</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={inputs.password}
                        onChange={handleChange}
                        placeholder="Vui lòng nhập mật khẩu!"
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Họ</label>
                    <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={inputs.firstName}
                        onChange={handleChange}
                        placeholder="VD: Nguyễn"
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Tên</label>
                    <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={inputs.lastName}
                        onChange={handleChange}
                        placeholder="VD: Văn A"
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Số Điện Thoại</label>
                    <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={inputs.phone}
                        onChange={handleChange}
                        placeholder="VD: 07483xxx"
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={inputs.email}
                        onChange={handleChange}
                        placeholder="VD: nguyenvana@gmail.com"
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Ngày Sinh</label>
                    <input
                        type="date"
                        id="dateofbirth"
                        name="dateofbirth"
                        value={inputs.dateofbirth}
                        onChange={handleChange}
                        required
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Giới Tính</label>
                    <select id="sex" name="sex" value={inputs.sex} onChange={handleChange} required style={styles.input}>
                        <option value="">-- Chọn Giới Tính --</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Tỉnh/ Thành phố</label>
                    <select id="province" name="province" value={inputs.province} onChange={handleChange} required style={styles.input}>
                        <option value="">-- Chọn Tỉnh/ Thành phố --</option>
                        {provinces.map((province) => (
                            <option key={province.code} value={province.name}>
                                {province.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Huyện</label>
                    <select
                        id="district"
                        name="district"
                        value={inputs.district}
                        onChange={handleChange}
                        disabled={!inputs.province}
                        required
                        style={styles.input}
                    >
                        <option value=""> -- Chọn Huyện -- </option>
                        {districts.map((district) => (
                            <option key={district.code} value={district.name}>
                                {district.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Địa Chỉ</label>
                    <textarea
                        id="address"
                        name="address"
                        value={inputs.address}
                        onChange={handleChange}
                        placeholder="Số nhà/ Đường, xã ..."
                        required
                        style={styles.textarea}
                    />
                </div>
                <button
                    type="submit"
                    style={styles.button}
                    onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
                    onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
                >
                    Đăng Kí
                </button>
                <Link to='/login' style={{textDecoration: 'none', color: 'white'}}>
                    <button
                        style={styles.button1}
                        onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover1.backgroundColor}
                        onMouseLeave={(e) => e.target.style.backgroundColor = styles.button1.backgroundColor}
                    >
                            Đăng Nhập
                    </button>
                </Link>
            </form>
        </div>
    );
}