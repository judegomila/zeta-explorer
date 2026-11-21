/**
 * @module imp-96574-spd-trace-domination-log-shape-glossary-headword
 * @fileoverview imp-96574 -- import-light glossary/Concepts headword for the imp-96548
 *   result: the Route M Vasyunin Gram lam_max(N) has a RIGOROUS, unconditional
 *   log-SHAPE upper bound lam_max(N) <= I(1,1) H_N = 1.2607 (log N + gamma) + O(1/N)
 *   from SPD trace domination alone, but that bound does NOT reproduce the measured
 *   growth COEFFICIENT 0.3526 -- the rigorous slope 1.2607 is ~3.6x too large.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96443/imp-96480 recorded lam_max(N) = 3.0247 + 0.3526 log N purely as a
 *   MEASUREMENT, explicitly not a rigorous proof of the log-growth coefficients.
 *   imp-96548 asked whether a rigorous asymptotic upper bound could replace that
 *   fit and confirm the imp-96443 N ~ 4.11e7 conditioning ceiling. This headword
 *   bakes the verbatim verdict (no re-import of the imp-96548 module, to stay
 *   import-light) as a standalone quick-lookup entry for a reader who wants the
 *   headline distinction: a rigorous bound EXISTS and CONFIRMS the ceiling, but it
 *   is not tight -- the measured coefficient stays open.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   G_N (the Route M Vasyunin Gram matrix) is symmetric positive semidefinite, so
 *   its largest eigenvalue is bounded by its trace: lam_max(N) <= trace(G_N) =
 *   I(1,1) H_N = 1.2607 (log N + gamma) + O(1/N), an elementary bound using nothing
 *   about zeta beyond the diagonal integral I(1,1) = 1.2607. This is unconditional
 *   and rigorous. It does NOT reproduce the measured slope: the rigorous trace
 *   slope 1.2607 is ~3.6x the measured 0.3526 (at N = 6000 trace domination gives
 *   lam_max <= 11.69 versus the measured ~6.09, a ~1.92x overstatement). The slack
 *   is the off-diagonal Gram mass that trace domination discards entirely; pinning
 *   the measured 0.3526 rigorously needs a Toeplitz/Szego-type limiting-spectrum
 *   asymptotic of the multiplicative kernel gcd(h,k) I(h/g,k/g) / (hk), which is not
 *   available (open sub-gap: imp-96548-lammax-coefficient-offdiagonal-mass).
 *
 *   THE BOUND STILL CONFIRMS THE CEILING
 *   -----------------------------------------------
 *   Despite not being tight, the rigorous bound is enough to confirm the
 *   conditioning ceiling: substituting it into cond#(N) = lam_max/lam_min = 1/eps
 *   (with lam_min ~ A N^-p) moves the ceiling only from N ~ 4.11e7 (measured-fit)
 *   to N ~ 2.59e7 (rigorous), a factor 1.58 shift. Both figures sit ~2600x above
 *   the imp-96352 compute ceiling N ~ 9916, so conditioning does not cap and
 *   compute binds first -- now established rigorously in lam_max, not just by fit.
 *
 *   STATUS: a rigorous log-SHAPE bound plus a confirmed compute-first ceiling; the
 *   log-COEFFICIENT (0.3526) remains an unproven measurement.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96548 verdict for quick reference. It
 *   establishes nothing new, instantiates no interval, closes no sub-gap, moves no
 *   bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96548-route-m-lammax-rigorous-upper-bound-assessment (source: the assessment this glosses)
 * @see imp-96443-route-m-lammax-measured-fit (the measured 3.0247 + 0.3526 log N fit)
 * @see imp-96562-route-m-lammax-offdiagonal-szego-assessment (the residual off-diagonal-mass sub-gap)
 * @see imp-96352 (compute ceiling N ~ 9916 that binds before conditioning)
 * @see imp-96696-route-m-value-ratio-vs-ceiling-ratio-per-rung (the VALUE ratio 1.92x is itself
 *   N-varying, not universal: it rises from ~1.546 at N=250 toward an asymptote ~3.575 as
 *   N -> infinity, and crosses the DISTINCT 1.58 ceiling-ratio scalar near N ~ 327)
 *
 * Ticket: imp-96574 (content, low), reconciled by imp-96724 (content, medium). Documentation
 * only; establishes nothing; NO QED; no refereed bound is changed.
 */

// The SPD trace-domination log-shape headword, baked verbatim (no re-import).
const SPD_TRACE_DOMINATION_LOG_SHAPE_HEADWORD = Object.freeze({
  key: 'spd-trace-domination-lammax-log-shape-bound',
  term:
    'imp-96548 verdict: SPD trace domination gives a RIGOROUS log-shape upper bound ' +
    'lam_max(N) <= I(1,1) H_N = 1.2607 log N + O(1), but does NOT pin the measured ' +
    '0.3526 slope',
  definition:
    'The Route M Vasyunin Gram G_N is symmetric positive semidefinite, so ' +
    'lam_max(N) <= trace(G_N) = I(1,1) H_N = 1.2607 (log N + gamma) + O(1/N), an ' +
    'elementary and unconditional bound. This CONFIRMS the log-shape growth of the ' +
    'imp-96443 measured fit lam_max(N) = 3.0247 + 0.3526 log N, but the rigorous ' +
    'slope 1.2607 is ~3.6x the measured slope 0.3526 -- it is a real but loose bound, ' +
    'not a derivation of the measured coefficient.',
  mechanism:
    'The gap between the rigorous trace bound and the measured value is the ' +
    'off-diagonal Gram mass, which trace domination discards entirely (trace only ' +
    'sums diagonal entries). At N = 6000, trace domination gives lam_max <= 11.69 ' +
    'versus the measured ~6.09 (a ~1.92x overstatement). Pinning the measured ' +
    '0.3526 slope rigorously would require a Toeplitz/Szego-type limiting-spectrum ' +
    'asymptotic for the multiplicative kernel gcd(h,k) I(h/g,k/g) / (hk), which is ' +
    'not available -- left as an open sub-gap.',
  ceilingConsequence:
    'Substituting the rigorous bound into cond#(N) = lam_max/lam_min = 1/eps (with ' +
    'lam_min ~ A N^-p from imp-96428) moves the conditioning ceiling only from ' +
    'N ~ 4.11e7 (measured-fit) to N ~ 2.59e7 (rigorous), a factor 1.58 shift. Both ' +
    'sit ~2600x above the imp-96352 compute ceiling N ~ 9916, so conditioning does ' +
    'not cap and compute binds first -- now rigorous in lam_max.',
  valueRatioIsNVarying:
    'The ~1.92x figure above is the VALUE ratio rigorous(N)/measured(N) evaluated at ' +
    'the top accessible rung N=6000 ONLY -- imp-96696 found it is not a universal ' +
    'constant but a monotone-increasing curve, ~1.546 at N=250 rising toward the ' +
    'asymptote I(1,1)/0.3526 ~= 3.575 as N -> infinity. It numerically crosses the ' +
    'DISTINCT 1.58 ceiling-ratio scalar near N ~ 327, inside the accessible ladder, so ' +
    'the value ratio must always be quoted at a specific N (canonically N=6000), never ' +
    'as a universal multiplier.',
  verificationStatus:
    'A rigorous, unconditional log-shape bound and a confirmed compute-first ' +
    'ceiling; the log-coefficient (0.3526) remains an unproven measurement, not a ' +
    'rigorous derivation. Changes no bound beyond the ceiling shift above; ' +
    'establishes no operator positivity; RH open; NO QED; no refereed bound is changed' +
    '.',
});

export const IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96574',
  proofSection: 'S-frontier',
  glosses: 'imp-96548',
  question:
    'imp-96443/imp-96480 recorded lam_max(N) = 3.0247 + 0.3526 log N as a fit, not a ' +
    'proof. Does a rigorous asymptotic upper bound exist that reproduces the ' +
    'measured log-growth coefficient and confirms the N ~ 4.11e7 conditioning ' +
    'ceiling?',
  headword: SPD_TRACE_DOMINATION_LOG_SHAPE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96548 ' +
    'verdict: SPD trace domination gives a rigorous, unconditional log-shape bound ' +
    'lam_max(N) <= I(1,1) H_N = 1.2607 log N + O(1), which confirms the conditioning ' +
    'ceiling is compute-bound (N ~ 2.59e7 rigorous vs N ~ 4.11e7 measured-fit, both ' +
    '~2600x above the imp-96352 compute ceiling), but does NOT reproduce the ' +
    'measured 0.3526 slope -- the coefficient stays an open sub-gap. Establishes ' +
    'nothing new; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96548 (the rigorous trace-domination assessment and finding this glosses); ' +
    'imp-96443/imp-96480 (the measured 3.0247 + 0.3526 log N fit); imp-96562 (the ' +
    'residual off-diagonal-mass sub-gap on the coefficient); imp-96352 (the compute ' +
    'ceiling N ~ 9916 that binds first); imp-96696 (the value ratio is an N-varying ' +
    'curve, not a universal ~1.9x, and crosses the 1.58 ceiling ratio near N ~ 327).',
});

export default IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96574-headword-has-required-fields',
    why: 'The headword must name the rigorous trace slope 1.2607, the measured slope ' +
      '0.3526, and the ~3.6x gap between them -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD.headword;
      return (
        /1\.2607/.test(h.definition) &&
        /0\.3526/.test(h.definition) &&
        /~3\.6x/.test(h.definition) &&
        /2\.59e7/.test(h.ceilingConsequence) &&
        /4\.11e7/.test(h.ceilingConsequence)
      );
    },
  },
  {
    id: 'imp96574-value-ratio-is-n-varying-imp96724',
    why: 'imp-96696 found the ~1.92x value ratio is N-varying (not universal) and crosses ' +
      'the distinct 1.58 ceiling ratio near N ~ 327 -- the headword must reflect that ' +
      'reconciliation (imp-96724), not just the top-rung 1.92x figure.',
    holds: () => {
      const h = IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD.headword;
      return (
        typeof h.valueRatioIsNVarying === 'string' &&
        /1\.546/.test(h.valueRatioIsNVarying) &&
        /3\.575/.test(h.valueRatioIsNVarying) &&
        /327/.test(h.valueRatioIsNVarying) &&
        /imp-96696/.test(IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD.citation)
      );
    },
  },
  {
    id: 'imp96574-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD.verdict) &&
      IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD.glosses === 'imp-96548',
  },
];

for (const assertion of IMP96574_SPD_TRACE_DOMINATION_LOG_SHAPE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96574-spd-trace-domination-log-shape-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
