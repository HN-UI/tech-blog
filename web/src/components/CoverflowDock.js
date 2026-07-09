"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";

import DraggableWindow from "./DraggableWindow";
import { PANELS } from "./panels";

const DOCK_ITEMS = [
  { key: "folder", label: "Photos", image: "/sprites/icon/camera.png", imgClass: "h-24 w-24 object-bottom -mb-1" },
  { key: "report", label: "Report", image: "/sprites/icon/report.png", imgClass: "h-24 w-24 object-bottom -mb-1" },
  { key: "profile", label: "Profile", image: "/sprites/icon/profile.png", imgClass: "h-40 w-40 object-bottom -mb-9", panel: true },
  { key: "project", label: "Projects", image: "/sprites/icon/project.png", imgClass: "h-24 w-24" },
  { key: "research", label: "Research", image: "/sprites/icon/research.png", imgClass: "h-30 w-30 object-bottom -mb-4" },
];

const N = DOCK_ITEMS.length;
const SPACING = 180; // 슬롯(아이템) 간 가로 간격(px) — 키우면 넓게 퍼짐
const TRANSITION = "transform 0.5s ease-out, opacity 0.5s ease-out";

// 슬롯 거리(0=가운데, ±1=옆, ±2=바깥)에 따른 크기/투명도/겹침순서
function slotStyle(rel) {
  const a = Math.abs(rel);
  const scale = a === 0 ? 1 : a === 1 ? 0.82 : 0.68;
  const opacity = a > 2 ? 0 : a === 0 ? 1 : a === 1 ? 0.55 : 0.25; // ±3(이음새 밖)은 투명
  return { scale, opacity, z: 10 - a };
}

function applyStyle(el, rel) {
  const { scale, opacity, z } = slotStyle(rel);
  el.style.transform = `translateX(calc(-50% + ${rel * SPACING}px)) scale(${scale})`;
  el.style.opacity = String(opacity);
  el.style.zIndex = String(z);
}

// i번 아이템이 active 기준 몇 번째 슬롯인지 (원형 최단거리, -2~+2)
function circRel(i, active) {
  let r = ((i - active) % N + N) % N; // 0..N-1
  if (r > N / 2) r -= N; // 절반 넘으면 음수 쪽으로
  return r;
}

// 원형 최단 회전 방향/거리
function shortestDelta(d) {
  d = ((d % N) + N) % N;
  if (d > N / 2) d -= N;
  return d;
}

export default function CoverflowDock() {
  const [open, setOpen] = useState(true); // M 키로 열고 닫기
  const [active, setActive] = useState(Math.floor(N / 2)); // 가운데로 올 아이템
  const [panel, setPanel] = useState(null); // 열려 있는 팝업 아이템 key (없으면 null)

  // 아이템 클릭: 가운데가 아니면 가운데로, 이미 가운데면 팝업 열기
  const onItemClick = (index, item) => {
    if (index !== active) setActive(index);
    else if (item.panel) setPanel(item.key);
  };

  const btnRefs = useRef([]);
  const relRef = useRef(DOCK_ITEMS.map((_, i) => circRel(i, Math.floor(N / 2)))); // 각 아이템의 현재 슬롯
  const prevActive = useRef(Math.floor(N / 2));

  // M 키 토글
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") return setPanel(null); // ESC로 팝업 닫기
      // 한 글자 키만 소문자로 비교 (입력창 포커스 중엔 무시)
      if (e.key.length !== 1) return;
      const tag = e.target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || e.target?.isContentEditable) return;
      if (e.key.toLowerCase() === "m") setOpen((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 최초 배치 (애니메이션 없이 제자리)
  useLayoutEffect(() => {
    DOCK_ITEMS.forEach((_, i) => {
      const el = btnRefs.current[i];
      if (!el) return;
      el.style.transition = "none";
      applyStyle(el, relRef.current[i]);
      void el.offsetWidth; // reflow
      el.style.transition = TRANSITION;
    });
  }, []);

  // active 변경 시 원형으로 회전 — 이음새를 넘는 아이템은 반대편에서 슬라이드 인
  useLayoutEffect(() => {
    if (active === prevActive.current) return;
    const dir = shortestDelta(active - prevActive.current); // +면 앞으로(왼쪽으로 이동)

    DOCK_ITEMS.forEach((_, i) => {
      const el = btnRefs.current[i];
      if (!el) return;
      const newRel = circRel(i, active);
      const oldRel = relRef.current[i];
      const wraps = Math.abs(newRel - oldRel) > 2; // 링 이음새를 넘어감

      if (wraps) {
        // 이동 방향 바깥쪽(화면 밖)에 순간이동 → 거기서 슬라이드해 들어옴
        el.style.transition = "none";
        applyStyle(el, newRel + Math.sign(dir));
        void el.offsetWidth; // reflow로 시작 위치 확정
        el.style.transition = TRANSITION;
      } else {
        el.style.transition = TRANSITION;
      }
      applyStyle(el, newRel);
      relRef.current[i] = newRel;
    });
    prevActive.current = active;
  }, [active]);

  const panelItem = DOCK_ITEMS.find((it) => it.key === panel);

  return (
    <>
    <nav
      className={`absolute inset-x-0 bottom-30 bg-dock-black px-3 py-5 transition-opacity duration-500 ease-in-out ${
        open ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
    >
      <div className="relative h-40 w-full">
        {DOCK_ITEMS.map((item, index) => (
          <button
            key={item.key}
            type="button"
            ref={(el) => (btnRefs.current[index] = el)}
            onClick={() => onItemClick(index, item)}
            style={{ animationDelay: `${index * 0.3}s`, transformOrigin: "bottom center" }}
            className="group absolute bottom-0 left-1/2 flex animate-bob flex-col items-center gap-0"
          >
            {item.image ? (
              <img
                src={item.image}
                alt={item.label}
                draggable={false}
                className={`object-contain ${item.imgClass ?? "h-24 w-24"}`}
                style={{ imageRendering: "pixelated" }}
              />
            ) : (
              <span className="flex h-20 w-20 items-center justify-center rounded-xl border-[3px] border-border-outer bg-white text-4xl transition-shadow group-hover:border-card-inner group-hover:shadow-[0_0_0_4px_rgba(217,85,110,0.35)]">
                {item.icon}
              </span>
            )}
            <span className="whitespace-nowrap font-pixel text-[30px] font-medium text-white">
              {item.label}
            </span>
          </button>
        ))}
      </div>

      <span className="absolute bottom-2 right-4 font-pixel text-[32px] font-medium text-white/70">
        Menu: M
      </span>
    </nav>

    {panelItem && (() => {
      // 창 제목/본문은 panels.js 에서 가져옴 (없으면 독 라벨을 제목으로)
      const content = PANELS[panelItem.key];
      return (
        <DraggableWindow title={content?.title ?? panelItem.label} plate={content?.plate} onClose={() => setPanel(null)}>
          {content?.body}
        </DraggableWindow>
      );
    })()}
    </>
  );
}
