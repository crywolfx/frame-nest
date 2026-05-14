"use client";

import { motion } from "motion/react";
import { ArrowRight, Clock3, Compass, Map, Moon } from "lucide-react";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./home.module.css";

const routes = [
  {
    href: "/cosmic-moment",
    category: "宇宙与时间",
    title: "宇宙此刻",
    subtitle: "太阳系时间机器",
    description: "选择北京时间、视角、天体和海报参数，生成可导出的太阳系画面。",
    status: "已上线",
    icon: Clock3
  },
  {
    href: "/poster-lab",
    category: "创作工具",
    title: "海报实验室",
    subtitle: "月相海报生成",
    description: "内置 30 个相位档位、字体、信息标注和批量导出，适合快速做月相海报。",
    status: "已上线",
    icon: Moon
  },
  {
    href: "/travel",
    category: "旅行与地图",
    title: "旅行攻略",
    subtitle: "路线与准备清单",
    description: "集中管理目的地、路线、交通、餐饮、预约和出行前检查。",
    status: "已上线",
    icon: Compass
  },
  {
    href: "/travel/hong-kong",
    category: "旅行与地图",
    title: "港澳 5 日攻略",
    subtitle: "嵌套路由示例",
    description: "杭州往返港澳的日程、地图、交通方案、餐饮和拍照点。",
    status: "已上线",
    icon: Map
  }
];

const categories = [
  { name: "宇宙与时间", count: 1, note: "天体状态、时间推演、观测视角" },
  { name: "创作工具", count: 1, note: "图片生成、海报导出、批量任务" },
  { name: "旅行与地图", count: 2, note: "行程、地图、交通和清单" },
  { name: "实验功能", count: 0, note: "新工具会先放入这里验证" }
];

const expansion = ["工具卡片", "嵌套路由", "分类导航", "批量生成", "地图体验", "3D 场景"];

export default function HomeHub() {
  return (
    <main className={styles.shell} id="main">
      <div className={styles.backdrop} aria-hidden="true" />

      <motion.nav className={styles.nav} initial={{ y: -18, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.45 }}>
        <Link className={styles.brand} href="/" aria-label="Frame Nest 首页">
          Frame Nest
        </Link>
        <div className={styles.navLinks}>
          <a href="#routes">工具</a>
          <a href="#categories">分类</a>
          <Link href="/poster-lab">海报实验室</Link>
        </div>
      </motion.nav>

      <section className={styles.hero} aria-labelledby="home-title">
        <motion.div className={styles.heroCopy} initial={{ y: 26, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.55, delay: 0.05 }}>
          <p className={styles.eyebrow}>Product Hub / Route Index</p>
          <h1 id="home-title">功能入口中心</h1>
          <p className={styles.heroText}>
            当前站点把宇宙时间、海报生成、旅行地图和实验工具放在一个入口里。新增页面时按分类扩展，用户先选任务，再进入具体工具。
          </p>
          <div className={styles.heroActions}>
            <a className={styles.primaryAction} href="#routes">
              查看当前工具
              <ArrowRight size={17} />
            </a>
            <Link className={styles.secondaryAction} href="/cosmic-moment">
              打开宇宙此刻
            </Link>
          </div>
        </motion.div>

        <motion.div className={styles.controlVisual} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.65, delay: 0.12 }} aria-hidden="true">
          <div className={styles.orbitRing} />
          <div className={styles.visualHeader}>
            <span>ROUTE MAP</span>
            <strong>{categories.length} 个规划分类</strong>
          </div>
          <div className={styles.visualGrid}>
            {categories.map((category, index) => (
              <span key={category.name} style={{ "--delay": `${index * 120}ms` } as CSSProperties}>
                {category.name}
              </span>
            ))}
          </div>
          <div className={styles.signalLine} />
        </motion.div>
      </section>

      <section className={styles.metrics} aria-label="站点结构">
        <div>
          <span>{routes.length}</span>
          <strong>当前入口</strong>
        </div>
        <div>
          <span>{categories.length}</span>
          <strong>规划分类</strong>
        </div>
        <div>
          <span>2</span>
          <strong>可导出工具</strong>
        </div>
      </section>

      <section className={styles.routeSection} id="routes" aria-labelledby="routes-title">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Current Routes</p>
          <h2 id="routes-title">当前可用入口</h2>
        </div>
        <div className={styles.routeGrid}>
          {routes.map((route, index) => {
            const Icon = route.icon;
            return (
              <motion.div key={route.href} initial={{ y: 24, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.45, delay: index * 0.06 }}>
                <Link className={styles.routeCard} href={route.href}>
                  <span className={styles.routeIcon}><Icon size={18} /></span>
                  <span className={styles.routeMeta}>{route.category} · {route.status}</span>
                  <h3>{route.title}</h3>
                  <strong>{route.subtitle}</strong>
                  <p>{route.description}</p>
                  <em>打开 <ArrowRight size={15} /></em>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <section className={styles.categorySection} id="categories" aria-labelledby="categories-title">
        <div className={styles.sectionHeader}>
          <p className={styles.eyebrow}>Categories</p>
          <h2 id="categories-title">按能力扩展</h2>
        </div>
        <div className={styles.categoryGrid}>
          {categories.map((category) => (
            <article className={styles.categoryCard} key={category.name}>
              <span>{String(category.count).padStart(2, "0")}</span>
              <h3>{category.name}</h3>
              <p>{category.note}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.expansionPanel} aria-label="扩展能力">
        <div>
          <p className={styles.eyebrow}>Expansion Model</p>
          <h2>为更多工具预留结构</h2>
          <p>主页只负责入口、分类和状态。具体能力留在子路由内实现，后续可以继续加入数据工具、生成器、地图页、3D 体验或临时实验。</p>
        </div>
        <div className={styles.expansionTags}>
          {expansion.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>
    </main>
  );
}
