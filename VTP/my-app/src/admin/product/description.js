import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

export default function Description() {
    const navigate = useNavigate();
    const id = sessionStorage.getItem('idDescription');
    const [description, setDescription] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDescription = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/get-description/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setDescription(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDescription();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDescription(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/updateDescription/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    description: description.description_protect,
                    description1: description.description_protect1,
                    description2: description.description_protect2,
                    description3: description.description_protect3,
                    description4: description.description_protect4,
                    width: description.description_width,
                    height: description.description_height,
                    weight: description.description_weight,
                    cubic: description.description_cubic,
                    packed: description.description_packed,
                    finish: description.description_finish,
                })
            });
            const data = await response.json();
            if (response.ok) {
                setDescription(data);
                navigate(`/admin/manage_product/${id}`);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (error) {
        return <div className="error">Error: {error}</div>;
    }

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="description-container">
            <h2>MÔ TẢ</h2>
            {description && Object.keys(description).length > 0 ? (
                <form onSubmit={handleSubmit} className="description-form">
                    <div className="form-group">
                        <label>Mô tả 1:</label>
                        <textarea
                            name="description_protect"
                            value={description.description_protect || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mô tả 2:</label>
                        <textarea
                            name="description_protect1"
                            value={description.description_protect1 || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mô tả 3:</label>
                        <textarea
                            name="description_protect2"
                            value={description.description_protect2 || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mô tả 4:</label>
                        <textarea
                            name="description_protect3"
                            value={description.description_protect3 || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Mô tả 5:</label>
                        <textarea
                            name="description_protect4"
                            value={description.description_protect4 || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Chiều rộng (cm):</label>
                        <input
                            name="description_width"
                            value={description.description_width || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Chiều cao (cm):</label>
                        <input
                            name="description_height"
                            value={description.description_height || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Cân nặng (kg):</label>
                        <input
                            name="description_weight"
                            value={description.description_weight || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Thể tích:</label>
                        <input
                            name="description_cubic"
                            value={description.description_cubic || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Đóng gói:</label>
                        <input
                            name="description_packed"
                            value={description.description_packed || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Loại sơn:</label>
                        <input
                            name="description_finish"
                            value={description.description_finish || ''}
                            onChange={handleChange}
                        />
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? 'Đang sửa...' : 'Sửa mô tả'}
                    </button>
                </form>
            ) : (
                <div className="no-data">
                    <p>Lỗi! Không có thông tin. Vui lòng thử lại!</p>
                    <button onClick={() => window.location.reload()}>Thử lại</button>
                </div>
            )}
            <style jsx>{`
                .description-container {
                    max-width: 800px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                h2 {
                    text-align: center;
                    color: #333;
                    margin-bottom: 20px;
                }

                .description-form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                }

                label {
                    font-weight: bold;
                    margin-bottom: 5px;
                    color: #555;
                }

                textarea, input {
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    resize: vertical;
                }

                textarea {
                    min-height: 100px;
                }

                input {
                    height: 40px;
                }

                button {
                    padding: 12px;
                    background-color: #007bff;
                    color: white;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 16px;
                    margin-top: 10px;
                }

                button:disabled {
                    background-color: #cccccc;
                    cursor: not-allowed;
                }

                button:hover:not(:disabled) {
                    background-color: #0056b3;
                }

                .error {
                    color: red;
                    text-align: center;
                    padding: 20px;
                }

                .loading {
                    text-align: center;
                    padding: 20px;
                    color: #666;
                }

                .no-data {
                    text-align: center;
                    padding: 20px;
                }

                .no-data p {
                    color: #ff4444;
                    margin-bottom: 10px;
                }

                .no-data button {
                    background-color: #ff4444;
                }

                .no-data button:hover {
                    background-color: #cc0000;
                }
            `}</style>
        </div>
    );
}