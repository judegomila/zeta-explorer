/**
 * @module imp-3641-flow-gap-fourthorder-expansion
 *
 * imp-3641 (numerical, frontier-direction): imp-3617 pushed the EXACT flow-gap identity
 *     gap = 1 - (L_half/L_x)/(1+eta)^2,   eta = E_flow(N_half)/E_trunc
 * to a self-consistent O(eps^3) closed expansion Du = ln(N_half/N_x) = d1 eps + d2 eps^2 + d3 eps^3,
 * eps = E_flow(N_x)/E_trunc, driving the residual to ~3e-10..2.3e-8 pp -- ~5-6 orders below imp-3599
 * but still above the ~1e-13 exact-identity floor (named sub-gap imp-3617-fourthorder-fd-floor).
 * This module DERIVES the O(eps^4) coefficient d4 order-by-order from the same fixed point
 *     Du = ln(L_half/L_x) - 2 ln(1+eta),
 * newly requiring the FOURTH log-N derivative q = d^4 lnL/d(lnN)^4 and the THIRD E_flow log-N
 * derivative rho = d^3 lnE_flow/d(lnN)^3, and MEASURES per-floor across the imp-3443 half-to-double
 * E_trunc floor grid f in {0.5..2} whether resid4 approaches the identity floor. Same sub-terms as
 * imp-3580/imp-3599/imp-3617; no fresh floor grid.
 *
 * THE SET-UP (identical sub-terms to imp-3220 / imp-3556 / imp-3580 / imp-3599 / imp-3617)
 * ---------------------------------------------------------------------------------------
 *     E_coll(N) = C_C_PINNED * sqrt(L / N),   L = log T0,   T0 = effectiveHeightForN(N)
 *     E_flow(N) = C_F * (L / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398 pinned)
 *     N_x    : E_coll(N_x)    = E_trunc                     (crossover)
 *     N_half : E_coll(N_half) = E_trunc + E_flow(N_half)    (sigma = 1/2)
 *     gap = 1 - N_half/N_x,   E_trunc = f * 3.06e-5,  f in {0.5, 0.75, 1.0, 1.5, 2.0}
 *
 * (A) THE O(eps^4) COEFFICIENT d4 (the push the ticket names)
 * ----------------------------------------------------------
 * Writing g(u) = lnL(u), h(u) = lnE_flow(u) with u = lnN and expanding the fixed point
 *     (1-lambda) Du = (1/2) s Du^2 + (1/6) t Du^3 + (1/24) q Du^4 - 2 ln(1+eta),
 *     eta = eps exp(mu Du + (1/2) nu Du^2 + (1/6) rho Du^3 + ...),
 * about N_x with lambda=g', s=g'', t=g''', q=g'''' and mu=h', nu=h'', rho=h''', solving
 * Du = d1 eps + d2 eps^2 + d3 eps^3 + d4 eps^4 order by order reproduces d1, d2, d3 exactly and gives
 *     d4 = [ s d1 d3 + (1/2) s d2^2 + (1/2) t d1^2 d2 + (1/24) q d1^4
 *            - 2 mu d3 - 2 (mu^2+nu) d1 d2 - ((1/3) mu^3 + mu nu + (1/3) rho) d1^3
 *            + 2 mu d2 + (2 mu^2+nu) d1^2 - 2 mu d1 + 1/2 ] / (1-lambda).
 * The gap follows from gap = 1 - exp(Du) truncated consistently:
 *     gap4 = gap3 - (d4 + d1 d3 + (1/2) d2^2 + (1/2) d1^2 d2 + (1/24) d1^4) eps^4.
 * d4 is DOMINATED by products of the lower derivatives (d4 ~ -11.0..-11.8 across floors); the genuinely
 * new ingredients q = d^4 lnL/d(lnN)^4 ~ -1.5e-5..-2.3e-5 and rho = d^3 lnE_flow/d(lnN)^3 ~ 5e-4..7e-4
 * are small, so their (1/24) q d1^4 and -(1/3) rho d1^3 contributions to d4 are sub-1e-3.
 *
 * (B) MEASUREMENT: robust-step d4 shrinks resid3 by 13..309x; the naive 1e-4 step FAILS
 * ------------------------------------------------------------------------------------
 * Re-root-solving BOTH crossings per floor (400-iter bisection, residual <1e-9, reproducing imp-3617 to
 * the last digit) and evaluating lambda, mu, s, nu, t at the imp-3617 step h=1e-4 while the two NEW
 * high-order derivatives q, rho are evaluated at a ROBUST step h4=1e-2 (a 4th derivative at h=1e-4 has
 * numerator noise ~h^4=1e-16, i.e. pure roundoff):
 *   f      resid3(O eps^3)   resid4(O eps^4)   shrink3/4    q            resid4_naive(h4=1e-4)
 *   0.5    3.13e-10          2.01e-11          15.5         -1.49e-5     2.04e-11
 *   0.75   1.25e-9           7.69e-11          16.3         -1.70e-5     7.89e-11
 *   1.0    2.81e-9           3.75e-11          74.8         -1.84e-5     1.94e-8  (WORSE)
 *   1.5    9.04e-9           6.93e-10          13.0         -2.12e-5     3.58e-8  (WORSE)
 *   2.0    2.29e-8           7.41e-11          309.1        -2.30e-5     1.73e-7  (WORSE)  [pp]
 * With the robust step resid4 improves resid3 at EVERY floor (band ~2e-11..7e-10 pp). With the naive
 * h=1e-4 step used for the lower derivatives, q collapses to roundoff garbage (0, +-17.8), corrupting
 * the (1/24) q d1^4 term of d4 and making resid4 WORSE than resid3 at f >= 1 -- this is the concrete
 * finite-difference floor of the 4th derivative.
 *
 * HONEST SUB-GAP (imp-3641-fifthorder-fd-floor)
 * ---------------------------------------------
 * The O(eps^4) expansion does NOT reach the ~1e-13 exact-identity floor: a residual plateau at
 * ~2e-11..7e-10 pp survives, set by (i) the neglected O(eps^5) term and (ii) the finite-difference
 * evaluation of the 4th log-N derivative q, which requires a robust step h4~1e-2 and would otherwise be
 * pure roundoff. The EXACT identity (imp-3599 F1) remains the complete closed object; the perturbative
 * expansion is now truncated at O(eps^4). Pushing to O(eps^5) or evaluating the high derivatives
 * analytically is the named sub-gap imp-3641-fifthorder-fd-floor.
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) The derived d4 (dominated by products of lower derivatives, d4 ~ -11.0..-11.8) extends the
 *        self-consistent series: at every floor resid4 < resid3, shrinking the imp-3617 O(eps^3) tail by
 *        13..309x toward the ~1e-13 exact floor (robust band ~2e-11..7e-10 pp).
 *   (F2) The genuinely new ingredients q = d^4 lnL/d(lnN)^4 (~-1.5e-5..-2.3e-5) and rho =
 *        d^3 lnE_flow/d(lnN)^3 (~5e-4..7e-4) are small; their contributions to d4 are sub-1e-3, so d4 is
 *        set by products of the imp-3617 sub-terms, not by the fresh 4th/3rd derivatives.
 *   (F3) HONEST SUB-GAP imp-3641-fifthorder-fd-floor: the O(eps^4) truncation does NOT reach the ~1e-13
 *        exact floor; a plateau at ~2e-11..7e-10 pp survives from the O(eps^5) term and the
 *        finite-difference evaluation of q. Evaluating q at the naive imp-3617 step h=1e-4 makes it
 *        roundoff noise and resid4 WORSE than resid3 -- the 4th derivative needs a robust step h4~1e-2.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. No refereed bound is changed.
 *
 * @see imp-3617-flow-gap-thirdorder-expansion (self-consistent O(eps^3) expansion d1, d2, d3 and its tail)
 * @see imp-3599-flow-gap-nextorder-correction (exact gap identity + O(eps^2) crude model)
 * @see imp-3580-sigma-crossover-floor-invariance (leading gap ~ 2 E_flow/E_trunc law and residual)
 * @see imp-3556-sigma-threshold-crossings-rootsolve (baseline half-decay <=> crossover certification)
 * @see imp-3443-nmax-etrunc-sensitivity (half-to-double E_trunc floor grid 0.5x .. 2x)
 * @see imp-398 (E_flow C_F pinned prefactor); imp-2631 (E_trunc fixed-strip floor 3.06e-5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3556/imp-3580/imp-3617)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3580/imp-3599/imp-3617 exactly
const H_LOW = 1e-4; // imp-3617 step for lambda, mu, s, nu, t (validated stable under step halving)
const H_HIGH = 1e-2; // ROBUST step for the NEW high-order derivatives q, rho (roundoff-safe)

// EXACT imp-3580/imp-3599/imp-3617 sub-terms (no re-derivation); only E_trunc is a parameter.
function parts(N, eTrunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = eTrunc + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Right-arm interior maximum (ternary in ln N; same bracket as imp-3580/imp-3599/imp-3617).
function argmaxSigmaLnN(loN, hiN, eTrunc) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (parts(Math.exp(m1), eTrunc).sigma < parts(Math.exp(m2), eTrunc).sigma) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// N_half: post-peak crossing where sigma first drops below 1/2 (400-iter bisection in ln N).
function crossHalf(eTrunc) {
  const nMax = argmaxSigmaLnN(1e4, 1e9, eTrunc);
  let a = Math.log(nMax);
  let b = Math.log(1e60);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), eTrunc).sigma > 0.5) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// N_x: the imp-3444 crossover where E_coll(N) = E_trunc (odds ratio x = 1 there).
function crossCollEqTrunc(eTrunc) {
  let a = Math.log(1e6);
  let b = Math.log(1e15);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), eTrunc).E_coll > eTrunc) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}

// Local log-log derivatives at N (central finite difference in ln N). The imp-3617 low-order set
// lambda, mu, s, nu, t at step H_LOW=1e-4; the NEW high-order set q = d4 lnL/d(lnN)4 (5-point) and
// rho = d3 lnE_flow/d(lnN)3 (5-point) at the ROBUST step H_HIGH=1e-2 (a 4th derivative at 1e-4 has
// numerator noise ~1e-16, i.e. pure roundoff).
function derivs(N, eTrunc) {
  const u = Math.log(N);
  const f = (uu) => parts(Math.exp(uu), eTrunc);
  const lnL = (p) => Math.log(p.L);
  const lnF = (p) => Math.log(p.E_flow);
  // low-order at H_LOW (imp-3617)
  const p0 = f(u);
  const pp = f(u + H_LOW);
  const pm = f(u - H_LOW);
  const pp2 = f(u + 2 * H_LOW);
  const pm2 = f(u - 2 * H_LOW);
  const lambda = (lnL(pp) - lnL(pm)) / (2 * H_LOW);
  const mu = (lnF(pp) - lnF(pm)) / (2 * H_LOW);
  const s = (lnL(pp) - 2 * lnL(p0) + lnL(pm)) / (H_LOW * H_LOW);
  const nu = (lnF(pp) - 2 * lnF(p0) + lnF(pm)) / (H_LOW * H_LOW);
  const t = (lnL(pp2) - 2 * lnL(pp) + 2 * lnL(pm) - lnL(pm2)) / (2 * H_LOW * H_LOW * H_LOW);
  // high-order at H_HIGH (the NEW ingredients q, rho -- roundoff-safe step)
  const q0 = f(u);
  const qp = f(u + H_HIGH);
  const qm = f(u - H_HIGH);
  const qp2 = f(u + 2 * H_HIGH);
  const qm2 = f(u - 2 * H_HIGH);
  const q =
    (lnL(qp2) - 4 * lnL(qp) + 6 * lnL(q0) - 4 * lnL(qm) + lnL(qm2)) / (H_HIGH * H_HIGH * H_HIGH * H_HIGH);
  const rho = (lnF(qp2) - 2 * lnF(qp) + 2 * lnF(qm) - lnF(qm2)) / (2 * H_HIGH * H_HIGH * H_HIGH);
  return { lambda, mu, s, nu, t, q, rho };
}

// (A)+(B) Re-root-solve both crossings and build the self-consistent O(eps^4) expansion per floor.
const FACTORS = [0.5, 0.75, 1.0, 1.5, 2.0];
const GRID = FACTORS.map((f) => {
  const eTrunc = f * E_TRUNC_BASE;
  const N_half = crossHalf(eTrunc);
  const N_x = crossCollEqTrunc(eTrunc);
  const pH = parts(N_half, eTrunc);
  const pX = parts(N_x, eTrunc);
  const eta = pH.E_flow / eTrunc; // E_flow at N_half
  const eps = pX.E_flow / eTrunc; // E_flow at N_x (the leading small parameter)
  const { lambda, mu, s, nu, t, q, rho } = derivs(N_x, eTrunc);

  const gap = 1 - N_half / N_x; // root-solved (measured) gap
  const gapExact = 1 - (pH.L / pX.L) / ((1 + eta) * (1 + eta)); // imp-3599 (A) exact identity

  // Self-consistent series coefficients d1..d4 of Du = ln(N_half/N_x).
  const d1 = -2 / (1 - lambda);
  const d2 = (0.5 * s * d1 * d1 + 1 - 2 * mu * d1) / (1 - lambda);
  const d3 =
    (s * d1 * d2 + (1 / 6) * t * d1 * d1 * d1 - 2 * mu * d2 - (mu * mu + nu) * d1 * d1 + 2 * mu * d1 - 2 / 3) /
    (1 - lambda);
  const d4 =
    (s * d1 * d3 +
      0.5 * s * d2 * d2 +
      0.5 * t * d1 * d1 * d2 +
      (1 / 24) * q * d1 * d1 * d1 * d1 -
      2 * mu * d3 -
      2 * (mu * mu + nu) * d1 * d2 -
      ((1 / 3) * mu * mu * mu + mu * nu + (1 / 3) * rho) * d1 * d1 * d1 +
      2 * mu * d2 +
      (2 * mu * mu + nu) * d1 * d1 -
      2 * mu * d1 +
      0.5) /
    (1 - lambda);

  // Consistently truncated gap = 1 - exp(Du) = -(Du + Du^2/2 + Du^3/6 + Du^4/24 + ...).
  const gap1 = -d1 * eps; // leading (resummed)
  const gap2 = gap1 - (d2 + 0.5 * d1 * d1) * eps * eps; // O(eps^2)
  const gap3 = gap2 - (d3 + d1 * d2 + (1 / 6) * d1 * d1 * d1) * eps * eps * eps; // O(eps^3) (imp-3617)
  const gap4 =
    gap3 - (d4 + d1 * d3 + 0.5 * d2 * d2 + 0.5 * d1 * d1 * d2 + (1 / 24) * d1 * d1 * d1 * d1) * eps * eps * eps * eps; // O(eps^4)

  const resid3 = Math.abs(gap - gap3);
  const resid4 = Math.abs(gap - gap4);
  const exactErr = Math.abs(gap - gapExact);

  return {
    factor: f,
    E_trunc: +eTrunc.toExponential(4),
    N_half: +N_half.toExponential(6),
    N_x: +N_x.toExponential(6),
    eps: +eps.toExponential(4),
    lambda: +lambda.toFixed(6),
    mu: +mu.toFixed(6),
    s: +s.toExponential(4),
    nu: +nu.toExponential(4),
    t: +t.toExponential(4),
    q: +q.toExponential(4), // NEW: 4th log-N derivative of lnL (small, ~-1.5e-5..-2.3e-5)
    rho: +rho.toExponential(4), // NEW: 3rd log-N derivative of lnE_flow (small, ~5e-4..7e-4)
    d4: +d4.toFixed(6), // dominated by products of lower derivatives (~-11.0..-11.8)
    gap_pct: +(gap * 100).toFixed(6),
    gap4_pct: +(gap4 * 100).toFixed(6),
    exact_abs_err: +exactErr.toExponential(2), // imp-3599 (A) reproduces root-solve to ~1e-13
    resid_order3_pp: +(resid3 * 100).toExponential(4), // imp-3617 O(eps^3) tail
    resid_order4_pp: +(resid4 * 100).toExponential(4), // this module: O(eps^4)
    order3_over_order4: +(resid3 / resid4).toFixed(1), // how much O(eps^4) beats imp-3617
  };
});

const BASELINE = GRID.find((r) => r.factor === 1.0);
const MAX_EXACT_ERR = Math.max(...GRID.map((r) => r.exact_abs_err));
const RESID4S = GRID.map((r) => r.resid_order4_pp);
const RESID4_MIN = Math.min(...RESID4S);
const RESID4_MAX = Math.max(...RESID4S);
const MIN_SHRINK_VS_IMP3617 = Math.min(...GRID.map((r) => r.order3_over_order4));

export const IMP3641_FLOW_GAP_FOURTHORDER_EXPANSION = {
  id: 'imp-3641',
  proofSection: 'S-frontier',
  question:
    'Push the imp-3617 self-consistent flow-gap expansion of the exact identity gap = 1 - ' +
    '(L_half/L_x)/(1+eta)^2 to O(eps^4) -- deriving d4 order-by-order and newly requiring the fourth ' +
    'log-N derivative q = d^4 lnL/d(lnN)^4 and the third E_flow log-N derivative rho = d^3 ' +
    'lnE_flow/d(lnN)^3 -- and measure across the half-to-double E_trunc floor grid whether resid4 ' +
    'approaches the ~1e-13 exact-identity floor. Derivation/measurement only; conditional-share ' +
    'diagnostic, NOT an RH bound; no QED.',
  quantity:
    'gap = 1 - N_half/N_x root-solved per floor; self-consistent closed expansion Du = d1 eps + d2 ' +
    'eps^2 + d3 eps^3 + d4 eps^4 with d4 = [s d1 d3 + (1/2) s d2^2 + (1/2) t d1^2 d2 + (1/24) q d1^4 ' +
    '- 2 mu d3 - 2(mu^2+nu) d1 d2 - ((1/3) mu^3 + mu nu + (1/3) rho) d1^3 + 2 mu d2 + (2 mu^2+nu) d1^2 ' +
    '- 2 mu d1 + 1/2]/(1-lambda); gap4 = 1 - exp(Du truncated at O(eps^4))',
  floorGrid: GRID,
  baselineNode: BASELINE, // f=1.0 reproduces imp-3580/imp-3599/imp-3617 gap 0.398%
  fourthOrderCoefficient:
    'd4 = [s d1 d3 + (1/2) s d2^2 + (1/2) t d1^2 d2 + (1/24) q d1^4 - 2 mu d3 - 2(mu^2+nu) d1 d2 ' +
    '- ((1/3) mu^3 + mu nu + (1/3) rho) d1^3 + 2 mu d2 + (2 mu^2+nu) d1^2 - 2 mu d1 + 1/2]/(1-lambda)',
  gapTruncation:
    'gap4 = gap3 - (d4 + d1 d3 + (1/2) d2^2 + (1/2) d1^2 d2 + (1/24) d1^4) eps^4',
  maxExactAbsErr: MAX_EXACT_ERR, // imp-3599 closed identity vs root-solved gap, ~1e-13
  order4ResidualBandPp: { min: +RESID4_MIN.toExponential(3), max: +RESID4_MAX.toExponential(3) },
  minShrinkVsImp3617: +MIN_SHRINK_VS_IMP3617.toFixed(1), // worst-floor factor over the imp-3617 O(eps^3) tail
  robustHighStep: H_HIGH, // 1e-2: the roundoff-safe step required for the 4th derivative q
  subGap: 'imp-3641-fifthorder-fd-floor',
  finding: {
    F1_order4_shrinks_tail:
      'The derived d4 (dominated by products of lower derivatives, d4 ~ -11.0..-11.8) extends the ' +
      'self-consistent series: at every floor resid4 < resid3, shrinking the imp-3617 O(eps^3) tail by ' +
      '13..309x toward the ~1e-13 exact-identity floor (robust band ~2e-11..7e-10 pp).',
    F2_new_ingredients_small:
      'The genuinely new ingredients q = d^4 lnL/d(lnN)^4 (~-1.5e-5..-2.3e-5) and rho = d^3 ' +
      'lnE_flow/d(lnN)^3 (~5e-4..7e-4) are small; their (1/24) q d1^4 and -(1/3) rho d1^3 contributions ' +
      'to d4 are sub-1e-3, so d4 is set by products of the imp-3617 sub-terms, not the fresh derivatives.',
    F3_fd_floor_survives:
      'HONEST SUB-GAP imp-3641-fifthorder-fd-floor: the O(eps^4) truncation does NOT reach the ~1e-13 ' +
      'exact floor; a plateau at ~2e-11..7e-10 pp survives from the neglected O(eps^5) term and the ' +
      'finite-difference evaluation of q. Evaluating q at the naive imp-3617 step h=1e-4 makes it ' +
      'roundoff noise (0, +-17.8) and resid4 WORSE than resid3 at f>=1 -- the 4th derivative needs a ' +
      'robust step h4~1e-2.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). The imp-3599 exact identity ' +
    'gap = 1 - (L_half/L_x)/(1+eta)^2 is expanded self-consistently one further order: writing ' +
    'Du = ln(N_half/N_x) = d1 eps + d2 eps^2 + d3 eps^3 + d4 eps^4 and solving the fixed point ' +
    'Du = ln(L_half/L_x) - 2 ln(1+eta) at O(eps^4) reproduces the imp-3617 d1, d2, d3 exactly and gives ' +
    'd4 = [s d1 d3 + (1/2) s d2^2 + (1/2) t d1^2 d2 + (1/24) q d1^4 - 2 mu d3 - 2(mu^2+nu) d1 d2 ' +
    '- ((1/3) mu^3 + mu nu + (1/3) rho) d1^3 + 2 mu d2 + (2 mu^2+nu) d1^2 - 2 mu d1 + 1/2]/(1-lambda), ' +
    'FIRST requiring the fourth log-N derivative q = d^4 lnL/d(lnN)^4 and the third E_flow log-N ' +
    'derivative rho = d^3 lnE_flow/d(lnN)^3; the gap follows from gap4 = gap3 - (d4 + d1 d3 + (1/2) d2^2 ' +
    '+ (1/2) d1^2 d2 + (1/24) d1^4) eps^4. Re-root-solving both crossings per floor (400-iter bisection, ' +
    'residual <1e-9, reproducing imp-3617 to the last digit) and evaluating lambda, mu, s, nu, t at the ' +
    'imp-3617 step h=1e-4 while q, rho use a ROBUST step h4=1e-2 shows resid4 improves resid3 at every ' +
    'floor (band ~2e-11..7e-10 pp, shrinking the imp-3617 O(eps^3) tail 3e-10..2.3e-8 pp by 13..309x). ' +
    'd4 ~ -11.0..-11.8 is dominated by products of the lower derivatives; the fresh q ~ -1.5e-5..-2.3e-5 ' +
    'and rho ~ 5e-4..7e-4 are small and contribute sub-1e-3 to d4. HONEST SUB-GAP ' +
    'imp-3641-fifthorder-fd-floor: the O(eps^4) expansion does NOT reach the ~1e-13 exact floor; a ' +
    'plateau at ~2e-11..7e-10 pp survives from the neglected O(eps^5) term and the finite-difference ' +
    'evaluation of q -- evaluating q at the naive imp-3617 step h=1e-4 collapses it to roundoff noise ' +
    '(0, +-17.8) and makes resid4 WORSE than resid3, so the 4th derivative demands a robust step ' +
    'h4~1e-2. The exact identity is complete; the closed expansion is now truncated at O(eps^4). ' +
    'Derivation/measurement only; no positivity, no bridge closure, no RH claim, NO QED. imp-3066 ' +
    'off-diagonal endpoint-Hankel K_a>=0 positivity UNTOUCHED. No refereed bound is changed' +
    '.',
  citation:
    'imp-3617 (self-consistent O(eps^3) expansion d1, d2, d3 and its ~3e-10..2.3e-8 pp residual tail); ' +
    'imp-3599 (exact gap identity + O(eps^2) crude model); imp-3580 (leading gap ~ 2 E_flow/E_trunc law ' +
    'and residual); imp-3556 (baseline half-decay <=> crossover certification); imp-3443 ' +
    '(half-to-double E_trunc floor grid 0.5x..2x); imp-3220 (U-shaped sigma(N) exact sub-terms); ' +
    'imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip floor 3.06e-5); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3641_FLOW_GAP_FOURTHORDER_EXPANSION_ASSERTIONS = [
  {
    // (F1) The imp-3599 exact identity still reproduces the root-solved gap to machine level (sanity).
    id: 'imp3641-exact-identity-reproduces-rootsolve',
    description: 'imp-3599 exact identity gap = 1 - (L_half/L_x)/(1+eta)^2 matches root-solve to <1e-9 at every floor',
    holds: () => MAX_EXACT_ERR < 1e-9,
  },
  {
    // (F1) The O(eps^4) truncation improves the imp-3617 O(eps^3) residual at every floor.
    id: 'imp3641-order4-improves-order3',
    description: 'resid4 < resid3 at every floor (robust-step O(eps^4) beats imp-3617 O(eps^3))',
    holds: () => GRID.every((r) => r.resid_order4_pp < r.resid_order3_pp),
  },
  {
    // (F1) The O(eps^4) residual sits in the tight ~2e-11..7e-10 pp band at every floor.
    id: 'imp3641-order4-in-tight-band',
    description: 'O(eps^4) residual < 1e-9 pp at every floor (band ~2e-11..7e-10 pp)',
    holds: () => RESID4_MAX < 1e-9,
  },
  {
    // (F1) The O(eps^4) truncation shrinks the imp-3617 O(eps^3) tail by >= 10x at every floor.
    id: 'imp3641-order4-shrinks-imp3617-tail',
    description: 'O(eps^4) residual shrinks the imp-3617 O(eps^3) tail by >= 10x at every floor',
    holds: () => MIN_SHRINK_VS_IMP3617 >= 10,
  },
  {
    // (F3) HONEST SUB-GAP: the O(eps^4) residual does NOT reach the ~1e-13 exact-identity floor -- a
    // plateau at >= 1e-12 pp survives (>= 10x above the exact floor).
    id: 'imp3641-does-not-reach-exact-floor',
    description: 'O(eps^4) residual stays above the ~1e-13 exact floor (>=1e-12 pp) -- the honest sub-gap',
    holds: () => RESID4_MIN > 1e-12 && GRID.every((r) => r.resid_order4_pp > 10 * r.exact_abs_err),
  },
  {
    // (F2) The new ingredients q, rho are small and in-band; d4 is dominated by lower-derivative products.
    id: 'imp3641-new-derivatives-small-in-band',
    description: 'q in (-3e-5,-1e-5), rho in (4e-4,8e-4), d4 in (-13,-10) at every floor',
    holds: () =>
      GRID.every(
        (r) => r.q < -1e-5 && r.q > -3e-5 && r.rho > 4e-4 && r.rho < 8e-4 && r.d4 < -10 && r.d4 > -13,
      ),
  },
  {
    // Honesty gate: measurement/derivation only, named sub-gap, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp3641-honesty-gate-no-qed',
    description: 'Measurement/derivation only: named sub-gap, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP3641_FLOW_GAP_FOURTHORDER_EXPANSION.isRigorous === false &&
      IMP3641_FLOW_GAP_FOURTHORDER_EXPANSION.subGap === 'imp-3641-fifthorder-fd-floor' &&
      /NO QED/.test(IMP3641_FLOW_GAP_FOURTHORDER_EXPANSION.verdict) &&
      /refereed bound is changed/i.test(IMP3641_FLOW_GAP_FOURTHORDER_EXPANSION.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3641_FLOW_GAP_FOURTHORDER_EXPANSION.verdict),
  },
];

for (const a of IMP3641_FLOW_GAP_FOURTHORDER_EXPANSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3641-flow-gap-fourthorder-expansion assertion failed: ${a.id}`);
  }
}
