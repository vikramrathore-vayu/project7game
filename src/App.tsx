import { useState, useCallback, useRef } from "react";
import GameBoard from "./components/GameBoard";
import DiceRoller from "./components/DiceRoller";
import PlayerPanel from "./components/PlayerPanel";
import GameLog from "./components/GameLog";
import WinScreen from "./components/WinScreen";
import SetupScreen from "./components/SetupScreen";
import { SNAKES, LADDERS, PLAYER_CONFIGS } from "./gameData";
import { LogEntry } from "./components/GameLog";

interface PlayerState {
  id: number;
  name: string;
  position: number;
  score: number;
  snakeBites: number;
  ladderClimbs: number;
}

type GamePhase = "setup" | "playing" | "finished";

let logIdCounter = 0;

export default function App() {
  const [phase, setPhase] = useState<GamePhase>("setup");
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [winner, setWinner] = useState<number | null>(null);
  const [lastRoll, setLastRoll] = useState<number | null>(null);
  const [isRolling, setIsRolling] = useState(false);
  const [animatingPlayer, setAnimatingPlayer] = useState<number | null>(null);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: "snake" | "ladder" | "win" | "info";
    color: string;
  } | null>(null);

  const notifTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const addLog = useCallback(
    (
      playerId: number,
      message: string,
      type: LogEntry["type"]
    ) => {
      setLogs((prev) => [
        ...prev,
        { id: ++logIdCounter, playerId, message, type, timestamp: Date.now() },
      ]);
    },
    []
  );

  const showNotification = useCallback(
    (
      message: string,
      type: "snake" | "ladder" | "win" | "info",
      color: string
    ) => {
      setNotification({ message, type, color });
      if (notifTimerRef.current) clearTimeout(notifTimerRef.current);
      notifTimerRef.current = setTimeout(() => setNotification(null), 3000);
    },
    []
  );

  const handleStart = useCallback(
    (playerDefs: { id: number; name: string }[]) => {
      const initialPlayers: PlayerState[] = playerDefs.map((p) => ({
        ...p,
        position: 0,
        score: 0,
        snakeBites: 0,
        ladderClimbs: 0,
      }));
      setPlayers(initialPlayers);
      setCurrentPlayer(0);
      setWinner(null);
      setLastRoll(null);
      setLogs([]);
      setPhase("playing");
      addLog(-1, "Game started! Good luck!", "info");
    },
    [addLog]
  );

  const handleRoll = useCallback(
    (rolledValue: number) => {
      if (isRolling || phase !== "playing") return;

      setIsRolling(true);
      setLastRoll(rolledValue);

      const player = players[currentPlayer];
      const config = PLAYER_CONFIGS[player.id];
      addLog(player.id, `rolled a ${rolledValue}`, "roll");

      // Animate dice rolling for 1.2s then move
      setTimeout(() => {
        setIsRolling(false);
        setAnimatingPlayer(player.id);

        const newPos = player.position + rolledValue;

        if (newPos > 100) {
          // Can't move, need exact roll
          addLog(player.id, `needs ${100 - player.position} to win! Stays at ${player.position}`, "info");
          showNotification(
            `${player.name} needs ${100 - player.position} to win!`,
            "info",
            config.color
          );
          setPlayers((prev) =>
            prev.map((p) =>
              p.id === player.id
                ? { ...p, score: p.score + 1 }
                : p
            )
          );
          setAnimatingPlayer(null);
          setCurrentPlayer((prev) => (prev + 1) % players.length);
          return;
        }

        // Move player
        setPlayers((prev) =>
          prev.map((p) =>
            p.id === player.id
              ? { ...p, position: newPos, score: p.score + 1 }
              : p
          )
        );
        addLog(player.id, `moved to square ${newPos}`, "move");

        setTimeout(() => {
          // Check for win
          if (newPos === 100) {
            setWinner(player.id);
            setPhase("finished");
            setAnimatingPlayer(null);
            addLog(player.id, `WON THE GAME! 🏆`, "win");
            showNotification(`${player.name} WINS! 🏆`, "win", "#FFD700");
            return;
          }

          // Check for snake
          if (newPos in SNAKES) {
            const snakeTail = SNAKES[newPos];
            setTimeout(() => {
              setPlayers((prev) =>
                prev.map((p) =>
                  p.id === player.id
                    ? { ...p, position: snakeTail, snakeBites: p.snakeBites + 1 }
                    : p
                )
              );
              addLog(player.id, `got bitten by a snake! 🐍 Slid from ${newPos} to ${snakeTail}`, "snake");
              showNotification(
                `🐍 Snake! ${player.name} slides from ${newPos} → ${snakeTail}`,
                "snake",
                "#ff6b81"
              );
              setAnimatingPlayer(null);
              setCurrentPlayer((prev) => (prev + 1) % players.length);
            }, 600);
            return;
          }

          // Check for ladder
          if (newPos in LADDERS) {
            const ladderTop = LADDERS[newPos];
            setTimeout(() => {
              setPlayers((prev) =>
                prev.map((p) =>
                  p.id === player.id
                    ? { ...p, position: ladderTop, ladderClimbs: p.ladderClimbs + 1 }
                    : p
                )
              );
              addLog(player.id, `climbed a ladder! 🪜 Jumped from ${newPos} to ${ladderTop}`, "ladder");
              showNotification(
                `🪜 Ladder! ${player.name} climbs from ${newPos} → ${ladderTop}`,
                "ladder",
                "#55efc4"
              );
              setAnimatingPlayer(null);
              setCurrentPlayer((prev) => (prev + 1) % players.length);
            }, 600);
            return;
          }

          setAnimatingPlayer(null);
          setCurrentPlayer((prev) => (prev + 1) % players.length);
        }, 500);
      }, 1200);
    },
    [isRolling, phase, players, currentPlayer, addLog, showNotification]
  );

  const handlePlayAgain = useCallback(() => {
    setPhase("setup");
    setPlayers([]);
    setCurrentPlayer(0);
    setWinner(null);
    setLastRoll(null);
    setLogs([]);
    setNotification(null);
    setAnimatingPlayer(null);
    setIsRolling(false);
  }, []);

  if (phase === "setup") {
    return <SetupScreen onStart={handleStart} />;
  }

  const currentConfig = PLAYER_CONFIGS[players[currentPlayer]?.id ?? 0];

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        background:
          "linear-gradient(135deg, #050510 0%, #0a0a1f 30%, #050515 60%, #0a0515 100%)",
        fontFamily: "Rajdhani, sans-serif",
      }}
    >
      {/* Header */}
      <header
        className="flex items-center justify-between px-6 py-3 flex-shrink-0"
        style={{
          background: "rgba(0,0,0,0.5)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(10px)",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            className="text-2xl font-black tracking-widest"
            style={{
              fontFamily: "Orbitron, sans-serif",
              background: "linear-gradient(135deg, #FFD700, #FF6B6B, #4ECDC4)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            VAYU
          </div>
          <div
            className="text-xs tracking-widest uppercase"
            style={{ color: "rgba(255,255,255,0.3)", fontFamily: "Cinzel, serif" }}
          >
            Snakes & Ladders
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{
              background: "rgba(255,215,0,0.1)",
              border: "1px solid rgba(255,215,0,0.2)",
              color: "#FFD700",
            }}
          >
            ⭐ Premium
          </div>
          <button
            onClick={handlePlayAgain}
            className="px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all hover:scale-105"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.15)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            🔄 New Game
          </button>
        </div>
      </header>

      {/* Notification Banner */}
      {notification && (
        <div
          className="fixed top-16 left-1/2 z-40 px-6 py-3 rounded-2xl text-center font-bold text-lg pointer-events-none"
          style={{
            background: `linear-gradient(135deg, ${notification.color}22, ${notification.color}11)`,
            border: `2px solid ${notification.color}`,
            color: notification.color,
            boxShadow: `0 0 40px ${notification.color}44`,
            backdropFilter: "blur(10px)",
            maxWidth: "90vw",
            transform: "translateX(-50%)",
            animation: "slide-down 0.4s ease forwards",
          }}
        >
          {notification.message}
        </div>
      )}

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col xl:flex-row items-start justify-center gap-4 p-4 overflow-auto">
        {/* Left Panel - Players */}
        <div
          className="w-full xl:w-64 flex-shrink-0 rounded-2xl p-4"
          style={{
            background: "rgba(10,10,30,0.8)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(10px)",
            order: 2,
          }}
        >
          <PlayerPanel
            players={players}
            currentPlayer={currentPlayer}
            winner={winner}
          />

          {/* Legend */}
          <div
            className="mt-4 pt-4 rounded-xl p-3"
            style={{
              borderTop: "1px solid rgba(255,255,255,0.08)",
              background: "rgba(255,255,255,0.02)",
            }}
          >
            <div className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: "rgba(255,255,255,0.3)" }}>
              Legend
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <span>🐍</span>
                <span style={{ color: "rgba(255,107,129,0.8)" }}>Snake — Slide Down</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>🪜</span>
                <span style={{ color: "rgba(85,239,196,0.8)" }}>Ladder — Climb Up</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span>🏆</span>
                <span style={{ color: "rgba(255,215,0,0.8)" }}>Square 100 = Win!</span>
              </div>
            </div>
          </div>
        </div>

        {/* Board */}
        <div
          className="flex-shrink-0"
          style={{ order: 1 }}
        >
          <GameBoard
            players={players}
            currentPlayer={currentPlayer}
            animatingPlayer={animatingPlayer}
          />
        </div>

        {/* Right Panel - Dice + Log */}
        <div
          className="w-full xl:w-64 flex-shrink-0 flex flex-col gap-4"
          style={{ order: 3 }}
        >
          {/* Dice Panel */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "rgba(10,10,30,0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <DiceRoller
              onRoll={handleRoll}
              disabled={phase !== "playing" || isRolling}
              lastRoll={lastRoll}
              currentPlayerColor={currentConfig?.color ?? "#fff"}
              currentPlayerName={players[currentPlayer]?.name ?? ""}
              isRolling={isRolling}
            />
          </div>

          {/* Game Log Panel */}
          <div
            className="rounded-2xl p-4 flex-1"
            style={{
              background: "rgba(10,10,30,0.8)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
            }}
          >
            <GameLog logs={logs} />
          </div>

          {/* Board Reference Card */}
          <div
            className="rounded-2xl p-4"
            style={{
              background: "rgba(10,10,30,0.8)",
              border: "1px solid rgba(255,215,0,0.15)",
              backdropFilter: "blur(10px)",
            }}
          >
            <div className="text-xs font-bold tracking-widest uppercase mb-3 text-center" style={{ color: "rgba(255,215,0,0.6)" }}>
              Key Positions
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <div className="text-red-400 font-bold mb-1">🐍 Snakes</div>
                {Object.entries(SNAKES).map(([head, tail]) => (
                  <div key={head} className="text-gray-500">
                    {head} → {tail}
                  </div>
                ))}
              </div>
              <div>
                <div className="text-teal-400 font-bold mb-1">🪜 Ladders</div>
                {Object.entries(LADDERS).map(([bottom, top]) => (
                  <div key={bottom} className="text-gray-500">
                    {bottom} → {top}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Win Screen */}
      {phase === "finished" && winner !== null && (
        <WinScreen
          winnerId={winner}
          players={players}
          onPlayAgain={handlePlayAgain}
        />
      )}

      {/* Ambient background effects */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full opacity-5"
          style={{
            background: currentConfig?.color ?? "#fff",
            filter: "blur(80px)",
            transition: "background 0.8s ease",
          }}
        />
        <div
          className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full opacity-5"
          style={{
            background: "#a29bfe",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Custom scrollbar styles */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.03);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.15);
          border-radius: 2px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.25);
        }
        * {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.15) rgba(255,255,255,0.03);
        }
        @keyframes slide-down {
          0% { opacity: 0; transform: translate(-50%, -20px); }
          100% { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>
    </div>
  );
}
