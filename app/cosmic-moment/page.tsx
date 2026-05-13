import type { Metadata } from "next";
import CosmicMomentApp from "./CosmicMomentApp";

export const metadata: Metadata = {
  title: "宇宙此刻",
  description: "用 WebGL 生成精确到秒的太阳系纪念海报。"
};

export default function CosmicMomentPage() {
  return <CosmicMomentApp initialIso={new Date().toISOString()} />;
}
