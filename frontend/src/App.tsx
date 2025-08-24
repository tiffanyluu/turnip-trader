import {Box, Container} from '@mui/material';
import IsabelleTextBox from './components/shared/IsabelleTextBox';
import TurnipCard from './components/shared/TurnipCard';
import PatternChart from './components/shared/PatternChart';

const App = () => {
  return (
    <Container maxWidth='md' sx={{py: 4}}>
      <IsabelleTextBox message="Welcome to Turnip Trader! I'll help you maximize your bell profits!" />
      <Box sx={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, my: 3}}>
        <TurnipCard 
          title='Current Price'
          price={145}
          pattern='spike'
          confidence={0.8}
        />
        <TurnipCard 
          title='Buy Price'
          price={102}
          icon='💰'
        />
      </Box>
      <PatternChart 
        prices={[80, 75,145,200, 95,85]}
        buyPrice={102}
        pattern='spike'
      />
    </Container>
  )
}

export default App;