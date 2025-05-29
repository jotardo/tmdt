import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Address from "../mainPages/Profile/components/Address";
import Loader from "./Loader";
import { useData } from "../context/DataContext";
import {createOrder, verifyOtp, resendOTP} from "../services/shopingService/orderService";
import OTPModal from "./Cards/OTPModal";
import {useState} from "react";


export default function FilledCart({
                                     token,
                                     cartArray: { cartData, loading },
                                     setSelectedAddress,
                                     selectedAddress,
                                     paymentSelected,
                                     totalPrice,
                                     totalDiscount,
                                     deleteFromCartFunction,
                                     setPaymentSelected,
                                     addItemstoOrdersPlaced,
                                   }) {
  const navigate = useNavigate();
  const { getSingleProduct } = useData();

  const grandTotal = totalPrice - totalDiscount + 25000;

  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [createdOrderId, setCreatedOrderId] = useState(null);

  const handleVerifyOtp = async (otp) => {
    try {
      const result = await verifyOtp(createdOrderId, otp, token);
      if (result.success) {
        toast.success("Xác thực OTP thành công!");
        setIsOtpModalOpen(false);
        navigate("/cart/completedorders");
      } else {
        toast.warn("Mã OTP không đúng hoặc đã hết hạn!");
      }
    } catch (error) {
      toast.error("Lỗi khi xác thực OTP!");
    }
  };

  const handleResendOtp = async () => {
    try{
      const result = await resendOTP(createdOrderId, token);
      console.log(createdOrderId);
      if (result.data?.success) {
        toast.success("Đã gửi lại mã OTP!");
        setIsOtpModalOpen(false);
      } else {
        toast.warn("Gửi lại không thành công");
      }
    } catch (error) {
      toast.error("Oh oh");
    }
  }


  const handleOrderPlaced = async () => {
    if (paymentSelected && selectedAddress?.id) {
      const orderData = {
        userId: localStorage.getItem("user"),
        deliveryAddressId: selectedAddress.id,
        cartItems: cartData.map(item => ({
          productId: item.id,
          quantity: item.quantity
        })),
        totalAmount: totalPrice,
        discount: totalDiscount,
        paymentMethod: paymentSelected === "online",
      };

      try {
        const res = await createOrder(orderData, token);
        console.log(res.data?.success);
        if (res.data?.success) {
          setCreatedOrderId(res.data?.orderID);
          setIsOtpModalOpen(true);

          addItemstoOrdersPlaced({
            orderId: null,
            orders: cartData,
            address: selectedAddress,
            amount: grandTotal,
            payBy: paymentSelected,
            deliveryDate: new Date().toDateString(),
          });


          toast.success("Đặt hàng thành công!", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });

        } else {
          toast.warn("Không xong rồii", {
            position: toast.POSITION.BOTTOM_RIGHT,
          });
        }

      } catch (error) {
        console.error("Lỗi khi tạo đơn hàng:", error);
        toast.error("Đặt hàng thất bại!", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }


    } else {
      if (!selectedAddress?.id) {
        toast.warn("Vui lòng chọn địa chỉ giao hàng", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else {
        toast.warn("Vui lòng chọn phương thức thanh toán", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
    }
  };

  return (
      <>
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
                cartData.map((item) => (
                    <div
                        key={item._id}
                        className="productCartCard"
                        style={{ cursor: "pointer" }}
                        onClick={() => {
                          getSingleProduct(item._id);
                          navigate(`/products/${item._id}`);
                        }}
                    >
                <span>
                  <img src={item.product_image} alt="" width="70px" />
                  <span>
                    {item.product_name.slice(0, 15)} x {item.qty}
                  </span>
                </span>
                      <span>{item.product_price * item.qty} VNĐ</span>
                    </div>
                ))
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
              <span>{totalDiscount} VNĐ</span>
            </span>
              <span className="deliveryCharges">
              <span>Phí giao hàng</span>
              <span>25000 VNĐ</span>
            </span>
              <span className="grandTotal">
              <span>Tổng tiền</span>
              <span>{grandTotal} VNĐ</span>
            </span>
            </div>

            <div className="addressShow">
              <h5>Sẽ được giao tới địa chỉ</h5>
              {selectedAddress?.id ? (
                  <div className="addressText">
                    <p className="addType">
                      <small>
                        {selectedAddress.home
                            ? "Cá nhân"
                            : selectedAddress.work
                                ? "Văn phòng"
                                : ""}
                      </small>
                    </p>
                    <p>
                      <b>
                        {selectedAddress.receiverName} - {selectedAddress.contactNumber}
                      </b>
                    </p>
                    <p>Số nhà: {selectedAddress.buildingAddress}</p>
                    <p>
                      Tỉnh: {selectedAddress.provinceName}, Huyện: {selectedAddress.districtName}
                    </p>
                    <p>Phường: {selectedAddress.wardName}</p>
                    <p>
                      {selectedAddress.state} - <b>{selectedAddress.pincode}</b>
                    </p>
                  </div>
              ) : (
                  <p>Xin lựa chọn địa chỉ giao hàng</p>
              )}
            </div>

            <div className="choosePayment">
              <h5>Chọn hình thức thanh toán</h5>
              <label htmlFor="online">
                <input
                    type="radio"
                    name="payment"
                    id="online"
                    value="online"
                    onChange={(e) => setPaymentSelected(e.target.value)}
                />
                Trực tuyến
              </label>
              <label htmlFor="cashOnDelivery">
                <input
                    type="radio"
                    name="payment"
                    id="cashOnDelivery"
                    value="Cash on delivery"
                    onChange={(e) => setPaymentSelected(e.target.value)}
                />
                Trả tiền khi nhận hàng
              </label>
            </div>

            <button onClick={handleOrderPlaced}>Đặt hàng</button>
          </div>
          <OTPModal
              isOpen={isOtpModalOpen}
              onClose={() => setIsOtpModalOpen(false)}
              onSubmit={handleVerifyOtp}
              onResend={handleResendOtp}
          />
        </div>
      </div>
</>
  );
}
