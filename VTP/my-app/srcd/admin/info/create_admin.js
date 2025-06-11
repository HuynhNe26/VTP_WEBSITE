import { Border } from 'docx';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateAdmin() {
    const [inputs, setInputs] = useState({
        username: '',
        factory: '',
        level: ''
    });
    const [factory, setFactory] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchFactory = async () => {
            try {
                const response = await fetch('http://localhost:5000/get-factory', {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });

                if (!response.ok) {
                    throw new Error(`Lỗi HTTP! Status: ${response.status}`);
                }

                const data = await response.json();
                setFactory(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchFactory();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/create-admin', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(inputs)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đã xảy ra lỗi khi tạo tài khoản!');
            }

            alert('Tạo tài khoản thành công!');
            sessionStorage.setItem('newAdmin', data.data.id_admin);
            navigate(`/admin/create_admin/${data.data.username_admin}`);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>THÊM TÀI KHOẢN QUẢN TRỊ VIÊN</h1>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>Lỗi: {error}</div>}

            <form style={styles.form} onSubmit={handleSubmit}>
                <label style={{ paddingBottom: '50px' }}>Tên đăng nhập</label>
                <br />
                <input style={styles.input}
                    name="username"
                    type="text"
                    value={inputs.username}
                    onChange={handleChange}
                    required
                />
                <br />

                <label>ID Công ty</label>
                <br />
                <select style={styles.input} name="factory" value={inputs.factory} onChange={handleChange} required>
                    <option style={styles.input} value="">Vui lòng chọn chi nhánh công ty!</option>
                    {factory.map((item) => (
                        <option style={styles.input} key={item.id_factory} value={item.id_factory}>
                            {item.name_factory}
                        </option>
                    ))}
                </select>
                <br />

                <label>Quyền</label>
                <br />
                <select style={styles.input} name="level" value={inputs.level} onChange={handleChange} required>
                    <option style={styles.input} value="">Vui lòng chọn quyền!</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                </select>
                <br />

                <button style={styles.button} type='submit' disabled={loading}>
                    {loading ? 'Đang xử lý...' : 'Thêm quản trị viên'}
                </button>
            </form>
        </div>
    );
}
const styles = {
    container: {
        padding: '5px 10px 5px 10px',
        fontFamily: 'system-ui',
    },
    title: {
        color: '#002856',
        fontSize: '20px',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    input: {
        width: '220px',
        height: '25px',
        margin: '5px 0px 5px 0px ',
        borderRadius: '5px',
    },
    form: {
        color: '#002856',
        fontWeight: 'bold',
        paddingBottom: '10px',
        marginLeft: '370px',
        fontSize: '15px'
    },
    button: {
        width: '150px',
        height: '30px',
        margin: '10px 0px 5px 40px ',
        borderRadius: '10px',
        textAlign: 'center',
        color: 'white',
        background: '#002856',
        fontWeight: '550'
    },
}
