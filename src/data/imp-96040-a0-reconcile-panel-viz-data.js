/**
 * imp-96040 -- viz panel for the imp-96005 six-height a_0 reconciliation.
 *
 * imp-96005 backed a_0(T) out of six accessible zeta heights (T = 1e4..5e5),
 * compared the sample mean against the imp-95984 published conjectural
 * a_0 = -0.176248 (Chan Thm 1.1 under Montgomery-conjectural I_F = 1), and
 * found the gap is only 0.337 standard errors of the mean (two-sided
 * p ~ 0.736) -- noise-consistent, not a resolved discrepancy. That scatter,
 * mean, +/-SE band and conjectural line were never rendered visually. This
 * module derives flat, chart-ready rows directly from the frozen imp-96005
 * record -- no new cited input, no re-derivation.
 *
 * Import-light: only imports the imp-96005 module (no zeros bundle).
 *
 * @see imp-96005-a0-published-vs-empirical-reconcile (the measured rows, mean, SE, z, p this renders)
 */

import { IMP96005_A0_PUBLISHED_VS_EMPIRICAL_RECONCILE } from './imp-96005-a0-published-vs-empirical-reconcile.js';

const SRC = IMP96005_A0_PUBLISHED_VS_EMPIRICAL_RECONCILE;

export const IMP96040_A0_ROWS = Object.freeze(
  SRC.perHeight.map((row) => Object.freeze({ Tc: row.Tc, a0: row.a0 })),
);

export const IMP96040_MEAN_SE = Object.freeze({
  mean: SRC.empirical.mean,
  seMean: SRC.empirical.seMean,
  sampleSd: SRC.empirical.sampleSd,
});

export const IMP96040_CONJECTURAL = Object.freeze({
  value: SRC.published.a0Conjectural,
  zScore: SRC.reconciliation.zScore,
  pTwoSided: SRC.reconciliation.pTwoSided,
});

export const IMP96040_CAVEAT_BANNER =
  'Presentation only: re-plots the frozen imp-96005 six-height a_0 scatter, sample mean, ' +
  '+/-SE band and imp-95984 conjectural line verbatim (no re-derivation, no fresh measurement). ' +
  'The conjectural - empirical gap is 0.337 SE (two-sided p ~ 0.736), FULLY noise-consistent, ' +
  'not a resolved discrepancy -- the six-height route cannot discriminate -0.176248 from -0.116 ' +
  'or from zero. Changes no bound, establishes no operator positivity, no RH claim; ' +
  'no refereed bound is changed; NO QED.';

export const IMP96040_ASSERTIONS = [
  {
    id: 'imp96040-six-rows-match-source-order',
    description: 'exactly six a_0 rows exist, in the same T order as the imp-96005 source table',
    holds: () =>
      IMP96040_A0_ROWS.length === 6 &&
      IMP96040_A0_ROWS.every((row, i) => row.Tc === SRC.perHeight[i].Tc),
  },
  {
    id: 'imp96040-mean-se-band-matches-source',
    description: 'the rendered mean/SE values equal the imp-96005 empirical record exactly',
    holds: () =>
      IMP96040_MEAN_SE.mean === SRC.empirical.mean &&
      IMP96040_MEAN_SE.seMean === SRC.empirical.seMean &&
      IMP96040_MEAN_SE.seMean > 0,
  },
  {
    id: 'imp96040-conjectural-line-and-stats-match-source',
    description: 'the conjectural line value, z-score and p-value equal the imp-96005 record exactly',
    holds: () =>
      IMP96040_CONJECTURAL.value === SRC.published.a0Conjectural &&
      IMP96040_CONJECTURAL.zScore === SRC.reconciliation.zScore &&
      IMP96040_CONJECTURAL.pTwoSided === SRC.reconciliation.pTwoSided,
  },
  {
    id: 'imp96040-caveat-carries-honesty-markers',
    description: 'the caveat banner names the noise-consistent verdict and keeps the NO QED / SOTA guardrail',
    holds: () =>
      /noise-consistent/.test(IMP96040_CAVEAT_BANNER) &&
      /NO QED/.test(IMP96040_CAVEAT_BANNER) &&
      /refereed bound is changed/i.test(IMP96040_CAVEAT_BANNER) &&
      SRC.isRigorous === false,
  },
];

for (const a of IMP96040_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96040-a0-reconcile-panel-viz-data assertion failed: ${a.id}`);
  }
}
