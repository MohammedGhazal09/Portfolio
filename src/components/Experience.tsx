import { useEffect, useRef } from "react";
import { Briefcase, ArrowUpRight } from "lucide-react";
import { gsap, SplitText } from "../lib/gsap";

type Role = {
  index: string;
  company: string;
  title: string;
  period: string;
  location?: string;
  highlights: string[];
  link?: string;
};

const ROLES: Role[] = [
  {
    index: "01",
    company: "Alsaqefah",
    title: "Full-Stack Engineer",
    period: "01/2026 — Present",
    highlights: [
      "Engineered full-stack features for enterprise-level applications serving thousands of users within a structured team environment.",
      "Partnered with senior engineers and QA to deliver high-quality solutions on time and within scope.",
      "Maintained high code quality standards through peer reviews, documentation, and adherence to team coding conventions.",
      "Drove continuous improvement initiatives by identifying bottlenecks, proposing technical solutions, and actively contributing to the team's long-term engineering goals.",
    ],
  },
];

export const Experience = () => {
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

      gsap.from(".role-card", {
        y: 60,
        opacity: 0,
        stagger: 0.1,
        ease: "power3.out",
        duration: 1,
        scrollTrigger: { trigger: ".roles-list", start: "top 80%" },
      });

      gsap.from(".role-highlight", {
        x: -20,
        opacity: 0,
        stagger: 0.05,
        ease: "power3.out",
        duration: 0.6,
        scrollTrigger: { trigger: ".roles-list", start: "top 70%" },
      });

      return () => split.revert();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="experience" className="relative py-32 md:py-48 px-6 md:px-10">
      <div className="absolute top-1/3 -left-32 w-[40vw] h-[40vw] max-w-[600px] max-h-[600px] rounded-full blur-3xl opacity-20 gradient-primary pointer-events-none" />

      <div className="relative max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground font-mono">
          <span className="h-px w-12 bg-foreground/30" />
          <span>02 — Experience</span>
        </div>

        <h2
          ref={headlineRef}
          className="font-display font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,8vw,7rem)] max-w-[14ch]"
        >
          Where I'm <span className="text-gradient">shipping</span>.
        </h2>

        <div className="roles-list mt-20 space-y-6">
          {ROLES.map((role) => (
            <article
              key={role.company}
              data-cursor="hover"
              className="role-card relative glass-strong rounded-3xl p-8 md:p-10 overflow-hidden group"
            >
              {/* Index */}
              <div className="absolute top-6 right-6 text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground">
                {role.index}
              </div>

              {/* Status pulse */}
              <div className="absolute top-6 left-6 flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                </span>
                <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-emerald-400">
                  Current role
                </span>
              </div>

              <div className="mt-12 grid lg:grid-cols-12 gap-8 lg:gap-12">
                {/* Left: Meta */}
                <div className="lg:col-span-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5 text-[10px] font-mono uppercase tracking-[0.25em] text-primary">
                    <Briefcase className="h-3 w-3" />
                    {role.period}
                  </div>

                  <h3 className="font-display font-bold text-3xl md:text-5xl tracking-[-0.03em] leading-[0.95] mb-3">
                    <span className="text-gradient">{role.company}</span>
                  </h3>

                  <p className="text-lg md:text-xl text-muted-foreground italic mb-6">
                    {role.title}
                  </p>

                  {role.link && (
                    <a
                      href={role.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-mono uppercase tracking-[0.2em] text-foreground/70 hover:text-primary transition-colors"
                    >
                      Visit company
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                </div>

                {/* Right: Highlights */}
                <ul className="lg:col-span-7 space-y-4">
                  {role.highlights.map((h, i) => (
                    <li
                      key={i}
                      className="role-highlight flex gap-4 items-start text-base md:text-[1.05rem] leading-relaxed"
                    >
                      <span className="mt-2.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary shadow-[0_0_8px_hsl(var(--primary))]" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Hover glow */}
              <div className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700 bg-[radial-gradient(circle_at_var(--mx,30%)_var(--my,30%),hsl(var(--primary)/0.12),transparent_60%)]" />
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
