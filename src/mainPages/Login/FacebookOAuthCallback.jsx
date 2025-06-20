import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function FacebookOAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Lấy query params code và state
    const params = new URLSearchParams(location.search);
    const code = params.get("code");
    const state = params.get("state");

    if (!code) {
      // Nếu không có code, báo lỗi hoặc redirect
      navigate("/error");
      return;
    }

    // Gọi backend để xác thực code
    fetch(`/api/auth/facebook/callback?code=${code}&state=${state}`)
      .then(res => {
        if (res.ok) return res.json();
        throw new Error("Failed to authenticate");
      })
      .then(data => {
        // Lưu token, user info vào localStorage hoặc context
        localStorage.setItem("token", data.token);
        // Redirect về trang chính hoặc dashboard
        navigate("/");
      })
      .catch(err => {
        console.error(err);
        navigate("/error");
      });
  }, [location.search, navigate]);

  return <div>Đang xử lý đăng nhập Facebook...</div>;
}
