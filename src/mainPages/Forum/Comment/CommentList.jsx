import React from 'react';
import { Box, Typography, Divider, List, Slide } from '@mui/material';
import CommentItem from './CommentItem';

function CommentList({ comments, onReply }) {
  if (!Array.isArray(comments)) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Bình luận (0)</Typography>
        <Divider sx={{ my: 2, borderColor: 'grey.300', borderWidth: 1 }} />
        <Typography color="text.secondary">Chưa có bình luận.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'text.primary' }}>
        Bình luận ({comments.length})
      </Typography>
      <Divider sx={{ my: 2, borderColor: 'grey.300', borderWidth: 1 }} />
      <List sx={{ bgcolor: 'white', borderRadius: 2, boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)' }}>
        {comments.map((comment) => (
          <Slide key={comment.id} direction="up" in={true} mountOnEnter>
            <Box>
              <CommentItem
                comment={{
                  ...comment,
                  replyCount: comment.childComments?.length || 0,
                }}
                onReply={onReply}
              />
            </Box>
          </Slide>
        ))}
      </List>
    </Box>
  );
}

export default CommentList;