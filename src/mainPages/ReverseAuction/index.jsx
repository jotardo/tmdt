import React, { useState, useEffect } from "react";
import { NavLink, Outlet, Link, useLocation } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Container,
  Grid,
  Box,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";
import { AddCircle, List } from "@mui/icons-material";
import axios from "axios";
// import CreateAuction from "./UserComponents/CreateAuction";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";
import AuctionProductCard from "./Components/AuctionProductCard";

export default function ReverseAuctionHome() {
  const location = useLocation();
  const [tabValue, setTabValue] = useState(0);
  const [products, setProducts] = useState([]);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userDetails = user || JSON.parse(localStorage.getItem("user"));
  const role = userDetails?.role; //
  
  useEffect(() => {
    setLoading(true);
    axios
      .get("http://localhost:8080/api/reverse-auction/fetch-all")
      .then((response) => {
        console.log("Fetched products:", response.data);
        const productDTOs = Array.isArray(response.data.productDTOs) ? response.data.productDTOs : [];
        setProducts(productDTOs.filter(product => product && typeof product === 'object'));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        // toast.error("Không thể tải danh sách sản phẩm!");
        setLoading(false);
      });
  }, []);
  
  const handleAddProduct = (product) => {
    setProducts((prev) => [...prev, product]);
    setOpenCreateDialog(false);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#f5f7fa' }}>
      <AppBar 
        position="static" 
        sx={{ 
          mb: 4, 
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          background: 'linear-gradient(45deg, #1976d2 30%, #2196f3 90%)',
          borderRadius: 2
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component={Link}
            to="/reverse-auction"
            sx={{ 
              flexGrow: 1, 
              textDecoration: "none", 
              color: "white",
              fontWeight: 600 
            }}
          >
            Đấu Giá Ngược
          </Typography>
          {(role === 'User') && (
            <Button
              variant="contained"
              startIcon={<AddCircle />}
              onClick={() => setOpenCreateDialog(true)}
              sx={{ 
                borderRadius: 20, 
                textTransform: "none",
                bgcolor: 'white',
                color: '#1976d2',
                '&:hover': {
                  bgcolor: '#e3f2fd',
                  transform: 'translateY(-1px)'
                }
              }}
            >
              Tạo Đấu Giá
            </Button>
          )}
        </Toolbar>
      </AppBar>

      <Paper elevation={3} sx={{ borderRadius: 2, mb: 4 }}>
        <Tabs
          value={tabValue}
          centered
          sx={{ 
            bgcolor: 'white',
            borderRadius: '8px 8px 0 0',
            '& .MuiTab-root': {
              textTransform: 'none',
              fontWeight: 500,
              fontSize: '1rem'
            }
          }}
          textColor="primary"
          indicatorColor="primary"
        >
          <Tab
            label="Danh Sách Đấu Giá"
            icon={<List />}
            iconPosition="start"
            component={NavLink}
            to="/reverse-auction/my"
          />
        </Tabs>
      </Paper>

      <Box sx={{ minHeight: '400px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
          Danh Sách Sản Phẩm Đấu Giá
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Typography color="text.secondary" sx={{ my: 4, textAlign: 'center' }}>
            Chưa có sản phẩm đấu giá nào.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <AuctionProductCard 
                  item={product} 
                  inWishlist={false} // Adjust if wishlist integration is needed
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      {/* <CreateAuction
        open={openCreateDialog}
        onClose={() => {
          setOpenCreateDialog(false);
        }}
        onAddProduct={handleAddProduct}
      /> */}

      <Box sx={{ mt: 4 }}>
        <Outlet />
      </Box>
    </Container>
  );
}

