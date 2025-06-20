import React, { useState } from "react";
import "./createAuction.css";
import { useAuctionContext } from "./AuctionContext";
import {createReverseAuction} from "../../../services/AuctionService/auctionService";

export default function CreateAuction() {
    const [description, setDescription] = useState("");
    const [budget, setBudget] = useState("");
    const [image, setImage] = useState([]);
    const [jewelryType, setJewelryType] = useState("");
    const [material, setMaterial] = useState("");
    const [size, setSize] = useState("");
    const [specialRequest, setSpecialRequest] = useState("");
    const [deadline, setDeadline] = useState("");
    const currentToken = localStorage.getItem("jwtToken");

    const jewelryOptions = [
        {
            type: "Nhẫn",
            materials: ["Vàng 18k", "Vàng trắng", "Bạc", "Bạch kim", "Kim cương"],
            sizePlaceholder: "Ví dụ: size nhẫn 16, 17, 18...",
        },
        {
            type: "Dây chuyền",
            materials: ["Vàng 18k", "Bạc", "Bạch kim", "Ngọc trai"],
            sizePlaceholder: "Chiều dài dây (cm), ví dụ: 40, 45, 50...",
        },
        {
            type: "Bông tai",
            materials: ["Vàng 18k", "Bạc", "Bạch kim", "Đá quý"],
            sizePlaceholder: "Kích thước mặt (mm), ví dụ: 5, 8, 10...",
        },
        {
            type: "Lắc tay",
            materials: ["Vàng 18k", "Bạc", "Bạch kim"],
            sizePlaceholder: "Chu vi cổ tay (cm), ví dụ: 16, 18, 20...",
        },
        {
            type: "Khác",
            materials: ["Vàng", "Bạc", "Bạch kim", "Đá quý", "Khác"],
            sizePlaceholder: "Nhập kích thước phù hợp...",
        }
    ];

    const selectedJewelry = jewelryOptions.find(j => j.type === jewelryType);
    const materialOptions = selectedJewelry ? selectedJewelry.materials : [];
    const sizePlaceholder = selectedJewelry ? selectedJewelry.sizePlaceholder : "Nhập kích thước...";




    const handleSubmit = async (e) => {
        e.preventDefault();

        const auctionData = {
            description,
            budget: `${budget} VND`,
            jewelryType,
            material,
            size,
            specialRequest,
            deadline,
        };

        const formData = new FormData();
        formData.append(
            "data",
            new Blob([JSON.stringify(auctionData)], { type: "application/json" })
        );



        if (image && image.length > 0) {
            for (let i = 0; i < image.length; i++) {
                formData.append("images", image[i]);
            }
        }

        try {
            await createReverseAuction(formData, currentToken);
            alert("Tạo phiên đấu giá thành công! Chúng tôi sẽ liên hệ bạn sớm.");
            setDescription("");
            setBudget("");
            setImage([]);
            setJewelryType("");
            setMaterial("");
            setSize("");
            setSpecialRequest("");
            setDeadline("");
        } catch (error) {
            alert("Có lỗi xảy ra khi tạo phiên đấu giá!");
            console.error(error);
        }
    };



    return (
        <form className="auction-form" onSubmit={handleSubmit}>
            <h3>Khởi tạo phiên đấu giá trang sức theo yêu cầu</h3>
            <div className="form-group">
                <label><strong>Loại trang sức:</strong></label>
                <select
                    value={jewelryType}
                    onChange={e => {
                        setJewelryType(e.target.value);
                        setMaterial(""); // reset khi đổi loại
                        setSize("");
                    }}
                    required
                >
                    <option value="">Chọn loại</option>
                    {jewelryOptions.map(j => (
                        <option key={j.type} value={j.type}>{j.type}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label><strong>Chất liệu mong muốn:</strong></label>
                <select
                    value={material}
                    onChange={e => setMaterial(e.target.value)}
                    required
                    disabled={!jewelryType}
                >
                    <option value="">Chọn chất liệu</option>
                    {materialOptions.map(m => (
                        <option key={m} value={m}>{m}</option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label><strong>Kích thước/Size (nếu có):</strong></label>
                <input
                    type="text"
                    value={size}
                    onChange={e => setSize(e.target.value)}
                    placeholder={sizePlaceholder}
                    disabled={!jewelryType}
                />
            </div>
            <div className="form-group">
                <label><strong>Mô tả ý tưởng thiết kế:</strong></label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    rows="3"
                    placeholder="Nhập mô tả ý tưởng thiết kế của bạn"
                    required
                />
            </div>
            <div className="form-group">
                <label><strong>Yêu cầu đặc biệt (nếu có):</strong></label>
                <textarea
                    value={specialRequest}
                    onChange={e => setSpecialRequest(e.target.value)}
                    rows="2"
                    placeholder="Ví dụ: Khắc tên, phối màu đá, v.v."
                />
            </div>
            <div className="form-group">
                <label><strong>Hình ảnh tham khảo (nếu có):</strong></label>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={e => setImage([...e.target.files])}
                />
            </div>

            <div className="form-group">
                <label><strong>Ngân sách dự kiến (VND):</strong></label>
                <input
                    type="number"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    placeholder="Ví dụ: 2000000"
                    required
                />
            </div>
            <div className="form-group">
                <label><strong>Thời gian mong muốn hoàn thành:</strong></label>
                <input
                    type="date"
                    value={deadline}
                    onChange={e => setDeadline(e.target.value)}
                    required
                />
            </div>
            <button type="submit">Gửi yêu cầu đấu giá</button>
        </form>
    );
}
