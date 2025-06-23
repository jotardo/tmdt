import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import GavelIcon from '@mui/icons-material/Gavel';
import { useNavigate } from "react-router-dom";
import { Category, Inbox, Inventory } from "@mui/icons-material";

const Sidebar = () => {
  const navigate = useNavigate();

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/admin/dashboard" },
    { text: "Orders", icon: <ShoppingCartIcon />, path: "/admin/orders" },
    { text: "Users", icon: <PeopleIcon />, path: "/admin/users" },
    { text: "Products", icon: <Inventory />, path: "/admin/products" },
    { text: "Categories", icon: <Category />, path: "/admin/categories" },
    { text: "Pending Collaborators", icon: <Inbox />, path: "/admin/approve-ctv" },
    { text: "Auctions", icon: <GavelIcon />, path: "/admin/auctions" },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: 240,
          boxSizing: "border-box",
          top: "100px", // tránh đè lên Header
        },
      }}
    >
      <List sx={{ width: 240 }}>
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
