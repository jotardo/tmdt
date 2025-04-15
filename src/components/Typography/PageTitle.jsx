import React from 'react';
import { Typography } from '@mui/material';

function PageTitle({ children }) {
  return (
    <Typography
      variant="h4"
      sx={{
        my: 3,
        fontWeight: 600,
        color: (theme) =>
          theme.palette.mode === 'dark'
            ? theme.palette.grey[200]
            : theme.palette.grey[700],
      }}
    >
      {children}
    </Typography>
  );
}

export default PageTitle;
