export type TripStep = {
  time: string;
  name: string;
  copy: string;
  price: string;
};

export type Stop = {
  time: string;
  name: string;
  intro: string;
  reason: string;
  priceBooking: string;
  transit: string;
  image?: string;
  imageAlt?: string;
};

export type Meal = {
  meal: string;
  name: string;
  copy: string;
  budget: string;
};

export type SourceLink = {
  label: string;
  href: string;
};

export type DayPlan = {
  id: string;
  date: string;
  weekday: string;
  code: string;
  dayTitle: string;
  daySubtitle: string;
  dayLead: string;
  weatherNote: string;
  color: string;
  stops: Stop[];
  meals: Meal[];
  shopping: { title: string; copy: string };
  restNote: string;
  rainPlan: string;
  gallery: { src: string; alt: string; caption: string }[];
  sources: SourceLink[];
};

export const hero = {
  eyebrow: "东京五日自由行",
  title: "港区·山手线·下町",
  lead: "8月14日至18日，以银座为据点，顺向串联城市景观、购物街区与美术馆，留足室内缓冲应对盛夏阵雨。",
  date: "2026年8月14日–18日",
  hotel: "三井花园酒店银座普米尔",
  rate: "统一换算参考：¥100 ≈ RMB 4.17；现场支付以实际汇率为准。"
};

export const arrival = {
  title: "8月14日（周五）· 抵达",
  lead: "NH930 18:10抵达成田T1。首晚不安排购物，只补Suica、饮用水、防晒和次日早餐。",
  steps: [
    {
      time: "18:10–19:44",
      name: "成田T1 → 日暮里（Skyliner）",
      copy: "入境取行李后跟“铁道/Railway”至B1，步行约5分钟。候选班次：18:43（不可执行）、19:03（极紧）、19:23（通关特别快可选）、19:44（稳妥目标）。全车指定席，约40分钟。",
      price: "¥2,580／人（约RMB 108）；线上票按渠道说明换票。"
    },
    {
      time: "19:44–20:30",
      name: "日暮里 → 新桥（JR）",
      copy: "优先JR山手线JY或京滨东北线JK（东京/品川方向），约20–24分钟。",
      price: "¥210（约RMB 9）"
    },
    {
      time: "20:30–21:15",
      name: "新桥站 → 酒店",
      copy: "新桥站银座口步行至酒店约5–10分钟，现实到店约20:45–21:15。",
      price: "免费步行"
    },
    {
      time: "21:15",
      name: "晚餐（首晚）",
      copy: "首选鹤とんたん银座；排队超25分钟换一风堂银座或新桥附近居酒屋。",
      price: "鹤とんたん ¥1,500–2,500／人（约RMB 63–104）；备选 ¥1,200–3,500（约RMB 50–146）"
    }
  ] satisfies TripStep[],
  meal: "晚餐后无购物安排。",
  tip: "雨大或行李多时，日暮里直接打车至酒店，约¥4,500–6,500／车（约RMB 188–271／车）。"
};

export const departure = {
  title: "8月18日（周二）· 返程",
  lead: "NH929 10:05成田T1起飞。提前预约出租车，搭乘首班Skyliner，留足值机与安检时间。",
  steps: [
    {
      time: "04:45",
      name: "房内早餐 + 退房",
      copy: "吃前晚备好的饭团、三明治和水，随后退房。",
      price: "¥600–900／人（约RMB 25–38）"
    },
    {
      time: "05:00–05:25",
      name: "酒店 → 京成上野駅（出租车）",
      copy: "预约出租车，目的地明确为“京成上野駅”，约20–25分钟。",
      price: "¥4,000–5,500／车（约RMB 167–229／车）"
    },
    {
      time: "05:40–06:24",
      name: "京成上野 → 成田T1（Skyliner首班）",
      copy: "指定席，约44分钟。若错过则搭06:00班次，06:44抵达，仍可执行。",
      price: "¥2,580／人（约RMB 108）"
    },
    {
      time: "06:24",
      name: "机场手续与早餐",
      copy: "先值机安检，再补咖啡早餐。机场只补漏买伴手礼，不以免税购物压缩登机时间。",
      price: "早餐 ¥800–1,500／人（约RMB 33–63）"
    }
  ] satisfies TripStep[],
  meal: "房内早餐；机场补第二顿咖啡早餐。",
  tip: "05:40为首选，06:00为备用。"
};

export const bookingItems = [
  {
    urgency: "立即预约",
    name: "8月15日 Ron Mueck展 + Tokyo City View联票",
    copy: "指定16:35前后时段。线上¥4,100／人（约RMB 171），现场¥4,300（约RMB 179）。购后不接受退改。",
    href: "https://www.mori.art.museum/en/news/2026/07/8868/index.html"
  },
  {
    urgency: "已购（无需重复）",
    name: "8月16日 涩谷SKY 17:20入场",
    copy: "前一晚确认天气；即使屋顶因风雨关闭，也按票面时间到场确认室内区域。",
    href: "https://www.shibuya-scramble-square.com/sky/ticket/"
  },
  {
    urgency: "提前办理",
    name: "8月18日 05:40 Skyliner指定席 + 05:00出租车预约",
    copy: "出租车预约时明确“京成上野駅”。",
    href: "https://www.keisei.co.jp/keisei/tetudou/skyliner/us/traffic/skyliner.php"
  },
  {
    urgency: "每晚确认",
    name: "次日天气",
    copy: "重点查看8月15日阵雨、8月16日涩谷SKY屋顶、8月17日雷雨。",
    href: "https://www.jma.go.jp/bosai/forecast/#area_type=offices&area_code=130000"
  }
];

export const essentials = [
  { name: "交通卡", copy: "iPhone可提前将Suica加入钱包，现场亦可购卡。初始充值建议¥5,000–8,000（约RMB 209–334）。" },
  { name: "乘车方式", copy: "用“线路字母+方向+站号”核对，不只凭颜色；Google Maps与站内电子屏对照。错过一班不要逆行奔跑。" },
  { name: "车站指引", copy: "复杂车站先找出口编号；回酒店认新桥JR银座口；返程认京成上野而非JR上野。" },
  { name: "随身物品", copy: "折叠伞、防晒、补水盐糖、轻薄速干衣、备用袜。雷雨时不进屋顶、庭园等开阔区域。" },
  { name: "退税规则", copy: "通常同店含税满¥5,000起，以店内规则为准。护照原件随身，消耗品按封装规则处理。" },
  { name: "餐厅排队", copy: "普通餐厅排队超过20–25分钟即换店。" },
  { name: "信息时效", copy: "页面开放时间、价格与天气核对于2026年8月9日，出发前仍需复查。" }
];

export const days: DayPlan[] = [
  {
    id: "aug15",
    date: "08.15",
    weekday: "周六",
    code: "DAY 02 / MINATO",
    dayTitle: "港区经典与现代",
    daySubtitle: "塔景、美术馆与六本木黄昏",
    dayLead: "从芝公园的经典塔影到麻布台的新天际线，再在六本木的艺术氛围里看东京塔亮灯。全程以室内核心对抗仲夏阵雨，步行与地铁串联，不赶路，不堆点。",
    weatherNote: "8月9日预报：早晨阵雨较强，全天多云，29/24℃。出发前一晚再确认，雨具和备用袜备好。",
    color: "#ff5a3d",
    stops: [
      {
        time: "09:20",
        name: "滨松町步道桥",
        intro: "从3F电梯上桥，可同时拍到东京塔、来往电车与低空飞机。摄影向顺路记录，不作为长时间打卡点。",
        reason: "早晨光线相对柔和，电车与塔身层次分明，适合作为港区首站。",
        priceBooking: "免费，无需预约。",
        transit: "从新桥搭JR一站至滨松町，或视雨势短程打车。",
        image: "/travel/tokyo/rebuild/tokyo-tower.jpg",
        imageAlt: "从芝公园方向看到的东京塔"
      },
      {
        time: "10:15",
        name: "芝公园 + 增上寺",
        intro: "芝公园草坪与增上寺境内是东京塔的经典取景区域，寺院建筑与铁塔可自然同框。",
        reason: "顺路、免费，不用专门安排和服或深度参拜，沿动线看景即可。",
        priceBooking: "公园及寺院境内免费，无需预约。",
        transit: "滨松町步行约1.5公里；若先到赤羽桥，也可反向完成这一段。"
      },
      {
        time: "11:20",
        name: "赤羽桥 E21 出口",
        intro: "出口附近人行道是近距离仰拍东京塔的顺路机位，通常有人停留。",
        reason: "与芝公园的开阔角度互补；看到空档拍两张即走，不为机位排队。",
        priceBooking: "免费，无需预约。",
        transit: "按当天导航步行；遇雨可直接删去这一机位。"
      },
      {
        time: "12:00",
        name: "麻布台之丘",
        intro: "现代复合街区由低层建筑、中央绿地与塔楼组成，室内动线适合午间休息，设计与生活方式店铺可顺路浏览。",
        reason: "位于东京塔与六本木之间，承担午餐、购物和恢复体力三项任务，盛夏或阵雨时尤其合适。",
        priceBooking: "公共区域免费；餐饮另付。34F限定芭菲¥2,000，另收每人¥500服务费，至少¥2,500／人（约RMB 104），不接受预约。",
        transit: "从赤羽桥按地图步行；大雨时短程打车，或由神谷町站进入街区。"
      },
      {
        time: "14:20",
        name: "国立新美术馆",
        intro: "黑川纪章设计的波浪形玻璃立面建筑，建筑入馆免费。ROND咖啡厅位于中庭倒锥体上方，与《你的名字。》场景有视觉关联。",
        reason: "建筑本身就是当日美术馆体验，咖啡厅可作为下午第二个坐下休息点。",
        priceBooking: "建筑入馆免费。可选特展“Picasso, through the Eyes of Paul Smith”成人¥2,400（约RMB 100）；晚间还看Ron Mueck时不必强行加展。",
        transit: "麻布台之丘前往六本木方向；大雨时优先地铁或短程打车。",
        image: "/travel/tokyo/rebuild/national-art-center.jpg",
        imageAlt: "国立新美术馆玻璃立面"
      },
      {
        time: "16:35",
        name: "Ron Mueck + Tokyo City View",
        intro: "先在森美术馆看Ron Mueck，再到52F观景台等东京塔进入黄昏和蓝调时刻。展期为4月29日至9月23日。",
        reason: "展览与观景在同一栋楼完成，减少雨天转场；黄昏是当天唯一需要锁定的视觉高点。",
        priceBooking: "联票线上¥4,100（约RMB 171），现场¥4,300（约RMB 179）。指定时段，建议提前在线购买，购后不可退改。",
        transit: "国立新美术馆前往六本木之丘森大楼，按导航步行；雨大时短程打车。"
      }
    ],
    meals: [
      { meal: "早餐", name: "筑地场外市场或酒店附近", copy: "玉子烧、海鲜饭或简餐，控制在30分钟内，不把早餐排得过满。", budget: "¥800–2,000／人（约RMB 33–83）" },
      { meal: "午餐", name: "麻布台之丘", copy: "先在餐饮区选择日式定食或面食；34F限定芭菲只作可选，不用为了景观打乱午餐。", budget: "¥1,500–3,500／人（约RMB 63–146）" },
      { meal: "晚餐", name: "六本木区域（三选一）", copy: "首选Butagumi西麻布炸猪排，建议预约；未订到转鹤とんたん六本木乌冬；雨大或走累时直接选六本木Hills B2的AFURI无现金门店。", budget: "¥1,200–4,500／人（约RMB 50–188）" }
    ],
    shopping: { title: "麻布台之丘短暂购物", copy: "只安排30–45分钟给设计与生活方式店铺，不堆购物点，以休息和补货为主。" },
    restNote: "午餐后坐满30分钟；国立新美术馆ROND咖啡厅可作为下午第二休息点。",
    rainPlan: "保留麻布台之丘、国立新美术馆、森大楼三个室内核心；滨松町、芝公园、赤羽桥三处户外拍摄按雨势压缩。",
    gallery: [
      { src: "/travel/tokyo/rebuild/tokyo-tower.jpg", alt: "芝公园方向的东京塔", caption: "芝公园一带的塔景方向" },
      { src: "/travel/tokyo/rebuild/national-art-center.jpg", alt: "国立新美术馆", caption: "把建筑本身作为美术馆体验" }
    ],
    sources: [
      { label: "Ron Mueck联票与退改规则", href: "https://www.mori.art.museum/en/news/2026/07/8868/index.html" },
      { label: "国立新美术馆特展票价", href: "https://www.nact.jp/exhibition_special/2026/picasso_paulsmith/" },
      { label: "麻布台之丘夏季芭菲", href: "https://www.azabudai-hills.com/whats_on/2026/06/0364.html" }
    ]
  },
  {
    id: "aug16",
    date: "08.16",
    weekday: "周日",
    code: "DAY 03 / WEST LINE",
    dayTitle: "新宿·原宿·表参道·涩谷",
    daySubtitle: "从基础款到设计师街区，顺向移动直到涩谷黄昏",
    dayLead: "新宿看日常选品，原宿读街头灵感，表参道以建筑空间过渡，涩谷在PARCO与SKY完成潮流和景观的收束。全程JR山手线顺向串联，不回头。",
    weatherNote: "8月9日预报：早间零星小雨后转多云，31/24℃。出发前一晚再确认，雨具随身。",
    color: "#2f63ff",
    stops: [
      {
        time: "09:45",
        name: "新宿站周边",
        intro: "新宿站是东京最复杂的城市枢纽之一，站前街景只作短暂停留，不为广告屏或路口额外绕路。",
        reason: "购物开门前先熟悉出口和方向，给当天顺向移动一个稳定起点。",
        priceBooking: "免费，无需预约。",
        transit: "从银座一带乘地铁至新宿，跟出口编号移动。"
      },
      {
        time: "10:30",
        name: "BEAMS新宿（Lumine Est B2）",
        intro: "店铺位于Lumine Est地下二层，以干净、基础、易穿的日本日常选品为主，周末10:30–21:00。",
        reason: "作为新宿唯一购物锚点，风格稳定，适合快速锁定日常单品。",
        priceBooking: "店铺免费进入；购物按个人预算，无需预约。",
        transit: "新宿站内步行至Lumine Est。"
      },
      {
        time: "12:10",
        name: "Laforet原宿",
        intro: "Laforet原宿聚集设计师品牌、街头、亚文化与古着灵感店铺，营业11:00–20:00；店内拍照先征得同意。",
        reason: "与新宿的基础款形成清楚差异，用一个商场理解原宿的多元风格。",
        priceBooking: "店铺免费进入；购物按个人预算，无需预约。",
        transit: "新宿站乘JR山手线至原宿站，步行前往。"
      },
      {
        time: "14:20",
        name: "Cat Street + 表参道之丘",
        intro: "Cat Street把街头品牌与咖啡穿插在步行里；表参道之丘由安藤忠雄设计，内部坡道与店铺共同构成连续空间，店铺与咖啡营业至20:00。",
        reason: "把街头散步、建筑观看和20分钟坐下休息合并在同一段，不增加回头路。",
        priceBooking: "公共区域免费；购物与餐饮另付，无需预约。",
        transit: "Laforet原宿步行进入Cat Street，再沿表参道方向前行。"
      },
      {
        time: "15:35",
        name: "涩谷PARCO",
        intro: "涩谷PARCO聚集潮流、日韩与国际品牌，6F为Nintendo、Pokémon等主题区域。建议只挑2–3层，控制约60分钟。",
        reason: "风格和品类高度集中，能在不失控的时间里完成涩谷购物。",
        priceBooking: "店铺免费进入；购物按个人预算，无需预约。",
        transit: "从表参道步行或乘地铁到涩谷；16:35前必须离店。"
      },
      {
        time: "17:20",
        name: "涩谷SKY（固定入场）",
        intro: "涩谷站上方的高层观景空间，是当天唯一不可移动的节点。16:50左右到14F入口，先整理随身物品；大包和易被风吹走的物品需寄存。",
        reason: "17:20覆盖日光、黄昏和入夜的变化，作为全天视觉收束最合适。",
        priceBooking: "已购票，无需重复购买。参考票价：线上¥3,400（约RMB 142），现场¥3,700（约RMB 154）；屋顶可能因天气关闭。",
        transit: "涩谷PARCO步行到涩谷Scramble Square，至少提前30分钟离店。",
        image: "/travel/tokyo/rebuild/shibuya.jpg",
        imageAlt: "夜间涩谷十字路口"
      },
      {
        time: "20:20",
        name: "涩谷十字路口",
        intro: "晚间十字路口作为返程途经点，记录城市流动即可，不专门等空位或高机位。",
        reason: "晚餐后自然经过，用最少时间完成涩谷夜景的最后一段。",
        priceBooking: "免费，无需预约。",
        transit: "晚餐后步行经过，随后乘银座线返回银座。"
      }
    ],
    meals: [
      { meal: "早餐", name: "酒店或银座附近", copy: "简单早餐，控制在30分钟内。", budget: "¥800–1,800／人（约RMB 33–75）" },
      { meal: "午餐", name: "Maisen青山本店", copy: "炸猪排作为午餐首选；若排队过长，直接换表参道沿线简餐。", budget: "首选¥1,800–3,500／人（约RMB 75–146）；备选¥1,200–2,500（约RMB 50–104）" },
      { meal: "晚餐", name: "涩谷区域（二选一）", copy: "首选鱼べい涩谷道玄坂回转寿司；备选涩谷PARCO B1 CHAOS KITCHEN。任意一家排队超过20分钟即换店。", budget: "¥1,200–3,000／人（约RMB 50–125）" }
    ],
    shopping: { title: "分区购物定位", copy: "新宿看干净基础款；原宿看设计师、街头、亚文化与古着灵感；涩谷看更完整的潮流、日韩和国际品牌。每区只保留一个锚点。" },
    restNote: "午餐后或表参道之丘坐满20分钟；涩谷SKY前补水，整理随身物品。",
    rainPlan: "保留BEAMS、Laforet、表参道之丘、涩谷PARCO、涩谷SKY五个室内节点；Cat Street和十字路口按雨势缩短。",
    gallery: [
      { src: "/travel/tokyo/rebuild/shibuya.jpg", alt: "夜间涩谷十字路口", caption: "17:20固定票决定全天节奏" }
    ],
    sources: [
      { label: "涩谷SKY购票与注意事项", href: "https://www.shibuya-scramble-square.com/sky/ticket/" },
      { label: "涩谷PARCO营业信息", href: "https://shibuya.parco.jp/info/facilities/" },
      { label: "Laforet原宿营业信息", href: "https://www.laforet.ne.jp/guide/" }
    ]
  },
  {
    id: "aug17",
    date: "08.17",
    weekday: "周一",
    code: "DAY 04 / EAST TOKYO",
    dayTitle: "东东京·下町与秋叶原·银座",
    daySubtitle: "浅草寺参道、秋叶原效率逛街，银座收尾",
    dayLead: "早间顺路拍晴空塔，浅草完成江户下町轴线，午后秋叶原按类别定点，傍晚回银座补文具、设计品与百货。户外节点随时可缩短。",
    weatherNote: "8月9日预报：闷热多云，早间有雷雨、午后可能强阵雨，30/24℃。出发前一晚必须再确认。",
    color: "#f0bd2f",
    stops: [
      {
        time: "09:00",
        name: "曳舟站东口附近",
        intro: "住宅街与铁路尺度中的晴空塔视角，不是买票登塔点。找到合适角度拍完即走。",
        reason: "顺路记录东京东侧的城市尺度，作为浅草前的短过渡。",
        priceBooking: "免费，无需预约。",
        transit: "银座一带乘地铁与东武线前往，具体换乘当天用导航确认；随后搭东武晴空塔线到浅草。",
        image: "/travel/tokyo/rebuild/skytree-hikifune.jpg",
        imageAlt: "曳舟站与晴空塔"
      },
      {
        time: "10:00",
        name: "浅草寺（雷门→仲见世→本堂）",
        intro: "雷门、仲见世参道与浅草寺本堂构成完整的江户下町参拜轴线。核心是寺院与街区氛围，不安排和服拍摄。",
        reason: "路线清楚、无需绕行，一次完成浅草最具代表性的历史空间。",
        priceBooking: "境内及本堂免费；仲见世购物餐饮另付，无需预约。",
        transit: "从东武浅草站步行进入雷门。",
        image: "/travel/tokyo/rebuild/sensoji.jpg",
        imageAlt: "浅草寺本堂"
      },
      {
        time: "11:10",
        name: "浅草文化观光中心",
        intro: "隈研吾设计的木格栅立面建筑，8F免费观景露台可俯瞰仲见世并远望晴空塔；设施09:00–20:00，露台09:00–22:00。",
        reason: "免费、室内、有高度，既避开地面人流，也能作为浅草段的休整点。",
        priceBooking: "免费，无需预约。",
        transit: "从浅草寺沿仲见世返回雷门，过街即到。"
      },
      {
        time: "13:20",
        name: "上野公园（可选支线）",
        intro: "只走树荫与不忍池一段，控制45分钟；馆舍各自售票，本行程不额外安排第二个美术馆。",
        reason: "天气和体力合适时增加一段绿荫；雷雨或更想购物时直接跳过。",
        priceBooking: "公园免费；馆舍各自售票。",
        transit: "浅草站乘银座线至上野；取消时直接去末广町或秋叶原。"
      },
      {
        time: "14:25",
        name: "秋叶原三小时路线",
        intro: "按PDF方向依次经过Radio Kaikan、namco、GiGO、Bic Camera、Akiba Cultures Zone、Animate主店。四类重点分别是模型手办、街机、电器退税与动漫出版周边。",
        reason: "用明确品类代替每店逛满，三小时内仍能保留休息和转场。",
        priceBooking: "街区和店铺免费进入；游戏与购物另付，无需预约。",
        transit: "上野乘JR山手线到秋叶原；若跳过上野，可从浅草乘银座线到末广町。",
        image: "/travel/tokyo/rebuild/akihabara.jpg",
        imageAlt: "夜间秋叶原电器街"
      },
      {
        time: "17:45",
        name: "银座伊东屋 G.Itoya",
        intro: "整栋以文具、纸品、书写工具和旅行用品分层陈列，选品有日本本土特色，体积小、方便带回国。周一参考营业10:00–20:00。",
        reason: "与秋叶原形成清楚品类差异，是银座购物最值得保留的一站。",
        priceBooking: "免费进入；购物另付，无需预约。",
        transit: "秋叶原乘JR到有乐町后步行，或乘地铁到银座。",
        image: "/travel/tokyo/rebuild/ginza.jpg",
        imageAlt: "夜间银座主街"
      },
      {
        time: "18:30",
        name: "ISSEY MIYAKE GINZA / 442",
        intro: "银座4-4-2的四层旗舰店，以品牌全线产品和空间陈列为重点，营业11:00–20:00。",
        reason: "作为设计师品牌方向的单一锚点，与伊东屋、百货食品形成层次。",
        priceBooking: "免费进入；购物另付。个别新品发售可能预约或限流，临近日期查看官方通知。",
        transit: "从伊东屋按地图步行约一小段。"
      },
      {
        time: "19:05",
        name: "松屋银座",
        intro: "银座主力百货之一，地下食品层适合补伴手礼，也可集中补齐当天遗漏品牌。",
        reason: "作为当日最后一站百货，集中收尾，不重复逛同类。",
        priceBooking: "免费进入；购物另付，退税按商场规则。参考营业至20:00。",
        transit: "从ISSEY MIYAKE步行前往，20:00前结束购物。"
      }
    ],
    meals: [
      { meal: "早餐", name: "酒店或银座附近", copy: "简单早餐，控制在30分钟内。", budget: "¥700–1,600／人（约RMB 29–67）" },
      { meal: "午餐", name: "浅草荞麦或天妇罗", copy: "首选并木薮荞麦或附近同类店；排队超过20分钟，直接换观光中心至浅草站之间的高分店。", budget: "¥1,200–3,000／人（约RMB 50–125）" },
      { meal: "晚餐", name: "银座区域（二选一）", copy: "首选Ginza Lion Beer Hall；备选银座篝鸡白汤拉面或附近拉面。排队超过20分钟换店。", budget: "¥1,500–4,500／人（约RMB 63–188）" }
    ],
    shopping: { title: "分区购物分工", copy: "秋叶原负责电器、模型和动漫；银座负责文具、设计师品牌与百货食品。两者分工明确，不回头。" },
    restNote: "浅草午餐后坐满20分钟；秋叶原16:00左右再休息20分钟。",
    rainPlan: "保留浅草文化观光中心、秋叶原商场、伊东屋、ISSEY MIYAKE、松屋银座。曳舟只在雨小窗口拍摄；浅草寺缩短；上野公园直接取消。",
    gallery: [
      { src: "/travel/tokyo/rebuild/skytree-hikifune.jpg", alt: "曳舟站与晴空塔", caption: "曳舟只作10分钟摄影窗口" },
      { src: "/travel/tokyo/rebuild/sensoji.jpg", alt: "浅草寺本堂", caption: "雷门—仲见世—本堂一条轴线" },
      { src: "/travel/tokyo/rebuild/akihabara.jpg", alt: "夜间秋叶原", caption: "按品类而不是按店铺数量控制时间" },
      { src: "/travel/tokyo/rebuild/ginza.jpg", alt: "夜间银座主街", caption: "文具、设计师品牌与百货食品收尾" }
    ],
    sources: [
      { label: "浅草文化观光中心开放时间", href: "https://www.city.taito.lg.jp/bunka_kanko/kankoinfo/info/oyakudachi/kankocenter/a-tic-gaiyo.html" },
      { label: "ISSEY MIYAKE GINZA / 442", href: "https://www.isseymiyake.com/blogs/stores/130" },
      { label: "银座伊东屋营业信息", href: "https://www.ito-ya.co.jp/ext/store/ginza/" }
    ]
  }
];

export const imageCredits = [
  { label: "东京塔", author: "Ymblanter", license: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Tokyo_Tower_seen_from_Shiba_Park.jpg" },
  { label: "国立新美术馆", author: "Jmho", license: "CC0 1.0", href: "https://commons.wikimedia.org/wiki/File:Nac_tokyo.jpg" },
  { label: "涩谷十字路口", author: "Christophe95", license: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Shibuya_Crossing_in_Tokyo.jpg" },
  { label: "曳舟站与晴空塔", author: "Nesnad", license: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Hikifunestation-platform-andskytree-april28-2015.jpg" },
  { label: "浅草寺本堂", author: "Daderot", license: "Public domain", href: "https://commons.wikimedia.org/wiki/File:Main_building,_Sensoji_Temple,_Asakusa,_Tokyo.jpg" },
  { label: "秋叶原夜景", author: "ElHeineken", license: "CC BY 4.0", href: "https://commons.wikimedia.org/wiki/File:Akihabara_Night.jpg" },
  { label: "银座主街", author: "Christophe95", license: "CC BY-SA 4.0", href: "https://commons.wikimedia.org/wiki/File:Ginza_Main_Street.jpg" }
];
