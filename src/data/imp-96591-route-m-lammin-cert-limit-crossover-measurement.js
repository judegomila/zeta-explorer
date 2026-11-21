/**
 * @module imp-96591-route-m-lammin-cert-limit-crossover-measurement
 *
 * imp-96591 (numerical, MEASUREMENT ONLY): directly plot/measure the double-precision
 * verified-Cholesky rounding shift delta(N) = g_{n+1} I(1,1) H_N against the imp-96428
 * lam_min power-law extrapolation lam_min(N) ~ A N^-p across a ladder of N, to LOCATE
 * their crossover independently and confirm (or correct) the imp-96563 double-precision
 * certification limit N ~ 1.08e5 (IMP96563_CERT_LIMIT_N).
 *
 * CONTEXT. imp-96563 FINDING 3(b) established that a floating-point Cholesky of
 * G_N - s I that runs to completion certifies lam_min(G_N) >= s rigorously
 * (Higham/Rump backward error), with rounding shift
 *
 *     delta(N) = g_{n+1} I(1,1) H_N,   g_{n+1} = (n+1)u / (1 - (n+1)u),  u = eps/2,
 *
 * and H_N ~ log N + gamma. Certifying lam_min > 0 needs s = lam_min - delta(N) > 0,
 * i.e. delta(N) < lam_min(N). Because delta(N) grows like n u log n while
 * lam_min ~ A N^-p decays, the certifiable window closes at the crossover
 * delta(N) = lam_min(N). imp-96563 solved that crossover by internal bisection and
 * recorded N ~ 1.08e5 (IMP96563_CERT_LIMIT_N.doublePrecisionCertLimitN). That crossover
 * was never independently plotted as a ladder; this module tabulates delta(N),
 * lam_min(N) and their ratio across a decade-spanning grid so the sign change of
 * (delta - lam_min) is visible, brackets the crossover, and reconfirms the figure
 * from the ladder alone.
 *
 * MEASUREMENT ONLY. Reuses the imp-96428 fit (A, p) and the imp-96563 rounding-shift
 * formula verbatim; no Gram is rebuilt, no eigenvalue re-measured, no bound moved, no
 * operator positivity established, no RH claim. NO QED.
 *
 * -------------------------------------------------------------------------------
 * RESULT -- the ladder brackets the crossover in (1.00e5, 1.08e5) and the direct
 * bisection lands at N ~ 1.0757e5, matching the imp-96563 recorded ~1.08e5.
 * -------------------------------------------------------------------------------
 * The ratio delta/lam_min climbs monotonically through the ladder -- 8.0e-4 at N=1e4,
 * 0.10 at N=5e4, 0.80 at N=1.00e5, then crosses 1.0 between N=1.00e5 (cert-ok) and
 * N=1.08e5 (cert-fail), i.e. the certifiable window closes exactly where imp-96563
 * placed it. The bisected crossover N* = 1.075655e5 reproduces IMP96563_CERT_LIMIT_N
 * (recorded ~1.08e5) to the leading two digits. Relative to the reference scales:
 *   - ~10.85x ABOVE the imp-96352 compute ceiling N = 9916 (operative verdict safe:
 *     double-precision certification survives the whole compute-reachable range),
 *   - ~240.8x BELOW the imp-96548 rigorous-lam_max conditioning ceiling N ~ 2.59e7,
 *   - ~382.0x BELOW the imp-96548 measured-fit ceiling N ~ 4.11e7.
 * So the direct ladder CONFIRMS imp-96563 FINDING 3(b): double-precision verified
 * Cholesky expires ~240x short of the conditioning ceiling figure. Certifying lam_min
 * at the ceiling needs the imp-96584 double-double reach (N ~ 2.67e10) or a structural
 * asymptotic lower bound (the imp-96563 limiting-spectrum sub-gap).
 *
 * @see imp-96563-route-m-lammin-rigorous-lower-bound-assessment.js (the crossover this confirms)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min ~ A N^-p fit reused)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (conditioning ceiling scales)
 * @see imp-96584-route-m-lammin-doubledouble-cert-reach.js (extended-precision reach past the crossover)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (compute ceiling 9916)
 *
 * Ticket: imp-96591 (numerical, opus-4-8, api-pool). Measurement only; NO QED.
 */

// Inputs reused verbatim from the record (imp-96428 fit + imp-96563 rounding shift + ceilings).
export const IMP96591_INPUTS = Object.freeze({
  u: 1.1102230246251565e-16, // double-precision unit roundoff eps/2
  i11: 1.2606614015078126, // Gram diagonal numerator I(1,1); trace(G_N) = I(1,1) H_N
  gamma: 0.5772156649015329, // Euler-Mascheroni; H_N ~ log N + gamma
  lamMinA: 0.8186721, // imp-96428 fit lam_min ~ A N^-p
  lamMinP: 1.917927,
  computeCeilingN: 9916, // imp-96352 wall-clock reach ceiling
  rigorousLamMaxCeilingN: 25900000, // imp-96548 rigorous-lam_max lower ceiling (~2.59e7)
  measuredCeilingN: 41088904.757400334, // imp-96548 measured-fit ceiling (~4.11e7)
  recordedCertLimitN: 108000, // imp-96563 IMP96563_CERT_LIMIT_N recorded ~1.08e5
});

// H_N ~ log N + gamma; trace(G_N) = I(1,1) H_N.
function traceBound(N) {
  return IMP96591_INPUTS.i11 * (Math.log(N) + IMP96591_INPUTS.gamma);
}
// Higham/Rump verified-Cholesky rounding shift delta(N) = g_{n+1} trace(G_N).
function choleskyRoundingShift(N) {
  const x = (N + 1) * IMP96591_INPUTS.u;
  const g = x / (1 - x);
  return g * traceBound(N);
}
// imp-96428 lam_min power-law extrapolation.
function lamMinFit(N) {
  return IMP96591_INPUTS.lamMinA * Math.pow(N, -IMP96591_INPUTS.lamMinP);
}

// The direct measurement ladder: delta(N) vs lam_min(N) across a decade-spanning grid.
// certifiable === true wherever delta < lam_min (verified Cholesky can certify lam_min > 0).
export const IMP96591_CROSSOVER_LADDER = Object.freeze(
  [1e4, 3e4, 5e4, 7e4, 9e4, 1.0e5, 1.08e5, 1.2e5, 1.5e5, 2e5, 5e5, 1e6, 25900000].map(
    (N) => {
      const delta = choleskyRoundingShift(N);
      const lamMin = lamMinFit(N);
      return Object.freeze({
        N,
        delta,
        lamMinFit: lamMin,
        deltaOverLamMin: delta / lamMin,
        certifiable: delta < lamMin,
      });
    },
  ),
);

// Direct bisection of delta(N) = lam_min(N) -- the measured crossover from the ladder alone.
function solveCrossover() {
  let lo = 1e4;
  let hi = 1e7;
  for (let i = 0; i < 200; i += 1) {
    const N = Math.sqrt(lo * hi);
    if (choleskyRoundingShift(N) > lamMinFit(N)) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}

const measuredCrossoverN = solveCrossover();

export const IMP96591_MEASURED_CROSSOVER = Object.freeze({
  measuredCrossoverN, // ~1.0757e5 from the direct scan
  recordedCertLimitN: IMP96591_INPUTS.recordedCertLimitN, // imp-96563 ~1.08e5
  relDiffVsRecorded:
    Math.abs(measuredCrossoverN - IMP96591_INPUTS.recordedCertLimitN) /
    IMP96591_INPUTS.recordedCertLimitN, // < 0.5%
  // brackets from the ladder: last cert-ok rung and first cert-fail rung
  lastCertOkN: 1.0e5,
  firstCertFailN: 1.08e5,
  factorAboveComputeCeiling:
    measuredCrossoverN / IMP96591_INPUTS.computeCeilingN, // ~10.85x
  factorBelowRigorousCeiling:
    IMP96591_INPUTS.rigorousLamMaxCeilingN / measuredCrossoverN, // ~240.8x
  factorBelowMeasuredCeiling:
    IMP96591_INPUTS.measuredCeilingN / measuredCrossoverN, // ~382.0x
  note:
    'delta(N)/lam_min(N) crosses 1.0 between the N=1.00e5 rung (cert-ok, ratio 0.80) and ' +
    'the N=1.08e5 rung (cert-fail, ratio 1.01); direct bisection lands at N ~ 1.0757e5, ' +
    'reproducing the imp-96563 recorded ~1.08e5 to the leading two digits. The double-precision ' +
    'certification limit sits ~10.85x above the compute ceiling 9916 but ~240.8x below the ' +
    'conditioning ceiling ~2.59e7 -- exactly the imp-96563 FINDING-3(b) gap.',
});

export const IMP96591_VERDICT = Object.freeze({
  question:
    'does a direct delta(N)-vs-lam_min(N) ladder confirm the imp-96563 double-precision ' +
    'verified-Cholesky certification limit N ~ 1.08e5 and its ~240x gap below the ' +
    'conditioning ceiling ~2.59e7?',
  crossoverConfirmed: true,
  measuredCrossoverN,
  matchesRecorded: IMP96591_MEASURED_CROSSOVER.relDiffVsRecorded < 5e-3,
  gapBelowConditioningCeilingConfirmed:
    IMP96591_MEASURED_CROSSOVER.factorBelowRigorousCeiling > 200 &&
    IMP96591_MEASURED_CROSSOVER.factorBelowRigorousCeiling < 280,
  anyBoundMoved: false,
  conclusion:
    'CONFIRMED. The direct ladder brackets delta = lam_min in (1.00e5, 1.08e5) and the ' +
    'independent bisection lands at N ~ 1.0757e5, matching the imp-96563 recorded ~1.08e5 ' +
    '(rel diff < 0.5%). The double-precision certification limit is ~10.85x above the ' +
    'compute ceiling 9916 (operative verdict safe) and ~240.8x below the rigorous-lam_max ' +
    'conditioning ceiling ~2.59e7 (382x below the measured-fit ceiling ~4.11e7) -- the ' +
    'imp-96563 FINDING-3(b) gap reproduced from the ladder alone. Measurement only: reuses the ' +
    'imp-96428 fit and imp-96563 rounding-shift formula verbatim; no Gram rebuilt, no bound ' +
    'moved, no operator positivity, no refereed bound is changed, RH open. NO QED.',
});

export const IMP96591_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the delta(N)-vs-lam_min(N) ' +
  'ladder and its bisected crossover are pure re-analysis of the imp-96428 power-law fit and the ' +
  'imp-96563 Higham/Rump rounding-shift formula. No Gram was rebuilt, no eigenvalue re-measured, ' +
  'no bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96591_ASSERTIONS = [
  {
    id: 'imp96591-ladder-brackets-crossover',
    holds: () => {
      const okAt1e5 = IMP96591_CROSSOVER_LADDER.find((r) => r.N === 1.0e5);
      const failAt108 = IMP96591_CROSSOVER_LADDER.find((r) => r.N === 1.08e5);
      return (
        okAt1e5.certifiable === true &&
        okAt1e5.deltaOverLamMin < 1 &&
        failAt108.certifiable === false &&
        failAt108.deltaOverLamMin > 1
      );
    },
    why: 'the delta/lam_min ratio crosses 1.0 between the N=1.00e5 rung (cert-ok) and the N=1.08e5 rung (cert-fail), bracketing the certification limit exactly where imp-96563 placed it.',
  },
  {
    id: 'imp96591-ratio-monotone-and-tiny-at-1e4',
    holds: () => {
      const at1e4 = IMP96591_CROSSOVER_LADDER.find((r) => r.N === 1e4);
      const ratios = IMP96591_CROSSOVER_LADDER.map((r) => r.deltaOverLamMin);
      let monotone = true;
      for (let i = 1; i < ratios.length; i += 1) {
        if (ratios[i] <= ratios[i - 1]) monotone = false;
      }
      return at1e4.deltaOverLamMin < 1e-3 && monotone;
    },
    why: 'delta/lam_min is < 1e-3 at N=1e4 (the tiny shift certified through the compute range) and rises monotonically across the ladder as delta ~ n u log n overtakes lam_min ~ A N^-p.',
  },
  {
    id: 'imp96591-bisection-matches-imp96563',
    holds: () =>
      IMP96591_MEASURED_CROSSOVER.measuredCrossoverN > 1.0e5 &&
      IMP96591_MEASURED_CROSSOVER.measuredCrossoverN < 1.1e5 &&
      IMP96591_MEASURED_CROSSOVER.relDiffVsRecorded < 5e-3,
    why: 'the direct bisection lands at N ~ 1.0757e5, reproducing the imp-96563 recorded double-precision certification limit ~1.08e5 to better than 0.5%.',
  },
  {
    id: 'imp96591-ceiling-gap-confirmed',
    holds: () =>
      IMP96591_MEASURED_CROSSOVER.factorAboveComputeCeiling > 10 &&
      IMP96591_MEASURED_CROSSOVER.factorAboveComputeCeiling < 12 &&
      IMP96591_MEASURED_CROSSOVER.factorBelowRigorousCeiling > 235 &&
      IMP96591_MEASURED_CROSSOVER.factorBelowRigorousCeiling < 245,
    why: 'the crossover sits ~10.85x above the compute ceiling 9916 (operative verdict safe) and ~240.8x below the conditioning ceiling ~2.59e7 -- the imp-96563 FINDING-3(b) gap.',
  },
  {
    id: 'imp96591-honesty-gate-no-qed',
    holds: () =>
      IMP96591_VERDICT.anyBoundMoved === false &&
      IMP96591_VERDICT.crossoverConfirmed === true &&
      /NO QED/.test(IMP96591_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96591_HONEST_BANNER) &&
      /RH open/.test(IMP96591_HONEST_BANNER),
    why: 'measurement only: no bound moved, the crossover confirmation is recorded, and the honesty markers are present.',
  },
];

for (const a of IMP96591_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96591-route-m-lammin-cert-limit-crossover-measurement assertion failed: ${a.id}`,
    );
  }
}

export default {
  inputs: IMP96591_INPUTS,
  crossoverLadder: IMP96591_CROSSOVER_LADDER,
  measuredCrossover: IMP96591_MEASURED_CROSSOVER,
  verdict: IMP96591_VERDICT,
  banner: IMP96591_HONEST_BANNER,
};
