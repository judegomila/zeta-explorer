/**
 * @module imp-35434-eflow-fartail-additivity-deep-rungs
 *
 * imp-35434 (accuracy, frontier-direction): imp-35402 verified the two-component
 * additivity identity
 *
 *     fdVsAnalyticGap + inverseSwapGap = analyticResidual   (to < 5e-4)
 *
 * at every rung of the ORIGINAL imp-35279/imp-35280 four-rung ladder N = 1e6/1e9/1e12/1e16,
 * but never tested the split at the deep rungs imp-35371 (N = 1e18/1e20/1e24) or toward the
 * imp-35370/imp-35390 50/50 crossover log10 N = 44.7593 (N ~ 5.745e44). This import-light
 * module (effectiveHeightForN only, no heavy zeros bundle) reproduces the imp-35236/imp-35378
 * swappable-height-map finite difference VERBATIM at those deep rungs -- same imp-398 prefactor,
 * same GRONWALL = exp(2.37e-4), same central difference h = 1.0002 -- and re-checks whether the
 * two gaps still sum to the analytic residual, or whether an additivity DEFECT grows as the two
 * components approach 50/50.
 *
 * THE ADDITIVITY IDENTITY IS AN ORDERING PROPERTY
 * -----------------------------------------------
 * With the three measured exponents fdTrue (true RvM inverse), fdSurr (closed surrogate
 * T0 = 2 pi N / log N) and analyticLead (-1 + 3/log N), the imp-35402 identity in its
 * absolute-value form reads
 *     |analyticLead - fdSurr| + |fdSurr - fdTrue| = |analyticLead - fdTrue|,
 * which holds EXACTLY iff fdSurr lies BETWEEN fdTrue and analyticLead. So the two-component
 * split is additive precisely while the surrogate exponent stays ordered inside the bracket
 * [min, max] of the true and analytic exponents; any additivity defect would be the signature
 * of fdSurr escaping that bracket.
 *
 *   N        fdTrue      fdSurr      analyticLead   IS gap    FD gap    residual   swapFrac  defect
 *   1e18     -0.923...   -0.925...   -0.927...      0.002033  0.001615  0.003648   0.5572    0
 *   1e20     -0.9317     -0.9334     -0.9349        0.001711  0.001408  0.003119   0.5485    0
 *   1e24     -0.9434     -0.9446     -0.9457        0.001263  0.001097  0.002360   0.5351    0
 *   5.745e44 (log10 N = 44.7593, the imp-35370 crossover)    0.000431  0.000431  0.000862   0.5000    0
 *
 * THE FINDING (answers the imp-35434 question)
 * --------------------------------------------
 * (1) The full-precision additivity defect (FD gap + IS gap - residual) is EXACTLY 0 at all
 *     three deep rungs AND at the 50/50 crossover -- fdSurr stays inside the [fdTrue, analyticLead]
 *     bracket the whole way, so the split is not merely within 5e-4 but algebraically additive.
 * (2) There is NO growing additivity defect as the components approach 50/50: at the crossover
 *     the inverse-swap gap and the closed-form/prefactor remnant are each EXACTLY half the
 *     residual (0.000431 = 0.000431, swapFraction = 0.5000) and the split is still exactly
 *     additive. The 50/50 point is a symmetric bisection of the residual, not an additivity break.
 * (3) Reconstructing from the imp-35279/imp-35280 4-decimal-rounded storage convention (round each
 *     gap/residual to 4 decimals, then sum) the defect stays bounded below 5e-4 at every deep rung
 *     including the crossover (max magnitude 1e-4, a pure 4-decimal-rounding residue) -- so the
 *     imp-35402 < 5e-4 tolerance survives the extension to the deep ladder and the crossover.
 *
 * MEASUREMENT / CONSISTENCY CHECK ONLY. Reproduces the imp-35236 finite difference on the
 * inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; changes no bound;
 * E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED;
 * E_coll far-tail exponent 1/2 per imp-3463; imp-3066 K_a >= 0 untouched; imp-486 UNTOUCHED;
 * no operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35402-eflow-fartail-ladder-literal-reconstruction-check (checked additivity on the original four rungs)
 * @see imp-35378-eflow-fartail-inverse-swap-ladder-1e20-1e24 (the verbatim finite difference reproduced here)
 * @see imp-35370-eflow-fartail-swap-fraction-half-crossover (the crossover log10 N = 44.7593 tested here)
 * @see imp-35390-eflow-fartail-remnant-overtakes-swap-crossover (remnant-side framing of the same crossover)
 * @see lambda-rh-height-mapping (effectiveHeightForN: the true RvM zero-ordinate inverse swapped in here)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';

const TWO_PI = 2 * Math.PI;

// imp-35135 exact sub-term constant (no re-derivation): the A1-trap Gronwall factor.
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-35135/imp-35236/imp-35378 exactly

// The closed RvM surrogate height map T0 = 2 pi N / log N (the inverse the derivation uses).
function surrogateHeightForN(N) {
  return (TWO_PI * N) / Math.log(N);
}

// EXACT imp-35135/imp-35236 far-tail E_flow quantity, with a SWAPPABLE height map.
function eFlowWith(heightFn, N) {
  const T0 = heightFn(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  return C_F * (L / T0) * GRONWALL;
}

// Local log-log decay exponent by the SAME central difference as imp-35135/imp-35236 (h = 1.0002).
function localExponent(fn, N) {
  const h = 1.0002;
  const lo = Math.log(fn(N / h));
  const hi = Math.log(fn(N * h));
  return (hi - lo) / (Math.log(N * h) - Math.log(N / h));
}

// The analytic leading closed form -1 + 3/log N (imp-35198).
function leadingAnalyticExponent(x) {
  return -1 + 3 / x;
}

// Round to the imp-35279/imp-35280 4-decimal storage convention.
function round4(v) {
  return +v.toFixed(4);
}

// Build a rung with the full component decomposition plus both additivity defects.
function rungForN(N) {
  const x = Math.log(N);
  const fdTrue = localExponent((n) => eFlowWith(effectiveHeightForN, n), N);
  const fdSurr = localExponent((n) => eFlowWith(surrogateHeightForN, n), N);
  const analyticLead = leadingAnalyticExponent(x);
  const inverseSwapGap = Math.abs(fdSurr - fdTrue); // PURELY the inverse swap
  const analyticResidual = Math.abs(analyticLead - fdTrue); // imp-35217/imp-35237 residual
  const fdVsAnalyticGap = Math.abs(analyticLead - fdSurr); // closed-form/prefactor remnant
  // The imp-35402 additivity identity, full precision and under the 4-decimal storage convention.
  const additivityDefectFull = fdVsAnalyticGap + inverseSwapGap - analyticResidual;
  const additivityDefectRounded =
    round4(fdVsAnalyticGap) + round4(inverseSwapGap) - round4(analyticResidual);
  // fdSurr inside the [min, max] bracket of fdTrue and analyticLead => absolute additivity holds.
  const surrogateOrdered =
    fdSurr >= Math.min(fdTrue, analyticLead) && fdSurr <= Math.max(fdTrue, analyticLead);
  return {
    N: +N.toExponential(3),
    logN: +x.toFixed(4),
    log10N: +(x / Math.log(10)).toFixed(4),
    fdTrueExponent: +fdTrue.toFixed(6),
    fdSurrogateExponent: +fdSurr.toFixed(6),
    analyticLeadingExponent: +analyticLead.toFixed(6),
    inverseSwapGap: +inverseSwapGap.toFixed(6),
    fdVsAnalyticGap: +fdVsAnalyticGap.toFixed(6),
    analyticResidual: +analyticResidual.toFixed(6),
    swapFraction: +(inverseSwapGap / analyticResidual).toFixed(4),
    additivityDefectFull,
    additivityDefectRounded,
    surrogateOrdered,
  };
}

// The imp-35371 deep rungs plus the imp-35370/imp-35390 50/50 crossover.
const RUNG_1E18 = rungForN(1e18);
const RUNG_1E20 = rungForN(1e20);
const RUNG_1E24 = rungForN(1e24);
const CROSSOVER = rungForN(5.745e44); // log10 N = 44.7593, where swapFraction = 0.5
const DEEP_RUNGS = [RUNG_1E18, RUNG_1E20, RUNG_1E24];
const ALL_RUNGS = [RUNG_1E18, RUNG_1E20, RUNG_1E24, CROSSOVER];

export const IMP35434_EFLOW_FARTAIL_ADDITIVITY_DEEP_RUNGS = {
  id: 'imp-35434',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-35402 two-component additivity check (fdVsAnalyticGap + inverseSwapGap = ' +
    'analyticResidual to < 5e-4) from the original imp-35279/imp-35280 four rungs onto the deep ' +
    'rungs N = 1e18/1e20/1e24 and toward the imp-35370 crossover log10 N = 44.7593, and measure ' +
    'whether the split stays additive or a defect grows as the components approach 50/50.',
  method:
    'Reproduce the imp-35236/imp-35378 swappable-height-map E_flow = C_F * (L/T0) * GRONWALL ' +
    'VERBATIM (same prefactor, same GRONWALL, same central difference h = 1.0002) at N = 1e18/ ' +
    '1e20/1e24 and at the crossover N ~ 5.745e44; decompose each residual into the inverse-swap ' +
    'gap and the closed-form/prefactor remnant and measure the additivity defect both at full ' +
    'precision and under the 4-decimal storage convention.',
  deepRungs: DEEP_RUNGS,
  crossover: CROSSOVER,
  allRungs: ALL_RUNGS,
  finding: {
    F1_full_precision_defect_exactly_zero:
      'The full-precision additivity defect (FD gap + IS gap - residual) is EXACTLY 0 at all ' +
      'three deep rungs AND at the crossover: fdSurr stays inside the [fdTrue, analyticLead] ' +
      'bracket the whole way, so the split is algebraically additive, not merely within 5e-4.',
    F2_no_growing_defect_at_5050:
      'There is NO growing additivity defect as the components approach 50/50: at the crossover ' +
      'the inverse-swap gap and the closed-form/prefactor remnant are each EXACTLY half the ' +
      'residual (swapFraction = 0.5000) and the split is still exactly additive -- a symmetric ' +
      'bisection of the residual, not an additivity break.',
    F3_rounded_convention_stays_under_5e_4:
      'Reconstructing from the imp-35279/imp-35280 4-decimal storage convention, the defect stays ' +
      'bounded below 5e-4 at every deep rung including the crossover (max magnitude ~1e-4, a pure ' +
      '4-decimal-rounding residue), so the imp-35402 < 5e-4 tolerance survives the extension.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT ONLY (frontier-direction, NOT rigorous). Extending the imp-35402 additivity ' +
    'check onto the imp-35371 deep rungs N = 1e18/1e20/1e24 and the imp-35370 crossover ' +
    'log10 N = 44.7593: the full-precision defect fdVsAnalyticGap + inverseSwapGap - ' +
    'analyticResidual is EXACTLY 0 at every one of them (fdSurr stays inside the ' +
    '[fdTrue, analyticLead] bracket, making the absolute-value split algebraically additive), and ' +
    'under the 4-decimal storage convention it stays bounded below 5e-4 (max ~1e-4). At the 50/50 ' +
    'crossover the inverse-swap gap and closed-form/prefactor remnant are each exactly half the ' +
    'residual with the split still exactly additive -- a symmetric bisection, not an additivity ' +
    'break -- so NO defect grows as the components approach 50/50. Measurement only on the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; E_flow > 0 strictness ' +
    '(imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; E_coll far-tail exponent ' +
    '1/2 per imp-3463; imp-3066 K_a >= 0 untouched; changes no bound; no operator positivity; no ' +
    'RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35402 (additivity checked on the original four rungs); imp-35378 (verbatim finite ' +
    'difference reproduced here); imp-35370/imp-35390 (the crossover log10 N = 44.7593); ' +
    'imp-35279/imp-35280 (the far-tail ladder and its 4-decimal storage convention); imp-486 ' +
    '(C_mb GUE-conditional, UNTOUCHED); lambda-rh-height-mapping.',
};

export const IMP35434_EFLOW_FARTAIL_ADDITIVITY_DEEP_RUNGS_ASSERTIONS = [
  {
    // Full-precision additivity holds EXACTLY (defect 0) at all three deep rungs.
    id: 'imp35434-full-precision-additivity-exact-deep-rungs',
    description: 'fdVsAnalyticGap + inverseSwapGap - analyticResidual is exactly 0 at N = 1e18/1e20/1e24',
    holds: () => DEEP_RUNGS.every((r) => Math.abs(r.additivityDefectFull) < 1e-12),
  },
  {
    // Full-precision additivity still holds EXACTLY at the 50/50 crossover (no break at 50/50).
    id: 'imp35434-full-precision-additivity-exact-at-crossover',
    description: 'additivity defect is exactly 0 at the imp-35370 crossover log10 N = 44.7593',
    holds: () => Math.abs(CROSSOVER.additivityDefectFull) < 1e-12,
  },
  {
    // The additivity is an ORDERING property: fdSurr stays inside [fdTrue, analyticLead] throughout.
    id: 'imp35434-surrogate-stays-inside-bracket',
    description: 'fdSurr stays inside the [fdTrue, analyticLead] bracket at every rung (the reason additivity holds)',
    holds: () => ALL_RUNGS.every((r) => r.surrogateOrdered === true),
  },
  {
    // At the crossover the two components are each EXACTLY half the residual (symmetric bisection).
    id: 'imp35434-crossover-fifty-fifty-symmetric',
    description: 'at the crossover inverseSwapGap == fdVsAnalyticGap (each half the residual) and swapFraction = 0.5',
    holds: () =>
      Math.abs(CROSSOVER.inverseSwapGap - CROSSOVER.fdVsAnalyticGap) < 5e-6 &&
      Math.abs(CROSSOVER.swapFraction - 0.5) < 1e-3,
  },
  {
    // Under the 4-decimal storage convention the defect stays within the imp-35402 <5e-4 tolerance.
    id: 'imp35434-rounded-convention-under-5e-4-all-rungs',
    description: '4-decimal-rounded reconstruction defect stays below 5e-4 at all deep rungs and the crossover',
    holds: () => ALL_RUNGS.every((r) => Math.abs(r.additivityDefectRounded) < 5e-4),
  },
  {
    // Honesty gate: measurement only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35434-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP35434_EFLOW_FARTAIL_ADDITIVITY_DEEP_RUNGS.isRigorous === false &&
      /NO QED/.test(IMP35434_EFLOW_FARTAIL_ADDITIVITY_DEEP_RUNGS.verdict) &&
      /refereed bound is changed/i.test(IMP35434_EFLOW_FARTAIL_ADDITIVITY_DEEP_RUNGS.verdict),
  },
];

for (const a of IMP35434_EFLOW_FARTAIL_ADDITIVITY_DEEP_RUNGS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35434-eflow-fartail-additivity-deep-rungs assertion failed: ${a.id}`,
    );
  }
}
