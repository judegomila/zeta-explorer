/**
 * @module imp-35559-r1t-reentry-band-decade-gap-assertion
 * @fileoverview imp-35559 -- ASSERTION-ONLY tripwire pinning the six imp-35559 per-endpoint
 *   reentry-band decade-gap literals against a silent drift of the baked band edges or ceilings.
 *
 *   imp-35559 tabulates exactly how far the imp-35537 R1t reentry band [10^27.084691, 10^37.167107]
 *   sits above the verified-zero frontier, confirming route (ii) (a data-anchored fidelity check for
 *   the OPEN imp-35243a certificate) is INFEASIBLE by an explicit per-endpoint decade margin. It bakes
 *   the two band edges (log10 N), three ceilings (Platt-Trudgian complete-verification T_PT = 3e12; the
 *   in-repo Odlyzko 10^6-ordinate data ceiling gamma_max = 600269.677012445; the external 10^22 spot-
 *   check context) and the six exact per-endpoint gaps, but pins them only with loose range assertions
 *   (reentryAboveT_PT in (14.6, 14.7), etc.). A silent change to a band edge, to T_PT, or to the
 *   millionth-zero ordinate could drift the baked perEndpointDecadeGaps record at storage precision
 *   without tripping the build.
 *
 *   This module INDEPENDENTLY recomputes all six gaps from Math.log10 of the same band edges and
 *   ceilings, then asserts:
 *     (a) the full-precision recompute matches hard-coded 7-sig-fig reference literals within 1e-6
 *         relative -- the storage-precision tolerance per [[storage_precision_assertion_tolerance]];
 *     (b) each baked imp-35559 perEndpointDecadeGaps and ceilings.log10 field reproduces EXACTLY when
 *         the source display rounding (toPrecision(6)) is re-applied to this independent recompute --
 *         so any drift in the source recompute also trips;
 *     (c) the qualitative ordering: the in-repo data ceiling is strictly the smallest of the three
 *         heights, both band edges sit above every ceiling, and even the 10^22 spot-check falls short
 *         of the reentry edge -- so no in-repo verified-zeros datum can reach the band.
 *
 *   Import-light: imports only the (import-light) imp-35559 record for the exact-reproduction cross-
 *   check; the millionth-zero ordinate is a baked literal there, so the 16.7MB zeros bundle is NEVER
 *   transitively imported, per [[no_heavy_imports_in_pages]] / [[verify_heavy_assertion_modules]].
 *
 *   @see imp-35559-r1t-reentry-band-decade-gap-quantification.js (source of every baked gap literal)
 *   @see imp-35537-r1t-reentry-band-closure-scope (states the ~14.6-24.7 decade gap; route (ii) INFEASIBLE)
 *   @see imp-35243-reentry-band-surrogate-fidelity-assessment (D2; imp-35243a certificate stays OPEN)
 *
 *   Ticket: imp-35559 (accuracy, medium). Verification-tooling only; recomputes the same already-
 *   established measurement figures; adds no new Lambda bound; discharges nothing; the reentry band is
 *   a diagnostic iterate-COUNT, not a Lambda lever; imp-35243a stays OPEN; C_mb GUE-conditional
 *   (imp-486) UNTOUCHED. No refereed bound is changed. NO QED.
 */

import { IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION } from './imp-35559-r1t-reentry-band-decade-gap-quantification.js';

// -- Band edges (log10 N), from imp-35174/imp-35357/imp-35537 (double-double certified). --
const REENTRY_LOG10_N = 27.084691; // band-on reentry edge
const EXIT_LOG10_N = 37.167107; // band-off exit edge

// -- Ceilings. --
const T_PT = 3e12; // Platt-Trudgian 2021 complete-verification height (binds Lambda <= 0.2)
const IN_REPO_GAMMA_MAX = 600269.677012445; // millionth-zero ordinate, highest in src/data/zeros-to-1e6.js
const ODLYZKO_SPOTCHECK_LOG10 = 22; // external Odlyzko ~10^22 spot-check (context only, not in-repo data)

const LOG10_T_PT = Math.log10(T_PT); // ~12.4771
const LOG10_IN_REPO_MAX = Math.log10(IN_REPO_GAMMA_MAX); // ~5.77835

// -- INDEPENDENT recompute of the six per-endpoint decade gaps from log10 of the edges and ceilings. --
const GAP_REENTRY_ABOVE_T_PT = REENTRY_LOG10_N - LOG10_T_PT; // ~14.6076
const GAP_EXIT_ABOVE_T_PT = EXIT_LOG10_N - LOG10_T_PT; // ~24.69
const GAP_REENTRY_ABOVE_IN_REPO = REENTRY_LOG10_N - LOG10_IN_REPO_MAX; // ~21.3063
const GAP_EXIT_ABOVE_IN_REPO = EXIT_LOG10_N - LOG10_IN_REPO_MAX; // ~31.3888
const IN_REPO_BELOW_T_PT = LOG10_T_PT - LOG10_IN_REPO_MAX; // ~6.69877
const GAP_REENTRY_ABOVE_SPOTCHECK = REENTRY_LOG10_N - ODLYZKO_SPOTCHECK_LOG10; // ~5.08469

// -- 7-sig-fig reference literals (storage-precision tolerance ~1e-6 relative) --
const REF = Object.freeze({
  log10_T_PT: 12.47712125, // log10 3e12
  log10_inRepoMax: 5.778346405, // log10 600269.677012445
  reentryAboveT_PT: 14.60756975, // 27.084691 - log10 3e12
  exitAboveT_PT: 24.68998575, // 37.167107 - log10 3e12
  reentryAboveInRepo: 21.30634459, // 27.084691 - log10 gamma_max
  exitAboveInRepo: 31.38876059, // 37.167107 - log10 gamma_max
  inRepoBelowT_PT: 6.698774849, // log10 3e12 - log10 gamma_max
  reentryAboveSpotCheck: 5.084691000, // 27.084691 - 22
});

const STORAGE_REL_TOL = 1e-6; // 7-sig-fig storage tolerance
const relClose = (a, b) => Math.abs(a - b) <= STORAGE_REL_TOL * Math.abs(b);

export const IMP35559_DECADE_GAP_RECOMPUTE = Object.freeze({
  id: 'imp-35559',
  bandEdges: { reentry_log10_N: REENTRY_LOG10_N, exit_log10_N: EXIT_LOG10_N },
  ceilings: { log10_T_PT: LOG10_T_PT, log10_inRepoMax: LOG10_IN_REPO_MAX, spotCheck_log10: ODLYZKO_SPOTCHECK_LOG10 },
  gaps: {
    reentryAboveT_PT: GAP_REENTRY_ABOVE_T_PT,
    exitAboveT_PT: GAP_EXIT_ABOVE_T_PT,
    reentryAboveInRepo: GAP_REENTRY_ABOVE_IN_REPO,
    exitAboveInRepo: GAP_EXIT_ABOVE_IN_REPO,
    inRepoBelowT_PT: IN_REPO_BELOW_T_PT,
    reentryAboveSpotCheck: GAP_REENTRY_ABOVE_SPOTCHECK,
  },
});

export const IMP35559_DECADE_GAP_ASSERTIONS = [
  {
    // (1) full-precision recompute matches the 7-sig-fig references within 1e-6 relative --
    //     guards the band edges, T_PT and the millionth-zero ordinate against storage-precision drift.
    id: 'imp35559-recompute-matches-reference-at-storage-tol',
    description:
      'independently recomputing the six per-endpoint decade gaps (reentry/exit above T_PT ' +
      '14.61/24.69, above the in-repo data ceiling 21.31/31.39, in-repo below T_PT 6.70, reentry ' +
      'above the 10^22 spot-check 5.08) from log10 of the band edges and ceilings matches the ' +
      '7-sig-fig reference literals within 1e-6 relative',
    holds: () =>
      relClose(LOG10_T_PT, REF.log10_T_PT) &&
      relClose(LOG10_IN_REPO_MAX, REF.log10_inRepoMax) &&
      relClose(GAP_REENTRY_ABOVE_T_PT, REF.reentryAboveT_PT) &&
      relClose(GAP_EXIT_ABOVE_T_PT, REF.exitAboveT_PT) &&
      relClose(GAP_REENTRY_ABOVE_IN_REPO, REF.reentryAboveInRepo) &&
      relClose(GAP_EXIT_ABOVE_IN_REPO, REF.exitAboveInRepo) &&
      relClose(IN_REPO_BELOW_T_PT, REF.inRepoBelowT_PT) &&
      relClose(GAP_REENTRY_ABOVE_SPOTCHECK, REF.reentryAboveSpotCheck),
  },
  {
    // (2) each baked imp-35559 field reproduces EXACTLY when the source display rounding
    //     (toPrecision(6)) is re-applied to this INDEPENDENT recompute -- catches source drift.
    id: 'imp35559-baked-fields-reproduce-exactly',
    description:
      'each imp-35559 perEndpointDecadeGaps field and the two ceilings.log10 fields equals the ' +
      'source toPrecision(6) display rounding re-applied to this independent recompute, and the ' +
      'baked band edges / gamma_max / ordinate-count match',
    holds: () => {
      const src = IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION;
      const g = src.perEndpointDecadeGaps;
      return (
        src.bandEdges.reentry_log10_N === REENTRY_LOG10_N &&
        src.bandEdges.exit_log10_N === EXIT_LOG10_N &&
        src.ceilings.ptCompleteVerification.height === T_PT &&
        src.ceilings.inRepoDataCeiling.gamma_max === IN_REPO_GAMMA_MAX &&
        src.ceilings.inRepoDataCeiling.ordinate_count === 1000000 &&
        src.ceilings.odlyzkoSpotCheckContext.log10 === ODLYZKO_SPOTCHECK_LOG10 &&
        src.ceilings.ptCompleteVerification.log10 === +LOG10_T_PT.toPrecision(6) &&
        src.ceilings.inRepoDataCeiling.log10 === +LOG10_IN_REPO_MAX.toPrecision(6) &&
        g.reentryAboveT_PT === +GAP_REENTRY_ABOVE_T_PT.toPrecision(6) &&
        g.exitAboveT_PT === +GAP_EXIT_ABOVE_T_PT.toPrecision(6) &&
        g.reentryAboveInRepo === +GAP_REENTRY_ABOVE_IN_REPO.toPrecision(6) &&
        g.exitAboveInRepo === +GAP_EXIT_ABOVE_IN_REPO.toPrecision(6) &&
        g.inRepoBelowT_PT === +IN_REPO_BELOW_T_PT.toPrecision(6) &&
        g.reentryAboveSpotCheck === +GAP_REENTRY_ABOVE_SPOTCHECK.toPrecision(6)
      );
    },
  },
  {
    // (3) qualitative ordering: the in-repo data ceiling is the smallest of the three heights, both
    //     band edges sit above every ceiling, and even the 10^22 spot-check falls short of reentry --
    //     so no in-repo verified-zeros datum can reach the band (route (ii) INFEASIBLE).
    id: 'imp35559-ordering-band-unreachable-from-every-ceiling',
    description:
      'the in-repo data ceiling (log10 ~5.78) is strictly below T_PT (~12.48) which is below both ' +
      'band edges, and the external 10^22 spot-check is still below the reentry edge, so no verified- ' +
      'zeros datum reaches the band',
    holds: () =>
      LOG10_IN_REPO_MAX < LOG10_T_PT &&
      LOG10_T_PT < REENTRY_LOG10_N &&
      REENTRY_LOG10_N < EXIT_LOG10_N &&
      ODLYZKO_SPOTCHECK_LOG10 < REENTRY_LOG10_N &&
      GAP_REENTRY_ABOVE_IN_REPO > GAP_REENTRY_ABOVE_T_PT &&
      GAP_EXIT_ABOVE_IN_REPO > GAP_EXIT_ABOVE_T_PT,
  },
  {
    // (4) honesty gate: measurement only, imp-35243a stays OPEN, no bound moves, no refereed bound is changed, NO QED.
    id: 'imp35559-honesty-gate-no-qed',
    description:
      'Measurement/assessment only: source isRigorous false, imp-35243a stays OPEN, route (ii) ' +
      'INFEASIBLE, no bound moves, no refereed bound is changed, NO QED',
    holds: () =>
      IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.isRigorous === false &&
      /imp-35243a stays OPEN/.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.residual_sub_gap) &&
      /INFEASIBLE/.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.verdict) &&
      /NO bound moves/.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.verdict) &&
      /NO QED/.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.verdict),
  },
];

for (const a of IMP35559_DECADE_GAP_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35559-r1t-reentry-band-decade-gap-assertion failed: ${a.id}`);
  }
}

export default Object.freeze({
  id: 'imp-35559-r1t-reentry-band-decade-gap-assertion',
  ticket: 'imp-35559',
  recompute: IMP35559_DECADE_GAP_RECOMPUTE,
  reference: REF,
  storageRelTol: STORAGE_REL_TOL,
});
