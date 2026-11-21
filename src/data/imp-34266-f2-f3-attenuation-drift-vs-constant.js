/**
 * @module imp-34266-f2-f3-attenuation-drift-vs-constant
 *
 * imp-34266 (numerical, frontier-direction): imp-34023 fit the imp-33969 F4 collapse (log-linear,
 * per-unit factor exp(b) ~ 0.359, R^2 ~ 0.99942) but only NOTED its two companion attenuation factors
 * F2 (per-unit factor ~0.9739) and F3 (~0.9907) as "near-flat" over the narrow kEnd=11..13 anchor window,
 * asserting without fitting that they "approach constants" while F4 alone drives the divergence of the
 * over-prediction ratio 1/(F2*F3*F4). imp-34133 later fit F2, F3 to a constant-plus-decay form on the
 * EXTENDED sign-stable ladder (kEnd=13..21) and confirmed both saturate. This module supplies the piece
 * neither did: it fits F2, F3 on the ANCHOR window AND the extended ladder side by side, and asks the
 * ticket-precise question -- as the fit boundary recedes toward the imp-33773 M2 residual sign-change
 * ceiling at kEnd* ~ 21.28, do the near-flat anchor factors STAY at their anchor value (a true constant)
 * or DRIFT toward a different limit, and does either factor MATERIALLY move?
 *
 * THE ANCHOR-vs-EXTENDED PER-UNIT DRIFT (the near-flat anchor factors are NOT their asymptote)
 * -----------------------------------------------------------------------------------------
 *   A log-linear OLS of the per-unit decay factor exp(b) over the two boundary spans (head fixed at k=6,
 *   same inherited imp-3406/imp-33810 sub-terms):
 *     F2: anchor (kEnd=11..13) per-unit ~0.9739 (R^2 ~0.918)  ->  extended (kEnd=13..21) per-unit ~0.9995
 *         (R^2 ~0.51, i.e. essentially flat). F2 relaxes toward per-unit 1.0 fast.
 *     F3: anchor per-unit ~0.9907 (R^2 ~0.998)  ->  extended per-unit ~0.9952 (R^2 ~0.983). F3 relaxes
 *         toward 1.0 more slowly and is still measurably below 1 at the ceiling.
 *   So the imp-34023 near-flat anchor per-unit factors are NOT the asymptotic values -- both DRIFT upward
 *   toward per-unit 1.0 as the boundary recedes, F2 much faster than F3.
 *
 * DOES EITHER FACTOR MATERIALLY MOVE (local per-unit factor -> 1 and the convergence gap at the ceiling)
 * --------------------------------------------------------------------------------------------------
 *   Tracking the LOCAL per-unit factor across the full sign-stable ladder kEnd=11..21:
 *     F2 local per-unit climbs 0.9492 (kEnd~11) -> 0.999999 (kEnd~21) -- F2 has effectively CONVERGED to a
 *        constant; its constant-plus-decay asymptote c ~ 0.05948 sits within ~0.025% of the kEnd=21 value.
 *     F3 local per-unit climbs 0.9895 (kEnd~11) -> 0.9969 (kEnd~21) -- still short of 1, so F3 is STILL
 *        SLOWLY DRIFTING; its constant-plus-decay asymptote c ~ 0.835 (r ~ 0.122, R^2 ~ 0.99997) sits ~2.2%
 *        BELOW the kEnd=21 value, i.e. F3 has NOT reached its constant within the sign-stable region.
 *   Absolute movement across kEnd 11 -> 21: F2 x0.9395, F3 x0.9435 -- both NEAR-FLAT next to F4 (x4.2e-6
 *   over the same span). So relative to F4 NEITHER factor materially moves (confirming imp-34023 /
 *   imp-34133 that F4 alone drives the divergence); but between the two, F2 genuinely settles onto its
 *   constant while F3 keeps drifting slowly right up to the ceiling.
 *
 * The punchline: the imp-34023 "near-flat, approach constants" reading is correct only in the coarse sense
 * that both F2, F3 are dwarfed by the F4 collapse; the finer answer is that F2 CONVERGES to a constant
 * (~0.0595) well inside the sign-stable region while F3 SLOWLY DRIFTS toward its constant (~0.835) and has
 * not arrived by the ceiling, so the anchor-window per-unit factors under-state both limits.
 *
 * NUMERICAL / MEASUREMENT ONLY. Curve fit of an inherited surrogate ratio, NOT an RH bound. The inherited
 * imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the anchor/extended fits are descriptive
 * within that model only; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34023-eflow-widening-ratio-f4-collapse-extrapolation (the F4 collapse + the near-flat F2, F3
 *   assertion this module fits on the anchor window and the extended ladder; same sub-terms, head at k=6)
 * @see imp-34133-f2-f3-asymptotic-constant-fit (the extended-ladder constant-plus-decay fit refined here
 *   with the anchor-window comparison and the material-movement / convergence-gap quantification)
 * @see imp-34208-f3-asymptote-analytic-crosscheck (independent cross-check of the slow F3 asymptote)
 * @see imp-34209-f3-fit-stability-extended-ladder (stability of the F3 fit as rungs are added)
 * @see imp-33773 (the M2 residual whose sign change at kEnd ~ 21.28 caps the sign-stable ladder)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-34023/imp-34133 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-34023/imp-34133 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  return { k, E_N: ph.E_N, resid, sflow };
}
const HEAD = rung(6); // fixed head, exactly as imp-34023/imp-34133

// Per-boundary companion attenuation factors (head fixed at k=6), same identity as imp-34023.
function factors(kEnd) {
  const TAIL = rung(kEnd);
  return {
    kEnd,
    F2: TAIL.E_N / HEAD.E_N, // normaliser collapse
    F3: HEAD.sflow / TAIL.sflow, // E_flow log-slope ratio
    F4: TAIL.resid / HEAD.resid, // imp-33773 residual ratio (the driver)
    resid: TAIL.resid,
  };
}

function logLinearFit(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  const R2 = (sxy * sxy) / (sxx * syy);
  return { a, b, perUnit: Math.exp(b), R2 };
}

// constant-plus-decay F(k) = c + A*exp(-r*k): grid-search c, log-linear on ln(F - c), keep max-R^2.
function fitConstPlusDecay(pts) {
  const vals = pts.map((p) => p.val);
  const minV = Math.min(...vals);
  let best = null;
  const STEPS = 20000;
  for (let i = 1; i < STEPS; i++) {
    const c = minV * (i / STEPS); // c in (0, minV)
    const f = logLinearFit(
      pts.map((p) => p.kEnd),
      pts.map((p) => Math.log(p.val - c)),
    );
    if (!best || f.R2 > best.R2) best = { c, r: -f.b, R2: f.R2 };
  }
  return best;
}

// Anchor window (imp-34023): kEnd = 11.00..13.00 step 0.25.
const ANCHOR_KENDS = [];
for (let k = 11; k <= 13 + 1e-9; k += 0.25) ANCHOR_KENDS.push(+k.toFixed(2));
const ANCHOR = ANCHOR_KENDS.map(factors);
const F2_ANCHOR = logLinearFit(ANCHOR_KENDS, ANCHOR.map((r) => Math.log(r.F2)));
const F3_ANCHOR = logLinearFit(ANCHOR_KENDS, ANCHOR.map((r) => Math.log(r.F3)));

// Extended sign-stable ladder (imp-34133): kEnd = 13.00..21.00 step 0.5.
const EXT_KENDS = [];
for (let k = 13; k <= 21 + 1e-9; k += 0.5) EXT_KENDS.push(+k.toFixed(2));
const EXT = EXT_KENDS.map(factors);
const F2_EXT = logLinearFit(EXT_KENDS, EXT.map((r) => Math.log(r.F2)));
const F3_EXT = logLinearFit(EXT_KENDS, EXT.map((r) => Math.log(r.F3)));
const F2_CPD = fitConstPlusDecay(EXT.map((r) => ({ kEnd: r.kEnd, val: r.F2 })));
const F3_CPD = fitConstPlusDecay(EXT.map((r) => ({ kEnd: r.kEnd, val: r.F3 })));

// Material movement across the full sign-stable span kEnd = 11 -> 21.
const F_LO = factors(11);
const F_HI = factors(21);
const F2_MOVE = F_HI.F2 / F_LO.F2; // ~0.9395
const F3_MOVE = F_HI.F3 / F_LO.F3; // ~0.9435
const F4_MOVE = F_HI.F4 / F_LO.F4; // ~4.2e-6 (the driver, for scale)

// Local per-unit factor at the two ends of the sign-stable ladder (converged vs still drifting).
function localPerUnit(kA, kB, pick) {
  const a = pick(factors(kA));
  const b = pick(factors(kB));
  return Math.pow(b / a, 1 / (kB - kA));
}
const F2_LOCAL_LOW = localPerUnit(11, 11.5, (f) => f.F2); // ~0.949
const F2_LOCAL_HIGH = localPerUnit(20.5, 21, (f) => f.F2); // ~1.000000 (converged)
const F3_LOCAL_LOW = localPerUnit(11, 11.5, (f) => f.F3); // ~0.9895
const F3_LOCAL_HIGH = localPerUnit(20.5, 21, (f) => f.F3); // ~0.9969 (still < 1, drifting)

// Convergence gap at the ceiling: how far the kEnd=21 value sits from the fitted asymptote c.
const F2_GAP_PCT = (100 * (F_HI.F2 - F2_CPD.c)) / F_HI.F2; // ~0.03% -> converged
const F3_GAP_PCT = (100 * (F_HI.F3 - F3_CPD.c)) / F_HI.F3; // ~2.2% -> still drifting

export const IMP34266_F2_F3_ATTENUATION_DRIFT_VS_CONSTANT = {
  id: 'imp-34266',
  proofSection: 'S-frontier',
  question:
    'imp-34023 fit the F4 collapse (per-unit ~0.359) but only NOTED F2 (~0.9739) and F3 (~0.9907) as ' +
    'near-flat over the kEnd=11..13 anchor window, never asking whether they converge to constants or ' +
    'drift slowly as the fit boundary recedes toward the sign-stable ceiling kEnd* ~ 21.28. Fit F2(kEnd) ' +
    'and F3(kEnd) on the anchor window AND the extended ladder, and report whether either factor ' +
    'materially moves. Numerical/measurement only; inherited component model; no bound change; NO QED.',
  measuredQuantity:
    'Log-linear per-unit decay factor of F2, F3 on the anchor window (kEnd=11..13 step 0.25) vs the ' +
    'extended sign-stable ladder (kEnd=13..21 step 0.5); a constant-plus-decay fit F(k)=c+A*exp(-r*k) on ' +
    'the extended ladder; the absolute movement of F2, F3, F4 across kEnd=11->21; the local per-unit ' +
    'factor at the two ends of the ladder; and the convergence gap between the kEnd=21 value and the ' +
    'fitted asymptote c (head fixed at k=6; inherited imp-3406/imp-33810 sub-terms verbatim).',
  anchorWindowFit: {
    span: 'kEnd=11.00..13.00 step 0.25 (9 windows)',
    F2_perUnit: +F2_ANCHOR.perUnit.toFixed(6), // ~0.9739 (reproduces imp-34023)
    F2_R2: +F2_ANCHOR.R2.toFixed(6),
    F3_perUnit: +F3_ANCHOR.perUnit.toFixed(6), // ~0.9907 (reproduces imp-34023)
    F3_R2: +F3_ANCHOR.R2.toFixed(6),
  },
  extendedLadderFit: {
    span: 'kEnd=13.00..21.00 step 0.5 (17 rungs)',
    F2_perUnit: +F2_EXT.perUnit.toFixed(6), // ~0.9995 (essentially flat, R2 low)
    F2_R2: +F2_EXT.R2.toFixed(6),
    F3_perUnit: +F3_EXT.perUnit.toFixed(6), // ~0.9952 (still below 1)
    F3_R2: +F3_EXT.R2.toFixed(6),
  },
  constantPlusDecayFit: {
    form: 'F(kEnd) = c + A*exp(-r*kEnd) on the extended sign-stable ladder',
    F2_asymptote_c: +F2_CPD.c.toFixed(6), // ~0.05948
    F2_decayRate_r: +F2_CPD.r.toFixed(4),
    F3_asymptote_c: +F3_CPD.c.toFixed(6), // ~0.835 (matches imp-34133)
    F3_decayRate_r: +F3_CPD.r.toFixed(4), // ~0.122 (slow)
    F3_R2: +F3_CPD.R2.toFixed(6),
  },
  materialMovement: {
    span: 'kEnd=11 -> 21 (full sign-stable region)',
    F2_ratio: +F2_MOVE.toFixed(4), // ~0.9395
    F3_ratio: +F3_MOVE.toFixed(4), // ~0.9435
    F4_ratio: +F4_MOVE.toExponential(3), // ~4.2e-6 (the driver, for scale)
    F2_local_perUnit_low: +F2_LOCAL_LOW.toFixed(6), // ~0.949
    F2_local_perUnit_high: +F2_LOCAL_HIGH.toFixed(6), // ~1.000000 (converged)
    F3_local_perUnit_low: +F3_LOCAL_LOW.toFixed(6), // ~0.9895
    F3_local_perUnit_high: +F3_LOCAL_HIGH.toFixed(6), // ~0.9969 (still drifting)
    F2_gap_to_asymptote_pct: +F2_GAP_PCT.toFixed(3), // ~0.025% -> converged
    F3_gap_to_asymptote_pct: +F3_GAP_PCT.toFixed(3), // ~2.2% -> still drifting
  },
  finding: {
    anchor_factors_drift_toward_one:
      'The imp-34023 near-flat anchor per-unit factors are NOT the asymptotic values: both DRIFT upward ' +
      'toward per-unit 1.0 as the boundary recedes -- F2 from ~0.9739 (anchor) to ~0.9995 (extended), F3 ' +
      'from ~0.9907 to ~0.9952, F2 much faster than F3.',
    F2_converges:
      'F2 has effectively CONVERGED to a constant well inside the sign-stable region: its local per-unit ' +
      'factor climbs to ~1.000000 by kEnd~21 and its kEnd=21 value sits within ~0.03% of the fitted ' +
      'asymptote c ~ 0.05948.',
    F3_slowly_drifts:
      'F3 is STILL SLOWLY DRIFTING at the ceiling: its local per-unit factor is only ~0.9969 (< 1) at ' +
      'kEnd~21 and its value sits ~2.2% above the fitted asymptote c ~ 0.835 (r ~ 0.122), so F3 has NOT ' +
      'reached its constant within the sign-stable region.',
    neither_materially_moves_vs_F4:
      'Across kEnd=11->21 F2 moves x0.9395 and F3 x0.9435 -- both NEAR-FLAT next to F4 (x4.2e-6), so ' +
      'relative to F4 NEITHER factor materially moves, confirming imp-34023/imp-34133 that F4 alone ' +
      'drives the divergence of 1/(F2*F3*F4).',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / MEASUREMENT (frontier-direction, NOT rigorous). Fitting F2(kEnd) and F3(kEnd) on the ' +
    'imp-34023 anchor window (kEnd=11..13) AND the extended sign-stable ladder (kEnd=13..21, head fixed ' +
    'at k=6, inherited imp-3406/imp-33810 sub-terms) shows: (1) the near-flat anchor per-unit factors are ' +
    'NOT the asymptote -- both DRIFT toward per-unit 1.0 as the boundary recedes (F2 ~0.9739->~0.9995, ' +
    'F3 ~0.9907->~0.9952); (2) F2 CONVERGES to a constant (~0.05948) well inside the sign-stable region ' +
    '(local per-unit ~1.000000 and within ~0.03% of the asymptote at kEnd=21); (3) F3 SLOWLY DRIFTS -- ' +
    'its local per-unit factor is still ~0.9969 (< 1) and its value ~2.2% above the fitted asymptote ' +
    'c ~ 0.835 (r ~ 0.122) at the ceiling, so it has NOT converged; (4) relative to F4 (x4.2e-6 over ' +
    'kEnd=11->21) NEITHER factor materially moves (F2 x0.9395, F3 x0.9435), confirming F4 as the sole ' +
    'divergence driver. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; ' +
    'the fits are descriptive within the model only; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34023 (the F4 collapse fit + the near-flat F2, F3 assertion refined here); imp-34133 (the ' +
    'extended-ladder constant-plus-decay fit extended with the anchor comparison and material-movement ' +
    'metrics); imp-34208/imp-34209 (F3 asymptote cross-check and fit stability); imp-33773 (the M2 ' +
    'residual whose sign change at kEnd~21.28 caps the sign-stable ladder); lambda-rh-height-mapping ' +
    '(RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34266_F2_F3_ATTENUATION_DRIFT_VS_CONSTANT_ASSERTIONS = [
  {
    // Anchor-window per-unit factors reproduce imp-34023 (~0.9739, ~0.9907).
    id: 'imp34266-anchor-reproduces-imp34023',
    description: 'anchor per-unit factors reproduce imp-34023: F2 ~0.9739, F3 ~0.9907',
    holds: () =>
      ANCHOR.length === 9 &&
      Math.abs(F2_ANCHOR.perUnit - 0.9739) < 0.002 &&
      Math.abs(F3_ANCHOR.perUnit - 0.9907) < 0.002,
  },
  {
    // The near-flat anchor factors DRIFT toward per-unit 1.0 as the boundary recedes.
    id: 'imp34266-anchor-factors-drift-toward-one',
    description: 'extended per-unit factors are closer to 1 than the anchor factors (both drift up)',
    holds: () =>
      F2_EXT.perUnit > F2_ANCHOR.perUnit &&
      F2_EXT.perUnit < 1.0 + 1e-6 &&
      F3_EXT.perUnit > F3_ANCHOR.perUnit &&
      F3_EXT.perUnit < 1.0,
  },
  {
    // F2 converges to its constant; F3 is still drifting at the ceiling.
    id: 'imp34266-f2-converges-f3-still-drifts',
    description: 'F2 local per-unit ~1.0 and gap ~0.03% (converged); F3 local per-unit < 1 and gap ~2% (drifting)',
    holds: () =>
      F2_LOCAL_HIGH > 0.99999 &&
      F2_GAP_PCT < 0.1 &&
      F3_LOCAL_HIGH < 0.999 &&
      F3_GAP_PCT > 1.0 &&
      F3_GAP_PCT < 4.0,
  },
  {
    // Relative to F4 neither factor materially moves (F4 collapses by ~5 orders of magnitude).
    id: 'imp34266-neither-materially-moves-vs-f4',
    description: 'F2, F3 move ~x0.94 over kEnd=11->21 while F4 moves ~x4e-6 (F4 sole driver)',
    holds: () =>
      F2_MOVE > 0.9 &&
      F2_MOVE < 1.0 &&
      F3_MOVE > 0.9 &&
      F3_MOVE < 1.0 &&
      F4_MOVE < 1e-4,
  },
  {
    // The F3 constant-plus-decay asymptote matches imp-34133 (~0.835, slow r ~0.12).
    id: 'imp34266-f3-cpd-matches-imp34133',
    description: 'F3 constant-plus-decay c ~0.835, r ~0.12, R2 ~0.9999 (consistent with imp-34133)',
    holds: () =>
      Math.abs(F3_CPD.c - 0.835) < 0.01 && F3_CPD.r > 0.1 && F3_CPD.r < 0.15 && F3_CPD.R2 > 0.999,
  },
  {
    // Honesty gate: numerical/measurement only, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34266-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed, K_a untouched',
    holds: () =>
      IMP34266_F2_F3_ATTENUATION_DRIFT_VS_CONSTANT.isRigorous === false &&
      /NO QED/.test(IMP34266_F2_F3_ATTENUATION_DRIFT_VS_CONSTANT.verdict) &&
      /refereed bound is changed/i.test(IMP34266_F2_F3_ATTENUATION_DRIFT_VS_CONSTANT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34266_F2_F3_ATTENUATION_DRIFT_VS_CONSTANT.verdict),
  },
];

for (const a of IMP34266_F2_F3_ATTENUATION_DRIFT_VS_CONSTANT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34266-f2-f3-attenuation-drift-vs-constant assertion failed: ${a.id}`);
  }
}
