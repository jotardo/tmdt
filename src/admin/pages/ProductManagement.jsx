import React, { useEffect, useState } from "react";
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
  Chip,
  TableContainer,
  IconButton,
  Tooltip,
  useTheme,
  Grid,
} from "@mui/material";
import AddProductModal from "../model/AddProductModal";
import productApi from "../../backend/db/productApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ProductsTable from "../components/ProductsTable";
import { useData } from "../../context/DataContext";

const ProductManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);

  const { backendData, getBackendData:reloadProduct} = useData();

  const products = backendData.productsData;
  const navigate = useNavigate();

  const theme = useTheme();

  
  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      reloadProduct();
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (formData) => {
    try {
      await productApi.addProduct(formData);
      setOpenModal(false);
      fetchAllProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteProduct = async (productId) => {
      try {
        await productApi.deleteProduct(productId);
        toast.success("Xóa sản phẩm thành công");
        fetchAllProducts();
      } catch (error) {
        console.error("Lỗi khi xóa sản phẩm:", error);
        toast.error("Xóa sản phẩm thất bại");
      }
    };

  const handleHeaderClick = (headCell) => {
    setEditProduct(headCell);
    setOpenModal(true);
  }

  const handleEditClick = (product) =>{
    setEditProduct(product);
    setOpenModal(true);
  }

  useEffect(() => {
    fetchAllProducts();
  }, []);

  return (
    <Box sx={{ p: 3, bgcolor: "#f9fafb", overflow: "scroll" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: 700, mb: 3, color: theme.palette.primary.main, letterSpacing: 1 }}
      >
        Quản lý Sản phẩm
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
          onClick={() => navigate("/admin/product-warehouse")}
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
          ➕ Thêm sản phẩm
        </Button>
      </Box>

      <ProductsTable resultsPerPage={10} loading={loading} apiData={products} onDelete={handleDeleteProduct} onHeaderClick={handleHeaderClick} onEditClick={handleEditClick} />
      <AddProductModal open={openModal} onClose={() => setOpenModal(false)} onAddProduct={handleAddProduct} editProduct={editProduct} />
    </Box>
  );
};

export default ProductManagement;
