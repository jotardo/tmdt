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
    const {
        id,
        name,
        price,
        prevPrice,
        imageURLs,
        averageRating = 2,
        productIsBadge,
        brand,
        occasion
    } = item || {};

    const isInWishList = useMemo(() => {
        return isAvailableInWishList(item.id);
    }, [isAvailableInWishList, item.id]);

    const discount = prevPrice ? Math.floor(100 - (price / prevPrice) * 100) : 0;
    const mainImage = item.imageURLs && item.imageURLs.length > 0 ? item.imageURLs[0].url : "no-image.jpg";
    
    const handleWishlistToggle = (e) => {
        e.preventDefault();
        if (!token) return;

        isInWishList ? deleteWishListData(item.id) : addWishListData(item);
    };

    const handleAddToCart = (e) => {
        e.preventDefault();
        if (!token) return;

        addToCartFunction(item, token);
    };

    const handleIncrementQuantity = (e) => {
        e.preventDefault();
        if (!token) return;

        changeQuantity(item.id, token, "increment");
    };

    return (
        <div className="ProductCard" onClick={() => getSingleProduct(item.id)}>
            <NavLink to={`/products/${item.id}`}>
                <img src={`${process.env.REACT_APP_BASE_URL}/product/${mainImage}`} alt="Sản phẩm trang sức"/>
                <div className="cardTextContent">
                    <h3>{item.name?.slice(0, 15) || "Sản phẩm"}</h3>
                    {item.brand && <p className="brand">Thương hiệu: {item.brand}</p>}
                    {item.occasion && <p className="occasion">Dịp: {item.occasion}</p>}
                    <p className="price">
                        {item.prevPrice && <span className="stikeThrough">{item.prevPrice.toLocaleString()} VNĐ</span>}
                        <b>{item.price?.toLocaleString() || 0} VNĐ</b>
                        {item.prevPrice && <span> (Giảm {item.discount}%)</span>}
                    </p>
                    <div className="rating" title={`${item.averageRating} sao`}>
                        {"★".repeat(Math.round(item.averageRating))}
                        {"☆".repeat(5 - Math.round(item.averageRating))}
                    </div>
                </div>
            </NavLink>

            {/* ❤️ Wishlist */}
            <span className="favorite" title="Thêm vào Wishlist" onClick={handleWishlistToggle}>
                {token && isInWishList ? <FavoriteRoundedIcon /> : <FavoriteTwoToneIcon />}
            </span>

            {/* 🎖️ Badge */}
            {item.productIsBadge && (
                <span title={item.productIsBadge} className="trendingIcon">
                    <div className="ribbon ribbon-top-left">
                        <span>{item.productIsBadge}</span>
                    </div>
                </span>
            )}

            {/* 🛒 Add to cart */}
            <div className="buttons">
                <div className="addToCartButton" title="Add to Cart">
                    {token && isItemInCart(item.id) ? (
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
            {isItemInCart(item.id) && inWishlist && (
                <button onClick={handleIncrementQuantity}>Thêm 1 đơn vị của sản phẩm này</button>
            )}
        </div>
    );
}
