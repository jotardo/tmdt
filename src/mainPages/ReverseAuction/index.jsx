import React from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import "./reverseAuction.css";

export default function ReverseAuctionHome() {
    return (
        <div className="auction-container">
            <h2>
                <Link to="/reverse-auction" style={{ textDecoration: 'none', color: 'inherit' }}>
                    Reverse Auctions
                </Link>
            </h2>

            <nav className="auction-nav">
                <NavLink
                    to="/reverse-auction/my"
                    className={({ isActive }) => isActive ? "active-link" : undefined}
                >
                    My Auction
                </NavLink>
                <NavLink
                    to="/reverse-auction/create"
                    className={({ isActive }) => isActive ? "active-link" : undefined}
                >
                    Create Auction
                </NavLink>
            </nav>

            <section className="auction-content">
                <Outlet />
            </section>
        </div>
    );
}
