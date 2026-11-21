/**
 * @module imp-3441-gaussian-curvature-coefficient-closed-form
 * @fileoverview imp-3441 -- Pin the imp-3403 SUBDOMINANT Gaussian-curvature
 *   coefficient (residual - residual_faulh) * N^2 -> ~0.114 to a CLOSED FORM.
 *
 *   CONTEXT
 *   -------
 *   imp-3403 decomposed the imp-3347 leftmost-zero leadingOrderResidual
 *   (measured leftmost zero u_0 minus the elementary closed form u_0_lead =
 *   (1/2) ln(5/(2 pi N^2))) into
 *     (a) a DOMINANT Faulhaber finite-N power-sum correction u_0_faulh - u_0_lead
 *         ~ -1/(2N) (the Gaussians=1 zero with the EXACT power sums), and
 *     (b) a SUBDOMINANT Gaussian-curvature piece u_0 - u_0_faulh of OPPOSITE
 *         sign with (residual - residual_faulh) * N^2 -> ~0.114,
 *   but it never DERIVED that 0.114 constant. This module derives it.
 *
 *   DERIVATION
 *   ----------
 *   Write x = e^{2u}. The truncated de Bruijn-Newman kernel
 *     Phi_N(u) = sum_{n=1..N} (2 pi^2 n^4 x^2 - 3 pi n^2 x) exp(-pi n^2 x^2)
 *   vanishes where 2 pi x B = 3 A, i.e. x = 3 A / (2 pi B), with the two
 *   Gaussian-weighted moments
 *     A = sum_{n=1..N} n^2 exp(-pi n^2 x^2),  B = sum_{n=1..N} n^4 exp(-pi n^2 x^2).
 *   At the leftmost-zero scale x ~ 5/(2 pi N^2) the largest Gaussian argument is
 *   pi N^2 x^2 ~ 25/(4 pi N^2) -> 0, so EVERY exp(-pi n^2 x^2) -> 1 and the
 *   curvature expansion exp(-pi n^2 x^2) = 1 - pi n^2 x^2 + O(x^4 n^4) is valid:
 *     A = S2 - pi x^2 S4 + O(x^4 S6),  B = S4 - pi x^2 S6 + O(x^4 S8),
 *   with S2 = sum n^2, S4 = sum n^4, S6 = sum n^6. The Faulhaber zero x_f =
 *   3 S2 / (2 pi S4) sets the Gaussians=1 solution, and
 *     x / x_f = (1 - pi x^2 S4/S2) / (1 - pi x^2 S6/S4)
 *            ~ 1 + pi x^2 (S6/S4 - S4/S2),
 *   so the Gaussian-curvature piece is
 *     u_0 - u_0_faulh = (1/2) ln(x/x_f) ~ (1/2) pi x^2 (S6/S4 - S4/S2).
 *   With the leading power sums S2 ~ N^3/3, S4 ~ N^5/5, S6 ~ N^7/7,
 *     S6/S4 - S4/S2 ~ (5/7 - 3/5) N^2 = (4/35) N^2,
 *   and x ~ 5/(2 pi N^2) so pi x^2 ~ 25/(4 pi N^4). Hence
 *     u_0 - u_0_faulh ~ (1/2)(25/(4 pi N^4))(4/35 N^2) = 5/(14 pi) * 1/N^2,
 *   i.e. the SUBDOMINANT coefficient is the CLOSED FORM
 *     (residual - residual_faulh) * N^2  ->  5 / (14 pi)  =  0.1136821022...,
 *   matching the imp-3403 measured ~0.114. The piece is POSITIVE (5/(14 pi) > 0),
 *   reproducing the opposite-sign-to-residual observation.
 *
 *   FINITE-N APPROACH
 *   -----------------
 *   The finite-N deficit is a clean O(1/N): the self-computed piece * N^2 over
 *   the imp-3403 ladder {10..1280} plus {2560, 5120} climbs monotonically from
 *   0.102313 (N=10) to 0.113660 (N=5120), tracking 5/(14 pi)(1 - 1/N) to O(1/N^2)
 *   (at N=10, 5/(14 pi) * 0.9 = 0.102314 vs measured 0.102313), so the ratio
 *   piece*N^2 / (5/(14 pi)) -> 1 (0.89999 at N=10, 0.99980 at N=5120).
 *
 *   VERDICT (derivation, RH-equivalent context, NO QED)
 *   ---------------------------------------------------
 *   The imp-3403 subdominant Gaussian-curvature coefficient is the closed form
 *   5/(14 pi) = 0.11368..., derived by carrying the leading curvature term
 *   1 - pi n^2 x^2 through the moment ratio and the leading Faulhaber power sums.
 *   Derivation/measurement only: the leftmost zero is a truncation artifact
 *   receding to -infinity (the untruncated Phi is positive on all of R), the
 *   imp-3197/imp-3257 [0, U] window is untouched, and the binding RH-equivalent
 *   residual is the imp-3066 operator-norm magnitude K_a >= 0, entirely
 *   unaffected. No positivity, no reduction, no RH verdict. No refereed bound is changed.
 *
 *   @see imp-3403-leading-order-residual-nphi-scaling.js (the ~0.114 this pins)
 *   @see imp-3347-phi-leftmost-zero-vs-nphi.js (the residual this refines)
 *   @see imp-3257-bridge-sign-phi-nonneg-structural.js (the termwise [u_1*, inf) bound)
 *
 *   Ticket: imp-3441 (numerical, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

/**
 * de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI
 * (identical to imp-3403 / imp-3347 / imp-3402 / imp-3197 / imp-3257).
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

// The rightmost per-term sign-flip threshold (imp-3257): u_1* = (1/2) ln(3/(2 pi)).
const U1_STAR = 0.5 * Math.log(3 / (2 * Math.PI)); // ~ -0.36963238887

// Gaussians=1 zero with the EXACT Faulhaber power sums (imp-3403 faulhaberOnlyU0):
// the Gaussians=1 kernel vanishes at e^{2u} = 3 S2 / (2 pi S4).
function faulhaberOnlyU0(nphi) {
  const s2 = (nphi * (nphi + 1) * (2 * nphi + 1)) / 6;
  const s4 = (nphi * (nphi + 1) * (2 * nphi + 1) * (3 * nphi * nphi + 3 * nphi - 1)) / 30;
  return 0.5 * Math.log((3 * s2) / (2 * Math.PI * s4));
}

// -- Locate the leftmost genuine zero of Phi_NPHI (identical to imp-3403) ------
function leftmostZero(nphi) {
  const step = 1e-3;
  let uPrev = U1_STAR;
  let pPrev = phiKernel(uPrev, nphi);
  for (let u = U1_STAR - step; u > -14; u -= step) {
    const p = phiKernel(u, nphi);
    if (p < 0 && pPrev > 0) {
      let lo = u; // Phi(lo) < 0
      let hi = uPrev; // Phi(hi) > 0
      for (let it = 0; it < 200; it++) {
        const mid = 0.5 * (lo + hi);
        const fm = phiKernel(mid, nphi);
        if (fm === 0) return mid;
        if (fm < 0) lo = mid;
        else hi = mid;
      }
      return 0.5 * (lo + hi);
    }
    uPrev = u;
    pPrev = p;
  }
  return null;
}

// -- The derived closed form ---------------------------------------------------
// Gaussian-curvature coefficient: (u_0 - u_0_faulh) * N^2 -> 5/(14 pi).
const GAUSSIAN_CURVATURE_COEFF = 5 / (14 * Math.PI); // 0.1136821022...

// The two pieces of the derivation, kept explicit for the tripwires:
//   S6/S4 - S4/S2 -> (5/7 - 3/5) N^2 = (4/35) N^2, and pi x^2 -> 25/(4 pi N^4),
//   so (1/2) pi x^2 (S6/S4 - S4/S2) -> (1/2)(25/(4 pi))(4/35) / N^2 = 5/(14 pi) / N^2.
const POWER_SUM_RATIO_COEFF = 4 / 35; // leading coeff of (S6/S4 - S4/S2)/N^2
const PI_X2_COEFF = 25 / (4 * Math.PI); // leading coeff of pi x^2 * N^4 (x ~ 5/(2 pi N^2))
const DERIVED_FROM_PIECES = 0.5 * PI_X2_COEFF * POWER_SUM_RATIO_COEFF; // == 5/(14 pi)

// Extended imp-3403 ladder (adds 2560, 5120 to sharpen the limit).
const NPHI_GRID = [10, 20, 40, 80, 160, 320, 640, 1280, 2560, 5120];

const cells = NPHI_GRID.map((nphi) => {
  const u0 = leftmostZero(nphi);
  const gaussianCurvaturePiece = u0 - faulhaberOnlyU0(nphi); // residual - residual_faulh
  const pieceTimesNphiSq = gaussianCurvaturePiece * nphi * nphi; // -> 5/(14 pi)
  return {
    nphi,
    leftmostZero: u0,
    gaussianCurvaturePiece,
    pieceTimesNphiSq,
    ratioToClosedForm: pieceTimesNphiSq / GAUSSIAN_CURVATURE_COEFF, // -> 1
    // finite-N model 5/(14 pi)(1 - 1/N): the O(1/N) approach to the closed form.
    finiteNModel: GAUSSIAN_CURVATURE_COEFF * (1 - 1 / nphi),
  };
});

const tail = cells[cells.length - 1];
const pieceTimesNphiSqTailLimit = tail.pieceTimesNphiSq; // ~ 0.113660 at N=5120
const ratioTailLimit = tail.ratioToClosedForm; // ~ 0.99980
// Monotone climb toward the closed form (piece * N^2 increasing in N).
const monotoneTowardClosedForm = cells.every(
  (c, i) => i === 0 || c.pieceTimesNphiSq > cells[i - 1].pieceTimesNphiSq,
);
// The finite-N model 5/(14 pi)(1 - 1/N) tracks the data to O(1/N^2).
const finiteNModelMaxErr = Math.max(
  ...cells.map((c) => Math.abs(c.pieceTimesNphiSq - c.finiteNModel)),
);

const verdict =
  Math.abs(DERIVED_FROM_PIECES - GAUSSIAN_CURVATURE_COEFF) < 1e-15 &&
  monotoneTowardClosedForm &&
  Math.abs(ratioTailLimit - 1) < 5e-4
    ? 'GAUSSIAN-CURVATURE-COEFFICIENT-IS-5-OVER-14-PI'
    : 'INDETERMINATE';

export const IMP3441_GAUSSIAN_CURVATURE_COEFFICIENT_CLOSED_FORM = Object.freeze({
  id: 'imp-3441-gaussian-curvature-coefficient-closed-form',
  ticket: 'imp-3441',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedMeasurement: 'imp-3403-leading-order-residual-nphi-scaling.js',
  relatedResidual: 'imp-3347-phi-leftmost-zero-vs-nphi.js',
  relatedStructural: 'imp-3257-bridge-sign-phi-nonneg-structural.js',

  summary:
    'Pins the imp-3403 SUBDOMINANT Gaussian-curvature coefficient (residual - residual_faulh) * N^2 -> ' +
    '~0.114 to the CLOSED FORM 5/(14 pi) = 0.1136821022. Writing x = e^{2u}, the truncated de Bruijn-Newman ' +
    'kernel vanishes at x = 3 A / (2 pi B) with A = sum n^2 exp(-pi n^2 x^2), B = sum n^4 exp(-pi n^2 x^2); ' +
    'at the leftmost-zero scale x ~ 5/(2 pi N^2) every Gaussian argument pi n^2 x^2 -> 0, so expanding ' +
    'exp(-pi n^2 x^2) = 1 - pi n^2 x^2 + ... gives u_0 - u_0_faulh = (1/2) ln(x/x_f) ~ (1/2) pi x^2 ' +
    '(S6/S4 - S4/S2). With the leading power sums S2 ~ N^3/3, S4 ~ N^5/5, S6 ~ N^7/7 the ratio ' +
    'S6/S4 - S4/S2 -> (5/7 - 3/5) N^2 = (4/35) N^2 and pi x^2 -> 25/(4 pi N^4), so (u_0 - u_0_faulh) * N^2 ' +
    '-> (1/2)(25/(4 pi))(4/35) = 5/(14 pi). A self-computing NPHI ladder {10..5120} confirms it: piece * N^2 ' +
    'climbs monotonically from 0.102313 (N=10) to 0.113660 (N=5120), ratio to 5/(14 pi) rising from 0.89999 ' +
    'to 0.99980, and the O(1/N) approach tracks 5/(14 pi)(1 - 1/N) to O(1/N^2). The piece is POSITIVE ' +
    '(5/(14 pi) > 0), reproducing the opposite-sign-to-residual observation. Derivation/measurement only: ' +
    'the leftmost zero is a truncation artifact receding to -infinity (the untruncated Phi is positive on ' +
    'all of R), the imp-3197/imp-3257 [0, U] window is untouched, and the binding RH-equivalent residual is ' +
    'the imp-3066 operator-norm magnitude K_a >= 0, entirely unaffected; no positivity, no reduction, NO QED. ' +
    'No refereed bound is changed.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..NPHI} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    zeroCondition: 'x = e^{2u}; Phi = 0 at 2 pi x B = 3 A, i.e. x = 3 A/(2 pi B), A = sum n^2 g, B = sum n^4 g, g = exp(-pi n^2 x^2)',
    curvatureExpansion: 'exp(-pi n^2 x^2) = 1 - pi n^2 x^2 + O(x^4 n^4) (valid since pi N^2 x^2 ~ 25/(4 pi N^2) -> 0)',
    faulhaberZero: 'x_f = 3 S2/(2 pi S4) (Gaussians=1, EXACT power sums; imp-3403 faulhaberOnlyU0)',
    pieceFormula: 'u_0 - u_0_faulh = (1/2) ln(x/x_f) ~ (1/2) pi x^2 (S6/S4 - S4/S2)',
    leadingPowerSums: 'S2 ~ N^3/3, S4 ~ N^5/5, S6 ~ N^7/7 => S6/S4 - S4/S2 -> (5/7 - 3/5) N^2 = (4/35) N^2',
    leadingScale: 'x ~ 5/(2 pi N^2) => pi x^2 -> 25/(4 pi N^4)',
    closedForm: '(u_0 - u_0_faulh) * N^2 -> (1/2)(25/(4 pi))(4/35) = 5/(14 pi) = 0.1136821022',
    finiteNModel: '5/(14 pi)(1 - 1/N): the O(1/N) approach, matching the ladder to O(1/N^2)',
    nphiGrid: NPHI_GRID,
    selfComputing: true,
  }),

  measured: Object.freeze({
    gaussianCurvatureCoeff: GAUSSIAN_CURVATURE_COEFF, // 5/(14 pi) = 0.1136821022
    powerSumRatioCoeff: POWER_SUM_RATIO_COEFF, // 4/35
    piX2Coeff: PI_X2_COEFF, // 25/(4 pi)
    derivedFromPieces: DERIVED_FROM_PIECES, // (1/2)(25/(4 pi))(4/35) == 5/(14 pi)
    cells, // per-NPHI piece, pieceTimesNphiSq, ratioToClosedForm, finiteNModel
    pieceTimesNphiSqTailLimit, // ~ 0.113660 at N=5120
    ratioTailLimit, // ~ 0.99980 -> 1
    monotoneTowardClosedForm,
    finiteNModelMaxErr, // small: the 5/(14 pi)(1 - 1/N) model tracks the data
    verdict,
  }),

  interpretation: Object.freeze({
    coefficientIsFiveOverFourteenPi:
      'The imp-3403 ~0.114 is the closed form 5/(14 pi) = 0.1136821022, arising from the leading Gaussian ' +
      'curvature term 1 - pi n^2 x^2 carried through the moment ratio: (1/2) pi x^2 (S6/S4 - S4/S2) with ' +
      'x ~ 5/(2 pi N^2) and S6/S4 - S4/S2 ~ (4/35) N^2 gives (1/2)(25/(4 pi))(4/35) = 5/(14 pi).',
    positiveOppositeSign:
      'The coefficient is positive (5/(14 pi) > 0), so the Gaussian-curvature piece is of OPPOSITE sign to ' +
      'the negative -1/(2N) full residual, matching imp-3403 gaussianPiecePositive.',
    orderOneOverNsqApproach:
      'The finite-N deficit is a clean O(1/N): piece * N^2 tracks 5/(14 pi)(1 - 1/N) to O(1/N^2), so the ' +
      'ratio to 5/(14 pi) rises from 0.89999 (N=10) to 0.99980 (N=5120) toward 1.',
    diagnosticOnly:
      'This derives a coefficient for a truncation artifact (the untruncated de Bruijn-Newman Phi is ' +
      'positive on all of R); it leaves the imp-3197/imp-3257 [0, U] usage and the imp-3066 K_a >= 0 ' +
      'operator-norm magnitude obstruction entirely untouched.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isDiagnosticMeasurement: true,
    scalesAnExistingArtifact:
      'This only pins the coefficient of the imp-3403 subdominant Gaussian-curvature piece (a finite-' +
      'truncation artifact receding to -infinity); it adds no new positivity and does not use the ' +
      'classical de Bruijn-Newman positivity.',
    derivationIsLeadingOrder:
      'The closed form 5/(14 pi) is the LEADING coefficient of piece * N^2; the finite-N ladder approaches ' +
      'it as 5/(14 pi)(1 - 1/N + O(1/N^2)), so 5/(14 pi) is the N -> infinity limit, not the finite-N value.',
    doesNotAdvancePositivity:
      'The binding RH-equivalent residual is the operator-norm magnitude (the |Gshear| spectrum, ' +
      'imp-3066 K_a >= 0), entirely untouched here; correct signs / positivity of Phi on [0, U] were ' +
      'already necessary-but-NOT-sufficient.',
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3441_GAUSSIAN_CURVATURE_COEFFICIENT_CLOSED_FORM_ASSERTIONS = [
  {
    id: 'imp3441-derived-coefficient-is-5-over-14-pi',
    why: 'The deliverable closed form: (1/2)(25/(4 pi))(4/35) must equal 5/(14 pi) exactly (the two ' +
         'derivation pieces pi x^2 -> 25/(4 pi N^4) and S6/S4 - S4/S2 -> (4/35) N^2 compose to it).',
    holds: () =>
      Math.abs(DERIVED_FROM_PIECES - GAUSSIAN_CURVATURE_COEFF) < 1e-15 &&
      Math.abs(GAUSSIAN_CURVATURE_COEFF - 0.11368210220849667) < 1e-15,
  },
  {
    id: 'imp3441-matches-imp3403-measured-0114',
    why: 'The closed form 5/(14 pi) = 0.11368 must match the imp-3403 measured ~0.114 (|diff| < 0.001), ' +
         'closing the imp-3403 open constant.',
    holds: () => Math.abs(GAUSSIAN_CURVATURE_COEFF - 0.114) < 1e-3,
  },
  {
    id: 'imp3441-ladder-grounded-in-imp3403',
    why: 'The self-computed piece * N^2 must reproduce the imp-3403 ladder: N=10 gives 0.102313 (imp-3403 ' +
         '~0.114 tail; matching the extended-ladder recomputation of the SAME leftmost zeros).',
    holds: () =>
      cells.length === 10 &&
      Math.abs(cells[0].nphi - 10) === 0 &&
      Math.abs(cells[0].pieceTimesNphiSq - 0.102313) < 1e-5 &&
      cells.every((c) => c.gaussianCurvaturePiece > 0),
  },
  {
    id: 'imp3441-monotone-climb-to-closed-form',
    why: 'The clean-limit diagnostic: piece * N^2 climbs monotonically toward 5/(14 pi), reaching ratio ' +
         '~0.99980 at N=5120 (|ratio - 1| < 5e-4), so the coefficient limit is 5/(14 pi).',
    holds: () =>
      monotoneTowardClosedForm &&
      Math.abs(pieceTimesNphiSqTailLimit - 0.113660) < 1e-5 &&
      Math.abs(ratioTailLimit - 1) < 5e-4,
  },
  {
    id: 'imp3441-finite-n-model-is-one-minus-one-over-n',
    why: 'The O(1/N) approach: piece * N^2 tracks 5/(14 pi)(1 - 1/N) to O(1/N^2) across the ladder ' +
         '(max abs error < 1e-4), confirming the finite-N deficit is a clean 1/N.',
    holds: () => finiteNModelMaxErr < 1e-4,
  },
  {
    id: 'imp3441-verdict-closed-form',
    why: 'The classified verdict must be the 5/(14 pi) closed form, not indeterminate; any flip means the ' +
         'derivation composition or the ladder limit changed.',
    holds: () => verdict === 'GAUSSIAN-CURVATURE-COEFFICIENT-IS-5-OVER-14-PI',
  },
  {
    id: 'imp3441-honest-assessment-no-qed',
    why: 'Mandatory honesty: DERIVATION/MEASUREMENT only -- not a proof, not a reduction below RH, ' +
         'RH-equivalent, pins a coefficient of a truncation artifact, does not advance positivity / the ' +
         'imp-3066 magnitude obstruction, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3441_GAUSSIAN_CURVATURE_COEFFICIENT_CLOSED_FORM.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.doesNotAdvancePositivity.length > 0 &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3441_GAUSSIAN_CURVATURE_COEFFICIENT_CLOSED_FORM_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3441-gaussian-curvature-coefficient-closed-form assertion failed: ${assertion.id}`);
  }
}

export default IMP3441_GAUSSIAN_CURVATURE_COEFFICIENT_CLOSED_FORM;
