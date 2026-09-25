"use client";

import { motion } from "motion/react";
import { ArrowRight, ArrowUpRight, MapPin, Moon, Orbit } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./home.module.css";

const tools = [
  {
    href: "/cosmic-moment",
    title: "太阳系",
    subtitle: "宇宙此刻",
    description: "查看行星位置，导出太阳系画面。",
    action: "打开",
    status: "已上线",
    icon: Orbit,
    preview: "cosmic",
    accent: "#ffbc5c"
  },
  {
    href: "/poster-lab",
    title: "月相",
    subtitle: "海报实验室",
    description: "生成月相海报，批量导出图片。",
    action: "打开",
    status: "已上线",
    icon: Moon,
    preview: "poster",
    accent: "#9de8c1"
  }
];

export default function HomeHub() {
  return (
    <main className={styles.shell} id="main">
      <div className={styles.backdrop} aria-hidden="true" />

      <motion.nav className={styles.nav} initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
        <Link className={styles.brand} href="/" aria-label="Frame Nest 首页">
          Frame Nest
        </Link>
        <div className={styles.navLinks}>
          <Link href="#journeys">旅行攻略</Link><Link href="#tools">创作工具</Link>
          <Link href="/poster-lab">月相</Link>
        </div>
      </motion.nav>

      <section className={styles.hero} aria-labelledby="home-title">
        <motion.div className={styles.heroCopy} initial={{ y: 26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55, delay: 0.05 }}>
          <p className={styles.eyebrow}>THE DIRECTORY / 旅行与灵感目录</p>
          <h1 id="home-title">下一站，想去哪里？</h1>
          <p className={styles.heroText}>把计划收好，把时间留给沿途。旅行攻略与创作工具，都在这里。</p>
        </motion.div>
      </section>

      <section id="journeys" className={styles.journeys} aria-label="旅行攻略目录">
        <div className={styles.directoryHeading}><div><span>01 / JOURNEYS</span><h2>已整理的旅程</h2></div><Link href="/travel">全部旅行攻略 <ArrowUpRight size={16}/></Link></div>
        <Link href="/travel/phuket-bangkok-2026" className={styles.featuredJourney}>
          <img src="/travel/phuket-bangkok-2026/shore-1.webp" alt="普吉小卡塔海湾与海景泳池别墅" fetchPriority="high"/>
          <div className={styles.journeyShade}/><span className={styles.journeyBadge}>即将出发 · 7 DAYS</span>
          <div className={styles.journeyContent}><span>2026.09.27 — 10.03</span><h2>普吉岛 <i>→</i> 曼谷</h2><p>五晚海岛，一晚城市。喂大象、潜入海底，也留时间喝一杯海景咖啡。</p><div><span><MapPin size={14}/> 芭东 · 小卡塔 · 通罗</span><strong>打开攻略 <ArrowUpRight size={19}/></strong></div></div>
        </Link>
        <div className={styles.otherJourneys}>
          <Link href="/travel/tokyo"><span className={styles.journeySerial}>02</span><div><small>JAPAN / 2026.08.14 — 08.18</small><h3>东京，五日城市漫游</h3><p>银座、东京塔、涩谷与东东京。每日路线与可调整地图。</p></div><ArrowUpRight size={24}/></Link>
          <Link href="/travel/hong-kong"><span className={styles.journeySerial}>03</span><div><small>HONG KONG & MACAU / 2026.04.28 — 05.02</small><h3>香港与澳门，沿街慢走</h3><p>五日双城。公共交通、街区散步与顺路吃饭。</p></div><ArrowUpRight size={24}/></Link>
        </div>
      </section>

      <section id="tools" className={styles.toolSection} aria-label="工具"><div className={styles.directoryHeading}><div><span>02 / CREATIVE TOOLS</span><h2>留住一些此刻</h2></div><p>太阳系与月相的可视化实验</p></div>
        <div className={styles.toolGrid}>
          {tools.map((tool, index) => {
            const Icon = tool.icon;

            return (
              <motion.div key={tool.href} initial={{ y: 28, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55, delay: 0.12 + index * 0.08 }}>
                <Link className={styles.toolCard} href={tool.href} style={{ "--accent": tool.accent } as CSSProperties}>
                  <span className={styles.status}>{tool.status}</span>
                  <div className={styles.preview} data-preview={tool.preview} aria-hidden="true">
                    {tool.preview === "cosmic" ? (
                      <>
                        <span className={styles.sun} />
                        <span className={styles.orbitOne} />
                        <span className={styles.orbitTwo} />
                        <span className={styles.orbitThree} />
                        <span className={styles.planetA} />
                        <span className={styles.planetB} />
                        <span className={styles.planetC} />
                      </>
                    ) : (
                      <>
                        <span className={styles.posterSheet} />
                        <span className={styles.moonDisc} />
                        <span className={styles.posterLineA} />
                        <span className={styles.posterLineB} />
                        <span className={styles.posterGrid} />
                      </>
                    )}
                  </div>
                  <div className={styles.cardBody}>
                    <span className={styles.cardIcon}>
                      <Icon size={18} />
                    </span>
                    <p>{tool.subtitle}</p>
                    <h2>{tool.title}</h2>
                    <strong>{tool.description}</strong>
                    <em>
                      {tool.action}
                      <ArrowRight size={16} />
                    </em>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
