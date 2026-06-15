import React from "react";
import { PLAYER_CONFIGS } from "../gameData";

interface PlayerState {
  id: number;
  position: number;
  name: string;
  score: number;
  snakeBites: number;
  ladderClimbs: number;
}

interface PlayerPanelProps {
  players: PlayerState[];
  currentPlayer: number;
  winner: number | null;
}

const PlayerPanel: React.FC<PlayerPanelProps> = ({
  players,
  currentPlayer,
  winner,
}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-center mb-1">
        <h3
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Players
        </h3>
      </div>
      {players.map((player) => {
        const config = PLAYER_CONFIGS[player.id];
        const isCurrent = player.id === currentPlayer;
        const isWinner = player.id === winner;

        return (
          <div
            key={player.id}
            className="relative rounded-xl p-3 transition-all duration-300"
            style={{
              background: isCurrent
                ? `linear-gradient(135deg, ${config.color}22, ${config.color}11)`
                : "rgba(255,255,255,0.04)",
              border: `2px solid ${isCurrent ? config.color : "rgba(255,255,255,0.08)"}`,
              boxShadow: isCurrent
                ? `0 0 20px ${config.color}33`
                : "none",
              transform: isCurrent ? "scale(1.02)" : "scale(1)",
            }}
          >
            {/* Winner badge */}
            {isWinner && (
              <div
                className="absolute -top-2 -right-2 text-lg"
                style={{ filter: "drop-shadow(0 0 8px gold)" }}
              >
                🏆
              </div>
            )}

            {/* Current player indicator */}
            {isCurrent && !isWinner && (
              <div
                className="absolute -top-2 -right-2 w-4 h-4 rounded-full"
                style={{
                  background: config.color,
                  boxShadow: `0 0 8px ${config.color}`,
                }}
              >
                <div
                  className="w-full h-full rounded-full animate-ping opacity-75"
                  style={{ background: config.color }}
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* Avatar */}
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-black text-sm flex-shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${config.color}, ${config.color}88)`,
                  border: `2px solid ${config.color}`,
                  boxShadow: `0 0 12px ${config.color}55`,
                }}
              >
                {config.avatar}
              </div>

              {/* Player info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span
                    className="font-bold text-sm truncate"
                    style={{ color: isCurrent ? config.color : "rgba(255,255,255,0.8)" }}
                  >
                    {player.name}
                  </span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-full"
                    style={{
                      background: `${config.color}22`,
                      color: config.color,
                      border: `1px solid ${config.color}44`,
                    }}
                  >
                    #{player.position === 0 ? "Start" : player.position}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-1.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${player.position}%`,
                      background: `linear-gradient(90deg, ${config.color}88, ${config.color})`,
                      boxShadow: `0 0 8px ${config.color}`,
                    }}
                  />
                </div>

                {/* Stats */}
                <div className="flex gap-3 mt-1.5">
                  <span className="text-xs text-red-400">
                    🐍 {player.snakeBites}
                  </span>
                  <span className="text-xs text-green-400">
                    🪜 {player.ladderClimbs}
                  </span>
                  <span className="text-xs text-yellow-400">
                    🎲 {player.score}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default PlayerPanel;
