import React, { useState } from "react";
import { PLAYER_CONFIGS } from "../gameData";

interface SetupScreenProps {
  onStart: (players: { id: number; name: string }[]) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [playerCount, setPlayerCount] = useState(2);
  const [playerNames, setPlayerNames] = useState([
    "Arjun", "Priya", "Rahul", "Ananya",
  ]);

  const handleStart = () => {
    const players = Array.from({ length: playerCount }, (_, i) => ({
      id: i,
      name: playerNames[i] || PLAYER_CONFIGS[i].name,
    }));
    onStart(players);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #050510 0%, #0a0a1f 30%, #050515 60%, #0a0515 100%)",
      }}
    >
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-20"
            style={{
              width: `${20 + Math.random() * 60}px`,
              height: `${20 + Math.random() * 60}px`,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A29BFE"][i % 4],
              filter: "blur(20px)",
              animation: `float ${4 + Math.random() * 6}s ease-in-out ${Math.random() * 4}s infinite alternate`,
            }}
          />
        ))}
      </div>

      {/* Snake decorations */}
      <div className="absolute top-10 left-10 text-6xl opacity-20 animate-pulse">🐍</div>
      <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-pulse" style={{ animationDelay: "1s" }}>🪜</div>
      <div className="absolute top-1/2 left-5 text-4xl opacity-15 animate-bounce">🎲</div>
      <div className="absolute top-20 right-20 text-4xl opacity-15 animate-bounce" style={{ animationDelay: "0.5s" }}>🎯</div>

      <div className="relative z-10 w-full max-w-lg mx-4">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          {/* VAYU Logo */}
          <div className="mb-4">
            <div
              className="inline-block text-7xl font-black tracking-widest mb-2"
              style={{
                fontFamily: "Orbitron, sans-serif",
                background: "linear-gradient(135deg, #FFD700, #FF6B6B, #4ECDC4, #A29BFE)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                filter: "drop-shadow(0 0 30px rgba(255,215,0,0.5))",
              }}
            >
              VAYU
            </div>
          </div>
          <div
            className="text-xl font-bold tracking-widest uppercase mb-1"
            style={{ fontFamily: "Cinzel, serif", color: "rgba(255,255,255,0.7)" }}
          >
            Snakes & Ladders
          </div>
          <div
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.3)" }}
          >
            Premium Edition
          </div>

          {/* Decorative line */}
          <div className="flex items-center gap-3 mt-4 justify-center">
            <div className="h-px w-20 bg-gradient-to-r from-transparent to-yellow-400/50" />
            <div className="text-yellow-400/50 text-xs">⚡</div>
            <div className="h-px w-20 bg-gradient-to-l from-transparent to-yellow-400/50" />
          </div>
        </div>

        {/* Setup Card */}
        <div
          className="rounded-3xl p-8"
          style={{
            background: "rgba(10,10,30,0.9)",
            border: "1px solid rgba(255,255,255,0.1)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.8), 0 0 60px rgba(100,100,255,0.1)",
            backdropFilter: "blur(20px)",
          }}
        >
          {/* Player Count */}
          <div className="mb-6">
            <label className="block text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
              Number of Players
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[2, 3, 4].map((count) => (
                <button
                  key={count}
                  onClick={() => setPlayerCount(count)}
                  className="col-span-1 py-3 rounded-xl font-black text-lg transition-all duration-300 hover:scale-105"
                  style={{
                    background:
                      playerCount === count
                        ? "linear-gradient(135deg, #6c5ce7, #a29bfe)"
                        : "rgba(255,255,255,0.05)",
                    border: `2px solid ${playerCount === count ? "#a29bfe" : "rgba(255,255,255,0.1)"}`,
                    color: playerCount === count ? "white" : "rgba(255,255,255,0.5)",
                    boxShadow:
                      playerCount === count
                        ? "0 0 20px rgba(108,92,231,0.5)"
                        : "none",
                  }}
                >
                  {count}P
                </button>
              ))}
              <div className="col-span-1 flex items-center justify-center">
                <span className="text-xs text-gray-600 text-center">2-4 Players</span>
              </div>
            </div>
          </div>

          {/* Player Names */}
          <div className="mb-8">
            <label className="block text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "rgba(255,255,255,0.5)" }}>
              Player Names
            </label>
            <div className="space-y-3">
              {Array.from({ length: playerCount }, (_, i) => {
                const config = PLAYER_CONFIGS[i];
                return (
                  <div key={i} className="flex items-center gap-3">
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-black text-white text-sm flex-shrink-0"
                      style={{
                        background: `linear-gradient(135deg, ${config.color}, ${config.color}88)`,
                        border: `2px solid ${config.color}`,
                        boxShadow: `0 0 12px ${config.color}44`,
                      }}
                    >
                      {config.avatar}
                    </div>
                    <input
                      type="text"
                      value={playerNames[i]}
                      onChange={(e) => {
                        const newNames = [...playerNames];
                        newNames[i] = e.target.value;
                        setPlayerNames(newNames);
                      }}
                      maxLength={12}
                      placeholder={config.name}
                      className="flex-1 px-4 py-2.5 rounded-xl text-white text-sm font-bold outline-none transition-all duration-200 focus:scale-102"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: `2px solid rgba(255,255,255,0.1)`,
                        caretColor: config.color,
                      }}
                      onFocus={(e) => {
                        e.target.style.border = `2px solid ${config.color}`;
                        e.target.style.boxShadow = `0 0 15px ${config.color}33`;
                      }}
                      onBlur={(e) => {
                        e.target.style.border = `2px solid rgba(255,255,255,0.1)`;
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          {/* Start Button */}
          <button
            onClick={handleStart}
            className="w-full py-4 rounded-2xl font-black text-xl tracking-widest uppercase transition-all duration-300 hover:scale-105 active:scale-95 relative overflow-hidden group"
            style={{
              background: "linear-gradient(135deg, #FFD700, #FF6B35, #FF6B6B)",
              boxShadow: "0 0 40px rgba(255,180,0,0.5), 0 10px 40px rgba(0,0,0,0.4)",
              color: "white",
              fontFamily: "Orbitron, sans-serif",
            }}
          >
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
            🎮 Start Game
          </button>

          {/* Features */}
          <div className="grid grid-cols-3 gap-2 mt-6">
            {[
              { icon: "🐍", label: "8 Snakes" },
              { icon: "🪜", label: "8 Ladders" },
              { icon: "✨", label: "Animated" },
            ].map((f) => (
              <div
                key={f.label}
                className="text-center py-2 rounded-xl"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <div className="text-lg">{f.icon}</div>
                <div className="text-xs text-gray-500 mt-0.5">{f.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-4">
          <span
            className="text-xs tracking-widest"
            style={{ color: "rgba(255,255,255,0.2)", fontFamily: "Rajdhani, sans-serif" }}
          >
            VAYU PREMIUM GAMES © 2024
          </span>
        </div>
      </div>

      <style>{`
        @keyframes float {
          0% { transform: translateY(0) scale(1); }
          100% { transform: translateY(-30px) scale(1.1); }
        }
      `}</style>
    </div>
  );
};

export default SetupScreen;
