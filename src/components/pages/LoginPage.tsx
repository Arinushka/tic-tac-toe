import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Switch,
  FormControlLabel,
  Stack,
  Card,
  CardContent,
} from '@mui/material';
import { Person, SmartToy, History } from '@mui/icons-material';
import { useGame } from '../../hooks/useGame';
import { Player } from '../../types';
import { v4 as uuidv4 } from 'uuid';

export function LoginPage() {
  const navigate = useNavigate();
  const { startNewMatch } = useGame();

  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const handleStartGame = () => {
    if (!player1Name.trim()) return;

    const player1: Player = {
      id: uuidv4(),
      name: player1Name.trim(),
    };

    const player2: Player = {
      id: uuidv4(),
      name: player2Name.trim() || 'Игрок 2',
    };

    startNewMatch([player1, player2]);
    navigate('/game');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const canStartGame = player1Name.trim() && player2Name.trim();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Box textAlign="center" mb={4}>
        <Typography variant="h3" component="h1" gutterBottom color="primary">
          Крестики-Нолики
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Бесконечное поле • 5-в-ряд • Современный геймплей
        </Typography>
      </Box>

      <Stack direction="column" spacing={4}>
        <Box sx={{ flex: 2 }}>
          <Paper elevation={0} sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              Начать новую игру
            </Typography>

            <Box component="form" sx={{ mt: 2 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                <Box>
                  <TextField
                    fullWidth
                    label="Имя игрока 1"
                    value={player1Name}
                    onChange={(e) => setPlayer1Name(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Box>

                <Box>
                  <TextField
                    fullWidth
                    label="Имя игрока 2"
                    value={player2Name}
                    onChange={(e) => setPlayer2Name(e.target.value)}
                    variant="outlined"
                    InputProps={{
                      startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                    }}
                  />
                </Box>


                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleStartGame}
                    disabled={!canStartGame}
                    sx={{ py: 1.5 }}
                  >
                    Начать игру
                  </Button>
                </Box>
              </Stack>
            </Box>
          </Paper>
        </Box>

        <Box>
          <Card elevation={0}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h6" gutterBottom>
                Особенности игры
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • Бесконечный размер поля
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • 5 в ряд для победы
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  • История матчей и статистика
                </Typography>
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<History />}
                onClick={handleViewHistory}
                sx={{ mt: 2 }}
              >
                Просмотр истории
              </Button>
            </CardContent>
          </Card>
        </Box>
      </Stack>
    </Container>
  );
}
