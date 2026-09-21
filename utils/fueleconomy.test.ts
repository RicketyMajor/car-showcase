import { test } from "node:test";
import assert from "node:assert/strict";

import {
  toArray,
  toCarProps,
  toDriveCode,
  toNumber,
  toTransmissionCode,
} from "./fueleconomy.ts";

test("toArray normalises the menuItem object/array/null shapes", () => {
  // The API returns a bare object when a menu has exactly one entry.
  assert.deepEqual(toArray({ text: "Camry", value: "44343" }), [
    { text: "Camry", value: "44343" },
  ]);
  // ...an array when it has several...
  assert.equal(toArray([{ text: "a", value: "1" }, { text: "b", value: "2" }]).length, 2);
  // ...and null when the model name does not exist at all.
  assert.deepEqual(toArray(null), []);
  assert.deepEqual(toArray(undefined), []);
});

test("toTransmissionCode maps the vehicle detail trany field", () => {
  assert.equal(toTransmissionCode("Manual 6-spd"), "m");
  assert.equal(toTransmissionCode("Automatic (S8)"), "a");
  assert.equal(toTransmissionCode("Automatic (variable gear ratios)"), "a");
  assert.equal(toTransmissionCode(""), "a");
});

test("toDriveCode shortens the spelled-out drivetrain", () => {
  assert.equal(toDriveCode("Front-Wheel Drive"), "fwd");
  assert.equal(toDriveCode("Rear-Wheel Drive"), "rwd");
  assert.equal(toDriveCode("All-Wheel Drive"), "awd");
  assert.equal(toDriveCode("4-Wheel Drive"), "4wd");
  assert.equal(toDriveCode("Part-time 4-Wheel Drive"), "4wd");
  assert.equal(toDriveCode("something new"), "n/a");
});

test("toNumber parses the string-typed numerics and never returns NaN", () => {
  assert.equal(toNumber("29"), 29);
  assert.equal(toNumber("2.0"), 2);
  assert.equal(toNumber(undefined), 0);
  // The old RapidAPI source returned prose here and printed NaN on screen.
  assert.equal(toNumber("this field is for premium subscribers only"), 0);
});

test("toCarProps maps a real vehicle payload into the app shape", () => {
  const car = toCarProps({
    make: "Toyota",
    model: "Corolla",
    year: "2022",
    VClass: "Compact Cars",
    fuelType1: "Regular Gasoline",
    trany: "Manual 6-spd",
    drive: "Front-Wheel Drive",
    cylinders: "4",
    displ: "2.0",
    city08: "29",
    highway08: "37",
    comb08: "32",
  });

  assert.equal(car.make, "Toyota");
  assert.equal(car.model, "Corolla");
  assert.equal(car.year, 2022);
  assert.equal(car.class, "Compact Cars");
  assert.equal(car.fuel_type, "Regular Gasoline");
  assert.equal(car.transmission, "m");
  assert.equal(car.drive, "fwd");
  assert.equal(car.cylinders, 4);
  assert.equal(car.displacement, 2);
  assert.equal(car.city_mpg, 29);
  assert.equal(car.highway_mpg, 37);
  assert.equal(car.combination_mpg, 32);
});
