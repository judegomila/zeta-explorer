/**
 * @module imp-96792-route-m-frobenius-ladder-direct-vs-fit-gap
 *
 * imp-96792 (numerical, MEASUREMENT ONLY): does extending the imp-96751 direct Frobenius
 * ladder above N=12000 narrow the gap between the FITTED Frobenius ceiling F (~3.76e7, the
 * imp-96693 log-fit extrapolation) and a DIRECT high-N evaluation? And what is the largest N
 * at which a direct Vasyunin-Gram evaluation remains tractable in-pool?
 *
 * THE ISSUE. The imp-96693 conditioning ceiling F is not a directly evaluated quantity: it is
 * the N at which cond#(N)=lam_max(N)/lam_min(N) reaches 1/eps, solved from the log-linear norm
 * fit ||G||_F ~ a + b log N (imp-96751 LOGLINEAR_NORM a=2.642453, b=0.465696) extrapolated well
 * beyond the exact ladder. The ladder itself reaches only N=16000 (imp-96751 rebuilt the exact
 * Vasyunin Gram four rungs above the imp-96694 N=12000 stop). This ticket asks the direct
 * question: as the exact ladder is pushed higher, does the fitted F converge toward a directly
 * evaluated value, and can a direct evaluation ever reach the ceiling scale N* itself?
 *
 * WHAT WAS DONE. Pure re-analysis of the imp-96751 exact rungs (no new heavy compute): (1) the
 * ceiling scale N* where the log-linear norm fit hits cond#=1/eps was re-solved by the same
 * imp-96751 bisection; (2) the fit-vs-direct residual (fitted ||G||_F minus the EXACT ||G||_F)
 * was measured at each of the four new rungs N=13000,14000,15000,16000; (3) the fitted-F ceiling
 * was tabulated across ladder lengths (11-rung 3.764e7 / 14-rung 3.775e7 / 18-rung 3.787e7); (4)
 * the decade gap between the ceiling scale and the tractable reach was computed. Measurement
 * only; posts no rigorous ceiling; changes no bound; NO QED.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- the ceiling scale N* sits ~3.37 DECADES above the tractable reach; a direct
 * evaluation AT the ceiling is structurally out of reach.
 * -------------------------------------------------------------------------------
 * The log-linear norm fit reaches cond#=1/eps at N* = 3.7865e7 -- the "F" ceiling scale. The
 * largest exact Vasyunin Gram rung is N=16000 (imp-96751, ~1916 s wall). N* over 16000 = 2366.6,
 * i.e. log10(N* over 16000) = 3.37 decades. Extending the ladder a few rungs (16000 -> 20000, say)
 * closes a negligible fraction of a 3.37-decade gap: the fitted F can never be replaced by a
 * DIRECT evaluation at the ceiling scale in-pool, because the ceiling scale is ~2370x above the
 * largest tractable N.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- at the reachable rungs the fit-vs-direct residual WIDENS with N, and the fitted F
 * drifts UP with each extension: the fit and the direct value DIVERGE, they do not converge.
 * -------------------------------------------------------------------------------
 * The log-linear norm fit OVER-predicts the exact ||G||_F at every new rung, and the over-
 * prediction grows monotonically: +0.2212% (N=13000) -> +0.2749% -> +0.3260% -> +0.3750%
 * (N=16000). The exact norm is concave in log N (the imp-96751 s-drift-up is on the SQUARED
 * norm; the norm itself flattens), so a straight-line log fit runs progressively above the data.
 * Consistently, the fitted-F ceiling edges UP each time the ladder is extended: 3.764e7 (11-rung)
 * -> 3.775e7 (14-rung, +0.29%) -> 3.7865e7 (18-rung, +0.31%). Extending the ladder therefore
 * does NOT narrow the fitted-F -> direct gap; it moves the fitted F slightly further from a
 * (hypothetical) direct value at the top rung, tracking the concavity of the exact norm.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- tractability: the exact direct evaluation is practically capped near N~16000-20000
 * in-pool; the ceiling scale is unreachable by many orders of magnitude.
 * -------------------------------------------------------------------------------
 * The exact Vasyunin V-table + coprime-Gram construction (imp-96105 / imp-96443 / imp-96694 /
 * imp-96751) cost ~1916 s of wall at N=16000 and grows steeply with N. A few more rungs
 * (N~20000) remain in-pool at rising cost; the ceiling scale N*~3.79e7 is ~2370x beyond that --
 * no in-pool direct Gram reaches it. The productive use of more direct rungs is to TIGHTEN THE
 * FIT (shrink the extrapolation window, stabilise a,b and the interior coefficient s), not to
 * pin the ceiling by direct evaluation.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * Extending the imp-96751 direct Frobenius ladder above N=12000 does NOT narrow the gap between
 * the fitted F ceiling and a direct high-N evaluation. The ceiling scale N*=3.7865e7 sits 3.37
 * decades (x2366.6) above the tractable reach N=16000, so no in-pool direct Gram reaches it; and
 * at the reachable rungs the fit-vs-direct residual WIDENS (0.221% -> 0.375%) while the fitted F
 * edges UP with each extension (3.764e7 -> 3.775e7 -> 3.787e7). More direct rungs tighten the
 * FIT, they do not converge it to a direct ceiling evaluation. No rigorous ceiling is posted; the
 * rigorous trace-lower ceiling T~2.594e7 is unaffected; no bound moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96751-route-m-frobenius-ladder-above-12000.js (the four exact rungs N=13000..16000 re-analysed here)
 * @see imp-96693-route-m-conditioning-ceiling-residual-decomposition.js (the fitted F=3.764e7 ceiling and T<F<M ordering)
 * @see imp-96694-route-m-majorant-ladder-above-9000.js (F 3.764e7 -> 3.775e7 fourteen-rung re-solve)
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (measured lam_max composed ceiling M~4.109e7)
 *
 * Ticket: imp-96792 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// double-precision machine epsilon; Cholesky-breakdown scale cond# = 1/eps (imp-96751 convention).
export const IMP96792_EPS = 2.220446049250313e-16;
// imp-96428 lam_min power law A N^{-p}; used to place the ceiling scale.
export const IMP96792_LAMMIN = Object.freeze({ A: 0.8186721, p: 1.917927 });
// imp-96751 full 18-rung log-linear norm fit ||G||_F ~ a + b log N.
export const IMP96792_LOGLINEAR_NORM = Object.freeze({
  a: 2.642452826108074,
  b: 0.4656959846866509,
  r2: 0.998245309673608,
});

// The four exact imp-96751 rungs above N=12000: N and the EXACT ||G||_F (frobenius).
export const IMP96792_EXACT_ROWS = Object.freeze([
  Object.freeze({ N: 13000, frobenius: 7.038283442 }),
  Object.freeze({ N: 14000, frobenius: 7.068935551 }),
  Object.freeze({ N: 15000, frobenius: 7.097354059 }),
  Object.freeze({ N: 16000, frobenius: 7.123836045 }),
]);

// The largest exact Vasyunin-Gram rung available in-pool (imp-96751, ~1916 s wall at N=16000).
export const IMP96792_REACH_N = 16000;

const froLogLin = (N) =>
  IMP96792_LOGLINEAR_NORM.a + IMP96792_LOGLINEAR_NORM.b * Math.log(N);

// Re-solve the ceiling scale N* where cond#(N)=fit(N)/lam_min(N)=1/eps (imp-96751 bisection).
function solveCeiling(froOf) {
  const { A, p } = IMP96792_LAMMIN;
  let lo = 1e3;
  let hi = 1e12;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = froOf(N) / (A * Math.pow(N, -p));
    if (cond > 1 / IMP96792_EPS) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}

// FINDING 1: the ceiling scale sits ~3.37 decades above the tractable reach.
export const IMP96792_CEILING_SCALE = Object.freeze({
  Nstar: solveCeiling(froLogLin), // ~3.7865e7 (the fitted F ceiling scale)
  reachN: IMP96792_REACH_N, // 16000 (largest exact rung)
  ratioToReach: solveCeiling(froLogLin) / IMP96792_REACH_N, // ~2366.6x
  decadesToReach: Math.log10(solveCeiling(froLogLin) / IMP96792_REACH_N), // ~3.374
});

// FINDING 2: fit-vs-direct residual (fitted ||G||_F minus EXACT ||G||_F) at each new rung.
// The fit OVER-predicts and the over-prediction WIDENS with N: fit and direct diverge.
export const IMP96792_FIT_VS_DIRECT = Object.freeze(
  IMP96792_EXACT_ROWS.map((r) => {
    const fit = froLogLin(r.N);
    return Object.freeze({
      N: r.N,
      exact: r.frobenius,
      fit,
      relResidual: (fit - r.frobenius) / r.frobenius, // positive; grows with N
    });
  }),
);

// FINDING 2 (cont.): the fitted-F ceiling edges UP with each ladder extension.
export const IMP96792_F_DRIFT = Object.freeze({
  elevenRung: 3.764e7, // imp-96684 N<=9000 snapshot
  fourteenRung: 3.775e7, // imp-96694 N=12000 re-solve
  eighteenRung: solveCeiling(froLogLin), // imp-96751 N=16000 re-solve, ~3.7865e7
  shift11to14Pct: (3.775e7 / 3.764e7 - 1) * 100, // ~0.29
  shift14to18Pct: (solveCeiling(froLogLin) / 3.775e7 - 1) * 100, // ~0.31
  driftsUp: 3.775e7 > 3.764e7 && solveCeiling(froLogLin) > 3.775e7,
});

export const IMP96792_VERDICT = Object.freeze({
  question:
    'does extending the imp-96751 direct Frobenius ladder above N=12000 narrow the gap between ' +
    'the fitted F ceiling (~3.76e7, imp-96693 log-fit extrapolation) and a direct high-N ' +
    'evaluation, and what is the largest N at which a direct Vasyunin-Gram evaluation is ' +
    'tractable in-pool?',
  narrowsGap: false,
  ceilingScaleDecadesAboveReach: IMP96792_CEILING_SCALE.decadesToReach, // ~3.37
  fitResidualWidensWithN:
    IMP96792_FIT_VS_DIRECT[3].relResidual > IMP96792_FIT_VS_DIRECT[0].relResidual,
  fittedFdriftsUp: IMP96792_F_DRIFT.driftsUp,
  tractableReachN: IMP96792_REACH_N, // ~16000-20000 in-pool practical cap
  anyBoundMoved: false,
  postsRigorousCeiling: false,
  conclusion:
    'MEASURED. Extending the exact Vasyunin Gram above N=12000 does NOT narrow the fitted-F -> ' +
    'direct gap. The ceiling scale N*=3.7865e7 sits 3.37 decades (x2366.6) above the largest ' +
    'tractable rung N=16000, so no in-pool direct Gram reaches it; and at the reachable rungs ' +
    'the log-linear norm fit OVER-predicts the exact ||G||_F by a residual that WIDENS with N ' +
    '(+0.221% at N=13000 -> +0.375% at N=16000) while the fitted F edges UP with each extension ' +
    '(3.764e7 -> 3.775e7 -> 3.787e7). More direct rungs tighten the FIT (shrink the extrapolation ' +
    'window), they do not converge it to a direct ceiling evaluation; the ceiling stays a fit. ' +
    'The rigorous trace-lower ceiling T~2.594e7 is unaffected; no bound moves; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96792_SUBGAP = Object.freeze({
  id: 'imp-96792-fitted-F-ceiling-not-directly-evaluable-scale-3p4-decades-out-of-reach',
  statement:
    'the fitted F ceiling scale N*~3.79e7 is ~3.4 decades above the largest tractable in-pool ' +
    'exact Vasyunin Gram rung (N~16000-20000), so F can never be replaced by a direct evaluation ' +
    'at the ceiling; the fit-vs-direct residual widens with N and the fitted F drifts up, so more ' +
    'direct rungs tighten the fit but do not converge it. Pinning the ceiling would need a proven ' +
    'one-sided interior asymptotic (imp-96750), not more direct rungs.',
});

export const IMP96792_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: re-analysis of the imp-96751 ' +
  'exact rungs N=13000,14000,15000,16000 (exact ||G||_F on the same exact Vasyunin Gram) against ' +
  'the imp-96751 log-linear norm fit and the ceiling-scale bisection. No new heavy compute; no ' +
  'rigorous ceiling is posted; no bound is claimed moved; the rigorous trace-lower ceiling ' +
  'T~2.594e7 is unaffected.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96792_ASSERTIONS = [
  {
    id: 'imp96792-ceiling-scale-3p4-decades-above-reach',
    holds: () =>
      IMP96792_CEILING_SCALE.Nstar > 3.7e7 && IMP96792_CEILING_SCALE.Nstar < 3.85e7 &&
      IMP96792_CEILING_SCALE.ratioToReach > 2000 && IMP96792_CEILING_SCALE.ratioToReach < 2600 &&
      IMP96792_CEILING_SCALE.decadesToReach > 3.3 && IMP96792_CEILING_SCALE.decadesToReach < 3.45,
    why: 'the fitted-F ceiling scale N*=3.7865e7 sits ~2366.6x (3.37 decades) above the largest tractable exact rung N=16000: a direct evaluation at the ceiling scale is structurally out of reach in-pool.',
  },
  {
    id: 'imp96792-fit-over-predicts-and-residual-widens-with-N',
    holds: () =>
      IMP96792_FIT_VS_DIRECT.every((r) => r.relResidual > 0) &&
      IMP96792_FIT_VS_DIRECT.every((r, i) => i === 0 || r.relResidual > IMP96792_FIT_VS_DIRECT[i - 1].relResidual) &&
      IMP96792_FIT_VS_DIRECT[0].relResidual > 0.002 && IMP96792_FIT_VS_DIRECT[0].relResidual < 0.0025 &&
      IMP96792_FIT_VS_DIRECT[3].relResidual > 0.0035 && IMP96792_FIT_VS_DIRECT[3].relResidual < 0.004,
    why: 'the log-linear norm fit over-predicts the exact ||G||_F at every new rung and the over-prediction grows monotonically (+0.221% at N=13000 -> +0.375% at N=16000): fit and direct value diverge with N, they do not converge.',
  },
  {
    id: 'imp96792-fitted-F-drifts-up-with-each-extension',
    holds: () =>
      IMP96792_F_DRIFT.driftsUp === true &&
      IMP96792_F_DRIFT.shift11to14Pct > 0.25 && IMP96792_F_DRIFT.shift11to14Pct < 0.35 &&
      IMP96792_F_DRIFT.shift14to18Pct > 0.25 && IMP96792_F_DRIFT.shift14to18Pct < 0.35 &&
      IMP96792_F_DRIFT.eighteenRung > IMP96792_F_DRIFT.fourteenRung,
    why: 'the fitted F ceiling edges up with each ladder extension (3.764e7 -> 3.775e7 -> 3.787e7, +~0.3% each): extending the ladder moves the fitted F further from, not toward, a direct value.',
  },
  {
    id: 'imp96792-honesty-gate-no-qed',
    holds: () =>
      IMP96792_VERDICT.narrowsGap === false &&
      IMP96792_VERDICT.anyBoundMoved === false &&
      IMP96792_VERDICT.postsRigorousCeiling === false &&
      IMP96792_VERDICT.fitResidualWidensWithN === true &&
      IMP96792_VERDICT.fittedFdriftsUp === true &&
      /NO QED/.test(IMP96792_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96792_HONEST_BANNER) &&
      /RH open/.test(IMP96792_HONEST_BANNER) &&
      /not-directly-evaluable/.test(IMP96792_SUBGAP.id),
    why: 'measurement only: the gap does not narrow, no rigorous ceiling is posted, no bound moves, and the honesty markers plus the fitted-F-not-directly-evaluable sub-gap are present.',
  },
];

for (const a of IMP96792_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96792-route-m-frobenius-ladder-direct-vs-fit-gap assertion failed: ${a.id}`,
    );
  }
}

export default {
  eps: IMP96792_EPS,
  lamMin: IMP96792_LAMMIN,
  logLinearNorm: IMP96792_LOGLINEAR_NORM,
  exactRows: IMP96792_EXACT_ROWS,
  reachN: IMP96792_REACH_N,
  ceilingScale: IMP96792_CEILING_SCALE,
  fitVsDirect: IMP96792_FIT_VS_DIRECT,
  fDrift: IMP96792_F_DRIFT,
  verdict: IMP96792_VERDICT,
  subGap: IMP96792_SUBGAP,
  banner: IMP96792_HONEST_BANNER,
};
