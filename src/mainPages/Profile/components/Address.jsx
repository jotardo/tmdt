import { useEffect, useState } from "react";

import { useAddress } from "../../../";
import UpdateAddress from "../../../components/UpdateAdd";
import AddressCard from "../../../components/AddressCard";
import deliveryAddressApi from "../../../backend/db/deliveryAddressApi";
import { useAuth } from "../../../context/AuthContext";
export default function Address({ isPresentinCheckout, setSelectedAddress, selectedAddress}) {
  const [isEditClicked, setIsEditClicked] = useState(false);
  const { user } = useAuth();
  const { address, handleEdit, addressDispatch } = useAddress();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const closeForm = () => {
        setIsFormOpen(false);
        setIsEditClicked(false);
    };

    useEffect(() => {
        if (!user) return;

        deliveryAddressApi.fetchByUser(user?.id).then(result => {
            addressDispatch({type: "SET_ADDRESS_LIST", payload: result.addresses});

            if (result.addresses?.length > 0) {
                setSelectedAddress(result.addresses[0]);
            }
        });
    }, [user]);


    return (
    <div className="address">
      <div
        className="addAddress"
        onClick={() => {
            handleEdit(null, false);
            setIsEditMode(false);
            setIsFormOpen(true);
        }}

      >
        <span className="plus">+</span>
        Thêm địa chỉ
      </div>
      {address.length<1? <h6>Xin thêm ít nhất 1 địa chỉ trong sổ</h6>:
          address.map((item) => {
                  if (!item) return null;

                  return isPresentinCheckout ? (
                      <label htmlFor="" className="checkoutLabel" key={item.id}>
              <input
                  type="radio"
                  name="setAddress"
                  checked={selectedAddress?.id === item?.id}
                  onChange={() => {
                      setSelectedAddress(item);
                  }}
              />


              <div>
              <AddressCard
                  key={item.id}
                  addObj={item}
              addressDispatch={addressDispatch}
              isEditClicked={isEditClicked}
              setIsEditClicked={setIsEditClicked}
              handleEdit={handleEdit}
              isPresentinCheckout
            />
            </div>
            
          </label>
        ) : (
          <AddressCard
            addObj={item}
            addressDispatch={addressDispatch}
            isEditClicked={isEditClicked}
            setIsEditClicked={setIsEditClicked}
            handleEdit={handleEdit}
          />
        );
      })}
        {isFormOpen && (
            <div className="overlay">
                <UpdateAddress
                    closeForm={closeForm}
                    isEditMode={isEditMode}
                    setIsEditMode={setIsEditMode}
                    setIsEditClicked={setIsEditClicked}
                />
            </div>
        )}
    </div>
  );
}
