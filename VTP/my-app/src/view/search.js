import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import '../css/product.css';
import '../css/navbar.css';

const Search = () => {
    const [loading, setLoading] = useState(false); // Trạng thái loading
    const [error, setError] = useState(null); // Trạng thái lỗi
    const [products, setProducts] = useState([]); // Kết quả tìm kiếm
    const [visibleProducts, setVisibleProducts] = useState(9); // Số sản phẩm hiển thị
    const input = sessionStorage.getItem('search');
    console.log(input)
    useEffect(() => {
        const fetchSearch = async () => {
            if (!input) return; // Không thực hiện nếu không có từ khóa
            setLoading(true); // Bật trạng thái loading
            setError(null); // Xóa lỗi trước đó (nếu có)

            try {
                const response = await fetch(`http://localhost:5000/search/${input}`);
                if (!response.ok) {
                    throw new Error(`Lỗi ${response.status}: ${response.statusText}`);
                }
                const data = await response.json();
                setProducts(data);
                console.log(data)// Lưu kết quả tìm kiếm
            } catch (err) {
                setError(err.message); // Lưu lỗi mới
            } finally {
                setLoading(false); // Tắt trạng thái loading
            }
        };

        fetchSearch(); // Gọi hàm tìm kiếm
    }, [input]); // Chạy lại khi `input` thay đổi

    const handleViewMore = () => {
        setVisibleProducts((prev) => prev + 6); // Hiển thị thêm sản phẩm
    };

    return (
        <div style={{ padding: '30px 0px 30px 100px' }}>
            <div class="search_result">Kết quả tìm kiếm cho: {input}</div>
            {error && <div style={{ color: 'red' }}>Lỗi: {error}</div>} {/* Hiển thị lỗi */}
            <div className="product">
                {Array.isArray(products) && products.length > 0 ? (
                    products.slice(0, visibleProducts).map((product) => (
                        <div className="product-item" key={product.id_product || product.name_product}>
                            <div>
                                {product.image_product && (
                                    <img
                                        className="product_img"
                                        src={product.image_product}
                                        alt={product.name_product}
                                    />
                                )}
                            </div>
                            <div className="product-details">
                                <p className="product-name">{product.name_product}</p>
                                <p className="product-description">{product.description}</p>
                                <p className="product-price">Giá: {product.price}</p>
                                <div className="product-reviews">
                                    <span className="product-review-stars">★★★★★</span>
                                    <span className="product-review-count">(4 reviews)</span>
                                </div>
                                <div className="product-buttons">
                                    <button className="product-button_1">Quick View</button>
                                    <button className="product-button_2">Add to Cart</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    !loading && (
                        <div style={{ textAlign: 'center', marginTop: '20px', color: 'gray' }}>
                            <p>Không tìm thấy sản phẩm nào phù hợp với tìm kiếm của bạn.</p>
                        </div>
                    )
                )}
                {Array.isArray(products) && visibleProducts < products.length && (
                    <div className="view-more-container">
                        <button onClick={handleViewMore} className="view-more-button">
                            View more
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Search;
