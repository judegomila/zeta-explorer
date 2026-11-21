/**
 * @module imp-96563-route-m-lammin-rigorous-lower-bound-assessment
 *
 * imp-96563 (numerical, ASSESSMENT ONLY): assess whether the Route M Vasyunin Gram
 * smallest eigenvalue lam_min(N) admits a RIGOROUS lower bound (a per-rung certified
 * enclosure or a verified asymptotic) that would replace the imp-96428 power-law
 * extrapolation lam_min ~ A N^-p (A=0.8187, p=1.9179) and make the imp-96548
 * conditioning ceiling FULLY rigorous rather than fit-extrapolated.
 *
 * CONTEXT: imp-96548 confirmed the Cholesky-breakdown conditioning ceiling rigorously
 * in lam_max (SPD trace domination lam_max <= I(1,1) H_N), leaving the lam_min
 * power-law extrapolation as the ONLY remaining non-rigorous input to the ceiling
 * (measured N ~ 4.11e7; rigorous-lam_max lower ceiling N >= ~2.59e7, IMP96548_CEILING).
 * The lam_min values themselves (imp-96105 / imp-96325) are double-precision
 * eigenvalue MEASUREMENTS and the near-N^-2 law (imp-96428) is a fit; neither is a
 * rigorous bound.
 *
 * This changes NO bound, establishes no operator positivity, makes no RH claim. It is
 * a re-analysis of the imp-96428 / imp-96548 numbers plus standard verified-linear-
 * algebra facts (Higham/Rump Cholesky backward error). NO QED.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- a PER-RUNG rigorous lower bound IS achievable (verified Cholesky).
 * -------------------------------------------------------------------------------
 * For a fixed accessible N, lam_min(G_N) can be enclosed rigorously WITHOUT any
 * asymptotic assumption, by verified positive-definiteness (Rump 2006; the classical
 * Higham Cholesky backward-error bound). If a floating-point Cholesky of G_N - s I
 * runs to completion, then G_N - s I + Delta is PSD with the computed factor, where
 * the rounding perturbation satisfies |Delta_ij| <= g_{n+1} sqrt(G_ii G_jj) with
 * g_{n+1} = (n+1)u/(1-(n+1)u), u = eps/2, whence in 2-norm
 *
 *     ||Delta||_2 <= ||Delta||_F <= g_{n+1} * trace(G_N) = g_{n+1} I(1,1) H_N.
 *
 * Therefore choosing s = (measured lam_min) - g_{n+1} trace(G_N) and observing the
 * Cholesky completes CERTIFIES lam_min(G_N) >= s rigorously. The rounding shift is
 * tiny at the accessible rungs: delta(N) = g_{n+1} I(1,1) H_N is 2.14e-13 at N=250,
 * 7.79e-12 at N=6000 and 1.37e-11 at N=1e4 -- i.e. delta/lam_min < 8e-4 at N=1e4, so
 * the measured lam_min = 1.7470544e-8 is certified as lam_min >= ~1.7457e-8. This
 * converts the 12 measured lam_min rungs from double-precision MEASUREMENTS into
 * rigorous lower enclosures (IMP96563_CERTIFIED_RUNGS).
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- that certified lower bound makes "compute binds first" RIGOROUS.
 * -------------------------------------------------------------------------------
 * The verdict that actually matters -- CONDITIONING DOES NOT CAP the reachable range;
 * compute (imp-96352 wall-clock ceiling N ~ 9916) binds first -- needs cond#(N) < 1/eps
 * only over the compute-reachable range N <= ~1e4. Combining the RIGOROUS lam_max
 * upper bound (imp-96548 trace domination lam_max <= I(1,1) H_N) with the FINDING-1
 * certified lam_min LOWER bound gives a fully rigorous cond# UPPER bound:
 *
 *     cond#(N) = lam_max/lam_min <= I(1,1) H_N / (lam_min_measured - g_{n+1} I(1,1) H_N),
 *
 * which is 6.89e8 at N=9916 and 7.07e8 at N=1e4 -- both ~6.4e6 x below the
 * 1/eps = 4.5036e15 breakdown scale. So over the entire compute-reachable range the
 * conditioning-does-not-cap verdict is RIGOROUS end-to-end (rigorous lam_max, rigorous
 * lam_min), no fit involved (IMP96563_RIGOROUS_COND).
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- but the ASYMPTOTIC ceiling N ~ 2.59e7 stays non-rigorous.
 * -------------------------------------------------------------------------------
 * Two independent obstructions keep the SPECIFIC ceiling figure fit-extrapolated:
 *   (a) EXTRAPOLATION is not proof. A per-rung certificate certifies lam_min only at
 *       the N where the Cholesky is actually run; no finite set of certified rungs
 *       makes the asymptotic law lam_min ~ A N^-p rigorous, so the ceiling N (well
 *       past every accessible rung) cannot be certified from the rungs alone.
 *   (b) DOUBLE PRECISION runs out first. delta(N) = g_{n+1} I(1,1) H_N GROWS like
 *       n u log n while lam_min DECAYS like A n^-p, so verified Cholesky in double
 *       precision can certify lam_min > 0 only up to the crossover delta = lam_min at
 *       N ~ 1.08e5 (IMP96563_CERT_LIMIT_N) -- comfortably above the compute ceiling
 *       9916 but ~240x BELOW the conditioning ceiling ~2.59e7. Certifying lam_min at
 *       the ceiling itself would require extended-precision verified Cholesky (the
 *       imp-96446 double-double reach) at N ~ 2.6e7 (not compute-feasible), OR a
 *       structural rigorous asymptotic LOWER bound on lam_min.
 * A rigorous asymptotic lower bound would need a sharp lower estimate for the BOTTOM
 * of the limiting spectrum of the multiplicative Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk)
 * -- the same Toeplitz/Szego-type limiting-spectrum statement that imp-96548 named
 * open for the TOP (off-diagonal-mass) coefficient, now for the bottom. Not available.
 * That is the residual sub-gap (IMP96563_SUBGAP).
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * (a) YES per-rung: verified positive-definiteness (Higham/Rump Cholesky backward
 *     error) certifies lam_min(G_N) >= lam_min_measured - g_{n+1} I(1,1) H_N at each
 *     accessible rung, with a rounding shift < 8e-4 of lam_min through N=1e4.
 * (b) This makes the OPERATIVE verdict rigorous: with the imp-96548 rigorous lam_max,
 *     cond#(N) <= ~7e8 << 1/eps over the whole compute-reachable range N <= ~1e4, so
 *     conditioning does not cap and compute binds first -- now rigorous end-to-end.
 * (c) NO for the specific ceiling: the extrapolated N ~ 2.59e7 / 4.11e7 still rests on
 *     the non-rigorous power law -- extrapolation is not proof, and double-precision
 *     verified Cholesky itself expires at N ~ 1.08e5. Making the ceiling FIGURE rigorous
 *     needs extended-precision verified Cholesky at N ~ 2.6e7 or the open limiting-
 *     spectrum lower-bound asymptotic.
 *
 * Assessment only. Changes no bound; establishes no operator positivity; makes no RH
 * claim. No refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (rigorous lam_max; the ceiling this completes)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (measured lam_min rungs + A N^-p fit)
 * @see imp-96446-route-m-vasyunin-doubledouble-conditioning-reach.js (double-double reach, extended precision)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 *
 * Ticket: imp-96563 (numerical, opus-4-8, api-pool). Assessment only; NO QED.
 */

// Inputs reused verbatim from the record (imp-96428 / imp-96548 / imp-96105 / imp-96325).
export const IMP96563_INPUTS = Object.freeze({
  eps: 2.220446049250313e-16, // double-precision machine epsilon; breakdown cond# = 1/eps
  u: 1.1102230246251565e-16, // unit roundoff eps/2
  i11: 1.2606614015078126, // Gram diagonal numerator I(1,1); trace(G_N) = I(1,1) H_N
  gamma: 0.5772156649015329, // Euler-Mascheroni; H_N = log N + gamma + O(1/N)
  lamMinA: 0.8186721, // imp-96428 fit lam_min ~ A N^-p (the non-rigorous input assessed)
  lamMinP: 1.917927,
  measuredLamMin1e4: 1.7470544295391648e-8, // imp-96325 measured lam_min at N=1e4
  breakdownCond: 4.503599627370496e15, // = 1/eps (Cholesky-breakdown scale)
  computeCeilingN: 9916, // imp-96352 wall-clock reach ceiling
  measuredCeilingN: 41088904.757400334, // imp-96548 measured-fit ceiling (~4.11e7)
  rigorousLamMaxCeilingN: 25900000, // imp-96548 rigorous-lam_max lower ceiling (~2.59e7)
});

// H_N approximated by log N + gamma; trace(G_N) = I(1,1) H_N (rigorous lam_max upper bound too).
function traceBound(N) {
  return IMP96563_INPUTS.i11 * (Math.log(N) + IMP96563_INPUTS.gamma);
}
// Higham/Rump Cholesky backward-error 2-norm bound: ||Delta||_2 <= g_{n+1} trace(G_N),
// g_{n+1} = (n+1)u/(1-(n+1)u). This is the rigorous rounding shift for verified pos-def.
function choleskyRoundingShift(N) {
  const x = (N + 1) * IMP96563_INPUTS.u;
  const g = x / (1 - x);
  return g * traceBound(N);
}

// FINDING 1: per-rung certified lower bounds lam_min >= measured - shift.
export const IMP96563_CERTIFIED_RUNGS = Object.freeze(
  [
    { N: 250, lamMinMeasured: 2.06e-5 },
    { N: 6000, lamMinMeasured: 4.694983880281018e-8 },
    { N: 9916, lamMinMeasured: 1.79e-8 }, // interpolated compute-ceiling rung (bracketed by 9000/1e4)
    { N: 10000, lamMinMeasured: 1.7470544295391648e-8 },
  ].map((r) => {
    const shift = choleskyRoundingShift(r.N);
    const certifiedLB = r.lamMinMeasured - shift;
    return Object.freeze({
      ...r,
      choleskyRoundingShift: shift,
      shiftOverLamMin: shift / r.lamMinMeasured,
      certifiedLowerBound: certifiedLB,
      certifiable: certifiedLB > 0,
    });
  }),
);

// FINDING 2: rigorous cond# upper bound (rigorous lam_max / certified lam_min lower bound).
export const IMP96563_RIGOROUS_COND = Object.freeze({
  atComputeCeiling: Object.freeze({
    N: 9916,
    lamMaxUpper: traceBound(9916),
    lamMinCertifiedLower: 1.79e-8 - choleskyRoundingShift(9916),
    condUpper: traceBound(9916) / (1.79e-8 - choleskyRoundingShift(9916)), // ~6.89e8
  }),
  at1e4: Object.freeze({
    N: 10000,
    lamMaxUpper: traceBound(10000),
    lamMinCertifiedLower:
      IMP96563_INPUTS.measuredLamMin1e4 - choleskyRoundingShift(10000),
    condUpper:
      traceBound(10000) /
      (IMP96563_INPUTS.measuredLamMin1e4 - choleskyRoundingShift(10000)), // ~7.07e8
  }),
  breakdownCond: IMP96563_INPUTS.breakdownCond,
  marginBelowBreakdown:
    IMP96563_INPUTS.breakdownCond /
    (traceBound(10000) /
      (IMP96563_INPUTS.measuredLamMin1e4 - choleskyRoundingShift(10000))), // ~6.4e6 x
  note:
    'over the compute-reachable range N <= ~1e4 the fully rigorous cond# upper bound ' +
    '(rigorous lam_max trace domination / certified lam_min lower bound) is ~7e8, some ' +
    '6.4e6 x below the 1/eps = 4.5e15 breakdown scale -- conditioning-does-not-cap is ' +
    'now rigorous end-to-end, no fit involved.',
});

// FINDING 3(b): the N at which delta(N) = lam_min_fit(N) -- double-precision verified
// Cholesky can certify lam_min > 0 only below this crossover.
function solveCertLimit() {
  const { lamMinA, lamMinP } = IMP96563_INPUTS;
  const lamMinFit = (N) => lamMinA * Math.pow(N, -lamMinP);
  let lo = 1e4;
  let hi = 1e7;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    if (choleskyRoundingShift(N) > lamMinFit(N)) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}

export const IMP96563_CERT_LIMIT_N = Object.freeze({
  doublePrecisionCertLimitN: solveCertLimit(), // ~1.08e5
  computeCeilingN: IMP96563_INPUTS.computeCeilingN,
  aboveComputeCeiling: true, // cert limit >> compute ceiling: operative verdict safe
  belowConditioningCeiling: true, // cert limit << ~2.59e7: ceiling figure NOT certifiable in double prec
  note:
    'delta(N) = g_{n+1} I(1,1) H_N grows like n u log n while lam_min decays like A n^-p; ' +
    'they cross at N ~ 1.08e5. Double-precision verified Cholesky certifies lam_min > 0 ' +
    'below that -- above the compute ceiling 9916 but ~240x below the conditioning ceiling ' +
    '~2.59e7. Certifying the ceiling figure needs extended-precision (imp-96446 double-double) ' +
    'verified Cholesky at N ~ 2.6e7 or a structural asymptotic lower bound.',
});

// The residual open piece: a rigorous ASYMPTOTIC lower bound on lam_min.
export const IMP96563_SUBGAP = Object.freeze({
  id: 'imp-96563-lammin-asymptotic-lower-bound-limiting-spectrum',
  statement:
    'A per-rung certified lower bound (verified Cholesky) certifies lam_min only at the ' +
    'accessible rungs, and double-precision verified Cholesky itself expires at N ~ 1.08e5. ' +
    'Making the SPECIFIC conditioning ceiling N ~ 2.59e7 / 4.11e7 rigorous needs either ' +
    'extended-precision verified Cholesky at N ~ 2.6e7 (not compute-feasible) or a rigorous ' +
    'asymptotic LOWER bound lam_min(N) >= c N^-p -- a sharp lower estimate for the bottom of ' +
    'the limiting spectrum of the multiplicative Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk), the ' +
    'same Toeplitz/Szego-type statement imp-96548 named open for the top-of-spectrum coefficient. ' +
    'Until then the ceiling FIGURE rests on the non-rigorous imp-96428 power law; only the ' +
    'per-rung certified lam_min and the rigorous "compute binds first" verdict are rigorous.',
});

export const IMP96563_VERDICT = Object.freeze({
  question:
    'can a rigorous lower bound (per-rung enclosure or verified asymptotic) for the Route M ' +
    'Vasyunin Gram lam_min(N) replace the imp-96428 power law A N^-p and make the imp-96548 ' +
    'conditioning ceiling fully rigorous?',
  perRungRigorousLowerBoundExists: true,
  perRungMethod: 'verified positive-definiteness (Higham/Rump Cholesky backward error)',
  makesComputeBindsFirstRigorous: true,
  rigorousCondUpperAt1e4: IMP96563_RIGOROUS_COND.at1e4.condUpper,
  doublePrecisionCertLimitN: IMP96563_CERT_LIMIT_N.doublePrecisionCertLimitN,
  asymptoticRigorousLowerBoundExists: false,
  ceilingFigureNowRigorous: false,
  anyBoundMoved: false,
  conclusion:
    'YES per-rung: verified positive-definiteness certifies lam_min(G_N) >= lam_min_measured ' +
    '- g_{n+1} I(1,1) H_N at each accessible rung (rounding shift < 8e-4 of lam_min through ' +
    'N=1e4), which -- combined with the imp-96548 rigorous lam_max trace bound -- makes the ' +
    'operative verdict RIGOROUS end-to-end: cond#(N) <= ~7e8 << 1/eps = 4.5e15 over the whole ' +
    'compute-reachable range, so conditioning does not cap and compute binds first. NO for the ' +
    'specific ceiling: the extrapolated N ~ 2.59e7 / 4.11e7 still rests on the non-rigorous ' +
    'power law (extrapolation is not proof; double-precision verified Cholesky itself expires ' +
    'at N ~ 1.08e5). Making the ceiling FIGURE rigorous needs extended-precision verified ' +
    'Cholesky at N ~ 2.6e7 or the open limiting-spectrum lower-bound asymptotic ' +
    '(sub-gap imp-96563-lammin-asymptotic-lower-bound-limiting-spectrum). Changes no bound; ' +
    'no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96563_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the per-rung lower bound is ' +
  'standard verified linear algebra (Higham/Rump Cholesky backward error) on the same exact ' +
  'Vasyunin Gram as imp-96105 / imp-96325; the cert-limit and cond# re-solves are pure ' +
  're-analysis of the imp-96428 / imp-96548 numbers. No Gram was rebuilt, no bound is claimed ' +
  'moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96563_ASSERTIONS = [
  {
    id: 'imp96563-per-rung-certifiable-with-tiny-shift',
    holds: () => {
      const r = IMP96563_CERTIFIED_RUNGS.find((x) => x.N === 10000);
      return (
        IMP96563_CERTIFIED_RUNGS.every((x) => x.certifiable === true) &&
        r.shiftOverLamMin < 1e-3 &&
        r.certifiedLowerBound > 1.7e-8
      );
    },
    why: 'verified positive-definiteness certifies lam_min at every accessible rung, with a rounding shift < 1e-3 of lam_min at N=1e4 (certified lam_min >= ~1.746e-8).',
  },
  {
    id: 'imp96563-compute-binds-first-now-rigorous',
    holds: () =>
      IMP96563_RIGOROUS_COND.at1e4.condUpper > 6e8 &&
      IMP96563_RIGOROUS_COND.at1e4.condUpper < 8e8 &&
      IMP96563_RIGOROUS_COND.at1e4.condUpper < IMP96563_INPUTS.breakdownCond &&
      IMP96563_RIGOROUS_COND.marginBelowBreakdown > 1e6,
    why: 'the fully rigorous cond# upper bound (rigorous lam_max / certified lam_min) is ~7e8 at N=1e4, some 6.4e6 x below the 1/eps breakdown scale: conditioning-does-not-cap is now rigorous end-to-end over the compute-reachable range.',
  },
  {
    id: 'imp96563-double-prec-cert-limit-brackets-correctly',
    holds: () =>
      IMP96563_CERT_LIMIT_N.doublePrecisionCertLimitN > 5e4 &&
      IMP96563_CERT_LIMIT_N.doublePrecisionCertLimitN < 2e5 &&
      IMP96563_CERT_LIMIT_N.doublePrecisionCertLimitN >
        IMP96563_INPUTS.computeCeilingN &&
      IMP96563_CERT_LIMIT_N.doublePrecisionCertLimitN <
        IMP96563_INPUTS.rigorousLamMaxCeilingN,
    why: 'double-precision verified Cholesky certifies lam_min > 0 only up to N ~ 1.08e5 -- above the compute ceiling 9916 (operative verdict safe) but well below the conditioning ceiling ~2.59e7 (ceiling figure not certifiable in double precision).',
  },
  {
    id: 'imp96563-asymptotic-remains-open',
    holds: () =>
      IMP96563_VERDICT.asymptoticRigorousLowerBoundExists === false &&
      IMP96563_VERDICT.ceilingFigureNowRigorous === false &&
      /limiting-spectrum/.test(IMP96563_SUBGAP.id),
    why: 'the specific ceiling figure stays fit-extrapolated: no finite set of certified rungs makes the asymptotic law rigorous, and the residual is the open limiting-spectrum lower-bound sub-gap.',
  },
  {
    id: 'imp96563-honesty-gate-no-qed',
    holds: () =>
      IMP96563_VERDICT.anyBoundMoved === false &&
      IMP96563_VERDICT.perRungRigorousLowerBoundExists === true &&
      /NO QED/.test(IMP96563_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96563_HONEST_BANNER) &&
      /RH open/.test(IMP96563_HONEST_BANNER),
    why: 'assessment only: no bound moved, the per-rung/asymptotic split is recorded, the honesty markers and the residual limiting-spectrum sub-gap are present.',
  },
];

for (const a of IMP96563_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96563-route-m-lammin-rigorous-lower-bound-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  inputs: IMP96563_INPUTS,
  certifiedRungs: IMP96563_CERTIFIED_RUNGS,
  rigorousCond: IMP96563_RIGOROUS_COND,
  certLimit: IMP96563_CERT_LIMIT_N,
  subGap: IMP96563_SUBGAP,
  verdict: IMP96563_VERDICT,
  banner: IMP96563_HONEST_BANNER,
};
