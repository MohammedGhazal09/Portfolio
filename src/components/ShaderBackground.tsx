import { useEffect, useRef } from "react";

const VERT = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

/**
 * Flowing gradient with simplex noise + FBM.
 * Three theme-driven colors mix across the screen, slowly drifting.
 * Mouse pulls the field gently. Aurora-style.
 */
const FRAG = `
precision highp float;
uniform vec2  u_resolution;
uniform float u_time;
uniform vec2  u_mouse;
uniform vec3  u_color1;
uniform vec3  u_color2;
uniform vec3  u_color3;
uniform float u_dark;

vec3 hash3(vec2 p) {
  vec3 q = vec3(dot(p, vec2(127.1, 311.7)),
                dot(p, vec2(269.5, 183.3)),
                dot(p, vec2(419.2, 371.9)));
  return fract(sin(q) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash3(i + vec2(0.0, 0.0)).x;
  float b = hash3(i + vec2(1.0, 0.0)).x;
  float c = hash3(i + vec2(0.0, 1.0)).x;
  float d = hash3(i + vec2(1.0, 1.0)).x;
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p  = uv * 2.0 - 1.0;
  p.x *= u_resolution.x / u_resolution.y;

  // Mouse pulls the field
  vec2 m = (u_mouse / u_resolution.xy) * 2.0 - 1.0;
  m.x *= u_resolution.x / u_resolution.y;
  p += (m - p) * 0.06;

  float t = u_time * 0.06;
  vec2 q = vec2(fbm(p + t), fbm(p - t + 4.7));
  vec2 r = vec2(fbm(p + q + vec2(1.7, 9.2) + t * 1.3),
                fbm(p + q + vec2(8.3, 2.8) - t * 1.1));
  float n = fbm(p + r);

  // Three-color blend
  vec3 col = mix(u_color1, u_color2, smoothstep(0.0, 0.7, n));
  col      = mix(col,      u_color3, smoothstep(0.4, 1.1, length(r)));

  // Vignette: darken edges so type stays legible
  float vig = smoothstep(1.4, 0.2, length(p));
  col *= mix(0.55, 1.0, vig);

  // Match light/dark mode brightness
  col = mix(col * 1.15, col * 0.55, u_dark);

  gl_FragColor = vec4(col, 1.0);
}
`;

const compile = (gl: WebGLRenderingContext, type: number, src: string) => {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(sh));
    gl.deleteShader(sh);
    return null;
  }
  return sh;
};

const hexToRgb = (hex: string): [number, number, number] => {
  const m = hex.replace("#", "").match(/.{1,2}/g);
  if (!m) return [0, 0, 0];
  return [parseInt(m[0], 16) / 255, parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255];
};

interface Props {
  /** Theme palette. Colors are HEX strings. */
  light?: { c1: string; c2: string; c3: string };
  dark?: { c1: string; c2: string; c3: string };
  className?: string;
}

export const ShaderBackground = ({
  light = { c1: "#3b82f6", c2: "#a78bfa", c3: "#22d3ee" },
  dark = { c1: "#1e3a8a", c2: "#7c3aed", c3: "#0ea5e9" },
  className = "",
}: Props) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const gl = canvas.getContext("webgl", { antialias: true, premultipliedAlpha: false });
    if (!gl) return; // Browser without WebGL → CSS gradient fallback (already in JSX)

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    // Full-screen quad
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_resolution");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uC1 = gl.getUniformLocation(prog, "u_color1");
    const uC2 = gl.getUniformLocation(prog, "u_color2");
    const uC3 = gl.getUniformLocation(prog, "u_color3");
    const uDark = gl.getUniformLocation(prog, "u_dark");

    const dpr = Math.min(window.devicePixelRatio || 1, 1.5); // Cap for perf

    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const onMouse = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      targetX = (e.clientX - rect.left) * dpr;
      targetY = (rect.height - (e.clientY - rect.top)) * dpr;
    };
    window.addEventListener("mousemove", onMouse);

    const applyPalette = () => {
      const isDark = document.documentElement.classList.contains("dark");
      const p = isDark ? dark : light;
      gl.uniform3f(uC1, ...hexToRgb(p.c1));
      gl.uniform3f(uC2, ...hexToRgb(p.c2));
      gl.uniform3f(uC3, ...hexToRgb(p.c3));
      gl.uniform1f(uDark, isDark ? 1 : 0);
    };
    applyPalette();
    const obs = new MutationObserver(applyPalette);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    resize();

    const start = performance.now();
    let raf = 0;
    const render = (now: number) => {
      // Lerp mouse for buttery follow
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform1f(uTime, reduced ? 0 : (now - start) / 1000);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouse);
      ro.disconnect();
      obs.disconnect();
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteBuffer(buf);
    };
  }, [light, dark]);

  return (
    <div
      aria-hidden
      className={`absolute inset-0 overflow-hidden ${className}`}
      // CSS fallback for no-WebGL browsers
      style={{
        background:
          "radial-gradient(at 30% 20%, hsl(var(--primary) / 0.4), transparent 60%), radial-gradient(at 70% 80%, hsl(var(--accent) / 0.4), transparent 60%), hsl(var(--background))",
      }}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
};
