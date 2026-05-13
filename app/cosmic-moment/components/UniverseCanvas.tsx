"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Html, Line, OrbitControls } from "@react-three/drei";
import { forwardRef, useEffect, useImperativeHandle, useMemo, useRef } from "react";
import * as THREE from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import styles from "../cosmic.module.css";
import { bodies } from "../lib/bodies";
import { sampleOrbit } from "../lib/orbits";
import type { BodyId, BodyState, Vec3, ViewPresetId } from "../lib/types";

export type UniverseHandle = {
  captureFrame: () => Promise<HTMLCanvasElement>;
};

type UniverseCanvasProps = {
  states: BodyState[];
  selectedBodyId: BodyId;
  selectedViewId: ViewPresetId;
  focusKey: number;
  paused: boolean;
  onSelect: (bodyId: BodyId) => void;
};

export const UniverseCanvas = forwardRef<UniverseHandle, UniverseCanvasProps>(function UniverseCanvas(
  { states, selectedBodyId, selectedViewId, focusKey, paused, onSelect },
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useImperativeHandle(ref, () => ({
    async captureFrame() {
      await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
      if (!canvasRef.current) throw new Error("Universe canvas is not ready.");
      return canvasRef.current;
    }
  }));

  return (
    <div className={styles.canvasWrap} data-testid="universe-canvas-wrap">
      <Canvas
        camera={{ position: [0, 30, 55], fov: 52, near: 0.1, far: 220 }}
        dpr={[1, 1.6]}
        gl={{ antialias: true, alpha: false, preserveDrawingBuffer: true, powerPreference: "high-performance" }}
      >
        <color attach="background" args={["#03050a"]} />
        <SceneBridge canvasRef={canvasRef} />
        <ambientLight intensity={0.035} />
        <pointLight position={[0, 0, 0]} intensity={820} decay={1.55} color="#ffd991" />
        <StarField />
        <SolarSystem states={states} selectedBodyId={selectedBodyId} onSelect={onSelect} />
        <CameraRig states={states} selectedBodyId={selectedBodyId} selectedViewId={selectedViewId} focusKey={focusKey} paused={paused} />
      </Canvas>
    </div>
  );
});

function SceneBridge({ canvasRef }: { canvasRef: React.MutableRefObject<HTMLCanvasElement | null> }) {
  const { gl } = useThree();

  useEffect(() => {
    canvasRef.current = gl.domElement;
  }, [canvasRef, gl]);

  return null;
}

function SolarSystem({
  states,
  selectedBodyId,
  onSelect
}: {
  states: BodyState[];
  selectedBodyId: BodyId;
  onSelect: (bodyId: BodyId) => void;
}) {
  const orbitPoints = useMemo(
    () =>
      bodies
        .filter((body) => body.id !== "sun")
        .map((body) => ({
          id: body.id,
          points: sampleOrbit(body.id, body.id === "moon" ? 96 : 220)
        })),
    []
  );

  return (
    <group>
      {orbitPoints.map(({ id, points }) => (
        <Line key={id} points={points} color={id === "moon" ? "#d8e8ff" : "#31465f"} lineWidth={id === "moon" ? 1.2 : 0.7} transparent opacity={0.34} />
      ))}

      {states.map((body) => (
        <BodyMesh key={body.id} body={body} selected={body.id === selectedBodyId} onSelect={onSelect} />
      ))}
    </group>
  );
}

function BodyMesh({ body, selected, onSelect }: { body: BodyState; selected: boolean; onSelect: (bodyId: BodyId) => void }) {
  const position = body.position;
  const isSun = body.id === "sun";
  const segments = body.visualRadius > 1.2 ? 56 : 36;

  return (
    <group position={position} rotation={[0, body.rotation, 0]}>
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
        <sphereGeometry args={[body.visualRadius * (selected ? 1.13 : 1), segments, Math.max(18, segments / 2)]} />
        {isSun ? (
          <meshBasicMaterial color={body.color} toneMapped={false} />
        ) : (
          <meshStandardMaterial color={body.color} roughness={0.72} metalness={0.04} emissive={selected ? "#111d2a" : "#000000"} />
        )}
      </mesh>

      {body.id === "sun" && (
        <mesh scale={1.22}>
          <sphereGeometry args={[body.visualRadius, 48, 24]} />
          <meshBasicMaterial color="#ff7f22" transparent opacity={0.16} blending={THREE.AdditiveBlending} />
        </mesh>
      )}

      {body.id === "saturn" && (
        <mesh rotation={[Math.PI / 2.7, 0.2, 0]}>
          <ringGeometry args={[body.visualRadius * 1.35, body.visualRadius * 2.18, 96]} />
          <meshBasicMaterial color="#d5be83" side={THREE.DoubleSide} transparent opacity={0.58} />
        </mesh>
      )}

      {selected && (
        <mesh>
          <sphereGeometry args={[body.visualRadius * 1.55, 36, 18]} />
          <meshBasicMaterial color="#dff5ff" transparent opacity={0.09} blending={THREE.AdditiveBlending} depthWrite={false} />
        </mesh>
      )}

      <Html position={[0, body.visualRadius + 0.42, 0]} center className={selected ? styles.activeLabel : styles.bodyLabel}>
        {body.name}
      </Html>
    </group>
  );
}

function StarField() {
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
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#c9e6ff" size={0.08} sizeAttenuation transparent opacity={0.7} />
    </points>
  );
}

function CameraRig({
  states,
  selectedBodyId,
  selectedViewId,
  focusKey,
  paused
}: {
  states: BodyState[];
  selectedBodyId: BodyId;
  selectedViewId: ViewPresetId;
  focusKey: number;
  paused: boolean;
}) {
  const { camera } = useThree();
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const flyTo = useRef<{ position: THREE.Vector3; target: THREE.Vector3 } | null>(null);

  useEffect(() => {
    const preset = cameraPreset(states, selectedBodyId, selectedViewId);
    flyTo.current = preset;
  }, [focusKey, selectedBodyId, selectedViewId]);

  useFrame(({ clock }) => {
    const controls = controlsRef.current;
    if (!controls) return;

    const targetPreset = selectedViewId === "free" ? flyTo.current : cameraPreset(states, selectedBodyId, selectedViewId, clock.elapsedTime);
    if (targetPreset) {
      camera.position.lerp(targetPreset.position, 0.055);
      controls.target.lerp(targetPreset.target, 0.07);
      controls.update();
      if (selectedViewId === "free" && camera.position.distanceTo(targetPreset.position) < 0.08) flyTo.current = null;
    } else if (selectedViewId === "cinematic" && !paused) {
      controls.update();
    }
  });

  return <OrbitControls ref={controlsRef} enableDamping dampingFactor={0.08} makeDefault minDistance={4} maxDistance={92} />;
}

function cameraPreset(states: BodyState[], selectedBodyId: BodyId, view: ViewPresetId, elapsed = 0) {
  const byId = Object.fromEntries(states.map((body) => [body.id, body])) as Record<BodyId, BodyState>;
  const selected = byId[selectedBodyId] ?? byId.earth;
  const earth = byId.earth;
  const moon = byId.moon;
  const sun = byId.sun;
  const bodyTarget = vec(selected.position);
  const radius = Math.max(2.4, selected.visualRadius * 5.2);

  if (view === "overview") return pair([0, 34, 56], [0, 0, 0]);
  if (view === "top") return pair([0, 82, 0.1], [0, 0, 0]);
  if (view === "sun") return pair([9, 7, 12], sun.position);
  if (view === "earth") return fromBody(earth, [3.5, 1.6, 5.6], earth.position);
  if (view === "moon") return fromBody(moon, [1.2, 0.7, 2.4], moon.position);
  if (view === "earthToMoon") return between(earth, moon, 1.8);
  if (view === "moonToEarth") return between(moon, earth, 0.85);
  if (view === "cinematic") {
    const angle = elapsed * 0.11;
    return {
      target: new THREE.Vector3(0, 0, 0),
      position: new THREE.Vector3(Math.cos(angle) * 46, 23 + Math.sin(angle * 0.7) * 7, Math.sin(angle) * 46)
    };
  }

  return {
    target: bodyTarget,
    position: bodyTarget.clone().add(new THREE.Vector3(radius, radius * 0.42, radius * 1.45))
  };
}

function fromBody(body: BodyState, offset: Vec3, target: Vec3) {
  return {
    target: vec(target),
    position: vec(body.position).add(new THREE.Vector3(...offset))
  };
}

function between(origin: BodyState, target: BodyState, distance: number) {
  const originVec = vec(origin.position);
  const targetVec = vec(target.position);
  const direction = targetVec.clone().sub(originVec).normalize();
  return {
    target: targetVec,
    position: originVec.add(direction.multiplyScalar(origin.visualRadius + distance)).add(new THREE.Vector3(0, 0.22, 0))
  };
}

function pair(position: Vec3, target: Vec3) {
  return { position: vec(position), target: vec(target) };
}

function vec(value: Vec3) {
  return new THREE.Vector3(value[0], value[1], value[2]);
}
