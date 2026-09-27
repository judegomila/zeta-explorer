/**
 * @module imp-97609-kappa-arith-limit-vs-measured-ladder-glossary-headword
 * @fileoverview imp-97609 -- import-light Concepts glossary headword distinguishing the
 *   kappa_arith CLOSED-FORM LIMIT 0.5704960511308594 = (3/2)C - 3/8 (imp-97096, C = (log 2pi -
 *   gamma)/2) from the MEASURED finite-b ladder samples of F_arith(b)/(phi(b) b) that approach it
 *   (imp-97096: 0.5745 at b=1201, 0.5716 at b=5003, 0.5711 at b=9973, 0.570495 at the primorial
 *   b=2310) -- so a reader does not mistake a ladder sample for a drifted citation of the limit,
 *   or vice versa.
 *
 *   CORRECTION TO THE imp-97543 FINDING (5) EXAMPLE LIST. The ticket for this headword (and the
 *   imp-97543 accuracy audit it cites) named "0.570766, 0.5709852..., 0.570495" as MEASURED
 *   Route-M F_arith(b)/(phi(b) b) ladder decimals near 0.5705. Only 0.570495 (b=2310 primorial,
 *   imp-97096) actually belongs to that cohort. Checked directly against the source files:
 *     - 0.570766 is lambda_min(N=100, T=1600) from the UNRELATED Krein c_sharp coupled-limit
 *       cohort (imp-97206/97183/97335/97355/97401/97456) -- a different constant (a numerical
 *       Ritz floor on a spectral problem), not a Route-M arithmetic-moment sample.
 *     - 0.5709852 is a coincidental digit-substring inside an unrelated zeta-zero ordinate
 *       literal (405780.5709852480 in src/data/zeros-to-1e6.js) -- not a Route-M quantity at all.
 *   Both are corrected here rather than repeated, per this project's no-false-claims convention;
 *   they do not affect imp-97543's core verdict (no drift found in the constant actually cited by
 *   imp-97124/imp-97131/imp-97516/the glossary), which concerned a different, disjoint claim.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   kappa_arith = (3/2) C - 3/8 = 0.5704960511308594... (C = (log 2pi - gamma)/2 = 0.6303307...)
 *   is the EXACT b -> infinity LIMIT of F_arith(b)/(phi(b) b) (imp-97096). It is a single fixed
 *   constant, expressed in the classical constants gamma and log 2pi, and is cited identically
 *   throughout the Route-M cohort as 0.5704960511308594 / its truncation 0.5704960511 / the
 *   rounded prose 0.5705 (imp-97543). By contrast, F_arith(b)/(phi(b) b) AT FINITE b is a genuinely
 *   b-DEPENDENT measured quantity that only converges to kappa_arith as b grows: imp-97096 records
 *   0.5745 at b=1201, 0.5716 at b=5003, 0.5711 at b=9973, and 0.570495 at the primorial b=2310
 *   (which "hits" the limit to 4 decimal places, per imp-97130). These finite-b samples are
 *   correctly DISTINCT values from the limit, not typos or drifted citations of it -- the residual
 *   (F_arith(b) - kappa_arith phi(b) b)/(phi(b) b log b) decays toward 0 as b grows (imp-97122:
 *   O(log b / b) on a general-b ladder, faster on a primorial-b ladder), which is exactly why the
 *   ladder samples approach but do not equal 0.5704960511308594 at any finite b.
 *
 *   STATUS: documentation glossary headword only, not a re-derivation or a new computation.
 *   Establishes nothing new; moves no bound. NO QED. Platt-Trudgian Lambda <= 0.2 SOTA; RH open.
 *
 * @see imp-97096-route-m-arith-first-moment-evaluation.js (source: the exact limit and the
 *   genuine finite-b ladder samples this headword names)
 * @see imp-97122-route-m-arith-first-moment-convergence-rate.js (the certified O(log b / b)
 *   convergence rate of the ladder toward the limit)
 * @see imp-97124-route-m-kappa-arith-glossary-headword.js (the limit's own glossary headword)
 * @see imp-97543-route-m-kappa-arith-closed-form-crosscheck.js (the accuracy audit whose finding
 *   (5) example list this module corrects; its core verdict on citation consistency is unaffected)
 *
 * Ticket: imp-97609 (content, low, sonnet-4-6). Documentation only; establishes nothing; NO QED;
 * Platt-Trudgian Lambda <= 0.2 SOTA.
 */

import { IMP97096_KAPPA_ARITH } from './imp-97096-route-m-arith-first-moment-evaluation.js';

// The genuine (source-verified) finite-b ladder samples this headword names -- NOT the
// imp-97543 example list, which named two values from unrelated cohorts (see fileoverview).
export const IMP97609_GENUINE_LADDER_SAMPLES = Object.freeze([
  Object.freeze({ b: 1201, value: 0.5745, note: 'a>=2 reading, imp-97096' }),
  Object.freeze({ b: 5003, value: 0.5716, note: 'imp-97096' }),
  Object.freeze({ b: 9973, value: 0.5711, note: 'imp-97096' }),
  Object.freeze({ b: 2310, value: 0.570495, note: 'a>=1 primorial reading, imp-97096/imp-97130' }),
]);

// The two imp-97543 finding-(5) example values that do NOT belong to the Route-M cohort.
export const IMP97609_MISATTRIBUTED_EXAMPLES = Object.freeze([
  Object.freeze({
    value: 0.570766,
    actualSource: 'imp-97206/97183/97335/97355/97401/97456 Krein c_sharp lambda_min(N=100,T=1600)',
  }),
  Object.freeze({
    value: 0.5709852,
    actualSource: 'coincidental digit-substring of the zero ordinate 405780.5709852480 in zeros-to-1e6.js',
  }),
]);

const KAPPA_ARITH_LIMIT_HEADWORD = Object.freeze({
  key: 'route-m-kappa-arith-limit-vs-measured-finite-b-ladder',
  term:
    'kappa_arith LIMIT (0.5704960511308594..., EXACT, b -> infinity) versus the MEASURED ' +
    'finite-b samples of F_arith(b)/(phi(b) b) that converge to it (0.5745 at b=1201 down to ' +
    '0.570495 at the primorial b=2310) -- distinct values, not drifted citations of one another',
  definition:
    'kappa_arith = (3/2) C - 3/8, C = (log 2pi - gamma)/2, is the single fixed b -> infinity ' +
    'limit of F_arith(b)/(phi(b) b) (imp-97096), cited identically across the Route-M cohort as ' +
    '0.5704960511308594 / 0.5704960511 / 0.5705 (imp-97543). F_arith(b)/(phi(b) b) AT FINITE b is ' +
    'a separate, b-dependent measured quantity: imp-97096 records 0.5745 (b=1201), 0.5716 ' +
    '(b=5003), 0.5711 (b=9973), 0.570495 (b=2310, primorial). Each finite-b sample is a correctly ' +
    'DISTINCT number from the limit -- neither a typo nor a drifted citation of it.',
  mechanism:
    'The normalized residual (F_arith(b) - kappa_arith phi(b) b)/(phi(b) b log b) decays toward 0 ' +
    'as b grows (imp-97122: O(log b / b) on a general-b ladder, markedly faster on a primorial-b ' +
    'ladder via Moebius divisor-sum cancellation) -- that decay IS why the finite-b samples ' +
    'approach but never equal the limit at any finite b. A reader must therefore expect, not ' +
    'flag as an error, a spread of near-0.5705 decimals across the cohort that are genuinely ' +
    'distinct from 0.5704960511308594.',
  verificationStatus:
    'Ladder samples re-cited verbatim from imp-97096 (source derivation) and cross-checked ' +
    'against imp-97130s b=2310 callout. Correction: the imp-97543 finding (5) example list named ' +
    'two decimals (0.570766, 0.5709852) that checked against source files are NOT Route-M ' +
    'F_arith(b)/(phi(b) b) samples at all -- 0.570766 is a Krein c_sharp lambda_min Ritz floor ' +
    'from an unrelated cohort, and 0.5709852 is a coincidental digit-substring inside an unrelated ' +
    'zero-ordinate literal. Corrected here rather than repeated; imp-97543s core citation-' +
    'consistency verdict is unaffected. No bound moved; NO QED; PT Lambda <= 0.2 remains SOTA; ' +
    'RH open.',
});

export const IMP97609_KAPPA_ARITH_LIMIT_VS_LADDER_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97609',
  proofSection: 'S-frontier',
  glosses: 'imp-97096',
  question:
    'imp-97543 finding (5) noted that near-0.5705 decimals scattered across the cohort are ' +
    'MEASURED finite-b ladder samples, not citations of the kappa_arith limit -- what is the ' +
    'headword distinguishing the two, and are the specific example decimals actually correct?',
  headword: KAPPA_ARITH_LIMIT_HEADWORD,
  genuineLadderSamples: IMP97609_GENUINE_LADDER_SAMPLES,
  misattributedExamples: IMP97609_MISATTRIBUTED_EXAMPLES,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the kappa_arith closed-form ' +
    'LIMIT 0.5704960511308594 (imp-97096) as distinct from the genuinely measured finite-b ' +
    'ladder samples that converge to it (0.5745/0.5716/0.5711/0.570495 at b=1201/5003/9973/2310). ' +
    'Corrects two of the three example decimals in imp-97543 finding (5) -- 0.570766 and ' +
    '0.5709852 belong to unrelated cohorts, not the Route-M ladder -- without altering imp-97543s ' +
    'core no-drift verdict on the constant itself. Establishes nothing new; moves no bound; ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97096 (the limit and the genuine ladder samples); imp-97122 (the certified convergence ' +
    'rate); imp-97124 (the limits own headword); imp-97543 (the audit whose example list this ' +
    'module corrects); imp-97130 (the b=2310 callout).',
});

export default IMP97609_KAPPA_ARITH_LIMIT_VS_LADDER_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97609_KAPPA_ARITH_LIMIT_VS_LADDER_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97609-headword-matches-source-limit',
    why: 'The headword must record the same exact limit value as imp-97096, not a re-typed ' +
      'approximation.',
    holds: () => Math.abs(IMP97096_KAPPA_ARITH - 0.5704960511308594) < 1e-12,
  },
  {
    id: 'imp97609-genuine-ladder-samples-strictly-distinct-from-limit',
    why: 'Every named finite-b ladder sample must be a genuinely distinct value from the limit ' +
      '(that is the entire point of the distinction), yet all within ~0.005 of it (same cohort).',
    holds: () =>
      IMP97609_GENUINE_LADDER_SAMPLES.every((s) => {
        const diff = Math.abs(s.value - IMP97096_KAPPA_ARITH);
        return diff > 1e-6 && diff < 0.005;
      }),
  },
  {
    id: 'imp97609-misattributed-examples-flagged-not-silently-repeated',
    why: 'The two imp-97543 example decimals that do not belong to the Route-M cohort must be ' +
      'explicitly recorded as misattributed, not silently re-cited as genuine ladder samples.',
    holds: () =>
      IMP97609_MISATTRIBUTED_EXAMPLES.length === 2 &&
      IMP97609_MISATTRIBUTED_EXAMPLES.every((m) => /imp-97/.test(m.actualSource) || /zeros-to-1e6/.test(m.actualSource)) &&
      !IMP97609_GENUINE_LADDER_SAMPLES.some((s) =>
        IMP97609_MISATTRIBUTED_EXAMPLES.some((m) => m.value === s.value),
      ),
  },
  {
    id: 'imp97609-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97096.',
    holds: () =>
      IMP97609_KAPPA_ARITH_LIMIT_VS_LADDER_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97609_KAPPA_ARITH_LIMIT_VS_LADDER_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97609_KAPPA_ARITH_LIMIT_VS_LADDER_GLOSSARY_HEADWORD.verdict) &&
      IMP97609_KAPPA_ARITH_LIMIT_VS_LADDER_GLOSSARY_HEADWORD.glosses === 'imp-97096',
  },
];

for (const assertion of IMP97609_KAPPA_ARITH_LIMIT_VS_LADDER_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97609-kappa-arith-limit-vs-measured-ladder-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
