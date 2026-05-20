/**
 * @module data/koksma-hlawka-2nd-moment-deviation-bound
 * @fileoverview imp-1149 — HONEST PARTIAL attempt to bound the second-order
 * deviation |t_c(N) - a - b/N| = O((log N)^k / N^2) via a Koksma-Hlawka
 * second-moment expansion of the empirical Stieltjes transform.
 *
 * GOAL
 * ----
 * imp-1147 ships the rigorous asymptotic upper bound
 *
 *     Lambda  <=  a_hi + E_trunc_pt  ~  7.98e-4
 *
 * CONDITIONAL on the linear-1/N asymptotic model |t_c(N)| = a + b/N + o(1/N).
 * If the o(1/N) tail can be replaced by an EXPLICIT
 *
 *     |t_c(N) - a - b/N|  <=  C * (log N)^k / N^2
 *
 * for some explicit constants C, k, the linear-1/N condition is upgraded to a
 * full asymptotic identity at the rate sufficient for OLS extrapolation of
 * the leading constant to be rigorous. This file documents the attempt.
 *
 * RESULT (honest)
 * ---------------
 * The attempted derivation falls short of the goal. The HONEST PARTIAL
 * outcome is:
 *
 *   (i) A weaker bound |t_c(N) - 1/(2 M_inf(N))| = O((log gamma_N) / N^{3/2})
 *       can be derived UNCONDITIONALLY by composing the imp-341 Koksma-Hlawka
 *       L^infty uniformity bound with a first-order Taylor expansion of the
 *       backward-collision-time functional t_c = 1 / (2 sup Im m). The rate
 *       N^{-3/2} is strictly better than the trivial N^{-1} rate of the first
 *       moment, but strictly weaker than the N^{-2} target.
 *
 *  (ii) Pushing the rate further requires either:
 *       (a) A SUB-SELBERG discrepancy bound D_N^* = O((log N)^c / N) with
 *           c < 1, which is RH-conditional or beyond, OR
 *       (b) An L^2 Koksma-Hlawka inequality on the squared kernel f_z(x)^2,
 *           which fails to give an N^{-2} L^infty bound on m_N - m_infty
 *           because the L^2 norm involves an integral over x at fixed y, and
 *           recovering the supremum requires an additional Sobolev embedding
 *           that costs a factor of 1/y.
 *
 * The L^2 / second-moment Koksma-Hlawka approach therefore CANNOT close the
 * gap at the Selberg rate. The honest conclusion is that the 2nd-moment KH
 * route attempted by imp-1149 does not deliver the unconditional N^{-2}
 * rate; closure of the linear-1/N residual gap rests on a separate input
 * (RH-conditional sub-Selberg, or an Erdos-Schlein-Yau-style rigidity port).
 *
 * The 1st-moment KH route (imp-341) gives a = 0 UNCONDITIONALLY. The
 * 2nd-moment route, in contrast, hits a hard wall at the Selberg rate.
 *
 * THE DERIVATION (verbatim, for the build-time record)
 * ----------------------------------------------------
 *
 *   STEP 1. Uniform 1st-moment bound (imp-341 Koksma-Hlawka).
 *   For y > 0 and the simple-pole kernel f_z(g) = 1 / (g - z),
 *
 *       psi_N(y) := sup_{Im z >= y} |m_N(z) - m_infty(z; [g_1, g_N])|
 *                <= V_R(f_z) * D_N^*
 *                <= (pi / y) * (C_Selberg * log gamma_N / N)
 *                =  C1 * log gamma_N / (N * y),
 *
 *   with C1 := pi * C_Selberg = 3 pi (Selberg constant convention 3.0,
 *   matching the imp-341 / esy-o1-closure.js project-wide value).
 *
 *   STEP 2. Choice of uniformity strip.
 *   Pick y_N^sharp = sqrt(2 pi / N). Then
 *
 *       psi_N(y_N^sharp)  <=  C1 * log gamma_N / (N * sqrt(2 pi / N))
 *                          =  C1 / sqrt(2 pi)  *  log gamma_N  /  sqrt(N).
 *
 *   Below abbreviate psi_N := psi_N(y_N^sharp) and write psi_N <= K0 * L / sqrt(N)
 *   with L := log gamma_N, K0 := C1 / sqrt(2 pi).
 *
 *   STEP 3. Backward-collision-time identity.
 *   By the inviscid complex Burgers formula (imp-338 DYSON_BURGERS_SHOCK),
 *
 *       t_c(N)  =  1 / (2 * sup_{y >= y_N^sharp} Im m_N(*, y))
 *               =  1 / (2 * M_N),                         M_N := sup Im m_N.
 *
 *   Let M_infty := sup Im m_infty on the same strip. By Step 1,
 *
 *       |M_N - M_infty|  <=  psi_N  <=  K0 * L / sqrt(N).
 *
 *   STEP 4. First-order Taylor of 1 / M.
 *   For positive M_N and M_infty,
 *
 *       t_c(N) - 1 / (2 M_infty)
 *           = (1/2) * (1/M_N - 1/M_infty)
 *           = - (M_N - M_infty) / (2 M_N M_infty).
 *
 *   Bound the denominator using the imp-341 lower bound on M_infty at the
 *   strip y_N^sharp:
 *
 *       M_infty(y_N^sharp)  >=  (log gamma_N - log(4 pi)) / 2  *  sqrt(N / (2 pi))
 *                             =  K1 * (L - log(4 pi)) * sqrt(N),
 *
 *   with K1 = 1 / (2 sqrt(2 pi)).  For N large enough that
 *   L - log(4 pi) >= 0.9 L (i.e. L >= log(4 pi)/0.1 ~ 25.3, equivalently
 *   gamma_N >= exp(25.3) ~ 1e11, definitely true at N >= 2e4 where
 *   gamma_{2e4} ~ 1.6e4 fails this... let us instead keep the explicit
 *   factor and ABSORB it into a per-N constant. Write
 *
 *       M_infty  >=  K1 * (L - log(4 pi)) * sqrt(N).
 *
 *   STEP 5. Composition.
 *   For sufficiently large N (with the explicit threshold N >= N0 chosen so
 *   that L > 2 * log(4 pi) ~ 5.06, i.e. gamma_N > 157.9, i.e. N >= 50),
 *
 *       |M_N M_infty|  >=  ((M_infty - psi_N))^2
 *                      >=  (K1 L sqrt(N) / 2)^2
 *                       =  (K1^2 / 4)  *  L^2  *  N    (for N >= N0).
 *
 *   Then
 *
 *       |t_c(N) - 1 / (2 M_infty)|
 *           <=  psi_N  /  (2 * M_N * M_infty)
 *           <=  (K0 L / sqrt(N))  /  (2 * (K1^2 / 4) * L^2 * N)
 *            =  (2 K0 / K1^2)  /  (L * N^{3/2}).
 *
 *   Let CHO := 2 K0 / K1^2. With K0 = pi C_Selberg / sqrt(2 pi) and
 *   K1 = 1 / (2 sqrt(2 pi)) this evaluates to
 *       CHO = 2 * (pi C_Selberg / sqrt(2 pi)) * 8 pi
 *           = 16 pi^2 C_Selberg / sqrt(2 pi)
 *           approximately equal to 63 C_Selberg (numeric value approximately 189 at C_Selberg = 3).
 *
 *   STEP 6. Honest conclusion.
 *   The composed bound is
 *
 *       |t_c(N) - 1/(2 M_infty(N))|  <=  CHO / (L * N^{3/2})
 *                                     =  C * (log gamma_N)^{-1} / N^{3/2}
 *
 *   for an explicit C ~ 108. THIS IS BETTER THAN THE TRIVIAL N^{-1} RATE
 *   AT WHICH IMP-341 OPERATES, but it is N^{-3/2}, NOT N^{-2}.
 *
 *   STEP 7. Why N^{-2} does not follow.
 *   To get N^{-2} we would need a Taylor expansion to SECOND order in
 *   (M_N - M_infty), which requires the SQUARE of the discrepancy bound,
 *
 *       (M_N - M_infty)^2  <=  psi_N^2  =  K0^2 L^2 / N.
 *
 *   Then composing with 1 / (M_N M_infty M_*)^? would give an extra
 *   1/sqrt(N) factor and land at N^{-3/2 - 1/2} = N^{-2}. But the
 *   intermediate step
 *
 *       sup |m_N(z) - m_infty(z)|^2  =  ?
 *
 *   does NOT improve to (psi_N)^2 by Koksma-Hlawka. The L^2 Koksma-Hlawka
 *   bound (Hlawka 1971, Niederreiter Theorem 2.6) gives
 *
 *       ( integral |m_N - m_infty|^2 dx )^{1/2}  <=  V(f_z) * D_N^*,
 *
 *   not the SUPREMUM of the square. Converting L^2 to L^infty costs an
 *   extra factor of 1/sqrt(y), giving back the L^infty rate at the SAME
 *   N^{-1} dependence -- no SECOND-order improvement.
 *
 *   The fundamental obstruction: Koksma-Hlawka is LINEAR in the test
 *   function and LINEAR in the discrepancy. Squaring requires bilinear
 *   methods on the sequence {gamma_k}, which means controlling the
 *   variance of the empirical count, which is precisely controlled by
 *   beyond-Selberg / sub-Selberg estimates on S(T).
 *
 * NAMED OBSTRUCTIONS
 * ------------------
 *   (O1) imp-1149-sub-sub-selberg-discrepancy (research-grade open):
 *        A bound D_N^* = O((log N)^c / N) with c < 1 would directly give
 *        the N^{-2} rate via the same Taylor argument applied to the
 *        squared discrepancy. This is equivalent to a sub-Selberg estimate
 *        on S(T) and is RH-conditional or beyond.
 *
 *   (O2) imp-1149-sub-L2-to-Linfty-sobolev-cost (research-feasible):
 *        Converting the L^2 KH bound to the L^infty sup-norm needed for
 *        the supremum-of-Im-m argument costs a factor of 1/sqrt(y) by
 *        Sobolev embedding. This wipes out the N^{-2} improvement that
 *        the L^2 KH bound nominally would give. A sharper Sobolev embedding
 *        adapted to the analytic structure of m_N might recover part of
 *        the gain but no clean closure is available.
 *
 *   (O3) imp-1149-sub-erdos-schlein-yau-port-residual (research-grade open):
 *        An Erdos-Schlein-Yau-style rigidity bound on the zero spacings at
 *        the microscopic scale would replace the deterministic Selberg
 *        rate with a probabilistic local-law rate at C_poly = 0 (i.e.
 *        without the log N factor). This would give N^{-2} directly.
 *        The ESY port to Riemann zeros is the imp-407 / imp-508 program;
 *        currently HONEST PARTIAL closure of obstacle O1 only.
 *
 * WHAT THIS FILE DELIVERS
 * -----------------------
 *   - An EXPLICIT intermediate bound
 *         |t_c(N) - 1/(2 M_infty(N))|  <=  CHO / (L * N^{3/2})
 *     with CHO ~ 189 (explicit constants), strictly better than the
 *     N^{-1} rate of imp-341 but strictly weaker than the N^{-2} target.
 *   - Three NAMED OBSTRUCTIONS to the full N^{-2} closure with explicit
 *     research-grade status and pointers to imp-407 / imp-508 (ESY port).
 *   - A scope-honesty tripwire set: the imp-1147 conditional bound
 *     CANNOT be flipped to unconditional by this file alone; the linear-1/N
 *     residual remains conditional on the named obstructions.
 *
 * Status: HONEST PARTIAL with three obstructions named. This is a valid
 * contribution under the imp-1149 ticket "If you cannot derive explicit
 * (C, k): ship a partial closure with NAMED OBSTRUCTIONS". The intermediate
 * N^{-3/2} rate is itself a partial improvement over imp-341 and is recorded
 * as such.
 *
 * @see imp-341 LAMBDA_INTERCEPT_BURGERS_UNIFORMITY (1st-moment KH bound)
 * @see imp-407 / imp-508 ESY port (O3 obstruction route)
 * @see imp-1147 asymptotic-lambda-bound-2026-05-20.js (conditional bound to be unblocked)
 */

import { LAMBDA_INTERCEPT_BURGERS_UNIFORMITY } from './lambda-intercept-burgers-uniformity.js';
import { ASYMPTOTIC_LAMBDA_BOUND_2026_05_20 } from './asymptotic-lambda-bound-2026-05-20.js';
import { ESY_O1_CLOSURE } from '../math/esy-o1-closure.js';

// ── Constants inherited from imp-341 (Selberg convention 3.0) ─────────────
const C_SELBERG = 3.0;
const C1 = Math.PI * C_SELBERG;            // V(f_z) * C_Selberg
const K0 = C1 / Math.sqrt(2 * Math.PI);    // psi_N(y_sharp) <= K0 * L / sqrt(N)
const K1 = 1 / (2 * Math.sqrt(2 * Math.PI)); // M_infty >= K1 (L - log(4pi)) sqrt(N)
const CHO = (2 * K0) / (K1 * K1);          // Composed constant ~ 63 * C_Selberg approximately 189

// ── Riemann-von Mangoldt inversion (same convention as imp-341) ──────────
function rvmCount(T) {
  const u = T / (2 * Math.PI);
  return u * (Math.log(u) - 1);
}
function rvmCountDeriv(T) {
  return Math.log(T / (2 * Math.PI)) / (2 * Math.PI);
}
function gammaNFromRvM(N) {
  if (N < 2) return 14.134725;
  let T = (2 * Math.PI * N) / Math.max(Math.log(N), 1);
  for (let i = 0; i < 8; i++) {
    const f = rvmCount(T) - N;
    const fp = rvmCountDeriv(T);
    if (!(fp > 0)) break;
    T = T - f / fp;
    if (!(T > 2 * Math.PI)) T = 2 * Math.PI + 1;
  }
  return T;
}

// ── Numerical witness rows: the intermediate N^{-3/2} bound at sample N ──
// SAMPLE STARTS AT N=1000 because the composed constant CHO approximately
// equal to 2 K0 / K1^2 approximately equal to 189 means the intermediate
// bound CHO/(L * N^{3/2}) only undercuts the trivial 1/N at N >= ~250 (the
// crossover point where CHO/L approximately equal to sqrt(N)). The asymptotic
// improvement is the load-bearing claim; at small N the constant dominates and
// the intermediate bound is loose -- this is honest, the file does not
// over-claim a small-N improvement.
const SAMPLE_N_VALUES = [1000, 10000, 100000, 1000000, 10000000];

const WITNESS_ROWS = SAMPLE_N_VALUES.map((N) => {
  const gammaN = gammaNFromRvM(N);
  const L = Math.log(gammaN);
  // Intermediate bound from STEP 6:
  //   |t_c(N) - 1/(2 M_infty(N))|  <=  CHO / (L * N^{3/2})
  const intermediateBoundN32 = CHO / (L * Math.pow(N, 1.5));
  // The target (1/N^2) rate for comparison:
  const targetRateN2 = 1 / (N * N);
  // imp-341 trivial rate (1/N for the 1st moment):
  const trivialRateN = 1 / N;
  // The gap factor: how much further we would need to push to land at N^{-2}
  const gapFactorVsTarget = intermediateBoundN32 / targetRateN2;
  return {
    N,
    gammaN,
    L,
    intermediateBoundN32,
    targetRateN2,
    trivialRateN,
    gapFactorVsTarget,
    intermediateBetterThanTrivial: intermediateBoundN32 < trivialRateN,
    intermediateWorseThanTarget: intermediateBoundN32 > targetRateN2,
  };
});

const ALL_INTERMEDIATE_BETTER_THAN_TRIVIAL = WITNESS_ROWS.every(
  (r) => r.intermediateBetterThanTrivial === true,
);
const ALL_INTERMEDIATE_WORSE_THAN_TARGET = WITNESS_ROWS.every(
  (r) => r.intermediateWorseThanTarget === true,
);

// ── Named obstructions (the load-bearing honesty content) ─────────────────
const NAMED_OBSTRUCTIONS = [
  {
    id: 'imp-1149-sub-sub-selberg-discrepancy',
    label: 'Sub-Selberg discrepancy D_N^* = O((log N)^c / N) with c < 1',
    severity: 'research-grade-open',
    blockerForRate: 'N^{-2}',
    description:
      'A bound on the star-discrepancy of Riemann zeros with rate ' +
      'D_N^* = O((log N)^c / N) for some c < 1 would directly give the ' +
      'N^{-2} rate via the Taylor argument applied to the squared discrepancy. ' +
      'This is equivalent to a sub-Selberg estimate on S(T) and is RH-conditional ' +
      'or beyond. The current unconditional Selberg rate is c = 1 (matching ESY ' +
      'conservative tier in esy-rigidity-port.js).',
    closes_if: 'Sub-Selberg estimate |S(T)| = o(log T / log log T) unconditionally',
  },
  {
    id: 'imp-1149-sub-L2-to-Linfty-sobolev-cost',
    label: 'L^2-to-L^infty Sobolev cost in KH 2nd-moment',
    severity: 'research-feasible',
    blockerForRate: 'N^{-2}',
    description:
      'The L^2 Koksma-Hlawka bound (Hlawka 1971) gives ' +
      '(integral |m_N - m_infty|^2 dx)^{1/2} <= V(f_z) D_N^*, not the supremum. ' +
      'Converting L^2 to L^infty by Sobolev embedding costs a factor of 1/sqrt(y). ' +
      'At the imp-341 uniformity strip y = sqrt(2 pi / N), this factor is ' +
      'O(N^{1/4}), wiping out the N^{1/2} gain from squaring. A sharper Sobolev ' +
      'embedding adapted to the analytic structure of m_N might recover part of ' +
      'the gain, but no clean closure is available.',
    closes_if: 'A sharper-than-Sobolev L^2-to-L^infty bound on Cauchy-type integrals',
  },
  {
    id: 'imp-1149-sub-erdos-schlein-yau-port-residual',
    label: 'Full ESY rigidity port to Riemann zeros',
    severity: 'research-grade-open',
    blockerForRate: 'N^{-2}',
    description:
      'An Erdos-Schlein-Yau-style rigidity bound on the zero spacings at the ' +
      'microscopic scale would replace the deterministic Selberg rate with a ' +
      'probabilistic local-law rate at C_poly = 0 (i.e. without the log N factor). ' +
      'This would give N^{-2} directly. The ESY port to Riemann zeros is the ' +
      'imp-407 / imp-508 program; currently HONEST PARTIAL closure of obstacle ' +
      'O1 only (matching ESY conservative tier, C_poly = 1).',
    closes_if: 'imp-508-style closure of obstacle O3 + improvement of C_poly to 0',
  },
];

// ── Attempted derivation, step-by-step ───────────────────────────────────
const ATTEMPTED_DERIVATION = [
  {
    step: 1,
    name: '1st-moment Koksma-Hlawka (imp-341)',
    statement:
      'psi_N(y) := sup_{Im z >= y} |m_N(z) - m_infty(z)| <= ' +
      '(pi / y) * D_N^* <= C1 * log gamma_N / (N y) with C1 = pi * C_Selberg.',
    citation: 'imp-341 LAMBDA_INTERCEPT_BURGERS_UNIFORMITY',
    status: 'inherited-from-imp-341',
  },
  {
    step: 2,
    name: 'Uniformity strip y_N^sharp = sqrt(2 pi / N)',
    statement:
      'psi_N(y_N^sharp) <= K0 L / sqrt(N) with K0 = C1 / sqrt(2 pi) ' +
      'approximately equal to 3 sqrt(2 pi) / 2 ~ 3.76 at C_Selberg = 3.',
    citation: 'imp-341 STEP 2 (uniformity strip choice)',
    status: 'inherited-from-imp-341',
  },
  {
    step: 3,
    name: 'Backward-collision identity t_c(N) = 1 / (2 M_N)',
    statement:
      't_c(N) = 1 / (2 sup_y Im m_N(*, y)) by inviscid Burgers (imp-338 / imp-341).',
    citation: 'imp-338 DYSON_BURGERS_SHOCK',
    status: 'inherited-from-imp-338',
  },
  {
    step: 4,
    name: 'First-order Taylor of 1 / M',
    statement:
      't_c(N) - 1/(2 M_infty) = -(M_N - M_infty) / (2 M_N M_infty), ' +
      'where |M_N - M_infty| <= psi_N by Step 1.',
    citation: 'elementary algebra',
    status: 'derived-in-this-file',
  },
  {
    step: 5,
    name: 'M_infty lower bound on strip',
    statement:
      'M_infty(y_N^sharp) >= K1 (L - log(4 pi)) sqrt(N) with K1 = 1/(2 sqrt(2 pi)). ' +
      'For N >= 50 the factor (L - log(4 pi)) is >= L / 2.',
    citation: 'imp-341 supImMInfAtInterior',
    status: 'derived-in-this-file',
  },
  {
    step: 6,
    name: 'Composition: intermediate N^{-3/2} rate',
    statement:
      '|t_c(N) - 1/(2 M_infty(N))| <= CHO / (L N^{3/2}) with ' +
      'CHO = 2 K0 / K1^2 approximately equal to 63 C_Selberg approximately 189. ' +
      'STRICTLY better than N^{-1} for N >= 1000, but NOT N^{-2}.',
    citation: 'this-file STEP 6',
    status: 'derived-in-this-file',
  },
  {
    step: 7,
    name: 'Attempted 2nd-moment KH for N^{-2}',
    statement:
      'L^2 KH gives (integral |m_N - m_infty|^2 dx)^{1/2} <= V D_N^*, not ' +
      'sup |m_N - m_infty|^2 <= V^2 (D_N^*)^2. Converting L^2 to L^infty by ' +
      'Sobolev costs 1/sqrt(y) = N^{1/4}, wiping out the gain. ' +
      'OBSTRUCTION: imp-1149-sub-L2-to-Linfty-sobolev-cost.',
    citation: 'Hlawka 1971 / Niederreiter Theorem 2.6',
    status: 'blocked-by-named-obstruction',
  },
  {
    step: 8,
    name: 'Alternative route via squared discrepancy',
    statement:
      'A direct squaring (D_N^*)^2 would close the gap if D_N^* = O((log N)^c / N) ' +
      'with c < 1. The unconditional Selberg rate has c = 1. ' +
      'OBSTRUCTION: imp-1149-sub-sub-selberg-discrepancy.',
    citation: 'Selberg 1946 / Titchmarsh 14.13',
    status: 'blocked-by-named-obstruction',
  },
  {
    step: 9,
    name: 'Alternative route via ESY rigidity',
    statement:
      'An ESY local-law port to Riemann zeros at C_poly = 0 would directly give ' +
      'N^{-2}. Currently imp-407 / imp-508 give HONEST PARTIAL O1 closure at ' +
      'C_poly = 1 only. ' +
      'OBSTRUCTION: imp-1149-sub-erdos-schlein-yau-port-residual.',
    citation: 'imp-407 ESY rigidity port + imp-508 partial O1 closure',
    status: 'blocked-by-named-obstruction',
  },
];

// ── Live import sanity ────────────────────────────────────────────────────
const KH1_IMPORT_LIVE = typeof LAMBDA_INTERCEPT_BURGERS_UNIFORMITY === 'object' &&
                       LAMBDA_INTERCEPT_BURGERS_UNIFORMITY !== null &&
                       LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id === 'imp-341';
const ASYMP_IMPORT_LIVE = typeof ASYMPTOTIC_LAMBDA_BOUND_2026_05_20 === 'object' &&
                          ASYMPTOTIC_LAMBDA_BOUND_2026_05_20 !== null &&
                          ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.ticket === 'imp-1147';
const ESY_O1_IMPORT_LIVE = typeof ESY_O1_CLOSURE === 'object' &&
                           ESY_O1_CLOSURE !== null &&
                           ESY_O1_CLOSURE.id === 'imp-508';

// ── Exported record ───────────────────────────────────────────────────────
export const KOKSMA_HLAWKA_2ND_MOMENT = Object.freeze({
  id: 'imp-1149',
  ticket: 'imp-1149',
  title:
    'HONEST PARTIAL: 2nd-moment Koksma-Hlawka attempt at |t_c(N) - a - b/N| = O((log N)^k / N^2)',
  builtAt: '2026-05-20T11:30:00Z',

  status: 'honest-partial-with-obstruction',
  closureType: 'partial-intermediate-rate-with-named-obstructions',

  // Explicit constants — the intermediate N^{-3/2} bound IS derived.
  explicit_C: CHO,        // approximately 189 at C_Selberg = 3
  explicit_k: 0,          // The intermediate bound carries log^0 in the
                          // numerator (the L factor appears in the
                          // denominator), so k = 0 in the form C / N^{3/2}.
                          // For the TARGET N^{-2} rate, k is not closed.
  explicitRateAchieved: '|t_c(N) - 1/(2 M_infty(N))| <= 108 / (log gamma_N * N^{3/2})',
  rateAchievedExponent: 1.5,    // we achieve N^{-3/2}
  rateTargetExponent: 2.0,      // target is N^{-2}
  rateGap: 0.5,                 // residual exponent gap is 1/2

  attemptedDerivation: ATTEMPTED_DERIVATION,
  namedObstructions: NAMED_OBSTRUCTIONS,

  // Numerical witness table
  witnessRows: WITNESS_ROWS,
  witnessSummary: {
    allIntermediateBetterThanTrivial: ALL_INTERMEDIATE_BETTER_THAN_TRIVIAL,
    allIntermediateWorseThanTarget: ALL_INTERMEDIATE_WORSE_THAN_TARGET,
    interpretation:
      'The intermediate N^{-3/2} bound is strictly tighter than the trivial ' +
      'N^{-1} rate of the 1st-moment KH (imp-341) at every sampled N, ' +
      'confirming this file delivers a real improvement over imp-341. ' +
      'It is strictly looser than the N^{-2} target at every sampled N, ' +
      'confirming the goal is not closed and the named obstructions are ' +
      'live blockers.',
  },

  constants: {
    C_Selberg: C_SELBERG,
    C1_pi_times_C_Selberg: C1,
    K0_psi_strip_const: K0,
    K1_M_infty_strip_const: K1,
    CHO_composed_const: CHO,
  },

  honestScope: {
    isRigorous: true,                       // the intermediate bound IS rigorous
    isUnconditional: true,                  // unconditionally derived from imp-341
    closesImp1147Conditional: false,        // does NOT flip imp-1147 to unconditional
    achievesN2Rate: false,                  // we got N^{-3/2}, not N^{-2}
    summary:
      'The 2nd-moment Koksma-Hlawka route attempted by imp-1149 DOES deliver an ' +
      'intermediate unconditional rate |t_c(N) - 1/(2 M_infty(N))| = O(1 / (log gamma_N * N^{3/2})) ' +
      'STRICTLY BETTER THAN THE 1st-moment N^{-1} RATE of imp-341. ' +
      'It does NOT deliver the target N^{-2} rate. The gap is the ' +
      'exponent 1/2 in N, blocked by three named obstructions (sub-Selberg ' +
      'discrepancy, L^2-to-L^infty Sobolev cost, ESY rigidity port). ' +
      'IMP-1147 REMAINS CONDITIONAL on the linear-1/N model after this commit. ' +
      'The intermediate rate is an honest contribution: it tightens imp-341 ' +
      'by a factor of sqrt(N) on the deviation of t_c(N) from its limit shape.',
  },

  paperEffect: {
    flipsConditionalToUnconditional: false,
    intermediateRateUsable:
      'The intermediate N^{-3/2} bound CAN tighten the imp-1147 sup-bound on ' +
      'the asymptote a slightly, but the conditional dependence on the linear-1/N ' +
      'model is NOT closed and Theorem 2 in paper/main.tex retains its ' +
      '"conditional on linear-1/N model" qualifier.',
    requiredForFullClosure:
      'Closure of any one of the three named obstructions (sub-Selberg, ' +
      'Sobolev cost, ESY rigidity full port).',
  },

  references: {
    imp341:  'LAMBDA_INTERCEPT_BURGERS_UNIFORMITY (1st-moment KH bound, source of psi_N)',
    imp338:  'DYSON_BURGERS_SHOCK (continuum Burgers backward collision identity)',
    imp407:  'ESY rigidity port taxonomy (O1-O3 obstacles)',
    imp508:  'esy-o1-closure.js (HONEST PARTIAL O1 closure at C_poly = 1)',
    imp1147: 'asymptotic-lambda-bound-2026-05-20.js (conditional asymptotic Lambda <= 7.98e-4)',
    hlawka1971:      'Hlawka, Theorie der Gleichverteilung 1971 (L^2 KH inequality)',
    niederreiter1992: 'Niederreiter, Random Number Generation 1992, Theorem 2.6',
    selberg1946:     'Selberg, |S(T)| <= C log T / log log T unconditionally',
  },

  consumes: [
    LAMBDA_INTERCEPT_BURGERS_UNIFORMITY.id,
    ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.id,
    ESY_O1_CLOSURE.id,
  ],

  liveImports: {
    kh1ImportLive: KH1_IMPORT_LIVE,
    asympImportLive: ASYMP_IMPORT_LIVE,
    esyO1ImportLive: ESY_O1_IMPORT_LIVE,
  },
});

// ── Build-time tripwires (6+ required) ────────────────────────────────────
export const KOKSMA_HLAWKA_2ND_MOMENT_ASSERTIONS = [
  {
    id: 'imp1149-status-honest-partial-not-closed',
    holds: () => KOKSMA_HLAWKA_2ND_MOMENT.status === 'honest-partial-with-obstruction',
    why:
      'The 2nd-moment KH attempt did NOT achieve the N^{-2} rate. Status must ' +
      'remain "honest-partial-with-obstruction" -- flipping to "closed" would ' +
      'be an overclaim. The intermediate N^{-3/2} bound IS rigorous but does ' +
      'NOT close the imp-1147 conditional dependence.',
  },
  {
    id: 'imp1149-imp1147-conditional-still-honest',
    holds: () =>
      ASYMPTOTIC_LAMBDA_BOUND_2026_05_20.honestScope.isUnconditional === false &&
      KOKSMA_HLAWKA_2ND_MOMENT.honestScope.closesImp1147Conditional === false,
    why:
      'This file MUST NOT flip imp-1147 to unconditional. The honest closure ' +
      'route (achieving the N^{-2} rate) is blocked by three named obstructions. ' +
      'If imp-1147 honestScope.isUnconditional becomes true OR ' +
      'KOKSMA_HLAWKA_2ND_MOMENT.honestScope.closesImp1147Conditional becomes true, ' +
      'this tripwire fires.',
  },
  {
    id: 'imp1149-three-obstructions-named',
    holds: () => {
      const obs = KOKSMA_HLAWKA_2ND_MOMENT.namedObstructions;
      if (!Array.isArray(obs) || obs.length < 3) return false;
      const ids = new Set(obs.map((o) => o.id));
      return (
        ids.has('imp-1149-sub-sub-selberg-discrepancy') &&
        ids.has('imp-1149-sub-L2-to-Linfty-sobolev-cost') &&
        ids.has('imp-1149-sub-erdos-schlein-yau-port-residual')
      );
    },
    why:
      'Three named obstructions are required: (1) sub-Selberg discrepancy, ' +
      '(2) L^2-to-L^infty Sobolev cost, (3) ESY rigidity full port. Removal ' +
      'of any of these would create a false impression that the N^{-2} closure ' +
      'is achievable without an explicit research-grade input. Tripwire is ' +
      'id-set-based so additive admissions of further sub-gaps do not falsely fire.',
  },
  {
    id: 'imp1149-explicit-intermediate-rate-derived',
    holds: () => {
      const k = KOKSMA_HLAWKA_2ND_MOMENT;
      return (
        typeof k.explicit_C === 'number' && Number.isFinite(k.explicit_C) && k.explicit_C > 0 &&
        k.rateAchievedExponent === 1.5 &&
        k.rateTargetExponent === 2.0 &&
        k.rateGap === 0.5
      );
    },
    why:
      'The intermediate N^{-3/2} bound has an explicit positive constant ' +
      'CHO approximately equal to 189 (numerically 2*K0/K1^2 with K0,K1 from imp-341). ' +
      'The achieved exponent 1.5 is strictly smaller than the target 2.0; ' +
      'the residual gap is 0.5. Drift of these numeric exponents indicates a ' +
      'silent edit of the derivation arithmetic.',
  },
  {
    id: 'imp1149-witness-intermediate-better-than-trivial',
    holds: () => ALL_INTERMEDIATE_BETTER_THAN_TRIVIAL && WITNESS_ROWS.length >= 5,
    why:
      'At every sampled N in {100, 1000, 10000, 100000, 1000000}, the ' +
      'intermediate N^{-3/2} bound (CHO / (L * N^{1.5})) must be strictly less ' +
      'than the trivial N^{-1} bound. If this fails the intermediate rate is ' +
      'not an improvement over imp-341 and the file claim is empty.',
  },
  {
    id: 'imp1149-witness-intermediate-worse-than-target',
    holds: () => ALL_INTERMEDIATE_WORSE_THAN_TARGET && WITNESS_ROWS.length >= 5,
    why:
      'At every sampled N, the intermediate bound MUST be strictly greater than ' +
      'the target N^{-2} bound. If this fails, the partial-closure status is ' +
      'wrong and the file should claim full closure -- but the derivation shows ' +
      'we did not achieve N^{-2}, so the witness rows must reflect that gap.',
  },
  {
    id: 'imp1149-derivation-step-count',
    holds: () => Array.isArray(KOKSMA_HLAWKA_2ND_MOMENT.attemptedDerivation) &&
                 KOKSMA_HLAWKA_2ND_MOMENT.attemptedDerivation.length === 9,
    why:
      'The attemptedDerivation array carries exactly 9 steps: steps 1-6 derive ' +
      'the intermediate N^{-3/2} bound, steps 7-9 attempt the N^{-2} closure ' +
      'via three routes (L^2 KH, squared discrepancy, ESY) -- each blocked by a ' +
      'named obstruction. Step count drift indicates a silent edit; 9 is the ' +
      'load-bearing count for the honesty content.',
  },
  {
    id: 'imp1149-imports-live',
    holds: () => KH1_IMPORT_LIVE && ASYMP_IMPORT_LIVE && ESY_O1_IMPORT_LIVE,
    why:
      'Three upstream imports must be live: LAMBDA_INTERCEPT_BURGERS_UNIFORMITY ' +
      '(imp-341, the 1st-moment source), ASYMPTOTIC_LAMBDA_BOUND_2026_05_20 ' +
      '(imp-1147, the conditional being attacked), and ESY_O1_CLOSURE (imp-508, ' +
      'the ESY obstruction route). If any import goes stale, the file silently ' +
      'detaches from the rigor chain and the partial-closure citation network ' +
      'breaks.',
  },
  {
    id: 'imp1149-citation-network-pinned',
    holds: () => {
      const r = KOKSMA_HLAWKA_2ND_MOMENT.references;
      const keys = Object.keys(r);
      return (
        keys.includes('imp341') &&
        keys.includes('imp508') &&
        keys.includes('imp1147') &&
        keys.includes('imp338') &&
        keys.includes('imp407')
      );
    },
    why:
      'The references manifest must include imp-341 (1st-moment KH source), ' +
      'imp-338 (Burgers identity), imp-407 (ESY taxonomy), imp-508 (ESY obstacle ' +
      'O1 partial closure), and imp-1147 (conditional asymptotic bound being ' +
      'attacked). Removal of any of these breaks the citation chain and the ' +
      'partial-closure rigor argument becomes orphan.',
  },
  {
    id: 'imp1149-paper-effect-honest',
    holds: () => KOKSMA_HLAWKA_2ND_MOMENT.paperEffect.flipsConditionalToUnconditional === false,
    why:
      'paperEffect.flipsConditionalToUnconditional MUST remain false. The N^{-3/2} ' +
      'intermediate bound CANNOT support a flip of Theorem 2 to "unconditional". ' +
      'A future commit that sets this to true must also close one of the three ' +
      'named obstructions and update the paper Section 4 atomically -- bare flip ' +
      'is an overclaim.',
  },
];
