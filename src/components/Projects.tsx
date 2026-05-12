import { useEffect, useRef } from "react";
import { ExternalLink, Github, ArrowUpRight } from "lucide-react";
import { gsap, SplitText } from "../lib/gsap";
import { useMagnetic } from "../lib/magnetic";

type Project = {
  index: string;
  title: string;
  tagline: string;
  description: string;
  stack: string[];
  image: string; // public path
  demo: string | null;
  github: string;
  status?: string;
  /** Hex accent used in the card glow + corner marks */
  accent: string;
  /** Year shipped */
  year: string;
};

const PROJECTS: Project[] = [
  {
    index: "01",
    title: "Chatify",
    tagline: "Real-time messaging, MERN-native.",
    description:
      "A real-time chat application with JWT-secured auth, Socket.io live messaging, presence indicators and a polished responsive UI. Mongo persistence, Express APIs, and a React front-end stitched together for a sub-100ms perceived send.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Socket.io", "JWT", "Tailwind"],
    image: "/projects/chatify.webp",
    demo: "https://chatify-ten-rho.vercel.app/",
    github: "https://github.com/MohammedGhazal09/Chatify",
    accent: "#22d3ee",
    year: "2024",
  },
  {
    index: "02",
    title: "PLASHOE",
    tagline: "End-to-end e-commerce, built deliberately.",
    description:
      "A full-stack shoes marketplace with auth, a real cart, integrated payments, and an admin dashboard for inventory ops. Built MERN, optimized for speed, and tuned end-to-end — from product browse to order confirmation.",
    stack: ["React", "Node.js", "Express", "MongoDB", "Stripe", "JWT", "Tailwind"],
    image: "/projects/plashoe.webp",
    demo: "https://ecommerce-theta-lemon.vercel.app",
    github: "https://github.com/MohammedGhazal09/PLASHOE",
    accent: "#a78bfa",
    year: "2024",
  },
  {
    index: "03",
    title: "Clutch",
    tagline: "Live multiplayer trivia with AI questions.",
    description:
      "An online multiplayer trivia game with AI-generated questions, live rooms, synchronized timers and realtime scoring. Currently in active private testing — a public demo is on the way.",
    stack: ["React", "Node.js", "Socket.io", "OpenAI", "MongoDB"],
    image: "/projects/clutch.svg",
    demo: null,
    github: "https://github.com/Mohammed-dev01/Clutch/tree/merge",
    accent: "#fbbf24",
    year: "2025",
    status: "In Development",
  },
];

const ProjectCard = ({ project, i }: { project: Project; i: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLDivElement>(null);
  const demoRef = useMagnetic<HTMLAnchorElement>(14);
  const githubRef = useMagnetic<HTMLAnchorElement>(14);

  // Each card pins, the next stacks on top. Image parallaxes inside.
  useEffect(() => {
    const card = cardRef.current;
    const img = imgRef.current;
    if (!card || !img) return;

    const ctx = gsap.context(() => {
      // Image parallax on scroll
      gsap.to(img, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });

      // Card scale-down as it gets pushed by the next card
      gsap.to(card, {
        scale: 0.92,
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: card,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });
    }, card);
    return () => ctx.revert();
  }, []);

  const positionStyle: React.CSSProperties = {
    top: `calc(80px + ${i * 24}px)`,
  };

  return (
    <div
      ref={cardRef}
      data-cursor="hover"
      style={positionStyle}
      className="project-card sticky"
    >
      <div
        className="relative rounded-[2rem] overflow-hidden glass-strong shadow-elegant"
        style={{
          boxShadow: `0 30px 80px -30px ${project.accent}40, 0 0 0 1px hsl(var(--border))`,
        }}
      >
        <div className="grid lg:grid-cols-12 gap-0">
          {/* Visual */}
          <div className="lg:col-span-7 relative overflow-hidden aspect-[16/10] lg:aspect-auto lg:min-h-[560px] bg-foreground/5">
            <div ref={imgRef} className="absolute inset-0 will-change-transform">
              <img
                src={project.image}
                alt={`${project.title} preview`}
                loading="lazy"
                decoding="async"
                className="h-[110%] w-full object-cover object-top"
              />
            </div>

            {/* Gradient sheet for legibility */}
            <div
              className="absolute inset-0 pointer-events-none mix-blend-multiply"
              style={{
                background: `linear-gradient(135deg, ${project.accent}10, transparent 60%)`,
              }}
            />

            {/* Corner markers */}
            <div
              className="absolute top-5 left-5 h-6 w-6 border-t-2 border-l-2"
              style={{ borderColor: project.accent }}
            />
            <div
              className="absolute bottom-5 right-5 h-6 w-6 border-b-2 border-r-2"
              style={{ borderColor: project.accent }}
            />

            {/* Index */}
            <div className="absolute top-5 right-5 font-mono text-xs tracking-[0.3em] uppercase px-3 py-1.5 rounded-full bg-black/40 backdrop-blur text-white">
              Project · {project.index}
            </div>

            {/* Status pill */}
            {project.status && (
              <div className="absolute bottom-5 left-5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/50 backdrop-blur text-xs font-mono uppercase tracking-[0.2em] text-amber-300 border border-amber-300/40">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300 animate-pulse" />
                {project.status}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="lg:col-span-5 p-8 md:p-10 flex flex-col justify-between bg-background/40 backdrop-blur-xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono uppercase tracking-[0.25em] text-muted-foreground">
                  {project.year}
                </span>
                <span
                  className="text-xs font-mono uppercase tracking-[0.25em]"
                  style={{ color: project.accent }}
                >
                  ● Live
                </span>
              </div>

              <h3 className="font-display font-bold text-5xl md:text-6xl tracking-[-0.03em] leading-none mb-3">
                {project.title}
              </h3>
              <p className="text-lg text-muted-foreground italic leading-snug mb-6">
                {project.tagline}
              </p>
              <p className="text-base leading-relaxed mb-8">{project.description}</p>

              <div className="flex flex-wrap gap-1.5 mb-8">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="text-[11px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-foreground/5 border border-foreground/10"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {project.demo ? (
                <a
                  ref={demoRef}
                  href={project.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="hover"
                  className="group inline-flex items-center gap-3 rounded-full bg-foreground text-background px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  Live demo
                  <ArrowUpRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              ) : (
                <span className="inline-flex items-center gap-3 rounded-full px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] border border-dashed border-muted-foreground/40 text-muted-foreground cursor-not-allowed">
                  <ExternalLink className="h-3.5 w-3.5" />
                  Demo soon
                </span>
              )}
              <a
                ref={githubRef}
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                className="group inline-flex items-center gap-3 rounded-full glass-strong px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] hover:bg-foreground/5"
              >
                <Github className="h-3.5 w-3.5" />
                Source
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const Projects = () => {
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
      return () => split.revert();
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="projects" className="relative py-32 md:py-48 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-3 mb-8 text-xs uppercase tracking-[0.3em] text-muted-foreground font-mono">
          <span className="h-px w-12 bg-foreground/30" />
          <span>03 — Selected work</span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-20">
          <h2
            ref={headlineRef}
            className="font-display font-bold tracking-[-0.03em] leading-[0.95] text-[clamp(2.5rem,8vw,7rem)] max-w-[14ch]"
          >
            Things I've <span className="text-gradient">shipped</span>.
          </h2>
          <p className="text-base md:text-lg text-muted-foreground max-w-md">
            Three projects I'd happily walk you through line-by-line — each shipped end-to-end, design through deploy.
          </p>
        </div>

        <div className="space-y-6">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.title} project={p} i={i} />
          ))}
        </div>
      </div>
    </section>
  );
};
