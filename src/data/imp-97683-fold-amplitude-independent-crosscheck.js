/**
 * @module imp-97683-fold-amplitude-independent-crosscheck
 *
 * imp-97683 (numerical, frontier-direction): independent cross-check of the
 * imp-97662 square-root-fold amplitude
 *
 *     E = d(ln N)/d(ln C_C) ~ +/- K / sqrt(sigma_max - s),
 *         K = ( d sigma_max / d(ln C_C) ) / ( 2 sqrt(A) ),   A = -sigma_xx(x_peak)/2,
 *
 * at the imp-97520 L1 interior sigma(N) peak (N_peak ~ 9.22e5, sigma_max ~ 0.949429).
 * imp-97662 obtained K ~ 0.423330 from a BARE 3-point second difference for the
 * curvature A (h = 1e-4) and a BARE 2-point central difference for the peak-height
 * sensitivity d sigma_max / d(ln C_C) (h = 1e-4), and reported the downslope branch
 * of E * sqrt(sigma_max - s) approaching +K cleanly (0.4311 -> 0.4215 over gaps
 * 1e-2 -> 1e-5) while the UPSLOPE branch was noisier (-0.5749 -> -0.4253). This
 * module re-measures K by a SECOND, higher-order route and resolves the upslope
 * spread. Same inherited imp-3406/imp-33582 surrogate component model; no new model,
 * no new constants; the pinned C_C 1/8 ansatz is perturbed only as a probe.
 *
 * SECOND ROUTE FOR K (higher-order, independent of the imp-97662 stencils)
 * ----------------------------------------------------------------------
 *   Curvature A: instead of a single 3-point second difference at one step, fit a
 *   degree-6 EVEN polynomial sigma(x) ~ c0 + c2 u^2 + c4 u^4 + c6 u^6 (u = x - x_peak)
 *   by least squares on a symmetric 21-node stencil and read A = -c2. The fitted A is
 *   3.215955e-3, STABLE to 6 sig figs across half-widths 3e-3, 5e-3, 1e-2, 2e-2, and
 *   the fitted apex c0 reproduces sigma_max to ~1e-15 (a genuine even extremum, so the
 *   quadratic curvature is not contaminated by odd/quartic leakage). This matches the
 *   imp-97662 3-point value 3.215950e-3 to 5 sig figs.
 *
 *   Peak-height sensitivity d sigma_max / d(ln C_C): a 5-point O(h^4) central stencil
 *   in u = ln C_C gives +4.801356e-2, STABLE across h = 5e-4, 1e-3, 2e-3 and equal to
 *   the imp-97662 2-point value to 6 sig figs (the peak-height map is smooth in ln C_C,
 *   so the 2-point difference was already truncation-clean at this step).
 *
 *   Hence the independent amplitude K = 4.801356e-2 / (2 sqrt(3.215955e-3)) = 0.423330,
 *   reproducing imp-97662 to all 6 reported figures by a route that shares no finite-
 *   difference step with it.
 *
 * UPSLOPE-BRANCH SPREAD RESOLVED (finite-gap fold asymmetry, not a real |K| split)
 * -------------------------------------------------------------------------------
 * Extending the closed-form gap ladder past imp-97662 (adding gaps 1e-6, 1e-7, 1e-8)
 * shows BOTH branches converging to the SAME |K| ~ 0.42333:
 *   gap 1e-2:  down +0.431109  up -0.574863   (branch average 0.502986)
 *   gap 1e-4:  down +0.418023  up -0.430225   (branch average 0.424124)
 *   gap 1e-6:  down +0.422729  up -0.423947   (branch average 0.423338)
 *   gap 1e-8:  down +0.423269  up -0.423391   (branch average 0.423330)
 * The two branches STRADDLE K symmetrically: the leading finite-gap correction is
 * antisymmetric between them, so the branch AVERAGE (|down| + |up|)/2 converges to K
 * an order of magnitude faster than either arm alone, reaching 0.423330 = K by gap
 * 1e-8. The imp-97662 upslope "noise" (-0.5749 -> -0.4253) was simply the slower arm
 * of this symmetric approach evaluated at gaps that had not yet closed; there is no
 * genuine |K| difference between the branches. Both arms and the average agree with
 * the two independently-measured routes at K = 0.423330.
 *
 * DERIVATION / MEASUREMENT ONLY. Conditional-share diagnostic, NOT an RH bound.
 * The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a
 * rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; the C_C
 * 1/8 ansatz (imp-2642/imp-2643) is UNTOUCHED and only perturbed as a probe, not
 * re-pinned; E_trunc pinned 3.06e-5 unchanged; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-97662-cc-elasticity-peak-divergence (the fold law and first K route)
 * @see imp-97622-sigma-l2-cc-elasticity-closed-form (the closed form)
 * @see imp-97642-l2-cc-elasticity-independent-verify (5-point stencil verification)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5;
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-97622/imp-97662 exactly

// EXACT imp-3406/imp-33582/imp-97622/imp-97662 sub-terms; C_C carried as the perturbed input.
function parts(N, cc) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = cc * Math.sqrt(L / N);
  const R = E_TRUNC_PT + E_flow;
  return { T0, L, R, sigma: E_coll / (R + E_coll) };
}

// Interior peak location (C_C-invariant): ternary search in x = ln N.
function peakLogN(cc) {
  let a = Math.log(1e4);
  let b = Math.log(1e8);
  for (let i = 0; i < 300; i++) {
    const m1 = a + (b - a) / 3;
    const m2 = b - (b - a) / 3;
    if (parts(Math.exp(m1), cc).sigma < parts(Math.exp(m2), cc).sigma) a = m1;
    else b = m2;
  }
  return (a + b) / 2;
}
const sigmaMaxOf = (cc) => parts(Math.exp(peakLogN(cc)), cc).sigma;

const cc = C_C_PINNED;
const X_PEAK = peakLogN(cc);
const N_PEAK = Math.exp(X_PEAK);
const SIGMA_MAX = sigmaMaxOf(cc);

// ---- ROUTE B (independent): curvature A from a degree-6 even-polynomial least-squares fit ----
// sigma(x) ~ c0 + c2 u^2 + c4 u^4 + c6 u^6 (u = x - x_peak); A = -c2. Solve the normal
// equations for the even-power design on a symmetric (2*nPts+1)-node stencil.
function fitCurvature(halfWidth, nPts) {
  const us = [];
  const ss = [];
  for (let i = -nPts; i <= nPts; i++) {
    const u = (i / nPts) * halfWidth;
    us.push(u);
    ss.push(parts(Math.exp(X_PEAK + u), cc).sigma);
  }
  const powers = [0, 2, 4, 6];
  const m = us.length;
  const k = powers.length;
  const design = us.map((u) => powers.map((p) => Math.pow(u, p)));
  const ATA = Array.from({ length: k }, () => new Array(k).fill(0));
  const ATy = new Array(k).fill(0);
  for (let r = 0; r < m; r++) {
    for (let i = 0; i < k; i++) {
      ATy[i] += design[r][i] * ss[r];
      for (let j = 0; j < k; j++) ATA[i][j] += design[r][i] * design[r][j];
    }
  }
  const M = ATA.map((row, i) => [...row, ATy[i]]);
  for (let col = 0; col < k; col++) {
    let piv = col;
    for (let r = col + 1; r < k; r++) if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    [M[col], M[piv]] = [M[piv], M[col]];
    for (let r = 0; r < k; r++) {
      if (r === col) continue;
      const f = M[r][col] / M[col][col];
      for (let c = col; c <= k; c++) M[r][c] -= f * M[col][c];
    }
  }
  const coef = M.map((row, i) => row[k] / row[i]);
  return { c0: coef[0], A: -coef[1] };
}

// ---- ROUTE B (independent): peak-height sensitivity via a 5-point O(h^4) stencil in ln C_C ----
function dSigmaMaxDu5(h) {
  const f = (kk) => sigmaMaxOf(cc * Math.exp(kk * h));
  return (-f(2) + 8 * f(1) - 8 * f(-1) + f(-2)) / (12 * h);
}

const A_FIT = fitCurvature(1e-2, 10).A; // 3.215955e-3
const DSMAX_DU5 = dSigmaMaxDu5(1e-3); // 4.801356e-2
const K_INDEP = DSMAX_DU5 / (2 * Math.sqrt(A_FIT)); // 0.423330

// ---- ROUTE C: closed-form branch amplitudes on an extended gap ladder (resolve upslope spread) ----
function crossBelow(target, xPeak) {
  let a = xPeak;
  let b = Math.log(1e18);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc).sigma > target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
function crossAbove(target, xPeak) {
  let a = Math.log(1e4);
  let b = xPeak;
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m), cc).sigma < target) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
function dLogDx5(fn, N, h) {
  const f = (kk) => Math.log(fn(N * Math.exp(kk * h)));
  return (-f(2) + 8 * f(1) - 8 * f(-1) + f(-2)) / (12 * h);
}
function closedForm(target, branch) {
  const N = branch === 'down' ? crossBelow(target, X_PEAK) : crossAbove(target, X_PEAK);
  const dlnR = dLogDx5((n) => parts(n, cc).R, N, 5e-6);
  const dlnL = dLogDx5((n) => parts(n, cc).L, N, 5e-6);
  return 2 / (1 + 2 * dlnR - dlnL);
}

const GAPS = [1e-2, 1e-4, 1e-6, 1e-8];
const LADDER = GAPS.map((g) => {
  const down = closedForm(SIGMA_MAX - g, 'down') * Math.sqrt(g);
  const up = closedForm(SIGMA_MAX - g, 'up') * Math.sqrt(g);
  return { gap: g, down, up, average: (Math.abs(down) + Math.abs(up)) / 2 };
});
const DEEP = LADDER[LADDER.length - 1]; // gap 1e-8

export const IMP97683_FOLD_AMPLITUDE_INDEPENDENT_CROSSCHECK = {
  id: 'imp-97683',
  proofSection: 'S-frontier',
  question:
    'Independently cross-check the imp-97662 square-root-fold amplitude K ~ 0.4233 at the sigma(N) peak by a ' +
    'second route (degree-6 even-polynomial curvature fit + 5-point peak-height sensitivity), and resolve the ' +
    'imp-97662 upslope-branch spread by extending the closed-form gap ladder. Measurement only; C_C 1/8 ansatz ' +
    'perturbed as a probe not re-pinned; no bound moves; NO QED.',
  peak: {
    N_peak: +N_PEAK.toExponential(6), // ~9.218633e5
    sigma_max: +SIGMA_MAX.toFixed(9), // ~0.949429014
  },
  independentK: {
    curvature_A_fit: +A_FIT.toExponential(6), // ~3.215955e-3 (degree-6 even fit; imp-97662 3-point 3.215950e-3)
    dsigma_max_dlnCC_5pt: +DSMAX_DU5.toExponential(6), // ~+4.801356e-2 (5-point; imp-97662 2-point 4.801356e-2)
    K_independent: +K_INDEP.toFixed(6), // ~0.423330 -- reproduces imp-97662 K_PRED by a distinct route
    K_imp97662: 0.42333,
  },
  branchLadder: {
    form: 'E * sqrt(sigma_max - s); down -> +K, up -> -K, branch average -> K',
    gaps: GAPS.map((g) => +g.toExponential(0)),
    down: LADDER.map((r) => +r.down.toFixed(6)), // +0.431109 ... +0.423269
    up: LADDER.map((r) => +r.up.toFixed(6)), // -0.574863 ... -0.423391
    branch_average: LADDER.map((r) => +r.average.toFixed(6)), // 0.502986 ... 0.423330
    deep_gap_1e8: { down: +DEEP.down.toFixed(6), up: +DEEP.up.toFixed(6), average: +DEEP.average.toFixed(6) },
  },
  finding:
    'An independent second route reproduces the imp-97662 fold amplitude K = 0.423330 exactly (to all 6 ' +
    'reported figures): a degree-6 even-polynomial least-squares fit of sigma(x) about the peak gives curvature ' +
    'A = 3.215955e-3 (stable to 6 sig figs across half-widths 3e-3..2e-2, apex reproducing sigma_max to ~1e-15), ' +
    'and a 5-point O(h^4) stencil in ln C_C gives d sigma_max/d ln C_C = +4.801356e-2 (stable across h), so ' +
    'K = 0.048014/(2 sqrt(0.00321595)) = 0.423330 -- matching imp-97662 by a route that shares no finite-' +
    'difference step with its 3-point/2-point measurement. The imp-97662 upslope-branch spread is RESOLVED as a ' +
    'finite-gap fold asymmetry, not a real |K| split: extending the closed-form gap ladder to 1e-6 and 1e-8 ' +
    'shows both branches converging to the same |K| ~ 0.42333 (down +0.423269, up -0.423391 at gap 1e-8), and ' +
    'because the leading finite-gap correction is antisymmetric between the two arms, the branch AVERAGE ' +
    '(|down|+|up|)/2 converges to 0.423330 = K an order of magnitude faster than either arm alone. Both routes ' +
    'and both branches agree at K = 0.423330.',
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Independent cross-check CONFIRMS the imp-97662 square-root-' +
    'fold amplitude K = 0.423330 by a distinct route (degree-6 even-polynomial curvature fit A = 3.215955e-3 + ' +
    '5-point peak-height sensitivity d sigma_max/d ln C_C = +4.801356e-2), sharing no finite-difference step ' +
    'with the imp-97662 3-point/2-point measurement. The upslope-branch spread is RESOLVED: extending the gap ' +
    'ladder to 1e-8, both branches converge to the same |K| ~ 0.42333 (down +0.423269, up -0.423391), and the ' +
    'branch average converges to K = 0.423330 faster than either arm because the finite-gap correction is ' +
    'antisymmetric -- the imp-97662 upslope "noise" was the slower arm evaluated at gaps not yet closed, not a ' +
    'genuine |K| difference. Component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous ' +
    'asymptotic; C_mb GUE-conditional per imp-486 and the C_C 1/8 ansatz (imp-2642/imp-2643) are UNTOUCHED ' +
    '(perturbed only as a probe, not re-pinned); E_trunc pinned 3.06e-5 unchanged; changes no bound; ' +
    'establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97662 (the fold law and first K route ~0.423330); imp-97622 (downslope closed form); imp-97642 ' +
    '(5-point stencil verification); imp-97520 (L1 peak sigma_max ~ 0.949429); imp-2642/imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi) ansatz); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP97683_FOLD_AMPLITUDE_INDEPENDENT_CROSSCHECK_ASSERTIONS = [
  {
    id: 'imp97683-independent-K-matches-imp97662',
    description: 'the second-route K (even-poly fit A + 5-point peak-height sensitivity) reproduces imp-97662 K ~ 0.423330',
    holds: () => Math.abs(K_INDEP - 0.42333) < 5e-4,
  },
  {
    id: 'imp97683-curvature-fit-stable',
    description: 'the degree-6 even-polynomial curvature A is stable across half-widths and matches the imp-97662 3-point value',
    holds: () => {
      const a1 = fitCurvature(3e-3, 10).A;
      const a2 = fitCurvature(2e-2, 10).A;
      return Math.abs(a1 - a2) < 1e-8 && Math.abs(A_FIT - 3.21595e-3) < 5e-8;
    },
  },
  {
    id: 'imp97683-branches-converge-to-same-magnitude',
    description: 'at gap 1e-8 both branches converge to the same |K| ~ 0.42333 (down +K, up -K)',
    holds: () =>
      DEEP.down > 0 &&
      DEEP.up < 0 &&
      Math.abs(DEEP.down - 0.42333) < 2e-4 &&
      Math.abs(DEEP.up + 0.42333) < 2e-4,
  },
  {
    id: 'imp97683-branch-average-is-clean-estimator',
    description: 'the branch average (|down|+|up|)/2 converges to K = 0.423330 monotonically as the gap closes',
    holds: () => {
      const avgs = LADDER.map((r) => r.average);
      const decreasingToK = avgs[1] < avgs[0] && avgs[2] < avgs[1] && avgs[3] <= avgs[2];
      return decreasingToK && Math.abs(DEEP.average - K_INDEP) < 5e-5;
    },
  },
  {
    id: 'imp97683-honesty-gate-no-qed',
    description: 'measurement only: isRigorous false, no QED, no refereed bound is changed, ansatz untouched',
    holds: () =>
      IMP97683_FOLD_AMPLITUDE_INDEPENDENT_CROSSCHECK.isRigorous === false &&
      /NO QED/.test(IMP97683_FOLD_AMPLITUDE_INDEPENDENT_CROSSCHECK.verdict) &&
      /refereed bound is changed/i.test(IMP97683_FOLD_AMPLITUDE_INDEPENDENT_CROSSCHECK.verdict),
  },
];

for (const a of IMP97683_FOLD_AMPLITUDE_INDEPENDENT_CROSSCHECK_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97683-fold-amplitude-independent-crosscheck assertion failed: ${a.id}`);
  }
}
