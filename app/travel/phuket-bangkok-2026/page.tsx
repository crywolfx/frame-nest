import type { Metadata } from 'next';
import Guide from './Guide';
export const metadata: Metadata = {
  metadataBase: new URL("https://frame-nest.wxking921.workers.dev"),
  title: '普吉岛 → 曼谷｜七日慢旅行 · 2026.09.27–10.03',
  description: '两个人的泰国假期。七日行程、海景酒店、餐厅与按摩备选、丛林飞跃比较、实时地图导航和行李清单。',
  openGraph: { title: '把日子，交给海。｜普吉岛与曼谷', description: '2026.09.27—10.03 · 两个人的七日慢旅行', images: ['/travel/phuket-bangkok-2026/shore-1.webp'] },
};
export default function Page() { return <Guide />; }
