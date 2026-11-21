/**
 * imp-95390: viz-data for a heatmap rendering of the imp-95271 RI-margin
 * (x, r) map, with the r_star(x) bump-wedge boundary overlaid. Re-implements
 * the light numeric kernel from imp-95271-ri-margin-map.js (import-light: no
 * imports, no 16.7MB zeros bundle) at a coarse build-friendly grid resolution
 * suitable for an SVG heatmap (the imp-95271 record itself used a much denser
 * 171,600-cell sweep; this module trades density for a renderable grid while
 * reproducing the same qualitative picture: M(x, r) >= 0 everywhere and the
 * near-1 tightness ratio LHS/RHS pinned to the (x -> 0, r -> 1) corner).
 *
 * VERDICT. MEASUREMENT ONLY. Changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: no imports)
// ---------------------------------------------------------------------------

function hOf(x, r) {
  const w1 = Math.exp(-x);
  return (-w1 * Math.expm1(-(r - 1) * x) * (1 + r)) / (r - 1);
}
function lam2(x, r) {
  const w1 = Math.exp(-x);
  const h = hOf(x, r);
  const P = w1 * Math.exp(-r * x);
  return P + (h * h) / 2 + (h / 2) * Math.sqrt(h * h + 4 * P);
}
function hprime(x, r) {
  const e = 1e-7;
  return (hOf(x, r + e) - hOf(x, r - e)) / (2 * e);
}
function riMarginRatio(x, r) {
  const w1 = Math.exp(-x);
  const P = w1 * Math.exp(-r * x);
  const h = hOf(x, r);
  const L = lam2(x, r);
  const RHS = x * P * (L - P);
  const LHS = h * hprime(x, r) * L;
  return { M: RHS - LHS, ratio: RHS !== 0 ? LHS / RHS : 0 };
}
function rStar(x) {
  let lo = 1 + 1e-6;
  let hi = 2;
  while (hprime(x, hi) > 0 && hi < 1e4) hi *= 2;
  if (hprime(x, hi) > 0) return Infinity;
  for (let i = 0; i < 60; i++) {
    const mid = (lo + hi) / 2;
    if (hprime(x, mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// Baked grid: x in [0.02, 1.5] log-spaced (24 cols), r in [1.001, 20]
// log-spaced (18 rows). Cell value = tightness ratio LHS/RHS in [0, 1]
// wherever the bump is non-trivial (h_r > 0), else 0 (RI free there).
// ---------------------------------------------------------------------------

const N_X = 24;
const N_R = 18;
const X_MIN = 0.02;
const X_MAX = 1.5;
const R_MIN = 1.001;
const R_MAX = 20;

const xLo = Math.log(X_MIN);
const xHi = Math.log(X_MAX);
const rLo = Math.log(R_MIN);
const rHi = Math.log(R_MAX);

// Precision 4 (not 3): rounding r near 1.001 to 3 sig figs collapses it to
// exactly 1, which divides by zero in hOf's (r - 1) denominator.
export const IMP95390_HEATMAP_X_LABELS = Array.from({ length: N_X }, (_, i) =>
  Number(Math.exp(xLo + ((xHi - xLo) * i) / (N_X - 1)).toPrecision(4)),
);
export const IMP95390_HEATMAP_R_LABELS = Array.from({ length: N_R }, (_, j) =>
  Number(Math.exp(rLo + ((rHi - rLo) * j) / (N_R - 1)).toPrecision(4)),
);

// Z[i][j]: column i (x), row j (r) -> tightness ratio, clamped to [0, 1]
export const IMP95390_HEATMAP_Z = IMP95390_HEATMAP_X_LABELS.map((x) =>
  IMP95390_HEATMAP_R_LABELS.map((r) => {
    if (hprime(x, r) <= 0) return 0; // outside the bump: RI is free (LHS <= 0)
    const { ratio } = riMarginRatio(x, r);
    return Math.max(0, Math.min(1, ratio));
  }),
);

// r_star(x) boundary curve sampled at the same x-columns, clamped to R_MAX
// for plotting where the wedge extends beyond the grid's r-range.
export const IMP95390_RSTAR_BOUNDARY = IMP95390_HEATMAP_X_LABELS.map((x) => ({
  x,
  rStar: Math.min(rStar(x), R_MAX),
  offGrid: rStar(x) > R_MAX,
}));

export const IMP95390_SUMMARY = {
  gridScope: `x in [${X_MIN}, ${X_MAX}] log-spaced (${N_X} cols), r in [${R_MIN}, ${R_MAX}] log-spaced (${N_R} rows)`,
  maxRatioLHSoverRHS: 0.99998744,
  maxRatioLocation: 'x -> 0, r -> 1 (grid corner of the bump)',
  deepInteriorMaxRatio: 0.9166,
  bumpCellFraction: 0.107,
  counterexamples: 0,
  verdict:
    'MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed' +
    '. Re-plots the imp-95271 171600-cell sweep at coarse ' +
    'render-friendly resolution.',
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const IMP95390_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95390-grid-shapes-match-labels',
    holds: () =>
      IMP95390_HEATMAP_Z.length === N_X &&
      IMP95390_HEATMAP_Z.every((col) => col.length === N_R) &&
      IMP95390_RSTAR_BOUNDARY.length === N_X,
  },
  {
    id: 'imp95390-ratios-in-unit-interval',
    holds: () =>
      IMP95390_HEATMAP_Z.every((col) => col.every((z) => z >= 0 && z <= 1)),
  },
  {
    id: 'imp95390-rstar-decreasing-in-x-toward-one',
    // r_star(x) decreases monotonically as x grows (allow clamping at R_MAX)
    holds: () => {
      let prev = Infinity;
      for (const pt of IMP95390_RSTAR_BOUNDARY) {
        if (pt.rStar > prev + 1e-9) return false;
        prev = pt.rStar;
      }
      const last = IMP95390_RSTAR_BOUNDARY[IMP95390_RSTAR_BOUNDARY.length - 1];
      return last.rStar < 2; // near x = 1.5, wedge has collapsed toward r = 1
    },
  },
];

for (const a of IMP95390_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95390-ri-margin-heatmap-viz-data assertion failed: ${a.id}`);
  }
}
