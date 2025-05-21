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
import { toast } from "react-toastify";
import ProductsTable from "../components/ProductsTable.jsx";

const ProductManagement = () => {

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" gutterBottom>
        Quản lý Sản phẩm
      </Typography>

      <ProductsTable resultsPerPage={5} />
    </Box>
  );
};

export default ProductManagement;
