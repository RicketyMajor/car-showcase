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

const API_BASE = "https://www.fueleconomy.gov/ws/rest";

// The API answers 200 with a literal `null` body for a query it does not
// recognise, so "there is no such make" and "the request failed" arrive looking
// identical. `ok` is the only thing that separates them: it is false when the
// request never produced a body, true when it did - even if that body was null.
export type Fetched<T> = { ok: true; data: T | null } | { ok: false };

export async function getJson<T>(path: string): Promise<Fetched<T>> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
      // The dataset changes at most yearly; cache aggressively so a page of
      // cars costs the visitor nothing.
      next: { revalidate: 86400 },
    });
    if (!response.ok) return { ok: false };
    return { ok: true, data: (await response.json()) as T | null };
  } catch {
    return { ok: false };
  }
}
