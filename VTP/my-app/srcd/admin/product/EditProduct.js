import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [classifies, setClassifies] = useState([]);
    const [formData, setFormData] = useState({
        id_product: '',
        name_product: '',
        price: '',
        price_discount: '',
        description: '',
        quantity: '',
        material: '',
        id_classify: '',
        id_category: '',
        Code: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch product data
                const productResponse = await fetch(`http://localhost:5000/productAdmin/${id}`);
                if (!productResponse.ok) throw new Error('Failed to fetch product');
                const productData = await productResponse.json();
                
                // Fetch categories
                const categoryResponse = await fetch('http://localhost:5000/category-admin');
                if (!categoryResponse.ok) throw new Error('Failed to fetch categories');
                const categoryData = await categoryResponse.json();
                
                setProduct(productData);
                setCategories(categoryData);
                setFormData({
                    id_product: productData.id_product,
                    name_product: productData.name_product,
                    price: productData.price,
                    price_discount: productData.price_discount || '',
                    description: productData.description,
                    quantity: productData.quantity,
                    material: productData.material,
                    id_classify: productData.id_classify,
                    id_category: productData.id_category,
                    Code: productData.Code || ''
                });
                
                // Fetch classifies for the product's category
                if (productData.id_category) {
                    const classifyResponse = await fetch('http://localhost:5000/classify-admin', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ category: productData.id_category })
                    });
                    if (!classifyResponse.ok) throw new Error('Failed to fetch classifies');
                    const classifyData = await classifyResponse.json();
                    setClassifies(classifyData);
                }
                
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setFormData(prev => ({
            ...prev,
            id_category: categoryId,
            id_classify: '' // Reset classify when category changes
        }));
        
        try {
            const response = await fetch('http://localhost:5000/classify-admin', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ category: categoryId })
            });
            if (!response.ok) throw new Error('Failed to fetch classifies');
            const data = await response.json();
            setClassifies(data);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const response = await fetch(`http://localhost:5000/productAdmin/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update product');
            }
            
            // Redirect back to product management page after successful update
            navigate('/manage-products');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>CHỈNH SỬA SẢN PHẨM</h1>
            
            <form onSubmit={handleSubmit} style={styles.form}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>ID Sản phẩm:</label>
                    <input
                        type="text"
                        name="id_product"
                        value={formData.id_product}
                        onChange={handleChange}
                        style={styles.input}
                        readOnly
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Mã sản phẩm:</label>
                    <input
                        type="text"
                        name="Code"
                        value={formData.Code}
                        onChange={handleChange}
                        style={styles.input}
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Tên sản phẩm:</label>
                    <input
                        type="text"
                        name="name_product"
                        value={formData.name_product}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Giá:</label>
                    <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        min="0"
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Giá giảm:</label>
                    <input
                        type="number"
                        name="price_discount"
                        value={formData.price_discount}
                        onChange={handleChange}
                        style={styles.input}
                        min="0"
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Mô tả:</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        style={{...styles.input, height: '100px'}}
                        required
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Số lượng:</label>
                    <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        min="0"
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Vật liệu:</label>
                    <input
                        type="text"
                        name="material"
                        value={formData.material}
                        onChange={handleChange}
                        style={styles.input}
                        required
                    />
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Danh mục:</label>
                    <select
                        name="id_category"
                        value={formData.id_category}
                        onChange={handleCategoryChange}
                        style={styles.input}
                        required
                    >
                        <option value="">Chọn danh mục</option>
                        {categories.map(category => (
                            <option key={category.id_category} value={category.id_category}>
                                {category.name_category}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div style={styles.formGroup}>
                    <label style={styles.label}>Phân loại:</label>
                    <select
                        name="id_classify"
                        value={formData.id_classify}
                        onChange={handleChange}
                        style={styles.input}
                        required
                        disabled={!formData.id_category}
                    >
                        <option value="">Chọn phân loại</option>
                        {classifies.map(classify => (
                            <option key={classify.id_classify} value={classify.id_classify}>
                                {classify.name_classify}
                            </option>
                        ))}
                    </select>
                </div>
                
                <div style={styles.buttonGroup}>
                    <button type="submit" style={styles.submitButton}>
                        Lưu thay đổi
                    </button>
                    <button 
                        type="button" 
                        style={styles.cancelButton}
                        onClick={() => navigate('/manage-products')}
                    >
                        Hủy
                    </button>
                </div>
            </form>
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    },
    title: {
        color: '#1a73e8',
        textAlign: 'center',
        marginBottom: '20px',
        fontSize: '24px',
        fontWeight: 'bold',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '15px',
    },
    formGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
    },
    label: {
        fontWeight: '500',
        color: '#333',
    },
    input: {
        padding: '8px',
        borderRadius: '4px',
        border: '1px solid #ddd',
        fontSize: '14px',
    },
    buttonGroup: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '10px',
        marginTop: '20px',
    },
    submitButton: {
        padding: '10px 20px',
        backgroundColor: '#1a73e8',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
    cancelButton: {
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px',
    },
};

export default EditProduct;