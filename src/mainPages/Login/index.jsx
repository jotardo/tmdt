import "./login.css";
import { toast } from "react-toastify";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import { NavLink, useNavigate } from "react-router-dom";
import authApi from "../../backend/db/authApi";

export default function Login() {
  const [isSignedIn, setSignedIn] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [userSignUpDetails, setUserSignUpDetails] = useState({
    email: "",
    password: "",
    confirm_password: "",
    firstName: "",
    lastName: "",
    username: "",
    isTCChecked: false,
    hideIcon: { password: true, confirmPassword: true },
  });
  const [loginDetails, setLoginDetails] = useState({
    loginEmail: "",
    loginPassword: "",
    hideIcon: true,
  });


  const { login, user } = useContext(AuthContext);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInput = (e) => {
    const { name, value, type, checked } = e.target;
    setUserSignUpDetails((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleLoginInput = (e) => {
    const { name, value } = e.target;
    setLoginDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    // Kiểm tra email và mật khẩu
    if (!validateEmail(loginDetails.loginEmail)) {
      toast.error("Email không hợp lệ", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
    if (!loginDetails.loginPassword) {
      toast.error("Vui lòng nhập mật khẩu", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Gửi yêu cầu POST đến API
      const response = await authApi.login({
        email: loginDetails.loginEmail,
        password: loginDetails.loginPassword,
      });

      // Kiểm tra kết quả từ API
      if (response.success && response.jwtToken) {
        login(response.jwtToken, response.user);
        toast.success("Đăng nhập thành công!");
        
        // Navigate to home or dashboard after login
        navigate("/");
      } else {
        toast.error(response.responseMessage || "Đăng nhập thất bại, Vui lòng thử lại!");
      }
    } catch (error) {
      toast.error(error.message || "Đăng nhập thất bại", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUpSubmit = async (e) => {
    e.preventDefault();
  
    // Kiểm tra tính hợp lệ của email
    if (!validateEmail(userSignUpDetails.email)) {
      toast.error("Email không hợp lệ", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
  
    // Kiểm tra xem mật khẩu có khớp không
    if (userSignUpDetails.password !== userSignUpDetails.confirm_password) {
      toast.error("Mật khẩu không khớp", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
  
    // Kiểm tra xem người dùng đã đồng ý với điều khoản sử dụng chưa
    if (!userSignUpDetails.isTCChecked) {
      toast.error("Vui lòng chấp nhận điều khoản sử dụng", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
  
    // Kiểm tra xem người dùng đã nhập đủ thông tin chưa
    if (!userSignUpDetails.firstName || !userSignUpDetails.lastName || !userSignUpDetails.username) {
      toast.error("Vui lòng nhập đầy đủ thông tin", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Gọi API đăng ký người dùng
      const response = await authApi.register({
        email: userSignUpDetails.email,
        password: userSignUpDetails.password,
        firstName: userSignUpDetails.firstName,
        lastName: userSignUpDetails.lastName,
        username: userSignUpDetails.username,
      });
      if (response.success) {
        toast.success("Đăng ký thành công !");
        setTimeout(() => toast.success("Đã gửi mã xác nhận đến email, xác nhận Email để đăng nhập !"), 1500)
      } else {
        toast.error(response.responseMessage || "Đăng ký thất bại. Kiểm tra thông tin!");
      }
    } catch (error) {
      // Nếu có lỗi, hiển thị thông báo lỗi
      toast.error(error.message || "Đăng ký thất bại", {
        position: toast.POSITION.BOTTOM_RIGHT,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  }

  return (
    <>
      {isSignedIn ? (
        <section className="loginSection">
          <div className="formBox">
            <div className="formValue">
              <form onSubmit={handleLoginSubmit}>
                <h2>Đăng nhập</h2>
                <div className="inputBox">
                  <MailOutlineRoundedIcon />
                  <input
                    type="email"
                    name="loginEmail"
                    id="loginEmail"
                    value={loginDetails.loginEmail}
                    required
                    onChange={handleLoginInput}
                    disabled={isLoading}
                  />
                  <label htmlFor="loginEmail">Email</label>
                </div>
                <div className="inputBox">
                  <span
                    onClick={() =>
                      setLoginDetails({
                        ...loginDetails,
                        hideIcon: !loginDetails.hideIcon,
                      })
                    }
                  >
                    {loginDetails.hideIcon ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </span>
                  <input
                    type={loginDetails.hideIcon ? "password" : "text"}
                    name="loginPassword"
                    id="loginPassword"
                    value={loginDetails.loginPassword}
                    required
                    onChange={handleLoginInput}
                    disabled={isLoading}
                  />
                  <label htmlFor="loginPassword">Mật khẩu</label>
                </div>
                <div className="forget">
                  <label htmlFor="rememberMe">
                    <input type="checkbox" name="rememberMe" id="rememberMe" disabled={isLoading} />
                    Lưu đăng nhập
                  </label>
                  <span
                    onClick={() => handleForgotPassword()}
                  >
                    Quên mật khẩu?
                  </span>
                </div>
                <div className="buttons" style={{ fontFamily: "abel" }}>
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                  </button>
                </div>
                <div className="signUp">
                  <p>
                    Chưa có tài khoản?{" "}
                    <a href="#" onClick={() => setSignedIn(false)}>
                      Đăng kí tại đây...
                    </a>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : (
        <section className="signUpSection">
          <div className="formBox">
            <div className="formValue">
              <form onSubmit={handleSignUpSubmit}>
                <h2>Đăng kí</h2>
                <div className="inputBox">
                  <PersonIcon />
                  <input
                    type="text"
                    name="firstName"
                    id="firstName"
                    value={userSignUpDetails.firstName}
                    required
                    onChange={handleInput}
                    disabled={isLoading}
                  />
                  <label htmlFor="firstName">Tên</label>
                </div>
                <div className="inputBox">
                  <PersonIcon />
                  <input
                    type="text"
                    name="lastName"
                    id="lastName"
                    value={userSignUpDetails.lastName}
                    required
                    onChange={handleInput}
                    disabled={isLoading}
                  />
                  <label htmlFor="lastName">Họ</label>
                </div>
                <div className="inputBox">
                  <PersonIcon />
                  <input
                    type="text"
                    name="username"
                    id="username"
                    value={userSignUpDetails.username}
                    required
                    onChange={handleInput}
                    disabled={isLoading}
                  />
                  <label htmlFor="username">Tên người dùng</label>
                </div>
                <div className="inputBox">
                  <MailOutlineRoundedIcon />
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={userSignUpDetails.email}
                    required
                    onChange={handleInput}
                    disabled={isLoading}
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="inputBox">
                  <span
                    onClick={() =>
                      setUserSignUpDetails({
                        ...userSignUpDetails,
                        hideIcon: {
                          ...userSignUpDetails.hideIcon,
                          password: !userSignUpDetails.hideIcon.password,
                        },
                      })
                    }
                  >
                    {userSignUpDetails.hideIcon.password ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </span>
                  <input
                    type={userSignUpDetails.hideIcon.password ? "password" : "text"}
                    name="password"
                    id="password"
                    value={userSignUpDetails.password}
                    required
                    onChange={handleInput}
                    disabled={isLoading}
                  />
                  <label htmlFor="password">Mật khẩu</label>
                </div>
                <div className="inputBox">
                  <span
                    onClick={() =>
                      setUserSignUpDetails({
                        ...userSignUpDetails,
                        hideIcon: {
                          ...userSignUpDetails.hideIcon,
                          confirmPassword: !userSignUpDetails.hideIcon.confirmPassword,
                        },
                      })
                    }
                  >
                    {userSignUpDetails.hideIcon.confirmPassword ? (
                      <VisibilityOffIcon />
                    ) : (
                      <VisibilityIcon />
                    )}
                  </span>
                  <input
                    type={userSignUpDetails.hideIcon.confirmPassword ? "password" : "text"}
                    name="confirm_password"
                    id="confirm_password"
                    value={userSignUpDetails.confirm_password}
                    required
                    onChange={handleInput}
                    disabled={isLoading}
                  />
                  <label htmlFor="confirm_password">Xác nhận mật khẩu</label>
                </div>
                <div className="forget">
                  <label htmlFor="acceptT&C">
                    <input
                      type="checkbox"
                      name="isTCChecked"
                      id="acceptT&C"
                      checked={userSignUpDetails.isTCChecked}
                      onChange={handleInput}
                      required
                      disabled={isLoading}
                    />
                    Tôi đã đọc và chấp nhận Điều khoản sử dụng
                  </label>
                </div>
                <div className="buttons">
                  <button type="submit" disabled={isLoading}>
                    {isLoading ? "Đang đăng ký..." : "Đăng kí"}
                  </button>
                </div>
                <div>
                  <NavLink to="/login" onClick={() => setSignedIn(true)}>
                    Đăng nhập tại đây...
                  </NavLink>
                </div>
              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
}