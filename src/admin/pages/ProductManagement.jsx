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
} from "@mui/material";
import AddProductModal from "../model/AddProductModal";
import { Delete, Edit } from "@mui/icons-material";
import productApi from "../../backend/db/productApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import productApi from "../../backend/db/productApi.js";
import { toast } from "react-toastify";
import ProductsTable from "../components/ProductsTable.jsx";

const ProductManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  const theme = useTheme();
  

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.fetchAllProducts();
      toast.success(response.data.message);
      setProducts(response.data.productDTOs);
    } catch (error) {
      toast.error("Không thể tải danh sách sản phẩm");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

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

  return (
    <Box sx={{ padding: 4, maxWidth: "100%", bgcolor: "#f9fafb", minHeight: "100vh" }}>
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

      <Paper
        elevation={3}
        sx={{
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}
      >
        <TableContainer
          sx={{
            maxHeight: 550,
            "&::-webkit-scrollbar": {
              height: 8,
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#90caf9",
              borderRadius: 2,
            },
            "&::-webkit-scrollbar-track": {
              backgroundColor: "#e3f2fd",
            },
          }}
        >
          <Table stickyHeader size="medium" sx={{ minWidth: 900 }}>
            <TableHead sx={{ bgcolor: "#e3f2fd" }}>
              <TableRow>
                {[
                  "ID",
                  "Tên",
                  "Giá hiện tại",
                  "Giá trước",
                  "Thương hiệu",
                  "Kích thước",
                  "Chất liệu",
                  "Dịp sử dụng",
                  "Trạng thái",
                  "Người tạo",
                  "Hành động",
                ].map((headCell) => (
                  <TableCell
                    key={headCell}
                    sx={{
                      fontWeight: 700,
                      color: theme.palette.primary.dark,
                      borderBottom: "2px solid #90caf9",
                    }}
                    align={headCell === "Hành động" ? "center" : "left"}
                    onClick={() => {
                      setEditProduct(headCell);
                      setOpenModal(true);
                    }}
                  >
                    {headCell}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    Đang tải dữ liệu...
                  </TableCell>
                </TableRow>
              ) : products.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    Không có sản phẩm nào
                  </TableCell>
                </TableRow>
              ) : (
                products.map((p) => (
                  <TableRow
                    key={p.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: "#f1f9ff",
                        cursor: "pointer",
                        transition: "background-color 0.3s ease",
                      },
                    }}
                  >
                    <TableCell>{p.id}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell>{p.price?.toLocaleString()}₫</TableCell>
                    <TableCell>{p.prevPrice?.toLocaleString()}₫</TableCell>
                    <TableCell>{p.brand}</TableCell>
                    <TableCell>{p.size}</TableCell>
                    <TableCell>{p.productMaterial}</TableCell>
                    <TableCell>{p.occasion}</TableCell>
                    <TableCell>
                      <Chip
                        label={p.status.toLowerCase() === "active" ? "Hoạt động" : "Không hoạt động"}
                        color={p.status.toLowerCase() === "active" ? "success" : "default"}
                        size="small"
                        sx={{ fontWeight: 600, textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>{p.ctvOrAdminId}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            setEditProduct(p);
                            setOpenModal(true);
                          }}
                          sx={{
                            mr: 1,
                            '&:hover': { backgroundColor: "#e3f2fd" },
                            transition: "background-color 0.2s ease",
                          }}
                          aria-label={`Sửa danh mục ${p.name}`}
                        >
                          <Edit />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Xóa">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteProduct(p.id)}
                          sx={{
                            transition: "background-color 0.3s",
                            "&:hover": { backgroundColor: "#ffebee" },
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <AddProductModal open={openModal} onClose={() => setOpenModal(false)} onAddProduct={handleAddProduct} editProduct={editProduct} />
    </Box>
  );
};

export default ProductManagement;
