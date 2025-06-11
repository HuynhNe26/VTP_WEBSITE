import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ManageOrderAll = () => {
  const [orders, setOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async (search = '') => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5000/orders?search=${search}`);
      const data = await response.json();
      setOrders(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách đơn hàng:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchOrders(searchTerm);
  };

  // CSS styles với tông màu xanh nước biển
  const styles = {
    container: {
      padding: '20px',
      minHeight: '100vh',
    },
    header: {
      color: '#1a237e', // Xanh đậm
      marginBottom: '20px',
      fontSize: '24px',
      fontWeight: 'bold',
      borderBottom: '2px solid #1976d2',
      paddingBottom: '10px',
    },
    searchForm: {
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
    },
    searchInput: {
      padding: '10px 15px',
      width: '300px',
      border: '1px solid #90caf9',
      borderRadius: '4px',
      fontSize: '14px',
      outline: 'none',
      transition: 'all 0.3s',
      backgroundColor: '#e3f2fd',
    },
    searchInputFocus: {
      border: '2px solid #1976d2',
      boxShadow: '0 0 5px rgba(25, 118, 210, 0.5)',
    },
    searchButton: {
      padding: '10px 20px',
      marginLeft: '10px',
      backgroundColor: '#1976d2', // Xanh nước biển
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: 'bold',
      transition: 'all 0.3s',
    },
    searchButtonHover: {
      backgroundColor: '#1565c0',
      transform: 'translateY(-1px)',
    },
    loadingText: {
      textAlign: 'center',
      color: '#1976d2',
      fontSize: '16px',
      marginTop: '20px',
    },
    table: {
      width: '100%',
      borderCollapse: 'separate',
      borderSpacing: '0',
      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.1)',
      backgroundColor: 'white',
      borderRadius: '8px',
      overflow: 'hidden',
    },
    tableHeader: {
      backgroundColor: '#1976d2',
      color: 'white',
      textAlign: 'left',
      padding: '14px 16px',
      fontWeight: '600',
      textTransform: 'uppercase',
      fontSize: '13px',
    },
    tableRow: {
      borderBottom: '1px solid #e3f2fd',
      transition: 'all 0.2s',
    },
    tableRowHover: {
      backgroundColor: '#e3f2fd',
    },
    tableCell: {
      padding: '12px 16px',
      borderBottom: '1px solid #e3f2fd',
      color: '#333',
    },
    actionButton: {
      padding: '8px 16px',
      backgroundColor: '#2196f3', // Xanh nhạt hơn
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '13px',
      fontWeight: '500',
      transition: 'all 0.3s',
      boxShadow: '0 2px 4px rgba(33, 150, 243, 0.2)',
    },
    actionButtonHover: {
      backgroundColor: '#1976d2',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 8px rgba(25, 118, 210, 0.3)',
    },
    statusPending: {
      color: '#ff9800',
      fontWeight: 'bold',
    },
    statusCompleted: {
      color: '#4caf50',
      fontWeight: 'bold',
    },
    statusCancelled: {
      color: '#f44336',
      fontWeight: 'bold',
    },
    noOrdersText: {
      textAlign: 'center',
      color: '#1976d2',
      marginTop: '20px',
      fontSize: '16px',
      fontStyle: 'italic',
    },
  };

  // Dynamic status style
  const getStatusStyle = (status) => {
    switch (status) {
      case 'Đang xử lý':
        return styles.statusPending;
      case 'Đã giao hàng':
        return styles.statusCompleted;
      case 'Đã hủy':
        return styles.statusCancelled;
      default:
        return {};
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>QUẢN LÝ ĐƠN HÀNG</h1>
      <form onSubmit={handleSearch} style={styles.searchForm}>
        <input
          type="text"
          placeholder="Tìm kiếm theo ID, tên hoặc số điện thoại..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={styles.searchInput}
          onFocus={(e) => {
            e.target.style.border = '2px solid #1976d2';
            e.target.style.boxShadow = '0 0 5px rgba(25, 118, 210, 0.5)';
          }}
          onBlur={(e) => {
            e.target.style.border = '1px solid #90caf9';
            e.target.style.boxShadow = 'none';
          }}
        />
        <button
          type="submit"
          style={styles.searchButton}
          onMouseOver={(e) => {
            e.target.style.backgroundColor = '#1565c0';
            e.target.style.transform = 'translateY(-1px)';
          }}
          onMouseOut={(e) => {
            e.target.style.backgroundColor = '#1976d2';
            e.target.style.transform = 'translateY(0)';
          }}
        >
          🔍 Tìm kiếm
        </button>
      </form>
      {loading ? (
        <p style={styles.loadingText}>⏳ Đang tải dữ liệu đơn hàng...</p>
      ) : (
        <>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.tableHeader}>ID</th>
                {/* <th style={styles.tableHeader}>Khách hàng</th> */}
                <th style={styles.tableHeader}>Điện thoại</th>
                <th style={styles.tableHeader}>Địa chỉ</th>
                <th style={styles.tableHeader}>Tổng tiền</th>
                <th style={styles.tableHeader}>Trạng thái</th>
                <th style={styles.tableHeader}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.id_order}
                  style={styles.tableRow}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#e3f2fd')}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
                >
                  <td style={styles.tableCell}>#{order.id_order}</td>
                  <td style={styles.tableCell}>{order.name_user}</td>
                  <td style={styles.tableCell}>{order.phone_user}</td>
                  <td style={styles.tableCell}>{order.delivery_address}</td>
                  <td style={styles.tableCell}>
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(order.total_price)}
                  </td>
                  <td style={{ ...styles.tableCell, ...getStatusStyle(order.status) }}>
                    {order.status}
                  </td>
                  <td style={styles.tableCell}>
                    <button style={styles.actionButton}>
                      xác nhận
                    </button>
                    <button style={styles.actionButton}>
                      hủy đơn 
                    </button>
                    <button
                      onClick={() => navigate(`/admin/order-details/${order.id_order}`)}
                      style={styles.actionButton}
                      onMouseOver={(e) => {
                        e.target.style.backgroundColor = '#1976d2';
                        e.target.style.transform = 'translateY(-1px)';
                      }}
                      onMouseOut={(e) => {
                        e.target.style.backgroundColor = '#2196f3';
                        e.target.style.transform = 'translateY(0)';
                      }}
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && orders.length === 0 && (
            <p style={styles.noOrdersText}>Không tìm thấy đơn hàng nào phù hợp</p>
          )}
        </>
      )}
    </div>
  );
};

export default ManageOrderAll;