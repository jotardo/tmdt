import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
  Card,
  CardContent,
  Grid,
} from "@mui/material";
import AddCategoryModal from "../model/AddCategoryModal"; // Đảm bảo đúng path
import categoryApi from "../../backend/db/categoryApi";
import { Delete, Edit } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const CategoryManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.fetchAllCategories();
      console.log("Fetched categories:", response.data);
      setCategories(Array.isArray(response.data.categories) ? response.data.categories : []);
    } catch (error) {
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await categoryApi.deleteCategory(categoryId);
      toast.success("Xóa danh mục thành công");
      fetchCategories(); // Refresh
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
      toast.error("Xóa danh mục thất bại");
    }
  };


  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Quản lý Danh mục
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/category-warehouse")}
          sx={{
            textTransform: "none",
            borderColor: "#ccc",
            color: "#333",
            '&:hover': {
              backgroundColor: '#f5f5f5',
              borderColor: '#aaa'
            }
          }}
        >
          📦 Kho lưu trữ
        </Button>

        <Button
          variant="contained"
          onClick={() => setOpenModal(true)}
          sx={{
            textTransform: "none",
            borderColor: "#ccc",
            color: "#333",
            '&:hover': {
              backgroundColor: '#f5f5f5',
              borderColor: '#aaa'
            }
          }}
        >
          ➕ Thêm danh mục
        </Button>
      </Box>

      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>ID</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Tên</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Thumbnail</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Trạng thái</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }} align="center">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {categories.map((cat) => (
                <TableRow key={cat.id} sx={{ '&:hover': { backgroundColor: '#f5f5f5' } }}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>
                    <img
                      src={`${process.env.REACT_APP_BASE_URL}/category/${cat.thumbnail}`}
                      alt="Category Thumbnail"
                      style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={cat.status}
                      color={cat.status === "ACTIVE" ? "success" : "error"}
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton 
                      color="primary" 
                      onClick={() => {
                        setEditCategory(cat);
                        setOpenModal(true);
                      }}
                      sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}
                    >
                      <Edit />
                    </IconButton>

                    <IconButton 
                      color="error" 
                      onClick={() => handleDeleteCategory(cat.id)}
                      sx={{ '&:hover': { backgroundColor: '#ffebee' } }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AddCategoryModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          setEditCategory(null);
        }}
        onAddCategory={fetchCategories}
        editCategory={editCategory}
      />
    </Box>
  );
};

export default CategoryManagement;
