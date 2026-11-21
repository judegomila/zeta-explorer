/**
 * @module imp-35604-route-ii-landmark-data-reachability-scope
 * @fileoverview imp-35604 -- ASSESSMENT / SCOPING quantifying the DATA-REACHABILITY margin of
 *   route-(ii), which imp-35571 names as the ONLY viable partial for the OPEN imp-35337a: the
 *   imp-35488 two-height data-anchored g_true spot check at the peak and crossover landmark heights.
 *
 *   imp-35571 states both landmark log-heights sit below the Platt-Trudgian frontier
 *   log T_PT ~ 28.73 but never quantifies HOW FAR below, nor whether the in-repo verified-zeros
 *   bundle actually reaches them. This module supplies that missing margin. It takes the two
 *   imp-35571 baked natural-log landmark heights (peak logT0 ~13.2309, crossover logT0 ~20.8576),
 *   converts them to decades (log10), and measures each landmark against TWO ceilings:
 *     - the Platt-Trudgian complete-verification frontier T_PT = 3e12 (log10 ~12.4771), and
 *     - the ACTUAL in-repo verified-zeros DATA ceiling: the millionth-zero ordinate
 *       gamma_max = 600269.677012445 (log10 ~5.7783), highest in src/data/zeros-to-1e6.js
 *       (the same ceiling imp-35559 uses for the R1t band).
 *
 *   NET FINDING (route-(ii) is only HALF data-reachable in-repo):
 *     - PEAK landmark (RvM height log10 ~5.7461) sits ~6.73 decades below T_PT and ~0.032
 *       decades BELOW the in-repo data ceiling -- i.e. DATA-REACHABLE: the peak zero index
 *       N ~ 9.2186e5 is inside the 10^6 in-repo bundle (N < 1e6), so the peak g_true anchor
 *       needs NO external data.
 *     - CROSSOVER landmark (RvM height log10 ~9.0583) sits ~3.42 decades below T_PT but
 *       ~3.28 decades ABOVE the in-repo data ceiling -- i.e. NOT data-reachable in-repo:
 *       its zero index N ~ 3.2803e9 is ~3280x beyond the 10^6 in-repo ceiling, so the
 *       crossover g_true anchor would require EXTERNAL verified zeros (Odlyzko-scale).
 *   So route-(ii) as a TWO-height spot check is only half-anchorable with in-repo data: the
 *   peak anchor lands just inside the in-repo ceiling, but the crossover anchor is ~3.28
 *   decades beyond it -- a genuine data-reachability sub-gap on the "only viable partial".
 *
 *   Import-light: imports only the (import-light) imp-35571 record for the landmark log-heights
 *   cross-check; the in-repo ordinate is a baked literal, so the 16.7MB zeros bundle is NEVER
 *   transitively imported, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]].
 *
 *   @see imp-35571-route-i-subleading-rate-scope.js (source of the two baked landmark log-heights)
 *   @see imp-35488-route-ii-two-height-gtrue-spotcheck (route-(ii) the two-height partial)
 *   @see imp-35559-r1t-reentry-band-decade-gap-assertion.js (same in-repo data ceiling gamma_max)
 *   @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 Riemann-von Mangoldt inverse)
 *
 *   Ticket: imp-35604 (proof/assessment, medium). ASSESSMENT / SCOPING ONLY: quantifies an already-
 *   established feasibility statement; discharges NOTHING; imp-35337a stays OPEN; route-(ii) stays
 *   the only viable partial; changes no bound; establishes no positivity; C_mb GUE-conditional
 *   (imp-486) UNTOUCHED; NO QED. No refereed bound is changed.
 */

import { IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE } from './imp-35571-route-i-subleading-rate-scope.js';

const LN10 = Math.LN10;

// -- Ceilings. --
const T_PT = 3e12; // Platt-Trudgian 2021 complete-verification frontier (binds Lambda <= 0.2)
const IN_REPO_GAMMA_MAX = 600269.677012445; // millionth-zero ordinate, highest in src/data/zeros-to-1e6.js
const IN_REPO_ORDINATE_COUNT = 1000000; // 10^6 verified ordinates in the in-repo bundle

// -- Landmark heights (imp-35337 / imp-35475), taken as given by imp-35571. --
const N_PEAK = 9.2186e5; // interior flat-cap sigma PEAK zero index
const N_CROSS = 3.280294352e9; // E_coll = E_trunc CROSSOVER zero index

// -- Landmark natural-log heights, from the imp-35571 baked RvM-surrogate fields. --
const LOG_T0_PEAK = IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.thresholdCollapse.logT0Peak; // 13.2309
const LOG_T0_CROSS = IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.thresholdCollapse.logT0Cross; // 20.8576

// -- INDEPENDENT recompute of the decade (log10) heights and per-landmark margins. --
const LOG10_T_PT = Math.log10(T_PT); // ~12.4771
const LOG10_CEIL = Math.log10(IN_REPO_GAMMA_MAX); // ~5.7783
const LOG10_PEAK = LOG_T0_PEAK / LN10; // ~5.7461
const LOG10_CROSS = LOG_T0_CROSS / LN10; // ~9.0583

const PEAK_BELOW_T_PT = LOG10_T_PT - LOG10_PEAK; // ~6.7310 (decades below the PT frontier)
const CROSS_BELOW_T_PT = LOG10_T_PT - LOG10_CROSS; // ~3.4188
const PEAK_VS_CEIL = LOG10_PEAK - LOG10_CEIL; // ~ -0.0322 (negative => below ceiling => reachable)
const CROSS_VS_CEIL = LOG10_CROSS - LOG10_CEIL; // ~ +3.2800 (positive => above ceiling => not reachable)

// -- 7-sig-fig reference literals (storage-precision tolerance ~1e-6 relative). --
const REF = Object.freeze({
  log10_T_PT: 12.47712125, // log10 3e12
  log10_ceil: 5.778346405, // log10 600269.677012445
  log10_peak: 5.746106861, // 13.2309 / ln(10)
  log10_cross: 9.058340586, // 20.8576 / ln(10)
  peakBelowT_PT: 6.731014394, // log10 3e12 - log10 peak height
  crossBelowT_PT: 3.418780669, // log10 3e12 - log10 crossover height
  peakVsCeil: -0.03223954465, // log10 peak - log10 gamma_max (negative: reachable)
  crossVsCeil: 3.27999418, // log10 crossover - log10 gamma_max (positive: not reachable)
});

const STORAGE_REL_TOL = 1e-6; // 7-sig-fig storage tolerance per [[storage_precision_assertion_tolerance]]
const relClose = (a, b) => Math.abs(a - b) <= STORAGE_REL_TOL * Math.abs(b);

export const IMP35604_ROUTE_II_DATA_REACHABILITY = Object.freeze({
  id: 'imp-35604',
  proofSection: 'S-frontier',
  ceilings: { log10_T_PT: LOG10_T_PT, log10_dataCeiling: LOG10_CEIL, gamma_max: IN_REPO_GAMMA_MAX, ordinate_count: IN_REPO_ORDINATE_COUNT },
  peak: {
    zeroIndex: N_PEAK,
    logT0: LOG_T0_PEAK,
    log10Height: LOG10_PEAK,
    decadesBelowT_PT: PEAK_BELOW_T_PT,
    decadesVsDataCeiling: PEAK_VS_CEIL,
    dataReachableInRepo: N_PEAK < IN_REPO_ORDINATE_COUNT, // true: index inside the 10^6 bundle
  },
  crossover: {
    zeroIndex: N_CROSS,
    logT0: LOG_T0_CROSS,
    log10Height: LOG10_CROSS,
    decadesBelowT_PT: CROSS_BELOW_T_PT,
    decadesVsDataCeiling: CROSS_VS_CEIL,
    dataReachableInRepo: N_CROSS < IN_REPO_ORDINATE_COUNT, // false: index ~3280x beyond the bundle
  },
  finding:
    'Route-(ii) (the imp-35488 two-height data-anchored g_true spot check) is only HALF data-reachable ' +
    'with the in-repo verified zeros: the PEAK landmark (log10 height ~5.75, zero index N ~9.22e5) is ' +
    'inside the 10^6 in-repo bundle and ~0.032 decades below the millionth-zero data ceiling, so the ' +
    'peak anchor needs no external data; but the CROSSOVER landmark (log10 height ~9.06, zero index ' +
    'N ~3.28e9) sits ~3.28 decades ABOVE the in-repo data ceiling (~3280x beyond the 10^6 ordinate ' +
    'count), so the crossover anchor would require EXTERNAL verified zeros (Odlyzko-scale). Both ' +
    'landmarks sit below T_PT = 3e12 (~6.73 / ~3.42 decades below), as imp-35571 states, but only the ' +
    'peak is anchorable in-repo -- a genuine data-reachability sub-gap on route-(ii).',
  isRigorous: false,
  isUnconditional: false,
  verdict:
    'ASSESSMENT / SCOPING (frontier data-reachability quantification, NOT rigorous). Quantifies the ' +
    'imp-35571 statement that both route-(ii) landmark heights sit below T_PT: the peak lands ~6.73 ' +
    'decades and the crossover ~3.42 decades below the Platt-Trudgian frontier, but against the ACTUAL ' +
    'in-repo verified-zeros DATA ceiling (millionth-zero gamma_max = 600269.677012445, log10 ~5.7783) ' +
    'only the PEAK is reachable (~0.032 decades below the ceiling, zero index N ~9.22e5 inside the 10^6 ' +
    'bundle); the CROSSOVER is ~3.28 decades / ~3280x beyond in-repo reach. So route-(ii) as a two-' +
    'height spot check is only half-anchorable with in-repo data and the crossover anchor needs ' +
    'external verified zeros -- an honest sub-gap on the only viable partial. Discharges NOTHING; ' +
    'imp-35337a stays OPEN; route-(ii) stays the only viable partial; changes no bound; establishes no ' +
    'operator positivity; C_mb GUE-conditional (imp-486) UNTOUCHED; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35571 (names route-(ii) as the only viable partial, source of the two landmark log-heights); ' +
    'imp-35488 (route-(ii) two-height g_true spot check); imp-35337 (imp-35337a OPEN); imp-35475 ' +
    '(peak/crossover landmarks); imp-35559 (same in-repo data ceiling gamma_max); lambda-rh-height-' +
    'mapping (effectiveHeightForN RvM inverse); Platt-Trudgian 2021 (T_PT = 3e12); imp-486 (GUE-' +
    'conditional caveat, UNTOUCHED).',
});

export const IMP35604_ROUTE_II_DATA_REACHABILITY_ASSERTIONS = [
  {
    // (1) full-precision recompute of the decade heights and margins matches the 7-sig-fig references.
    id: 'imp35604-recompute-matches-reference-at-storage-tol',
    description:
      'independently recomputing the two landmark decade heights (peak ~5.75, crossover ~9.06) and ' +
      'their margins below T_PT (~6.73 / ~3.42) and versus the in-repo data ceiling (peak ~ -0.032, ' +
      'crossover ~ +3.28) from log10 of the ceilings and the imp-35571 landmark log-heights matches ' +
      'the 7-sig-fig reference literals within 1e-6 relative',
    holds: () =>
      relClose(LOG10_T_PT, REF.log10_T_PT) &&
      relClose(LOG10_CEIL, REF.log10_ceil) &&
      relClose(LOG10_PEAK, REF.log10_peak) &&
      relClose(LOG10_CROSS, REF.log10_cross) &&
      relClose(PEAK_BELOW_T_PT, REF.peakBelowT_PT) &&
      relClose(CROSS_BELOW_T_PT, REF.crossBelowT_PT) &&
      relClose(PEAK_VS_CEIL, REF.peakVsCeil) &&
      relClose(CROSS_VS_CEIL, REF.crossVsCeil),
  },
  {
    // (2) the landmark log-heights match the imp-35571 baked source fields exactly.
    id: 'imp35604-landmark-heights-match-imp35571-source',
    description:
      'the two natural-log landmark heights used here equal the imp-35571 baked logT0Peak / logT0Cross ' +
      'fields, and both sit below the imp-35571 logT_PT anchor',
    holds: () => {
      const tc = IMP35571_ROUTE_I_SUBLEADING_RATE_SCOPE.thresholdCollapse;
      return (
        LOG_T0_PEAK === tc.logT0Peak &&
        LOG_T0_CROSS === tc.logT0Cross &&
        LOG_T0_PEAK < tc.logT_PT &&
        LOG_T0_CROSS < tc.logT_PT
      );
    },
  },
  {
    // (3) the data-reachability verdict: peak reachable in-repo (below ceiling, index in bundle),
    //     crossover NOT (above ceiling by ~3.28 decades, index ~3280x beyond the 10^6 bundle);
    //     both below T_PT. This is the half-reachable sub-gap the assessment reports.
    id: 'imp35604-peak-reachable-crossover-not',
    description:
      'the peak landmark is data-reachable in-repo (log10 height below the millionth-zero ceiling, ' +
      'zero index < 1e6) while the crossover is ~3.28 decades above the ceiling and ~3280x beyond the ' +
      '10^6 in-repo ordinate count, and both landmarks sit below T_PT',
    holds: () =>
      PEAK_VS_CEIL < 0 && // peak below the data ceiling => reachable
      N_PEAK < IN_REPO_ORDINATE_COUNT && // peak zero index inside the 10^6 in-repo bundle
      CROSS_VS_CEIL > 3 && CROSS_VS_CEIL < 3.5 && // crossover ~3.28 decades above the ceiling
      N_CROSS / IN_REPO_ORDINATE_COUNT > 3000 && // crossover index ~3280x beyond the bundle
      LOG10_PEAK < LOG10_T_PT && LOG10_CROSS < LOG10_T_PT && // both below the PT frontier
      PEAK_BELOW_T_PT > CROSS_BELOW_T_PT, // peak sits deeper below T_PT than the crossover
  },
  {
    // (4) honesty gate: assessment only, imp-35337a stays OPEN, route-(ii) stays the only partial,
    //     no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35604-honesty-gate-no-qed',
    description:
      'assessment/scoping only: not rigorous, not unconditional, imp-35337a stays OPEN, route-(ii) ' +
      'stays the only viable partial, no bound moves, no refereed bound is changed, NO QED',
    holds: () =>
      IMP35604_ROUTE_II_DATA_REACHABILITY.isRigorous === false &&
      IMP35604_ROUTE_II_DATA_REACHABILITY.isUnconditional === false &&
      /imp-35337a stays OPEN/.test(IMP35604_ROUTE_II_DATA_REACHABILITY.verdict) &&
      /only viable partial/.test(IMP35604_ROUTE_II_DATA_REACHABILITY.verdict) &&
      /changes no bound/.test(IMP35604_ROUTE_II_DATA_REACHABILITY.verdict) &&
      /NO QED/.test(IMP35604_ROUTE_II_DATA_REACHABILITY.verdict) &&
      /refereed bound is changed/i.test(IMP35604_ROUTE_II_DATA_REACHABILITY.verdict),
  },
];

for (const a of IMP35604_ROUTE_II_DATA_REACHABILITY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35604-route-ii-landmark-data-reachability-scope assertion failed: ${a.id}`);
  }
}

export default Object.freeze({
  id: 'imp-35604-route-ii-landmark-data-reachability-scope',
  ticket: 'imp-35604',
  reachability: IMP35604_ROUTE_II_DATA_REACHABILITY,
  reference: REF,
  storageRelTol: STORAGE_REL_TOL,
});
