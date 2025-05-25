import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Avatar, Pagination, Box,
  Button
} from "@mui/material";
import { Block, Edit, EditAttributes, InfoRounded } from "@mui/icons-material";
import UserDetailModal from "../model/AdminUserDetailsModal";
import userApi from "../../backend/db/userApi";
//import response from "../../utils/demo/usersData"; // Giả lập dữ liệu từ server

const UsersTable = ({ resultsPerPage, filter }) => {
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
    userApi.getListUsers().then(result => {
      console.log("user lists:", result)
      setAPIData(result);
    })
  }, [])

  return (
    <Box>
      {/* Table */}
      <TableContainer sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Họ</TableCell>
              <TableCell>Tên</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Joined on</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Avatar sx={{ mr: 2 }} src={user.avatar} alt="User image" />
                </TableCell>
                <TableCell>
                  <p style={{ fontWeight: "bold" }}>{user.lastName}</p>
                </TableCell>
                <TableCell>
                  <span>{user.firstName}</span>
                </TableCell>
                <TableCell>
                  <span>{user.emailId}</span>
                </TableCell>
                <TableCell>
                  <span>
                    {new Date(user.createdAt).toLocaleDateString()}
                  </span>
                </TableCell>
                <TableCell>
                  <span>{user.role}</span>
                </TableCell>
                <TableCell>
                  <Button 
                  variant="outlined" 
                  size="small" 
                  color="info" 
                  onClick={() => {
                    setDetailID(user.id)
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

export default UsersTable;
