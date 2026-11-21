/**
 * @module imp-35612-cubic-skew-height-map-literals-assertion
 * @fileoverview imp-35612 -- ASSERTION-ONLY tripwire pinning the imp-35557 three-map
 *   interior sigma-peak cubic-skew height-map literals (c3, quadratic curvature k and
 *   the arm-imbalance slope A_skew) against a silent surrogate / stencil / locator drift.
 *
 *   imp-35557 applied the imp-35536 multiplicative-perturbation height-map method to the
 *   imp-35451 interior sigma-peak CUBIC skew: it re-located the peak by ternary argmax and
 *   re-measured the 5-point Richardson third derivative (c3 = sigma-triple-prime/6), the
 *   quadratic curvature k and the tol = 1e-5 arm-imbalance slope A_skew under the RvM
 *   x {1.02, 0.98} bracketing pair. It bakes, but its own tripwires only RANGE-check (sign,
 *   spread-under-5-percent, cross-check-under-1e-2), these three per-map triplets:
 *     RvM inverse (base)   c3 = -2.623677e-4   k = 6.431916e-3   A_skew = 11.01451
 *     RvM x 1.02           c3 = -2.599790e-4   k = 6.365650e-3   A_skew = 11.13633
 *     RvM x 0.98           c3 = -2.648243e-4   k = 6.500125e-3   A_skew = 10.87302
 *   plus the cubic-predicts-imbalance cross-check A_skew_pred = -4 c3 / (k^2 ln10) on each
 *   map (11.01727 / 11.14543 / 10.88826). A silent change in the effectiveHeightForN RvM
 *   inverse, the double-surrogate sigma(N), the ternary argmax locator or the Richardson
 *   stencil could drift any of these nine literals at storage precision without tripping a
 *   build.
 *
 *   This module INDEPENDENTLY recomputes each triplet -- inlining the pure-Math
 *   effectiveHeightForN + double-surrogate sigma(N), re-locating the peak by the same
 *   500-iter ternary argmax, then re-running the imp-35451 stencils about THAT map own
 *   ln N_max -- and asserts:
 *     (a) the full-precision recompute of c3, k, A_skew and A_skew_pred on each of the
 *         three maps matches hard-coded 7-sig-fig reference literals within 1e-6 relative --
 *         the storage-precision tolerance per [[storage_precision_assertion_tolerance]];
 *     (b) each baked imp-35557 skewLadder field (c3, k, a_skew_measured, a_skew_predicted)
 *         reproduces EXACTLY when the source module's own display rounding (toExponential /
 *         toFixed) is re-applied to this independent recompute -- so any source drift trips;
 *     (c) the A_skew_pred = -4 c3 / (k^2 ln10) cross-check holds on EVERY map (< 1.5e-3).
 *
 *   Import-light: inlines the pure-Math effectiveHeightForN, the C_C ansatz and the sigma(N)
 *   double surrogate, and imports only the (import-light) imp-35557 record for the
 *   exact-reproduction cross-check; never the 16.7MB zeros bundle, per
 *   [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]].
 *
 *   @see imp-35557-cubic-skew-height-map-sensitivity.js (source of every baked literal)
 *   @see imp-35451-sigma-peak-arm-asymmetry (base-map c3 = -2.623677e-4 and A_skew ~ 11.01)
 *   @see imp-35536-peak-height-map-sensitivity (the RvM x {1.02,0.98} perturbation method)
 *   @see imp-35450-sigma-peak-curvature-direct-fd (the quadratic curvature k ~ 6.43e-3)
 *   @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse, inlined here)
 *
 *   Ticket: imp-35612 (accuracy, medium). Verification-tooling only; recomputes the same
 *   already-established measurement figures; adds no new Lambda bound; the C_C = (1/8) sqrt(3 pi)
 *   ansatz (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631) and the imp-398 C_F prefactor are
 *   UNTOUCHED; surrogate-vs-true fidelity (imp-35337a) stays OPEN; the C_mb GUE-conditional share
 *   per imp-486 is UNTOUCHED. No refereed bound is changed. NO QED.
 */

import { IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY } from './imp-35557-cubic-skew-height-map-sensitivity.js';

const TWO_PI = 2 * Math.PI;
const C_C_PINNED = (1 / 8) * Math.sqrt(3 * Math.PI); // imp-2642/imp-2643/imp-2714 ansatz
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35451/imp-35536/imp-35557 exactly

// The EXACT RvM inverse -- inlined verbatim from imp-35557/lambda-rh-height-mapping.js.
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

// The imp-35451/imp-35017/imp-3406 double-surrogate sigma(N), parameterised by a height MULTIPLIER.
function makeSigma(mult) {
  return function sigma(N) {
    const T0 = mult * effectiveHeightForN(N);
    const L = Math.log(T0);
    const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
    const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
    const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
    return E_coll / (E_TRUNC_PT + E_flow + E_coll);
  };
}

// Unimodal argmax on the right arm (ternary in ln N, 500-iter, verbatim imp-35451/imp-35557).
function argmaxD(sigma, loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigma(Math.exp(m1)) < sigma(Math.exp(m2))) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// Measure the skew triplet (c3, k, A_skew, A_skew_pred) about a given map own peak (verbatim imp-35557).
function measureSkew(mult) {
  const sigma = makeSigma(mult);
  const sigU = (u) => sigma(Math.exp(u));
  const Nmax = argmaxD(sigma, 1e4, 1e9);
  const sigmaMax = sigma(Nmax);
  const U0 = Math.log(Nmax);

  const tol = 1e-5;
  const targetLo = sigmaMax - tol;
  let a = Math.log(1);
  let b = U0;
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) < targetLo) a = m;
    else b = m;
  }
  const nLo = Math.exp((a + b) / 2);
  a = U0;
  b = Math.log(1e40);
  for (let i = 0; i < 500; i++) {
    const m = (a + b) / 2;
    if (sigma(Math.exp(m)) > targetLo) a = m;
    else b = m;
  }
  const nHi = Math.exp((a + b) / 2);
  const wRise = (U0 - Math.log(nLo)) / Math.LN10;
  const wFall = (Math.log(nHi) - U0) / Math.LN10;
  const aSkewMeasured = (wRise - wFall) / tol;

  const d3FD = (h) =>
    (sigU(U0 + 2 * h) - 2 * sigU(U0 + h) + 2 * sigU(U0 - h) - sigU(U0 - 2 * h)) / (2 * h * h * h);
  const sigmaTriplePrime = (4 * d3FD(1e-2) - d3FD(2e-2)) / 3;
  const c3 = sigmaTriplePrime / 6;

  const k = -(sigU(U0 + 1e-2) - 2 * sigU(U0) + sigU(U0 - 1e-2)) / (1e-2 * 1e-2);

  const aSkewPredicted = (-4 * c3) / (k * k * Math.LN10);
  const crossCheckRel = Math.abs(aSkewPredicted - aSkewMeasured) / aSkewPredicted;

  return { mult, c3, k, aSkewMeasured, aSkewPredicted, crossCheckRel };
}

// -- INDEPENDENT recompute of the three-map cubic-skew triplet (base + x{1.02,0.98}) --
const MULTS = [1.0, 1.02, 0.98]; // imp-35557 map order, verbatim
const RECOMPUTE = MULTS.map(measureSkew);

// -- 7-sig-fig reference literals (storage-precision tolerance ~1e-6 relative) --
const REF = Object.freeze([
  { c3: -2.623677e-4, k: 6.431916e-3, aSkew: 11.01451, aSkewPred: 11.01727 }, // RvM inverse (base)
  { c3: -2.599790e-4, k: 6.365650e-3, aSkew: 11.13633, aSkewPred: 11.14543 }, // RvM x 1.02
  { c3: -2.648243e-4, k: 6.500125e-3, aSkew: 10.87302, aSkewPred: 10.88826 }, // RvM x 0.98
]);

const STORAGE_REL_TOL = 1e-6; // 7-sig-fig storage tolerance
const relClose = (a, b) => Math.abs(a - b) <= STORAGE_REL_TOL * Math.abs(b);

export const IMP35612_CUBIC_SKEW_LITERALS_RECOMPUTE = Object.freeze({
  id: 'imp-35612',
  maps: RECOMPUTE.map((r) => ({
    mult: r.mult,
    c3: r.c3,
    k: r.k,
    aSkewMeasured: r.aSkewMeasured,
    aSkewPredicted: r.aSkewPredicted,
  })),
});

export const IMP35612_CUBIC_SKEW_HEIGHT_MAP_LITERALS_ASSERTIONS = [
  {
    // (1) full-precision recompute of c3, k, A_skew and A_skew_pred on each of the three maps
    //     matches the 7-sig-fig references within 1e-6 relative -- guards effectiveHeightForN /
    //     sigma(N) / ternary argmax / Richardson-stencil drift at storage precision.
    id: 'imp35612-recompute-matches-reference-at-storage-tol',
    description:
      'independently recomputing c3, k, A_skew and A_skew_pred on the three maps (RvM base + ' +
      'x{1.02,0.98}) matches the 7-sig-fig reference literals within 1e-6 relative',
    holds: () =>
      RECOMPUTE.every(
        (r, i) =>
          relClose(r.c3, REF[i].c3) &&
          relClose(r.k, REF[i].k) &&
          relClose(r.aSkewMeasured, REF[i].aSkew) &&
          relClose(r.aSkewPredicted, REF[i].aSkewPred)
      ),
  },
  {
    // (2) each baked imp-35557 skewLadder field reproduces EXACTLY when the source module's own
    //     display rounding (toExponential(6) / toFixed(5)) is re-applied to this INDEPENDENT
    //     recompute -- catches any source-side drift.
    id: 'imp35612-baked-imp35557-fields-reproduce-exactly',
    description:
      'each imp-35557 skewLadder field (c3, k, a_skew_measured, a_skew_predicted) equals the ' +
      'source display-rounding re-applied to this independent recompute, on every map',
    holds: () => {
      const ladder = IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY.skewLadder;
      return RECOMPUTE.every(
        (r, i) =>
          ladder[i].c3 === +r.c3.toExponential(6) &&
          ladder[i].k === +r.k.toExponential(6) &&
          ladder[i].a_skew_measured === +r.aSkewMeasured.toFixed(5) &&
          ladder[i].a_skew_predicted === +r.aSkewPredicted.toFixed(5)
      );
    },
  },
  {
    // (3) the cubic-predicts-imbalance cross-check A_skew_pred = -4 c3 / (k^2 ln10) holds on EVERY
    //     map to < 1.5e-3 relative, and c3 stays NEGATIVE (rising arm stays wider) everywhere.
    id: 'imp35612-cross-check-and-sign-hold-each-map',
    description:
      'A_skew_pred = -4 c3/(k^2 ln10) matches measured A_skew to < 1.5e-3 relative and c3 < 0 ' +
      'under every map RvM x {1.0,1.02,0.98}',
    holds: () => RECOMPUTE.every((r) => r.crossCheckRel < 1.5e-3 && r.c3 < 0),
  },
  {
    // (4) honesty gate: measurement only, no QED, no refereed bound is changed.
    id: 'imp35612-honesty-gate-no-qed',
    description: 'Measurement only: source isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY.isRigorous === false &&
      /NO QED/.test(IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP35557_CUBIC_SKEW_HEIGHT_MAP_SENSITIVITY.verdict),
  },
];

for (const a of IMP35612_CUBIC_SKEW_HEIGHT_MAP_LITERALS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35612-cubic-skew-height-map-literals-assertion failed: ${a.id}`);
  }
}

export default Object.freeze({
  id: 'imp-35612-cubic-skew-height-map-literals-assertion',
  ticket: 'imp-35612',
  recompute: IMP35612_CUBIC_SKEW_LITERALS_RECOMPUTE,
  reference: REF,
  storageRelTol: STORAGE_REL_TOL,
});
