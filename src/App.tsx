import { Container } from '@mui/material';
import './App.css';
import GamesTable from './components/GamesTableContainer';

function App() {
  return (
    <div className="App">
      <Container>
        <GamesTable/>
      </Container>
    </div>
  );
}

export default App;
