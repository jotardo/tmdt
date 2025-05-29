import React from "react";
import { useAuctionContext } from "./AuctionContext";
import AuctionItem from "./AuctionItem";

export default function AllAuctions() {
    const { auctions } = useAuctionContext();

    return (
        <div className="auction-list">
            <h2>Tất cả đơn đấu giá</h2>
            {auctions.length === 0 ? (
                <p>Không có đơn nào.</p>
            ) : (
                auctions.map((auction, idx) => (
                    <AuctionItem key={idx} auction={auction} />
                ))
            )}
        </div>
    );
}
