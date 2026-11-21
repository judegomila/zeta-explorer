/**
 * @module imp-97144-kappa-arith-modulus-dependent-rate-glossary-headword
 * @fileoverview imp-97144 -- import-light Concepts glossary headword recording the imp-97122
 *   MEASURED finding: the Route M arithmetic first-moment ratio F_arith(b)/(phi(b) b) converges
 *   to the exact leading constant kappa_arith = (3/2)C - 3/8 at a rate that is MODULUS-DEPENDENT
 *   -- general b decays like O(log b / b), while smooth/primorial b collapses orders faster
 *   because the L0 Euler-Maclaurin remainder is a Moebius sum over divisors of b that cancels for
 *   smooth moduli. A reader skimming only the general-b rate could assume a single uniform
 *   O(log b / b) envelope; this headword bakes on record why that assumption is wrong and why the
 *   rate structurally depends on 2^omega(b).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   On a general-b ladder (b = 101..9973) the residual r(b) = F_arith(b)/(phi(b) b) - kappa_arith
 *   fits r(b)*b = 0.2481 log b + 0.1003, an O(log b / b) decay (NOT O(1/b)). On a primorial-b
 *   ladder (b = 6,30,210,2310,30030) |r(b)| collapses ORDERS below the general-b values at
 *   comparable size (e.g. 3.29e-5 at b=210 vs 3.2648e-3 at neighbouring general b=503) because the
 *   dominant remainder R0(b) = L0(b)/phi(b) - (log b - 1) is a Moebius sum over d|b of Stirling
 *   remainders that cancels when b is smooth. The rate is therefore modulus-dependent via the
 *   2^omega(b) divisor structure, not a single uniform envelope in b alone.
 *
 *   STATUS: documentation glossary headword only, not a re-derivation or a new computation.
 *   Establishes nothing new; moves no bound. The imp-97096 explicit uniform remainder bound
 *   sub-gap stays open precisely because the rate is modulus-dependent. NO QED. No refereed bound is changed
 *   ; RH open.
 *
 * @see imp-97122-route-m-arith-first-moment-convergence-rate.js (source: the measured general-b
 *   and primorial-b rates, and the R0/R1 remainder decomposition this headword glosses)
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (the exact kappa_arith + the explicit
 *   remainder-bound sub-gap this modulus-dependence keeps open)
 *
 * Ticket: imp-97144 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

import { IMP97122_MEASURED, IMP97122_VERDICT } from './imp-97122-route-m-arith-first-moment-convergence-rate.js';

// The modulus-dependent-rate glossary headword, baked verbatim (no re-import of the derivation text).
const KAPPA_ARITH_MODULUS_DEPENDENT_RATE_HEADWORD = Object.freeze({
  key: 'kappa-arith-convergence-rate-is-modulus-dependent',
  term:
    'the Route M kappa_arith convergence rate is 2^omega(b)-modulus-dependent -- smooth/primorial b ' +
    'converge orders faster than general b (Moebius divisor-sum cancellation)',
  definition:
    'F_arith(b)/(phi(b) b) approaches kappa_arith = (3/2)C - 3/8 = 0.5704960511... at rate ' +
    'O(log b / b) on general moduli (fit r(b)*b = 0.2481 log b + 0.1003), but on primorial moduli ' +
    '|r(b)| collapses orders below the general-b values at comparable size (e.g. 3.29e-5 at b=210 ' +
    'vs 3.2648e-3 at neighbouring general b=503; 3.60e-7 at b=30030). The rate is therefore not a ' +
    'single function of b alone -- it depends on the divisor structure of b (2^omega(b) terms in ' +
    'the Moebius sum), and is fastest exactly when b is smooth.',
  mechanism:
    'The dominant remainder is R0(b) = L0(b)/phi(b) - (log b - 1), a Moebius sum over d|b of ' +
    'Stirling remainders (L0(b) = Sum_{a in R_b} log a). For general b this sum has O(log b) net ' +
    'size relative to phi(b); for smooth b the 2^omega(b) divisor terms in the Moebius sum cancel ' +
    'against each other, driving R0(b) down by orders of magnitude (from ~4.5e-4 at general b~9973 ' +
    'to ~2.5e-6 at primorial b=30030). Since r(b) inherits this scale, the convergence rate to ' +
    'kappa_arith is controlled by the arithmetic of b, not just its size -- which is exactly why ' +
    'the imp-97096 explicit uniform remainder bound cannot be a plain O(log b / b) statement in b ' +
    'alone and stays an open sub-gap.',
  verificationStatus:
    'Measured (not proved) from the committed imp-97122 general-b ladder (7 rungs, b=101..9973) ' +
    'and primorial-b ladder (5 rungs, b=6..30030). Establishes no bound and moves nothing on its ' +
    'own -- the imp-97096 explicit uniform remainder sub-gap remains open. NO QED; no refereed bound is changed' +
    '; RH open.',
});

export const IMP97144_KAPPA_ARITH_MODULUS_DEPENDENT_RATE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97144',
  proofSection: 'Route M',
  glosses: 'imp-97122',
  question:
    'imp-97122 measured the convergence rate of F_arith(b)/(phi(b) b) to kappa_arith on both a ' +
    'general-b ladder and a primorial-b ladder. Is the rate a single function of b, or does it ' +
    'depend on the divisor structure of b -- and why does that matter for the imp-97096 sub-gap?',
  headword: KAPPA_ARITH_MODULUS_DEPENDENT_RATE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97122 finding: the ' +
    'kappa_arith convergence rate is O(log b / b) on general moduli but collapses orders faster on ' +
    'smooth/primorial moduli, because the dominant L0 Euler-Maclaurin remainder is a Moebius sum ' +
    'over divisors of b that cancels when b is smooth. The rate is therefore genuinely ' +
    '2^omega(b)-modulus-dependent, not a uniform envelope in b alone -- which is exactly why the ' +
    'imp-97096 explicit remainder bound stays an open sub-gap. Establishes nothing new; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-97122 (the measured general-b and primorial-b rates, and the R0/R1 remainder ' +
    'decomposition this headword glosses); imp-97096 (the exact kappa_arith and the explicit ' +
    'remainder-bound sub-gap this modulus-dependence keeps open).',
});

export default IMP97144_KAPPA_ARITH_MODULUS_DEPENDENT_RATE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97144_KAPPA_ARITH_MODULUS_DEPENDENT_RATE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97144-headword-matches-source-measurements',
    why: 'The headword must record the same general-b and primorial-b residual values as its ' +
      'source module (imp-97122), not a re-typed paraphrase.',
    holds: () => {
      const gen503 = IMP97122_MEASURED.generalB.find((r) => r.b === 503);
      const prim210 = IMP97122_MEASURED.primorialB.find((r) => r.b === 210);
      return (
        gen503 && Math.abs(gen503.r - 3.2648e-3) < 1e-9 &&
        prim210 && Math.abs(prim210.absR - 3.29e-5) < 1e-9 &&
        Math.abs(prim210.absR) < Math.abs(gen503.r) &&
        IMP97122_VERDICT.smoothBFaster === true
      );
    },
  },
  {
    id: 'imp97144-headword-names-mechanism',
    why: 'The headword must name the 2^omega(b) modulus-dependence and the Moebius divisor-sum ' +
      'cancellation mechanism -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97144_KAPPA_ARITH_MODULUS_DEPENDENT_RATE_GLOSSARY_HEADWORD.headword;
      return (
        /2\^omega\(b\)/.test(h.term) &&
        /Moebius/.test(h.mechanism) &&
        /R0\(b\)/.test(h.mechanism) &&
        /smooth b/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97144-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, and the source ' +
      'verdict this headword glosses must still show the explicit remainder-bound sub-gap open.',
    holds: () =>
      IMP97144_KAPPA_ARITH_MODULUS_DEPENDENT_RATE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97144_KAPPA_ARITH_MODULUS_DEPENDENT_RATE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97144_KAPPA_ARITH_MODULUS_DEPENDENT_RATE_GLOSSARY_HEADWORD.verdict) &&
      IMP97144_KAPPA_ARITH_MODULUS_DEPENDENT_RATE_GLOSSARY_HEADWORD.glosses === 'imp-97122' &&
      IMP97122_VERDICT.suppliesExplicitRemainderBound === false,
  },
];

for (const assertion of IMP97144_KAPPA_ARITH_MODULUS_DEPENDENT_RATE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97144-kappa-arith-modulus-dependent-rate-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
