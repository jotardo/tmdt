import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Button,
  Alert,
  Stack,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import authApi from "../../backend/db/authApi";

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState("loading");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    const verify = async () => {
        try {
          const res = await authApi.verifyEmail(token);
          console.log("API Response 1:", res); 
          console.log("API Response 2:", res.success); 
          if (res.success) {
            setStatus("success");
          } else {
            setStatus("error");
          }
        } catch (error) {
          console.error("API Error:", error);
          setStatus("error");
        }
      };
      
    verify();
  }, [token]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <Stack alignItems="center" spacing={2}>
            <CircularProgress />
            <Typography color="text.secondary">Đang xác nhận email...</Typography>
          </Stack>
        );
      case "success":
        return (
          <Stack spacing={2} alignItems="center" textAlign="center">
            <CheckCircleIcon color="success" sx={{ fontSize: 48 }} />
            <Typography variant="h5" color="success.main">
              Xác nhận email thành công!
            </Typography>
            <Typography color="text.secondary">
              Bạn đã xác thực tài khoản thành công, hãy đăng nhập để tiếp tục.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/login")}
            >
              Đăng nhập ngay
            </Button>
          </Stack>
        );
      case "error":
        return (
          <Stack spacing={2} alignItems="center" textAlign="center">
            <ErrorIcon color="error" sx={{ fontSize: 48 }} />
            <Typography variant="h5" color="error.main">
              Xác nhận email thất bại!
            </Typography>
            <Typography color="text.secondary">
              Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu xác nhận lại.
            </Typography>
            <Button
              variant="contained"
              color="error"
              onClick={() => navigate("/resend-confirmation")}
            >
              Gửi lại email xác nhận
            </Button>
          </Stack>
        );
      case "invalid":
        return (
          <Stack spacing={2} alignItems="center" textAlign="center">
            <WarningAmberIcon color="warning" sx={{ fontSize: 48 }} />
            <Typography variant="h5" color="warning.main">
              Liên kết không hợp lệ!
            </Typography>
            <Typography color="text.secondary">
              Không tìm thấy mã xác thực. Vui lòng kiểm tra lại email của bạn.
            </Typography>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f5f5f5"
      px={2}
    >
      <Card sx={{ maxWidth: 400, width: "100%", boxShadow: 3 }}>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </Box>
  );
};

export default VerifyEmail;
