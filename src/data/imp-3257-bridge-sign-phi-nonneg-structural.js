/**
 * @module imp-3257-bridge-sign-phi-nonneg-structural
 * @fileoverview imp-3257 -- Assess whether the imp-3197 exact bridge-sign
 *   agreement (sign Gshear = sign(v - u), 100% magnitude-weighted, zero mismatch
 *   mass) is STRUCTURALLY guaranteed by Phi &gt;= 0 on [0, U], or is a
 *   cell-specific accident that a larger U or NPHI could break with a genuine
 *   Phi sign change.
 *
 *   CONTEXT
 *   -------
 *   imp-3197 found that the section26-mupass bridge kernel Gshear(u, v) =
 *   Phi(u) Phi(v) sinh(a (v - u)) has entry sign = sign(v - u) on 100% of the
 *   off-diagonal mass, BECAUSE the genuine de Bruijn-Newman Phi is nonnegative on
 *   [0, U] (0 genuine sign changes at NPHI = 10, a = 0.5, U = 6). That was
 *   measured at ONE cell. This module asks whether Phi &gt;= 0 on [0, U] is
 *   structural or cell-specific, and sweeps larger U and NPHI to look for a
 *   genuine sign change.
 *
 *   THE STRUCTURAL ARGUMENT (elementary, termwise)
 *   ----------------------------------------------
 *   The truncated kernel is
 *     Phi(u) = sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u}).
 *   Factor the n-th summand:
 *     2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}
 *       = pi n^2 e^{2u} (2 pi n^2 e^{2u} - 3).
 *   The prefactor pi n^2 e^{2u} and the Gaussian exp(-pi n^2 e^{4u}) are strictly
 *   positive for every real u and every n &gt;= 1, so the SIGN of the summand is
 *   the sign of the bracket (2 pi n^2 e^{2u} - 3). That bracket is &gt;= 0 exactly
 *   when
 *     e^{2u} &gt;= 3 / (2 pi n^2),  i.e.  u &gt;= u_n* = (1/2) ln(3 / (2 pi n^2)).
 *   The LARGEST such threshold is at n = 1:
 *     u_1* = (1/2) ln(3 / (2 pi)) = -0.36963238887...  &lt; 0.
 *   Hence for every u &gt;= 0 and every n &gt;= 1 the bracket satisfies
 *   2 pi n^2 e^{2u} &gt;= 2 pi = 6.2831... &gt; 3, so EVERY summand is nonnegative
 *   on [0, infinity). A sum of nonnegative terms is nonnegative, and DROPPING the
 *   tail terms n &gt; NPHI (truncation) removes nonnegative terms and preserves
 *   nonnegativity. Therefore:
 *
 *     Phi(u) &gt;= 0 for ALL u in [0, U], ALL U &gt;= 0, and ALL truncations NPHI.
 *
 *   This is STRUCTURAL, not cell-specific: [0, U] lies entirely to the right of
 *   the last per-term sign-flip u_1* &lt; 0, so no extension of U and no increase
 *   of NPHI can move the domain into a region where a summand is negative. The
 *   imp-3197 zero-mismatch bridge-sign agreement is a guaranteed consequence.
 *
 *   HONEST SCOPE OF THE TERMWISE ARGUMENT
 *   ------------------------------------
 *   Termwise nonnegativity is SUFFICIENT but conservative: it guarantees
 *   Phi &gt;= 0 only on the termwise-positive half-line [u_1*, infinity). Below
 *   u_1* the n = 1 summand turns negative, yet the FULL Phi stays strictly
 *   positive far to the left (e.g. Phi(-0.8) ~ 72.7) -- that deeper positivity is
 *   the classical de Bruijn-Newman / Riemann-Xi positivity of Phi, NOT delivered
 *   by this termwise bound. But imp-3197 only ever uses [0, U] subset [u_1*,
 *   infinity), where the elementary termwise guarantee is airtight and needs no
 *   appeal to the classical theorem.
 *
 *   VERDICT (assessment, RH-equivalent context, NO QED)
 *   ---------------------------------------------------
 *   The Phi &gt;= 0 on [0, U] premise of the imp-3197 sign result is STRUCTURAL:
 *   guaranteed termwise for every U &gt;= 0 and every NPHI, because the last
 *   per-term sign flip u_1* = (1/2) ln(3/(2 pi)) is strictly negative. A
 *   U-in-{6, 8, 12, 16, 24} x NPHI-in-{10, 20, 40, 80} sweep finds ZERO genuine
 *   negatives at every cell, confirming the bound. So no larger U or NPHI can
 *   produce a genuine sign change that flips a bridge sign; the zero-mismatch
 *   agreement is robust. This upgrades the imp-3197 sign half from measured to
 *   structural -- and it is still the EASY half: the binding K_a &gt;= 0 residual
 *   is the OPERATOR-NORM magnitude (imp-3197 magnitude half, the |Gshear|
 *   spectrum), untouched here. Platt-Trudgian Lambda &lt;= 0.2 stays SOTA.
 *
 *   @see imp-3197-mupass-bridge-sign-phi-only.js (the one-cell sign/magnitude split this makes structural)
 *   @see section26-mupass-operator-verdict-2026-06-30.js (the verdict whose Phi-only sign claim this backs)
 *
 *   Ticket: imp-3257 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const A = 0.5; // headline shear weight (the imp-3197 genuine-Phi cell)

/**
 * de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI
 * (identical to imp-3197 / imp-2841 / imp-3175).
 */
function phiKernel(uu, nphi) {
  let s = 0;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  for (let n = 1; n <= nphi; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** The n-th summand of the kernel, isolated to check its sign directly. */
function phiTerm(uu, n) {
  const n2 = n * n;
  const n4 = n2 * n2;
  const e2 = Math.exp(2 * uu);
  const e4 = Math.exp(4 * uu);
  return (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
}

// -- The closed-form per-term sign-flip thresholds ----------------------------
// Summand n is nonnegative iff 2 pi n^2 e^{2u} - 3 >= 0 iff u >= u_n*.
// u_n* = (1/2) ln(3 / (2 pi n^2)); the rightmost (worst) is n = 1.
const termFlipThreshold = (n) => 0.5 * Math.log(3 / (2 * Math.PI * n * n));
const U1_STAR = termFlipThreshold(1); // = 0.5 ln(3/(2 pi)) ~ -0.36963238887
const termFlipThresholdIsNegative = U1_STAR < 0; // [0, U] sits entirely to its right

// Direct check that the n = 1 summand DOES flip across u_1* (the threshold is
// real and exact), and that it is positive at u_1* + eps, negative at u_1* - eps.
const EPS = 1e-3;
const term1JustRight = phiTerm(U1_STAR + EPS, 1); // > 0
const term1JustLeft = phiTerm(U1_STAR - EPS, 1); // < 0
const term1AtThresholdNearZero = Math.abs(phiTerm(U1_STAR, 1)); // ~ 0
const thresholdIsExact =
  term1JustRight > 0 && term1JustLeft < 0 && term1AtThresholdNearZero < 5e-2;

// -- Structural sweep: count genuine negatives on [0, U] over a U x NPHI grid --
const U_GRID = [6, 8, 12, 16, 24];
const NPHI_GRID = [10, 20, 40, 80];
const SWEEP_N = 4000; // dense midpoint grid on [0, U] per cell

const sweepCells = [];
let totalGenuineNegatives = 0;
let worstMinPhi = Infinity; // the most-negative Phi seen anywhere (should stay >= 0)
for (const nphi of NPHI_GRID) {
  for (const U of U_GRID) {
    const H = U / SWEEP_N;
    let neg = 0;
    let minPhi = Infinity;
    for (let i = 0; i < SWEEP_N; i++) {
      const u = (i + 0.5) * H;
      const p = phiKernel(u, nphi);
      if (p < 0) neg += 1;
      if (p < minPhi) minPhi = p;
    }
    totalGenuineNegatives += neg;
    if (minPhi < worstMinPhi) worstMinPhi = minPhi;
    sweepCells.push({ nphi, U, genuineNegatives: neg, minPhi });
  }
}
const sweepIsNonnegativeEverywhere = totalGenuineNegatives === 0 && worstMinPhi >= 0;

// -- Independent confirmation of the termwise bound at the headline cell -------
// At (NPHI = 10, a = 0.5, U = 6): every summand nonnegative at every grid point.
const HEADLINE_NPHI = 10;
const HEADLINE_U = 6;
let headlineTermwiseAllNonneg = true;
{
  const N = 200; // the imp-3197 grid
  const H = HEADLINE_U / N;
  for (let i = 0; i < N && headlineTermwiseAllNonneg; i++) {
    const u = (i + 0.5) * H;
    for (let n = 1; n <= HEADLINE_NPHI; n++) {
      if (phiTerm(u, n) < 0) {
        headlineTermwiseAllNonneg = false;
        break;
      }
    }
  }
}

const verdict =
  termFlipThresholdIsNegative && thresholdIsExact && sweepIsNonnegativeEverywhere && headlineTermwiseAllNonneg
    ? 'PHI-NONNEG-ON-[0,U]-IS-STRUCTURAL; NO-U-OR-NPHI-SWEEP-BREAKS-THE-BRIDGE-SIGN'
    : 'INDETERMINATE';

export const IMP3257_BRIDGE_SIGN_PHI_NONNEG_STRUCTURAL = Object.freeze({
  id: 'imp-3257-bridge-sign-phi-nonneg-structural',
  ticket: 'imp-3257',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedDiagnostic: 'imp-3197-mupass-bridge-sign-phi-only.js',
  relatedVerdict: 'section26-mupass-operator-verdict-2026-06-30.js',

  summary:
    'Assesses whether the imp-3197 exact bridge-sign agreement (sign Gshear(u, v) ' +
    '= sign(v - u) on 100% of off-diagonal mass, zero mismatch) is STRUCTURALLY ' +
    'guaranteed by Phi >= 0 on [0, U] or is a cell-specific accident a larger U ' +
    'or NPHI could break. It is STRUCTURAL. Factoring the n-th summand of the ' +
    'de Bruijn-Newman kernel as pi n^2 e^{2u} (2 pi n^2 e^{2u} - 3) exp(-pi n^2 ' +
    'e^{4u}), the strictly positive prefactor and Gaussian make the summand sign ' +
    'equal to sign(2 pi n^2 e^{2u} - 3), nonnegative exactly for u >= u_n* = ' +
    '(1/2) ln(3/(2 pi n^2)). The rightmost threshold is u_1* = (1/2) ln(3/(2 pi)) ' +
    '= -0.369632 < 0, so for every u >= 0 and every n >= 1 the bracket is ' +
    '>= 2 pi = 6.2831 > 3: EVERY summand is nonnegative on [0, infinity), and ' +
    'truncation at any NPHI keeps a nonnegative partial sum. Hence Phi >= 0 on ' +
    '[0, U] for ALL U >= 0 and ALL NPHI. A U-in-{6,8,12,16,24} x NPHI-in-' +
    '{10,20,40,80} dense sweep confirms zero genuine negatives at every cell ' +
    '(worst minPhi = 0, the tail underflow, never negative), and the n = 1 ' +
    'summand is verified to flip sign exactly across u_1* (positive at u_1*+eps, ' +
    'negative at u_1*-eps) -- the boundary is real and strictly left of [0, U]. ' +
    'So no larger U or NPHI can produce a genuine sign change that flips a bridge ' +
    'sign; the zero-mismatch agreement is robust. This upgrades the imp-3197 sign ' +
    'half from measured to structural and it remains the EASY half -- the binding ' +
    'K_a >= 0 residual is the operator-norm magnitude (the |Gshear| spectrum), ' +
    'untouched. Assessment only; RH-equivalent context; NO QED.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    summandFactorization: 'nth summand = pi n^2 e^{2u} (2 pi n^2 e^{2u} - 3) exp(-pi n^2 e^{4u})',
    positivePrefactor: 'pi n^2 e^{2u} > 0 and exp(-pi n^2 e^{4u}) > 0 for all real u, n >= 1',
    summandSign: 'sign(summand_n) = sign(2 pi n^2 e^{2u} - 3)',
    termFlipThreshold: 'summand_n >= 0 iff u >= u_n* = (1/2) ln(3 / (2 pi n^2))',
    rightmostThreshold: 'u_1* = (1/2) ln(3 / (2 pi)) = -0.36963238887 (n = 1, the worst case)',
    structuralClaim:
      'u_1* < 0 => [0, U] subset [u_1*, infinity) => every summand nonnegative on [0, U] ' +
      'for every U >= 0; truncation at any NPHI removes nonnegative terms and preserves Phi >= 0',
    honestScope:
      'termwise nonnegativity is SUFFICIENT but conservative: it guarantees Phi >= 0 only on ' +
      '[u_1*, infinity); deeper positivity below u_1* is the classical de Bruijn-Newman Phi > 0, ' +
      'not needed since imp-3197 uses only [0, U] subset [u_1*, infinity)',
    sweepGrid: 'U in {6, 8, 12, 16, 24} x NPHI in {10, 20, 40, 80}, dense midpoint N = 4000 on [0, U]',
    a: A,
    selfComputing: true,
  }),

  measured: Object.freeze({
    u1Star: U1_STAR, // -0.36963238887, the rightmost per-term sign-flip threshold
    termFlipThresholdIsNegative, // true -> [0, U] entirely right of the last flip
    term1JustRight, // > 0 at u_1* + eps
    term1JustLeft, // < 0 at u_1* - eps
    term1AtThresholdNearZero, // ~ 0 AT u_1*
    thresholdIsExact, // true -> the n = 1 summand genuinely flips across the closed-form u_1*
    sweepCellCount: sweepCells.length, // 5 x 4 = 20
    totalGenuineNegatives, // 0 across the whole U x NPHI grid
    worstMinPhi, // 0 (tail underflows to 0, never negative)
    sweepIsNonnegativeEverywhere, // true
    headlineTermwiseAllNonneg, // true -> every summand nonnegative at the imp-3197 headline cell
    sweepCells, // per-cell {nphi, U, genuineNegatives, minPhi}
    verdict, // PHI-NONNEG-ON-[0,U]-IS-STRUCTURAL; NO-U-OR-NPHI-SWEEP-BREAKS-THE-BRIDGE-SIGN
  }),

  interpretation: Object.freeze({
    signPremiseIsStructural:
      'The Phi >= 0 on [0, U] premise underlying the imp-3197 sign result is not a cell-specific ' +
      'accident: it is an elementary termwise consequence of the last per-term sign-flip u_1* = ' +
      '(1/2) ln(3/(2 pi)) being strictly negative, so [0, U] lies entirely in the region where ' +
      'every summand is nonnegative, for every U >= 0 and every truncation NPHI.',
    noSweepCanBreakIt:
      'Because the guarantee holds for all U >= 0 and all NPHI, no larger U or larger NPHI can ' +
      'introduce a genuine Phi sign change on [0, U]; the 20-cell sweep confirms zero genuine ' +
      'negatives and the exact-threshold check confirms the boundary is real and sits at u < 0. ' +
      'The imp-3197 zero-mismatch bridge-sign agreement (sign Gshear = sign(v - u)) is therefore ' +
      'structurally robust.',
    stillTheEasyHalf:
      'This upgrades the sign half from measured to structural but the sign was already the EASY ' +
      'half. The binding RH-equivalent K_a >= 0 residual is the OPERATOR-NORM magnitude at the ' +
      'correct lags (the imp-3197 magnitude half: the lag-stationary surrogate captures only ~3% ' +
      'of ||Gshear||), i.e. the |Gshear| spectrum -- entirely untouched here.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    signResultIsTrivial:
      'The nonnegativity of Phi on [0, U] is elementary (termwise positive summands right of ' +
      'u_1* < 0); it confirms the imp-3197 sign half is structural but adds no new positivity ' +
      'and does not advance K_a >= 0.',
    termwiseBoundIsConservative:
      'The termwise argument guarantees Phi >= 0 only on [u_1*, infinity); it does NOT by itself ' +
      'prove the classical Phi > 0 below u_1*. This is irrelevant to imp-3197, which uses only ' +
      '[0, U] subset [u_1*, infinity).',
    magnitudeNotAddressed:
      'The operator-norm magnitude that actually binds K_a >= 0 / ||R|| <= 1 (the |Gshear| ' +
      'spectrum, position concentration) is not touched here; only the sign premise is made structural.',
    necessaryNotSufficient:
      'Correct signs are necessary-but-NOT-sufficient; the off-diagonal endpoint-Hankel operator ' +
      'magnitude (imp-3066) remains the lone obstruction. No RH verdict.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3257_BRIDGE_SIGN_PHI_NONNEG_STRUCTURAL_ASSERTIONS = [
  {
    id: 'imp3257-term-flip-threshold-closed-form-and-negative',
    why: 'The whole structural claim rests on the rightmost per-term sign-flip u_1* = (1/2) ln(3/(2 pi)) ' +
         'being strictly negative, so [0, U] lies entirely in the termwise-nonnegative region.',
    holds: () =>
      Math.abs(U1_STAR - 0.5 * Math.log(3 / (2 * Math.PI))) < 1e-15 &&
      Math.abs(U1_STAR - -0.36963238887) < 1e-8 &&
      termFlipThresholdIsNegative,
  },
  {
    id: 'imp3257-n1-summand-flips-exactly-across-threshold',
    why: 'The closed-form threshold must be REAL: the n = 1 summand is positive just right of u_1*, ' +
         'negative just left, and ~0 at u_1* -- confirming [0, U] is right of a genuine flip, not a fiction.',
    holds: () => term1JustRight > 0 && term1JustLeft < 0 && term1AtThresholdNearZero < 5e-2,
  },
  {
    id: 'imp3257-sweep-zero-genuine-negatives',
    why: 'THE DELIVERABLE: a U-in-{6,8,12,16,24} x NPHI-in-{10,20,40,80} dense sweep finds ZERO genuine ' +
         'Phi negatives on [0, U] at every cell (tail underflows to 0, never negative) -- no larger U or ' +
         'NPHI breaks the imp-3197 zero-mismatch bridge-sign agreement.',
    holds: () =>
      sweepCells.length === 20 &&
      totalGenuineNegatives === 0 &&
      worstMinPhi >= 0 &&
      sweepIsNonnegativeEverywhere,
  },
  {
    id: 'imp3257-headline-cell-termwise-nonnegative',
    why: 'Independent confirmation at the imp-3197 headline cell (NPHI = 10, a = 0.5, U = 6): every ' +
         'summand is nonnegative at every grid point, so the partial sum Phi is nonnegative termwise.',
    holds: () => headlineTermwiseAllNonneg,
  },
  {
    id: 'imp3257-verdict-structural-not-cell-specific',
    why: 'The classified verdict must be the structural / no-sweep-breaks-it split, not indeterminate; ' +
         'a flip would mean the threshold went nonnegative or a sweep cell developed a genuine negative.',
    holds: () => verdict === 'PHI-NONNEG-ON-[0,U]-IS-STRUCTURAL; NO-U-OR-NPHI-SWEEP-BREAKS-THE-BRIDGE-SIGN',
  },
  {
    id: 'imp3257-honest-assessment-no-qed',
    why: 'Mandatory honesty: ASSESSMENT only -- not a proof, not a reduction below RH, RH-equivalent, the ' +
         'sign result is trivial/structural, the termwise bound is conservative, magnitude not addressed, ' +
         'positivity not attempted, PT 0.2 stays SOTA. Any flip is over-claiming.',
    holds: () => {
      const c = IMP3257_BRIDGE_SIGN_PHI_NONNEG_STRUCTURAL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3257_BRIDGE_SIGN_PHI_NONNEG_STRUCTURAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3257-bridge-sign-phi-nonneg-structural assertion failed: ${assertion.id}`);
  }
}

export default IMP3257_BRIDGE_SIGN_PHI_NONNEG_STRUCTURAL;
