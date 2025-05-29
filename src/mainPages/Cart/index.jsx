import { NavLink, Outlet } from "react-router-dom";
import { useCart } from "../../";
import "./cart.css";

export default function Cart() {
    const { cartCount } = useCart();

    const checkoutPath = cartCount ? "/cart/checkout" : "#";

    return (
        <div className="mainCartContainerPage">
            <h3>Giỏ hàng của bạn</h3>

            <nav className="cartNav">
                <NavLink to="" end>
                    Giỏ hàng
                </NavLink>

                <span className="separator"> &gt; </span>

                {cartCount ? (
                    <NavLink to={checkoutPath}>Thông tin thanh toán</NavLink>
                ) : (
                    <span className="disabledLink">Thông tin thanh toán</span>
                )}

                <span className="separator"> &gt; </span>

                {cartCount ? (
                    <NavLink to={checkoutPath}>Xác thực hóa đơn</NavLink>
                ) : (
                    <span className="disabledLink">Xác thực hóa đơn</span>
                )}
            </nav>

            <div className="displayCart">
                <Outlet />
            </div>
        </div>
    );
}
