import { useNavigate } from "react-router-dom";

export default function OrderComplete() {
  const navigate = useNavigate()
  return (
    <div className="orderComplete">
      Xác nhận đơn hàng
      <div className="orderPlaced">
        <img
          src="\assets\order-placed-purchased-icon.svg"
          alt="empty cart"
          srcset=""
          width="200px"
        />
      </div>
      <h5>Lựa chọn tốt đó, đơn hàng của bạn đã được đặt thành công!</h5>
      <button onClick={()=>{navigate('/profile/orders')}}>Kiểm tra Đơn hàng của bạn</button>
    </div>
  );
}
