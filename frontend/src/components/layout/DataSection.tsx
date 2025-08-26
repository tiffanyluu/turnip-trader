import React from 'react';
import { Box } from '@mui/material';

interface DataSectionProps {
  cards?: React.ReactNode;
  chart?: React.ReactNode;
}

const DataSection: React.FC<DataSectionProps> = ({ cards, chart }) => {
  return (
    <Box sx={{ 
      width: '100%', 
      maxWidth: '600px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 2
    }}>
      {cards && (
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2, 
          width: '100%',
          justifyContent: 'center'
        }}>
          {cards}
        </Box>
      )}
      
      {chart && (
        <Box sx={{
          backgroundColor: 'background.paper',
          borderRadius: 3,
          p: 1.5,
          border: '2px solid',
          borderColor: 'primary.light',
          width: '100%',
        }}>
          {chart}
        </Box>
      )}
    </Box>
  );
};

export default DataSection;