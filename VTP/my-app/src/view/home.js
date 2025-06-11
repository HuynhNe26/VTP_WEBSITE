import React, { useEffect, useState } from "react";
import '../css/home.css'

const Home = () => {
  const [imageData, setImageData] = useState([]); // Lưu danh sách sản phẩm
  const [index, setIndex] = useState(0); // Chỉ số sản phẩm hiện tại

  const [currentImage, setCurrentImage] = useState(null);
  const [currentImage1, setCurrentImage1] = useState(null);

  // Fetch dữ liệu từ API khi component mount
  useEffect(() => {
    fetch("http://localhost:5000/home")
      .then((response) => response.json())
      .then((data) => {
        console.log("Fetched images:", data); // Debug dữ liệu API
        if (data.length > 0) {
          setImageData(data);
          setIndex(0);
          setCurrentImage(data[0]?.image_product || "");
          setCurrentImage1(data[0]?.image_product1 || "");
        }
      })
      .catch((error) => console.error("Error fetching images:", error));
  }, []);

  useEffect(() => {
    if (imageData.length > 1) {
      const interval = setInterval(() => {
        setIndex((prevIndex) => {
          const newIndex = (prevIndex + 1) % imageData.length;
          setCurrentImage(imageData[newIndex]?.image_product || "");
          setCurrentImage1(imageData[newIndex]?.image_product1 || "");
          console.log("Updated images:", imageData[newIndex]); // Debug ảnh hiển thị
          return newIndex;
        });
      }, 3000);

      return () => clearInterval(interval);
    }
  }, [imageData]);

  return (
    <div>
      <div class="banner-container">
        <div class="banner-text">
          CHÀO MỪNG BẠN ĐẾN VỚI VƯƠNG THIÊN PHÁT - THIÊN ĐƯỜNG NỘI THẤT ĐẲNG CẤP NƠI BIẾN KHÔNG GIAN SỐNG CỦA BẠN THÀNH TỔ ẤM HOÀN MỸ.
          &nbsp;&nbsp;&nbsp;
          CHỐT ĐƠN NGAY NÀO!!!
          &nbsp;&nbsp;&nbsp;
          CHỐT ĐƠN NGAY NÀO!!!
          &nbsp;&nbsp;&nbsp;
          CHỐT ĐƠN NGAY NÀO!!!
          &nbsp;&nbsp;&nbsp;
          CHÀO MỪNG BẠN ĐẾN VỚI VƯƠNG THIÊN PHÁT - THIÊN ĐƯỜNG NỘI THẤT ĐẲNG CẤP NƠI BIẾN KHÔNG GIAN SỐNG CỦA BẠN THÀNH TỔ ẤM HOÀN MỸ.
          &nbsp;&nbsp;&nbsp;
          CHỐT ĐƠN NGAY NÀO!!!
          &nbsp;&nbsp;&nbsp;
          CHỐT ĐƠN NGAY NÀO!!!
          &nbsp;&nbsp;&nbsp;
          CHỐT ĐƠN NGAY NÀO!!!
          &nbsp;&nbsp;&nbsp;
          CHÀO MỪNG BẠN ĐẾN VỚI VƯƠNG THIÊN PHÁT - THIÊN ĐƯỜNG NỘI THẤT ĐẲNG CẤP NƠI BIẾN KHÔNG GIAN SỐNG CỦA BẠN THÀNH TỔ ẤM HOÀN MỸ.
          &nbsp;&nbsp;&nbsp;
          CHỐT ĐƠN NGAY NÀO!!!
          &nbsp;&nbsp;&nbsp;
          CHỐT ĐƠN NGAY NÀO!!!
          &nbsp;&nbsp;&nbsp;
          CHỐT ĐƠN NGAY NÀO!!!
          &nbsp;&nbsp;&nbsp;
          CHÀO MỪNG BẠN ĐẾN VỚI VƯƠNG THIÊN PHÁT - THIÊN ĐƯỜNG NỘI THẤT ĐẲNG CẤP NƠI BIẾN KHÔNG GIAN SỐNG CỦA BẠN THÀNH TỔ ẤM HOÀN MỸ.
          &nbsp;&nbsp;&nbsp;
          CHỐT ĐƠN NGAY NÀO!!!
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', margin: "20px 80px 10px 60px" }}>
        <div style={{ flex: 1, }}>
          {currentImage && <img src={currentImage} alt="Product" style={{ width: "650px", height: "auto", objectFit: "cover" }} />}
        </div>
        <div style={{ flex: 1, }}>
          {currentImage1 && <img src={currentImage1} alt="Product1" style={{ width: "650px", height: "auto", objectFit: "cover" }} />}
        </div>
      </div>
    </div>
  );
};

export default Home;
