
import { NavLink,Outlet } from "react-router-dom";

import {useCart} from '../../'
import './cart.css'

export default function Cart(){
const {cartCount} = useCart()
  return <div className="mainCartContainerPage">
         <h3>Giỏ hàng của bạn</h3>
        <nav className= "cartNav">
        <NavLink to=''> Giỏ hàng </NavLink> ----{`>`}
        <NavLink to={cartCount?'/cart/checkout':""}> Thông tin thanh toán </NavLink>----{`>`}
        <NavLink to={cartCount?'/cart/checkout':""}> Xác thực hóa đơn</NavLink>
        </nav>
       <div className="displayCart">
          <Outlet/>
        </div>
    </div>
}


