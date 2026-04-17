import { useRef, useMemo, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import { easing } from 'maath';
import { useStore } from '../../store/useStore';

const vertexShader = `
  varying vec2 vUv;
  varying float vFogDepth;
  void main() {
    vUv = uv;
    vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    vFogDepth = -mvPosition.z;
  }
`;

const fragmentShader = `
  uniform sampler2D uTexture;
  uniform float uFocus;
  uniform float uOpacity;
  uniform float uTime;
  
  // Fog uniforms
  uniform vec3 uFogColor;
  uniform float uFogNear;
  uniform float uFogFar;
  
  varying vec2 vUv;
  varying float vFogDepth;

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    
    // Grayscale conversion (optional, but let's keep it subtle or just use darkened original color)
    // Instead of white holographic tint, we use a darkened version of the original color
    vec3 inactiveBase = texColor.rgb * 0.3;
    
    // Scanlines (animated)
    float scanline = sin(vUv.y * 800.0 - uTime * 10.0) * 0.02;
    
    // Rounded corners SDF
    vec2 p = vUv * 2.0 - 1.0;
    p.x *= 4.0/3.0; // Adjust for 4:3 aspect ratio
    vec2 b = vec2(4.0/3.0, 1.0) - vec2(0.15); // 0.15 is the border radius
    float d = length(max(abs(p) - b, 0.0)) - 0.15;
    
    // Alpha mask for rounded corners
    float alpha = 1.0 - smoothstep(0.0, 0.02, d);
    
    // Inner Edge Glow (Sci-Fi Border) - make it much more subtle
    float innerGlow = smoothstep(-0.08, 0.0, d);
    float borderLine = smoothstep(-0.02, 0.0, d) * smoothstep(0.0, -0.02, d - 0.01);
    
    vec3 glowColor = vec3(1.0, 1.0, 1.0) * (innerGlow * 0.1 + borderLine * 0.3);
    
    // Mix based on focus (0.0 = inactive & dim, 1.0 = full color)
    vec3 inactiveState = inactiveBase + vec3(scanline) + glowColor;
    
    // Boost contrast slightly for active state to prevent "whitish" look
    vec3 activeState = texColor.rgb;
    activeState = mix(vec3(0.0), activeState, 1.1); // Subtle contrast boost
    
    vec3 finalColor = mix(inactiveState, activeState, uFocus);
    
    // Add some noise to the inactive state
    float noise = fract(sin(dot(vUv * (uTime + 1.0), vec2(12.9898, 78.233))) * 43758.5453) * 0.03;
    finalColor += mix(vec3(noise), vec3(0.0), uFocus);
    
    gl_FragColor = vec4(finalColor, texColor.a * alpha * uOpacity);
    
    // Apply Fog (fade into background color and become transparent)
    float fogFactor = smoothstep(uFogNear, uFogFar, vFogDepth);
    gl_FragColor.rgb = mix(gl_FragColor.rgb, uFogColor, fogFactor);
    gl_FragColor.a *= (1.0 - fogFactor * 0.9); // Fade out up to 90% in the distance
  }
`;

export default function ProjectImage({ url, index, position }: { url: string, index: number, position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const frameRef = useRef(0);
  const isMobileRef = useRef(false);
  const texture = useTexture(url);
  if (texture) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  const activeProjectId = useStore((state) => state.activeProjectId);
  const isLoaded = useStore((state) => state.isLoaded);
  const introState = useStore((state) => state.introState);

  // Hover state and pointer position for parallax effect
  const [hovered, setHovered] = useState(false);
  const pointerRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const update = () => {
      isMobileRef.current = window.innerWidth < 768;
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  // Generate stable pseudo-random values for dispersion based on index
  const randoms = useMemo(() => {
    const rx = Math.sin(index * 12.9898) * 43758.5453;
    const ry = Math.sin(index * 78.233) * 43758.5453;
    const rz = Math.sin(index * 37.719) * 43758.5453;
    const rx2 = Math.sin(index * 91.321) * 43758.5453;
    
    return {
      x: (rx - Math.floor(rx) - 0.5) * 2,
      y: (ry - Math.floor(ry) - 0.5) * 2,
      rotZ: (rz - Math.floor(rz) - 0.5) * 0.5,
      rotX: (rx2 - Math.floor(rx2) - 0.5) * 0.5,
    };
  }, [index]);

  const uniforms = useMemo(() => ({
    uTexture: { value: texture },
    uFocus: { value: 0.0 },
    uOpacity: { value: 1.0 },
    uTime: { value: 0.0 },
    uFogColor: { value: new THREE.Color('#09090b') },
    uFogNear: { value: 10.0 },
    uFogFar: { value: 40.0 }
  }), [texture]);

  useFrame((state, delta) => {
    frameRef.current += 1;

    const isActive = activeProjectId === index;
    const isMobile = isMobileRef.current;
    const cameraDistance = Math.abs(state.camera.position.z - position[2]);
    const shouldThrottle = !isActive && !hovered && cameraDistance > 22;
    if (shouldThrottle && frameRef.current % 2 !== 0) return;

    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }

    // When not fully loaded, keep them in grayscale
    const targetFocus = (isActive && isLoaded) ? 1.0 : 0.0;
    
    // Animate focus uniform for color/grayscale transition
    if (materialRef.current) {
      easing.damp(materialRef.current.uniforms.uFocus, 'value', targetFocus, 0.4, delta);
    }

    // Animate rotation, scale, and position based on active state
    if (groupRef.current) {
      const isLeft = index % 2 === 0;
      const sideMultiplier = isLeft ? -1 : 1;

      // --- 1. STACKED STATE (Loading) ---
      // Tightly stacked in the center, close to camera
      const stackedPosX = randoms.x * 0.2;
      const stackedPosY = randoms.y * 0.2;
      const stackedPosZ = 2 - index * 0.1; // Slight Z offset to prevent Z-fighting
      const stackedRotX = 0; 
      const stackedRotY = 0;
      const stackedRotZ = randoms.rotZ * 0.1; // Very subtle tilt
      const stackedScale = 1.0;

      // --- 3. HERO STATE (Loaded & Scrolling) ---
      // Calculate distance from camera to image along Z axis
      const distanceToCamera = Math.max(0, state.camera.position.z - position[2]);
      
      // Distant cards lay flatter (-Math.PI / 2.1 ≈ -85 deg). 
      // As camera approaches (distanceToCamera decreases), they tilt up slightly to anticipate becoming active.
      const dynamicInactiveRotX = -Math.PI / 2.1 + Math.max(0, (30 - distanceToCamera) * 0.015);
      
      // Add a slight dynamic Z rotation (twist) based on depth for a more organic, flowing look
      const dynamicInactiveRotZ = randoms.rotZ * 0.15 + Math.sin(distanceToCamera * 0.05) * 0.1;

      // Default: Dynamic laying flat. Focus: Upright (-0.05)
      const spreadRotX = isActive ? -0.05 : dynamicInactiveRotX;
      const spreadRotY = 0;
      const spreadRotZ = isActive ? 0 : dynamicInactiveRotZ;
      
      // On mobile, reduce scale and X-offset to fit narrow screens
      const spreadScale = isActive ? (isMobile ? 0.9 : 1.2) : 0.9;
      // Move up slightly when active to center it, drop down when inactive
      // On mobile, raise it more (position[1] + 3.5) to avoid being covered by cards
      const spreadPosY = isActive ? (isMobile ? position[1] + 3.5 : position[1] + 2) : position[1] - 1;
      
      // Shift X position based on odd/even index to make room for 2D text
      // On mobile, center them more (0.5 offset instead of 1.5)
      const xOffset = isMobile ? 0.5 : 1.5;
      const spreadPosX = isActive ? (index % 2 === 0 ? xOffset : -xOffset) : position[0] + randoms.x * 0.5;
      const spreadPosZ = position[2];

      // --- TARGET SELECTION BASED ON INTRO STATE ---
      let targetRotX, targetRotY, targetRotZ, targetScale, targetPosX, targetPosY, targetPosZ;
      
      if (introState === 'loading') {
        targetRotX = stackedRotX;
        targetRotY = stackedRotY;
        targetRotZ = stackedRotZ;
        targetScale = stackedScale;
        targetPosX = stackedPosX;
        targetPosY = stackedPosY;
        targetPosZ = stackedPosZ;
      } else {
        targetRotX = spreadRotX;
        targetRotY = spreadRotY;
        targetRotZ = spreadRotZ;
        targetScale = spreadScale;
        targetPosX = spreadPosX;
        targetPosY = spreadPosY;
        targetPosZ = spreadPosZ;
      }

      // Apply hover parallax effect
      if (hovered && introState === 'hero') {
        // Tilt based on mouse position relative to the image center
        // Negative for Y to make it follow the mouse naturally
        targetRotX += pointerRef.current.y * 0.5;
        targetRotY += pointerRef.current.x * -0.5;
        // Slightly increase scale on hover
        targetScale *= 1.05;
      }

      // Dynamic damp speed for different animation phases
      let dampSpeed = isMobile ? 0.15 : 0.3; 
      if (shouldThrottle) dampSpeed *= 0.7;
      if (introState === 'hero' && !isLoaded) {
        dampSpeed = 0.45; // Faster transition
      }

      // Calculate opacity and position adjustments based on camera distance 
      let targetOpacity = 1.0;
      if (introState === 'hero') {
        const signedDistance = state.camera.position.z - targetPosZ;
        if (signedDistance < 4.0) {
          // Fade out completely when camera is close
          targetOpacity = Math.max(0, (signedDistance - 1.5) / 2.5);
          
          // Push it slightly down and tilt it back to enhance the passing effect
          targetPosY -= (4.0 - signedDistance) * 0.5;
          targetRotX -= (4.0 - signedDistance) * 0.1;
        }
      }

      if (materialRef.current) {
        easing.damp(materialRef.current.uniforms.uOpacity, 'value', targetOpacity, dampSpeed, delta);
      }

      easing.dampE(groupRef.current.rotation, [targetRotX, targetRotY, targetRotZ], dampSpeed, delta);
      easing.damp3(groupRef.current.scale, [targetScale, targetScale, 1], dampSpeed, delta);
      easing.damp3(groupRef.current.position, [targetPosX, targetPosY, targetPosZ], dampSpeed, delta);
    }
  });

  return (
    <group ref={groupRef} position={position}>
      <mesh
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
        }}
        onPointerOut={(e) => {
          setHovered(false);
          pointerRef.current = { x: 0, y: 0 };
        }}
        onPointerMove={(e) => {
          e.stopPropagation();
          // e.uv is between 0 and 1, we want -0.5 to 0.5
          if (e.uv) {
            pointerRef.current = {
              x: e.uv.x - 0.5,
              y: e.uv.y - 0.5
            };
          }
        }}
      >
        <planeGeometry args={[4, 3, 32, 32]} />
        <shaderMaterial 
          ref={materialRef}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={uniforms}
          transparent
        />
      </mesh>
      
      {/* Label */}
      <Text
        position={[0, -1.9, 0]}
        fontSize={0.2}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {`0${index} // FEATURED`}
      </Text>
    </group>
  );
}
