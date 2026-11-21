/**
 * @module imp-97147-debruijn-tpos-mirror-count-honest-status
 * @fileoverview imp-97147 -- standalone HONEST-STATUS note (imp-36003-style banner pattern)
 *   recording the imp-97117 verdict that a t > 0 de Bruijn-flow mirror-count does NOT breach
 *   the NS-RIGID wall (residual (c) of imp-97101 / imp-97080). Read-only note: imports the
 *   imp-97117 module verbatim (no re-derivation, no new numerics) and states the honesty
 *   boundary plainly for a reader who lands on this ticket without reading imp-97117 in full --
 *   the Gaussian-convolution instrument only realises the t < 0 multiplier e^{-tau u^2} (the
 *   WRONG sign for the binding t > 0 direction, whose multiplier e^{+t u^2} is an ill-posed,
 *   unbounded inverse-heat operator); the t > 0 flow spreads the spectrum (Dyson repulsion),
 *   and the neutral Palm mirror-count strictly decreases with spacing, so a t > 0 flow-count
 *   at the fixed y0 window is <= the already-1.73x-short t = 0-proxy count -- it makes the
 *   deficit WORSE, not better; and uniformity over the continuum t in (0, t0] on an
 *   Euler-product-free zero family stays unsupplied by any finite-height pointwise instrument.
 *
 *   Ticket: imp-97147 (content, low). Note only; re-reads nothing new; changes no bound;
 *   no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-97117-debruijn-flow-tpos-mirror-count-assessment.js (source module this note restates)
 * @see imp-97101-palm-mirror-parity-crossing-ladder.js (t = 0-proxy ladder, residual (c))
 * @see imp-97080-palm-mirror-baseline-vs-preq-measurement.js (two-height anchor, p_req)
 * @see imp-34813-winding-monotonicity-rigor.js (Gaussian conv = H_{-tau}; exact-flow meter)
 */

import { IMP97117_ASSESSMENT } from './imp-97117-debruijn-flow-tpos-mirror-count-assessment.js';

const SRC = IMP97117_ASSESSMENT;

export const IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS = Object.freeze({
  id: 'imp-97147',
  proofSection: 'S-frontier',
  title:
    'Honest-status note: a t > 0 de Bruijn-flow mirror-count does NOT breach the NS-RIGID ' +
    'wall -- the well-posed convolution direction is t < 0 (the wrong sign), and the t > 0 ' +
    'flow spreads the spectrum, REDUCING the local mirror count',
  sourceModule: 'imp-97117-debruijn-flow-tpos-mirror-count-assessment.js',

  workingRow: Object.freeze({ ...SRC.workingRow }),
  pReq: SRC.pReq,

  wrongSignInstrument: Object.freeze({
    claim: SRC.finding1.claim,
    multiplierTpos: Object.freeze([...SRC.finding1.multiplierTpos]),
    multiplierTneg: Object.freeze([...SRC.finding1.multiplierTneg]),
  }),
  countReducedByFlow: Object.freeze({
    claim: SRC.finding2.claim,
    countSeam: SRC.finding2.countSeam,
    countSpread: SRC.finding2.countSpread,
    surplusSeam: SRC.finding2.surplusSeam,
  }),

  honestyBoundary:
    'The imp-97117 assessment establishes that the repo Gaussian-convolution ladder (exact ' +
    'de Bruijn flow, imp-34813) covers ONLY t < 0, the multiplier e^{-tau u^2} <= 1 -- the ' +
    'OPPOSITE of the binding t > 0 direction, whose multiplier e^{+t u^2} grows without ' +
    'bound (an ill-posed inverse-heat operator, not a smoothing convolution). Only the exact ' +
    'de Bruijn integral reaches t > 0, and only POINTWISE at finite height and finite ' +
    't-samples. Along that pointwise t > 0 flow, Dyson repulsion spreads the spectrum (min ' +
    'gaps grow), and because the neutral Palm mirror-count is strictly decreasing in local ' +
    'spacing, a t > 0 flow-count at the fixed y0 = 0.165 window is <= the t = 0-proxy count ' +
    '(2.5288) that is ALREADY 1.73x short of p_req = 4.37426 -- the flow makes the deficit ' +
    'worse, not better. Even granting a pointwise exact t > 0 integral, uniformity over the ' +
    'continuum t in (0, t0] and all x, on a zero family carrying no Euler product for t > 0, ' +
    'is unsupplied by any finite-height instrument (lattice OR exact-flow).',

  conclusion:
    'imp-97117 assessed whether switching the neutral Palm mirror-count from the t = 0-proxy ' +
    'lattice to the exact t > 0 de Bruijn flow could supply the missing uniform-in-t, all-x ' +
    'lower bound M >= p_req at the binding y0 window. It does NOT: the well-posed convolution ' +
    'direction is the wrong sign, the pointwise exact-flow count moves the wrong way under ' +
    'Dyson repulsion, and continuum-in-t uniformity on an arithmetic-free family remains ' +
    'unsupplied. The wall relocates but is not removed. This note restates that verdict; it ' +
    'derives nothing new and changes no bound.',

  honestCaveat: Object.freeze({
    isProof: false,
    isRigorous: false,
    isUnconditional: false,
    breachesNsRigidWall: false,
    anyBoundMoved: false,
    reDerivesAnything: false,
    sota: 'No refereed bound is changed',
  }),

  verdict:
    'MEASUREMENT-ONLY restatement of imp-97117: a t > 0 de Bruijn-flow mirror-count does NOT ' +
    'breach the NS-RIGID wall. The only well-posed convolution direction (t < 0) is the ' +
    'opposite of the binding one; the t > 0 flow spreads the spectrum and reduces the local ' +
    'mirror count below the already-short t = 0 proxy; uniformity over t in (0, t0] on an ' +
    'Euler-product-free family stays unsupplied. Restatement only; changes no bound; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export default IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS;

export const IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS_ASSERTIONS = [
  {
    id: 'imp97147-source-verdict-matches',
    why: 'This note restates the imp-97117 verdict exactly -- the source module must itself ' +
      'record breachesNsRigidWall:false and anyBoundMoved:false.',
    holds: () =>
      SRC.breachesNsRigidWall === false &&
      SRC.anyBoundMoved === false &&
      IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS.honestCaveat.breachesNsRigidWall === false,
  },
  {
    id: 'imp97147-pReq-and-counts-match-source',
    why: 'The recorded p_req and mirror-count figures must match the imp-97117 source literals.',
    holds: () => {
      const c = IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS.countReducedByFlow;
      return (
        Math.abs(IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS.pReq - SRC.pReq) < 1e-9 &&
        Math.abs(c.countSeam - SRC.finding2.countSeam) < 1e-9 &&
        Math.abs(c.countSpread - SRC.finding2.countSpread) < 1e-9 &&
        c.countSpread < c.countSeam
      );
    },
  },
  {
    id: 'imp97147-honesty-boundary-names-wrong-sign',
    why: 'The honesty-boundary text must plainly name the wrong-sign convolution direction and ' +
      'the spectrum-spreading flow effect.',
    holds: () =>
      /OPPOSITE of the binding t > 0 direction/.test(
        IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS.honestyBoundary,
      ) &&
      /Dyson repulsion/.test(IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS.honestyBoundary),
  },
  {
    id: 'imp97147-honesty-gate',
    why: 'This is a read-only restatement note: it must not claim the wall is breached or that ' +
      'any bound moved.',
    holds: () =>
      IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS.honestCaveat.anyBoundMoved === false &&
      /Platt-Trudgian|refereed bound is changed/.test(IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS.honestCaveat.sota),
  },
  {
    id: 'imp97147-verdict-no-qed',
    why: 'The verdict must record NO QED, matching the standing no-refereed-bound-change caveat.',
    holds: () => /NO QED/.test(IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS.verdict),
  },
];

for (const assertion of IMP97147_DEBRUIJN_TPOS_MIRROR_COUNT_HONEST_STATUS_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97147-debruijn-tpos-mirror-count-honest-status assertion failed: ${assertion.id}`,
    );
  }
}
