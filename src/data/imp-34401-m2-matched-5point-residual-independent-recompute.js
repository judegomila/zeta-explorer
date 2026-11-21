/**
 * imp-34401 -- CROSS-VALIDATE the imp-34311 matched-5-point M2 residual finite handle
 * ~ +2.6e-7 at the canonical crossing k = 21.28095 against an INDEPENDENT second code
 * path built directly on the imp-33810 M2-endpoint component model.
 *
 * BACKGROUND.
 *   imp-34311 measured that, at the canonical bisected M2 ceiling k = kEnd* ~ 21.28095, the
 *   imp-33773 residual resid = pEcoll (1 - sigma_hi) - pSigma -- rebuilt with pEcoll discretized
 *   by the SAME 5-point OLS operator as pSigma (matched stencil) -- is still ~ +2.6e-7, whereas
 *   the native 2-point-secant pEcoll operator gives ~ 0 there by construction. That finite handle
 *   quantifies the residual 2pt-vs-5pt stencil MISMATCH between pEcoll and pSigma and underpins
 *   imp-34311/imp-34127/imp-34302 attribution of the ceiling to estimator-discretization bias.
 *   But it was asserted from ONE code path (imp-34311s incremental d += step OLS loop). A sceptic
 *   could read the ~+2.6e-7 as an artifact of that particular loop (its d += step accumulation and
 *   its +1e-9 grid guard) rather than a property of the underlying model.
 *
 * THE CROSS-CHECK (this module).
 *   Recompute the matched-5-point residual at k = 21.28095 from an INDEPENDENT second code path:
 *     (1) the parts(N) component model is reconstructed verbatim from the imp-33810 M2-endpoint
 *         constants (E_trunc = 3.06e-5, Gronwall = exp(2.37e-4), C_F = (log(T0/2pi)+1)/2pi,
 *         E_coll = C_C_PINNED sqrt(log T0 / N), sigma = E_coll/E_N) -- the SAME quantities the
 *         imp-33810 ladder tabulates, imported from the SAME light primitives (no fresh model);
 *     (2) the 5-point OLS negated-log-slope operator is coded DIFFERENTLY -- exactly five fixed
 *         sample points d = k + i/4 (i = 0..4) sampled by index (NOT the imp-34311/imp-33810
 *         incremental d += step accumulation with a +1e-9 upper guard), with the slope solved from
 *         explicit normal-equation sums. This removes any shared floating-point-accumulation or
 *         grid-count dependence between the two paths.
 *   Then compare residAlt5pt(21.28095) against the imp-34311 published handle +2.6e-7.
 *
 * THE FINDING (measurement / cross-check only).
 *   The independent path reproduces the imp-34311 matched-5-point handle:
 *     residAlt5pt(21.28095) = +2.61583743e-7  (imp-34311 residAt5pt: +2.61583743e-7)
 *   agreeing to a relative difference ~ 2.1e-10 -- far tighter than the ~+2.6e-7 handle itself.
 *   The independent 2-point residual at the same k is ~ -6.7e-13 (~ 0 by construction, five-plus
 *   orders below the 5-point handle), confirming the ~+2.6e-7 is the stencil-mismatch magnitude and
 *   NOT a coding artifact of imp-34311s particular OLS loop. The mismatch handle is real and code
 *   -path-robust.
 *
 * Measurement / cross-check only, within the inherited imp-3406/imp-33810 component model; the
 * component model is NOT a rigorous asymptotic; reproduces imp-34311 exactly and changes no
 * literal; no bound changes; establishes no operator positivity; C_mb GUE-conditional per imp-486
 * untouched; imp-3066 K_a >= 0 untouched; no refereed bound is changed. NO QED.
 *
 * @see imp-34311-m2-closedform-5point-endpoint-stencil-share (the +2.6e-7 handle cross-validated here)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the M2-endpoint component model reconstructed here)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (leading closed form + D^2/160 net bias)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (bisected kEnd* ~ 21.281)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773/imp-33810)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023/imp-34127/imp-34311 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms (verbatim from imp-33810/imp-34311; no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// INDEPENDENT 5-point OLS negated-log-slope: exactly FIVE fixed points d = k + i/4 (i = 0..4),
// sampled BY INDEX (no d += step accumulation, no +1e-9 grid guard), slope from explicit sums.
// This is a deliberately different code path from the imp-34311/imp-33810 incremental loop.
function olsNegLogSlope5(fn, k) {
  const n = 5;
  const xs = [];
  const ys = [];
  for (let i = 0; i < n; i++) {
    const d = k + i * 0.25; // exactly k, k+0.25, k+0.5, k+0.75, k+1
    const N = Math.pow(10, d);
    xs.push(d * Math.LN10); // = ln(N), computed from d to avoid a redundant log
    ys.push(Math.log(fn(N)));
  }
  let sx = 0;
  let sy = 0;
  for (let i = 0; i < n; i++) {
    sx += xs[i];
    sy += ys[i];
  }
  const mx = sx / n;
  const my = sy / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) * (xs[i] - mx);
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
// 2-point endpoint E_coll exponent magnitude (native imp-33810/imp-34127 pEcoll operator).
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}

// The imp-33773 M2 residual at boundary k with pEcoll on the MATCHED 5-point OLS stencil (imp-34311).
function residAlt5pt(k) {
  const hi = Math.pow(10, k + 1);
  return olsNegLogSlope5((N) => parts(N).E_coll, k) * (1 - parts(hi).sigma) - olsNegLogSlope5(sigma, k);
}
// The SAME residual with the native 2-point pEcoll secant (~ 0 at the canonical crossing).
function residAlt2pt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  return ecollExponentMag(lo, hi) * (1 - parts(hi).sigma) - olsNegLogSlope5(sigma, k);
}

// ---- The cross-check at the canonical crossing. ----
const KEND_CANONICAL = 21.28095; // imp-34023/imp-34169 bisected M2 ceiling (unchanged literal)
const IMP34311_HANDLE = 2.61583743e-7; // imp-34311 residAt5pt(21.28095), baked reference literal

const RESID_ALT_5PT = residAlt5pt(KEND_CANONICAL); // independent matched-5-point residual
const RESID_ALT_2PT = residAlt2pt(KEND_CANONICAL); // ~ 0 by construction (native 2-point pEcoll)
const REL_DIFF_VS_IMP34311 = Math.abs((RESID_ALT_5PT - IMP34311_HANDLE) / IMP34311_HANDLE);

export const IMP34401_M2_MATCHED_5POINT_RESIDUAL_INDEPENDENT_RECOMPUTE = {
  id: 'imp-34401',
  proofSection: 'S-frontier',
  question:
    'imp-34311 asserts, from a single code path, that at the canonical bisected M2 ceiling ' +
    'k = 21.28095 the imp-33773 residual rebuilt with a matched 5-point pEcoll stencil is still ' +
    '~ +2.6e-7 (vs ~ 0 for the native 2-point secant). Recompute that finite handle from an ' +
    'INDEPENDENT second code path built on the imp-33810 M2-endpoint component model and confirm ' +
    'the stencil-mismatch magnitude reproduces. Check only within the component model; NO QED.',
  measuredQuantity:
    'residAlt5pt(21.28095) from a reconstructed imp-33810 parts(N) model and an independently-coded ' +
    '5-point OLS negated-log-slope operator (exactly five index-sampled points d = k + i/4, explicit ' +
    'normal-equation sums; no incremental d += step accumulation), compared with the imp-34311 ' +
    'published handle +2.6e-7 and against the native 2-point residual at the same k.',
  canonicalCrossing_k: KEND_CANONICAL, // 21.28095 (unchanged imp-34023/imp-34169 literal)
  imp34311_matched5pt_handle: +IMP34311_HANDLE.toExponential(6), // +2.615837e-7 (imp-34311 residAt5pt)
  independent: {
    residAlt5pt_at_canonical: +RESID_ALT_5PT.toExponential(6), // ~ +2.615837e-7 (this path)
    residAlt2pt_at_canonical: +RESID_ALT_2PT.toExponential(4), // ~ -6.7e-13 (~ 0 by construction)
    rel_diff_vs_imp34311: +REL_DIFF_VS_IMP34311.toExponential(3), // ~ 2.1e-10 (paths agree)
  },
  finding: {
    A_independent_path_reproduces_handle:
      'The second code path -- imp-33810 parts(N) model plus an independently-coded 5-point OLS ' +
      'operator (five index-sampled points, explicit sums, no d += step loop) -- reproduces the ' +
      'imp-34311 matched-5-point residual at k = 21.28095 to a relative difference ~ 2.1e-10, far ' +
      'tighter than the ~ +2.6e-7 handle itself. The stencil-mismatch magnitude is code-path-robust.',
    B_two_point_residual_still_vanishes:
      'The independent 2-point pEcoll residual at the same k is ~ -6.7e-13, five-plus orders below ' +
      'the matched-5-point handle -- confirming the ~ +2.6e-7 is genuinely the 2pt-vs-5pt stencil ' +
      'MISMATCH between pEcoll and pSigma, not an artifact of imp-34311s particular OLS loop.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / CROSS-CHECK (frontier-direction, NOT rigorous). An INDEPENDENT second code path -- ' +
    'the imp-33810 M2-endpoint component model reconstructed verbatim, plus a 5-point OLS ' +
    'negated-log-slope operator coded differently (exactly five index-sampled points d = k + i/4, ' +
    'explicit normal-equation sums, no incremental d += step accumulation or +1e-9 grid guard) -- ' +
    'reproduces the imp-34311 matched-5-point residual at the canonical M2 crossing k = 21.28095: ' +
    'residAlt5pt = +2.615837e-7 vs the imp-34311 handle +2.615837e-7, a relative difference ~ 2.1e-10, ' +
    'while the native 2-point residual there is ~ -6.7e-13 (~ 0 by construction). The ~ +2.6e-7 ' +
    'stencil-mismatch handle is therefore real and code-path-robust, not an artifact of imp-34311s ' +
    'particular OLS loop. Reproduces imp-34311 exactly and changes no literal; the canonical ' +
    'kEnd* ~ 21.28095 reading is UNCHANGED. Descriptive within the inherited imp-3406/imp-33810 ' +
    'component model only; the model is NOT a rigorous asymptotic; changes no bound; establishes no ' +
    'operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; ' +
    'no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34311 (matched 5-point endpoint stencil, +2.6e-7 handle cross-validated here); imp-33810 ' +
    '(M2-endpoint component model reconstructed here); imp-34127 (leading closed form + D^2/160 net ' +
    'bias); imp-34023 (bisected kEnd* ~ 21.281); imp-33773 (the M2 residual); lambda-rh-height-mapping ' +
    '(RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34401_M2_MATCHED_5POINT_RESIDUAL_INDEPENDENT_RECOMPUTE_ASSERTIONS = [
  {
    // (A) The independent path reproduces the imp-34311 matched-5-point handle to < 1e-6 relative.
    id: 'imp34401-independent-path-reproduces-imp34311-handle',
    description: 'residAlt5pt(21.28095) matches the imp-34311 +2.6e-7 handle to relative < 1e-6',
    holds: () => REL_DIFF_VS_IMP34311 < 1e-6,
  },
  {
    // (B) The reproduced handle is clearly positive and of the asserted ~ +2.6e-7 magnitude.
    id: 'imp34401-matched-5pt-handle-positive-order-2p6e-7',
    description: 'the independent matched-5-point residual is in (2.0e-7, 3.2e-7) -- the imp-34311 order',
    holds: () => RESID_ALT_5PT > 2.0e-7 && RESID_ALT_5PT < 3.2e-7,
  },
  {
    // (C) The native 2-point residual still ~ vanishes at the canonical crossing (mismatch handle).
    id: 'imp34401-native-2pt-residual-vanishes-at-canonical',
    description: 'at k = 21.28095 the native 2-point residual is < 1e-9 in magnitude, far below the 5-point handle',
    holds: () => Math.abs(RESID_ALT_2PT) < 1e-9 && Math.abs(RESID_ALT_2PT) < RESID_ALT_5PT,
  },
  {
    // Honesty gate: measurement / cross-check only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34401-governance-no-qed-sota',
    description: 'isRigorous false and the verdict carries the NO QED / no-refereed-bound-change governance markers',
    holds: () =>
      IMP34401_M2_MATCHED_5POINT_RESIDUAL_INDEPENDENT_RECOMPUTE.isRigorous === false &&
      /NO QED/.test(IMP34401_M2_MATCHED_5POINT_RESIDUAL_INDEPENDENT_RECOMPUTE.verdict) &&
      /refereed bound is changed/i.test(IMP34401_M2_MATCHED_5POINT_RESIDUAL_INDEPENDENT_RECOMPUTE.verdict),
  },
];

for (const a of IMP34401_M2_MATCHED_5POINT_RESIDUAL_INDEPENDENT_RECOMPUTE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34401-m2-matched-5point-residual-independent-recompute assertion failed: ${a.id}`);
  }
}
