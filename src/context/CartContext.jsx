import {
  useContext,
  createContext,
  useEffect,
  useState,
  useReducer,  
} from "react";
import {useNavigate, useLocation} from 'react-router-dom'
import { toast } from "react-toastify";
import { isLoggedIn } from "../";
import {
  getCartList,
  addToCart,
  incDecQuantity,
  deleteFromCart,
} from "../services/shopingService/cartService";
import { initialCartData, cartReducer } from "../allReducers/cartReducer";
export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartManager, setCartManager] = useReducer(
    cartReducer,
    initialCartData
  );
  const token = localStorage.getItem("jwtToken");
 const navigate = useNavigate()
 const location = useLocation()
  const getAllCartItems = async (encodedToken) => {
    try {
      const response = await getCartList(encodedToken);
      const {
        status,
        data: { cart },
      } = response;
      if (status === 200) {
        setCartManager({ type: "DISPLAYCART", payload: [...cart] });
      }
    } catch (error) {
      if (token)
        toast.error(error?.message, {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      console.error(error);
    }
  };

  const addToCardFunction = async (product, encodedToken) => {
    try {
      const response = await addToCart(product, encodedToken);
      const {
        status,
        data: { cart },
      } = response;
      if (status === 201) {
        setCartManager({ type: "ADDTOCART", payload: cart });
        toast.success("Đã thêm vào giỏ thành công!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    } catch (error) {
      toast.warn("Bạn cần đăng nhập để sử dụng tính năng này", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      navigate('/login', {state:{from :location}})
      
    }
  };
  const deleteFromCartFunction = async (id, title, encodedToken,showNotification) => {
    try {
      const response = await deleteFromCart(id, encodedToken);
      const {
        status,
        data: { cart },
      } = response;

      if (status === 200) {
        setCartManager({ type: "DELETEFROMCART", payload: cart });
       if( showNotification)toast.success(`${title} đã xóa khỏi giỏ hàng!`, {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    } catch (error) {
     
      if( showNotification) toast.error("Lỗi: Không thể xóa sản phẩm này khỏi giỏ hàng", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const changeQuantity = async (productId, encodedToken, type) => {
    try {
      const response = await incDecQuantity(productId, encodedToken, type);
      const {
        status,
        data: { cart },
      } = response;
      if (status === 200) {
        if (type === "increment")
          setCartManager({ type: "INCREASEQUANT", payload: cart });
        else setCartManager({ type: "DECREASEQUANT", payload: cart });
        toast.success(
          type === "increment"
            ? `Tăng số lượng sản phẩm thành công!`
            : `Giảm số lượng sản phẩm thành công!`,
          {
            position: toast.POSITION.BOTTOM_RIGHT,
          }
        );
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

const addItemstoOrdersPlaced = (orderDetailsObj)=>{
  setCartManager({ type: "ORDERPLACED", payload: orderDetailsObj });
}



const isItemInCart = (prodId)=>{
  return cartManager?.cartData.find(item=> item._id === prodId)?true:false
}

  const totalPrevPrice = token && cartManager?.cartData
  ? Math.floor(cartManager?.cartData.reduce(
      (acc, curr) => curr.product_prevPrice * curr.qty + acc,
      0
    ))
  : 0;

  const totalPrice =  token && cartManager?.cartData
    ? Math.floor(cartManager?.cartData.reduce(
        (acc, curr) => curr.product_price * curr.qty + acc,
        0
      ))
    : 0;
  const totalDiscount = token && cartManager?.cartData? Math.floor(
    100 - ((totalPrice / totalPrevPrice) * 100)
  ):0


  useEffect(() => {
    if (token) getAllCartItems(token);
  }, [token]);
  return (
    <CartContext.Provider
      value={{
        changeQuantity,
        cartManager,
        addToCardFunction,
        deleteFromCartFunction,
        isItemInCart,
        totalPrice,
        totalPrevPrice,
        totalDiscount,
        cartCount:  cartManager?.cartData?cartManager?.cartData.length:0,
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
