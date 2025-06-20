import {createContext, useReducer, useEffect, useContext, useCallback, useState} from "react";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import {
  initialWishList,
  wishReducerFunction,
} from "../allReducers/wishReducer";
import {
  getWishList,
  removeFromWishlist,
  addToWishlist,
} from "../services/shopingService/wishlistService";

export const WishContext = createContext();

export function WishProvider({ children }) {
  const [wishList, setWishList] = useReducer(wishReducerFunction, initialWishList);
  const navigate = useNavigate();
  const location = useLocation();
  const [token] = useState(() => localStorage.getItem("jwtToken"));

  const getWishlistData = useCallback(async () => {
    const currentUserId = localStorage.getItem("user");
    const currentToken = localStorage.getItem("jwtToken");

    if (!currentUserId || !currentToken) return;

    try {
      const response = await getWishList(currentUserId, currentToken);
      const { status, data } = response;
      if (status === 200) {
        setWishList({ type: "ALLWISHLIST", payload: [...data] });
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  }, []);

  const addWishListData = async (product) => {
    const currentUserId = localStorage.getItem("user");
    const currentToken = localStorage.getItem("jwtToken");

    if (!currentToken) {
      navigate('/login', { state: { from: location } });
      toast.warn("Bạn cần đăng nhập để sử dụng tính năng này", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }

    try {
      const response = await addToWishlist(currentUserId, product.id, currentToken);
      const { status, data } = response;

      if (status === 200) {
        await getWishlistData();
        toast.success("Thêm sản phẩm vào Wishlist thành công!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        toast.error(data.responseMessage || "Không thể thêm vào Wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi thêm sản phẩm vào Wishlist", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const isAvailableInWishList = useCallback(
      (productId) =>
          wishList.backendWishList?.some((item) => item.productId === productId),
      [wishList.backendWishList]
  );


  const deleteWishListData = async (productId) => {
    const currentUserId = localStorage.getItem("user");
    const currentToken = localStorage.getItem("jwtToken");

    if (!currentUserId || !currentToken) {
      toast.error("Vui lòng đăng nhập để xoá sản phẩm khỏi Wishlist");
      return;
    }

    try {
      const response = await removeFromWishlist(currentUserId, productId, currentToken);
      const { status, data } = response;
      console.log(data)
      if (status === 200) {
        await getWishlistData();
        toast.warn("Đã xoá sản phẩm khỏi Wishlist", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        toast.error(data.responseMessage || "Không thể xoá khỏi Wishlist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi xoá sản phẩm khỏi Wishlist", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };


  useEffect(() => {
    if (token) {
      void getWishlistData();
    }
  }, [token, getWishlistData]);

  return (
      <WishContext.Provider
          value={{
            wishList,
            wishlistCount: wishList.backendWishList.length,
            addWishListData,
            deleteWishListData,
            isAvailableInWishList,
          }}
      >
        {children}
      </WishContext.Provider>
  );
}

export const useWish = () => useContext(WishContext);
