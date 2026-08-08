import type { Metadata } from "next";
import TokyoGuideClient from "./TokyoGuideClient";

export const metadata: Metadata = {
  title: "东京 5 日旅行攻略｜2026.08.14–08.18",
  description: "从银座出发的东京五日路线：东京塔、六本木、涩谷、浅草、晴空塔、秋叶原与东京站。"
};

export default function TokyoGuidePage() {
  return <TokyoGuideClient />;
}
