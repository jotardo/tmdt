import "./productDetails.css";
import { useNavigate } from "react-router-dom";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";

import { useData, useWish, useCart } from "../../";
import Loader from "../../components/Loader";
import ProductImageContainer from "../../components/ProductImageContainer";
import { useEffect } from "react";

export default function ProductDetails() {
  const { singleProduct } = useData();
  const { addToCardFunction, isItemInCart } = useCart();
  const token = localStorage.getItem("jwtToken");
  const todate = new Date().toString();
  const { addWishListData, isAvailableInWishList, deleteWishListData } =
    useWish();
  const navigate = useNavigate();

  const product = singleProduct?.product;

    useEffect(()=> {
      console.log("Current details:", product)
    })

  if (product) {
    const {
      id,
      brand,
      categoryName,
      // product_color,
      description,

      imageURLs,
      productMaterial,
      name,
      occasion,
      prevPrice,
      price,
      product_rating,
      product_reviews,

    } = product;

    const discount = Math.floor(
      100 - (price / prevPrice) * 100
    );

    if (singleProduct.loading)
      return <Loader />
    return (
      <div className="productDetailsContainer" key={id}>
        <div className="detailsContainer">
          <div className="imgcontainer">
            <ProductImageContainer image_urls={imageURLs.map(img => {
              return {...img, url: `http://localhost:8080/api/product/${img.url}`}
            }) } />

            <div className="buttons">
              <button
                onClick={() => {
                  token && isItemInCart(id)
                    ? navigate("/cart")
                    : addToCardFunction(product, token);
                }}
              >
                {token && isItemInCart(id) ? "Đi đến giỏ" : "Thêm vào giỏ"}
              </button>
              <button
                onClick={() => {
                  if (token && isAvailableInWishList(id) >= 0) deleteWishListData(id);
                  else addWishListData(product);
                }}
              >
                {token && isAvailableInWishList(id) >= 0 ? (
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
            <h2>{name}</h2>
            <small>{categoryName} từ </small>
            {brand}

            <div className="offer">Mua 2 giảm 5%</div>
            <div className="price">
               {price}{" "} VND
              <span className="stikeThrough">{prevPrice} VNĐ</span>
              <span className="discount">(Giảm {discount}%)</span>
            </div>
            <div className="deliveryDate">
              Giao hàng ngày {todate.slice(0, 15)}
            </div>

            <div className="highlights">
              <div>
                <p class="head">Đặc điểm nổi bật</p>
                <ul>
                  {/* <li>Màu: {product_color}</li> */}
                  <li>Loại đá : {productMaterial}</li>
                  <li>Dịp lễ : {occasion}</li>
                  <li>Điểm đánh giá : {product_rating} ⭐</li>
                  <li>Tổng số đánh giá : {product_reviews}</li>
                </ul>
              </div>

              <div className="description">
                <p class="head">Mô tả</p>
                <p>{description}</p>
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
