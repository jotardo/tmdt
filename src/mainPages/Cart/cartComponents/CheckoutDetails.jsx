import { useState, useEffect } from "react";
import { useCart, useAddress } from "../../../";
import EmptyCart from "../../../components/EmptyCart";
import FilledCart from "../../../components/FilledCart";

export default function CheckoutDetails() {
  const { address } = useAddress();

  const [selectedAddress, setSelectedAddress] = useState({
    userID: "",
    receiverName: "",
    contactNumber: "",
    buildingAddress: "",
    quarter: "",
    wardName: "",
    districtName: "",
    pincode: "",
    provinceName: "",
    workAddress: false,
    id: "",
  });

  useEffect(() => {
    if (address && address.length > 0 && !selectedAddress?.buildingAddress) {
      setSelectedAddress(address[0]);
    }
  }, [address, selectedAddress?.buildingAddress]);


  const [paymentSelected, setPaymentSelected] = useState(null);

  const {
    cartManager,
    totalPrice,
    totalDiscount,
    deleteFromCartFunction,
    addItemstoOrdersPlaced,
  } = useCart();

  const token = localStorage.getItem("jwtToken");

  return (
      <div className="checkout">
        {cartManager?.cartData.length > 0 ? (
            <FilledCart
                token={token}
                deleteFromCartFunction={deleteFromCartFunction}
                cartArray={cartManager}
                selectedAddress={selectedAddress}
                setSelectedAddress={setSelectedAddress}
                totalPrice={totalPrice}
                totalDiscount={totalDiscount}
                setPaymentSelected={setPaymentSelected}
                paymentSelected={paymentSelected}
                addItemstoOrdersPlaced={addItemstoOrdersPlaced}
                addressList={address}
            />
        ) : (
            <EmptyCart />
        )}
      </div>
  );
}
