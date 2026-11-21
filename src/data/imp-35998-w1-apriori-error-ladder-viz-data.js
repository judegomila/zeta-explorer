/**
 * @module imp-35998-w1-apriori-error-ladder-viz-data
 * @fileoverview imp-35998 -- lightweight viz-data module (baked literals, no heavy
 *   imports, per [[no_heavy_imports_in_pages]]) for the imp-35948 four-rung a-priori
 *   forward-error ladder for the certified length-N W1 interval sum at T_PT: the
 *   CERTIFIED deterministic running-accumulator run-max bound (imp-35890), the two
 *   probabilistic (independence-conditional, NOT certified) Wilkinson and Higham-Mary
 *   scales imp-35948 estimated, and the imp-35812 / imp-35852 ACHIEVED naive error,
 *   all normalized by Sum|t_k| at N ~ 488602.
 *
 *   The four values and the two recovered-gap fractions are copied verbatim from a
 *   plain-node evaluation of imp-35948-w1-probabilistic-sqrtN-apriori-scale.js (no
 *   dev-server ssrLoadModule, per [[verify_heavy_assertion_modules]]).
 *
 *   @see imp-35948-w1-probabilistic-sqrtN-apriori-scale.js (source measurement)
 *   @see imp-35890-w1-running-accumulator-apriori-bound (the CERTIFIED deterministic rung)
 *   @see imp-35812-w1-summation-scheme-measured-cost (the ACHIEVED naive rung)
 *   @see imp-35956-pairwise-tree-shape-ladder-viz-data.js (sibling viz-data pattern)
 *
 *   Ticket: imp-35998 (ux, low). Viz-data only, presentation/no-bound-change;
 *   RH-equivalent untouched; NO QED.
 */

// The four a-priori rungs (imp-35948), normalized by Sum|t_k|, depth-ordered from the
// CERTIFIED deterministic worst case down to the ACHIEVED naive error.
export const IMP35998_APRIORI_ERROR_LADDER = Object.freeze([
  { rung: 'DET-runMax', value: 6.408564703722003e-14, certified: true, source: 'imp-35890' },
  { rung: 'PROB-Wilkinson', value: 9.168189847459751e-17, certified: false, source: 'imp-35948' },
  { rung: 'PROB-HighamMary', value: 5.581457041579975e-17, certified: false, source: 'imp-35948' },
  { rung: 'ACHIEVED-naive', value: 3.0e-17, certified: false, source: 'imp-35812' },
]);

export const IMP35998_GAP_RECOVERY = Object.freeze({
  ordersResidualDetToAchieved: 3.3296395187848598,
  wilkinsonFractionRecovered: 0.8542898291906752,
  highamMaryFractionRecovered: 0.9190223655610399,
});

export const IMP35998_SCALES = Object.freeze({
  N: 488602, // floor(sqrt(T_PT / 4 pi)), T_PT = 3e12 (imp-35674 Part D)
  ladderLength: IMP35998_APRIORI_ERROR_LADDER.length,
  certifiedRung: 'DET-runMax',
});

export const IMP35998_APRIORI_LADDER_VIZ_DATA = {
  ticket: 'imp-35998',
  sourceTicket: 'imp-35948',
  ladder: IMP35998_APRIORI_ERROR_LADDER,
  gapRecovery: IMP35998_GAP_RECOVERY,
  scales: IMP35998_SCALES,
  note:
    'Four a-priori forward-error rungs for the certified length-N W1 interval sum at ' +
    'T_PT (N ~ 488602), strictly decreasing: the imp-35890 CERTIFIED deterministic ' +
    'run-max bound (~6.41e-14) sits ~3.33 orders above the imp-35812 ACHIEVED naive ' +
    'error (~3.0e-17). The two intermediate PROBABILISTIC (independence-conditional, ' +
    'NOT certified) scales imp-35948 estimated -- Wilkinson sqrt(N-1)*u (~9.17e-17) ' +
    'and the sharper Higham-Mary mean-square form (~5.58e-17) -- recover ~85% and ~92% ' +
    'of that residual gap respectively, identifying it as almost entirely the ' +
    '(N-1) -> sqrt(N-1) statistical factor rather than recoverable deterministic slack.',
  honest:
    'VIZ-DATA ONLY -- baked literals reproducing the imp-35948 four-rung a-priori ' +
    'error-scale ladder; adds no new derivation and changes no bound. Only the ' +
    'DET-runMax rung is a deterministic certificate (imp-35890); the two PROBABILISTIC ' +
    'rungs are independence-conditional, NOT certified. Instantiates no directed-' +
    'rounding interval; the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
    '(imp-35681 Part A); C_mb GUE-conditional (imp-486) untouched; NO QED. ' +
    'No refereed bound is changed.',
};

export const IMP35998_VIZ_ASSERTIONS = [
  {
    id: 'imp35998-ladder-four-rungs',
    description: 'ladder has exactly the four imp-35948 rungs',
    holds: () => IMP35998_APRIORI_ERROR_LADDER.length === 4,
  },
  {
    id: 'imp35998-ladder-strictly-decreasing',
    description: 'the four rungs are strictly decreasing from DET-runMax down to ACHIEVED-naive',
    holds: () =>
      IMP35998_APRIORI_ERROR_LADDER.every(
        (r, i) => i === 0 || r.value < IMP35998_APRIORI_ERROR_LADDER[i - 1].value,
      ),
  },
  {
    id: 'imp35998-only-first-rung-certified',
    description: 'only the DET-runMax rung is flagged certified; the other three are not',
    holds: () =>
      IMP35998_APRIORI_ERROR_LADDER[0].certified === true &&
      IMP35998_APRIORI_ERROR_LADDER.slice(1).every((r) => r.certified === false),
  },
  {
    id: 'imp35998-gap-recovery-fractions-ordered',
    description: 'Higham-Mary recovers a larger fraction of the residual gap than Wilkinson, both under 1',
    holds: () =>
      IMP35998_GAP_RECOVERY.highamMaryFractionRecovered > IMP35998_GAP_RECOVERY.wilkinsonFractionRecovered &&
      IMP35998_GAP_RECOVERY.wilkinsonFractionRecovered > 0.8 &&
      IMP35998_GAP_RECOVERY.highamMaryFractionRecovered < 1.0,
  },
  {
    id: 'imp35998-residual-orders-matches-ladder',
    description: 'the recorded residual-order count matches log10(detRunMax / achievedNaive)',
    holds: () => {
      const detRunMax = IMP35998_APRIORI_ERROR_LADDER[0].value;
      const achieved = IMP35998_APRIORI_ERROR_LADDER[3].value;
      const recomputed = Math.log10(detRunMax / achieved);
      return Math.abs(recomputed - IMP35998_GAP_RECOVERY.ordersResidualDetToAchieved) < 1e-6;
    },
  },
  {
    id: 'imp35998-honesty-gate-no-qed',
    description: 'honest status references viz-data-only, not-certified, greenfield, NO QED, no refereed bound is changed',
    holds: () =>
      /VIZ-DATA ONLY/.test(IMP35998_APRIORI_LADDER_VIZ_DATA.honest) &&
      /NOT certified/.test(IMP35998_APRIORI_LADDER_VIZ_DATA.honest) &&
      /GREENFIELD/.test(IMP35998_APRIORI_LADDER_VIZ_DATA.honest) &&
      /NO QED/.test(IMP35998_APRIORI_LADDER_VIZ_DATA.honest) &&
      /refereed bound is changed/i.test(IMP35998_APRIORI_LADDER_VIZ_DATA.honest),
  },
];

for (const a of IMP35998_VIZ_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35998-w1-apriori-error-ladder-viz-data assertion failed: ${a.id}`);
  }
}
