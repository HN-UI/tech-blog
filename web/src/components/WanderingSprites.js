"use client";

import { useEffect, useState } from "react";

const SPRITES = [
  { key: "me", icon: "🧑‍💻", size: "text-3xl", startX: 20, startY: 30 },
  { key: "book", icon: "📘", size: "text-2xl", startX: 60, startY: 55 },
  { key: "star", icon: "⭐", size: "text-2xl", startX: 40, startY: 70 },
];

const BOUNDS = { min: 8, max: 88 };
const STEP = 1; // 한 번에 움직이는 최대 거리(%)

function clamp(value) {
  return Math.min(BOUNDS.max, Math.max(BOUNDS.min, value));
}

function nearbySpot(current) {
  return {
    x: clamp(current.x + (Math.random() * 2 - 1) * STEP),
    y: clamp(current.y + (Math.random() * 2 - 1) * STEP),
  };
}

function SpriteDot({ icon, size, startX, startY, intervalMs }) {
  const [pos, setPos] = useState({ x: startX, y: startY });

  useEffect(() => {
    const id = setInterval(() => {
      setPos((current) => nearbySpot(current));
    }, intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);

  return (
    <div
      className={`absolute ${size} transition-all duration-[900ms] ease-in-out`}
      style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
    >
      {icon}
    </div>
  );
}

export default function WanderingSprites() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {SPRITES.map((sprite, index) => (
        <SpriteDot
          key={sprite.key}
          icon={sprite.icon}
          size={sprite.size}
          startX={sprite.startX}
          startY={sprite.startY}
          intervalMs={3000 + index * 1000}
        />
      ))}
    </div>
  );
}
