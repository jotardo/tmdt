import React, { useState } from "react";
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
import { Cancel } from "@mui/icons-material";
import categoryApi from "../../backend/db/categoryApi"; // Đảm bảo đúng đường dẫn đến file categoryApi.js
import { toast } from "react-toastify";

const AddCategoryModal = ({ open, onClose, onAddCategory }) => {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("ACTIVE"); // mặc định ACTIVE

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file); // ✅ Đúng: lưu object file
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setThumbnail(null);
    setImagePreview("");
  };

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("thumbnail", thumbnail);
    formData.append("status", status);

    try {
      const response = await categoryApi.addCategory(formData);
      if (response.data?.success) {
        toast.success("Thêm danh mục thành công!");
        onAddCategory(); // Gọi callback để refetch
        onClose(); // Đóng modal
      } else {
        toast.error("Thêm danh mục thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi thêm danh mục:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Thêm danh mục</DialogTitle>
      <DialogContent>
        <TextField
          label="Tên danh mục"
          fullWidth
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        {imagePreview ? (
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
        )}

        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>Trạng thái</InputLabel>
          <Select
            value={status}
            label="Trạng thái"
            onChange={(e) => setStatus(e.target.value)}
          >
            <MenuItem value="ACTIVE">Đang hoạt động</MenuItem>
            <MenuItem value="INACTIVE">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryModal;
