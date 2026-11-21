/**
 * @module imp-96480-route-m-lammax-glossary-headword
 * @fileoverview imp-96480 -- import-light glossary/Concepts headword for the imp-96443
 *   result: a direct power-iteration measurement of the Route M Vasyunin Gram top
 *   eigenvalue lam_max collapses the imp-96428 three-proxy conditioning bracket
 *   (O(1) / trace-O(log N) / O(N)) to a single measured law and a single
 *   double-precision Cholesky-breakdown ceiling N ~ 4.11e7.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96428 bounded the Vasyunin Gram double-precision Cholesky-breakdown ceiling
 *   only within a WIDE three-proxy bracket (pessimistic O(1) lam_max -> N ~ 1.31e8;
 *   trace/O(log N) lam_max -> N ~ 9.3e6; optimistic O(N) lam_max -> N ~ 2.16e5)
 *   because lam_max itself had never been recorded -- its named sub-gap
 *   (imp-96428-lammax-unrecorded) asked for a direct top-eigenvalue measurement.
 *   imp-96443 supplied it: power iteration on G[:N,:N] over N=250..6000 (cross-checked
 *   vs eigvalsh to ~1e-14), fit lam_max = 3.0247 + 0.3526 log N (R^2 = 0.9954). This
 *   headword bakes that verbatim (no re-import of the imp-96443/imp-96428 modules,
 *   to stay import-light) as a standalone quick-lookup entry for a reader who wants
 *   the headline: the bracket collapses to ONE ceiling, N ~ 4.11e7.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The measured lam_max grows logarithmically, not linearly and not constant:
 *   4.9302 at N=250 up to 6.0620 at N=6000, fit lam_max = 3.0247 + 0.3526 log N. The
 *   fit slope (0.3526) is far below the trace slope I(1,1) = 1.2607, ruling out the
 *   trace proxy's coefficient (though not its log-shape), and the 20% spread over the
 *   ladder rules out the O(1) proxy. Combining this fit with the imp-96428 lam_min
 *   power law gives a single re-derived conditioning ceiling N ~ 4.11e7 -- between
 *   the trace proxy (9.3e6) and the optimistic proxy (1.31e8), about 4.4x the trace
 *   bound. This sits ~4100x above the imp-96352 wall-clock compute ceiling N ~ 9916,
 *   so the imp-96428 verdict is UNCHANGED and sharpened: conditioning does not cap
 *   the reachable range; compute/wall-clock binds first by more than three orders of
 *   magnitude.
 *
 *   STATUS: a measurement (power-iteration eigenvalue, cross-checked against
 *   eigvalsh) plus a re-derivation of the conditioning ceiling from that measurement;
 *   not a rigorous asymptotic proof of the log-growth law's coefficients.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96443 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no bound. NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-96443-route-m-vasyunin-lammax-measured (source: the measurement this glosses)
 * @see imp-96428-route-m-vasyunin-lammin-conditioning-ceiling (the three-proxy bracket this collapses)
 * @see imp-96352-route-m-vasyunin-solve-cost-model (the N^3 wall-clock compute ceiling ~9916)
 *
 * Ticket: imp-96480 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The measured-lam_max headword, baked verbatim (no re-import).
const ROUTE_M_LAMMAX_HEADWORD = Object.freeze({
  key: 'route-m-vasyunin-lammax-measured-collapses-three-proxy-bracket',
  term:
    'imp-96443 verdict: the measured Route M Vasyunin Gram lam_max = 3.0247 + 0.3526 ' +
    'log N collapses the imp-96428 three-proxy conditioning bracket to a single ' +
    'ceiling N ~ 4.11e7',
  definition:
    'imp-96428 bounded the double-precision Cholesky-breakdown ceiling of the Route M ' +
    'Vasyunin Gram only within a wide three-proxy bracket (N ~ 2.16e5 pessimistic, ' +
    'N ~ 9.3e6 trace-family, N ~ 1.31e8 optimistic) because lam_max was never directly ' +
    'measured. imp-96443 measured it by power iteration over N=250..6000 (cross-checked ' +
    'vs eigvalsh to ~1e-14), fitting lam_max = 3.0247 + 0.3526 log N (R^2 = 0.9954). ' +
    'Combined with the imp-96428 lam_min power law, this collapses the bracket to a ' +
    'single re-derived ceiling N ~ 4.11e7, between the trace proxy (9.3e6) and the ' +
    'optimistic proxy (1.31e8).',
  mechanism:
    'The measured lam_max grows logarithmically (4.9302 at N=250 to 6.0620 at N=6000), ' +
    'ruling out both the O(N) pessimistic proxy (20% spread over the ladder is far too ' +
    'flat for linear growth) and the O(1) optimistic proxy (lam_max is not constant). ' +
    'The fit slope 0.3526 is well below the trace slope I(1,1) = 1.2607, so the ' +
    'trace-family log-SHAPE was right but its coefficient overstated lam_max. Re-solving ' +
    'cond#(N) = lam_max(N)/lam_min(N) = 1/eps with the measured log-fit in place of the ' +
    'three proxies gives N ~ 4.11e7 (~4.4x the trace-proxy ceiling), which remains ' +
    '~4100x above the imp-96352 wall-clock compute ceiling N ~ 9916 -- so conditioning ' +
    'still does not cap the reachable range; compute binds first.',
  verificationStatus:
    'Measurement (power-iteration eigenvalue, cross-checked against eigvalsh to ~1e-14) ' +
    'plus a re-derivation of the conditioning ceiling from that measurement, not a ' +
    'rigorous asymptotic proof of the log-growth coefficients. Changes no bound; ' +
    'establishes no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96480_ROUTE_M_LAMMAX_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96480',
  proofSection: 'S-frontier',
  glosses: 'imp-96443',
  question:
    'imp-96428 bracketed the Route M Vasyunin Gram conditioning ceiling within a wide ' +
    'three-proxy range because lam_max had never been directly measured. What is the ' +
    'measured lam_max(N), and does it collapse the bracket to a single ceiling?',
  headword: ROUTE_M_LAMMAX_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96443 ' +
    'verdict: the measured lam_max = 3.0247 + 0.3526 log N collapses the imp-96428 ' +
    'three-proxy bracket to a single conditioning ceiling N ~ 4.11e7, closing the ' +
    'imp-96428-lammax-unrecorded sub-gap. Compute (N ~ 9916, imp-96352) still binds ' +
    'first by ~4100x, so the imp-96428 conclusion is unchanged and sharpened. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96443 (the measurement and finding this glosses); imp-96428 (the three-proxy ' +
    'bracket collapsed here); imp-96352 (the N ~ 9916 wall-clock compute ceiling).',
});

export default IMP96480_ROUTE_M_LAMMAX_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96480_ROUTE_M_LAMMAX_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96480-headword-has-required-fields',
    why: 'The headword must name the measured log-fit, the collapsed ceiling, and the ' +
      'sub-gap it closes -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96480_ROUTE_M_LAMMAX_GLOSSARY_HEADWORD.headword;
      return (
        /3\.0247 \+ 0\.3526/.test(h.term) &&
        /4\.11e7/.test(h.term) &&
        /9\.3e6/.test(h.definition) &&
        /1\.31e8/.test(h.definition) &&
        /R\^2 = 0\.9954/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96480-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96480_ROUTE_M_LAMMAX_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96480_ROUTE_M_LAMMAX_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96480_ROUTE_M_LAMMAX_GLOSSARY_HEADWORD.verdict) &&
      IMP96480_ROUTE_M_LAMMAX_GLOSSARY_HEADWORD.glosses === 'imp-96443',
  },
];

for (const assertion of IMP96480_ROUTE_M_LAMMAX_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96480-route-m-lammax-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
