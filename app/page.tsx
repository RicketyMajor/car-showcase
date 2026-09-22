import { CarCard, CustomFilter, Hero, SearchBar, ShowMore } from "@/components";
import { DEFAULT_YEAR, PAGE_SIZE, SEARCH_PARAM, fuels, yearsOfProduction } from "@/constants";
import { fetchCars } from "@/utils";

// In the App Router, searchParams is a Promise and must be awaited before any
// property is read. Reading it synchronously yields undefined for every key,
// which is why every filter silently fell back to its default.
interface HomeProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

function readParam(
  params: Record<string, string | string[] | undefined>,
  key: string,
): string {
  const value = params[key];
  return Array.isArray(value) ? (value[0] ?? "") : (value ?? "");
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const limit = Number.parseInt(readParam(params, SEARCH_PARAM.limit), 10) || PAGE_SIZE;

  const allCars = await fetchCars({
    manufacturer: readParam(params, SEARCH_PARAM.manufacturer),
    year: Number.parseInt(readParam(params, SEARCH_PARAM.year), 10) || DEFAULT_YEAR,
    fuel: readParam(params, SEARCH_PARAM.fuel),
    limit,
    model: readParam(params, SEARCH_PARAM.model),
  });

  const isDataEmpty = allCars.length < 1;

  return (
      <main className="overflow-hidden">
        <Hero />

        <div className="mt-12 padding-x padding-y
        max-width" id="discover">
          <div className="home__text-container">
            <h1 className="text-4xl
            font-extrabold">Car Catalogue</h1>
            <p>Browse the full range and narrow it down with the filters.</p>
          </div>

          <div className="home__filters">
            <SearchBar />

            <div className="home__filter-container">
              <CustomFilter title="fuel" options={fuels} />
              <CustomFilter title="year" options={yearsOfProduction} />
            </div>
          </div>
          {!isDataEmpty ? (
            <section>
              <div className="home__cars-wrapper">
                {allCars.map((car) => (
                  <CarCard key={`${car.make}-${car.model}-${car.year}`} car={car} />
                ))}
              </div>

              <ShowMore limit={limit} hasMore={allCars.length >= limit} />
            </section>
          ): (
            <div className="home__error-container">
              <h2 className="text-black text-xl
              font-bold">No cars matched your search</h2>
              <p>No cars matched those filters. Try a different manufacturer or year.</p>
            </div>
          )}

        </div>
      </main>
  )
}
