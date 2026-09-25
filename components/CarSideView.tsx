import type { CarProps } from "@/types";
import { isElectricDrive, type BodyFamily, type BodyProfile } from "@/utils/catalogue";

import { DRIVEN_AXLES, drivetrainSummary, engineCallout, order } from "./CarSchematic";

// The side elevation draws what the EPA class names - a body family and a size
// - and what the plan view already claims: where the engine or battery sits and
// which wheels are driven. Nothing else. Coordinates share the plan view's
// 160x100 box, nose left; `u` runs 0..1 along the body's length.

interface Silhouette {
  /** Upper outline from the front bottom corner to the rear bottom corner, as [u, y] pairs. */
  outline: [number, number][];
  /** The sill line; wheel centres sit on it and the arches are cut out of it. */
  bottom: number;
  /** Axle positions along the body. */
  axles: { front: number; rear: number };
  wheelRadius: number;
  /** The top of the engine block, just under the bonnet. */
  hood: number;
}

const SILHOUETTES: Record<BodyFamily, Silhouette> = {
  car: {
    outline: [[0, 70], [0, 58], [0.03, 50], [0.28, 47], [0.4, 33], [0.66, 32], [0.84, 44], [1, 47], [1, 70]],
    bottom: 70, axles: { front: 0.17, rear: 0.8 }, wheelRadius: 8, hood: 51,
  },
  wagon: {
    outline: [[0, 70], [0, 58], [0.03, 50], [0.28, 47], [0.4, 33], [0.93, 32], [1, 40], [1, 70]],
    bottom: 70, axles: { front: 0.17, rear: 0.8 }, wheelRadius: 8, hood: 51,
  },
  suv: {
    outline: [[0, 68], [0, 52], [0.03, 44], [0.26, 41], [0.36, 27], [0.92, 26], [1, 33], [1, 68]],
    bottom: 68, axles: { front: 0.17, rear: 0.8 }, wheelRadius: 10, hood: 45,
  },
  // The cab ends at 0.58; behind it the bed's rail is the top edge.
  pickup: {
    outline: [[0, 68], [0, 52], [0.03, 44], [0.26, 41], [0.34, 27], [0.56, 27], [0.58, 41], [1, 41], [1, 68]],
    bottom: 68, axles: { front: 0.16, rear: 0.8 }, wheelRadius: 10, hood: 45,
  },
  van: {
    outline: [[0, 69], [0, 48], [0.08, 38], [0.16, 26], [0.96, 25], [1, 30], [1, 69]],
    bottom: 69, axles: { front: 0.14, rear: 0.84 }, wheelRadius: 9, hood: 47,
  },
};

// Size only stretches the length; with one car on the stage there is nothing
// to compare a height against, and the class never states one.
const LENGTH = { small: 122, medium: 136, large: 150 } as const;

const FAMILY_NAME: Record<BodyFamily, string> = {
  car: "car", wagon: "station wagon", suv: "SUV", pickup: "pickup", van: "van",
};
// "medium" covers both Compact and Midsize classes, so it goes unnamed rather
// than calling a compact car midsize.
const SIZE_NAME = { small: "small ", medium: "", large: "large " } as const;

interface CarSideViewProps {
  car: CarProps;
  profile: BodyProfile;
  className?: string;
}

const CarSideView = ({ car, profile, className = "" }: CarSideViewProps) => {
  const isElectric = isElectricDrive(car.fuel_type);
  const driven = DRIVEN_AXLES[car.drive] ?? { front: false, rear: false };
  const shape = SILHOUETTES[profile.family];
  const length = LENGTH[profile.size];
  const x0 = (160 - length) / 2;
  const at = (u: number) => x0 + u * length;

  const { bottom, wheelRadius } = shape;
  const arch = wheelRadius + 1.5;
  const front = at(shape.axles.front);
  const rear = at(shape.axles.rear);

  // Over the top from the front bumper to the tail, then back along the sill,
  // lifting over each wheel so the body never cuts through one.
  const outline = [
    ...shape.outline.map(([u, y], i) => `${i ? "L" : "M"}${at(u).toFixed(1)} ${y}`),
    ...[rear, front].map(
      (x) => `L${(x + arch).toFixed(1)} ${bottom} A${arch} ${arch} 0 0 0 ${(x - arch).toFixed(1)} ${bottom}`,
    ),
    "Z",
  ].join(" ");

  // The block sits under the bonnet and above the front arch - the same front
  // engine the plan view draws. Cylinders are clamped as the plan view clamps them.
  const blockBottom = bottom - arch - 1;
  const block = { x: at(0.05), width: length * 0.2, y: shape.hood, height: blockBottom - shape.hood };
  const cylinders = isElectric ? 0 : Math.min(Math.max(car.cylinders, 0), 16);
  const cylinderStrokes = Array.from({ length: cylinders }, (_, i) => {
    const step = (block.width - 6) / (cylinders + 1);
    return block.x + 3 + step * (i + 1);
  });

  const wheels = [
    { u: shape.axles.front, powered: driven.front },
    { u: shape.axles.rear, powered: driven.rear },
  ];

  const label =
    `Side view: ${SIZE_NAME[profile.size]}${FAMILY_NAME[profile.family]}, ` +
    `${drivetrainSummary(car, isElectric)}. Driven wheels are highlighted.`;

  return (
    <div className={`relative ${className}`}>
      <svg viewBox="0 0 160 100" role="img" aria-label={label} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <path
          d={outline} pathLength="1" style={order(0)}
          className="fill-none stroke-current opacity-40"
          strokeWidth="1.25" strokeLinejoin="round"
        />

        {isElectric ? (
          // The pack is the floor, between the wheel arches.
          <rect
            x={front + arch + 2} y={bottom - 6} width={rear - front - 2 * arch - 4} height="4" rx="2"
            pathLength="1" style={order(1)}
            className="fill-primary-blue/15 stroke-primary-blue"
            strokeWidth="1.5"
          />
        ) : (
          <>
            <rect
              x={block.x} y={block.y} width={block.width} height={block.height} rx="3"
              pathLength="1" style={order(1)}
              className="fill-none stroke-current opacity-50"
              strokeWidth="1.25"
            />
            {cylinderStrokes.map((x, i) => (
              <line
                key={x}
                x1={x} y1={block.y + 2} x2={x} y2={block.y + block.height - 2}
                pathLength="1" style={order(2 + i)}
                className="stroke-current opacity-60"
                strokeWidth="1.4" strokeLinecap="round"
              />
            ))}
          </>
        )}

        {wheels.map((wheel) => (
          <circle
            key={wheel.u}
            cx={at(wheel.u)} cy={bottom} r={wheelRadius}
            pathLength="1" style={order(2 + cylinders)}
            className={wheel.powered ? "fill-primary-blue wheel-driven" : "fill-none stroke-current opacity-40"}
            strokeWidth="1.25"
          />
        ))}
      </svg>

      <span className="absolute bottom-0 left-0 type-label opacity-60">
        {engineCallout(car, isElectric)}
      </span>
    </div>
  );
};

export default CarSideView;
