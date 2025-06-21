import React, { useState } from "react";
import axios from "axios";
import "./RegisterCTV.css";

const provinces = ["Hà Nội", "TP. Hồ Chí Minh", "Đà Nẵng", "Cần Thơ", "Khác"];

const RegisterCTV = () => {
    const [formData, setFormData] = useState({
        email: "",
        fullName: "",
        phoneNo: "",
        location: "",
        experienceAndSkills: "",
        sampleWorkLink: "",
        reason: "",
        agree: false
    });

    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.agree) {
            setMessage("Bạn phải đồng ý với điều khoản hợp tác.");
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/register-ctv`, formData);
            setMessage(res.data.responseMessage || "Gửi yêu cầu thành công.");
        } catch (error) {
            setMessage("Gửi yêu cầu thất bại. Vui lòng kiểm tra lại địa chỉ email");
        }
    };

    return (
        <div className="register-ctv-container">
            <h2>Đăng ký làm cộng tác viên</h2>
            <form onSubmit={handleSubmit} className="register-ctv-form">
                <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
                <input type="text" name="lastName" placeholder="Họ" value={formData.lastName} onChange={handleChange} required />
                <input type="text" name="firstName" placeholder="Tên" value={formData.firstName} onChange={handleChange} required />
                <input type="text" name="phoneNo" placeholder="Số điện thoại" value={formData.phoneNo} onChange={handleChange} required />

                <select name="location" value={formData.location} onChange={handleChange} required>
                    <option value="">Chọn Tỉnh/Thành</option>
                    {provinces.map((prov, idx) => (
                        <option key={idx} value={prov}>{prov}</option>
                    ))}
                </select>

                <textarea
                    name="experienceAndSkills"
                    placeholder="Kinh nghiệm & Kỹ năng"
                    value={formData.experienceAndSkills}
                    onChange={handleChange}
                    required
                />

                <input
                    type="url"
                    name="sampleWorkLink"
                    placeholder="Link ảnh sản phẩm đã làm"
                    value={formData.sampleWorkLink}
                    onChange={handleChange}
                    required
                />

                <textarea
                    name="reason"
                    placeholder="Lý do muốn hợp tác với chúng tôi"
                    value={formData.reason}
                    onChange={handleChange}
                    required
                />

                <label>
                    <input type="checkbox" name="agree" checked={formData.agree} onChange={handleChange} />
                    Tôi đồng ý với điều khoản hợp tác
                </label>

                <button type="submit">GỬI YÊU CẦU</button>
            </form>

            {message && <p className="response-message">{message}</p>}
        </div>
    );
};

export default RegisterCTV;
