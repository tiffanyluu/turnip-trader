import { useState } from 'react';
import { Button, Alert } from '@mui/material';
import { simulateWeek } from './services/api';
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

      {data?.advice && (
        <IsabelleTextBox 
          message={data.advice}
          isLoading={loading}
        />
      )}
    </AppLayout>
  );
}

export default App;