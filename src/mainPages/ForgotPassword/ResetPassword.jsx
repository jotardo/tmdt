import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import authApi from "../../backend/db/authApi";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [newPassword, setNewPassword] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("loading");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const verify = async () => {
    try {
      if (!token) {
        setStatus("invalid");
        return;
      }

      const res = await authApi.verifyResetToken(token);
      if (res.email) {
        setEmail(res.email);
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (error) {
      console.error("API Error:", error);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    verify();
  }, [token]);

  const handleResetPassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      return toast.warning("Mật khẩu phải có ít nhất 6 ký tự.");
    }

    setLoading(true);
    try {
      const res = await authApi.resetPassword(token, newPassword);
      if (res.success) {
        toast.success("Đặt lại mật khẩu thành công. Vui lòng đăng nhập lại.");
        navigate("/login");
      } else {
        toast.error("Đặt lại mật khẩu thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Reset password failed", err);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading") {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography variant="body1">Đang kiểm tra token...</Typography>
      </Box>
    );
  }

  if (status === "invalid" || status === "error") {
    return (
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <Typography color="error">
          Token không hợp lệ hoặc đã hết hạn.
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8, px: 2 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Nhập mật khẩu mới
        </Typography>
        <Typography variant="body2" gutterBottom>
          Cho tài khoản: {email}
        </Typography>

        <TextField
          fullWidth
          type="password"
          label="Mật khẩu mới"
          variant="outlined"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          sx={{ mt: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleResetPassword}
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Xác nhận đổi mật khẩu"}
        </Button>
      </Paper>
    </Box>
  );
};

export default ResetPassword;
