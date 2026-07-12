"use client";

// 선 위에서 캐릭터가 감자를 쫓아가 걷어차는 작은 물리 놀이터.
//
//   쫓기(chase) → 닿으면 걷어참 → 감자가 포물선/바운스로 굴러감(캐릭터 정지)
//   → 감자가 멈추면 잠깐 뜸 들였다가 다시 쫓기
//
// 감자만 물리 대상이고, 캐릭터는 등속으로 걷습니다.

import { useEffect, useRef } from "react";

const SPRITE = "/sprites/character";
const WALK = [0, 1, 0, 2]; // 걸음 순환 (정지 → 왼발 → 정지 → 오른발)
const FRAME_MS = 160; // 걸음 프레임 전환 간격(ms)

const CHAR = { w: 30, h: 30, speed: 15 }; // speed = 초당 이동 px
const POTATO = { w: 30, h: 24, src: "/sprites/object/potato.png" }; // 원본 비율 1.25:1

// ── 물리 조절값 ────────────────────────────────────────────────
const GRAVITY = 420; // 중력 (px/s²) — 키우면 낮고 빠른 포물선
const KICK_VX = [120, 240]; // 걷어찰 때 수평 속도 범위 (px/s) — 넓히면 날아가는 거리가 들쭉날쭉
const KICK_VY = [100, 160]; // 걷어찰 때 수직 속도 범위 (px/s) — 키우면 높이 뜸
const BOUNCE = 0.5; // 바닥 반발 계수 (0=안 튐, 1=완전 탄성)
const WALL_BOUNCE = 0.3; // 벽 반발 계수
const ROLL_DRAG = 2.4; // 바닥 구를 때 감속 (초당 비율) — 키우면 빨리 멈춤
const REST_VX = 5; // 이 속도 아래면 멈춘 것으로 침 (px/s)
const REST_VY = 25;
const PAUSE_MS = 250; // 감자가 멈춘 뒤 다시 쫓아가기까지 뜸 들이는 시간

const TRACK_HEIGHT = Math.max(CHAR.h, POTATO.h);
const POTATO_RADIUS = POTATO.w / 2; // 구르는 회전량 계산용

// 스프라이트 좌우의 투명 여백 보정 — 그림 끝이 아니라 실제 발끝이 닿아야 걷어참.
// 키우면 감자에 더 바짝 붙어서 참
const FOOT_INSET = 6;

const rand = (lo, hi) => lo + Math.random() * (hi - lo);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

export default function PotatoPlayground() {
  const trackRef = useRef(null);
  const charRef = useRef(null);
  const potatoRef = useRef(null);

  useEffect(() => {
    // 모션 최소화 설정이면 그냥 서 있게 둠
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const track = trackRef.current;
    if (!track) return;

    // x 는 왼쪽 끝 기준, y 는 바닥에서 띄운 높이(위가 +)
    const char = { x: 0, dir: 1, elapsed: 0, moving: false };
    const potato = { x: 0, y: 0, vx: 0, vy: 0, angle: 0, spin: 0, resting: true };
    let pause = 0; // 남은 대기 시간(ms)

    // 트랙 폭은 레이아웃이 끝나야 알 수 있음. 폭이 처음 잡히는 순간 초기 배치
    let width = 0;
    let placed = false;
    const ro = new ResizeObserver(([entry]) => {
      width = entry.contentRect.width;
      if (!placed && width > 0) {
        char.x = 0;
        potato.x = Math.max(0, width - POTATO.w) * 0.65;
        placed = true;
      }
    });
    ro.observe(track);

    const centerX = (o, w) => o.x + w / 2;

    // 캐릭터가 바라보는 방향으로 감자를 걷어참
    function kick() {
      potato.vx = rand(...KICK_VX) * char.dir;
      potato.vy = rand(...KICK_VY);
      potato.spin = potato.vx / POTATO_RADIUS; // 구르는 방향과 회전 방향 일치
      potato.resting = false;
      char.moving = false;
    }

    function stepPotato(dt) {
      if (potato.resting) return;
      const maxX = Math.max(0, width - POTATO.w);

      potato.vy -= GRAVITY * dt;
      potato.x += potato.vx * dt;
      potato.y += potato.vy * dt;

      // 좌우 벽에 튕김
      if (potato.x <= 0 || potato.x >= maxX) {
        potato.x = clamp(potato.x, 0, maxX);
        potato.vx = -potato.vx * WALL_BOUNCE;
        potato.spin = potato.vx / POTATO_RADIUS;
      }

      // 바닥에 닿음
      if (potato.y <= 0) {
        potato.y = 0;
        if (potato.vy < 0) potato.vy = -potato.vy * BOUNCE;

        // 바닥을 구르는 동안 감속
        potato.vx -= potato.vx * ROLL_DRAG * dt;
        potato.spin = potato.vx / POTATO_RADIUS;

        // 충분히 느려지면 정지 → 캐릭터가 다시 쫓아감
        if (Math.abs(potato.vy) < REST_VY && Math.abs(potato.vx) < REST_VX) {
          potato.vx = 0;
          potato.vy = 0;
          potato.spin = 0;
          potato.resting = true;
          pause = PAUSE_MS;
        }
      }

      potato.angle += potato.spin * dt * (180 / Math.PI);
    }

    function stepChar(dt, dtMs) {
      // 감자가 굴러가는 중이거나 뜸 들이는 중이면 멈춰서 구경
      if (!potato.resting) return (char.moving = false);
      if (pause > 0) {
        pause -= dtMs;
        char.moving = false;
        return;
      }

      // 먼저 감자 쪽을 바라본 뒤, 그 방향의 '앞발'이 감자에 닿았는지 본다
      const gap = centerX(potato, POTATO.w) - centerX(char, CHAR.w);
      char.dir = Math.sign(gap) || 1;

      // 앞발 끝 x 와, 그 방향에서 마주보는 감자의 모서리 x
      const foot = char.dir > 0 ? char.x + CHAR.w - FOOT_INSET : char.x + FOOT_INSET;
      const edge = char.dir > 0 ? potato.x : potato.x + POTATO.w;

      // 앞발이 감자 모서리를 넘어섰으면(진행 방향 기준) 접촉
      if ((edge - foot) * char.dir <= 0) return kick();

      char.moving = true;
      char.x = clamp(char.x + char.dir * CHAR.speed * dt, 0, Math.max(0, width - CHAR.w));
    }

    let raf;
    let last = performance.now();
    const loop = (now) => {
      const dtMs = Math.min(now - last, 100); // 탭 복귀 시 한 번에 튀는 것 방지
      last = now;
      const dt = dtMs / 1000;

      if (placed) {
        stepPotato(dt);
        stepChar(dt, dtMs);
        if (char.moving) char.elapsed += dtMs;
      }

      // state 없이 DOM 직접 갱신 — 매 프레임 리렌더를 피함
      const cEl = charRef.current;
      if (cEl) {
        cEl.style.transform = `translate3d(${char.x}px, 0, 0)`;
        const frame = char.moving ? WALK[Math.floor(char.elapsed / FRAME_MS) % WALK.length] : 0;
        const next = `${SPRITE}/base_${char.dir > 0 ? "right" : "left"}_${frame}.png`;
        if (!cEl.getAttribute("src").endsWith(next)) cEl.setAttribute("src", next);
      }

      const pEl = potatoRef.current;
      if (pEl) {
        pEl.style.transform = `translate3d(${potato.x}px, ${-potato.y}px, 0) rotate(${potato.angle}deg)`;
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, []);

  const base = "absolute bottom-0 left-0";
  const pixel = { imageRendering: "pixelated", willChange: "transform" };

  return (
    // 둘 다 이 박스의 바닥선에 발을 딛음 — 선 자체는 호출부(헤더 테두리)가 그림
    <div ref={trackRef} className="relative shrink-0" style={{ height: TRACK_HEIGHT }}>
      <img
        ref={charRef}
        src={`${SPRITE}/base_right_0.png`}
        alt=""
        draggable={false}
        className={base}
        style={{ width: CHAR.w, height: CHAR.h, ...pixel }}
      />
      <img
        ref={potatoRef}
        src={POTATO.src}
        alt=""
        draggable={false}
        className={base}
        style={{ width: POTATO.w, height: POTATO.h, ...pixel }}
      />
    </div>
  );
}
