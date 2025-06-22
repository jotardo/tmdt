import React, { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Button,
  Typography,
  Box,
  Chip,
  Avatar,
  IconButton,
  Fade,
} from '@mui/material';
import { ThumbUp, Share } from '@mui/icons-material';
import CommentForm from '../Comment/CommentForm';
import CommentList from '../Comment/CommentList';
import { formatDistanceToNow } from 'date-fns';
import { se, vi } from 'date-fns/locale';
import { useAuth } from '../../../context/AuthContext';
import commentApi from '../../../backend/db/commentApi';

function TopicDetail({ topic, onBack }) {
  const { user } = useAuth();
  const [comments, setComments] = useState(topic?.comments || []);
  const [likes, setLikes] = useState(topic?.likes || 0);
  const [liked, setLiked] = useState(false);
  const { user: authUser } = useAuth();
  const userDetails = user || authUser || JSON.parse(localStorage.getItem('user')) || { id: null, username: 'Khách', avatar: '' };
  const authorID = userDetails?.id ?? null;

  useEffect(() => {
    const fetchCommentsNoParent = async () => {
      const response = await commentApi.fetchAllCommentNoParent(topic.id);
      setComments(response);
    }
    fetchCommentsNoParent();
  }, [topic.id]);


  const handleCommentSubmit = (newComment, tempId) => {
    if (!newComment && tempId) {
      // Xóa bình luận tạm nếu lỗi
      setComments((prev) =>
        prev.filter((c) => c.id !== tempId)
      );
      return;
    }

    setComments((prev) => {
      if (tempId) {
        // Thay bình luận tạm bằng bình luận từ server
        return prev.map((c) =>
          c.id === tempId ? newComment : c
        );
      }
      if (newComment.parentCommentId) {
        // Thêm bình luận con
        const addReply = (cmts) =>
          cmts.map((c) =>
            c.id === newComment.parentCommentId
              ? { ...c, childComments: [...(c.childComments || []), newComment] }
              : { ...c, childComments: addReply(c.childComments || []) }
          );
        return addReply(prev);
      }
      // Thêm bình luận cấp 1
      return [...prev, newComment];
    });
  };

  const handleLike = () => {
    setLikes(liked ? likes - 1 : likes + 1);
    setLiked(!liked);
  };

  if (!topic || typeof topic !== 'object') {
    return (
      <Box sx={{ p: 3, bgcolor: 'background.default' }}>
        <Button onClick={onBack} variant="outlined" sx={{ mb: 2, borderRadius: 2 }}>
          Quay lại
        </Button>
        <Typography variant="h6" color="error">
          Không tìm thấy chủ đề
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box sx={{ p: { xs: 2, md: 4 }, bgcolor: 'background.default' }}>
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            bgcolor: 'white',
            p: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            {topic.title || 'Chưa có tiêu đề'}
          </Typography>
          <Button
            onClick={onBack}
            variant="outlined"
            sx={{
              borderRadius: 2,
              '&:hover': { bgcolor: 'grey.100', transform: 'scale(1.05)' },
              transition: 'all 0.2s ease',
            }}
          >
            Quay lại
          </Button>
        </Box>
        <Card sx={{ mb: 4, borderRadius: 3, boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)' }}>
          <Box sx={{ bgcolor: 'primary.main', p: 3, color: 'white' }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {topic.title || 'Chưa có tiêu đề'}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={`http://localhost:8080/api/user/${topic.avatar}` || ''}
                alt={topic.author || 'Ẩn danh'}
                sx={{ width: 40, height: 40 }}
              />
              <Box>
                <Typography variant="subtitle2">{userDetails.username || 'Ẩn danh'}</Typography>
                <Typography variant="caption">
                  {topic.createdAt
                    ? formatDistanceToNow(new Date(topic.createdAt), { locale: vi, addSuffix: true })
                    : 'Không rõ thời gian'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 2 }}>
              {topic.content || 'Chưa có nội dung'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
              <Typography variant="caption" color="text.secondary">
                💬 {comments.length} bình luận
              </Typography>
              <Typography variant="caption" color="text.secondary">
                👀 {topic.views || 0} lượt xem
              </Typography>
            </Box>
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={topic.categoryName || 'Chưa có danh mục'}
                  size="small"
                  sx={{ bgcolor: 'secondary.light', color: 'secondary.main' }}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  onClick={handleLike}
                  sx={{
                    color: liked ? 'primary.main' : 'grey.500',
                    '&:hover': { bgcolor: 'grey.100', transform: 'scale(1.1)' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <ThumbUp fontSize="small" />
                  <Typography variant="caption" sx={{ ml: 0.5 }}>
                    {likes}
                  </Typography>
                </IconButton>
                <IconButton
                  sx={{
                    color: 'grey.500',
                    '&:hover': { bgcolor: 'grey.100', transform: 'scale(1.1)' },
                    transition: 'all 0.2s ease',
                  }}
                >
                  <Share fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </CardContent>
        </Card>
        <CommentForm
          onSubmit={handleCommentSubmit}
          user={user}
          topicId={topic.id} // Truyền topicId
        />
        <CommentList comments={comments} onReply={handleCommentSubmit} />
      </Box>
    </Fade>
  );
}

export default TopicDetail;