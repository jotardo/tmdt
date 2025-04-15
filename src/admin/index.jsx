import React from "react";
import { Box, Toolbar } from "@mui/material";
import Sidebar from "./components/Sidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar /> {/* tránh đè AppBar nếu có */}
        <Outlet /> {/* render nội dung như Dashboard, Orders ở đây */}
      </Box>
    </Box>
  );
};

export default AdminLayout;
