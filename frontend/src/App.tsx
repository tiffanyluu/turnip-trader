import { useState } from 'react';
import { Button, Alert, Box } from '@mui/material';
import { simulateWeek } from './services/api';
import AppLayout from './components/Layout';
import IsabelleTextBox from './components/IsabelleTextBox';
import TurnipCard from './components/TurnipCard';
import PatternChart from './components/PatternChart';
import type { TurnipPattern } from './types/turnip';

interface SimulateData {
  id: number;
  pattern: TurnipPattern;
  buyPrice: number;
  prices: number[];
  weekDate: string;
  advice: string;
}

function App() {
  const [data, setData] = useState<SimulateData | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    try {
      setLoading(true);
      setError('');
      setData(null);
      const result = await simulateWeek();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: '1000px' }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ textAlign: 'center' }}>
        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            onClick={handleSimulate}
            disabled={loading}
            size="large"
            sx={{ fontWeight: 'bold' }}
          >
            {loading ? 'Simulating...' : 'Simulate Week'}
          </Button>
        </Box>
      </Box>

      {data && (
        <Box sx={{ width: '100%', maxWidth: '1000px' }}>
          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 3,
            justifyContent: 'center'
          }}>
            <TurnipCard 
              title="Pattern Type"
              pattern={data.pattern}
            />
            <TurnipCard 
              title="Buy Price"
              price={data.buyPrice}
              icon="💰"
            />
          </Box>

          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
            gap: 3,
            alignItems: 'start'
          }}>
            <Box sx={{
              backgroundColor: 'background.paper',
              borderRadius: 3,
              p: 2,
              border: '2px solid',
              borderColor: 'primary.light',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              <PatternChart 
                prices={data.prices}
                buyPrice={data.buyPrice}
                pattern={data.pattern}
              />
            </Box>

            <Box sx={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%'
            }}>
              {data.advice && (
                <IsabelleTextBox 
                  message={data.advice}
                />
              )}
            </Box>
          </Box>
        </Box>
      )}
    </AppLayout>
  );
}

export default App;