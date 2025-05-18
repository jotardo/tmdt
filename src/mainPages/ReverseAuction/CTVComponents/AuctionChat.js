import React from "react";
import Chat from "./chat";

export default function AuctionChat({ auctionName }) {
    // Có thể dùng chatStore từ context nếu cần
    return (
        <div className="auction-chat-box">
            <Chat auctionName={auctionName} />
        </div>
    );
}
