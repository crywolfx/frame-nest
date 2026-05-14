import type { CelestialEvent } from "./types";
import { formatBeijingDateTimeLabel } from "./time";

function eventTimeLabel(startsAt: string, peaksAt?: string, endsAt?: string) {
  const startLabel = formatBeijingDateTimeLabel(startsAt);
  const peakLabel = peaksAt ? `；食甚约 ${formatBeijingDateTimeLabel(peaksAt)}` : "";
  const endLabel = endsAt ? ` - ${formatBeijingDateTimeLabel(endsAt).replace("北京时间 ", "")}` : "";
  return `${startLabel}${endLabel}${peakLabel}`;
}

export const celestialEvents: CelestialEvent[] = [
  {
    id: "2026-03-03-total-lunar-eclipse",
    type: "lunarEclipse",
    title: "月全食",
    startsAt: "2026-03-03T08:44:00.000Z",
    peaksAt: "2026-03-03T11:33:46.000Z",
    endsAt: "2026-03-03T14:23:00.000Z",
    timeLabel: eventTimeLabel("2026-03-03T08:44:00.000Z", "2026-03-03T11:33:46.000Z", "2026-03-03T14:23:00.000Z"),
    visibility: "东亚、澳大利亚、太平洋、美洲可见；中亚和南美部分地区可见偏食。",
    locationSummary: "东亚 / 澳大利亚 / 太平洋 / 美洲",
    description: "地球位于太阳和月球之间，辅助光影会用示意构图标出地影方向；不表示精确本影路径。",
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
    timeLabel: eventTimeLabel("2026-08-12T15:34:15.000Z", "2026-08-12T17:46:06.000Z", "2026-08-12T19:57:57.000Z"),
    visibility: "全食带经过格陵兰、冰岛、西班牙、俄罗斯和葡萄牙小范围地区；欧洲、非洲、北美及大西洋、北冰洋、太平洋部分地区可见偏食。",
    locationSummary: "格陵兰 / 冰岛 / 西班牙 / 俄罗斯 / 葡萄牙小范围",
    description: "月球位于太阳和地球之间，辅助光影会用示意构图标出月影方向；不表示精确食带路径。",
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
    timeLabel: eventTimeLabel("2026-08-28T01:23:58.000Z", "2026-08-28T04:12:53.000Z", "2026-08-28T07:01:47.000Z"),
    visibility: "美洲、欧洲、非洲、西亚可见。",
    locationSummary: "美洲 / 欧洲 / 非洲 / 西亚",
    description: "月球部分进入地球本影，辅助光影只表达太阳-地球-月球的相对关系。",
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
    timeLabel: eventTimeLabel("2027-02-06T13:00:00.000Z", "2027-02-06T15:00:00.000Z"),
    visibility: "南美和非洲部分地区可见环食；南美、非洲、南极洲及南太平洋、南大西洋较大区域可见偏食。",
    locationSummary: "南美 / 非洲部分地区",
    description: "月球没有完全遮住太阳；辅助光影只表达太阳-月球-地球的相对关系。",
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
    timeLabel: eventTimeLabel("2027-08-02T08:00:00.000Z", "2027-08-02T10:00:00.000Z"),
    visibility: "全食带经过西班牙南部、北非、沙特阿拉伯和也门；欧洲、非洲、中东及周边海域可见偏食。",
    locationSummary: "西班牙南部 / 北非 / 沙特阿拉伯 / 也门",
    description: "月影跨越欧非和中东区域；当前 3D 辅助只做相对位置示意，不绘制真实路径地图。",
    recommendedView: "earthToMoon",
    sourceLabel: "NASA",
    sourceUrl: "https://science.nasa.gov/eclipses/future-eclipses/"
  }
];
