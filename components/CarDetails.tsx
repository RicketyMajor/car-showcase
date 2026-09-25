"use client";

import { useState } from "react";
import { Dialog, DialogBackdrop, DialogPanel, DialogTitle } from "@headlessui/react";

import type { CarProps } from "@/types";
import { bodyProfile, driveLabel, mpgUnit, transmissionLabel } from "@/utils/catalogue";

import CarSchematic from "./CarSchematic";
import CarSideView from "./CarSideView";
import { CloseIcon } from "./icons";
import ViewSwitch, { type View } from "./ViewSwitch";

interface CarDetailsProps {
  isOpen: boolean;
  closeModal: () => void;
  car: CarProps;
}

interface Cell {
  value: string;
  label: string;
}

// The raw record printed all twelve fields in storage order, so the dialog said
// `Transmission: a`, `Drive: rwd` and `Displacement: 4` - and read worse still
// once the plate above it started rendering the same drivetrain properly. Every
// field appears exactly once now: make and model in the title, year, class and
// fuel in the meta line, and the rest as stamped cells below.
function drivetrainCells(car: CarProps): Cell[] {
  const cells: Cell[] = [
    { value: transmissionLabel(car.transmission), label: "Transmission" },
    { value: driveLabel(car.drive), label: "Drive" },
  ];

  // A zero here means the upstream omitted the field, not that the car has no
  // cylinders. The schematic makes the same call; printing "0" would not.
  if (car.cylinders > 0) cells.push({ value: `${car.cylinders}`, label: "Cylinders" });
  if (car.displacement > 0) {
    // toFixed(1) because a 4.0-litre arrives as the number 4, and "4 L" reads
    // like a rounding error rather than a displacement.
    cells.push({ value: `${car.displacement.toFixed(1)} L`, label: "Displacement" });
  }

  return cells;
}

const CarDetails = ({ isOpen, closeModal, car }: CarDetailsProps) => {
  const unit = mpgUnit(car.fuel_type);
  const profile = bodyProfile(car.class);
  const [view, setView] = useState<View>("top");
  // Every opening starts on the plan view. Adjusted during render, React's
  // documented way to reset state on a prop change, so no effect runs a frame late.
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (isOpen !== wasOpen) {
    setWasOpen(isOpen);
    if (isOpen) setView("top");
  }

  return (
    <Dialog open={isOpen} as="div" className="relative z-10" onClose={closeModal}>
      {/* Headless UI v2 drives transitions from the component's own `transition`
          prop and data-* state, not from a <Transition.Child> wrapper. Under v1
          markup the enter classes never applied, so the panel and the backdrop
          stayed at their enterFrom opacity of 0. */}
      <DialogBackdrop
        transition
        className="fixed inset-0 bg-stage/60 backdrop-blur-sm transition duration-300 ease-out data-[closed]:opacity-0"
      />

      <div className="fixed inset-0 overflow-y-auto">
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          {/* The transition classes stay inline rather than @apply'd into the
              panel class: they are data-[closed] variants, and a variant that
              silently emits nothing through @apply is how this project lost its
              focus rings once already. */}
          <DialogPanel
            transition
            className="car-details__dialog-panel transition duration-500 [transition-timing-function:var(--ease-out)] data-[closed]:opacity-0 data-[closed]:translate-y-6 data-[closed]:scale-[0.98]"
          >
            <button
              type="button"
              aria-label="Close"
              className="car-details__close-btn"
              onClick={closeModal}
            >
              <CloseIcon />
            </button>

            {/* One plate, not four. The three thumbnails asked imagin.studio for
                angles 29/33/13 and were handed the same image three times.
                Opening a car is entering its configurator: its own lit stage,
                where the drawing draws itself again (see the Motion block). */}
            <div className="car-details__stage">
              {/* Only when the class names a body: a view drawn from nothing
                  would be a guess, and a dead switch is worse than none. */}
              {profile && (
                <ViewSwitch value={view} onChange={setView} tone="dark" className="car-details__views" />
              )}
              {/* Two components, so switching remounts the drawing and it draws itself in again. */}
              {view === "side" && profile ? (
                <CarSideView car={car} profile={profile} className="w-full h-full draw-in" />
              ) : (
                <CarSchematic car={car} className="w-full h-full draw-in" />
              )}
            </div>

            <div className="car-details__content">
            <div className="flex flex-col gap-1">
              {/* DialogTitle, not a bare h2: Headless UI wires aria-labelledby
                  from it, so without it the dialog is announced with no name. */}
              <DialogTitle as="h2" className="type-display text-[28px] capitalize">
                {car.make} {car.model}
              </DialogTitle>
              <p className="car-details__meta">
                {car.year} &middot; {car.class} &middot; {car.fuel_type}
              </p>
            </div>

            <div className="car-details__group">
              <h3 className="car-details__group-title">Efficiency</h3>
              <div className="car-details__panel">
                {/* Combined leads because it is the one figure that summarises a
                    car; city and highway are the two readings it averages. */}
                <p className="car-details__headline">
                  {car.combination_mpg}{" "}
                  <span className="car-details__cell-label">{unit} combined</span>
                </p>
                <div className="car-details__cells">
                  <div className="car-details__cell">
                    <span className="car-details__cell-value">{car.city_mpg}</span>
                    <span className="car-details__cell-label">{unit} city</span>
                  </div>
                  <div className="car-details__cell">
                    <span className="car-details__cell-value">{car.highway_mpg}</span>
                    <span className="car-details__cell-label">{unit} highway</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="car-details__group">
              <h3 className="car-details__group-title">Drivetrain</h3>
              <div className="car-details__cells">
                {drivetrainCells(car).map((cell) => (
                  <div className="car-details__cell" key={cell.label}>
                    <span className="car-details__cell-value">{cell.value}</span>
                    <span className="car-details__cell-label">{cell.label}</span>
                  </div>
                ))}
              </div>
            </div>
            </div>
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default CarDetails;
