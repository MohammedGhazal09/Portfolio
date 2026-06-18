import { useEffect, useRef } from "react";
import { Mail, ArrowDown, Sparkles } from "lucide-react";
import { gsap, SplitText } from "../lib/gsap";
import { useMagnetic } from "../lib/magnetic";
import { ShaderBackground } from "./ShaderBackground";

const ROLES = [
  "Full-Stack Engineer",
  "MERN Specialist",
  "UI/UX Craftsman",
  "Problem Solver",
  "Accessibility Advocate",
];

export const Hero = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const firstNameRef = useRef<HTMLSpanElement>(null);
  const lastNameRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const meta1Ref = useRef<HTMLDivElement>(null);
  const meta2Ref = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLSpanElement>(null);

  const ctaPrimary = useMagnetic<HTMLAnchorElement>(20);
  const ctaGhost = useMagnetic<HTMLAnchorElement>(20);

  // ── Entry choreography ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      const splits: SplitText[] = [];
      const split = (el: Element | null, type = "chars,words") => {
        if (!el) return null;
        const s = new SplitText(el, { type, charsClass: "char", wordsClass: "word" });
        splits.push(s);
        return s;
      };

      const tagline = split(taglineRef.current, "lines,words");

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });
      tl.from(badgeRef.current, { y: 30, opacity: 0, duration: 0.8 })
        .from(
          firstNameRef.current,
          { yPercent: 120, opacity: 0, duration: 1 },
          "-=0.4",
        )
        .from(
          lastNameRef.current,
          { yPercent: 120, opacity: 0, duration: 1 },
          "-=0.85",
        )
        .from(roleRef.current, { y: 24, opacity: 0, duration: 0.8 }, "-=0.5")
        .from(
          tagline?.lines ?? [],
          { y: 30, opacity: 0, stagger: 0.08, duration: 0.9 },
          "-=0.5",
        )
        .from(ctaRef.current?.children ?? [], { y: 20, opacity: 0, stagger: 0.1, duration: 0.7 }, "-=0.6")
        .from(
          [meta1Ref.current, meta2Ref.current],
          { y: 20, opacity: 0, stagger: 0.1, duration: 0.7 },
          "-=0.5",
        )
        .from(scrollHintRef.current, { opacity: 0, y: 10, duration: 0.6 }, "-=0.3");

      // Idle scroll-hint bounce
      gsap.to(scrollHintRef.current, {
        y: 8,
        repeat: -1,
        yoyo: true,
        duration: 1.2,
        ease: "sine.inOut",
        delay: 2.5,
      });

      // Scroll-out parallax: hero content drifts up + fades while shader stays
      gsap.to(".hero-content", {
        yPercent: -25,
        opacity: 0,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      return () => splits.forEach((s) => s.revert());
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // ── Rotating role text ──
  useEffect(() => {
    const el = roleRef.current;
    if (!el) return;
    let i = 0;
    const cycle = () => {
      i = (i + 1) % ROLES.length;
      gsap.to(el, {
        yPercent: -100,
        opacity: 0,
        duration: 0.4,
        ease: "power3.in",
        onComplete: () => {
          el.textContent = ROLES[i];
          gsap.fromTo(
            el,
            { yPercent: 100, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.5, ease: "power3.out" },
          );
        },
      });
    };
    const interval = setInterval(cycle, 2800);
    return () => clearInterval(interval);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[100svh] w-full overflow-hidden flex items-center"
    >
      <ShaderBackground
        light={{ c1: "#dbeafe", c2: "#e9d5ff", c3: "#cffafe" }}
        dark={{ c1: "#1e3a8a", c2: "#7c3aed", c3: "#0ea5e9" }}
      />

      {/* Soft ambient overlays for legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.7)_100%)] pointer-events-none" />

      <div className="hero-content relative z-10 mx-auto w-full max-w-7xl px-6 md:px-10 pt-32 pb-24">
        <div className="grid grid-cols-12 gap-6 items-center">
          <div className="col-span-12 lg:col-span-9">
            <div ref={badgeRef} className="inline-flex items-center gap-2 glass-strong px-4 py-2 rounded-full mb-8 text-xs uppercase tracking-[0.2em] font-medium">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Available for new projects</span>
              <span className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
            </div>

            <h1
              className="font-display font-bold tracking-normal leading-[0.85] text-[clamp(2.75rem,11vw,10rem)]"
              style={{ textWrap: "nowrap" } as React.CSSProperties}
            >
              <span className="block overflow-hidden whitespace-nowrap">
                <span ref={firstNameRef} className="inline-block whitespace-nowrap will-change-transform">
                  Mohammed
                </span>
              </span>
              <span className="block overflow-hidden whitespace-nowrap">
                <span
                  ref={lastNameRef}
                  className="inline-block whitespace-nowrap will-change-transform text-gradient"
                >
                  Ghazal
                </span>
              </span>
            </h1>

            <div className="mt-8 flex items-baseline flex-wrap gap-x-4 gap-y-2 text-2xl md:text-3xl font-light">
              <span className="text-muted-foreground">A</span>
              <span className="overflow-hidden inline-block h-[1.2em] align-middle">
                <span ref={roleRef} className="block">
                  {ROLES[0]}
                </span>
              </span>
              <span className="text-muted-foreground">based in Madinah, KSA</span>
            </div>

            <p
              ref={taglineRef}
              className="mt-10 max-w-2xl text-lg md:text-xl leading-relaxed text-muted-foreground"
            >
              Building scalable, high-performance web applications. Skilled in modern
              UI/UX design, API integration, responsive design, and web accessibility —
              committed to writing clean, maintainable code.
            </p>

            <div ref={ctaRef} className="mt-12 flex flex-wrap items-center gap-4">
              <a
                ref={ctaPrimary}
                href="#contact"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("contact");
                }}
                data-cursor="hover"
                className="group relative inline-flex items-center gap-3 rounded-full bg-foreground text-background px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Mail className="h-4 w-4" />
                  Let's collaborate
                </span>
                <span className="absolute inset-0 -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-out gradient-primary" />
              </a>

              <a
                ref={ctaGhost}
                href="#projects"
                onClick={(e) => {
                  e.preventDefault();
                  scrollTo("projects");
                }}
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full glass-strong px-7 py-4 text-sm font-semibold uppercase tracking-[0.18em] hover:bg-foreground/5 transition-colors"
              >
                View work
                <span className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </a>
            </div>
          </div>

          {/* Right column: meta stack */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 lg:items-end">
            <div ref={meta1Ref} className="glass-strong rounded-2xl p-5 w-full lg:max-w-[260px]">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Currently
              </div>
              <div className="text-base font-medium leading-snug">
                Engineering at the intersection of <span className="text-gradient font-bold">design</span> and <span className="text-gradient font-bold">code</span>
              </div>
            </div>
            <div ref={meta2Ref} className="glass-strong rounded-2xl p-5 w-full lg:max-w-[260px]">
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                Stack
              </div>
              <div className="flex flex-wrap gap-1.5 text-[11px] font-medium font-mono uppercase tracking-wider">
                {["React", "TypeScript", "Node", "Express", "MongoDB", "Tailwind"].map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-full bg-foreground/5 border border-foreground/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div
          ref={scrollHintRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-8 flex flex-col items-center gap-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground"
        >
          <span>Scroll</span>
          <ArrowDown className="h-4 w-4" />
        </div>
      </div>
    </section>
  );
};
