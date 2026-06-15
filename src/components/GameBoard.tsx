import React, { useMemo } from "react";
import { SNAKES, LADDERS, squareToRowCol, PLAYER_CONFIGS } from "../gameData";

interface PlayerState {
  id: number;
  position: number;
  name: string;
}

interface GameBoardProps {
  players: PlayerState[];
  currentPlayer: number;
  animatingPlayer: number | null;
}

// Snake SVG paths between cells
const SNAKE_DEFS = [
  { head: 17, tail: 7, color: "#ff4757", shadow: "#ff6b81" },
  { head: 54, tail: 34, color: "#ff6348", shadow: "#ff7f50" },
  { head: 62, tail: 19, color: "#e84393", shadow: "#fd79a8" },
  { head: 64, tail: 60, color: "#c0392b", shadow: "#e74c3c" },
  { head: 87, tail: 24, color: "#8e44ad", shadow: "#9b59b6" },
  { head: 93, tail: 73, color: "#ff4757", shadow: "#ff6b81" },
  { head: 95, tail: 75, color: "#e84393", shadow: "#fd79a8" },
  { head: 99, tail: 78, color: "#c0392b", shadow: "#e74c3c" },
];

const LADDER_DEFS = [
  { bottom: 4, top: 14, color: "#00b894", shadow: "#55efc4" },
  { bottom: 9, top: 31, color: "#0984e3", shadow: "#74b9ff" },
  { bottom: 20, top: 38, color: "#fdcb6e", shadow: "#ffeaa7" },
  { bottom: 28, top: 84, color: "#00cec9", shadow: "#81ecec" },
  { bottom: 40, top: 59, color: "#6c5ce7", shadow: "#a29bfe" },
  { bottom: 51, top: 67, color: "#00b894", shadow: "#55efc4" },
  { bottom: 63, top: 81, color: "#fdcb6e", shadow: "#ffeaa7" },
  { bottom: 71, top: 91, color: "#0984e3", shadow: "#74b9ff" },
];

const CELL_SIZE = 62; // px per cell
const BOARD_SIZE = 10;
const BOARD_PX = CELL_SIZE * BOARD_SIZE;

function getCellCenter(square: number): [number, number] {
  const [row, col] = squareToRowCol(square);
  return [col * CELL_SIZE + CELL_SIZE / 2, row * CELL_SIZE + CELL_SIZE / 2];
}

// Generate a wavy snake path between two squares
function generateSnakePath(
  headSquare: number,
  tailSquare: number
): string {
  const [hx, hy] = getCellCenter(headSquare);
  const [tx, ty] = getCellCenter(tailSquare);

  const midX = (hx + tx) / 2;
  const midY = (hy + ty) / 2;
  const dx = tx - hx;
  const dy = ty - hy;
  const len = Math.sqrt(dx * dx + dy * dy);
  const perpX = (-dy / len) * 30;
  const perpY = (dx / len) * 30;

  const c1x = midX + perpX;
  const c1y = midY + perpY;
  const c2x = midX - perpX;
  const c2y = midY - perpY;

  return `M ${hx} ${hy} C ${hx + perpX * 0.5} ${hy + perpY * 0.5} ${c1x} ${c1y} ${midX} ${midY} C ${c2x} ${c2y} ${tx - perpX * 0.5} ${ty - perpY * 0.5} ${tx} ${ty}`;
}

// Generate ladder path between two squares
function generateLadderPath(
  bottomSquare: number,
  topSquare: number
): { left: string; right: string; rungs: { x1: number; y1: number; x2: number; y2: number }[] } {
  const [bx, by] = getCellCenter(bottomSquare);
  const [tx, ty] = getCellCenter(topSquare);

  const angle = Math.atan2(ty - by, tx - bx);
  const perpAngle = angle + Math.PI / 2;
  const offset = 7;

  const perpX = Math.cos(perpAngle) * offset;
  const perpY = Math.sin(perpAngle) * offset;

  const left = `M ${bx - perpX} ${by - perpY} L ${tx - perpX} ${ty - perpY}`;
  const right = `M ${bx + perpX} ${by + perpY} L ${tx + perpX} ${ty + perpY}`;

  // Calculate rungs
  const dist = Math.sqrt((tx - bx) ** 2 + (ty - by) ** 2);
  const numRungs = Math.max(3, Math.floor(dist / 40));
  const rungs = [];
  for (let i = 0; i <= numRungs; i++) {
    const t = i / numRungs;
    const rx = bx + (tx - bx) * t;
    const ry = by + (ty - by) * t;
    rungs.push({
      x1: rx - perpX * 1.2,
      y1: ry - perpY * 1.2,
      x2: rx + perpX * 1.2,
      y2: ry + perpY * 1.2,
    });
  }

  return { left, right, rungs };
}

const GameBoard: React.FC<GameBoardProps> = ({
  players,
  currentPlayer,
  animatingPlayer,
}) => {
  // Generate cell labels and colors
  const cells = useMemo(() => {
    const result: { square: number; row: number; col: number; isSnakeHead: boolean; isLadderBottom: boolean; isSnakeTail: boolean; isLadderTop: boolean }[] = [];
    for (let displayRow = 0; displayRow < BOARD_SIZE; displayRow++) {
      for (let displayCol = 0; displayCol < BOARD_SIZE; displayCol++) {
        const row = 9 - displayRow;
        const col = row % 2 === 0 ? displayCol : 9 - displayCol;
        const square = row * 10 + col + 1;
        result.push({
          square,
          row: displayRow,
          col: displayCol,
          isSnakeHead: square in SNAKES,
          isLadderBottom: square in LADDERS,
          isSnakeTail: Object.values(SNAKES).includes(square),
          isLadderTop: Object.values(LADDERS).includes(square),
        });
      }
    }
    return result;
  }, []);

  const getCellBg = (cell: typeof cells[0], idx: number) => {
    if (cell.square === 100) return "rgba(255,215,0,0.15)";
    if (cell.square === 1) return "rgba(0,255,150,0.08)";
    if (cell.isSnakeHead) return "rgba(255,71,87,0.12)";
    if (cell.isLadderBottom) return "rgba(0,184,148,0.12)";
    if (cell.isLadderTop) return "rgba(0,184,148,0.08)";
    if (cell.isSnakeTail) return "rgba(255,71,87,0.08)";

    const row = Math.floor(idx / 10);
    const col = idx % 10;
    const isLight = (row + col) % 2 === 0;
    return isLight
      ? "rgba(255,255,255,0.04)"
      : "rgba(255,255,255,0.02)";
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Board container */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          width: BOARD_PX,
          height: BOARD_PX,
          background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b2a 50%, #0a0a1a 100%)",
          border: "2px solid rgba(255,255,255,0.1)",
          boxShadow: "0 0 60px rgba(0,150,255,0.15), 0 30px 80px rgba(0,0,0,0.8)",
        }}
      >
        {/* Grid cells */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
            gridTemplateRows: `repeat(${BOARD_SIZE}, ${CELL_SIZE}px)`,
          }}
        >
          {cells.map((cell, idx) => (
            <div
              key={cell.square}
              className="relative flex flex-col items-center justify-start pt-1 border border-white/5"
              style={{ background: getCellBg(cell, idx) }}
            >
              {/* Square number */}
              <span
                className="text-xs font-bold leading-none z-10"
                style={{
                  color:
                    cell.square === 100
                      ? "#FFD700"
                      : cell.isSnakeHead
                      ? "#ff6b81"
                      : cell.isLadderBottom
                      ? "#55efc4"
                      : "rgba(255,255,255,0.35)",
                  fontSize: "9px",
                }}
              >
                {cell.square}
              </span>

              {/* Special cell icons */}
              {cell.square === 100 && (
                <span className="text-lg mt-1">🏆</span>
              )}
              {cell.square === 1 && (
                <span className="text-base mt-1">🚀</span>
              )}
              {cell.isSnakeHead && !cell.isLadderBottom && (
                <span className="text-base opacity-60">🐍</span>
              )}
              {cell.isLadderBottom && !cell.isSnakeHead && (
                <span className="text-base opacity-60">🪜</span>
              )}
            </div>
          ))}
        </div>

        {/* SVG overlay for snakes and ladders */}
        <svg
          className="absolute inset-0 pointer-events-none"
          width={BOARD_PX}
          height={BOARD_PX}
          viewBox={`0 0 ${BOARD_PX} ${BOARD_PX}`}
        >
          <defs>
            {LADDER_DEFS.map((_l, i) => (
              <filter key={`lf-${i}`} id={`ladder-glow-${i}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
            {SNAKE_DEFS.map((_s, i) => (
              <filter key={`sf-${i}`} id={`snake-glow-${i}`}>
                <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            ))}
            <marker
              id="snake-arrow"
              markerWidth="6"
              markerHeight="6"
              refX="3"
              refY="3"
              orient="auto"
            >
              <circle cx="3" cy="3" r="2" fill="#ff4757" />
            </marker>
          </defs>

          {/* Draw Ladders */}
          {LADDER_DEFS.map((ladder, i) => {
            const { left, right, rungs } = generateLadderPath(
              ladder.bottom,
              ladder.top
            );
            return (
              <g key={`ladder-${i}`} filter={`url(#ladder-glow-${i})`}>
                {/* Shadow */}
                <path
                  d={left}
                  stroke={ladder.color}
                  strokeWidth="5"
                  fill="none"
                  opacity="0.2"
                />
                <path
                  d={right}
                  stroke={ladder.color}
                  strokeWidth="5"
                  fill="none"
                  opacity="0.2"
                />
                {/* Main rails */}
                <path
                  d={left}
                  stroke={ladder.shadow}
                  strokeWidth="3"
                  fill="none"
                  opacity="0.9"
                  strokeLinecap="round"
                />
                <path
                  d={right}
                  stroke={ladder.shadow}
                  strokeWidth="3"
                  fill="none"
                  opacity="0.9"
                  strokeLinecap="round"
                />
                {/* Rungs */}
                {rungs.map((rung, ri) => (
                  <line
                    key={ri}
                    x1={rung.x1}
                    y1={rung.y1}
                    x2={rung.x2}
                    y2={rung.y2}
                    stroke={ladder.color}
                    strokeWidth="2.5"
                    opacity="0.8"
                    strokeLinecap="round"
                  />
                ))}
              </g>
            );
          })}

          {/* Draw Snakes */}
          {SNAKE_DEFS.map((snake, i) => {
            const path = generateSnakePath(snake.head, snake.tail);
            return (
              <g key={`snake-${i}`} filter={`url(#snake-glow-${i})`}>
                {/* Thick shadow */}
                <path
                  d={path}
                  stroke={snake.color}
                  strokeWidth="14"
                  fill="none"
                  opacity="0.15"
                  strokeLinecap="round"
                />
                {/* Snake body */}
                <path
                  d={path}
                  stroke={snake.shadow}
                  strokeWidth="9"
                  fill="none"
                  opacity="0.3"
                  strokeLinecap="round"
                />
                <path
                  d={path}
                  stroke={snake.color}
                  strokeWidth="6"
                  fill="none"
                  opacity="0.9"
                  strokeLinecap="round"
                  strokeDasharray="4 2"
                />
                <path
                  d={path}
                  stroke={snake.shadow}
                  strokeWidth="2"
                  fill="none"
                  opacity="0.7"
                  strokeLinecap="round"
                />
              </g>
            );
          })}

          {/* Player tokens */}
          {players.map((player) => {
            if (player.position === 0) return null;
            const [cx, cy] = getCellCenter(player.position);
            const config = PLAYER_CONFIGS[player.id];
            const isCurrentP = player.id === currentPlayer;
            const isAnimating = player.id === animatingPlayer;

            // Offset tokens slightly when multiple players are on same cell
            const offsetIdx = players.filter(p => p.position === player.position).findIndex(p => p.id === player.id);
            const offsetAngles = [
              { dx: 0, dy: 0 },
              { dx: 10, dy: -8 },
              { dx: -10, dy: -8 },
              { dx: 0, dy: 10 },
            ];
            const offset = offsetAngles[offsetIdx] || { dx: 0, dy: 0 };

            return (
              <g
                key={`player-${player.id}`}
                style={{
                  transition: isAnimating
                    ? "transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)"
                    : "transform 0.4s ease-in-out",
                }}
              >
                {/* Glow effect for current player */}
                {isCurrentP && (
                  <circle
                    cx={cx + offset.dx}
                    cy={cy + offset.dy}
                    r="20"
                    fill={config.color}
                    opacity="0.2"
                  >
                    <animate
                      attributeName="r"
                      values="16;24;16"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="opacity"
                      values="0.3;0.1;0.3"
                      dur="1.5s"
                      repeatCount="indefinite"
                    />
                  </circle>
                )}

                {/* Token shadow */}
                <ellipse
                  cx={cx + offset.dx}
                  cy={cy + offset.dy + 14}
                  rx="10"
                  ry="3"
                  fill="rgba(0,0,0,0.5)"
                />

                {/* Token body */}
                <circle
                  cx={cx + offset.dx}
                  cy={cy + offset.dy}
                  r="13"
                  fill={config.color}
                  stroke="#fff"
                  strokeWidth="2"
                  style={{
                    filter: `drop-shadow(0 0 8px ${config.color})`,
                  }}
                />

                {/* Player label */}
                <text
                  x={cx + offset.dx}
                  y={cy + offset.dy + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize="9"
                  fontWeight="bold"
                  fontFamily="Rajdhani, sans-serif"
                >
                  {config.avatar}
                </text>

                {/* Crown for current player */}
                {isCurrentP && (
                  <text
                    x={cx + offset.dx}
                    y={cy + offset.dy - 16}
                    textAnchor="middle"
                    fontSize="12"
                  >
                    👑
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Corner decorations */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-yellow-400/30 rounded-tl-2xl" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-yellow-400/30 rounded-tr-2xl" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-yellow-400/30 rounded-bl-2xl" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-yellow-400/30 rounded-br-2xl" />
      </div>
    </div>
  );
};

export default GameBoard;
