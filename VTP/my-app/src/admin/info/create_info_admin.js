import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CreateInfoAdmin() {
  const [admin, setAdmin] = useState(null);
  const [inputs, setInputs] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    province: '',
    village: '',
    address: '',
    role: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Dữ liệu tĩnh: 63 tỉnh/thành phố với tất cả quận/huyện
  const locationData = {
    'Hà Nội': [
      'Ba Đình', 'Hoàn Kiếm', 'Tây Hồ', 'Long Biên', 'Cầu Giấy', 'Đống Đa', 'Hai Bà Trưng', 'Hoàng Mai', 'Thanh Xuân', 'Sóc Sơn',
      'Đông Anh', 'Gia Lâm', 'Nam Từ Liêm', 'Thanh Trì', 'Bắc Từ Liêm', 'Mê Linh', 'Hà Đông', 'Sơn Tây', 'Ba Vì', 'Phúc Thọ',
      'Đan Phượng', 'Hoài Đức', 'Quốc Oai', 'Thạch Thất', 'Chương Mỹ', 'Thanh Oai', 'Thường Tín', 'Phú Xuyên', 'Ứng Hòa', 'Mỹ Đức'
    ],
    'TP. Hồ Chí Minh': [
      'Quận 1', 'Quận 2', 'Quận 3', 'Quận 4', 'Quận 5', 'Quận 6', 'Quận 7', 'Quận 8', 'Quận 9', 'Quận 10', 'Quận 11', 'Quận 12',
      'Bình Thạnh', 'Gò Vấp', 'Phú Nhuận', 'Tân Bình', 'Tân Phú', 'Thủ Đức', 'Bình Tân', 'Hóc Môn', 'Củ Chi', 'Nhà Bè', 'Cần Giờ', 'Bình Chánh'
    ],
    'Hải Phòng': [
      'Hồng Bàng', 'Ngô Quyền', 'Lê Chân', 'Hải An', 'Kiến An', 'Đồ Sơn', 'Dương Kinh', 'Thủy Nguyên', 'An Dương', 'An Lão',
      'Kiến Thụy', 'Tiên Lãng', 'Vĩnh Bảo', 'Cát Hải', 'Bạch Long Vĩ'
    ],
    'Đà Nẵng': [
      'Hải Châu', 'Thanh Khê', 'Sơn Trà', 'Ngũ Hành Sơn', 'Liên Chiểu', 'Cẩm Lệ', 'Hòa Vang', 'Hoàng Sa'
    ],
    'Cần Thơ': [
      'Ninh Kiều', 'Bình Thủy', 'Cái Răng', 'Ô Môn', 'Thốt Nốt', 'Vĩnh Thạnh', 'Cờ Đỏ', 'Phong Điền', 'Thới Lai'
    ],
    'Hà Giang': [
      'TP. Hà Giang', 'Đồng Văn', 'Mèo Vạc', 'Yên Minh', 'Quản Bạ', 'Vị Xuyên', 'Bắc Mê', 'Hoàng Su Phì', 'Xín Mần', 'Bắc Quang', 'Quang Bình'
    ],
    'Cao Bằng': [
      'TP. Cao Bằng', 'Bảo Lâm', 'Bảo Lạc', 'Thông Nông', 'Hà Quảng', 'Trà Lĩnh', 'Trùng Khánh', 'Hạ Lang', 'Quảng Uyên', 'Phục Hòa', 'Hoà An', 'Nguyên Bình', 'Thạch An'
    ],
    'Bắc Kạn': [
      'TP. Bắc Kạn', 'Pác Nặm', 'Ba Bể', 'Ngân Sơn', 'Bạch Thông', 'Chợ Đồn', 'Chợ Mới', 'Na Rì'
    ],
    'Tuyên Quang': [
      'TP. Tuyên Quang', 'Lâm Bình', 'Na Hang', 'Chiêm Hóa', 'Hàm Yên', 'Yên Sơn', 'Sơn Dương'
    ],
    'Lào Cai': [
      'TP. Lào Cai', 'Mường Khương', 'Si Ma Cai', 'Bắc Hà', 'Bảo Thắng', 'Bảo Yên', 'Sa Pa', 'Văn Bàn', 'Bát Xát'
    ],
    'Điện Biên': [
      'TP. Điện Biên Phủ', 'Mường Lay', 'Mường Nhé', 'Mường Chà', 'Tủa Chùa', 'Tuần Giáo', 'Điện Biên', 'Điện Biên Đông', 'Mường Ảng', 'Nậm Pồ'
    ],
    'Lai Châu': [
      'TP. Lai Châu', 'Mường Tè', 'Sìn Hồ', 'Phong Thổ', 'Than Uyên', 'Tam Đường', 'Tân Uyên', 'Nậm Nhùn'
    ],
    'Sơn La': [
      'TP. Sơn La', 'Quỳnh Nhai', 'Thuận Châu', 'Mường La', 'Bắc Yên', 'Phù Yên', 'Mộc Châu', 'Yên Châu', 'Mai Sơn', 'Sông Mã', 'Sốp Cộp', 'Vân Hồ'
    ],
    'Yên Bái': [
      'TP. Yên Bái', 'Nghĩa Lộ', 'Lục Yên', 'Văn Yên', 'Mù Cang Chải', 'Trấn Yên', 'Trạm Tấu', 'Văn Chấn', 'Yên Bình'
    ],
    'Hòa Bình': [
      'TP. Hòa Bình', 'Đà Bắc', 'Lương Sơn', 'Kim Bôi', 'Cao Phong', 'Tân Lạc', 'Mai Châu', 'Lạc Sơn', 'Yên Thủy', 'Lạc Thủy'
    ],
    'Thái Nguyên': [
      'TP. Thái Nguyên', 'Sông Công', 'Định Hóa', 'Phú Lương', 'Đồng Hỷ', 'Võ Nhai', 'Đại Từ', 'Phổ Yên', 'Phú Bình'
    ],
    'Lạng Sơn': [
      'TP. Lạng Sơn', 'Tràng Định', 'Bình Gia', 'Văn Lãng', 'Cao Lộc', 'Văn Quan', 'Bắc Sơn', 'Hữu Lũng', 'Chi Lăng', 'Lộc Bình', 'Đình Lập'
    ],
    'Quảng Ninh': [
      'TP. Hạ Long', 'TP. Móng Cái', 'TP. Cẩm Phả', 'TP. Uông Bí', 'Bình Liêu', 'Tiên Yên', 'Đầm Hà', 'Hải Hà', 'Ba Chẽ', 'Vân Đồn', 'Hoành Bồ', 'Đông Triều', 'Quảng Yên', 'Cô Tô'
    ],
    'Bắc Giang': [
      'TP. Bắc Giang', 'Yên Thế', 'Tân Yên', 'Lạng Giang', 'Lục Nam', 'Lục Ngạn', 'Sơn Động', 'Yên Dũng', 'Việt Yên', 'Hiệp Hòa'
    ],
    'Phú Thọ': [
      'TP. Việt Trì', 'Phú Thọ', 'Đoan Hùng', 'Hạ Hòa', 'Cẩm Khê', 'Yên Lập', 'Thanh Sơn', 'Phượng Lâu', 'Lâm Thao', 'Tam Nông', 'Thanh Thủy', 'Thanh Ba', 'Phù Ninh'
    ],
    'Vĩnh Phúc': [
      'TP. Vĩnh Yên', 'Phúc Yên', 'Lập Thạch', 'Tam Dương', 'Tam Đảo', 'Bình Xuyên', 'Mê Linh', 'Yên Lạc', 'Vĩnh Tường'
    ],
    'Bắc Ninh': [
      'TP. Bắc Ninh', 'Yên Phong', 'Quế Võ', 'Tiên Du', 'Từ Sơn', 'Thuận Thành', 'Gia Bình', 'Lương Tài'
    ],
    'Hải Dương': [
      'TP. Hải Dương', 'Chí Linh', 'Nam Sách', 'Kinh Môn', 'Kim Thành', 'Thanh Hà', 'Cẩm Giàng', 'Bình Giang', 'Gia Lộc', 'Tứ Kỳ', 'Ninh Giang', 'Thanh Miện'
    ],
    'Hưng Yên': [
      'TP. Hưng Yên', 'Văn Lâm', 'Văn Giang', 'Yên Mỹ', 'Mỹ Hào', 'Ân Thi', 'Khoái Châu', 'Kim Động', 'Tiên Lữ', 'Phù Cừ'
    ],
    'Thái Bình': [
      'TP. Thái Bình', 'Quỳnh Phụ', 'Hưng Hà', 'Đông Hưng', 'Thái Thụy', 'Tiền Hải', 'Kiến Xương', 'Vũ Thư'
    ],
    'Hà Nam': [
      'TP. Phủ Lý', 'Duy Tiên', 'Kim Bảng', 'Thanh Liêm', 'Bình Lục', 'Lý Nhân'
    ],
    'Nam Định': [
      'TP. Nam Định', 'Mỹ Lộc', 'Vụ Bản', 'Ý Yên', 'Nghĩa Hưng', 'Nam Trực', 'Trực Ninh', 'Xuân Trường', 'Giao Thủy', 'Hải Hậu'
    ],
    'Ninh Bình': [
      'TP. Ninh Bình', 'Tam Điệp', 'Nho Quan', 'Gia Viễn', 'Hoa Lư', 'Yên Khánh', 'Kim Sơn', 'Yên Mô'
    ],
    'Thanh Hóa': [
      'TP. Thanh Hóa', 'Bỉm Sơn', 'Sầm Sơn', 'Mường Lát', 'Quan Hóa', 'Bá Thước', 'Quan Sơn', 'Lang Chánh', 'Ngọc Lặc', 'Cẩm Thủy',
      'Thạch Thành', 'Hà Trung', 'Vĩnh Lộc', 'Yên Định', 'Thọ Xuân', 'Thường Xuân', 'Triệu Sơn', 'Thiệu Hóa', 'Hoằng Hóa', 'Hậu Lộc',
      'Nga Sơn', 'Nông Cống', 'Đông Sơn', 'Quảng Xương', 'Tĩnh Gia'
    ],
    'Nghệ An': [
      'TP. Vinh', 'Cửa Lò', 'Thái Hòa', 'Quế Phong', 'Quỳ Châu', 'Kỳ Sơn', 'Tương Dương', 'Nghĩa Đàn', 'Quỳ Hợp', 'Quỳnh Lưu',
      'Con Cuông', 'Tân Kỳ', 'Anh Sơn', 'Diễn Châu', 'Yên Thành', 'Đô Lương', 'Thanh Chương', 'Nghi Lộc', 'Nam Đàn', 'Hưng Nguyên'
    ],
    'Hà Tĩnh': [
      'TP. Hà Tĩnh', 'Hồng Lĩnh', 'Hương Sơn', 'Đức Thọ', 'Vũ Quang', 'Nghi Xuân', 'Can Lộc', 'Hương Khê', 'Thạch Hà', 'Cẩm Xuyên',
      'Kỳ Anh', 'Lộc Hà'
    ],
    'Quảng Bình': [
      'TP. Đồng Hới', 'Minh Hóa', 'Tuyên Hóa', 'Quảng Trạch', 'Bố Trạch', 'Quảng Ninh', 'Lệ Thủy'
    ],
    'Quảng Trị': [
      'TP. Đông Hà', 'Quảng Trị', 'Vĩnh Linh', 'Hướng Hóa', 'Gio Linh', 'Đa Krông', 'Cam Lộ', 'Triệu Phong', 'Hải Lăng'
    ],
    'Thừa Thiên Huế': [
      'TP. Huế', 'Phong Điền', 'Quảng Điền', 'Phú Vang', 'Hương Thủy', 'Hương Trà', 'A Lưới', 'Phú Lộc', 'Nam Đông'
    ],
    'Quảng Nam': [
      'TP. Tam Kỳ', 'TP. Hội An', 'Thăng Bình', 'Tiên Phước', 'Bắc Trà My', 'Nam Trà My', 'Núi Thành', 'Phú Ninh', 'Hiệp Đức', 'Quế Sơn',
      'Duy Xuyên', 'Đại Lộc', 'Điện Bàn', 'Nam Giang', 'Phước Sơn', 'Tây Giang', 'Đông Giang', 'Nông Sơn'
    ],
    'Quảng Ngãi': [
      'TP. Quảng Ngãi', 'Bình Sơn', 'Trà Bồng', 'Tây Trà', 'Sơn Tịnh', 'Tư Nghĩa', 'Sơn Hà', 'Sơn Tây', 'Minh Long', 'Nghĩa Hành',
      'Mộ Đức', 'Đức Phổ', 'Ba Tơ', 'Lý Sơn'
    ],
    'Bình Định': [
      'TP. Quy Nhơn', 'An Lão', 'Hoài Nhơn', 'Hoài Ân', 'Phù Mỹ', 'Vĩnh Thạnh', 'Tây Sơn', 'Phù Cát', 'An Nhơn', 'Tuy Phước', 'Vân Canh'
    ],
    'Phú Yên': [
      'TP. Tuy Hòa', 'Sông Cầu', 'Đồng Xuân', 'Tuy An', 'Sơn Hòa', 'Sông Hinh', 'Tây Hòa', 'Phú Hòa', 'Đông Hòa'
    ],
    'Khánh Hòa': [
      'TP. Nha Trang', 'Cam Ranh', 'Cam Lâm', 'Vạn Ninh', 'Ninh Hòa', 'Khánh Vĩnh', 'Diên Khánh', 'Khánh Sơn', 'Trường Sa'
    ],
    'Ninh Thuận': [
      'TP. Phan Rang - Tháp Chàm', 'Bác Ái', 'Ninh Sơn', 'Ninh Hải', 'Ninh Phước', 'Thuận Bắc', 'Thuận Nam'
    ],
    'Bình Thuận': [
      'TP. Phan Thiết', 'La Gi', 'Tuy Phong', 'Bắc Bình', 'Hàm Thuận Bắc', 'Hàm Thuận Nam', 'Tánh Linh', 'Đức Linh', 'Hàm Tân', 'Phú Quý'
    ],
    'Kon Tum': [
      'TP. Kon Tum', 'Đắk Glei', 'Ngọc Hồi', 'Đắk Tô', 'Kon Plông', 'Kon Rẫy', 'Đắk Hà', 'Sa Thầy', 'Tu Mơ Rông'
    ],
    'Gia Lai': [
      'TP. Pleiku', 'An Khê', 'Ayun Pa', 'KBang', 'Đắk Đoa', 'Chư Păh', 'Ia Grai', 'Mang Yang', 'Kông Chro', 'Đức Cơ',
      'Chư Prông', 'Chư Sê', 'Đắk Pơ', 'Ia Pa', 'Krông Pa', 'Phú Thiện', 'Chư Pưh'
    ],
    'Đắk Lắk': [
      'TP. Buôn Ma Thuột', 'Buôn Hồ', 'Ea H\'leo', 'Ea Súp', 'Buôn Đôn', 'Cư M\'gar', 'Krông Búk', 'Krông Năng', 'Ea Kar', 'M\'Đrắk',
      'Krông Bông', 'Krông Pắc', 'Krông A Na', 'Lắk', 'Cư Kuin'
    ],
    'Đắk Nông': [
      'TP. Gia Nghĩa', 'Cư Jút', 'Đắk Mil', 'Krông Nô', 'Đắk Song', 'Đắk R\'Lấp', 'Đắk Glong', 'Tuy Đức'
    ],
    'Lâm Đồng': [
      'TP. Đà Lạt', 'Bảo Lộc', 'Đam Rông', 'Lạc Dương', 'Lâm Hà', 'Đơn Dương', 'Đức Trọng', 'Di Linh', 'Bảo Lâm', 'Đạ Huoai', 'Đạ Tẻh', 'Cát Tiên'
    ],
    'Bình Phước': [
      'TP. Đồng Xoài', 'Phước Long', 'Bình Long', 'Bù Gia Mập', 'Lộc Ninh', 'Bù Đốp', 'Hớn Quản', 'Đồng Phú', 'Bù Đăng', 'Chơn Thành', 'Phú Riềng'
    ],
    'Tây Ninh': [
      'TP. Tây Ninh', 'Tân Biên', 'Tân Châu', 'Dương Minh Châu', 'Châu Thành', 'Hòa Thành', 'Gò Dầu', 'Bến Cầu', 'Trảng Bàng'
    ],
    'Bình Dương': [
      'TP. Thủ Dầu Một', 'Dĩ An', 'Thuận An', 'Tân Uyên', 'Bến Cát', 'Phú Giáo', 'Bắc Tân Uyên', 'Bàu Bàng', 'Dầu Tiếng'
    ],
    'Đồng Nai': [
      'TP. Biên Hòa', 'Long Khánh', 'Tân Phú', 'Vĩnh Cửu', 'Định Quán', 'Trảng Bom', 'Thống Nhất', 'Cẩm Mỹ', 'Long Thành', 'Xuân Lộc', 'Nhơn Trạch'
    ],
    'Bà Rịa - Vũng Tàu': [
      'TP. Vũng Tàu', 'TP. Bà Rịa', 'Châu Đức', 'Xuyên Mộc', 'Long Điền', 'Đất Đỏ', 'Tân Thành', 'Côn Đảo'
    ],
    'Long An': [
      'TP. Tân An', 'Kiến Tường', 'Tân Hưng', 'Vĩnh Hưng', 'Mộc Hóa', 'Tân Thạnh', 'Thạnh Hóa', 'Đức Huệ', 'Đức Hòa', 'Bến Lức',
      'Thủ Thừa', 'Tân Trụ', 'Cần Đước', 'Cần Giuộc', 'Châu Thành'
    ],
    'Tiền Giang': [
      'TP. Mỹ Tho', 'Gò Công', 'Cai Lậy', 'Tân Phước', 'Cái Bè', 'Châu Thành', 'Chợ Gạo', 'Gò Công Tây', 'Gò Công Đông', 'Tân Phú Đông'
    ],
    'Bến Tre': [
      'TP. Bến Tre', 'Châu Thành', 'Chợ Lách', 'Mỏ Cày Nam', 'Giồng Trôm', 'Bình Đại', 'Ba Tri', 'Thạnh Phú', 'Mỏ Cày Bắc'
    ],
    'Trà Vinh': [
      'TP. Trà Vinh', 'Càng Long', 'Cầu Kè', 'Tiểu Cần', 'Châu Thành', 'Cầu Ngang', 'Trà Cú', 'Duyên Hải'
    ],
    'Vĩnh Long': [
      'TP. Vĩnh Long', 'Long Hồ', 'Mang Thít', 'Vũng Liêm', 'Tam Bình', 'Bình Minh', 'Trà Ôn', 'Bình Tân'
    ],
    'Đồng Tháp': [
      'TP. Cao Lãnh', 'Sa Đéc', 'Hồng Ngự', 'Tân Hồng', 'Tam Nông', 'Tháp Mười', 'Cao Lãnh', 'Thanh Bình', 'Lấp Vò', 'Lai Vung', 'Châu Thành'
    ],
    'An Giang': [
      'TP. Long Xuyên', 'Châu Đốc', 'An Phú', 'Tân Châu', 'Phú Tân', 'Châu Phú', 'Tịnh Biên', 'Tri Tôn', 'Chợ Mới', 'Thoại Sơn', 'Châu Thành'
    ],
    'Kiên Giang': [
      'TP. Rạch Giá', 'Hà Tiên', 'Phú Quốc', 'Kiên Lương', 'Hòn Đất', 'Tân Hiệp', 'Châu Thành', 'Giồng Riềng', 'Gò Quao', 'An Biên',
      'An Minh', 'Vĩnh Thuận', 'Kiên Hải', 'U Minh Thượng', 'Giang Thành'
    ],
    'Hậu Giang': [
      'TP. Vị Thanh', 'Ngã Bảy', 'Châu Thành A', 'Châu Thành', 'Phụng Hiệp', 'Vị Thủy', 'Long Mỹ'
    ],
    'Sóc Trăng': [
      'TP. Sóc Trăng', 'Châu Thành', 'Kế Sách', 'Mỹ Tú', 'Cù Lao Dung', 'Long Phú', 'Mỹ Xuyên', 'Ngã Năm', 'Thạnh Trị', 'Vĩnh Châu', 'Trần Đề'
    ],
    'Bạc Liêu': [
      'TP. Bạc Liêu', 'Hồng Dân', 'Phước Long', 'Vĩnh Lợi', 'Giá Rai', 'Đông Hải', 'Hòa Bình'
    ],
    'Cà Mau': [
      'TP. Cà Mau', 'U Minh', 'Thới Bình', 'Trần Văn Thời', 'Cái Nước', 'Đầm Dơi', 'Năm Căn', 'Phú Tân', 'Ngọc Hiển'
    ],
  };

  // Lấy danh sách tỉnh từ dữ liệu tĩnh
  const provinces = Object.keys(locationData);
  const id = sessionStorage.getItem('newAdmin');

  useEffect(() => {
    setLoading(true);
    const fetchInfo = async () => {
      try {
        const response = await fetch(`http://localhost:5000/get-admin/${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        if (response.ok) {
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            setAdmin(data);
          } else {
            setError('Dữ liệu từ server không hợp lệ');
          }
        } else {
          setError(data.message || 'Lỗi khi tải dữ liệu');
        }
      } catch (error) {
        setError('Lỗi kết nối đến server');
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => {
      const newInputs = { ...prev, [name]: value };
      if (name === 'province') {
        newInputs.village = ''; 
      }
      return newInputs;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true)
    const isConfirmed = window.confirm("Bạn có chắc chắn vói thông tin của quản trị viên?");
    if (!isConfirmed) return;
    try {
      const response = await fetch(`http://localhost:5000/create-info-admin/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inputs),
      });
      const data = await response.json();
      if (response.ok) {
        alert('Cập nhật thông tin cá nhân thành công!');
        navigate('/admin/manage_admin');
      } else {
        throw new Error(data.message || 'Lỗi khi cập nhật');
      }
    } catch (error) {
      setError(error.message);
    }
    finally {
      setLoading(false)
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    backgroundColor: '#f9f9f9',
    color: '#333',
    cursor: 'not-allowed',
  };

  const editableInputStyle = {
    ...inputStyle,
    backgroundColor: '#ffffff',
    cursor: 'text',
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px' }}>
      {error ? (
        <div
          style={{
            color: 'red',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#ffebee',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          {error}
          {window.location.reload()}
        </div>
      ) : loading ? (
        <div
          style={{
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#fff3e0',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          Loading...
        </div>
      ) : admin && Object.keys(admin).length > 0 ? (
        <div
          style={{
            backgroundColor: '#ffffff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
          }}
        >
          <div style={{ display: 'flex', gap: '100px' }}>
            <div style={{ flex: '1', width: '100%' }}>
              <h2
                style={{
                  textAlign: 'center',
                  marginBottom: '20px',
                  color: '#333',
                  fontSize: '24px',
                  fontWeight: '500',
                }}
              >
                Thông Tin Quản Trị Viên
              </h2>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                  Tên đăng nhập
                </span>
                <input name="username" type="text" readOnly value={admin.username_admin || ''} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                  Mật khẩu
                </span>
                <input name="password" type="text" readOnly value={admin.password_admin || ''} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                  Mã công ty
                </span>
                <input name="factory" type="text" readOnly value={admin.id_factory || ''} style={inputStyle} />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                  Quyền quản trị
                </span>
                <input name="level" type="text" readOnly value={admin.level_login || ''} style={inputStyle} />
              </div>
            </div>

            <div style={{ flex: '1', width: '100%' }}>
              <h2
                style={{
                  textAlign: 'center',
                  marginBottom: '20px',
                  color: '#333',
                  fontSize: '24px',
                  fontWeight: '500',
                }}
              >
                Thông Tin Cá Nhân
              </h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                    Họ
                  </span>
                  <input
                    name="lastName"
                    type="text"
                    value={inputs.lastName}
                    onChange={handleChange}
                    style={editableInputStyle}
                    placeholder="VD: Nguyễn, Trần, Lê, ..."
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                    Tên
                  </span>
                  <input
                    name="firstName"
                    type="text"
                    value={inputs.firstName}
                    onChange={handleChange}
                    style={editableInputStyle}
                    placeholder="VD: Hoàng Huynh, Phạm Bảo Uyên, ..."
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                    Email
                  </span>
                  <input
                    name="email"
                    type="email"
                    value={inputs.email}
                    onChange={handleChange}
                    style={editableInputStyle}
                    placeholder="VD: example123@gmail.com"
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                    Số điện thoại
                  </span>
                  <input
                    name="phone"
                    type="tel"
                    value={inputs.phone}
                    onChange={handleChange}
                    style={editableInputStyle}
                    placeholder="VD: 09xxxxxxxx"
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                    Tỉnh/Thành phố
                  </span>
                  <select name="province" value={inputs.province} onChange={handleChange} style={editableInputStyle}>
                    <option value="">Chọn tỉnh/thành phố</option>
                    {provinces.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                    Quận/Huyện
                  </span>
                  <select
                    name="village"
                    value={inputs.village}
                    onChange={handleChange}
                    style={editableInputStyle}
                    disabled={!inputs.province}
                  >
                    <option value="">Chọn quận/huyện</option>
                    {inputs.province &&
                      locationData[inputs.province].map((district) => (
                        <option key={district} value={district}>
                          {district}
                        </option>
                      ))}
                  </select>
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                    Số nhà/ Đường, xã
                  </span>
                  <input
                    name="address"
                    type="text"
                    value={inputs.address}
                    onChange={handleChange}
                    style={editableInputStyle}
                    placeholder="VD: 101/Phạm Ngũ Lão, xã ..."
                  />
                </div>
                <div style={{ marginBottom: '15px' }}>
                  <span style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555', fontSize: '14px' }}>
                    Chức vụ
                  </span>
                  <input
                    name="role"
                    type="text"
                    value={inputs.role}
                    onChange={handleChange}
                    style={editableInputStyle}
                  />
                </div>
                <button
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                  disabled={loading}
                >
                  {loading ? 'Đang cập nhật...' : 'Cập nhật thông tin'}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div
          style={{
            color: '#666',
            marginBottom: '15px',
            padding: '10px',
            backgroundColor: '#f0f0f0',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          Không có dữ liệu admin
        </div>
      )}
    </div>
  );
}