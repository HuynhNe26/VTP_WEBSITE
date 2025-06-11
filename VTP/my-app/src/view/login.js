import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthUser from '../models/authModel'; 

export default function Login() {
    const [login, setLogin] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setLogin((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!login.username || !login.password) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu!');
            return;
        }

        setLoading(true);
        setError(null); // Reset lỗi trước khi gửi request

        try {
            const response = await fetch('http://localhost:5000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: login.username,
                    password: login.password,
                }),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Đăng nhập thất bại!');
            }

            // Lưu token bằng AuthUser
            AuthUser.saveToken(data.token);
            navigate('/'); // Điều hướng về trang chính
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Đăng Nhập</h2>
            {error && (
                <div style={styles.error}>
                    {error}
                </div>
            )}
            {loading && (
                <div style={styles.loading}>
                    Đang đăng nhập...
                </div>
            )}
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.field}>
                    <label style={styles.label}>Tên đăng nhập</label>
                    <input
                        type="text"
                        name="username"
                        value={login.username}
                        onChange={handleChange}
                        style={styles.input}
                        disabled={loading}
                        placeholder="Nhập tên đăng nhập"
                    />
                </div>
                <div style={styles.field}>
                    <label style={styles.label}>Mật khẩu</label>
                    <input
                        type="password"
                        name="password"
                        value={login.password}
                        onChange={handleChange}
                        style={styles.input}
                        disabled={loading}
                        placeholder="Nhập mật khẩu"
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        ...styles.button,
                        ...(loading ? styles.buttonDisabled : {}),
                    }}
                    disabled={loading}
                >
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                </button>
            </form>
            <button
                onClick={() => navigate('/sign')}
                style={styles.secondaryButton}
                disabled={loading}
            >
                Đăng ký
            </button>
        </div>
    );
}

// Styles
const styles = {
    container: {
        maxWidth: '400px',
        margin: '50px auto',
        padding: '20px',
        backgroundColor: '#fff',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        textAlign: 'center',
        color: '#333',
        marginBottom: '20px',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
    },
    label: {
        marginBottom: '5px',
        fontWeight: 'bold',
        color: '#555',
    },
    input: {
        padding: '10px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        fontSize: '16px',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    button: {
        padding: '10px',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        transition: 'background-color 0.2s',
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
        cursor: 'not-allowed',
    },
    secondaryButton: {
        marginTop: '10px',
        padding: '10px',
        backgroundColor: '#f0f0f0',
        color: '#333',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '16px',
        width: '100%',
    },
    error: {
        color: 'red',
        backgroundColor: '#ffebee',
        padding: '10px',
        borderRadius: '4px',
        marginBottom: '15px',
        textAlign: 'center',
    },
    loading: {
        color: '#1a73e8',
        padding: '10px',
        textAlign: 'center',
    },
};