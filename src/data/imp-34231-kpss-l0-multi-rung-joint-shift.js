/**
 * @module imp-34231-kpss-l0-multi-rung-joint-shift
 *
 * imp-34231 (accuracy, frontier-direction): imp-34155 R3/R4 measured the SINGLE-rung borderline
 * fragility of the imp-34083/imp-34024 un-HAC l=0 KPSS statistic on the 21 signed imp-33858 residuals --
 * the smallest single-rung residual shift that drops eta_mu below the 10% critical value 0.347 is
 * delta ~ -0.00201 on the head endpoint k=6.00 (the most-leveraged rung), with the head neighbour k=6.25
 * and far-tail endpoint k=11.00 the next cheapest. This module extends that single-rung read to the
 * MULTI-rung analog: reusing the imp-34024 l=0 KPSS statistic VERBATIM, it measures the minimal joint
 * L2-norm perturbation spread across the head cluster (and optionally the far-tail endpoint) that drops
 * eta_mu below 0.347, and COMPARES its cost to the single-rung ~0.00201 -- answering whether spreading the
 * shift over several leveraged rungs erases the marginal 10% rejection more cheaply.
 *
 * WHY A JOINT SHIFT IS CHEAPER (min-norm to a level set lies along the gradient)
 * -----------------------------------------------------------------------------
 *   Minimizing ||delta||_2 subject to the single scalar constraint eta_mu(RESID + delta) = 0.347 (delta
 *   supported only on a chosen rung subset S) is a one-constraint least-norm problem; by the KKT
 *   condition the optimal delta is PARALLEL to the gradient of eta_mu at the solution, restricted to S.
 *   To first order the minimal norm is MARGIN / ||g_S|| where g_S is the eta-gradient restricted to S:
 *   admitting more rungs enlarges ||g_S||, so the required norm can only shrink. The single-rung head
 *   value MARGIN/|g_0| = 0.001280/0.6387 ~ 0.002004 reproduces imp-34155; adding rungs lowers it. Because
 *   eta_mu is nonlinear (numerator and the l=0 gamma_0 both move under the re-demean) the reported joint
 *   norms are the TRUE nonlinear least-norm solutions (fixed-point iteration: delta parallel to the local
 *   gradient), which agree with the MARGIN/||g_S|| linearization to ~0.4% at this tiny margin.
 *
 * THE FINDING (measurement / calibration only -- the multi-rung joint borderline cost)
 * -----------------------------------------------------------------------------------
 *   (R1) THE JOINT SHIFT IS CHEAPER, BUT ONLY MODESTLY. The minimal joint L2-norm shift over the head
 *        cluster + far-tail endpoint {k=6.00, 6.25, 11.00} that drops eta_mu below 0.347 is ~0.001655 --
 *        about 82.5% of the single-rung head cost ~0.002006, i.e. a ~17.5% saving. The head-pair-only
 *        {6.00, 6.25} joint shift is ~0.001748 (~87.1%, ~12.9% saving). So spreading the perturbation DOES
 *        erase the rejection more cheaply than the single-rung ~0.00201, but not dramatically so.
 *   (R2) THE HEAD ENDPOINT STILL CARRIES THE BULK. In the {6.00, 6.25, 11.00} joint direction the head
 *        endpoint component (~ -0.001364) is ~82% of the total 0.001655 norm; the head neighbour (~ -0.000771)
 *        and far-tail (~ +0.000534, OPPOSITE sign -- its gradient is negative) split the remainder. The
 *        borderline stays endpoint-driven and head-dominated, consistent with imp-34155 R4 / imp-33858.
 *   (R3) THE ABSOLUTE FLOOR (ALL 21 RUNGS) IS ~0.001456. Admitting every rung jointly gives the least
 *        possible norm ~0.001456 -- only ~72.5% of the single-rung cost. So even the full-freedom joint
 *        minimum cuts the single-rung cost by barely a quarter; the three-rung {6.00,6.25,11.00} subset
 *        already captures most of the reachable saving (82.5% vs the 72.5% floor).
 *   (R4) LINEAR AND NONLINEAR AGREE. The MARGIN/||g_S|| linearization gives 0.001743 (pair), 0.001648
 *        (head+far-tail) and 0.001448 (all-21), matching the nonlinear least-norm solves to ~0.4% -- the
 *        margin is so small that eta_mu is effectively linear over the perturbation, as imp-34155 R note.
 *   (R5) A CALIBRATION, NOT A NEW CLAIM. A least-norm sensitivity read of an inherited un-HAC diagnostic;
 *        reproduces the imp-34155 single-rung head cost at baseline, re-opens no imp-33843 form selection,
 *        and touches no bound. The HAC-corrected (l>=1) verdict -- eta_mu ~ 0.149 far below 0.347, KPSS
 *        fails to reject -- is UNCHANGED and remains the primary reading; only the l=0 un-HAC borderline
 *        is dissected.
 *
 * The punchline: the multi-rung joint minimal L2-norm shift erases the imp-34083/imp-34024 l=0 borderline
 * more cheaply than the single-rung ~0.00201, but only modestly -- the head-cluster + far-tail
 * {6.00,6.25,11.00} joint shift ~0.001655 is ~82.5% of the single-rung cost, and the absolute all-21-rung
 * floor ~0.001456 is ~72.5%. The head endpoint still carries ~82% of the joint norm, so the borderline
 * stays head-dominated and endpoint-driven; the HAC-corrected non-rejection is untouched.
 *
 * MEASUREMENT / KPSS l=0 LEAST-NORM SENSITIVITY ONLY. A constrained least-norm read of an inherited un-HAC
 * KPSS statistic on an inherited residual diagnostic, NOT an RH bound and distinct from any
 * log-linear-vs-power-law form selection. The component model is the inherited imp-3220/imp-3406
 * extrapolation, NOT a rigorous asymptotic; the OLS surrogate is descriptive; the KPSS critical values are
 * the KPSS-1992 asymptotic tabulated values applied on N=21; the C_mb GUE-conditional per imp-486 is
 * UNTOUCHED; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34155-kpss-l0-borderline-margin (the single-rung head shift ~0.00201 this multi-rung read extends)
 * @see imp-34024-kpss-stationarity-bracket (the l=0 eta_mu ~0.3483 borderline dissected; kpss reused)
 * @see imp-34083-kpss-bandwidth-sensitivity (R2 that isolated the sole rejection to the un-HAC l=0 cell)
 * @see imp-33858-widening-fit-residual-localization (the head/far-tail endpoints that dominate the shift)
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

// The imp-34024 level-variant KPSS statistic at l=0, reimplemented VERBATIM (demean, partial-sum
// numerator, l=0 long-run variance = raw sample variance gamma_0). eta_mu = n^{-2} sum S_t^2 / gamma_0.
function etaLevelL0(e) {
  const n = e.length;
  const m = e.reduce((a, b) => a + b, 0) / n;
  const u = e.map((v) => v - m); // level demean
  let g0 = 0;
  for (let i = 0; i < n; i++) g0 += u[i] * u[i];
  g0 /= n; // gamma_0 -- the l=0 long-run variance
  let S = 0;
  let acc = 0;
  for (let t = 0; t < n; t++) {
    S += u[t];
    acc += S * S;
  }
  return acc / (n * n * g0);
}

const CRIT10 = 0.347; // KPSS-1992 Table 1 level 10% critical value (reject stationarity for eta ABOVE)
const BASELINE_ETA = etaLevelL0(RESID); // ~0.348280 -- reproduces imp-34024/imp-34155 exactly
const MARGIN = BASELINE_ETA - CRIT10; // ~0.001280 -- the un-HAC borderline excess in eta-space
const RESID_RMS = Math.sqrt(RESID.reduce((a, b) => a + b * b, 0) / N); // ~0.116039

// eta-gradient at point x, restricted to the rung subset S (symmetric finite difference).
const GRAD_H = 1e-6;
function gradSub(x, S) {
  const g = {};
  for (const r of S) {
    const xp = x.slice();
    xp[r] += GRAD_H;
    const xm = x.slice();
    xm[r] -= GRAD_H;
    g[r] = (etaLevelL0(xp) - etaLevelL0(xm)) / (2 * GRAD_H);
  }
  return g;
}

// The minimal L2-norm perturbation supported ONLY on the subset S that drives eta_mu down to CRIT10.
// One-constraint least-norm: the optimal delta is parallel to the eta-gradient at the solution (KKT).
// Fixed-point iterate: at the current point take the restricted gradient, 1D-solve for the scalar that
// lands eta on CRIT10 along that direction, repeat until the direction stops moving. Nonlinear-exact.
function minNormShift(S) {
  let delta = {};
  for (const r of S) delta[r] = 0;
  for (let iter = 0; iter < 200; iter++) {
    const x = RESID.slice();
    for (const r of S) x[r] += delta[r];
    const g = gradSub(x, S);
    // f(alpha) = eta(RESID + alpha*g restricted to S) - CRIT10; solve f(alpha)=0 nearest 0.
    const f = (alpha) => {
      const xx = RESID.slice();
      for (const r of S) xx[r] += alpha * g[r];
      return etaLevelL0(xx) - CRIT10;
    };
    const f0 = f(0);
    let lo = 0;
    let hi = 0;
    let flo = f0;
    let found = false;
    for (const sgn of [-1, 1]) {
      let prev = 0;
      let fprev = f0;
      const step = 1e-3;
      for (let i = 1; i <= 200000; i++) {
        const a = sgn * step * i;
        const fa = f(a);
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
    if (Math.sqrt(diff) < 1e-12) break;
  }
  let norm = 0;
  for (const r of S) norm += delta[r] ** 2;
  norm = Math.sqrt(norm);
  const x = RESID.slice();
  for (const r of S) x[r] += delta[r];
  return { delta, norm, etaCheck: etaLevelL0(x) };
}

// Rung index map: head endpoint k=6.00 (0), head neighbour k=6.25 (1), far-tail endpoint k=11.00 (20).
const HEAD = 0;
const HEAD_NBR = 1;
const FAR_TAIL = N - 1;
const ALL = [...Array(N).keys()];

const SINGLE = minNormShift([HEAD]); // reproduces imp-34155 ~0.002006
const PAIR = minNormShift([HEAD, HEAD_NBR]); // head cluster only
const CLUSTER_TAIL = minNormShift([HEAD, HEAD_NBR, FAR_TAIL]); // head cluster + far-tail endpoint
const FLOOR = minNormShift(ALL); // all-21-rung absolute least-norm floor

// Linear MARGIN/||g_S|| estimates (baseline gradient), to show nonlinear correction is ~0.4%.
const GBASE = gradSub(RESID, ALL);
const gnorm = (S) => Math.sqrt(S.reduce((a, r) => a + GBASE[r] ** 2, 0));
const LIN_PAIR = MARGIN / gnorm([HEAD, HEAD_NBR]);
const LIN_CLUSTER_TAIL = MARGIN / gnorm([HEAD, HEAD_NBR, FAR_TAIL]);
const LIN_FLOOR = MARGIN / gnorm(ALL);

// Head-endpoint share of the {6.00,6.25,11.00} joint norm (endpoint dominance).
const HEAD_SHARE = Math.abs(CLUSTER_TAIL.delta[HEAD]) / CLUSTER_TAIL.norm;

const round = (x, d) => +x.toFixed(d);

export const IMP34231_KPSS_L0_MULTI_RUNG_JOINT_SHIFT = {
  id: 'imp-34231',
  proofSection: 'S-frontier',
  question:
    'imp-34155 R3/R4 measured only the SINGLE-rung borderline shift of the imp-34083/imp-34024 un-HAC ' +
    'l=0 KPSS statistic -- delta ~ -0.00201 on the head endpoint k=6.00. Reusing the imp-34024 l=0 KPSS ' +
    'statistic VERBATIM, what is the minimal JOINT L2-norm perturbation across the head cluster (and ' +
    'optionally the far-tail endpoint) that drops eta_mu below 0.347, and does it erase the marginal 10% ' +
    'rejection more cheaply than the single-rung ~0.00201? Measurement only, no bound change; NOT an RH ' +
    'bound; no QED.',
  measuredQuantity:
    'The minimal L2-norm residual perturbation supported on a chosen rung subset S (least-norm to the ' +
    'constraint surface eta_mu(RESID + delta) = 0.347, solved nonlinear-exact via the gradient-parallel ' +
    'KKT fixed point), for S = {head}, {head cluster}, {head cluster + far-tail}, and all 21 rungs, on ' +
    'the 21 signed imp-33858 residuals e_k = ln(eflow_over_resid_k) - (a + b k)',
  rungCount: N, // 21
  crit10: CRIT10, // 0.347
  baselineEtaL0: round(BASELINE_ETA, 6), // ~0.348280 -- reproduces imp-34024/imp-34155
  marginEtaSpace: round(MARGIN, 6), // ~0.001280
  residRms: round(RESID_RMS, 6), // ~0.116039
  // Single-rung head reference (reproduces imp-34155 ~0.002006).
  singleRungHeadNorm: round(SINGLE.norm, 6), // ~0.002006
  // Head-pair-only joint minimal shift {k=6.00, 6.25}.
  headPairJointNorm: round(PAIR.norm, 6), // ~0.001748
  headPairRatioToSingle: round(PAIR.norm / SINGLE.norm, 4), // ~0.8713 (~12.9% saving)
  headPairDeltaHead: round(PAIR.delta[HEAD], 6), // ~ -0.001522
  headPairDeltaNbr: round(PAIR.delta[HEAD_NBR], 6), // ~ -0.000860
  // Head cluster + far-tail joint minimal shift {k=6.00, 6.25, 11.00} -- the headline three-rung subset.
  clusterTailJointNorm: round(CLUSTER_TAIL.norm, 6), // ~0.001655
  clusterTailRatioToSingle: round(CLUSTER_TAIL.norm / SINGLE.norm, 4), // ~0.8248 (~17.5% saving)
  clusterTailDeltaHead: round(CLUSTER_TAIL.delta[HEAD], 6), // ~ -0.001364
  clusterTailDeltaNbr: round(CLUSTER_TAIL.delta[HEAD_NBR], 6), // ~ -0.000771
  clusterTailDeltaFarTail: round(CLUSTER_TAIL.delta[FAR_TAIL], 6), // ~ +0.000534 (OPPOSITE sign)
  headEndpointNormShare: round(HEAD_SHARE, 4), // ~0.8241 -- head carries ~82% of the joint norm
  clusterTailNormOverRms: round(CLUSTER_TAIL.norm / RESID_RMS, 5), // ~0.01426 (~1.4% of residual RMS)
  // Absolute all-21-rung least-norm floor.
  allRungFloorNorm: round(FLOOR.norm, 6), // ~0.001456
  allRungFloorRatioToSingle: round(FLOOR.norm / SINGLE.norm, 4), // ~0.7255 (~27.5% saving -- the floor)
  // Linear MARGIN/||g_S|| cross-checks (agree with nonlinear to ~0.4%).
  linearPairEst: round(LIN_PAIR, 6), // ~0.001743
  linearClusterTailEst: round(LIN_CLUSTER_TAIL, 6), // ~0.001648
  linearFloorEst: round(LIN_FLOOR, 6), // ~0.001448
  finding: {
    R1_joint_is_cheaper_but_modestly:
      'The minimal joint L2-norm shift over the head cluster + far-tail {k=6.00,6.25,11.00} that drops ' +
      'eta_mu below 0.347 is ~0.001655 -- about 82.5% of the single-rung head cost ~0.002006 (~17.5% ' +
      'saving); the head-pair-only {6.00,6.25} shift is ~0.001748 (~87.1%, ~12.9% saving). Spreading the ' +
      'perturbation DOES erase the rejection more cheaply than the single-rung ~0.00201, but not ' +
      'dramatically.',
    R2_head_endpoint_still_carries_the_bulk:
      'In the {6.00,6.25,11.00} joint direction the head endpoint component (~ -0.001364) is ~82% of the ' +
      'total 0.001655 norm; the head neighbour (~ -0.000771) and far-tail (~ +0.000534, OPPOSITE sign -- ' +
      'its gradient is negative) split the remainder. The borderline stays head-dominated and ' +
      'endpoint-driven, consistent with imp-34155 R4 / imp-33858.',
    R3_absolute_floor_all_rungs:
      'Admitting every rung jointly gives the least possible norm ~0.001456 -- only ~72.5% of the ' +
      'single-rung cost. Even the full-freedom joint minimum cuts the single-rung cost by barely a ' +
      'quarter; the three-rung {6.00,6.25,11.00} subset already captures most of the reachable saving ' +
      '(82.5% vs the 72.5% floor).',
    R4_linear_and_nonlinear_agree:
      'The MARGIN/||g_S|| linearization gives 0.001743 (pair), 0.001648 (head+far-tail) and 0.001448 ' +
      '(all-21), matching the nonlinear least-norm solves to ~0.4% -- the margin is so small that eta_mu ' +
      'is effectively linear over the perturbation, as imp-34155 noted.',
    R5_calibration_not_new_claim:
      'A least-norm sensitivity read of an inherited un-HAC diagnostic; reproduces the imp-34155 ' +
      'single-rung head cost at baseline, re-opens no imp-33843 form selection, touches no bound. The ' +
      'HAC-corrected (l>=1) verdict eta_mu ~ 0.149 far below 0.347 (KPSS fails to reject) is UNCHANGED ' +
      'and remains the primary reading.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / KPSS l=0 MULTI-RUNG JOINT LEAST-NORM SENSITIVITY (frontier-direction, NOT rigorous). ' +
    'Reusing the imp-34024 level-variant l=0 KPSS statistic VERBATIM on the 21 signed imp-33858 ' +
    'residuals, the minimal JOINT L2-norm shift that drops eta_mu below the 10% critical value 0.347 ' +
    'erases the borderline more cheaply than the single-rung ~0.00201, but only modestly: the head ' +
    'cluster + far-tail {k=6.00,6.25,11.00} joint shift is ~0.001655 (~82.5% of the single-rung head ' +
    'cost ~0.002006, a ~17.5% saving), the head-pair-only {6.00,6.25} shift is ~0.001748 (~87.1%), and ' +
    'the absolute all-21-rung least-norm floor is ~0.001456 (~72.5%). The head endpoint still carries ' +
    '~82% of the joint norm (its component ~ -0.001364 of the 0.001655 total), with the head neighbour ' +
    '~ -0.000771 and the far-tail ~ +0.000534 (OPPOSITE sign -- its gradient is negative) splitting the ' +
    'rest, so the borderline stays head-dominated and endpoint-driven, consistent with imp-34155 R4 / ' +
    'imp-33858. Honest caveats: the least-norm-to-a-level-set optimum is gradient-parallel (KKT), solved ' +
    'nonlinear-exact by fixed-point iteration; eta_mu(delta) is nonlinear (numerator and the l=0 gamma_0 ' +
    'both move under the re-demean) but the MARGIN/||g_S|| linearization agrees to ~0.4% at this tiny ' +
    'margin; the HAC-corrected (l>=1) non-rejection eta_mu ~ 0.149 is UNCHANGED and remains the primary ' +
    'reading. This reproduces imp-34024/imp-34083/imp-34155 at baseline, does NOT change the RMSE ' +
    '(~0.116, ~12% multiplicative), does NOT re-open the imp-33843 form selection, and touches no bound; ' +
    'the KPSS critical values are asymptotic tabulated values applied on N=21; the component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per ' +
    'imp-486 is UNTOUCHED; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-34155 (the single-rung head shift ~0.00201 this multi-rung read extends); imp-34024 (the l=0 ' +
    'eta_mu ~0.3483 borderline dissected; kpss reused); imp-34083 (R2 isolating the sole rejection to ' +
    'the un-HAC l=0 cell); imp-33858 (the head/far-tail endpoints that dominate the shift); imp-33810 ' +
    '(the 21-rung ladder); imp-486 (C_mb GUE-conditional). KPSS critical values: Kwiatkowski, Phillips, ' +
    'Schmidt, Shin (1992).',
};

export const IMP34231_KPSS_L0_MULTI_RUNG_JOINT_SHIFT_ASSERTIONS = [
  {
    // Reuse gate: baseline reproduces the imp-34024/imp-34155 l=0 borderline, and the single-rung head
    // least-norm reproduces the imp-34155 ~0.002006 flip shift exactly.
    id: 'imp34231-reproduces-imp34155-single-rung-head',
    description: '21 residuals; baseline eta_mu ~0.3483; single-rung head least-norm ~0.002006 (imp-34155)',
    holds: () =>
      N === 21 &&
      KS[0] === 6 &&
      KS[20] === 11 &&
      Math.abs(BASELINE_ETA - 0.348280) < 1e-4 &&
      Math.abs(SINGLE.norm - 0.002006) < 5e-5 &&
      Math.abs(SINGLE.etaCheck - CRIT10) < 1e-6,
  },
  {
    // The head-cluster + far-tail joint shift is CHEAPER than the single-rung, and lands on CRIT10.
    id: 'imp34231-cluster-tail-joint-cheaper-than-single',
    description: 'head+far-tail joint norm ~0.001655 (~82.5% of single), lands on eta=0.347',
    holds: () =>
      Math.abs(CLUSTER_TAIL.norm - 0.001655) < 3e-5 &&
      CLUSTER_TAIL.norm < SINGLE.norm &&
      Math.abs(CLUSTER_TAIL.norm / SINGLE.norm - 0.8248) < 5e-3 &&
      Math.abs(CLUSTER_TAIL.etaCheck - CRIT10) < 1e-6,
  },
  {
    // Monotone ladder of savings: single > head-pair > head+far-tail > all-21 floor, all above/at floor.
    id: 'imp34231-savings-ladder-monotone',
    description: 'single 0.002006 > pair 0.001748 > cluster+tail 0.001655 > all-21 floor 0.001456',
    holds: () =>
      SINGLE.norm > PAIR.norm &&
      PAIR.norm > CLUSTER_TAIL.norm &&
      CLUSTER_TAIL.norm > FLOOR.norm &&
      Math.abs(PAIR.norm - 0.001748) < 3e-5 &&
      Math.abs(FLOOR.norm - 0.001456) < 3e-5 &&
      Math.abs(FLOOR.norm / SINGLE.norm - 0.7255) < 5e-3,
  },
  {
    // The head endpoint still carries ~82% of the joint norm; the far-tail component has OPPOSITE sign.
    id: 'imp34231-head-dominates-far-tail-opposite-sign',
    description: 'head ~82% of joint norm; head/nbr shifts negative, far-tail positive (opposite gradient)',
    holds: () =>
      Math.abs(HEAD_SHARE - 0.8241) < 5e-3 &&
      CLUSTER_TAIL.delta[HEAD] < 0 &&
      CLUSTER_TAIL.delta[HEAD_NBR] < 0 &&
      CLUSTER_TAIL.delta[FAR_TAIL] > 0 &&
      Math.abs(CLUSTER_TAIL.delta[HEAD]) > Math.abs(CLUSTER_TAIL.delta[HEAD_NBR]),
  },
  {
    // Linear MARGIN/||g_S|| cross-checks agree with the nonlinear least-norm solves to ~0.4%.
    id: 'imp34231-linear-matches-nonlinear',
    description: 'MARGIN/||g_S|| linearization matches the nonlinear joint norms to ~0.4%',
    holds: () =>
      Math.abs(LIN_PAIR - PAIR.norm) / PAIR.norm < 6e-3 &&
      Math.abs(LIN_CLUSTER_TAIL - CLUSTER_TAIL.norm) / CLUSTER_TAIL.norm < 6e-3 &&
      Math.abs(LIN_FLOOR - FLOOR.norm) / FLOOR.norm < 6e-3,
  },
  {
    // Honesty gate: isRigorous false, no QED, no refereed bound is changed, RMSE-scale residual small, imp-3066 clause.
    id: 'imp34231-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed, RMSE-scale residual small, imp-3066 untouched',
    holds: () =>
      IMP34231_KPSS_L0_MULTI_RUNG_JOINT_SHIFT.isRigorous === false &&
      /NO QED/.test(IMP34231_KPSS_L0_MULTI_RUNG_JOINT_SHIFT.verdict) &&
      /refereed bound is changed/i.test(IMP34231_KPSS_L0_MULTI_RUNG_JOINT_SHIFT.verdict) &&
      /12% multiplicative/.test(IMP34231_KPSS_L0_MULTI_RUNG_JOINT_SHIFT.verdict) &&
      /imp-3066 K_a >= 0 untouched/.test(IMP34231_KPSS_L0_MULTI_RUNG_JOINT_SHIFT.verdict),
  },
];

for (const a of IMP34231_KPSS_L0_MULTI_RUNG_JOINT_SHIFT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34231-kpss-l0-multi-rung-joint-shift assertion failed: ${a.id}`);
  }
}
