import React from 'react';
import { Box } from '@mui/material';

function RoundIcon({
  icon: Icon,
  iconColor = 'primary.main',
  bgColor = 'primary.light',
  size = 40,
  iconSize = 20,
  sx = {},
}) {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: size,
        height: size,
        borderRadius: '50%',
        bgcolor: bgColor,
        color: iconColor,
        ...sx,
      }}
    >
      <Icon sx={{ fontSize: iconSize }} />
    </Box>
  );
}

export default RoundIcon;
