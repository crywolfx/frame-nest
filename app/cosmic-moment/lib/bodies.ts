import type { BodyDefinition, BodyId } from "./types";

export const bodies: BodyDefinition[] = [
  {
    id: "sun",
    name: "太阳",
    visualRadius: 3.2,
    orbitRadius: 0,
    orbitPeriodDays: 1,
    rotationPeriodHours: 609.12,
    inclinationDeg: 0,
    phaseDeg: 0,
    color: "#ffd36a",
    emissive: "#ff8d21"
  },
  {
    id: "mercury",
    name: "水星",
    visualRadius: 0.42,
    orbitRadius: 7,
    orbitPeriodDays: 87.969,
    rotationPeriodHours: 1407.6,
    inclinationDeg: 7,
    phaseDeg: 252,
    color: "#b9aa92"
  },
  {
    id: "venus",
    name: "金星",
    visualRadius: 0.72,
    orbitRadius: 9.8,
    orbitPeriodDays: 224.701,
    rotationPeriodHours: -5832.5,
    inclinationDeg: 3.4,
    phaseDeg: 181,
    color: "#d8b15f"
  },
  {
    id: "earth",
    name: "地球",
    visualRadius: 0.84,
    orbitRadius: 13,
    orbitPeriodDays: 365.256,
    rotationPeriodHours: 23.934,
    inclinationDeg: 0,
    phaseDeg: 102,
    color: "#6ca6ff"
  },
  {
    id: "moon",
    name: "月球",
    parentId: "earth",
    visualRadius: 0.28,
    orbitRadius: 2.05,
    orbitPeriodDays: 27.321661,
    rotationPeriodHours: 655.72,
    inclinationDeg: 5.1,
    phaseDeg: 45,
    color: "#d9d3c5"
  },
  {
    id: "mars",
    name: "火星",
    visualRadius: 0.62,
    orbitRadius: 17,
    orbitPeriodDays: 686.98,
    rotationPeriodHours: 24.623,
    inclinationDeg: 1.85,
    phaseDeg: 355,
    color: "#d36a46"
  },
  {
    id: "jupiter",
    name: "木星",
    visualRadius: 1.75,
    orbitRadius: 23,
    orbitPeriodDays: 4332.59,
    rotationPeriodHours: 9.925,
    inclinationDeg: 1.3,
    phaseDeg: 34,
    color: "#d6b083"
  },
  {
    id: "saturn",
    name: "土星",
    visualRadius: 1.46,
    orbitRadius: 29,
    orbitPeriodDays: 10759.22,
    rotationPeriodHours: 10.656,
    inclinationDeg: 2.49,
    phaseDeg: 50,
    color: "#e2c990"
  },
  {
    id: "uranus",
    name: "天王星",
    visualRadius: 1.05,
    orbitRadius: 35,
    orbitPeriodDays: 30688.5,
    rotationPeriodHours: -17.24,
    inclinationDeg: 0.77,
    phaseDeg: 314,
    color: "#8ed1d6"
  },
  {
    id: "neptune",
    name: "海王星",
    visualRadius: 1.02,
    orbitRadius: 41,
    orbitPeriodDays: 60182,
    rotationPeriodHours: 16.11,
    inclinationDeg: 1.77,
    phaseDeg: 304,
    color: "#526dcb"
  }
];

export const bodyById = Object.fromEntries(bodies.map((body) => [body.id, body])) as Record<BodyId, BodyDefinition>;
