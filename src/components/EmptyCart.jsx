import { useNavigate } from "react-router-dom";

export default function EmptyCart() {
  const navigate = useNavigate();
  return (
    <div className="emptyCart">
      <img src="\assets\mt-cart.png" alt="empty cart" srcset="" />
      <p>Giỏ hàng của bạn đang trống kìa.</p>

      <button
        onClick={() => {
          navigate("/browse");
        }}
      >
        Đi đến Cửa hàng
      </button>
    </div>
  );
}
