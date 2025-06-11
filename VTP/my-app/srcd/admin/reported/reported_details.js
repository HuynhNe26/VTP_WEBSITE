import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthModel from "../../models/authModel";
import { Document, Packer, Paragraph, TextRun, AlignmentType, HeadingLevel } from "docx";
import { saveAs } from "file-saver";

export default function ReportedDetails() {
    const [report, setReport] = useState(null);
    const [admin, setAdmin] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null); // State để lưu file đã chọn
    const navigate = useNavigate();
    const id_report = sessionStorage.getItem("id_report");
    const id = AuthModel.getIdAdmin();

    useEffect(() => {
        setLoading(true);
        const fetchReported = async () => {
            try {
                const response = await fetch(`http://localhost:5000/get-reported-details/${id_report}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Id": `${id}`,
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    setReport(data.data);
                    setAdmin(data.admin);
                } else {
                    throw new Error(data.message || "Lỗi không xác định");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchReported();
    }, [id_report, id]);

    const exportToWord = () => {
        if (!report || !admin) return;

        const doc = new Document({
            sections: [
                {
                    properties: {
                        page: {
                            margin: { top: 1134, right: 1134, bottom: 1134, left: 1134 },
                        },
                    },
                    children: [
                        new Paragraph({
                            text: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM",
                            alignment: AlignmentType.CENTER,
                            heading: HeadingLevel.HEADING_1,
                            spacing: { after: 100 },
                        }),
                        new Paragraph({
                            text: "Độc lập - Tự do - Hạnh phúc",
                            alignment: AlignmentType.CENTER,
                            bold: true,
                            spacing: { after: 400 },
                        }),
                        new Paragraph({
                            text: "-----------------",
                            alignment: AlignmentType.CENTER,
                            spacing: { after: 400 },
                        }),
                        new Paragraph({
                            text: `ĐƠN BÁO CÁO: ${report.name_required.toUpperCase()}`,
                            alignment: AlignmentType.CENTER,
                            heading: HeadingLevel.HEADING_2,
                            spacing: { after: 400 },
                        }),
                        new Paragraph({
                            text: `Ngày gửi đơn: ${report.create_at ? new Date(report.create_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "Lỗi"}`,
                            alignment: AlignmentType.RIGHT,
                            spacing: { after: 400 },
                        }),
                        new Paragraph({
                            text: "Kính gửi: Giám đốc và ban quản lí CÔNG TY TNHH GỖ VƯƠNG THIÊN PHÁT",
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Họ và tên: ${admin.last_name_admin} ${admin.first_name_admin}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Số điện thoại: ${admin.phone_number_admin}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Email: ${admin.email_admin}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Chức vụ: ${admin.role_job}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Địa chỉ: ${admin.address_admin}, ${admin.village_admin}, ${admin.province_admin}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: `Lí do: ${report.description}`,
                            spacing: { after: 200 },
                        }),
                        new Paragraph({
                            text: "Người làm đơn",
                            alignment: AlignmentType.RIGHT,
                            spacing: { before: 200 },
                            indent: {right: 300}
                        }),
                        new Paragraph({
                            text: "Kí tên",
                            alignment: AlignmentType.RIGHT,
                            spacing: { before: 200 },
                            indent: {right: 700}
                        }),
                        new Paragraph({
                            text: `${admin.last_name_admin} ${admin.first_name_admin}`,
                            alignment: AlignmentType.RIGHT,
                            spacing: { before: 200 },
                        }),
                    ],
                },
            ],
        });

        Packer.toBlob(doc).then((blob) => {
            saveAs(blob, "Don_Bao_Cao.docx");
        });
    };

    // Hàm xử lý khi chọn file
    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    // Hàm upload file lên server
    const handleFileUpload = async () => {
        if (!selectedFile) {
            alert("Vui lòng chọn file trước khi tải lên!");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        formData.append("id_report", id_report); // Gửi kèm id_report để liên kết với báo cáo

        try {
            const response = await fetch(`http://localhost:5000/upload-signed-report`, {
                method: "POST",
                headers: {
                    "Id": `${id}`,
                },
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                alert("File đã được tải lên thành công!");
                setSelectedFile(null); // Reset file sau khi upload thành công
            } else {
                throw new Error(data.message || "Lỗi khi tải file lên");
            }
        } catch (error) {
            alert(`Lỗi: ${error.message}`);
        }
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    if (error) {
        return <div>Lỗi: {error}</div>;
    }

    return (
        <div style={{ marginLeft: "310px" }}>
            {report ? (
                <div style={{ width: "1200px" }}>
                    <div style={{ display: "flex", borderBottom: "1px solid lightGrey" }}>
                        <h2 style={{ flex: "2" }}>Tiêu đề: {report.description}</h2>
                        <h2 style={{ flex: "1" }}>
                            Ngày gửi đơn: {report.create_at ? new Date(report.create_at).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" }) : "Lỗi"}
                        </h2>
                    </div>
                    <h3>Thông tin trước khi sửa</h3>
                    <p>Họ và tên người báo cáo: {admin.last_name_admin} {admin.first_name_admin}</p>
                    <p>Số điện thoại: {admin.phone_number_admin}</p>
                    <p>Email: {admin.email_admin}</p>
                    <p>Chức vụ: {admin.role_job}</p>
                    <p>Địa chỉ:</p>
                    <div style={{ marginLeft: "30px" }}>
                        <p>Số nhà/ Đường: {admin.address_admin}</p>
                        <p>Huyện: {admin.village_admin}</p>
                        <p>Tỉnh: {admin.province_admin}</p>
                    </div>
                    <div style={{ marginTop: "20px" }}>
                        <button onClick={exportToWord} style={{ padding: "10px 20px", marginRight: "10px" }}>
                            Xuất file Word
                        </button>
                        <input
                            type="file"
                            accept=".docx"
                            onChange={handleFileChange}
                            style={{ marginRight: "10px" }}
                        />
                        <button onClick={handleFileUpload} style={{ padding: "10px 20px" }}>
                            Tải file đã ký lên
                        </button>
                    </div>
                </div>
            ) : (
                <div>Không tìm thấy chi tiết báo cáo</div>
            )}
        </div>
    );
}