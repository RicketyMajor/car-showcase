import type { CarProps } from "@/types";
import { isElectric as isElectricFuel } from "@/utils/catalogue";

// This catalogue has no photography, on purpose. imagin.studio's real customer
// id is paid, and every free source measured answers 200 with one identical
// stock image for every vehicle - including cars that do not exist. Rather than
// print a picture of a car that is not this car, the slot draws *this* car: a
// plan view whose driven wheels, cylinder count and battery all come from data
// the card already holds. It costs no network request, and it is never wrong.
//
// The one thing to read at a glance across the grid is which wheels are driven.
// Everything else on the plate stays hairline-quiet so that stays the signal.

const DRIVEN_AXLES: Record<string, { front: boolean; rear: boolean }> = {
  fwd: { front: true, rear: false },
  rwd: { front: false, rear: true },
  awd: { front: true, rear: true },
  "4wd": { front: true, rear: true },
};

// Nose left. The slot these plates sit in is 1.6:1, so the viewBox matches it
// and the car fills the width; drawn nose-up it used 49% of the slot and left
// half of it empty.
const AXLE_X = { front: 22, rear: 106 } as const;
const WHEEL = { width: 16, height: 9, top: 21, bottom: 70 } as const;

// The engine block's inner span, which the cylinder strokes divide up.
const BLOCK = { x: 20, width: 32, y: 36, height: 28 } as const;

function engineCallout(car: CarProps, isElectric: boolean): string {
  if (isElectric) return car.fuel_type || "Electric";
  const parts: string[] = [];
  // toFixed(1) because a 4.0-litre arrives as the number 4 and "4L" reads like
  // a rounding error rather than a displacement.
  if (car.displacement > 0) parts.push(`${car.displacement.toFixed(1)}L`);
  if (car.cylinders > 0) parts.push(`${car.cylinders} cyl`);
  // Displacement and cylinders both arrive as 0 when the upstream omits them,
  // and an empty plate reads as a rendering bug. Name the fuel instead.
  return parts.join(" · ") || car.fuel_type;
}

function describe(car: CarProps, isElectric: boolean): string {
  const drivetrain = DRIVEN_AXLES[car.drive]
    ? `${car.drive.toUpperCase()} drivetrain`
    : "drivetrain not reported";
  const power = isElectric
    ? "battery electric"
    : car.cylinders > 0
      ? `${car.cylinders}-cylinder engine`
      : "engine";
  return `Plan view: ${drivetrain}, ${power}. Driven wheels are highlighted.`;
}

interface CarSchematicProps {
  car: CarProps;
  /** Sizes the plate; the drawing scales to fit and stays centred. */
  className?: string;
}

const CarSchematic = ({ car, className = "" }: CarSchematicProps) => {
  // Tested on fuel_type rather than a cylinder count of zero: the upstream drops
  // `cylinders` for some petrol cars too, and drawing a battery into one of
  // those would be exactly the kind of confident lie this plate exists to avoid.
  const isElectric = isElectricFuel(car.fuel_type);
  const driven = DRIVEN_AXLES[car.drive] ?? { front: false, rear: false };

  const wheels = [
    { x: AXLE_X.front, y: WHEEL.top, powered: driven.front },
    { x: AXLE_X.front, y: WHEEL.bottom, powered: driven.front },
    { x: AXLE_X.rear, y: WHEEL.top, powered: driven.rear },
    { x: AXLE_X.rear, y: WHEEL.bottom, powered: driven.rear },
  ];

  // Evenly spaced inside the block, so a flat-four and a V8 are told apart by
  // density rather than by reading a number. Clamped because the count comes
  // straight off the upstream: nothing but this stops a malformed record from
  // asking for thousands of strokes, and 16 already covers every engine made.
  const cylinders = isElectric ? 0 : Math.min(Math.max(car.cylinders, 0), 16);
  const cylinderStrokes = Array.from({ length: cylinders }, (_, i) => {
    const step = (BLOCK.width - 10) / (cylinders + 1);
    return BLOCK.x + 5 + step * (i + 1);
  });

  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 160 100"
        role="img"
        aria-label={describe(car, isElectric)}
        className="w-full h-full text-black-100"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Body and cabin: hairline only, so the drawing reads as a schematic
            and never competes with the driven wheels. */}
        <rect
          x="12" y="26" width="136" height="48" rx="14"
          className="fill-none stroke-current opacity-25"
          strokeWidth="1.25"
        />

        {isElectric ? (
          // No engine bay and no cabin outline: on a battery car the floor is
          // the battery, and that is the whole shape worth drawing.
          <rect
            x="34" y="32" width="102" height="36" rx="6"
            className="fill-primary-blue/10 stroke-primary-blue"
            strokeWidth="1.5"
          />
        ) : (
          <>
            <rect
              x="62" y="33" width="70" height="34" rx="12"
              className="fill-none stroke-current opacity-20"
              strokeWidth="1.25"
            />
            <rect
              x={BLOCK.x} y={BLOCK.y} width={BLOCK.width} height={BLOCK.height} rx="4"
              className="fill-none stroke-current opacity-35"
              strokeWidth="1.25"
            />
            {cylinderStrokes.map((x) => (
              <line
                key={x}
                x1={x} y1={BLOCK.y + 5} x2={x} y2={BLOCK.y + BLOCK.height - 5}
                className="stroke-current opacity-45"
                strokeWidth="1.4"
                strokeLinecap="round"
              />
            ))}
          </>
        )}

        {wheels.map((wheel) => (
          <rect
            key={`${wheel.x}-${wheel.y}`}
            x={wheel.x} y={wheel.y} width={WHEEL.width} height={WHEEL.height} rx="3"
            className={
              wheel.powered
                ? "fill-primary-blue"
                : "fill-none stroke-current opacity-25"
            }
            strokeWidth="1.25"
          />
        ))}
      </svg>

      <span className="absolute bottom-0 left-0 text-[11px] font-bold uppercase tracking-[0.08em] text-black-100/45">
        {engineCallout(car, isElectric)}
      </span>
    </div>
  );
};

export default CarSchematic;
