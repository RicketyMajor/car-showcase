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
