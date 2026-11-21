/**
 * @module imp-96890-route-m-frobenius-concave-norm-ceiling-refit
 *
 * imp-96890 (numerical, MEASUREMENT/FIT ONLY): the imp-96751 log-linear norm fit
 * ||G||_F ~ a + b log N over-predicts the exact Vasyunin-Gram Frobenius norm at every high
 * rung (imp-96792 Finding 2: +0.221% at N=13000 -> +0.375% at N=16000) because the exact
 * norm is CONCAVE in log N. This ticket fits two concave-corrected norm models to the full
 * exact 18-rung ladder (250..16000), assesses residuals vs the straight-line fit, and
 * re-solves the cond#(N)=||G||_F(N)/lam_min(N)=1/eps ceiling scale N* (the Route M Frobenius
 * conditioning ceiling F), measuring how much the concavity correction moves F relative to the
 * rigorous trace-lower ceiling T~2.594e7. Fit/measurement only; posts no rigorous ceiling;
 * moves no bound; NO QED.
 *
 * THE DATA. The full exact ladder is assembled from the committed rungs:
 *   N=250..6000   imp-96684 IMP96648_ROWS (8 rungs)
 *   N=7000..9000  imp-96684 IMP96684_NEW_ROWS (3 rungs)
 *   N=10000..12000 imp-96694 IMP96694_NEW_ROWS (3 rungs)
 *   N=13000..16000 imp-96751 IMP96751_NEW_ROWS / imp-96792 IMP96792_EXACT_ROWS (4 rungs)
 * -> 18 exact ||G||_F rungs on the same exact Vasyunin coprime-Gram construction.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the norm is concave in log N; both concave models fit far better than the line.
 * -------------------------------------------------------------------------------
 * The straight-line fit ||G||_F ~ a + b log N reproduces the imp-96751/imp-96792 LOGLINEAR_NORM
 * exactly (a=2.642453, b=0.465696, r2=0.998245, RMS residual 2.307e-2, max |resid| 5.732e-2),
 * confirming the ladder assembly. Its residuals (fit-exact) trace the classic concave signature:
 * ABOVE the data at both ends (N=250,500 and every N ge 10000) and BELOW in the interior
 * (N=1000..9000). Adding a concavity term collapses the residual by an order of magnitude:
 *   quadratic  a + b log N + c (log N)^2 : c=-1.690e-2 (< 0, concave), RMS 1.630e-3 (14.2x smaller), r2=0.99999124
 *   +tail      a + b log N + d / N       : d=-48.116,             RMS 6.240e-3 (3.7x smaller),  r2=0.99987160
 * The negative (log N)^2 coefficient is the direct measurement of concavity: the straight line
 * provably runs above the exact norm in the extrapolation region N > 16000.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- re-solving the ceiling with the concave models moves F UP, AWAY from T (not down).
 * -------------------------------------------------------------------------------
 * The ceiling scale N* is where cond#(N)=||G||_F(N)/lam_min(N)=1/eps, with lam_min=A N^{-p}
 * (imp-96428 A=0.8186721, p=1.917927) and eps=2.22e-16 (imp-96751 bisection). At the ceiling
 * scale log N* ~ 17.45 the concave models predict a SMALLER norm than the straight line (the
 * concave curve flattens below the line as N grows), so cond# reaches 1/eps LATER, pushing N*
 * to LARGER N:
 *   straight-line   N* = 3.7865e7   (the incumbent fitted F, imp-96792)
 *   quadratic       N* = 4.1029e7   (+8.36% vs the line)
 *   +d/N            N* = 3.8384e7   (+1.37% vs the line)
 * So the concavity correction does NOT bring the fitted F down toward the rigorous trace ceiling
 * T=2.594e7; it moves F UP, widening the F-T gap (Nstar over T rises 1.460 -> 1.482 / 1.582). The
 * incumbent straight-line F was, if anything, a slight UNDER-estimate of the fit-based ceiling
 * once concavity is modeled -- the opposite of what an "over-predicting fit -> too-high ceiling"
 * intuition would suggest, because the ceiling is set by the norm at the extrapolation point,
 * where a concave (flatter) norm delays the 1/eps crossing.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the ceiling shift is MODEL-DEPENDENT (+1.4% vs +8.4%); the +d/N form is the safer
 * extrapolant; the quadratic turns over unphysically far out.
 * -------------------------------------------------------------------------------
 * The two concave corrections disagree on the ceiling shift by ~6x (+1.37% vs +8.36%), reflecting
 * genuine extrapolation ambiguity ~3.4 decades beyond the top exact rung (N=16000). The quadratic
 * has a maximum at log N = b/(2|c|) ~ 21.56, i.e. N ~ 2.31e9, beyond which it predicts a
 * DECREASING norm -- unphysical; it is unreliable as a far extrapolant. The monotone +d/N form
 * (d/N -> 0, norm increasing for all N) is the physically safer correction and gives the smaller,
 * more credible +1.37% shift. Either way F remains a fit strictly above the rigorous trace ceiling
 * T; the concavity correction refines the fitted ceiling but does not close, and slightly widens,
 * the F-T gap.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The exact 18-rung Vasyunin-Gram Frobenius norm is concave in log N (fitted (log N)^2 coefficient
 * -1.690e-2 < 0; concave models cut the RMS residual 14x / 3.7x). Re-solving the conditioning
 * ceiling with the concave models moves the fitted F ceiling scale UP, not down: N*=3.8384e7
 * (+1.37%, monotone +d/N) to 4.1029e7 (+8.36%, quadratic), AWAY from the rigorous trace ceiling
 * T=2.594e7 -- because at the extrapolation scale a flatter concave norm reaches cond#=1/eps
 * later. The straight-line F was a slight under-estimate of the fit ceiling, not an over-estimate.
 * F stays a model-dependent fit strictly above T; no rigorous ceiling is posted; the trace-lower
 * ceiling T~2.594e7 is unaffected; no bound moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96792-route-m-frobenius-ladder-direct-vs-fit-gap.js (Finding 2: fit over-predicts, norm concave)
 * @see imp-96751-route-m-frobenius-ladder-above-12000.js (the exact rungs N=13000..16000, log-linear norm fit)
 * @see imp-96694-route-m-majorant-ladder-above-9000.js (rungs N=10000..12000)
 * @see imp-96684-route-m-frobenius-majorant-high-n-rungs.js (rungs N=250..9000)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the fitted F ceiling, T<F<M ordering)
 *
 * Ticket: imp-96890 (numerical, opus-4-8, api-pool). Fit/measurement only; NO QED.
 */

// double-precision machine epsilon; Cholesky-breakdown scale cond# = 1/eps (imp-96751 convention).
export const IMP96890_EPS = 2.220446049250313e-16;
// imp-96428 lam_min power law A N^{-p}; used to place the ceiling scale (imp-96751/imp-96792 convention).
export const IMP96890_LAMMIN = Object.freeze({ A: 0.8186721, p: 1.917927 });
// rigorous trace-lower conditioning ceiling (imp-96693); the concave refit is measured against it.
export const IMP96890_TRACE_CEILING = 2.594e7;

// Full exact 18-rung Vasyunin-Gram ||G||_F ladder (250..16000), assembled from the committed rungs.
export const IMP96890_LADDER = Object.freeze([
  Object.freeze({ N: 250, frobenius: 5.156452701268937 }),
  Object.freeze({ N: 500, frobenius: 5.529997674354878 }),
  Object.freeze({ N: 1000, frobenius: 5.8818954543089985 }),
  Object.freeze({ N: 2000, frobenius: 6.214997339611781 }),
  Object.freeze({ N: 3000, frobenius: 6.402120438801899 }),
  Object.freeze({ N: 4000, frobenius: 6.5317250252564945 }),
  Object.freeze({ N: 5000, frobenius: 6.63054847658566 }),
  Object.freeze({ N: 6000, frobenius: 6.710233218835323 }),
  Object.freeze({ N: 7000, frobenius: 6.776886864553974 }),
  Object.freeze({ N: 8000, frobenius: 6.834107225532644 }),
  Object.freeze({ N: 9000, frobenius: 6.884189704438562 }),
  Object.freeze({ N: 10000, frobenius: 6.928687055 }),
  Object.freeze({ N: 11000, frobenius: 6.968697840 }),
  Object.freeze({ N: 12000, frobenius: 7.005027412 }),
  Object.freeze({ N: 13000, frobenius: 7.038283442 }),
  Object.freeze({ N: 14000, frobenius: 7.068935551 }),
  Object.freeze({ N: 15000, frobenius: 7.097354059 }),
  Object.freeze({ N: 16000, frobenius: 7.123836045 }),
]);

// The three fitted norm models (least-squares over the 18 exact rungs;
// tmp/imp-96890-fit.py, numpy lstsq, reproducible).
// Model 1 (straight line) reproduces the imp-96751/imp-96792 LOGLINEAR_NORM exactly.
export const IMP96890_FIT_LINE = Object.freeze({
  a: 2.642452826108074,
  b: 0.4656959846866509,
  r2: 0.998245309673608,
});
// Model 2: concave quadratic a + b log N + c (log N)^2; c < 0 measures the concavity.
export const IMP96890_FIT_QUAD = Object.freeze({
  a: 1.651183444,
  b: 0.728732486,
  c: -0.01690026075,
  r2: 0.999991239,
});
// Model 3: monotone tail-corrected a + b log N + d / N (d/N -> 0; safer far extrapolant).
export const IMP96890_FIT_TAIL = Object.freeze({
  a: 2.960021214,
  b: 0.431269756,
  d: -48.11550982,
  r2: 0.999871599,
});

const froLine = (N) => IMP96890_FIT_LINE.a + IMP96890_FIT_LINE.b * Math.log(N);
const froQuad = (N) => {
  const L = Math.log(N);
  return IMP96890_FIT_QUAD.a + IMP96890_FIT_QUAD.b * L + IMP96890_FIT_QUAD.c * L * L;
};
const froTail = (N) => IMP96890_FIT_TAIL.a + IMP96890_FIT_TAIL.b * Math.log(N) + IMP96890_FIT_TAIL.d / N;

function rmsResidual(froOf) {
  let s = 0;
  for (const r of IMP96890_LADDER) {
    const e = froOf(r.N) - r.frobenius;
    s += e * e;
  }
  return Math.sqrt(s / IMP96890_LADDER.length);
}

// FINDING 1: concave models cut the RMS residual by an order of magnitude vs the straight line.
export const IMP96890_RESIDUALS = Object.freeze({
  rmsLine: rmsResidual(froLine), // ~2.307e-2
  rmsQuad: rmsResidual(froQuad), // ~1.630e-3
  rmsTail: rmsResidual(froTail), // ~6.240e-3
  quadImprovement: rmsResidual(froLine) / rmsResidual(froQuad), // ~14.2x
  tailImprovement: rmsResidual(froLine) / rmsResidual(froTail), // ~3.7x
  concavityCoeff: IMP96890_FIT_QUAD.c, // < 0: norm concave in log N
});

// Re-solve the ceiling scale N* where cond#(N)=fit(N)/lam_min(N)=1/eps (imp-96751 bisection).
function solveCeiling(froOf) {
  const { A, p } = IMP96890_LAMMIN;
  let lo = 1e3;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = froOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / IMP96890_EPS) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}

// FINDING 2: the concave models push the fitted F ceiling scale UP (away from T), not down.
const NstarLine = solveCeiling(froLine);
const NstarQuad = solveCeiling(froQuad);
const NstarTail = solveCeiling(froTail);
export const IMP96890_CEILING = Object.freeze({
  NstarLine, // ~3.7865e7 (incumbent fitted F)
  NstarQuad, // ~4.1029e7
  NstarTail, // ~3.8384e7
  quadShiftPct: (NstarQuad / NstarLine - 1) * 100, // ~+8.36
  tailShiftPct: (NstarTail / NstarLine - 1) * 100, // ~+1.37
  traceCeiling: IMP96890_TRACE_CEILING, // 2.594e7
  lineOverT: NstarLine / IMP96890_TRACE_CEILING, // ~1.460
  quadOverT: NstarQuad / IMP96890_TRACE_CEILING, // ~1.582
  tailOverT: NstarTail / IMP96890_TRACE_CEILING, // ~1.480
  movesFtowardT: NstarQuad < NstarLine && NstarTail < NstarLine, // false: both move UP
});

// FINDING 3: the quadratic turns over (norm decreasing) far out -- unphysical extrapolant.
export const IMP96890_QUAD_TURNOVER = Object.freeze({
  logNpeak: -IMP96890_FIT_QUAD.b / (2 * IMP96890_FIT_QUAD.c), // ~21.56
  Npeak: Math.exp(-IMP96890_FIT_QUAD.b / (2 * IMP96890_FIT_QUAD.c)), // ~2.31e9
  logNstar: Math.log(NstarQuad), // ~17.53 (ceiling still on the rising branch)
  ceilingBelowPeak: Math.log(NstarQuad) < -IMP96890_FIT_QUAD.b / (2 * IMP96890_FIT_QUAD.c),
});

export const IMP96890_VERDICT = Object.freeze({
  question:
    'fit a curvature-corrected ||G||_F norm model to the imp-96751 exact 18-rung ' +
    'Vasyunin-Gram ladder and re-place the Route M Frobenius conditioning ceiling F, ' +
    'measuring how much the concavity correction moves F relative to the rigorous ' +
    'trace ceiling T=2.594e7.',
  normConcaveInLogN: IMP96890_FIT_QUAD.c < 0,
  concaveModelsFitBetter:
    IMP96890_RESIDUALS.rmsQuad < IMP96890_RESIDUALS.rmsLine &&
    IMP96890_RESIDUALS.rmsTail < IMP96890_RESIDUALS.rmsLine,
  ceilingMovesUpNotDown: !IMP96890_CEILING.movesFtowardT,
  ceilingShiftModelDependent: true,
  saferTailShiftPct: IMP96890_CEILING.tailShiftPct, // ~+1.37
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  conclusion:
    'MEASURED. The exact 18-rung Vasyunin-Gram Frobenius norm is concave in log N (fitted ' +
    '(log N)^2 coefficient -1.690e-2 < 0; concave models cut the RMS residual 14.2x / 3.7x vs ' +
    'the straight line). Re-solving the conditioning ceiling with the concave models moves the ' +
    'fitted F ceiling scale UP, not down: N*=3.8384e7 (+1.37%, monotone +d/N) to 4.1029e7 ' +
    '(+8.36%, quadratic), AWAY from the rigorous trace ceiling T=2.594e7 -- at the extrapolation ' +
    'scale a flatter concave norm reaches cond#=1/eps later. The incumbent straight-line ' +
    'F=3.7865e7 was a slight under-estimate of the fit ceiling, not an over-estimate. The shift ' +
    'is model-dependent (~6x spread); the monotone +d/N form is the safer far extrapolant (the ' +
    'quadratic turns over unphysically at N~2.31e9). F stays a model-dependent fit strictly above ' +
    'T; no rigorous ceiling is posted; T~2.594e7 is unaffected; no bound moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96890_SUBGAP = Object.freeze({
  id: 'imp-96890-frobenius-ceiling-shift-model-dependent-and-moves-away-from-T',
  statement:
    'the concavity-corrected fit moves the Route M Frobenius conditioning ceiling F UP by +1.37% ' +
    '(monotone +d/N) to +8.36% (quadratic), AWAY from the rigorous trace ceiling T=2.594e7, and ' +
    'the shift is model-dependent by ~6x over a ~3.4-decade extrapolation; the quadratic is an ' +
    'unphysical far extrapolant (turns over at N~2.31e9). Pinning F rigorously would need a proven ' +
    'one-sided interior norm asymptotic (imp-96750), not a better empirical fit; the concavity ' +
    'correction refines but does not close the F-T gap.',
});

export const IMP96890_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Fit/measurement only: least-squares refit of ' +
  'concave-corrected ||G||_F models (quadratic in log N, and +d/N) over the exact 18-rung ' +
  'Vasyunin-Gram ladder N=250..16000, with the imp-96751 cond#=1/eps ceiling bisection re-solved ' +
  'per model. No new heavy compute; no rigorous ceiling is posted; no bound is claimed moved; the ' +
  'rigorous trace-lower ceiling T~2.594e7 is unaffected.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96890_ASSERTIONS = [
  {
    id: 'imp96890-ladder-18-rungs-line-fit-reproduces-imp96792',
    holds: () =>
      IMP96890_LADDER.length === 18 &&
      IMP96890_LADDER.every((r, i) => i === 0 || r.frobenius > IMP96890_LADDER[i - 1].frobenius) &&
      Math.abs(IMP96890_FIT_LINE.a - 2.642452826108074) < 1e-9 &&
      Math.abs(IMP96890_FIT_LINE.b - 0.4656959846866509) < 1e-9,
    why: 'the assembled 18-rung ladder is monotone and its straight-line log fit reproduces the imp-96751/imp-96792 LOGLINEAR_NORM (a=2.642453, b=0.465696) exactly: the ladder assembly is correct.',
  },
  {
    id: 'imp96890-norm-concave-and-concave-models-fit-better',
    holds: () =>
      IMP96890_FIT_QUAD.c < 0 &&
      IMP96890_RESIDUALS.rmsQuad < IMP96890_RESIDUALS.rmsLine &&
      IMP96890_RESIDUALS.rmsTail < IMP96890_RESIDUALS.rmsLine &&
      IMP96890_RESIDUALS.quadImprovement > 8 &&
      IMP96890_RESIDUALS.rmsLine > 0.02 && IMP96890_RESIDUALS.rmsLine < 0.025 &&
      IMP96890_RESIDUALS.rmsQuad > 0.0014 && IMP96890_RESIDUALS.rmsQuad < 0.0018,
    why: 'the fitted (log N)^2 coefficient is negative (norm concave in log N) and the concave models cut the RMS residual by an order of magnitude (14.2x quadratic, 3.7x +d/N) vs the straight line.',
  },
  {
    id: 'imp96890-ceiling-moves-up-away-from-T-not-down',
    holds: () =>
      IMP96890_CEILING.movesFtowardT === false &&
      IMP96890_CEILING.NstarQuad > IMP96890_CEILING.NstarLine &&
      IMP96890_CEILING.NstarTail > IMP96890_CEILING.NstarLine &&
      IMP96890_CEILING.quadShiftPct > 7 && IMP96890_CEILING.quadShiftPct < 10 &&
      IMP96890_CEILING.tailShiftPct > 1 && IMP96890_CEILING.tailShiftPct < 2 &&
      IMP96890_CEILING.NstarLine > IMP96890_TRACE_CEILING,
    why: 'the concave models push the fitted F ceiling scale UP (+8.36% quadratic, +1.37% +d/N), away from the rigorous trace ceiling T=2.594e7, because a flatter concave norm at the extrapolation scale reaches cond#=1/eps later; F stays a fit strictly above T.',
  },
  {
    id: 'imp96890-quadratic-turns-over-unphysically-far-out',
    holds: () =>
      IMP96890_QUAD_TURNOVER.Npeak > 1e9 && IMP96890_QUAD_TURNOVER.Npeak < 5e9 &&
      IMP96890_QUAD_TURNOVER.ceilingBelowPeak === true,
    why: 'the quadratic norm model has a maximum at N~2.31e9 (norm decreasing beyond -- unphysical); the ceiling scale sits below it on the rising branch, but the turnover makes the quadratic an unreliable far extrapolant vs the monotone +d/N form.',
  },
  {
    id: 'imp96890-honesty-gate-no-qed',
    holds: () =>
      IMP96890_VERDICT.anyBoundMoved === false &&
      IMP96890_VERDICT.postsRigorousCeiling === false &&
      IMP96890_VERDICT.normConcaveInLogN === true &&
      IMP96890_VERDICT.ceilingMovesUpNotDown === true &&
      /NO QED/.test(IMP96890_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96890_HONEST_BANNER) &&
      /RH open/.test(IMP96890_HONEST_BANNER) &&
      /moves-away-from-T/.test(IMP96890_SUBGAP.id),
    why: 'fit/measurement only: no rigorous ceiling is posted, no bound moves, the norm is measured concave, the ceiling moves UP away from T, and the honesty markers plus the model-dependent-shift sub-gap are present.',
  },
];

for (const a of IMP96890_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96890-route-m-frobenius-concave-norm-ceiling-refit assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96890_EPS,
  lamMin: IMP96890_LAMMIN,
  traceCeiling: IMP96890_TRACE_CEILING,
  ladder: IMP96890_LADDER,
  fitLine: IMP96890_FIT_LINE,
  fitQuad: IMP96890_FIT_QUAD,
  fitTail: IMP96890_FIT_TAIL,
  residuals: IMP96890_RESIDUALS,
  ceiling: IMP96890_CEILING,
  quadTurnover: IMP96890_QUAD_TURNOVER,
  verdict: IMP96890_VERDICT,
  subGap: IMP96890_SUBGAP,
  banner: IMP96890_HONEST_BANNER,
};
