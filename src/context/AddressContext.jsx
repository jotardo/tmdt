import { createContext, useContext, useState, useReducer, useEffect } from "react";

import { initialAddressData, reducer } from '../allReducers/addressReducer';


export const AddressContext = createContext();


export const AddressProvider = ({ children }) => {
    const [address, addressDispatch] = useReducer(reducer, initialAddressData);

    const [addressState, setAddressState] = useState({
        userID: null,
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

    useEffect(() => {
        const userID = localStorage.getItem("user");
            setAddressState((prev) => ({
                ...prev,
                userID: userID,
            }));
    }, []);

    const handleEdit = (id, isEditClicked) => {
        const addressToEdit = address.find((item) => item.userID === id);
        if (isEditClicked) {
            setAddressState(addressToEdit);
        } else {
            setAddressState((prev) => ({
                ...prev,
                receiverName: null,
                contactNumber: null,
                buildingAddress: null,
                quarter: null,
                wardName: null,
                districtName: null,
                pincode: null,
                provinceName: null,
                workAddress: false,
            }));
        }
    };

    return (
        <AddressContext.Provider
            value={{
                address,
                addressState,
                setAddressState,
                addressDispatch,
                handleEdit,
                initialAddressData,
            }}
        >
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => useContext(AddressContext);
