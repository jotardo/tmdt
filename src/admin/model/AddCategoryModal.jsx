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
import { Cancel } from "@mui/icons-material";
import categoryApi from "../../backend/db/categoryApi";
import { toast } from "react-toastify";

const AddCategoryModal = ({ open, onClose, onAddCategory, editCategory }) => {
  const [name, setName] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailEdit, setThumbnailEdit] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [status, setStatus] = useState("ACTIVE");

  useEffect(() => {
    if (editCategory) {
      setName(editCategory.name || "");
      setStatus(editCategory.status || "ACTIVE");
      if (editCategory.thumbnail) {
        setImagePreview(`${process.env.REACT_APP_BASE_URL}/category/${editCategory.thumbnail}`);
      } else {
        setImagePreview("");
      }
      // setThumbnailEdit(editCategory.thumbnail);
      setThumbnail(null); // reset thumbnail file
    } else {
      setName("");
      setStatus("ACTIVE");
      setThumbnail(null);
      setImagePreview("");
    }
  }, [editCategory]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(file);
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
    formData.append("status", status);
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    try {
      let response;
      if (editCategory) {
        response = await categoryApi.updateCategory(editCategory.id, formData);
      } else {
        response = await categoryApi.addCategory(formData);
      }

      if (response.data?.success) {
        toast.success(editCategory ? "Cập nhật danh mục thành công!" : "Thêm danh mục thành công!");
        onAddCategory();
        onClose();
      } else {
        toast.error("Thao tác thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi submit:", error);
      toast.error("Đã xảy ra lỗi!");
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{editCategory ? "Chỉnh sửa danh mục" : "Thêm danh mục"}</DialogTitle>
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
            <img src={imagePreview} alt="preview" style={{ width: "25%", borderRadius: 8 }} />
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
            <input type="file" accept="image/*" hidden onChange={handleImageChange} />
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
            <MenuItem value="DEACTIVATED">Ngừng hoạt động</MenuItem>
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editCategory ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCategoryModal;
