import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Sign() {
    const [inputs, setInputs] = useState({
        username: "",
        password: "",
        firstName: "",
        lastName: "",
        email: "",
        address: "",
        province: "",
        district: "",
        sex: "",
        dateofbirth: "",
        phone: "",
    });
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const navigate = useNavigate();

    // Token mẫu từ GHN (cần thay bằng token thực tế khi đăng ký)
    const GHN_TOKEN = "637170d5-942b-11ea-9821-0281a26fb5d4";

    // Lấy danh sách tỉnh khi component được mount
    useEffect(() => {
        const fetchProvinces = async () => {
            try {
                const response = await fetch(
                    "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                            Token: GHN_TOKEN,
                        },
                    }
                );
                const result = await response.json();
                if (result.code === 200) {
                    setProvinces(result.data);
                } else {
                    console.error("Error fetching provinces:", result.message);
                }
            } catch (error) {
                console.error("Error fetching provinces:", error);
            }
        };
        fetchProvinces();
    }, []);

    useEffect(() => {
        if (inputs.province) {
            const fetchDistricts = async () => {
                try {
                    const response = await fetch(
                        "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Token: GHN_TOKEN,
                            },
                            body: JSON.stringify({ province_id: parseInt(inputs.province) }),
                        }
                    );
                    const result = await response.json();
                    if (result.code === 200) {
                        setDistricts(result.data || []);
                    } else {
                        console.error("Error fetching districts:", result.message);
                    }
                } catch (error) {
                    console.error("Error fetching districts:", error);
                }
            };
            fetchDistricts();
        } else {
            setDistricts([]); // Reset quận/huyện nếu không có tỉnh được chọn
        }
    }, [inputs.province]);

    const handleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch("http://localhost:5000/sign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(inputs),
            });
            const data = await response.json();
            console.log("Success:", data);
            sessionStorage.setItem("user", JSON.stringify(data));
            if (response.ok) {
                navigate("/home");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div style={{ padding: "20px", maxWidth: "500px", margin: "0 auto", height: "2200px" }}>
            <h1 style={{ textAlign: "center", marginBottom: "20px" }}>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="text"
                        name="username"
                        value={inputs.username}
                        placeholder="Tên đăng nhập"
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="password"
                        name="password"
                        value={inputs.password}
                        placeholder="Mật khẩu"
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="text"
                        name="firstName"
                        value={inputs.firstName}
                        placeholder="Họ"
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="text"
                        name="lastName"
                        value={inputs.lastName}
                        placeholder="Tên"
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="tel"
                        name="phone"
                        value={inputs.phone}
                        placeholder="Số điện thoại"
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="email"
                        name="email"
                        value={inputs.email}
                        placeholder="Email123@gmail.com"
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <input
                        type="date"
                        name="dateofbirth"
                        value={inputs.dateofbirth}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <select
                        name="sex"
                        value={inputs.sex}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                    </select>
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <select
                        name="province"
                        value={inputs.province}
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                        <option value="">Chọn tỉnh/thành phố</option>
                        {provinces.map((province) => (
                            <option key={province.ProvinceID} value={province.ProvinceID}>
                                {province.ProvinceName}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <select
                        name="district"
                        value={inputs.district}
                        onChange={handleChange}
                        disabled={!inputs.province}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    >
                        <option value="">Chọn quận/huyện</option>
                        {districts.map((district) => (
                            <option key={district.DistrictID} value={district.DistrictID}>
                                {district.DistrictName}
                            </option>
                        ))}
                    </select>
                </div>
                <div style={{ marginBottom: "15px" }}>
                    <textarea
                        name="address"
                        value={inputs.address}
                        placeholder="Số nhà/đường, xã ..."
                        onChange={handleChange}
                        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: "100%",
                        padding: "10px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
}