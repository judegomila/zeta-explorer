/**
 * @module imp-96987-kmax-degree-frontier-cohort-index
 * @fileoverview imp-96987 -- META cross-reference index note grouping the kmax-degree Route I
 *   Krein cutting-plane frontier cohort (imp-96845, imp-96868, imp-96881, imp-96956) as a single
 *   NEAR-FEASIBLE-vs-CERTIFIED family, so future work does not re-read the four tickets in
 *   isolation and mistake the measured double-precision solvability frontier for a certified one.
 *   Index/meta only; establishes nothing new; changes no bound; NO QED.
 *
 *   THE COHORT (chronological). All four scout the same object: whether raising the Route I Krein
 *   Toeplitz cutting-plane certificate degree from kmax=4 to kmax=5 moves the certified-margin
 *   frontier 2a* past the kmax=4 double-precision wall (2a=1.0) toward ln3=1.0986.
 *     imp-96845 -- solves a fresh kmax=5 double-precision LP across a 2a grid crossing 1.0. Under
 *       the identical lean config, kmax=4 walls immediately at 2a=0.96 while kmax=5 stays solvable
 *       and near-feasible (tiny l1, ~1e5x below the baked kmax=4 l1=1.466e6) out to 2a=1.06, then
 *       walls (HiGHS status 4) at 1.08. MEASURED frontier band (1.06, 1.08): moves right of 1.0 but
 *       falls short of ln3 by >=0.019. Every point is NOT CONVERGED (near-feasible, not certified).
 *     imp-96868 -- tests whether extended precision moves that wall. Tightens the band to
 *       (1.06, 1.07) (method-independent: highs-ds and highs-ipm agree), and finds the binding
 *       worst design-condition residual is PRECISION-INVARIANT (double vs 50-digit mpmath agree to
 *       3.85e-8) -- it is a coarse-grid guard deficit near the tail, not roundoff. Extended
 *       precision unlocks the ~1e20-conditioned solver but does not move the binding residual, so
 *       degree and guard resolution remain co-binding levers, not precision alone.
 *     imp-96881 -- import-light viz-data leaf presenting the imp-96845 sweep as a chart-ready
 *       per-kmax solvability ladder plus the frontier-band/l1-collapse headline. Presentation only;
 *       reproduces the same near-feasible-vs-certified honest banner.
 *     imp-96956 -- takes ONE kmax=5 iterate strictly inside the double-precision solvable region
 *       (2a=1.00, left of the 1.06-1.07 wall) and runs it through the interval-rigorous verifier.
 *       IT COLLAPSES UNDER RIGOR: 226 failing cells, worst rigorous lower bound -0.271, INTERIOR
 *       (t~16.70) rather than at the LP's own lean worst point (t~30.77 tail). The near-feasible
 *       kmax=5 frontier gives NO certified extension past 2a=0.96.
 *
 *   WHY GROUP THESE (not re-derive). Read individually, imp-96845/96868/96881 read as a
 *   right-moving frontier discovery ("kmax=5 reaches past 1.0!") and only imp-96956 supplies the
 *   decisive negative check. Read together, the cohort is one measurement (96845), one refinement
 *   of what precision can and cannot fix (96868), one presentation (96881), and one verification
 *   that the whole near-feasible signal COLLAPSES under interval rigor (96956). This index bakes
 *   that reading verbatim so a future scout does not re-cite the kmax=5 solvability band as a
 *   certified reach, and does not re-spend a ticket re-attempting the interval verification imp-96956
 *   already ran negative.
 *
 *   NEAR-FEASIBLE (measured, double precision LP; NOT certificates).
 *   - kmax=5 solvable/near-feasible for 2a in {0.96, 1.00, 1.04, 1.06} (imp-96845), wall tightened
 *     to onset (1.06, 1.07) and shown method-independent (imp-96868).
 *   - l1 conditioning collapses ~1e5x vs the baked kmax=4 certificate at 2a=0.96 (imp-96845).
 *   - the binding wall residual is a precision-invariant coarse-grid guard deficit, not a
 *     conditioning cliff at onset and not roundoff (imp-96868).
 *
 *   CERTIFIED (interval-rigorous; what actually survives rigor).
 *   - the ONE kmax=5 iterate tested under interval arithmetic (2a=1.00) FAILS verification by a wide
 *     interior margin (imp-96956); interval-rigorous certified reach stays EXACTLY 2a<=0.96, both
 *     before and after this whole cohort.
 *
 *   WHAT STAYS OPEN. Whether a fully-converged (guarded-residual >= 0) or finer-FINEH kmax=5
 *   iterate at 2a=1.00 could interval-verify is untested (imp-96956 SUB-GAP
 *   IMP96956_CONVERGED_KMAX5_100_UNPRODUCED); a genuine multi-word-precision LP re-solve past the
 *   1.07 wall was never run (imp-96868 SUB-GAP IMP96868_MULTIWORD_LP_RESOLVE_UNAVAILABLE).
 *
 *   STATUS: a grouping/index note over four already-completed tickets, not a new derivation. No
 *   bound changes: interval-rigorous certified reach stays 2a<=0.96; the operator floor is a
 *   Rayleigh UPPER bound (no operator positivity established past 0.96); RH open; NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-96845-krein-kmax5-frontier-measurement.js (fresh kmax=5 solve; measured near-feasible frontier band)
 * @see imp-96868-krein-kmax5-extprec-frontier.js (extended-precision test; binding residual precision-invariant)
 * @see imp-96881-krein-kmax-degree-frontier-viz-data.js (viz-data leaf presenting the imp-96845 ladder)
 * @see imp-96956-krein-kmax5-100-interval-verify.js (interval verification attempt; COLLAPSES under rigor)
 *
 * Ticket: imp-96987 (meta, low, sonnet-4-6). Documentation/index only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

const LN3 = Math.log(3); // 1.0986122886681098

const KMAX_DEGREE_FRONTIER_COHORT = Object.freeze([
  Object.freeze({
    id: 'imp-96845',
    role: 'fresh kmax=5 double-precision LP solve across 2a crossing 1.0',
    result:
      'MEASURES the near-feasible frontier band (1.06, 1.08): kmax=5 stays solvable and small-l1 ' +
      '(~1e5x below the baked kmax=4 l1=1.466e6) past 2a=1.0, then walls; moves right of 1.0 but ' +
      'falls short of ln3. Every point NOT CONVERGED.',
  }),
  Object.freeze({
    id: 'imp-96868',
    role: 'extended-precision test of the imp-96845 wall',
    result:
      'Tightens the wall band to (1.06, 1.07), method-independent. The binding residual is ' +
      'PRECISION-INVARIANT (double vs 50-digit mpmath agree to 3.85e-8) -- a coarse-grid guard ' +
      'deficit, not roundoff and not a conditioning cliff at onset. Precision unlocks the solver ' +
      'but does not move the residual.',
  }),
  Object.freeze({
    id: 'imp-96881',
    role: 'import-light viz-data leaf for the imp-96845 sweep',
    result:
      'Presentation only: chart-ready per-kmax solvability ladder, frontier-band and l1-collapse ' +
      'headline, carrying the same near-feasible-vs-certified honest banner.',
  }),
  Object.freeze({
    id: 'imp-96956',
    role: 'interval-rigorous verification of one kmax=5 iterate (2a=1.00)',
    result:
      'COLLAPSES UNDER RIGOR: 226 failing cells, worst rigorous lower bound -0.271, interior ' +
      '(t~16.70), not at the LP tail worst point. The near-feasible frontier gives NO certified ' +
      'extension past 2a=0.96.',
  }),
]);

export const IMP96987_KMAX_DEGREE_FRONTIER_COHORT_INDEX = Object.freeze({
  id: 'imp-96987',
  proofSection: 'S-frontier',
  cohort: KMAX_DEGREE_FRONTIER_COHORT,
  nearFeasibleSignal:
    'kmax=5 double-precision LP is solvable/near-feasible for 2a in [0.96, 1.06] (imp-96845), wall ' +
    'onset tightened to (1.06, 1.07) and shown method-independent (imp-96868); l1 conditioning ' +
    'collapses ~1e5x vs the baked kmax=4 certificate.',
  certifiedReach: 0.96,
  onlyIntervalVerificationAttempted: 'imp-96956 (2a=1.00): FAILED, 226 cells, worst bound -0.271',
  question:
    'The kmax-degree Route I Krein frontier cohort (imp-96845/96868/96881/96956) reads as four ' +
    'separate tickets. Grouped, does the measured kmax=5 double-precision solvability past 2a=1.0 ' +
    'extend the interval-CERTIFIED reach, or does it remain a near-feasible signal that collapses ' +
    'under rigor?',
  anyBoundMoved: false,
  verdict:
    'INDEX/META NOTE ONLY (no new derivation). imp-96845 measures a kmax=5 double-precision ' +
    'near-feasible frontier band past 2a=1.0; imp-96868 refines the wall (tightened, method-' +
    'independent, precision-invariant residual); imp-96881 presents that ladder. imp-96956 then ' +
    'tests the ONE thing that decides whether any of this is certified: interval-rigorous ' +
    'verification of a kmax=5 iterate strictly inside the solvable region, and it FAILS (226 ' +
    'cells, worst bound -0.271, interior obstruction). So the cohort as a whole is a NEAR-FEASIBLE-' +
    'vs-CERTIFIED family: the solvability signal is real and well-characterized, but it does not ' +
    'survive interval rigor. Interval-rigorous certified reach stays EXACTLY 2a<=0.96, unchanged by ' +
    'this whole cohort. Future work on this thread should not re-cite the kmax=5 double-precision ' +
    'band as a certified extension, and should not re-run the imp-96956 interval verification on ' +
    'the same round-cap-14 iterate; the open items are a fully-converged kmax=5 iterate at 2a=1.00 ' +
    '(untested) and a genuine multi-word-precision LP re-solve past the 1.07 wall (unavailable in ' +
    'this environment). Establishes nothing new; moves no bound; RH open; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96845 (kmax=5 frontier measurement); imp-96868 (extended-precision refinement); ' +
    'imp-96881 (viz-data leaf); imp-96956 (interval verification, collapses under rigor); ' +
    'rh-route-i-toeplitz-krein-certificate-2026-09-24.js (baked kmax=4 certificate source).',
  ln3: LN3,
});

export default IMP96987_KMAX_DEGREE_FRONTIER_COHORT_INDEX;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96987_KMAX_DEGREE_FRONTIER_COHORT_INDEX_ASSERTIONS = [
  {
    id: 'imp96987-cohort-has-all-four-members',
    why: 'The whole point of the index is grouping exactly these four tickets; a missing member ' +
      'silently breaks the cross-reference.',
    holds: () => {
      const ids = IMP96987_KMAX_DEGREE_FRONTIER_COHORT_INDEX.cohort.map((c) => c.id);
      return ['imp-96845', 'imp-96868', 'imp-96881', 'imp-96956'].every((id) => ids.includes(id));
    },
  },
  {
    id: 'imp96987-near-feasible-vs-certified-both-named',
    why: 'The index exists to separate the measured near-feasible solvability signal from the ' +
      'certified reach; both fields must be present and consistent (certified reach <= 0.96, ' +
      'strictly below ln3).',
    holds: () => {
      const idx = IMP96987_KMAX_DEGREE_FRONTIER_COHORT_INDEX;
      return (
        typeof idx.nearFeasibleSignal === 'string' &&
        idx.nearFeasibleSignal.length > 0 &&
        idx.certifiedReach === 0.96 &&
        idx.certifiedReach < idx.ln3 &&
        /FAILED/.test(idx.onlyIntervalVerificationAttempted)
      );
    },
  },
  {
    id: 'imp96987-honesty-gate-no-qed',
    why: 'Documentation/index only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96987_KMAX_DEGREE_FRONTIER_COHORT_INDEX.anyBoundMoved === false &&
      /NO QED/.test(IMP96987_KMAX_DEGREE_FRONTIER_COHORT_INDEX.verdict) &&
      /refereed bound is changed/i.test(IMP96987_KMAX_DEGREE_FRONTIER_COHORT_INDEX.verdict) &&
      /2a<=0\.96/.test(IMP96987_KMAX_DEGREE_FRONTIER_COHORT_INDEX.verdict),
  },
];

for (const assertion of IMP96987_KMAX_DEGREE_FRONTIER_COHORT_INDEX_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96987-kmax-degree-frontier-cohort-index assertion failed: ${assertion.id}`,
    );
  }
}
