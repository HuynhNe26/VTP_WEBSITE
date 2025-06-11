import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthUser from '../../models/authUser'; // Import class AuthUser
import './contact.css';

const Contact = () => {
    const [formData, setFormData] = useState({
        id_name_contact: '',
        name_contact: '',
        id_product: '',
        name_product: '',
        phone_number_user: '',
        email: '',
        id_factory: '',
        status: 'Đang xử lý',
    });
    const [products, setProducts] = useState([]);
    const [contactTypes, setContactTypes] = useState([]);
    const [factories, setFactories] = useState([]);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Lấy dữ liệu từ API
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/products');
                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách sản phẩm.');
                }
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Không thể tải danh sách sản phẩm.');
            }
        };

        const fetchContactTypes = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/name_contact');
                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách loại liên hệ.');
                }
                const data = await response.json();
                setContactTypes(data);
            } catch (err) {
                console.error('Error fetching contact types:', err);
                setError('Không thể tải danh sách loại liên hệ.');
            }
        };

        const fetchFactories = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/factories');
                if (!response.ok) {
                    throw new Error('Không thể lấy danh sách chi nhánh.');
                }
                const data = await response.json();
                setFactories(data);
            } catch (err) {
                console.error('Error fetching factories:', err);
                setError('Không thể tải danh sách chi nhánh.');
            }
        };

        fetchProducts();
        fetchContactTypes();
        fetchFactories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name === 'id_name_contact') {
            const selectedContact = contactTypes.find((type) => type.id_name_contact === parseInt(value));
            setFormData({
                ...formData,
                id_name_contact: value,
                name_contact: selectedContact ? selectedContact.name_contact : '',
            });
        } else if (name === 'id_product') {
            const selectedProduct = products.find((product) => product.id_product === value);
            setFormData({
                ...formData,
                id_product: value,
                name_product: selectedProduct ? selectedProduct.name_product : '',
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const validateForm = () => {
        if (!formData.id_name_contact) {
            return 'Vui lòng chọn loại liên hệ.';
        }
        if (!formData.id_product) {
            return 'Vui lòng chọn sản phẩm liên quan.';
        }
        if (!formData.phone_number_user) {
            return 'Vui lòng nhập số điện thoại.';
        }
        if (!formData.email) {
            return 'Vui lòng nhập email.';
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return 'Email không hợp lệ.';
        }
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        // Validation
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        // Kiểm tra xem người dùng đã đăng nhập chưa
        if (!AuthUser.isAuthenticated()) {
            setError('Vui lòng đăng nhập để gửi thông tin liên hệ.');
            setLoading(false);
            navigate('/login');
            return;
        }

        // Lấy token từ AuthUser
        const token = AuthUser.getToken();
        if (!token) {
            setError('Không tìm thấy token. Vui lòng đăng nhập lại.');
            setLoading(false);
            navigate('/login');
            return;
        }

        // Lấy id_user từ token
        const id_user = AuthUser.getIdUser();
        if (!id_user) {
            setError('Không thể lấy thông tin người dùng từ token. Vui lòng đăng nhập lại.');
            AuthUser.logout();
            setLoading(false);
            navigate('/login');
            return;
        }

        // Chuẩn bị dữ liệu gửi lên API
        const contactData = {
            id_name_contact: parseInt(formData.id_name_contact),
            name_contact: formData.name_contact,
            id_user: id_user,
            id_product: formData.id_product,
            name_product: formData.name_product,
            phone_number_user: formData.phone_number_user,
            email: formData.email,
            status: formData.status,
        };

        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(contactData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Không thể gửi thông tin liên hệ.');
            }

            setSuccess('Thông tin liên hệ đã được gửi thành công! Chúng tôi sẽ phản hồi sớm nhất.');
            setFormData({
                id_name_contact: '',
                name_contact: '',
                id_product: '',
                name_product: '',
                phone_number_user: '',
                email: '',
                id_factory: '',
                status: 'Đang xử lý',
            });
        } catch (err) {
            setError(err.message || 'Đã xảy ra lỗi khi gửi thông tin. Vui lòng thử lại.');
            console.error('Error submitting contact form:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="contact-container">
            <h1>Liên Hệ Với Chúng Tôi</h1>
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-group">
                    <label htmlFor="id_name_contact">Loại Liên Hệ</label>
                    <select
                        name="id_name_contact"
                        value={formData.id_name_contact}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="" disabled>
                            -- Chọn Loại Liên Hệ --
                        </option>
                        {contactTypes.map((type) => (
                            <option key={type.id_name_contact} value={type.id_name_contact}>
                                {type.name_contact}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="id_product">Sản Phẩm Liên Quan</label>
                    <select
                        name="id_product"
                        value={formData.id_product}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="" disabled>
                            -- Chọn Sản Phẩm --
                        </option>
                        {products.map((product) => (
                            <option key={product.id_product} value={product.id_product}>
                                {product.name_product}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="phone_number_user">Số Điện Thoại</label>
                    <input
                        type="text"
                        name="phone_number_user"
                        value={formData.phone_number_user}
                        onChange={handleChange}
                        placeholder="Nhập số điện thoại"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Nhập email của bạn"
                        required
                        disabled={loading}
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="id_factory">Chi Nhánh Công Ty</label>
                    <select
                        name="id_factory"
                        value={formData.id_factory}
                        onChange={handleChange}
                        required
                        disabled={loading}
                    >
                        <option value="" disabled>
                            -- Chọn Chi Nhánh --
                        </option>
                        {factories.map((factory) => (
                            <option key={factory.id_factory} value={factory.id_factory}>
                                {factory.name_factory} - {factory.address_factory}
                            </option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-submit" disabled={loading}>
                    {loading ? 'Đang Gửi...' : 'Gửi Thông Tin'}
                </button>
            </form>
        </div>
    );
};

export default Contact;