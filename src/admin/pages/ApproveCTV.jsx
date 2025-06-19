import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Typography,
    Paper,
    Collapse,
    Table,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    IconButton,
    CircularProgress,
    Alert
} from '@mui/material';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import axios from 'axios';

const ApproveCTV = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedId, setExpandedId] = useState(null);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const fetchPendingUsers = async () => {
            setLoading(true);
            try {
                const res = await axios.get('http://localhost:8080/api/user/ctv-pending');
                setPendingUsers(res.data);
            } catch (err) {
                setMessage('Lỗi khi tải danh sách CTV chờ duyệt.');
            } finally {
                setLoading(false);
            }
        };
        fetchPendingUsers();
    }, []);

    console.log('Pending Users:', pendingUsers);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleConfirm = async (id, isConfirmed) => {
        setLoading(true);
        try {
            const res = await axios.post(`http://localhost:8080/api/user/${id}/confirm-CTV?isConfirmed=${isConfirmed}`);
            setMessage(res.data.responseMessage);
            setPendingUsers(prev => prev.filter(user => user.id !== id));
            setExpandedId(null);
        } catch {
            setMessage('Lỗi khi xử lý yêu cầu.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" gutterBottom>
                Duyệt hồ sơ CTV
            </Typography>

            {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

            {loading ? (
                <CircularProgress />
            ) : (
                <Paper>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Họ tên</TableCell>
                                <TableCell>Email</TableCell>
                                <TableCell>SĐT</TableCell>
                                <TableCell>Tỉnh/Thành</TableCell>
                                <TableCell>Thao tác</TableCell>
                                <TableCell></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {pendingUsers.map((user) => (
                                <React.Fragment key={user.id}>
                                    <TableRow>
                                        <TableCell>{user.lastName} {user.firstName}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.phoneNo}</TableCell>
                                        <TableCell>{user.location}</TableCell>
                                        <TableCell>
                                            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                                                <Button variant="contained" color="success" onClick={() => handleConfirm(user.id, true)}>✔ Duyệt</Button>
                                                <Button variant="outlined" color="error" onClick={() => handleConfirm(user.id, false)}>✖ Từ chối</Button>
                                            </Box>
                                        </TableCell>
                                        <TableCell>
                                            <IconButton onClick={() => toggleExpand(user.id)}>
                                                {expandedId === user.id ? <ExpandLess /> : <ExpandMore />}
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                    <TableRow>
                                        <TableCell colSpan={4} sx={{ p: 0 }}>
                                            <Collapse in={expandedId === user.id} timeout="auto" unmountOnExit>
                                                <Box sx={{ padding: 2, bgcolor: '#f9f9f9' }}>
                                                    {/*<p><strong>Tỉnh/Thành:</strong> {user.location || 'Không rõ'}</p>*/}
                                                    <p><strong>Kinh nghiệm & Kỹ năng:</strong> {user.experienceAndSkills || 'Không cung cấp'}</p>
                                                    <p><strong>Link sản phẩm:</strong>
                                                        {user.sampleWorkLink ? (
                                                            <a href={user.sampleWorkLink} target="_blank" rel="noreferrer">
                                                                {user.sampleWorkLink}
                                                            </a>
                                                        ) : ' Không có'}
                                                    </p>
                                                    <p><strong>Lý do hợp tác:</strong> {user.reason || 'Không cung cấp'}</p>
                                                </Box>
                                            </Collapse>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            ))}
                            {pendingUsers.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">Không có hồ sơ nào chờ duyệt.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Paper>
            )}
        </Box>
    );
};

export default ApproveCTV;
