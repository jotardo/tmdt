import { NavLink } from "react-router-dom";
import { useData, useWish, useCart } from "../../../index";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useMemo } from "react";
import { toast } from "react-toastify";

export default function AuctionProductCard({ item, inWishlist }) {
  const { getSingleProduct } = useData();

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

  return (
    <div className="ProductCard" onClick={() => getSingleProduct(id)}>
      <NavLink to={`/reverse-auction/${id}`}>
        <img 
          src={`http://localhost:8080/api/product/${mainImage}`} 
          alt={name || "Sản phẩm đấu giá"} 
          onError={(e) => { e.target.src = "/no-image.jpg"; }} // Fallback on image load error
        />
        <div className="cardTextContent">
          <h3>{name?.slice(0, 15) || "Sản phẩm"}</h3>
          {material && <p className="material">Vật liệu: {material}</p>}
          {size && <p className="size">Kích thước: {size}</p>}
          {occasion && <p className="occasion">Dịp: {occasion}</p>}
          <p className="price">
            <b>{price?.toLocaleString() || 0} VNĐ</b>
          </p>
          <p className="status" style={{ color: status === "OPEN" ? "#4caf50" : status === "CLOSED" ? "#f44336" : "#ff9800" }}>
            Trạng thái: {statusText}
          </p>
        </div>
      </NavLink>

      {/* 🎖️ Badge */}
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