import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { LoginPage } from './components/pages/LoginPage';
import { GamePage } from './components/pages/GamePage';
import { HistoryPage } from './components/pages/HistoryPage';
import { GameProvider } from './hooks/useGame';
import './App.css';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#6200EE',
    },
    secondary: {
      main: '#03DAC6',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(0,0,0,0.08)',
    '0px 4px 8px rgba(0,0,0,0.1)',
    '0px 6px 12px rgba(0,0,0,0.12)',
    '0px 8px 16px rgba(0,0,0,0.14)',
    '0px 10px 20px rgba(0,0,0,0.16)',
    '0px 12px 24px rgba(0,0,0,0.18)',
    '0px 14px 28px rgba(0,0,0,0.2)',
    '0px 16px 32px rgba(0,0,0,0.22)',
    '0px 18px 36px rgba(0,0,0,0.24)',
    '0px 20px 40px rgba(0,0,0,0.26)',
    '0px 22px 44px rgba(0,0,0,0.28)',
    '0px 24px 48px rgba(0,0,0,0.3)',
    '0px 26px 52px rgba(0,0,0,0.32)',
    '0px 28px 56px rgba(0,0,0,0.34)',
    '0px 30px 60px rgba(0,0,0,0.36)',
    '0px 32px 64px rgba(0,0,0,0.38)',
    '0px 34px 68px rgba(0,0,0,0.4)',
    '0px 36px 72px rgba(0,0,0,0.42)',
    '0px 38px 76px rgba(0,0,0,0.44)',
    '0px 40px 80px rgba(0,0,0,0.46)',
    '0px 42px 84px rgba(0,0,0,0.48)',
    '0px 44px 88px rgba(0,0,0,0.5)',
    '0px 46px 92px rgba(0,0,0,0.52)',
    '0px 48px 96px rgba(0,0,0,0.54)',
  ],
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <GameProvider>
        <Router key={window.location.pathname}>
          <div className="App">
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/game" element={<GamePage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </div>
        </Router>
      </GameProvider>
    </ThemeProvider>
  );
}

export default App;
