// 맵 위에 놓이는 배치 오브젝트 (Layer 2)
// 잔디 바닥과 움직이는 스프라이트 사이에 깔립니다.
//
// 위치를 바꾸고 싶으면 맨 아래 `SCENE` 배열의 x / y 숫자만 고치면 됩니다.
// (이미지 파일은 건드릴 필요 없음)

const SPRITE = "/sprites/object";
const SCALE = 2.5; // 픽셀아트 확대 배율 (도트 유지) — 기존 3의 1.5배

// 각 스프라이트의 원본 픽셀 크기
const SIZE = {
  dirt_cap_left: [20, 35],
  dirt_cap_right: [20, 35],
  dirt_fill: [16, 35],
  fence_corner_tl: [13, 16],
  fence_corner_tr: [13, 16],
  fence_corner_bl: [14, 14],
  fence_corner_br: [14, 14],
  fence_h: [8, 13],
  fence_v: [8, 13],
  flower_orangeblue: [15, 15],
  flower_pinkwhite: [15, 15],
  "208_full": [744, 672],
};

const s = (n) => n * SCALE;

// 단일 스프라이트 또는 반복 타일 스트립을 그리는 공통 조각
function Piece({ name, x, y, w, h, repeat = "no-repeat" }) {
  const [nw, nh] = SIZE[name];
  return (
    <div
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: w ?? s(nw),
        height: h ?? s(nh),
        backgroundImage: `url(${SPRITE}/${name}.png)`,
        backgroundRepeat: repeat,
        backgroundSize: `${s(nw)}px ${s(nh)}px`,
        imageRendering: "pixelated",
      }}
    />
  );
}

// 울타리로 두른 꽃밭 하나를 생성
function Garden({ x, y, cols, rows }) {
  const pad = s(5); // 울타리와 꽃 사이 여백
  const [flw, flh] = SIZE.flower_orangeblue.map(s);
  const cellX = flw + s(3);
  const cellY = flh + s(4);

  const [tlw, tlh] = SIZE.fence_corner_tl.map(s);
  const [brw, brh] = SIZE.fence_corner_br.map(s);
  const topH = s(SIZE.fence_h[1]); // 상/하단 스트립 두께
  const sideW = s(SIZE.fence_v[0]); // 좌/우 스트립 두께

  const gridW = cols * cellX;
  const gridH = rows * cellY;
  const outerW = sideW + pad + gridW + pad + sideW;
  const outerH = topH + pad + gridH + pad + topH;

  const pieces = [];

  // 상/하 스트립 (가로 반복)
  pieces.push(<Piece key="top" name="fence_h" x={x + tlw} y={y} w={outerW - tlw - s(SIZE.fence_corner_tr[0])} repeat="repeat-x" />);
  pieces.push(<Piece key="bot" name="fence_h" x={x + s(SIZE.fence_corner_bl[0])} y={y + outerH - topH} w={outerW - s(SIZE.fence_corner_bl[0]) - brw} repeat="repeat-x" />);
  // 좌/우 스트립 (세로 반복)
  pieces.push(<Piece key="left" name="fence_v" x={x} y={y + tlh} h={outerH - tlh - s(SIZE.fence_corner_bl[1])} repeat="repeat-y" />);
  pieces.push(<Piece key="right" name="fence_v" x={x + outerW - sideW} y={y + s(SIZE.fence_corner_tr[1])} h={outerH - s(SIZE.fence_corner_tr[1]) - brh} repeat="repeat-y" />);
  // 4 모서리
  pieces.push(<Piece key="tl" name="fence_corner_tl" x={x} y={y} />);
  pieces.push(<Piece key="tr" name="fence_corner_tr" x={x + outerW - s(SIZE.fence_corner_tr[0])} y={y} />);
  pieces.push(<Piece key="bl" name="fence_corner_bl" x={x} y={y + outerH - s(SIZE.fence_corner_bl[1])} />);
  pieces.push(<Piece key="br" name="fence_corner_br" x={x + outerW - brw} y={y + outerH - brh} />);

  // 꽃 격자 (두 종류 번갈아)
  const startX = x + sideW + pad;
  const startY = y + topH + pad;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const name = (r + c) % 2 === 0 ? "flower_orangeblue" : "flower_pinkwhite";
      pieces.push(<Piece key={`f-${r}-${c}`} name={name} x={startX + c * cellX} y={startY + r * cellY} />);
    }
  }
  return <>{pieces}</>;
}

// 단일 건물 등 큰 오브젝트. 표시 폭(w)만 지정하면 높이는 원본 비율로 자동 계산.
// 모서리 고정 배치 지원 (right/top 지정 시 우측 상단 등에 고정)
// solid = { top, right, bottom, left } (0~1, 각 변에서 안쪽으로 들어간 비율) 지정 시
//   실제 벽 영역에 충돌 박스를 깔아 캐릭터가 못 지나가게 함 (PlayerCharacter가 읽음)
function Building({ name, w, top = 0, left, right, solid }) {
  const [nw, nh] = SIZE[name];
  const width = w ?? nw;
  const height = (width * nh) / nw; // 원본 비율 유지
  return (
    <div
      style={{
        position: "absolute",
        top,
        ...(right != null ? { right } : { left: left ?? 0 }),
        width,
        height,
        backgroundImage: `url(${SPRITE}/${name}.png)`,
        backgroundRepeat: "no-repeat",
        backgroundSize: `${width}px ${height}px`,
        imageRendering: "pixelated",
      }}
    >
      {solid && (
        <div
          data-solid
          style={{
            position: "absolute",
            top: `${solid.top * 100}%`,
            left: `${solid.left * 100}%`,
            right: `${solid.right * 100}%`,
            bottom: `${solid.bottom * 100}%`,
          }}
        />
      )}
    </div>
  );
}

// 가로 흙길 하나를 생성 (segments = 가운데 채움 반복 횟수)
function DirtPath({ x, y, segments }) {
  const capLW = s(SIZE.dirt_cap_left[0]);
  const fillW = s(SIZE.dirt_fill[0]);
  return (
    <>
      <Piece name="dirt_cap_left" x={x} y={y} />
      <Piece name="dirt_fill" x={x + capLW} y={y} w={fillW * segments} repeat="repeat-x" />
      <Piece name="dirt_cap_right" x={x + capLW + fillW * segments} y={y} />
    </>
  );
}

// ─────────────────────────────────────────────
// 배치 데이터 — 여기 x / y 숫자만 바꾸면 위치 이동
// ─────────────────────────────────────────────
const SCENE = [
  { kind: "garden", x: 60, y: 90, cols: 6, rows: 4 },
  { kind: "path", x: 120, y: 470, segments: 12 },
  { kind: "garden", x: 180, y: 590, cols: 6, rows: 3 },
  // 오른쪽 위 고정 배치 (right/top = 화면 우측·상단으로부터의 거리, w = 표시 폭·높이는 비율 자동)
  // solid = 실제 건물 벽 영역 (이미지의 투명 여백·낙서는 제외). 이 안으로는 캐릭터가 못 들어감.
  {
    kind: "building",
    name: "208_full",
    w: 460,
    top: 15,
    right: 20,
    solid: { top: 0.09, right: 0.04, bottom: 0.07, left: 0.04 },
  },
];

export default function GardenScene() {
  return (
    <div className="pointer-events-none absolute inset-0">
      {SCENE.map((o, i) => {
        if (o.kind === "garden") return <Garden key={i} {...o} />;
        if (o.kind === "path") return <DirtPath key={i} {...o} />;
        if (o.kind === "building") return <Building key={i} {...o} />;
        return null;
      })}
    </div>
  );
}
