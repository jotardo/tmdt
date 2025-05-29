

export const initialAddressData=
[]
export function reducer(state, action) {
  switch(action.type) {
    case "SET_ADDRESS_LIST":
      return action.payload;

    case "ADD_ADDRESS":
      return [...state, action.payload];

    case "UPDATE_ADDRESS":
      return state.map(addr =>
          addr.id === action.payload.id ? action.payload : addr
      );

    case "DELETE_ADDRESS":
      return state.filter(addr => addr.id !== action.payload);

    default:
      return state;
  }
 
};
