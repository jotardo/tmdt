import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import { v4 as uuid } from "uuid";

const AddProductModal = ({ open, onClose, onAddProduct }) => {

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    brand: "",
    color: "",
    size: "",
    material: "",
    occasion: "",
    prevPrice: "",
    productIsBadge: "",
  });

  const [images, setImages] = useState([]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Chỉ được chọn tối đa 5 ảnh!");
    } else {
      setImages(files);
    }
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = () => {
    const newProduct = {
      _id: uuid(),
      ...form,
      product_image: images.map((file) => URL.createObjectURL(file)), // simulate
    };
    onAddProduct(newProduct);
    setForm({});
    setImages([]);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Thêm sản phẩm</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {[
            { label: "Tên sản phẩm", name: "name" },
            { label: "Mô tả", name: "description", multiline: true },
            { label: "Giá", name: "price" },
            { label: "Danh mục", name: "category" },
            { label: "Thương hiệu", name: "brand" },
            { label: "Màu sắc", name: "color" },
            { label: "Kích cỡ", name: "size" },
            { label: "Chất liệu", name: "material" },
            { label: "Dịp", name: "occasion" },
            { label: "Giá cũ", name: "prevPrice" },
            { label: "Phân loại", name: "productIsBadge" },
          ].map((field, i) => (
            <Grid item xs={6} key={i}>
              <TextField
                fullWidth
                label={field.label}
                name={field.name}
                value={form[field.name] || ""}
                onChange={handleChange}
                multiline={field.multiline || false}
                rows={field.multiline ? 3 : 1}
              />
            </Grid>
          ))}

          {/* <Grid item xs={6}>
            <InputLabel>Yêu thích</InputLabel>
            <Select
              fullWidth
              name="product_isFavorite"
              value={form.product_isFavorite}
              onChange={handleChange}
            >
              <MenuItem value="true">Có</MenuItem>
              <MenuItem value="false">Không</MenuItem>
            </Select>
          </Grid> */}
          {/* <Grid item xs={6}>
            <InputLabel>Trong giỏ</InputLabel>
            <Select
              fullWidth
              name="product_isCart"
              value={form.product_isCart}
              onChange={handleChange}
            >
              <MenuItem value="true">Có</MenuItem>
              <MenuItem value="false">Không</MenuItem>
            </Select>
          </Grid> */}

          <Grid item xs={12}>
            <InputLabel>Ảnh sản phẩm (tối đa 5)</InputLabel>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            {images.length > 0 && (
              <Box sx={{ mt: 1, display: "flex", gap: 1, flexWrap: "wrap" }}>
                {images.map((img, i) => (
                  <img
                    key={i}
                    src={URL.createObjectURL(img)}
                    alt="preview"
                    width={100}
                    height={100}
                    style={{ objectFit: "cover", borderRadius: 8 }}
                  />
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Thêm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
