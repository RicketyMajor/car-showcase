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

// Tested on the fuel type rather than on a cylinder count of zero: the upstream
// drops `cylinders` for some petrol cars too.
export function isElectric(fuelType: string): boolean {
  return /electric/i.test(fuelType);
}

// fueleconomy.gov puts an electric car's MPGe into the same `city08` field a
// petrol car's MPG arrives in. Printing "131 MPG city" under a Tesla is wrong by
// a factor nobody can see, so the label follows the fuel.
export function mpgUnit(fuelType: string): string {
  return isElectric(fuelType) ? "MPGe" : "MPG";
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

// A bar drawn against the page's own spread is only readable if the page says
// what its ends are. Obvious across a grid of ten, much less so once a filter
// narrows it to two.
export function mpgLegend(range: MpgRange): string {
  if (range.min === range.max) {
    return `Every car on this page returns ${range.min} in the city.`;
  }
  return `Bars compare city fuel economy across this page, from ${range.min} to ${range.max}.`;
}
