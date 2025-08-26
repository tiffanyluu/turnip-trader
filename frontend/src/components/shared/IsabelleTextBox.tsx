import React from 'react';
import { Box, Paper, Typography, Avatar } from '@mui/material';

interface IsabelleTextBoxProps {
  message: string;
  isLoading?: boolean;
}

const IsabelleTextBox: React.FC<IsabelleTextBoxProps> = ({ 
  message, 
  isLoading = false 
}) => {
  return (
    <Paper
      elevation={3}
      data-testid="isabelle-textbox"
      sx={{
        position: 'relative',
        backgroundColor: '#FFF8DC', // Cream background
        border: '3px solid #8B4513', // Brown border
        borderRadius: '20px',
        padding: '20px 24px',
        margin: '16px 0',
        minHeight: '80px',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        boxShadow: '4px 4px 0px #654321, 8px 8px 0px rgba(0,0,0,0.1)',
      }}
    >
      <Avatar
        sx={{
          width: 60,
          height: 60,
          backgroundColor: '#FFD700',
          color: '#8B4513',
          fontSize: '36px',
          border: '2px solid #8B4513',
        }}
      >
        🐶
      </Avatar>

      <Box sx={{ flex: 1 }}>
        <Typography
          variant="body1"
          sx={{
            fontFamily: '"Comic Neue", "Nunito", sans-serif',
            fontSize: '20px',
            lineHeight: 1.5,
            color: '#2D4A2D',
            fontWeight: 700,
            textAlign: 'center'
          }}
        >
          {isLoading ? (
            <Box
              sx={{
                display: 'inline-block',
                animation: 'blink 1.4s infinite both',
                '@keyframes blink': {
                  '0%, 50%': { opacity: 1 },
                  '51%, 100%': { opacity: 0 },
                },
              }}
            >
              Thinking...
            </Box>
          ) : (
            message
          )}
        </Typography>
      </Box>

      <Box
        sx={{
          position: 'absolute',
          bottom: '-10px',
          left: '80px',
          width: 0,
          height: 0,
          borderLeft: '15px solid transparent',
          borderRight: '15px solid transparent',
          borderTop: '15px solid #8B4513',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: '-7px',
          left: '82px',
          width: 0,
          height: 0,
          borderLeft: '13px solid transparent',
          borderRight: '13px solid transparent',
          borderTop: '13px solid #FFF8DC',
        }}
      />
    </Paper>
  );
};

export default IsabelleTextBox;