import type { Metadata } from "next";
import PosterLabApp from "./PosterLabApp";

export const metadata: Metadata = {
  title: "海报实验室",
  description: "使用月相模板生成图片海报。"
};

export default function PosterLabPage() {
  return <PosterLabApp initialIso={new Date().toISOString()} />;
}
