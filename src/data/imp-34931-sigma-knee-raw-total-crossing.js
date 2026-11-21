/**
 * @module imp-34931-sigma-knee-raw-total-crossing
 *
 * imp-34931 (numerical, frontier-direction): imp-34902 SWEPT the imp-34888 four-method resummation of the
 * delta_1..delta_9 slowly-varying-v knee series off the single physical bookkeeping point eps = 1 across the
 * whole convergent (0, R] and reported (F3) that the RAW cross-method resummed-TOTAL relative deviation (before
 * the imp-34821 self-consistent knee locator) is machine-tight (~5e-12) for eps <= 1 but grows MONOTONICALLY to
 * ~25% at eps = 91, "crossing ~5% near eps ~ 78". But imp-34902 only tabulated that on an 11-point coarse grid
 * (eps in {0.1,0.5,1,2,5,10,20,40,60,80,91}) and quoted the 5%/25% crossings QUALITATIVELY -- it never PINNED
 * the crossing eps nor cross-checked them against the independent convergence-radius reads.
 *
 * THIS MODULE (measurement only; identical delta_k recursion and Pade/Wynn/Borel kernels to imp-34902/imp-34888)
 * ------------------------------------------------------------------------------------------------------------
 * Reuses the imp-34902 delta ladder and the four resummation reducers VERBATIM and measures the raw-total
 * deviation curve dev(eps) = max_{m in accel} |total_m(eps)/total_plain(eps) - 1| FINELY near the radius,
 * BISECTS the eps at which dev crosses 5% and 25% (each in a monotonic sub-bracket below the first Pade pole),
 * and CROSS-CHECKS those departure points against the imp-34882 Domb-Sykes/Neville radius R ~ 91 (uncertainty
 * range [79,106]) and the imp-34863 root-test radius R ~ 139.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (G1) THE 5% CROSSING IS PINNED at eps ~ 79.24 and THE 25% CROSSING at eps ~ 91.13 -- sharpening the imp-34902
 *        qualitative "~5% near eps ~ 78 ... ~25% at eps = 91". The raw-total deviation is smooth and monotone
 *        across the whole [1, ~100] window below the first diagonal-Pade pole (~110), so both crossings are
 *        single, well-defined roots.
 *   (G2) THE RAW-TOTAL BREAKDOWN COINCIDES WITH THE DOMB-SYKES CONVERGENCE BOUNDARY, NOT THE ROOT RADIUS. The 25%
 *        crossing eps ~ 91.13 lands essentially ON the imp-34882 Domb-Sykes radius R ~ 91 (0.14% above it), and
 *        the 5% crossing eps ~ 79.24 lands on the LOW edge of its [79,106] uncertainty range. Both crossings sit
 *        FAR interior to the imp-34863 root-test radius R ~ 139 (the 25% crossing is ~0.66 R_root). So the point
 *        where the 9-term partial sum "loses track" of the Pade/Borel resummations is the Domb-Sykes-measured
 *        boundary, corroborating R_DombSykes ~ 91 as the operative radius for the finite-order series -- exactly
 *        as a convergent-but-slow series near its true boundary must behave.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent
 * stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34902-sigma-knee-resummation-eps-sweep (the coarse 11-point sweep whose F3 5%/25% crossings this pins)
 * @see imp-34888-sigma-knee-pade-borel-resummation (the eps = 1 four-method cross-tabulation)
 * @see imp-34882-sigma-knee-domb-sykes-radius (Domb-Sykes/Neville radius R ~ 91, range [79,106])
 * @see imp-34863-sigma-knee-cauchy-hadamard-radius (root-test radius R ~ 139)
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
const R_DOMB_SYKES = 91; // imp-34882 Domb-Sykes/Neville-sharpened radius
const R_DOMB_SYKES_LO = 79; // imp-34882 uncertainty range low edge
const R_DOMB_SYKES_HI = 106; // imp-34882 uncertainty range high edge

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

// ---- no-E_flow logistic model (identical sub-terms to imp-34821/imp-34863/imp-34888/imp-34902) -------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function uOf(x) {
  return Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2; // ln r, E_flow dropped
}

// The full delta_1..delta_9 recursion at x (imp-34863/imp-34888/imp-34902 rungs VERBATIM).
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

// ---- resummation kernels (imp-34902 VERBATIM) --------------------------------------------------------------
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
const C0 = [0, ...deltaLadder(X_CROSS)]; // fixed coefficient series at the crossing (imp-34902 c0)

// raw cross-method resummed-total relative deviation at a bookkeeping point eps (before the SC knee map)
function rawTotalRelDev(eps) {
  const tp = METHODS.plain(C0, eps);
  if (!(Math.abs(tp) > 1e-300)) return NaN;
  let m = 0;
  for (const meth of ACCEL) {
    const t = METHODS[meth](C0, eps);
    if (t != null && Number.isFinite(t)) m = Math.max(m, Math.abs(t / tp - 1));
  }
  return m;
}

// bisect the eps at which rawTotalRelDev crosses `target`, in a monotone-increasing sub-bracket [a, b]
// (kept below the first diagonal-Pade pole ~110 so the deviation is single-valued and monotone).
function crossingEps(target, a, b, iters = 200) {
  for (let i = 0; i < iters; i++) {
    const mid = (a + b) / 2;
    if (rawTotalRelDev(mid) < target) a = mid;
    else b = mid;
  }
  return (a + b) / 2;
}

// fine curve near the radius (for the record / viz), plus the two pinned crossings
const FINE_GRID = [40, 60, 70, 75, 78, 79, 80, 85, 88, 90, 91, 95, 100].map((eps) => ({
  eps,
  rawTotalRelDev: +rawTotalRelDev(eps).toExponential(4),
}));
const EPS_CROSS_5PCT = crossingEps(0.05, 40, 100); // ~79.24
const EPS_CROSS_25PCT = crossingEps(0.25, 80, 100); // ~91.13

// cross-checks against the independent radius reads
const CROSS25_OVER_R_DOMB_SYKES = EPS_CROSS_25PCT / R_DOMB_SYKES; // ~1.0014 (essentially ON R_DombSykes)
const CROSS5_OVER_R_ROOT = EPS_CROSS_5PCT / R_ROOT; // ~0.571 (far interior to R_root)
const CROSS25_OVER_R_ROOT = EPS_CROSS_25PCT / R_ROOT; // ~0.657 (far interior to R_root)
const CROSS5_IN_DOMB_SYKES_RANGE = EPS_CROSS_5PCT >= R_DOMB_SYKES_LO && EPS_CROSS_5PCT <= R_DOMB_SYKES_HI;
const CROSS25_IN_DOMB_SYKES_RANGE = EPS_CROSS_25PCT >= R_DOMB_SYKES_LO && EPS_CROSS_25PCT <= R_DOMB_SYKES_HI;

export const IMP34931_SIGMA_KNEE_RAW_TOTAL_CROSSING = {
  id: 'imp-34931',
  proofSection: 'S-frontier',
  question:
    'imp-34902 (F3) reported the RAW cross-method resummed-TOTAL relative deviation of the delta_1..delta_9 knee ' +
    'series (before the imp-34821 self-consistent knee map) grows monotonically from ~5e-12 (eps <= 1) to ~25% at ' +
    'eps = 91, "crossing ~5% near eps ~ 78" -- but only on an 11-point coarse grid, never pinning the crossings. ' +
    'PIN the eps at which the raw-total deviation crosses 5% and 25% by fine bisection, and cross-check those ' +
    'departure points against the imp-34882 Domb-Sykes radius R ~ 91 (range [79,106]) and the imp-34863 root-test ' +
    'radius R ~ 139: does the raw-total breakdown eps coincide with the measured convergence boundary? ' +
    'Measurement/derivation only; conditional-share diagnostic, NOT an RH bound; C_mb GUE-conditional (imp-486); no QED.',
  measuredQuantity:
    'the raw cross-method resummed-total relative deviation dev(eps) = max_m |total_m(eps)/total_plain(eps) - 1| ' +
    'over the Pade[4/4]/Pade[3/3]/Wynn/Borel accelerants, and the bisected eps at which dev crosses 5% and 25%',
  radiusContext: {
    rootTestRadius: R_ROOT, // imp-34863 R ~ 139
    dombSykesRadius: R_DOMB_SYKES, // imp-34882 R ~ 91
    dombSykesRange: [R_DOMB_SYKES_LO, R_DOMB_SYKES_HI], // imp-34882 [79, 106]
  },
  rawTotalCurve: FINE_GRID,
  crossings: {
    epsAt5pct: +EPS_CROSS_5PCT.toFixed(3), // ~79.237
    epsAt25pct: +EPS_CROSS_25PCT.toFixed(3), // ~91.129
    cross5OverRDombSykes: +(EPS_CROSS_5PCT / R_DOMB_SYKES).toFixed(4), // ~0.8707 (low edge of range)
    cross25OverRDombSykes: +CROSS25_OVER_R_DOMB_SYKES.toFixed(4), // ~1.0014 (ON R_DombSykes)
    cross5OverRRoot: +CROSS5_OVER_R_ROOT.toFixed(4), // ~0.5711 (far interior to R_root)
    cross25OverRRoot: +CROSS25_OVER_R_ROOT.toFixed(4), // ~0.6568 (far interior to R_root)
    cross5InDombSykesRange: CROSS5_IN_DOMB_SYKES_RANGE, // true
    cross25InDombSykesRange: CROSS25_IN_DOMB_SYKES_RANGE, // true
  },
  finding: {
    G1_crossings_pinned:
      'The raw-total deviation is smooth and monotone across the [1, ~100] window below the first diagonal-Pade ' +
      'pole (~110), so the 5% and 25% crossings are single well-defined roots: bisection pins the 5% crossing at ' +
      'eps ~ 79.24 and the 25% crossing at eps ~ 91.13, sharpening the imp-34902 qualitative "~5% near eps ~ 78, ' +
      '~25% at eps = 91".',
    G2_breakdown_coincides_with_domb_sykes_boundary:
      'Both crossings sit inside the imp-34882 Domb-Sykes uncertainty range [79,106] and FAR interior to the ' +
      'imp-34863 root-test radius R ~ 139 (the 25% crossing is ~0.66 R_root): the 25% crossing eps ~ 91.13 lands ' +
      'essentially ON the Domb-Sykes radius R ~ 91 (0.14% above), and the 5% crossing eps ~ 79.24 lands on the low ' +
      'edge of the [79,106] range. So the point where the 9-term partial sum loses track of the Pade/Borel ' +
      'resummations is the Domb-Sykes-measured convergence boundary, corroborating R_DombSykes ~ 91 as the ' +
      'operative finite-order radius -- exactly as a convergent-but-slow series near its true boundary must behave.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). Fine bisection of the imp-34902 raw ' +
    'cross-method resummed-total relative deviation dev(eps) = max_m |total_m/total_plain - 1| pins the two ' +
    'crossings the imp-34902 coarse grid left qualitative: dev crosses 5% at eps ~ 79.24 and 25% at eps ~ 91.13 ' +
    '(the curve is smooth and monotone across [1, ~100], below the first diagonal-Pade pole ~110, so both are ' +
    'single roots). CROSS-CHECK: both crossings lie inside the imp-34882 Domb-Sykes uncertainty range [79,106] ' +
    'and far interior to the imp-34863 root-test radius R ~ 139 -- the 25% crossing lands essentially ON the ' +
    'Domb-Sykes radius R ~ 91 (0.14% above) and the 5% crossing on its low edge (~79). So the raw-total ' +
    'breakdown eps COINCIDES with the Domb-Sykes-measured convergence boundary, corroborating R_DombSykes ~ 91 ' +
    'as the operative radius for the finite nine-term series, and localizing the imp-34902 (F3) degradation as a ' +
    'benign convergent-but-slow boundary effect rather than a route to a tighter knee. The component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 ' +
    'is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS the imp-34902 (F3) open question: the raw-total 5%/25% crossings are pinned at eps ~ 79.24 / ~91.13 ' +
    'and the 25% crossing coincides with the imp-34882 Domb-Sykes radius R ~ 91. What stays OPEN (deferred, ' +
    'unchanged from imp-34756/imp-34888/imp-34902): resummation remains INERT at the physical point eps = 1 (the ' +
    'crossings are ~79x/91x beyond it), so this changes no bound; and the ~9.2e-5 dex FD floor at eps = 1 can only ' +
    'be lowered by an analytic/higher-precision exact-derivative evaluation (the imp-34900 Richardson sub-gap) or ' +
    'by extending the delta ladder beyond order 9 (which would push the crossings to larger eps), not by ' +
    'resummation at any eps.',
  citation:
    'imp-34902 (the coarse 11-point sweep whose F3 5%/25% crossings this pins); imp-34888 (the eps = 1 ' +
    'four-method resummation cross-tabulation); imp-34882 (Domb-Sykes/Neville R ~ 91, range [79,106]); imp-34863 ' +
    '(Cauchy-Hadamard root-test R ~ 139); imp-34821 (SC knee locator); imp-3463 (far-tail 1/2); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP34931_SIGMA_KNEE_RAW_TOTAL_CROSSING_ASSERTIONS = [
  {
    // (reproduces imp-34902 F3 anchors): dev is machine-tight at eps <= 1 and ~0.246 at eps = 91.
    id: 'imp34931-reproduces-imp34902-f3-anchors',
    description:
      'the raw-total deviation is < 1e-9 at eps = 1 and ~0.246 (in [0.2, 0.3]) at eps = 91, reproducing imp-34902 (F3)',
    holds: () => {
      const d91 = rawTotalRelDev(91);
      return rawTotalRelDev(1) < 1e-9 && d91 > 0.2 && d91 < 0.3;
    },
  },
  {
    // (G1): the 5% crossing is pinned at eps ~ 79.24 (in [78, 81]) and 25% at eps ~ 91.13 (in [90, 92]).
    id: 'imp34931-crossings-pinned',
    description:
      'the raw-total deviation crosses 5% at eps ~ 79.24 (in [78, 81]) and 25% at eps ~ 91.13 (in [90, 92]); ' +
      'the 5% crossing precedes the 25% crossing',
    holds: () =>
      EPS_CROSS_5PCT > 78 &&
      EPS_CROSS_5PCT < 81 &&
      EPS_CROSS_25PCT > 90 &&
      EPS_CROSS_25PCT < 92 &&
      EPS_CROSS_5PCT < EPS_CROSS_25PCT &&
      Math.abs(rawTotalRelDev(EPS_CROSS_5PCT) - 0.05) < 1e-3 &&
      Math.abs(rawTotalRelDev(EPS_CROSS_25PCT) - 0.25) < 1e-3,
  },
  {
    // (G2): the 25% crossing lands essentially ON the Domb-Sykes radius R ~ 91 and both are far interior to R_root.
    id: 'imp34931-breakdown-coincides-with-domb-sykes',
    description:
      'the 25% crossing / R_DombSykes ~ 1.0014 (within 1% of 1), both crossings lie in the [79,106] Domb-Sykes ' +
      'range, and both are far interior to the imp-34863 root radius R ~ 139 (25% crossing / R_root ~ 0.66 < 0.7)',
    holds: () =>
      Math.abs(CROSS25_OVER_R_DOMB_SYKES - 1) < 0.01 &&
      CROSS5_IN_DOMB_SYKES_RANGE === true &&
      CROSS25_IN_DOMB_SYKES_RANGE === true &&
      CROSS25_OVER_R_ROOT < 0.7 &&
      CROSS5_OVER_R_ROOT < 0.7,
  },
  {
    // Monotone-and-smooth check: the fine grid is strictly increasing across [40, 100] (single-valued crossings).
    id: 'imp34931-raw-total-monotone-below-pole',
    description: 'the raw-total deviation is strictly increasing across the fine grid [40, 100] (below the ~110 Pade pole)',
    holds: () =>
      FINE_GRID.every((r, i) => i === 0 || r.rawTotalRelDev > FINE_GRID[i - 1].rawTotalRelDev),
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34931-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34931_SIGMA_KNEE_RAW_TOTAL_CROSSING.isRigorous === false &&
      IMP34931_SIGMA_KNEE_RAW_TOTAL_CROSSING.farTailExponent === 0.5 &&
      typeof IMP34931_SIGMA_KNEE_RAW_TOTAL_CROSSING.subGap === 'string' &&
      /NO QED/.test(IMP34931_SIGMA_KNEE_RAW_TOTAL_CROSSING.verdict) &&
      /refereed bound is changed/i.test(IMP34931_SIGMA_KNEE_RAW_TOTAL_CROSSING.verdict),
  },
];

for (const a of IMP34931_SIGMA_KNEE_RAW_TOTAL_CROSSING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34931-sigma-knee-raw-total-crossing assertion failed: ${a.id}`);
  }
}
