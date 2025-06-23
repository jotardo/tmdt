import React from 'react';
import {
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    IconButton, Tooltip, Chip, Box, Typography
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import RestoreFromTrashIcon from '@mui/icons-material/RestoreFromTrash';
import StarIcon from '@mui/icons-material/Star';
import VisibilityIcon from '@mui/icons-material/Visibility';

export const AuctionTable = ({ auctions, onPromote, onDelete, onRestore, onViewDetails }) => {
    const tableHeaderCellStyle = { fontWeight: 'bold', backgroundColor: 'grey.100' };

    const getStatusChip = (product) => {
        if (product.deleted) {
            return <Chip label="Đã Xóa" color="default" size="small" />;
        }
        switch (product.status) {
            case 'Open-Auction':
                return <Chip label="Đang Đấu Giá" color="info" size="small" />;
            case 'Active':
                return <Chip label="Đã Đăng Bán" color="success" size="small" />;
            case 'Deactived':
                return <Chip label="Đấu Giá Thành Công" color="info" size="small" />;
            case 'Deleted':
                return <Chip label="Đã Xóa" color="error" size="small" />;
            default:
                return <Chip label={product.status || 'Không rõ'} color="primary" size="small" />;
        }
    };

    return (
        <TableContainer>
            <Table stickyHeader size="small">
                <TableHead>
                    <TableRow>
                        <TableCell sx={tableHeaderCellStyle}>ID</TableCell>
                        <TableCell sx={tableHeaderCellStyle}>Tên Sản phẩm Đấu giá</TableCell>
                        <TableCell sx={tableHeaderCellStyle}>User tạo </TableCell>
                        <TableCell sx={tableHeaderCellStyle}>CTV nhận</TableCell>
                        <TableCell sx={tableHeaderCellStyle} align="center">Trạng thái</TableCell>
                        <TableCell sx={tableHeaderCellStyle} align="center"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {auctions.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} align="center">
                                <Typography sx={{ p: 4, color: 'text.secondary' }}>
                                    Không có sản phẩm đấu giá nào.
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        auctions.map((product) => {
                            const auctionProductId = product.auctionProductDTO?.id;
                            return (
                            <TableRow hover key={product.id}>
                                <TableCell>#{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.auctionProductDTO?.author_id || 'N/A'}</TableCell>
                                <TableCell>{product.auctionProductDTO?.collaboration_id || 'Chưa có'}</TableCell>
                                <TableCell align="center">
                                    {getStatusChip(product)}
                                </TableCell>
                                <TableCell align="center">
                                    <Tooltip title="Xem chi tiết">
                                            <span>
                                                <IconButton
                                                    color="default"
                                                    onClick={() => onViewDetails(auctionProductId)}
                                                >
                                                    <VisibilityIcon />
                                                </IconButton>
                                            </span>
                                    </Tooltip>
                                    <Tooltip title="Thăng cấp thành sản phẩm chính">
                                        <IconButton color="success" onClick={() => onPromote(product)}>
                                            <StarIcon />
                                        </IconButton>
                                    </Tooltip>
                                    {product.status == 'Deleted' ? (
                                        <Tooltip title="Khôi phục">
                                            <IconButton color="secondary" onClick={() => onRestore(product.id)}>
                                                <RestoreFromTrashIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <Tooltip title="Vô hiệu hóa (Xóa)">
                                            <IconButton color="error" onClick={() => onDelete(product.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </TableCell>
                            </TableRow>
                            )
                        })
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};