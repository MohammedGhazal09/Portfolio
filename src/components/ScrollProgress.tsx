import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "../lib/gsap";

/** Top-of-page gradient scroll progress bar, scrubbed by ScrollTrigger. */
export const ScrollProgress = () => {
  const barRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      gsap.to(bar, {
        scaleX: 1,
        ease: "none",
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      aria-hidden
      className="fixed top-0 left-0 right-0 z-[60] h-[3px] origin-left pointer-events-none"
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left scale-x-0 gradient-primary shadow-[0_0_20px_hsl(var(--primary)/0.6)]"
      />
    </div>
  );
};
