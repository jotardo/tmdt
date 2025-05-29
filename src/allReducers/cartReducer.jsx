export const initialCartData = {
  cartData: [],
  orderPlaced: [],
  loading: true,
};

export const cartReducer = (state, action) => {
  const { type, payload } = action;

  switch (type) {
    case "ADDTOCART": {
      const newItem = payload;
      const existingIndex = state.cartData.findIndex(item => item._id === newItem._id);

      let updatedCart;
      if (existingIndex !== -1) {
        updatedCart = state.cartData.map(item =>
            item._id === newItem._id ? { ...item, qty: item.qty + newItem.qty } : item
        );
      } else {
        updatedCart = [...state.cartData, newItem];
      }
      return { ...state, loading: false, cartData: updatedCart };
    }

    case "DISPLAYCART":
      // payload là mảng cart items đã chuẩn hóa
      return { ...state, loading: false, cartData: payload };

    case "DELETEFROMCART":
      // payload là _id của cart item cần xóa
      return {
        ...state,
        cartData: state.cartData.filter(item => item._id !== payload),
      };

    case "INCREASEQUANT":
      // payload là _id cần tăng số lượng
      return {
        ...state,
        cartData: state.cartData.map(item =>
            item._id === payload ? { ...item, qty: item.qty + 1 } : item
        ),
      };

    case "DECREASEQUANT":
      // payload là _id cần giảm số lượng (giảm tối thiểu 1)
      return {
        ...state,
        cartData: state.cartData.map(item =>
            item._id === payload ? { ...item, qty: Math.max(item.qty - 1, 1) } : item
        ),
      };

    case "ORDERPLACED":
      return { ...state, loading: false, orderPlaced: [...state.orderPlaced, payload] };

    default:
      console.warn("Unhandled action type in cartReducer:", type);
      return state;
  }
};
