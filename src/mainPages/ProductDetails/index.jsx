import "./productDetails.css";
import {useNavigate, useParams} from "react-router-dom";
import InnerImageZoom from "react-inner-image-zoom";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";

import { useData, useWish, useCart } from "../../";
import Loader from "../../components/Loader";
import { useEffect } from "react";
import ProductReviews from "../../components/ProductReviews";

export default function ProductDetails() {
  const { id } = useParams();
  const { singleProduct, getSingleProduct } = useData();
  const { addToCardFunction, isItemInCart } = useCart();
  const token = localStorage.getItem("jwtToken");
  const currentUserId = token ? parseInt(localStorage.getItem("user")) : null;

  const todate = new Date().toString();
  const { addWishListData, isAvailableInWishList, deleteWishListData } =
      useWish();
  const navigate = useNavigate();

  const product = singleProduct?.product;

  useEffect(() => {
    if (!singleProduct.product)
      getSingleProduct()
  }, [id])

  if (product) {
    const {
      id,
      brand,
      categoryName,
      description,
      imageURLs,
      productMaterial,
      name,
      occasion,
      prevPrice,
      price,
      averageRating=0,
      totalRating=0,

    } = product;
    const mainImage = imageURLs && imageURLs.length > 0 ? imageURLs[0].url : "/no-image.jpg";

    const discount = Math.floor(
        100 - (price / prevPrice) * 100
    );
    console.log("userid", currentUserId )
    if (singleProduct.loading)
      return <Loader />
    return (
        <div className="productDetailsContainer" key={id}>
          <div className="detailsContainer">
            <div className="imgcontainer">
              <InnerImageZoom src={mainImage} zoomSrc={mainImage}/>

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
                    Xóa Wishlist <FavoriteRoundedIcon/>{" "}
                  </span>
                  ) : (
                      <span class="removeWish">
                    Thêm Wishlist <FavoriteTwoToneIcon/>{" "}
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
                    <li>Loại đá : {productMaterial}</li>
                    <li>Dịp lễ : {occasion}</li>
                    <li>Điểm đánh giá : {averageRating.toFixed(1)} ⭐ ({totalRating} đánh giá)</li>
                  </ul>
                </div>

                <div className="description">
                  <p className="head">Mô tả</p>
                  <p>{description}</p>
                </div>
              </div>
            </div>
          </div>
          <hr className="divider"/>

              <ProductReviews productId={id} currentUserId={currentUserId} navigate={navigate}/>

        </div>
    );
  } else
    return (
        <h2 style={{height: "80vh", marginTop: "100px"}}>
          Xin lỗi, sản phẩm này không tồn tại
        </h2>
    );
}
