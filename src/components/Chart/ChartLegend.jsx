import React from 'react';
import { Box, Typography, Stack } from '@mui/material';

function ChartLegend({ legends }) {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
      mt={2}
      sx={{ color: 'text.secondary' }}
    >
      {legends.map((legend) => (
        <Stack direction="row" alignItems="center" key={legend.title} spacing={1}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              bgcolor: legend.color,
            }}
          />
          <Typography variant="body2">{legend.title}</Typography>
        </Stack>
      ))}
    </Stack>
  );
}

export default ChartLegend;
