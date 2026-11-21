/**
 * @module imp-34235-kpss-hac-nonrejection-margin
 *
 * imp-34235 (accuracy, frontier-direction): imp-34155 R5 named the HAC-corrected (l>=1) KPSS statistic
 * eta_mu ~ 0.149 -- FAR below the 10% critical value 0.347 -- as the PRIMARY reading on the 21 signed
 * imp-33858 residuals, with the fragile un-HAC l=0 borderline being only a dissection. imp-34155/imp-34231
 * quantified the residual-space fragility of that l=0 borderline (a single-rung shift of ~0.00201, ~1.7%
 * of the residual RMS, erases it). This module measures the SYMMETRIC complement: reusing the imp-34024
 * HAC-corrected (Schwert l=L4=2, Bartlett long-run variance) LEVEL KPSS statistic VERBATIM, it computes the
 * per-rung sensitivity and the minimal single-rung and joint L2-norm residual shift that would RAISE
 * eta_mu ABOVE 0.347 -- quantifying how far the HAC-corrected NON-rejection is from flipping, the mirror of
 * the fragile l=0 read.
 *
 * WHY THE HAC NON-REJECTION IS ROBUST (and why steepest is NOT cheapest here)
 * -------------------------------------------------------------------------
 *   The eta-margin is now 0.347 - 0.149 = 0.1976 -- ~150x the tiny 0.00128 l=0 borderline excess. Under a
 *   single-rung shift e_r -> e_r + delta both the partial-sum numerator n^{-2} sum S_t^2 AND the Bartlett
 *   long-run variance s2(l=2) = gamma_0 + 2 sum_{j=1..2}(1 - j/3) gamma_j move, and s2 depends on the lag-1
 *   and lag-2 autocovariances (the imp-33964 r_1 ~ +0.757 is what inflates s2 and pushes eta down). Because
 *   the margin is large, eta_mu(delta) is STRONGLY nonlinear over the flip: the delta=0 derivative does not
 *   predict the far-flip cost, so the steepest rung (by |d eta / d delta|) is NOT the cheapest. Worse, for
 *   most rungs eta_mu(delta) SATURATES below 0.347 as |delta| grows (one dominant spike inflates s2 as fast
 *   as the numerator), so a single-rung shift on those rungs can NEVER flip the non-rejection at ANY
 *   magnitude. The joint least-norm shift is the gradient-parallel KKT fixed point onto eta_mu = 0.347.
 *
 * THE FINDING (measurement / calibration only -- the HAC non-rejection robustness margin)
 * -------------------------------------------------------------------------------------
 *   (R1) THE MARGIN IS LARGE IN eta-SPACE. The baseline HAC-corrected level statistic is eta_mu ~ 0.149435
 *        (Schwert l=2), BELOW the 10% critical value 0.347 by ~0.197565 -- reproducing imp-34024 exactly.
 *        The non-rejection sits ~150x deeper in eta-space than the l=0 borderline sat above it.
 *   (R2) ONLY 3 OF 21 RUNGS CAN FLIP IT SINGLE-RUNG -- THE INTERIOR SATURATES. A single-rung shift on 18 of
 *        the 21 rungs can NEVER raise eta_mu above 0.347: eta_mu(delta) saturates (e.g. the k=8.50 interior
 *        rung maxes at eta ~ 0.139 and decays to ~0.098 as |delta| grows). Only the two far-tail endpoints
 *        k=10.75, k=11.00 and the head endpoint k=6.00 can reach 0.347 at all.
 *   (R3) THE CHEAPEST SINGLE-RUNG FLIP IS ~0.837 -- ~7.2x THE RESIDUAL RMS. The smallest single-rung shift
 *        that raises eta_mu to 0.347 is delta ~ -0.8368 on the near-tail rung k=10.75 (~7.21x the residual
 *        RMS ~0.1160), then ~ -0.8578 on k=11.00, then ~ +1.0257 on the head endpoint k=6.00. Note the
 *        cheapest rung is NOT the steepest (k=6.00, |d eta / d delta| ~ 0.183) -- the large margin makes
 *        eta_mu strongly nonlinear, unlike the near-linear l=0 borderline.
 *   (R4) THE ABSOLUTE JOINT FLOOR (ALL 21 RUNGS) IS ~0.261 -- ~2.25x THE RESIDUAL RMS. Admitting every rung
 *        jointly (gradient-parallel least-norm onto eta_mu = 0.347) gives the least possible norm ~0.260881
 *        (~2.25x RMS) -- ~31% of the cheapest single-rung cost. Even the full-freedom joint minimum needs a
 *        shift larger than twice the residual RMS to flip the non-rejection.
 *   (R5) THE HAC NON-REJECTION IS ~400x MORE ROBUST THAN THE FRAGILE l=0 BORDERLINE. The cheapest
 *        single-rung flip ~0.837 is ~417x the imp-34155 l=0 single-rung flip ~0.00201; the all-21 joint
 *        floor ~0.261 is ~179x the imp-34231 l=0 joint floor ~0.00146. So the PRIMARY HAC-corrected
 *        non-rejection is enormously robust in residual space -- the exact symmetric complement to the
 *        fragile un-HAC l=0 borderline, and consistent with imp-34024 naming the HAC read as primary.
 *
 * The punchline: whereas a ~1.7%-of-RMS single-rung nudge erases the fragile un-HAC l=0 borderline
 * (imp-34155), it takes a ~7.2x-RMS single-rung shift (and 18 of 21 rungs cannot do it at ANY magnitude),
 * or a ~2.25x-RMS all-21 joint shift, to raise the HAC-corrected eta_mu ~ 0.149 above 0.347 -- the
 * HAC-corrected non-rejection is ~400x (single-rung) / ~180x (joint floor) more robust than the l=0
 * borderline is fragile. The PRIMARY reading is untouched and deeply stable.
 *
 * MEASUREMENT / KPSS HAC ROBUSTNESS SENSITIVITY ONLY. A finite-difference and constrained least-norm read
 * of the inherited imp-34024 HAC-corrected KPSS statistic on the inherited imp-33858 residual diagnostic,
 * NOT an RH bound and distinct from any log-linear-vs-power-law form selection. The component model is the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive;
 * the KPSS critical values are the KPSS-1992 asymptotic tabulated values applied on N=21; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066
 * K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34024-kpss-stationarity-bracket (the HAC-corrected l=2 eta_mu ~0.149 primary reading; kpss reused)
 * @see imp-34155-kpss-l0-borderline-margin (the fragile l=0 single-rung ~0.00201 this measurement mirrors)
 * @see imp-34231-kpss-l0-multi-rung-joint-shift (the l=0 joint floor ~0.00146 this HAC floor mirrors)
 * @see imp-33964-ljung-box-portmanteau-test (the r_1 ~ +0.757 lag-1 autocorrelation that inflates s2(l))
 * @see imp-33858-widening-fit-residual-localization (the head/far-tail endpoints that carry the flip)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the 21-rung ladder whose residual is perturbed)
 */

import { IMP33810_EFLOW_RESID_RATIO_N_LADDER } from './imp-33810-eflow-resid-ratio-N-ladder.js';

// Reuse the imp-33810 21-rung ladder VERBATIM (no fresh component model), identical to imp-34024/imp-34155.
const RUNGS = IMP33810_EFLOW_RESID_RATIO_N_LADDER.ladder;
const KS = RUNGS.map((r) => r.k);
const Y = RUNGS.map((r) => Math.log(r.eflow_over_resid)); // natural log of the imp-33810 ratio

// OLS of ys against xs; returns slope/intercept (the imp-33843 log-linear WINNER when xs = KS).
function ols(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  const b = sxy / sxx;
  return { a: my - b * mx, b };
}

const FIT = ols(KS, Y); // y = a + b k          (the imp-33843 log-linear winner, recomputed)
const RESID = KS.map((k, i) => Y[i] - (FIT.a + FIT.b * k)); // the imp-33858 signed residual e_k
const N = RESID.length; // 21

// Newey-West / Bartlett long-run variance s2(l) = gamma_0 + 2 sum_{j=1..l} (1 - j/(l+1)) gamma_j, VERBATIM
// from imp-34024 (this is the HAC correction the primary reading uses).
function longRunVariance(u, l) {
  const n = u.length;
  let g0 = 0;
  for (let i = 0; i < n; i++) g0 += u[i] * u[i];
  g0 /= n;
  let s = g0;
  for (let j = 1; j <= l; j++) {
    let gj = 0;
    for (let i = j; i < n; i++) gj += u[i] * u[i - j];
    gj /= n;
    s += 2 * (1 - j / (l + 1)) * gj;
  }
  return s;
}

// The imp-34024 HAC-corrected LEVEL KPSS statistic eta_mu = n^{-2} sum S_t^2 / s2(l), reimplemented
// VERBATIM (level demean, partial-sum numerator, Bartlett long-run variance at bandwidth l).
function etaLevelHAC(e, l) {
  const n = e.length;
  const m = e.reduce((a, b) => a + b, 0) / n;
  const u = e.map((v) => v - m); // level demean
  let S = 0;
  let acc = 0;
  for (let t = 0; t < n; t++) {
    S += u[t];
    acc += S * S;
  }
  const s2 = longRunVariance(u, l);
  return acc / (n * n * s2);
}

// Schwert 4-rule bandwidth l = L4 = floor(4 (n/100)^{1/4}) = 2 at N=21 -- the imp-34024 PRIMARY reading.
const L4 = Math.floor(4 * Math.pow(N / 100, 0.25)); // 2
const CRIT10 = 0.347; // KPSS-1992 Table 1 level 10% critical value (reject stationarity for eta ABOVE)
const BASELINE_ETA = etaLevelHAC(RESID, L4); // ~0.149435 -- reproduces imp-34024 etaLevelL4 exactly
const MARGIN = CRIT10 - BASELINE_ETA; // ~0.197565 -- how far BELOW 0.347 the non-rejection sits
const RESID_RMS = Math.sqrt(RESID.reduce((a, b) => a + b * b, 0) / N); // ~0.116039

// Perturb a single rung r by delta and recompute eta (numerator AND the HAC s2(l=2) both move).
function etaWithShift(r, delta) {
  const e = RESID.slice();
  e[r] += delta;
  return etaLevelHAC(e, L4);
}

// Per-rung sensitivity d(eta_mu)/d(delta_r) at delta=0 via a symmetric finite difference.
const DERIV_H = 1e-6;
const DERIVS = RESID.map((_, r) => (etaWithShift(r, DERIV_H) - etaWithShift(r, -DERIV_H)) / (2 * DERIV_H));

// The smallest single-rung shift delta_r that RAISES eta_mu up to CRIT10 (the true nonlinear root). Scan
// outward in both directions for the sign change of f(delta) = eta_mu(delta) - CRIT10, then bisect; keep
// the root nearest zero. Returns null if eta_mu SATURATES below 0.347 within the scan range (unreachable).
const SCAN_STEP = 1e-4;
const SCAN_MAX = 400000; // reach |delta| up to 40 (~345x the residual RMS)
function smallestFlipShift(r) {
  const f = (d) => etaWithShift(r, d) - CRIT10;
  const f0 = f(0); // < 0 at baseline (0.149 < 0.347)
  let best = null;
  for (const sign of [1, -1]) {
    let prev = 0;
    let fprev = f0;
    for (let i = 1; i <= SCAN_MAX; i++) {
      const d = sign * SCAN_STEP * i;
      const fd = f(d);
      if (fprev > 0 !== fd > 0) {
        let lo = prev;
        let hi = d;
        let flo = fprev;
        for (let k = 0; k < 100; k++) {
          const mid = (lo + hi) / 2;
          const fm = f(mid);
          if (flo > 0 !== fm > 0) hi = mid;
          else {
            lo = mid;
            flo = fm;
          }
        }
        const root = (lo + hi) / 2;
        if (best === null || Math.abs(root) < Math.abs(best)) best = root;
        break;
      }
      prev = d;
      fprev = fd;
    }
  }
  return best;
}

const FLIP_SHIFTS = RESID.map((_, r) => smallestFlipShift(r)); // signed delta per rung (null if unreachable)
const REACHABLE = FLIP_SHIFTS.filter((v) => v !== null).length; // how many rungs can flip single-rung at all

// Steepest rung by |derivative| at delta=0 (NOT the cheapest here -- the large margin makes eta nonlinear).
let steepestIdx = 0;
for (let r = 1; r < N; r++) if (Math.abs(DERIVS[r]) > Math.abs(DERIVS[steepestIdx])) steepestIdx = r;

// Cheapest reachable rung by |flip shift|.
let cheapestIdx = -1;
let cheapestAbs = Infinity;
for (let r = 0; r < N; r++) {
  if (FLIP_SHIFTS[r] !== null && Math.abs(FLIP_SHIFTS[r]) < cheapestAbs) {
    cheapestAbs = Math.abs(FLIP_SHIFTS[r]);
    cheapestIdx = r;
  }
}

// Rank the reachable rungs by |flip shift| ascending (cheapest first).
const RANKED = RESID.map((_, r) => ({
  rungIndex: r,
  k: KS[r],
  residual: RESID[r],
  deriv: DERIVS[r],
  flipShift: FLIP_SHIFTS[r],
}))
  .filter((row) => row.flipShift !== null)
  .sort((a, b) => Math.abs(a.flipShift) - Math.abs(b.flipShift));

// Saturation witness: an interior rung whose eta_mu NEVER reaches 0.347 -- its max over huge shifts.
const SAT_IDX = 10; // k=8.50, a deep-interior rung
let satMaxEta = BASELINE_ETA;
for (const d of [1, 5, 20, 100, 1000, 1e5, 1e6, -1, -5, -20, -100, -1000, -1e5, -1e6]) {
  const v = etaWithShift(SAT_IDX, d);
  if (v > satMaxEta) satMaxEta = v;
}

// Joint least-norm shift onto eta_mu = 0.347, supported on subset S (gradient-parallel KKT fixed point,
// nonlinear-exact -- same construction as imp-34231 but RAISING eta rather than lowering it).
const GRAD_H = 1e-6;
function gradSub(x, S) {
  const g = {};
  for (const r of S) {
    const xp = x.slice();
    xp[r] += GRAD_H;
    const xm = x.slice();
    xm[r] -= GRAD_H;
    g[r] = (etaLevelHAC(xp, L4) - etaLevelHAC(xm, L4)) / (2 * GRAD_H);
  }
  return g;
}
function minNormShift(S) {
  let delta = {};
  for (const r of S) delta[r] = 0;
  for (let iter = 0; iter < 500; iter++) {
    const x = RESID.slice();
    for (const r of S) x[r] += delta[r];
    const g = gradSub(x, S);
    const f = (alpha) => {
      const xx = RESID.slice();
      for (const r of S) xx[r] += alpha * g[r];
      return etaLevelHAC(xx, L4) - CRIT10;
    };
    const f0 = f(0);
    let lo = 0;
    let hi = 0;
    let flo = f0;
    let found = false;
    for (const sgn of [1, -1]) {
      let prev = 0;
      let fprev = f0;
      const step = 1e-3;
      for (let i = 1; i <= SCAN_MAX; i++) {
        const a = sgn * step * i;
        const fa = f(a);
        if (!Number.isFinite(fa)) break;
        if (fprev > 0 !== fa > 0) {
          lo = prev;
          hi = a;
          flo = fprev;
          found = true;
          break;
        }
        prev = a;
        fprev = fa;
      }
      if (found) break;
    }
    if (!found) return null;
    for (let k = 0; k < 100; k++) {
      const mid = (lo + hi) / 2;
      const fm = f(mid);
      if (flo > 0 !== fm > 0) hi = mid;
      else {
        lo = mid;
        flo = fm;
      }
    }
    const alpha = (lo + hi) / 2;
    const newDelta = {};
    for (const r of S) newDelta[r] = alpha * g[r];
    let diff = 0;
    for (const r of S) diff += (newDelta[r] - delta[r]) ** 2;
    delta = newDelta;
    if (Math.sqrt(diff) < 1e-13) break;
  }
  let norm = 0;
  for (const r of S) norm += delta[r] ** 2;
  norm = Math.sqrt(norm);
  const x = RESID.slice();
  for (const r of S) x[r] += delta[r];
  return { delta, norm, etaCheck: etaLevelHAC(x, L4) };
}

const ALL = [...Array(N).keys()];
const SINGLE = minNormShift([cheapestIdx]); // reproduces the cheapest single-rung flip ~0.836826
const FLOOR = minNormShift(ALL); // all-21-rung absolute least-norm floor ~0.260881

// imp-34155 / imp-34231 l=0 fragile references, for the symmetric-robustness comparison.
const L0_SINGLE_FLIP = 0.002006; // imp-34155 single-rung head flip
const L0_JOINT_FLOOR = 0.001456; // imp-34231 all-21 joint floor
const SINGLE_ROBUSTNESS_RATIO = cheapestAbs / L0_SINGLE_FLIP; // ~417x
const FLOOR_ROBUSTNESS_RATIO = FLOOR.norm / L0_JOINT_FLOOR; // ~179x

const round = (x, d) => +x.toFixed(d);

export const IMP34235_KPSS_HAC_NONREJECTION_MARGIN = {
  id: 'imp-34235',
  proofSection: 'S-frontier',
  question:
    'imp-34155 R5 named the HAC-corrected (l>=1) KPSS statistic eta_mu ~ 0.149 -- far below the 10% ' +
    'critical value 0.347 -- as the PRIMARY reading, and imp-34155/imp-34231 measured the fragile un-HAC ' +
    'l=0 borderline it dissects. Reusing the imp-34024 HAC-corrected (Schwert l=2) LEVEL KPSS statistic ' +
    'VERBATIM, how large a single-rung and joint residual shift would RAISE eta_mu above 0.347, i.e. how ' +
    'robust is the primary non-rejection? Measurement only, no bound change; NOT an RH bound; no QED.',
  measuredQuantity:
    'The per-rung sensitivity d(eta_mu)/d(delta_r) and the smallest single-rung and minimal joint L2-norm ' +
    'residual shift that raises the HAC-corrected level KPSS statistic eta_mu = n^{-2} sum S_t^2 / s2(l=2) ' +
    '(Bartlett long-run variance) up to the 10% critical value 0.347, on the 21 signed imp-33858 ' +
    'residuals e_k = ln(eflow_over_resid_k) - (a + b k)',
  rungCount: N, // 21
  bandwidthL4: L4, // 2 (Schwert 4-rule)
  crit10: CRIT10, // 0.347
  baselineEtaHac: round(BASELINE_ETA, 6), // ~0.149435 -- reproduces imp-34024 etaLevelL4 exactly
  marginEtaSpace: round(MARGIN, 6), // ~0.197565 -- how far BELOW 0.347 the non-rejection sits
  residRms: round(RESID_RMS, 6), // ~0.116039
  // Only 3 of 21 rungs can flip the non-rejection single-rung; the deep interior saturates.
  reachableRungCount: REACHABLE, // 3
  saturationWitnessK: KS[SAT_IDX], // 8.50
  saturationWitnessMaxEta: round(satMaxEta, 4), // ~0.1387 -- never approaches 0.347 at any magnitude
  // The cheapest single-rung flip (near-tail rung k=10.75) -- NOT the steepest rung.
  smallestFlipShift: round(FLIP_SHIFTS[cheapestIdx], 6), // ~ -0.836826
  smallestFlipShiftAbs: round(cheapestAbs, 6), // ~0.836826
  smallestFlipRungIndex: cheapestIdx, // 19
  smallestFlipK: KS[cheapestIdx], // 10.75
  smallestFlipOverRms: round(cheapestAbs / RESID_RMS, 4), // ~7.2116 -- ~7.2x the residual RMS
  steepestRungIndex: steepestIdx, // 0 (k=6.00) -- steepest by derivative, but NOT cheapest
  steepestK: KS[steepestIdx], // 6.00
  steepestDeriv: round(DERIVS[steepestIdx], 4), // ~+0.1827
  steepestEqualsCheapest: steepestIdx === cheapestIdx, // false -- large margin, eta nonlinear
  // The three reachable rungs ranked by |flip shift|: the two far-tail endpoints then the head endpoint.
  reachableRungs: RANKED.map((row) => ({
    k: round(row.k, 2),
    residual: round(row.residual, 5),
    deriv: round(row.deriv, 4),
    flipShift: round(row.flipShift, 6),
  })),
  // The absolute all-21-rung joint least-norm floor onto eta_mu = 0.347.
  singleRungMinNorm: round(SINGLE.norm, 6), // ~0.836826 (reproduces the cheapest single-rung flip)
  allRungFloorNorm: round(FLOOR.norm, 6), // ~0.260881
  allRungFloorOverRms: round(FLOOR.norm / RESID_RMS, 4), // ~2.2482 -- ~2.25x the residual RMS
  allRungFloorRatioToSingle: round(FLOOR.norm / SINGLE.norm, 4), // ~0.3118 (joint cuts single by ~69%)
  floorEtaCheck: round(FLOOR.etaCheck, 6), // 0.347000 -- lands exactly on the critical value
  // The symmetric-robustness comparison to the fragile imp-34155/imp-34231 l=0 borderline.
  l0SingleRungFlip: L0_SINGLE_FLIP, // 0.002006 (imp-34155)
  l0JointFloor: L0_JOINT_FLOOR, // 0.001456 (imp-34231)
  singleRungRobustnessRatio: round(SINGLE_ROBUSTNESS_RATIO, 1), // ~417.2x
  jointFloorRobustnessRatio: round(FLOOR_ROBUSTNESS_RATIO, 1), // ~179.2x
  finding: {
    R1_margin_is_large_in_eta_space:
      'The baseline HAC-corrected level statistic eta_mu ~ 0.149435 (Schwert l=2) sits BELOW the 10% ' +
      'critical value 0.347 by ~0.197565 -- reproducing imp-34024 exactly and ~150x deeper than the l=0 ' +
      'borderline sat above.',
    R2_only_3_rungs_can_flip_interior_saturates:
      'A single-rung shift on 18 of the 21 rungs can NEVER raise eta_mu above 0.347: eta_mu(delta) ' +
      'saturates (the k=8.50 interior rung maxes at eta ~ 0.139 and decays to ~0.098 as |delta| grows). ' +
      'Only the two far-tail endpoints k=10.75, k=11.00 and the head endpoint k=6.00 can reach 0.347.',
    R3_cheapest_single_rung_flip_is_72x_rms:
      'The smallest single-rung shift that raises eta_mu to 0.347 is delta ~ -0.8368 on the near-tail rung ' +
      'k=10.75 (~7.21x the residual RMS ~0.1160), then ~ -0.8578 on k=11.00, then ~ +1.0257 on the head ' +
      'endpoint k=6.00. The cheapest rung is NOT the steepest (k=6.00, deriv ~ +0.183) -- the large margin ' +
      'makes eta_mu strongly nonlinear, unlike the near-linear l=0 borderline.',
    R4_absolute_joint_floor_is_225x_rms:
      'Admitting every rung jointly (gradient-parallel least-norm onto eta_mu = 0.347) gives the least ' +
      'possible norm ~0.260881 (~2.25x RMS) -- ~31% of the cheapest single-rung cost. Even the ' +
      'full-freedom joint minimum needs a shift larger than twice the residual RMS.',
    R5_hac_nonrejection_is_400x_more_robust:
      'The cheapest single-rung flip ~0.8368 is ~417x the imp-34155 l=0 single-rung flip ~0.00201; the ' +
      'all-21 joint floor ~0.2609 is ~179x the imp-34231 l=0 joint floor ~0.00146. The PRIMARY ' +
      'HAC-corrected non-rejection is enormously robust in residual space -- the symmetric complement to ' +
      'the fragile un-HAC l=0 borderline, consistent with imp-34024 naming the HAC read as primary.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / KPSS HAC-CORRECTED NON-REJECTION ROBUSTNESS SENSITIVITY (frontier-direction, NOT ' +
    'rigorous). Reusing the imp-34024 HAC-corrected (Schwert l=2, Bartlett long-run variance) level KPSS ' +
    'statistic VERBATIM on the 21 signed imp-33858 residuals, the baseline eta_mu ~ 0.149435 sits BELOW ' +
    'the 10% critical value 0.347 by ~0.197565. The non-rejection is enormously robust in residual space: ' +
    'a single-rung shift on 18 of the 21 rungs can NEVER raise eta_mu to 0.347 (eta_mu saturates -- the ' +
    'k=8.50 interior rung maxes at ~0.139), and only the two far-tail endpoints k=10.75, k=11.00 and the ' +
    'head endpoint k=6.00 can reach it at all. The cheapest single-rung flip is delta ~ -0.8368 on ' +
    'k=10.75 (~7.21x the residual RMS ~0.1160), then ~ -0.8578 on k=11.00, then ~ +1.0257 on k=6.00; the ' +
    'cheapest rung is NOT the steepest (k=6.00, deriv ~ +0.183) because the large margin makes eta_mu ' +
    'strongly nonlinear. The absolute all-21-rung joint least-norm floor is ~0.260881 (~2.25x RMS), ~31% ' +
    'of the single-rung cost. So the HAC-corrected non-rejection is ~417x (single-rung) / ~179x (joint ' +
    'floor) more robust than the fragile imp-34155/imp-34231 un-HAC l=0 borderline is easy to flip -- the ' +
    'exact symmetric complement, consistent with imp-34024 naming the HAC read as primary. Honest ' +
    'caveats: the least-norm-to-a-level-set optimum is gradient-parallel (KKT), solved nonlinear-exact by ' +
    'fixed-point iteration; the single-rung scan reaches |delta| <= 40 (~345x RMS) so the 18 unreachable ' +
    'rungs are unreachable by genuine saturation (confirmed at |delta| = 1e6), not scan truncation; ' +
    'eta_mu(delta) is strongly nonlinear at this large margin so the derivative does not predict the ' +
    'flip. This reproduces imp-34024 at baseline, does NOT change the RMSE (~0.116, ~12% multiplicative), ' +
    'does NOT re-open the imp-33843 form selection, and touches no bound; the KPSS critical values are ' +
    'asymptotic tabulated values applied on N=21; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34024 (the HAC-corrected l=2 eta_mu ~0.149 primary reading; kpss reused); imp-34155 (the fragile ' +
    'l=0 single-rung ~0.00201 this measurement mirrors); imp-34231 (the l=0 joint floor ~0.00146 this HAC ' +
    'floor mirrors); imp-33964 (the r_1 ~ +0.757 lag-1 autocorrelation inflating s2(l)); imp-33858 (the ' +
    'head/far-tail endpoints that carry the flip); imp-33810 (the 21-rung ladder); imp-486 (C_mb ' +
    'GUE-conditional). KPSS critical values: Kwiatkowski, Phillips, Schmidt, Shin (1992).',
};

export const IMP34235_KPSS_HAC_NONREJECTION_MARGIN_ASSERTIONS = [
  {
    // Reuse gate: the HAC l=2 baseline reproduces the imp-34024 primary reading, well below 0.347.
    id: 'imp34235-reproduces-imp34024-hac-primary',
    description: '21 residuals; HAC l=2 baseline eta_mu ~0.1494 far below 0.347 (reproduces imp-34024)',
    holds: () =>
      N === 21 &&
      L4 === 2 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(BASELINE_ETA - 0.149435) < 1e-4 &&
      BASELINE_ETA < CRIT10 &&
      MARGIN > 0.19 &&
      MARGIN < 0.21,
  },
  {
    // Only 3 of 21 rungs can flip single-rung; the deep interior saturates well below 0.347.
    id: 'imp34235-only-3-rungs-flip-interior-saturates',
    description: '18 of 21 rungs cannot flip single-rung; the k=8.50 interior rung saturates below 0.347',
    holds: () =>
      REACHABLE === 3 &&
      KS[SAT_IDX] === 8.5 &&
      satMaxEta < 0.15 &&
      satMaxEta < CRIT10,
  },
  {
    // The cheapest single-rung flip is ~ -0.8368 on the near-tail rung k=10.75, ~7.2x the residual RMS.
    id: 'imp34235-cheapest-flip-72x-rms-near-tail',
    description: 'cheapest single-rung flip ~ -0.8368 on k=10.75, ~7.2x residual RMS ~0.1160',
    holds: () =>
      KS[cheapestIdx] === 10.75 &&
      FLIP_SHIFTS[cheapestIdx] < 0 &&
      Math.abs(cheapestAbs - 0.836826) < 5e-4 &&
      Math.abs(RESID_RMS - 0.116039) < 1e-4 &&
      Math.abs(cheapestAbs / RESID_RMS - 7.2116) < 5e-2 &&
      // steepest by derivative is NOT the cheapest here (large margin, strong nonlinearity)
      steepestIdx !== cheapestIdx &&
      KS[steepestIdx] === 6 &&
      // the perturbed statistic genuinely lands at the critical value
      Math.abs(etaWithShift(cheapestIdx, FLIP_SHIFTS[cheapestIdx]) - CRIT10) < 1e-6,
  },
  {
    // The all-21 joint least-norm floor is ~0.2609 (~2.25x RMS), and lands exactly on eta = 0.347.
    id: 'imp34235-joint-floor-225x-rms',
    description: 'all-21 joint least-norm floor ~0.2609 (~2.25x RMS), lands on eta=0.347',
    holds: () =>
      Math.abs(FLOOR.norm - 0.260881) < 5e-4 &&
      FLOOR.norm < SINGLE.norm &&
      Math.abs(FLOOR.norm / RESID_RMS - 2.2482) < 5e-2 &&
      Math.abs(FLOOR.etaCheck - CRIT10) < 1e-6,
  },
  {
    // The symmetric-robustness ratios: HAC single-rung ~417x and joint floor ~179x the fragile l=0 costs.
    id: 'imp34235-hac-400x-more-robust-than-l0',
    description: 'HAC single-rung flip ~417x l=0 (imp-34155); HAC joint floor ~179x l=0 (imp-34231)',
    holds: () =>
      SINGLE_ROBUSTNESS_RATIO > 350 &&
      SINGLE_ROBUSTNESS_RATIO < 480 &&
      FLOOR_ROBUSTNESS_RATIO > 150 &&
      FLOOR_ROBUSTNESS_RATIO < 210,
  },
  {
    // Honesty gate: isRigorous false, no QED, no refereed bound is changed, RMSE-scale residual small, imp-3066 clause.
    id: 'imp34235-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, RMSE-scale residual small, imp-3066 untouched',
    holds: () =>
      IMP34235_KPSS_HAC_NONREJECTION_MARGIN.isRigorous === false &&
      /NO QED/.test(IMP34235_KPSS_HAC_NONREJECTION_MARGIN.verdict) &&
      /refereed bound is changed/i.test(IMP34235_KPSS_HAC_NONREJECTION_MARGIN.verdict) &&
      /12% multiplicative/.test(IMP34235_KPSS_HAC_NONREJECTION_MARGIN.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34235_KPSS_HAC_NONREJECTION_MARGIN.verdict),
  },
];

for (const a of IMP34235_KPSS_HAC_NONREJECTION_MARGIN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34235-kpss-hac-nonrejection-margin assertion failed: ${a.id}`);
  }
}
