import {toast } from 'react-toastify'

import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

import { useCart, useData, useWish } from "../../../";
import { NavLink, useNavigate } from "react-router-dom";
import EmptyCart from "../../../components/EmptyCart";

export default function ShoppingCart() {
  const navigate= useNavigate()
  const { getSingleProduct } = useData();
  const {
    cartManager,
    changeQuantity,
    deleteFromCartFunction,
    totalPrice,
    totalPrevPrice,
    totalDiscount,
  } = useCart();
  const token = localStorage.getItem("jwtToken");
  const { isAvailableInWishList, addWishListData, deleteWishListData } =
    useWish();

  return (
    cartManager?.cartData.length>0?
    <div className="shoppingCart">
      <table className="cartData">
        <thead>
          <tr>
            
            <th class="product-thumbnail ">Ảnh</th>
            <th class="product-name">Sản phẩm</th>
            <th class="product-price">Đơn giá</th>
            <th class="product-quantity">Số lượng</th>
            <th class="product-subtotal">Thành tiền</th>
            <th className="Add to Favoite">Wishlist</th>
            <th class="product-remove">Xóa</th>
          </tr>
        </thead>
        <tbody>
          {token ? (
            cartManager?.loading ? (
              <h4>loading cart data...</h4>
            ) : (
              cartManager?.cartData.map((item) => {
                const { _id, product_image, product_name, product_price, qty } =
                  item;
              
                const shortName = product_name.slice(0, 14);

                return (
                  <tr className="cartItem" key={_id}>
                   
                    <td class="product-thumbnail" data-cell="">
                      <NavLink to={`/products/${_id}`}>
                        <div
                          onClick={() => {
                            getSingleProduct(_id);
                          }}
                        >
                          <img src={product_image} width="70px" alt="" />
                        </div>
                      </NavLink>
                    </td>

                    <td class="product-name" data-cell="Product ">
                      {shortName}...
                    </td>

                    <td class="product-price" data-cell="Price  ">
                      {product_price} VNĐ
                    </td>

                    <td class="product-quantity" data-cell="Quantity :">
                      <div className="counter">
                        <span
                          style={{ color: qty < 2 ? "#d1d1d1" : "" }}
                          onClick={() => {
                            if (qty > 1)
                              changeQuantity(_id, token, "decrement");
                          }}
                        >
                          <RemoveCircleOutlineIcon />
                        </span>
                        <span className="displayQty">{qty}</span>
                        <span
                          onClick={() => {
                            changeQuantity(_id, token, "increment");
                          }}
                        >
                          <AddCircleOutlineIcon />
                        </span>
                      </div>
                    </td>

                    <td class="product-subtotal" data-cell="Subtotal :">
                      <span>
                        <b>{Math.floor(product_price * qty)} VNĐ</b>
                      </span>
                    </td>
                    <td class="product-add-to-fav" data-cell="Add to wishList">
                      <div
                        onClick={() => {
                          getSingleProduct(_id);
                        }}
                      >
                        {isAvailableInWishList(_id) > -1 ? (
                          <span
                            className="addedtofav"
                            onClick={() => {
                              deleteWishListData(_id);
                            }}
                          >
                            <FavoriteRoundedIcon />
                          </span>
                        ) : (
                          <span
                            className="addtofav"
                            onClick={() => {
                              addWishListData(item);
                            }}
                          >
                            <FavoriteBorderIcon />
                          </span>
                        )}
                      </div>
                    </td>
                    <td
                      class="product-remove"
                      onClick={() => {
                        deleteFromCartFunction(_id, product_name, token);
                      }}
                    >
                      <HighlightOffIcon />
                    </td>
                  </tr>
                );
              })
            )
          ) : (
            <h2>Bạn cần Đăng nhập để nhìn thấy sản phẩm</h2>
          )}
        </tbody>
      </table>

      <table className="cartTotal">
        <thead>
          <th>Tổng tiền trong giỏ</th>
        </thead>
        <tbody>
          <tr className="subTotal">
            <span className="dataTitle">Thành tiền</span>
            <span className="Sprice">{totalPrevPrice} VNĐ</span>
          </tr>
          <tr className="discount">
            <span className="disc">Khuyến mãi :</span> {totalDiscount}%
          </tr>
          <tr className="Tprice">
            {" "}
            <span>Tổng tiền</span>
            <span className="TotalPrice">{totalPrice} VNĐ</span>
          </tr>
          {/* <div onClick={()=>{toast.info("Xin lỗi, coupon chưa áp dụng được")}} className="applyCoupon">Áp dụng Coupon</div> */}
          <button onClick={()=>{navigate("/cart/checkout")}}>Đi đến Thanh toán</button>
        </tbody>
      </table>
    </div>
    :
    <EmptyCart/>
  );
}
