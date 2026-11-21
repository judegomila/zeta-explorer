/**
 * @module imp-34493-residue-near-pole-rung-feasibility
 * @fileoverview imp-34493 -- TEST the imp-34451 F4 prediction that only more NEAR-POLE rungs
 *   (not k* refinement) could tighten the eflow_over_resid residue R, by assessing whether adding
 *   a fresh resid_exp sample at an intermediate k ~ 21.15 (between the k=21.0 rung and the pole
 *   k* ~ 21.28095) would measurably narrow the imp-34449 +/-1.1% residue error bar.
 *
 *   THE SETUP. imp-34449 turned the imp-34397 heuristic ~1-2% residue caveat into a MEASURED bar
 *   R = -1.756e-8 +/- 0.019e-8 (~+/-1.1%) from three nested reads (quad/cubic/quartic) that keep the
 *   three near-pole rungs {21.0, 21.25, 21.5} and PREPEND farther rungs (20.0, 19.0) to raise the
 *   local fit order. imp-34451 decomposed that bar and found it curvature-fit-dominated by ~2.67e4x
 *   over pole-location uncertainty; its F4 concluded that refining k* would NOT tighten R and only
 *   MORE NEAR-POLE RUNGS would. imp-34397/imp-34237 note no genuinely finer sub-rung inside
 *   (21.0, 21.28095) is baked in the source. This module tests F4 directly.
 *
 *   THE OBSTRUCTION (honest sub-gap). A GENUINELY fresh resid_exp(21.15) is the surrogate estimator
 *   value pEcoll(1-sigma) - pSigma at k=21.15 (imp-33810/imp-33843/imp-34169), which requires the
 *   heavy zeros bundle to evaluate and is NOT baked in the imp-34237 source. An import-light data
 *   module (per [[no_heavy_imports_in_pages]]) therefore CANNOT produce the literal fresh rung the
 *   ticket names. Rather than fabricate one, this module tests F4 two honest ways that need NO fresh
 *   estimator call: (1) an estimator-free GEOMETRY proxy that quantifies how much a near rung would
 *   reduce the leading finite-difference error, and (2) a synthetic-consistency read that bounds the
 *   correction magnitude and checks it lands inside the existing bar.
 *
 *   METHOD.
 *   (1) GEOMETRY PROXY (estimator-free). The leading term of the polynomial-interpolation derivative
 *       error at a non-node x* is f^(n+1)(xi)/(n+1)! * omega_prime(x*), where omega(x) = prod(x - x_i)
 *       is the node polynomial over the n+1 fit nodes. The GEOMETRIC amplification of that error is
 *       A = |omega_prime(k*)| / (n+1)!. Compute A for the imp-34397 3-rung quad {21.0,21.25,21.5},
 *       for the imp-34449 4-rung FAR cubic {20.0,21.0,21.25,21.5} (the rung it actually added), and
 *       for a hypothetical 4-rung NEAR cubic {21.0,21.15,21.25,21.5}. A smaller A means a smaller
 *       leading error factor. (Honest caveat: A is the GEOMETRY factor only; raising order also
 *       changes the unknown f^(n+1), so A is a proxy for the error LEVER, not the full error.)
 *   (2) SYNTHETIC CONSISTENCY READ. Take the best available surrogate for resid_exp(21.15) -- the
 *       5-rung quartic interpolant through all baked imp-34237 rows evaluated at 21.15 -- insert it as
 *       a near cubic rung {21.0,21.15,21.25,21.5}, and read R = eflow_attr(k*)/slope(k*). Because the
 *       synthetic value is drawn FROM the current best interpolant, this read carries no genuinely new
 *       estimator information (circularity); it only tests whether a near rung consistent with the
 *       current fit stays inside the bar or blows it up like the imp-34449 F4 naive rung SWAPS did.
 *
 *   FINDINGS.
 *   (F1) A NEAR RUNG IS THE STRONGEST ERROR LEVER. A(quad) = 9.9377e-3. A(far cubic, the rung
 *        imp-34449 added) = 3.2618e-3 (32.82% of quad). A(near cubic at 21.15) = 4.0470e-4 (4.07% of
 *        quad). The near rung reduces the leading geometric error factor to ~1/25 of the quad, versus
 *        ~1/3 for the far rung -- near/far amplification ratio = 0.1241, so a 21.15 rung is ~8x more
 *        error-reducing than the 20.0 rung imp-34449 actually used, and (per imp-34451) infinitely
 *        more than k* refinement (which moves R by only ~1e-6 relative). This CONFIRMS imp-34451 F4:
 *        near-pole rungs are the lever that tightens R.
 *   (F2) SYNTHETIC NEAR-RUNG READ STAYS INSIDE THE BAR. The 5-rung quartic gives resid_exp(21.15) ~
 *        3.7016e-8; the near cubic {21.0,21.15,21.25,21.5} reads R = -1.75871e-8, ~0.16% from the
 *        imp-34449 quartic central -1.75589e-8 and comfortably inside the bar [-1.77880e-8,-1.74023e-8].
 *        Unlike the imp-34449 F4 naive rung SWAPS (which swung R to -1.63e-8/-2.10e-8 by DROPPING a
 *        near rung), a near rung ADDED consistent with the current fit does NOT expand the bar.
 *   (F3) FEASIBILITY VERDICT WITH AN HONEST GATE. F4 is CONFIRMED in the sense that matters: the
 *        residue error is interpolation-geometry-dominated and a near-pole rung at 21.15 is the
 *        strongest available lever to shrink it. BUT the actual TIGHTENING MAGNITUDE cannot be
 *        measured here, because it depends on the GENUINE resid_exp(21.15) from the heavy surrogate
 *        estimator, which is not baked and not import-light-computable. The synthetic read is
 *        interpolant-drawn and so cannot substitute for that measurement.
 *
 *   VERDICT: imp-34451 F4 is CONFIRMED as a FEASIBILITY statement -- a fresh near-pole rung at
 *   k ~ 21.15 reduces the leading finite-difference error-amplification factor to ~4% of the imp-34397
 *   quad (near/far ratio 0.124, ~8x the far rung imp-34449 used; >>1 vs k* refinement per imp-34451),
 *   and a synthetic near rung reads R = -1.75871e-8 inside the +/-1.1% bar without blowing it up. The
 *   genuine tightening magnitude remains an HONEST OPEN SUB-GAP: it requires a real resid_exp(21.15)
 *   from the imp-33810/imp-33843/imp-34169 surrogate over the heavy zeros bundle, which this
 *   import-light module cannot evaluate. Surrogate/geometry diagnostic, finite-difference re-read on
 *   the same baked rungs; NOT a rigorous asymptotic; the pole-location-negligible verdict (imp-34451)
 *   and the +/-1.1% bar (imp-34449) are UNTOUCHED; changes no bound; C_mb GUE-conditional per imp-486
 *   UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; no refereed bound is changed.
 *
 *   SUB-GAP: fresh-near-pole-estimator-value-needs-heavy-bundle -- the genuine tightening magnitude
 *   is unmeasured until resid_exp(21.15) is computed from the surrogate estimator (offline/heavy).
 *
 *   @see imp-34451-residue-pole-location-vs-curvature-error-budget.js (F4 this tests: only near rungs tighten R)
 *   @see imp-34449-residue-curvature-error-bar-extended-rungs.js (the +/-1.1% bar; far-rung nested reads)
 *   @see imp-34397-eflow-over-resid-residue-curvature-corrected.js (3-rung quad baseline)
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (baked rung literals, surrogate resid_exp)
 */

import { IMP34237_RESID_EXP_ROWS } from './imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';
import {
  IMP34310_KSTAR,
  IMP34310_EFLOW_ATTR_AT_KSTAR,
} from './imp-34310-eflow-over-resid-pole-residue-simple-pole.js';
import {
  IMP34449_RESIDUE_MIN,
  IMP34449_RESIDUE_MAX,
  IMP34449_RESIDUE_CENTRAL,
  IMP34449_RESIDUE_QUAD,
} from './imp-34449-residue-curvature-error-bar-extended-rungs.js';

const KSTAR = IMP34310_KSTAR; // 21.28095
const K_INTERMEDIATE = 21.15; // the near-pole test rung, inside (21.0, k*)

// --- Baked rungs (imp-34237 source, ascending) --------------------------------
const R19 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 19.0);
const R20 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 20.0);
const R21 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.0);
const R2125 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.25);
const R215 = IMP34237_RESID_EXP_ROWS.find((r) => r.k === 21.5);

// --- (1) estimator-free geometry proxy: A = |omega_prime(k*)| / (n+1)! --------
function factorial(n) {
  let r = 1;
  for (let i = 2; i <= n; i++) r *= i;
  return r;
}
// omega_prime(x) = sum_j prod_{i!=j} (x - x_i) for the node polynomial omega(x) = prod (x - x_i).
function nodePolyDerivAt(ks, x) {
  let s = 0;
  for (let j = 0; j < ks.length; j++) {
    let prod = 1;
    for (let i = 0; i < ks.length; i++) {
      if (i !== j) prod *= x - ks[i];
    }
    s += prod;
  }
  return s;
}
function amplification(ks) {
  return Math.abs(nodePolyDerivAt(ks, KSTAR)) / factorial(ks.length);
}

const KS_QUAD = [21.0, 21.25, 21.5]; // imp-34397 baseline
const KS_CUBIC_FAR = [20.0, 21.0, 21.25, 21.5]; // rung imp-34449 actually added
const KS_CUBIC_NEAR = [21.0, K_INTERMEDIATE, 21.25, 21.5]; // hypothetical near rung

export const IMP34493_AMP_QUAD = amplification(KS_QUAD); // 9.9377e-3
export const IMP34493_AMP_CUBIC_FAR = amplification(KS_CUBIC_FAR); // 3.2618e-3
export const IMP34493_AMP_CUBIC_NEAR = amplification(KS_CUBIC_NEAR); // 4.0470e-4
export const IMP34493_AMP_FAR_REL_QUAD = IMP34493_AMP_CUBIC_FAR / IMP34493_AMP_QUAD; // 0.3282
export const IMP34493_AMP_NEAR_REL_QUAD = IMP34493_AMP_CUBIC_NEAR / IMP34493_AMP_QUAD; // 0.0407
export const IMP34493_AMP_NEAR_OVER_FAR = IMP34493_AMP_CUBIC_NEAR / IMP34493_AMP_CUBIC_FAR; // 0.1241

// --- (2) synthetic-consistency read (interpolant-drawn, no new estimator info) -
// Newton divided-difference interpolant value / derivative through `nodes`.
function ddTable(nodes) {
  const xs = nodes.map((p) => p.k);
  const ys = nodes.map((p) => p.residExp);
  const n = nodes.length;
  const dd = [ys.slice()];
  for (let j = 1; j < n; j++) {
    const col = [];
    for (let i = 0; i < n - j; i++) {
      col.push((dd[j - 1][i + 1] - dd[j - 1][i]) / (xs[i + j] - xs[i]));
    }
    dd.push(col);
  }
  return { dd, xs };
}
function polyValueAt(nodes, x) {
  const { dd, xs } = ddTable(nodes);
  let v = dd[0][0];
  let prod = 1;
  for (let j = 1; j < nodes.length; j++) {
    prod *= x - xs[j - 1];
    v += dd[j][0] * prod;
  }
  return v;
}
function polyDerivAt(nodes, x) {
  const { dd, xs } = ddTable(nodes);
  const n = nodes.length;
  let der = 0;
  for (let j = 1; j < n; j++) {
    let dsum = 0;
    for (let drop = 0; drop < j; drop++) {
      let prod = 1;
      for (let m = 0; m < j; m++) {
        if (m !== drop) prod *= x - xs[m];
      }
      dsum += prod;
    }
    der += dd[j][0] * dsum;
  }
  return der;
}

// best surrogate for resid_exp(21.15): 5-rung quartic interpolant through all baked rows.
const QUARTIC_NODES = [R19, R20, R21, R2125, R215];
export const IMP34493_SYNTH_RESID_EXP_2115 = polyValueAt(QUARTIC_NODES, K_INTERMEDIATE); // ~3.7016e-8

// insert the synthetic near rung into a cubic that keeps the three near-pole rungs.
const NEAR_NODES = [
  { k: 21.0, residExp: R21.residExp },
  { k: K_INTERMEDIATE, residExp: IMP34493_SYNTH_RESID_EXP_2115 },
  { k: 21.25, residExp: R2125.residExp },
  { k: 21.5, residExp: R215.residExp },
];
export const IMP34493_SYNTH_NEAR_SLOPE = polyDerivAt(NEAR_NODES, KSTAR); // -2.6058e-7
export const IMP34493_SYNTH_NEAR_RESIDUE =
  IMP34310_EFLOW_ATTR_AT_KSTAR / IMP34493_SYNTH_NEAR_SLOPE; // -1.75871e-8
export const IMP34493_SYNTH_NEAR_REL_TO_CENTRAL =
  (IMP34493_SYNTH_NEAR_RESIDUE - IMP34449_RESIDUE_CENTRAL) / Math.abs(IMP34449_RESIDUE_QUAD); // ~1.6e-3
export const IMP34493_SYNTH_NEAR_INSIDE_BAR =
  IMP34493_SYNTH_NEAR_RESIDUE <= IMP34449_RESIDUE_MAX &&
  IMP34493_SYNTH_NEAR_RESIDUE >= IMP34449_RESIDUE_MIN; // true

export const IMP34493_RESIDUE_NEAR_POLE_RUNG_FEASIBILITY = {
  ticket: 'imp-34493',
  kIntermediate: K_INTERMEDIATE,
  kStar: KSTAR,
  geometryProxy: {
    ampQuad: IMP34493_AMP_QUAD,
    ampCubicFar: IMP34493_AMP_CUBIC_FAR,
    ampCubicNear: IMP34493_AMP_CUBIC_NEAR,
    ampFarRelQuad: IMP34493_AMP_FAR_REL_QUAD,
    ampNearRelQuad: IMP34493_AMP_NEAR_REL_QUAD,
    ampNearOverFar: IMP34493_AMP_NEAR_OVER_FAR,
  },
  syntheticRead: {
    synthResidExp2115: IMP34493_SYNTH_RESID_EXP_2115,
    nearSlope: IMP34493_SYNTH_NEAR_SLOPE,
    nearResidue: IMP34493_SYNTH_NEAR_RESIDUE,
    relToCentral: IMP34493_SYNTH_NEAR_REL_TO_CENTRAL,
    insideBar: IMP34493_SYNTH_NEAR_INSIDE_BAR,
    barMin: IMP34449_RESIDUE_MIN,
    barMax: IMP34449_RESIDUE_MAX,
    barCentral: IMP34449_RESIDUE_CENTRAL,
  },
  note:
    'Testing imp-34451 F4 (only near-pole rungs, not k* refinement, tighten the residue R): a near ' +
    'rung at k~21.15 reduces the leading interpolation-derivative error-amplification factor ' +
    '|omega_prime(k*)|/(n+1)! to ~4.07% of the imp-34397 quad, vs ~32.82% for the far rung imp-34449 ' +
    'actually added -- near/far ratio 0.124, so ~8x more error-reducing (and >>1 vs k* refinement per ' +
    'imp-34451). A synthetic near rung (5-rung-quartic value 3.70e-8) reads R=-1.75871e-8, inside the ' +
    'imp-34449 +/-1.1% bar and ~0.16% from the quartic central, without the blow-up the imp-34449 F4 ' +
    'naive rung SWAPS showed. F4 CONFIRMED as feasibility; the genuine tightening magnitude is gated.',
  honest:
    'FEASIBILITY/MEASUREMENT ONLY. The geometry factor A is the ERROR LEVER, not the full error ' +
    '(raising order also changes the unknown f^(n+1)); the synthetic read is drawn from the current ' +
    'best interpolant and so carries NO genuinely new estimator information. SUB-GAP ' +
    '(fresh-near-pole-estimator-value-needs-heavy-bundle): a GENUINE resid_exp(21.15) requires the ' +
    'imp-33810/imp-33843/imp-34169 surrogate over the heavy zeros bundle, which is NOT baked and NOT ' +
    'import-light-computable, so the actual tightening magnitude stays unmeasured. Surrogate NOT ' +
    'rigorous; imp-34451 pole-location-negligible verdict and imp-34449 +/-1.1% bar UNTOUCHED; changes ' +
    'no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; imp-3066 K_a>=0 untouched; NO QED; ' +
    'no refereed bound is changed.',
};

export const IMP34493_ASSERTIONS = [
  {
    id: 'imp-34493-near-rung-is-strongest-geometry-lever',
    description:
      'the near rung at 21.15 reduces the leading error-amplification factor to ~4% of the quad, well below the ~33% of the far rung imp-34449 used',
    holds: () =>
      IMP34493_AMP_CUBIC_NEAR < IMP34493_AMP_CUBIC_FAR &&
      IMP34493_AMP_CUBIC_FAR < IMP34493_AMP_QUAD &&
      Math.abs(IMP34493_AMP_NEAR_REL_QUAD - 0.040724) < 1e-4 &&
      Math.abs(IMP34493_AMP_FAR_REL_QUAD - 0.328219) < 1e-4,
  },
  {
    id: 'imp-34493-near-over-far-ratio-about-one-eighth',
    description:
      'the near rung is ~8x more error-reducing than the far rung imp-34449 added (near/far amplification ratio ~0.124)',
    holds: () =>
      IMP34493_AMP_NEAR_OVER_FAR > 0 &&
      IMP34493_AMP_NEAR_OVER_FAR < 0.2 &&
      Math.abs(IMP34493_AMP_NEAR_OVER_FAR - 0.124075) < 1e-4,
  },
  {
    id: 'imp-34493-synthetic-near-read-inside-bar',
    description:
      'the synthetic near-rung read R=-1.75871e-8 lands inside the imp-34449 +/-1.1% bar and within ~0.2% of the quartic central',
    holds: () =>
      IMP34493_SYNTH_NEAR_RESIDUE < 0 &&
      IMP34493_SYNTH_NEAR_INSIDE_BAR === true &&
      Math.abs(IMP34493_SYNTH_NEAR_RESIDUE - -1.758705e-8) < 1e-13 &&
      Math.abs(IMP34493_SYNTH_NEAR_REL_TO_CENTRAL) < 0.005,
  },
  {
    id: 'imp-34493-synthetic-resid-exp-2115-positive-between-neighbors',
    description:
      'the 5-rung-quartic surrogate resid_exp(21.15) ~ 3.70e-8 sits between the baked 21.0 (8.72e-8) and 21.25 (8.19e-9) rungs',
    holds: () =>
      IMP34493_SYNTH_RESID_EXP_2115 < R21.residExp &&
      IMP34493_SYNTH_RESID_EXP_2115 > R2125.residExp &&
      Math.abs(IMP34493_SYNTH_RESID_EXP_2115 - 3.701606e-8) < 1e-13,
  },
  {
    id: 'imp-34493-rung-literals-match-imp34237-source',
    description: 'the baked rungs consumed here reproduce the imp-34237 source rows exactly (===)',
    holds: () =>
      R19.residExp === 3.04e-6 &&
      R20.residExp === 7.94e-7 &&
      R21.residExp === 8.72e-8 &&
      R2125.residExp === 8.19e-9 &&
      R215.residExp === -4.97e-8,
  },
];

for (const a of IMP34493_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34493-residue-near-pole-rung-feasibility assertion failed: ${a.id}`);
  }
}
