"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type CSSProperties } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  Clock3,
  CloudRain,
  Map,
  MapPin,
  Plane,
  Route,
  ShoppingBag,
  TicketCheck,
  TrainFront,
  Umbrella,
  Utensils,
  WalletCards
} from "lucide-react";
import styles from "./tokyo.module.css";
import { bookingItems, days, essentials, hero, imageCredits, type DayPlan } from "./tokyoData";

function SourcePills({ sources }: { sources: DayPlan["stops"][number]["sources"] }) {
  if (!sources.length) return null;
  return (
    <div className={styles.sourcePills} aria-label="相关信息入口">
      {sources.map((source) => (
        <a key={`${source.href}-${source.label}`} href={source.href} target="_blank" rel="noreferrer">
          {source.kind === "xiaohongshu" ? <Camera size={13} /> : <ArrowUpRight size={13} />}
          {source.label}
        </a>
      ))}
    </div>
  );
}

function StopCard({ stop, index }: { stop: DayPlan["stops"][number]; index: number }) {
  return (
    <article className={`${styles.stopCard} ${stop.image ? styles.stopCardWithImage : styles.stopCardCompact}`}>
      <div className={styles.stopIndex}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <time>{stop.time}</time>
      </div>

      {stop.image ? (
        <figure className={styles.stopPhoto}>
          <Image src={stop.image} alt={stop.imageAlt ?? stop.name} width={720} height={960} sizes="(max-width: 760px) 100vw, 34vw" />
          <figcaption>{stop.imageCredit} · 点击卡片下方入口查看原笔记</figcaption>
        </figure>
      ) : null}

      <div className={styles.stopContent}>
        <div className={styles.stopHeading}>
          <div>
            <p>STOP {String(index + 1).padStart(2, "0")}</p>
            <h3>{stop.name}</h3>
          </div>
          <MapPin size={22} aria-hidden="true" />
        </div>

        <p className={styles.stopIntro}>{stop.intro}</p>

        <div className={styles.reasonBox}>
          <span>为什么值得去</span>
          <p>{stop.reason}</p>
        </div>

        <dl className={styles.stopGuide}>
          <div>
            <dt><TrainFront size={15} />怎么到</dt>
            <dd>{stop.transit}</dd>
          </div>
          <div>
            <dt><Route size={15} />现场怎么走</dt>
            <dd>{stop.howTo}</dd>
          </div>
          <div>
            <dt><TicketCheck size={15} />价格与预约</dt>
            <dd>{stop.priceBooking}</dd>
          </div>
          <div className={styles.tipRow}>
            <dt><Umbrella size={15} />避坑提示</dt>
            <dd>{stop.tips}</dd>
          </div>
        </dl>

        <SourcePills sources={stop.sources} />
      </div>
    </article>
  );
}

function DayPanel({ day }: { day: DayPlan }) {
  return (
    <article className={styles.dayPanel} style={{ "--day-accent": day.color } as CSSProperties}>
      <header className={styles.dayHeader}>
        <div className={styles.dateBlock}>
          <span>{day.code}</span>
          <strong>{day.date}</strong>
          <small>{day.weekday}</small>
        </div>
        <div className={styles.dayCopy}>
          <p>{day.daySubtitle}</p>
          <h2>{day.dayTitle}</h2>
          <div className={styles.dayLead}>{day.dayLead}</div>
        </div>
        <aside className={styles.weatherCard}>
          <CloudRain size={23} />
          <div><strong>天气提示</strong><p>{day.weatherNote}</p></div>
        </aside>
      </header>

      <section className={styles.routeSection}>
        <div className={styles.sectionLabel}>
          <span>01</span>
          <div><small>ITINERARY</small><h3>当天路线</h3></div>
        </div>
        <div className={styles.stopList}>
          {day.stops.map((stop, index) => <StopCard key={`${stop.time}-${stop.name}`} stop={stop} index={index} />)}
        </div>
      </section>

      <section className={styles.mealsSection}>
        <div className={styles.sectionLabel}>
          <span>02</span>
          <div><small>MEALS</small><h3>当天用餐</h3></div>
        </div>
        <div className={styles.mealGrid}>
          {day.meals.map((meal) => (
            <article key={`${meal.meal}-${meal.name}`}>
              <div className={styles.mealTop}><Utensils size={17} /><span>{meal.meal}</span></div>
              <h4>{meal.name}</h4>
              <p>{meal.copy}</p>
              <strong>{meal.budget}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.dayNotes} aria-label="购物、休息与雨天安排">
        <article>
          <ShoppingBag size={21} />
          <span>购物</span>
          <h3>{day.shopping.title}</h3>
          <p>{day.shopping.copy}</p>
        </article>
        <article>
          <Clock3 size={21} />
          <span>休息</span>
          <h3>把坐下写进行程</h3>
          <p>{day.restNote}</p>
        </article>
        <article className={styles.rainCard}>
          <Umbrella size={21} />
          <span>雨天</span>
          <h3>先保留室内主线</h3>
          <p>{day.rainPlan}</p>
        </article>
      </section>
    </article>
  );
}

export default function TokyoGuideClient() {
  const [activeDayId, setActiveDayId] = useState(days[0].id);
  const activeDay = useMemo(() => days.find((day) => day.id === activeDayId) ?? days[0], [activeDayId]);

  function selectDay(dayId: string) {
    setActiveDayId(dayId);
    window.requestAnimationFrame(() => document.getElementById("day-detail")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  return (
    <main className={styles.page}>
      <nav className={styles.nav} aria-label="东京行程导航">
        <Link href="/travel" className={styles.wordmark}>TOKYO / 2026</Link>
        <div className={styles.navLinks}>
          <a href="#days">五日行程</a>
          <a href="#booking">预约</a>
          <a href="#essentials">出发须知</a>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroCoordinates}>35.6762° N<br />139.6503° E</div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{hero.eyebrow}</p>
          <h1>{hero.title}</h1>
          <p className={styles.heroLead}>{hero.lead}</p>
          <div className={styles.heroActions}>
            <a href="#days">打开五日行程<ArrowDown size={17} /></a>
            <a href="#booking">查看预约<TicketCheck size={17} /></a>
          </div>
          <dl className={styles.heroFacts}>
            <div><dt>日期</dt><dd>{hero.date}</dd></div>
            <div><dt>住宿</dt><dd>{hero.hotel}</dd></div>
            <div><dt>航班</dt><dd>{hero.flight}</dd></div>
            <div><dt>换算</dt><dd>{hero.rate}</dd></div>
          </dl>
        </div>
        <div className={styles.heroVisual}>
          <figure>
            <Image src="/travel/tokyo/xhs/tokyo-city-view.png" alt="从六本木眺望东京塔" width={640} height={853} priority sizes="(max-width: 760px) 88vw, 34vw" />
            <figcaption>六本木眺望东京塔 · 小红书 @亭纸同学旅行日记</figcaption>
          </figure>
          <div className={styles.heroTicket}>
            <span>BASE / GINZA</span>
            <strong>05 DAYS</strong>
            <small>摄影顺路 · 购物分区 · 午后休息</small>
          </div>
          <p className={styles.verticalLabel}>TOKYO FIELD GUIDE / AUG 2026</p>
        </div>
      </header>

      <section className={styles.daysSection} id="days" aria-labelledby="days-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>AUGUST 14—18</p>
          <h2 id="days-title">五日行程</h2>
          <p>从抵达到返程都放在同一条时间线上。选择日期查看路线、现场走法、票价、餐饮、购物与雨天备选。</p>
        </div>
        <div className={styles.dayTabsWrap}>
          <div className={styles.dayTabs} role="tablist" aria-label="选择行程日期">
            {days.map((day) => (
              <button
                type="button"
                role="tab"
                aria-selected={activeDay.id === day.id}
                key={day.id}
                onClick={() => selectDay(day.id)}
                style={{ "--tab-accent": day.color } as CSSProperties}
              >
                <span>{day.weekday}</span>
                <strong>{day.date}</strong>
                <small>{day.dayTitle}</small>
                {activeDay.id === day.id ? <Check size={18} /> : <ArrowDown size={18} />}
              </button>
            ))}
          </div>
        </div>
        <div id="day-detail" className={styles.dayDetail} role="tabpanel" tabIndex={-1} key={activeDay.id}>
          <DayPanel day={activeDay} />
        </div>
      </section>

      <section className={styles.bookingSection} id="booking" aria-labelledby="booking-title">
        <div className={styles.bookingHeading}>
          <span><TicketCheck size={22} /> BOOKING</span>
          <h2 id="booking-title">出发前预约</h2>
          <p>固定时段优先于餐厅与购物；先锁定不可替代的票，再处理交通。</p>
        </div>
        <div className={styles.bookingList}>
          {bookingItems.map((item, index) => (
            <a key={item.name} href={item.href} target="_blank" rel="noreferrer">
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div><small>{item.urgency}</small><h3>{item.name}</h3><p>{item.copy}</p></div>
              <ArrowUpRight size={21} />
            </a>
          ))}
        </div>
      </section>

      <section className={styles.essentialsSection} id="essentials" aria-labelledby="essentials-title">
        <div className={styles.essentialsHead}>
          <div><WalletCards size={25} /><span>BEFORE YOU GO</span></div>
          <h2 id="essentials-title">出发须知</h2>
          <p>东京交通不难，难在出口多。每次只确认下一步：哪条线、哪个方向、哪个出口。</p>
        </div>
        <div className={styles.essentialGrid}>
          {essentials.map((item, index) => (
            <article key={item.name}><span>{String(index + 1).padStart(2, "0")}</span><h3>{item.name}</h3><p>{item.copy}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.creditsSection} aria-labelledby="credits-title">
        <div>
          <p className={styles.eyebrow}>PHOTO NOTES</p>
          <h2 id="credits-title">图片来源</h2>
          <p>游览点配图取自公开的小红书实拍，并保留作者与原笔记入口，仅作行程参考。公开转载或二次传播前，请另行取得作者授权。</p>
        </div>
        <details>
          <summary><Camera size={17} />查看 {imageCredits.length} 处实拍来源<ArrowDown size={17} /></summary>
          <div className={styles.creditGrid}>
            {imageCredits.map((item) => (
              <a key={`${item.place}-${item.href}`} href={item.href} target="_blank" rel="noreferrer">
                <Image src={item.src} alt={item.place} width={96} height={96} />
                <span><strong>{item.place}</strong><small>{item.credit}</small></span>
                <ArrowUpRight size={15} />
              </a>
            ))}
          </div>
        </details>
      </section>

      <footer className={styles.footer}>
        <div><Plane size={20} /><span>HANGZHOU → TOKYO → HANGZHOU</span></div>
        <p>公共交通与步行为主；暴雨、盛夏体力下降或携带购物袋时，短程打车更划算。</p>
        <a href="#days"><Map size={17} />回到五日行程</a>
      </footer>
    </main>
  );
}
