import { useContext, useState } from "react";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useCart, useWish } from "../../../";
import ImageUploader from "../../../components/ImageUploader";
import { AuthContext } from "../../../context/AuthContext";

export default function User() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const { user, logout, setUser } = useContext(AuthContext);
  const [newUserData, setNewUserData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    emailId: user.emailId,
    phoneNo: user.phoneNo,
    avatar: user.avatar,
  });

  if (!user) return <p>Đang tải thông tin người dùng...</p>;


  const cartCount = 5;
  const wishlistCount = 3;

  const avatarUrl =
    newUserData.avatar
      ? `${process.env.REACT_APP_BASE_URL}/user/${newUserData.avatar}`
      : "/assets/model5.jpg";

  return (
    <div className="userProfileDetails" style={{ padding: 20 }}>
      <h3>Thông tin cá nhân của {newUserData.firstName}</h3>
      <div className="userDetails" style={{ display: "flex", gap: 20 }}>
        <img
          src={avatarUrl}
          alt="Ảnh đại diện"
          width="300px"
          style={{ borderRadius: "8px", objectFit: "cover" }}
        />
        <div>
          <p className="info">
            <strong>Họ và tên: </strong>
            {newUserData.firstName} {newUserData.lastName}
          </p>
          <p className="info">
            <strong>Giới tính: </strong>
            {newUserData.gender === "Male" ? "Nam" : "Nữ"}
          </p>
          <p className="info">
            <strong>Địa chỉ Email: </strong>
            {newUserData.emailId}
          </p>
          <p className="info">
            <strong>Số điện thoại: </strong>
            {newUserData.phoneNo}
          </p>
          <p className="info">
            <strong>Tổng số hàng trong giỏ: </strong>
            {cartCount}
          </p>
          <p className="info">
            <strong>Tổng số hàng trong Wishlist: </strong>
            {wishlistCount}
          </p>
          <div className="profileButtons" style={{ marginTop: 10 }}>
            <button onClick={() => setIsOpenForm(!isOpenForm)}>
              Chỉnh sửa thông tin
            </button>
            <button
              className="logOutBtn"
              style={{ marginLeft: 10 }}
              onClick={logout}
            >
              <LogoutRoundedIcon /> Đăng xuất
            </button>
          </div>
        </div>
      </div>

      {isOpenForm && (
        <ImageUploader
          setIsOpenForm={setIsOpenForm}
          newUserData={newUserData}
          setNewUserData={setNewUserData}
          currentUser={user}
          setCurrentUser={() => {}}
          setUser={setUser}
        />
      )}
    </div>
  );
}
