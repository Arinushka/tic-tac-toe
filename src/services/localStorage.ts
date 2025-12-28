import { Match, PlayerStatistics, GameConfig } from '../types';

const STORAGE_KEYS = {
  MATCHES: 'tic-tac-toe-matches',
  STATISTICS: 'tic-tac-toe-statistics',
  GAME_CONFIG: 'tic-tac-toe-config',
} as const;

class LocalStorageService {
  saveMatch(match: Match): void {
    try {
      const matches = this.getMatches();
      const existingIndex = matches.findIndex(m => m.id === match.id);

      if (existingIndex >= 0) {
        matches[existingIndex] = match;
      } else {
        matches.push(match);
      }

      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    } catch (error) {
      console.error('Failed to save match:', error);
    }
  }

  getMatches(): Match[] {
    try {
      const matchesJson = localStorage.getItem(STORAGE_KEYS.MATCHES);
      if (!matchesJson) return [];

      const matches = JSON.parse(matchesJson);
      return matches.map((match: any) => ({
        ...match,
        startTime: new Date(match.startTime),
        endTime: match.endTime ? new Date(match.endTime) : undefined,
        gameState: {
          ...match.gameState,
          moves: match.gameState.moves.map((move: any) => ({
            ...move,
            timestamp: new Date(move.timestamp),
          })),
        },
      }));
    } catch (error) {
      console.error('Failed to load matches:', error);
      return [];
    }
  }

  deleteMatch(matchId: string): void {
    try {
      const matches = this.getMatches().filter(m => m.id !== matchId);
      localStorage.setItem(STORAGE_KEYS.MATCHES, JSON.stringify(matches));
    } catch (error) {
      console.error('Failed to delete match:', error);
    }
  }

  getMatchById(matchId: string): Match | null {
    const matches = this.getMatches();
    return matches.find(m => m.id === matchId) || null;
  }

  saveStatistics(statistics: PlayerStatistics[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.STATISTICS, JSON.stringify(statistics));
    } catch (error) {
      console.error('Failed to save statistics:', error);
    }
  }

  getStatistics(): PlayerStatistics[] {
    try {
      const statisticsJson = localStorage.getItem(STORAGE_KEYS.STATISTICS);
      return statisticsJson ? JSON.parse(statisticsJson) : [];
    } catch (error) {
      console.error('Failed to load statistics:', error);
      return [];
    }
  }

  updatePlayerStatistics(playerId: string, isWin: boolean, isDraw: boolean): void {
    const statistics = this.getStatistics();
    let playerStats = statistics.find(s => s.playerId === playerId);

    if (!playerStats) {
      playerStats = {
        playerId,
        playerName: '',
        gamesPlayed: 0,
        wins: 0,
        losses: 0,
        draws: 0,
        winRate: 0,
      };
      statistics.push(playerStats);
    }

    // playerStats is now guaranteed to be defined

    playerStats.gamesPlayed += 1;

    if (isDraw) {
      playerStats.draws += 1;
    } else if (isWin) {
      playerStats.wins += 1;
    } else {
      playerStats.losses += 1;
    }

    playerStats.winRate = playerStats.gamesPlayed > 0
      ? (playerStats.wins / playerStats.gamesPlayed) * 100
      : 0;

    this.saveStatistics(statistics);
  }

  saveGameConfig(config: GameConfig): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_CONFIG, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save game config:', error);
    }
  }

  getGameConfig(): GameConfig {
    try {
      const configJson = localStorage.getItem(STORAGE_KEYS.GAME_CONFIG);
      if (configJson) {
        return JSON.parse(configJson);
      }
    } catch (error) {
      console.error('Failed to load game config:', error);
    }

    return {
      boardSize: 100,
      winCondition: 5,
    };
  }

  clearAllData(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.MATCHES);
      localStorage.removeItem(STORAGE_KEYS.STATISTICS);
      localStorage.removeItem(STORAGE_KEYS.GAME_CONFIG);
    } catch (error) {
      console.error('Failed to clear data:', error);
    }
  }
}

export const localStorageService = new LocalStorageService();
