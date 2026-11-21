/**
 * imp-95493: viz data for the imp-95447 r_star(x) two-end asymptotic accuracy
 * -- the small-x Lambert-W form (imp-95377) and the x->1 edge series
 * (imp-95447 THEOREM RSTAR-EDGE), each measured against the exact RSTAR-EQ
 * root, with the mid-band gap where NEITHER form is within 1% relative error.
 * DERIVATION / MEASUREMENT ONLY -- this changes no bound of the Lambda
 * program and asserts no QED; distinct from the imp-95390/imp-95410 r_star
 * wedge M(x,r) heatmaps (this page plots asymptotic-form accuracy, not the
 * wedge margin map).
 *
 * SOURCE. imp-95377 gives the small-x leading form
 *   r_star(x) ~ 1 - (2/x) W_{-1}(-sqrt(x/2)),   valid only for x <= 2/e^2 ~ 0.2707
 * (the Lambert branch domain ceiling). imp-95447 gives the x -> 1 edge series
 *   r_star(x) = 1 + (1/x)[3d - (9/4)d^2 + (81/40)d^3 - ...],  d = (1-x)/x,
 * truncated here at the 3-term order used in imp-95447's measured table. Both
 * are checked against the exact root of the imp-95377 THEOREM RSTAR-EQ
 * (e^((r-1)x) = 1 + (x/2)(r^2-1)) by bisection.
 *
 * MEASURED CROSSOVER (this module, at the 1% relative-error threshold):
 * the Lambert form crosses above 1% error at x = 0.074152; the edge3 form
 * crosses below 1% error at x = 0.757929. So NEITHER closed form is within
 * 1% on x in (0.074, 0.758) -- the mid-band gap, wider than the informal
 * ~[0.3, 0.6] window imp-95447 named but consistent with it (that window sits
 * well inside the measured gap). Below x=0.074 Lambert dominates; above
 * x=0.758 the edge series dominates.
 *
 * VERDICT. DERIVATION / MEASUREMENT ONLY. Renders the imp-95447 complementary-
 * ends structure as an accuracy-vs-x chart instead of a six-point table.
 * Changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: no imports)
// ---------------------------------------------------------------------------

// THEOREM RSTAR-EQ (imp-95377): exact root r > 1 of e^((r-1)x) = 1 + (x/2)(r^2 - 1)
function rStarClosed(x) {
  const F = (r) => Math.exp((r - 1) * x) - (1 + (x / 2) * (r * r - 1));
  let lo = 1 + 1e-12;
  let hi = 2;
  while (F(hi) < 0 && hi < 1e9) hi *= 2;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (F(mid) < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// THEOREM RSTAR-EDGE (imp-95447): 3-term x -> 1 leading asymptotic
const EDGE_COEFFS = [3, -9 / 4, 81 / 40, -621 / 320];
function rStarEdge3(x) {
  const d = (1 - x) / x;
  let y = 0;
  let dp = 1;
  for (let k = 0; k < 3; k++) {
    dp *= d;
    y += EDGE_COEFFS[k] * dp;
  }
  return 1 + y / x;
}

// lower branch of Lambert W, argument in (-1/e, 0)
function lambertWm1(z) {
  let w = -2;
  for (let i = 0; i < 200; i++) {
    const ew = Math.exp(w);
    const f = w * ew - z;
    const fp = ew * (1 + w);
    w -= f / fp;
  }
  return w;
}
const LAMBERT_DOMAIN_MAX = 2 / Math.exp(2); // ~0.27067
function rStarLambert(x) {
  return 1 - (2 / x) * lambertWm1(-Math.sqrt(x / 2));
}

function relErr(approx, exact) {
  return Math.abs(approx - exact) / exact;
}

// ---------------------------------------------------------------------------
// Dense grid over (0, 1) for the accuracy-vs-x chart
// ---------------------------------------------------------------------------

const N = 150;
const X_MIN = 0.02;
const X_MAX = 0.995;
const X_GRID = Array.from({ length: N }, (_, i) => X_MIN + (i * (X_MAX - X_MIN)) / (N - 1));

export const IMP95493_CURVE = X_GRID.map((x) => {
  const rs = rStarClosed(x);
  const inLambertDomain = x <= LAMBERT_DOMAIN_MAX;
  const lambertErr = inLambertDomain ? relErr(rStarLambert(x), rs) : null;
  const edgeErr = relErr(rStarEdge3(x), rs);
  return { x, rStar: rs, lambertErr, edgeErr };
});

// 1%-relative-error crossover points (bisection on the monotone tails)
function bisectIncreasing(f, lo, hi, target) {
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
function bisectDecreasing(f, lo, hi, target) {
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) > target) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
const THRESHOLD = 0.01;
export const IMP95493_LAMBERT_CROSSOVER_X = bisectIncreasing(
  (x) => relErr(rStarLambert(x), rStarClosed(x)),
  0.05,
  0.1,
  THRESHOLD,
);
export const IMP95493_EDGE_CROSSOVER_X = bisectDecreasing(
  (x) => relErr(rStarEdge3(x), rStarClosed(x)),
  0.7,
  0.8,
  THRESHOLD,
);

export const IMP95493_SUMMARY = {
  id: "imp-95493",
  title:
    "Two-end asymptotic accuracy for the imp-95271 bump-wedge boundary " +
    "r_star(x): small-x Lambert-W form (imp-95377) vs x->1 edge series " +
    "(imp-95447), mid-band gap between them",
  lambertDomainMax: LAMBERT_DOMAIN_MAX,
  errorThreshold: THRESHOLD,
  lambertCrossoverX: IMP95493_LAMBERT_CROSSOVER_X,
  edgeCrossoverX: IMP95493_EDGE_CROSSOVER_X,
  gapDescription:
    "neither closed form is within 1% relative error on x in " +
    `(${IMP95493_LAMBERT_CROSSOVER_X.toFixed(4)}, ${IMP95493_EDGE_CROSSOVER_X.toFixed(4)}); ` +
    "the imp-95447 informal mid-band ~[0.3, 0.6] sits inside this measured gap",
  verdict:
    "DERIVATION / MEASUREMENT ONLY. Renders the imp-95447 complementary-ends " +
    "structure as an accuracy-vs-x chart. Changes no bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

export const IMP95493_ASSERTIONS = [
  {
    id: "imp95493-curve-has-lambert-and-edge-segments",
    description:
      "the grid carries a non-empty Lambert-domain prefix (x <= 2/e^2) and " +
      "every point carries a finite edge3 relative error",
    holds: () => {
      const lambertPts = IMP95493_CURVE.filter((p) => p.lambertErr !== null);
      const edgePts = IMP95493_CURVE.filter((p) => Number.isFinite(p.edgeErr));
      return lambertPts.length > 5 && edgePts.length === IMP95493_CURVE.length;
    },
  },
  {
    id: "imp95493-lambert-accurate-at-small-x",
    description: "Lambert relative error is well under 1% at x = 0.05 (measured ~0.51%)",
    holds: () => {
      const p = IMP95493_CURVE.reduce((best, cur) =>
        Math.abs(cur.x - 0.05) < Math.abs(best.x - 0.05) ? cur : best,
      );
      return p.lambertErr !== null && p.lambertErr < 0.01;
    },
  },
  {
    id: "imp95493-edge-accurate-near-one",
    description: "edge3 relative error is well under 1% at x = 0.9 (measured ~0.02%)",
    holds: () => {
      const p = IMP95493_CURVE.reduce((best, cur) =>
        Math.abs(cur.x - 0.9) < Math.abs(best.x - 0.9) ? cur : best,
      );
      return p.edgeErr < 0.01;
    },
  },
  {
    id: "imp95493-crossovers-bracket-a-nonempty-gap",
    description:
      "the Lambert 1%-crossover sits strictly below the edge3 1%-crossover, " +
      "leaving a non-trivial mid-band gap, and both lie in (0, 1)",
    holds: () =>
      IMP95493_LAMBERT_CROSSOVER_X > 0 &&
      IMP95493_EDGE_CROSSOVER_X < 1 &&
      IMP95493_LAMBERT_CROSSOVER_X < IMP95493_EDGE_CROSSOVER_X,
  },
  {
    id: "imp95493-gap-contains-informal-midband",
    description:
      "the measured 1%-gap (lambertCrossover, edgeCrossover) contains the " +
      "imp-95447 informal mid-band window [0.3, 0.6]",
    holds: () => IMP95493_LAMBERT_CROSSOVER_X < 0.3 && IMP95493_EDGE_CROSSOVER_X > 0.6,
  },
  {
    id: "imp95493-record-honesty",
    description:
      "the summary is derivation/measurement-only, names the gap, carries NO QED and the no-refereed-bound-change line",
    holds: () =>
      /gap/.test(IMP95493_SUMMARY.gapDescription) &&
      /NO QED/.test(IMP95493_SUMMARY.verdict) &&
      /refereed bound is changed/i.test(IMP95493_SUMMARY.verdict) &&
      /MEASUREMENT ONLY/.test(IMP95493_SUMMARY.verdict),
  },
];

for (const a of IMP95493_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95493-rstar-two-end-accuracy assertion failed: ${a.id}`);
  }
}
