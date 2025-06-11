import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function ProductDetails() {
    const { id } = useParams(); // Lấy ID sản phẩm từ URL
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetails = async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:5000/productAdmin/${id}`);
                if (!response.ok) {
                    throw new Error('Không thể tải chi tiết sản phẩm');
                }
                const data = await response.json();
                setProduct(data);
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
                <h2 style={styles.productName}>{product.name_product}</h2>
                <p style={styles.description}>Mô tả: {product.description}</p>
                <p style={styles.price}>Giá: {product.price} VND</p>
                {/* Thêm các thông tin khác nếu cần */}
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