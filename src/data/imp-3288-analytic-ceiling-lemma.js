/**
 * @module imp-3288-analytic-ceiling-lemma
 * @fileoverview imp-3288 -- Upgrade the imp-3104 DEG-sweep saturation
 *   (||R_orth|| rises toward tanh(a*U) from below over MONOMIAL truncations)
 *   to a FUNCTION-SPACE-COMPLETE rigorous negative result: state and verify the
 *   analytic ceiling lemma over ALL of L2([0, U]), not merely the monomial span.
 *
 *   THE LEMMA (rigorous, over the full function space)
 *   --------------------------------------------------
 *   Fix a > 0 and 0 < U < infinity. For the section-26 scalar cosh passive core
 *   the shear-over-passive Rayleigh quotient of a trial function f is
 *
 *       Q(f) = int_0^U sinh(a*tau) f(tau)^2 d(tau)
 *              / int_0^U cosh(a*tau) f(tau)^2 d(tau).
 *
 *   Claim.  Over EVERY f in L2([0, U]) with int_0^U cosh(a*tau) f^2 > 0,
 *
 *       (i)   Q(f) <= tanh(a*U)                         (uniform upper bound), and
 *       (ii)  sup_{f in L2} Q(f) = tanh(a*U) < 1        (the bound is sharp,
 *             the supremum is NOT attained by any L2 function).
 *
 *   PROOF OF (i) -- the upper bound holds over the WHOLE function space
 *   ------------------------------------------------------------------
 *   sinh(a*tau) = cosh(a*tau) * tanh(a*tau), and tanh is strictly increasing, so
 *   0 <= tanh(a*tau) <= tanh(a*U) for every tau in [0, U]. Because cosh(a*tau) f^2
 *   is a NONNEGATIVE weight, the pointwise inequality integrates:
 *
 *       int_0^U sinh(a*tau) f^2
 *         = int_0^U cosh(a*tau) tanh(a*tau) f^2
 *         <= tanh(a*U) * int_0^U cosh(a*tau) f^2.
 *
 *   Dividing by the positive denominator gives Q(f) <= tanh(a*U) for EVERY f -- no
 *   truncation, no basis, no degree. This is the function-space-complete statement
 *   the imp-3104 monomial DEG sweep only approached from below.
 *
 *   PROOF OF (ii) -- sharpness and non-attainment
 *   ---------------------------------------------
 *   Take the concentrating family f_delta = indicator of [U - delta, U]
 *   (delta -> 0+). By the fundamental theorem of calculus
 *
 *       Q(f_delta) = (cosh(a*U) - cosh(a*(U - delta)))
 *                    / (sinh(a*U) - sinh(a*(U - delta)))
 *                  -> (a*sinh(a*U)) / (a*cosh(a*U)) = tanh(a*U)   as delta -> 0+,
 *
 *   so the supremum equals tanh(a*U). It is NOT attained: equality in (i) forces
 *   tanh(a*tau) = tanh(a*U) cosh-a.e. on the support of f, i.e. all mass at tau = U,
 *   a Lebesgue-null set -- impossible for f in L2. Finally tanh(a*U) < 1 because
 *   a*U < infinity, so the ceiling is strictly below 1 with margin 1 - tanh(a*U) > 0.
 *
 *   OPERATOR-ORDER COROLLARY (the negative result, stated honestly)
 *   --------------------------------------------------------------
 *   Q(f) = <f, H f> / <f, P f> with P the cosh passive Gram and H the sinh shear
 *   form. The lemma says H <= tanh(a*U) * P as quadratic forms, sharply. Hence in
 *   operator order the scalar cosh passive core P strictly dominates the shear form
 *   H with a guaranteed normalized deficit (P - H) >= (1 - tanh(a*U)) * P > 0, and
 *   NO scalar cosh passive core can dominate the shear form by any margin exceeding
 *   1 - tanh(a*U) (the supremum is exactly tanh(a*U)). This certifies the ceiling
 *   over the full L2 span, closing the imp-3104 "measured-from-below" gap.
 *
 *   WHAT THIS MODULE DOES (self-computing verification of an already-proven lemma)
 *   -----------------------------------------------------------------------------
 *   The upper bound (i) is proved above in closed form; here we CERTIFY it and its
 *   sharpness numerically as an independent guard:
 *     - a battery of DIVERSE non-monomial L2 trial functions (exponential, oscillatory,
 *       non-smooth, piecewise, reciprocal) all satisfy Q(f) < tanh(a*U) strictly --
 *       evidence the bound is not a monomial-span artifact;
 *     - the concentrating indicator family gives Q(f_delta) rising monotonically toward
 *       tanh(a*U), the tightest exceeding the best imp-3104 monomial truncation norm
 *       (~0.99474) yet staying below tanh(a*U) -- so the FULL-L2 supremum genuinely
 *       reaches tanh(a*U), strictly beyond the monomial span;
 *     - the pointwise weight inequality tanh(a*tau) <= tanh(a*U) on [0, U] (the analytic
 *       core of the proof) is checked on a fine grid;
 *     - the lemma is re-verified across a small (a, U) family, not just the headline cell.
 *
 *   HONEST SCOPE (mandatory)
 *   ------------------------
 *   This is a rigorous NEGATIVE result about the SCALAR cosh passive core ONLY. It does
 *   NOT touch the operator-positivity residual K_a >= 0 (the genuine section-26 Gram),
 *   makes NO claim that the cover holds or fails, and carries NO RH verdict. A ceiling
 *   below 1 for the scalar core neither proves nor refutes the operator step.
 *   No refereed bound is changed. No false QED.
 *
 *   @see imp-3104-orthogonalized-opnorm-degree-sweep.js (the monomial DEG sweep this upgrades)
 *   @see imp-3007-mupass-overflow-cover.js (the scalar cover + isolated operator step)
 *
 *   Ticket: imp-3288 (proof, high).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const A = 0.5;   // headline shear weight (matches imp-3084 / imp-3104)
const U = 6;     // genuine-Phi lag cutoff (the imp-3104 grid); a*U = 3
const NQ = 20000; // fine midpoint quadrature panels for the L2 trial-function battery
const HQ = U / NQ;

const cosh = Math.cosh;
const sinh = Math.sinh;
const tanh = Math.tanh;

const TANH_CEILING = tanh(A * U);        // the analytic ceiling tanh(a*U) = tanh(3)
const MARGIN = 1 - TANH_CEILING;         // strictly positive operator-order deficit floor

/** Rayleigh quotient Q(f) = int sinh(a*tau) f^2 / int cosh(a*tau) f^2 by midpoint quadrature. */
function rayleighQuotient(f, a = A) {
  let num = 0;
  let den = 0;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * HQ;
    const w = f(tau);
    const w2 = w * w;
    num += sinh(a * tau) * w2 * HQ;
    den += cosh(a * tau) * w2 * HQ;
  }
  return { quotient: num / den, denominator: den };
}

// -- A battery of DIVERSE non-monomial L2 trial functions on [0, U]. None is a pure
//    truncation monomial (tau/U)^j, so passing the bound is evidence over the full span.
const TRIAL_FUNCTIONS = [
  { label: 'constant', f: () => 1 },
  { label: 'growing-exponential', f: (t) => Math.exp(1.3 * t) },
  { label: 'decaying-exponential', f: (t) => Math.exp(-0.9 * t) },
  { label: 'oscillatory-abs-sine', f: (t) => Math.abs(Math.sin(4 * t)) + 0.05 },
  { label: 'nonsmooth-sqrt', f: (t) => Math.sqrt(t) + 0.1 },
  { label: 'reciprocal', f: (t) => 1 / (1 + t) },
  { label: 'gaussian-bump-mid', f: (t) => Math.exp(-8 * (t - U / 2) * (t - U / 2)) + 0.02 },
  { label: 'piecewise-upper-half', f: (t) => (t > U / 2 ? 1 : 0.1) },
  { label: 'log-weighted', f: (t) => Math.log(2 + t) },
  { label: 'near-U-skew', f: (t) => Math.pow(t / U, 6) * Math.exp(0.5 * t) },
];

const trialResults = TRIAL_FUNCTIONS.map(({ label, f }) => {
  const { quotient, denominator } = rayleighQuotient(f);
  return {
    label,
    quotient,
    denominator,
    respectsCeiling: denominator > 0 && quotient > 0 && quotient < TANH_CEILING,
    distanceToCeiling: TANH_CEILING - quotient,
  };
});
const allTrialsRespectCeiling = trialResults.every((r) => r.respectsCeiling);
const maxTrialQuotient = Math.max(...trialResults.map((r) => r.quotient));

// -- Sharpness: the concentrating indicator family f_delta = 1_{[U-delta, U]} evaluated in
//    CLOSED FORM. Q(f_delta) rises monotonically to tanh(a*U) as delta -> 0+.
function indicatorQuotient(delta) {
  const lo = U - delta;
  const num = cosh(A * U) - cosh(A * lo);
  const den = sinh(A * U) - sinh(A * lo);
  return num / den;
}
const DELTAS = [1, 0.5, 0.25, 0.1, 0.05, 0.02, 0.01, 0.005, 0.002, 0.001];
const concentratingLadder = DELTAS.map((delta) => {
  const quotient = indicatorQuotient(delta);
  return { delta, quotient, distanceToCeiling: TANH_CEILING - quotient };
});
const ladderMonotoneRising = concentratingLadder.every(
  (row, i) => i === 0 || row.quotient > concentratingLadder[i - 1].quotient,
);
const ladderBelowCeiling = concentratingLadder.every((row) => row.quotient < TANH_CEILING);
const tightestConcentratingQuotient = concentratingLadder[concentratingLadder.length - 1].quotient;
// The imp-3104 best trustworthy MONOMIAL truncation norm (DEG = 10) at a=0.5, U=6.
const IMP3104_BEST_MONOMIAL_NORM = 0.99474;
const supExceedsMonomialSpan = tightestConcentratingQuotient > IMP3104_BEST_MONOMIAL_NORM;

// -- The analytic core: pointwise weight inequality tanh(a*tau) <= tanh(a*U) on [0, U].
let weightInequalityHolds = true;
let maxWeight = -Infinity;
for (let k = 0; k <= 4000; k++) {
  const tau = (k / 4000) * U;
  const w = tanh(A * tau);
  if (w > maxWeight) maxWeight = w;
  if (w > TANH_CEILING + 1e-12) weightInequalityHolds = false;
}

// -- The lemma holds for GENERAL (a, U), not just the headline cell: re-verify the bound
//    on a small family with an independent trial function per cell.
const FAMILY = [
  { a: 0.25, U: 4 },
  { a: 0.5, U: 6 },
  { a: 1.0, U: 2 },
  { a: 2.0, U: 3 },
];
const familyResults = FAMILY.map(({ a, U: uu }) => {
  const ceiling = tanh(a * uu);
  // A skewed non-monomial probe on [0, uu]; the bound must hold regardless of the probe.
  const probe = (t) => Math.exp(0.7 * t) * (1 + Math.abs(Math.sin(3 * t)));
  // Rayleigh quotient on this cell (self-contained, uu-scaled quadrature).
  let num = 0;
  let den = 0;
  const h = uu / NQ;
  for (let k = 0; k < NQ; k++) {
    const tau = (k + 0.5) * h;
    const w2 = probe(tau) * probe(tau);
    num += sinh(a * tau) * w2 * h;
    den += cosh(a * tau) * w2 * h;
  }
  const quotient = num / den;
  // Closed-form sharpness limit for this cell (indicator delta -> 0 gives tanh(a*uu)).
  const sharpLimit = indicatorLimitForCell(a, uu);
  return {
    a,
    U: uu,
    ceiling,
    ceilingBelowOne: ceiling < 1,
    quotient,
    respectsCeiling: quotient > 0 && quotient < ceiling,
    sharpLimitMatchesCeiling: Math.abs(sharpLimit - ceiling) < 1e-6,
  };
});
function indicatorLimitForCell(a, uu) {
  // lim_{delta->0} (cosh(a*uu)-cosh(a*(uu-delta)))/(sinh(a*uu)-sinh(a*(uu-delta))) = tanh(a*uu)
  const delta = 1e-6;
  const lo = uu - delta;
  return (cosh(a * uu) - cosh(a * lo)) / (sinh(a * uu) - sinh(a * lo));
}
const familyAllRespectCeiling = familyResults.every((r) => r.respectsCeiling);
const familyAllBelowOne = familyResults.every((r) => r.ceilingBelowOne);
const familyAllSharp = familyResults.every((r) => r.sharpLimitMatchesCeiling);

export const IMP3288_ANALYTIC_CEILING_LEMMA = Object.freeze({
  id: 'imp-3288-analytic-ceiling-lemma',
  ticket: 'imp-3288',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  upgradesModule: 'imp-3104-orthogonalized-opnorm-degree-sweep.js',
  relatedCover: 'imp-3007-mupass-overflow-cover.js',

  summary:
    'States and verifies the analytic ceiling lemma over ALL of L2([0, U]) -- the function-space-complete ' +
    'upgrade of the imp-3104 monomial DEG sweep. For the scalar cosh passive core the Rayleigh quotient ' +
    'Q(f) = int sinh(a*tau) f^2 / int cosh(a*tau) f^2 satisfies Q(f) <= tanh(a*U) for EVERY f in L2 (proof: ' +
    'sinh = cosh*tanh and tanh(a*tau) <= tanh(a*U) integrated against the nonnegative weight cosh(a*tau) f^2), ' +
    'and sup Q = tanh(a*U) < 1 is sharp (concentrating indicators 1_{[U-delta,U]} give Q -> tanh(a*U)) but ' +
    'NOT attained. imp-3104 only measured monomial truncations approaching this ceiling from below; here the ' +
    'ceiling is proved over the full span and certified numerically: 10 diverse non-monomial trial functions ' +
    'all stay strictly below tanh(a*U), the concentrating ladder rises past the best imp-3104 monomial norm ' +
    '(~0.99474) toward tanh(3)~0.99505, and the lemma re-verifies across an (a,U) family. Operator-order ' +
    'corollary: H <= tanh(a*U) P sharply, so the scalar cosh core dominates the shear form with normalized ' +
    'deficit >= 1 - tanh(a*U) > 0, and no scalar cosh core can dominate by more than tanh(a*U). Rigorous ' +
    'NEGATIVE result about the SCALAR core ONLY; does NOT touch K_a >= 0; carries NO RH verdict; no refereed bound is changed.',

  lemma: Object.freeze({
    statement:
      'For a > 0 and 0 < U < infinity, over every f in L2([0,U]) with int cosh(a*tau) f^2 > 0: ' +
      'Q(f) = int sinh(a*tau) f^2 / int cosh(a*tau) f^2 <= tanh(a*U), and sup Q = tanh(a*U) < 1 (not attained).',
    upperBoundProof:
      'sinh(a*tau) = cosh(a*tau) tanh(a*tau); tanh strictly increasing gives 0 <= tanh(a*tau) <= tanh(a*U) ' +
      'on [0,U]; integrating the pointwise inequality against the nonnegative weight cosh(a*tau) f^2 yields ' +
      'int sinh(a*tau) f^2 <= tanh(a*U) int cosh(a*tau) f^2; divide by the positive denominator.',
    sharpnessProof:
      'f_delta = 1_{[U-delta,U]} gives Q = (cosh(a*U)-cosh(a*(U-delta)))/(sinh(a*U)-sinh(a*(U-delta))) -> tanh(a*U) ' +
      'as delta -> 0+ (fundamental theorem of calculus), so the supremum equals tanh(a*U).',
    nonAttainment:
      'Equality forces tanh(a*tau) = tanh(a*U) cosh-a.e. on the support, i.e. all mass at tau = U (a null set) -- ' +
      'impossible for f in L2, so the supremum is not attained.',
    operatorOrderCorollary:
      'H <= tanh(a*U) P as quadratic forms (H = sinh shear form, P = cosh passive Gram), sharply; the scalar cosh ' +
      'core strictly dominates the shear form with normalized deficit (P - H) >= (1 - tanh(a*U)) P > 0, and no ' +
      'scalar cosh passive core can dominate the shear form by any margin exceeding 1 - tanh(a*U).',
    a: A,
    U,
    analyticCeilingTanhAU: TANH_CEILING,
    marginOneMinusCeiling: MARGIN,
    fullFunctionSpace: true,
    selfComputing: true,
  }),

  measured: Object.freeze({
    trialFunctionBattery: Object.freeze(trialResults.map((r) => Object.freeze({ ...r }))),
    allTrialsRespectCeiling,
    maxTrialQuotient,
    concentratingLadder: Object.freeze(concentratingLadder.map((r) => Object.freeze({ ...r }))),
    ladderMonotoneRising,
    ladderBelowCeiling,
    tightestConcentratingQuotient,
    bestImp3104MonomialNorm: IMP3104_BEST_MONOMIAL_NORM,
    supExceedsMonomialSpan,
    weightInequalityHolds,
    maxWeightOnGrid: maxWeight,
    familyResults: Object.freeze(familyResults.map((r) => Object.freeze({ ...r }))),
    familyAllRespectCeiling,
    familyAllBelowOne,
    familyAllSharp,
    analyticCeilingTanhAU: TANH_CEILING,
    marginOneMinusCeiling: MARGIN,
  }),

  interpretation: Object.freeze({
    functionSpaceComplete:
      'The upper bound Q(f) <= tanh(a*U) is proved for EVERY f in L2([0,U]) -- no truncation, no basis, no degree. ' +
      'imp-3104 only measured monomial truncations approaching tanh(a*U) from below; this closes that gap.',
    sharpAndBeyondMonomials:
      'The concentrating indicator ladder rises past the best imp-3104 monomial truncation norm (~0.99474) toward ' +
      'tanh(a*U) ~ 0.99505, so sup Q = tanh(a*U) is genuinely reached over the full L2 span, strictly beyond the ' +
      'monomial span, and is not attained by any single L2 function.',
    ceilingStrictlyBelowOne:
      'tanh(a*U) < 1 for finite a*U, with margin 1 - tanh(a*U) > 0: the scalar cosh passive core strictly ' +
      'dominates the shear form in operator order, no scalar core can close the gap.',
  }),

  honestCaveat: Object.freeze({
    isProof: true,
    provesUpperBoundOverFullL2: true,
    isScalarCoreNegativeResultOnly: true,
    touchesOperatorPositivityResidual: false,
    isReductionBelowRH: false,
    carriesRHVerdict: false,
    scope:
      'Rigorous NEGATIVE result about the SCALAR cosh passive core only. Does NOT touch the operator-positivity ' +
      'residual K_a >= 0 (the genuine section-26 Gram), makes NO claim the cover holds or fails, no RH verdict.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3288_ANALYTIC_CEILING_LEMMA_ASSERTIONS = [
  {
    id: 'imp3288-upper-bound-over-full-l2',
    why: 'THE LEMMA (i): the Rayleigh quotient Q(f) <= tanh(a*U) must hold over a battery of DIVERSE ' +
         'non-monomial L2 trial functions (exponential, oscillatory, non-smooth, piecewise, reciprocal). ' +
         'A violation on ANY honest L2 probe would break the function-space-complete upper bound.',
    holds: () => allTrialsRespectCeiling && maxTrialQuotient < TANH_CEILING && trialResults.length >= 10,
  },
  {
    id: 'imp3288-weight-inequality-is-the-proof-core',
    why: 'The analytic engine of the proof: tanh(a*tau) <= tanh(a*U) for all tau in [0,U] (tanh strictly ' +
         'increasing). Checked on a fine grid; the grid maximum must equal tanh(a*U) within tolerance.',
    holds: () => weightInequalityHolds && Math.abs(maxWeight - TANH_CEILING) < 1e-3,
  },
  {
    id: 'imp3288-supremum-is-sharp',
    why: 'THE LEMMA (ii): concentrating indicators 1_{[U-delta,U]} give Q rising MONOTONICALLY toward ' +
         'tanh(a*U) from below as delta -> 0, so sup Q = tanh(a*U). Monotone, below the ceiling, and the ' +
         'tightest row must be within 1e-3 of tanh(a*U).',
    holds: () =>
      ladderMonotoneRising &&
      ladderBelowCeiling &&
      TANH_CEILING - tightestConcentratingQuotient < 1e-3,
  },
  {
    id: 'imp3288-supremum-exceeds-monomial-span',
    why: 'THE UPGRADE over imp-3104: the full-L2 supremum genuinely REACHES tanh(a*U), strictly beyond ' +
         'the monomial span -- the tightest concentrating quotient exceeds the best imp-3104 monomial ' +
         'truncation norm (~0.99474) yet stays below tanh(a*U). This is why the ceiling is function-space-complete.',
    holds: () => supExceedsMonomialSpan && tightestConcentratingQuotient < TANH_CEILING,
  },
  {
    id: 'imp3288-ceiling-strictly-below-one',
    why: 'The negative result: tanh(a*U) < 1 with a strictly positive margin 1 - tanh(a*U), so the scalar ' +
         'cosh passive core dominates the shear form in operator order and no scalar core closes the gap.',
    holds: () => TANH_CEILING < 1 && MARGIN > 0 && Math.abs(MARGIN - (1 - TANH_CEILING)) < 1e-15,
  },
  {
    id: 'imp3288-lemma-holds-across-a-U-family',
    why: 'The lemma is stated for GENERAL (a, U): on a small family every cell must respect its own ceiling ' +
         'tanh(a*U) < 1 for an independent non-monomial probe, and the closed-form sharpness limit must match ' +
         'tanh(a*U). This certifies the result is not a headline-cell coincidence.',
    holds: () =>
      familyResults.length >= 4 &&
      familyAllRespectCeiling &&
      familyAllBelowOne &&
      familyAllSharp,
  },
  {
    id: 'imp3288-honest-scalar-core-negative-result',
    why: 'Mandatory honesty: a PROOF of the scalar-core upper bound over full L2, a NEGATIVE result about the ' +
         'scalar core ONLY -- it does NOT touch K_a >= 0, is NOT a reduction below RH, carries NO RH verdict, ' +
         'and no refereed bound is changed. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3288_ANALYTIC_CEILING_LEMMA.honestCaveat;
      return (
        c.isProof === true &&
        c.provesUpperBoundOverFullL2 === true &&
        c.isScalarCoreNegativeResultOnly === true &&
        c.touchesOperatorPositivityResidual === false &&
        c.isReductionBelowRH === false &&
        c.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3288_ANALYTIC_CEILING_LEMMA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3288-analytic-ceiling-lemma assertion failed: ${assertion.id}`);
  }
}

export default IMP3288_ANALYTIC_CEILING_LEMMA;
