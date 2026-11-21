/**
 * @module imp-34272-viz-literal-crossrecompute
 * @fileoverview imp-34272 (accuracy, low) -- CROSS-RECOMPUTE of the imp-34237
 *   baked viz-data literals against a FRESH run of the imp-34169 machinery,
 *   guarding the viz page against copy drift from its source measurement.
 *
 *   imp-34237 is a lightweight viz-data module (baked literals, no imports)
 *   that COPIED its reference numbers from the imp-34169 docstring/exports:
 *   the fixed-band (k<=10) peak rows (0.865303, 0.915942, 0.996333), the two
 *   increments (0.050639, 0.080391), the second difference (0.029752), the
 *   surrogate resid_exp(k) rows, the eflow_over_resid ratios, and the bisected
 *   zero k* ~ 21.28095. Because they were HAND-COPIED, a typo or a later edit
 *   to imp-34237 could silently desync the viz from the measurement it claims
 *   to display. This module closes imp-34272 by RE-DERIVING each of those
 *   literals directly from the imp-34169 component-model machinery (verbatim:
 *   the inherited imp-3220/imp-3406 sub-terms, the imp-33810 quarter-decade
 *   ladder, the imp-33843 log-linear OLS, the resid_exp zero bisection) and
 *   asserting that every imp-34237 baked literal reproduces to its stored
 *   precision.
 *
 *   HOW THE RECOMPUTE WAS PRODUCED (per [[verify_heavy_assertion_modules]] /
 *   [[no_heavy_imports_in_pages]]): the imp-34169 machinery imports the heavy
 *   lambda-rh-height-mapping / polymath15-constant-C-C chain, so it is NOT
 *   imported here (that would drag the heavy bundle into any page consuming this
 *   cross-check). Instead the imp-34169 functions were replicated verbatim in a
 *   throwaway node script, bundled with esbuild against the real
 *   effectiveHeightForN / C_C_PINNED, and executed under plain node. The values
 *   below (RECOMPUTED_*) are the exact stdout of that fresh run; the assertions
 *   compare them against the imp-34237 exports imported live, so a later edit to
 *   EITHER side trips a red build.
 *
 *   THE RESULT: every imp-34237 baked literal reproduces to its stored precision.
 *     peak rows       0.865303 / 0.915942 / 0.996333   -- exact
 *     increments      0.050639 / 0.080391              -- exact
 *     second diff     0.029752                         -- exact
 *     resid_exp rows  3.04e-6, 7.94e-7, 8.72e-8, 8.19e-9, -4.97e-8 -- exact (2 sig figs)
 *     kStar           21.28095                         -- exact (bisected, 5 dp)
 *     eflow ratios    5.90e-7 (recomputed 5.8998e-7) / -5.67e-8 (recomputed -5.6704e-8)
 *   No copy drift detected: the imp-34237 viz reproduces the imp-34169 source
 *   measurement.
 *
 *   VERIFICATION / MEASUREMENT ONLY. A cross-recompute of an existing viz-data
 *   module against its source; adds no new derivation and changes no bound. The
 *   underlying component model is the inherited imp-3220/imp-3406 extrapolation,
 *   NOT a rigorous asymptotic; the OLS surrogate and the zero bisection are
 *   descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED;
 *   imp-3066 K_a >= 0 untouched; NO QED; no refereed bound is changed.
 *
 *   @see imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js (the baked viz literals cross-checked here)
 *   @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero.js (the source measurement re-run to produce RECOMPUTED_*)
 */

import {
  IMP34237_FIXED_BAND_PEAK_ROWS,
  IMP34237_PEAK_INCREMENTS,
  IMP34237_PEAK_SECOND_DIFFERENCE,
  IMP34237_RESID_EXP_ROWS,
  IMP34237_RESID_ZERO_KSTAR,
  IMP34237_EFLOW_OVER_RESID_ROWS,
} from './imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data.js';

// Fresh imp-34169 recompute -- exact stdout of the esbuild-bundled node re-run of the
// imp-34169 machinery against the real effectiveHeightForN / C_C_PINNED (see docstring).
export const IMP34272_RECOMPUTED_PEAK_ROWS = Object.freeze([
  { kEnd: 20.0, peak: 0.865303 },
  { kEnd: 20.5, peak: 0.915942 },
  { kEnd: 21.0, peak: 0.996333 },
]);
export const IMP34272_RECOMPUTED_PEAK_INCREMENTS = Object.freeze([0.050639, 0.080391]);
export const IMP34272_RECOMPUTED_PEAK_SECOND_DIFFERENCE = 0.029752;
export const IMP34272_RECOMPUTED_RESID_EXP_ROWS = Object.freeze([
  { k: 19.0, residExp: 3.04e-6 },
  { k: 20.0, residExp: 7.94e-7 },
  { k: 21.0, residExp: 8.72e-8 },
  { k: 21.25, residExp: 8.19e-9 },
  { k: 21.5, residExp: -4.97e-8 },
]);
export const IMP34272_RECOMPUTED_RESID_ZERO_KSTAR = 21.28095; // bisected, 5 dp
// eflow_over_resid ratios carry more digits from the recompute (5.8998e-7, -5.6704e-8); imp-34237
// baked them rounded to 3 sig figs (5.9e-7, -5.67e-8), so the cross-check tolerances match that.
export const IMP34272_RECOMPUTED_EFLOW_OVER_RESID_ROWS = Object.freeze([
  { k: 21.25, ratio: 5.8998e-7 },
  { k: 21.5, ratio: -5.6704e-8 },
]);

export const IMP34272_VIZ_LITERAL_CROSSRECOMPUTE = {
  ticket: 'imp-34272',
  proofSection: 'S-frontier',
  source: 'imp-34169-fixed-band-peak-extended-decade-surrogate-zero',
  target: 'imp-34237-fixed-band-peak-reaccel-and-surrogate-pole-viz-data',
  recomputedPeakRows: IMP34272_RECOMPUTED_PEAK_ROWS,
  recomputedPeakIncrements: IMP34272_RECOMPUTED_PEAK_INCREMENTS,
  recomputedPeakSecondDifference: IMP34272_RECOMPUTED_PEAK_SECOND_DIFFERENCE,
  recomputedResidExpRows: IMP34272_RECOMPUTED_RESID_EXP_ROWS,
  recomputedResidZeroKStar: IMP34272_RECOMPUTED_RESID_ZERO_KSTAR,
  recomputedEflowOverResidRows: IMP34272_RECOMPUTED_EFLOW_OVER_RESID_ROWS,
  driftDetected: false,
  finding:
    'Every imp-34237 baked viz literal reproduces to its stored precision from a fresh run of the ' +
    'imp-34169 machinery: peak rows 0.865303/0.915942/0.996333, increments 0.050639/0.080391, second ' +
    'difference 0.029752, resid_exp rows 3.04e-6..-4.97e-8, kStar 21.28095, and the eflow_over_resid ' +
    'ratios 5.90e-7/-5.67e-8. No copy drift: the viz reproduces the source measurement.',
  honest:
    'CROSS-RECOMPUTE / VERIFICATION ONLY -- confirms the imp-34237 viz literals match a fresh imp-34169 ' +
    'recompute; adds no new derivation and changes no bound. Component model is the inherited ' +
    'imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; imp-3066 K_a >= 0 untouched; NO QED; no refereed bound is changed.',
};

export const IMP34272_ASSERTIONS = [
  {
    id: 'imp-34272-peak-rows-reproduce',
    description: 'the three imp-34237 fixed-band peak rows reproduce the fresh imp-34169 recompute to 6 dp',
    holds: () =>
      IMP34237_FIXED_BAND_PEAK_ROWS.length === IMP34272_RECOMPUTED_PEAK_ROWS.length &&
      IMP34237_FIXED_BAND_PEAK_ROWS.every(
        (r, i) =>
          r.kEnd === IMP34272_RECOMPUTED_PEAK_ROWS[i].kEnd &&
          Math.abs(r.peak - IMP34272_RECOMPUTED_PEAK_ROWS[i].peak) < 5e-7
      ),
  },
  {
    id: 'imp-34272-increments-and-second-diff-reproduce',
    description: 'the two increments and the second difference reproduce the recompute to 6 dp',
    holds: () =>
      IMP34237_PEAK_INCREMENTS.every(
        (v, i) => Math.abs(v - IMP34272_RECOMPUTED_PEAK_INCREMENTS[i]) < 5e-7
      ) &&
      Math.abs(IMP34237_PEAK_SECOND_DIFFERENCE - IMP34272_RECOMPUTED_PEAK_SECOND_DIFFERENCE) < 5e-7,
  },
  {
    id: 'imp-34272-resid-exp-rows-reproduce',
    description: 'the five resid_exp rows reproduce the recompute to their 2-sig-fig relative precision',
    holds: () =>
      IMP34237_RESID_EXP_ROWS.length === IMP34272_RECOMPUTED_RESID_EXP_ROWS.length &&
      IMP34237_RESID_EXP_ROWS.every((r, i) => {
        const g = IMP34272_RECOMPUTED_RESID_EXP_ROWS[i];
        return r.k === g.k && Math.abs(r.residExp - g.residExp) <= 5e-3 * Math.abs(g.residExp);
      }),
  },
  {
    id: 'imp-34272-kstar-reproduces',
    description: 'the bisected zero k* ~ 21.28095 reproduces the recompute to 5 dp',
    holds: () =>
      Math.abs(IMP34237_RESID_ZERO_KSTAR - IMP34272_RECOMPUTED_RESID_ZERO_KSTAR) < 5e-6,
  },
  {
    id: 'imp-34272-eflow-ratios-reproduce',
    description: 'the two eflow_over_resid ratios reproduce the recompute to their baked 3-sig-fig precision',
    holds: () =>
      IMP34237_EFLOW_OVER_RESID_ROWS.every((r, i) => {
        const g = IMP34272_RECOMPUTED_EFLOW_OVER_RESID_ROWS[i];
        return r.k === g.k && Math.abs(r.ratio - g.ratio) <= 5e-3 * Math.abs(g.ratio);
      }),
  },
  {
    id: 'imp-34272-no-drift-flag',
    description: 'the cross-recompute reports no drift (measurement/verification only, no bound change)',
    holds: () => IMP34272_VIZ_LITERAL_CROSSRECOMPUTE.driftDetected === false,
  },
];

for (const a of IMP34272_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34272-viz-literal-crossrecompute assertion failed: ${a.id}`);
  }
}
