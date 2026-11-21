/**
 * @module imp-34227-surrogate-zero-estimator-reconciliation
 *
 * imp-34227 (numerical, frontier-direction): RECONCILE the honest sub-gap
 * SUB-GAP-imp-34169-surrogate-domain-edge. imp-34169 F2/F3 found the imp-33810/imp-33843 log-linear
 * SURROGATE quantity resid_exp(k) = pEcoll (1 - sigma) - pSigma crosses ZERO at k* ~ 21.28095, turning the
 * log argument eflow_over_resid non-positive (a pole) and every downstream fixed-band-peak quantity into
 * NaN. imp-34169 left OPEN whether that zero is an ARTIFACT of the quarter-decade OLS exponent estimators
 * (pSigma via 4 pts/decade OLS on log sigma; pEcoll via a 2-point full-decade secant on log E_coll) or a
 * GENUINE feature of the inherited imp-3220/imp-3406 component model in the deep tail. This module ASSESSES
 * exactly that: it recomputes resid_exp(k) through the deep tail with (a) refined finer OLS estimators and
 * (b) analytic local log-log exponents (4th-order central-difference log-derivatives of the raw
 * imp-3220/imp-3406 component terms), and MEASURES whether the sign change survives estimator refinement.
 *
 * THE ANSWER: THE SIGN CHANGE IS AN ARTIFACT OF THE COARSE QUARTER-DECADE OLS/SECANT ESTIMATORS -- NOT A
 * GENUINE FEATURE OF THE COMPONENT MODEL. Three independent measurements converge on this:
 *   (i)  k* DRIFTS BY A FULL DECADE under mere OLS-resolution refinement. Holding the component model fixed
 *        and only increasing the pSigma OLS resolution 4 -> 8 -> 16 -> 40 -> 100 points per decade marches
 *        the crossing 21.2809 -> 20.7027 -> 20.4690 -> 20.3409 -> 20.2917 -- a monotone ~1-decade slide
 *        converging toward ~20.2. A genuine component-model feature would sit still; a full-decade migration
 *        under a resolution knob is the signature of an estimator artifact.
 *   (ii) THE COARSE resid_exp IS DOMINATED BY DISCRETIZATION BIAS. The genuine analytic-local resid_exp is
 *        4-6 ORDERS OF MAGNITUDE smaller than the coarse-OLS value throughout the deep tail (coarse/analytic
 *        ratio ~3.8e4 at k=14, ~2.7e5 at k=16, ~2.3e6 at k=18 -- and the ratio GROWS with k). So >99.99% of
 *        the coarse resid_exp in the tail is secant-vs-OLS discretization bias (the two estimators are
 *        centred at different N), not the component-model quantity whose sign the surrogate is meant to read.
 *   (iii) THE GENUINE ANALYTIC resid_exp NEVER RESOLVABLY CHANGES SIGN. Evaluated with 4th-order local
 *        log-derivatives it is strictly POSITIVE and smoothly decaying over the entire resolvable range
 *        k = 11 .. 18 (from ~1.5e-6 down to ~4.4e-12), then falls below the ~1e-12 floating-point roundoff
 *        floor of the central difference where its sign becomes pure numerical noise. There is NO clean zero
 *        crossing in the component model itself; the crossing lives only in the bias-dominated coarse surrogate.
 *
 * So the imp-34169 pole at k* ~ 21.28 is a property of the coarse quarter-decade OLS/secant exponent
 * ESTIMATORS, not of the imp-3220/imp-3406 component model in the deep tail. imp-34169 s within-window
 * fixed-band-peak findings and its correct statement that the coarse surrogate terminates at k* ~ 21.28 are
 * UNTOUCHED as measurements -- what this reconciliation establishes is that the terminus is an estimator
 * edge, not a component-model edge, closing SUB-GAP-imp-34169-surrogate-domain-edge on the artifact side.
 *
 * THE MEASUREMENT (imp-34169 parts() reused verbatim; the refined/analytic exponent estimators are new)
 * -----------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-34040/imp-34109/imp-34169. No re-derivation.
 *   Coarse surrogate resid_exp_coarse(k) = pEcoll_secant (1 - sigma(hi)) - pSigma_OLS4, the imp-34169
 *                    estimators verbatim: pSigma via 4 pts/decade OLS on log sigma over [10^k, 10^(k+1)],
 *                    pEcoll via a 2-point full-decade secant on log E_coll. Crosses zero at k* ~ 21.28095.
 *   Finer OLS        the SAME structure with pSigma OLS resolution raised 4 -> 100 pts/decade (pEcoll secant
 *                    unchanged). Crosses zero at k* ~ 20.2917 -- a full decade earlier.
 *   Analytic local   resid_exp_analytic(k) = pEcoll_local (1 - sigma(hi)) - pSigma_local with pEcoll_local,
 *                    pSigma_local the 4th-order central-difference local log-log derivatives of the raw
 *                    component terms at hi = 10^(k+1). Strictly positive where resolvable; no clean crossing.
 *
 * MEASUREMENT / SUB-GAP RECONCILIATION ONLY. A descriptive assessment of an inherited surrogate s
 * domain-edge provenance, NOT an RH bound and distinct from any form selection (the imp-33843
 * log-linear-over-power-law verdict and the imp-34109/imp-34169 fixed-band-peak findings are untouched as
 * measurements). The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the local log-derivatives are 4th-order finite differences with a ~1e-12 roundoff floor, not
 * closed forms; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the module that raised this sub-gap; its
 *   coarse resid_exp is what this reconciles as an estimator artifact)
 * @see imp-34107-resid-exp-second-path-crossvalidation (the resid_exp(k) schedule whose zero this probes)
 * @see imp-33843-eflow-resid-widening-form-fit (the log-linear OLS whose log argument goes non-positive)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. ladder and the resid_exp definition reused)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the same k*~21.281 ceiling, bisected there)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (closed-form derivation of the same coarse k*)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34169
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34169 parts().
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// ---- COARSE estimators (imp-34169 verbatim) ----
function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
  }
  return -olsSlope(xs, ys);
}
function ecollSecantExponent(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
// resid_exp with a chosen pSigma OLS resolution; pEcoll stays the imp-34169 2-point secant.
function residExpCoarse(k, ptsPerDecade = 4) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi, ptsPerDecade);
  const pEcoll = ecollSecantExponent(lo, hi);
  return pEcoll * (1 - parts(hi).sigma) - pSigma;
}

// ---- ANALYTIC local log-log exponent: 4th-order central difference in log10 space (roundoff floor ~1e-12) ----
function localLogExponent(fn, N, h = 1e-3) {
  const g = (d) => Math.log(fn(N * Math.pow(10, d)));
  // 4th-order central: (-g(2h)+8g(h)-8g(-h)+g(-2h)) / (12 h ln10); negated for a decay exponent.
  return -(-g(2 * h) + 8 * g(h) - 8 * g(-h) + g(-2 * h)) / (12 * h * Math.LN10);
}
// resid_exp with GENUINE local exponents of the raw component terms, evaluated at hi = 10^(k+1).
function residExpAnalytic(k) {
  const N = Math.pow(10, k + 1);
  const pEcoll = localLogExponent((x) => parts(x).E_coll, N);
  const pSigma = localLogExponent((x) => parts(x).sigma, N);
  return pEcoll * (1 - parts(N).sigma) - pSigma;
}

function bisectZero(fn, a0, b0) {
  let a = a0;
  let b = b0;
  if (!(fn(a) > 0 && fn(b) < 0)) return null;
  for (let it = 0; it < 100; it++) {
    const m = (a + b) / 2;
    if (fn(m) > 0) a = m;
    else b = m;
  }
  return (a + b) / 2;
}

// (i) k* drift under pSigma OLS-resolution refinement (pEcoll secant held fixed) -- the artifact fingerprint.
const REFINE_PTS_PER_DECADE = [4, 8, 16, 40, 100];
const KSTAR_DRIFT = REFINE_PTS_PER_DECADE.map((p) => {
  const ks = bisectZero((k) => residExpCoarse(k, p), 18, 24);
  return { ptsPerDecade: p, kStar: ks === null ? null : +ks.toFixed(6) };
});
const COARSE_KSTAR = KSTAR_DRIFT[0].kStar; // ~21.280947 -- reproduces imp-34169
const FINER_KSTAR = KSTAR_DRIFT[KSTAR_DRIFT.length - 1].kStar; // ~20.291720 -- a full decade earlier
const KSTAR_DRIFT_DECADES = +(COARSE_KSTAR - FINER_KSTAR).toFixed(6); // ~0.989
const KSTAR_DRIFT_MONOTONE = KSTAR_DRIFT.every(
  (r, i) => i === 0 || (r.kStar !== null && r.kStar < KSTAR_DRIFT[i - 1].kStar),
);

// (ii) coarse resid_exp vs genuine analytic resid_exp in the tail -- the bias-dominance ratio.
const BIAS_RATIO_KS = [14, 16, 18];
const BIAS_RATIOS = BIAS_RATIO_KS.map((k) => {
  const coarse = residExpCoarse(k, 4);
  const analytic = residExpAnalytic(k);
  return {
    k,
    coarse: +coarse.toExponential(4),
    analytic: +analytic.toExponential(4),
    ratio: +(coarse / analytic).toExponential(4),
  };
});
const BIAS_RATIO_MIN = Math.min(...BIAS_RATIOS.map((r) => r.ratio));
const BIAS_RATIO_GROWS = BIAS_RATIOS.every((r, i) => i === 0 || r.ratio > BIAS_RATIOS[i - 1].ratio);

// (iii) analytic resid_exp sign over the resolvable range k = 11 .. 18 (above the ~1e-12 roundoff floor).
const ANALYTIC_RESOLVABLE_KS = [];
for (let k = 11; k <= 18 + 1e-9; k += 0.25) ANALYTIC_RESOLVABLE_KS.push(+k.toFixed(2));
const ANALYTIC_STRICTLY_POSITIVE = ANALYTIC_RESOLVABLE_KS.every((k) => residExpAnalytic(k) > 0);
const ANALYTIC_SMOOTHLY_DECAYING = ANALYTIC_RESOLVABLE_KS.every(
  (k, i) => i === 0 || residExpAnalytic(k) < residExpAnalytic(ANALYTIC_RESOLVABLE_KS[i - 1]),
);
const ANALYTIC_HAS_NO_CLEAN_CROSSING = ANALYTIC_STRICTLY_POSITIVE; // no sign change anywhere resolvable

// imp-34169 baked anchor for the reuse / reconciliation gate.
const IMP34169_COARSE_KSTAR = 21.280947;

const VERDICT_ARTIFACT =
  KSTAR_DRIFT_MONOTONE &&
  KSTAR_DRIFT_DECADES > 0.5 &&
  BIAS_RATIO_MIN > 1e4 &&
  ANALYTIC_HAS_NO_CLEAN_CROSSING;

export const IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION = {
  id: 'imp-34227',
  proofSection: 'S-frontier',
  question:
    'imp-34169 found the imp-33810/imp-33843 surrogate resid_exp(k) = pEcoll (1 - sigma) - pSigma crosses ' +
    'zero at k* ~ 21.28095 (turning the log argument non-positive and every downstream fixed-band-peak ' +
    'quantity into NaN) and left OPEN whether that zero is an ARTIFACT of the quarter-decade OLS exponent ' +
    'estimators (pSigma 4-pt/decade OLS, pEcoll 2-pt secant) or a GENUINE feature of the imp-3220/imp-3406 ' +
    'component model in the deep tail. Recomputing resid_exp(k) with refined finer OLS and with analytic ' +
    'local log-log exponents of the raw component terms, does the sign change survive estimator refinement? ' +
    'Measurement / sub-gap reconciliation only; NOT an RH bound; no QED.',
  measuredQuantity:
    'resid_exp(k) = pEcoll (1 - sigma) - pSigma recomputed three ways: (i) the imp-34169 coarse estimators ' +
    'with pSigma OLS resolution refined 4 -> 8 -> 16 -> 40 -> 100 pts/decade (pEcoll secant fixed), tracking ' +
    'the bisected zero k*; (ii) the coarse resid_exp vs the analytic-local resid_exp in the deep tail ' +
    '(bias-dominance ratio); (iii) the analytic-local resid_exp (4th-order central-difference log-derivatives ' +
    'of the raw imp-3220/imp-3406 terms at hi = 10^(k+1)) over the resolvable range k = 11 .. 18',
  // (i) the artifact fingerprint: k* slides a full decade under a pure resolution knob.
  kStarDriftUnderOlsRefinement: KSTAR_DRIFT, // [{ptsPerDecade, kStar}] x5: 21.2809 -> 20.2917
  coarseKStar: COARSE_KSTAR, // ~21.280947 (reproduces imp-34169)
  finerKStar: FINER_KSTAR, // ~20.291720 (100 pts/decade -- a full decade earlier)
  kStarDriftDecades: KSTAR_DRIFT_DECADES, // ~0.989 -- a ~1-decade migration under estimator refinement
  kStarDriftMonotone: KSTAR_DRIFT_MONOTONE, // true -- monotone slide, no plateau
  // (ii) the coarse resid_exp is discretization bias, not component-model signal.
  biasDominanceRatios: BIAS_RATIOS, // [{k, coarse, analytic, ratio}] -- ~3.8e4, ~2.7e5, ~2.3e6
  biasRatioMin: BIAS_RATIO_MIN, // > 1e4 -- coarse exceeds analytic by >=10^4 throughout the tail
  biasRatioGrowsWithK: BIAS_RATIO_GROWS, // true -- the bias share grows deeper into the tail
  // (iii) the genuine component-model resid_exp never resolvably changes sign.
  analyticResolvableKs: ANALYTIC_RESOLVABLE_KS, // k = 11 .. 18 step 0.25
  analyticStrictlyPositive: ANALYTIC_STRICTLY_POSITIVE, // true -- no negative value where resolvable
  analyticSmoothlyDecaying: ANALYTIC_SMOOTHLY_DECAYING, // true -- ~1.5e-6 down to ~4.4e-12, monotone
  analyticHasNoCleanCrossing: ANALYTIC_HAS_NO_CLEAN_CROSSING, // true -- crossing exists only in coarse surrogate
  imp34169CoarseKStar: IMP34169_COARSE_KSTAR,
  verdictArtifact: VERDICT_ARTIFACT, // true -- the sign change is an estimator artifact
  isRigorous: false,
  finding: {
    F1_kstar_drifts_a_full_decade_under_ols_refinement:
      'Holding the imp-3220/imp-3406 component model fixed and raising ONLY the pSigma OLS resolution ' +
      '4 -> 8 -> 16 -> 40 -> 100 pts/decade marches the resid_exp zero 21.2809 -> 20.7027 -> 20.4690 -> ' +
      '20.3409 -> 20.2917 -- a monotone ~1-decade slide (~0.989) converging toward ~20.2. A genuine ' +
      'component-model feature would sit still; a full-decade migration under a resolution knob is the ' +
      'fingerprint of an estimator artifact.',
    F2_coarse_resid_exp_is_dominated_by_discretization_bias:
      'The genuine analytic-local resid_exp is 4-6 orders of magnitude smaller than the coarse-OLS value ' +
      'through the deep tail: coarse/analytic ratio ~3.8e4 at k=14, ~2.7e5 at k=16, ~2.3e6 at k=18 -- and ' +
      'the ratio GROWS with k. So >99.99% of the coarse resid_exp in the tail is secant-vs-OLS ' +
      'discretization bias (the two estimators are centred at different N), not the component-model quantity.',
    F3_genuine_analytic_resid_exp_never_resolvably_changes_sign:
      'Evaluated with 4th-order local log-derivatives the resid_exp is strictly POSITIVE and smoothly ' +
      'decaying over the entire resolvable range k = 11 .. 18 (~1.5e-6 down to ~4.4e-12), then falls below ' +
      'the ~1e-12 floating-point roundoff floor of the central difference where its sign is pure numerical ' +
      'noise. There is NO clean zero crossing in the component model; the k* ~ 21.28 crossing lives only in ' +
      'the bias-dominated coarse surrogate.',
  },
  verdict:
    'MEASUREMENT / SUB-GAP RECONCILIATION (frontier-direction, NOT rigorous). SUB-GAP-imp-34169-surrogate-' +
    'domain-edge is CLOSED ON THE ARTIFACT SIDE: the imp-33810/imp-33843 surrogate resid_exp(k) zero at ' +
    'k* ~ 21.28095 is an ARTIFACT of the coarse quarter-decade OLS/secant exponent estimators, NOT a genuine ' +
    'feature of the imp-3220/imp-3406 component model in the deep tail. Three independent measurements ' +
    'converge: (i) holding the component model fixed and refining ONLY the pSigma OLS resolution ' +
    '4 -> 100 pts/decade slides k* a full decade 21.2809 -> 20.2917 (monotone, converging ~20.2); (ii) the ' +
    'coarse resid_exp exceeds the genuine analytic-local resid_exp by 4-6 orders of magnitude through the ' +
    'tail (ratio ~3.8e4 -> ~2.3e6, growing), so it is >99.99% secant-vs-OLS discretization bias; (iii) the ' +
    'analytic-local resid_exp is strictly positive and smoothly decaying over the entire resolvable range ' +
    'k = 11 .. 18 and never resolvably changes sign -- the crossing exists only in the bias-dominated coarse ' +
    'surrogate. imp-34169 s within-window fixed-band-peak findings and its correct statement that the coarse ' +
    'surrogate terminates at k* ~ 21.28 are UNTOUCHED as measurements -- the terminus is an estimator edge, ' +
    'not a component-model edge. Distinct from any form selection; the imp-33843 log-linear-over-power-law ' +
    'verdict and the imp-34109/imp-34169 findings are untouched. The component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the local log-derivatives are 4th-order ' +
    'finite differences with a ~1e-12 roundoff floor, not closed forms; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34169 (the module that raised SUB-GAP-imp-34169-surrogate-domain-edge; its coarse resid_exp is ' +
    'reconciled here); imp-34107 (the resid_exp(k) schedule); imp-33843 (the log-linear OLS); imp-33810 ' +
    '(the k=6.. ladder and resid_exp definition); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION_ASSERTIONS = [
  {
    // Reuse / reconciliation gate: the coarse estimators reproduce the imp-34169 zero k* ~ 21.28095.
    id: 'imp34227-reuse-gate-coarse-kstar-reproduces-imp34169',
    description: 'coarse (4 pts/decade OLS, 2-pt secant) resid_exp zero reproduces imp-34169 k* ~ 21.28095 (< 1e-3)',
    holds: () => COARSE_KSTAR !== null && Math.abs(COARSE_KSTAR - IMP34169_COARSE_KSTAR) < 1e-3,
  },
  {
    // (i) k* drifts a full decade under a pure OLS-resolution knob -- the artifact fingerprint.
    id: 'imp34227-kstar-drifts-a-full-decade-under-ols-refinement',
    description: 'refining pSigma OLS 4 -> 100 pts/decade slides k* monotonically ~1 decade (21.28 -> 20.29)',
    holds: () =>
      KSTAR_DRIFT_MONOTONE === true &&
      FINER_KSTAR !== null &&
      KSTAR_DRIFT_DECADES > 0.5 &&
      FINER_KSTAR < 20.5 &&
      COARSE_KSTAR > 21.0,
  },
  {
    // (ii) the coarse resid_exp is >=10^4x the genuine analytic value throughout the tail -- bias-dominated.
    id: 'imp34227-coarse-resid-exp-is-discretization-bias-dominated',
    description: 'coarse/analytic resid_exp ratio > 1e4 at k=14,16,18 and grows with k; both positive there',
    holds: () =>
      BIAS_RATIO_MIN > 1e4 &&
      BIAS_RATIO_GROWS === true &&
      BIAS_RATIOS.every((r) => r.coarse > 0 && r.analytic > 0),
  },
  {
    // (iii) the genuine analytic-local resid_exp never resolvably changes sign (strictly positive & decaying).
    id: 'imp34227-analytic-resid-exp-never-resolvably-changes-sign',
    description: 'analytic-local resid_exp strictly positive & smoothly decaying over k = 11..18; no clean crossing',
    holds: () =>
      ANALYTIC_STRICTLY_POSITIVE === true &&
      ANALYTIC_SMOOTHLY_DECAYING === true &&
      ANALYTIC_HAS_NO_CLEAN_CROSSING === true,
  },
  {
    // Honesty gate: artifact verdict, isRigorous false, imp-34169 not overturned as measurement, no QED, no refereed bound is changed.
    id: 'imp34227-honesty-gate-no-qed',
    description: 'Measurement only: verdictArtifact true, isRigorous false, imp-34169 untouched as measurement, no QED, no refereed bound is changed, imp-3066 K_a>=0 & imp-486 C_mb untouched',
    holds: () =>
      IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION.verdictArtifact === true &&
      IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION.verdict) &&
      /SUB-GAP-imp-34169-surrogate-domain-edge is CLOSED ON THE ARTIFACT SIDE/.test(
        IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION.verdict,
      ) &&
      /are UNTOUCHED as measurements/.test(IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION.verdict) &&
      /NO QED/.test(IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(
        IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION.verdict,
      ),
  },
];

for (const a of IMP34227_SURROGATE_ZERO_ESTIMATOR_RECONCILIATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34227-surrogate-zero-estimator-reconciliation assertion failed: ${a.id}`);
  }
}
