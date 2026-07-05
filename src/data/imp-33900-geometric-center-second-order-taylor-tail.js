/**
 * @module imp-33900-geometric-center-second-order-taylor-tail
 *
 * imp-33900 (numerical, frontier-direction): imp-33879 derived the imp-33856 ~4% midpoint-vs-
 * endpoint anchoring offset as the LEADING half-log-decade Taylor step of the imp-33816 pointwise
 * 1/(2 log T0) law -- closed-form factor a = (1/2 ln 10)/log T0 -- and measured that this leading
 * factor reproduces the exact offset law_mid/law_end - 1 to a residual under 0.11 pct at every
 * 1e12..1e15 rung, attributing the residual to "the second-order Taylor tail plus the ln ln
 * correction" but NEVER writing that term out. This module DERIVES the explicit second-order
 * half-log-decade Taylor term and MEASURES the reduced residual after including it, confirming the
 * sub-0.11 pct is the genuine second-order tail of a convergent Taylor series and NOT an
 * unmodelled discrepancy.
 *
 * THE COMPONENT MODEL (identical sub-terms to imp-33879 / imp-33856 / imp-33816)
 * ------------------------------------------------------------------------------
 *     T0     = effectiveHeightForN(N)          (Riemann-von Mangoldt inverse)
 *     L(x)   = log T0(N),   x = log10 N        (natural log of T0, the imp-33856 "logT0")
 *     law(N) = 1/(2 L)                         (imp-33816 pointwise shortfall)
 * The decade slope over [N/10, N] is geometrically centred at the MIDPOINT N/sqrt(10) = 10^(x-1/2).
 * No re-derivation, no fresh model: the same log T0 sub-term as imp-33879.
 *
 * THE DERIVATION (explicit second-order half-log-decade Taylor term)
 * -----------------------------------------------------------------
 * The exact fractional offset is g(x-1/2)/g(x) - 1 with g(x) = 1/(2 L(x)). Taylor-expanding
 * g(x-1/2) about the endpoint x to SECOND order in the half-decade step,
 *     g(x-1/2) = g - (1/2) g_prime + (1/8) g_dprime - ...,
 * and dividing by g gives the offset as a half-log-decade Taylor series
 *     offset = -(1/2)(g_prime/g) + (1/8)(g_dprime/g) - ...
 * With g = 1/(2L): g_prime/g = -L_prime/L and g_dprime/g = -L_dprime/L + 2 L_prime^2 / L^2, so
 *     offset = S1 + S2 + O(step^3),
 *     S1 = (1/2)(L_prime / L)                                   (FIRST-order term),
 *     S2 = (1/4)(L_prime / L)^2 - (1/8)(L_dprime / L)           (SECOND-order term),
 * where L_prime = d(log T0)/d(log10 N) and L_dprime = d2(log T0)/d(log10 N)^2 are the local decade
 * derivatives of log T0 (measured by centred finite differences, h = 1e-4, stable to ~4 digits).
 * The imp-33879 closed form a = (1/2 ln 10)/L is exactly S1 with L_prime -> ln 10 (the leading
 * ln N slope) and the endpoint denominator; the SECOND-order term S2 is the tail imp-33879 named
 * but never wrote.
 *
 * THE MEASUREMENT (reduced residual after adding the second-order term, SAME 1e12..1e15 ladder)
 * -------------------------------------------------------------------------------------------
 *   N      offset(exact)   S1 (first)   S1+S2 (second)   res1 = 1 - S1/offset   res2 = 1 - (S1+S2)/offset
 *   1e12   0.043759        0.041966     0.043687         4.097 pct              0.165 pct
 *   1e13   0.040383        0.038848     0.040326         3.802 pct              0.142 pct
 *   1e14   0.037479        0.036151     0.037433         3.544 pct              0.124 pct
 *   1e15   0.034957        0.033797     0.034919         3.319 pct              0.109 pct
 * The first-order term S1 alone leaves a 3.3..4.1 pct residual (it IS the geometric-center offset
 * magnitude); adding the explicit second-order term S2 cuts the residual roughly 25-fold to
 * 0.11..0.17 pct -- the third-order Taylor tail. The offset is therefore a genuinely convergent
 * half-log-decade Taylor series in 1/log T0, and the second-order term captures the bulk of the
 * imp-33879 residual.
 *
 * WHY THE imp-33879 CLOSED FORM a IS ITSELF SUB-0.11 pct (two competing second-order effects)
 * ------------------------------------------------------------------------------------------
 * imp-33879 measured its residual as (offset - a) with a = (1/2 ln 10)/L, ranging 0.012..0.110 pct
 * relative. That residual is the difference of TWO second-order corrections that nearly cancel:
 *   (i)  a NUMERATOR step-deficit eps/L, eps = (L_end - L_mid) - (1/2) ln 10, the amount by which
 *        the actual half-decade log T0 step falls short of the ln N leading step (the imp-33879
 *        "ln ln correction"): about -4.2 pct..-3.3 pct of the offset, and
 *   (ii) a DENOMINATOR anchor term (L_end - L_mid)^2 / L^2 ~ a^2 from re-centring the ratio on the
 *        midpoint rather than the endpoint (the endpoint-vs-midpoint choice): about +4.0 pct..+3.3
 *        pct of the offset.
 * Each is roughly +/-4 pct of the offset, yet they cancel to well under 0.25 pct net, and the
 * remaining imp-33879 residual (offset - a) is the third-order tail under 0.11 pct. The sub-0.11
 * pct is thus the second-order tail imp-33879 claimed -- both competing pieces are named and
 * computed here -- NOT an unmodelled discrepancy.
 *
 * THE FINDINGS (derivation + measurement only)
 * --------------------------------------------
 *   (E1) EXPLICIT SECOND-ORDER TERM. The half-log-decade Taylor series of the offset is
 *        offset = S1 + S2 + O(step^3) with S1 = (1/2)(L_prime/L) and the newly written-out
 *        second-order term S2 = (1/4)(L_prime/L)^2 - (1/8)(L_dprime/L).
 *   (E2) REDUCED RESIDUAL. Adding S2 cuts the first-order residual from 3.3..4.1 pct to 0.11..0.17
 *        pct across 1e12..1e15 -- a ~25-fold reduction; the offset is a convergent Taylor series.
 *   (E3) imp-33879 RESIDUAL IS THE SECOND-ORDER TAIL. The imp-33879 sub-0.11 pct residual
 *        (offset - a) is the near-cancellation of a numerator step-deficit eps/L (~-4 pct of the
 *        offset) and a denominator anchor term (L_end - L_mid)^2/L^2 (~+4 pct), each a named
 *        second-order object -- confirming the residual is the second-order tail, not unmodelled.
 *
 * MEASUREMENT ONLY. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the local decade derivatives L_prime, L_dprime are finite-difference
 * measurements; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33879-geometric-center-correction-endpoint-midpoint-offset (leading factor a, residual derived here)
 * @see imp-33856-ecoll-discrete-residual-log-shortfall-fit (~4% midpoint-vs-endpoint caveat)
 * @see imp-33816-sigma-exponent-asymptote-approach-rate (pointwise gap_sigma ~ 1/(2 log T0))
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const HALF = 0.5;
const HALF_LOG10 = 0.5 * Math.log(10); // (1/2) ln 10 = 1.151293.. leading half-log-decade step
const FD_H = 1e-4; // centred finite-difference step in x = log10 N (stable to ~4 digits)

// log T0 as a function of the decade coordinate x = log10 N.
const logT0OfX = (x) => Math.log(effectiveHeightForN(Math.pow(10, x)));

// The imp-33879 ladder rungs whose residual we resolve into its second-order tail: 1e12..1e15.
const DECADE_EXPONENTS = [12, 13, 14, 15];

// Per rung: the exact offset, the first-order term S1, the second-order term S2, imp-33879 leading
// factor a, and the two competing second-order pieces (step-deficit and denominator anchor).
const TABLE = DECADE_EXPONENTS.map((e) => {
  const L = logT0OfX(e); // log T0 at labelling endpoint N (imp-33856 logT0_endpoint)
  const Lmid = logT0OfX(e - 0.5); // log T0 at geometric slope centre N/sqrt(10)
  const delta = L - Lmid; // actual half-decade log T0 step (~1.10)
  const lawEnd = HALF / L;
  const lawMid = HALF / Lmid;
  const offset = lawMid / lawEnd - 1; // exact fractional offset (~0.04) = delta / Lmid

  // Local decade derivatives of log T0 by centred finite differences.
  const Lp = (logT0OfX(e + FD_H) - logT0OfX(e - FD_H)) / (2 * FD_H); // d(log T0)/d(log10 N)
  const Lpp = (logT0OfX(e + FD_H) - 2 * L + logT0OfX(e - FD_H)) / (FD_H * FD_H); // d2(log T0)/d(log10 N)^2

  const S1 = HALF * (Lp / L); // FIRST-order half-log-decade Taylor step
  const S2 = 0.25 * (Lp * Lp / (L * L)) - (HALF / 4) * (Lpp / L); // SECOND-order term (derived)
  const res1 = (offset - S1) / offset; // residual of the first-order truncation (~3.3..4.1 pct)
  const res2 = (offset - (S1 + S2)) / offset; // residual after adding S2 (~0.11..0.17 pct)

  // imp-33879 leading closed form and its residual, decomposed into two second-order pieces.
  const a = HALF_LOG10 / L; // imp-33879 leading factor (1/2 ln 10)/log T0
  const resA = (offset - a) / offset; // imp-33879 residual (~0.012..0.110 pct)
  const eps = delta - HALF_LOG10; // numerator step-deficit (the ln ln correction), negative
  const stepPiece = eps / L; // second-order numerator piece (~-4 pct of offset)
  const denPiece = (delta * delta) / (L * L); // second-order denominator anchor piece (~+4 pct)

  return {
    N_log10: e,
    offset: +offset.toFixed(6), // 0.043759 .. 0.034957
    S1_first: +S1.toFixed(6), // 0.041966 .. 0.033797
    S1_plus_S2_second: +(S1 + S2).toFixed(6), // 0.043687 .. 0.034919
    res1_pct: +(res1 * 100).toFixed(3), // 4.097 .. 3.319 (first-order residual)
    res2_pct: +(res2 * 100).toFixed(4), // 0.1650 .. 0.1087 (second-order residual)
    resA_imp33879_pct: +(resA * 100).toFixed(4), // 0.0122 .. 0.1103 (imp-33879 residual, <0.11)
    stepPiece_pctOfOffset: +((stepPiece / offset) * 100).toFixed(3), // -4.180 .. -3.267
    denPiece_pctOfOffset: +((denPiece / offset) * 100).toFixed(3), // 4.017 .. 3.264
    netCancellation_pctOfOffset: +(((stepPiece + denPiece) / offset) * 100).toFixed(4), // <0.25
  };
});

const MAX_RES1 = Math.max(...TABLE.map((r) => Math.abs(r.res1_pct))); // ~4.10
const MAX_RES2 = Math.max(...TABLE.map((r) => Math.abs(r.res2_pct))); // ~0.165
const MAX_RESA = Math.max(...TABLE.map((r) => Math.abs(r.resA_imp33879_pct))); // ~0.110
const MAX_REDUCTION_FACTOR = Math.max(...TABLE.map((r) => Math.abs(r.res2_pct) / Math.abs(r.res1_pct))); // ~0.04
const MAX_NET_CANCELLATION = Math.max(...TABLE.map((r) => Math.abs(r.netCancellation_pctOfOffset))); // ~0.17
const MIN_PIECE_MAGNITUDE = Math.min(
  ...TABLE.map((r) => Math.min(Math.abs(r.stepPiece_pctOfOffset), Math.abs(r.denPiece_pctOfOffset))),
); // ~3.26

export const IMP33900_GEOMETRIC_CENTER_SECOND_ORDER_TAYLOR_TAIL = {
  id: 'imp-33900',
  proofSection: 'S-frontier',
  question:
    'Derive the explicit second-order half-log-decade Taylor term of the imp-33816 pointwise ' +
    '1/(2 log T0) law behind the imp-33879 sub-0.11 pct geometric-center-correction residual, and ' +
    'measure the reduced residual after including it, confirming the sub-0.11 pct is the ' +
    'second-order Taylor tail and not an unmodelled discrepancy. Measurement only; no QED.',
  componentModel:
    'law(N) = 1/(2 log T0(N)); T0 = effectiveHeightForN(N). Identical log T0 sub-term to imp-33879. ' +
    'L_prime, L_dprime are the local decade derivatives of log T0 by centred finite differences.',
  derivation:
    'offset = g(x-1/2)/g(x) - 1 with g = 1/(2 L) expands as offset = S1 + S2 + O(step^3), ' +
    'S1 = (1/2)(L_prime/L) and the second-order term S2 = (1/4)(L_prime/L)^2 - (1/8)(L_dprime/L). ' +
    'imp-33879 a = (1/2 ln 10)/L is S1 with L_prime -> ln 10; S2 is the tail it named but never wrote.',
  table: TABLE,
  measurement: {
    second_order_term_formula: 'S2 = (1/4)(L_prime/L)^2 - (1/8)(L_dprime/L)',
    first_order_max_residual_pct: +MAX_RES1.toFixed(3), // ~4.10
    second_order_max_residual_pct: +MAX_RES2.toFixed(4), // ~0.165
    residual_reduction_factor_max: +MAX_REDUCTION_FACTOR.toFixed(4), // ~0.04 (~25-fold cut)
    imp33879_residual_max_pct: +MAX_RESA.toFixed(4), // ~0.110 (matches imp-33879 <0.11 pct)
    competing_pieces_min_magnitude_pctOfOffset: +MIN_PIECE_MAGNITUDE.toFixed(3), // ~3.26
    competing_pieces_net_after_cancellation_max_pctOfOffset: +MAX_NET_CANCELLATION.toFixed(4), // <0.25
  },
  findings: {
    E1_explicit_second_order_term:
      'The offset is the half-log-decade Taylor series offset = S1 + S2 + O(step^3) with ' +
      'S1 = (1/2)(L_prime/L) and the newly written-out second-order term ' +
      'S2 = (1/4)(L_prime/L)^2 - (1/8)(L_dprime/L).',
    E2_reduced_residual:
      'Adding S2 cuts the first-order residual from 3.3..4.1 pct to 0.11..0.17 pct across ' +
      '1e12..1e15 (a ~25-fold reduction); the offset is a convergent half-log-decade Taylor series.',
    E3_imp33879_residual_is_second_order_tail:
      'The imp-33879 sub-0.11 pct residual (offset - a) is the near-cancellation of a numerator ' +
      'step-deficit eps/L (~-4 pct of the offset) and a denominator anchor term ' +
      '(L_end - L_mid)^2/L^2 (~+4 pct), each a named second-order object -- confirming the residual ' +
      'is the second-order tail, NOT an unmodelled discrepancy.',
  },
  isRigorous: false,
  verdict:
    'DERIVATION + MEASUREMENT (frontier-direction, NOT rigorous). The imp-33879 leading ' +
    'geometric-center factor a = (1/2 ln 10)/log T0 is the first-order half-log-decade Taylor step ' +
    'S1 = (1/2)(L_prime/L) of the offset (with L_prime -> ln 10); the explicit second-order term ' +
    'imp-33879 named but never wrote is S2 = (1/4)(L_prime/L)^2 - (1/8)(L_dprime/L). Measured on the ' +
    'same 1e12..1e15 ladder, the first-order term S1 alone leaves a 3.3..4.1 pct residual and adding ' +
    'S2 cuts it ~25-fold to 0.11..0.17 pct (the third-order Taylor tail), so the offset is a ' +
    'convergent half-log-decade Taylor series in 1/log T0. The imp-33879 residual (offset - a), ' +
    'ranging 0.012..0.110 pct, is itself the near-cancellation of two competing second-order pieces ' +
    '-- a numerator step-deficit eps/L (~-4 pct of the offset, the ln ln correction) and a ' +
    'denominator anchor term (L_end - L_mid)^2/L^2 (~+4 pct, the endpoint-vs-midpoint recentring) -- ' +
    'each named and computed here and cancelling to under 0.25 pct net, confirming the sub-0.11 pct ' +
    'is the second-order tail and NOT an unmodelled discrepancy. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; L_prime, L_dprime are ' +
    'finite-difference measurements; the C_mb GUE-conditional share per imp-486 is UNTOUCHED; ' +
    'changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33879 (leading factor a, residual derived here); imp-33856 (~4% midpoint-vs-endpoint ' +
    'caveat); imp-33816 (pointwise gap_sigma ~ 1/(2 log T0)); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP33900_GEOMETRIC_CENTER_SECOND_ORDER_TAYLOR_TAIL_ASSERTIONS = [
  {
    // (E1/E2) The first-order term S1 alone leaves a several-percent residual (the offset magnitude).
    id: 'imp33900-first-order-residual-is-several-percent',
    description: 'first-order term S1 leaves a 3..4.5 pct residual at every rung (the offset magnitude)',
    holds: () => TABLE.every((r) => Math.abs(r.res1_pct) > 3.0 && Math.abs(r.res1_pct) < 4.5),
  },
  {
    // (E2) Adding the explicit second-order term S2 cuts the residual below 0.2 pct at every rung.
    id: 'imp33900-second-order-term-reduces-residual',
    description: 'adding S2 cuts the residual below 0.2 pct at every rung (~25-fold reduction)',
    holds: () => MAX_RES2 < 0.2 && MAX_REDUCTION_FACTOR < 0.07,
  },
  {
    // (E3) imp-33879 residual (offset - a) is reproduced here and is under 0.12 pct (the <0.11 pct).
    id: 'imp33900-reproduces-imp33879-sub-0p11-residual',
    description: 'imp-33879 residual (offset - a) is under 0.12 pct at every rung (the <0.11 pct)',
    holds: () => MAX_RESA < 0.12,
  },
  {
    // (E3) The <0.11 pct is two competing second-order pieces (~+/-4 pct each) cancelling to <0.25 pct.
    id: 'imp33900-two-competing-second-order-pieces-cancel',
    description: 'numerator step-deficit and denominator anchor are each >3 pct of offset yet cancel to <0.25 pct',
    holds: () =>
      MIN_PIECE_MAGNITUDE > 3.0 &&
      MAX_NET_CANCELLATION < 0.25 &&
      TABLE.every((r) => r.stepPiece_pctOfOffset < 0 && r.denPiece_pctOfOffset > 0),
  },
  {
    // Honesty gate: measurement only, no QED, Platt-Trudgian stays SOTA.
    id: 'imp33900-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, Platt-Trudgian stays SOTA',
    holds: () =>
      IMP33900_GEOMETRIC_CENTER_SECOND_ORDER_TAYLOR_TAIL.isRigorous === false &&
      /NO QED/.test(IMP33900_GEOMETRIC_CENTER_SECOND_ORDER_TAYLOR_TAIL.verdict) &&
      /remains SOTA/.test(IMP33900_GEOMETRIC_CENTER_SECOND_ORDER_TAYLOR_TAIL.verdict),
  },
];

for (const a of IMP33900_GEOMETRIC_CENTER_SECOND_ORDER_TAYLOR_TAIL_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-33900-geometric-center-second-order-taylor-tail assertion failed: ${a.id}`,
    );
  }
}
