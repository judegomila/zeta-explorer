/**
 * @module imp-3617-flow-gap-thirdorder-expansion
 *
 * imp-3617 (numerical, frontier-direction): imp-3599 wrote the EXACT flow-gap identity
 *     gap = 1 - (L_half/L_x)/(1+eta)^2,   eta = E_flow(N_half)/E_trunc
 * (matching the imp-3580 root-solved N_half/N_x gaps to ~1e-14) and a perturbative O(eps^2) model
 *     gap ~ 2 eps(1+lambda) - (4 mu + 4 lambda + 3) eps^2,   eps = E_flow(N_x)/E_trunc
 * that closes ~94-95% of the imp-3580 leading-law residual, leaving the named sub-gap
 * imp-3599-nextorder-residual-tail: a ~5% tail (resid ~ 4.5e-4..1.9e-3 pp) from the neglected
 * O(eps^3) term, the slope-curvature s = d^2 lnL / d(lnN)^2, and finite-difference lambda, mu.
 * This module PUSHES the closed expansion to O(eps^3) -- newly requiring the slope-curvature s and
 * the E_flow log-curvature nu = d^2 lnE_flow/d(lnN)^2 -- and MEASURES across the imp-3443
 * half-to-double E_trunc floor grid f in {0.5..2} whether the residual shrinks toward the ~1e-13
 * exact-identity floor. Same sub-terms as imp-3580/imp-3599; no fresh floor grid.
 *
 * THE SET-UP (identical sub-terms to imp-3220 / imp-3556 / imp-3580 / imp-3599)
 * ---------------------------------------------------------------------------
 *     E_coll(N) = C_C_PINNED * sqrt(L / N),   L = log T0,   T0 = effectiveHeightForN(N)
 *     E_flow(N) = C_F * (L / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398 pinned)
 *     N_x    : E_coll(N_x)    = E_trunc                     (crossover)
 *     N_half : E_coll(N_half) = E_trunc + E_flow(N_half)    (sigma = 1/2)
 *     gap = 1 - N_half/N_x,   E_trunc = f * 3.06e-5,  f in {0.5, 0.75, 1.0, 1.5, 2.0}
 *
 * (A) THE SELF-CONSISTENT CLOSED EXPANSION (the O(eps^3) push the ticket names)
 * ---------------------------------------------------------------------------
 * Let Du = ln(N_half/N_x). The exact identity gives the self-consistent fixed point
 *     Du = ln(L_half/L_x) - 2 ln(1+eta).
 * Taylor-expand the log-N-varying pieces about N_x with the local log-log derivatives
 *     lambda = d lnL/d lnN,   s = d^2 lnL/d(lnN)^2,   t = d^3 lnL/d(lnN)^3,
 *     mu     = d lnE_flow/d lnN,   nu = d^2 lnE_flow/d(lnN)^2,
 * and solve order by order Du = d1 eps + d2 eps^2 + d3 eps^3 + O(eps^4):
 *     d1 = -2/(1-lambda),
 *     d2 = [ (1/2) s d1^2 + 1 - 2 mu d1 ] / (1-lambda),
 *     d3 = [ s d1 d2 + (1/6) t d1^3 - 2 mu d2 - (mu^2+nu) d1^2 + 2 mu d1 - 2/3 ] / (1-lambda).
 * The gap is then gap = 1 - exp(Du), truncated consistently:
 *     gap1 = -d1 eps                                   (leading, resummed d1 = 2/(1-lambda))
 *     gap2 = gap1 - (d2 + (1/2) d1^2) eps^2            (second order; FIRST uses the curvature s, nu)
 *     gap3 = gap2 - (d3 + d1 d2 + (1/6) d1^3) eps^3    (third order; adds the log-N third-derivative t)
 * The imp-3599 model 2 eps(1+lambda) - (4 mu+4 lambda+3) eps^2 is the CRUDE truncation that used
 * Du = -2 eps in the sub-terms and kept L only to first order (no curvature). The resummed leading
 * d1 = -2/(1-lambda) already captures the 2 lambda^2 eps piece the imp-3599 linearization
 * 2 eps(1+lambda) dropped -- which is the DOMINANT part of the imp-3599 residual tail.
 *
 * (B) MEASUREMENT: the O(eps^3) expansion drives the residual ~5-6 orders below imp-3599
 * -----------------------------------------------------------------------------------
 * Re-root-solving BOTH crossings per floor (400-iter bisection in ln N, residual < 1e-9, reproducing
 * imp-3580/imp-3599 to the last digit) and computing lambda, mu, s, nu, t at N_x by central finite
 * difference in ln N (step 1e-4, stable across step halving):
 *   f      imp3599_resid   resid1(lead)   resid2(O eps^2)   resid3(O eps^3)   [pp]
 *   0.5    4.49e-4         6.54e-5        1.38e-7           3.13e-10
 *   0.75   6.83e-4         1.21e-4        3.54e-7           1.25e-9
 *   1.0    9.22e-4         1.86e-4        6.85e-7           2.81e-9
 *   1.5    1.41e-3         3.37e-4        1.71e-6           9.04e-9
 *   2.0    1.92e-3         5.11e-4        3.26e-6           2.29e-8
 * Each successive order shrinks the residual geometrically (ratio ~100-500 per order). The O(eps^3)
 * truncation reaches ~3e-10..2.3e-8 pp -- shrinking the imp-3599 O(eps^2) tail (4.5e-4..1.9e-3 pp) by
 * ~5-6 orders of magnitude, toward the ~1e-13 exact-identity floor.
 *
 * HONEST SUB-GAP (imp-3617-fourthorder-fd-floor)
 * ----------------------------------------------
 * The O(eps^3) expansion does NOT reach the ~1e-13 exact-identity floor: a residual plateau at
 * ~3e-10..2.3e-8 pp survives, set by (i) the neglected O(eps^4) term and (ii) the finite-difference
 * evaluation of the curvature slopes s, nu, t. The EXACT identity (imp-3599 F1) remains the complete
 * closed object; the perturbative expansion is now truncated at O(eps^3). Pushing to O(eps^4) or
 * evaluating the curvatures analytically is the named sub-gap imp-3617-fourthorder-fd-floor.
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) The self-consistent closed expansion converges geometrically to the exact identity: at every
 *        floor resid1 > resid2 > resid3 with per-order ratio >= 100, so each added order shrinks the
 *        residual toward the ~1e-13 exact floor.
 *   (F2) The resummed leading term -d1 eps = 2 eps/(1-lambda) already beats the imp-3599 crude
 *        O(eps^2) model (6.5e-5..5.1e-4 vs 4.5e-4..1.9e-3 pp) -- the 2 lambda^2 eps piece the imp-3599
 *        linearization 2 eps(1+lambda) dropped is the dominant part of its residual tail.
 *   (F3) The O(eps^3) truncation -- which FIRST requires the slope-curvature s = d^2 lnL/d(lnN)^2 and
 *        the E_flow log-curvature nu -- reaches ~3e-10..2.3e-8 pp, shrinking the imp-3599 tail by
 *        >= 1e4x at every floor. HONEST SUB-GAP imp-3617-fourthorder-fd-floor: it does NOT reach the
 *        ~1e-13 exact floor; a plateau survives from the O(eps^4) truncation and the finite-difference
 *        curvature evaluation.
 *
 * DERIVATION / MEASUREMENT ONLY. No positivity, no bridge closure, no RH claim, NO QED.
 * imp-3066 off-diagonal endpoint-Hankel K_a >= 0 positivity UNTOUCHED. Platt-Trudgian
 * Lambda <= 0.2 remains the rigorous SOTA.
 *
 * @see imp-3599-flow-gap-nextorder-correction (exact identity + O(eps^2) crude model and its tail)
 * @see imp-3580-sigma-crossover-floor-invariance (leading gap ~ 2 E_flow/E_trunc law and residual)
 * @see imp-3556-sigma-threshold-crossings-rootsolve (baseline half-decay <=> crossover certification)
 * @see imp-3443-nmax-etrunc-sensitivity (half-to-double E_trunc floor grid 0.5x .. 2x)
 * @see imp-398 (E_flow C_F pinned prefactor); imp-2631 (E_trunc fixed-strip floor 3.06e-5)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3220/imp-3556/imp-3580)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3580/imp-3599 exactly

// EXACT imp-3580/imp-3599 sub-terms (no re-derivation); only E_trunc is a parameter.
function parts(N, eTrunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = eTrunc + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// Right-arm interior maximum (ternary in ln N; same bracket as imp-3580/imp-3599).
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

// Local log-log derivatives at N (central finite difference in ln N, step 1e-4):
//   lambda = d lnL/d lnN, s = d2 lnL/d(lnN)2, t = d3 lnL/d(lnN)3 (5-point),
//   mu = d lnE_flow/d lnN, nu = d2 lnE_flow/d(lnN)2.
function derivs(N, eTrunc) {
  const h = 1e-4;
  const u = Math.log(N);
  const f = (uu) => parts(Math.exp(uu), eTrunc);
  const p0 = f(u);
  const pp = f(u + h);
  const pm = f(u - h);
  const pp2 = f(u + 2 * h);
  const pm2 = f(u - 2 * h);
  const lnL = (p) => Math.log(p.L);
  const lnF = (p) => Math.log(p.E_flow);
  const lambda = (lnL(pp) - lnL(pm)) / (2 * h);
  const mu = (lnF(pp) - lnF(pm)) / (2 * h);
  const s = (lnL(pp) - 2 * lnL(p0) + lnL(pm)) / (h * h);
  const nu = (lnF(pp) - 2 * lnF(p0) + lnF(pm)) / (h * h);
  const t = (lnL(pp2) - 2 * lnL(pp) + 2 * lnL(pm) - lnL(pm2)) / (2 * h * h * h);
  return { lambda, mu, s, nu, t };
}

// (A)+(B) Re-root-solve both crossings and build the self-consistent O(eps^3) expansion per floor.
const FACTORS = [0.5, 0.75, 1.0, 1.5, 2.0];
const GRID = FACTORS.map((f) => {
  const eTrunc = f * E_TRUNC_BASE;
  const N_half = crossHalf(eTrunc);
  const N_x = crossCollEqTrunc(eTrunc);
  const pH = parts(N_half, eTrunc);
  const pX = parts(N_x, eTrunc);
  const eta = pH.E_flow / eTrunc; // E_flow at N_half
  const eps = pX.E_flow / eTrunc; // E_flow at N_x (the leading small parameter)
  const { lambda, mu, s, nu, t } = derivs(N_x, eTrunc);

  const gap = 1 - N_half / N_x; // root-solved (measured) gap
  const gapExact = 1 - (pH.L / pX.L) / ((1 + eta) * (1 + eta)); // imp-3599 (A) exact identity
  const gap3599 = 2 * eps * (1 + lambda) - (4 * mu + 4 * lambda + 3) * eps * eps; // imp-3599 crude O(eps^2)

  // Self-consistent series coefficients d1, d2, d3 of Du = ln(N_half/N_x).
  const d1 = -2 / (1 - lambda);
  const d2 = (0.5 * s * d1 * d1 + 1 - 2 * mu * d1) / (1 - lambda);
  const d3 =
    (s * d1 * d2 + (1 / 6) * t * d1 * d1 * d1 - 2 * mu * d2 - (mu * mu + nu) * d1 * d1 + 2 * mu * d1 - 2 / 3) /
    (1 - lambda);

  // Consistently truncated gap = 1 - exp(Du) = -(Du + Du^2/2 + Du^3/6 + ...).
  const gap1 = -d1 * eps; // leading (resummed)
  const gap2 = gap1 - (d2 + 0.5 * d1 * d1) * eps * eps; // O(eps^2): first uses curvature s, nu
  const gap3 = gap2 - (d3 + d1 * d2 + (1 / 6) * d1 * d1 * d1) * eps * eps * eps; // O(eps^3): adds t

  const resid3599 = Math.abs(gap - gap3599);
  const resid1 = Math.abs(gap - gap1);
  const resid2 = Math.abs(gap - gap2);
  const resid3 = Math.abs(gap - gap3);
  const exactErr = Math.abs(gap - gapExact);

  return {
    factor: f,
    E_trunc: +eTrunc.toExponential(4),
    N_half: +N_half.toExponential(6),
    N_x: +N_x.toExponential(6),
    eps: +eps.toExponential(4),
    lambda: +lambda.toFixed(6), // log-drift slope ~ 1/L
    mu: +mu.toFixed(6), // E_flow falls ~ 1/T0
    s: +s.toExponential(4), // slope-curvature d2 lnL/d(lnN)2 (the new ingredient)
    nu: +nu.toExponential(4), // E_flow log-curvature d2 lnE_flow/d(lnN)2
    t: +t.toExponential(4), // third log-N derivative of lnL
    gap_pct: +(gap * 100).toFixed(6),
    gap3599_pct: +(gap3599 * 100).toFixed(6),
    gap3_pct: +(gap3 * 100).toFixed(6),
    exact_abs_err: +exactErr.toExponential(2), // imp-3599 (A) reproduces root-solve to ~1e-13
    resid_imp3599_pp: +(resid3599 * 100).toExponential(4), // ~4.5e-4..1.9e-3 pp (the tail)
    resid_lead_pp: +(resid1 * 100).toExponential(4), // resummed leading
    resid_order2_pp: +(resid2 * 100).toExponential(4), // self-consistent O(eps^2)
    resid_order3_pp: +(resid3 * 100).toExponential(4), // self-consistent O(eps^3)
    order2_over_order3: +(resid2 / resid3).toFixed(1), // geometric convergence ratio
    lead_over_order2: +(resid1 / resid2).toFixed(1),
    shrink_vs_imp3599: +(resid3599 / resid3).toExponential(3), // how much O(eps^3) beats imp-3599
  };
});

const BASELINE = GRID.find((r) => r.factor === 1.0);
const MAX_EXACT_ERR = Math.max(...GRID.map((r) => r.exact_abs_err));
const RESID3S = GRID.map((r) => r.resid_order3_pp);
const RESID3_MIN = Math.min(...RESID3S);
const RESID3_MAX = Math.max(...RESID3S);
const MIN_SHRINK_VS_IMP3599 = Math.min(...GRID.map((r) => r.shrink_vs_imp3599));

export const IMP3617_FLOW_GAP_THIRDORDER_EXPANSION = {
  id: 'imp-3617',
  proofSection: 'S-frontier',
  question:
    'Push the imp-3599 flow-gap expansion of the exact identity gap = 1 - (L_half/L_x)/(1+eta)^2 to ' +
    'O(eps^3) -- newly requiring the slope-curvature s = d^2 lnL/d(lnN)^2 and the E_flow log-curvature ' +
    'nu -- and measure across the half-to-double E_trunc floor grid whether the residual shrinks toward ' +
    'the ~1e-13 exact-identity floor. Derivation/measurement only; conditional-share diagnostic, NOT an ' +
    'RH bound; no QED.',
  quantity:
    'gap = 1 - N_half/N_x root-solved per floor; self-consistent closed expansion Du = d1 eps + d2 eps^2 ' +
    '+ d3 eps^3 with d1 = -2/(1-lambda), d2 = [(1/2) s d1^2 + 1 - 2 mu d1]/(1-lambda), d3 involving ' +
    '(s, nu, t); gap_k = 1 - exp(Du truncated at order k)',
  floorGrid: GRID,
  baselineNode: BASELINE, // f=1.0 reproduces imp-3580/imp-3599 gap 0.398%
  expansionCoefficients:
    'd1 = -2/(1-lambda); d2 = [(1/2) s d1^2 + 1 - 2 mu d1]/(1-lambda); ' +
    'd3 = [s d1 d2 + (1/6) t d1^3 - 2 mu d2 - (mu^2+nu) d1^2 + 2 mu d1 - 2/3]/(1-lambda)',
  maxExactAbsErr: MAX_EXACT_ERR, // imp-3599 closed identity vs root-solved gap, ~1e-13
  order3ResidualBandPp: { min: +RESID3_MIN.toExponential(3), max: +RESID3_MAX.toExponential(3) },
  minShrinkVsImp3599: +MIN_SHRINK_VS_IMP3599.toExponential(3), // worst-floor factor over the imp-3599 tail
  subGap: 'imp-3617-fourthorder-fd-floor',
  finding: {
    F1_geometric_convergence:
      'The self-consistent closed expansion converges geometrically to the exact identity: at every ' +
      'floor resid1 > resid2 > resid3 with per-order ratio >= 100, each added order shrinking the ' +
      'residual toward the ~1e-13 exact-identity floor.',
    F2_resummed_leading_beats_imp3599:
      'The resummed leading term -d1 eps = 2 eps/(1-lambda) already beats the imp-3599 crude O(eps^2) ' +
      'model (6.5e-5..5.1e-4 vs 4.5e-4..1.9e-3 pp) -- the 2 lambda^2 eps piece the imp-3599 ' +
      'linearization 2 eps(1+lambda) dropped is the dominant part of its residual tail.',
    F3_order3_shrinks_tail_but_not_to_exact_floor:
      'The O(eps^3) truncation -- which FIRST requires the slope-curvature s = d^2 lnL/d(lnN)^2 and the ' +
      'E_flow log-curvature nu -- reaches ~3e-10..2.3e-8 pp, shrinking the imp-3599 tail by >= 1e4x at ' +
      'every floor. HONEST SUB-GAP imp-3617-fourthorder-fd-floor: it does NOT reach the ~1e-13 exact ' +
      'floor; a plateau survives from the O(eps^4) truncation and the finite-difference curvature ' +
      'evaluation of s, nu, t.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT/DERIVATION (frontier-direction, NOT rigorous). The imp-3599 exact identity ' +
    'gap = 1 - (L_half/L_x)/(1+eta)^2 is expanded self-consistently as a closed power series in ' +
    'eps = E_flow(N_x)/E_trunc: writing Du = ln(N_half/N_x) = d1 eps + d2 eps^2 + d3 eps^3 and solving ' +
    'the fixed point Du = ln(L_half/L_x) - 2 ln(1+eta) order by order gives d1 = -2/(1-lambda), ' +
    'd2 = [(1/2) s d1^2 + 1 - 2 mu d1]/(1-lambda) (FIRST requiring the slope-curvature s = d^2 ' +
    'lnL/d(lnN)^2 and the E_flow log-curvature nu), and the O(eps^3) coefficient d3 adding the log-N ' +
    'third derivative t; the gap follows from gap = 1 - exp(Du) truncated consistently. Re-root-solving ' +
    'both crossings per floor (400-iter bisection, residual <1e-9, reproducing imp-3580/imp-3599 to the ' +
    'last digit) and evaluating lambda, mu, s, nu, t by central finite difference in ln N (step 1e-4, ' +
    'stable under step halving) shows the residual falls geometrically: resid_lead ~ 6.5e-5..5.1e-4, ' +
    'resid_O(eps^2) ~ 1.4e-7..3.3e-6, resid_O(eps^3) ~ 3e-10..2.3e-8 pp -- the O(eps^3) truncation ' +
    'shrinks the imp-3599 O(eps^2) tail (4.5e-4..1.9e-3 pp) by ~5-6 orders of magnitude toward the ' +
    '~1e-13 exact-identity floor. The resummed leading d1 = -2/(1-lambda) already beats the imp-3599 ' +
    'crude 2 eps(1+lambda) - (4 mu+4 lambda+3) eps^2 model, because the 2 lambda^2 eps piece the ' +
    'imp-3599 linearization dropped is the dominant part of its tail. HONEST SUB-GAP ' +
    'imp-3617-fourthorder-fd-floor: the O(eps^3) expansion does NOT reach the ~1e-13 exact floor; a ' +
    'plateau at ~3e-10..2.3e-8 pp survives from the neglected O(eps^4) term and the finite-difference ' +
    'evaluation of the curvature slopes -- the exact identity is complete, the closed expansion is now ' +
    'truncated at O(eps^3). Derivation/measurement only; no positivity, no bridge closure, no RH claim, ' +
    'NO QED. imp-3066 off-diagonal endpoint-Hankel K_a>=0 positivity UNTOUCHED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains the rigorous SOTA.',
  citation:
    'imp-3599 (exact gap identity + O(eps^2) crude model and its ~5% residual tail); imp-3580 (leading ' +
    'gap ~ 2 E_flow/E_trunc law and residual); imp-3556 (baseline half-decay <=> crossover ' +
    'certification); imp-3443 (half-to-double E_trunc floor grid 0.5x..2x); imp-3220 (U-shaped ' +
    'sigma(N) exact sub-terms); imp-398 (E_flow C_F prefactor); imp-2631 (E_trunc fixed-strip floor ' +
    '3.06e-5); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3617_FLOW_GAP_THIRDORDER_EXPANSION_ASSERTIONS = [
  {
    // (F1) The imp-3599 exact identity still reproduces the root-solved gap to machine level (sanity).
    id: 'imp3617-exact-identity-reproduces-rootsolve',
    description: 'imp-3599 exact identity gap = 1 - (L_half/L_x)/(1+eta)^2 matches root-solve to <1e-9 at every floor',
    holds: () => MAX_EXACT_ERR < 1e-9,
  },
  {
    // (F1) Geometric convergence: at every floor resid1 > resid2 > resid3, per-order ratio >= 100.
    id: 'imp3617-geometric-convergence-monotone',
    description: 'resid1 > resid2 > resid3 with per-order ratio >= 100 at every floor node',
    holds: () =>
      GRID.every(
        (r) =>
          r.resid_lead_pp > r.resid_order2_pp &&
          r.resid_order2_pp > r.resid_order3_pp &&
          r.lead_over_order2 >= 100 &&
          r.order2_over_order3 >= 100,
      ),
  },
  {
    // (F3) The O(eps^3) truncation reaches the ~3e-10..2.3e-8 pp band at every floor.
    id: 'imp3617-order3-in-tight-band',
    description: 'O(eps^3) residual < 1e-7 pp at every floor (band ~3e-10..2.3e-8 pp)',
    holds: () => RESID3_MAX < 1e-7,
  },
  {
    // (F3) The O(eps^3) truncation shrinks the imp-3599 O(eps^2) tail by >= 1e4x at every floor.
    id: 'imp3617-order3-shrinks-imp3599-tail',
    description: 'O(eps^3) residual shrinks the imp-3599 O(eps^2) tail by >= 1e4x at every floor',
    holds: () => MIN_SHRINK_VS_IMP3599 >= 1e4,
  },
  {
    // (F3) HONEST SUB-GAP: the O(eps^3) residual does NOT reach the ~1e-13 exact-identity floor -- a
    // plateau at >= 1e-11 pp survives (>= 100x above the exact floor).
    id: 'imp3617-does-not-reach-exact-floor',
    description: 'O(eps^3) residual stays above the ~1e-13 exact floor (>=1e-11 pp) -- the honest sub-gap',
    holds: () => RESID3_MIN > 1e-11 && GRID.every((r) => r.resid_order3_pp > 100 * r.exact_abs_err),
  },
  {
    // (F2)/(F3) The new curvature ingredient s = d2 lnL/d(lnN)2 is negative and small; lambda ~ 1/L,
    // mu ~ -0.85 (E_flow falls almost like 1/T0) -- the sub-terms are in their expected bands.
    id: 'imp3617-curvature-and-slopes-in-band',
    description: 'slope-curvature s in (-3e-3,-1e-3), lambda in (0.04,0.05), mu in (-0.9,-0.8) at every floor',
    holds: () =>
      GRID.every(
        (r) => r.s < -1e-3 && r.s > -3e-3 && r.lambda > 0.04 && r.lambda < 0.05 && r.mu > -0.9 && r.mu < -0.8,
      ),
  },
  {
    // Honesty gate: measurement/derivation only, named sub-gap, no QED, PT stays SOTA, imp-3066 untouched.
    id: 'imp3617-honesty-gate-no-qed',
    description: 'Measurement/derivation only: named sub-gap, no QED, PT stays SOTA, imp-3066 untouched',
    holds: () =>
      IMP3617_FLOW_GAP_THIRDORDER_EXPANSION.isRigorous === false &&
      IMP3617_FLOW_GAP_THIRDORDER_EXPANSION.subGap === 'imp-3617-fourthorder-fd-floor' &&
      /NO QED/.test(IMP3617_FLOW_GAP_THIRDORDER_EXPANSION.verdict) &&
      /remains the rigorous SOTA/.test(IMP3617_FLOW_GAP_THIRDORDER_EXPANSION.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP3617_FLOW_GAP_THIRDORDER_EXPANSION.verdict),
  },
];

for (const a of IMP3617_FLOW_GAP_THIRDORDER_EXPANSION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3617-flow-gap-thirdorder-expansion assertion failed: ${a.id}`);
  }
}
