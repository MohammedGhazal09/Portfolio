import { useEffect, useRef, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { gsap, ScrollTrigger } from "../lib/gsap";
import { useMagnetic } from "../lib/magnetic";
import { cn } from "../lib/utils";

const SECTIONS = [
  { id: "hero", label: "Home" },
  { id: "about", label: "About" },
  { id: "experience", label: "Work" },
  { id: "skills", label: "Stack" },
  { id: "projects", label: "Projects" },
  { id: "contact", label: "Contact" },
] as const;

const NavLink = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => {
  const ref = useMagnetic<HTMLButtonElement>(8);
  return (
    <button
      ref={ref}
      onClick={onClick}
      data-cursor="hover"
      className={cn(
        "relative px-4 py-2 text-sm font-medium tracking-wide uppercase transition-colors",
        active ? "text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
      aria-label={`Scroll to ${label}`}
    >
      <span className="relative z-10">{label}</span>
      <span
        className={cn(
          "absolute left-1/2 -translate-x-1/2 bottom-1 h-1 w-1 rounded-full transition-all duration-300",
          active ? "bg-primary scale-100 shadow-[0_0_10px_hsl(var(--primary))]" : "bg-transparent scale-0",
        )}
        aria-hidden
      />
    </button>
  );
};

const ThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const ref = useMagnetic<HTMLButtonElement>(10);

  useEffect(() => setMounted(true), []);

  return (
    <button
      ref={ref}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      data-cursor="hover"
      aria-label="Toggle theme"
      className="relative h-11 w-11 rounded-full glass hover:glass-strong grid place-items-center group"
    >
      {mounted && (
        <>
          <Sun className="h-4 w-4 absolute transition-all duration-500 dark:rotate-90 dark:scale-0 group-hover:text-primary" />
          <Moon className="h-4 w-4 absolute transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100 group-hover:text-primary" />
        </>
      )}
    </button>
  );
};

export const Navigation = () => {
  const navRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<string>("hero");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide on scroll-down, reveal on scroll-up. Glass intensifies past hero.
  useEffect(() => {
    const nav = navRef.current;
    if (!nav) return;
    let lastY = window.scrollY;

    const ctx = gsap.context(() => {
      const onScroll = () => {
        const y = window.scrollY;
        const goingDown = y > lastY && y > 120;
        gsap.to(nav, {
          y: goingDown ? -120 : 0,
          duration: 0.5,
          ease: "power3.out",
        });
        nav.dataset.scrolled = y > 50 ? "true" : "false";
        lastY = y;
      };
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    });

    return () => ctx.revert();
  }, []);

  // Scroll-spy: keep `active` synced with viewport center
  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return;
      const t = ScrollTrigger.create({
        trigger: el,
        start: "top 40%",
        end: "bottom 40%",
        onToggle: (self) => self.isActive && setActive(id),
      });
      triggers.push(t);
    });
    return () => triggers.forEach((t) => t.kill());
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top: y, behavior: "smooth" });
    setMobileOpen(false);
  };

  return (
    <header
      ref={navRef}
      className="fixed top-0 inset-x-0 z-50 transition-all duration-500 data-[scrolled=true]:py-3 py-5"
      data-scrolled="false"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <nav
          className={cn(
            "flex items-center justify-between rounded-full px-4 sm:px-6 py-2",
            "transition-all duration-500",
            "[header[data-scrolled=true]_&]:glass-strong [header[data-scrolled=true]_&]:shadow-elegant",
          )}
        >
          {/* Logo / monogram */}
          <button
            onClick={() => scrollTo("hero")}
            data-cursor="hover"
            className="font-display font-bold text-xl tracking-tight px-3 py-2 hover:text-primary transition-colors"
            aria-label="Mohammed Ghazal — home"
          >
            <span className="text-gradient">M</span>
            <span className="text-foreground">G</span>
            <span className="text-primary">.</span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {SECTIONS.map((s) => (
              <NavLink
                key={s.id}
                label={s.label}
                active={active === s.id}
                onClick={() => scrollTo(s.id)}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            <ThemeButton />
            {/* Mobile menu trigger */}
            <button
              className="md:hidden h-11 w-11 rounded-full glass grid place-items-center"
              onClick={() => setMobileOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </nav>

        {/* Mobile drawer */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-out",
            mobileOpen ? "max-h-96 opacity-100 mt-3" : "max-h-0 opacity-0",
          )}
        >
          <div className="glass-strong rounded-3xl p-4 flex flex-col gap-1">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className={cn(
                  "text-left px-5 py-3 rounded-2xl text-base font-medium uppercase tracking-wide transition-colors",
                  active === s.id
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-foreground/5 hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
};
