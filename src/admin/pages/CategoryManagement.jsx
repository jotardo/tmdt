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
  CircularProgress,
  Skeleton,
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
      setCategories(Array.isArray(response.data.categories) ? response.data.categories : []);
    } catch (error) {
      toast.error("Lấy danh mục thất bại");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await categoryApi.deleteCategory(categoryId);
      toast.success("Xóa danh mục thành công");
      fetchCategories();
    } catch (error) {
      toast.error("Xóa danh mục thất bại");
    }
  };

  return (
    <Box sx={{ padding: 4, maxWidth: 1200, margin: "auto" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 3, color: "#222" }}
        component="h1"
      >
        Quản lý Danh mục
      </Typography>

      <Box
        sx={{
          display: "flex",
          gap: 2,
          mb: 3,
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        <Button
          variant="outlined"
          onClick={() => navigate("/admin/category-warehouse")}
          sx={{
            textTransform: "none",
            borderColor: "#b0bec5",
            color: "#546e7a",
            fontWeight: 600,
            '&:hover': {
              backgroundColor: "#eceff1",
              borderColor: "#90a4ae",
            },
            boxShadow: "0 1px 3px rgb(0 0 0 / 0.1)",
            borderRadius: 2,
          }}
        >
          📦 Kho lưu trữ
        </Button>

        <Button
          variant="contained"
          onClick={() => setOpenModal(true)}
          sx={{
            textTransform: "none",
            fontWeight: 700,
            background: "linear-gradient(45deg, #42a5f5, #478ed1)",
            boxShadow: "0 3px 5px 2px rgba(66, 165, 245, .3)",
            borderRadius: 2,
            '&:hover': {
              background: "linear-gradient(45deg, #3b8ddb, #3a7ecb)",
              boxShadow: "0 5px 15px 4px rgba(58, 126, 203, .5)",
            },
          }}
        >
          ➕ Thêm danh mục
        </Button>
      </Box>

      <Card
        sx={{
          boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
          borderRadius: 3,
          overflowX: "auto",
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="category table">
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              {["ID", "Tên", "Thumbnail", "Trạng thái", "Hành động"].map((headCell) => (
                <TableCell
                  key={headCell}
                  sx={{
                    fontWeight: 700,
                    color: "#37474f",
                    textTransform: "uppercase",
                    fontSize: "0.875rem",
                  }}
                  align={headCell === "Hành động" || headCell === "Trạng thái" ? "center" : "left"}
                >
                  {headCell}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading
              ? [...Array(5)].map((_, idx) => (
                  <TableRow key={idx}>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell><Skeleton variant="text" /></TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={50} height={50} />
                    </TableCell>
                    <TableCell align="center"><Skeleton variant="text" /></TableCell>
                    <TableCell align="center"><Skeleton variant="circular" width={40} height={40} /></TableCell>
                  </TableRow>
                ))
              : categories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center" sx={{ py: 5, color: "#90a4ae" }}>
                    Không có danh mục nào
                  </TableCell>
                </TableRow>
              ) : (
                categories.map((cat) => (
                  <TableRow
                    key={cat.id}
                    sx={{
                      transition: "background-color 0.3s ease",
                      '&:hover': { backgroundColor: "#f0f4f8" },
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      setEditCategory(cat);
                      setOpenModal(true);
                    }}
                  >
                    <TableCell>{cat.id}</TableCell>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>
                      <img
                        src={`${process.env.REACT_APP_BASE_URL}/category/${cat.thumbnail}`}
                        alt={cat.name}
                        style={{
                          width: 50,
                          height: 50,
                          borderRadius: 8,
                          objectFit: "cover",
                          boxShadow: "0 2px 8px rgb(0 0 0 / 0.1)",
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        label={cat.status.toLowerCase() === "active" ? "Hoạt động" : "Không hoạt động"}
                        color={cat.status.toLowerCase() === "active" ? "success" : "default"}
                        size="small"
                        sx={{ fontWeight: 600, textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell align="center" onClick={e => e.stopPropagation()}>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          setEditCategory(cat);
                          setOpenModal(true);
                        }}
                        sx={{
                          mr: 1,
                          '&:hover': { backgroundColor: "#e3f2fd" },
                          transition: "background-color 0.2s ease",
                        }}
                        aria-label={`Sửa danh mục ${cat.name}`}
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() => handleDeleteCategory(cat.id)}
                        sx={{
                          '&:hover': { backgroundColor: "#ffebee" },
                          transition: "background-color 0.2s ease",
                        }}
                        aria-label={`Xóa danh mục ${cat.name}`}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
          </TableBody>
        </Table>
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
