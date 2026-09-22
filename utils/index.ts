import { DEFAULT_MANUFACTURER, DEFAULT_YEAR } from "@/constants";
import type { CarProps, FilterProps } from "@/types";

import {
  type Fetched,
  type FuelEconomyMenu,
  type FuelEconomyVehicle,
  getJson,
  toArray,
  toCarProps,
} from "./fueleconomy";

// Keeps the request's health separate from its result, because one model that
// does not exist and one model whose request failed look identical once both
// have become "no card". `ok: true, data: null` is the former, `ok: false` the
// latter, and fetchCars needs to be able to tell them apart in bulk.
async function fetchVehicleForModel(
  year: number,
  manufacturer: string,
  model: string,
): Promise<Fetched<CarProps>> {
  const options = await getJson<FuelEconomyMenu>(
    `/vehicle/menu/options?year=${year}&make=${encodeURIComponent(manufacturer)}&model=${encodeURIComponent(model)}`,
  );
  if (!options.ok) return { ok: false };

  const firstOption = toArray(options.data?.menuItem)[0];
  if (!firstOption) return { ok: true, data: null };

  const vehicle = await getJson<FuelEconomyVehicle>(`/vehicle/${firstOption.value}`);
  if (!vehicle.ok) return { ok: false };
  return { ok: true, data: vehicle.data ? toCarProps(vehicle.data) : null };
}

// Returns null - not [] - when the upstream itself did not answer, so the page
// can say "the data source is down" instead of blaming the visitor's filters.
export async function fetchCars(filters: FilterProps): Promise<CarProps[] | null> {
  const { manufacturer, year, model, limit, fuel } = filters;

  const make = manufacturer || DEFAULT_MANUFACTURER;
  const modelYear = year || DEFAULT_YEAR;

  const menu = await getJson<FuelEconomyMenu>(
    `/vehicle/menu/model?year=${modelYear}&make=${encodeURIComponent(make)}`,
  );
  if (!menu.ok) return null;

  let modelNames = toArray(menu.data?.menuItem).map((item) => item.value);
  if (model) {
    const needle = model.toLowerCase();
    modelNames = modelNames.filter((name) => name.toLowerCase().includes(needle));
  }

  // Fuel is only known once a vehicle's details are fetched, so a fuel filter
  // has to scan the make's entire model list. A fixed window is not good enough:
  // Ford 2022 has 11 electric models scattered as far as position 52, so a
  // 30-model window silently hid 8 of them. A full scan is ~110 requests and
  // ~3.5s cold, then free for 24h from the cache above. If that ever hurts,
  // cap the concurrency rather than shrinking the scan.
  const candidates = fuel ? modelNames : modelNames.slice(0, limit);

  // One model's two calls are inherently sequential (the options menu is what
  // yields the vehicle id), but the models themselves fan out in parallel.
  const results = await Promise.all(
    candidates.map((name) => fetchVehicleForModel(modelYear, make, name)),
  );

  // The model menu is one hot URL under `revalidate: 86400` while the per-model
  // lookups are ~110 colder ones, so the menu can still be served from cache
  // long after the API has started failing. Without this, that state renders as
  // "No cars matched your search" - the exact lie the two messages exist to
  // stop. Every attempt failing is a signal, not a threshold: nothing got
  // through at all.
  if (results.length > 0 && results.every((result) => !result.ok)) return null;

  let cars = results.flatMap((result) => (result.ok && result.data ? [result.data] : []));
  if (fuel) {
    const needle = fuel.toLowerCase();
    cars = cars.filter((car) => car.fuel_type.toLowerCase().includes(needle));
  }

  return cars.slice(0, limit);
}

export const calculateCarRent = (city_mpg: number, year: number) => {
  const basePricePerDay = 50; // Base rental price per day in dollars
  const mileageFactor = 0.1; // Additional rate per mile driven
  const ageFactor = 0.05; // Additional rate per year of vehicle age

  // Calculate additional rate based on mileage and age
  const mileageRate = city_mpg * mileageFactor;
  const ageRate = (new Date().getFullYear() - year) * ageFactor;

  // Calculate total rental rate per day
  const rentalRatePerDay = basePricePerDay + mileageRate + ageRate;

  return rentalRatePerDay.toFixed(0);
};
