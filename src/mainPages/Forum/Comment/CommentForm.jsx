import React, { useState } from 'react';
import { Box, TextField, Button, Avatar, Fade, Alert, CircularProgress } from '@mui/material';
import { useAuth } from '../../../context/AuthContext';
import commentApi from '../../../backend/db/commentApi';
import { toast } from 'react-toastify';
const { callOllamaApi, parseOllamaMessageContent } = require('../../../utils/ollamaApi/callOllamaApi');

function CommentForm({ onSubmit, parentId = null, onCancel, user, topicId }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user: authUser } = useAuth();
  const userDetails = user || authUser || JSON.parse(localStorage.getItem('user')) || { id: null, username: 'Giang', avatar: '' };
  const authorID = userDetails?.id ?? null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Mặc định là bình luận tích cực
    let isPositive = true;

    if (!content.trim()) {
      setError('Bình luận không được để trống');
      return;
    }
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

    // Kiểm tra bình luận bằng API Ollama
    const apiResponse = await callOllamaApi(content);
    const parsedContent = parseOllamaMessageContent(apiResponse);

    // Kiểm tra nếu không phân tích được nội dung bình luận
    if (!parsedContent) {
      toast.error('Không thể phân tích bình luận. Vui lòng thử lại.');
      setError('Không thể phân tích bình luận. Vui lòng thử lại.');
      setLoading(false);
      return;
    }

    // Kiểm tra nếu bình luận tiêu cực hoặc độc hại
    if (parsedContent.sentiment === 'negative' || parsedContent.toxic) {
      isPositive = false; // Đánh dấu là bình luận tiêu cực
      toast.error('Bình luận của bạn chứa nội dung tiêu cực hoặc không phù hợp.');
      setError('Bình luận của bạn chứa nội dung tiêu cực hoặc không phù hợp.');
      setLoading(false);
      return;
    }

    // Lấy kiểu bình luận từ API và ánh xạ sang tiếng Việt
    const commentType = parsedContent.category || 'opinion';

    console.log('Parsed comment type AI Check:', commentType);

    // Kiểm tra nếu bình luận là spam hoặc không liên quan
    if (commentType === 'spam' || commentType === 'irrelevant') {
      toast.error('Bình luận của bạn không phù hợp (spam hoặc không liên quan).');
      setError('Bình luận của bạn không phù hợp (spam hoặc không liên quan).');
      setLoading(false);
      return;
    }

    // Tạo bình luận tạm thời để hiển thị ngay lập tức
    const tempComment = {
      id: `temp-${Date.now()}`,
      content,
      commentType, // Nhãn tiếng Việt
      author: { id: userDetails.id, username: userDetails.username, avatar: userDetails.avatar },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isDeleted: false,
      parentCommentId: parentId,
      childComments: [],
      topicId,
      isPositive,
    };

    onSubmit(tempComment);

    // Gửi bình luận đến BE để lưu vào CSDL
    try {
      const commentData = {
        content,
        userID: parseInt(authorID, 10),
        topicID: parseInt(topicId, 10),
        parentCommentID: parseInt(parentId, 10),
        type: commentType, // Gửi nhãn tiếng Việt
        isPositive,
      };
      const response = await commentApi.createComment(commentData);
      console.log('BE API response:', response);
      if (!response.success) {
        throw new Error(response.responseMessage || 'Tạo bình luận thất bại');
      }
      // onSubmit({ ...tempComment, isTemp: false }, tempComment.id);
      setContent('');
      if (onCancel) onCancel();
      toast.success('Bình luận đã được gửi thành công!');
    } catch (err) {
      console.log('Error creating comment:', err);
      setError(err.message || 'Không thể gửi bình luận. Vui lòng thử lại.');
      toast.error(err.message || 'Không thể gửi bình luận.');
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
                bgcolor: '#FAFAFA',
                '&:hover fieldset': { borderColor: '#1976D2' },
                '&.Mui-focused fieldset': { borderColor: '#1976D2' },
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
                  color: '#616161',
                  '&:hover': { bgcolor: '#F5F5F5' },
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
                bgcolor: '#1976D2',
                '&:hover': {
                  bgcolor: '#1565C0',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                },
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              {loading && <CircularProgress size={16} color="inherit" />}
              {loading ? 'Đang gửi...' : 'Gửi'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}

export default CommentForm;