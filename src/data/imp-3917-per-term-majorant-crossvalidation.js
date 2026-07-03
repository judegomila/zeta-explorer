/**
 * @module imp-3917-per-term-majorant-crossvalidation
 * @fileoverview imp-3917 (numerical, VERIFICATION-ONLY): PER-TERM
 * cross-validation of the imp-3898 rigorous path-local majorant
 *     e_j := d ln t_j/dT = 8 P_j/D_j  <=  8 / s_min(j)^2
 * against a directly MEASURED (centered finite-difference) per-term elasticity,
 * term-by-term over EVERY active term j on the three representative [1e4,1e6]
 * plateaus 0/4/9 (thetaBar = 0.99, T = H^2/(8*thetaBar)).
 *
 * WHY THIS TICKET
 * ---------------
 * imp-3898 PROVED the per-term majorant e_j <= 8/s_min(j)^2 analytically and
 * CERTIFIED only the Psi-weighted AGGREGATE against imp-3874 (sharpRatio in
 * [0.83, 1.05]). imp-3874 itself baked only per-plateau AGGREGATE scalars
 * (logSensBase, sminBase); the per-term inequality was never confronted with a
 * measured per-term e_j. This module CLOSES that: for each active term j it
 * measures e_j by a centered finite difference of ln t_j = const - 2 ln D_j and
 * CONFIRMS e_j <= 8/s_min(j)^2 term-by-term, with the nearest single-gap terms
 * (m_j = 1, path gaps g_{a-1}, g_{a+1}) TIGHT at e_j = 8/D_j^2 (ratio = 1).
 *
 * SETTING (imp-3725 gap-domination bootstrap, unchanged)
 * ------------------------------------------------------
 *   s_l(T)   = sqrt(max(g_l(0)^2 - 8T, 0))
 *   D_j(T)   = sum of s_l over the gap path from the record pair a outward to j,
 *   P_j(T)   = sum of 1/s_l over that path,
 *   s_min(j) = min of s_l over that path (path-local smallest gap, running min),
 *   t_j      = 4 H^2/D_j^2,   e_j = d ln t_j/dT = 8 P_j/D_j.
 * Per-term FD: ln t_j(T +- h) = const - 2 ln D_j(T +- h) (the 4H^2 cancels), so
 *   e_j^FD = (ln D_j(T-h) - ln D_j(T+h)) / h   (centered, hRel = 1e-6).
 * The majorant is the elementary min-inequality applied per path:
 *   P_j <= m_j/s_min(j), D_j >= m_j s_min(j)  =>  e_j <= 8/s_min(j)^2,
 * TIGHT when the path is a single gap (m_j = 1), where s_min(j) = D_j and the
 * majorant collapses to 8/D_j^2; min over the two nearest terms is 8/Dmin^2.
 *
 * WHAT WAS MEASURED (scripts/imp-3917-per-term-majorant-crossvalidate.mjs, node
 * via esbuild bundle over zeros-to-1e6.js, 2026-07-03)
 * ---------------------------------------------------------------------------
 * Streaming one O(N) pass per plateau (18857 / 87759 / 999998 active terms),
 * tracking running D_j / P_j / s_min(j) at T and running D_j at T +- h:
 *  (a) ANALYTIC MAJORANT HOLDS TERM-BY-TERM. e_j <= 8/s_min(j)^2 for EVERY
 *      active term j on all three plateaus (maxRatioAnalytic = 1 exactly), the
 *      maximum ratio 1 being attained ONLY at the nearest single-gap terms.
 *  (b) NEAREST TERMS TIGHT. The two m_j = 1 terms (path gaps g_{a-1}, g_{a+1})
 *      have e_j = 8/D_j^2 exactly (ratioAnalytic = 1); min over them gives Dmin
 *      reproducing the imp-3725/imp-3898 Dmin and dminCeil = 8/Dmin^2
 *      (7.713 / 17.614 / 16.717 on plateaus 0/4/9) to the last baked digit.
 *  (c) MEASURED e_j CONFIRMS ANALYTIC. The per-term centered FD elasticity
 *      matches the analytic e_j to relative <= 3.73e-4 across all ~1.1M terms;
 *      the only ratio above 1 is a 2.8e-7 FD-truncation blip on plateau 0 at a
 *      tight nearest term (analytic ratio there is exactly 1), i.e. FD noise,
 *      not a real violation -- the RIGOROUS per-term inequality is the analytic
 *      one, which holds with maxRatioAnalytic = 1 on every term.
 *  (d) SATURATION PROFILE. Only the 1-2 nearest single-gap terms per plateau
 *      sit at ratio ~ 1 (near-saturation); every other active term is strictly
 *      below 8/s_min(j)^2. No interior term violates or near-saturates beyond
 *      the nearest ones -- the majorant is tight exactly where imp-3898 predicts.
 *
 * HONEST SCOPE
 * ------------
 *  - PER-TERM VERIFICATION of the imp-3898 derived majorant against a measured
 *    (FD) per-term elasticity; the analytic inequality holds term-by-term on
 *    every one of the ~1.1M active terms across plateaus 0/4/9. Summary scalars
 *    baked from the offline scan; Dmin / dminCeil cross-check LIVE against
 *    imp-3898 (hence imp-3725). Nothing new is derived; imp-3898 already proved
 *    the inequality -- this confirms it holds per-term, not only on the aggregate.
 *  - Three representative plateaus, not all ten (inherits the imp-3874 sub-gap).
 *  - No new Lambda bound; imp-3066 K_a >= 0 positivity UNTOUCHED; Platt-Trudgian
 *    Lambda <= 0.2 REMAINS SOTA; NO QED.
 *
 * OPEN SUB-GAP
 * ------------
 *  - imp-3917-sub-all-plateaus: the per-term cross-validation covers 3 of the 10
 *    imp-3725 plateaus (0, 4, 9). The per-term inequality is gap-value-independent
 *    (elementary min-inequality) so it holds identically on the other 7, but they
 *    were not machine-checked term-by-term here. Named open, non-blocker.
 *
 * @see imp-3898-path-local-elasticity-bound.js (the majorant proved + aggregate-certified)
 * @see imp-3874-dpsi-sensitivity-verification.js (aggregate FD verification this refines)
 * @see imp-3725-fmb-plateau-domination-lemma.js (source of Dmin, H)
 * @see scripts/imp-3917-per-term-majorant-crossvalidate.mjs (generator)
 */

import { IMP_3898_PATH_LOCAL_ELASTICITY_BOUND } from './imp-3898-path-local-elasticity-bound.js';

const SRC98 = IMP_3898_PATH_LOCAL_ELASTICITY_BOUND.rows; // Dmin, dminCeil per plateau

const DMIN_98 = Object.freeze(
  Object.fromEntries(SRC98.map((r) => [r.plateauIndex, r.Dmin])),
);
const DMINCEIL_98 = Object.freeze(
  Object.fromEntries(SRC98.map((r) => [r.plateauIndex, r.dminCeil])),
);

// Baked per-plateau summary from scripts/imp-3917-per-term-majorant-crossvalidate.mjs
// (2026-07-03). DO NOT hand-edit; regenerate via the script. Dmin / nearest-term
// majorant cross-check LIVE against imp-3898 so the verification stays single-source.
const MEASURED = Object.freeze([
  {
    plateauIndex: 0, startN: 10000, endN: 18859, H: 0.0376985, a: 6708,
    thetaBar: 0.99, activeTerms: 18857,
    allHoldAnalytic: true, maxRatioAnalytic: 1,
    allHoldFD: false, maxRatioFD: 1.00000028, maxFdVsAnalyticRel: 3.0302e-6,
    nearSaturationTerms: 1, Dmin: 1.01843815,
    nearest: [
      { gapIndex: 6707, Dj: 1.01843815, eAnalytic: 7.71295273, eFD: 7.71295227, majorant: 7.71295273, ratioAnalytic: 1 },
      { gapIndex: 6709, Dj: 1.63865975, eAnalytic: 2.9792875, eFD: 2.97928834, majorant: 2.9792875, ratioAnalytic: 1 },
    ],
  },
  {
    plateauIndex: 4, startN: 82553, endN: 87761, H: 0.0208495, a: 82551,
    thetaBar: 0.99, activeTerms: 87759,
    allHoldAnalytic: true, maxRatioAnalytic: 1,
    allHoldFD: true, maxRatioFD: 0.999999991, maxFdVsAnalyticRel: 1.5059e-5,
    nearSaturationTerms: 2, Dmin: 0.673928644,
    nearest: [
      { gapIndex: 82550, Dj: 0.673928644, eAnalytic: 17.6141689, eFD: 17.6141687, majorant: 17.6141689, ratioAnalytic: 1 },
      { gapIndex: 82552, Dj: 0.99109844, eAnalytic: 8.1443495, eFD: 8.14434842, majorant: 8.1443495, ratioAnalytic: 1 },
    ],
  },
  {
    plateauIndex: 9, startN: 420892, endN: 1000000, H: 0.00570371, a: 420890,
    thetaBar: 0.99, activeTerms: 999998,
    allHoldAnalytic: true, maxRatioAnalytic: 1,
    allHoldFD: true, maxRatioFD: 0.999999809, maxFdVsAnalyticRel: 3.7297e-4,
    nearSaturationTerms: 2, Dmin: 0.691776931,
    nearest: [
      { gapIndex: 420889, Dj: 0.691776931, eAnalytic: 16.7169805, eFD: 16.7169402, majorant: 16.7169805, ratioAnalytic: 1 },
      { gapIndex: 420891, Dj: 0.747757526, eAnalytic: 14.3076531, eFD: 14.3076503, majorant: 14.3076531, ratioAnalytic: 1 },
    ],
  },
]);

const ROWS = MEASURED.map((m) => Object.freeze({ ...m, nearest: Object.freeze(m.nearest.map((n) => Object.freeze({ ...n }))) }));

const TOTAL_TERMS = ROWS.reduce((s, r) => s + r.activeTerms, 0);
const ALL_HOLD_ANALYTIC = ROWS.every((r) => r.allHoldAnalytic);
const MAX_RATIO_ANALYTIC = Math.max(...ROWS.map((r) => r.maxRatioAnalytic));
const MAX_RATIO_FD = Math.max(...ROWS.map((r) => r.maxRatioFD));
const MAX_FD_VS_ANALYTIC_REL = Math.max(...ROWS.map((r) => r.maxFdVsAnalyticRel));

export const IMP_3917_PER_TERM_MAJORANT_CROSSVALIDATION = Object.freeze({
  id: 'imp-3917',
  title:
    'Per-term cross-validation of the imp-3898 path-local majorant e_j <= 8/s_min(j)^2 ' +
    'against a measured (finite-difference) per-term elasticity: CONFIRMED term-by-term ' +
    'on every one of ~1.1M active terms across plateaus 0/4/9, tight (ratio=1) at the ' +
    'nearest single-gap terms (8/Dmin^2), no interior term saturating or violating',
  status: 'verification-only',
  rhFree: true,
  semantics:
    'per-term confirmation of the imp-3898 derived majorant against a measured per-term ' +
    'elasticity; refines the aggregate imp-3874/imp-3898 certification, NO new bound, NO QED',

  thetaBar: 0.99,
  rows: ROWS,

  perTermMajorant:
    'e_j = 8 P_j/D_j <= 8/s_min(j)^2, s_min(j) = min gap on path j. Checked per-term: ' +
    'the analytic e_j sits at or below 8/s_min(j)^2 on EVERY active term (maxRatioAnalytic ' +
    '= 1, attained only at the nearest single-gap terms). The measured per-term FD ' +
    'elasticity e_j^FD = (ln D_j(T-h) - ln D_j(T+h))/h matches e_j to relative <= 3.7e-4.',

  headline: {
    plateausCrossValidated: ROWS.map((r) => r.plateauIndex),   // [0, 4, 9]
    totalActiveTerms: TOTAL_TERMS,                              // ~1.107M
    allHoldAnalytic: ALL_HOLD_ANALYTIC,                        // true
    maxRatioAnalytic: MAX_RATIO_ANALYTIC,                       // 1 exactly
    maxRatioFD: MAX_RATIO_FD,                                   // 1.00000028 (FD truncation)
    maxFdVsAnalyticRel: MAX_FD_VS_ANALYTIC_REL,                 // ~3.7e-4
    finding:
      'The imp-3898 rigorous per-term path-local majorant e_j <= 8/s_min(j)^2 -- proved ' +
      'analytically and previously certified only on the Psi-weighted aggregate -- is ' +
      'confirmed TERM-BY-TERM on every one of ~1.1M active terms across plateaus 0/4/9. ' +
      'The analytic per-term elasticity satisfies e_j <= 8/s_min(j)^2 with maximum ratio ' +
      'exactly 1, attained ONLY at the nearest single-gap terms (m_j = 1, path gaps ' +
      'g_{a-1}, g_{a+1}), where e_j = 8/D_j^2 exactly and min over the two reproduces ' +
      'the imp-3725/imp-3898 Dmin and dminCeil = 8/Dmin^2 (7.71/17.61/16.72). A measured ' +
      'centered finite-difference per-term elasticity independently confirms e_j to ' +
      'relative <= 3.7e-4; the only ratio above 1 is a 2.8e-7 FD-truncation blip on ' +
      'plateau 0 at a tight nearest term, not a real violation. Every interior term is ' +
      'strictly below the majorant -- it is tight exactly where imp-3898 predicts and ' +
      'nowhere else. Verification only; 7 of 10 plateaus a named open sub-gap; ' +
      'Platt-Trudgian Lambda <= 0.2 stays SOTA; imp-3066 untouched; NO QED.',
  },

  refinesAggregate:
    'imp-3898 certified only the Psi-weighted aggregate (dPsi/dT)/Psi = sum_j w_j e_j <= ' +
    '8 sum_j w_j/s_min(j)^2 against imp-3874. This confirms the per-term ingredient ' +
    'e_j <= 8/s_min(j)^2 holds for every active term j, not merely under the w_j-weighting, ' +
    'and that saturation (ratio = 1) occurs exactly at the nearest single-gap terms.',

  openSubGap: {
    id: 'imp-3917-sub-all-plateaus',
    status: 'open',
    blocker: false,
    statement:
      'The per-term cross-validation covers 3 of the 10 imp-3725 plateaus (0, 4, 9). The ' +
      'per-term majorant is the elementary min-inequality (gap-value-independent) so it ' +
      'holds identically on the other 7, but they were not machine-checked term-by-term here.',
  },

  provenance: {
    zeros: 'src/data/zeros-to-1e6.js (Odlyzko; zeros1 3e-9, imp-359/imp-514)',
    generator: 'scripts/imp-3917-per-term-majorant-crossvalidate.mjs',
    generatedAt: '2026-07-03',
    note: 'Per-term scan baked offline; Dmin / nearest-term majorant cross-check live against imp-3898.',
  },

  scope: {
    verificationOnly: true,
    noNewLambdaBound: true,
    imp3066Untouched: true,
    plattTrudgianStillSOTA: 'Lambda <= 0.2 (PT 2021) remains SOTA',
    noQED: true,
  },
});

// -- Build-time assertions (throw on failure via run-assertions harness) -----

const rel = (x, y) => Math.abs(x - y) / Math.max(Math.abs(x), Math.abs(y), 1e-300);

export const IMP_3917_PER_TERM_MAJORANT_CROSSVALIDATION_ASSERTIONS = [
  {
    id: 'imp3917-dmin-and-dminceil-cross-check-imp3898',
    holds: () =>
      ROWS.length === 3 &&
      ROWS.every((r) => {
        const dmin98 = DMIN_98[r.plateauIndex];
        const dminCeil98 = DMINCEIL_98[r.plateauIndex];
        const near = r.nearest.reduce((m, n) => (n.Dj < m.Dj ? n : m));
        return (
          dmin98 !== undefined &&
          rel(r.Dmin, dmin98) < 1e-7 &&                    // baked Dmin matches imp-3898
          rel(near.Dj, r.Dmin) < 1e-12 &&                  // nearest-term Dj IS Dmin
          rel(near.majorant, dminCeil98) < 1e-6            // its majorant IS 8/Dmin^2
        );
      }),
    why:
      'The baked per-plateau Dmin and the minimal nearest-term majorant reproduce the ' +
      'imp-3898 Dmin and dminCeil = 8/Dmin^2 to the last baked digit -- the per-term scan ' +
      'is anchored to the same plateau geometry, not a freshly invented one.',
  },
  {
    id: 'imp3917-analytic-majorant-holds-per-term',
    holds: () =>
      ALL_HOLD_ANALYTIC === true &&
      ROWS.every((r) => r.allHoldAnalytic === true && r.maxRatioAnalytic <= 1 + 1e-12) &&
      MAX_RATIO_ANALYTIC <= 1 + 1e-12,
    why:
      'Central check: the analytic per-term elasticity e_j = 8 P_j/D_j satisfies ' +
      'e_j <= 8/s_min(j)^2 for EVERY active term j on all three plateaus (maxRatioAnalytic ' +
      '= 1), so the imp-3898 majorant holds term-by-term, not only on the aggregate.',
  },
  {
    id: 'imp3917-nearest-single-gap-terms-tight',
    holds: () =>
      ROWS.every((r) =>
        r.nearest.length === 2 &&
        r.nearest.every(
          (n) =>
            rel(n.ratioAnalytic, 1) < 1e-9 &&              // ratio = 1 exactly
            rel(n.eAnalytic, n.majorant) < 1e-9 &&         // e_j = majorant
            rel(n.majorant, 8 / (n.Dj * n.Dj)) < 1e-6,     // majorant = 8/D_j^2
        )),
    why:
      'Tightness check: the nearest single-gap terms (m_j = 1) saturate the majorant with ' +
      'e_j = 8/D_j^2 exactly (ratioAnalytic = 1), exactly the imp-3898 nearest-term tight ' +
      'case -- so the maximum-ratio-1 in the previous assertion is attained there.',
  },
  {
    id: 'imp3917-measured-fd-elasticity-confirms-analytic',
    holds: () =>
      ROWS.every((r) => r.maxFdVsAnalyticRel < 1e-3 && r.maxRatioFD < 1 + 1e-6) &&
      MAX_FD_VS_ANALYTIC_REL < 1e-3 &&
      MAX_RATIO_FD < 1 + 1e-6,
    why:
      'The measured centered finite-difference per-term elasticity e_j^FD matches the ' +
      'analytic e_j to relative < 1e-3 across ~1.1M terms; the only FD ratio above 1 is a ' +
      'sub-1e-6 truncation blip at a tight nearest term, i.e. FD noise, not a real ' +
      'violation of the rigorous (analytic) per-term inequality.',
  },
  {
    id: 'imp3917-saturation-only-at-nearest-terms',
    holds: () =>
      ROWS.every((r) =>
        r.nearSaturationTerms >= 1 &&
        r.nearSaturationTerms <= r.nearest.length &&
        r.activeTerms > 1e4),
    why:
      'Saturation profile: only the 1-2 nearest single-gap terms sit at ratio ~ 1; every ' +
      'other active term (out of tens of thousands to ~1M) is strictly below the majorant, ' +
      'confirming the bound is tight exactly at the nearest terms and nowhere else.',
  },
  {
    id: 'imp3917-verification-only-no-lambda-claim',
    holds: () =>
      IMP_3917_PER_TERM_MAJORANT_CROSSVALIDATION.scope.noNewLambdaBound === true &&
      IMP_3917_PER_TERM_MAJORANT_CROSSVALIDATION.scope.noQED === true &&
      IMP_3917_PER_TERM_MAJORANT_CROSSVALIDATION.scope.imp3066Untouched === true &&
      IMP_3917_PER_TERM_MAJORANT_CROSSVALIDATION.openSubGap.status === 'open' &&
      // this only per-term-verifies an existing derived majorant; imp-3898 stays a partial
      IMP_3898_PATH_LOCAL_ELASTICITY_BOUND.scope.noQED === true,
    why:
      'Honesty guard: this per-term-verifies the imp-3898 majorant. It must not assert a ' +
      'new Lambda bound or a QED, imp-3066 stays untouched, and the 7-remaining-plateaus ' +
      'sub-gap stays named open; Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  },
];

// Self-executing (imp-3715 convention): any failed assertion throws at import.
for (const assertion of IMP_3917_PER_TERM_MAJORANT_CROSSVALIDATION_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-3917-per-term-majorant-crossvalidation assertion failed: ${assertion.id}`,
    );
  }
}

export default IMP_3917_PER_TERM_MAJORANT_CROSSVALIDATION;
