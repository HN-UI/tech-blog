"use client";

import { useLayoutEffect, useRef, useState } from "react";

const KEEP_VISIBLE = 80; // 드래그해도 화면 안에 최소한 남겨둘 px

// 갈색 타이틀 바 — 본문과 완전히 독립 (바를 옮겨도 본문은 안 움직임)
const BAR_TOP = "20px"; // 바 위치 — 창 위 테두리에서 떨어진 거리 (키우면 아래로)
const BAR_HEIGHT = "112px"; // 바 두께

// 본문이 시작하는 위치 — 바와 별개로 직접 지정
const CONTENT_TOP = "140px"; // 창 위 테두리에서 떨어진 거리

export default function DraggableWindow({ title, plate, onClose, children }) {
  const winRef = useRef(null);
  const [pos, setPos] = useState({ x: 0, y: 0 }); // 창의 좌상단 위치(px)

  // 마운트 시 화면 가운데 살짝 위쪽에 배치 (paint 전이라 깜빡임 없음)
  useLayoutEffect(() => {
    const el = winRef.current;
    const ww = el?.offsetWidth ?? 672;
    const wh = el?.offsetHeight ?? 450;
    setPos({
      x: Math.max(8, (window.innerWidth - ww) / 2),
      y: Math.max(8, window.innerHeight / 2 - wh / 2 - 60),
    });
  }, []);

  // 타이틀 바를 잡고 드래그 → 창 이동 (화면 밖으로 완전히 나가지 않게 제한)
  const onDragStart = (e) => {
    e.preventDefault();
    const startX = e.clientX;
    const startY = e.clientY;
    const orig = { ...pos };
    const el = winRef.current;
    const ww = el?.offsetWidth ?? 512;
    const wh = el?.offsetHeight ?? 300;

    const onMove = (ev) => {
      const nx = orig.x + (ev.clientX - startX);
      const ny = orig.y + (ev.clientY - startY);
      const maxX = window.innerWidth - Math.min(ww, KEEP_VISIBLE);
      const maxY = window.innerHeight - Math.min(wh, 48);
      setPos({
        x: Math.min(maxX, Math.max(-(ww - KEEP_VISIBLE), nx)),
        y: Math.min(maxY, Math.max(0, ny)),
      });
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  return (
    <div
      ref={winRef}
      className="pixel-window fixed z-50 min-h-[600px] w-[90%] max-w-5xl overflow-hidden"
      style={{ left: pos.x, top: pos.y }}
    >
      {/* 타이틀 바 = 드래그 핸들. 창에 떠 있어서 옮겨도 본문은 그대로 */}
      <div
        onPointerDown={onDragStart}
        className="absolute inset-x-0 flex cursor-move select-none items-center bg-wood px-4"
        style={{
          top: BAR_TOP, // 바 위치 (본문에 영향 없음)
          height: BAR_HEIGHT, // 바 두께
        }}
      >
        {/* 창 제목 — 바 왼쪽 (text-paper=크림색, 위치는 px-* 로 조절) */}
        <h2 className="font-pixel text-5xl font-bold text-paper px-6">{title}</h2>

        {/* 오른쪽 노란 박스 — 박스 위치는 right-/top-, 박스 크기는 width/height (고정) */}
        <div
          className="absolute right-20 top-1/2 -translate-y-1/2 rounded-lg border border-black/10 bg-plate shadow-sm"
          style={{
            width: "360px", // 박스 가로
            height: "92px", // 박스 세로
          }}
        >
          {/* 박스 안 글씨 — left/top 으로 자유 이동 (박스 크기와 무관).
              글씨 크기는 text-*, 내용은 panels.js 의 plate 값 */}
          <span
            className="absolute font-pixel text-4xl font-bold text-ink"
            style={{
              left: "36px", // 박스 왼쪽에서 떨어진 거리
              top: "50%", // 박스 위에서 떨어진 거리
              transform: "translateY(-50%)", // top 기준 세로 가운데 정렬 (지우면 top 이 글씨 위쪽 기준)
            }}
          >
            {plate}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          onPointerDown={(e) => e.stopPropagation()}
          className="absolute right-4 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full text-lg text-paper hover:bg-wood-hover"
          aria-label="닫기"
        >
          ✕
        </button>
      </div>
      {/* 본문 영역 — CONTENT_TOP 부터 창 아래까지. 안의 요소는 이 영역 좌상단(0,0) 기준 px 좌표 */}
      <div className="absolute inset-x-0 bottom-0" style={{ top: CONTENT_TOP }}>
        {children}
      </div>
    </div>
  );
}
