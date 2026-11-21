/**
 * @module imp-35660-fartail-crossings-height-map-sensitivity-guard
 *
 * imp-35660 (accuracy, regression-guard): imp-35577 measured the far-tail-crossing
 * HEIGHT-MAP sensitivity of BOTH E_flow remnant threshold-crossings -- the two decade
 * shifts (sub-1e-3 +15.31, sub-1e-4 +46.84), the RvM-inverse vs surrogate crossing
 * log10 N (25.6205 -> 40.9350, 109.1892 -> 156.0294), the remnant inflation ratios
 * (2.13x, 1.87x) and the height divergence (+9.24 percent, +2.65 percent) -- but,
 * unlike the imp-35619 span-growth guard, no DEDICATED run-assertions guard pins them.
 * This import-light module INDEPENDENTLY recomputes those literals via the imp-35577
 * inlined-Newton channel (byte-faithful: the same |analytic - fd| remnant, the same
 * inlined pure-Math RvM inverse effectiveHeightForN, the same closed surrogate
 * T0 = 2 pi N / log N, the same h = 1.0002 central difference, no zeros bundle) and
 * asserts each shift / crossing / inflation / divergence to storage-precision tolerance
 * (~1e-6) per the recurring 7-sig-fig cache tolerance trap, cross-checking the imp-35577
 * baked crossings record reproduces. A silent drift of the height-map-swap channel is
 * then tripped in the npm-run assertion sweep.
 *
 * THE IDENTICAL SWAP CHANNEL (byte-faithful to imp-35577)
 * -------------------------------------------------------
 * fd = localExponent is the central log-log difference (multiplicative h = 1.0002 in N)
 * of the imp-35135 far-tail E_flow quantity eFlowWith(N) = C_F (log T0 / T0) GRONWALL,
 * C_F = (log(T0/2pi) + 1)/2pi, read on the height map T0(N); analytic = imp-35198
 * -1 + 3/log N. The remnant |analytic - fd| is recomputed with ONLY the height map
 * swapped from the closed surrogate to the inlined RvM inverse (Newton solve of
 * (T/2pi)(log(T/2pi) - 1) = N), then each threshold-crossing is bisected under both maps.
 *
 * THE PINNED LITERALS (independently recomputed, matched vs imp-35577 record)
 * -------------------------------------------------------------------------
 *   crossing   surrogate log10 N   RvM-inverse log10 N   shift    inflation   divergence
 *   sub-1e-3   25.6205             40.9350               +15.31   2.1311x     +9.238 percent
 *   sub-1e-4   109.1892            156.0294              +46.84   1.8740x     +2.654 percent
 *
 * REGRESSION-GUARD ONLY; recomputes established measurement figures; changes no bound;
 * far-tail E_coll exponent 1/2 per imp-3463; E_flow > 0 strictness (imp-33848) untouched;
 * C_mb GUE-conditional per imp-486 UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.
 *
 * @see imp-35577-fartail-crossings-height-map-sensitivity (the literals pinned here)
 * @see imp-35619-eflow-fartail-remnant-span-ladder-assertion (the sibling span-growth guard)
 * @see imp-35497-fartail-crossing-height-map-sensitivity (the sub-1e-3 swap, +15.31 decades)
 * @see imp-35198-eflow-fartail-exponent-logn-correction (the analytic -1 + 3/log N)
 * @see lambda-rh-height-mapping.js effectiveHeightForN (the exact RvM inverse, inlined here)
 */

import { IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY } from './imp-35577-fartail-crossings-height-map-sensitivity.js';

const TWO_PI = 2 * Math.PI;

// imp-35135/imp-35236 exact sub-term constants (byte-identical to imp-35577).
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// Height map A: the imp-35413/imp-35473 closed RvM surrogate T0 = 2 pi N / log N.
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// Height map B: the EXACT RvM inverse -- Newton solve of (T/2pi)(log(T/2pi) - 1) = N.
// Inlined pure-Math (no import), byte-identical to imp-35577.
function effectiveHeightForN(N) {
  if (!(N > 0) || !Number.isFinite(N)) return 0;
  let T = Math.max(TWO_PI * Math.E, (TWO_PI * N) / Math.max(1, Math.log(N + TWO_PI)));
  for (let i = 0; i < 60; i++) {
    const u = Math.log(T / TWO_PI);
    const f = (T / TWO_PI) * (u - 1) - N;
    const fp = u / TWO_PI;
    if (!(Math.abs(fp) > 0) || !Number.isFinite(fp)) break;
    const dT = f / fp;
    T -= dT;
    if (!(T > TWO_PI)) T = TWO_PI * 1.0001;
    if (Math.abs(dT) < 1e-12 * Math.max(1, T)) break;
  }
  return T;
}

// The imp-35413/imp-35473 remnant |analytic - fd|, parameterised by the height map.
function makeRemnant(heightForN) {
  function eFlowWith(N) {
    const T0 = heightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
    return C_F * (L / T0) * GRONWALL;
  }
  function localExponent(N) {
    const h = 1.0002;
    const lo = Math.log(eFlowWith(N / h));
    const hi = Math.log(eFlowWith(N * h));
    return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
  }
  const analyticSurrogateExponent = (x) => -1 + 3 / x;
  return function remnantAtLog10(e) {
    const N = Math.pow(10, e);
    const x = Math.log(N);
    return Math.abs(analyticSurrogateExponent(x) - localExponent(N));
  };
}

function locateCrossingLog10(remnant, lo, hi, threshold) {
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (remnant(mid) > threshold) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

const remnantSurrogate = makeRemnant(surrogateHeightForN);
const remnantRvM = makeRemnant(effectiveHeightForN);

// Independent recompute of the two crossings under both maps.
const SUB1E3_SUR = locateCrossingLog10(remnantSurrogate, 20, 40, 1e-3);
const SUB1E4_SUR = locateCrossingLog10(remnantSurrogate, 100, 130, 1e-4);
const SUB1E3_RVM = locateCrossingLog10(remnantRvM, 24, 60, 1e-3);
const SUB1E4_RVM = locateCrossingLog10(remnantRvM, 130, 200, 1e-4);
const SUB1E3_SHIFT = SUB1E3_RVM - SUB1E3_SUR;
const SUB1E4_SHIFT = SUB1E4_RVM - SUB1E4_SUR;

function relDivergenceAtLog10(e) {
  const N = Math.pow(10, e);
  const tS = surrogateHeightForN(N);
  const tR = effectiveHeightForN(N);
  return (tR - tS) / tS;
}
const DIV_SUB1E3 = relDivergenceAtLog10(SUB1E3_SUR);
const DIV_SUB1E4 = relDivergenceAtLog10(SUB1E4_SUR);
const INFLATION_SUB1E3 = remnantRvM(SUB1E3_SUR) / remnantSurrogate(SUB1E3_SUR);
const INFLATION_SUB1E4 = remnantRvM(SUB1E4_SUR) / remnantSurrogate(SUB1E4_SUR);

// The imp-35577 baked record for the reproduce cross-check (import-light, no zeros bundle).
const REC = IMP35577_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY.crossings;

export const IMP35660_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY_GUARD = {
  id: 'imp-35660',
  proofSection: 'S-frontier',
  question:
    'Pin the imp-35577 far-tail-crossing height-map sensitivity literals (two decade shifts, ' +
    'the RvM-inverse vs surrogate crossing log10 N, the remnant inflation ratios and the height ' +
    'divergence) against a silent drift of the inlined-Newton height-map-swap channel.',
  recompute: {
    sub1e3_sur_log10N: +SUB1E3_SUR.toFixed(4),
    sub1e3_rvm_log10N: +SUB1E3_RVM.toFixed(4),
    sub1e3_shift: +SUB1E3_SHIFT.toFixed(4),
    sub1e3_inflation: +INFLATION_SUB1E3.toFixed(4),
    sub1e3_divergence: +DIV_SUB1E3.toFixed(6),
    sub1e4_sur_log10N: +SUB1E4_SUR.toFixed(4),
    sub1e4_rvm_log10N: +SUB1E4_RVM.toFixed(4),
    sub1e4_shift: +SUB1E4_SHIFT.toFixed(4),
    sub1e4_inflation: +INFLATION_SUB1E4.toFixed(4),
    sub1e4_divergence: +DIV_SUB1E4.toFixed(6),
  },
  isRigorous: false,
  verdict:
    'REGRESSION-GUARD ONLY. An independent inlined-Newton recompute of the imp-35577 ' +
    'height-map-swap channel reproduces the printed literals to storage precision: the ' +
    'sub-1e-3 crossing 25.6205 -> 40.9350 (+15.31 decades, 2.1311x inflation, +9.238 percent ' +
    'divergence) and the sub-1e-4 crossing 109.1892 -> 156.0294 (+46.84 decades, 1.8740x ' +
    'inflation, +2.654 percent divergence). Recomputes established measurement figures; ' +
    'changes no bound; E_coll far-tail exponent 1/2 per imp-3463; C_mb GUE-conditional per ' +
    'imp-486 UNTOUCHED; imp-35337a stays OPEN; NO QED; no refereed bound is changed.',
  citation:
    'imp-35577 (the height-map sensitivity literals pinned here); imp-35619 (the sibling ' +
    'span-growth guard); imp-35497 (sub-1e-3 swap +15.31 decades); imp-35198 (analytic ' +
    '-1 + 3/log N); imp-486 (C_mb GUE-conditional, UNTOUCHED).',
};

export const IMP35660_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY_GUARD_ASSERTIONS = [
  {
    // The two surrogate crossings reproduce the imp-35413 / imp-35473 landmarks.
    id: 'imp35660-surrogate-crossings-match',
    description: 'surrogate crossings reproduce 25.6205 and 109.1892 to storage precision',
    holds: () =>
      Math.abs(SUB1E3_SUR - 25.6205) < 1e-4 &&
      Math.abs(SUB1E4_SUR - 109.1892) < 1e-4,
  },
  {
    // The two RvM-inverse crossings reproduce the imp-35497 / imp-35577 landmarks.
    id: 'imp35660-rvm-crossings-match',
    description: 'RvM-inverse crossings reproduce 40.9350 and 156.0294 to storage precision',
    holds: () =>
      Math.abs(SUB1E3_RVM - 40.9350) < 1e-4 &&
      Math.abs(SUB1E4_RVM - 156.0294) < 1e-4,
  },
  {
    // The two decade shifts reproduce +15.3145 and +46.8401 to storage precision.
    id: 'imp35660-decade-shifts-match',
    description: 'the two decade shifts reproduce +15.3145 (sub-1e-3) and +46.8401 (sub-1e-4)',
    holds: () =>
      Math.abs(SUB1E3_SHIFT - 15.3145) < 1e-4 &&
      Math.abs(SUB1E4_SHIFT - 46.8401) < 1e-4,
  },
  {
    // The two remnant inflation ratios reproduce ~2.1311x and ~1.8740x to storage precision.
    id: 'imp35660-inflation-ratios-match',
    description: 'the two remnant inflation ratios reproduce 2.1311x and 1.8740x',
    holds: () =>
      Math.abs(INFLATION_SUB1E3 - 2.1311) < 1e-4 &&
      Math.abs(INFLATION_SUB1E4 - 1.8740) < 1e-4,
  },
  {
    // The two height divergences reproduce +9.238 percent and +2.654 percent to storage precision.
    id: 'imp35660-height-divergence-match',
    description: 'the two height divergences reproduce +0.092383 (sub-1e-3) and +0.026543 (sub-1e-4)',
    holds: () =>
      Math.abs(DIV_SUB1E3 - 0.092383) < 1e-6 &&
      Math.abs(DIV_SUB1E4 - 0.026543) < 1e-6,
  },
  {
    // Independent recompute agrees with the imp-35577 baked crossings record.
    id: 'imp35660-agrees-with-imp35577-record',
    description: 'the recompute matches the imp-35577 baked crossings record shifts and inflations',
    holds: () =>
      Math.abs(SUB1E3_SHIFT - REC.sub1e3.shiftDecades) < 1e-3 &&
      Math.abs(SUB1E4_SHIFT - REC.sub1e4.shiftDecades) < 1e-3 &&
      Math.abs(INFLATION_SUB1E3 - REC.sub1e3.remnantInflation) < 1e-3 &&
      Math.abs(INFLATION_SUB1E4 - REC.sub1e4.remnantInflation) < 1e-3,
  },
  {
    // Honesty gate: regression-guard only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35660-honesty-gate-no-qed',
    description: 'Regression-guard only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35660_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY_GUARD.isRigorous === false &&
      /NO QED/.test(IMP35660_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY_GUARD.verdict) &&
      /refereed bound is changed/i.test(IMP35660_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY_GUARD.verdict),
  },
];

for (const a of IMP35660_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY_GUARD_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35660-fartail-crossings-height-map-sensitivity-guard assertion failed: ${a.id}`,
    );
  }
}

export default IMP35660_FARTAIL_CROSSINGS_HEIGHT_MAP_SENSITIVITY_GUARD;
