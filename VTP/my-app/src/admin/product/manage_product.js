import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Manage_Product() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [input, setInput] = useState("");
    const [del, setDel] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        const fetchProduct = async () => {
            try {
                const response = await fetch('http://localhost:5000/productAdmin');
                if (!response.ok) throw new Error('Lỗi khi lấy dữ liệu');
                const data = await response.json();
                setProducts(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, []);

    const totalPages = Math.ceil(products.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    const handleItemsPerPageChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handleChange = (e) => setInput(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/search-product/${input}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            if (response.ok) {
                setProducts(data);
                setCurrentPage(1);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (item) => {
        setLoading(true);
        console.log(item)
        try {
            const response = await fetch(`http://localhost:5000/delete-product/${item}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (response.ok) {
                alert(data.message);
                window.location.reload();
                setCurrentPage(1)
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDetails = (item) => {
        sessionStorage.setItem('idProduct', item);
        navigate(`${item}`);
    };

    if (loading) return <div style={styles.loadingContainer}>Đang tải dữ liệu...</div>;
    if (error) return <div style={styles.errorContainer}>{error}</div>;
    

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>QUẢN LÝ SẢN PHẨM</h1>

            {/* Điều khiển tìm kiếm và số mục mỗi trang */}
            <div style={styles.paginationControls}>
                <form style={styles.searchForm} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="search"
                        value={input}
                        style={styles.searchInput}
                        placeholder="Tìm kiếm sản phẩm..."
                        onChange={handleChange}
                    />
                    <button type="submit" style={styles.searchButton}>
                        Tìm kiếm
                    </button>
                </form>
                <div style={styles.itemsPerPage}>
                    <label style={styles.label}>Số mục mỗi trang:</label>
                    <select
                        value={itemsPerPage}
                        onChange={handleItemsPerPageChange}
                        style={styles.select}
                    >
                        {[10, 20, 30, 50, 100].map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bảng sản phẩm */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>STT</th>
                        <th style={styles.th}>ID Sản Phẩm</th>
                        <th style={styles.th}>Tên Sản Phẩm</th>
                        <th style={styles.th}>Mô Tả</th>
                        <th style={styles.th}>Giá (VNĐ)</th>
                        <th style={styles.th}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product, index) => (
                        <tr key={product.id_product} style={styles.tr}>
                            <td style={styles.td}>{indexOfFirstItem + index + 1}</td>
                            <td style={styles.td}>{product.id_product}</td>
                            <td style={styles.td}>{product.name_product}</td>
                            <td style={styles.td}>{product.description || 'Không có'}</td>
                            <td style={styles.td}>
                                {(product.price - (product.price * (product.number_discount || 0) / 100))
                                    .toLocaleString('vi-VN')} 
                            </td>
                            <td style={styles.td}>
                                <div style={styles.actionButtons}>
                                    <button
                                        type="submit"
                                        style={styles.deleteButton}
                                        onMouseEnter={() => setDel(product.name_product)}
                                        onClick={() => handleDelete(product.id_product)}
                                    >
                                        Xóa
                                    </button>
                                    <button
                                        style={styles.detailButton}
                                        onClick={() => handleDetails(product.id_product)}
                                    >
                                        Xem Chi Tiết
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Phân trang */}
            <div style={styles.pagination}>
                <button
                    onClick={prevPage}
                    disabled={currentPage === 1}
                    style={currentPage === 1 ? styles.disabledButton : styles.paginationButton}
                >
                    Trang trước
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                        key={page}
                        onClick={() => paginate(page)}
                        style={
                            currentPage === page
                                ? { ...styles.paginationButton, ...styles.activePageButton }
                                : styles.paginationButton
                        }
                    >
                        {page}
                    </button>
                ))}
                <button
                    onClick={nextPage}
                    disabled={currentPage === totalPages}
                    style={currentPage === totalPages ? styles.disabledButton : styles.paginationButton}
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
};

// Styles (CSS inline) đã cải tiến
const styles = {
    container: {
        fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif',
        backgroundColor: '#f9f9f9',
        borderRadius: '10px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        maxWidth: '1200px',
    },
    title: {
        color: '#002856',
        fontSize: '28px',
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: '20px',
    },
    paginationControls: {
        marginBottom: '20px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '15px',
    },
    searchForm: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    searchInput: {
        width: '300px',
        height: '40px',
        padding: '0 15px',
        borderRadius: '20px',
        border: '1px solid #ccc',
        fontSize: '14px',
        color: '#333',
        outline: 'none',
        transition: 'border-color 0.3s, box-shadow 0.3s',
    },
    searchInputHoverFocus: {
        borderColor: '#002856',
        boxShadow: '0 2px 6px rgba(0, 40, 86, 0.2)',
    },
    searchButton: {
        backgroundColor: '#002856',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '20px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    searchButtonHover: {
        backgroundColor: '#0056b3',
    },
    itemsPerPage: {
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    label: {
        fontSize: '14px',
        color: '#202124',
        fontWeight: '500',
    },
    select: {
        padding: '8px 12px',
        fontSize: '14px',
        borderRadius: '8px',
        border: '1px solid #ccc',
        backgroundColor: '#fff',
        cursor: 'pointer',
        color: '#002856',
        fontWeight: '500',
        transition: 'border-color 0.3s',
    },
    selectHoverFocus: {
        borderColor: '#002856',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
    },
    th: {
        backgroundColor: '#002856',
        color: 'white',
        padding: '15px',
        textAlign: 'center',
        fontWeight: '600',
        borderBottom: '2px solid #ddd',
    },
    tr: {
        borderBottom: '1px solid #eee',
        transition: 'background-color 0.2s',
    },
    trHover: {
        backgroundColor: '#f5f7fa',
    },
    td: {
        padding: '15px',
        color: '#333',
        textAlign: 'center',
        fontSize: '14px',
    },
    actionButtons: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    deleteButtonHover: {
        backgroundColor: '#c82333',
    },
    detailButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '8px 15px',
        borderRadius: '5px',
        border: 'none',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    detailButtonHover: {
        backgroundColor: '#0056b3',
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#002856',
        fontSize: '20px',
        fontWeight: '500',
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#d32f2f',
        fontSize: '20px',
        fontWeight: '500',
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '20px',
        flexWrap: 'wrap',
    },
    paginationButton: {
        padding: '10px 15px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        fontSize: '14px',
        color: '#002856',
        transition: 'background-color 0.3s, color 0.3s',
    },
    activePageButton: {
        backgroundColor: '#002856',
        color: '#fff',
        borderColor: '#002856',
    },
    disabledButton: {
        padding: '10px 15px',
        backgroundColor: '#f0f0f0',
        border: '1px solid #ddd',
        borderRadius: '5px',
        color: '#999',
        cursor: 'not-allowed',
    },
};

// Hiệu ứng hover cho hàng (thêm vào <tr>)
const handleRowHover = (e) => {
    e.currentTarget.style.backgroundColor = styles.trHover.backgroundColor;
};

const handleRowLeave = (e) => {
    e.currentTarget.style.backgroundColor = '';
};