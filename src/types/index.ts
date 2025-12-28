export type PlayerSymbol = 'X' | 'O';

export interface Player {
  id: string;
  name: string;
  symbol?: PlayerSymbol;
}

export interface Position {
  x: number;
  y: number;
}

export interface Move {
  position: Position;
  player: Player;
  timestamp: Date;
  moveNumber: number;
}

export interface GameState {
  board: Map<string, PlayerSymbol>;
  moves: Move[];
  currentPlayer: Player;
  winner: Player | null;
  isDraw: boolean;
  isGameOver: boolean;
  boardBounds: {
    minX: number;
    maxX: number;
    minY: number;
    maxY: number;
  };
}

export interface Match {
  id: string;
  players: [Player, Player];
  gameState: GameState;
  startTime: Date;
  endTime?: Date;
  winner?: Player;
  isDraw: boolean;
}

export interface PlayerStatistics {
  playerId: string;
  playerName: string;
  gamesPlayed: number;
  wins: number;
  losses: number;
  draws: number;
  winRate: number;
}

export interface GameConfig {
  boardSize: number;
  winCondition: number;
}

export interface AppState {
  currentMatch: Match | null;
  matches: Match[];
  statistics: PlayerStatistics[];
  currentPlayers: [Player, Player] | null;
  gameConfig: GameConfig;
}
