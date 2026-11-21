/**
 * @fileoverview imp-97382 -- import-light honest-status note recording the imp-97353 verdict: the
 * imp-97332 RESULT 4(iii) missing ingredient, a friable-Mertens sup bound sup_t |M_k(t)| = o(p_k)
 * (M_k the P_k-friable partial sum of the Mertens function M(t) = Sum mu(n) e^{-nt}), is
 * MEASURED-FALSE. Exact signed-divisor enumeration on a grid-converged deep t-grid (identical sup
 * at tmin = 1e-13 vs 1e-15) shows sup_t |M_k(t)| grows EXPONENTIALLY in k with a stable per-prime
 * ratio ~1.71 (sup/p_k climbs 0.125 -> 1.33, crossing 1 near k = 13) -- not even O(p_k), let alone
 * o(p_k).
 *
 * WHY A NOTE (not a re-derivation). imp-97353 already carries the full derivation (the exact
 * dilation recursion M_k = (I - D_{p_k}) M_{k-1}, the super-exponential slope identity at t = 0,
 * the total-variation reduction sup_t |M_k| <= TV(M_{k-1}), and the grid-converged sup-growth
 * measurement) and its own self-executing assertions establish every flag below. This module only
 * records the honest status for the frontier index.
 *
 * WHAT THIS RELOCATES (not removes). The sup-majorant route to justifying the imp-97309 RESULT 5
 * interchange is DEAD (width * sup -> infinity along the primorial ladder). This does NOT refute
 * the interchange itself: the boundary-layer defect can still vanish through SIGNED (oscillatory)
 * cancellation inside the integral, which no sup bound can see. The missing ingredient is
 * therefore relocated from a friable-Mertens sup bound (impossible) to a SIGNED boundary-layer
 * cancellation estimate (IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP).
 *
 * WHAT REMAINS OPEN. The signed cancellation estimate itself, and a fully rigorous (not just
 * measured) super-linear lower bound sup_t |M_k(t)| >> p_k. No bound on Lambda moves; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-97353-friable-mertens-sup-refutation.js (source of every verdict flag below)
 * @see imp-97332-route-m-tail-interchange-assessment.js (RESULT 4(iii) missing ingredient assessed by imp-97353)
 * @see imp-97309-route-m-arith-tail-cancellation-assessment.js (IMP97309_CANCELLATION_SUBGAP)
 *
 * Ticket: imp-97382 (content, medium, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

import IMP97353_DEFAULT, { IMP97353_VERDICT, IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP } from './imp-97353-friable-mertens-sup-refutation.js';

export const IMP97382_STATUS = Object.freeze({
  ticket: 'imp-97382',
  sourceTicket: 'imp-97353',
  dilationRecursionExact: IMP97353_VERDICT.dilationRecursionExact,
  slopeIdentityExact: IMP97353_VERDICT.slopeIdentityExact,
  supGrowsExponentially: IMP97353_VERDICT.supGrowsExponentially,
  friableMertensBoundHolds: IMP97353_VERDICT.friableMertensBoundHolds,
  interchangeJustified: IMP97353_VERDICT.interchangeJustified,
  interchangeRefuted: IMP97353_VERDICT.interchangeRefuted,
  obstructionRelocatedToSignedEstimate: IMP97353_VERDICT.obstructionRelocatedToSignedEstimate,
  residualSubgap: IMP97353_VERDICT.residualSubgap,
  anyBoundMoved: false,
  supMajorantRouteViable: false,
  rhResolved: false,
  qed: false,
});

export const IMP97382_HONEST_BANNER =
  'imp-97353 result recorded: the imp-97332 RESULT 4(iii) missing ingredient sup_t |M_k(t)| = o(p_k) ' +
  'is MEASURED-FALSE -- exact grid-converged enumeration shows sup_t |M_k| ~ 1.71^k, exponential in ' +
  'k and crossing p_k near k = 13. The sup-majorant route to the imp-97309 RESULT 5 interchange is ' +
  'therefore DEAD; the interchange can hold only via signed oscillatory cancellation, relocating the ' +
  'obstruction to IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP. No bound on Lambda moves; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97382_ASSERTIONS = [
  {
    id: 'imp97382-status-matches-committed-imp97353-verdict',
    holds: () =>
      IMP97382_STATUS.dilationRecursionExact === IMP97353_VERDICT.dilationRecursionExact &&
      IMP97382_STATUS.slopeIdentityExact === IMP97353_VERDICT.slopeIdentityExact &&
      IMP97382_STATUS.supGrowsExponentially === IMP97353_VERDICT.supGrowsExponentially &&
      IMP97382_STATUS.friableMertensBoundHolds === IMP97353_VERDICT.friableMertensBoundHolds &&
      IMP97382_STATUS.interchangeJustified === IMP97353_VERDICT.interchangeJustified &&
      IMP97382_STATUS.interchangeRefuted === IMP97353_VERDICT.interchangeRefuted &&
      IMP97382_STATUS.obstructionRelocatedToSignedEstimate === IMP97353_VERDICT.obstructionRelocatedToSignedEstimate &&
      IMP97382_STATUS.residualSubgap === IMP97353_SIGNED_BOUNDARY_LAYER_SUBGAP.name &&
      IMP97353_DEFAULT.verdict.qed === IMP97353_VERDICT.qed,
    why: 'this honest-status note must reproduce the exact verdict flags already established by imp-97353, not a re-derivation.',
  },
  {
    id: 'imp97382-honesty-gate-no-qed',
    holds: () =>
      IMP97382_STATUS.supGrowsExponentially === true &&
      IMP97382_STATUS.friableMertensBoundHolds === false &&
      IMP97382_STATUS.interchangeJustified === false &&
      IMP97382_STATUS.interchangeRefuted === false &&
      IMP97382_STATUS.obstructionRelocatedToSignedEstimate === true &&
      IMP97382_STATUS.anyBoundMoved === false &&
      IMP97382_STATUS.supMajorantRouteViable === false &&
      IMP97382_STATUS.rhResolved === false &&
      IMP97382_STATUS.qed === false &&
      /NO QED/.test(IMP97382_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97382_HONEST_BANNER) &&
      /RH open/.test(IMP97382_HONEST_BANNER),
    why: 'documentation only: sup-bound refutation recorded, interchange neither justified nor refuted, obstruction relocated, no bound claimed moved, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97382_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97382-friable-mertens-sup-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97382_STATUS, banner: IMP97382_HONEST_BANNER };
