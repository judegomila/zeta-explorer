/**
 * @module imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword
 * @fileoverview imp-96982 -- import-light glossary/Concepts headword for the imp-96912
 *   result: the OUT-OF-SAMPLE holdout over the exact 18-rung Vasyunin-Gram ||G||_F ladder
 *   favours the QUADRATIC Frobenius-norm concavity model locally (every rolling split and
 *   the decisive leave-top-2-out split), correcting the imp-96890 framing that the monotone
 *   +d/N form was the "safer" extrapolant -- while the far-field F-ceiling itself (a
 *   ~3.4-decade extrapolation to N ~ 4e7) stays unresolved between the two models.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96890 fitted three concave-in-log-N norm models to the exact 18-rung ladder and,
 *   on FAR-FIELD PHYSICAL grounds (the quadratic turns over unphysically at N ~ 2.31e9),
 *   called the monotone +d/N form the safer far extrapolant, without a data-driven
 *   discriminator. imp-96912 supplied that discriminator: an out-of-sample holdout
 *   (fit bottom m rungs, predict held-out top rungs, m = 12..17, plus a decisive
 *   leave-top-2-out split). The quadratic wins EVERY split by ~3.6x over +d/N and
 *   ~9-12x over a straight line. This headword bakes that verdict verbatim (no re-import
 *   of the imp-96912/imp-96890 modules, to stay import-light) as a standalone quick-lookup
 *   entry for a reader who might otherwise carry forward imp-96890's "safer" framing as if
 *   it were data-supported.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Fitting the two concave imp-96890 Frobenius-norm models on the bottom m of the 18 exact
 *   Vasyunin-Gram ||G||_F rungs and predicting the held-out top rungs, the QUADRATIC model
 *   (a + b logN + c (logN)^2) has the smallest out-of-sample RMS in all six rolling splits
 *   (m = 12..17) and in the decisive leave-top-2-out split (fit N=250..14000, predict the
 *   exact N=15000/16000 rungs: quad RMS 2.750e-3 vs +d/N RMS 1.020e-2 vs line RMS 3.189e-2).
 *   This CORRECTS imp-96890's framing that +d/N is the safer extrapolant: locally, the exact
 *   data favour the quadratic's curvature, not the monotone form. BUT this is a NEAR-FIELD
 *   result only (predicting rungs up to N=16000 from lower rungs); it is silent on the
 *   far-field ceiling scale N* ~ 4e7, a further ~3.4 decades out, where the quadratic
 *   eventually turns over unphysically (peak at N ~ 2.31e9) -- the physical caution against
 *   the quadratic at THAT scale still stands. So the two facts coexist: data-favoured
 *   locally = quadratic; ceiling scale still ambiguous = credible band between +1.37%
 *   (+d/N) and +8.36% (quadratic), tilted toward the upper part.
 *
 *   STATUS: a model-selection measurement (out-of-sample cross-validation), not a rigorous
 *   asymptotic derivation and not a resolution of the far-field ceiling ambiguity.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96912 verdict for quick reference. It
 *   establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   NO QED. No refereed bound is changed.
 *
 * @see imp-96912-route-m-frobenius-holdout-model-discriminator (source: the holdout this glosses)
 * @see imp-96890-route-m-frobenius-concave-norm-ceiling-refit (the three concave models + ceilings, "safer" framing corrected here)
 * @see imp-96751-route-m-frobenius-ladder-above-12000 (exact rungs N=13000..16000, part of the ladder)
 *
 * Ticket: imp-96982 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The holdout-favours-quadratic headword, baked verbatim (no re-import).
const FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_HEADWORD = Object.freeze({
  key: 'frobenius-holdout-favours-quadratic-locally-corrects-96890',
  term:
    'imp-96912 verdict: the exact-ladder out-of-sample holdout favours the QUADRATIC ' +
    'Frobenius-norm concavity model locally, correcting the imp-96890 "safer extrapolant" ' +
    'framing of the monotone +d/N form -- while the far-field F-ceiling ambiguity stays open',
  definition:
    'imp-96890 fitted a concave quadratic and a monotone +d/N model to the exact 18-rung ' +
    'Vasyunin-Gram ||G||_F ladder and called +d/N the "safer" far extrapolant on physical ' +
    'grounds alone (the quadratic turns over unphysically far out). imp-96912 ran an ' +
    'out-of-sample holdout instead: fit the bottom m rungs, predict the held-out top rungs. ' +
    'The QUADRATIC wins every one of the six rolling splits (m=12..17) and the decisive ' +
    'leave-top-2-out split (fit N=250..14000, predict exact N=15000/16000), beating +d/N by ' +
    '~3.6x and the line by ~9-12x in out-of-sample RMS. This corrects the impression that ' +
    '+d/N was data-favoured: locally, the exact data support the quadratic’s curvature. ' +
    'The far-field F-ceiling itself (a further ~3.4-decade extrapolation to N* ~ 4e7) remains ' +
    'unresolved between the two models -- the credible ceiling band stays between +1.37% ' +
    '(+d/N) and +8.36% (quadratic), tilted upward by the local evidence.',
  mechanism:
    'Leave-top-2-out (fit 250..14000, predict exact 15000/16000): quad RMS 2.750e-3 ' +
    '(pred 7.0949070/7.1208126 vs exact 7.097354059/7.123836045) versus +d/N RMS 1.020e-2 ' +
    '(pred 7.1066744/7.1348510) versus line RMS 3.189e-2 (pred 7.1273050/7.1575490). The ' +
    'same ordering (quad < tail < line) holds in every rolling split m=12..17. The all-18 ' +
    'refit ceilings are unchanged by the holdout (line N*=3.7865e7, +d/N N*=3.8384e7 = ' +
    '+1.369%, quad N*=4.1029e7 = +8.356%, both above the rigorous trace ceiling ' +
    'T=2.594e7): the holdout selects WHICH curve the exact data support near the top of the ' +
    'measured range, it does not move the ceilings themselves.',
  verificationStatus:
    'Model-selection measurement (out-of-sample cross-validation over the frozen 18-rung ' +
    'exact ladder), not a rigorous asymptotic derivation and not a resolution of the ' +
    'far-field (~3.4-decade) ceiling ambiguity. Fresh exact rungs beyond N=16000 remain ' +
    'compute-blocked (imp-96912 sub-gap). Changes no bound; trace ceiling T ~ 2.594e7 and ' +
    'the T<F<M ordering unaffected; no refereed bound is changed; RH open; NO QED.',
});

export const IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96982',
  proofSection: 'Route-M',
  glosses: 'imp-96912',
  corrects: 'imp-96890',
  question:
    'imp-96890 called the monotone +d/N Frobenius-norm model the "safer" far extrapolant ' +
    'on physical grounds alone. Does the exact 18-rung ladder’s own data support that ' +
    'choice, or the concave-quadratic alternative -- and does either resolve the far-field ' +
    'F-ceiling ambiguity?',
  headword: FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_HEADWORD,
  anyBoundMoved: false,
  farFieldCeilingResolved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96912 verdict: ' +
    'the out-of-sample holdout over the exact 18-rung ladder favours the QUADRATIC model in ' +
    'every rolling split and the decisive leave-top-2-out split, correcting imp-96890’s ' +
    '"safer extrapolant" framing of +d/N -- but this is a near-field result only, and the ' +
    'far-field F-ceiling ambiguity (credible band +1.37% to +8.36% vs the line ceiling) ' +
    'stays unresolved. Establishes nothing; instantiates no interval; moves no bound; ' +
    'NO QED. No refereed bound is changed.',
  citation:
    'imp-96912 (the holdout measurement and finding this glosses); imp-96890 (the three ' +
    'concave models, ceilings, and "safer extrapolant" framing corrected here); imp-96751 ' +
    '(exact rungs N=13000..16000, part of the frozen ladder).',
});

export default IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96982-headword-has-required-fields',
    why: 'The headword must name the holdout winner, the corrected imp-96890 framing, and ' +
      'the unresolved far-field ceiling ambiguity -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD.headword;
      return (
        /QUADRATIC/.test(h.definition) &&
        /2\.750e-3/.test(h.mechanism) &&
        /\+1\.37%/.test(h.definition) &&
        /\+8\.36%/.test(h.definition) &&
        /unresolved/.test(h.definition)
      );
    },
  },
  {
    id: 'imp96982-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, far-field ceiling not claimed resolved, ' +
      'no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD.farFieldCeilingResolved === false &&
      /NO QED/.test(IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD.verdict) &&
      IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD.glosses === 'imp-96912' &&
      IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD.corrects === 'imp-96890',
  },
];

for (const assertion of IMP96982_FROBENIUS_HOLDOUT_QUADRATIC_FAVOURED_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96982-frobenius-holdout-quadratic-favoured-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
