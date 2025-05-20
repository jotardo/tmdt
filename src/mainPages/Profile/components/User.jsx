import { useState, useEffect } from "react";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import { useCart, useWish } from "../../../";
import ImageUploader from "../../../components/ImageUploader";
import { useAuth } from "../../../context/AuthContext";

export default function User() {
  const { loginState, user: currentUser, setCurrentUser, login, logout:logOutHandler } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWish();
  const [newUserData, setNewUserData] = useState({
    gender: currentUser?.gender,
    mobile: currentUser?.mobile,
    selectedImage: null,
  });
  const [isOpenForm, setIsOpenForm] = useState(false);

  useEffect(() => {
    const imageSrc = localStorage.getItem("selectedImage");
    if (imageSrc) {
      setNewUserData((newUserData) => ({
        ...newUserData,
        selectedImage: imageSrc,
      }));
    }
  }, []);
  
  return (
    <>
      <div className="userProfileDetails">
        <h3>Thông tin cá nhân của {currentUser?.firstName}</h3>
        <div className="userDetails">
          {newUserData.selectedImage ? (
            <img src={newUserData.selectedImage} alt="" />
          ) : (
            <img
              src="\assets\model5.jpg"
              alt="default photo"
              srcset=""
              width={"300px"}
            />
          )}
          <div>
            <p className="info">
              {" "}
              <span className="heading">Họ và tên : </span>
              {currentUser?.lastName} {currentUser?.firstName}
            </p>
            {newUserData.gender && (
              <p className="info">
                <span className="heading">Giới tính : </span>
                {currentUser?.gender}
              </p>
            )}
            <p className="info">
              {" "}
              <span className="heading">Địa chỉ Email: </span>
              {currentUser?.email}
            </p>
            {newUserData.mobile && (
              <p className="info">
                {" "}
                <span className="heading">Số điện thoại : </span>
                {currentUser?.mobile}
              </p>
            )}
            <p className="info">
              <span className="heading">Tổng số hàng trong giỏ: </span>
              {cartCount}
            </p>
            <p className="info">
              <span className="heading">Tổng số hàng trong Wishlist: </span>
              {wishlistCount}
            </p>
            <div class="profileButtons">
              <button
                onClick={() => {
                  setIsOpenForm(!isOpenForm);
                }}
              >
                Edit Profile
              </button>
              <button class="logOutBtn" onClick={logOutHandler}>
                <LogoutRoundedIcon /> Đăng xuất{" "}
              </button>
            </div>
          </div>
        </div>
        {isOpenForm ? (
          <ImageUploader
            setIsOpenForm={setIsOpenForm}
            newUserData={newUserData}
            setNewUserData={setNewUserData}
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
          />
        ) : null}
      </div>
    </>
  );
}
