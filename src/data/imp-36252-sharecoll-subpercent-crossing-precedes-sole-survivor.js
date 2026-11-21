/**
 * @module imp-36252-sharecoll-subpercent-crossing-precedes-sole-survivor
 * @fileoverview imp-36252 (numerical, measurement): EXTEND the imp-36155 structural
 *   "crossing precedes sole-survivor" ordering from the 1% level down into the sub-1% tail.
 *   imp-36155 quantified, at the shareColl = 1e-2 level ONLY, the gap between the share-basis
 *   crossing N_cross (shareColl = E_coll / E(N) = 0.01, N ~ 4.624381e13) and the ratio-to-trunc
 *   sole-survivor-style height N* (E_coll / E_trunc = 0.01, N* ~ 4.721429e13): ratio ~ 1.020986
 *   (~2.099% in N, ~0.0090 decades), and argued N_cross < N* is STRUCTURAL (because
 *   E(N) = E_trunc + E_flow + E_coll > E_trunc, the share curve lies pointwise below the
 *   ratio-to-trunc curve, so the lower share curve reaches any fixed level at a smaller N).
 *   imp-36138 located the finer share-basis crossings at 1e-3 (N ~ 5.432330e15) and 1e-4
 *   (N ~ 6.164882e17) but NEVER paired them with the corresponding ratio-to-trunc heights.
 *
 *   THIS MODULE pairs each imp-36138 sub-1% share crossing with its ratio-to-trunc partner,
 *   located on the IDENTICAL imp-3406 / imp-33582 / imp-2642 sub-terms (E_trunc = 3.06e-5 fixed,
 *   E_flow = C_F (log T0 / T0) exp|t_c|, E_coll = C_C sqrt(log T0 / N), C_C = (1/8) sqrt(3 pi)),
 *   by the same downslope bisection, and tabulates the three gaps.
 *
 *   THE MEASURED LADDER (share crossing N_cross vs ratio-to-trunc height N*).
 *     - 1e-2 (imp-36155 anchor): N_cross ~ 4.624381e13, N* ~ 4.721429e13, N-star / N_cross ~ 1.020986
 *         (~2.099% in N, ~0.00902 decades).
 *     - 1e-3 (NEW):             N_cross ~ 5.432330e15, N* ~ 5.443525e15, N-star / N_cross ~ 1.002061
 *         (~0.206% in N, ~0.000894 decades).
 *     - 1e-4 (NEW):             N_cross ~ 6.164882e17, N* ~ 6.166146e17, N-star / N_cross ~ 1.000205
 *         (~0.0205% in N, ~0.0000891 decades).
 *
 *   THE FINDING (answers the ticket question directly).
 *     - The N_cross < N* ORDERING PERSISTS at every level -- it is guaranteed by the same
 *       structural fact imp-36155 identified (E(N) > E_trunc for all finite N), which does not
 *       weaken as sigma -> 0.
 *     - The percentage gap does NOT stay ~2% and does NOT widen -- it NARROWS by ~10x per rung
 *       (2.099% -> 0.206% -> 0.0205%), shrinking essentially in proportion to the threshold.
 *       The mechanism: at N_cross the ratio-to-trunc reads E_coll / E_trunc = thr / (1 - thr -
 *       shareFlow) ~ thr / (1 - thr), and since the ratio-to-trunc decays like N^(-1/2)
 *       (log-corrected), N-star / N_cross ~ (1 / (1 - thr))^2 ~ 1 + 2 thr. Deeper down the tail E_coll
 *       and E_flow both vanish relative to E_trunc, so the two denominators E(N) and E_trunc
 *       converge (E(N)/E_trunc -> 1) and the share-basis and ratio-to-trunc landmarks MERGE.
 *       The ~2.10% gap at the 1% level is therefore the WIDEST of the three, not a persistent
 *       floor.
 *
 *   MEASUREMENT ONLY. Imports the imp-36138 sub-1% share crossings verbatim and re-locates the
 *   ratio-to-trunc partners on the identical imp-35971 / imp-35950 sub-terms; derives no
 *   remainder; discharges nothing; changes no bound; establishes no operator positivity;
 *   E_trunc = 3.06e-5 (imp-2631) and C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643,
 *   GUE-conditional, imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED;
 *   no refereed bound is changed.
 *
 * @see imp-36155-sharecoll-crossing-precedes-sole-survivor.js (the 1%-level ordering this extends)
 * @see imp-36138-sharecoll-subpercent-threshold-crossings-viz-data.js (source of the sub-1% share crossings)
 * @see imp-35971-etrunc-sole-survivor-height.js (the ratio-to-trunc sole-survivor model reused here)
 * @see imp-35889-e-share-decomposition-at-knees.js (the three-way split both landmarks live in)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 *
 * Ticket: imp-36252 (numerical, medium). Measurement only, RH-free; changes no bound; NO QED.
 */

import { IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS } from './imp-36138-sharecoll-subpercent-threshold-crossings-viz-data.js';
import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-33582 sub-terms, identical to imp-35971 / imp-35950 / imp-36138 (no fresh model).
const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { sigma: E_coll / E_N, logT0: L, E_trunc: E_TRUNC_PT, E_flow, E_coll, E_N };
}

// First N (ratio-to-trunc decays monotonically down the tail) at which E_coll / E_trunc < thr.
// This is the imp-35971 sole-survivor locator generalised from the fixed 0.01 threshold to thr.
function ratioToTruncCrossing(thr) {
  let a = Math.log(1e6);
  let b = Math.log(1e22);
  for (let i = 0; i < 400; i++) {
    const m = (a + b) / 2;
    const p = parts(Math.exp(m));
    if (p.E_coll / E_TRUNC_PT < thr) b = m;
    else a = m;
  }
  return Math.exp((a + b) / 2);
}

// Pair each imp-36138 sub-1% share crossing with its ratio-to-trunc partner on the same sub-terms.
const LADDER = IMP36138_SHARECOLL_SUBPERCENT_CROSSINGS.map((c) => {
  const N_CROSS = c.N; // share-basis crossing (E_coll / E(N) = thr), imp-36138 literal
  const N_STAR = ratioToTruncCrossing(c.threshold); // ratio-to-trunc height (E_coll / E_trunc = thr)
  const pStar = parts(N_STAR);
  const pCross = parts(N_CROSS);
  const RATIO = N_STAR / N_CROSS;
  const LOG10_GAP = Math.log10(N_STAR) - Math.log10(N_CROSS);
  return Object.freeze({
    threshold: c.threshold,
    label: c.label.replace('shareColl<', 'thr='),
    isNew: c.isNew,
    N_cross: +N_CROSS.toExponential(6), // share-basis (imp-36138)
    log10_N_cross: c.log10_N,
    N_star: +N_STAR.toExponential(6), // ratio-to-trunc (measured here)
    log10_N_star: +Math.log10(N_STAR).toFixed(4),
    ratioStarOverCross: +RATIO.toFixed(6),
    pctApart: +((RATIO - 1) * 100).toFixed(5),
    log10Gap: +LOG10_GAP.toFixed(7),
    crossingStrictlyBelowStar: N_CROSS < N_STAR,
    // fingerprint of the ordering: at N_cross the ratio-to-trunc already reads ~ thr/(1-thr) > thr,
    ratioCollOverTruncAtCross: +(pCross.E_coll / E_TRUNC_PT).toExponential(6),
    shareCollAtStar: +pStar.sigma.toExponential(5), // slightly below thr because E(N*) > E_trunc
    logT0Star: +pStar.logT0.toFixed(4),
  });
});

// The gap narrows monotonically as the threshold tightens (ratio -> 1 deeper down the tail).
const NARROWING_FACTORS = LADDER.slice(1).map((row, i) =>
  +((LADDER[i].ratioStarOverCross - 1) / (row.ratioStarOverCross - 1)).toFixed(3),
); // ~ [10.18, 10.04]: each 10x tighter threshold roughly 10x narrower gap

export const IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR = Object.freeze({
  id: 'imp-36252',
  proofSection: 'S-frontier',
  title:
    'Extend the imp-36155 share-basis vs ratio-to-trunc ordering to the imp-36138 sub-1% ' +
    'crossings (1e-3, 1e-4): the N_cross < N* ordering PERSISTS at every level, but the N gap ' +
    'NARROWS ~10x per rung (2.099% -> 0.206% -> 0.0205%) rather than staying ~2% or widening',
  sourceModules: [
    'imp-36138-sharecoll-subpercent-threshold-crossings-viz-data.js',
    'imp-36155-sharecoll-crossing-precedes-sole-survivor.js',
    'imp-35971-etrunc-sole-survivor-height.js',
  ],

  ladder: LADDER, // three rungs: 1e-2 (imp-36155 anchor), 1e-3 (new), 1e-4 (new)
  narrowingFactors: Object.freeze(NARROWING_FACTORS), // gap shrink per 10x threshold tightening

  finding: Object.freeze({
    orderingPersists: LADDER.every((r) => r.crossingStrictlyBelowStar === true),
    gapWidens: false,
    gapNarrows: true,
    gapNarrowsPer10x: '~10x (gap ~ 1 + 2 thr, so shrinks in proportion to the threshold)',
    widestGapLevel: '1e-2 (~2.099%): the 1%-level gap is the WIDEST of the three, not a floor',
    mechanism:
      'At each share-basis crossing N_cross the ratio-to-trunc already reads E_coll / E_trunc = ' +
      'thr / (1 - thr - shareFlow) ~ thr / (1 - thr), just above thr; since the ratio-to-trunc ' +
      'decays like N^(-1/2) (log-corrected), N* / N_cross ~ (1 / (1 - thr))^2 ~ 1 + 2 thr. As ' +
      'sigma -> 0 both E_coll and E_flow vanish relative to E_trunc, so the two denominators E(N) ' +
      'and E_trunc converge (E(N) / E_trunc -> 1) and the share-basis and ratio-to-trunc landmarks ' +
      'MERGE -- hence the gap narrows deeper down the tail.',
  }),

  conclusion:
    'Pairing the imp-36138 sub-1% share-basis crossings with their ratio-to-trunc partners on the ' +
    'identical imp-3406 / imp-33582 sub-terms: at 1e-2 N* / N_cross ~ 1.020986 (~2.099%), at 1e-3 ' +
    '~ 1.002061 (~0.206%), at 1e-4 ~ 1.000205 (~0.0205%). The crossing sits STRICTLY BELOW the ' +
    'ratio-to-trunc height at every level -- the imp-36155 structural ordering (E(N) > E_trunc ' +
    'forces the share E_coll / E(N) below the ratio E_coll / E_trunc, so the share curve reaches ' +
    'any fixed level first) survives untouched into the sub-1% tail. But the ~2.10% gap is NOT a ' +
    'persistent ~2% separation and does NOT widen: it narrows by ~10x per rung, in proportion to ' +
    'the threshold, because E(N) / E_trunc -> 1 as sigma -> 0 so the two denominators converge.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    derivesRemainder: false,
    dischargesAnything: false,
    changesAnyBound: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT (NOT rigorous). Extending the imp-36155 share-basis vs ratio-to-trunc ordering to ' +
    'the imp-36138 sub-1% crossings on the identical imp-3406 / imp-33582 / imp-2642 sub-terms: the ' +
    'N_cross < N* ordering PERSISTS at 1e-2, 1e-3 and 1e-4 (structural, from E(N) > E_trunc), but the ' +
    'N gap NARROWS ~10x per rung (2.099% -> 0.206% -> 0.0205%, ratios 1.020986 -> 1.002061 -> ' +
    '1.000205) rather than staying ~2% or widening: as sigma -> 0 the denominators E(N) and E_trunc ' +
    'converge (E(N)/E_trunc -> 1) and the two landmarks merge. Imports the imp-36138 share crossings ' +
    'verbatim and re-locates the ratio-to-trunc partners with the imp-35971 sole-survivor bisection ' +
    'generalised to each threshold; re-derives no sub-term; derives no remainder; discharges nothing; ' +
    'changes no bound; E_trunc = 3.06e-5 (imp-2631) and C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, ' +
    'GUE-conditional, imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
});

export const IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR_ASSERTIONS = [
  {
    id: 'imp36252-three-rungs-1e2-1e3-1e4',
    why: 'The ladder must cover the three thresholds 1e-2 (imp-36155 anchor), 1e-3 and 1e-4 (imp-36138 sub-1%).',
    holds: () => {
      const L = IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.ladder;
      return (
        L.length === 3 &&
        Math.abs(L[0].threshold - 1e-2) < 1e-12 &&
        Math.abs(L[1].threshold - 1e-3) < 1e-12 &&
        Math.abs(L[2].threshold - 1e-4) < 1e-12
      );
    },
  },
  {
    id: 'imp36252-share-crossings-match-imp36138',
    why: 'The share-basis N_cross values must match the imp-36138 source literals (identical sub-terms).',
    holds: () => {
      const L = IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.ladder;
      return (
        Math.abs(L[0].N_cross / 4.624381e13 - 1) < 1e-5 &&
        Math.abs(L[1].N_cross / 5.432330e15 - 1) < 1e-5 &&
        Math.abs(L[2].N_cross / 6.164882e17 - 1) < 1e-5
      );
    },
  },
  {
    id: 'imp36252-anchor-reproduces-imp36155',
    why: 'The 1e-2 rung must reproduce the imp-36155 gap (N* ~ 4.7214e13, ratio ~ 1.02098, ~2.10%).',
    holds: () => {
      const a = IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.ladder[0];
      return (
        Math.abs(a.N_star / 4.7214e13 - 1) < 1e-3 &&
        Math.abs(a.ratioStarOverCross - 1.020986) < 5e-4 &&
        Math.abs(a.pctApart - 2.0986) < 5e-2
      );
    },
  },
  {
    id: 'imp36252-ordering-persists-every-level',
    why: 'The core extension: the share-basis crossing sits strictly below the ratio-to-trunc height at EVERY level.',
    holds: () =>
      IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.ladder.every(
        (r) => r.crossingStrictlyBelowStar === true && r.N_cross < r.N_star,
      ) && IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.finding.orderingPersists === true,
  },
  {
    id: 'imp36252-gap-narrows-not-widens',
    why: 'The finding: the gap narrows ~10x per rung (2.099% -> 0.206% -> 0.0205%), it does NOT stay ~2% or widen.',
    holds: () => {
      const L = IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.ladder;
      const f = IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.finding;
      return (
        L[0].pctApart > L[1].pctApart &&
        L[1].pctApart > L[2].pctApart &&
        Math.abs(L[1].pctApart - 0.206) < 5e-3 &&
        Math.abs(L[2].pctApart - 0.0205) < 5e-3 &&
        f.gapNarrows === true &&
        f.gapWidens === false
      );
    },
  },
  {
    id: 'imp36252-narrowing-tracks-tenfold',
    why: 'Each 10x tighter threshold gives a ~10x narrower gap (gap ~ 1 + 2 thr), so narrowing factors ~ 10.',
    holds: () =>
      IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.narrowingFactors.every(
        (x) => x > 8 && x < 12,
      ),
  },
  {
    id: 'imp36252-fingerprint-ratio-above-threshold-at-cross',
    why: 'At each N_cross the ratio-to-trunc reads ~ thr/(1-thr) just ABOVE the threshold -- the ordering fingerprint.',
    holds: () =>
      IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.ladder.every(
        (r) => r.ratioCollOverTruncAtCross > r.threshold && r.shareCollAtStar < r.threshold,
      ),
  },
  {
    id: 'imp36252-honesty-gate',
    why: 'Measurement only: must not claim a proof, rigor, unconditionality, or a bound change; no refereed bound is changed.',
    holds: () =>
      Math.abs(L_PT - 0.2) < 1e-15 &&
      IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.honestCaveat.isProof === false &&
      IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.honestCaveat.isRigorous === false &&
      IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.honestCaveat.sota),
  },
  {
    id: 'imp36252-verdict-no-qed',
    why: 'The verdict must record NO QED and the standing no-refereed-bound-change caveat.',
    holds: () =>
      /NO QED/.test(IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.verdict) &&
      /refereed bound is changed/i.test(IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR.verdict),
  },
];

for (const assertion of IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36252-sharecoll-subpercent-crossing-precedes-sole-survivor assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36252_SHARECOLL_SUBPERCENT_CROSSING_PRECEDES_SOLE_SURVIVOR;
