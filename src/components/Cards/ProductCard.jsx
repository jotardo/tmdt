import { NavLink } from "react-router-dom";
import { useData, useWish, useCart } from "../../index";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';

export default function ProductCard({ item, inWishlist }) {
  const { deleteWishListData, addWishListData, isAvailableInWishList } = useWish();
  const { getSingleProduct } = useData();
  const { addToCardFunction, isItemInCart, changeQuantity } = useCart();
  const token = localStorage.getItem("jwtToken");

  const {
    id,
    name,
    price,
    prevPrice,
    imageURLs,
    productIsBadge,
    averageRating = 2, // mặc định 2 sao
  } = item;
  

  const discount = prevPrice ? Math.floor(100 - (price / prevPrice) * 100) : 0;
  const mainImage = imageURLs && imageURLs.length > 0 ? imageURLs[0].url : "no-image.jpg";

  return (
      <div className="ProductCard" key={id} onClick={() => getSingleProduct(id)}>
          <NavLink to={`/products/${id}`}>
              <img src={`http://localhost:8080/api/product/${mainImage}`} alt="Sản phẩm trang sức"/>

              <div className="cardTextContent">
                  <h3>{name.slice(0, 15)}</h3>
                  <p className="price">
                      {prevPrice && <span className="stikeThrough">{prevPrice} VNĐ</span>}
                      <b> {price} VNĐ </b>
                      {prevPrice && <span> (Giảm {discount}%)</span>}
                  </p>
                  <div className="rating">
                      {"★".repeat(Math.round(averageRating))}
                      {"☆".repeat(5 - Math.round(averageRating))}
                  </div>
              </div>
          </NavLink>

          {/* ❤️ Wishlist */}
          <span
              className="favorite"
              title="Thêm vào WishList"
              onClick={(e) => {
                  e.preventDefault();
                  token && isAvailableInWishList(id) >= 0
                      ? deleteWishListData(id)
                      : addWishListData(item);
              }}
          >
    {token && isAvailableInWishList(id) >= 0 ? (
        <FavoriteRoundedIcon/>
    ) : (
        <FavoriteTwoToneIcon/>
    )}
  </span>

          {/* 🎖️ Badge */}
          {productIsBadge?.length > 0 && (
              <span title={productIsBadge} className="trendingIcon">
      <div className="ribbon ribbon-top-left">
        <span>{productIsBadge}</span>
      </div>
    </span>
          )}

          {/* 🛒 Add to cart */}
          <div className="buttons">
              <div className="addToCartButton" title="Add to Cart">
                  {token && isItemInCart(id) ? (
                      <span className="moveToCart" style={{background: "#cb9fe3", borderRadius: "12px"}}>
          <NavLink to="/cart">
            <ShoppingCartCheckoutIcon/>
          </NavLink>
        </span>
                  ) : (
                      <AddShoppingCartIcon
                          onClick={(e) => {
                              e.preventDefault();
                              addToCardFunction(item, token);
                          }}
                      />
                  )}
              </div>
          </div>

          {/* ➕ Thêm nếu là wishlist */}
          {isItemInCart(id) && inWishlist && (
              <button
                  onClick={(e) => {
                      e.preventDefault();
                      changeQuantity(id, token, "increment");
                  }}
              >
                  Thêm 1 đơn vị của sản phẩm này
              </button>
          )}
      </div>

  );
}
