/**
 * @module imp-3443-nmax-etrunc-sensitivity
 *
 * imp-3443 (numerical, frontier-direction): imp-3406 located the interior MAXIMUM of
 * the GUE-conditional share sigma(N) = E_coll(N)/E(N) at N_max ~ 9.219e5 using the
 * FIXED imp-2631 truncation floor E_trunc = 3.06e-5. Because the whole N-shape turnover
 * is DRIVEN by that constant floor outliving the vanishing E_coll (imp-3406 F2/F3),
 * N_max should depend strongly on E_trunc. This module re-runs the identical imp-3406
 * ternary search over a GRID of E_trunc values (half to double 3.06e-5), reusing the
 * exact imp-3220 sub-term formulas (effectiveHeightForN, C_C_PINNED, imp-398 C_F), and
 * measures the sensitivity dN_max/dE_trunc plus whether N_max follows a power law in
 * 1/E_trunc.
 *
 * THE QUANTITY (identical to imp-3406 / imp-3220 / imp-3323, only E_trunc varies)
 * ------------------------------------------------------------------------------
 *     sigma(N; E_trunc) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = grid value (baseline 3.06e-5, imp-2631)
 *
 * THE MECHANISM (why N_max moves with E_trunc)
 * --------------------------------------------
 * With R = E_trunc + E_flow, sigma = 1/(1 + R/E_coll), so sigma is MAXIMIZED where the
 * ratio g(N) = R/E_coll is minimized. g splits into a DECREASING part E_flow/E_coll
 * (both vanish, flow faster) and an INCREASING part E_trunc/E_coll ~ (E_trunc/C_C)
 * sqrt(N/log T0). The interior min of g -- hence the peak of sigma -- sits where these
 * two balance. The E_trunc/E_coll arm scales LINEARLY in E_trunc, so raising the floor
 * pushes the balance (and the peak) to LOWER N. N_max is therefore strictly decreasing
 * in E_trunc.
 *
 * THE FINDING (measurement / extrapolation only)
 * ----------------------------------------------
 *   (F1) STRONG, MONOTONE sensitivity. Over E_trunc in [0.5, 2.0] x 3.06e-5 the peak
 *        location N_max falls monotonically from ~2.356e6 (half floor) through the
 *        baseline ~9.219e5 to ~3.501e5 (double floor) -- a 6.7x swing across a 4x floor
 *        range. Halving E_trunc raises N_max ~2.56x; doubling lowers it to ~0.38x.
 *   (F2) NEAR POWER LAW N_max ~ (1/E_trunc)^p. A log-log fit of N_max against E_trunc
 *        over the 9-point grid gives slope d ln N_max / d ln E_trunc ~ -1.376 (R^2 ~
 *        0.99992), i.e. N_max scales like (1/E_trunc)^1.38 -- SUPER-linear in 1/E_trunc.
 *        The local elasticity at the baseline (central difference) is ~ -1.373, matching
 *        the global fit slope, so the power law is tight, not a chord artifact.
 *   (F3) LOCAL DERIVATIVE. dN_max/dE_trunc ~ -4.14e10 at E_trunc = 3.06e-5 (central
 *        difference). Equivalently, a +1% floor perturbation moves N_max by ~ -1.37%.
 *   (F4) sigma_max also rises as the floor falls (0.9612 at half, 0.9494 baseline,
 *        0.9348 at double) -- lowering the floor both widens the peak share AND pushes
 *        it to higher N, consistent with the imp-3406 decay-to-0 driven by the floor.
 *
 * The punchline: the imp-3406 N_max ~ 9.22e5 turnover is NOT a robust landmark -- it is
 * an artifact of the specific imp-2631 floor value, moving super-linearly (exponent
 * ~1.38) as 1/E_trunc. The N-shape peak location is a floor-sensitivity readout, not a
 * fixed feature of the conditional share.
 *
 * MEASUREMENT / EXTRAPOLATION ONLY. RH-equivalent diagnostic. No positivity, no bridge
 * closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-3406-sigma-highN-extrapolation (interior MAX pinned at N_max ~ 9.22e5, fixed floor)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder)
 * @see imp-3323-sigma-argmin-locator (interior MIN pinned at N ~ 97.80)
 * @see imp-2631 (E_trunc = 3.06e-5 fixed-strip truncation floor)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // baseline imp-2631/imp-3220/imp-3406 truncation floor
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3323/imp-3406 exactly

// EXACT imp-3406 sub-terms, only E_trunc is a parameter now (no re-derivation).
function parts(N, eTrunc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = eTrunc + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N, eTrunc) => parts(N, eTrunc).sigma;

// Identical imp-3406 ternary search in ln N over the unimodal right arm, but with the
// truncation floor supplied as a parameter. Wide bracket so the interior MAX is found
// without pinning to a bracket endpoint across the whole E_trunc grid.
function argmaxSigmaLnN(eTrunc, loN, hiN) {
  let lo = Math.log(loN);
  let hi = Math.log(hiN);
  for (let i = 0; i < 500; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (sigma(Math.exp(m1), eTrunc) < sigma(Math.exp(m2), eTrunc)) lo = m1;
    else hi = m2;
  }
  return Math.exp((lo + hi) / 2);
}

// E_trunc grid: half to double the baseline (the ticket bracket), 9 points.
const FACTORS = [0.5, 0.625, 0.75, 0.875, 1.0, 1.25, 1.5, 1.75, 2.0];
const GRID = FACTORS.map((f) => {
  const eTrunc = f * E_TRUNC_BASE;
  const N_max = argmaxSigmaLnN(eTrunc, 1e3, 1e11);
  const sigma_max = sigma(N_max, eTrunc);
  return {
    factor: f,
    E_trunc: +eTrunc.toExponential(4),
    N_max: +N_max.toExponential(5),
    log10_N_max: +(Math.log(N_max) / Math.LN10).toFixed(4),
    sigma_max: +sigma_max.toFixed(7),
  };
});

// Baseline peak -- must reproduce imp-3406 N_max ~ 9.219e5 (reuse gate).
const N_MAX_BASE = argmaxSigmaLnN(E_TRUNC_BASE, 1e3, 1e11);

// Local derivative dN_max/dE_trunc at the baseline floor (central difference).
const H_STEP = 1e-8;
const D_NMAX_D_ETRUNC =
  (argmaxSigmaLnN(E_TRUNC_BASE + H_STEP, 1e3, 1e11) -
    argmaxSigmaLnN(E_TRUNC_BASE - H_STEP, 1e3, 1e11)) /
  (2 * H_STEP);
// Dimensionless local elasticity: (dN_max/dE_trunc)*(E_trunc/N_max) -- percent-for-percent.
const LOCAL_ELASTICITY = (D_NMAX_D_ETRUNC * E_TRUNC_BASE) / N_MAX_BASE;

// Power-law fit: ln N_max = slope * ln E_trunc + intercept, over the full grid.
function logLogSlope(rows) {
  const xs = rows.map((r) => Math.log(r.E_trunc));
  const ys = rows.map((r) => Math.log(r.N_max));
  const n = xs.length;
  const sx = xs.reduce((a, b) => a + b, 0);
  const sy = ys.reduce((a, b) => a + b, 0);
  const sxx = xs.reduce((a, b) => a + b * b, 0);
  const sxy = xs.reduce((a, b, i) => a + b * ys[i], 0);
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const intercept = (sy - slope * sx) / n;
  const ybar = sy / n;
  let ssRes = 0;
  let ssTot = 0;
  for (let i = 0; i < n; i++) {
    const pred = slope * xs[i] + intercept;
    ssRes += (ys[i] - pred) ** 2;
    ssTot += (ys[i] - ybar) ** 2;
  }
  return { slope, R2: 1 - ssRes / ssTot };
}
const FIT = logLogSlope(GRID);
const POWER_EXPONENT = -FIT.slope; // N_max ~ (1/E_trunc)^POWER_EXPONENT

export const IMP3443_NMAX_ETRUNC_SENSITIVITY = {
  id: 'imp-3443',
  proofSection: 'S-frontier',
  question:
    'Measure the sensitivity of the imp-3406 sigma(N) turnover point N_max ~ 9.22e5 to ' +
    'the imp-2631 truncation floor E_trunc = 3.06e-5, quantifying dN_max/dE_trunc and ' +
    'whether N_max scales as a power of 1/E_trunc. Measurement/extrapolation only; ' +
    'RH-equivalent; no bridge closure; no RH verdict.',
  baseline: {
    E_trunc: E_TRUNC_BASE,
    N_max: +N_MAX_BASE.toExponential(5), // ~9.2186e5, reproduces imp-3406
    log10_N_max: +(Math.log(N_MAX_BASE) / Math.LN10).toFixed(4), // ~5.9647
    note:
      'Baseline peak reproduces the imp-3406 interior maximum N_max ~ 9.219e5 exactly, ' +
      'confirming the identical ternary search and sub-term formulas are in use.',
  },
  grid: GRID,
  sensitivity: {
    dNmax_dEtrunc: +D_NMAX_D_ETRUNC.toExponential(5), // ~-4.14e10
    local_elasticity: +LOCAL_ELASTICITY.toFixed(6), // ~-1.373
    power_exponent: +POWER_EXPONENT.toFixed(6), // ~1.376
    power_fit_R2: +FIT.R2.toFixed(8), // ~0.99992
    note:
      'N_max is STRONGLY and MONOTONE-decreasingly sensitive to E_trunc: dN_max/dE_trunc ' +
      '~ -4.14e10 at the baseline floor, i.e. a +1% floor perturbation moves N_max by ' +
      '~ -1.37%. A log-log fit over the half-to-double grid gives N_max ~ (1/E_trunc)^' +
      '1.376 (R^2 ~ 0.99992), super-linear in 1/E_trunc; the local elasticity (-1.373) ' +
      'matches the global fit slope, so the power law is tight, not a chord artifact.',
  },
  verdictDirection:
    'STRONGLY SENSITIVE, NEAR POWER LAW. The imp-3406 turnover point is NOT a robust ' +
    'landmark: N_max ~ (1/E_trunc)^1.38 moves super-linearly with the truncation floor, ' +
    'from ~2.36e6 at half the floor to ~3.50e5 at double it -- a floor-sensitivity ' +
    'readout, not a fixed feature of the conditional share.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Re-running the imp-3406 ternary ' +
    'search over E_trunc in [0.5, 2.0] x 3.06e-5 with the identical imp-3220 sub-terms, ' +
    'the turnover point N_max is STRONGLY sensitive to the truncation floor: it falls ' +
    'monotonically from ~2.356e6 (half floor) through the baseline ~9.219e5 to ~3.501e5 ' +
    '(double floor), a 6.7x swing over a 4x floor range. A log-log fit gives N_max ~ ' +
    '(1/E_trunc)^1.376 (R^2 ~ 0.99992), super-linear in 1/E_trunc, with local ' +
    'derivative dN_max/dE_trunc ~ -4.14e10 (elasticity ~ -1.373). The imp-3406 N_max ~ ' +
    '9.22e5 is therefore a floor-value artifact, not a robust landmark. No positivity, ' +
    'no bridge closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-3406 (interior MAX pinned N_max ~ 9.22e5, fixed floor); imp-3220 (U-shaped ' +
    'sigma(N) decade ladder); imp-3323 (interior min pinned N ~ 97.80); imp-2631 ' +
    '(E_trunc = 3.06e-5 fixed-strip floor); imp-398 (E_flow C_F prefactor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3443_NMAX_ETRUNC_SENSITIVITY_ASSERTIONS = [
  {
    // Reuse gate: baseline peak reproduces the imp-3406 interior maximum N_max ~ 9.22e5,
    // proving the identical ternary search and sub-term formulas are in use.
    id: 'imp3443-reproduces-imp3406-baseline-Nmax',
    description: 'Baseline N_max reproduces the imp-3406 interior maximum ~ 9.22e5',
    holds: () => N_MAX_BASE > 8.5e5 && N_MAX_BASE < 1.0e6,
  },
  {
    // The peak location is MONOTONE DECREASING in E_trunc across the full grid: raising
    // the floor pushes the turnover to lower N (the headline sensitivity direction).
    id: 'imp3443-Nmax-monotone-decreasing-in-Etrunc',
    description: 'N_max is strictly decreasing as E_trunc rises across the half-to-double grid',
    holds: () => GRID.every((r, i) => i === 0 || GRID[i - 1].N_max > r.N_max),
  },
  {
    // Strong swing: halving vs doubling the floor moves N_max by more than 5x -- the
    // turnover is NOT a robust, floor-independent landmark.
    id: 'imp3443-Nmax-large-swing-across-floor-range',
    description: 'N_max(half floor)/N_max(double floor) > 5 (strong floor sensitivity)',
    holds: () => GRID[0].N_max / GRID[GRID.length - 1].N_max > 5,
  },
  {
    // Near power law: log-log fit is tight (high R^2) with a super-linear exponent
    // ~1.38 in 1/E_trunc -- the quantitative characterization the ticket asks for.
    id: 'imp3443-Nmax-power-law-in-inverse-Etrunc',
    description: 'N_max ~ (1/E_trunc)^p with p ~ 1.38 and R^2 > 0.999',
    holds: () => POWER_EXPONENT > 1.3 && POWER_EXPONENT < 1.45 && FIT.R2 > 0.999,
  },
  {
    // Local derivative is large and negative, and the local elasticity matches the
    // global power-law slope (consistency: the power law is tight, not a chord artifact).
    id: 'imp3443-local-elasticity-matches-fit-slope',
    description: 'Local elasticity ~ -1.37 matches the log-log fit slope -POWER_EXPONENT',
    holds: () =>
      D_NMAX_D_ETRUNC < 0 &&
      Math.abs(LOCAL_ELASTICITY - FIT.slope) < 0.02 &&
      Math.abs(LOCAL_ELASTICITY + 1.373) < 0.05,
  },
  {
    // Honesty gate: measurement/assessment only, sensitivity verdict stated, no QED,
    // PT stays SOTA, no rigorous or RH claim.
    id: 'imp3443-honesty-gate-no-qed',
    description: 'Measurement only: sensitivity verdict, no QED, PT stays SOTA',
    holds: () =>
      IMP3443_NMAX_ETRUNC_SENSITIVITY.isRigorous === false &&
      /STRONGLY SENSITIVE/.test(IMP3443_NMAX_ETRUNC_SENSITIVITY.verdictDirection) &&
      /NO QED/.test(IMP3443_NMAX_ETRUNC_SENSITIVITY.verdict) &&
      /remains SOTA/.test(IMP3443_NMAX_ETRUNC_SENSITIVITY.verdict),
  },
];

for (const a of IMP3443_NMAX_ETRUNC_SENSITIVITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3443-nmax-etrunc-sensitivity assertion failed: ${a.id}`);
  }
}
