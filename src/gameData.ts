// Snakes: key = head (where snake bites), value = tail (where you slide to)
export const SNAKES: Record<number, number> = {
  17: 7,
  54: 34,
  62: 19,
  64: 60,
  87: 24,
  93: 73,
  95: 75,
  99: 78,
};

// Ladders: key = bottom (where you climb), value = top (where you reach)
export const LADDERS: Record<number, number> = {
  4: 14,
  9: 31,
  20: 38,
  28: 84,
  40: 59,
  51: 67,
  63: 81,
  71: 91,
};

export const PLAYER_CONFIGS = [
  {
    id: 0,
    name: "Player 1",
    color: "#FF6B6B",
    bgClass: "bg-red-500",
    textClass: "text-red-400",
    borderClass: "border-red-500",
    shadowClass: "shadow-red-500/50",
    gradientFrom: "from-red-600",
    gradientTo: "to-red-400",
    emoji: "🔴",
    avatar: "P1",
  },
  {
    id: 1,
    name: "Player 2",
    color: "#4ECDC4",
    bgClass: "bg-teal-400",
    textClass: "text-teal-400",
    borderClass: "border-teal-400",
    shadowClass: "shadow-teal-400/50",
    gradientFrom: "from-teal-600",
    gradientTo: "to-teal-400",
    emoji: "🔵",
    avatar: "P2",
  },
  {
    id: 2,
    name: "Player 3",
    color: "#FFE66D",
    bgClass: "bg-yellow-400",
    textClass: "text-yellow-400",
    borderClass: "border-yellow-400",
    shadowClass: "shadow-yellow-400/50",
    gradientFrom: "from-yellow-500",
    gradientTo: "to-yellow-300",
    emoji: "🟡",
    avatar: "P3",
  },
  {
    id: 3,
    name: "Player 4",
    color: "#A29BFE",
    bgClass: "bg-purple-400",
    textClass: "text-purple-400",
    borderClass: "border-purple-400",
    shadowClass: "shadow-purple-400/50",
    gradientFrom: "from-purple-600",
    gradientTo: "to-purple-400",
    emoji: "🟣",
    avatar: "P4",
  },
];

// Convert square number (1-100) to [row, col] on the board
// Board: row 0 = top (squares 91-100), row 9 = bottom (squares 1-10)
export function squareToRowCol(square: number): [number, number] {
  if (square < 1 || square > 100) return [-1, -1];
  const idx = square - 1; // 0-indexed
  const row = Math.floor(idx / 10); // 0 = bottom row
  const col = idx % 10;

  // Even rows (0, 2, 4...) go left-to-right, odd rows go right-to-left
  const displayRow = 9 - row; // flip: row 0 on board = bottom = square 1-10
  const displayCol = row % 2 === 0 ? col : 9 - col;

  return [displayRow, displayCol];
}

export function rowColToSquare(displayRow: number, displayCol: number): number {
  const row = 9 - displayRow;
  const col = row % 2 === 0 ? displayCol : 9 - displayCol;
  return row * 10 + col + 1;
}
