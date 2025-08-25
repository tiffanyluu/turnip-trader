import React from 'react';
import { Box, Typography } from '@mui/material';

interface ControlsSectionProps {
  children: React.ReactNode;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({ children }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          color: 'primary.dark',
          fontWeight: 600,
        }}
      >
        Trading Tools
      </Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: 2,
      }}>
        {children}
      </Box>
    </Box>
  );
};

export default ControlsSection;