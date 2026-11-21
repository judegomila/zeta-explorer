/**
 * @module rh-bridge-route-b-overclaim-baseline-audit-2026-09-24
 *
 * Adversarial re-audit of two honesty findings raised by
 * rh-bridge-supercritical-fluid-shock-scaling-2026-09-24.js against the Dyson-Burgers
 * bridge (dyson-burgers-shock.js) and the Path C baseline (src/math/dyson-scaling-N5000.js).
 * Import-light: imports only the (import-free) fluid module for its baked ladders.
 * Offline generators: tmp/finding2-tc-recompute.mjs, tmp/finding2-mechanism.mjs.
 *
 * FINDING 1 -- "Route B FULLY CLOSED" per-N bound.  VERDICT: CONFIRMED OVERCLAIM.
 * ---------------------------------------------------------------------------------
 * Claim under audit (imp-683, dyson-burgers-shock.js G6_PER_N_BOUND, status 'closed'):
 *     |t_c(N)| <= C_C sqrt(log gamma_N / N),  C_C = (1/8) sqrt(3 pi) ~ 0.384,  "RIGOROUS".
 * Re-derived chain (imp-338 + imp-341 + imp-366 + imp-395):
 *   S0  tau_c(rho_inf) = 0, so the Hoelder deviation |tau_c(mu_N) - tau_c(rho_inf)| IS |t_c(N)|.
 *       (Answers (b): the bound is on t_c(N) itself, not merely on a deviation.)
 *   S1  g_min(mu_N) <= C_Lip * W_1(mu_N, rho_inf)            [imp-366 Step 1 = imp-395 Step 1]
 *   S2  |t_c(N)| = g_min^2 / 8 + O(g_min^3)                   [quadratic tangency; 1/8 exact at leading order]
 *   S3  W_1(mu_N, rho_inf) <= 3 pi log(gamma_N) / N            [imp-341 Koksma-Hlawka]
 *   S4  W_1^2 <= W_1^{1/2} when W_1 <= 1 (N >= 37); C_Lip -> 1  [imp-395 Steps 2-3]
 * so |t_c(N)| <= C_Lip^2 W_1^2 / 8 <= (1/8) W_1^{1/2} <= (1/8) sqrt(3 pi log gamma_N / N).
 *
 * The silent input is S1. Written out with S3 it is the LINEAR per-N small-gaps bound
 *     g_min(N) <= C_Lip * 3 pi log(gamma_N) / N.
 * In the bridge normalization (W_1 = (1/N) sum |Delta x|, height units -- the one imp-395 itself
 * uses when it asserts W_1 <= 1 for N >= 37) the Odlyzko minimum gaps require
 *     C_Lip >= 0.90 (N=50), 1.39 (100), 1.77 (200), 2.46 (500), 2.36 (1e3), 3.18 (2458),
 *              2.67 (5e3), 4.35 (1e4), 13.9 (1e5), 45.5 (1e6),
 * so the imp-395 premise "C_Lip -> 1, deviating from 1 by < 0.1%" is FALSE from N = 100 on and
 * C_Lip is not N-uniform (growth ~ N^{0.4} over 50..1e6). This agrees with imp-2640 / imp-2642 /
 * ch-wall-frontier-verdict-2026-06-26 (C_Lip provably divergent in the W_1 channel; "C_C =
 * (1/8) sqrt(3 pi) is an ANSATZ value, not a rigorous E_coll constant"), a retraction already
 * recorded in polymath15-lemma52-shock-holder.js that dyson-burgers-shock.js had never absorbed.
 *
 * (a) Is |t_c(N)| >= g_min^2/8 rigorous?  YES (elementary). For an adjacent pair with gap g,
 *     d(g^2)/ds = -8 + 4 g^2 S, S = sum_{j not in pair} 1/((x_{i+1}-x_j)(x_i-x_j)) > 0 while the
 *     ordering persists, so g(s)^2 >= g(0)^2 - 8 s for every adjacent pair; the first collision
 *     needs some g(s_c) = 0, hence s_c >= g_i(0)^2/8 >= g_min^2/8. Checked live below.
 *     The matching UPPER estimate t_c ~ g_min^2/8 (1 + O(S g^2)) is measured (1.003 .. 1.095 on
 *     the baseline) but not proved here.
 * Consequence: the claimed bound would imply g_min(N) <= sqrt(8 * 0.384) (log gamma_N/N)^{1/4}
 *     = 1.753 (log gamma_N / N)^{1/4} for EVERY N -- a per-N power-saving small-gaps theorem for
 *     zeta zeros. No such unconditional theorem exists (known: lim-inf constants ~ 0.5 mean
 *     spacing). The data satisfy the consequence at all 14 N <= 1e6 tested, so the bound is not
 *     refuted as a statement; its PROOF is what is missing. "Route B FULLY CLOSED" is an overclaim.
 * Correction made: dyson-burgers-shock.js G6_PER_N_BOUND.status -> 'conditional' with an
 *     overclaimCorrection record, new blocking condition G6b-Step1-gap-Lipschitz, G1_SUB_EXTREMAL
 *     and DYSON_BURGERS_SHOCK.status/verdict corrected, three new tripwire assertions.
 * Scope: the lim-sup a = 0 chain (imp-341/imp-344) and S3 itself are NOT re-audited here.
 *
 * FINDING 2 -- PATH_C_BASELINE_FIT contaminated at all N.  VERDICT: CONFIRMED (with one
 * attribution correction).
 * --------------------------------------------------------------------------------------
 * Independent recompute (adaptive RK4, dt = frac * g_min^2/8, fold-extrapolated; two settings
 * frac/gStop = 0.04/2e-3 and 0.01/5e-4 agree to <= 4.1e-9 relative) on the Odlyzko zeros:
 *     N      accurate t_c   literal   literal/accurate
 *     50     0.0957473      0.1435    1.499
 *     100    0.0701183      0.0723    1.031
 *     200    0.0326830      0.0352    1.077
 *     500    0.0123271      0.0163    1.322
 *     2458   0.00119231     0.0086    7.213
 * matching the fluid module's 1.50, 1.03, 1.08, 1.32, 7.21 and imp-353's 0.0958 at N = 50.
 * Mechanism: fixed-step RK4 at dt = 5e-4 reproduces the N = 50 literal 0.1435 EXACTLY (the RK4
 * stages straddle the pole and the pair bounces from gap 0.02 back to 0.58, colliding on a second
 * approach); fixed-step Euler at the same dt gives 0.097. So the fluid module's "Euler integrator"
 * attribution is not what reproduces the literal -- the defect is the fixed dt (the repo labels
 * the baseline integrator inconsistently: Euler per imp-1228, RK4 per imp-1226). The N = 500 /
 * 2458 literals are not reproduced by any fixed dt in {5e-4, 3e-4, 1e-4} (RK4 or Euler); their
 * provenance is unrecoverable. Second data-hygiene point: the five literals fit to
 * a = 0.00294, b = 6.98, R^2 = 0.9987, NOT to the documented a = 0.0066, b = 4.91, R^2 = 0.943;
 * the accurate values fit to a = 0.00586, b = 4.88, R^2 = 0.943, so the documented fit came from a
 * different (near-accurate) runtime re-run, consistent with the 0.0029-vs-0.0066 note in
 * lambda-intercept-confidence.js.
 * Downstream (imp-338 surrogate ratios): against the literals the 2 pi / log^2 surrogate is
 * 4.5x .. 19x loose; against the accurate t_c it is 6.7x (N = 50) .. 139x (N = 2458). The old
 * "one to two orders of magnitude" reads too tight at N = 2458 and too loose at N = 50.
 * Correction made: PATH_C_BASELINE_FIT_ACCURATE exported next to the legacy literal (left in
 *     place: 80+ consumers with baked expectations), prominent caveat in dyson-scaling-N5000.js,
 *     SHOCK_ROWS in dyson-burgers-shock.js carries both columns.
 *
 * HONEST SCOPE: no Lambda bound, no RH claim, NO QED. Nothing here refutes |t_c(N)| <= 0.384
 * sqrt(log gamma_N / N) as a statement about the actual collision times; it removes its claimed
 * proof. No refereed bound is changed.
 *
 * @see dyson-burgers-shock.js (G6_PER_N_BOUND.overclaimCorrection)
 * @see rh-bridge-supercritical-fluid-shock-scaling-2026-09-24.js (fold law, MIN_GAP_LADDER)
 * @see polymath15-lemma52-shock-holder.js (imp-2640 / imp-2642 retraction of C_H = 1/8, C_C ansatz)
 * @see g6a-sub-constant-value.js (imp-395 derivation whose Step 1 is the unproved input)
 * @see src/math/dyson-scaling-N5000.js (PATH_C_BASELINE_FIT, PATH_C_BASELINE_FIT_ACCURATE)
 */

import { FOLD_LAW_ROWS, MIN_GAP_LADDER } from './rh-bridge-supercritical-fluid-shock-scaling-2026-09-24.js';

const C_KH = 3 * Math.PI; // imp-341: W_1(mu_N, rho_inf) <= C_KH log(gamma_N) / N, C_Selberg = 3
const C_C_ROUTE_B = Math.sqrt(3 * Math.PI) / 8; // (1/8) sqrt(3 pi) ~ 0.384

// Step-1 requirement: g_min(N) <= C_Lip * C_KH log(gamma_N)/N  =>  C_Lip >= g_min N / (C_KH log gamma_N).
export const requiredCLip = (gmin, gammaN, N) => gmin / ((C_KH * Math.log(gammaN)) / N);

export const STEP1_REQUIRED_CLIP_LADDER = MIN_GAP_LADDER.map((r) => ({
  N: r.N,
  gammaN: r.gammaN,
  gmin: r.gmin,
  khBound: (C_KH * Math.log(r.gammaN)) / r.N,
  requiredCLip: requiredCLip(r.gmin, r.gammaN, r.N),
}));

// Baked recompute rows (tmp/finding2-tc-recompute.mjs, tmp/finding2-mechanism.mjs).
export const BASELINE_RECOMPUTE_ROWS = Object.freeze([
  { N: 50,   literal: 0.1435, tcA: 0.09574729142490981, tcB: 0.09574729172782159, gmin0: 0.845123634, collidingPair: 34,   eulerFixed5e4: 0.097,  rk4Fixed5e4: 0.1435, rk4Fixed3e4: 0.096,  rk4Fixed1e4: 0.0962, eulerFixed1e4: 0.096 },
  { N: 100,  literal: 0.0723, tcA: 0.07011830392874155, tcB: 0.07011830414076016, gmin0: 0.715786716, collidingPair: 91,   eulerFixed5e4: 0.0715, rk4Fixed5e4: 0.0725, rk4Fixed3e4: null,   rk4Fixed1e4: 0.0719, eulerFixed1e4: 0.0704 },
  { N: 200,  literal: 0.0352, tcA: 0.03268304795458023, tcB: 0.03268304806156852, gmin0: 0.498179464, collidingPair: 186,  eulerFixed5e4: 0.034,  rk4Fixed5e4: 0.033,  rk4Fixed3e4: null,   rk4Fixed1e4: 0.0331, eulerFixed1e4: 0.0329 },
  { N: 500,  literal: 0.0163, tcA: 0.012327123759440872, tcB: 0.012327123801721036, gmin0: 0.310430705, collidingPair: 453, eulerFixed5e4: 0.0135, rk4Fixed5e4: 0.0125, rk4Fixed3e4: null,   rk4Fixed1e4: 0.0124, eulerFixed1e4: 0.0126 },
  { N: 2458, literal: 0.0086, tcA: 0.0011923133883227207, tcB: 0.0011923133931312777, gmin0: 0.097502502, collidingPair: 1496, eulerFixed5e4: 0.002, rk4Fixed5e4: 0.0015, rk4Fixed3e4: null, rk4Fixed1e4: 0.0012, eulerFixed1e4: 0.0014 },
]);

function olsInverseN(points) {
  const n = points.length;
  const xs = points.map((p) => 1 / p.N), ys = points.map((p) => p.tc);
  const sx = xs.reduce((a, b) => a + b, 0), sy = ys.reduce((a, b) => a + b, 0);
  const sxy = xs.reduce((s, x, i) => s + x * ys[i], 0), sx2 = xs.reduce((s, x) => s + x * x, 0);
  const b = (n * sxy - sx * sy) / (n * sx2 - sx * sx), a = (sy - b * sx) / n;
  const ym = sy / n;
  const sst = ys.reduce((s, y) => s + (y - ym) ** 2, 0), ssr = ys.reduce((s, y, i) => s + (y - (a + b * xs[i])) ** 2, 0);
  return { a, b, R2: 1 - ssr / sst };
}
export const OLS_ON_LITERALS = olsInverseN(BASELINE_RECOMPUTE_ROWS.map((r) => ({ N: r.N, tc: r.literal })));
export const OLS_ON_ACCURATE = olsInverseN(BASELINE_RECOMPUTE_ROWS.map((r) => ({ N: r.N, tc: r.tcA })));
export const DOCUMENTED_PATH_C_FIT = Object.freeze({ a: 0.0066, b: 4.91, R2: 0.943 });

// Live fold-law check on the first 12 Odlyzko zeros: d(g^2)/ds = -8 + 4 g^2 S with S > 0 for the
// argmin pair, and one small RK4 step must not lower g^2 by more than 8 ds.
const Z12 = Object.freeze([14.134725142, 21.022039639, 25.01085758, 30.424876126, 32.935061588, 37.586178159,
  40.918719012, 43.327073281, 48.005150881, 49.773832478, 52.970321478, 56.446247697]);
function foldLawLive(x0) {
  const N = x0.length;
  const d = (v) => v.map((vk, k) => { let s = 0; for (let j = 0; j < N; j++) if (j !== k) s += 1 / (vk - v[j]); return -2 * s; });
  let i = 0, g = Infinity;
  for (let k = 0; k < N - 1; k++) if (x0[k + 1] - x0[k] < g) { g = x0[k + 1] - x0[k]; i = k; }
  let S = 0;
  for (let j = 0; j < N; j++) if (j !== i && j !== i + 1) S += 1 / ((x0[i + 1] - x0[j]) * (x0[i] - x0[j]));
  const k1 = d(x0);
  const dg2_analytic = 2 * g * (k1[i + 1] - k1[i]);
  const ds = 1e-4 * g * g / 8;
  const t1 = x0.map((v, k) => v + 0.5 * ds * k1[k]), k2 = d(t1);
  const t2 = x0.map((v, k) => v + 0.5 * ds * k2[k]), k3 = d(t2);
  const t3 = x0.map((v, k) => v + ds * k3[k]), k4 = d(t3);
  const x1 = x0.map((v, k) => v + (ds / 6) * (k1[k] + 2 * k2[k] + 2 * k3[k] + k4[k]));
  const g1 = x1[i + 1] - x1[i];
  return { g, S, dg2_analytic, dg2_formula: -8 + 4 * g * g * S, dg2_step: (g1 * g1 - g * g) / ds };
}

export const ROUTE_B_OVERCLAIM_BASELINE_AUDIT = Object.freeze({
  id: 'rh-bridge-route-b-overclaim-baseline-audit-2026-09-24',
  date: '2026-09-24',
  finding1: {
    claim: '|t_c(N)| <= (1/8) sqrt(3 pi) sqrt(log gamma_N / N), "Route B FULLY CLOSED", C_H = 1/8 "RIGOROUS" (imp-683 in dyson-burgers-shock.js)',
    verdict: 'CONFIRMED OVERCLAIM -- corrected to CONDITIONAL',
    boundsTcItself: true,
    silentInput: 'S1: g_min(mu_N) <= C_Lip * W_1(mu_N, rho_inf) with N-uniform C_Lip -> 1 (imp-366 Step 1 / imp-395 Step 1); with imp-341 this is the linear per-N small-gaps bound g_min(N) <= C_Lip 3 pi log(gamma_N)/N',
    requiredCLipLadder: STEP1_REQUIRED_CLIP_LADDER,
    priorRetraction: 'imp-2640 / imp-2642 / ch-wall-frontier-verdict-2026-06-26: C_Lip non-N-uniform in the W_1 channel; C_C = (1/8) sqrt(3 pi) an ANSATZ (polymath15-lemma52-shock-holder.js) -- never propagated to dyson-burgers-shock.js',
    foldLowerBoundRigorous: '|t_c(N)| >= g_min(N)^2/8 from d(g^2)/ds = -8 + 4 g^2 S, S > 0 (elementary)',
    impliedSmallGapConstant: Math.sqrt(8 * C_C_ROUTE_B),
    impliedSmallGapStatement: 'g_min(N) <= 1.753 (log gamma_N / N)^{1/4} for every N -- a per-N power-saving small-gaps theorem for zeta zeros; not a known theorem',
    correctedIn: ['src/data/dyson-burgers-shock.js (G6_PER_N_BOUND.status, overclaimCorrection, blockingConditions, G1_SUB_EXTREMAL, DYSON_BURGERS_SHOCK.status/verdict, 3 tripwires)'],
    notReaudited: ['lim-sup a = 0 chain (imp-341/imp-344)', 'S3 Koksma-Hlawka constant C_Selberg = 3'],
  },
  finding2: {
    claim: 'PATH_C_BASELINE_FIT t_c literals overshoot-contaminated at all N (ratios 1.50, 1.03, 1.08, 1.32, 7.21)',
    verdict: 'CONFIRMED; attribution corrected: fixed-step (RK4 dt = 5e-4 reproduces the N = 50 literal), not specifically Euler',
    rows: BASELINE_RECOMPUTE_ROWS,
    olsOnLiterals: OLS_ON_LITERALS,
    olsOnAccurate: OLS_ON_ACCURATE,
    documentedFit: DOCUMENTED_PATH_C_FIT,
    documentedFitMatchesLiterals: false,
    surrogateLooseness: 'against literals 4.5x .. 19x; against accurate t_c 6.7x (N = 50) .. 139x (N = 2458)',
    correctedIn: ['src/math/dyson-scaling-N5000.js (caveat, PATH_C_BASELINE_FIT_ACCURATE, RK4 comment)', 'src/data/dyson-burgers-shock.js (SHOCK_ROWS accurate columns, interpretation text, 1 tripwire)'],
  },
  scope: 'No Lambda bound, no RH claim, NO QED. Removes a claimed proof, refutes no statement about the actual t_c(N). No refereed bound is changed.',
});

const near = (a, b, tol) => Math.abs(a - b) <= tol * Math.max(Math.abs(a), Math.abs(b), 1e-300);

export const ROUTE_B_OVERCLAIM_BASELINE_AUDIT_ASSERTIONS = [
  {
    id: 'rbaudit-step1-required-clip-not-n-uniform',
    holds: () => {
      const byN = Object.fromEntries(STEP1_REQUIRED_CLIP_LADDER.map((r) => [r.N, r.requiredCLip]));
      return byN[50] < 1 && byN[100] > 1.3 && byN[2458] > 3 && byN[1e4] > 4 && byN[1e5] > 13 && byN[1e6] > 40
        && byN[1e6] / byN[100] > 30;
    },
    why: 'The Route B Step-1 input g_min <= C_Lip * W_1 with W_1 <= 3 pi log(gamma_N)/N forces C_Lip >= g_min N/(3 pi log gamma_N); on the Odlyzko zeros that is > 1.3 at N = 100 and > 40 at N = 1e6, so the imp-395 premise C_Lip -> 1 is false and C_Lip is not N-uniform. This is the silent small-gaps input behind "Route B FULLY CLOSED".',
  },
  {
    id: 'rbaudit-fold-law-lower-bound-live',
    holds: () => {
      const f = foldLawLive(Z12);
      return f.S > 0 && near(f.dg2_analytic, f.dg2_formula, 1e-9) && f.dg2_formula >= -8 && f.dg2_step >= -8 * (1 + 1e-6)
        && FOLD_LAW_ROWS.every((r) => r.tc >= (r.gmin * r.gmin) / 8 && r.tc / ((r.gmin * r.gmin) / 8) <= 1.11);
    },
    why: 'd(g^2)/ds = -8 + 4 g^2 S with S > 0 (recomputed live on the first 12 zeros, analytic derivative vs closed form to 1e-9, one RK4 step consistent) gives the rigorous lower bound |t_c(N)| >= g_min^2/8, which the baked N-body times satisfy within 11% at every baseline N. This is the half of the fold law that converts the Route B bound into a small-gaps statement.',
  },
  {
    id: 'rbaudit-implied-small-gap-constant-and-data-consistency',
    holds: () => near(C_C_ROUTE_B, 0.384, 2e-3) && near(Math.sqrt(8 * C_C_ROUTE_B), 1.7527, 1e-3)
      && MIN_GAP_LADDER.every((r) => r.gmin <= Math.sqrt(8 * C_C_ROUTE_B) * (Math.log(r.gammaN) / r.N) ** 0.25),
    why: 'sqrt(8 * 0.384) = 1.753 is the constant in the implied per-N bound g_min(N) <= 1.753 (log gamma_N/N)^{1/4}; the Odlyzko data satisfy it at all 14 N <= 1e6, so the correction downgrades rigor without refuting the statement.',
  },
  {
    id: 'rbaudit-baseline-recompute-two-settings-agree-and-match-fluid-rows',
    holds: () => BASELINE_RECOMPUTE_ROWS.every((r) => {
      const f = FOLD_LAW_ROWS.find((x) => x.N === r.N);
      return near(r.tcA, r.tcB, 1e-8) && near(r.tcA, f.tc, 1e-8) && near(r.gmin0, f.gmin, 1e-8) && r.collidingPair === f.argmin
        && r.tcA >= (r.gmin0 * r.gmin0) / 8 && r.tcA / ((r.gmin0 * r.gmin0) / 8) <= 1.11;
    }),
    why: 'Two independent adaptive-RK4 settings (frac/gStop 0.04/2e-3 and 0.01/5e-4) agree to 1e-8 and reproduce the fluid module\'s N-body times; the colliding pair is the initial argmin pair and t_c obeys the fold lower bound at every N.',
  },
  {
    id: 'rbaudit-baseline-literals-contaminated-ratios',
    holds: () => {
      const expected = { 50: 1.499, 100: 1.031, 200: 1.077, 500: 1.322, 2458: 7.213 };
      return BASELINE_RECOMPUTE_ROWS.every((r) => near(r.literal / r.tcA, expected[r.N], 2e-3) && r.literal > r.tcA);
    },
    why: 'The legacy PATH_C_BASELINE_FIT literals exceed the accurate collision times at EVERY N by 1.499, 1.031, 1.077, 1.322, 7.213 -- contamination is not confined to N = 50 as imp-353 recorded.',
  },
  {
    id: 'rbaudit-fixed-step-mechanism-rk4-not-euler-reproduces-n50-literal',
    holds: () => {
      const r = BASELINE_RECOMPUTE_ROWS[0];
      return r.rk4Fixed5e4 === r.literal && Math.abs(r.eulerFixed5e4 - r.tcA) < 2e-3 && Math.abs(r.rk4Fixed3e4 - r.tcA) < 1e-3
        && BASELINE_RECOMPUTE_ROWS.slice(3).every((x) => [x.eulerFixed5e4, x.rk4Fixed5e4, x.rk4Fixed1e4, x.eulerFixed1e4].every((v) => Math.abs(v - x.literal) > 5e-4));
    },
    why: 'Fixed-step RK4 at dt = 5e-4 reproduces the N = 50 literal 0.1435 exactly (pole-straddling bounce), while fixed-step Euler at the same dt lands within 2e-3 of the accurate value: the defect is the fixed dt, not the Euler/RK4 choice, so the fluid module\'s "Euler integrator" attribution is corrected. The N = 500 / 2458 literals are reproduced by no tested fixed dt (provenance unrecoverable).',
  },
  {
    id: 'rbaudit-documented-fit-not-from-baked-literals',
    holds: () => near(OLS_ON_LITERALS.a, 0.00294, 2e-2) && near(OLS_ON_LITERALS.b, 6.98, 2e-2) && OLS_ON_LITERALS.R2 > 0.998
      && near(OLS_ON_ACCURATE.a, 0.00586, 2e-2) && near(OLS_ON_ACCURATE.b, 4.88, 2e-2) && near(OLS_ON_ACCURATE.R2, 0.943, 2e-3)
      && Math.abs(OLS_ON_LITERALS.a - DOCUMENTED_PATH_C_FIT.a) > 3e-3 && Math.abs(OLS_ON_LITERALS.R2 - DOCUMENTED_PATH_C_FIT.R2) > 0.05,
    why: 'The five baked literals fit |t_c| = a + b/N to a = 0.00294, b = 6.98, R^2 = 0.9987 -- not the documented a = 0.0066, b = 4.91, R^2 = 0.943, which the ACCURATE values (a = 0.00586, b = 4.88, R^2 = 0.943) match in b and R^2. The literals and the documented fit come from different runs.',
  },
  {
    id: 'rbaudit-no-qed-scope',
    holds: () => /NO QED/.test(ROUTE_B_OVERCLAIM_BASELINE_AUDIT.scope) && /Platt-Trudgian Lambda <= 0.2|refereed bound is changed/.test(ROUTE_B_OVERCLAIM_BASELINE_AUDIT.scope)
      && /CONDITIONAL/.test(ROUTE_B_OVERCLAIM_BASELINE_AUDIT.finding1.verdict) && /CONFIRMED/.test(ROUTE_B_OVERCLAIM_BASELINE_AUDIT.finding2.verdict)
      && ROUTE_B_OVERCLAIM_BASELINE_AUDIT.finding2.documentedFitMatchesLiterals === false,
    why: 'The record must keep its honest scope: a rigor downgrade plus a data correction, no Lambda bound, no RH claim.',
  },
];
