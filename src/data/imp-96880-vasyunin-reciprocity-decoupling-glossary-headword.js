/**
 * @module imp-96880-vasyunin-reciprocity-decoupling-glossary-headword
 * @fileoverview imp-96880 -- import-light glossary/Concepts headword for the imp-96850
 *   derivation: the coupled, weighted, two-argument Route M Vasyunin double sum
 *
 *       T(N) = Sum_{gcd(a,b)=1, a,b<=N} I(a,b)^2 / (a^2 b^2)
 *
 *   reduces EXACTLY, by reciprocity, to a totient tail sum times a SINGLE unwritten
 *   scalar beta -- collapsing what imp-96830 named as two obstructions (coupling,
 *   wrong regime) down to one closed-form gap.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96830 isolated T(N) as the genuine residual of the Route M Frobenius
 *   conditioning-ceiling and named two obstructions: (2a) COUPLING -- I(a,b)^2 is a
 *   product of two Vasyunin cotangent sums at DIFFERENT reduced denominators, with no
 *   diagonal-in-k reduction available; and (2b) WRONG REGIME -- the 1/(a^2 b^2) weight
 *   concentrates on small arguments, outside the large-denominator moment asymptotics
 *   literature actually supplies. imp-96850 resolved both: reciprocity I(a,b)=I(b,a),
 *   grouped by k=max(a,b), collapses the double sum to a single-denominator inner
 *   average (verified exact to ~1e-14 against the imp-96828 ladder), and the weight's
 *   totient-tail growth (not a bulk moment) turns out to BE the mechanism behind the
 *   measured linear-in-log growth. Following the imp-96820/imp-96824 headword pattern,
 *   this module bakes that verdict verbatim (no re-import of the imp-96850 module, to
 *   stay import-light) as a standalone quick-lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   T(N) = (2 C_VAS)^2 + Sum_{k=2}^{N} 2 M(k)/k^2, where M(k) = Sum_{a<k,gcd(a,k)=1}
 *   I(a,k)^2/a^2 is a single-denominator, 1/a^2-weighted, coprime-averaged inner sum.
 *   Measurement shows M(k) ~ beta * phi(k) uniformly over prime and composite k, with
 *   beta_eff ~ 2.913 over the imp-96828 ladder (N<=4000). Combined with the classical
 *   totient tail Sum_{k<=N} phi(k)/k^2 = (6/pi^2) log N + C_0, this gives the growth law
 *   T(N) ~ c log N with c = 2 beta (6/pi^2) ~ 3.542, matching the imp-96828 measured
 *   slope 3.542 to ~0.1% and structurally refuting the imp-96795 (log N)^2 target. The
 *   lone surviving gap is a closed form for the scalar beta itself, ~73% of which is the
 *   variance of cotangent-sum fluctuations against the 1/a^2 weight -- an object L1-L2
 *   supply only the UNWEIGHTED k^2 log k moment for, not this weighted small-a variant.
 *
 *   STATUS: derivation + measurement, HONEST PARTIAL closure (not a rigorous asymptotic
 *   for beta, and not a new bound). Collapses a two-obstruction problem to a single
 *   named scalar; establishes no operator positivity; moves no bound.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96850 verdict for quick reference. It
 *   establishes nothing new, instantiates no interval, closes no sub-gap beyond what
 *   imp-96850 already recorded, and moves no bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96850-coupled-weighted-vasyunin-double-sum-decoupling.js (source: the derivation this glosses)
 * @see imp-96830-uniform-cotangent-second-moment-literature-assessment.js (the original coupling/regime obstructions)
 * @see imp-96828-coprime-core-vasyunin-second-moment-growth.js (measured T(N) ~ 3.542 log N)
 * @see imp-96824-route-m-mt-ratio-fit-invariant-glossary-headword.js (sibling headword pattern this follows)
 *
 * Ticket: imp-96880 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The reciprocity-decoupling headword, baked verbatim (no re-import).
const VASYUNIN_RECIPROCITY_DECOUPLING_HEADWORD = Object.freeze({
  key: 'route-m-vasyunin-double-sum-reciprocity-decoupling-single-scalar-beta',
  term:
    'imp-96850 verdict: the coupled weighted two-argument Vasyunin double sum ' +
    'T(N) = Sum_{gcd(a,b)=1} I(a,b)^2/(a^2 b^2) reduces EXACTLY by reciprocity to a ' +
    'totient tail times a single unwritten scalar beta, collapsing the imp-96830 ' +
    'coupling + wrong-regime obstructions into one closed-form gap',
  definition:
    'imp-96830 named two obstructions to a growth law for T(N): (2a) COUPLING -- ' +
    'I(a,b)^2 pairs two Vasyunin cotangent sums at different reduced denominators, ' +
    'with no diagonal-in-k reduction; and (2b) WRONG REGIME -- the 1/(a^2 b^2) weight ' +
    'concentrates on small arguments, outside the large-denominator moment literature. ' +
    'imp-96850 resolves (2a) via I(a,b)=I(b,a) reciprocity, grouping the coprime square ' +
    'by k=max(a,b), giving the EXACT decomposition ' +
    'T(N) = (2 C_VAS)^2 + Sum_{k=2}^{N} 2 M(k)/k^2, M(k) = Sum_{a<k,gcd(a,k)=1} I(a,k)^2/a^2 ' +
    '(verified to ~1e-14 against the imp-96828 ladder at N=250,500,1000).',
  mechanism:
    'M(k) ~ beta * phi(k) uniformly over prime and composite k (measured beta_k: 2.844 ' +
    'at k=101 rising to 2.917 at k=10007, beta_eff ~ 2.913 over the N<=4000 ladder). ' +
    'The classical totient tail Sum_{k<=N} phi(k)/k^2 = (6/pi^2) log N + C_0 (C_0 ~ ' +
    '0.6975) then gives T(N) ~ c log N with c = 2 beta (6/pi^2) ~ 3.542, matching the ' +
    'imp-96828 measured slope 3.542 to ~0.1% -- resolving (2b): the weight does not ' +
    'block a growth law, it produces a slowly-accumulating totient tail INSTEAD of the ' +
    'bulk k^2 log k moment, and structurally refutes the imp-96795 (log N)^2 target. ' +
    'The leading polynomial term of I(a,k) alone gives beta = 2 C_VAS^2 = 0.7946, 3.67x ' +
    'below the measured 2.913, so ~73% of beta is the variance of cotangent-sum ' +
    'fluctuations against the 1/a^2 weight -- an object neither Maier-Rassias/' +
    'Bettin-Drappeau (which supply only the UNWEIGHTED fixed-k moment ~c k^2 log k) nor ' +
    'Bettin-Conrey reciprocity (an identity, not a weighted second-moment value) hand over.',
  verificationStatus:
    'Derivation + measurement, HONEST PARTIAL closure: the decomposition is exact and ' +
    'the growth law is derived modulo one scalar, numerically confirmed to ~0.1% ' +
    'against an independent measurement (imp-96828). Not a rigorous asymptotic for ' +
    'beta and not a new bound. Establishes no operator positivity; moves no bound; ' +
    'no refereed bound is changed; RH open; NO QED.',
});

export const IMP96880_VASYUNIN_RECIPROCITY_DECOUPLING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96880',
  proofSection: 'S-frontier',
  glosses: 'imp-96850',
  question:
    'imp-96830 named two obstructions -- coupling and wrong regime -- to a growth law ' +
    'for the coupled weighted two-argument Vasyunin double sum T(N). Does reciprocity ' +
    'resolve either, and what (if anything) survives as an open gap?',
  headword: VASYUNIN_RECIPROCITY_DECOUPLING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96850 ' +
    'verdict: reciprocity I(a,b)=I(b,a), grouped by k=max(a,b), collapses T(N) EXACTLY ' +
    'to (2 C_VAS)^2 + Sum_k 2 M(k)/k^2, and the measured single-denominator law ' +
    'M(k) ~ beta phi(k) plus the classical totient tail give T(N) ~ c log N with ' +
    'c = 2 beta (6/pi^2) ~ 3.542 (matching imp-96828). The lone surviving gap is a ' +
    'closed form for the scalar beta (~73% cotangent-fluctuation variance). ' +
    'Establishes nothing new; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96850 (the reciprocity-decoupling derivation this glosses); imp-96830 (the ' +
    'original coupling/wrong-regime obstructions); imp-96828 (measured T(N) ~ 3.542 ' +
    'log N); imp-96688 (the exact T(N) factorization origin).',
});

export default IMP96880_VASYUNIN_RECIPROCITY_DECOUPLING_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96880_VASYUNIN_RECIPROCITY_DECOUPLING_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96880-headword-has-required-fields',
    why: 'The headword must name the exact decomposition, the single-denominator law, ' +
      'and the derived growth constant -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96880_VASYUNIN_RECIPROCITY_DECOUPLING_GLOSSARY_HEADWORD.headword;
      return (
        /2 C_VAS\)\^2/.test(h.definition) &&
        /M\(k\) ~ beta \* phi\(k\)/.test(h.mechanism) &&
        /3\.542/.test(h.mechanism) &&
        /2\.913/.test(h.mechanism) &&
        /0\.7946/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96880-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96880_VASYUNIN_RECIPROCITY_DECOUPLING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96880_VASYUNIN_RECIPROCITY_DECOUPLING_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96880_VASYUNIN_RECIPROCITY_DECOUPLING_GLOSSARY_HEADWORD.verdict) &&
      IMP96880_VASYUNIN_RECIPROCITY_DECOUPLING_GLOSSARY_HEADWORD.glosses === 'imp-96850',
  },
];

for (const assertion of IMP96880_VASYUNIN_RECIPROCITY_DECOUPLING_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96880-vasyunin-reciprocity-decoupling-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
