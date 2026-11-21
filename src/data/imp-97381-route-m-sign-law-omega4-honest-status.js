/**
 * @fileoverview imp-97381 -- import-light honest-status note recording the imp-97352 result: the
 * Route M sign law T(b) < 0 (b = p1*p2*...*p_omega squarefree, T(b) = Sum_{e|m,e>=2} mu(e) J(e-1)
 * with m = b/p1) is now PROVED elementarily for omega(b) = 4, extending the imp-97333 elementary
 * range omega <= 3. The new rigorous ingredient is that D_{p1}(e) = J(e-1) - J(p1 e - 1) is
 * STRICTLY DECREASING in e (from the elementary inequality 2 sinh(t/2) >= t, which makes the
 * Binet kernel weight w(t) = 1/(e^t-1) - 1/t + 1/2 increasing and hence |Jp(m)| >= p1 |Jp(p1 m)|).
 * At omega = 4 the three level-2 positive peel terms inject into the three level-1 negative peel
 * terms (complete 3x3 bipartite graph: any 2-prime product exceeds any single prime among
 * p2,p3,p4), each matched pair strictly negative by D-monotonicity, giving U(m) < 0 and hence
 * T(b) < 0 for EVERY squarefree b with omega = 4 -- no divergent Upos bound needed.
 *
 * SHARP METHOD BOUNDARY AT OMEGA = 5. The domination-by-injection method succeeds exactly when
 * the level-2 positive count C(omega-1,2) does not exceed the level-1 negative count omega-1;
 * this holds for omega <= 4 and FIRST FAILS at omega = 5, where C(4,2) = 6 level-2 positives
 * outnumber the 4 level-1 negatives (Hall deficiency 2), and level-3+ negatives have larger
 * products (wrong sign) so cannot fill the gap. omega >= 5 therefore needs WEIGHTED inter-level
 * cancellation, i.e. the residual IMP97333_SIGN_TAIL_SUBGAP (sign specialization of
 * IMP97309_CANCELLATION_SUBGAP); imp-97372 later showed the natural weighted-domination route for
 * that residual is itself analytically dead for large omega (L2/L1 ~ (1/2) loglog b diverges).
 *
 * WHY A NOTE (not a re-derivation). imp-97352 already carries the full derivation and its own
 * self-executing assertions establish every flag below. This module only records the honest
 * status for the frontier index: what is decided, what stays open, and the no-QED gate.
 *
 * WHAT REMAINS OPEN. The sign law T(b) < 0 is proved only for squarefree omega(b) <= 4; for
 * omega >= 5 it remains a measured pattern (verified through omega = 16 in imp-97372) awaiting
 * the quantitative weighted cross-level cancellation of IMP97333_SIGN_TAIL_SUBGAP. No bound on
 * Lambda moves; no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97352-route-m-sign-law-omega4-proof.js (source of every verdict flag below)
 * @see imp-97333-route-m-sign-law-proof-attempt.js (the omega <= 3 elementary range extended here)
 * @see imp-97372-route-m-sign-law-weighted-domination-obstruction.js (omega >= 5 weighted route: analytically dead)
 *
 * Ticket: imp-97381 (content, medium, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

import IMP97352_DEFAULT, { IMP97352_VERDICT, IMP97352_CROSSOVER } from './imp-97352-route-m-sign-law-omega4-proof.js';

export const IMP97381_STATUS = Object.freeze({
  ticket: 'imp-97381',
  sourceTicket: 'imp-97352',
  dMonotonicityRigorous: IMP97352_VERDICT.dMonotonicityRigorous,
  signLawProvedOmega4: IMP97352_VERDICT.signLawProvedOmega4,
  dominationWallOmega5: IMP97352_VERDICT.dominationWallOmega5,
  provesSignForAllOmega: IMP97352_VERDICT.provesSignForAllOmega,
  residualSubgap: IMP97352_VERDICT.residualSubgap,
  crossoverWall: IMP97352_CROSSOVER.wall,
  anyBoundMoved: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

export const IMP97381_HONEST_BANNER =
  'imp-97352 result recorded: the Route M sign law T(b) < 0 is PROVED elementarily for every ' +
  'squarefree b with omega(b) = 4 (extending the imp-97333 omega <= 3 range), via a rigorous ' +
  'D_{p1}-monotonicity injection matching the three level-2 positive peel terms against the three ' +
  'level-1 negative terms. The elementary domination method has a SHARP wall at omega = 5, where ' +
  'the level-2 positive count C(omega-1,2)=6 first exceeds the level-1 negative count omega-1=4 ' +
  '(Hall deficiency 2); omega >= 5 is left to the weighted cross-level cancellation of ' +
  'IMP97333_SIGN_TAIL_SUBGAP. No bound on Lambda moves; no refereed bound is changed; RH open; ' +
  'NO QED.';

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
const IMP97381_ASSERTIONS = [
  {
    id: 'imp97381-status-matches-committed-imp97352-verdict',
    holds: () =>
      IMP97381_STATUS.dMonotonicityRigorous === IMP97352_VERDICT.dMonotonicityRigorous &&
      IMP97381_STATUS.signLawProvedOmega4 === IMP97352_VERDICT.signLawProvedOmega4 &&
      IMP97381_STATUS.dominationWallOmega5 === IMP97352_VERDICT.dominationWallOmega5 &&
      IMP97381_STATUS.provesSignForAllOmega === IMP97352_VERDICT.provesSignForAllOmega &&
      IMP97381_STATUS.residualSubgap === IMP97352_VERDICT.residualSubgap &&
      IMP97381_STATUS.crossoverWall === IMP97352_CROSSOVER.wall &&
      IMP97352_DEFAULT.verdict.qed === IMP97352_VERDICT.qed,
    why: 'this honest-status note must reproduce the exact verdict flags and crossover wall already established by imp-97352, not a re-derivation.',
  },
  {
    id: 'imp97381-honesty-gate-no-qed',
    holds: () =>
      IMP97381_STATUS.signLawProvedOmega4 === true &&
      IMP97381_STATUS.dominationWallOmega5 === true &&
      IMP97381_STATUS.provesSignForAllOmega === false &&
      IMP97381_STATUS.anyBoundMoved === false &&
      IMP97381_STATUS.operatorPositivityProved === false &&
      IMP97381_STATUS.rhResolved === false &&
      IMP97381_STATUS.qed === false &&
      /NO QED/.test(IMP97381_HONEST_BANNER) &&
      /refereed bound is changed/i.test(IMP97381_HONEST_BANNER) &&
      /RH open/.test(IMP97381_HONEST_BANNER),
    why: 'documentation only: decision recorded (proved at omega=4, walled at omega=5), no bound claimed moved, no operator positivity, no QED, no-refereed-bound-change line present, RH stated open.',
  },
];

for (const assertion of IMP97381_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-97381-route-m-sign-law-omega4-honest-status assertion failed: ${assertion.id}`);
  }
}

export default { status: IMP97381_STATUS, banner: IMP97381_HONEST_BANNER };
