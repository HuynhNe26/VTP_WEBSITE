import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthUser from '../../models/authUser';

export default function InfoUser() {
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

    console.log(info)

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
                            <span style={labelStyle}>Họ và tên:</span>
                            <p style={valueStyle}>
                                {info.first_name_user} {info.last_name_user}
                            </p>
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Giới tính:</span>
                            <p style={valueStyle}>
                                {info.sex}
                            </p>
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Ngày sinh:</span>
                            <p style={valueStyle}>
                                {info.dateofbirth}
                            </p>
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Số điện thoại:</span>
                            <p style={valueStyle}>
                                {info.phone_number_user}
                            </p>
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Email:</span>
                            <p style={valueStyle}>
                                {info.email}
                            </p>
                        </div>
                    </div>
                    <div style={infoSectionStyle}>
                        <div>
                            <span style={labelStyle}>Địa chỉ:</span>
                            <p style={valueStyle}>
                                {info.address}, {info.village}, {info.province}
                            </p>
                        </div>
                    </div>
                    <button style={buttonStyle} onClick={(e) => {navigate(`/change_info/${id}`)}}>
                        Chỉnh sửa thông tin
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