/**
 * @module imp-3423-onset-pade-denominator-poles
 * @fileoverview imp-3423 -- Tabulate the EXACT denominator pole/root locations of
 *   the imp-3383 higher-order Pade approximants of the imp-3064 onset signature
 *   S(eps) = phi(s0+eps) eps^2 / C = 1 + A1 eps + A2 eps^2 + A3 eps^3 + ...,
 *   to confirm QUANTITATIVELY that NO positive-eps (onset-side) singularity is
 *   being resummed by any of them.
 *
 *   BACKGROUND. imp-3383 built the [2/1], [1/2] and [2/2] Pade approximants from
 *   the closed-form onset data {1, A1, A2, A3, A4} and asserted -- without listing
 *   the actual root coordinates -- that the [2/1] has a single REAL pole at
 *   eps ~ -2.851 and that the [1/2]/[2/2] denominators have COMPLEX roots (negative
 *   discriminant). This module SOLVES each denominator polynomial and reports every
 *   pole/root with its distance from the origin and the sign of its real part.
 *
 *   MEASURED ROOTS (denominator D(eps)=0 for each approximant).
 *     [1/1] (imp-3325, reference) D = 1 + c11 eps
 *         real pole eps = -1.25393386           |eps| = 1.25393386   (NEGATIVE)
 *     [2/1] D = 1 + q1 eps
 *         real pole eps = -2.85073508           |eps| = 2.85073508   (NEGATIVE)
 *     [1/2] D = 1 + q1 eps + q2 eps^2   (discriminant -0.64108 < 0)
 *         complex pair eps = -1.23989842 +/- 1.39902199 i
 *         |eps| = 1.86938776   real part NEGATIVE
 *     [2/2] D = 1 + q1 eps + q2 eps^2   (discriminant -0.15219 < 0)
 *         complex pair eps = -2.52260225 +/- 2.10817127 i
 *         |eps| = 3.28753832   real part NEGATIVE
 *
 *   VERDICT. Every denominator root of every approximant lies strictly in the
 *   LEFT half-plane (real part < 0); the two real poles sit on the negative-eps
 *   axis and the two complex pairs have negative real parts. NOT ONE lies on the
 *   positive-eps (onset-side) axis, and none lies in the right half-plane at all.
 *   The nearest singularity to the origin among all four is the [1/1] pole at
 *   |eps| ~ 1.254; the higher-order poles are all farther out. This quantitatively
 *   confirms the imp-3383 assertion (and the imp-3325 structural conclusion) that
 *   phi is regular on the onset side -- the Pade gain is global rational
 *   tail-shaping toward the negative axis, not the capture of a physical
 *   positive-eps pole.
 *
 *   For a complex conjugate pair that solves q2 eps^2 + q1 eps + 1 = 0 the product
 *   of the roots equals 1/q2, so |eps|^2 = 1/q2; this module cross-checks the
 *   directly-computed modulus against sqrt(1/q2) to ~1e-12.
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   DEGREE-0 SCALAR DIAGNOSTIC ONLY, RH-EQUIVALENT, NOT THE OPERATOR STEP. This
 *   only locates the denominator roots of a rational reconstruction of the imp-3064
 *   scalar onset signature; it neither proves nor weakens RH. The off-diagonal
 *   endpoint-Hankel operator step (imp-3066) remains the lone obstruction and is
 *   untouched. Measurement only, no QED. Platt-Trudgian Lambda &lt;= 0.2 REMAINS
 *   the rigorous SOTA.
 *
 *   @see imp-3383-onset-third-order-higher-pade.js (imp-3383: builds [2/1],[1/2],[2/2])
 *   @see imp-3325-onset-pade-resummation.js (imp-3325: the [1/1] Pade, pole -1.254)
 *   @see imp-3064-deficit-excess-fraction-grid.js (imp-3064: the a*U scale invariant + phi)
 *
 *   Ticket: imp-3423 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

const ASINH1 = Math.asinh(1);   // s0: sinh(s0) = 1, cosh(s0) = sqrt(2)
const SQRT2 = Math.SQRT2;

// imp-3155 / imp-3222 / imp-3383 closed-form onset-signature coefficients.
const G0 = 1 - ASINH1;                                          // G(s0)
const A1 = (SQRT2 - 1) / G0 - SQRT2 / 6;                        // ~ +3.25605
const A2 = -(2 * SQRT2 - 1) / (6 * G0) - 1 / 36;                // ~ -2.59666
const A3 = (2 * SQRT2 + 1) / (36 * G0) + 11 * SQRT2 / 1080;     // ~ +0.91088
const A4 = (SQRT2 - 1) / G0 * (-1 / 36 - 19 * SQRT2 / 1080) - 7 / 6480; // ~ -0.18495

// -- Denominator coefficients of each approximant (from imp-3383) -------------
// [1/1] (imp-3325): D = 1 + c11 eps, c11 = -A2/A1.
const C11 = -A2 / A1;
// [2/1]: D = 1 + q1 eps, q1 = -A3/A2.
const Q1_21 = -A3 / A2;
// [1/2]: D = 1 + q1 eps + q2 eps^2.
const Q1_12 = (A1 * A2 - A3) / (A2 - A1 * A1);
const Q2_12 = -(A2 + A1 * Q1_12);
// [2/2]: D = 1 + q1 eps + q2 eps^2 (uses A4).
const DET_22 = A2 * A2 - A1 * A3;
const Q1_22 = (-A2 * A3 + A1 * A4) / DET_22;
const Q2_22 = (-A2 * A4 + A3 * A3) / DET_22;

// -- Root solvers -------------------------------------------------------------
// Linear denominator 1 + q eps = 0  ->  eps = -1/q.
const linearRoot = (q) => -1 / q;
// Quadratic denominator 1 + q1 eps + q2 eps^2 = 0.
//   disc = q1^2 - 4 q2 ; disc<0 => complex conjugate pair.
const quadRoots = (q1, q2) => {
  const disc = q1 * q1 - 4 * q2;
  if (disc >= 0) {
    const r1 = (-q1 + Math.sqrt(disc)) / (2 * q2);
    const r2 = (-q1 - Math.sqrt(disc)) / (2 * q2);
    return { complex: false, disc, real: [r1, r2], modulus: [Math.abs(r1), Math.abs(r2)] };
  }
  const re = -q1 / (2 * q2);
  const im = Math.sqrt(-disc) / (2 * q2);   // +/- this imaginary part
  const modulus = Math.hypot(re, im);
  return { complex: true, disc, re, imAbs: Math.abs(im), modulus, modFromProduct: Math.sqrt(1 / q2) };
};

const POLE_11 = linearRoot(C11);   // ~ -1.25393386
const POLE_21 = linearRoot(Q1_21); // ~ -2.85073508
const ROOTS_12 = quadRoots(Q1_12, Q2_12);
const ROOTS_22 = quadRoots(Q1_22, Q2_22);

// Published numeric anchors (certified below).
const POLE_11_ANCHOR = -1.2539338585011468;
const POLE_21_ANCHOR = -2.850735084591746;
const RE_12_ANCHOR = -1.2398984197037755;
const IM_12_ANCHOR = 1.3990219860274482;
const MOD_12_ANCHOR = 1.8693877630315507;
const RE_22_ANCHOR = -2.522602250792592;
const IM_22_ANCHOR = 2.108171274284546;
const MOD_22_ANCHOR = 3.287538324859861;

export const IMP3423_ONSET_PADE_DENOMINATOR_POLES = Object.freeze({
  id: 'imp-3423-onset-pade-denominator-poles',
  ticket: 'imp-3423',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedHigherPade: 'imp-3383-onset-third-order-higher-pade.js',
  relatedPade11: 'imp-3325-onset-pade-resummation.js',

  summary:
    'Tabulates the EXACT denominator pole/root locations of the imp-3383 [2/1], [1/2], [2/2] ' +
    'Pade approximants (plus the imp-3325 [1/1] reference) of the imp-3064 onset signature. The ' +
    '[1/1] pole is at eps ~ -1.25393, the [2/1] pole at eps ~ -2.85074 (both real, negative), the ' +
    '[1/2] denominator has a complex pair eps ~ -1.23990 +/- 1.39902 i (|eps| ~ 1.86939) and the ' +
    '[2/2] a complex pair eps ~ -2.52260 +/- 2.10817 i (|eps| ~ 3.28754). EVERY root has real ' +
    'part < 0: not one lies on the positive-eps (onset-side) axis or anywhere in the right ' +
    'half-plane, quantitatively confirming imp-3383/imp-3325 that phi is regular on the onset side. ' +
    'RH-EQUIVALENT; degree-0 scalar diagnostic only; NOT the operator step.',

  denominatorRoots: Object.freeze({
    pade11: Object.freeze({
      form: 'D(eps) = 1 + c1 eps',
      c1: C11,
      realPole: POLE_11,
      absPole: Math.abs(POLE_11),
      realPartSign: POLE_11 < 0 ? 'negative' : 'positive',
      anchor: POLE_11_ANCHOR,
      note: 'imp-3325 [1/1] reference; NEAREST singularity to the origin among all four.',
    }),
    pade21: Object.freeze({
      form: 'D(eps) = 1 + q1 eps',
      q1: Q1_21,
      realPole: POLE_21,
      absPole: Math.abs(POLE_21),
      realPartSign: POLE_21 < 0 ? 'negative' : 'positive',
      anchor: POLE_21_ANCHOR,
      note: 'Single real pole on the NEGATIVE-eps axis, farther out than the [1/1] pole.',
    }),
    pade12: Object.freeze({
      form: 'D(eps) = 1 + q1 eps + q2 eps^2',
      q1: Q1_12, q2: Q2_12,
      discriminant: ROOTS_12.disc,
      complex: ROOTS_12.complex,
      realPart: ROOTS_12.re,
      imagPartAbs: ROOTS_12.imAbs,
      modulus: ROOTS_12.modulus,
      modulusFromProduct: ROOTS_12.modFromProduct,
      realPartSign: ROOTS_12.re < 0 ? 'negative' : 'positive',
      reAnchor: RE_12_ANCHOR, imAnchor: IM_12_ANCHOR, modAnchor: MOD_12_ANCHOR,
      note: 'Complex conjugate pair, negative real part -- no positive-eps root.',
    }),
    pade22: Object.freeze({
      form: 'D(eps) = 1 + q1 eps + q2 eps^2  [uses A4]',
      q1: Q1_22, q2: Q2_22,
      discriminant: ROOTS_22.disc,
      complex: ROOTS_22.complex,
      realPart: ROOTS_22.re,
      imagPartAbs: ROOTS_22.imAbs,
      modulus: ROOTS_22.modulus,
      modulusFromProduct: ROOTS_22.modFromProduct,
      realPartSign: ROOTS_22.re < 0 ? 'negative' : 'positive',
      reAnchor: RE_22_ANCHOR, imAnchor: IM_22_ANCHOR, modAnchor: MOD_22_ANCHOR,
      note: 'Complex conjugate pair, negative real part -- farthest singularity of the four.',
    }),
  }),

  verdict: Object.freeze({
    everyRootHasNegativeRealPart: true,
    anyPositiveEpsSingularity: false,
    nearestSingularityAbs: Math.abs(POLE_11),  // ~1.254, the [1/1] pole
    nearestSingularityApproximant: '[1/1]',
    statement:
      'Every denominator root of the [1/1], [2/1], [1/2] and [2/2] approximants lies strictly in ' +
      'the LEFT half-plane (real part < 0): two real poles on the negative-eps axis (-1.254, ' +
      '-2.851) and two complex conjugate pairs with negative real parts (|eps| ~ 1.869 and 3.288). ' +
      'NONE lies on the positive-eps (onset-side) axis or in the right half-plane, so no onset-side ' +
      'singularity is being resummed -- quantitatively confirming imp-3383/imp-3325 that phi is ' +
      'regular on the onset side.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    operatorStepUntouched:
      'Locates the denominator roots of a rational reconstruction of the imp-3064 degree-0 scalar ' +
      'onset signature; the off-diagonal endpoint-Hankel operator step (imp-3066) remains the lone ' +
      'obstruction and is NOT addressed.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3423_ONSET_PADE_DENOMINATOR_POLES_ASSERTIONS = [
  {
    id: 'imp3423-pade11-real-pole-negative',
    why: 'The [1/1] denominator 1 + c1 eps must have its single real pole at eps ~ -1.25393 on the ' +
         'NEGATIVE axis; a positive value would put an onset-side singularity into the reference.',
    holds: () => POLE_11 < 0 && Math.abs(POLE_11 - POLE_11_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3423-pade21-real-pole-negative',
    why: 'The [2/1] denominator 1 + q1 eps must have its single real pole at eps ~ -2.85074 on the ' +
         'NEGATIVE axis, farther from the origin than the [1/1] pole.',
    holds: () =>
      POLE_21 < 0 && Math.abs(POLE_21 - POLE_21_ANCHOR) < 1e-10 &&
      Math.abs(POLE_21) > Math.abs(POLE_11),
  },
  {
    id: 'imp3423-pade12-roots-complex-negative-real-part',
    why: 'The [1/2] denominator must have a negative-discriminant (complex) conjugate pair whose ' +
         'real part is NEGATIVE (~-1.23990) and modulus ~1.86939, i.e. no positive-eps root.',
    holds: () =>
      ROOTS_12.complex && ROOTS_12.re < 0 &&
      Math.abs(ROOTS_12.re - RE_12_ANCHOR) < 1e-10 &&
      Math.abs(ROOTS_12.imAbs - IM_12_ANCHOR) < 1e-10 &&
      Math.abs(ROOTS_12.modulus - MOD_12_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3423-pade22-roots-complex-negative-real-part',
    why: 'The [2/2] denominator must have a negative-discriminant (complex) conjugate pair whose ' +
         'real part is NEGATIVE (~-2.52260) and modulus ~3.28754, the farthest singularity of the four.',
    holds: () =>
      ROOTS_22.complex && ROOTS_22.re < 0 &&
      Math.abs(ROOTS_22.re - RE_22_ANCHOR) < 1e-10 &&
      Math.abs(ROOTS_22.imAbs - IM_22_ANCHOR) < 1e-10 &&
      Math.abs(ROOTS_22.modulus - MOD_22_ANCHOR) < 1e-10,
  },
  {
    id: 'imp3423-complex-modulus-matches-root-product',
    why: 'For a complex pair solving q2 eps^2 + q1 eps + 1 = 0 the product of roots is 1/q2, so ' +
         '|eps| must equal sqrt(1/q2); the directly-computed modulus must match this to ~1e-12 for ' +
         'both [1/2] and [2/2], guarding against an arithmetic slip in the root solver.',
    holds: () =>
      Math.abs(ROOTS_12.modulus - ROOTS_12.modFromProduct) < 1e-12 &&
      Math.abs(ROOTS_22.modulus - ROOTS_22.modFromProduct) < 1e-12,
  },
  {
    id: 'imp3423-no-positive-eps-singularity',
    why: 'The headline structural finding: EVERY denominator root (both real poles and both complex ' +
         'pairs) must have real part < 0, so no positive-eps (onset-side) singularity is resummed -- ' +
         'confirming imp-3383/imp-3325 that phi is regular on the onset side.',
    holds: () => POLE_11 < 0 && POLE_21 < 0 && ROOTS_12.re < 0 && ROOTS_22.re < 0,
  },
  {
    id: 'imp3423-nearest-singularity-is-pade11',
    why: 'Among all four approximants the nearest singularity to the origin must be the [1/1] pole ' +
         '(|eps| ~ 1.254); the higher-order poles/roots (2.851, 1.869, 3.288) are all farther out.',
    holds: () => {
      const nearest = Math.abs(POLE_11);
      return nearest < Math.abs(POLE_21) && nearest < ROOTS_12.modulus && nearest < ROOTS_22.modulus;
    },
  },
  {
    id: 'imp3423-honest-rh-equivalent-not-a-reduction',
    why: 'Mandatory honesty: this is a root-location measurement, RH-EQUIVALENT, structural/diagnostic, ' +
         'leaves the operator step untouched, is not a proof, not a reduction below RH, and PT 0.2 ' +
         'stays SOTA. If any of these flip the module over-claims.',
    holds: () => {
      const c = IMP3423_ONSET_PADE_DENOMINATOR_POLES.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.isStructuralDiagnostic === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const a of IMP3423_ONSET_PADE_DENOMINATOR_POLES_ASSERTIONS) {
  if (!a.holds()) throw new Error(`imp-3423-onset-pade-denominator-poles assertion failed: ${a.id}`);
}

export default IMP3423_ONSET_PADE_DENOMINATOR_POLES;
