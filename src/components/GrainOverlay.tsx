/**
 * Subtle SVG-noise grain laid over the entire viewport.
 * Anchored to the viewport, never scrolls, never blocks pointer events.
 * SVG is inlined so we ship zero extra requests.
 */
export const GrainOverlay = () => (
  <div
    aria-hidden
    className="pointer-events-none fixed inset-0 z-[55] mix-blend-overlay opacity-[0.06] dark:opacity-[0.08]"
    style={{
      backgroundImage:
        "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
      backgroundSize: "200px 200px",
    }}
  />
);
