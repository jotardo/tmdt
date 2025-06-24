import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import {
  Container,
  Grid,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { toast } from "react-toastify";
import AuctionProductCard from "./Components/AuctionProductCard";

export default function MyAuctionProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const userDetails = user || JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user || !userDetails || !userDetails.id) return;
    setLoading(true);
    axios
      .get(`http://localhost:8080/api/reverse-auction/fetch-all/my/${userDetails?.id}`)
      .then((response) => {
        console.log("Fetched my auctions:", response.data);
        const productDTOs = Array.isArray(response.data.productDTOs) ? response.data.productDTOs : [];
        setProducts(productDTOs.filter(product => product && typeof product === 'object'));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching my auctions:", error);
        toast.error("Không thể tải danh sách đấu giá của bạn!");
        setLoading(false);
      });
  }, [user, userDetails?.token]);

  return (
    <Container maxWidth="lg" sx={{ py: 4, bgcolor: '#f5f7fa' }}>
      <Box sx={{ minHeight: '400px' }}>
        <Typography variant="h5" gutterBottom sx={{ fontWeight: 600, color: '#333' }}>
          Danh Sách Đấu Giá Của Tôi
        </Typography>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : products.length === 0 ? (
          <Typography color="text.secondary" sx={{ my: 4, textAlign: 'center' }}>
            Bạn chưa có đấu giá nào.
          </Typography>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <AuctionProductCard 
                  item={product} 
                  inWishlist={false}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}