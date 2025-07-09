import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";

import { useCart, useData, useWish } from "../../../";
import { NavLink, useNavigate } from "react-router-dom";
import EmptyCart from "../../../components/EmptyCart";

export default function ShoppingCart() {
  const navigate = useNavigate();
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
  const { isAvailableInWishList, addWishListData, deleteWishListData } = useWish();

  if (!token) {
    return <h2>Bạn cần Đăng nhập để nhìn thấy sản phẩm</h2>;
  }

  if (!cartManager?.cartData?.length) {
    return <EmptyCart />;
  }

  console.log("Cart data:", cartManager.cartData);

  const calculateSubTotal = () => {
    if (!cartManager.cartData || !Array.isArray(cartManager.cartData)) return 0;
    return cartManager.cartData.reduce((total, item) => {
      return total + item.price * item.quantity;
    }, 0);
  };

  // Tính toán tổng giá trị giảm giá
  const calculateDiscount = () => {
    if (!cartManager.cartData || !Array.isArray(cartManager.cartData)) return 0;
    return cartManager.cartData.reduce((total, item) => {
      const discountValue = (item.discount / 100) * (item.price * item.quantity);
      return total + discountValue;
    }, 0);
  };

  // Tính tổng tiền sau giảm giá
  const calculateTotal = () => {
    return calculateSubTotal() - calculateDiscount();
  };

  // Format tiền tệ VNĐ
  const formatPrice = (price) => {
    return price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };

  // Lấy tổng phần trăm giảm giá trung bình (nếu cần hiển thị %)
  const totalDiscountPercent = () => {
    if (!cartManager.cartData || !Array.isArray(cartManager.cartData)) return 0;
    const totalItems = cartManager.cartData.reduce((sum, item) => sum + item.quantity, 0);
    if (totalItems === 0) return 0;
    const totalDiscount = cartManager.cartData.reduce((sum, item) => {
      return sum + item.discount * item.quantity;
    }, 0);
    return (totalDiscount / totalItems).toFixed(2);
  };

  return (
      <div className="shoppingCart">
        <table className="cartData">
          <thead>
          <tr>
            <th className="product-thumbnail">Ảnh</th>
            <th className="product-name">Sản phẩm</th>
            <th className="product-price">Đơn giá</th>
            <th className="product-quantity">Số lượng</th>
            <th className="product-subtotal">Thành tiền</th>
            <th className="product-wishlist">Wishlist</th>
            <th className="product-remove">Xóa</th>
          </tr>
          </thead>
          <tbody>
          {cartManager.cartData.map((item) => {
            const {
              id,
              productId,
              imageDTOS,
              nameProduct,
              quantity,
              price,
            } = item;

            // const shortName = nameProduct.slice(0, 14);

            return (
                <tr className="cartItem" key={id}>
                  <td className="product-thumbnail">
                    <NavLink to={`/products/${productId}`}>
                      <div onClick={() => getSingleProduct(productId)}>
                        <img
                            src={`http://localhost:8080/api/product/${imageDTOS[0].url}`}
                            width="70px"
                            alt={nameProduct}
                        />

                      </div>
                    </NavLink>
                  </td>

                  <td className="product-name">{nameProduct}...</td>

                  <td className="product-price">{price} VNĐ</td>

                  <td className="product-quantity">
                    <div className="counter">
                    <span
                        style={{ color: quantity < 2 ? "#d1d1d1" : "" }}
                        onClick={() => {
                          if (quantity > 1) changeQuantity(id, token, "decrement");
                        }}
                    >
                      <RemoveCircleOutlineIcon />
                    </span>
                      <span className="displayQty">{quantity}</span>
                      <span
                          onClick={() => {
                            changeQuantity(id, token, "increment");
                          }}
                      >
                      <AddCircleOutlineIcon />
                    </span>
                    </div>
                  </td>

                  <td className="product-subtotal">
                    <b>{Math.floor(price * quantity)} VNĐ</b>
                  </td>

                  <td className="product-wishlist">
                    <div onClick={() => getSingleProduct(productId)}>
                      {isAvailableInWishList(productId) ? (
                          <span
                              className="addedtofav"
                              onClick={() => deleteWishListData(productId)}
                          >
                        <FavoriteRoundedIcon />
                      </span>
                      ) : (
                          <span
                              className="addtofav"
                              onClick={() => addWishListData(item)}
                          >
                        <FavoriteBorderIcon />
                      </span>
                      )}
                    </div>
                  </td>

                  <td
                      className="product-remove"
                      onClick={() => deleteFromCartFunction(id, nameProduct, token, true)}
                  >
                    <HighlightOffIcon />
                  </td>
                </tr>
            );
          })}
          </tbody>
        </table>

        <table className="cartTotal">
          <thead>
            <tr>
              <th colSpan="2">Tổng tiền trong giỏ</th>
            </tr>
          </thead>
          <tbody>
            <tr className="subTotal">
              <td className="dataTitle">Thành tiền</td>
              <td className="Sprice">{formatPrice(calculateSubTotal())}</td>
            </tr>
            <tr className="discount">
              <td className="disc">Khuyến mãi</td>
              <td>{totalDiscountPercent()}%</td>
            </tr>
            <tr className="Tprice">
              <td>Tổng tiền</td>
              <td className="TotalPrice">{formatPrice(calculateTotal())}</td>
            </tr>
            <tr>
              <td colSpan="2" style={{ textAlign: 'center' }}>
                <button onClick={() => navigate('/cart/checkout')}>
                  Đi đến Thanh toán
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
  );
}
