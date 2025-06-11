const express = require('express'); //npm install express
const db = require('../config/db_connect');
const cors = require('cors'); //npm install cors
const api = express();
const port = 5000;
const jwt = require('jsonwebtoken'); //npm install jsonwebtoken
const path = require('path');
const bcrypt = require('bcrypt');
const multer = require('multer')
const fs = require('fs')
const QRCode = require('qrcode');

api.use(cors());
api.use(express.json());

//user api
api.use((req, res, next) => {
  next();
});

const authenticateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' });
  }
  try {
    const decoded = jwt.verify(token, 'vtpUser');
    req.user = decoded;
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token đã hết hạn, vui lòng đăng nhập lại' });
    }
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }
};

api.get('/home', async (req, res) => {
  const query = `SELECT image_product, image_product1, image_product2 FROM product`;
  try {
    const [results] = await db.query(query);
    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm nào" });
    }
    res.json(results);
  } catch (error) {
    console.error('🔥 LỖI SQL:', error.message);
    res.status(500).json({ error: 'Lỗi server', details: 'Lỗi hệ thống' });
  }
});

api.get("/", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id_category, name_category FROM category");
    res.json(rows);
  } catch (error) {
    console.error("Database error:", error.message);
    res.status(500).json({ error: "Database error", details: error.message });
  }
});

api.get('/category/:id_category', async (req, res) => {
  const { id_category } = req.params;

  const query = `
    SELECT name_classify, id_classify, name_category, image_category
    FROM classify
    JOIN category ON classify.id_category = category.id_category
    WHERE category.id_category = ?
  `;

  try {
    const [results] = await db.query(query, [id_category]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy classify cho category này" });
    }

    res.json(results);
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

api.get('/category/:id_category/classify/:id_classify/product', async (req, res) => {
  const { id_category, id_classify } = req.params;
  const query = `
    SELECT name_product, id_product, image_product, description, price,
           product.id_classify, classify.id_category
    FROM product
    JOIN classify ON product.id_classify = classify.id_classify
    WHERE classify.id_category = ? AND product.id_classify = ?;
  `;

  try {
    const [results] = await db.query(query, [id_category, id_classify]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm nào" });
    }

    res.json(results);
  } catch (error) {
    console.error('🔥 LỖI SQL:', error.sqlMessage); // In lỗi chi tiết
    res.status(500).json({ error: 'Lỗi server', details: error.sqlMessage });
  }
});

api.use('/img_product', express.static(path.join(__dirname, 'img_product')));

api.get('/home', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user');
    res.json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ error: 'Lỗi server', details: error.message });
  }
});

api.get('/category/:id_category/classify/:id_classify/product/:id_product', async (req, res) => {
  const { id_product, id_category, id_classify } = req.params;

  const query = `
    SELECT *
    FROM description_product_details
    JOIN product ON product.id_product = description_product_details.id_product
    JOIN classify ON product.id_classify = classify.id_classify
    WHERE classify.id_category = ? AND product.id_classify = ? AND description_product_details.id_product = ? ;
  `;

  try {
    const [results] = await db.query(query, [id_category, id_classify, id_product]);

    if (results.length === 0) {
      return res.status(404).json({ error: "Không tìm thấy sản phẩm nào" });
    }

    res.json(results[0]); // Trả về chi tiết sản phẩm
  } catch (error) {
    console.error('🔥 LỖI SQL:', error.sqlMessage); // Log chi tiết lỗi
    res.status(500).json({ error: 'Lỗi server', details: error.sqlMessage });
  }
});

api.post('/sign', async (req, res) => {
  try {
    const { username, password, firstName, lastName, email, address, province, district, sex, dateofbirth, phone } = req.body;

    // Kiểm tra đầy đủ thông tin
    if (!username || !password || !firstName || !lastName || !email || !address || !province || !district || !sex || !dateofbirth || !phone) {
      return res.status(400).json({ error: "Thiếu thông tin, vui lòng điền đầy đủ thông tin!" });
    }

    // Hash mật khẩu
    const saltRounds = 10; // Độ phức tạp của salt (10 là mức tiêu chuẩn)
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Thực hiện truy vấn với mật khẩu đã hash
    const [result] = await db.query(
      'INSERT INTO user (username, password_user, first_name_user, last_name_user, phone_number_user, email, address, province, village, sex, dateofbirth, date_login, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)',
      [username, hashedPassword, firstName, lastName, phone, email, address, province, district, sex, dateofbirth, 'Tài khoản mới tạo']
    );

    res.status(201).json({ message: 'Thêm mới thành công', userId: result.insertId });
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ error: 'Lỗi server', details: error.message });
  }
});

api.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Vui lòng nhập username và password!' });
    }

    // Lấy thông tin user từ database
    const [rows] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
    const user = rows[0];

    if (!user) {
      return res.status(401).json({ error: 'Username không tồn tại!' });
    }

    // So sánh mật khẩu
    const isMatch = await bcrypt.compare(password, user.password_user);
    if (!isMatch) {
      return res.status(401).json({ error: 'Mật khẩu không đúng!' });
    }

    const payload = {
      id_user: rows[0].id_user,
      username: rows[0].username, 
    };

    const id = payload.id_user;

    const token = jwt.sign(
      payload,
      'vtpUser',
      { expiresIn: '4h' }
    );

    await db.query("UPDATE user SET date_login = NOW() AND status = 'Đang hoạt động' WHERE id_user = ?", [id])

    return res.status(200).json({
      success: true,
      message: 'Đăng nhập thành công',
      token
    });
  } catch (error) {
    console.error('Lỗi đăng nhập:', error.message);
    res.status(500).json({ error: 'Lỗi server', details: error.message });
  }
});

api.post('/check-info', async (req, res) => {
  const { username, email, phone } = req.body;

  if (!username) {
    return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập!' });
  }
  if (!email && !phone) {
    return res.status(400).json({ message: 'Cần cung cấp email hoặc số điện thoại' });
  }

  try {
    let rows;

    if (email) {
      [rows] = await db.query(
        'SELECT username, email FROM user WHERE username = ? AND email = ?',
        [username, email]
      );
      if (rows.length > 0) {
        return res.status(200).json({
          message: 'Tìm thấy thông tin',
          data: rows[0],
        });
      }
    }

    if (phone) {
      [rows] = await db.query(
        'SELECT username, phone_number_user FROM user WHERE username = ? AND phone_number_user = ?',
        [username, phone]
      );
      if (rows.length > 0) {
        return res.status(200).json({
          message: 'Tìm thấy thông tin',
          data: rows[0],
        });
      }
    }

    // Nếu không tìm thấy dữ liệu
    return res.status(404).json({
      message: 'Không tìm thấy thông tin khớp với dữ liệu cung cấp',
    });
  } catch (error) {
    console.error('Lỗi truy vấn database:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

api.get('/get-infoUser/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const [rows] = await db.query('SELECT first_name_user, last_name_user, phone_number_user, email, address, province, village, dateofbirth, sex FROM user WHERE id_user = ?', [id]);

    if (rows.length > 0) {
      return res.json(rows[0]);
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
})

api.get('/search/:input', async (req, res) => {
  const { input } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM product WHERE name_product LIKE ?', [`%${input}%`]);

    res.json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn database:');
  }
});

api.get('/cart/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM product WHERE id_product = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: `Không tìm thấy sản phẩm với ID: ${id}` });
    }
    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

// API Checkout (Không cần bảng cart, nhận trực tiếp từ frontend)
api.post('/checkout', authenticateToken, async (req, res) => {
  const { userId, total, cartItems, paymentMethod } = req.body;

  if (req.user.id_user !== userId) {
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }

  try {
    if (!userId || !total || !cartItems || !paymentMethod || !Array.isArray(cartItems)) {
      return res.status(400).json({ message: 'Dữ liệu không đầy đủ hoặc không hợp lệ' });
    }

    const [userRows] = await db.query('SELECT * FROM user WHERE id_user = ?', [userId]);
    if (userRows.length === 0) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }
    const user = userRows[0];

    // Kiểm tra dữ liệu cartItems
    for (const item of cartItems) {
      const { id_product, name_product, quantity, price } = item;
      if (!id_product || !name_product || !quantity || !price) {
        return res.status(400).json({ message: 'Dữ liệu sản phẩm trong giỏ hàng không đầy đủ' });
      }
      const [productCheck] = await db.query('SELECT id_product FROM product WHERE id_product = ?', [id_product]);
      if (productCheck.length === 0) {
        return res.status(404).json({ message: `Sản phẩm với id_product = ${id_product} không tồn tại` });
      }
    }

    // Tạo đơn hàng trong purchase_order
    const [orderResult] = await db.query(
      `INSERT INTO purchase_order (
        id_user, name_user, phone_user, address, delivery_address, 
        delivery_province, delivery_village, delivery_price, payment_method, 
        total_price, date_buy, recieve, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
      [
        userId,
        `${user.first_name_user} ${user.last_name_user}`,
        user.phone_number_user,
        user.address,
        user.address,
        user.province,
        user.village,
        50000, // Phí vận chuyển cố định
        paymentMethod,
        total,
        'Chưa nhận',
        'pending',
      ]
    );

    const orderId = orderResult.insertId;

    // Thêm chi tiết đơn hàng vào order_details
    for (const item of cartItems) {
      await db.query(
        `INSERT INTO order_details (id_order, id_product, name_product, quantity, price_at_purchase) 
         VALUES (?, ?, ?, ?, ?)`,
        [orderId, item.id_product, item.name_product, item.quantity, item.price]
      );
    }

    res.status(201).json({
      message: 'Đơn hàng đã được tạo thành công',
      id_order: orderId,
    });
  } catch (error) {
    console.error('Lỗi khi tạo đơn hàng:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

// API Generate QR Code
api.get('/generate-qr/:orderId', authenticateToken, async (req, res) => {
  const { orderId } = req.params;

  try {
    const [order] = await db.query(
      'SELECT total_price, id_user FROM purchase_order WHERE id_order = ?',
      [orderId]
    );

    if (order.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (order[0].id_user !== req.user.id_user) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập đơn hàng này' });
    }

    const totalPrice = order[0].total_price;
    const qrData = `Thanh toán đơn hàng DH${orderId} - Số tiền: ${totalPrice} VND`;

    const qrCodeUrl = await QRCode.toDataURL(qrData);

    res.status(200).json({ qrCodeUrl });
  } catch (error) {
    console.error('Lỗi khi tạo mã QR:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

// API hủy đơn hàng và tăng check_order_cancel
api.post('/order/cancel/:id_order', authenticateToken, async (req, res) => {
  const userId = req.user.id_user;
  const { id_order } = req.params;

  try {
    const [order] = await db.query(
      'SELECT * FROM purchase_order WHERE id_order = ? AND id_user = ?',
      [id_order, userId]
    );

    if (order.length === 0) {
      return res.status(404).json({ message: 'Đơn hàng không tồn tại hoặc không thuộc về bạn.' });
    }

    const orderStatus = order[0].status;
    if (orderStatus !== 'pending') {
      return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng đang ở trạng thái "pending".' });
    }

    const [updateOrder] = await db.query(
      'UPDATE purchase_order SET status = "cancelled" WHERE id_order = ? AND id_user = ?',
      [id_order, userId]
    );

    if (updateOrder.affectedRows === 0) {
      return res.status(500).json({ message: 'Không thể hủy đơn hàng.' });
    }

    const [updateUser] = await db.query(
      'UPDATE user SET check_order_cancel = check_order_cancel + 1 WHERE id_user = ?',
      [userId]
    );

    if (updateUser.affectedRows === 0) {
      return res.status(500).json({ message: 'Không thể cập nhật thông tin người dùng.' });
    }

    res.status(200).json({ message: 'Hủy đơn hàng thành công. Số lần hủy đã được cập nhật.' });
  } catch (error) {
    console.error('Lỗi khi hủy đơn hàng:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

api.post('/favorites', async (req, res) => {
  const { userId, productId } = req.body;
  try {
    if (!userId || !productId) {
      return res.status(400).json({ message: 'Thiếu thông tin userId hoặc productId' });
    }

    const [existing] = await db.query(
      'SELECT * FROM favorites WHERE id_user = ? AND id_product = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Sản phẩm đã có trong danh sách yêu thích' });
    }

    const [result] = await db.query(
      'INSERT INTO favorites (id_user, id_product) VALUES (?, ?)',
      [userId, productId]
    );

    res.status(201).json({ message: 'Đã thêm sản phẩm vào danh sách yêu thích', id_favorite: result.insertId });
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

api.get('/favorites/:id', async (req, res) => {
  const { id } = req.params;

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, 'vtpUser');
    if (decoded.id_user !== parseInt(id)) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }

    const [rows] = await db.query(
      `SELECT product.id_product, product.image_product, product.price, product.name_product
       FROM favorites
       JOIN product ON favorites.id_product = product.id_product
       WHERE favorites.id_user = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(200).json({ message: 'Không có sản phẩm yêu thích nào', data: [] });
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

api.delete('/favorites/:userId/:itemId', async (req, res) => {
  const { userId, itemId } = req.params;

  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: 'Không có token, vui lòng đăng nhập' });
  }

  try {
    const decoded = jwt.verify(token, 'vtpUser');
    if (decoded.id_user !== parseInt(userId)) {
      return res.status(403).json({ message: 'Token không hợp lệ' });
    }

    const [result] = await db.query(
      'DELETE FROM favorites WHERE id_user = ? AND id_product = ?',
      [userId, itemId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Không tìm thấy sản phẩm trong danh sách yêu thích' });
    }

    res.status(200).json({ message: 'Đã xóa sản phẩm khỏi danh sách yêu thích' });
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

// API Order History (từ server bạn)
api.get('/order-history/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.id_user !== parseInt(id)) {
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }

  try {
    const [rows] = await db.query(
      `SELECT id_order, date_buy, total_price, payment_method, status
       FROM purchase_order
       WHERE id_user = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});


// API Get Purchase Order Details (từ server bạn)
api.get('/purchase-order/:orderId', authenticateToken, async (req, res) => {
  const { orderId } = req.params;

  try {
    const [orderResult] = await db.query(
      'SELECT * FROM purchase_order WHERE id_order = ?',
      [orderId]
    );

    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (orderResult[0].id_user !== req.user.id_user) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập đơn hàng này' });
    }

    res.status(200).json(orderResult[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin đơn hàng:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

// API Cancel Order (từ server bạn, đã có trong cả hai)
api.get('/order-history/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;

  if (req.user.id_user !== parseInt(id)) {
    return res.status(403).json({ message: 'Token không hợp lệ' });
  }

  try {
    const [rows] = await db.query(
      `SELECT id_order, date_buy, total_price, payment_method, status
       FROM purchase_order
       WHERE id_user = ?`,
      [id]
    );

    if (rows.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

// API Get Purchase Order Details
api.get('/purchase-order/:orderId', authenticateToken, async (req, res) => {
  const { orderId } = req.params;

  try {
    const [orderResult] = await db.query(
      'SELECT * FROM purchase_order WHERE id_order = ?',
      [orderId]
    );

    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
    }

    if (orderResult[0].id_user !== req.user.id_user) {
      return res.status(403).json({ message: 'Bạn không có quyền truy cập đơn hàng này' });
    }

    res.status(200).json(orderResult[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin đơn hàng:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

// API Cancel Order
api.delete('/cancel-order/:orderId', authenticateToken, async (req, res) => {
  const { orderId } = req.params;
  const userId = req.user.id_user;

  try {
    const [orderResult] = await db.query(
      'SELECT * FROM purchase_order WHERE id_order = ? AND id_user = ?',
      [orderId, userId]
    );

    if (orderResult.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy đơn hàng hoặc không thuộc về bạn' });
    }

    if (orderResult[0].status !== 'pending') {
      return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng đang ở trạng thái "Đang chờ"' });
    }

    if (orderResult[0].payment_method !== 'COD') {
      return res.status(400).json({ message: 'Chỉ có thể hủy đơn hàng COD' });
    }

    await db.query('START TRANSACTION');

    await db.query('DELETE FROM order_details WHERE id_order = ?', [orderId]);
    await db.query('DELETE FROM purchase_order WHERE id_order = ?', [orderId]);

    // Cập nhật cột check_order_cancel
    const [updateUser] = await db.query(
      'UPDATE user SET check_order_cancel = check_order_cancel + 1 WHERE id_user = ?',
      [userId]
    );

    if (updateUser.affectedRows === 0) {
      await db.query('ROLLBACK');
      return res.status(500).json({ message: 'Không thể cập nhật thông tin người dùng.' });
    }

    await db.query('COMMIT');
res.status(200).json({ message: 'Đơn hàng đã được hủy thành công. Số lần hủy đã được cập nhật.' });
  } catch (error) {
    await db.query('ROLLBACK');
    console.error('Lỗi khi hủy đơn hàng:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});


api.get('/api/factories', async (req, res) => {
  try {
      const [rows] = await db.query('SELECT * FROM factory');
      res.json(rows);
  } catch (error) {
      console.error('Lỗi khi lấy danh sách chi nhánh:', error.message);
      res.status(500).json({ message: 'Lỗi server' });
  }
});

api.get('/api/name_contact', async (req, res) => {
  try {
      const [rows] = await db.query('SELECT * FROM name_contact');
      res.json(rows);
  } catch (error) {
      console.error('Lỗi khi lấy danh sách loại liên hệ:', error.message);
      res.status(500).json({ message: 'Lỗi server' });
  }
});

api.get('/api/products', async (req, res) => {
  try {
      const [rows] = await db.query('SELECT * FROM product');
      res.json(rows);
  } catch (error) {
      console.error('Lỗi khi lấy danh sách sản phẩm:', error.message);
      res.status(500).json({ message: 'Lỗi server' });
  }
});

api.post('/api/contact', async (req, res) => {
  const { id_name_contact, id_user, id_product, phone_number_user, email, status } = req.body;

  if (!id_name_contact || !id_user || !id_product || !phone_number_user || !email) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin liên hệ.' });
  }

  try {
      const [nameContactResult] = await db.query('SELECT name_contact FROM name_contact WHERE id_name_contact = ?', [id_name_contact]);
      const name_contact = nameContactResult.length > 0 ? nameContactResult[0].name_contact : '';

      const [result] = await db.query(
          `INSERT INTO contact (id_name_contact, name_contact, id_user, id_product, name_product, phone_number_user, email, status) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [id_name_contact, name_contact, id_user, id_product, '', phone_number_user, email, status]
      );

      res.status(201).json({ message: 'Thông tin liên hệ đã được gửi thành công!', id_contact: result.insertId });
  } catch (error) {
      console.error('Lỗi khi tạo thông tin liên hệ:', error.message);
      res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

//admin api
api.post('/login-admin', async (req, res) => {
  try {
    const { username, password, factory } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Vui lòng cung cấp tên đăng nhập và mật khẩu' });
    }
    
    const [result] = await db.query(
      "SELECT * FROM admin WHERE username_admin = ? AND password_admin = ? AND id_factory = ?",
      [username, password, factory]
    );

    if (result.length > 0) {
      const payload = {
        id_admin: result[0].id_admin,
        id_factory: result[0].id_factory,
        username_admin: result[0].username_admin, 
        level_login: result[0].level_login
      };
  
      const id = payload.id_admin;

      await db.query('UPDATE admin SET date_login = NOW(), status = "Đang hoạt động" WHERE id_admin = ?', [id]);

      const token = jwt.sign(
        payload,
        'vuongthienphatwoodcompany',
        { expiresIn: '6h' }
      );
      
      return res.status(200).json({
        success: true,
        message: 'Đăng nhập thành công',
        token
      });
    }
    else {
      return res.status(401).json({ message: 'Sai tên đăng nhập hoặc mật khẩu' });
    }
  } 
  catch (error) {
    console.error('Lỗi truy vấn database:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

api.put('/logout-admin/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const [rows] = await db.query('UPDATE admin SET date_logout = NOW(), status = "Đã đăng xuất" WHERE id_admin = ?', [id]);

    if (rows.affectedRows > 0) {
      return res.status(200).json({
        message: 'Đăng xuất thành công'
      })
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
})

api.post('/search', async (req, res) => {
  const { search } = req.body;
  try {
      if (!search) {
          return res.status(400).json({ message: "Vui lòng nhập từ khóa tìm kiếm" });
      }

      const [products] = await db.query(
          "SELECT * FROM product WHERE name_product LIKE ? OR id_product LIKE ? OR username_admin LIKE ?",
          [`%${search}%`, `%${search}%`, `%${search}%`]
      );
      
      const [admin] = await db.query(
          "SELECT * FROM admin WHERE username_admin LIKE ?",
          [`%${search}%`]
      );
      
      const [user] = await db.query(
          "SELECT * FROM user WHERE id_user LIKE ? OR phone_number_user LIKE ? OR email LIKE ? OR first_name_user LIKE ?",
          [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
      );

      // Check if any results were found
      if (!products.length && !admin.length && !user.length) {
          return res.status(404).json({ message: "Không có thông tin cần tìm!" });
      }

      // Return all results in a structured response
      return res.status(200).json({
          data: {
              products: products || [],
              admin: admin || [],
              users: user || []
          }
      });

  } catch (error) {
      console.error("Lỗi truy vấn database:", error);
      return res.status(500).json({ message: "Lỗi server" });
  }
});

api.get('/get-info-admin/:id', async (req, res) => {
  const { id } = req.params; 
  try {
    const [rows] = await db.query(
      `SELECT * FROM admin_information 
       INNER JOIN admin ON admin_information.id_admin = admin.id_admin 
       WHERE admin.id_admin = ?`, 
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy admin' });
    }

    const [check] = await db.query('SELECT * FROM admin_information_required WHERE id_admin = ?', [id]);

    return res.status(200).json({
      message: 'Lấy thông tin admin thành công',
      data: rows[0],
      check: check.length === 0 ? null : check 
    });

  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
});

api.get('/get-data/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM admin_information_required WHERE id_admin_information_required = ?', [id]);
    if (rows.length > 0) {
      res.json(rows)
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
})

api.put('/change-info-admin/:id', async (req, res) => {
  const {id} = req.params;
  const {firstName, lastName, email, phone, address, village, province, role, id_report} = req.body;
  try {
    const [rows] = await db.query(
      `UPDATE admin_information SET last_name_admin = ?, first_name_admin = ?, email_admin = ?, phone_number_admin = ?, address_admin = ?, village_admin = ?, province_admin = ?, role_job = ? WHERE id_admin = ?`,
      [lastName, firstName, email, phone, address, village, province, role, id]
    )

    if (rows.affectedRows > 0) {
      const id_report = rows[0].id_admin_information_required;
      await db.query('UPDATE admin_information_required SET status = ? WHERE id_admin_information_required = ?', ['Đã sửa', id_report]);
      return res.status(200).json({
        message: 'Cập nhật thông tin thành công'
      })
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
})

api.post('/info-request/:id', async (req, res) => {
  const {id} = req.params;
  const {firstName, lastName, email, phone, address, village, province, role, description, name} = req.body;
  try {
    if (!firstName ||!lastName ||!email ||!phone ||!address ||!village ||!province ||!role ||!description ||!name) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin' });
    }

    const [rows] = await db.query("INSERT INTO admin_information_required (name_required, last_name_admin_required, first_name_admin_required, phone_number_admin_required, email_admin_required, address_admin_required, village_admin_required, province_admin_required, role_job_required, description, create_at, id_admin) VALUES (?,?,?,?,?,?,?,?,?,?,NOW(),?)", 
      [name, lastName, firstName, phone, email, address, village, province, role, description, id]
    )

    res.status(200).json(rows[0], );
  }
  catch (error) {
    console.error('Lỗi:', error.message);
    return res.status(500).json({ message: 'Lỗi server' });
  }
})

api.get('/get-report', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM admin_information_required");
    if (rows.length > 0) {
      res.status(200).json({
        message: 'Lấy danh sách thành công!',
        data: rows
      })
    }
    else {
      return res.status(200).json({
        message: 'Không có danh sách'
      })
    }
  }
  catch (error) {
    console.error('Lỗi:', error.message);
    return res.status(500).json({ message: 'Lỗi server' });
  }
})

api.get('/get-report/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [rows] = await db.query(
      "SELECT * FROM admin_information_required WHERE id_admin = ? ORDER BY create_at DESC", 
      [id]
    );

    if (rows.length > 0) {
      res.status(200).json({ rows });
    } else {
      res.status(200).json({ message: 'Không tìm thấy báo cáo nào' });
    }
  } catch (error) {
    console.error('Lỗi:', error.message);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

api.get('/get-reported-details/:id', async (req, res) => {
  const { id } = req.params;
  const id_admin = req.headers['id'];
  try {
    const [rows] = await db.query(
      "SELECT * FROM admin_information_required WHERE id_admin_information_required = ?", [id]);
    
    const [admin] = await db.query("SELECT * FROM admin_information WHERE id_admin = ?", [id_admin]);

    res.json({
      data: rows[0],
      admin: admin[0]
    })
  } catch (error) {
    console.error('Lỗi:', error.message);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

api.get('/get-reported-details/:id', async (req, res) => {
  const { id } = req.params;
  const id_admin = req.headers['id'];
  try {
    const [rows] = await db.query(
      "SELECT * FROM admin_information_required WHERE id_admin_information_required = ?", [id]);
    
    const [admin] = await db.query("SELECT * FROM admin_information WHERE id_admin = ?", [id_admin]);

    res.json({
      data: rows[0],
      admin: admin[0]
    })
  } catch (error) {
    console.error('Lỗi:', error.message);
    return res.status(500).json({ message: 'Lỗi server' });
  }
});

api.get('/get-admin', async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM admin');
      if (!rows || rows.length === 0) {
        return res.status(404).json({ message: 'Không có tài khoản admin nào' });
      }
  
      res.status(200).json({
        message: 'Lấy thông tin admin thành công',
        data: rows,
      });
    } catch (error) {
      console.error('Lỗi truy vấn database:', error.message);
      res.status(500).json({ message: 'Lỗi server' });
    }
});

api.get('/get-admin/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE id_admin = ?', [id]);

    if (rows.length > 0) {
      res.json(rows[0])
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
})

api.get('/get-admin-level/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM admin WHERE id_factory = ?', [id]);

    if (rows.length > 0) {
      res.json(rows)
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server' });
  }
})

api.post('/create-admin', async (req, res) => {
  const { username, factory, level } = req.body
  const password = 1234;
  try {
    if (!username || !factory || !level) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin (username, factory, password)!' });
    }

    const [existingAdmin] = await db.query('SELECT username_admin FROM admin WHERE username_admin = ? AND id_factory = ?', [username, factory]);
    if (existingAdmin.length > 0) {
      return res.status(400).json({ message: 'Tên đăng nhập đã tồn tại!' });
    }

    // Thực hiện truy vấn INSERT
    const [result] = await db.query(
      'INSERT INTO admin (username_admin, password_admin, id_factory, level_login, status) VALUES (?, ?, ?, ?, "Tài khoản mới")',
      [username, password, factory, level]
    );

    // Trả về response thành công
    res.status(201).json({
      message: 'Tạo quản trị viên thành công',
      data: { username_admin: username, id_admin: result.insertId },
    });
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

api.post('/create-info-admin/:id', async (req, res) => {
  const {id} = req.params;
  const {lastName, firstName, email, phone, province, village, address, role} = req.body;
  try {
    if (!lastName || !firstName || !email || !phone || !province || !village || !address || !role) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ thông tin!'})
    }

    const [check] = await db.query('SELECT * FROM admin_information WHERE id_admin = ?', [id])
    if (check.length > 0) {
      return res.status(200).json({message: 'Tài khoản đã được thêm thông tin chi tiết!'})
    }

    const [rows] = await db.query('INSERT INTO admin_information (last_name_admin, first_name_admin, phone_number_admin, email_admin, address_admin, village_admin, province_admin, role_job, date_create_account, id_admin) VALUES (?,?,?,?,?,?,?,?, NOW(), ?)', 
      [lastName, firstName, phone, email, address, village, province, role, id]
    )

    if (rows.length > 0) {
      res.json(rows[0]);
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})
 
api.get('/get-factory', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM factory');
        if (!rows || rows.length === 0) {
            return res.status(404).json({ message: 'Không tìm thấy nhà máy nào' });
        }
        res.json(rows);
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Lỗi server');
    }
})

api.get('/category-admin', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM category');
    res.json(rows);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send('Lỗi server');
  }
})

api.post('/classify-admin', async (req, res) => {
  const {category} = req.body;
  try {
    const [rows] = await db.query('SELECT * FROM classify WHERE id_category = ?' , [category]);
    res.json(rows);
  }
  catch (error) {
    console.error(error.message);
    res.status(500).send('Lỗi server');
  }
})

// Tạo thư mục nếu chưa tồn tại
const uploadDir = path.join(__dirname, 'img_product');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'img_product/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Chỉ chấp nhận file ảnh (JPEG, PNG, GIF)'));
    }
    cb(null, true);
  },
  limits: { fileSize: 10 * 1024 * 1024 }, // 5MB
});

api.post('/create-product', upload.array('images', 4), async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const {
      category,
      classify,
      id_product,
      product,
      price,
      description,
      material,
      quantity,
      discount
    } = req.body;

    const adminId = req.headers.username;

    const [check] = await db.query('SELECT * FROM product WHERE id_product = ?', [id_product])

    if (check.length > 0) {
      return res.status(400).json({ message: 'ID sản phẩm đã tồn tại' });
    }

    if (!adminId) {
      return res.status(401).json({ message: 'Không tìm thấy ID admin' });
    }

    if (!category || !classify || !id_product || !product || !price || !quantity) {
      return res.status(400).json({ message: 'Vui lòng điền đầy đủ các thông tin bắt buộc' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'Vui lòng tải lên ít nhất một hình ảnh sản phẩm' });
    }

    // Tạo URL từ tên file
    const imageUrls = req.files.map(file => `http://localhost:5000/img_product/${file.filename}`);
    const imageProduct = imageUrls[0] || null;
    const imageProduct1 = imageUrls[1] || null;
    const imageProduct2 = imageUrls[2] || null;
    const imageProduct3 = imageUrls[3] || null;

    const [productResult] = await connection.query(
      `INSERT INTO product (
        id_product, name_product, price, description, material, quantity, 
        id_category, id_classify, id_admin, image_product, image_product1, image_product2, image_product3, id_type_of_discount
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id_product,
        product,
        price,
        description || null,
        material || null,
        quantity,
        category,
        classify,
        adminId,
        imageProduct,
        imageProduct1,
        imageProduct2,
        imageProduct3,
        discount
      ]
    );

    if (productResult.affectedRows === 0) {
      throw new Error('Không thể thêm sản phẩm');
    }

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'Thêm sản phẩm thành công',
      product: {
        id_product,
        name_product: product,
        image_urls: imageUrls,
      },
    });
  } catch (error) {
    await connection.rollback();
    console.error('Error creating product:', error);

    // Xóa file nếu có lỗi
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, 'img_product', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server khi thêm sản phẩm',
    });
  } finally {
    connection.release();
  }
});

api.put('/updateProduct-images/:id', upload.array('images', 4), async (req, res) => {
  const { id } = req.params;
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // Kiểm tra sản phẩm tồn tại
    const [existingProduct] = await connection.query(
      'SELECT image_product, image_product1, image_product2, image_product3 FROM product WHERE id_product = ?',
      [id]
    );
    if (!existingProduct.length) {
      return res.status(404).json({ success: false, message: 'Không tìm thấy sản phẩm' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Vui lòng tải lên ít nhất một hình ảnh sản phẩm',
      });
    }

    // Tạo URL mới từ file upload
    const imageUrls = req.files.map(file => `http://localhost:5000/img_product/${file.filename}`);

    // Lấy URL hiện tại
    const currentImages = {
      image_product: existingProduct[0].image_product,
      image_product1: existingProduct[0].image_product1,
      image_product2: existingProduct[0].image_product2,
      image_product3: existingProduct[0].image_product3,
    };

    // Cập nhật URL mới, giữ nguyên nếu không có file mới
    const newImages = {
      image_product: imageUrls[0] || currentImages.image_product,
      image_product1: imageUrls[1] || currentImages.image_product1,
      image_product2: imageUrls[2] || currentImages.image_product2,
      image_product3: imageUrls[3] || currentImages.image_product3,
    };

    // Cập nhật database
    const [result] = await connection.query(
      'UPDATE product SET image_product = ?, image_product1 = ?, image_product2 = ?, image_product3 = ? WHERE id_product = ?',
      [newImages.image_product, newImages.image_product1, newImages.image_product2, newImages.image_product3, id]
    );

    if (result.affectedRows === 0) {
      throw new Error('Không thể cập nhật sản phẩm');
    }

    // Xóa file cũ nếu có file mới thay thế
    const oldFiles = Object.values(currentImages).filter(url => url && !Object.values(newImages).includes(url));
    oldFiles.forEach(url => {
      const fileName = path.basename(url);
      const filePath = path.join(__dirname, 'img_product', fileName);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    });

    await connection.commit();

    return res.status(200).json({
      success: true,
      message: 'Cập nhật hình ảnh sản phẩm thành công',
      data: newImages,
    });
  } catch (error) {
    await connection.rollback();

    // Xóa file mới upload nếu có lỗi
    if (req.files) {
      req.files.forEach(file => {
        const filePath = path.join(__dirname, 'img_product', file.filename);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      });
    }

    console.error('Error updating product images:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Lỗi server khi cập nhật hình ảnh sản phẩm',
    });
  } finally {
    connection.release();
  }
});


api.get('/search-product/:search', async (req, res) => {
  const {search} = req.params;
  try {
    if (!search) {
      res.status(401).json({message: 'Vui lòng nhập trước khi tìm kiếm!'})
    }

    const [rows] = await db.query('SELECT * FROM product WHERE id_product LIKE ? OR name_product LIKE ? OR material LIKE ?', [`%${search}%`, `%${search}%`, `%${search}%`]);

    res.json(
      rows ? rows : "Không có sản phẩm"
    )
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.delete('/delete-product/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Kiểm tra xem sản phẩm có tồn tại không trước khi xóa
        const [product] = await db.query('SELECT * FROM product WHERE id_product = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        }

        // Bắt đầu transaction
        await db.query('START TRANSACTION');

        // Xóa dữ liệu từ bảng description_product_details
        const [descriptionResult] = await db.query('DELETE FROM description_product_details WHERE id_product = ?', [id]);

        // Xóa dữ liệu từ bảng product
        const [productResult] = await db.query('DELETE FROM product WHERE id_product = ?', [id]);

        // Commit transaction
        await db.query('COMMIT');

        // Trả về phản hồi thành công
        res.json({ message: 'Sản phẩm và thông tin chi tiết đã được xóa thành công', productAffectedRows: productResult.affectedRows, descriptionAffectedRows: descriptionResult.affectedRows });
    } catch (error) {
        // Rollback transaction nếu có lỗi
        await db.query('ROLLBACK');
        console.error('Lỗi truy vấn database:', error.message);
        res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
})

api.get('/productAdmin', async (req, res) => {
  try {
      const [rows] = await db.query(`
          SELECT * 
          FROM product 
          INNER JOIN type_of_discount 
          ON product.id_type_of_discount = type_of_discount.id_type_of_discount
      `);
      
      if (!rows || rows.length === 0) {
          return res.status(404).json({ 
              success: false,
              message: 'Không tìm thấy sản phẩm nào' 
          });
      }
      
      res.status(200).json(rows);
  } catch (error) {
      console.error('Lỗi truy vấn database:', error.message);
      res.status(500).json({ 
          success: false,
          message: 'Lỗi server', 
          error: error.message 
      });
  }
});

api.get('/product-details/:id', async (req, res) => {
  const {id} = req.params;
    try {
        const [product] = await db.query('SELECT * FROM product INNER JOIN description_product_details ON description_product_details.id_product = product.id_product WHERE product.id_product = ?', [id]);
        if (!product) {
            return res.status(404).json({ message: 'Không tìm thấy sản phẩm' });
        }

        const idDesign = product[0].id_design;
        const idHot = product[0].id_hot_category

        const [design] = await db.query('SELECT * FROM design WHERE id_design = ?', [idDesign]);
        const [hot] = await db.query('SELECT * FROM hot_category WHERE id_hot_category = ?', [idHot]);
        res.json({
          product: product[0],
          design: design ? design[0] : "",
          hot: hot ? hot[0] : ""
        });
    } catch (error) {
      console.error('Lỗi truy vấn database:', error.message);
      res.status(500).json({ message: 'Lỗi server', error: error.message });
    }
});

api.get('/createProduct-details/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Sử dụng LEFT JOIN để lấy tất cả sản phẩm, kể cả khi không có chi tiết
    const [product] = await db.query(
      `SELECT 
      product.*,
      category.name_category,
      classify.name_classify
      FROM product
      LEFT JOIN category ON product.id_category = category.id_category
      LEFT JOIN classify ON product.id_classify = classify.id_classify
      WHERE product.id_product = ?`,
      [id]
    );

    // Kiểm tra nếu không tìm thấy sản phẩm
    if (product.length === 0) {
      return res.status(404).json({ message: `Không tìm thấy sản phẩm với ID: ${id}` });
    }

    // Trả về sản phẩm đầu tiên (vì truy vấn theo ID chỉ trả về 1 sản phẩm)
    res.status(200).json(product[0]);
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({
      message: 'Lỗi server khi lấy thông tin sản phẩm',
      error: error.message,
    });
  }
});

api.post('/createProductDetails', async (req, res) => {
  const {description, description1, description2, description3, description4, design, hot, idProduct, weight, height, cubic, width, packed, finish} = req.body;

  try {
    if (!description || !description1 || !description2 || !description3 || !description4 || !design || !hot || !idProduct || !weight || !height || !width || !cubic) {
      return res.status(404).json({ message: 'Vui lòng điền đầy đủ thông tin!'})
    }

    const [rows] = await db.query(
      'INSERT INTO description_product_details (description_protect, description_protect1, description_protect2, description_protect3, description_protect4, id_design, id_hot_category, id_product, description_width, description_height, description_weight, description_cubic, description_packed, description_finish) VALUE (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', 
      [description, description1, description2, description3, description4, design, hot, idProduct, width, height, weight, cubic, packed, finish]
    )

    if (rows.length > 0) {
      return res.status(200).json({ message: 'Thêm thông tin chi tiết thành công!', data: rows })
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.put('/updateProduct-details/:id', async (req, res) => {
  const {id} = req.params;
  const {name, price, description, material, quantity, discount} = req.body;
  try {
    const [result] = await db.query('UPDATE product SET name_product = ?, price = ?, description = ?, quantity = ?, material = ?, id_type_of_discount = ? WHERE id_product = ?',
      [name, price, description, quantity, material, discount, id]
    )

    if (result.affectedRows > 0) {
      return res.status(200).json({ message: 'Cập nhật thông tin thành công!' });
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.get('/get-description/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const [result] = await db.query('SELECT * FROM description_product_details WHERE id_product = ?', [id])

    if (result.length > 0) {
      return res.status(200).json(result[0])
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.post('/updateDescription/:id', async (req, res) => {
  const {id} = req.params;
  const {description, description1, description2, description3, description4, width, height, weight, cubic, packed, finish} = req.body;
  try {
    if (!description || !description1 || !description2 || !description3 || !description4 || !width || !height || !weight || !cubic || !packed || !finish) {
      return res.status(404).json({ message: 'Vui lòng điền đầy đủ thông tin'})
    }

    const [result] = await db.query('UPDATE description_product_details SET description_protect = ?, description_protect1 = ?, description_protect2 = ?, description_protect3 = ?, description_protect4 = ?, description_width = ?, description_height = ?, description_weight = ?, description_cubic = ?, description_packed = ?, description_finish = ? WHERE id_product = ?', 
      [description, description1, description2, description3, description4, width, height, weight, cubic, packed, finish, id])
    
    if(result.affectedRows > 0) {
      return res.status(200).json({ message: 'Cập nhật thông tin thành công!'})
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.get('/discount', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM type_of_discount');

    if (rows.length > 0) {
      res.json({data: rows})
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.get('/discount/:id', async (req, res) => {
  const { id } = req.params; // Lấy id từ params

  try {
    const [rows] = await db.query(`
      SELECT 
        type_of_discount.*
      FROM product
      INNER JOIN type_of_discount 
        ON type_of_discount.id_type_of_discount = product.id_type_of_discount
      WHERE product.id_product = ?
    `, [id]);

    if (rows.length > 0) {
      res.json({ data: rows[0] });
    } else {
      res.status(404).json({ message: 'Không tìm thấy sản phẩm hoặc discount liên quan' });
    }
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
});

api.get('/design', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM design');

    if (rows.length > 0) {
      res.json({data: rows})
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.get('/hot-category', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM hot_category');

    if (rows.length > 0) {
      res.json(rows)
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.get('/get-order', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM purchase_order')

    if (rows.length > 0) {
      res.json(rows);
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.get('/get-user', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM user');
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng nào' });
    }
    res.json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.get('/infoUser/:id', async (req, res) => {
  const {id} = req.params;
  try {
    const [rows] = await db.query('SELECT * FROM user WHERE id_user = ?', [id]);
    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy thông tin người dùng!' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.get('/get-user/:search', async (req, res) => {
  const { search } = req.params; // Đổi tên param thành :search để rõ nghĩa
  try {
    const [rows] = await db.query(
      `SELECT * FROM user 
       WHERE username LIKE ? 
          OR first_name_user LIKE ? 
          OR last_name_user LIKE ?
          OR phone_number_user LIKE ? 
          OR email LIKE ?`,
      [`%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`, `%${search}%`]
    );

    if (rows.length > 0) {
      return res.status(200).json({
        message: 'Lấy danh sách người dùng thành công',
        data: rows,
      });
    } else {
      return res.status(200).json({
        message: 'Không tìm thấy người dùng phù hợp',
        data: [],
      });
    }
  } catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    return res.status(500).json({
      message: 'Lỗi server khi lấy danh sách người dùng',
    });
  }
});

api.delete('/delete-user/:id', async (req, res) => {
  const id = req.params;
  try {
    const [result] = await db.query('DELETE FROM user WHERE id_user = ?', [id]);

    if (result.affectedRows > 0) {
      return res.status(200).json({message: 'Xóa tài khoản thành công!'})
    }
  }
  catch (error) {
    console.error('Lỗi truy vấn database:', error.message);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
})

api.get('/orders', async (req, res) => {
  const { search, idFactory } = req.query;
  let query = 'SELECT * FROM purchase_order';
  let params = [];

  // Lọc theo idFactory
  if (idFactory) {
    query += ' WHERE id_factory = ?';
    params.push(idFactory);
  }

  // Tìm kiếm theo ID, tên hoặc số điện thoại
  if (search) {
    if (params.length > 0) {
      query += ' AND (id_order LIKE ? OR name_user LIKE ? OR phone_user LIKE ?)';
    } else {
      query += ' WHERE id_order LIKE ? OR name_user LIKE ? OR phone_user LIKE ?';
    }
    params.push(`%${search}%`, `%${search}%`, `%${search}%`);
  }

  try {
    const [rows] = await db.query(query, params);
    res.json(rows);
  } catch (error) {
    console.error('Lỗi truy vấn:', error.message);
    res.status(500).json({ error: 'Lỗi server' });
  }
});

api.get('/get-statistics', async (req, res) => {
  const { date } = req.query; // Ngày tùy chọn từ query string
  const id_admin = req.headers['id']; // Lấy id_admin từ header 'Id'

  try {
    // Kiểm tra và lấy id_factory từ admin
    const [admin] = await db.query('SELECT id_factory FROM admin WHERE id_admin = ?', [id_admin]);
    if (!admin.length) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    const idFactory = admin[0].id_factory;

    // Xác định ngày mục tiêu (mặc định là hôm nay nếu không có query date)
    const targetDate = date || new Date().toISOString().split('T')[0];

    // 1. Doanh thu ngày hiện tại
    const [revenueResult] = await db.query(`
      SELECT SUM(total_price) as revenueToday
      FROM purchase_order
      WHERE DATE(date_buy) = ? AND status = 'Đã giao hàng' AND id_factory = ?
    `, [targetDate, idFactory]);
    const revenueToday = revenueResult[0].revenueToday || 0;

    // 2. Tổng số đơn hàng ngày hiện tại
    const [ordersResult] = await db.query(`
      SELECT COUNT(*) as totalOrdersToday
      FROM purchase_order
      WHERE DATE(date_buy) = ? AND id_factory = ?
    `, [targetDate, idFactory]);
    const totalOrdersToday = ordersResult[0].totalOrdersToday || 0;

    // 3. Số đơn hàng đang chờ
    const [pendingResult] = await db.query(`
      SELECT COUNT(*) as pendingOrders
      FROM purchase_order
      WHERE DATE(date_buy) = ? AND status = 'Đang xử lý' AND id_factory = ?
    `, [targetDate, idFactory]);
    const pendingOrders = pendingResult[0].pendingOrders || 0;

    // 4. Số đơn hàng đã giao
    const [deliveredResult] = await db.query(`
      SELECT COUNT(*) as deliveredOrders
      FROM purchase_order
      WHERE DATE(date_buy) = ? AND status = 'Đã giao hàng' AND id_factory = ?
    `, [targetDate, idFactory]);
    const deliveredOrders = deliveredResult[0].deliveredOrders || 0;

    // 5. Số đơn hàng bị hủy
    const [canceledResult] = await db.query(`
      SELECT COUNT(*) as canceledOrders
      FROM purchase_order
      WHERE DATE(date_buy) = ? AND status = 'Đã hủy' AND id_factory = ?
    `, [targetDate, idFactory]);
    const canceledOrders = canceledResult[0].canceledOrders || 0;

    // 6. Top 5 sản phẩm bán chạy trong ngày
    const [topProductsToday] = await db.query(`
      SELECT p.name_product as name, SUM(od.quantity) as quantity
      FROM order_details od
      JOIN purchase_order po ON od.id_order = po.id_order
      JOIN product p ON od.id_product = p.id_product
      WHERE DATE(po.date_buy) = ? AND po.id_factory = ?
      GROUP BY p.id_product, p.name_product
      ORDER BY quantity DESC
      LIMIT 5
    `, [targetDate, idFactory]);

    // 7. Danh sách tồn kho
    const [inventory] = await db.query(`
      SELECT name_product as name, quantity
      FROM product
      WHERE id_factory = ?
    `, [idFactory]);
// Trả về dữ liệu
    res.status(200).json({
      revenueToday,
      totalOrdersToday,
      pendingOrders,
      deliveredOrders,
      canceledOrders,
      topProductsToday: topProductsToday.length ? topProductsToday : [],
      inventory: inventory.length ? inventory : []
    });
  } catch (error) {
    console.error('Lỗi truy vấn thống kê:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

api.get('/user/info', authenticateToken, async (req, res) => {
  const id_user = req.user.id_user;

  try {
    const [rows] = await db.query(
      `SELECT id_user, username, first_name_user, last_name_user, phone_number_user, email, address, province, village, sex, dateofbirth 
       FROM user 
       WHERE id_user = ?`,
      [id_user]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error.message);
    res.status(500).json({ message: 'Lỗi server', details: error.message });
  }
});

api.listen(port, () => {
    console.log(`http://localhost:${port}`);
})

module.exports = api;