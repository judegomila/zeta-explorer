/**
 * @module imp-96394-route-l-reach-correction-incompatible-siblings-glossary-headword
 * @fileoverview imp-96394 -- import-light glossary/Concepts headword for the imp-96368
 *   cross-validation: the imp-96347 correction factor C = 1.6812 (quoted as if it were a
 *   single curvature-correction number) is actually the RATIO of two mutually incompatible
 *   sibling reach laws for the Route L detector -- a fixed-power law (imp-96346, constant
 *   exponent b_det = 1.271686) and a quadratic-in-log law (imp-96347, unboundedly-running
 *   exponent b_eff = a1 + 2 a2 ln gamma). They agree only inside the shared five-point fit
 *   window (gamma in [14.13, 77.14], ratio in [0.889, 1.157]) -- crossing exactly once at the
 *   window centre gamma ~ 32.6, where the power law is the chord of the quadratic -- and
 *   diverge without bound outside it: already 1.68x apart at zero 40 (gamma ~ 123, which is
 *   exactly the imp-96347 factor C = 1.6812) and 64.6x at gamma = 1e3.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96368 did the actual cross-validation arithmetic (imp-96368-route-l-reach-quad-vs-
 *   power-crossvalidation.js), but nothing states the one-line correction: "C = 1.6812" is
 *   not a physical correction constant, it is the disagreement ratio between two models that
 *   only look alike because they are both pinned to the same calibration data. A reader who
 *   sees imp-96347s C-factor without this context could mistake it for a converged number.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-96347 "correction factor" C = 1.6812 is the ratio N_quad/N_pow at zero 40
 *   (gamma_40 = 122.9468) between two sibling Route L reach extrapolations fit to the SAME
 *   five detected zeros (gamma in [14.13, 77.14]): a fixed power law N_pow = A*gamma^b
 *   (b_det = 1.271686, imp-96346) and a quadratic-in-log law N_quad = exp(a0+a1L+a2L^2) with
 *   L = ln gamma and a RUNNING exponent b_eff(gamma) = a1 + 2*a2*L (imp-96347). The two
 *   models agree to within ~15% only inside the fit window, crossing exactly once at
 *   gamma ~ 32.6 (the window centre) because a power law is the chord of a quadratic through
 *   any three points -- so in-window agreement is a structural artifact of the fitting
 *   geometry, not independent confirmation. Outside the window they are incompatible by
 *   construction: b_det is constant while b_eff grows without bound, so the ratio explodes
 *   (64.6x at gamma=1e3, 1.46e5x at gamma=1e4, 5.8e92x at gamma=1e12).
 *
 *   MECHANISM: a fixed-exponent model and a running-exponent model calibrated on the same
 *   short window (< 0.74 decade in gamma) will always agree near the window centre and
 *   diverge outside it -- that is a property of curve-fitting on a short baseline, not
 *   evidence that either extrapolation is closer to the true asymptotic reach. Only real
 *   detector rows past k=20 / gamma_5=77.14 can decide fixed vs running exponent.
 *
 *   STATUS: documentation glossing an accuracy cross-check on baked literals. No bound moved.
 *
 * @see imp-96368-route-l-reach-quad-vs-power-crossvalidation (source: the cross-validation this glosses)
 * @see imp-96347-detector-reach-curvature-correction (IMP96347_CURVATURE_CORRECTION, the quadratic-in-log law and C=1.6812)
 * @see imp-96346-route-l-largegamma-residual-tail (IMP96346_LARGEGAMMA_RESIDUAL_TAIL, the fixed power law)
 *
 * Ticket: imp-96394 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The incompatible-siblings headword, baked verbatim (no re-import).
const ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_HEADWORD = Object.freeze({
  key: 'route-l-reach-correction-factor-is-sibling-disagreement-not-a-constant',
  term:
    'imp-96368 verdict: the imp-96347 Route L reach "correction factor" C=1.6812 is the ' +
    'disagreement ratio between two incompatible sibling reach laws, not a converged constant',
  definition:
    'C = 1.6812 is N_quad/N_pow at zero 40 (gamma=122.9468) between the imp-96346 fixed power ' +
    'law N_pow = A*gamma^b (b_det=1.271686) and the imp-96347 quadratic-in-log law N_quad = ' +
    'exp(a0+a1*L+a2*L^2), L=ln gamma, whose local exponent b_eff(gamma)=a1+2*a2*L runs without ' +
    'bound. Both are fit to the SAME five detected zeros (gamma in [14.13, 77.14]) and agree to ' +
    'only ~15% (ratio in [0.889, 1.157]) inside that window, crossing exactly once at the window ' +
    'centre gamma~32.64. Outside the window they diverge without bound: 1.68x at zero 40, 64.6x ' +
    'at gamma=1e3, 1.46e5x at gamma=1e4, 5.8e92x at gamma=1e12.',
  mechanism:
    'A fixed-exponent power law is the chord of a curving quadratic-in-log law through any short ' +
    'baseline -- the two are pinned to the same calibration data, so they must agree near the ' +
    'window centre and are free to diverge outside it. In-window agreement is therefore a ' +
    'structural artifact of fitting a short window (<0.74 decade in gamma), not evidence that ' +
    'either extrapolation tracks the true asymptotic Route L reach.',
  verificationStatus:
    'Accuracy cross-check on baked literals only (imp-96368). Changes no bound; verified-zero ' +
    'route stays cheaper; the sibling laws share one open sub-gap -- only real detector rows ' +
    'past k=20 / gamma_5=77.14 can decide fixed-exponent vs running-exponent reach. RH open; ' +
    'no refereed bound is changed; NO QED.',
});

export const IMP96394_ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96394',
  proofSection: 'S-frontier',
  glosses: 'imp-96368',
  question:
    'imp-96347 quotes a Route L reach correction factor C=1.6812. Is that a converged ' +
    'physical constant, or an artifact of comparing two sibling extrapolation models?',
  headword: ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96368 verdict: ' +
    'C=1.6812 is the ratio between two Route L reach models -- a fixed power law (imp-96346) ' +
    'and a running-exponent quadratic-in-log law (imp-96347) -- that agree only inside their ' +
    'shared five-point fit window (gamma 14..77, ~15% agreement, crossing once at gamma~32.6) ' +
    'and diverge without bound outside it (1.68x at zero 40, 64.6x at gamma=1e3). Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96368 (the cross-validation this glosses); imp-96347 (the quadratic-in-log law and ' +
    'C=1.6812); imp-96346 (the fixed power law and b_det=1.271686).',
});

export default IMP96394_ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96394_ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96394-headword-has-required-fields',
    why: 'The headword must name the correction factor, both sibling models, the crossover ' +
      'height, and the far-field divergence -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96394_ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_GLOSSARY_HEADWORD.headword;
      return (
        /1\.6812/.test(h.definition) &&
        /32\.64/.test(h.definition) &&
        /64\.6x/.test(h.definition) &&
        /b_det=1\.271686/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96394-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96394_ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96394_ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96394_ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_GLOSSARY_HEADWORD.verdict) &&
      IMP96394_ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_GLOSSARY_HEADWORD.glosses === 'imp-96368',
  },
];

for (const assertion of IMP96394_ROUTE_L_REACH_CORRECTION_INCOMPATIBLE_SIBLINGS_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96394-route-l-reach-correction-incompatible-siblings-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
