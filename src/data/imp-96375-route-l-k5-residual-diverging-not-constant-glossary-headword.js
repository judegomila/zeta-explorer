/**
 * @module imp-96375-route-l-k5-residual-diverging-not-constant-glossary-headword
 * @fileoverview imp-96375 -- import-light glossary/Concepts headword for the imp-96346
 *   verdict: the imp-96291 +1.430% k=5 Route L detector-vs-Christoffel residual is a
 *   slowly DIVERGING finite-gamma value (N_det/N_C = 0.918024 gamma^0.022950), not a
 *   constant asymptotic offset and not a vanishing term -- and the divergence verdict is
 *   contingent on the fitted exponent gap b_det - b_C = +0.02295 being real, not fit noise.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   Both the Route L detector reach law and the Christoffel node-counting reach law are
 *   pure power laws in gamma, so their ratio has the closed form
 *   d(gamma) = N_det/N_C - 1 = (A_det/A_C) gamma^(b_det - b_C) - 1. imp-96346 found that
 *   under the fitted literals this ratio does NOT settle to a constant as gamma grows: it
 *   SLOWLY DIVERGES (7.57% at gamma=1e3, 26.05% at gamma=1e6, 73.08% at gamma=1e12)
 *   because the two laws differ in fitted EXPONENT, not just amplitude. A reader who only
 *   sees the baked k=1..5 column (culminating in +1.430% at gamma_5=77.14) could easily
 *   mistake that value for a converged asymptotic offset; it is instead a snapshot of an
 *   unbounded, very slowly growing quantity. This headword bakes that distinction plus
 *   the honest caveat (the divergence direction rests on only 5 rows spanning <0.74
 *   decade) as a standalone lookup entry, without re-importing the imp-96346 module.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-96291 +1.430% k=5 Route L residual is NEITHER a constant asymptotic offset
 *   NOR a vanishing finite-gamma term. Because the detector law N_det = 0.364336
 *   gamma^1.271686 and the Christoffel law N_C = 0.396870 gamma^1.248736 differ in fitted
 *   exponent (b_det - b_C = +0.022950 > 0), their ratio d(gamma) = 0.918024
 *   gamma^0.022950 - 1 grows without bound as gamma -> infinity, only very slowly (a
 *   power of 0.02295). The +1.430% value is simply this diverging quantity evaluated at
 *   gamma_5 = 77.14, not a limit the two laws approach.
 *
 *   CAVEAT: the divergence verdict is contingent on the exponent gap being genuine. It is
 *   extracted from only 5 detector rows over gamma in [14.13, 77.14] (< 0.74 decade) and
 *   extrapolated ~11 decades; a gap of exactly 0 would flip the verdict to a constant
 *   -8.198% offset instead, and the finite-gamma sign/rate are sensitive to the gap's
 *   exact value even though the direction (+infinity for any gap > 0) is robust.
 *   Confirming the gap requires real higher-gamma detector rows, left OPEN by imp-96346.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96346 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96346-route-l-largegamma-residual-tail.js (source: the closed-form tail this glosses)
 * @see imp-96291-route-l-low-index-correction-test.js (source: sign-changing residual, k=5 = +1.430%)
 * @see imp-96269-route-l-reach-law-crosscheck.js (source power-law literals)
 *
 * Ticket: imp-96375 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The diverging-not-constant headword, baked verbatim (no re-import).
const ROUTE_L_K5_RESIDUAL_DIVERGING_HEADWORD = Object.freeze({
  key: 'route-l-k5-residual-slowly-diverging-not-constant-offset',
  term:
    'imp-96346 verdict: the imp-96291 +1.430% k=5 Route L detector-vs-Christoffel ' +
    'residual is a slowly DIVERGING finite-gamma value (N_det/N_C = 0.918024 ' +
    'gamma^0.022950), not a constant asymptotic offset nor a vanishing term',
  definition:
    'The Route L detector reach law N_det = 0.364336 gamma^1.271686 and the Christoffel ' +
    'reach law N_C = 0.396870 gamma^1.248736 are both pure power laws, so their ratio has ' +
    'the closed form d(gamma) = N_det/N_C - 1 = 0.918024 gamma^0.022950 - 1. Because the ' +
    'two laws differ in fitted EXPONENT (b_det - b_C = +0.02295 > 0), d(gamma) grows ' +
    'without bound as gamma -> infinity: 7.57% at gamma=1e3, 13.41% at gamma=1e4, 26.05% ' +
    'at gamma=1e6, 73.08% at gamma=1e12. The baked +1.430% at gamma_5=77.14 is just the ' +
    'value of this unbounded ratio at that point, not an asymptote.',
  contingency:
    'The verdict is contingent on the fitted exponent gap b_det - b_C = +0.02295 being ' +
    'genuine rather than fit noise: it comes from only 5 detector rows spanning gamma in ' +
    '[14.13, 77.14] (< 0.74 decade) extrapolated ~11 decades. Any gap in (0, 0.02] keeps ' +
    'the same +infinity limit but changes the finite-gamma sign and doubling scale by ' +
    'orders of magnitude, and a gap of exactly 0 flips the verdict to a constant -8.198% ' +
    'offset instead. Confirming the sign and magnitude of the gap requires real ' +
    'higher-gamma detector rows past gamma_5, left OPEN by imp-96346.',
  verificationStatus:
    'Closed-form extrapolation on baked literals only (reproduces the k=1..5 column ' +
    'exactly). Establishes nothing new; changes no bound; no refereed bound is changed; RH open; ' +
    'NO QED.',
});

export const IMP96375_ROUTE_L_K5_RESIDUAL_DIVERGING_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96375',
  proofSection: 'S-frontier',
  glosses: 'imp-96346',
  question:
    'Is the imp-96291 +1.430% k=5 Route L detector-vs-Christoffel residual a constant ' +
    'asymptotic offset, a vanishing finite-gamma term, or something else -- and how ' +
    'confident is that classification given the fitted-exponent uncertainty?',
  headword: ROUTE_L_K5_RESIDUAL_DIVERGING_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96346 verdict: ' +
    'the +1.430% k=5 residual is NEITHER a constant offset NOR a vanishing term but the ' +
    'value at gamma_5=77.14 of a slowly DIVERGING ratio N_det/N_C = 0.918024 ' +
    'gamma^0.022950, because the detector and Christoffel reach laws differ in fitted ' +
    'exponent. The classification is contingent on that exponent gap (+0.02295, from a ' +
    '<0.74-decade fit window) being real rather than noise -- a gap of exactly 0 would ' +
    'flip the verdict to a constant -8.198% offset -- so confirmation needs real ' +
    'higher-gamma detector rows, left OPEN. Establishes nothing; instantiates no ' +
    'interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-96346 (the closed-form residual-tail analysis this glosses); imp-96291 (source ' +
    'of the k=5 +1.430% residual); imp-96269 (the power-law literals for both reach laws).',
});

export default IMP96375_ROUTE_L_K5_RESIDUAL_DIVERGING_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96375_ROUTE_L_K5_RESIDUAL_DIVERGING_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96375-headword-has-required-fields',
    why: 'The headword must name the k=5 residual, the closed-form ratio, the divergence ' +
      'direction and the contingency on the exponent gap -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP96375_ROUTE_L_K5_RESIDUAL_DIVERGING_GLOSSARY_HEADWORD.headword;
      return (
        /1\.430/.test(h.definition) &&
        /0\.918024/.test(h.definition) &&
        /0\.022950/.test(h.definition) &&
        /diverg/i.test(h.term) &&
        /-8\.198/.test(h.contingency)
      );
    },
  },
  {
    id: 'imp96375-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96375_ROUTE_L_K5_RESIDUAL_DIVERGING_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96375_ROUTE_L_K5_RESIDUAL_DIVERGING_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96375_ROUTE_L_K5_RESIDUAL_DIVERGING_GLOSSARY_HEADWORD.verdict) &&
      IMP96375_ROUTE_L_K5_RESIDUAL_DIVERGING_GLOSSARY_HEADWORD.glosses === 'imp-96346',
  },
];

for (const assertion of IMP96375_ROUTE_L_K5_RESIDUAL_DIVERGING_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96375-route-l-k5-residual-diverging-not-constant-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
