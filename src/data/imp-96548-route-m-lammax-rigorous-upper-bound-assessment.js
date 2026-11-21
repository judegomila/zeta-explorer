/**
 * @module imp-96548-route-m-lammax-rigorous-upper-bound-assessment
 *
 * imp-96548 (proof, ASSESSMENT ONLY): assess whether the Route M Vasyunin Gram
 * G_{hk} = gcd(h,k) I(h/g,k/g)/(hk) admits a RIGOROUS asymptotic upper bound on
 * lam_max(N) of matching log-shape that could REPLACE the imp-96443 power-iteration
 * fit lam_max = 3.0247 + 0.3526 log N (recorded there and in imp-96480 as a
 * MEASUREMENT, explicitly "not a rigorous asymptotic proof of the log-growth
 * coefficients"), and whether such a bound confirms the re-derived double-precision
 * Cholesky-breakdown conditioning ceiling N ~ 4.11e7.
 *
 * This changes NO bound, establishes no operator positivity, makes no RH claim.
 * It is a re-analysis of the imp-96443 / imp-96428 numbers plus one elementary
 * rigorous inequality already present in the record. NO QED.
 *
 * -------------------------------------------------------------------------------
 * FINDING 1 -- a rigorous log-SHAPE upper bound ALREADY EXISTS, unconditionally.
 * -------------------------------------------------------------------------------
 * The Gram G_N is symmetric positive definite (an SPD Gram of the Vasyunin basis
 * functions), so its top eigenvalue is dominated by the trace:
 *
 *     lam_max(G_N) <= trace(G_N) = Sum_{k<=N} G_kk = I(1,1) * H_N,
 *
 * because the diagonal is G_kk = I(1,1)/k (imp-96443 records the diagonal maximum
 * G_11 = I(1,1) = 1.2606614015078126 and trace = I(1,1) H_N to full precision).
 * With H_N = log N + gamma + O(1/N) this is a RIGOROUS, UNCONDITIONAL upper bound
 *
 *     lam_max(N) <= I(1,1) (log N + gamma) + O(1/N) = 1.2607 log N + 0.728 + o(1),
 *
 * of exactly the log SHAPE of the imp-96443 fit. So the question "does the structure
 * admit a rigorous asymptotic log-shape upper bound?" is answered YES -- and the
 * proof is elementary (SPD trace domination), needing nothing about zeta.
 *
 * -------------------------------------------------------------------------------
 * FINDING 2 -- but it does NOT reproduce the measured COEFFICIENT 0.3526.
 * -------------------------------------------------------------------------------
 * The rigorous trace slope is I(1,1) = 1.2607; the measured fit slope is 0.3526,
 * about 3.6x smaller. At the top accessible rung N=6000 the rigorous bound gives
 * lam_max <= 11.6948 (= the measured trace) against the measured lam_max ~ 6.09,
 * so trace domination OVERSTATES lam_max by ~1.92x there (11.6948/6.0924) and the
 * gap WIDENS in the pure slope (3.6x) -- the ~1.58x figure is the CEILING-N ratio
 * from FINDING 3 below, not the value ratio at N=6000. The slack is the OFF-DIAGONAL
 * Gram mass: trace domination
 * throws away all off-diagonal cancellation, and pinning the true coefficient 0.3526
 * rigorously would require a sharp asymptotic for the off-diagonal spectral mass of
 * the multiplicative Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk) -- a Toeplitz / Szego
 * -type limiting-spectrum statement that is NOT available. So the imp-96443 fit
 * CANNOT be replaced by a rigorous derivation of its coefficient; it can only be
 * bounded from above rigorously. That off-diagonal-mass asymptotic is the genuine
 * open piece and is named as the residual sub-gap below.
 *
 * -------------------------------------------------------------------------------
 * FINDING 3 -- the rigorous bound is nonetheless ENOUGH to confirm the ceiling.
 * -------------------------------------------------------------------------------
 * Because lam_max enters cond#(N) = lam_max(N)/lam_min(N) only linearly while
 * lam_min ~ A N^-p (A=0.8186721, p=1.917927, imp-96428) decays as a large power,
 * substituting the RIGOROUS trace-domination lam_max in place of the measured fit
 * moves the double-precision Cholesky-breakdown ceiling (cond# = 1/eps) only from
 * the measured N ~ 4.11e7 down to N ~ 2.59e7 -- a factor 1.58, NOT an order of
 * magnitude (re-solved here, IMP96548_CEILING). And since trace domination is an
 * UPPER bound on lam_max, using it gives a LOWER estimate of the ceiling: modulo the
 * (non-rigorous) lam_min power-law extrapolation, the true conditioning ceiling is
 * >= ~2.59e7. Either value sits ~2600x above the imp-96352 wall-clock compute
 * ceiling N ~ 9916, so the imp-96428 / imp-96443 verdict "conditioning does not cap
 * the reachable range; compute binds first" is confirmed RIGOROUSLY in lam_max (the
 * only remaining non-rigorous input is the lam_min extrapolation, unchanged here).
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * (a) YES, a rigorous asymptotic log-shape upper bound exists and is unconditional:
 *     lam_max(N) <= I(1,1) H_N = 1.2607 log N + O(1) (SPD trace domination).
 * (b) It CAN replace the fit for the purpose of CONFIRMING the ceiling: it yields a
 *     rigorous lower ceiling N >= ~2.59e7 (given the lam_min power law), still
 *     ~2600x above compute, so conditioning does not cap.
 * (c) It CANNOT replace the fit as a precise LAW: it does not reproduce the measured
 *     coefficient 0.3526 (its slope 1.2607 is ~3.6x too large), so the specific
 *     figure N ~ 4.11e7 still rests on the non-rigorous imp-96443 fit coefficient.
 *     Matching 0.3526 rigorously needs the off-diagonal-mass / Szego-type asymptotic,
 *     which is open.
 *
 * Assessment only. Changes no bound; establishes no operator positivity; makes no RH
 * claim. No refereed bound is changed. RH open. NO QED.
 *
 * @see imp-96443-route-m-vasyunin-lammax-measured.js (the measured fit assessed here)
 * @see imp-96480-route-m-lammax-glossary-headword.js (the "not a rigorous proof" status this addresses)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling.js (lam_min power law, three-proxy bracket)
 * @see imp-96352-route-m-vasyunin-solve-cost-model.js (wall-clock compute ceiling ~9916)
 *
 * Ticket: imp-96548 (proof, opus-4-8, api-pool). Assessment only; NO QED.
 */

// Inputs reused verbatim from the record (imp-96443 / imp-96428).
export const IMP96548_INPUTS = Object.freeze({
  eps: 2.220446049250313e-16, // double-precision machine epsilon; breakdown cond# = 1/eps
  i11: 1.2606614015078126, // Gram diagonal numerator I(1,1); trace(G_N) = I(1,1) H_N
  gamma: 0.5772156649015329, // Euler-Mascheroni; H_N = log N + gamma + O(1/N)
  lamMinA: 0.8186721, // imp-96428 lam_min power law: lam_min ~ A N^-p
  lamMinP: 1.917927,
  measuredFitA: 3.0246914027257246, // imp-96443 fit intercept
  measuredFitB: 0.3526253785070698, // imp-96443 fit slope (the coefficient in question)
  traceSlopeI11: 1.2606614015078126, // rigorous trace-domination slope
  measuredCeilingN: 41088904.757400334, // imp-96443 ceiling from the measured fit (~4.11e7)
  computeCeilingN: 9916, // imp-96352 wall-clock reach ceiling
});

// The rigorous, unconditional log-shape upper bound (SPD trace domination).
export const IMP96548_RIGOROUS_BOUND = Object.freeze({
  statement: 'lam_max(N) <= trace(G_N) = I(1,1) H_N = 1.2607 (log N + gamma) + O(1/N)',
  proof:
    'G_N is SPD (a Gram matrix), so lam_max <= trace = Sum_k G_kk; the diagonal is ' +
    'G_kk = I(1,1)/k (imp-96443), whence trace = I(1,1) H_N with H_N = log N + gamma + O(1/N). ' +
    'Elementary and unconditional -- uses no property of zeta.',
  slope: 1.2606614015078126,
  matchesMeasuredSlope: false,
  slopeOverstatementFactor: 1.2606614015078126 / 0.3526253785070698, // ~3.575
});

// Re-solve the double-precision Cholesky-breakdown ceiling cond# = lam_max/lam_min = 1/eps
// with lam_max taken as the RIGOROUS trace bound, vs the measured fit. Bisection on N.
function solveCeiling(lamMaxOf) {
  const { eps, lamMinA, lamMinP } = IMP96548_INPUTS;
  let lo = 1e3;
  let hi = 1e10;
  for (let i = 0; i < 300; i += 1) {
    const N = Math.sqrt(lo * hi);
    const cond = lamMaxOf(N) / (lamMinA * Math.pow(N, -lamMinP));
    if (cond > 1 / eps) hi = N;
    else lo = N;
  }
  return Math.sqrt(lo * hi);
}

const lamMaxRigorous = (N) =>
  IMP96548_INPUTS.i11 * (Math.log(N) + IMP96548_INPUTS.gamma);
const lamMaxMeasured = (N) =>
  IMP96548_INPUTS.measuredFitA + IMP96548_INPUTS.measuredFitB * Math.log(N);

export const IMP96548_CEILING = Object.freeze({
  rigorousTraceCeilingN: solveCeiling(lamMaxRigorous), // ~2.59e7 (rigorous lower ceiling given lam_min law)
  measuredFitCeilingN: solveCeiling(lamMaxMeasured), // ~4.11e7 (matches imp-96443 to re-solve tolerance)
  ratioMeasuredOverRigorous:
    solveCeiling(lamMaxMeasured) / solveCeiling(lamMaxRigorous), // ~1.58
  rigorousIsLowerCeiling: true, // trace bound overestimates lam_max => underestimates the ceiling
  bothAboveComputeCeilingFactor:
    solveCeiling(lamMaxRigorous) / IMP96548_INPUTS.computeCeilingN, // ~2615x
  note:
    'Substituting the rigorous trace-domination lam_max for the measured fit moves the ' +
    'ceiling only 4.11e7 -> 2.59e7 (factor 1.58), both ~2600x above the compute ceiling ' +
    'N ~ 9916; because trace domination upper-bounds lam_max, N ~ 2.59e7 is a rigorous ' +
    'LOWER estimate of the true ceiling (conditional only on the lam_min power law).',
});

// The residual open piece: a rigorous derivation of the measured coefficient 0.3526.
export const IMP96548_SUBGAP = Object.freeze({
  id: 'imp-96548-lammax-coefficient-offdiagonal-mass',
  statement:
    'The rigorous bound reproduces the log SHAPE but not the measured COEFFICIENT 0.3526 ' +
    '(its slope is the trace slope I(1,1) = 1.2607, ~3.6x too large). The slack is the ' +
    'off-diagonal Gram mass that trace domination discards. Pinning 0.3526 rigorously ' +
    'requires a sharp asymptotic for the limiting spectral mass of the multiplicative ' +
    'Vasyunin kernel gcd(h,k) I(h/g,k/g)/(hk) -- a Toeplitz / Szego-type statement that ' +
    'is not available. Until then the specific ceiling N ~ 4.11e7 rests on the ' +
    'non-rigorous fit coefficient; only the rigorous lower ceiling N >= ~2.59e7 (given ' +
    'the lam_min power law) and the "compute binds first" verdict are rigorous in lam_max.',
});

export const IMP96548_VERDICT = Object.freeze({
  question:
    'does the Vasyunin/Gram structure admit a rigorous asymptotic upper bound on lam_max(N) ' +
    'of matching log-shape that can replace the imp-96443 fit 3.0247 + 0.3526 log N and ' +
    'confirm the N ~ 4.11e7 conditioning ceiling?',
  rigorousLogShapeBoundExists: true,
  rigorousSlope: 1.2606614015078126,
  reproducesMeasuredCoefficient: false,
  confirmsCeilingQualitatively: true,
  rigorousLowerCeilingN: IMP96548_CEILING.rigorousTraceCeilingN,
  measuredCeilingN: IMP96548_INPUTS.measuredCeilingN,
  computeBindsFirst: true,
  anyBoundMoved: false,
  conclusion:
    'YES, a rigorous unconditional log-shape upper bound exists (lam_max <= I(1,1) H_N = ' +
    '1.2607 log N + O(1), SPD trace domination). It CONFIRMS the ceiling: it yields a ' +
    'rigorous lower ceiling N >= ~2.59e7 (given the lam_min power law), ~2600x above the ' +
    'imp-96352 compute ceiling N ~ 9916, so conditioning does not cap the reachable range. ' +
    'But it does NOT reproduce the measured coefficient 0.3526 (its slope 1.2607 is ~3.6x ' +
    'larger), so the precise figure N ~ 4.11e7 still rests on the non-rigorous imp-96443 ' +
    'fit; matching 0.3526 rigorously needs the open off-diagonal-mass / Szego-type ' +
    'asymptotic (sub-gap imp-96548-lammax-coefficient-offdiagonal-mass). Changes no bound; ' +
    'no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96548_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Assessment only: the rigorous bound is ' +
  'elementary SPD trace domination on the same exact Vasyunin Gram as imp-96105 / imp-96443; ' +
  'the ceiling re-solve is pure re-analysis of the imp-96428 lam_min power law. No bound is ' +
  'claimed moved and no operator positivity is established.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96548_ASSERTIONS = [
  {
    id: 'imp96548-rigorous-bound-is-log-shape-wrong-coefficient',
    holds: () =>
      IMP96548_RIGOROUS_BOUND.matchesMeasuredSlope === false &&
      Math.abs(IMP96548_RIGOROUS_BOUND.slope - IMP96548_INPUTS.i11) < 1e-15 &&
      IMP96548_RIGOROUS_BOUND.slopeOverstatementFactor > 3.4 &&
      IMP96548_RIGOROUS_BOUND.slopeOverstatementFactor < 3.7,
    why: 'the rigorous trace-domination slope is I(1,1)=1.2607, ~3.6x the measured 0.3526: right log-shape, wrong coefficient.',
  },
  {
    id: 'imp96548-rigorous-ceiling-close-to-measured',
    holds: () =>
      IMP96548_CEILING.rigorousTraceCeilingN > 2.4e7 &&
      IMP96548_CEILING.rigorousTraceCeilingN < 2.8e7 &&
      IMP96548_CEILING.ratioMeasuredOverRigorous > 1.4 &&
      IMP96548_CEILING.ratioMeasuredOverRigorous < 1.8,
    why: 'substituting the rigorous lam_max moves the ceiling only 4.11e7 -> ~2.59e7 (factor ~1.58), not an order of magnitude: lam_max enters cond# only linearly.',
  },
  {
    id: 'imp96548-measured-resolve-matches-imp96443',
    holds: () =>
      Math.abs(IMP96548_CEILING.measuredFitCeilingN - IMP96548_INPUTS.measuredCeilingN) /
        IMP96548_INPUTS.measuredCeilingN <
      1e-3,
    why: 'the local re-solve of the measured-fit ceiling reproduces the imp-96443 value 4.11e7 to < 1e-3 relative: the ceiling method is faithfully reproduced.',
  },
  {
    id: 'imp96548-both-ceilings-above-compute',
    holds: () =>
      IMP96548_CEILING.bothAboveComputeCeilingFactor > 2000 &&
      IMP96548_VERDICT.computeBindsFirst === true,
    why: 'both the rigorous (2.59e7) and measured (4.11e7) ceilings sit ~2600x above the compute ceiling N ~ 9916: conditioning does not cap; compute binds first.',
  },
  {
    id: 'imp96548-honesty-gate-no-qed',
    holds: () =>
      IMP96548_VERDICT.anyBoundMoved === false &&
      IMP96548_VERDICT.rigorousLogShapeBoundExists === true &&
      IMP96548_VERDICT.reproducesMeasuredCoefficient === false &&
      /NO QED/.test(IMP96548_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96548_HONEST_BANNER) &&
      /RH open/.test(IMP96548_HONEST_BANNER) &&
      /offdiagonal-mass/.test(IMP96548_SUBGAP.id),
    why: 'assessment only: no bound moved, the rigorous-shape/non-rigorous-coefficient split is recorded, the honesty markers and the residual off-diagonal-mass sub-gap are present.',
  },
];

for (const a of IMP96548_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-96548-route-m-lammax-rigorous-upper-bound-assessment assertion failed: ${a.id}`,
    );
  }
}

export default {
  inputs: IMP96548_INPUTS,
  rigorousBound: IMP96548_RIGOROUS_BOUND,
  ceiling: IMP96548_CEILING,
  subGap: IMP96548_SUBGAP,
  verdict: IMP96548_VERDICT,
  banner: IMP96548_HONEST_BANNER,
};
