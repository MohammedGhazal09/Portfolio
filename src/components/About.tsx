import { useEffect, useRef } from "react";
import { GraduationCap, Code2, MapPin, Coffee, Github, Zap } from "lucide-react";
import { gsap, SplitText } from "../lib/gsap";

const STATS = [
  { value: 3, label: "Featured projects", suffix: "" },
  { value: 2, label: "Years building", suffix: "+" },
  { value: 100, label: "Commitment", suffix: "%" },
];

/** Animated counter — counts up when scrolled into view. */
const Counter = ({ value, suffix = "" }: { value: number; suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { v: 0 };
    const tween = gsap.to(obj, {
      v: value,
      duration: 1.6,
      ease: "power3.out",
      scrollTrigger: { trigger: el, start: "top 85%", once: true },
      onUpdate: () => {
        el.textContent = Math.round(obj.v) + suffix;
      },
    });
    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, [value, suffix]);
  return <span ref={ref}>0{suffix}</span>;
};

export const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Eyebrow + headline reveal — scrubbed by scroll for editorial feel
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

      // Bento tiles cascade in
      gsap.from(".bento-tile", {
        y: 60,
        opacity: 0,
        stagger: 0.08,
        ease: "power3.out",
        duration: 1,
        scrollTrigger: {
          trigger: ".bento-grid",
          start: "top 80%",
        },
      });

      // Subtle 3D tilt on tile hover (cursor-based)
      const tiles = gsap.utils.toArray<HTMLElement>(".bento-tile");
      tiles.forEach((tile) => {
        const onMove = (e: MouseEvent) => {
          const r = tile.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5;
          const y = (e.clientY - r.top) / r.height - 0.5;
          gsap.to(tile, {
            rotateY: x * 6,
            rotateX: -y * 6,
            duration: 0.5,
            ease: "power2.out",
            transformPerspective: 1000,
          });
        };
        const onLeave = () =>
          gsap.to(tile, { rotateX: 0, rotateY: 0, duration: 0.6, ease: "power3.out" });
        tile.addEventListener("mousemove", onMove);
        tile.addEventListener("mouseleave", onLeave);
      });

      return () => split.revert();
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" className="relative py-32 md:py-48 px-6 md:px-10">
      {/* Section background flourish */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full blur-3xl opacity-30 gradient-mesh pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        {/* Eyebrow */}
        <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground font-mono">
          <span className="h-px w-12 bg-foreground/30" />
          <span>01 — About</span>
        </div>

        {/* Editorial headline */}
        <h2
          ref={headlineRef}
          className="font-display font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,8vw,7rem)] max-w-[16ch]"
        >
          Code that <span className="text-gradient">ships</span>. Interfaces that{" "}
          <span className="text-gradient">stay</span>.
        </h2>

        {/* Bento grid */}
        <div className="bento-grid mt-20 grid grid-cols-12 gap-4 md:gap-5">
          {/* Big intro tile */}
          <div
            data-cursor="hover"
            className="bento-tile col-span-12 md:col-span-7 row-span-2 glass-strong rounded-3xl p-8 md:p-10 relative overflow-hidden group"
          >
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_var(--mx,50%)_var(--my,50%),hsl(var(--primary)/0.15),transparent_50%)]" />
            <Code2 className="h-7 w-7 text-primary mb-6" />
            <p className="text-2xl md:text-3xl font-light leading-relaxed">
              I'm a <span className="font-bold text-foreground text-gradient">Full-Stack MERN Developer</span> who treats the browser like a craft, not a checkbox.
            </p>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed mt-6">
              Skilled in modern UI/UX design, RESTful API integration, responsive layouts,
              and web accessibility — committed to writing clean, maintainable code and
              shipping interfaces with intent.
            </p>
          </div>

          {/* Avatar / monogram tile */}
          <div
            data-cursor="hover"
            className="bento-tile col-span-12 md:col-span-5 glass-strong rounded-3xl p-8 relative overflow-hidden aspect-[4/3] md:aspect-auto"
          >
            <div className="absolute inset-0 gradient-hero opacity-30" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,hsl(var(--accent)/0.4),transparent_60%)]" />
            <div className="relative h-full flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-foreground/70">
                  Mohammed Ghazal
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.9)]" />
              </div>
              <div className="font-display font-bold text-[clamp(4rem,14vw,10rem)] leading-none tracking-[-0.05em] mix-blend-overlay">
                MG
              </div>
              <div className="flex items-center justify-between text-xs font-mono uppercase tracking-[0.2em] text-foreground/70">
                <span>Madinah, KSA</span>
                <span>Est. 2023</span>
              </div>
            </div>
          </div>

          {/* Education */}
          <div
            data-cursor="hover"
            className="bento-tile col-span-12 md:col-span-5 glass-strong rounded-3xl p-7 relative overflow-hidden"
          >
            <GraduationCap className="h-6 w-6 text-primary mb-4" />
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono mb-2">
              Education
            </div>
            <div className="text-xl font-bold leading-tight">
              B.Sc Computer Science
            </div>
            <div className="text-sm text-muted-foreground mt-1">
              Islamic University, Madinah · 2023–2028
            </div>
          </div>

          {/* Stats row */}
          {STATS.map((s) => (
            <div
              key={s.label}
              data-cursor="hover"
              className="bento-tile col-span-4 md:col-span-2 glass-strong rounded-3xl p-5 md:p-6 flex flex-col justify-between min-h-[140px]"
            >
              <Zap className="h-4 w-4 text-primary" />
              <div>
                <div className="font-display font-bold text-3xl md:text-5xl leading-none tabular-nums">
                  <Counter value={s.value} suffix={s.suffix} />
                </div>
                <div className="text-[10px] md:text-xs text-muted-foreground uppercase tracking-[0.18em] mt-2 leading-tight">
                  {s.label}
                </div>
              </div>
            </div>
          ))}

          {/* Quote tile */}
          <div
            data-cursor="hover"
            className="bento-tile col-span-12 md:col-span-7 glass-strong rounded-3xl p-8 relative overflow-hidden"
          >
            <div className="absolute -top-2 -left-2 font-display font-bold text-9xl text-foreground/10 select-none leading-none">
              "
            </div>
            <p className="relative font-display text-xl md:text-2xl leading-snug font-light pl-12 pt-8">
              I'd rather ship one interface that <span className="text-gradient font-medium">feels intentional</span> than ten that just function.
            </p>
          </div>

          {/* Quick facts */}
          <div
            data-cursor="hover"
            className="bento-tile col-span-12 md:col-span-5 glass-strong rounded-3xl p-7"
          >
            <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-mono mb-5">
              Quick facts
            </div>
            <ul className="space-y-3">
              {[
                { icon: MapPin, text: "Based in Madinah, KSA · GMT+3" },
                { icon: Coffee, text: "Powered by long espresso afternoons" },
                { icon: Github, text: "Open-source contributor since 2023" },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-center gap-3 text-sm">
                  <span className="grid place-items-center h-8 w-8 rounded-full bg-foreground/5 border border-foreground/10">
                    <Icon className="h-3.5 w-3.5 text-primary" />
                  </span>
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
