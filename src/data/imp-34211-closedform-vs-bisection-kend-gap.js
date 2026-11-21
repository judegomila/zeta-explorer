/**
 * @module imp-34211-closedform-vs-bisection-kend-gap
 *
 * imp-34211 (accuracy, frontier-direction): imp-34127 derived the imp-33773 M2-residual sign-change
 * ceiling kEnd* in CLOSED FORM from the OLS(5pt)-vs-2pt-secant cubic-bias balance
 *     sigma* = (-e_pp * D^2/160) / (e^2 * D/2 + 17 e^3 * D^2/480),
 * inverting sigma(N) = sigma* through the far-tail sqrt(L/N) law to land at kEnd_cf ~ 21.00. Separately,
 * imp-34150 INDEPENDENTLY bisected the raw residual resid(kEnd) = pEcoll*(1-sigma) - pSigma to
 * kEnd_bis = 21.28094743 (secant 21.28094742). Both routes claim to locate the same ceiling but their
 * mutual agreement was never quantified directly. This module rebuilds BOTH computations from the
 * identical inherited imp-3406/imp-33810 sub-terms (head fixed at k=6), evaluates them to high precision,
 * and measures the absolute/relative gap between the closed form and the direct-bisection root.
 *
 * THE MEASURED GAP (closed form vs direct bisection)
 * --------------------------------------------------
 *   Closed-form crossing (200-iter bisection of sigma(hi) - sigma*):  kEnd_cf  ~ 21.0028
 *   Direct-residual root (200-iter bisection of resid, bracket [21,22]): kEnd_bis ~ 21.2809474
 *   Absolute gap  |kEnd_cf - kEnd_bis|  ~ 0.278   (about a quarter of a decade-index)
 *   Relative gap  |kEnd_cf - kEnd_bis| / kEnd_bis ~ 1.31e-2   (about 1.3 percent)
 *   Matching significant figures  -log10(relGap) ~ 1.88   (only the leading "21" survives)
 *
 * VERDICT ON REPRODUCTION TO ALL PUBLISHED DIGITS -- HONEST NEGATIVE
 * -----------------------------------------------------------------
 *   The closed form does NOT reproduce the direct-bisection root to its published digits. imp-34150
 *   published kEnd_bis = 21.28094743 (~10 significant figures); the closed form agrees only on the
 *   integer part "21" and already diverges at the FIRST decimal place (21.00 vs 21.28). So the two
 *   disjoint routes locate the same ceiling only to LEADING order (~2 sig figs, ~1.3 percent) -- the
 *   closed form is a leading-order estimate, not a high-precision reproduction. This is exactly the
 *   O((eD)^2) window-width shortfall that imp-34127 named (e*D/4 ~ 0.28 at a full-decade window) and
 *   imp-34189 confirmed does not close with the next term (the eD ~ 1.13 expansion parameter is O(1)).
 *   The residual is NEGATIVE (closed form UNDER-shoots the bisection), matching imp-34127 sign.
 *
 * NUMERICAL / MEASUREMENT ONLY. A direct gap measurement between two inherited-surrogate estimators of
 * the same ceiling, NOT an RH bound. Reuses the imp-3406/imp-33810 sub-terms verbatim; the inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the crossing is descriptive within that
 * model only; changes no bound; establishes no operator positivity; C_mb GUE-conditional per imp-486
 * untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the closed-form kEnd_cf ~ 21.00 measured here)
 * @see imp-34150-m2-residual-crossing-direct-bisection-crossval (the direct-bisection root 21.28094743 measured here)
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (the O((eD)^2) gap does not close with the next term)
 * @see imp-34278 (glossary: the single canonical honest note naming kEnd*~21.281, not this closed form, as the quoted edge)
 * @see imp-33773 (the M2 sub-leading residual whose sign change caps the surrogate)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-34127/imp-34150 exactly
const D = Math.LN10; // decade window width in x = ln N

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34127/imp-34150 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// ---- Direct-residual path (imp-34150): resid(kEnd) = pEcoll*(1-sigma) - pSigma, no F4/no C. ----
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
function residDirect(kEnd) {
  const lo = Math.pow(10, kEnd);
  const hi = Math.pow(10, kEnd + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const s = parts(hi).sigma;
  return pEcoll * (1 - s) - pSigma; // A - B
}

// ---- Closed-form path (imp-34127): sigma(hi) - sigma*, sigma* from the cubic-bias balance. ----
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
  return sigma(hi) - sigmaStar; // > 0 below crossing, flips sign at kEnd*
}

// Shared bisection root-finder (high precision: 200 iterations, ~1.6e-58 bracket).
function bisectRoot(residFn, lo0, hi0, iters = 200) {
  if (residFn(lo0) <= 0 || residFn(hi0) >= 0) return NaN;
  let lo = lo0;
  let hi = hi0;
  for (let i = 0; i < iters; i++) {
    const m = (lo + hi) / 2;
    if (residFn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

const KEND_CLOSED_FORM = bisectRoot(residClosedForm, 17, 26); // ~21.0028
const KEND_DIRECT_BISECT = bisectRoot(residDirect, 21, 22); // ~21.2809474

// Gap metrics (closed form vs direct bisection).
const ABS_GAP = Math.abs(KEND_CLOSED_FORM - KEND_DIRECT_BISECT); // ~0.278
const REL_GAP = ABS_GAP / KEND_DIRECT_BISECT; // ~1.31e-2
const SIGNED_RESIDUAL = KEND_CLOSED_FORM - KEND_DIRECT_BISECT; // ~ -0.278 (closed form under-shoots)
const MATCHING_SIG_FIGS = -Math.log10(REL_GAP); // ~1.88 (only the leading "21" survives)

// Published direct-bisection root literal (imp-34150), to test digit-by-digit reproduction.
const IMP34150_PUBLISHED_ROOT = 21.28094743; // ~10 sig figs
const REPRODUCES_PUBLISHED_ROOT_AT_1DP =
  +KEND_CLOSED_FORM.toFixed(1) === +IMP34150_PUBLISHED_ROOT.toFixed(1); // false: 21.0 vs 21.3
const REPRODUCES_PUBLISHED_ROOT_AT_0DP =
  Math.round(KEND_CLOSED_FORM) === Math.round(IMP34150_PUBLISHED_ROOT); // true: both round to 21

export const IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP = {
  id: 'imp-34211',
  proofSection: 'S-frontier',
  question:
    'imp-34127 derived the imp-33773 M2-residual sign-change ceiling kEnd* in closed form (kEnd_cf ~ ' +
    '21.00) from the OLS(5pt)-vs-2pt-secant cubic-bias balance, while imp-34150 independently bisected ' +
    'the raw residual to kEnd_bis = 21.28094743. Evaluate the closed form to high precision and measure ' +
    'its absolute/relative gap against the direct-bisection root, assessing whether the closed form ' +
    'reproduces the numerical root to all published digits. Cross-validation/measurement only; component ' +
    'model NOT rigorous; NO QED.',
  measuredQuantity:
    'The high-precision closed-form crossing kEnd_cf (200-iter bisection of sigma(hi) - sigma* on ' +
    '[17,26]) and the direct-residual root kEnd_bis (200-iter bisection of resid(kEnd) = pEcoll*(1-sigma) ' +
    '- pSigma on [21,22]), rebuilt from the identical inherited imp-3406/imp-33810 sub-terms (head fixed ' +
    'at k=6), plus the absolute gap, relative gap, signed residual, and matching-significant-figures ' +
    'count between them.',
  kEndClosedForm: +KEND_CLOSED_FORM.toFixed(7), // ~21.0028
  kEndDirectBisect: +KEND_DIRECT_BISECT.toFixed(7), // ~21.2809474
  imp34150PublishedRoot: IMP34150_PUBLISHED_ROOT, // 21.28094743
  gap: {
    absolute: +ABS_GAP.toFixed(7), // ~0.2781
    relative: +REL_GAP.toExponential(4), // ~1.307e-2
    signedResidual: +SIGNED_RESIDUAL.toFixed(7), // ~ -0.2781 (closed form under-shoots)
    matchingSignificantFigures: +MATCHING_SIG_FIGS.toFixed(3), // ~1.88
    reproducesPublishedRootAt1dp: REPRODUCES_PUBLISHED_ROOT_AT_1DP, // false
    reproducesPublishedRootAt0dp: REPRODUCES_PUBLISHED_ROOT_AT_0DP, // true (both round to 21)
  },
  finding: {
    A_gap_is_about_a_quarter_index:
      'The high-precision closed form lands at kEnd_cf ~ 21.003, an absolute gap of ~0.278 below the ' +
      'direct-bisection root kEnd_bis ~ 21.281 -- about a quarter of a decade-index. The relative gap is ' +
      '~1.3 percent, so the two disjoint routes agree only to ~1.88 matching significant figures (only ' +
      'the leading "21" survives).',
    B_does_not_reproduce_published_digits:
      'The closed form does NOT reproduce the imp-34150 published root 21.28094743 (~10 sig figs) to its ' +
      'published digits: it agrees on the integer part "21" but already diverges at the FIRST decimal ' +
      'place (21.0 vs 21.3). It is a leading-order estimate, not a high-precision reproduction.',
    C_under_shoots_by_the_named_window_gap:
      'The signed residual is NEGATIVE (kEnd_cf - kEnd_bis ~ -0.278), so the closed form UNDER-shoots -- ' +
      'exactly the sign and magnitude of the O((eD)^2) window-width shortfall imp-34127 named (e*D/4 ~ ' +
      '0.28 at a full-decade window) and imp-34189 showed the next term does not close (eD ~ 1.13 is O(1)).',
  },
  canonicalStatus: {
    canonicalValue: 21.28094743,
    canonicalSource: 'imp-34150 direct-bisection/secant root, cross-referenced canonically in the imp-34278 glossary note',
    note:
      'kEnd_cf ~21.00 (imp-34127) is NOT the canonical ceiling. It is a leading-order estimate that ' +
      'under-shoots the bisected root by the ~0.278 gap measured above (signed residual negative) and ' +
      'has no continuum-limit derivation (imp-34189 next-order term moves the wrong way). Quote ' +
      'kEnd*~21.281 directly from imp-34150 / imp-34278, not from this closed form.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Rebuilding BOTH the imp-34127 closed ' +
    'form (sigma(hi) - sigma*, sigma* = (-e_pp D^2/160)/(e^2 D/2 + 17 e^3 D^2/480)) and the imp-34150 ' +
    'direct residual resid(kEnd) = pEcoll*(1-sigma) - pSigma from the identical inherited imp-3406/' +
    'imp-33810 sub-terms (head fixed at k=6) and bisecting each to 200 iterations gives the closed-form ' +
    'crossing kEnd_cf ~ 21.003 and the direct-bisection root kEnd_bis ~ 21.281. Their gap is ~0.278 ' +
    'absolute and ~1.3 percent relative -- only ~1.88 matching significant figures. HONEST NEGATIVE on ' +
    'reproduction to all published digits: the closed form agrees with the imp-34150 published ' +
    '21.28094743 only on the integer part "21" and diverges at the first decimal, so the closed form is ' +
    'a leading-order estimate rather than a high-precision reproduction of the direct root. The signed ' +
    'residual is negative (closed form under-shoots), matching the O((eD)^2) window-width shortfall ' +
    'imp-34127 named and imp-34189 showed does not close (the eD ~ 1.13 expansion parameter is O(1)). ' +
    'The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the crossing is ' +
    'descriptive within that model only; changes no bound; establishes no operator positivity; C_mb ' +
    'GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34127 (the closed-form kEnd_cf ~ 21.00 measured here); imp-34150 (the direct-bisection root ' +
    '21.28094743 measured here); imp-34189 (the O((eD)^2) gap does not close with the next term); ' +
    'imp-34278 (the canonical glossary note naming kEnd*~21.281 as the quoted edge); ' +
    'imp-33773 (the M2 residual whose zero this locates); lambda-rh-height-mapping (RvM height law); ' +
    'polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP_ASSERTIONS = [
  {
    // (A) Both routes are finite and land near 21; the direct root reproduces imp-34150 to ~7 sig figs.
    id: 'imp34211-both-routes-land-near-21',
    description: 'closed form ~21.00 and direct bisection ~21.281 both finite; direct root matches imp-34150 to <1e-6',
    holds: () =>
      Number.isFinite(KEND_CLOSED_FORM) &&
      Number.isFinite(KEND_DIRECT_BISECT) &&
      KEND_CLOSED_FORM > 20.5 &&
      KEND_CLOSED_FORM < 21.5 &&
      Math.abs(KEND_DIRECT_BISECT - IMP34150_PUBLISHED_ROOT) < 1e-6,
  },
  {
    // (B) The measured absolute gap is ~0.28 (a quarter-index), consistent with imp-34127.
    id: 'imp34211-absolute-gap-about-0p28',
    description: 'absolute gap |kEnd_cf - kEnd_bis| is in [0.2, 0.35]',
    holds: () => ABS_GAP > 0.2 && ABS_GAP < 0.35,
  },
  {
    // (C) The relative gap is ~1.3 percent, so only the leading two figures match.
    id: 'imp34211-relative-gap-about-1p3-percent',
    description: 'relative gap ~1.3 percent and matching sig figs < 2.5 (leading "21" only)',
    holds: () => REL_GAP > 5e-3 && REL_GAP < 2e-2 && MATCHING_SIG_FIGS < 2.5,
  },
  {
    // (D) HONEST NEGATIVE: does NOT reproduce the published root at 1 dp, but does at the integer part.
    id: 'imp34211-does-not-reproduce-published-digits',
    description: 'closed form fails to reproduce imp-34150 21.28094743 at 1dp but matches the integer part',
    holds: () => REPRODUCES_PUBLISHED_ROOT_AT_1DP === false && REPRODUCES_PUBLISHED_ROOT_AT_0DP === true,
  },
  {
    // (E) The closed form UNDER-shoots (signed residual negative), matching imp-34127.
    id: 'imp34211-closed-form-under-shoots',
    description: 'signed residual kEnd_cf - kEnd_bis is negative (~ -0.28), matching imp-34127 sign',
    holds: () => SIGNED_RESIDUAL < 0 && SIGNED_RESIDUAL > -0.5,
  },
  {
    // (F) The canonical ceiling is named explicitly and matches the bisection root, not the closed form.
    id: 'imp34211-canonical-status-names-bisection',
    description: 'canonicalStatus.canonicalValue matches the direct-bisection root, not the closed form',
    holds: () =>
      Math.abs(
        IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.canonicalStatus.canonicalValue - KEND_DIRECT_BISECT
      ) < 1e-6 && /imp-34278/.test(IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.canonicalStatus.canonicalSource),
  },
  {
    // Honesty gate: measurement only, isRigorous false, no QED, no refereed bound is changed, K_a untouched.
    id: 'imp34211-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.isRigorous === false &&
      /NO QED/.test(IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.verdict) &&
      /refereed bound is changed/i.test(IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP.verdict),
  },
];

for (const a of IMP34211_CLOSEDFORM_VS_BISECTION_KEND_GAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34211-closedform-vs-bisection-kend-gap assertion failed: ${a.id}`);
  }
}
