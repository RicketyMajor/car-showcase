import { test } from "node:test";
import assert from "node:assert/strict";

import {
  driveLabel,
  hasMore,
  isElectric,
  mpgFillPercent,
  mpgLegend,
  mpgUnit,
  transmissionLabel,
} from "./catalogue.ts";

test("mpgFillPercent scales a card's bar against the page's own range", () => {
  const range = { min: 18, max: 32 };

  // The worst car on the page keeps a visible stub, so an empty track never
  // reads as missing data.
  assert.equal(mpgFillPercent(18, range), 6);
  assert.equal(mpgFillPercent(32, range), 100);
  assert.equal(mpgFillPercent(25, range), 53);
});

test("mpgFillPercent fills the bar when every car on the page shares one figure", () => {
  // The zero-span branch: a filter narrowed the page to cars of identical
  // efficiency, so there is no spread left to draw and the division would be by
  // zero. Every bar goes full rather than every bar going empty.
  assert.equal(mpgFillPercent(30, { min: 30, max: 30 }), 100);
});

test("hasMore offers another page only while the grid came back full", () => {
  // fetchCars slices to `limit`, so a full page is the only evidence that more
  // might exist upstream.
  assert.equal(hasMore(10, 10), true);
  assert.equal(hasMore(7, 10), false);
  assert.equal(hasMore(0, 10), false);

  // The known imprecision, pinned on purpose: when the make has exactly `limit`
  // models, the button still shows once and the next page returns the same
  // cars. It then disappears. Cheaper than a count the API does not expose.
  assert.equal(hasMore(20, 20), true);
});

test("mpgUnit names an electric car's figure MPGe, because the API reuses city08", () => {
  assert.equal(mpgUnit("Electricity"), "MPGe");
  assert.equal(mpgUnit("Regular Gasoline"), "MPG");
  assert.equal(mpgUnit("Premium Gasoline"), "MPG");
  assert.equal(mpgUnit("Diesel"), "MPG");
  // A plug-in hybrid carries electricity as fuelType1 and is measured the same way.
  assert.equal(mpgUnit("Electricity and Gasoline"), "MPGe");
  assert.equal(mpgUnit(""), "MPG");
});

test("isElectric reads the fuel type, never a missing cylinder count", () => {
  assert.equal(isElectric("Electricity"), true);
  assert.equal(isElectric("Regular Gasoline"), false);
  // The upstream drops `cylinders` on some petrol cars too, so the count is not
  // a safe signal - drawing a battery into one of those is the lie this avoids.
  assert.equal(isElectric(""), false);
});

test("transmissionLabel and driveLabel spell out the stored codes", () => {
  assert.equal(transmissionLabel("a"), "Automatic");
  assert.equal(transmissionLabel("m"), "Manual");

  assert.equal(driveLabel("fwd"), "FWD");
  assert.equal(driveLabel("4wd"), "4WD");
  // toDriveCode returns "n/a" when the upstream's wording is new to it, and
  // "N/A" on screen reads like a value rather than an absence.
  assert.equal(driveLabel("n/a"), "Not reported");
  assert.equal(driveLabel(""), "Not reported");
});

test("mpgLegend states what a full bar means on this page", () => {
  assert.equal(
    mpgLegend({ min: 18, max: 32 }),
    "Bars compare city fuel economy across this page, from 18 to 32.",
  );
  // The same zero-span page the bar fills: there is no range left to state.
  assert.equal(
    mpgLegend({ min: 30, max: 30 }),
    "Every car on this page returns 30 in the city.",
  );
});
