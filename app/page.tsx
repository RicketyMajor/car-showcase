import { Suspense, ViewTransition } from "react";

import {
  Announce,
  CarCard,
  CatalogueStatus,
  CatalogueView,
  CatalogueViewSwitch,
  CustomFilter,
  Hero,
  SearchBar,
  ShowMore,
} from "@/components";
import { DEFAULT_YEAR, PAGE_SIZE, SEARCH_PARAM, fuels, yearsOfProduction } from "@/constants";
import type { FilterProps } from "@/types";
import { fetchCars } from "@/utils";
import { bodyProfile, hasMore, mpgLegend, mpgRangesByUnit, mpgUnit } from "@/utils/catalogue";

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

// `limit` comes off the URL, so it is whatever a visitor typed. Unbounded, a
// negative one survived the `|| PAGE_SIZE` guard and reached `slice(0, -5)` in
// fetchCars, dropping cars off the *end* of the list while `hasMore`
// (`shown >= -5`) stayed true forever; a huge one turned a ten-model page into a
// fetch of the make's whole catalogue. 100 is ten pages, past anything the Show
// More button can reach in practice.
function readLimit(params: Record<string, string | string[] | undefined>): number {
  const parsed = Number.parseInt(readParam(params, SEARCH_PARAM.limit), 10);
  return Number.isFinite(parsed) ? Math.min(Math.max(parsed, 1), 100) : PAGE_SIZE;
}

// A fuel filter scans a make's whole model list, so a query can cost seconds.
// Held outside a boundary, that time was spent with the page frozen on the old
// results: nothing said the click had registered, and the URL only changed when
// the answer arrived - so a second filter clicked during the wait was built
// from the pre-click URL and silently dropped the first one.
function CatalogueSkeleton({ count }: { count: number }) {
  return (
    <section>
      {/* Visible text only: the announcement comes from CatalogueStatus. */}
      <div className="home__legend-row">
        <p className="home__legend">Loading cars&hellip;</p>
      </div>
      <Announce message="Loading cars…" />

      <div className="home__cars-wrapper" aria-hidden="true">
        {Array.from({ length: count }, (_, index) => (
          <div key={index} className="car-card__skeleton" />
        ))}
      </div>
    </section>
  );
}

async function Catalogue({ filters }: { filters: FilterProps }) {
  const result = await fetchCars(filters);

  // An empty page has two very different causes, and telling a visitor their
  // filters were wrong when the data source is down is the one lie the app
  // still told.
  const isUpstreamDown = result === null;
  const allCars = result ?? [];

  // Every card's efficiency bar is drawn against the set the visitor can
  // actually see, so the comparison changes honestly as the filters change -
  // but only against the cars measured the same way. MPG and MPGe share the
  // `city08` field and are not the same quantity, so they get a scale each.
  const mpgRanges = mpgRangesByUnit(allCars);

  // A live region stays silent when its text does not change, and "10 cars
  // shown." is what most searches return - so a back/forward served from the
  // router cache, never drawing the skeleton in between, announced nothing.
  // Naming the search makes two different ones read differently.
  const searched = [filters.manufacturer, filters.model, filters.fuel, filters.year]
    .filter(Boolean)
    .join(" ");

  if (allCars.length === 0) {
    return isUpstreamDown ? (
      <div className="home__error-container">
        <Announce message="Car data is unavailable right now." />
        <h3 className="type-display text-[26px]">Car data is unavailable right now</h3>
        <p>
          fueleconomy.gov did not answer, so no cars could be loaded. Your filters are
          fine &mdash; please try again in a few minutes.
        </p>
      </div>
    ) : (
      <div className="home__error-container">
        <Announce message={`No cars matched ${searched}.`} />
        <h3 className="type-display text-[26px]">No cars matched your search</h3>
        <p>No cars matched those filters. Try a different manufacturer or year.</p>
      </div>
    );
  }

  return (
    <section>
      {/* Keyed by the limit so Show More always hands the region back its
          result, even a page that came back no longer than the last one. */}
      <Announce
        key={filters.limit}
        message={`${allCars.length} ${allCars.length === 1 ? "car" : "cars"} shown for ${searched}.`}
      />
      {/* Only where some car on the page names a body: a switch that turns
          nothing is worse than none. */}
      <div className="home__legend-row">
        <p className="home__legend">{mpgLegend(mpgRanges)}</p>
        {allCars.some((car) => bodyProfile(car.class)) && <CatalogueViewSwitch />}
      </div>

      <div className="home__cars-wrapper">
        {allCars.map((car) => (
          <CarCard
            key={`${car.make}-${car.model}-${car.year}`}
            car={car}
            mpgRange={mpgRanges[mpgUnit(car.fuel_type)]}
          />
        ))}
      </div>

      <ShowMore limit={filters.limit} hasMore={hasMore(allCars.length, filters.limit)} />
    </section>
  );
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  const filters: FilterProps = {
    manufacturer: readParam(params, SEARCH_PARAM.manufacturer),
    year: Number.parseInt(readParam(params, SEARCH_PARAM.year), 10) || DEFAULT_YEAR,
    fuel: readParam(params, SEARCH_PARAM.fuel),
    limit: readLimit(params),
    model: readParam(params, SEARCH_PARAM.model),
  };

  // The key deliberately leaves `limit` out: "Show more" adds to the grid the
  // visitor is reading, so it keeps the cards on screen behind ShowMore's own
  // pending state. Every other change is a different question, and gets the
  // skeleton.
  const query = [filters.manufacturer, filters.model, filters.fuel, filters.year].join("|");

  // overflow-clip, not hidden: a scroll container here would capture the cards'
  // view() timelines (see .car-card__stage).
  return (
    <main id="main" className="overflow-clip bg-chalk">
      <Hero />

      <div className="pt-24 pb-28 padding-x max-width" id="discover">
        <div className="home__text-container">
          <h2 className="type-display text-[40px] sm:text-[52px]">Car Catalogue</h2>
          <p className="text-grey text-[17px]">Browse the full range and narrow it down with the filters.</p>
        </div>

        <div className="home__filters">
          <SearchBar />

          <div className="home__filter-container">
            <CustomFilter title="fuel" options={fuels} />
            <CustomFilter title="year" options={yearsOfProduction} />
          </div>
        </div>

        <CatalogueView>
          <CatalogueStatus>
            {/* default="none" keeps both from animating on unrelated transitions,
                such as Show More, which keeps its cards on screen. */}
            <Suspense
              key={query}
              fallback={
                <ViewTransition exit="slide-down" default="none">
                  <CatalogueSkeleton count={filters.limit} />
                </ViewTransition>
              }
            >
              <ViewTransition enter="slide-up" default="none">
                <Catalogue filters={filters} />
              </ViewTransition>
            </Suspense>
          </CatalogueStatus>
        </CatalogueView>
      </div>
    </main>
  );
}
