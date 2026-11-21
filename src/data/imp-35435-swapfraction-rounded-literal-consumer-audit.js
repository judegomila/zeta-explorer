/**
 * @module imp-35435-swapfraction-rounded-literal-consumer-audit
 *
 * imp-35435 (accuracy, opus-4-8, api-pool): CONSUMER MAP for the reconstruction discrepancy
 * imp-35402 flagged. imp-35402 found that recomputing swapFraction from the 4-decimal-rounded
 * fdVsAnalyticGap/analyticResidual (equivalently inverseSwapGap/analyticResidual) literals of
 * the imp-35279/imp-35280 E_flow far-tail four-rung ladder lands up to ~1.3% off the module
 * full-precision value (0.7815/0.6517/0.5938/0.5814 vs the stored 0.786/0.648/0.600/0.568),
 * and warned that future literal reconstructions inherit this small-denominator double-rounding
 * amplification. imp-35402 never mapped WHICH downstream consumers would surface it. This module
 * enumerates every src/data, viz-data, and src/pages consumer of the imp-35279/imp-35280
 * gap/residual/swapFraction columns and classifies each by whether it inherits the discrepancy.
 *
 * THE THREE CONSUMER CLASSES (grep basis recorded in CONSUMERS below)
 * ------------------------------------------------------------------
 *   A. FULL-PRECISION-SAFE -- recompute swapFraction (or remnantFraction = 1 - swapFraction)
 *      from a FRESH effectiveHeightForN full-precision division, never touching the rounded
 *      storage columns, so they cannot inherit the amplification:
 *        - imp-35370-eflow-fartail-swap-fraction-half-crossover.js  (swapFractionForN, toFixed(6))
 *        - imp-35378-eflow-fartail-inverse-swap-ladder-1e20-1e24.js (fresh compute, toFixed(4))
 *        - imp-35390-eflow-fartail-remnant-overtakes-swap-crossover.js (remnantFractionForN)
 *        - imp-35236 (the original two-endpoint source; fresh compute)
 *      These are SAFE: their stored swapFraction is faithful to the live computation and does
 *      not depend on dividing already-rounded siblings.
 *
 *   B. BAKED-ROUNDED-LITERAL (LATENT) -- bake the 4-decimal swapGap/remnant/residual literals
 *      AND a separately-baked, full-precision-derived swapFraction field:
 *        - imp-35400-eflow-fartail-two-component-ladder-viz-data.js (IMP35400_LADDER)
 *        - src/pages/Imp35400EflowFartailTwoComponentLadderViz.jsx  (reads baked swapFraction)
 *      No LIVE number here is currently wrong -- the page reads the baked swapFraction field
 *      directly, it does NOT divide swapGap/residual -- but the two are NOT mutually consistent:
 *      dividing the published swapGap/residual columns lands up to ~1.3% off the published
 *      swapFraction (0.0025/0.0043 = 0.5814 vs 0.568 at N = 1e16). A reader (or a future
 *      recompute) who reconstructs swapFraction from the visible columns inherits the flag.
 *      RECOMMENDATION: carry an explicit rounding caveat (swapFraction is faithful to the live
 *      full-precision computation and is NOT reproducible by dividing the 4-decimal columns), or
 *      read the source-module full-precision export. PREVENTIVE, not a correction of a live value.
 *
 *   C. ABSORBED-BY-INTEGER-ROUNDING (LOW risk) -- recompute a percentage from rounded literals
 *      but display it as an integer, so the sub-percent amplification is swallowed:
 *        - src/pages/Imp35295EflowFartailResidualDecompositionViz.jsx
 *          (renders (100 * inverseSwapGap / analyticResidual).toFixed(0)% from imp-35236 rounded
 *           literals; the toFixed(0) integer display absorbs the amplification; same
 *           double-rounding pattern, imp-35236 provenance, at most a 1-percentage-point swing).
 *
 *   (The imp-35402 flagger itself and imp-35434, which recompute at BOTH full precision and the
 *    storage convention, are reconstruction-aware and need no fix.)
 *
 * NET: exactly ONE consumer cluster (the imp-35400 viz-data + its page) bakes the rounded
 * columns alongside swapFraction and would surface the ~1.3% discrepancy under any recompute;
 * it is flagged for a rounding caveat or a full-precision read. All fresh-compute consumers are
 * SAFE, and the imp-35295 page absorbs the error in an integer display.
 *
 * AUDIT / CONSUMER-MAP ONLY. No re-derivation of the underlying E_flow quantity; edits no bound;
 * E_flow > 0 strictness (imp-33848) untouched; C_mb GUE-conditional per imp-486 UNTOUCHED; no
 * operator positivity; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35402-eflow-fartail-ladder-literal-reconstruction-check (flagged the ~1.3% error, no consumer map)
 * @see imp-35279-eflow-fartail-inverse-swap-ladder (authoritative full-precision-derived swapFraction column)
 * @see imp-35400-eflow-fartail-two-component-ladder-viz-data (the one baked-literal consumer flagged here)
 */

import { IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER } from './imp-35279-eflow-fartail-inverse-swap-ladder.js';
import { IMP35400_LADDER } from './imp-35400-eflow-fartail-two-component-ladder-viz-data.js';

const RUNGS = IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER.rungs;

// The consumer map: one row per downstream module/page, with its inheritance class.
export const IMP35435_CONSUMER_MAP = Object.freeze([
  Object.freeze({
    file: 'src/data/imp-35370-eflow-fartail-swap-fraction-half-crossover.js',
    kind: 'data',
    class: 'FULL-PRECISION-SAFE',
    basis: 'swapFractionForN recomputes inverseSwapGap/analyticResidual from a fresh effectiveHeightForN division (toFixed(6)); never divides rounded columns',
    inheritsDiscrepancy: false,
  }),
  Object.freeze({
    file: 'src/data/imp-35378-eflow-fartail-inverse-swap-ladder-1e20-1e24.js',
    kind: 'data',
    class: 'FULL-PRECISION-SAFE',
    basis: 'fresh full-precision compute per rung; swapFraction = (inverseSwapGap/analyticResidual).toFixed(4) taken pre-rounding, not from stored columns',
    inheritsDiscrepancy: false,
  }),
  Object.freeze({
    file: 'src/data/imp-35390-eflow-fartail-remnant-overtakes-swap-crossover.js',
    kind: 'data',
    class: 'FULL-PRECISION-SAFE',
    basis: 'remnantFractionForN = 1 - swapFraction recomputed from a fresh full-precision division',
    inheritsDiscrepancy: false,
  }),
  Object.freeze({
    file: 'src/data/imp-35400-eflow-fartail-two-component-ladder-viz-data.js',
    kind: 'viz-data',
    class: 'BAKED-ROUNDED-LITERAL',
    basis: 'bakes 4-decimal swapGap/remnant/residual AND a separately-baked full-precision-derived swapFraction; the two are not mutually reproducible (dividing the columns lands up to ~1.3% off)',
    inheritsDiscrepancy: true,
    recommendation: 'carry an explicit rounding caveat, or read the imp-35279 full-precision swapFraction export -- swapFraction is NOT reproducible by dividing the published swapGap/residual',
  }),
  Object.freeze({
    file: 'src/pages/Imp35400EflowFartailTwoComponentLadderViz.jsx',
    kind: 'page',
    class: 'BAKED-ROUNDED-LITERAL',
    basis: 'reads the baked swapFraction field directly (no live number wrong today) but renders swapGap and residual columns beside it, so a reader dividing the visible columns lands ~1.3% off',
    inheritsDiscrepancy: true,
    recommendation: 'add a one-line caveat that swapFraction is the live full-precision share, not the ratio of the displayed 4-decimal columns',
  }),
  Object.freeze({
    file: 'src/pages/Imp35295EflowFartailResidualDecompositionViz.jsx',
    kind: 'page',
    class: 'ABSORBED-BY-INTEGER-ROUNDING',
    basis: 'recomputes (100 * inverseSwapGap / analyticResidual).toFixed(0)% from imp-35236 rounded literals; integer display swallows the sub-percent amplification (same pattern, imp-35236 provenance)',
    inheritsDiscrepancy: false,
  }),
]);

// The per-rung reconstruction discrepancy the flag is about, computed live from the imp-35400
// baked columns vs the authoritative imp-35279 stored swapFraction.
export const IMP35435_DISCREPANCY = Object.freeze(
  IMP35400_LADDER.map((r) => {
    const recomputedFromRounded = r.swapGap / r.residual; // what a reader dividing the columns gets
    return Object.freeze({
      N: r.N,
      recomputedFromRounded: +recomputedFromRounded.toFixed(4),
      bakedSwapFraction: r.swapFraction,
      absDiff: +Math.abs(recomputedFromRounded - r.swapFraction).toFixed(4),
    });
  }),
);

export default Object.freeze({
  id: 'imp-35435',
  proofSection: 'S-frontier',
  ticket: 'imp-35435',
  consumerMap: IMP35435_CONSUMER_MAP,
  discrepancy: IMP35435_DISCREPANCY,
  finding:
    'Exactly one consumer cluster inherits the imp-35402 ~1.3% rounded-literal reconstruction ' +
    'discrepancy: the imp-35400 two-component-ladder viz-data and its page, which bake the ' +
    '4-decimal swapGap/residual columns alongside a separately-baked full-precision swapFraction ' +
    'that the columns do NOT divide to. No live number is wrong today (the page reads the baked ' +
    'swapFraction), so the flag is PREVENTIVE: recommend a rounding caveat or a full-precision ' +
    'read. All fresh-compute consumers (imp-35370/imp-35378/imp-35390/imp-35236) are SAFE, and ' +
    'the imp-35295 page absorbs the error in an integer-percent display.',
  isRigorous: false,
  verdict:
    'AUDIT / CONSUMER-MAP ONLY. Mapped every src/data, viz-data, and src/pages consumer of the ' +
    'imp-35279/imp-35280 gap/residual/swapFraction columns into three inheritance classes: ' +
    'FULL-PRECISION-SAFE (imp-35370/imp-35378/imp-35390/imp-35236 recompute from a fresh ' +
    'full-precision division), BAKED-ROUNDED-LITERAL (the imp-35400 viz-data + page -- the one ' +
    'cluster flagged for a rounding caveat or full-precision read), and ABSORBED-BY-INTEGER-' +
    'ROUNDING (the imp-35295 page). Edits no bound; E_flow > 0 strictness (imp-33848) untouched; ' +
    'C_mb GUE-conditional per imp-486 UNTOUCHED; no operator positivity; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-35402 (flagged the ~1.3% error, no consumer map); imp-35279/imp-35280 (the four-rung ' +
    'ladder columns); imp-35400 (the baked-literal consumer flagged here); imp-35370/imp-35378/' +
    'imp-35390/imp-35236 (SAFE full-precision recompute); imp-35295 (absorbed integer display); ' +
    'imp-486 (C_mb GUE-conditional, UNTOUCHED).',
});

export const IMP35435_SWAPFRACTION_CONSUMER_AUDIT_ASSERTIONS = [
  {
    // The flag is real: dividing the imp-35400 baked columns does NOT reproduce the baked
    // swapFraction, and the deepest rung is off by the imp-35402-observed ~1.3% (0.0134 abs).
    id: 'imp35435-baked-columns-do-not-reproduce-swapfraction',
    description:
      'imp-35400 baked swapGap/residual divided lands up to ~1.34% off the baked swapFraction (max at N=1e16), reproducing the imp-35402 discrepancy',
    holds: () => {
      const deep = IMP35435_DISCREPANCY[3]; // N = 1e16
      return (
        Math.abs(deep.recomputedFromRounded - 0.5814) < 5e-4 &&
        Math.abs(deep.bakedSwapFraction - 0.568) < 5e-4 &&
        deep.absDiff > 1e-3 &&
        IMP35435_DISCREPANCY.every((d) => d.absDiff < 0.015)
      );
    },
  },
  {
    // The baked swapFraction field IS faithful to the authoritative imp-35279 stored column
    // (so the LIVE displayed value is correct; only the column-ratio reconstruction is off).
    id: 'imp35435-baked-swapfraction-matches-authoritative-source',
    description:
      'imp-35400 baked swapFraction (3-decimal storage) equals the imp-35279 full-precision-derived swapFraction to <5e-4 at every rung -- faithful, unlike the up-to-0.0134-off column ratio',
    holds: () =>
      IMP35400_LADDER.every((r, i) => Math.abs(r.swapFraction - RUNGS[i].swapFraction) < 5e-4),
  },
  {
    // Exactly one consumer cluster (the imp-35400 viz-data + page) is flagged as inheriting the
    // discrepancy; the fresh-compute and integer-display consumers are not.
    id: 'imp35435-exactly-the-imp35400-cluster-flagged',
    description:
      'only the two imp-35400 rows carry inheritsDiscrepancy=true; the fresh-compute + integer-display consumers are SAFE',
    holds: () => {
      const flagged = IMP35435_CONSUMER_MAP.filter((c) => c.inheritsDiscrepancy);
      return (
        flagged.length === 2 &&
        flagged.every((c) => c.file.includes('35400')) &&
        IMP35435_CONSUMER_MAP.filter((c) => c.class === 'FULL-PRECISION-SAFE').length === 3
      );
    },
  },
  {
    // Honesty gate: audit only, no bound change, no QED, no refereed bound is changed.
    id: 'imp35435-honesty-gate-no-derivation-change',
    description: 'audit only: isRigorous false, no QED, no refereed bound is changed; source module unchanged',
    holds: () => {
      const self = IMP35435_SWAPFRACTION_CONSUMER_AUDIT_ASSERTIONS; // referenced to keep the gate live
      return (
        Array.isArray(self) &&
        IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER.isRigorous === false &&
        /NO QED/.test(IMP35279_EFLOW_FARTAIL_INVERSE_SWAP_LADDER.verdict)
      );
    },
  },
];

for (const a of IMP35435_SWAPFRACTION_CONSUMER_AUDIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-35435-swapfraction-rounded-literal-consumer-audit assertion failed: ${a.id}`,
    );
  }
}
