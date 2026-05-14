import type { CelestialEvent } from "./types";

export const celestialEvents: CelestialEvent[] = [
  {
    id: "2026-03-03-total-lunar-eclipse",
    type: "lunarEclipse",
    title: "月全食",
    startsAt: "2026-03-03T08:44:00.000Z",
    peaksAt: "2026-03-03T11:33:46.000Z",
    endsAt: "2026-03-03T14:23:00.000Z",
    timeLabel: "2026-03-03 08:44-14:23 UTC；食甚约 11:33 UTC",
    visibility: "东亚、澳大利亚、太平洋、美洲可见；中亚和南美部分地区可见偏食。",
    locationSummary: "东亚 / 澳大利亚 / 太平洋 / 美洲",
    description: "地球位于太阳和月球之间，月面进入地影，全食阶段会呈现铜红色。",
    recommendedView: "moonToEarth",
    sourceLabel: "NASA",
    sourceUrl: "https://science.nasa.gov/solar-system/moon/march-2026-total-lunar-eclipse-your-questions-answered/"
  },
  {
    id: "2026-08-12-total-solar-eclipse",
    type: "solarEclipse",
    title: "日全食",
    startsAt: "2026-08-12T15:34:15.000Z",
    peaksAt: "2026-08-12T17:46:06.000Z",
    endsAt: "2026-08-12T19:57:57.000Z",
    timeLabel: "2026-08-12 15:34-19:57 UTC；食甚约 17:46 UTC",
    visibility: "全食带经过格陵兰、冰岛、西班牙、俄罗斯和葡萄牙小范围地区；欧洲、非洲、北美及大西洋、北冰洋、太平洋部分地区可见偏食。",
    locationSummary: "格陵兰 / 冰岛 / 西班牙 / 俄罗斯 / 葡萄牙小范围",
    description: "月球位于太阳和地球之间，月影扫过地表；推荐用地望月视角观察简化模型中的对齐关系。",
    recommendedView: "earthToMoon",
    sourceLabel: "NASA",
    sourceUrl: "https://science.nasa.gov/eclipses/future-eclipses/"
  },
  {
    id: "2026-08-28-partial-lunar-eclipse",
    type: "lunarEclipse",
    title: "月偏食",
    startsAt: "2026-08-28T01:23:58.000Z",
    peaksAt: "2026-08-28T04:12:53.000Z",
    endsAt: "2026-08-28T07:01:47.000Z",
    timeLabel: "2026-08-27/28 UTC；食甚约 2026-08-28 04:12 UTC",
    visibility: "美洲、欧洲、非洲、西亚可见。",
    locationSummary: "美洲 / 欧洲 / 非洲 / 西亚",
    description: "月球部分进入地球本影，月面会出现明显缺口但不会完全转红。",
    recommendedView: "moonToEarth",
    sourceLabel: "NASA",
    sourceUrl: "https://science.nasa.gov/eclipses/future-eclipses/"
  },
  {
    id: "2027-02-06-annular-solar-eclipse",
    type: "solarEclipse",
    title: "日环食",
    startsAt: "2027-02-06T13:00:00.000Z",
    peaksAt: "2027-02-06T15:00:00.000Z",
    timeLabel: "2027-02-06 UTC",
    visibility: "南美和非洲部分地区可见环食；南美、非洲、南极洲及南太平洋、南大西洋较大区域可见偏食。",
    locationSummary: "南美 / 非洲部分地区",
    description: "月球没有完全遮住太阳，中心区域会看到明亮的环状太阳边缘。",
    recommendedView: "earthToMoon",
    sourceLabel: "NASA",
    sourceUrl: "https://science.nasa.gov/eclipses/future-eclipses/"
  },
  {
    id: "2027-08-02-total-solar-eclipse",
    type: "solarEclipse",
    title: "日全食",
    startsAt: "2027-08-02T08:00:00.000Z",
    peaksAt: "2027-08-02T10:00:00.000Z",
    timeLabel: "2027-08-02 UTC",
    visibility: "全食带经过西班牙南部、北非、沙特阿拉伯和也门；欧洲、非洲、中东及周边海域可见偏食。",
    locationSummary: "西班牙南部 / 北非 / 沙特阿拉伯 / 也门",
    description: "月影跨越欧非和中东区域，是后续可扩展到路径地图的重点事件。",
    recommendedView: "earthToMoon",
    sourceLabel: "NASA",
    sourceUrl: "https://science.nasa.gov/eclipses/future-eclipses/"
  }
];

