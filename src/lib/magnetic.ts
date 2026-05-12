import { useEffect, useRef, type RefObject } from "react";
import { gsap } from "./gsap";

/**
 * Magnetic hover: element drifts toward the cursor on pointer move,
 * snaps back to center on leave. Strength = max pixel travel.
 *
 * Usage:
 *   const ref = useMagnetic<HTMLButtonElement>();
 *   <button ref={ref}>Click</button>
 */
export const useMagnetic = <T extends HTMLElement = HTMLDivElement>(
  strength = 24,
): RefObject<T> => {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.5, ease: "elastic.out(1, 0.4)" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.5, ease: "elastic.out(1, 0.4)" });

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = ((e.clientX - cx) / rect.width) * strength * 2;
      const dy = ((e.clientY - cy) / rect.height) * strength * 2;
      xTo(dx);
      yTo(dy);
    };
    const onLeave = () => {
      xTo(0);
      yTo(0);
    };

    el.addEventListener("mousemove", onMove);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mousemove", onMove);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [strength]);

  return ref;
};
