import React, { useEffect, useRef, useState } from "react";
import { useData } from "../../";
import { Grid, Card, CardMedia, CardContent, Typography, Button, Box, Pagination, IconButton, Slider, FormControlLabel, Checkbox, Divider } from "@mui/material";
import TuneIcon from "@mui/icons-material/Tune";
import Loader from "../../components/Loader";
import { useNavigate } from "react-router-dom";
import axiosClient from "../../backend/api/axiosClient";

export default function RelatedProducts({ categoryName }) {
  const { categoriesData, brandData, occasionData } = useData();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    priceRange: 500000000,
    categoryFilters: [],
    occasionFilters: [],
    brandFilters: [],
  });
  const resultsPerPage = 24;
  const productDiv = useRef(null);

  // Fetch products by categoryId
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get(`/product/fetch-by-category/${categoryName}`);
        // if (!response.ok) throw new Error("Không thể lấy dữ liệu sản phẩm");
        setProducts(response.data.productDTOs || []);
        setFilteredProducts(response.data.productDTOs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  // Apply filters
  useEffect(() => {
    let filtered = [...products];
    if (filters.priceRange < 500000000) {
      filtered = filtered.filter((product) => product.price <= filters.priceRange);
    }
    if (filters.categoryFilters.length > 0) {
      filtered = filtered.filter((product) => filters.categoryFilters.includes(product.categoryName));
    }
    if (filters.occasionFilters.length > 0) {
      filtered = filtered.filter((product) => filters.occasionFilters.includes(product.occasion));
    }
    if (filters.brandFilters.length > 0) {
      filtered = filtered.filter((product) => filters.brandFilters.includes(product.brand));
    }
    setFilteredProducts(filtered);
    setPage(0); // Reset to first page when filters change
  }, [products, filters]);


  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 4 }}>
      <Typography variant="h5" gutterBottom>
        Sản phẩm liên quan
      </Typography>
      {loading ? (
        <Loader />
      ) : error ? (
        <Typography variant="body1" color="error">
          {error}
        </Typography>
      ) : products.length === 0 ? (
        <Typography variant="body1" color="text.secondary">
          Không có sản phẩm liên quan.
        </Typography>
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product.id}>
              <Card sx={{ boxShadow: 2, borderRadius: 2, height: "100%", display: "flex", flexDirection: "column" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={
                    product.imageURLs && product.imageURLs.length > 0
                      ? `${process.env.REACT_APP_BASE_URL}/product/${product.imageURLs[0].url}`
                      : "/no-image.jpg"
                  }
                  alt={product.name}
                  sx={{ objectFit: "cover" }}
                  onError={(e) => {
                    console.error(`Failed to load image for ${product.name}:`, e); // Debug image error
                    e.target.src = "/no-image.jpg"; // Fallback to default image
                  }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" noWrap>
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {product.categoryName} từ {product.brand}
                  </Typography>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
                    <Typography variant="body1" color="primary">
                      {product.price.toLocaleString()} VNĐ
                    </Typography>
                    {product.prevPrice && (
                      <Typography variant="body2" color="text.secondary" sx={{ textDecoration: "line-through" }}>
                        {product.prevPrice.toLocaleString()} VNĐ
                      </Typography>
                    )}
                  </Box>
                  <Button
                    variant="outlined"
                    fullWidth
                    sx={{ mt: 2, borderRadius: 2 }}
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    Xem chi tiết
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
}