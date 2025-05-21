import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Avatar, Pagination, Box,
  Button
} from "@mui/material";
import { Block, Edit, EditAttributes, InfoRounded } from "@mui/icons-material";
import productApi from "../../backend/db/productApi";
import AddProductModal from "../model/AddProductModal";
import { toast } from "react-toastify";

const ProductsTable = ({ resultsPerPage, filter }) => {
  
  const handleAddProduct = (newProduct) => {
    productApi.addProduct(newProduct).then(result => {
      setAPIData((prev) => [...prev, result.data.product]);
    });
  };

  const [page, setPage] = useState(1);
  const [apiData, setAPIData] = useState([]);
  const [data, setData] = useState([]);

  const [detailVisible, setAddModalVisible] = useState(false);
  // const [detailID, setDetailID] = useState(-1);

  // pagination change control
  function onPageChange(event, p) {
    setPage(p);
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(apiData.slice((page - 1) * resultsPerPage, page * resultsPerPage));
  }, [page, resultsPerPage, filter, apiData]);


  useEffect(() => {
    productApi.fetchAllProducts().then((result) => setAPIData(result.data.productDTOs));
    toast.success("HUH?")
  }, [])

  return (
    <Box>
    
      <Button variant="contained" onClick={() => setAddModalVisible(true)} sx={{ mb: 2 }}>
        + Thêm sản phẩm
      </Button>
      {/* Table */}
      <TableContainer sx={{ mb: 3 }}>
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
                    {data != null && data.map((p) => (
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
        <TableFooter>
          <Pagination
            count={Math.ceil(apiData.length / resultsPerPage)}
            page={page}
            onChange={onPageChange}
            color="primary"
          />
        </TableFooter>
      </TableContainer>

      <AddProductModal
      open={detailVisible}
      onClose={() => setAddModalVisible(false)}
      onAddProduct={handleAddProduct}
       />
    </Box>
  );
};

export default ProductsTable;
