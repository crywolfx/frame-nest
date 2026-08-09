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
  ExternalLink,
  MapPin,
  Plane,
  ShoppingBag,
  TicketCheck,
  TrainFront,
  Umbrella,
  Utensils,
  WalletCards
} from "lucide-react";
import styles from "./tokyo.module.css";
import {
  arrival,
  bookingItems,
  days,
  departure,
  essentials,
  hero,
  imageCredits,
  type DayPlan,
  type TripStep
} from "./tokyoData";

function EndpointPanel({
  eyebrow,
  title,
  lead,
  steps,
  tip,
  icon
}: {
  eyebrow: string;
  title: string;
  lead: string;
  steps: TripStep[];
  tip: string;
  icon: "arrival" | "departure";
}) {
  return (
    <article className={styles.endpointPanel}>
      <div className={styles.endpointHead}>
        <span className={styles.endpointIcon}>{icon === "arrival" ? <Plane size={22} /> : <TrainFront size={22} />}</span>
        <div>
          <p className={styles.eyebrow}>{eyebrow}</p>
          <h3>{title}</h3>
        </div>
      </div>
      <p className={styles.endpointLead}>{lead}</p>
      <ol className={styles.endpointSteps}>
        {steps.map((step) => (
          <li key={`${step.time}-${step.name}`}>
            <time>{step.time}</time>
            <div>
              <h4>{step.name}</h4>
              <p>{step.copy}</p>
              <span>{step.price}</span>
            </div>
          </li>
        ))}
      </ol>
      <p className={styles.endpointTip}><Umbrella size={17} />{tip}</p>
    </article>
  );
}

function StopCard({ stop, index }: { stop: DayPlan["stops"][number]; index: number }) {
  return (
    <article className={styles.stopCard}>
      <div className={styles.stopRail}>
        <span>{String(index + 1).padStart(2, "0")}</span>
        <time>{stop.time}</time>
      </div>
      <div className={styles.stopBody}>
        <div className={styles.stopTitleRow}>
          <h3>{stop.name}</h3>
          <MapPin size={20} aria-hidden="true" />
        </div>
        {stop.image ? (
          <figure className={styles.stopImage}>
            <Image src={stop.image} alt={stop.imageAlt ?? stop.name} width={800} height={600} sizes="(max-width: 760px) 100vw, 40vw" />
          </figure>
        ) : null}
        <div className={styles.stopFacts}>
          <div>
            <span>介绍</span>
            <p>{stop.intro}</p>
          </div>
          <div>
            <span>推荐理由</span>
            <p>{stop.reason}</p>
          </div>
          <div>
            <span>价格·预约</span>
            <p>{stop.priceBooking}</p>
          </div>
          <div>
            <span>交通</span>
            <p>{stop.transit}</p>
          </div>
        </div>
      </div>
    </article>
  );
}

function DayPanel({ day }: { day: DayPlan }) {
  return (
    <article className={styles.dayPanel} style={{ "--day-accent": day.color } as CSSProperties}>
      <header className={styles.dayHeader}>
        <div className={styles.dayStamp}>
          <span>{day.code}</span>
          <strong>{day.date}</strong>
          <small>{day.weekday}</small>
        </div>
        <div className={styles.dayIntro}>
          <p className={styles.eyebrow}>{day.daySubtitle}</p>
          <h2>{day.dayTitle}</h2>
          <p>{day.dayLead}</p>
        </div>
        <div className={styles.weatherCard}>
          <CloudRain size={22} />
          <p>{day.weatherNote}</p>
        </div>
      </header>

      <div className={`${styles.photoStrip} ${day.gallery.length === 1 ? styles.photoStripSingle : ""}`}>
        {day.gallery.map((photo) => (
          <figure key={photo.src}>
            <Image src={photo.src} alt={photo.alt} width={960} height={720} sizes="(max-width: 760px) 92vw, 44vw" />
            <figcaption>{photo.caption}</figcaption>
          </figure>
        ))}
      </div>

      <section className={styles.routeSection} aria-labelledby={`${day.id}-route`}>
        <div className={styles.sectionMarker}>
          <span>ROUTE / 01</span>
          <h3 id={`${day.id}-route`}>当天路线</h3>
        </div>
        <div className={styles.stopList}>
          {day.stops.map((stop, index) => <StopCard key={`${stop.time}-${stop.name}`} stop={stop} index={index} />)}
        </div>
      </section>

      <section className={styles.mealsSection} aria-labelledby={`${day.id}-meals`}>
        <div className={styles.sectionMarker}>
          <span>MEALS / 02</span>
          <h3 id={`${day.id}-meals`}>三餐安排</h3>
        </div>
        <div className={styles.mealGrid}>
          {day.meals.map((meal) => (
            <article key={meal.meal} className={styles.mealCard}>
              <div><Utensils size={19} /><span>{meal.meal}</span></div>
              <h4>{meal.name}</h4>
              <p>{meal.copy}</p>
              <strong>{meal.budget}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.fieldNotes} aria-label="购物、休息与雨天方案">
        <article>
          <ShoppingBag size={21} />
          <span>购物</span>
          <h3>{day.shopping.title}</h3>
          <p>{day.shopping.copy}</p>
        </article>
        <article>
          <Clock3 size={21} />
          <span>休息提示</span>
          <h3>把坐下写进行程</h3>
          <p>{day.restNote}</p>
        </article>
        <article className={styles.rainNote}>
          <Umbrella size={21} />
          <span>雨天方案</span>
          <h3>室内主线不变</h3>
          <p>{day.rainPlan}</p>
        </article>
      </section>

      <footer className={styles.daySources}>
        <span>当天核验入口</span>
        <div>
          {day.sources.map((source) => (
            <a key={source.href} href={source.href} target="_blank" rel="noreferrer">
              {source.label}<ArrowUpRight size={14} />
            </a>
          ))}
        </div>
      </footer>
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
      <nav className={styles.nav} aria-label="东京攻略导航">
        <Link href="/travel" className={styles.wordmark}>FRAME / TOKYO 26</Link>
        <div className={styles.navLinks}>
          <a href="#days">三天主线</a>
          <a href="#booking">预订清单</a>
          <a href="#essentials">通用提示</a>
          <Link href="/">首页</Link>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroIndex} aria-hidden="true">35.6762°N<br />139.6503°E</div>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{hero.eyebrow} / REBUILT 08.09</p>
          <h1>{hero.title}</h1>
          <p className={styles.heroLead}>{hero.lead}</p>
          <div className={styles.heroActions}>
            <a href="#days">查看三天主线<ArrowDown size={17} /></a>
            <a href="#booking">先看预约<TicketCheck size={17} /></a>
          </div>
          <dl className={styles.heroFacts}>
            <div><dt>日期</dt><dd>{hero.date}</dd></div>
            <div><dt>酒店</dt><dd>{hero.hotel}</dd></div>
            <div><dt>航班</dt><dd>NH930 / NH929</dd></div>
            <div><dt>换算</dt><dd>{hero.rate}</dd></div>
          </dl>
        </div>
        <div className={styles.heroVisual}>
          <figure>
            <Image src="/travel/tokyo/rebuild/tokyo-tower.jpg" alt="芝公园方向的东京塔" width={500} height={667} priority sizes="(max-width: 760px) 82vw, 34vw" />
          </figure>
          <div className={styles.heroTicket}>
            <span>BASE / GINZA</span>
            <strong>05 DAYS</strong>
            <small>摄影顺路 · 购物分区 · 午后休息</small>
          </div>
          <p className={styles.verticalLabel}>TOKYO FIELD NOTES / 2026</p>
        </div>
      </header>

      <section className={styles.endpoints} id="endpoints" aria-labelledby="endpoints-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>ARRIVAL + DEPARTURE</p>
          <h2 id="endpoints-title">往返方案保持不变</h2>
          <p>新版仅重排8月15日至17日；落地和返程沿用已确定的交通节奏。</p>
        </div>
        <div className={styles.endpointGrid}>
          <EndpointPanel eyebrow="DAY 01 / NARITA → GINZA" title={arrival.title} lead={arrival.lead} steps={arrival.steps} tip={arrival.tip} icon="arrival" />
          <EndpointPanel eyebrow="DAY 05 / GINZA → NARITA" title={departure.title} lead={departure.lead} steps={departure.steps} tip={departure.tip} icon="departure" />
        </div>
      </section>

      <section className={styles.bookingSection} id="booking" aria-labelledby="booking-title">
        <div className={styles.bookingHeading}>
          <span><TicketCheck size={24} /> BOOKING QUEUE</span>
          <h2 id="booking-title">预订清单（按紧急度排序）</h2>
          <p>以下项目建议尽早完成，避免现场售罄或时段不符。</p>
        </div>
        <div className={styles.bookingList}>
          {bookingItems.map((item, index) => (
            <a key={item.name} href={item.href} target="_blank" rel="noreferrer" className={styles.bookingItem}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <div>
                <small>{item.urgency}</small>
                <h3>{item.name}</h3>
                <p>{item.copy}</p>
              </div>
              <ArrowUpRight size={22} />
            </a>
          ))}
        </div>
      </section>

      <section className={styles.daysSection} id="days" aria-labelledby="days-title">
        <div className={styles.sectionIntro}>
          <p className={styles.eyebrow}>AUG 15—17 / REBUILT FROM PDF</p>
          <h2 id="days-title">三天主线重新排定</h2>
          <p>选择日期查看完整路线；每个景点均附介绍、推荐理由、票价与预约判断。</p>
        </div>
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
              <span>{day.code}</span>
              <strong>{day.date}</strong>
              <small>{day.dayTitle}</small>
              {activeDay.id === day.id ? <Check size={18} /> : <ArrowDown size={18} />}
            </button>
          ))}
        </div>
        <div id="day-detail" className={styles.dayDetail} role="tabpanel" tabIndex={-1} key={activeDay.id}>
          <DayPanel day={activeDay} />
        </div>
      </section>

      <section className={styles.essentialsSection} id="essentials" aria-labelledby="essentials-title">
        <div className={styles.essentialsHead}>
          <span><WalletCards size={24} /> FIELD RULES</span>
          <h2 id="essentials-title">通用提示</h2>
          <p>以下为全程适用规则，出发前请熟读。</p>
        </div>
        <div className={styles.essentialsGrid}>
          {essentials.map((item, index) => (
            <article key={item.name}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <h3>{item.name}</h3>
              <p>{item.copy}</p>
            </article>
          ))}
        </div>
      </section>

      <section className={styles.creditsSection} aria-labelledby="credits-title">
        <div>
          <p className={styles.eyebrow}>PHOTO SOURCES</p>
          <h2 id="credits-title">图片来源与授权</h2>
          <p>页面实景图均通过Chrome打开来源页后保存；展示时作网页尺寸裁切，作者与许可证如下。</p>
        </div>
        <div className={styles.creditList}>
          {imageCredits.map((credit) => (
            <a key={`${credit.label}-${credit.author}`} href={credit.href} target="_blank" rel="noreferrer">
              <Camera size={16} />
              <span>{credit.label}</span>
              <small>{credit.author} · {credit.license}</small>
              <ExternalLink size={14} />
            </a>
          ))}
        </div>
      </section>

      <footer className={styles.footer}>
        <div>
          <CalendarDays size={19} />
          <p>行程以公共交通和步行为主，暴雨或携带购物袋时短程打车。所有购物点只设明确重点，不回头，不堆店。</p>
        </div>
        <Link href="/travel">返回旅行档案 <ArrowUpRight size={16} /></Link>
      </footer>
    </main>
  );
}
