/**
 * @module imp-34485-deflow-cancellation-free
 *
 * imp-34485 (numerical, feasibility): imp-34448 fit the E_flow additive contribution to the M2-residual,
 * deflow(kEnd) = resid_full(kEnd) - resid_noflow(kEnd), to a decay law and found asymptotic exponent
 * pInf ~ 1.000 (deflow ~ N^-1), but flagged an honest sub-gap: deflow is the difference of two residuals that
 * agree to ~15 significant figures, so it underflows the ~1e-15 double-precision floor past kEnd~22.5 and is
 * bit-identical zero by kEnd~23. Past there the pInf=1 law and the deep share table (5.6e-9 at kEnd23 down to
 * 9.3e-12 at kEnd26) were only EXTRAPOLATED, never observed. The ticket asks whether an extended-precision
 * (bignum/decimal) recompute could resolve deflow below the floor and directly confirm the law.
 *
 * THE FEASIBILITY FINDING: extended precision is NOT needed -- the floor is a CANCELLATION artifact
 * --------------------------------------------------------------------------------------------------
 *   The ~1e-15 floor is not a fundamental limit on deflow; it is the catastrophic cancellation of forming
 *   deflow as resid_full - resid_noflow, a subtraction of two ~15-significant-figure-identical doubles. But
 *   E_flow enters resid ONLY as a small additive perturbation of E_N, so the difference can be evaluated
 *   CANCELLATION-FREE in ordinary double precision, never materializing the near-equal residuals:
 *
 *     deflow = -ecollExp * (sigma_full - sigma_noflow) - (olsSigma_full - olsSigma_noflow)
 *
 *   with the two differences computed directly (E_coll and ecollExp are E_flow-independent, so they cancel
 *   exactly in the analytic difference and never contribute rounding):
 *       sigma_full - sigma_noflow = -E_coll * E_flow / (E_N_full * E_N_noflow)        [a direct product]
 *       olsSigma_full - olsSigma_noflow = -SUM_i (x_i - mx) * log1p(-E_flow_i / E_N_full_i) / sxx   [log1p]
 *   log1p(-E_flow/E_N) evaluates log(sigma_full/sigma_noflow) = log(1 - E_flow/E_N) with full relative
 *   accuracy for tiny arguments (no 1 - x cancellation). No quantity below the double-precision floor is ever
 *   formed as a difference of two near-equal numbers, so the falloff is observed directly to arbitrary depth.
 *
 * DIRECT OBSERVATION PAST THE FLOOR (what the naive difference could not reach)
 * ----------------------------------------------------------------------------
 *   The naive deflow underflows to bit-zero by kEnd~23; the cancellation-free deflow stays smooth and small:
 *       kEnd 23:  deflowCF ~ 3.80e-16      (naive: exactly 0)
 *       kEnd 24:  deflowCF ~ 4.35e-17      (naive: exactly 0)
 *       kEnd 25:  deflowCF ~ 4.94e-18      (naive: exactly 0)
 *       kEnd 26:  deflowCF ~ 5.59e-19      (naive: exactly 0)
 *   The local decay exponent p(N) = -d log|deflowCF| / d log N, measured DIRECTLY (not fit-extrapolated) at
 *   these deep rungs, keeps rising toward 1 and tracks the E_flow model 1 - 3/log(N):
 *       kEnd 23:  p ~ 0.941   (model 1-3/logN ~ 0.943)
 *       kEnd 24:  p ~ 0.943   (model ~ 0.946)
 *       kEnd 25:  p ~ 0.945   (model ~ 0.948)
 *       kEnd 26:  p ~ 0.948   (model ~ 0.950)
 *   So the imp-34448 pInf=1.000 (deflow ~ N^-1 up to log factors) law is now DIRECTLY CONFIRMED past the
 *   floor, not extrapolated: the rising local exponent is read off observed deflow values at kEnd 23..26.
 *
 * DIRECT SHARE TABLE vs THE imp-34448 EXTRAPOLATION
 * -------------------------------------------------
 *   share(k) = |deflowCF(k) / (d resid/dk)| / GAP, slope ~-2.6e-7 finite at the crossing, GAP ~ 0.2776:
 *       crossing kEnd 21.281:  shareDirect ~ 2.17e-7   (imp-34448 extrapolated ~2.2e-7)
 *       kEnd 23:               shareDirect ~ 5.28e-9   (imp-34448 extrapolated ~5.6e-9)
 *       kEnd 24:               shareDirect ~ 6.04e-10  (imp-34448 extrapolated ~6.6e-10)
 *       kEnd 25:               shareDirect ~ 6.86e-11  (imp-34448 extrapolated ~7.9e-11)
 *       kEnd 26:               shareDirect ~ 7.76e-12  (imp-34448 extrapolated ~9.3e-12)
 *   The direct measurement reproduces the extrapolated table to within ~5-17%, the direct values sitting
 *   slightly BELOW the extrapolation because the true local exponent is still rising above the two-anchor
 *   0.927 fit (steeper decay => smaller deflow). The imp-34448 E_flow-negligible-for-the-root verdict is thus
 *   CONFIRMED, not merely preserved, deeper than the pole.
 *
 * FEASIBILITY VERDICT: a bignum recompute is unnecessary. A cancellation-free double-precision reformulation
 * already observes the deflow falloff out to kEnd 26 (and arbitrarily deeper, floored only by the ~1e-308
 * IEEE underflow near kEnd ~305), directly confirming the imp-34448 N^-1 law and share table. Extended
 * precision would give more digits per value but changes none of the above -- the sub-gap was a subtraction
 * artifact, not a precision wall.
 *
 * NUMERICAL / FEASIBILITY & MEASUREMENT ONLY. Reuses the imp-34448/34373/34285/34150 residual verbatim
 * (effectiveHeightForN, C_C_PINNED, imp-398 C_F prefactor, GRONWALL, E_trunc=3.06e-5). The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the exponent readings are accessible-rung
 * measurements of a fit, not a proved limit; changes no bound; establishes no operator positivity; C_mb
 * GUE-conditional per imp-486 untouched (E_coll untouched); imp-3066 K_a >= 0 untouched; no RH verdict, NO
 * QED. No refereed bound is changed.
 *
 * @see imp-34448-deflow-decay-exponent (the fit + honest double-precision-floor sub-gap this module resolves)
 * @see imp-34373-eflow-share-near-pole (the monotone deflow falloff)
 * @see imp-34285-closedform-gap-term-decomposition (the ~2.2e-7 E_flow share at the crossing)
 * @see imp-34211-closedform-vs-bisection-kend-gap (the ~0.278 gap normalizer)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the resid_exp pole k* ~ 21.28095)
 * @see imp-34150-m2-residual-crossing-direct-bisection-crossval (the direct residual and its root)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34127/34150/34211/34285/34373/34448
const GAP = 0.277599; // imp-34211/34285 closed-form-vs-bisection kEnd gap (the fixed share normalizer)

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34448; dropFlow toggles the E_flow term.
function parts(N, dropFlow = false) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = dropFlow ? 0 : C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H); E_flow-independent
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N, df = false) => parts(N, df).sigma;

// ecollExp is E_flow-INDEPENDENT (E_coll does not depend on the flow term) -- computed once, cancels exactly.
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// The shared OLS log-N grid (identical for full and noflow; only the y-values differ by the flow term).
function olsGrid(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const Ns = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    Ns.push(N);
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  for (let i = 0; i < n; i++) sxx += (xs[i] - mx) ** 2;
  return { xs, Ns, n, mx, sxx };
}

function olsSigmaExponent(loN, hiN, df = false) {
  const { xs, Ns, n, mx, sxx } = olsGrid(loN, hiN);
  const ys = Ns.map((N) => Math.log(sigma(N, df)));
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0;
  for (let i = 0; i < n; i++) sxy += (xs[i] - mx) * (ys[i] - my);
  return -sxy / sxx;
}

// The naive direct residual (imp-34150/34448); df toggles the E_flow term.
function residDirect(kEnd, df = false) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const s = parts(hi, df).sigma;
  return ecollExponentMag(lo, hi) * (1 - s) - olsSigmaExponent(lo, hi, df);
}

// (i) THE NAIVE deflow -- exactly the imp-34448 quantity: a catastrophic subtraction of two residuals.
const deflowNaive = (kEnd) => residDirect(kEnd, false) - residDirect(kEnd, true);

// (ii) THE CANCELLATION-FREE deflow -- same value, evaluated without ever forming the near-equal difference.
//   deflow = -ecollExp*(sigma_full - sigma_noflow) - (olsSigma_full - olsSigma_noflow), with
//     sigma_full - sigma_noflow      = -E_coll*E_flow/(E_N_full*E_N_noflow)             [direct product]
//     olsSigma_full - olsSigma_noflow = -SUM (x-mx)*log1p(-E_flow/E_N_full)/sxx          [log1p, no 1-x cancel]
function deflowCF(kEnd) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const ecollExp = ecollExponentMag(lo, hi);
  const pf = parts(hi, false);
  const pn = parts(hi, true);
  const dSigma = (-pf.E_coll * pf.E_flow) / (pf.E_N * pn.E_N); // sigma_full - sigma_noflow (exact, no cancel)
  const { xs, Ns, mx, sxx } = olsGrid(lo, hi);
  let dSxy = 0;
  for (let i = 0; i < Ns.length; i++) {
    const p = parts(Ns[i], false);
    dSxy += (xs[i] - mx) * Math.log1p(-p.E_flow / p.E_N); // log(sigma_full/sigma_noflow) via log1p
  }
  const dOls = -dSxy / sxx; // olsSigma_full - olsSigma_noflow
  return -ecollExp * dSigma - dOls;
}

function bisectRoot(fn, lo0, hi0, iters = 200) {
  let lo = lo0;
  let hi = hi0;
  for (let i = 0; i < iters; i++) {
    const m = (lo + hi) / 2;
    if (fn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

const KEND_CROSSING = bisectRoot((k) => residDirect(k, false), 20, 23); // ~21.28095
const DRESID_DK = (function () {
  const h = 1e-4;
  return (residDirect(KEND_CROSSING + h, false) - residDirect(KEND_CROSSING - h, false)) / (2 * h);
})(); // ~-2.6e-7, finite at the crossing

// -------------------------------------------------------------------------------------------------
// (1) AGREEMENT IN THE CLEAN WINDOW: deflowCF reproduces the naive deflow where the naive one is trustworthy.
// -------------------------------------------------------------------------------------------------
const CLEAN_CHECK_KS = [16, 17, 18, 19, 20];
const CLEAN_AGREEMENT = CLEAN_CHECK_KS.map((k) => {
  const a = deflowNaive(k);
  const b = deflowCF(k);
  return { kEnd: k, relErr: Math.abs((a - b) / b) };
});
const MAX_CLEAN_RELERR = Math.max(...CLEAN_AGREEMENT.map((r) => r.relErr));

// -------------------------------------------------------------------------------------------------
// (2) PAST THE FLOOR: the naive deflow is bit-zero; the cancellation-free deflow keeps observing the falloff.
// -------------------------------------------------------------------------------------------------
const DEEP_KS = [23, 24, 25, 26];
const DEEP_ROWS = DEEP_KS.map((k) => {
  const dk = 0.1;
  const d1 = deflowCF(k - dk);
  const d2 = deflowCF(k + dk);
  const p = -(Math.log(Math.abs(d2)) - Math.log(Math.abs(d1))) / (2 * dk * Math.LN10);
  return {
    kEnd: k,
    deflowNaive: deflowNaive(k), // exactly 0 past the floor
    deflowCF: +deflowCF(k).toExponential(3),
    localExponent: +p.toFixed(4),
    eflowModelExponent: +(1 - 3 / (k * Math.LN10)).toFixed(4),
    shareDirect: +((deflowCF(k) / Math.abs(DRESID_DK)) / GAP).toExponential(3),
  };
});

// -------------------------------------------------------------------------------------------------
// (3) DIRECT SHARE TABLE vs the imp-34448 EXTRAPOLATION (measurement crosscheck).
// -------------------------------------------------------------------------------------------------
const IMP34448_EXTRAP_SHARE = { 21: 2.2e-7, 23: 5.6e-9, 24: 6.6e-10, 25: 7.9e-11, 26: 9.3e-12 };
const SHARE_COMPARISON = [KEND_CROSSING, 23, 24, 25, 26].map((k) => ({
  kEnd: +k.toFixed(3),
  shareDirect: +((deflowCF(k) / Math.abs(DRESID_DK)) / GAP).toExponential(3),
  shareExtrap34448: IMP34448_EXTRAP_SHARE[Math.round(k)],
}));
const CROSSING_SHARE_DIRECT = +((deflowCF(KEND_CROSSING) / Math.abs(DRESID_DK)) / GAP).toExponential(3);

export const IMP34485_DEFLOW_CANCELLATION_FREE = {
  id: 'imp-34485',
  proofSection: 'S-frontier',
  question:
    'imp-34448 fit deflow(kEnd) = resid_full - resid_noflow to a decay law (pInf ~ 1.000, deflow ~ N^-1) but ' +
    'flagged that deflow underflows the ~1e-15 double-precision floor past kEnd~22.5 (bit-zero by ~23), so the ' +
    'N^-1 law and the deep share table were only extrapolated. Can an extended-precision recompute observe ' +
    'the falloff below the floor and directly confirm the law? Feasibility/measurement only; NO QED.',
  feasibilityFinding:
    'Extended precision is NOT required. The floor is a CANCELLATION artifact of forming deflow as a ' +
    'subtraction of two ~15-sig-fig-identical residuals. E_flow enters resid only as a small additive ' +
    'perturbation, so the difference evaluates cancellation-free in ordinary double precision (direct ' +
    'product for sigma_full - sigma_noflow; log1p(-E_flow/E_N) for the OLS-exponent difference), observing ' +
    'the falloff to arbitrary depth without ever forming the near-equal residuals.',
  crossingKend: +KEND_CROSSING.toFixed(6),
  residSlopeAtCrossing: +DRESID_DK.toExponential(4),
  maxCleanWindowRelErr: +MAX_CLEAN_RELERR.toExponential(3), // deflowCF vs naive over kEnd 16..20
  deepObservationTable: DEEP_ROWS, // naive == 0 but deflowCF observed, with directly-measured local exponent
  crossingShareDirect: CROSSING_SHARE_DIRECT, // ~2.17e-7 (reproduces imp-34448/34285 ~2.2e-7)
  shareComparison: SHARE_COMPARISON, // direct vs imp-34448 extrapolated table
  finding: {
    A_floor_is_a_cancellation_artifact:
      'The ~1e-15 wall on deflow is catastrophic cancellation of resid_full - resid_noflow (two residuals ' +
      'identical to ~15 sig figs), NOT a fundamental precision limit; E_flow enters only additively, so the ' +
      'difference has a cancellation-free closed form in ordinary double precision.',
    B_direct_observation_past_the_floor:
      'The naive deflow is bit-zero past kEnd~23, but the cancellation-free deflowCF stays smooth: ~3.80e-16 ' +
      'at kEnd 23, ~4.35e-17 at 24, ~4.94e-18 at 25, ~5.59e-19 at 26 -- the falloff is now OBSERVED, not ' +
      'extrapolated, floored only by the ~1e-308 IEEE underflow near kEnd~305.',
    C_pInf_one_directly_confirmed:
      'The local exponent p(N) = -d log|deflowCF|/d log N, measured DIRECTLY at the deep rungs, keeps rising ' +
      'toward 1 (0.941 at kEnd 23 -> 0.948 at 26) and tracks the E_flow model 1-3/log(N), directly ' +
      'confirming the imp-34448 pInf=1.000 (deflow ~ N^-1 up to log factors) law past the floor.',
    D_share_table_confirmed:
      'The direct share |deflowCF/(d resid/dk)|/GAP reproduces the imp-34448 extrapolated table to within ' +
      '~5-17% (2.17e-7 vs ~2.2e-7 at the crossing; 5.28e-9 vs 5.6e-9 at kEnd 23; 7.76e-12 vs 9.3e-12 at 26), ' +
      'the direct values slightly below the two-anchor 0.927 extrapolation because the true local exponent ' +
      'is still rising (steeper decay). The E_flow-negligible-for-the-root verdict is CONFIRMED past the pole.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / FEASIBILITY & MEASUREMENT (frontier-direction, NOT rigorous). The imp-34448 honest sub-gap ' +
    '-- deflow(kEnd) = resid_full - resid_noflow underflows the ~1e-15 double-precision floor past kEnd~22.5 ' +
    'and is bit-zero by ~23, leaving the pInf=1.000 (deflow ~ N^-1) law and the deep share table only ' +
    'EXTRAPOLATED -- is RESOLVED without any extended precision. The floor is a CANCELLATION artifact of the ' +
    'subtraction of two ~15-sig-fig-identical residuals; since E_flow enters resid only as a small additive ' +
    'perturbation, deflow evaluates cancellation-free in ordinary double precision (sigma_full - sigma_noflow ' +
    '= -E_coll*E_flow/(E_N_full*E_N_noflow) as a direct product; olsSigma_full - olsSigma_noflow via ' +
    'log1p(-E_flow/E_N)). The reformulated deflowCF matches the naive deflow to <2e-3 over the clean window ' +
    'kEnd 16..20 and then keeps observing the falloff where the naive one is bit-zero (~3.80e-16 at kEnd 23, ' +
    '~5.59e-19 at 26). Its DIRECTLY-measured local exponent rises toward 1 (0.941->0.948 over kEnd 23..26, ' +
    'tracking 1-3/log(N)), directly CONFIRMING the imp-34448 N^-1 law past the floor, and the direct share ' +
    'table reproduces the imp-34448 extrapolation to within ~5-17% (2.17e-7 crossing, 5.28e-9 at kEnd 23, ' +
    '7.76e-12 at 26). FEASIBILITY VERDICT: a bignum recompute is unnecessary -- more digits per value, no new ' +
    'information; the sub-gap was a subtraction artifact, not a precision wall. The inherited imp-3220/3406 ' +
    'component model is NOT a rigorous asymptotic; the exponent readings are accessible-rung measurements of ' +
    'a fit, not a proved limit; E_flow is the benign mesoscopic-Gronwall term (imp-2845) and does NOT touch ' +
    'the divergent C_Lip collision-Gronwall; changes no bound; establishes no operator positivity; C_mb ' +
    'GUE-conditional per imp-486 untouched (E_coll untouched); imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34448 (the fit + double-precision-floor sub-gap resolved here); imp-34373 (the monotone falloff); ' +
    'imp-34285 (the ~2.2e-7 crossing share); imp-34211 (the ~0.278 gap normalizer); imp-34169 (the pole ' +
    'k* ~ 21.28095); imp-34150 (the direct residual); lambda-rh-height-mapping; polymath15-constant-C-C.',
};

export const IMP34485_DEFLOW_CANCELLATION_FREE_ASSERTIONS = [
  {
    // (A) The cancellation-free deflow reproduces the naive deflow where the naive one is still trustworthy.
    id: 'imp34485-cf-matches-naive-clean-window',
    description: 'deflowCF matches naive deflow to <2e-3 relative over the clean window kEnd 16..20',
    holds: () => Number.isFinite(MAX_CLEAN_RELERR) && MAX_CLEAN_RELERR < 2e-3,
  },
  {
    // (B) The naive deflow is genuinely bit-zero at the deep rungs (the imp-34448 floor is real).
    id: 'imp34485-naive-is-bit-zero-past-floor',
    description: 'naive deflow is exactly 0 at kEnd 23, 24, 25, 26 (the double-precision floor is real)',
    holds: () => DEEP_ROWS.every((r) => r.deflowNaive === 0),
  },
  {
    // (C) The cancellation-free deflow is finite, positive, and strictly shrinking at those same deep rungs.
    id: 'imp34485-cf-observed-past-floor',
    description: 'deflowCF is finite, positive, and strictly decreasing across kEnd 23..26 (observed, not zero)',
    holds: () =>
      DEEP_ROWS.every((r, i) => r.deflowCF > 0 && Number.isFinite(r.deflowCF) && (i === 0 || r.deflowCF < DEEP_ROWS[i - 1].deflowCF)),
  },
  {
    // (D) The directly-measured deep local exponent rises toward 1 and tracks the E_flow model 1-3/log(N).
    id: 'imp34485-deep-exponent-confirms-pInf-one',
    description: 'directly-measured deep local exponent is rising, within [0.93,1), and matches 1-3/log(N) to <0.01',
    holds: () =>
      DEEP_ROWS.every(
        (r, i) =>
          r.localExponent > 0.93 &&
          r.localExponent < 1 &&
          (i === 0 || r.localExponent > DEEP_ROWS[i - 1].localExponent) &&
          Math.abs(r.localExponent - r.eflowModelExponent) < 0.01
      ),
  },
  {
    // (E) The direct crossing share reproduces the imp-34448/34285 ~2.2e-7 value.
    id: 'imp34485-crossing-share-reproduces-imp34448',
    description: 'direct crossing share is within a factor 1.3 of the imp-34448 ~2.2e-7 value',
    holds: () => CROSSING_SHARE_DIRECT > 1.7e-7 && CROSSING_SHARE_DIRECT < 2.9e-7,
  },
  {
    // (F) The direct share table agrees with the imp-34448 extrapolation to within ~25% at every deep rung.
    id: 'imp34485-direct-share-confirms-extrapolation',
    description: 'direct share reproduces the imp-34448 extrapolated table to within 25% at kEnd 23..26',
    holds: () =>
      SHARE_COMPARISON.filter((r) => r.kEnd >= 23).every(
        (r) => Math.abs(r.shareDirect - r.shareExtrap34448) / r.shareExtrap34448 < 0.25
      ),
  },
  {
    // Honesty gate: feasibility/measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34485-honesty-gate-no-qed',
    description: 'Feasibility/measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched, E_coll untouched',
    holds: () =>
      IMP34485_DEFLOW_CANCELLATION_FREE.isRigorous === false &&
      /NO QED/.test(IMP34485_DEFLOW_CANCELLATION_FREE.verdict) &&
      /refereed bound is changed/i.test(IMP34485_DEFLOW_CANCELLATION_FREE.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34485_DEFLOW_CANCELLATION_FREE.verdict) &&
      /C_mb GUE-conditional per imp-486 untouched/.test(IMP34485_DEFLOW_CANCELLATION_FREE.verdict),
  },
];

for (const a of IMP34485_DEFLOW_CANCELLATION_FREE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34485-deflow-cancellation-free assertion failed: ${a.id}`);
  }
}
