import React, { useState, useEffect } from "react";
import {
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableFooter, Avatar, Pagination, Box
} from "@mui/material";
import { userListService } from "../../services/adminService/userService";
import userAdminApi from "../../backend/db/adminUserApi";
//import response from "../../utils/demo/usersData"; // Giả lập dữ liệu từ server

const UsersTable = ({ resultsPerPage, filter }) => {
  const [page, setPage] = useState(1);
  const [apiData, setAPIData] = useState([]);
  const [data, setData] = useState([]);

  // pagination setup
  let response = [];
  const totalResults = response.length;

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
    
    const getList = async () => {
      let response = await userAdminApi.listUsers();
      return response;
    }
    setAPIData(getList());
  })


  return (
    <Box>
      {/* Table */}
      <TableContainer sx={{ mb: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>First Name</TableCell>
              <TableCell>Last Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Joined on</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Avatar sx={{ mr: 2 }} src={user.avatar} alt="User image" />
                    <div>
                      <p style={{ fontWeight: "bold" }}>{user.first_name}</p>
                    </div>
                  </Box>
                </TableCell>
                <TableCell>
                  <span>{user.last_name}</span>
                </TableCell>
                <TableCell>
                  <span>{user.email}</span>
                </TableCell>
                <TableCell>
                  <span>
                    {new Date(user.joined_on).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            count={Math.ceil(totalResults / resultsPerPage)}
            page={page}
            onChange={onPageChange}
            color="primary"
          />
        </TableFooter>
      </TableContainer>
    </Box>
  );
};

export default UsersTable;
