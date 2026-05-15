import type { RatioId } from "../../lib/posterCore";

export type PosterLabTemplateId = "moonPhase";
export type PhaseMode = "date" | "manual";
export type BackgroundStyleId = "observatory" | "instrument" | "deepBlack";

export type MoonPosterLayout = "lowerLeft" | "center" | "upperRight" | "caption";

export type InfoModuleId = "phaseName" | "lunarAge" | "date" | "phaseIndex" | "illumination";

export type MoonPosterInfoModules = Record<InfoModuleId, boolean>;

export type MoonPosterConfig = {
  templateId: PosterLabTemplateId;
  date: Date;
  phaseMode: PhaseMode;
  phaseIndex: number;
  text: string;
  font: string;
  color: string;
  size: number;
  x: number;
  y: number;
  align: CanvasTextAlign;
  layout: MoonPosterLayout;
  ratio: RatioId;
  width: number;
  height: number;
  infoModules: MoonPosterInfoModules;
  infoGap: number;
  backgroundStyle: BackgroundStyleId;
  moonScale: number;
  moonY: number;
};

export type BatchStatus = "等待" | "生成中" | "已完成" | "失败";

export type BatchRow = {
  id: string;
  lineNumber: number;
  date: Date;
  phaseMode: PhaseMode;
  phaseIndex: number;
  phaseLabel: string;
  text: string;
  status: BatchStatus;
  message?: string;
};

export type ParsedBatch = {
  rows: BatchRow[];
  warnings: string[];
};
