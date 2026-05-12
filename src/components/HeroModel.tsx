import { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  OrbitControls,
  Float,
  MeshDistortMaterial,
  RoundedBox,
  Environment,
  ContactShadows,
  Html,
  Text,
} from "@react-three/drei";
import * as THREE from "three";

// ---------------------------------------------------------------------------
// Theme hook – reads the dark/light class from <html>
// ---------------------------------------------------------------------------
const useThemeColors = () => {
  const [colors, setColors] = useState({
    primary: "#3b82f6",
    secondary: "#8b5cf6",
    accent: "#06b6d4",
    background: "#0a0a0a",
  });

  useEffect(() => {
    const update = () => {
      const isDark = document.documentElement.classList.contains("dark");
      setColors({
        primary: isDark ? "#60a5fa" : "#3b82f6",
        secondary: isDark ? "#a78bfa" : "#8b5cf6",
        accent: isDark ? "#22d3ee" : "#06b6d4",
        background: isDark ? "#0a0a0a" : "#fafafa",
      });
    };
    update();
    const obs = new MutationObserver(update);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);

  return colors;
};

// ---------------------------------------------------------------------------
// VS Code screen content – rendered to a CanvasTexture
// ---------------------------------------------------------------------------

/** We draw a fake VS Code UI on an off-screen canvas and return a texture. */
const useVSCodeTexture = (colors: ReturnType<typeof useThemeColors>) => {
  const texture = useMemo(() => {
    const W = 1024;
    const H = 640;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d")!;

    // --- Background ---
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(0, 0, W, H);

    // --- Title bar ---
    ctx.fillStyle = "#323233";
    ctx.fillRect(0, 0, W, 32);
    // Traffic-light dots
    const dotColors = ["#ff5f57", "#ffbd2e", "#28c840"];
    dotColors.forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(18 + i * 22, 16, 6, 0, Math.PI * 2);
      ctx.fill();
    });
    // Title text
    ctx.fillStyle = "#cccccc";
    ctx.font = "bold 13px monospace";
    ctx.fillText("portfolio — Visual Studio Code", W / 2 - 120, 21);

    // --- Activity bar (left icons) ---
    const actBarW = 48;
    ctx.fillStyle = "#252526";
    ctx.fillRect(0, 32, actBarW, H - 32);
    // Icon placeholders (files, search, git, extensions, settings)
    const iconY = [52, 98, 144, 190, H - 40];
    ctx.fillStyle = "#858585";
    iconY.forEach((y) => {
      ctx.fillRect(14, y, 20, 20);
    });
    // Active indicator
    ctx.fillStyle = colors.primary;
    ctx.fillRect(0, 46, 3, 32);

    // --- Explorer sidebar ---
    const sideW = 200;
    ctx.fillStyle = "#252526";
    ctx.fillRect(actBarW, 32, sideW, H - 32);
    // EXPLORER header
    ctx.fillStyle = "#bbbbbb";
    ctx.font = "bold 11px monospace";
    ctx.fillText("EXPLORER", actBarW + 12, 52);
    // Folder / file tree
    const treeItems = [
      { indent: 0, label: "▼ src", color: "#e8ab53" },
      { indent: 1, label: "▼ components", color: "#e8ab53" },
      { indent: 2, label: "Hero.tsx", color: "#519aba" },
      { indent: 2, label: "About.tsx", color: "#519aba" },
      { indent: 2, label: "Projects.tsx", color: "#519aba" },
      { indent: 2, label: "Contact.tsx", color: "#519aba" },
      { indent: 1, label: "App.tsx", color: "#519aba" },
      { indent: 1, label: "main.tsx", color: "#519aba" },
      { indent: 0, label: "▼ public", color: "#e8ab53" },
      { indent: 0, label: "package.json", color: "#e6995e" },
      { indent: 0, label: "tsconfig.json", color: "#e6995e" },
    ];
    treeItems.forEach((item, i) => {
      const x = actBarW + 16 + item.indent * 14;
      const y = 72 + i * 20;
      ctx.fillStyle = i === 2 ? "#37373d" : "transparent";
      ctx.fillRect(actBarW, y - 13, sideW, 19);
      ctx.fillStyle = item.color;
      ctx.font = "12px monospace";
      ctx.fillText(item.label, x, y);
    });

    // --- Tab bar ---
    const editorX = actBarW + sideW;
    const editorW = W - editorX;
    ctx.fillStyle = "#252526";
    ctx.fillRect(editorX, 32, editorW, 36);
    // Active tab
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(editorX, 32, 140, 36);
    ctx.fillStyle = "#519aba";
    ctx.font = "12px monospace";
    ctx.fillText("● Hero.tsx", editorX + 12, 55);
    // Inactive tab
    ctx.fillStyle = "#969696";
    ctx.fillText("  App.tsx", editorX + 150, 55);

    // --- Editor area with VS Code-style code ---
    const codeStartY = 72;
    const lineH = 18;
    const codeX = editorX + 52;

    // Line numbers
    ctx.fillStyle = "#858585";
    ctx.font = "13px monospace";
    for (let i = 1; i <= 28; i++) {
      ctx.fillText(String(i).padStart(2, " "), editorX + 8, codeStartY + i * lineH);
    }

    // Minimap (right gutter)
    const mmX = W - 55;
    ctx.fillStyle = "#2d2d2d";
    ctx.fillRect(mmX, 68, 50, H - 90);
    // Mini lines
    for (let i = 0; i < 60; i++) {
      const w = 10 + Math.random() * 30;
      ctx.fillStyle =
        i % 7 === 0
          ? "rgba(86,156,214,0.35)"
          : i % 5 === 0
          ? "rgba(206,145,120,0.3)"
          : "rgba(200,200,200,0.15)";
      ctx.fillRect(mmX + 4, 72 + i * 6, w, 3);
    }

    // Code tokens – each line is an array of {text, color}
    type Token = { text: string; color: string };
    const lines: Token[][] = [
      [
        { text: "import ", color: "#c586c0" },
        { text: "{ ", color: "#cccccc" },
        { text: "useState", color: "#9cdcfe" },
        { text: ", ", color: "#cccccc" },
        { text: "useEffect", color: "#9cdcfe" },
        { text: " } ", color: "#cccccc" },
        { text: "from ", color: "#c586c0" },
        { text: "'react'", color: "#ce9178" },
        { text: ";", color: "#cccccc" },
      ],
      [
        { text: "import ", color: "#c586c0" },
        { text: "{ ", color: "#cccccc" },
        { text: "Canvas", color: "#9cdcfe" },
        { text: " } ", color: "#cccccc" },
        { text: "from ", color: "#c586c0" },
        { text: "'@react-three/fiber'", color: "#ce9178" },
        { text: ";", color: "#cccccc" },
      ],
      [],
      [
        { text: "const ", color: "#569cd6" },
        { text: "Hero", color: "#4ec9b0" },
        { text: " = () ", color: "#cccccc" },
        { text: "=> ", color: "#569cd6" },
        { text: "{", color: "#cccccc" },
      ],
      [
        { text: "  const ", color: "#569cd6" },
        { text: "[", color: "#cccccc" },
        { text: "loaded", color: "#9cdcfe" },
        { text: ", ", color: "#cccccc" },
        { text: "setLoaded", color: "#9cdcfe" },
        { text: "] = ", color: "#cccccc" },
        { text: "useState", color: "#dcdcaa" },
        { text: "(", color: "#cccccc" },
        { text: "false", color: "#569cd6" },
        { text: ");", color: "#cccccc" },
      ],
      [],
      [
        { text: "  ", color: "#cccccc" },
        { text: "useEffect", color: "#dcdcaa" },
        { text: "(() ", color: "#cccccc" },
        { text: "=> ", color: "#569cd6" },
        { text: "{", color: "#cccccc" },
      ],
      [
        { text: "    ", color: "#cccccc" },
        { text: "const ", color: "#569cd6" },
        { text: "timer", color: "#9cdcfe" },
        { text: " = ", color: "#cccccc" },
        { text: "setTimeout", color: "#dcdcaa" },
        { text: "(() ", color: "#cccccc" },
        { text: "=> ", color: "#569cd6" },
        { text: "{", color: "#cccccc" },
      ],
      [
        { text: "      ", color: "#cccccc" },
        { text: "setLoaded", color: "#dcdcaa" },
        { text: "(", color: "#cccccc" },
        { text: "true", color: "#569cd6" },
        { text: ");", color: "#cccccc" },
      ],
      [{ text: "    }, ", color: "#cccccc" }, { text: "100", color: "#b5cea8" }, { text: ");", color: "#cccccc" }],
      [
        { text: "    ", color: "#cccccc" },
        { text: "return ", color: "#c586c0" },
        { text: "() ", color: "#cccccc" },
        { text: "=> ", color: "#569cd6" },
        { text: "clearTimeout", color: "#dcdcaa" },
        { text: "(timer);", color: "#cccccc" },
      ],
      [{ text: "  }, []);", color: "#cccccc" }],
      [],
      [
        { text: "  ", color: "#cccccc" },
        { text: "return ", color: "#c586c0" },
        { text: "(", color: "#cccccc" },
      ],
      [
        { text: "    <", color: "#808080" },
        { text: "section ", color: "#569cd6" },
        { text: "className", color: "#9cdcfe" },
        { text: "=", color: "#cccccc" },
        { text: '"hero"', color: "#ce9178" },
        { text: ">", color: "#808080" },
      ],
      [
        { text: "      <", color: "#808080" },
        { text: "h1", color: "#569cd6" },
        { text: ">", color: "#808080" },
        { text: "Mohammed Ghazal", color: "#cccccc" },
        { text: "</", color: "#808080" },
        { text: "h1", color: "#569cd6" },
        { text: ">", color: "#808080" },
      ],
      [
        { text: "      <", color: "#808080" },
        { text: "Canvas ", color: "#4ec9b0" },
        { text: "camera", color: "#9cdcfe" },
        { text: "=", color: "#cccccc" },
        { text: "{{", color: "#569cd6" },
        { text: " fov: ", color: "#9cdcfe" },
        { text: "50", color: "#b5cea8" },
        { text: " }}", color: "#569cd6" },
        { text: ">", color: "#808080" },
      ],
      [
        { text: "        <", color: "#808080" },
        { text: "Scene ", color: "#4ec9b0" },
        { text: "/>", color: "#808080" },
      ],
      [
        { text: "      </", color: "#808080" },
        { text: "Canvas", color: "#4ec9b0" },
        { text: ">", color: "#808080" },
      ],
      [
        { text: "    </", color: "#808080" },
        { text: "section", color: "#569cd6" },
        { text: ">", color: "#808080" },
      ],
      [{ text: "  );", color: "#cccccc" }],
      [{ text: "};", color: "#cccccc" }],
      [],
      [
        { text: "export ", color: "#c586c0" },
        { text: "default ", color: "#c586c0" },
        { text: "Hero", color: "#4ec9b0" },
        { text: ";", color: "#cccccc" },
      ],
    ];

    ctx.font = "13px monospace";
    lines.forEach((tokens, lineIdx) => {
      let x = codeX;
      const y = codeStartY + (lineIdx + 1) * lineH;
      tokens.forEach((t) => {
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, x, y);
        x += ctx.measureText(t.text).width;
      });
    });

    // Cursor blink line (static in texture)
    ctx.fillStyle = "#aeafad";
    ctx.fillRect(codeX + 2, codeStartY + 5 * lineH + 3, 1.5, 15);

    // --- Status bar ---
    ctx.fillStyle = "#007acc";
    ctx.fillRect(0, H - 24, W, 24);
    ctx.fillStyle = "#ffffff";
    ctx.font = "11px monospace";
    ctx.fillText("⌥ main", 10, H - 8);
    ctx.fillText("TypeScript React", W / 2 - 50, H - 8);
    ctx.fillText("Ln 5, Col 42", W - 110, H - 8);
    // Breadcrumbs bar
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(editorX, 68, editorW, 20);
    ctx.fillStyle = "#969696";
    ctx.font = "10px monospace";
    ctx.fillText("src > components > Hero.tsx > Hero", editorX + 8, 82);

    const tex = new THREE.CanvasTexture(canvas);
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    return tex;
  }, [colors.primary]);

  return texture;
};

// ---------------------------------------------------------------------------
// Desktop PC 3D model with VS Code on screen
// ---------------------------------------------------------------------------
const DesktopPC = ({
  colors,
}: {
  colors: ReturnType<typeof useThemeColors>;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const screenTex = useVSCodeTexture(colors);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y =
        Math.sin(state.clock.elapsedTime * 0.5) * 0.08;
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.6, 0]}
      rotation={[0.05, -0.25, 0]}
      scale={0.75}
    >
      {/* ===== MONITOR ===== */}
      <group position={[0, 2.4, 0]}>
        {/* Bezel */}
        <RoundedBox args={[4.4, 2.8, 0.18]} radius={0.06}>
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.85}
            roughness={0.15}
          />
        </RoundedBox>

        {/* Screen (VS Code texture) */}
        <mesh position={[0, 0.05, 0.1]}>
          <planeGeometry args={[4.0, 2.5]} />
          <meshBasicMaterial map={screenTex} toneMapped={false} />
        </mesh>

        {/* Subtle screen glow */}
        <mesh position={[0, 0.05, 0.095]}>
          <planeGeometry args={[4.05, 2.55]} />
          <meshBasicMaterial
            color="#007acc"
            transparent
            opacity={0.04}
            toneMapped={false}
          />
        </mesh>

        {/* Webcam dot */}
        <mesh position={[0, 1.32, 0.1]}>
          <circleGeometry args={[0.03, 16]} />
          <meshStandardMaterial color="#333333" />
        </mesh>

        {/* Bottom logo (VS Code icon styled) */}
        <mesh position={[0, -1.32, 0.1]}>
          <boxGeometry args={[0.3, 0.04, 0.01]} />
          <meshStandardMaterial
            color="#555555"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </group>

      {/* ===== MONITOR STAND (neck) ===== */}
      <group position={[0, 0.65, -0.05]}>
        {/* Vertical neck */}
        <RoundedBox args={[0.35, 0.9, 0.15]} radius={0.04}>
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.9}
            roughness={0.15}
          />
        </RoundedBox>
        {/* Stand base */}
        <RoundedBox args={[1.6, 0.08, 0.9]} radius={0.03} position={[0, -0.42, 0.1]}>
          <meshStandardMaterial
            color="#222222"
            metalness={0.85}
            roughness={0.2}
          />
        </RoundedBox>
      </group>

      {/* ===== DESK SURFACE ===== */}
      <RoundedBox
        args={[6.5, 0.12, 3]}
        radius={0.03}
        position={[0, 0.1, 0.5]}
      >
        <meshStandardMaterial color="#3d2b1f" roughness={0.7} metalness={0.1} />
      </RoundedBox>

      {/* ===== KEYBOARD ===== */}
      <group position={[0, 0.23, 1.3]}>
        {/* Keyboard body */}
        <RoundedBox args={[2.6, 0.08, 0.8]} radius={0.02}>
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.6}
            roughness={0.3}
          />
        </RoundedBox>
        {/* Key rows */}
        {[...Array(4)].map((_, row) =>
          [...Array(12)].map((_, col) => (
            <mesh
              key={`k-${row}-${col}`}
              position={[
                -1.1 + col * 0.2,
                0.05,
                -0.28 + row * 0.19,
              ]}
            >
              <boxGeometry args={[0.15, 0.02, 0.14]} />
              <meshStandardMaterial
                color="#3a3a3a"
                metalness={0.5}
                roughness={0.4}
              />
            </mesh>
          ))
        )}
        {/* Spacebar */}
        <mesh position={[0, 0.05, 0.3]}>
          <boxGeometry args={[1.0, 0.02, 0.14]} />
          <meshStandardMaterial
            color="#3a3a3a"
            metalness={0.5}
            roughness={0.4}
          />
        </mesh>
      </group>

      {/* ===== MOUSE ===== */}
      <group position={[1.8, 0.22, 1.3]}>
        <RoundedBox args={[0.35, 0.12, 0.55]} radius={0.06}>
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.6}
            roughness={0.3}
          />
        </RoundedBox>
        {/* Scroll wheel */}
        <mesh position={[0, 0.07, -0.1]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.025, 0.025, 0.08, 12]} />
          <meshStandardMaterial
            color="#555555"
            metalness={0.8}
            roughness={0.2}
          />
        </mesh>
        {/* Mouse light */}
        <mesh position={[0, 0.065, -0.18]}>
          <boxGeometry args={[0.04, 0.01, 0.04]} />
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.primary}
            emissiveIntensity={1.2}
          />
        </mesh>
      </group>

      {/* ===== PC TOWER ===== */}
      <group position={[3.0, 0.85, -0.2]}>
        {/* Tower case */}
        <RoundedBox args={[1.0, 1.6, 1.8]} radius={0.04}>
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.8}
            roughness={0.2}
          />
        </RoundedBox>
        {/* Front glass panel */}
        <mesh position={[0.51, 0, 0]}>
          <planeGeometry args={[0.01, 1.4]} />
          <meshStandardMaterial
            color="#111111"
            transparent
            opacity={0.5}
            metalness={0.9}
            roughness={0.05}
          />
        </mesh>
        {/* RGB strip on front */}
        <mesh position={[0.505, 0, 0]}>
          <boxGeometry args={[0.01, 1.3, 0.02]} />
          <meshStandardMaterial
            color={colors.primary}
            emissive={colors.primary}
            emissiveIntensity={1.5}
          />
        </mesh>
        {/* Power button */}
        <mesh position={[0.51, 0.65, 0.4]}>
          <circleGeometry args={[0.05, 16]} />
          <meshStandardMaterial
            color={colors.accent}
            emissive={colors.accent}
            emissiveIntensity={2}
          />
        </mesh>
        {/* USB ports */}
        {[0, 0.12].map((offset, i) => (
          <mesh key={`usb-${i}`} position={[0.51, 0.45, 0.35 + offset]}>
            <boxGeometry args={[0.01, 0.04, 0.08]} />
            <meshStandardMaterial color="#333333" metalness={0.9} />
          </mesh>
        ))}
        {/* Ventilation grilles (back) */}
        {[...Array(6)].map((_, i) => (
          <mesh key={`vent-${i}`} position={[-0.51, -0.4 + i * 0.22, 0]}>
            <boxGeometry args={[0.01, 0.05, 1.2]} />
            <meshStandardMaterial color="#2a2a2a" metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* ===== COFFEE MUG ===== */}
      <group position={[-2.4, 0.32, 1.2]}>
        {/* Mug body */}
        <mesh>
          <cylinderGeometry args={[0.18, 0.15, 0.35, 20]} />
          <meshStandardMaterial color="#3d3d3d" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Mug handle */}
        <mesh position={[0.22, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.1, 0.025, 8, 16, Math.PI]} />
          <meshStandardMaterial color="#3d3d3d" roughness={0.4} metalness={0.3} />
        </mesh>
        {/* Coffee surface */}
        <mesh position={[0, 0.15, 0]}>
          <circleGeometry args={[0.16, 20]} />
          <meshStandardMaterial
            color="#3a1f0b"
            roughness={0.9}
            metalness={0.0}
          />
        </mesh>
      </group>

      {/* ===== FLOATING ACCENTS ===== */}
      <Float speed={4} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh position={[3.5, 3.8, 0.5]}>
          <icosahedronGeometry args={[0.4, 0]} />
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
        <mesh position={[-3.2, 3.5, 0]}>
          <torusGeometry args={[0.2, 0.06, 16, 32]} />
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
        <mesh position={[2.2, 4.2, -0.5]}>
          <octahedronGeometry args={[0.25, 0]} />
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

// ---------------------------------------------------------------------------
// Loading fallback
// ---------------------------------------------------------------------------
const LoadingFallback = () => (
  <Html center>
    <div className="flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
    </div>
  </Html>
);

// ---------------------------------------------------------------------------
// Scene
// ---------------------------------------------------------------------------
const Scene = () => {
  const colors = useThemeColors();

  return (
    <>
      <ambientLight intensity={0.35} />
      <directionalLight
        position={[8, 10, 5]}
        intensity={1.1}
        color="#ffffff"
        castShadow
      />
      <pointLight
        position={[-4, 6, 4]}
        intensity={0.5}
        color={colors.primary}
      />
      <pointLight
        position={[4, 4, -4]}
        intensity={0.3}
        color={colors.secondary}
      />
      {/* Subtle screen-glow light */}
      <spotLight
        position={[0, 2.5, 2]}
        angle={0.6}
        penumbra={0.8}
        intensity={0.3}
        color="#007acc"
      />

      <DesktopPC colors={colors} />

      <ContactShadows
        position={[0, -0.7, 0]}
        opacity={0.45}
        scale={18}
        blur={3}
        far={6}
      />

      <Environment preset="city" />

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.8}
        minPolarAngle={Math.PI / 5}
        maxPolarAngle={Math.PI / 2.2}
      />
    </>
  );
};

// ---------------------------------------------------------------------------
// Exported component
// ---------------------------------------------------------------------------
export const HeroModel = () => {
  const [isLoaded, setIsLoaded] = useState(false);

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
        camera={{ position: [0, 2.5, 8], fov: 45 }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
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
