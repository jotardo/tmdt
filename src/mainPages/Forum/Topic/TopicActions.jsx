import React, { useEffect, useState, useCallback } from 'react';
import {
  Typography,
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { ThumbUp, Share } from '@mui/icons-material';

// Reusable TopicActions component
const TopicActions = ({ likes, liked, onLike, commentsCount, views }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        mt: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Typography variant="caption" color="text.secondary">
          💬 {commentsCount} bình luận
        </Typography>
        <Typography variant="caption" color="text.secondary">
          👀 {views || 0} lượt xem
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={onLike}
          aria-label={liked ? 'Bỏ thích' : 'Thích'}
          sx={{
            color: liked ? theme.palette.primary.main : theme.palette.grey[500],
            '&:hover': {
              bgcolor: theme.palette.action.hover,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <ThumbUp fontSize="small" />
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            {likes}
          </Typography>
        </IconButton>
        <IconButton
          aria-label="Chia sẻ"
          sx={{
            color: theme.palette.grey[500],
            '&:hover': {
              bgcolor: theme.palette.action.hover,
              transform: 'scale(1.1)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Share fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopicActions;