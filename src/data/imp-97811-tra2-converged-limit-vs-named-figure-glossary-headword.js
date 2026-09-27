/**
 * @module imp-97811-tra2-converged-limit-vs-named-figure-glossary-headword
 * @fileoverview imp-97811 -- import-light glossary/Concepts headword distinguishing the two
 *   tr(A2) numbers that recur across the Krein Route-2 K_big cohort: the CONVERGED fit-based
 *   trace limit ~4818.77M (imp-97517/97582/97599/97641/97684, stable algebraic exponent
 *   p ~ 1.980) versus the imp-97482 ~4819.1M figure, which imp-97797 traced to a prose-only,
 *   pre-fit EYEBALL round-number label inherited from imp-97455 -- never a computed export of
 *   imp-97482, and superseded by the converged limit.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) TWO DIFFERENT THINGS, SAME ANCHOR. Both figures extrapolate from the same
 *   highest directly-built entry, tr(A2)(Kbig=260) = 4818631331.255102 (~4818.63M). The named
 *   ~4819.1M is imp-97455's EYEBALL read of the collapsing K_big deltas (0.183M -> 0.094M ->
 *   0.055M), taken before any exponent fit and inherited verbatim into imp-97482's prose (4
 *   comment occurrences: @fileoverview, A2_TRACE_BY_KBIG comment, FLOOR.summary, VERDICT.why --
 *   never the value of an exported field). The ~4818.77M is the CONVERGED geometric/Aitken
 *   limit on the newest uniform ratio trio (algebraic fit agrees to Kbig~4302, p ~ 1.980).
 *   (b) THE GAP IS TAIL OVERSHOOT, NOT A DEFECT. eyeball tail above K260 ~ 0.469M vs fit tail
 *   ~0.138M; the difference ~0.331M (relative 6.86e-5) is exactly the imp-97684 measured
 *   gapGeomToNamed -- the eyeball overstates the residual tail by ~3.4x. Nothing in the
 *   imp-97482 build is imprecise; the discrepancy is a pre-fit narration artifact.
 *   (c) RECLASSIFICATION. imp-97797 downgrades imp-97482's ~4819.1M from an implied converged
 *   reproducing-kernel trace limit to a PRE-FIT EYEBALL ROUND-NUMBER NARRATION LABEL, superseded
 *   by ~4818.77M. The stable p ~ 1.980 exponent rules out any convergent tail reaching 4819.1M.
 *   No downstream export depends on the named label.
 *   (d) STATUS: documentation only. The imp-97538 lambda_2 floor is untouched; this is a
 *   labelling correction on a diagnostic trace, not a numerics or bound change.
 *
 *   STATUS: documentation only -- a Concepts glossary headword distinguishing the converged
 *   trace limit from the imp-97482 bookkeeping figure. Not a proof, not a new bound. NO QED.
 *
 * @see imp-97797-tra2-named-figure-reclassification.js (source reclassification and origin
 *   diagnosis this headword names)
 * @see imp-97482-krein-route2-kbig-direct-projector-floor.js (source of the ~4819.1M prose label)
 * @see imp-97684-tra2-fifth-block-tail-confirmation.js (converged ~4818.77M limit + measured gap)
 * @see imp-97649-tra2-trace-tail-algebraic-honest-status.js (prior algebraic-tail status note)
 *
 * Ticket: imp-97811 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The converged-limit-vs-named-figure headword, baked verbatim (no re-import).
const TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_HEADWORD = Object.freeze({
  key: 'tra2-converged-limit-vs-named-figure-imp97797',
  term:
    'tr(A2) converged trace limit (~4818.77M) vs the imp-97482 named figure (~4819.1M): the ' +
    'former is a fit-based geometric/Aitken extrapolation (p ~ 1.980), the latter is a ' +
    'prose-only, pre-fit eyeball round number inherited from imp-97455 and superseded by the ' +
    'converged limit (imp-97797)',
  definition:
    'Both figures extrapolate the same anchor tr(A2)(Kbig=260) = 4818631331.255102. The named ' +
    '~4819.1M reads the collapsing K_big deltas (0.183M -> 0.094M -> 0.055M) by eye, before any ' +
    'exponent fit, and occurs only in imp-97482 prose comments -- never as a computed ' +
    'extrapolator output. The converged ~4818.77M is the geometric/Aitken limit on the newest ' +
    'uniform ratio trio, with the algebraic fit (p ~ 1.980) agreeing to Kbig ~ 4302. The gap ' +
    'between them (~0.331M, relative 6.86e-5) equals the eyeball tail-sum overshoot above ' +
    'Kbig=260: eyeball tail ~0.469M vs fit tail ~0.138M, an overstatement factor of ~3.4x.',
  mechanism:
    'imp-97455 named ~4819.1M by eyeballing the shrinking K_big deltas before any convergence ' +
    'model was fit; imp-97482 inherited that label verbatim into its own prose without ' +
    'recomputing it. Later landmarks (imp-97517/97582/97599/97641/97684) fit a stable algebraic ' +
    'tail exponent p ~ 1.980 and converge the geometric/Aitken limit to ~4818.77M -- a value the ' +
    'named 4819.1M cannot reach under that exponent. Because the named figure never became an ' +
    'exported value, no downstream consumer of imp-97482 depends on it; only the prose label ' +
    'needs reclassifying.',
  verificationStatus:
    'Re-cited from the imp-97797 reclassification module ' +
    '(src/data/imp-97797-tra2-named-figure-reclassification.js), which audited imp-97482 line by ' +
    'line (4 prose occurrences, 0 exported occurrences) and cross-checked the ~0.331M gap ' +
    'against the imp-97684 measured gapGeomToNamed. Naming / glossary headword only; supplies ' +
    'no new bound; the imp-97538 lambda_2 floor is untouched; no bound moved; RH open; ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP97811_TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97811',
  proofSection: 'S-frontier',
  glosses: 'imp-97797',
  question:
    'imp-97797 traced the imp-97482 ~4819.1M figure to a prose-only pre-fit eyeball label, ' +
    'distinct from the converged ~4818.77M fit-based trace limit. What is the glossary headword ' +
    'distinguishing the two, and does it move any bound?',
  headword: TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Distinguishes the CONVERGED ' +
    'fit-based tr(A2) trace limit (~4818.77M, geometric/Aitken, p ~ 1.980) from the imp-97482 ' +
    'NAMED figure (~4819.1M), which is a prose-only pre-fit eyeball round number inherited from ' +
    'imp-97455, never a computed export, and superseded by the converged limit per imp-97797. ' +
    'The ~0.331M gap between them is the eyeball tail-sum overshoot above Kbig=260 (~3.4x), not ' +
    'a precision defect. No bound moved; the imp-97538 lambda_2 floor is untouched; NO QED; ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97797 (the reclassification and origin diagnosis this glosses); imp-97482 (source of ' +
    'the ~4819.1M prose label); imp-97684 (converged ~4818.77M limit and measured gap); ' +
    'imp-97649 (prior algebraic-tail status note).',
});

export default IMP97811_TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97811_TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97811-headword-cites-both-figures',
    why: 'The headword must name both the converged ~4818.77M limit and the imp-97482 named ' +
      '~4819.1M figure -- the entire point of the distinguishing glossary entry.',
    holds: () => {
      const h = IMP97811_TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_GLOSSARY_HEADWORD.headword;
      return (
        /4818\.77M/.test(h.term) &&
        /4819\.1M/.test(h.term) &&
        /4818631331\.255102/.test(h.definition) &&
        /6\.86e-5/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97811-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present.',
    holds: () =>
      IMP97811_TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97811_TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97811_TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_GLOSSARY_HEADWORD.verdict) &&
      IMP97811_TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_GLOSSARY_HEADWORD.glosses === 'imp-97797',
  },
];

for (const assertion of IMP97811_TRA2_CONVERGED_LIMIT_VS_NAMED_FIGURE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97811-tra2-converged-limit-vs-named-figure-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
