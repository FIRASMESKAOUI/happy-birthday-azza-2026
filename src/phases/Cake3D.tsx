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

const createCakeShape = (radius: number, startAngle: number, endAngle: number) => {
  const shape = new THREE.Shape();
  shape.moveTo(0, 0);
  shape.arc(0, 0, radius, startAngle, endAngle, false);
  shape.lineTo(0, 0);
  return shape;
};

const Candle: React.FC<{ position: [number, number, number], isLit: boolean }> = ({ position, isLit }) => {
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

const CakeModel: React.FC<{ isCutting: boolean }> = ({ isCutting }) => {
  const mainGroupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    // No animations for cutting anymore as requested
  });

  // No slice missing
  const sliceAngle = 0;

  // Generate positions for strawberries around the top edge
  const strawberryPositions: [number, number, number][] = [];
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * (Math.PI * 2);
    // don't place strawberries on the slice area if we want it clean, but let's just place them.
    // the slice is from 0 to PI/4
    if (angle > sliceAngle || !isCutting) {
      strawberryPositions.push([Math.cos(angle) * 1.1, 1.82, Math.sin(angle) * 1.1]);
    }
  }

  const mainBottomShape = React.useMemo(() => createCakeShape(2, sliceAngle, Math.PI * 2), [sliceAngle]);
  const mainTopShape = React.useMemo(() => createCakeShape(1.3, sliceAngle, Math.PI * 2), [sliceAngle]);

  const extrudeBottom = { depth: 1, bevelEnabled: false, curveSegments: 32 };
  const extrudeTop = { depth: 0.8, bevelEnabled: false, curveSegments: 32 };

  return (
    <group position={[0, -0.5, 0]}>
      {/* Main Cake and Big Plate Group */}
      <group ref={mainGroupRef}>
        {/* Plate */}
        <mesh position={[0, -0.05, 0]} receiveShadow>
          <cylinderGeometry args={[2.8, 2.8, 0.1, 32]} />
          <meshPhysicalMaterial color="#ffffff" roughness={0.1} metalness={0.1} clearcoat={1.0} clearcoatRoughness={0.1} />
        </mesh>
        {/* Plate Inner Rim */}
        <mesh position={[0, 0, 0]} rotation={[Math.PI/2, 0, 0]} receiveShadow>
          <torusGeometry args={[2.5, 0.05, 16, 64]} />
          <meshPhysicalMaterial color="#e0e0e0" roughness={0.2} metalness={0.2} clearcoat={1.0} clearcoatRoughness={0.2} />
        </mesh>

        {/* Main Cake (Missing Slice) */}
        {/* Bottom Tier (Main) Solid */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]} castShadow receiveShadow>
          <extrudeGeometry args={[mainBottomShape, extrudeBottom]} />
          <meshPhysicalMaterial color="#f48fb1" roughness={0.8} clearcoat={0.1} />
        </mesh>
        
        {/* Top Tier (Main) Solid */}
        <mesh position={[0, 1, 0]} rotation={[-Math.PI/2, 0, 0]} castShadow receiveShadow>
          <extrudeGeometry args={[mainTopShape, extrudeTop]} />
          <meshPhysicalMaterial color="#fce4ec" roughness={0.7} clearcoat={0.2} />
        </mesh>

        {/* Strawberries on main cake */}
        {strawberryPositions.map((pos, i) => (
          <mesh key={i} position={pos} castShadow>
            <sphereGeometry args={[0.12, 16, 16]} />
            <meshPhysicalMaterial color="#d32f2f" roughness={0.2} clearcoat={1.0} clearcoatRoughness={0.1} />
          </mesh>
        ))}

        {/* Cut indication lines on the cake */}
        {isCutting && (
          <>
            {/* Cut line 1 */}
            <mesh position={[0, 1.81, 0]} rotation={[-Math.PI/2, 0, 0]}>
              <planeGeometry args={[0.03, 2]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
            {/* Cut line 2 - at 45 degrees */}
            <mesh position={[0, 1.81, 0]} rotation={[-Math.PI/2, 0, -Math.PI/4]}>
              <planeGeometry args={[0.03, 2]} />
              <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
            </mesh>
            {/* Dotted arc between the two cut lines */}
            {[0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7].map((t, i) => {
              const angle = t * (Math.PI / 4);
              return (
                <mesh key={`dot-${i}`} position={[Math.cos(angle) * 0.6, 1.82, Math.sin(angle) * 0.6]}>
                  <sphereGeometry args={[0.02, 8, 8]} />
                  <meshBasicMaterial color="#ffffff" transparent opacity={0.5} />
                </mesh>
              );
            })}
          </>
        )}
      </group>
    </group>
  );
};

const Lighter: React.FC<{ 
  positions: [number, number, number][], 
  isLighting: boolean, 
  lightingIndex: number 
}> = ({ positions, isLighting, lightingIndex }) => {
  const ref = useRef<THREE.Mesh>(null);
  const texture = useTexture(lightImg);

  useFrame(() => {
    if (ref.current) {
      if (isLighting && lightingIndex >= 0 && lightingIndex < positions.length) {
        // Move to the current candle
        // Since the flame is on the far right of the image, we shift the image to the left (-X) and forward (+Z)
        const targetPos = new THREE.Vector3(
          positions[lightingIndex][0] - 0.9,
          positions[lightingIndex][1] + 1.0,
          positions[lightingIndex][2] + 0.8
        );
        ref.current.position.lerp(targetPos, 0.1);
        
        // Add a slight bobbing motion
        ref.current.position.y += Math.sin(Date.now() * 0.01) * 0.02;
        ref.current.rotation.z = Math.sin(Date.now() * 0.005) * 0.1 - 0.15; // slight tilt
        
        (ref.current.material as THREE.Material).opacity = THREE.MathUtils.lerp((ref.current.material as THREE.Material).opacity, 1, 0.1);
      } else {
        // Move away and hide
        ref.current.position.lerp(new THREE.Vector3(5, 5, 5), 0.05);
        (ref.current.material as THREE.Material).opacity = THREE.MathUtils.lerp((ref.current.material as THREE.Material).opacity, 0, 0.05);
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

export const Cake3D: React.FC<Cake3DProps> = ({ candlesLit, isLighting, isCutting, lightingIndex, isCutterPhase = false, isCutFinished = false }) => {
  const candlePositions: [number, number, number][] = [
    [0.6, 1.3, 0.6],
    [-0.6, 1.3, 0.6],
    [0, 1.3, -0.7],
    [-0.8, 1.3, -0.2],
    [0.8, 1.3, -0.2],
  ];

  return (
    <div style={{ width: '100%', height: '450px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Canvas shadows camera={{ position: isCutterPhase ? [0, 5, 9.5] : [0, 4.5, 8.5], fov: 42 }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow shadow-mapSize-width={1024} shadow-mapSize-height={1024} />
        <pointLight position={[-5, 5, -5]} intensity={0.5} />
        <CakeModel isCutting={isCutting} />
        
        {candlePositions.map((pos, i) => (
          <Candle key={i} position={pos} isLit={candlesLit[i]} />
        ))}
        
        <Lighter positions={candlePositions} isLighting={isLighting} lightingIndex={lightingIndex} />
        
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
