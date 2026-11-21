/**
 * imp-95121 - CLOSED-FORM linear attainment-shortfall rate constant kappa(b, j)
 * at the substituted corner: first-order Taylor law derived, not measured.
 * RIGOROUS derivation step (elementary calculus + partial fractions); the
 * numeric evaluation of the closed form is float. NO QED; no bound change.
 *
 * CONTEXT. imp-95090 Finding (3) MEASURED that along the corner sequence
 * d_1 = 2^-(b+1) (1 + eps), d_2 = 2^-(b+j) at the dominant cell (0, 2) the
 * fixed-grid attainment shortfall
 *     shortfall(eps) = 1 - I(T(eps), rho(eps)) / I(T0, rho0)
 * decays linearly in eps with per-decade ratio ~0.10 (eps = 1e-1: 0.4733,
 * 1e-2: 0.0686, 1e-3: 0.00716, 1e-4: 0.000719). The linear LAW and its slope
 * were empirical. This module DERIVES both: shortfall(eps) = kappa(b, j) eps
 * + O(eps^2), with kappa in elementary closed form, and cross-checks it
 * against the imp-95090 ladder. The measured "per-decade ~0.10" is then a
 * COROLLARY (ratio -> 1/10 exactly, with an O(eps) correction), not a datum.
 *
 * NAMING. kappa here is the shortfall RATE constant. It is unrelated to the
 * imp-95096 Pareto-line coefficient written K(0,2) there (a lambda_max), and
 * unrelated to the E_trunc kappa = 2/5 PT-anchor exponent.
 *
 * SETTING (sibling chain conventions, Permuting the Zeta Twin Ladder Section
 * 4.5; reference v = c = D = 1, beta = 1/3, sigma = 1, theta = 10, s = 11).
 * Normalized exact pair correlation
 *     I(T, rho) = rho^(-1/2) integral (1 + |u|/rho)^(-s) (1 + |u - T|)^(-s) du.
 * Corner sequence at cell (b, j): d_1 = lo1 (1 + eps), d_2 = hi2 fixed, with
 * lo1 = 2^-(b+1), hi2 = 2^-(b+j), T = hi2^beta (1/hi2 - 1/d_1),
 * rho = (hi2/d_1)^beta. At eps = 0 these are the substituted corner
 * T0 = V(b, j), rho0 = rhoCap(j) = 2^(-(j-1) beta) of the nineteenth
 * continuation, so I(T0, rho0) = envE(b, j).
 *
 * LEMMA PF-M (mixed-exponent partial fractions - elementary algebra). For
 * integers m, n >= 1 and 0 < a != b, the repeated-linear-factor decomposition
 *   1/((t+a)^m (t+b)^n) = sum_{k=1..m} c_k (t+a)^(-k)
 *                       + sum_{k=1..n} d_k (t+b)^(-k),
 *   c_k = (-1)^(m-k) binom(m+n-k-1, m-k) (b-a)^(-(m+n-k)),
 *   d_k = (-1)^(n-k) binom(m+n-k-1, n-k) (a-b)^(-(m+n-k)),
 * (coefficients read off from the Taylor expansion of the complementary
 * factor at the pole; d_1 = -c_1, so the k = 1 tails pair into one log) gives
 *   A(a, b; m, n) = integral_0^inf dt (t+a)^(-m) (t+b)^(-n)
 *     = sum_{k=2..m} c_k a^(1-k)/(k-1) + sum_{k=2..n} d_k b^(1-k)/(k-1)
 *       + c_1 log(b/a),
 * and for the finite piece, with S = a + c and ALL-POSITIVE coefficients
 * p_k = binom(m+n-k-1, m-k) S^(-(m+n-k)), q_k = binom(m+n-k-1, n-k) S^(-(m+n-k)):
 *   Mid(a, c; m, n; T) = integral_0^T dx (x+a)^(-m) (c-x)^(-n)
 *     = sum_k p_k Ja(k) + sum_k q_k Jc(k),
 *   Ja(1) = log((T+a)/a), Ja(k) = (a^(1-k) - (T+a)^(1-k))/(k-1),
 *   Jc(1) = log(c/(c-T)), Jc(k) = ((c-T)^(1-k) - c^(1-k))/(k-1).
 * The m = n = s case is exactly the nineteenth-continuation Lemma PF; the
 * mixed case (s+1, s) is what the T-derivative needs. Splitting the u-line at
 * 0 and T (T > 0) gives the two-parameter family
 *   J(m, n; T, rho) = integral (1 + |u|/rho)^(-m) (1 + |u - T|)^(-n) du
 *     = rho^m ( A(rho, 1+T; m, n) + Mid(rho, 1+T; m, n; T)
 *             + A(rho+T, 1; m, n) ),
 * so I(T, rho) = rho^(-1/2) J(s, s; T, rho).
 *
 * LEMMA DT (T-derivative in closed form). Differentiating under the integral
 * (dominated convergence: the integrand and its T-derivative are continuous
 * and dominated locally uniformly by integrable envelopes), and substituting
 * w = u - T so the T-dependence moves into the first factor,
 *   dI/dT = rho^(-1/2) integral fprime(u) (1 + |u - T|)^(-s) du,
 *   fprime(u) = -(s/rho) sgn(u) (1 + |u|/rho)^(-s-1).
 * The sgn(u) splits the three pieces with a MINUS on the u < 0 piece:
 *   dI/dT = -s rho^(s - 1/2) ( Mid(rho, 1+T; s+1, s; T)
 *           + A(rho+T, 1; s+1, s) - A(rho, 1+T; s+1, s) ).
 *
 * LEMMA DR (rho-derivative in closed form). Differentiating
 * rho^(-1/2) (1 + |u|/rho)^(-s) in rho and using the reduction identity
 * |u| (1 + |u|/rho)^(-s-1) = rho ((1 + |u|/rho)^(-s) - (1 + |u|/rho)^(-s-1)):
 *   dI/drho = rho^(-3/2) ( (s - 1/2) J(s, s; T, rho)
 *             - s J(s+1, s; T, rho) ).
 *
 * THEOREM KAPPA-LIN (linear shortfall law with closed-form rate). The maps
 * eps -> T(eps), rho(eps) are real-analytic with
 *   Tprime(0) = hi2^beta / lo1 = 2^((b+1) - (b+j) beta),
 *   rhoprime(0) = -beta rho0,
 * and I is real-analytic in (T, rho) on T > 0, 0 < rho <= 1. Taylor with
 * remainder gives, one-sidedly at eps >= 0,
 *   shortfall(eps) = kappa(b, j) eps + O(eps^2),
 *   kappa(b, j) = ( -dI/dT Tprime(0) + beta rho0 dI/drho ) / I(T0, rho0),
 * all derivatives at the corner (T0, rho0) = (V(b, j), rhoCap(j)). Both
 * channels are nonnegative: dI/dT <= 0 by Lemma CC (I nonincreasing in T)
 * and dI/drho >= 0 by Lemma RM (V(b, j) > Ystar(s) covers every cell), so
 * kappa >= 0 - consistent with the corner being the cell sup. For j = 2
 * cells the algebraic identity 2^(j-1) - 1 = 1 makes Tprime(0) = T0 exactly,
 * so kappa(b, 2) = -T0 dlogI/dT + beta rho0 dlogI/drho at (V(b,2), 2^-beta).
 *
 * COROLLARY (per-decade ratio). shortfall(eps/10)/shortfall(eps) =
 * 1/10 + O(eps): the imp-95090 measured decade ratios 0.1450, 0.1044, 0.1004
 * are the O(eps) approach to the exact 1/10 of the linear law.
 *
 * REFERENCE EVALUATION (float, cell (0, 2), the dominant cell):
 *   dI/dT = -2.011215949908921e-4, dI/drho = 1.0822698460130087e-4,
 *   kappa(0, 2) = 7.1950399616423155
 *     = kappa_T 6.46456060590372 (89.85 pct, separation channel)
 *     + kappa_rho 0.730479355738596 (10.15 pct, width-ratio channel):
 * the shortfall rate is dominated 8.85:1 by the separation (T) channel, not
 * the width-ratio (rho) channel. Generic-cell check: kappa(2, 2) =
 * 9.203827084271076 matches its independent Richardson eps-slope to 5.8e-7.
 * The imp-95090 ladder deviates from kappa eps by the predicted O(eps):
 * deviation 0.04631 at eps = 1e-2, 0.004797 at 1e-3, 0.000543 at 1e-4
 * (factor ~10 per decade).
 *
 * RIGOR SCOPE (honest). The DERIVATION (Lemmas PF-M, DT, DR; Theorem
 * KAPPA-LIN; the corollary) is rigorous elementary analysis. The NUMERIC
 * value of kappa is a float evaluation of the closed form: the far A-piece
 * of the (s+1, s) family carries ~1e-6 relative cancellation (same class as
 * the ~1e-8 the nineteenth continuation records for its folded form; the
 * unfolded (s, s) evaluation here differs from the sibling folded evaluation
 * by a measured 2.26e-8 relative), and the kappa literal is certified to
 * ~1.2e-4 relative agreement against the independent Richardson slope of the
 * folded evaluator at the dominant cell (5.8e-7 at the clean (2, 2) cell).
 * The shortfall itself remains a fixed-97-lane attainment quantity: nothing
 * here moves a bracket. Import-light; NO heavy bundle. Changes no bound;
 * does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

import { IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL } from "./imp-95090-finite-rate-attainment-shortfall.js";

// -- shared conventions (independent copy, identical to the sibling chain) -----
const SIGMA = 1;
const BETA = 1 / 3;
const THETA = 10;
const SS = SIGMA + THETA;

function binom(n, k) {
  let r = 1;
  for (let i = 1; i <= k; i++) r = (r * (n - k + i)) / i;
  return r;
}

// -- folded Lemma PF closed form for I (independent copy of the nineteenth) ----
function outerFolded(rho, bb, s) {
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(bb - rho, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(rho - bb, -(2 * s - k));
    sum += (ck * Math.pow(rho, s + 1 - k) + dk * Math.pow(rho, s) * Math.pow(bb, 1 - k)) / (k - 1);
  }
  const c1s = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(bb - rho, -(2 * s - 1)) * Math.pow(rho, s);
  return sum + (c1s === 0 ? 0 : c1s * Math.log(bb / rho));
}
function farFolded(rho, T, s) {
  const a = rho + T;
  const rs = Math.pow(rho, s);
  if (rs === 0) return 0;
  let sum = 0;
  for (let k = 2; k <= s; k++) {
    const B = binom(2 * s - k - 1, s - k);
    const ck = Math.pow(-1, s - k) * B * Math.pow(1 - a, -(2 * s - k));
    const dk = Math.pow(-1, s - k) * B * Math.pow(a - 1, -(2 * s - k));
    sum += (rs * (ck * Math.pow(a, 1 - k) + dk)) / (k - 1);
  }
  const c1 = Math.pow(-1, s - 1) * binom(2 * s - 2, s - 1) * Math.pow(1 - a, -(2 * s - 1));
  return sum + (c1 === 0 ? 0 : rs * c1 * Math.log(1 / a));
}
function middleFolded(rho, T, s) {
  const c = 1 + T;
  const rs = Math.pow(rho, s);
  let sum = 0;
  for (let k = 1; k <= s; k++) {
    const pk = binom(2 * s - k - 1, s - k) * Math.pow(rho + c, -(2 * s - k));
    if (pk === 0) continue;
    const Ja =
      k === 1
        ? rs === 0
          ? 0
          : rs * Math.log((T + rho) / rho)
        : (Math.pow(rho, s + 1 - k) - rs * Math.pow(T + rho, 1 - k)) / (k - 1);
    const Jc = k === 1 ? rs * Math.log(c) : (rs * (1 - Math.pow(c, 1 - k))) / (k - 1);
    sum += pk * (Ja + Jc);
  }
  return sum;
}
function iExact(T, rho) {
  return Math.pow(rho, -0.5) * (outerFolded(rho, 1 + T, SS) + middleFolded(rho, T, SS) + farFolded(rho, T, SS));
}

// -- Lemma PF-M: mixed-exponent pieces A(a,b;m,n) and Mid(a,c;m,n;T) -----------
function Amn(a, b, m, n) {
  let sum = 0;
  for (let k = 2; k <= m; k++) {
    const ck = Math.pow(-1, m - k) * binom(m + n - k - 1, m - k) * Math.pow(b - a, -(m + n - k));
    sum += (ck * Math.pow(a, 1 - k)) / (k - 1);
  }
  for (let k = 2; k <= n; k++) {
    const dk = Math.pow(-1, n - k) * binom(m + n - k - 1, n - k) * Math.pow(a - b, -(m + n - k));
    sum += (dk * Math.pow(b, 1 - k)) / (k - 1);
  }
  const c1 = Math.pow(-1, m - 1) * binom(m + n - 2, m - 1) * Math.pow(b - a, -(m + n - 1));
  return sum + c1 * Math.log(b / a);
}
function Midmn(a, c, m, n, T) {
  const S = a + c;
  let sum = 0;
  for (let k = 1; k <= m; k++) {
    const pk = binom(m + n - k - 1, m - k) * Math.pow(S, -(m + n - k));
    const Ja = k === 1 ? Math.log((T + a) / a) : (Math.pow(a, 1 - k) - Math.pow(T + a, 1 - k)) / (k - 1);
    sum += pk * Ja;
  }
  for (let k = 1; k <= n; k++) {
    const qk = binom(m + n - k - 1, n - k) * Math.pow(S, -(m + n - k));
    const Jc = k === 1 ? Math.log(c / (c - T)) : (Math.pow(c - T, 1 - k) - Math.pow(c, 1 - k)) / (k - 1);
    sum += qk * Jc;
  }
  return sum;
}
function Jmn(m, n, T, rho) {
  const c = 1 + T;
  return Math.pow(rho, m) * (Amn(rho, c, m, n) + Midmn(rho, c, m, n, T) + Amn(rho + T, 1, m, n));
}

// -- Lemma DT / Lemma DR: the two closed-form partial derivatives --------------
function dIdT(T, rho) {
  const c = 1 + T;
  const m = SS + 1;
  const n = SS;
  return -SS * Math.pow(rho, SS - 0.5) * (Midmn(rho, c, m, n, T) + Amn(rho + T, 1, m, n) - Amn(rho, c, m, n));
}
function dIdRho(T, rho) {
  return Math.pow(rho, -1.5) * ((SS - 0.5) * Jmn(SS, SS, T, rho) - SS * Jmn(SS + 1, SS, T, rho));
}

// -- cell geometry and Theorem KAPPA-LIN ---------------------------------------
function pairT(d1, d2) {
  return Math.pow(d2, BETA) * (1 / d2 - 1 / d1);
}
function pairRho(d1, d2) {
  return Math.pow(d2 / d1, BETA);
}
function kappaCell(b, j) {
  const lo1 = Math.pow(2, -(b + 1));
  const hi2 = Math.pow(2, -(b + j));
  const T0 = pairT(lo1, hi2);
  const R0 = pairRho(lo1, hi2);
  const Tp = Math.pow(hi2, BETA) / lo1; // Tprime(0) = 2^((b+1) - (b+j) beta)
  const Rp = -BETA * R0; // rhoprime(0)
  const I0 = iExact(T0, R0);
  const IT = dIdT(T0, R0);
  const IR = dIdRho(T0, R0);
  const kappaT = (-IT * Tp) / I0;
  const kappaR = (-IR * Rp) / I0;
  return { b, j, T0, R0, Tp, Rp, I0, IT, IR, kappaT, kappaR, kappa: kappaT + kappaR };
}

const CELL02 = kappaCell(0, 2);
const CELL22 = kappaCell(2, 2);

// -- independent cross-checks (Richardson finite differences, folded iExact) ---
function fdRich(f, x, h) {
  const d1 = (f(x + h) - f(x - h)) / (2 * h);
  const d2 = (f(x + h / 2) - f(x - h / 2)) / h;
  return (4 * d2 - d1) / 3;
}
const FD_IT_02 = fdRich((t) => iExact(t, CELL02.R0), CELL02.T0, 1e-3);
const FD_IR_02 = fdRich((r) => iExact(CELL02.T0, r), CELL02.R0, 1e-3);

function contShort(b, j, eps) {
  const lo1 = Math.pow(2, -(b + 1));
  const hi2 = Math.pow(2, -(b + j));
  const d1 = lo1 * (1 + eps);
  return 1 - iExact(pairT(d1, hi2), pairRho(d1, hi2)) / iExact(pairT(lo1, hi2), pairRho(lo1, hi2));
}
function slopeRich(b, j, e) {
  const s1 = contShort(b, j, e) / e;
  const s2 = contShort(b, j, 2 * e) / (2 * e);
  return 2 * s1 - s2;
}
const SLOPE02 = slopeRich(0, 2, 1e-4);
const SLOPE22 = slopeRich(2, 2, 1e-4);

// deviation of the measured shortfall from the linear law, per decade
const DEV_LADDER = [1e-2, 1e-3, 1e-4].map((eps) => ({
  eps,
  deviation: 1 - contShort(0, 2, eps) / (CELL02.kappa * eps),
}));
// corollary: distance of the decade ratio from the exact 1/10
const DECADE_EPS = [1e-1, 1e-2, 1e-3, 1e-4];
const DECADE_RATIOS = [];
for (let i = 1; i < DECADE_EPS.length; i++) {
  DECADE_RATIOS.push({
    eps: DECADE_EPS[i],
    ratio: contShort(0, 2, DECADE_EPS[i]) / contShort(0, 2, DECADE_EPS[i - 1]),
  });
}

// -- imp-95090 baked cross-check ------------------------------------------------
const SIB90 = IMP95090_FINITE_RATE_ATTAINMENT_SHORTFALL;
const SIB90_ENV02 = SIB90.envelopes.env02; // 3.9197920255561178e-5
const SIB90_LADDER = SIB90.continuousLimitLadder.ladder; // {eps, shortfall}

// -- verdict object -------------------------------------------------------------
export const IMP95121_CORNER_SHORTFALL_RATE_CONSTANT = {
  ticket:
    "imp-95121 (proof): derive the imp-95090 linear attainment-shortfall rate constant in closed form from the first-order corner expansion of I(T, rho), certifying the linear law and its slope; check against the measured ladder. Derivation step; NO QED; no bound change.",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; consumes the nineteenth-continuation Lemma PF / Lemma CC / Lemma RM (imp-95008-exact-pair-correlation-ceiling.js) and the imp-95090 measured ladder; extends Lemma PF to mixed exponents (s+1, s) for the T-derivative.",
  parameters: { v: 1, c: 1, beta: "1/3", D: 1, sigma: SIGMA, theta: THETA, s: SS },
  theorem: {
    name: "KAPPA-LIN",
    statement:
      "along the corner sequence d1 = 2^-(b+1)(1+eps), d2 = 2^-(b+j), the shortfall obeys shortfall(eps) = kappa(b,j) eps + O(eps^2) with kappa(b,j) = (-dIdT Tprime(0) + beta rho0 dIdRho)/I at the corner (V(b,j), rhoCap(j)); Tprime(0) = 2^((b+1)-(b+j)beta); both channels nonnegative by Lemma CC and Lemma RM.",
    closedFormPieces:
      "dIdT = -s rho^(s-1/2) (Mid(rho,1+T;s+1,s;T) + A(rho+T,1;s+1,s) - A(rho,1+T;s+1,s)); dIdRho = rho^(-3/2) ((s-1/2) J(s,s) - s J(s+1,s)); A and Mid by mixed-exponent partial fractions (Lemma PF-M), rational plus logarithm.",
  },
  dominantCell02: {
    T0: CELL02.T0,
    rho0: CELL02.R0,
    TprimeEqualsT0: "exact for j = 2 cells (2^(j-1) - 1 = 1)",
    dIdT: CELL02.IT,
    dIdRho: CELL02.IR,
    kappaT: CELL02.kappaT,
    kappaRho: CELL02.kappaR,
    kappa: CELL02.kappa,
    channelSplit:
      "separation (T) channel 89.85 pct, width-ratio (rho) channel 10.15 pct: the shortfall rate is dominated 8.85:1 by separation drift, not width-ratio drift.",
  },
  genericCellCheck: {
    cell: "(2,2)",
    kappa: CELL22.kappa,
    slopeRichardson: SLOPE22,
    note: "clean cell (no far-piece cancellation at this scale): closed form matches the independent eps-slope to 5.8e-7 relative.",
  },
  crossChecks: {
    fdIT02: FD_IT_02,
    fdIR02: FD_IR_02,
    slopeRichardson02: SLOPE02,
    ladderDeviations: DEV_LADDER,
    decadeRatios: DECADE_RATIOS,
    unfoldedFoldedRelGap: Math.abs((Math.pow(CELL02.R0, -0.5) * Jmn(SS, SS, CELL02.T0, CELL02.R0)) / CELL02.I0 - 1),
  },
  corollaryPerDecade:
    "shortfall(eps/10)/shortfall(eps) = 1/10 + O(eps): the imp-95090 measured decade ratios (0.1450, 0.1044, 0.1004) approach the exact 1/10 of the derived linear law; the per-decade ~0.10 of imp-95090 Finding (3) is a corollary, not an independent datum.",
  openResiduals: [
    "the kappa literal is a float evaluation of the closed form: the far A-piece of the (s+1,s) family carries ~1e-6 relative cancellation (certified here only to ~1.2e-4 against the independent Richardson slope at the dominant cell); an interval or rational-arithmetic evaluation would pin it tighter",
    "the second-order coefficient (the O(eps^2) term, measured deviation slope ~4.8 kappa per unit eps) is not derived in closed form",
    "the shortfall remains a fixed-97-lane attainment quantity: the applied grid lever is imp-95114, and the witness/aggregation residuals of the imp-95008 chain are untouched",
  ],
  isRigorous: true,
  rigorScope:
    "The derivation (Lemma PF-M mixed-exponent partial fractions; Lemma DT and Lemma DR closed-form partial derivatives via differentiation under the integral, justified by dominated convergence; Theorem KAPPA-LIN first-order Taylor law with one-sided remainder; per-decade corollary) is rigorous elementary analysis, conditional on nothing beyond the sibling-chain conventions. The numeric kappa is float: cross-checked against Richardson finite differences of the independent folded evaluator (dIdT to 7.6e-6, dIdRho to 1.4e-5 relative) and against the Richardson eps-slope (1.2e-4 relative at (0,2), 5.8e-7 at (2,2)); the imp-95090 baked ladder deviates from kappa eps by the predicted O(eps) pattern (0.0463, 0.0048, 0.00054 per decade). Changes no bound.",
  promotesBound: false,
  verdict:
    "RIGOROUS derivation step (closed form replaces measurement): the imp-95090 linear attainment-shortfall law is DERIVED, shortfall(eps) = kappa(b,j) eps + O(eps^2), with kappa(b,j) = (-dIdT Tprime(0) + beta rho0 dIdRho)/I in elementary closed form (mixed-exponent partial fractions extending the nineteenth-continuation Lemma PF). At the dominant cell (0,2): kappa = 7.1950399616423155, split 89.85 pct separation channel + 10.15 pct width-ratio channel, both provably nonnegative (Lemma CC, Lemma RM). The measured per-decade ~0.10 of imp-95090 Finding (3) is a corollary (exact 1/10 + O(eps)). Generic-cell check kappa(2,2) = 9.203827084271076 matches its independent eps-slope to 5.8e-7. The float evaluation carries a ~1.2e-4 certification width at (0,2) (far-piece cancellation, named residual). Changes no bound; does NOT promote Lambda<=0.14; NO QED; no refereed bound is changed.",
};

// -- assertions (self-executing; throw on violation) ----------------------------
export const IMP95121_CSRC_ASSERTIONS = [
  {
    id: "imp95121-csrc-corner-reproduction",
    description:
      "independent folded evaluator reproduces the sibling corner literal envE(0,2) = 3.9197920255561178e-5 (rel 1e-12) and the imp-95090 module field; the unfolded J(s,s) form agrees to rel 1e-7 (measured conditioning gap 2.26e-8)",
    holds: () =>
      Math.abs(CELL02.I0 - 3.9197920255561178e-5) <= 1e-12 * 3.9197920255561178e-5 &&
      Math.abs(CELL02.I0 - SIB90_ENV02) <= 1e-12 * SIB90_ENV02 &&
      IMP95121_CORNER_SHORTFALL_RATE_CONSTANT.crossChecks.unfoldedFoldedRelGap <= 1e-7,
  },
  {
    id: "imp95121-csrc-derivative-closed-forms",
    description:
      "the Lemma DT / Lemma DR closed-form partial derivatives match Richardson finite differences of the independent folded evaluator at the corner (rel 1e-4), with the Lemma CC / Lemma RM signs dIdT < 0 < dIdRho",
    holds: () =>
      CELL02.IT < 0 &&
      CELL02.IR > 0 &&
      Math.abs(CELL02.IT / FD_IT_02 - 1) <= 1e-4 &&
      Math.abs(CELL02.IR / FD_IR_02 - 1) <= 1e-4,
  },
  {
    id: "imp95121-csrc-kappa-value",
    description:
      "kappa(0,2) reproduces the baked literal 7.1950399616423155 (rel 1e-10), matches the independent Richardson eps-slope (rel 5e-4), and both channel contributions are positive with the separation channel dominant (share 0.8985 +- 1e-3)",
    holds: () =>
      Math.abs(CELL02.kappa - 7.1950399616423155) <= 1e-10 * 7.1950399616423155 &&
      Math.abs(CELL02.kappa / SLOPE02 - 1) <= 5e-4 &&
      CELL02.kappaT > 0 &&
      CELL02.kappaR > 0 &&
      Math.abs(CELL02.kappaT / CELL02.kappa - 0.8984745936599553) <= 1e-3,
  },
  {
    id: "imp95121-csrc-linear-law",
    description:
      "the deviation 1 - shortfall/(kappa eps) is positive and shrinks by a factor in [7, 13] per decade across eps = 1e-2, 1e-3, 1e-4 (the predicted O(eps) second-order pattern), ending <= 1e-3",
    holds: () => {
      for (const d of DEV_LADDER) if (!(d.deviation > 0)) return false;
      const r1 = DEV_LADDER[0].deviation / DEV_LADDER[1].deviation;
      const r2 = DEV_LADDER[1].deviation / DEV_LADDER[2].deviation;
      return r1 >= 7 && r1 <= 13 && r2 >= 7 && r2 <= 13 && DEV_LADDER[2].deviation <= 1e-3;
    },
  },
  {
    id: "imp95121-csrc-ladder-consistency",
    description:
      "the locally recomputed corner-sequence shortfall reproduces the imp-95090 baked ladder pointwise (rel 1e-9), so the derived kappa certifies THAT ladder, not a variant convention",
    holds: () =>
      SIB90_LADDER.every((row) => Math.abs(contShort(0, 2, row.eps) - row.shortfall) <= 1e-9 * Math.max(row.shortfall, 1e-12)),
  },
  {
    id: "imp95121-csrc-decade-corollary",
    description:
      "the decade ratios approach the exact 1/10 of the linear law: |ratio - 0.1| shrinks by a factor >= 5 per decade and is <= 5e-4 at eps = 1e-4 (deriving imp-95090 Finding (3) per-decade ~0.10)",
    holds: () => {
      const dist = DECADE_RATIOS.map((r) => Math.abs(r.ratio - 0.1));
      return dist[0] / dist[1] >= 5 && dist[1] / dist[2] >= 5 && dist[2] <= 5e-4;
    },
  },
  {
    id: "imp95121-csrc-generic-cell",
    description:
      "the generic-cell formula holds beyond the dominant cell: kappa(2,2) reproduces 9.203827084271076 (rel 1e-10) and matches its independent Richardson eps-slope to rel 1e-5, and Tprime(0) = T0 exactly for both j = 2 cells",
    holds: () =>
      Math.abs(CELL22.kappa - 9.203827084271076) <= 1e-10 * 9.203827084271076 &&
      Math.abs(CELL22.kappa / SLOPE22 - 1) <= 1e-5 &&
      Math.abs(CELL02.Tp / CELL02.T0 - 1) <= 1e-15 &&
      Math.abs(CELL22.Tp / CELL22.T0 - 1) <= 1e-15,
  },
  {
    id: "imp95121-csrc-honesty-gate",
    description:
      "verdict is a derivation step: promotes no bound, names the float-certification residual and the untouched witness residuals, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95121_CORNER_SHORTFALL_RATE_CONSTANT.promotesBound === false &&
      IMP95121_CORNER_SHORTFALL_RATE_CONSTANT.openResiduals.length === 3 &&
      /NO QED/.test(IMP95121_CORNER_SHORTFALL_RATE_CONSTANT.verdict) &&
      /refereed bound is changed/i.test(IMP95121_CORNER_SHORTFALL_RATE_CONSTANT.verdict) &&
      /Changes no bound/.test(IMP95121_CORNER_SHORTFALL_RATE_CONSTANT.verdict) &&
      /corollary/.test(IMP95121_CORNER_SHORTFALL_RATE_CONSTANT.verdict),
  },
];

for (const a of IMP95121_CSRC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95121-corner-shortfall-rate-constant assertion failed: ${a.id}`);
  }
}

export default IMP95121_CORNER_SHORTFALL_RATE_CONSTANT;
