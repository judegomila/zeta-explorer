/**
 * @module imp-35013-sigma-knee-5pct-lowedge-exit
 *
 * imp-35013 (numerical, frontier-direction): imp-34955 swept the imp-34824/imp-34734 multiplicative C_mb factor
 * on E_coll over [0.5,1] and reported the raw cross-method resummed-total 5%/25% deviation crossings drifting
 * monotonically and sublinearly, bundling the two log-log elasticities as "~0.18". It also noted, without pinning
 * a value, that the 5% crossing EXITS the low edge of the imp-34882 Domb-Sykes band [79,106] "below C_mb ~ 1".
 *
 * THIS MODULE (measurement only; identical delta_k recursion and Pade/Wynn/Borel kernels to imp-34931/imp-34955)
 * ------------------------------------------------------------------------------------------------------------
 * Two questions imp-34955 left un-pinned:
 *   (Q1) SEPARATE the two elasticities. The chord log-log elasticity d ln(eps_cross)/d ln(C_mb) across [0.5,1] is
 *        el5 ~ 0.18878 for the 5% crossing and el25 ~ 0.17507 for the 25% crossing -- the "~0.18" bundle hid a
 *        real ~7.8% asymmetry (el5/el25 ~ 1.078): the 5% crossing is MORE C_mb-elastic than the 25% one.
 *   (Q2) PIN the exact C_mb at which the 5% crossing crosses the [79,106] low edge (eps_5 = 79). A 200-iteration
 *        bisection on eps_5(C_mb) - 79 lands at C_mb* ~ 0.9838, i.e. the 5% crossing sits inside the Domb-Sykes
 *        band only for the top ~3.2% of the swept [0.5,1] band (a ~1.6% margin below the physical C_mb = 1).
 *
 * The threshold carries a real fuzz: eps_5(C_mb) is monotone-increasing on a COARSE scale but jitters ~0.08 in eps
 * near the edge because the raw deviation dev(eps) = max_m |total_m/total_plain - 1| switches which accelerator
 * attains the maximum (the imp-34972 method-switch kinks). A fine grid over [0.95,1] shows eps_5 straddling 79 in
 * C_mb ~ [0.985, 0.990], so the exit threshold is C_mb* ~ 0.985 +/- 0.005; equivalently the 5% crossing exits the
 * low edge for essentially the entire GUE-conditional band except a thin sliver just below C_mb = 1.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * SWEPT as a sensitivity knob but its pinned value is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34955-sigma-knee-crossing-cmb-sensitivity (the C_mb sweep this separates and threshold-pins)
 * @see imp-34972-sigma-knee-crossing-cmb-elasticity-derivation (closed-form elasticity; method-switch kinks)
 * @see imp-34931-sigma-knee-raw-total-crossing (the fixed-model 5%/25% crossing anchors 79.24 / 91.13)
 * @see imp-34882-sigma-knee-domb-sykes-radius (Domb-Sykes/Neville radius R ~ 91, range [79,106])
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A_BASE = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc at C_mb = 1 (imp-34931/imp-34955 A)
const LO = Math.log(1e6);
const HI = Math.log(1e16);
const HD = 1e-3; // canonical central-difference step (imp-34710..imp-34955 stable rung)
const R_DOMB_SYKES = 91; // imp-34882 Domb-Sykes/Neville-sharpened radius
const R_DOMB_SYKES_LO = 79; // imp-34882 uncertainty range low edge
const R_DOMB_SYKES_HI = 106; // imp-34882 uncertainty range high edge

function bisectRoot(f, a, b, iters = 200) {
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

// ---- no-E_flow logistic model with the C_mb multiplicative factor on E_coll (A -> C_mb * A) ----------------
function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
// uOf(x) = ln(C_mb * A) + 1/2 ln L(x) - x/2 ; C_mb enters as an additive ln(C_mb) (derivative-invariant)
function mkUOf(cmb) {
  const A = cmb * A_BASE;
  return (x) => Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}

// The full delta_1..delta_9 recursion at x (imp-34863/imp-34902/imp-34931/imp-34955 rungs VERBATIM).
function deltaLadder(uOf, x) {
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

// ---- resummation kernels (imp-34955 VERBATIM) --------------------------------------------------------------
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

// resolve the 5%/25% crossing-eps for a given C_mb multiplicative factor on E_coll (imp-34955 VERBATIM logic)
function crossingsForCmb(cmb) {
  const uOf = mkUOf(cmb);
  const X = bisectRoot(uOf, LO, HI);
  const C0 = [0, ...deltaLadder(uOf, X)];
  const rawTotalRelDev = (eps) => {
    const tp = METHODS.plain(C0, eps);
    if (!(Math.abs(tp) > 1e-300)) return NaN;
    let m = 0;
    for (const meth of ACCEL) {
      const t = METHODS[meth](C0, eps);
      if (t != null && Number.isFinite(t)) m = Math.max(m, Math.abs(t / tp - 1));
    }
    return m;
  };
  const crossingEps = (target, a, b, iters = 200) => {
    for (let i = 0; i < iters; i++) {
      const mid = (a + b) / 2;
      if (rawTotalRelDev(mid) < target) a = mid;
      else b = mid;
    }
    return (a + b) / 2;
  };
  return {
    cmb,
    epsAt5pct: crossingEps(0.05, 20, 140),
    epsAt25pct: crossingEps(0.25, 20, 140),
  };
}

// (Q1) SEPARATED chord log-log elasticities across the full [0.5,1] band -------------------------------------
const C_LO = crossingsForCmb(0.5);
const C_HI = crossingsForCmb(1.0);
const ELASTICITY_5PCT = Math.log(C_HI.epsAt5pct / C_LO.epsAt5pct) / Math.log(1.0 / 0.5);
const ELASTICITY_25PCT = Math.log(C_HI.epsAt25pct / C_LO.epsAt25pct) / Math.log(1.0 / 0.5);
const ELASTICITY_RATIO = ELASTICITY_5PCT / ELASTICITY_25PCT; // ~1.078 (5% crossing more C_mb-elastic)

// (Q2) exact C_mb at which the 5% crossing exits the [79,106] low edge (eps_5 = 79) --------------------------
const eps5Of = (cmb) => crossingsForCmb(cmb).epsAt5pct;
const CMB_STAR = bisectRoot((cmb) => eps5Of(cmb) - R_DOMB_SYKES_LO, 0.5, 1.0);
const EPS5_AT_STAR = eps5Of(CMB_STAR);
const EPS25_AT_STAR = crossingsForCmb(CMB_STAR).epsAt25pct;
const MARGIN_BELOW_ONE = 1.0 - CMB_STAR; // ~0.016 (thin sliver below the physical C_mb = 1)
const BAND_FRACTION_INSIDE = MARGIN_BELOW_ONE / 0.5; // ~0.032 of the swept [0.5,1] band

// jitter characterisation: eps_5 straddles 79 across a fine grid because dev = max_m switches accelerator
const JITTER_GRID = [];
for (let i = 0; i <= 20; i++) {
  const cmb = 0.95 + i * 0.0025;
  JITTER_GRID.push({ cmb: +cmb.toFixed(4), eps5: +eps5Of(cmb).toFixed(4) });
}
const CMB_LAST_BELOW = Math.max(...JITTER_GRID.filter((g) => g.eps5 < R_DOMB_SYKES_LO).map((g) => g.cmb));
const CMB_FIRST_ABOVE = Math.min(...JITTER_GRID.filter((g) => g.eps5 >= R_DOMB_SYKES_LO).map((g) => g.cmb));

export const IMP35013_SIGMA_KNEE_5PCT_LOWEDGE_EXIT = {
  id: 'imp-35013',
  proofSection: 'S-frontier',
  question:
    'imp-34955 swept the imp-34824/imp-34734 multiplicative C_mb factor on E_coll over [0.5,1] and (a) bundled ' +
    'the two log-log crossing elasticities as "~0.18" and (b) noted the 5% resummed-deviation crossing exits the ' +
    'low edge of the imp-34882 Domb-Sykes band [79,106] "below C_mb ~ 1" without a value. SEPARATE the 5% and ' +
    '25% elasticities and PIN the exact C_mb low-edge exit threshold. Measurement only; C_mb GUE-conditional ' +
    '(imp-486) untouched; changes no bound; no RH verdict; no QED.',
  measuredQuantity:
    'the separated chord log-log elasticities d ln(eps_5)/d ln(C_mb) and d ln(eps_25)/d ln(C_mb) across [0.5,1], ' +
    'and the bisected C_mb* at which the 5% crossing eps_5(C_mb) equals the Domb-Sykes low edge 79',
  cmbBand: [0.5, 1.0],
  radiusContext: {
    dombSykesRadius: R_DOMB_SYKES, // imp-34882 R ~ 91
    dombSykesRange: [R_DOMB_SYKES_LO, R_DOMB_SYKES_HI], // imp-34882 [79, 106]
  },
  separatedElasticities: {
    elasticity5pct: +ELASTICITY_5PCT.toFixed(5), // ~0.18878
    elasticity25pct: +ELASTICITY_25PCT.toFixed(5), // ~0.17507
    ratio5over25: +ELASTICITY_RATIO.toFixed(5), // ~1.07833 (5% crossing ~7.8% MORE C_mb-elastic)
    asymmetryPct: +(100 * (ELASTICITY_RATIO - 1)).toFixed(3), // ~7.833 %
  },
  lowEdgeExit: {
    cmbStar: +CMB_STAR.toFixed(6), // ~0.983764 (eps_5 = 79 by 200-iter bisection)
    eps5AtStar: +EPS5_AT_STAR.toFixed(4), // ~78.935 (within the ~0.08 method-switch jitter of 79)
    eps25AtStar: +EPS25_AT_STAR.toFixed(4), // ~91.046 (still inside [79,106])
    marginBelowOne: +MARGIN_BELOW_ONE.toFixed(6), // ~0.016236 (thin sliver below the physical C_mb = 1)
    bandFractionInside: +BAND_FRACTION_INSIDE.toFixed(5), // ~0.03247 of the swept [0.5,1] band
    jitterBracket: [CMB_LAST_BELOW, CMB_FIRST_ABOVE], // ~[0.9875, 0.99] on the fine [0.95,1] grid
  },
  finding: {
    Q1_elasticities_separated:
      'The imp-34955 "~0.18" bundle hid a real ~7.8% asymmetry: the 5% crossing has chord log-log elasticity ' +
      'd ln(eps_5)/d ln(C_mb) ~ 0.18878 while the 25% crossing has ~0.17507 (ratio ~1.078). The 5% crossing is ' +
      'the MORE C_mb-elastic of the two, so it is the one that drops out of the Domb-Sykes band first as C_mb ' +
      'falls -- consistent with (Q2).',
    Q2_lowedge_exit_threshold:
      'The 5% crossing exits the [79,106] low edge at C_mb* ~ 0.984 (200-iter bisection of eps_5 - 79), i.e. the ' +
      '5% crossing lies inside the Domb-Sykes band only for the top ~3.2% of the swept [0.5,1] band -- a ~1.6% ' +
      'margin below the physical C_mb = 1. eps_5(C_mb) is monotone on a coarse scale but jitters ~0.08 in eps ' +
      'near the edge (the imp-34972 method-switch kinks), so a fine grid puts the exact straddle in C_mb ~ ' +
      '[0.9875, 0.99]; the threshold is C_mb* ~ 0.985 +/- 0.005. At C_mb* the 25% crossing (~91.05) is still ' +
      'comfortably inside the band, confirming only the 5% crossing is edge-sensitive.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). SEPARATING the imp-34955 bundled "~0.18" ' +
    'elasticity: the 5% crossing chord log-log elasticity d ln(eps_5)/d ln(C_mb) ~ 0.18878 and the 25% crossing ' +
    '~0.17507 (ratio ~1.078, a ~7.8% asymmetry -- the 5% crossing is more C_mb-elastic). PINNING the low-edge ' +
    'exit: a 200-iteration bisection of eps_5(C_mb) - 79 lands at C_mb* ~ 0.984, so the 5% crossing sits inside ' +
    'the imp-34882 Domb-Sykes band [79,106] only for the top ~3.2% of the swept [0.5,1] band (a ~1.6% margin ' +
    'below the physical C_mb = 1). eps_5(C_mb) jitters ~0.08 in eps near the edge (the imp-34972 dev = max_m ' +
    'method-switch kinks), so the exact straddle spans C_mb ~ [0.9875, 0.99] and the threshold is C_mb* ~ 0.985 ' +
    '+/- 0.005; at C_mb* the 25% crossing ~91.05 is still inside the band, so only the 5% crossing is edge-' +
    'sensitive. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'C_mb GUE-conditional per imp-486 is swept as a sensitivity knob but its pinned value is UNTOUCHED; changes ' +
    'no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 ' +
    '(imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS the imp-34955 open items: (Q1) the two crossing elasticities are 0.18878 (5%) vs 0.17507 (25%), a ' +
    '~7.8% asymmetry the "~0.18" bundle hid; (Q2) the 5% crossing exits the [79,106] low edge at C_mb* ~ 0.984 ' +
    '(threshold ~0.985 +/- 0.005 given the ~0.08-eps method-switch jitter), a ~1.6% margin below C_mb = 1. What ' +
    'stays OPEN: the exact threshold is fuzzy at the jitter level because dev = max_m switches accelerator near ' +
    'the edge (a sharper pin would need the imp-34900 analytic-derivative kernel that removes the FD/method ' +
    'noise, not this raw sweep); and resummation remains INERT at the physical point eps = 1 (all crossings sit ' +
    '~70-91x beyond it), so this changes no bound.',
  citation:
    'imp-34955 (the C_mb sweep this separates and threshold-pins); imp-34972 (closed-form elasticity, ' +
    'method-switch kinks); imp-34931 (fixed-model 5%/25% anchors 79.24 / 91.13); imp-34882 (Domb-Sykes R ~ 91, ' +
    'range [79,106]); imp-34900 (analytic-derivative radius sub-gap); imp-3463 (far-tail 1/2); imp-486 (C_mb ' +
    'GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP35013_SIGMA_KNEE_5PCT_LOWEDGE_EXIT_ASSERTIONS = [
  {
    // (Q1): the two elasticities separate at ~0.18878 (5%) and ~0.17507 (25%) with the 5% crossing more elastic.
    id: 'imp35013-elasticities-separated',
    description:
      'the 5% crossing chord elasticity ~0.18878 (in [0.185,0.192]) exceeds the 25% crossing ~0.17507 ' +
      '(in [0.172,0.178]), a ~7.8% asymmetry the imp-34955 "~0.18" bundle hid',
    holds: () =>
      ELASTICITY_5PCT > 0.185 &&
      ELASTICITY_5PCT < 0.192 &&
      ELASTICITY_25PCT > 0.172 &&
      ELASTICITY_25PCT < 0.178 &&
      ELASTICITY_5PCT > ELASTICITY_25PCT &&
      ELASTICITY_RATIO > 1.05 &&
      ELASTICITY_RATIO < 1.1,
  },
  {
    // (Q2): the 5% crossing exits the [79,106] low edge at C_mb* ~ 0.984, a thin sliver below C_mb = 1.
    id: 'imp35013-lowedge-exit-threshold',
    description:
      'the 5% crossing exits the Domb-Sykes [79,106] low edge at C_mb* ~ 0.984 (in [0.97,0.995]), with ' +
      'eps_5(C_mb*) within ~0.15 of 79 and a ~1.6% margin below the physical C_mb = 1',
    holds: () =>
      CMB_STAR > 0.97 &&
      CMB_STAR < 0.995 &&
      Math.abs(EPS5_AT_STAR - R_DOMB_SYKES_LO) < 0.15 &&
      MARGIN_BELOW_ONE > 0.005 &&
      MARGIN_BELOW_ONE < 0.03 &&
      BAND_FRACTION_INSIDE > 0.01 &&
      BAND_FRACTION_INSIDE < 0.06,
  },
  {
    // bracket sanity: eps_5 crosses 79 between C_mb = 0.5 (below) and C_mb = 1 (above); 25% crossing still inside.
    id: 'imp35013-bracket-and-eps25-inside',
    description:
      'eps_5(0.5) < 79 < eps_5(1.0) brackets the exit, and at C_mb* the 25% crossing ~91.05 is still inside ' +
      'the Domb-Sykes range [79,106] (only the 5% crossing is edge-sensitive)',
    holds: () =>
      C_LO.epsAt5pct < R_DOMB_SYKES_LO &&
      C_HI.epsAt5pct > R_DOMB_SYKES_LO &&
      EPS25_AT_STAR >= R_DOMB_SYKES_LO &&
      EPS25_AT_STAR <= R_DOMB_SYKES_HI,
  },
  {
    // C_mb = 1 reproduces the imp-34931/imp-34955 anchors (5% ~ 79.24, 25% ~ 91.13).
    id: 'imp35013-cmb1-reproduces-anchors',
    description:
      'at C_mb = 1 the 5% crossing ~79.24 (in [79,80]) and 25% crossing ~91.13 (in [90.5,91.5]), reproducing ' +
      'the imp-34931/imp-34955 fixed-model anchors',
    holds: () =>
      C_HI.epsAt5pct > 79 &&
      C_HI.epsAt5pct < 80 &&
      C_HI.epsAt25pct > 90.5 &&
      C_HI.epsAt25pct < 91.5,
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp35013-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP35013_SIGMA_KNEE_5PCT_LOWEDGE_EXIT.isRigorous === false &&
      IMP35013_SIGMA_KNEE_5PCT_LOWEDGE_EXIT.farTailExponent === 0.5 &&
      typeof IMP35013_SIGMA_KNEE_5PCT_LOWEDGE_EXIT.subGap === 'string' &&
      /NO QED/.test(IMP35013_SIGMA_KNEE_5PCT_LOWEDGE_EXIT.verdict) &&
      /refereed bound is changed/i.test(IMP35013_SIGMA_KNEE_5PCT_LOWEDGE_EXIT.verdict),
  },
];

for (const a of IMP35013_SIGMA_KNEE_5PCT_LOWEDGE_EXIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35013-sigma-knee-5pct-lowedge-exit assertion failed: ${a.id}`);
  }
}
