import { DEFAULT_MANUFACTURER, DEFAULT_YEAR } from "@/constants";
import type { CarProps, FilterProps } from "@/types";

import {
  type FuelEconomyMenu,
  type FuelEconomyVehicle,
  toArray,
  toCarProps,
} from "./fueleconomy";

const API_BASE = "https://www.fueleconomy.gov/ws/rest";

// A fuel filter can only be applied after a vehicle's details are fetched, so a
// filtered page needs a wider candidate window to fill up.
const FUEL_FILTER_OVERSAMPLE = 3;

async function getJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { Accept: "application/json" },
      // The dataset changes at most yearly; cache aggressively so a page of
      // cars costs the visitor nothing.
      next: { revalidate: 86400 },
    });
    if (!response.ok) return null;
    return (await response.json()) as T;
  } catch {
    return null;
  }
}

async function fetchVehicleForModel(
  year: number,
  manufacturer: string,
  model: string,
): Promise<CarProps | null> {
  const options = await getJson<FuelEconomyMenu>(
    `/vehicle/menu/options?year=${year}&make=${encodeURIComponent(manufacturer)}&model=${encodeURIComponent(model)}`,
  );
  // The response is null outright when the model name does not exist for that
  // make and year.
  const firstOption = toArray(options?.menuItem)[0];
  if (!firstOption) return null;

  const vehicle = await getJson<FuelEconomyVehicle>(`/vehicle/${firstOption.value}`);
  return vehicle ? toCarProps(vehicle) : null;
}

export async function fetchCars(filters: FilterProps): Promise<CarProps[]> {
  const { manufacturer, year, model, limit, fuel } = filters;

  const make = manufacturer || DEFAULT_MANUFACTURER;
  const modelYear = year || DEFAULT_YEAR;

  const menu = await getJson<FuelEconomyMenu>(
    `/vehicle/menu/model?year=${modelYear}&make=${encodeURIComponent(make)}`,
  );

  let modelNames = toArray(menu?.menuItem).map((item) => item.value);
  if (model) {
    const needle = model.toLowerCase();
    modelNames = modelNames.filter((name) => name.toLowerCase().includes(needle));
  }

  const candidateCount = fuel ? limit * FUEL_FILTER_OVERSAMPLE : limit;
  const candidates = modelNames.slice(0, candidateCount);

  // One model's two calls are inherently sequential (the options menu is what
  // yields the vehicle id), but the models themselves fan out in parallel.
  const results = await Promise.all(
    candidates.map((name) => fetchVehicleForModel(modelYear, make, name)),
  );

  let cars = results.filter((car): car is CarProps => car !== null);
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

export const generateCarImageUrl = (car: CarProps, angle?: string) => {
  const url = new URL("https://cdn.imagin.studio/getimage");

  const { make, year, model } = car;
  url.searchParams.append("customer", "hrjavascript-mastery");
  url.searchParams.append("make", make);
  url.searchParams.append("modelFamily", model.split(" ")[0]);
  url.searchParams.append("zoomType", "fullscreen");
  url.searchParams.append("modelYear", `${year}`);
  url.searchParams.append("angle", `${angle}`);

  return `${url}`;
};
