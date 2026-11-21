/**
 * @module imp-34294-log-vs-linear-residual-zero-gap
 *
 * imp-34294 (numerical, frontier-direction): ISOLATE the log-space-vs-linear-space contribution to the
 * imp-34211 closed-form(~21.00)/bisection(~21.28) kEnd split. The imp-34237/imp-34169 fixed-band-peak
 * surrogate the whole family fits does not read the residual raw -- the imp-33843 OLS takes the LOG of the
 * imp-33810 ratio eflow_over_resid = eflow_attr / resid_exp (response y = ln(eflow_over_resid)), so its
 * domain edge is located in LOG space. imp-34150 instead bisects the RAW residual
 * resid_exp(k) = pEcoll (1 - sigma) - pSigma directly (linear space) to k* ~ 21.28094743, and imp-34127
 * derives a closed form kEnd_cf ~ 21.00. imp-34211 measured the ~0.278 closed-form-vs-bisection gap but did
 * NOT isolate the log-vs-linear transform as a candidate contributor. This module MEASURES whether locating
 * the zero in log space (the log argument eflow_over_resid crossing its sign, i.e. the ln domain boundary)
 * vs in linear space (resid_exp crossing zero) shifts the root, and quantifies how much of the 21.00/21.28
 * split that transform accounts for.
 *
 * THE ANSWER: THE LOG TRANSFORM CONTRIBUTES EXACTLY ZERO -- THE TWO ROOTS ARE BIT-IDENTICAL.
 * ----------------------------------------------------------------------------------------
 *   Linear-space root   bisecting resid_exp(k) = pEcoll (1 - sigma) - pSigma directly (200 iters, bracket
 *                       [21,22]) lands at k*_lin = 21.280947424999.
 *   Log-space root      bisecting the imp-33843 LOG ARGUMENT eflow_over_resid = eflow_attr / resid_exp on its
 *                       sign change (the ln domain boundary, where the response y = ln(eflow_over_resid) hits
 *                       its pole) lands at k*_log = 21.280947424999 -- BIT-IDENTICAL to k*_lin (gap = 0.0).
 *   Why they coincide   eflow_attr(k) = (E_flow/E_N) |s_flow| is strictly POSITIVE through the deep tail
 *                       (~4.5e-15 at k*, but > 0), so sign(eflow_over_resid) = sign(eflow_attr/resid_exp) =
 *                       sign(resid_exp) at every k -- the ln domain boundary is algebraically the SAME
 *                       condition as the raw-residual zero. Dividing a positive number by resid_exp is a
 *                       strictly sign-preserving, monotone map, so the log surrogate s pole sits EXACTLY on
 *                       the raw-residual zero. There is no log-induced shift to measure.
 *   Split accounting    the entire imp-34211 gap is the LINEAR-space closed-form-vs-bisection difference:
 *                       k*_cf = 21.003348 vs k*_lin = 21.280947, gap ~ -0.2776. The log transform s share of
 *                       that split is |k*_log - k*_lin| / |k*_cf - k*_lin| = 0.0 / 0.2776 = EXACTLY 0.
 *
 * So the imp-34211 21.00/21.28 split is NOT a log-vs-linear estimator artifact. All ~0.278 of it is the
 * imp-34127/imp-34189 O((eD)^2) window-width shortfall -- the OLS(5pt)-vs-2pt-secant cubic-bias balance the
 * closed form leaves out at a full-decade window (e*D/4 ~ 0.28) -- a purely LINEAR-space estimator effect
 * that lives entirely in how the closed form approximates the direct bisection, with the log transform
 * contributing nothing. This is exactly what a smooth residual crossing zero predicts: the root and the
 * root of any strictly sign-preserving transform of it (here ln of eflow_attr/resid_exp with eflow_attr > 0)
 * must coincide, and they do -- to the last bit.
 *
 * THE MEASUREMENT (imp-33810/imp-34211 sub-terms reused verbatim; the log-vs-linear root pair is new)
 * --------------------------------------------------------------------------------------------------
 *   Component model  sigma(N) = E_coll/(E_trunc + E_flow + E_coll), the inherited imp-3220/imp-3406
 *                    sub-terms EXACTLY as in imp-33810/imp-34150/imp-34169/imp-34211. No re-derivation.
 *   Linear root      bisectSign(resid_exp, 21, 22): resid_exp > 0 below k*, < 0 above -> k*_lin.
 *   Log root         bisectSign(eflow_over_resid, 21, 22): eflow_over_resid = eflow_attr/resid_exp is +inf
 *                    below k* (pole) and negative above; its sign change is the ln domain boundary -> k*_log.
 *   eflow_attr sign  eflow_attr(k) = (E_flow/E_N) |s_flow| checked strictly positive at k*, so the two
 *                    bisections share an identical sign predicate and hence an identical root.
 *   Closed-form gap  the imp-34211 k*_cf (bisecting sigma(hi) - sigma*) reused to anchor the 21.00/21.28
 *                    split the log transform is tested against.
 *
 * MEASUREMENT / TRANSFORM-ATTRIBUTION ONLY. A descriptive isolation of one candidate contributor (the
 * log-vs-linear transform) to an inherited-surrogate gap, NOT an RH bound. Reuses the imp-3406/imp-33810
 * sub-terms verbatim; the inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the
 * crossing is descriptive within that model only; changes no bound; establishes no operator positivity;
 * distinct from the imp-34285 F4/C-term decomposition; C_mb GUE-conditional per imp-486 untouched; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34211-closedform-vs-bisection-kend-gap (the ~0.278 21.00/21.28 gap this attributes; k*_cf reused)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the surrogate whose LOG argument this probes)
 * @see imp-34150-m2-residual-crossing-direct-bisection-crossval (the raw-residual linear-space root 21.28094743)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the closed form kEnd_cf ~ 21.00)
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (the O((eD)^2) window-width shortfall)
 * @see imp-34227-surrogate-zero-estimator-reconciliation (the coarse-OLS artifact reconciliation of the same k*)
 * @see imp-34285-closedform-gap-term-decomposition (the F4/C-term decomposition this is distinct from)
 * @see imp-33843-eflow-resid-widening-form-fit (the OLS response y = ln(eflow_over_resid) -- the log space)
 * @see imp-33810-eflow-resid-ratio-N-ladder (resid_exp and eflow_attr definitions reused verbatim)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34211
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
const D = Math.LN10; // decade window width in x = ln N (imp-34211 closed-form path)

// EXACT inherited imp-3406/imp-33810 sub-terms (no re-derivation) -- verbatim imp-34211.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// ---- Linear-space residual (imp-34150): resid_exp(k) = pEcoll (1 - sigma) - pSigma ----
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
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function residExp(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  return pEcoll * (1 - parts(hi).sigma) - pSigma; // raw residual (linear space)
}

// ---- Log-space surrogate argument (imp-33843/imp-33810): eflow_over_resid = eflow_attr / resid_exp ----
// s_flow = d ln E_flow / d ln N via a symmetric log-N central difference (small, negative) -- imp-33810.
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
function eflowAttr(k) {
  const hi = Math.pow(10, k + 1);
  const ph = parts(hi);
  return (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi)); // attributed E_flow term, strictly positive
}
// The imp-33843 OLS response is y = ln(eflow_over_resid); its domain boundary (pole) is where this ratio
// changes sign, which -- since eflow_attr > 0 -- is EXACTLY where resid_exp crosses zero.
function eflowOverResid(k) {
  return eflowAttr(k) / residExp(k);
}

// ---- imp-34211 closed-form path (anchors the 21.00/21.28 split the log transform is tested against) ----
function eCont(N) {
  const h = 1e-4;
  const Lp = Math.log(effectiveHeightForN(N * Math.exp(h)));
  const Lm = Math.log(effectiveHeightForN(N / Math.exp(h)));
  const Lslope = (Lp - Lm) / (2 * h);
  return 0.5 - Lslope / (2 * Math.log(effectiveHeightForN(N)));
}
function eDerivs(N) {
  const x = Math.log(N);
  const h = 1e-3;
  const e0 = eCont(N);
  const ep = eCont(Math.exp(x + h));
  const em = eCont(Math.exp(x - h));
  return { e: e0, e2: (ep - 2 * e0 + em) / (h * h) };
}
function residClosedForm(k) {
  const hi = Math.pow(10, k + 1);
  const { e, e2 } = eDerivs(hi);
  const sigmaStar = (-e2 * D * D / 160) / (e * e * D / 2 + 17 * e * e * e * D * D / 480);
  return sigma(hi) - sigmaStar;
}

// Shared sign-change bisection (fn > 0 at lo0, fn < 0 at hi0). 200 iters -> ~1.6e-58 bracket.
function bisectSign(fn, lo0, hi0, iters = 200) {
  if (!(fn(lo0) > 0 && fn(hi0) < 0)) return NaN;
  let lo = lo0;
  let hi = hi0;
  for (let i = 0; i < iters; i++) {
    const m = (lo + hi) / 2;
    if (fn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// The two roots: raw residual (linear space) vs the log surrogate argument (log space).
const KSTAR_LINEAR = bisectSign(residExp, 21, 22); // ~21.280947424999 (reproduces imp-34150)
const KSTAR_LOG = bisectSign(eflowOverResid, 21, 22); // BIT-IDENTICAL to KSTAR_LINEAR
const KSTAR_CLOSED_FORM = bisectSign(residClosedForm, 17, 26); // ~21.003348 (reproduces imp-34211)

// eflow_attr is strictly positive at k*, which is WHY the two roots coincide (sign-preserving division).
const EFLOW_ATTR_AT_KSTAR = eflowAttr(KSTAR_LINEAR);
const EFLOW_ATTR_POSITIVE_AT_KSTAR = EFLOW_ATTR_AT_KSTAR > 0;

// Sign-predicate identity: sign(resid_exp) == sign(eflow_over_resid) across the bracket (eflow_attr > 0).
const SIGN_GRID_KS = [];
for (let k = 21; k <= 22 + 1e-9; k += 0.05) SIGN_GRID_KS.push(+k.toFixed(2));
const SIGN_PREDICATE_IDENTICAL = SIGN_GRID_KS.every(
  (k) => Math.sign(residExp(k)) === Math.sign(eflowOverResid(k)),
);

// The measured log-vs-linear gap and its share of the imp-34211 21.00/21.28 split.
const LOG_VS_LINEAR_GAP = KSTAR_LOG - KSTAR_LINEAR; // exactly 0.0
const ROOTS_BIT_IDENTICAL = KSTAR_LOG === KSTAR_LINEAR; // true
const CLOSED_FORM_SPLIT = KSTAR_CLOSED_FORM - KSTAR_LINEAR; // ~ -0.2776 (the 21.00/21.28 gap)
const LOG_SHARE_OF_SPLIT = Math.abs(LOG_VS_LINEAR_GAP) / Math.abs(CLOSED_FORM_SPLIT); // exactly 0.0

// imp-34211 anchor for the reuse gate.
const IMP34211_KEND_BISECT = 21.2809474;
const IMP34211_KEND_CLOSED_FORM = 21.0028;

const VERDICT_LOG_TRANSFORM_CONTRIBUTES_NOTHING =
  ROOTS_BIT_IDENTICAL &&
  LOG_VS_LINEAR_GAP === 0 &&
  EFLOW_ATTR_POSITIVE_AT_KSTAR &&
  SIGN_PREDICATE_IDENTICAL &&
  LOG_SHARE_OF_SPLIT === 0 &&
  Math.abs(CLOSED_FORM_SPLIT) > 0.2;

export const IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP = {
  id: 'imp-34294',
  proofSection: 'S-frontier',
  question:
    'The imp-34237/imp-34169 fixed-band-peak surrogate reads the residual through the imp-33843 OLS ' +
    'response y = ln(eflow_over_resid) = ln(eflow_attr/resid_exp) -- a LOG transform -- while imp-34150 ' +
    'bisects the RAW residual resid_exp(k) = pEcoll (1 - sigma) - pSigma directly (linear space) to ' +
    'k* ~ 21.28094743 and imp-34127 derives a closed form kEnd_cf ~ 21.00. imp-34211 measured the ~0.278 ' +
    'closed-form-vs-bisection gap but did not isolate the log-vs-linear transform. Does locating the zero ' +
    'in log space vs linear space shift the root, and how much of the 21.00/21.28 split does that transform ' +
    'account for? Measurement / transform-attribution only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'The linear-space root k*_lin (200-iter sign bisection of resid_exp on [21,22]), the log-space root ' +
    'k*_log (200-iter sign bisection of the ln domain boundary eflow_over_resid = eflow_attr/resid_exp on ' +
    '[21,22]), and the closed-form root k*_cf (imp-34211 sigma(hi) - sigma* on [17,26]), all rebuilt from ' +
    'the identical inherited imp-3406/imp-33810 sub-terms, plus the log-vs-linear gap, whether the two ' +
    'roots are bit-identical, the sign of eflow_attr at k*, and the log transform s share of the ~0.278 split.',
  // The two roots coincide to the last bit.
  kStarLinear: +KSTAR_LINEAR.toFixed(9), // ~21.280947425 (reproduces imp-34150)
  kStarLog: +KSTAR_LOG.toFixed(9), // ~21.280947425 (BIT-IDENTICAL to linear)
  kStarClosedForm: +KSTAR_CLOSED_FORM.toFixed(9), // ~21.003348 (reproduces imp-34211)
  logVsLinearGap: LOG_VS_LINEAR_GAP, // exactly 0.0
  rootsBitIdentical: ROOTS_BIT_IDENTICAL, // true
  eflowAttrAtKStar: +EFLOW_ATTR_AT_KSTAR.toExponential(4), // ~4.52e-15 -- tiny but strictly positive
  eflowAttrPositiveAtKStar: EFLOW_ATTR_POSITIVE_AT_KSTAR, // true -- this is WHY the roots coincide
  signPredicateIdentical: SIGN_PREDICATE_IDENTICAL, // true -- sign(resid_exp) == sign(eflow_over_resid)
  // The imp-34211 split is entirely the linear-space closed-form shortfall; the log transform adds nothing.
  closedFormSplit: +CLOSED_FORM_SPLIT.toFixed(9), // ~ -0.2776 (the 21.00/21.28 gap)
  logShareOfSplit: LOG_SHARE_OF_SPLIT, // exactly 0.0 -- the log transform accounts for NONE of the split
  imp34211KEndBisect: IMP34211_KEND_BISECT,
  imp34211KEndClosedForm: IMP34211_KEND_CLOSED_FORM,
  verdictLogTransformContributesNothing: VERDICT_LOG_TRANSFORM_CONTRIBUTES_NOTHING, // true
  isRigorous: false,
  finding: {
    A_log_and_linear_roots_are_bit_identical:
      'Bisecting the raw residual resid_exp(k) (linear space) and the imp-33843 log argument ' +
      'eflow_over_resid = eflow_attr/resid_exp (log space) on the identical bracket [21,22] to 200 ' +
      'iterations lands BOTH at k* = 21.280947424999 -- bit-identical, gap exactly 0.0. Locating the zero ' +
      'in log space rather than linear space does NOT shift the root by a single ULP.',
    B_coincidence_is_because_eflow_attr_is_strictly_positive:
      'eflow_attr(k) = (E_flow/E_N) |s_flow| is strictly POSITIVE through the deep tail (~4.5e-15 at k*, ' +
      'but > 0), so sign(eflow_over_resid) = sign(eflow_attr/resid_exp) = sign(resid_exp) at every k on ' +
      '[21,22]. Dividing a positive number by resid_exp is a strictly sign-preserving monotone map, so the ' +
      'log surrogate s pole (ln domain boundary) sits algebraically on the SAME condition as the raw zero. ' +
      'This is exactly what a smooth residual crossing zero predicts -- no log-induced shift exists.',
    C_log_transform_accounts_for_none_of_the_split:
      'The imp-34211 21.00/21.28 split is the LINEAR-space closed-form-vs-bisection difference k*_cf ~ ' +
      '21.0033 vs k*_lin ~ 21.2809, gap ~ -0.2776. The log transform s share is |k*_log - k*_lin| / ' +
      '|k*_cf - k*_lin| = 0.0 / 0.2776 = EXACTLY 0. All ~0.278 of the split is the imp-34127/imp-34189 ' +
      'O((eD)^2) window-width shortfall (the OLS(5pt)-vs-2pt-secant cubic-bias balance, e*D/4 ~ 0.28 at a ' +
      'full-decade window) -- a purely linear-space estimator effect with the log transform contributing nothing.',
  },
  verdict:
    'NUMERICAL / TRANSFORM-ATTRIBUTION (frontier-direction, NOT rigorous). Rebuilding the raw residual ' +
    'resid_exp(k) = pEcoll (1 - sigma) - pSigma (linear space) and the imp-33843 log argument ' +
    'eflow_over_resid = eflow_attr/resid_exp (log space) from the identical inherited imp-3406/imp-33810 ' +
    'sub-terms and bisecting each on [21,22] to 200 iterations gives k*_lin = k*_log = 21.280947424999 -- ' +
    'BIT-IDENTICAL, gap exactly 0.0. The roots coincide because eflow_attr = (E_flow/E_N)|s_flow| is ' +
    'strictly positive at k* (~4.5e-15 > 0), making eflow_over_resid a strictly sign-preserving map of ' +
    'resid_exp, so the ln domain boundary is algebraically the same condition as the raw-residual zero (as ' +
    'a smooth zero crossing demands). Hence the log transform s share of the imp-34211 21.00/21.28 split is ' +
    '|k*_log - k*_lin| / |k*_cf - k*_lin| = 0.0 / 0.278 = EXACTLY 0: the entire ~0.278 gap is the ' +
    'imp-34127/imp-34189 O((eD)^2) window-width shortfall (OLS(5pt)-vs-2pt-secant cubic-bias balance, ' +
    'e*D/4 ~ 0.28 at a full-decade window), a purely LINEAR-space estimator effect, NOT a log-vs-linear ' +
    'transform artifact. Distinct from the imp-34285 F4/C-term decomposition. The inherited imp-3220/' +
    'imp-3406 component model is NOT a rigorous asymptotic; the crossing is descriptive within that model ' +
    'only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486 ' +
    'untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34211 (the ~0.278 21.00/21.28 gap attributed here; k*_cf reused); imp-34169 (the surrogate whose ' +
    'log argument this probes); imp-34150 (the raw-residual linear-space root 21.28094743); imp-34127 ' +
    '(the closed form kEnd_cf ~ 21.00); imp-34189 (the O((eD)^2) window-width shortfall); imp-34285 (the ' +
    'F4/C-term decomposition this is distinct from); imp-33843 (the OLS response y = ln(eflow_over_resid)); ' +
    'imp-33810 (resid_exp and eflow_attr definitions); imp-486 (C_mb GUE-conditional); lambda-rh-height-' +
    'mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP_ASSERTIONS = [
  {
    // Reuse gate: the linear-space bisection reproduces the imp-34150/imp-34211 direct root ~21.28094743.
    id: 'imp34294-reuse-gate-linear-root-reproduces-imp34150',
    description: 'linear-space resid_exp bisection reproduces imp-34150/imp-34211 root ~21.2809474 (< 1e-5)',
    holds: () =>
      Number.isFinite(KSTAR_LINEAR) && Math.abs(KSTAR_LINEAR - IMP34211_KEND_BISECT) < 1e-5,
  },
  {
    // (A) The log-space root is BIT-IDENTICAL to the linear-space root -- no shift.
    id: 'imp34294-log-and-linear-roots-bit-identical',
    description: 'log-space and linear-space residual zeros are bit-identical (gap exactly 0.0)',
    holds: () => ROOTS_BIT_IDENTICAL === true && LOG_VS_LINEAR_GAP === 0,
  },
  {
    // (B) eflow_attr is strictly positive at k* and the sign predicate is identical -- WHY they coincide.
    id: 'imp34294-eflow-attr-positive-drives-coincidence',
    description: 'eflow_attr > 0 at k* and sign(resid_exp) == sign(eflow_over_resid) across [21,22]',
    holds: () => EFLOW_ATTR_POSITIVE_AT_KSTAR === true && SIGN_PREDICATE_IDENTICAL === true,
  },
  {
    // (C) The log transform accounts for EXACTLY NONE of the imp-34211 21.00/21.28 split.
    id: 'imp34294-log-share-of-split-is-zero',
    description: 'log share of the 21.00/21.28 split is exactly 0; the ~0.278 gap is the linear closed-form shortfall',
    holds: () =>
      LOG_SHARE_OF_SPLIT === 0 &&
      Math.abs(CLOSED_FORM_SPLIT) > 0.2 &&
      Math.abs(CLOSED_FORM_SPLIT) < 0.35 &&
      CLOSED_FORM_SPLIT < 0,
  },
  {
    // Honesty gate: transform-attribution only, isRigorous false, no QED, no refereed bound is changed, K_a & C_mb untouched.
    id: 'imp34294-honesty-gate-no-qed',
    description: 'Measurement only: verdict true, isRigorous false, no QED, no refereed bound is changed, imp-3066 K_a>=0 & imp-486 C_mb untouched',
    holds: () =>
      IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP.verdictLogTransformContributesNothing === true &&
      IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP.isRigorous === false &&
      /NOT a rigorous asymptotic/.test(IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP.verdict) &&
      /EXACTLY 0/.test(IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP.verdict) &&
      /NO QED/.test(IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP.verdict) &&
      /refereed bound is changed/i.test(IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP.verdict) &&
      /C_mb GUE-conditional per imp-486 (?:is )?untouched/i.test(
        IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP.verdict,
      ),
  },
];

for (const a of IMP34294_LOG_VS_LINEAR_RESIDUAL_ZERO_GAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34294-log-vs-linear-residual-zero-gap assertion failed: ${a.id}`);
  }
}
