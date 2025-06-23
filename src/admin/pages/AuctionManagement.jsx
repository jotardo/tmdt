import React, { useState, useEffect, useCallback } from 'react';
import {
    Box, Typography, Paper, TablePagination, CircularProgress,
    Alert, Dialog, DialogTitle, DialogContent, TextField,
    DialogActions, Button, FormControl, InputLabel, Select, MenuItem, Grid
} from '@mui/material';
import { toast } from 'react-toastify';

import { fetchAuctionsForAdmin, softDeleteAuctionAPI, restoreAuctionAPI, promoteAuctionAPI, getAuctionDetailsForAdmin} from "../../services/AuctionService/auctionService";
import {AuctionTable} from "../components/AuctionTable";
import {getAllCategories} from "../../services/shopingService/categoryService";

const PageTitle = ({ children }) => <Typography variant="h4" gutterBottom>{children}</Typography>;

export const AuctionManagement = () => {
    const [auctions, setAuctions] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [isPromoteModalOpen, setPromoteModalOpen] = useState(false);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [currentAuction, setCurrentAuction] = useState(null);
    const [auctionDetails, setAuctionDetails] = useState(null);

    const [promoteFormData, setPromoteFormData] = useState({ name: '', description: '', price: '', categoryId: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);


    const [categories, setCategories] = useState([]);
    const [categoryLoading, setCategoryLoading] = useState(true);

    const loadAuctions = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetchAuctionsForAdmin(page, rowsPerPage);

            const data = response.data;

            if (data && data.productPage && Array.isArray(data.productPage.content)) {
                setAuctions(data.productPage.content);
                setTotalElements(data.productPage.totalElements || 0);
            } else {
                console.warn("Dữ liệu trả về không hợp lệ hoặc không có 'productPage.content':", data);
                setAuctions([]);
                setTotalElements(0);
            }
        } catch (err) {
            setError(err.message);
            toast.error(err.message || "Không thể tải dữ liệu.");
        } finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage]);
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setCategoryLoading(true);
                const response = await getAllCategories();
                const data = response?.data;
                if (data && Array.isArray(data.categories)) {
                    setCategories(data.categories);
                } else {
                    console.error("LỖI: Dữ liệu trả về không hợp lệ hoặc không có trường 'categories'.", data);
                    setCategories([]);
                }
            } catch (err) {
                console.error("LỖI NGOẠI LỆ khi gọi API danh mục:", err);
                toast.error("Không thể tải danh sách danh mục.");
            } finally {
                setCategoryLoading(false);
            }
        };
        fetchCategories();
    }, []);
    useEffect(() => {
        loadAuctions();
    }, [loadAuctions]);

    const handleAction = async (actionFunction, successMessage) => {
        try {
            await actionFunction();
            toast.success(successMessage);
            loadAuctions();
        } catch (err) {
            toast.error(err.message);
        }
    };

    const handleDelete = (productId) => handleAction(() => softDeleteAuctionAPI(productId), "Vô hiệu hóa sản phẩm thành công!");
    const handleRestore = (productId) => handleAction(() => restoreAuctionAPI(productId), "Khôi phục sản phẩm thành công!");

    const handleViewDetails = async (auctionProductId) => {
        console.log("auctionProductId:", auctionProductId)
        if (!auctionProductId) {
            toast.error("Không tìm thấy thông tin đấu giá cho sản phẩm này.");
            return;
        }
        setIsSubmitting(true);
        setAuctionDetails(null);
        try {
            const response = await getAuctionDetailsForAdmin(auctionProductId);
            setAuctionDetails(response.data);
            setIsDetailModalOpen(true);
        } catch (err) {
            toast.error(err.response?.data?.message || "Không thể tải chi tiết.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const openPromoteModal = (auction) => {
        setCurrentAuction(auction);
        setPromoteFormData({
            name: auction.name || '',
            description: auction.description || '',
            price: auction.price || '',
            categoryId: auction.categoryId || ''
        });
        setPromoteModalOpen(true);
    };

    const handlePromoteFormChange = (e) => {
        setPromoteFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handlePromoteSubmit = async () => {
        if (!currentAuction) return;
        setIsSubmitting(true);
        try {
            await promoteAuctionAPI(currentAuction.id, promoteFormData);
            toast.success("Thăng cấp sản phẩm thành công!");
            setPromoteModalOpen(false);
            loadAuctions();
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <Box sx={{ p: 3 }}>
            <PageTitle>Quản lý Sản phẩm Đấu giá</PageTitle>

            {isLoading && auctions.length === 0 && <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}><CircularProgress /></Box>}
            {error && <Alert severity="error">{error}</Alert>}

            {!isLoading && !error && (
                <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                    <AuctionTable
                        auctions={auctions}
                        onDelete={handleDelete}
                        onRestore={handleRestore}
                        onPromote={openPromoteModal}
                        onViewDetails={handleViewDetails}
                    />
                    <TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={totalElements}
                        rowsPerPage={rowsPerPage}
                        page={page}
                        onPageChange={(e, newPage) => setPage(newPage)}
                        onRowsPerPageChange={(e) => {
                            setRowsPerPage(parseInt(e.target.value, 10));
                            setPage(0);
                        }}
                    />
                </Paper>
            )}

            {/*<Dialog open={isPromoteModalOpen} onClose={() => setPromoteModalOpen(false)} fullWidth maxWidth="sm">*/}
            {/*    <DialogTitle>Thăng cấp thành Sản phẩm Chính thức</DialogTitle>*/}
            {/*    <DialogContent>*/}
            {/*        <Typography variant="subtitle1" gutterBottom>*/}
            {/*            Chỉnh sửa thông tin cho sản phẩm: <strong>{currentAuction?.name}</strong>*/}
            {/*        </Typography>*/}
            {/*        <TextField margin="dense" name="name" label="Tên sản phẩm mới" type="text" fullWidth variant="outlined" value={promoteFormData.name} onChange={handlePromoteFormChange} />*/}
            {/*        <TextField margin="dense" name="description" label="Mô tả mới" type="text" fullWidth multiline rows={4} variant="outlined" value={promoteFormData.description} onChange={handlePromoteFormChange} />*/}
            {/*        <TextField margin="dense" name="price" label="Giá bán chính thức (VND)" type="number" fullWidth variant="outlined" value={promoteFormData.price} onChange={handlePromoteFormChange} />*/}
            {/*        <FormControl fullWidth margin="dense">*/}
            {/*            <InputLabel>Danh mục mới</InputLabel>*/}
            {/*            <Select name="categoryId" value={promoteFormData.categoryId} label="Danh mục mới" onChange={handlePromoteFormChange}>*/}
            {/*                <MenuItem value="" disabled>{categoryLoading ? "Đang tải..." : "Chọn danh mục"}</MenuItem>*/}
            {/*                {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}*/}
            {/*            </Select>*/}
            {/*        </FormControl>*/}
            {/*    </DialogContent>*/}
            {/*    <DialogActions>*/}
            {/*        <Button onClick={() => setPromoteModalOpen(false)}>Hủy</Button>*/}
            {/*        <Button onClick={handlePromoteSubmit} variant="contained" disabled={isSubmitting}>*/}
            {/*            {isSubmitting ? <CircularProgress size={24} /> : "Lưu và Xuất bản"}*/}
            {/*        </Button>*/}
            {/*    </DialogActions>*/}
            {/*</Dialog>*/}
            <Dialog open={isPromoteModalOpen} onClose={() => setPromoteModalOpen(false)} fullWidth maxWidth="sm">
                <DialogTitle>Thăng cấp thành Sản phẩm Chính thức</DialogTitle>
                <DialogContent>
                    <TextField margin="dense" name="name" label="Tên sản phẩm mới" type="text" fullWidth variant="outlined" value={promoteFormData.name} onChange={handlePromoteFormChange} />
                    <TextField margin="dense" name="description" label="Mô tả mới" type="text" fullWidth multiline rows={4} variant="outlined" value={promoteFormData.description} onChange={handlePromoteFormChange} />
                    <TextField margin="dense" name="price" label="Giá bán chính thức (VND)" type="number" fullWidth variant="outlined" value={promoteFormData.price} onChange={handlePromoteFormChange} />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Danh mục mới</InputLabel>
                        <Select name="categoryId" value={promoteFormData.categoryId} label="Danh mục mới" onChange={handlePromoteFormChange} disabled={categoryLoading}>
                            <MenuItem value="" disabled>{categoryLoading ? "Đang tải..." : "Chọn danh mục"}</MenuItem>
                            {categories.map(cat => <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>)}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPromoteModalOpen(false)}>Hủy</Button>
                    <Button onClick={handlePromoteSubmit} variant="contained" disabled={isSubmitting}>
                        {isSubmitting ? <CircularProgress size={24} /> : "Lưu và Xuất bản"}
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={isDetailModalOpen} onClose={() => setIsDetailModalOpen(false)} fullWidth maxWidth="md">
                <DialogTitle>Chi tiết Phiên Đấu Giá</DialogTitle>
                <DialogContent>
                    {isSubmitting && !auctionDetails ? <CircularProgress /> : (
                        auctionDetails ? (
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h6">Thông tin Sản phẩm</Typography>
                                    <Typography><strong>Tên:</strong> {auctionDetails.productDetails?.name}</Typography>
                                    <Typography><strong>Giá:</strong> {auctionDetails.productDetails?.price}</Typography>
                                    <Typography><strong>Mô tả:</strong> {auctionDetails.productDetails?.description}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6">Thông tin Khách hàng (Author)</Typography>
                                    <Typography><strong>ID:</strong> {auctionDetails.customerInfo?.id}</Typography>
                                    <Typography><strong>Tên:</strong> {auctionDetails.customerInfo?.firstName} {auctionDetails.customerInfo?.lastName}</Typography>
                                    <Typography><strong>Email:</strong> {auctionDetails.customerInfo?.email}</Typography>
                                </Grid>
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6">Thông tin CTV</Typography>
                                    {auctionDetails.ctvInfo ? (
                                        <>
                                            <Typography><strong>ID:</strong> {auctionDetails.ctvInfo.ctvId}</Typography>
                                            <Typography><strong>Tên:</strong> {auctionDetails.ctvInfo.name}</Typography>
                                            <Typography><strong>Email:</strong> {auctionDetails.ctvInfo.email}</Typography>
                                            <Typography><strong>Kinh nghiệm:</strong> {auctionDetails.ctvInfo.experienceAndSkills}</Typography>
                                        </>
                                    ) : (
                                        <Typography>Chưa có CTV nhận deal.</Typography>
                                    )}
                                </Grid>
                            </Grid>
                        ) : <Typography>Không có dữ liệu chi tiết.</Typography>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setIsDetailModalOpen(false)}>Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};
export default AuctionManagement;