import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthUser from '../../models/authUser';

export default function ChangeInfoUser() {
    const [info, setInfo] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const id = AuthUser.getIdUser();

    useEffect(() => {
        const fetchInfo = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/get-infoUser/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setInfo(data);
                    console.log('API Response:', data); // Kiểm tra dữ liệu
                } else {
                    setError(data.message || 'Không thể tải thông tin người dùng');
                }
            } catch (error) {
                setError('Lỗi kết nối server: ' + error.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchInfo();
        } else {
            setError('Không tìm thấy ID người dùng');
            setLoading(false);
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInfo((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch(`http://localhost:5000/update-infoUser/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(info),
            });
            const data = await response.json();
            if (response.ok) {
                alert('Cập nhật thông tin thành công!');
                navigate(`/info/${id}`); // Điều hướng sau khi cập nhật
            } else {
                setError(data.message || 'Không thể cập nhật thông tin');
            }
        } catch (error) {
            setError('Lỗi kết nối server: ' + error.message);
        }
    };

    // CSS styles
    const containerStyle = {
        padding: '20px',
        maxWidth: '600px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        minHeight: '100vh',
    };

    const headingStyle = {
        textAlign: 'center',
        color: '#333',
        fontSize: '2rem',
        marginBottom: '20px',
    };

    const infoSectionStyle = {
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        padding: '15px',
        backgroundColor: '#fff',
        borderRadius: '4px',
        border: '1px solid #ddd',
    };

    const labelStyle = {
        fontWeight: 'bold',
        color: '#555',
        fontSize: '1.1rem',
    };

    const valueStyle = {
        margin: '0',
        color: '#333',
        fontSize: '1rem',
    };

    const inputStyle = {
        width: '100%',
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '1rem',
        outline: 'none',
        transition: 'border-color 0.3s',
    };

    const errorStyle = {
        color: 'red',
        textAlign: 'center',
        fontSize: '1.1rem',
        marginTop: '20px',
    };

    const loadingStyle = {
        textAlign: 'center',
        color: '#007bff',
        fontSize: '1.1rem',
        marginTop: '20px',
    };

    const buttonStyle = {
        padding: '10px 20px',
        marginRight: '20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '1rem',
        marginTop: '20px',
        transition: 'background-color 0.3s',
    };

    const buttonHoverStyle = {
        backgroundColor: '#0056b3',
    };

    if (loading) {
        return <div style={loadingStyle}>Đang tải thông tin...</div>;
    }

    if (error) {
        return (
            <div style={containerStyle}>
                <div style={errorStyle}>{error}</div>
                <button
                    style={buttonStyle}
                    onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                    onClick={() => navigate(-1)}
                >
                    Quay lại
                </button>
            </div>
        );
    }

    return (
        <div style={containerStyle}>
            <h1 style={headingStyle}>Thông tin chi tiết</h1>
            {info ? (
                <>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Họ:</span>
                            <input
                                type="text"
                                name="last_name_user"
                                value={info.last_name_user || info.lastName || ''}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Tên:</span>
                            <input
                                type="text"
                                name="first_name_user"
                                value={info.first_name_user || info.firstName || ''}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Giới tính:</span>
                            <input
                                type="text"
                                name="sex"
                                value={info.sex || ''}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Ngày sinh:</span>
                            <input
                                type="date"
                                name="dateofbirth"
                                value={info.dateofbirth || ''}
                                onChange={handleChange}
                                style={inputStyle}
                                readOnly
                            />
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Số điện thoại:</span>
                            <input
                                type="text"
                                name="phone_number_user"
                                value={info.phone_number_user || info.phone || ''}
                                onChange={handleChange}
                                style={inputStyle}
                                readOnly
                            />
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Email:</span>
                            <input
                                type="email"
                                name="email"
                                value={info.email || ''}
                                onChange={handleChange}
                                style={inputStyle}
                            />
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Địa chỉ:</span>
                            <input
                                type="text"
                                name="address"
                                value={info.address || ''}
                                onChange={handleChange}
                                style={inputStyle}
                                readOnly
                            />
                        </div>
                        <div>
                            <span style={labelStyle}>Quận/Huyện:</span>
                            <input
                                type="text"
                                name="district"
                                value={info.district || info.village || ''}
                                onChange={handleChange}
                                style={inputStyle}
                                readOnly
                            />
                        </div>
                        <div>
                            <span style={labelStyle}>Tỉnh/Thành phố:</span>
                            <input
                                type="text"
                                name="province"
                                value={info.province || ''}
                                onChange={handleChange}
                                style={inputStyle}
                                readOnly
                            />
                        </div>
                    </div>
                    <button
                        style={buttonStyle}
                        onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                        onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                        onClick={handleSubmit}
                    >
                        Lưu thay đổi
                    </button>
                </>
            ) : (
                <p style={valueStyle}>Không có thông tin để hiển thị</p>
            )}
            <button
                style={buttonStyle}
                onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                onClick={() => navigate(-1)}
            >
                Quay lại
            </button>
        </div>
    );
}