import React, { useContext, useEffect, useState } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Grid, InputLabel, Select, MenuItem, Box,
  FormControl
} from "@mui/material";
import categoryApi from "../../backend/db/categoryApi";
import { AuthContext, useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import productApi from "../../backend/db/productApi";

const AddProductModal = ({ open, onClose, onAddProduct, editProduct }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    brand: "",
    size: "",
    productMaterial: "",
    occasion: "",
    prevPrice: "",
    productIsBadge: "",
    status: "ACTIVE",
    // deleted: false,
    // productIsFavorite: false,
    // productIsCart: false,
    categoryId: "",
    ctvOrAdminId: user.id,
  });

  useEffect(() => {
    if (editProduct) {
      setForm({
        name: editProduct.name || "",
        description: editProduct.description || "",
        price: editProduct.price || "",
        brand: editProduct.brand || "",
        size: editProduct.size || "",
        productMaterial: editProduct.productMaterial || "",
        occasion: editProduct.occasion || "",
        prevPrice: editProduct.prevPrice || "",
        productIsBadge: editProduct.productIsBadge || "",
        status: editProduct.status || "ACTIVE",
        categoryId: editProduct.categoryId || "",
        ctvOrAdminId: user.id,
      });
    } else {
      setForm({
        name: "",
        description: "",
        price: "",
        brand: "",
        size: "",
        productMaterial: "",
        occasion: "",
        prevPrice: "",
        productIsBadge: "",
        status: "ACTIVE",
        categoryId: "",
        ctvOrAdminId: user.id,
      });
      setImages([]);
    }
  }, [editProduct, user.id]);
  

  console.log("User ID:", user.id);

  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryApi.fetchAllCategories();
      console.log("Fetched categories:", response.data.categories);
      setCategories(response.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 5) {
      alert("Chỉ được chọn tối đa 5 ảnh!");
    } else {
      setImages(files);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

  };

  

  const handleSubmit = async () => {
    const formData = new FormData();

    console.log("Category ID and CTV ID:", form.categoryId, form.ctvOrAdminId);
  
    // Validate trước
    if (!form.categoryId || !user.id) {
      toast.warning("Vui lòng nhập đầy đủ tên, danh mục, giá và người tạo.");
      return;
    }
  
    // Parse chính xác kiểu dữ liệu
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", parseFloat(form.price));
    formData.append("brand", form.brand);
    formData.append("size", form.size);
    formData.append("productMaterial", form.productMaterial);
    formData.append("occasion", form.occasion);
    formData.append("productIsBadge", form.productIsBadge);
    formData.append("prevPrice", form.prevPrice ? parseFloat(form.prevPrice) : 0);
    formData.append("status", form.status);
    formData.append("categoryId", parseInt(form.categoryId));
    formData.append("ctvOrAdminId", parseInt(user.id));
  
    // Append images
    images.forEach((img) => {
      formData.append("images", img);
    });
    try {
          let response;
          if (editProduct) {
            response = await productApi.updateCategory(editProduct.id, formData);
          } else {
            response = await productApi.addProduct(formData);
          }
          
          if (response.data?.success) {
            toast.success("Cập nhật thành công");
            onAddProduct();
            setForm({});
            setImages([]);
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
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>{editProduct ? "Chỉnh sửa danh mục" : "Thêm danh mục"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          {[
            { label: "Tên sản phẩm", name: "name" },
            { label: "Mô tả", name: "description", multiline: true },
            { label: "Giá", name: "price" },
            { label: "Thương hiệu", name: "brand" },
            { label: "Kích cỡ", name: "size" },
            { label: "Chất liệu", name: "productMaterial" },
            { label: "Dịp", name: "occasion" },
            { label: "Giá cũ", name: "prevPrice" },
            { label: "Phân loại badge", name: "productIsBadge" },
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

          {/* Category */}
          <Grid item xs={6}>
            <InputLabel>Danh mục</InputLabel>
            <Select
              fullWidth
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              displayEmpty
            >
              <MenuItem value="" disabled>
                Chọn danh mục
              </MenuItem>
              {categories.map((cat) => (
                <MenuItem key={cat.id} value={cat.id}>
                  {cat.name}
                </MenuItem>
              ))}
            </Select>
          </Grid>
          <Grid item xs={6}>
            <FormControl fullWidth>
              <InputLabel>Trạng thái</InputLabel>
              <Select
                name="status"
                value={form.status}
                onChange={handleChange}
                label="Trạng thái"
              >
                <MenuItem value="ACTIVE">Đang hoạt động</MenuItem>
                <MenuItem value="DEACTIVATED">Ngừng hoạt động</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          {/* Ảnh */}
          <Grid item xs={12}>
            <InputLabel sx={{ mb: 1 }}>Ảnh sản phẩm (tối đa 5)</InputLabel>
            <Button variant="outlined" component="label">
              Chọn ảnh
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={handleImageChange}
              />
            </Button>

            {images.length > 0 && (
              <Box sx={{ mt: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
                {images.map((img, i) => (
                  <Box key={i} sx={{
                    position: "relative", width: 100, height: 100,
                    borderRadius: 2, overflow: "hidden", boxShadow: 2,
                  }}>
                    <img
                      src={URL.createObjectURL(img)}
                      alt="preview"
                      style={{
                        width: "100%", height: "100%", objectFit: "cover"
                      }}
                    />
                    <Button
                      size="small"
                      onClick={() => {
                        const newImages = [...images];
                        newImages.splice(i, 1);
                        setImages(newImages);
                      }}
                      sx={{
                        minWidth: 0,
                        position: "absolute",
                        top: 4,
                        right: 4,
                        backgroundColor: "rgba(0,0,0,0.6)",
                        color: "#fff",
                        "&:hover": {
                          backgroundColor: "rgba(0,0,0,0.8)",
                        },
                      }}
                    >
                      ✕
                    </Button>
                  </Box>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Hủy</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {editProduct ? "Cập nhật" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
