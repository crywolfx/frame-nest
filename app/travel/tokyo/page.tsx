import type { Metadata } from "next";
import TokyoGuideClient from "./TokyoGuideClient";

export const metadata: Metadata = {
  title: "东京五日现场手册｜2026.08.14–08.18",
  description: "以银座为据点，按新版攻略重排东京塔、六本木、涩谷、浅草、秋叶原与银座购物路线。"
};

export default function TokyoGuidePage() {
  return <TokyoGuideClient />;
}
