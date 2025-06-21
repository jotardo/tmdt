import React, { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    TablePagination,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Grid,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import CancelIcon from '@mui/icons-material/Cancel';
import CloseIcon from '@mui/icons-material/Close'; // For Dialog close button
import { toast } from 'react-toastify';
// import { useNavigate } from 'react-router-dom'; // Uncomment if navigation is needed

const API_BASE_URL = 'http://localhost:8080/api'; //  Nên đặt trong file .env

const getAuthToken = () => {
    return localStorage.getItem('jwtToken'); //  Hoặc cách bạn lưu token
};

const fetchUserOrdersAPI = async (page, size, statusFilter, sort = 'createdAt,desc') => {
    const token = getAuthToken();
    if (!token) {
        toast.error("Vui lòng đăng nhập để xem đơn hàng.");
        throw new Error("User not authenticated");
    }
    let url = `${API_BASE_URL}/orders/me?page=${page}&size=${size}&sort=${sort}`;
    if (statusFilter && statusFilter !== 'ALL') {
        url += `&status=${statusFilter}`;
    }
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Lỗi ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.message || `Lỗi ${response.status} khi tải đơn hàng.`);
    }
    return response.json();
};

const fetchOrderDetailsAPI = async (orderId) => {
    const token = getAuthToken();
    if (!token) {
        toast.error("Vui lòng đăng nhập để xem chi tiết đơn hàng.");
        throw new Error("User not authenticated");
    }
    const url = `${API_BASE_URL}/orders/me/${orderId}`;
    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Lỗi ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.message || `Lỗi ${response.status} khi tải chi tiết đơn hàng.`);
    }
    return response.json();
};

const cancelOrderAPI = async (orderId) => {
    const token = getAuthToken();
    if (!token) {
        toast.error("Vui lòng đăng nhập để hủy đơn hàng.");
        throw new Error("User not authenticated");
    }
    const url = `${API_BASE_URL}/orders/me/${orderId}/cancel`;
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `Lỗi ${response.status}: ${response.statusText}` }));
        throw new Error(errorData.message || `Lỗi ${response.status} khi hủy đơn hàng.`);
    }
    return response.json();
};

const ORDER_STATUS_BACKEND = {
    PENDING: 'PENDING',
    CONFIRM: 'CONFIRM',
    PAID: 'PAID',
    CANCELLED: 'CANCELLED',
};

const ORDER_STATUS_OPTIONS = [
    { value: 'ALL', label: 'Tất cả' },
    { value: ORDER_STATUS_BACKEND.PENDING, label: 'Đang chờ xử lý' },
    { value: ORDER_STATUS_BACKEND.CONFIRM, label: 'Đã xác nhận' },
    { value: ORDER_STATUS_BACKEND.PAID, label: 'Đã thanh toán' },
    { value: ORDER_STATUS_BACKEND.CANCELLED, label: 'Đã hủy' },
];

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const [filterStatus, setFilterStatus] = useState('ALL');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [isProcessingAction, setIsProcessingAction] = useState(false);
    // const navigate = useNavigate();

    const loadOrders = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchUserOrdersAPI(page, rowsPerPage, filterStatus);
            setOrders(data.content || []);
            setTotalElements(data.totalElements || 0);
        } catch (err) {
            setError(err.message);
            setOrders([]);
            setTotalElements(0);
        } finally {
            setIsLoading(false);
        }
    }, [page, rowsPerPage, filterStatus]);

    useEffect(() => {
        const token = getAuthToken();
        if (!token /* && !window.location.pathname.includes('/login') */ ) {
            // toast.warn("Vui lòng đăng nhập để xem lịch sử đơn hàng.");
            // navigate('/login');
            setError("Bạn cần đăng nhập để xem thông tin này.");
            setIsLoading(false);
            return;
        }
        loadOrders();
    }, [loadOrders /*, navigate */]);

    const handleFilterChange = (event) => {
        setFilterStatus(event.target.value);
        setPage(0);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleViewDetails = async (orderId) => {
        setIsProcessingAction(true);
        setSelectedOrderDetails(null);
        try {
            const details = await fetchOrderDetailsAPI(orderId);
            setSelectedOrderDetails(details);
            setIsDetailsModalOpen(true);
        } catch (err) {
            toast.error(err.message || "Không thể tải chi tiết đơn hàng.");
        } finally {
            setIsProcessingAction(false);
        }
    };

    const handleCloseDetailsModal = () => {
        setIsDetailsModalOpen(false);
        setSelectedOrderDetails(null);
    };

    const handleCancelOrder = async (orderId) => {
        if (window.confirm("Bạn có chắc chắn muốn hủy đơn hàng này không?")) {
            setIsProcessingAction(true);
            try {
                await cancelOrderAPI(orderId);
                toast.success("Đơn hàng đã được hủy thành công!");
                loadOrders();
            } catch (err) {
                toast.error(err.message || "Không thể hủy đơn hàng. Vui lòng thử lại.");
            } finally {
                setIsProcessingAction(false);
            }
        }
    };

    const getStatusChipProperties = (status) => {
        switch (status) {
            case ORDER_STATUS_BACKEND.PENDING: return { label: 'Đang chờ xử lý', color: 'warning' };
            case ORDER_STATUS_BACKEND.CONFIRM: return { label: 'Đã xác nhận', color: 'info' };
            case ORDER_STATUS_BACKEND.PAID: return { label: 'Đã thanh toán', color: 'success' };
            case ORDER_STATUS_BACKEND.CANCELLED: return { label: 'Đã hủy', color: 'error' };
            default: return { label: status || 'Không rõ', color: 'default' };
        }
    };

    const formatCurrency = (value) => {
        if (value == null || isNaN(value)) return 'N/A';
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
    };

    const formatDate = (dateInput) => {
        if (!dateInput) {
            return 'N/A';
        }

        try {
            let dateObj;

            if (Array.isArray(dateInput) && dateInput.length >= 6) {
                const year = dateInput[0];
                const month = dateInput[1] - 1; // Tháng trong JavaScript là 0-indexed (0-11)
                const day = dateInput[2];
                const hour = dateInput[3];
                const minute = dateInput[4];
                const second = dateInput[5];
                const millisecond = dateInput.length > 6 ? Math.floor(dateInput[6] / 1000000) : 0; // Chuyển nano giây sang mili s

                dateObj = new Date(year, month, day, hour, minute, second, millisecond);
            } else if (typeof dateInput === 'string') {
                // Xử lý trường hợp dateInput là chuỗi
                dateObj = new Date(dateInput);
            } else {
                console.warn("Định dạng ngày không hợp lệ nhận được bởi formatDate:", dateInput);
                return 'Ngày không hợp lệ';
            }

            // Kiểm tra xem dateObj có hợp lệ không sau khi tạo
            if (isNaN(dateObj.getTime())) {
                console.error("Không thể tạo đối tượng Date hợp lệ từ input:", dateInput);
                return 'Invalid Date';
            }

            return dateObj.toLocaleDateString('vi-VN', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (e) {
            console.error("Lỗi trong hàm formatDate:", dateInput, e);
            return typeof dateInput === 'string' ? dateInput : 'Lỗi định dạng ngày';
        }
    };

    const tableCellStyle = { py: 1, px: 1.5 };
    const tableHeaderCellStyle = { ...tableCellStyle, fontWeight: 'bold', backgroundColor: 'grey.100' };

    return (
        <Box sx={{ p: { xs: 1, sm: 2, md: 3 }, maxWidth: '1200px', margin: 'auto' }}>

            {/*<Card sx={{ mb: 3, boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', borderRadius: '8px' }}>*/}
            {/*    <CardContent>*/}
            {/*        <FormControl size="small" sx={{ minWidth: 220 }}>*/}
            {/*            <InputLabel id="status-filter-label">Lọc theo trạng thái</InputLabel>*/}
            {/*            <Select*/}
            {/*                labelId="status-filter-label"*/}
            {/*                value={filterStatus}*/}
            {/*                label="Lọc theo trạng thái"*/}
            {/*                onChange={handleFilterChange}*/}
            {/*            >*/}
            {/*                {ORDER_STATUS_OPTIONS.map(option => (*/}
            {/*                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>*/}
            {/*                ))}*/}
            {/*            </Select>*/}
            {/*        </FormControl>*/}
            {/*    </CardContent>*/}
            {/*</Card>*/}
            {isLoading && !orders.length ? (
                <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '300px' }}>
                    <CircularProgress />
                    <Typography sx={{ mt: 2 }}>Đang tải đơn hàng của bạn...</Typography>
                </Box>
            ) : error && !orders.length ? (
                <Alert severity="error" sx={{ my: 2, p: 2 }}>{Error}</Alert>
            ) : (
                <Paper sx={{ width: '100%', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)', borderRadius: '8px' }}>
                    {error && <Alert severity="warning" sx={{m:1, borderRadius: '4px'}}>Lưu ý: {error}</Alert>}
                    <TableContainer>
                        <Table stickyHeader size="small" aria-label="user orders table">
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={tableHeaderCellStyle}>Mã ĐH</TableCell>
                                    <TableCell sx={tableHeaderCellStyle}>Ngày Đặt</TableCell>
                                    <TableCell sx={tableHeaderCellStyle} align="right">Tổng Tiền</TableCell>
                                    <TableCell sx={tableHeaderCellStyle} align="center">Trạng Thái</TableCell>
                                    <TableCell sx={tableHeaderCellStyle} align="center">Xem Chi Tiết</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {!isLoading && orders.length === 0 && !error ? (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center">
                                            <Typography variant="subtitle1" sx={{ p: 4, color: 'text.secondary' }}>
                                                Bạn chưa có đơn hàng nào {filterStatus !== 'ALL' ? `phù hợp với bộ lọc.` : `.`}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    orders.map((order) => {
                                        const statusProps = getStatusChipProperties(order.status);
                                        const canCancel = order.status === ORDER_STATUS_BACKEND.PENDING || order.status === ORDER_STATUS_BACKEND.CONFIRM;
                                        return (
                                            <TableRow hover key={order.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                                <TableCell sx={tableCellStyle} component="th" scope="row"><strong>#{order.id}</strong></TableCell>
                                                <TableCell sx={tableCellStyle}>{formatDate(order.createdAt)}</TableCell>
                                                <TableCell sx={tableCellStyle} align="right">{formatCurrency(order.totalPrice)}</TableCell>
                                                <TableCell sx={tableCellStyle} align="center">
                                                    <Chip label={statusProps.label} color={statusProps.color} size="small" />
                                                </TableCell>
                                                <TableCell sx={tableCellStyle} align="center">
                                                    <Tooltip title="Xem chi tiết">
                                                        <IconButton onClick={() => handleViewDetails(order.id)} color="primary" size="small" disabled={isProcessingAction}>
                                                            <VisibilityIcon />
                                                        </IconButton>
                                                    </Tooltip>
                                                    {canCancel && (
                                                        <Tooltip title="Hủy đơn hàng">
                                                            <IconButton
                                                                onClick={() => handleCancelOrder(order.id)}
                                                                sx={{ color: 'error.main' }}
                                                                size="small"
                                                                disabled={isProcessingAction}
                                                            >
                                                                <CancelIcon />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })
                                )}
                                {isLoading && orders.length > 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                                            <CircularProgress size={28} />
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    {totalElements > 0 && (
                        <TablePagination
                            rowsPerPageOptions={[5, 10, 25, 50]}
                            component="div"
                            count={totalElements}
                            rowsPerPage={rowsPerPage}
                            page={page}
                            onPageChange={handleChangePage}
                            onRowsPerPageChange={handleChangeRowsPerPage}
                            labelRowsPerPage="Số dòng:"
                            labelDisplayedRows={({ from, to, count }) => `${from}–${to} trên ${count !== -1 ? count : `hơn ${to}`}`}
                            sx={{ borderTop: '1px solid rgba(224, 224, 224, 1)'}}
                        />
                    )}
                </Paper>
            )}

            <Dialog open={isDetailsModalOpen} onClose={handleCloseDetailsModal} maxWidth="md" fullWidth scroll="paper">
                <DialogTitle sx={{ borderBottom: '1px solid #eee', m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    Chi Tiết Đơn Hàng #{selectedOrderDetails?.id}
                    <IconButton aria-label="close" onClick={handleCloseDetailsModal} sx={{ color: (theme) => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent dividers sx={{p: {xs: 1.5, sm:2, md: 3}}}>
                    {(isProcessingAction && !selectedOrderDetails) || isLoading && !selectedOrderDetails ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px' }}><CircularProgress /></Box>
                    ) : selectedOrderDetails ? (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom color="primary.main">Thông tin chung</Typography>
                                <Typography variant="body1"><strong>Mã ĐH:</strong> #{selectedOrderDetails.id}</Typography>
                                <Typography variant="body1"><strong>Email:</strong> {selectedOrderDetails.userEmail || 'N/A'}</Typography>
                                <Typography variant="body1"><strong>Ngày đặt:</strong> {formatDate(selectedOrderDetails.createdAt)}</Typography>
                                <Typography variant="body1" sx={{display: 'flex', alignItems: 'center'}}><strong>Trạng thái ĐH:</strong>
                                    <Chip
                                        label={getStatusChipProperties(selectedOrderDetails.status).label}
                                        color={getStatusChipProperties(selectedOrderDetails.status).color}
                                        size="small" sx={{ ml: 1 }}
                                    />
                                </Typography>
                                <Typography variant="body1"><strong>Tổng tiền SP (sau giảm giá):</strong> {formatCurrency(selectedOrderDetails.totalPrice)}</Typography>
                                <Typography variant="caption" color="text.secondary">(Phí vận chuyển 25.000đ sẽ được cộng vào tổng cuối nếu áp dụng)</Typography>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Typography variant="h6" gutterBottom color="primary.main">Địa chỉ giao hàng</Typography>
                                {selectedOrderDetails.deliveryAddress ? (
                                    <>
                                        <Typography variant="body1"><strong>Người nhận:</strong> {selectedOrderDetails.deliveryAddress.receiverName}</Typography>
                                        <Typography variant="body1"><strong>Điện thoại:</strong> {selectedOrderDetails.deliveryAddress.contactNumber}</Typography>
                                        <Typography variant="body1" sx={{lineHeight: 1.6}}>
                                            {selectedOrderDetails.deliveryAddress.buildingAddress},<br/>
                                            {selectedOrderDetails.deliveryAddress.wardName}, {selectedOrderDetails.deliveryAddress.districtName},<br/>
                                            {selectedOrderDetails.deliveryAddress.provinceName}
                                        </Typography>
                                    </>
                                ) : <Typography variant="body1" color="text.secondary">Không có thông tin địa chỉ.</Typography>}
                            </Grid>

                            {selectedOrderDetails.paymentDetails && (
                                <Grid item xs={12} md={6}>
                                    <Typography variant="h6" gutterBottom color="primary.main" sx={{ mt: {xs: 2, md:0} }}>Thông tin thanh toán</Typography>
                                    <Typography variant="body1"><strong>Phương thức:</strong> {selectedOrderDetails.paymentDetails.paymentMethod}</Typography>
                                    <Typography variant="body1" sx={{display: 'flex', alignItems: 'center'}}><strong>Trạng thái TT:</strong>
                                        <Chip
                                            label={selectedOrderDetails.paymentDetails.paymentStatus}
                                            color={selectedOrderDetails.paymentDetails.paymentStatus === 'PAID' ? 'success' : (selectedOrderDetails.paymentDetails.paymentStatus === 'PENDING' ? 'warning' : 'default')}
                                            size="small" sx={{ ml: 1 }}
                                        />
                                    </Typography>
                                    {selectedOrderDetails.paymentDetails.paymentDate && <Typography variant="body1"><strong>Ngày TT:</strong> {formatDate(selectedOrderDetails.paymentDetails.paymentDate)}</Typography>}
                                    {selectedOrderDetails.paymentDetails.transactionId && <Typography variant="body1"><strong>Mã GD:</strong> {selectedOrderDetails.paymentDetails.transactionId}</Typography>}
                                </Grid>
                            )}

                            <Grid item xs={12}>
                                <Typography variant="h6" gutterBottom color="primary.main" sx={{ mt: 2 }}>Sản phẩm đã đặt ({selectedOrderDetails.items?.length || 0})</Typography>
                                {selectedOrderDetails.items?.length > 0 ? (
                                    selectedOrderDetails.items.map(item => (
                                        <Paper key={item.productId} elevation={0} sx={{ p: 1.5, mb: 1.5, border: '1px solid #e0e0e0', borderRadius: '4px' }}>
                                            <Typography variant="subtitle1" sx={{fontWeight: '500'}}>{item.productName || `Sản phẩm ID: ${item.productId}`}</Typography>
                                            <Box display="flex" justifyContent="space-between" sx={{mt: 0.5}}>
                                                <Typography variant="body2" color="text.secondary">Số lượng: {item.quantity}</Typography>
                                                <Typography variant="body2" color="text.secondary">Đơn giá: {formatCurrency(item.price)}</Typography>
                                            </Box>
                                            <Typography variant="body1" sx={{fontWeight: 'bold', textAlign: 'right', mt:0.5}}>
                                                Thành tiền: {formatCurrency(item.price * item.quantity)}
                                            </Typography>
                                        </Paper>
                                    ))
                                ) : <Typography variant="body1" color="text.secondary">Không có sản phẩm nào trong đơn hàng này.</Typography>}
                            </Grid>

                        </Grid>
                    ) : (
                        <Typography sx={{p:3, textAlign:'center'}}>Không thể tải chi tiết đơn hàng. Vui lòng đóng và thử lại.</Typography>
                    )}
                </DialogContent>
                <DialogActions sx={{ borderTop: '1px solid #eee', p: '16px 24px' }}>
                    <Button onClick={handleCloseDetailsModal} variant="contained">Đóng</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Orders;
