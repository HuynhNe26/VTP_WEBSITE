import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import './find.css';

const Findstore = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isTracking, setIsTracking] = useState(false);

    const companies = [
        { name: "Chi nhánh 1 Đồng Nai", location: { lat: 10.9511, lng: 106.9885 } },
        { name: "Chi nhánh 2 Đồng Nai", location: { lat: 10.9511, lng: 106.9885 } },
        { name: "Chi nhánh 1 TP.HCM", location: { lat: 10.762622, lng: 106.660172 } },
        { name: "Chi nhánh 1 Hà Nội", location: { lat: 21.0043, lng: 105.8552 } },
        { name: "Chi nhánh 2 Hà Nội", location: { lat: 21.0167, lng: 105.5633 } },
        { name: "Chi nhánh 1 Quảng Bình", location: { lat: 17.4553, lng: 106.6002 } }
    ];

    // Hàm lấy vị trí người dùng
    const getUserLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCurrentLocation(newLocation);
                    setLocationError(null);
                },
                (error) => {
                    console.error("Error getting location: ", error);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            setLocationError("Bạn đã từ chối cấp quyền truy cập vị trí. Vui lòng cấp quyền để sử dụng tính năng này.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setLocationError("Không thể xác định vị trí của bạn. Vui lòng thử lại.");
                            break;
                        case error.TIMEOUT:
                            setLocationError("Yêu cầu lấy vị trí đã hết thời gian. Vui lòng thử lại.");
                            break;
                        default:
                            setLocationError("Đã xảy ra lỗi khi lấy vị trí. Vui lòng thử lại.");
                            break;
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setLocationError("Trình duyệt của bạn không hỗ trợ định vị. Vui lòng sử dụng trình duyệt khác.");
        }
    };

    // Theo dõi vị trí người dùng theo thời gian thực
    useEffect(() => {
        let watchId;
        if (navigator.geolocation && isTracking) {
            watchId = navigator.geolocation.watchPosition(
                (position) => {
                    const newLocation = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    setCurrentLocation(newLocation);
                    setLocationError(null);
                },
                (error) => {
                    console.error("Error tracking location: ", error);
                    setLocationError("Không thể theo dõi vị trí của bạn. Vui lòng kiểm tra quyền truy cập vị trí.");
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        }

        // Dọn dẹp khi component unmount hoặc dừng theo dõi
        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [isTracking]);

    // Lấy vị trí ban đầu khi component mount
    useEffect(() => {
        getUserLocation();
    }, []);

    const handleCompanySelect = (event) => {
        const selectedIndex = event.target.value;
        setSelectedCompany(companies[selectedIndex]);
    };

    const toggleTracking = () => {
        setIsTracking((prev) => !prev);
    };

    const center = selectedCompany ? selectedCompany.location : currentLocation || { lat: 10.7769, lng: 106.6951 };

    return (
        <div className="container">
            <h1>Địa chỉ các nhà máy</h1>
            {locationError && (
                <div className="error-message">
                    {locationError}
                </div>
            )}
            <div className="controls">
                <div className="company-selector">
                    <h3>Chọn Công Ty</h3>
                    <select onChange={handleCompanySelect} defaultValue="">
                        <option value="" disabled>-- Chọn Công Ty --</option>
                        {companies.map((company, index) => (
                            <option key={index} value={index}>
                                {company.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="location-controls">
                    <button onClick={getUserLocation} className="btn btn-locate">
                        Tìm vị trí của tôi
                    </button>
                    <button onClick={toggleTracking} className={`btn ${isTracking ? 'btn-stop' : 'btn-track'}`}>
                        {isTracking ? 'Dừng theo dõi' : 'Theo dõi vị trí'}
                    </button>
                </div>
            </div>
            <div className="map-container">
                <LoadScript googleMapsApiKey="AIzaSyCV-7vG1OLO4qyn4GwOLjjZoxpY0jDJSJ0">
                    <GoogleMap
                        mapContainerStyle={{ height: "500px", width: "100%" }}
                        zoom={selectedCompany ? 15 : currentLocation ? 12 : 7}
                        center={center}
                    >
                        {currentLocation && (
                            <Marker
                                position={currentLocation}
                                title="Vị trí hiện tại"
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
                                }}
                            />
                        )}
                        {selectedCompany && (
                            <Marker
                                position={selectedCompany.location}
                                title={selectedCompany.name}
                                icon={{
                                    url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png",
                                }}
                            />
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

export default Findstore;