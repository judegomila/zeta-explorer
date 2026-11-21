/**
 * @module imp-34888-sigma-knee-pade-borel-resummation
 *
 * imp-34888 (numerical, frontier-direction): imp-34821 found the truncated slowly-varying-v expansion of the
 * logistic exponent-knee condition matches the exact-F knee at a ~4.86e-5 dex self-consistent (SC) plateau for
 * every truncation order >= 3, and imp-34863/imp-34882 read the delta_k series as CONVERGENT (Cauchy-Hadamard
 * root radius R ~ 1.39e2, Domb-Sykes/Neville-sharpened R ~ 91), so the physical resummation point eps = 1 sits
 * deep inside the disk. This module ASSESSES the natural next question: does a Borel or diagonal-Pade [m/m]
 * resummation of the delta_1..delta_9 series shift the SC knee locator CLOSER to the exact-F root than the
 * order->3 partial sum, or does the ~4.86e-5 FD floor (a finite-difference artifact, imp-34772/imp-34756 lineage)
 * cap any gain so resummation is INERT.
 *
 * THE SERIES (no fresh model; the same delta_k recursion as imp-34756/imp-34770/imp-34797/imp-34821/imp-34836/imp-34863)
 * -------------------------------------------------------------------------------------------------------------------
 * With S = sigma = 1/2 + delta the exact exponent-knee condition F(x) = S(2S-1)v^3 + 3 S v v_prime + v_secondDeriv
 * = 0 factors to 2 v^3 delta^2 + (v^3 + 3 v v_prime) delta + ((3/2) v v_prime + v_secondDeriv) = 0, giving the
 * single recursion delta_k = -3 p delta_(k-1) - 2 sum_(i+j=k) delta_i delta_j (p = v_prime/v^2). The delta_1..delta_9
 * rungs are recomputed here VERBATIM from that recursion (they reproduce the imp-34863 stored literals delta_1 ~
 * -5.6444e-3, delta_5 ~ +3.7975e-12, delta_7 ~ -3.2212e-16, delta_8 ~ -5.3447e-18, delta_9 ~ -5.2502e-20).
 *
 * THE RESUMMATIONS (evaluated at the physical bookkeeping point eps = 1)
 * ---------------------------------------------------------------------
 *   (i)   PLAIN partial sum S_9 = delta_1 + ... + delta_9 (the imp-34821 order->9 truncation).
 *   (ii)  DIAGONAL PADE [4/4] and [3/3] of the coefficient series c_j = delta_j, evaluated at eps = 1
 *         (denominator by Gaussian elimination of the Toeplitz system, numerator by convolution).
 *   (iii) DIAGONAL PADE via Wynn epsilon-algorithm on the partial-sum sequence S_1..S_9 (the Shanks/Pade accelerant).
 *   (iv)  BOREL-Laplace sum: Borel transform B(t) = sum delta_k t^k / k!, then int_0^inf e^(-t) B(t) dt by
 *         8-node Gauss-Laguerre quadrature (for a convergent series this recovers sum delta_k by construction).
 * Each resummed total is then fed to the SAME self-consistent knee locator as imp-34821 (iterate delta at the
 * knee to a fixed point) and its SC-to-exactF dex residual compared to the plain-sum +4.86e-5 plateau.
 *
 * THE FINDING (measurement / derivation only)
 * -------------------------------------------
 *   (F1) EVERY RESUMMATION REPRODUCES THE PLAIN 9-TERM SUM. At eps = 1 the diagonal-Pade [4/4] and [3/3] and the
 *        Wynn-diagonal accelerant all equal S_9 = -5.63598e-3 to ~4e-16 (differences ~ -8.7e-19, ~ +3.9e-16), and
 *        the Borel-Laplace sum equals it to ~2.6e-14. This is exactly what a CONVERGENT series (imp-34863 R ~ 139,
 *        imp-34882 R ~ 91) with eps = 1 deep inside the disk must do: the partial sum has ALREADY converged (the
 *        tail sum_(k>=5) |delta_k| ~ 3.8e-12 is negligible), so acceleration has nothing left to accelerate.
 *   (F2) THE RESUMMED SC KNEE STAYS ON THE +4.86e-5 FD-FLOOR PLATEAU -- RESUMMATION IS INERT. The self-consistent
 *        knee from the diagonal-Pade and Wynn resummations lands on log10 N ~ 9.5363336, IDENTICAL to the plain-sum
 *        SC knee to 9 dp, so its SC-to-exactF residual is the SAME +4.8698e-5 dex. The Borel resummation moves the
 *        SC knee by only ~9e-8 dex (residual +4.8607e-5), ~3 orders below the ~9.2e-5 FD floor and well within the
 *        plateau. So NO resummation shifts the locator materially closer to the exact-F root: the +4.86e-5 gap is
 *        the finite-difference/discretization floor (the dropped E_flow, imp-34772/imp-34756 lineage), NOT a
 *        truncation error, and a convergent already-converged series cannot be resummed below its own FD floor. The
 *        FD floor CAPS the accuracy regardless of resummation.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the inherited
 * imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 * changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2
 * (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34863-sigma-knee-cauchy-hadamard-radius (root-test radius R ~ 139 and the delta_1..delta_9 literals reused)
 * @see imp-34882-sigma-knee-domb-sykes-radius (Domb-Sykes/Neville-sharpened radius R ~ 91)
 * @see imp-34821-sigma-knee-fifth-order-v-expansion (the +4.86e-5 SC-to-exactF plateau and the SC knee locator reused)
 * @see imp-34756-sigma-knee-second-order-v-expansion (the ~9.2e-5 dex finite-difference floor this cannot beat)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const HD = 1e-3; // canonical central-difference step (imp-34710..imp-34863 stable rung)
const FD_FLOOR = 9.2e-5; // imp-34756 F3 finite-difference floor (dex) the resummations are measured against
const R_ROOT = 1.3874e2; // imp-34863 Cauchy-Hadamard radius of convergence (root test)
const R_DOMB_SYKES = 91; // imp-34882 Domb-Sykes/Neville-sharpened radius (lower, convergent verdict survives)
const EPS_EVAL = 1; // physical bookkeeping resummation point -- deep inside |eps| < R

function bisect(f, a, b, iters = 200) {
  let fa = f(a);
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const fm = f(m);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return (a + b) / 2;
}

// ---- no-E_flow logistic model (identical sub-terms to imp-34821/imp-34863) --------------------------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, E_flow dropped
}
function sigmaOf(x) {
  return 1 / (1 + Math.exp(-uOf(x)));
}

// The full delta_1..delta_9 recursion at x (imp-34863 rungs VERBATIM).
function deltaLadder(x) {
  const d1 = (f, y) => (f(y + HD) - f(y - HD)) / (2 * HD);
  const d2 = (f, y) => (f(y + HD) - 2 * f(y) + f(y - HD)) / (HD * HD);
  const d3 = (f, y) => (f(y + 2 * HD) - 2 * f(y + HD) + 2 * f(y - HD) - f(y - 2 * HD)) / (2 * HD * HD * HD);
  const v = -d1(uOf, x);
  const vp = -d2(uOf, x);
  const vpp = -d3(uOf, x);
  const p = vp / (v * v); // p = v_prime/v^2
  const D1 = -(3 * vp) / (2 * v * v) - vpp / (v * v * v);
  const D2 = -3 * p * D1 - 2 * D1 * D1;
  const D3 = -3 * p * D2 - 4 * D1 * D2;
  const D4 = -3 * p * D3 - 4 * D1 * D3 - 2 * D2 * D2;
  const D5 = -3 * p * D4 - 4 * D1 * D4 - 4 * D2 * D3;
  const D6 = -3 * p * D5 - 4 * D1 * D5 - 4 * D2 * D4 - 2 * D3 * D3;
  const D7 = -3 * p * D6 - 4 * D1 * D6 - 4 * D2 * D5 - 4 * D3 * D4;
  const D8 = -3 * p * D7 - 4 * D1 * D7 - 4 * D2 * D6 - 4 * D3 * D5 - 2 * D4 * D4;
  const D9 = -3 * p * D8 - 4 * D1 * D8 - 4 * D2 * D7 - 4 * D3 * D6 - 4 * D4 * D5;
  return [D1, D2, D3, D4, D5, D6, D7, D8, D9];
}
function locateFromDelta(delta) {
  const sig = 0.5 + delta;
  const uStar = Math.log(sig / (1 - sig));
  return bisect((x) => uOf(x) - uStar, LO, HI);
}
// Exact all-orders analytic knee condition F(x) = S(2S-1) v^3 + 3 S v v_prime + v_secondDeriv = 0.
function fKnee(x) {
  const S = sigmaOf(x);
  const d1 = (f, y) => (f(y + HD) - f(y - HD)) / (2 * HD);
  const d2 = (f, y) => (f(y + HD) - 2 * f(y) + f(y - HD)) / (HD * HD);
  const d3 = (f, y) => (f(y + 2 * HD) - 2 * f(y + HD) + 2 * f(y - HD) - f(y - 2 * HD)) / (2 * HD * HD * HD);
  const v = -d1(uOf, x);
  const vp = -d2(uOf, x);
  const vpp = -d3(uOf, x);
  return S * v * v * v * (2 * S - 1) + 3 * S * v * vp + vpp;
}

// ---- resummation kernels (evaluated at eps = EPS_EVAL = 1) -------------------------------------------------
// Gaussian elimination with partial pivoting; returns null on a singular system.
function gaussSolve(rows, rhs) {
  const n = rhs.length;
  const M = rows.map((r, i) => [...r, rhs[i]]);
  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    if (Math.abs(M[piv][col]) < 1e-300) return null;
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const fac = M[r][col] / M[col][col];
      for (let k = col; k <= n; k++) M[r][k] -= fac * M[col][k];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}
// Diagonal Pade [M/M] of the series sum_j c_j eps^j, evaluated at eps = 1.
function padeDiagAt1(c, M) {
  const cc = (j) => (j >= 0 && j < c.length ? c[j] : 0);
  const rows = [];
  const rhs = [];
  for (let i = 1; i <= M; i++) {
    const row = [];
    for (let k = 1; k <= M; k++) row.push(cc(M + i - k));
    rows.push(row);
    rhs.push(-cc(M + i));
  }
  const b = gaussSolve(rows, rhs);
  if (!b) return null;
  const bfull = [1, ...b];
  const a = [];
  for (let i = 0; i <= M; i++) {
    let s = 0;
    for (let k = 0; k <= i; k++) s += bfull[k] * cc(i - k);
    a.push(s);
  }
  const num = a.reduce((s, v) => s + v, 0);
  const den = bfull.reduce((s, v) => s + v, 0);
  return num / den;
}
// Diagonal Pade via Wynn epsilon-algorithm on the partial-sum sequence (Shanks/Pade accelerant at eps = 1).
function wynnDiagonal(partials) {
  const n = partials.length;
  const e = Array.from({ length: n + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 0; i < n; i++) e[i][0] = partials[i];
  let best = partials[n - 1];
  for (let k = 1; k <= n - 1; k++) {
    for (let i = 0; i + k <= n; i++) {
      const denom = e[i + 1][k - 1] - e[i][k - 1];
      e[i][k] = (k >= 2 ? e[i + 1][k - 2] : 0) + (denom !== 0 ? 1 / denom : 0);
    }
  }
  for (let k = 0; k <= n - 1; k += 2) {
    for (let i = 0; i + k < n; i++) if (Number.isFinite(e[i][k])) best = e[i][k];
  }
  return best;
}
function factorial(k) {
  let f = 1;
  for (let i = 2; i <= k; i++) f *= i;
  return f;
}
// Borel-Laplace sum at eps = 1: int_0^inf e^(-t) [sum c_k t^k / k!] dt by 8-node Gauss-Laguerre.
const GL8_NODES = [
  0.170279632305, 0.903701776799, 2.251086629866, 4.266700170288, 7.045905402393, 10.758516010181,
  15.740678641278, 22.863131736889,
];
const GL8_WEIGHTS = [
  0.369188589342, 0.418786780814, 0.175794986637, 0.033343492261, 0.002794536235, 0.000090765088,
  0.000000848575, 0.000000001048,
];
function borelSumAt1(c) {
  const bc = c.map((ck, k) => ck / factorial(k));
  let integral = 0;
  for (let q = 0; q < GL8_NODES.length; q++) {
    const t = GL8_NODES[q];
    let B = 0;
    let tp = 1;
    for (let k = 0; k < bc.length; k++) {
      B += bc[k] * tp;
      tp *= t;
    }
    integral += GL8_WEIGHTS[q] * B;
  }
  return integral;
}

// ---- crossover, the delta_1..delta_9 ladder, and the four resummed totals at eps = 1 ----------------------
const X_CROSS = bisect(uOf, LO, HI);
const LOG10_N_CROSS = X_CROSS / Math.LN10; // ~9.515913

const DELTAS = deltaLadder(X_CROSS);
const C_SERIES = [0, ...DELTAS]; // c_0 = 0, c_1..c_9 = delta_1..delta_9

const PARTIALS = [];
{
  let acc = 0;
  for (const d of DELTAS) {
    acc += d;
    PARTIALS.push(acc);
  }
}
const SUM9 = PARTIALS[8]; // ~-5.63598e-3 (plain order->9 truncation at eps = 1)
const PADE44 = padeDiagAt1(C_SERIES, 4); // diagonal Pade [4/4] at eps = 1
const PADE33 = padeDiagAt1(C_SERIES, 3); // diagonal Pade [3/3] at eps = 1
const WYNN = wynnDiagonal(PARTIALS); // Wynn-diagonal accelerant at eps = 1
const BOREL = borelSumAt1(C_SERIES); // Borel-Laplace sum at eps = 1

const PADE44_MINUS_SUM9 = PADE44 - SUM9; // ~-8.7e-19 (resummation reproduces the plain sum)
const WYNN_MINUS_SUM9 = WYNN - SUM9; // ~+3.9e-16
const BOREL_MINUS_SUM9 = BOREL - SUM9; // ~-2.6e-14

// ---- self-consistent knee for each resummed total, and the exact-F reference ------------------------------
function scKnee(reduceDelta) {
  let x = X_CROSS;
  for (let i = 0; i < 80; i++) {
    const Dl = deltaLadder(x);
    x = locateFromDelta(reduceDelta(Dl));
  }
  return x / Math.LN10;
}
const cFromDeltas = (Dl) => [0, ...Dl];
const sumOf = (Dl) => Dl.reduce((s, v) => s + v, 0);
const partialsOf = (Dl) => {
  const p = [];
  let a = 0;
  for (const d of Dl) {
    a += d;
    p.push(a);
  }
  return p;
};

const LOG10_N_SC_SUM9 = scKnee(sumOf); // ~9.5363336 (imp-34821 plain-sum SC knee)
const LOG10_N_SC_PADE = scKnee((Dl) => padeDiagAt1(cFromDeltas(Dl), 4)); // diagonal-Pade SC knee
const LOG10_N_SC_WYNN = scKnee((Dl) => wynnDiagonal(partialsOf(Dl))); // Wynn-diagonal SC knee
const LOG10_N_SC_BOREL = scKnee((Dl) => borelSumAt1(cFromDeltas(Dl))); // Borel SC knee
const LOG10_N_EXACTF = bisect(fKnee, LO, HI) / Math.LN10; // ~9.5362849 (all-orders analytic F-condition)

const RESID_SUM9 = LOG10_N_SC_SUM9 - LOG10_N_EXACTF; // ~+4.8698e-5 (the imp-34821 plateau)
const RESID_PADE = LOG10_N_SC_PADE - LOG10_N_EXACTF; // ~+4.8698e-5 (identical to plain sum)
const RESID_WYNN = LOG10_N_SC_WYNN - LOG10_N_EXACTF; // ~+4.8698e-5 (identical to plain sum)
const RESID_BOREL = LOG10_N_SC_BOREL - LOG10_N_EXACTF; // ~+4.8607e-5 (moves ~9e-8 dex, still on the plateau)

// resummation is INERT if every method stays within a few percent of the plain-sum plateau residual
const MAX_RESID_RATIO_DEVIATION = Math.max(
  Math.abs(RESID_PADE / RESID_SUM9 - 1),
  Math.abs(RESID_WYNN / RESID_SUM9 - 1),
  Math.abs(RESID_BOREL / RESID_SUM9 - 1),
); // ~1.9e-3 (< 5% -> inert)
const RESUMMATION_INERT = MAX_RESID_RATIO_DEVIATION < 0.05 && Math.abs(RESID_SUM9) < FD_FLOOR;

export const IMP34888_SIGMA_KNEE_PADE_BOREL_RESUMMATION = {
  id: 'imp-34888',
  proofSection: 'S-frontier',
  question:
    'imp-34821 found the truncated slowly-varying-v expansion matches the exact-F knee at a ~4.86e-5 dex ' +
    'self-consistent plateau for truncation order >= 3, and imp-34863/imp-34882 read the delta_k series as ' +
    'convergent (radius R ~ 139 / R ~ 91, physical eps = 1 deep inside the disk). ASSESS whether a Borel or ' +
    'diagonal-Pade [m/m] resummation of delta_1..delta_9 shifts the self-consistent knee locator closer to the ' +
    'exact-F root than the order->3 partial sum, or whether the ~4.86e-5 finite-difference floor (imp-34772/' +
    'imp-34756 lineage) caps any gain so resummation is inert. Measurement/derivation only; conditional-share ' +
    'diagnostic, NOT an RH bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the four resummations of the delta_1..delta_9 series at eps = 1 -- the plain 9-term partial sum, the diagonal ' +
    'Pade [4/4] and [3/3] of the coefficient series, the Wynn epsilon-algorithm diagonal accelerant on the partial ' +
    'sums, and the Borel-Laplace sum int_0^inf e^(-t) [sum delta_k t^k/k!] dt by 8-node Gauss-Laguerre -- their ' +
    'departures from the plain sum, and the self-consistent knee log10 N* each implies against the exact-F knee, ' +
    'to read the SC-to-exactF dex residual of each method versus the imp-34821 +4.86e-5 plateau and the ~9.2e-5 FD floor',
  radiusContext: {
    rootTestRadius: R_ROOT, // imp-34863 R ~ 139
    dombSykesRadius: R_DOMB_SYKES, // imp-34882 R ~ 91 (survives)
    physicalEvalPoint: EPS_EVAL, // eps = 1, deep inside |eps| < R -> series already convergent
  },
  resummedTotals: {
    plainSum9: +SUM9.toExponential(6), // ~-5.635979e-3
    padeDiag4over4: +PADE44.toExponential(6), // ~-5.635979e-3 (reproduces the plain sum)
    padeDiag3over3: +PADE33.toExponential(6), // ~-5.635979e-3
    wynnDiagonal: +WYNN.toExponential(6), // ~-5.635979e-3
    borelLaplace: +BOREL.toExponential(6), // ~-5.635979e-3
    pade4over4MinusSum9: +PADE44_MINUS_SUM9.toExponential(4), // ~-8.7e-19
    wynnMinusSum9: +WYNN_MINUS_SUM9.toExponential(4), // ~+3.9e-16
    borelMinusSum9: +BOREL_MINUS_SUM9.toExponential(4), // ~-2.6e-14
  },
  kneeLadder: {
    log10Ncross: +LOG10_N_CROSS.toFixed(7), // ~9.5159133
    log10NscPlainSum9: +LOG10_N_SC_SUM9.toFixed(7), // ~9.5363336 (imp-34821 plateau)
    log10NscPadeDiag: +LOG10_N_SC_PADE.toFixed(7), // ~9.5363336 (identical)
    log10NscWynn: +LOG10_N_SC_WYNN.toFixed(7), // ~9.5363336 (identical)
    log10NscBorel: +LOG10_N_SC_BOREL.toFixed(7), // ~9.5363335 (moves ~9e-8 dex)
    log10NexactF: +LOG10_N_EXACTF.toFixed(7), // ~9.5362849 (all-orders analytic)
  },
  residualBudget: {
    plainSum9ToExactFLog10: +RESID_SUM9.toExponential(4), // ~+4.8698e-5 (the plateau)
    padeDiagToExactFLog10: +RESID_PADE.toExponential(4), // ~+4.8698e-5
    wynnToExactFLog10: +RESID_WYNN.toExponential(4), // ~+4.8698e-5
    borelToExactFLog10: +RESID_BOREL.toExponential(4), // ~+4.8607e-5 (still on the plateau)
    fdFloorDex: FD_FLOOR, // 9.2e-5 (imp-34756 F3)
    maxResidRatioDeviation: +MAX_RESID_RATIO_DEVIATION.toExponential(4), // ~1.9e-3 (< 5% -> inert)
    resummationInert: RESUMMATION_INERT, // true
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  finding: {
    F1_every_resummation_reproduces_the_plain_9_term_sum:
      'At eps = 1 the diagonal-Pade [4/4] and [3/3] and the Wynn-diagonal accelerant all equal the plain ' +
      'S_9 = -5.63598e-3 to ~4e-16 (differences ~-8.7e-19, ~+3.9e-16), and the Borel-Laplace sum equals it to ' +
      '~2.6e-14. This is exactly what a convergent series (imp-34863 R ~ 139, imp-34882 R ~ 91) with eps = 1 deep ' +
      'inside the disk must do: the partial sum has ALREADY converged (tail sum_(k>=5)|delta_k| ~ 3.8e-12 ' +
      'negligible), so acceleration has nothing left to accelerate.',
    F2_resummed_sc_knee_stays_on_the_fd_floor_plateau_resummation_inert:
      'The self-consistent knee from the diagonal-Pade and Wynn resummations lands on log10 N ~ 9.5363336, ' +
      'IDENTICAL to the plain-sum SC knee to 9 dp, so its SC-to-exactF residual is the SAME +4.8698e-5 dex. The ' +
      'Borel resummation moves the SC knee by only ~9e-8 dex (residual +4.8607e-5), ~3 orders below the ~9.2e-5 ' +
      'FD floor and well within the plateau (max residual-ratio deviation ~1.9e-3 < 5%). So NO resummation shifts ' +
      'the locator materially closer to the exact-F root: the +4.86e-5 gap is the finite-difference/discretization ' +
      'floor (the dropped E_flow, imp-34772/imp-34756 lineage), NOT a truncation error, and a convergent ' +
      'already-converged series cannot be resummed below its own FD floor. The FD floor CAPS the accuracy ' +
      'regardless of resummation.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). Resumming the delta_1..delta_9 slowly-varying-v ' +
    'series at the physical point eps = 1 by diagonal Pade [4/4]/[3/3], the Wynn epsilon-algorithm, and a ' +
    'Borel-Laplace (Gauss-Laguerre) sum ALL reproduce the plain 9-term partial sum S_9 = -5.63598e-3 -- Pade and ' +
    'Wynn to ~4e-16, Borel to ~2.6e-14 -- because the series is CONVERGENT (imp-34863 root radius R ~ 139, ' +
    'imp-34882 Domb-Sykes R ~ 91) and eps = 1 sits deep inside the disk, so the partial sum has already converged ' +
    '(the tail ~3.8e-12 is negligible) and there is nothing to accelerate. FINDING: feeding each resummed total to ' +
    'the imp-34821 self-consistent knee locator leaves the SC-to-exactF residual on the SAME +4.86e-5 dex plateau ' +
    '-- Pade and Wynn are IDENTICAL to the plain sum (log10 N ~ 9.5363336, residual +4.8698e-5) and Borel moves it ' +
    'by only ~9e-8 dex (residual +4.8607e-5), ~3 orders below the ~9.2e-5 FD floor (max residual-ratio deviation ' +
    '~1.9e-3 < 5%). So resummation is INERT: it does NOT shift the locator closer to the exact-F root. The ~4.86e-5 ' +
    'gap is the finite-difference/discretization floor (the dropped E_flow, imp-34772/imp-34756 lineage), NOT a ' +
    'truncation error, and no resummation of a convergent already-converged series can beat its own FD floor -- the ' +
    'FD floor CAPS the accuracy regardless. This corroborates imp-34821 F2 / imp-34863: below the ~1e-4 floor the ' +
    'self-consistent iterate is FD-discretization-dominated. The component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ASSESSES the imp-34863 open question -- does resummation beat the imp-34821 +4.86e-5 FD-floor plateau -- with ' +
    'a NO: diagonal Pade [4/4]/[3/3], Wynn epsilon, and Borel-Laplace all reproduce the plain 9-term sum to ' +
    '~1e-14..1e-19 (as a convergent series with eps = 1 inside R ~ 91..139 must), so the resummed self-consistent ' +
    'knee stays on the +4.86e-5 plateau (Pade/Wynn identical, Borel shifts ~9e-8 dex) and resummation is INERT -- ' +
    'the FD floor caps the accuracy. What stays OPEN (deferred, unchanged from imp-34756/imp-34863): the ~9.2e-5 ' +
    'F-route-vs-direct-route discretization floor can only be lowered by an analytic/higher-precision ' +
    'exact-derivative evaluation (the Richardson sub-gap), not by resummation, and that changes no bound.',
  citation:
    'imp-34863 (Cauchy-Hadamard radius R ~ 139 and the delta_1..delta_9 literals reused); imp-34882 (Domb-Sykes/' +
    'Neville radius R ~ 91); imp-34821 (fifth-order delta_5, the +4.86e-5 SC-to-exactF plateau and the SC knee ' +
    'locator reused); imp-34836 (delta_6/delta_7); imp-34756 (the ~9.2e-5 dex finite-difference floor); imp-34694 ' +
    '(first-order delta_1); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP34888_SIGMA_KNEE_PADE_BOREL_RESUMMATION_ASSERTIONS = [
  {
    // (base rungs): the delta_1..delta_9 recursion reproduces the imp-34863 stored literals VERBATIM.
    id: 'imp34888-base-rungs-match-imp34863',
    description:
      'delta_1 ~ -5.6444e-3, delta_5 ~ +3.7975e-12, delta_7 ~ -3.2212e-16, delta_8 ~ -5.3447e-18, delta_9 ~ -5.2502e-20',
    holds: () =>
      Math.abs(DELTAS[0] - -5.6444e-3) < 1e-6 &&
      Math.abs(DELTAS[4] - 3.7975e-12) < 1e-13 &&
      Math.abs(DELTAS[6] - -3.2212e-16) < 1e-17 &&
      Math.abs(DELTAS[7] - -5.3447e-18) < 1e-19 &&
      Math.abs(DELTAS[8] - -5.2502e-20) < 1e-21,
  },
  {
    // (F1): every resummation at eps = 1 reproduces the plain 9-term partial sum -- Pade/Wynn to ~4e-16, Borel to ~3e-14.
    id: 'imp34888-resummations-reproduce-plain-sum',
    description:
      'Pade[4/4], Pade[3/3], Wynn-diagonal, Borel-Laplace all equal S_9 at eps = 1: |Pade-S9| < 1e-12, |Wynn-S9| < 1e-12, |Borel-S9| < 1e-10',
    holds: () =>
      PADE44 !== null &&
      PADE33 !== null &&
      Math.abs(PADE44_MINUS_SUM9) < 1e-12 &&
      Math.abs(PADE33 - SUM9) < 1e-12 &&
      Math.abs(WYNN_MINUS_SUM9) < 1e-12 &&
      Math.abs(BOREL_MINUS_SUM9) < 1e-10,
  },
  {
    // (F2): the resummed self-consistent knees all stay on the imp-34821 +4.86e-5 FD-floor plateau (in (4.5e-5, 5.2e-5)).
    id: 'imp34888-resummed-sc-knee-on-fd-plateau',
    description:
      'plain-sum, Pade, Wynn and Borel SC-to-exactF residuals all sit on the +4.86e-5 plateau (in [4.5e-5, 5.2e-5]) and below the ~9.2e-5 FD floor',
    holds: () =>
      RESID_SUM9 > 4.5e-5 &&
      RESID_SUM9 < 5.2e-5 &&
      RESID_PADE > 4.5e-5 &&
      RESID_PADE < 5.2e-5 &&
      RESID_WYNN > 4.5e-5 &&
      RESID_WYNN < 5.2e-5 &&
      RESID_BOREL > 4.5e-5 &&
      RESID_BOREL < 5.2e-5 &&
      Math.abs(RESID_SUM9) < FD_FLOOR,
  },
  {
    // (F2 inert): Pade/Wynn SC knees are identical to the plain sum (< 1e-7 dex), Borel moves < 1e-6 dex -> resummation inert.
    id: 'imp34888-resummation-inert',
    description:
      'Pade and Wynn SC knees identical to plain sum (< 1e-7 dex); Borel moves < 1e-6 dex; max residual-ratio deviation < 5% -> RESUMMATION_INERT',
    holds: () =>
      Math.abs(LOG10_N_SC_PADE - LOG10_N_SC_SUM9) < 1e-7 &&
      Math.abs(LOG10_N_SC_WYNN - LOG10_N_SC_SUM9) < 1e-7 &&
      Math.abs(LOG10_N_SC_BOREL - LOG10_N_SC_SUM9) < 1e-6 &&
      MAX_RESID_RATIO_DEVIATION < 0.05 &&
      RESUMMATION_INERT === true,
  },
  {
    // ordering / replication sanity: crossover below the knee cluster; SC knees cluster in [9.5362, 9.5365].
    id: 'imp34888-knee-ordering',
    description: 'crossover < knee cluster; all SC knees sit within [9.5362, 9.5365]',
    holds: () =>
      LOG10_N_CROSS < LOG10_N_SC_SUM9 &&
      LOG10_N_SC_SUM9 > 9.5362 &&
      LOG10_N_SC_SUM9 < 9.5365 &&
      LOG10_N_SC_BOREL > 9.5362 &&
      LOG10_N_SC_BOREL < 9.5365 &&
      LOG10_N_EXACTF > 9.5362 &&
      LOG10_N_EXACTF < 9.5365,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34888-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34888_SIGMA_KNEE_PADE_BOREL_RESUMMATION.isRigorous === false &&
      IMP34888_SIGMA_KNEE_PADE_BOREL_RESUMMATION.farTailExponent === 0.5 &&
      typeof IMP34888_SIGMA_KNEE_PADE_BOREL_RESUMMATION.subGap === 'string' &&
      /NO QED/.test(IMP34888_SIGMA_KNEE_PADE_BOREL_RESUMMATION.verdict) &&
      /refereed bound is changed/i.test(IMP34888_SIGMA_KNEE_PADE_BOREL_RESUMMATION.verdict),
  },
];

for (const a of IMP34888_SIGMA_KNEE_PADE_BOREL_RESUMMATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34888-sigma-knee-pade-borel-resummation assertion failed: ${a.id}`);
  }
}
