/**
 * @module imp-36179-sharecoll-decay-crossvalidation
 * @fileoverview imp-36179 (numerical): CROSS-VALIDATE the imp-36111 merged
 *   shareColl decay sequence (0.783 -> 0.716 -> 0.407 -> 0.100 -> 0.0099 across
 *   five tail landmarks) against an INDEPENDENT direct recomputation of
 *   shareColl = E_coll / (E_coll + E_trunc + E_flow) at each landmark N.
 *
 *   imp-36111 assembles its five-landmark shareColl arc by MERGING the imp-35977
 *   two-knee bars and the imp-36046 three tail bars into one N-ordered sequence
 *   and IMPORTING each bar shareColl as a baked literal (imp-35977 in turn traces
 *   back to imp-35889, imp-36046 to imp-35971). None of those baked shares was
 *   ever re-evaluated against a fresh, from-scratch computation at the exact
 *   landmark N carried in the merged sequence. This module supplies that check:
 *   at each of the five baked landmark N it independently reconstructs the three
 *   remainder terms from the pinned sub-term constants --
 *     E_trunc = 3.06e-5 (fixed strip floor, imp-2631);
 *     E_flow  = C_F (log T0 / T0) exp|t_c|, C_F = (log(T0/2pi)+1)/(2pi) (imp-398);
 *     E_coll  = C_C sqrt(log T0 / N), C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643);
 *   with T0 = effectiveHeightForN(N) the imp-3406 / imp-3220 RvM inverse -- then
 *   forms shareColl_fresh = E_coll / (E_trunc + E_flow + E_coll) and measures the
 *   drift |shareColl_fresh - shareColl_baked| landmark by landmark.
 *
 *   WHAT THE CHECK SHOWS (the honest finding). The fresh recomputation reproduces
 *   every baked bar to within a few parts in 1e4 or tighter: the worst drift is
 *   ~1.7e-4 at the Kneedle-elbow landmark (whose bar was baked as a rounded
 *   0.783, so most of the gap is display rounding, not a model discrepancy), and
 *   the other four landmarks agree to <= 2.4e-5 (the E_flow-1pct-crossing, the
 *   sigma-0.1 landmark and the sole-survivor to <= 2e-7). The fresh shareColl
 *   sequence is strictly monotonically DECREASING across the five landmarks in
 *   increasing-N order (0.7828 -> 0.7157 -> 0.4070 -> 0.1000 -> 0.0099), so the
 *   monotone-decay claim imp-36111 makes on the baked literals SURVIVES an
 *   independent computation. No tabulation drift beyond display rounding is found.
 *
 *   Cross-validation / MEASUREMENT ONLY. Recomputes shares on the SAME imp-3406 /
 *   imp-33582 surrogate the baked bars use; derives no remainder; discharges
 *   nothing; changes no bound. C_C = (1/8) sqrt(3 pi) stays GUE-CONDITIONAL (an
 *   ANSATZ on the dominant E_coll term, imp-2642 / imp-2643 / imp-486); imp-35337a
 *   stays OPEN; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-36111-e-share-tail-storyline-crossref (the merged five-landmark baked sequence cross-validated here)
 * @see imp-35889-e-share-decomposition-at-knees (the E_trunc / E_flow / E_coll model reused here)
 * @see imp-36046-e-share-tail-landmarks-viz-data (the three tail bars, source of the last three baked shares)
 * @see polymath15-constant-C-C (C_C = (1/8) sqrt(3 pi), GUE-conditional ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 RvM inverse)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';
import { IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF } from './imp-36111-e-share-tail-storyline-crossref.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-33582 sub-terms -- byte-identical to imp-35889 parts(N),
// re-stated here so the recomputation is genuinely independent of any baked share.
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // fixed-strip truncation floor (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

function freshParts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // C_C = (1/8) sqrt(3 pi), GUE-conditional
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { logT0: L, E_trunc: E_TRUNC_PT, E_flow, E_coll, E_N, shareColl: E_coll / E_N };
}

// The five baked landmarks, taken verbatim from the imp-36111 merged sequence
// (N-ordered). We recompute shareColl at each baked N and compare to the baked bar.
const bakedSequence = IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.combinedSequence;

const crossValidation = bakedSequence.map((b) => {
  const p = freshParts(b.N);
  const drift = Math.abs(p.shareColl - b.shareColl);
  return {
    label: b.label,
    N: +b.N.toExponential(4),
    logT0: +p.logT0.toFixed(4),
    shareCollBaked: b.shareColl,
    shareCollFresh: +p.shareColl.toFixed(6),
    drift: +drift.toExponential(3),
    shareTruncFresh: +(p.E_trunc / p.E_N).toFixed(6),
    shareFlowFresh: +(p.E_flow / p.E_N).toExponential(3),
  };
});

const maxDrift = Math.max(...crossValidation.map((r) => r.drift));
const freshMonotoneDecreasing = crossValidation.every(
  (r, i, arr) => i === 0 || r.shareCollFresh < arr[i - 1].shareCollFresh,
);

export const IMP36179_SHARECOLL_DECAY_CROSSVALIDATION = Object.freeze({
  id: 'imp-36179',
  proofSection: 'S-frontier',
  question:
    'Does an INDEPENDENT direct recomputation of shareColl = E_coll / (E_coll + E_trunc + E_flow) at each of ' +
    'the five imp-36111 baked landmark N reproduce the merged baked shareColl decay sequence ' +
    '(0.783 -> 0.716 -> 0.407 -> 0.100 -> 0.0099), and does the monotone decay survive the recomputation?',
  method:
    'Reconstruct the three remainder terms from the pinned sub-term constants (E_trunc = 3.06e-5 imp-2631; ' +
    'E_flow = C_F (log T0 / T0) exp|t_c|, C_F = (log(T0/2pi)+1)/(2pi) imp-398; E_coll = C_C sqrt(log T0 / N), ' +
    'C_C = (1/8) sqrt(3 pi) imp-2642/imp-2643) with T0 = effectiveHeightForN(N), form shareColl_fresh at each ' +
    'baked landmark N, and tabulate the drift |shareColl_fresh - shareColl_baked|.',
  crossValidation,
  maxDrift: +maxDrift.toExponential(3),
  freshMonotoneDecreasing,
  finding:
    'The fresh recomputation reproduces every baked bar to within a few parts in 1e4 or tighter (worst drift ' +
    '~1.7e-4 at the Kneedle-elbow landmark, whose bar was baked as a rounded 0.783; the other four agree to ' +
    '<= 2.4e-5). The fresh shareColl sequence decays strictly monotonically across the five landmarks, so the ' +
    'imp-36111 monotone-decay claim on the baked literals survives an independent computation. No tabulation ' +
    'drift beyond display rounding is found.',
  isRigorous: false,
  isUnconditional: false,
  honestCaveat: Object.freeze({
    isProof: false,
    changesAnyBound: false,
    dischargesAnyObligation: false,
    portsAnyRoute: false,
    cCollisionGueConditional: true,
    sota: 'No refereed bound is changed',
  }),
  verdict:
    'CROSS-VALIDATION (MEASUREMENT ONLY). Recomputing shareColl = E_coll / (E_coll + E_trunc + E_flow) ' +
    'directly at each of the five imp-36111 baked landmark N -- from the pinned sub-terms E_trunc = 3.06e-5 ' +
    '(imp-2631), E_flow = C_F (log T0 / T0) exp|t_c| (imp-398) and E_coll = C_C sqrt(log T0 / N) with ' +
    'C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643) -- reproduces the baked bars to within a few parts in 1e4 ' +
    '(worst ~1.7e-4 at the rounded-0.783 Kneedle elbow, <= 2.4e-5 elsewhere) and confirms the shareColl arc ' +
    'decays strictly monotonically (0.7828 -> 0.7157 -> 0.4070 -> 0.1000 -> 0.0099). The imp-36111 baked ' +
    'sequence carries no tabulation drift beyond display rounding, and its monotone-decay claim survives an ' +
    'independent recomputation. Recomputes on the same imp-3406 / imp-33582 surrogate; derives no remainder; ' +
    'discharges nothing; changes no bound; C_C stays GUE-conditional (imp-486); imp-35337a stays OPEN; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-36111 (merged five-landmark baked shareColl sequence); imp-35889 (E_trunc / E_flow / E_coll model); ' +
    'imp-36046 (three tail bars); imp-2631 (E_trunc floor); imp-398 (C_F prefactor); imp-2642 / imp-2643 ' +
    '(C_C = (1/8) sqrt(3 pi) ansatz); imp-486 (GUE-conditional caveat); imp-3220 / imp-3406 (RvM surrogate). ' +
    'Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (Lambda <= 0.2).',
});

export const IMP36179_SHARECOLL_DECAY_CROSSVALIDATION_ASSERTIONS = [
  {
    id: 'imp36179-five-landmarks-cross-validated',
    why: 'The cross-validation must cover all five merged imp-36111 landmarks (nothing dropped).',
    holds: () =>
      crossValidation.length === 5 &&
      crossValidation.length === IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.combinedSequence.length,
  },
  {
    id: 'imp36179-fresh-reproduces-baked-within-2e-4',
    why: 'A genuine cross-validation must reproduce every baked shareColl to a small drift (display-rounding scale).',
    holds: () => crossValidation.every((r) => r.drift < 2e-4) && maxDrift < 2e-4,
  },
  {
    id: 'imp36179-worst-drift-at-rounded-elbow',
    why: 'The largest drift sits at the Kneedle-elbow bar, which was baked as a rounded 0.783 (display rounding, not model error).',
    holds: () => {
      const worst = crossValidation.reduce((a, b) => (b.drift > a.drift ? b : a));
      return worst.label === 'Kneedle-elbow' && crossValidation.filter((r) => r.label !== 'Kneedle-elbow').every((r) => r.drift < 5e-5);
    },
  },
  {
    id: 'imp36179-fresh-sequence-monotonically-decays',
    why: 'The whole point: the independent shareColl sequence must decay strictly monotonically across the five landmarks in N-order.',
    holds: () => freshMonotoneDecreasing === true,
  },
  {
    id: 'imp36179-fresh-endpoints-match-storyline',
    why: 'The fresh endpoints must land at the collision-dominated elbow (~0.78) and the near-vanished sole survivor (~0.0099).',
    holds: () => {
      const first = crossValidation[0];
      const last = crossValidation[crossValidation.length - 1];
      return Math.abs(first.shareCollFresh - 0.783) < 5e-3 && Math.abs(last.shareCollFresh - 9.901e-3) < 5e-4;
    },
  },
  {
    id: 'imp36179-measurement-only-no-qed',
    why: 'Cross-validation only: not rigorous/unconditional, changes no bound, keeps C_C GUE-conditional, no refereed bound is changed, NO QED.',
    holds: () => {
      const r = IMP36179_SHARECOLL_DECAY_CROSSVALIDATION;
      return (
        Math.abs(L_PT - 0.2) < 1e-15 &&
        r.isRigorous === false &&
        r.isUnconditional === false &&
        r.honestCaveat.changesAnyBound === false &&
        r.honestCaveat.cCollisionGueConditional === true &&
        /imp-486/.test(r.verdict) &&
        /imp-35337a\s+stays\s+OPEN/.test(r.verdict) &&
        /NO QED/.test(r.verdict) &&
        /refereed bound is changed/i.test(r.verdict)
      );
    },
  },
];

for (const a of IMP36179_SHARECOLL_DECAY_CROSSVALIDATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36179-sharecoll-decay-crossvalidation assertion failed: ${a.id}`);
  }
}

export default IMP36179_SHARECOLL_DECAY_CROSSVALIDATION;
