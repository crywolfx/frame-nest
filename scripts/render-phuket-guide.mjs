import fs from 'node:fs';import path from 'node:path';import vm from 'node:vm';import {createRequire} from 'node:module';import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');const require=createRequire(root+'/package.json');const ts=require('typescript');
const filename=root+'/app/travel/phuket-bangkok-2026/guideData.ts';const mod={exports:{}};vm.runInNewContext(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,{require:createRequire(filename),exports:mod.exports,module:mod,encodeURIComponent});
const d=mod.exports;const base=root+'/guides/phuket-bangkok-2026';
const itinerary=d.days.map((day,i)=>i===4?d.elephantDay:day);
const fmt=(v)=>v.replaceAll('|','／');
let out='# 普吉岛 → 曼谷 · 七日慢旅行\n\n2026年9月27日—10月3日 · 两位成人 · 10月4日00:15抵达杭州\n\n五晚海岛，一晚曼谷。泰国时间比中国慢1小时；航班标注出发地与到达地当地时间。餐饮与活动价格为每人，฿1≈¥0.20。\n\n';
out+='## 七日总览\n\n| 日期 | 行程 | 住宿 |\n|---|---|---|\n'+itinerary.map((x,i)=>`| ${x.date} ${x.weekday} | ${x.title} | ${i===6?'返程':d.hotels[x.hotel].zh} |`).join('\n')+'\n\n';
out+='## 三间酒店\n\n'+d.hotels.map(h=>`### ${h.zh} · ${h.en}\n\n${h.dates} · ${h.area}\n\n${h.description}\n\n${h.address} · [导航](${d.map(h.en)}) · [官网](${h.url})\n\n`).join('');
for(const [i,x]of itinerary.entries()){
 out+=`## ${x.date} ${x.weekday} · ${x.title}\n\n${x.intro}\n\n**天气：**${x.temp}C，${x.weather}。${x.wind}；${x.wave}。${x.weatherNote}（气温9月25日复核；区域海况9月24日发布，未覆盖日期另行标注）\n\n`;
 for(const st of x.stops)out+=`### ${st.time} · ${st.title}\n\n${st.en?st.en+' · ':''}${st.type}\n\n${st.body}${st.query?` [地图](${d.map(st.query)})`:''}\n\n`;
 out+=`**用餐备选：**${x.mealIds.map(id=>{let p=d.places.find(p=>p.id===id);return `${p.zh}（${p.en}）`}).join('、')}。\n\n**出行提示：**${x.note}\n\n**雨天安排：**${x.rain}\n\n`;
 if(i===1)out+='**登岛选项：**先珊瑚岛登岛、岛上午餐，再到皇帝岛海域不登岛；订单提示珊瑚岛费฿100≈¥20。若皇帝岛登岛，则改船上午餐、乘码头长尾船接驳，订单提示฿1,000≈¥200；出发前向船商核对费用单位、往返口径和套餐包含项。\n\n';
 if(i===4){out+='### 两条午餐路线\n\n'+d.routeChoices.map(r=>`**${r.title}** · ${r.sequence.join(' → ')}\n\n${r.distance}。${r.note} [完整路线](${d.routeLink(r.waypoints)})\n\n`).join('');out+='### 备选方案：上午丛林飞跃\n\n'+d.days[4].stops.map(st=>`- **${st.time} · ${st.title}**：${st.body}\n`).join('')+'\n下午若选喂象，午餐改为12:30–13:10，13:15出发，14:00–15:30体验，16:30–17:00回酒店。射击、喂象、回酒店三选一。\n\n';}
}
out+='## 餐厅与按摩备选\n\n芭东、卡塔、曼谷餐厅与按摩Google资料采集于9月24日；查龙午餐及海景咖啡于9月25日核对；距离及车程为规划参考。\n\n';
for(const [group,title,hotel] of [['P','芭东晚餐','格雷斯兰'],['K','卡塔午晚餐','The Shore'],['L','游玩点周边品质午餐','The Shore'],['B','曼谷吃喝','日航'],['M','芭东按摩','格雷斯兰']]){
 out+=`### ${title} · 距${hotel}酒店\n\n`;
 for(const p of d.places.filter(p=>p.group===group))out+=`#### ${p.zh} · ${p.en}\n\n${p.category} · Google ${p.rating}／${p.reviews.toLocaleString()}条${p.reviews<500?' · 酒店内便利备选':''}\n\n${p.why}\n\n- 人均：${p.thb} ≈ ${p.cny}\n- 距离：${p.distance}\n- 位置：${p.address}\n- 营业：${p.hours}\n- ${group==='M'?'项目':'推荐菜'}：${p.menu}\n${p.route?`- 路线：${p.route}\n`:''}- [地图与评价](${p.map})${p.sources.map(v=>` · [${v.label}](${v.url})`).join('')}\n\n`;
}
out+='## 海景咖啡 · 五选一\n\n综合首选桑摩尔，少坐车选毯子与枕头。每次只去一家，留一小时慢坐。以下含提供咖啡的海景餐厅，评分范围4.3–4.6，均超过500条Google评价；预算按咖啡加点心估算。\n\n';
for(const c of d.cafes)out+=`### ${c.zh} · ${c.en}\n\n${c.rank} · ${c.kind} · Google ${c.rating}／${c.reviews.toLocaleString()}条\n\n${c.why}\n\n- 人均：${c.price}\n- 推荐点单：${c.order}\n- 距酒店：${c.distance}\n- 地址：${c.address}\n- 营业：${c.hours}\n- 适合何时去：${c.when}\n- 拥挤与舒适度：${c.crowd}\n- ${c.threshold}\n- [地图与评价](${d.map(c.en+' Phuket')}) · ${c.sources.map(v=>`[${v.label}](${v.url})`).join(' · ')}\n\n`;
out+='## 三类体验\n\n活动票价为成人单价，接送、摄影等按套餐条款。10月1日主选上午布吉大象营、射击与品质午餐；备选上午飞象EP2，下午选择一个短体验。\n\n';
for(const [kind,title]of [['zipline','丛林飞跃 · 四家比较'],['shooting','射击 · 五家比较'],['elephant','大象体验 · 五家比较']]){
 out+=`### ${title}\n\n`;
 for(const a of d.activities.filter(a=>a.kind===kind))out+=`#### ${a.zh} · ${a.en}\n\n${a.pick?'**本次路线首选** · ':''}${a.rating} · 适配分${a.score}/100\n\n${a.reason}\n\n- 价格：${a.price}\n- 时长：${a.duration}\n- 距The Shore：${a.distance}\n- 时间：${a.hours}\n- 套餐：${a.packages}\n- 等待与节奏：${a.queue}\n- [产品与价格](${a.url}) · [地图](${d.map(a.en)})\n\n`;
 out+='| 地点 | 距离 | 时间 | '+(kind==='elephant'?'喂食匹配':kind==='shooting'?'套餐清晰':'套餐体验')+' | 排队 | 价值 | 刺激 | 总分 |\n|---|---:|---:|---:|---:|---:|---:|---:|\n'+d.activities.filter(a=>a.kind===kind).map(a=>`| ${a.zh} | ${a.scores.join(' | ')} | ${a.score} |`).join('\n')+'\n\n';
}
out+='各项0–10分，飞跃与射击总分为六项平均×10；大象项目不把刺激程度计入总分。分数为本次行程适配判断，排队参考历史体验，不代表实时等候或安全认证。\n\n## 行前准备\n\n'+d.packing.map(x=>'- [ ] '+x).join('\n')+'\n\n每天早餐前查看[TMD天气预警](https://www.tmd.go.th/en/)。9/27晚及9/28早确认船期，9/29晚确认潜店接送和健康问卷。感冒、耳鼻堵塞或身体不适时告诉教练。\n\n两次免减压潜水后，DAN建议无症状者乘机前至少间隔18小时；此行按24小时或教练／潜水电脑更长要求执行。记录9/30实际最后出水时间，10/2 14:30乘机。\n\n## 实用来源\n\n'+d.sources.filter(x=>!x.url.includes('xiaohongshu.com')).map(x=>`- [${x.label}](${x.url})`).join('\n')+'\n';
out+='\n## 小红书实访参考\n\n优先参考有具体时间、点单、交通和负面细节的实访，并与地图、商家和外网资料对照。明确商业推广的内容已标注，不作为口碑背书；链接可能需要登录。\n\n'+d.xiaohongshuSources.map(x=>`- [${x.label}](${x.url})`).join('\n')+'\n';
fs.writeFileSync(base+'/攻略.md',out);fs.writeFileSync(base+'/README.md','# 普吉岛与曼谷七日慢旅行\n\n2026.09.27—10.03 · 两位成人\n\n- [完整攻略](攻略.md)\n- [攻略网页](https://f.wxin.site/travel/phuket-bangkok-2026)\n- [站点目录](https://f.wxin.site/)\n- [路线导航](maps/routes.md)\n- [图片索引](assets/README.md)\n\n芭东两晚、小卡塔三晚、曼谷一晚。10月3日上午云石寺参观，14:15前往廊曼机场。\n');
fs.writeFileSync(base+'/maps/routes.md','# 每日路线导航\n\n'+itinerary.map(x=>`## ${x.date} · ${x.title}\n\n`+x.stops.filter(s=>s.query).map(st=>`- ${st.time} [${st.title}](${d.map(st.query)})`).join('\n')).join('\n\n')+'\n\n## 10月1日完整驾车导航\n\n'+d.routeChoices.map(r=>`- [${r.title}：${r.sequence.join(' → ')}](${d.routeLink(r.waypoints)}) · ${r.distance}`).join('\n')+'\n\n里程与时间为9月25日地图查询。实际出发查看路况，路线顺序以所选午餐方案为准。\n');
fs.writeFileSync(base+'/data/guide-final.json',JSON.stringify({checkedAt:'2026-09-25',days:itinerary,alternativeOctoberDay:d.days[4],routeChoices:d.routeChoices,cafes:d.cafes,xiaohongshuSources:d.xiaohongshuSources,hotels:d.hotels,places:d.places,activities:d.activities,packing:d.packing,sources:d.sources},null,2));
console.log('Finished guide: '+out.length+' chars; 7 days; '+d.places.length+' dining/spa; '+d.activities.length+' activities.');
