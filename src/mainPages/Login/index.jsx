import "./login.css";
import { toast } from "react-toastify";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PersonIcon from "@mui/icons-material/Person";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

import { useAuth } from "../../";

import { useState } from "react";
import { NavLink } from "react-router-dom";

export default function Login() {
  const [isSignedIn, setSignedIn] = useState(true);
  const [userSignUpDetails, setUserSignUpDetails] = useState({
    email: "",
    password: "",
    confirm_password: "",
    firstName: "",
    lastName: "",
    isTCChecked: false,
    hideIcon: { password: true, confirmPassword: true },
  });
  const [loginDetails, setLoginDetails] = useState({
    loginEmail: "",
    loginPassword: "",
    hideIcon: true,
  });
  const guestlogindetails = {
    loginEmail: "adarshbalika@gmail.com",
    loginPassword: "adarshbalika",
    hideIcon: true,
  };
  const guestSignupDetails = {
    email: "guestuser@gmail.com",
    password: "guestuser321123",
    confirm_password: "guestuser321123",
    firstName: "Atithi",
    lastName: "Dev",
    isTCChecked: true,
    hideIcon: { password: true, confirmPassword: true },

  };
  const { signUpHandler, loginHandler } = useAuth();

  const handleInput = (e) => {
    const input = e.target.value;
    const prop = e.target.name;
    if (e.target.type === "checkbox") {
      setUserSignUpDetails({ ...userSignUpDetails, [prop]: e.target.checked });
    } else setUserSignUpDetails({ ...userSignUpDetails, [prop]: input });
  };
  const handleGuestLogin = (e) => {
    e.preventDefault();
    setLoginDetails(() => guestlogindetails);
  };
  const handleGuestSignUp = (e) => {
    e.preventDefault();
    setUserSignUpDetails(() => guestSignupDetails);
  };

  const handleLoginInput = (e) => {
    const input = e.target.value;
    const prop = e.target.name;
    console.log(input);
    if (e.target.type === "checkbox") {
      setLoginDetails({ ...loginDetails, [prop]: e.target.checked });
    } else setLoginDetails({ ...loginDetails, [prop]: input });
  };

  const handleSignUpSubmit = (e) => {
    e.preventDefault();
    if (
      userSignUpDetails.confirm_password === userSignUpDetails.password &&
      userSignUpDetails.isTCChecked
    )
      signUpHandler(userSignUpDetails);
    else {
      toast.error("Passwords does not match", {
        position: toast.POSITION.BOTTOM_RIGHT,
        className: "loginToast",
      });
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    loginHandler(loginDetails);
  };

  return (
    <>
      {isSignedIn ? (
        <section class="loginSection">
          <div className="formBox">
            <div className="formValue">
              <form>
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
                  />
                  <label htmlFor="loginEmail">Email</label>
                </div>
                <div className="inputBox">
                  <span
                    onClick={() => {
                      setLoginDetails({
                        ...loginDetails,
                        hideIcon: !loginDetails.hideIcon,
                      });
                    }}
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
                  />
                  <label htmlFor="loginPassword">Mật khẩu</label>
                </div>
                <div className="forget">
                  <label htmlFor="rememberMe">
                    <input type="checkbox" name="rememberMe" id="rememberMe" />{" "}
                    Lưu đăng nhập{" "}
                  </label>
                  <span
                    onClick={() => {
                      alert(
                        "Take a deep breath, and try to remember the password.\n Sorry we can't do anything about it :("
                      );
                    }}
                  >
                    {" "}
                    Quên mật khẩu?
                  </span>
                </div>
                <div className="buttons" style={{ fontFamily: "abel" }}>
                  <button type="submit" onClick={handleLoginSubmit}>
                    Đăng nhập
                  </button>
                  <button type="submit" onClick={handleGuestLogin}>
                    Đặt là Guest
                  </button>
                </div>
                <div className="signUp">
                  <p>
                    Chưa có tài khoản?{" "}
                    <a
                      href="#"
                      onClick={() => {
                        setSignedIn(false);
                      }}
                    >
                      Đăng kí tại đây...
                    </a>{" "}
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>
      ) : (
        <section class="signUpSection">
          <div className="formBox">
            <div className="formValue">
              <form action="">
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
                  />
                  <label htmlFor="lastName">Họ</label>
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
                  />
                  <label htmlFor="email">Email</label>
                </div>
                <div className="inputBox">
                  <span
                    onClick={() => {
                      setUserSignUpDetails({
                        ...setUserSignUpDetails,
                        hideIcon: {
                          ...userSignUpDetails.hideIcon,
                          password: !userSignUpDetails.hideIcon.password,
                        },
                      });
                    }}
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
                  />
                  <label htmlFor="password">Mật khẩu</label>
                </div>
                <div className="inputBox">
                  <span
                    onClick={() => {
                      setUserSignUpDetails({
                        ...setUserSignUpDetails,
                        hideIcon: {
                          ...userSignUpDetails.hideIcon,
                          confirmPassword:
                            !userSignUpDetails.hideIcon.confirmPassword,
                        },
                      });
                    }}
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
                  />
                  <label htmlFor="password">Xác nhận mật khẩu</label>
                </div>
                <div className="forget">
                  <label htmlFor="acceptT&C">
                    <input
                      type="checkbox"
                      name="isTCChecked"
                      id="acceptT&C"
                      required
                      onChange={handleInput}
                    />
                    Tôi đã đọc Điều khoản sử dụng và đã chấp thuận{" "}
                  </label>
                </div>
                <div className="buttons">
                  <button type="submit" onClick={handleSignUpSubmit}>
                    Đăng kí
                  </button>

                  <button onClick={handleGuestSignUp}>Đặt là Guest</button>
                </div>

                <div onClick={() => { setSignedIn(!isSignedIn) }}>
                  <NavLink to='/login' >Đăng nhập ở đây...</NavLink>
                </div>

              </form>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
