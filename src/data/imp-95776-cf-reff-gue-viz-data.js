/**
 * imp-95776: import-light viz-data reshaping the imp-95747 flat-vs-GUE r_eff
 * repulsion-regularization measurement into two plottable series: the
 * per-cutoff r_eff curves (flat-RvM diverging vs GUE-reweighted saturating)
 * and the resulting box-min gap depths.
 *
 * Reuses the baked R_EFF_FLAT / R_EFF_GUE / BOX_MIN literals from imp-95747
 * (no re-derivation, no new computation): this module only reshapes them
 * into ordered per-cutoff rows and a four-point box-min-depth series.
 *
 * MEASUREMENT ONLY. Changes no bound; NO QED; no refereed bound is changed
 * ; imp-486 C_mb GUE-conditional untouched.
 *
 * @see imp-95747-cf-reff-gue-repulsion-regularization.js (source literals)
 */

import { IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION } from './imp-95747-cf-reff-gue-repulsion-regularization.js';

const FLAT = IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION.rEffFlat;
const GUE = IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION.rEffGue;
const SATURATED = IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION.rEffGueSaturated;
const BOX_MIN = IMP95747_CF_REFF_GUE_REPULSION_REGULARIZATION.boxMinGap;

// Ordered largest-cutoff-first to smallest (mirrors the near-anchor approach alpha_max -> 1).
export const REFF_CUTOFF_ROWS = [
  { c: 10, label: 'c=10', flat: FLAT.c10, gue: GUE.c10 },
  { c: 5, label: 'c=5', flat: FLAT.c5, gue: GUE.c5 },
  { c: 2, label: 'c=2', flat: FLAT.c2, gue: GUE.c2 },
  { c: 1, label: 'c=1', flat: FLAT.c1, gue: GUE.c1 },
  { c: 0.1, label: 'c=0.1', flat: FLAT.c0p1, gue: GUE.c0p1 },
  { c: 0.01, label: 'c=0.01', flat: FLAT.c0p01, gue: GUE.c0p01 },
  { c: 0.001, label: 'c=0.001', flat: FLAT.c0p001, gue: GUE.c0p001 },
];

export const REFF_GUE_SATURATED = SATURATED;

export const BOX_MIN_ROWS = [
  { label: 'nominal (cf=1x)', gap: BOX_MIN.at_cf1_nominal },
  { label: 'flat c=1 (r_eff 8.589x)', gap: BOX_MIN.band.flat_c1 },
  { label: 'GUE c=1 (r_eff 8.565x)', gap: BOX_MIN.band.gue_c1 },
  { label: 'GUE saturated (r_eff 9.583x)', gap: BOX_MIN.band.gue_saturated },
];

export const IMP95776_SUMMARY = Object.freeze({
  law: 'GUE level repulsion regularizes the imp-95721 near-anchor 1/(1-alpha) divergence into a finite, cutoff-independent r_eff = 9.583x, but does not lower it below the 8.6x one-spacing value.',
  reading: `As the near-anchor cutoff c shrinks from 10 to 0.001 mean spacings, the flat-RvM r_eff keeps climbing (${FLAT.c10} -> ${FLAT.c0p001}, ~2.5x per decade) while the GUE-reweighted r_eff bends over and SATURATES at ${SATURATED}x. The resulting box-min gap barely moves at c=1 (${BOX_MIN.band.flat_c1} -> ${BOX_MIN.band.gue_c1}) and deepens slightly further to ${BOX_MIN.band.gue_saturated} at the saturated r_eff -- the same wedge corner throughout.`,
  verdict: 'PRESENTATION ONLY, no new computation; re-plots imp-95747 literals. Changes no bound; NO QED; RH open; Catalan G irrationality open; no refereed bound is changed; imp-486 C_mb GUE-conditional untouched.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const near = (u, v, tol) => Math.abs(u - v) <= tol;

const IMP95776_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95776-seven-cutoff-rows-descending',
    description: 'seven cutoffs present, in strictly descending c order (10 down to 0.001)',
    holds: () =>
      REFF_CUTOFF_ROWS.length === 7 &&
      REFF_CUTOFF_ROWS.every((r, i) => i === 0 || r.c < REFF_CUTOFF_ROWS[i - 1].c),
  },
  {
    id: 'imp95776-flat-values-reproduce-source',
    description: 'each row flat/gue value matches the imp-95747 literal it was reshaped from',
    holds: () => {
      const expectedFlat = [FLAT.c10, FLAT.c5, FLAT.c2, FLAT.c1, FLAT.c0p1, FLAT.c0p01, FLAT.c0p001];
      const expectedGue = [GUE.c10, GUE.c5, GUE.c2, GUE.c1, GUE.c0p1, GUE.c0p01, GUE.c0p001];
      return REFF_CUTOFF_ROWS.every((r, i) => near(r.flat, expectedFlat[i], 1e-9) && near(r.gue, expectedGue[i], 1e-9));
    },
  },
  {
    id: 'imp95776-flat-diverges-gue-saturates',
    description: 'flat keeps growing across the last three cutoffs; GUE is within 5e-3 of the saturated limit by c=0.01',
    holds: () =>
      REFF_CUTOFF_ROWS[4].flat < REFF_CUTOFF_ROWS[5].flat &&
      REFF_CUTOFF_ROWS[5].flat < REFF_CUTOFF_ROWS[6].flat &&
      near(REFF_CUTOFF_ROWS[5].gue, REFF_GUE_SATURATED, 5e-3) &&
      near(REFF_CUTOFF_ROWS[6].gue, REFF_GUE_SATURATED, 5e-3),
  },
  {
    id: 'imp95776-box-min-rows-four-points-monotone-deepening',
    description: 'box-min rows are nominal, flat c1, GUE c1, GUE saturated, with the saturated point deepest',
    holds: () =>
      BOX_MIN_ROWS.length === 4 &&
      BOX_MIN_ROWS[3].gap < BOX_MIN_ROWS[2].gap &&
      BOX_MIN_ROWS[3].gap < BOX_MIN_ROWS[1].gap &&
      BOX_MIN_ROWS[1].gap < BOX_MIN_ROWS[0].gap,
  },
  {
    id: 'imp95776-honesty-gate-no-qed',
    description: 'summary carries NO QED / RH open / no-refereed-bound-change markers',
    holds: () =>
      /NO QED/.test(IMP95776_SUMMARY.verdict) &&
      /RH open/.test(IMP95776_SUMMARY.verdict) &&
      /refereed bound is changed/i.test(IMP95776_SUMMARY.verdict),
  },
];

for (const a of IMP95776_VIZ_DATA_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95776-cf-reff-gue-viz-data assertion failed: ${a.id}`);
  }
}
