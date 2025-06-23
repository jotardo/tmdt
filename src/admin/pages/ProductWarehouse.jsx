import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TableContainer,
  useTheme,
} from "@mui/material";
import { RestoreFromTrash, DeleteForever } from "@mui/icons-material";
import productApi from "../../backend/db/productApi";
import BackButton from "../../components/Button/BackButton";
import { toast } from "react-toastify";

const ProductWarehouse = () => {
  const [archivedProducts, setArchivedProducts] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const theme = useTheme();

  useEffect(() => {
    fetchArchivedProducts();
  }, []);

  const fetchArchivedProducts = async () => {
    try {
      const response = await productApi.fetchAllDeletedProducts();
      console.log("Fetched archived products:", response.data);
      // Giả sử response.data.products chứa danh sách sản phẩm đã xóa
      setArchivedProducts(response.data || []);
    } catch (err) {
      toast.error("Không thể tải kho lưu trữ sản phẩm");
      console.error("Failed to fetch deleted products", err);
    }
  };

  const handleRestore = async (id) => {
    try {
      await productApi.restoreProduct(id);
      toast.success("Đã khôi phục danh mục");
      fetchArchivedProducts();
    } catch (err) {
      toast.error("Khôi phục thất bại");
      console.error(err);
    }
  };

  const handlePermanentDelete = async (id) => {
    try {
      await productApi.deleteProductPermanently(id);
      toast.success("Đã xóa vĩnh viễn");
      setConfirmDeleteId(null);
      fetchArchivedProducts();
    } catch (err) {
      toast.error("Xóa thất bại");
      console.error(err);
    }
  };

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", bgcolor: "#f9fafb" }}>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, color: theme.palette.primary.main }}>
        📦 Kho lưu trữ sản phẩm
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <BackButton />
      </Box>

      <Card elevation={3} sx={{ borderRadius: 3 }}>
        <TableContainer
          sx={{
            maxHeight: 600,
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
          <Table stickyHeader>
            <TableHead sx={{ bgcolor: "#e3f2fd" }}>
              <TableRow>
                {[
                  "ID",
                  "Tên",
                  "Giá hiện tại",
                  "Giá trước đó",
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
                  >
                    {headCell}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>

            <TableBody>
              {archivedProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    Không có sản phẩm đã lưu trữ
                  </TableCell>
                </TableRow>
              ) : (
                archivedProducts.map((p) => (
                  <TableRow key={p.id} hover sx={{ cursor: "default" }}>
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
                        label="Đã xóa"
                        color="default"
                        size="small"
                        sx={{ fontWeight: 600, textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>{p.userAddID}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <IconButton
                        color="primary"
                        onClick={() => handleRestore(p.id)}
                        sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}
                      >
                        <RestoreFromTrash />
                      </IconButton>
                        <IconButton
                        color="error"
                        onClick={() => setConfirmDeleteId(p.id)}
                        sx={{ '&:hover': { backgroundColor: '#ffebee' } }}
                      >
                        <DeleteForever />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Dialog confirm xóa vĩnh viễn */}
      <Dialog
        open={!!confirmDeleteId}
        onClose={() => setConfirmDeleteId(null)}
        aria-labelledby="confirm-delete-title"
      >
        <DialogTitle id="confirm-delete-title">Xác nhận xóa vĩnh viễn</DialogTitle>
        <DialogContent>
          <DialogContentText>Bạn có chắc chắn muốn xóa sản phẩm này vĩnh viễn? Hành động này không thể hoàn tác.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Hủy</Button>
          <Button color="error" onClick={handlePermanentDelete} variant="contained">
            Xóa
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ProductWarehouse;
