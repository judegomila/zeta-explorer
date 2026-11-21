/**
 * imp-34189 -- The NEXT-ORDER window-width correction to the imp-34127 closed-form
 * M2-residual sign-change ceiling: does it close the 21.00 -> 21.281 gap?
 *
 * imp-34127 derived the imp-34023 M2-residual sign-change ceiling in closed form. With E_flow
 * negligible the CONTINUOUS residual resid = pEcoll*(1 - sigma) - pSigma cancels identically, so
 * the ceiling is a pure estimator-discretization artifact of the 2-point endpoint secant pEcoll
 * (cubic bias D^2/24) versus the 5-point OLS slope pSigma (cubic bias 17 D^2/480) over the decade
 * (D = ln 10). Balancing the retained O(D^2) terms gives
 *     sigma* = (-e_pp D^2/160) / ( e^2 D/2 + 17 e^3 D^2/480 ),
 * which inverts (via sigma ~ sqrt(L/N)) to kEnd* ~ 21.00 -- a residual of ~ -0.28 below the
 * bisected 21.281. imp-34127 NAMED the ~0.28 gap as an O((eD)^2) window-width correction
 * (e*D/4 ~ 0.28 at a full decade) but never FORMED that next-order term. This module forms it.
 *
 * THE NEXT-ORDER TERM (the endpoint-curvature contribution the leading balance dropped).
 *   pEcoll multiplies the TOP-endpoint share (1 - sigma_hi), sigma_hi = sigma(c + D/2). Taylor about
 *   the window centre c: 1 - sigma_hi = (1 - sigma) - sigma_prime (D/2) - sigma_pp (D^2/8) - ... .
 *   The leading balance kept only the LINEAR endpoint term -e sigma_prime (D/2) = e^2 sigma (D/2)
 *   (the sigma-drag) and dropped the QUADRATIC term -e sigma_pp (D^2/8). With
 *   sigma_pp ~ e^2 sigma (the far-tail curvature, sigma ~ sqrt(L/N)) this dropped term is
 *       -e sigma_pp D^2/8 ~ -e^3 sigma D^2/8 = -60 e^3 sigma D^2/480,
 *   i.e. the SAME order as the retained OLS-on-log(1+g) term +17 e^3 sigma D^2/480, and larger.
 *   Including it changes the denominator e^3 coefficient +17 -> +17 - 60 = -43:
 *       sigma*_next = (-e_pp D^2/160) / ( e^2 D/2 - 43 e^3 D^2/480 ).
 *
 * THE VERDICT -- THE NEXT-ORDER TERM DOES NOT RECOVER THE GAP; IT MOVES THE WRONG WAY.
 *   Re-inverting sigma*_next gives kEnd*_next ~ 20.72 -- FURTHER from the bisected 21.281 than the
 *   leading 21.00, not closer. The fraction of the 0.281 gap recovered is NEGATIVE (~ -1.2): the
 *   single next term roughly DOUBLES the gap. The reason is quantitative: at the crossing the local
 *   E_coll exponent e ~ 0.490, so the expansion parameter e*D = e*ln10 ~ 1.13 and (e*D)^2 ~ 1.27 --
 *   O(1), NOT small. The Taylor-in-D series therefore does not converge at a full-decade window;
 *   successive terms do not shrink and no finite truncation closes the 0.28 residual. Confirming
 *   this from the other side: the denominator e^3 coefficient that would EXACTLY reproduce 21.281 is
 *   ~ +90/480, five-fold the leading +17/480 and OPPOSITE in trend to the single next term -- there
 *   is no nearby coefficient a low-order expansion lands on. Independently, the true bisected
 *   crossing DIVERGES monotonically as the window narrows (kEnd* ~ 21.28, 21.73, 22.30, 23.17,
 *   23.94 at w = 1, 3/4, 1/2, 1/4, 1/8 decades): it has NO w -> 0 limit, so the 21.281 is not a
 *   perturbation of any converged continuous value but the finite-D reading of a non-convergent
 *   expansion. The honest resolution of the kEnd* = 21.00 -> 21.281 gap is therefore that the
 *   imp-34127 closed form is only QUALITATIVE at a full decade (eD ~ 1.13); the ceiling is best
 *   quoted directly from the bisection (21.281), not recovered by a next-order series term.
 *
 * Derivation/measurement within the inherited imp-3406/imp-33810 component model only; the component
 * model is NOT a rigorous asymptotic; no bound changes; C_mb GUE-conditional per imp-486 untouched;
 * imp-3066 K_a >= 0 untouched; no refereed bound is changed. NO QED.
 *
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (the leading closed form extended here)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (bisected kEnd* ~ 21.281)
 * @see imp-33773 (the M2 sub-leading residual whose sign change caps the surrogate)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 * @see imp-34188-widening-slope-limit-exactly-minus-one (widening-slope limit bounded by the same ceiling)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (fixed-band peak terminating at the same pole)
 * @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (viz of the imp-34169 pole)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected kEnd*~21.281) -> imp-34127
 * (leading closed form) -> imp-34189 (this module, next-order term + window-width divergence) ->
 * imp-34188 (widening-slope leading -ln10/2, observed -1 a finite-window coincidence per imp-34246) ->
 * imp-34169/imp-34237 (fixed-band peak re-acceleration
 * terminating at the resid_exp pole). All six share the same kEnd* ceiling.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023/imp-34127 exactly
const D = Math.LN10; // decade window width in x = ln N

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34127 (no re-derivation).
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

// 5-point OLS sigma exponent over a window of width w decades starting at k -- generalizes imp-34127.
function olsSigmaExponentW(k, w, pts = 5) {
  const step = w / (pts - 1);
  const xs = [];
  const ys = [];
  for (let i = 0; i < pts; i++) {
    const N = Math.pow(10, k + i * step);
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
// 2-point endpoint E_coll exponent magnitude over the w-decade window.
function ecollExponentMagW(k, w) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + w);
  return -Math.log(parts(hi).E_coll / parts(lo).E_coll) / Math.log(hi / lo);
}
// The imp-33773 M2 residual at window [10^k, 10^(k+w)] (w = 1 reproduces imp-34023/imp-34127).
function residAtW(k, w) {
  const pSigma = olsSigmaExponentW(k, w);
  const pEcoll = ecollExponentMagW(k, w);
  const ph = parts(Math.pow(10, k + w));
  return pEcoll * (1 - ph.sigma) - pSigma;
}
function bisectCrossing(residFn, lo0, hi0) {
  let lo = lo0;
  let hi = hi0;
  if (residFn(lo) <= 0 || residFn(hi) >= 0) return NaN;
  for (let i = 0; i < 90; i++) {
    const m = (lo + hi) / 2;
    if (residFn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// Continuous E_coll exponent e and its second x-derivative (x = ln N) -- verbatim from imp-34127.
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

// The bisected crossing (reproduces imp-34023/imp-34127 kEnd* ~ 21.281).
const KEND_BISECTED = +bisectCrossing((k) => residAtW(k, 1), 20, 22).toFixed(4);

// Leading closed form: denominator e^2 D/2 + 17 e^3 D^2/480 (imp-34127).
function sigmaStarLeading(k) {
  const hi = Math.pow(10, k + 1);
  const { e, e2 } = eDerivs(hi);
  return (-e2 * D * D / 160) / (e * e * D / 2 + 17 * e * e * e * D * D / 480);
}
const KEND_LEADING = +bisectCrossing((k) => sigma(Math.pow(10, k + 1)) - sigmaStarLeading(k), 15, 27).toFixed(4);

// Next-order closed form: add the endpoint-curvature term -e^3 sigma D^2/8 (= -60/480), so +17 -> -43.
const NEXT_ORDER_E3_COEFF = 17 - 60; // = -43: retained OLS +17/480 minus dropped endpoint-curvature 60/480
function sigmaStarNextOrder(k) {
  const hi = Math.pow(10, k + 1);
  const { e, e2 } = eDerivs(hi);
  return (-e2 * D * D / 160) / (e * e * D / 2 + NEXT_ORDER_E3_COEFF * e * e * e * D * D / 480);
}
const KEND_NEXT_ORDER = +bisectCrossing((k) => sigma(Math.pow(10, k + 1)) - sigmaStarNextOrder(k), 15, 27).toFixed(4);

// How much of the 0.281 gap the next-order term recovers (NEGATIVE => moves the wrong way).
const GAP_LEADING = +(KEND_BISECTED - KEND_LEADING).toFixed(4);
const GAP_NEXT_ORDER = +(KEND_BISECTED - KEND_NEXT_ORDER).toFixed(4);
const RECOVERED_FRACTION = +((GAP_LEADING - GAP_NEXT_ORDER) / GAP_LEADING).toFixed(3);

// The expansion parameter e*D at the crossing (why the series fails to converge).
const CROSS = eDerivs(Math.pow(10, KEND_BISECTED + 1));
const E_AT_CROSS = +CROSS.e.toFixed(4);
const ED_AT_CROSS = +(CROSS.e * D).toFixed(4); // ~1.13 -- O(1)
const ED2_AT_CROSS = +(CROSS.e * CROSS.e * D * D).toFixed(4); // ~1.27 -- O(1)

// The denominator e^3 coefficient that would EXACTLY reproduce 21.281 (five-fold the leading +17).
function kEndForCoeff(cc) {
  const fn = (k) => {
    const hi = Math.pow(10, k + 1);
    const { e, e2 } = eDerivs(hi);
    return sigma(hi) - (-e2 * D * D / 160) / (e * e * D / 2 + cc * e * e * e * D * D / 480);
  };
  return bisectCrossing(fn, 15, 27);
}
function solveMatchingCoeff() {
  let clo = 0;
  let chi = 2000;
  for (let i = 0; i < 80; i++) {
    const cm = (clo + chi) / 2;
    if (kEndForCoeff(cm) < KEND_BISECTED) clo = cm;
    else chi = cm;
  }
  return (clo + chi) / 2;
}
const MATCHING_E3_COEFF = +solveMatchingCoeff().toFixed(1); // ~90/480 (vs leading 17/480)

// Window-width ladder: the true crossing DIVERGES as the window narrows (no w -> 0 limit).
const WINDOW_LADDER = [1, 0.75, 0.5, 0.25, 0.125].map((w) => ({
  wDecades: w,
  kEndStar: +bisectCrossing((k) => residAtW(k, w), 15, 28).toFixed(4),
}));

export const IMP34189_M2_CEILING_NEXT_ORDER_WINDOW_WIDTH_CORRECTION = {
  id: 'imp-34189',
  proofSection: 'S-frontier',
  question:
    'imp-34127 derived the M2-residual sign-change ceiling in closed form (kEnd* ~ 21.00, ~0.28 ' +
    'below the imp-34023 bisected 21.281) and named the gap as an O((eD)^2) window-width correction ' +
    '(e*D/4 ~ 0.28) but never FORMED that next-order term. Extend the Taylor-in-D expansion of the ' +
    '2-point-secant-vs-5-point-OLS mismatch to the next order, add the correction to sigma*, re-invert ' +
    'through the sigma far-tail law, and assess how much of the 0.281 residual it recovers. ' +
    'Numerical/derivation within the component model only; NO QED.',
  measuredQuantity:
    'The next-order (endpoint-curvature) term -e sigma_pp D^2/8 ~ -60 e^3 sigma D^2/480 that the ' +
    'leading balance dropped, the re-inverted kEnd*_next it yields, the fraction of the 0.281 gap it ' +
    'recovers, the expansion parameter e*D at the crossing, the denominator e^3 coefficient that ' +
    'would reproduce 21.281 exactly, and the window-width ladder of the true crossing.',
  nextOrderTerm: {
    dropped_term:
      'pEcoll multiplies (1 - sigma_hi) with sigma_hi = sigma(c + D/2); the leading balance kept only ' +
      'the linear endpoint term -e sigma_prime (D/2) = e^2 sigma (D/2) and dropped the quadratic ' +
      '-e sigma_pp (D^2/8). With sigma_pp ~ e^2 sigma (far-tail curvature) this is -60 e^3 sigma D^2/480 ' +
      '-- the same order as the retained OLS-on-log(1+g) term +17 e^3 sigma D^2/480, and larger.',
    denominator_e3_coeff_leading: 17, // +17/480 (imp-34127)
    denominator_e3_coeff_next_order: NEXT_ORDER_E3_COEFF, // 17 - 60 = -43/480
  },
  result: {
    kEnd_bisected: KEND_BISECTED, // ~21.281
    kEnd_leading: KEND_LEADING, // ~21.00 (imp-34127)
    kEnd_next_order: KEND_NEXT_ORDER, // ~20.72 -- FURTHER from 21.281, not closer
    gap_leading: GAP_LEADING, // ~ +0.25..0.28
    gap_next_order: GAP_NEXT_ORDER, // ~ +0.56 -- roughly DOUBLE
    recovered_fraction: RECOVERED_FRACTION, // ~ -1.2 : the next term recovers NONE and moves the wrong way
    e_at_crossing: E_AT_CROSS, // ~0.490
    eD_at_crossing: ED_AT_CROSS, // ~1.13 -- O(1), NOT small
    eD_squared_at_crossing: ED2_AT_CROSS, // ~1.27 -- O(1)
    matching_e3_coeff: MATCHING_E3_COEFF, // ~90/480 : five-fold the leading +17, opposite trend to next term
    window_ladder: WINDOW_LADDER, // crossing DIVERGES as w -> 0 : no continuous limit
  },
  finding: {
    A_next_order_term_moves_the_wrong_way:
      'Adding the dropped endpoint-curvature term -e sigma_pp D^2/8 ~ -60 e^3 sigma D^2/480 changes the ' +
      'denominator e^3 coefficient +17 -> -43 and re-inverts to kEnd*_next ~ ' + KEND_NEXT_ORDER +
      ', FURTHER from the bisected ' + KEND_BISECTED + ' than the leading ' + KEND_LEADING + '. The ' +
      'fraction of the 0.281 gap recovered is ' + RECOVERED_FRACTION + ' (negative): the single next ' +
      'term roughly doubles the gap rather than closing it.',
    B_expansion_parameter_is_order_one:
      'At the crossing e ~ ' + E_AT_CROSS + ', so e*D = e*ln10 ~ ' + ED_AT_CROSS + ' and (e*D)^2 ~ ' +
      ED2_AT_CROSS + ' -- O(1), NOT small. The Taylor-in-D series does not converge at a full-decade ' +
      'window; successive terms do not shrink, so no finite truncation closes the ~0.28 residual. The ' +
      'denominator e^3 coefficient that would reproduce 21.281 exactly is ~ ' + MATCHING_E3_COEFF +
      '/480, five-fold the leading +17/480 and opposite in trend to the single next term.',
    C_true_crossing_has_no_window_limit:
      'The true bisected crossing DIVERGES monotonically as the window narrows (kEnd* ~ ' +
      WINDOW_LADDER.map((r) => r.kEndStar).join(', ') + ' at w = 1, 3/4, 1/2, 1/4, 1/8 decades): it ' +
      'has NO w -> 0 limit (the continuous residual is identically zero, so there is no crossing to ' +
      'converge to). The 21.281 is thus not a perturbation of a converged continuous value but the ' +
      'finite-D reading of a non-convergent expansion; the ceiling is best quoted directly from the ' +
      'bisection, not recovered by a next-order series term.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / DERIVATION (frontier-direction, NOT rigorous). The next-order window-width term named ' +
    'but never formed by imp-34127 does NOT close the kEnd* = 21.00 -> 21.281 gap. Forming the dropped ' +
    'endpoint-curvature term -e sigma_pp D^2/8 ~ -60 e^3 sigma D^2/480 (same order as the retained OLS ' +
    'term +17 e^3 sigma D^2/480, and larger) changes the denominator e^3 coefficient +17 -> -43 and ' +
    're-inverts to kEnd*_next ~ ' + KEND_NEXT_ORDER + ' -- FURTHER from the bisected ' + KEND_BISECTED +
    ' than the leading ' + KEND_LEADING + ', recovering a NEGATIVE fraction (' + RECOVERED_FRACTION +
    ') of the 0.281 gap. The reason is quantitative: at the crossing e ~ ' + E_AT_CROSS + ', so the ' +
    'expansion parameter e*D ~ ' + ED_AT_CROSS + ' and (e*D)^2 ~ ' + ED2_AT_CROSS + ' are O(1) -- the ' +
    'Taylor-in-D series does not converge at a full-decade window and no finite truncation closes the ' +
    'residual (the coefficient reproducing 21.281 exactly is ~ ' + MATCHING_E3_COEFF + '/480, five-fold ' +
    'the leading +17 and opposite in trend to the next term). Independently, the true crossing diverges ' +
    'monotonically as the window narrows (no w -> 0 limit), so 21.281 is the finite-D reading of a ' +
    'non-convergent expansion, best quoted directly from the bisection. The inherited component model ' +
    'is NOT a rigorous asymptotic; this is descriptive within the model only; changes no bound; ' +
    'establishes no operator positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34127 (leading closed form kEnd* ~ 21.00, extended here); imp-34023 (bisected kEnd* ~ 21.281); ' +
    'imp-33773 (the M2 residual whose sign change caps the surrogate); imp-33810 (the quarter-decade ' +
    'rungs reused verbatim); lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C ' +
    '(E_coll prefactor).',
};

export const IMP34189_M2_CEILING_NEXT_ORDER_WINDOW_WIDTH_CORRECTION_ASSERTIONS = [
  {
    // (A) The bisected crossing reproduces imp-34023/imp-34127 kEnd* ~ 21.281.
    id: 'imp34189-bisected-crossing-reproduces-imp34127',
    description: 'bisected kEnd* reproduces imp-34127 21.281 to within 0.01',
    holds: () => Number.isFinite(KEND_BISECTED) && Math.abs(KEND_BISECTED - 21.281) < 0.01,
  },
  {
    // (B) The leading closed form reproduces imp-34127 kEnd* ~ 21.00 (within 0.05).
    id: 'imp34189-leading-closed-form-reproduces-imp34127',
    description: 'leading closed-form kEnd* ~ 21.0 matches imp-34127 to within 0.05',
    holds: () => Number.isFinite(KEND_LEADING) && Math.abs(KEND_LEADING - 21.0) < 0.05,
  },
  {
    // (C) The next-order term moves the closed form FURTHER from the bisection, not closer.
    id: 'imp34189-next-order-moves-wrong-way',
    description: 'next-order kEnd* is further below 21.281 than the leading form (gap grows)',
    holds: () => KEND_NEXT_ORDER < KEND_LEADING && GAP_NEXT_ORDER > GAP_LEADING,
  },
  {
    // (D) The recovered fraction of the 0.281 gap is negative (recovers NONE).
    id: 'imp34189-recovered-fraction-negative',
    description: 'the next-order term recovers a NEGATIVE fraction of the 0.281 gap',
    holds: () => RECOVERED_FRACTION < 0,
  },
  {
    // (E) The expansion parameter e*D at the crossing is O(1) (> 1): the series does not converge.
    id: 'imp34189-expansion-parameter-is-order-one',
    description: 'e*D at the crossing exceeds 1 (~1.13), so Taylor-in-D does not converge at a full decade',
    holds: () => ED_AT_CROSS > 1 && ED_AT_CROSS < 1.5,
  },
  {
    // (F) The coefficient reproducing 21.281 is far above the leading +17 and opposite the next term.
    id: 'imp34189-matching-coeff-far-from-low-order',
    description: 'the e^3 coeff reproducing 21.281 (~90/480) is >> the leading +17 and opposite the next -43',
    holds: () => MATCHING_E3_COEFF > 60 && NEXT_ORDER_E3_COEFF < 0,
  },
  {
    // (G) The true crossing DIVERGES as the window narrows (no w -> 0 limit).
    id: 'imp34189-crossing-diverges-as-window-narrows',
    description: 'the bisected crossing rises monotonically as w shrinks (1 -> 1/8 decades)',
    holds: () => {
      for (let i = 1; i < WINDOW_LADDER.length; i++) {
        if (!(WINDOW_LADDER[i].kEndStar > WINDOW_LADDER[i - 1].kEndStar)) return false;
      }
      return true;
    },
  },
];
