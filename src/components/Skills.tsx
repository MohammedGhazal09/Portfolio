import { useEffect, useRef } from "react";
import { gsap, SplitText } from "../lib/gsap";

/**
 * Multi-row marquee. Rows scroll opposite directions, different speeds,
 * pause on hover. Each cell is a glass chip with the technology name —
 * we lean on type rather than an icon library to keep bundle small.
 */

type Row = { items: string[]; speed: number; reverse?: boolean };

const ROWS: Row[] = [
  {
    items: [
      "React",
      "TypeScript",
      "Next.js",
      "Tailwind CSS",
      "Framer Motion",
      "GSAP",
      "Vite",
      "Webpack",
      "JavaScript ES6+",
      "HTML5",
      "CSS3",
      "shadcn/ui",
    ],
    speed: 60,
  },
  {
    items: [
      "Node.js",
      "Express",
      "MongoDB",
      "Mongoose",
      "RESTful APIs",
      "JWT Auth",
      "Socket.io",
      "WebSockets",
      "PostgreSQL",
      "Redis",
      "Cookies",
      "OAuth",
    ],
    speed: 45,
    reverse: true,
  },
  {
    items: [
      "Git",
      "GitHub",
      "Vercel",
      "Docker",
      "ESLint",
      "Prettier",
      "Postman",
      "VS Code",
      "Figma",
      "Linear",
      "Performance",
      "A11y",
    ],
    speed: 75,
  },
];

const SOFT_SKILLS = [
  { label: "Problem Solving", desc: "Decompose, prototype, ship" },
  { label: "UI/UX Design", desc: "Pixel discipline, type hierarchy" },
  { label: "Communication", desc: "Async-first, document everything" },
  { label: "Teamwork", desc: "Pair eagerly, review honestly" },
  { label: "Time Management", desc: "Estimate, then beat the estimate" },
  { label: "Agile", desc: "Small slices, fast feedback" },
];

const MarqueeRow = ({ items, speed, reverse }: Row) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Width of a single set (since we duplicate items, half the total)
    const setWidth = track.scrollWidth / 2;
    const tween = gsap.to(track, {
      x: reverse ? 0 : -setWidth,
      duration: setWidth / speed,
      ease: "none",
      repeat: -1,
      modifiers: {
        x: gsap.utils.unitize((x) => parseFloat(x) % setWidth),
      },
    });
    if (reverse) gsap.set(track, { x: -setWidth });

    // Pause on hover
    const onEnter = () => gsap.to(tween, { timeScale: 0.15, duration: 0.4 });
    const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.6 });
    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);

    return () => {
      tween.kill();
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, [speed, reverse]);

  // Duplicate items for seamless loop
  const sequence = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div ref={trackRef} className="flex gap-3 whitespace-nowrap will-change-transform py-2">
        {sequence.map((item, i) => (
          <span
            key={`${item}-${i}`}
            data-cursor="hover"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass-strong text-sm md:text-base font-medium tracking-wide hover:bg-foreground/5 hover:scale-105 transition-transform"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary/60" aria-hidden />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
};

export const Skills = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const split = new SplitText(headlineRef.current, { type: "words,chars" });
      gsap.from(split.chars, {
        yPercent: 110,
        opacity: 0,
        stagger: 0.012,
        ease: "power3.out",
        duration: 0.9,
        scrollTrigger: {
          trigger: headlineRef.current,
          start: "top 85%",
          end: "top 40%",
          scrub: 0.6,
        },
      });

      gsap.from(".soft-skill-card", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        ease: "power3.out",
        duration: 0.8,
        scrollTrigger: { trigger: ".soft-skills-grid", start: "top 80%" },
      });

      return () => split.revert();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="skills" className="relative py-32 md:py-48 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground font-mono">
          <span className="h-px w-12 bg-foreground/30" />
          <span>02 — Stack</span>
        </div>

        <h2
          ref={headlineRef}
          className="font-display font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,8vw,7rem)] max-w-[14ch]"
        >
          The tools I <span className="text-gradient">reach for</span>.
        </h2>

        <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
          A curated stack — not an inventory. Things I use weekly, ship with confidence,
          and have opinions about.
        </p>
      </div>

      {/* Marquee rows — full bleed */}
      <div className="mt-20 space-y-3">
        {ROWS.map((row, i) => (
          <MarqueeRow key={i} {...row} />
        ))}
      </div>

      {/* Soft skills bento */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 mt-32">
        <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground font-mono">
          <span className="h-px w-12 bg-foreground/30" />
          <span>Beyond the keyboard</span>
        </div>

        <div className="soft-skills-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {SOFT_SKILLS.map((s, i) => (
            <div
              key={s.label}
              data-cursor="hover"
              className="soft-skill-card group glass-strong rounded-3xl p-6 md:p-7 relative overflow-hidden hover:bg-foreground/[0.02] transition-colors"
            >
              <div className="absolute -top-px -right-px text-[80px] font-display font-bold text-foreground/[0.04] leading-none select-none tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </div>
              <div className="relative">
                <div className="text-lg md:text-xl font-bold mb-2 group-hover:text-gradient transition-colors">
                  {s.label}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
