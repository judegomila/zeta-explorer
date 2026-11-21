/**
 * @module imp-97175-route-m-liouville-parity-sign-law-glossary-headword
 * @fileoverview imp-97175 -- import-light glossary/Concepts headword for the imp-97140/imp-97167
 *   finding: the Route M arithmetic first-moment residual r(b) = F_arith(b)/(phi(b) b) - kappa_arith
 *   obeys a PARITY sign law keyed to omega(b) (the count of DISTINCT prime factors of b), and this
 *   is a LIOUVILLE-type law, NOT literally the Moebius function mu(b) -- the sign law holds on prime
 *   powers (b = p^k, omega=1) where mu(b) = 0 for k >= 2, so no reader should conflate "parity of
 *   omega" with "value of mu".
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-97140 MEASURED the sign law across b in [200,3000] (2799/2801, exceptions only at the
 *   smoothest primorial moduli) and imp-97167 DERIVED it from the imp-97133 Moebius/Stirling
 *   remainder, producing the master identity r(b) phi(b) = (1/4) Lambda(b) + Delta_omega(b). This
 *   headword bakes the terminology distinction (Liouville parity vs Moebius value) verbatim so a
 *   reader skimming only "(-1)^omega(b)" does not mistake the sign law for a statement about mu(b).
 *
 *   ORIENTATION NOTE (do not silently pick one). imp-97140's own rule STRING reads
 *   "sign(r(b)) = (-1)^omega(b)", but its own cohort data and inline comments say omega ODD gives
 *   r > 0 -- which is sign = (-1)^(omega(b)+1), equivalently -(-1)^omega(b). imp-97167 traces this to
 *   the leading tail term (-1)^omega(b) delta(1) with delta(1) = -0.084469 < 0, confirms the
 *   data-consistent orientation is (-1)^(omega(b)+1), and flags the imp-97140 string as mislabeled
 *   relative to its own measurements. A companion reconciliation ticket (imp-97187) tracks bringing
 *   every consumer of the string onto the derived orientation; this headword already uses the
 *   derived, data-consistent form so as not to propagate the mislabeled string.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   For omega(b) = 1 (prime powers) the Lambda(b) = log p term of the master identity forces r > 0
 *   directly -- true even where mu(b) = 0, which is exactly why the law is Liouville-type (parity of
 *   the distinct-prime COUNT) rather than Moebius (value keyed to squarefreeness). For omega(b) >= 2
 *   the Lambda term vanishes and the sign is carried by the leading tail term (-1)^omega(b) delta(1);
 *   since delta(1) < 0, this yields r > 0 for omega ODD and r < 0 for omega EVEN, i.e.
 *   sign(r(b)) = (-1)^(omega(b)+1). The two known exceptions in [200,3000] are the smoothest
 *   primorial moduli b=2310, b=2730 (and b=30030 further up), where the k-fold Moebius difference
 *   collapses the leading term to a ~1e-6 floor and a subleading opposite-sign term flips r.
 *
 *   STATUS: glossary headword restating already-committed imp-97140 (measurement) and imp-97167
 *   (derivation) findings, not a new estimate. Establishes no uniform sign certificate for all
 *   non-primorial b (that remains the imp-97167 named residual); moves no bound; interval-rigorous
 *   reach unchanged; T ~ 2.594e7 anchor unchanged; no refereed bound is changed; RH open. NO QED.
 *
 * @see imp-97140-route-m-fixed-omega-residual-cohorts.js (source: the measured sign + magnitude laws)
 * @see imp-97167-route-m-parity-sign-law-derivation.js (source: the derivation, orientation correction,
 *   and primorial-collapse mechanism)
 *
 * Ticket: imp-97175 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The Liouville-parity headword, baked verbatim (no re-import).
const ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_HEADWORD = Object.freeze({
  key: 'route-m-residual-sign-law-is-liouville-parity-of-omega-not-moebius-mu',
  term:
    'imp-97140/imp-97167 finding: the Route M arithmetic first-moment residual r(b) obeys a ' +
    'LIOUVILLE-type parity sign law keyed to omega(b) (count of distinct prime factors) -- ' +
    'derived orientation sign(r(b)) = (-1)^(omega(b)+1) -- and is NOT literally the Moebius ' +
    'function mu(b), since the law holds on prime powers where mu(b) = 0',
  definition:
    'r(b) = F_arith(b)/(phi(b) b) - kappa_arith satisfies the master identity ' +
    'r(b) phi(b) = (1/4) Lambda(b) + Delta_omega(b) (imp-97167), where Lambda is von Mangoldt and ' +
    'Delta_omega(b) = Sum_{m|b} mu(b/m) delta(m) is a k-fold Moebius difference of a decaying, ' +
    'strictly negative discrepancy tail delta(m) < 0. On prime powers (omega=1) the Lambda term ' +
    'alone forces r > 0 even though mu(b) = 0 there for k >= 2 -- the law tracks the PARITY of ' +
    'omega(b), not the VALUE of mu(b). For omega(b) >= 2 the sign is carried by the leading tail ' +
    'term (-1)^omega(b) delta(1), delta(1) = -0.084469 < 0, giving the data-consistent orientation ' +
    'sign(r(b)) = (-1)^(omega(b)+1): r > 0 for omega ODD, r < 0 for omega EVEN.',
  mechanism:
    'Liouville-type means the sign is a function of the PARITY of the number of prime factors ' +
    '(with multiplicity ignored here, since omega counts DISTINCT primes), which survives on prime ' +
    'powers and primorials alike; Moebius mu(b) instead vanishes whenever b has a repeated prime ' +
    'factor, so it cannot be the driver of a sign law that is measured and derived to hold on ' +
    'b = 1024 = 2^10, 2187 = 3^7, 2197 = 13^3 (all prime powers, all r > 0). The two known ' +
    'exceptions (b=2310, 2730, and b=30030 upward) are exactly the smoothest primorial moduli, ' +
    'where every subset-product term in the k-fold Moebius difference is comparably small and the ' +
    'leading (-1)^omega(b) delta(1) term is annihilated to a ~1e-6 floor, letting a subleading ' +
    'opposite-sign term flip r.',
  verificationStatus:
    'Restates the already-committed imp-97140 measurement (2799/2801 over b in [200,3000]) and the ' +
    'imp-97167 derivation (master identity + orientation correction to (-1)^(omega+1), matching the ' +
    'imp-97140 data rather than its own mislabeled rule string); no new numerical computation. ' +
    'Establishes no uniform non-cancellation certificate for all non-primorial b (imp-97167 named ' +
    'residual, tracked separately by imp-97187 for string reconciliation across consumers); moves ' +
    'no bound; T ~ 2.594e7 anchor unchanged; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97175_ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97175',
  proofSection: 'Route-M',
  glosses: 'imp-97140',
  question:
    'imp-97140 measured that the Route M arithmetic first-moment residual r(b) has a sign tracking ' +
    'the parity of omega(b) (distinct prime factor count). Is this literally a statement about the ' +
    'Moebius function mu(b), or a distinct (Liouville-type) parity law -- and what is the correct ' +
    'sign orientation?',
  headword: ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-97140 measurement and ' +
    'imp-97167 derivation: the residual sign law tracks the PARITY of omega(b), not the VALUE of ' +
    'mu(b) -- it holds on prime powers where mu(b) = 0. The derived, data-consistent orientation is ' +
    'sign(r(b)) = (-1)^(omega(b)+1) (r > 0 for omega odd), correcting the imp-97140 rule string ' +
    '"(-1)^omega(b)" which was mislabeled relative to its own cohort data. Readers should not treat ' +
    'this as literally Moebius mu, and should use the (-1)^(omega+1) orientation. Establishes ' +
    'nothing new; moves no bound; interval-rigorous reach unchanged; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97140 (the measured sign + magnitude laws across fixed-omega cohorts); imp-97167 (the ' +
    'derivation, orientation correction, and primorial-collapse mechanism).',
});

export default IMP97175_ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97175_ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97175-headword-distinguishes-liouville-from-moebius',
    why: 'The headword must state both the Liouville-parity reading and explicitly rule out the ' +
      'literal-Moebius reading, and must carry the derived (-1)^(omega+1) orientation -- the entire ' +
      'point of the glossary entry.',
    holds: () => {
      const h = IMP97175_ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /LIOUVILLE/.test(h.term) &&
        /NOT literally the Moebius/.test(h.term) &&
        /\(-1\)\^\(omega\(b\)\+1\)/.test(h.term) &&
        /mu\(b\) = 0/.test(h.definition) &&
        /delta\(1\) = -0\.084469/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97175-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97175_ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97175_ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97175_ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP97175_ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_GLOSSARY_HEADWORD.glosses === 'imp-97140',
  },
];

for (const assertion of IMP97175_ROUTE_M_LIOUVILLE_PARITY_SIGN_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97175-route-m-liouville-parity-sign-law-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
