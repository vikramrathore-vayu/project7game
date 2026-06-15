import React, { useState, useEffect } from "react";

interface DiceRollerProps {
  onRoll: (value: number) => void;
  disabled: boolean;
  lastRoll: number | null;
  currentPlayerColor: string;
  currentPlayerName: string;
  isRolling: boolean;
}

const DICE_FACES = [
  // 1
  [
    [0, 0, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  // 2
  [
    [1, 0, 0],
    [0, 0, 0],
    [0, 0, 1],
  ],
  // 3
  [
    [1, 0, 0],
    [0, 1, 0],
    [0, 0, 1],
  ],
  // 4
  [
    [1, 0, 1],
    [0, 0, 0],
    [1, 0, 1],
  ],
  // 5
  [
    [1, 0, 1],
    [0, 1, 0],
    [1, 0, 1],
  ],
  // 6
  [
    [1, 0, 1],
    [1, 0, 1],
    [1, 0, 1],
  ],
];

const DiceRoller: React.FC<DiceRollerProps> = ({
  onRoll,
  disabled,
  lastRoll,
  currentPlayerColor,
  currentPlayerName,
  isRolling,
}) => {
  const [animatingValue, setAnimatingValue] = useState<number>(1);
  const [shake, setShake] = useState(false);

  useEffect(() => {
    if (isRolling) {
      setShake(true);
      let count = 0;
      const interval = setInterval(() => {
        setAnimatingValue(Math.floor(Math.random() * 6) + 1);
        count++;
        if (count > 12) {
          clearInterval(interval);
          setShake(false);
        }
      }, 80);
      return () => clearInterval(interval);
    }
  }, [isRolling]);

  const displayValue = isRolling ? animatingValue : lastRoll ?? 1;
  const face = DICE_FACES[displayValue - 1];

  const handleRoll = () => {
    if (disabled || isRolling) return;
    const val = Math.floor(Math.random() * 6) + 1;
    onRoll(val);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Current Player Indicator */}
      <div
        className="px-4 py-2 rounded-full text-sm font-bold tracking-widest uppercase"
        style={{
          background: `linear-gradient(135deg, ${currentPlayerColor}33, ${currentPlayerColor}11)`,
          border: `2px solid ${currentPlayerColor}`,
          color: currentPlayerColor,
          boxShadow: `0 0 20px ${currentPlayerColor}44`,
        }}
      >
        {currentPlayerName}'s Turn
      </div>

      {/* Dice */}
      <div
        className={`relative cursor-pointer select-none transition-all duration-200 ${
          shake ? "animate-bounce" : ""
        } ${disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-110"}`}
        onClick={handleRoll}
        style={{
          filter: disabled
            ? "grayscale(0.5)"
            : `drop-shadow(0 0 20px ${currentPlayerColor}88)`,
        }}
      >
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
            border: `3px solid ${currentPlayerColor}`,
            boxShadow: `0 0 30px ${currentPlayerColor}55, inset 0 0 20px rgba(0,0,0,0.5)`,
          }}
        >
          <div className="grid grid-cols-3 gap-1 p-2 w-14 h-14">
            {face.map((row, ri) =>
              row.map((dot, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  className="flex items-center justify-center"
                >
                  {dot === 1 && (
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{
                        background: currentPlayerColor,
                        boxShadow: `0 0 8px ${currentPlayerColor}`,
                      }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Glow ring when rolling */}
        {isRolling && (
          <div
            className="absolute inset-0 rounded-2xl animate-ping opacity-30"
            style={{ border: `4px solid ${currentPlayerColor}` }}
          />
        )}
      </div>

      {/* Roll Button */}
      <button
        onClick={handleRoll}
        disabled={disabled || isRolling}
        className={`relative px-8 py-3 rounded-full font-bold text-lg tracking-widest uppercase overflow-hidden transition-all duration-300 ${
          disabled || isRolling
            ? "opacity-50 cursor-not-allowed"
            : "hover:scale-105 active:scale-95"
        }`}
        style={{
          background: disabled || isRolling
            ? "rgba(255,255,255,0.1)"
            : `linear-gradient(135deg, ${currentPlayerColor}, ${currentPlayerColor}99)`,
          border: `2px solid ${currentPlayerColor}`,
          color: disabled || isRolling ? "#888" : "#fff",
          boxShadow:
            disabled || isRolling
              ? "none"
              : `0 0 25px ${currentPlayerColor}66, 0 8px 32px rgba(0,0,0,0.3)`,
        }}
      >
        {isRolling ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">🎲</span> Rolling...
          </span>
        ) : (
          <span className="flex items-center gap-2">🎲 Roll Dice</span>
        )}
      </button>

      {lastRoll && !isRolling && (
        <div className="text-center">
          <span className="text-gray-400 text-sm">Last Roll: </span>
          <span
            className="text-2xl font-black"
            style={{ color: currentPlayerColor }}
          >
            {lastRoll}
          </span>
        </div>
      )}
    </div>
  );
};

export default DiceRoller;
