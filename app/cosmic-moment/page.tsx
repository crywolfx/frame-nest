import type { Metadata } from "next";
import CosmicMomentApp from "./CosmicMomentApp";

export const metadata: Metadata = {
  title: "Cosmic Moment | Frame Nest",
  description: "A WebGL solar-system studio for exact-second cosmic posters."
};

export default function CosmicMomentPage() {
  return <CosmicMomentApp initialIso={new Date().toISOString()} />;
}
