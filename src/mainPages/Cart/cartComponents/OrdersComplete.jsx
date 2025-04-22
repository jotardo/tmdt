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
      <h5>Đơn hàng của bạn đã được đặt thành công!</h5>
      <button onClick={()=>{navigate('/profile/orders')}}>Kiểm tra đơn hàng của bạn tại đây</button>
    </div>
  );
}
