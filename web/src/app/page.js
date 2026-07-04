import CoverflowDock from "@/components/CoverflowDock";
import GardenScene from "@/components/GardenScene";
import PlayerCharacter from "@/components/PlayerCharacter";

export default function Home() {
  return (
    <main className="relative h-screen w-full overflow-hidden bg-grass-tile">
      <GardenScene />

      <PlayerCharacter />

      <CoverflowDock />
    </main>
  );
}
