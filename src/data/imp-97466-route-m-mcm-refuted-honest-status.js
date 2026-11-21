/**
 * @fileoverview imp-97466 -- import-light honest-status note recording the imp-97432 result: the
 * Route M MCM hypothesis (non-negativity of every iterated multiplicative difference of
 * h = g/m, used by imp-97422 to reduce the omega(b) >= 4 "b/4 quarter-ceiling") is REFUTED at
 * omega = 11 -- the first counterexample is the primorial b = p_11# = 200560490130, where
 * T(p_11#) = -9.624e-4 < 0 (MCM holds through omega = 10: T(p_9#) = +2.098e-3, T(p_10#) =
 * +4.783e-4).
 *
 * THE CEILING SURVIVES. The b/4 ceiling only asks for the WEAKER two-sided band
 * -1/4 <= T(b) <= 1/4, not MCM's one-sided non-negativity; at the counterexample
 * |T(p_11#)| = 9.7e-4, deep inside the band, and the primorial family converges to
 * -e^{-gamma}/12 + Rcorr = -0.0458, still comfortably above -1/4. So MCM was strictly
 * stronger than the ceiling needed -- its refutation kills the imp-97422 proof route for
 * omega >= 11 but does not refute the ceiling itself, which stays open (numerically safe)
 * for omega >= 11 pending a direct two-sided proof.
 *
 * WHY THIS NOTE MATTERS. Several omega <= 6 cohort modules (imp-97407/97408/97409/97425/97426
 * and others) cite MCM as the general mechanism behind the quarter-ceiling reduction; this note
 * exists so no future consumer treats MCM as a proved general lever past omega = 10 -- the
 * residual for omega >= 11 is IMP97432_SUBGAP (the direct two-sided band), not MCM non-negativity.
 *
 * WHY A NOTE (not a re-derivation). imp-97432 already carries the full derivation (exact
 * reweighted-mean / exponential-tilt characterization) and its own self-executing assertions
 * establish every flag below. This module only records the honest status for the frontier index.
 *
 * @see imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js (source of every verdict flag below)
 * @see imp-97422-quarter-ceiling-omega-ge-4-multiplicative-complete-monotonicity.js (the MCM route this refutes)
 *
 * Ticket: imp-97466 (content, medium, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

import IMP97432_DEFAULT, { IMP97432_VERDICT, IMP97432_SUBGAP } from './imp-97432-route-m-mcm-hypothesis-refuted-ceiling-safe.js';

export const IMP97466_STATUS = Object.freeze({
  ticket: 'imp-97466',
  sourceTicket: 'imp-97432',
  mcmProved: IMP97432_VERDICT.mcmProved,
  mcmRefuted: IMP97432_VERDICT.mcmRefuted,
  ceilingRefuted: IMP97432_VERDICT.ceilingRefuted,
  characterizationProved: IMP97432_VERDICT.characterizationProved,
  residualSubgapId: IMP97432_SUBGAP.id,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97466_HONEST_BANNER =
  'imp-97432 result recorded: the Route M MCM hypothesis (non-negativity of every iterated ' +
  'multiplicative difference of h = g/m) is REFUTED at omega = 11 -- first counterexample ' +
  'b = p_11# = 200560490130, T(p_11#) = -9.624e-4 < 0 (holds through omega = 10). The b/4 ' +
  'quarter-ceiling is NOT refuted (|T| = 9.7e-4 there, primorial limit -0.0458, inside ' +
  '[-1/4, 1/4]) -- MCM was strictly stronger than the ceiling needed. No consumer should cite ' +
  'MCM as a general lever for omega >= 11; the live residual is the direct two-sided band ' +
  '-1/4 <= T(b) <= 1/4 (IMP97432_SUBGAP). No bound on Lambda moves; no refereed bound is changed' +
  '; RH open; NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97466_ASSERTIONS = [
  {
    id: 'imp97466-status-matches-committed-imp97432-verdict',
    holds: () =>
      IMP97466_STATUS.mcmProved === IMP97432_VERDICT.mcmProved &&
      IMP97466_STATUS.mcmRefuted === IMP97432_VERDICT.mcmRefuted &&
      IMP97466_STATUS.ceilingRefuted === IMP97432_VERDICT.ceilingRefuted &&
      IMP97466_STATUS.characterizationProved === IMP97432_VERDICT.characterizationProved &&
      IMP97466_STATUS.residualSubgapId === IMP97432_SUBGAP.id &&
      IMP97432_DEFAULT.verdict.qed === IMP97432_VERDICT.qed,
    why: 'this honest-status note must reproduce the exact verdict flags and residual subgap id already established by imp-97432, not a re-derivation.',
  },
  {
    id: 'imp97466-honesty-gate-no-qed',
    holds: () =>
      IMP97466_STATUS.mcmProved === false &&
      IMP97466_STATUS.mcmRefuted === true &&
      IMP97466_STATUS.ceilingRefuted === false &&
      IMP97466_STATUS.anyBoundMoved === false &&
      IMP97466_STATUS.operatorPositivityProved === false &&
      IMP97466_STATUS.rhResolved === false &&
      IMP97466_STATUS.qed === false &&
      /REFUTED/.test(IMP97466_HONEST_BANNER) &&
      /NO QED/.test(IMP97466_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97466_HONEST_BANNER) &&
      /RH open/.test(IMP97466_HONEST_BANNER),
    why: 'documentation only: MCM refuted at omega=11, ceiling not refuted, no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97466_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97466-route-m-mcm-refuted-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97466_STATUS, banner: IMP97466_HONEST_BANNER };
