import React, { useState } from 'react';
import {
  Box,
  Typography,
  Avatar,
  Button,
  Collapse,
  Divider,
  Fade,
  Chip,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import commentApi from '../../../backend/db/commentApi';
import { COMMENT_TYPE_MAP, TYPE_STYLE_MAP } from '../../../utils/ollamaApi/types';

function CommentItem({ comment, onReply }) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [childComments, setChildComments] = useState([]);
  const isAuthor = comment.userID ?? null;

  console.log('CommentItem props:', comment);
  

  const handleToggleReplies = async () => {
    if (!showReplies && childComments.length === 0) {
      try {
        const response = await commentApi.fetchAllCommentChild(comment.id);
        setChildComments(response);
      } catch (error) {
        console.error('Lỗi khi tải bình luận con:', error);
      }
    }
    setShowReplies(!showReplies);
  };
  // Xác định nhãn kiểu bình luận
  const commentTypeLabel = COMMENT_TYPE_MAP[comment.type] || comment.type || 'Khác';
  // Lấy style cho chip dựa trên commentTypeLabel
  const chipStyle = TYPE_STYLE_MAP[commentTypeLabel] || TYPE_STYLE_MAP['Khác'];

  return (
    <Fade in timeout={500}>
      <Box
        sx={{
          p: 2,
          '&:hover': { bgcolor: 'grey.50' },
          transition: 'background-color 0.3s ease',
        }}
      >
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
          <Avatar
            src={`http://localhost:8080/api/user/${comment.avatar}` || ''}
            alt={comment.authorName || 'Ẩn danh'}
            sx={{ width: 36, height: 36 }}
          />
          <Box sx={{ flex: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'medium', display: 'flex', alignItems: 'center', gap: 1 }}>
                {comment.authorName || 'Ẩn danh'}
                {isAuthor && (
                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 'bold' }}>
                    (Tác giả)
                  </Typography>
                )}
                <Chip
                  label={commentTypeLabel}
                  size="small"
                  sx={{
                    ...chipStyle,
                    fontSize: '0.75rem',
                    height: '20px',
                  }}
                />
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {comment.createdAt
                  ? formatDistanceToNow(new Date(comment.createdAt), { locale: vi })
                  : 'Không rõ thời gian'} trước
              </Typography>
            </Box>
            <Typography
              variant="body2"
              sx={{ mt: 0.5, lineHeight: 1.6, color: 'text.secondary', textAlign: 'left' }}
            >
              {comment.content || 'Chưa có nội dung'}
            </Typography>
            <Box sx={{ mt: 1, display: 'flex', gap: 2 }}>
              <Button
                size="small"
                sx={{ textTransform: 'none', color: 'primary.main' }}
                onClick={() => setShowReplyForm(!showReplyForm)}
              >
                Trả lời
              </Button>
              <Button
                size="small"
                sx={{ textTransform: 'none', color: 'primary.main' }}
                onClick={handleToggleReplies}
              >
                {showReplies ? 'Ẩn các bình luận con' : 'Xem các bình luận con'}
              </Button>
            </Box>
            <Collapse in={showReplyForm}>
              <CommentForm
                onSubmit={onReply}
                parentId={comment.id}
                onCancel={() => setShowReplyForm(false)}
                topicId={comment.topicID}
              />
            </Collapse>
          </Box>
        </Box>
        <Collapse in={showReplies}>
          <Box sx={{ ml: 6 }}>
            <Divider sx={{ my: 2, borderColor: 'grey.200' }} />
            {childComments.length > 0 ? (
              <CommentList comments={childComments} onReply={onReply} />
            ) : (
              <Typography variant="body2" color="text.secondary" sx={{ py: 2 }}>
                Không có bình luận nào
              </Typography>
            )}
          </Box>
        </Collapse>
      </Box>
    </Fade>
  );
}

export default CommentItem;