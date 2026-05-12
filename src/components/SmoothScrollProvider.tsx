import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "../lib/gsap";

/**
 * Lenis smooth-scroll, perfectly synced with GSAP ScrollTrigger.
 * Pattern from the GSAP/Lenis docs — drives Lenis on each ScrollTrigger tick
 * and ticks ScrollTrigger from Lenis's RAF loop so they share one timeline.
 */
export const SmoothScrollProvider = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return; // Skip smooth-scroll for users who opted out

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
      lerp: 0.1,
    });

    // Drive Lenis from GSAP's ticker (single source of truth)
    const onTick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    // Each Lenis scroll triggers ScrollTrigger update
    lenis.on("scroll", ScrollTrigger.update);

    return () => {
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};
