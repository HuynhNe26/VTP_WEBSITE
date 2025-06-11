import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthModel from '../../models/authModel';

export default function CreateProduct() {
  const [category, setCategory] = useState([]);
  const [classify, setClassify] = useState([]);
  const [inputs, setInputs] = useState({ category: '', classify: '', id_product: '', product: '', price: '', description: '', material: '', quantity: '' });
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
        console.log(data)
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

    fetchClassify();
  }, [inputs.category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const id = AuthModel.getIdAdmin();
    try {
      const response = await fetch('http://localhost:5000/create-product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Username': `${id}`,
        },
        body: JSON.stringify({
          category: inputs.category,
          classify: inputs.classify,
          id_product: inputs.id_product,
          product: inputs.product,
          price: inputs.price,
          description: inputs.description,
          material: inputs.material,
          quantity: inputs.quantity,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Thêm sản phẩm thành công!');
        navigate('/admin/manage_product');
        setInputs({ category: '', classify: '', id_product: '', product: '', price: '', description: '', material: '', quantity: '' }); // Reset form
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ marginLeft: '200px', padding: '20px', maxWidth: '500px' }}>
      {error ? (
        <div style={{ color: 'red', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>
          {error}
        </div>
      ) : loading ? (
        <div style={{ marginBottom: '15px', padding: '10px', backgroundColor: '#fff3e0', borderRadius: '4px' }}>
          Đang tải...
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          style={{
            backgroundColor: '#ffffff',
            fontFamily: 'system-ui'
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
                fontFamily: 'system-ui'
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
                fontFamily: 'system-ui'
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
                width: '96.5%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#02856' }}>Tên sản phẩm</span>
            <input
              type="text"
              name="product"
              value={inputs.product}
              onChange={handleChange}
              style={{
                width: '96.5%',
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
                width: '96.5%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#002856' }}>Mô tả</span>
            <textarea
              name="description"
              value={inputs.description}
              onChange={handleChange}
              style={{
                width: '96.5%',
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
                width: '96.5%',
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
                width: '96.5%',
                padding: '8px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px',
              }}
            />
          </div>
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '10px',
              backgroundColor: '#002856',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '16px',
              fontWeight:'bold'
            }}
          >
            Thêm sản phẩm
          </button>
        </form>
      )}
    </div>
  );
}