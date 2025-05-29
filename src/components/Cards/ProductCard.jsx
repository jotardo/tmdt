import { NavLink } from "react-router-dom";
import { useData, useWish, useCart } from "../../index";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ShoppingCartCheckoutIcon from "@mui/icons-material/ShoppingCartCheckout";
import FavoriteTwoToneIcon from '@mui/icons-material/FavoriteTwoTone';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded';
import {useMemo} from "react";

export default function ProductCard({ item, inWishlist }) {
    const token = useMemo(() => localStorage.getItem("jwtToken"), []);
    const { deleteWishListData, addWishListData, isAvailableInWishList } = useWish();
    const { getSingleProduct } = useData();
    const { addToCartFunction, isItemInCart, changeQuantity } = useCart();
    const { id, name, price, prevPrice, imageURLs, productIsBadge, averageRating = 0, brand, occasion } = item;

    const isInWishList = useMemo(() => {
        return isAvailableInWishList(id);
    }, [isAvailableInWishList, id]);

    const discount = prevPrice ? Math.floor(100 - (price / prevPrice) * 100) : 0;
    const mainImage = imageURLs && imageURLs.length > 0 ? imageURLs[0].url : "no-image.jpg";

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        if (!token) return;

        isInWishList ? deleteWishListData(id) : addWishListData(item);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!token) return;

        addToCartFunction(item, token);
    };

    const handleIncrementQuantity = (e) => {
        e.preventDefault();
        if (!token) return;

        changeQuantity(id, token, "increment");
    };

    return (
        <div className="ProductCard" onClick={() => getSingleProduct(id)}>
            <NavLink to={`/products/${id}`}>
                <img src={`http://localhost:8080/api/product/${mainImage}`} alt="Sản phẩm trang sức"/>
                <div className="cardTextContent">
                    <h3>{name?.slice(0, 15) || "Sản phẩm"}</h3>
                    {brand && <p className="brand">Thương hiệu: {brand}</p>}
                    {occasion && <p className="occasion">Dịp: {occasion}</p>}
                    <p className="price">
                        {prevPrice && <span className="stikeThrough">{prevPrice.toLocaleString()} VNĐ</span>}
                        <b>{price?.toLocaleString() || 0} VNĐ</b>
                        {prevPrice && <span> (Giảm {discount}%)</span>}
                    </p>
                    <div className="rating" title={`${averageRating} sao`}>
                        {"★".repeat(Math.round(averageRating))}
                        {"☆".repeat(5 - Math.round(averageRating))}
                    </div>
                </div>
            </NavLink>

            {/* ❤️ Wishlist */}
            <span className="favorite" title="Thêm vào Wishlist" onClick={handleWishlistToggle}>
                {token && isInWishList ? <FavoriteRoundedIcon /> : <FavoriteTwoToneIcon />}
            </span>

            {/* 🎖️ Badge */}
            {productIsBadge && (
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
                        <span className="moveToCart" style={{ background: "#cb9fe3", borderRadius: "12px" }}>
                            <NavLink to="/cart">
                                <ShoppingCartCheckoutIcon />
                            </NavLink>
                        </span>
                    ) : (
                        <AddShoppingCartIcon onClick={handleAddToCart} />
                    )}
                </div>
            </div>

            {/* ➕ Tăng số lượng nếu là wishlist */}
            {isItemInCart(id) && inWishlist && (
                <button onClick={handleIncrementQuantity}>Thêm 1 đơn vị của sản phẩm này</button>
            )}
        </div>
    );
}
