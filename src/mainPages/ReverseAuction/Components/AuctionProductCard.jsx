import { NavLink, useNavigate } from "react-router-dom";
import { useData } from "../../../index";
import { useState } from "react";
import { Button, Box, Grid } from "@mui/material";
import AuctionRegistrationForm from "./AuctionRegistrationForm";
import AuctionChatWindow from "./AuctionChatWindow";
import { useAuth } from "../../../context/AuthContext";

export default function AuctionProductCard({ item, inWishlist }) {
  const [openRegistration, setOpenRegistration] = useState(false);
  const [openChat, setOpenChat] = useState(false);
  const [hoveredImage, setHoveredImage] = useState(null);
  const { user } = useAuth();
  const userDetails = user || JSON.parse(localStorage.getItem("user"));
  const role = userDetails?.role; //

  // Use first image if available, fallback to placeholder
  const mainImage = Array.isArray(item.imageURLs) && item.imageURLs.length > 0 && item.imageURLs[0]?.url
    ? item.imageURLs[0].url
    : "no-image.jpg";

  // Get remaining images for the thumbnail list
  const thumbnailImages = Array.isArray(item.imageURLs) && item.imageURLs.length > 1
    ? item.imageURLs.slice(1)
    : [];

  // Handle mouse enter to show enlarged image
  const handleMouseEnter = (imageUrl, event) => {
    setHoveredImage({ url: imageUrl, x: event.clientX, y: event.clientY });
  };

  // Handle mouse leave to hide enlarged image
  const handleMouseLeave = () => {
    setHoveredImage(null);
  };

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

        {/* Thumbnail List */}
        {thumbnailImages.length > 0 && (
          <Box sx={{ mt: 1, overflowX: "auto", whiteSpace: "nowrap", pb: 1, position: "relative" }}>
            <Grid container spacing={1} sx={{ flexWrap: "nowrap" }}>
              {thumbnailImages.map((image, index) => (
                <Grid item key={index}>
                  <img
                    src={`http://localhost:8080/api/product/${image.url}`}
                    alt={`Thumbnail ${index + 1}`}
                    style={{
                      width: "60px",
                      height: "60px",
                      objectFit: "cover",
                      borderRadius: "4px",
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => handleMouseEnter(image.url, e)}
                    onMouseLeave={handleMouseLeave}
                    onError={(e) => {
                      e.target.src = "/no-image.jpg";
                    }}
                  />
                </Grid>
              ))}
            </Grid>
            {/* Enlarged Image Preview */}
            {hoveredImage && (
              <Box
                sx={{
                  position: "fixed",
                  top: hoveredImage.y + 10,
                  left: hoveredImage.x + 10,
                  zIndex: 1000,
                  boxShadow: "0 4px 8px rgba(0,0,0,0.2)",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <img
                  src={`http://localhost:8080/api/product/${hoveredImage.url}`}
                  alt="Enlarged preview"
                  style={{
                    width: "200px",
                    height: "200px",
                    objectFit: "cover",
                  }}
                  onError={(e) => {
                    e.target.src = "/no-image.jpg";
                  }}
                />
              </Box>
            )}
          </Box>
        )}

        <div className="cardTextContent">
          <h3>{item.name?.slice(0, 15) || "Sản phẩm"}</h3>
          {item.material && <p className="material">Vật liệu: {item.material}</p>}
          {item.size && <p className="size">Kích thước: {item.size}</p>}
          {item.occasion && <p className="occasion">Dịp: {item.occasion}</p>}
          {item.status === "Open-Auction" ? (
            <div>
              <p className="price">
                <b>Ngân sách: {item.auctionProductDTO?.budgetAuction?.toLocaleString() || 0} VNĐ</b>
              </p>
              <p className="quantity">
                <b>Số lượng: </b>
                {item?.auctionProductDTO?.quantity || "Không xác định"}
              </p>
              <p
                className="status"
                style={{
                  color: item.status === "Open-Auction" ? "#4caf50" : item.status === "CLOSED" ? "#f44336" : "#ff9800",
                }}
              >
                Trạng thái: {item.status === 'Open-Auction' ? 'Đang đấu giá' : "Không xác định"}
              </p>
            </div>
          ) : (
            <p className="price">
              <b>Giá: {item.price?.toLocaleString() || 0} VNĐ</b>
            </p>
          )}
        </div>
      {/* </NavLink> */}

      {/* Action Buttons */}
      <Box sx={{ display: "flex", gap: 1, mt: 2, justifyContent: "center" }}>
        {user?.role === "CTV" && (
          <Button
            style={{
              color: "#4caf50",
            }}
            variant="contained"
            color="primary"
            onClick={() => setOpenRegistration(true)}
            disabled={item.status !== "Open-Auction"}
          >
            Đăng ký đấu giá
          </Button>
        )}

        {/* Phải là chủ nhân của sản phẩm đấu giá thì mới xem được. */}
        {isAuthorOfAuction() && (
          <Button
            style={{
              color: "#4caf50",
            }}
            variant="outlined"
            onClick={() => setOpenChat(true)}
            disabled={item.status === "CLOSED"}
          >
            Xem phòng chờ
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