import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductFix() {
    const [input, setInput] = useState({});
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const id = sessionStorage.getItem('id');
    const [showDiv, setShowDiv] = useState(false);
    const [discount, setDiscount] = useState([]);
    const [images, setImages] = useState({ image1: null, image2: null, image3: null, image4: null });
    const [imagePreviews, setImagePreviews] = useState({ image1: null, image2: null, image3: null, image4: null });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/createProduct-details/${id}`);
                if (!response.ok) throw new Error(`Lỗi tải dữ liệu: ${response.status} ${response.statusText}`);
                const data = await response.json();
                setInput(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const fetchDiscount = async () => {
            try {
                const response = await fetch(`http://localhost:5000/discount/${id}`);
                if (!response.ok) throw new Error(`Lỗi tải dữ liệu: ${response.status} ${response.statusText}`);
                const data = await response.json();
                console.log(data.data)
                setDiscount(data.data);
            } catch (err) {
                setError(err.message);
            }
        };

        fetchDiscount();
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setInput((prev) => ({ ...prev, [name]: value }));
    };

    const handleChange1 = (e) => {
        const { name, value } = e.target;
        setDiscount((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const { name } = e.target;
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages((prev) => ({ ...prev, [name]: file }));
                setImagePreviews((prev) => ({ ...prev, [name]: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleImageSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        const formData = new FormData();
        // Gửi tất cả hình ảnh trong field 'images'
        Object.keys(images).forEach((key) => {
            if (images[key]) {
                formData.append('images', images[key]);
            }
        });

        try {
            const response = await fetch(`http://localhost:5000/updateProduct-images/${id}`, {
                method: 'PUT',
                body: formData,
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Lỗi cập nhật hình ảnh: ${errorText}`);
            }
            setShowDiv(false);
            setImages({ image1: null, image2: null, image3: null, image4: null });
            setImagePreviews({ image1: null, image2: null, image3: null, image4: null });
            alert('Cập nhật hình ảnh thành công!');
            // Tải lại dữ liệu sản phẩm
            const updatedResponse = await fetch(`http://localhost:5000/createProduct-details/${id}`);
            const updatedData = await updatedResponse.json();
            setInput(updatedData);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            const response = await fetch(`http://localhost:5000/updateProduct-details/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: input.name_product,
                    price: input.price,
                    description: input.description,
                    material: input.material,
                    quantity: input.quantity,
                    discount: discount.id_type_of_discount,
                }),
            });
            if (!response.ok) throw new Error('Lỗi cập nhật thông tin sản phẩm.');
            alert('Cập nhật thông tin sản phẩm thành công!');
            navigate('/admin/manage_product');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleResetImages = () => {
        setImages({ image1: null, image2: null, image3: null, image4: null });
        setImagePreviews({ image1: null, image2: null, image3: null, image4: null });
    };

    if (loading) return <div className="loading-container"><h3>Đang tải thông tin sản phẩm...</h3></div>;
    if (error) return (
        <div className="error-container">
            <h3>Lỗi: {error}</h3>
            <button onClick={() => setError(null)}>Thử lại</button>
        </div>
    );

    return (
        <div className="product-fix-container">
            <h2>SỬA THÔNG TIN SẢN PHẨM</h2>
            <form className="product-form" onSubmit={handleSubmit}>
                <label>Tên sản phẩm</label>
                <input type="text" name="name_product" value={input.name_product || ''} onChange={handleChange} />
                <div className="image-gallery">
                    {['image_product', 'image_product1', 'image_product2', 'image_product3'].map((key, index) => (
                        <div className="image-item" key={index}>
                            <label>Hình ảnh {index + 1}</label>
                            <br />
                            <img src={input[key] || ''} alt={`Product ${index + 1}`} />
                        </div>
                    ))}
                </div>
                <button type="button" onClick={() => setShowDiv(!showDiv)}>Sửa hình</button>
                <label>Đơn giá</label>
                <input type="number" name="price" value={input.price || ''} onChange={handleChange} />
                <label>Giảm giá</label>
                <input type="number" name="id_type_of_discount" value={discount.id_type_of_discount} onChange={handleChange1} />
                <label>Mô tả</label>
                <textarea name="description" value={input.description || ''} onChange={handleChange} />
                <label>Chất liệu</label>
                <input type="text" name="material" value={input.material || ''} onChange={handleChange} />
                <label>Số lượng</label>
                <input type="number" name="quantity" value={input.quantity || ''} onChange={handleChange} />
                <button type="submit">Sửa thông tin sản phẩm</button>
            </form>
            {showDiv && (
                <div className="edit-image-div">
                    <h2>SỬA HÌNH</h2>
                    <button className="close-button" onClick={() => setShowDiv(false)}>Đóng</button>
                    <form onSubmit={handleImageSubmit}>
                        {['image1', 'image2', 'image3', 'image4'].map((name, index) => (
                            <div className="image-upload-row" key={index}>
                                <div className="image-upload-item">
                                    <label>Hình {index + 1}</label>
                                    <br />
                                    <input
                                        type="file"
                                        name={name}
                                        onChange={handleImageChange}
                                        accept="image/jpeg,image/png,image/gif"
                                    />
                                </div>
                                {imagePreviews[name] && (
                                    <img src={imagePreviews[name]} alt={`Preview ${index + 1}`} className="image-preview" />
                                )}
                            </div>
                        ))}
                        <button type="button" onClick={handleResetImages}>Xóa</button>
                        <button type="submit">Cập nhật hình ảnh</button>
                    </form>
                </div>
            )}
            <style>{`
                .product-fix-container { padding: 20px; font-family: Arial, sans-serif; }
                .product-form { display: flex; flex-direction: column; gap: 10px; }
                .product-form label { font-weight: bold; }
                .product-form input, .product-form textarea { padding: 8px; border: 1px solid #ccc; border-radius: 4px; }
                .product-form button { padding: 10px 15px; background-color: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
                .product-form button:hover { background-color: #0056b3; }
                .image-gallery { gap: 10px; }
                .image-item img { max-width: 400px; max-height: 300px; }
                .edit-image-div { position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: white; padding: 20px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2); z-index: 1000; }
                .close-button { position: absolute; top: 10px; right: 10px; cursor: pointer; }
                .image-upload-row { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
                .image-preview { max-width: 100px; max-height: 100px; }
                .loading-container, .error-container { text-align: center; padding: 20px; }
            `}</style>
        </div>
    );
}