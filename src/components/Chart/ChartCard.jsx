import React from 'react';
import { Box, Typography } from '@mui/material';

function Chart({ children, title }) {
  return (
    <Box 
      sx={{ 
        minWidth: 0, 
        p: 4, 
        bgcolor: 'white', 
        borderRadius: 2, 
        boxShadow: 1, 
        dark: { bgcolor: 'grey.800' }
      }}
    >
      <Typography variant="h6" sx={{ mb: 4, color: 'text.primary' }}>
        {title}
      </Typography>
      {children}
    </Box>
  );
}

export default Chart;
