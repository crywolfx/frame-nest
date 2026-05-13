import { bodies, bodyById } from "./bodies";
import type { BodyId, BodyState, Vec3 } from "./types";

const tau = Math.PI * 2;
const epoch = Date.UTC(2000, 0, 1, 12, 0, 0);
const dayMs = 86_400_000;

function degToRad(deg: number) {
  return (deg / 180) * Math.PI;
}

function orbitPosition(bodyId: BodyId, date: Date): Vec3 {
  const body = bodyById[bodyId];
  if (body.id === "sun") return [0, 0, 0];

  const days = (date.getTime() - epoch) / dayMs;
  const angle = degToRad(body.phaseDeg) + (days / body.orbitPeriodDays) * tau;
  const incline = degToRad(body.inclinationDeg);
  const radius = body.orbitRadius;
  const x = Math.cos(angle) * radius;
  const zFlat = Math.sin(angle) * radius;
  const y = Math.sin(incline) * zFlat;
  const z = Math.cos(incline) * zFlat;

  if (body.parentId) {
    const parent = orbitPosition(body.parentId, date);
    return [parent[0] + x, parent[1] + y, parent[2] + z];
  }

  return [x, y, z];
}

export function getSolarSystemState(date: Date): BodyState[] {
  const hours = (date.getTime() - epoch) / 3_600_000;

  return bodies.map((body) => ({
    ...body,
    position: orbitPosition(body.id, date),
    rotation: body.rotationPeriodHours ? (hours / body.rotationPeriodHours) * tau : 0
  }));
}

export function sampleOrbit(bodyId: BodyId, count = 192): Vec3[] {
  const body = bodyById[bodyId];
  if (body.id === "sun") return [];

  const points: Vec3[] = [];
  const sampleDate = new Date(epoch);
  const parent = body.parentId ? orbitPosition(body.parentId, sampleDate) : [0, 0, 0];

  for (let index = 0; index <= count; index += 1) {
    const angle = (index / count) * tau;
    const incline = degToRad(body.inclinationDeg);
    const x = Math.cos(angle) * body.orbitRadius;
    const zFlat = Math.sin(angle) * body.orbitRadius;
    points.push([parent[0] + x, parent[1] + Math.sin(incline) * zFlat, parent[2] + Math.cos(incline) * zFlat]);
  }

  return points;
}

export function moonPhaseName(states: BodyState[]) {
  const sun = states.find((body) => body.id === "sun");
  const earth = states.find((body) => body.id === "earth");
  const moon = states.find((body) => body.id === "moon");
  if (!sun || !earth || !moon) return "Unknown";

  const sunVector = [
    sun.position[0] - moon.position[0],
    sun.position[1] - moon.position[1],
    sun.position[2] - moon.position[2]
  ];
  const earthVector = [
    earth.position[0] - moon.position[0],
    earth.position[1] - moon.position[1],
    earth.position[2] - moon.position[2]
  ];
  const dot = sunVector[0] * earthVector[0] + sunVector[1] * earthVector[1] + sunVector[2] * earthVector[2];
  const a = Math.hypot(...sunVector);
  const b = Math.hypot(...earthVector);
  const phase = (1 - dot / (a * b)) / 2;

  if (phase < 0.04) return "New moon";
  if (phase < 0.22) return "Waxing crescent";
  if (phase < 0.32) return "First quarter";
  if (phase < 0.48) return "Waxing gibbous";
  if (phase < 0.56) return "Full moon";
  if (phase < 0.74) return "Waning gibbous";
  if (phase < 0.84) return "Last quarter";
  return "Waning crescent";
}
