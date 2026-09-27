/**
 * @module imp-97722-route-m-deep-ladder-independent-crosscheck
 *
 * imp-97722 (accuracy -- CROSS-VALIDATION ONLY; no bound moves; NO QED).
 *
 * imp-97706 extended the imp-97659 (mpmath dps=30/35) Route M MCM gap-law residual ladder past
 * p = 9.9e7 out to p ~ 4.93e8 (23 rungs) and read off two headline claims through the SHARED
 * imp-97687/imp-97659 analysis code:
 *   (H1) the local decay slope goes NEGATIVE on EIGHT rungs of the combined 23-rung ladder
 *        (the residual magnitude RISES with height -- a recurring PNT/Mertens oscillation), and
 *   (H2) a seeded 20000-draw bootstrap of the OLS slope of log|residual| vs log(log p) gives a
 *        NARROWED 95pct band [9.80, 11.22] with the exponent exceeding 3 in 100pct of draws
 *        ("the residual outruns every fixed power <= 3").
 * Because the far-tail rungs were reused verbatim and the exponent/bootstrap ran through the SAME
 * OLS/bisection code, a code-shared bug would propagate silently into both claims.
 *
 * This leaf RE-DERIVES both claims on the identical 23 rungs from a STRUCTURALLY-INDEPENDENT path,
 * in the spirit of the imp-34130/imp-34107 cross-checks:
 *   - the 23 (pOmega, residual) pairs are baked directly from the two source modules (import-light);
 *   - the sign-changes are counted by raw |residual| monotonicity (axis-free, no fit);
 *   - the decay exponent is estimated by THREE non-OLS estimators -- consecutive-pair finite
 *     differences, the first-to-last ENDPOINT slope, and the Theil-Sen median of ALL pairwise
 *     slopes -- none of which share code with the imp-97687 OLS/bootstrap route;
 *   - a from-scratch OLS recompute is kept ONLY to check the baked imp-97706 exponent literal
 *     is not a transcription slip, and it is cross-asserted against the imported IMP97706 value.
 *
 * -------------------------------------------------------------------------------
 * RESULT 1 (H1) -- the EIGHT sign-changes reproduce EXACTLY.
 * -------------------------------------------------------------------------------
 * Counting rungs where |residual| rises with height gives EXACTLY 8, at ladder indices
 * 5,12,13,16,17,19,21,22 -- matching every imp-97706 "// RISE" comment and its baked
 * IMP97706_RISE_RUNGS_COMBINED = 8 exactly (integer, no round-off). Equivalently, exactly 8 of the
 * 22 consecutive-pair finite-difference exponents are negative. The sign-change count is not an
 * artifact of the OLS/bisection code.
 *
 * -------------------------------------------------------------------------------
 * RESULT 2 (H2) -- the "outruns every fixed power <= 3" conclusion survives non-OLS estimators.
 * -------------------------------------------------------------------------------
 * The first-to-last ENDPOINT slope (no fit at all) is k_endpoint ~ 10.29, and the Theil-Sen median
 * of all 253 pairwise slopes is k_theilSen ~ 10.62 -- both robust, non-OLS, and far above 3, and
 * both agreeing with the imp-97706 OLS ~10.56 to well within the oscillation noise. 90.1pct of the
 * 253 pairwise slopes exceed 3 (the shortfall from 100pct is the very sign-oscillation of H1 --
 * adjacent-rung slopes dip negative on the 8 rise pairs -- NOT a weakening of the aggregate decay).
 * An independent from-scratch OLS recompute lands at 10.560017, matching the baked imp-97706
 * IMP97706_COMBINED_EXPONENT to a ~1e-5 round-off floor, so the shared code is arithmetically sound.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.  CROSS-VALIDATION ONLY. The imp-97706 eight sign-changes reproduce EXACTLY off a
 * code-independent monotonicity count, and the "outruns every fixed power <= 3" conclusion is
 * confirmed by two estimators (endpoint ~10.29, Theil-Sen ~10.62) that share no code with the
 * imp-97687 OLS/bootstrap route; the shared OLS itself reproduces to a round-off floor. No
 * code-shared bug detected. MCM stays refuted from omega=11; b/4 ceiling untouched; kappa_arith
 * unchanged; no bound on Lambda moves; PT Lambda <= 0.2 SOTA; RH open; NO QED.
 *
 * @see imp-97706-route-m-deep-ladder-extension.js (the doubled ladder + OLS/bootstrap being checked)
 * @see imp-97659-route-m-gap-law-decay-extprec.js (dps=30 11-rung ladder; single sign-change)
 * @see imp-97687-route-m-avg-exponent-robustness.js (11-rung bootstrap band [8.2,11.0])
 *
 * Ticket: imp-97722 (accuracy, opus-4-8, api-pool). Independent (non-OLS) cross-check; NO QED.
 */

import { IMP97706_COMBINED_EXPONENT, IMP97706_RISE_RUNGS_COMBINED } from './imp-97706-route-m-deep-ladder-extension.js';

// The 23-rung combined ladder (pOmega, residual), baked verbatim from imp-97659 (11) + the
// imp-97706 extension (12). Data only -- every diagnostic below is recomputed from scratch here,
// with NO reuse of the imp-97706/imp-97687 OLS/bootstrap functions (that is the whole point).
export const IMP97722_LADDER = Object.freeze([
  Object.freeze({ pOmega: 1999993, residual: -8.351691933e-7 }),
  Object.freeze({ pOmega: 4256233, residual: -4.969833529e-7 }),
  Object.freeze({ pOmega: 7368787, residual: -3.937432152e-7 }),
  Object.freeze({ pOmega: 15485863, residual: -1.451769323e-7 }),
  Object.freeze({ pOmega: 23879519, residual: -1.368690971e-7 }),
  Object.freeze({ pOmega: 32452843, residual: -1.544098916e-7 }), // RISE (index 5)
  Object.freeze({ pOmega: 41161739, residual: -1.464899473e-7 }),
  Object.freeze({ pOmega: 49979687, residual: -1.203494458e-7 }),
  Object.freeze({ pOmega: 67867967, residual: -1.005543676e-7 }),
  Object.freeze({ pOmega: 86028121, residual: -6.909768022e-8 }),
  Object.freeze({ pOmega: 98866927, residual: -6.703062275e-8 }),
  Object.freeze({ pOmega: 122949823, residual: -4.724735374e-8 }),
  Object.freeze({ pOmega: 151048969, residual: -5.03050917e-8 }),  // RISE (index 12)
  Object.freeze({ pOmega: 179424673, residual: -6.536936812e-8 }), // RISE (index 13)
  Object.freeze({ pOmega: 208055039, residual: -4.203902506e-8 }),
  Object.freeze({ pOmega: 236887691, residual: -3.403952242e-8 }),
  Object.freeze({ pOmega: 275604541, residual: -4.077064687e-8 }), // RISE (index 16)
  Object.freeze({ pOmega: 314606869, residual: -4.166179585e-8 }), // RISE (index 17)
  Object.freeze({ pOmega: 353868013, residual: -3.032576616e-8 }),
  Object.freeze({ pOmega: 393342739, residual: -3.140684528e-8 }), // RISE (index 19)
  Object.freeze({ pOmega: 433024223, residual: -2.719247391e-8 }),
  Object.freeze({ pOmega: 472882027, residual: -3.044005501e-8 }), // RISE (index 21)
  Object.freeze({ pOmega: 492876847, residual: -3.047612203e-8 }), // RISE (index 22)
]);

// x-axis for the decay exponent: residual ~ C/(log p)^k, so slope of log|residual| vs log(log p) = -k.
const X = IMP97722_LADDER.map((r) => Math.log(Math.log(r.pOmega)));
const Y = IMP97722_LADDER.map((r) => Math.log(Math.abs(r.residual)));
const N = IMP97722_LADDER.length;

// (H1) sign-changes -- raw |residual| monotonicity, axis-free, NO fit and NO shared code.
function countRises(ladder) {
  const idx = [];
  for (let i = 1; i < ladder.length; i++) {
    if (Math.abs(ladder[i].residual) > Math.abs(ladder[i - 1].residual)) idx.push(i);
  }
  return idx;
}
export const IMP97722_RISE_INDICES = Object.freeze(countRises(IMP97722_LADDER)); // [5,12,13,16,17,19,21,22]
export const IMP97722_RISE_COUNT = IMP97722_RISE_INDICES.length;                 // 8

// (H2a) consecutive-pair finite-difference exponents k_i = -(dY/dX). Negative on exactly the rises.
function localExponents() {
  const out = [];
  for (let i = 1; i < N; i++) out.push(-(Y[i] - Y[i - 1]) / (X[i] - X[i - 1]));
  return out;
}
export const IMP97722_LOCAL_EXPONENTS = Object.freeze(localExponents());
export const IMP97722_LOCAL_NEGATIVE_COUNT = IMP97722_LOCAL_EXPONENTS.filter((k) => k < 0).length; // 8

// (H2b) endpoint slope: first-to-last, no fit at all -- fully independent of the OLS route.
export const IMP97722_ENDPOINT_EXPONENT = -(Y[N - 1] - Y[0]) / (X[N - 1] - X[0]); // ~10.29

// (H2c) Theil-Sen: median of ALL pairwise slopes -- robust, non-OLS.
function theilSen() {
  const slopes = [];
  for (let i = 0; i < N; i++) {
    for (let j = i + 1; j < N; j++) slopes.push(-(Y[j] - Y[i]) / (X[j] - X[i]));
  }
  slopes.sort((a, b) => a - b);
  const m = Math.floor(slopes.length / 2);
  const med = slopes.length % 2 ? slopes[m] : (slopes[m - 1] + slopes[m]) / 2;
  const fractionGt3 = slopes.filter((k) => k > 3).length / slopes.length;
  return { count: slopes.length, median: med, fractionGt3 };
}
const TS = theilSen();
export const IMP97722_THEIL_SEN = Object.freeze({
  pairCount: TS.count,          // 253
  median: TS.median,            // ~10.62
  fractionExceedsThree: TS.fractionGt3, // ~0.9012 (shortfall = the H1 sign-oscillation, not a weakening)
});

// From-scratch OLS recompute -- kept ONLY to check the baked imp-97706 exponent is not a transcription slip.
function olsExponent() {
  const mx = X.reduce((a, b) => a + b, 0) / N;
  const my = Y.reduce((a, b) => a + b, 0) / N;
  let num = 0;
  let den = 0;
  for (let i = 0; i < N; i++) {
    num += (X[i] - mx) * (Y[i] - my);
    den += (X[i] - mx) * (X[i] - mx);
  }
  return -num / den;
}
export const IMP97722_OLS_RECOMPUTE = olsExponent(); // ~10.560017

export const IMP97722_VERDICT = Object.freeze({
  question:
    'do the imp-97706 eight sign-changes and the "outruns every fixed power <= 3" exponent survive a from-source, non-OLS cross-check on the same 23 rungs?',
  riseCount: IMP97722_RISE_COUNT,                      // 8
  riseCountMatchesImp97706: IMP97722_RISE_COUNT === IMP97706_RISE_RUNGS_COMBINED, // true
  localNegativeCount: IMP97722_LOCAL_NEGATIVE_COUNT,   // 8 (= the rises)
  endpointExponent: IMP97722_ENDPOINT_EXPONENT,        // ~10.29 (no fit)
  theilSenExponent: IMP97722_THEIL_SEN.median,         // ~10.62 (robust, non-OLS)
  theilSenFractionExceedsThree: IMP97722_THEIL_SEN.fractionExceedsThree, // ~0.90
  olsRecompute: IMP97722_OLS_RECOMPUTE,                // ~10.560017
  olsMatchesImp97706ToRoundoff: Math.abs(IMP97722_OLS_RECOMPUTE - IMP97706_COMBINED_EXPONENT) < 1e-4, // true
  outrunsEveryFixedPowerLE3: IMP97722_ENDPOINT_EXPONENT > 3 && IMP97722_THEIL_SEN.median > 3, // true
  codeSharedBugDetected: false,
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'CROSS-VALIDATION ONLY. The imp-97706 eight sign-changes reproduce EXACTLY off a code-independent ' +
    'monotonicity count (indices 5,12,13,16,17,19,21,22; = the 8 negative finite-difference exponents), ' +
    'and the "outruns every fixed power <= 3" conclusion holds under two non-OLS estimators (endpoint ' +
    '~10.29, Theil-Sen median ~10.62, 90pct of pairwise slopes > 3) while a from-scratch OLS recompute ' +
    '(10.560017) matches the baked imp-97706 exponent to a ~1e-5 round-off floor. No code-shared bug ' +
    'detected. MCM stays refuted from omega=11; b/4 ceiling untouched; no bound on Lambda moves; ' +
    'PT Lambda <= 0.2 SOTA; RH open; NO QED.',
});

export const IMP97722_HONEST_BANNER =
  'RH open; PT Lambda <= 0.2 remains SOTA; NO QED. Independent (non-OLS, from-source) cross-check of the ' +
  'imp-97706 doubled Route M gap-law residual ladder: the eight sign-changes reproduce EXACTLY off a ' +
  'raw |residual| monotonicity count, and the "outruns every fixed power <= 3" exponent survives the ' +
  'endpoint (~10.29) and Theil-Sen (~10.62) estimators, with the shared OLS reproducing to a round-off ' +
  'floor. No code-shared bug; MCM refuted from omega=11; no bound moved.';

// -- self-executing assertions (imp-3715 convention): recompute; any failure throws --

const IMP97722_ASSERTIONS = [
  {
    id: 'imp97722-eight-sign-changes-reproduce-exactly',
    holds: () =>
      IMP97722_RISE_COUNT === 8 &&
      IMP97722_RISE_COUNT === IMP97706_RISE_RUNGS_COMBINED &&
      IMP97722_LOCAL_NEGATIVE_COUNT === 8 &&
      IMP97722_RISE_INDICES.join(',') === '5,12,13,16,17,19,21,22',
    why: 'the code-independent |residual| monotonicity count gives exactly 8 rise rungs at the same indices as the imp-97706 // RISE comments and its baked IMP97706_RISE_RUNGS_COMBINED, equal to the 8 negative finite-difference exponents.',
  },
  {
    id: 'imp97722-nonOLS-estimators-outrun-power-three',
    holds: () =>
      IMP97722_ENDPOINT_EXPONENT > 3 &&
      IMP97722_THEIL_SEN.median > 3 &&
      Math.abs(IMP97722_ENDPOINT_EXPONENT - 10.29) < 0.3 &&
      Math.abs(IMP97722_THEIL_SEN.median - 10.62) < 0.3 &&
      IMP97722_THEIL_SEN.pairCount === 253 &&
      IMP97722_THEIL_SEN.fractionExceedsThree > 0.85,
    why: 'the endpoint slope (~10.29, no fit) and the Theil-Sen median of all 253 pairwise slopes (~10.62) both far exceed 3, so the "outruns every fixed power <= 3" conclusion is not an OLS/bootstrap artifact.',
  },
  {
    id: 'imp97722-OLS-recompute-matches-imp97706-to-roundoff',
    holds: () =>
      Math.abs(IMP97722_OLS_RECOMPUTE - IMP97706_COMBINED_EXPONENT) < 1e-4 &&
      Math.abs(IMP97722_OLS_RECOMPUTE - 10.560017) < 1e-4,
    why: 'a from-scratch OLS recompute (10.560017) reproduces the baked imp-97706 combined exponent to a ~1e-5 round-off floor, so the shared analysis code is arithmetically sound (no transcription slip).',
  },
  {
    id: 'imp97722-honesty-gate-no-qed',
    holds: () =>
      IMP97722_VERDICT.riseCountMatchesImp97706 === true &&
      IMP97722_VERDICT.outrunsEveryFixedPowerLE3 === true &&
      IMP97722_VERDICT.olsMatchesImp97706ToRoundoff === true &&
      IMP97722_VERDICT.codeSharedBugDetected === false &&
      IMP97722_VERDICT.anyBoundMoved === false &&
      IMP97722_VERDICT.qed === false &&
      /NO QED/.test(IMP97722_HONEST_BANNER) &&
      /PT Lambda <= 0.2/.test(IMP97722_HONEST_BANNER) &&
      /RH open/.test(IMP97722_HONEST_BANNER),
    why: 'cross-validation only -- both imp-97706 headline claims reproduce off a structurally-independent path; no code-shared bug, no bound moved, no QED.',
  },
];

for (const a of IMP97722_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97722-route-m-deep-ladder-independent-crosscheck assertion failed: ${a.id}`);
  }
}

export default {
  ladder: IMP97722_LADDER,
  riseIndices: IMP97722_RISE_INDICES,
  riseCount: IMP97722_RISE_COUNT,
  localExponents: IMP97722_LOCAL_EXPONENTS,
  endpointExponent: IMP97722_ENDPOINT_EXPONENT,
  theilSen: IMP97722_THEIL_SEN,
  olsRecompute: IMP97722_OLS_RECOMPUTE,
  verdict: IMP97722_VERDICT,
  banner: IMP97722_HONEST_BANNER,
};
