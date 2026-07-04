"use client";

// 키보드 방향키(또는 WASD)로 직접 움직이는 캐릭터.
// 걷는 동안 걸음 모션 프레임이 순환하고, 멈추면 서 있는 자세(0번 프레임)로 돌아옵니다.
//
// 스프라이트: /public/sprites/character/base_<방향>_<프레임>.png
//   방향 = down | up | left | right,  프레임 = 0(정지) / 1,2(걷기)

import { useEffect, useRef, useState } from "react";

const DIR = "/sprites/character";
const DISPLAY = 72; // 화면에 그려지는 캐릭터 크기(px)
const SPEED = 5; // 프레임당 이동 거리(px) — 키우면 빠르게
const FRAME_MS = 130; // 걸음 프레임 전환 간격(ms) — 줄이면 발이 빨리 움직임

// 방향별 보유 프레임 수. up 걷기 프레임(base_up_1/2)을 추가하면 up 값을 3으로 바꾸세요.
const FRAME_COUNT = { down: 3, up: 1, left: 3, right: 3 };

// 걸음 순환 패턴 (정지 → 왼발 → 정지 → 오른발)
function walkCycle(dir) {
  const n = FRAME_COUNT[dir];
  if (n >= 3) return [0, 1, 0, 2];
  if (n === 2) return [0, 1];
  return [0];
}

const KEY_DIR = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
  w: "up",
  s: "down",
  a: "left",
  d: "right",
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export default function PlayerCharacter() {
  const elRef = useRef(null);
  const posRef = useRef({ x: 0, y: 0 });
  const pressed = useRef([]); // 눌린 방향들 (누른 순서대로)
  const dirRef = useRef("down");
  const movingRef = useRef(false);

  const [dir, setDir] = useState("down");
  const [frame, setFrame] = useState(0);

  function applyPos() {
    const el = elRef.current;
    const p = posRef.current;
    if (el) el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
  }

  useEffect(() => {
    // 시작 위치: 화면 가운데쯤
    posRef.current = {
      x: window.innerWidth / 2 - DISPLAY / 2,
      y: window.innerHeight / 2 - DISPLAY / 2,
    };
    applyPos();

    const keyDir = (e) => KEY_DIR[e.key.length === 1 ? e.key.toLowerCase() : e.key];

    const onDown = (e) => {
      const d = keyDir(e);
      if (!d) return;
      e.preventDefault(); // 방향키로 페이지 스크롤되는 것 방지
      if (!pressed.current.includes(d)) pressed.current.push(d);
    };
    const onUp = (e) => {
      const d = keyDir(e);
      if (!d) return;
      pressed.current = pressed.current.filter((x) => x !== d);
    };

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);

    // 이동 루프 (매 프레임 위치 갱신)
    let raf;
    const loop = () => {
      const keys = pressed.current;
      const moving = keys.length > 0;
      movingRef.current = moving;

      if (moving) {
        const cur = keys[keys.length - 1]; // 가장 최근에 누른 방향을 바라봄
        if (cur !== dirRef.current) {
          dirRef.current = cur;
          setDir(cur);
        }
        let dx = 0;
        let dy = 0;
        if (keys.includes("left")) dx -= 1;
        if (keys.includes("right")) dx += 1;
        if (keys.includes("up")) dy -= 1;
        if (keys.includes("down")) dy += 1;
        if (dx && dy) {
          const inv = 1 / Math.sqrt(2); // 대각선 이동 속도 보정
          dx *= inv;
          dy *= inv;
        }
        const p = posRef.current;
        p.x = clamp(p.x + dx * SPEED, 0, window.innerWidth - DISPLAY);
        p.y = clamp(p.y + dy * SPEED, 0, window.innerHeight - DISPLAY);
        applyPos();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    // 걸음 프레임 순환
    const anim = setInterval(() => {
      if (!movingRef.current) {
        setFrame(0);
        return;
      }
      setFrame((f) => f + 1);
    }, FRAME_MS);

    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
      cancelAnimationFrame(raf);
      clearInterval(anim);
    };
  }, []);

  const cyc = walkCycle(dir);
  const frameIdx = cyc[frame % cyc.length];
  const src = `${DIR}/base_${dir}_${frameIdx}.png`;

  return (
    <img
      ref={elRef}
      src={src}
      alt="player"
      draggable={false}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: DISPLAY,
        height: DISPLAY,
        imageRendering: "pixelated",
        zIndex: 20,
        willChange: "transform",
      }}
    />
  );
}
