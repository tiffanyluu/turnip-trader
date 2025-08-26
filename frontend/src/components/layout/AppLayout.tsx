import React from 'react';
import { Box, Container, Typography, AppBar, Toolbar } from '@mui/material';

interface AppLayoutProps {
  children: React.ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <AppBar 
        position="static" 
        elevation={0}
        sx={{
          background: 'linear-gradient(135deg, #8FBC8F 0%, #556B2F 100%)',
          borderBottom: '3px solid #228B22',
        }}
      >
        <Toolbar sx={{ justifyContent: 'center', py: 1 }}>
          <Typography
            variant="h4"
            sx={{
              fontFamily: '"Comic Neue", "Nunito", sans-serif',
              fontWeight: 800,
              color: '#FFF8DC',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: 1,
            }}
          >
            🥕 Turnip Trader 🍃
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 3, flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            alignItems: 'center',
            width: '100%',
          }}
        >
          {children}
        </Box>
      </Container>

      <Box
        component="footer"
        sx={{
          py: 1,
          textAlign: 'center',
          backgroundColor: 'primary.light',
          borderTop: '2px solid',
          borderColor: 'primary.main',
        }}
      >
        <Typography variant="body2" sx={{ color: 'primary.dark', fontWeight: 500 }}>
          Made with 💚 for Animal Crossing fans
        </Typography>
      </Box>
    </Box>
  );
};

export default AppLayout;
