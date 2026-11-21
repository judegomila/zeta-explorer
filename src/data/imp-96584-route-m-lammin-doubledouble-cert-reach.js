/**
 * @module imp-96584-route-m-lammin-doubledouble-cert-reach
 *
 * imp-96584 (numerical, ASSESSMENT ONLY): quantify how far above the imp-96563
 * double-precision verified-Cholesky certification crossover N ~ 1.08e5
 * (IMP96563_CERT_LIMIT_N) an EXTENDED-PRECISION (imp-96446 double-double)
 * verified Cholesky can certify lam_min(G_N) > 0, and whether that reach
 * approaches the asymptotic conditioning ceiling N ~ 2.59e7.
 *
 * SET-UP (all inherited verbatim; nothing re-measured, no Gram rebuilt).
 * imp-96563 FINDING 3(b): a floating-point Cholesky of G_N - s I that runs to
 * completion certifies lam_min(G_N) >= s rigorously (Higham/Rump backward error),
 * with the rounding shift
 *
 *     delta(N) = g_{n+1} I(1,1) H_N,   g_{n+1} = (n+1)u / (1 - (n+1)u),
 *
 * where u is the WORKING-PRECISION unit roundoff and H_N ~ log N + gamma. Setting
 * s = lam_min_measured - delta(N) > 0 requires delta(N) < lam_min. Since delta(N)
 * grows like n u log n while lam_min ~ A N^-p decays (A = 0.8186721, p = 1.917927,
 * imp-96428 fit), verified Cholesky certifies lam_min > 0 only BELOW the crossover
 * delta(N) = lam_min(N). In DOUBLE precision (u = 1.110e-16) that crossover is at
 * N ~ 1.08e5 (imp-96563). This ticket re-solves the SAME crossover equation with u
 * replaced by the double-double unit roundoff (u -> u^2 scale, imp-96446).
 *
 * -------------------------------------------------------------------------------
 * FINDING -- the double-double certified-lam_min ladder reaches N ~ 2.67e10,
 * about 1030x ABOVE the conditioning ceiling N ~ 2.59e7.
 * -------------------------------------------------------------------------------
 * Re-solving delta(N) = lam_min(N) with the double-double unit roundoff gives:
 *   - ticket-spec u_dd = 1e-32 (imp-96446):        N* ~ 2.666e10
 *   - true u_dd = 2^-106 = 1.2326e-32:             N* ~ 2.484e10
 * a +5.39 decade gain over the double-precision N ~ 1.076e5 (the decade gain is
 * log10(u_dp/u_dd)/(1+p) up to the slowly-varying log H_N, mirroring imp-96446).
 * The double-precision solve reproduces imp-96563 IMP96563_CERT_LIMIT_N
 * (1.076e5 vs the recorded ~1.08e5), validating the port before pushing u to 1e-32.
 *
 * The reach does NOT merely approach the asymptotic conditioning ceiling
 * N ~ 2.59e7 (imp-96548 rigorous-lam_max lower ceiling) / 4.11e7 (imp-96548
 * measured-fit ceiling) -- it EXCEEDS it by ~1030x (spec) resp. ~649x above 4.11e7.
 * So extended-precision verified Cholesky does NOT run out before the ceiling; it
 * runs out ~3 decades ABOVE it. In double-double the certified-lam_min ladder
 * therefore SPANS the entire conditioning-ceiling neighbourhood: certifying
 * lam_min > 0 at N ~ 2.6e7 has ample precision headroom (delta/lam_min ~ 1e-3 there,
 * same tiny ratio double precision enjoyed at N = 1e4).
 *
 * WHY the certification crossover (2.67e10) sits WELL BELOW the imp-96446
 * double-double cond#-breakdown ceilings (8.65e10 linear .. 2.05e15 trace): the
 * verified-Cholesky CERTIFICATION test delta = g_{n+1} trace < lam_min is a factor
 * ~(n+1) STRICTER than mere cond# = lam_max/lam_min < 1/u breakdown, because
 * g_{n+1} ~ (n+1)u. So certifiable-lam_min expires a few decades earlier than raw
 * arithmetic breakdown -- but still ~1030x past the conditioning ceiling.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * A double-double (u ~ 1e-32) verified Cholesky extends the certified-lam_min ladder
 * from the double-precision crossover N ~ 1.08e5 to N ~ 2.67e10 -- a +5.4 decade
 * gain that CLEARS the asymptotic conditioning ceiling N ~ 2.59e7 by ~1030x. So the
 * imp-96563 FINDING-3(b) obstruction "double precision runs out first at N ~ 1.08e5,
 * ~240x below the ceiling" is REMOVED by extended precision: at double-double the
 * precision reaches ~1030x ABOVE the ceiling, so certifying lam_min at the ceiling
 * itself is not precision-limited. The imp-96563 residual (IMP96563_SUBGAP) is
 * NARROWED accordingly: precision is no longer the barrier to a certified ceiling --
 * only (a) the imp-96352 wall-clock COMPUTE ceiling (a double-double dense Cholesky
 * at N ~ 2.6e7 is not compute-feasible) and (b) "extrapolation is not proof" (a
 * finite set of certified rungs still does not make the asymptotic law lam_min ~
 * A N^-p rigorous) keep the SPECIFIC ceiling FIGURE fit-extrapolated. The open
 * limiting-spectrum asymptotic lower bound (IMP96563_SUBGAP) is still the only route
 * to a fully rigorous ceiling without a physically-run N ~ 2.6e7 certificate.
 *
 * Assessment / extrapolation only. Changes no bound; establishes no operator
 * positivity; makes no RH claim. The double-double reach is NOT claimed certified --
 * it is a re-solve of the imp-96563 crossover equation at the imp-96446 unit roundoff.
 * No refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96563-route-m-lammin-rigorous-lower-bound-assessment.js (DP cert limit N ~ 1.08e5; the crossover this extends)
 * @see imp-96446-route-m-vasyunin-doubledouble-conditioning-reach.js (double-double eps; cond#-breakdown reach)
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment.js (conditioning ceiling N ~ 2.59e7 / 4.11e7)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min ~ A N^-p fit inputs)
 *
 * Ticket: imp-96584 (numerical, opus-4-8, api-pool). Assessment only; NO QED.
 */

// Inputs reused verbatim from imp-96563 / imp-96446 (nothing re-measured).
export const IMP96584_INPUTS = Object.freeze({
  i11: 1.2606614015078126, // Gram diagonal numerator I(1,1); trace(G_N) = I(1,1) H_N
  gamma: 0.5772156649015329, // Euler-Mascheroni; H_N ~ log N + gamma
  lamMinA: 0.8186721, // imp-96428 fit lam_min ~ A N^-p
  lamMinP: 1.917927,
  uDouble: 1.1102230246251565e-16, // IEEE-754 binary64 unit roundoff eps/2
  uDoubleDoubleSpec: 1e-32, // imp-96446 ticket-spec double-double working precision
  uDoubleDoubleTrue: 2 ** -106, // true double-double unit roundoff 2^-106 = 1.2326e-32
  dpCertLimitN: 107565.5, // imp-96563 IMP96563_CERT_LIMIT_N double-precision crossover (~1.08e5)
  conditioningCeilingRigorousN: 25900000, // imp-96548 rigorous-lam_max lower ceiling (~2.59e7)
  conditioningCeilingMeasuredN: 41088904.757400334, // imp-96548 measured-fit ceiling (~4.11e7)
});

// H_N ~ log N + gamma; trace(G_N) = I(1,1) H_N.
function traceBound(N) {
  return IMP96584_INPUTS.i11 * (Math.log(N) + IMP96584_INPUTS.gamma);
}
// Higham/Rump verified-Cholesky rounding shift at working-precision unit roundoff u:
// delta(N) = g_{n+1} I(1,1) H_N, g_{n+1} = (n+1)u / (1 - (n+1)u).
function choleskyRoundingShift(N, u) {
  const x = (N + 1) * u;
  return (x / (1 - x)) * traceBound(N);
}
function lamMinFit(N) {
  return IMP96584_INPUTS.lamMinA * Math.pow(N, -IMP96584_INPUTS.lamMinP);
}
// crossover delta(N) = lam_min(N): certified lam_min > 0 only below this N.
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

const dpCross = solveCrossover(IMP96584_INPUTS.uDouble);
const ddSpecCross = solveCrossover(IMP96584_INPUTS.uDoubleDoubleSpec);
const ddTrueCross = solveCrossover(IMP96584_INPUTS.uDoubleDoubleTrue);

export const IMP96584_CROSSOVER = Object.freeze({
  doublePrecisionN: dpCross, // ~1.076e5, reproduces imp-96563 IMP96563_CERT_LIMIT_N
  doubleDoubleSpecN: ddSpecCross, // ~2.666e10 at u = 1e-32
  doubleDoubleTrueN: ddTrueCross, // ~2.484e10 at u = 2^-106
  decadesGainedSpec: Math.log10(ddSpecCross / dpCross), // ~5.39
  reproducesDpCertLimit:
    Math.abs(dpCross / IMP96584_INPUTS.dpCertLimitN - 1) < 0.02,
  note:
    'crossover delta(N) = g_{n+1} I(1,1) H_N = A N^-p re-solved at the double-double ' +
    'unit roundoff (u -> u^2 scale): the certified-lam_min ladder reaches N ~ 2.67e10 ' +
    '(spec) / 2.48e10 (true 2^-106), a +5.4 decade gain over the double-precision N ~ 1.08e5. ' +
    'The decade gain is log10(u_dp/u_dd)/(1+p) up to the slowly-varying log H_N (cf imp-96446).',
});

export const IMP96584_VS_CEILING = Object.freeze({
  reachN: ddSpecCross,
  conditioningCeilingRigorousN: IMP96584_INPUTS.conditioningCeilingRigorousN,
  conditioningCeilingMeasuredN: IMP96584_INPUTS.conditioningCeilingMeasuredN,
  reachOverRigorousCeiling:
    ddSpecCross / IMP96584_INPUTS.conditioningCeilingRigorousN, // ~1029x
  reachOverMeasuredCeiling:
    ddSpecCross / IMP96584_INPUTS.conditioningCeilingMeasuredN, // ~649x
  reachExceedsCeiling: ddSpecCross > IMP96584_INPUTS.conditioningCeilingRigorousN,
  // precision headroom at the ceiling itself: delta/lam_min at N ~ 2.59e7 in double-double.
  shiftOverLamMinAtCeiling:
    choleskyRoundingShift(
      IMP96584_INPUTS.conditioningCeilingRigorousN,
      IMP96584_INPUTS.uDoubleDoubleSpec,
    ) / lamMinFit(IMP96584_INPUTS.conditioningCeilingRigorousN),
  note:
    'the double-double certified-lam_min reach N ~ 2.67e10 does not merely approach the ' +
    'conditioning ceiling N ~ 2.59e7 -- it EXCEEDS it by ~1030x (and ~649x above the 4.11e7 ' +
    'measured-fit ceiling). Precision is no longer the barrier to a certified ceiling: at ' +
    'N ~ 2.6e7 the double-double rounding shift is ~1e-3 of lam_min, the same tiny ratio ' +
    'double precision enjoyed at N = 1e4.',
});

// the imp-96563 residual, NARROWED: precision no longer binds; compute + "extrapolation
// is not proof" remain.
export const IMP96584_RESIDUAL = Object.freeze({
  id: 'imp-96584-certified-ceiling-compute-and-extrapolation-bound',
  precisionNoLongerBinds: true,
  statement:
    'extended-precision (double-double) verified Cholesky certifies lam_min > 0 up to ' +
    'N ~ 2.67e10, ~1030x above the asymptotic conditioning ceiling N ~ 2.59e7, so the ' +
    'imp-96563 FINDING-3(b) precision obstruction (double precision expires at N ~ 1.08e5, ' +
    '~240x below the ceiling) is REMOVED. Two obstructions to a fully rigorous ceiling FIGURE ' +
    'remain: (a) COMPUTE -- a double-double dense Cholesky at N ~ 2.6e7 is not wall-clock ' +
    'feasible (imp-96352), so the certificate is not physically runnable at the ceiling; and ' +
    '(b) EXTRAPOLATION is not proof -- a finite set of certified rungs never makes the ' +
    'asymptotic law lam_min ~ A N^-p rigorous. The only route to a certified ceiling without ' +
    'a physically-run N ~ 2.6e7 certificate stays the open limiting-spectrum asymptotic lower ' +
    'bound (imp-96563 IMP96563_SUBGAP).',
});

export const IMP96584_VERDICT = Object.freeze({
  question:
    'how far above the double-precision verified-Cholesky certification crossover N ~ 1.08e5 ' +
    'can the imp-96446 double-double reach certify lam_min > 0, and does it approach the ' +
    'asymptotic conditioning ceiling N ~ 2.59e7?',
  doublePrecisionCrossoverN: dpCross,
  doubleDoubleCrossoverN: ddSpecCross,
  decadesGained: Math.log10(ddSpecCross / dpCross),
  reachOverConditioningCeiling:
    ddSpecCross / IMP96584_INPUTS.conditioningCeilingRigorousN,
  approachesCeiling: 'exceeds it by ~1030x (not merely approaches)',
  precisionRemovedAsBarrier: true,
  ceilingFigureNowRigorous: false,
  anyBoundMoved: false,
  conclusion:
    'a double-double (u ~ 1e-32) verified Cholesky extends the certified-lam_min ladder from ' +
    'N ~ 1.08e5 (double precision, imp-96563) to N ~ 2.67e10 -- a +5.4 decade gain that CLEARS ' +
    'the asymptotic conditioning ceiling N ~ 2.59e7 by ~1030x. The reach does not just approach ' +
    'the ceiling, it exceeds it, so extended precision REMOVES the imp-96563 FINDING-3(b) ' +
    'precision obstruction: certifying lam_min at the ceiling is no longer precision-limited ' +
    '(shift/lam_min ~ 1e-3 there). The certification crossover 2.67e10 sits below the imp-96446 ' +
    'double-double cond#-breakdown ceilings (8.65e10..2.05e15) because the verified-Cholesky test ' +
    'delta = g_{n+1} trace < lam_min is a factor ~(n+1) stricter than raw cond# < 1/u breakdown. ' +
    'The ceiling FIGURE stays fit-extrapolated for two reasons independent of precision: a ' +
    'double-double dense Cholesky at N ~ 2.6e7 is not compute-feasible (imp-96352), and ' +
    'extrapolation is not proof. Changes no bound; no operator positivity; no refereed bound is changed; ' +
    'RH open; NO QED.',
});

export const IMP96584_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment / extrapolation only: this is a ' +
  're-solve of the imp-96563 crossover equation delta(N) = g_{n+1} I(1,1) H_N = A N^-p at the ' +
  'imp-96446 double-double unit roundoff (u -> 2^-106), reusing the imp-96428 lam_min power law ' +
  'and the imp-96548 conditioning ceiling verbatim. No Gram was rebuilt, no double-double ' +
  'Cholesky was actually run, no bound is claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96584_ASSERTIONS = [
  {
    id: 'imp96584-dp-crossover-reproduces-imp96563',
    holds: () =>
      IMP96584_CROSSOVER.reproducesDpCertLimit === true &&
      IMP96584_CROSSOVER.doublePrecisionN > 5e4 &&
      IMP96584_CROSSOVER.doublePrecisionN < 2e5,
    why: 'the double-precision re-solve of the crossover reproduces imp-96563 IMP96563_CERT_LIMIT_N (~1.08e5) within 2%, validating the port before pushing u to the double-double scale.',
  },
  {
    id: 'imp96584-dd-crossover-in-band',
    holds: () =>
      IMP96584_CROSSOVER.doubleDoubleSpecN > 1e10 &&
      IMP96584_CROSSOVER.doubleDoubleSpecN < 1e11 &&
      IMP96584_CROSSOVER.doubleDoubleTrueN < IMP96584_CROSSOVER.doubleDoubleSpecN &&
      IMP96584_CROSSOVER.decadesGainedSpec > 5 &&
      IMP96584_CROSSOVER.decadesGainedSpec < 6,
    why: 'the double-double certified-lam_min crossover is N ~ 2.67e10 (spec) / 2.48e10 (true 2^-106), a +5.4 decade gain over the double-precision crossover.',
  },
  {
    id: 'imp96584-reach-exceeds-conditioning-ceiling',
    holds: () =>
      IMP96584_VS_CEILING.reachExceedsCeiling === true &&
      IMP96584_VS_CEILING.reachOverRigorousCeiling > 500 &&
      IMP96584_VS_CEILING.reachOverMeasuredCeiling > 300 &&
      IMP96584_VS_CEILING.shiftOverLamMinAtCeiling < 1e-2,
    why: 'the double-double reach N ~ 2.67e10 exceeds the conditioning ceiling N ~ 2.59e7 by ~1030x (and 4.11e7 by ~649x); at the ceiling itself the double-double rounding shift is under 1% of lam_min, so precision is not the barrier.',
  },
  {
    id: 'imp96584-precision-removed-not-figure-rigorous',
    holds: () =>
      IMP96584_VERDICT.precisionRemovedAsBarrier === true &&
      IMP96584_VERDICT.ceilingFigureNowRigorous === false &&
      IMP96584_RESIDUAL.precisionNoLongerBinds === true &&
      /extrapolation/i.test(IMP96584_RESIDUAL.statement) &&
      /compute/i.test(IMP96584_RESIDUAL.statement),
    why: 'extended precision removes the imp-96563 precision obstruction but the ceiling figure stays fit-extrapolated: compute-infeasibility at N ~ 2.6e7 and "extrapolation is not proof" remain.',
  },
  {
    id: 'imp96584-honesty-gate-no-qed',
    holds: () =>
      IMP96584_VERDICT.anyBoundMoved === false &&
      /NO QED/.test(IMP96584_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96584_HONEST_BANNER) &&
      /RH open/.test(IMP96584_HONEST_BANNER),
    why: 'assessment only: no bound moved, no double-double Cholesky was run, and the honesty markers plus the narrowed residual are present.',
  },
];

for (const a of IMP96584_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96584-route-m-lammin-doubledouble-cert-reach assertion failed: ${a.id}`,
    );
  }
}

export default {
  inputs: IMP96584_INPUTS,
  crossover: IMP96584_CROSSOVER,
  vsCeiling: IMP96584_VS_CEILING,
  residual: IMP96584_RESIDUAL,
  verdict: IMP96584_VERDICT,
  banner: IMP96584_HONEST_BANNER,
};
