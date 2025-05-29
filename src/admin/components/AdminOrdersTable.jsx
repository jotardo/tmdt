import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Avatar, Pagination, Box,
  Button
} from "@mui/material";
import { Block, Edit, EditAttributes, InfoRounded } from "@mui/icons-material";
import UserDetailModal from "../model/AdminUserDetailsModal";
import userApi from "../../backend/db/userApi";
import orderApi from "../../backend/db/orderApi";
//import response from "../../utils/demo/usersData"; // Giả lập dữ liệu từ server

const AdminOrdersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const [apiData, setAPIData] = useState([]);
  const [data, setData] = useState([]);

  const [detailVisible, setDetailVisible] = useState(false);
  const [detailID, setDetailID] = useState(-1);

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
    orderApi.fetchAllOrder().then(result => {
      console.log("yipee", result.data)
      setAPIData(result.data.orderDTOList);
    })
  }, [])

  return (
    <Box>
      {/* Table */}
      <TableContainer sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              {/* <TableCell>#</TableCell> */}
              <TableCell>Họ và tên</TableCell>
              <TableCell>Người nhận</TableCell>
              <TableCell>Địa chỉ giao hàng</TableCell>
              <TableCell>Số điện thoại liên lạc</TableCell>
              <TableCell>Tổng tiền</TableCell>
              <TableCell>Trạng thái đơn hàng</TableCell>
              <TableCell>Tác vụ</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((order, i) => (
              <TableRow key={i}>
                {/* <TableCell>
                  <Avatar sx={{ mr: 2 }} src={order.avatar} alt="User image" />
                </TableCell> */}
                <TableCell>
                  <p style={{ fontWeight: "bold" }}>{order.ownerName}</p>
                </TableCell>
                <TableCell>
                  <span>{order.deliveryAddress.receiverName}</span>
                </TableCell>
                <TableCell>
                  <span>
                    {order.deliveryAddress.buildingAddress}, {order.deliveryAddress.wardName}
                    <br />
                    {order.deliveryAddress.distrctName}, {order.deliveryAddress.provinceName}
                    ({order.deliveryAddress.workAddress ? "Văn phòng" : "Cá nhân"})
                  </span>
                </TableCell>
                <TableCell>
                  <span>
                    {order.deliveryAddress.contactNumber}
                  </span>
                </TableCell>
                <TableCell>
                  <span>{order.totalPrice}</span>
                </TableCell>
                <TableCell>
                  <span>{order.status}</span>
                </TableCell>
                <TableCell>
                  <Button 
                  variant="outlined" 
                  size="small" 
                  color="info" 
                  onClick={() => {
                    setDetailID(order.id)
                    setDetailVisible(true)
                  }}
                  >
                    <p>Chi tiết</p>
                  </Button>
                  <Button variant="outlined" size="small" color="secondary">
                    <p>Sửa</p>
                  </Button>
                  <Button variant="outlined" size="small" color="error">
                    <p>Cấm</p>
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
      <UserDetailModal
      open={detailVisible}
      onClose={() => setDetailVisible(false)}
      userID={detailID}
       />
    </Box>
  );
};

export default AdminOrdersTable;
