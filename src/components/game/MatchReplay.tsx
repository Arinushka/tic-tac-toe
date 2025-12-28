import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  Slider,
  Button,
  Paper,
  Chip,
  IconButton,
} from '@mui/material';
import {
  PlayArrow,
  Pause,
  SkipPrevious,
  SkipNext,
  Replay,
} from '@mui/icons-material';
import { Match, Position, PlayerSymbol, GameState } from '../../types';
import { GameBoard } from './GameBoard';

interface MatchReplayProps {
  match: Match;
}

export function MatchReplay({ match }: MatchReplayProps) {
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1000);

  const { moves } = match.gameState;
  const { players } = match;

  const currentBoardState = useMemo(() => {
    const board = new Map<string, PlayerSymbol>();
    const playedMoves = moves.slice(0, currentMoveIndex);

    playedMoves.forEach(move => {
      board.set(`${move.position.x},${move.position.y}`, move.player.symbol!);
    });

    return board;
  }, [moves, currentMoveIndex]);

  const boardBounds = useMemo(() => {
    if (currentMoveIndex === 0) {
      return { minX: 0, maxX: 0, minY: 0, maxY: 0 };
    }

    const playedMoves = moves.slice(0, currentMoveIndex);
    const positions = playedMoves.map(move => move.position);

    const minX = Math.min(...positions.map(p => p.x));
    const maxX = Math.max(...positions.map(p => p.x));
    const minY = Math.min(...positions.map(p => p.y));
    const maxY = Math.max(...positions.map(p => p.y));

    return { minX, maxX, minY, maxY };
  }, [moves, currentMoveIndex]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && currentMoveIndex < moves.length) {
      interval = setInterval(() => {
        setCurrentMoveIndex(prev => {
          if (prev >= moves.length) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, playbackSpeed);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentMoveIndex, moves.length, playbackSpeed]);

  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    setCurrentMoveIndex(newValue as number);
    setIsPlaying(false);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setCurrentMoveIndex(0);
    setIsPlaying(false);
  };

  const handlePrevious = () => {
    setCurrentMoveIndex(Math.max(0, currentMoveIndex - 1));
    setIsPlaying(false);
  };

  const handleNext = () => {
    setCurrentMoveIndex(Math.min(moves.length, currentMoveIndex + 1));
    setIsPlaying(false);
  };

  const currentMove = moves[currentMoveIndex - 1];
  const nextMove = moves[currentMoveIndex];

  const getMatchResult = () => {
    if (match.isDraw) return { text: 'Ничья', color: 'warning' as const };
    if (match.winner) {
      return {
        text: `${match.winner.name} победил`,
        color: 'success' as const
      };
    }
    return { text: 'В процессе', color: 'info' as const };
  };

  const result = getMatchResult();

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              {players[0].name} против {players[1].name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }).format(match.startTime)}
            </Typography>
          </Box>
          <Box>
            <Chip
              label={result.text}
              color={result.color}
              size="small"
            />
          </Box>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ p: 3, mb: 2 }}>
        <Box display="flex" alignItems="center" gap={3} mb={2}>
          <IconButton onClick={handleReset} disabled={currentMoveIndex === 0}>
            <Replay />
          </IconButton>

          <IconButton onClick={handlePrevious} disabled={currentMoveIndex === 0}>
            <SkipPrevious />
          </IconButton>

          <IconButton onClick={handlePlayPause}>
            {isPlaying ? <Pause /> : <PlayArrow />}
          </IconButton>

          <IconButton onClick={handleNext} disabled={currentMoveIndex >= moves.length}>
            <SkipNext />
          </IconButton>

          <Box sx={{ ml: 2, minWidth: 200 }}>
            <Typography variant="body2" gutterBottom>
              Скорость: {playbackSpeed}мс
            </Typography>
            <Slider
              value={playbackSpeed}
              onChange={(e, value) => setPlaybackSpeed(value as number)}
              min={200}
              max={3000}
              step={200}
              valueLabelDisplay="auto"
              valueLabelFormat={(value) => `${value}ms`}
            />
          </Box>
        </Box>

        <Box mb={2}>
          <Typography variant="body2" gutterBottom>
            Ход {currentMoveIndex} из {moves.length}
          </Typography>
          <Slider
            value={currentMoveIndex}
            onChange={handleSliderChange}
            min={0}
            max={moves.length}
            step={1}
            valueLabelDisplay="auto"
              valueLabelFormat={(value) => `Ход ${value}`}
          />
        </Box>

        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            {currentMove && (
              <Typography variant="body2">
                Последний ход: {currentMove.player.name} в ({currentMove.position.x}, {currentMove.position.y})
              </Typography>
            )}
          </Box>

          <Box>
            {nextMove && (
              <Typography variant="body2">
                Следующий: {nextMove.player.name} ({nextMove.player.symbol})
              </Typography>
            )}
          </Box>
        </Box>
      </Paper>

      <GameBoard
        board={currentBoardState}
        boardBounds={boardBounds}
        onCellClick={() => {}}
        disabled={true}
        winningPositions={[]}
      />
    </Box>
  );
}
