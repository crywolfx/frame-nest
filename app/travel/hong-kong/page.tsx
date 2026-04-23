"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import Tilt from "react-parallax-tilt";
import { useMemo, useRef, useState } from "react";
import ItineraryMap from "./ItineraryMap";

type Stop = {
  name: string;
  coords: [number, number];
};

type Meal = {
  slot: string;
  name: string;
  note: string;
};

type RouteStep = {
  time: string;
  title: string;
  detail: string;
};

type OverlayNote = {
  label: string;
  note?: string;
  x: string;
  y: string;
};

type OverlayTrail = {
  x1: string;
  y1: string;
  x2: string;
  y2: string;
};

type DayVariant = {
  id: string;
  label: string;
  subtitle: string;
  mapImage: string;
  mapAlt: string;
  image: string;
  imageAlt: string;
  color: string;
  place: string;
  metrics: string[];
  route: RouteStep[];
  meals: Meal[];
  tips: string[];
  transport: string[];
  prep: string[];
  stops: Stop[];
  mapNotes: OverlayNote[];
  mapTrail: OverlayTrail[];
  foodNotes: OverlayNote[];
  foodCaption: string;
};

type DayEntry = {
  key: string;
  day: string;
  date: string;
  title: string;
  mood: string;
  chapter: string;
  chapterNote: string;
  variants: DayVariant[];
};

const travelPrinciples = ["少折返", "公共交通", "行李友好", "顺光拍照", "街区优先"];

const preparation = [
  {
    title: "证件与票务",
    items: ["港澳通行证与签注", "往返机票与酒店确认单", "Cotai Water Jet 船票 / 金巴购票信息", "山顶缆车与旧油麻地警署预约截图"]
  },
  {
    title: "支付与通信",
    items: ["港币 / 澳门币少量现金", "可刷 Visa / Mastercard 的卡", "八达通或移动支付备用", "香港 / 澳门漫游或 eSIM"]
  },
  {
    title: "拍照与随身物",
    items: ["轻便相机或手机稳定器", "充电宝与多口充电器", "薄外套、防晒和折叠伞", "能装下水和小零食的轻背包"]
  }
];

const transportFacts = [
  {
    title: "香港机场 → 澳门",
    body: "首选港珠澳大桥穿梭巴士（金巴）。带两只箱子时最省脑，先去香港口岸再跨海到澳门口岸。"
  },
  {
    title: "澳门 → 香港",
    body: "首选氹仔码头坐船到上环。行李处理更轻松，落地香港后去尖东酒店也更自然。"
  },
  {
    title: "香港市内",
    body: "尖沙咀到中环用天星小轮最有氛围；港铁串联远距离，叮叮车留给中环 / 上环这一段慢体验。"
  }
];

const sources = [
  { label: "Leaflet", href: "https://leafletjs.com/examples/quick-start/" },
  { label: "OpenStreetMap", href: "https://operations.osmfoundation.org/policies/tiles/" },
  { label: "M+ 开放时间", href: "https://www.mplus.org.hk/en/plan-your-visit/" },
  { label: "Cotai Water Jet", href: "https://www.cotaiwaterjet.com/ferry-schedule/hongkong-macau-taipa" },
  { label: "山顶缆车票价", href: "https://www.thepeak.com.hk/en/getting-to-the-peak/peak-tram" },
  { label: "天星小轮", href: "https://www.starferry.com.hk/en/service" }
];

const heroMapNotes: OverlayNote[] = [
  { label: "Day 1 入海", note: "杭州飞香港，跨桥进澳门", x: "20%", y: "26%" },
  { label: "Day 2 岔路", note: "澳门半岛 A / B 双线切换", x: "66%", y: "32%" },
  { label: "Day 3 换城", note: "氹仔码头坐船到上环", x: "56%", y: "55%" },
  { label: "Day 4 登高", note: "天星小轮 + 山顶 + 庙街", x: "35%", y: "66%" },
  { label: "Day 5 归岸", note: "海滨散步后从容去机场", x: "73%", y: "74%" }
];

const days: DayEntry[] = [
  {
    key: "day-1",
    day: "Day 1",
    date: "4/28 周二",
    title: "杭州 → 香港 → 澳门",
    mood: "第一天的关键词不是赶景点，而是把转场做得优雅、平稳、轻松。",
    chapter: "入海",
    chapterNote: "从杭州飞到香港，再由海上口岸进入澳门，像真正的启程。",
    variants: [
      {
        id: "arrival",
        label: "默认线路",
        subtitle: "机场落地、金巴跨境、氹仔夜景",
        mapImage: "/treasure/day1-map.png",
        mapAlt: "港澳第一天卷轴地图",
        image: "/treasure/day1-food.png",
        imageAlt: "澳门葡国菜与甜点卷轴插画",
        color: "#b85f38",
        place: "香港机场 → 港珠澳大桥 → 澳门瑞吉 → 官也街",
        metrics: ["跨境", "夜景", "葡国菜"],
        route: [
          {
            time: "12:55",
            title: "抵达香港机场",
            detail: "取行李、入境、补水，把证件和后续跨境票务放到最顺手的位置。"
          },
          {
            time: "14:00",
            title: "机场去香港口岸",
            detail: "行李多时优先机场巴士接驳或短途车前往港珠澳大桥香港口岸，减少拖箱步行。"
          },
          {
            time: "14:25",
            title: "金巴前往澳门口岸",
            detail: "白天票价约 HKD 65；从口岸出发，连同过关和候车建议预留约 60 分钟。"
          },
          {
            time: "16:15",
            title: "入住澳门瑞吉",
            detail: "进房后先整理相机、电量和夜拍背包，今天不追求塞满行程。"
          },
          {
            time: "18:00",
            title: "官也街与氹仔旧城",
            detail: "边走边吃，拍低层街区、葡式立面和傍晚灯光。"
          },
          {
            time: "19:30",
            title: "路氹夜景慢拍",
            detail: "威尼斯人、巴黎人、伦敦人外立面都适合夜里补拍，走一段就好，不硬刷。"
          }
        ],
        meals: [
          {
            slot: "正餐",
            name: "António",
            note: "海鲜饭、烤鳕鱼、烤乳猪，适合第一晚认真吃一顿。"
          },
          {
            slot: "街头补给",
            name: "官也街小食",
            note: "猪扒包、牛杂、饮品，适合边走边吃。"
          },
          {
            slot: "甜点",
            name: "Lord Stow’s",
            note: "葡挞和咖啡做饭后收尾。"
          }
        ],
        tips: [
          "Day 1 不要把行程排满，跨境和入住的稳定性比景点数量重要。",
          "路氹的夜景足够亮，轻装出门比带一堆设备更舒服。"
        ],
        transport: [
          "机场落地后前往港珠澳大桥香港口岸。",
          "香港口岸坐金巴去澳门口岸。",
          "澳门口岸到酒店用接驳车或短途打车。"
        ],
        prep: ["护照夹 / 证件包放最顺手", "给所有设备充到 80% 以上", "晚上只带轻便拍摄设备"],
        stops: [
          { name: "香港机场", coords: [22.308, 113.9185] },
          { name: "港珠澳大桥香港口岸", coords: [22.3176, 113.9517] },
          { name: "澳门口岸", coords: [22.2118, 113.5583] },
          { name: "澳门瑞吉酒店", coords: [22.1478, 113.5664] },
          { name: "官也街", coords: [22.1539, 113.5562] },
          { name: "路氹夜景区", coords: [22.1459, 113.5639] }
        ],
        mapNotes: [
          { label: "香港机场", note: "12:55 抵达后先取行李", x: "22%", y: "22%" },
          { label: "香港口岸", note: "14:00 去坐金巴", x: "52%", y: "24%" },
          { label: "澳门口岸", note: "过关后接驳去酒店", x: "74%", y: "48%" },
          { label: "官也街", note: "傍晚边吃边逛", x: "60%", y: "72%" }
        ],
        mapTrail: [
          { x1: "22%", y1: "22%", x2: "52%", y2: "24%" },
          { x1: "52%", y1: "24%", x2: "74%", y2: "48%" },
          { x1: "74%", y1: "48%", x2: "60%", y2: "72%" }
        ],
        foodNotes: [
          { label: "António", note: "第一晚认真吃葡国菜", x: "24%", y: "30%" },
          { label: "官也街小食", note: "猪扒包 / 牛杂 / 饮品", x: "62%", y: "44%" },
          { label: "Lord Stow's", note: "葡挞和咖啡收尾", x: "44%", y: "76%" }
        ],
        foodCaption: "第一晚不追求塞满景点，把跨境、入住、夜景和葡国菜收得稳稳当当。"
      }
    ]
  },
  {
    key: "day-2",
    day: "Day 2",
    date: "4/29 周三",
    title: "澳门整天",
    mood: "这是整趟最适合做路线选择的一天，A 和 B 都完整保留，用切换来比较。",
    chapter: "岔路",
    chapterNote: "一个偏电影氛围，一个偏最顺路 citywalk。",
    variants: [
      {
        id: "a",
        label: "A 方案",
        subtitle: "亚婆井前地 + 老澳门氛围线",
        mapImage: "/treasure/day2a-map.png",
        mapAlt: "澳门 A 方案卷轴地图",
        image: "/treasure/day2-food.png",
        imageAlt: "澳门半岛街头小食卷轴插画",
        color: "#9b6b36",
        place: "亚婆井前地 / 议事亭前地 / 恋爱巷 / 大三巴",
        metrics: ["电影感", "旧墙坡道", "安静街景"],
        route: [
          {
            time: "08:00",
            title: "酒店附近早餐",
            detail: "酒店早餐或官也街周边茶餐厅，早点出门更容易拍到安静的街道。"
          },
          {
            time: "08:40",
            title: "前往亚婆井前地",
            detail: "从路氹出发，公交加步行或直接短程打车，目标是 09:05 前到。"
          },
          {
            time: "09:05",
            title: "亚婆井前地",
            detail: "坡道、老墙面、旧街角都很有电影感，适合你们慢拍而不是急着打卡。"
          },
          {
            time: "10:20",
            title: "议事亭前地",
            detail: "石板路和街口层次强，游客多时转到侧巷构图更自然。"
          },
          {
            time: "11:20",
            title: "恋爱巷",
            detail: "彩色立面和窄巷透视感很强，停留不用太久。"
          },
          {
            time: "13:15",
            title: "大三巴与大炮台",
            detail: "牌坊打卡后就上大炮台，城市层次比一直停在牌坊正面更好看。"
          },
          {
            time: "20:00",
            title: "回路氹补拍夜景",
            detail: "晚上再回酒店区，轻轻收一个路氹夜景。"
          }
        ],
        meals: [
          { slot: "早餐", name: "酒店 / 官也街面包店", note: "简单吃就够，今天重点是路线连贯。" },
          { slot: "午餐", name: "A Lorcha", note: "葡式鸡、海鲜饭、阿连特茹猪肉炒蚬，更讲究。" },
          { slot: "晚餐", name: "António", note: "如果第一晚没吃够，今天晚上仍然顺路。" }
        ],
        tips: [
          "A 方案更看重氛围，不是景点数量。",
          "如果你们特别喜欢《放逐》那类旧澳门气质，就选它。"
        ],
        transport: [
          "酒店 → 亚婆井前地：公交接步行或直接打车。",
          "亚婆井 → 议事亭 / 恋爱巷 / 大三巴：以步行为主。",
          "半岛回路氹：傍晚再坐车，不要中途来回折返。"
        ],
        prep: ["穿舒服的鞋", "预留一点喝水休息时间", "今天更适合广角和街头小场景"],
        stops: [
          { name: "澳门瑞吉酒店", coords: [22.1478, 113.5664] },
          { name: "亚婆井前地附近", coords: [22.1865, 113.5366] },
          { name: "议事亭前地", coords: [22.1936, 113.5399] },
          { name: "恋爱巷", coords: [22.1971, 113.5404] },
          { name: "大三巴牌坊", coords: [22.1977, 113.5409] },
          { name: "大炮台", coords: [22.1979, 113.5424] },
          { name: "路氹酒店区", coords: [22.146, 113.564] }
        ],
        mapNotes: [
          { label: "亚婆井", note: "09:05 开始慢拍旧墙坡道", x: "22%", y: "34%" },
          { label: "议事亭", note: "石板路和街口层次最好", x: "54%", y: "30%" },
          { label: "恋爱巷", note: "彩色立面只停留短一点", x: "72%", y: "44%" },
          { label: "大三巴 / 大炮台", note: "中午前后走完最完整", x: "56%", y: "72%" }
        ],
        mapTrail: [
          { x1: "22%", y1: "34%", x2: "54%", y2: "30%" },
          { x1: "54%", y1: "30%", x2: "72%", y2: "44%" },
          { x1: "72%", y1: "44%", x2: "56%", y2: "72%" }
        ],
        foodNotes: [
          { label: "A Lorcha", note: "海鲜饭和葡式鸡", x: "26%", y: "36%" },
          { label: "António", note: "晚餐延续葡国菜线", x: "64%", y: "50%" },
          { label: "咖啡小歇", note: "下午补水不赶路", x: "42%", y: "76%" }
        ],
        foodCaption: "A 线更像一部旧澳门电影，从坡道、老墙面、葡式午餐一路走到夜里的路氹灯海。"
      },
      {
        id: "b",
        label: "B 方案",
        subtitle: "不去亚婆井，最顺路的澳门半岛 citywalk",
        mapImage: "/treasure/day2b-map.png",
        mapAlt: "澳门 B 方案卷轴地图",
        image: "/treasure/day2-food.png",
        imageAlt: "澳门半岛街头小食卷轴插画",
        color: "#b3834c",
        place: "议事亭前地 / 恋爱巷 / 大三巴 / 大炮台",
        metrics: ["最顺路", "街区体验", "轻松省脑"],
        route: [
          {
            time: "08:00",
            title: "早餐",
            detail: "酒店附近解决，减少早上的决策负担。"
          },
          {
            time: "09:15",
            title: "议事亭前地慢走",
            detail: "先进入最经典的城市中心步行区，拍街景、路面和老店。"
          },
          {
            time: "10:30",
            title: "恋爱巷",
            detail: "短、轻、适合拍照，处理完就往大三巴方向走。"
          },
          {
            time: "11:15",
            title: "大三巴牌坊",
            detail: "重点是“到此一拍”，然后把时间交给周边街区。"
          },
          {
            time: "13:15",
            title: "大炮台 / 澳门博物馆",
            detail: "晴天看城市，热或下雨就进博物馆。"
          },
          {
            time: "15:15",
            title: "咖啡 / 甜品休息",
            detail: "今天路线顺，所以把时间留给慢下来。"
          },
          {
            time: "20:00",
            title: "路氹夜景散步",
            detail: "晚上再回到你们熟悉的酒店区收尾。"
          }
        ],
        meals: [
          { slot: "早餐", name: "酒店附近解决", note: "最省脑，早点出门最好。" },
          { slot: "午餐", name: "黄枝记", note: "虾子捞面、云吞面，很适合最顺路线。" },
          { slot: "晚餐", name: "António / 酒店区餐厅", note: "按当天体力决定，要稳就留在路氹。" }
        ],
        tips: [
          "如果你们不想为了一个点折返，B 就是最好的默认选项。",
          "今天的重点是完整街区感，不是勾掉更多名字。"
        ],
        transport: [
          "酒店 → 半岛片区：公交或车到议事亭前地附近。",
          "议事亭 → 恋爱巷 → 大三巴 → 大炮台：步行最顺。",
          "半岛回路氹：傍晚再回。"
        ],
        prep: ["手机留足电量", "中午前后准备防晒", "今天节奏最适合 citywalk"],
        stops: [
          { name: "澳门瑞吉酒店", coords: [22.1478, 113.5664] },
          { name: "议事亭前地", coords: [22.1936, 113.5399] },
          { name: "恋爱巷", coords: [22.1971, 113.5404] },
          { name: "大三巴牌坊", coords: [22.1977, 113.5409] },
          { name: "大炮台", coords: [22.1979, 113.5424] },
          { name: "澳门博物馆", coords: [22.1981, 113.5425] },
          { name: "路氹酒店区", coords: [22.146, 113.564] }
        ],
        mapNotes: [
          { label: "议事亭", note: "09:15 进入最经典步行区", x: "26%", y: "30%" },
          { label: "恋爱巷", note: "短巷快拍即可", x: "66%", y: "32%" },
          { label: "大三巴", note: "到此一拍再往旁边走", x: "70%", y: "58%" },
          { label: "大炮台", note: "晴天看城市层次", x: "38%", y: "74%" }
        ],
        mapTrail: [
          { x1: "26%", y1: "30%", x2: "66%", y2: "32%" },
          { x1: "66%", y1: "32%", x2: "70%", y2: "58%" },
          { x1: "70%", y1: "58%", x2: "38%", y2: "74%" }
        ],
        foodNotes: [
          { label: "黄枝记", note: "虾子捞面最顺路", x: "30%", y: "32%" },
          { label: "茶咖休息", note: "下午留给慢一点", x: "68%", y: "52%" },
          { label: "晚餐回路氹", note: "按体力决定", x: "46%", y: "78%" }
        ],
        foodCaption: "B 线是最省脑的默认选法，路线紧凑，吃得轻松，留足时间给整段街区的呼吸感。"
      }
    ]
  },
  {
    key: "day-3",
    day: "Day 3",
    date: "4/30 周四",
    title: "澳门 → 香港",
    mood: "最怕手忙脚乱的一天，越是换城，越要让路线清晰优雅。",
    chapter: "换城",
    chapterNote: "上午在海上，下午进入西九与维港。",
    variants: [
      {
        id: "transfer",
        label: "默认线路",
        subtitle: "氹仔码头 → 上环 → M+ → 西九 → 尖沙咀",
        mapImage: "/treasure/day3-map.png",
        mapAlt: "澳门到香港卷轴地图",
        image: "/treasure/day3-food.png",
        imageAlt: "香港换城日美食卷轴插画",
        color: "#4f8eaa",
        place: "氹仔码头 / 上环 / M+ / 维港",
        metrics: ["坐船换城", "M+", "夜景"],
        route: [
          { time: "08:00", title: "早餐与退房", detail: "把证件、船票、充电宝和入住信息全部放到随身包。" },
          { time: "09:00", title: "前往氹仔码头", detail: "公交或短途打车去码头，建议提前 30-45 分钟到。" },
          { time: "10:30", title: "Cotai Water Jet 去香港", detail: "普通舱平日约 MOP/HKD 175；今天的主线是稳，不是快。" },
          { time: "11:30", title: "抵达上环", detail: "从港澳码头前往酒店，先寄存或办理入住。" },
          { time: "14:30", title: "M+", detail: "先在 M+ 看展和建筑，再去海边，不要倒回来。" },
          { time: "17:00", title: "西九海滨", detail: "拍海边和天际线，等傍晚光线慢慢变软。" },
          { time: "19:15", title: "尖沙咀海滨", detail: "把维港夜景放在这一天收下最合适。" }
        ],
        meals: [
          { slot: "午餐", name: "一乐烧鹅", note: "烧鹅饭 / 烧鹅面，换城后第一顿香港味。" },
          { slot: "下午茶", name: "Bakehouse", note: "蛋挞、牛角包和咖啡，是 M+ 前后最舒服的补给。" },
          { slot: "晚餐", name: "鼎泰丰", note: "看完海景前后都顺，小笼包和炒饭都稳。" }
        ],
        tips: ["今天不要再额外加远点，把西九和尖沙咀做完整就够。", "M+ 周五开到 22:00，周一闭馆。"],
        transport: [
          "酒店 → 氹仔码头：公交或短打车。",
          "上环 → 尖东酒店：港铁配短步行最稳。",
          "西九 → 尖沙咀：港铁或短程车连接。"
        ],
        prep: ["船票截图放离线相册", "行李标签绑牢", "下午换轻便背包去西九"],
        stops: [
          { name: "澳门瑞吉酒店", coords: [22.1478, 113.5664] },
          { name: "氹仔码头", coords: [22.1637, 113.5737] },
          { name: "香港上环港澳码头", coords: [22.287, 114.1528] },
          { name: "千禧新世界香港酒店", coords: [22.2982, 114.1784] },
          { name: "M+", coords: [22.302, 114.1594] },
          { name: "西九海滨", coords: [22.3001, 114.1561] },
          { name: "尖沙咀海滨", coords: [22.2939, 114.174] }
        ],
        mapNotes: [
          { label: "氹仔码头", note: "提早 30-45 分钟到", x: "20%", y: "30%" },
          { label: "上环", note: "先寄存行李再进城", x: "54%", y: "28%" },
          { label: "M+", note: "14:30 进馆看展", x: "70%", y: "48%" },
          { label: "维港夜景", note: "尖沙咀收下换城句号", x: "52%", y: "76%" }
        ],
        mapTrail: [
          { x1: "20%", y1: "30%", x2: "54%", y2: "28%" },
          { x1: "54%", y1: "28%", x2: "70%", y2: "48%" },
          { x1: "70%", y1: "48%", x2: "52%", y2: "76%" }
        ],
        foodNotes: [
          { label: "一乐烧鹅", note: "换城后第一顿香港味", x: "24%", y: "30%" },
          { label: "Bakehouse", note: "M+ 前后最好补给", x: "66%", y: "46%" },
          { label: "鼎泰丰", note: "夜景前后都很稳", x: "40%", y: "76%" }
        ],
        foodCaption: "这一天的重点不是赶，而是把坐船、寄存、进馆、海边和夜景串成一条干净的线。"
      }
    ]
  },
  {
    key: "day-4",
    day: "Day 4",
    date: "5/1 周五",
    title: "香港整天",
    mood: "这是香港最浓的一天：高处、坡道、老区、夜街都在同一天里串起来。",
    chapter: "登高",
    chapterNote: "早上看城市层次，晚上把老香港的电影感收进来。",
    variants: [
      {
        id: "hong-kong",
        label: "默认线路",
        subtitle: "天星小轮 + 山顶 + 中环 + 油麻地",
        mapImage: "/treasure/day4-map.png",
        mapAlt: "香港第四天卷轴地图",
        image: "/treasure/day4-food.png",
        imageAlt: "香港茶餐厅与夜市美食卷轴插画",
        color: "#476b58",
        place: "天星小轮 / 山顶 / 中环 / 庙街",
        metrics: ["山顶", "老香港", "夜市"],
        route: [
          { time: "07:30", title: "早餐", detail: "尖沙咀附近茶餐厅快速吃，今天最好早出门。" },
          { time: "08:35", title: "天星小轮去中环", detail: "官方服务信息显示中环线周末及假日成人约 HKD 6.5，航程约 9 分钟。" },
          { time: "09:10", title: "山顶缆车上山", detail: "早点到缆车总站，节假日越晚越拥挤。" },
          { time: "10:30", title: "山顶观景", detail: "不只是去观景台，重点拍城市和海面的层次。" },
          { time: "13:40", title: "中环 → 半山扶梯 → 上环", detail: "中环看新旧并置，半山扶梯拍坡道，上环更生活化。" },
          { time: "15:30", title: "叮叮车一小段", detail: "留一段短短的叮叮车体验，让节奏从高强度转成慢行。" },
          { time: "19:20", title: "旧油麻地警署", detail: "夜色刚起时最有质感，之后接庙街和佐敦正好。" },
          { time: "20:00", title: "庙街 / 佐敦", detail: "夜市、茶餐厅和街口灯牌，是这一天最好的句号。" }
        ],
        meals: [
          { slot: "早餐", name: "尖沙咀茶餐厅", note: "奶茶、多士、通粉 / 面，早点出门比精致早餐重要。" },
          { slot: "午餐", name: "一乐烧鹅 / 中环烧味", note: "山顶下来后在中环解决最顺。" },
          { slot: "晚餐", name: "美都餐室 / 麦文记", note: "美都吃氛围，麦文记吃效率和云吞面。" }
        ],
        tips: ["今天是最容易走多的一天，下午一定要安排短休息。", "山顶晚去会拥挤，也不利于后续中环 citywalk。"],
        transport: [
          "酒店 → 尖沙咀天星码头：步行即可。",
          "中环码头 → 山顶缆车总站：步行上去最顺。",
          "中环 → 上环：步行 + 一小段叮叮车。",
          "中环 / 上环 → 油麻地：港铁回九龙。"
        ],
        prep: ["今天最费脚，鞋和防晒都要准备好", "中午后注意补水", "晚上的拍摄器材尽量轻"],
        stops: [
          { name: "千禧新世界香港酒店", coords: [22.2982, 114.1784] },
          { name: "尖沙咀天星码头", coords: [22.2937, 114.1687] },
          { name: "中环天星码头", coords: [22.2878, 114.1593] },
          { name: "山顶缆车总站", coords: [22.277, 114.1601] },
          { name: "太平山顶", coords: [22.271, 114.149] },
          { name: "半山扶梯", coords: [22.2822, 114.1536] },
          { name: "旧油麻地警署", coords: [22.3098, 114.169] },
          { name: "庙街", coords: [22.3074, 114.1694] }
        ],
        mapNotes: [
          { label: "天星小轮", note: "08:35 从尖沙咀去中环", x: "24%", y: "28%" },
          { label: "山顶缆车", note: "早到才能避开假日人流", x: "68%", y: "24%" },
          { label: "半山扶梯", note: "下午切进上环生活感", x: "58%", y: "54%" },
          { label: "庙街", note: "夜晚回到九龙电影感", x: "34%", y: "78%" }
        ],
        mapTrail: [
          { x1: "24%", y1: "28%", x2: "68%", y2: "24%" },
          { x1: "68%", y1: "24%", x2: "58%", y2: "54%" },
          { x1: "58%", y1: "54%", x2: "34%", y2: "78%" }
        ],
        foodNotes: [
          { label: "茶餐厅早餐", note: "奶茶多士先开场", x: "26%", y: "30%" },
          { label: "中环烧味", note: "山顶下来最顺", x: "64%", y: "48%" },
          { label: "美都 / 麦文记", note: "晚餐在油麻地收尾", x: "44%", y: "76%" }
        ],
        foodCaption: "高处、坡道、叮叮车和夜市全都在这一天里，但节奏要像电影推镜头一样慢慢推进。"
      }
    ]
  },
  {
    key: "day-5",
    day: "Day 5",
    date: "5/2 周六",
    title: "香港 → 杭州",
    mood: "最后一天不做冒险决定，把旅程收得稳、轻、干净。",
    chapter: "归岸",
    chapterNote: "用海滨和早餐收尾，而不是再加一个景点。",
    variants: [
      {
        id: "departure",
        label: "默认线路",
        subtitle: "海滨慢走 → 酒店取行李 → 去机场",
        mapImage: "/treasure/day5-map.png",
        mapAlt: "返程卷轴地图",
        image: "/treasure/day5-food.png",
        imageAlt: "返程早餐卷轴插画",
        color: "#5d5751",
        place: "尖沙咀海滨 / 香港机场",
        metrics: ["收尾", "轻早餐", "误机风险最低"],
        route: [
          { time: "08:00", title: "早餐与整理行李", detail: "把所有充电器、证件、购物小票都再核对一遍。" },
          { time: "09:00", title: "尖沙咀 / 尖东海滨慢走", detail: "只拍几张旅行结尾照，不去新的远点。" },
          { time: "10:00", title: "回酒店取行李", detail: "预留电梯、退房和短暂停顿时间。" },
          { time: "10:20", title: "前往香港机场", detail: "港铁或车去机场都行，重点是稳定。" },
          { time: "11:10", title: "机场值机", detail: "13:55 起飞，今天宁可早，也不要紧。" }
        ],
        meals: [
          { slot: "最稳妥", name: "酒店早餐", note: "不用拖着行李找地方，最适合返程日。" },
          { slot: "轻早午餐", name: "Bakehouse / 海滨咖啡", note: "蛋挞、牛角包和咖啡，想轻松一点就选它。" },
          { slot: "备选", name: "机场简餐", note: "如果市区时间紧，直接去机场吃。" }
        ],
        tips: ["不要为了最后一顿早餐压缩机场时间。", "最后一天的高级感来自从容，而不是再塞一个景点。"],
        transport: [
          "酒店 → 海滨：步行。",
          "酒店 → 机场：港铁 / 机场快线衔接或直接车。"
        ],
        prep: ["前一晚就把液体和充电器整理好", "给手机和相机留返程电量", "重要证件不要放进托运行李"],
        stops: [
          { name: "千禧新世界香港酒店", coords: [22.2982, 114.1784] },
          { name: "尖沙咀海滨", coords: [22.2939, 114.174] },
          { name: "香港机场", coords: [22.308, 113.9185] }
        ],
        mapNotes: [
          { label: "酒店", note: "早餐后核对所有证件", x: "22%", y: "32%" },
          { label: "海滨", note: "最后只散步不加点", x: "56%", y: "44%" },
          { label: "香港机场", note: "11:10 前后开始值机", x: "72%", y: "74%" }
        ],
        mapTrail: [
          { x1: "22%", y1: "32%", x2: "56%", y2: "44%" },
          { x1: "56%", y1: "44%", x2: "72%", y2: "74%" }
        ],
        foodNotes: [
          { label: "酒店早餐", note: "返程日最稳妥", x: "30%", y: "30%" },
          { label: "Bakehouse", note: "想轻一点就买外带", x: "62%", y: "46%" },
          { label: "机场简餐", note: "市区时间紧就直接吃", x: "42%", y: "76%" }
        ],
        foodCaption: "返程日的高级感只来自从容，吃得轻一点，走得稳一点，把最后的海风留在心里。"
      }
    ]
  }
];

function TreasureDaySection({
  entry,
  index,
  isDayTwo,
  dayTwoChoice,
  setDayTwoChoice
}: {
  entry: DayEntry;
  index: number;
  isDayTwo: boolean;
  dayTwoChoice: string;
  setDayTwoChoice: (value: "a" | "b") => void;
}) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const activeVariant = isDayTwo ? entry.variants.find((variant) => variant.id === dayTwoChoice) ?? entry.variants[0] : entry.variants[0];
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const imageY = useTransform(scrollYProgress, [0, 1], [80, -70]);
  const foodY = useTransform(scrollYProgress, [0, 1], [40, -30]);
  const parchmentRotate = useTransform(scrollYProgress, [0, 1], [5, -5]);

  return (
    <motion.section
      className={`treasure-day-section treasure-section-${entry.key}`}
      id={entry.key}
      initial={{ opacity: 0, y: 40 }}
      ref={sectionRef}
      transition={{ duration: 0.75, delay: index * 0.04 }}
      viewport={{ amount: 0.25, once: true }}
      whileInView={{ opacity: 1, y: 0 }}
    >
      <div className="treasure-day-chapter">
        <span>{entry.day}</span>
        <p>{entry.date}</p>
        <strong>{entry.chapter}</strong>
        <em>{entry.chapterNote}</em>
      </div>

      <div className="treasure-day-layout">
        <motion.div className="treasure-media-column" style={{ y: imageY }}>
          <Tilt glareEnable glareMaxOpacity={0.16} perspective={1400} scale={1.02} tiltMaxAngleX={8} tiltMaxAngleY={8}>
            <div className="treasure-map-frame">
              <Image alt={activeVariant.mapAlt} className="treasure-map-art" fill priority={index < 2} sizes="(max-width: 860px) 100vw, 42vw" src={activeVariant.mapImage} />
              <svg aria-hidden="true" className="treasure-map-trail" viewBox="0 0 100 100" preserveAspectRatio="none">
                {activeVariant.mapTrail.map((trail, trailIndex) => (
                  <line
                    key={`${activeVariant.id}-trail-${trailIndex}`}
                    x1={trail.x1}
                    x2={trail.x2}
                    y1={trail.y1}
                    y2={trail.y2}
                  />
                ))}
              </svg>
              <div className="treasure-map-overlay" aria-hidden="true">
                {activeVariant.mapNotes.map((note) => (
                  <article className="treasure-map-note" key={`${activeVariant.id}-${note.label}`} style={{ left: note.x, top: note.y }}>
                    <strong>{note.label}</strong>
                    {note.note ? <span>{note.note}</span> : null}
                  </article>
                ))}
              </div>
              <div className="treasure-map-glow" />
            </div>
          </Tilt>
          <motion.div style={{ y: foodY }}>
            <Tilt glareEnable glareMaxOpacity={0.14} perspective={1300} scale={1.015} tiltMaxAngleX={10} tiltMaxAngleY={10}>
              <div className="treasure-food-frame">
                <Image alt={activeVariant.imageAlt} className="treasure-food-art" fill sizes="(max-width: 860px) 100vw, 36vw" src={activeVariant.image} />
                <div className="treasure-food-overlay" aria-hidden="true">
                  {activeVariant.foodNotes.map((note) => (
                    <article className="treasure-food-tag" key={`${activeVariant.id}-food-${note.label}`} style={{ left: note.x, top: note.y }}>
                      <strong>{note.label}</strong>
                      {note.note ? <span>{note.note}</span> : null}
                    </article>
                  ))}
                </div>
                <div className="treasure-food-caption">
                  <strong>今日味觉线索</strong>
                  <p>{activeVariant.foodCaption}</p>
                </div>
              </div>
            </Tilt>
          </motion.div>
        </motion.div>

        <motion.div className="treasure-copy-column" style={{ rotateX: parchmentRotate }}>
          <div className="treasure-headline">
            <p className="treasure-kicker">{entry.day}</p>
            <h2>{entry.title}</h2>
            <p>{entry.mood}</p>
          </div>

          {isDayTwo ? (
            <div className="treasure-toggle-wrap">
              <div className="treasure-toggle">
                {entry.variants.map((variant) => (
                  <button
                    className={variant.id === dayTwoChoice ? "is-active" : ""}
                    key={variant.id}
                    onClick={() => setDayTwoChoice(variant.id as "a" | "b")}
                    type="button"
                  >
                    <span>{variant.label}</span>
                    <small>{variant.subtitle}</small>
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <AnimatePresence mode="wait">
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              className="treasure-parchment"
              exit={{ opacity: 0, y: 24 }}
              initial={{ opacity: 0, y: 24 }}
              key={`${entry.key}-${activeVariant.id}`}
              transition={{ duration: 0.45, ease: "easeOut" }}
            >
              <div className="treasure-metrics">
                {activeVariant.metrics.map((metric) => (
                  <span key={metric}>{metric}</span>
                ))}
              </div>

              <div className="treasure-route-grid">
                {activeVariant.route.map((step) => (
                  <article className="treasure-step-card" key={`${activeVariant.id}-${step.time}`}>
                    <time>{step.time}</time>
                    <div>
                      <strong>{step.title}</strong>
                      <p>{step.detail}</p>
                    </div>
                  </article>
                ))}
              </div>

              <div className="treasure-detail-grid">
                <div className="treasure-column">
                  <h3>怎么走</h3>
                  <ul>
                    {activeVariant.transport.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div className="treasure-column">
                  <h3>提前准备</h3>
                  <ul>
                    {activeVariant.prep.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="treasure-meal-list">
                {activeVariant.meals.map((meal) => (
                  <article className="treasure-meal-card" key={`${activeVariant.id}-${meal.name}`}>
                    <span>{meal.slot}</span>
                    <strong>{meal.name}</strong>
                    <p>{meal.note}</p>
                  </article>
                ))}
              </div>

              <div className="treasure-route-map-wrap">
                <ItineraryMap color={activeVariant.color} key={activeVariant.id} stops={activeVariant.stops} />
              </div>

              <div className="treasure-tip-strip">
                {activeVariant.tips.map((tip) => (
                  <p key={tip}>{tip}</p>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default function HongKongGuidePage() {
  const [dayTwoChoice, setDayTwoChoice] = useState<"a" | "b">("b");
  const heroFacts = useMemo(() => ["港珠澳大桥跨境", "澳门半岛 A/B 双线", "地图全程可视化", "卷轴藏宝图风格"], []);

  return (
    <main className="treasure-page" id="main">
      <nav className="treasure-nav" aria-label="港澳攻略导航">
        <Link className="treasure-home-link" href="/">
          首页
        </Link>
        <div className="treasure-nav-links">
          <Link href="/travel">攻略总览</Link>
          <a href="#preflight">准备</a>
          <a href="#day-1">Day 1</a>
          <a href="#day-2">Day 2</a>
          <a href="#day-3">Day 3</a>
          <a href="#day-4">Day 4</a>
          <a href="#day-5">Day 5</a>
        </div>
      </nav>

      <section className="treasure-hero">
        <div className="treasure-hero-copy">
          <p className="treasure-hero-kicker">Hong Kong & Macau Treasure Route</p>
          <h1>把这趟港澳旅行，做成一张会发光的藏宝图。</h1>
          <p>
            每一天都是一张完整卷轴：路线、交通、餐厅、准备事项、实时地图和古老地图视觉全部叠在一起。往下滚，就像翻开一段一段旅程。
          </p>
          <div className="treasure-hero-facts">
            {heroFacts.map((fact) => (
              <span key={fact}>{fact}</span>
            ))}
          </div>
        </div>

        <motion.div
          className="treasure-hero-map-shell"
          initial={{ opacity: 0, scale: 0.94, rotateX: 18 }}
          transition={{ duration: 0.9, ease: [0.2, 0.8, 0.2, 1] }}
          whileInView={{ opacity: 1, rotateX: 0, scale: 1 }}
        >
          <Tilt glareEnable glareMaxOpacity={0.18} perspective={1500} scale={1.025} tiltMaxAngleX={8} tiltMaxAngleY={10}>
            <div className="treasure-hero-map">
              <Image alt="港澳五日藏宝图卷轴" fill priority sizes="(max-width: 860px) 100vw, 52vw" src="/treasure/hero-map.png" />
              <div className="treasure-map-overlay treasure-map-overlay-hero" aria-hidden="true">
                {heroMapNotes.map((note) => (
                  <article className="treasure-map-note" key={note.label} style={{ left: note.x, top: note.y }}>
                    <strong>{note.label}</strong>
                    {note.note ? <span>{note.note}</span> : null}
                  </article>
                ))}
              </div>
            </div>
          </Tilt>
        </motion.div>
      </section>

      <section className="treasure-preflight" id="preflight">
        <div className="treasure-preflight-intro">
          <p className="treasure-hero-kicker">Before You Leave</p>
          <h2>出发前，先把真正会影响体验的事准备好。</h2>
          <p>证件、票务、支付、通信和轻装策略都在这里。做好这些，后面每天才会从容。</p>
        </div>

        <div className="treasure-preflight-grid">
          {preparation.map((group) => (
            <motion.article
              className="treasure-preflight-card"
              initial={{ opacity: 0, y: 30 }}
              key={group.title}
              transition={{ duration: 0.55 }}
              viewport={{ amount: 0.2, once: true }}
              whileInView={{ opacity: 1, y: 0 }}
            >
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </motion.article>
          ))}
        </div>

        <div className="treasure-transport-strip">
          {transportFacts.map((item) => (
            <article key={item.title}>
              <span>{item.title}</span>
              <p>{item.body}</p>
            </article>
          ))}
        </div>

        <div className="treasure-principles">
          {travelPrinciples.map((principle) => (
            <span key={principle}>{principle}</span>
          ))}
        </div>
      </section>

      {days.map((entry, index) => (
        <TreasureDaySection
          dayTwoChoice={dayTwoChoice}
          entry={entry}
          index={index}
          isDayTwo={entry.key === "day-2"}
          key={entry.key}
          setDayTwoChoice={setDayTwoChoice}
        />
      ))}

      <section className="treasure-sources">
        <div>
          <p className="treasure-hero-kicker">Sources</p>
          <h2>线路与交通判断的底稿</h2>
        </div>
        <div className="treasure-source-links">
          {sources.map((source) => (
            <a href={source.href} key={source.href} rel="noreferrer" target="_blank">
              {source.label}
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
