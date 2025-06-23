import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Avatar, Pagination, Box,
  Button,
  useTheme,
  Chip,
  Tooltip,
  IconButton
} from "@mui/material";
import { Block, Delete, Edit, EditAttributes, InfoRounded } from "@mui/icons-material";
import productApi from "../../backend/db/productApi";
import AddProductModal from "../model/AddProductModal";
import { toast } from "react-toastify";

const ProductsTable = ({ apiData, resultsPerPage, filter, loading, onDelete, onHeaderClick, onEditClick }) => {
  const theme = useTheme();

  /** paging variable: apiData = productList
   *  data = paged
   */
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);

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

  console.log("Data ", data);
  

  return (
    <Box 
        elevation={3}
        sx={{
          borderRadius: 3,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
        }}>
      {/* Table */}
      
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
            }
          }}
        >
          <Table stickyHeader size="small" style={{overflow: "hidden",}} >
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
                      onHeaderClick(headCell)
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
              ) : data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 4 }}>
                    Không có sản phẩm nào
                  </TableCell>
                </TableRow>
              ) : (
                data.map((p) => (
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
                        label={p.status === "Active" ? "Hoạt động" : "Không hoạt động"}
                        color={p.status === "Active" ? "success" : "default"}
                        size="small"
                        sx={{ fontWeight: 600, textTransform: "capitalize" }}
                      />
                    </TableCell>
                    <TableCell>{p.userAddID}</TableCell>
                    <TableCell align="center" sx={{ whiteSpace: "nowrap" }}>
                      <Tooltip title="Chỉnh sửa">
                        <IconButton
                          color="primary"
                          onClick={() => {
                            onEditClick(p);
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
                          onClick={() => onDelete(p.id)}
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
        <TableFooter>
          <Pagination
            count={Math.ceil(apiData.length / resultsPerPage)}
            page={page}
            onChange={onPageChange}
          />
        </TableFooter>
        </TableContainer>
      

    </Box>
  );
};

export default ProductsTable;
