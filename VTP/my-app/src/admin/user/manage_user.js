import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Manage_User() {
    const [user, setUser] = useState([]); // Danh sách người dùng
    const [search, setSearch] = useState(''); // Từ khóa tìm kiếm
    const [loading, setLoading] = useState(false);
    const [showButton, setShowButton] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await fetch('http://localhost:5000/get-user', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Không thể tải danh sách user');
                }
                const data = await response.json();
                setUser(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Ngăn reload trang
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/get-user/${search}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Không tìm thấy người dùng');
                
            }
            const data = await response.json();
            setUser(data.data);
            setShowButton(!showButton)
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa người dùng này?')) {
            navigate(`/admin/user/${id}/delete`);
        }
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setSearch(value); // Cập nhật từ khóa tìm kiếm
    };

    if (loading) {
        return (
            <div style={{
                padding: '20px',
                textAlign: 'center',
                color: '#666',
                fontSize: '16px',
            }}>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{
                padding: '20px',
                color: '#dc3545',
                backgroundColor: '#f8d7da',
                borderRadius: '4px',
                marginLeft: '00px',
            }}>
                <p style={{ margin: 0 }}>{error}</p>
                <button onClick={(e) => navigate(-1)}>Thử lại</button>
            </div>
        );
    }

    return (
        <div style={{
            padding: '5px',
            fontFamily: 'system-ui',
            maxWidth: '1200px',
        }}>
            <h1 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#002856',
                margin: '10px 0px 10px 0px',
            }}>
                QUẢN LÝ NGƯỜI DÙNG
            </h1>
            {user.length === 0 ? (
                <>
                    <p style={{
                        padding: '20px',
                        color: '#666',
                        fontSize: '16px',
                        backgroundColor: '#f8f9fa',
                        borderRadius: '4px',
                    }}>
                        Không có người dùng nào để hiển thị.
                    </p>
                    <button onClick={(e) => window.location.reload()}>Thử lại</button>
                </>
            ) : (
                <div>
                    <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
                        <input
                            name="search"
                            type="text"
                            value={search}
                            onChange={handleChange}
                            placeholder="Search"
                            style={{
                                padding: '8px',
                                width: '300px',
                                border: '1px solid #ccc',
                                borderRadius: '10px',
                                fontSize: '13px',
                                fontWeigth: '700',
                                color: '#aaa'
                            }}
                        />
                        <button
                            type="submit"
                            style={{
                                padding: '8px 16px',
                                marginLeft: '10px',
                                backgroundColor: '#002856',
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: 'pointer',
                                fontSize: '13px',
                                fontWeight: '500'
                            }}
                        >
                            Tìm kiếm
                        </button>
                    </form>
                    <table style={{
                        width: '100%',
                        borderCollapse: 'collapse',
                        backgroundColor: '#fff',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                        borderColor: ' #002856',
                        margin: '5px 10px 10px 0px'
                    }}>
                        <thead>
                            <tr>
                                <th style={{
                                    padding: '12px 15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: '#002856',
                                    color: 'white',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '14px',
                                    borderRight: '1px solid #ffffff',
                                }}>ID</th>
                                <th style={{
                                    padding: '12px 15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: '#002856',
                                    color: 'white',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '14px',
                                    borderRight: '1px solid #ffffff',
                                }}>Tên</th>
                                <th style={{
                                    padding: '12px 15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: '#002856',
                                    color: 'white',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '14px',
                                    borderRight: '1px solid #ffffff',
                                }}>Email</th>
                                <th style={{
                                    padding: '12px 15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: '#002856',
                                    color: 'white',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '14px',
                                    borderRight: '1px solid #ffffff',
                                }}>Điện thoại</th>
                                <th style={{
                                    padding: '12px 15px',
                                    textAlign: 'left',
                                    borderBottom: '1px solid #ddd',
                                    backgroundColor: '#002856',
                                    color: 'white',
                                    fontWeight: 600,
                                    textTransform: 'uppercase',
                                    fontSize: '14px',
                                }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {user.map((item) => (
                                <tr key={item.id_user} style={{ transition: 'background-color 0.3s' }}>
                                    <td style={{
                                        padding: '12px 15px',
                                        borderBottom: '1px solid #ddd',
                                        color: '#333',
                                        fontSize: '14px',
                                        borderRight: '1px solid #ffffff',
                                    }}>{item.id_user}</td>
                                    <td style={{
                                        padding: '12px 15px',
                                        borderBottom: '1px solid #ddd',
                                        color: '#333',
                                        fontSize: '14px',
                                        borderRight: '1px solid #ffffff',
                                    }}>{`${item.last_name_user} ${item.first_name_user}`}</td>
                                    <td style={{
                                        padding: '12px 15px',
                                        borderBottom: '1px solid #ddd',
                                        color: '#333',
                                        fontSize: '14px',
                                        borderRight: '1px solid #ffffff',
                                    }}>{item.email}</td>
                                    <td style={{
                                        padding: '12px 15px',
                                        borderBottom: '1px solid #ddd',
                                        color: '#333',
                                        fontSize: '14px',
                                        borderRight: '1px solid #ffffff',
                                    }}>{item.phone_number_user}</td>
                                    <td style={{
                                        padding: '12px 15px',
                                        borderBottom: '1px solid #ddd',
                                        color: '#333',
                                        fontSize: '14px',
                                        borderRight: '1px solid #ffffff',
                                    }}>
                                        <button
                                            onClick={() => {navigate(`${item.id_user}`)
                                        sessionStorage.setItem('idUser', item.id_user)}}
                                            style={{
                                                backgroundColor: '#002856',
                                                color: 'white',
                                                border: 'none',
                                                padding: '8px 12px',
                                                borderRadius: '4px',
                                                cursor: 'pointer',
                                                fontSize: '14px',
                                                marginRight: '10px',
                                                transition: 'background-color 0.3s ease',
                                            }}
                                            onMouseOver={(e) => (e.target.style.backgroundColor = '#aaa')}
                                            onMouseOut={(e) => (e.target.style.backgroundColor = '#002856')}
                                        >
                                            Xem chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}