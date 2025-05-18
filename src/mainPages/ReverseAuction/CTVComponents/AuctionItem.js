import React, { useState } from "react";
import AuctionChat from "./AuctionChat";

export default function AuctionItem({ auction }) {
    const [accepted, setAccepted] = useState(false);
    const [showChat, setShowChat] = useState(false);

    const handleAccept = () => {
        setAccepted(true);
        alert("Bạn đã nhận đơn này!");
    };

    return (
        <div className="auction-item">
            <h3>{auction.name}</h3>
            <p><strong>Mô tả:</strong> {auction.description}</p>
            <p><strong>Ngân sách:</strong> {auction.budget}</p>

            {auction.images?.map((img, idx) => (
                <div key={idx} className="image-box">{img}</div>
            ))}

            {!accepted ? (
                <button onClick={handleAccept}>Nhận đơn</button>
            ) : (
                <>
                    <button onClick={() => setShowChat(!showChat)}>
                        {showChat ? "Ẩn chat" : "Chat với khách hàng"}
                    </button>
                    {showChat && (
                        <AuctionChat auctionName={auction.name} />
                    )}
                </>
            )}
        </div>
    );
}
