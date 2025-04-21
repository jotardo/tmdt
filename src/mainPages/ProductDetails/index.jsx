import "./productDetails.css";
import { useNavigate } from "react-router-dom";
import InnerImageZoom from "react-inner-image-zoom";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";

import { useData, useWish, useCart, useAuth } from "../../";
import Loader from "../../components/Loader";

export default function ProductDetails() {
  const { singleProduct } = useData();
  const { addToCardFunction, isItemInCart } = useCart();
  const { token } = useAuth();
  const todate = new Date().toString();
  const { addWishListData, isAvailableInWishList, deleteWishListData } =
    useWish();
  const navigate = useNavigate();

  const product = singleProduct?.product;

  if (product) {
    const {
      _id,
      product_brand,
      product_category,
      product_color,
      product_description,

      product_image,
      product_material,
      product_name,
      product_occasion,
      product_prevPrice,
      product_price,
      product_rating,
      product_reviews,

    } = product;

    const discount = Math.floor(
      100 - (product_price / product_prevPrice) * 100
    );

    if (singleProduct.loading)
      return <Loader />
    return (

      <div className="productDetailsContainer" key={_id}>
        <div className="detailsContainer">
          <div className="imgcontainer">
            <InnerImageZoom src={product_image} zoomSrc={product_image} />

            <div className="buttons">
              <button
                onClick={() => {
                  token && isItemInCart(_id)
                    ? navigate("/cart")
                    : addToCardFunction(product, token);
                }}
              >
                {token && isItemInCart(_id) ? "Đi đến giỏ" : "Thêm vào giỏ"}
              </button>
              <button
                onClick={() => {
                  if (token && isAvailableInWishList(_id) >= 0) deleteWishListData(_id);
                  else addWishListData(product);
                }}
              >
                {token && isAvailableInWishList(_id) >= 0 ? (
                  <span class="removeWish">
                    Xóa Wishlist <FavoriteRoundedIcon />{" "}
                  </span>
                ) : (
                  <span class="removeWish">
                    Thêm Wishlist <FavoriteTwoToneIcon />{" "}
                  </span>
                )}
              </button>
            </div>
          </div>
          <div className="textContentContainer">
            <h2>{product_name}</h2>
            <small>{product_category} từ </small>
            {product_brand}

            <div className="offer">Mua 2 giảm 5%</div>
            <div className="price">
               {product_price}{" "} VND
              <span className="stikeThrough">{product_prevPrice} VNĐ</span>
              <span className="discount">(Giảm {discount}%)</span>
            </div>
            <div className="deliveryDate">
              Giao hàng ngày {todate.slice(0, 15)}
            </div>

            <div className="highlights">
              <div>
                <p class="head">Đặc điểm nổi bật</p>
                <ul>
                  <li>Màu: {product_color}</li>
                  <li>Loại đá : {product_material}</li>
                  <li>Dịp lễ : {product_occasion}</li>
                  <li>Điểm đánh giá : {product_rating} ⭐</li>
                  <li>Tổng số đánh giá : {product_reviews}</li>
                </ul>
              </div>

              <div className="description">
                <p class="head">Mô tả</p>
                <p>{product_description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else
    return (
      <h2 style={{ height: "80vh", marginTop: "100px" }}>
        Xin lỗi, sản phẩm này không tồn tại
      </h2>
    );
}
