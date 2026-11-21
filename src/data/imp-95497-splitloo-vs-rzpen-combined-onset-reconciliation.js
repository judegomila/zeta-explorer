/**
 * @module imp-95497-splitloo-vs-rzpen-combined-onset-reconciliation
 * @fileoverview imp-95497 -- RECONCILE imp-95429 and imp-95445, which both
 *   combine the imp-95374 RZ-PEN floor degradation with a numerator/Blaschke
 *   drift on the SAME off-lattice draw, but price the numerator leg
 *   DIFFERENTLY:
 *
 *     imp-95429: models the numerator drift with a coalLaw-at-perturbed-rate
 *       PROXY (coalLaw evaluated at the jittered octave base rate nu_k), and
 *       reports a TOTAL onset (floor + numerator, both jittered).
 *     imp-95445: evaluates the ACTUAL imp-95253 SPLIT-LOO Blaschke
 *       certificate (the leave-one-out cross-factor fence Phi_k) on the
 *       identical draw, and reports the TRUE combined onset as the min of
 *       the SPLIT-LOO firing depth and the imp-95429 RZ-PEN total.
 *
 *   imp-95445's own header already states "WHY THIS IS NOT imp-95429" but no
 *   module recorded which of the two prices BINDS the true combined onset.
 *   This note is that reconciliation: it is bookkeeping only, changes no
 *   bound, and does not recompute either measurement -- it re-imports the
 *   imp-95445 published rows (which already reproduce the imp-95429 baked
 *   RZ-PEN total column) and records the comparison directly.
 *
 *   THE RECONCILIATION. At every jitter magnitude delta in {2^-6..2^-2}
 *   measured in imp-95445, the SPLIT-LOO Blaschke onset fires strictly
 *   shallower than the imp-95429 RZ-PEN total, so:
 *
 *     - imp-95445's SPLIT-LOO leg is the one that BINDS the true combined
 *       off-lattice every-octave onset throughout the band (12.37..15.98
 *       depth vs imp-95429's 12.62..23.45 depth).
 *     - imp-95429 is NOT superseded as a measurement in its own right -- its
 *       coalLaw-proxy numerator and its floor/numerator decomposition
 *       (FINDING 1-3 of that module) remain valid characterizations of the
 *       RZ-PEN architecture alone. What is superseded is only the use of the
 *       imp-95429 TOTAL as an estimate of the true combined onset: imp-95445
 *       shows that estimate is a substantial OVER-estimate (by 0.25..7.48
 *       depth units, ~2%..32%) because it never lets the SHALLOWER SPLIT-LOO
 *       certificate compete.
 *     - The two modules are COMPLEMENTARY, not duplicate or conflicting:
 *       imp-95429 = proxy-numerator model measurement, imp-95445 = actual-
 *       certificate combined-onset measurement. Downstream consumers of "the
 *       combined off-lattice onset" should read imp-95445's combinedOnset
 *       column, not imp-95429's rzpenTotalOnset alone.
 *
 *   MEASUREMENT / BOOKKEEPING ONLY. No fresh computation; changes no bound;
 *   NO QED; no refereed bound is changed.
 *
 * @see imp-95429-rzpen-offlattice-total-onset.js (the coalLaw-proxy TOTAL onset)
 * @see imp-95445-total-offlattice-onset-blaschke-composition.js (the actual SPLIT-LOO combined onset, min of the two legs)
 */

import { IMP95445_TOTAL_OFFLATTICE_ONSET_BLASCHKE_COMPOSITION } from './imp-95445-total-offlattice-onset-blaschke-composition.js';

const IMP95445_REC = IMP95445_TOTAL_OFFLATTICE_ONSET_BLASCHKE_COMPOSITION;

export const IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION = {
  ticket: 'imp-95497',
  proofSection: 'S-frontier',
  question:
    'imp-95429 and imp-95445 both combine the imp-95374 RZ-PEN floor degradation with a numerator drift ' +
    'on the SAME off-lattice draw, but imp-95429 models the numerator with a coalLaw-at-perturbed-rate ' +
    'PROXY while imp-95445 evaluates the ACTUAL imp-95253 SPLIT-LOO Blaschke certificate. Which prices the ' +
    'true combined off-lattice onset, and how do the two modules relate?',
  proxyMeasurement: 'imp-95429',
  actualCertificateMeasurement: 'imp-95445',
  rows: IMP95445_REC.rows.map((row) => ({
    delta: row.delta,
    splitLooOnset: row.splitLooOnset,
    rzpenProxyTotalOnset: row.rzpenTotalOnset,
    trueCombinedOnset: row.combinedOnset,
    binds: row.binds,
    rzpenOverEstimate: row.rzpenOverEstimate,
  })),
  verdict:
    'RECONCILED: the imp-95445 SPLIT-LOO Blaschke leg fires strictly shallower than the imp-95429 RZ-PEN ' +
    'proxy total at every jitter magnitude, so imp-95445 combinedOnset (the min of the two legs) is the ' +
    'measurement that BINDS the true combined off-lattice every-octave onset, throughout +-1.56%..+-25%. ' +
    'imp-95429 is NOT invalidated -- its coalLaw-proxy numerator model and floor/numerator decomposition ' +
    'remain a valid characterization of the RZ-PEN architecture in isolation -- but its TOTAL column is ' +
    'superseded as an estimate of the true combined onset, which it over-states by 0.25..7.48 depth units ' +
    '(~2%..32%). The two modules are COMPLEMENTARY: proxy model (imp-95429) vs actual certificate ' +
    '(imp-95445), not duplicate or conflicting measurements. Bookkeeping reconciliation only; changes no ' +
    'bound; NO QED; no refereed bound is changed.',
  honest:
    'Bookkeeping reconciliation only, re-using the already-published imp-95445 rows (which themselves ' +
    'reproduce the imp-95429 baked RZ-PEN total column) with no fresh computation. Establishes no operator ' +
    'positivity, changes no Lambda bound, and supplies no off-lattice floor/onset theorem. gammaSL ' +
    'obligation (3), signed WEIGHT / modulus-phase legs, and the imp-95212 envelope port remain OPEN. NO ' +
    'QED; no refereed bound is changed.',
};

export const IMP95497_ASSERTIONS = [
  {
    id: 'imp-95497-splitloo-binds-every-row',
    description:
      'the imp-95445 SPLIT-LOO leg binds (fires strictly shallower than the imp-95429 proxy total) at ' +
      'every reconciled jitter magnitude',
    holds: () =>
      IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION.rows.length === 5 &&
      IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION.rows.every(
        (row) =>
          row.binds === 'split-loo' &&
          row.splitLooOnset < row.rzpenProxyTotalOnset &&
          Math.abs(row.trueCombinedOnset - row.splitLooOnset) < 1e-12,
      ),
  },
  {
    id: 'imp-95497-overestimate-matches-imp95445',
    description:
      'the recorded rzpenOverEstimate values match the imp-95445 published column exactly (no fresh ' +
      'recompute, pure re-tabulation)',
    holds: () =>
      IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION.rows.every(
        (row, i) => row.rzpenOverEstimate === IMP95445_REC.rows[i].rzpenOverEstimate,
      ),
  },
  {
    id: 'imp-95497-honesty-gate-no-qed',
    description: 'verdict and honest scope carry RECONCILED / bookkeeping / changes-no-bound / NO QED / PT SOTA labels',
    holds: () =>
      /RECONCILED/.test(IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION.verdict) &&
      /COMPLEMENTARY/.test(IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION.verdict) &&
      /NO QED/.test(IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION.verdict) &&
      /refereed bound is changed/i.test(IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION.verdict) &&
      /Bookkeeping reconciliation only/.test(IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION.honest) &&
      /remain OPEN/.test(IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION.honest),
  },
];

for (const a of IMP95497_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95497-splitloo-vs-rzpen-combined-onset-reconciliation assertion failed: ${a.id}`);
  }
}

export default IMP95497_SPLITLOO_VS_RZPEN_RECONCILIATION;
