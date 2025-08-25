import { useState } from 'react';
import { Button, Alert } from '@mui/material';
import { simulateWeek, predictPattern, getAdvice } from './services/api';
import AppLayout from './components/layout/AppLayout';
import ControlsSection from './components/layout/ControlsSection';
import DataSection from './components/layout/DataSection';
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
      setError('');
      setAdvice('');
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
      setError('');
      setAdvice('');
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
      setError('');
      setAdvice('Loading...');
      const result = await getAdvice(data.prices, data.pattern);
      setAdvice(result.advice);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setAdvice('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      {error && (
        <Alert severity="error" sx={{ width: '100%', maxWidth: '600px' }}>
          {error}
        </Alert>
      )}
      
      <ControlsSection>
        <Button
          variant="contained"
          onClick={handleSimulate}
          disabled={loading}
          size="large"
        >
          {loading ? 'Simulating...' : 'Simulate Week'}
        </Button>
        <Button
          variant="outlined"
          onClick={handlePredict}
          disabled={!data || loading}
          size="large"
        >
          Predict Pattern
        </Button>
        <Button
          variant="outlined"
          onClick={handleGetAdvice}
          disabled={!data || loading}
          size="large"
        >
          Get Advice
        </Button>
      </ControlsSection>

      {data && (
        <DataSection
          cards={
            <>
              <TurnipCard 
                title="Current Pattern"
                pattern={data.pattern}
              />
              <TurnipCard 
                title="Buy Price"
                price={data.buyPrice}
                icon="💰"
              />
            </>
          }
          chart={
            <PatternChart 
              prices={data.prices}
              buyPrice={data.buyPrice}
              pattern={data.pattern}
            />
          }
        />
      )}

      {(advice || (loading && advice === 'Loading...')) && (
        <IsabelleTextBox 
          message={advice || 'Loading...'} 
          isLoading={loading && advice === 'Loading...'} 
        />
      )}
    </AppLayout>
  );
}

export default App;