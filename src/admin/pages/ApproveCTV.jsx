import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ApproveCTV = () => {
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [expandedId, setExpandedId] = useState(null); // ID đang mở

    useEffect(() => {
        const fetchPendingUsers = async () => {
            setLoading(true);
            try {
                const response = await axios.get('http://localhost:8080/api/user/ctv-pending');
                setPendingUsers(response.data);
            } catch (error) {
                setMessage('Đã có lỗi xảy ra khi lấy danh sách người dùng.');
            } finally {
                setLoading(false);
            }
        };
        fetchPendingUsers();
    }, []);

    const toggleExpand = (id) => {
        setExpandedId(expandedId === id ? null : id);
    };

    const handleApprove = async (id) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8080/api/user/${id}/confirm-CTV?isConfirmed=true`);
            setMessage(response.data.responseMessage);
            setPendingUsers(prev => prev.filter(user => user.id !== id));
            setExpandedId(null);
        } catch (error) {
            setMessage('Đã có lỗi xảy ra khi duyệt CTV.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async (id) => {
        setLoading(true);
        try {
            const response = await axios.post(`http://localhost:8080/api/user/${id}/confirm-CTV?isConfirmed=false`);
            setMessage(response.data.responseMessage);
            setPendingUsers(prev => prev.filter(user => user.id !== id));
            setExpandedId(null);
        } catch (error) {
            setMessage('Đã có lỗi xảy ra khi từ chối CTV.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="approve-ctv-container">
            <h2>Danh sách hồ sơ CTV chờ duyệt</h2>
            {pendingUsers.length > 0 ? (
                pendingUsers.map(user => (
                    <div key={user.id} className="ctv-panel">
                        <div
                            className="ctv-summary"
                            onClick={() => toggleExpand(user.id)}
                        >
                            <strong>{user.lastName} {user.firstName}</strong> - {user.emailId}
                            <span className="toggle-icon">{expandedId === user.id ? '▲' : '▼'}</span>
                        </div>

                        {expandedId === user.id && (
                            <div className="ctv-details">
                                <p><strong>SĐT:</strong> {user.phoneNo}</p>
                                <p><strong>Tỉnh/Thành:</strong> {user.location || 'Không rõ'}</p>
                                <p><strong>Kỹ năng & Kinh nghiệm:</strong> {user.experienceAndSkills|| 'Không cung cấp'}</p>
                                <p><strong>Link sản phẩm:</strong>
                                    {user.sampleWorkLink
                                        ? <a href={user.sampleWorkLink} target="_blank" rel="noreferrer">{user.sampleWorkLink}</a>
                                        : ' Không có'}
                                </p>
                                <p><strong>Lý do hợp tác:</strong> {user.reason || 'Không cung cấp'}</p>
                                <div className="ctv-action-buttons">
                                    <button onClick={() => handleApprove(user.id)} disabled={loading}>✔ Duyệt</button>
                                    <button onClick={() => handleReject(user.id)} disabled={loading}>✖ Từ chối</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <p>Không có hồ sơ nào chờ duyệt.</p>
            )}
            {message && <p className="response-message">{message}</p>}
        </div>
    );
};

export default ApproveCTV;
