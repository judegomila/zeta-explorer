/**
 * @module imp-34955-sigma-knee-crossing-cmb-sensitivity
 *
 * imp-34955 (numerical, frontier-direction): imp-34931 PINNED the raw cross-method resummed-total deviation
 * crossings of the delta_1..delta_9 slowly-varying-v knee series at eps ~ 79.24 (5%) and eps ~ 91.13 (25%),
 * finding the 25% crossing lands essentially ON the imp-34882 Domb-Sykes radius R ~ 91 and the 5% on the low
 * edge of its [79,106] uncertainty range. But that was measured at the FIXED physical bookkeeping model, i.e.
 * with the imp-34824/imp-34734 multiplicative C_mb factor on E_coll pinned at 1. The GUE-conditional C_mb
 * (imp-486) is only known to lie in a band, so the coincidence could be an artifact of the particular C_mb.
 *
 * THIS MODULE (measurement only; identical delta_k recursion and Pade/Wynn/Borel kernels to imp-34931/imp-34902)
 * ------------------------------------------------------------------------------------------------------------
 * Reuses the imp-34931 delta ladder and the four resummation reducers VERBATIM, but parameterises the model by a
 * multiplicative C_mb factor on E_coll: the ratio A = E_coll/E_trunc becomes C_mb * A, which enters the log-odds
 * kernel uOf(x) = ln(C_mb * A) + 1/2 ln L(x) - x/2 as an ADDITIVE ln(C_mb). An additive constant does not change
 * the derivatives of uOf, so the delta_k recursion coefficients at a FIXED x are C_mb-invariant; C_mb moves the
 * crossings ONLY by relocating the r = 1 landmark X_CROSS (the root of uOf) at which the ladder is sampled.
 * We sweep C_mb across [0.5, 1] on an 11-point grid, re-solve X_CROSS and the delta series at each C_mb, and
 * BISECT the two crossing-eps values, then test whether the imp-34931 Domb-Sykes-boundary coincidence survives.
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (G1) BOTH CROSSINGS DRIFT MONOTONICALLY AND SUBLINEARLY WITH C_mb. As C_mb runs 0.5 -> 1.0 the 5% crossing
 *        rises 69.52 -> 79.24 (~12.3% span) and the 25% crossing 80.72 -> 91.13 (~11.4% span), both strictly
 *        increasing. The sensitivity is WEAK: the log-log elasticity d ln(eps_cross)/d ln(C_mb) ~ 0.18, so a 2x
 *        change in the GUE-conditional constant moves the crossings only ~11-12%. C_mb = 1 reproduces the
 *        imp-34931 anchors (79.24 / 91.13) exactly.
 *   (G2) THE RANGE-LEVEL DOMB-SYKES COINCIDENCE IS ROBUST; THE POINT-LEVEL COINCIDENCE IS C_mb-SPECIFIC. The 25%
 *        crossing stays INSIDE the imp-34882 Domb-Sykes uncertainty range [79,106] for the ENTIRE C_mb in [0.5,1]
 *        (its minimum, 80.72 at C_mb = 0.5, is still above the 79 low edge). So the qualitative imp-34931 result
 *        -- the raw-total breakdown coincides with the measured convergence boundary -- is ROBUST to the
 *        GUE-conditional constant. BUT the TIGHT numerical landing on the point estimate R ~ 91 is NOT: the ratio
 *        eps_25/R runs 0.887 (C_mb = 0.5) -> 1.001 (C_mb = 1), so the "essentially ON R ~ 91" reading holds only
 *        near C_mb ~ 1, and the 5% crossing exits the low edge of [79,106] (drops below 79) for every C_mb < ~1.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * SWEPT as a sensitivity knob but its pinned value is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34931-sigma-knee-raw-total-crossing (the fixed-model 5%/25% crossing pins this varies over C_mb)
 * @see imp-34882-sigma-knee-domb-sykes-radius (Domb-Sykes/Neville radius R ~ 91, range [79,106])
 * @see imp-34863-sigma-knee-cauchy-hadamard-radius (root-test radius R ~ 139)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A_BASE = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc at C_mb = 1 (imp-34931 A)
// wide root bracket so the r = 1 landmark X_CROSS stays bracketed even when C_mb pushes it below 1e9
const LO = Math.log(1e6);
const HI = Math.log(1e16);
const HD = 1e-3; // canonical central-difference step (imp-34710..imp-34931 stable rung)
const R_ROOT = 1.3874e2; // imp-34863 Cauchy-Hadamard radius (root test)
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

// The full delta_1..delta_9 recursion at x (imp-34863/imp-34888/imp-34902/imp-34931 rungs VERBATIM).
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

// ---- resummation kernels (imp-34931 VERBATIM) --------------------------------------------------------------
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

// resolve (X_CROSS, crossing-eps at 5% and 25%) for a given C_mb multiplicative factor on E_coll
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
  // bisect the eps at which the deviation crosses `target` in the monotone sub-bracket below the ~110 Pade pole
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
    xCross: X,
    devAt1: rawTotalRelDev(1),
    epsAt5pct: crossingEps(0.05, 20, 140),
    epsAt25pct: crossingEps(0.25, 20, 140),
  };
}

// ---- sweep C_mb across [0.5, 1] on an 11-point grid --------------------------------------------------------
const CMB_GRID = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0];
const SWEEP = CMB_GRID.map((cmb) => {
  const r = crossingsForCmb(cmb);
  return {
    cmb: +cmb.toFixed(2),
    epsAt5pct: +r.epsAt5pct.toFixed(3),
    epsAt25pct: +r.epsAt25pct.toFixed(3),
    eps25OverRDombSykes: +(r.epsAt25pct / R_DOMB_SYKES).toFixed(4),
    eps5InDombSykesRange: r.epsAt5pct >= R_DOMB_SYKES_LO && r.epsAt5pct <= R_DOMB_SYKES_HI,
    eps25InDombSykesRange: r.epsAt25pct >= R_DOMB_SYKES_LO && r.epsAt25pct <= R_DOMB_SYKES_HI,
  };
});

const LOW = SWEEP[0]; // C_mb = 0.5
const HIGH = SWEEP[SWEEP.length - 1]; // C_mb = 1.0

// log-log elasticity d ln(eps_cross)/d ln(C_mb) across the full [0.5,1] band (sensitivity to the constant)
const ELASTICITY_5PCT = Math.log(HIGH.epsAt5pct / LOW.epsAt5pct) / Math.log(HIGH.cmb / LOW.cmb);
const ELASTICITY_25PCT = Math.log(HIGH.epsAt25pct / LOW.epsAt25pct) / Math.log(HIGH.cmb / LOW.cmb);
const SPAN_5PCT_PCT = (100 * (HIGH.epsAt5pct - LOW.epsAt5pct)) / HIGH.epsAt5pct;
const SPAN_25PCT_PCT = (100 * (HIGH.epsAt25pct - LOW.epsAt25pct)) / HIGH.epsAt25pct;

// robustness reads: is the 25% crossing inside the Domb-Sykes range for EVERY swept C_mb?
const EPS25_ALWAYS_IN_DS_RANGE = SWEEP.every((r) => r.eps25InDombSykesRange);
const EPS5_ALWAYS_IN_DS_RANGE = SWEEP.every((r) => r.eps5InDombSykesRange);
const BOTH_MONOTONE_INCREASING = SWEEP.every(
  (r, i) => i === 0 || (r.epsAt5pct > SWEEP[i - 1].epsAt5pct && r.epsAt25pct > SWEEP[i - 1].epsAt25pct)
);

export const IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY = {
  id: 'imp-34955',
  proofSection: 'S-frontier',
  question:
    'imp-34931 pinned the raw cross-method resummed-total deviation crossings of the delta_1..delta_9 knee series ' +
    'at eps ~ 79.24 (5%) and eps ~ 91.13 (25%), finding the 25% crossing lands essentially ON the imp-34882 ' +
    'Domb-Sykes radius R ~ 91 and the 5% on the low edge of its [79,106] range -- but only at the fixed physical ' +
    'model (C_mb = 1). MEASURE how the two crossing-eps drift as the imp-34824/imp-34734 multiplicative C_mb ' +
    'factor on E_coll varies over [0.5,1]: is the crossing/Domb-Sykes-boundary coincidence robust to the ' +
    'GUE-conditional constant, or does it move with C_mb? Measurement only; C_mb GUE-conditional (imp-486) ' +
    'untouched; changes no bound; no RH verdict; no QED.',
  measuredQuantity:
    'the bisected eps at which the raw cross-method resummed-total relative deviation dev(eps) = ' +
    'max_m |total_m(eps)/total_plain(eps) - 1| crosses 5% and 25%, as a function of the multiplicative C_mb ' +
    'factor on E_coll (A = E_coll/E_trunc -> C_mb * A) swept over [0.5, 1]',
  cmbBand: [0.5, 1.0],
  radiusContext: {
    rootTestRadius: R_ROOT, // imp-34863 R ~ 139
    dombSykesRadius: R_DOMB_SYKES, // imp-34882 R ~ 91
    dombSykesRange: [R_DOMB_SYKES_LO, R_DOMB_SYKES_HI], // imp-34882 [79, 106]
  },
  sweep: SWEEP,
  drift: {
    eps5AtCmbLo: LOW.epsAt5pct, // ~69.518 (C_mb = 0.5)
    eps5AtCmbHi: HIGH.epsAt5pct, // ~79.237 (C_mb = 1.0, reproduces imp-34931)
    eps25AtCmbLo: LOW.epsAt25pct, // ~80.715 (C_mb = 0.5)
    eps25AtCmbHi: HIGH.epsAt25pct, // ~91.129 (C_mb = 1.0, reproduces imp-34931)
    span5pctPct: +SPAN_5PCT_PCT.toFixed(2), // ~12.27 % across [0.5,1]
    span25pctPct: +SPAN_25PCT_PCT.toFixed(2), // ~11.43 % across [0.5,1]
    elasticity5pct: +ELASTICITY_5PCT.toFixed(4), // ~0.1888 (sublinear)
    elasticity25pct: +ELASTICITY_25PCT.toFixed(4), // ~0.1751 (sublinear)
    eps25OverRAtCmbLo: LOW.eps25OverRDombSykes, // ~0.8870 (C_mb = 0.5)
    eps25OverRAtCmbHi: HIGH.eps25OverRDombSykes, // ~1.0014 (C_mb = 1.0)
  },
  robustness: {
    eps25AlwaysInDombSykesRange: EPS25_ALWAYS_IN_DS_RANGE, // true (range-level coincidence robust)
    eps5AlwaysInDombSykesRange: EPS5_ALWAYS_IN_DS_RANGE, // false (5% exits the low edge for C_mb < ~1)
    bothMonotoneIncreasing: BOTH_MONOTONE_INCREASING, // true
  },
  finding: {
    G1_crossings_drift_sublinearly_with_cmb:
      'Both crossings drift monotonically and SUBLINEARLY with C_mb over [0.5,1]: as C_mb runs 0.5 -> 1.0 the 5% ' +
      'crossing rises ~69.52 -> ~79.24 (~12.3% span) and the 25% crossing ~80.72 -> ~91.13 (~11.4% span), both ' +
      'strictly increasing. The log-log elasticity d ln(eps_cross)/d ln(C_mb) ~ 0.18, so a full 2x change in the ' +
      'GUE-conditional constant moves the crossings only ~11-12%. C_mb = 1 reproduces the imp-34931 anchors ' +
      '(79.24 / 91.13) exactly.',
    G2_range_coincidence_robust_point_coincidence_cmb_specific:
      'The 25% crossing stays INSIDE the imp-34882 Domb-Sykes uncertainty range [79,106] for the ENTIRE ' +
      'C_mb in [0.5,1] (its minimum 80.72 at C_mb = 0.5 is still above the 79 low edge), so the imp-34931 ' +
      'range-level coincidence -- the raw-total breakdown lands on the measured convergence boundary -- is ROBUST ' +
      'to the GUE-conditional constant. But the TIGHT landing on the point estimate R ~ 91 is NOT robust: ' +
      'eps_25/R runs 0.887 (C_mb = 0.5) -> 1.001 (C_mb = 1), so "essentially ON R ~ 91" holds only near C_mb ~ 1, ' +
      'and the 5% crossing drops below the 79 low edge for every C_mb < ~1.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote the ramp saturates toward
  isRigorous: false,
  verdict:
    'MEASUREMENT / DERIVATION (frontier-direction, NOT rigorous). Sweeping the multiplicative C_mb factor on ' +
    'E_coll over [0.5,1] (A = E_coll/E_trunc -> C_mb * A, entering the log-odds kernel as an additive ln(C_mb) so ' +
    'C_mb moves the crossings only by relocating the r = 1 landmark X_CROSS at which the delta ladder is sampled): ' +
    'both raw-total 5%/25% crossings drift monotonically and sublinearly, the 5% crossing 69.52 -> 79.24 and the ' +
    '25% crossing 80.72 -> 91.13 as C_mb runs 0.5 -> 1, a ~11-12% span with log-log elasticity ~0.18 (C_mb = 1 ' +
    'reproduces the imp-34931 79.24 / 91.13 anchors). ROBUSTNESS: the 25% crossing stays inside the imp-34882 ' +
    'Domb-Sykes uncertainty range [79,106] across the WHOLE band (min 80.72 at C_mb = 0.5), so the imp-34931 ' +
    'range-level coincidence with the measured convergence boundary is ROBUST to the GUE-conditional constant; ' +
    'but the tight landing ON the point estimate R ~ 91 is C_mb-specific (eps_25/R 0.887 -> 1.001, hitting 1 only ' +
    'near C_mb ~ 1) and the 5% crossing exits the low edge of [79,106] for every C_mb < ~1. The component model ' +
    'is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 ' +
    'is swept as a sensitivity knob but its pinned value is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  subGap:
    'ANSWERS the imp-34955 sensitivity question: the imp-34931 Domb-Sykes-boundary coincidence is ROBUST to C_mb ' +
    'at the RANGE level (25% crossing in [79,106] for all C_mb in [0.5,1]) but C_mb-SPECIFIC at the POINT level ' +
    '(exact landing on R ~ 91 needs C_mb ~ 1). What stays OPEN (unchanged from imp-34931): resummation remains ' +
    'INERT at the physical point eps = 1 (all crossings sit ~70-91x beyond it, dev(1) ~ 5e-12 for every swept ' +
    'C_mb), so this changes no bound; and the Domb-Sykes point estimate R ~ 91 itself carries the imp-34882 ' +
    '[79,106] uncertainty, so a tighter robustness verdict on the point coincidence would need the imp-34900 ' +
    'analytic-derivative radius pin, not a C_mb sweep.',
  citation:
    'imp-34931 (the fixed-model 5%/25% crossing pins this varies over C_mb); imp-34882 (Domb-Sykes/Neville ' +
    'R ~ 91, range [79,106]); imp-34863 (Cauchy-Hadamard root-test R ~ 139); imp-34824/imp-34734 (the ' +
    'multiplicative C_mb factor on E_coll); imp-34900 (analytic-derivative radius sub-gap); imp-3463 (far-tail ' +
    '1/2); imp-486 (C_mb GUE-conditional); lambda-rh-height-mapping.',
};

export const IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY_ASSERTIONS = [
  {
    // C_mb = 1 reproduces the imp-34931 anchors (5% ~ 79.24, 25% ~ 91.13).
    id: 'imp34955-cmb1-reproduces-imp34931',
    description:
      'at C_mb = 1 the 5% crossing ~ 79.24 (in [79, 80]) and the 25% crossing ~ 91.13 (in [90.5, 91.5]), ' +
      'reproducing the imp-34931 fixed-model anchors',
    holds: () =>
      HIGH.epsAt5pct > 79 &&
      HIGH.epsAt5pct < 80 &&
      HIGH.epsAt25pct > 90.5 &&
      HIGH.epsAt25pct < 91.5,
  },
  {
    // (G1): both crossings strictly increase with C_mb; the ~11-12% span and sublinear elasticity ~0.18.
    id: 'imp34955-crossings-drift-monotone-sublinear',
    description:
      'both crossings strictly increase with C_mb across [0.5,1] (5% span ~12.3%, 25% span ~11.4%) with a ' +
      'sublinear log-log elasticity ~0.18 (both < 0.5)',
    holds: () =>
      BOTH_MONOTONE_INCREASING === true &&
      SPAN_5PCT_PCT > 10 &&
      SPAN_5PCT_PCT < 14 &&
      SPAN_25PCT_PCT > 10 &&
      SPAN_25PCT_PCT < 13 &&
      ELASTICITY_5PCT > 0.1 &&
      ELASTICITY_5PCT < 0.5 &&
      ELASTICITY_25PCT > 0.1 &&
      ELASTICITY_25PCT < 0.5,
  },
  {
    // (G2): the 25% crossing stays inside the Domb-Sykes range for ALL swept C_mb (range coincidence robust).
    id: 'imp34955-eps25-range-coincidence-robust',
    description:
      'the 25% crossing lies inside the imp-34882 Domb-Sykes range [79,106] for every swept C_mb in [0.5,1] ' +
      '(min ~80.72 at C_mb = 0.5) -- the range-level coincidence is robust to the GUE-conditional constant',
    holds: () => EPS25_ALWAYS_IN_DS_RANGE === true && LOW.epsAt25pct >= R_DOMB_SYKES_LO,
  },
  {
    // (G2): the tight point-estimate landing (eps25/R ~ 1) is C_mb-specific, and the 5% crossing exits [79,106].
    id: 'imp34955-point-coincidence-cmb-specific',
    description:
      'the 25%/R_DombSykes ratio runs ~0.887 (C_mb = 0.5) -> ~1.001 (C_mb = 1), so the tight landing on R ~ 91 ' +
      'is C_mb-specific; the 5% crossing is NOT inside [79,106] for all C_mb (exits the low edge below C_mb ~ 1)',
    holds: () =>
      LOW.eps25OverRDombSykes < 0.9 &&
      Math.abs(HIGH.eps25OverRDombSykes - 1) < 0.01 &&
      EPS5_ALWAYS_IN_DS_RANGE === false,
  },
  {
    // Resummation stays inert at the physical point eps = 1 for every swept C_mb (no bound change).
    id: 'imp34955-inert-at-eps1-all-cmb',
    description: 'the raw-total deviation at eps = 1 is < 1e-9 for every swept C_mb (resummation inert, no bound change)',
    holds: () => CMB_GRID.every((cmb) => crossingsForCmb(cmb).devAt1 < 1e-9),
  },
  {
    // Honesty gate: measurement/derivation only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34955-honesty-gate-no-qed',
    description: 'Measurement/derivation only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY.isRigorous === false &&
      IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY.farTailExponent === 0.5 &&
      typeof IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY.subGap === 'string' &&
      /NO QED/.test(IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY.verdict),
  },
];

for (const a of IMP34955_SIGMA_KNEE_CROSSING_CMB_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34955-sigma-knee-crossing-cmb-sensitivity assertion failed: ${a.id}`);
  }
}
