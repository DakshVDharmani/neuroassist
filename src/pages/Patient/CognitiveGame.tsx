import React, { useRef, useState, useEffect, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/services/supabaseClient";
import toast from "react-hot-toast";

// === GAME MODES ===
const MODES = ["Attention Catch", "N-Back", "Go/No-Go"] as const;
type GameMode = typeof MODES[number];

interface GameState {
  score: number;
  time: number;
  round: number;
  message: string;
  running: boolean;
}

// === HUD OVERLAY ===
function HUD({
  gameState,
  mode,
  onModeChange,
  onRestart,
}: {
  gameState: GameState;
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  onRestart: () => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none p-4 md:p-6 text-white">
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-black/30 backdrop-blur-sm border-white/20 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Score</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{gameState.score}</div></CardContent>
        </Card>
        <Card className="bg-black/30 backdrop-blur-sm border-white/20 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Time</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{gameState.time}s</div></CardContent>
        </Card>
        <Card className="bg-black/30 backdrop-blur-sm border-white/20 text-white">
          <CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Round</CardTitle></CardHeader>
          <CardContent><div className="text-2xl font-bold">{gameState.round}</div></CardContent>
        </Card>
      </div>

      {gameState.message && (
        <motion.div
          key={gameState.message}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-xl font-semibold text-yellow-300 drop-shadow-lg"
        >
          {gameState.message}
        </motion.div>
      )}

      <div className="flex flex-wrap justify-center gap-2 pointer-events-auto">
        {MODES.map((m) => (
          <Button key={m} variant={mode === m ? "secondary" : "outline"} onClick={() => onModeChange(m)}>{m}</Button>
        ))}
        <Button onClick={onRestart} variant="destructive">Restart</Button>
      </div>
    </div>
  );
}

// === GAME LOGIC COMPONENTS ===

// --- Attention Catch ---
function AttentionCatchGame({ gameState, setGameState }: { gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  const [isActive, setIsActive] = useState(false);
  const ref = useRef<THREE.Mesh>(null!);
  const [pos, setPos] = useState<[number, number, number]>([0,0,0]);

  useEffect(() => {
    if (!gameState.running) return;
    const interval = setInterval(() => {
      setIsActive(true);
      setPos([(Math.random() - 0.5) * 10, (Math.random() - 0.5) * 5 + 2, (Math.random() - 0.5) * 10]);
      setTimeout(() => setIsActive(false), 900 - gameState.round * 20);
    }, Math.max(2000 - gameState.round * 150, 700));
    return () => clearInterval(interval);
  }, [gameState.running, gameState.round]);

  const handleCatch = () => {
    if (isActive) {
      setGameState(gs => ({ ...gs, score: gs.score + 10, message: "Caught!" }));
      setIsActive(false);
    }
  };
  
  useFrame((_state, delta) => {
    ref.current.rotation.y += delta * 0.7;
  });

  return (
    <mesh ref={ref} position={pos} onClick={handleCatch} visible={isActive}>
      <dodecahedronGeometry args={[0.6, 0]} />
      <meshStandardMaterial color="lime" emissive="green" emissiveIntensity={2} />
    </mesh>
  );
}

// --- N-Back ---
function NBackGame({ gameState, setGameState }: { gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
  const n = 2; // 2-back
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentItem, setCurrentItem] = useState(0);

  useEffect(() => {
    if (!gameState.running) return;
    setGameState(gs => ({ ...gs, message: `Press SPACE if the number matches the one from ${n} steps ago.` }));
    const interval = setInterval(() => {
      const newItem = Math.floor(Math.random() * 9) + 1;
      setCurrentItem(newItem);
      setSequence(seq => [...seq, newItem]);
    }, 2500);
    return () => clearInterval(interval);
  }, [gameState.running]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.code !== "Space" || !gameState.running) return;
      e.preventDefault();
      const isMatch = sequence.length > n && sequence[sequence.length - 1] === sequence[sequence.length - 1 - n];
      if (isMatch) {
        setGameState(gs => ({ ...gs, score: gs.score + 15, message: "Correct Match!" }));
      } else {
        setGameState(gs => ({ ...gs, score: Math.max(0, gs.score - 5), message: "False Alarm!" }));
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [sequence, gameState.running]);

  return <Text position={[0, 1, -5]} fontSize={3} color="white">{currentItem || ''}</Text>;
}

// --- Go/No-Go ---
function GoNoGoGame({ gameState, setGameState }: { gameState: GameState, setGameState: React.Dispatch<React.SetStateAction<GameState>> }) {
    const [stimulus, setStimulus] = useState<{ color: string, isGo: boolean } | null>(null);
    const goColor = "cyan";
    const noGoColor = "tomato";

    useEffect(() => {
        if (!gameState.running) return;
        setGameState(gs => ({ ...gs, message: `Press SPACE for the ${goColor} shape, but not for ${noGoColor}.` }));
        const interval = setInterval(() => {
            const isGo = Math.random() > 0.3; // 70% go trials
            setStimulus({ color: isGo ? goColor : noGoColor, isGo });
            setTimeout(() => setStimulus(null), 800);
        }, 1500);
        return () => clearInterval(interval);
    }, [gameState.running]);

    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.code !== "Space" || !gameState.running || !stimulus) return;
            e.preventDefault();
            if (stimulus.isGo) {
                setGameState(gs => ({ ...gs, score: gs.score + 5, message: "Correct!" }));
            } else {
                setGameState(gs => ({ ...gs, score: Math.max(0, gs.score - 10), message: "Oops! Inhibition error." }));
            }
            setStimulus(null); // Prevent multiple presses
        };
        window.addEventListener("keydown", handleKey);
        return () => window.removeEventListener("keydown", handleKey);
    }, [stimulus, gameState.running]);

    return stimulus ? (
        <mesh position={[0, 1, -5]}>
            <boxGeometry args={[2, 2, 2]} />
            <meshStandardMaterial color={stimulus.color} emissive={stimulus.color} emissiveIntensity={1} />
        </mesh>
    ) : null;
}


// === MAIN GAME COMPONENT ===
export default function CognitiveGame() {
  const { user } = useAuth();
  const [mode, setMode] = useState<GameMode>("Attention Catch");
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    time: 60,
    round: 1,
    message: "Select a game mode to begin!",
    running: false,
  });

  const resetGame = (start = true) => {
    setGameState({
      score: 0,
      time: 60,
      round: 1,
      running: start,
      message: start ? `Game started: ${mode}` : "Select a game mode to begin!",
    });
  };

  const saveGameAttempt = async () => {
    if (!user) return;
    const { error } = await supabase.from('game_attempts').insert({
        user_id: user.id,
        game_slug: mode.toLowerCase().replace(' ', '-'),
        score: gameState.score,
        metadata: { finalRound: gameState.round }
    });
    if (error) {
        toast.error("Failed to save game result.");
        console.error("Error saving game attempt:", error);
    } else {
        toast.success("Game result saved!");
    }
  };

  useEffect(() => resetGame(false), [mode]);

  useEffect(() => {
    if (!gameState.running) return;
    if (gameState.time <= 0) {
      setGameState(gs => ({ ...gs, running: false, message: "Game Over! Your score: " + gs.score }));
      saveGameAttempt();
      return;
    }
    const timer = setTimeout(() => setGameState(gs => ({ ...gs, time: gs.time - 1 })), 1000);
    return () => clearTimeout(timer);
  }, [gameState.time, gameState.running]);

  useEffect(() => {
    if (!gameState.running) return;
    const roundTimer = setInterval(() => setGameState(gs => ({ ...gs, round: gs.round + 1 })), 15 * 1000);
    return () => clearInterval(roundTimer);
  }, [gameState.running]);

  const gameComponents: Record<GameMode, React.ReactNode> = {
    "Attention Catch": <AttentionCatchGame gameState={gameState} setGameState={setGameState} />,
    "N-Back": <NBackGame gameState={gameState} setGameState={setGameState} />,
    "Go/No-Go": <GoNoGoGame gameState={gameState} setGameState={setGameState} />,
  };

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-black">
      <HUD gameState={gameState} mode={mode} onModeChange={setMode} onRestart={() => resetGame(true)} />
      <Canvas shadows camera={{ position: [0, 2, 15], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        <Suspense fallback={null}>
          {gameState.running && gameComponents[mode]}
          <OrbitControls enableZoom={false} enablePan={false} minPolarAngle={Math.PI/4} maxPolarAngle={3*Math.PI/4} />
          <mesh rotation-x={-Math.PI / 2} position={[0, -5, 0]} receiveShadow>
            <planeGeometry args={[500, 500]} />
            <meshStandardMaterial color="#1a1a1a" />
          </mesh>
          <Text position={[0, 6, -10]} fontSize={1} color="white" anchorX="center">Cognitive Arena</Text>
        </Suspense>
      </Canvas>
    </div>
  );
}
