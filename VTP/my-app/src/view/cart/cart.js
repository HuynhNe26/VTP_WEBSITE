import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import AuthUser from "../../models/authUser";

export default function Cart() {
  const [cart, setCart] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [orderId, setOrderId] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('Chuyển khoản');
  const [checkoutTotal, setCheckoutTotal] = useState(0);
  const navigate = useNavigate();
  const productId = sessionStorage.getItem('cart');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = AuthUser.getToken();
    setIsLoggedIn(!!token && AuthUser.isAuthenticated());
    if (token && AuthUser.isAuthenticated()) {
      fetchUserInfo(token);
    }
  }, []);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCart(savedCart);
    if (productId) {
      console.log('Product ID from sessionStorage:', productId);
      const addProductToCart = async () => {
        setLoading(true);
        try {
          if (!productId) throw new Error('Product ID không hợp lệ hoặc không tồn tại');
          const response = await fetch(`http://localhost:5000/cart/${productId}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
          });
          const contentType = response.headers.get('content-type');
          if (!contentType || !contentType.includes('application/json')) {
            const text = await response.text();
            throw new Error(`Phản hồi không phải JSON: ${text.substring(0, 100)}...`);
          }
          if (!response.ok) {
            const errorData = await response.json();
            if (response.status === 404) throw new Error(`Sản phẩm với ID ${productId} không tồn tại`);
            throw new Error(`Không thể lấy dữ liệu sản phẩm: ${errorData.message || response.statusText}`);
          }
          const productData = await response.json();
          if (!productData) throw new Error('Dữ liệu sản phẩm rỗng');
          const productExists = savedCart.findIndex(item => item.id_product === productData.id_product);
          let updatedCart;
          if (productExists >= 0) {
            updatedCart = savedCart.map(item =>
              item.id_product === productData.id_product
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            updatedCart = [...savedCart, { ...productData, quantity: 1 }];
          }
          localStorage.setItem('cartItems', JSON.stringify(updatedCart));
          setCart(updatedCart);
          sessionStorage.removeItem('cart');
        } catch (err) {
          console.error('Lỗi khi lấy sản phẩm:', err);
          setError(err.message || 'Lỗi kết nối server');
        } finally {
          setLoading(false);
        }
      };
      addProductToCart();
    } else {
      setLoading(false);
    }
  }, [productId]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch('http://localhost:5000/user/info', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const rawResponse = await response.text();
      console.log('Raw response from /user/info:', rawResponse);
      if (!response.ok) {
        let errorData;
        try {
          errorData = JSON.parse(rawResponse);
        } catch (e) {
          throw new Error(`Phản hồi không phải JSON: ${rawResponse.substring(0, 100)}...`);
        }
        console.log('Error from /user/info:', errorData);
        if (response.status === 401) {
          setError('Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.');
          AuthUser.logout();
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        throw new Error(errorData.message || 'Không thể lấy thông tin user');
      }
      const data = JSON.parse(rawResponse);
      setUserInfo(data);
    } catch (err) {
      setError('Không thể tải thông tin người dùng: ' + err.message);
      console.error('Error fetching user info:', err);
    }
  };

  const handleRemoveItem = (itemId) => {
    try {
      const updatedCart = cart.filter(item => item.id_product !== itemId);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      setCart(updatedCart);
    } catch (err) {
      setError('Không thể xóa sản phẩm: ' + err.message);
      console.error('Error removing item:', err);
    }
  };

  const handleIncreaseQuantity = (itemId) => {
    try {
      const updatedCart = cart.map(item =>
        item.id_product === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } catch (err) {
      setError('Không thể tăng số lượng sản phẩm: ' + err.message);
      console.error('Error increasing quantity:', err);
    }
  };

  const handleDecreaseQuantity = (itemId) => {
    try {
      const updatedCart = cart.map(item =>
        item.id_product === itemId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      );
      setCart(updatedCart);
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
    } catch (err) {
      setError('Không thể giảm số lượng sản phẩm: ' + err.message);
      console.error('Error decreasing quantity:', err);
    }
  };

  const handleCheckout = () => {
    const token = AuthUser.getToken();
    if (!token || !AuthUser.isAuthenticated()) {
      sessionStorage.setItem('returnCart', '/cart');
      navigate('/login');
      return;
    }
    setShowCheckoutConfirm(true);
  };

  const confirmCheckout = async () => {
    setLoading(true);
    try {
      const token = AuthUser.getToken();
      if (!token || !AuthUser.isAuthenticated()) {
        setError('Vui lòng đăng nhập để tiếp tục thanh toán');
        setShowCheckoutConfirm(false);
        navigate('/login');
        return;
      }
      const userId = AuthUser.getIdUser();
      if (!userId) {
        setError('Không lấy được userId từ token');
        setShowCheckoutConfirm(false);
        navigate('/login');
        return;
      }
      const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      setCheckoutTotal(totalPrice);
      const cartItems = cart.map(item => ({
        id_product: item.id_product,
        name_product: item.name_product,
        quantity: item.quantity,
        price: item.price,
      }));
      console.log('Phương thức thanh toán:', paymentMethod);
      const response = await fetch('http://localhost:5000/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          total: totalPrice,
          cartItems,
          paymentMethod,
        }),
      });
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        throw new Error(`Phản hồi không phải JSON: ${text.substring(0, 100)}...`);
      }
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message || 'Không thể tạo đơn hàng');
      }
      setOrderId(result.id_order || 'Unknown');
      if (paymentMethod === 'Chuyển khoản') {
        const qrResponse = await fetch(`http://localhost:5000/generate-qr/${result.id_order}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        const qrResult = await qrResponse.json();
        if (!qrResponse.ok) {
          throw new Error(qrResult.message || 'Không thể tạo mã QR');
        }
        setQrCodeUrl(qrResult.qrCodeUrl);
      } else {
        navigate('/order-history');
      }
      localStorage.removeItem('cartItems');
      setCart([]);
      setShowCheckoutConfirm(false);
    } catch (err) {
      console.error('Lỗi khi tạo đơn hàng:', err);
      setError(err.message || 'Lỗi khi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    const token = AuthUser.getToken();
    if (!token || !orderId) {
      setError('Không thể hủy đơn hàng: Thiếu token hoặc ID đơn hàng');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:5000/cancel-order/${orderId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Không thể hủy đơn hàng');
      }
  
      console.log(`Đơn hàng ${orderId} đã được hủy thành công`);
      setQrCodeUrl(null);
      setOrderId(null);
    } catch (err) {
      console.error('Lỗi khi hủy đơn hàng:', err);
      setError(err.message || 'Lỗi khi hủy đơn hàng');
    }
  };

  const totalPrice = Array.isArray(cart) && cart.length > 0
    ? cart.reduce((total, item) => total + (item.price * item.quantity), 0)
    : 0;

  if (loading) return <div className="loading-text">Loading cart...</div>;

  if (error) return (
    <div className="cart-container">
      <div className="error-text">{error}</div>
      <button
        className="btn btn-primary"
        onClick={() => {
          setError(null);
          navigate(isLoggedIn ? '/' : '/login');
        }}
      >
        {isLoggedIn ? 'Return to Home' : 'Go to Login'}
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        .cart-container {
          padding: 40px 20px;
          max-width: 100%;
          margin: 0 auto;
          background: linear-gradient(135deg, rgb(4, 0, 253) 0%, rgb(255, 0, 0) 100%);
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cart-title {
          text-align: center;
          color: rgb(255, 255, 255);
          font-size: 2.5rem;
          margin-bottom: 30px;
          font-family: 'Arial', sans-serif;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .user-info {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 900px;
          margin-bottom: 20px;
        }

        .user-info h4 {
          color: #2c3e50;
          margin-bottom: 15px;
          text-align: center;
        }

        .user-info p {
          color: #34495e;
          font-size: 1rem;
          margin: 5px 0;
        }

        .cart-table {
          width: 90%;
          max-width: 900px;
          border-collapse: collapse;
          background: #fff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }

        .cart-table th,
        .cart-table td {
          padding: 15px;
          text-align: left;
          font-family: 'Arial', sans-serif;
        }

        .cart-table th {
          background: #3498db;
          color: white;
          font-size: 1.1rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .cart-table td {
          border-bottom: 1px solid #eee;
          color: #34495e;
          font-size: 1rem;
        }

        .cart-table tfoot td {
          font-weight: bold;
          font-size: 1.2rem;
          color: #2c3e50;
          background: #f8f9fa;
        }

        .button-group {
          display: flex;
          justify-content: center;
          margin-top: 30px;
          gap: 15px;
          width: 90%;
          max-width: 900px;
        }

        .btn {
          padding: 12px 25px;
          border: none;
          border-radius: 25px;
          font-size: 1rem;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: 'Arial', sans-serif;
          text-transform: uppercase;
        }

        .btn-primary {
          background: #a3bffa;
          color: white;
        }

        .btn-primary:hover {
          background: #8c9eff;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(163, 191, 250, 0.3);
        }

        .btn-danger {
          background: #ff9aa2;
          color: white;
        }

        .btn-danger:hover {
          background: #ff878d;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(255, 154, 162, 0.3);
        }

        .btn-success {
          background: #b5ead7;
          color: white;
        }

        .btn-success:hover {
          background: #9edcc4;
          transform: translateY(-2px);
          box-shadow: 0 4px 15px rgba(181, 234, 215, 0.3);
        }

        .checkout-confirm {
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          margin-top: 20px;
          width: 90%;
          max-width: 900px;
        }

        .checkout-confirm h3 {
          color: #2c3e50;
          margin-bottom: 20px;
          text-align: center;
        }

        .payment-select {
          margin-bottom: 20px;
          text-align: center;
        }

        .payment-select label {
          font-size: 1.1rem;
          margin-right: 10px;
          color: #34495e;
        }

        .payment-select select {
          padding: 8px 15px;
          border-radius: 5px;
          border: 1px solid #ddd;
          font-size: 1rem;
          background: #fff;
          cursor: pointer;
        }

        .qr-section {
          text-align: center;
          background: #fff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 90%;
          max-width: 900px;
        }

        .qr-section h3 {
          color: #2c3e50;
          margin-bottom: 15px;
        }

        .qr-section img {
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 400px;
          height: 400px;
        }

        .qr-section p {
          margin: 10px 0;
          color: #34495e;
        }

        .empty-cart {
          text-align: center;
          color: #7f8c8d;
          font-size: 1.2rem;
          margin-top: 50px;
        }

        .loading-text,
        .error-text {
          text-align: center;
          font-size: 1.2rem;
          margin-top: 50px;
        }

        .loading-text {
          color: #3498db;
        }

        .error-text {
          color: #e74c3c;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .quantity-btn {
          background: #3498db;
          color: white;
          border: none;
          border-radius: 5px;
          padding: 5px 10px;
          cursor: pointer;
          font-size: 1rem;
          transition: background 0.3s ease;
          min-width: 30px;
        }

        .quantity-btn:hover {
          background: #2980b9;
        }

        .quantity-btn:disabled {
          background: #bdc3c7;
          cursor: not-allowed;
        }

        .quantity-display {
          min-width: 30px;
          text-align: center;
        }
      `}</style>
      <div className="cart-container">
        <h1 className="cart-title">Thanh Toán</h1>
        {qrCodeUrl ? (
          <div className="qr-section">
            <h3>Quét mã QR để thanh toán</h3>
            <img
              src={qrCodeUrl}
              alt="Mã QR Thanh Toán"
              onError={() => setError('Không thể tải mã QR. Vui lòng thử lại.')}
            />
            <p>Vui lòng chuyển khoản với cú pháp: <strong>{userInfo?.phone_number_user || 'SDT'}</strong></p>
            <p>Tổng tiền: <strong>{checkoutTotal.toLocaleString('vi-VN')} VND</strong></p>
            <div className="button-group">
              <button
                className="btn btn-danger"
                onClick={handleCancelOrder}
              >
                Hủy
              </button>
              <button
                className="btn btn-success"
                onClick={() => navigate('/order-history')}
              >
                Đã xác nhận thanh toán
              </button>
            </div>
          </div>
        ) : showCheckoutConfirm ? (
          <div className="checkout-confirm">
            <h3>Xác nhận thanh toán</h3>
            {userInfo && (
              <div className="user-info">
                <h4>Thông tin người đặt hàng</h4>
                <p><strong>Họ và tên:</strong> {`${userInfo.first_name_user || ''} ${userInfo.last_name_user || ''}`.trim() || 'N/A'}</p>
                <p><strong>Email:</strong> {userInfo.email || 'N/A'}</p>
                <p><strong>Số điện thoại:</strong> {userInfo.phone_number_user || 'N/A'}</p>
                <p><strong>Địa chỉ:</strong> {userInfo.address || 'N/A'}</p>
              </div>
            )}
            <table className="cart-table">
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                </tr>
              </thead>
              <tbody>
                {cart.map(item => (
                  <tr key={item.id_product}>
                    <td>{item.name_product}</td>
                    <td>{(item.price || 0).toLocaleString('vi-VN')} VND</td>
                    <td>{item.quantity || 1}</td>
                    <td>{(item.price * item.quantity).toLocaleString('vi-VN')} VND</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="3">Tổng tiền:</td>
                  <td>{totalPrice.toLocaleString('vi-VN')} VND</td>
                </tr>
              </tfoot>
            </table>
            <div className="payment-select">
              <label>Phương thức thanh toán:</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <option value="Chuyển khoản">Chuyển khoản</option>
                <option value="COD">Ship COD</option>
              </select>
            </div>
            <div className="button-group">
              <button className="btn btn-primary" onClick={confirmCheckout}>
                Xác nhận
              </button>
              <button className="btn btn-danger" onClick={() => setShowCheckoutConfirm(false)}>
                Hủy
              </button>
            </div>
          </div>
        ) : cart.length > 0 ? (
          <>
            <table className="cart-table">
              <thead>
                <tr>
                  <th>STT</th>
                  <th>Tên sản phẩm</th>
                  <th>Đơn giá</th>
                  <th>Số lượng</th>
                  <th>Thành tiền</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={item.id_product}>
                    <td>{index + 1}</td>
                    <td>{item.name_product}</td>
                    <td>{(item.price || 0).toLocaleString('vi-VN')} VND</td>
                    <td>
                      <div className="quantity-controls">
                        <button
                          className="quantity-btn"
                          onClick={() => handleDecreaseQuantity(item.id_product)}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="quantity-display">{item.quantity || 1}</span>
                        <button
                          className="quantity-btn"
                          onClick={() => handleIncreaseQuantity(item.id_product)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td>{(item.price * item.quantity).toLocaleString('vi-VN')} VND</td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => handleRemoveItem(item.id_product)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan="4">Tổng Tiền:</td>
                  <td>{totalPrice.toLocaleString('vi-VN')} VND</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
            <div className="button-group">
              <button className="btn btn-primary" onClick={() => navigate(-1)}>
                Tiếp tục mua sắm
              </button>
              <button className="btn btn-primary" onClick={handleCheckout}>
                Thanh toán
              </button>
              <button className="btn btn-success" onClick={() => navigate('/order-history')}>
                Xem lịch sử đơn hàng
              </button>
            </div>
          </>
        ) : (
          <div className="empty-cart">
            Giỏ hàng của bạn đang trống.
            <div className="button-group">
              <button className="btn btn-primary" onClick={() => navigate('/')}>
                Bắt đầu mua sắm
              </button>
              <button className="btn btn-success" onClick={() => navigate('/order-history')}>
                Xem lịch sử đơn hàng
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}