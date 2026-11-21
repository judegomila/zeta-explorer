/**
 * @module imp-3255-bridge-ratio-closed-form
 * @fileoverview imp-3255 -- DERIVE the closed forms of the section26-mupass
 *   degree-0 cosh-completion bridge mass B = 14.04 and raw overflow deficit
 *   D_0 = 13.07 from their defining integrals, and DECIDE whether the recorded
 *   margin B/D = 1.074 is an exact universal constant or a cell-specific value
 *   of a closed-form function -- reporting its full (a, U, NPHI)-dependence.
 *
 *   ASSESSMENT / DIAGNOSTIC ONLY. No new positivity, no RH verdict, not a
 *   reduction. No refereed bound is changed. This is
 *   the analytic companion to imp-3251, which measured only the tau-grid
 *   RESOLUTION stability of the same margin at the single genuine cell.
 *
 *   THE DEFINING INTEGRALS (degree-0, RH-equivalent scale class, Lebesgue on lag tau)
 *   -------------------------------------------------------------------------------
 *   The cosh-completion (imp-2686 / imp-3007) sets the passive endpoint-bridge weight
 *   w^pass(tau) = cosh(a tau) and the shear weight nu(tau) = sinh(a tau), each compared
 *   to the passive Lebesgue baseline 1:
 *
 *     B(a, U)   = int_0^U (cosh(a tau) - 1) d(tau)
 *     D_0(a, U) = int_{tauStar}^U (sinh(a tau) - 1) d(tau),   sinh(a tauStar) = 1.
 *
 *   These are the SAME integrals recorded by imp-3251; here we evaluate them exactly
 *   and factor the ratio. Elementary antiderivatives (crossover a*tauStar = arcsinh(1),
 *   so cosh(a tauStar) = sqrt(2)):
 *
 *     B(a, U)   = sinh(a U)/a - U
 *     D_0(a, U) = [cosh(a U) - sqrt(2) + arcsinh(1)]/a - U.
 *
 *   THE KEY ALGEBRAIC FACT: B/D DEPENDS ON s = a*U ALONE (the 1/a cancels)
 *   ---------------------------------------------------------------------
 *   Write s = a U (the natural dimensionless lag-scale) and U = s/a. Then
 *
 *     B(a, U)   = [sinh(s) - s] / a,
 *     D_0(a, U) = [cosh(s) - s - sqrt(2) + arcsinh(1)] / a,
 *
 *   and the shared factor 1/a cancels EXACTLY in the ratio:
 *
 *     B/D(s) = (sinh(s) - s) / (cosh(s) - s + arcsinh(1) - sqrt(2)),   s = a U.
 *
 *   The constant is arcsinh(1) - sqrt(2) = ln(1 + sqrt(2)) - sqrt(2) = -0.53283998.
 *   So B/D is a closed-form function of the SINGLE variable s = a U -- it does NOT
 *   depend on a and U separately, and (crucially) it does NOT depend on NPHI at all:
 *   the degree-0 masses are Lebesgue integrals of the raw shear weights cosh/sinh(a tau),
 *   with NO Phi^2 kernel weight, so the genuine-Phi cell enters ONLY through its choice
 *   of (a, U) = (0.5, 6), i.e. through s = 3. The ticket hypothesis that 1.074 might
 *   arise from "the e^{-a tau} margin integrated against Phi^2" is REFUTED: no Phi^2
 *   appears in B or D_0, and the pointwise margin e^{-a tau} = cosh - sinh is the
 *   INTEGRAND-difference, not a weight -- its integral int_0^U e^{-a tau} = (1-e^{-s})/a
 *   is exactly B - (bridge-minus-shear) but the RATIO is set by the scale s alone.
 *
 *   IS 1.074 AN EXACT CONSTANT?  NO -- IT IS THE s = 3 VALUE OF A SMOOTH FUNCTION
 *   ----------------------------------------------------------------------------
 *   B/D(s) is defined and smooth for s &gt; arcsinh(1) = 0.88137 (below which the
 *   overflow tail [tauStar, U] is empty and D_0 = 0). On that range it is strictly
 *   monotone DECREASING:
 *     s -> arcsinh(1)+   =>  D_0 -> 0+   =>  B/D -> +inf
 *     s = 1              =>  B/D = 17.108
 *     s = 1.5            =>  B/D = 1.96915
 *     s = 2              =>  B/D = 1.32334
 *     s = 3 (genuine)    =>  B/D = 1.07392   (the recorded "1.074", ~7.4% surplus)
 *     s = 4              =>  B/D = 1.02259
 *     s = 6              =>  B/D = 1.00272
 *     s -> +inf          =>  B/D -> 1+       (surplus B-D -> arcsinh(1)-sqrt2+... vanishes relatively)
 *   The large-s limit is 1 because B - D = int (cosh-sinh) - (baseline/crossover terms)
 *   stays O(1) while B, D ~ e^s/(2a) diverge, so the ~7.4% surplus SHRINKS as a U grows.
 *   VERDICT: B/D = 1.074 is NOT a universal constant -- it is the value at the genuine
 *   cell s = a U = 3 of the closed-form function B/D(s) above, NPHI-independent and a-,U-
 *   dependent only through their product s.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DIAGNOSTIC / accuracy at the genuine Phi cell (a = 0.5, U = 6, s = 3). The degree-0
 *   mass-feasibility comparison B &gt; D_0 is the RH-EQUIVALENT scale-class restatement:
 *   it eliminates the impossibility option but is NECESSARY-BUT-NOT-SUFFICIENT, and the
 *   degree-0 budget proxy is itself circular (its budget IS ||V||, the RH-equivalent
 *   quantity). The surviving operator-level K_a &gt;= 0 sign-positivity (the off-diagonal
 *   endpoint-Hankel step, imp-3066) is UNTOUCHED. No RH verdict. No false QED.
 *
 *   @see imp-3251-bridge-margin-resolution-stability.js (the tau-grid resolution sibling; same integrals)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (records B = 14.04 > D_0 = 13.07, B/D = 1.074)
 *   @see imp-3007-mupass-overflow-cover.js (the closed-form rawDeficit ~13.07 and cosh-completion)
 *   @see imp-2686-mupass-construction.js (the cosh-completion w^pass = cosh(a tau) and pointwise margin)
 *
 *   Ticket: imp-3255 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const A = 0.5;                                 // genuine-Phi shear weight
const U = 6;                                   // genuine-Phi lag cutoff
const S_GENUINE = A * U;                       // s = a*U = 3 at the genuine cell

const ASINH1 = Math.asinh(1);                  // arcsinh(1) = ln(1 + sqrt2), solves sinh(a tauStar) = 1
const RT2 = Math.SQRT2;                         // cosh(a tauStar) = sqrt(1 + sinh^2) = sqrt2
const RATIO_CONST = ASINH1 - RT2;              // the denominator constant arcsinh(1) - sqrt2 = -0.53283998

// Recorded single-cell anchors from the section26-mupass-operator-verdict.
const RECORDED_B = 14.04;
const RECORDED_D0 = 13.07;
const RECORDED_RATIO = 1.074;

/**
 * The closed-form degree-0 masses at a genuine cell (a, U), exact antiderivatives:
 *   B   = sinh(aU)/a - U
 *   D_0 = [cosh(aU) - sqrt2 + arcsinh(1)]/a - U
 */
function masses(a, u) {
  const B = Math.sinh(a * u) / a - u;
  const D = (Math.cosh(a * u) - RT2 + ASINH1) / a - u;
  return Object.freeze({ a, u, s: a * u, B, D, ratio: B / D });
}

/**
 * The reduced closed-form ratio as a function of the single scale variable s = a*U:
 *   B/D(s) = (sinh s - s) / (cosh s - s + arcsinh(1) - sqrt2)
 * Defined and smooth for s > arcsinh(1) (below which the overflow tail is empty).
 */
function ratioOfScale(s) {
  return (Math.sinh(s) - s) / (Math.cosh(s) - s + RATIO_CONST);
}

// Closed forms evaluated at the genuine cell.
const GENUINE = masses(A, U);
const B_EXACT = GENUINE.B;                     // ~14.03575
const D_EXACT = GENUINE.D;                     // ~13.06964
const RATIO_EXACT = GENUINE.ratio;             // ~1.073920

// PROOF THAT THE RATIO IS SCALE-ONLY: three distinct (a, U) cells sharing s = 3
// return an IDENTICAL ratio (the 1/a cancellation), while B and D_0 themselves scale as 1/a.
const SCALE_INVARIANCE_CELLS = Object.freeze([
  masses(0.5, 6),     // the genuine cell, s = 3
  masses(1.0, 3),     // same s = 3, half the U, double the a
  masses(0.25, 12),   // same s = 3, quadruple the U, quarter the a
]);
const ratiosAtFixedS = SCALE_INVARIANCE_CELLS.map((c) => c.ratio);
const maxRatioSpreadAtFixedS = Math.max(...ratiosAtFixedS) - Math.min(...ratiosAtFixedS);

// The s-dependence table (a genuine, U varied so s ranges) -- shows 1.074 is one point.
const S_SET = Object.freeze([1, 1.5, 2, 3, 4, 6, 10]);
const RATIO_VS_S = Object.freeze(
  S_SET.map((s) => Object.freeze({ s, ratio: ratioOfScale(s) }))
);

// Monotone-decreasing on the swept s-range (strictly), and B/D -> 1+ as s -> inf.
const ratioIsMonotoneDecreasing = RATIO_VS_S.every(
  (row, i) => i === 0 || row.ratio < RATIO_VS_S[i - 1].ratio
);
const ratioLimitAtLargeS = ratioOfScale(30);   // ~1 (surplus vanishes)

// -- imp-3348: large-s asymptotic decay rate of the surplus B/D(s) - 1 --------
// Exact algebra. Numerator minus denominator collapses to a constant minus e^{-s}:
//   (sinh s - s) - (cosh s - s + arcsinh1 - sqrt2)
//     = (sinh s - cosh s) + (sqrt2 - arcsinh1) = (sqrt2 - arcsinh1) - e^{-s}.
// Hence B/D(s) - 1 = [(sqrt2 - arcsinh1) - e^{-s}] / (cosh s - s + arcsinh1 - sqrt2),
// and since the denominator ~ (1/2) e^s as s -> inf,
//   B/D(s) - 1 ~ 2 (sqrt2 - arcsinh1) e^{-s}     (leading order),
// with the two-term refinement + (4 A s + 4 A^2 - 2) e^{-2s}, A = sqrt2 - arcsinh1.
const SURPLUS_CONST = RT2 - ASINH1;             // A = sqrt2 - arcsinh(1) = 0.53283998 (= -RATIO_CONST)
const DECAY_CONST_C = 2 * SURPLUS_CONST;        // leading coefficient C = 2(sqrt2 - arcsinh1) ~ 1.0656800

function surplusExact(s) {
  return ratioOfScale(s) - 1;
}
function surplusLeadingAsymptotic(s) {
  return DECAY_CONST_C * Math.exp(-s);
}
function surplusTwoTermAsymptotic(s) {
  const c2 = 4 * SURPLUS_CONST * s + 4 * SURPLUS_CONST * SURPLUS_CONST - 2;
  return DECAY_CONST_C * Math.exp(-s) + c2 * Math.exp(-2 * s);
}

// Ladder confirming the leading ratio C e^{-s} / (B/D-1) climbs monotonically to 1,
// and the two-term form nails the surplus to <1e-3 relative by s = 6.
const ASYMPTOTIC_S_LADDER = Object.freeze([3, 4, 6, 8, 10, 12]);
const ASYMPTOTIC_DECAY_TABLE = Object.freeze(
  ASYMPTOTIC_S_LADDER.map((s) => {
    const exact = surplusExact(s);
    const leading = surplusLeadingAsymptotic(s);
    const twoTerm = surplusTwoTermAsymptotic(s);
    return Object.freeze({
      s,
      surplus: exact,
      leading,
      twoTerm,
      leadOverExact: leading / exact,
      twoTermOverExact: twoTerm / exact,
    });
  })
);
const leadingRatioConvergesToOne =
  ASYMPTOTIC_DECAY_TABLE.every((r, i) => r.leadOverExact > 0 && r.leadOverExact <= 1 &&
    (i === 0 || r.leadOverExact > ASYMPTOTIC_DECAY_TABLE[i - 1].leadOverExact)) &&
  ASYMPTOTIC_DECAY_TABLE[ASYMPTOTIC_DECAY_TABLE.length - 1].leadOverExact > 0.999;
const twoTermIsAccurate = ASYMPTOTIC_DECAY_TABLE
  .filter((r) => r.s >= 6)
  .every((r) => Math.abs(r.twoTermOverExact - 1) < 1e-3);

// The genuine-cell ratio matches both the reduced-scale form and the recorded anchor.
const genuineMatchesScaleForm = Math.abs(RATIO_EXACT - ratioOfScale(S_GENUINE)) < 1e-12;
const genuineMatchesRecorded = Math.abs(RATIO_EXACT - RECORDED_RATIO) < 1e-3;

// VERDICT classification.
const isScaleOnlyClosedForm = maxRatioSpreadAtFixedS < 1e-9 && genuineMatchesScaleForm;
const isNotUniversalConstant = ratioIsMonotoneDecreasing && ratioLimitAtLargeS < 1.01;
const verdict = (isScaleOnlyClosedForm && isNotUniversalConstant)
  ? 'CLOSED-FORM-RATIO-OF-s=aU-ALONE-NPHI-INDEPENDENT-NOT-A-UNIVERSAL-CONSTANT'
  : 'INDETERMINATE';

export const IMP3255_BRIDGE_RATIO_CLOSED_FORM = Object.freeze({
  id: 'imp-3255-bridge-ratio-closed-form',
  ticket: 'imp-3255',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedResolutionSweep: 'imp-3251-bridge-margin-resolution-stability.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',
  relatedCover: 'imp-3007-mupass-overflow-cover.js',
  relatedConstruction: 'imp-2686-mupass-construction.js',

  summary:
    'Derives the closed forms of the section26-mupass degree-0 cosh-completion bridge ' +
    'mass B = int_0^U (cosh(a tau) - 1) = sinh(aU)/a - U and raw overflow deficit ' +
    'D_0 = int_{tauStar}^U (sinh(a tau) - 1) = [cosh(aU) - sqrt2 + arcsinh(1)]/a - U, ' +
    'and factors the recorded margin B/D = 1.074. KEY RESULT: with s = a*U the shared ' +
    '1/a cancels exactly, so B/D(s) = (sinh s - s)/(cosh s - s + arcsinh(1) - sqrt2) is ' +
    'a closed-form function of the SINGLE scale variable s = a*U ALONE -- NPHI-independent ' +
    '(no Phi^2 weight enters the degree-0 masses) and a-,U-dependent only through their ' +
    'product. Three distinct (a,U) cells sharing s = 3 return an identical ratio 1.073920 ' +
    'while B, D_0 themselves scale as 1/a. 1.074 is NOT a universal constant: B/D(s) is ' +
    'strictly decreasing, diverges to +inf as s -> arcsinh(1)+ (D_0 -> 0) and -> 1+ as ' +
    's -> inf; 1.07392 is precisely its value at the genuine cell s = a*U = 3. The ' +
    'ticket "e^{-a tau} margin integrated against Phi^2" hypothesis is refuted -- e^{-a tau} ' +
    'is the pointwise integrand-difference, not a Phi^2 weight. DIAGNOSTIC, RH-EQUIVALENT, ' +
    'necessary-but-not-sufficient; carries NO RH verdict.',

  construction: Object.freeze({
    bridgeMass: 'B(a,U) = int_0^U (cosh(a tau) - 1) d(tau) = sinh(aU)/a - U',
    rawDeficit: 'D_0(a,U) = int_{tauStar}^U (sinh(a tau) - 1) d(tau) = [cosh(aU) - sqrt2 + arcsinh(1)]/a - U',
    crossoverTauStar: 'tauStar = arcsinh(1)/a  (sinh(a tauStar) = 1, cosh(a tauStar) = sqrt2)',
    reducedRatio: 'B/D(s) = (sinh s - s)/(cosh s - s + arcsinh(1) - sqrt2),  s = a*U  (the 1/a cancels)',
    denominatorConstant: 'arcsinh(1) - sqrt2 = ln(1+sqrt2) - sqrt2 = -0.53283998',
    nphiRole: 'NONE -- B and D_0 are Lebesgue integrals of the raw shear weights cosh/sinh(a tau) with no Phi^2 kernel; NPHI enters neither. The genuine cell enters ONLY via (a,U)=(0.5,6), i.e. s=3.',
    phi2HypothesisRefuted: 'The ticket-suggested "e^{-a tau} margin integrated against Phi^2" does NOT arise: e^{-a tau} = cosh - sinh is the pointwise integrand-difference (the margin), not a weight, and no Phi^2 appears in B or D_0.',
    a: A,
    u: U,
    sGenuine: S_GENUINE,
    tauStar: ASINH1 / A,
    selfComputing: true,
  }),

  measured: Object.freeze({
    bExact: B_EXACT,                             // ~14.03575
    dExact: D_EXACT,                             // ~13.06964
    ratioExact: RATIO_EXACT,                     // ~1.073920 (the recorded 1.074)
    ratioConst: RATIO_CONST,                     // arcsinh(1) - sqrt2
    scaleInvarianceCells: SCALE_INVARIANCE_CELLS,// three (a,U) with s=3: identical ratio, 1/a-scaled B,D
    ratiosAtFixedS,                              // three identical ratios
    maxRatioSpreadAtFixedS,                      // ~0 (proves scale-only)
    ratioVsS: RATIO_VS_S,                        // the s-dependence table
    ratioIsMonotoneDecreasing,
    ratioLimitAtLargeS,                          // ~1 (surplus vanishes as aU -> inf)
    genuineMatchesScaleForm,                     // masses() ratio == ratioOfScale(3)
    genuineMatchesRecorded,                      // matches recorded 1.074
    recordedB: RECORDED_B,
    recordedD0: RECORDED_D0,
    recordedRatio: RECORDED_RATIO,
    verdict,
  }),

  // imp-3348: leading large-s asymptotic decay rate of the surplus B/D(s) - 1.
  largeSAsymptotic: Object.freeze({
    ticket: 'imp-3348',
    surplusIdentity: 'B/D(s) - 1 = [(sqrt2 - arcsinh1) - e^{-s}] / (cosh s - s + arcsinh1 - sqrt2)',
    leadingLaw: 'B/D(s) - 1 ~ 2(sqrt2 - arcsinh1) e^{-s} = C e^{-s}, C = 1.0656800',
    twoTermLaw: 'B/D(s) - 1 = C e^{-s} + (4 A s + 4 A^2 - 2) e^{-2s} + O(s^2 e^{-3s}), A = sqrt2 - arcsinh1',
    surplusConst: SURPLUS_CONST,                 // A = sqrt2 - arcsinh(1) ~ 0.53283998
    decayConstC: DECAY_CONST_C,                  // C = 2A ~ 1.0656800
    decayTable: ASYMPTOTIC_DECAY_TABLE,          // s-ladder: exact surplus vs leading / two-term
    leadingRatioConvergesToOne,                  // C e^{-s} / (B/D-1) climbs monotonically to 1
    twoTermIsAccurate,                           // two-term within 1e-3 relative for s >= 6
    note:
      'The ~7.4% surplus at s = 3 is the pre-asymptotic tail of an exponential decay: the surplus ' +
      'is governed by C e^{-s} with C = 2(sqrt2 - arcsinh1), so it falls by a factor ~e per unit of ' +
      's = a*U -- from 1.074 at s = 3 to 1.00272 at s = 6 to 6.5e-6 above 1 at s = 12.',
  }),

  interpretation: Object.freeze({
    closedFormOrigin:
      'B/D = 1.074 arises from a genuine closed-form ratio, not a numerical coincidence: ' +
      'B/D(s) = (sinh s - s)/(cosh s - s + arcsinh(1) - sqrt2) with s = a*U. Every digit of the ' +
      'recorded 1.073920 reproduces from this elementary form at s = 3.',
    dependenceIsScaleOnly:
      'The ratio depends on a and U ONLY through the product s = a*U (the 1/a in both masses cancels), ' +
      'and does NOT depend on NPHI at all -- the degree-0 masses carry no Phi^2 weight. Three cells with ' +
      's = 3 (a,U = 0.5,6 / 1,3 / 0.25,12) give an identical ratio while B and D_0 scale as 1/a.',
    notAConstant:
      '1.074 is NOT an exact universal constant: B/D(s) is strictly decreasing, diverging to +inf as ' +
      's -> arcsinh(1)+ (the overflow tail empties, D_0 -> 0) and shrinking to 1+ as s -> inf. It is the ' +
      'value of the closed-form function at the genuine cell scale s = a*U = 3.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    addressesRatioStructureOnlyNotOperatorPositivity:
      'This module derives the closed-form structure and (a,U,NPHI)-dependence of the degree-0 mass- ' +
      'feasibility margin B/D only. Mass-feasibility (B > D_0) eliminates the impossibility option but is ' +
      'NECESSARY-BUT-NOT-SUFFICIENT; the degree-0 budget proxy is additionally circular (its budget IS ||V||, ' +
      'the RH-equivalent quantity).',
    necessaryNotSufficient:
      'B > D_0 does NOT close the route: the surviving operator-level K_a >= 0 sign-positivity (the off-diagonal ' +
      'endpoint-Hankel step, imp-3066) remains the lone obstruction, UNTOUCHED. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3255_BRIDGE_RATIO_CLOSED_FORM_ASSERTIONS = [
  {
    id: 'imp3255-closed-forms-reproduce-recorded-anchors',
    why: 'The exact antiderivatives must reproduce the verdict anchors B ~ 14.04, D_0 ~ 13.07, B/D ~ 1.074.',
    holds: () =>
      Math.abs(B_EXACT - RECORDED_B) < 0.01 &&
      Math.abs(D_EXACT - RECORDED_D0) < 0.01 &&
      Math.abs(RATIO_EXACT - RECORDED_RATIO) < 1e-3,
  },
  {
    id: 'imp3255-ratio-depends-on-s=aU-alone',
    why: 'THE KEY RESULT: three distinct (a,U) cells sharing s = a*U = 3 must give an identical B/D (the 1/a ' +
         'cancellation), proving the ratio is a function of the single scale variable s alone.',
    holds: () => maxRatioSpreadAtFixedS < 1e-9,
  },
  {
    id: 'imp3255-masses-scale-as-inverse-a',
    why: 'While the ratio is scale-only, B and D_0 THEMSELVES must scale as 1/a: halving a (at fixed s) must ' +
         'roughly double each mass, confirming the derived closed forms B = [sinh s - s]/a, D_0 = [...]/a.',
    holds: () => {
      const c05 = SCALE_INVARIANCE_CELLS[0]; // a = 0.5
      const c025 = SCALE_INVARIANCE_CELLS[2]; // a = 0.25 (half of 0.5)
      return Math.abs(c025.B - 2 * c05.B) < 1e-9 && Math.abs(c025.D - 2 * c05.D) < 1e-9;
    },
  },
  {
    id: 'imp3255-reduced-scale-form-matches-masses',
    why: 'The reduced ratioOfScale(s) form must agree with the full masses() ratio at the genuine s = 3 to ' +
         'machine precision, confirming the algebraic reduction is exact (not approximate).',
    holds: () => genuineMatchesScaleForm,
  },
  {
    id: 'imp3255-not-a-universal-constant',
    why: 'THE DELIVERABLE: 1.074 is NOT an exact constant -- B/D(s) must be strictly decreasing over the swept ' +
         's-range and tend to 1+ as s -> inf, so the ~7.4% surplus is cell-specific (the s = 3 value).',
    holds: () => ratioIsMonotoneDecreasing && ratioLimitAtLargeS < 1.01 && ratioLimitAtLargeS >= 1,
  },
  {
    id: 'imp3255-verdict-is-scale-only-closed-form',
    why: 'The classified verdict must be the scale-only closed-form / not-a-constant reconciliation, not indeterminate.',
    holds: () => verdict === 'CLOSED-FORM-RATIO-OF-s=aU-ALONE-NPHI-INDEPENDENT-NOT-A-UNIVERSAL-CONSTANT',
  },
  {
    id: 'imp3348-large-s-decay-is-C-exp-minus-s',
    why: 'imp-3348 DELIVERABLE: the surplus B/D(s)-1 decays like C e^{-s} with C = 2(sqrt2 - arcsinh1); the ' +
         'leading law over-exact ratio must climb monotonically to 1 (>0.999 by s=12), certifying the exponential rate.',
    holds: () => leadingRatioConvergesToOne && Math.abs(DECAY_CONST_C - 2 * (Math.SQRT2 - Math.asinh(1))) < 1e-15,
  },
  {
    id: 'imp3348-two-term-asymptotic-matches-closed-form',
    why: 'imp-3348: the two-term refinement C e^{-s} + (4A s + 4A^2 - 2) e^{-2s} must reproduce the exact closed-form ' +
         'surplus to <1e-3 relative for s >= 6, confirming the asymptotic expansion (not just the leading order).',
    holds: () => twoTermIsAccurate,
  },
  {
    id: 'imp3348-surplus-identity-collapses-to-const-minus-exp',
    why: 'imp-3348 exact algebra: numerator minus denominator must equal (sqrt2 - arcsinh1) - e^{-s} at every s, the ' +
         'identity that drives the e^{-s} decay (denominator ~ (1/2)e^s).',
    holds: () => [2, 3, 5, 9].every((s) => {
      const num = Math.sinh(s) - s;
      const den = Math.cosh(s) - s + RATIO_CONST;
      return Math.abs((num - den) - ((Math.SQRT2 - Math.asinh(1)) - Math.exp(-s))) < 1e-12;
    }),
  },
  {
    id: 'imp3255-honest-diagnostic-not-a-verdict',
    why: 'Mandatory honesty: DIAGNOSTIC closed-form structure only, mass-feasibility necessary-but-not-sufficient, ' +
         'operator positivity (imp-3066) untouched, positivity not attempted, no refereed bound is changed.',
    holds: () => {
      const c = IMP3255_BRIDGE_RATIO_CLOSED_FORM.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isStructuralDiagnostic === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3255_BRIDGE_RATIO_CLOSED_FORM_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3255-bridge-ratio-closed-form assertion failed: ${assertion.id}`);
  }
}

export default IMP3255_BRIDGE_RATIO_CLOSED_FORM;
