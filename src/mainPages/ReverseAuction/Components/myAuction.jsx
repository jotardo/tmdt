import React, { useState } from "react";
import "./myAuction.css";
import Chat from "./chat";

export default function MyAuction() {
    const [selectedAuction, setSelectedAuction] = useState("Auction 1");

    const auctions = [
        { name: "Auction 1", description: "Vòng cổ vàng 18K", budget: "2.000.000 VND", images: ["Img1", "Img2", "Img3"] },
        { name: "Auction 2", description: "Nhẫn cưới đơn giản", budget: "1.200.000 VND", images: ["Img1", "Img2"] },
        { name: "Auction 3", description: "Bông tai bạc", budget: "800.000 VND", images: ["Img1"] },
    ];

    const current = auctions.find((a) => a.name === selectedAuction);

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

            <main className="auction-main">
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
            </main>

            <Chat />
        </div>
    );
}
