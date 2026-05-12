import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { ShaderBackground } from "../components/ShaderBackground";
import { useMagnetic } from "../lib/magnetic";

const NotFound = () => {
  const location = useLocation();
  const homeRef = useMagnetic<HTMLAnchorElement>(20);

  useEffect(() => {
    console.error("404 — non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <main className="relative min-h-[100svh] flex items-center justify-center overflow-hidden px-6">
      <ShaderBackground />
      <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background)/0.7)_100%)] pointer-events-none" />

      <div className="relative z-10 text-center max-w-2xl">
        <div className="text-xs font-mono uppercase tracking-[0.3em] text-muted-foreground mb-8">
          ERR · 404 · Resource not found
        </div>

        <h1 className="font-display font-bold tracking-[-0.04em] leading-none text-[clamp(6rem,22vw,18rem)]">
          <span className="text-gradient">4</span>
          <span className="text-foreground">0</span>
          <span className="text-gradient">4</span>
        </h1>

        <p className="mt-8 text-lg md:text-xl text-muted-foreground max-w-md mx-auto">
          This page wandered off. The route{" "}
          <code className="font-mono text-sm px-2 py-1 rounded bg-foreground/5 border border-foreground/10">
            {location.pathname}
          </code>{" "}
          isn't on the map.
        </p>

        <div className="mt-12">
          <a
            ref={homeRef}
            href="/"
            data-cursor="hover"
            className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background px-7 py-4 text-sm font-semibold uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
            Take me home
          </a>
        </div>
      </div>
    </main>
  );
};

export default NotFound;
