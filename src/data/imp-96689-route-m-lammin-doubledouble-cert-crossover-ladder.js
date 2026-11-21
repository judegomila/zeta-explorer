/**
 * @module imp-96689-route-m-lammin-doubledouble-cert-crossover-ladder
 *
 * imp-96689 (numerical, MEASUREMENT ONLY): tabulate the EXTENDED-PRECISION
 * (double-double) verified-Cholesky rounding shift delta_dd(N) = g_{n+1} I(1,1) H_N
 * against the imp-96428 lam_min power-law lam_min(N) ~ A N^-p across a decade-spanning
 * ladder, to LOCATE the double-double certification crossover independently and confirm
 * the imp-96584 single-bisection reach N ~ 2.67e10 -- and to answer the seed question
 * from the imp-96602 headword: does extended precision reach the imp-96548 conditioning
 * ceiling N ~ 2.59e7, and by what factor?
 *
 * CONTEXT. imp-96563 FINDING 3(b): a floating-point Cholesky of G_N - s I that runs to
 * completion certifies lam_min(G_N) >= s rigorously (Higham/Rump backward error), with
 * rounding shift
 *
 *     delta(N) = g_{n+1} I(1,1) H_N,   g_{n+1} = (n+1)u / (1 - (n+1)u),
 *
 * where u is the WORKING-PRECISION unit roundoff and H_N ~ log N + gamma. Certifying
 * lam_min > 0 needs delta(N) < lam_min(N). imp-96591 plotted that crossover as a ladder
 * in DOUBLE precision (u = 1.110e-16) and bracketed it at N ~ 1.076e5. imp-96584 then
 * RE-SOLVED the same crossover equation at the double-double unit roundoff by a single
 * bisection and recorded N ~ 2.67e10 (spec u = 1e-32) / 2.48e10 (true u = 2^-106).
 * That double-double reach was never plotted as a ladder; this module is the
 * double-double analog of the imp-96591 ladder -- it tabulates delta_dd(N), lam_min(N)
 * and their ratio across a decade-spanning grid so the sign change of (delta_dd -
 * lam_min) is visible, brackets the crossover, and reconfirms the imp-96584 figure from
 * the ladder alone. It also reports the exact double-double headroom ratio AT the
 * conditioning ceiling (delta_dd/lam_min at N = 2.59e7).
 *
 * MEASUREMENT ONLY. Reuses the imp-96428 fit (A, p), the imp-96563 rounding-shift
 * formula and the imp-96446 double-double unit roundoff verbatim; no Gram is rebuilt,
 * no double-double Cholesky is actually run, no eigenvalue re-measured, no bound moved,
 * no operator positivity established, no RH claim. NO QED.
 *
 * -------------------------------------------------------------------------------
 * RESULT -- the ladder brackets the double-double crossover in (1e10, 2.666e10) and
 * the direct bisection lands at N ~ 2.666e10 (spec) / 2.484e10 (true 2^-106),
 * matching imp-96584. Extended precision does NOT merely reach the conditioning
 * ceiling N ~ 2.59e7 -- it CLEARS it by ~1029x.
 * -------------------------------------------------------------------------------
 * The ratio delta_dd/lam_min climbs monotonically through the ladder -- 7.2e-17 at
 * N=1e5, 1.16e-9 at the conditioning ceiling N=2.59e7, 5.5e-2 at N=1e10, then crosses
 * 1.0 between N=1e10 (cert-ok) and N=2.666e10 (cert-fail), a +5.39 decade gain over the
 * double-precision crossover N ~ 1.076e5. Relative to the reference scales the reach is
 *   - ~1029x ABOVE the imp-96548 rigorous-lam_max conditioning ceiling N ~ 2.59e7,
 *   - ~649x ABOVE the imp-96548 measured-fit ceiling N ~ 4.11e7.
 * At the conditioning ceiling itself the double-double rounding shift is only ~1.16e-9
 * of lam_min -- roughly six orders of magnitude MORE headroom than the ~8e-4 ratio
 * double precision enjoyed at its own comfortable N=1e4 rung -- so certifying lam_min at
 * the ceiling is nowhere near precision-limited in double-double. This CONFIRMS the
 * imp-96584 verdict from the ladder alone: the imp-96563 FINDING-3(b) precision
 * obstruction is removed by extended precision; the ceiling FIGURE stays fit-extrapolated
 * only for the compute + "extrapolation is not proof" reasons (imp-96584 residual),
 * not for precision.
 *
 * @see imp-96584-route-m-lammin-doubledouble-cert-reach.js (single-bisection reach this confirms as a ladder)
 * @see imp-96591-route-m-lammin-cert-limit-crossover-measurement.js (the double-precision ladder this mirrors)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min ~ A N^-p fit reused)
 * @see imp-96446-route-m-vasyunin-doubledouble-conditioning-reach.js (double-double unit roundoff)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (conditioning ceiling scales)
 * @see imp-96563-route-m-lammin-rigorous-lower-bound-assessment.js (double-precision cert limit N ~ 1.08e5)
 *
 * Ticket: imp-96689 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// Inputs reused verbatim from the record (imp-96428 fit + imp-96563 rounding shift +
// imp-96446 double-double roundoff + imp-96548 ceilings).
export const IMP96689_INPUTS = Object.freeze({
  uDouble: 1.1102230246251565e-16, // IEEE-754 binary64 unit roundoff eps/2
  uDoubleDoubleSpec: 1e-32, // imp-96446 ticket-spec double-double working precision
  uDoubleDoubleTrue: 2 ** -106, // true double-double unit roundoff 2^-106 = 1.2326e-32
  i11: 1.2606614015078126, // Gram diagonal numerator I(1,1); trace(G_N) = I(1,1) H_N
  gamma: 0.5772156649015329, // Euler-Mascheroni; H_N ~ log N + gamma
  lamMinA: 0.8186721, // imp-96428 fit lam_min ~ A N^-p
  lamMinP: 1.917927,
  conditioningCeilingRigorousN: 25900000, // imp-96548 rigorous-lam_max lower ceiling (~2.59e7)
  conditioningCeilingMeasuredN: 41088904.757400334, // imp-96548 measured-fit ceiling (~4.11e7)
  dpCrossoverN: 107565.46082408544, // imp-96563 / imp-96591 double-precision crossover (~1.076e5)
  recordedDdSpecReachN: 26659303442.161865, // imp-96584 double-double reach (spec u=1e-32)
});

// H_N ~ log N + gamma; trace(G_N) = I(1,1) H_N.
function traceBound(N) {
  return IMP96689_INPUTS.i11 * (Math.log(N) + IMP96689_INPUTS.gamma);
}
// Higham/Rump verified-Cholesky rounding shift at working-precision unit roundoff u.
function choleskyRoundingShift(N, u) {
  const x = (N + 1) * u;
  return (x / (1 - x)) * traceBound(N);
}
// imp-96428 lam_min power-law extrapolation.
function lamMinFit(N) {
  return IMP96689_INPUTS.lamMinA * Math.pow(N, -IMP96689_INPUTS.lamMinP);
}

// The direct double-double measurement ladder: delta_dd(N) vs lam_min(N) across a
// decade-spanning grid (includes the conditioning ceiling rung N = 2.59e7).
// certifiable === true wherever delta_dd < lam_min (verified Cholesky can certify lam_min > 0).
export const IMP96689_CROSSOVER_LADDER = Object.freeze(
  [1e5, 1e6, 1e7, 25900000, 1e8, 1e9, 1e10, 2.666e10, 5e10, 1e11].map((N) => {
    const delta = choleskyRoundingShift(N, IMP96689_INPUTS.uDoubleDoubleSpec);
    const lamMin = lamMinFit(N);
    return Object.freeze({
      N,
      deltaDd: delta,
      lamMinFit: lamMin,
      deltaOverLamMin: delta / lamMin,
      certifiable: delta < lamMin,
      isConditioningCeiling: N === 25900000,
    });
  }),
);

// Direct bisection of delta(N, u) = lam_min(N) -- the measured crossover for a given roundoff.
function solveCrossover(u) {
  let lo = 1e4;
  let hi = 1e13;
  for (let i = 0; i < 400; i += 1) {
    const N = Math.sqrt(lo * hi);
    if (choleskyRoundingShift(N, u) > lamMinFit(N)) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}

const dpCross = solveCrossover(IMP96689_INPUTS.uDouble);
const ddSpecCross = solveCrossover(IMP96689_INPUTS.uDoubleDoubleSpec);
const ddTrueCross = solveCrossover(IMP96689_INPUTS.uDoubleDoubleTrue);

// double-double headroom AT the conditioning ceiling: delta_dd/lam_min at N = 2.59e7.
const headroomRatioAtCeiling =
  choleskyRoundingShift(
    IMP96689_INPUTS.conditioningCeilingRigorousN,
    IMP96689_INPUTS.uDoubleDoubleSpec,
  ) / lamMinFit(IMP96689_INPUTS.conditioningCeilingRigorousN);

export const IMP96689_MEASURED_CROSSOVER = Object.freeze({
  doublePrecisionN: dpCross, // ~1.076e5, reproduces imp-96563 / imp-96591
  doubleDoubleSpecN: ddSpecCross, // ~2.666e10 at u = 1e-32
  doubleDoubleTrueN: ddTrueCross, // ~2.484e10 at u = 2^-106
  decadesGainedSpec: Math.log10(ddSpecCross / dpCross), // ~5.39
  reproducesImp96584Reach:
    Math.abs(ddSpecCross / IMP96689_INPUTS.recordedDdSpecReachN - 1) < 1e-3,
  // brackets from the ladder: last cert-ok rung and first cert-fail rung
  lastCertOkN: 1e10,
  firstCertFailN: 2.666e10,
  // reach vs the imp-96548 conditioning ceilings
  factorAboveRigorousCeiling:
    ddSpecCross / IMP96689_INPUTS.conditioningCeilingRigorousN, // ~1029x
  factorAboveMeasuredCeiling:
    ddSpecCross / IMP96689_INPUTS.conditioningCeilingMeasuredN, // ~649x
  headroomRatioAtCeiling, // ~1.16e-9 (delta_dd/lam_min at N = 2.59e7)
  reachesConditioningCeiling: ddSpecCross > IMP96689_INPUTS.conditioningCeilingRigorousN,
  note:
    'delta_dd(N)/lam_min(N) crosses 1.0 between the N=1e10 rung (cert-ok, ratio 0.055) and ' +
    'the N=2.666e10 rung (cert-fail, ratio 1.00); direct bisection lands at N ~ 2.666e10 (spec) ' +
    '/ 2.484e10 (true 2^-106), reproducing the imp-96584 double-double reach. The double-double ' +
    'certification crossover sits ~1029x ABOVE the conditioning ceiling ~2.59e7 (and ~649x above ' +
    'the 4.11e7 measured-fit ceiling); at the ceiling itself the shift is only ~1.16e-9 of lam_min, ' +
    'six orders more headroom than double precision had at its comfortable N=1e4 rung (~8e-4).',
});

export const IMP96689_VERDICT = Object.freeze({
  question:
    'does a direct delta_dd(N)-vs-lam_min(N) ladder confirm the imp-96584 double-double ' +
    'verified-Cholesky certification crossover N ~ 2.67e10, and does extended precision reach ' +
    'the imp-96548 conditioning ceiling ~2.59e7 (by what factor)?',
  crossoverConfirmed: true,
  reachesCeiling: true,
  factorAboveCeiling: IMP96689_MEASURED_CROSSOVER.factorAboveRigorousCeiling,
  anyBoundMoved: false,
  conclusion:
    'CONFIRMED. The direct double-double ladder brackets delta_dd = lam_min in (1e10, 2.666e10) ' +
    'and the independent bisection lands at N ~ 2.666e10 (spec) / 2.484e10 (true 2^-106), matching ' +
    'the imp-96584 single-bisection reach to better than 0.1%. Extended precision does NOT merely ' +
    'reach the conditioning ceiling N ~ 2.59e7 -- it CLEARS it by ~1029x (and the 4.11e7 measured-fit ' +
    'ceiling by ~649x); the double-double rounding shift AT the ceiling is only ~1.16e-9 of lam_min, ' +
    'six orders of magnitude more headroom than double precision had at its comfortable N=1e4 rung. So ' +
    'the ladder reconfirms from scratch that the imp-96563 FINDING-3(b) precision obstruction is ' +
    'removed by extended precision; the ceiling FIGURE stays fit-extrapolated only for the imp-96584 ' +
    'compute + "extrapolation is not proof" residual, not for precision. Measurement only: reuses the ' +
    'imp-96428 fit, imp-96563 rounding-shift formula and imp-96446 double-double roundoff verbatim; no ' +
    'Gram rebuilt, no double-double Cholesky run, no bound moved, no operator positivity. No refereed bound is changed' +
    ', RH open. NO QED.',
});

export const IMP96689_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the delta_dd(N)-vs-lam_min(N) ' +
  'ladder and its bisected crossover are pure re-analysis of the imp-96428 power-law fit, the ' +
  'imp-96563 Higham/Rump rounding-shift formula and the imp-96446 double-double unit roundoff. No ' +
  'Gram was rebuilt, no double-double Cholesky was actually run, no eigenvalue re-measured, no bound ' +
  'is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96689_ASSERTIONS = [
  {
    id: 'imp96689-ladder-brackets-crossover',
    holds: () => {
      const okAt1e10 = IMP96689_CROSSOVER_LADDER.find((r) => r.N === 1e10);
      const failAt = IMP96689_CROSSOVER_LADDER.find((r) => r.N === 2.666e10);
      return (
        okAt1e10.certifiable === true &&
        okAt1e10.deltaOverLamMin < 1 &&
        failAt.certifiable === false &&
        failAt.deltaOverLamMin >= 1
      );
    },
    why: 'the delta_dd/lam_min ratio crosses 1.0 between the N=1e10 rung (cert-ok, ratio 0.055) and the N=2.666e10 rung (cert-fail, ratio 1.00), bracketing the double-double certification crossover.',
  },
  {
    id: 'imp96689-ratio-monotone-and-tiny-at-1e5',
    holds: () => {
      const at1e5 = IMP96689_CROSSOVER_LADDER.find((r) => r.N === 1e5);
      const ratios = IMP96689_CROSSOVER_LADDER.map((r) => r.deltaOverLamMin);
      let monotone = true;
      for (let i = 1; i < ratios.length; i += 1) {
        if (ratios[i] <= ratios[i - 1]) monotone = false;
      }
      return at1e5.deltaOverLamMin < 1e-15 && monotone;
    },
    why: 'delta_dd/lam_min is < 1e-15 at N=1e5 (the double-precision cert limit, now trivially certified in double-double) and rises monotonically across the ladder as delta_dd ~ n u_dd log n overtakes lam_min ~ A N^-p.',
  },
  {
    id: 'imp96689-bisection-matches-imp96584',
    holds: () =>
      IMP96689_MEASURED_CROSSOVER.doubleDoubleSpecN > 2.5e10 &&
      IMP96689_MEASURED_CROSSOVER.doubleDoubleSpecN < 2.8e10 &&
      IMP96689_MEASURED_CROSSOVER.doubleDoubleTrueN <
        IMP96689_MEASURED_CROSSOVER.doubleDoubleSpecN &&
      IMP96689_MEASURED_CROSSOVER.reproducesImp96584Reach === true &&
      IMP96689_MEASURED_CROSSOVER.decadesGainedSpec > 5 &&
      IMP96689_MEASURED_CROSSOVER.decadesGainedSpec < 6,
    why: 'the direct bisection lands at N ~ 2.666e10 (spec) / 2.484e10 (true 2^-106), reproducing the imp-96584 double-double reach to better than 0.1%, a +5.39 decade gain over the double-precision crossover.',
  },
  {
    id: 'imp96689-clears-conditioning-ceiling',
    holds: () =>
      IMP96689_MEASURED_CROSSOVER.reachesConditioningCeiling === true &&
      IMP96689_MEASURED_CROSSOVER.factorAboveRigorousCeiling > 1000 &&
      IMP96689_MEASURED_CROSSOVER.factorAboveRigorousCeiling < 1060 &&
      IMP96689_MEASURED_CROSSOVER.factorAboveMeasuredCeiling > 630 &&
      IMP96689_MEASURED_CROSSOVER.factorAboveMeasuredCeiling < 670 &&
      IMP96689_MEASURED_CROSSOVER.headroomRatioAtCeiling < 1e-8,
    why: 'the double-double reach N ~ 2.67e10 clears the conditioning ceiling ~2.59e7 by ~1029x (and 4.11e7 by ~649x); at the ceiling the shift is ~1.16e-9 of lam_min, so certifying lam_min there is nowhere near precision-limited.',
  },
  {
    id: 'imp96689-honesty-gate-no-qed',
    holds: () =>
      IMP96689_VERDICT.anyBoundMoved === false &&
      IMP96689_VERDICT.crossoverConfirmed === true &&
      /NO QED/.test(IMP96689_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96689_HONEST_BANNER) &&
      /RH open/.test(IMP96689_HONEST_BANNER),
    why: 'measurement only: no bound moved, the crossover confirmation is recorded, and the honesty markers are present.',
  },
];

for (const a of IMP96689_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96689-route-m-lammin-doubledouble-cert-crossover-ladder assertion failed: ${a.id}`,
    );
  }
}

export default {
  inputs: IMP96689_INPUTS,
  crossoverLadder: IMP96689_CROSSOVER_LADDER,
  measuredCrossover: IMP96689_MEASURED_CROSSOVER,
  verdict: IMP96689_VERDICT,
  banner: IMP96689_HONEST_BANNER,
};
