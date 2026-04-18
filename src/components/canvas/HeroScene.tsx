import { Suspense, useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import { EffectComposer, Bloom, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import { easing } from 'maath';
import ProjectImage from './ProjectImage';

import { useStore } from '../../store/useStore';

const PROJECTS = [
  { id: 1, url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=800&h=600&fit=crop' },
  { id: 2, url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?q=80&w=800&h=600&fit=crop' },
  { id: 3, url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&h=600&fit=crop' },
  { id: 4, url: 'https://images.unsplash.com/photo-1476820865390-c52aeebb9891?q=80&w=800&h=600&fit=crop' },
];

function HUDPath() {
  const scrollProgress = useStore((state) => state.scrollProgress);
  const lineRef = useRef<any>(null);

  const curve = useMemo(() => {
    const points = [
      new THREE.Vector3(0, -2, 10),
      new THREE.Vector3(-3, -2, -5),
      new THREE.Vector3(3, -2, -20),
      new THREE.Vector3(-4, -2, -35),
      new THREE.Vector3(2, -2, -50),
      new THREE.Vector3(-1, -2, -70)
    ];
    return new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5);
  }, []);

  const linePoints = useMemo(() => curve.getPoints(200), [curve]);

  useFrame(() => {
    if (lineRef.current && lineRef.current.material) {
      const drawProgress = Math.min(scrollProgress * 1.2, 1);
      lineRef.current.material.dashOffset = 1 - drawProgress;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={linePoints}
      color={new THREE.Color(2, 2, 2)} // Values > 1.0 to trigger bloom
      lineWidth={3}
      dashed={true}
      dashScale={2}
      dashSize={2}
      dashOffset={1}
      transparent
      opacity={0.4}
    />
  );
}

function Particles({ count = 1000 }) {
  const pointsRef = useRef<THREE.Points>(null);

  const particles = useMemo(() => {
    const temp = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      temp[i * 3] = (Math.random() - 0.5) * 30;
      temp[i * 3 + 1] = (Math.random() - 0.5) * 30;
      temp[i * 3 + 2] = (Math.random() - 0.5) * 80;
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.position.z = (state.clock.elapsedTime * 0.5) % 20;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particles.length / 3}
          array={particles}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color={new THREE.Color(1.5, 1.5, 1.5)} transparent opacity={0.3} sizeAttenuation />
    </points>
  );
}

function usePerformanceTier() {
  const [tier, setTier] = useState(() => ({
    isMobile: false,
    dprMax: 1.75,
    particleCount: 850,
    bloomIntensity: 1.1,
    enableDof: true,
  }));

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isMobile = window.innerWidth < 768;
    const lowCpu = (navigator.hardwareConcurrency ?? 8) <= 4;
    const lowMemory = (navigator as Navigator & { deviceMemory?: number }).deviceMemory
      ? ((navigator as Navigator & { deviceMemory?: number }).deviceMemory as number) <= 4
      : false;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lowPerf = isMobile || lowCpu || lowMemory || prefersReducedMotion;

    setTier({
      isMobile,
      dprMax: lowPerf ? 1.25 : 1.75,
      particleCount: lowPerf ? 450 : 850,
      bloomIntensity: lowPerf ? 0.85 : 1.15,
      enableDof: !lowPerf,
    });
  }, []);

  return tier;
}

function CameraController() {
  const isLoaded = useStore((state) => state.isLoaded);
  const scrollProgress = useStore((state) => state.scrollProgress);
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useFrame((state, delta) => {
    // Map scroll progress to camera Z position
    // Start at Z=10, move to Z=-40 at the bottom (travel 50 units)
    // Keep travel distance consistent (50) to match project Z-positions for perfect sync
    const travelDistance = 50;
    const targetZ = isLoaded ? 10 - scrollProgress * travelDistance : 10;
    
    // Add slight sway based on scroll progress (simulating driving along the winding path)
    const swayX = Math.sin(scrollProgress * Math.PI * 4) * 1.5;
    const swayY = Math.cos(scrollProgress * Math.PI * 2) * 0.2;
    
    // Add subtle mouse parallax (disabled on mobile for performance and snappiness)
    const targetX = (isMobile ? 0 : (state.pointer.x * 2) * 0.5) + swayX;
    const targetY = (isMobile ? 0 : (state.pointer.y * 2) * 0.5) + swayY;

    // Snappier smoothing on mobile (0.1 instead of 0.25)
    const smoothing = isMobile ? 0.1 : 0.25;
    easing.damp3(state.camera.position, [targetX, targetY, targetZ], smoothing, delta);
  });
  return null;
}

export default function HeroScene() {
  const perfTier = usePerformanceTier();

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Canvas 
        camera={{ position: [0, 0, 10], fov: perfTier.isMobile ? 65 : 50 }} 
        dpr={[1, perfTier.dprMax]}
        eventSource={typeof document !== 'undefined' ? document.body : undefined}
        eventPrefix="client"
      >
        <Suspense fallback={null}>
          <color attach="background" args={['#09090b']} />
          <ambientLight intensity={0.2} />
          {/* Subtle fog to create a depth-of-field / atmospheric effect */}
          <fog attach="fog" args={['#09090b', 10, 40]} />
          
          <HUDPath />
          <Particles count={perfTier.particleCount} />

          {/* Render projects spaced out along the Z-axis */}
          {PROJECTS.map((proj, i) => (
            <ProjectImage 
              key={proj.id} 
              index={proj.id} 
              url={proj.url} 
              position={[0, -2, -16 - i * 8]} 
            />
          ))}

          <CameraController />

          {/* Post-processing for Sci-Fi look */}
          <EffectComposer multisampling={perfTier.enableDof ? 4 : 0}>
            <Bloom 
              luminanceThreshold={1.1} // 亮度阈值：设为 1.1 可以保护普通图片不发光，只让纯白线条发光。
              mipmapBlur 
              intensity={perfTier.bloomIntensity}   // 发光强度：控制那些超过阈值的像素发出的光晕有多亮。
            />
            {perfTier.enableDof && (
              <DepthOfField 
                focusDistance={0.15} // 对焦距离：决定画面中哪个距离的物体最清晰
                focalLength={0.02} // 焦距：值越大，偏离对焦点的物体模糊得越快
                bokehScale={0.5}  // 散景缩放/模糊强度：值越大，模糊的程度和光斑越大
                height={360} 
              />
            )}
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
