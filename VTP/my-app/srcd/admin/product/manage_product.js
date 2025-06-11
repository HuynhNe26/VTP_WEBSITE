import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Manage_Product() {
    const [products, setProducts] = useState([]); // Danh sách sản phẩm (giả lập)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10); // Bắt đầu với 10 sản phẩm
    const [input, setInput] = useState("");
    const [del, setDel] = useState("")
    const navigate = useNavigate();

    // Giả lập fetch dữ liệu (thay bằng API thực tế)
    useEffect(() => {
        setLoading(true);
        // Giả lập dữ liệu từ API
        const fetchProduct = async () => {
            try {
                const response = await fetch('http://localhost:5000/productAdmin');
                if (!response.ok) {
                    throw new Error('Lỗi khi lấy dữ liệu');
                }
                const data = await response.json();
                setProducts(data);
            }
            catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, []);

    // Tính toán phân trang
    const totalPages = Math.ceil(products.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);

    // Chuyển trang
    const paginate = (pageNumber) => setCurrentPage(pageNumber);
    const nextPage = () => currentPage < totalPages && setCurrentPage(currentPage + 1);
    const prevPage = () => currentPage > 1 && setCurrentPage(currentPage - 1);

    // Thay đổi số mục mỗi trang
    const handleItemsPerPageChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handleChange = (e) => {
        const { value } = e.target;
        setInput(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await fetch(`http://localhost:5000/search-product/${input}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json();
            if (response.ok) {
                setProducts(data)
                setCurrentPage(1)
            }
        }
        catch (error) {
            setError(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    console.log(del)

    const handleDelete = async (e) => {
        e.preventDefault();
        setLoading(true);
        const id = e.target.id.value;
        try {
            const response = await fetch('http://localhost:5000/delete-product', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: id
                })
            })
            const data = await response.json();
            if (response.ok) {
                alert(`Xóa sản phẩm ${del} thành công!`)
            }
        }
        catch (error) {
            setError(error.message);
        }
        finally {
            setLoading(false);
        }
    }

    const handleEdit = async (item) => {
        sessionStorage.setItem('id', item);
        navigate(`fix/${item}`)
    } 

    if (loading) {
        return <div style={styles.loadingContainer}>Đang tải dữ liệu...</div>;
    }

    if (error) {
        return <div style={styles.errorContainer}>{error}</div>;
    }

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>QUẢN LÝ SẢN PHẨM</h1>

            {/* Điều khiển số mục mỗi trang */}
            <div style={styles.paginationControls}>
                <form style={{ display: 'flex' }} onSubmit={handleSubmit}>
                    <input
                        type='text'
                        name='search'
                        value={input}
                        style={{ width: '250px', height: '30px', borderRadius: '10px' }}
                        placeholder='Search'
                        onChange={handleChange}
                    />
                    <button type='submit' style={styles.select}>
                        Search
                    </button>
                </form>
                <label style={styles.label}>Số mục mỗi trang: </label>
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

            {/* Bảng sản phẩm */}
            <table style={styles.table}>
                <thead>
                    <tr>
                        <th style={styles.th}>STT</th>
                        <th style={styles.th}>ID Sản Phẩm</th>
                        <th style={styles.th}>Tên Sản Phẩm</th>
                        <th style={styles.th}>Mô Tả</th>
                        <th style={styles.th}>Giá</th>
                        <th style={styles.th}>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {currentProducts.map((product, index) => (
                        <tr key={product.id_product} style={styles.tr}>
                            <td style={styles.td}>{indexOfFirstItem + index + 1}</td>
                            <td style={styles.td}>{product.id_product}</td>
                            <td style={styles.td}>{product.name_product}</td>
                            <td style={styles.td}>{product.description}</td>
                            <td style={styles.td}>{product.price} VND</td>
                            <td style={styles.td}>
                                <div style={{ display: 'flex' }}>
                                    <button style={styles.button}>Xóa</button>

                                    <button style={styles.button} onClick={() => handleEdit(product.id_product)}>Sửa</button>
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
                    style={styles.paginationButton}
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
                    style={styles.paginationButton}
                >
                    Trang sau
                </button>
            </div>
        </div>
    );
};

// Styles (CSS inline)
const styles = {
    button: {
        backgroundColor: '#002856',
        color: 'white',
        padding: '8px',
        textAlign: 'center',
        fontWeight: '600',
        border: '1px solid #ddd',
        borderRadius: '5px',
        margin: '0px 5px 0px 5px'
    },

    container: {
        padding: '5px 10px 5px 10px',
        fontFamily: 'system-ui',
    },
    title: {
        color: '#002856',
        fontSize: '20px',
        fontWeight: 'bold',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '8px',
        overflow: 'hidden',
    },
    th: {
        backgroundColor: '#002856',
        color: 'white',
        padding: '12px',
        textAlign: 'center',
        borderBottom: '2px solid #ffffff',
        fontWeight: '600',
        border: '1px solid #ddd'
    },
    tr: {
        borderBottom: '1px solid #ddd',
        transition: 'background-color 0.2s',
        border: '1px solid #ddd'
    },
    trHover: {
        backgroundColor: '#f1f3f4',
    },
    td: {
        padding: '15px',
        color: '#202124',
        textAlign: 'center',
        border: '1px solid #ddd',
        fontFamily: 'system-ui'
    },
    loadingContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#1a73e8',
        fontSize: '18px',
    },
    errorContainer: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        color: '#d32f2f',
        fontSize: '18px',
    },
    paginationControls: {
        marginBottom: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
    },
    label: {
        fontSize: '14px',
        color: '#202124',
        fontWeight: '500',
        marginLeft: '410px'
    },
    select: {
        padding: '5px',
        fontSize: '14px',
        borderRadius: '10px',
        border: '1px solid #ccc',
        backgroundColor: '#002856',
        cursor: 'pointer',
        width: '80px',
        color: 'white',
        fontWeight: '500',
        fontFamily: 'system-ui',
        marginLeft: '5px'
    },
    pagination: {
        display: 'flex',
        justifyContent: 'center',
        gap: '10px',
        marginTop: '20px',
        flexWrap: 'wrap',
    },
    paginationButton: {
        padding: '8px 15px',
        backgroundColor: '#ffffff',
        border: '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.2s',
    },
    activePageButton: {
        backgroundColor: '#002856',
        color: '#ffffff',
        borderColor: '#1a73e8',
        fontFamily: 'system-ui'
    },
};

// Thêm hiệu ứng hover cho hàng bảng (tùy chọn)
const handleRowHover = (e) => {
    e.target.style.backgroundColor = styles.trHover.backgroundColor;
};

const handleRowLeave = (e) => {
    e.target.style.backgroundColor = '';
};