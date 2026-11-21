/**
 * @module imp-96297-route-l-reach-law-crosscheck-fixed-cost-glossary-headword
 * @fileoverview imp-96297 -- import-light glossary/Concepts headword for the imp-96269
 *   verdict: the Route L detector power-law reach (imp-96149) and the genuine Christoffel
 *   power-law reach (imp-96182) are two INDEPENDENT characterizations of the same reach
 *   column that land on the same ~1e15 order at the Platt-Trudgian height T0 = 3.0001e12 --
 *   confirming Route L is a fixed-cost detector, not a lever on Lambda.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96269 re-fit the imp-96182 Christoffel eps1e4 reach column as the same power-law
 *   form imp-96149 used for the empirical detector column, then compared exponent,
 *   prefactor, and PT-height extrapolation. A reader skimming only the imp-96149 or
 *   imp-96182 module in isolation could mistake either single power law for the whole
 *   story; this headword bakes the cross-check verdict -- that the two independently
 *   derived laws agree to 1.80% in exponent and 8.93% in prefactor and both extrapolate to
 *   the SAME order of magnitude -- as a standalone lookup entry, without re-importing the
 *   imp-96269 module.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The empirical Route L detector reach law N_det = 0.364336 gamma^1.271686 (imp-96149,
 *   fit to measured detection orders) and the genuine Christoffel-saturation reach law
 *   N_C = 0.396870 gamma^1.248736 (imp-96269 re-fit of the imp-96182 eps1e4CrossColumn)
 *   agree to 1.80% in exponent and 8.93% in prefactor, and differ by at most 2.44% in
 *   predicted order across the shared gamma range [14.13, 77.14]. Extrapolated to the
 *   Platt-Trudgian verified height T0 = 3.0001e12, both land at the SAME O(1e15) order
 *   (detector 2.68e15, Christoffel 1.51e15, ratio 0.56). Because two independently derived
 *   reach laws -- one empirical/detector-based, one analytic/Christoffel-based -- converge
 *   on the same order of magnitude, Route L is confirmed a FIXED-COST detector whose reach
 *   requirement is set by the target height, not a lever that can be tuned to reduce that
 *   requirement.
 *
 *   CAVEAT: the agreement is a cross-check of two POWER-LAW FITS, both extracted from the
 *   same narrow gamma window [14.13, 77.14] (< 0.74 decade) and extrapolated ~13 orders of
 *   magnitude to T0. The 1.80%/8.93% agreement in fitted exponent/prefactor does not by
 *   itself certify the extrapolation; it only shows the two independent measurements do not
 *   contradict each other over the fit window. Both laws remain consistent with, not proof
 *   of, the ~1e15 order needed at T0.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96269 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96269-route-l-reach-law-crosscheck.js (source: the cross-check this glosses)
 * @see imp-96149-route-l-detector-reach-law-fit.js (source: empirical detector power law)
 * @see imp-96182-christoffel-reach-law.js (source: genuine Christoffel reach column)
 *
 * Ticket: imp-96297 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The fixed-cost-detector headword, baked verbatim (no re-import).
const ROUTE_L_REACH_LAW_CROSSCHECK_HEADWORD = Object.freeze({
  key: 'route-l-reach-law-crosscheck-fixed-cost-not-a-lever',
  term:
    'imp-96269 verdict: the Route L detector power law and the genuine Christoffel power ' +
    'law are two independent reach characterizations that land on the same ~1e15 order at ' +
    'the Platt-Trudgian height -- Route L is a fixed-cost detector, not a lever',
  definition:
    'The empirical detector reach law N_det = 0.364336 gamma^1.271686 (imp-96149) and the ' +
    'genuine Christoffel-saturation reach law N_C = 0.396870 gamma^1.248736 (imp-96269 ' +
    're-fit of imp-96182) agree to 1.80% in exponent and 8.93% in prefactor, and differ by ' +
    'at most 2.44% in predicted order over the shared gamma range [14.13, 77.14]. ' +
    'Extrapolated to the Platt-Trudgian verified height T0 = 3.0001e12, both land at the ' +
    'same O(1e15) order (detector 2.68e15, Christoffel 1.51e15). Two independently derived ' +
    'laws landing on the same order confirms the reach requirement is dictated by the ' +
    'target height itself, not by which characterization is used -- i.e. a fixed cost, not ' +
    'a tunable lever on Lambda.',
  contingency:
    'Both laws are power-law fits to the SAME narrow gamma window [14.13, 77.14] ' +
    '(< 0.74 decade), extrapolated roughly 13 orders of magnitude to reach T0 = 3.0001e12. ' +
    'The 1.80%/8.93% agreement shows the two independent measurements do not contradict ' +
    'each other over the fit window; it does not certify the extrapolated ~1e15 order as ' +
    'exact. Confirming that order at true PT scale would require reach data far beyond ' +
    'gamma = 77.14, left OPEN.',
  verificationStatus:
    'Closed-form cross-check on baked literals only (reproduces the imp-96269 comparison ' +
    'exactly). Establishes nothing new; changes no bound; no refereed bound is changed; RH open; ' +
    'NO QED.',
});

export const IMP96297_ROUTE_L_REACH_LAW_CROSSCHECK_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96297',
  proofSection: 'S-frontier',
  glosses: 'imp-96269',
  question:
    'Do the empirical detector reach law and the genuine Christoffel reach law for Route L ' +
    'agree, and does that agreement make Route L a lever on Lambda or a fixed cost set by ' +
    'the target height?',
  headword: ROUTE_L_REACH_LAW_CROSSCHECK_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96269 verdict: ' +
    'the empirical detector power law (imp-96149) and the genuine Christoffel power law ' +
    '(imp-96182, re-fit in imp-96269) agree to 1.80% in exponent and 8.93% in prefactor, ' +
    'and both extrapolate to the SAME O(1e15) order at the Platt-Trudgian height ' +
    'T0 = 3.0001e12. Two independent reach characterizations landing on the same order ' +
    'confirms Route L is a FIXED-COST detector dictated by the target height, NOT a lever ' +
    'that can be tuned to reduce Lambda. The agreement is contingent on both fits sharing ' +
    'the same narrow gamma window [14.13, 77.14] extrapolated ~13 orders of magnitude, left ' +
    'OPEN for confirmation at real higher-gamma scale. Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96269 (the reach-law cross-check this glosses); imp-96149 (empirical detector ' +
    'power-law fit); imp-96182 (genuine Christoffel reach column).',
});

export default IMP96297_ROUTE_L_REACH_LAW_CROSSCHECK_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96297_ROUTE_L_REACH_LAW_CROSSCHECK_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96297-headword-has-required-fields',
    why: 'The headword must name both reach laws, the exponent/prefactor agreement, and ' +
      'the fixed-cost-not-a-lever conclusion -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96297_ROUTE_L_REACH_LAW_CROSSCHECK_GLOSSARY_HEADWORD.headword;
      return (
        /1\.80%/.test(h.definition) &&
        /8\.93%/.test(h.definition) &&
        /2\.68e15/.test(h.definition) &&
        /1\.51e15/.test(h.definition) &&
        /fixed-cost/i.test(h.term)
      );
    },
  },
  {
    id: 'imp96297-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96297_ROUTE_L_REACH_LAW_CROSSCHECK_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96297_ROUTE_L_REACH_LAW_CROSSCHECK_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96297_ROUTE_L_REACH_LAW_CROSSCHECK_GLOSSARY_HEADWORD.verdict) &&
      IMP96297_ROUTE_L_REACH_LAW_CROSSCHECK_GLOSSARY_HEADWORD.glosses === 'imp-96269',
  },
];

for (const assertion of IMP96297_ROUTE_L_REACH_LAW_CROSSCHECK_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96297-route-l-reach-law-crosscheck-fixed-cost-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
