import React, { useState } from "react";
import "./createAuction.css";

export default function CreateAuction() {
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [image, setImage] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Mô tả:", description);
        console.log("Ngân sách:", budget);
        console.log("Ảnh:", image);
        alert("Gửi thành công!");
    };

    return (
        <div>

            <form className="auction-form" onSubmit={handleSubmit}>
                <h3>Điền Thông Tin Đấu Giá</h3>
                <div className="form-group">
                    <label><strong>Mô tả:</strong></label><br />
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="3"
                        placeholder="Nhập mô tả thiết kế"
                        required
                    />
                </div>

                <div className="form-group">
                    <label><strong>Hình ảnh thiết kế (nếu có):</strong></label><br />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setImage(e.target.files[0])}
                    />
                </div>

                <div className="form-group">
                    <label><strong>Ngân sách (VND):</strong></label><br />
                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Ví dụ: 2000000"
                        required
                    />
                </div>

                <button type="submit">Gửi</button>
            </form>

        </div>
    );
}
