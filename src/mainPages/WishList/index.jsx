import "./wishList.css";
import { NavLink } from "react-router-dom";
import { useWish } from "../..";

import ProductCard from "../../components/Cards/ProductCard";
export default function WishList() {
  const { wishList } = useWish();
  return (
    <div className="wishLish">
      <h3>Wishlist của bạn</h3>

      {wishList?.backendWishList.length === 0 ? (
        <p className="empty_Wishlist ">
          <img src="\assets\empty-wishlist.png" alt="" width={300} />
          <p>Wishlist đang trống...{" "}</p>
          <NavLink to="/shop">
            <button>Đi đến Cửa hàng</button>
          </NavLink>
        </p>
      ) : (
        <div className="productsContainer">
          {wishList?.backendWishList.map((item) => (
            <ProductCard item={item} inWishlist={true} />
          ))}
        </div>
      )}
    </div>
  );
}
