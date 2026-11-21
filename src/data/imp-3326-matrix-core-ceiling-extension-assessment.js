/**
 * @module imp-3326-matrix-core-ceiling-extension-assessment
 * @fileoverview imp-3326 -- Assess whether the imp-3288 L2-complete analytic
 *   ceiling Q(f) &lt;= tanh(a*U) &lt; 1 (sharp, non-attained) for the SCALAR cosh
 *   passive core extends to the RANK-2 MATRIX passive core (the imp-3214 ported
 *   half), or whether the matrix core admits a strictly larger shear-over-passive
 *   Rayleigh supremum.
 *
 *   THE ASSESSMENT RESOLVES TO A DICHOTOMY -- THE ANSWER DEPENDS ON WHICH
 *   "MATRIX SHEAR" IS MEANT, AND THE TWO OBJECTS ARE STRUCTURALLY DIFFERENT
 *   ---------------------------------------------------------------------------
 *   imp-3288 proves, over ALL of L2([0,U]), that for the SCALAR forms
 *     H_scal = multiplication by sinh(a*tau)  (SYMMETRIC, POSITIVE)
 *     P_scal = multiplication by cosh(a*tau)  (SYMMETRIC, POSITIVE)
 *   the generalized Rayleigh quotient Q(f) = &lt;f,H_scal f&gt; / &lt;f,P_scal f&gt;
 *   satisfies Q(f) &lt;= tanh(a*U) &lt; 1, sharp but not attained. Equivalently
 *   tanh(a*U) = ||P_scal^{-1/2} H_scal P_scal^{-1/2}|| = sup-norm of sinh/cosh
 *   = tanh(a*tau) on [0,U].
 *
 *   imp-3214 ports a DIFFERENT object: the symmetric partial-isometry
 *   normalization R = Gpass^{-1/2} Gshear Gpass^{-1/2} of the rank-2
 *   ANTISYMMETRIC de Branges Wronskian Gshear = q(x)p - p(x)q, with
 *   p = Phi cosh(a t), q = Phi sinh(a t). Two facts make the transfer NOT
 *   automatic:
 *     (a) Gshear is ANTISYMMETRIC, so its numerical range on real trial
 *         functions is IDENTICALLY ZERO -- &lt;f, Gshear f&gt; = 0 for every real f.
 *         There is no Rayleigh quotient to bound: the matrix normalization is
 *         governed by SINGULAR values, not by a quadratic form.
 *     (b) The imp-3214 core Gpass = |Gshear| is TUNED to the numerator (its own
 *         polar modulus), whereas the scalar core P_scal = cosh is a FIXED
 *         weight not adapted to the shear.
 *
 *   READING 1 -- FAITHFUL SYMMETRIC-FORM MATRIX RAYLEIGH (ceiling EXTENDS)
 *   --------------------------------------------------------------------
 *   The faithful matrix analogue of imp-3288 keeps the SAME two symmetric forms
 *   H_scal, P_scal and asks for the generalized Rayleigh supremum over a
 *   finite-dimensional (matrix) trial space -- here the natural rank-2 span
 *   V = span{p, q} of imp-3214. Compress:
 *     A = [ &lt;p,H_scal p&gt;  &lt;p,H_scal q&gt; ;  &lt;q,H_scal p&gt;  &lt;q,H_scal q&gt; ]  (2x2 sym)
 *     B = [ &lt;p,P_scal p&gt;  &lt;p,P_scal q&gt; ;  &lt;q,P_scal p&gt;  &lt;q,P_scal q&gt; ]  (2x2 sym, pos)
 *   The matrix generalized Rayleigh supremum is lambda_max(A,B), the top
 *   generalized eigenvalue = ||B^{-1/2} A B^{-1/2}||. RIGOROUS UPPER BOUND: every
 *   vector-valued trial x = alpha p + beta q is an honest L2([0,U]) function, so
 *   the scalar lemma applies verbatim: &lt;x,H_scal x&gt;/&lt;x,P_scal x&gt; &lt;= tanh(a*U).
 *   Taking the sup over the 2D subspace preserves the bound:
 *     lambda_max(A,B) = sup_{x in V} Q(x) &lt;= sup_{f in L2} Q(f) = tanh(a*U).
 *   So under the faithful reading the ceiling EXTENDS to the matrix core as a
 *   genuine upper bound, and (V being a fixed 2D subspace that excludes the
 *   near-endpoint concentrating extremizers) it lands STRICTLY BELOW tanh(a*U).
 *   The matrix Rayleigh sup does NOT exceed the scalar ceiling.
 *
 *   READING 2 -- imp-3214 ANTISYMMETRIC-WRONSKIAN POLAR CORE (ceiling EXCEEDED,
 *   but TAUTOLOGICALLY)
 *   --------------------------------------------------------------------------
 *   If instead "matrix passive core" means the imp-3214 polar core Gpass =
 *   |Gshear| of the ANTISYMMETRIC Wronskian, the symmetric normalization gives
 *   ||R|| = ||Gpass^{-1/2} Gshear Gpass^{-1/2}|| = 1.0000 EXACTLY -- a partial
 *   isometry. This STRICTLY EXCEEDS the scalar ceiling tanh(a*U) &lt; 1 (by the
 *   margin 1 - tanh(a*U) &gt; 0). But the excess is the trivial polar-decomposition
 *   tautology (any operator normalized by its own modulus has normalized norm 1),
 *   NOT a genuine strengthening of shear-over-passive domination. It reflects the
 *   antisymmetry of Gshear and the numerator-tuning of the core, both absent from
 *   the scalar setting.
 *
 *   VERDICT (assessment, RH-equivalent, NO QED)
 *   -------------------------------------------
 *   The scalar ceiling tanh(a*U) is NOT a universal invariant one can quote for
 *   "the matrix core" without saying which object is meant:
 *     - As a bound on the SAME symmetric sinh/cosh forms compressed to any matrix
 *       trial space, it EXTENDS verbatim (sup &lt;= tanh(a*U); strictly below for the
 *       rank-2 span) -- the ceiling holds, never exceeded.
 *     - As the normalized norm of the imp-3214 ANTISYMMETRIC Wronskian against its
 *       OWN polar core, the supremum is exactly 1 &gt; tanh(a*U) -- exceeded, but only
 *       by the partial-isometry tautology, carrying no extra domination content.
 *   Neither reading yields a shear-over-passive supremum ABOVE 1, and no
 *   symmetric-positive matrix compression violates the scalar tanh(a*U) bound. The
 *   K_a &gt;= 0 operator-positivity step (the imp-3066 endpoint-Hankel obstruction)
 *   is UNTOUCHED. RH-equivalent negative-result scope. No refereed bound is changed
 *   . No reduction, no positivity, no QED.
 *
 *   @see imp-3288-analytic-ceiling-lemma.js (the scalar-core L2 ceiling this extends)
 *   @see imp-3214-mupass-symmetric-normalization-port.js (the rank-2 matrix core / polar normalization)
 *   @see imp-3066 (the endpoint-Hankel operator-positivity obstruction, still open)
 *
 *   Ticket: imp-3326 (proof, medium).
 */

import { IMP3288_ANALYTIC_CEILING_LEMMA } from './imp-3288-analytic-ceiling-lemma.js';
import { IMP3214_MUPASS_SYMMETRIC_NORMALIZATION_PORT } from './imp-3214-mupass-symmetric-normalization-port.js';

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (the imp-3214 grid)
const A = 0.5;   // headline shear weight (the genuine-Phi cell)
const U = 6;     // genuine-Phi lag cutoff (the headline cell); a*U = 3
const N = 2000;  // tau-grid panels on [0, U]

const cosh = Math.cosh;
const sinh = Math.sinh;
const tanh = Math.tanh;

// The scalar-core analytic ceiling, taken from the imp-3288 record (cross-checked below).
const TANH_CEILING = IMP3288_ANALYTIC_CEILING_LEMMA.lemma.analyticCeilingTanhAU; // tanh(3)
const CEILING_CROSS_CHECK = Math.abs(TANH_CEILING - tanh(A * U)) < 1e-12;
// The imp-3214 full-core polar normalization anchor (the ||R|| = 1.0000 tautology).
const MATRIX_POLAR_NORM = IMP3214_MUPASS_SYMMETRIC_NORMALIZATION_PORT.measured.fullCoreSymmetricNorm;

/** de Bruijn-Newman completed-Riemann kernel truncated at n = NPHI (same as imp-3214). */
function phiKernel(uu) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

const HGRID = U / N;
const p = new Float64Array(N); // p = Phi cosh(a t)  (the rank-2 span basis, imp-3214)
const q = new Float64Array(N); // q = Phi sinh(a t)
const wSinh = new Float64Array(N); // multiplication weight sinh(a tau) (scalar shear form)
const wCosh = new Float64Array(N); // multiplication weight cosh(a tau) (scalar passive form)
for (let i = 0; i < N; i++) {
  const t = (i + 0.5) * HGRID;
  const phi = phiKernel(t);
  p[i] = phi * cosh(A * t);
  q[i] = phi * sinh(A * t);
  wSinh[i] = sinh(A * t);
  wCosh[i] = cosh(A * t);
}

// -- READING 1: compress the SYMMETRIC scalar forms H_scal = sinh(a tau)*,
//    P_scal = cosh(a tau)* onto the rank-2 span V = span{p, q}. Both 2x2 blocks
//    are symmetric; B is positive definite. Entries via midpoint quadrature.
function symFormBlock(weight) {
  let m00 = 0;
  let m01 = 0;
  let m11 = 0;
  for (let i = 0; i < N; i++) {
    const wv = weight[i] * HGRID;
    m00 += wv * p[i] * p[i];
    m01 += wv * p[i] * q[i];
    m11 += wv * q[i] * q[i];
  }
  return { m00, m01, m11 };
}
const A_block = symFormBlock(wSinh); // compression of the sinh shear form
const B_block = symFormBlock(wCosh); // compression of the cosh passive form (pos def)

/**
 * Top generalized eigenvalue lambda_max(A, B) of two symmetric 2x2 blocks with B
 * positive definite, i.e. the largest root of det(A - lambda B) = 0. This is the
 * matrix generalized Rayleigh supremum sup_x &lt;x,A x&gt;/&lt;x,B x&gt; over x in R^2.
 */
function topGeneralizedEigenvalue2x2(Ab, Bb) {
  // det(A - lambda B) = (a00 - l b00)(a11 - l b11) - (a01 - l b01)^2 = 0
  // => alpha lambda^2 - beta lambda + gamma = 0 with:
  const alpha = Bb.m00 * Bb.m11 - Bb.m01 * Bb.m01;             // det B > 0
  const beta = Ab.m00 * Bb.m11 + Ab.m11 * Bb.m00 - 2 * Ab.m01 * Bb.m01;
  const gamma = Ab.m00 * Ab.m11 - Ab.m01 * Ab.m01;            // det A
  const disc = Math.sqrt(Math.max(0, beta * beta - 4 * alpha * gamma));
  return (beta + disc) / (2 * alpha);
}
const matrixRayleighSup = topGeneralizedEigenvalue2x2(A_block, B_block);
// Rigorous: matrixRayleighSup &lt;= tanh(a*U) (scalar lemma over the 2D subspace),
// and strictly below (fixed span excludes the concentrating extremizers).
const reading1RespectsCeiling = matrixRayleighSup > 0 && matrixRayleighSup < TANH_CEILING;
const reading1MarginBelowCeiling = TANH_CEILING - matrixRayleighSup;

// -- READING 2: the imp-3214 antisymmetric-Wronskian polar core gives ||R|| = 1
//    EXACTLY, which strictly exceeds tanh(a*U).
const reading2ExceedsCeiling = MATRIX_POLAR_NORM > TANH_CEILING + 1e-9;
const reading2ExcessOverCeiling = MATRIX_POLAR_NORM - TANH_CEILING;

// -- Neither reading breaks the trivial ceiling 1 (both are &lt;= 1 up to rounding).
const neitherExceedsOne = matrixRayleighSup <= 1 + 1e-9 && MATRIX_POLAR_NORM <= 1 + 1e-6;

export const IMP3326_MATRIX_CORE_CEILING_EXTENSION_ASSESSMENT = Object.freeze({
  id: 'imp-3326-matrix-core-ceiling-extension-assessment',
  ticket: 'imp-3326',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extendsScalarCeiling: 'imp-3288-analytic-ceiling-lemma.js',
  matrixCoreSource: 'imp-3214-mupass-symmetric-normalization-port.js',
  operatorObstruction: 'imp-3066 (endpoint-Hankel operator positivity, open)',

  summary:
    'Assesses whether the imp-3288 scalar-core ceiling Q(f) &lt;= tanh(a*U) &lt; 1 extends to the rank-2 matrix ' +
    'passive core (imp-3214). Resolves to a DICHOTOMY driven by which "matrix shear" is meant. READING 1 ' +
    '(faithful): keep the SAME symmetric forms H_scal = sinh*, P_scal = cosh* and compress to the rank-2 span ' +
    'V = span{p,q}; the matrix generalized Rayleigh supremum lambda_max(A,B) is &lt;= tanh(a*U) RIGOROUSLY (every ' +
    'x = alpha p + beta q is an L2 function so the scalar lemma applies) and lands STRICTLY BELOW it for the ' +
    'fixed 2D span -- the ceiling EXTENDS, never exceeded. READING 2 (imp-3214): the ANTISYMMETRIC Wronskian ' +
    'Gshear normalized by its OWN polar core Gpass = |Gshear| gives ||R|| = 1.0000 EXACTLY, which strictly ' +
    'EXCEEDS tanh(a*U) -- but only via the partial-isometry tautology (Gshear has ZERO numerical range on real ' +
    'trial functions; its normalization is a singular-value fact, not a Rayleigh bound), carrying no extra ' +
    'domination content. Neither reading exceeds the trivial norm 1. The K_a &gt;= 0 operator step (imp-3066 ' +
    'endpoint-Hankel) is untouched. RH-equivalent, no QED; no refereed bound is changed.',

  construction: Object.freeze({
    scalarForms: 'H_scal = multiplication by sinh(a tau) (sym pos), P_scal = multiplication by cosh(a tau) (sym pos)',
    matrixSpan: 'V = span{p, q}, p = Phi cosh(a t), q = Phi sinh(a t) -- the imp-3214 rank-2 span',
    reading1: 'lambda_max(A,B), top generalized eigenvalue of the 2x2 symmetric compressions A (sinh) and B (cosh)',
    reading1Bound: 'every x = alpha p + beta q is in L2, so &lt;x,A x&gt;/&lt;x,B x&gt; &lt;= tanh(a*U); sup over V preserves it',
    reading2: 'imp-3214 ||R|| = ||Gpass^{-1/2} Gshear Gpass^{-1/2}|| with Gpass = |Gshear| (antisymmetric Wronskian)',
    reading2Value: 'partial isometry, ||R|| = 1.0000 exactly (polar-decomposition tautology)',
    a: A,
    U,
    N,
    NPHI,
    quadrature: 'midpoint, N panels on [0, U]; exact 2x2 generalized-eigenvalue solve on the rank-2 span',
    selfComputing: true,
  }),

  measured: Object.freeze({
    analyticCeilingTanhAU: TANH_CEILING,
    ceilingCrossCheck: CEILING_CROSS_CHECK,
    // Reading 1 -- faithful symmetric-form matrix Rayleigh supremum on V.
    matrixRayleighSupReading1: matrixRayleighSup,
    reading1RespectsCeiling,
    reading1MarginBelowCeiling,
    gramSinhBlock: Object.freeze({ ...A_block }),
    gramCoshBlock: Object.freeze({ ...B_block }),
    // Reading 2 -- imp-3214 antisymmetric-Wronskian polar-core normalization.
    matrixPolarNormReading2: MATRIX_POLAR_NORM,
    reading2ExceedsCeiling,
    reading2ExcessOverCeiling,
    neitherExceedsOne,
  }),

  interpretation: Object.freeze({
    ceilingExtendsUnderFaithfulReading:
      'For the SAME symmetric sinh/cosh forms compressed to any matrix trial space, the scalar ceiling is a ' +
      'universal upper bound: lambda_max(A,B) &lt;= tanh(a*U) because each vector-valued trial function lives in ' +
      'L2 and the imp-3288 lemma is pointwise over L2. On the fixed rank-2 span it lands strictly below.',
    ceilingExceededOnlyTautologically:
      'The imp-3214 polar-core normalization of the ANTISYMMETRIC Wronskian gives ||R|| = 1 &gt; tanh(a*U), but this ' +
      'is the trivial partial-isometry ceiling (any operator normalized by its own modulus has norm 1) and does ' +
      'NOT signify stronger shear domination -- Gshear has zero numerical range on real trial functions.',
    whyTheProofDoesNotTransferMechanically:
      'The scalar lemma bounds a SYMMETRIC-POSITIVE quadratic form by pointwise weight domination; the matrix ' +
      'shear Gshear is ANTISYMMETRIC, so there is no positive quadratic form to bound and the relevant quantity ' +
      'is a singular value. The two objects coincide only after one fixes which matrix shear is meant.',
    obstructionUnchanged:
      'Neither reading touches the K_a &gt;= 0 operator-positivity residual (the imp-3066 endpoint-Hankel step), ' +
      'which remains the RH-equivalent obstruction. Assessment only.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    provesReading1UpperBound: true,
    reading1CeilingExtends: true,
    reading2ExceedsButTautological: true,
    isReductionBelowRH: false,
    rhEquivalent: true,
    touchesOperatorPositivityResidual: false,
    carriesRHVerdict: false,
    scope:
      'Assessment of whether the scalar tanh(a*U) ceiling extends to the rank-2 matrix core. Faithful ' +
      'symmetric-form reading: extends (sup &lt;= tanh(a*U), strictly below on the rank-2 span), with a rigorous ' +
      'upper-bound argument. imp-3214 antisymmetric-Wronskian reading: normalized norm is exactly 1 &gt; tanh(a*U) ' +
      'but only via the partial-isometry tautology. Does NOT touch K_a &gt;= 0; no reduction; no RH verdict.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3326_MATRIX_CORE_CEILING_EXTENSION_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp3326-scalar-ceiling-cross-check',
    why: 'The assessment anchors to the imp-3288 scalar ceiling tanh(a*U); it must equal tanh(3) and match the ' +
         'imp-3288 record within tolerance so the comparison is against the genuine ceiling.',
    holds: () => CEILING_CROSS_CHECK && Math.abs(TANH_CEILING - tanh(3)) < 1e-12 && TANH_CEILING < 1,
  },
  {
    id: 'imp3326-reading1-matrix-rayleigh-respects-scalar-ceiling',
    why: 'READING 1 (faithful): the matrix generalized Rayleigh supremum lambda_max(A,B) over the rank-2 span ' +
         'must respect the scalar ceiling -- rigorously &lt;= tanh(a*U) (every trial vector is an L2 function) and ' +
         'STRICTLY below for the fixed 2D span. A value at or above tanh(a*U) would contradict the imp-3288 lemma.',
    holds: () => reading1RespectsCeiling && matrixRayleighSup > 0 && matrixRayleighSup < TANH_CEILING,
  },
  {
    id: 'imp3326-reading2-polar-core-exceeds-ceiling-tautologically',
    why: 'READING 2 (imp-3214): the antisymmetric-Wronskian polar core gives ||R|| = 1.0000 exactly, which ' +
         'STRICTLY EXCEEDS tanh(a*U) &lt; 1. This is the partial-isometry tautology, and it must reproduce the ' +
         'imp-3214 full-core anchor to 1e-6.',
    holds: () =>
      reading2ExceedsCeiling &&
      Math.abs(MATRIX_POLAR_NORM - 1) < 1e-6 &&
      reading2ExcessOverCeiling > 0,
  },
  {
    id: 'imp3326-neither-reading-exceeds-trivial-norm-one',
    why: 'Both matrix quantities are normalized operator norms, so neither may exceed the trivial ceiling 1 ' +
         '(up to rounding). If either blew past 1 the compression / normalization would be mis-assembled.',
    holds: () => neitherExceedsOne,
  },
  {
    id: 'imp3326-honest-assessment-no-qed',
    why: 'Mandatory honesty: an ASSESSMENT (not a proof of RH), dual-reading verdict, RH-equivalent, does NOT ' +
         'touch K_a &gt;= 0, carries NO RH verdict, no refereed bound is changed. If any flip the module is over-claiming.',
    holds: () => {
      const c = IMP3326_MATRIX_CORE_CEILING_EXTENSION_ASSESSMENT.honestCaveat;
      return (
        c.isProof === false &&
        c.provesReading1UpperBound === true &&
        c.reading1CeilingExtends === true &&
        c.reading2ExceedsButTautological === true &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.touchesOperatorPositivityResidual === false &&
        c.carriesRHVerdict === false &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3326_MATRIX_CORE_CEILING_EXTENSION_ASSESSMENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3326-matrix-core-ceiling-extension-assessment assertion failed: ${assertion.id}`);
  }
}

export default IMP3326_MATRIX_CORE_CEILING_EXTENSION_ASSESSMENT;
