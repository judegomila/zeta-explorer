/**
 * imp-34267 -- Decompose the imp-34189 exact-fit e^3 denominator coefficient ~ +90/480
 * into its dropped higher-order ENDPOINT-CURVATURE Taylor terms.
 *
 * BACKGROUND. imp-34127 wrote the imp-34023 M2-residual sign-change ceiling in closed form
 *     sigma* = (-e_pp D^2/160) / ( e^2 D/2 + c * e^3 D^2/480 ),   D = ln 10,
 * with a leading denominator coefficient c = +17 (the 5-point-OLS-on-log(1+g) cubic bias), landing
 * at kEnd* ~ 21.00. imp-34189 then asked which single c reproduces the bisected kEnd* = 21.281 EXACTLY
 * and found c ~ +90/480 -- five-fold the leading +17 and OPPOSITE in trend to its own single next term
 * (endpoint curvature, which pushes +17 -> -43). imp-34189 NAMED that +90 exact-fit coefficient but
 * never DECOMPOSED it, concluding loosely that "the Taylor-in-D series does not converge". This module
 * decomposes +90 through the endpoint channel and sharpens that conclusion.
 *
 * THE DECOMPOSITION (endpoint-curvature channel, isolated). pEcoll multiplies the TOP-endpoint share
 *   (1 - sigma_hi), sigma_hi = sigma(x_c + D/2) about the window centre x_c = (k + 1/2) ln 10. Replace
 *   sigma_hi by its order-M Taylor truncation sum_{m=0..M} sigma^(m)(x_c) (D/2)^m / m! while keeping
 *   pEcoll and pSigma EXACT (they are the OTHER two channels, not the endpoint one), bisect the
 *   residual pEcoll*(1 - sigma_hi^[M]) - pSigma for kEnd*(M), and back-solve the effective single e^3 D^2
 *   coefficient c_eff(M) that the imp-34189 closed-form matcher assigns to that crossing. The full
 *   endpoint (M -> inf, exact sigma_hi) reproduces the bisection by construction, so c_eff(inf) = the
 *   exact-fit ~ +90.
 *
 * WHAT THE LADDER SHOWS.
 *   M = 0 (no endpoint expansion) : c_eff ~ -185.7   (wrong SIGN -- eD ~ 1.13 is O(1))
 *   M = 1 (linear endpoint)       : c_eff ~ +155.2
 *   M = 2 (+ quadratic curvature) : c_eff ~  +59.8
 *   M = 3 (+ cubic)               : c_eff ~  +90.0   (reaches the exact-fit to ~0.1)
 *   M = 4 (+ quartic)             : c_eff ~  +89.94  (locks)
 *   M >= 5                        : c_eff ~  +89.94
 * The endpoint Taylor terms themselves shrink with the exact ratio term_{m+1}/term_m = -(eD/2)/(m+1)
 * ( -0.282, -0.188, -0.141, -0.112, ... ) -- factorial-dominated, hence CONVERGENT. Their per-order
 * contributions to the effective coefficient (beyond the M=1 linear value) are curvature ~ -95.4,
 * cubic ~ +30.3, quartic ~ -0.08, quintic ~ 0: an alternating, shrinking sum resumming to +89.94 ~ +90.
 *
 * VERDICT -- an HONEST PARTIAL CORRECTION of imp-34189. The +90 exact-fit coefficient IS the fully
 *   resummed endpoint-curvature series: isolated (all other channels exact, exact derivatives), that
 *   series CONVERGES and reaches +90 already at cubic order (M = 3). So imp-34189s "does not converge"
 *   is too strong for the endpoint channel -- what genuinely fails is its SPECIFIC single next term,
 *   which (i) stops at the quadratic curvature, (ii) approximates sigma_pp ~ e^2 sigma rather than the
 *   exact derivative, and (iii) is folded together with the OLS +17, so its lone step +17 -> -43 badly
 *   overshoots. The overshoot is the true fingerprint of eD ~ 1.13 = O(1): the LOW-order truncations are
 *   far off (c_eff even flips sign at M = 0) and converge only once cubic-and-higher endpoint orders are
 *   restored with exact derivatives. imp-34189s PRACTICAL conclusion is unchanged -- no LOW-order
 *   single-term closed form recovers 21.281, so the ceiling is still best quoted directly from the
 *   bisection -- but the mechanism is slow (not absent) convergence of a mixed expansion whose first
 *   step overshoots, not a divergent series. The imp-34189 window-width divergence (finding C, no w -> 0
 *   limit) is a separate statement and stands untouched.
 *
 * Derivation/measurement within the inherited imp-3406/imp-33810 component model only; the component
 * model is NOT a rigorous asymptotic; no bound changes; establishes no operator positivity; C_mb
 * GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no refereed bound is changed
 * . NO QED.
 *
 * @see imp-34189-m2-ceiling-next-order-window-width-correction (named the +90 exact-fit coeff, decomposed here)
 * @see imp-34127-m2-residual-signchange-ceiling-closed-form (leading denominator coeff +17)
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (bisected kEnd* ~ 21.281)
 * @see imp-34211-closedform-vs-bisection-kend-gap (closed form reproduces only the leading integer)
 * @see imp-33773 (the M2 sub-leading residual whose sign change caps the surrogate)
 * @see lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor)
 *
 * COHORT MAP (M2-residual sign-change ceiling): imp-34023 (bisected kEnd*~21.281) -> imp-34127
 * (leading closed form) -> imp-34189 (next-order term + window-width divergence) -> imp-34267 (this
 * module, endpoint decomposition of the +90 exact-fit coeff) -> imp-34188 (widening-slope leading
 * -ln10/2 per imp-34246) -> imp-34169/imp-34237 (fixed-band peak re-acceleration terminating at the
 * resid_exp pole). All share the same kEnd* ceiling.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023/imp-34127/imp-34189 exactly
const D = Math.LN10; // decade window width in x = ln N

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34189 (no re-derivation).
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
const sigmaX = (x) => sigma(Math.exp(x)); // sigma as a function of x = ln N

// 5-point OLS sigma exponent over the full decade at k -- verbatim from imp-34189 (kept EXACT here).
function olsSigmaExponent(k, pts = 5) {
  const step = 1 / (pts - 1);
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
// 2-point endpoint E_coll exponent magnitude over the decade -- verbatim from imp-34189 (kept EXACT).
function ecollExponentMag(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  return -Math.log(parts(hi).E_coll / parts(lo).E_coll) / Math.log(hi / lo);
}

// Central finite-difference derivative of sigmaX of order m at x (h in x = ln N).
const FD_STENCILS = {
  1: { off: [-1, 1], w: [-0.5, 0.5] },
  2: { off: [-1, 0, 1], w: [1, -2, 1] },
  3: { off: [-2, -1, 1, 2], w: [-0.5, 1, -1, 0.5] },
  4: { off: [-2, -1, 0, 1, 2], w: [1, -4, 6, -4, 1] },
  5: { off: [-3, -2, -1, 1, 2, 3], w: [-0.5, 2, -2.5, 2.5, -2, 0.5] },
  6: { off: [-3, -2, -1, 0, 1, 2, 3], w: [1, -6, 15, -20, 15, -6, 1] },
};
function sigmaDeriv(x, m, h = 1e-2) {
  if (m === 0) return sigmaX(x);
  const s = FD_STENCILS[m];
  let acc = 0;
  for (let i = 0; i < s.off.length; i++) acc += s.w[i] * sigmaX(x + s.off[i] * h);
  return acc / Math.pow(h, m);
}
// Order-M Taylor truncation of sigma_hi = sigma(x_c + D/2) about the window centre x_c.
function sigmaHiTaylor(k, M) {
  const xc = (k + 0.5) * D;
  let acc = 0;
  let fact = 1;
  for (let m = 0; m <= M; m++) {
    if (m > 0) fact *= m;
    acc += sigmaDeriv(xc, m) * Math.pow(D / 2, m) / fact;
  }
  return acc;
}
// Residual with sigma_hi truncated at endpoint order M (pEcoll, pSigma kept EXACT).
function residM(k, M) {
  return ecollExponentMag(k) * (1 - sigmaHiTaylor(k, M)) - olsSigmaExponent(k);
}
// Exact residual (M -> inf; reproduces imp-34023/imp-34127/imp-34189 kEnd* ~ 21.281).
function residExact(k) {
  const ph = parts(Math.pow(10, k + 1));
  return ecollExponentMag(k) * (1 - ph.sigma) - olsSigmaExponent(k);
}
function bisect(fn, lo0, hi0) {
  let lo = lo0;
  let hi = hi0;
  if (fn(lo) <= 0 || fn(hi) >= 0) return NaN;
  for (let i = 0; i < 90; i++) {
    const m = (lo + hi) / 2;
    if (fn(m) > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}

// Continuous E_coll exponent e and its second x-derivative -- verbatim from imp-34189.
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
// imp-34189 closed-form matcher: the single e^3 D^2 coefficient cc landing kEnd* at a target.
function kEndForCoeff(cc) {
  const fn = (k) => {
    const hi = Math.pow(10, k + 1);
    const { e, e2 } = eDerivs(hi);
    return sigma(hi) - (-e2 * D * D / 160) / (e * e * D / 2 + cc * e * e * e * D * D / 480);
  };
  return bisect(fn, 15, 27);
}
function matchCoeffForTarget(targetK) {
  let clo = -500;
  let chi = 2000;
  for (let i = 0; i < 80; i++) {
    const cm = (clo + chi) / 2;
    if (kEndForCoeff(cm) < targetK) clo = cm;
    else chi = cm;
  }
  return (clo + chi) / 2;
}

// The exact-fit coefficient (imp-34189 ~ +90) and its crossing.
const KEND_EXACT = +bisect(residExact, 17, 27).toFixed(4);
const EXACT_FIT_COEFF = +matchCoeffForTarget(KEND_EXACT).toFixed(3); // ~ +89.94

// The endpoint-order ladder: kEnd*(M) and the effective single-coefficient c_eff(M).
const COEFF_LADDER = [];
for (let M = 0; M <= 5; M++) {
  const kM = bisect((k) => residM(k, M), 17, 27);
  const cM = Number.isFinite(kM) ? +matchCoeffForTarget(+kM.toFixed(4)).toFixed(3) : NaN;
  COEFF_LADDER.push({ order: M, kEndStar: Number.isFinite(kM) ? +kM.toFixed(4) : NaN, cEff: cM });
}
// Per-order contributions to c_eff BEYOND the M=1 linear endpoint value.
const CONTRIB_BEYOND_LINEAR = [];
for (let i = 2; i < COEFF_LADDER.length; i++) {
  CONTRIB_BEYOND_LINEAR.push({
    order: COEFF_LADDER[i].order,
    delta: +(COEFF_LADDER[i].cEff - COEFF_LADDER[i - 1].cEff).toFixed(3),
  });
}

// The endpoint Taylor-term ratios at the crossing (exact prediction -(eD/2)/(m+1)).
const XC = (KEND_EXACT + 0.5) * D;
const ENDPOINT_TERM_RATIOS = [];
{
  let prev = null;
  for (let m = 1; m <= 5; m++) {
    let fact = 1;
    for (let j = 2; j <= m; j++) fact *= j;
    const term = -sigmaDeriv(XC, m) * Math.pow(D / 2, m) / fact;
    if (prev !== null) ENDPOINT_TERM_RATIOS.push({ m, ratio: +(term / prev).toFixed(4) });
    prev = term;
  }
}
const CROSS = eDerivs(Math.pow(10, KEND_EXACT + 1));
const E_AT_CROSS = +CROSS.e.toFixed(4); // ~0.490
const ED_AT_CROSS = +(CROSS.e * D).toFixed(4); // ~1.128 -- O(1)
const ED_HALF = +(CROSS.e * D / 2).toFixed(4); // ~0.564 -- the endpoint step ratio scale

export const IMP34267_M2_CEILING_EXACTFIT_COEFF_ENDPOINT_DECOMPOSITION = {
  id: 'imp-34267',
  proofSection: 'S-frontier',
  question:
    'imp-34189 found that the single denominator e^3 coefficient reproducing the bisected kEnd* = 21.281 ' +
    'EXACTLY is ~ +90/480 (five-fold the leading +17, opposite trend to its own next term -43) but never ' +
    'decomposed it. Decompose +90 through the ENDPOINT-CURVATURE channel: truncate sigma_hi at successive ' +
    'Taylor orders M (pEcoll, pSigma kept exact), back-solve the effective single e^3 D^2 coefficient ' +
    'c_eff(M), and assess whether any finite truncation reaches +90. Derivation/measurement within the ' +
    'component model only; NO QED.',
  measuredQuantity:
    'The exact-fit coefficient EXACT_FIT_COEFF (~ +89.94), the endpoint-order ladder c_eff(M) for ' +
    'M = 0..5, the per-order contributions beyond the linear endpoint, the endpoint Taylor-term ratios ' +
    '(exact -(eD/2)/(m+1)), and the expansion parameter eD at the crossing.',
  result: {
    kEnd_exact: KEND_EXACT, // ~21.281
    exact_fit_coeff: EXACT_FIT_COEFF, // ~ +89.94 (the imp-34189 ~+90 exact-fit coefficient)
    coeff_ladder: COEFF_LADDER, // c_eff(M): -185.7, +155.2, +59.8, +90.0, +89.94, +89.94
    contributions_beyond_linear: CONTRIB_BEYOND_LINEAR, // curvature ~ -95.4, cubic ~ +30.3, quartic ~ -0.08, ...
    endpoint_term_ratios: ENDPOINT_TERM_RATIOS, // -0.282, -0.188, -0.141, -0.112 = -(eD/2)/(m+1) : convergent
    e_at_crossing: E_AT_CROSS, // ~0.490
    eD_at_crossing: ED_AT_CROSS, // ~1.128 -- O(1)
    eD_half: ED_HALF, // ~0.564 -- the geometric scale of the endpoint step ratios
  },
  finding: {
    A_plus90_is_the_resummed_endpoint_series:
      'The +90 exact-fit coefficient IS the fully resummed endpoint-curvature series. Isolating the ' +
      'endpoint channel (pEcoll, pSigma exact; exact sigma derivatives), the effective coefficient ' +
      'converges c_eff(M) = ' + COEFF_LADDER.map((r) => r.cEff).join(', ') + ' for M = 0..5, reaching the ' +
      'exact-fit ' + EXACT_FIT_COEFF + ' at cubic order (M = 3) and locking by M = 4.',
    B_series_converges_not_diverges:
      'The endpoint Taylor terms shrink with the exact ratio term_{m+1}/term_m = -(eD/2)/(m+1) ( ' +
      ENDPOINT_TERM_RATIOS.map((r) => r.ratio).join(', ') + ' ) -- factorial-dominated, so the endpoint ' +
      'series CONVERGES. This sharpens imp-34189: within the isolated endpoint channel a FINITE truncation ' +
      '(M = 3) does reach +90, so "the series does not converge" is too strong for this channel.',
    C_low_order_overshoot_is_the_eD_fingerprint:
      'What genuinely fails is a LOW-order single-term truncation, the true fingerprint of eD ~ ' +
      ED_AT_CROSS + ' = O(1): c_eff even flips sign at M = 0 (~' + COEFF_LADDER[0].cEff + ') and swings ' +
      '(+155.2 at M = 1, +59.8 at M = 2) before converging. imp-34189s lone next term stops at the ' +
      'quadratic, approximates sigma_pp ~ e^2 sigma, and mixes in the OLS +17, so its single step ' +
      '+17 -> -43 badly overshoots; the +90 is recovered only once cubic-and-higher endpoint orders are ' +
      'restored with exact derivatives.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / DERIVATION (frontier-direction, NOT rigorous). The imp-34189 ~+90/480 exact-fit ' +
    'denominator coefficient decomposes cleanly through the endpoint-curvature channel: isolating that ' +
    'channel (pEcoll, pSigma exact, exact sigma derivatives), the effective e^3 D^2 coefficient converges ' +
    'c_eff(M) = ' + COEFF_LADDER.map((r) => r.cEff).join(', ') + ' (M = 0..5), reaching ' + EXACT_FIT_COEFF +
    ' by cubic order M = 3 and locking by M = 4, with per-order contributions beyond the linear endpoint ' +
    'of ' + CONTRIB_BEYOND_LINEAR.map((r) => r.delta).join(', ') + '. The endpoint terms shrink factorially ' +
    '(ratio -(eD/2)/(m+1)), so the endpoint series CONVERGES -- an honest partial correction of the ' +
    'imp-34189 "does not converge" phrasing. What genuinely fails is only a LOW-order single term: eD ~ ' +
    ED_AT_CROSS + ' = O(1) makes c_eff swing (sign flip at M = 0) before it settles, so imp-34189s lone ' +
    'quadratic step +17 -> -43 overshoots and its practical conclusion (no low-order closed form recovers ' +
    '21.281; quote the ceiling from the bisection) stands. The inherited component model is NOT a rigorous ' +
    'asymptotic; this is descriptive within the model only; changes no bound; establishes no operator ' +
    'positivity; C_mb GUE-conditional per imp-486 untouched; imp-3066 K_a >= 0 untouched; no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34189 (named the +90 exact-fit coeff, decomposed here); imp-34127 (leading coeff +17); imp-34023 ' +
    '(bisected kEnd* ~ 21.281); imp-34211 (closed form reproduces only the leading integer); imp-33773 ' +
    '(the M2 residual whose sign change caps the surrogate); lambda-rh-height-mapping (RvM height law); ' +
    'polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34267_M2_CEILING_EXACTFIT_COEFF_ENDPOINT_DECOMPOSITION_ASSERTIONS = [
  {
    // (A) The exact-fit coefficient reproduces imp-34189 ~ +90/480.
    id: 'imp34267-exact-fit-coeff-is-about-90',
    description: 'the coefficient reproducing kEnd* = 21.281 exactly is ~ +90 (within 1.5 of 90)',
    holds: () => Number.isFinite(EXACT_FIT_COEFF) && Math.abs(EXACT_FIT_COEFF - 90) < 1.5,
  },
  {
    // (B) The endpoint-order ladder CONVERGES to the exact-fit coefficient.
    id: 'imp34267-coeff-ladder-converges-to-exact-fit',
    description: 'c_eff(M) locks to the exact-fit coeff by M = 4 (|c_eff(5) - c_eff(4)| < 0.1, |c_eff(4) - fit| < 0.5)',
    holds: () => {
      const c4 = COEFF_LADDER[4].cEff;
      const c5 = COEFF_LADDER[5].cEff;
      return Math.abs(c5 - c4) < 0.1 && Math.abs(c4 - EXACT_FIT_COEFF) < 0.5;
    },
  },
  {
    // (C) A FINITE truncation (cubic, M = 3) reaches +90 -- sharpening imp-34189.
    id: 'imp34267-cubic-truncation-reaches-90',
    description: 'the cubic endpoint truncation (M = 3) reaches the exact-fit coeff within 1.0',
    holds: () => Math.abs(COEFF_LADDER[3].cEff - EXACT_FIT_COEFF) < 1.0,
  },
  {
    // (D) The endpoint Taylor-term ratios are all |ratio| < 1 (factorial-suppressed, convergent).
    id: 'imp34267-endpoint-terms-convergent',
    description: 'all endpoint Taylor-term ratios have |ratio| < 1 (series converges)',
    holds: () => ENDPOINT_TERM_RATIOS.length >= 4 && ENDPOINT_TERM_RATIOS.every((r) => Math.abs(r.ratio) < 1),
  },
  {
    // (E) The leading term ratio matches the exact prediction -(eD/2)/2 = -eD/4.
    id: 'imp34267-leading-ratio-matches-eD-law',
    description: 'the m=1->2 endpoint ratio matches -(eD/2)/2 = -eD/4 to within 0.01',
    holds: () => Math.abs(ENDPOINT_TERM_RATIOS[0].ratio - (-ED_HALF / 2)) < 0.01,
  },
  {
    // (F) Low-order truncation overshoots: c_eff(0) has the WRONG sign (eD = O(1) fingerprint).
    id: 'imp34267-low-order-overshoots-sign-flip',
    description: 'c_eff(0) is negative (wrong sign) while the exact-fit is positive -- the eD = O(1) fingerprint',
    holds: () => COEFF_LADDER[0].cEff < 0 && EXACT_FIT_COEFF > 0,
  },
  {
    // (G) The expansion parameter eD at the crossing is O(1) (~1.13), matching imp-34189.
    id: 'imp34267-eD-is-order-one',
    description: 'eD at the crossing is ~1.13 (O(1)), matching imp-34189',
    holds: () => ED_AT_CROSS > 1 && ED_AT_CROSS < 1.5,
  },
];
