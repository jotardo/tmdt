import React, { useState } from "react";
import "./myAuction.css";
import Chat from "./chat";
import { useAuctionContext } from "./AuctionContext";

export default function MyAuction() {
    const { auctions } = useAuctionContext();
    const [selectedAuction, setSelectedAuction] = useState(auctions[0]?.name || "");
    const [chatStore, setChatStore] = useState({});
    const [editing, setEditing] = useState(false);

    const current = auctions.find((a) => a.name === selectedAuction);

    if (!current) return <div>Không có đấu giá nào.</div>;

    const handleEditClick = () => {
        alert("Chỉnh quàiiii");
        setEditing(true);
    };

    const handleDealClick = () => {
        alert("Đợi CTV phản hồi");
    };

    return (
        <div className="auction-layout">
            <aside className="auction-sidebar">
                <h2>My Auctions</h2>
                {auctions.map((a) => (
                    <div
                        key={a.name}
                        className={`auction-name ${selectedAuction === a.name ? "active" : ""}`}
                        onClick={() => setSelectedAuction(a.name)}
                    >
                        {a.name}
                    </div>
                ))}
            </aside>
            <div className="auction-content">
                <div className="auction-main-row">
                    <section className="auction-info">
                        <h1>{current.name}</h1>
                        <div className="images">
                            {current.images.map((img, idx) => (
                                <div key={idx} className="image-box">{img}</div>
                            ))}
                        </div>
                        <div className="details">
                            <div><strong>Mô tả:</strong> {current.description}</div>
                            <div><strong>Ngân sách:</strong> {current.budget}</div>
                        </div>

                        <div className="button-group">
                            <button onClick={handleEditClick}>✏️ Chỉnh sửa</button>
                            <button onClick={handleDealClick}>✅ DEAL</button>
                        </div>
                    </section>

                    <section className="auction-chat">
                        <Chat
                            key={selectedAuction}
                            auctionName={selectedAuction}
                            chatStore={chatStore}
                            setChatStore={setChatStore}
                        />
                    </section>
                </div>
            </div>
        </div>
    );
}
