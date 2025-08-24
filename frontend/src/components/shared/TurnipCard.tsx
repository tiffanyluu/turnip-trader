import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';

interface TurnipCardProps {
  title: string;
  price?: number;
  pattern?: string;
  confidence?: number;
  children?: React.ReactNode;
  icon?: string;
}

const TurnipCard: React.FC<TurnipCardProps> = ({
  title,
  price,
  pattern,
  confidence,
  children,
  icon = '🥕'
}) => {
    const getPatternColor = (pattern?: string): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' => {
        switch (pattern?.toLowerCase()) {
          case 'spike': return 'success';
          case 'decreasing': return 'error'; 
          case 'random': return 'warning';
          case 'flat': return 'info';
          case 'mixed': return 'secondary';
          default: return 'default';
        }
      };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 16px rgba(0,0,0,0.15)',
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 2 
          }}
        >
          <Typography variant="h3" component="span">
            {icon}
          </Typography>
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              fontWeight: 600,
              color: 'primary.dark',
            }}
          >
            {title}
          </Typography>
        </Box>

        {price && (
          <Typography
            variant="h4"
            sx={{
              color: '#B8860B',
              fontWeight: 800,
              mb: 1,
              textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
            }}
          >
            {price} Bells
          </Typography>
        )}

        {pattern && (
          <Box sx={{ mb: 2 }}>
            <Chip
              label={pattern.charAt(0).toUpperCase() + pattern.slice(1)}
              color={getPatternColor(pattern)}
              variant="filled"
              sx={{ fontWeight: 700 }}
            />
          </Box>
        )}

        {confidence && (
          <Typography
            variant="body2"
            sx={{ 
              color: 'text.secondary',
              mb: 1,
              fontWeight: 700,
            }}
          >
            Confidence: {Math.round(confidence * 100)}%
          </Typography>
        )}

        {children}
      </CardContent>
    </Card>
  );
};

export default TurnipCard;