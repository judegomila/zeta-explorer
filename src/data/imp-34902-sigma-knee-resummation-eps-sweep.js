/**
 * @module imp-34902-sigma-knee-resummation-eps-sweep
 *
 * imp-34902 (numerical, frontier-direction): imp-34888 found the four resummations of the delta_1..delta_9
 * slowly-varying-v knee series -- the plain 9-term partial sum, diagonal Pade [4/4]/[3/3], the Wynn epsilon
 * accelerant and a Borel-Laplace (Gauss-Laguerre) sum -- ALL reproduce the plain sum at the single physical
 * bookkeeping point eps = 1 (max SC-to-exactF residual-ratio deviation among the methods ~1.9e-3 < 5%), so it
 * called the resummation INERT there. But imp-34888 tabulated that verdict only AT eps = 1, deep inside the
 * imp-34863/imp-34882 convergence disk (root radius R ~ 139, Domb-Sykes/Neville R ~ 91). This module SWEEPS the
 * bookkeeping eval point eps across (0, R] and re-measures, at each eps, the SC-to-exactF dex residual of every
 * method and the max cross-method residual-ratio deviation, to read whether the inertness is a property of
 * eps = 1 ONLY or of the WHOLE convergent neighbourhood -- and the eps (if any) at which a method departs.
 *
 * THE SERIES / KERNELS (no fresh model; identical delta_k recursion and resummation kernels to imp-34888)
 * ------------------------------------------------------------------------------------------------------
 * The same delta_1..delta_9 recursion (imp-34756/imp-34821/imp-34863) and the same diagonal-Pade / Wynn /
 * Borel kernels as imp-34888 are reused VERBATIM, but generalized from the fixed eps = 1 to an arbitrary
 * bookkeeping point eps: each method now evaluates the coefficient series sum_k delta_k eps^k at the swept eps
 * (Pade evaluates its [M/M] rational at x = eps, Wynn accelerates the partial sums of delta_k eps^k, and
 * Borel takes int_0^inf e^(-t) B(eps t) dt with B(x) = sum delta_k x^k/k!). Each resummed total is fed to the
 * SAME imp-34821 self-consistent knee locator (guarded so an unphysical |delta| >= 1/2 returns NaN) and its
 * SC-to-exactF dex residual is compared across methods.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) INERTNESS (cross-method agreement) PERSISTS BAND-WIDE. The max cross-method SC-to-exactF residual-ratio
 *        deviation stays BELOW the imp-34888 5% inertness threshold across the ENTIRE swept (0, R]: it is ~1.6e-4
 *        at eps = 0.1, ~1.9e-3 at the physical eps = 1 (reproducing imp-34888), and rises only to ~3.4e-2 at
 *        eps = 91 -- so NO method departs the < 5% band anywhere in the convergent neighbourhood. The identity of
 *        the marginally-largest-deviation method rotates with eps (Borel at small eps, Pade near R); none is a
 *        persistent departer. Inertness is a property of the whole disk, not of eps = 1 alone.
 *   (F2) BUT THE +4.86e-5 PLATEAU IS A PROPERTY OF eps = 1 ONLY (the near-zero crossing). The ABSOLUTE SC-to-exactF
 *        residual is NOT flat off eps = 1: it drifts MONOTONICALLY from ~-1.83e-2 dex at eps = 0.1, through the
 *        near-zero physical crossing +4.87e-5 at eps = 1, up to ~+1.35 dex at eps = 91. The +4.86e-5 "plateau" of
 *        imp-34821/imp-34888 is thus the value of the residual AT the physical bookkeeping point, not a flat shelf.
 *   (F3) THE RAW RESUMMED-TOTAL AGREEMENT DEGRADES NEAR R (masked by the SC map). The max cross-method relative
 *        deviation of the raw resummed TOTALS (before the SC locator) is ~5e-12 for eps <= 1, but grows
 *        monotonically to ~25% at eps = 91 (crossing ~5% near eps ~ 78) -- the 9-term partial sum loses track of
 *        the Pade/Borel resummations as eps approaches the radius, exactly as a convergent-but-slow series near
 *        its boundary must. The self-consistent knee map COMPRESSES these total splits, which is WHY the
 *        residual-ratio inertness metric (F1) never leaves the < 5% band even where the totals disagree by ~25%.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent
 * stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34888-sigma-knee-pade-borel-resummation (the eps = 1 four-method cross-tabulation this sweeps off-point)
 * @see imp-34863-sigma-knee-cauchy-hadamard-radius (root-test radius R ~ 139)
 * @see imp-34882-sigma-knee-domb-sykes-radius (Domb-Sykes/Neville radius R ~ 91)
 * @see imp-34821-sigma-knee-fifth-order-v-expansion (the +4.86e-5 SC-to-exactF plateau and the SC knee locator)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc = A sqrt(L/N)
const LO = Math.log(1e9);
const HI = Math.log(1e11);
const HD = 1e-3; // canonical central-difference step (imp-34710..imp-34863 stable rung)
const R_ROOT = 1.3874e2; // imp-34863 Cauchy-Hadamard radius (root test)
const R_DOMB_SYKES = 91; // imp-34882 Domb-Sykes/Neville-sharpened radius (the swept upper endpoint)
const INERT_THRESHOLD = 0.05; // imp-34888 < 5% cross-method deviation = inert

// bookkeeping eval points swept across (0, R_DOMB_SYKES]; eps = 1 is the physical point (imp-34888)
const EPS_GRID = [0.1, 0.5, 1, 2, 5, 10, 20, 40, 60, 80, 91];

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

// ---- no-E_flow logistic model (identical sub-terms to imp-34821/imp-34863/imp-34888) ----------------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, E_flow dropped
}
function sigmaOf(x) {
  return 1 / (1 + Math.exp(-uOf(x)));
}

// The full delta_1..delta_9 recursion at x (imp-34863/imp-34888 rungs VERBATIM).
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
// guarded knee locator: an unphysical resummed total |delta| >= 1/2 leaves sigma outside (0,1) -> NaN.
function locateFromDelta(delta) {
  if (!(delta > -0.499 && delta < 0.499)) return NaN;
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

// ---- resummation kernels generalized from imp-34888's fixed eps = 1 to an arbitrary eps -------------------
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
// Diagonal Pade [M/M] of the series sum_j c_j x^j, evaluated at x = eps.
function padeDiagAtEps(c, M, eps) {
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
  let num = 0;
  let den = 0;
  let ep = 1;
  for (let i = 0; i <= M; i++) {
    num += a[i] * ep;
    den += bfull[i] * ep;
    ep *= eps;
  }
  return num / den;
}
// Diagonal Pade via Wynn epsilon-algorithm on a partial-sum sequence.
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
// Borel-Laplace sum at eps: int_0^inf e^(-t) [sum c_k (eps t)^k / k!] dt by 8-node Gauss-Laguerre.
const GL8_NODES = [
  0.170279632305, 0.903701776799, 2.251086629866, 4.266700170288, 7.045905402393, 10.758516010181,
  15.740678641278, 22.863131736889,
];
const GL8_WEIGHTS = [
  0.369188589342, 0.418786780814, 0.175794986637, 0.033343492261, 0.002794536235, 0.000090765088,
  0.000000848575, 0.000000001048,
];
function borelSumAtEps(c, eps) {
  const bc = c.map((ck, k) => ck / factorial(k));
  let integral = 0;
  for (let q = 0; q < GL8_NODES.length; q++) {
    const t = eps * GL8_NODES[q];
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

// coefficient-series reducers at an arbitrary eps (c[0] = 0, c_1..c_9 = delta_1..delta_9)
const plainOf = (c, eps) => {
  let a = 0;
  let ep = eps;
  for (let k = 1; k < c.length; k++) {
    a += c[k] * ep;
    ep *= eps;
  }
  return a;
};
const partialsOf = (c, eps) => {
  const p = [];
  let a = 0;
  let ep = eps;
  for (let k = 1; k < c.length; k++) {
    a += c[k] * ep;
    p.push(a);
    ep *= eps;
  }
  return p;
};
const METHODS = {
  plain: (c, eps) => plainOf(c, eps),
  pade44: (c, eps) => padeDiagAtEps(c, 4, eps),
  pade33: (c, eps) => padeDiagAtEps(c, 3, eps),
  wynn: (c, eps) => wynnDiagonal(partialsOf(c, eps)),
  borel: (c, eps) => borelSumAtEps(c, eps),
};
const ACCEL = ['pade44', 'pade33', 'wynn', 'borel'];

const X_CROSS = bisect(uOf, LO, HI);
const LOG10_N_EXACTF = bisect(fKnee, LO, HI) / Math.LN10; // ~9.5362849 (all-orders analytic, eps-independent)

// self-consistent knee for a given resummation reducer at a given eps
function scKnee(reduce, eps) {
  let x = X_CROSS;
  for (let i = 0; i < 80; i++) {
    const c = [0, ...deltaLadder(x)];
    const nx = locateFromDelta(reduce(c, eps));
    if (!Number.isFinite(nx)) return NaN;
    x = nx;
  }
  return x / Math.LN10;
}

// ---- sweep eps across (0, R] --------------------------------------------------------------------------------
const SWEEP = EPS_GRID.map((eps) => {
  const c0 = [0, ...deltaLadder(X_CROSS)];
  const totals = {};
  for (const m of Object.keys(METHODS)) totals[m] = METHODS[m](c0, eps);
  const resid = {};
  for (const m of Object.keys(METHODS)) {
    const sc = scKnee(METHODS[m], eps);
    resid[m] = Number.isFinite(sc) ? sc - LOG10_N_EXACTF : NaN;
  }
  const rp = resid.plain;
  // cross-method SC-residual-ratio deviation (the imp-34888 inertness metric)
  let maxResidRatioDev = 0;
  let departMethod = 'none';
  for (const m of ACCEL) {
    if (Number.isFinite(resid[m]) && Number.isFinite(rp) && Math.abs(rp) > 1e-12) {
      const d = Math.abs(resid[m] / rp - 1);
      if (d > maxResidRatioDev) {
        maxResidRatioDev = d;
        departMethod = m;
      }
    }
  }
  // raw resummed-total agreement (before the SC map)
  let maxTotalRelDev = 0;
  for (const m of ACCEL) {
    if (totals[m] != null && Math.abs(totals.plain) > 1e-300) {
      maxTotalRelDev = Math.max(maxTotalRelDev, Math.abs(totals[m] / totals.plain - 1));
    }
  }
  return {
    eps,
    plainResidDex: +rp.toExponential(4),
    maxResidRatioDev: +maxResidRatioDev.toExponential(4),
    maxTotalRelDev: +maxTotalRelDev.toExponential(4),
    departMethod,
    inert: maxResidRatioDev < INERT_THRESHOLD,
  };
});

const ROW_AT = (eps) => SWEEP.find((r) => r.eps === eps);
const ROW_EPS1 = ROW_AT(1);
const ROW_LO = ROW_AT(0.1);
const ROW_HI = ROW_AT(91);
const BAND_WIDE_INERT = SWEEP.every((r) => r.inert);
const MAX_RESID_RATIO_DEV_OVER_SWEEP = Math.max(...SWEEP.map((r) => r.maxResidRatioDev));

export const IMP34902_SIGMA_KNEE_RESUMMATION_EPS_SWEEP = {
  id: 'imp-34902',
  proofSection: 'S-frontier',
  question:
    'imp-34888 found the four resummations (plain 9-term sum, diagonal Pade [4/4]/[3/3], Wynn epsilon, ' +
    'Borel-Laplace) of the delta_1..delta_9 knee series INERT (max cross-method SC-to-exactF residual-ratio ' +
    'deviation ~1.9e-3 < 5%) but tabulated that only at the single physical bookkeeping point eps = 1, deep ' +
    'inside the imp-34863/imp-34882 convergence disk (R ~ 91..139). Sweep eps across (0, R] and re-measure ' +
    'each method SC-to-exactF residual and the cross-method deviation, to read whether the inertness holds ' +
    'band-wide or is a property of eps = 1 only, and the eps (if any) at which a method departs. ' +
    'Measurement/derivation only; conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'for each eps in (0, R], the SC-to-exactF dex residual of the plain 9-term sum and of the Pade/Wynn/Borel ' +
    'resummations (each evaluating sum_k delta_k eps^k at the swept eps), the max cross-method residual-ratio ' +
    'deviation (the imp-34888 inertness metric), and the raw resummed-total relative disagreement before the SC map',
  radiusContext: {
    rootTestRadius: R_ROOT, // imp-34863 R ~ 139
    dombSykesRadius: R_DOMB_SYKES, // imp-34882 R ~ 91 (the swept upper endpoint)
    physicalEvalPoint: 1, // eps = 1 (imp-34888)
    inertThreshold: INERT_THRESHOLD, // < 5% cross-method deviation = inert
  },
  log10NexactF: +LOG10_N_EXACTF.toFixed(7), // ~9.5362849 (eps-independent all-orders reference)
  epsSweep: SWEEP,
  summary: {
    residResidRatioDevAtEps1: ROW_EPS1.maxResidRatioDev, // ~1.9e-3 (reproduces imp-34888)
    plainResidAtEps1Dex: ROW_EPS1.plainResidDex, // ~+4.87e-5 (the imp-34821/imp-34888 physical crossing)
    plainResidAtEps0p1Dex: ROW_LO.plainResidDex, // ~-1.83e-2 (residual drifts, NOT a plateau)
    plainResidAtEps91Dex: ROW_HI.plainResidDex, // ~+1.35 dex
    maxResidRatioDevOverSweep: +MAX_RESID_RATIO_DEV_OVER_SWEEP.toExponential(4), // ~3.4e-2 (< 5% -> band-wide inert)
    maxTotalRelDevAtEps91: ROW_HI.maxTotalRelDev, // ~2.46e-1 (raw totals split near R)
    bandWideInert: BAND_WIDE_INERT, // true: NO method leaves the < 5% band anywhere in (0, R]
  },
  finding: {
    F1_inertness_persists_band_wide:
      'The max cross-method SC-to-exactF residual-ratio deviation stays BELOW the imp-34888 5% threshold across ' +
      'the ENTIRE swept (0, R]: ~1.6e-4 at eps = 0.1, ~1.9e-3 at the physical eps = 1 (reproducing imp-34888), ' +
      'rising only to ~3.4e-2 at eps = 91. NO method departs the < 5% band anywhere; the marginally-largest ' +
      'deviation method rotates with eps (Borel at small eps, Pade near R). Inertness is a property of the whole ' +
      'convergent disk, not of eps = 1 alone.',
    F2_plateau_is_a_property_of_eps1_only:
      'The ABSOLUTE SC-to-exactF residual is NOT flat off eps = 1: it drifts MONOTONICALLY from ~-1.83e-2 dex at ' +
      'eps = 0.1, through the near-zero physical crossing +4.87e-5 at eps = 1, up to ~+1.35 dex at eps = 91. The ' +
      '+4.86e-5 "plateau" of imp-34821/imp-34888 is the residual value AT the physical bookkeeping point, not a ' +
      'flat shelf across eps.',
    F3_raw_total_agreement_degrades_near_R_masked_by_sc_map:
      'The raw cross-method resummed-TOTAL relative deviation (before the SC locator) is ~5e-12 for eps <= 1 but ' +
      'grows monotonically to ~25% at eps = 91 (crossing ~5% near eps ~ 78): the 9-term partial sum loses track ' +
      'of the Pade/Borel resummations as eps approaches the radius, as a convergent-but-slow series near its ' +
      'boundary must. The self-consistent knee map COMPRESSES these total splits, which is WHY the residual-ratio ' +
      'inertness metric (F1) never leaves the < 5% band even where the totals disagree by ~25%.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). Sweeping the bookkeeping eval point eps across ' +
    '(0, R] and re-running the imp-34888 four-method resummation (plain 9-term sum, diagonal Pade [4/4]/[3/3], ' +
    'Wynn epsilon, Borel-Laplace) at each eps shows the INERTNESS verdict is band-wide, not an eps = 1 artifact: ' +
    'the max cross-method SC-to-exactF residual-ratio deviation stays below the 5% inertness threshold across the ' +
    'WHOLE convergent neighbourhood (~1.6e-4 at eps = 0.1, ~1.9e-3 at eps = 1 reproducing imp-34888, ~3.4e-2 at ' +
    'eps = 91) and NO method departs. TWO honest caveats surface off eps = 1: (i) the +4.86e-5 SC-to-exactF ' +
    'residual is a property of the physical point eps = 1 only -- the absolute residual drifts monotonically from ' +
    '~-1.83e-2 dex (eps = 0.1) through the near-zero physical crossing to ~+1.35 dex (eps = 91), so it is the ' +
    'near-zero crossing at eps = 1, not a flat plateau across eps; and (ii) the raw resummed-total agreement ' +
    'degrades near the radius, from ~5e-12 (eps <= 1) to ~25% at eps = 91 (crossing ~5% near eps ~ 78), because ' +
    'the 9-term partial sum loses track of the Pade/Borel resummations near the boundary -- the self-consistent ' +
    'knee map compresses this, which is why the residual-ratio inertness metric never leaves the < 5% band. This ' +
    'corroborates and localizes imp-34888: resummation is inert band-wide, the FD floor caps accuracy at the ' +
    'physical point, and the near-boundary total split is a benign consequence of the finite 9-term truncation, ' +
    'not a route to a tighter knee. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO ' +
    'QED. No refereed bound is changed.',
  subGap:
    'ANSWERS the imp-34888 eps-range-robustness open question: the resummation inertness (< 5% cross-method ' +
    'deviation) holds across the WHOLE convergent (0, R], not just at eps = 1 (max deviation ~3.4e-2 at eps = 91). ' +
    'What stays OPEN (deferred, unchanged from imp-34756/imp-34888): the ~9.2e-5 dex F-route-vs-direct-route ' +
    'finite-difference floor at the physical point can only be lowered by an analytic/higher-precision ' +
    'exact-derivative evaluation (the imp-34900 Richardson sub-gap), not by resummation at any eps, and that ' +
    'changes no bound. A second deferred item: extending the delta ladder beyond order 9 would push the ' +
    'near-boundary total-split (F3) to larger eps, but the physical point eps = 1 is already far inside the disk.',
  citation:
    'imp-34888 (the eps = 1 four-method resummation cross-tabulation this sweeps off-point); imp-34863 ' +
    '(Cauchy-Hadamard R ~ 139); imp-34882 (Domb-Sykes/Neville R ~ 91); imp-34821 (the +4.86e-5 SC-to-exactF ' +
    'plateau and SC knee locator); imp-34900 (analytic-derivative Richardson sub-gap); imp-34756 (the ~9.2e-5 dex ' +
    'FD floor); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP34902_SIGMA_KNEE_RESUMMATION_EPS_SWEEP_ASSERTIONS = [
  {
    // (eps = 1 reproduces imp-34888): the physical-point residual sits on the +4.86e-5 plateau and the
    // cross-method deviation reproduces the imp-34888 ~1.9e-3 inert value.
    id: 'imp34902-eps1-reproduces-imp34888',
    description:
      'at eps = 1 the plain SC-to-exactF residual is ~+4.87e-5 (in [4.5e-5, 5.2e-5]) and the cross-method ' +
      'residual-ratio deviation ~1.9e-3 (< 5e-3), reproducing imp-34888',
    holds: () =>
      ROW_EPS1.plainResidDex > 4.5e-5 &&
      ROW_EPS1.plainResidDex < 5.2e-5 &&
      ROW_EPS1.maxResidRatioDev < 5e-3 &&
      ROW_EPS1.inert === true,
  },
  {
    // (F1): inertness persists band-wide -- every swept eps stays under the 5% cross-method threshold.
    id: 'imp34902-inertness-persists-band-wide',
    description:
      'every eps in (0, R] is inert (max cross-method residual-ratio deviation < 5%); the sweep-wide max is ~3.4e-2 (< 5%)',
    holds: () =>
      BAND_WIDE_INERT === true &&
      MAX_RESID_RATIO_DEV_OVER_SWEEP < 0.05 &&
      MAX_RESID_RATIO_DEV_OVER_SWEEP > 1e-2,
  },
  {
    // (F2): the +4.86e-5 plateau is a property of eps = 1 -- the absolute residual drifts monotonically with eps.
    id: 'imp34902-abs-residual-drifts-off-eps1',
    description:
      'the absolute SC-to-exactF residual is negative at eps = 0.1 (~-1.8e-2), near-zero at eps = 1 (~+4.9e-5), ' +
      'and large-positive at eps = 91 (> 1); the plain residual is strictly increasing across the grid',
    holds: () => {
      const monoInc = SWEEP.every(
        (r, i) => i === 0 || (Number.isFinite(r.plainResidDex) && r.plainResidDex > SWEEP[i - 1].plainResidDex),
      );
      return ROW_LO.plainResidDex < -1e-2 && Math.abs(ROW_EPS1.plainResidDex) < 1e-4 && ROW_HI.plainResidDex > 1 && monoInc;
    },
  },
  {
    // (F3): raw resummed-total agreement is machine-tight for eps <= 1 but degrades to ~25% near R.
    id: 'imp34902-total-agreement-degrades-near-R',
    description:
      'the raw cross-method resummed-total relative deviation is < 1e-9 for eps <= 1 but > 0.1 at eps = 91 ' +
      '(the SC map compresses this so F1 stays < 5%)',
    holds: () =>
      ROW_EPS1.maxTotalRelDev < 1e-9 && ROW_LO.maxTotalRelDev < 1e-9 && ROW_HI.maxTotalRelDev > 0.1,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34902-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34902_SIGMA_KNEE_RESUMMATION_EPS_SWEEP.isRigorous === false &&
      IMP34902_SIGMA_KNEE_RESUMMATION_EPS_SWEEP.farTailExponent === 0.5 &&
      typeof IMP34902_SIGMA_KNEE_RESUMMATION_EPS_SWEEP.subGap === 'string' &&
      /NO QED/.test(IMP34902_SIGMA_KNEE_RESUMMATION_EPS_SWEEP.verdict) &&
      /refereed bound is changed/i.test(IMP34902_SIGMA_KNEE_RESUMMATION_EPS_SWEEP.verdict),
  },
];

for (const a of IMP34902_SIGMA_KNEE_RESUMMATION_EPS_SWEEP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34902-sigma-knee-resummation-eps-sweep assertion failed: ${a.id}`);
  }
}
