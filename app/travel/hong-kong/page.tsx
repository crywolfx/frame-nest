import Link from "next/link";
import ItineraryMap from "./ItineraryMap";

type Stop = {
  name: string;
  coords: [number, number];
};

type Day = {
  day: string;
  date: string;
  title: string;
  theme: string;
  accent: string;
  image: string;
  place: string;
  color: string;
  metrics: string[];
  route: Array<{ time: string; title: string; detail: string }>;
  meals: Array<{ slot: string; name: string; note: string }>;
  tips: string[];
  stops: Stop[];
};

const principles = ["少折返", "公共交通", "行李友好", "街区优先", "拍照顺光"];

const transport = [
  {
    title: "4/28 香港机场 → 澳门",
    choice: "港珠澳大桥穿梭巴士（金巴）",
    reason: "香港口岸白天票价 HKD 65，适合落地后带两只行李箱跨境。",
    detail: "机场取行李后去香港口岸，再坐金巴到澳门口岸。到澳门后用酒店接驳或短途打车收尾。"
  },
  {
    title: "4/30 澳门 → 香港",
    choice: "氹仔码头 → 香港上环",
    reason: "Cotai Water Jet 平日普通舱 MOP/HKD 175，10:30 左右的船最贴合中午入住节奏。",
    detail: "酒店退房后去氹仔码头，提前 30-45 分钟到场；大件行李尽量提前确认托运规则。"
  },
  {
    title: "5/1 香港市内移动",
    choice: "天星小轮 + 港铁 + 叮叮车",
    reason: "天星小轮中环线约 9 分钟，成人票工作日 HKD 5、周末及假日 HKD 6.5。",
    detail: "上午坐船进中环，山顶后用步行和叮叮车串起中环、上环，晚上再回九龙。"
  }
];

const foodFocus = [
  "澳门第一晚：António 正餐，Lord Stow’s 葡挞做甜点。",
  "澳门半岛：黄枝记最顺路，A Lorcha 更适合认真吃葡国菜。",
  "香港中环：一乐烧鹅作为换城后的第一餐，排队太久就改周边烧味。",
  "油麻地夜晚：美都餐室吃氛围，麦文记做快速云吞面备选。",
  "离港早午餐：Bakehouse 或酒店早餐，不为了吃饭冒误机风险。"
];

const days: Day[] = [
  {
    day: "Day 1",
    date: "4/28 周二",
    title: "杭州 → 香港 → 澳门",
    theme: "第一天只求顺利落地，晚上把澳门夜色轻轻打开。",
    accent: "lotus",
    image: "image-macau-night",
    place: "氹仔旧城 / 路氹夜景",
    color: "#e66f5c",
    metrics: ["跨境转场", "夜景慢拍", "葡国菜"],
    route: [
      { time: "12:55", title: "抵达香港机场", detail: "先处理入境、取行李、补水和八达通/支付检查，别急着赶下一段。" },
      { time: "14:00", title: "机场 → 港珠澳大桥香港口岸", detail: "行李多时优先选择接驳或短途打车，减少拖箱步行。" },
      { time: "14:25", title: "金巴到澳门口岸", detail: "白天票价 HKD 65；过关、候车、上车预留 60 分钟更舒服。" },
      { time: "16:15", title: "入住澳门瑞吉", detail: "先整理设备、电量和轻便背包，晚上只带相机/手机出门。" },
      { time: "19:30", title: "官也街 → 路氹外景", detail: "官也街适合边走边吃，威尼斯人、巴黎人、伦敦人适合夜景补拍。" }
    ],
    meals: [
      { slot: "晚餐首选", name: "António", note: "海鲜饭、烤鳕鱼、烤乳猪；适合第一晚正式吃一顿。" },
      { slot: "轻松吃法", name: "官也街小食", note: "猪扒包、牛杂、饮品，适合不想坐太久。" },
      { slot: "甜点", name: "Lord Stow’s Bakery", note: "葡挞和咖啡，饭后散步时补一个刚刚好。" }
    ],
    tips: ["不要把 Day 1 排满，跨境和入住才是主任务。", "路氹外景晚上更出片，三脚架不必带，轻装更舒服。"],
    stops: [
      { name: "香港机场", coords: [22.308, 113.9185] },
      { name: "港珠澳大桥香港口岸", coords: [22.3176, 113.9517] },
      { name: "澳门口岸", coords: [22.2118, 113.5583] },
      { name: "澳门瑞吉酒店", coords: [22.1478, 113.5664] },
      { name: "官也街", coords: [22.1539, 113.5562] },
      { name: "路氹酒店外景", coords: [22.1459, 113.5639] }
    ]
  },
  {
    day: "Day 2",
    date: "4/29 周三",
    title: "澳门半岛 Citywalk",
    theme: "推荐 B 方案，把时间留给连续街区，而不是为了一个点折返。",
    accent: "stone",
    image: "image-ruins",
    place: "议事亭前地 / 大三巴",
    color: "#c18a31",
    metrics: ["B 方案", "半岛街区", "甜品休息"],
    route: [
      { time: "08:00", title: "酒店附近早餐", detail: "酒店早餐或官也街周边面包店，目标是 09:15 前到半岛。" },
      { time: "09:15", title: "议事亭前地", detail: "先拍石板路、街口和老店；人多时用巷口侧面构图。" },
      { time: "10:30", title: "恋爱巷", detail: "彩色立面和窄巷透视适合轻拍，不需要停太久。" },
      { time: "11:15", title: "大三巴牌坊", detail: "重点看街区层次和坡道纵深，到此一拍后向大炮台移动。" },
      { time: "13:15", title: "大炮台 / 澳门博物馆", detail: "天气热或下雨就进博物馆；天气好则在炮台看城市层次。" },
      { time: "20:00", title: "路氹夜景补拍", detail: "回酒店休整后再出门，避免下午硬撑导致晚上没状态。" }
    ],
    meals: [
      { slot: "午餐顺路", name: "黄枝记", note: "虾子捞面、鲜虾云吞面；适合议事亭前地附近快速吃。" },
      { slot: "午餐升级", name: "A Lorcha", note: "葡式鸡、海鲜饭、猪肉炒蚬；想认真吃再绕过去。" },
      { slot: "晚餐", name: "António / 路氹酒店区", note: "想稳定就 António，想省脚力就在酒店区解决。" }
    ],
    tips: ["Day 2 选 B，路线最完整，也最符合 citywalk。", "大三巴正面人多，坡道侧面和街巷回望更容易出片。"],
    stops: [
      { name: "澳门瑞吉酒店", coords: [22.1478, 113.5664] },
      { name: "议事亭前地", coords: [22.1936, 113.5399] },
      { name: "恋爱巷", coords: [22.1971, 113.5404] },
      { name: "大三巴牌坊", coords: [22.1977, 113.5409] },
      { name: "大炮台", coords: [22.1979, 113.5424] },
      { name: "澳门博物馆", coords: [22.1981, 113.5425] },
      { name: "路氹酒店区", coords: [22.146, 113.564] }
    ]
  },
  {
    day: "Day 3",
    date: "4/30 周四",
    title: "澳门 → 香港",
    theme: "中午前后完成换城，下午把时间交给 M+ 和维港。",
    accent: "harbor",
    image: "image-harbor",
    place: "西九海滨 / 维港",
    color: "#4e9fbe",
    metrics: ["坐船换城", "M+", "维港夜景"],
    route: [
      { time: "08:00", title: "早餐与退房", detail: "把证件、船票、充电宝放随身包，行李箱贴好识别物。" },
      { time: "10:30", title: "氹仔码头坐船", detail: "普通舱 MOP/HKD 175；建议提前到码头，行李托运按现场规则处理。" },
      { time: "12:20", title: "千禧新世界香港酒店", detail: "到酒店寄存或入住，下午只背轻包去西九。" },
      { time: "14:30", title: "M+", detail: "M+ 位于西九文化区，周二至周四和周末 10:00-18:00，周五 10:00-22:00。" },
      { time: "17:00", title: "西九海滨", detail: "等光线变软，拍维港天际线和海边人群。" },
      { time: "19:15", title: "尖沙咀海滨夜景", detail: "星光大道一带适合等夜色，最后回酒店不折返。" }
    ],
    meals: [
      { slot: "午餐", name: "一乐烧鹅", note: "烧鹅饭/烧鹅面；换城后第一顿香港味，排队久就切周边简餐。" },
      { slot: "下午茶", name: "Bakehouse", note: "蛋挞、牛角包、咖啡；适合作为 M+ 前后补给。" },
      { slot: "晚餐", name: "鼎泰丰尖沙咀", note: "小笼包、红油抄手、排骨蛋炒饭；夜景前后都顺。" }
    ],
    tips: ["M+ 最后入场为闭馆前 30 分钟，周五开到 22:00 更从容。", "西九到尖沙咀可以港铁/短途车，不要把海滨走成体力消耗战。"],
    stops: [
      { name: "澳门瑞吉酒店", coords: [22.1478, 113.5664] },
      { name: "氹仔码头", coords: [22.1637, 113.5737] },
      { name: "香港上环港澳码头", coords: [22.287, 114.1528] },
      { name: "千禧新世界香港酒店", coords: [22.2982, 114.1784] },
      { name: "M+", coords: [22.302, 114.1594] },
      { name: "西九海滨", coords: [22.3001, 114.1561] },
      { name: "尖沙咀海滨", coords: [22.2939, 114.174] }
    ]
  },
  {
    day: "Day 4",
    date: "5/1 周五",
    title: "山顶与老香港夜晚",
    theme: "早上避开山顶人流，下午看港岛街区，晚上回九龙收进电影感。",
    accent: "peak",
    image: "image-peak",
    place: "山顶 / 中环 / 油麻地",
    color: "#2f7a62",
    metrics: ["天星小轮", "山顶缆车", "庙街"],
    route: [
      { time: "08:35", title: "天星小轮去中环", detail: "尖沙咀到中环约 9 分钟，早班船比地铁更有旅行感。" },
      { time: "09:10", title: "山顶缆车", detail: "2025 年底后成人单程 HKD 82、往返 HKD 116；早点上山少排队。" },
      { time: "10:30", title: "山顶观景", detail: "不只拍地标，重点拍城市层次、海面和建筑密度。" },
      { time: "13:40", title: "中环 → 半山扶梯 → 上环", detail: "坡道、扶梯、旧招牌和街角都适合慢慢拍。" },
      { time: "19:20", title: "旧油麻地警署", detail: "老香港电影感强，适合夜色刚起时拍建筑轮廓。" },
      { time: "20:00", title: "庙街 / 佐敦散步", detail: "夜市、茶餐厅、霓虹和街口人流，作为整天收尾。" }
    ],
    meals: [
      { slot: "早餐", name: "尖沙咀茶餐厅", note: "奶茶、多士、通粉/面；目标是早点出门。" },
      { slot: "午餐", name: "一乐烧鹅 / 中环烧味", note: "烧鹅饭、叉烧、烧肉；山顶下来后在中环吃最顺。" },
      { slot: "晚餐", name: "美都餐室 / 麦文记", note: "美都吃氛围和焗饭，麦文记吃利落云吞面。" }
    ],
    tips: ["山顶不建议午后才去，假期人流和光线都更难控。", "油麻地夜晚别贪多，警署、庙街、佐敦吃饭连起来就够。"],
    stops: [
      { name: "千禧新世界香港酒店", coords: [22.2982, 114.1784] },
      { name: "尖沙咀天星码头", coords: [22.2937, 114.1687] },
      { name: "中环天星码头", coords: [22.2878, 114.1593] },
      { name: "山顶缆车总站", coords: [22.277, 114.1601] },
      { name: "太平山顶", coords: [22.271, 114.149] },
      { name: "半山扶梯", coords: [22.2822, 114.1536] },
      { name: "旧油麻地警署", coords: [22.3098, 114.169] },
      { name: "庙街", coords: [22.3074, 114.1694] }
    ]
  },
  {
    day: "Day 5",
    date: "5/2 周六",
    title: "香港 → 杭州",
    theme: "不加新景点，用海滨和早餐把旅程收干净。",
    accent: "ferry",
    image: "image-ferry",
    place: "尖沙咀 / 尖东海滨",
    color: "#1d1d1f",
    metrics: ["轻早午餐", "海滨收尾", "机场预留"],
    route: [
      { time: "08:00", title: "早餐与整理行李", detail: "确认充电器、证件、购物小票和随身物，不要把收尾变成找东西。" },
      { time: "09:00", title: "尖沙咀 / 尖东海滨慢走", detail: "只拍几张旅行结尾照，不再新增远点。" },
      { time: "10:20", title: "回酒店取行李", detail: "留出一点缓冲，避免电梯、退房、叫车都卡在同一刻。" },
      { time: "11:10", title: "抵达香港机场", detail: "13:55 起飞，值机、安检和候机时间更稳。" }
    ],
    meals: [
      { slot: "早餐稳妥", name: "酒店早餐", note: "最省心，适合不想带箱子到处找吃的。" },
      { slot: "轻早午餐", name: "Bakehouse / 海滨咖啡", note: "蛋挞、牛角包、咖啡；适合轻松一点。" },
      { slot: "机场备选", name: "机场简餐", note: "如果市区时间被压缩，直接去机场吃，不冒误机风险。" }
    ],
    tips: ["Day 5 不安排远景点，这是整趟最重要的稳定性。", "最后一段宁可早到机场，也不要为了早餐或拍照压缩值机时间。"],
    stops: [
      { name: "千禧新世界香港酒店", coords: [22.2982, 114.1784] },
      { name: "尖沙咀海滨", coords: [22.2939, 114.174] },
      { name: "香港机场", coords: [22.308, 113.9185] }
    ]
  }
];

const bookings = [
  "旧油麻地警署：如果开放预约，优先提前处理。",
  "山顶缆车：公众假期提前购票，成人往返新价 HKD 116。",
  "4/30 澳门 → 香港船票：提前一天确认 10:30 左右船班。",
  "M+：周一闭馆，周五开放至 22:00，最后入场为闭馆前 30 分钟。"
];

const easyChoices = ["澳门 Day 2 选 B 方案", "跨境组合选金巴 + 船", "香港 Day 4 早点去山顶", "Day 5 不新增远点"];

const sources = [
  { label: "Leaflet 路线地图", href: "https://leafletjs.com/examples/quick-start/" },
  { label: "OpenStreetMap Tile Policy", href: "https://operations.osmfoundation.org/policies/tiles/" },
  { label: "M+ 官方开放时间", href: "https://www.mplus.org.hk/en/plan-your-visit/" },
  { label: "Cotai Water Jet 船班票价", href: "https://www.cotaiwaterjet.com/ferry-schedule/hongkong-macau-taipa" },
  { label: "港珠澳大桥穿梭巴士票价", href: "https://www.turbojet.com.hk/hzmbus/en/fare.aspx" },
  { label: "天星小轮票价", href: "https://www.starferry.com.hk/en/service" }
];

export default function HongKongGuidePage() {
  return (
    <main className="site-shell detail-shell itinerary-shell" id="main">
      <nav className="top-nav itinerary-nav" aria-label="港澳攻略导航">
        <Link className="brand-link" href="/">
          首页
        </Link>
        <div className="nav-links">
          <Link href="/travel">攻略总览</Link>
          <a href="#daily-plan">每日安排</a>
          <a href="#route-maps">路线地图</a>
          <a href="#checklist">预约清单</a>
        </div>
      </nav>

      <section className="itinerary-hero apple-itinerary-hero" aria-labelledby="hong-kong-title">
        <div className="itinerary-hero-copy">
          <p className="eyebrow">Hong Kong & Macau</p>
          <h1 id="hong-kong-title">香港澳门 5 日旅行攻略</h1>
          <p>
            先澳门后香港。每天都有明确主题、餐饮选择和路线地图，尽量少折返、少拖箱，把体力留给街区、夜景和照片。
          </p>
          <div className="trip-facts" aria-label="行程概览">
            <span>2026.04.28 - 05.02</span>
            <span>澳门瑞吉 2 晚</span>
            <span>千禧新世界香港 2 晚</span>
          </div>
        </div>
        <div className="apple-hero-device" aria-hidden="true">
          <div className="apple-hero-screen">
            <div className="apple-hero-glass">
              <span>04.28 - 05.02</span>
              <strong>少折返，多拍照。</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="principle-strip" aria-label="行程原则">
        {principles.map((principle) => (
          <span key={principle}>{principle}</span>
        ))}
      </section>

      <section className="transport-grid transport-grid-premium" aria-label="关键交通判断">
        {transport.map((item) => (
          <article className="transport-card" key={item.title}>
            <span>{item.title}</span>
            <h2>{item.choice}</h2>
            <p>{item.reason}</p>
            <strong>{item.detail}</strong>
          </article>
        ))}
      </section>

      <section className="food-focus" aria-labelledby="food-title">
        <div>
          <p className="eyebrow">Food Strategy</p>
          <h2 id="food-title">美食不要堆清单，要跟路线走。</h2>
        </div>
        <ul>
          {foodFocus.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="daily-plan" id="daily-plan" aria-labelledby="daily-title">
        <div className="section-heading">
          <p className="eyebrow">Daily Plan</p>
          <h2 id="daily-title">每天都不一样</h2>
        </div>

        <div className="day-timeline" id="route-maps">
          {days.map((day, index) => (
            <article className={`day-card apple-day-card day-${day.accent}`} key={day.day}>
              <div className={`day-image ${day.image}`} aria-hidden="true">
                <span>{day.place}</span>
              </div>
              <div className="day-card-head">
                <span>{day.day}</span>
                <p>{day.date}</p>
                <div className="day-metrics">
                  {day.metrics.map((metric) => (
                    <em key={metric}>{metric}</em>
                  ))}
                </div>
              </div>
              <div className="day-copy">
                <p className="day-count">{String(index + 1).padStart(2, "0")}</p>
                <h3>{day.title}</h3>
                <p className="day-theme">{day.theme}</p>
                <div className="route-steps">
                  {day.route.map((route) => (
                    <div className="route-step" key={`${day.day}-${route.time}`}>
                      <time>{route.time}</time>
                      <div>
                        <strong>{route.title}</strong>
                        <p>{route.detail}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <aside className="day-side-panel" aria-label={`${day.day} 餐饮与地图`}>
                <div className="meal-stack">
                  {day.meals.map((meal) => (
                    <article className="meal-card" key={`${day.day}-${meal.name}`}>
                      <span>{meal.slot}</span>
                      <strong>{meal.name}</strong>
                      <p>{meal.note}</p>
                    </article>
                  ))}
                </div>
                <ItineraryMap color={day.color} stops={day.stops} />
                <div className="day-tips">
                  {day.tips.map((tip) => (
                    <p key={tip}>{tip}</p>
                  ))}
                </div>
              </aside>
            </article>
          ))}
        </div>
      </section>

      <section className="choice-panel premium-choice" aria-labelledby="macau-choice-title">
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

      <section className="source-strip" aria-label="资料来源">
        {sources.map((source) => (
          <a href={source.href} key={source.href} rel="noreferrer" target="_blank">
            {source.label}
          </a>
        ))}
      </section>
    </main>
  );
}
