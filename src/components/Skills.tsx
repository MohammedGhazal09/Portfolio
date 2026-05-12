import { useEffect, useRef } from "react";
import { gsap, SplitText } from "../lib/gsap";

/**
 * Truly infinite marquee using the canonical GSAP pattern:
 *   - Track contains the items duplicated once ([A,B,C,A,B,C])
 *   - Tween animates xPercent: 0 → -50 (or -50 → 0 reversed)
 *   - On repeat, x snaps back to 0 — but because the duplicate
 *     occupies that same visible region, the snap is invisible.
 *   - No scrollWidth math, no modifiers, fully resize-safe.
 */

type Row = { items: string[]; speed: number; reverse?: boolean };

// Pulled straight from resume: TECHNICAL SKILLS
const ROWS: Row[] = [
  {
    // Front-End
    items: [
      "HTML",
      "CSS",
      "Tailwind CSS",
      "JavaScript (ES6+)",
      "DOM Manipulation",
      "Event Handling",
      "Async / Await",
      "Fetch API",
      "Responsive Design",
      "Styled Components",
      "React.js",
      "Angular",
      "Context API",
    ],
    speed: 28,
  },
  {
    // Back-End
    items: [
      "Node.js",
      "Express.js",
      "PHP",
      "Laravel",
      "RESTful APIs",
      "HTTP Protocol",
      "MongoDB",
      "Mongoose",
      "MySQL",
      "JWT Authentication",
      "Cookies",
      "Socket.IO",
    ],
    speed: 36,
    reverse: true,
  },
  {
    // Tooling + Advanced
    items: [
      "Git",
      "GitHub",
      "Webpack",
      "Vite",
      "Performance Optimization",
      "Web Accessibility",
      "Advanced State Management",
      "TypeScript",
      "Next.js",
      "REST",
      "VS Code",
      "Postman",
    ],
    speed: 22,
  },
];

const SOFT_SKILLS = [
  { label: "Problem Solving", desc: "Decompose, prototype, ship" },
  { label: "UI/UX Design", desc: "Pixel discipline, type hierarchy" },
  { label: "Effective Communication", desc: "Async-first, document everything" },
  { label: "Teamwork", desc: "Pair eagerly, review honestly" },
  { label: "Time Management", desc: "Estimate, then beat the estimate" },
  { label: "Agile Methodologies", desc: "Small slices, fast feedback" },
];

const LANGUAGES = [
  { name: "Arabic", level: "Native", pct: 100 },
  { name: "English", level: "Proficient · B2/C1", pct: 85 },
];

/**
 * Headline tech surface — the stack the resume actually centers on.
 * Rendered as a static featured grid so visitors can scan the main techniques
 * immediately, without waiting for the marquee to cycle past them.
 */
const CORE_STACK: { name: string; category: string }[] = [
  { name: "React.js", category: "Front-End" },
  { name: "Angular", category: "Front-End" },
  { name: "TypeScript", category: "Language" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Node.js", category: "Back-End" },
  { name: "Express.js", category: "Back-End" },
  { name: "Laravel", category: "Back-End" },
  { name: "PHP", category: "Language" },
  { name: "MongoDB", category: "Database" },
  { name: "MySQL", category: "Database" },
  { name: "Socket.IO", category: "Realtime" },
  { name: "Next.js", category: "Framework" },
];

const MarqueeRow = ({ items, speed, reverse }: Row) => {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Duration scales with item count so the speed feels consistent
    // regardless of how long the row is.
    const duration = items.length * speed * 0.15;

    const tween = gsap.fromTo(
      track,
      { xPercent: reverse ? -50 : 0 },
      {
        xPercent: reverse ? 0 : -50,
        duration,
        ease: "none",
        repeat: -1,
      },
    );

    const onEnter = () => gsap.to(tween, { timeScale: 0.2, duration: 0.4, overwrite: true });
    const onLeave = () => gsap.to(tween, { timeScale: 1, duration: 0.6, overwrite: true });
    track.addEventListener("mouseenter", onEnter);
    track.addEventListener("mouseleave", onLeave);

    return () => {
      tween.kill();
      track.removeEventListener("mouseenter", onEnter);
      track.removeEventListener("mouseleave", onLeave);
    };
  }, [items.length, speed, reverse]);

  // Duplicate items — the tween animates a window over the doubled track,
  // making the snap-back at the end of each repeat invisible.
  const sequence = [...items, ...items];

  return (
    <div className="overflow-hidden">
      <div
        ref={trackRef}
        className="flex gap-3 whitespace-nowrap will-change-transform py-2"
        style={{ width: "max-content" }}
      >
        {sequence.map((item, i) => (
          <span
            key={`${item}-${i}`}
            data-cursor="hover"
            aria-hidden={i >= items.length}
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

      gsap.from(".core-stack-card", {
        y: 32,
        opacity: 0,
        stagger: { each: 0.05, from: "start" },
        ease: "power3.out",
        duration: 0.7,
        scrollTrigger: { trigger: ".core-stack-grid", start: "top 85%" },
      });

      gsap.from(".soft-skill-card", {
        y: 40,
        opacity: 0,
        stagger: 0.08,
        ease: "power3.out",
        duration: 0.8,
        scrollTrigger: { trigger: ".soft-skills-grid", start: "top 80%" },
      });

      gsap.from(".language-card", {
        y: 30,
        opacity: 0,
        stagger: 0.12,
        ease: "power3.out",
        duration: 0.8,
        scrollTrigger: { trigger: ".languages-grid", start: "top 85%" },
      });

      // Animate language progress bars
      gsap.utils.toArray<HTMLElement>(".lang-bar-fill").forEach((bar) => {
        const pct = Number(bar.dataset.pct ?? 0);
        gsap.fromTo(
          bar,
          { scaleX: 0 },
          {
            scaleX: pct / 100,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: { trigger: bar, start: "top 90%", once: true },
          },
        );
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
          <span>03 — Stack</span>
        </div>

        <h2
          ref={headlineRef}
          className="font-display font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,8vw,7rem)] max-w-[14ch]"
        >
          The tools I <span className="text-gradient">reach for</span>.
        </h2>

        <p className="mt-6 max-w-xl text-base md:text-lg text-muted-foreground">
          A curated stack — front-end, back-end and the tooling in between. Things I use
          weekly, ship with confidence, and have opinions about.
        </p>

        {/* Core stack — featured grid of headline techs from the resume.
            Static, always visible — no marquee scrolling required. */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-6 text-xs uppercase tracking-[0.3em] text-muted-foreground font-mono">
            <span className="h-px w-12 bg-foreground/30" />
            <span>Core stack</span>
          </div>

          <div className="core-stack-grid grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {CORE_STACK.map((tech) => (
              <div
                key={tech.name}
                data-cursor="hover"
                className="core-stack-card group relative glass-strong rounded-2xl p-5 md:p-6 overflow-hidden hover:bg-foreground/[0.03] transition-colors"
              >
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-base md:text-lg font-bold tracking-tight truncate">
                      {tech.name}
                    </div>
                    <div className="mt-1 text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono">
                      {tech.category}
                    </div>
                  </div>
                  <span
                    className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary/70 group-hover:bg-primary group-hover:shadow-[0_0_12px_hsl(var(--primary))] transition-all"
                    aria-hidden
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
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

        {/* Languages */}
        <div className="mt-20">
          <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground font-mono">
            <span className="h-px w-12 bg-foreground/30" />
            <span>Languages</span>
          </div>

          <div className="languages-grid grid grid-cols-1 md:grid-cols-2 gap-4">
            {LANGUAGES.map((l) => (
              <div
                key={l.name}
                data-cursor="hover"
                className="language-card glass-strong rounded-3xl p-6 md:p-7"
              >
                <div className="flex items-baseline justify-between mb-4">
                  <div className="text-2xl md:text-3xl font-display font-bold">{l.name}</div>
                  <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">
                    {l.level}
                  </div>
                </div>
                <div className="h-1 rounded-full bg-foreground/10 overflow-hidden">
                  <div
                    className="lang-bar-fill h-full origin-left gradient-primary"
                    data-pct={l.pct}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
