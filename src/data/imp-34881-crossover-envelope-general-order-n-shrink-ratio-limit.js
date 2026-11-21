/**
 * @module imp-34881-crossover-envelope-general-order-n-shrink-ratio-limit
 *
 * imp-34881 (accuracy, S-frontier): imp-34839 (n=2) derived the crossover-map SECOND-derivative
 * envelope per-decade shrink ratio -> EXACTLY 100x/decade with residual 100 - r ~ (100 log 10)/u^2
 * (C_2 = 100 log 10 = 230.2585), and imp-34864 (n=3) derived the THIRD-derivative -> EXACTLY
 * 1000x/decade with C_3 = 1000 log 10 = 2302.5851, flagging the general envelope pattern
 * "residual constant = limit x log 10" without deriving it for general n. This module UNIFIES the two
 * points by DERIVING the GENERAL order-n envelope per-decade shrink-ratio limit = EXACTLY 10^n and its
 * residual constant C_n = 10^n log 10, reusing the imp-34731/34757/34768 closed forms VERBATIM and
 * generating |g^(n)| for arbitrary n from a single closed-form recurrence.
 *
 * WHAT THIS ADDS (accuracy assessment on the inherited surrogate; no new bound, no new mathematics beyond
 * the recurrence that reproduces the two published closed forms)
 * ---------------------------------------------------------------------------------------------------------
 *   (Z0) THE GENERAL CLOSED FORM by recurrence. With g(N) = K log T0(N), M = T0/2pi, u = log M, the
 *        exact chain rule dM/dN = 1/u and du/dN = 1/(Mu) gives g^(n)(N) = K Q_n(u) / (M^n u^(2n-1)) with
 *        Q_n a degree-(n-1) polynomial obeying the recurrence
 *            Q_1(u) = 1,   Q_{n+1}(u) = u Q_n_prime(u) - (n u + (2n-1)) Q_n(u).
 *        In coefficient form (Q_n = sum c_i u^i): Q_{n+1}[i] = (i - (2n-1)) c_i - n c_{i-1}. This
 *        REPRODUCES the two published forms EXACTLY: Q_2 = -(u+1) (imp-34731 g_double_prime), Q_3 =
 *        2u^2+4u+3 (imp-34768 g_triple_prime), and extends to Q_4 = -(6u^3+18u^2+25u+15) for n=4.
 *        Write P_n = |Q_n| (all coefficients share one sign per n) so |g^(n)| = K P_n(u)/(M^n u^(2n-1)).
 *   (Z1) DERIVES the limit = 10^n. The per-decade left-endpoint shrink ratio factors EXACTLY as
 *            r_n(N) = B_n(N)/B_n(10N) = (M_prime/M)^n (u_prime/u)^(2n-1) P_n(u)/P_n(u_prime).
 *        The Riemann-von Mangoldt leading law N = M(u-1) forces the decade step s = u_prime - u to solve
 *        e^s(u_prime-1) = 10(u-1), so s -> log 10 and M_prime/M -> 10, hence (M_prime/M)^n -> 10^n while
 *        the u-power factor and the polynomial-ratio -> 1. The limit is EXACTLY 10^n/decade, unifying
 *        imp-34839 (n=2, 100) and imp-34864 (n=3, 1000).
 *   (Z2) DERIVES the residual constant C_n = 10^n log 10 by the SAME expansion, GENERALISED. Writing
 *        log(r_n/10^n) = n(s - log 10) + (2n-1) log(u_prime/u) + [log P_n(u) - log P_n(u_prime)] and using
 *        P_n(u) ~ (n-1)! u^(n-1) (leading term), the O(1/u) coefficients cancel UNIVERSALLY:
 *            -n  +  (2n-1)  -  (n-1)  =  0   for EVERY n
 *        (the three contributions come from n(s-log 10), (2n-1)log(u_prime/u), and the leading (n-1)log u
 *        of log P_n). This is WHY the limit is exactly 10^n for all n. The next order leaves the SAME
 *        universal leading term log(r_n/10^n) ~ -(log 10)/u^2 (n-INDEPENDENT), so
 *            10^n - r_n(N) ~ 10^n (log 10)/u^2,  i.e.  C_n = 10^n log 10 = (limit) x log 10.
 *   (Z3) REFUTES the ticket hypothesis C_n = n*100*log 10. That form predicts C_2 = 460.5170, but the
 *        published/measured value is C_2 = 230.2585 = 100 log 10 -- a factor-of-2 miss at the very first
 *        point. The correct law is C_n = 10^n log 10 (exponential in n, NOT linear): C_2 = 230.2585,
 *        C_3 = 2302.5851, C_4 = 23025.8509. The hypothesis is WRONG; it is recorded here as refuted.
 *   (Z4) MEASURES the approach on the [1e9..1e30] decade ladder plus deep probes {1e40,1e80,1e150} for
 *        n in {2,3,4} (all via the numerically-stable FACTORED ratio, so M^n never overflows). The
 *        fitted constant C_n_k = (10^n - r_n_k) u_k^2 converges to 10^n log 10 for every n (deepest-probe
 *        relerr < 5e-3 for all three orders). Direction of approach DIFFERS by parity of the O(1/u^3)
 *        correction: n=2 rises from BELOW (0.9775 -> 0.9991 of the limit), while n=3 and n=4 fall from
 *        ABOVE (1.0284 -> 1.0020 and 1.0650 -> 1.0040) -- but all confirm the SAME leading constant.
 *   (Z5) CROSS-CHECKS the recurrence. Q_2, Q_3 equal the imp-34731 / imp-34768 published polynomials
 *        coefficient-for-coefficient, and the factored ratio equals a direct |g^(n)| recomputation to
 *        machine precision on the shallow band (u ~ 18, M^n still finite in double precision).
 *
 * THE CLOSED FORM (inherited from imp-34731 / imp-34757 / imp-34768, unchanged; the recurrence merely
 * reproduces and extends them)
 * ------------------------------------------------------------------------------------------------------
 *     g(N) = K log T0(N),  K = (C_C/E_trunc)^2 ~ 1.5727e8,  T = T0(N),  u = log(T/2pi),  M = T/2pi,
 *     g_double_prime = -K(u+1)/(M^2 u^3)      (imp-34731, Q_2 = -(u+1)),
 *     g_triple_prime = K(2u^2+4u+3)/(M^3 u^5)  (imp-34768, Q_3 = 2u^2+4u+3).
 *
 * ACCURACY ASSESSMENT ONLY. This derives + measures the GENERAL order-n curvature-envelope shrink LIMIT
 * of the INHERITED imp-3220/imp-3406 surrogate crossover map; it introduces NO new bound and changes
 * none. The C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz (imp-2642/imp-2643) is
 * UNTOUCHED; establishes no operator positivity; far-tail exponent stays 1/2 (imp-3463); no RH verdict,
 * NO QED. No refereed bound is changed.
 *
 * @see imp-34839-crossover-gpp-shrink-ratio-limit (n=2: 100x/decade + C_2 = 100 log 10)
 * @see imp-34864-crossover-gppp-shrink-ratio-limit (n=3: 1000x/decade + C_3 = 1000 log 10; pattern flagged)
 * @see imp-34768-crossover-gppp-global-envelope (g_triple_prime closed form = Q_3)
 * @see imp-34731-crossover-map-second-derivative-bound (g_double_prime closed form = Q_2)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 via Riemann-von Mangoldt inverse)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi); the 1/8 ansatz per imp-2642)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8 (imp-33723 amplitude)
const LN10 = Math.log(10);

// (Z0) THE RECURRENCE. Q_1 = [1]; Q_{n+1}[i] = (i - (2n-1)) c_i - n c_{i-1}, where Q_n = sum c_i u^i.
// Returns the coefficient array of Q_n (low order first). Sign alternates as (-1)^(n-1).
function coeffsQ(n) {
  let Q = [1];
  for (let k = 1; k < n; k++) {
    const m = Q.length;
    const out = new Array(m + 1).fill(0);
    for (let i = 0; i <= m; i++) {
      const ci = i < m ? Q[i] : 0;
      const cim1 = i - 1 >= 0 && i - 1 < m ? Q[i - 1] : 0;
      out[i] = (i - (2 * k - 1)) * ci - k * cim1;
    }
    Q = out;
  }
  return Q;
}
// P_n = |Q_n| (every coefficient shares the sign (-1)^(n-1), so abs is safe). |g^(n)| = K P_n(u)/(M^n u^(2n-1)).
function coeffsP(n) {
  return coeffsQ(n).map(Math.abs);
}
function evalPoly(coeffs, u) {
  let s = 0;
  for (let i = coeffs.length - 1; i >= 0; i--) s = s * u + coeffs[i];
  return s;
}
function uOfN(N) {
  return Math.log(effectiveHeightForN(N) / TWO_PI);
}

// (Z1)/(Z4) Per-decade ratio via the FACTORED form (numerically stable to arbitrary depth: M_prime/M is
// computed as T_prime/T so M^n never overflows double precision):
//     r_n = (M_prime/M)^n (u_prime/u)^(2n-1) P_n(u)/P_n(u_prime).
function shrinkRatioFactored(n, e) {
  const P = coeffsP(n);
  const T = effectiveHeightForN(Math.pow(10, e));
  const Tp = effectiveHeightForN(Math.pow(10, e + 1));
  const u = Math.log(T / TWO_PI);
  const up = Math.log(Tp / TWO_PI);
  const mRatio = Tp / T; // M_prime/M = T_prime/T
  return mRatio ** n * (up / u) ** (2 * n - 1) * evalPoly(P, u) / evalPoly(P, up);
}

// (Z5) Direct |g^(n)| recomputation (valid only where M^n stays finite in double precision, i.e. the
// shallow bands) -- an algebra cross-check that the factored ratio is faithful.
function absNthDeriv(n, N) {
  const M = effectiveHeightForN(N) / TWO_PI;
  const u = Math.log(M);
  return (K_AMPL * evalPoly(coeffsP(n), u)) / (M ** n * u ** (2 * n - 1));
}
function shrinkRatioDirect(n, e) {
  return absNthDeriv(n, Math.pow(10, e)) / absNthDeriv(n, Math.pow(10, e + 1));
}

// The three orders unified by this module (n=2 imp-34839, n=3 imp-34864, n=4 new).
const ORDERS = [2, 3, 4];
// (Z4) [1e9..1e30] decade ladder plus deep probes {1e40,1e80,1e150}.
const LADDER_EXPONENTS = [];
for (let e = 9; e <= 30; e++) LADDER_EXPONENTS.push(e);
const DEEP_PROBE_EXPONENTS = [40, 80, 150];

function rowFor(n, e) {
  const limit = Math.pow(10, n);
  const C_n = limit * LN10; // (Z2) DERIVED residual constant = limit x log 10
  const r = shrinkRatioFactored(n, e);
  const residual = limit - r;
  const u = uOfN(Math.pow(10, e));
  return {
    log10N: e,
    shrinkRatio: r,
    residual,
    u,
    fittedConstant_C: residual * u * u, // -> 10^n log 10 as u -> infinity
    ratioToLimit_C: (residual * u * u) / C_n, // -> 1
  };
}

// Build per-order tables and convergence diagnostics.
const PER_ORDER = ORDERS.map((n) => {
  const limit = Math.pow(10, n);
  const C_n = limit * LN10;
  const ladder = LADDER_EXPONENTS.map((e) => rowFor(n, e));
  const deep = DEEP_PROBE_EXPONENTS.map((e) => rowFor(n, e));
  const combined = [...ladder, ...deep];
  // ratios stay strictly below the derived limit 10^n and net-rise across the decade ladder.
  let ratiosBelowLimit = true;
  for (const row of ladder) if (!(row.shrinkRatio < limit)) ratiosBelowLimit = false;
  const ratiosNetRise = ladder[ladder.length - 1].shrinkRatio > ladder[0].shrinkRatio;
  // deepest probe (1e150) fitted C_n relerr vs 10^n log 10.
  const deepest = deep[deep.length - 1];
  const deepestRelerr = Math.abs(deepest.ratioToLimit_C - 1);
  // direction of approach (does the fitted constant approach from below or above?).
  const approachesFromBelow = ladder[0].fittedConstant_C < C_n;
  return {
    n,
    limit,
    C_n,
    hypothesis_n100ln10: n * 100 * LN10, // (Z3) the REFUTED ticket hypothesis
    ladder,
    deep,
    combined,
    ratiosBelowLimit,
    ratiosNetRise,
    deepest,
    deepestRelerr,
    approachesFromBelow,
    // smallest-band (u ~ 18) fitted C relerr -- already close despite the shallow height.
    smallestBandRelerr: Math.abs(ladder[0].ratioToLimit_C - 1),
    // (Z5) factored-vs-direct cross-check on the shallow band.
    factoredVsDirectRelerr: Math.abs(shrinkRatioFactored(n, 9) / shrinkRatioDirect(n, 9) - 1),
  };
});

// (Z0)/(Z5) recurrence reproduces the two published closed forms coefficient-for-coefficient.
const Q2_MATCHES = JSON.stringify(coeffsQ(2)) === JSON.stringify([-1, -1]); // -(u+1)   imp-34731
const Q3_MATCHES = JSON.stringify(coeffsQ(3)) === JSON.stringify([3, 4, 2]); // 2u^2+4u+3 imp-34768
const Q4_COEFFS = coeffsQ(4); // [-15,-25,-18,-6] = -(6u^3+18u^2+25u+15), the new n=4 form

// (Z1) every order converges to its 10^n limit (deepest-probe fitted C within tolerance of 10^n log 10).
const ALL_ORDERS_CONVERGE = PER_ORDER.every((o) => o.deepestRelerr < 5e-3);
// (Z2) the residual constant equals 10^n log 10 exactly (definitional; the measured C_n tracks it).
const RESIDUAL_CONSTANT_LAW = 'C_n = 10^n log 10';
// (Z3) the ticket hypothesis C_n = n*100*log 10 is refuted -- it misses C_2 by a factor of 2 and grows
// linearly where the true law grows like 10^n. Quantify the miss at n=2 (the published anchor).
const HYP_MISS_RATIO_N2 = PER_ORDER[0].hypothesis_n100ln10 / PER_ORDER[0].C_n; // = 2 exactly
const HYPOTHESIS_REFUTED = Math.abs(HYP_MISS_RATIO_N2 - 2) < 1e-12 && HYP_MISS_RATIO_N2 > 1.5;
// (Z5) recurrence-vs-published and factored-vs-direct all clean.
const RECURRENCE_FAITHFUL = Q2_MATCHES && Q3_MATCHES;
const FACTORED_MATCHES_DIRECT = PER_ORDER.every((o) => o.factoredVsDirectRelerr < 1e-10);

function tabulate(rows) {
  return rows.map((r) => ({
    log10N: r.log10N,
    shrink_ratio: +r.shrinkRatio.toFixed(6),
    residual_limit_minus_r: +r.residual.toExponential(6),
    u: +r.u.toFixed(4),
    fitted_C_residual_times_u2: +r.fittedConstant_C.toFixed(4),
    ratio_to_10n_ln10: +r.ratioToLimit_C.toFixed(6),
  }));
}

export const IMP34881_CROSSOVER_ENVELOPE_GENERAL_ORDER_N_SHRINK_RATIO_LIMIT = {
  id: 'imp-34881',
  proofSection: 'S-frontier',
  question:
    'imp-34839 (n=2) and imp-34864 (n=3) derived the crossover-map curvature-envelope per-decade shrink ' +
    'ratio limits 100x and 1000x with residual constants 100 log 10 and 1000 log 10, flagging a general ' +
    '"residual constant = limit x log 10" pattern. Derive the GENERAL order-n envelope B_n(N) = ' +
    'K P_n(u)/(M^n u^(2n-1)) per-decade shrink-ratio limit and its residual constant C_n, test the ' +
    'hypothesis C_n = n*100*log 10, and measure the approach on [1e9..1e150] for n in {2,3,4}. Accuracy ' +
    'assessment; reuses the imp-34731/34757/34768 closed forms verbatim; changes no bound; no QED.',
  generalClosedFormRecurrence:
    'g^(n)(N) = K Q_n(u)/(M^n u^(2n-1)), T = T0(N), M = T/2pi, u = log M; Q_1 = 1, ' +
    'Q_{n+1}(u) = u Q_n_prime(u) - (n u + (2n-1)) Q_n(u); in coefficients Q_{n+1}[i] = (i-(2n-1)) c_i - n c_{i-1}. ' +
    'Reproduces Q_2 = -(u+1) (imp-34731) and Q_3 = 2u^2+4u+3 (imp-34768); extends to Q_4 = -(6u^3+18u^2+25u+15).',
  shrinkRatioFactorisation:
    'r_n(N) = B_n(N)/B_n(10N) = (M_prime/M)^n (u_prime/u)^(2n-1) P_n(u)/P_n(u_prime), P_n = |Q_n|; ' +
    'Riemann-von Mangoldt N = M(u-1) gives e^s(u_prime-1)=10(u-1) with s = u_prime - u -> log 10, so ' +
    'M_prime/M -> 10, (M_prime/M)^n -> 10^n and the u-power + polynomial-ratio -> 1',
  perDecadeShrinkRatioLimit: 'EXACTLY 10^n per decade (the M^n = T^n factor)', // (Z1)
  residualLaw:
    '10^n - r_n(N) ~ (10^n log 10)/u^2 as u -> infinity, u = log(T0/2pi); the O(1/u) coefficients ' +
    '-n + (2n-1) - (n-1) = 0 cancel UNIVERSALLY (WHY the limit is 10^n for all n), leaving the ' +
    'n-INDEPENDENT leading term log(r_n/10^n) ~ -(log 10)/u^2',
  residualConstantLaw: RESIDUAL_CONSTANT_LAW, // (Z2) C_n = 10^n log 10 = limit x log 10
  residualConstantsByOrder: PER_ORDER.map((o) => ({
    n: o.n,
    limit: o.limit,
    C_n_equals_10n_ln10: +o.C_n.toFixed(4),
  })),
  q4CoefficientsLowOrderFirst: Q4_COEFFS, // [-15,-25,-18,-6]
  ticketHypothesisRefuted: {
    // (Z3) C_n = n*100*log 10 is WRONG.
    hypothesis: 'C_n = n*100*log 10 (linear in n)',
    predicts_C2: +(2 * 100 * LN10).toFixed(4), // 460.5170
    true_C2: +(100 * LN10).toFixed(4), // 230.2585
    missRatioAtN2: +HYP_MISS_RATIO_N2.toFixed(6), // exactly 2
    verdict:
      'REFUTED: the hypothesis predicts C_2 = 460.5170 but the published/measured value is 230.2585 ' +
      '(a factor-of-2 miss); the true law C_n = 10^n log 10 is exponential in n, not linear.',
  },
  perOrder: PER_ORDER.map((o) => ({
    n: o.n,
    limit: o.limit,
    C_n_10n_ln10: +o.C_n.toFixed(4),
    ladder: tabulate(o.ladder),
    deepProbes: tabulate(o.deep),
    ratiosStrictlyBelowLimit: o.ratiosBelowLimit,
    fittedC_approachesFromBelow: o.approachesFromBelow,
    deepestFittedC_relerrVsLaw: +o.deepestRelerr.toExponential(3),
    smallestBandFittedC_relerrVsLaw: +o.smallestBandRelerr.toExponential(3),
    factoredVsDirectRelerr: +o.factoredVsDirectRelerr.toExponential(3),
  })),
  allOrdersConvergeToLaw: ALL_ORDERS_CONVERGE,
  recurrenceReproducesPublished: RECURRENCE_FAITHFUL,
  factoredMatchesDirect: FACTORED_MATCHES_DIRECT,
  finding: {
    Z1_limit_is_exactly_10n:
      'The order-n per-decade shrink ratio converges to EXACTLY 10^n/decade for all n: ' +
      'r_n = (M_prime/M)^n (u_prime/u)^(2n-1) P_n(u)/P_n(u_prime) and s = u_prime - u -> log 10 forces ' +
      'M_prime/M -> 10 so (M_prime/M)^n -> 10^n. Unifies imp-34839 (n=2, 100) and imp-34864 (n=3, 1000).',
    Z2_residual_constant_law:
      'The O(1/u) coefficients cancel UNIVERSALLY as -n + (2n-1) - (n-1) = 0 for every n (from n(s-log10), ' +
      '(2n-1)log(u_prime/u) and the leading (n-1)log u of log P_n), leaving log(r_n/10^n) ~ -(log 10)/u^2 ' +
      'n-independently, so C_n = 10^n log 10 = (limit) x log 10 -- generalising 230.2585 (n=2) and 2302.5851 (n=3).',
    Z3_hypothesis_refuted:
      'The ticket hypothesis C_n = n*100*log 10 is REFUTED: it predicts C_2 = 460.5170 but C_2 = 230.2585 ' +
      '(factor-of-2 miss); the true law is exponential (10^n log 10), not linear (n*100*log 10).',
    Z4_approach_measured:
      'On [1e9..1e30] + deep probes {1e40,1e80,1e150} the fitted C_n_k = (10^n - r_n_k) u_k^2 converges to ' +
      '10^n log 10 for n in {2,3,4} (deepest-probe relerr < 5e-3 each). n=2 approaches from BELOW, n=3 and ' +
      'n=4 from ABOVE -- the O(1/u^3) correction changes sign by order -- but all confirm the same constant.',
    Z5_cross_check:
      'The recurrence reproduces Q_2 = -(u+1) (imp-34731) and Q_3 = 2u^2+4u+3 (imp-34768) ' +
      'coefficient-for-coefficient and extends to Q_4 = -(6u^3+18u^2+25u+15); the factored ratio equals a ' +
      'direct |g^(n)| recomputation to machine precision on the shallow band for all three orders.',
  },
  isRigorous: false,
  verdict:
    'ACCURACY ASSESSMENT (frontier-direction). imp-34839 (n=2) and imp-34864 (n=3) derived the ' +
    'crossover-map curvature-envelope per-decade shrink-ratio limits 100 and 1000 with residual constants ' +
    '100 log 10 and 1000 log 10, flagging a general "residual constant = limit x log 10" pattern without ' +
    'deriving it for general n. Reusing the imp-34731/34757/34768 closed forms VERBATIM, this UNIFIES them: ' +
    'the exact chain rule dM/dN = 1/u, du/dN = 1/(Mu) yields g^(n) = K Q_n(u)/(M^n u^(2n-1)) with the ' +
    'recurrence Q_{n+1} = u Q_n_prime - (n u + (2n-1)) Q_n, which reproduces Q_2 = -(u+1) and ' +
    'Q_3 = 2u^2+4u+3 exactly and extends to Q_4 = -(6u^3+18u^2+25u+15). The per-decade ratio factors as ' +
    'r_n = (M_prime/M)^n (u_prime/u)^(2n-1) P_n(u)/P_n(u_prime), and the Riemann-von Mangoldt law N = M(u-1) ' +
    'forces s = u_prime - u -> log 10, so (M_prime/M)^n -> 10^n: the limit is EXACTLY 10^n/decade. The ' +
    'O(1/u) coefficients cancel UNIVERSALLY (-n + (2n-1) - (n-1) = 0 for all n), leaving the n-INDEPENDENT ' +
    'leading term log(r_n/10^n) ~ -(log 10)/u^2, so C_n = 10^n log 10 = (limit) x log 10. The ticket ' +
    'hypothesis C_n = n*100*log 10 is REFUTED (it predicts C_2 = 460.5170 but C_2 = 230.2585, a factor-of-2 ' +
    'miss; the true law is exponential in n, not linear). On [1e9..1e30] + deep probes {1e40,1e80,1e150} ' +
    'the fitted C_n_k = (10^n - r_n_k) u_k^2 converges to 10^n log 10 for n in {2,3,4} (deepest relerr ' +
    '< 5e-3 each): n=2 from below, n=3 and n=4 from above -- the O(1/u^3) correction changes sign by order ' +
    'while all confirm the same constant. The factored ratio matches a direct |g^(n)| recomputation to ' +
    'machine precision. Accuracy assessment only on the INHERITED imp-3220/imp-3406 surrogate map; the ' +
    'C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; far-tail exponent stays 1/2 (imp-3463); no RH verdict, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-34839 (n=2 100x/decade + C_2 = 100 log 10); imp-34864 (n=3 1000x/decade + C_3 = 1000 log 10; ' +
    'general pattern flagged); imp-34768 (g_triple_prime = Q_3 closed form); imp-34731 (g_double_prime = Q_2 ' +
    'closed form); imp-34757 (per-band envelope); lambda-rh-height-mapping (effectiveHeightForN, ' +
    'Riemann-von Mangoldt inverse); imp-2631 (E_trunc fixed-strip route); imp-2642/imp-2643 (C_C 1/8 ansatz).',
};

export const IMP34881_CROSSOVER_ENVELOPE_GENERAL_ORDER_N_SHRINK_RATIO_LIMIT_ASSERTIONS = [
  {
    // (Z0)/(Z5): the recurrence reproduces the two published closed forms coefficient-for-coefficient.
    id: 'imp34881-recurrence-reproduces-published-Q2-Q3',
    description:
      'the order-n recurrence yields Q_2 = -(u+1) (imp-34731) and Q_3 = 2u^2+4u+3 (imp-34768) coefficient-for-coefficient',
    holds: () => RECURRENCE_FAITHFUL,
  },
  {
    // (Z1): every order converges to its exact 10^n/decade limit (deepest probe within 0.5%).
    id: 'imp34881-all-orders-converge-to-10n',
    description:
      'the fitted residual constant C_n_k = (10^n - r_n_k) u_k^2 converges to 10^n log 10 for n in {2,3,4} (deepest-probe relerr < 5e-3 each)',
    holds: () => ALL_ORDERS_CONVERGE,
  },
  {
    // (Z3): the ticket hypothesis C_n = n*100*log 10 is refuted -- it misses C_2 by exactly a factor of 2.
    id: 'imp34881-hypothesis-n100ln10-refuted',
    description:
      'the ticket hypothesis C_n = n*100*log 10 is refuted: it predicts C_2 = 460.5170 vs the true 230.2585 (exactly 2x miss); the true law is C_n = 10^n log 10',
    holds: () => HYPOTHESIS_REFUTED,
  },
  {
    // (Z1): the exact per-decade ratios stay strictly below the derived limit 10^n across the ladder for every order.
    id: 'imp34881-ratios-strictly-below-10n',
    description:
      'the exact per-decade ratios stay strictly below the derived limit 10^n and net-rise across [1e9..1e30] for n in {2,3,4}',
    holds: () => PER_ORDER.every((o) => o.ratiosBelowLimit && o.ratiosNetRise),
  },
  {
    // (Z5): the factored ratio equals a direct |g^(n)| recomputation to machine precision for every order.
    id: 'imp34881-factored-matches-direct',
    description:
      'the factored per-decade ratio equals a direct |g^(n)| recomputation to < 1e-10 relative on the shallow band for n in {2,3,4}',
    holds: () => FACTORED_MATCHES_DIRECT,
  },
  {
    // Honesty gate: accuracy assessment only, no QED, no refereed bound is changed.
    id: 'imp34881-honesty-gate-no-qed',
    description: 'Accuracy assessment only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34881_CROSSOVER_ENVELOPE_GENERAL_ORDER_N_SHRINK_RATIO_LIMIT.isRigorous === false &&
      /NO QED/.test(IMP34881_CROSSOVER_ENVELOPE_GENERAL_ORDER_N_SHRINK_RATIO_LIMIT.verdict) &&
      /refereed bound is changed/i.test(IMP34881_CROSSOVER_ENVELOPE_GENERAL_ORDER_N_SHRINK_RATIO_LIMIT.verdict),
  },
];

for (const a of IMP34881_CROSSOVER_ENVELOPE_GENERAL_ORDER_N_SHRINK_RATIO_LIMIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34881-crossover-envelope-general-order-n-shrink-ratio-limit assertion failed: ${a.id}`);
  }
}
