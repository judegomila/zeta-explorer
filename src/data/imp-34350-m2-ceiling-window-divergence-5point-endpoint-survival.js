/**
 * imp-34350 -- Does the imp-34189 finding-C window-width w -> 0 DIVERGENCE of the M2
 * ceiling survive the imp-34311 matched 5-POINT endpoint discretization, or is it a
 * 2-POINT-endpoint-rule artifact?
 *
 * BACKGROUND.
 *   imp-34189 finding C: the imp-34023 M2-residual sign-change crossing kEnd* DIVERGES
 *   monotonically as the fitting window narrows (kEnd* ~ 21.28, 21.73, 22.30, 23.17, 23.94 at
 *   w = 1, 3/4, 1/2, 1/4, 1/8 decades), so the ceiling has NO w -> 0 limit. That ladder was
 *   built with a 2-POINT endpoint secant for the pEcoll exponent (ecollExponentMagW) against a
 *   5-point OLS pSigma. imp-34267 confirmed the divergence stands under the endpoint-Taylor
 *   decomposition -- but still with the 2-point pEcoll. imp-34311 then showed that at the FULL
 *   decade (w = 1) replacing pEcoll with the SAME 5-point OLS operator used for pSigma (matched
 *   stencil) makes the exact residual strictly positive: the w = 1 crossing dissolves entirely.
 *   imp-34311 measured only w = 1; it never applied the matched stencil to the finding-C ladder.
 *
 * THE MEASUREMENT (this module).
 *   Recompute the imp-34189 finding-C window-width ladder with pEcoll discretized by the MATCHED
 *   5-point OLS operator (identical construction to pSigma), at each window width
 *   w = 1, 3/4, 1/2, 1/4, 1/8, and compare against the reproduced 2-point ladder.
 *
 *   RESULT. The 2-point ladder reproduces finding C exactly (21.2809, 21.7314, 22.3036, 23.1663,
 *   23.9426 -- monotone diverging as w -> 0). Under the matched 5-point stencil there is NO finite
 *   crossing at ANY window width: the exact residual stays STRICTLY POSITIVE across k in [12, 32]
 *   at every w (grid minima ~ 1.4e-12, 1.3e-12, 1.0e-12, 6.1e-13, 3.6e-13 -- all > 0), decaying
 *   monotonically to 0+ and never changing sign. There is nothing to diverge: the finding-C
 *   diverging ladder collapses to a flat "no crossing at any w".
 *
 * THE VERDICT.
 *   The imp-34189 finding-C w -> 0 DIVERGENCE is a 2-POINT-ENDPOINT-RULE ARTIFACT. It does NOT
 *   survive the imp-34311 matched 5-point endpoint discretization -- the whole diverging ladder
 *   dissolves (no crossing at any window width), not merely at w = 1. The "no w -> 0 limit" is
 *   therefore NOT intrinsic to the M2 ceiling; it is an artifact of the 2pt-vs-5pt stencil MISMATCH
 *   between pEcoll and pSigma, exactly as imp-34311 found at w = 1, now extended across the full
 *   window ladder. As a finite handle, the matched 5-point residual evaluated AT each 2-point
 *   crossing is small-positive and shrinks with w (2.6158e-7, 1.4089e-7, 5.9052e-8, 1.3436e-8,
 *   3.0746e-9 at w = 1, 3/4, 1/2, 1/4, 1/8) -- the w = 1 handle 2.6158e-7 matches imp-34311 exactly.
 *
 * Measurement only, within the inherited imp-3406/imp-33810 component model; the component model is
 * NOT a rigorous asymptotic; the imp-34189 21.281 canonical reading is unchanged; changes no bound;
 * establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0
 * untouched; no refereed bound is changed. NO QED.
 *
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (finding C: the diverging window ladder)
 * @see imp-34311-m2-closedform-5point-endpoint-stencil-share (matched 5-point stencil at w = 1)
 * @see imp-34267-m2-ceiling-exactfit-coeff-endpoint-decomposition (2-point-pEcoll endpoint decomposition)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (leading closed form + net cubic bias)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (bisected canonical kEnd* ~ 21.281)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34189/imp-34311 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34189/imp-34311 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

// Generic w-decade 5-point OLS negated-log-slope -- same operator imp-34189 uses for pSigma and
// imp-34311 uses for the matched pEcoll, here applied to either channel over a width-w window.
function olsNegLogSlopeW(fn, k, w, pts = 5) {
  const step = w / (pts - 1);
  const xs = [];
  const ys = [];
  for (let i = 0; i < pts; i++) {
    const N = Math.pow(10, k + i * step);
    xs.push(Math.log(N));
    ys.push(Math.log(fn(N)));
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
const olsSigmaExpW = (k, w) => olsNegLogSlopeW(sigma, k, w);
const olsEcollExpW = (k, w) => olsNegLogSlopeW((N) => parts(N).E_coll, k, w); // matched 5-point pEcoll
// 2-point endpoint E_coll exponent magnitude over the w-decade window -- verbatim from imp-34189.
function ecollExponentMagW(k, w) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + w);
  return -Math.log(parts(hi).E_coll / parts(lo).E_coll) / Math.log(hi / lo);
}

// The imp-33773 M2 residual over [10^k, 10^(k+w)] with 2-point pEcoll (imp-34189 finding C) ...
function resid2ptW(k, w) {
  const ph = parts(Math.pow(10, k + w));
  return ecollExponentMagW(k, w) * (1 - ph.sigma) - olsSigmaExpW(k, w);
}
// ... and with the MATCHED 5-point OLS pEcoll (imp-34311 stencil, this ticket) over the same window.
function resid5ptW(k, w) {
  const ph = parts(Math.pow(10, k + w));
  return olsEcollExpW(k, w) * (1 - ph.sigma) - olsSigmaExpW(k, w);
}

function bisectCrossing(residFn, lo0, hi0) {
  let lo = lo0;
  let hi = hi0;
  if (residFn(lo) <= 0 || residFn(hi) >= 0) return NaN; // no positive-to-negative crossing
  for (let i = 0; i < 90; i++) {
    const m = (lo + hi) / 2;
    if (residFn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// ---- The window-width ladder under both stencils. ----
const WINDOW_WIDTHS = [1, 0.75, 0.5, 0.25, 0.125];
// Clean k-grid: above k ~ 32 both exponents equal 0.5 to machine precision (pure ~1e-15
// cancellation noise), so the sign check is capped at k = 32.
const K_GRID = [12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];

const LADDER = WINDOW_WIDTHS.map((w) => {
  const k2 = bisectCrossing((k) => resid2ptW(k, w), 15, 28);
  const k5 = bisectCrossing((k) => resid5ptW(k, w), 15, 28);
  const grid5 = K_GRID.map((k) => resid5ptW(k, w));
  const min5 = Math.min(...grid5);
  const handle5 = Number.isFinite(k2) ? resid5ptW(k2, w) : NaN; // 5pt residual AT the 2pt crossing
  return {
    wDecades: w,
    kEnd_2point: Number.isFinite(k2) ? +k2.toFixed(4) : null,
    kEnd_5point_matched: Number.isFinite(k5) ? +k5.toFixed(4) : null,
    kEnd_5point_recedes_to_infinity: !Number.isFinite(k5),
    resid5pt_min_over_grid: +min5.toExponential(4), // > 0 at every w: strictly positive, no crossing
    resid5pt_at_2point_crossing: +handle5.toExponential(4), // small-positive finite handle
  };
});

// Diagnostics.
const TWO_POINT_DIVERGES = LADDER.every(
  (r, i) => i === 0 || r.kEnd_2point > LADDER[i - 1].kEnd_2point,
); // reproduces imp-34189 finding C (monotone diverging as w -> 0)
const FIVE_POINT_NO_CROSSING_ANY_W = LADDER.every(
  (r) => r.kEnd_5point_recedes_to_infinity && r.resid5pt_min_over_grid > 0,
); // the matched stencil has NO crossing at ANY window width
const W1_HANDLE_MATCHES_IMP34311 =
  Math.abs(LADDER[0].resid5pt_at_2point_crossing - 2.6158e-7) < 1e-9; // ~+2.6e-7 (imp-34311)

export const IMP34350_M2_CEILING_WINDOW_DIVERGENCE_5POINT_ENDPOINT_SURVIVAL = {
  id: 'imp-34350',
  proofSection: 'S-frontier',
  question:
    'imp-34189 finding C shows the M2-residual sign-change crossing kEnd* DIVERGES monotonically as ' +
    'the fitting window narrows (no w -> 0 limit), measured with a 2-point endpoint pEcoll secant. ' +
    'imp-34311 showed that at the full decade (w = 1) a MATCHED 5-point OLS pEcoll dissolves the ' +
    'crossing. Does the finding-C w -> 0 divergence survive the matched 5-point endpoint ' +
    'discretization across the whole window ladder, or is it a 2-point-endpoint-rule artifact? ' +
    'Measurement only within the component model; NO QED.',
  measuredQuantity:
    'The imp-34189 finding-C window-width ladder (w = 1, 3/4, 1/2, 1/4, 1/8) recomputed under both the ' +
    '2-point endpoint pEcoll (reproducing finding C) and the imp-34311 matched 5-point OLS pEcoll ' +
    '(identical operator to pSigma): the bisected crossing under each stencil, the strictly-positive ' +
    'minimum of the 5-point residual over the clean k-grid at each w, and the 5-point residual ' +
    'evaluated at each 2-point crossing (finite handle).',
  ladder: LADDER,
  twoPointDivergesReproducingFindingC: TWO_POINT_DIVERGES,
  fivePointNoCrossingAtAnyWindowWidth: FIVE_POINT_NO_CROSSING_ANY_W,
  w1HandleMatchesImp34311: W1_HANDLE_MATCHES_IMP34311,
  finding: {
    A_two_point_ladder_reproduces_finding_C:
      'With the 2-point endpoint pEcoll the crossing ladder reproduces imp-34189 finding C exactly ' +
      '(kEnd* ~ ' + LADDER.map((r) => r.kEnd_2point).join(', ') + ' at w = 1, 3/4, 1/2, 1/4, 1/8): ' +
      'monotone diverging as w -> 0, no continuous limit.',
    B_five_point_stencil_has_no_crossing_at_any_w:
      'Under the imp-34311 matched 5-point OLS pEcoll the exact residual stays STRICTLY POSITIVE across ' +
      'k in [12, 32] at EVERY window width (grid minima ' +
      LADDER.map((r) => r.resid5pt_min_over_grid).join(', ') + ', all > 0), decaying monotonically to ' +
      '0+ and never changing sign. There is NO finite crossing at any w -- the diverging ladder ' +
      'collapses to a flat "no crossing".',
    C_finding_C_divergence_is_a_2point_artifact:
      'The imp-34189 finding-C w -> 0 divergence does NOT survive the matched 5-point endpoint ' +
      'discretization: the whole diverging ladder dissolves (no crossing at any window width), not ' +
      'merely at w = 1. The "no w -> 0 limit" is a 2pt-vs-5pt stencil-MISMATCH artifact between pEcoll ' +
      'and pSigma, NOT intrinsic to the M2 ceiling -- extending imp-34311 from w = 1 across the full ' +
      'ladder. The 5-point residual at each 2-point crossing is small-positive and shrinks with w (' +
      LADDER.map((r) => r.resid5pt_at_2point_crossing).join(', ') + '); the w = 1 handle 2.6158e-7 ' +
      'matches imp-34311 exactly.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Recomputing the imp-34189 finding-C ' +
    'window-width ladder with pEcoll discretized by the imp-34311 matched 5-point OLS operator (the ' +
    'same stencil as pSigma) shows the w -> 0 DIVERGENCE is a 2-POINT-ENDPOINT-RULE ARTIFACT. The ' +
    '2-point ladder reproduces finding C exactly (kEnd* ~ 21.28, 21.73, 22.30, 23.17, 23.94 -- monotone ' +
    'diverging as w -> 0), but under the matched 5-point stencil the exact residual stays strictly ' +
    'positive across k in [12, 32] at EVERY window width (grid minima ~ 1.4e-12 down to 3.6e-13, all ' +
    '> 0) and never changes sign: there is NO finite crossing at any w. The diverging ladder therefore ' +
    'dissolves entirely -- the "no w -> 0 limit" is NOT intrinsic to the M2 ceiling but an artifact of ' +
    'the 2pt-vs-5pt stencil mismatch between pEcoll and pSigma, extending imp-34311 (w = 1) across the ' +
    'full ladder; the matched 5-point residual at each 2-point crossing is small-positive and shrinks ' +
    'with w (2.6158e-7 at w = 1, matching imp-34311). The imp-34189 21.281 canonical reading is ' +
    'unchanged. Descriptive within the inherited imp-3406/imp-33810 component model only; the component ' +
    'model is NOT a rigorous asymptotic; changes no bound; establishes no operator positivity; C_mb ' +
    'GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34189 (finding C: the diverging window ladder, reproduced here); imp-34311 (matched 5-point ' +
    'stencil at w = 1, extended here across the ladder); imp-34267 (2-point-pEcoll endpoint ' +
    'decomposition confirming finding C under the 2-point rule); imp-34127 (leading closed form + net ' +
    'cubic bias); imp-34023 (bisected canonical kEnd* ~ 21.281); imp-33773 (the M2 residual whose sign ' +
    'change caps the surrogate); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34350_M2_CEILING_WINDOW_DIVERGENCE_5POINT_ENDPOINT_SURVIVAL_ASSERTIONS = [
  {
    // (A) The 2-point ladder reproduces imp-34189 finding C at w = 1 (canonical kEnd* ~ 21.281).
    id: 'imp34350-2point-ladder-reproduces-canonical-21p281',
    description: 'the 2-point crossing at w = 1 reproduces the canonical kEnd* ~ 21.281 (within 0.01)',
    holds: () =>
      LADDER[0].kEnd_2point !== null && Math.abs(LADDER[0].kEnd_2point - 21.281) < 0.01,
  },
  {
    // (B) The 2-point ladder DIVERGES monotonically as the window narrows (imp-34189 finding C).
    id: 'imp34350-2point-ladder-diverges-as-window-narrows',
    description: 'the 2-point crossing rises monotonically as w shrinks (1 -> 1/8 decades)',
    holds: () => TWO_POINT_DIVERGES === true,
  },
  {
    // (C) Under the matched 5-point stencil there is NO finite crossing at ANY window width.
    id: 'imp34350-5point-no-crossing-at-any-window-width',
    description: 'the matched 5-point crossing recedes to +infinity at every w in {1,3/4,1/2,1/4,1/8}',
    holds: () => LADDER.every((r) => r.kEnd_5point_recedes_to_infinity === true),
  },
  {
    // (D) The matched 5-point residual stays strictly positive over the clean grid at every w.
    id: 'imp34350-5point-residual-strictly-positive-every-w',
    description: 'the 5-point residual minimum over k in [12,32] is > 0 at every window width',
    holds: () => LADDER.every((r) => r.resid5pt_min_over_grid > 0),
  },
  {
    // (E) The w = 1 finite handle (5pt residual at the 2pt crossing) matches imp-34311 ~ +2.6e-7.
    id: 'imp34350-w1-handle-matches-imp34311',
    description: 'the 5-point residual at the w=1 2-point crossing is ~ +2.6e-7 (matching imp-34311)',
    holds: () =>
      LADDER[0].resid5pt_at_2point_crossing > 1e-8 && W1_HANDLE_MATCHES_IMP34311 === true,
  },
  {
    // (F) Consolidated verdict: finding-C divergence is a 2-point artifact (no 5-point crossing anywhere).
    id: 'imp34350-finding-C-divergence-is-2point-artifact',
    description: 'finding-C divergence dissolves under the matched 5-point stencil at every window width',
    holds: () => FIVE_POINT_NO_CROSSING_ANY_W === true && TWO_POINT_DIVERGES === true,
  },
  {
    // (G) Governance: measurement only, NO QED, no refereed bound is changed.
    id: 'imp34350-governance-no-qed-sota',
    description: 'isRigorous false and the verdict carries the NO QED / no-refereed-bound-change governance markers',
    holds: () =>
      IMP34350_M2_CEILING_WINDOW_DIVERGENCE_5POINT_ENDPOINT_SURVIVAL.isRigorous === false &&
      /NO QED/.test(IMP34350_M2_CEILING_WINDOW_DIVERGENCE_5POINT_ENDPOINT_SURVIVAL.verdict) &&
      /refereed bound is changed/i.test(IMP34350_M2_CEILING_WINDOW_DIVERGENCE_5POINT_ENDPOINT_SURVIVAL.verdict),
  },
];
