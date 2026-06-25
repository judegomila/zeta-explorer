/**
 * @module imp-2627-theta-certification
 * @fileoverview imp-2627: AUTOMATE the per-N Theta(0) <= 1/4 certification for the
 * bridge instantiation ladder. imp-2622 licenses the isolated-pair t_c^part bound
 * only when the instantiation row's small-gap pair satisfies the unconditional
 * Corollary A1 hypothesis Theta(0) <= 1/4 (sg1c-theta-trap-theorems.js Theorem A /
 * Corollary A1). This module turns that "named per-row conditional" into a
 * MECHANICAL data check: given any N and the certified zero ordinates it locates
 * the minimal-gap adjacent pair, computes Theta(0) = g^2 E / 2 from the EXACT pair
 * identity (E = sum_j 1/((x_i - x_j)(x_{i+1} - x_j)) over the environment), and
 * emits a pass/fail certificate with the margin to the 1/4 bar. It is run on every
 * PATHC_EXACT_TC_LADDER rung (N in {4, 6, 8, 10, 12}) at import.
 *
 * THE TWO TRAP LEVELS (both from sg1c-theta-trap-theorems.js)
 * ----------------------------------------------------------
 *   - UNCONDITIONAL level 1/4 (Theorem A / Corollary A1): if the tracked minimal
 *     pair has Theta(0) <= 1/4 then Theta stays <= 1/4 for all s in [0, t_c) with
 *     NO further hypothesis, giving t_c(N) <= g_min(0)^2 / 6 unconditionally.
 *   - MINIMAL-GAP level Theta_b = (sqrt(73) - 5)/8 = 0.443000... (Theorem B, SHARP):
 *     because we certify the MINIMAL gap, Theorem B's hypothesis "g is the minimal
 *     gap" holds BY CONSTRUCTION, so the trap also holds at every Theta(0) <= Theta_b.
 *
 * HONEST RESULT ON THE LADDER (no false QED)
 * ------------------------------------------
 * Computed live on the repaired ZETA_ZEROS, the minimal-pair Theta(0) on the five
 * rungs is {N=4: 0.2625, N=6: 0.2064, N=8: 0.2282, N=10: 0.1059, N=12: 0.2322}.
 *   - Four of five rungs (N >= 6) CLEAR the unconditional 1/4 bar: Corollary A1
 *     applies with no hypothesis there.
 *   - The N=4 rung sits at Theta(0) = 0.2625, just ABOVE 1/4, so the UNCONDITIONAL
 *     Corollary A1 does NOT cover it. It is NOT a counterexample to the bound: the
 *     same pair is the minimal gap, so Theorem B (level 0.443) still traps it with
 *     wide margin (0.2625 << 0.443). At N=4 the t_c trap therefore holds via the
 *     minimal-gap hypothesis, not via the unconditional theorem -- which is exactly
 *     the distinction this mechanical certificate is meant to surface per row.
 *
 * So the per-row conditional is now a checkable datum, not a hand-wave: the ENTIRE
 * ladder is trapped (every rung clears Theta_b), and the certificate reports per row
 * whether the STRONGER unconditional 1/4 bar is met (yes for N >= 6, no for N=4).
 *
 * @see imp-2627
 * @see sg1c-theta-trap-theorems (Theorem A / Corollary A1 level 1/4; Theorem B level 0.443)
 * @see imp-2563-pathc-exact-tc-ladder (the rungs N in {4,6,8,10,12} this is run on)
 */

import { ZETA_ZEROS } from '../math/zeta.js';
import { SG1C_THEOREMS } from './sg1c-theta-trap-theorems.js';

// ── The certification routine (self-contained; mirrors the sibling pair identity) ─

/** Environment products T_j for the adjacent pair (x_i, x_{i+1}); excludes the pair itself. */
function envProducts(x, i) {
  const t = [];
  for (let j = 0; j < x.length; j++) {
    if (j === i || j === i + 1) continue;
    t.push(1 / ((x[i] - x[j]) * (x[i + 1] - x[j])));
  }
  return t;
}

/** Index of the minimal-gap adjacent pair (the pair that leads the collision). */
function minimalGapIndex(x) {
  let bi = 0;
  let bg = Infinity;
  for (let i = 0; i < x.length - 1; i++) {
    const g = x[i + 1] - x[i];
    if (g < bg) {
      bg = g;
      bi = i;
    }
  }
  return bi;
}

// ── Outward-rounded interval arithmetic (certified enclosures) ────────────────
// Float64 unit roundoff is 2^-53; inflating each endpoint by the full machine
// epsilon 2^-52 (plus one denormal) per flop conservatively absorbs the directed
// rounding, so [lo, hi] is a guaranteed enclosure of the exact real result. This
// mirrors the verified-arithmetic tier used in ht-corridor-certificates.
const IV_U = Number.EPSILON;          // 2^-52, conservative per-op relative inflation
const IV_TINY = Number.MIN_VALUE;     // guards values that round to or through zero
const rdn = (v) => v - Math.abs(v) * IV_U - IV_TINY;   // round toward -infinity
const rup = (v) => v + Math.abs(v) * IV_U + IV_TINY;   // round toward +infinity
const ivPt = (v) => ({ lo: v, hi: v });
const ivAdd = (a, b) => ({ lo: rdn(a.lo + b.lo), hi: rup(a.hi + b.hi) });
const ivSub = (a, b) => ({ lo: rdn(a.lo - b.hi), hi: rup(a.hi - b.lo) });
const ivMul = (a, b) => {
  const p = [a.lo * b.lo, a.lo * b.hi, a.hi * b.lo, a.hi * b.hi];
  return { lo: rdn(Math.min(...p)), hi: rup(Math.max(...p)) };
};
const ivRecip = (a) => ({ lo: rdn(1 / a.hi), hi: rup(1 / a.lo) }); // a must be strictly one-signed

const THETA_A_LEVEL = SG1C_THEOREMS.theoremA.trapLevel;   // 1/4 (unconditional Corollary A1)
const THETA_B_LEVEL = SG1C_THEOREMS.theoremB.trapLevel;   // (sqrt(73)-5)/8 (minimal-gap trap)
const LADDER_NS = [4, 6, 8, 10, 12];                      // PATHC_EXACT_TC_LADDER rungs

/**
 * Certify one rung: locate the minimal-gap pair on the first N ordinates, compute
 * Theta(0) = g^2 E / 2, and emit a pass/fail certificate against BOTH trap levels.
 */
function certifyRung(N) {
  const x = ZETA_ZEROS.slice(0, N);
  const i = minimalGapIndex(x);
  const g = x[i + 1] - x[i];
  const T = envProducts(x, i);
  const E = T.reduce((a, b) => a + b, 0);
  const theta0 = (g * g * E) / 2;

  // Certified outward-rounded UPPER bracket for Theta(0) = g^2 E / 2. Each adjacent
  // environment product (x_i - x_j)(x_{i+1} - x_j) is strictly one-signed (no zero
  // lies between the adjacent pair), so the reciprocal interval is well-defined.
  const gIv = ivSub(ivPt(x[i + 1]), ivPt(x[i]));
  let eIv = ivPt(0);
  for (let j = 0; j < x.length; j++) {
    if (j === i || j === i + 1) continue;
    const d1 = ivSub(ivPt(x[i]), ivPt(x[j]));
    const d2 = ivSub(ivPt(x[i + 1]), ivPt(x[j]));
    eIv = ivAdd(eIv, ivRecip(ivMul(d1, d2)));
  }
  const thetaIv = ivMul(ivMul(ivMul(gIv, gIv), eIv), ivPt(0.5));
  const theta0_hi = thetaIv.hi;   // certified Theta(0) <= theta0_hi

  return {
    N,
    pairIndex: i,
    g_min: +g.toFixed(6),
    theta0: +theta0.toFixed(6),
    // Certified outward-rounded UPPER bracket: the exact real Theta(0) is <= theta0_hi.
    theta0_hi: +theta0_hi.toFixed(9),
    // Unconditional Corollary A1 (level 1/4): the per-row conditional being mechanized.
    passUnconditional: theta0 <= THETA_A_LEVEL,
    // Rounding-rigorous version: the certified upper bracket itself clears 1/4.
    passUnconditionalCertified: theta0_hi < THETA_A_LEVEL,
    marginToQuarter: +(THETA_A_LEVEL - theta0).toFixed(6),
    // Certified margin from the UPPER bracket to 1/4 (positive => rounding-rigorous clearance).
    marginToQuarterCertified: +(THETA_A_LEVEL - theta0_hi).toFixed(9),
    // Minimal-gap Theorem B (level 0.443): hypothesis holds by construction (we tracked g_min).
    passMinGapTrap: theta0 <= THETA_B_LEVEL,
    passMinGapTrapCertified: theta0_hi < THETA_B_LEVEL,
    marginToThetaB: +(THETA_B_LEVEL - theta0).toFixed(6),
    marginToThetaBCertified: +(THETA_B_LEVEL - theta0_hi).toFixed(9),
  };
}

const CERTIFICATES = LADDER_NS.map(certifyRung);

const ALL_TRAPPED = CERTIFICATES.every((c) => c.passMinGapTrap);
const UNCONDITIONAL_NS = CERTIFICATES.filter((c) => c.passUnconditional).map((c) => c.N);
const CONDITIONAL_NS = CERTIFICATES.filter((c) => !c.passUnconditional).map((c) => c.N);

// ── Exported certification record ─────────────────────────────────────────────
export const IMP2627_THETA_CERTIFICATION = {
  id: 'imp-2627',
  title:
    'Automated per-N Theta(0) <= 1/4 certification for the bridge instantiation ' +
    'ladder (mechanizes the Corollary A1 per-row conditional of imp-2622)',
  method:
    'For each rung locate the minimal-gap adjacent pair on the first N repaired ' +
    'ZETA_ZEROS, compute Theta(0) = g^2 E / 2 via the exact pair identity ' +
    '(E = sum_j 1/((x_i - x_j)(x_{i+1} - x_j))), and emit pass/fail against the ' +
    'unconditional level 1/4 (Corollary A1) and the minimal-gap level Theta_b = ' +
    '(sqrt(73)-5)/8 (Theorem B, whose hypothesis holds by construction).',
  thetaALevel: THETA_A_LEVEL,
  thetaBLevel: +THETA_B_LEVEL.toFixed(6),
  certificates: CERTIFICATES,
  unconditionalRungs: UNCONDITIONAL_NS,
  conditionalRungs: CONDITIONAL_NS,
  honest:
    'Every ladder rung clears the minimal-gap trap level 0.443, so the t_c trap ' +
    'holds across the whole ladder. The stronger UNCONDITIONAL 1/4 bar is met for ' +
    'N >= 6; the N=4 rung sits at Theta(0) = 0.2625 just above 1/4, so there the ' +
    'trap rests on the minimal-gap hypothesis (Theorem B), not on the unconditional ' +
    'Corollary A1. Surfacing that per-row distinction mechanically is the deliverable ' +
    '-- no rung is falsely promoted to the unconditional bound.',
};

// ── Build-time assertions (self-executing witness) ────────────────────────────
export const IMP2627_THETA_CERTIFICATION_ASSERTIONS = [
  {
    id: 'imp2627-routine-reproduces-baked-theta',
    holds: () => {
      const baked = { 4: 0.262474, 6: 0.206435, 8: 0.228156, 10: 0.105927, 12: 0.232249 };
      return CERTIFICATES.length === 5 &&
        CERTIFICATES.every((c) => Math.abs(c.theta0 - baked[c.N]) < 1e-4);
    },
    why:
      'The live Theta(0) certificate on each rung must match the baked literal to ' +
      '1e-4. A drift means ZETA_ZEROS regressed or the pair identity broke, either ' +
      'way the mechanical certification can no longer be trusted.',
  },
  {
    id: 'imp2627-pair-is-the-minimal-gap',
    holds: () =>
      CERTIFICATES.every((c) => {
        const x = ZETA_ZEROS.slice(0, c.N);
        let g = Infinity;
        for (let i = 0; i < x.length - 1; i++) g = Math.min(g, x[i + 1] - x[i]);
        return Math.abs(c.g_min - +g.toFixed(6)) < 1e-9;
      }),
    why:
      'The certified pair must be the MINIMAL consecutive gap on each rung -- that ' +
      'is what makes Theorem B (minimal-gap trap) applicable by construction and ' +
      'what the collision is led by (imp-2605 isolated-pair law).',
  },
  {
    id: 'imp2627-whole-ladder-clears-thetaB',
    holds: () => ALL_TRAPPED === true,
    why:
      'Every rung Theta(0) must clear the minimal-gap trap level Theta_b = ' +
      '(sqrt(73)-5)/8 = 0.443, so the t_c trap holds across the whole instantiation ' +
      'ladder; a rung above 0.443 would void the trap and the t_c^part bound it feeds.',
  },
  {
    id: 'imp2627-unconditional-split-is-honest',
    holds: () =>
      UNCONDITIONAL_NS.join(',') === '6,8,10,12' &&
      CONDITIONAL_NS.join(',') === '4' &&
      CERTIFICATES.find((c) => c.N === 4).passMinGapTrap === true,
    why:
      'The unconditional Corollary A1 (level 1/4) must be reported as met EXACTLY ' +
      'for N >= 6 and NOT for N=4 (Theta(0) = 0.2625 > 1/4), while N=4 still clears ' +
      'the minimal-gap level. Pinning this split prevents a silent flip that would ' +
      'falsely promote the N=4 rung to the unconditional bound.',
  },
  {
    id: 'imp2627-certified-upper-brackets-clear-traps',
    holds: () =>
      CERTIFICATES.every((c) =>
        c.marginToThetaBCertified > 0 &&           // certified clearance of the 0.443 trap on every rung
        c.passMinGapTrapCertified === true) &&
      CERTIFICATES.filter((c) => c.N >= 6).every((c) =>
        c.marginToQuarterCertified > 0 &&          // certified clearance of the 1/4 bar for N >= 6
        c.passUnconditionalCertified === true) &&
      CERTIFICATES.find((c) => c.N === 4).passUnconditionalCertified === false,
    why:
      'Each Theta(0) certificate must carry an outward-rounded interval UPPER bracket ' +
      'theta0_hi (an upper bound on the exact Theta(0) by construction) whose ' +
      'certified margin to the minimal-gap level 0.443 is ' +
      'positive on every rung, and whose certified margin to 1/4 is positive exactly ' +
      'for N >= 6 (the N=4 bracket stays above 1/4). This upgrades the trap clearance ' +
      'from a float64 point comparison to a rounding-rigorous interval bracket, ' +
      'matching the verified-arithmetic tier of ht-corridor-certificates.',
  },
];

for (const a of IMP2627_THETA_CERTIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      '[imp-2627-theta-certification] build-time assertion failed: ' + a.id + ' - ' + a.why,
    );
  }
}
