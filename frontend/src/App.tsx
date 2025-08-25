import { useState } from 'react';
import { Box, Container, Button, Alert } from '@mui/material';
import { simulateWeek, predictPattern, getAdvice } from './services/api';
import IsabelleTextBox from './components/shared/IsabelleTextBox';
import TurnipCard from './components/shared/TurnipCard';
import PatternChart from './components/shared/PatternChart';
import type { TurnipPattern } from './types/turnip';

interface SimulateData {
  id: number;
  pattern: TurnipPattern;
  buyPrice: number;
  prices: number[];
  weekDate: string;
}

function App() {
  const [data, setData] = useState<SimulateData | null>(null);
  const [advice, setAdvice] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleSimulate = async () => {
    try {
      setLoading(true);
      setAdvice('');
      setError('');
      const result = await simulateWeek();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    if (!data?.prices) return;
    
    try {
      setLoading(true);
      setAdvice('');
      setError('');
      const prediction = await predictPattern(data.prices);
      console.log('Prediction:', prediction);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const handleGetAdvice = async () => {
    if (!data?.prices) return;
    
    try {
      setLoading(true);
      setAdvice('Loading...');
      setError('');
      const result = await getAdvice(data.prices, data.pattern);
      setAdvice(result.advice);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setAdvice('')
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 3 }}>
        <Button variant="contained" onClick={handleSimulate} disabled={loading}>
          {loading ? 'Simulating...' : 'Simulate Week'}
        </Button>
        <Button variant="outlined" onClick={handlePredict} disabled={!data || loading}>
          Predict Pattern
        </Button>
        <Button variant="outlined" onClick={handleGetAdvice} disabled={!data || loading}>
          Get Advice
        </Button>
      </Box>

      {data && (
        <>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, my: 3 }}>
            <TurnipCard 
              title="Current Pattern"
              pattern={data.pattern}
            />
            <TurnipCard 
              title="Buy Price"
              price={data.buyPrice}
              icon="💰"
            />
          </Box>

          <PatternChart 
            prices={data.prices}
            buyPrice={data.buyPrice}
            pattern={data.pattern}
          />
        </>
      )}

      {(advice || (loading && advice === 'Loading...')) && (
        <Box sx={{ mt: 6 }}> {/* More space if needed */}
          <IsabelleTextBox 
            message={advice || 'Loading...'} 
            isLoading={loading && advice === 'Loading...'} 
          />
        </Box>
      )}
    </Container>
  );
}

export default App;