import { Container, createTheme, ThemeProvider } from '@mui/material';
import { blue } from '@mui/material/colors';
import GamesTable from './components/GamesTableContainer';


const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: blue[600],
    },
  },
});

function App() {
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <Container>
          <GamesTable/>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
