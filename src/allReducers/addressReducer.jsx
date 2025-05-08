import { v4 as uuid } from "uuid";
export const initialAddressData=
[
  {
    id: uuid(),
    fullName: "JS Kumari",
    mobile: "+91 91111111110", //sđt
    building: "B33",  // số nhà
    quarter: "Street 332",  // khu phố
    ward: "United State of Programming",  // phường
    district: "Doodle District",  // quận huyện
    province: "TypeScript", // tỉnh
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
