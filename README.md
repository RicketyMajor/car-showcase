# Milemark

A car catalogue built to practise TypeScript with the Next.js App Router. Search by manufacturer and
model, filter by fuel and year, page through the results, and open any car for its full
specification. Each card carries the car's city fuel economy against the best and worst figures
currently on screen, so the grid can be compared at a glance.

**Live:** <https://car-showcase-eight-lemon.vercel.app/>

## Stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Headless UI

## Data

Car data comes from the [FuelEconomy.gov](https://www.fueleconomy.gov/feg/ws/) REST API, published by
the US Department of Energy — free and keyless. Car photography is rendered by
[imagin.studio](https://imagin.studio/).

No environment variables are required to run the project. One is optional:

| Variable | Effect if unset |
|---|---|
| `NEXT_PUBLIC_IMAGIN_CUSTOMER_ID` | Falls back to a public demo id that serves the same placeholder image for every vehicle. |

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

## Author

Alonso Vera (Rickety Major)
