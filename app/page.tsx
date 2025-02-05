import GameImageLoop from "@/components/GameImageLoop";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function Home() {
  return (
    <div>
      <SpeedInsights></SpeedInsights>
      <GameImageLoop></GameImageLoop>
    </div>
  );
}
