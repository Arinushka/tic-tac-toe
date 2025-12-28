import { Position, PlayerSymbol } from '../types';

export interface WinResult {
  winner: PlayerSymbol;
  winningPositions: Position[];
}

export function checkWin(
  board: Map<string, PlayerSymbol>,
  lastMovePosition: Position,
  winCondition: number = 5
): WinResult | null {
  const symbol = board.get(`${lastMovePosition.x},${lastMovePosition.y}`);
  if (!symbol) return null;

  const directions: Array<{ dx: number; dy: number }> = [
    { dx: 1, dy: 0 },   // horizontal
    { dx: 0, dy: 1 },   // vertical
    { dx: 1, dy: 1 },   // diagonal \
    { dx: 1, dy: -1 },  // diagonal /
  ];

  for (const direction of directions) {
    const winningPositions = checkDirection(
      board,
      lastMovePosition,
      direction,
      symbol,
      winCondition
    );

    if (winningPositions) {
      return {
        winner: symbol,
        winningPositions,
      };
    }
  }

  return null;
}

function checkDirection(
  board: Map<string, PlayerSymbol>,
  startPos: Position,
  direction: { dx: number; dy: number },
  symbol: PlayerSymbol,
  winCondition: number
): Position[] | null {
  const positions: Position[] = [startPos];

  let count = 1; // Start with 1 for the current position
  let x = startPos.x + direction.dx;
  let y = startPos.y + direction.dy;

  while (count < winCondition) {
    const key = `${x},${y}`;
    if (board.get(key) === symbol) {
      positions.push({ x, y });
      count++;
      x += direction.dx;
      y += direction.dy;
    } else {
      break;
    }
  }

  x = startPos.x - direction.dx;
  y = startPos.y - direction.dy;

  while (count < winCondition) {
    const key = `${x},${y}`;
    if (board.get(key) === symbol) {
      positions.push({ x, y });
      count++;
      x -= direction.dx;
      y -= direction.dy;
    } else {
      break;
    }
  }

  return count >= winCondition ? positions : null;
}

export function checkDraw(board: Map<string, PlayerSymbol>): boolean {
  if (board.size === 0) return false;

  return false;
}

export function getWinningMoves(
  board: Map<string, PlayerSymbol>,
  symbol: PlayerSymbol,
  winCondition: number = 5
): Position[] {
  const winningMoves: Position[] = [];
  const checkedPositions = new Set<string>();

  for (const [key, boardSymbol] of board) {
    if (boardSymbol !== symbol) continue;

    const [x, y] = key.split(',').map(Number);
    const position = { x, y };

    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue;

        const neighborX = x + dx;
        const neighborY = y + dy;
        const neighborKey = `${neighborX},${neighborY}`;

        if (board.has(neighborKey) || checkedPositions.has(neighborKey)) continue;

        checkedPositions.add(neighborKey);

        board.set(neighborKey, symbol);
        const winResult = checkWin(board, { x: neighborX, y: neighborY }, winCondition);
        board.delete(neighborKey);

        if (winResult && winResult.winner === symbol) {
          winningMoves.push({ x: neighborX, y: neighborY });
        }
      }
    }
  }

  return winningMoves;
}
