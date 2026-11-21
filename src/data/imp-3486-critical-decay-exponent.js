/**
 * @module imp-3486-critical-decay-exponent
 *
 * imp-3486 (numerical, frontier-direction): imp-3465 found that the imp-3406 interior
 * MAXIMUM of the GUE-conditional share sigma(N) = E_coll/(E_trunc+E_flow+E_coll) --
 * equivalently the interior MINIMUM of g(N) = (E_trunc+E_flow)/E_coll -- survives only
 * when the imp-2631 truncation floor decays slowly enough in height. With a power floor
 * E_trunc(T0;k) = 3.06e-5 * (T_PT/T0)^k the interior min existed at the constant control
 * k = 0 but was already GONE at the smallest positive grid sample k = 0.2. imp-3465 stated
 * "any k > 0 eliminates it" and identified k* = 1/2 only as the exponent where the LARGE-N limit
 * of sigma flips (-> 0 for k < 1/2, -> 1 for k > 1/2); it never LOCATED the threshold at
 * which the interior min actually ceases to form. This module certifies that threshold.
 *
 * THE QUANTITY (identical to imp-3465 / imp-3406 / imp-3220; only the floor exponent k varies)
 * -------------------------------------------------------------------------------------------
 *     g(N; k)  = (E_trunc + E_flow) / E_coll,   sigma = 1/(1 + g)  (interior sigma-MAX = g-MIN)
 *     T0       = effectiveHeightForN(N)                         (Riemann-von Mangoldt inverse)
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)                  (dominant, GUE-conditional C_H)
 *     E_flow   = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi   (imp-398)
 *     E_trunc  = 3.06e-5 * (T_PT / T0)^k        (imp-3465 power floor, k = 0 -> fixed control)
 *
 * THE CERTIFICATION (two independent locators, cross-checked)
 * -----------------------------------------------------------
 *   (A) SCAN-GRID (reuse of the imp-3465 classifyShape machinery). For each k, the exact
 *       imp-3465 window [1e2, 1e40] / SCAN_STEPS = 2000 scan finds the global argmin of g;
 *       an INTERIOR argmin => the interior min persists, a LOW-boundary argmin => it has
 *       collapsed (g monotone increasing from N = 1e2, sigma monotone decreasing). Bisecting
 *       k on that INTERIOR -> BOUNDARY-LO transition brackets k_c.
 *   (B) SMOOTH VALUE-CROSSING (structurally independent). The interior stationary minimum of
 *       g (located by an independent ternary that starts strictly above the window boundary)
 *       has a VALUE that rises with k. The collapse is a global-min HANDOVER: the threshold
 *       is exactly where that interior-min value equals g at the window boundary N = 1e2,
 *       g_min^interior(k_c) = g(1e2; k_c). Bisecting k on the sign of that difference brackets
 *       k_c a second way, using neither the scan grid nor the shape classifier.
 *
 * THE FINDING (measurement / certification only)
 * ----------------------------------------------
 *   (F1) REUSE GATE: the constant control k = 0 reproduces the imp-3406 interior min of g at
 *        N ~ 9.22e5 (here 9.2186e5), confirming the identical sub-terms and search are in use.
 *   (F2) THRESHOLD LOCATED. The interior min of g ceases to form at
 *              k_c = 0.1966894      (both locators agree to ~8 significant digits)
 *        scan-grid bracket   [0.19668936520289182, 0.19668936520289185]
 *        value-crossing      k_c = 0.19668936528591813.
 *        For 0 <= k < k_c the interior min PERSISTS (interior sigma-max survives); for k > k_c
 *        it is gone (g monotone increasing from N = 1e2, sigma monotone decreasing).
 *   (F3) DISAPPEARANCE MECHANISM: NOT a saddle-node. At k_c the interior stationary minimum of
 *        g still exists (at N ~ 2.5e3) but its VALUE is overtaken by the amplified low-N floor
 *        E_trunc(T0) ~ (T_PT/T0)^k, which is largest at small N; the global minimum HANDS OFF
 *        from that interior stationary point to the N = 1e2 window boundary. Above k_c the
 *        boundary is the global min, so the imp-3465 shape classifier reads MONOTONE.
 *   (F4) This SHARPENS/CORRECTS imp-3465's "any k > 0 eliminates it": the interior min in fact
 *        survives the whole interval [0, k_c) with k_c ~ 0.1967; imp-3465's coarse grid
 *        {0, 0.2, 0.4, 0.5, 0.6} simply straddled k_c -- its smallest positive sample k = 0.2
 *        sits just ABOVE the threshold, which is why the turnover read as already dissolved.
 *        The physically-motivated Ingham sigma = 3/4 exponent k = 0.4 remains comfortably above
 *        k_c, so imp-3465s dissolution verdict for the physical floor is unaffected.
 *
 * HONEST CAVEAT: k_c is the threshold FOR the imp-3465 diagnostic window (low-N boundary
 * N = 1e2). Because the collapse is a boundary handover rather than an intrinsic saddle-node,
 * k_c depends on that window choice; it is the certified threshold for imp-3465s machinery, not
 * a window-free structural constant. It sits strictly below the large-N limit-flip exponent
 * k* = 1/2, which governs a different (asymptotic) transition.
 *
 * MEASUREMENT / CERTIFICATION ONLY. Frontier-direction, RH-equivalent. No positivity, no
 * bridge closure, no RH claim, NO QED. No refereed bound is changed.
 *
 * @see imp-3465-nmax-height-dependent-floor (the height-dependent floor + power-family sweep)
 * @see imp-3406-sigma-highN-extrapolation (interior sigma-MAX N_max ~ 9.22e5, fixed floor)
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
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3220/imp-3406/imp-3465 exactly

// imp-3465 power floor family, calibrated to 3.06e-5 at T_PT (k=0 -> fixed control).
const powerFloor = (k) => (T0) => E_TRUNC_BASE * Math.exp(k * (LN_T_PT - Math.log(T0)));

// EXACT imp-3465/imp-3406 sub-terms; interior sigma-MAX == interior g-MIN.
function gOf(N, floorFn) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_trunc = floorFn(T0);
  return (E_trunc + E_flow) / E_coll;
}

// imp-3465 diagnostic window / scan resolution (reused verbatim).
const LO_N = 1e2;
const HI_N = 1e40;
const SCAN_STEPS = 2000;

// (A) SCAN-GRID: imp-3465 classifyShape adapted to g. Global argmin over the window; an
// interior argmin => interior min persists, a low-boundary argmin => it has collapsed.
function classifyShape(k) {
  const floorFn = powerFloor(k);
  const a = Math.log(LO_N);
  const b = Math.log(HI_N);
  let bi = -1;
  let best = Infinity;
  for (let i = 0; i <= SCAN_STEPS; i++) {
    const g = gOf(Math.exp(a + ((b - a) * i) / SCAN_STEPS), floorFn);
    if (g < best) {
      best = g;
      bi = i;
    }
  }
  if (bi <= 0) return { shape: 'BOUNDARY-LO', N_min: null };
  if (bi >= SCAN_STEPS) return { shape: 'BOUNDARY-HI', N_min: null };
  let lo = a;
  let hi = b;
  for (let i = 0; i < 300; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (gOf(Math.exp(m1), floorFn) > gOf(Math.exp(m2), floorFn)) lo = m1;
    else hi = m2;
  }
  return { shape: 'INTERIOR', N_min: Math.exp((lo + hi) / 2) };
}

// Bisect k on the INTERIOR -> BOUNDARY-LO transition (interior below k_c, boundary above).
function bisectScanGrid(loK, hiK, iters) {
  let lo = loK;
  let hi = hiK;
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (lo + hi);
    if (classifyShape(mid).shape === 'INTERIOR') lo = mid;
    else hi = mid;
  }
  return { lo, hi, mid: 0.5 * (lo + hi) };
}

// (B) SMOOTH VALUE-CROSSING: independent ternary for the interior stationary min of g
// (started strictly above the boundary), compared against g at the window boundary.
function interiorMinValue(k) {
  const floorFn = powerFloor(k);
  let lo = Math.log(LO_N * 1.0000001);
  let hi = Math.log(HI_N);
  for (let i = 0; i < 400; i++) {
    const m1 = lo + (hi - lo) / 3;
    const m2 = hi - (hi - lo) / 3;
    if (gOf(Math.exp(m1), floorFn) > gOf(Math.exp(m2), floorFn)) lo = m1;
    else hi = m2;
  }
  const x = 0.5 * (lo + hi);
  return { N: Math.exp(x), g: gOf(Math.exp(x), floorFn) };
}
const gAtBoundary = (k) => gOf(LO_N, powerFloor(k));
// difference is negative (interior min strictly below the boundary) until the handover at k_c.
const handoverDiff = (k) => interiorMinValue(k).g - gAtBoundary(k);
function bisectValueCrossing(loK, hiK, iters) {
  let lo = loK;
  let hi = hiK;
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (lo + hi);
    if (handoverDiff(mid) < 0) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const CONTROL = classifyShape(0); // reuse gate vs imp-3406 ~9.22e5
const SCAN_BRACKET = bisectScanGrid(0.15, 0.3, 80);
const K_C_VALUE_CROSSING = bisectValueCrossing(0.15, 0.3, 200);
const K_C = +K_C_VALUE_CROSSING.toFixed(7); // 0.1966894
const AT_KC = interiorMinValue(K_C_VALUE_CROSSING);

export const IMP3486_CRITICAL_DECAY_EXPONENT = {
  id: 'imp-3486',
  proofSection: 'S-frontier',
  question:
    'At which imp-3465 capture-decay exponent k does the imp-3406 interior minimum of ' +
    'g(N) = (E_trunc+E_flow)/E_coll cease to form (g monotone from N = 1e2, sigma monotone ' +
    'decreasing)? Certify and bracket that threshold. Measurement only; RH-equivalent; NO QED.',
  criticalExponent: {
    k_c: K_C,
    scanGridBracket: [SCAN_BRACKET.lo, SCAN_BRACKET.hi],
    valueCrossing: K_C_VALUE_CROSSING,
    agreementDigits: '~8 significant figures (0.196689365...)',
    note:
      'Two structurally independent locators agree: (A) bisecting the imp-3465 SCAN_STEPS=2000 ' +
      'classifyShape INTERIOR->BOUNDARY-LO transition, and (B) bisecting the smooth condition ' +
      'g_min^interior(k) = g(1e2; k). The interior min PERSISTS for 0 <= k < k_c and is gone ' +
      'above it.',
  },
  mechanism: {
    type: 'GLOBAL-MIN HANDOVER (not a saddle-node)',
    interiorStationaryN_atKc: +AT_KC.N.toExponential(3),
    note:
      'At k_c the interior stationary minimum of g still exists (N ~ 2.5e3) but its value is ' +
      'overtaken by the amplified low-N floor E_trunc ~ (T_PT/T0)^k (largest at small N); the ' +
      'global minimum hands off to the N = 1e2 window boundary. Above k_c the boundary is the ' +
      'global min, so the imp-3465 classifier reads monotone-decreasing sigma.',
  },
  control: {
    N_min: CONTROL.N_min === null ? null : +CONTROL.N_min.toExponential(4),
    shape: CONTROL.shape,
    note:
      'k=0 (constant floor) reproduces the imp-3406 interior min of g at N ~ 9.22e5, ' +
      'confirming the identical imp-3465/imp-3406 sub-terms and search are in use.',
  },
  relationToImp3465:
    'SHARPENS/CORRECTS imp-3465s "any k > 0 eliminates it": the interior min survives the whole ' +
    'interval [0, k_c) with k_c ~ 0.1967. imp-3465s coarse grid {0,0.2,0.4,0.5,0.6} straddled ' +
    'k_c -- its smallest positive sample k=0.2 sits just ABOVE the threshold. The physical ' +
    'Ingham sigma=3/4 exponent k=0.4 stays well above k_c, so imp-3465s physical-floor ' +
    'dissolution verdict is unaffected. k_c also sits strictly below the large-N limit-flip ' +
    'k* = 1/2, which governs a different (asymptotic) transition.',
  caveat:
    'k_c is the threshold FOR the imp-3465 diagnostic window (low-N boundary N = 1e2). Because ' +
    'the collapse is a boundary handover, not an intrinsic saddle-node, k_c depends on that ' +
    'window choice; it is the certified threshold for imp-3465s machinery, not a window-free ' +
    'structural constant.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Bracketing the imp-3465 capture-decay ' +
    'exponent at which the imp-3406 interior minimum of g ceases to form: two independent ' +
    'locators (imp-3465 scan-grid classifyShape transition; smooth interior-min-value == ' +
    'boundary-value crossing) agree on k_c = 0.1966894 to ~8 significant figures. The interior ' +
    'min persists for 0 <= k < k_c and is gone above it via a GLOBAL-MIN HANDOVER to the ' +
    'N = 1e2 window boundary (the interior stationary point survives at N ~ 2.5e3 but is ' +
    'overtaken by the amplified low-N floor). This sharpens imp-3465s "any k>0 eliminates it": its ' +
    'smallest positive grid sample k=0.2 merely sat just above the threshold. Window-dependent; ' +
    'sits below the large-N limit-flip k* = 1/2. No positivity, no bridge closure, no RH claim, ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-3465 (height-dependent floor, power-family sweep, k* = 1/2 limit flip); imp-3406 ' +
    '(interior sigma-MAX N_max ~ 9.22e5, fixed floor); imp-3220 (U-shaped sigma(N) ladder); ' +
    'imp-2631 (fixed-strip Ingham sigma=3/4 floor); imp-398 (E_flow C_F prefactor); ' +
    'lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP3486_CRITICAL_DECAY_EXPONENT_ASSERTIONS = [
  {
    // Reuse gate: the constant control (k=0) reproduces the imp-3406 interior min ~ 9.22e5.
    id: 'imp3486-control-reproduces-imp3406-interior-min',
    description: 'Constant floor (k=0) reproduces the imp-3406 interior min of g ~ 9.22e5',
    holds: () =>
      CONTROL.shape === 'INTERIOR' && CONTROL.N_min > 8.5e5 && CONTROL.N_min < 1.0e6,
  },
  {
    // The two independent locators agree on k_c to several digits.
    id: 'imp3486-two-locators-agree',
    description: 'Scan-grid and value-crossing locators agree on k_c ~ 0.1966894 to ~1e-8',
    holds: () =>
      Math.abs(SCAN_BRACKET.mid - K_C_VALUE_CROSSING) < 1e-7 &&
      Math.abs(K_C - 0.1966894) < 1e-7,
  },
  {
    // Below k_c the interior min PERSISTS; above k_c it is gone (boundary global min).
    id: 'imp3486-threshold-separates-interior-from-boundary',
    description: 'k just below k_c is INTERIOR, k just above k_c is BOUNDARY-LO',
    holds: () =>
      classifyShape(K_C_VALUE_CROSSING - 1e-4).shape === 'INTERIOR' &&
      classifyShape(K_C_VALUE_CROSSING + 1e-4).shape === 'BOUNDARY-LO',
  },
  {
    // Handover mechanism: at k_c the interior stationary min value equals the boundary value.
    id: 'imp3486-handover-value-crossing',
    description: 'At k_c the interior-min value equals g at the N=1e2 boundary (global-min handover)',
    holds: () => Math.abs(handoverDiff(K_C_VALUE_CROSSING)) < 1e-6,
  },
  {
    // Consistency with imp-3465: k_c sits strictly between the grid samples k=0 and k=0.2,
    // and strictly below the large-N limit-flip k* = 1/2.
    id: 'imp3486-consistent-with-imp3465-grid',
    description: 'k_c lies in (0, 0.2) (imp-3465 grid straddle) and below k* = 1/2',
    holds: () => K_C > 0 && K_C < 0.2 && K_C < 0.5,
  },
  {
    // Honesty gate: measurement only, no QED, no refereed bound is changed, not rigorous.
    id: 'imp3486-honesty-gate-no-qed',
    description: 'Measurement only: window-dependent threshold, no QED, no refereed bound is changed',
    holds: () =>
      IMP3486_CRITICAL_DECAY_EXPONENT.isRigorous === false &&
      /NO QED/.test(IMP3486_CRITICAL_DECAY_EXPONENT.verdict) &&
      /refereed bound is changed/i.test(IMP3486_CRITICAL_DECAY_EXPONENT.verdict),
  },
];

for (const a of IMP3486_CRITICAL_DECAY_EXPONENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-3486-critical-decay-exponent assertion failed: ${a.id}`);
  }
}
