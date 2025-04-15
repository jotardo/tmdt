import React, { useState, useEffect } from "react";
import {
  Avatar,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableFooter,
  Paper,
  TablePagination,
  Typography,
} from "@mui/material";

import response from "../utils/demo/ordersData";

const getStatusColor = (status) => {
  switch (status) {
    case "Un-paid":
      return "error";
    case "Paid":
      return "success";
    case "Completed":
      return "warning";
    default:
      return "default";
  }
};

const OrdersTable = ({ resultsPerPage = 10, filter = "" }) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  const filteredData = response.filter((order) => {
    if (filter === "paid") return order.status === "Paid";
    if (filter === "un-paid") return order.status === "Un-paid";
    if (filter === "completed") return order.status === "Completed";
    return true;
  });

  const paginatedData = filteredData.slice(
    page * resultsPerPage,
    page * resultsPerPage + resultsPerPage
  );

  useEffect(() => {
    setData(paginatedData);
  }, [page, resultsPerPage, filter]);

  const handleChangePage = (_, newPage) => {
    setPage(newPage);
  };

  return (
    <TableContainer component={Paper} sx={{ mb: 4 }}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell><b>Client</b></TableCell>
            <TableCell><b>Order ID</b></TableCell>
            <TableCell><b>Amount</b></TableCell>
            <TableCell><b>Status</b></TableCell>
            <TableCell><b>Date</b></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((user, i) => (
            <TableRow key={i}>
              <TableCell>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <Avatar src={user.avatar} alt={user.name} />
                  <Typography variant="body2">{user.name}</Typography>
                </div>
              </TableCell>
              <TableCell>#000{i}</TableCell>
              <TableCell>$ {user.amount}</TableCell>
              <TableCell>
                <Chip label={user.status} color={getStatusColor(user.status)} />
              </TableCell>
              <TableCell>
                {new Date(user.date).toLocaleDateString()}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[resultsPerPage]}
              count={filteredData.length}
              rowsPerPage={resultsPerPage}
              page={page}
              onPageChange={handleChangePage}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OrdersTable;
