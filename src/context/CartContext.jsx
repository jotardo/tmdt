import {
    useContext,
    createContext,
    useEffect,
    useReducer,
    useCallback,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import {
    getCartList,
    addToCart,
    incDecQuantity,
    deleteFromCart,
} from "../services/shopingService/cartService";
import { initialCartData, cartReducer } from "../allReducers/cartReducer";

export const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartManager, dispatch] = useReducer(cartReducer, initialCartData);
    const token = localStorage.getItem("jwtToken");
    const navigate = useNavigate();
    const location = useLocation();

    // Chuẩn hóa cart item backend => frontend
    const normalizeCartItem = (item) => ({
        ...item,
        qty: item.quantity,
        product_price: item.product?.price || 0,
        product_prevPrice: item.product?.prevPrice || 0,
        product_name: item.product?.name || "",
        _id: item.product?.id || "",
    });

    const getAllCartItems = useCallback(async (encodedToken) => {
        try {
            const userId = localStorage.getItem("user");
            if (!userId) throw new Error("User chưa đăng nhập");

            const response = await getCartList(encodedToken, userId);
            if (response.status === 200) {
                console.log("Cart API response:", response.data);

                const cartArray = Array.isArray(response.data) ? response.data : response.data.cart || [];
                const normalizedCart = cartArray.map(normalizeCartItem);

                dispatch({ type: "DISPLAYCART", payload: normalizedCart });
            }
        } catch (error) {
            if (token) {
                toast.error(error?.message || "Lỗi lấy giỏ hàng", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
            console.error("ERROR GET CART:", error);
        }
    }, [token]);

    const addToCartFunction = async (product, encodedToken) => {
        try {
            const userId = localStorage.getItem("user");
            if (!userId) throw new Error("User chưa đăng nhập");

            const response = await addToCart(userId, product.id, 1, encodedToken);

            if (response.status === 200) {
                dispatch({ type: "ADDTOCART", payload: normalizeCartItem(response.data) });
                toast.success("Đã thêm vào giỏ thành công!", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        } catch (error) {
            console.log(error);
            toast.warn("Bạn cần đăng nhập để sử dụng tính năng này", {
                position: toast.POSITION.BOTTOM_RIGHT,
            });
            navigate("/login", { state: { from: location } });
        }
    };

    const deleteFromCartFunction = async (cartItemId, productName, encodedToken, showNotification = true) => {
        try {
            const userId = localStorage.getItem("user");
            if (!userId) throw new Error("User chưa đăng nhập");

            const response = await deleteFromCart(userId, cartItemId, encodedToken);

            if (response.status === 200 && response.data.success) {
                // Có thể gọi lại để đồng bộ giỏ hàng từ server
                await getAllCartItems(encodedToken);

                if (showNotification) {
                    toast.success(`${productName} đã xóa khỏi giỏ hàng!`, {
                        position: toast.POSITION.BOTTOM_RIGHT,
                    });
                }
            } else if (showNotification) {
                toast.error(response.data.responseMessage || "Xóa sản phẩm thất bại", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        } catch (error) {
            console.error(error);
            if (showNotification) {
                toast.error("Lỗi: Không thể xóa sản phẩm khỏi giỏ hàng", {
                    position: toast.POSITION.BOTTOM_RIGHT,
                });
            }
        }
    };

    const changeQuantity = async (cartItemId, encodedToken, actionType) => {
        try {
            const userId = localStorage.getItem("user");
            if (!userId) throw new Error("User chưa đăng nhập");

            const response = await incDecQuantity(userId, cartItemId, encodedToken, actionType);

            if (response.status === 200) {
                await getAllCartItems(encodedToken);
                toast.success(
                    actionType === "increment"
                        ? "Tăng số lượng sản phẩm thành công!"
                        : "Giảm số lượng sản phẩm thành công!",
                    { position: toast.POSITION.BOTTOM_RIGHT }
                );
            }
        } catch (error) {
            toast.error(error.message || "Lỗi cập nhật số lượng");
            console.error(error);
        }
    };

    const addItemstoOrdersPlaced = (orderDetailsObj) => {
        dispatch({ type: "ORDERPLACED", payload: orderDetailsObj });
    };

    const isItemInCart = (prodId) => {
        return cartManager.cartData.some(item => item._id === prodId);
    };

    const hasCart = token && cartManager.cartData && cartManager.cartData.length > 0;

    const totalPrevPrice = cartManager.cartData.reduce(
        (acc, curr) => acc + (curr.product_prevPrice || 0) * (curr.qty || 1),
        0
    );
    const totalPrice = cartManager.cartData.reduce(
        (acc, curr) => acc + (curr.product_price || 0) * (curr.qty || 1),
        0
    );

    const totalDiscount = totalPrevPrice > 0
        ? Math.round(((totalPrevPrice - totalPrice) / totalPrevPrice) * 100)
        : 0;

    useEffect(() => {
        if (token) {
            getAllCartItems(token);
        }
    }, [token, getAllCartItems]);

    return (
        <CartContext.Provider
            value={{
                cartManager,
                addToCartFunction,
                deleteFromCartFunction,
                changeQuantity,
                isItemInCart,
                totalPrice,
                totalPrevPrice,
                totalDiscount,
                cartCount: cartManager.cartData.length,
                addItemstoOrdersPlaced,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    return useContext(CartContext);
}
