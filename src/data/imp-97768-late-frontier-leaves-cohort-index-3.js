/**
 * @module imp-97768-late-frontier-leaves-cohort-index-3
 * @fileoverview imp-97768 -- META cross-reference index (part 3) grouping the seven late-frontier
 *   leaves imp-97673/97675/97736/97742/97743/97744/97746 -- shipped as an undifferentiated run after
 *   the imp-97674 index stopped at imp-97647 -- into their parent programs: Route-M MCM cap/gap-law,
 *   sigma far-tail/fold-amplitude surrogate, and presentation. Index/meta only; establishes nothing
 *   new; changes no bound; NO QED.
 *
 *   THE ROUTE-M MCM CAP/GAP-LAW SUB-COHORT (four tickets: two honest-status/robustness notes plus two
 *   independent extended-precision cross-checks of the gap-law residual ladder and the SNR-threshold
 *   cap-scaling exponent).
 *     imp-97673 -- standalone honest-status note recording the imp-97640 named sub-gap
 *       IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6 (the residual decay exponent is a
 *       7-sig-fig cancellation past p~2e6 in IEEE double) AND that imp-97659 already resolved it: the
 *       dps=30 recompute shows the exponent neither climbs nor saturates -- it OSCILLATES
 *       (q_local from -6.738 to +28.721, with a negative rung); MCM stays refuted from omega=11.
 *     imp-97675 -- Concepts glossary headword naming the imp-97647 "omega=10 cap-robustness" result:
 *       the +7.520579e-5 omega=10 primorial-extremality gap survives the d<=1000->5000->10000 divisor-
 *       cap sweep (drift <1.4e-10, dwarfed by the <5.6805e-11 tail-budget bound), so it is NOT a
 *       d<=1000 truncation artifact; MCM onset stays exactly omega=11.
 *     imp-97736 -- reconciles the imp-97724 0.240-vs-0.215 SNR-threshold cap-scaling exponent gap by
 *       reproducing it exactly at dps=30, extending to a fourth precision dps=36, and showing the
 *       residual is cap-metric JITTER (recovered-remainder relative error oscillates 0.03..4.6 near the
 *       crossing; a 6.25e-17 Glaisher-constant change moves the dps=30 SNR=1 cap 2847849->2182639,
 *       ~30 percent) rather than a clean threshold bias -- under a consistent full-precision constant
 *       the gap HALVES (0.0251->0.0094); dps=42 (~2.4e9 terms, ~3h) is an infeasible standing sub-gap.
 *     imp-97742 -- re-evaluates three representative rungs (smallest/mid/largest p) of the imp-97659/
 *       imp-97722 gap-law residual ladder from scratch at mpmath dps=40, a live 5e8 sieve: agreement
 *       with the baked dps=30/35 literals is ~10.46 significant figures at minimum -- the ladder is a
 *       genuine mathematical signal, not a dps=30/35 precision artifact.
 *
 *   THE SIGMA FAR-TAIL / FOLD-AMPLITUDE SURROGATE SUB-COHORT (two tickets, both sensitivity/pinning
 *   measurements on the imp-3406/imp-33582/imp-97662/imp-97725 surrogate component model).
 *     imp-97743 -- measures the imp-97725 square-root-fold amplitude K's sensitivity to the imp-2631
 *       E_trunc floor across the 0.5x..5x sweep: K rises monotonically from 0.363295 to 0.606688
 *       (factor ~1.67, exponent q~+0.221, shallow and POSITIVE) -- an order of magnitude less floor-
 *       sensitive than the imp-33708 far-tail landmark N (~E_trunc^-2.0) or the imp-33684 interior peak
 *       N_max (~E_trunc^-1.375), and the sign is opposite (K grows with the floor; landmark N shrinks).
 *     imp-97744 -- pins the exact imp-97723 F2 far-tail diagnostic crossing heights in closed form by
 *       inverting the bare RvM slope (L=1/(1-t), T0=2pi e^L, N=(L-1)e^L): t=0.99/0.995/0.999 land at
 *       N~2.66e45/1.44e89/1.97e437, confirming the imp-97723 "near 1e45"/"near 1e89" estimates and
 *       adding the 0.999 rung and a new 0.9999 rung (N~8.81e4346), self-consistent with the imp-97723
 *       bisection to <0.06 in log10 N.
 *
 *   THE PRESENTATION SUB-COHORT (one ticket, an import-light viz-data leaf over already-measured
 *   numbers).
 *     imp-97746 -- charts the imp-97724 MCM kernel-precision cap-scaling ladder d*(dps) vs 1/eps
 *       across dps=16/24/30 (caps 1233/97965/2847849) with the fitted eps^-1/4 line and the SNR=1 vs
 *       SNR>=10 threshold comparison, and cross-references the imp-97736 finding that the SNR-threshold
 *       gap is cap-metric jitter, not the slow-log correction; reuses both verbatim, no new computation.
 *
 *   WHY GROUP THESE (not re-derive). All seven are late-frontier leaves committed in immediate
 *   succession that read, on their own, as an undifferentiated batch continuing past the imp-97674
 *   index's stopping point (imp-97647). Grouped by parent program, the Route-M quartet settles the
 *   gap-law/cap-robustness/SNR-jitter reconciliation, the sigma pair extends the surrogate's
 *   sensitivity/pinning cohort, and the presentation leaf visualizes an already-measured fit. This
 *   index bakes that split so a future scout can find, at a glance, which of the three groups each
 *   leaf belongs to.
 *
 *   MEASURED/DERIVED (all cohort verdicts; no new numerics beyond what each ticket already committed).
 *   - imp-97640 residual-decay sub-gap is precision-limited past p~2e6 AND already resolved by
 *     imp-97659: the exponent oscillates, it neither climbs nor saturates (imp-97673).
 *   - omega=10 primorial-extremality gap (+7.520579e-5) is robust to the divisor cap by >1.3e6x
 *     margin; MCM onset stays exactly omega=11 (imp-97675).
 *   - the imp-97724 0.240-vs-0.215 SNR-threshold exponent gap is cap-metric jitter (rel 0.03..4.6),
 *     not a clean threshold bias; a consistent full-precision Glaisher constant halves the gap; dps=42
 *     is an infeasible standing sub-gap (imp-97736).
 *   - the gap-law residual ladder reproduces at dps=40 to >=10.46 significant figures across all three
 *     representative rungs -- not a dps=30/35 precision artifact (imp-97742).
 *   - the fold amplitude K is only gently E_trunc-floor-sensitive (exponent ~+0.221), an order of
 *     magnitude less sensitive than the landmark-N cohort, and with opposite sign (imp-97743).
 *   - the far-tail diagnostic crossing heights are pinned exactly by RvM inversion at t=0.99/0.995/
 *     0.999/0.9999, matching the imp-97723 bisection to <0.06 in log10 N (imp-97744).
 *   - the imp-97724 cap-scaling ladder and eps^-1/4 fit are charted verbatim with the jitter caveat
 *     cross-referenced (imp-97746).
 *
 *   NOT ESTABLISHED (what stays open at the end of this batch).
 *   - no new coercivity constant or positive lambda_2 lower bound anywhere; interval-rigorous certified
 *     reach stays EXACTLY 2a<=0.96 (unaffected by this batch, which touches Route-M/sigma-surrogate
 *     leaves only).
 *   - MCM stays verified-not-proved; onset stays omega=11, unchanged by imp-97675/97736/97742.
 *   - the imp-97736 dps=42 rung stays an infeasible standing sub-gap (model-extrapolated only, not
 *     measured); do not re-attempt without a full-precision Glaisher constant.
 *   - the far-tail/fold-amplitude diagnostics stay conditional-share measurements on the inherited
 *     surrogate, NOT RH bounds (imp-97743/97744).
 *
 *   STATUS: a grouping/index note over seven already-completed tickets, not a new derivation. No bound
 *   changes: interval-rigorous certified reach stays 2a<=0.96; MCM onset stays omega=11; RH open;
 *   NO QED. Platt-Trudgian Lambda <= 0.2 SOTA.
 *
 * @see imp-97673-gap-law-decay-subgap-precision-limited-honest-status.js (residual-decay sub-gap honest status, already resolved by imp-97659)
 * @see imp-97675-omega10-cap-robustness-glossary-headword.js (omega=10 cap-robustness headword)
 * @see imp-97736-mcm-cap-jitter-dps36.js (SNR-threshold gap reconciled as cap-metric jitter, dps=36 rung)
 * @see imp-97742-route-m-ladder-dps40-crosscheck.js (dps=40 cross-check of the gap-law residual ladder)
 * @see imp-97743-fold-amplitude-etrunc-floor-sensitivity.js (fold-amplitude K floor sensitivity)
 * @see imp-97744-fartail-diagnostic-crossing-heights.js (far-tail diagnostic crossing heights, RvM inversion)
 * @see imp-97746-mcm-dps-cap-scaling-viz-data.js (cap-scaling viz-data leaf, imports imp-97736)
 * @see imp-97674-late-frontier-leaves-cohort-index-2.js (predecessor meta index: imp-97640..97647)
 *
 * Ticket: imp-97768 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the interval-rigorous certified reach

const ROUTE_M_CAP_GAP_LAW_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97673',
    step: 'record the imp-97640 named sub-gap IMP97640_RESIDUAL_DECAY_EXPONENT_PRECISION_LIMITED_PAST_2E6 as a standalone honest-status note',
    result:
      'the residual decay exponent is undecidable in IEEE double past p~2e6 (7-sig-fig cancellation), ' +
      'AND imp-97659 already resolved it: the dps=30 recompute shows the exponent neither climbs nor ' +
      'saturates -- it OSCILLATES (q_local from -6.738 to +28.721); MCM stays refuted from omega=11.',
  }),
  Object.freeze({
    id: 'imp-97675',
    step: 'glossary headword naming the imp-97647 omega=10 cap-robustness result',
    result:
      'the +7.520579e-5 omega=10 primorial-extremality gap is robust across divisor caps ' +
      'd<=1000/5000/10000 (drift <1.4e-10, dwarfed by the <5.6805e-11 tail-budget bound) -- not a ' +
      'd<=1000 truncation artifact; MCM onset stays exactly omega=11.',
  }),
  Object.freeze({
    id: 'imp-97736',
    step: 'reconcile the imp-97724 0.240-vs-0.215 SNR-threshold cap-scaling exponent gap across a fourth precision rung dps=36',
    result:
      'the gap is cap-metric JITTER (relative error 0.03..4.6 near the crossing, a 6.25e-17 Glaisher ' +
      'change moves the dps=30 SNR=1 cap 2847849->2182639, ~30 percent), not a clean threshold bias -- ' +
      'a consistent full-precision constant halves the gap (0.0251->0.0094); dps=42 is an infeasible ' +
      'standing sub-gap.',
  }),
  Object.freeze({
    id: 'imp-97742',
    step: 're-evaluate three representative rungs of the gap-law residual ladder from scratch at mpmath dps=40',
    result:
      'agreement with the baked dps=30/35 literals is >=10.46 significant figures at minimum across ' +
      'smallest/mid/largest p -- the ladder is a genuine signal, not a dps=30/35 precision artifact.',
  }),
]);

const SIGMA_FARTAIL_FOLD_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97743',
    step: 'measure the imp-97725 fold amplitude K sensitivity to the imp-2631 E_trunc floor across the 0.5x..5x sweep',
    result:
      'K rises monotonically 0.363295->0.606688 (factor ~1.67, exponent q~+0.221, shallow and ' +
      'POSITIVE) -- an order of magnitude less floor-sensitive than the landmark-N cohort ' +
      '(imp-33708 ~-2.0, imp-33684 ~-1.375), with the opposite sign.',
  }),
  Object.freeze({
    id: 'imp-97744',
    step: 'pin the imp-97723 F2 far-tail diagnostic crossing heights in closed form via RvM inversion',
    result:
      't=0.99/0.995/0.999 land at N~2.66e45/1.44e89/1.97e437 (plus a new 0.9999 rung at N~8.81e4346), ' +
      'confirming the imp-97723 estimates and matching its bisection to <0.06 in log10 N.',
  }),
]);

const PRESENTATION_SUBCOHORT = Object.freeze([
  Object.freeze({
    id: 'imp-97746',
    step: 'chart the imp-97724 MCM cap-scaling ladder d*(dps) vs 1/eps with the fitted eps^-1/4 line and SNR comparison',
    result:
      'reuses imp-97724 verbatim (caps 1233/97965/2847849 at dps=16/24/30) and cross-references the ' +
      'imp-97736 jitter finding; no new computation.',
  }),
]);

export const IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3 = Object.freeze({
  id: 'imp-97768',
  proofSection: 'S-frontier',
  routeMCohort: ROUTE_M_CAP_GAP_LAW_SUBCOHORT,
  sigmaFartailFoldCohort: SIGMA_FARTAIL_FOLD_SUBCOHORT,
  presentationCohort: PRESENTATION_SUBCOHORT,
  measuredSignal:
    'seven late-frontier measurement/derivation leaves (imp-97673/97675/97736/97742/97743/97744/97746), ' +
    'grouped by parent program: four Route-M MCM cap/gap-law leaves (residual-decay honest status, ' +
    'omega=10 cap-robustness headword, SNR-threshold jitter reconciliation, dps=40 ladder cross-check), ' +
    'two sigma far-tail/fold-amplitude surrogate leaves (floor-sensitivity measurement, RvM crossing-' +
    'height pinning), and one presentation leaf (cap-scaling viz-data).',
  namedResiduals: [
    'IMP97673_RESIDUAL_DECAY_SUBGAP_HONEST_STATUS_AND_RESOLVED',
    'IMP97675_OMEGA10_CAP_GAP_ROBUST_HEADWORD',
    'IMP97736_SNR_THRESHOLD_GAP_IS_CAP_METRIC_JITTER',
    'IMP97742_GAP_LAW_LADDER_DPS40_CONFIRMED_10P46_SIGFIGS',
    'IMP97743_FOLD_AMPLITUDE_K_GENTLY_FLOOR_SENSITIVE',
    'IMP97744_FARTAIL_CROSSING_HEIGHTS_RVM_PINNED',
    'IMP97746_CAP_SCALING_VIZ_PRESENTATION_ONLY',
  ],
  certifiedReach: 0.96,
  routeM97736Dps42Infeasible: true,
  routeM97736MinAgreementSigFigsImp97742: 10.46,
  routeM97675OnsetOmega: 11,
  sigma97743KScalingExponent: 0.221,
  sigma97744Crossing0p999LogN: 437.294,
  lowerBoundOnLambda2Proved: false,
  coercivityConstantProved: false,
  mcmProved: false,
  anyBoundMoved: false,
  question:
    'The seven late-frontier leaves imp-97673/97675/97736/97742/97743/97744/97746, committed after the ' +
    'imp-97674 index stopped at imp-97647, read as an undifferentiated batch. Split by program -- ' +
    'Route-M MCM cap/gap-law (imp-97673/97675/97736/97742) versus sigma far-tail/fold-amplitude ' +
    'surrogate (imp-97743/97744) versus presentation (imp-97746) -- does each group settle a distinct ' +
    'question with a distinct verdict, and does none move any bound?',
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). The Route-M quartet (imp-97673/97675/97736/97742) ' +
    'settles the gap-law/cap-robustness/SNR-jitter reconciliation: the residual-decay sub-gap is ' +
    'precision-limited but already resolved (oscillates, does not climb or saturate), the omega=10 cap ' +
    'gap is robust to the divisor cap, the SNR-threshold exponent gap is cap-metric jitter rather than a ' +
    'clean threshold bias, and the gap-law ladder reproduces at dps=40 to >=10.46 significant figures. ' +
    'The sigma pair (imp-97743/97744) extends the surrogate sensitivity/pinning cohort: the fold ' +
    'amplitude K is only gently floor-sensitive (opposite sign and an order of magnitude smaller than ' +
    'the landmark-N cohort), and the far-tail diagnostic crossing heights are pinned exactly by RvM ' +
    'inversion. The presentation leaf (imp-97746) charts the cap-scaling fit verbatim with the jitter ' +
    'caveat cross-referenced. No bound moves in any group: interval-rigorous certified reach stays ' +
    'EXACTLY 2a<=0.96, MCM stays verified-not-proved with onset unchanged at omega=11, and the ' +
    'imp-97736 dps=42 rung stays an infeasible standing sub-gap. RH open; NO QED. Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97673 (residual-decay sub-gap honest status, resolved by imp-97659); imp-97675 (omega=10 cap-' +
    'robustness headword); imp-97736 (SNR-threshold gap reconciled as cap-metric jitter); imp-97742 ' +
    '(dps=40 gap-law ladder cross-check); imp-97743 (fold-amplitude K floor sensitivity); imp-97744 ' +
    '(far-tail crossing heights, RvM inversion); imp-97746 (cap-scaling viz-data presentation).',
  ln3: LN3,
});

export default IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3_ASSERTIONS = [
  {
    id: 'imp97768-routeM-subcohort-has-all-four-members',
    why: 'The Route-M split must contain exactly the four cap/gap-law leaves; a missing member silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.routeMCohort.map((c) => c.id);
      return (
        ids.length === 4 &&
        ids.includes('imp-97673') &&
        ids.includes('imp-97675') &&
        ids.includes('imp-97736') &&
        ids.includes('imp-97742')
      );
    },
  },
  {
    id: 'imp97768-sigma-fartail-fold-subcohort-has-both-members',
    why: 'The sigma far-tail/fold-amplitude split must contain exactly these two surrogate-sensitivity leaves.',
    holds: () => {
      const ids = IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.sigmaFartailFoldCohort.map((c) => c.id);
      return ids.length === 2 && ids.includes('imp-97743') && ids.includes('imp-97744');
    },
  },
  {
    id: 'imp97768-presentation-subcohort-has-the-one-member',
    why: 'The presentation split must contain exactly the one viz-data leaf, not overlap the other groups.',
    holds: () => {
      const ids = IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.presentationCohort.map((c) => c.id);
      return ids.length === 1 && ids.includes('imp-97746');
    },
  },
  {
    id: 'imp97768-seven-tickets-total-no-overlap',
    why: 'The index covers exactly seven tickets split into three disjoint groups; an overlap or a dropped ticket would misreport the batch.',
    holds: () => {
      const idx = IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3;
      const routeMIds = idx.routeMCohort.map((c) => c.id);
      const sigmaIds = idx.sigmaFartailFoldCohort.map((c) => c.id);
      const presentationIds = idx.presentationCohort.map((c) => c.id);
      const allIds = [...routeMIds, ...sigmaIds, ...presentationIds];
      const noOverlap = new Set(allIds).size === allIds.length;
      return (
        routeMIds.length + sigmaIds.length + presentationIds.length === 7 &&
        noOverlap &&
        Array.isArray(idx.namedResiduals) &&
        idx.namedResiduals.length === 7
      );
    },
  },
  {
    id: 'imp97768-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.anyBoundMoved === false &&
      IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.certifiedReach === 0.96 &&
      IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.certifiedReach < IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.ln3 &&
      /NO QED/.test(IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.verdict) &&
      /remains SOTA/.test(IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.verdict) &&
      /2a<=0\.96/.test(IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3.verdict),
  },
];

for (const assertion of IMP97768_LATE_FRONTIER_LEAVES_COHORT_INDEX_3_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97768-late-frontier-leaves-cohort-index-3 assertion failed: ${assertion.id}`,
    );
  }
}
