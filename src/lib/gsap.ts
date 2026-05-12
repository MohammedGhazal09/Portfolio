import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

// Register plugins once at app boot
gsap.registerPlugin(ScrollTrigger, SplitText);

// Sensible global defaults for editorial motion
gsap.defaults({
  ease: "power3.out",
  duration: 1,
});

// Respect prefers-reduced-motion: collapse all motion to instant
if (typeof window !== "undefined") {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduced) {
    gsap.globalTimeline.timeScale(1000);
    ScrollTrigger.config({ ignoreMobileResize: true });
  }
}

export { gsap, ScrollTrigger, SplitText };
