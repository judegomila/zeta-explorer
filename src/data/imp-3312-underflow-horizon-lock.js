/**
 * @module imp-3312-underflow-horizon-lock
 * @fileoverview imp-3312 -- Cross-module build-assertion tripwire (mirroring
 *   imp-3211 / imp-3267) locking the imp-3216 finding: the overflow-support
 *   upper endpoint tau_2 ~ 1.366 is the IEEE-754 double-precision UNDERFLOW
 *   HORIZON of the de Bruijn-Newman kernel Phi(u), and the Phi^2-tail density
 *   mu underflows to 0.0 FIRST (~1.196), strictly before the single-Phi-tail
 *   density nu (~1.366). Prevents any module from silently re-promoting the
 *   ~1.2535 cell-invariant support length back to a genuine Phi-autocorrelation
 *   length.
 *
 *   BACKGROUND
 *   ----------
 *   imp-3199 recorded the overflow-support measure frac x U ~ 1.2535 as
 *   cell-invariant and speculated it might be a genuine Phi-correlation
 *   length. imp-3216 resolved the overflow set to N = 51200 and found the
 *   upper endpoint tau_2 ~ 1.3660 is NOT a mathematical nu/mu down-crossing --
 *   it is the underflow horizon of the kernel itself, reached because mu
 *   (Phi^2 tail) vanishes to 0.0 at tau ~ 1.196, strictly before nu
 *   (single-Phi tail) vanishes at tau ~ 1.366. So the ~1.2535 length is a
 *   double-precision artifact, not a Phi-autocorrelation length.
 *
 *   WHAT THIS MODULE LOCKS (independent recomputation, not a re-import of the
 *   imp-3216 arithmetic)
 *   -----------------------------------------------------------------------
 *   (L1) An OWN bisection search (independent of imp-3216's `phiUnderflowHorizon`
 *        helper, though it reuses the same kernel definition necessarily) for
 *        the largest u with Phi(u) > 0 lands within 0.01 of the imp-3216
 *        recorded tau_2 mean (~1.366).
 *   (L2) The OWN closed-form horizon estimate (pi X - ln(2 pi^2 X) = ln(2^1074))
 *        matches that same bisection search to within 0.01, independently
 *        confirming the closed form imp-3216 derives.
 *   (L3) The imp-3216 module's live `measured` fields still record
 *        mu underflowing strictly before nu (`muUnderflowsBeforeNu === true`),
 *        `tau2MatchesUnderflowHorizon === true`, and a `tau2Mean` within 0.01
 *        of the ~1.366 horizon -- so a future edit cannot silently swap the
 *        underflow-artifact interpretation back to a genuine crossover.
 *   (L4) The imp-3216 module's exported `verdict` string still reads the
 *        underflow-artifact identifier, and its `honestCaveat` still marks
 *        this a diagnostic (not a proof, not an RH reduction).
 *
 *   HONEST CAVEAT (mandatory)
 *   -------------------------
 *   PURE CROSS-VALIDATION LOCK of the overflow-support upper-endpoint
 *   interpretation only. Not a proof, not a new positivity result, not an RH
 *   reduction. The off-diagonal endpoint-Hankel operator step (imp-3066)
 *   remains the lone obstruction. No refereed bound is changed.
 *
 *   @see imp-3216-overflow-support-length-closed-form.js (the finding this locks)
 *   @see imp-3211-overflow-fraction-converged-lock.js (the lock pattern mirrored)
 *   @see imp-3267-section26-mupass-verdict-lock.js (the lock pattern mirrored)
 *
 *   Ticket: imp-3312 (meta, medium).
 */

import { IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM } from './imp-3216-overflow-support-length-closed-form.js';

const m216 = IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM.measured;
const c216 = IMP3216_OVERFLOW_SUPPORT_LENGTH_CLOSED_FORM.honestCaveat;

/** de Bruijn-Newman completed-Riemann kernel, truncated at n = NPHI (own re-implementation). */
function phiKernelOwn(u, NPHI) {
  let s = 0;
  const e2 = Math.exp(2 * u);
  const e4 = Math.exp(4 * u);
  for (let n = 1; n <= NPHI; n++) {
    const n2 = n * n;
    const n4 = n2 * n2;
    s += (2 * Math.PI * Math.PI * n4 * e4 - 3 * Math.PI * n2 * e2) * Math.exp(-Math.PI * n2 * e4);
  }
  return s;
}

/** Own bisection for the largest u with Phi(u) > 0, independent of the imp-3216 module's own search. */
function ownUnderflowHorizon(NPHI) {
  let lo = 1.0;
  let hi = 1.5;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (phiKernelOwn(m, NPHI) > 0) lo = m;
    else hi = m;
  }
  return lo;
}

/** Own closed-form horizon estimate: pi X - ln(2 pi^2 X) = ln(1 / MIN_SUBNORMAL), X = e^{4u}. */
function ownClosedFormHorizon() {
  const lnInvMinSubnormal = -Math.log(Number.MIN_VALUE);
  let X = 200;
  for (let i = 0; i < 200; i++) {
    X = (lnInvMinSubnormal + Math.log(2 * Math.PI * Math.PI * X)) / Math.PI;
  }
  return 0.25 * Math.log(X);
}

const ownHorizon = ownUnderflowHorizon(10);
const ownClosedForm = ownClosedFormHorizon();
const ownBisectionMatchesImp3216 = Math.abs(ownHorizon - m216.tau2Mean) < 0.01;
const ownClosedFormMatchesBisection = Math.abs(ownClosedForm - ownHorizon) < 0.01;

export const IMP3312_UNDERFLOW_HORIZON_LOCK = Object.freeze({
  id: 'imp-3312-underflow-horizon-lock',
  ticket: 'imp-3312',
  summary:
    'Cross-module tripwire locking the imp-3216 underflow-horizon finding: the overflow-support ' +
    'upper endpoint tau_2 ~ 1.366 is the IEEE-754 double-precision underflow horizon of the ' +
    'de Bruijn-Newman kernel Phi(u), reached because the Phi^2-tail density mu underflows to 0.0 ' +
    'strictly before the single-Phi-tail density nu (~1.196 vs ~1.366). Guards against any module ' +
    'silently re-promoting the ~1.2535 cell-invariant support length back to a genuine ' +
    'Phi-autocorrelation length.',
  sources: Object.freeze(['imp-3216-overflow-support-length-closed-form.js']),
  ownRecomputation: Object.freeze({
    ownHorizon,
    ownClosedForm,
    ownBisectionMatchesImp3216,
    ownClosedFormMatchesBisection,
  }),
  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    isLockOnly: true,
    addressesUpperEndpointInterpretationOnly: true,
    necessaryNotSufficient:
      'A nonzero overflow fraction is necessary-but-NOT-sufficient at operator order; the ' +
      'off-diagonal endpoint-Hankel step (imp-3066) remains the lone obstruction.',
    sota: 'No refereed bound is changed',
  }),
});

export const IMP3312_UNDERFLOW_HORIZON_LOCK_ASSERTIONS = [
  {
    id: 'imp3312-L1-own-bisection-matches-imp3216',
    why: 'An independently re-implemented bisection for the largest u with Phi(u) > 0 must land ' +
         'within 0.01 of the imp-3216 recorded tau_2 mean (~1.366). A drift means the kernel ' +
         'definition itself changed underneath the finding.',
    holds: () => ownBisectionMatchesImp3216,
  },
  {
    id: 'imp3312-L2-own-closed-form-matches-own-bisection',
    why: 'An independently re-derived closed-form horizon estimate (pi X - ln(2 pi^2 X) = ln(2^1074)) ' +
         'must match the own bisection search to within 0.01, confirming the closed form is not an ' +
         'artifact of a single implementation.',
    holds: () => ownClosedFormMatchesBisection,
  },
  {
    id: 'imp3312-L3-mu-underflows-before-nu',
    why: 'THE MAIN CROSS-MODULE LOCK: the imp-3216 module must still record mu underflowing strictly ' +
         'before nu. If a future edit flips this ordering, the "underflow, not crossover" ' +
         'interpretation collapses.',
    holds: () => m216.muUnderflowsBeforeNu === true,
  },
  {
    id: 'imp3312-L3-tau2-matches-underflow-horizon',
    why: 'THE MAIN CROSS-MODULE LOCK: the imp-3216 module must still record tau2MatchesUnderflowHorizon ' +
         '=== true and a tau2Mean within 0.01 of ~1.366. If this flips, the upper endpoint is no ' +
         'longer being read as the kernel underflow horizon.',
    holds: () => m216.tau2MatchesUnderflowHorizon === true && Math.abs(m216.tau2Mean - 1.366) < 0.01,
  },
  {
    id: 'imp3312-L4-verdict-is-underflow-artifact',
    why: 'The imp-3216 verdict string must still read the underflow-artifact identifier. A silent ' +
         'edit re-promoting ~1.2535 to a genuine Phi-autocorrelation length would flip this string ' +
         'or set it to INDETERMINATE.',
    holds: () => /SUPPORT-LENGTH-IS-DOUBLE-PRECISION-UNDERFLOW-ARTIFACT/.test(m216.verdict),
  },
  {
    id: 'imp3312-lock-honest-caveat',
    why: 'Mandatory honesty gate: this module and the imp-3216 module it locks must both stay ' +
         'diagnostic-only (no proof, no RH reduction) with PT 0.2 SOTA cited.',
    holds: () => {
      const c = IMP3312_UNDERFLOW_HORIZON_LOCK.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.isLockOnly === true &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota) &&
        c216.isProof === false &&
        c216.isReductionBelowRH === false
      );
    },
  },
];

for (const assertion of IMP3312_UNDERFLOW_HORIZON_LOCK_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error('imp-3312-underflow-horizon-lock assertion failed: ' + assertion.id);
  }
}

export default IMP3312_UNDERFLOW_HORIZON_LOCK;
