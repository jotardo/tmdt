import React, { useState } from 'react';
import { Box, TextField, Button, Avatar, Fade, Alert } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import commentApi from '../../../backend/db/commentApi';

function CommentForm({ onSubmit, parentId = null, onCancel, user, topicId }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user: authUser } = useAuth();
  const userDetails = user || authUser || JSON.parse(localStorage.getItem('user')) || { id: null, username: 'Khách', avatar: '' };
  const authorID = userDetails?.id ?? null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    if (!authorID) {
      setError('Vui lòng đăng nhập để bình luận');
      return;
    }
    if (!topicId) {
      setError('Không tìm thấy chủ đề');
      return;
    }

    setLoading(true);
    setError(null);

    const tempComment = {
      id: `temp-${Date.now()}`,
      content,
      author: { id: userDetails.id, username: userDetails.username, avatar: userDetails.avatar },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      parentCommentId: parentId,
      childComments: [],
      topicId,
    };

    onSubmit(tempComment);

    try {
      const commentData = {
        content,
        userID: authorID,
        topicID: topicId,
        parentCommentID: parentId || 0, // 0 nếu là bình luận gốc
      };
      const response = await commentApi.createComment(commentData);
      console.log('API response:', response);
      if (!response.isSuccess) {
        throw new Error(response.responseMessage || 'Tạo bình luận thất bại');
      }
      onSubmit({ ...tempComment, isTemp: false }, tempComment.id);
      setContent('');
      if (onCancel) onCancel();
    } catch (err) {
      setError(err.message || 'Không thể gửi bình luận. Vui lòng thử lại.');
      onSubmit(null, tempComment.id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          mt: parentId ? 2 : 4,
          display: 'flex',
          gap: 2,
          alignItems: 'flex-start',
          px: parentId ? 4 : 0,
        }}
      >
        <Avatar src={`http://localhost:8080/api/user/${userDetails.avatar}`} alt={userDetails.username} sx={{ width: 36, height: 36 }} />
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <TextField
            placeholder="Viết bình luận..."
            multiline
            rows={parentId ? 2 : 3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            fullWidth
            variant="outlined"
            disabled={loading}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                bgcolor: 'grey.50',
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
              },
            }}
          />
          <Box sx={{ display: 'flex', gap: 1, alignSelf: 'flex-end' }}>
            {parentId && (
              <Button
                onClick={onCancel}
                disabled={loading}
                sx={{
                  textTransform: 'none',
                  color: 'grey.600',
                  '&:hover': { bgcolor: 'grey.100' },
                }}
              >
                Hủy
              </Button>
            )}
            <Button
              type="submit"
              variant="contained"
              disabled={!content.trim() || loading}
              sx={{
                textTransform: 'none',
                borderRadius: 2,
                px: 3,
                py: 0.5,
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {loading ? 'Đang gửi...' : 'Gửi'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}

export default CommentForm;