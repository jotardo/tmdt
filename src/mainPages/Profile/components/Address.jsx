import { useEffect, useState } from "react";

import { useAddress } from "../../../";
import UpdateAddress from "../../../components/UpdateAdd";
import AddressCard from "../../../components/AddressCard";
import deliveryAddressApi from "../../../backend/db/deliveryAddressApi";
import { useAuth } from "../../../context/AuthContext";
export default function Address({ isPresentinCheckout, setSelectedAddress ,id}) {
  const [isAddClicked, setIsAddClicked] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const { user } = useAuth();
  const { address, handleEdit, addressDispatch } = useAddress();

  useEffect(() => {
    if (!user)
      return;
    deliveryAddressApi.fetchByUser(user?.id).then(result => {
      console.log(result)
      addressDispatch({type: "SETADD", payload: result.addresses})
  })
  }, [user])

  return (
    <div className="address">
      <div
        className="addAddress"
        onClick={() => {
          handleEdit(123, false);
          setIsAddClicked(!isAddClicked);
        }}
      >
        <span className="plus">+</span>
        Thêm địa chỉ
      </div>
      {address.length<1? <h6>Xin thêm ít nhất 1 địa chỉ trong sổ</h6>:
      address.map((item) => {
        return isPresentinCheckout ? (
          <label htmlFor="" class="checkoutLabel">
            <input
              type="radio"
              name="setAddress"
              onChange={() => {
                setSelectedAddress(item);
              }}
            />
            <div>
              <AddressCard
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
      {isAddClicked || isEditClicked ? (
        <div className="overlay">
          <UpdateAddress
            clickF={setIsAddClicked}
            isEditClicked={isEditClicked}
            setIsEditClicked={setIsEditClicked}
          />
        </div>
      ) : null}
    </div>
  );
}
