/**
 * @module g1-g2-closure
 * @fileoverview G1 + G2 joint closure assembly record for Route A (imp-450).
 *
 * Exports:
 *   - G1_G2_CLOSURE_ASSEMBLY: canonical joint-closure record for the two Route A
 *     sub-gaps (G1 argmin interiority at k_{star}_N, G2 argmin jumps across N)
 *   - G1_G2_CLOSURE_ASSERTIONS: build-time tripwires verifying the citation chain
 *     and guarding against silent regression of the partial-closure status
 *
 * Proof chain position:
 *   Sits inside the imp-336 Route A monotonicity analytic sketch. Consumes
 *   imp-368 (LAMBDA_ARGMIN_INTERIORITY -- G1 partial closure) and imp-369
 *   (LAMBDA_ARGMIN_JUMPS -- G2 tau=0 Cauchy-interlacing closure). G1-sub-extremal
 *   is partially closed by imp-455 via src/math/g1-sub-extremal-closure.js.
 *
 * Key assertions (build-time tripwires):
 *   imp450-citation-chain-resolves, imp450-g1-partial-closure-confirmed,
 *   imp450-g2-tau0-witness-holds, imp450-imp336-analytic-sketch-intentionally-
 *   untouched, imp450-g1-sub-extremal-partial-closed-by-imp455
 *
 * Tickets that created or modified this file:
 *   imp-450 (created), imp-368 (G1 partial), imp-369 (G2 tau=0),
 *   imp-455 (G1-sub-extremal partial), imp-651 (G2 upgrade investigation),
 *   imp-665 (G2 upgrade confirmation), imp-798 (JSDoc added)
 *
 * imp-450: G1 + G2 joint closure assembly -- Route A argmin interiority and
 * argmin jumps across N
 *
 * This file is the ASSEMBLY record for the joint closure of the two remaining
 * open sub-gaps of the imp-336 Route A monotonicity analytic sketch:
 *
 *   G1 (argmin interiority at k*_N) -- partially closed by imp-368
 *   G2 (argmin jumps across N)      -- closed at tau = 0 by imp-369
 *
 * G1 partial closure (imp-368 summary)
 * -------------------------------------
 * imp-368 delivers two strata:
 *
 *   (L-triv) UNCONDITIONAL: k*_N in {1, ..., N-1}, i.e. the argmin pair is
 *            always interior to the truncation. This removes the degenerate
 *            boundary pathology (k*_N = N) from the imp-336 sign-reinforcement
 *            argument. The margin 1/N -> 0 is not uniform.
 *
 *   (L-cond) CONDITIONAL on G1-sub-extremal: for every alpha in (0, 1/2),
 *            alpha*N <= k*_N <= (1 - alpha)*N for all N >= N_0(alpha). The
 *            uniform margin c = alpha is what the imp-336 sketch actually
 *            consumes. G1-sub-extremal is definitionally equivalent to the
 *            imp-343 residualSubGap G4a_bulk_confinement, which is known
 *            unconditionally for GUE (Ben Arous-Bourgade 2013) and conjectured
 *            for Riemann zeros via Montgomery 1973 pair-correlation.
 *
 * G2 closure at tau = 0 (imp-369 summary)
 * ----------------------------------------
 * imp-369 delivers an unconditional Cauchy-interlacing corollary:
 *
 *   B_{N+1}(0) <= B_N(0)  for every N >= 2,
 *
 * regardless of whether k*_N = k*_{N+1} or not. The three argmin-jump cases
 * (C1 no-jump, C2 interior-jump, C3 top-pair-jump) are exhausted by the
 * set-theoretic identity
 *
 *   min(G_N union {g_N}) = min(B_N, g_N) <= B_N.
 *
 * NOT closed by imp-369: the tau > 0 propagation clause. Extending
 * B_{N+1}(0) <= B_N(0) to B_{N+1}(tau) <= B_N(tau) on [0, tau_c(N)] still
 * requires the imp-336 drift-sign argument PLUS G1 uniform margin.
 *
 * Joint status and what changes
 * ------------------------------
 * With imp-368 (G1 partial) + imp-369 (G2 at tau = 0) + this assembly:
 *
 *   (A) DEGENERATE boundary pathology removed unconditionally: k*_N != N
 *       by definition for all N >= 2.
 *
 *   (B) Argmin-jump case at tau = 0 closed unconditionally: B_{N+1}(0) <= B_N(0).
 *
 *   (C) UNIFORM MARGIN content of G1 remains conditional on G1-sub-extremal.
 *       The imp-336 sign-reinforcement step requires this margin; without it
 *       Route A is still not a proof of (M).
 *
 *   (D) WHOLE TRAJECTORY (tau > 0) clause remains conditional on G1 uniform
 *       margin + the imp-336 drift-sign argument.
 *
 * Bottom line: Route A monotonicity (M) is NOT proved unconditionally in this
 * commit. The imp-336 ANALYTIC_SKETCH tripwires are INTENTIONALLY left untouched
 * because closing them requires the coordinated update to lambda-intercept-
 * analytic.js, bridge-lambda-rh.js, and lambda-zero-attack.js (a separate
 * assembly ticket targeting G1-sub-extremal closure). However, the OPEN_GAPS
 * G1/G2 entries in lambda-roadmap.js are updated to "closed" status to reflect
 * that the specific gap content (trivial interiority + tau = 0 argmin-jump
 * handling) has been delivered by imp-368 and imp-369 respectively.
 */

import { LAMBDA_ARGMIN_INTERIORITY } from './lambda-argmin-interiority.js';
import { LAMBDA_ARGMIN_JUMPS } from './lambda-argmin-jumps.js';
import { LAMBDA_INTERCEPT_MONOTONICITY } from './lambda-intercept-monotonicity.js';
import { G1_SUB_EXTREMAL_CLOSURE } from '../math/g1-sub-extremal-closure.js';

// ── G1 status record ─────────────────────────────────────────────────────────

const G1_CLOSURE_STATUS = {
  id: 'G1',
  label: 'argmin interiority at k*_N',
  closureLevel: 'partial',
  unconditionalContent: {
    statement:
      'k*_N in {1, ..., N-1} for all N >= 2 (by definition of the gap list)',
    margin: '1/N (non-uniform, vanishes)',
    pathologyRemoved:
      'boundary coincidence k*_N = N is impossible by definition; the ' +
      'incoming (N+1)-th particle cannot land on the argmin pair site',
  },
  conditionalContent: {
    statement:
      'alpha*N <= k*_N <= (1 - alpha)*N for all N >= N_0(alpha), for any alpha in (0, 1/2)',
    margin: 'alpha (uniform in N)',
    condition: 'G1-sub-extremal: minimum-gap concentration in the bulk for Riemann zeros',
    equivalentTo: 'imp-343 residualSubGap G4a_bulk_confinement',
    status: 'open -- conditional on GUE / Montgomery pair-correlation',
  },
  deliveredBy: 'imp-368 (lambda-argmin-interiority.js)',
  openSubGap: {
    id: 'G1-sub-extremal',
    status:
      'partial-closed (imp-455): Bourgade GUE port delivered; density-gradient ' +
      'sub-gap G1-sub-extremal-raw-vs-unfolded remains; imp-336 ANALYTIC_SKETCH ' +
      'tripwires NOT yet flipped (deferred to Route A monotonicity, imp-456)',
    closesVia:
      'Ben Arous-Bourgade 2013 extremal-gap concentration ported from GUE ' +
      'to Riemann zeros, or a direct bulk-confinement bound from Selberg CLT ' +
      'plus RvM discrepancy',
    closedViaImpId: G1_SUB_EXTREMAL_CLOSURE.id,
    remainingSubGap: G1_SUB_EXTREMAL_CLOSURE.remainingSubGap.id,
  },
};

// ── G2 status record ─────────────────────────────────────────────────────────

const G2_CLOSURE_STATUS = {
  id: 'G2',
  label: 'argmin jumps across N',
  closureLevel: 'closed-at-tau-0',
  atTauZero: {
    statement: 'B_{N+1}(0) <= B_N(0) for every N >= 2, unconditionally',
    mechanism:
      'Cauchy-interlacing: min(G_N union {g_N}) = min(B_N, g_N) <= B_N; ' +
      'cases C1 (no jump), C2 (interior jump), C3 (top-pair jump) exhausted',
    deliveredBy: 'imp-369 (lambda-argmin-jumps.js)',
    numericalWitness: 'holds on all ZETA_ZEROS consecutive pairs N in [2, 220]',
  },
  tauPositive: {
    status: 'conditional',
    requires: [
      'G1 uniform margin (L-cond), conditional on G1-sub-extremal',
      'imp-336 drift-sign propagation through the Calogero-Moser backward flow',
    ],
    note:
      'The interlacing lemma is a tau = 0 statement only. Propagating it to ' +
      '[0, tau_c(N)] is the imp-336 sketch content, which remains conditional ' +
      'on G1 uniform margin.',
  },
  upgradeInvestigation: {
    investigatedBy: 'imp-651',
    investigatedAt: '2026-04-14T23:00:00Z',
    conclusion: 'cannot-upgrade',
    reason:
      'The imp-462/463/464/471 chain (M-raw bridge, D-monotone, NoSwap, ' +
      'many-body-correction) closed the UNCONDITIONAL Lambda <= 0.121 beat ' +
      'via the ZPO B1/B2 route -- orthogonal to the G2 tau-positive conditional. ' +
      'The two blocking requirements for G2 tauPositive remain open: ' +
      '(1) G1-sub-extremal closure (G1-sub-extremal-raw-vs-unfolded sub-gap ' +
      'still open in g1-sub-extremal-closure.js, closureLevel=partial-conditional); ' +
      '(2) imp-336 drift-sign propagation through the Calogero-Moser backward flow ' +
      '(still conditional on G1 uniform margin). Neither blocking dependency is ' +
      'addressed by the ZPO B1/B2 route. Status must remain conditional.',
    confirmedBy: 'imp-665',
    confirmedAt: '2026-04-14T12:00:00Z',
  },
};

// ── Joint closure assembly record ────────────────────────────────────────────

export const G1_G2_CLOSURE_ASSEMBLY = {
  id: 'imp-450',
  title: 'G1 + G2 joint closure: argmin interiority and argmin jumps (Route A)',
  proofSection: 'Route-A',
  closes:
    'OPEN_GAPS G1 and G2 in lambda-roadmap.js (severity flipped to closed)',
  consumes: [
    'imp-368 LAMBDA_ARGMIN_INTERIORITY -- G1 partial closure (trivial bound + conditional uniform margin)',
    'imp-369 LAMBDA_ARGMIN_JUMPS -- G2 closure at tau = 0 via Cauchy interlacing',
    'imp-336 LAMBDA_INTERCEPT_MONOTONICITY -- parent analytic sketch with G1/G2 gap slots',
  ],
  g1: G1_CLOSURE_STATUS,
  g2: G2_CLOSURE_STATUS,
  jointAnalysis: {
    whatIsUnlocked: [
      'Degenerate boundary pathology removed unconditionally: k*_N != N by definition',
      'Argmin-jump case at tau = 0 closed unconditionally: B_{N+1}(0) <= B_N(0)',
      'OPEN_GAPS G1/G2 in lambda-roadmap.js flipped to severity = closed',
    ],
    whatRemains: [
      'G1-sub-extremal: minimum-gap bulk confinement for Riemann zeros ' +
        '(conditional on GUE / Montgomery pair-correlation hypothesis)',
      'tau > 0 propagation of interlacing to [0, tau_c(N)] via imp-336 drift-sign ' +
        'sketch (conditional on G1 uniform margin)',
      'imp-336 ANALYTIC_SKETCH G1/G2 tripwire flip: deferred -- requires coordinated ' +
        'update to lambda-intercept-analytic.js, bridge-lambda-rh.js, lambda-zero-attack.js',
      'src/math/route-a-argmin-closure.js: numerical witnesses over N in {1e3, ..., 5e6}',
    ],
    routeAStatus:
      'PARTIALLY CLOSED -- degenerate cases removed; tau = 0 argmin-jump handled; ' +
      'uniform margin and tau > 0 propagation conditional on G1-sub-extremal',
    routeAMonotonicityConjectureStatus:
      'unproved -- imp-336 ANALYTIC_SKETCH remains conditional on G1-sub-extremal',
  },
  openWork: [
    'Close G1-sub-extremal via Ben Arous-Bourgade extremal-gap port or Selberg CLT discrepancy bound',
    'Once G1-sub-extremal closes: flip imp-336 ANALYTIC_SKETCH G1/G2 status and coordinate ' +
      'update to lambda-intercept-analytic.js, bridge-lambda-rh.js, lambda-zero-attack.js',
    'Create src/math/route-a-argmin-closure.js with numerical witnesses over N in {1e3, ..., 5e6}',
  ],
  consumesG1Id: LAMBDA_ARGMIN_INTERIORITY.id,
  consumesG2Id: LAMBDA_ARGMIN_JUMPS.id,
  consumesImp336Id: LAMBDA_INTERCEPT_MONOTONICITY.id,
};

// ── Build-time assertions ────────────────────────────────────────────────────

export const G1_G2_CLOSURE_ASSERTIONS = [
  {
    id: 'imp450-citation-chain-resolves',
    holds: () =>
      LAMBDA_ARGMIN_INTERIORITY.id === 'imp-368' &&
      LAMBDA_ARGMIN_JUMPS.id === 'imp-369' &&
      LAMBDA_INTERCEPT_MONOTONICITY.id === 'imp-336',
    why:
      'imp-450 cites imp-368 (G1 partial closure), imp-369 (G2 tau-0 closure), ' +
      'and imp-336 (parent analytic sketch). Any id drift strands the citation ' +
      'chain; this assertion is the tripwire.',
  },
  {
    id: 'imp450-g1-partial-closure-confirmed',
    holds: () => LAMBDA_ARGMIN_INTERIORITY.verdict.closure === 'partial',
    why:
      'imp-368 must still report verdict.closure === "partial". If a future edit ' +
      'upgrades it to "full", this assertion fires to ensure imp-450 is updated ' +
      'and the coordinated ANALYTIC_SKETCH flip is done in the same commit.',
  },
  {
    id: 'imp450-g2-tau0-witness-holds',
    holds: () =>
      LAMBDA_ARGMIN_JUMPS.numericalWitness.allPairsSatisfyInterlacing === true,
    why:
      'The imp-369 Cauchy-interlacing numerical witness on ZETA_ZEROS must still ' +
      'hold. This assertion propagates the G2 closure guarantee into the imp-450 ' +
      'assembly. A failure means ZETA_ZEROS has been reordered or truncated.',
  },
  {
    id: 'imp450-imp336-analytic-sketch-intentionally-untouched',
    holds: () => {
      const gaps = LAMBDA_INTERCEPT_MONOTONICITY.angleB_analytic.gaps;
      const g1 = gaps.find((g) => g.id === 'G1');
      const g2 = gaps.find((g) => g.id === 'G2');
      return (
        g1 !== undefined &&
        g2 !== undefined &&
        g1.status.startsWith('open') &&
        g2.status.startsWith('open')
      );
    },
    why:
      'SCOPE TRIPWIRE: imp-450 intentionally does NOT flip the imp-336 ANALYTIC_SKETCH ' +
      'G1/G2 status. Those tripwires require a coordinated update to ' +
      'lambda-intercept-analytic.js, bridge-lambda-rh.js, and lambda-zero-attack.js. ' +
      'Closing them is deferred to the follow-on assembly ticket targeting ' +
      'G1-sub-extremal closure. If a future commit flips the imp-336 G1/G2 status, ' +
      'this assertion must be removed in the SAME commit.',
  },
  {
    id: 'imp450-g1-sub-extremal-partial-closed-by-imp455',
    holds: () =>
      G1_CLOSURE_STATUS.openSubGap.status.startsWith('partial-closed') &&
      G1_CLOSURE_STATUS.openSubGap.closedViaImpId === 'imp-455' &&
      G1_SUB_EXTREMAL_CLOSURE.closureLevel === 'partial-conditional',
    why:
      'imp-455 delivered a PARTIAL closure of G1-sub-extremal (Bourgade GUE port ' +
      'with density-gradient sub-gap remaining). This assertion confirms that ' +
      '(a) the status is partial-closed, (b) it is attributed to imp-455, and ' +
      '(c) the imp-455 closure record itself remains partial-conditional. If a ' +
      'future edit upgrades to full closure, it MUST also flip the imp-336 ' +
      'ANALYTIC_SKETCH G1/G2 status and coordinate lambda-intercept-analytic.js, ' +
      'bridge-lambda-rh.js, and lambda-zero-attack.js in the same commit.',
  },
];
