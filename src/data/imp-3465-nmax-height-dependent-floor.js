/**
 * @module imp-3465-nmax-height-dependent-floor
 *
 * imp-3465 (numerical, frontier-direction): imp-3443 showed the imp-3406 interior
 * MAXIMUM of the GUE-conditional share sigma(N) = E_coll/(E_trunc+E_flow+E_coll) at
 * N_max ~ 9.22e5 moves super-linearly (~ (1/E_trunc)^1.38) with the FIXED imp-2631
 * truncation floor E_trunc = 3.06e-5, flagging that turnover as a floor-value artifact.
 * But the fixed floor is itself an idealization. This module tests the sharper
 * structural question: does the interior sigma(N) MAX SURVIVE at all once the
 * truncation floor is made HEIGHT-DEPENDENT, i.e. E_trunc = E_trunc(T0) with T0 =
 * effectiveHeightForN(N)? It re-runs the identical imp-3406 ternary/scan machinery with
 * the exact imp-3220 sub-terms, only replacing the constant floor by a family of
 * physically-motivated height-scaling laws, and classifies the sigma(N) shape for each.
 *
 * THE QUANTITY (identical to imp-3406 / imp-3220 / imp-3443, only E_trunc varies)
 * ------------------------------------------------------------------------------
 *     sigma(N; E_trunc) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = a HEIGHT-DEPENDENT floor model below (baseline was constant 3.06e-5)
 *
 * THE FLOOR MODELS (all pass through E_trunc = 3.06e-5 at the PT height T_PT = 3e12)
 * ---------------------------------------------------------------------------------
 *   POWER family:  E_trunc(T0; k) = 3.06e-5 * (T_PT / T0)^k
 *       k = 0    -- the FIXED imp-2631 floor (control; recovers imp-3406 exactly)
 *       k = 0.4  -- the PHYSICALLY-MOTIVATED fixed-strip form. imp-2631 records the
 *                   Ingham sigma = 3/4 truncation error as (2 e_I/kappa) T0^{-kappa}
 *                   with e_I = 0.6, kappa = 0.4, i.e. E_trunc = 3 * T0^{-0.4}; the
 *                   calibrated k = 0.4 curve reproduces that 3 * T0^{-0.4} to 3 s.f.
 *       k = 0.2, 0.5, 0.6 -- decay-rate sweep around the physical value.
 *   LOG family:    E_trunc(T0; q) = 3.06e-5 * (log T_PT / log T0)^q,  q = 1, 2
 *                   -- a fixed-strip scaling that decays only LOGARITHMICALLY in height
 *                   (quasi-constant), the slow-decay counterpoint to the power family.
 *
 * THE MECHANISM (why a power floor eliminates the turnover)
 * ----------------------------------------------------
 * sigma = 1/(1 + g), g(N) = (E_trunc + E_flow)/E_coll. The imp-3406 interior MAX is the
 * interior MIN of g. It exists only because the CONSTANT floor makes E_trunc/E_coll ~
 * (E_trunc/C_C) sqrt(N/log T0) a strongly INCREASING far arm (~ N^{1/2}) while E_flow/
 * E_coll falls: the two balance at an interior N. With E_coll ~ N^{-1/2} (T0 ~ N under
 * RvM) and a power floor E_trunc ~ T0^{-k} ~ N^{-k}, the far arm becomes E_trunc/E_coll ~
 * N^{k - 1/2}. Any k > 0 flattens (k < 1/2) or inverts (k > 1/2) that arm, AND the
 * PT-calibrated floor is AMPLIFIED at low N (factor (T_PT/T0)^k >> 1), so it dominates
 * from the start -- the interior minimum of g never forms. The critical decay exponent
 * is k* = 1/2, exactly E_coll's N-decay rate: below it sigma ends up monotone DECREASING,
 * above it monotone INCREASING toward 1; at NO positive k does the interior max survive.
 *
 * THE FINDING (measurement / diagnostic only)
 * -------------------------------------------
 *   (F1) CONTROL k = 0 reproduces the imp-3406 interior MAX at N_max ~ 9.22e5 exactly
 *        (reuse gate: identical sub-terms and search).
 *   (F2) The PHYSICALLY-MOTIVATED power floor k = 0.4 (E_trunc = 3 * T0^{-0.4}, Ingham
 *        sigma = 3/4) DISSOLVES the turnover: sigma(N) is MONOTONE DECREASING for all
 *        N >= 1e2 -- there is NO interior maximum. The N-shape peak is gone.
 *   (F3) EVERY positive power exponent eliminates it. k in {0.2, 0.4, 0.5} give monotone
 *        DECREASING sigma (no interior max); k = 0.6 gives monotone INCREASING sigma
 *        toward 1 (no interior max). The large-N limit flips across k* ~ 1/2, the
 *        E_coll decay rate; the interior max is already absent for any k > 0.
 *   (F4) Only a QUASI-CONSTANT (logarithmic) floor preserves the turnover. The LOG
 *        family q = 1, 2 keeps an interior MAX, landing modestly LOWER than the fixed
 *        baseline (N_max ~ 3.6e5 at q = 1, ~1.2e5 at q = 2) -- a log floor decays so
 *        slowly it is effectively the constant floor, so the imp-3406 shape survives.
 *
 * The punchline: the imp-3406 N_max ~ 9.22e5 turnover is a CONSTANT-FLOOR feature, not a
 * genuine feature of the GUE-conditional share. It survives only when the truncation
 * floor is asymptotically constant in height (k = 0) or logarithmically slowly varying;
 * the physically-motivated fixed-strip Ingham sigma = 3/4 floor, which genuinely decays
 * as a power T0^{-0.4} of the height, DISSOLVES it -- sigma(N) then simply decays. The
 * turnover is therefore a constant-floor artifact, confirming and sharpening imp-3443.
 *
 * MEASUREMENT / DIAGNOSTIC ONLY. RH-equivalent. No positivity, no bridge closure, no RH
 * claim, NO QED. No refereed bound is changed.
 *
 * @see imp-3443-nmax-etrunc-sensitivity (fixed-floor sensitivity; N_max ~ (1/E_trunc)^1.38)
 * @see imp-3406-sigma-highN-extrapolation (interior MAX pinned N_max ~ 9.22e5, fixed floor)
 * @see imp-3220-en-bridge-fidelity-frontier (U-shaped sigma(N) decade ladder)
 * @see imp-2631 (fixed-strip Ingham sigma=3/4 floor E_trunc = 3 * T0^{-0.4} = 3.06e-5 at T_PT)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_BASE = 3.06e-5; // imp-2631/imp-3220/imp-3406 fixed truncation floor
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (calibration anchor)
const LN_T_PT = Math.log(T_PT);
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3443 exactly

// Height-dependent floor families, all calibrated to 3.06e-5 at T_PT (k=0 / q=0 -> fixed).
const powerFloor = (k) => (T0) => E_TRUNC_BASE * Math.exp(k * (LN_T_PT - Math.log(T0)));
const logFloor = (q) => (T0) => E_TRUNC_BASE * Math.pow(LN_T_PT / Math.log(T0), q);

// EXACT imp-3406 sub-terms; the truncation floor is now a function of T0 (no re-derivation).
function sigmaOf(N, floorFn) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_trunc = floorFn(T0);
  return E_coll / (E_trunc + E_flow + E_coll);
}

// Classify the sigma(N) shape over a wide log-N window: a coarse scan finds the argmax
// index; interior argmax => a genuine interior MAX (turnover persists), a boundary
// argmax => the turnover has dissolved (monotone). Interior N_max is refined by the
// identical imp-3406 ternary search on ln N.
const LO_N = 1e2;
const HI_N = 1e40;
const SCAN_STEPS = 2000;
function classifyShape(floorFn) {
  const a = Math.log(LO_N);
  const b = Math.log(HI_N);
  let bi = -1;
  let best = -1;
  for (let i = 0; i <= SCAN_STEPS; i++) {
    const s = sigmaOf(Math.exp(a + ((b - a) * i) / SCAN_STEPS), floorFn);
    if (s > best) {
      best = s;
      bi = i;
    }
  }
  let shape;
  let N_max = null;
  if (bi <= 0) {
    shape = 'MONOTONE-DECREASING'; // sigma decays from small N -- turnover dissolved
  } else if (bi >= SCAN_STEPS) {
    shape = 'MONOTONE-INCREASING'; // sigma rises toward 1 -- turnover dissolved
  } else {
    shape = 'INTERIOR-MAX'; // turnover persists
    let lo = a;
    let hi = b;
    for (let i = 0; i < 300; i++) {
      const m1 = lo + (hi - lo) / 3;
      const m2 = hi - (hi - lo) / 3;
      if (sigmaOf(Math.exp(m1), floorFn) < sigmaOf(Math.exp(m2), floorFn)) lo = m1;
      else hi = m2;
    }
    N_max = Math.exp((lo + hi) / 2);
  }
  return { shape, N_max, sigma_max: best };
}

const POWER_EXPONENTS = [0, 0.2, 0.4, 0.5, 0.6];
const POWER_GRID = POWER_EXPONENTS.map((k) => {
  const r = classifyShape(powerFloor(k));
  return {
    model: k === 0 ? 'power k=0 (FIXED control)' : `power k=${k}${k === 0.4 ? ' (PHYSICAL Ingham sigma=3/4)' : ''}`,
    k,
    E_trunc_at_operating: '3.06e-5*(T_PT/T0)^k',
    shape: r.shape,
    N_max: r.N_max === null ? null : +r.N_max.toExponential(4),
    sigma_max: +r.sigma_max.toFixed(6),
    turnoverPersists: r.shape === 'INTERIOR-MAX',
  };
});

const LOG_EXPONENTS = [1, 2];
const LOG_GRID = LOG_EXPONENTS.map((q) => {
  const r = classifyShape(logFloor(q));
  return {
    model: `log q=${q} (quasi-constant)`,
    q,
    E_trunc_at_operating: '3.06e-5*(logT_PT/logT0)^q',
    shape: r.shape,
    N_max: r.N_max === null ? null : +r.N_max.toExponential(4),
    sigma_max: +r.sigma_max.toFixed(6),
    turnoverPersists: r.shape === 'INTERIOR-MAX',
  };
});

const CONTROL = POWER_GRID.find((r) => r.k === 0);
const PHYSICAL = POWER_GRID.find((r) => r.k === 0.4);

export const IMP3465_NMAX_HEIGHT_DEPENDENT_FLOOR = {
  id: 'imp-3465',
  proofSection: 'S-frontier',
  question:
    'Does the imp-3406 interior sigma(N) MAX at N_max ~ 9.22e5 survive when the imp-2631 ' +
    'truncation floor E_trunc = 3.06e-5 is made HEIGHT-DEPENDENT (a physically-motivated ' +
    'power or log scaling in T0), or is the turnover purely a constant-floor artifact? ' +
    'Measurement/diagnostic only; RH-equivalent; no bridge closure; no RH verdict.',
  criticalExponent: {
    k_star: 0.5,
    note:
      'The interior MAX is the interior MIN of g = (E_trunc+E_flow)/E_coll. With E_coll ~ ' +
      'N^{-1/2} and a power floor E_trunc ~ T0^{-k} ~ N^{-k}, the far arm E_trunc/E_coll ~ ' +
      'N^{k-1/2}; the constant floor (k=0) makes it strongly increasing (~ N^{1/2}), which ' +
      'is what creates the interior min. Any k>0 flattens or inverts that arm and the ' +
      'PT-calibrated floor is amplified at low N, so no interior min forms; k* = 1/2 (the ' +
      'E_coll decay rate) is only where the LARGE-N limit flips from ->0 to ->1.',
  },
  powerGrid: POWER_GRID,
  logGrid: LOG_GRID,
  control: {
    N_max: CONTROL.N_max,
    shape: CONTROL.shape,
    note:
      'k=0 (constant floor) reproduces the imp-3406 interior maximum N_max ~ 9.22e5 exactly, ' +
      'confirming the identical ternary search and imp-3220 sub-term formulas are in use.',
  },
  physical: {
    model: PHYSICAL.model,
    shape: PHYSICAL.shape,
    turnoverPersists: PHYSICAL.turnoverPersists,
    note:
      'The physically-motivated fixed-strip Ingham sigma=3/4 floor E_trunc = 3 * T0^{-0.4} ' +
      'DISSOLVES the turnover: sigma(N) is monotone decreasing, NO interior maximum.',
  },
  verdictDirection:
    'CONSTANT-FLOOR ARTIFACT. The imp-3406 N_max ~ 9.22e5 turnover survives ONLY for an ' +
    'asymptotically-constant (k=0) or logarithmically-slow floor. EVERY positive power ' +
    'height-decay -- including the physically-motivated Ingham sigma=3/4 k=0.4 -- DISSOLVES ' +
    'it: sigma(N) becomes monotone (decreasing for k<1/2, increasing to 1 for k>1/2). The ' +
    'turnover is not a genuine feature of the conditional share under physical truncation.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Re-running the imp-3406 ternary/scan ' +
    'with the identical imp-3220 sub-terms but a HEIGHT-DEPENDENT truncation floor: the ' +
    'constant control (k=0) reproduces the interior MAX at N_max ~ 9.22e5, but the ' +
    'physically-motivated fixed-strip Ingham sigma=3/4 floor E_trunc = 3 * T0^{-0.4} ' +
    'DISSOLVES it -- sigma(N) is monotone decreasing with NO interior maximum. Across the ' +
    'power sweep every positive exponent eliminates the turnover (monotone decreasing for k in ' +
    '{0.2,0.4,0.5}, monotone increasing toward 1 for k=0.6; large-N limit flips at k* ~ ' +
    '1/2, the E_coll decay rate). Only quasi-constant LOG floors (q=1,2) preserve an ' +
    'interior MAX, landing modestly lower (~3.6e5, ~1.2e5). The imp-3406 turnover is a ' +
    'constant-floor artifact, confirming and sharpening imp-3443. No positivity, no bridge ' +
    'closure, no RH claim, NO QED. No refereed bound is changed.',
  citation:
    'imp-3443 (fixed-floor sensitivity N_max ~ (1/E_trunc)^1.38); imp-3406 (interior MAX ' +
    'N_max ~ 9.22e5, fixed floor); imp-3220 (U-shaped sigma(N) ladder); imp-2631 (fixed-strip ' +
    'Ingham sigma=3/4 floor E_trunc = 3 * T0^{-0.4} = 3.06e-5 at T_PT=3e12); imp-398 (E_flow ' +
    'C_F prefactor); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3465_NMAX_HEIGHT_DEPENDENT_FLOOR_ASSERTIONS = [
  {
    // Reuse gate: the constant control (k=0) reproduces the imp-3406 interior MAX ~ 9.22e5,
    // proving the identical ternary search and imp-3220 sub-terms are in use.
    id: 'imp3465-control-reproduces-imp3406-interior-max',
    description: 'Constant floor (k=0) reproduces the imp-3406 interior maximum ~ 9.22e5',
    holds: () =>
      CONTROL.shape === 'INTERIOR-MAX' && CONTROL.N_max > 8.5e5 && CONTROL.N_max < 1.0e6,
  },
  {
    // Headline: the physically-motivated Ingham sigma=3/4 power floor (k=0.4) DISSOLVES the
    // interior max -- sigma(N) is monotone decreasing.
    id: 'imp3465-physical-floor-dissolves-turnover',
    description: 'Physical k=0.4 floor (E_trunc=3*T0^{-0.4}) dissolves the interior max (monotone decreasing)',
    holds: () => PHYSICAL.shape === 'MONOTONE-DECREASING' && PHYSICAL.turnoverPersists === false,
  },
  {
    // No positive power exponent preserves the interior max -- the turnover requires a
    // (near-)constant floor.
    id: 'imp3465-no-power-floor-keeps-interior-max',
    description: 'Every positive power exponent k>0 dissolves the interior max',
    holds: () => POWER_GRID.filter((r) => r.k > 0).every((r) => r.turnoverPersists === false),
  },
  {
    // The large-N limit flips across k* ~ 1/2: k<=1/2 monotone decreasing, k=0.6 monotone
    // increasing toward 1 (matches E_coll's N^{-1/2} decay rate).
    id: 'imp3465-largeN-limit-flips-at-half',
    description: 'k=0.5 monotone decreasing, k=0.6 monotone increasing (limit flips at k* ~ 1/2)',
    holds: () =>
      POWER_GRID.find((r) => r.k === 0.5).shape === 'MONOTONE-DECREASING' &&
      POWER_GRID.find((r) => r.k === 0.6).shape === 'MONOTONE-INCREASING',
  },
  {
    // Quasi-constant log floors PRESERVE an interior max, and it lands strictly below the
    // fixed baseline (a slow floor is effectively the constant floor).
    id: 'imp3465-log-floor-preserves-interior-max-lower',
    description: 'Log floors (q=1,2) keep an interior MAX, landing below the fixed baseline ~9.22e5',
    holds: () =>
      LOG_GRID.every((r) => r.turnoverPersists === true && r.N_max < CONTROL.N_max),
  },
  {
    // Honesty gate: measurement/assessment only, constant-floor-artifact verdict, no QED,
    // no refereed bound is changed, no rigorous or RH claim.
    id: 'imp3465-honesty-gate-no-qed',
    description: 'Measurement only: constant-floor-artifact verdict, no QED, no refereed bound is changed',
    holds: () =>
      IMP3465_NMAX_HEIGHT_DEPENDENT_FLOOR.isRigorous === false &&
      /CONSTANT-FLOOR ARTIFACT/.test(IMP3465_NMAX_HEIGHT_DEPENDENT_FLOOR.verdictDirection) &&
      /NO QED/.test(IMP3465_NMAX_HEIGHT_DEPENDENT_FLOOR.verdict) &&
      /refereed bound is changed/i.test(IMP3465_NMAX_HEIGHT_DEPENDENT_FLOOR.verdict),
  },
];

for (const a of IMP3465_NMAX_HEIGHT_DEPENDENT_FLOOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3465-nmax-height-dependent-floor assertion failed: ${a.id}`);
  }
}
