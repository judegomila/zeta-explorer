/**
 * @module data/imp-96406-ecoll-anchor-count-model-sensitivity-n1e5
 * @fileoverview imp-96406 -- MEASURE the +7/8-corrected count-model sensitivity
 *   of E_coll at an INTERMEDIATE N = 1e5 anchor and check it falls on the
 *   predicted ~1/(2 gamma_N log gamma_N) trend between the imp-96387 endpoints
 *   (N = 1e4 and N = 1e6).
 *
 *   BACKGROUND. imp-96387 measured the +7/8 count-model shift of E_coll at the
 *   ONE independently baked anchor N = 1e4 (relative rate/E_coll shift
 *   -4.11e-6) and compared it to the reconstructed N = 1e6 anchor (-3.00e-8),
 *   inferring a ~1/N scaling from the two ENDPOINTS -- with no interior point to
 *   confirm the trend. This module adds the missing interior anchor at
 *   N = 1e5, using the identical two count paths (main-term Riemann-von Mangoldt
 *   Newton inversion vs the +7/8-corrected bisection) and the identical rate
 *   factor R(N) = sqrt(C_KH) * sqrt(log gamma_N / N), C_KH = pi * 2.622.
 *
 *   RESULT (measurement). At N = 1e5 the +7/8 constant moves gamma_N by relative
 *   -7.82e-6 and hence the rate R and E_coll by relative -3.48e-7. That sits
 *   almost exactly on the ~1/N interpolant: the geometric mean of the two
 *   endpoint relative gamma shifts (7.56e-5 and 7.99e-7) is 7.77e-6, and the
 *   measured 7.82e-6 is 0.6% above it; the geometric mean of the two endpoint
 *   relative rate shifts (4.11e-6 and 3.00e-8) is 3.51e-7, and the measured
 *   3.48e-7 is 0.85% below it. So the interior anchor confirms the imp-96387
 *   ~1/N claim to under 1%. The step ratios also track the 10x height ratio:
 *   gamma shift 1e4/1e5 ~ 9.67x and 1e5/1e6 ~ 9.79x. The exact algebraic tie
 *   R-shift = gamma-shift / (2 log gamma_N) holds at N = 1e5 too (ratio 0.04455
 *   = 1 / (2 log 74921.8)), as at the endpoints.
 *
 *   MEASUREMENT ONLY. Closes no gap, changes no bound, proves no constant. The
 *   conditional bound C_H <= 0.127 stays UNPROVEN; C_H isRigorousUpperBound
 *   remains false (imp-2642 / imp-2701); the imp-2640 Gronwall discharge of
 *   C_Lip stays NEGATIVE. No refereed bound is changed. RH remains
 *   open. NO QED.
 *
 * Provenance of baked inputs (single sources of truth, cited not re-derived):
 *   - imp-96387-ecoll-anchor-count-model-sensitivity-n1e4.js: the two endpoint
 *     count paths and the N = 1e4 (-4.11e-6) / N = 1e6 (-3.00e-8) sensitivities
 *     this module interpolates between.
 *   - imp-96363-ecoll-independent-second-anchor.js: the +7/8-corrected count
 *     path definition.
 *   - imp-96311-ecoll-rate-ch-independence-tabulation.js: rate factor
 *     R(N) = sqrt(C_KH) * sqrt(log gamma_N / N), C_KH = pi * 2.622.
 *
 * Syntax note: derivative-like expressions use brace notation dg_{k*}/dt and
 *   this header avoids the close-comment terminator sequence inside prose.
 */

// Koksma-Hlawka discrepancy factor of E_coll (imp-2641 Trudgian), as in imp-96311.
const C_KH = Math.PI * 2.622; // = 8.2373...

// C_H columns carried through (imp-96290 / imp-96387 convention).
const CH_A = 0.125; // C_H = 1/8
const CH_B = 0.127; // conditional hypothesis C_H <= 0.127

// IN-FORMULA reference path: Newton inversion of the RvM MAIN-term count
// (reproduced verbatim from imp-96387 so the paths compare apples-to-apples).
function gammaNewtonMain(N) {
  let T = 2 * Math.PI * N;
  for (let i = 0; i < 200; i += 1) {
    const u = T / (2 * Math.PI);
    const f = u * (Math.log(u) - 1) - N;
    const df = Math.log(u) / (2 * Math.PI);
    const step = f / df;
    T -= step;
    if (Math.abs(step) < 1e-12) break;
  }
  return T;
}

// +7/8-corrected count, bisection-inverted (the DIFFERENT count model of Path B).
function gammaBisect78(N) {
  const count = (T) => {
    const u = T / (2 * Math.PI);
    return u * (Math.log(u) - 1) + 7 / 8;
  };
  let lo = 2 * Math.PI;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const mid = 0.5 * (lo + hi);
    if (count(mid) < N) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

function rateFromGamma(gamma, N) {
  return Math.sqrt(C_KH) * Math.sqrt(Math.log(gamma) / N);
}

function measureAt(N) {
  const gammaRef = gammaNewtonMain(N);
  const gamma78 = gammaBisect78(N);
  const rateRef = rateFromGamma(gammaRef, N);
  const rate78 = rateFromGamma(gamma78, N);
  const gammaRel = (gamma78 - gammaRef) / gammaRef;
  const rateRel = (rate78 - rateRef) / rateRef;
  return { N, gammaRef, gamma78, rateRef, rate78, gammaRel, rateRel };
}

// ---- The three heights: two imp-96387 endpoints + the new interior anchor ----
const N_LO = 1e4;
const N_MID = 1e5; // the new interior anchor this ticket adds
const N_HI = 1e6;

const lo = measureAt(N_LO);
const mid = measureAt(N_MID);
const hi = measureAt(N_HI);

// E_coll relative shift equals the rate relative shift (E_coll = C_H * R, C_H
// cancels), so the C_H columns share the mid rate shift.
const eA_mid_absShift = CH_A * (mid.rate78 - mid.rateRef);
const eB_mid_absShift = CH_B * (mid.rate78 - mid.rateRef);

// ---- Interpolation test: does the interior anchor sit on the ~1/N trend? ----
// If gammaRel ~ 1/N (times a slowly varying log), the interior anchor at the
// geometric-midpoint height N=1e5 should match the geometric mean of the two
// endpoint relative shifts.
const gammaGeoMean = Math.sqrt(Math.abs(lo.gammaRel) * Math.abs(hi.gammaRel));
const rateGeoMean = Math.sqrt(Math.abs(lo.rateRel) * Math.abs(hi.rateRel));
const gammaGeoRatio = Math.abs(mid.gammaRel) / gammaGeoMean; // ~1.006
const rateGeoRatio = Math.abs(mid.rateRel) / rateGeoMean; // ~0.9915

// Step ratios across each decade (should track the 10x height ratio => ~1/N).
const gammaStepLo = Math.abs(lo.gammaRel) / Math.abs(mid.gammaRel); // ~9.67
const gammaStepHi = Math.abs(mid.gammaRel) / Math.abs(hi.gammaRel); // ~9.79

// Exact algebraic tie R-shift = gamma-shift / (2 log gamma_N) at the interior.
const midRateOverGammaShift = mid.rateRel / mid.gammaRel; // 0.04455
const midHalfInvLog = 1 / (2 * Math.log(mid.gammaRef)); // 0.04455

export const IMP96406_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E5 = {
  id: 'imp-96406',
  title:
    'Interior N = 1e5 +7/8 count-model E_coll sensitivity (relative -3.48e-7) ' +
    'lands on the imp-96387 ~1/N trend: within 0.6% (gamma) / 0.85% (rate) of ' +
    'the geometric mean of the N = 1e4 and N = 1e6 endpoints',
  kind: 'measurement / accuracy audit (no closure, no bound change)',
  C_KH,
  endpoints: {
    N1e4: { gammaRelShift: lo.gammaRel, rateRelShift: lo.rateRel },
    N1e6: { gammaRelShift: hi.gammaRel, rateRelShift: hi.rateRel },
    note: 'imp-96387: N=1e4 rate shift -4.11e-6, N=1e6 rate shift -3.00e-8.',
  },
  interiorN1e5: {
    N: N_MID,
    CH_A,
    CH_B,
    gammaRef: mid.gammaRef,
    gammaPlus78: mid.gamma78,
    gammaRelShift: mid.gammaRel,
    rateRef: mid.rateRef,
    ratePlus78: mid.rate78,
    rateRelShift: mid.rateRel,
    E_coll_a_absShift: eA_mid_absShift,
    E_coll_b_absShift: eB_mid_absShift,
  },
  interpolation: {
    gammaGeoMean,
    rateGeoMean,
    gammaGeoRatio, // ~1.006: measured 1e5 gamma shift vs geometric mean of endpoints
    rateGeoRatio, // ~0.9915: measured 1e5 rate shift vs geometric mean of endpoints
    gammaStepLo, // ~9.67: 1e4/1e5 relative gamma shift ratio (~10x height)
    gammaStepHi, // ~9.79: 1e5/1e6 relative gamma shift ratio (~10x height)
    midRateOverGammaShift, // 0.04455
    midHalfInvLog, // 0.04455 = 1/(2 log gamma_N): exact tie holds at interior too
    verdictOnTrend:
      Math.abs(gammaGeoRatio - 1) < 0.02 && Math.abs(rateGeoRatio - 1) < 0.02,
  },
  measurement:
    'At the interior N = 1e5 anchor the +7/8-corrected count moves gamma_N by ' +
    'relative ' +
    mid.gammaRel.toExponential(2) +
    ' and hence the rate R and E_coll by relative ' +
    mid.rateRel.toExponential(2) +
    ' (absolute anchor shift about ' +
    eA_mid_absShift.toExponential(2) +
    ' at C_H = 1/8). That sits on the imp-96387 ~1/N trend: the geometric mean ' +
    'of the N = 1e4 and N = 1e6 relative gamma shifts is ' +
    gammaGeoMean.toExponential(2) +
    ' and the measured 1e5 value is ' +
    ((gammaGeoRatio - 1) * 100).toFixed(1) +
    '% off it, while the rate shift is ' +
    ((rateGeoRatio - 1) * 100).toFixed(1) +
    '% off its endpoint geometric mean -- both under 1%. The per-decade step ' +
    'ratios (' +
    gammaStepLo.toFixed(2) +
    'x then ' +
    gammaStepHi.toFixed(2) +
    'x) track the 10x height ratio, and the exact tie R-shift = gamma-shift / ' +
    '(2 log gamma_N) holds at the interior (' +
    midRateOverGammaShift.toFixed(5) +
    ' = ' +
    midHalfInvLog.toFixed(5) +
    ').',
  verdict:
    'MEASURED. The interior N = 1e5 +7/8 count-model E_coll sensitivity ' +
    '(relative -3.48e-7) falls on the imp-96387 two-endpoint ~1/N trend to ' +
    'within 0.6% (gamma) and 0.85% (rate) of the geometric mean of the N = 1e4 ' +
    'and N = 1e6 endpoints, confirming the ~1/N scaling with an interior point. ' +
    'Accuracy audit only: no gap closed, no bound changed, G6_polymath15_bridge ' +
    'not closed, conditional C_H <= 0.127 stays UNPROVEN, C_H ' +
    'isRigorousUpperBound = false (imp-2642/imp-2701), imp-2640 Gronwall ' +
    'discharge of C_Lip NEGATIVE. No refereed bound is changed. RH open. NO QED.',
  provenance:
    'imp-96387-ecoll-anchor-count-model-sensitivity-n1e4.js (endpoint count ' +
    'paths + N=1e4/N=1e6 sensitivities); ' +
    'imp-96363-ecoll-independent-second-anchor.js (+7/8 count path); ' +
    'imp-96311-ecoll-rate-ch-independence-tabulation.js (rate factor R(N)).',
};

export const IMP96406_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E5_ASSERTIONS = [
  {
    id: 'imp96406-interior-on-1overN-trend',
    holds: () =>
      Math.abs(gammaGeoRatio - 1) < 0.02 && Math.abs(rateGeoRatio - 1) < 0.02,
    why:
      'The interior N = 1e5 relative gamma and rate shifts must match the ' +
      'geometric mean of the N = 1e4 and N = 1e6 endpoint shifts to within 2% ' +
      '(measured ~0.6% and ~0.85%), confirming the imp-96387 ~1/N scaling with ' +
      'an actual interior anchor rather than a two-endpoint inference.',
  },
  {
    id: 'imp96406-step-ratios-track-height',
    holds: () => gammaStepLo > 8 && gammaStepLo < 12 && gammaStepHi > 8 && gammaStepHi < 12,
    why:
      'Each per-decade step in the relative gamma shift must track the 10x ' +
      'height ratio (measured ~9.67x and ~9.79x), the signature of a fixed ' +
      'additive +7/8 count offset scaling as ~1/N.',
  },
  {
    id: 'imp96406-exact-rate-over-gamma-tie',
    holds: () => Math.abs(midRateOverGammaShift - midHalfInvLog) < 1e-4,
    why:
      'The rate/E_coll relative shift equals the gamma relative shift divided ' +
      'by 2 log gamma_N (because R ~ sqrt(log gamma / N)); this exact algebraic ' +
      'tie must hold at the interior anchor as it does at the endpoints.',
  },
  {
    id: 'imp96406-interior-shift-between-endpoints',
    holds: () =>
      Math.abs(mid.rateRel) < Math.abs(lo.rateRel) &&
      Math.abs(mid.rateRel) > Math.abs(hi.rateRel),
    why:
      'The interior N = 1e5 relative rate shift must lie strictly between the ' +
      'N = 1e4 (-4.11e-6) and N = 1e6 (-3.00e-8) endpoint magnitudes, as a ' +
      'monotone-in-N sensitivity requires.',
  },
  {
    id: 'imp96406-no-closure-c-h-still-open',
    holds: () =>
      /no gap closed|NO QED|no bound changed/i.test(
        IMP96406_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E5.verdict,
      ) &&
      IMP96406_ECOLL_ANCHOR_COUNT_MODEL_SENSITIVITY_N1E5.kind.includes(
        'no closure',
      ),
    why:
      'This ticket is measurement/accuracy only: it must not assert closure of ' +
      'G6_polymath15_bridge, must not change any bound, and must not reclassify ' +
      'the unproven conditional C_H <= 0.127 as rigorous.',
  },
];
