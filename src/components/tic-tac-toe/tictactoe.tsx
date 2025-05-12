import { useState, useRef } from 'react';
import Lottie from 'lottie-react';
import grid from '../../assets/grid.json';
import x from '../../assets/cross.json';
import o from '../../assets/oval.json';
import { createBot, checkGameOver } from '../../gamebot/gamebot.tsx';
import './styles.css';
import type { CellValue } from '../../types/types.tsx';

export function TicTacToe(): React.JSX.Element {
  const [board, setBoard] = useState<CellValue[]>(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [isFading, setIsFading] = useState(false);
  
  const bot = useRef(createBot({ mistakeChance: 0.4 }));

  function resetGame() {
    setBoard(Array(9).fill(null));
    setGameOver(false);
    setIsFading(false);
  }

  function handlePlayerMove(position: number) {
    if (board[position] !== null || gameOver || isFading) return;

    const newBoard = [...board];
    newBoard[position] = 'x';
    setBoard(newBoard);

    if (checkGameOver(newBoard, bot.current.checkWin)) {
      setIsFading(true);
      setTimeout(resetGame, 1000);
      return;
    }

    setTimeout(() => {
      const botMove = bot.current.makeMove(newBoard);
      if (botMove === -1) return;

      const updatedBoard = [...newBoard];
      updatedBoard[botMove] = 'o';
      setBoard(updatedBoard);

      if (checkGameOver(updatedBoard, bot.current.checkWin)) {
        setIsFading(true);
        setTimeout(resetGame, 1000);
      }
    }, 500);
  }

  const cells = [
    { top: '6%', left: '6%' },
    { top: '6%', left: '50%', transform: 'translateX(-50%)' },
    { top: '6%', right: '6%' },
    { top: '50%', left: '6%', transform: 'translateY(-50%)' },
    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' },
    { top: '50%', right: '6%', transform: 'translateY(-50%)' },
    { bottom: '6%', left: '6%' },
    { bottom: '6%', left: '50%', transform: 'translateX(-50%)' },
    { bottom: '6%', right: '6%' }
  ];

  return (
    <div className="game-container">
      <div className="board-animation">
        <Lottie
          animationData={grid}
          loop={false}
          autoplay={true}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className={`game-board ${isFading ? 'fade-out' : ''}`}>
        {board.map((cell, index) => (
          <div
            key={index}
            className="game-cell"
            style={cells[index]}
            onClick={() => handlePlayerMove(index)}
          >
            {cell === 'x' && (
              <Lottie
                animationData={x}
                loop={false}
                autoplay={true}
                style={{ width: '40%', height: '40%' }}
              />
            )}
            {cell === 'o' && (
              <Lottie
                animationData={o}
                loop={false}
                autoplay={true}
                style={{ width: '40%', height: '40%' }}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}