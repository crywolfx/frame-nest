"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Camera,
  Check,
  ChevronDown,
  CircleAlert,
  CloudRain,
  Coffee,
  ExternalLink,
  Map,
  Navigation,
  Plane,
  RefreshCcw,
  ShoppingBag,
  Sparkles,
  TicketCheck,
  TrainFront,
  Umbrella,
  Utensils,
  WalletCards
} from "lucide-react";
import styles from "./tokyo.module.css";

type Meal = {
  meal: string;
  primary: string;
  note: string;
  price: string;
  cny: string;
  backups: string[];
};

type Stop = {
  time: string;
  title: string;
  body: string;
  transit?: string;
  cost: string;
  cny: string;
  tag?: string;
};

type Day = {
  id: string;
  date: string;
  weekday: string;
  label: string;
  title: string;
  subtitle: string;
  weather: string;
  range: string;
  rainPlan: string;
  color: string;
  stops: Stop[];
  meals: Meal[];
  shopping: string;
  returnPlan: string;
};

const jpyRate = "页面统一按 ¥100 ≈ RMB 4.17 估算";

const days: Day[] = [
  {
    id: "d1",
    date: "08.14",
    weekday: "周五",
    label: "落地",
    title: "成田 → 日暮里 → 银座",
    subtitle: "不为赶一班车破坏第一晚；19:44 是最稳的目标。",
    weather: "阵雨",
    range: "30° / 23°",
    rainPlan: "雨势大或行李多：日暮里直接打车到酒店，约 ¥4,500–6,500 / RMB 188–271。",
    color: "#d64b3b",
    stops: [
      { time: "18:10", title: "NH930 抵达成田 T1", body: "入境、取行李后跟“铁道 / Railway”去 B1；T1 到车站步行约 5 分钟。", cost: "¥0", cny: "RMB 0", tag: "固定" },
      { time: "19:44", title: "Skyliner 推荐目标车次", body: "18:43 不可能；19:03 极紧；19:23 只在通关特别快时选。线上票通常仍需按产品说明换票，全车指定席。", transit: "成田 T1 → 日暮里约 40 分钟", cost: "¥2,580", cny: "RMB 108" },
      { time: "20:20", title: "日暮里换 JR", body: "优先山手线 JY 或京滨东北线 JK 的东京・品川方向，不必执着等常磐线直通。", transit: "日暮里 → 新桥约 20–24 分钟", cost: "约 ¥210", cny: "RMB 9" },
      { time: "20:50", title: "酒店入住", body: "JR 新桥站银座口步行约 5 分钟。现实到店区间约 20:45–21:15，比“20:30 必到”更可靠。", cost: "¥0", cny: "RMB 0" },
      { time: "21:15", title: "银座热汤晚餐", body: "首选鹤豚丹，排队超过 25 分钟立即换店；首晚不安排夜间逛街。", cost: "¥1,500–2,000", cny: "RMB 63–83" }
    ],
    meals: [
      { meal: "早餐", primary: "杭州 / 机上", note: "不纳入东京行程。", price: "机票内", cny: "RMB 0", backups: [] },
      { meal: "午餐", primary: "杭州 / 机上", note: "落地前吃好，避免空腹处理入境。", price: "机票内", cny: "RMB 0", backups: [] },
      { meal: "晚餐", primary: "鹤豚丹银座", note: "4.1 分、约 3,000 条评价，营业约至 23:00。", price: "¥1,500–2,000", cny: "RMB 63–83", backups: ["一风堂银座 ¥1,200–1,800 / RMB 50–75", "鸟贵族新桥 ¥2,000–3,000 / RMB 83–125（只作深夜兜底）"] }
    ],
    shopping: "只补 Suica、饮用水、防晒和第二天早餐；¥1,000–2,000 / RMB 42–83。",
    returnPlan: "饭后步行或短程打车回酒店，22:30 前休息。"
  },
  {
    id: "d2",
    date: "08.15",
    weekday: "周六",
    label: "塔与艺术",
    title: "滨离宫 → 东京塔 → 麻布台 → 六本木",
    subtitle: "东京塔只看一次好角度；把时间留给艺术与黄昏。",
    weather: "上午强阵雨",
    range: "30° / 24°",
    rainPlan: "08:30 看雷达：强雨直接删滨离宫，早餐延长后坐大江户线去赤羽桥；下午主线几乎都可在室内完成。",
    color: "#145f69",
    stops: [
      { time: "09:00", title: "滨离宫短线 · 天气开关", body: "只走大手门—潮入池—中岛茶屋一线，45–60 分钟；不为完整环线耗体力。", cost: "¥300", cny: "RMB 13" },
      { time: "10:45", title: "增上寺与东京塔", body: "三解脱门到本堂自然取景；不上东京塔展望台，避免与六本木重复。", transit: "汐留 → 赤羽桥约 20 分钟", cost: "参拜 ¥0", cny: "RMB 0" },
      { time: "12:15", title: "麻布台午餐＋设计购物", body: "午餐后在咖啡馆坐够 30 分钟，避开最闷热时段；只看日本设计、食品与生活方式店。", cost: "¥2,100–3,900", cny: "RMB 88–163" },
      { time: "15:00", title: "Ron Mueck 2026", body: "建议立即预约 15:00–15:30 联票。周六及盂兰盆期间 09:00–22:00，但热门时段仍会满。", transit: "麻布台 → 六本木约 15 分钟", cost: "联票 ¥4,100", cny: "RMB 171", tag: "要预约" },
      { time: "17:30", title: "Tokyo City View 黄昏", body: "看展后同楼进入展望台；日落约 18:30，17:30–19:00 足够看日光、金色与蓝调。", cost: "联票已含", cny: "RMB 0" },
      { time: "19:30", title: "六本木晚餐", body: "晚餐与回酒店都控制在同一半径，不再跨区喝酒。", cost: "¥2,000–4,500", cny: "RMB 83–188" }
    ],
    meals: [
      { meal: "早餐", primary: "酒店早餐", note: "下雨天最省力；想轻量则便利店饭团＋酸奶。", price: "¥3,000–3,500", cny: "RMB 125–146", backups: ["便利店 ¥600–900 / RMB 25–38", "筑地寿司早餐 ¥2,000–4,000 / RMB 83–167（雨小时）"] },
      { meal: "午餐", primary: "麻布台 Hills 餐饮层", note: "现场按队伍选日式定食、荞麦或拉面。", price: "¥1,500–3,000", cny: "RMB 63–125", backups: ["AFURI ¥1,200–1,800 / RMB 50–75", "精品超市熟食 ¥1,000–2,000 / RMB 42–83"] },
      { meal: "晚餐", primary: "Butagumi / 六本木炸猪排", note: "想吃得正式选它；不想排队就转面食。", price: "¥2,500–4,500", cny: "RMB 104–188", backups: ["鹤豚丹六本木 ¥1,500–2,500 / RMB 63–104", "AFURI 六本木 ¥1,200–1,800 / RMB 50–75"] }
    ],
    shopping: "麻布台与森美术馆商店：日本设计、展览图录、生活方式小物；预算自定，建议控制在 60–75 分钟。",
    returnPlan: "六本木坐日比谷线到东银座或短程出租车；交通约 ¥210 / RMB 9，打车约 ¥2,000–3,000 / RMB 83–125。"
  },
  {
    id: "d3",
    date: "08.16",
    weekday: "周日",
    label: "西线",
    title: "新宿御苑 → 表参道 → 原宿 → 涩谷",
    subtitle: "一路向南，不在新宿大站来回穿梭。",
    weather: "早晨小雨",
    range: "30° / 24°",
    rainPlan: "雨势明显则取消新宿御苑，改为伊势丹食品馆—NEWoMan—Harakado，全程商场轴；17:20 涩谷 SKY 不变。",
    color: "#6c4aa1",
    stops: [
      { time: "09:00", title: "新宿御苑短线", body: "从新宿门进，走中央景观和温室附近，不追全园；可刷交通 IC。", cost: "¥500", cny: "RMB 21" },
      { time: "11:15", title: "Maisen 青山本店", body: "Google 实时 4.4 分、约 5,100 条评价；12 点后排队明显，尽量 11:15 前到或订位。", transit: "新宿三丁目 → 明治神宫前，约 ¥180", cost: "¥1,500–2,650", cny: "RMB 63–111" },
      { time: "13:00", title: "明治神宫南参道", body: "只走南参道到本殿往返，林荫路降温；不安排和服或商业拍摄。", cost: "¥0", cny: "RMB 0" },
      { time: "14:10", title: "原宿—表参道购物", body: "BEAMS、Kiddy Land、Harakado 与日本限定线择其二；15:35 必须离开。", cost: "街区 ¥0", cny: "RMB 0" },
      { time: "16:45", title: "到涩谷 SKY 14F 入口", body: "大包提前寄存；迟到可能拒绝入场。屋顶禁止帽子、三脚架、自拍杆与无挂绳相机。", transit: "表参道 → 涩谷一站，约 ¥180", cost: "已预约", cny: "参考 RMB 142", tag: "硬截止" },
      { time: "17:20", title: "涩谷 SKY", body: "雨、雷、强风或异常高温会关闭屋顶；即使屋顶关闭，也按票面时间到场使用室内层。", cost: "参考 ¥3,400", cny: "RMB 142" },
      { time: "19:25", title: "鱼米晚餐＋涩谷短逛", body: "晚餐后只选 PARCO 或 MEGA 唐吉诃德一个，21:15 左右返回。", cost: "¥1,500–2,000", cny: "RMB 63–83" }
    ],
    meals: [
      { meal: "早餐", primary: "银座面包＋咖啡", note: "早点出发，避免新宿 10 点后人流。", price: "¥800–1,800", cny: "RMB 33–75", backups: ["便利店 ¥600–900 / RMB 25–38", "新宿御苑 Starbucks ¥700–1,200 / RMB 29–50"] },
      { meal: "午餐", primary: "Maisen 青山本店", note: "夏季御膳约 ¥2,600–2,650；11:15 入店最省时间。", price: "¥1,500–2,650", cny: "RMB 63–111", backups: ["AFURI 原宿 ¥1,200–1,800 / RMB 50–75", "原宿饺子楼 ¥900–1,500 / RMB 38–63"] },
      { meal: "晚餐", primary: "鱼米涩谷道玄坂", note: "4.3 分、约 9,000 条评价，营业约至 23:00。", price: "¥1,500–2,000", cny: "RMB 63–83", backups: ["牛かつもと村 ¥2,000–3,000 / RMB 83–125", "涩谷 Hikarie 餐饮层 ¥2,000–4,000 / RMB 83–167"] }
    ],
    shopping: "特色优先：BEAMS JAPAN、Harakado、涩谷 PARCO；国际大牌在表参道顺路看，不单独排队。",
    returnPlan: "涩谷坐银座线直达新桥，约 16 分钟、¥210 / RMB 9；比 JR 换线更简单。"
  },
  {
    id: "d4",
    date: "08.17",
    weekday: "周一",
    label: "东线",
    title: "浅草 → 晴空塔 → 秋叶原 → 东京站",
    subtitle: "清晨古寺，午后全部转入室内；东京站顺路收尾。",
    weather: "雷雨 / 阵雨",
    range: "30° / 24°",
    rainPlan: "雷雨最强时压缩合羽桥，直接短程打车去 Solamachi；晴空塔只按能见度购票，下午以商场、电器店和车站地下空间为主。",
    color: "#c08a18",
    stops: [
      { time: "08:00", title: "MISOJYU 日式早餐", body: "近期体验显示 8 点刚开门仍可能短排，但出餐快；排队超过 20 人就买饭团离开。", cost: "晨间约 ¥1,330", cny: "RMB 55" },
      { time: "08:50", title: "浅草寺清晨", body: "先雷门—仲见世—本堂，店铺陆续开门后反向回逛；不等空镜。", cost: "¥0", cny: "RMB 0" },
      { time: "10:20", title: "合羽桥厨具街", body: "只逛 3–4 家目标店；周一部分独立店休息，遇关闭就提前离开。", cost: "街区 ¥0", cny: "RMB 0" },
      { time: "12:00", title: "Solamachi 午餐＋休息", body: "13:30 在 4F 看能见度；低云或雨幕明显就不买展望票。", transit: "合羽桥打车约 ¥1,200–1,800 / RMB 50–75", cost: "午餐 ¥1,500–4,000", cny: "RMB 63–167" },
      { time: "13:30", title: "晴空塔 · 可选", body: "已经有六本木和涩谷两次展望，因此这里只在天气特别好时上塔。", cost: "预售参考 ¥2,100", cny: "RMB 88" },
      { time: "15:30", title: "秋叶原相机与电器", body: "先友都八喜，再选一个动漫/扭蛋主题；买电器先确认电压、语言、区域锁与国际保修。", transit: "押上 → 浅草桥 → 秋叶原约 ¥320", cost: "街区 ¥0", cny: "RMB 0" },
      { time: "18:00", title: "东京站丸之内＋KITTE", body: "先拍红砖站房、看免费屋顶，再买伴手礼；商店多在 20:30–21:00 前结束。", transit: "JR 秋叶原 → 东京约 ¥170", cost: "¥0", cny: "RMB 0" },
      { time: "19:30", title: "利久牛舌晚餐", body: "可订位且 8 月 13 日起换新菜单；根室花丸常见两小时等待，只在预计少于 45 分钟时选择。", cost: "¥2,000–3,000", cny: "RMB 83–125" }
    ],
    meals: [
      { meal: "早餐", primary: "MISOJYU", note: "味噌汤、饭团与小菜，更符合中国胃。", price: "约 ¥1,330", cny: "RMB 55", backups: ["便利店 ¥600–900 / RMB 25–38", "Suke6 Diner ¥1,500–2,500 / RMB 63–104"] },
      { meal: "午餐", primary: "六厘舍 Solamachi", note: "蘸面出餐快；看排队长度再选。", price: "¥1,200–1,800", cny: "RMB 50–75", backups: ["Toriton 回转寿司 ¥2,000–4,000 / RMB 83–167", "Solamachi 定食/食堂 ¥1,200–2,500 / RMB 50–104"] },
      { meal: "晚餐", primary: "仙台牛舌利久 Gransta", note: "4.0 分、约 1,450 条评价，人均 ¥2,000–3,000，可订位。", price: "¥2,000–3,000", cny: "RMB 83–125", backups: ["根室花丸 ¥2,000–4,000 / RMB 83–167（只等 ≤45 分钟）", "Gransta 便当 ¥1,200–2,500 / RMB 50–104"] }
    ],
    shopping: "合羽桥：餐具与厨具；秋叶原：相机与电器；东京站：角色限定与伴手礼。三段各有主题，不重复逛。",
    returnPlan: "东京站坐 JR 山手线一站到新桥，¥150–170 / RMB 6–7；回房后把次日早餐和车票放在一起。"
  },
  {
    id: "d5",
    date: "08.18",
    weekday: "周二",
    label: "返程",
    title: "银座 → 京成上野 → 成田 T1",
    subtitle: "05:40 首班车，让 10:05 国际航班拥有真正的缓冲。",
    weather: "湿热有雨",
    range: "30° / 25°",
    rainPlan: "清晨直接预约车到京成上野，不拖箱走地铁；若错过 05:40，06:00 Skyliner 约 06:44 到 T1，仍可执行。",
    color: "#40566c",
    stops: [
      { time: "04:45", title: "房内早餐＋退房", body: "前一晚买饭团、三明治与水；酒店早餐尚未开始。", cost: "¥600–900", cny: "RMB 25–38" },
      { time: "05:00", title: "预约车到京成上野", body: "给司机看“京成上野駅”，不要只说“上野站”，以免到 JR 入口。", transit: "约 20–25 分钟", cost: "¥4,000–5,500 / 车", cny: "RMB 167–229 / 车", tag: "推荐" },
      { time: "05:40", title: "Skyliner 首班", body: "从始发站上车，大行李更从容；提前购买指定席。", transit: "京成上野 → 成田 T1，44 分钟", cost: "¥2,580 / 人", cny: "RMB 108 / 人" },
      { time: "06:24", title: "抵达成田 T1", body: "距起飞约 3 小时 41 分；先值机安检，再补咖啡早餐。", cost: "机场餐 ¥800–1,500", cny: "RMB 33–63" },
      { time: "10:05", title: "NH929 返回杭州", body: "ANA 最终柜台与登机口以电子登机牌为准。", cost: "机票内", cny: "RMB 0", tag: "固定" }
    ],
    meals: [
      { meal: "早餐", primary: "前一晚便利店外带", note: "饭团/三明治＋水，房内吃完再出发。", price: "¥600–900", cny: "RMB 25–38", backups: ["成田 T1 咖啡店 ¥800–1,500 / RMB 33–63", "ANA 休息室 ¥0（仅符合资格时）"] },
      { meal: "午餐", primary: "NH929 机上餐", note: "东京行程已结束。", price: "机票内", cny: "RMB 0", backups: [] },
      { meal: "晚餐", primary: "杭州", note: "不纳入东京计划。", price: "不计", cny: "—", backups: [] }
    ],
    shopping: "机场只补漏买的伴手礼；不要为免税店压缩登机时间。",
    returnPlan: "主方案总交通约 ¥6,580–8,080 / RMB 274–337（出租车按整车计，不含分摊）。"
  }
];

const bookingItems = [
  { level: "今天", title: "森美术馆＋Tokyo City View 联票", detail: "8/15 建议 15:00–15:30，线上 ¥4,100 / RMB 171。", href: "https://www.mori.art.museum/en/news/2026/07/8868/index.html" },
  { level: "出发前", title: "8/18 05:40 Skyliner 指定席", detail: "京成上野始发，¥2,580 / RMB 108；同时预约 05:00 出租车。", href: "https://new-www.keisei.co.jp/keisei/tetudou/skyliner/jp/traffic/skyliner_timetable.php" },
  { level: "前一晚", title: "看雷达与屋顶开放状态", detail: "重点复核 8/15 强阵雨、8/16 涩谷 SKY 屋顶、8/17 雷雨。", href: "https://www.jma.go.jp/bosai/forecast/#area_type=offices&area_code=130000" }
];

const essentials = [
  ["Suica", "iPhone 可提前加入钱包；现场也可买 PASMO/Suica。余额先充 ¥5,000–8,000 / RMB 209–334。"],
  ["乘车", "认线路字母＋方向＋站号，不只看颜色；Google Maps 与站内电子屏同时核对，错过一班不要逆行奔跑。"],
  ["换乘", "复杂站内先找出口编号；新桥回酒店认 JR 银座口，返程认京成上野而非 JR 上野。"],
  ["天气", "折叠伞、防晒、补水盐糖、轻薄速干衣；雷雨时不进开阔屋顶和庭园。"],
  ["退税", "通常同店含税满 ¥5,000 起，以店内规则为准；护照原件随身，消耗品不要在日本拆封。"],
  ["餐厅", "设放弃阈值：普通店 25–30 分钟，根室花丸 45 分钟；高分不等于值得排两小时。"]
];

export default function TokyoGuideClient() {
  const [activeDay, setActiveDay] = useState("d1");
  const [showMap, setShowMap] = useState(false);
  const [expanded, setExpanded] = useState<string[]>(["d1"]);
  const active = useMemo(() => days.find((day) => day.id === activeDay) ?? days[0], [activeDay]);

  function selectDay(id: string) {
    setActiveDay(id);
    setExpanded((current) => (current.includes(id) ? current : [...current, id]));
    requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  function toggleDay(id: string) {
    setExpanded((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <main className={styles.page} id="main">
      <nav className={styles.nav} aria-label="东京攻略导航">
        <Link href="/travel" className={styles.wordmark}>FRAME / TOKYO</Link>
        <div className={styles.navLinks}>
          <a href="#route">每日路线</a>
          <button type="button" onClick={() => setShowMap(true)}><Map size={16} />互动地图</button>
          <Link href="/">首页</Link>
        </div>
      </nav>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.kicker}>TOKYO · 2026 / LATE SUMMER</p>
          <h1><span>东京</span><br />五日城市折线</h1>
          <p className={styles.heroLead}>从银座出发，把雨、热与盂兰盆人流当作路线条件。每天只保留一至两个真正锚点，摄影、吃饭和购物都顺路发生。</p>
          <div className={styles.heroActions}>
            <button className={styles.primaryButton} type="button" onClick={() => setShowMap(true)}><Navigation size={18} />打开可调整地图</button>
            <a className={styles.secondaryButton} href="#route"><ArrowDown size={18} />查看每日安排</a>
          </div>
          <div className={styles.heroFacts}>
            <span><Plane size={16} /> NH930 / NH929</span>
            <span><CalendarDays size={16} /> 08.14—08.18</span>
            <span><TrainFront size={16} /> 银座 · 新桥为基点</span>
          </div>
        </div>

        <div className={styles.heroBoard} aria-label="路线概览">
          <div className={styles.dateRail}><b>08</b><span>14—18</span></div>
          <div className={styles.towerGlyph} aria-hidden="true"><i /><i /><i /><i /></div>
          <div className={styles.boardStamp}>雨热<br />双模式</div>
          <ol className={styles.heroRoute}>
            <li><span>01</span><b>银座 / 新桥</b><em>BASE</em></li>
            <li><span>02</span><b>芝公园 / 六本木</b><em>ART</em></li>
            <li><span>03</span><b>新宿 / 涩谷</b><em>WEST</em></li>
            <li><span>04</span><b>浅草 / 东京站</b><em>EAST</em></li>
          </ol>
          <p className={styles.rateNote}>{jpyRate}</p>
        </div>
      </header>

      <section className={styles.weatherStrip} aria-label="五日天气预报">
        {days.map((day) => (
          <button type="button" key={day.id} onClick={() => selectDay(day.id)} className={activeDay === day.id ? styles.weatherActive : ""}>
            <span>{day.date} · {day.weekday}</span>
            <b>{day.weather}</b>
            <small>{day.range}</small>
          </button>
        ))}
        <div className={styles.weatherWarning}><CloudRain size={20} /><span>8/8 刷新<br />出发前晚再查</span></div>
      </section>

      <section className={styles.bookingSection} aria-labelledby="booking-title">
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>LOCK THESE FIRST</p>
          <h2 id="booking-title">先锁三件事</h2>
          <p>这三项决定行程能否成立，其他景点都可以按雨势删减。</p>
        </div>
        <div className={styles.bookingGrid}>
          {bookingItems.map((item, index) => (
            <a href={item.href} target="_blank" rel="noreferrer" key={item.title} className={styles.bookingCard}>
              <div><span>0{index + 1}</span><em>{item.level}</em></div>
              <h3>{item.title}</h3>
              <p>{item.detail}</p>
              <ArrowUpRight size={20} />
            </a>
          ))}
        </div>
      </section>

      <section className={styles.budgetSection} aria-label="预算与固定信息">
        <div className={styles.budgetLead}>
          <WalletCards size={24} />
          <span>东京段建议预算 / 每人</span>
          <strong>¥45,000—58,000</strong>
          <small>RMB 1,877—2,419</small>
          <p>不含机票、酒店与购物；含市内交通、三餐、森美术馆联票、已购涩谷 SKY 的参考价和可选晴空塔。</p>
        </div>
        <div className={styles.fixedFacts}>
          <article><TicketCheck /><span>固定预约</span><b>8/16 · 17:20</b><p>涩谷 SKY，16:45 到入口。</p></article>
          <article><Plane /><span>返程安全垫</span><b>3h 41m</b><p>05:40 Skyliner，06:24 到 T1。</p></article>
          <article><Umbrella /><span>天气策略</span><b>先删公园</b><p>不牺牲美术馆与固定门票。</p></article>
        </div>
      </section>

      <section className={styles.routeSection} id="route" aria-labelledby="route-title">
        <div className={styles.routeHeader}>
          <div>
            <p className={styles.kicker}>DAY BY DAY</p>
            <h2 id="route-title">五天，三条城市轴</h2>
          </div>
          <p>当前选中：<b>{active.date} · {active.title}</b></p>
        </div>

        <div className={styles.dayTabs} role="tablist" aria-label="选择日期">
          {days.map((day) => (
            <button key={day.id} type="button" role="tab" aria-selected={activeDay === day.id} onClick={() => selectDay(day.id)} style={{ "--day": day.color } as React.CSSProperties}>
              <span>{day.date}</span><b>{day.label}</b><small>{day.weekday}</small>
            </button>
          ))}
        </div>

        <div className={styles.dayStack}>
          {days.map((day, dayIndex) => {
            const isOpen = expanded.includes(day.id);
            return (
              <article className={styles.dayPanel} id={day.id} key={day.id} style={{ "--day": day.color } as React.CSSProperties}>
                <button className={styles.dayPanelHead} type="button" aria-expanded={isOpen} onClick={() => toggleDay(day.id)}>
                  <span className={styles.dayNumber}>D{dayIndex + 1}</span>
                  <div><p>{day.date} · {day.weekday} · {day.weather} {day.range}</p><h3>{day.title}</h3><span>{day.subtitle}</span></div>
                  <ChevronDown className={isOpen ? styles.chevronOpen : ""} />
                </button>

                {isOpen && (
                  <div className={styles.dayPanelBody}>
                    <div className={styles.rainSwitch}><CloudRain size={20} /><div><b>雨天开关</b><p>{day.rainPlan}</p></div></div>
                    <div className={styles.dayColumns}>
                      <div className={styles.timeline}>
                        {day.stops.map((stop, index) => (
                          <div className={styles.timelineItem} key={`${day.id}-${stop.time}-${stop.title}`}>
                            <div className={styles.timeCol}><span>{stop.time}</span><i>{String(index + 1).padStart(2, "0")}</i></div>
                            <div className={styles.timelineBody}>
                              <div className={styles.stopTitle}><h4>{stop.title}</h4>{stop.tag && <em>{stop.tag}</em>}</div>
                              <p>{stop.body}</p>
                              {stop.transit && <small><TrainFront size={14} />{stop.transit}</small>}
                            </div>
                            <div className={styles.price}><b>{stop.cost}</b><span>{stop.cny}</span></div>
                          </div>
                        ))}
                      </div>

                      <aside className={styles.dayAside}>
                        <div className={styles.asideTitle}><Utensils size={18} /><b>三餐与备选</b></div>
                        {day.meals.map((meal) => (
                          <div className={styles.mealCard} key={`${day.id}-${meal.meal}`}>
                            <span>{meal.meal}</span><h4>{meal.primary}</h4><p>{meal.note}</p>
                            <div><b>{meal.price}</b><small>{meal.cny}</small></div>
                            {meal.backups.length > 0 && <ul>{meal.backups.map((item) => <li key={item}>{item}</li>)}</ul>}
                          </div>
                        ))}
                        <div className={styles.asideNote}><ShoppingBag size={17} /><div><b>顺路购物</b><p>{day.shopping}</p></div></div>
                        <div className={styles.asideNote}><Navigation size={17} /><div><b>回程</b><p>{day.returnPlan}</p></div></div>
                      </aside>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </section>

      <section className={styles.mapSection} aria-labelledby="map-title">
        <div className={styles.mapCopy}>
          <p className={styles.kicker}>INTERACTIVE ROUTE</p>
          <h2 id="map-title">路线不是定死的</h2>
          <p>地图保留总览、单日、地点详情、筛选、加入/移除、拖动排序、撤销与重新安排。虚线只表示顺序，不代替实时导航。</p>
          <button type="button" className={styles.primaryButton} onClick={() => setShowMap(true)}><Map size={18} />全屏打开地图</button>
        </div>
        <button type="button" className={styles.mapPreview} onClick={() => setShowMap(true)} aria-label="打开互动地图">
          <div className={styles.fakeMap} aria-hidden="true">
            <span className={styles.mapLineOne} /><span className={styles.mapLineTwo} />
            {["银座", "六本木", "涩谷", "浅草", "东京站"].map((item, index) => <i key={item} style={{ "--i": index } as React.CSSProperties}><b>{index + 1}</b>{item}</i>)}
          </div>
          <span className={styles.mapCta}><Sparkles size={18} />点击调整每天地点</span>
        </button>
      </section>

      <section className={styles.tipsSection} aria-labelledby="tips-title">
        <div className={styles.sectionIntro}>
          <p className={styles.kicker}>TOKYO OPERATING NOTES</p>
          <h2 id="tips-title">真正有用的小 tips</h2>
          <p>来自官方核验、你提供的小红书攻略和近期地图体验的交叉结论。</p>
        </div>
        <div className={styles.tipsGrid}>
          {essentials.map(([title, body], index) => (
            <article key={title}><span>0{index + 1}</span>{index === 0 ? <WalletCards /> : index === 1 ? <TrainFront /> : index === 2 ? <Navigation /> : index === 3 ? <Umbrella /> : index === 4 ? <ShoppingBag /> : <Coffee />}<h3>{title}</h3><p>{body}</p></article>
          ))}
        </div>
      </section>

      <section className={styles.sourceSection} aria-label="来源与复核说明">
        <div><CircleAlert size={22} /><p><b>最后复核时间：2026-08-08。</b> 航班、天气、餐厅营业、屋顶开放与列车时刻会变化；8/13 晚再统一核对一次。页面价格按成人、单人或标注的整车价格估算。</p></div>
        <div className={styles.sourceLinks}>
          <a href="https://new-www.keisei.co.jp/keisei/tetudou/skyliner/jp/traffic/skyliner_timetable.php" target="_blank" rel="noreferrer">京成时刻 <ExternalLink size={13} /></a>
          <a href="https://www.mori.art.museum/en/news/2026/07/8868/index.html" target="_blank" rel="noreferrer">森美术馆 <ExternalLink size={13} /></a>
          <a href="https://www.shibuya-scramble-square.com/sky/ticket/" target="_blank" rel="noreferrer">涩谷 SKY <ExternalLink size={13} /></a>
          <a href="https://www.jma.go.jp/bosai/forecast/#area_type=offices&area_code=130000" target="_blank" rel="noreferrer">东京天气 <ExternalLink size={13} /></a>
        </div>
      </section>

      <footer className={styles.footer}>
        <div><Check size={18} /><span>少折返 · 有休息 · 雨天可切换</span></div>
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><ArrowUpRight size={16} />回到顶部</button>
      </footer>

      {showMap && (
        <div className={styles.mapOverlay} role="dialog" aria-modal="true" aria-label="东京五日互动地图">
          <div className={styles.mapOverlayHead}>
            <div><span>东京五日</span><b>互动路线编辑器</b><small>拖动地点后可撤销或重新安排</small></div>
            <button type="button" onClick={() => setShowMap(false)} aria-label="关闭地图"><RefreshCcw size={16} />返回攻略</button>
          </div>
          <iframe title="东京五日互动地图" src="/travel/tokyo/itinerary-map.html" />
        </div>
      )}
    </main>
  );
}
