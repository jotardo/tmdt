import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useData, useWish, useCart } from "../../";
import Loader from "../../components/Loader";
import ProductImageContainer from "../../components/ProductImageContainer";
import ProductReviews from "../../components/ProductReviews";
import RelatedProducts from "./RelatedProducts";
import { Grid, Card, CardContent, Typography, Button, Box, Divider, Chip } from "@mui/material";
import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import FavoriteTwoToneIcon from "@mui/icons-material/FavoriteTwoTone";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";

export default function ProductDetails() {
  const { singleProduct } = useData();
  const { addToCartFunction, isItemInCart } = useCart();
  const { addWishListData, isAvailableInWishList, deleteWishListData } = useWish();
  const navigate = useNavigate();
  const token = localStorage.getItem("jwtToken");
  const currentUserId = token ? parseInt(localStorage.getItem("user")) : null;

  const todate = new Date().toString();
  const product = singleProduct?.product;

  useEffect(() => {
    console.log("Current details:", product);
  }, [product]);

  if (singleProduct.loading) return <Loader />;

  if (!product) {
    return (
      <Box sx={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography variant="h5" color="text.secondary">
          Xin lỗi, sản phẩm này không tồn tại
        </Typography>
      </Box>
    );
  }

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
    averageRating = 0,
    totalRating = 0,
  } = product;

  const discount = Math.floor(100 - (price / prevPrice) * 100);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Grid container spacing={4}>
        {/* Image and Buttons Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
            <ProductImageContainer
              image_urls={product.imageURLs.map((img) => ({
                ...img,
                url: `${process.env.REACT_APP_BASE_URL}/product/${img.url}`,
              }))}
              mainImageSize={{ width: 400, height: 400 }} // Fixed size for main image
            />
            <CardContent>
              <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
                <Button
                  variant="contained"
                  color="secondary"
                  startIcon={<ShoppingCartIcon />}
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 2 }}
                  onClick={() => {
                    token && isItemInCart(id) ? navigate("/cart") : addToCartFunction(product, token);
                  }}
                >
                  {token && isItemInCart(id) ? "Đi đến giỏ" : "Thêm vào giỏ"}
                </Button>
                <Button
                  variant="outlined"
                  color="secondary"
                  startIcon={token && isAvailableInWishList(id) >= 0 ? <FavoriteRoundedIcon /> : <FavoriteTwoToneIcon />}
                  fullWidth
                  sx={{ py: 1.5, borderRadius: 2 }}
                  onClick={() => {
                    if (token && isAvailableInWishList(id) >= 0) deleteWishListData(id);
                    else addWishListData(product);
                  }}
                >
                  {token && isAvailableInWishList(id) >= 0 ? "Xóa Wishlist" : "Thêm Wishlist"}
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Product Details Section */}
        <Grid item xs={12} md={6}>
          <Card sx={{ boxShadow: 3, borderRadius: 2, p: 3 }}>
            <CardContent>
              <Typography variant="h4" gutterBottom>
                {name}
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                {categoryName} từ {brand}
              </Typography>
              <Chip label="Mua 2 giảm 5%" color="success" sx={{ mb: 2 }} />
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                <Typography variant="h5" color="primary">
                  {price.toLocaleString()} VNĐ
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                  {prevPrice.toLocaleString()} VNĐ
                </Typography>
                <Typography variant="body2" color="error">
                  (Giảm {discount}%)
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Giao hàng ngày {todate.slice(0, 15)}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom>
                Đặc điểm nổi bật
              </Typography>
              <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                <li>
                  <Typography variant="body2">Loại đá: {productMaterial}</Typography>
                </li>
                <li>
                  <Typography variant="body2">Dịp lễ: {occasion}</Typography>
                </li>
                <li>
                  <Typography variant="body2">
                    Điểm đánh giá: {averageRating.toFixed(1)} ⭐ ({totalRating} đánh giá)
                  </Typography>
                </li>
              </Box>

              <Typography variant="h6" gutterBottom>
                Mô tả
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {description}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Divider sx={{ my: 4 }} />

      {/* Product Reviews */}
      <ProductReviews productId={id} currentUserId={currentUserId} navigate={navigate} />

      {/* Related Products */}
      <RelatedProducts categoryName={categoryName} />
    </Box>
  );
}