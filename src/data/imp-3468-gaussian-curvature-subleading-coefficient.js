/**
 * @module imp-3468-gaussian-curvature-subleading-coefficient
 * @fileoverview imp-3468 -- Derive the O(1/N^2) SUBLEADING coefficient b of the
 *   imp-3441 finite-N approach to the closed form 5/(14 pi).
 *
 *   CONTEXT
 *   -------
 *   imp-3441 derived the leftmost-zero subdominant Gaussian-curvature coefficient
 *   as the closed form C = 5/(14 pi) = 0.1136821 and observed that the finite-N
 *   quantity piece*N^2 (piece = u_0 - u_0_faulh) climbs from 0.102313 (N=10) to
 *   0.113660 (N=5120), tracking C(1 - 1/N) to O(1/N^2), but never derived the
 *   O(1/N^2) subleading term. This module derives it:
 *     piece*N^2 = C (1 - 1/N + b/N^2 + ...),  b = -3/4 + 130/(63 pi) = -0.0931701.
 *
 *   DERIVATION
 *   ----------
 *   Write x = e^{2u}, y = pi x^2, g_n = exp(-n^2 y). The truncated de Bruijn-Newman
 *   kernel Phi_N vanishes (for x>0) exactly at x = 3 A/(2 pi B), i.e.
 *     y = pi x^2 = 9 A^2 / (4 pi B^2),  A = sum n^2 g_n,  B = sum n^4 g_n.
 *   The Faulhaber-only (g_n=1) zero is y_0 = 9 S2^2/(4 pi S4^2) = pi x_f^2, and
 *     piece = u_0 - u_0_faulh = (1/4) ln(y/y_0)
 *           = (1/2)[ln(A/S2) - ln(B/S4)].
 *   Expanding g_n = 1 - n^2 y + n^4 y^2/2 - ... gives A/S2 = 1 - y a1 + (y^2/2) a2,
 *   B/S4 = 1 - y b1 + (y^2/2) b2, with a1=S4/S2, a2=S6/S2, b1=S6/S4, b2=S8/S4, so
 *     piece = (y/2)(b1 - a1) + (y^2/4) Q + O(y^3),
 *     Q = (a2 - a1^2) - (b2 - b1^2).
 *   Three sources contribute at O(1/N^2) to piece*N^2 (each carried past imp-3441):
 *
 *   (A) FIRST TERM with the EXACT Faulhaber sums, y = y_0. Carrying the next
 *       Faulhaber orders (u = 1/N):
 *         b1 - a1 = (4/35) N^2 (1 + u - (29/12) u^2 + ...),
 *         y_0     = (25/(4 pi)) N^-4 (1 - 2u + (11/3) u^2 - ...),
 *       so (y_0/2)(b1 - a1) = C N^-2 (1 - u - (3/4) u^2 + ...). Contributes -3/4.
 *
 *   (B) SELF-CONSISTENCY of the zero: y = y_0 exp(4 piece) (since y/y_0 = R^2 and
 *       piece = (1/2) ln R). The leading shift multiplies the first term:
 *       (y_0/2)(b1-a1) * 4 piece_lead = 4 C^2 N^-4 at leading, i.e. +4C to b.
 *       [4C = 90/(63 pi).]
 *
 *   (C) SECOND CURVATURE TERM (y^2/4) Q. With the leading power-sum ratios
 *         a2 - a1^2 -> (3/7 - 9/25) N^4 = (12/175) N^4,
 *         b2 - b1^2 -> (5/9 - 25/49) N^4 = (20/441) N^4,
 *       Q -> q0 N^4, q0 = 12/175 - 20/441 = 256/11025, and y ~ (25/(4 pi)) N^-4,
 *       so (y^2/4) Q -> (25/(4 pi))^2 (256/11025)/4 * N^-4, i.e.
 *       + (25/(4 pi))^2 q0 / (4 C) = 40/(63 pi) to b.
 *
 *   Summing (A)+(B)+(C):
 *     b = -3/4 + 4C + (25/(4 pi))^2 q0/(4C)
 *       = -3/4 + 90/(63 pi) + 40/(63 pi) = -3/4 + 130/(63 pi) = -0.09317008...
 *
 *   CERTIFICATION
 *   -------------
 *   A self-computing high-precision ladder solves the zero directly via the
 *   fixed point y = 9 A^2/(4 pi B^2) (A, B from exact Faulhaber S2, S4 minus
 *   cancellation-free -expm1 sums) and evaluates piece via log1p, extracting
 *   b_est(N) = (piece*N^2/C - 1 + 1/N) N^2. A one-step Richardson 2 b_est(2N) -
 *   b_est(N) converges to the closed form: 1280->2560 gives -0.093169, matching
 *   b = -3/4 + 130/(63 pi) = -0.093170 to < 1e-5 (past N~5120 the finite-difference
 *   loses digits to the O(1/N^2) cancellation, as expected in double precision).
 *
 *   VERDICT (derivation/accuracy, RH-equivalent context, NO QED)
 *   -----------------------------------------------------------
 *   The imp-3441 finite-N approach is C(1 - 1/N + b/N^2 + ...) with the SUBLEADING
 *   coefficient the closed form b = -3/4 + 130/(63 pi). Derivation/measurement
 *   only: piece is a coefficient of a truncation artifact (the leftmost zero
 *   recedes to -infinity; the untruncated Phi is positive on all of R), the
 *   imp-3197/imp-3257 [0, U] window is untouched, and the binding RH-equivalent
 *   residual is the imp-3066 operator-norm magnitude K_a >= 0, entirely
 *   unaffected. No positivity, no reduction, no RH verdict. Platt-Trudgian
 *   Lambda <= 0.2 remains the rigorous SOTA.
 *
 *   @see imp-3441-gaussian-curvature-coefficient-closed-form.js (the 5/(14 pi) this refines)
 *   @see imp-3403-leading-order-residual-nphi-scaling.js (the ~0.114 measurement)
 *   @see imp-3347-phi-leftmost-zero-vs-nphi.js (the residual this refines)
 *
 *   Ticket: imp-3468 (accuracy, medium).
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';

// The imp-3441 leading closed form: (u_0 - u_0_faulh) * N^2 -> C = 5/(14 pi).
const C_LEADING = 5 / (14 * Math.PI); // 0.1136821022...

// -- The derived subleading coefficient, as three explicit pieces --------------
// (A) first term with exact Faulhaber sums, y = y_0: -> -3/4.
const PIECE_A_FAULHABER = -3 / 4;
// (B) self-consistency y = y_0 exp(4 piece): -> 4C = 90/(63 pi).
const PIECE_B_SELF_CONSISTENCY = 4 * C_LEADING;
// (C) second curvature term (y^2/4) Q with q0 = 256/11025, y ~ 25/(4 pi) N^-4.
const PI_X2_LEAD = 25 / (4 * Math.PI); // leading coeff of y = pi x^2 times N^4
const Q_LEAD = 12 / 175 - 20 / 441; // 256/11025, leading coeff of Q over N^4
const PIECE_C_CURVATURE = (PI_X2_LEAD * PI_X2_LEAD * Q_LEAD) / (4 * C_LEADING); // 40/(63 pi)

// The composed closed form: b = -3/4 + 130/(63 pi).
const B_SUBLEADING = PIECE_A_FAULHABER + PIECE_B_SELF_CONSISTENCY + PIECE_C_CURVATURE;
const B_CLOSED_FORM = -3 / 4 + 130 / (63 * Math.PI); // -0.09317007611...

// -- High-precision self-computing ladder --------------------------------------
// Exact Faulhaber power sums.
function s2Of(nphi) {
  return (nphi * (nphi + 1) * (2 * nphi + 1)) / 6;
}
function s4Of(nphi) {
  return (nphi * (nphi + 1) * (2 * nphi + 1) * (3 * nphi * nphi + 3 * nphi - 1)) / 30;
}

// Cancellation-free Gaussian deficits: deltaA = S2 - A = sum n^2 (1 - e^{-n^2 y}),
// deltaB = S4 - B = sum n^4 (1 - e^{-n^2 y}), using -expm1 for accuracy.
function gaussianDeficits(nphi, y) {
  let dA = 0;
  let dB = 0;
  for (let n = 1; n <= nphi; n++) {
    const n2 = n * n;
    const w = -Math.expm1(-n2 * y); // 1 - e^{-n^2 y}, accurate at small argument
    dA += n2 * w;
    dB += n2 * n2 * w;
  }
  return { dA, dB };
}

// Solve the exact leftmost-zero fixed point y = 9 A^2/(4 pi B^2) and return the
// finite-N piece = (1/2)[ln(A/S2) - ln(B/S4)] via log1p (no cancellation).
function solvePiece(nphi) {
  const s2 = s2Of(nphi);
  const s4 = s4Of(nphi);
  const y0 = (9 * s2 * s2) / (4 * Math.PI * s4 * s4);
  let y = y0;
  for (let it = 0; it < 200; it++) {
    const { dA, dB } = gaussianDeficits(nphi, y);
    const a = s2 - dA;
    const b = s4 - dB;
    const yNext = (9 * a * a) / (4 * Math.PI * b * b);
    const converged = Math.abs(yNext - y) <= 1e-18 * y;
    y = yNext;
    if (converged) break;
  }
  const { dA, dB } = gaussianDeficits(nphi, y);
  return 0.5 * (Math.log1p(-dA / s2) - Math.log1p(-dB / s4));
}

// Ladder chosen so the Richardson finite-difference stays clean in double
// precision (past ~5120 the O(1/N^2) cancellation erodes digits).
const NPHI_GRID = [40, 80, 160, 320, 640, 1280, 2560];

const cells = NPHI_GRID.map((nphi) => {
  const piece = solvePiece(nphi);
  const pieceTimesNphiSq = piece * nphi * nphi; // -> C
  const f = pieceTimesNphiSq / C_LEADING; // -> 1 - 1/N + b/N^2
  const bEst = (f - 1 + 1 / nphi) * nphi * nphi; // -> b
  return { nphi, piece, pieceTimesNphiSq, f, bEst };
});

// One-step Richardson 2 b(2N) - b(N) removes the residual O(1/N) in b_est(N).
const richardson = [];
for (let i = 0; i + 1 < cells.length; i++) {
  richardson.push({
    fromNphi: cells[i].nphi,
    toNphi: cells[i + 1].nphi,
    value: 2 * cells[i + 1].bEst - cells[i].bEst,
  });
}
const richardsonBest = richardson[richardson.length - 1].value; // 1280->2560
const richardsonAbsErr = Math.abs(richardsonBest - B_CLOSED_FORM);

// The finite-N model C(1 - 1/N + b/N^2): does adding the b term beat C(1 - 1/N)?
const twoTermModelMaxErr = Math.max(
  ...cells.map((c) =>
    Math.abs(c.pieceTimesNphiSq - C_LEADING * (1 - 1 / c.nphi + B_CLOSED_FORM / (c.nphi * c.nphi))),
  ),
);
const oneTermModelMaxErr = Math.max(
  ...cells.map((c) => Math.abs(c.pieceTimesNphiSq - C_LEADING * (1 - 1 / c.nphi))),
);

const verdict =
  Math.abs(B_SUBLEADING - B_CLOSED_FORM) < 1e-14 &&
  richardsonAbsErr < 1e-4 &&
  twoTermModelMaxErr < oneTermModelMaxErr
    ? 'SUBLEADING-COEFFICIENT-IS-MINUS-THREE-QUARTERS-PLUS-130-OVER-63-PI'
    : 'INDETERMINATE';

export const IMP3468_GAUSSIAN_CURVATURE_SUBLEADING_COEFFICIENT = Object.freeze({
  id: 'imp-3468-gaussian-curvature-subleading-coefficient',
  ticket: 'imp-3468',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  relatedClosedForm: 'imp-3441-gaussian-curvature-coefficient-closed-form.js',
  relatedMeasurement: 'imp-3403-leading-order-residual-nphi-scaling.js',
  relatedResidual: 'imp-3347-phi-leftmost-zero-vs-nphi.js',

  summary:
    'Derives the O(1/N^2) SUBLEADING coefficient b of the imp-3441 finite-N approach to C = 5/(14 pi): ' +
    'piece*N^2 = C(1 - 1/N + b/N^2 + ...) with the CLOSED FORM b = -3/4 + 130/(63 pi) = -0.09317008. ' +
    'The truncated de Bruijn-Newman kernel zero solves y = pi x^2 = 9 A^2/(4 pi B^2) with A = sum n^2 g_n, ' +
    'B = sum n^4 g_n, g_n = exp(-n^2 y); piece = (1/4) ln(y/y_0) = (y/2)(b1-a1) + (y^2/4) Q. Three sources ' +
    'contribute at O(1/N^2), each carried past imp-3441: (A) the FIRST term with the exact Faulhaber sums ' +
    'b1-a1 = (4/35)N^2(1 + 1/N - (29/12)/N^2) and y_0 = (25/(4 pi))N^-4(1 - 2/N + (11/3)/N^2) gives ' +
    'C N^-2(1 - 1/N - (3/4)/N^2), i.e. -3/4; (B) the zero SELF-CONSISTENCY y = y_0 exp(4 piece) adds 4C = ' +
    '90/(63 pi); (C) the SECOND curvature term (y^2/4)Q with q0 = 12/175 - 20/441 = 256/11025 adds ' +
    '(25/(4 pi))^2 q0/(4C) = 40/(63 pi). Summing: b = -3/4 + 90/(63 pi) + 40/(63 pi) = -3/4 + 130/(63 pi). ' +
    'A high-precision self-computing ladder (fixed-point y solve, -expm1/log1p, no cancellation) certifies it: ' +
    'the Richardson 2 b_est(2N) - b_est(N) at 1280->2560 is -0.093169, matching -0.093170 to < 1e-5, and the ' +
    'two-term model C(1 - 1/N + b/N^2) beats the one-term C(1 - 1/N) across the ladder. Derivation/accuracy ' +
    'only: pins a subleading coefficient of a truncation artifact (untruncated Phi positive on all of R); the ' +
    'imp-3197/imp-3257 [0, U] window and the imp-3066 K_a >= 0 operator-norm magnitude obstruction are ' +
    'untouched; no positivity, no reduction, NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.',

  construction: Object.freeze({
    zeroCondition: 'y = pi x^2 = 9 A^2/(4 pi B^2), A = sum n^2 g_n, B = sum n^4 g_n, g_n = exp(-n^2 y)',
    faulhaberZero: 'y_0 = 9 S2^2/(4 pi S4^2) = pi x_f^2 (Gaussians g_n = 1)',
    pieceFormula: 'piece = u_0 - u_0_faulh = (1/4) ln(y/y_0) = (y/2)(b1-a1) + (y^2/4) Q + O(y^3)',
    momentRatios: 'a1=S4/S2, a2=S6/S2, b1=S6/S4, b2=S8/S4; Q = (a2-a1^2) - (b2-b1^2)',
    pieceAFaulhaber: 'first term, exact Faulhaber, y=y_0: b1-a1=(4/35)N^2(1+u-(29/12)u^2), y_0=(25/(4 pi))N^-4(1-2u+(11/3)u^2) => C(1-u-(3/4)u^2), u=1/N; contributes -3/4',
    pieceBSelfConsistency: 'y = y_0 exp(4 piece) (y/y_0 = R^2, piece = (1/2) ln R); leading shift adds 4C = 90/(63 pi)',
    pieceCCurvature: 'second term (y^2/4)Q with q0 = 12/175 - 20/441 = 256/11025, y ~ (25/(4 pi))N^-4 => (25/(4 pi))^2 q0/(4C) = 40/(63 pi)',
    closedForm: 'b = -3/4 + 4C + (25/(4 pi))^2 q0/(4C) = -3/4 + 130/(63 pi) = -0.09317008',
    certification: 'fixed-point y = 9 A^2/(4 pi B^2), A,B from exact Faulhaber minus -expm1 sums; piece via log1p; Richardson 2 b_est(2N)-b_est(N)',
    nphiGrid: NPHI_GRID,
    selfComputing: true,
  }),

  measured: Object.freeze({
    cLeading: C_LEADING, // 5/(14 pi) (imp-3441)
    pieceAFaulhaber: PIECE_A_FAULHABER, // -3/4
    pieceBSelfConsistency: PIECE_B_SELF_CONSISTENCY, // 4C = 90/(63 pi)
    pieceCCurvature: PIECE_C_CURVATURE, // 40/(63 pi)
    qLead: Q_LEAD, // 256/11025
    bFromPieces: B_SUBLEADING, // -3/4 + 130/(63 pi)
    bClosedForm: B_CLOSED_FORM, // -0.09317008
    cells, // per-N piece, pieceTimesNphiSq, f, bEst
    richardson, // one-step 2 b(2N)-b(N)
    richardsonBest, // 1280->2560 -> b
    richardsonAbsErr, // |richardsonBest - b|, small
    twoTermModelMaxErr, // C(1 - 1/N + b/N^2) fit error
    oneTermModelMaxErr, // C(1 - 1/N) fit error (larger)
    verdict,
  }),

  interpretation: Object.freeze({
    subleadingIsClosedForm:
      'The imp-3441 finite-N approach is C(1 - 1/N + b/N^2 + ...) with the subleading coefficient the closed ' +
      'form b = -3/4 + 130/(63 pi) = -0.09317008, from three O(1/N^2) sources: the exact-Faulhaber first term ' +
      '(-3/4), the zero self-consistency (+90/(63 pi)), and the second Gaussian-curvature term (+40/(63 pi)).',
    negativeSubleading:
      'b < 0, so past the leading -1/N deficit the finite-N piece*N^2 sits slightly BELOW C(1 - 1/N); the ' +
      'near-exact imp-3441 N=10 match to C(1-1/N) is a cancellation between this b/N^2 and higher O(1/N^3) terms.',
    richardsonConfirms:
      'The Richardson 2 b_est(2N) - b_est(N) converges onto -0.093170 (1280->2560: -0.093169), and the ' +
      'two-term model beats the one-term model across the ladder, certifying the closed form.',
    diagnosticOnly:
      'This pins a subleading coefficient for a truncation artifact (the untruncated de Bruijn-Newman Phi is ' +
      'positive on all of R); it leaves the imp-3197/imp-3257 [0, U] usage and the imp-3066 K_a >= 0 ' +
      'operator-norm magnitude obstruction entirely untouched.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isDiagnosticMeasurement: true,
    refinesAnExistingArtifact:
      'This only derives the subleading coefficient of the imp-3441 subdominant Gaussian-curvature piece (a ' +
      'finite-truncation artifact receding to -infinity); it adds no new positivity and does not use the ' +
      'classical de Bruijn-Newman positivity.',
    derivationIsAsymptotic:
      'b = -3/4 + 130/(63 pi) is the O(1/N^2) coefficient of the ASYMPTOTIC expansion piece*N^2 = ' +
      'C(1 - 1/N + b/N^2 + O(1/N^3)); the finite-N ladder approaches it, and the numeric Richardson certifies ' +
      'it to < 1e-5 before double-precision cancellation erodes the finite difference.',
    doesNotAdvancePositivity:
      'The binding RH-equivalent residual is the operator-norm magnitude (the |Gshear| spectrum, ' +
      'imp-3066 K_a >= 0), entirely untouched here; correct signs / positivity of Phi on [0, U] were ' +
      'already necessary-but-NOT-sufficient.',
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3468_GAUSSIAN_CURVATURE_SUBLEADING_COEFFICIENT_ASSERTIONS = [
  {
    id: 'imp3468-three-pieces-compose-to-closed-form',
    why: 'The deliverable: the three O(1/N^2) sources -3/4, 4C = 90/(63 pi), (25/(4 pi))^2 q0/(4C) = ' +
         '40/(63 pi) must sum to the closed form b = -3/4 + 130/(63 pi).',
    holds: () =>
      Math.abs(B_SUBLEADING - B_CLOSED_FORM) < 1e-14 &&
      Math.abs(B_CLOSED_FORM - (-0.09317007612868589)) < 1e-12,
  },
  {
    id: 'imp3468-self-consistency-piece-is-4c',
    why: 'The self-consistency contribution must be exactly 4C = 4*5/(14 pi) = 90/(63 pi).',
    holds: () =>
      Math.abs(PIECE_B_SELF_CONSISTENCY - 4 * C_LEADING) < 1e-15 &&
      Math.abs(PIECE_B_SELF_CONSISTENCY - 90 / (63 * Math.PI)) < 1e-14,
  },
  {
    id: 'imp3468-curvature-piece-is-40-over-63-pi',
    why: 'The second-curvature contribution (25/(4 pi))^2 q0/(4C) with q0 = 256/11025 must equal 40/(63 pi).',
    holds: () =>
      Math.abs(Q_LEAD - 256 / 11025) < 1e-15 &&
      Math.abs(PIECE_C_CURVATURE - 40 / (63 * Math.PI)) < 1e-14,
  },
  {
    id: 'imp3468-richardson-matches-closed-form',
    why: 'The high-precision self-computing ladder Richardson 2 b_est(2N) - b_est(N) at 1280->2560 must ' +
         'match the closed form b = -3/4 + 130/(63 pi) to < 1e-4, certifying the derivation.',
    holds: () => richardsonAbsErr < 1e-4 && Math.abs(richardsonBest - (-0.09317)) < 5e-5,
  },
  {
    id: 'imp3468-two-term-beats-one-term',
    why: 'Adding the b/N^2 term must strictly improve the fit: the two-term model C(1 - 1/N + b/N^2) has ' +
         'smaller max error across the ladder than the one-term C(1 - 1/N), confirming b is real.',
    holds: () => twoTermModelMaxErr < oneTermModelMaxErr && twoTermModelMaxErr < 1e-5,
  },
  {
    id: 'imp3468-ladder-grounded-in-imp3441',
    why: 'The self-computed piece*N^2 must reproduce the imp-3441 climb toward C = 5/(14 pi): monotone ' +
         'increasing, and the tail (N=2560) within 1e-3 of C.',
    holds: () =>
      cells.length === 7 &&
      cells.every((c, i) => i === 0 || c.pieceTimesNphiSq > cells[i - 1].pieceTimesNphiSq) &&
      Math.abs(cells[cells.length - 1].pieceTimesNphiSq - C_LEADING) < 1e-3,
  },
  {
    id: 'imp3468-verdict-closed-form',
    why: 'The classified verdict must be the -3/4 + 130/(63 pi) closed form, not indeterminate; any flip ' +
         'means the derivation composition or the ladder certification changed.',
    holds: () => verdict === 'SUBLEADING-COEFFICIENT-IS-MINUS-THREE-QUARTERS-PLUS-130-OVER-63-PI',
  },
  {
    id: 'imp3468-honest-assessment-no-qed',
    why: 'Mandatory honesty: DERIVATION/ACCURACY only -- not a proof, not a reduction below RH, ' +
         'RH-equivalent, refines a coefficient of a truncation artifact, does not advance positivity / the ' +
         'imp-3066 magnitude obstruction, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3468_GAUSSIAN_CURVATURE_SUBLEADING_COEFFICIENT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.doesNotAdvancePositivity.length > 0 &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3468_GAUSSIAN_CURVATURE_SUBLEADING_COEFFICIENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3468-gaussian-curvature-subleading-coefficient assertion failed: ${assertion.id}`);
  }
}

export default IMP3468_GAUSSIAN_CURVATURE_SUBLEADING_COEFFICIENT;
