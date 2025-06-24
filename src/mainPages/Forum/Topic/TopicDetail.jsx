import React, { useEffect, useState, useCallback } from 'react';
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
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ThumbUp, Share } from '@mui/icons-material';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useAuth } from '../../../context/AuthContext';
import commentApi from '../../../backend/db/commentApi';
import CommentForm from '../Comment/CommentForm';
import CommentList from '../Comment/CommentList';
import PropTypes from 'prop-types';
import TopicHeader from './TopicHeader';
import TopicActions from './TopicActions';
function TopicDetail({ topic, onBack }) {
  const { user: authUser } = useAuth();
  const [comments, setComments] = useState(topic?.comments || []);
  const [likes, setLikes] = useState(topic?.likes || 0);
  const [liked, setLiked] = useState(false);
  const [loadingComments, setLoadingComments] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // User details with fallback
  const userDetails = authUser || JSON.parse(localStorage.getItem('user')) || {
    id: null,
    username: 'Khách',
    avatar: '',
  };

  // Fetch comments
  useEffect(() => {
    const fetchCommentsNoParent = async () => {
      try {
        setLoadingComments(true);
        const response = await commentApi.fetchAllCommentNoParent(topic.id);
        setComments(response);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoadingComments(false);
      }
    };
    if (topic?.id) {
      fetchCommentsNoParent();
    }
  }, [topic?.id]);

  // Handle comment submission
  const handleCommentSubmit = useCallback((newComment, tempId) => {
    setComments((prev) => {
      if (!newComment && tempId) {
        return prev.filter((c) => c.id !== tempId);
      }
      if (tempId) {
        return prev.map((c) => (c.id === tempId ? newComment : c));
      }
      if (newComment.parentCommentId) {
        const addReply = (cmts) =>
          cmts.map((c) =>
            c.id === newComment.parentCommentId
              ? { ...c, childComments: [...(c.childComments || []), newComment] }
              : { ...c, childComments: addReply(c.childComments || []) }
          );
        return addReply(prev);
      }
      return [...prev, newComment];
    });
  }, []);

  // Handle like action
  const handleLike = useCallback(() => {
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    setLiked((prev) => !prev);
  }, [liked]);

  // Early return for invalid topic
  if (!topic || typeof topic !== 'object') {
    return (
      <Box sx={{ p: { xs: 2, md: 3 }, bgcolor: 'background.default' }}>
        <TopicHeader title="Không tìm thấy chủ đề" onBack={onBack} />
        <Typography variant="h6" color="error">
          Không tìm thấy chủ đề
        </Typography>
      </Box>
    );
  }

  return (
    <Fade in timeout={800}>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          bgcolor: 'background.default',
          minHeight: '100vh',
        }}
      >
        <TopicHeader title={topic.title} onBack={onBack} />
        <Card
          sx={{
            mb: 4,
            borderRadius: 3,
            boxShadow: theme.shadows[3],
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              bgcolor: theme.palette.background.paper,
              p: { xs: 2, md: 3 },
              borderBottom: `1px solid ${theme.palette.divider}`,
            }}
          >
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              sx={{ fontWeight: 'bold', color: theme.palette.text.primary }}
            >
              {topic.title || 'Chưa có tiêu đề'}
            </Typography>
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={topic.avatar ? `http://localhost:8080/api/user/${topic.avatar}` : ''}
                alt={topic.author || 'Ẩn danh'}
                sx={{ width: 40, height: 40 }}
              >
                {topic.author?.[0]?.toUpperCase() || 'A'}
              </Avatar>
              <Box>
                <Typography variant="subtitle2" color="text.primary">
                  {topic.author || 'Ẩn danh'}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {topic.createdAt
                    ? formatDistanceToNow(new Date(topic.createdAt), {
                        locale: vi,
                        addSuffix: true,
                      })
                    : 'Không rõ thời gian'}
                </Typography>
              </Box>
            </Box>
          </Box>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            {/* Ảnh thumbnail */}
            {topic.thumbnail && (
              <Box
                sx={{
                  mb: 2,
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Box
                  component="img"
                  src={`http://localhost:8080/api/category/${topic.thumbnail}`}
                  alt="Thumbnail"
                  sx={{
                    width: '100%',
                    maxWidth: 600,
                    borderRadius: 2,
                    boxShadow: theme.shadows[2],
                  }}
                />
              </Box>
            )}

            {/* Nội dung */}
            <Typography
              variant="body1"
              sx={{
                lineHeight: 1.8,
                color: 'text.secondary',
                mb: 2,
                whiteSpace: 'pre-wrap',
              }}
            >
              {topic.content || 'Chưa có nội dung'}
            </Typography>

            <Chip
              label={"Sản phầm được đề cập: "+topic.categoryName || 'Chưa có danh mục'}
              size="small"
              sx={{
                bgcolor: topic.categoryName ? theme.palette.grey[100] : theme.palette.grey[50],
                color: topic.categoryName ? theme.palette.grey[800] : theme.palette.grey[600],
                border: `1px solid ${topic.categoryName ? theme.palette.grey[300] : theme.palette.grey[200]}`,
                mb: 1,
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 'medium',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: topic.categoryName ? theme.palette.grey[200] : theme.palette.grey[100],
                  color: topic.categoryName ? theme.palette.grey[900] : theme.palette.grey[700],
                },
              }}
            />

            <TopicActions
              likes={likes}
              liked={liked}
              onLike={handleLike}
              commentsCount={comments.length}
              views={topic.views}
            />
          </CardContent>
        </Card>
        <CommentForm
          onSubmit={handleCommentSubmit}
          user={userDetails}
          topicId={topic.id}
        />
        {loadingComments ? (
          <Typography variant="body2" color="text.secondary" sx={{ p: 2 }}>
            Đang tải bình luận...
          </Typography>
        ) : (
          <CommentList comments={comments} onReply={handleCommentSubmit} />
        )}
      </Box>
    </Fade>
  );
}

TopicDetail.propTypes = {
  topic: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    author: PropTypes.string,
    avatar: PropTypes.string,
    createdAt: PropTypes.string,
    likes: PropTypes.number,
    views: PropTypes.number,
    categoryName: PropTypes.string,
    comments: PropTypes.array,
  }),
  onBack: PropTypes.func.isRequired,
};

export default React.memo(TopicDetail);