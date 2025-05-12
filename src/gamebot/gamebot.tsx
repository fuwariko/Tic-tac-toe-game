
import type { Bot, CellValue, Position } from "../types/types";


export function createBot(prop: Bot = { mistakeChance: 0.4 }) {
  const mistakeChance = Math.min(Math.max(prop.mistakeChance, 0), 1);

  function checkWin(board: CellValue[], player: 'x' | 'o'): boolean {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];

    return lines.some(([a, b, c]) => 
      board[a] === player && board[b] === player && board[c] === player
    );
  }

  function findBestMove(board: CellValue[], availableMoves: Position[]): Position {
    
    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = 'o';
      if (checkWin(newBoard, 'o')) {
        return move;
      }
    }

    for (const move of availableMoves) {
      const newBoard = [...board];
      newBoard[move] = 'x';
      if (checkWin(newBoard, 'x')) {
        return move;
      }
    }

    const center = 4;
    if (availableMoves.includes(center)) return center;

    const corners: Position[] = [0, 2, 6, 8]; 

    const availableCorners = corners.filter((pos): pos is Position => 
      availableMoves.includes(pos)
    );

    if (availableCorners.length > 0) {
      const randomIndex = Math.floor(Math.random() * availableCorners.length);
      return availableCorners[randomIndex];
    }

    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }

  function makeMove(board: CellValue[]): Position | -1{
    const availableMoves = board
      .map((cell, index) => cell === null ? index : null)
      .filter((index): index is Position => index !== null);

    if (availableMoves.length === 0) return -1;

    if (Math.random() < mistakeChance) {
      return availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    return findBestMove(board, availableMoves);
  }

  return {
    makeMove,
    checkWin
  };
}

export function checkGameOver(board: CellValue[], checkWin: (board: CellValue[], player: 'x' | 'o') => boolean): boolean {
  return checkWin(board, 'x') || checkWin(board, 'o') || !board.includes(null);
}