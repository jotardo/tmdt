import { useNavigate } from "react-router-dom";

export default function EmptyCart() {
  const navigate = useNavigate();
  return (
    <div className="emptyCart">
      <img src="\assets\mt-cart.png" alt="empty cart" srcset="" />
      <p>Giỏ hàng của bạn chưa có sản phẩm nào hết.</p>

      <button
        onClick={() => {
          navigate("/shop");
        }}
      >
        Tiếp tục mua tại Cửa hàng
      </button>
    </div>
  );
}
