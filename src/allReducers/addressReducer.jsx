import { v4 as uuid } from "uuid";
export const initialAddressData=
[
  {
    id: uuid(),
    fullName: "JS Kumari",
    mobile: "+91 91111111110", //sđt
    building: "86/4",  // số nhà
    quarter: "Khu phố 11",  // khu phố
    ward: "Tân Hòa",  // phường
    district: "Biên Hòa",  // quận huyện
    province: "Đồng Nai", // tỉnh
    pincode: "530005",  
    home: false,
    work: true,
  },
]
export const reducer = (state, action) => {
  
  switch (action.type) {
    case "ADDRESSADD":
      return [...state, action.payload];
    case "DELETEADD":
      const newArray = state.filter((item) => item.id !== action.payload);
      return newArray;
    case "EDITADD": 
    const uniqueAddresses =  state.map((item)=>
      item.id === action.payload.id ? action.payload : item)
      return uniqueAddresses;
    default:
      console.log("something is wrong in reducer");
      break;
  }
 
};
