"use client";

import { OrbitControls } from "@react-three/drei";
import type { ReactThreeFiber } from "@react-three/fiber";
import { Canvas, useFrame } from "@react-three/fiber";
import { memo, Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * ExportGlobe
 * -----------------------------------------------------------------------------
 * A lightweight, brand-styled WebGL globe (Three.js via @react-three/fiber)
 * with animated rotation and export destination markers.
 *
 * Props:
 * - markers: Array<{ lat: number; lng: number; label?: string }>
 * - autoRotate?: boolean (default true)
 * - className?: string (container div class)
 * - height?: number (px, default 480)
 * - showGraticule?: boolean (default true)
 */
export type GlobeMarker = {
  lat: number;
  lng: number;
  label?: string;
};

export default function ExportGlobe({
  markers = DEFAULT_MARKERS,
  autoRotate = true,
  className,
  height = 480,
  showGraticule = true,
}: {
  markers?: GlobeMarker[];
  autoRotate?: boolean;
  className?: string;
  height?: number;
  showGraticule?: boolean;
}) {
  return (
    <div
      className={className}
      style={{
        width: "100%",
        height,
        borderRadius: 16,
        overflow: "hidden",
        border: "1px solid #E7E3DE",
        background: "#0A2E2F",
      }}
      aria-label="Interactive globe showing export destinations"
    >
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [0, 0, 3.2], fov: 45, near: 0.1, far: 100 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#0A2E2F"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} color={0xffffff} />
        <directionalLight position={[-3, -2, -1]} intensity={0.4} color={0xb0c4b1} />

        <Suspense fallback={null}>
          <Scene
            markers={markers}
            autoRotate={autoRotate}
            showGraticule={showGraticule}
          />
        </Suspense>

        <OrbitControls
          enablePan={false}
          enableZoom={false}
          autoRotate={autoRotate}
          autoRotateSpeed={0.35}
          rotateSpeed={0.5}
        />
      </Canvas>
    </div>
  );
}

/* ---------------------------------- Scene --------------------------------- */

const Scene = memo(function Scene({
  markers,
  autoRotate,
  showGraticule,
}: {
  markers: GlobeMarker[];
  autoRotate: boolean;
  showGraticule: boolean;
}) {
  // Brand palette
  const CEYLON_GREEN = "#083335";
  const GOLD = "#C4A36A";
  const OCEAN = "#0E3F40";
  const OCEAN_DARK = "#072E2E";

  const group = useRef<THREE.Group>(null);

  // Gentle base rotation
  useFrame((_, delta) => {
    if (autoRotate && group.current) {
      group.current.rotation.y += delta * 0.08;
    }
  });

  // Sphere + subtle atmosphere + rim lighting via custom shader
  return (
    <group ref={group}>
      <GlobeSphere baseColor={OCEAN} detailColor={OCEAN_DARK} rimColor={CEYLON_GREEN} />
      <Atmosphere color={CEYLON_GREEN} />
      {showGraticule && <Graticule color="#1b5859" />}
      <Markers markers={markers} color={GOLD} />
    </group>
  );
});

/* ----------------------------- Globe components ---------------------------- */

function GlobeSphere({
  baseColor,
  detailColor,
  rimColor,
}: {
  baseColor: string;
  detailColor: string;
  rimColor: string;
}) {
  // Create a simple noise-based shader for a textured ocean look
  const uniforms = useMemo(
    () => ({
      uColorA: { value: new THREE.Color(baseColor) },
      uColorB: { value: new THREE.Color(detailColor) },
      uRimColor: { value: new THREE.Color(rimColor) },
      uTime: { value: 0 },
    }),
    [baseColor, detailColor, rimColor]
  );

  const matRef = useRef<THREE.ShaderMaterial>(null!);
  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value += delta * 0.05;
    }
  });

  return (
    <mesh>
      <icosahedronGeometry args={[1, 6]} />
      <shaderMaterial
        ref={matRef}
        transparent={false}
        vertexShader={/* glsl */ `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          void main(){
            vNormal = normalize(normalMatrix * normal);
            vec4 worldPosition = modelMatrix * vec4(position,1.0);
            vWorldPos = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
          }
        `}
        fragmentShader={/* glsl */ `
          varying vec3 vNormal;
          varying vec3 vWorldPos;
          uniform vec3 uColorA;
          uniform vec3 uColorB;
          uniform vec3 uRimColor;
          uniform float uTime;

          // Simple 3D noise (iq)
          float hash(vec3 p){ p=fract(p*0.3183099+vec3(0.1,0.2,0.3)); p*=17.0; return fract(p.x*p.y*p.z*(p.x+p.y+p.z)); }
          float noise(vec3 x){
            vec3 p = floor(x);
            vec3 f = fract(x);
            f = f*f*(3.0-2.0*f);
            float n = mix(
              mix(mix(hash(p+vec3(0,0,0)), hash(p+vec3(1,0,0)), f.x),
                  mix(hash(p+vec3(0,1,0)), hash(p+vec3(1,1,0)), f.x), f.y),
              mix(mix(hash(p+vec3(0,0,1)), hash(p+vec3(1,0,1)), f.x),
                  mix(hash(p+vec3(0,1,1)), hash(p+vec3(1,1,1)), f.x), f.y), f.z);
            return n;
          }

          void main(){
            // Ocean gradient with animated subtle noise
            float n = noise(normalize(vWorldPos)*3.0 + uTime);
            vec3 base = mix(uColorA, uColorB, n*0.35 + 0.25);

            // Rim lighting for spherical depth
            float rim = pow(1.0 - max(dot(normalize(vWorldPos), normalize(-cameraPosition)), 0.0), 2.0);
            vec3 color = base + uRimColor * rim * 0.2;

            gl_FragColor = vec4(color, 1.0);
          }
        `}
        uniforms={uniforms}
      />
    </mesh>
  );
}

function Atmosphere({ color = "#083335" }: { color?: string }) {
  return (
    <mesh scale={1.06}>
      <sphereGeometry args={[1, 64, 64]} />
      <meshBasicMaterial
        color={color}
        transparent
        opacity={0.08}
        blending={THREE.AdditiveBlending}
        side={THREE.BackSide}
      />
    </mesh>
  );
}

function Graticule({ color = "#185050" }: { color?: string }) {
  // Generate latitude/longitude lines
  const latLines = useMemo(() => buildLines(10, true), []);
  const lngLines = useMemo(() => buildLines(10, false), []);
  const mat = useMemo(
    () => new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.25 }),
    [color]
  );
  return (
    <group>
      {latLines.map((geo, i) => (
        <lineLoop key={`lat-${i}`} geometry={geo} material={mat} />
      ))}
      {lngLines.map((geo, i) => (
        <line key={`lng-${i}`} geometry={geo} material={mat} />
      ))}
    </group>
  );
}

function Markers({ markers, color = "#C4A36A" }: { markers: GlobeMarker[]; color?: string }) {
  const positions = useMemo(
    () =>
      markers.map((m) => latLngToVec3(m.lat, m.lng, 1.005)), // slightly above the surface
    [markers]
  );

  const col = new THREE.Color(color);
  const markerGeom = useMemo(() => new THREE.SphereGeometry(0.018, 16, 16), []);
  const markerMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: col, emissive: col, emissiveIntensity: 0.35, roughness: 0.4, metalness: 0.2 }),
    [col]
  );

  return (
    <group>
      {positions.map((pos, i) => (
        <mesh key={i} position={pos} geometry={markerGeom} material={markerMat}>
          {/* Tiny pillar to surface for a "pin" feeling */}
          <mesh position={[0, 0, 0]}>
            <cylinderGeometry args={[0.0035, 0.0035, 0.05, 8]} />
            <meshStandardMaterial color={col} roughness={0.6} metalness={0.1} />
          </mesh>
        </mesh>
      ))}
      {/* Optional connecting arcs from Sri Lanka (Colombo approx lat 6.9271, lng 79.8612) */}
      <Arcs
        from={{ lat: 6.9271, lng: 79.8612 }}
        tos={markers}
        color={color}
      />
    </group>
  );
}

/* ---------------------------------- Arcs ---------------------------------- */

function Arcs({
  from,
  tos,
  color = "#C4A36A",
}: {
  from: GlobeMarker;
  tos: GlobeMarker[];
  color?: string;
}) {
  const lines = useMemo(
    () =>
      tos.map((to) => buildArc(latLngToVec3(from.lat, from.lng, 1.01), latLngToVec3(to.lat, to.lng, 1.01))),
    [from.lat, from.lng, tos]
  );

  const mat = useMemo(
    () =>
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.55,
      }),
    [color]
  );

  // Animate "flow" using dashed material (simulate with varying dash offset)
  return (
    <group>
      {lines.map((geo, i) => (
        <FlowLine key={i} geometry={geo} color={color} />
      ))}
    </group>
  );
}

function FlowLine({ geometry, color }: { geometry: THREE.BufferGeometry; color: string }) {
  const matRef = useRef<THREE.LineDashedMaterial>(null!);
  useFrame((_, delta) => {
    if (matRef.current) {
      matRef.current.dashOffset -= delta * 0.3;
    }
  });

  return (
    <line geometry={geometry}>
      <lineDashedMaterial
        ref={matRef}
        color={color}
        linewidth={1}
        dashSize={0.06}
        gapSize={0.04}
        transparent
        opacity={0.7}
      />
    </line>
  );
}

/* ------------------------------ Math helpers ------------------------------ */

function latLngToVec3(lat: number, lng: number, radius = 1): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lng + 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

function buildLines(step = 10, latitude = true): THREE.BufferGeometry[] {
  const geos: THREE.BufferGeometry[] = [];
  for (let d = -80; d <= 80; d += step) {
    const pts: THREE.Vector3[] = [];
    for (let a = 0; a <= 360; a += 4) {
      const lat = latitude ? d : a;
      const lng = latitude ? a : d;
      pts.push(latLngToVec3(lat, lng, 1.002));
    }
    const geo = new THREE.BufferGeometry().setFromPoints(pts);
    geos.push(geo);
  }
  return geos;
}

function buildArc(a: THREE.Vector3, b: THREE.Vector3) {
  // Create a great-circle-like arc elevated above the sphere
  const mid = a.clone().add(b).multiplyScalar(0.5).normalize().multiplyScalar(1.25);
  const curve = new THREE.QuadraticBezierCurve3(a, mid, b);
  const points = curve.getPoints(64);
  const geo = new THREE.BufferGeometry().setFromPoints(points);
  geo.computeBoundingSphere();
  return geo;
}

/* -------------------------------- Defaults -------------------------------- */

const DEFAULT_MARKERS: GlobeMarker[] = [
  // A few sample export destinations (approx coords)
  { lat: 25.276987, lng: 55.296249, label: "Dubai, UAE" },
  { lat: 51.507351, lng: -0.127758, label: "London, UK" },
  { lat: 48.856613, lng: 2.352222, label: "Paris, FR" },
  { lat: 40.712776, lng: -74.005974, label: "New York, US" },
  { lat: 13.756331, lng: 100.501762, label: "Bangkok, TH" },
  { lat: 35.689487, lng: 139.691711, label: "Tokyo, JP" },
  { lat: -33.86882, lng: 151.20929, label: "Sydney, AU" },
];

/* --------------------------- Types for Drei JSX ---------------------------- */
// Extend JSX intrinsic elements for dashed line material in @react-three/fiber
declare global {
  namespace JSX {
    interface IntrinsicElements {
      lineDashedMaterial: ReactThreeFiber.Object3DNode<
        THREE.LineDashedMaterial,
        typeof THREE.LineDashedMaterial
      >;
    }
  }
}

