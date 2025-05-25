import { useContext, useState } from "react";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useCart, useWish } from "../../../";
import ImageUploader from "../../../components/ImageUploader";
import { AuthContext } from "../../../context/AuthContext";
import ChangePasswordForm from "../../../components/ChangePasswordForm"

export default function User() {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);
  const { user, logout, setUser } = useContext(AuthContext);

  const [newUserData, setNewUserData] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    gender: user.gender,
    emailId: user.emailId,
    phoneNo: user.phoneNo,
    avatar: user.avatar,
  });

  // const [passwordData, setPasswordData] = useState({
  //   currentPassword: "",
  //   newPassword: "",
  //   confirmNewPassword: "",
  // });

  const cartCount = useCart()?.length || 0;
  const wishlistCount = useWish()?.length || 0;

  const avatarUrl = newUserData.avatar
    ? `${process.env.REACT_APP_BASE_URL}/user/${newUserData.avatar}`
    : "/assets/model5.jpg";

  if (!user) return <p>Đang tải thông tin người dùng...</p>;

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
          <p><strong>Họ và tên: </strong>{newUserData.firstName} {newUserData.lastName}</p>
          <p><strong>Giới tính: </strong>{newUserData.gender === "Male" ? "Nam" : "Nữ"}</p>
          <p><strong>Địa chỉ Email: </strong>{newUserData.emailId}</p>
          <p><strong>Số điện thoại: </strong>{newUserData.phoneNo}</p>
          <p><strong>Tổng số hàng trong giỏ: </strong>{cartCount}</p>
          <p><strong>Tổng số hàng trong Wishlist: </strong>{wishlistCount}</p>

          <div className="profileButtons" style={{ marginTop: 10 }}>
            <button onClick={() => setIsOpenForm(true)}>Chỉnh sửa thông tin</button>
            <button style={{ marginLeft: 10 }} onClick={logout}>
              <LogoutRoundedIcon /> Đăng xuất
            </button>
            <button style={{ marginLeft: 10 }} onClick={() => setIsOpenChangePassword(true)}>
              Đổi mật khẩu
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
          setCurrentUser={setUser}
          setUser={setUser}
        />
      )}

      {isOpenChangePassword && (
        <ChangePasswordForm
            setIsOpenChangePassword={setIsOpenChangePassword}
            userId={user.id}
        /> 
      )}


    </div>
  );
}
