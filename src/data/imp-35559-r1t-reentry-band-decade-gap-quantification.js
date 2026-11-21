/**
 * @module imp-35559-r1t-reentry-band-decade-gap-quantification
 *
 * imp-35559 (numerical/assessment, S-frontier): QUANTIFY exactly how far the
 * imp-35537 R1t reentry band [10^27.084691, 10^37.167107] sits above the verified
 * zero frontier, and CONFIRM that no in-repo verified-zeros datum can reach it, so
 * the route-(ii) data-anchored fidelity check for the OPEN imp-35243a certificate is
 * settled as INFEASIBLE by an explicit, tabulated per-endpoint decade gap -- not just
 * the ~14.6-24.7 decade prose figure imp-35537/imp-35243 stated.
 *
 * imp-35537 scoped R1t closure and stated the band lies "~14.6-24.7 decades ABOVE the
 * ~3e12 verified frontier" (imp-35243 D2), declaring route (ii) infeasible, but never
 * tabulated the exact per-endpoint gaps against BOTH relevant ceilings:
 *   (1) the Platt-Trudgian COMPLETE-verification height T_PT = 3e12 (log10 ~ 12.4771),
 *       the height up to which ALL zeros are certified on the critical line (binds
 *       Lambda <= 0.2); and
 *   (2) the actual in-repo verified-zeros DATA ceiling -- the src/data/zeros-to-1e6.js
 *       Odlyzko bundle (1,000,000 ordinates), whose HIGHEST ordinate is the millionth
 *       zero gamma ~ 600269.677012445 (log10 ~ 5.7783), the largest verified-zero
 *       height that physically exists as data inside this repository.
 * This module bakes both ceilings and both band edges and reports the four exact
 * per-endpoint decade gaps, confirming the band is UNREACHABLE from either ceiling and
 * that the in-repo DATA ceiling is a further ~6.70 decades BELOW even T_PT.
 *
 * ASSESSMENT / MEASUREMENT ONLY. Discharges NOTHING; changes no bound; tightens no
 * bound; establishes no operator positivity; no RH verdict, NO QED. R1t and the
 * imp-35243a certificate stay OPEN; R1s (imp-35414 lemma) is untouched. The
 * C_C = (1/8) sqrt(3 pi) ansatz (imp-2642/imp-2643), the E_trunc = 3.06e-5 floor
 * (imp-2631) and imp-3066 K_a >= 0 are UNTOUCHED; C_mb GUE-conditional per imp-486
 * UNTOUCHED; far-tail exponent stays 1/2 (imp-3463). No refereed bound is changed
 * . The reentry band is a diagnostic of a surrogate iterate-COUNT, not a
 * Lambda lever, so even a perfect R1t closure would move no bound (imp-35537 Part D).
 *
 * NOTE ON THE ODLYZKO SPOT-CHECKS. Odlyzko computed isolated zeros near height 10^20
 * -- 10^22 (imp-1323), which is CITED evidence but is NOT bundled ordinate data in this
 * repo. Even that external spot-check ceiling (log10 ~ 22) still sits ~5.08 decades
 * BELOW the reentry edge (10^27.08), so the band is unreachable even by the highest
 * height at which any verified zero has ever been computed -- not merely by the in-repo
 * data. This module measures the IN-REPO data ceiling; the 10^22 remark is context.
 *
 * @see imp-35537-r1t-reentry-band-closure-scope (states the ~14.6-24.7 decade gap; route (ii) INFEASIBLE)
 * @see imp-35243-reentry-band-surrogate-fidelity-assessment (D2: band 15-25 decades above verified height; imp-35243a certificate)
 * @see imp-35414-r1s-zero-residue-surrogate-lemma (R1s discharged; R1t stays open)
 * @see imp-35297-r4-independent-model-agreement-assessment (R4 witness gap; presently unreachable)
 * @see imp-1323-T-PT-successor-audit (Platt-Trudgian ~3e12 complete; Odlyzko ~10^22 spot-checks)
 * @see imp-486 (GUE-conditional caveat inherited by any C_C-derived height map)
 */

// ── Band edges (log10 N), from imp-35174/imp-35357/imp-35537 (double-double certified). ──
const REENTRY_LOG10_N = 27.084691; // band-on reentry edge
const EXIT_LOG10_N = 37.167107; // band-off exit edge

// ── Ceiling 1: Platt-Trudgian COMPLETE verification height (all zeros certified below it). ──
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (binds Lambda <= 0.2)
const LOG10_T_PT = Math.log10(T_PT); // ~12.4771

// ── Ceiling 2: the actual in-repo verified-zeros DATA ceiling. ──
// The src/data/zeros-to-1e6.js ZEROS_EXTENDED table holds 1,000,000 Odlyzko ordinates;
// its LAST (highest) entry is the millionth zero gamma = 600269.677012445. Baked as a
// reference literal (NOT imported) to keep this module light -- the zeros bundle is 16.7MB
// and must never be transitively imported into a page (see project memory).
const IN_REPO_GAMMA_MAX = 600269.677012445; // gamma_{10^6}, highest ordinate in src/data/zeros-to-1e6.js
const IN_REPO_ORDINATE_COUNT = 1000000; // ZEROS_EXTENDED length
const LOG10_IN_REPO_MAX = Math.log10(IN_REPO_GAMMA_MAX); // ~5.7783

// ── Context-only: highest height at which any verified zero has EVER been computed (external). ──
const ODLYZKO_SPOTCHECK_LOG10 = 22; // Odlyzko isolated zeros near 10^22 (imp-1323), NOT in-repo data

// ── The four exact per-endpoint decade gaps. ──
const GAP_REENTRY_ABOVE_T_PT = REENTRY_LOG10_N - LOG10_T_PT; // ~14.61
const GAP_EXIT_ABOVE_T_PT = EXIT_LOG10_N - LOG10_T_PT; // ~24.69
const GAP_REENTRY_ABOVE_IN_REPO = REENTRY_LOG10_N - LOG10_IN_REPO_MAX; // ~21.31
const GAP_EXIT_ABOVE_IN_REPO = EXIT_LOG10_N - LOG10_IN_REPO_MAX; // ~31.39
const IN_REPO_BELOW_T_PT = LOG10_T_PT - LOG10_IN_REPO_MAX; // ~6.70 (in-repo data even further below the PT frontier)
const GAP_REENTRY_ABOVE_SPOTCHECK = REENTRY_LOG10_N - ODLYZKO_SPOTCHECK_LOG10; // ~5.08 (even the 10^22 spot-check falls short)

export const IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION = {
  id: 'imp-35559',
  proofSection: 'S-frontier',
  question:
    'imp-35537 stated the R1t reentry band [10^27.08, 10^37.17] sits ~14.6-24.7 decades above the ~3e12 verified ' +
    'frontier and declared route (ii) (a data-anchored fidelity check) INFEASIBLE, but never tabulated the exact ' +
    'per-endpoint gaps nor confirmed against the actual in-repo verified-zeros DATA ceiling. Quantify all four ' +
    'per-endpoint decade gaps (band edges x {PT complete-verification 3e12, in-repo Odlyzko 10^6-ordinate bundle}) ' +
    'and confirm NO in-repo verified-zeros datum can reach the band, settling route-(ii) feasibility for the OPEN ' +
    'imp-35243a certificate. Measurement/assessment only; imp-35243a stays OPEN; NO QED.',
  bandEdges: {
    reentry_log10_N: REENTRY_LOG10_N, // 27.084691
    exit_log10_N: EXIT_LOG10_N, // 37.167107
  },
  ceilings: {
    ptCompleteVerification: {
      description:
        'the Platt-Trudgian 2021 COMPLETE-verification height T_PT = 3e12: all zeta zeros below it are certified on ' +
        'the critical line (binds Lambda <= 0.2). This is the frontier imp-35243 D2 / imp-35537 measured against.',
      height: T_PT, // 3e12
      log10: +LOG10_T_PT.toPrecision(6), // ~12.4771
    },
    inRepoDataCeiling: {
      description:
        'the ACTUAL in-repo verified-zeros DATA ceiling: src/data/zeros-to-1e6.js ZEROS_EXTENDED (1,000,000 Odlyzko ' +
        'ordinates), whose highest entry is the millionth zero gamma = 600269.677012445. This is the largest ' +
        'verified-zero height that exists as data inside the repository.',
      gamma_max: IN_REPO_GAMMA_MAX, // 600269.677012445
      ordinate_count: IN_REPO_ORDINATE_COUNT, // 1e6
      log10: +LOG10_IN_REPO_MAX.toPrecision(6), // ~5.7783
    },
    odlyzkoSpotCheckContext: {
      description:
        'CONTEXT ONLY (not in-repo data): the highest height at which any verified zero has ever been computed -- ' +
        'Odlyzko isolated zeros near 10^22 (imp-1323). Even this external ceiling sits below the reentry edge.',
      log10: ODLYZKO_SPOTCHECK_LOG10, // 22
    },
  },
  perEndpointDecadeGaps: {
    // Gaps above the PT complete-verification frontier (reproduces the imp-35537/imp-35243 ~14.6-24.7 prose exactly).
    reentryAboveT_PT: +GAP_REENTRY_ABOVE_T_PT.toPrecision(6), // ~14.6076
    exitAboveT_PT: +GAP_EXIT_ABOVE_T_PT.toPrecision(6), // ~24.6900
    // Gaps above the ACTUAL in-repo data ceiling -- LARGER, because the in-repo bundle stops far below T_PT.
    reentryAboveInRepo: +GAP_REENTRY_ABOVE_IN_REPO.toPrecision(6), // ~21.3063
    exitAboveInRepo: +GAP_EXIT_ABOVE_IN_REPO.toPrecision(6), // ~31.3888
    inRepoBelowT_PT: +IN_REPO_BELOW_T_PT.toPrecision(6), // ~6.69877
    reentryAboveSpotCheck: +GAP_REENTRY_ABOVE_SPOTCHECK.toPrecision(6), // ~5.08469
  },
  finding:
    'The reentry band edges sit EXACTLY 14.61 (reentry) and 24.69 (exit) decades above the Platt-Trudgian complete- ' +
    'verification frontier T_PT = 3e12, reproducing the imp-35537/imp-35243 D2 prose to 4 sig figs. Measured against ' +
    'the ACTUAL in-repo verified-zeros DATA ceiling (the 10^6-ordinate Odlyzko bundle, max gamma ~ 600269.68, log10 ' +
    '~ 5.7783), the gaps WIDEN to 21.31 (reentry) and 31.39 (exit) decades, because the bundle stops ~6.70 decades ' +
    'BELOW T_PT. Even the highest height at which any verified zero has EVER been computed (Odlyzko ~10^22, external, ' +
    'not in-repo) falls ~5.08 decades short of the reentry edge. Therefore NO in-repo verified-zeros datum -- and no ' +
    'existing verified zero at all -- lands anywhere in or below the band, so the route-(ii) data-anchored fidelity ' +
    'check is INFEASIBLE by an explicit margin, not merely by assertion.',
  isRigorous: false,
  verdict:
    'MEASUREMENT / ASSESSMENT (frontier-direction, NOT rigorous). The imp-35537 R1t reentry band ' +
    '[10^27.084691, 10^37.167107] sits 14.61 / 24.69 decades above the Platt-Trudgian complete-verification frontier ' +
    'T_PT = 3e12 (exactly the imp-35243 D2 figure), and 21.31 / 31.39 decades above the ACTUAL in-repo verified- ' +
    'zeros data ceiling (the src/data/zeros-to-1e6.js 10^6-ordinate Odlyzko bundle, whose highest ordinate is the ' +
    'millionth zero gamma ~ 600269.68, log10 ~ 5.7783 -- itself ~6.70 decades below T_PT). Even the external Odlyzko ' +
    '~10^22 spot-check ceiling falls ~5.08 decades short of the reentry edge. So NO in-repo verified-zeros datum can ' +
    'reach the band and the route-(ii) data-anchored fidelity check (imp-35537 route (ii) / imp-35243 R4/D2) is ' +
    'INFEASIBLE by an explicit tabulated margin. This settles route-(ii) feasibility as CLOSED for R1t. Discharges ' +
    'NOTHING; changes no bound; establishes no operator positivity; R1t and the imp-35243a certificate stay OPEN; ' +
    'R1s (imp-35414) is untouched; the reentry band is a diagnostic iterate-COUNT, not a Lambda lever, so NO bound ' +
    'moves (imp-35537 Part D); C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631), imp-3066 ' +
    'K_a >= 0 and C_mb GUE-conditional (imp-486) are UNTOUCHED; far-tail exponent stays 1/2 (imp-3463); no RH ' +
    'verdict, NO QED. No refereed bound is changed.',
  residual_sub_gap:
    'imp-35243a stays OPEN: route (i) (a certified true-dynamic model, imp-35439/imp-34862) inherits the imp-486 GUE ' +
    'conditional via the C_C-derived K, and route (ii) (a data-anchored check) is now quantified as INFEASIBLE -- the ' +
    'band sits 21.31-31.39 decades above the in-repo data ceiling (14.61-24.69 above T_PT). Closing imp-35243a still ' +
    'needs R2 (uniform nonlinear-remainder over the ~10.08-decade band) + R3 (height-map fidelity at 10^37); the data ' +
    'route R4 is unreachable at present verified heights.',
  citation:
    'imp-35537 (R1t closure scope: ~14.6-24.7 decade gap, route (ii) infeasible); imp-35243 (D2, R4, imp-35243a ' +
    'certificate); imp-35414 (R1s surrogate lemma); imp-35297 (R4 witness gap); imp-1323 (Platt-Trudgian ~3e12 ' +
    'complete, Odlyzko ~10^22 spot-checks); src/data/zeros-to-1e6.js (Odlyzko 10^6 ordinates, gamma_max ' +
    '600269.677012445); imp-486 (GUE-conditional caveat); Platt-Trudgian 2021 (T_PT = 3e12); Montgomery/Odlyzko ' +
    '(GUE pair-correlation).',
};

export const IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION_ASSERTIONS = [
  {
    // The four per-endpoint gaps above the PT frontier reproduce the imp-35537/imp-35243 D2 ~14.6-24.7 decade prose.
    id: 'imp35559-gaps-above-pt-reproduce-d2',
    description: 'reentry ~14.61 and exit ~24.69 decades above the PT complete-verification frontier T_PT = 3e12',
    holds: () =>
      Math.abs(LOG10_T_PT - Math.log10(3e12)) < 1e-12 &&
      GAP_REENTRY_ABOVE_T_PT > 14.6 && GAP_REENTRY_ABOVE_T_PT < 14.7 &&
      GAP_EXIT_ABOVE_T_PT > 24.6 && GAP_EXIT_ABOVE_T_PT < 24.7 &&
      REENTRY_LOG10_N > LOG10_T_PT && EXIT_LOG10_N > LOG10_T_PT,
  },
  {
    // The in-repo DATA ceiling (10^6-ordinate Odlyzko bundle, gamma_max ~600269.68) sits FAR below the band and below T_PT.
    id: 'imp35559-in-repo-data-ceiling-far-below-band',
    description: 'the in-repo verified-zeros data ceiling (gamma_max ~600269.68, log10 ~5.7783) is ~21.31-31.39 decades below the band and ~6.70 below T_PT',
    holds: () =>
      IN_REPO_GAMMA_MAX > 600269 && IN_REPO_GAMMA_MAX < 600270 &&
      IN_REPO_ORDINATE_COUNT === 1000000 &&
      LOG10_IN_REPO_MAX > 5.77 && LOG10_IN_REPO_MAX < 5.79 &&
      GAP_REENTRY_ABOVE_IN_REPO > 21.3 && GAP_REENTRY_ABOVE_IN_REPO < 21.4 &&
      GAP_EXIT_ABOVE_IN_REPO > 31.3 && GAP_EXIT_ABOVE_IN_REPO < 31.4 &&
      IN_REPO_BELOW_T_PT > 6.6 && IN_REPO_BELOW_T_PT < 6.8 &&
      // in-repo data ceiling is strictly the smallest of the three heights, so the band is unreachable from it a fortiori
      LOG10_IN_REPO_MAX < LOG10_T_PT && LOG10_T_PT < REENTRY_LOG10_N,
  },
  {
    // Honesty gate: even the external 10^22 spot-check falls short; measurement only; imp-35243a OPEN; no bound moves; NO QED.
    id: 'imp35559-route-ii-infeasible-no-bound-moves-no-qed',
    description: 'even the external 10^22 spot-check is ~5.08 decades below reentry; route (ii) infeasible; imp-35243a OPEN; no lever; no refereed bound is changed; NO QED',
    holds: () =>
      GAP_REENTRY_ABOVE_SPOTCHECK > 5 && GAP_REENTRY_ABOVE_SPOTCHECK < 5.1 &&
      ODLYZKO_SPOTCHECK_LOG10 < REENTRY_LOG10_N &&
      IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.isRigorous === false &&
      /imp-35243a stays OPEN/.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.residual_sub_gap) &&
      /imp-35243a certificate stay OPEN/.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.verdict) &&
      /NO bound moves/.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.verdict) &&
      /INFEASIBLE/.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.verdict) &&
      /NO QED/.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.verdict) &&
      /refereed bound is changed/i.test(IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION.verdict),
  },
];

for (const a of IMP35559_R1T_REENTRY_BAND_DECADE_GAP_QUANTIFICATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35559-r1t-reentry-band-decade-gap-quantification assertion failed: ${a.id}`);
  }
}
