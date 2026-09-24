import type { CSSProperties } from "react";

// The hero used to be a photograph of a Toyota Fortuner over a 1.1MB decorative
// PNG - 2MB between them, and a stock car on a site whose catalogue draws every
// vehicle precisely because stock photography was measured lying about which car
// it showed. The page now says the same thing above the fold as below it.
//
// It does NOT reuse CarSchematic. That component draws *one car's record*, and
// the hero has no car; handing it a fabricated CarProps would put exactly the
// invented measurement this project spent three sessions removing back into the
// codebase, one import away from looking authoritative. This plate claims
// nothing: it is the key that teaches the drawing, and the key below says so.

// `--i` is each shape's place in the draw-in order (see the Motion block in
// globals.css); `pathLength="1"` lets one dash length trace any of them.
const order = (i: number) => ({ "--i": i }) as CSSProperties;

// The card plates use `0 0 160 100` because they sit in a fixed 1.6:1 slot. Here
// the plate sizes itself to the drawing, so the box is cropped to the ink -
// x 12..148, y 21..79, plus four units of air.
const HeroPlate = () => (
  <div className="hero__plate">
    <svg
      viewBox="8 17 144 66"
      role="img"
      aria-label="Plan view of a car with its front wheels highlighted, the key to the drawing on every card in the catalogue."
      className="w-full h-auto"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Same geometry as the card plates, at ~5x the size: body, cabin, engine
          block, four wheels, nose left. Strokes are halved because a 1.25 that
          reads as a hairline at 200px reads as a marker pen at 700px. */}
      <rect
        x="12" y="26" width="136" height="48" rx="14" pathLength="1" style={order(0)}
        className="fill-none stroke-current opacity-40"
        strokeWidth="0.6"
      />
      <rect
        x="62" y="33" width="70" height="34" rx="12" pathLength="1" style={order(1)}
        className="fill-none stroke-current opacity-30"
        strokeWidth="0.6"
      />
      <rect
        x="20" y="36" width="32" height="28" rx="4" pathLength="1" style={order(2)}
        className="fill-none stroke-current opacity-50"
        strokeWidth="0.7"
      />
      {[25.4, 30.8, 36.2, 41.6].map((x, i) => (
        <line
          key={x}
          x1={x} y1="41" x2={x} y2="59" pathLength="1" style={order(3 + i)}
          className="stroke-current opacity-60"
          strokeWidth="0.8"
          strokeLinecap="round"
        />
      ))}

      {[
        { x: 22, y: 21, powered: true },
        { x: 22, y: 70, powered: true },
        { x: 106, y: 21, powered: false },
        { x: 106, y: 70, powered: false },
      ].map((wheel) => (
        <rect
          key={`${wheel.x}-${wheel.y}`}
          x={wheel.x} y={wheel.y} width="16" height="9" rx="3" pathLength="1" style={order(7)}
          className={
            wheel.powered
              ? "fill-primary-blue wheel-driven"
              : "fill-none stroke-current opacity-40"
          }
          strokeWidth="0.6"
        />
      ))}
    </svg>
  </div>
);

// The caption grew into a key: the stage's bottom edge is where a maker's
// configurator lists what you are looking at. Every entry is something
// CarSchematic actually draws from a record - nothing here describes a car.
const DrawingKey = () => (
  <div className="stage__key">
    <div className="stage__key-row">
      <p className="type-label text-chalk/60">Every car below is drawn from its own record</p>
      <ul className="stage__key-list">
        <li><span className="key-swatch bg-primary-blue" aria-hidden="true" />Driven wheels</li>
        <li><span className="key-swatch key-swatch--strokes" aria-hidden="true" />One stroke per cylinder</li>
        <li><span className="key-swatch key-swatch--battery" aria-hidden="true" />Battery on electric cars</li>
      </ul>
    </div>
  </div>
);

const Hero = () => {
  return (
    <section className="stage">
      <div className="stage__inner">
        <div className="stage__copy">
          <h1 className="hero__title type-display">
            Know what a car really costs to run.
          </h1>
          <p className="hero__subtitle">
            Search thousands of models by manufacturer, fuel and year, and see the
            real fuel-economy figures behind each one.
          </p>

          {/* A plain hash link; the smoothing is CSS on <html> (see layout.tsx). */}
          <a href="#discover" className="custom-btn btn-primary mt-10 w-fit">
            Explore Cars
          </a>
        </div>

        <HeroPlate />
      </div>

      <DrawingKey />
    </section>
  )
}

export default Hero
