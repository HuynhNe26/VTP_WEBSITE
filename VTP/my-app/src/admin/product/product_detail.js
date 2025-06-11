import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetails() {
    const id = sessionStorage.getItem('idProduct')
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/product-details/${id}`);
                if (!response.ok) {
                    throw new Error('Không thể tải chi tiết sản phẩm');
                }
                const data = await response.json();
                setProduct(data.product);
            } catch (error) {
                console.error('Error fetching product details:', error);
                setError(error.message || 'Đã xảy ra lỗi khi tải chi tiết sản phẩm');
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]); // Chạy lại khi ID thay đổi

    const handleBack = () => {
        navigate('/admin/manage_product'); // Quay lại trang quản lý sản phẩm
    };

    const handleFix = async (item) => {
        sessionStorage.setItem('id', item)
        navigate(`/admin/manage_product/fix/${item}`)
    }

    const handleDescription = async (item) => {
        sessionStorage.setItem('idDescription', item)
        navigate(`/admin/manage_product/description/${item}`)
    }

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <p>Đang tải dữ liệu...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <p style={styles.errorText}>{error}</p>
            </div>
        );
    }

    if (!product) {
        return (
            <div style={styles.noData}>
                <p>Không tìm thấy sản phẩm</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>CHI TIẾT SẢN PHẨM</h1>
            <div style={styles.productCard}>
                <p style={styles.productName}>Tên sản phẩm: {product.name_product}</p>
                <p style={styles.description}>Mô tả: {product.description}</p>
                <p style={styles.price}>Giá: {product.price.toLocaleString('vi-VN')} VND</p>
                <div>
                    <label>Hình ảnh 1</label>
                    <br />
                    <img src={product.image_product} style={{width: '300px', height: '200px'}} /> 
                </div>
                <div>
                    <label>Hình ảnh 2</label>
                    <br />
                    <img src={product.image_product1} style={{width: '300px', height: '200px'}} /> 
                </div>
                <div>
                    <label>Hình ảnh 3</label>
                    <br />
                    <img src={product.image_product2} style={{width: '300px', height: '200px'}} /> 
                </div>
                <div>
                    <label>Hình ảnh 4</label>
                    <br />
                    <img src={product.image_product3} style={{width: '300px', height: '200px'}} /> 
                </div>
                <button onClick={() => handleFix(product.id_product)}>Sửa</button>
            </div>
            <div style={styles.productCard}>
                <h2>THÔNG TIN MÔ TẢ</h2>
                <p style={styles.description}>Mô tả 1: {product.description_protect}</p>
                <p style={styles.description}>Mô tả 2: {product.description_protect1}</p>
                <p style={styles.description}>Mô tả 3: {product.description_protect2}</p>
                <p style={styles.description}>Mô tả 3: {product.description_protect2}</p>
                <p style={styles.description}>Mô tả 4: {product.description_protect3}</p>
                <p style={styles.description}>Mô tả 5: {product.description_protect4}</p>
                <p style={styles.description}>Chiều rộng (cm): {product.description_width}</p>
                <p style={styles.description}>Chiều cao (cm): {product.description_height}</p>
                <p style={styles.description}>Cân nặng (kg): {product.description_weight}</p>
                <p style={styles.description}>Thể tích: {product.description_cubic}</p>
                <p style={styles.description}>Đóng gói: {product.description_packed}</p>
                <p style={styles.description}>Loại sơn: {product.description_finish}</p>
                <button onClick={() => handleDescription(product.id_product)}>Sửa</button>
            </div>
            <button onClick={handleBack} style={styles.backButton}>
                Quay lại
            </button>
        </div>
    );
}

// Styles
const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
    },
    title: {
        color: '#1a73e8',
        textAlign: 'center',
        marginBottom: '20px',
    },
    productCard: {
        backgroundColor: '#ffffff',
        padding: '15px',
        marginBottom: '15px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    },
    productName: {
        color: '#202124',
        fontSize: '20px',
        marginBottom: '10px',
    },
    description: {
        color: '#5f6368',
        fontSize: '16px',
        marginBottom: '10px',
    },
    price: {
        color: '#d32f2f',
        fontSize: '18px',
        fontWeight: 'bold',
    },
    backButton: {
        padding: '10px 20px',
        backgroundColor: '#1a73e8',
        color: '#ffffff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#1a73e8',
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#d32f2f',
    },
    errorText: {
        fontSize: '16px',
    },
    noData: {
        textAlign: 'center',
        color: '#5f6368',
        fontSize: '16px',
    },
};