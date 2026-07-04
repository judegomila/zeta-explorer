/**
 * @module imp-33773-ecoll-sigma-offset-eflow-attribution
 *
 * imp-33773 (accuracy, frontier-direction): imp-33727 aligned the separated-E_coll
 * exponent ladder (imp-33620, magnitude p_ecoll) against the full-sigma OLS exponent
 * ladder (imp-33582, reproduced verbatim by imp-33730) on the shared decades k = 6..11,
 * reported the per-decade offset p_ecoll - p_sigma as a monotone-closing ramp, and
 * attributed the leading structure to the sigma-saturation masking factor (1 - sigma)
 * with the SUB-LEADING residual (the gap between the p_sigma/p_ecoll ratio and 1 - sigma)
 * described as "the near-peak E_flow term, which decays out". That attribution of the
 * residual to E_flow was asserted qualitatively but never MEASURED against the actual
 * E_flow contribution. This module tabulates the per-decade offset from BOTH source
 * ladders, confirms it shrinks monotonically toward the tail, and then TESTS the E_flow
 * attribution quantitatively.
 *
 * THE TWO LADDERS (identical inherited imp-3220/imp-3406 parts, no fresh model)
 * ----------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_trunc  = 3.06e-5 (N-independent fixed strip, imp-2631),
 *     E_coll   = C_C_PINNED sqrt(log T0 / N)  (GUE-conditional C_H),
 *     E_flow   = C_F (log T0 / T0) Gronwall,   C_F = (log(T0/2pi)+1)/2pi  (imp-398),
 *     T0       = effectiveHeightForN(N).
 *   Per decade [10^k, 10^(k+1)], k = 6..11:
 *     p_sigma  = -slope OLS(ln sigma vs ln N), 4 pts/decade  (imp-33582/imp-33730 defn),
 *     p_ecoll  = -d log E_coll / d log N over the endpoints  (imp-33620/imp-33727 defn),
 *     offset   = p_ecoll - p_sigma.
 *
 * THE E_FLOW TEST (the new measurement)
 * -------------------------------------
 *   Differentiating sigma gives the EXACT decomposition of the full-sigma exponent:
 *     p_sigma = p_ecoll * (1 - sigma)  +  (E_flow/E_N) * s_flow,   s_flow = d ln E_flow / d ln N,
 *   so the residual BELOW the leading (1 - sigma) masking model is
 *     resid_exp(k) = p_ecoll * (1 - sigma_hi) - p_sigma,
 *   and the term the cohort attributes it to is the E_flow contribution
 *     eflow_attr(k) = (E_flow/E_N) * |s_flow|   (evaluated at the decade upper endpoint).
 *   The E_flow attribution is correct only if resid_exp(k) tracks eflow_attr(k) in BOTH
 *   magnitude and shape.
 *
 * THE FINDING (measurement only -- REFINES the cohort attribution)
 * ---------------------------------------------------------------
 *   (M1) THE OFFSET REPRODUCES AND SHRINKS MONOTONICALLY. Recomputed from the same parts()
 *        as both sources, offset = p_ecoll - p_sigma = {0.4574, 0.4270, 0.3571, 0.2412,
 *        0.1232, 0.0500} -- byte-matching the imp-33727 diff ladder and strictly decreasing
 *        toward the tail, so the two ladders converge (both toward 1/2) as claimed.
 *   (M2) THE E_FLOW ATTRIBUTION OF THE SUB-LEADING RESIDUAL DOES NOT HOLD. The residual
 *        below the (1 - sigma) masking model is resid_exp = {2.39e-2, 3.29e-2, 5.49e-2,
 *        6.48e-2, 4.51e-2, 2.09e-2} -- a mid-range HUMP peaking at k = 9. The actual E_flow
 *        term eflow_attr = {1.12e-2, 4.71e-3, 1.60e-3, 3.96e-4, 7.23e-5, 1.08e-5} is
 *        MONOTONE-DECAYING and peaks at k = 6. They disagree in shape (hump vs monotone,
 *        argmax k = 9 vs k = 6) and in magnitude (E_flow is 2.1x too small near the peak and
 *        ~1900x too small in the tail). So the sub-leading offset residual is NOT the E_flow
 *        term the cohort names.
 *   (M3) THE RESIDUAL IS AN INTRA-DECADE SATURATION-CURVATURE ARTIFACT, NOT E_FLOW. p_sigma
 *        is an OLS slope over the whole decade while p_ecoll * (1 - sigma_hi) evaluates the
 *        masking factor only at the decade UPPER endpoint; sigma varies fastest across the
 *        E_coll = E_trunc crossover decade (k = 9, N ~ 3.28e9, sigma 0.6367 -> 0.3697 over
 *        [1e9,1e10]), so the endpoint (1 - sigma_hi) most understates the decade-averaged
 *        (1 - sigma) exactly there -- which is why the residual peaks at k = 9, at the
 *        crossover, and NOT at k = 6 where E_flow is largest. The correct attribution of the
 *        sub-leading offset residual is the intra-decade curvature of the saturation factor.
 *
 * The punchline: the imp-33727 offset ladder and its monotone tail-convergence reproduce
 * exactly, but the cohort attribution of the sub-leading residual to "the near-peak E_flow
 * term" is quantitatively refuted -- the E_flow term is monotone and 2x-1900x too small,
 * while the residual is a crossover-decade curvature hump. The leading (1 - sigma) masking
 * picture stands; the E_flow sub-attribution is corrected.
 *
 * MEASUREMENT / CROSS-CHECK ONLY. Cross-consistency + attribution diagnostic, NOT an RH
 * bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33727-sigma-ecoll-exponent-ladder-crossvalidation (offset ladder + E_flow claim tested here)
 * @see imp-33730-sigma-exponent-ladder-reproduction-residual (full-sigma ladder reproduction)
 * @see imp-33620-etrunc-ecoll-ladder-1e15-extension (separated-E_coll exponent ladder)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (full-sigma OLS exponent ladder)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form, exponent -> 1/2 from below)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33582/imp-33620/imp-33727)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33727/imp-33730 exactly

// EXACT inherited imp-3406/imp-33727/imp-33730 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_trunc: E_TRUNC_PT, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// imp-33582/imp-33730 definition: p_sigma = -slope of OLS(ln sigma vs ln N), 4 pts/decade.
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}

// imp-33620/imp-33727 definition (magnitude): p_ecoll = -d log E_coll / d log N over endpoints.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// s_flow = d ln E_flow / d ln N via a symmetric log-N central difference (small, negative).
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

const OVERLAP_DECADES = [6, 7, 8, 9, 10, 11];
const HALF = 0.5; // imp-3463 far-tail sqrt(1/N) asymptote both ladders ramp toward

// Per-decade table: offset, the leading (1 - sigma) masking model, its sub-leading residual,
// and the E_flow term the cohort attributes that residual to.
const OFFSET_LADDER = OVERLAP_DECADES.map((k) => {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const pMasked = pEcoll * (1 - ph.sigma); // leading masking model, endpoint (1 - sigma)
  const residExp = pMasked - pSigma; // sub-leading residual below the masking model
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi)); // E_flow contribution
  return {
    decade: `1e${k}->1e${k + 1}`,
    p_ecoll: +pEcoll.toFixed(4),
    p_sigma: +pSigma.toFixed(4),
    offset: +(pEcoll - pSigma).toFixed(4), // imp-33727 diff = p_ecoll - p_sigma
    residExp: +residExp.toExponential(4), // masking-model sub-leading residual
    eflowAttr: +eflowAttr.toExponential(4), // (E_flow/E_N) |s_flow| at endpoint
    residOverEflow: +(residExp / eflowAttr).toFixed(2), // how many x too small E_flow is
    oneMinusSigmaHi: +(1 - ph.sigma).toFixed(4),
  };
});

const OFFSETS = OFFSET_LADDER.map((r) => r.offset);
const RESIDS = OFFSET_LADDER.map((r) => r.residExp);
const EFLOWS = OFFSET_LADDER.map((r) => r.eflowAttr);
const OFFSET_HEAD = OFFSETS[0]; // ~0.4574 near the peak
const OFFSET_TAIL = OFFSETS[OFFSETS.length - 1]; // ~0.0500 by [1e11,1e12]
const OFFSET_MONOTONE_DOWN = OFFSETS.every((x, i) => i === 0 || x < OFFSETS[i - 1]);

// Argmax decades: residual is a hump peaking mid-range; E_flow is monotone, peaks at the head.
const RESID_ARGMAX_I = RESIDS.indexOf(Math.max(...RESIDS));
const EFLOW_ARGMAX_I = EFLOWS.indexOf(Math.max(...EFLOWS));
const RESID_ARGMAX_K = OVERLAP_DECADES[RESID_ARGMAX_I]; // 9 (E_coll = E_trunc crossover)
const EFLOW_ARGMAX_K = OVERLAP_DECADES[EFLOW_ARGMAX_I]; // 6 (E_flow largest near the peak)

// Published imp-33727 reference diff ladder (for the reuse gate).
const IMP33727_OFFSET_PUBLISHED = [0.4574, 0.427, 0.3571, 0.2412, 0.1232, 0.05];

export const IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION = {
  id: 'imp-33773',
  proofSection: 'S-frontier',
  question:
    'imp-33727 aligned the separated-E_coll exponent ladder and the full-sigma OLS exponent ' +
    'ladder (imp-33730 reproduction) on k = 6..11, reported the offset p_ecoll - p_sigma as a ' +
    'monotone-closing ramp, and attributed the sub-leading ratio residual to "the near-peak ' +
    'E_flow term". Tabulate the per-decade offset from both ladders, confirm it shrinks ' +
    'monotonically toward the tail, and TEST whether the residual magnitude and shape match the ' +
    'E_flow contribution the cohort attributes it to. Measurement/attribution only; NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'per decade [10^k,10^(k+1)], k=6..11: offset = p_ecoll - p_sigma; the (1 - sigma) masking ' +
    'model p_ecoll*(1 - sigma_hi); the sub-leading residual resid_exp = p_ecoll*(1 - sigma_hi) - ' +
    'p_sigma; and the E_flow contribution eflow_attr = (E_flow/E_N)*|s_flow| at the decade endpoint',
  farTailExponent: HALF,
  offsetLadder: OFFSET_LADDER,
  offset: {
    head_1e6_1e7: OFFSET_HEAD, // ~0.4574
    tail_1e11_1e12: OFFSET_TAIL, // ~0.0500
    monotone_closing: OFFSET_MONOTONE_DOWN,
  },
  eflowTest: {
    resid_ladder: RESIDS, // hump: {2.39e-2 .. 6.48e-2 (k=9) .. 2.09e-2}
    eflow_ladder: EFLOWS, // monotone: {1.12e-2 .. 1.08e-5}
    resid_argmax_k: RESID_ARGMAX_K, // 9 (crossover decade)
    eflow_argmax_k: EFLOW_ARGMAX_K, // 6 (E_flow largest)
    resid_over_eflow_head: OFFSET_LADDER[0].residOverEflow, // ~2.13
    resid_over_eflow_tail: OFFSET_LADDER[OFFSET_LADDER.length - 1].residOverEflow, // ~1928
    attribution_holds: false, // the E_flow attribution is refuted (wrong shape and magnitude)
  },
  finding: {
    M1_offset_reproduces_and_shrinks:
      'offset = p_ecoll - p_sigma = {0.4574,0.4270,0.3571,0.2412,0.1232,0.0500} byte-matches the ' +
      'imp-33727 diff ladder and is strictly decreasing toward the tail -- the two ladders converge ' +
      'toward 1/2 as the cohort claims.',
    M2_eflow_attribution_fails:
      'The residual below the (1 - sigma) masking model is resid_exp = {2.39e-2,3.29e-2,5.49e-2,' +
      '6.48e-2,4.51e-2,2.09e-2}, a mid-range HUMP peaking at k=9. The actual E_flow term ' +
      'eflow_attr = {1.12e-2,4.71e-3,1.60e-3,3.96e-4,7.23e-5,1.08e-5} is MONOTONE-DECAYING and ' +
      'peaks at k=6. They disagree in shape (hump vs monotone; argmax k=9 vs k=6) and magnitude ' +
      '(E_flow is 2.1x too small at the head, ~1900x too small in the tail), so the sub-leading ' +
      'offset residual is NOT the E_flow term the cohort names.',
    M3_residual_is_saturation_curvature:
      'p_sigma is an OLS slope over the whole decade while p_ecoll*(1 - sigma_hi) uses the masking ' +
      'factor only at the decade upper endpoint; sigma varies fastest across the E_coll = E_trunc ' +
      'crossover decade (k=9, N ~ 3.28e9, sigma 0.6367 -> 0.3697 over [1e9,1e10]), so the endpoint ' +
      '(1 - sigma_hi) most understates the decade-averaged (1 - sigma) exactly there -- which is why ' +
      'the residual peaks at k=9 (the crossover) and not at k=6 (where E_flow is largest). The ' +
      'sub-leading offset residual is the intra-decade curvature of the saturation factor, not E_flow.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / ATTRIBUTION (frontier-direction, NOT rigorous). The per-decade offset ' +
    'p_ecoll - p_sigma reproduces the imp-33727 diff ladder verbatim ({0.4574 -> 0.0500}) and ' +
    'shrinks strictly monotonically toward the tail, so the two ladders converge toward 1/2 as ' +
    'claimed. But the cohort attribution of the sub-leading residual to "the near-peak E_flow ' +
    'term" is REFUTED quantitatively: the residual below the (1 - sigma) masking model is a ' +
    'mid-range hump peaking at the E_coll = E_trunc crossover decade (k=9, ~6.48e-2), while the ' +
    'actual E_flow contribution (E_flow/E_N)*|s_flow| is monotone-decaying, peaks at k=6, and is ' +
    '2.1x-1900x too small -- wrong shape and wrong magnitude. The residual is instead the ' +
    'intra-decade curvature of the saturation factor (the OLS decade-slope vs endpoint-evaluated ' +
    '(1 - sigma) mismatch), largest where sigma varies fastest. The leading (1 - sigma) masking ' +
    'picture stands; the E_flow sub-attribution is corrected. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 ' +
    'K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33727 (offset ladder + E_flow attribution tested here); imp-33730 (full-sigma ladder ' +
    'reproduction); imp-33620 (separated-E_coll exponent ladder); imp-33582 (full-sigma OLS ladder); ' +
    'imp-3444 (E_coll = E_trunc crossover N ~ 3.280e9); imp-3463 (far-tail exponent -> 1/2 from ' +
    'below); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip route); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION_ASSERTIONS = [
  {
    // (M1) Reuse gate: the recomputed offset ladder reproduces the imp-33727 diff to <5e-4.
    id: 'imp33773-offset-reproduces-imp33727',
    description: 'offset p_ecoll - p_sigma matches the imp-33727 diff ladder to the printed 4 decimals',
    holds: () => OFFSETS.every((v, i) => Math.abs(v - IMP33727_OFFSET_PUBLISHED[i]) < 5e-4),
  },
  {
    // (M1) The offset shrinks strictly monotonically from ~0.4574 to ~0.0500 toward the tail.
    id: 'imp33773-offset-monotone-shrinking',
    description: 'offset strictly decreasing, head ~0.4574, tail ~0.0500',
    holds: () =>
      OFFSET_MONOTONE_DOWN &&
      Math.abs(OFFSET_HEAD - 0.4574) < 5e-4 &&
      Math.abs(OFFSET_TAIL - 0.05) < 5e-4 &&
      OFFSET_HEAD > OFFSET_TAIL,
  },
  {
    // (M2) Shape mismatch: the masking-model residual is a hump (interior argmax at k=9),
    // while the E_flow term is monotone-decaying (argmax at the head, k=6).
    id: 'imp33773-eflow-shape-mismatch',
    description: 'residual peaks at k=9 (interior hump); E_flow term peaks at k=6 and is monotone-decaying',
    holds: () => {
      const eflowMonoDown = EFLOWS.every((x, i) => i === 0 || x < EFLOWS[i - 1]);
      const residHump = RESID_ARGMAX_I > 0 && RESID_ARGMAX_I < RESIDS.length - 1;
      return RESID_ARGMAX_K === 9 && EFLOW_ARGMAX_K === 6 && eflowMonoDown && residHump;
    },
  },
  {
    // (M2) Magnitude mismatch: the E_flow term is everywhere far too small to be the residual,
    // by ~2x at the head growing to ~3 orders of magnitude in the tail.
    id: 'imp33773-eflow-magnitude-too-small',
    description: 'E_flow term is 2x-1900x smaller than the residual it is claimed to explain, gap grows into the tail',
    holds: () => {
      const ratios = OFFSET_LADDER.map((r) => r.residOverEflow);
      const allBig = ratios.every((x) => x > 2);
      const tailBiggerThanHead = ratios[ratios.length - 1] > ratios[0];
      return allBig && tailBiggerThanHead && ratios[ratios.length - 1] > 1000;
    },
  },
  {
    // (M3) The residual peaks at the E_coll = E_trunc crossover decade, where sigma swings most
    // across the decade (0.6367 -> 0.3697 over [1e9,1e10]), NOT at the E_flow-largest decade.
    id: 'imp33773-residual-peaks-at-crossover',
    description: 'residual hump argmax (k=9) is the crossover decade where sigma swings most, not the E_flow-peak decade (k=6)',
    holds: () => {
      const sigLo = sigma(1e9);
      const sigHi = sigma(1e10);
      const bracketsHalf = sigLo > 0.5 && sigHi < 0.5; // E_coll = E_trunc crossover inside k=9
      return RESID_ARGMAX_K === 9 && RESID_ARGMAX_K !== EFLOW_ARGMAX_K && bracketsHalf;
    },
  },
  {
    // Honesty gate: measurement/attribution only, far-tail exponent = 1/2, no QED, PT SOTA.
    id: 'imp33773-honesty-gate-no-qed',
    description: 'Measurement only: far-tail exponent = 1/2, isRigorous false, E_flow attribution refuted, no QED, PT SOTA',
    holds: () =>
      IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION.isRigorous === false &&
      IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION.farTailExponent === 0.5 &&
      IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION.eflowTest.attribution_holds === false &&
      /NO QED/.test(IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION.verdict) &&
      /remains SOTA/.test(IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION.verdict),
  },
];

for (const a of IMP33773_ECOLL_SIGMA_OFFSET_EFLOW_ATTRIBUTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33773-ecoll-sigma-offset-eflow-attribution assertion failed: ${a.id}`);
  }
}
