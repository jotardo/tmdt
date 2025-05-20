import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";

export default function OAuth2RedirectHandler() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  useEffect(() => {
  const token = searchParams.get("token");
  const userEncoded = searchParams.get("user");
    
  try {
    const userData = userEncoded ? JSON.parse(atob(userEncoded)) : null;

    if (token && userData) {
      login(token, userData);
      toast.success("Đăng nhập bằng Google thành công!");
      navigate("/");
    } else {
      throw new Error("Missing token or user data");
    }
  } catch (e) {
    toast.error("Đăng nhập bằng Google thất bại");
    navigate("/login");
  }
}, []);

  return <div>Đang xử lý đăng nhập...</div>;
}
