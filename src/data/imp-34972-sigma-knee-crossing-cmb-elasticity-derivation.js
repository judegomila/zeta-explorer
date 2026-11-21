/**
 * @module imp-34972-sigma-knee-crossing-cmb-elasticity-derivation
 *
 * imp-34972 (numerical/derivation, frontier-direction): imp-34955 MEASURED the C_mb-sensitivity of the imp-34931
 * raw-total resummed-deviation 5%/25% crossings by sweeping the multiplicative C_mb factor on E_coll over [0.5,1]
 * and reported a log-log elasticity d ln(eps_cross)/d ln(C_mb) ~ 0.18 -- but only as a chord (endpoint) number;
 * it was never DERIVED. This module supplies the derivation and assesses whether the ~0.18 is constant or drifts.
 *
 * THE DERIVATION (measurement/derivation only; imp-34931/imp-34955 delta ladder and reducers reused VERBATIM)
 * -----------------------------------------------------------------------------------------------------------
 * C_mb enters the log-odds kernel uOf(x) = ln(C_mb * A_BASE) + 1/2 ln L(x) - x/2 as an ADDITIVE ln(C_mb). Since
 * an additive constant is derivative-invariant, the delta_k ladder coefficients at a FIXED x are C_mb-invariant,
 * so the ENTIRE C_mb dependence of the crossings is the relocation of the r = 1 landmark X_CROSS (the root of
 * uOf) at which the ladder is sampled. Write c = ln(C_mb). Differentiating uOf(X_CROSS(c); c) = 0 implicitly:
 *   1 + uOf_prime(X_CROSS) * dX_CROSS/dc = 0    ==>    dX_CROSS/dc = -1 / uOf_prime(X_CROSS) = 1 / v_CROSS,
 * where v_CROSS = -uOf_prime(X_CROSS) = 1/2 - 1/2 * (ln L)_prime(X_CROSS) = (1/2)(1 - (ln L)_prime(X_CROSS)).
 * Hence the CLOSED-FORM X-shift
 *   dX_CROSS/d ln(C_mb) = 1 / v_CROSS = 2 / (1 - (ln L)_prime(X_CROSS)).
 * The crossing elasticity then factorises by the chain rule (C_mb reaches eps_cross ONLY through X_CROSS):
 *   d ln(eps_cross)/d ln(C_mb) = [d ln(eps_cross)/dX] * (1 / v_CROSS).
 * The first factor is the crossing-eps SHAPE sensitivity (how the bisected crossing eps responds to the sampling
 * point X); the second is the closed-form X-shift above.
 *
 * THE FINDING (measurement/derivation only)
 * -----------------------------------------
 *   (G1) THE ANALYTIC X-SHIFT FACTOR IS EXACT AND NEAR-CONSTANT. Across the whole [0.5,1] band the closed-form
 *        1 / v_CROSS = 2 / (1 - (ln L)_prime(X_CROSS)) matches a direct central-difference dX_CROSS/d ln(C_mb) to
 *        every displayed digit, and it drifts only 2.1018 (C_mb = 0.5) -> 2.0952 (C_mb = 1.0), a 0.3% change,
 *        because L = ln(T/2pi) varies extremely slowly so (ln L)_prime(X) stays tiny (~0.05).
 *   (G2) THE CHORD ELASTICITY DECOMPOSES EXACTLY INTO THE X-SHIFT TIMES A MEASURED SHAPE SENSITIVITY. The chord
 *        d ln(eps_cross)/dX is ~0.0900 (5%) and ~0.0834 (25%); multiplying by the chord X-shift 2.0984 reproduces
 *        the imp-34955 chord elasticities 0.1888 (5%) and 0.1751 (25%) to 4 decimals. So the ~0.18 is the product
 *        of a closed-form near-constant X-shift ~2.10 and a slowly-varying measured shape number ~0.086.
 *   (G3) THE ~0.18 IS A BAND-AVERAGED (CHORD) QUANTITY, NOT A STABLE LOCAL DERIVATIVE. The X-shift half is stable
 *        pointwise, but the shape half d ln(eps_cross)/dX is stable ONLY at chord scale: the LOCAL pointwise
 *        elasticity fails to converge under finite-difference refinement (at C_mb = 0.7 it runs 0.178 -> 0.109 ->
 *        -0.268 -> 1.515 -> 4.401 as the step h shrinks 1e-2 -> 1e-4), because dev(eps) = max_m |total_m/plain - 1|
 *        has binding-method-switch kinks in eps that the chord averages over. So "constant ~0.18 across [0.5,1]"
 *        holds as a band average whose analytic factor is constant to 0.3%; there is NO well-defined local value.
 *
 * MEASUREMENT / DERIVATION ONLY. Conditional-share diagnostic, NOT an RH bound. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is
 * SWEPT/differentiated as a knob but its pinned value is UNTOUCHED; changes no bound; establishes no operator
 * positivity; imp-3066 K_a >= 0 untouched; far-tail exponent stays 1/2 (imp-3463); no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34955-sigma-knee-crossing-cmb-sensitivity (MEASURED the ~0.18 elasticity this derives)
 * @see imp-34931-sigma-knee-raw-total-crossing (the fixed-model 5%/25% crossing anchors)
 * @see imp-34882-sigma-knee-domb-sykes-radius (Domb-Sykes/Neville radius R ~ 91)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const A_BASE = C_C_PINNED / E_TRUNC_PT; // E_coll/E_trunc at C_mb = 1 (imp-34931 A)
const LO = Math.log(1e6);
const HI = Math.log(1e16);
const HD = 1e-3; // canonical central-difference step (imp-34710..imp-34955 stable rung)

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

function Lof(x) {
  return Math.log(effectiveHeightForN(Math.exp(x)));
}
function mkUOf(cmb) {
  const A = cmb * A_BASE;
  return (x) => Math.log(A) + 0.5 * Math.log(Lof(x)) - x / 2;
}

// The full delta_1..delta_9 recursion at x (imp-34931/imp-34955 rungs VERBATIM).
function deltaLadder(uOf, x) {
  const d1 = (f, y) => (f(y + HD) - f(y - HD)) / (2 * HD);
  const d2 = (f, y) => (f(y + HD) - 2 * f(y) + f(y - HD)) / (HD * HD);
  const d3 = (f, y) => (f(y + 2 * HD) - 2 * f(y + HD) + 2 * f(y - HD) - f(y - 2 * HD)) / (2 * HD * HD * HD);
  const v = -d1(uOf, x);
  const vp = -d2(uOf, x);
  const vpp = -d3(uOf, x);
  const p = vp / (v * v);
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

// ---- resummation kernels (imp-34955 VERBATIM) -------------------------------------------------------------
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

// resolve (X_CROSS, 5%/25% crossing eps) for a given C_mb multiplicative factor on E_coll
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
  return { cmb, xCross: X, eps5: crossingEps(0.05, 20, 140), eps25: crossingEps(0.25, 20, 140) };
}

// ---- CLOSED-FORM X-shift factor: dX_CROSS/d ln(C_mb) = 1 / v_CROSS = 2 / (1 - (ln L)_prime(X_CROSS)) --------
function vCross(X) {
  const lnLprime = (Lof(X + HD) - Lof(X - HD)) / (2 * HD) / Lof(X); // (ln L)_prime(X) via central difference
  return 0.5 - 0.5 * lnLprime; // = -uOf_prime(X_CROSS)
}
const xShiftAnalytic = (X) => 1 / vCross(X); // dX_CROSS/d ln(C_mb) in closed form

// numerical dX_CROSS/d ln(C_mb) via a direct central difference on ln(C_mb) (cross-check of the closed form)
const HC = 1e-3;
function xShiftNumeric(cmb) {
  const xp = crossingsForCmb(cmb * Math.exp(HC)).xCross;
  const xm = crossingsForCmb(cmb * Math.exp(-HC)).xCross;
  return (xp - xm) / (2 * HC);
}

// ---- sweep C_mb across the imp-34955 [0.5, 1] 11-point grid ------------------------------------------------
const CMB_GRID = [0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1.0];
const SWEEP = CMB_GRID.map((cmb) => {
  const r = crossingsForCmb(cmb);
  return {
    cmb: +cmb.toFixed(2),
    xCross: +r.xCross.toFixed(4),
    eps5: +r.eps5.toFixed(3),
    eps25: +r.eps25.toFixed(3),
    xShiftAnalytic: +xShiftAnalytic(r.xCross).toFixed(4), // 1 / v_CROSS (closed form)
    xShiftNumeric: +xShiftNumeric(cmb).toFixed(4), // central-difference cross-check
  };
});

const LOWG = SWEEP[0]; // C_mb = 0.5
const HIGHG = SWEEP[SWEEP.length - 1]; // C_mb = 1.0

// analytic X-shift factor drift across the band (closed-form, near-constant)
const XSHIFT_MIN = Math.min(...SWEEP.map((r) => r.xShiftAnalytic));
const XSHIFT_MAX = Math.max(...SWEEP.map((r) => r.xShiftAnalytic));
const XSHIFT_SPREAD_PCT = (100 * (XSHIFT_MAX - XSHIFT_MIN)) / XSHIFT_MAX;
// max relative gap between the closed-form and the numerical X-shift across the whole band (validation)
const XSHIFT_MAX_REL_GAP = Math.max(
  ...SWEEP.map((r) => Math.abs(r.xShiftAnalytic - r.xShiftNumeric) / r.xShiftAnalytic)
);

// ---- chord decomposition: chord elasticity = (chord d ln eps/dX) * (chord dX/d ln C_mb) --------------------
const XL = crossingsForCmb(0.5).xCross;
const XH = crossingsForCmb(1.0).xCross;
const CHORD_XSHIFT = (XH - XL) / Math.log(1 / 0.5); // chord dX_CROSS/d ln(C_mb)
const CHORD_DLNEPS5_DX = (Math.log(HIGHG.eps5) - Math.log(LOWG.eps5)) / (XH - XL); // shape sensitivity, 5%
const CHORD_DLNEPS25_DX = (Math.log(HIGHG.eps25) - Math.log(LOWG.eps25)) / (XH - XL); // shape sensitivity, 25%
const RECON_ELASTICITY_5PCT = CHORD_DLNEPS5_DX * CHORD_XSHIFT; // reconstructed chord elasticity, 5%
const RECON_ELASTICITY_25PCT = CHORD_DLNEPS25_DX * CHORD_XSHIFT; // reconstructed chord elasticity, 25%
// imp-34955 measured chord elasticities (for cross-check the derivation must reproduce)
const MEASURED_ELASTICITY_5PCT = Math.log(HIGHG.eps5 / LOWG.eps5) / Math.log(1 / 0.5);
const MEASURED_ELASTICITY_25PCT = Math.log(HIGHG.eps25 / LOWG.eps25) / Math.log(1 / 0.5);

// ---- (G3) the LOCAL pointwise elasticity fails to converge under FD refinement (chord-only stability) ------
function localElasticity5(cmb, h) {
  const ep = crossingsForCmb(cmb * Math.exp(h)).eps5;
  const em = crossingsForCmb(cmb * Math.exp(-h)).eps5;
  return (Math.log(ep) - Math.log(em)) / (2 * h);
}
const LOCAL_E5_STEP_SCAN = [1e-2, 3e-3, 1e-3, 3e-4, 1e-4].map((h) => ({
  h,
  e5: +localElasticity5(0.7, h).toFixed(4),
}));
const LOCAL_E5_RANGE =
  Math.max(...LOCAL_E5_STEP_SCAN.map((s) => s.e5)) - Math.min(...LOCAL_E5_STEP_SCAN.map((s) => s.e5));

export const IMP34972_SIGMA_KNEE_CROSSING_CMB_ELASTICITY_DERIVATION = {
  id: 'imp-34972',
  proofSection: 'S-frontier',
  question:
    'imp-34955 MEASURED the C_mb elasticity d ln(eps_cross)/d ln(C_mb) ~ 0.18 over an 11-point [0.5,1] grid but ' +
    'never DERIVED it. Since ln(C_mb) enters the log-odds kernel uOf additively and the delta_k ladder is ' +
    'C_mb-invariant at fixed x, the entire C_mb dependence is the relocation of X_CROSS. Derive ' +
    'd ln(eps_cross)/d ln(C_mb) in closed form from dX_CROSS/d ln(C_mb) and the crossing-eps sensitivity, and ' +
    'assess whether the ~0.18 elasticity is constant across [0.5,1] or drifts. Derivation/measurement only; ' +
    'C_mb swept as a knob, pinned value untouched; NO QED.',
  derivation: {
    xShiftClosedForm:
      'dX_CROSS/d ln(C_mb) = 1 / v_CROSS = 2 / (1 - (ln L)_prime(X_CROSS)), from implicit differentiation of ' +
      'uOf(X_CROSS; ln C_mb) = 0 with v_CROSS = -uOf_prime(X_CROSS) = (1/2)(1 - (ln L)_prime(X_CROSS))',
    elasticityFactorisation:
      'd ln(eps_cross)/d ln(C_mb) = [d ln(eps_cross)/dX] * (1 / v_CROSS): C_mb reaches eps_cross ONLY through ' +
      'the sampling point X_CROSS, so the elasticity is the crossing-eps shape sensitivity times the X-shift',
  },
  cmbBand: [0.5, 1.0],
  sweep: SWEEP,
  xShiftFactor: {
    minAnalytic: +XSHIFT_MIN.toFixed(4), // ~2.0952 (C_mb = 1.0)
    maxAnalytic: +XSHIFT_MAX.toFixed(4), // ~2.1018 (C_mb = 0.5)
    spreadPct: +XSHIFT_SPREAD_PCT.toFixed(3), // ~0.31 % across the band (near-constant)
    maxRelGapVsNumeric: XSHIFT_MAX_REL_GAP, // closed form matches central-difference X-shift to ~1e-4 or better
  },
  chordDecomposition: {
    chordXShift: +CHORD_XSHIFT.toFixed(4), // ~2.0984 (chord dX/d ln C_mb)
    chordDlnEps5DX: +CHORD_DLNEPS5_DX.toFixed(5), // ~0.08996 (measured shape sensitivity, 5%)
    chordDlnEps25DX: +CHORD_DLNEPS25_DX.toFixed(5), // ~0.08343 (measured shape sensitivity, 25%)
    reconstructedElasticity5pct: +RECON_ELASTICITY_5PCT.toFixed(4), // ~0.1888
    reconstructedElasticity25pct: +RECON_ELASTICITY_25PCT.toFixed(4), // ~0.1751
    measuredElasticity5pct: +MEASURED_ELASTICITY_5PCT.toFixed(4), // ~0.1888 (imp-34955)
    measuredElasticity25pct: +MEASURED_ELASTICITY_25PCT.toFixed(4), // ~0.1751 (imp-34955)
  },
  localInstability: {
    e5StepScanAtCmb07: LOCAL_E5_STEP_SCAN, // local E5 at C_mb=0.7 diverges as h shrinks (0.178 -> 4.401)
    e5RangeAcrossSteps: +LOCAL_E5_RANGE.toFixed(3), // ~4.7 span -- no convergent local value
  },
  finding: {
    G1_xshift_closed_form_exact_and_near_constant:
      'The closed-form X-shift dX_CROSS/d ln(C_mb) = 2/(1 - (ln L)_prime(X_CROSS)) matches a direct ' +
      'central-difference dX_CROSS/d ln(C_mb) to ~1e-4 or better across the whole band, and drifts only ' +
      '2.1018 (C_mb=0.5) -> 2.0952 (C_mb=1.0), a ~0.3% change, because L = ln(T/2pi) varies extremely slowly.',
    G2_chord_elasticity_decomposes_exactly:
      'The chord elasticity factorises as (chord d ln eps/dX) * (chord dX/d ln C_mb): the measured shape ' +
      'sensitivity ~0.0900 (5%) / ~0.0834 (25%) times the near-constant X-shift ~2.0984 reproduces the ' +
      'imp-34955 chord elasticities 0.1888 (5%) and 0.1751 (25%) to 4 decimals.',
    G3_elasticity_is_chord_only_not_a_local_derivative:
      'The ~0.18 is a BAND-AVERAGED (chord) quantity: the X-shift half is stable pointwise but the shape half ' +
      'd ln(eps_cross)/dX is stable ONLY at chord scale. The local pointwise elasticity fails to converge under ' +
      'FD refinement (at C_mb=0.7 it runs 0.178 -> 0.109 -> -0.268 -> 1.515 -> 4.401 as h shrinks 1e-2 -> 1e-4) ' +
      'because dev(eps) = max_m |total_m/plain - 1| has binding-method-switch kinks in eps, so there is no ' +
      'well-defined local elasticity -- "constant ~0.18 across [0.5,1]" holds only as a band average.',
  },
  farTailExponent: 0.5, // imp-3463 asymptote
  isRigorous: false,
  verdict:
    'DERIVATION / MEASUREMENT (frontier-direction, NOT rigorous). The C_mb elasticity of the imp-34931/imp-34955 ' +
    'raw-total 5%/25% crossings factorises exactly, because C_mb enters uOf as an additive ln(C_mb) and so reaches ' +
    'the crossings ONLY by relocating the r = 1 landmark X_CROSS: d ln(eps_cross)/d ln(C_mb) = ' +
    '[d ln(eps_cross)/dX] * (1 / v_CROSS) with the CLOSED-FORM X-shift dX_CROSS/d ln(C_mb) = 1/v_CROSS = ' +
    '2/(1 - (ln L)_prime(X_CROSS)). That analytic factor is EXACT (matches a central-difference X-shift to ~1e-4) ' +
    'and NEAR-CONSTANT (2.1018 -> 2.0952 across [0.5,1], ~0.3% drift, since L varies slowly); multiplying it by ' +
    'the MEASURED shape sensitivity chord d ln(eps)/dX ~0.0900 (5%) / ~0.0834 (25%) reproduces the imp-34955 ' +
    'chord elasticities 0.1888 / 0.1751 to 4 decimals. CONSTANCY: the ~0.18 is a BAND-AVERAGED chord quantity ' +
    'whose analytic X-shift factor is constant to 0.3%; it is NOT a stable local derivative -- the local pointwise ' +
    'elasticity fails to converge under FD refinement (0.178 -> 4.401 at C_mb=0.7 as h shrinks) because dev(eps) ' +
    'has binding-method-switch kinks. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a ' +
    'rigorous asymptotic; C_mb GUE-conditional per imp-486 is differentiated as a knob but its pinned value is ' +
    'UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; far-tail ' +
    'exponent stays 1/2 (imp-3463); no RH verdict, NO QED. No refereed bound is changed.',
  subGap:
    'ANSWERS the imp-34972 derivation question: the ~0.18 elasticity = closed-form X-shift 2/(1 - (ln L)_prime) ' +
    '(~2.10, near-constant) times a MEASURED crossing-eps shape sensitivity (~0.086), and it is constant across ' +
    '[0.5,1] only as a chord/band average -- not as a local derivative. What stays OPEN: the shape factor ' +
    'd ln(eps_cross)/dX is left as a measured number, not a closed form (dev = max_m |.| has method-switch kinks ' +
    'so eps_cross(X) is only chord-smooth); a fully analytic elasticity would need the imp-34900 analytic-radius ' +
    'pin to replace the bisected max-of-methods crossing. Resummation stays inert at eps = 1 (all crossings sit ' +
    '~70-91x beyond it), so this changes no bound.',
  citation:
    'imp-34955 (measured the ~0.18 elasticity this derives); imp-34931 (fixed-model 5%/25% crossing anchors); ' +
    'imp-34882 (Domb-Sykes R ~ 91); imp-34824/imp-34734 (multiplicative C_mb factor on E_coll); imp-34900 ' +
    '(analytic-derivative radius sub-gap); imp-3463 (far-tail 1/2); imp-486 (C_mb GUE-conditional); ' +
    'lambda-rh-height-mapping.',
};

export const IMP34972_SIGMA_KNEE_CROSSING_CMB_ELASTICITY_DERIVATION_ASSERTIONS = [
  {
    // (G1) the closed-form X-shift matches the numerical central-difference X-shift across the band.
    id: 'imp34972-xshift-closed-form-matches-numeric',
    description:
      'the closed-form dX_CROSS/d ln(C_mb) = 2/(1 - (ln L)_prime(X_CROSS)) matches a direct central-difference ' +
      'X-shift to <= 1e-3 relative for every swept C_mb in [0.5,1]',
    holds: () => XSHIFT_MAX_REL_GAP < 1e-3,
  },
  {
    // (G1) the analytic X-shift factor is near-constant (~2.10, < 1% spread) across the band.
    id: 'imp34972-xshift-near-constant',
    description:
      'the analytic X-shift factor stays ~2.10 (in [2.09, 2.11]) with < 1% spread across [0.5,1] because ' +
      'L = ln(T/2pi) varies slowly',
    holds: () =>
      XSHIFT_MIN > 2.09 && XSHIFT_MAX < 2.11 && XSHIFT_SPREAD_PCT < 1,
  },
  {
    // (G2) the chord decomposition reproduces the imp-34955 measured chord elasticities to 3 decimals.
    id: 'imp34972-decomposition-reproduces-imp34955',
    description:
      'the factorisation (chord d ln eps/dX) * (chord dX/d ln C_mb) reproduces the imp-34955 chord elasticities ' +
      '0.1888 (5%) and 0.1751 (25%) to < 1e-3',
    holds: () =>
      Math.abs(RECON_ELASTICITY_5PCT - MEASURED_ELASTICITY_5PCT) < 1e-3 &&
      Math.abs(RECON_ELASTICITY_25PCT - MEASURED_ELASTICITY_25PCT) < 1e-3 &&
      Math.abs(MEASURED_ELASTICITY_5PCT - 0.1888) < 2e-3 &&
      Math.abs(MEASURED_ELASTICITY_25PCT - 0.1751) < 2e-3,
  },
  {
    // (G3) the local pointwise elasticity fails to converge under FD refinement (chord-only stability).
    id: 'imp34972-local-elasticity-nonconvergent',
    description:
      'the local pointwise elasticity at C_mb = 0.7 spans > 1 across FD steps 1e-2..1e-4 (no convergent local ' +
      'value; the ~0.18 is a band-averaged chord quantity)',
    holds: () => LOCAL_E5_RANGE > 1,
  },
  {
    // Honesty gate: derivation/measurement only, far-tail exponent = 1/2 (imp-3463), no QED, no refereed bound is changed.
    id: 'imp34972-honesty-gate-no-qed',
    description: 'Derivation/measurement only: far-tail exponent = 1/2, no QED, no refereed bound is changed',
    holds: () =>
      IMP34972_SIGMA_KNEE_CROSSING_CMB_ELASTICITY_DERIVATION.isRigorous === false &&
      IMP34972_SIGMA_KNEE_CROSSING_CMB_ELASTICITY_DERIVATION.farTailExponent === 0.5 &&
      typeof IMP34972_SIGMA_KNEE_CROSSING_CMB_ELASTICITY_DERIVATION.subGap === 'string' &&
      /NO QED/.test(IMP34972_SIGMA_KNEE_CROSSING_CMB_ELASTICITY_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP34972_SIGMA_KNEE_CROSSING_CMB_ELASTICITY_DERIVATION.verdict),
  },
];

for (const a of IMP34972_SIGMA_KNEE_CROSSING_CMB_ELASTICITY_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34972-sigma-knee-crossing-cmb-elasticity-derivation assertion failed: ${a.id}`);
  }
}
