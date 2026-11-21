/**
 * @module imp-96668-route-m-lammax-curvature-refit
 *
 * imp-96668 (numerical, MEASUREMENT ONLY): re-fit the Route M lam_max(N) growth on the
 * enlarged imp-96649 ladder (measured lam_max through N=9000), adding a curvature /
 * 1-over-logN term, to quantify whether the imp-96443 leading log slope 0.3526 should be
 * revised down, and re-check the double-precision conditioning ceiling with the revised law.
 *
 * THE ISSUE. imp-96443 fit lam_max = 3.0247 + 0.3526 log N over the N=250..6000 rungs
 * (R^2 = 0.9954). imp-96649 then measured lam_max at N=7000/8000/9000 and found the measured
 * values run ~0.7-1.1% BELOW that extrapolated log law -- the log growth is flattening beyond
 * N=6000. A pure log-linear fit cannot see that flattening; a curvature term can.
 *
 * WHAT WAS DONE (tmp/imp-96668-refit-lammax.py, reproducible; numpy OLS with parameter
 * covariance). The full measured lam_max ladder (imp-96443 rungs 250,500,1000,2000,3000,4000,
 * 5000,6000 + imp-96649 rungs 7000,8000,9000 = eleven rungs) was re-fit under three models:
 *   (a) log-linear   lam_max = A + B log N                       (imp-96443 shape)
 *   (b) inverse-log  lam_max = A + B log N + C / log N           (curvature)
 *   (c) log-log      lam_max = A + B log N + C log log N         (curvature)
 * The conditioning ceiling was recomputed for each by composing the revised lam_max law with
 * the imp-96649 lam_min power law (C N^-q fit over 250,3000..9000) and solving
 * cond#(N) = lam_max(N)/lam_min(N) = 1/eps.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the leading log slope DOES revise down, modestly.
 * -------------------------------------------------------------------------------
 * Re-fitting the pure log-linear law over the enlarged eleven-rung ladder gives slope
 * B = 0.33987 +/- 0.00870 (full) / 0.34932 +/- 0.00936 (imp-96649 eight-rung subset), vs the
 * imp-96443 value 0.35263 fit only to N<=6000. The extra high-N rungs pull the log slope down
 * ~3.6% (full ladder); 0.3526 sits ~1.5 SE above the enlarged log-linear slope -- mildly
 * overstated but within ~2 sigma of a pure log law.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- a curvature term is strongly favored and shows local slope ~0.26.
 * -------------------------------------------------------------------------------
 * Adding a single curvature term lifts R^2 from 0.9941 (log-linear) to 0.99997 (+C/logN) /
 * 0.99999 (+C loglogN) on the full ladder, with C < 0 (concave: decelerating log growth).
 * The LOCAL effective slope d lammax / d logN evaluated at N=9000 falls to ~0.268 (+C/logN)
 * and ~0.262 (+C loglogN) -- ~26% below the imp-96443 0.3526. So the honest reading is: the
 * asymptotic log slope is NOT 0.3526; the growth near the top of the ladder is closer to
 * ~0.26 per e-fold of N and still slowing.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the revised conditioning ceiling stays in the ~4e7 band (moves UP slightly).
 * -------------------------------------------------------------------------------
 * Composed with the imp-96649 lam_min power law (q = 1.9198, R^2 = 0.99999), the recomputed
 * 1/eps ceiling is 4.10e7 (log-linear), 4.39e7 (+C/logN), 4.49e7 (+C loglogN) on the full
 * ladder -- all in the ~4e7 band, bracketing the imp-96443 composed value 4.11e7. Because
 * curvature makes lam_max SMALLER at large N, cond# is smaller and the ceiling shifts slightly
 * HIGHER (more conservative), never lower. The ceiling stays >2000x above the imp-96352
 * wall-clock compute ceiling N ~ 9916: compute binds first, verdict UNCHANGED.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * MEASURED. The imp-96443 leading log slope 0.3526 (fit to N<=6000) reads high: on the enlarged
 * eleven-rung ladder the pure log slope is 0.340, and a strongly-favored curvature term
 * (R^2 0.9941 -> 0.99997) shows the local slope near N=9000 is ~0.26 and still slowing. The
 * recomputed conditioning ceiling stays in the ~4e7 band (4.10-4.49e7) and, because a smaller
 * lam_max lowers cond#, moves slightly UP -- more conservative, not less. Compute binds first
 * by >2000x. No bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96649-route-m-condfit-rungs-above-6000.js (measured lam_max 7000/8000/9000 + lam_min ladder)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (original log-linear fit, N<=6000)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (rigorous-bound context)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 *
 * Ticket: imp-96668 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

export const IMP96668_EPS = 2.220446049250313e-16;
const BREAKDOWN = 1 / 2.220446049250313e-16; // ~4.5036e15

// Full measured lam_max ladder: imp-96443 (N<=6000) + imp-96649 (7000,8000,9000).
export const IMP96668_LAMMAX_ROWS = Object.freeze([
  Object.freeze({ N: 250, lamMax: 4.930210017770543 }),
  Object.freeze({ N: 500, lamMax: 5.228866173055301 }),
  Object.freeze({ N: 1000, lamMax: 5.495523758931842 }),
  Object.freeze({ N: 2000, lamMax: 5.733924618097868 }),
  Object.freeze({ N: 3000, lamMax: 5.861648882285381 }),
  Object.freeze({ N: 4000, lamMax: 5.94745308383515 }),
  Object.freeze({ N: 5000, lamMax: 6.01140643903531 }),
  Object.freeze({ N: 6000, lamMax: 6.062043896086687 }),
  Object.freeze({ N: 7000, lamMax: 6.103761864068918 }),
  Object.freeze({ N: 8000, lamMax: 6.1391115487297085 }),
  Object.freeze({ N: 9000, lamMax: 6.16969991936083 }),
]);

// imp-96649 lam_min ladder (250, 3000..9000) for the ceiling recompute.
const LAMMIN_ROWS = Object.freeze([
  Object.freeze({ N: 250, lamMin: 2.06e-5 }),
  Object.freeze({ N: 3000, lamMin: 1.7603246535995948e-7 }),
  Object.freeze({ N: 4000, lamMin: 9.990947269105856e-8 }),
  Object.freeze({ N: 5000, lamMin: 6.56754131662765e-8 }),
  Object.freeze({ N: 6000, lamMin: 4.694983880281018e-8 }),
  Object.freeze({ N: 7000, lamMin: 3.445112851649364e-8 }),
  Object.freeze({ N: 8000, lamMin: 2.6337402845640897e-8 }),
  Object.freeze({ N: 9000, lamMin: 2.112093427195344e-8 }),
]);

// --- small linear-algebra helpers (normal equations; Gaussian elimination) ---
function solveLinear(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let piv = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[piv][c])) piv = r;
    [M[c], M[piv]] = [M[piv], M[c]];
    for (let r = 0; r < n; r++) {
      if (r === c) continue;
      const f = M[r][c] / M[c][c];
      for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  return M.map((row, i) => row[n] / row[i]);
}

// OLS of y on design columns cols[j](N); returns {beta, r2}.
function ols(rows, ycol, cols) {
  const y = rows.map(ycol);
  const X = rows.map((r) => cols.map((f) => f(r.N)));
  const p = cols.length;
  const ATA = Array.from({ length: p }, () => new Array(p).fill(0));
  const ATy = new Array(p).fill(0);
  for (let i = 0; i < rows.length; i++) {
    for (let a = 0; a < p; a++) {
      ATy[a] += X[i][a] * y[i];
      for (let b = 0; b < p; b++) ATA[a][b] += X[i][a] * X[i][b];
    }
  }
  const beta = solveLinear(ATA, ATy);
  const ybar = y.reduce((s, v) => s + v, 0) / y.length;
  let ssRes = 0, ssTot = 0;
  for (let i = 0; i < rows.length; i++) {
    const pred = X[i].reduce((s, v, j) => s + v * beta[j], 0);
    ssRes += (y[i] - pred) ** 2;
    ssTot += (y[i] - ybar) ** 2;
  }
  return { beta, r2: 1 - ssRes / ssTot };
}

const ln = Math.log;
const yLamMax = (r) => r.lamMax;

// (a) log-linear  A + B logN ; (b) A + B logN + C/logN ; (c) A + B logN + C loglogN
const fitLogLin = ols(IMP96668_LAMMAX_ROWS, yLamMax, [() => 1, (N) => ln(N)]);
const fitInvLog = ols(IMP96668_LAMMAX_ROWS, yLamMax, [() => 1, (N) => ln(N), (N) => 1 / ln(N)]);
const fitLogLog = ols(IMP96668_LAMMAX_ROWS, yLamMax, [() => 1, (N) => ln(N), (N) => ln(ln(N))]);

// lam_min power law: log lam_min = lnC - q logN  ->  C N^-q.
const fitLamMinLog = ols(LAMMIN_ROWS, (r) => ln(r.lamMin), [() => 1, (N) => ln(N)]);
const lamMinC = Math.exp(fitLamMinLog.beta[0]);
const lamMinQ = -fitLamMinLog.beta[1];
const lamMinLaw = (N) => lamMinC * Math.pow(N, -lamMinQ);

// revised lam_max laws
const lawLogLin = (N) => fitLogLin.beta[0] + fitLogLin.beta[1] * ln(N);
const lawInvLog = (N) => fitInvLog.beta[0] + fitInvLog.beta[1] * ln(N) + fitInvLog.beta[2] / ln(N);
const lawLogLog = (N) => fitLogLog.beta[0] + fitLogLog.beta[1] * ln(N) + fitLogLog.beta[2] * ln(ln(N));

// ceiling: solve lammax(N)/lammin(N) = 1/eps by bisection on log10 N.
function solveCeiling(lawFn) {
  const cond = (N) => lawFn(N) / lamMinLaw(N);
  let lo = 3, hi = 12;
  for (let i = 0; i < 200; i++) {
    const mid = 0.5 * (lo + hi);
    if (cond(Math.pow(10, mid)) < BREAKDOWN) lo = mid; else hi = mid;
  }
  return Math.pow(10, 0.5 * (lo + hi));
}

// local effective slope d lammax / d logN at N=9000 for each model.
const L9 = ln(9000);
const slopeLogLin = fitLogLin.beta[1];
const slopeInvLog = fitInvLog.beta[1] - fitInvLog.beta[2] / (L9 * L9);
const slopeLogLog = fitLogLog.beta[1] + fitLogLog.beta[2] / L9;

export const IMP96668_FITS = Object.freeze({
  imp96443Slope: 0.3526253785070698, // original fit, N<=6000
  logLinear: Object.freeze({
    model: 'A + B log N',
    A: fitLogLin.beta[0], B: fitLogLin.beta[1], r2: fitLogLin.r2,
    localSlopeAt9000: slopeLogLin, ceiling: solveCeiling(lawLogLin),
  }),
  invLog: Object.freeze({
    model: 'A + B log N + C / log N',
    A: fitInvLog.beta[0], B: fitInvLog.beta[1], C: fitInvLog.beta[2], r2: fitInvLog.r2,
    localSlopeAt9000: slopeInvLog, ceiling: solveCeiling(lawInvLog),
  }),
  logLog: Object.freeze({
    model: 'A + B log N + C log log N',
    A: fitLogLog.beta[0], B: fitLogLog.beta[1], C: fitLogLog.beta[2], r2: fitLogLog.r2,
    localSlopeAt9000: slopeLogLog, ceiling: solveCeiling(lawLogLog),
  }),
  lamMinPower: Object.freeze({ C: lamMinC, q: lamMinQ, r2: fitLamMinLog.r2 }),
});

export const IMP96668_VERDICT = Object.freeze({
  question:
    'on the enlarged imp-96649 ladder (lam_max measured through N=9000), should the imp-96443 ' +
    'leading log slope 0.3526 be revised down, and does the conditioning ceiling stay ~4e7?',
  slopeRevisesDown: true,
  logLinearSlope: fitLogLin.beta[1],           // ~0.340 (11-rung)
  slopeDropVsImp96443Pct: (0.3526253785070698 - fitLogLin.beta[1]) / 0.3526253785070698 * 100,
  curvatureFavored: fitInvLog.r2 > fitLogLin.r2 && fitLogLog.r2 > fitLogLin.r2,
  localSlopeNear9000: Object.freeze({ invLog: slopeInvLog, logLog: slopeLogLog }), // ~0.26
  ceilingBand: Object.freeze({
    logLinear: solveCeiling(lawLogLin),
    invLog: solveCeiling(lawInvLog),
    logLog: solveCeiling(lawLogLog),
    imp96443Composed: 41088904.757400334,
  }),
  ceilingStaysInBand: true,
  ceilingMovesUpWithCurvature: true, // smaller lam_max -> smaller cond# -> higher ceiling
  computeCeilingN: 9916,             // imp-96352
  computeBindsFirst: true,
  anyBoundMoved: false,
  conclusion:
    'MEASURED. The imp-96443 leading log slope 0.3526 (fit to N<=6000) reads high: the enlarged ' +
    'eleven-rung log-linear slope is ~0.340, and a strongly-favored curvature term ' +
    '(R^2 0.9941 -> 0.99997) shows the local slope near N=9000 is ~0.26 and still slowing. The ' +
    'recomputed 1/eps conditioning ceiling stays in the ~4e7 band (4.10-4.49e7) and, because a ' +
    'smaller lam_max lowers cond#, moves slightly UP (more conservative). Compute binds first by ' +
    '>2000x (N ~ 9916). No bound moved; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

// Honest residual sub-gap.
export const IMP96668_SUBGAP = Object.freeze({
  id: 'imp-96668-curvature-not-asymptotically-identifiable',
  statement:
    'the curvature term robustly captures LOCAL flattening (effective slope ~0.26 at N=9000) and ' +
    'strongly improves the in-ladder fit, but it is NOT asymptotically identifiable from this ' +
    'ladder: the +C/logN model extrapolates to an asymptotic log slope ~0.147 while the ' +
    '+C loglogN model extrapolates to a negative (unphysical) asymptotic slope, yet both fit the ' +
    'measured rungs to R^2 >= 0.99997. The ~4-decade extrapolation of the conditioning ceiling to ' +
    'N ~ 4e7 therefore remains a non-rigorous fit (imp-96570/imp-96649 sub-gap, inherited); what ' +
    'this run establishes rigorously is only that the ceiling stays in the ~4e7 band under every ' +
    'candidate law and moves UP (conservative) once flattening is modeled. A genuinely rigorous ' +
    'ceiling still needs a proved lam_min lower bound, not a wider measured ladder.',
});

export const IMP96668_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement/re-analysis only: every lam_max / ' +
  'lam_min value is a reproducible power-/inverse-power iteration on the same exact Vasyunin Gram ' +
  'as imp-96443 / imp-96649; the re-fits, revised slopes and recomputed ceilings ' +
  '(tmp/imp-96668-refit-lammax.py) are pure re-analysis; no bound is claimed moved and no operator ' +
  'positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96668_ASSERTIONS = [
  {
    id: 'imp96668-loglinear-slope-revises-down',
    holds: () =>
      fitLogLin.beta[1] > 0.335 && fitLogLin.beta[1] < 0.345 &&
      fitLogLin.beta[1] < 0.3526253785070698 && fitLogLin.r2 > 0.99,
    why: 'the enlarged eleven-rung log-linear slope (~0.340) is below the imp-96443 value 0.3526 fit only to N<=6000: the leading log slope revises down modestly.',
  },
  {
    id: 'imp96668-curvature-strongly-favored',
    holds: () =>
      fitInvLog.r2 > fitLogLin.r2 && fitLogLog.r2 > fitLogLin.r2 &&
      fitInvLog.r2 > 0.9999 && fitLogLog.r2 > 0.9999 &&
      fitInvLog.beta[2] < 0, // C<0: concave, decelerating log growth
    why: 'both curvature models lift R^2 from ~0.994 to >0.9999 with a negative curvature coefficient: the log growth is decelerating, not linear-in-logN.',
  },
  {
    id: 'imp96668-local-slope-near-quarter-decade',
    holds: () =>
      slopeInvLog > 0.24 && slopeInvLog < 0.29 &&
      slopeLogLog > 0.24 && slopeLogLog < 0.29,
    why: 'the local effective slope d lammax / d logN near N=9000 is ~0.26 under both curvature models, ~26% below the imp-96443 0.3526.',
  },
  {
    id: 'imp96668-ceiling-stays-in-4e7-band',
    holds: () => {
      const cs = [solveCeiling(lawLogLin), solveCeiling(lawInvLog), solveCeiling(lawLogLog)];
      return cs.every((c) => c > 3.5e7 && c < 5e7);
    },
    why: 'the recomputed 1/eps conditioning ceiling stays in the ~4e7 band (4.1-4.5e7) under every candidate lam_max law.',
  },
  {
    id: 'imp96668-curvature-raises-ceiling-conservative',
    holds: () =>
      solveCeiling(lawInvLog) > solveCeiling(lawLogLin) &&
      solveCeiling(lawLogLog) > solveCeiling(lawLogLin),
    why: 'modeling the flattening makes lam_max smaller at large N, lowering cond# and RAISING the ceiling: the revised ceiling is more conservative, not less.',
  },
  {
    id: 'imp96668-lammin-power-clean',
    holds: () => lamMinQ > 1.9 && lamMinQ < 1.95 && fitLamMinLog.r2 > 0.9999,
    why: 'the imp-96649 lam_min ladder fits a clean power law (q ~ 1.92, R^2 > 0.9999), so the composed ceiling recompute is well-posed.',
  },
  {
    id: 'imp96668-honesty-gate-no-qed',
    holds: () =>
      IMP96668_VERDICT.anyBoundMoved === false &&
      IMP96668_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP96668_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96668_HONEST_BANNER) &&
      /RH open/.test(IMP96668_HONEST_BANNER) &&
      /not asymptotically identifiable/.test(IMP96668_SUBGAP.id.replace(/-/g, ' ')),
    why: 'measurement only: no bound moved, compute binds first, honesty markers present, and the residual sub-gap (curvature not asymptotically identifiable; extrapolation still non-rigorous) is recorded.',
  },
];

for (const a of IMP96668_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96668-route-m-lammax-curvature-refit assertion failed: ${a.id}`);
  }
}

export default {
  eps: IMP96668_EPS,
  lamMaxRows: IMP96668_LAMMAX_ROWS,
  fits: IMP96668_FITS,
  verdict: IMP96668_VERDICT,
  subGap: IMP96668_SUBGAP,
  banner: IMP96668_HONEST_BANNER,
};
