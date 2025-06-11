import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ForgetPassword() {
    const navigate = useNavigate();
    const [forget, setForget] = useState({
        username: "",
        email: "",
        phone: "",
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [useEmail, setUseEmail] = useState(true); // Thay `show` bằng tên rõ ràng hơn

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForget((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const payload = useEmail
            ? { username: forget.username, email: forget.email }
            : { username: forget.username, phone: forget.phone };

        try {
            const response = await fetch("http://localhost:5000/check-info", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                const username = data.data.username; 
                sessionStorage.setItem("username", username);
                navigate(`/forget_password/${username}`);
            } else {
                setError(data.message || "Thông tin không khớp");
            }
        } catch (error) {
            setError("Lỗi kết nối đến server");
        } finally {
            setLoading(false);
        }
    };

    // Internal CSS
    const styles = {
        container: {
            maxWidth: "400px",
            margin: "50px auto",
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
        button: {
            width: "100%",
            padding: "10px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px",
            transition: "background-color 0.3s",
        },
        toggleButton: {
            width: "100%",
            padding: "10px",
            backgroundColor: "#6c757d",
            color: "white",
            border: "none",
            borderRadius: "4px",
            fontSize: "16px",
            cursor: "pointer",
            marginTop: "10px",
            transition: "background-color 0.3s",
        },
        error: {
            color: "red",
            textAlign: "center",
            marginBottom: "15px",
        },
        loading: {
            textAlign: "center",
            color: "#555",
            marginBottom: "15px",
        },
    };

    if (loading) {
        return <div style={styles.loading}>Đang kiểm tra thông tin...</div>;
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Quên Mật Khẩu</h2>
            {error && <div style={styles.error}>{error}</div>}
            <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Tên đăng nhập</label>
                    <input
                        type="text"
                        name="username"
                        value={forget.username}
                        onChange={handleChange}
                        placeholder="Nhập tên đăng nhập"
                        required
                        style={styles.input}
                    />
                </div>
                {useEmail ? (
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={forget.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            required
                            style={styles.input}
                        />
                    </div>
                ) : (
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Số điện thoại</label>
                        <input
                            type="tel"
                            name="phone"
                            value={forget.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                            required
                            style={styles.input}
                        />
                    </div>
                )}
                <button
                    type="button"
                    onClick={() => setUseEmail(!useEmail)}
                    style={styles.toggleButton}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#5a6268")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#6c757d")}
                >
                    {useEmail ? "Dùng số điện thoại" : "Dùng email"}
                </button>
                <button
                    type="submit"
                    style={styles.button}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
                >
                    Xác nhận thông tin
                </button>
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    style={styles.button}
                    onMouseEnter={(e) => (e.target.style.backgroundColor = "#0056b3")}
                    onMouseLeave={(e) => (e.target.style.backgroundColor = "#007bff")}
                >
                    Quay lại
                </button>
            </form>
        </div>
    );
}