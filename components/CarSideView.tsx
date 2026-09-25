import type { CarProps } from "@/types";
import { isElectricDrive, type BodyFamily, type BodyProfile } from "@/utils/catalogue";

import { DRIVEN_AXLES, drivetrainSummary, engineCallout, order } from "./CarSchematic";

// The side elevation draws what the EPA class names - a body family and a size
// - and what the plan view already claims: where the engine or battery sits and
// which wheels are driven. Nothing else. Coordinates share the plan view's
// 160x100 box, nose left; `u` runs 0..1 along the body's length.

const GROUND = 78;

interface Silhouette {
  /** Outline from the front bottom corner, clockwise, as [u, y] pairs. */
  outline: [number, number][];
  /** Axle positions along the body. */
  axles: { front: number; rear: number };
  wheelRadius: number;
  /** The bonnet line the engine block sits under. */
  hood: number;
}

const SILHOUETTES: Record<BodyFamily, Silhouette> = {
  car: {
    outline: [[0, 68], [0, 58], [0.04, 53], [0.28, 50], [0.4, 38], [0.66, 37], [0.84, 48], [1, 51], [1, 68]],
    axles: { front: 0.17, rear: 0.8 }, wheelRadius: 10, hood: 53,
  },
  wagon: {
    outline: [[0, 68], [0, 58], [0.04, 53], [0.28, 50], [0.4, 38], [0.93, 37], [1, 44], [1, 68]],
    axles: { front: 0.17, rear: 0.8 }, wheelRadius: 10, hood: 53,
  },
  suv: {
    outline: [[0, 66], [0, 54], [0.04, 48], [0.26, 45], [0.36, 32], [0.92, 31], [1, 38], [1, 66]],
    axles: { front: 0.17, rear: 0.8 }, wheelRadius: 12, hood: 48,
  },
  // The cab ends at 0.58; behind it the bed's rail is the top edge.
  pickup: {
    outline: [[0, 66], [0, 54], [0.04, 48], [0.26, 45], [0.34, 32], [0.56, 32], [0.58, 45], [1, 45], [1, 66]],
    axles: { front: 0.16, rear: 0.8 }, wheelRadius: 12, hood: 48,
  },
  van: {
    outline: [[0, 67], [0, 50], [0.08, 40], [0.16, 28], [0.96, 27], [1, 32], [1, 67]],
    axles: { front: 0.14, rear: 0.84 }, wheelRadius: 11, hood: 50,
  },
};

// Size only stretches the length; with one car on the stage there is nothing
// to compare a height against, and the class never states one.
const LENGTH = { small: 122, medium: 136, large: 150 } as const;

const FAMILY_NAME: Record<BodyFamily, string> = {
  car: "car", wagon: "station wagon", suv: "SUV", pickup: "pickup", van: "van",
};
const SIZE_NAME = { small: "small", medium: "midsize", large: "large" } as const;

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

  const outline =
    shape.outline.map(([u, y], i) => `${i ? "L" : "M"}${at(u).toFixed(1)} ${y}`).join(" ") + " Z";

  // The block sits over the front axle, under the bonnet - the same front
  // engine the plan view draws. Cylinders are clamped as the plan view clamps them.
  const block = { x: at(0.05), width: length * 0.2, y: shape.hood + 3, height: 63 - shape.hood };
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
    `Side view: ${SIZE_NAME[profile.size]} ${FAMILY_NAME[profile.family]}, ` +
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
          // The pack is the floor, between the axles.
          <rect
            x={at(0.22)} y="61" width={length * 0.54} height="5" rx="2" pathLength="1" style={order(1)}
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
                x1={x} y1={block.y + 3} x2={x} y2={block.y + block.height - 3}
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
            cx={at(wheel.u)} cy={GROUND - shape.wheelRadius} r={shape.wheelRadius}
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
