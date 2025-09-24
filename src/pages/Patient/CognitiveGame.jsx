import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";

// === UTILS ===
function randomPos(range = 5) {
  return (Math.random() - 0.5) * range * 2;
}
function clamp(v, min, max) {
  return Math.min(max, Math.max(min, v));
}

// === DISTRACTOR SHAPES ===
function Distractor() {
  const ref = useRef();
  const color = useMemo(
    () =>
      ["#ff005b", "#00ffaa", "#0095ff", "#ffd500"][
        Math.floor(Math.random() * 4)
      ],
    []
  );
  const [pos] = useState([randomPos(10), randomPos(4) + 2, randomPos(10)]);
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta * 0.6;
      ref.current.rotation.y += delta * 0.4;
    }
  });
  return (
    <mesh ref={ref} position={pos}>
      <icosahedronGeometry args={[0.5]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
}

// === GAME MODES ===
const MODES = ["Attention Catch", "N-Back", "Stroop 3D", "Spatial Memory"];

// === HUD OVERLAY ===
function HUD({ score, time, round, mode, message, onModeChange }) {
  return (
    <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
      <div className="flex justify-between p-4 text-white">
        <div className="text-lg font-bold">Mode: {mode}</div>
        <div className="flex gap-8">
          <div>Score: {score}</div>
          <div>Time: {time}s</div>
          <div>Round: {round}</div>
        </div>
      </div>
      {message && (
        <div className="text-center mb-12 text-xl font-semibold text-yellow-300 animate-pulse">
          {message}
        </div>
      )}
      <div className="flex justify-center gap-4 pb-4 pointer-events-auto">
        {MODES.map((m) => (
          <button
            key={m}
            onClick={() => onModeChange(m)}
            className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-600"
          >
            {m}
          </button>
        ))}
      </div>
    </div>
  );
}

// === ATTENTION CATCH (space when green target lights) ===
function AttentionTask({ isActive, onCatch }) {
  const ref = useRef();
  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x += delta;
      ref.current.rotation.y += delta * 1.2;
    }
  });
  return (
    <mesh
      ref={ref}
      position={[randomPos(6), randomPos(3) + 2, randomPos(6)]}
      onClick={onCatch}
      scale={isActive ? 1.4 : 1}
    >
      <dodecahedronGeometry args={[0.6]} />
      <meshStandardMaterial
        color={isActive ? "lime" : "orange"}
        emissive={isActive ? "green" : "black"}
      />
    </mesh>
  );
}

// === MAIN GAME ===
export default function CognitiveGame() {
  const [mode, setMode] = useState(MODES[0]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(45);
  const [round, setRound] = useState(1);
  const [message, setMessage] = useState("Press SPACE when the green target appears!");
  const [running, setRunning] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [n, setN] = useState(1); // for N-back

  // === TIMER ===
  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      setMessage("Game Over! Press Enter to Restart.");
      return;
    }
    const t = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(t);
  }, [time, running]);

  // === ATTENTION TASK LOGIC ===
  useEffect(() => {
    if (mode !== "Attention Catch" || !running) return;
    const interval = setInterval(() => {
      setIsActive(true);
      setTimeout(() => setIsActive(false), 900);
    }, Math.max(2000 - round * 150, 700));
    return () => clearInterval(interval);
  }, [mode, round, running]);

  // === KEYBOARD INPUT ===
  useEffect(() => {
    function handleKey(e) {
      if (!running) {
        if (e.code === "Enter") {
          setScore(0);
          setTime(45);
          setRound(1);
          setRunning(true);
          setMessage(`Restarted ${mode}.`);
        }
        return;
      }
      if (mode === "Attention Catch" && e.code === "Space") {
        if (isActive) {
          setScore((s) => s + 10);
          setMessage("Sharp!");
        } else {
          setScore((s) => Math.max(0, s - 5));
          setMessage("Too early!");
        }
      }
      // TODO: Add Stroop, N-Back, Spatial memory keyboard logic here
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [running, mode, isActive]);

  // === ROUND PROGRESSION ===
  useEffect(() => {
    if (!running) return;
    const r = setInterval(() => setRound((r) => r + 1), 15 * 1000);
    return () => clearInterval(r);
  }, [running]);

  return (
    <div className="relative w-full h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800">
      <HUD
        score={score}
        time={time}
        round={round}
        mode={mode}
        message={message}
        onModeChange={(m) => {
          setMode(m);
          setMessage(`Switched to ${m}`);
        }}
      />
      <Canvas shadows camera={{ position: [0, 5, 15], fov: 60 }}>
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 10, 5]} intensity={1.2} castShadow />
        <Stars radius={50} depth={50} count={3000} factor={4} fade />
        <Suspense fallback={null}>
          {mode === "Attention Catch" && (
            <AttentionTask isActive={isActive} onCatch={() => setScore((s) => s + 10)} />
          )}
          {Array.from({ length: 20 }).map((_, i) => (
            <Distractor key={i} />
          ))}
          <OrbitControls enableZoom={false} />
          <mesh rotation-x={-Math.PI / 2} position={[0, -2, 0]} receiveShadow>
            <planeGeometry args={[200, 200]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <Text position={[0, 6, 0]} fontSize={1.2} color="white">
            Cognitive Training Arena
          </Text>
        </Suspense>
      </Canvas>
    </div>
  );
}
