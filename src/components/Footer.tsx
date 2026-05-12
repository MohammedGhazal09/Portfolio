import { useEffect, useRef } from "react";
import { Github, Linkedin, Mail, ArrowUp } from "lucide-react";
import { gsap } from "../lib/gsap";

export const Footer = () => {
  const wordmarkRef = useRef<HTMLDivElement>(null);

  // Massive marquee wordmark — drifts horizontally on scroll
  useEffect(() => {
    const el = wordmarkRef.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.to(el, {
        xPercent: -25,
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.6,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const year = new Date().getFullYear();

  return (
    <footer className="relative pt-24 pb-10 overflow-hidden border-t border-foreground/10">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

      {/* Massive drifting wordmark */}
      <div className="overflow-hidden mb-16 -mx-6 md:-mx-10">
        <div
          ref={wordmarkRef}
          className="font-display font-bold tracking-[-0.04em] leading-none whitespace-nowrap text-[clamp(5rem,18vw,17rem)] select-none"
          aria-hidden
        >
          <span className="text-gradient">MOHAMMED</span>
          <span className="text-foreground/10 mx-8">·</span>
          <span className="text-foreground/15">GHAZAL</span>
          <span className="text-foreground/10 mx-8">·</span>
          <span className="text-gradient">MOHAMMED</span>
          <span className="text-foreground/10 mx-8">·</span>
          <span className="text-foreground/15">GHAZAL</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-3 gap-8 items-end mb-16">
          <div>
            <div className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground mb-3">
              Currently
            </div>
            <p className="text-sm leading-relaxed text-foreground/80">
              Open to <span className="text-gradient font-medium">full-time</span> and{" "}
              <span className="text-gradient font-medium">freelance</span> work — preference for product teams that care about craft.
            </p>
          </div>

          <div className="flex md:justify-center gap-3">
            {[
              { icon: Github, href: "https://github.com/MohammedGhazal09", label: "GitHub" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/mohammed-ghazal-784153231", label: "LinkedIn" },
              { icon: Mail, href: "mailto:mohammedghazal01@outlook.com", label: "Email" },
            ].map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noopener noreferrer"
                aria-label={label}
                data-cursor="hover"
                className="grid place-items-center h-12 w-12 rounded-full glass-strong hover:bg-primary/10 hover:border-primary/40 transition-colors group"
              >
                <Icon className="h-4 w-4 group-hover:text-primary transition-colors" />
              </a>
            ))}
          </div>

          <div className="flex md:justify-end">
            <button
              onClick={scrollTop}
              data-cursor="hover"
              className="group inline-flex items-center gap-3 rounded-full glass-strong px-5 py-3 text-xs font-semibold uppercase tracking-[0.25em] hover:bg-foreground/5 transition-colors"
            >
              <ArrowUp className="h-3.5 w-3.5 group-hover:-translate-y-0.5 transition-transform" />
              Back to top
            </button>
          </div>
        </div>

        <div className="border-t border-foreground/10 pt-8 flex flex-col md:flex-row gap-3 md:items-center md:justify-between text-xs text-muted-foreground font-mono uppercase tracking-[0.2em]">
          <span>© {year} Mohammed Hamzah Ghazal</span>
          <span>Built with React · GSAP · Lenis</span>
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-pulse" />
            All systems operational
          </span>
        </div>
      </div>
    </footer>
  );
};
