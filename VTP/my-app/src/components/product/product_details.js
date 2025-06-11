import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../../css/productDetail.css';

function ProductDetail_cpn() {
    const { selectedCategory, selectedClassify, selectedProduct } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await fetch(
                    `http://localhost:5000/category/${selectedCategory}/classify/${selectedClassify}/product/${selectedProduct}`
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                console.log("Product data:", data); // Kiểm tra dữ liệu trả về
                setProduct(data); // Gán dữ liệu sản phẩm
                setLoading(false);
            } catch (error) {
                console.error("Error fetching product detail:", error);
                setError(error.message);
                setProduct(null);
                setLoading(false);
            }
        };
        fetchProductDetail();
    }, [selectedCategory, selectedClassify, selectedProduct]);

    const handleAddToCart = (productId) => {
        try {
            setLoading(true);
            const existingCart = JSON.parse(sessionStorage.getItem('cart')) || [];
            if (!existingCart.includes(productId)) {
                existingCart.push(productId);
            }
            sessionStorage.setItem('cart', JSON.stringify(existingCart));
            navigate('/cart');
        } catch (error) {
            console.error("Error adding to cart:", error);
            setError("Failed to add product to cart");
        } finally {
            setLoading(false);
        }
    };

    const [mainImage, setMainImage] = useState(null);

    const handleThumbnailClick = (image) => {
        setMainImage(image);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    if (!product) {
        return <p>No product found.</p>;
    }
    const images = [
        product.image_product,
        product.image_product1,
        product.image_product2,
        product.image_product3,
    ]
        .filter((image) => image) 
        .slice(0, 4); 

    console.log("Images to display:", images); 

    return (
        <div style={{ background: '#F5F5F5' }}>
            <div className="container_detail">
                <div className="grid">
                    {images.length > 0 && (
                        <div className="image-section">
                            <img
                                src={mainImage || images[0]} 
                                alt="main_product"
                                className="main-image"
                            />
                            <div className="thumbnails">
                                {images.map((image, index) => (
                                    <div className="thumbnail-item" key={index}>
                                        <img
                                            src={image}
                                            alt={`Thumbnail ${index + 1}`}
                                            onClick={() => handleThumbnailClick(image)}
                                            className={mainImage === image ? "active" : ""}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    <div className="product-details">
                        <div className="name">{product.name_product}</div>
                        <div className="price">Giá: {product.price.toLocaleString('vi-VN')
                        }</div>
                        <div className="online-exclusive">Chất liệu: {product.material}</div>
                        <p className="online-exclusive">Mô tả: {product.description}</p>
                        <div class="rating">
                            <div class="stars">
                                <div class="star"></div>
                                <div class="star"></div>
                                <div class="star"></div>
                                <div class="star"></div>
                                <div class="star"></div>
                            </div>
                            <div class="reviews">2 reviews</div>
                        </div>
                        <div style={{ display: 'flex' }}>
                            <button
                                className="buy"
                                onClick={() => handleAddToCart(product.id_product)}
                            >
                                Thêm vào giỏ
                            </button>
                            <button
                                className="buy"
                            >
                                Mua ngay
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="text_detail">THÔNG TIN SẢN PHẨM CHI TIẾT </div>
            <div className="container_detail" style={{ display: 'flex' }}>
                <div>
                    <div class="product-title">{product.name_product}</div>
                    <div class="product-description">
                        <div>Sự kết hợp hoàn hảo giữa thiết kế hiện đại và tính năng ưu việt, đáp ứng mọi nhu cầu của bạn. Với chất liệu cao cấp và quy trình sản xuất đạt tiêu chuẩn, sản phẩm không chỉ đảm bảo độ bền mà còn mang đến phong cách tinh tế cho không gian của bạn.</div>
                        <div style={{ padding: '20px 0px 0px 0px', fontWeight: 'bold' }}>Tính năng:</div>
                        <ul class="features-list">
                            <li>{product.description_protect}</li>
                            <li>{product.description_protect1}</li>
                            <li>{product.description_protect2}</li>
                            <li>{product.description_protect3}</li>
                            <li>{product.description_protect4}</li>
                        </ul>
                    </div>
                </div>
                <div>{product.image_product && <img style={{ width: 'auto', height: '450px', borderRadius: '8px' }} src={product.image_product} alt={product.name_product} />}</div>
            </div>
            <div className="text_detail">THÔNG TIN KỸ THUẬT </div>
            <div class="table-title" style={{ paddingLeft: '500px' }}>Kích thước</div>
            <div className="table-container">
                <div className="table_tp">
                    <div> Chiều rộng</div>
                    <div style={{ paddingLeft: '100px' }}>{product.description_width}</div>
                </div>
                <div className="table_tp">
                    <div>Chiều cao</div>
                    <div style={{ paddingLeft: '110px' }}>{product.description_height}</div>
                </div>
                <div className="table_tp">
                    <div>Khối lượng</div>
                    <div style={{ paddingLeft: '100px' }}>{product.description_weight}</div>
                </div>
                <div className="table_tp">
                    <div>Diện tích</div>
                    <div style={{ paddingLeft: '115px' }}>{product.description_cubic}</div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetail_cpn;