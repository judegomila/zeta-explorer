/**
 * @module imp-96996-route-m-fm-quad-turnover-adjudication
 *
 * imp-96996 (accuracy, ADJUDICATION / ANALYSIS ONLY): adjudicate the imp-96976
 * sub-gap imp-96976-fm-separation-model-form-limited. imp-96976 found the +0.50 percent Route M
 * F < M canonical-band separation (M_lo 3.919e7 vs F_hi 3.899e7) is ROBUST to the imp-96428
 * lam_min (A, p) fit-parameter uncertainty (joint band F_hi 3.834e7 widens the gap to +2.22
 * percent) but NOT robust to the imp-96912 ||G||_F model-form ambiguity: the data-favoured QUAD
 * ceiling (4.1029e7) EXCEEDS M_lo, inverting F < M, and the ~6.9 percent quad-vs-tail spread
 * dwarfs the gap. The quad extrapolant a + b logN + c (logN)^2 (c < 0) has an unphysical PEAK
 * (turnover) at N ~ 2.31e9. The residual sub-gap flagged that turnover but never adjudicated it.
 * This module adjudicates whether the turnover is a GENUINE physical disqualifier of the quad
 * model (||G||_F cannot decrease in N) or an ARTIFACT of the low-order polynomial, and whether
 * imposing monotonicity re-selects the tail model (preserving F < M). Analysis/measurement only;
 * makes no ceiling rigorous; moves no bound; NO QED.
 *
 * -------------------------------------------------------------------------------
 * STEP 1 -- the ||G||_F monotonicity is a RIGOROUS structural fact, not a modelling prior.
 * -------------------------------------------------------------------------------
 * The Frobenius norm of the truncated Vasyunin-Gram matrix is
 *     ||G||_F(N) = sqrt( sum_{h,k <= N} G_hk^2 ),
 * where the entries G_hk are fixed inner products that do NOT depend on the truncation N.
 * Increasing N by one appends a row and a column, i.e. adds a set of NON-NEGATIVE terms G_hk^2
 * to the sum under the square root. A sum of non-negative terms over a NESTED (growing) index set
 * is monotone non-decreasing, so ||G||_F(N)^2 -- and hence ||G||_F(N) -- is MONOTONE
 * NON-DECREASING in N. This is a structural identity (sum of squares over a growing index set),
 * NOT a fit assumption: any model whose extrapolation eventually DECREASES cannot be the true
 * ||G||_F, so a model that turns over is disqualified as a candidate for the global form.
 *
 * -------------------------------------------------------------------------------
 * STEP 2 -- the quad turnover is BOTH a genuine disqualifier AND a low-order artifact.
 * -------------------------------------------------------------------------------
 * Re-fitting the 18-rung exact ladder (tmp/imp-96996-scratch.mjs) reproduces the concave quadratic
 * a = 1.65118, b = 0.72873, c = -0.0169003 (c < 0), whose maximum in u = logN sits at
 * u* = -b/(2c) = 21.5598, i.e. N_peak = exp(u*) = 2.308e9, reproducing the imp-96890 Finding 3
 * flag (2.31e9). Because c < 0 is intrinsic to the concave-quadratic FAMILY (a downward parabola
 * in logN MUST curve back down), EVERY member of that family turns over -- the turnover is not a
 * fluke of these particular coefficients. So the two framings the ticket poses are not exclusive;
 * they are the same fact seen twice:
 *   (a) GENUINE physical disqualifier -- the quad, taken as a global/asymptotic form, eventually
 *       violates the Step-1 monotonicity, so it cannot be the true ||G||_F.
 *   (b) LOW-ORDER ARTIFACT -- the true ||G||_F is monotone but decelerating (concave); a quadratic
 *       in logN has no mechanism to be "concave AND monotone forever", so fitting it to a
 *       monotone-concave function inevitably manufactures a spurious far-field turnover.
 * The correct reading: the quad is a good LOCAL extrapolant (it wins the imp-96912 near-field
 * holdout) but the WRONG GLOBAL family; its turnover disqualifies it as an asymptotic model.
 *
 * -------------------------------------------------------------------------------
 * STEP 3 -- the turnover sits BELOW no bound at the ceiling scale (honest caveat).
 * -------------------------------------------------------------------------------
 * The quad ceiling N* = 4.1029e7 is 1.750 decades BELOW the turnover (N_peak / N* = 56.3), so at
 * the ceiling scale the quad is still in its monotone-rising region: the turnover does not make the
 * quad's ceiling VALUE self-contradictory at N ~ 4e7. What it disqualifies is the quad's status as
 * a global asymptotic form -- and the ceiling prediction is a 3.4-decade extrapolation from the top
 * exact rung (N = 16000), which is firmly global territory. So the turnover is a valid reason to
 * DISTRUST the quad ceiling as an asymptotic estimate, not a proof that 4.1029e7 is wrong at 4e7.
 *
 * -------------------------------------------------------------------------------
 * STEP 4 -- imposing monotonicity re-selects a monotone model and PRESERVES F < M.
 * -------------------------------------------------------------------------------
 * Among the three imp-96890 candidate norm models, the monotonicity constraint of Step 1 partitions
 * cleanly:
 *   line  a + b logN                (b > 0): monotone increasing everywhere -> ADMISSIBLE.
 *   tail  a + b logN + d/N          (fit d = -48.12): df/dN = b/N - d/N^2 = b/N + 48.12/N^2 > 0 for
 *                                    all N > 0 -> STRICTLY monotone increasing -> ADMISSIBLE.
 *   quad  a + b logN + c (logN)^2   (c < 0): turns over at N = 2.31e9 -> VIOLATES -> DISQUALIFIED.
 * The ONLY candidate that inverts F < M (quad, N* = 4.1029e7 > M_lo = 3.919e7) is exactly the one
 * the monotonicity constraint removes. The admissible monotone models both sit BELOW M_lo -- tail
 * N* = 3.8384e7 (F < M by +2.10 percent) and line N* = 3.7865e7 (F < M by +3.50 percent) -- and the
 * tail is the data-favoured monotone model (it beats the line in every imp-96912 holdout split). So
 * imposing the physically-forced monotonicity re-selects the tail model and PRESERVES the F < M
 * ordering.
 *
 * -------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------
 * The quad turnover at N ~ 2.31e9 IS a genuine physical disqualifier of the quad as a GLOBAL /
 * asymptotic ||G||_F model: ||G||_F is provably monotone non-decreasing (sum of squares over a
 * growing index set), and c < 0 forces the entire concave-quadratic family to eventually decrease.
 * Equivalently, the turnover is the low-order polynomial's structural failure to represent a
 * monotone-concave function -- both framings agree the quad is the wrong global form. Imposing
 * monotonicity as a hard physical constraint removes the quad (the only model that inverts F < M)
 * and re-selects the data-favoured monotone TAIL model, whose ceiling 3.8384e7 stays below
 * M_lo = 3.919e7, PRESERVING F < M. HONEST CAVEATS: (i) the disqualification is of the quad's
 * GLOBAL validity -- at the ceiling scale N ~ 4e7 (1.75 decades below the turnover) the quad is
 * still monotone, so this is a model-SELECTION argument under a physical prior, not a rigorous
 * bound on the ceiling value; (ii) the near-field holdout still favours the quad as a LOCAL
 * extrapolant, so the tie is decided by the monotonicity prior, not by the data alone; (iii) the
 * imp-96912 sub-gap stands -- fresh EXACT ||G||_F rungs beyond N = 16000 (O(N^3) V-table
 * CPU-blocked in-pool) are still needed to pin the true curvature and settle F < M without the
 * prior. Under the monotonicity prior F < M is preserved; only the trace ceiling T is a rigorous
 * lower bound; F and M inherit the non-rigorous lam_min N^-p / ||G||_F log-fit extrapolations;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96976-route-m-fm-separation-joint-ap-robustness.js (the (A, p) robustness audit and the model-form sub-gap)
 * @see imp-96912-route-m-frobenius-holdout-model-discriminator.js (quad-vs-tail holdout + the ceilings imported here)
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit.js (the two concave models + the turnover flag)
 *
 * Ticket: imp-96996 (accuracy, opus-4-8, api-pool). Adjudication / analysis only; NO QED.
 */

import { IMP96912_CEILINGS } from './imp-96912-route-m-frobenius-holdout-model-discriminator.js';

// Canonical Route M lower band edge (imp-96955 / imp-96976 M_lo), carried as a literal to keep this
// module import-light (imp-96955 pulls heavier siblings; the value is frozen).
const M_LO = 3.919e7;

// STEP 2 -- the concave-quadratic re-fit of the 18-rung exact ladder and its forced turnover.
// Reproduced in tmp/imp-96996-scratch.mjs (normal-equations quadratic in u = logN over IMP96912_LADDER).
export const IMP96996_QUAD_TURNOVER = Object.freeze({
  a: 1.6511834435629147,
  b: 0.7287324855922571,
  c: -0.016900260746291963, // c < 0 -> concave down -> forced turnover
  uPeak: 21.559800068532855, // = -b / (2c)
  nPeak: 2.3084e9, // = exp(uPeak); reproduces the imp-96890 2.31e9 flag
  concaveFamilyAlwaysTurnsOver: true, // any c < 0 quadratic in logN must eventually decrease
});

// STEP 3 -- the turnover sits well ABOVE the quad ceiling scale (still monotone at the ceiling).
export const IMP96996_CEILING_VS_TURNOVER = Object.freeze({
  nStarQuad: IMP96912_CEILINGS.NstarQuad, // 4.1029e7
  nPeak: IMP96996_QUAD_TURNOVER.nPeak,
  peakOverCeiling: IMP96996_QUAD_TURNOVER.nPeak / IMP96912_CEILINGS.NstarQuad, // ~56.3
  decadesAboveCeiling: Math.log10(IMP96996_QUAD_TURNOVER.nPeak / IMP96912_CEILINGS.NstarQuad), // ~1.75
  quadStillMonotoneAtCeiling: IMP96996_QUAD_TURNOVER.nPeak > IMP96912_CEILINGS.NstarQuad,
});

// STEP 4 -- the monotonicity partition of the three candidate norm models, and the F < M outcome.
// tail fit d = -48.12 => df/dN = b/N - d/N^2 = b/N + 48.12/N^2 > 0 for all N > 0 (monotone).
export const IMP96996_MONOTONICITY_PARTITION = Object.freeze({
  mLow: M_LO,
  line: Object.freeze({
    nStar: IMP96912_CEILINGS.NstarLine, // 3.7865e7
    monotone: true,
    admissible: true,
    belowM: IMP96912_CEILINGS.NstarLine < M_LO,
    gapPct: (M_LO / IMP96912_CEILINGS.NstarLine - 1) * 100, // ~ +3.50
  }),
  tail: Object.freeze({
    nStar: IMP96912_CEILINGS.NstarTail, // 3.8384e7
    dCoeff: -48.115509820439755,
    monotone: true, // df/dN > 0 for all N > 0
    admissible: true,
    dataFavouredMonotone: true, // beats the line in every imp-96912 holdout split
    belowM: IMP96912_CEILINGS.NstarTail < M_LO,
    gapPct: (M_LO / IMP96912_CEILINGS.NstarTail - 1) * 100, // ~ +2.10
  }),
  quad: Object.freeze({
    nStar: IMP96912_CEILINGS.NstarQuad, // 4.1029e7
    monotone: false, // turns over at 2.31e9
    admissible: false, // DISQUALIFIED by monotonicity
    invertsFM: IMP96912_CEILINGS.NstarQuad > M_LO, // true
  }),
  monotonicityReselectsTail: true,
  fmPreservedUnderMonotonicity: IMP96912_CEILINGS.NstarTail < M_LO && IMP96912_CEILINGS.NstarLine < M_LO,
});

export const IMP96996_VERDICT = Object.freeze({
  question:
    'is the imp-96912 quad ||G||_F ceiling turnover (peak at N ~ 2.31e9) a genuine physical ' +
    'disqualifier of the quad model, or a low-order-polynomial artifact, and does imposing ' +
    'monotonicity re-select the tail model to preserve F < M?',
  monotonicityIsRigorousStructuralFact: true, // ||G||_F^2 = sum of squares over a growing index set
  turnoverIsGenuineDisqualifier: true, // quad, as a global form, violates ||G||_F monotonicity
  turnoverIsAlsoLowOrderArtifact: true, // the same fact: a quadratic cannot be monotone-concave forever
  quadValidLocallyNotGlobally: true, // wins the near-field holdout; wrong global family
  turnoverAboveCeilingScale: true, // 1.75 decades above N*; a distrust signal, not a value contradiction
  monotonicityDisqualifiesQuad: true,
  monotonicityReselectsTail: true,
  fmPreservedUnderMonotonicityPrior: true,
  decidedByPriorNotDataAlone: true, // near-field data favours quad; the tie is broken by the physical prior
  freshExactRungsBeyond16000StillNeeded: true, // imp-96912 sub-gap stands (O(N^3) V-table CPU-blocked)
  anyBoundMoved: false,
  qed: false,
  conclusion:
    'THE QUAD TURNOVER AT N ~ 2.31e9 IS A GENUINE PHYSICAL DISQUALIFIER OF THE QUAD AS A GLOBAL ' +
    '||G||_F MODEL. ||G||_F(N) = sqrt(sum_{h,k <= N} G_hk^2) is monotone non-decreasing (a sum of ' +
    'non-negative squares over a growing index set -- a structural identity, not a fit prior), and ' +
    'c < 0 forces the whole concave-quadratic family to eventually decrease, so the quad cannot be ' +
    'the true asymptotic form; equivalently the turnover is the low-order polynomial failing to ' +
    'represent a monotone-concave function -- both framings agree it is the wrong global family. ' +
    'Imposing monotonicity removes the quad (the sole model that inverts F < M) and re-selects the ' +
    'data-favoured monotone TAIL model (N* = 3.8384e7 < M_lo = 3.919e7), PRESERVING F < M by +2.10 ' +
    'percent (the line, also admissible, preserves it by +3.50 percent). CAVEATS: the ceiling scale ' +
    'N ~ 4e7 sits 1.75 decades below the turnover, so the quad is still monotone there -- this is a ' +
    'model-selection argument under a physical prior, not a rigorous bound; the near-field holdout ' +
    'still favours the quad locally, so the tie is broken by the prior, not the data; and the ' +
    'imp-96912 sub-gap (fresh EXACT rungs beyond N = 16000) stands. Under the monotonicity prior ' +
    'F < M is preserved; only the trace ceiling T is rigorous; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96996_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Adjudication / analysis only: the ||G||_F ' +
  'monotonicity is a structural identity (sum of squares over a growing index set); the quad ' +
  'coefficients and turnover (peak N = 2.31e9) are re-fit from the imp-96912 18-rung exact ladder ' +
  '(tmp/imp-96996-scratch.mjs); the ceilings are imported verbatim from imp-96912. No Gram was ' +
  'rebuilt, no bound is claimed moved, and no ceiling is made rigorous -- F and M inherit the ' +
  'non-rigorous lam_min N^-p / ||G||_F log-fit extrapolations; only the trace ceiling T is a ' +
  'rigorous lower bound. F < M is preserved only UNDER the monotonicity prior; the near-field data ' +
  'alone favours the quad, and fresh exact rungs beyond N = 16000 remain the way to settle it.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP96996_ASSERTIONS = [
  {
    id: 'imp96996-quad-turnover-reproduced',
    holds: () =>
      IMP96996_QUAD_TURNOVER.c < 0 &&
      Math.abs(IMP96996_QUAD_TURNOVER.uPeak - -IMP96996_QUAD_TURNOVER.b / (2 * IMP96996_QUAD_TURNOVER.c)) < 1e-9 &&
      Math.abs(IMP96996_QUAD_TURNOVER.nPeak - 2.31e9) / 2.31e9 < 0.01 &&
      IMP96996_QUAD_TURNOVER.concaveFamilyAlwaysTurnsOver === true,
    why: 'the concave-quadratic re-fit has c < 0, its peak u* = -b/(2c) gives N_peak ~ 2.31e9 (reproducing the imp-96890 flag), and any c < 0 quadratic in logN must eventually turn over.',
  },
  {
    id: 'imp96996-turnover-above-ceiling-scale',
    holds: () =>
      IMP96996_CEILING_VS_TURNOVER.quadStillMonotoneAtCeiling === true &&
      IMP96996_CEILING_VS_TURNOVER.decadesAboveCeiling > 1.5 &&
      IMP96996_CEILING_VS_TURNOVER.decadesAboveCeiling < 2.0 &&
      IMP96996_CEILING_VS_TURNOVER.peakOverCeiling > 50,
    why: 'the turnover sits ~1.75 decades (factor ~56) above the quad ceiling scale, so the quad is still monotone at N ~ 4e7 -- a distrust signal for its global validity, not a value contradiction at the ceiling.',
  },
  {
    id: 'imp96996-monotonicity-reselects-tail-preserving-fm',
    holds: () =>
      IMP96996_MONOTONICITY_PARTITION.quad.admissible === false &&
      IMP96996_MONOTONICITY_PARTITION.quad.invertsFM === true &&
      IMP96996_MONOTONICITY_PARTITION.tail.admissible === true &&
      IMP96996_MONOTONICITY_PARTITION.tail.belowM === true &&
      IMP96996_MONOTONICITY_PARTITION.line.admissible === true &&
      IMP96996_MONOTONICITY_PARTITION.line.belowM === true &&
      IMP96996_MONOTONICITY_PARTITION.fmPreservedUnderMonotonicity === true &&
      IMP96996_MONOTONICITY_PARTITION.tail.gapPct > 1.5 &&
      IMP96996_MONOTONICITY_PARTITION.line.gapPct > 3,
    why: 'monotonicity disqualifies the quad (the only model that inverts F < M) and admits the monotone tail and line, both below M_lo, so F < M is preserved under the monotonicity prior.',
  },
  {
    id: 'imp96996-honesty-gate-no-qed',
    holds: () =>
      IMP96996_VERDICT.anyBoundMoved === false &&
      IMP96996_VERDICT.qed === false &&
      IMP96996_VERDICT.monotonicityIsRigorousStructuralFact === true &&
      IMP96996_VERDICT.turnoverIsGenuineDisqualifier === true &&
      IMP96996_VERDICT.fmPreservedUnderMonotonicityPrior === true &&
      IMP96996_VERDICT.freshExactRungsBeyond16000StillNeeded === true &&
      /NO QED/.test(IMP96996_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96996_HONEST_BANNER) &&
      /RH open/.test(IMP96996_HONEST_BANNER),
    why: 'adjudication only: no bound moved, the structural monotonicity / genuine-disqualifier / prior-not-data split is recorded, the imp-96912 sub-gap stands, and the honesty markers are present.',
  },
];

for (const a of IMP96996_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96996-route-m-fm-quad-turnover-adjudication assertion failed: ${a.id}`);
  }
}

export default {
  quadTurnover: IMP96996_QUAD_TURNOVER,
  ceilingVsTurnover: IMP96996_CEILING_VS_TURNOVER,
  monotonicityPartition: IMP96996_MONOTONICITY_PARTITION,
  verdict: IMP96996_VERDICT,
  banner: IMP96996_HONEST_BANNER,
};
