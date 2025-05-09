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

            <div className="auction-nav">
                <NavLink to="/reverse-auction/my">My Auction</NavLink>
                <NavLink to="/reverse-auction/create">Create Auction</NavLink>
            </div>

            <div className="auction-content">
                <Outlet />
            </div>

            {/*<div className="auction-orders">*/}
            {/*    <h3>Đơn hàng chưa được chọn</h3>*/}
            {/*    <ul className="order-list">*/}
            {/*        /!* Giả lập danh sách đơn hàng *!/*/}
            {/*        <li className="order-item">*/}
            {/*            <strong>Khách hàng:</strong> Nguyễn Văn A<br />*/}
            {/*            <strong>Mô tả:</strong> Thiết kế vòng cổ vàng 18K độc đáo<br />*/}
            {/*            <strong>Ngày tạo:</strong> 03/05/2025*/}
            {/*        </li>*/}
            {/*        <li className="order-item">*/}
            {/*            <strong>Khách hàng:</strong> Trần Thị B<br />*/}
            {/*            <strong>Mô tả:</strong> Nhẫn cưới đơn giản cho cặp đôi<br />*/}
            {/*            <strong>Ngày tạo:</strong> 01/05/2025*/}
            {/*        </li>*/}
            {/*    </ul>*/}
            {/*</div>*/}
        </div>
    );
}
