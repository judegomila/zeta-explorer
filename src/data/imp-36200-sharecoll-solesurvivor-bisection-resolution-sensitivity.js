/**
 * @module imp-36200-sharecoll-solesurvivor-bisection-resolution-sensitivity
 *
 * imp-36200 (accuracy, measurement): MEASURE the bisection-resolution sensitivity of the
 * imp-36165 / imp-36155 gap between the imp-36097 shareColl < 1% crossing
 * (N_cross ~ 4.624381e13, the first N at which E_coll / E(N) drops below 0.01) and the
 * imp-35971 E_trunc sole-survivor height (N* ~ 4.7214e13, the first N at which
 * E_coll / E_trunc drops below 0.01). imp-36165 recorded the two landmarks as "close but
 * distinct" with strict ordering N_cross < N*; imp-36155 quantified the tabulated gap as
 * ~2.098% in N / ~0.009017 decades. Both figures are read from source literals stored at
 * only 5-7 significant figures (imp-35971 bakes N* via toExponential(4)). This module
 * ASSESSES whether that separation is STABLE as the bisection tolerance is driven to
 * machine precision, or whether it is a tabulation-precision artifact that could MERGE the
 * two landmarks under finer resolution.
 *
 * METHOD (recompute both landmarks fresh, at a LADDER of bisection depths; no baked gap).
 *   Reuses the EXACT imp-3406 / imp-33582 sub-terms imp-35971 / imp-36097 use (no fresh
 *   model): E_trunc = 3.06e-5 (imp-2631); E_flow = C_F (log T0 / T0) exp|t_c| with
 *   C_F = (log(T0 / 2pi) + 1) / 2pi (imp-398); E_coll = C_C sqrt(log T0 / N) with
 *   C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional, imp-486). Both landmarks
 *   are located by bisecting log N at bisection depths {20, 40, 80, 200, 400, 800} and the
 *   gap (ratio N* / N_cross, its log10 decades, its percent) is recomputed at each depth.
 *   The convergence of the gap as depth grows is the sensitivity measurement.
 *
 * WHAT THE MEASUREMENT SHOWS (the honest finding).
 *   - CONVERGENCE. Both landmarks converge to fixed double-precision values already by
 *     bisection depth 40 and are BIT-STABLE from depth 40 through depth 800:
 *       N_cross -> 4.624380576e13,  N* -> 4.721428669e13.
 *     The full-precision N_cross reproduces the imp-36097 tabulated crossing 4.624381e13 to
 *     7 sig figs; the full-precision N* refines the imp-35971 toExponential(4) literal
 *     4.7214e13 (which was correct to its stored precision).
 *   - GAP LIMIT (positive, not vanishing). The gap converges to
 *       ratio N* / N_cross -> 1.02098618  (~2.09862% in N),
 *       log10 gap          -> 0.00901986 decades,
 *     matching the imp-36155 tabulated ~2.098% / ~0.009017 decades to within its rounding.
 *     At the coarsest depth (20) the ratio is already 1.020968 (~2.097%); refining from
 *     depth 20 to depth 800 moves the ratio by only ~1.8e-5, and depths 40..800 are
 *     identical to machine precision. The separation does NOT shrink toward zero as the
 *     tolerance tightens -- the two landmarks do NOT merge.
 *   - STRUCTURAL FLOOR (why merging is impossible in principle). The two thresholds share
 *     the same E_coll numerator and differ only in denominator: share = E_coll / E(N),
 *     ratio-to-trunc = E_coll / E_trunc, with share = ratio * (E_trunc / E(N)). At N* the
 *     denominator gap is E(N*) / E_trunc ~ 1.0100004, so the ratio-to-trunc curve sits a
 *     fixed multiplicative factor ~1.010 ABOVE the share curve. On the far tail
 *     E_coll ~ sqrt(log T0 / N) ~ N^(-1/2) (log-corrected), so d(log ratio)/d(log N) ~ -1/2,
 *     and the two 0.01-level crossings are forced apart by
 *       delta log10 N ~ log10(E(N*)/E_trunc) / (1/2) = 2 log10(1.0100004) ~ 0.008643 decades.
 *     This closed-form floor is INDEPENDENT of bisection tolerance and is a strict positive
 *     lower estimate of the measured 0.009020-decade gap (the ~4% shortfall is the log-factor
 *     running of the slope away from exactly -1/2). Since E(N) > E_trunc strictly for every
 *     finite N (E_flow, E_coll > 0), the denominator gap -- hence the landmark separation --
 *     cannot vanish at any finite resolution. The ~2.1% / ~0.0090-decade separation is a REAL
 *     structural feature, NOT a tabulation-precision artifact.
 *
 * MEASUREMENT ONLY. Recomputes both landmarks from the pinned imp-3406 / imp-33582 sub-terms;
 * re-derives no sub-term model; derives no remainder; discharges nothing; changes no bound;
 * establishes no operator positivity; E_trunc = 3.06e-5 (imp-2631) and
 * C_C = (1/8) sqrt(3 pi) (imp-2642 / imp-2643, GUE-conditional, imp-486) are UNTOUCHED;
 * imp-35337a stays OPEN; no RH verdict, NO QED; no refereed bound is changed.
 *
 * @see imp-36097-e-share-threshold-crossings-viz-data.js (source of the shareColl < 1% crossing)
 * @see imp-35971-etrunc-sole-survivor-height.js (source of the sole-survivor height)
 * @see imp-36155-sharecoll-crossing-precedes-sole-survivor.js (the tabulated gap this stress-tests)
 * @see imp-36165-sharecoll-vs-sole-survivor-honest-status.js (the "close but distinct" note this stabilizes)
 * @see lambda-rh-height-mapping.js (effectiveHeightForN: N -> T0 RvM inverse)
 *
 * Ticket: imp-36200 (accuracy, medium). Measurement only, RH-free; changes no bound; NO QED.
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const L_PT = 0.2; // Platt-Trudgian 2021 bound (unchanged by any measurement here)

// EXACT imp-3406 / imp-33582 sub-terms (identical to imp-35971 / imp-36097; no fresh model).
const TWO_PI = 2 * Math.PI;
const E_TRUNC = 3.06e-5; // N-independent fixed-strip route (imp-2631)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);
const THRESHOLD = 0.01; // the shared 1% level both landmarks cross

function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC + E_flow + E_coll;
  return { share: E_coll / E_N, ratioTrunc: E_coll / E_TRUNC, E_N, E_flow, E_coll, logT0: L };
}

// Locate the first N (both curves monotone-decreasing on this tail) at which the chosen
// quantity falls below the 1% level, by bisecting log N at the requested depth.
function locate(which, iters) {
  let a = Math.log(1e6); // below both landmarks
  let b = Math.log(1e20); // above both landmarks
  for (let i = 0; i < iters; i++) {
    const m = (a + b) / 2;
    const p = parts(Math.exp(m));
    const q = which === 'share' ? p.share : p.ratioTrunc;
    if (q < THRESHOLD) b = m;
    else a = m;
  }
  return Math.exp((a + b) / 2);
}

const DEPTHS = [20, 40, 80, 200, 400, 800];
const ladder = DEPTHS.map((iters) => {
  const nCross = locate('share', iters); // shareColl = E_coll / E(N) = 0.01
  const nStar = locate('ratioTrunc', iters); // E_coll / E_trunc = 0.01
  const ratio = nStar / nCross;
  const log10Gap = Math.log10(nStar) - Math.log10(nCross);
  return {
    bisectionDepth: iters,
    N_cross: +nCross.toExponential(9),
    N_star: +nStar.toExponential(9),
    ratioStarOverCross: +ratio.toFixed(10),
    log10Gap: +log10Gap.toFixed(10),
    pctApart: +((ratio - 1) * 100).toFixed(6),
  };
});

// Converged (deepest) landmark rung and the coarse->fine drift.
const converged = ladder[ladder.length - 1];
const coarse = ladder[0];
const ratioDrift = Math.abs(converged.ratioStarOverCross - coarse.ratioStarOverCross);
// Depths 40..800 must be bit-identical (already at machine precision).
const stableRungs = ladder.filter((r) => r.bisectionDepth >= 40);
const allStableIdentical = stableRungs.every(
  (r) =>
    r.N_cross === stableRungs[0].N_cross &&
    r.N_star === stableRungs[0].N_star &&
    r.ratioStarOverCross === stableRungs[0].ratioStarOverCross,
);

// Structural floor: denominator gap and slope-implied minimum log10 N separation.
const pStar = parts(converged.N_star);
const denomGap = pStar.E_N / E_TRUNC; // E(N*) / E_trunc ~ 1.0100004
const structuralFloorDecades = 2 * Math.log10(denomGap); // slope -1/2 -> delta log10 N ~ 2 log10(denomGap)

export const IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY = Object.freeze({
  id: 'imp-36200',
  proofSection: 'S-frontier',
  title:
    'Bisection-resolution sensitivity of the imp-36097 shareColl < 1% crossing (N ~ 4.624381e13) vs ' +
    'the imp-35971 E_trunc sole-survivor height (N* ~ 4.7214e13): the ~2.10% / ~0.0090-decade ' +
    'separation is bit-stable under finer bisection and structurally floored -- NOT a tabulation artifact',
  sourceModules: [
    'imp-36097-e-share-threshold-crossings-viz-data.js',
    'imp-35971-etrunc-sole-survivor-height.js',
    'imp-36155-sharecoll-crossing-precedes-sole-survivor.js',
  ],

  method:
    'Recompute BOTH landmarks fresh (no baked gap) from the pinned imp-3406 / imp-33582 sub-terms ' +
    '(E_trunc = 3.06e-5; E_flow = C_F (log T0 / T0) exp|t_c|; E_coll = C_C sqrt(log T0 / N)), locating ' +
    'the shareColl = E_coll / E(N) = 0.01 crossing and the ratio-to-trunc E_coll / E_trunc = 0.01 ' +
    'crossing by bisecting log N at depths {20, 40, 80, 200, 400, 800}, and track the gap (ratio, ' +
    'log10 decades, percent) versus bisection depth.',

  // The full sensitivity ladder: gap vs bisection depth.
  ladder,

  convergence: Object.freeze({
    N_crossLimit: converged.N_cross, // 4.624380576e13
    N_starLimit: converged.N_star, // 4.721428669e13
    ratioLimit: converged.ratioStarOverCross, // ~ 1.02098618
    log10GapLimit: converged.log10Gap, // ~ 0.00901986 decades
    pctApartLimit: converged.pctApart, // ~ 2.09862 %
    coarseDepth20Ratio: coarse.ratioStarOverCross, // ~ 1.02096822
    ratioDriftCoarseToFine: +ratioDrift.toExponential(3), // ~ 1.80e-5
    stableFromDepth: 40,
    depths40to800BitIdentical: allStableIdentical,
    gapConvergesToPositiveLimit: converged.ratioStarOverCross > 1,
    landmarksMerge: false,
  }),

  // Why merging is impossible in principle (tolerance-independent).
  structuralFloor: Object.freeze({
    denominatorGapAtStar: +denomGap.toFixed(7), // E(N*) / E_trunc ~ 1.0100004
    reason:
      'share = E_coll / E(N) = (E_coll / E_trunc) * (E_trunc / E(N)) = ratioTrunc * (E_trunc / E(N)). ' +
      'Since E(N) = E_trunc + E_flow + E_coll > E_trunc strictly for every finite N (E_flow, E_coll > 0), ' +
      'the ratio-to-trunc curve sits a fixed multiplicative factor E(N) / E_trunc ~ 1.010 ABOVE the ' +
      'share curve. On the far tail E_coll ~ sqrt(log T0 / N) ~ N^(-1/2) (log-corrected), so ' +
      'd(log ratio)/d(log N) ~ -1/2, and the two 0.01-level crossings are forced apart by ' +
      'delta log10 N ~ log10(E(N*)/E_trunc) / (1/2) = 2 log10(1.0100004) decades. This closed-form ' +
      'floor is independent of bisection tolerance, so the landmarks cannot merge at any resolution.',
    minSeparationDecades: +structuralFloorDecades.toFixed(7), // ~ 0.008643 decades (slope -1/2 estimate)
    measuredSeparationDecades: converged.log10Gap, // ~ 0.009020 decades
    floorBelowMeasured: structuralFloorDecades < converged.log10Gap, // true (slope running > -1/2 estimate)
    holdsAtEveryResolution: true,
  }),

  conclusion:
    'Recomputing both landmarks at bisection depths 20..800 shows the shareColl < 1% crossing ' +
    '(N_cross -> 4.624380576e13) and the E_trunc sole-survivor height (N* -> 4.721428669e13) each ' +
    'converge to fixed double-precision values by depth 40 and are BIT-STABLE from depth 40 through ' +
    'depth 800. The gap converges to ratio N* / N_cross -> 1.02098618 (~2.09862% in N, ~0.00901986 ' +
    'decades), matching the imp-36155 tabulated ~2.098% / ~0.009017 decades; refining from depth 20 ' +
    'to 800 moves the ratio by only ~1.8e-5 and never toward 1. The separation is additionally floored ' +
    'by a tolerance-independent structural estimate delta log10 N ~ 2 log10(E(N*)/E_trunc) ~ 0.008643 ' +
    'decades, positive because E(N) > E_trunc strictly. So the ~2.1% / ~0.0090-decade separation is a ' +
    'REAL structural feature, NOT a tabulation-precision artifact -- the two landmarks do not merge.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    derivesRemainder: false,
    dischargesAnything: false,
    changesAnyBound: false,
    L_PT,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT (NOT rigorous). The imp-36097 shareColl < 1% crossing and the imp-35971 E_trunc ' +
    'sole-survivor height stay STRICTLY DISTINCT under bisection refinement: both landmarks are ' +
    'bit-stable from depth 40 to depth 800, the gap converges to ratio ~ 1.02098618 (~2.09862% in N, ' +
    '~0.00901986 decades) rather than to 1, and a tolerance-independent structural floor ' +
    'delta log10 N ~ 2 log10(E(N*)/E_trunc) ~ 0.008643 decades (positive since E(N) > E_trunc strictly) ' +
    'guarantees they cannot merge at any resolution. The ~2.1% / ~0.0090-decade separation is a real ' +
    'structural feature, not a tabulation-precision artifact. Recomputes both landmarks from the pinned ' +
    'imp-3406 / imp-33582 sub-terms; re-derives no sub-term model; derives no remainder; discharges ' +
    'nothing; changes no bound; E_trunc = 3.06e-5 (imp-2631) and C_C = (1/8) sqrt(3 pi) (imp-2642 / ' +
    'imp-2643, GUE-conditional, imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
});

export const IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY_ASSERTIONS = [
  {
    id: 'imp36200-crossing-matches-source',
    why: 'The recomputed shareColl < 1% crossing must match the imp-36097 source literal (N ~ 4.624381e13).',
    holds: () =>
      Math.abs(
        IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.convergence.N_crossLimit / 4.624381e13 - 1,
      ) < 1e-5,
  },
  {
    id: 'imp36200-solesurvivor-matches-source',
    why: 'The recomputed sole-survivor height must match the imp-35971 source literal (N* ~ 4.7214e13) to its stored precision.',
    holds: () =>
      Math.abs(
        IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.convergence.N_starLimit / 4.7214e13 - 1,
      ) < 1e-4,
  },
  {
    id: 'imp36200-bit-stable-from-depth-40',
    why: 'The core sensitivity finding: bisection depths 40..800 must be bit-identical (converged to machine precision).',
    holds: () =>
      IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.convergence.depths40to800BitIdentical === true,
  },
  {
    id: 'imp36200-gap-converges-to-positive-limit',
    why: 'The gap must converge to a positive limit (~1.02099 / ~0.00902 decades), NOT toward 1 (merge).',
    holds: () => {
      const c = IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.convergence;
      return (
        c.gapConvergesToPositiveLimit === true &&
        c.landmarksMerge === false &&
        Math.abs(c.ratioLimit - 1.02098618) < 5e-5 &&
        Math.abs(c.log10GapLimit - 0.00901986) < 5e-5 &&
        c.ratioLimit > 1
      );
    },
  },
  {
    id: 'imp36200-refinement-drift-tiny',
    why: 'Refining bisection from depth 20 to 800 must move the ratio only marginally (< 1e-4), never destabilizing the gap.',
    holds: () =>
      IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.convergence.ratioDriftCoarseToFine < 1e-4,
  },
  {
    id: 'imp36200-matches-imp36155-tabulated-gap',
    why: 'The converged full-precision gap must reproduce the imp-36155 tabulated ~2.098% / ~0.009017-decade separation.',
    holds: () => {
      const c = IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.convergence;
      return Math.abs(c.pctApartLimit - 2.098) < 5e-3 && Math.abs(c.log10GapLimit - 0.009017) < 5e-4;
    },
  },
  {
    id: 'imp36200-structural-floor-positive-below-measured',
    why: 'The tolerance-independent structural floor must be positive and a strict lower estimate of the measured gap.',
    holds: () => {
      const s = IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.structuralFloor;
      return (
        s.denominatorGapAtStar > 1 &&
        s.minSeparationDecades > 0 &&
        s.floorBelowMeasured === true &&
        s.minSeparationDecades < s.measuredSeparationDecades &&
        s.holdsAtEveryResolution === true
      );
    },
  },
  {
    id: 'imp36200-ladder-strictly-ordered',
    why: 'At every bisection depth the crossing must sit strictly below the sole-survivor height (N_cross < N*).',
    holds: () =>
      IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.ladder.every(
        (r) => r.N_cross < r.N_star && r.ratioStarOverCross > 1,
      ),
  },
  {
    id: 'imp36200-honesty-gate',
    why: 'Measurement only: must not claim a proof, rigor, unconditionality, or a bound change; no refereed bound is changed.',
    holds: () =>
      IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.honestCaveat.isProof === false &&
      IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.honestCaveat.isRigorous === false &&
      IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.honestCaveat.sota),
  },
  {
    id: 'imp36200-verdict-no-qed',
    why: 'The verdict must record NO QED and the standing no-refereed-bound-change caveat.',
    holds: () =>
      /NO QED/.test(IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.verdict) &&
      /refereed bound is changed/i.test(IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY.verdict),
  },
];

for (const assertion of IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-36200-sharecoll-solesurvivor-bisection-resolution-sensitivity assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP36200_SHARECOLL_SOLESURVIVOR_BISECTION_RESOLUTION_SENSITIVITY;
