"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import styles from "../cosmic.module.css";
import { bodies } from "../lib/bodies";
import { celestialEvents } from "../lib/celestialEvents";
import { getSolarSystemStateAt, sampleOrbit } from "../lib/orbits";
import type { BodyDefinition, BodyId, BodyState, CelestialEventType, Vec3, ViewPresetId, VisualStyleId } from "../lib/types";

export type UniverseHandle = {
  captureFrame: () => Promise<HTMLCanvasElement>;
};

type UniverseCanvasProps = {
  currentDate: Date;
  timeRevision: number;
  speed: number;
  selectedBodyId: BodyId;
  selectedViewId: ViewPresetId;
  focusKey: number;
  paused: boolean;
  visualStyleId: VisualStyleId;
  onDateChange: (date: Date) => void;
  onManualCamera: () => void;
  onSelect: (bodyId: BodyId) => void;
};

type SimulationStore = {
  timeMs: number;
  targetSpeed: number;
  smoothedSpeed: number;
  states: BodyState[];
  byId: Record<BodyId, BodyState>;
};

const maxFrameElapsedMs = 100;
const speedEaseMs = 180;
const uiDateUpdateMs = 125;

export const UniverseCanvas = forwardRef<UniverseHandle, UniverseCanvasProps>(function UniverseCanvas(
  { currentDate, timeRevision, speed, selectedBodyId, selectedViewId, focusKey, paused, visualStyleId, onDateChange, onManualCamera, onSelect },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const simulationRef = useRef<SimulationStore | null>(null);
  const simulation = simulationRef.current ?? (simulationRef.current = createSimulation(currentDate.getTime(), speed));

  useImperativeHandle(ref, () => ({
    async captureFrame() {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (!canvasRef.current) throw new Error("宇宙画布尚未就绪。");
      return canvasRef.current;
    }
  }));

  const palette = stylePalettes[visualStyleId];

  return (
    <div className={styles.canvasWrap} data-testid="universe-canvas-wrap">
      <Canvas
        camera={{ position: [0, 30, 55], fov: 52, near: 0.1, far: 220 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={[palette.background]} />
        <SceneBridge canvasRef={canvasRef} />
        <ambientLight intensity={palette.ambient} />
        <hemisphereLight args={[palette.skyFill, palette.groundFill, palette.hemisphere]} />
        <pointLight position={[0, 0, 0]} intensity={palette.sunLight} decay={1.55} color={palette.sunLightColor} />
        <directionalLight position={[-28, 18, -22]} intensity={palette.backFill} color={palette.backFillColor} />
        <StarField visualStyleId={visualStyleId} />
        <SimulationTicker
          simulation={simulation}
          manualTimeMs={currentDate.getTime()}
          timeRevision={timeRevision}
          speed={speed}
          paused={paused}
          onDateChange={onDateChange}
        />
        <SolarSystem simulation={simulation} selectedBodyId={selectedBodyId} visualStyleId={visualStyleId} onSelect={onSelect} />
        <CameraRig
          simulation={simulation}
          selectedBodyId={selectedBodyId}
          selectedViewId={selectedViewId}
          focusKey={focusKey}
          timeRevision={timeRevision}
          paused={paused}
          onManualCamera={onManualCamera}
        />
      </Canvas>
    </div>
  );
});

function createSimulation(timeMs: number, speed: number): SimulationStore {
  const states = getSolarSystemStateAt(timeMs);
  return {
    timeMs,
    targetSpeed: speed,
    smoothedSpeed: speed,
    states,
    byId: indexStates(states)
  };
}

function updateSimulation(simulation: SimulationStore, timeMs: number) {
  const states = getSolarSystemStateAt(timeMs);
  simulation.timeMs = timeMs;
  simulation.states = states;
  simulation.byId = indexStates(states);
}

function indexStates(states: BodyState[]) {
  return Object.fromEntries(states.map((body) => [body.id, body])) as Record<BodyId, BodyState>;
}

function SimulationTicker({
  simulation,
  manualTimeMs,
  timeRevision,
  speed,
  paused,
  onDateChange
}: {
  simulation: SimulationStore;
  manualTimeMs: number;
  timeRevision: number;
  speed: number;
  paused: boolean;
  onDateChange: (date: Date) => void;
}) {
  const pausedRef = useRef(paused);
  const onDateChangeRef = useRef(onDateChange);
  const lastUiDateAtRef = useRef(0);
  const lastFrameTime = useRef<number | null>(null);

  useEffect(() => {
    pausedRef.current = paused;
    if (paused) {
      simulation.smoothedSpeed = speed;
      lastFrameTime.current = null;
    }
  }, [paused, simulation, speed]);

  useEffect(() => {
    simulation.targetSpeed = speed;
    if (pausedRef.current) simulation.smoothedSpeed = speed;
  }, [simulation, speed]);

  useEffect(() => {
    onDateChangeRef.current = onDateChange;
  }, [onDateChange]);

  useEffect(() => {
    updateSimulation(simulation, manualTimeMs);
    simulation.targetSpeed = speed;
    simulation.smoothedSpeed = speed;
    lastFrameTime.current = null;
    lastUiDateAtRef.current = 0;
  }, [simulation, timeRevision]);

  useFrame(() => {
    const now = performance.now();
    const lastFrameTimeMs = lastFrameTime.current ?? now;
    const elapsedMs = Math.min(now - lastFrameTimeMs, maxFrameElapsedMs);
    lastFrameTime.current = now;

    if (pausedRef.current) return;

    const speedEase = 1 - Math.exp(-elapsedMs / speedEaseMs);
    simulation.smoothedSpeed += (simulation.targetSpeed - simulation.smoothedSpeed) * speedEase;
    updateSimulation(simulation, simulation.timeMs + elapsedMs * simulation.smoothedSpeed);

    if (now - lastUiDateAtRef.current >= uiDateUpdateMs) {
      lastUiDateAtRef.current = now;
      onDateChangeRef.current(new Date(simulation.timeMs));
    }
  }, -100);

  return null;
}

function syncBodyTransform(group: THREE.Group | null, state: BodyState | undefined) {
  if (!group || !state) return;
  group.position.set(state.position[0], state.position[1], state.position[2]);
  group.rotation.y = state.rotation;
}

function syncGroupPosition(group: THREE.Group | null, state: BodyState | undefined) {
  if (!group || !state) return;
  group.position.set(state.position[0], state.position[1], state.position[2]);
}

function SceneBridge({ canvasRef }: { canvasRef: React.MutableRefObject<HTMLCanvasElement | null> }) {
  const { gl } = useThree();

  useEffect(() => {
    canvasRef.current = gl.domElement;
  }, [canvasRef, gl]);

  return null;
}

function SolarSystem({
  simulation,
  selectedBodyId,
  visualStyleId,
  onSelect
}: {
  simulation: SimulationStore;
  selectedBodyId: BodyId;
  visualStyleId: VisualStyleId;
  onSelect: (bodyId: BodyId) => void;
}) {
  const palette = stylePalettes[visualStyleId];
  const orbitPoints = useMemo(
    () =>
      bodies
        .filter((body) => body.id !== "sun" && body.id !== "moon")
        .map((body) => ({
          id: body.id,
          points: sampleOrbit(body.id, 220)
        })),
    []
  );
  const moonOrbitPoints = useMemo(() => sampleOrbit("moon", 96), []);

  return (
    <group>
      {orbitPoints.map(({ id, points }) => (
        <Line
          key={id}
          points={points}
          color={id === "moon" ? palette.moonOrbit : palette.orbit}
          lineWidth={id === "moon" ? 1.25 : 0.75}
          transparent
          opacity={palette.orbitOpacity}
        />
      ))}
      <MoonOrbit simulation={simulation} palette={palette} points={moonOrbitPoints} />
      <EclipseEffects simulation={simulation} visualStyleId={visualStyleId} />

      {bodies.map((body) => (
        <BodyMesh
          key={body.id}
          body={body}
          simulation={simulation}
          selected={body.id === selectedBodyId}
          visualStyleId={visualStyleId}
          onSelect={onSelect}
        />
      ))}
    </group>
  );
}

function MoonOrbit({
  simulation,
  palette,
  points
}: {
  simulation: SimulationStore;
  palette: (typeof stylePalettes)[VisualStyleId];
  points: Vec3[];
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const earth = simulation.byId.earth;
  const opacity = Math.min(0.2, palette.orbitOpacity * 0.48);

  useEffect(() => {
    syncGroupPosition(groupRef.current, earth);
  }, [earth]);

  useFrame(() => {
    syncGroupPosition(groupRef.current, simulation.byId.earth);
  });

  return (
    <group ref={groupRef}>
      <Line points={points} color={palette.moonOrbit} lineWidth={0.55} transparent opacity={opacity} />
    </group>
  );
}

function EclipseEffects({ simulation, visualStyleId }: { simulation: SimulationStore; visualStyleId: VisualStyleId }) {
  const lunarConeRef = useRef<THREE.Mesh | null>(null);
  const solarConeRef = useRef<THREE.Mesh | null>(null);
  const solarSpotRef = useRef<THREE.Mesh | null>(null);
  const lunarTintRef = useRef<THREE.Mesh | null>(null);
  const lunarLabelRef = useRef<THREE.Group | null>(null);
  const solarLabelRef = useRef<THREE.Group | null>(null);
  const beamColor = visualStyleId === "instrument" ? "#9ef2ff" : visualStyleId === "neon" ? "#ff62f1" : "#ffbf76";

  useFrame(() => {
    const effect = eclipseEffectAt(simulation.timeMs);
    const sun = simulation.byId.sun;
    const earth = simulation.byId.earth;
    const moon = simulation.byId.moon;
    const lunarActive = effect?.type === "lunarEclipse";
    const solarActive = effect?.type === "solarEclipse";

    setVisible(lunarConeRef.current, lunarActive);
    setVisible(lunarTintRef.current, lunarActive);
    setVisible(lunarLabelRef.current, lunarActive);
    setVisible(solarConeRef.current, solarActive);
    setVisible(solarSpotRef.current, solarActive);
    setVisible(solarLabelRef.current, solarActive);

    if (!effect || !sun || !earth || !moon) return;

    const sunVec = vec(sun.position);
    const earthVec = vec(earth.position);
    const moonVec = vec(moon.position);

    if (lunarActive) {
      const awayFromSun = earthVec.clone().sub(sunVec).normalize();
      const moonDirection = moonVec.clone().sub(earthVec).normalize();
      const shadowDirection = awayFromSun.lerp(moonDirection, 0.36).normalize();
      const length = Math.max(earthVec.distanceTo(moonVec) + moon.visualRadius * 2.4, earth.visualRadius * 7);
      const cone = lunarConeRef.current;
      const moonTint = lunarTintRef.current;
      const label = lunarLabelRef.current;

      if (cone) {
        setConeTransform(cone, earthVec, shadowDirection, length, earth.visualRadius * 1.2);
        setMaterialOpacity(cone, 0.18 + effect.intensity * 0.22);
      }
      if (moonTint) {
        moonTint.position.copy(moonVec);
        moonTint.scale.setScalar(moon.visualRadius * 1.1);
        setMaterialOpacity(moonTint, 0.18 + effect.intensity * 0.34);
      }
      if (label) label.position.copy(earthVec.clone().add(shadowDirection.multiplyScalar(Math.min(length * 0.52, 5.8))).add(new THREE.Vector3(0, 0.7, 0)));
    }

    if (solarActive) {
      const shadowDirection = earthVec.clone().sub(moonVec).normalize();
      const length = Math.max(moonVec.distanceTo(earthVec) + earth.visualRadius * 1.6, moon.visualRadius * 10);
      const cone = solarConeRef.current;
      const spot = solarSpotRef.current;
      const label = solarLabelRef.current;

      if (cone) {
        setConeTransform(cone, moonVec, shadowDirection, length, moon.visualRadius * 1.35);
        setMaterialOpacity(cone, 0.22 + effect.intensity * 0.26);
      }
      if (spot) {
        const surfaceNormal = moonVec.clone().sub(earthVec).normalize();
        spot.position.copy(earthVec.clone().add(surfaceNormal.clone().multiplyScalar(earth.visualRadius * 1.028)));
        spot.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, 1), surfaceNormal);
        spot.scale.setScalar(earth.visualRadius * (0.18 + effect.intensity * 0.18));
        setMaterialOpacity(spot, 0.34 + effect.intensity * 0.42);
      }
      if (label) label.position.copy(moonVec.clone().add(shadowDirection.multiplyScalar(Math.min(length * 0.46, 4.6))).add(new THREE.Vector3(0, 0.62, 0)));
    }
  });

  return (
    <group>
      <directionalLight position={[16, 8, 0]} intensity={0.42} color={beamColor} />
      <mesh ref={lunarConeRef} visible={false}>
        <coneGeometry args={[1, 1, 72, 1, true]} />
        <meshBasicMaterial color="#0a0c12" transparent opacity={0.28} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={lunarTintRef} visible={false}>
        <sphereGeometry args={[1, 64, 32]} />
        <meshBasicMaterial color="#b34a30" transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
      <group ref={lunarLabelRef} visible={false}>
        <Html center className={styles.eclipseLabel}>
          地影锥 / 月面铜红暗化
        </Html>
      </group>
      <mesh ref={solarConeRef} visible={false}>
        <coneGeometry args={[1, 1, 72, 1, true]} />
        <meshBasicMaterial color="#030407" transparent opacity={0.34} depthWrite={false} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={solarSpotRef} visible={false}>
        <circleGeometry args={[1, 72]} />
        <meshBasicMaterial color="#010101" transparent opacity={0.72} depthWrite={false} />
      </mesh>
      <group ref={solarLabelRef} visible={false}>
        <Html center className={styles.eclipseLabel}>
          月影锥 / 地表暗影
        </Html>
      </group>
    </group>
  );
}

function eclipseEffectAt(timeMs: number): { type: CelestialEventType; intensity: number } | null {
  for (const event of celestialEvents) {
    const start = Date.parse(event.startsAt);
    const peak = Date.parse(event.peaksAt ?? event.startsAt);
    const end = Date.parse(event.endsAt ?? event.peaksAt ?? event.startsAt);
    const safeStart = Number.isFinite(start) ? start : peak - 2 * 3_600_000;
    const safeEnd = Number.isFinite(end) && end > safeStart ? end : peak + 2 * 3_600_000;
    const paddedStart = Math.min(safeStart, peak - 2 * 3_600_000);
    const paddedEnd = Math.max(safeEnd, peak + 2 * 3_600_000);
    if (timeMs < paddedStart || timeMs > paddedEnd) continue;

    const halfWindow = Math.max(1, (paddedEnd - paddedStart) / 2);
    const distanceFromPeak = Math.abs(timeMs - peak);
    const intensity = THREE.MathUtils.clamp(1 - distanceFromPeak / halfWindow, 0.16, 1);
    return { type: event.type, intensity };
  }

  return null;
}

function setConeTransform(mesh: THREE.Mesh, origin: THREE.Vector3, direction: THREE.Vector3, length: number, radius: number) {
  mesh.position.copy(origin).add(direction.clone().multiplyScalar(length / 2));
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction);
  mesh.scale.set(radius, length, radius);
}

function setVisible(object: THREE.Object3D | null, visible: boolean) {
  if (object) object.visible = visible;
}

function setMaterialOpacity(mesh: THREE.Mesh, opacity: number) {
  const material = mesh.material;
  if (Array.isArray(material)) {
    material.forEach((item) => {
      item.opacity = opacity;
    });
  } else {
    material.opacity = opacity;
  }
}

function BodyMesh({
  body,
  simulation,
  selected,
  visualStyleId,
  onSelect
}: {
  body: BodyDefinition;
  simulation: SimulationStore;
  selected: boolean;
  visualStyleId: VisualStyleId;
  onSelect: (bodyId: BodyId) => void;
}) {
  const groupRef = useRef<THREE.Group | null>(null);
  const isSun = body.id === "sun";
  const segments = body.visualRadius > 1.2 ? 96 : 64;
  const palette = stylePalettes[visualStyleId];
  const fallbackSurface = useMemo(() => makeBodyTexture(body.id, visualStyleId), [body.id, visualStyleId]);
  const surface = useTextureWithFallback(nasaTexturePaths[body.id], visualStyleId === "nasa", fallbackSurface);
  const fallbackRing = useMemo(() => (body.id === "saturn" ? makeRingTexture(visualStyleId) : null), [body.id, visualStyleId]);
  const ringTexture = useTextureWithFallback("/cosmic/textures/2k_saturn_ring_alpha.png", visualStyleId === "nasa" && body.id === "saturn", fallbackRing);
  const atmosphere = atmosphereFor(body.id, visualStyleId);
  const roughness = body.id === "moon" || body.id === "mercury" || body.id === "mars" ? 0.94 : 0.68;
  const emissiveIntensity = selected ? palette.selectedEmissiveIntensity : palette.bodyEmissiveIntensity;

  useEffect(() => {
    syncBodyTransform(groupRef.current, simulation.byId[body.id]);
  }, [body.id, simulation]);

  useFrame(() => {
    syncBodyTransform(groupRef.current, simulation.byId[body.id]);
  });

  return (
    <group ref={groupRef}>
      <mesh
        onClick={(event) => {
          event.stopPropagation();
          onSelect(body.id);
        }}
        onPointerOver={(event) => {
          event.stopPropagation();
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          document.body.style.cursor = "";
        }}
      >
        <sphereGeometry args={[body.visualRadius * (selected ? 1.13 : 1), segments, Math.max(28, segments / 2)]} />
        {isSun ? (
          <meshBasicMaterial map={surface} color={palette.sunSurface} toneMapped={false} />
        ) : (
          <meshStandardMaterial
            map={surface}
            bumpMap={surface}
            bumpScale={body.id === "moon" ? 0.08 : body.id === "earth" ? 0.018 : 0.035}
            roughness={roughness}
            metalness={0.02}
            emissive={selected ? palette.selectedEmissive : palette.bodyEmissive}
            emissiveMap={surface}
            emissiveIntensity={emissiveIntensity}
          />
        )}
      </mesh>

      {body.id === "sun" && (
        <mesh scale={1.36}>
          <sphereGeometry args={[body.visualRadius, 48, 24]} />
          <meshBasicMaterial color={palette.sunGlow} transparent opacity={0.22} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {atmosphere && (
        <mesh scale={atmosphere.scale}>
          <sphereGeometry args={[body.visualRadius, 64, 32]} />
          <meshBasicMaterial color={atmosphere.color} transparent opacity={atmosphere.opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      {body.id === "earth" && visualStyleId === "nasa" && <EarthTextureLayers radius={body.visualRadius} />}

      {body.id === "venus" && visualStyleId === "nasa" && <MappedAtmosphere radius={body.visualRadius} src="/cosmic/textures/2k_venus_atmosphere.jpg" opacity={0.18} />}

      {body.id === "saturn" && (
        <mesh rotation={[Math.PI / 2.7, 0.2, 0]}>
          <ringGeometry args={[body.visualRadius * 1.32, body.visualRadius * 2.34, 160]} />
          <meshBasicMaterial map={ringTexture ?? undefined} color={palette.ringColor} side={THREE.DoubleSide} transparent opacity={0.9} alphaTest={0.04} />
        </mesh>
      )}

      {selected && (
        <mesh>
          <sphereGeometry args={[body.visualRadius * 1.55, 36, 18]} />
          <meshBasicMaterial color={palette.selection} transparent opacity={0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      <Html position={[0, body.visualRadius + 0.42, 0]} center className={selected ? styles.activeLabel : styles.bodyLabel}>
        {body.name}
      </Html>
    </group>
  );
}

function EarthTextureLayers({ radius }: { radius: number }) {
  const clouds = useTextureWithFallback("/cosmic/textures/2k_earth_clouds.jpg", true, null);
  const night = useTextureWithFallback("/cosmic/textures/2k_earth_nightmap.jpg", true, null);

  return (
    <>
      {night && (
        <mesh scale={1.006}>
          <sphereGeometry args={[radius, 96, 48]} />
          <shaderMaterial
            uniforms={{ map: { value: night }, sunPosition: { value: new THREE.Vector3(0, 0, 0) }, opacity: { value: 0.9 } }}
            vertexShader={nightSideVertexShader}
            fragmentShader={nightSideFragmentShader}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
      {clouds && (
        <mesh scale={1.018}>
          <sphereGeometry args={[radius, 96, 48]} />
          <shaderMaterial
            uniforms={{ map: { value: clouds }, opacity: { value: 0.32 } }}
            vertexShader={textureAlphaVertexShader}
            fragmentShader={textureAlphaFragmentShader}
            transparent
            depthWrite={false}
          />
        </mesh>
      )}
    </>
  );
}

function MappedAtmosphere({ radius, src, opacity }: { radius: number; src: string; opacity: number }) {
  const texture = useTextureWithFallback(src, true, null);
  if (!texture) return null;

  return (
    <mesh scale={1.03}>
      <sphereGeometry args={[radius, 96, 48]} />
      <meshBasicMaterial map={texture} color="#ffe1a2" transparent opacity={opacity} blending={THREE.AdditiveBlending} depthWrite={false} />
    </mesh>
  );
}

function useTextureWithFallback<T extends THREE.Texture | null>(src: string | undefined, enabled: boolean, fallback: T) {
  const [texture, setTexture] = useState<THREE.Texture | T>(fallback);

  useEffect(() => {
    setTexture(fallback);
    if (!enabled || !src) return;

    let live = true;
    const loader = new THREE.TextureLoader();
    loader.load(
      src,
      (loaded) => {
        setupLoadedTexture(loaded);
        if (live) setTexture(loaded);
      },
      undefined,
      () => {
        if (live) setTexture(fallback);
      }
    );

    return () => {
      live = false;
    };
  }, [enabled, fallback, src]);

  return texture;
}

function setupLoadedTexture(texture: THREE.Texture) {
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 8;
  texture.needsUpdate = true;
}

const textureAlphaVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const textureAlphaFragmentShader = `
  uniform sampler2D map;
  uniform float opacity;
  varying vec2 vUv;
  void main() {
    vec3 color = texture2D(map, vUv).rgb;
    float mask = smoothstep(0.08, 0.72, max(max(color.r, color.g), color.b));
    gl_FragColor = vec4(vec3(1.0), mask * opacity);
  }
`;

const nightSideVertexShader = `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPosition.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPosition;
  }
`;

const nightSideFragmentShader = `
  uniform sampler2D map;
  uniform vec3 sunPosition;
  uniform float opacity;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 city = texture2D(map, vUv).rgb;
    vec3 sunDirection = normalize(sunPosition - vWorldPosition);
    float night = smoothstep(0.2, -0.18, dot(normalize(vWorldNormal), sunDirection));
    float mask = smoothstep(0.04, 0.85, max(max(city.r, city.g), city.b));
    gl_FragColor = vec4(city * 1.35, mask * night * opacity);
  }
`;

function StarField({ visualStyleId }: { visualStyleId: VisualStyleId }) {
  const palette = stylePalettes[visualStyleId];
  const milkyWay = useTextureWithFallback("/cosmic/textures/2k_stars_milky_way.jpg", visualStyleId === "nasa", null);
  const positions = useMemo(() => {
    const values = new Float32Array(1400 * 3);
    let seed = 29;
    const random = () => {
      seed = (seed * 16807) % 2147483647;
      return (seed - 1) / 2147483646;
    };

    for (let index = 0; index < values.length; index += 3) {
      const radius = 70 + random() * 80;
      const theta = random() * Math.PI * 2;
      const phi = Math.acos(2 * random() - 1);
      values[index] = radius * Math.sin(phi) * Math.cos(theta);
      values[index + 1] = radius * Math.cos(phi) * 0.72;
      values[index + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    return values;
  }, []);

  return (
    <>
      {milkyWay && (
        <mesh>
          <sphereGeometry args={[145, 96, 48]} />
          <meshBasicMaterial map={milkyWay} side={THREE.BackSide} color="#dce8ff" opacity={0.52} transparent depthWrite={false} />
        </mesh>
      )}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial color={palette.stars} size={palette.starSize} sizeAttenuation transparent opacity={palette.starOpacity} />
      </points>
    </>
  );
}

const nasaTexturePaths: Record<BodyId, string> = {
  sun: "/cosmic/textures/2k_sun.jpg",
  mercury: "/cosmic/textures/2k_mercury.jpg",
  venus: "/cosmic/textures/2k_venus_surface.jpg",
  earth: "/cosmic/textures/2k_earth_daymap.jpg",
  moon: "/cosmic/textures/2k_moon.jpg",
  mars: "/cosmic/textures/2k_mars.jpg",
  jupiter: "/cosmic/textures/2k_jupiter.jpg",
  saturn: "/cosmic/textures/2k_saturn.jpg",
  uranus: "/cosmic/textures/2k_uranus.jpg",
  neptune: "/cosmic/textures/2k_neptune.jpg"
};

const stylePalettes: Record<
  VisualStyleId,
  {
    background: string;
    ambient: number;
    hemisphere: number;
    skyFill: string;
    groundFill: string;
    backFill: number;
    backFillColor: string;
    sunLight: number;
    sunLightColor: string;
    sunSurface: string;
    sunGlow: string;
    stars: string;
    starSize: number;
    starOpacity: number;
    orbit: string;
    moonOrbit: string;
    orbitOpacity: number;
    ringColor: string;
    selection: string;
    bodyEmissive: string;
    selectedEmissive: string;
    bodyEmissiveIntensity: number;
    selectedEmissiveIntensity: number;
  }
> = {
  nasa: {
    background: "#02040a",
    ambient: 0.22,
    hemisphere: 0.34,
    skyFill: "#556b86",
    groundFill: "#161b24",
    backFill: 0.38,
    backFillColor: "#b6c7df",
    sunLight: 860,
    sunLightColor: "#ffdca0",
    sunSurface: "#fff0a2",
    sunGlow: "#ff8a2c",
    stars: "#d7e8ff",
    starSize: 0.075,
    starOpacity: 0.72,
    orbit: "#304158",
    moonOrbit: "#d7e7ff",
    orbitOpacity: 0.34,
    ringColor: "#f0d28c",
    selection: "#dff5ff",
    bodyEmissive: "#526173",
    selectedEmissive: "#8bc7ff",
    bodyEmissiveIntensity: 0.055,
    selectedEmissiveIntensity: 0.12
  },
  cinema: {
    background: "#08050a",
    ambient: 0.07,
    hemisphere: 0.16,
    skyFill: "#3f2a2a",
    groundFill: "#120806",
    backFill: 0.18,
    backFillColor: "#ffb06d",
    sunLight: 1080,
    sunLightColor: "#ffbf76",
    sunSurface: "#ffd26b",
    sunGlow: "#ff5f2d",
    stars: "#ffe7ca",
    starSize: 0.09,
    starOpacity: 0.82,
    orbit: "#705642",
    moonOrbit: "#ffe4bd",
    orbitOpacity: 0.28,
    ringColor: "#ffd48a",
    selection: "#ffcf8b",
    bodyEmissive: "#120806",
    selectedEmissive: "#4d210e",
    bodyEmissiveIntensity: 0.08,
    selectedEmissiveIntensity: 0.32
  },
  instrument: {
    background: "#01070a",
    ambient: 0.025,
    hemisphere: 0.12,
    skyFill: "#2b6170",
    groundFill: "#001116",
    backFill: 0.14,
    backFillColor: "#8deeff",
    sunLight: 760,
    sunLightColor: "#d9f7ff",
    sunSurface: "#e8fbff",
    sunGlow: "#58d7ff",
    stars: "#9ee9ff",
    starSize: 0.055,
    starOpacity: 0.58,
    orbit: "#2f7f8b",
    moonOrbit: "#bdf6ff",
    orbitOpacity: 0.42,
    ringColor: "#b6f0ef",
    selection: "#80f7ff",
    bodyEmissive: "#001116",
    selectedEmissive: "#00313b",
    bodyEmissiveIntensity: 0.08,
    selectedEmissiveIntensity: 0.32
  },
  neon: {
    background: "#040210",
    ambient: 0.085,
    hemisphere: 0.2,
    skyFill: "#49228a",
    groundFill: "#110022",
    backFill: 0.2,
    backFillColor: "#e476ff",
    sunLight: 840,
    sunLightColor: "#ffd5ff",
    sunSurface: "#ffe66f",
    sunGlow: "#ff3df2",
    stars: "#f5d6ff",
    starSize: 0.1,
    starOpacity: 0.86,
    orbit: "#743bff",
    moonOrbit: "#72fff3",
    orbitOpacity: 0.5,
    ringColor: "#ffcc6f",
    selection: "#ff61f6",
    bodyEmissive: "#110022",
    selectedEmissive: "#36006f",
    bodyEmissiveIntensity: 0.1,
    selectedEmissiveIntensity: 0.34
  }
};

const bodyColors: Record<BodyId, string[]> = {
  sun: ["#fff4a8", "#ffc247", "#ff6a1f", "#7a1f0e"],
  mercury: ["#5a5146", "#8d8170", "#c5b9a5", "#342f2b"],
  venus: ["#6f5227", "#c99242", "#f1d078", "#fff0ad"],
  earth: ["#073b80", "#1567b0", "#2f8c5a", "#ded2a8", "#ffffff"],
  moon: ["#4c4b47", "#8f8b81", "#d7d0c2", "#262522"],
  mars: ["#622b20", "#a6472d", "#d47a4a", "#f0bd83"],
  jupiter: ["#6b422c", "#b98155", "#e5c098", "#f6e4c2", "#9b3d2e"],
  saturn: ["#6f5b35", "#b89458", "#ead394", "#f7e8b7"],
  uranus: ["#2f8d9b", "#7ad7df", "#d3fbff", "#175965"],
  neptune: ["#142e80", "#355cc9", "#6f9cff", "#d7e8ff"]
};

function makeBodyTexture(bodyId: BodyId, style: VisualStyleId) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);

  const colors = remapColors(bodyColors[bodyId], style);
  const random = seeded(`${bodyId}-${style}`);
  const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
  colors.forEach((color, index) => gradient.addColorStop(index / Math.max(1, colors.length - 1), color));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  if (bodyId === "sun") drawSolarGranules(ctx, canvas, random, style);
  else if (bodyId === "earth") drawEarth(ctx, canvas, random, style);
  else if (bodyId === "jupiter" || bodyId === "saturn" || bodyId === "uranus" || bodyId === "neptune" || bodyId === "venus") drawBands(ctx, canvas, bodyId, random, style);
  else drawRock(ctx, canvas, bodyId, random, style);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.anisotropy = 4;
  return texture;
}

function drawEarth(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, random: () => number, style: VisualStyleId) {
  ctx.fillStyle = style === "neon" ? "rgba(90,255,210,0.75)" : "rgba(47,132,86,0.82)";
  for (let index = 0; index < 34; index += 1) {
    ctx.beginPath();
    ctx.ellipse(random() * canvas.width, 36 + random() * 176, 34 + random() * 92, 12 + random() * 42, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "rgba(255,255,255,0.62)";
  for (let index = 0; index < 44; index += 1) {
    ctx.beginPath();
    ctx.ellipse(random() * canvas.width, random() * canvas.height, 18 + random() * 72, 2 + random() * 9, random() * 0.45, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawBands(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, bodyId: BodyId, random: () => number, style: VisualStyleId) {
  const bandCount = bodyId === "jupiter" ? 18 : bodyId === "saturn" ? 14 : 9;
  for (let index = 0; index < bandCount; index += 1) {
    const y = (index / bandCount) * canvas.height;
    ctx.fillStyle = `rgba(255,255,255,${0.05 + random() * 0.18})`;
    ctx.fillRect(0, y, canvas.width, 5 + random() * 18);
    ctx.fillStyle = `rgba(45,20,10,${style === "instrument" ? 0.08 : 0.1 + random() * 0.16})`;
    ctx.fillRect(0, y + 8 + random() * 8, canvas.width, 2 + random() * 9);
  }
  if (bodyId === "jupiter") {
    ctx.fillStyle = style === "neon" ? "rgba(255,70,230,0.68)" : "rgba(150,55,42,0.72)";
    ctx.beginPath();
    ctx.ellipse(canvas.width * 0.68, canvas.height * 0.58, 44, 18, -0.08, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawRock(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, bodyId: BodyId, random: () => number, style: VisualStyleId) {
  const craters = bodyId === "moon" ? 92 : bodyId === "mercury" ? 68 : 36;
  for (let index = 0; index < craters; index += 1) {
    const radius = (bodyId === "moon" ? 3 : 2) + random() * (bodyId === "mars" ? 9 : 15);
    const x = random() * canvas.width;
    const y = random() * canvas.height;
    ctx.strokeStyle = `rgba(255,255,255,${style === "neon" ? 0.22 : 0.08 + random() * 0.14})`;
    ctx.lineWidth = 1 + random() * 1.4;
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(0,0,0,${0.08 + random() * 0.16})`;
    ctx.beginPath();
    ctx.arc(x + radius * 0.12, y + radius * 0.1, radius * 0.72, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawSolarGranules(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, random: () => number, style: VisualStyleId) {
  for (let index = 0; index < 260; index += 1) {
    ctx.fillStyle = style === "instrument" ? "rgba(120,230,255,0.14)" : "rgba(255,95,18,0.18)";
    ctx.beginPath();
    ctx.ellipse(random() * canvas.width, random() * canvas.height, 8 + random() * 26, 2 + random() * 8, random() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
}

function makeRingTexture(style: VisualStyleId) {
  const canvas = document.createElement("canvas");
  canvas.width = 512;
  canvas.height = 32;
  const ctx = canvas.getContext("2d");
  if (!ctx) return new THREE.CanvasTexture(canvas);
  for (let x = 0; x < canvas.width; x += 1) {
    const t = x / canvas.width;
    const gap = Math.abs(t - 0.47) < 0.018 || Math.abs(t - 0.72) < 0.012;
    ctx.fillStyle = gap ? "rgba(0,0,0,0)" : ringStripe(style, t);
    ctx.fillRect(x, 0, 1, canvas.height);
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  return texture;
}

function ringStripe(style: VisualStyleId, t: number) {
  if (style === "neon") return `rgba(255,${Math.round(170 + t * 70)},120,${0.42 + t * 0.36})`;
  if (style === "instrument") return `rgba(180,245,245,${0.32 + t * 0.28})`;
  return `rgba(${210 + Math.round(t * 36)},${178 + Math.round(t * 38)},${116 + Math.round(t * 34)},${0.34 + t * 0.42})`;
}

function atmosphereFor(bodyId: BodyId, style: VisualStyleId) {
  const colors: Partial<Record<BodyId, string>> = {
    earth: style === "neon" ? "#48ffe8" : "#77caff",
    venus: "#ffd37a",
    uranus: "#9ff6ff",
    neptune: "#7ca4ff"
  };
  const color = colors[bodyId];
  return color ? { color, scale: bodyId === "earth" ? 1.08 : 1.045, opacity: bodyId === "earth" ? 0.18 : 0.1 } : null;
}

function remapColors(colors: string[], style: VisualStyleId) {
  if (style === "nasa") return colors;
  if (style === "instrument") return colors.map((color) => new THREE.Color(color).lerp(new THREE.Color("#9ff4ff"), 0.42).getStyle());
  if (style === "neon") return colors.map((color) => new THREE.Color(color).offsetHSL(0.08, 0.28, 0.06).getStyle());
  return colors.map((color) => new THREE.Color(color).offsetHSL(-0.03, 0.08, -0.02).getStyle());
}

function seeded(seedText: string) {
  let seed = 0;
  for (let index = 0; index < seedText.length; index += 1) seed = (seed * 31 + seedText.charCodeAt(index)) >>> 0;
  return () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}

function CameraRig({
  simulation,
  selectedBodyId,
  selectedViewId,
  focusKey,
  timeRevision,
  paused,
  onManualCamera
}: {
  simulation: SimulationStore;
  selectedBodyId: BodyId;
  selectedViewId: ViewPresetId;
  focusKey: number;
  timeRevision: number;
  paused: boolean;
  onManualCamera: () => void;
}) {
  const { camera, size } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const flyTo = useRef<{ position: THREE.Vector3; target: THREE.Vector3 } | null>(null);
  const cinematicTimeRef = useRef(0);
  const manualOverrideRef = useRef(false);
  const onManualCameraRef = useRef(onManualCamera);

  useEffect(() => {
    onManualCameraRef.current = onManualCamera;
  }, [onManualCamera]);

  useEffect(() => {
    if (manualOverrideRef.current && selectedViewId === "free") {
      manualOverrideRef.current = false;
      flyTo.current = null;
      return;
    }

    const preset = cameraPreset(simulation.states, selectedBodyId, selectedViewId, 0, cameraFit(camera, size));
    flyTo.current = preset;
  }, [camera, focusKey, selectedBodyId, selectedViewId, size, timeRevision, simulation]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (!paused) cinematicTimeRef.current += Math.min(delta, maxFrameElapsedMs / 1000);
    if (manualOverrideRef.current) {
      controls.update();
      return;
    }

    const targetPreset = selectedViewId === "cinematic" ? cameraPreset(simulation.states, selectedBodyId, selectedViewId, cinematicTimeRef.current, cameraFit(camera, size)) : flyTo.current;
    if (targetPreset) {
      camera.position.lerp(targetPreset.position, 0.055);
      controls.target.lerp(targetPreset.target, 0.07);
      controls.update();
      if (selectedViewId !== "cinematic" && camera.position.distanceTo(targetPreset.position) < 0.08 && controls.target.distanceTo(targetPreset.target) < 0.08) flyTo.current = null;
    } else if (selectedViewId === "cinematic" && !paused) {
      controls.update();
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      enableDamping
      dampingFactor={0.08}
      enableZoom
      enableRotate
      enablePan
      makeDefault
      minDistance={0.85}
      maxDistance={160}
      onStart={() => {
        flyTo.current = null;
        manualOverrideRef.current = true;
        if (selectedViewId !== "free") onManualCameraRef.current();
      }}
    />
  );
}

type CameraFit = {
  fov: number;
  aspect: number;
};

function cameraFit(camera: THREE.Camera, size: { width: number; height: number }): CameraFit {
  return {
    fov: camera instanceof THREE.PerspectiveCamera ? camera.fov : 52,
    aspect: size.height > 0 ? size.width / size.height : 1
  };
}

function cameraPreset(states: BodyState[], selectedBodyId: BodyId, view: ViewPresetId, elapsed = 0, fit: CameraFit = { fov: 52, aspect: 1.6 }) {
  const byId = Object.fromEntries(states.map((body) => [body.id, body])) as Record<BodyId, BodyState>;
  const selected = byId[selectedBodyId] ?? byId.earth;
  const earth = byId.earth;
  const moon = byId.moon;
  const sun = byId.sun;
  const bodyTarget = vec(selected.position);

  if (view === "overview") return pair([0, 34, 56], [0, 0, 0]);
  if (view === "top") return pair([0, 82, 0.1], [0, 0, 0]);
  if (view === "sun") return focusBody(sun, new THREE.Vector3(1, 0.55, 1.15), fit);
  if (view === "earth") return focusBody(earth, vec(earth.position).sub(vec(sun.position)).add(new THREE.Vector3(0.8, 0.35, 0.45)), fit);
  if (view === "moon") return focusBody(moon, vec(moon.position).sub(vec(earth.position)).add(new THREE.Vector3(0.45, 0.35, 0.7)), fit);
  if (view === "earthToMoon") return between(earth, moon, 0.45, fit);
  if (view === "moonToEarth") return between(moon, earth, 0.5, fit);
  if (view === "cinematic") {
    const angle = elapsed * 0.11;
    return {
      target: new THREE.Vector3(0, 0, 0),
      position: new THREE.Vector3(Math.cos(angle) * 46, 23 + Math.sin(angle * 0.7) * 7, Math.sin(angle) * 46)
    };
  }

  return focusBody(selected, bodyTarget.clone().normalize().add(new THREE.Vector3(0.9, 0.45, 1.15)), fit);
}

function focusBody(body: BodyState, direction: THREE.Vector3, fit: CameraFit) {
  const target = vec(body.position);
  const safeDirection = direction.lengthSq() > 0.0001 ? direction.clone().normalize() : new THREE.Vector3(1, 0.35, 1).normalize();
  const radiusBudget = body.visualRadius * (body.id === "sun" ? 1.42 : 1.72);
  const fill = body.id === "sun" ? 0.44 : body.id === "moon" ? 0.5 : 0.48;
  const minimum = body.id === "moon" ? 1.9 : body.id === "sun" ? 12 : 2.8;
  const maximum = body.id === "sun" ? 28 : body.visualRadius > 1.4 ? 22 : 16;
  const distance = THREE.MathUtils.clamp(fitDistanceForRadius(radiusBudget, fit, fill), minimum, maximum);

  return {
    target,
    position: target.clone().add(safeDirection.multiplyScalar(distance))
  };
}

function between(origin: BodyState, target: BodyState, clearance: number, fit: CameraFit) {
  const originVec = vec(origin.position);
  const targetVec = vec(target.position);
  const direction = targetVec.clone().sub(originVec);
  if (direction.lengthSq() < 0.0001) return focusBody(target, new THREE.Vector3(1, 0.45, 1), fit);
  direction.normalize();
  const span = originVec.distanceTo(targetVec);
  const targetDistance = fitDistanceForRadius(target.visualRadius * 1.68, fit, target.id === "earth" ? 0.42 : 0.5);
  const originClearance = origin.visualRadius * 1.45 + clearance;
  const distanceFromTarget = Math.max(targetDistance, span + originClearance);
  const up = new THREE.Vector3(0, 1, 0);
  const side = new THREE.Vector3().crossVectors(direction, up);
  if (side.lengthSq() < 0.0001) side.set(1, 0, 0);
  side.normalize();
  const lift = Math.max(0.22, Math.max(origin.visualRadius, target.visualRadius) * 0.46);
  const sideOffset = Math.max(0.18, target.visualRadius * 0.28);

  return {
    target: targetVec.clone().add(up.clone().multiplyScalar(target.visualRadius * 0.08)),
    position: targetVec
      .clone()
      .sub(direction.multiplyScalar(distanceFromTarget))
      .add(up.multiplyScalar(lift))
      .add(side.multiplyScalar(sideOffset))
  };
}

function fitDistanceForRadius(radius: number, fit: CameraFit, fill: number) {
  const verticalFov = THREE.MathUtils.degToRad(fit.fov);
  const horizontalFov = 2 * Math.atan(Math.tan(verticalFov / 2) * Math.max(0.1, fit.aspect));
  const limitingFov = Math.min(verticalFov, horizontalFov);
  const safeFill = THREE.MathUtils.clamp(fill, 0.24, 0.68);
  return radius / Math.tan((limitingFov * safeFill) / 2);
}

function pair(position: Vec3, target: Vec3) {
  return { position: vec(position), target: vec(target) };
}

function vec(value: Vec3) {
  return new THREE.Vector3(value[0], value[1], value[2]);
}
