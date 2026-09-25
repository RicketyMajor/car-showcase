import type { CSSProperties } from "react";

import type { CarProps } from "@/types";
import { isElectricDrive } from "@/utils/catalogue";

// This catalogue has no photography, on purpose. imagin.studio's real customer
// id is paid, and every free source measured answers 200 with one identical
// stock image for every vehicle - including cars that do not exist. Rather than
// print a picture of a car that is not this car, the slot draws *this* car: a
// plan view whose driven wheels, cylinder count and battery all come from data
// the card already holds. It costs no network request, and it is never wrong.
//
// The one thing to read at a glance across the grid is which wheels are driven.
// Everything else on the plate stays hairline-quiet so that stays the signal.

export const DRIVEN_AXLES: Record<string, { front: boolean; rear: boolean }> = {
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

export function engineCallout(car: CarProps, isElectric: boolean): string {
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

// Shared by both views, so the plan and the side elevation describe the same car.
export function drivetrainSummary(car: CarProps, isElectric: boolean): string {
  const drivetrain = DRIVEN_AXLES[car.drive]
    ? `${car.drive.toUpperCase()} drivetrain`
    : "drivetrain not reported";
  const power = isElectric
    ? `${car.fuel_type.toLowerCase()} electric drive`
    : car.cylinders > 0
      ? `${car.cylinders}-cylinder engine`
      : "engine";
  return `${drivetrain}, ${power}`;
}

// `--i` is each shape's place in the draw-in order (see the Motion block in
// globals.css); `pathLength="1"` lets one dash length trace any of them.
export const order = (i: number) => ({ "--i": i }) as CSSProperties;

interface CarSchematicProps {
  car: CarProps;
  /** Sizes the plate; the drawing scales to fit and stays centred. */
  className?: string;
}

const CarSchematic = ({ car, className = "" }: CarSchematicProps) => {
  // Tested on fuel_type rather than a cylinder count of zero: the upstream drops
  // `cylinders` for some petrol cars too, and drawing a battery into one of
  // those would be exactly the kind of confident lie this plate exists to avoid.
  // Hydrogen counts: a fuel-cell car has an electric drivetrain and no engine,
  // and drawn as a combustion car it got an engine block with no cylinders in
  // it - a plate that looked like a rendering fault rather than a Mirai.
  const isElectric = isElectricDrive(car.fuel_type);
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
        aria-label={`Plan view: ${drivetrainSummary(car, isElectric)}. Driven wheels are highlighted.`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Body and cabin: hairline only, so the drawing reads as a schematic
            and never competes with the driven wheels. */}
        <rect
          x="12" y="26" width="136" height="48" rx="14" pathLength="1" style={order(0)}
          className="fill-none stroke-current opacity-40"
          strokeWidth="1.25"
        />

        {isElectric ? (
          // No engine bay and no cabin outline: on a battery car the floor is
          // the battery - on a fuel-cell one, the stack and its tanks - and
          // that is the whole shape worth drawing.
          <rect
            x="34" y="32" width="102" height="36" rx="6" pathLength="1" style={order(1)}
            className="fill-primary-blue/15 stroke-primary-blue"
            strokeWidth="1.5"
          />
        ) : (
          <>
            <rect
              x="62" y="33" width="70" height="34" rx="12" pathLength="1" style={order(1)}
              className="fill-none stroke-current opacity-30"
              strokeWidth="1.25"
            />
            <rect
              x={BLOCK.x} y={BLOCK.y} width={BLOCK.width} height={BLOCK.height} rx="4"
              pathLength="1" style={order(2)}
              className="fill-none stroke-current opacity-50"
              strokeWidth="1.25"
            />
            {cylinderStrokes.map((x, i) => (
              <line
                key={x}
                x1={x} y1={BLOCK.y + 5} x2={x} y2={BLOCK.y + BLOCK.height - 5}
                pathLength="1" style={order(3 + i)}
                className="stroke-current opacity-60"
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
            pathLength="1" style={order(3 + cylinders)}
            className={
              wheel.powered
                ? "fill-primary-blue wheel-driven"
                : "fill-none stroke-current opacity-40"
            }
            strokeWidth="1.25"
          />
        ))}
      </svg>

      {/* Inherits its colour like the drawing: chalk on a stage, ink on the floor. */}
      <span className="absolute bottom-0 left-0 type-label opacity-60">
        {engineCallout(car, isElectric)}
      </span>
    </div>
  );
};

export default CarSchematic;
