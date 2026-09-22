// Pure arithmetic and labels the catalogue page and its cards share. Nothing in
// here imports anything: `node --test` cannot resolve the `@/` alias, and this
// is the module the tests load. Same constraint that put `getJson` in
// `utils/fueleconomy.ts`.

/** The best and worst city figures currently on screen. */
export interface MpgRange {
  min: number;
  max: number;
}

// Bars are drawn against the set the visitor can actually see, so the
// comparison changes honestly as the filters change. The 6% floor keeps the
// least efficient car on the page visible - an empty track reads as missing
// data, not as a low number.
export function mpgFillPercent(cityMpg: number, range: MpgRange): number {
  const span = range.max - range.min;
  const share = span > 0 ? (cityMpg - range.min) / span : 1;
  return Math.round(6 + share * 94);
}

// fetchCars slices its result to `limit`, so a page that came back full is the
// only evidence that the upstream holds more. The API exposes no total, so a
// make with exactly `limit` models shows the button once and then loses it.
export function hasMore(shown: number, limit: number): boolean {
  return shown >= limit;
}

// Has no combustion engine: a battery car, or a hydrogen fuel-cell one, which
// is an electric drivetrain fed by a stack rather than a pack. Tested on the
// fuel type rather than on a cylinder count of zero, because the upstream drops
// `cylinders` for some petrol cars too - and it really does drop it for the
// Mirai, which is how the hydrogen case hid.
export function isElectricDrive(fuelType: string): boolean {
  return /electric|hydrogen/i.test(fuelType);
}

// fueleconomy.gov puts an MPGe figure into the same `city08` field a petrol
// car's MPG arrives in, for battery and fuel-cell cars alike. Printing
// "131 MPG city" under a Tesla, or "76 MPG city" under a Mirai, is wrong by a
// factor nobody can see, so the label follows the fuel.
export function mpgUnit(fuelType: string): string {
  return isElectricDrive(fuelType) ? "MPGe" : "MPG";
}

export function transmissionLabel(code: string): string {
  return code === "m" ? "Manual" : "Automatic";
}

export function driveLabel(code: string): string {
  // toDriveCode yields "n/a" when the upstream's wording is new to it. "N/A" on
  // screen reads like a value; this reads like the absence it is.
  if (!code || code === "n/a") return "Not reported";
  return code.toUpperCase();
}

/** One scale per unit, because MPG and MPGe are not the same quantity. */
export type MpgRanges = Record<string, MpgRange>;

// A page can hold both kinds at once - Kia 2022's first ten models are six
// petrol cars and four electrics - and on one shared scale an EV6 at 136 MPGe
// fixed the top while every petrol car collapsed into a 6-32% stub band. The
// bar exists to compare the cars on screen; ranked against a unit they are not
// measured in, it compared nothing. Each car is now drawn against the others
// rated the way it is.
export function mpgRangesByUnit(cars: { city_mpg: number; fuel_type: string }[]): MpgRanges {
  const ranges: MpgRanges = {};
  for (const car of cars) {
    const unit = mpgUnit(car.fuel_type);
    const seen = ranges[unit];
    ranges[unit] = seen
      ? { min: Math.min(seen.min, car.city_mpg), max: Math.max(seen.max, car.city_mpg) }
      : { min: car.city_mpg, max: car.city_mpg };
  }
  return ranges;
}

// A bar drawn against the page's own spread is only readable if the page says
// what its ends are - and on a mixed page it must say there is more than one
// scale, or the short petrol bars read as a verdict on the petrol cars.
export function mpgLegend(ranges: MpgRanges): string {
  const spans = Object.entries(ranges).map(([unit, range]) =>
    range.min === range.max ? `${range.min} ${unit}` : `${range.min}-${range.max} ${unit}`,
  );
  return `Bars compare each car with others rated the same way on this page: ${spans.join(", ")}.`;
}
