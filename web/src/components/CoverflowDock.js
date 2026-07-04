const DOCK_ITEMS = [
  { key: "folder", label: "폴더", icon: "📁" },
  { key: "report", label: "리포트", icon: "📄" },
  { key: "profile", label: "프로필", icon: "👤" },
  { key: "project", label: "프로젝트", icon: "🛠️" },
  { key: "research", label: "연구", icon: "🔬" },
];

const VARIANT_CLASS = {
  center: "scale-100 opacity-100",
  side: "scale-[0.82] opacity-55",
  edge: "scale-[0.68] opacity-25",
};

function getVariant(index, total) {
  const distanceFromCenter = Math.abs(index - Math.floor(total / 2));
  if (distanceFromCenter === 0) return "center";
  if (distanceFromCenter === 1) return "side";
  return "edge";
}

export default function CoverflowDock() {
  return (
    <nav className="absolute inset-x-0 bottom-30 flex items-end justify-center gap-20 bg-dock-black px-3 py-5">
      {DOCK_ITEMS.map((item, index) => (
        <button
          key={item.key}
          type="button"
          style={{ animationDelay: `${index * 0.3}s` }}
          className={`group flex animate-bob flex-col items-center gap-1.5 transition-transform duration-200 hover:scale-[1.12] hover:-translate-y-1.5 hover:opacity-100 ${VARIANT_CLASS[getVariant(index, DOCK_ITEMS.length)]}`}
        >
          <span className="flex h-20 w-20 items-center justify-center rounded-xl border-[3px] border-border-outer bg-white text-4xl transition-shadow group-hover:border-card-inner group-hover:shadow-[0_0_0_4px_rgba(217,85,110,0.35)]">
            {item.icon}
          </span>
          <span className="font-pixel text-[30px] font-medium text-white">
            {item.label}
          </span>
        </button>
      ))}
    </nav>
  );
}
