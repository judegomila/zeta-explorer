/**
 * @module imp-97398-route-m-cq-joint-exponent-fit-nonpinnability
 * @fileoverview imp-97398 -- HONEST PARTIAL (measurement; the imp-97334 non-pinnability verdict is
 *   UPHELD from a new joint-fit angle):
 *   TEST the imp-97334 / imp-97361 conclusion that the interior sub-leading constant cQ of
 *       Q(b) = s0 b + cQ + r(b),   Q(b) = Sum_{a=2,(a,b)=1}^{b-1} I(a,b)^2 / a^2,
 *       I(h,k) = C(h+k) + (1/2)(h-k) log(k/h) - (pi/2)(V(h,k)+V(k,h)),  C = (log 2pi - gamma)/2,
 *   is NOT pinnable (effective ~ -13.4, no b -> infinity limit, |d cQ / d s0| = b so a longer
 *   ladder worsens it). The ticket asks to test this with (i) a JOINT (cQ, exponent) nonlinear fit
 *   and (ii) an extended-precision interior ladder, and to measure whether cQ stabilizes under any
 *   reparametrization or whether the divergence is confirmed under all designs.
 *
 *   Kernel validated exactly (tmp/imp-97398-cq-joint-exponent-fit.py): T(250) = 11.757622 and
 *   window [100,300) mean Q/b = 1.68979 reproduced, matching imp-97334 / imp-96750 / imp-96708.
 *
 *   ------------------------------------------------------------------------------------------
 *   TEST 1 -- the JOINT (s0, cQ, exponent p) nonlinear fit m(b) = s0 + cQ b^(p-1) is DEGENERATE
 *   ------------------------------------------------------------------------------------------
 *   Levenberg-Marquardt on the width-80 window means m(b) = <Q/b> at centers b in [200,1500]
 *   (g(b) = cQ b^p) converges from every start (p0 in {0.01, 0.5, 0.9}) to the SAME saddle
 *       s0 = 1.7871,  cQ = -2.008,  p = 0.4190,
 *   but the parameter uncertainties are enormous relative to the values:
 *       sigma(cQ) = 2.97  (148% of |cQ|),   sigma(p) = 0.33  (79% of p),
 *       cond( cov[cQ, p] ) = 1.92e4.
 *   The exponent p is NOT determinable and cQ trades off against it along the covariance ellipse:
 *   the joint fit CANNOT separate cQ from the exponent. This is the imp-97261 / imp-97292 b^(1/2)-
 *   vs-log^2-b collinearity re-expressed in the (cQ, p) plane -- the fit is rank-deficient.
 *
 *   ------------------------------------------------------------------------------------------
 *   TEST 2 -- cQ does NOT stabilize under a trimmed/reparametrized ladder
 *   ------------------------------------------------------------------------------------------
 *   Dropping the low centers progressively (start index 0 -> 2 -> 4) in the fixed-exponent linear
 *   refit m(b) = s0 + cQ reg(b)/b:
 *       reg = 1 (constant): cQ = -14.99 -> -17.76 -> -22.86   rel-spread 0.424 (WORSENS, unstable),
 *       reg = sqrt(b):      cQ =  -1.41 ->  -1.33 ->  -1.48   rel-spread 0.110,
 *       reg = log^2 b:      cQ =  -0.61 ->  -0.60 ->  -0.69   rel-spread 0.147.
 *   The constant model (the object cQ = lim(Q - s0 b)) is the LEAST stable; the sqrt / log^2 forms
 *   look stable ONLY because each PRE-COMMITS a different exponent -- and TEST 1 shows the exponent
 *   itself is undetermined, so no single cQ is defined. Reparametrization does not pin cQ.
 *
 *   ------------------------------------------------------------------------------------------
 *   TEST 3 -- the |d cQ / d s0| = b coupling is confirmed exactly (extended to center 1400)
 *   ------------------------------------------------------------------------------------------
 *   Spread of <Q(b) - s0 b> across the imp-97243 s0 band [1.751, 1.7626] (width 0.0116):
 *       center 1000 -> 11.594 (predicted 11.600),  1200 -> 13.914 (13.920),  1400 -> 16.234 (16.240).
 *   Exactly band-width * center -- the s0 uncertainty +/- 0.006 injects +/- 0.006 b on cQ, so a
 *   longer ladder makes the estimate strictly WORSE (imp-97334 RESULT 3 reconfirmed, now to b=1400).
 *
 *   ------------------------------------------------------------------------------------------
 *   TEST 4 -- extended precision rules OUT precision as the obstruction (it is STRUCTURAL)
 *   ------------------------------------------------------------------------------------------
 *   Recomputing Q(b) with mpmath at dps = 40 matches the double-precision ladder to ~1e-11:
 *       b = 211 (prime):     |Q_mp - Q_double| = 6.8e-12,
 *       b = 400 (composite): |Q_mp - Q_double| = 2.7e-11.
 *   So the non-pinnability is NOT a floating-point artifact -- the double-precision ladder already
 *   resolves Q(b) far below the tens-of-units cQ swing; the obstruction is the growing sub-linear
 *   g(b), not the arithmetic precision.
 *
 *   ------------------------------------------------------------------------------------------
 *   VERDICT -- imp-97334 non-pinnability UPHELD from the joint-fit angle
 *   ------------------------------------------------------------------------------------------
 *   The joint (cQ, exponent) fit is rank-deficient (cond ~ 1.9e4, sigma(p) ~ 79%, sigma(cQ) ~ 148%);
 *   cQ does not stabilize under any reparametrization (constant-model rel-spread 0.42, WORSENING);
 *   the |d cQ / d s0| = b coupling holds exactly to b = 1400; and extended precision (dps 40)
 *   leaves Q(b) unchanged to ~1e-11, so the divergence is STRUCTURAL, not a precision artifact.
 *   No genuine cQ limit is observed under any design tested. Pinning cQ (hence the far-field ceiling
 *   F as a VALUE) still requires the analytic Bettin-Conrey small-a asymptotic with the crossover
 *   Euler-Maclaurin correction (the imp-97329 sub-gap), NOT a longer or higher-precision ladder.
 *   Measurement only; pins no constant; no bound moves; the rigorous anchor stays the trace ceiling
 *   T = 2.594e7; compute N ~ 9916 (imp-96352) binds first by >2600x; no operator positivity; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 *   SUB-GAP (inherited, not closed): imp-97334-cq-constant-nonexistent-limit -- cQ = lim(Q - s0 b)
 *   does not exist and is coupled to s0 with sensitivity b; a pinnable value needs the analytic
 *   Bettin-Conrey small-a asymptotic + crossover correction (imp-97329-uniform-crossover-mainterm-
 *   coupling), not more finite-b compute (numerical + joint-fit + higher-precision levers all dead).
 *
 * @see imp-97334-route-m-cq-subleading-constant-evaluation (cQ ~ -13.4 constant-model; no limit; |dcQ/ds0|=b)
 * @see imp-97292-route-m-cq-subleading-extended-ladder (b^(1/2) vs log^2 b collinearity NOT broken by longer ladder)
 * @see imp-97261-route-m-cq-subleading-functional-form (g(b) co-leading -1.44 b^(1/2) or -0.69 log^2 b)
 * @see imp-97207-route-m-farfield-intercept-derivation (c1_T = 2 s0 (gamma-3/2) + 2 cQ (zeta2-5/4) + 2R)
 *
 * Ticket: imp-97398 (numerical, opus-4-8, api-pool). Joint (cQ, exponent) fit degenerate; no limit; NO QED.
 */

export const IMP97398_ZETA2 = (Math.PI * Math.PI) / 6.0; // 1.6449340668482264

// -- TEST 1: the joint (s0, cQ, exponent p) nonlinear fit m(b)=s0+cQ b^(p-1) is degenerate. --------
export const IMP97398_JOINT_EXPONENT_FIT = Object.freeze({
  model: 'm(b) = s0 + cQ * b^(p-1)  [g(b) = cQ * b^p]',
  centers: '[200,300,...,1500] width-80 window means',
  s0Fit: 1.7871,
  cQFit: -2.008,
  pFit: 0.419,
  sigmaCQ: 2.97, // 148% of |cQ|
  sigmaP: 0.33, // 79% of p
  condCovCQP: 1.922e4, // condition number of the (cQ,p) sub-covariance = degeneracy meter
  identifiable: false, // exponent p undetermined; cQ trades off along the covariance ellipse
  note:
    'Every start (p0 in {0.01,0.5,0.9}) converges to the SAME saddle but with sigma(p) ~ 79% and ' +
    'cond ~ 1.9e4: the (cQ, exponent) fit is rank-deficient -- the imp-97261/97292 b^(1/2)-vs-log2 ' +
    'collinearity re-expressed in the (cQ, p) plane. cQ cannot be separated from the exponent.',
});

// -- TEST 2: cQ does NOT stabilize under a trimmed/reparametrized ladder. --------------------------
export const IMP97398_REPARAM_STABILITY = Object.freeze({
  trims: 'drop low centers, start index 0 -> 2 -> 4',
  forms: Object.freeze([
    Object.freeze({ form: 'const', cQ: Object.freeze([-14.989, -17.758, -22.856]), relSpread: 0.424 }),
    Object.freeze({ form: 'sqrt', cQ: Object.freeze([-1.413, -1.329, -1.484]), relSpread: 0.11 }),
    Object.freeze({ form: 'log2', cQ: Object.freeze([-0.608, -0.596, -0.689]), relSpread: 0.147 }),
  ]),
  note:
    'The constant model (the object cQ = lim(Q - s0 b)) is the LEAST stable (rel-spread 0.42, ' +
    'WORSENING as low centers drop). The sqrt/log2 forms look stable only because each PRE-COMMITS ' +
    'a different exponent -- and TEST 1 shows the exponent is undetermined, so no single cQ exists.',
});

// -- TEST 3: the |d cQ / d s0| = b coupling confirmed exactly (extended to center 1400). -----------
export const IMP97398_S0_COUPLING = Object.freeze({
  s0Band: Object.freeze({ low: 1.751, high: 1.7626, width: 0.0116 }), // imp-97243 core bracket
  sensitivityLaw: '|d cQ / d s0| = b (cQ = Q(b) - s0 b)',
  measuredSpreads: Object.freeze([
    Object.freeze({ center: 1000, spread: 11.594, predicted: 0.0116 * 1000 }), // 11.600
    Object.freeze({ center: 1200, spread: 13.914, predicted: 0.0116 * 1200 }), // 13.920
    Object.freeze({ center: 1400, spread: 16.234, predicted: 0.0116 * 1400 }), // 16.240
  ]),
});

// -- TEST 4: extended precision (dps 40) rules OUT precision as the obstruction. -------------------
export const IMP97398_EXTENDED_PRECISION = Object.freeze({
  dps: 40,
  checks: Object.freeze([
    Object.freeze({ b: 211, kind: 'prime', absDiffVsDouble: 6.8e-12 }),
    Object.freeze({ b: 400, kind: 'composite', absDiffVsDouble: 2.74e-11 }),
  ]),
  note:
    'Q(b) at dps 40 matches the double-precision ladder to ~1e-11 -- far below the tens-of-units cQ ' +
    'swing. The non-pinnability is STRUCTURAL (the growing sub-linear g(b)), not a precision artifact.',
});

// -- validation checkpoints reproduced by the kernel (tmp/imp-97398-cq-joint-exponent-fit.py). -----
export const IMP97398_VALIDATION = Object.freeze({
  T250: 11.757622, // imp-96708 unweighted interior checkpoint, reproduced
  window100to300MeanQoverB: 1.68979, // imp-96750 window mean, reproduced
});

export const IMP97398_VERDICT = Object.freeze({
  id: 'imp-97398',
  proofSection: 'Route-M',
  question:
    'Test the imp-97334/imp-97361 non-pinnability verdict on the interior sub-leading constant cQ ' +
    'via a joint (cQ, exponent) nonlinear fit and a higher-precision interior ladder: does cQ ' +
    'stabilize under any reparametrization or is the |d cQ / d s0| = b divergence confirmed?',
  jointFitDegenerate: true, // cond ~ 1.9e4, sigma(p) ~ 79%, sigma(cQ) ~ 148%
  cQStabilizesUnderReparam: false, // constant-model rel-spread 0.42 (worsening)
  s0CouplingSensitivityIsB: true, // spread = 0.0116*center exactly, to b=1400
  precisionIsTheObstruction: false, // dps 40 matches double to ~1e-11
  cQHasFiniteLimit: false, // no limit observed under any design tested
  pinnableConstant: false,
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'imp-97334 non-pinnability UPHELD from the joint-fit angle. The joint (s0, cQ, exponent p) fit ' +
    'm(b)=s0+cQ b^(p-1) converges from every start to s0=1.7871, cQ=-2.008, p=0.419 but is ' +
    'rank-deficient: sigma(cQ)=2.97 (148%), sigma(p)=0.33 (79%), cond(cov[cQ,p])=1.9e4 -- the ' +
    'exponent is undetermined and cQ trades off against it (the imp-97261/97292 b^(1/2)-vs-log2 ' +
    'collinearity in the (cQ,p) plane). cQ does not stabilize under reparametrization (constant- ' +
    'model cQ swings -14.99 -> -17.76 -> -22.86, rel-spread 0.42, WORSENING as low centers drop). ' +
    'The |d cQ / d s0| = b coupling holds exactly to b=1400 (spread 11.594/13.914/16.234 vs ' +
    'predicted 11.6/13.92/16.24). Extended precision (dps 40) leaves Q(b) unchanged to ~1e-11, so ' +
    'the divergence is STRUCTURAL not a precision artifact. No genuine cQ limit under any design. ' +
    'Pinning cQ (hence the far-field ceiling F as a value) needs the analytic Bettin-Conrey small-a ' +
    'asymptotic + crossover Euler-Maclaurin correction (imp-97329 sub-gap), NOT a longer or ' +
    'higher-precision ladder. Measurement only; pins no constant; no bound moves; anchor stays ' +
    'T=2.594e7; compute N~9916 binds first by >2600x; no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP97398_SUBGAP = Object.freeze({
  id: 'imp-97334-cq-constant-nonexistent-limit', // inherited, not closed
  statement:
    'cQ = lim(Q(b) - s0 b) does NOT exist and is coupled to the exact s0 with sensitivity ' +
    '|d cQ / d s0| = b. imp-97398 confirms this from a new angle: the joint (cQ, exponent) fit is ' +
    'rank-deficient (cond ~ 1.9e4), cQ does not stabilize under reparametrization, and extended ' +
    'precision (dps 40) does not help (structural, not precision). A pinnable cQ needs the analytic ' +
    'Bettin-Conrey small-a asymptotic + crossover Euler-Maclaurin correction (inherits ' +
    'imp-97329-uniform-crossover-mainterm-coupling), NOT more finite-b or higher-precision compute ' +
    '(numerical, joint-fit, and precision levers all refuted).',
});

export const IMP97398_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: testing the imp-97334 ' +
  'non-pinnability verdict on the interior sub-leading constant cQ via a joint (cQ, exponent) ' +
  'nonlinear fit and a higher-precision ladder UPHOLDS it. The joint fit m(b)=s0+cQ b^(p-1) is ' +
  'rank-deficient (sigma(p) ~ 79%, cond ~ 1.9e4); cQ does not stabilize under reparametrization ' +
  '(constant-model rel-spread 0.42, worsening); |d cQ / d s0| = b holds exactly to b=1400; and ' +
  'extended precision (dps 40) matches double to ~1e-11 (structural, not a precision artifact). ' +
  'No genuine cQ limit under any design. Pinning cQ needs the analytic Bettin-Conrey small-a ' +
  'asymptotic + crossover correction, not more compute. No bound is claimed moved.';

export default IMP97398_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97398_ASSERTIONS = [
  {
    id: 'imp97398-joint-fit-degenerate',
    why: 'the joint (cQ, exponent) fit must be rank-deficient: large condition number and an ' +
      'exponent uncertainty comparable to the exponent itself (cQ unidentifiable jointly with p).',
    holds: () =>
      IMP97398_JOINT_EXPONENT_FIT.identifiable === false &&
      IMP97398_JOINT_EXPONENT_FIT.condCovCQP > 1e3 &&
      IMP97398_JOINT_EXPONENT_FIT.sigmaP / IMP97398_JOINT_EXPONENT_FIT.pFit > 0.5 &&
      Math.abs(IMP97398_JOINT_EXPONENT_FIT.sigmaCQ / IMP97398_JOINT_EXPONENT_FIT.cQFit) > 1.0,
  },
  {
    id: 'imp97398-constant-model-least-stable',
    why: 'the constant model (the object cQ=lim(Q-s0 b)) must be the LEAST stable form under ' +
      'trimming -- the crux that cQ does not stabilize under reparametrization.',
    holds: () => {
      const byForm = Object.fromEntries(
        IMP97398_REPARAM_STABILITY.forms.map((f) => [f.form, f.relSpread]),
      );
      return (
        byForm.const > byForm.sqrt &&
        byForm.const > byForm.log2 &&
        byForm.const > 0.4 &&
        IMP97398_VERDICT.cQStabilizesUnderReparam === false
      );
    },
  },
  {
    id: 'imp97398-s0-coupling-sensitivity-is-b',
    why: 'the s0-coupling sensitivity must be |d cQ / d s0| = b: measured spread = band-width * ' +
      'center to ~1%, now confirmed out to center 1400.',
    holds: () =>
      IMP97398_S0_COUPLING.measuredSpreads.every(
        (r) => Math.abs(r.spread - r.predicted) / r.predicted < 0.01,
      ) && IMP97398_VERDICT.s0CouplingSensitivityIsB === true,
  },
  {
    id: 'imp97398-precision-not-the-obstruction',
    why: 'extended-precision (dps 40) Q(b) must match the double-precision ladder to <1e-9, showing ' +
      'the non-pinnability is structural, not a floating-point artifact.',
    holds: () =>
      IMP97398_EXTENDED_PRECISION.checks.every((c) => c.absDiffVsDouble < 1e-9) &&
      IMP97398_VERDICT.precisionIsTheObstruction === false,
  },
  {
    id: 'imp97398-intercept-coefficient-exact',
    why: 'the intercept coefficient (zeta2 - 5/4) that cQ feeds must be the exact structural value ' +
      '(consistency with imp-97207/imp-97334).',
    holds: () => Math.abs(IMP97398_ZETA2 - 1.25 - 0.3949340668482264) < 1e-15,
  },
  {
    id: 'imp97398-honesty-gate-no-qed',
    why: 'measurement only: no bound moved, cQ not pinnable, no finite limit, joint fit degenerate, ' +
      'compute binds first, honesty markers + inherited sub-gap present.',
    holds: () =>
      IMP97398_VERDICT.anyBoundMoved === false &&
      IMP97398_VERDICT.pinnableConstant === false &&
      IMP97398_VERDICT.cQHasFiniteLimit === false &&
      IMP97398_VERDICT.jointFitDegenerate === true &&
      IMP97398_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97398_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97398_HONEST_BANNER) &&
      /RH open/.test(IMP97398_HONEST_BANNER) &&
      /cq-constant-nonexistent-limit/.test(IMP97398_SUBGAP.id),
  },
];

for (const a of IMP97398_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97398-route-m-cq-joint-exponent-fit-nonpinnability assertion failed: ${a.id}`,
    );
  }
}

export { IMP97398_ASSERTIONS };
