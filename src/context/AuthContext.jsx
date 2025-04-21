import { createContext, useContext, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { loginService } from "../services/authService/loginService";

import { signUpService } from "../services/authService/signUpSevice";
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const localStorageToken = JSON.parse(localStorage.getItem("loginDetails"));

  const [token, setToken] = useState(localStorageToken?.token);
  const [currentUser, setCurrentUser] = useState(localStorageToken?.user);
  const location = useLocation();
  const navigate = useNavigate();

  const loginHandler = async ({
    loginEmail: email,
    loginPassword: password,
  }) => {
    try {
      const response = await loginService(email, password);

      const {
        status,
        data: { encodedToken, foundUser },
      } = response;

      if (status === 200) {
        setToken(encodedToken);
        setCurrentUser(foundUser);
        if (location?.state?.from?.pathname)
          navigate(location?.state?.from?.pathname);
        else navigate("/", { replace: true });

        localStorage.setItem(
          "loginDetails",
          JSON.stringify({
            user: foundUser,
            token: encodedToken,
          })
        );
      }
      toast.success(`Chào bạn mới trở lại, ${foundUser.firstName}!`, {
        icon: "😍👋",
      });
    } catch (error) {
      toast.error("Đăng nhập không thành công, bạn đã nhập Email hoặc mật khẩu sai", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    }
  };

  const signUpHandler = async ({ email, password, firstName, lastName }) => {
    try {
      const response = await signUpService(
        email,
        password,
        firstName,
        lastName
      );
      const {
        status,
        data: { createdUser, encodedToken },
      } = response;
      if (status === 200 || status === 201) {
        localStorage.setItem(
          "loginDetails",
          JSON.stringify({
            user: createdUser,
            token: encodedToken,
          })
        );
        setToken(encodedToken);
        setCurrentUser(createdUser);
        toast.success("Tạo tài khoản thành công", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      }
      if (location?.state?.from?.pathname)
        navigate(location?.state?.from?.pathname);
      else navigate("/browse", { replace: true });
    } catch (error) {
      console.log(error);
      if (error.response.status === 422) {
        toast.error("Tên người dùng đã tồn tại", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
      } else
        toast.error("Không thể tạo được tài khoản ngay lúc này", {
          position: toast.POSITION.BOTTOM_RIGHT,
        });
    }
  };

  const logOutHandler = async () => {
    setToken(() => null);
    setCurrentUser(() => null);
    console.log("logout success");
    toast.success("Bạn đã đăng xuất!", {
      position: toast.POSITION.BOTTOM_RIGHT,
    });
    localStorage.removeItem("loginDetails");
    navigate("/");
  };
  return (
    <AuthContext.Provider
      value={{ signUpHandler, loginHandler, logOutHandler, token,setCurrentUser, currentUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export const useAuth = () => {
  return useContext(AuthContext);
};
