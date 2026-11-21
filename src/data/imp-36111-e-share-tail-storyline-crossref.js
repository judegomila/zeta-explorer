/**
 * @module imp-36111-e-share-tail-storyline-crossref
 * @fileoverview imp-36111 -- standalone CROSS-REFERENCE note assembling the full
 *   E(N) = E_trunc + E_flow + E_coll TAIL storyline into one connected arc, tying the
 *   roadmap sigma(N) = E_coll(N)/E(N) U-SHAPE decay to the term-share crossover
 *   sequence, so a reader landing on any one module sees the whole chain:
 *     0. the roadmap U-SHAPE (imp-3220 / imp-3406 / imp-33582): sigma(N) rises from
 *        near 0 at small N to an interior maximum sigma_max ~ 0.9494 at N ~ 9.22e5,
 *        then decays monotonically (but NOT at a fixed rate) past the peak as the
 *        constant truncation floor E_trunc slowly overtakes the vanishing
 *        GUE-conditional E_coll;
 *     1. the two imp-35853 knees on that downslope, with shares baked by imp-35977:
 *        the Kneedle elbow (sigma ~ 0.783, N ~ 2.13e8) is still COLLISION-dominated
 *        (shareColl ~ 0.783); the flattest point (sigma ~ 0.407, N ~ 7.20e9) has
 *        already flipped to TRUNCATION-dominated (shareTrunc ~ 0.592);
 *     2. the imp-35337 E_trunc = E_coll balance crossover at sigma = 1/2, sitting
 *        strictly BETWEEN the two knees (imp-35889 decomposition);
 *     3. three further tail landmarks baked by imp-36046, extending the same
 *        shareColl decay: the E_flow-1pct-of-E_trunc crossing (N ~ 4.623e8, still
 *        collision-heavy shareColl ~ 0.716, interleaved between the two knees on the
 *        N axis), the roadmap sigma < 0.1 landmark (N ~ 3.21e11, shareColl ~ 0.100),
 *        and the imp-35971 sole-survivor height (N* ~ 4.7214e13, shareTrunc ~ 0.9901,
 *        shareColl ~ 0.0099) where E_trunc stands essentially alone.
 *
 *   Read-only note: imports the four source modules' recorded literals verbatim (no
 *   re-derivation, no new numerics). Merging the imp-35977 and imp-36046 bars into one
 *   N-ordered sequence shows shareColl decaying MONOTONICALLY across all five
 *   landmarks (0.783 -> 0.716 -> 0.407 -> 0.100 -> 0.0099), the same qualitative decay
 *   the roadmap U-shape describes past its N ~ 9.22e5 peak -- these landmarks are five
 *   successive samples of that single decaying arm, not five independent findings.
 *
 *   Ticket: imp-36111 (content, sonnet-4-6, low). Note only; changes no bound; C_C
 *   GUE-conditional (imp-2642 / imp-2643 / imp-486) untouched; imp-35337a stays OPEN;
 *   no refereed bound is changed; NO QED.
 *
 * @see imp-35853-req4-required-height-continuous-sigma-knee (the two knee locators; sigma_max peak)
 * @see imp-35889-e-share-decomposition-at-knees (three-way split at the two knees; balance crossover)
 * @see imp-35977-e-share-stacked-bar-viz-data (two-knee bars baked for display)
 * @see imp-36046-e-share-tail-landmarks-viz-data (three further tail landmarks down to the sole survivor)
 * @see lambda-roadmap.js (imp-3220 / imp-3406 / imp-33582: the sigma(N) U-shape narrative)
 * Literature: Riemann-von Mangoldt counting formula; Platt-Trudgian 2021 (T_PT = 3e12, Lambda <= 0.2).
 */

import { IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE } from './imp-35853-req4-required-height-continuous-sigma-knee.js';
import { IMP35889_E_SHARE_DECOMPOSITION_AT_KNEES } from './imp-35889-e-share-decomposition-at-knees.js';
import { IMP35977_E_SHARE_BARS, IMP35977_BALANCE_CROSSOVER_SIGMA } from './imp-35977-e-share-stacked-bar-viz-data.js';
import { IMP36046_E_SHARE_TAIL_BARS } from './imp-36046-e-share-tail-landmarks-viz-data.js';

// Merge the two-knee bars (imp-35977) and the three tail bars (imp-36046) into one
// N-ordered sequence -- five successive samples of the single post-peak decay arm.
const combinedSequence = [
  IMP35977_E_SHARE_BARS[0], // Kneedle-elbow, N ~ 2.13e8
  IMP36046_E_SHARE_TAIL_BARS[0], // E_flow-1pct-crossing, N ~ 4.623e8
  IMP35977_E_SHARE_BARS[1], // Flattest-point, N ~ 7.20e9
  IMP36046_E_SHARE_TAIL_BARS[1], // Sigma-0.1-landmark, N ~ 3.21e11
  IMP36046_E_SHARE_TAIL_BARS[2], // Sole-survivor, N* ~ 4.7214e13
].sort((a, b) => a.N - b.N);

export const IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF = Object.freeze({
  id: 'imp-36111',
  title:
    'Cross-reference note: the full E(N) = E_trunc + E_flow + E_coll TAIL storyline, tying the roadmap ' +
    'sigma(N) U-SHAPE decay (imp-3220/imp-3406/imp-33582) to the two imp-35853 knees (imp-35977 bars), ' +
    'the imp-35337 balance crossover (imp-35889), and the three imp-36046 tail landmarks down to the ' +
    'imp-35971 sole-survivor height where E_trunc stands alone',

  stage0_uShapePeak: Object.freeze({
    role: 'ROADMAP U-SHAPE: sigma(N) rises to an interior maximum then decays monotonically (not fixed-rate)',
    sigmaMax: IMP35853_REQ4_REQUIRED_HEIGHT_CONTINUOUS_SIGMA_KNEE.sigmaMax,
    note: 'Peak located at N ~ 9.22e5 (imp-3406/imp-33582); every landmark below sits on the downslope past this peak.',
  }),

  stage1_twoKnees: Object.freeze({
    role: 'imp-35853 knees on the downslope; imp-35977 bakes the E(N) three-way share at each',
    kneedleElbow: Object.freeze({
      N: IMP35977_E_SHARE_BARS[0].N,
      shareColl: IMP35977_E_SHARE_BARS[0].shareColl,
      dominant: IMP35977_E_SHARE_BARS[0].dominant,
    }),
    flattestPoint: Object.freeze({
      N: IMP35977_E_SHARE_BARS[1].N,
      shareColl: IMP35977_E_SHARE_BARS[1].shareColl,
      dominant: IMP35977_E_SHARE_BARS[1].dominant,
    }),
    dominantFlipsAcrossKnees: IMP35889_E_SHARE_DECOMPOSITION_AT_KNEES.dominantTermFlips,
  }),

  stage2_balanceCrossover: Object.freeze({
    role: 'imp-35337 E_trunc = E_coll crossover, sitting strictly between the two knees',
    sigma: IMP35977_BALANCE_CROSSOVER_SIGMA,
    sitsBetweenKnees: IMP35977_BALANCE_CROSSOVER_SIGMA,
  }),

  stage3_tailLandmarks: Object.freeze({
    role: 'imp-36046 extends the same shareColl decay three further landmarks down to the sole survivor',
    eFlow1pctCrossing: Object.freeze({
      N: IMP36046_E_SHARE_TAIL_BARS[0].N,
      shareColl: IMP36046_E_SHARE_TAIL_BARS[0].shareColl,
      dominant: IMP36046_E_SHARE_TAIL_BARS[0].dominant,
    }),
    sigma0p1Landmark: Object.freeze({
      N: IMP36046_E_SHARE_TAIL_BARS[1].N,
      shareColl: IMP36046_E_SHARE_TAIL_BARS[1].shareColl,
      dominant: IMP36046_E_SHARE_TAIL_BARS[1].dominant,
    }),
    soleSurvivor: Object.freeze({
      N: IMP36046_E_SHARE_TAIL_BARS[2].N,
      shareTrunc: IMP36046_E_SHARE_TAIL_BARS[2].shareTrunc,
      shareColl: IMP36046_E_SHARE_TAIL_BARS[2].shareColl,
      dominant: IMP36046_E_SHARE_TAIL_BARS[2].dominant,
    }),
  }),

  combinedSequence: combinedSequence.map((b) => ({
    label: b.label,
    N: b.N,
    shareTrunc: b.shareTrunc,
    shareFlow: b.shareFlow,
    shareColl: b.shareColl,
    dominant: b.dominant,
  })),

  throughline:
    'The roadmap sigma(N) = E_coll(N)/E(N) U-SHAPE (imp-3220/imp-3406/imp-33582) rises to an interior ' +
    'maximum sigma_max ~ 0.9494 at N ~ 9.22e5, then decays monotonically past the peak as the constant ' +
    'truncation floor E_trunc slowly overtakes the vanishing GUE-conditional E_coll. Five landmarks sample ' +
    'that single decaying arm in increasing-N order: the imp-35853 Kneedle elbow (N ~ 2.13e8, shareColl ' +
    '~ 0.783, still collision-dominated); the imp-36046 E_flow-1pct-of-E_trunc crossing (N ~ 4.623e8, ' +
    'shareColl ~ 0.716, still collision-dominated); the imp-35853 flattest point (N ~ 7.20e9, shareColl ' +
    '~ 0.407, now truncation-dominated); the roadmap sigma < 0.1 landmark (N ~ 3.21e11, shareColl ~ 0.100); ' +
    'and the imp-35971 sole-survivor height (N* ~ 4.7214e13, shareColl ~ 0.0099, E_trunc essentially alone). ' +
    'The imp-35337 E_trunc = E_coll balance crossover at sigma = 1/2 sits strictly between the elbow/flow-' +
    'crossing pair and the flattest-point/sigma-0.1/sole-survivor trio, exactly where the dominant term ' +
    'flips from E_coll to E_trunc. Every one of these facts is a MEASUREMENT on the same imp-3406/imp-33582 ' +
    'surrogate; none derives a new remainder, discharges any obligation, or changes any bound. C_C = ' +
    '(1/8) sqrt(3 pi) (imp-2642/imp-2643) and C_mb GUE-conditional (imp-486) stay UNTOUCHED; imp-35337a ' +
    'stays OPEN; NO QED. No refereed bound is changed.',

  honestCaveat: Object.freeze({
    isProof: false,
    changesAnyBound: false,
    dischargesAnyObligation: false,
    portsAnyRoute: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'CROSS-REFERENCE NOTE (documentation only). Links the roadmap sigma(N) U-SHAPE narrative (imp-3220/' +
    'imp-3406/imp-33582) to the two imp-35853 knees (imp-35977 bars), the imp-35337 balance crossover ' +
    '(imp-35889), and the three imp-36046 tail landmarks: five successive samples of one monotonically ' +
    'decaying shareColl arm past the N ~ 9.22e5 peak, running from collision-dominated (shareColl ~ 0.783) ' +
    'down to E_trunc standing essentially alone (shareColl ~ 0.0099) at the imp-35971 sole-survivor height. ' +
    'Changes no bound; imp-35337a stays OPEN; NO QED. No refereed bound is changed.',
});

export const IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF_ASSERTIONS = [
  {
    id: 'imp36111-combined-sequence-ordered-by-N',
    why: 'The five merged landmarks must already sit in strictly increasing N order (peak-to-tail arc).',
    holds: () =>
      IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.combinedSequence.every(
        (b, i, arr) => i === 0 || b.N > arr[i - 1].N,
      ) && IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.combinedSequence.length === 5,
  },
  {
    id: 'imp36111-sharecoll-monotonically-decays-across-arc',
    why: 'The whole point of the note is that all five landmarks sample one monotonically decaying shareColl arm.',
    holds: () =>
      IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.combinedSequence.every(
        (b, i, arr) => i === 0 || b.shareColl < arr[i - 1].shareColl,
      ),
  },
  {
    id: 'imp36111-dominant-term-flips-once-at-balance-crossover',
    why: 'The dominant term must flip from E_coll to E_trunc exactly once, aligned with the sigma = 1/2 crossover.',
    holds: () => {
      const seq = IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.combinedSequence;
      const dominants = seq.map((b) => b.dominant);
      const flips = dominants.filter((d, i) => i > 0 && d !== dominants[i - 1]).length;
      return (
        flips === 1 &&
        dominants[0] === 'E_coll' &&
        dominants[dominants.length - 1] === 'E_trunc' &&
        IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.stage2_balanceCrossover.sigma === 0.5
      );
    },
  },
  {
    id: 'imp36111-peak-sigma-matches-imp35853',
    why: 'The U-shape peak reading must reproduce the imp-35853 recorded sigma_max verbatim (no re-derivation).',
    holds: () =>
      Math.abs(IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.stage0_uShapePeak.sigmaMax - 0.9494) < 5e-4,
  },
  {
    id: 'imp36111-sole-survivor-matches-imp36046',
    why: 'The final tail landmark must reproduce the imp-36046 recorded sole-survivor shares verbatim.',
    holds: () => {
      const s = IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.stage3_tailLandmarks.soleSurvivor;
      return (
        Math.abs(s.shareTrunc - 0.990099) < 1e-4 &&
        Math.abs(s.shareColl - 9.901e-3) < 1e-4 &&
        s.dominant === 'E_trunc'
      );
    },
  },
  {
    id: 'imp36111-honesty-gate',
    why: 'This is a read-only cross-reference note: it must not claim to discharge any obligation, port any route, or change any bound.',
    holds: () =>
      IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.honestCaveat.dischargesAnyObligation === false &&
      IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.honestCaveat.portsAnyRoute === false &&
      IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.honestCaveat.sota),
  },
  {
    id: 'imp36111-verdict-no-qed',
    why: 'The verdict must record NO QED and the no-refereed-bound-change floor, matching every source module.',
    holds: () =>
      /NO QED/.test(IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.verdict) &&
      /refereed bound is changed/i.test(IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF.verdict),
  },
];

for (const assertion of IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36111-e-share-tail-storyline-crossref assertion failed: ${assertion.id}`);
  }
}

export default IMP36111_E_SHARE_TAIL_STORYLINE_CROSSREF;
