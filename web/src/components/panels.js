// ┌─────────────────────────────────────────────────────────────┐
// │ 팝업 창 내용 모음 — 창 제목/본문 텍스트는 전부 여기서만 관리   │
// │ key 는 DOCK_ITEMS(CoverflowDock.js)의 key 와 매칭됨            │
// └─────────────────────────────────────────────────────────────┘

// 본문 정보 박스 — 박스 크기/위치(left, top, width, height)는 호출부에서 px 로 지정.
// 박스 안 라벨/값 위치는 아래 style 값으로 조절 (모든 박스에 공통 적용)
// width/height 를 생략하면 아래 기본 크기가 쓰임 (여기서 한 번에 조절)
const BOX_WIDTH = "640px"; // 박스 기본 가로
const BOX_HEIGHT = "80px"; // 박스 기본 세로
const LINE_HEIGHT = "30px"; // 값이 여러 줄일 때 줄 간격
const LABEL_SIZE = "32px"; // 라벨 기본 글씨 크기
const VALUE_SIZE = "20px"; // 값 기본 글씨 크기
const VALUE_WEIGHT = 700; // 값 기본 굵기 — 400(보통) / 500(미디엄) / 600(세미볼드) / 700(볼드)
const VALUE_LEFT = "330px"; // 값 기본 가로 위치 (박스 왼쪽에서)
const VALUE_TOP = "50%"; // 값 기본 세로 위치 (50% = 가운데)
const ICON_SIZE = "32px"; // 값 앞에 붙는 로고 크기
const ICON_GAP = "6px"; // 로고와 글씨 사이 간격

function InfoBox({
  left,
  top,
  width = BOX_WIDTH,
  height = BOX_HEIGHT,
  label,
  value,
  labelSize = LABEL_SIZE, // 이 박스만 라벨 크기 다르게 하려면 지정
  valueSize = VALUE_SIZE, // 이 박스만 값 크기 다르게 하려면 지정
  valueWeight = VALUE_WEIGHT, // 이 박스만 굵기 다르게 하려면 지정
  valueLeft = VALUE_LEFT, // 이 박스만 값 가로 위치 다르게 하려면 지정
  valueTop = VALUE_TOP, // 이 박스만 값 세로 위치 다르게 하려면 지정
  iconSize = ICON_SIZE, // 이 박스만 로고 크기 다르게 하려면 지정
  iconGap = ICON_GAP, // 이 박스만 로고-글씨 간격 다르게 하려면 지정
}) {
  return (
    <div
      className="absolute rounded-lg border border-black/10 bg-plate-soft shadow-sm"
      style={{ left, top, width, height }}
    >
      {/* 라벨 (왼쪽) */}
      <span
        className="absolute font-pixel font-bold text-ink"
        style={{
          left: "20px", // 박스 왼쪽에서
          top: "50%", // 세로 가운데
          transform: "translateY(-50%)",
          fontSize: labelSize, // 라벨 글씨 크기
        }}
      >
        {label}
      </span>

      {/* 값 (오른쪽) — 문자열이면 한 줄, 배열이면 여러 줄.
          줄 수가 늘어도 블록 전체가 세로 가운데에 유지됨 */}
      <div
        className="absolute font-paperlogy text-ink"
        style={{
          left: valueLeft, // 박스 왼쪽에서 (라벨과의 간격)
          top: valueTop, // 박스 위에서
          transform: "translateY(-50%)", // top 기준 세로 가운데 정렬
          fontSize: valueSize, // 값 글씨 크기
          fontWeight: valueWeight, // 값 글씨 굵기
        }}
      >
        {(Array.isArray(value) ? value : [value]).map((line, i) => {
          // 줄은 문자열이거나 { icon, text } 객체 (icon 은 public 기준 경로)
          const { icon, text } = typeof line === "string" ? { icon: null, text: line } : line;
          return (
            <div key={i} className="flex items-center" style={{ lineHeight: LINE_HEIGHT }}>
              {icon && (
                <img
                  src={icon}
                  alt=""
                  draggable={false}
                  className="shrink-0 object-contain"
                  style={{ width: iconSize, height: iconSize, marginRight: iconGap }}
                />
              )}
              {text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const PANELS = {
  profile: {
    title: "Profile Card", // ← 창 제목 (바 왼쪽)
    plate: "ID: Potato", // ← 오른쪽 노란 박스 안 글씨
    body: (
      <div className="relative h-full">
        {/* 정보 박스들 — top 은 본문 최상단(0)에서 아래로 떨어진 px, left 는 왼쪽 끝에서의 px.
            박스마다 완전히 독립이라 하나만 옮겨도 나머지는 그대로 */}
        <InfoBox left="24px" top="16px" width="640px" height="50px" label="NAME" value="이훈의 (Hoon Ui Lee)" />
        <InfoBox left="24px" top="76px" width="640px" height="80px" label="Experience" valueSize="18px"
          value={["Chung-Ang Univ.: 2020.03 ~", "MINDS Lab. : 2023.06 ~"]}
        />
        <InfoBox left="24px" top="170px" width="640px" height="70px" label="Research Interest" value="News Recommendation System" valueSize="17px" />
        <InfoBox left="24px" top="256px" width="640px" height="50px" label="Skills" value="Pytorch" />
        {/* Contact Info. 는 valueLeft/valueTop 으로 값 위치를 따로 지정 (다른 박스에 영향 없음) */}
        <InfoBox
          left="24px"
          top="324px"
          width="640px"
          height="80px"
          label="Contact Info."
          value={[
            { icon: "/sprites/icon/gmail.png", text: "lhnui01@gmail.com" },
            { icon: "/sprites/icon/github.png", text: "HN-UI" },
          ]}
          valueLeft="330px"
          valueTop="50%"
        />
        
        {/* 오른쪽 흰색 이미지 박스 — 박스 위치/크기 */}
        <div
          className="absolute rounded-md border border-black/10 bg-white shadow-md"
          style={{
            top: "42px", // 본문 최상단에서 떨어진 거리
            right: "40px", // 오른쪽 끝에서 떨어진 거리
            width: "240px", // 박스 가로
            height: "320px", // 박스 세로
          }}
        >
          {/* 프로필 이미지 — 크기(width/height)와 위치(top/left) 독립 조절.
              박스보다 작게 잡으면 그만큼 흰색이 남음 */}
          <img
            src="/sprites/object/profile_image.jpeg"
            alt="profile"
            draggable={false}
            className="absolute rounded-sm object-cover"
            style={{
              width: "208px", // 이미지 가로
              height: "288px", // 이미지 세로
              top: "16px", // 박스 위에서 떨어진 거리
              left: "16px", // 박스 왼쪽에서 떨어진 거리
            }}
          />
        </div>
      </div>
    ),
  },
};
