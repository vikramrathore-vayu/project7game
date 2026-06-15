import React, { useRef, useEffect } from "react";
import { PLAYER_CONFIGS } from "../gameData";

export interface LogEntry {
  id: number;
  playerId: number;
  message: string;
  type: "roll" | "snake" | "ladder" | "move" | "win" | "info";
  timestamp: number;
}

interface GameLogProps {
  logs: LogEntry[];
}

const TYPE_ICONS: Record<LogEntry["type"], string> = {
  roll: "🎲",
  snake: "🐍",
  ladder: "🪜",
  move: "➡️",
  win: "🏆",
  info: "ℹ️",
};

const TYPE_COLORS: Record<LogEntry["type"], string> = {
  roll: "#a29bfe",
  snake: "#ff6b81",
  ladder: "#55efc4",
  move: "rgba(255,255,255,0.7)",
  win: "#FFD700",
  info: "#74b9ff",
};

const GameLog: React.FC<GameLogProps> = ({ logs }) => {
  const logRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-2">
        <h3
          className="text-xs font-bold tracking-widest uppercase"
          style={{ color: "rgba(255,255,255,0.4)" }}
        >
          Game Log
        </h3>
      </div>

      <div
        ref={logRef}
        className="flex-1 overflow-y-auto space-y-1 pr-1 custom-scrollbar"
        style={{ maxHeight: "220px" }}
      >
        {logs.length === 0 ? (
          <div className="text-center py-4 text-xs text-gray-600">
            Game events will appear here...
          </div>
        ) : (
          [...logs].reverse().map((log, idx) => {
            const config = PLAYER_CONFIGS[log.playerId];
            const isRecent = idx === 0;

            return (
              <div
                key={log.id}
                className="flex items-start gap-2 rounded-lg p-2 text-xs transition-all duration-300"
                style={{
                  background: isRecent
                    ? `${TYPE_COLORS[log.type]}11`
                    : "rgba(255,255,255,0.02)",
                  border: isRecent
                    ? `1px solid ${TYPE_COLORS[log.type]}33`
                    : "1px solid transparent",
                  opacity: idx > 10 ? 0.5 : 1,
                }}
              >
                <span className="flex-shrink-0 text-sm">
                  {TYPE_ICONS[log.type]}
                </span>
                <div className="flex-1 min-w-0">
                  <span
                    className="font-bold"
                    style={{ color: config?.color || "white" }}
                  >
                    {config?.name || "System"}
                  </span>
                  <span style={{ color: TYPE_COLORS[log.type] }}>
                    {" "}
                    {log.message}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default GameLog;
