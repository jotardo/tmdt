import { NavLink, useNavigate } from "react-router-dom";
import { useData } from "../../../index";
import { useState } from "react";
import { Button, Box } from "@mui/material";
import AuctionRegistrationForm from "./AuctionRegistrationForm";
import AuctionChatWindow from "./AuctionChatWindow";

export default function AuctionProductCard({ item, inWishlist }) {
  const { getSingleProduct } = useData();
  const navigate = useNavigate();
  const [openRegistration, setOpenRegistration] = useState(false);
  const [openChat, setOpenChat] = useState(false);

  console.log("AuctionProductCard item:", item);
  // Destructure auction product fields
  const {
    id,
    name,
    price,
    imageURLs,
    material,
    size,
    occasion,
    status,
    productIsBadge,
    description,
  } = item;

  // Use first image if available, fallback to placeholder
  const mainImage = Array.isArray(imageURLs) && imageURLs.length > 0 && imageURLs[0]?.url
    ? imageURLs[0].url
    : "no-image.jpg";

  // Map status to display text
  const statusText = {
    OPEN: "Mở",
    IN_PROGRESS: "Đang xử lý",
    CLOSED: "Đã đóng",
  }[status] || "Không xác định";

  // Optional: Navigate to waiting rooms (uncomment to use instead of AuctionChatWindow)
  // const handleWaitingRooms = () => {
  //   navigate("/reverse-auction/waiting-rooms");
  // };

  return (
    <div className="ProductCard">
      {/* <NavLink to={`/reverse-auction/${id}`}> */}
        <img
          src={`http://localhost:8080/api/product/${mainImage}`}
          alt={name || "Sản phẩm đấu giá"}
          onError={(e) => {
            e.target.src = "/no-image.jpg";
          }}
        />
        <div className="cardTextContent">
          <h3>{name?.slice(0, 15) || "Sản phẩm"}</h3>
          {material && <p className="material">Vật liệu: {material}</p>}
          {size && <p className="size">Kích thước: {size}</p>}
          {occasion && <p className="occasion">Dịp: {occasion}</p>}
          <p className="price">
            <b>{price?.toLocaleString() || 0} VNĐ</b>
          </p>
          <p
            className="status"
            style={{
              color: status === "OPEN" ? "#4caf50" : status === "CLOSED" ? "#f44336" : "#ff9800",
            }}
          >
            Trạng thái: {statusText}
          </p>
        </div>
      {/* </NavLink> */}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenRegistration(true)}
          disabled={status !== "OPEN"}
        >
          Đăng ký đấu giá
        </Button>
        <Button
          variant="outlined"
          onClick={() => setOpenChat(true)} // Replace with handleWaitingRooms() if using navigation
          disabled={status === "CLOSED"}
        >
          Phòng chờ đấu giá
        </Button>
      </Box>

      {/* Registration Form Dialog */}
      <AuctionRegistrationForm
        open={openRegistration}
        onClose={() => setOpenRegistration(false)}
        productId={id}
      />

      {/* Chat Window Dialog */}
      <AuctionChatWindow
        open={openChat}
        onClose={() => setOpenChat(false)}
        item={item}
      />

      {/* Badge */}
      {productIsBadge && (
        <span title={productIsBadge} className="trendingIcon">
          <div className="ribbon ribbon-top-left">
            <span>{productIsBadge}</span>
          </div>
        </span>
      )}
    </div>
  );
}