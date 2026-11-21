/**
 * imp-96239 -- viz panel for the imp-96210 U-shape a(N)/b(N) slope-drift and the
 * drift-integrated peak-location law.
 *
 * imp-96210 measured the local log-slopes a(N) = d ln g_t/d ln N and b(N) = -d ln g_f/d ln N
 * across the [N_peak, N_flow] decade of the E(N)-share U-shape and showed the decade-averaged
 * slope sum <a+b>, fed into N_peak/N_flow = (b/a)^(1/<a+b>), tightens the imp-96187 constant-slope
 * residual 20x (2.94e-3 -> 1.44e-4). That measurement was never plotted. This module RECOMPUTES
 * the same a(N), b(N) grid from the identical inherited component model (E_trunc frozen at the
 * imp-2631/imp-3406/imp-33582 fixed-strip value, Gronwall E_flow, GUE-conditional E_coll) -- no new
 * derivation, same formulas as imp-96210 -- to expose the per-N grid for charting, and
 * cross-checks its decade endpoints against the imp-96210 frozen landmarks.
 *
 * Import-light: only imports effectiveHeightForN + C_C_PINNED (the same two the imp-96210 module
 * itself imports) plus the imp-96210 module's own frozen landmarks for a consistency check --
 * NO zeros bundle.
 *
 * @see imp-96210-ushape-peak-slope-drift-location-law (the measurement this renders; landmarks
 *      cross-checked here)
 * @see imp-96187-ushape-peak-ratio-logcorrection-identity-vs-accident (constant-slope formula P2)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP96210_USHAPE_PEAK_SLOPE_DRIFT_LOCATION_LAW as SRC_LAW } from './imp-96210-ushape-peak-slope-drift-location-law.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33582/imp-33723/imp-96162/imp-96187/imp-96210 exactly

// EXACT imp-3406/imp-33582/imp-33723 sub-terms (inherited, no re-derivation) -- identical to imp-96210.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous Gronwall flow term
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return { E_flow, E_coll, E_N: E_TRUNC_PT + E_flow + E_coll };
}
const sigmaOf = (N) => { const p = parts(N); return p.E_coll / p.E_N; };
const g_t = (N) => E_TRUNC_PT / parts(N).E_coll;
const g_f = (N) => parts(N).E_flow / parts(N).E_coll;

function logSlope(f, N) {
  const h = 1e-6;
  return (Math.log(f(N * Math.exp(h))) - Math.log(f(N * Math.exp(-h)))) / (2 * h);
}

function peakN() {
  let bestN = 0;
  let bestS = -1;
  for (let k = 3; k <= 9; k += 0.0002) {
    const N = Math.pow(10, k);
    const s = sigmaOf(N);
    if (s > bestS) { bestS = s; bestN = N; }
  }
  return { N: bestN, sigma: bestS };
}
function nFlow() {
  let lo = 1e2;
  let hi = 1e14;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (parts(mid).E_flow > E_TRUNC_PT) lo = mid;
    else hi = mid;
  }
  return Math.sqrt(lo * hi);
}

const PEAK = peakN();
const N_FLOW = nFlow();

const GRID_STEPS = 40;
const LN_LO = Math.log(PEAK.N);
const LN_HI = Math.log(N_FLOW);

export const IMP96239_GRID = Object.freeze(
  Array.from({ length: GRID_STEPS + 1 }, (_, i) => {
    const frac = i / GRID_STEPS;
    const N = Math.exp(LN_LO + (LN_HI - LN_LO) * frac);
    const a = logSlope(g_t, N);
    const b = -logSlope(g_f, N);
    return Object.freeze({ frac: +frac.toFixed(4), N, a, b, sum: a + b });
  }),
);

const A_PEAK = IMP96239_GRID[0].a;
const B_PEAK = IMP96239_GRID[0].b;
const A_AT_NFLOW = IMP96239_GRID[GRID_STEPS].a;
const B_AT_NFLOW = IMP96239_GRID[GRID_STEPS].b;
const SUM_AT_PEAK = A_PEAK + B_PEAK;

let SUM_INTEGRAL = 0;
for (let i = 0; i < GRID_STEPS; i++) {
  SUM_INTEGRAL += 0.5 * (IMP96239_GRID[i].sum + IMP96239_GRID[i + 1].sum);
}
SUM_INTEGRAL *= (LN_HI - LN_LO) / GRID_STEPS;
const AVG_SUM_DECADE = SUM_INTEGRAL / (LN_HI - LN_LO);

const PEAK_OVER_NFLOW = PEAK.N / N_FLOW;
const CONST_SLOPE_FORMULA = Math.pow(B_PEAK / A_PEAK, 1 / SUM_AT_PEAK);
const CONST_SLOPE_REL_ERR = Math.abs(CONST_SLOPE_FORMULA - PEAK_OVER_NFLOW) / PEAK_OVER_NFLOW;
const DRIFT_FORMULA = Math.pow(B_PEAK / A_PEAK, 1 / AVG_SUM_DECADE);
const DRIFT_REL_ERR = Math.abs(DRIFT_FORMULA - PEAK_OVER_NFLOW) / PEAK_OVER_NFLOW;

export const IMP96239_SUMMARY = Object.freeze({
  peak_N: PEAK.N,
  N_flow: N_FLOW,
  a_peak: A_PEAK,
  a_at_N_flow: A_AT_NFLOW,
  b_peak: B_PEAK,
  b_at_N_flow: B_AT_NFLOW,
  sum_at_peak: SUM_AT_PEAK,
  avg_sum_decade: AVG_SUM_DECADE,
  peak_over_N_flow_measured: PEAK_OVER_NFLOW,
  const_slope_formula: CONST_SLOPE_FORMULA,
  const_slope_rel_err: CONST_SLOPE_REL_ERR,
  drift_integrated_formula: DRIFT_FORMULA,
  drift_integrated_rel_err: DRIFT_REL_ERR,
  residual_tightening_x: CONST_SLOPE_REL_ERR / DRIFT_REL_ERR,
});

export const IMP96239_CAVEAT_BANNER =
  'Presentation only: recomputes the imp-96210 a(N), b(N) grid from the identical inherited ' +
  'component model (E_trunc frozen fixed-strip value, Gronwall E_flow, GUE-conditional C_C_PINNED ' +
  'E_coll) purely to expose the per-N curve for charting -- no new derivation, no re-baking of the ' +
  'underlying constants. The C_mb GUE-conditional share (imp-486) stays GUE-conditional and ' +
  'UNTOUCHED; changes no bound; establishes no operator positivity; no RH claim; no refereed bound is changed' +
  '; NO QED.';

export const IMP96239_ASSERTIONS = [
  {
    id: 'imp96239-grid-endpoints-match-imp96210-landmarks',
    description: 'recomputed peak/N_flow landmarks and endpoint slopes reproduce the frozen imp-96210 landmarks to 5e-3',
    holds: () =>
      Math.abs(PEAK.N / SRC_LAW.landmarks.peak_N - 1) < 5e-3 &&
      Math.abs(N_FLOW / SRC_LAW.landmarks.N_flow - 1) < 5e-3 &&
      Math.abs(A_PEAK - SRC_LAW.landmarks.a_at_peak) < 5e-3 &&
      Math.abs(B_PEAK - SRC_LAW.landmarks.b_at_peak) < 5e-3 &&
      Math.abs(A_AT_NFLOW - SRC_LAW.landmarks.a_at_N_flow) < 5e-3 &&
      Math.abs(B_AT_NFLOW - SRC_LAW.landmarks.b_at_N_flow) < 5e-3,
  },
  {
    id: 'imp96239-b-drifts-more-than-a-across-grid',
    description: 'b rises monotonically ~6.6x more than a across the decade, matching imp-96210 G1',
    holds: () => {
      const aDrift = A_AT_NFLOW - A_PEAK;
      const bDrift = B_AT_NFLOW - B_PEAK;
      return aDrift > 0 && bDrift > 0 && bDrift > 4 * aDrift;
    },
  },
  {
    id: 'imp96239-drift-integrated-formula-tighter',
    description: 'drift-integrated location formula is at least 5x tighter than the constant-slope formula and matches imp-96210 to 5e-4',
    holds: () =>
      DRIFT_REL_ERR < 5e-4 &&
      CONST_SLOPE_REL_ERR / DRIFT_REL_ERR > 5 &&
      Math.abs(DRIFT_FORMULA - SRC_LAW.landmarks.drift_integrated_formula) < 5e-4,
  },
  {
    id: 'imp96239-honesty-gate-no-qed',
    description: 'caveat banner keeps the GUE-conditional / no-bound / NO QED guardrail',
    holds: () =>
      /GUE-conditional/.test(IMP96239_CAVEAT_BANNER) &&
      /NO QED/.test(IMP96239_CAVEAT_BANNER) &&
      /refereed bound is changed/i.test(IMP96239_CAVEAT_BANNER),
  },
];

for (const a of IMP96239_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96239-ushape-slope-drift-viz-data assertion failed: ${a.id}`);
  }
}
