// pages/ForgotPassword.jsx
import React, { useState } from "react";
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

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    if (!email) {
      return toast.warning("Vui lòng nhập email!");
    }

    setLoading(true);
    try {
      const response = await authApi.forgotPassword(email);
      console.log(response.responseMessage);
      toast.success("Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư.");
      setEmail("");
    } catch (error) {
      console.error("Lỗi gửi email:", error);
      toast.error("Không thể gửi email. Vui lòng kiểm tra địa chỉ email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 400,
        mx: "auto",
        mt: 8,
        px: 2,
      }}
    >
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Quên mật khẩu
        </Typography>
        <Typography variant="body2">
          Nhập địa chỉ email của bạn để nhận link đặt lại mật khẩu.
        </Typography>

        <TextField
          fullWidth
          label="Nhập email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          sx={{ mt: 2 }}
        />

        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={handleReset}
          sx={{ mt: 2 }}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "Gửi link đặt lại mật khẩu"}
        </Button>
      </Paper>
    </Box>
  );
};

export default ForgotPassword;
