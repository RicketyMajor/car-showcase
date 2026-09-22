import { test } from "node:test";
import assert from "node:assert/strict";

import { hasMore, mpgFillPercent } from "./catalogue.ts";

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
