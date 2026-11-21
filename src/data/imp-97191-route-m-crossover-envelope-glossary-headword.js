/**
 * @module imp-97191-route-m-crossover-envelope-glossary-headword
 * @fileoverview imp-97191 -- import-light Concepts glossary headword recording the imp-97159
 *   rigorous crossover: the Route M explicit first-moment lower bound
 *       F_arith(b) >= (kappa_arith - eps(b)) phi(b) b
 *   has a strictly-positive coefficient (kappa_arith - eps(b) > 0) for ALL b >= 574 (a finite,
 *   fully-derivational proof via the primorial envelope) and, sharply, for all b >= 511 (exact,
 *   using an additional finite check of [511, 573]). Below that it is vacuous only on the finite
 *   highly-composite set topped by b = 510. A reader skimming only "eps(b) is not monotone" could
 *   assume the lower bound never has a stated positivity range; this headword bakes on record the
 *   two concrete thresholds (envelope vs exact) and why they differ.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   eps(b) = (1/2) 2^omega(b) (log b + 3) / phi(b) spikes on highly-composite moduli (small phi,
 *   many prime factors), so it is NOT monotone in b -- eps(210) = 1.391 while eps(211) = 0.043. The
 *   imp-97159 primorial-envelope Lemma (phi(b) >= W_k b for omega(b) = k) turns this into a FINITE
 *   proof that eps(b) < kappa_arith for every b >= 574: the omega=4 envelope constant is exactly 35,
 *   and 35(log b+3)/b first drops below kappa_arith at b=574; every b with omega(b) >= 5 already
 *   satisfies b >= 2310 = P_5, where the envelope gives eps <= eps(P_5) = 0.358 < kappa_arith. A
 *   direct finite check additionally shows the SHARP smallest threshold is b0_exact = 511: the last
 *   exceedance is eps(510) = 0.577 (510 = 2*3*5*17), and [511, 573] is exceedance-free. So the
 *   explicit lower bound is non-vacuous (strictly positive coefficient) for all b >= 511, and its
 *   only exceptions are the finite highly-composite set with largest member 510.
 *   -----------------------------------------------
 *
 *   STATUS: documentation glossary headword only, not a re-derivation or a new computation.
 *   Establishes nothing new; moves no bound. This is positivity of the EXPLICIT arithmetic
 *   first-moment lower bound on its stated range, NOT kappa > 0 in the mean-square lower companion
 *   sense (that distinction is [[project_route_m_lower_companion_first_moment]]); the cotangent
 *   first moment (imp-97097) stays the separate open leaf. NO QED. No refereed bound is changed
 *   ; RH open.
 *
 * @see imp-97159-route-m-arith-first-moment-positivity-crossover.js (source: the two thresholds
 *   b0_envelope=574 and b0_exact=511, the primorial-envelope Lemma, and the finite Theorem this
 *   headword glosses)
 * @see imp-97133-route-m-arith-first-moment-explicit-remainder.js (the eps(b) this crossover is
 *   derived from)
 *
 * Ticket: imp-97191 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

import { IMP97159_CROSSOVER, IMP97159_VERDICT } from './imp-97159-route-m-arith-first-moment-positivity-crossover.js';

// The crossover-envelope glossary headword, baked verbatim (no re-import of the derivation text).
const ROUTE_M_CROSSOVER_ENVELOPE_HEADWORD = Object.freeze({
  key: 'route-m-crossover-envelope-vs-exact-threshold',
  term:
    'the Route M first-moment positivity crossover has TWO thresholds -- a finite-proof envelope ' +
    'b0=574 and a sharp exact b0=511 -- with vacuity confined to a finite highly-composite set ' +
    'topped by b=510',
  definition:
    'The explicit lower bound F_arith(b) >= (kappa_arith - eps(b)) phi(b) b (imp-97133) has a ' +
    'strictly-positive coefficient (kappa_arith - eps(b) > 0) for all b >= 574 (imp-97159 ' +
    'b0Envelope, a fully-derivational finite proof needing only one scalar inequality plus the ' +
    'primorial values eps(P_5), eps(P_6)) and, sharply, for all b >= 511 (imp-97159 b0Exact, which ' +
    'additionally uses a finite check of the window [511, 573]). The last modulus where the bound ' +
    'is vacuous is b = 510 (2*3*5*17, eps(510) = 0.577 >= kappa_arith); every b below 510 that also ' +
    'exceeds is highly composite in the same sense.',
  mechanism:
    'eps(b) = (1/2) 2^omega(b) (log b+3) / phi(b) is not monotone, so no single decreasing curve ' +
    'gives a threshold directly. The primorial-envelope Lemma bounds eps(b) <= (2^k/(2 W_k))(log ' +
    'b+3)/b for every b with omega(b)=k (W_k = phi(P_k)/P_k), a curve that IS decreasing and sharp ' +
    'at the primorial P_k. Splitting by omega(b): k<=3 is dominated by the k=4 envelope; the k=4 ' +
    'envelope constant is exactly 35, and 35(log b+3)/b < kappa_arith first at b=574; every ' +
    'omega(b)>=5 modulus already satisfies b>=2310=P_5, where the envelope gives eps<=eps(P_5)=0.358 ' +
    '< kappa_arith. This tiles all b>=574 with no residual interval, since 574<=b<2310 forces ' +
    'omega(b)<=4. The sharper b0_exact=511 additionally spends a finite direct check over [511,573] ' +
    'to rule out any exceedance the envelope argument alone does not need.',
  verificationStatus:
    'Measured/derived (not a new proof) from the committed imp-97159 crossover module: b0Envelope ' +
    '= 574 (rigorous, finite, fully derivational) and b0Exact = 511 (sharp, uses an additional ' +
    'finite window check), lastExceedanceB = 510. Establishes no bound and moves nothing on its ' +
    'own -- this is positivity of the explicit first-moment lower bound on its stated range, not ' +
    'kappa > 0 in the mean-square companion sense. NO QED; no refereed bound is changed; RH open.',
});

export const IMP97191_ROUTE_M_CROSSOVER_ENVELOPE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97191',
  proofSection: 'Route M',
  glosses: 'imp-97159',
  question:
    'imp-97159 derived a rigorous crossover threshold above which the Route M explicit ' +
    'first-moment lower bound has a strictly-positive coefficient. Is that a single threshold, ' +
    'and how does the finite-proof envelope threshold relate to the sharp exact threshold?',
  headword: ROUTE_M_CROSSOVER_ENVELOPE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97159 finding: ' +
    'kappa_arith - eps(b) > 0 for all b >= 574 (finite-proof envelope, a single scalar inequality ' +
    'plus two primorial values) and, sharply, for all b >= 511 (exact, additionally using a finite ' +
    'window check of [511,573]); the bound is vacuous only on the finite highly-composite set ' +
    'topped by b = 510. Establishes nothing new; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97159 (the b0Envelope=574 and b0Exact=511 thresholds, the primorial-envelope Lemma, and ' +
    'the finite Theorem this headword glosses); imp-97133 (the explicit eps(b) remainder this ' +
    'crossover is derived from).',
});

export default IMP97191_ROUTE_M_CROSSOVER_ENVELOPE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97191_ROUTE_M_CROSSOVER_ENVELOPE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97191-headword-matches-source-thresholds',
    why: 'The headword must record the same b0Envelope, b0Exact and lastExceedanceB values as its ' +
      'source module (imp-97159), not a re-typed paraphrase.',
    holds: () =>
      IMP97159_CROSSOVER.b0Envelope === 574 &&
      IMP97159_CROSSOVER.b0Exact === 511 &&
      IMP97159_CROSSOVER.lastExceedanceB === 510 &&
      IMP97159_VERDICT.crossoverDerived === true,
  },
  {
    id: 'imp97191-headword-names-both-thresholds',
    why: 'The headword must name both the envelope threshold (574) and the exact threshold (511) ' +
      'plus the last exceedance (510) -- the entire point of the glossary entry is that these ' +
      'differ.',
    holds: () => {
      const h = IMP97191_ROUTE_M_CROSSOVER_ENVELOPE_GLOSSARY_HEADWORD.headword;
      return (
        /574/.test(h.definition) &&
        /511/.test(h.definition) &&
        /510/.test(h.definition) &&
        /primorial-envelope Lemma/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97191-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, and the source ' +
      'verdict this headword glosses must still show this as first-moment positivity, not the ' +
      'mean-square companion.',
    holds: () =>
      IMP97191_ROUTE_M_CROSSOVER_ENVELOPE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97191_ROUTE_M_CROSSOVER_ENVELOPE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97191_ROUTE_M_CROSSOVER_ENVELOPE_GLOSSARY_HEADWORD.verdict) &&
      IMP97191_ROUTE_M_CROSSOVER_ENVELOPE_GLOSSARY_HEADWORD.glosses === 'imp-97159' &&
      IMP97159_VERDICT.positivityIsFirstMomentNotMeanSquare === true,
  },
];

for (const assertion of IMP97191_ROUTE_M_CROSSOVER_ENVELOPE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97191-route-m-crossover-envelope-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
