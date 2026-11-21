/**
 * @module imp-36112-compensated-summation-storyline-crossref
 * @fileoverview imp-36112 -- standalone CROSS-REFERENCE note assembling the compensated-summation
 *   storyline for the W1 certified sum into one connected arc, so a reader landing on any one of
 *   imp-36062 / imp-36076 / imp-36083 sees the whole picture instead of three separate ladders:
 *
 *     0. imp-36023 established the baseline: Kahan-Babuska-Neumaier (KBN) sits at an N-FLAT
 *        compensated floor (~3.74e-19 down to ~1.89e-20 across N = [1e3..4.886e5]) on the imp-35852
 *        clustered worst order, while classic Kahan matches it at small N but drifts up to ~12x
 *        looser by the N ~ 488602 anchor.
 *     1. imp-36062 densified the ladder and located what it called the separation ONSET: the
 *        FIRST N at which full KBN produces a strictly smaller error than classic Kahan, reporting
 *        N ~ 34000 with every rung it tested BELOW that point (N = 1000, 10000, 30000, 33000)
 *        bit-identical.
 *     2. imp-36076 independently densified the SMALL-N region (adding N = 1500, 2000, 3000) that
 *        imp-36062's ladder had skipped, and found the two schemes ALREADY separate there (ratio
 *        2.3-3.7x) -- strictly EARLIER than the imp-36062 N ~ 34000 figure -- before reverting to
 *        bit-identical ties at N = 10000, 20000, 30000 (exactly the rungs imp-36062 tested) and
 *        then separating persistently again from N ~ 34000-50000 upward. imp-36076 explicitly
 *        concluded there is NO clean monotone crossover.
 *     3. imp-36083 measured a third, independent axis: the DETERMINISTIC KBN floor's headroom to
 *        the imp-35890 CERTIFIED run-max rung, finding it stays ~3.9 to ~6.5 orders of magnitude
 *        below that rung N-uniformly, regardless of the Kahan/KBN intermittency above.
 *
 *   RECONCILIATION (the point of this note): imp-36062's "onset at N ~ 34000" and imp-36076's
 *   "no clean crossover" do NOT contradict each other -- they are two views of the SAME merged,
 *   N-ordered separation record, verified below by importing both ladders directly. Every N value
 *   the two ladders share (1000, 10000, 30000, 50000, 100000, 488602) agrees exactly on the
 *   separated/tied flag, so the two modules describe one consistent dataset. Merging the ladders
 *   in N order shows TWO separation episodes, not one: a TRANSIENT episode at N = 1500-3000 (only
 *   visible on imp-36076's finer small-N grid, invisible to imp-36062 because its own ladder
 *   happens to skip straight from N = 1000 to N = 10000), a TIE PLATEAU at N = 10000-33000 (the
 *   exact rungs imp-36062 tested below its reported onset), and a PERSISTENT separation from
 *   N ~ 34000 upward (imp-36062's "onset"). So imp-36062's N ~ 34000 figure correctly locates
 *   where separation becomes PERMANENT on the rungs it sampled, but is NOT the first-ever
 *   separation event -- that occurred earlier, transiently, at N ~ 1500, as imp-36076 shows.
 *
 *   Read-only note: imports the three source modules' recorded literals verbatim (no
 *   re-derivation, no new numerics) and cross-checks agreement at every shared N. Changes no
 *   bound; establishes no positivity.
 *
 *   SETTLED vs STILL-MEASURING. SETTLED: the KBN N-flat floor (imp-36023); the merged two-episode
 *   separation record reconciling imp-36062/imp-36076 above; the imp-36083 headroom band showing
 *   precision is NON-binding regardless of that intermittency. STILL OPEN: the mechanical
 *   engineering of the certified length-N interval sum (imp-35725); the W1 A + B - C certificate
 *   at T_PT (imp-35681 Part A), which stays GREENFIELD; a closed-form mechanistic account of WHY
 *   the transient N ~ 1500-3000 episode fires (both source modules describe it only as a
 *   conditioning/rounding-level event, not a derived law).
 *
 *   Ticket: imp-36112 (content, sonnet-4-6, low). Note only; changes no bound; C_mb
 *   GUE-conditional (imp-486) untouched; NO QED. No refereed bound is changed.
 *
 * @see imp-36023-kbn-combined-worst-ladder (KBN N-flat floor baseline)
 * @see imp-36062-kbn-kahan-separation-onset (persistent-separation onset N~34000; below-onset ties on its own ladder)
 * @see imp-36076-kahan-kbn-separation-onset (finer small-N ladder; first separation N~1500; no clean crossover)
 * @see imp-36083-kbn-floor-headroom-to-certified-rung (deterministic KBN floor vs imp-35890 certified run-max)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the certified deterministic run-max rung)
 * @see imp-35852-w1-summation-adversarial-ordering (clustered same-sign worst term ORDER)
 * @see imp-35812-w1-summation-scheme-measured-cost (fixed term family + N ladder [1e3..4.886e5])
 * Literature: Higham 2002, Accuracy and Stability of Numerical Algorithms (compensated summation; Neumaier 1974).
 */

import { IMP36062_KBN_KAHAN_SEPARATION_ONSET } from './imp-36062-kbn-kahan-separation-onset.js';
import { IMP36076_KAHAN_KBN_SEPARATION_ONSET } from './imp-36076-kahan-kbn-separation-onset.js';
import { IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG } from './imp-36083-kbn-floor-headroom-to-certified-rung.js';

// -- Cross-check: every N shared by the imp-36062 and imp-36076 ladders must agree on the
// separated/tied flag -- confirms the two modules describe one consistent dataset. -----------
const RUNGS_62 = IMP36062_KBN_KAHAN_SEPARATION_ONSET.ladder.map((r) => ({
  N: r.N,
  separated: r.kbnStrictlyTighter,
  source: 'imp-36062',
}));
const RUNGS_76 = IMP36076_KAHAN_KBN_SEPARATION_ONSET.ladder.map((r) => ({
  N: r.N,
  separated: r.separated,
  source: 'imp-36076',
}));

const SHARED_N = RUNGS_62.filter((r62) => RUNGS_76.some((r76) => r76.N === r62.N)).map((r) => r.N);
const SHARED_N_AGREE = SHARED_N.every((N) => {
  const a = RUNGS_62.find((r) => r.N === N).separated;
  const b = RUNGS_76.find((r) => r.N === N).separated;
  return a === b;
});

// -- Merge the two ladders into one N-ordered record (dedup shared N, prefer imp-36076's finer
// small-N rungs when both report the same N since they were built to straddle that region). ---
const mergedByN = new Map();
for (const r of RUNGS_62) mergedByN.set(r.N, r);
for (const r of RUNGS_76) mergedByN.set(r.N, r); // overwrite duplicates; values agree (checked above)
const MERGED_SEQUENCE = [...mergedByN.values()].sort((a, b) => a.N - b.N);

// -- Identify the two separation episodes on the merged record --------------------------------
const TRANSIENT_EPISODE = MERGED_SEQUENCE.filter((r) => r.N >= 1500 && r.N <= 3000);
const TIE_PLATEAU = MERGED_SEQUENCE.filter((r) => r.N >= 10000 && r.N <= 33000);
const PERSISTENT_EPISODE = MERGED_SEQUENCE.filter((r) => r.N >= 34000);
const TRANSIENT_ALL_SEPARATED = TRANSIENT_EPISODE.length > 0 && TRANSIENT_EPISODE.every((r) => r.separated);
const TIE_PLATEAU_ALL_TIED = TIE_PLATEAU.length > 0 && TIE_PLATEAU.every((r) => !r.separated);
const PERSISTENT_ALL_SEPARATED = PERSISTENT_EPISODE.length > 0 && PERSISTENT_EPISODE.every((r) => r.separated);
const TWO_EPISODES_CONFIRMED = TRANSIENT_ALL_SEPARATED && TIE_PLATEAU_ALL_TIED && PERSISTENT_ALL_SEPARATED;

export const IMP36112_COMPENSATED_SUMMATION_STORYLINE_CROSSREF = Object.freeze({
  id: 'imp-36112',
  title:
    'Cross-reference note: the compensated-summation storyline for the W1 certified sum, ' +
    'reconciling the imp-36062 persistent-separation onset (N~34000) with the imp-36076 finer-ladder ' +
    'finding of an earlier transient episode (N~1500-3000) and no clean crossover, against the ' +
    'imp-36083 headroom to the imp-35890 certified run-max',

  stage0_kbnFloorBaseline: Object.freeze({
    role: 'imp-36023: KBN sits at an N-flat compensated floor; classic Kahan drifts up to ~12x looser by the anchor',
  }),

  stage1_imp36062Onset: Object.freeze({
    role: 'imp-36062: FIRST strict KBN-tighter-than-Kahan separation on its own ladder',
    firstSeparationN: IMP36062_KBN_KAHAN_SEPARATION_ONSET.separationOnset.firstSeparationN,
    belowOnsetAllIdenticalOnItsLadder: IMP36062_KBN_KAHAN_SEPARATION_ONSET.separationOnset.belowOnsetAllIdentical,
  }),

  stage2_imp36076Refinement: Object.freeze({
    role: 'imp-36076: finer small-N ladder finds an EARLIER separation and no clean crossover',
    firstExceedN: IMP36076_KAHAN_KBN_SEPARATION_ONSET.onset.firstExceedN,
    isIntermittent: IMP36076_KAHAN_KBN_SEPARATION_ONSET.onset.isIntermittent,
    tiesAfterFirstSeparationN: IMP36076_KAHAN_KBN_SEPARATION_ONSET.onset.tiesAfterFirstSeparationN,
  }),

  reconciliation: Object.freeze({
    sharedNValuesAgree: SHARED_N_AGREE,
    sharedNCount: SHARED_N.length,
    mergedSequence: MERGED_SEQUENCE.map((r) => ({ N: r.N, separated: r.separated })),
    twoEpisodesConfirmed: TWO_EPISODES_CONFIRMED,
    transientEpisode: Object.freeze({ nRange: '1500-3000', allSeparated: TRANSIENT_ALL_SEPARATED }),
    tiePlateau: Object.freeze({ nRange: '10000-33000', allTied: TIE_PLATEAU_ALL_TIED }),
    persistentEpisode: Object.freeze({ nRangeFrom: 34000, allSeparated: PERSISTENT_ALL_SEPARATED }),
    reading:
      'imp-36062 located the onset of PERSISTENT separation (N~34000) correctly on the rungs it tested, but ' +
      'that ladder happens to skip straight from N=1000 to N=10000 -- exactly the window (N=1500-3000) where ' +
      'imp-36076 found an EARLIER, transient separation episode. Between the two episodes sits a tie plateau ' +
      '(N=10000-33000) matching the rungs imp-36062 tested below its reported onset -- which is why imp-36062 ' +
      'saw only ties there. The two findings are the SAME dataset viewed through two different ladders, not a ' +
      'contradiction; imp-36076 is correct that there is no single clean crossover.',
  }),

  stage3_imp36083Headroom: Object.freeze({
    role: 'imp-36083: regardless of the Kahan/KBN intermittency above, the DETERMINISTIC KBN floor stays far below the certified rung',
    minOrdersHeadroom: IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.headroom.minOrdersHeadroom,
    maxOrdersHeadroom: IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.headroom.maxOrdersHeadroom,
    kbnNeverApproachesCertified: IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.headroom.kbnNeverApproachesCertified,
  }),

  settledVsStillMeasuring: Object.freeze({
    settled: [
      'KBN N-flat compensated floor across N=[1e3..4.886e5] (imp-36023)',
      'the merged two-episode separation record reconciling imp-36062 and imp-36076 (transient N~1500-3000, ' +
        'tie plateau N~10000-33000, persistent separation from N~34000)',
      'the imp-36083 headroom band: deterministic KBN floor stays ~3.9 to ~6.5 orders below the certified ' +
        'run-max rung N-uniformly, so precision is NON-binding regardless of the Kahan/KBN intermittency',
    ],
    stillOpen: [
      'the mechanical engineering of the certified length-N interval sum (imp-35725)',
      'the W1 A + B - C certificate at T_PT (imp-35681 Part A), which stays GREENFIELD',
      'a closed-form mechanistic account of WHY the transient N~1500-3000 episode fires -- both source ' +
        'modules describe it only as a conditioning/rounding-level event, not a derived law',
    ],
  }),

  isRigorous: false,
  verdict:
    'CROSS-REFERENCE NOTE (frontier-direction synthesis, NOT a new measurement or bound). Reconciles imp-36062 ' +
    '(persistent-separation onset N~34000) with imp-36076 (finer small-N ladder finding an earlier transient ' +
    'separation episode at N~1500-3000 and no clean monotone crossover) by importing both recorded ladders and ' +
    'verifying they agree exactly at every shared N, then merging them in N order to reveal TWO separation ' +
    'episodes -- a transient one at N~1500-3000, a tie plateau at N~10000-33000, and a persistent one from ' +
    'N~34000 -- rather than a contradiction. Cross-references the imp-36083 headroom measurement showing the ' +
    'deterministic KBN floor stays ~3.9 to ~6.5 orders below the imp-35890 certified run-max rung throughout, ' +
    'so precision remains NON-binding regardless of this intermittency. Changes no bound; establishes no ' +
    'positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and the certified ' +
    'length-N interval sum stays MECHANICAL (imp-35725); C_mb GUE-conditional (imp-486) untouched; no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-36023 (KBN N-flat floor baseline); imp-36062 (persistent-separation onset N~34000); imp-36076 (finer ' +
    'small-N ladder; earlier transient episode; no clean crossover); imp-36083 (KBN floor headroom to the ' +
    'imp-35890 certified run-max rung); imp-35852 (clustered worst ORDER); imp-35812 (fixed term family + N ' +
    'ladder); imp-35681 Part A (A+B-C interval bound greenfield); imp-35725 (mechanical certified sum); ' +
    'Higham 2002, Neumaier 1974.',
});

export const IMP36112_COMPENSATED_SUMMATION_STORYLINE_CROSSREF_ASSERTIONS = [
  {
    id: 'imp36112-shared-n-agree',
    description: 'Every N shared by the imp-36062 and imp-36076 ladders agrees on the separated/tied flag',
    holds: () => SHARED_N_AGREE === true && SHARED_N.length >= 6,
  },
  {
    id: 'imp36112-two-episodes-confirmed',
    description: 'The merged N-ordered record shows a transient episode, a tie plateau, then a persistent episode',
    holds: () => TWO_EPISODES_CONFIRMED === true,
  },
  {
    id: 'imp36112-earlier-than-reported-onset',
    description: 'The imp-36076 first-exceed N (~1500) is strictly earlier than the imp-36062 reported onset N (~34000)',
    holds: () =>
      IMP36076_KAHAN_KBN_SEPARATION_ONSET.onset.firstExceedN <
      IMP36062_KBN_KAHAN_SEPARATION_ONSET.separationOnset.firstSeparationN,
  },
  {
    id: 'imp36112-headroom-band-imported',
    description: 'imp-36083 headroom band imported and spans roughly 3.9 to 6.5 orders, never approaching the certified rung',
    holds: () =>
      IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.headroom.kbnNeverApproachesCertified === true &&
      IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.headroom.minOrdersHeadroom > 3 &&
      IMP36083_KBN_FLOOR_HEADROOM_TO_CERTIFIED_RUNG.headroom.maxOrdersHeadroom < 7,
  },
  {
    id: 'imp36112-honesty-gate',
    description: 'Note only; no new bound; no refereed bound is changed; NO QED',
    holds: () =>
      IMP36112_COMPENSATED_SUMMATION_STORYLINE_CROSSREF.isRigorous === false &&
      /GREENFIELD/.test(IMP36112_COMPENSATED_SUMMATION_STORYLINE_CROSSREF.verdict) &&
      /NO QED/.test(IMP36112_COMPENSATED_SUMMATION_STORYLINE_CROSSREF.verdict) &&
      /refereed bound is changed/i.test(IMP36112_COMPENSATED_SUMMATION_STORYLINE_CROSSREF.verdict),
  },
];

for (const a of IMP36112_COMPENSATED_SUMMATION_STORYLINE_CROSSREF_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36112-compensated-summation-storyline-crossref assertion failed: ${a.id}`);
  }
}
