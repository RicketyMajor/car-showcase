import { test } from "node:test";
import assert from "node:assert/strict";

import {
  bodyProfile,
  driveLabel,
  hasMore,
  isElectricDrive,
  mpgFillPercent,
  mpgLegend,
  mpgRangesByUnit,
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

test("isElectricDrive reads the fuel type, never a missing cylinder count", () => {
  assert.equal(isElectricDrive("Electricity"), true);
  assert.equal(isElectricDrive("Regular Gasoline"), false);
  // The upstream drops `cylinders` on some petrol cars too, so the count is not
  // a safe signal - drawing a battery into one of those is the lie this avoids.
  assert.equal(isElectricDrive(""), false);
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

test("mpgUnit rates a hydrogen fuel-cell car in MPGe too", () => {
  // The EPA rates a fuel-cell car in MPGe exactly as it rates a battery one,
  // and fueleconomy.gov puts that figure in city08 like every other. The 2022
  // Toyota Mirai LE returns city08 "76" - as MPG that is a lie by a factor of
  // about 2.5, and `fuels` in constants/ ships a Hydrogen filter, so this is a
  // car the catalogue actively invites the visitor to find.
  assert.equal(mpgUnit("Hydrogen"), "MPGe");
  assert.equal(isElectricDrive("Hydrogen"), true);
});

test("mpgRangesByUnit keeps MPG and MPGe on separate scales", () => {
  // Kia 2022's first ten models mix six petrol cars with four electrics. On one
  // shared scale the EV6 fixed the top and every petrol car collapsed into the
  // 6-32% stub band - the bar compares the cars on screen, and there it
  // compared nothing.
  const ranges = mpgRangesByUnit([
    { city_mpg: 19, fuel_type: "Regular Gasoline" },
    { city_mpg: 51, fuel_type: "Regular Gasoline" },
    { city_mpg: 27, fuel_type: "Regular Gasoline" },
    { city_mpg: 136, fuel_type: "Electricity" },
    { city_mpg: 116, fuel_type: "Electricity" },
  ]);

  assert.deepEqual(ranges, {
    MPG: { min: 19, max: 51 },
    MPGe: { min: 116, max: 136 },
  });

  // Each car is now drawn against its own kind: the worst petrol car keeps the
  // stub and the best one fills, instead of every petrol car reading as bad.
  assert.equal(mpgFillPercent(19, ranges.MPG), 6);
  assert.equal(mpgFillPercent(51, ranges.MPG), 100);
  assert.equal(mpgFillPercent(116, ranges.MPGe), 6);
  assert.equal(mpgFillPercent(136, ranges.MPGe), 100);
});

test("mpgLegend names every scale the page is actually drawing", () => {
  assert.equal(
    mpgLegend({ MPG: { min: 18, max: 32 } }),
    "Bars compare each car with others rated the same way on this page: 18-32 MPG.",
  );

  // A mixed page must say so, or the short petrol bars read as a verdict on the
  // petrol cars rather than as a different scale.
  assert.equal(
    mpgLegend({ MPG: { min: 19, max: 51 }, MPGe: { min: 116, max: 136 } }),
    "Bars compare each car with others rated the same way on this page: 19-51 MPG, 116-136 MPGe.",
  );

  // Zero span: one car, or several sharing a figure. No range left to state.
  assert.equal(
    mpgLegend({ MPGe: { min: 134, max: 134 } }),
    "Bars compare each car with others rated the same way on this page: 134 MPGe.",
  );
});

test("bodyProfile reads a family and a size out of the EPA class, or nothing", () => {
  const cases: [string, ReturnType<typeof bodyProfile>][] = [
    ["Small Pickup Trucks 4WD", { family: "pickup", size: "small" }],
    ["Standard Pickup Trucks 2WD", { family: "pickup", size: "large" }],
    ["Minivan - 2WD", { family: "van", size: "medium" }],
    ["Vans, Passenger Type", { family: "van", size: "medium" }],
    ["Small Sport Utility Vehicle 4WD", { family: "suv", size: "small" }],
    ["Standard Sport Utility Vehicle 2WD", { family: "suv", size: "large" }],
    ["Midsize-Large Station Wagons", { family: "wagon", size: "large" }],
    ["Subcompact Cars", { family: "car", size: "small" }],
    ["Compact Cars", { family: "car", size: "medium" }],
    ["Large Cars", { family: "car", size: "large" }],
    ["Two Seaters", { family: "car", size: "small" }],
    // A class that names no body shape gets no side view at all.
    ["Special Purpose Vehicle 2WD", null],
    ["", null],
  ];
  for (const [vclass, expected] of cases) {
    assert.deepEqual(bodyProfile(vclass), expected, vclass);
  }
});
