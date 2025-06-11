import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductFix() {
    const [input, setInput] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const id = sessionStorage.getItem('id');
    const [showDiv, setShowDiv] = useState(false);
    const [image, setImage] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null
    });
    const [imagePreview, setImagePreview] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null
    });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/createProduct-details/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                const data = await response.json();
                if (response.ok) {
                    setInput(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage((prev) => ({ ...prev, [name]: file }));
                setImagePreview((prev) => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        Object.keys(image).forEach((key) => {
            if (image[key]) {
                formData.append(key, image[key]);
            }
        });

        try {
            const response = await fetch(`http://localhost:5000/updateProduct-images/${id}`, {
                method: 'PUT',
                body: formData
            });
            if (response.ok) {
                const updatedData = await response.json();
                setInput(updatedData);
                setShowDiv(false);
                setImagePreview({ image1: null, image2: null, image3: null, image4: null, image5: null }); // Reset previews
            } else {
                throw new Error('Failed to upload images');
            }
        } catch (err) {
            setError(err.message);
        }
    };

    if (loading) {
        return (
            <div className="loading-container">
                <h3>Đang tải thông tin sản phẩm...</h3>
                <style>{`
                    .loading-container {
                        margin-left: 300px;
                        text-align: center;
                    }
                    .loading-container h3 {
                        font-size: 18px;
                        color: #555;
                    }
                `}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h3>Lỗi: {error}</h3>
                <button onClick={() => setError(null)}>Thử lại</button>
                <style>{`
                    .error-container {
                        margin-left: 300px;
                        text-align: center;
                    }
                    .error-container h3 {
                        font-size: 18px;
                        color: #d9534f;
                    }
                    .error-container button {
                        background-color: #d9534f;
                        color: white;
                        padding: 8px 16px;
                        border: none;
                        border-radius: 4px;
                        cursor: pointer;
                        margin-top: 10px;
                    }
                    .error-container button:hover {
                        background-color: #c9302c;
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="product-fix-container">
            <h2>SỬA THÔNG TIN SẢN PHẨM</h2>
            <form className="product-form">
                <label>Tên sản phẩm</label>
                <input
                    type="text"
                    name="nameProduct"
                    value={input.name_product || ''}
                    onChange={handleChange}
                />
                <div className="image-gallery">
                    <div className="image-item">
                        <label>Hình ảnh 1</label>
                        <img src={input.image_product} alt="Product 1" />
                    </div>
                    <div className="image-item">
                        <label>Hình ảnh 2</label>
                        <img src={input.image_product1} alt="Product 2" />
                    </div>
                    <div className="image-item">
                        <label>Hình ảnh 3</label>
                        <img src={input.image_product2} alt="Product 3" />
                    </div>
                    <div className="image-item">
                        <label>Hình ảnh 4</label>
                        <img src={input.image_product3} alt="Product 4" />
                    </div>
                    <div className="image-item">
                        <label>Hình ảnh 5</label>
                        <img src={input.image_product4} alt="Product 5" />
                    </div>
                </div>
                <button
                    type="button"
                    onClick={(e) => {
                        e.preventDefault();
                        setShowDiv(!showDiv);
                    }}
                >
                    Sửa hình
                </button>
                <label>Đơn giá</label>
                <input
                    type="number"
                    name="price"
                    value={input.price || ''}
                    onChange={handleChange}
                />
                <label>Mô tả</label>
                <textarea
                    name="description"
                    value={input.description || ''}
                    onChange={handleChange}
                />
                <label>Chất liệu</label>
                <input
                    type="text"
                    name="material"
                    value={input.material || ''}
                    onChange={handleChange}
                />
                <label>Số lượng</label>
                <input
                    type="number"
                    name="quantity"
                    value={input.quantity || ''}
                    onChange={handleChange}
                />
                <br />
                <button type="submit">Sửa thông tin sản phẩm</button>
            </form>
            {showDiv && (
                <div className="edit-image-div">
                    <h2>SỬA HÌNH</h2>
                    <button
                        className="close-button"
                        onClick={() => setShowDiv(false)}
                    >
                        Đóng
                    </button>
                    <form onSubmit={handleImageSubmit}>
                        <div className="image-upload-row">
                            <div className="image-upload-item">
                                <label>Hình 1</label>
                                <input
                                    type="file"
                                    name="image1"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            {imagePreview.image1 && (
                                <img src={imagePreview.image1} alt="Preview 1" className="image-preview" />
                            )}
                        </div>
                        <div className="image-upload-row">
                            <div className="image-upload-item">
                                <label>Hình 2</label>
                                <input
                                    type="file"
                                    name="image2"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            {imagePreview.image2 && (
                                <img src={imagePreview.image2} alt="Preview 2" className="image-preview" />
                            )}
                        </div>
                        <div className="image-upload-row">
                            <div className="image-upload-item">
                                <label>Hình 3</label>
                                <input
                                    type="file"
                                    name="image3"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            {imagePreview.image3 && (
                                <img src={imagePreview.image3} alt="Preview 3" className="image-preview" />
                            )}
                        </div>
                        <div className="image-upload-row">
                            <div className="image-upload-item">
                                <label>Hình 4</label>
                                <input
                                    type="file"
                                    name="image4"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            {imagePreview.image4 && (
                                <img src={imagePreview.image4} alt="Preview 4" className="image-preview" />
                            )}
                        </div>
                        <div className="image-upload-row">
                            <div className="image-upload-item">
                                <label>Hình 5</label>
                                <input
                                    type="file"
                                    name="image5"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            {imagePreview.image5 && (
                                <img src={imagePreview.image5} alt="Preview 5" className="image-preview" />
                            )}
                        </div>
                        <button type='reset'> Xóa</button>
                        <button type="submit">Cập nhật hình ảnh</button>
                    </form>
                </div>
            )}
            <style>{`
                .product-fix-container {
                    padding: 20px;
                    font-family: Arial, sans-serif;
                }

                .product-fix-container h2 {
                    font-size: 24px;
                    color: #333;
                    margin-bottom: 20px;
                    text-align: center;
                    text-transform: uppercase;
                }

                .product-form {
                    position: relative;
                    background-color: #f9f9f9;
                    padding: 20px;
                    border-radius: 8px;
                    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
                }

                .product-form label {
                    display: block;
                    font-size: 16px;
                    color: #555;
                    margin-bottom: 5px;
                    font-weight: 500;
                }

                .product-form input,
                .product-form textarea {
                    width: 100%;
                    max-width: 500px;
                    padding: 10px;
                    margin-bottom: 15px;
                    border: 1px solid #ddd;
                    border-radius: 4px;
                    font-size: 14px;
                    color: #333;
                    box-sizing: border-box;
                }

                .product-form input[type="number"] {
                    -moz-appearance: textfield;
                }

                .product-form input::-webkit-outer-spin-button,
                .product-form input::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }

                .product-form textarea {
                    height: 100px;
                    resize: vertical;
                }

                .image-gallery {
                    display: flex;
                    gap: 20px;
                    padding: 15px;
                    flex-wrap: wrap;
                }

                .image-item {
                    text-align: center;
                }

                .image-item img {
                    width: 300px;
                    height: 200px;
                    object-fit: cover;
                    border-radius: 4px;
                    border: 1px solid #ddd;
                }

                .image-item label {
                    display: block;
                    margin-bottom: 5px;
                }

                .product-form button {
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    font-size: 16px;
                    cursor: pointer;
                    margin-top: 10px;
                    transition: background-color 0.3s ease;
                }

                .product-form button:hover {
                    background-color: #0056b3;
                }

                .edit-image-div {
                    position: absolute;
                    left: 27%;
                    top: 10%;
                    width: 900px;
                    height: 700px;
                    background-color: red;
                    border-radius: 8px;
                    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
                    padding: 20px;
                    overflow-y: auto;
                }

                .edit-image-div h2 {
                    color: white;
                    text-align: center;
                    margin-bottom: 20px;
                }

                .edit-image-div form {
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                }

                .image-upload-row {
                    display: flex;
                    align-items: center;
                    gap: 20px;
                }

                .image-upload-item {
                    display: flex;
                    flex-direction: column;
                }

                .edit-image-div label {
                    color: white;
                    font-size: 16px;
                    margin-bottom: 5px;
                }

                .edit-image-div input[type="file"] {
                    color: white;
                    margin-bottom: 10px;
                }

                .image-preview {
                    width: 200px;
                    height: 100px;
                    object-fit: cover;
                    border-radius: 4px;
                    border: 1px solid #fff;
                }

                .edit-image-div button {
                    background-color: #007bff;
                    color: white;
                    padding: 10px 20px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    align-self: center;
                }

                .edit-image-div button:hover {
                    background-color: #0056b3;
                }

                .close-button {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background-color: #fff;
                    color: #ff4d4d;
                    padding: 5px 10px;
                    border: none;
                    border-radius: 4px;
                    cursor: pointer;
                    font-size: 14px;
                }

                .close-button:hover {
                    background-color: #e0e0e0;
                }

                @media (max-width: 1200px) {
                    .product-fix-container {
                        margin-left: 20px;
                        width: calc(100% - 40px);
                    }

                    .image-item img {
                        width: 200px;
                        height: 150px;
                    }

                    .edit-image-div {
                        width: 80%;
                        left: 10%;
                    }
                }

                @media (max-width: 768px) {
                    .image-gallery {
                        flex-direction: column;
                        align-items: center;
                    }

                    .product-form input,
                    .product-form textarea {
                        max-width: 100%;
                    }

                    .edit-image-div {
                        height: auto;
                    }

                    .image-upload-row {
                        flex-direction: column;
                        align-items: flex-start;
                    }
                }
            `}</style>
        </div>
    );
}