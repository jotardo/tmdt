import React, { useEffect, useState, useCallback } from 'react';
import {
  Button,
  Typography,
  Box,
  useTheme,
} from '@mui/material';

// Reusable TopicHeader component
const TopicHeader = ({ title, onBack }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        position: 'sticky',
        top: 0,
        zIndex: 10,
        bgcolor: theme.palette.background.paper,
        p: { xs: 1, md: 2 },
        boxShadow: theme.shadows[1],
        mb: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Typography
        variant="h6"
        noWrap
        sx={{
          flexGrow: 1,
          fontWeight: 'bold',
          color: theme.palette.text.primary,
        }}
      >
        {title || 'Chưa có tiêu đề'}
      </Typography>
      <Button
        onClick={onBack}
        variant="outlined"
        aria-label="Quay lại"
        sx={{
          borderRadius: 8,
          textTransform: 'none',
          '&:hover': {
            bgcolor: theme.palette.action.hover,
            transform: 'translateY(-1px)',
          },
          transition: 'all 0.2s ease',
        }}
      >
        Quay lại
      </Button>
    </Box>
  );
};

export default TopicHeader;