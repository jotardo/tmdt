import React, { useState } from "react";

export default function MyAcceptedAuctions({ acceptedList }) {
    return (
        <div className="my-accepted-auctions">
            <h2>Đơn đã nhận</h2>
            {acceptedList.length === 0 ? (
                <p>Chưa có đơn nào được nhận.</p>
            ) : (
                acceptedList.map((auction, idx) => (
                    <div key={idx}>
                        <h4>{auction.name}</h4>
                        <p>{auction.description}</p>
                    </div>
                ))
            )}
        </div>
    );
}
