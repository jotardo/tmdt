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
} from "@mui/material";
import AddProductModal from "../model/AddProductModal"; // Đảm bảo đúng path
import productApi from "../../backend/db/productApi.js";

const ProductManagement = () => {
  const [openModal, setOpenModal] = useState(false);
  const [products, setProducts] = useState([]);

  const handleAddProduct = (newProduct) => {
    productApi.addNewProduct(newProduct).then(result => {
      setProducts((prev) => [...prev, result.product]);
    });
  };

  useEffect(() => {
    productApi.fetchAllProduct().then((result) => {
      setProducts(result.products)
    })
  }, [])

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý Sản phẩm
      </Typography>

      <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ mb: 2 }}>
        + Thêm sản phẩm
      </Button>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Giá</TableCell>
              <TableCell>Tồn kho</TableCell>
              <TableCell align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.price.toLocaleString()}₫</TableCell>
                <TableCell>{p.stock}</TableCell>
                <TableCell align="center">
                  <Button variant="outlined" size="small" sx={{ mr: 1 }}>
                    Sửa
                  </Button>
                  <Button variant="outlined" size="small" color="error">
                    Xóa
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <AddProductModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onAddProduct={handleAddProduct}
      />
    </Box>
  );
};

export default ProductManagement;
