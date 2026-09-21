// Canary, deliberately excluded from `npm run test` discovery: it hits the real
// API over the network. Run it with `npm run test:live` when the catalogue looks
// wrong, to tell a degraded upstream apart from a bug in this code.

import { test } from "node:test";
import assert from "node:assert/strict";

import { toArray, toCarProps } from "./fueleconomy.ts";

const API_BASE = "https://www.fueleconomy.gov/ws/rest";

const get = async (path: string) => {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: "application/json" },
  });
  assert.equal(response.status, 200, `expected 200 from ${path}`);
  return response.json();
};

test("the live chain yields a real car with numeric mpg", async () => {
  const menu = await get("/vehicle/menu/model?year=2022&make=Toyota");
  const models = toArray(menu?.menuItem);
  assert.ok(models.length > 10, `expected >10 Toyota models, got ${models.length}`);

  const options = await get(
    `/vehicle/menu/options?year=2022&make=Toyota&model=${encodeURIComponent(models[0].value)}`,
  );
  const first = toArray(options?.menuItem)[0];
  assert.ok(first, "expected at least one option");

  const car = toCarProps(await get(`/vehicle/${first.value}`));

  assert.equal(typeof car.city_mpg, "number");
  assert.ok(car.city_mpg > 0, `city_mpg should be a real number, got ${car.city_mpg}`);
  assert.ok(car.make.length > 0);
  assert.ok(["a", "m"].includes(car.transmission));
  console.log("  mapped:", JSON.stringify(car));
});
