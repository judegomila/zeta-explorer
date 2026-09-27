/**
 * @fileoverview imp-97571 -- import-light honest-status note recording the imp-97459 result: the
 * imp-97441 RESULT 2 "BIMODAL" eps = 1% crossover-fraction row (x*(1%) steps 0.199 for b <= 2000 to
 * 0.1665 for b >= 4000) is an ARITHMETIC RESONANCE ARTIFACT, not a genuine curvature feature of the
 * Route M boundary-to-bulk crossover.
 *
 * WHAT imp-97459 FOUND. The two adjacent crests of the signed deviation d(a,b) = (I - I_lin)/I that
 * straddle the 1% level sit at the FIXED rational fractions x = 1/6 (continuum tip 1.113%, cotangent
 * resonance m a / 6) and x = 1/5 (continuum tip 1.3934%, resonance m a / 5, exact at every ladder b
 * since every b is divisible by 5). Which crest the integer-a grid resolves above 1% first flips
 * x*(1%) between the two branches: at b <= 2000 the 1/6 tip is sampled below 1% so the 1/5 tip pins
 * x* = 0.199; at b >= 4000 the 1/6 tip is sampled above 1% so it pins x* = 0.1665. The step is a
 * GRID-RESOLUTION effect on two fixed continuum crests, not a change in the underlying curvature law
 * -- A(b) = x*(1%) b stays exactly proportional to b within each branch (piecewise-linear).
 *
 * WHY THIS NOTE MATTERS. imp-97441 itself already flags the row "BIMODAL (oscillation-marginal)" but
 * does not say WHY -- a future consumer could read "bimodal" as evidence of genuine non-linear
 * curvature in the crossover scale at 1%. imp-97459 closes that: the bimodality is fully explained by
 * two b-independent cotangent resonances (1/5, 1/6) and the discrete integer-a grid deciding which one
 * clears the 1% threshold first. This note records that explanation for the frontier index so the 1%
 * row is never miscited as a curvature anomaly.
 *
 * WHY A NOTE (not a re-derivation). imp-97459 already carries the full derivation (crest locations,
 * sampled amplitudes across the b-ladder, step point, and the piecewise-linear scale) and its own
 * self-executing assertions establish every flag below. This module only records the honest status.
 *
 * @see imp-97459-route-m-bimodal-1pct-crossover-peaks.js (source of every verdict flag below)
 * @see imp-97441-route-m-crossover-fraction-tolerance-table.js (the bimodal 1% row this explains)
 *
 * Ticket: imp-97571 (content, low, sonnet-4-6). Documentation only; establishes nothing new; NO QED;
 * Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

import IMP97459_DEFAULT, { IMP97459_VERDICT, IMP97459_SUBGAP } from './imp-97459-route-m-bimodal-1pct-crossover-peaks.js';
import { IMP97441_VERDICT } from './imp-97441-route-m-crossover-fraction-tolerance-table.js';

export const IMP97571_STATUS = Object.freeze({
  ticket: 'imp-97571',
  sourceTicket: 'imp-97459',
  explainsTicket: 'imp-97441',
  lowerCrestFraction: IMP97459_VERDICT.lowerCrestFraction,
  upperCrestFraction: IMP97459_VERDICT.upperCrestFraction,
  bimodalityIsGridResolution: IMP97459_VERDICT.bimodalityIsGridResolution,
  scaleLinearAt1pct: IMP97459_VERDICT.scaleLinearAt1pct,
  onepctRowIsResonanceArtifact: true,
  onepctRowIsCurvatureFeature: false,
  residualSubgapId: IMP97459_SUBGAP.id,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97571_HONEST_BANNER =
  'imp-97459 result recorded: the imp-97441 BIMODAL eps = 1% crossover-fraction row (x*(1%) steps ' +
  '0.199 for b <= 2000 to 0.1665 for b >= 4000) is a GRID-RESOLUTION ARTIFACT of two fixed arithmetic ' +
  'cotangent resonances at x = 1/5 (tip 1.3934%, always > 1%) and x = 1/6 (tip 1.113%, crosses 1% ' +
  'near b ~ 2100), NOT a genuine curvature feature -- A(b) = x*(1%) b stays exactly proportional to b ' +
  'within each branch. No consumer should cite the 1% bimodality as evidence of non-linear crossover ' +
  'curvature; the live residual is the un-pinned continuum threshold b (IMP97459_SUBGAP). No bound on ' +
  'Lambda moves; PT Lambda <= 0.2 remains SOTA; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97571_ASSERTIONS = [
  {
    id: 'imp97571-status-matches-committed-imp97459-verdict',
    holds: () =>
      IMP97571_STATUS.lowerCrestFraction === IMP97459_VERDICT.lowerCrestFraction &&
      IMP97571_STATUS.upperCrestFraction === IMP97459_VERDICT.upperCrestFraction &&
      IMP97571_STATUS.bimodalityIsGridResolution === IMP97459_VERDICT.bimodalityIsGridResolution &&
      IMP97571_STATUS.scaleLinearAt1pct === IMP97459_VERDICT.scaleLinearAt1pct &&
      IMP97571_STATUS.residualSubgapId === IMP97459_SUBGAP.id &&
      IMP97459_DEFAULT.bimodalityIsGridResolution === IMP97459_VERDICT.bimodalityIsGridResolution,
    why: 'this honest-status note must reproduce the exact verdict flags and residual sub-gap id already established by imp-97459, not a re-derivation.',
  },
  {
    id: 'imp97571-explains-the-imp97441-bimodal-row',
    holds: () =>
      IMP97441_VERDICT.oneperctBimodal === true &&
      IMP97571_STATUS.explainsTicket === 'imp-97441' &&
      IMP97571_STATUS.onepctRowIsResonanceArtifact === true &&
      IMP97571_STATUS.onepctRowIsCurvatureFeature === false,
    why: 'the note must attach to the specific row imp-97441 flagged as bimodal, and record it as a resonance artifact rather than a curvature feature.',
  },
  {
    id: 'imp97571-honesty-gate-no-qed',
    holds: () =>
      IMP97571_STATUS.anyBoundMoved === false &&
      IMP97571_STATUS.operatorPositivityProved === false &&
      IMP97571_STATUS.rhResolved === false &&
      IMP97571_STATUS.qed === false &&
      /GRID-RESOLUTION ARTIFACT/.test(IMP97571_HONEST_BANNER) &&
      /NO QED/.test(IMP97571_HONEST_BANNER) &&
      /remains SOTA/.test(IMP97571_HONEST_BANNER) &&
      /RH open/.test(IMP97571_HONEST_BANNER),
    why: 'documentation only: no bound claimed moved, no operator positivity, no QED, PT SOTA line present, RH stated open.',
  },
];

for (const assertion of IMP97571_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97571-route-m-onepct-crossover-resonance-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97571_STATUS, banner: IMP97571_HONEST_BANNER };
