import { NavLink, useNavigate } from "react-router-dom";
import { useData } from "../../../index";
import { useState } from "react";
import { Button, Box } from "@mui/material";
import AuctionRegistrationForm from "./AuctionRegistrationForm";
import AuctionChatWindow from "./AuctionChatWindow";
import { useAuth } from "../../../context/AuthContext";

export default function AuctionProductCard({ item, inWishlist }) {
  // const { getSingleProduct } = useData();
  // const navigate = useNavigate();
  const [openRegistration, setOpenRegistration] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const { user } = useAuth();
  const userDetails = user || JSON.parse(localStorage.getItem("user"));
  const role = userDetails?.role; //

  console.log("Item in AuctionProductCard:", item);

  // Use first image if available, fallback to placeholder
  const mainImage = Array.isArray(item.imageURLs) && item.imageURLs.length > 0 && item.imageURLs[0]?.url
    ? item.imageURLs[0].url
    : "no-image.jpg";

  // Optional: Navigate to waiting rooms (uncomment to use instead of AuctionChatWindow)
  // const handleWaitingRooms = () => {
  //   navigate("/reverse-auction/waiting-rooms");
  // };

  const isAuthorOfAuction = () => {
    return user?.id && item?.auctionProductDTO?.author_id === user.id;
  };

  return (
    <div className="ProductCard">
      {/* <NavLink to={`/reverse-auction/${id}`}> */}
        <img
          src={`http://localhost:8080/api/product/${mainImage}`}
          alt={item.name || "Sản phẩm đấu giá"}
          onError={(e) => {
            e.target.src = "/no-image.jpg";
          }}
        />
        <div className="cardTextContent">
          <h3>{item.name?.slice(0, 15) || "Sản phẩm"}</h3>
          {item.material && <p className="material">Vật liệu: {item.material}</p>}
          {item.size && <p className="size">Kích thước: {item.size}</p>}
          {item.occasion && <p className="occasion">Dịp: {item.occasion}</p>}
          <p className="price">
            <b>{item.price?.toLocaleString() || 0} VNĐ</b>
          </p>
          <p className="quantity">
            <b>Số lượng: </b>
            {item?.auctionProductDTO?.quantity || "Không xác định"}
          </p>
          <p
            className="status"
            style={{
              color: item.status === "OPEN" ? "#4caf50" : item.status === "CLOSED" ? "#f44336" : "#ff9800",
            }}
          >
            Trạng thái: {item.status === 'Open-Auction' ? 'Đang đấu giá' : "Không xác định"}
          </p>
        </div>
      {/* </NavLink> */}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "center" }}>
        {user?.role === "CTV" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setOpenRegistration(true)}
            disabled={item.status !== "Open-Auction"}
          >
            Đăng ký đấu giá
          </Button>
        )}
        {isAuthorOfAuction() && (
          <Button
            variant="outlined"
            onClick={() => setOpenChat(true)}
            disabled={item.status === "CLOSED"}
          >
            Phòng chờ đấu giá
          </Button>
        )}
      </Box>

      {/* Registration Form Dialog */}
      <AuctionRegistrationForm
        open={openRegistration}
        onClose={() => setOpenRegistration(false)}
        productId={item.id}
      />

      {/* Chat Window Dialog */}
      <AuctionChatWindow
        open={openChat}
        onClose={() => setOpenChat(false)}
        item={item}
      />

      {/* Badge */}
      {item.status === "Open-Auction" && (
        <span title={item.status} className="trendingIcon">
          <div className="ribbon ribbon-top-left">
            <span>Đấu giá</span>
          </div>
        </span>
      )}
    </div>
  );
}