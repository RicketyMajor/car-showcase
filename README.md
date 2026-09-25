# Milemark

A car catalogue built to practise TypeScript with the Next.js App Router. Search by manufacturer and
model, filter by fuel and year, page through the results, and open any car for its full
specification. Each card carries the car's city fuel economy against the best and worst figures
currently on screen, so the grid can be compared at a glance — against the cars measured the same
way, because fueleconomy.gov reports battery and hydrogen cars in MPGe and puts that figure in the
same field a petrol car's MPG arrives in.

**Live:** <https://car-showcase-eight-lemon.vercel.app/>

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Headless UI

## Data

Car data comes from the [FuelEconomy.gov](https://www.fueleconomy.gov/feg/ws/) REST API, published by
the US Department of Energy — free and keyless. It is the project's only external service, and no
environment variables are required to run any of this.

There is no car photography anywhere in Milemark. Every free source measured answers HTTP 200 with
one identical stock image for every vehicle, including cars that do not exist, so each card draws the
car instead: a plan view whose driven wheels, cylinder count and battery or fuel-cell floor all come
from that car's own record.

The landing page follows the same rule. It used to open on a stock photograph of a Toyota Fortuner
over a decorative PNG — 1.48MB served, on a site whose catalogue refuses stock photography on
principle — and now opens on the same plan view at full size, captioned as the key to the drawings
below. The two images came to 1,480,899 bytes; the drawing that replaced them is 1,535 bytes of
inline SVG and two fewer requests.

## Running locally

```bash
npm install
npm run dev     # http://localhost:3000
```

## Other commands

```bash
npm run build       # production build, and the real gate before deploying
npm run test        # node's built-in test runner, offline
npm run test:live   # network canary: is the upstream API still healthy?
npm run lint
```

`npm run test:live` exists because this project was twice derailed by an upstream API degrading
without ever returning an error. Run it first whenever the catalogue looks wrong — it separates
"the API changed again" from "I broke something".

## Changelog

### Week of 21 September 2026

**New**

- Real data: the catalogue now comes from fueleconomy.gov, keyless, and reaches model year 2027. It
  opens on 2026.
- Fuel and year filters, a model search, and Show More to page through the results.
- Every car is drawn from its own record, with no stock photos. The plan view marks the driven wheels,
  one stroke per cylinder, and the battery or fuel cell. The detail dialog adds a side view whenever
  the car's EPA class names a body shape.
- A new look: each car sits on its own graphite stage, and each drawing traces itself as its card
  scrolls into view.
- Each card compares its city fuel economy with the other cars on screen. It compares MPG with MPG and
  MPGe with MPGe, because the two don't share a scale.

**Improved**

- Filters answer at once. The grid shows a placeholder while the cars load, and a second filter
  clicked during the wait no longer cancels the first.
- Accessibility: visible focus rings, a skip link, and a screen reader hears when cars are loading and
  what arrived, including after Show More.
- The landing page went from 1.48MB of images to 1.5KB of inline drawing.

**Fixed**

- Filters that rendered but never filtered, because the page read its search parameters too early.
- A data-source outage used to read as "no cars matched your search". It now says the data is
  unavailable.
- The search box keeps what the visitor typed, including its casing, through back and forward.
- A 404 page keeps its navigation bar.

## Author

Alonso Vera (Rickety Major)
