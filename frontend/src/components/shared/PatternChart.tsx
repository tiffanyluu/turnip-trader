import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface PatternChartProps {
  prices: number[];
  buyPrice?: number;
  title?: string;
  pattern?: string;
}

const PatternChart: React.FC<PatternChartProps> = ({
  prices,
  buyPrice,
  title = "Turnip Prices This Week",
  pattern
}) => {
  const theme = useTheme();

  const chartData = prices.map((price, index) => {
    const days = ['Mon AM', 'Mon PM', 'Tue AM', 'Tue PM', 'Wed AM', 'Wed PM', 
                  'Thu AM', 'Thu PM', 'Fri AM', 'Fri PM', 'Sat AM', 'Sat PM'];
    
    return {
      day: days[index] || `Day ${index + 1}`,
      price: price,
      buyPrice: buyPrice || 100, // Reference line
    };
  });

  const getLineColor = () => {
    switch (pattern?.toLowerCase()) {
      case 'spike': return theme.palette.success.main;
      case 'decreasing': return theme.palette.error.main;
      case 'random': return theme.palette.warning.main;
      case 'flat': return theme.palette.info.main;
      case 'mixed': return theme.palette.secondary.main;
      default: return theme.palette.primary.main;
    }
  };

  return (
    <Box sx={{ width: '100%', height: 300 }}>
      {title && (
        <Typography 
          variant="h6" 
          sx={{ 
            mb: 2, 
            textAlign: 'center',
            color: 'primary.dark' 
          }}
        >
          {title}
        </Typography>
      )}
      
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.grey[300]} />
          
          <XAxis 
            dataKey="day" 
            tick={{ fontSize: 12, fontWeight: 700 }}
            stroke={theme.palette.text.secondary}
          />
          
          <YAxis 
            tick={{ fontSize: 12, fontWeight: 700  }}
            stroke={theme.palette.text.secondary}
            label={{ value: 'Bells', angle: -90, position: 'insideLeft' }}
          />
          
          <Tooltip
            contentStyle={{
              backgroundColor: theme.palette.background.paper,
              border: `1px solid ${theme.palette.primary.light}`,
              borderRadius: '8px',
            }}
          />
          
          {buyPrice && (
            <Line
              type="monotone"
              dataKey="buyPrice"
              stroke={theme.palette.grey[400]}
              strokeDasharray="5 5"
              dot={false}
              strokeWidth={2}
              name="Buy Price"
            />
          )}
          
          <Line
            type="monotone"
            dataKey="price"
            stroke={getLineColor()}
            strokeWidth={3}
            dot={{ fill: getLineColor(), strokeWidth: 2, r: 4 }}
            name="Sell Price"
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  );
};

export default PatternChart;