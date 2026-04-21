import Link from "next/link";

const principles = ["顺路优先", "公共交通优先", "citywalk 优先", "打车为备选", "不去寺庙"];

const transport = [
  {
    title: "4/28 香港机场 → 澳门",
    choice: "首选港珠澳大桥穿梭巴士（金巴）",
    reason: "班次密，机场落地后衔接顺，对两只行李箱更友好。",
    cost: "HKD 65 / 人，约 RMB 57"
  },
  {
    title: "4/30 澳门 → 香港",
    choice: "首选 Cotai Water Jet（氹仔码头 → 上环）",
    reason: "船上搬运行李压力更小，到港岛和尖沙咀都好衔接。",
    cost: "MOP/HKD 175 / 人，约 RMB 149 - 152"
  }
];

const days = [
  {
    day: "Day 1",
    date: "4/28 周二",
    title: "杭州 → 香港 → 澳门",
    theme: "顺利转场 + 氹仔/路氹夜景 + 轻松吃",
    route: ["12:55 抵达香港机场", "14:25 金巴前往澳门", "16:15 入住澳门瑞吉", "19:30 官也街与路氹夜景慢拍"],
    food: "晚餐首选 António；想省时间就在官也街边逛边吃。"
  },
  {
    day: "Day 2",
    date: "4/29 周三",
    title: "澳门整天",
    theme: "更推荐 B 方案：半岛经典街区 citywalk",
    route: ["09:15 议事亭前地", "10:30 恋爱巷", "11:15 大三巴牌坊", "13:15 大炮台 / 澳门博物馆", "20:00 路氹夜景补拍"],
    food: "午餐黄枝记更顺路；想认真吃葡国菜可选 A Lorcha。"
  },
  {
    day: "Day 3",
    date: "4/30 周四",
    title: "澳门 → 香港",
    theme: "平稳换城 + 西九 / M+ / 尖沙咀夜景",
    route: ["10:30 氹仔码头坐船", "12:20 到酒店寄存 / 入住", "14:30 M+", "17:00 西九海滨", "19:15 尖沙咀海滨夜景"],
    food: "午餐一乐烧鹅；晚餐尖沙咀鼎泰丰最顺。"
  },
  {
    day: "Day 4",
    date: "5/1 周五",
    title: "香港整天",
    theme: "山顶避峰 + 中环 citywalk + 油麻地夜晚",
    route: ["08:35 天星小轮到中环", "09:10 山顶缆车", "13:40 中环 / 半山扶梯 / 上环", "19:20 旧油麻地警署", "20:00 庙街 / 佐敦散步"],
    food: "午餐一乐烧鹅；晚餐美都餐室，想更快就麦文记。"
  },
  {
    day: "Day 5",
    date: "5/2 周六",
    title: "香港 → 杭州",
    theme: "轻松收尾，不冒误机风险",
    route: ["08:00 早餐与整理行李", "09:00 尖沙咀 / 尖东海滨慢走", "10:20 前往香港机场", "13:55 起飞返杭"],
    food: "早餐酒店、Bakehouse 或海滨轻 brunch。"
  }
];

const bookings = ["旧油麻地警署：建议提前预约，HKD 30 / 人", "山顶缆车：公众假期建议提前购票", "4/30 澳门 → 香港船票：提前一天确认或购买"];

const easyChoices = ["澳门 Day 2 优先选 B，不去亚婆井", "跨境组合选金巴 + 船，最适合两只行李箱", "整趟以 citywalk、街区气质、顺路吃饭为主"];

export default function HongKongGuidePage() {
  return (
    <main className="site-shell detail-shell itinerary-shell" id="main">
      <nav className="top-nav" aria-label="港澳攻略导航">
        <Link className="brand-link" href="/">
          首页
        </Link>
        <div className="nav-links">
          <Link href="/travel">攻略总览</Link>
          <a href="#daily-plan">每日安排</a>
          <a href="#checklist">预约清单</a>
        </div>
      </nav>

      <section className="itinerary-hero" aria-labelledby="hong-kong-title">
        <div className="itinerary-hero-copy">
          <p className="eyebrow">Hong Kong & Macau</p>
          <h1 id="hong-kong-title">香港澳门 5 日旅行攻略</h1>
          <p>
            4/28 从杭州出发，先澳门后香港。路线按少折返、行李友好、公共交通优先来安排，重点放在街区、夜景、吃饭和随手拍。
          </p>
          <div className="trip-facts" aria-label="行程概览">
            <span>2026.04.28 - 05.02</span>
            <span>澳门瑞吉 2 晚</span>
            <span>千禧新世界香港 2 晚</span>
          </div>
        </div>
        <div className="itinerary-photo-stack" aria-hidden="true">
          <div className="itinerary-photo photo-hong-kong" />
          <div className="itinerary-photo photo-macau" />
        </div>
      </section>

      <section className="principle-strip" aria-label="行程原则">
        {principles.map((principle) => (
          <span key={principle}>{principle}</span>
        ))}
      </section>

      <section className="transport-grid" aria-label="关键交通判断">
        {transport.map((item) => (
          <article className="transport-card" key={item.title}>
            <span>{item.title}</span>
            <h2>{item.choice}</h2>
            <p>{item.reason}</p>
            <strong>{item.cost}</strong>
          </article>
        ))}
      </section>

      <section className="daily-plan" id="daily-plan" aria-labelledby="daily-title">
        <div className="section-heading">
          <p className="eyebrow">Daily Plan</p>
          <h2 id="daily-title">每日安排</h2>
        </div>

        <div className="day-timeline">
          {days.map((day) => (
            <article className="day-card" key={day.day}>
              <div className="day-card-head">
                <span>{day.day}</span>
                <p>{day.date}</p>
              </div>
              <h3>{day.title}</h3>
              <p className="day-theme">{day.theme}</p>
              <ol>
                {day.route.map((route) => (
                  <li key={route}>{route}</li>
                ))}
              </ol>
              <p className="food-note">{day.food}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="choice-panel" aria-labelledby="macau-choice-title">
        <div>
          <p className="eyebrow">Macau Day 2</p>
          <h2 id="macau-choice-title">澳门第二天建议选 B 方案</h2>
        </div>
        <p>
          B 方案不去亚婆井前地，动线更完整：议事亭前地、恋爱巷、大三巴、大炮台和博物馆都在半岛片区，适合慢慢 citywalk，也更省脑省体力。
        </p>
      </section>

      <section className="checklist-grid" id="checklist" aria-label="预约与最省心选法">
        <article className="checklist-card">
          <h2>预约清单</h2>
          <ul>
            {bookings.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
        <article className="checklist-card">
          <h2>最省心选法</h2>
          <ul>
            {easyChoices.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </main>
  );
}
