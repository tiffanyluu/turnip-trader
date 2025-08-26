import React from 'react';
import { Box } from '@mui/material';

interface ControlsSectionProps {
  children: React.ReactNode;
}

const ControlsSection: React.FC<ControlsSectionProps> = ({ children }) => {
  return (
    <Box sx={{ textAlign: 'center' }}>
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