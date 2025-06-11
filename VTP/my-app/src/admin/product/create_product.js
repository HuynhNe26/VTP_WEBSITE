import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModel from '../../models/authModel';

export default function CreateProduct() {
  const [category, setCategory] = useState([]);
  const [classify, setClassify] = useState([]);
  const [discount, setDiscount] = useState([]);
  const [inputs, setInputs] = useState({
    category: '',
    classify: '',
    id_product: '',
    product: '',
    price: '',
    description: '',
    material: '',
    quantity: '',
    discount: ''
  });
  const [files, setFiles] = useState({
    file: null,
    file1: null,
    file2: null,
    file3: null
  }); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/category-admin', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error('Không thể tải danh mục');
        }
        const data = await response.json();
        setCategory(data);
      } catch (error) {
        console.error('Error:', error);
        setError('Không thể tải danh mục. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, []);

  useEffect(() => {
    const fetchClassify = async () => {
      if (!inputs.category) return;

      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/classify-admin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ category: inputs.category }),
        });
        const data = await response.json();
        if (data.error) {
          throw new Error(data.message || 'Lỗi từ server');
        }

        const classifyData = Array.isArray(data) ? data : (data.data || []);
        setClassify(classifyData);
      } catch (error) {
        console.error('Không thể lấy dữ liệu thể loại phụ!:', error);
        setError('Không thể tải phân loại. Vui lòng thử lại!');
      } finally {
        setLoading(false);
      }
    };

    const fetchDiscount = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:5000/discount', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        const data = await response.json();
        if (response.ok) {
          setDiscount(data.data);
        }
      }
      catch (error) {
        setError(error.message)
      }
      finally {
        setLoading(false)
      }
    }

    fetchDiscount();
    fetchClassify();
  }, [inputs.category]);

  const handleChange = (e) => {
    const { name, value, files: inputFiles } = e.target;
    if (name === 'file' || name === 'file1' || name === 'file2' || name === 'file3') {
      const selectedFile = inputFiles[0];
      if (selectedFile) {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (!allowedTypes.includes(selectedFile.type)) {
          setError('Vui lòng chọn file ảnh (JPEG, PNG, GIF)');
          setFiles((prev) => ({ ...prev, [name]: null }));
          return;
        }
        if (selectedFile.size > maxSize) {
          setError('Kích thước file không được vượt quá 5MB');
          setFiles((prev) => ({ ...prev, [name]: null }));
          return;
        }
        setFiles((prev) => ({ ...prev, [name]: selectedFile }));
        setError(null);
      } else {
        setFiles((prev) => ({ ...prev, [name]: null }));
      }
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Kiểm tra xem các mục nhập đã có chưa
    const requiredFields = ['category', 'classify', 'id_product', 'product', 'price', 'quantity', 'discount'];
    for (const field of requiredFields) {
      if (!inputs[field]) {
        setError(`Vui lòng điền ${field === 'id_product' ? 'ID sản phẩm' : field}`);
        setLoading(false);
        return;
      }
    }

    if (!files.file) {
      setError('Vui lòng chọn ít nhất một hình ảnh chính cho sản phẩm (Hình ảnh sản phẩm 1)');
      setLoading(false);
      return;
    }

    const id = AuthModel.getIdAdmin();
    if (!id) {
      setError('Không tìm thấy ID admin. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }

    try {
      // Tạo đối tượng formData mới lưu trữ các cặp key và value
      const formData = new FormData();
      formData.append('category', inputs.category); //thêm vào formData các trường dữ liệu mới
      formData.append('classify', inputs.classify);
      formData.append('id_product', inputs.id_product);
      formData.append('product', inputs.product);
      formData.append('price', inputs.price);
      formData.append('description', inputs.description);
      formData.append('material', inputs.material);
      formData.append('quantity', inputs.quantity);
      formData.append('discount', inputs.discount);

      // Kiểm tra file hình và thêm vào formData 
      if (files.file) formData.append('images', files.file);
      if (files.file1) formData.append('images', files.file1);
      if (files.file2) formData.append('images', files.file2);
      if (files.file3) formData.append('images', files.file3);

      const response = await fetch('http://localhost:5000/create-product', {
        method: 'POST',
        headers: {
          'Username': `${id}`,
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Thêm sản phẩm thành công!');
        navigate('/admin/manage_product');
        setInputs({
          category: '',
          classify: '',
          id_product: '',
          product: '',
          price: '',
          description: '',
          material: '',
          quantity: ''
        });
        setFiles({
          file: null,
          file1: null,
          file2: null,
          file3: null
        });
      } else {
        throw new Error(data.message || 'Không thể thêm sản phẩm');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setError(error.message || 'Đã xảy ra lỗi khi thêm sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: '200px', padding: '20px', maxWidth: '500px' }}>
      {error && (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      {loading && (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
          Đang xử lý...
        </div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: '#ffffff',
          fontFamily: 'system-ui',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h1 style={{ textAlign: 'center', marginBottom: '20px', color: '#002856' }}>Thêm Sản Phẩm</h1>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Thể loại chính</span>
          <select
            name="category"
            value={inputs.category}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              fontFamily: 'system-ui',
            }}
          >
            <option value="">Vui lòng chọn thể loại chính!</option>
            {category.map((item) => (
              <option key={item.id_category} value={item.id_category}>
                {item.name_category}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Thể loại phụ</span>
          <select
            name="classify"
            value={inputs.classify}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              fontFamily: 'system-ui',
            }}
          >
            <option value="">Vui lòng chọn phân loại!</option>
            {classify.length > 0 ? (
              classify.map((item) => (
                <option key={item.id_classify} value={item.id_classify}>
                  {item.name_classify}
                </option>
              ))
            ) : null}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>ID Sản phẩm</span>
          <input
            type="text"
            name="id_product"
            value={inputs.id_product}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Tên sản phẩm</span>
          <input
            type="text"
            name="product"
            value={inputs.product}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Đơn giá</span>
          <input
            type="number"
            name="price"
            value={inputs.price}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Giảm giá (%)</span>
          <select
            name="discount"
            value={inputs.disccount}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              fontFamily: 'system-ui',
            }}
          >
            <option value="">Vui lòng chọn giảm giá!</option>
            {discount.map((item) => (
              <option key={item.id_type_of_discount} value={item.id_type_of_discount}>
                {item.number_discount}
              </option>
            ))}
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Hình ảnh sản phẩm 1</span>
          <input
            type="file"
            name="file"
            onChange={handleChange}
            accept="image/*"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
          {files.file && (
            <img
              src={URL.createObjectURL(files.file)}
              alt="Preview 1"
              style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '10px', borderRadius: '4px' }}
            />
          )}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Hình ảnh sản phẩm 2</span>
          <input
            type="file"
            name="file1"
            onChange={handleChange}
            accept="image/*"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
          {/* URL.createObjectURL là phương thức dùng dể hiển thị hình ảnh ở trên web tạm thời trước khi đưa lên database (được dùng chung với onChange để xử lí sự kiện khi upload hình) */}
          {files.file1 && (
            <img
              src={URL.createObjectURL(files.file1)}
              alt="Preview 2"
              style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '10px', borderRadius: '4px' }}
            />
          )}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Hình ảnh sản phẩm 3</span>
          <input
            type="file"
            name="file2"
            onChange={handleChange}
            accept="image/*"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
          {files.file2 && (
            <img
              src={URL.createObjectURL(files.file2)}
              alt="Preview 3"
              style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '10px', borderRadius: '4px' }}
            />
          )}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Hình ảnh sản phẩm 4</span>
          <input
            type="file"
            name="file3"
            onChange={handleChange}
            accept="image/*"
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
          {files.file3 && (
            <img
              src={URL.createObjectURL(files.file3)}
              alt="Preview 4"
              style={{ maxWidth: '100%', maxHeight: '100px', marginTop: '10px', borderRadius: '4px' }}
            />
          )}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Mô tả</span>
          <textarea
            name="description"
            value={inputs.description}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              minHeight: '80px',
              resize: 'vertical',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Số lượng</span>
          <input
            type="number"
            name="quantity"
            value={inputs.quantity}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Chất liệu</span>
          <input
            type="text"
            name="material"
            value={inputs.material}
            onChange={handleChange}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
            }}
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: loading ? '#cccccc' : '#002856',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Đang xử lý...' : 'Thêm sản phẩm'}
        </button>
      </form>
    </div>
  );
}