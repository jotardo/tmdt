import { createContext, useContext, useState, useReducer } from "react";

import { v4 as uuid } from "uuid";
import { initialAddressData, reducer } from '../allReducers/addressReducer';


export const AddressContext = createContext();


export const AddressProvider = ({ children }) => {
  const [address, addressDispatch] = useReducer(reducer, initialAddressData);
  const dummyAddress = {
    id: uuid(),
    receiverName: "Dummy Malhotra",
    contactNumber: "+91 9998886661",
    buildingAddress: "A43",
    quarter: "Street 332",
    wardName: "New Town",
    districtName: "Dummy districtName",
    pincode: "400005",
    provinceName: "Use State of React",
    workAddress: true,
  };
  const [addressState, setAddressState] = useState({
    id: uuid(),
    receiverName: null,
    contactNumber: null,
    buildingAddress: null,
    quarter: null,
    wardName: null,
    districtName: null,
    pincode: null,
    provinceName: null,
    workAddress: false,
  });

  const handleEdit = (id, isEditClicked) => {
    const addressToEdit = address.find((item) => item.id === id);
    if (isEditClicked) {
      setAddressState(addressToEdit);
    }
    else {
      setAddressState(initialAddressData);
    }
  };

  return (
    <AddressContext.Provider
      value={{
        address,
        addressState,
        dummyAddress,
        setAddressState,
        addressDispatch,
        handleEdit,
        initialAddressData
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};
export const useAddress = () => useContext(AddressContext);
