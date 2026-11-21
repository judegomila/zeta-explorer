/**
 * @module imp-95005-twistor-heat-compatibility-lemma
 *
 * imp-95005 (formalization, twistor-framework): FORMALIZE the conditional heat-compatibility
 * lemma of the Consistency-Preserving Twistor Framework -- twistor-framework Lemma 6.1
 * (Section 6.2 + eq. (12) of Def 5.1), referenced elsewhere as heat_compat_on_range
 * (see imp-95009). The lemma is a pure diagram-chase / operator-algebra identity: three
 * intertwining hypotheses compose to a fourth intertwining identity on a range subspace.
 * This module encodes the EXACT symbolic proof (three-step composition) AND checks it on a
 * faithful finite-rank surrogate that honours the "on ran(F_+)" qualifier. It is a
 * C-status conditional identity: the antecedents (the maps F_pm, the incidence I_K, and the
 * reflection R) remain O-status constructions, so the lemma proves NO bound. It certifies
 * only that the auxiliary geometric layer is logically coherent. NO QED; no refereed bound is changed.
 *
 * LEMMA 6.1 (conditional heat-compatibility on the range)
 * -------------------------------------------------------
 * Let A be the channel heat generator on a space V, R a reflection on V, F_pm: V -> V_pm the
 * two channel embeddings, Ahat_pm: V_pm -> V_pm the pushed-forward generators, and
 * I_K: V_+ -> V_- the incidence intertwiner. Assume:
 *   (i)   R A = A R                      (plain commutation of R with A; no I_K term)
 *   (ii)  I_K F_+ = F_- R                (incidence intertwining, eq. (12))
 *   (iii) Ahat_pm F_pm = F_pm A          (each pushed generator intertwines A through F_pm)
 * THEN
 *   I_K Ahat_+ = Ahat_- I_K   on ran(F_+).
 *
 * PROOF (diagram chase; exact, no analysis)
 * -----------------------------------------
 * A general element of ran(F_+) is F_+ x for x in V. Chase it around the square:
 *   I_K Ahat_+ (F_+ x)
 *     = I_K (Ahat_+ F_+) x   = I_K F_+ (A x)     by (iii)+   [Ahat_+ F_+ = F_+ A]
 *     = (I_K F_+)(A x)       = F_- R (A x)        by (ii)     [I_K F_+ = F_- R]
 *     = F_- (R A) x          = F_- (A R) x        by (i)      [R A = A R]
 *     = (F_- A)(R x)         = (Ahat_- F_-)(R x)  by (iii)-   [F_- A = Ahat_- F_-]
 *     = Ahat_- (F_- R x)     = Ahat_- (I_K F_+ x) by (ii)     [F_- R = I_K F_+]
 *     = Ahat_- I_K (F_+ x).
 * Hence (I_K Ahat_+ - Ahat_- I_K) F_+ = 0, i.e. the two agree on ran(F_+). QED-of-lemma
 * (conditional: uses only (i),(ii),(iii); no positivity, no bound). The identity is NOT
 * claimed off ran(F_+): away from the range, Ahat_+ and I_K are only pinned modulo the free
 * complement, so the square need not commute there -- the surrogate below exhibits a nonzero
 * off-range discrepancy, confirming the "on ran(F_+)" qualifier is essential.
 *
 * FINITE-RANK SURROGATE (faithful witness of the hypotheses)
 * ---------------------------------------------------------
 * V = R^2 (channel), V_+ = V_- = R^3, with F_pm: R^2 -> R^3 INJECTIVE but NOT surjective, so
 * ran(F_+) is a genuine 2-plane inside R^3 and the qualifier bites. Concretely:
 *   A = [[2,1],[0,2]] (Jordan block),  R = [[1,3],[0,1]]  (both polynomials in the nilpotent,
 *   so R A = A R exactly).
 *   F_+ = [[1,0],[0,1],[1,1]],  F_- = [[1,0],[1,1],[0,1]]  (rank 2).
 * Complete each F_pm to an invertible P_pm = [F_pm | w_pm] and set the pushed generators and
 * the incidence via the block laws that ENFORCE (ii),(iii) while leaving the off-range action
 * free (parameters b_pm, c_pm, v chosen nonzero so the off-range discrepancy is visible):
 *   Ahat_+ = P_+ [[A, b_+],[0, c_+]] P_+^-1,   Ahat_- = P_- [[A, b_-],[0, c_-]] P_-^-1,
 *   I_K    = [ F_- R | v ] P_+^-1.
 * These satisfy (i),(ii),(iii) by construction for EVERY choice of the free data, and the
 * chase above forces the conclusion on ran(F_+) regardless of that data -- which the module
 * checks numerically to ~1e-9, together with a nonzero off-range gap.
 *
 * WHAT THIS IS AND IS NOT (named sub-gap)
 * ---------------------------------------
 * NAMED SUB-GAP imp-95005a: the ticket targets an Aristotle v4.28 Lean submission of Lemma 6.1;
 * that live machine formalization is NOT performed here (our verified Aristotle toolchain is
 * v4.22, and this API-pool worker does not drive the external ATP). What IS delivered is the
 * exact symbolic diagram-chase proof plus an independent finite-rank numerical witness of both
 * the hypotheses and the conclusion (including the essential off-range failure). The lemma is
 * CONDITIONAL and C-status: its antecedents F_pm, I_K, R stay O-status constructions, so it
 * proves no bound and confers no RH verdict. Establishing the geometric layer as logically
 * coherent is the whole and only claim.
 *
 * @see imp-95009-graph-compression-cancellation-gate (uses Lemma 6.1 / heat_compat_on_range: R_- = J R_+ J^dagger)
 */

// --- tiny dense linear algebra (integers/rationals only; double precision is exact enough) ---
const matmul = (X, Y) => {
  const n = X.length, m = Y[0].length, k = Y.length;
  const out = Array.from({ length: n }, () => new Array(m).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < m; j++) {
      let s = 0;
      for (let t = 0; t < k; t++) s += X[i][t] * Y[t][j];
      out[i][j] = s;
    }
  return out;
};
const sub = (X, Y) => X.map((row, i) => row.map((v, j) => v - Y[i][j]));
const maxAbs = (X) => Math.max(...X.flat().map(Math.abs));
// 3x3 inverse via adjugate / determinant (exact for our integer P_pm).
const inv3 = (M) => {
  const [[a, b, c], [d, e, f], [g, h, i]] = M;
  const A = e * i - f * h, B = -(d * i - f * g), C = d * h - e * g;
  const det = a * A + b * B + c * C;
  const adj = [
    [A, -(b * i - c * h), b * f - c * e],
    [B, a * i - c * g, -(a * f - c * d)],
    [C, -(a * h - b * g), a * e - b * d],
  ];
  return adj.map((row) => row.map((v) => v / det));
};

// --- channel data: A the heat generator, R the reflection (R A = A R, both polys in N) ---
const A = [[2, 1], [0, 2]];
const R = [[1, 3], [0, 1]];

// --- embeddings F_pm: R^2 -> R^3, injective, non-surjective ---
const Fp = [[1, 0], [0, 1], [1, 1]];
const Fm = [[1, 0], [1, 1], [0, 1]];
// complements w_pm and invertible completions P_pm = [F_pm | w_pm]
const wp = [0, 0, 1];
const wm = [1, 0, 0];
const Pp = [[1, 0, 0], [0, 1, 0], [1, 1, 1]];
const Pm = [[1, 0, 1], [1, 1, 0], [0, 1, 0]];
const PpInv = inv3(Pp);
const PmInv = inv3(Pm);

// --- free off-range data (nonzero so the qualifier is exercised) ---
const bp = [5, -2], cp = 7; // Ahat_+ block top-right / bottom-right
const bm = [-3, 4], cm = 9; // Ahat_-
const v = [2, -1, 3]; // I_K free column

// pushed generators Ahat_pm = P_pm [[A, b_pm],[0, c_pm]] P_pm^-1
const blk = (Amat, b, c) => [
  [Amat[0][0], Amat[0][1], b[0]],
  [Amat[1][0], Amat[1][1], b[1]],
  [0, 0, c],
];
const Ahp = matmul(matmul(Pp, blk(A, bp, cp)), PpInv);
const Ahm = matmul(matmul(Pm, blk(A, bm, cm)), PmInv);

// incidence I_K = [ F_- R | v ] P_+^-1  (enforces I_K F_+ = F_- R)
const FmR = matmul(Fm, R); // 3x2
const IK = matmul([
  [FmR[0][0], FmR[0][1], v[0]],
  [FmR[1][0], FmR[1][1], v[1]],
  [FmR[2][0], FmR[2][1], v[2]],
], PpInv);

// --- hypothesis residuals (all must vanish) ---
const H_i_RAeqAR = maxAbs(sub(matmul(R, A), matmul(A, R)));
const H_iii_plus = maxAbs(sub(matmul(Ahp, Fp), matmul(Fp, A))); // Ahat_+ F_+ = F_+ A
const H_iii_minus = maxAbs(sub(matmul(Ahm, Fm), matmul(Fm, A))); // Ahat_- F_- = F_- A
const H_ii_incidence = maxAbs(sub(matmul(IK, Fp), FmR)); // I_K F_+ = F_- R

// --- conclusion residual on ran(F_+): (I_K Ahat_+ - Ahat_- I_K) F_+ = 0 ---
const onRange = maxAbs(sub(matmul(matmul(IK, Ahp), Fp), matmul(matmul(Ahm, IK), Fp)));
// off-range witness: same square applied to the complement w_+ generally does NOT vanish
const offRangeCol = (M) => M.map((row) => row[0] * wp[0] + row[1] * wp[1] + row[2] * wp[2]);
const offRangeGap = Math.max(
  ...offRangeCol(sub(matmul(IK, Ahp), matmul(Ahm, IK))).map(Math.abs),
);

export const IMP95005_TWISTOR_HEAT_COMPATIBILITY_LEMMA = {
  id: 'imp-95005',
  proofSection: 'twistor-framework',
  lemmaName: 'heat_compat_on_range',
  status: 'FORMALIZED (conditional, C-status; no bound)',
  question:
    'Formalize twistor-framework Lemma 6.1: if (i) R A = A R, (ii) I_K F_+ = F_- R, and ' +
    '(iii) Ahat_pm F_pm = F_pm A, then I_K Ahat_+ = Ahat_- I_K on ran(F_+). Pure diagram chase; ' +
    'C-status conditional identity; certifies coherence of the geometric layer, proves no bound; no QED.',
  hypotheses: {
    i_commutation: 'R A = A R (reflection commutes with the channel heat generator; no I_K term)',
    ii_incidence: 'I_K F_+ = F_- R (incidence intertwining, eq. (12) of Def 5.1)',
    iii_pushforward: 'Ahat_pm F_pm = F_pm A (each pushed generator intertwines A through F_pm)',
  },
  conclusion: 'I_K Ahat_+ = Ahat_- I_K on ran(F_+)',
  proofSteps: [
    'take F_+ x in ran(F_+)',
    'I_K Ahat_+ F_+ x = I_K F_+ (A x)   by (iii)+',
    '            = F_- R (A x)           by (ii)',
    '            = F_- (A R) x           by (i)  [R A = A R]',
    '            = Ahat_- F_- (R x)      by (iii)-',
    '            = Ahat_- I_K (F_+ x)    by (ii)',
    'so (I_K Ahat_+ - Ahat_- I_K) F_+ = 0',
  ],
  surrogate: {
    dims: 'V = R^2, V_+ = V_- = R^3, F_pm injective non-surjective (ran F_+ is a genuine 2-plane)',
    residual_H_i_RA_minus_AR: +H_i_RAeqAR.toExponential(3),
    residual_H_ii_incidence: +H_ii_incidence.toExponential(3),
    residual_H_iii_plus: +H_iii_plus.toExponential(3),
    residual_H_iii_minus: +H_iii_minus.toExponential(3),
    conclusion_residual_on_range: +onRange.toExponential(3),
    off_range_gap_nonzero: +offRangeGap.toExponential(3), // qualifier is essential
  },
  finding:
    'twistor-framework Lemma 6.1 is formalized as an exact diagram chase: the three intertwining ' +
    'hypotheses (i) R A = A R, (ii) I_K F_+ = F_- R, (iii) Ahat_pm F_pm = F_pm A compose in five ' +
    'steps to I_K Ahat_+ = Ahat_- I_K on ran(F_+), with no analysis, positivity, or bound. A faithful ' +
    'finite-rank surrogate (V = R^2, V_pm = R^3, F_pm injective non-surjective) realizes the ' +
    'hypotheses to ~1e-9 for arbitrary free off-range data and confirms the conclusion on ran(F_+) to ' +
    '~1e-9, while exhibiting a nonzero off-range gap that shows the "on ran(F_+)" qualifier is essential.',
  subGap:
    'imp-95005a: the ticket targets an Aristotle v4.28 Lean submission of Lemma 6.1; that live machine ' +
    'formalization is NOT performed here (verified toolchain is v4.22; the API-pool worker does not drive ' +
    'the external ATP). Delivered instead: the exact symbolic proof plus an independent finite-rank ' +
    'numerical witness of the hypotheses, the conclusion, and the essential off-range failure.',
  isRigorous: false, // exact diagram chase, but conditional (C-status) and antecedents are O-status
  verdict:
    'FORMALIZED CONDITIONAL LEMMA (twistor-framework, NOT an RH bound). Lemma 6.1: (i) R A = A R, ' +
    '(ii) I_K F_+ = F_- R, (iii) Ahat_pm F_pm = F_pm A imply I_K Ahat_+ = Ahat_- I_K on ran(F_+), by a ' +
    'five-step diagram chase using each hypothesis once. The identity is C-status conditional: its ' +
    'antecedents F_pm, I_K, R stay O-status constructions, so it proves no bound and confers no RH ' +
    'verdict -- it certifies only that the auxiliary geometric layer is logically coherent. A finite-rank ' +
    'surrogate witnesses the hypotheses and conclusion to ~1e-9 and shows the range qualifier is ' +
    'essential (nonzero off-range gap). Sub-gap imp-95005a: no live Aristotle v4.28 submission. ' +
    'NO QED; no refereed bound is changed.',
};

const IMP95005_ASSERTIONS = [
  {
    id: 'imp95005-hypotheses-realized',
    description: 'the surrogate satisfies (i) R A = A R, (ii) I_K F_+ = F_- R, (iii) Ahat_pm F_pm = F_pm A',
    holds: () =>
      H_i_RAeqAR < 1e-9 && H_ii_incidence < 1e-9 && H_iii_plus < 1e-9 && H_iii_minus < 1e-9,
  },
  {
    id: 'imp95005-conclusion-on-range',
    description: 'diagram-chase conclusion: (I_K Ahat_+ - Ahat_- I_K) F_+ = 0 on ran(F_+)',
    holds: () => onRange < 1e-9,
  },
  {
    id: 'imp95005-range-qualifier-essential',
    description: 'off ran(F_+) the square need not commute: nonzero off-range gap (qualifier bites)',
    holds: () => offRangeGap > 1e-3,
  },
  {
    id: 'imp95005-honesty-gate-no-qed',
    description: 'conditional C-status lemma: isRigorous false, named sub-gap imp-95005a, no QED, no refereed bound is changed',
    holds: () =>
      IMP95005_TWISTOR_HEAT_COMPATIBILITY_LEMMA.isRigorous === false &&
      /imp-95005a/.test(IMP95005_TWISTOR_HEAT_COMPATIBILITY_LEMMA.subGap) &&
      /NO QED/.test(IMP95005_TWISTOR_HEAT_COMPATIBILITY_LEMMA.verdict) &&
      /refereed bound is changed/i.test(IMP95005_TWISTOR_HEAT_COMPATIBILITY_LEMMA.verdict),
  },
];

for (const a of IMP95005_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95005-twistor-heat-compatibility-lemma assertion failed: ${a.id}`);
  }
}
