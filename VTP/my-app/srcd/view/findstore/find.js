import React, { useEffect, useState } from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import './find.css';

// Import AdvancedMarkerElement từ google.maps.marker
const { AdvancedMarkerElement } = window.google?.maps?.marker || {};

const Findstore = () => {
    const [currentLocation, setCurrentLocation] = useState(null);
    const [selectedCompany, setSelectedCompany] = useState(null);
    const [locationError, setLocationError] = useState(null);
    const [isTracking, setIsTracking] = useState(false);
    const [mapError, setMapError] = useState(null);

    const companies = [
        { name: "Chi nhánh 1 Đồng Nai", location: { lat: 10.9511, lng: 106.9885 }, address: "123 Đường A, Đồng Nai" },
        { name: "Chi nhánh 2 Đồng Nai", location: { lat: 10.9465, lng: 106.9793 }, address: "456 Đường B, Đồng Nai" },
        { name: "Chi nhánh 1 TP.HCM", location: { lat: 10.762622, lng: 106.660172 }, address: "789 Đường C, TP.HCM" },
        { name: "Chi nhánh 1 Hà Nội", location: { lat: 21.0043, lng: 105.8552 }, address: "101 Đường D, Hà Nội" },
        { name: "Chi nhánh 2 Hà Nội", location: { lat: 21.0167, lng: 105.5633 }, address: "202 Đường E, Hà Nội" },
        { name: "Chi nhánh 1 Quảng Bình", location: { lat: 17.4553, lng: 106.6002 }, address: "303 Đường F, Quảng Bình" },
    ];

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
                            setLocationError("Bạn đã từ chối cấp quyền truy cập vị trí. Vui lòng cấp quyền trong cài đặt trình duyệt.");
                            break;
                        case error.POSITION_UNAVAILABLE:
                            setLocationError("Không thể xác định vị trí của bạn. Vui lòng kiểm tra kết nối mạng hoặc GPS.");
                            break;
                        case error.TIMEOUT:
                            setLocationError("Yêu cầu lấy vị trí đã hết thời gian. Vui lòng thử lại sau.");
                            break;
                        default:
                            setLocationError("Đã xảy ra lỗi khi lấy vị trí. Vui lòng thử lại.");
                            break;
                    }
                },
                { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
            );
        } else {
            setLocationError("Trình duyệt của bạn không hỗ trợ định vị. Vui lòng sử dụng trình duyệt khác (Chrome, Firefox, v.v.).");
        }
    };

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

        return () => {
            if (watchId) {
                navigator.geolocation.clearWatch(watchId);
            }
        };
    }, [isTracking]);

    useEffect(() => {
        getUserLocation();
    }, []);

    const handleCompanySelect = (event) => {
        const selectedIndex = event.target.value;
        if (selectedIndex === "") {
            setSelectedCompany(null);
        } else {
            setSelectedCompany(companies[selectedIndex]);
        }
    };

    const toggleTracking = () => {
        setIsTracking((prev) => !prev);
    };

    const defaultCenter = { lat: 10.7769, lng: 106.6951 };
    const center = selectedCompany ? selectedCompany.location : currentLocation || defaultCenter;

    const handleMapLoadError = (error) => {
        console.error("Google Maps API failed to load:", error);
        setMapError("Không thể tải bản đồ. Vui lòng kiểm tra API Key hoặc kết nối mạng.");
    };

    return (
        <div className="container">
            <h1>Địa Chỉ Các Nhà Máy</h1>
            {locationError && (
                <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                    {locationError}
                </div>
            )}
            {mapError && (
                <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                    {mapError}
                </div>
            )}
            <div className="controls">
                <div className="company-selector">
                    <h3>Chọn Công Ty</h3>
                    <select onChange={handleCompanySelect} value={selectedCompany ? companies.indexOf(selectedCompany) : ""}>
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

            {selectedCompany && (
                <div className="company-info" style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    <h4>Thông tin chi nhánh</h4>
                    <p><strong>Tên:</strong> {selectedCompany.name}</p>
                    <p><strong>Địa chỉ:</strong> {selectedCompany.address}</p>
                    <p><strong>Tọa độ:</strong> {selectedCompany.location.lat}, {selectedCompany.location.lng}</p>
                </div>
            )}

            <div className="map-container">
                <LoadScript
                    googleMapsApiKey="AIzaSyA_C2E6oD50xYWTtDX_YM8Fmxc4ELBbqFA"
                    onError={handleMapLoadError}
                    libraries={["marker"]} // Thêm thư viện marker để sử dụng AdvancedMarkerElement
                >
                    <GoogleMap
                        mapContainerStyle={{ height: "500px", width: "100%" }}
                        zoom={selectedCompany ? 15 : currentLocation ? 12 : 7}
                        center={center}
                    >
                        {currentLocation && AdvancedMarkerElement && (
                            <AdvancedMarkerElement
                                position={currentLocation}
                                title="Vị trí hiện tại của bạn"
                            >
                                <div style={{ width: '32px', height: '32px' }}>
                                    <img
                                        src="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                                        alt="Current Location"
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                            </AdvancedMarkerElement>
                        )}
                        {selectedCompany && AdvancedMarkerElement && (
                            <AdvancedMarkerElement
                                position={selectedCompany.location}
                                title={selectedCompany.name}
                            >
                                <div style={{ width: '32px', height: '32px' }}>
                                    <img
                                        src="http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                                        alt={selectedCompany.name}
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                </div>
                            </AdvancedMarkerElement>
                        )}
                    </GoogleMap>
                </LoadScript>
            </div>
        </div>
    );
};

export default Findstore;