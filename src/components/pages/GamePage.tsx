import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  LinearProgress,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import { ArrowBack, Refresh, History } from '@mui/icons-material';
import { useGame } from '../../hooks/useGame';
import { GameBoard } from '../game/GameBoard';
import { Position } from '../../types';

export function GamePage() {
  const navigate = useNavigate();
  const {
    currentMatch,
    currentPlayers,
    makeMove,
    resetMatch,
    startNewMatch,
    statistics,
    loadStatistics,
  } = useGame();

  const [gameStatus, setGameStatus] = useState<string>('');

  useEffect(() => {
    loadStatistics();
  }, [loadStatistics]);

  useEffect(() => {
    if (!currentMatch) return;

    const { gameState } = currentMatch;
    if (gameState.isGameOver) {
      if (gameState.winner) {
        setGameStatus(`${gameState.winner.name} победил!`);
      } else if (gameState.isDraw) {
        setGameStatus("Ничья!");
      }
    } else {
      setGameStatus(`Ход ${gameState.currentPlayer.name} (${gameState.currentPlayer.symbol})`);
    }
  }, [currentMatch, currentPlayers, navigate]);

  const handleCellClick = (position: Position) => {
    if (!currentMatch || currentMatch.gameState.isGameOver) return;
    makeMove(position);
  };

  const handleNewGame = () => {
    resetMatch();
    navigate('/');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  if (!currentMatch || !currentPlayers) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box textAlign="center">
          <Typography variant="h4" gutterBottom>
            Нет активной игры
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Начните новую игру, чтобы продолжить!
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleNewGame}
            sx={{ mr: 2 }}
          >
            Начать новую игру
          </Button>
          <Button
            variant="outlined"
            onClick={() => navigate('/history')}
          >
            Просмотр истории
          </Button>
        </Box>
      </Container>
    );
  }

  const { gameState } = currentMatch;
  const [player1, player2] = currentPlayers;

  const player1Stats = statistics.find(s => s.playerId === player1.id);
  const player2Stats = statistics.find(s => s.playerId === player2.id);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Button
          variant="outlined"
          startIcon={<ArrowBack />}
          onClick={handleNewGame}
        >
          Новая игра
        </Button>

        <Typography variant="h4" component="h1" textAlign="center">
          Крестики-Нолики
        </Typography>

        <Button
          variant="outlined"
          startIcon={<History />}
          onClick={handleViewHistory}
        >
          История
        </Button>
      </Box>

      <Box display="flex" gap={2} mb={2}>
          <Box flex={1}>
            <Card elevation={0}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="primary">
                  {player1.name}
                </Typography>
                <Chip
                  label="X"
                  color={gameState.currentPlayer === player1 ? "primary" : "default"}
                  sx={{ mt: 1 }}
                />
                {player1Stats && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    W: {player1Stats.wins} | L: {player1Stats.losses} | D: {player1Stats.draws}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
          <Box flex={1}>
            <Card elevation={0}>
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Typography variant="h6" color="secondary">
                  {player2.name}
                </Typography>
                <Chip
                  label="O"
                  color={gameState.currentPlayer === player2 ? "secondary" : "default"}
                  sx={{ mt: 1 }}
                />
                {player2Stats && (
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    W: {player2Stats.wins} | L: {player2Stats.losses} | D: {player2Stats.draws}
                  </Typography>
                )}
              </CardContent>
            </Card>
          </Box>
      </Box>

      <Paper elevation={2} sx={{ p: 2, mb: 2, textAlign: 'center' }}>
        <Typography variant="h6" color={
          gameState.isGameOver
            ? (gameState.winner ? "success" : "warning")
            : "info"
        }>
          {gameStatus}
        </Typography>


        {gameState.isGameOver && (
          <Box sx={{ mt: 2 }}>
            <Button
              variant="contained"
              startIcon={<Refresh />}
              onClick={handleNewGame}
              size="large"
            >
              Играть снова
            </Button>
          </Box>
        )}
      </Paper>

      <Box display="flex" gap={2} mb={2}>
          <Box flex={1}>
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {gameState.moves.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ходов сделано
              </Typography>
            </Paper>
          </Box>
          <Box flex={1}>
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {Math.max(0, gameState.boardBounds.maxX - gameState.boardBounds.minX + 1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Ширина поля
              </Typography>
            </Paper>
          </Box>
          <Box flex={1}>
            <Paper elevation={0} sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h6" color="primary">
                {Math.max(0, gameState.boardBounds.maxY - gameState.boardBounds.minY + 1)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Высота поля
              </Typography>
            </Paper>
          </Box>
      </Box>

      <GameBoard
        board={gameState.board}
        boardBounds={gameState.boardBounds}
        onCellClick={handleCellClick}
        winningPositions={gameState.winner ? [] : []}
        disabled={gameState.isGameOver}
        lastMovePosition={gameState.moves.length > 0 ? gameState.moves[gameState.moves.length - 1].position : null}
      />
    </Container>
  );
}
