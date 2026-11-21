/**
 * @module imp-96335-ecoll-rate-vs-conclusion-glossary-headword
 * @fileoverview imp-96335 -- import-light glossary/Concepts headword for the
 *   imp-96311 tabulation (extending the imp-96290 Step-4 bridge inventory):
 *   the collision-term RATE and the E(N) -> 0 CONCLUSION are separated by
 *   what C_H = C_shock * C_Lip / 4 actually touches.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96290 stated that E_coll(N) = C_H * sqrt(C_KH) * (log gamma_N / N)^{1/2}
 *   splits into an unconditional polylog-over-N RATE and a C_H-gated
 *   CONCLUSION, but never tabulated the split numerically. imp-96311 measured
 *   it directly across a ~66x span of C_H (1/8, 0.127, 1.0, C_KH) and found
 *   the split is exact: the whole exponent + log structure is C_H-free, and
 *   C_H enters as nothing but a linear prefactor. A reader who meets E_coll's
 *   N^{-1/2}-ish decay and the still-open C_Lip gate separately could
 *   mistake the open conditional as also threatening the decay rate itself.
 *   This headword bakes the imp-96311 VERDICT verbatim (no re-import of the
 *   imp-96311 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   E_coll(C_H, N) = C_H * R(N), R(N) = sqrt(C_KH) * (log gamma_N / N)^{1/2}.
 *   The pure rate factor R(N) carries the entire exponent + log structure and
 *   contains no C_H, so: (1) the discrete log-log slope d(log E_coll)/d(log N)
 *   is bit-for-bit identical across every tested C_H column (measured max
 *   spread < 1e-12), crawling from -0.4568 (N=1e4..1e5) toward -0.4801
 *   (N=1e10..1e12), i.e. toward the N^{-1/2} exponent with a slow positive
 *   log correction from log gamma_N; and (2) at every fixed N the cross-column
 *   ratio E_coll(C_H_a, N) / E_coll(C_H_b, N) equals the constant C_H_a / C_H_b
 *   exactly, independent of N (measured deviation < 1e-12).
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96311 VERDICT for quick
 *   reference, so the open C_Lip conditional is never cited as if it also
 *   threatened the (unconditional) decay rate. It establishes nothing new
 *   and fits no new curve. Changes no bound of the Lambda program; NO QED.
 *   No refereed bound is changed; RH remains OPEN. C_H
 *   isRigorousUpperBound stays false (imp-2642/imp-2701); the imp-2640
 *   Gronwall discharge of C_Lip remains NEGATIVE.
 *
 * @see imp-96311-ecoll-rate-ch-independence-tabulation (source: the measured VERDICT this glosses)
 * @see imp-96290-step4-bridge-subconstant-inventory (the flagged separation, E_coll form, C_KH)
 * @see imp-2641 (Trudgian discharge of C_KH = pi * 2.622)
 * @see imp-2640 (negative Gronwall discharge of C_Lip)
 *
 * Ticket: imp-96335 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The rate-vs-conclusion-separation headword, baked verbatim (no re-import).
const ECOLL_RATE_VS_CONCLUSION_HEADWORD = Object.freeze({
  key: 'ecoll-rate-vs-conclusion-separation',
  term:
    'imp-96311 VERDICT: C_H = C_shock * C_Lip / 4 moves only the E_coll linear ' +
    'prefactor and the value of its limit, never the N^{-1/2}-ish decay rate',
  definition:
    'E_coll(C_H, N) = C_H * R(N), where the pure rate factor ' +
    'R(N) = sqrt(C_KH) * (log gamma_N / N)^{1/2} carries the entire exponent ' +
    'and log structure and contains no C_H. Measured across C_H = {1/8, 0.127, ' +
    '1.0, C_KH} (~66x span): the discrete log-log slope profile is identical ' +
    'to within < 1e-12 across every column, and the cross-column ratio ' +
    'E_coll(C_H_a, N) / E_coll(C_H_b, N) equals the constant C_H_a / C_H_b ' +
    'exactly at every N (deviation < 1e-12).',
  rateVsConclusionMechanism:
    'log E_coll = log C_H + log R(N), and the derivative in log N annihilates ' +
    'the additive constant log C_H, so the measured exponent (crawling from ' +
    '-0.4568 toward -0.4801, i.e. toward N^{-1/2}) is forced to be C_H-free ' +
    'for ANY finite C_H. The E(N) -> 0 conclusion depends only on C_H being ' +
    'finite and N-uniform -- exactly what a discharged C_Lip would supply -- ' +
    'not on the rate, which is unconditional.',
  consequence:
    'Citing the still-open C_Lip conditional as if it also threatened the ' +
    'decay rate of E_coll would be wrong: for ANY finite C_H, E_coll(N) -> 0. ' +
    'C_H (hence the unquantified C_Lip) can only rescale the multiplicative ' +
    'height and the value of the limit; it cannot change whether the ' +
    'sequence tends to zero. C_H isRigorousUpperBound stays false ' +
    '(imp-2642/imp-2701); imp-2640 Gronwall discharge of C_Lip remains NEGATIVE.',
});

export const IMP96335_ECOLL_RATE_VS_CONCLUSION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96335',
  proofSection: 'G6_polymath15_bridge',
  glosses: 'imp-96311',
  scopes: 'imp-96290,imp-2641,imp-2640',
  question:
    'imp-96311 tabulated the imp-96290 flagged separation between the E_coll ' +
    'polylog-over-N RATE and the C_H-gated E(N) -> 0 CONCLUSION and found the ' +
    'split exact. What does this mean for a reader landing on the E_coll ' +
    'module cold?',
  headword: ECOLL_RATE_VS_CONCLUSION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the ' +
    'imp-96311 VERDICT: the E_coll polylog-over-N rate (exponent + log ' +
    'structure) is genuinely C_H-independent -- the measured log-log slope ' +
    'profile coincides bit-for-bit across a ~66x span of C_H, and the ' +
    'cross-column ratio equals the C_H ratio exactly at every N. Only the ' +
    'linear prefactor and the value of the limit depend on C_H, hence on the ' +
    'unquantified C_Lip. Establishes nothing; fits no new curve; moves no ' +
    'bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96311 (E_coll rate-vs-conclusion C_H-independence tabulation, source ' +
    'VERDICT); imp-96290 (Step-4 bridge subconstant inventory, flagged the ' +
    'separation, E_coll form, C_KH); imp-2641 (Trudgian discharge of ' +
    'C_KH = pi * 2.622); imp-2640 (negative Gronwall discharge of C_Lip); ' +
    'imp-2642/imp-2701 (C_H isRigorousUpperBound = false).',
});

export default IMP96335_ECOLL_RATE_VS_CONCLUSION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96335_ECOLL_RATE_VS_CONCLUSION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96335-headword-has-required-fields',
    why:
      'The headword must name the rate factor, the prefactor/ratio identity, ' +
      'and the conclusion-gate distinction -- the entire point of the entry.',
    holds: () => {
      const h = IMP96335_ECOLL_RATE_VS_CONCLUSION_GLOSSARY_HEADWORD.headword;
      return (
        /R\(N\)/.test(h.definition) &&
        /C_H_a \/ C_H_b/.test(h.definition) &&
        /log C_H/.test(h.rateVsConclusionMechanism) &&
        /NEGATIVE/.test(h.consequence)
      );
    },
  },
  {
    id: 'imp96335-honesty-gate-no-qed',
    why:
      'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, ' +
      'correct glosses/scopes pointers.',
    holds: () =>
      IMP96335_ECOLL_RATE_VS_CONCLUSION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96335_ECOLL_RATE_VS_CONCLUSION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96335_ECOLL_RATE_VS_CONCLUSION_GLOSSARY_HEADWORD.verdict) &&
      IMP96335_ECOLL_RATE_VS_CONCLUSION_GLOSSARY_HEADWORD.glosses === 'imp-96311' &&
      IMP96335_ECOLL_RATE_VS_CONCLUSION_GLOSSARY_HEADWORD.scopes ===
        'imp-96290,imp-2641,imp-2640',
  },
];

for (const assertion of IMP96335_ECOLL_RATE_VS_CONCLUSION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96335-ecoll-rate-vs-conclusion-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
