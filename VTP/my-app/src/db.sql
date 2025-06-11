CREATE TABLE factory (
    id_factory VARCHAR(50) NOT NULL PRIMARY KEY,
    name_factory VARCHAR(255) NOT NULL,
    address_factory VARCHAR(255) NOT NULL
);

INSERT INTO factory(id_factory, address_factory, name_factory) VALUES
('DN1', '1322/768, ấp Ông Hường, xã Thiện Tân, huyện Vĩnh Cửu, tỉnh Đồng Nai', 'Chi nhánh 1 Đồng Nai'),
('DN2', 'ấp 5, xã Thạnh Phú, huyện Vĩnh Cửu, tỉnh Đồng Nai', 'Chi nhánh 2 Đồng Nai'),
('HCM1', '815/7, Hương Lộ 2, Phường Bình Trị Đông A, phường Tân Bình, TP. Hồ Chí Minh', 'Chi nhánh 1 TP.HCM'),
('HN1', 'Số 23, ngõ 230, phố Lạc Trung, Phường Thanh Lương, Hai Bà Trưng, Hà Nội', 'Chi nhánh 1 Hà Nội'),
('HN2', ' Cụm Công Nghiệp, Bình Phú, Thạch Thất, Hà Nội', 'Chi nhánh 2 Hà Nội'),
('QB1', ' Số 14 Vực Quành, TDP 9, Phường Đồng Sơn, Thành phố Đồng Hới, tỉnh Quảng Bình', 'Chi nhánh 1 Quảng Bình');

CREATE TABLE admin (
    id_admin INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username_admin VARCHAR(255) NOT NULL,
    password_admin VARCHAR(255) NOT NULL,
    check_login VARCHAR(255) NOT NULL,
    level_login INT NOT NULL,
    date_login DATETIME NOT NULL,
    date_logout DATETIME NOT NULL,
    status VARCHAR(255) NOT NULL,
    id_factory VARCHAR(50) NOT NULL,
    FOREIGN KEY (id_factory) REFERENCES factory(id_factory)
);

INSERT INTO admin(username_admin, password_admin, level_login, id_factory) VALUES 
('hoanghuynh', '1234', 1, 'DN1'),
('baouyen', '1234', 1, 'DN1'),
('anhkiet', '1234', 1, 'DN1'),
('minhvu', '1234', 1, 'DN1');

CREATE TABLE admin_information_required (
    id_admin_information_required INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name_required VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    last_name_admin_required VARCHAR(100) NOT NULL,
    first_name_admin_required VARCHAR(100) NOT NULL,
    phone_number_admin_required VARCHAR(11) NOT NULL,
    email_admin_required VARCHAR(255) NOT NULL,
    address_admin_required VARCHAR(255) NOT NULL,
    province_admin_required VARCHAR(200) NOT NULL,
    village_admin_required VARCHAR(200) NOT NULL,
    role_job_required VARCHAR(255) NOT NULL,
    create_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    id_admin INT NOT NULL,
    FOREIGN KEY (id_admin) REFERENCES admin(id_admin)
);

CREATE TABLE admin_information (
    id_admin_information INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    last_name_admin VARCHAR(100) NOT NULL,
    first_name_admin VARCHAR(100) NOT NULL,
    phone_number_admin VARCHAR(11) NOT NULL,
    email_admin VARCHAR(255) NOT NULL,
    address_admin VARCHAR(255) NOT NULL,
    province_admin VARCHAR(200) NOT NULL,
    village_admin VARCHAR(200) NOT NULL,
    role_job VARCHAR(255) NOT NULL,
    date_create_account DATE NOT NULL,
    id_admin INT NOT NULL,
    FOREIGN KEY (id_admin) REFERENCES admin(id_admin)
);

INSERT INTO admin_information (
    last_name_admin,
    first_name_admin,
    phone_number_admin,
    email_admin,
    address_admin,
    province_admin,
    village_admin,
    role_job,
    date_create_account,
    id_admin
) VALUES 
(
    'Nguyễn',
    'Hoàng Huynh',
    '0912345678',
    'hoanghuynh@gmail.com',
    '123/4 Bùi Văn Hòa',
    'Đồng Nai',
    'Biên Hòa',
    'Giám đốc chi nhánh',
    '2024-01-01',
    (SELECT id_admin FROM admin WHERE username_admin = 'hoanghuynh')
),
(
    'Lê',
    'Phạm Bảo Uyên',
    '0923456789',
    'baouyen@gmail.com',
    '234/5 Nguyễn Văn Trỗi', 
    'Đồng Nai',
    'Biên Hòa',
    'Quản lý sản phẩm',
    '2024-01-01',
    (SELECT id_admin FROM admin WHERE username_admin = 'baouyen')
),
(
    'Trần',
    'Diệp Anh Kiệt',
    '0934567890', 
    'kiettran3307@gmail.com',
    '1 đường 2',
    'TPHCM',
    'Quận 7',
    'Quản lý kho',
    '2024-01-01',
    (SELECT id_admin FROM admin WHERE username_admin = 'anhkiet')
),
(
    'Phùng',
    'Minh Vũ',
    '0945678901',
    'minhvu@gmail.com', 
    '456/7 Võ Thị Sáu',
    'Đồng Nai',
    'Biên Hòa',
    'Quản lý bán hàng',
    '2024-01-01',
    (SELECT id_admin FROM admin WHERE username_admin = 'minhvu')
);

CREATE TABLE user (
    id_user INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    first_name_user VARCHAR(255) NOT NULL,
    last_name_user VARCHAR(255) NOT NULL,
    password_user VARCHAR(255) NOT NULL,
    phone_number_user VARCHAR(11) NOT NULL,
    email VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    province VARCHAR(200) NOT NULL,
    village VARCHAR(200) NOT NULL,
    dateofbirth DATE NOT NULL,
    sex VARCHAR(50) NOT NULL,
    date_login DATETIME NOT NULL,
    date_logout DATETIME NOT NULL,
    date_lock DATETIME NOT NULL,
    check_buy_success INT NOT NULL,
    check_order_cancel INT NOT NULL,
    status VARCHAR(255) NOT NULL
);

INSERT INTO user (username, first_name_user, last_name_user, password_user, 
                 phone_number_user, email, address, province, village, 
                 dateofbirth, sex, date_login, date_logout, date_lock,
                 check_buy_success, check_order_cancel, status) 
VALUES 
('nguyenvanA', 'An', 'Nguyễn Văn', 'matkhau123', 
 '0912345678', 'nguyenvana@email.com', '123 Lê Lợi', 'TP.HCM', 'Quận 1',
 '1990-05-15', 'Nam', NOW(), NOW(), NOW(),
 0, 0, 'active'),
('tranthiB', 'Bình', 'Trần Thị', 'matkhau456', 
 '0987654321', 'tranthib@email.com', '456 Nguyễn Huệ', 'TP.HCM', 'Quận 3',
 '1992-08-20', 'Nữ', NOW(), NOW(), NOW(),
 0, 0, 'active'),
('phamvanC', 'Cường', 'Phạm Văn', 'matkhau789', 
 '0923456789', 'phamvanc@email.com', '789 Trần Hưng Đạo', 'Hà Nội', 'Hoàn Kiếm',
 '1988-12-10', 'Nam', NOW(), NOW(), NOW(),
 0, 0, 'active');

CREATE TABLE type_of_discount (
    id_type_of_discount INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    number_discount INT NOT NULL
);
INSERT INTO type_of_discount (number_discount) VALUES 
(0),
(5),  
(10), 
(15),
(20), 
(30), 
(50);

CREATE TABLE category (
    id_category INT NOT NULL PRIMARY KEY,
    name_category VARCHAR(255) NOT NULL,
    image_category VARCHAR(255)
);

INSERT INTO category VALUES
('1','NEW',NULL),
('2','LIVING ROOM','http://localhost:5000/img_product/LivingRoom.jpg'),
('3','DINING ROOM','http://localhost:5000/img_product/DiningRoom.jpg'),
('4','BEDROOM','http://localhost:5000/img_product/Bedroom.jpg'),
('5','NURSERY & KIDS',NULL),
('6','OFFICE & STORAGE','http://localhost:5000/img_product/Office.jpg'),
('7','OUT DOOR','http://localhost:5000/img_product/Outdoor.jpg'),
('8','HOME DECOR',NULL),
('9','SIGNATURE',NULL);

CREATE TABLE classify (
    id_classify INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name_classify VARCHAR(255) NOT NULL,
    id_category INT NOT NULL,
    FOREIGN KEY (id_category) REFERENCES category(id_category)
);

INSERT INTO classify (name_classify, id_category) VALUES
('Lounges & Sofas','2'),
('Seating','2'),
('Storage','2'),
('Lounge Care & Cleaning','2'),

('Storage','3'),
('Dining Sets','3'),
('Dining Tables','3'),
('Dining Seating','3'),

('Beds, Bedheads & BedFrames','4'),
('Mattress','4'),
('Bedding & Manchester','4'),

('Nursery Furniture','5'),
('Nursery Bedding & Manchester','5'),
('Kids Furniture','5'),
('Kids Bedding & Manchester','5'),
('Kids Decor','5'),

('Desks','6'),
('Office Chairs','6'),
('Office Storage','6'),
('Gaming','6'),

('Outdoor Dining','7'),
('Outdoor Lounges','7'),
('Outdoor Accessories','7'),

('Home Accessories','8'),
('Rugs','8'),
('Wall Decor','8'),
('Plants & Pots','8'),
('Perago Home','8'),
('Curtains & Blinds','8'),

('Signature Living Room','9'),
('Signature Dining Room','9'),
('Signature Bedroom','9');

CREATE TABLE design (
    id_design INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name_design VARCHAR(255) NOT NULL,
    image_design VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO design (name_design, image_design) VALUES
('Thiết kế hiện đại', 'image_modern.jpg'),
('Thiết kế cổ điển', 'image_classic.jpg'),
('Thiết kế tối giản', 'image_minimalist.jpg');

CREATE TABLE product (
    id_product VARCHAR(20) NOT NULL PRIMARY KEY,
    name_product VARCHAR(255) NOT NULL,
    price INT NOT NULL,
    description VARCHAR(255) NOT NULL,
    quantity INT NOT NULL,
    material TEXT NOT NULL,
    image_product VARCHAR(255) NOT NULL,
    image_product1 VARCHAR(255) NOT NULL,
    image_product2 VARCHAR(255) NULL,
    image_product3 VARCHAR(255) NULL,
    id_category INT NOT NULL,
    id_classify INT NOT NULL,
    id_admin INT NOT NULL,
    username_admin VARCHAR(255) NOT NULL,
    id_type_of_discount INT DEFAULT NULL,
    FOREIGN KEY (id_classify) REFERENCES classify(id_classify),
    FOREIGN KEY (id_admin) REFERENCES admin(id_admin),
    FOREIGN KEY (id_type_of_discount) REFERENCES type_of_discount(id_type_of_discount)
);

INSERT INTO `product` (`id_product`, `name_product`, `price`, `description`, `quantity`, `material`, `image_product`, `image_product1`, `image_product2`, `image_product3`, `id_category`, `id_classify`, `id_admin`, `username_admin`, `id_type_of_discount`) VALUES
('SP0001', 'Sofa Hài Hòa', 5000000, 'được làm từ ...', 5000, 'Gỗ mềm', 'http://localhost:5000/img_product/SP0001.jpg', 'http://localhost:5000/img_product/SP0001,1.jpg', NULL, NULL, 2, 1, 1, 'hoanghuynh', NULL),
('SP0002', 'Sofa Bình Yên', 6000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0002.jpg', 'http://localhost:5000/img_product/SP0002,1.jpg', 'http://localhost:5000/img_product/SP0002,2.jpg', 'http://localhost:5000/img_product/SP0002,3.jpg', 2, 1, 1, 'anhkiet', NULL),
('SP0003', 'Sofa Thanh Lịch', 2000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0003.jpg', 'http://localhost:5000/img_product/SP0003,1.jpg', 'http://localhost:5000/img_product/SP0003,2.jpg', 'http://localhost:5000/img_product/SP0003,3.jpg', 2, 1, 1, 'anhkiet', NULL),
('SP0004', 'Sofa Hạnh Phúc', 3500000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0004.jpg', 'http://localhost:5000/img_product/SP0004,1.jpg', 'http://localhost:5000/img_product/SP0004,2.jpg', 'http://localhost:5000/img_product/SP0004,3.jpg', 2, 1, 1, 'anhkiet', NULL),
('SP0005', 'Sofa Êm Ái', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0005.jpg', 'http://localhost:5000/img_product/SP0005,1.jpg', 'http://localhost:5000/img_product/SP0005,2.jpg', 'http://localhost:5000/img_product/SP0005,3.jpg', 2, 1, 1, 'anhkiet', NULL),
('SP0006', 'Sofa Sang Trọng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0006.jpg', 'http://localhost:5000/img_product/SP0006,1.jpg', 'http://localhost:5000/img_product/SP0006,2.jpg', 'http://localhost:5000/img_product/SP0006,3.jpg', 2, 1, 1, 'anhkiet', NULL),
('SP0007', 'Sofa Uy Tín', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0007.jpg', 'http://localhost:5000/img_product/SP0007,1.jpg', 'http://localhost:5000/img_product/SP0007,2.jpg', 'http://localhost:5000/img_product/SP0007,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0008', 'Sofa Ấm Cúng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0008.jpg', 'http://localhost:5000/img_product/SP0008,1.jpg', 'http://localhost:5000/img_product/SP0008,2.jpg', 'http://localhost:5000/img_product/SP0008,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0009', 'Sofa Hiện Đại', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0009.jpg', 'http://localhost:5000/img_product/SP0009,1.jpg', 'http://localhost:5000/img_product/SP0009,2.jpg', 'http://localhost:5000/img_product/SP0009,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0010', 'Sofa Đô Thị', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0010.jpg', 'http://localhost:5000/img_product/SP0010,1.jpg', 'http://localhost:5000/img_product/SP0010,2.jpg', 'http://localhost:5000/img_product/SP0010,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0011', 'Sofa Tinh Tế', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0011.jpg', 'http://localhost:5000/img_product/SP0011,1.jpg', 'http://localhost:5000/img_product/SP0011,2.jpg', 'http://localhost:5000/img_product/SP0011,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0012', 'Sofa Mềm Mại', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0012.jpg', 'http://localhost:5000/img_product/SP0012,1.jpg', 'http://localhost:5000/img_product/SP0012,2.jpg', 'http://localhost:5000/img_product/SP0012,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0013', 'Sofa Phong Cách', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0013.jpg', 'http://localhost:5000/img_product/SP0013,1.jpg', 'http://localhost:5000/img_product/SP0013,2.jpg', 'http://localhost:5000/img_product/SP0013,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0014', 'Sofa Đẳng Cấp', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0014.jpg', 'http://localhost:5000/img_product/SP0014,1.jpg', 'http://localhost:5000/img_product/SP0014,2.jpg', 'http://localhost:5000/img_product/SP0014,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0015', 'Sofa Thư Giãn', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0015.jpg', 'http://localhost:5000/img_product/SP0015,1.jpg', 'http://localhost:5000/img_product/SP0015,2.jpg', 'http://localhost:5000/img_product/SP0015,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0016', 'Sofa Dịu Dàng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0016.jpg', 'http://localhost:5000/img_product/SP0016,1.jpg', 'http://localhost:5000/img_product/SP0016,2.jpg', 'http://localhost:5000/img_product/SP0016,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0017', 'Sofa Nổi Bật', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0017.jpg', 'http://localhost:5000/img_product/SP0017,1.jpg', 'http://localhost:5000/img_product/SP0017,2.jpg', 'http://localhost:5000/img_product/SP0017,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0018', 'Sofa Sành Điệu', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0018.jpg', 'http://localhost:5000/img_product/SP0018,1.jpg', 'http://localhost:5000/img_product/SP0018,2.jpg', 'http://localhost:5000/img_product/SP0018,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0019', 'Sofa Tươi Mới', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0019.jpg', 'http://localhost:5000/img_product/SP0019,1.jpg', 'http://localhost:5000/img_product/SP0019,2.jpg', 'http://localhost:5000/img_product/SP0019,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0020', 'Sofa Bền Vững', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0020.jpg', 'http://localhost:5000/img_product/SP0020,1.jpg', 'http://localhost:5000/img_product/SP0020,2.jpg', 'http://localhost:5000/img_product/SP0020,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0021', 'Sofa Tiện Nghi', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0021.jpg', 'http://localhost:5000/img_product/SP0021,1.jpg', 'http://localhost:5000/img_product/SP0021,2.jpg', 'http://localhost:5000/img_product/SP0021,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0022', 'Sofa Đẹp Mắt', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0022.jpg', 'http://localhost:5000/img_product/SP0022,1.jpg', 'http://localhost:5000/img_product/SP0022,2.jpg', 'http://localhost:5000/img_product/SP0022,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0023', 'Sofa Ấn Tượng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0023.jpg', 'http://localhost:5000/img_product/SP0023,1.jpg', 'http://localhost:5000/img_product/SP0023,2.jpg', 'http://localhost:5000/img_product/SP0023,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0024', 'Sofa Hoàn Hảo', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0024.jpg', 'http://localhost:5000/img_product/SP0024,1.jpg', 'http://localhost:5000/img_product/SP0024,2.jpg', 'http://localhost:5000/img_product/SP0024,3.jpg', 2, 1, 1, 'anhkiet', 6),
('SP0025', 'Ghế Thư Thái', 5000000, 'được làm từ ...', 5000, 'Gỗ mềm', 'http://localhost:5000/img_product/SP0025.jpg', 'http://localhost:5000/img_product/SP0025,1.jpg', NULL, NULL, 2, 2, 1, 'hoanghuynh', 2),
('SP0026', 'Ghế Nhẹ Nhàng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0026.jpg', 'http://localhost:5000/img_product/SP0026,1.jpg', 'http://localhost:5000/img_product/SP0026,2.jpg', 'http://localhost:5000/img_product/SP0026,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0027', 'Ghế Tinh Xảo', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0027.jpg', 'http://localhost:5000/img_product/SP0027,1.jpg', 'http://localhost:5000/img_product/SP0027,2.jpg', 'http://localhost:5000/img_product/SP0027,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0028', 'Ghế Dễ Chịu', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0028.jpg', 'http://localhost:5000/img_product/SP0028,1.jpg', 'http://localhost:5000/img_product/SP0028,2.jpg', 'http://localhost:5000/img_product/SP0028,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0029', 'Ghế Thanh Thoát', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0029.jpg', 'http://localhost:5000/img_product/SP0029,1.jpg', 'http://localhost:5000/img_product/SP0029,2.jpg', 'http://localhost:5000/img_product/SP0029,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0030', 'Ghế Đơn Giản', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0030.jpg', 'http://localhost:5000/img_product/SP0030,1.jpg', 'http://localhost:5000/img_product/SP0030,2.jpg', NULL, 2, 2, 1, 'anhkiet', 6),
('SP0031', 'Ghế Bền Bỉ', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0031.jpg', 'http://localhost:5000/img_product/SP0031,1.jpg', 'http://localhost:5000/img_product/SP0031,2.jpg', 'http://localhost:5000/img_product/SP0031,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0032', 'Ghế Mộc Mạc', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0032.jpg', 'http://localhost:5000/img_product/SP0032,1.jpg', 'http://localhost:5000/img_product/SP0032,2.jpg', 'http://localhost:5000/img_product/SP0032,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0033', 'Ghế Tiện Dụng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0033.jpg', 'http://localhost:5000/img_product/SP0033,1.jpg', 'http://localhost:5000/img_product/SP0033,2.jpg', 'http://localhost:5000/img_product/SP0033,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0034', 'Ghế Linh Hoạt', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0034.jpg', 'http://localhost:5000/img_product/SP0034,1.jpg', 'http://localhost:5000/img_product/SP0034,2.jpg', 'http://localhost:5000/img_product/SP0034,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0035', 'Ghế Thoải Mái', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0035.jpg', 'http://localhost:5000/img_product/SP0035,1.jpg', 'http://localhost:5000/img_product/SP0035,2.jpg', 'http://localhost:5000/img_product/SP0035,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0036', 'Ghế Độc Đáo', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0036.jpg', 'http://localhost:5000/img_product/SP0036,1.jpg', 'http://localhost:5000/img_product/SP0036,2.jpg', 'http://localhost:5000/img_product/SP0036,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0037', 'Ghế Cá Tính', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0037.jpg', 'http://localhost:5000/img_product/SP0037,1.jpg', 'http://localhost:5000/img_product/SP0037,2.jpg', 'http://localhost:5000/img_product/SP0037,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0038', 'Ghế Hấp Dẫn', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0038.jpg', 'http://localhost:5000/img_product/SP0038,1.jpg', 'http://localhost:5000/img_product/SP0038,2.jpg', 'http://localhost:5000/img_product/SP0038,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0039', 'Ghế Tự Nhiên', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0039.jpg', 'http://localhost:5000/img_product/SP0039,1.jpg', 'http://localhost:5000/img_product/SP0039,2.jpg', 'http://localhost:5000/img_product/SP0039,3.jpg', 2, 2, 1, 'anhkiet', NULL),
('SP0040', 'Ghế Thanh Bình', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0040.jpg', 'http://localhost:5000/img_product/SP0040,1.jpg', 'http://localhost:5000/img_product/SP0040,2.jpg', 'http://localhost:5000/img_product/SP0040,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0041', 'Ghế Sáng Tạo', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0041.jpg', 'http://localhost:5000/img_product/SP0041,1.jpg', 'http://localhost:5000/img_product/SP0041,2.jpg', 'http://localhost:5000/img_product/SP0041,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0042', 'Ghế Năng Động', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0042.jpg', 'http://localhost:5000/img_product/SP0042,1.jpg', 'http://localhost:5000/img_product/SP0042,2.jpg', 'http://localhost:5000/img_product/SP0042,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0043', 'Ghế Hài Lòng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0043.jpg', 'http://localhost:5000/img_product/SP0043,1.jpg', 'http://localhost:5000/img_product/SP0043,2.jpg', 'http://localhost:5000/img_product/SP0043,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0044', 'Ghế Gọn Gàng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0044.jpg', 'http://localhost:5000/img_product/SP0044,1.jpg', NULL, NULL, 2, 2, 1, 'anhkiet', 6),
('SP0045', 'Ghế Thân Thiện', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0045.jpg', 'http://localhost:5000/img_product/SP0045,1.jpg', 'http://localhost:5000/img_product/SP0045,2.jpg', 'http://localhost:5000/img_product/SP0045,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0046', 'Ghế Đa Năng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0046.jpg', 'http://localhost:5000/img_product/SP0046,1.jpg', 'http://localhost:5000/img_product/SP0046,2.jpg', 'http://localhost:5000/img_product/SP0046,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0047', 'Ghế An Toàn', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0047.jpg', 'http://localhost:5000/img_product/SP0047,1.jpg', 'http://localhost:5000/img_product/SP0047,2.jpg', NULL, 2, 2, 1, 'anhkiet', 6),
('SP0048', 'Ghế Ổn Định', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0048.jpg', 'http://localhost:5000/img_product/SP0048,1.jpg', 'http://localhost:5000/img_product/SP0048,2.jpg', 'http://localhost:5000/img_product/SP0048,3.jpg', 2, 2, 1, 'anhkiet', 6),
('SP0049', 'Tủ Lưu Trữ Hài Hòa', 5000000, 'được làm từ ...', 5000, 'Gỗ mềm', 'http://localhost:5000/img_product/SP0049.jpg', 'http://localhost:5000/img_product/SP0049,1.jpg', 'http://localhost:5000/img_product/SP0049,2.jpg', 'http://localhost:5000/img_product/SP0049,3.jpg', 2, 3, 1, 'hoanghuynh', 2),
('SP0050', 'Tủ Lưu Trữ Bình Yên', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0050.jpg', 'http://localhost:5000/img_product/SP0050,1.jpg', 'http://localhost:5000/img_product/SP0050,2.jpg', NULL, 2, 3, 1, 'anhkiet', 6),
('SP0051', 'Tủ Lưu Trữ Thanh Lịch', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0051.jpg', 'http://localhost:5000/img_product/SP0051,1.jpg', 'http://localhost:5000/img_product/SP0051,2.jpg', 'http://localhost:5000/img_product/SP0051,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0052', 'Tủ Lưu Trữ Hạnh Phúc', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0052.jpg', 'http://localhost:5000/img_product/SP0052,1.jpg', 'http://localhost:5000/img_product/SP0052,2.jpg', 'http://localhost:5000/img_product/SP0052,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0053', 'Tủ Lưu Trữ Êm Ái', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0053.jpg', 'http://localhost:5000/img_product/SP0053,1.jpg', 'http://localhost:5000/img_product/SP0053,2.jpg', NULL, 2, 3, 1, 'anhkiet', 6),
('SP0054', 'Tủ Lưu Trữ Sang Trọng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0054.jpg', 'http://localhost:5000/img_product/SP0054,1.jpg', 'http://localhost:5000/img_product/SP0054,2.jpg', 'http://localhost:5000/img_product/SP0054,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0055', 'Tủ Lưu Trữ Uy Tín', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0055.jpg', 'http://localhost:5000/img_product/SP0055,1.jpg', 'http://localhost:5000/img_product/SP0055,2.jpg', 'http://localhost:5000/img_product/SP0055,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0056', 'Tủ Lưu Trữ Ấm Cúng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0056.jpg', 'http://localhost:5000/img_product/SP0056,1.jpg', 'http://localhost:5000/img_product/SP0056,2.jpg', 'http://localhost:5000/img_product/SP0056,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0057', 'Tủ Lưu Trữ Hiện Đại', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0057.jpg', 'http://localhost:5000/img_product/SP0057,1.jpg', 'http://localhost:5000/img_product/SP0057,2.jpg', 'http://localhost:5000/img_product/SP0057,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0058', 'Tủ Lưu Trữ Đô Thị', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0058.jpg', 'http://localhost:5000/img_product/SP0058,1.jpg', 'http://localhost:5000/img_product/SP0058,2.jpg', 'http://localhost:5000/img_product/SP0058,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0059', 'Tủ Lưu Trữ Tinh Tế', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0059.jpg', 'http://localhost:5000/img_product/SP0059,1.jpg', 'http://localhost:5000/img_product/SP0059,2.jpg', 'http://localhost:5000/img_product/SP0059,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0060', 'Tủ Lưu Trữ Mềm Mại', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0060.jpg', 'http://localhost:5000/img_product/SP0060,1.jpg', 'http://localhost:5000/img_product/SP0060,2.jpg', 'http://localhost:5000/img_product/SP0060,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0061', 'Tủ Lưu Trữ Phong Cách', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0061.jpg', 'http://localhost:5000/img_product/SP0061,1.jpg', 'http://localhost:5000/img_product/SP0061,2.jpg', 'http://localhost:5000/img_product/SP0061,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0062', 'Tủ Lưu Trữ Đẳng Cấp', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0062.jpg', 'http://localhost:5000/img_product/SP0062,1.jpg', 'http://localhost:5000/img_product/SP0062,2.jpg', 'http://localhost:5000/img_product/SP0062,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0063', 'Tủ Lưu Trữ Thư Giãn', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0063.jpg', 'http://localhost:5000/img_product/SP0063,1.jpg', 'http://localhost:5000/img_product/SP0063,2.jpg', 'http://localhost:5000/img_product/SP0063,3.jpg', 2, 3, 1, 'anhkiet', NULL),
('SP0064', 'Tủ Lưu Trữ Dịu Dàng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0064.jpg', 'http://localhost:5000/img_product/SP0064,1.jpg', 'http://localhost:5000/img_product/SP0064,2.jpg', NULL, 2, 3, 1, 'anhkiet', 6),
('SP0065', 'Tủ Lưu Trữ Nổi Bật', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0065.jpg', 'http://localhost:5000/img_product/SP0065,1.jpg', 'http://localhost:5000/img_product/SP0065,2.jpg', 'http://localhost:5000/img_product/SP0065,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0066', 'Tủ Lưu Trữ Sành Điệu', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0066.jpg', 'http://localhost:5000/img_product/SP0066,1.jpg', 'http://localhost:5000/img_product/SP0066,2.jpg', 'http://localhost:5000/img_product/SP0066,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0067', 'Tủ Lưu Trữ Tươi Mới', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0067.jpg', 'http://localhost:5000/img_product/SP0067,1.jpg', NULL, NULL, 2, 3, 1, 'anhkiet', 6),
('SP0068', 'Tủ Lưu Trữ Bền Vững', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0068.jpg', 'http://localhost:5000/img_product/SP0068,1.jpg', 'http://localhost:5000/img_product/SP0068,2.jpg', 'http://localhost:5000/img_product/SP0068,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0069', 'Tủ Lưu Trữ Tiện Nghi', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0069.jpg', 'http://localhost:5000/img_product/SP0069,1.jpg', 'http://localhost:5000/img_product/SP0069,2.jpg', 'http://localhost:5000/img_product/SP0069,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0070', 'Tủ Lưu Trữ Đẹp Mắt', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0070.jpg', 'http://localhost:5000/img_product/SP0070,1.jpg', 'http://localhost:5000/img_product/SP0070,2.jpg', 'http://localhost:5000/img_product/SP0070,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0071', 'Tủ Lưu Trữ Ấn Tượng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0071.jpg', 'http://localhost:5000/img_product/SP0071,1.jpg', 'http://localhost:5000/img_product/SP0071,2.jpg', 'http://localhost:5000/img_product/SP0071,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0072', 'Tủ Lưu Trữ Hoàn Hảo', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0072.jpg', 'http://localhost:5000/img_product/SP0072,1.jpg', 'http://localhost:5000/img_product/SP0072,2.jpg', 'http://localhost:5000/img_product/SP0072,3.jpg', 2, 3, 1, 'anhkiet', 6),
('SP0073', 'Bộ Vệ Sinh Thư Thái', 5000000, 'được làm từ ...', 5000, 'Gỗ mềm', 'http://localhost:5000/img_product/SP0073.jpg', 'http://localhost:5000/img_product/SP0073,1.jpg', NULL, NULL, 2, 4, 1, 'hoanghuynh', 2),
('SP0074', 'Bộ Vệ Sinh Nhẹ Nhàng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0074.jpg', 'http://localhost:5000/img_product/SP0074,1.jpg', 'http://localhost:5000/img_product/SP0074,2.jpg', 'http://localhost:5000/img_product/SP0074,3.jpg', 2, 4, 1, 'anhkiet', 6),
('SP0075', 'Bộ Vệ Sinh Tinh Xảo', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0075.jpg', 'http://localhost:5000/img_product/SP0075,1.jpg', 'http://localhost:5000/img_product/SP0075,2.jpg', 'http://localhost:5000/img_product/SP0075,3.jpg', 2, 4, 1, 'anhkiet', 6),
('SP0076', 'Bộ Vệ Sinh Dễ Chịu', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0076.jpg', 'http://localhost:5000/img_product/SP0076,1.jpg', 'http://localhost:5000/img_product/SP0076,2.jpg', 'http://localhost:5000/img_product/SP0076,3.jpg', 2, 4, 1, 'anhkiet', 6),
('SP0077', 'Bộ Vệ Sinh Thanh Thoát', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0077.jpg', 'http://localhost:5000/img_product/SP0077,1.jpg', 'http://localhost:5000/img_product/SP0077,2.jpg', 'http://localhost:5000/img_product/SP0077,3.jpg', 2, 4, 1, 'anhkiet', 6),
('SP0078', 'Bộ Vệ Sinh Đơn Giản', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0078.jpg', 'http://localhost:5000/img_product/SP0078,1.jpg', 'http://localhost:5000/img_product/SP0078,2.jpg', 'http://localhost:5000/img_product/SP0078,3.jpg', 2, 4, 1, 'anhkiet', 6),
('SP0079', 'Tủ Ăn Hài Hòa', 5000000, 'được làm từ ...', 5000, 'Gỗ mềm', 'http://localhost:5000/img_product/SP0079.jpg', 'http://localhost:5000/img_product/SP0079,1.jpg', NULL, NULL, 3, 5, 1, 'hoanghuynh', 2),
('SP0080', 'Tủ Ăn Bình Yên', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0080.jpg', 'http://localhost:5000/img_product/SP0080,1.jpg', 'http://localhost:5000/img_product/SP0080,2.jpg', 'http://localhost:5000/img_product/SP0080,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0081', 'Tủ Ăn Thanh Lịch', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0081.jpg', 'http://localhost:5000/img_product/SP0081,1.jpg', 'http://localhost:5000/img_product/SP0081,2.jpg', 'http://localhost:5000/img_product/SP0081,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0082', 'Tủ Ăn Hạnh Phúc', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0082.jpg', 'http://localhost:5000/img_product/SP0082,1.jpg', 'http://localhost:5000/img_product/SP0082,2.jpg', 'http://localhost:5000/img_product/SP0082,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0083', 'Tủ Ăn Êm Ái', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0083.jpg', 'http://localhost:5000/img_product/SP0083,1.jpg', 'http://localhost:5000/img_product/SP0083,2.jpg', 'http://localhost:5000/img_product/SP0083,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0084', 'Tủ Ăn Sang Trọng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0084.jpg', 'http://localhost:5000/img_product/SP0084,1.jpg', 'http://localhost:5000/img_product/SP0084,2.jpg', 'http://localhost:5000/img_product/SP0084,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0085', 'Tủ Ăn Uy Tín', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0085.jpg', 'http://localhost:5000/img_product/SP0085,1.jpg', 'http://localhost:5000/img_product/SP0085,2.jpg', 'http://localhost:5000/img_product/SP0085,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0086', 'Tủ Ăn Ấm Cúng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0086.jpg', 'http://localhost:5000/img_product/SP0086,1.jpg', 'http://localhost:5000/img_product/SP0086,2.jpg', 'http://localhost:5000/img_product/SP0086,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0087', 'Tủ Ăn Hiện Đại', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0087.jpg', 'http://localhost:5000/img_product/SP0087,1.jpg', 'http://localhost:5000/img_product/SP0087,2.jpg', 'http://localhost:5000/img_product/SP0087,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0088', 'Tủ Ăn Đô Thị', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0088.jpg', 'http://localhost:5000/img_product/SP0088,1.jpg', 'http://localhost:5000/img_product/SP0088,2.jpg', 'http://localhost:5000/img_product/SP0088,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0089', 'Tủ Ăn Tinh Tế', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0089.jpg', 'http://localhost:5000/img_product/SP0089,1.jpg', 'http://localhost:5000/img_product/SP0089,2.jpg', 'http://localhost:5000/img_product/SP0089,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0090', 'Tủ Ăn Mềm Mại', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0090.jpg', 'http://localhost:5000/img_product/SP0090,1.jpg', 'http://localhost:5000/img_product/SP0090,2.jpg', 'http://localhost:5000/img_product/SP0090,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0091', 'Tủ Ăn Phong Cách', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0091.jpg', 'http://localhost:5000/img_product/SP0091,1.jpg', 'http://localhost:5000/img_product/SP0091,2.jpg', 'http://localhost:5000/img_product/SP0091,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0092', 'Tủ Ăn Đẳng Cấp', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0092.jpg', 'http://localhost:5000/img_product/SP0092,1.jpg', 'http://localhost:5000/img_product/SP0092,2.jpg', 'http://localhost:5000/img_product/SP0092,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0093', 'Tủ Ăn Thư Giãn', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0093.jpg', 'http://localhost:5000/img_product/SP0093,1.jpg', 'http://localhost:5000/img_product/SP0093,2.jpg', 'http://localhost:5000/img_product/SP0093,3.jpg', 3, 5, 1, 'anhkiet', NULL),
('SP0094', 'Tủ Ăn Dịu Dàng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0094.jpg', 'http://localhost:5000/img_product/SP0094,1.jpg', 'http://localhost:5000/img_product/SP0094,2.jpg', 'http://localhost:5000/img_product/SP0094,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0095', 'Tủ Ăn Nổi Bật', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0095.jpg', 'http://localhost:5000/img_product/SP0095,1.jpg', 'http://localhost:5000/img_product/SP0095,2.jpg', 'http://localhost:5000/img_product/SP0095,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0096', 'Tủ Ăn Sành Điệu', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0096.jpg', 'http://localhost:5000/img_product/SP0096,1.jpg', 'http://localhost:5000/img_product/SP0096,2.jpg', 'http://localhost:5000/img_product/SP0096,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0097', 'Tủ Ăn Tươi Mới', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0097.jpg', 'http://localhost:5000/img_product/SP0097,1.jpg', 'http://localhost:5000/img_product/SP0097,2.jpg', 'http://localhost:5000/img_product/SP0097,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0098', 'Tủ Ăn Bền Vững', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0098.jpg', 'http://localhost:5000/img_product/SP0098,1.jpg', 'http://localhost:5000/img_product/SP0098,2.jpg', 'http://localhost:5000/img_product/SP0098,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0099', 'Tủ Ăn Tiện Nghi', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0099.jpg', 'http://localhost:5000/img_product/SP0099,1.jpg', 'http://localhost:5000/img_product/SP0099,2.jpg', 'http://localhost:5000/img_product/SP0099,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0100', 'Tủ Ăn Đẹp Mắt', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0100.jpg', 'http://localhost:5000/img_product/SP0100,1.jpg', 'http://localhost:5000/img_product/SP0100,2.jpg', 'http://localhost:5000/img_product/SP0100,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0101', 'Tủ Ăn Ấn Tượng', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0101.jpg', 'http://localhost:5000/img_product/SP0101,1.jpg', 'http://localhost:5000/img_product/SP0101,2.jpg', 'http://localhost:5000/img_product/SP0101,3.jpg', 3, 5, 1, 'anhkiet', 6),
('SP0102', 'Tủ Ăn Hoàn Hảo', 3000000, 'được làm từ', 2000, 'Gỗ cứng', 'http://localhost:5000/img_product/SP0102.jpg', 'http://localhost:5000/img_product/SP0102,1.jpg', 'http://localhost:5000/img_product/SP0102,2.jpg', 'http://localhost:5000/img_product/SP0102,3.jpg', 3, 5, 1, 'anhkiet', 6);


CREATE TABLE hot_category (
    id_hot_category INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name_hot_category VARCHAR(255) NOT NULL
);

INSERT INTO `hot_category` (`id_hot_category`, `name_hot_category`) VALUES
(1, 'Best Seller'),
(2, 'New Arrival'),
(3, 'Sale Off'),
(4, 'Trending'),
(5, 'Most Popular'),
(6, 'Editor Choice');

CREATE TABLE description_product_details (
    id_dpd INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    description_protect TEXT NOT NULL,
    description_protect1 TEXT NOT NULL,
    description_protect2 TEXT NOT NULL,
    description_protect3 TEXT NOT NULL,
    description_protect4 TEXT NOT NULL,
    description_width VARCHAR(50) NOT NULL,
    description_height VARCHAR(50) NOT NULL,
    description_weight VARCHAR(50) NOT NULL,
    description_cubic VARCHAR(50) NOT NULL,
    description_packed VARCHAR(100) NOT NULL,
    description_finish VARCHAR(100) NOT NULL,
    id_product VARCHAR(20) NOT NULL,
    id_hot_category INT NOT NULL,
    id_design INT NOT NULL,
    FOREIGN KEY (id_product) REFERENCES product(id_product),
    FOREIGN KEY (id_hot_category) REFERENCES hot_category(id_hot_category),
    FOREIGN KEY (id_design) REFERENCES design(id_design)
);

INSERT INTO `description_product_details` (
    `description_protect`, `description_protect1`, `description_protect2`, `description_protect3`, `description_protect4`, 
    `description_width`, `description_height`, `description_weight`, `description_cubic`, `description_packed`, 
    `description_finish`, `id_product`, `id_hot_category`, `id_design`
) VALUES
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '200cm', '90cm', '50kg', '1.8m³', 'Đóng gói carton', 'Sơn bóng', 'SP0001', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '180cm', '85cm', '45kg', '1.5m³', 'Đóng gói carton', 'Sơn mờ', 'SP0002', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '190cm', '88cm', '48kg', '1.6m³', 'Đóng gói carton', 'Sơn bóng', 'SP0003', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '210cm', '92cm', '52kg', '1.9m³', 'Đóng gói carton', 'Sơn mờ', 'SP0004', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '195cm', '90cm', '47kg', '1.7m³', 'Đóng gói carton', 'Sơn bóng', 'SP0005', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '200cm', '90cm', '50kg', '1.8m³', 'Đóng gói carton', 'Sơn mờ', 'SP0006', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '180cm', '85cm', '45kg', '1.5m³', 'Đóng gói carton', 'Sơn bóng', 'SP0007', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '190cm', '88cm', '48kg', '1.6m³', 'Đóng gói carton', 'Sơn mờ', 'SP0008', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '210cm', '92cm', '52kg', '1.9m³', 'Đóng gói carton', 'Sơn bóng', 'SP0009', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '195cm', '90cm', '47kg', '1.7m³', 'Đóng gói carton', 'Sơn mờ', 'SP0010', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '200cm', '90cm', '50kg', '1.8m³', 'Đóng gói carton', 'Sơn bóng', 'SP0011', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '180cm', '85cm', '45kg', '1.5m³', 'Đóng gói carton', 'Sơn mờ', 'SP0012', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '190cm', '88cm', '48kg', '1.6m³', 'Đóng gói carton', 'Sơn bóng', 'SP0013', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '210cm', '92cm', '52kg', '1.9m³', 'Đóng gói carton', 'Sơn mờ', 'SP0014', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '195cm', '90cm', '47kg', '1.7m³', 'Đóng gói carton', 'Sơn bóng', 'SP0015', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '200cm', '90cm', '50kg', '1.8m³', 'Đóng gói carton', 'Sơn mờ', 'SP0016', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '180cm', '85cm', '45kg', '1.5m³', 'Đóng gói carton', 'Sơn bóng', 'SP0017', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '190cm', '88cm', '48kg', '1.6m³', 'Đóng gói carton', 'Sơn mờ', 'SP0018', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '210cm', '92cm', '52kg', '1.9m³', 'Đóng gói carton', 'Sơn bóng', 'SP0019', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '195cm', '90cm', '47kg', '1.7m³', 'Đóng gói carton', 'Sơn mờ', 'SP0020', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '200cm', '90cm', '50kg', '1.8m³', 'Đóng gói carton', 'Sơn bóng', 'SP0021', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '180cm', '85cm', '45kg', '1.5m³', 'Đóng gói carton', 'Sơn mờ', 'SP0022', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '190cm', '88cm', '48kg', '1.6m³', 'Đóng gói carton', 'Sơn bóng', 'SP0023', 1, 1),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 2 năm', '210cm', '92cm', '52kg', '1.9m³', 'Đóng gói carton', 'Sơn mờ', 'SP0024', 1, 1),

('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '60cm', '80cm', '15kg', '0.4m³', 'Đóng gói carton', 'Sơn bóng', 'SP0025', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '55cm', '75cm', '12kg', '0.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0026', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '58cm', '78cm', '14kg', '0.35m³', 'Đóng gói carton', 'Sơn bóng', 'SP0027', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '62cm', '82cm', '16kg', '0.45m³', 'Đóng gói carton', 'Sơn mờ', 'SP0028', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '60cm', '80cm', '15kg', '0.4m³', 'Đóng gói carton', 'Sơn bóng', 'SP0029', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '55cm', '75cm', '12kg', '0.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0030', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '58cm', '78cm', '14kg', '0.35m³', 'Đóng gói carton', 'Sơn bóng', 'SP0031', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '62cm', '82cm', '16kg', '0.45m³', 'Đóng gói carton', 'Sơn mờ', 'SP0032', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '60cm', '80cm', '15kg', '0.4m³', 'Đóng gói carton', 'Sơn bóng', 'SP0033', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '55cm', '75cm', '12kg', '0.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0034', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '58cm', '78cm', '14kg', '0.35m³', 'Đóng gói carton', 'Sơn bóng', 'SP0035', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '62cm', '82cm', '16kg', '0.45m³', 'Đóng gói carton', 'Sơn mờ', 'SP0036', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '60cm', '80cm', '15kg', '0.4m³', 'Đóng gói carton', 'Sơn bóng', 'SP0037', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '55cm', '75cm', '12kg', '0.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0038', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '58cm', '78cm', '14kg', '0.35m³', 'Đóng gói carton', 'Sơn bóng', 'SP0039', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '62cm', '82cm', '16kg', '0.45m³', 'Đóng gói carton', 'Sơn mờ', 'SP0040', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '60cm', '80cm', '15kg', '0.4m³', 'Đóng gói carton', 'Sơn bóng', 'SP0041', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '55cm', '75cm', '12kg', '0.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0042', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '58cm', '78cm', '14kg', '0.35m³', 'Đóng gói carton', 'Sơn bóng', 'SP0043', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '62cm', '82cm', '16kg', '0.45m³', 'Đóng gói carton', 'Sơn mờ', 'SP0044', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '60cm', '80cm', '15kg', '0.4m³', 'Đóng gói carton', 'Sơn bóng', 'SP0045', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '55cm', '75cm', '12kg', '0.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0046', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '58cm', '78cm', '14kg', '0.35m³', 'Đóng gói carton', 'Sơn bóng', 'SP0047', 2, 2),
('Chống thấm nước', 'Chống trầy xước', 'Chống bám bụi', 'Chịu lực tốt', 'Bảo hành 1 năm', '62cm', '82cm', '16kg', '0.45m³', 'Đóng gói carton', 'Sơn mờ', 'SP0048', 2, 2),

('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0049', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0050', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0051', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0052', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0053', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0054', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0055', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0056', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0057', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0058', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0059', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0060', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0061', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0062', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0063', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0064', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0065', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0066', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0067', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0068', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0069', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0070', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0071', 3, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0072', 3, 3),

('Không thấm nước', 'Dễ lau chùi', 'An toàn cho gỗ', 'Không gây mùi', 'Bảo hành 6 tháng', '20cm', '30cm', '1kg', '0.06m³', 'Đóng gói hộp', 'Không sơn', 'SP0073', 4, 1),
('Không thấm nước', 'Dễ lau chùi', 'An toàn cho gỗ', 'Không gây mùi', 'Bảo hành 6 tháng', '20cm', '30cm', '1kg', '0.06m³', 'Đóng gói hộp', 'Không sơn', 'SP0074', 4, 1),
('Không thấm nước', 'Dễ lau chùi', 'An toàn cho gỗ', 'Không gây mùi', 'Bảo hành 6 tháng', '20cm', '30cm', '1kg', '0.06m³', 'Đóng gói hộp', 'Không sơn', 'SP0075', 4, 1),
('Không thấm nước', 'Dễ lau chùi', 'An toàn cho gỗ', 'Không gây mùi', 'Bảo hành 6 tháng', '20cm', '30cm', '1kg', '0.06m³', 'Đóng gói hộp', 'Không sơn', 'SP0076', 4, 1),
('Không thấm nước', 'Dễ lau chùi', 'An toàn cho gỗ', 'Không gây mùi', 'Bảo hành 6 tháng', '20cm', '30cm', '1kg', '0.06m³', 'Đóng gói hộp', 'Không sơn', 'SP0077', 4, 1),
('Không thấm nước', 'Dễ lau chùi', 'An toàn cho gỗ', 'Không gây mùi', 'Bảo hành 6 tháng', '20cm', '30cm', '1kg', '0.06m³', 'Đóng gói hộp', 'Không sơn', 'SP0078', 4, 1),

('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0079', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0080', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0081', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0082', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0083', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0084', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0085', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0086', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0087', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0088', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0089', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0090', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0091', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0092', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0093', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0094', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0095', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0096', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0097', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0098', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '120cm', '180cm', '60kg', '2.2m³', 'Đóng gói carton', 'Sơn bóng', 'SP0099', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '110cm', '170cm', '55kg', '2.0m³', 'Đóng gói carton', 'Sơn mờ', 'SP0100', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '115cm', '175cm', '58kg', '2.1m³', 'Đóng gói carton', 'Sơn bóng', 'SP0101', 5, 3),
('Chống thấm nước', 'Chống trầy xước', 'Chống mối mọt', 'Chịu lực tốt', 'Bảo hành 3 năm', '125cm', '185cm', '62kg', '2.3m³', 'Đóng gói carton', 'Sơn mờ', 'SP0102', 5, 3);

CREATE TABLE purchase_order (
    id_order INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    name_user VARCHAR(255) NOT NULL,
    phone_user VARCHAR(11) NOT NULL,
    address VARCHAR(255) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,
    delivery_province VARCHAR(255) NOT NULL,
    delivery_village VARCHAR(255) NOT NULL,
    delivery_price INT NOT NULL,
    payment_method ENUM('COD','Chuyển khoản') NOT NULL,
    qr_code_url VARCHAR(255) NULL,
    status ENUM('pending','confirmed','failed','cancelled') NOT NULL DEFAULT 'pending',
    total_price INT NOT NULL,
    date_buy DATETIME NOT NULL,
    date_cancel DATETIME NOT NULL,
    recieve VARCHAR(255) NOT NULL,
    id_type_of_discount INT DEFAULT NULL,
    discount_amount INT NOT NULL DEFAULT 0,
    FOREIGN KEY (id_user) REFERENCES user(id_user),
    FOREIGN KEY (id_type_of_discount) REFERENCES type_of_discount(id_type_of_discount)
);

INSERT INTO `purchase_order` (`id_order`, `id_user`, `name_user`, `phone_user`, `address`, `delivery_address`, `delivery_province`, `delivery_village`, `delivery_price`, `payment_method`, `qr_code_url`, `status`, `total_price`, `date_buy`, `date_cancel`, `recieve`, `id_type_of_discount`, `discount_amount`) VALUES
(1, 1, 'Nguyễn Văn An', '0912345678', '123 Lê Lợi', '123 Lê Lợi', 'TP.HCM', 'Quận 1', 50000, 'Chuyển khoản', 'http://localhost:5000/img/qrthanhtoan.jpg', 'pending', 5050000, '2025-03-23 17:17:40', NULL, 'Chưa nhận', 4, 1000000),
(2, 2, 'Trần Thị Bình', '0987654321', '456 Nguyễn Huệ', '456 Nguyễn Huệ', 'TP.HCM', 'Quận 3', 50000, 'COD', NULL, 'confirmed', 3050000, '2024-01-15 10:00:00', NULL, 'Đã nhận', 1, 150000);

CREATE TABLE order_details (
    id_order INT(11) NOT NULL,
    id_product VARCHAR(20) NOT NULL,
    name_product VARCHAR(20) NOT NULL,
    quantity INT NOT NULL,
    price_at_purchase INT(11) NOT NULL,
    FOREIGN KEY (id_product) REFERENCES product(id_product),
    FOREIGN KEY (id_order) REFERENCES purchase_order(id_order)
);

INSERT INTO order_details (id_order, id_product, name_product, quantity, price_at_purchase) VALUES
(1, 'SP0001', 'Ghế sofa 1', 1, 5000000);

CREATE TABLE name_contact (
    id_name_contact INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name_contact VARCHAR(255) NOT NULL
);

INSERT INTO name_contact (name_contact) VALUES
('Báo giá sản phẩm'),
('Tư vấn sản phẩm'),
('Khiếu nại - Góp ý');

CREATE TABLE contact (
    id_contact INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_name_contact INT NOT NULL,
    name_contact VARCHAR(255) NOT NULL,
    id_user INT NOT NULL,
    id_product VARCHAR(20) NOT NULL,
    name_product VARCHAR(255) NOT NULL,
    phone_number_user VARCHAR(11) NOT NULL,
    email VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    FOREIGN KEY (id_name_contact) REFERENCES name_contact(id_name_contact),
    FOREIGN KEY (id_user) REFERENCES user(id_user),
    FOREIGN KEY (id_product) REFERENCES product(id_product)
);

INSERT INTO contact (
    id_name_contact,
    name_contact,
    id_user,
    id_product,
    name_product,
    phone_number_user,
    email,
    status
) VALUES
-- Yêu cầu báo giá
(1, 'Báo giá sản phẩm', 
 1, 'SP0001', 'Ghế sofa 1',
 '0912345678', 'nguyenvana@email.com',
 'Đang xử lý'),

-- Tư vấn sản phẩm
(2, 'Tư vấn sản phẩm',
 2, 'SP0005', 'Ghế sofa 5',
 '0987654321', 'tranthib@email.com',
 'Đã tư vấn'),

-- Khiếu nại góp ý
(3, 'Khiếu nại - Góp ý',
 3, 'SP0008', 'Ghế ngồi 1',
 '0923456789', 'phamvanc@email.com',
 'Đã xử lý');

CREATE TABLE blacklist (
    id_blacklist INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    name_user VARCHAR(255) NOT NULL,
    phone_number_user VARCHAR(11) NOT NULL,
    email VARCHAR(255) NOT NULL,
    id_order INT NOT NULL,
    name_product VARCHAR(255) NOT NULL,
    date_blacklist DATETIME NOT NULL,
    date_cancel DATETIME NOT NULL,
    number_cancel INT NOT NULL,
    FOREIGN KEY (id_user) REFERENCES user(id_user),
    FOREIGN KEY (id_order) REFERENCES purchase_order(id_order)
);

INSERT INTO blacklist (
    id_user,
    name_user,
    phone_number_user,
    email,
    id_order,
    name_product,
    date_blacklist,
    date_cancel,
    number_cancel
) VALUES
-- Khách hàng hủy nhiều đơn hàng
(1, 'Nguyễn Văn An', 
 '0912345678', 'nguyenvana@email.com',
 1, 'Ghế sofa 1',
 '2024-01-20 10:00:00',
 '2024-01-19 15:30:00',
 3),

-- Khách hàng không nhận hàng nhiều lần
(2, 'Trần Thị Bình',
 '0987654321', 'tranthib@email.com',
 2, 'Ghế ngồi 1',
 '2024-01-21 14:00:00',
 '2024-01-20 09:45:00',
 2),

-- Khách hàng có hành vi không tốt
(3, 'Phạm Văn Cường',
 '0923456789', 'phamvanc@email.com',
 1, 'Đồ vệ sinh 1',
 '2024-01-22 09:00:00',
 '2024-01-21 16:20:00',
 4);

 CREATE TABLE favorites (
    id_favorite INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_product VARCHAR(20) NOT NULL,
    date_added DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_user) REFERENCES user(id_user),
    FOREIGN KEY (id_product) REFERENCES product(id_product)
);

CREATE TABLE color (
    id_color INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name_color VARCHAR(50) NOT NULL
);