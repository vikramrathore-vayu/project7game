import React, { useEffect, useState } from "react";
import { PLAYER_CONFIGS } from "../gameData";

interface PlayerState {
  id: number;
  name: string;
  score: number;
  snakeBites: number;
  ladderClimbs: number;
}

interface WinScreenProps {
  winnerId: number;
  players: PlayerState[];
  onPlayAgain: () => void;
}

const WinScreen: React.FC<WinScreenProps> = ({
  winnerId,
  players,
  onPlayAgain,
}) => {
  const [visible, setVisible] = useState(false);
  const config = PLAYER_CONFIGS[winnerId];
  const winner = players.find((p) => p.id === winnerId);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(12px)" }}
    >
      {/* Confetti particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-3 h-3 rounded-sm"
            style={{
              left: `${Math.random() * 100}%`,
              top: `-10px`,
              background: [
                "#FF6B6B",
                "#4ECDC4",
                "#FFE66D",
                "#A29BFE",
                "#FF9FF3",
                "#54A0FF",
              ][i % 6],
              animation: `confetti-fall ${2 + Math.random() * 3}s ease-in ${Math.random() * 2}s infinite`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          />
        ))}
      </div>

      <div
        className={`relative max-w-md w-full mx-4 rounded-3xl p-8 text-center transition-all duration-700 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-75"
        }`}
        style={{
          background: `linear-gradient(135deg, #0a0a1a, #0d1b2a)`,
          border: `3px solid ${config.color}`,
          boxShadow: `0 0 80px ${config.color}55, 0 0 200px ${config.color}22`,
        }}
      >
        {/* Trophy animation */}
        <div className="text-8xl mb-4" style={{ filter: "drop-shadow(0 0 30px gold)" }}>
          🏆
        </div>

        {/* Winner announcement */}
        <div
          className="text-4xl font-black mb-2 tracking-widest"
          style={{
            fontFamily: "Cinzel, serif",
            background: `linear-gradient(135deg, ${config.color}, #fff, ${config.color})`,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {winner?.name}
        </div>
        <div
          className="text-xl font-bold mb-1"
          style={{ color: config.color }}
        >
          WINS THE GAME!
        </div>
        <div className="text-gray-400 text-sm mb-6">
          Reached Square 100 🎉
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="text-2xl">🎲</div>
            <div className="text-xl font-black text-white">{winner?.score}</div>
            <div className="text-xs text-gray-500">Rolls</div>
          </div>
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(255,71,87,0.1)", border: "1px solid rgba(255,71,87,0.2)" }}
          >
            <div className="text-2xl">🐍</div>
            <div className="text-xl font-black text-red-400">{winner?.snakeBites}</div>
            <div className="text-xs text-gray-500">Snake Bites</div>
          </div>
          <div
            className="rounded-xl p-3"
            style={{ background: "rgba(0,184,148,0.1)", border: "1px solid rgba(0,184,148,0.2)" }}
          >
            <div className="text-2xl">🪜</div>
            <div className="text-xl font-black text-teal-400">{winner?.ladderClimbs}</div>
            <div className="text-xs text-gray-500">Ladders</div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="mb-6">
          <h4 className="text-xs text-gray-500 uppercase tracking-widest mb-3">Final Standings</h4>
          {[...players]
            .sort((_a, b) => b.id === winnerId ? 1 : -1)
            .map((p, idx) => {
              const pc = PLAYER_CONFIGS[p.id];
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-3 py-2 px-3 rounded-lg mb-1"
                  style={{
                    background: p.id === winnerId ? `${pc.color}22` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${p.id === winnerId ? pc.color : "transparent"}`,
                  }}
                >
                  <span className="text-lg">{idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "4️⃣"}</span>
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-black"
                    style={{ background: pc.color }}
                  >
                    {pc.avatar.slice(-1)}
                  </div>
                  <span className="font-bold text-sm" style={{ color: pc.color }}>{p.name}</span>
                  <span className="ml-auto text-xs text-gray-500">{p.score} rolls</span>
                </div>
              );
            })}
        </div>

        {/* Play Again button */}
        <button
          onClick={onPlayAgain}
          className="w-full py-4 rounded-2xl font-black text-lg tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95"
          style={{
            background: `linear-gradient(135deg, ${config.color}, ${config.color}88)`,
            boxShadow: `0 0 30px ${config.color}55`,
            color: "white",
            fontFamily: "Orbitron, sans-serif",
          }}
        >
          🎮 Play Again
        </button>
      </div>

      <style>{`
        @keyframes confetti-fall {
          0% { transform: translateY(-10px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default WinScreen;
