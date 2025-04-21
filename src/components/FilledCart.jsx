import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { v4 as uuid } from "uuid";
import Address from "../mainPages/Profile/components/Address";
import Loader from "./Loader";

import { useData } from "../context/DataContext";

export default function FilledCart({
  token,
  cartArray: { cartData, loading },
  setSelectedAddress,
  selectedAddress,
  paymentSelected,
  totalPrice,
  deleteFromCartFunction,
  setPaymentSelected,
  addItemstoOrdersPlaced,
}){
  const navigate = useNavigate();
  const todate = new Date().toString();
  const {getSingleProduct}= useData()
  const {
    id,
    fullName,
    mobile,
    building,
    streetName,
    town,
    districtName,
    pincode,
    state,
    home,
    work,
  } = selectedAddress;

  const handleOrderPlaced = (paymentSelected, token) => {
    if (paymentSelected && selectedAddress.id) {
      addItemstoOrdersPlaced({
        orderId: uuid(),
        orders: cartData,
        address: selectedAddress,
        amount: totalPrice - 2500000 + 25000,
        payBy: paymentSelected,
        deliveryDate: todate.slice(0, 15),
      });
      cartData.forEach(({ _id, product_name }) => {
        deleteFromCartFunction(_id, product_name, token, false);
      });
      console.log(cartData);
      navigate("/cart/completedorders");
    } else {
      if (!selectedAddress.id) {
        toast.warn("Please select an address to procced", {
          position: toast.POSITION.BOTTOM_RIGHT,
        }
        )
      }
      else {
        toast.warn("Please Select Payment Option", {
          position: toast.POSITION.BOTTOM_RIGHT,
        })
      }
    }
  };
  return (
    <div className="filledCart">
      <div className="cutomerDetails">
        <div>
          <h5>Giao đến</h5>
          <Address
            isPresentinCheckout={true}
            setSelectedAddress={setSelectedAddress}
            id={selectedAddress.id}
          />
        </div>

        <div className="cartProductBox">
          <h5>Chi tiết các đơn hàng</h5>
          <div className="header">
            <span>Sản phẩm</span>
            <span>Thành tiền</span>
          </div>
          {loading ? (
            <Loader />
          ) : (
            cartData.map((item) => {
              return (
                <div
                  className="productCartCard"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                   
                      getSingleProduct(item._id);
                    
                    navigate(`/products/${item._id}`);
                  }}
                >
                  <span>
                    <img
                      src={item.product_image}
                      alt=""
                      srcset=""
                      width="70px"
                    />
                    <span>
                      {item.product_name.slice(0, 15)} x {item.qty}
                    </span>
                  </span>
                  <span>{item.product_price * item.qty} VNĐ</span>
                </div>
              );
            })
          )}
        </div>
      </div>
      <div className="orderDetails">
        <div className="orderBox">
          <div className="totals">
            <h5>Chi tiết hóa đơn</h5>
            <span className="totalPrice">
              <span>Thành tiền</span>
              <span>{totalPrice} VNĐ</span>
            </span>
            <span className="totalDiscount">
              <span>Khuyến mãi</span>
              <span>{2500000} VNĐ</span>
            </span>

            <span className="deliveryCharges">
              <span>Phí giao hàng</span>
              <span>{25000} VNĐ</span>
            </span>
            <span className="grandTotal">
              <span>Tổng tiền</span>
              <span>{totalPrice - 2500000 + 25000} VNĐ</span>
            </span>
          </div>

          <div className="addressShow">
            <h5>Sẽ được giao tới địa chỉ</h5>
            {selectedAddress.id ?
              <div className="addressText">
                <p className="addType">
                  <small>{home ? "Cá nhân" : work ? "Văn phòng" : null}</small>
                </p>
                <p>
                  <b>
                    {fullName}
                    <span style={{ width: "20px" }}> ... </span>
                    {mobile}
                  </b>
                </p>
                <p>Số nhà: {building}</p>
                <p>{streetName}</p>
                <p>
                  {town},{districtName}
                </p>
                <p>
                  {state} - <b>{pincode}</b>
                </p>
              </div>
              :<p>Xin lựa chọn địa chỉ giao hàng</p>

            }
          </div>


          <div className="choosePayment">
            <h5> Chọn hình thức thanh toán</h5>
            <label htmlFor="online">
              <input
                type="radio"
                name="payment"
                id="online"
                value="online"
                required
                onChange={(e) => {
                  setPaymentSelected(e.target.value);
                }}
              />
              Trực tuyến
            </label>
            <label htmlFor="cashOnDelivery">
              <input
                type="radio"
                name="payment"
                id="cashOnDelivery"
                value="Cash on delivery"
                onChange={(e) => {
                  setPaymentSelected(e.target.value);
                }}
                required
              />
              Trả tiền khi nhận hàng
            </label>
          </div>

          <button
            onClick={() => {
              handleOrderPlaced(paymentSelected, token);
            }}
          >
            Đặt hàng
          </button>
        </div>
      </div>
    </div>
  );
};
