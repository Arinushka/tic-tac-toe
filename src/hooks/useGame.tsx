import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Player,
  Match,
  GameState,
  Position,
  PlayerSymbol,
  PlayerStatistics,
  GameConfig
} from '../types';
import { localStorageService } from '../services/localStorage';
import { checkWin, checkDraw } from '../utils/winDetection';

interface GameContextType {
  currentMatch: Match | null;
  currentPlayers: [Player, Player] | null;

  startNewMatch: (players: [Player, Player]) => void;
  makeMove: (position: Position) => void;
  endMatch: (winner?: Player, isDraw?: boolean) => void;
  resetMatch: () => void;

  matches: Match[];
  statistics: PlayerStatistics[];
  loadMatches: () => void;
  loadStatistics: () => void;

  gameConfig: GameConfig;
  updateGameConfig: (config: Partial<GameConfig>) => void;

}

type GameAction =
  | { type: 'SET_CURRENT_MATCH'; payload: Match }
  | { type: 'SET_CURRENT_PLAYERS'; payload: [Player, Player] | null }
  | { type: 'UPDATE_GAME_STATE'; payload: GameState }
  | { type: 'END_MATCH'; payload: { winner?: Player; isDraw?: boolean } }
  | { type: 'RESET_MATCH' }
  | { type: 'LOAD_MATCHES'; payload: Match[] }
  | { type: 'LOAD_STATISTICS'; payload: PlayerStatistics[] }
  | { type: 'UPDATE_GAME_CONFIG'; payload: Partial<GameConfig> }

interface GameStateType {
  currentMatch: Match | null;
  currentPlayers: [Player, Player] | null;
  matches: Match[];
  statistics: PlayerStatistics[];
  gameConfig: GameConfig;
}

const initialState: GameStateType = {
  currentMatch: null,
  currentPlayers: null,
  matches: [],
  statistics: [],
  gameConfig: localStorageService.getGameConfig(),
};

function gameReducer(state: GameStateType, action: GameAction): GameStateType {
  switch (action.type) {
    case 'SET_CURRENT_MATCH':
      return { ...state, currentMatch: action.payload };

    case 'SET_CURRENT_PLAYERS':
      return { ...state, currentPlayers: action.payload };

    case 'UPDATE_GAME_STATE':
      if (!state.currentMatch) return state;
      return {
        ...state,
        currentMatch: {
          ...state.currentMatch,
          gameState: action.payload,
        },
      };

    case 'END_MATCH':
      if (!state.currentMatch) return state;
      const endedMatch: Match = {
        ...state.currentMatch,
        endTime: new Date(),
        winner: action.payload.winner,
        isDraw: action.payload.isDraw || false,
        gameState: {
          ...state.currentMatch.gameState,
          isGameOver: true,
          winner: action.payload.winner || null,
          isDraw: action.payload.isDraw || false,
        },
      };
      localStorageService.saveMatch(endedMatch);
      return { ...state, currentMatch: endedMatch };

    case 'RESET_MATCH':
      return { ...state, currentMatch: null, currentPlayers: null };

    case 'LOAD_MATCHES':
      return { ...state, matches: action.payload };

    case 'LOAD_STATISTICS':
      return { ...state, statistics: action.payload };

    case 'UPDATE_GAME_CONFIG':
      const newConfig = { ...state.gameConfig, ...action.payload };
      localStorageService.saveGameConfig(newConfig);
      return { ...state, gameConfig: newConfig };


    default:
      return state;
  }
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const loadMatches = useCallback(() => {
    const matches = localStorageService.getMatches();
    dispatch({ type: 'LOAD_MATCHES', payload: matches });
  }, [dispatch]);

  const loadStatistics = useCallback(() => {
    const statistics = localStorageService.getStatistics();
    dispatch({ type: 'LOAD_STATISTICS', payload: statistics });
  }, [dispatch]);

  const resetMatch = useCallback(() => {
    dispatch({ type: 'RESET_MATCH' });
  }, [dispatch]);

  const updateGameConfig = useCallback((config: Partial<GameConfig>) => {
    const newConfig = { ...state.gameConfig, ...config };
    localStorageService.saveGameConfig(newConfig);
    dispatch({ type: 'UPDATE_GAME_CONFIG', payload: config });
  }, [state.gameConfig, dispatch]);

  const endMatch = useCallback((winner?: Player, isDraw?: boolean) => {
    dispatch({ type: 'END_MATCH', payload: { winner, isDraw } });

    if (state.currentMatch) {
      const players = state.currentMatch.players;
      players.forEach(player => {
        const playerWon = winner?.id === player.id;
        const isDrawResult = isDraw || false;
        localStorageService.updatePlayerStatistics(player.id, playerWon, isDrawResult);
      });
    }

    loadStatistics();
  }, [dispatch, state.currentMatch, loadStatistics]);

  const startNewMatch = useCallback((players: [Player, Player]) => {
    const player1 = { ...players[0], symbol: 'X' as PlayerSymbol };
    const player2 = { ...players[1], symbol: 'O' as PlayerSymbol };

    const initialGameState: GameState = {
      board: new Map<string, PlayerSymbol>(),
      moves: [],
      currentPlayer: player1,
      winner: null,
      isDraw: false,
      isGameOver: false,
      boardBounds: { minX: 0, maxX: 0, minY: 0, maxY: 0 },
    };

    const newMatch: Match = {
      id: uuidv4(),
      players: [player1, player2],
      gameState: initialGameState,
      startTime: new Date(),
      isDraw: false,
    };

    dispatch({ type: 'SET_CURRENT_MATCH', payload: newMatch });
    dispatch({ type: 'SET_CURRENT_PLAYERS', payload: [player1, player2] });
  }, [dispatch, uuidv4]);

  const makeMove = useCallback(async (position: Position) => {
    if (!state.currentMatch || state.currentMatch.gameState.isGameOver) return;

    const { gameState } = state.currentMatch;
    const { currentPlayer } = gameState;

    const key = `${position.x},${position.y}`;
    if (gameState.board.has(key)) return;

    const newBoard = new Map<string, PlayerSymbol>(gameState.board);
    newBoard.set(key, currentPlayer.symbol!);

    const newMove = {
      position,
      player: currentPlayer,
      timestamp: new Date(),
      moveNumber: gameState.moves.length + 1,
    };

    const newMoves = [...gameState.moves, newMove];

    const newBounds = {
      minX: Math.min(gameState.boardBounds.minX, position.x),
      maxX: Math.max(gameState.boardBounds.maxX, position.x),
      minY: Math.min(gameState.boardBounds.minY, position.y),
      maxY: Math.max(gameState.boardBounds.maxY, position.y),
    };

    const winResult = checkWin(newBoard, position, state.gameConfig.winCondition);
    const isDraw = !winResult && checkDraw(newBoard);

    const nextPlayerIndex = gameState.currentPlayer === state.currentMatch.players[0] ? 1 : 0;
    const nextPlayer = state.currentMatch.players[nextPlayerIndex];

    const updatedGameState: GameState = {
      board: newBoard,
      moves: newMoves,
      currentPlayer: nextPlayer,
      winner: winResult ? currentPlayer : null,
      isDraw,
      isGameOver: !!winResult || isDraw,
      boardBounds: newBounds,
    };

    dispatch({ type: 'UPDATE_GAME_STATE', payload: updatedGameState });

    if (winResult || isDraw) {
      const winner = winResult ? currentPlayer : undefined;
      endMatch(winner, isDraw);
    }
  }, [state.currentMatch, state.gameConfig.winCondition, endMatch, dispatch]);

  const contextValue: GameContextType = {
    currentMatch: state.currentMatch,
    currentPlayers: state.currentPlayers,
    startNewMatch,
    makeMove,
    endMatch,
    resetMatch,
    matches: state.matches,
    statistics: state.statistics,
    loadMatches,
    loadStatistics,
    gameConfig: state.gameConfig,
    updateGameConfig,
  };

  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
