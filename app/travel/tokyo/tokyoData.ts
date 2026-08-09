export type SourceLink = {
  label: string;
  href: string;
  kind?: "xiaohongshu" | "official";
};

export type Stop = {
  time: string;
  name: string;
  intro: string;
  reason: string;
  priceBooking: string;
  transit: string;
  howTo: string;
  tips: string;
  image?: string;
  imageAlt?: string;
  imageCredit?: string;
  sources: SourceLink[];
};

export type Meal = {
  meal: string;
  name: string;
  copy: string;
  budget: string;
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
};

const xhs = (noteId: string, label = "小红书实拍"): SourceLink => ({
  label,
  href: `https://www.xiaohongshu.com/explore/${noteId}`,
  kind: "xiaohongshu"
});

const official = (label: string, href: string): SourceLink => ({ label, href, kind: "official" });

export const hero = {
  eyebrow: "东京五日自由行",
  title: "港区·山手线·下町",
  lead: "8月14日至18日，以银座为据点，顺向串联城市景观、购物与美术馆，留足室内缓冲应对盛夏阵雨。",
  date: "2026年8月14日–18日",
  hotel: "三井花园酒店银座普米尔",
  flight: "NH930 抵达 / NH929 返程",
  rate: "统一换算：¥100 ≈ RMB 4.17；现场支付以实际汇率为准。"
};

export const days: DayPlan[] = [
  {
    id: "aug14",
    date: "08.14",
    weekday: "周五",
    code: "DAY 01 / ARRIVAL",
    dayTitle: "抵达东京",
    daySubtitle: "成田机场至银座，首晚只做必要补给",
    dayLead: "NH930 18:10抵达成田T1。把19:44的Skyliner作为稳妥目标，预计20:45–21:15抵达酒店。",
    weatherNote: "8月14日预报：潮湿有雨，30/24℃。落地后先看实时雷达，雨具放在随手可取的位置。",
    color: "#e95b3f",
    stops: [
      {
        time: "18:10–19:44",
        name: "成田T1 → 日暮里（Skyliner）",
        intro: "取完行李后跟随“铁道 / Railway”标识到B1成田机场站，步行约5分钟。Skyliner全车指定席，约40分钟到日暮里。",
        reason: "座位固定、行李位明确，是成田进入东京市区最省心的方式。",
        priceBooking: "¥2,580/人（约RMB108）。线上票需按购买渠道指引在现场换取指定席。",
        transit: "成田机场站 → 日暮里站",
        howTo: "18:43无法赶上；19:03极紧；19:23只在通关特别快时选；以19:44为基准。出关后直接下B1，先确认班次再进站。",
        tips: "全车指定席，不要只买票却忘记确认班次与座位。",
        sources: [xhs("68ba7921000000001d0289d4", "Skyliner乘车实拍"), official("京成Skyliner", "https://www.keisei.co.jp/keisei/tetudou/skyliner/us/traffic/skyliner.php")]
      },
      {
        time: "19:44–20:30",
        name: "日暮里 → 新桥（JR）",
        intro: "日暮里换JR山手线JY或京滨东北线JK，选择东京、品川方向，约20–24分钟到新桥。",
        reason: "换乘一次即可抵达酒店最近的JR枢纽，不必执着常磐线。",
        priceBooking: "¥210/人（约RMB9），Suica直接刷卡。",
        transit: "日暮里站 → 新桥站",
        howTo: "出Skyliner后找JR换乘闸口，站台屏幕确认“东京 / 品川方向”再上车。",
        tips: "京成与JR是不同闸口；行李多时跟电梯标识走，不抢末班。",
        sources: [xhs("68bc0578000000001d02b79d", "日暮里换乘参考"), xhs("66babadf000000001e01e330", "日暮里站内参考")]
      },
      {
        time: "20:30–21:15",
        name: "新桥站 → 酒店",
        intro: "从新桥站银座口出站，步行约550米至三井花园酒店银座普米尔。",
        reason: "路线短，沿途便利店多，方便完成首晚补给。",
        priceBooking: "步行免费；日暮里直接打车约¥4,500–6,500/车（约RMB188–271）。",
        transit: "新桥站银座口 → 酒店",
        howTo: "认准“银座口”，出站后沿银座方向步行；若大雨或行李太多，在日暮里直接打车到酒店。",
        tips: "酒店入口位于高层建筑内，接近定位后留意三井花园酒店标识。",
        sources: [official("酒店交通", "https://www.gardenhotels.co.jp/ginza-premier/eng/access/")]
      }
    ],
    meals: [
      { meal: "早餐·午餐", name: "航班前自理", copy: "杭州段不纳入东京安排；登机前吃饱，避免落地后空腹换乘。", budget: "按个人安排" },
      { meal: "晚餐", name: "鹤とんたん银座 / 一风堂银座 / 新桥居酒屋", copy: "首选乌冬；排队超过25分钟就换一风堂，想吃烤串则留在新桥选Google Maps近期高分居酒屋。", budget: "¥1,200–3,500/人（约RMB50–146）" }
    ],
    shopping: { title: "只买首晚必需品", copy: "补Suica、饮用水、防晒和次日早餐；不安排正式购物。" },
    restNote: "晚餐后直接回酒店，洗澡、整理第二天随身包，尽量23:00前睡。",
    rainPlan: "雨大或行李多时，日暮里直接打车到酒店，取消新桥步行。"
  },
  {
    id: "aug15",
    date: "08.15",
    weekday: "周六",
    code: "DAY 02 / MINATO",
    dayTitle: "东京塔、麻布台与六本木黄昏",
    daySubtitle: "从经典塔影走入现代街区，再用美术馆与观景台收束",
    dayLead: "上午顺路拍东京塔，午间在麻布台之丘休整，下午看国立新美术馆建筑，傍晚在六本木完成Ron Mueck展和东京塔蓝调。",
    weatherNote: "8月15日预报：早晨强阵雨，午后多云，29/24℃。前一晚复查；户外三站都可按雨势缩短。",
    color: "#ff5a3d",
    stops: [
      {
        time: "09:20",
        name: "滨松町步道桥",
        intro: "JR滨松町北口外的过街天桥，3F可同时拍到东京塔、山手线与京滨东北线列车，偶尔还有低空飞机入画。",
        reason: "这是摄影向的顺路开场，塔、铁路和城市楼群能自然叠在同一画面里。",
        priceBooking: "免费，无需预约。",
        transit: "新桥搭JR山手线或京滨东北线1站至滨松町，出北口。",
        howTo: "出北口后找过街天桥，搭电梯到3F；面向东京塔方向，等一班列车通过即可。停留20–30分钟。",
        tips: "天桥是公共通道，不架三脚架、不挡行人；雨大直接删去。",
        image: "/travel/tokyo/xhs/hamamatsucho.png",
        imageAlt: "滨松町步道桥上的东京塔与电车视角",
        imageCredit: "小红书 @gyc",
        sources: [xhs("65e31191000000000102bf49", "实拍：滨松町塔景"), xhs("699914db0000000009039ee8", "步道桥方位参考")]
      },
      {
        time: "10:10",
        name: "芝公园 + 增上寺",
        intro: "芝公园草坪与增上寺境内构成东京塔最经典的前景：绿地、寺院屋檐与红白塔身一次看完。",
        reason: "免费、顺路、构图变化丰富，不需要穿和服，也不必为网红机位排队。",
        priceBooking: "公园和寺院境内免费，无需预约。",
        transit: "滨松町步行约20分钟；雨势较大可短程打车。",
        howTo: "先到芝公园开阔草坪看塔，再经三解脱门进入增上寺，走到本堂前完成寺塔同框。全段约45–60分钟。",
        tips: "本堂是宗教空间，保持安静；人多时从参道侧边取景，不在正中长时间停留。",
        image: "/travel/tokyo/xhs/shiba-zojoji.png",
        imageAlt: "芝公园和增上寺一带的东京塔",
        imageCredit: "小红书 @企鹅魔法使",
        sources: [xhs("6a5e10e7000000001c010396", "实拍：芝公园与增上寺"), xhs("689560d800000000250166cc", "步行顺序参考")]
      },
      {
        time: "11:20",
        name: "赤羽桥站附近人行道",
        intro: "都营大江户线赤羽桥站（站号E21）附近的合法人行道，可以近距离仰拍东京塔。",
        reason: "与芝公园的开阔角度互补，塔身更近、压迫感更强，顺路经过拍几张即可。",
        priceBooking: "免费，无需预约。",
        transit: "从增上寺步行约10–15分钟。",
        howTo: "朝赤羽桥站方向走，在开阔人行道找不挡路的位置，拍2–3张后继续去麻布台。",
        tips: "E21是车站编号，不是出口名；不要进入车道，也不用为某一块地砖排队。",
        image: "/travel/tokyo/xhs/akabanebashi.png",
        imageAlt: "赤羽桥站附近近距离仰拍东京塔",
        imageCredit: "小红书 @苏苏没烦恼",
        sources: [xhs("6a1b8ee800000000380203c0", "实拍：赤羽桥塔景"), xhs("691301ae0000000007030ed8", "赤羽桥机位参考")]
      },
      {
        time: "12:00",
        name: "麻布台之丘",
        intro: "由森JP Tower、低层建筑与中央绿地组成的复合街区，午间可一次解决空调、用餐、休息和少量购物。",
        reason: "位于东京塔与六本木之间，正好承担当天的体力恢复，不必专门绕路。",
        priceBooking: "公共区域免费。34F Sky Room Café & Bar芭菲¥2,000–4,200，6岁以上每人另收¥500服务费；每人至少点一份甜品，不接受预约和选座。",
        transit: "赤羽桥步行约15分钟；雨大或体力不足可打车约5–10分钟。没有“麻布台站”，地铁最近为神谷町或六本木一丁目。",
        howTo: "先在低层餐饮区吃午饭，再留30–45分钟逛生活方式店。想上34F，从森JP Tower 1F找S2电梯直达；B1不能直上34F。",
        tips: "34F是餐饮体验，不是长期免费观景台。排队长就留在低层，不为一杯甜品打乱下午行程。",
        image: "/travel/tokyo/xhs/azabudai-hills.png",
        imageAlt: "麻布台之丘绿地和现代建筑",
        imageCredit: "小红书 @走向绿色",
        sources: [xhs("68d36c5900000000130196e6", "实拍：麻布台之丘"), xhs("67b70a02000000000e007c69", "街区动线参考"), official("34F芭菲活动", "https://hillshouse-collection.com/parfait")]
      },
      {
        time: "14:20",
        name: "国立新美术馆",
        intro: "黑川纪章设计的波浪玻璃建筑。公共空间、餐厅、咖啡厅、商店和艺术图书馆都不需要展票。",
        reason: "建筑本身就是完整体验；2F Salon de Thé ROND还能让下午真正坐下来休息。",
        priceBooking: "建筑公共区域免费。可选“Picasso meets Paul Smith”特展成人当日票¥2,400（约RMB100）；周二闭馆。",
        transit: "麻布台之丘步行约25分钟；盛夏更建议打车约10分钟，约¥1,200–1,800/车（约RMB50–75）。乃木坂站6号出口直连B1。",
        howTo: "先看一层波浪玻璃中庭，再上2F ROND咖啡厅休息20分钟（11:00–18:00，L.O.17:30）。对特展确有兴趣再购票，别为了凑项目进展厅。",
        tips: "当天傍晚还有Ron Mueck展，艺术体力有限就只看建筑和咖啡厅。",
        image: "/travel/tokyo/xhs/national-art-center.png",
        imageAlt: "国立新美术馆波浪形玻璃中庭",
        imageCredit: "小红书 @Tmj",
        sources: [xhs("691af764000000000503a9c2", "实拍：国立新美术馆"), xhs("67f1f4da000000001202cf18", "馆内动线参考"), official("餐厅与咖啡厅", "https://www.nact.jp/shop/restaurant_cafe.html"), official("Picasso特展", "https://www.nact.jp/exhibition_special/2026/picasso_paulsmith/")]
      },
      {
        time: "16:20",
        name: "Ron Mueck展 + Tokyo City View",
        intro: "六本木Hills森塔内，先到53F看Ron Mueck展，再到52F Tokyo City View等东京塔进入黄昏和蓝调。",
        reason: "展览与观景在同一栋楼完成，减少转场；黄昏是全天最值得锁定的视觉时段。",
        priceBooking: "联票线上¥4,100/人（约RMB171），现场¥4,300（约RMB179）。线上指定时段且购后不退改；现场仅在余票时出售。",
        transit: "国立新美术馆步行约10–12分钟到六本木Hills森塔。",
        howTo: "16:20前到森塔3F“美术馆・展望台 Ticket / Information”扫码或换票，搭专用电梯。联票顺序固定：先53F Ron Mueck，再去52F观景台；约18:15开始等蓝调。",
        tips: "不要把麻布台34F攻略当作六本木入口。大包按现场要求寄存，室外区域是否开放以天气为准。",
        image: "/travel/tokyo/xhs/tokyo-city-view.png",
        imageAlt: "Tokyo City View看东京塔的黄昏视角",
        imageCredit: "小红书 @亭纸同学旅行日记",
        sources: [xhs("67b4932e000000001203d226", "实拍：六本木塔景"), official("联票与参观顺序", "https://www.mori.art.museum/en/news/2026/07/8868/index.html"), official("Tokyo City View到访指南", "https://art-view.roppongihills.com/en/info/index.html")]
      }
    ],
    meals: [
      { meal: "早餐", name: "筑地场外 / 酒店附近", copy: "玉子烧、海鲜饭或简餐，排队超过15分钟就换店，45分钟内结束。", budget: "¥800–2,000/人（约RMB33–83）" },
      { meal: "午餐", name: "麻布台之丘", copy: "首选低层日式定食或面食；34F芭菲只作为可选体验，不用为了景观耽误下午行程。", budget: "¥1,500–3,500/人（约RMB63–146）" },
      { meal: "晚餐", name: "六本木三选一", copy: "首选Butagumi西麻布炸猪排（建议预约）；备选鹤とんたん六本木乌冬；雨大或疲劳就选六本木Hills B2的AFURI。", budget: "¥1,200–4,500/人（约RMB50–188）" }
    ],
    shopping: { title: "麻布台之丘短逛", copy: "只给设计与生活方式店30–45分钟，以补货和散步为主，不逐店扫货。" },
    restNote: "麻布台午餐后坐满30分钟；国立新美术馆咖啡厅再休息20分钟；傍晚观景前补水。",
    rainPlan: "压缩或取消滨松町、芝公园、赤羽桥，保留麻布台之丘、国立新美术馆、森塔三个室内核心。"
  },
  {
    id: "aug16",
    date: "08.16",
    weekday: "周日",
    code: "DAY 03 / WEST TOKYO",
    dayTitle: "新宿、原宿、表参道至涩谷",
    daySubtitle: "从日常选品走向街头设计，黄昏交给SHIBUYA SKY",
    dayLead: "沿山手线顺向移动，不跨去新宿西口，不绕竹下通。17:20的SHIBUYA SKY是当天唯一固定节点。",
    weatherNote: "8月16日预报：早间零星小雨后转多云，31/24℃。午后注意补水，前一晚确认屋顶开放信息。",
    color: "#2f63ff",
    stops: [
      {
        time: "09:45–10:30",
        name: "新宿站东侧",
        intro: "新宿东口、LUMINE EST与JR闸口集中在同一侧，适合先建立方位感，再等商店开门。",
        reason: "新宿站很复杂，先认出口能避免之后在地下通道来回折返。",
        priceBooking: "免费。",
        transit: "银座站搭丸之内线往荻窪方向至新宿，跟“东口 / LUMINE EST”标识出站。",
        howTo: "出东口后依次确认LUMINE EST入口、JR山手线闸口、去原宿的乘车方向；只看站前街景，不跨去西口。",
        tips: "LUMINE EST与南口LUMINE 1/2、NEWoMan不是同一栋，别跟着“LUMINE”三个字走错。",
        image: "/travel/tokyo/xhs/shinjuku-station.png",
        imageAlt: "新宿站东侧街景",
        imageCredit: "小红书 @詹涛学弟",
        sources: [xhs("69819c59000000000a02af6d", "实拍：新宿街景"), xhs("68cbf318000000001300e24b", "新宿东侧方位参考")]
      },
      {
        time: "10:30",
        name: "BEAMS新宿（LUMINE EST B2）",
        intro: "LUMINE EST地下二层的BEAMS，男女装、鞋包与日常选品集中，并提供免税服务。",
        reason: "新宿购物只设这一个锚点，品牌稳定、挑选效率高。",
        priceBooking: "免费进入，购物按个人预算；退税以商场规则为准。",
        transit: "新宿站东口直连LUMINE EST，下至B2。周末及节假日10:30–21:00。",
        howTo: "先逛B2 BEAMS，再按楼层导览挑真正感兴趣的一层；总时长控制在60–75分钟。逛完原路回JR闸口。",
        tips: "不要顺手跨商场；护照原件随身，结账前确认能否合并退税。",
        image: "/travel/tokyo/xhs/beams-shinjuku.png",
        imageAlt: "BEAMS新宿店购物动线",
        imageCredit: "小红书 @MaruMaruJAPAN",
        sources: [xhs("671a3386000000001b03f6b7", "实拍：BEAMS新宿"), official("LUMINE EST店铺信息", "https://www.lumine.ne.jp/est/floorguide/detail/?scd=002234")]
      },
      {
        time: "12:10",
        name: "Laforet原宿",
        intro: "原宿代表性的时尚商场，设计师、街头、亚文化和古着灵感集中，楼层编号里还有B1.5。",
        reason: "和新宿的日常选品形成明显反差，适合快速读懂原宿风格。",
        priceBooking: "免费进入，购物按个人预算。",
        transit: "新宿搭JR山手线往涩谷/品川方向至原宿，出东口后沿表参道步行5–8分钟。",
        howTo: "从B1.5、1F开始，最多再选1–2层重点逛；总时长控制在50分钟，随后去青山午餐。",
        tips: "竹下通不在当天路线里；店内拍照先问工作人员。",
        image: "/travel/tokyo/xhs/laforet-harajuku.png",
        imageAlt: "Laforet原宿商场外观",
        imageCredit: "小红书 @熹大喵",
        sources: [xhs("6797628b0000000029013b69", "实拍：Laforet原宿"), xhs("689d32f9000000001d027221", "楼层参考")]
      },
      {
        time: "14:20",
        name: "表参道之丘 + Cat Street",
        intro: "先在安藤忠雄设计的连续坡道空间休息，再沿Cat Street南向走到涩谷；沿途以街头品牌、独立店和咖啡为主。",
        reason: "建筑与步行街自然串联，既能看空间，也不会为摄影额外绕路。",
        priceBooking: "公共区域免费；购物与餐饮另付。",
        transit: "Laforet沿表参道步行至表参道之丘，再从神宫前一带切入Cat Street南行。",
        howTo: "午饭后先在表参道之丘室内坐20分钟，沿坡道看建筑；出馆后只挑2–3家店，顺着Cat Street一直往宫下公园方向走。",
        tips: "Cat Street中段没有地铁入口；太热或雨大，从表参道站搭银座线到涩谷，或直接短程打车。",
        image: "/travel/tokyo/xhs/catstreet-omotesando.png",
        imageAlt: "表参道之丘的建筑空间",
        imageCredit: "小红书 @海岛",
        sources: [xhs("66d16514000000001f03d9c8", "实拍：表参道之丘"), xhs("66f933d4000000001902fa1f", "Cat Street路线参考")]
      },
      {
        time: "15:35",
        name: "涩谷PARCO",
        intro: "潮流品牌与IP内容高度集中的商场，6F的Nintendo TOKYO、Pokémon Center等最适合定点浏览。",
        reason: "风格集中、楼层主题清楚，是涩谷购物最省时间的一站。",
        priceBooking: "免费进入，购物按个人预算。普通楼层通常11:00–21:00；6F部分店铺10:00–21:00。",
        transit: "Cat Street南端经宫下公园步行约10–15分钟。",
        howTo: "先直上6F，再选另外1–2层；16:35必须离店，步行去Scramble Square。",
        tips: "不要逐层扫；PARCO到SHIBUYA SKY仍需步行12–15分钟。",
        image: "/travel/tokyo/xhs/shibuya-parco.png",
        imageAlt: "涩谷PARCO六层动漫与IP区域",
        imageCredit: "小红书 @牙牙的异想世界",
        sources: [xhs("69db54fb000000001a02c3d6", "实拍：涩谷PARCO 6F"), xhs("68176e0e000000002100d7fd", "楼层动线参考"), official("PARCO设施信息", "https://shibuya.parco.jp/info/facilities/")]
      },
      {
        time: "16:50",
        name: "SHIBUYA SKY（17:20固定入场）",
        intro: "涩谷Scramble Square 14F检票，46F设室内观景区与屋顶。17:20可覆盖日景、黄昏和入夜。",
        reason: "这是当天唯一不可移动的节点，天气允许时能完整看见东京从白天转入蓝调。",
        priceBooking: "已购票。参考价：15:00后线上¥3,400/人（约RMB142），现场¥3,700（约RMB154）。",
        transit: "从PARCO步行12–15分钟；找馆外1F、靠涩谷Hikarie一侧的SHIBUYA SKY专用电梯到14F。",
        howTo: "16:50抵达14F。到46F先把包、帽子、耳机、三脚架和自拍杆存柜；屋顶只带手机，以及有肩带或能放入口袋的相机。先看日景，再等蓝调。",
        tips: "不要走到涩谷Hikarie 11F的Sky Lobby。屋顶因风雨关闭时，46F室内观景区仍可使用。",
        image: "/travel/tokyo/xhs/shibuya-sky.png",
        imageAlt: "SHIBUYA SKY黄昏天空与城市",
        imageCredit: "小红书 @静香学姐",
        sources: [xhs("68e62f13000000000702263f", "实拍：SHIBUYA SKY黄昏"), xhs("68ff75d100000000050380b0", "入口路线参考"), official("官方交通与入口", "https://www.shibuya-scramble-square.com/sky/access/"), official("票价与携带规则", "https://www.shibuya-scramble-square.com/sky/ticket/")]
      },
      {
        time: "20:20",
        name: "涩谷十字路口",
        intro: "夜间广告灯牌与穿行人流构成涩谷最典型的城市画面。",
        reason: "从观景台回车站必经，地面拍几张就能完成当天的夜景收尾。",
        priceBooking: "免费。",
        transit: "Scramble Square步行约3分钟，经路口进入涩谷站。",
        howTo: "按绿灯正常穿越，选一次人流较完整的过街过程拍摄；随后从涩谷站搭银座线回银座。",
        tips: "不站在路中央回头拍，不为高机位排队；地面视角已经足够。",
        image: "/travel/tokyo/xhs/shibuya-crossing.png",
        imageAlt: "夜间涩谷十字路口",
        imageCredit: "小红书 @樱桃大丸子",
        sources: [xhs("69d0c719000000001a02b113", "实拍：涩谷十字路口"), xhs("69f73bc2000000003502f672", "夜景参考")]
      }
    ],
    meals: [
      { meal: "早餐", name: "酒店或银座附近", copy: "咖啡、吐司或日式早餐，30分钟内完成。", budget: "¥800–1,800/人（约RMB33–75）" },
      { meal: "午餐", name: "Maisen青山本店", copy: "首选炸猪排；排队超过20分钟就换表参道沿线简餐，别牺牲下午休息时间。", budget: "¥1,800–3,500/人（约RMB75–146）" },
      { meal: "晚餐", name: "鱼べい涩谷 / PARCO B1", copy: "看完SKY后首选鱼べい道玄坂；若不想绕路，直接在PARCO B1 CHAOS KITCHEN选店。", budget: "¥1,200–3,000/人（约RMB50–125）" }
    ],
    shopping: { title: "三段式购物", copy: "新宿买日常基础款，原宿看设计师与街头风格，涩谷看潮流和IP；每区只保留一个主店。" },
    restNote: "午餐后或表参道之丘内坐20分钟；去SHIBUYA SKY前补水并整理随身物品。",
    rainPlan: "缩短Cat Street与十字路口；表参道至PARCO可打车。室内保留BEAMS、Laforet、表参道之丘、PARCO和SHIBUYA SKY。"
  },
  {
    id: "aug17",
    date: "08.17",
    weekday: "周一",
    code: "DAY 04 / EAST TOKYO",
    dayTitle: "浅草下町、秋叶原与银座收尾",
    daySubtitle: "早间拍晴空塔，午后按品类逛秋叶原，傍晚回银座",
    dayLead: "曳舟只做顺路摄影，浅草走完雷门到本堂的下町轴线，秋叶原按四类店定点，最后以文具、设计师品牌和百货食品收束。",
    weatherNote: "8月17日预报：早间雷雨、午后可能强阵雨，约30/24℃。前一晚必须复查；上野公园为可删支线。",
    color: "#d49b00",
    stops: [
      {
        time: "09:00",
        name: "曳舟站东口附近",
        intro: "曳舟站东口外的合法人行道可拍晴空塔与电车同框，这里不是登塔入口。",
        reason: "城市尺度和铁路元素比晴空塔脚下更完整，适合作为浅草前的短暂停留。",
        priceBooking: "免费，无需预约。",
        transit: "东银座搭都营浅草线往押上方向至押上，换东武晴空塔线1站到曳舟，出东口。",
        howTo: "出站后沿晴空塔方向找开阔人行道，只在公共区域停留10–20分钟；拍到一班列车就走。",
        tips: "不进轨道、不踩私有地；雷雨时直接取消。",
        image: "/travel/tokyo/xhs/hikifune-skytree.png",
        imageAlt: "曳舟站附近电车与晴空塔同框",
        imageCredit: "小红书 @风的星球",
        sources: [xhs("6810c22b000000002100ee5c", "实拍：曳舟与晴空塔"), xhs("681cc84b000000002202568e", "机位方位参考")]
      },
      {
        time: "10:00",
        name: "浅草寺：雷门 → 仲见世 → 本堂",
        intro: "雷门、仲见世、宝藏门与本堂构成完整的江户下町参拜轴线，两侧支路比主街更从容。",
        reason: "路线天然单向，不用穿和服或追机位，也能把浅草核心体验走完整。",
        priceBooking: "境内与本堂免费；小吃和购物另付。",
        transit: "曳舟搭东武晴空塔线到浅草，步行至雷门。",
        howTo: "从雷门进入，沿仲见世到宝藏门和本堂；参拜后从侧边街道返回雷门方向。主街拥挤就走两侧平行街。",
        tips: "只挑1–2种小吃；是否可边走边吃以店家规定为准。",
        image: "/travel/tokyo/xhs/sensoji.png",
        imageAlt: "浅草寺雷门与仲见世参道",
        imageCredit: "小红书 @我不爱喝冰美式",
        sources: [xhs("6890317e00000000250211a1", "实拍：浅草寺顺向路线"), xhs("69dcd65f00000000230254a4", "浅草步行参考")]
      },
      {
        time: "11:10",
        name: "浅草文化观光中心",
        intro: "隈研吾设计的木格栅建筑，8F免费观景露台能俯瞰仲见世并远望晴空塔。",
        reason: "免费、顺路、能避开地面人流，也是浅草段最舒服的短暂休息点。",
        priceBooking: "免费，无需预约。设施09:00–20:00，8F露台09:00–22:00。",
        transit: "从本堂沿仲见世返回雷门，过马路即到。",
        howTo: "进门后搭电梯直达8F，先从长窗看仲见世中轴，再去露台看晴空塔；停留20–30分钟。",
        tips: "入口容易被当成商店，认准中英文建筑名；雷雨时听从露台关闭安排。",
        image: "/travel/tokyo/xhs/asakusa-culture-center.png",
        imageAlt: "浅草文化观光中心木格栅外观",
        imageCredit: "小红书 @浅草文化观光中心",
        sources: [xhs("66c6a26f000000001d01a18e", "实拍：浅草文化观光中心"), official("开放时间与设施", "https://www.city.taito.lg.jp/bunka_kanko/kankoinfo/info/oyakudachi/kankocenter/a-tic-gaiyo.html")]
      },
      {
        time: "13:20",
        name: "上野公园（可选）",
        intro: "只走公园入口至不忍池一段，以树荫和水面为主，不再临时增加馆舍。",
        reason: "它是浅草与秋叶原之间的放松支线，体力或天气不合适就跳过。",
        priceBooking: "公园免费；各馆舍另售票，本行程不入馆。",
        transit: "浅草搭银座线至上野，出公园口。",
        howTo: "公园入口→不忍池→近路回JR上野，总计控制在45分钟。14:05前必须离开。",
        tips: "雷雨、闷热或更想逛秋叶原时，直接取消，不影响主线。",
        image: "/travel/tokyo/xhs/ueno-park.png",
        imageAlt: "上野公园不忍池夏季水面",
        imageCredit: "小红书 @放梦",
        sources: [xhs("6a77251a0000000029032f94", "实拍：上野公园不忍池"), xhs("6a5b8c410000000008009c01", "公园步行参考")]
      },
      {
        time: "14:25",
        name: "秋叶原",
        intro: "电器、模型、动漫和街机密集，但只按四类逛：手办、街机、电器退税、动漫IP。",
        reason: "用固定顺序代替逐栋扫楼，三小时足够看清兴趣点，也给晚上的银座留体力。",
        priceBooking: "街区和店铺免费；游戏与购物另付。",
        transit: "上野搭JR山手线或京滨东北线到秋叶原，认“电气街口”；跳过上野时从浅草搭银座线至上野再转JR。",
        howTo: "电气街口→Radio Kaikan（手办）→namco或GiGO二选一（街机20–30分钟）→Akiba Cultures Zone→Bic Camera（电器）→Animate（IP）。16:00坐下喝水20分钟。",
        tips: "买电器前确认电压、保修和退税；成人用品楼仅18+可选，未成年人直接跳过；不逐层逛满。",
        image: "/travel/tokyo/xhs/akihabara.png",
        imageAlt: "秋叶原动漫与电器街区",
        imageCredit: "小红书 @团团是一个团",
        sources: [xhs("69bfd0710000000023026662", "实拍：秋叶原分区"), xhs("67d2e9db000000001d039e6a", "三小时步行路线")]
      },
      {
        time: "17:45",
        name: "银座伊东屋 G.Itoya",
        intro: "银座2丁目的12层文具专门店，纸品、书写工具和旅行用品按楼层清楚分区。",
        reason: "日本本土文具体积小、好带回国，与秋叶原的购物品类完全不重复。",
        priceBooking: "免费进入，购物另付。",
        transit: "秋叶原搭JR山手线至有乐町，出京桥口步行8–10分钟。",
        howTo: "先看入口楼层导览，直奔纸品、书写工具或旅行用品层；控制在35分钟。",
        tips: "全楼12层，不要逐层扫；购买钢笔墨水等液体时考虑托运限制。",
        image: "/travel/tokyo/xhs/ginza-itoya.png",
        imageAlt: "银座伊东屋文具陈列",
        imageCredit: "小红书 @藤椒寿司SUSHI",
        sources: [xhs("67ab12d00000000029009d95", "实拍：银座伊东屋"), xhs("6a69d807000000001002b47b", "楼层参考"), official("银座本店楼层", "https://www.ito-ya.co.jp/ext/store/ginza/")]
      },
      {
        time: "18:30",
        name: "ISSEY MIYAKE GINZA / 442",
        intro: "位于银座4-4-2的四层旗舰店，集中呈现品牌多个产品线。",
        reason: "作为设计师品牌重点，只看真正感兴趣的系列，不与百货重复。",
        priceBooking: "免费进入，购物另付；新品发售可能预约或限流。",
        transit: "从伊东屋沿中央通往银座4丁目方向步行6–8分钟。",
        howTo: "进店后先问目标系列所在楼层，按需浏览30分钟；临近出发查看官方发售通知。",
        tips: "限定发售和热门款可能限流，不能把现场一定有货当作前提。",
        image: "/travel/tokyo/xhs/issey-miyake-ginza.png",
        imageAlt: "ISSEY MIYAKE GINZA 442店铺设计",
        imageCredit: "小红书 @陆俊毅_设计现场",
        sources: [xhs("64ddfacc000000001201930d", "实拍：GINZA 442"), xhs("68185c30000000000303fd79", "店铺参考"), official("官方店铺信息", "https://www.isseymiyake.com/blogs/stores/130")]
      },
      {
        time: "19:05",
        name: "松屋银座",
        intro: "银座主力百货，地下食品层适合集中购买伴手礼，也能补齐遗漏品牌。",
        reason: "距离酒店近，适合作为购物收尾，不必再跨区。",
        priceBooking: "免费进入，购物另付；退税以商场当日规则为准。",
        transit: "从GINZA 442步行3–5分钟。",
        howTo: "优先B1地下食品、伴手礼和一两个遗漏品牌；20:00准时结束，步行回酒店。",
        tips: "百货常在20:00左右结束营业，不要卡点进店；生鲜与冷藏品先确认能否带回国。",
        image: "/travel/tokyo/xhs/matsuya-ginza.png",
        imageAlt: "松屋银座地下食品层",
        imageCredit: "小红书 @小白日记",
        sources: [xhs("68d13575000000000b013909", "实拍：松屋银座食品层"), xhs("68400adf000000000303f21c", "百货购物参考"), official("松屋银座", "https://www.matsuya.com/ginza/")]
      }
    ],
    meals: [
      { meal: "早餐", name: "酒店或银座附近", copy: "简单早餐，30分钟内完成。", budget: "¥700–1,600/人（约RMB29–67）" },
      { meal: "午餐", name: "浅草荞麦 / 天妇罗", copy: "首选并木薮荞麦或同类老店；排队超过20分钟就换雷门至浅草站之间的备选。", budget: "¥1,200–3,000/人（约RMB50–125）" },
      { meal: "晚餐", name: "Ginza Lion / 银座篝", copy: "想吃洋食选Ginza Lion；想快一点选银座篝鸡白汤拉面或附近拉面。", budget: "¥1,500–4,500/人（约RMB63–188）" }
    ],
    shopping: { title: "品类清楚，不回头", copy: "秋叶原负责电器、模型与IP；银座负责文具、设计师品牌与百货食品。" },
    restNote: "浅草午餐后坐20分钟；秋叶原16:00再休息20分钟；银座购物结束后直接回酒店。",
    rainPlan: "曳舟取消、浅草寺缩短、上野公园删除；保留观光中心、秋叶原室内商场、伊东屋、GINZA 442和松屋银座。"
  },
  {
    id: "aug18",
    date: "08.18",
    weekday: "周二",
    code: "DAY 05 / DEPARTURE",
    dayTitle: "返程日",
    daySubtitle: "首班Skyliner直达成田，先值机再吃早餐",
    dayLead: "NH929 10:05起飞。04:45退房，预约出租车至京成上野，搭05:40首班Skyliner，06:24抵达成田T1。",
    weatherNote: "8月18日预报：潮湿有雨，30/25℃。前一晚请酒店确认出租车，雨具放在行李外侧。",
    color: "#101114",
    stops: [
      {
        time: "04:45–05:00",
        name: "房内早餐 + 退房",
        intro: "吃前一晚备好的饭团或三明治和水，随后退房。",
        reason: "清晨市区餐厅选择少，房内完成最稳妥。",
        priceBooking: "¥600–900/人（约RMB25–38）。",
        transit: "酒店内",
        howTo: "前一晚买好早餐；04:35起床，04:45吃完并完成最后检查。",
        tips: "确认护照、充电器、退税商品和Skyliner车票。",
        sources: []
      },
      {
        time: "05:00–05:25",
        name: "酒店 → 京成上野站（出租车）",
        intro: "直接去Skyliner始发站，目的地是“京成上野駅”，不是JR上野站。",
        reason: "清晨带行李少换乘，时间最可控。",
        priceBooking: "¥4,000–5,500/车（约RMB167–229），建议前一晚请酒店预约。",
        transit: "酒店 → 京成上野站",
        howTo: "04:55到大堂，向司机出示“京成上野駅”。到站后直接找Skyliner检票口。",
        tips: "不要只说“上野站”，否则可能被送到JR一侧。",
        sources: [xhs("69245ad5000000001b031d4e", "清晨返机场参考")]
      },
      {
        time: "05:40–06:24",
        name: "京成上野 → 成田T1（Skyliner）",
        intro: "05:40首班Skyliner，44分钟直达成田机场第一航站楼。",
        reason: "06:24到机场，给10:05航班留出充分的值机、安检和步行时间。",
        priceBooking: "¥2,580/人（约RMB108），全车指定席。",
        transit: "京成上野站 → 成田T1",
        howTo: "提前购买05:40班次。若错过，搭06:00班次，06:44抵达，仍能执行，但不要再停留购物。",
        tips: "上车前再次核对终点为Narita Airport Terminal 1。",
        sources: [official("Skyliner时刻表", "https://new-www.keisei.co.jp/keisei/tetudou/skyliner/jp/traffic/skyliner_timetable.php")]
      },
      {
        time: "06:24–10:05",
        name: "值机、安检与登机",
        intro: "抵达T1后先办理值机托运和安检，再去登机口附近补咖啡早餐。",
        reason: "先把不可逆的手续完成，之后的时间才真正可控。",
        priceBooking: "机场简餐¥800–1,500/人（约RMB33–63）。",
        transit: "成田T1航站楼内",
        howTo: "查看航司柜台→托运→安检→确认登机口→再吃东西。",
        tips: "机场只补漏买的小件伴手礼，不用免税购物压缩登机时间。",
        sources: [official("成田机场T1", "https://www.narita-airport.jp/en/map/?terminal=1")]
      }
    ],
    meals: [
      { meal: "第一早餐", name: "房内饭团 / 三明治", copy: "前一晚便利店购买，04:45吃完。", budget: "¥600–900/人（约RMB25–38）" },
      { meal: "第二早餐", name: "成田机场咖啡简餐", copy: "值机安检后再补咖啡、面包或三明治。", budget: "¥800–1,500/人（约RMB33–63）" },
      { meal: "午餐·晚餐", name: "航班及返程段", copy: "离开东京后不再安排市区餐饮。", budget: "按航班与个人安排" }
    ],
    shopping: { title: "只补漏买伴手礼", copy: "完成值机和安检后再买，控制在小件和明确清单内。" },
    restNote: "8月17日晚提前打包并尽早睡，返程日不再设置市区停留。",
    rainPlan: "酒店到京成上野全程出租车，时间不变；给上车和搬运行李多留5分钟。"
  }
];

export const bookingItems = [
  {
    urgency: "尽快购买",
    name: "8月15日 Ron Mueck展 + Tokyo City View联票",
    copy: "建议选择16:00–16:30附近时段。线上¥4,100/人（约RMB171），指定时段且购后不退改。",
    href: "https://www.mori.art.museum/en/news/2026/07/8868/index.html"
  },
  {
    urgency: "已购",
    name: "8月16日 SHIBUYA SKY 17:20",
    copy: "前一晚确认屋顶天气；即使屋顶关闭，也按票面时间到场使用46F室内区域。",
    href: "https://www.shibuya-scramble-square.com/sky/ticket/"
  },
  {
    urgency: "提前办理",
    name: "8月18日 05:40 Skyliner + 05:00出租车",
    copy: "Skyliner提前锁定指定席；出租车请酒店前台协助预约，目的地写清“京成上野駅”。",
    href: "https://new-www.keisei.co.jp/keisei/tetudou/skyliner/jp/traffic/skyliner_timetable.php"
  },
  {
    urgency: "每晚确认",
    name: "次日天气与室外设施",
    copy: "重点看8月15日晨间阵雨、8月16日SHIBUYA SKY屋顶、8月17日雷雨。",
    href: "https://www.jma.go.jp/bosai/forecast/#area_type=offices&area_code=130000"
  }
];

export const essentials = [
  { name: "交通卡", copy: "iPhone可提前把Suica加入钱包，现场也可购卡。初始充值建议¥5,000–8,000（约RMB209–334）。" },
  { name: "复杂车站", copy: "同时核对线路字母、行车方向和站号，不只看颜色。先找出口编号，再跟站内电子屏确认。" },
  { name: "回酒店", copy: "认新桥站JR银座口；返机场认京成上野，不是JR上野。错过一班车不要逆行奔跑。" },
  { name: "盛夏随身", copy: "折叠伞、防晒、补水盐糖、轻薄速干衣、备用袜。雷雨时不进入屋顶和开阔庭园。" },
  { name: "退税", copy: "通常同店含税满¥5,000起，以店内规则为准。护照原件随身，消耗品按封装要求处理。" },
  { name: "排队上限", copy: "普通餐厅排队超过20–25分钟就换店；当天固定票务优先于任何餐厅。" },
  { name: "信息时效", copy: "天气、票价与开放时间核对于2026年8月9日；出发前和到访当天再看官方通知。" }
];

export const imageCredits = days.flatMap((day) =>
  day.stops
    .filter((stop) => stop.image && stop.imageCredit)
    .map((stop) => ({
      place: stop.name,
      credit: stop.imageCredit as string,
      src: stop.image as string,
      href: stop.sources.find((source) => source.kind === "xiaohongshu")?.href ?? "https://www.xiaohongshu.com/"
    }))
);
