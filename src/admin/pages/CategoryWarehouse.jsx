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
} from "@mui/material";
import { RestoreFromTrash, DeleteForever } from "@mui/icons-material";
import categoryApi from "../../backend/db/categoryApi";
import BackButton from "../../components/Button/BackButton";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CategoryWarehouse = () => {
  const [archivedCategories, setArchivedCategories] = useState([]);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchArchivedCategories();
  }, []);

  const fetchArchivedCategories = async () => {
    try {
      const response = await categoryApi.fetchAllDeletedCategories();
      setArchivedCategories(response.data.categories || []);
    } catch (err) {
      console.error("Failed to fetch deleted categories", err);
    }
  };

  console.log("Archived categories:", archivedCategories);
  

  const handleRestore = async (id) => {
    try {
      await categoryApi.restoreCategory(id);
      toast.success("Đã khôi phục danh mục");
      fetchArchivedCategories();
    } catch (err) {
      toast.error("Khôi phục thất bại");
      console.error(err);
    }
  };

  const handlePermanentDelete = async () => {
    try {
      await categoryApi.deleteCategoryPermanently(confirmDeleteId); // Giả sử có API này
      toast.success("Đã xóa vĩnh viễn");
      setConfirmDeleteId(null);
      fetchArchivedCategories();
    } catch (err) {
      toast.error("Xóa thất bại");
      console.error(err);
    }
  };

  return (
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: 600, mb: 2 }}>
        📦 Kho lưu trữ danh mục
      </Typography>

      <Box sx={{ display: 'flex', gap: 2 }}>
        <BackButton />
      </Box>

      <Card sx={{ boxShadow: 3 }}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Tên</strong></TableCell>
                <TableCell><strong>Thumbnail</strong></TableCell>
                <TableCell align="center"><strong>Trạng thái</strong></TableCell>
                <TableCell align="center"><strong>Hành động</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {archivedCategories.map((cat) => (
                <TableRow key={cat.id}>
                  <TableCell>{cat.id}</TableCell>
                  <TableCell>{cat.name}</TableCell>
                  <TableCell>
                    <img
                      src={`${process.env.REACT_APP_BASE_URL}/category/${cat.thumbnail}`}
                      alt="thumb"
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: 8,
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label="Đã xóa" color="default" size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="primary"
                      onClick={() => handleRestore(cat.id)}
                      sx={{ '&:hover': { backgroundColor: '#e3f2fd' } }}
                    >
                      <RestoreFromTrash />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setConfirmDeleteId(cat.id)}
                      sx={{ '&:hover': { backgroundColor: '#ffebee' } }}
                    >
                      <DeleteForever />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {archivedCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Không có danh mục đã xóa nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Xác nhận xóa vĩnh viễn */}
      <Dialog
        open={Boolean(confirmDeleteId)}
        onClose={() => setConfirmDeleteId(null)}
      >
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc muốn xóa vĩnh viễn danh mục này? Hành động này không thể hoàn tác.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Hủy</Button>
          <Button color="error" onClick={handlePermanentDelete}>
            Xóa vĩnh viễn
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoryWarehouse;
