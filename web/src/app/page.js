import CoverflowDock from "@/components/CoverflowDock";
import WanderingSprites from "@/components/WanderingSprites";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-grass-tile-placeholder">
      <WanderingSprites />

      <CoverflowDock />
    </main>
  );
}
