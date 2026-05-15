"use client";

import { motion } from "motion/react";
import { ArrowRight, Moon, Orbit } from "lucide-react";
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
          <Link href="/cosmic-moment">太阳系</Link>
          <Link href="/poster-lab">月相</Link>
        </div>
      </motion.nav>

      <section className={styles.hero} aria-labelledby="home-title">
        <motion.div className={styles.heroCopy} initial={{ y: 26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55, delay: 0.05 }}>
          <p className={styles.eyebrow}>Frame Nest</p>
          <h1 id="home-title">精密工具入口</h1>
          <p className={styles.heroText}>选择一个工具开始。</p>
        </motion.div>
      </section>

      <section className={styles.toolSection} aria-label="工具">
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
