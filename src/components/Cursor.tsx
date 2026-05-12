import { useEffect, useRef } from "react";
import { gsap } from "../lib/gsap";

/**
 * Custom cursor with two layers:
 *  • A small dot that follows 1:1
 *  • A larger ring that lerps behind with easing
 * Ring scales up + fades on `[data-cursor="hover"]` elements.
 * Disabled on touch devices and for prefers-reduced-motion.
 */
export const Cursor = () => {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const isTouch = window.matchMedia("(hover: none)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (isTouch || reduced) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    document.documentElement.classList.add("cursor-hidden");

    const dotX = gsap.quickTo(dot, "x", { duration: 0.08, ease: "power3.out" });
    const dotY = gsap.quickTo(dot, "y", { duration: 0.08, ease: "power3.out" });
    const ringX = gsap.quickTo(ring, "x", { duration: 0.4, ease: "power3.out" });
    const ringY = gsap.quickTo(ring, "y", { duration: 0.4, ease: "power3.out" });

    const onMove = (e: MouseEvent) => {
      dotX(e.clientX);
      dotY(e.clientY);
      ringX(e.clientX);
      ringY(e.clientY);
    };

    const onHoverIn = () => {
      gsap.to(ring, { scale: 2.4, opacity: 0.4, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 0.3, duration: 0.3, ease: "power2.out" });
    };
    const onHoverOut = () => {
      gsap.to(ring, { scale: 1, opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.to(dot, { scale: 1, duration: 0.3, ease: "power2.out" });
    };

    window.addEventListener("mousemove", onMove);

    // Auto-attach hover handlers to interactive elements
    const interactive = "a, button, [role='button'], input, textarea, [data-cursor='hover']";
    const onPointerOver = (e: Event) => {
      if ((e.target as Element).closest?.(interactive)) onHoverIn();
    };
    const onPointerOut = (e: Event) => {
      if ((e.target as Element).closest?.(interactive)) onHoverOut();
    };
    document.addEventListener("pointerover", onPointerOver);
    document.addEventListener("pointerout", onPointerOut);

    return () => {
      window.removeEventListener("mousemove", onMove);
      document.removeEventListener("pointerover", onPointerOver);
      document.removeEventListener("pointerout", onPointerOut);
      document.documentElement.classList.remove("cursor-hidden");
    };
  }, []);

  return (
    <>
      <div
        ref={ringRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[70] h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/60 mix-blend-difference"
        style={{ willChange: "transform" }}
      />
      <div
        ref={dotRef}
        aria-hidden
        className="pointer-events-none fixed top-0 left-0 z-[71] h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary mix-blend-difference"
        style={{ willChange: "transform" }}
      />
    </>
  );
};
