// The hero used to be a photograph of a Toyota Fortuner over a 1.1MB decorative
// PNG - 2MB between them, and a stock car on a site whose catalogue draws every
// vehicle precisely because stock photography was measured lying about which car
// it showed. The page now says the same thing above the fold as below it.
//
// It does NOT reuse CarSchematic. That component draws *one car's record*, and
// the hero has no car; handing it a fabricated CarProps would put exactly the
// invented measurement this project spent three sessions removing back into the
// codebase, one import away from looking authoritative. This plate claims
// nothing: it is the key that teaches the drawing, and it says so in its caption.

// The card plates use `0 0 160 100` because they sit in a fixed 1.6:1 slot. Here
// the plate sizes itself to the drawing, so the box is cropped to the ink -
// x 12..148, y 21..79, plus four units of air - rather than leaving a third of
// the panel empty above and below the car.
const HeroPlate = () => (
  <div className="hero__plate">
    <svg
      viewBox="8 17 144 66"
      role="img"
      aria-label="Plan view of a car with its front wheels highlighted, the key to the drawing on every card in the catalogue."
      className="hero__plate-drawing"
      preserveAspectRatio="xMidYMid meet"
    >
      {/* Same geometry as the card plates, at ~5x the size: body, cabin, engine
          block, four wheels, nose left. Strokes are halved because a 1.25 that
          reads as a hairline at 200px reads as a marker pen at 700px. */}
      <rect
        x="12" y="26" width="136" height="48" rx="14"
        className="fill-none stroke-current opacity-25"
        strokeWidth="0.6"
      />
      <rect
        x="62" y="33" width="70" height="34" rx="12"
        className="fill-none stroke-current opacity-20"
        strokeWidth="0.6"
      />
      <rect
        x="20" y="36" width="32" height="28" rx="4"
        className="fill-none stroke-current opacity-35"
        strokeWidth="0.7"
      />
      {[25.4, 30.8, 36.2, 41.6].map((x) => (
        <line
          key={x}
          x1={x} y1="41" x2={x} y2="59"
          className="stroke-current opacity-45"
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
          x={wheel.x} y={wheel.y} width="16" height="9" rx="3"
          className={
            wheel.powered ? "fill-primary-blue" : "fill-none stroke-current opacity-25"
          }
          strokeWidth="0.6"
        />
      ))}
    </svg>

    {/* The card plates already caption themselves in these tracked capitals, so
        the hero borrows the idiom rather than inventing a second one. The first
        draft listed "driven wheels, engine, battery" - and there is no battery
        in this drawing. A caption on a schematic is a label, not a feature list;
        it says what the plate is for. */}
    <p className="hero__plate-caption">
      Every car below is drawn from its own record
    </p>
  </div>
);

const Hero = () => {
  return (
    <div className="hero">
      <div className="flex-1 pt-36 padding-x">
        <h1 className="hero__title">
          Know what a car really costs to run.
        </h1>
        <p className="hero__subtitle">
          Search thousands of models by manufacturer, fuel and year, and see the
          real fuel-economy figures behind each one.
        </p>

        {/* A plain hash link; the smoothing is CSS on <html> (see layout.tsx). */}
        <a
          href="#discover"
          className="custom-btn inline-flex w-fit bg-primary-blue text-white rounded-full mt-10 font-bold"
        >
          Explore Cars
        </a>
      </div>

      <div className="hero__plate-container">
        <HeroPlate />
      </div>
    </div>
  )
}

export default Hero
