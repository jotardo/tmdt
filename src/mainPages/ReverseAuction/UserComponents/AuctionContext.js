import React, { createContext, useState, useContext } from "react";

const AuctionContext = createContext(null);

export function AuctionProvider({ children }) {
    const [auctions, setAuctions] = useState([]);

    const addAuction = (auction) => {
        const newAuction = {
            ...auction,
            name: `Auction ${auctions.length + 1}`,
        };
        setAuctions([...auctions, newAuction]);
    };

    return (
        <AuctionContext.Provider value={{ auctions, addAuction }}>
            {children}
        </AuctionContext.Provider>
    );
}

export function useAuctionContext() {
    return useContext(AuctionContext);
}
