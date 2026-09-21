// A type-only import: Node's type stripping erases it, so `node --test` never
// tries to resolve the `@/` alias it does not know about. Next resolves it
// normally at build time.
import type { CarProps } from "@/types";

export interface FuelEconomyMenuItem {
  text: string;
  value: string;
}

// A menu holds a bare object when it has one entry, an array when it has more,
// and the whole response is null when the query matches nothing.
export interface FuelEconomyMenu {
  menuItem?: FuelEconomyMenuItem | FuelEconomyMenuItem[] | null;
}

// The real payload carries 95 fields; these are the ones the app displays.
export interface FuelEconomyVehicle {
  make?: string;
  model?: string;
  year?: string;
  VClass?: string;
  fuelType1?: string;
  trany?: string;
  drive?: string;
  cylinders?: string;
  displ?: string;
  city08?: string;
  highway08?: string;
  comb08?: string;
}

const DRIVE_CODES: ReadonlyArray<[RegExp, string]> = [
  [/front-wheel/i, "fwd"],
  [/rear-wheel/i, "rwd"],
  [/all-wheel/i, "awd"],
  [/4-wheel/i, "4wd"],
];

export function toArray<T>(value: T | T[] | null | undefined): T[] {
  if (value === null || value === undefined) return [];
  return Array.isArray(value) ? value : [value];
}

export function toTransmissionCode(trany: string): "a" | "m" {
  return trany.toLowerCase().startsWith("manual") ? "m" : "a";
}

export function toDriveCode(drive: string): string {
  const match = DRIVE_CODES.find(([pattern]) => pattern.test(drive));
  return match ? match[1] : "n/a";
}

// Every numeric field arrives as a string, and a bad one must not reach the rent
// calculation - that is exactly how the previous source printed "NaN/day".
export function toNumber(value: string | number | undefined): number {
  const parsed = typeof value === "number" ? value : Number.parseFloat(value ?? "");
  return Number.isFinite(parsed) ? parsed : 0;
}

export function toCarProps(vehicle: FuelEconomyVehicle): CarProps {
  return {
    make: vehicle.make ?? "",
    model: vehicle.model ?? "",
    year: toNumber(vehicle.year),
    class: vehicle.VClass ?? "",
    fuel_type: vehicle.fuelType1 ?? "",
    transmission: toTransmissionCode(vehicle.trany ?? ""),
    drive: toDriveCode(vehicle.drive ?? ""),
    cylinders: toNumber(vehicle.cylinders),
    displacement: toNumber(vehicle.displ),
    city_mpg: toNumber(vehicle.city08),
    highway_mpg: toNumber(vehicle.highway08),
    combination_mpg: toNumber(vehicle.comb08),
  };
}
