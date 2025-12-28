import React, { useMemo, useCallback, useState, useEffect } from 'react';
import { Box, Paper, useTheme, useMediaQuery } from '@mui/material';
import { Position, PlayerSymbol } from '../../types';
import './animations.css';

interface GameBoardProps {
  board: Map<string, PlayerSymbol>;
  boardBounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
  onCellClick: (position: Position) => void;
  winningPositions?: Position[];
  disabled?: boolean;
  lastMovePosition?: Position | null;
}

const BOARD_PADDING = 2; // Extra cells around the played area

export function GameBoard({
  board,
  boardBounds,
  onCellClick,
  winningPositions = [],
  disabled = false,
  lastMovePosition = null
}: GameBoardProps) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const isMediumScreen = useMediaQuery(theme.breakpoints.down('md'));

  const CELL_SIZE = useMemo(() => {
    if (isSmallScreen) return 30;
    if (isMediumScreen) return 35;
    return 40;
  }, [isSmallScreen, isMediumScreen]);
  // Calculate the visible board area with padding
  const visibleBounds = useMemo(() => {
    return {
      minX: boardBounds.minX - BOARD_PADDING,
      maxX: boardBounds.maxX + BOARD_PADDING,
      minY: boardBounds.minY - BOARD_PADDING,
      maxY: boardBounds.maxY + BOARD_PADDING,
    };
  }, [boardBounds]);

  // Create winning positions set for quick lookup
  const winningPositionsSet = useMemo(() => {
    return new Set(winningPositions.map(pos => `${pos.x},${pos.y}`));
  }, [winningPositions]);

  // Generate grid cells
  const gridCells = useMemo(() => {
    const cells = [];
    const width = visibleBounds.maxX - visibleBounds.minX + 1;
    const height = visibleBounds.maxY - visibleBounds.minY + 1;

    for (let y = visibleBounds.minY; y <= visibleBounds.maxY; y++) {
      for (let x = visibleBounds.minX; x <= visibleBounds.maxX; x++) {
        const key = `${x},${y}`;
        const symbol = board.get(key);
        const isWinning = winningPositionsSet.has(key);

        const isLastMove = lastMovePosition &&
          lastMovePosition.x === x && lastMovePosition.y === y;

        cells.push({
          x,
          y,
          key,
          symbol,
          isWinning,
          isLastMove,
        });
      }
    }

    return { cells, width, height };
  }, [visibleBounds, board, winningPositionsSet]);

  const handleCellClick = useCallback((x: number, y: number) => {
    if (disabled) return;
    onCellClick({ x, y });
  }, [onCellClick, disabled]);

  const boardStyle = {
    display: 'grid',
    gridTemplateColumns: `repeat(${gridCells.width}, ${CELL_SIZE}px)`,
    gridTemplateRows: `repeat(${gridCells.height}, ${CELL_SIZE}px)`,
    gap: '2px',
    backgroundColor: '#e0e0e0',
    padding: '5px',
    borderRadius: '4px',
    maxWidth: '100%',
    maxHeight: '70vh',
    overflow: 'auto',
    justifyContent: 'center',
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
      <Paper elevation={0} sx={{ p: 1 }}>
        <Box sx={boardStyle}>
          {gridCells.cells.map(({ x, y, key, symbol, isWinning, isLastMove }) => {
            let className = 'cell-hover';
            if (isLastMove && symbol) className += ' move-animation';
            if (isWinning) className += ' win-animation';

            return (
              <Box
                key={key}
                className={className}
                onClick={() => handleCellClick(x, y)}
                sx={{
                  width: CELL_SIZE,
                  height: CELL_SIZE,
                  backgroundColor: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: disabled || symbol ? 'default' : 'pointer',
                  border: isWinning ? `2px solid ${theme.palette.secondary.main}` : '1px solid #e0e0e0',
                  borderRadius: '4px',
                  boxShadow: '0px 1px 2px rgba(0,0,0,0.05)',
                  fontSize: '20px',
                  fontWeight: 'bold',
                  color: symbol === 'X' ? theme.palette.primary.main : theme.palette.secondary.main,
                  '&:hover': {
                    backgroundColor: disabled || symbol ? 'white' : '#f5f5f5',
                  },
                }}
              >
                {symbol}
              </Box>
            );
          })}
        </Box>
      </Paper>
    </Box>
  );
}
