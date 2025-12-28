import { Suspense, useRef, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { 
  OrbitControls, 
  Float, 
  MeshDistortMaterial,
  RoundedBox,
  useGLTF,
  Environment,
  ContactShadows,
  Html
} from "@react-three/drei";
import * as THREE from "three";

// Hook to get CSS variable colors for theme integration
const useThemeColors = () => {
  const [colors, setColors] = useState({
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#0a0a0a",
  });

  useEffect(() => {
    const updateColors = () => {
      const root = document.documentElement;
      const computedStyle = getComputedStyle(root);
      
      // Get HSL values from CSS variables and convert to hex
      const isDark = root.classList.contains("dark");
      
      setColors({
        primary: isDark ? "#60a5fa" : "#3b82f6",
        secondary: isDark ? "#a78bfa" : "#8b5cf6",
        accent: isDark ? "#22d3ee" : "#06b6d4",
        background: isDark ? "#0a0a0a" : "#fafafa",
      });
    };

    updateColors();
    
    // Watch for theme changes
    const observer = new MutationObserver(updateColors);
    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ["class"] 
    });

    return () => observer.disconnect();
  }, []);

  return colors;
};

// Laptop-style 3D model component (placeholder - replace with custom GLTF)
const LaptopModel = ({ colors }: { colors: ReturnType<typeof useThemeColors> }) => {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (groupRef.current) {
      // Subtle floating animation
      groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0.1, -0.3, 0]} scale={0.8}>
      {/* Laptop Base */}
      <RoundedBox args={[3, 0.15, 2]} radius={0.05} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
      </RoundedBox>
      
      {/* Keyboard area */}
      <RoundedBox args={[2.6, 0.02, 1.4]} radius={0.02} position={[0, 0.085, 0.2]}>
        <meshStandardMaterial color="#2d2d44" metalness={0.5} roughness={0.4} />
      </RoundedBox>
      
      {/* Trackpad */}
      <RoundedBox args={[0.8, 0.01, 0.5]} radius={0.02} position={[0, 0.09, 0.6]}>
        <meshStandardMaterial color="#3d3d5c" metalness={0.6} roughness={0.3} />
      </RoundedBox>
      
      {/* Screen (lid) */}
      <group position={[0, 1.1, -0.95]} rotation={[-0.3, 0, 0]}>
        {/* Screen frame */}
        <RoundedBox args={[3, 2, 0.1]} radius={0.05}>
          <meshStandardMaterial color="#1a1a2e" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        
        {/* Screen display */}
        <RoundedBox args={[2.7, 1.7, 0.02]} radius={0.02} position={[0, 0, 0.06]}>
          <MeshDistortMaterial
            color={colors.primary}
            speed={2}
            distort={0.1}
            radius={1}
            metalness={0.1}
            roughness={0.1}
            emissive={colors.primary}
            emissiveIntensity={0.3}
          />
        </RoundedBox>
        
        {/* Code lines on screen (decorative) */}
        {[...Array(5)].map((_, i) => (
          <mesh key={i} position={[-0.8 + Math.random() * 0.3, 0.5 - i * 0.25, 0.08]}>
            <boxGeometry args={[0.8 + Math.random() * 0.8, 0.06, 0.01]} />
            <meshStandardMaterial 
              color={i % 2 === 0 ? colors.secondary : colors.accent} 
              emissive={i % 2 === 0 ? colors.secondary : colors.accent}
              emissiveIntensity={0.5}
            />
          </mesh>
        ))}
      </group>
      
      {/* Floating geometric accents */}
      <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[2.8, 2, 0.5]}>
          <icosahedronGeometry args={[0.5, 0]} />
          <MeshDistortMaterial
            color={colors.accent}
            speed={3}
            distort={0.2}
            metalness={0.8}
            roughness={0.1}
            emissive={colors.accent}
            emissiveIntensity={0.4}
          />
        </mesh>
      </Float>
      
      <Float speed={3} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh position={[-2.5, 2.2, 0]}>
          <torusGeometry args={[0.25, 0.08, 16, 32]} />
          <MeshDistortMaterial
            color={colors.secondary}
            speed={2}
            distort={0.1}
            metalness={0.9}
            roughness={0.1}
            emissive={colors.secondary}
            emissiveIntensity={0.3}
          />
        </mesh>
      </Float>
      
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.6}>
        <mesh position={[1.8, 2.8, -0.5]}>
          <octahedronGeometry args={[0.3, 0]} />
          <MeshDistortMaterial
            color={colors.primary}
            speed={2.5}
            distort={0.15}
            metalness={0.7}
            roughness={0.2}
            emissive={colors.primary}
            emissiveIntensity={0.35}
          />
        </mesh>
      </Float>
    </group>
  );
};

// Loading fallback component
const LoadingFallback = () => (
  <Html center>
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  </Html>
);

// Scene setup with lighting
const Scene = () => {
  const colors = useThemeColors();
  
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1} color="#ffffff" />
      <pointLight position={[-5, 5, 5]} intensity={0.5} color={colors.primary} />
      <pointLight position={[5, 5, -5]} intensity={0.3} color={colors.secondary} />
      
      {/* Main model */}
      <LaptopModel colors={colors} />
      
      {/* Contact shadows for grounding */}
      <ContactShadows
        position={[0, -2.5, 0]}
        opacity={0.5}
        scale={20}
        blur={3}
        far={6}
      />
      
      {/* Environment for reflections */}
      <Environment preset="city" />
      
      {/* Orbit controls for drag interaction */}
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={1}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 2}
      />
    </>
  );
};

// Main exported component
export const HeroModel = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  // Preload after critical content
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full min-h-[60vh] lg:min-h-[80vh]">
      <Canvas
        camera={{ position: [0, 2, 7], fov: 50 }}
        dpr={[1, 2]}
        gl={{ 
          antialias: true,
          alpha: true,
          powerPreference: "high-performance"
        }}
        style={{ background: "transparent" }}
      >
        <Suspense fallback={<LoadingFallback />}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

// For custom GLTF models, uncomment and use this component instead:
/*
const CustomModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  const colors = useThemeColors();
  
  useEffect(() => {
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Apply theme colors to materials
        if (child.material) {
          child.material.color = new THREE.Color(colors.primary);
        }
      }
    });
  }, [scene, colors]);
  
  return <primitive object={scene} scale={1} />;
};

// Preload GLTF for better performance
// useGLTF.preload('/models/your-model.glb');
*/
