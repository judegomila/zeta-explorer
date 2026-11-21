/**
 * imp-95777: import-light viz-data reshaping the imp-95724 exact J=3/2+dI
 * split and the imp-95749 conditional dI-variation measurement into two
 * plottable series: the SHARE of J held by the rho-free bulk (J_free) vs
 * the rho-carrying term (dI), and the AMPLIFICATION of dI's fractional
 * variation over J's (dI carries only ~40% of J but 100% of the drift).
 *
 * Reuses the baked literals from imp-95724 (anchorMagnitude) and imp-95749
 * (variation) verbatim -- no re-derivation, no new computation. This module
 * only reshapes them into chart-ready rows for the di-share-amplification
 * viz page.
 *
 * MEASUREMENT ONLY. dI variation is CONDITIONAL on the imp-95720/95745 +4
 * offset hypothesis (verified only at m=20). Changes no bound; NO QED;
 * no refereed bound is changed; Catalan G irrationality OPEN.
 *
 * @see imp-95724-c-odd-J-variation-magnitude-assessment.js (exact split, anchor share)
 * @see imp-95749-di-variation-against-constant-J-null.js (conditional variation, amplification)
 */

import { C_ODD_J_VARIATION_MAGNITUDE_ASSESSMENT } from './imp-95724-c-odd-J-variation-magnitude-assessment.js';
import { DI_VARIATION_AGAINST_CONSTANT_J_NULL } from './imp-95749-di-variation-against-constant-J-null.js';

const ANCHOR = C_ODD_J_VARIATION_MAGNITUDE_ASSESSMENT.anchorMagnitude;
const SPLIT = C_ODD_J_VARIATION_MAGNITUDE_ASSESSMENT.exactSplit;
const VAR = DI_VARIATION_AGAINST_CONSTANT_J_NULL.variation;

const J_FREE = SPLIT.jFree; // 3/2, exact and rho-free
const DI_AT_ANCHOR = ANCHOR.diAtAnchor; // 1.01069789 (kappa - 3/2)
const DI_FRACTION_OF_J = ANCHOR.diFractionOfJ; // ~0.4026

// J-share split: how much of J each piece holds at the anchor.
export const J_SHARE_ROWS = Object.freeze([
  Object.freeze({
    label: 'J_free (rho-free bulk)',
    value: J_FREE,
    shareOfJ: 1 - DI_FRACTION_OF_J,
    color: '#64748b',
  }),
  Object.freeze({
    label: 'dI (rho-carrying term)',
    value: DI_AT_ANCHOR,
    shareOfJ: DI_FRACTION_OF_J,
    color: '#f59e0b',
  }),
]);

// Variation-share rows: fractional drift carried by J as a whole vs by dI alone.
export const VARIATION_SHARE_ROWS = Object.freeze([
  Object.freeze({
    label: 'J (whole)',
    fractionalVariation: VAR.j_fractional_variation,
    shareOfJ: 1,
  }),
  Object.freeze({
    label: 'dI (rho-carrying part)',
    fractionalVariation: VAR.di_fractional_variation,
    shareOfJ: DI_FRACTION_OF_J,
  }),
]);

export const AMPLIFICATION_RATIO = VAR.amplification; // 2.484 = kappa / dI(1/20)

export const IMP95777_SUMMARY = Object.freeze({
  law:
    'dI carries only ~40% of J (the exact 3/2 rho-free bulk holds the other ~60%) but ALL of the '
    + 'rho-variation, so its fractional drift is amplified by J/dI = kappa/dI(1/20) over J’s.',
  reading:
    `At the anchor, J = ${J_FREE} + ${DI_AT_ANCHOR.toFixed(8)} splits ${(100 * (1 - DI_FRACTION_OF_J)).toFixed(1)}% `
    + `rho-free / ${(100 * DI_FRACTION_OF_J).toFixed(1)}% rho-carrying. Under the imp-95749 conditional `
    + `variation, J drifts ${(100 * VAR.j_fractional_variation).toFixed(4)}% while dI drifts `
    + `${(100 * VAR.di_fractional_variation).toFixed(4)}% -- ${AMPLIFICATION_RATIO.toFixed(3)}x larger, `
    + 'exactly the inverse of dI’s ~40% share of J.',
  verdict:
    'PRESENTATION ONLY, no new computation; reshapes imp-95724 / imp-95749 literals. dI variation is '
    + 'CONDITIONAL on the +4 offset hypothesis (verified only at m=20). Changes no bound; NO QED; RH '
    + 'open; Catalan G irrationality open; no refereed bound is changed.',
});

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

const near = (u, v, tol) => Math.abs(u - v) <= tol;

const IMP95777_VIZ_DATA_ASSERTIONS = [
  {
    id: 'imp95777-j-share-rows-sum-to-one',
    description: 'the two J-share rows sum to exactly 1 (rho-free + rho-carrying = whole)',
    holds: () => near(J_SHARE_ROWS[0].shareOfJ + J_SHARE_ROWS[1].shareOfJ, 1, 1e-12),
  },
  {
    id: 'imp95777-di-share-is-carried-verbatim',
    description: 'the dI share of J matches the imp-95724 anchorMagnitude.diFractionOfJ verbatim',
    holds: () => near(J_SHARE_ROWS[1].shareOfJ, DI_FRACTION_OF_J, 1e-12),
  },
  {
    id: 'imp95777-amplification-matches-source',
    description: 'AMPLIFICATION_RATIO equals the imp-95749 variation.amplification literal (2.484)',
    holds: () => near(AMPLIFICATION_RATIO, 2.484, 2e-3),
  },
  {
    id: 'imp95777-amplification-is-inverse-of-di-share',
    description: 'amplification = 1 / dI-share-of-J (kappa/dI(1/20) = 1/(dI(1/20)/kappa))',
    holds: () => near(AMPLIFICATION_RATIO, 1 / DI_FRACTION_OF_J, 1e-3),
  },
  {
    id: 'imp95777-honest-status-carried',
    description: 'summary verdict restates conditional / NO QED / no-refereed-bound-change honesty markers',
    holds: () =>
      /CONDITIONAL/.test(IMP95777_SUMMARY.verdict)
      && /NO QED/.test(IMP95777_SUMMARY.verdict)
      && /refereed bound is changed/i.test(IMP95777_SUMMARY.verdict),
  },
];

for (const assertion of IMP95777_VIZ_DATA_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95777 viz-data assertion failed: ${assertion.id} -- ${assertion.description}`);
  }
}

export default IMP95777_SUMMARY;
