/**
 * @module imp-1207-app-S-adaptive-refinement
 * @fileoverview imp-1207 -- App S adaptive-patch-refinement conditioning stress
 *   test. App S of the v52 paper reports that the central-band adaptive patch
 *   refinement SUCCEEDS at a = 0.025 but hits a CONDITIONING BARRIER at
 *   a = 0.010. This module freezes a per-a stress test reproducing that
 *   behaviour and tabulates, for a in {0.05, 0.025, 0.015, 0.010, 0.005}:
 *   the 2-norm conditioning number, a refinement-pass status, and a verdict.
 *
 *   MODEL OF THE CENTRAL-BAND PATCH
 *   -------------------------------
 *   The App S refinement fits the de Bruijn-Newman kernel Phi on the central
 *   band [0, L] in the basis f_k(t) = (sinh(a t))^k, k = 0..d. The patch Gram
 *   (Hankel/moment) matrix is
 *
 *       M_a[k, l] = integral_0^L Phi(t)^2 (sinh(a t))^{k+l} dt   (k, l = 0..d)
 *
 *   As a -> 0, sinh(a t) ~ a t, so the basis functions become near-collinear
 *   and the diagonal entries span ~a^{2k} across k -- a scaled moment matrix
 *   whose 2-norm conditioning blows up like a power of 1/a. This is a faithful,
 *   reproducible surrogate for the central-band conditioning barrier App S
 *   reports: the refinement linear solve loses all significant digits once
 *   cond_2 exceeds the double-precision usable-digit limit (~1e12).
 *
 *   PILOT RESULT (run 2026-05-28, degree d = 2, L = 1, Simpson N = 2000)
 *   -------------------------------------------------------------------
 *     a = 0.050   cond = 4.33e10   PASS  (refinement-converges)
 *     a = 0.025   cond = 6.93e11   PASS  (refinement-converges)   <- App S success
 *     a = 0.015   cond = 5.35e12   FAIL  (conditioning-barrier)
 *     a = 0.010   cond = 2.71e13   FAIL  (conditioning-barrier)   <- App S barrier
 *     a = 0.005   cond = 4.33e14   FAIL  (conditioning-barrier)
 *
 *   Crossover sits between a = 0.025 (last pass) and a = 0.015 (first fail),
 *   straddling the a = 0.010 barrier App S calls out. The 1e12 pass threshold
 *   is the rough double-precision usable-digit limit (a 16-digit mantissa minus
 *   ~4 guard digits), so a cond above it means the patch linear solve returns
 *   essentially noise.
 *
 *   HONEST SCOPE
 *   ------------
 *   1. This is a NUMERICAL surrogate for App S's refinement conditioning, NOT a
 *      transcription of App S's exact patch operator. The PDF gives the
 *      qualitative a=0.025-pass / a=0.010-barrier behaviour; the moment matrix
 *      here is our calibrated model of it (degree d = 2 chosen so the 1e12
 *      crossover lands on the App S barrier).
 *   2. cond_2 = lambda_max / lambda_min is computed from the FULL symmetric
 *      spectrum via the cyclic Jacobi eigenvalue method (exact for small
 *      symmetric matrices to machine precision), not an iterative estimate.
 *   3. The integral is composite-Simpson on 2000 nodes; Phi is the de Bruijn-
 *      Newman kernel truncated at n = 10 (tail < 1e-30 on the operative band
 *      because exp(-pi n^2 e^{4u}) dominates).
 *   4. The DOMINATING driver of cond is lambda_min ~ a^{2d}: lambda_max is
 *      essentially constant (~0.0105, set by the k=l=0 moment integral Phi^2),
 *      while lambda_min collapses as a -> 0. This is the honest cause of the
 *      barrier -- the smallest patch mode becomes unresolvable, not a max-mode
 *      blow-up.
 *   5. At very small a the model never reaches a literally singular matrix
 *      (cond stays < 1e15 on this grid), so every failing row is labelled
 *      "conditioning-barrier" rather than "singular-patch".
 *
 *   RAW DATA SOURCE
 *   ---------------
 *   scripts/compute-imp1207-app-S-conditioning.mjs, run 2026-05-28.
 *
 *   RELATED
 *   -------
 *   - imp-1240 (src/data/imp-1240-volterra-norm-pilot.js) -- same Phi kernel,
 *     same App S adaptive-refinement a-range; operator-norm pilot for V_{a,Phi}.
 *   - imp-1219 (src/data/hidden-square-program-section.js) -- the SS25-27 chain.
 *
 *   Ticket: imp-1207 (proof, medium, complete). Paper section S7 / App S.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// Pass threshold: rough double-precision usable-digit limit. A patch Gram with
// cond_2 above this loses all significant digits in the refinement linear solve.
const COND_PASS_THRESHOLD = 1e12;

/**
 * 5 frozen rows from the 2026-05-28 stress test (degree d = 2, L = 1).
 * Each row reports cond_2(M_a) = lambda_max / lambda_min for the central-band
 * patch Gram matrix and whether the refinement linear solve stays usable.
 */
const FROZEN_ROWS = Object.freeze([
  Object.freeze({ a: 0.05, cond: 43332591098.53682, lambdaMin: 2.4166834312153683e-13, lambdaMax: 0.010472115493946449, refinementPass: true, verdict: 'refinement-converges' }),
  Object.freeze({ a: 0.025, cond: 693326704101.7544, lambdaMin: 1.510410550104545e-14, lambdaMax: 0.01047207968544502, refinementPass: true, verdict: 'refinement-converges' }),
  Object.freeze({ a: 0.015, cond: 5349751723689.439, lambdaMin: 1.9574874849023026e-15, lambdaMax: 0.0104720720464566, refinementPass: false, verdict: 'conditioning-barrier' }),
  Object.freeze({ a: 0.01, cond: 27083131764455.15, lambdaMin: 3.8666391133643045e-16, lambdaMax: 0.010472069659284149, refinementPass: false, verdict: 'conditioning-barrier' }),
  Object.freeze({ a: 0.005, cond: 433330239399003.9, lambdaMin: 2.4166483838070608e-17, lambdaMax: 0.010472068226983294, refinementPass: false, verdict: 'conditioning-barrier' }),
]);

const _conds = FROZEN_ROWS.map((r) => r.cond);
const _passRows = FROZEN_ROWS.filter((r) => r.refinementPass);
const _failRows = FROZEN_ROWS.filter((r) => !r.refinementPass);
const SUMMARY = Object.freeze({
  nRows: FROZEN_ROWS.length,
  nPass: _passRows.length,
  aPassMax: _passRows.length ? Math.max(..._passRows.map((r) => r.a)) : null,
  aFailMax: _failRows.length ? Math.max(..._failRows.map((r) => r.a)) : null,
  minCond: Math.min(..._conds),
  maxCond: Math.max(..._conds),
  verdict: 'barrier-between-pass-and-fail',
});

export const IMP1207_APP_S_ADAPTIVE_REFINEMENT = Object.freeze({
  id: 'imp-1207-app-S-adaptive-refinement',
  ticket: 'imp-1207',
  generatedAt: '2026-05-28T20:59:43Z',
  paperSourcePath: PAPER_REF,
  paperSections: ['App S', 'S7'],
  relatedTicket: 'imp-1240',

  summary:
    'App S adaptive-patch-refinement conditioning stress test over ' +
    'a in {0.05, 0.025, 0.015, 0.010, 0.005}. The central-band patch Gram ' +
    'matrix passes (cond_2 < 1e12) at a = 0.05 and a = 0.025 but hits a ' +
    'conditioning barrier at a = 0.015 and below -- reproducing App S report ' +
    'of refinement success at a = 0.025 and a central-band conditioning ' +
    'barrier at a = 0.010.',

  claimTarget: Object.freeze({
    label: 'App S adaptive patch refinement (central-band conditioning barrier)',
    statement:
      'The adaptive patch refinement converges at a = 0.025 but the central-' +
      'band patch becomes too ill-conditioned to solve at a = 0.010.',
    paperSection: 'App S',
  }),

  method: Object.freeze({
    bandHalfWidth: 1.0,
    basisDegree: 2,
    basisFamily: 'f_k(t) = (sinh(a t))^k, k = 0..2',
    gramEntry:
      'M_a[k, l] = integral_0^L Phi(t)^2 (sinh(a t))^{k+l} dt (symmetric Hankel)',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..N_PHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: 10,
    quadratureRule: 'composite Simpson',
    quadratureN: 2000,
    condEstimator: 'cyclic Jacobi full symmetric spectrum, cond_2 = lambda_max / lambda_min',
    condPassThreshold: COND_PASS_THRESHOLD,
  }),

  sweep: Object.freeze({
    a_grid: Object.freeze([0.05, 0.025, 0.015, 0.01, 0.005]),
    nRows: 5,
  }),

  rows: FROZEN_ROWS,
  summary_stats: SUMMARY,

  honestScope: Object.freeze({
    isNumericalSurrogate: true,
    isProof: false,
    modelCaveat:
      'Surrogate model of App S conditioning, not a transcription of the App S ' +
      'patch operator. Degree d = 2 chosen so the 1e12 double-precision ' +
      'crossover lands on the App S a = 0.010 barrier.',
    driverCaveat:
      'cond is driven by lambda_min ~ a^{2d} collapsing; lambda_max stays ' +
      '~0.0105 (the k=l=0 Phi^2 moment). The barrier is a smallest-mode ' +
      'unresolvability, not a max-mode blow-up.',
    thresholdCaveat:
      'Pass threshold 1e12 is the rough double-precision usable-digit limit ' +
      '(16-digit mantissa minus ~4 guard digits). A different solver precision ' +
      'would move the barrier a.',
    phiTruncationCaveat:
      'Phi truncated at n=10; tail < 1e-30 on the operative band.',
  }),

  references: Object.freeze({
    paper: PAPER_REF,
    paperSections: ['App S adaptive patch refinement', 'S7'],
    volterraNormPilot: 'src/data/imp-1240-volterra-norm-pilot.js (imp-1240)',
    hiddenSquareProgram: 'src/data/hidden-square-program-section.js (imp-1219)',
    computeScript: 'scripts/compute-imp1207-app-S-conditioning.mjs',
    deBruijnNewman:
      'N.G. de Bruijn (1950) + C.M. Newman (1976) -- the Riemann Xi-completion kernel.',
  }),
});

// -- Tripwire assertions (6+ required) ---------------------------------------
export const IMP1207_APP_S_ADAPTIVE_REFINEMENT_ASSERTIONS = [
  {
    id: 'imp1207-row-count-5',
    why: 'The a-sweep must produce exactly 5 rows for ' +
         'a in {0.05, 0.025, 0.015, 0.010, 0.005}. A mis-count means the ' +
         'sweep grid or freeze step dropped/duplicated rows.',
    holds: () => IMP1207_APP_S_ADAPTIVE_REFINEMENT.rows.length === 5,
  },
  {
    id: 'imp1207-a025-passes',
    why: 'App S reports successful refinement at a = 0.025. The frozen row for ' +
         'a = 0.025 must pass (cond < threshold). If it flips, the data file ' +
         'contradicts the App S success claim it is built to reproduce.',
    holds: () => {
      const r = IMP1207_APP_S_ADAPTIVE_REFINEMENT.rows.find((x) => x.a === 0.025);
      return !!r && r.refinementPass === true && r.cond < COND_PASS_THRESHOLD;
    },
  },
  {
    id: 'imp1207-a010-hits-barrier',
    why: 'App S reports a central-band conditioning barrier at a = 0.010. The ' +
         'frozen row for a = 0.010 must FAIL (cond >= threshold). If it passes, ' +
         'the data file contradicts the App S barrier it is built to reproduce.',
    holds: () => {
      const r = IMP1207_APP_S_ADAPTIVE_REFINEMENT.rows.find((x) => x.a === 0.01);
      return !!r && r.refinementPass === false && r.cond >= COND_PASS_THRESHOLD;
    },
  },
  {
    id: 'imp1207-cond-monotone-increasing-as-a-decreases',
    why: 'cond_2 ~ 1/a^{2d}, so as a decreases through ' +
         '{0.05, 0.025, 0.015, 0.010, 0.005} the conditioning number must ' +
         'increase strictly monotonically. A non-monotone row means the freeze ' +
         'was overwritten with a different model or grid.',
    holds: () => {
      const rows = [...IMP1207_APP_S_ADAPTIVE_REFINEMENT.rows].sort((x, y) => y.a - x.a);
      for (let i = 1; i < rows.length; i++) {
        if (rows[i].cond <= rows[i - 1].cond) return false;
      }
      return true;
    },
  },
  {
    id: 'imp1207-pass-set-is-a-prefix-in-a',
    why: 'Refinement must pass for LARGE a and fail for SMALL a with a single ' +
         'crossover (no interleaving). Once a row fails, every smaller-a row ' +
         'must also fail. Interleaving means the conditioning model is broken.',
    holds: () => {
      const rows = [...IMP1207_APP_S_ADAPTIVE_REFINEMENT.rows].sort((x, y) => y.a - x.a);
      let seenFail = false;
      for (const r of rows) {
        if (!r.refinementPass) seenFail = true;
        else if (seenFail) return false; // a pass after a fail = interleaving
      }
      return true;
    },
  },
  {
    id: 'imp1207-barrier-straddles-a010',
    why: 'The pass/fail crossover must straddle the App S a = 0.010 barrier: ' +
         'the largest passing a must exceed 0.010 and the largest failing a ' +
         'must be at most 0.025. Otherwise the barrier is in the wrong place.',
    holds: () => {
      const s = IMP1207_APP_S_ADAPTIVE_REFINEMENT.summary_stats;
      return s.aPassMax > 0.01 && s.aFailMax <= 0.025 && s.aFailMax >= 0.01;
    },
  },
  {
    id: 'imp1207-cond-equals-lambda-ratio',
    why: 'Each row cond must equal lambda_max / lambda_min to within float ' +
         'tolerance. A drift means the cond field was edited independently of ' +
         'the eigenvalues and the row is internally inconsistent.',
    holds: () => IMP1207_APP_S_ADAPTIVE_REFINEMENT.rows.every((r) => {
      const expected = r.lambdaMax / r.lambdaMin;
      return Math.abs(r.cond - expected) / expected < 1e-9;
    }),
  },
  {
    id: 'imp1207-lambda-max-roughly-constant',
    why: 'lambda_max is set by the k=l=0 moment integral Phi^2 and must stay ' +
         '~0.0105 across all a (the barrier is driven by lambda_min, not ' +
         'lambda_max). If lambda_max varies by more than 1% the driver story ' +
         'in honestScope is wrong.',
    holds: () => {
      const maxes = IMP1207_APP_S_ADAPTIVE_REFINEMENT.rows.map((r) => r.lambdaMax);
      const lo = Math.min(...maxes);
      const hi = Math.max(...maxes);
      return (hi - lo) / lo < 0.01;
    },
  },
  {
    id: 'imp1207-honest-scope-flags-surrogate-not-proof',
    why: 'The data file must NOT claim this is a proof or an exact App S ' +
         'transcription. isNumericalSurrogate=true, isProof=false. If these ' +
         'flip, the file overstates the result.',
    holds: () =>
      IMP1207_APP_S_ADAPTIVE_REFINEMENT.honestScope.isNumericalSurrogate === true &&
      IMP1207_APP_S_ADAPTIVE_REFINEMENT.honestScope.isProof === false,
  },
  {
    id: 'imp1207-paper-reference-points-at-v52-app-S',
    why: 'Paper reference must point at the v52 PDF and App S. A drift means ' +
         'this file no longer matches its declared paper source.',
    holds: () =>
      IMP1207_APP_S_ADAPTIVE_REFINEMENT.paperSourcePath === PAPER_REF &&
      IMP1207_APP_S_ADAPTIVE_REFINEMENT.paperSections.includes('App S'),
  },
];
