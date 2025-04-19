import { NavLink,Outlet, } from "react-router-dom";
import './profile.css'


export default function Profile() {
  return (
    <><div className="profile">
      <div className="profileContainer">
        <nav>
        <NavLink to=''>Người dùng</NavLink>
        <NavLink to="/profile/address">Sổ địa chỉ</NavLink>
        <NavLink to="/profile/orders">Đơn hàng</NavLink>
       
        </nav>
       <div className="displayPages">
          <Outlet/>
        </div>
      </div>
    </div>

    </>
  );
}
