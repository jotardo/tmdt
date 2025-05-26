import { NavLink } from "react-router-dom";

import { useData, useWish, useCart } from "..";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import { useEffect } from "react";

export default function ProductCard({ item, inWishlist }) {
  const { deleteWishListData, addWishListData ,isAvailableInWishList} = useWish();
  const { getSingleProduct } = useData();
  const { addToCartFunction, isItemInCart,changeQuantity } = useCart();
  const token = localStorage.getItem("jwtToken")
  const {
    id,
    name,
    price,
    prevPrice,
    product_image,
    productIsBadge,
    
    
  } = item;
  const discount = Math.floor(
    100 - (price / prevPrice) * 100
  );
  useEffect(()=>{
    alert(JSON.stringify(item))
  }, [])
  return (
    <div className="ProductCard" key={id}>
      <NavLink to={`/products/${id}`}>
        <div
          onClick={() => {
            getSingleProduct(id);
          }}
        >
          <img src={product_image} alt="exclusive jewelry by Shringaar" />
          <div className="cardTextContent">
            <h3>{name.slice(0, 15)}</h3>
            <p className="price">
              {prevPrice && (
                <span className="stikeThrough">{prevPrice} VNĐ</span>
              )}
              <b> {price} VNĐ </b> (Giảm {discount} %)
            </p>
            
          </div>
          <span className="favorite" title= "Thêm vào WishList" onClick={(e)=>{e.preventDefault();
          token && isAvailableInWishList(id)>=0 ?deleteWishListData(id):addWishListData(item)
          }}>
           {
           token&&isAvailableInWishList(id)>=0 ?<FavoriteRoundedIcon/>:
            <FavoriteTwoToneIcon/>
          
            
}
          </span>
          <span title={productIsBadge} className="trendingIcon">
            {productIsBadge.length > 0 ? (
              <div className="ribbon ribbon-top-left">
                <span>{productIsBadge}</span>
              </div>
            ) : null}

          </span>
      
       

          <div className="buttons">
            <div className="addToCartButton" title= "Add to Cart">
              {token && isItemInCart(id) ? (
                <span
                  title="Thêm vào giỏ"
                  className="moveToCart"
                  style={{ background: "#cb9fe3", borderRadius: "12px" }}
                >
                  <NavLink to="/cart">
                    <ShoppingCartCheckoutIcon />
                  </NavLink>
                </span>
              ) : (
                <AddShoppingCartIcon
                  onClick={(e) => {
                    e.preventDefault();
                    addToCartFunction(item, token);
                  }}
                />
              )}
            </div>

            
        </div>
        {isItemInCart(id)&& inWishlist ? (
              <button
                onClick={(e) => {
                  e.preventDefault();
                  changeQuantity(id, token, "increment");
                }}
              >
                Thêm 1 đơn vị của sản phẩm này
              </button>
            ) : null}
          </div>
      </NavLink>
    </div>
  );
}
