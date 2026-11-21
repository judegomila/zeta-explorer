/**
 * @module imp-36028-etrunc-sole-survivor-honest-status
 * @fileoverview imp-36028 -- standalone HONEST-STATUS note (imp-35789/imp-35983-style banner
 *   pattern) recording the imp-35971 finding that the fixed truncation floor E_trunc = 3.06e-5
 *   becomes the SOLE non-negligible term of E(N) = E_trunc + E_flow + E_coll at the deep-parity
 *   height N* ~ 4.7214e13 (log10 N* ~ 13.674) -- ~2.17 decades ABOVE the roadmap sigma < 0.1
 *   landmark N ~ 3.21e11 -- with the sqrt(1/N) collision term E_coll the LAST survivor before
 *   E_trunc stands alone (E_flow already negligible ~5 decades earlier, at N ~ 4.62e8).
 *
 *   Read-only note: imports the imp-35971 module verbatim (no re-derivation, no new numerics)
 *   and restates the finding plainly for a reader who lands on this ticket without having read
 *   imp-35971 in full.
 *
 *   Ticket: imp-36028 (content, low). Note only; re-reads nothing new; derives no remainder;
 *   discharges nothing; changes no bound; C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643) and
 *   E_trunc = 3.06e-5 (imp-2631) and C_mb GUE-conditional (imp-486) are UNTOUCHED; imp-35337a
 *   stays OPEN; no refereed bound is changed; NO QED.
 *
 * @see imp-35971-etrunc-sole-survivor-height.js (source module this note restates)
 * @see imp-35950-etrunc-ecoll-crossover-height.js (E_trunc = E_coll sigma = 0.5 crossover, N ~ 3.267e9)
 * @see imp-35983-flattest-vs-inflection-knees-distinct-honest-status.js (the banner pattern this note follows)
 */

import { IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT } from './imp-35971-etrunc-sole-survivor-height.js';

const SRC = IMP35971_ETRUNC_SOLE_SURVIVOR_HEIGHT;

export const IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS = Object.freeze({
  id: 'imp-36028',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: the imp-35971 E_trunc sole-survivor height N* ~ 4.7214e13 -- ~2.17 ' +
    'decades above the sigma < 0.1 roadmap landmark, with the collision term the last survivor',
  sourceModule: 'imp-35971-etrunc-sole-survivor-height.js',

  soleSurvivor: Object.freeze({
    N: SRC.soleSurvivor.N,
    log10N: SRC.soleSurvivor.log10N,
    sigma: SRC.soleSurvivor.sigma,
    ratioCollOverTrunc: SRC.soleSurvivor.ratioCollOverTrunc,
    ratioFlowOverTrunc: SRC.soleSurvivor.ratioFlowOverTrunc,
    bindingTerm: SRC.soleSurvivor.bindingTerm,
  }),
  survivorLadder: Object.freeze({
    N_flow_1pct: SRC.survivorLadder.N_flow_1pct,
    N_coll_1pct: SRC.survivorLadder.N_coll_1pct,
    decadesFlowBeforeColl: SRC.survivorLadder.decadesFlowBeforeColl,
  }),
  sigma0p1Landmark: Object.freeze({
    N: SRC.sigma0p1Landmark.N,
    decadesBelowSoleSurvivor: SRC.sigma0p1Landmark.decadesBelowSoleSurvivor,
  }),
  collisionIsLastSurvivor: SRC.collisionIsLastSurvivor,

  conclusion:
    'The imp-35971 measurement shows the fixed truncation floor E_trunc = 3.06e-5 becomes the ' +
    'SOLE non-negligible term of E(N) = E_trunc + E_flow + E_coll at N* ~ 4.7214e13 ' +
    '(log10 N* ~ 13.674) -- the first deep-parity height at which BOTH E_flow and E_coll have ' +
    'dropped below 1% of E_trunc. The threshold is set ENTIRELY by the sqrt(1/N) collision ' +
    'term: E_flow already falls below 1% of E_trunc far earlier, at N ~ 4.62e8 (~5 decades ' +
    'below N*), while E_coll only reaches the 1% bar at N* itself, making it the LAST survivor ' +
    'before E_trunc stands alone. Cross-checked against the roadmap sigma < 0.1 landmark ' +
    'N ~ 3.21e11 (where sigma ~ 0.10 as expected but E_coll / E_trunc ~ 0.111, still ~11x above ' +
    'the 1% bar): the sole-survivor height sits ~2.17 decades ABOVE that landmark.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    derivesRemainder: false,
    dischargesAnything: false,
    changesAnyBound: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-35971: E_trunc = 3.06e-5 becomes the sole ' +
    'non-negligible term of E(N) at N* ~ 4.7214e13 (log10 N* ~ 13.674), ~2.17 decades above the ' +
    'sigma < 0.1 roadmap landmark N ~ 3.21e11, with the collision term E_coll the LAST survivor ' +
    '(E_flow already negligible ~5 decades earlier, at N ~ 4.62e8). Reuses the pinned imp-3406 / ' +
    'imp-33582 constants unchanged; derives no remainder; discharges nothing; changes no bound; ' +
    'C_C = (1/8) sqrt(3 pi) (imp-2642/imp-2643), E_trunc = 3.06e-5 (imp-2631), and C_mb ' +
    'GUE-conditional (imp-486) are UNTOUCHED; imp-35337a stays OPEN; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
});

export const IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp36028-sole-survivor-height-matches-source',
    why: 'The recorded sole-survivor height must match the imp-35971 source literal (N* ~ 4.7214e13, log10 ~ 13.674).',
    holds: () =>
      Math.abs(IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.soleSurvivor.N / 4.7214e13 - 1) < 1e-3 &&
      Math.abs(IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.soleSurvivor.log10N - 13.674) < 5e-3 &&
      Math.abs(SRC.soleSurvivor.N / 4.7214e13 - 1) < 1e-3,
  },
  {
    id: 'imp36028-collision-is-last-survivor',
    why: 'The note must state E_coll is the last surviving term, matching the imp-35971 source flag.',
    holds: () =>
      IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.collisionIsLastSurvivor === true &&
      IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.soleSurvivor.bindingTerm === 'E_coll' &&
      SRC.collisionIsLastSurvivor === true,
  },
  {
    id: 'imp36028-decades-before-collision-matches-source',
    why: 'The E_flow-before-E_coll decade gap must match the imp-35971 source literal (~5 decades).',
    holds: () =>
      IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.survivorLadder.decadesFlowBeforeColl > 4.5 &&
      Math.abs(
        IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.survivorLadder.decadesFlowBeforeColl -
          SRC.survivorLadder.decadesFlowBeforeColl,
      ) < 1e-9,
  },
  {
    id: 'imp36028-sigma0p1-offset-matches-source',
    why: 'The recorded offset above the sigma < 0.1 landmark must match the imp-35971 source literal (~2.17 decades).',
    holds: () =>
      Math.abs(IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.sigma0p1Landmark.decadesBelowSoleSurvivor - 2.17) < 0.05 &&
      Math.abs(
        IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.sigma0p1Landmark.decadesBelowSoleSurvivor -
          SRC.sigma0p1Landmark.decadesBelowSoleSurvivor,
      ) < 1e-9,
  },
  {
    id: 'imp36028-conclusion-mentions-sole-survivor-and-collision',
    why: 'The conclusion text must plainly state E_trunc is the sole survivor and identify the collision term as last.',
    holds: () =>
      /SOLE non-negligible term/.test(IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.conclusion) &&
      /LAST survivor/.test(IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.conclusion),
  },
  {
    id: 'imp36028-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim a proof, rigor, unconditionality, or a bound change.',
    holds: () =>
      IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.honestCaveat.isProof === false &&
      IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.honestCaveat.isRigorous === false &&
      IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.honestCaveat.isUnconditional === false &&
      IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.honestCaveat.changesAnyBound === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp36028-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36028-etrunc-sole-survivor-honest-status assertion failed: ${assertion.id}`);
  }
}

export default IMP36028_ETRUNC_SOLE_SURVIVOR_HONEST_STATUS;
