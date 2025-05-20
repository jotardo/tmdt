import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import userApi from "../../backend/db/userApi";

/** onType = {detail, update, remove?} */
const UserDetailModal = ({ open, onClose, onType, userID }) => {

  const [user, setUser] = useState({});
  
  // Upon login, request a get info request to set user
  // Since this works using promise, setUser is set here
  const requestUserInfo = (user_id) => {
    userApi.getDetail(user_id).then(userDetails => {
      setUser(userDetails.data)
    });
  }

  useEffect(() => {
    if (open)
    requestUserInfo(userID)
  }, [open, userID])

  // const [thumbnail, setThumbnail] = useState(null);
  // const [imagePreview, setImagePreview] = useState("");
  // const [status, setStatus] = useState("ACTIVE"); // mặc định ACTIVE

  // const handleImageChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setThumbnail(file); // ✅ Đúng: lưu object file
  //     setImagePreview(URL.createObjectURL(file));
  //   }
  // };

  // const handleRemoveImage = () => {
  //   setThumbnail(null);
  //   setImagePreview("");
  // };

  // const handleSubmit = async () => {
  //   const formData = new FormData();
  //   formData.append("name", name);
  //   formData.append("thumbnail", thumbnail);
  //   formData.append("status", status);

  //   try {
  //     const response = await categoryApi.addCategory(formData);
  //     if (response.data?.success) {
  //       toast.success("Thêm danh mục thành công!");
  //       onRefetch(); // Gọi callback để refetch
  //       onClose(); // Đóng modal
  //     } else {
  //       toast.error("Thêm danh mục thất bại!");
  //     }
  //   } catch (error) {
  //     console.error("Lỗi khi thêm danh mục:", error);
  //   }
  // };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {onType == "update" && "Cập nhật "}Thông tin người dùng
      </DialogTitle>
      <DialogContent>
        <TextField
          label="Họ"
          contentEditable="false"
          fullWidth
          value={user.lastName}
          // onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Tên"
          contentEditable="false"
          fullWidth
          value={user.firstName}
          // onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email"
          contentEditable="false"
          fullWidth
          value={user.emailId}
          // onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="SĐT"
          contentEditable="false"
          fullWidth
          value={user.phoneNo}
          // onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />
        <TextField
          label="Quyền hạn"
          contentEditable="false"
          fullWidth
          value={user.role}
          // onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        {/* {imagePreview ? (
          <Box sx={{ position: "relative", mb: 2 }}>
            <img
              src={imagePreview}
              alt="preview"
              style={{ width: "25%", borderRadius: 8 }}
            />
            <IconButton
              onClick={handleRemoveImage}
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                backgroundColor: "white",
              }}
            >
              <Cancel color="error" />
            </IconButton>
          </Box>
        ) : (
          <Button variant="contained" component="label" sx={{ mb: 2 }}>
            Chọn ảnh
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
        )} */}

        {/* <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            label="Trạng thái"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="ACTIVE">Đang hoạt động</MenuItem>
            <MenuItem value="INACTIVE">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl> */}
      </DialogContent>
      <DialogActions>
        {/* <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Thêm
        </Button> */}
      </DialogActions>
    </Dialog>
  );
};

export default UserDetailModal;
