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

const CategoryManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const [categories, setCategories] = useState([]);
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
      console.error("Failed to fetch categories", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle thêm danh mục
  const handleAddCategory = (newCategory) => {
    setCategories((prev) => [...prev, newCategory]);
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        Quản lý Danh mục
      </Typography>

      <Button 
        variant="contained" 
        onClick={() => setOpenModal(true)} 
        sx={{ mb: 3, boxShadow: 3, '&:hover': { boxShadow: 6 } }}
      >
        + Thêm danh mục
      </Button>

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
                      sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton 
                      color="error" 
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
        onClose={() => setOpenModal(false)}
        onAddCategory={fetchCategories}
      />
    </Box>
  );
};

export default CategoryManagement;
