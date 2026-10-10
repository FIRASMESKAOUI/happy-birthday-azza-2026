import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import lightImg from '../assets/light.png';

interface Cake3DProps {
  candlesLit: boolean[];
  isLighting: boolean;
  isCutting: boolean;
  lightingIndex: number;
  sliceProgress?: number; // 0-100
  isCutterPhase?: boolean;
  isCutFinished?: boolean;
}

// ─── 45° Cake Slice Wedge (1/8 of circle) ─────────────────────────
const createCakeWedgeShape = (radius: number) => {
  const shape = new THREE.Shape();
  const halfAngle = Math.PI / 8; // 22.5 deg on each side = 45 deg total
  shape.moveTo(0, 0);
  shape.absarc(0, 0, radius, -halfAngle, halfAngle, false);
  shape.lineTo(0, 0);
  return shape;
};

// ─── Candle ───────────────────────────────────────────────────────
const Candle: React.FC<{ position: [number, number, number]; isLit: boolean }> = ({ position, isLit }) => {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (flameRef.current && isLit) {
      flameRef.current.scale.x = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
      flameRef.current.scale.y = 1 + Math.cos(state.clock.elapsedTime * 10) * 0.1;
      flameRef.current.scale.z = 1 + Math.sin(state.clock.elapsedTime * 10) * 0.1;
    }
  });

  return (
    <group position={position}>
      {/* Candle Body */}
      <mesh position={[0, 0.4, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.04, 0.04, 0.8, 16]} />
        <meshStandardMaterial color="#fffcf2" roughness={0.4} />
      </mesh>
      {/* Candle Wick */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.008, 0.008, 0.04, 8]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
      {/* Flame */}
      {isLit && (
        <mesh ref={flameRef} position={[0, 0.9, 0]}>
          <coneGeometry args={[0.06, 0.18, 16]} />
          <meshBasicMaterial color="#ffaa00" />
          <pointLight color="#ffcc55" intensity={1.5} distance={3} castShadow />
        </mesh>
      )}
    </group>
  );
};

// ─── Candle Positions and their host slice angles ────────────────
const candleBasePositions: [number, number, number][] = [
  [0.6, 1.3, 0.6],    // 45 deg -> slice 1
  [-0.6, 1.3, 0.6],   // 135 deg -> slice 3
  [0, 1.3, -0.7],     // 270 deg -> slice 6
  [-0.8, 1.3, -0.2],  // 180 deg -> slice 4
  [0.8, 1.3, -0.2],   // 0 deg -> slice 0
];

const candleSliceAngles = [
  Math.PI / 4,
  (3 * Math.PI) / 4,
  (6 * Math.PI) / 4,
  Math.PI,
  0,
];

// ─── Candles Manager (glides with slices) ─────────────────────────
const CandlesManager: React.FC<{
  candlesLit: boolean[];
  sliceProgress?: number;
  isCutFinished?: boolean;
}> = ({ candlesLit, sliceProgress = 0, isCutFinished = false }) => {
  const candleRefs = useRef<(THREE.Group | null)[]>([]);
  const candleDistRef = useRef(0);

  useFrame((_, delta) => {
    // Moves outward a tiny bit when cut (max 0.2 units)
    const target = isCutFinished
      ? 0.2
      : sliceProgress > 0
      ? (Math.min(100, sliceProgress) / 100) * 0.2
      : 0;

    candleDistRef.current = THREE.MathUtils.damp(candleDistRef.current, target, 5, delta);
    const d = candleDistRef.current;

    for (let j = 0; j < candleBasePositions.length; j++) {
      const cg = candleRefs.current[j];
      if (cg) {
        const [ox, , oz] = candleBasePositions[j];
        const ang = candleSliceAngles[j];
        cg.position.x = ox + Math.cos(ang) * d;
        cg.position.z = oz + Math.sin(ang) * d;
      }
    }
  });

  return (
    <>
      {candleBasePositions.map((pos, i) => (
        <group
          key={i}
          ref={(el) => {
            candleRefs.current[i] = el;
          }}
          position={pos}
        >
          <Candle position={[0, 0, 0]} isLit={candlesLit[i]} />
        </group>
      ))}
    </>
  );
};

// ─── 8-Piece Cake Model ───────────────────────────────────────────
interface CakeModelProps {
  isCutting: boolean;
  sliceProgress?: number;
  isCutFinished?: boolean;
}

const CakeModel: React.FC<CakeModelProps> = ({ sliceProgress = 0, isCutFinished = false }) => {
  const sliceRefs = useRef<(THREE.Group | null)[]>([]);
  const currentDistRef = useRef(0);

  // Reusable 45° wedge geometries for the 8 slices
  const bottomWedgeShape = React.useMemo(() => createCakeWedgeShape(2), []);
  const topWedgeShape = React.useMemo(() => createCakeWedgeShape(1.3), []);

  const extrudeBottom = React.useMemo(() => ({ depth: 1, bevelEnabled: false, curveSegments: 24 }), []);
  const extrudeTop = React.useMemo(() => ({ depth: 0.8, bevelEnabled: false, curveSegments: 24 }), []);

  useFrame((_, delta) => {
    // Slices move slightly outward when cut ("s'éloigne un très peu", max ~0.2)
    const targetDist = isCutFinished
      ? 0.2
      : sliceProgress > 0
      ? (Math.min(100, sliceProgress) / 100) * 0.2
      : 0;

    currentDistRef.current = THREE.MathUtils.damp(currentDistRef.current, targetDist, 5, delta);
    const d = currentDistRef.current;

    for (let i = 0; i < 8; i++) {
      const g = sliceRefs.current[i];
      if (g) {
        const angle = (i * Math.PI) / 4;
        g.position.x = Math.cos(angle) * d;
        g.position.z = Math.sin(angle) * d;
      }
    }
  });

  return (
    <group position={[0, -0.5, 0]}>
      {/* Plate */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <cylinderGeometry args={[2.8, 2.8, 0.1, 32]} />
        <meshPhysicalMaterial color="#ffffff" roughness={0.1} metalness={0.1} clearcoat={1.0} clearcoatRoughness={0.1} />
      </mesh>
      {/* Plate Inner Rim */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <torusGeometry args={[2.5, 0.05, 16, 64]} />
        <meshPhysicalMaterial color="#e0e0e0" roughness={0.2} metalness={0.2} clearcoat={1.0} clearcoatRoughness={0.2} />
      </mesh>

      {/* ── 8 Cake Slices (Separate slightly on cut) ─────────────── */}
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * Math.PI) / 4;
        return (
          <group
            key={`slice-${i}`}
            ref={(el) => {
              sliceRefs.current[i] = el;
            }}
            rotation={[0, -angle, 0]}
          >
            {/* Bottom Tier Slice */}
            <mesh position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <extrudeGeometry args={[bottomWedgeShape, extrudeBottom]} />
              <meshPhysicalMaterial color="#f48fb1" roughness={0.8} clearcoat={0.1} />
            </mesh>

            {/* Top Tier Slice */}
            <mesh position={[0, 1, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
              <extrudeGeometry args={[topWedgeShape, extrudeTop]} />
              <meshPhysicalMaterial color="#fce4ec" roughness={0.7} clearcoat={0.2} />
            </mesh>

            {/* 1 Strawberry on each slice */}
            <mesh position={[1.1, 1.82, 0]} castShadow>
              <sphereGeometry args={[0.12, 16, 16]} />
              <meshPhysicalMaterial color="#d32f2f" roughness={0.2} clearcoat={1.0} clearcoatRoughness={0.1} />
            </mesh>
          </group>
        );
      })}
    </group>
  );
};

// ─── Lighter Tool ─────────────────────────────────────────────────
const Lighter: React.FC<{
  positions: [number, number, number][];
  isLighting: boolean;
  lightingIndex: number;
}> = ({ positions, isLighting, lightingIndex }) => {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useTexture(lightImg);

  useFrame(() => {
    if (ref.current) {
      if (isLighting && lightingIndex >= 0 && lightingIndex < positions.length) {
        const targetPos = new THREE.Vector3(
          positions[lightingIndex][0] - 0.9,
          positions[lightingIndex][1] + 1.0,
          positions[lightingIndex][2] + 0.8
        );
        ref.current.position.lerp(targetPos, 0.1);
        ref.current.position.y += Math.sin(Date.now() * 0.01) * 0.02;
        ref.current.rotation.z = Math.sin(Date.now() * 0.005) * 0.1 - 0.15;
        (ref.current.material as THREE.Material).opacity = THREE.MathUtils.lerp(
          (ref.current.material as THREE.Material).opacity,
          1,
          0.1
        );
      } else {
        ref.current.position.lerp(new THREE.Vector3(5, 5, 5), 0.05);
        (ref.current.material as THREE.Material).opacity = THREE.MathUtils.lerp(
          (ref.current.material as THREE.Material).opacity,
          0,
          0.05
        );
      }
    }
  });

  return (
    <mesh ref={ref} position={[5, 5, 5]} rotation={[0, -Math.PI / 4, 0]}>
      <planeGeometry args={[1.2, 1.2]} />
      <meshBasicMaterial map={texture} transparent={true} side={THREE.DoubleSide} opacity={0} depthWrite={false} />
    </mesh>
  );
};

// ─── Main Cake3D Component ────────────────────────────────────────
export const Cake3D: React.FC<Cake3DProps> = ({
  candlesLit,
  isLighting,
  isCutting,
  lightingIndex,
  sliceProgress = 0,
  isCutterPhase = false,
  isCutFinished = false,
}) => {
  return (
    <div style={{ width: '100%', height: '450px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Canvas shadows camera={{ position: isCutterPhase ? [0, 5, 9.5] : [0, 4.5, 8.5], fov: 42 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />

        {/* 8-Slice Separating Cake */}
        <CakeModel isCutting={isCutting} sliceProgress={sliceProgress} isCutFinished={isCutFinished} />

        {/* Candles that glide with the slices */}
        <CandlesManager candlesLit={candlesLit} sliceProgress={sliceProgress} isCutFinished={isCutFinished} />

        {/* Lighter tool */}
        <Lighter positions={candleBasePositions} isLighting={isLighting} lightingIndex={lightingIndex} />

        <OrbitControls
          enableZoom={false}
          autoRotate={!isCutting && !isLighting && !isCutFinished}
          autoRotateSpeed={1.5}
          maxPolarAngle={Math.PI / 2 - 0.1}
          target={[0, 0.5, 0]}
        />
      </Canvas>
    </div>
  );
};

export default Cake3D;
