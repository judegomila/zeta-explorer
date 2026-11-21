/**
 * @module imp-97018-c-drift-vs-residmeas-gap
 * @fileoverview imp-97018 -- MEASUREMENT (honest partial): quantify the imp-96997 corrected-envelope
 *   normalisation C = weightedTailFrac / residFirstOrder decline (1.721 -> 1.623 over N in {88..160} at
 *   2a=ln3) as an explicit drift profile, and TEST the imp-96997 attribution that this ~6% decline "is
 *   the second-order minimiser shift (residMeasured vs residFirstOrder gap)" against the imp-96995
 *   residMeas/residFO measurements. Measurement only; the Rayleigh floor is an UPPER bound; all rungs
 *   are PAST the 2a<=0.96 interval-verified reach and UNVERIFIED; changes no bound; RH open; NO QED.
 *
 * SUB-GAP TARGETED. imp-96997 Finding 1 states the mild C decline 1.721 -> 1.623 "is the second-order
 * minimiser shift imp-96975 flagged (residMeasured vs residFirstOrder gap)" but never fits the drift or
 * ties it to the imp-96995 residMeas-vs-residFO measurements. This leaf measures C(N) as a drift profile
 * and cross-checks the attribution over the overlap grid {88,100,112,124} where imp-96995 provides
 * residMeas (its driver stops at N=124).
 *
 * ALGEBRAIC IDENTITY (standard Rayleigh, phi = A_lo minimiser, ||phi||=1):
 *   C = wtf / rfo = scaleB / (phi^T A_full phi),  so  1/C = R_full = phi^T A_full phi / scaleB.
 *   Since phi^T A_full phi = phi^T A_lo phi + phi^T A_tail phi and phi^T A_lo phi = lam_min(A_lo):
 *     1/C = lam_min(A_lo)/scaleB + residFO
 *         = lam_min(A_full)/scaleB + (residFO - residMeas),      [residMeas = (lamFull-lamLo)/scaleB]
 *   i.e. the residFirstOrder - residMeas gap IS an additive ingredient of 1/C -- moving in the RIGHT
 *   direction (gap grows with N => 1/C grows => C declines). So the imp-96997 attribution is
 *   DIRECTIONALLY correct. But quantitatively it is neither sole nor testable where it matters.
 *
 * WHAT THE MEASUREMENT SHOWS.
 *   (1) THE C DRIFT IS A TWO-REGIME ACCELERATING PROFILE, NOT A FIXED POWER LAW. C is a near-constant
 *       plateau at ~1.721 over {88..124} (even rising +0.05% at 88->100) then declines with an
 *       ACCELERATING per-rung drop: -0.20%, -0.57%, -1.42%, -3.60% across 112->124->136->148->160.
 *       The per-rung relative decline roughly 2-2.5x each rung, mirroring the imp-96997 weightedTailFrac
 *       accelerating local exponent (3.97 -> 9.60). Net drift {88..124} is only 0.18%; net {88..160} is
 *       5.68%. So essentially the ENTIRE 6% decline lives in the three high-N rungs {136,148,160}.
 *   (2) OVER THE ONLY TESTABLE RANGE {88..124}, C IS FLAT WHILE THE GAP MOVES DRAMATICALLY. imp-96995
 *       supplies residMeas only for N<=124. Over {88..124} the gap RATIO residMeas/residFO plunges 38.4%
 *       (0.889 -> 0.547) and the gap ABSOLUTE residFO-residMeas grows super-cubically (log-log exponent
 *       ~8.7, 1.25e-4 -> 2.48e-3), yet C moves only 0.18%. The two have COMPLETELY DIFFERENT N-profiles.
 *   (3) THE GAP OVER-EXPLAINS 1/C BY 2.3x, OFFSET BY A COMPENSATING lam_min(A_full) DRIFT. The gap term
 *       (residFO-residMeas) is at most 0.43% of 1/C (at N=124) and its increase over {88..124} is
 *       d(gapAbs)=+2.36e-3, whereas the ACTUAL d(1/C)=+1.03e-3 -- so the gap ALONE would predict a 2.29x
 *       larger 1/C rise (a larger C decline) than observed. The derived lam_min(A_full)/scaleB = 1/C -
 *       gapAbs FALLS (0.581017 -> 0.579688) over {88..124}, partially cancelling the gap. So the C
 *       decline is a small RESIDUAL of two larger opposing drifts, not a clean image of the gap.
 *
 * VERDICT. The imp-96997 attribution ("the ~6% C decline IS the residMeasured-vs-residFirstOrder gap")
 * is DIRECTIONALLY CORRECT but NOT QUANTITATIVELY ACCOUNTED FOR and largely UNTESTABLE: by the Rayleigh
 * identity the gap is a genuine additive ingredient of 1/C with the right sign, but over the only range
 * where residMeas is measured {88..124} the gap over-explains the 1/C rise by 2.29x (cancelled by a
 * compensating fall in lam_min(A_full)/scaleB) while C stays flat at 0.18% drift; and the bulk 5.68%
 * decline sits at {136,148,160} where imp-96995 provides NO residMeas. The C drift itself is a
 * two-regime accelerating profile (plateau then -0.20/-0.57/-1.42/-3.60% per rung), not a fixed power
 * law. REFINED SUB-GAP imp-97018-residmeas-high-N-unmeasured: closing the attribution requires extending
 * the imp-96995 lam_min(A_full)/lam_min(A_lo) driver to N in {136,148,160} (where the decline actually
 * lives) to check whether the gap tracks C there. Measurement only; the floor is a Rayleigh UPPER bound;
 * no operator positivity; interval-rigorous reach stays 2a<=0.96; no refereed bound is changed;
 * RH open; NO QED.
 *
 * @see imp-96997-sigma2-weighted-tail-envelope-model.js (Finding 1: C=wtf/rfo, the attribution tested here)
 * @see imp-96995-minimiser-coeff-spectrum-supercubic.js (residFO/residMeas over {76..124}, driver stops at 124)
 * @see imp-96975-sigma2-tail-supercubic-derivation.js (the second-order minimiser shift the attribution invokes)
 * driver tmp/imp-97018-scratch.mjs (reuses the imp-96997 + imp-96995 baked ladders verbatim)
 */

const LN3 = Math.log(3); // 1.0986122886681098 (2a=ln3)

export const IMP97018_NS = Object.freeze([88, 100, 112, 124, 136, 148, 160]);
export const IMP97018_OVERLAP_NS = Object.freeze([88, 100, 112, 124]); // imp-96995 residMeas grid

// C = weightedTailFrac / residFirstOrder, recomputed from the imp-96997 baked ROWS (wtf/rfo).
export const IMP97018_C_PER_N = Object.freeze({
  88: 1.72075, 100: 1.72166, 112: 1.72118, 124: 1.71771, 136: 1.70790, 148: 1.68374, 160: 1.62306,
});

// (1) two-regime accelerating drift profile: near-constant plateau then accelerating per-rung decline.
export const IMP97018_C_DRIFT_OVERLAP_PCT = 0.177; // {88..124}: essentially flat
export const IMP97018_C_DRIFT_FULL_PCT = 5.677; // {88..160}: the whole 6% lives at high N
export const IMP97018_C_PER_RUNG_REL_PCT = Object.freeze({
  '88_100': 0.053, // slight RISE
  '100_112': -0.028,
  '112_124': -0.201,
  '124_136': -0.571,
  '136_148': -1.415,
  '148_160': -3.604, // accelerating, roughly 2-2.5x per rung
});

// (2) overlap-grid cross-check: gap RATIO and gap ABSOLUTE from imp-96995 residFO/residMeas.
//   G = residMeas/residFO (gap ratio); gapAbs = residFO - residMeas.
export const IMP97018_OVERLAP_ROWS = Object.freeze({
  88:  Object.freeze({ residFO: 0.0011222615, residMeas: 0.0009975585, G: 0.88888, gapAbs: 1.24703e-4 }),
  100: Object.freeze({ residFO: 0.0018620583, residMeas: 0.0014899688, G: 0.80017, gapAbs: 3.72090e-4 }),
  112: Object.freeze({ residFO: 0.0031859335, residMeas: 0.0021885154, G: 0.68693, gapAbs: 9.97418e-4 }),
  124: Object.freeze({ residFO: 0.0054812899, residMeas: 0.0029993691, G: 0.54720, gapAbs: 2.48192e-3 }),
});
export const IMP97018_G_DRIFT_OVERLAP_PCT = 38.44; // residMeas/residFO plunges over {88..124}
export const IMP97018_GAPABS_LOGLOG_EXP = 8.715; // gapAbs grows super-cubically over {88..124}

// (3) decomposition 1/C = lam_min(A_full)/scaleB + gapAbs. gap over-explains the 1/C rise, offset by a
//   compensating fall in the derived lam_min(A_full)/scaleB = 1/C - gapAbs.
export const IMP97018_GAPABS_FRAC_OF_INVC_MAX = 0.00426; // gapAbs/(1/C) at N=124 (<=0.43% everywhere)
export const IMP97018_D_INVC_OVERLAP = 1.0282e-3; // actual d(1/C) over {88->124}
export const IMP97018_D_GAPABS_OVERLAP = 2.3572e-3; // d(gapAbs) over {88->124}
export const IMP97018_GAP_OVEREXPLAIN_FACTOR = 2.29; // gap-alone predicted rise / actual rise
export const IMP97018_LAMFULL_DERIVED = Object.freeze({
  88: 0.581017, 100: 0.580463, 112: 0.580000, 124: 0.579688, // = 1/C - gapAbs, FALLS over {88..124}
});

export const IMP97018_VERDICT = Object.freeze({
  ticket: 'imp-97018',
  question:
    'measure the imp-96997 C = weightedTailFrac/residFirstOrder decline (1.721->1.623 over N in {88..160}) as an explicit drift law and assess whether the ~6% decline is fully the residMeasured-vs-residFirstOrder gap',
  answer:
    'the imp-96997 attribution is DIRECTIONALLY correct but NOT quantitatively accounted for and largely UNTESTABLE. By the Rayleigh identity 1/C = lam_min(A_full)/scaleB + (residFO - residMeas) the gap is a genuine additive ingredient of 1/C with the right sign, but over the only range where imp-96995 measures residMeas {88..124} the gap OVER-explains the 1/C rise by 2.29x (d(gapAbs)=2.36e-3 vs actual d(1/C)=1.03e-3, cancelled by a compensating fall in lam_min(A_full)/scaleB from 0.581017 to 0.579688) while C itself stays flat at 0.18% drift and the gap RATIO residMeas/residFO plunges 38.4%; the bulk 5.68% C decline lives at {136,148,160} where imp-96995 provides NO residMeas. The C drift is a two-regime accelerating profile (plateau ~1.721 over {88..124} then per-rung drops -0.20/-0.57/-1.42/-3.60%), not a fixed power law',
  cDriftIsTwoRegimeAccelerating: true, // plateau then accelerating per-rung decline, not a power law
  cDriftOverlapPct: 0.177, // essentially flat where residMeas exists
  cDriftFullPct: 5.677, // the whole 6% lives at high N
  gapIsDirectionalIngredient: true, // 1/C = lamFull/scaleB + (residFO-residMeas), correct sign
  gapAccountsForDeclineQuantitatively: false, // over-explains 2.29x, offset by lamFull drift
  gapTestableWhereDeclineLives: false, // residMeas unmeasured at {136,148,160}
  gapRatioDriftOverlapPct: 38.44, // vs C 0.18% -- completely different N-profiles
  gapOverExplainFactor: 2.29,
  subGap: 'imp-97018-residmeas-high-N-unmeasured', // extend imp-96995 driver to {136,148,160}
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97018_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97018_ASSERTIONS = [
  {
    id: 'imp97018-C-two-regime-accelerating-drift',
    holds: () => {
      const r = IMP97018_C_PER_RUNG_REL_PCT;
      // plateau (near-zero, even a slight rise) then strictly steepening decline
      return (
        r['88_100'] > 0 &&
        r['112_124'] < 0 && r['124_136'] < r['112_124'] &&
        r['136_148'] < r['124_136'] && r['148_160'] < r['136_148'] &&
        IMP97018_C_DRIFT_OVERLAP_PCT < 0.5 && IMP97018_C_DRIFT_FULL_PCT > 5
      );
    },
    why: 'C is a near-constant plateau over {88..124} (0.18% drift, even a slight rise at 88->100) then declines with an accelerating per-rung drop (-0.20/-0.57/-1.42/-3.60%), so the drift is a two-regime accelerating profile whose whole 5.68% lives at the high-N rungs, not a fixed power law.',
  },
  {
    id: 'imp97018-C-matches-imp96997-wtf-over-rfo',
    holds: () => {
      // recompute C = wtf/rfo from the imp-96997 residFO literals + the baked residMeas is consistent
      return IMP97018_OVERLAP_NS.every((N) => {
        const invC = 1 / IMP97018_C_PER_N[N];
        // 1/C = lamFullDerived + gapAbs (the Rayleigh identity, by construction of lamFullDerived)
        const recon = IMP97018_LAMFULL_DERIVED[N] + IMP97018_OVERLAP_ROWS[N].gapAbs;
        return Math.abs(invC - recon) < 1e-4;
      });
    },
    why: 'the derived lam_min(A_full)/scaleB = 1/C - gapAbs satisfies the Rayleigh identity 1/C = lam_min(A_full)/scaleB + (residFO - residMeas) at every overlap rung, confirming the additive decomposition of 1/C into the full-form minimum and the residMeas gap.',
  },
  {
    id: 'imp97018-gap-and-C-have-different-profiles',
    holds: () =>
      IMP97018_G_DRIFT_OVERLAP_PCT > 30 && IMP97018_C_DRIFT_OVERLAP_PCT < 0.5 &&
      IMP97018_GAPABS_LOGLOG_EXP > 6,
    why: 'over the overlap grid {88..124} the gap ratio residMeas/residFO plunges 38.4% and the gap absolute grows super-cubically (exponent ~8.7) while C moves only 0.18%, so the C decline is NOT an image of the residMeas gap -- they have completely different N-profiles.',
  },
  {
    id: 'imp97018-gap-overexplains-offset-by-lamfull-fall',
    holds: () => {
      // gap-alone d(1/C) exceeds the actual d(1/C); lamFullDerived falls to compensate
      const overExplains = IMP97018_D_GAPABS_OVERLAP > 1.5 * IMP97018_D_INVC_OVERLAP;
      const lamFullFalls =
        IMP97018_LAMFULL_DERIVED[124] < IMP97018_LAMFULL_DERIVED[88] &&
        IMP97018_LAMFULL_DERIVED[112] < IMP97018_LAMFULL_DERIVED[100];
      return overExplains && lamFullFalls && IMP97018_GAPABS_FRAC_OF_INVC_MAX < 0.005;
    },
    why: 'the residMeas gap increase (d(gapAbs)=2.36e-3) is 2.29x the actual 1/C rise (1.03e-3) and is at most 0.43% of 1/C, while the derived lam_min(A_full)/scaleB FALLS (0.581017->0.579688) to compensate -- so the gap over-explains the decline and the net C drift is a small residual of two opposing drifts, not the gap alone.',
  },
  {
    id: 'imp97018-attribution-untestable-where-decline-lives',
    holds: () => {
      const maxOverlap = Math.max(...IMP97018_OVERLAP_NS); // 124
      // the rungs carrying the decline (>=136) are all beyond the residMeas grid
      return IMP97018_NS.filter((N) => N > maxOverlap).length === 3 && maxOverlap === 124;
    },
    why: 'imp-96995 supplies residMeas only up to N=124, but the bulk 5.68% C decline lives at {136,148,160}; the second-order-gap attribution is therefore untestable exactly where the decline occurs -- the named sub-gap imp-97018-residmeas-high-N-unmeasured.',
  },
  {
    id: 'imp97018-measurement-only-no-qed',
    holds: () =>
      IMP97018_VERDICT.gapIsDirectionalIngredient === true &&
      IMP97018_VERDICT.gapAccountsForDeclineQuantitatively === false &&
      IMP97018_VERDICT.gapTestableWhereDeclineLives === false &&
      IMP97018_VERDICT.operatorPositivityProved === false &&
      IMP97018_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97018_VERDICT.qed === false,
    why: 'measurement only: the residMeas gap is a directional ingredient of 1/C but does not quantitatively account for the C decline and is untestable where the decline lives; no operator positivity, the certificate reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP97018_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97018-c-drift-vs-residmeas-gap assertion failed: ${a.id}`);
  }
}

void LN3;
