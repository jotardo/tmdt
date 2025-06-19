import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { saveAuthData } from "../../utils/authUtils";


export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login, logout } = useContext(AuthContext);

  useEffect(() => {
  const token = searchParams.get("token");
  const userEncoded = searchParams.get("user");
    
  try {
    const userData = userEncoded ? JSON.parse(atob(userEncoded)) : null;

    if (token && userData) {
      login(token, userData);
      saveAuthData(token, userData);
      toast.success("Đăng nhập thành công!");
      navigate("/");
    } else {
      throw new Error("Missing token or user data");
    }
  } catch (e) {
    toast.error("Đăng nhập thất bại");
    navigate("/login");
  }
}, []);

  return <div>Đang xử lý đăng nhập...</div>;
}
