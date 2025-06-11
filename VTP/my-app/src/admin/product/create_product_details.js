import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateProductDetails() {
  const [product, setProduct] = useState(null);
  const [input, setInput] = useState(""); // Khởi tạo input là chuỗi rỗng
  const [showDiv, setShowDiv] = useState(false);
  const [text, setText] = useState({
    description: "",
    description1: "",
    description2: "",
    description3: "",
    description4: "",
    design: "",
    hot: "",
    width: "",
    height: "",
    cubic: "",
    weight: "",
    packed: "",
    finish: ""
  })
  const [design, setDesign] = useState([]);
  const [hot, setHot] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDesign = async () => {
        setLoading(true)
        try {
            const response = await fetch('http://localhost:5000/design', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json();
            if (response.ok) {
                setDesign(data.data)
            }
        }
        catch (error) {
            setError(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    fetchDesign();

    const fetchHot = async () => {
        setLoading(true)
        try {
            const response = await fetch('http://localhost:5000/hot-category', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json();
            if (response.ok) {
                
                setHot(data)
            }
        }
        catch (error) {
            setError(error.message)
        }
        finally {
            setLoading(false)
        }
    }

    fetchHot();
  }, [])

  // Hàm gọi API để lấy thông tin sản phẩm
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input) {
      setError("Vui lòng nhập ID sản phẩm!");
      return;
    }

    setLoading(true);
    setError(null); 
    try {
      const response = await fetch(
        `http://localhost:5000/createProduct-details/${input}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không tìm thấy sản phẩm hoặc lỗi server!");
      }

      const data = await response.json();

      setProduct(data);
      setShowDiv(true); // Hiển thị form thông tin sản phẩm
    } catch (error) {
      setError(error.message);
      setShowDiv(false); // Ẩn form nếu có lỗi
    } finally {
      setLoading(false);
    }
  };

  // Xử lý thay đổi input
  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleChange1 = (e) => {
    const {name, value} = e.target;
    setText((prev) => ({...prev, [name] : value}));
  }

  const handleSubmitInfo = async (e) => {
    e.preventDefault();
    setLoading(true);
    const idProduct = product.id_product;
  
    try {
      const response = await fetch(`http://localhost:5000/createProductDetails`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: text.description,
          description1: text.description1,
          description2: text.description2,
          description3: text.description3,
          description4: text.description4,
          design: text.design,
          hot: text.hot, 
          idProduct: idProduct,
          width: text.width,
          height: text.height,
          weight: text.weight,
          cubic: text.cubic,
          packed: text.packed,
          finish: text.finish,
        })
      });
      const data = await response.json();
      if (response.ok) {
         navigate(`/admin/manage_product/${idProduct}`);
      }
    } catch (error) {
      setError(error.message);
      // Sửa setTimeout: đợi 3.6 giây rồi reload
      setTimeout(() => {
        window.location.reload();
      }, 3600);
    } finally {
      setLoading(false); // Đảm bảo luôn reset loading
    }
  };

  // Xử lý hiển thị giao diện
  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <h3>Đang tải thông tin sản phẩm...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ color: "red", textAlign: "center" }}>
        <h3>Lỗi: {error}</h3>
        <button onClick={() => setError(null)}>Thử lại</button>
      </div>
    );
  }

  return (
    <div style={{maxWidth: "1200px" }}>
      <h2>THÊM THÔNG TIN CHI TIẾT SẢN PHẨM</h2>
      <div>
        <form onSubmit={handleSubmit}>
          <label>Nhập ID sản phẩm cần thêm thông tin</label>
          <br />
          <p></p>
          <br />
          <input
            type="text"
            name="idProduct"
            value={input}
            onChange={handleChange}
            placeholder="Ví dụ: SP0001"
            style={{ padding: "5px", width: "200px" }}
          />
          <br />
          <button
            type="submit"
            style={{
              marginTop: "10px",
              padding: "5px 10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Xác nhận
          </button>
        </form>
      </div>

      {showDiv && product ? (
        <div style={{ marginTop: "20px", border: "1px solid #ccc", padding: "20px" }}>
          <h2>THÔNG TIN SẢN PHẨM</h2>
            <form>
                <label>Thể loại chính</label>
                <br />
                <input
                name="categoryProduct"
                value={product.name_category|| "Không có thể loại chính"}
                readOnly
                style={{ padding: "5px", width: "100%", marginBottom: "10px" }}
                />
                <br />
                <label>Thể loại phụ</label>
                <br />
                <input
                name="classifyProduct"
                value={product.name_classify || "Không có thể loại phụ"}
                readOnly
                style={{ padding: "5px", width: "100%", marginBottom: "10px" }}
                />
                <br />
                <label>Tên sản phẩm</label>
                <br />
                <input
                name="nameProduct"
                value={product.name_product || "Không có tên sản phẩm"}
                readOnly
                style={{ padding: "5px", width: "100%", marginBottom: "10px" }}
                />
                <br />
                <label>Đơn giá</label>
                <br />
                <input
                name="priceProduct"
                value={(product.price.toLocaleString('vi-VN'))|| "Không có đơn giá"}
                readOnly
                style={{ padding: "5px", width: "100%", marginBottom: "10px" }}
                />
                <br />
                <label>Mô tả</label>
                <br />
                <input
                name="descriptionProduct"
                value={product.description|| "Không có mô tả"}
                readOnly
                style={{ padding: "5px", width: "100%", marginBottom: "10px" }}
                />
                <br />
                <label>Số lượng tồn kho</label>
                <br />
                <input
                name="quantityProduct"
                value={product.quantity|| "Số lượng đã hết"}
                readOnly
                style={{ padding: "5px", width: "100%", marginBottom: "10px" }}
                />
                <br />
                <label>Chất liệu</label>
                <br />
                <input
                name="materialProduct"
                value={product.material|| "Không có tên"}
                readOnly
                style={{ padding: "5px", width: "100%", marginBottom: "10px" }}
                />
                <br />
                <h3>Hình ảnh sản phẩm</h3>
                <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <div>
                    <label>Hình ảnh chính:</label>
                    <br />
                    {product.image_product ? (
                    <img
                        src={product.image_product}
                        alt="Hình ảnh chính"
                        style={{ width: "280px", height: "280px", objectFit: "cover" }}
                    />
                    ) : (
                    <p>Không có hình ảnh</p>
                    )}
                </div>
                <div>
                    <label>Hình ảnh phụ 1:</label>
                    <br />
                    {product.image_product1 ? (
                    <img
                        src={product.image_product1}
                        alt="Hình ảnh phụ 1"
                        style={{ width: "280px", height: "280px", objectFit: "cover" }}
                    />
                    ) : (
                    <p>Không có hình ảnh</p>
                    )}
                </div>
                <div>
                    <label>Hình ảnh phụ 2:</label>
                    <br />
                    {product.image_product2 ? (
                    <img
                        src={product.image_product2}
                        alt="Hình ảnh phụ 2"
                        style={{ width: "280px", height: "280px", objectFit: "cover" }}
                    />
                    ) : (
                    <p>Không có hình ảnh</p>
                    )}
                </div>
                <div>
                    <label>Hình ảnh phụ 3:</label>
                    <br />
                    {product.image_product3 ? (
                    <img
                        src={product.image_product3}
                        alt="Hình ảnh phụ 2"
                        style={{ width: "280px", height: "280px", objectFit: "cover" }}
                    />
                    ) : (
                    <p>Không có hình ảnh</p>
                    )}
                </div>
                </div>
            </form>
        <h2>THÔNG TIN MÔ TẢ TRANG SẢN PHẨM</h2>
            <form onSubmit={handleSubmitInfo}>
                <label>Mô tả 1*</label>
                <br />
                <textarea
                    style={{ width: "100%", height: '60px', padding: "5px", marginBottom: "10px" }}
                    name='description'
                    type='text'
                    value={text.description}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Mô tả 2*</label>
                <br />
                <textarea
                    style={{ width: "100%", height: '60px', padding: "5px", marginBottom: "10px" }}
                    name='description1'
                    type='text'
                    value={text.description1}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Mô tả 3*</label>
                <br />
                <textarea
                    style={{ width: "100%", height: '60px', padding: "5px", marginBottom: "10px" }}
                    name='description2'
                    type='text'
                    value={text.description2}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Mô tả 4*</label>
                <br />
                <textarea
                    style={{ width: "100%", height: '60px', padding: "5px", marginBottom: "10px" }}
                    name='description3'
                    type='text'
                    value={text.description3}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Mô tả 5*</label>
                <br />
                <textarea
                    style={{ width: "100%", height: '60px', padding: "5px", marginBottom: "10px" }}
                    name='description4'
                    type='text'
                    value={text.description4}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Chiều Rộng (cm)*</label>
                <br />
                <input
                    style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
                    name='width'
                    type='number'
                    value={text.width}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Chiều Cao (cm)*</label>
                <br />
                <input
                    style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
                    name='height'
                    type='number'
                    value={text.height}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Cân Nặng (kg)*</label>
                <br />
                <input
                    style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
                    name='weight'
                    type='number'
                    value={text.weight}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Thể tích (m³)*</label>
                <br />
                <input
                    style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
                    name='cubic'
                    type='number'
                    value={text.cubic}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Đóng gói*</label>
                <br />
                <input
                    style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
                    name='packed'
                    type='text'
                    value={text.packed}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Loại sơn*</label>
                <br />
                <input
                    style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
                    name='finish'
                    type='text'
                    value={text.finish}
                    onChange={handleChange1}
                    required
                />
                <br />
                <label>Thiết kế</label>
                <select
                  name="design"
                  value={text.design}
                  onChange={handleChange1}
                  style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
                >
                  <option value="">-- Chọn thiết kế --</option>
                  {design.length > 0 ? (
                    design.map(item => (
                      <option key={item.id_design} value={item.id_design}>
                        {item.name_design}
                      </option>
                    ))
                  ) : (
                    <option value="">Không có thiết kế nào</option>
                  )}
                </select>
                <label>Thể loại yêu thích</label>
                <select
                  name="hot"
                  value={text.hot}
                  onChange={handleChange1}
                  style={{ width: "100%", padding: "5px", marginBottom: "10px" }}
                >
                  <option value="">-- Chọn thể loại yêu thích --</option>
                  {hot.length > 0 ? (
                    hot.map(item => (
                      <option key={item.id_hot_category} value={item.id_hot_category}>
                        {item.name_hot_category}
                      </option>
                    ))
                  ) : (
                    <option value="">Không có thiết kế nào</option>
                  )}
                </select>
                <button type='submit' style={{
              marginTop: "10px",
              padding: "5px 10px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}>Lưu thông tin</button>
            </form>
        </div>
      ) : null}
    </div>
  );
}