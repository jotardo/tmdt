import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  Box,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { Cancel } from "@mui/icons-material";
import axios from "axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";
import categoryApi from "../../../backend/db/categoryApi";

const CreateAuction = ({ open, onClose, onAddProduct }) => {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    material: "",
    size: "",
    occasion: "",
    prevPrice: "",
    productIsFavorite: false,
    productIsCart: false,
    productIsBadge: "",
    categoryId: "",
    ctvOrAdminId: user?.id || "",
    status: "OPEN",
  });
  console.log("User ID:", user?.id);
  
  const [errors, setErrors] = useState({});
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [categoryLoading, setCategoryLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoryLoading(true);
        const response = await categoryApi.fetchAllCategories();
        setCategories(response.data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
        toast.error("Không thể tải danh mục!");
      } finally {
        setCategoryLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
 setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("Tối đa 5 hình ảnh!");
      return;
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setImagePreviews((prev) => [...prev, ...newPreviews]);
    setErrors((prev) => ({ ...prev, images: "" }));
  };

  const handleRemoveImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Tên sản phẩm là bắt buộc";
    if (!formData.description.trim()) newErrors.description = "Mô tả là bắt buộc";
    if (!formData.price || formData.price <= 0) newErrors.price = "Giá phải lớn hơn 0";
    if (!formData.categoryId) newErrors.categoryId = "Vui lòng chọn danh mục";
    if (images.length === 0) newErrors.images = "Vui lòng chọn ít nhất một hình ảnh";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      toast.error("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    setSubmitting(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("price", formData.price);
      data.append("productMaterial", formData.productMaterial);
      data.append("size", formData.size);
      data.append("occasion", formData.occasion);
      data.append("prevPrice", formData.prevPrice || 0);
      data.append("productIsFavorite", formData.productIsFavorite);
      data.append("productIsCart", formData.productIsCart);
      data.append("productIsBadge", formData.productIsBadge);
      data.append("status", formData.status);
      data.append("categoryId", parseInt(formData.categoryId));
      data.append("ctvOrAdminId", parseInt(formData.ctvOrAdminId));

      images.forEach((image) => {
        data.append("images", image);
      });

      const response = await axios.post("http://localhost:8080/api/reverse-auction/add", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data) {
        toast.success("Thêm sản phẩm đấu giá thành công!");
        onAddProduct(response.data);
        onClose();
        setFormData({
          name: "",
          description: "",
          price: "",
          productMaterial: "",
          size: "",
          occasion: "",
          prevPrice: "",
          productIsFavorite: false,
          productIsCart: false,
          productIsBadge: "",
          categoryId: "",
          ctvOrAdminId: user?.id || "",
          status: "OPEN",
        });
        setImages([]);
        setImagePreviews([]);
        setErrors({});
      } else {
        toast.error("Thêm sản phẩm thất bại!");
      }
    } catch (error) {
      console.error("Lỗi khi submit:", error);
      toast.error(error.response?.data?.message || "Đã xảy ra lỗi!");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="md"
      sx={{ '& .MuiDialog-paper': { borderRadius: 2 } }}
    >
      <DialogTitle sx={{ bgcolor: '#1976d2', color: 'white', fontWeight: 600 }}>
        Thêm Sản Phẩm Đấu Giá
      </DialogTitle>
      <DialogContent sx={{ p: 3, bgcolor: '#f5f7fa' }}>
        <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                label="Tên sản phẩm"
                name="name"
                fullWidth
                value={formData.name}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ bgcolor: 'white' }}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Mô tả"
                name="description"
                fullWidth
                multiline
                rows={4}
                value={formData.description}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ bgcolor: 'white' }}
                error={!!errors.description}
                helperText={errors.description}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Giá (VND)"
                name="price"
                type="number"
                fullWidth
                value={formData.price}
                onChange={handleInputChange}
                required
                variant="outlined"
                sx={{ bgcolor: 'white' }}
                error={!!errors.price}
                helperText={errors.price}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Giá trước đây (VND)"
                name="prevPrice"
                type="number"
                fullWidth
                value={formData.prevPrice}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ bgcolor: 'white' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Vật liệu"
                name="productMaterial"
                fullWidth
                value={formData.productMaterial}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ bgcolor: 'white' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kích thước"
                name="size"
                fullWidth
                value={formData.size}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ bgcolor: 'white' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Dịp sử dụng"
                name="occasion"
                fullWidth
                value={formData.occasion}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ bgcolor: 'white' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Badge"
                name="productIsBadge"
                fullWidth
                value={formData.productIsBadge}
                onChange={handleInputChange}
                variant="outlined"
                sx={{ bgcolor: 'white' }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ bgcolor: 'white' }} error={!!errors.categoryId}>
                <InputLabel>Danh mục</InputLabel>
                <Select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleInputChange}
                  label="Danh mục"
                  disabled={categoryLoading}
                >
                  <MenuItem value="" disabled>
                    {categoryLoading ? "Đang tải..." : "Chọn danh mục"}
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
                {errors.categoryId && <Typography color="error" variant="caption">{errors.categoryId}</Typography>}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth variant="outlined" sx={{ bgcolor: 'white' }}>
                <InputLabel>Trạng thái</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Trạng thái"
                  onChange={handleInputChange}
                >
                  <MenuItem value="OPEN">Mở đấu giá</MenuItem>
                  <MenuItem value="IN_PROGRESS">Đang xử lý</MenuItem>
                  <MenuItem value="CLOSED">Đã đóng</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <Button 
                variant="contained" 
                component="label"
                sx={{
                  bgcolor: '#1976d2',
                  '&:hover': { bgcolor: '#1565c0' },
                  textTransform: 'none'
                }}
                disabled={submitting}
              >
                Chọn ảnh
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {errors.images && <Typography color="error" variant="caption" sx={{ mt: 1 }}>{errors.images}</Typography>}
              {imagePreviews.length > 0 && (
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  {imagePreviews.map((preview, index) => (
                    <Grid item key={index}>
                      <Box sx={{ position: "relative" }}>
                        <img
                          src={preview}
                          alt={`preview-${index}`}
                          style={{ 
                            width: "120px", 
                            height: "120px", 
                            objectFit: "cover", 
                            borderRadius: 8,
                            border: '1px solid #e0e0e0'
                          }}
                        />
                        <IconButton
                          onClick={() => handleRemoveImage(index)}
                          sx={{
                            position: "absolute",
                            top: -8,
                            right: -8,
                            bgcolor: 'white',
                            '&:hover': { bgcolor: '#ffebee' }
                          }}
                        >
                          <Cancel color="error" />
                        </IconButton>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Grid>
          </Grid>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: 3, bgcolor: '#f5f7fa' }}>
        <Button 
          onClick={onClose}
          sx={{ textTransform: 'none', color: '#666' }}
          disabled={submitting}
        >
          Hủy
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained"
          disabled={submitting}
          sx={{ 
            textTransform: 'none',
            bgcolor: '#1976d2',
            '&:hover': { bgcolor: '#1565c0' }
          }}
        >
          {submitting ? <CircularProgress size={24} /> : 'Thêm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CreateAuction;