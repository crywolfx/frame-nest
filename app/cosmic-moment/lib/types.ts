export type BodyId =
  | "sun"
  | "mercury"
  | "venus"
  | "earth"
  | "moon"
  | "mars"
  | "jupiter"
  | "saturn"
  | "uranus"
  | "neptune";

export type ViewPresetId =
  | "free"
  | "earth"
  | "moon"
  | "sun"
  | "earthToMoon"
  | "moonToEarth"
  | "overview"
  | "top"
  | "cinematic";

export type RatioId = "1:1" | "4:5" | "9:16" | "16:9" | "custom";
export type VisualStyleId = "nasa" | "cinema" | "instrument" | "neon";
export type CelestialEventType = "solarEclipse" | "lunarEclipse";
export type Vec3 = [number, number, number];

export type BodyDefinition = {
  id: BodyId;
  name: string;
  parentId?: BodyId;
  visualRadius: number;
  orbitRadius: number;
  orbitPeriodDays: number;
  rotationPeriodHours: number;
  inclinationDeg: number;
  phaseDeg: number;
  color: string;
  emissive?: string;
};

export type BodyState = BodyDefinition & {
  position: Vec3;
  rotation: number;
};

export type PosterConfig = {
  text: string;
  font: string;
  color: string;
  size: number;
  x: number;
  y: number;
  align: CanvasTextAlign;
  layout: "lowerLeft" | "center" | "upperRight" | "caption";
  ratio: RatioId;
  width: number;
  height: number;
  metadata: boolean;
};

export type BatchRow = {
  date: Date;
  text: string;
  view: ViewPresetId;
};

export type CelestialEvent = {
  id: string;
  type: CelestialEventType;
  title: string;
  startsAt: string;
  peaksAt?: string;
  endsAt?: string;
  timeLabel: string;
  visibility: string;
  locationSummary: string;
  description: string;
  recommendedView: ViewPresetId;
  sourceLabel?: string;
  sourceUrl?: string;
};
