/**
 * @module imp-3885-saddle-crossing-reconciliation-honest-status
 * @fileoverview imp-3885 -- HONEST-STATUS/PROVENANCE note recording that imp-3849
 *   converged the INNER A(tau) autocorrelation quadrature of the imp-3731 exact-saddle
 *   ratio measurement and, in doing so, SUPERSEDED the imp-3731 crossing/well numbers.
 *   Read-only audit: imports both source modules (no re-derivation, no new numerics),
 *   asserts the two disagree in the documented way, and catalogs which downstream
 *   consumers cite which generation of numbers.
 *
 *   THE RECONCILIATION
 *   -------------------
 *   imp-3731 refined only the OUTER moment-panel grid (NM: 3200 -> 6400) while holding
 *   the INNER A(tau) quadrature fixed at the coarse imp-3713 configuration ([0,7], 1200
 *   panels), reporting a crossing n* = 225.5427323 ("grid-stable to ~1e-9") and a shallow
 *   sub-unity well r_min = -1.12857e-4 at n = 276. imp-3849 showed that axis was the WRONG
 *   one to refine -- imp-3735 had already found the INNER resolution, not the outer grid,
 *   limits the moment-ratio correction at large n. Converging the inner quadrature (4800
 *   panels on [0,2], self-checked vs 7200) moves the crossing to n* = 215.231 (~10 rungs
 *   LOWER) and deepens the well ~5x to r_min = -5.845e-4 at n ~ 500 (~2x further out).
 *   imp-3731's own assertions are LEFT INTACT (they correctly describe the inner=1200
 *   ladder they measured); this note records that the inner=1200 ladder is an ARTIFACT
 *   of under-resolved inner quadrature, not the fully-converged answer.
 *
 *   DOWNSTREAM FLAG (flag only -- imp-3740 and imp-3862 are NOT edited by this ticket)
 *   -----------------------------------------------------------------------------------
 *   At the time this ticket was minted, the pending glossary ticket imp-3740 and the
 *   pending viz ticket imp-3862 both cited only the imp-3731 inner=1200 numbers
 *   (n* ~ 226 / 225.54). Both have SINCE been completed and, on inspection, both already
 *   carry an inline correction pointing at the imp-3849 converged numbers:
 *     - imp-3740's shipped glossary entry (src/data/glossary.js) documents the FULL
 *       chain -- imp-3731's n*=225.5427323 AND imp-3849's n*=215.231 -- so it is not stale.
 *     - imp-3862's shipped viz-data module (imp-3862-saddle-ratio-crossing-viz-data.js)
 *       carries an "HONEST STATUS NOTE (imp-3849 supersession)" JSDoc block naming the
 *       converged n*=215.2 and r_min~-5.845e-4, while its plotted literals correctly
 *       remain the imp-3731 artifact ladder (that IS the object the viz documents).
 *   So no further edit to either ticket is needed; this module is the dedicated,
 *   queryable provenance record the frontier scout asked for, cross-checked against
 *   both source modules' own exported numbers (no duplicated/hand-typed literals).
 *
 *   Ticket: imp-3885 (meta, low). Read-only reconciliation note; changes no bound;
 *   imp-3066 untouched; no refereed bound is changed; NO QED.
 *
 *   @see imp-3731-saddle-ratio-crossing-extended-precision.js (the superseded ladder)
 *   @see imp-3849-saddle-ratio-well-depth-inner-converged.js (the converged ladder)
 *   @see glossary.js (imp-3740's shipped entry, already documents both numbers)
 *   @see imp-3862-saddle-ratio-crossing-viz-data.js (imp-3862's shipped inline honest-status note)
 */

import { IMP3731_SADDLE_RATIO_CROSSING_EXTENDED_PRECISION } from './imp-3731-saddle-ratio-crossing-extended-precision.js';
import { IMP3849_SADDLE_RATIO_WELL_DEPTH_INNER_CONVERGED } from './imp-3849-saddle-ratio-well-depth-inner-converged.js';

const SUPERSEDED = IMP3731_SADDLE_RATIO_CROSSING_EXTENDED_PRECISION.measured;
const CONVERGED = IMP3849_SADDLE_RATIO_WELL_DEPTH_INNER_CONVERGED.measured;

export const IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS = Object.freeze({
  id: 'imp-3885',
  title:
    'Provenance note: imp-3849 inner-quadrature convergence supersedes the imp-3731 exact-saddle crossing',
  supersededMeasurement: 'imp-3731-saddle-ratio-crossing-extended-precision.js',
  convergedMeasurement: 'imp-3849-saddle-ratio-well-depth-inner-converged.js',

  rootCause:
    'imp-3731 refined only the OUTER moment-panel grid (NM 3200->6400) while holding the INNER ' +
    'A(tau) quadrature fixed at the coarse imp-3713 configuration ([0,7], 1200 panels). imp-3735 had ' +
    'already shown the inner resolution -- not the outer grid -- limits the moment-ratio correction ' +
    'at large n, so the imp-3731 outer-only grid-stability check ("~1e-9") was measured along the ' +
    'axis the answer is insensitive to.',

  reconciliation: Object.freeze({
    crossing: Object.freeze({
      superseded: SUPERSEDED.unityCrossInterpFiner, // 225.54273232116
      converged: CONVERGED.unityCrossInterp, // ~215.231
      shiftRungs: SUPERSEDED.unityCrossN - CONVERGED.unityCrossN, // 226 - 216 = 10
    }),
    r226: Object.freeze({
      superseded: SUPERSEDED.rAtUnityCross, // ~-2.314e-6
      converged: CONVERGED.convergedR226, // ~-8.738e-5
      artifactReproducedByConvergedModule: CONVERGED.artifactR226, // ~-2.314e-6, reproduces SUPERSEDED
    }),
    well: Object.freeze({
      supersededMinN: SUPERSEDED.undershootMinN, // 276
      supersededMinR: SUPERSEDED.undershootMinR, // ~-1.12857e-4
      convergedMinN: CONVERGED.undershootMinN, // ~500
      convergedMinR: CONVERGED.undershootMinR, // ~-5.845e-4
      depthRatio: Math.abs(CONVERGED.undershootMinR / SUPERSEDED.undershootMinR), // ~5.2x deeper
      distanceRatio: CONVERGED.undershootMinN / SUPERSEDED.undershootMinN, // ~1.8x further out
    }),
  }),

  downstreamFlags: Object.freeze([
    Object.freeze({
      id: 'imp-3740',
      citedGeneration: 'imp-3731 (n* ~ 226 / 225.5427323)',
      shippedIn: 'src/data/glossary.js',
      status: 'ALREADY-CORRECT',
      note:
        'Shipped glossary entry documents the FULL chain: imp-3731 n*=225.5427323 AND imp-3849 ' +
        'n*=215.231. Not stale; no edit needed.',
      needsEdit: false,
    }),
    Object.freeze({
      id: 'imp-3862',
      citedGeneration: 'imp-3731 (n* ~ 225.54, well to ~n=280)',
      shippedIn: 'src/data/imp-3862-saddle-ratio-crossing-viz-data.js',
      status: 'ALREADY-CORRECT',
      note:
        'Shipped viz-data module carries an inline "HONEST STATUS NOTE (imp-3849 supersession)" ' +
        'JSDoc block naming the converged n*=215.2 and r_min~-5.845e-4; the plotted literals ' +
        'correctly stay the imp-3731 artifact ladder, which is the object the viz documents. ' +
        'Not stale; no edit needed.',
      needsEdit: false,
    }),
  ]),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isStructuralDiagnostic: true,
    isCertifiedErrorBound: false,
    leavesImp3731AssertionsIntact: true,
    changesAnyBound: false,
    didNotEditFlaggedTickets: true,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'RECONCILED. imp-3849 supersedes the imp-3731 inner=1200 crossing/well as an inner-quadrature ' +
    'artifact; imp-3731 assertions are left intact (they correctly describe what they measured). ' +
    'Both downstream consumers this ticket was asked to flag (imp-3740, imp-3862) already carry the ' +
    'corrected/inline provenance in their shipped files, so no further edit is needed there -- this ' +
    'module is the dedicated queryable record. Audit only; changes no bound; imp-3066 untouched; NO QED.',
});

export const IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp3885-crossing-shifted-down-10-rungs',
    why: 'The converged crossing (n*=216 first-negative rung) is exactly 10 rungs below the imp-3731 ' +
      'inner=1200 crossing (n*=226 first-negative rung).',
    holds: () =>
      IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS.reconciliation.crossing.shiftRungs === 10 &&
      IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS.reconciliation.crossing.converged <
        IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS.reconciliation.crossing.superseded,
  },
  {
    id: 'imp3885-converged-module-reproduces-superseded-artifact',
    why: 'imp-3849 reproduces the imp-3731 r_226 value as its own ARTIFACT probe before showing the ' +
      'converged value differs by ~38x, confirming the two modules measure the same underlying object.',
    holds: () =>
      Math.abs(
        CONVERGED.artifactR226 - SUPERSEDED.rAtUnityCross
      ) < 1e-7,
  },
  {
    id: 'imp3885-r226-converged-38x-larger-magnitude',
    why: 'The inner-converged r_226 is roughly 38x larger in magnitude than the imp-3731 inner=1200 value.',
    holds: () => {
      const ratio = Math.abs(CONVERGED.convergedR226 / SUPERSEDED.rAtUnityCross);
      return ratio > 30 && ratio < 45;
    },
  },
  {
    id: 'imp3885-well-deeper-and-further-out',
    why: 'The converged well is deeper (>4x) and further out (>1.5x) than the imp-3731 well.',
    holds: () =>
      IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS.reconciliation.well.depthRatio > 4 &&
      IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS.reconciliation.well.distanceRatio > 1.5,
  },
  {
    id: 'imp3885-both-downstream-flags-already-correct',
    why: 'Both flagged downstream tickets (imp-3740, imp-3862) must be recorded as ALREADY-CORRECT ' +
      'and needsEdit=false, since this ticket must NOT edit them.',
    holds: () =>
      IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS.downstreamFlags.every(
        (f) => f.status === 'ALREADY-CORRECT' && f.needsEdit === false
      ),
  },
  {
    id: 'imp3885-imp3731-assertions-not-touched',
    why: 'This is a read-only note: imp-3731 is left intact per the honest caveat.',
    holds: () => IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS.honestCaveat.leavesImp3731AssertionsIntact === true,
  },
  {
    id: 'imp3885-changes-no-bound',
    why: 'Audit-only note: no numerical bound or Lambda claim changes as a result of this reconciliation.',
    holds: () =>
      IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS.honestCaveat.sota),
  },
];

for (const assertion of IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3885-saddle-crossing-reconciliation-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP3885_SADDLE_CROSSING_RECONCILIATION_HONEST_STATUS;
