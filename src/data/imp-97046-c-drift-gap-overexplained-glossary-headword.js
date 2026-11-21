/**
 * @module imp-97046-c-drift-gap-overexplained-glossary-headword
 * @fileoverview imp-97046 -- import-light glossary/Concepts headword recording the imp-97018
 *   verdict on the imp-96997 C = weightedTailFrac/residFirstOrder decline: the residMeasured-
 *   vs-residFirstOrder gap is a genuine, correctly-signed additive ingredient of 1/C, but over
 *   the only measured range it OVER-explains the observed 1/C rise by 2.29x, and the bulk of
 *   the decline sits where the gap is not even measurable.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96997 Finding 1 attributed the mild ~6% C decline (1.721 -> 1.623 over N in {88..160}
 *   at 2a=ln3) to "the second-order minimiser shift (residMeasured vs residFirstOrder gap)"
 *   without fitting the drift or cross-checking it against the imp-96995 residMeas
 *   measurements. imp-97018 performed that cross-check and found a nuanced, easy-to-flatten
 *   result: correct DIRECTION, wrong MAGNITUDE, untestable where it matters most. That
 *   three-part verdict is exactly the kind of fact that gets silently dropped if only the
 *   qualitative headline ("directionally correct") survives in later summaries. This headword
 *   names the full verdict once so future modules can cite it precisely instead of
 *   over-simplifying to "confirmed."
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE IDENTITY. By the standard Rayleigh algebra (phi = A_lo minimiser, ||phi||=1):
 *   1/C = lam_min(A_full)/scaleB + (residFirstOrder - residMeasured). The gap term is a
 *   genuine additive piece of 1/C with the RIGHT sign (gap grows with N => 1/C grows => C
 *   declines), so the imp-96997 attribution is directionally correct by construction.
 *   (b) THE OVER-EXPLAIN. Over the only range where imp-96995 supplies residMeasured
 *   ({88,100,112,124}), the gap's absolute increase d(gapAbs)=2.36e-3 is 2.29x the ACTUAL
 *   d(1/C)=1.03e-3 -- the gap alone would predict a much larger C decline than is observed.
 *   The excess is cancelled by a compensating FALL in the derived lam_min(A_full)/scaleB
 *   (0.581017 -> 0.579688), so the small net C decline is a residual of two larger opposing
 *   drifts, not a clean image of the gap.
 *   (c) UNTESTABLE WHERE IT MATTERS. C itself is nearly flat (0.18% drift) over {88..124}; the
 *   bulk of the 6% decline (5.68%) lives at {136,148,160}, exactly where imp-96995 supplies NO
 *   residMeasured value, so the attribution cannot be checked in the regime it is meant to
 *   explain. The named residual sub-gap is imp-97018-residmeas-high-N-unmeasured (extend the
 *   imp-96995 driver to {136,148,160}).
 *
 *   STATUS: a terminology/scope headword consolidating the imp-97018 measurement, not a new
 *   computation. No bound moved, no operator positivity claimed. NO QED.
 *   No refereed bound is changed.
 *
 * @see imp-97018-c-drift-vs-residmeas-gap.js (the source measurement: IMP97018_VERDICT,
 *   overlap rows, gap over-explain factor)
 * @see imp-96997-sigma2-weighted-tail-envelope-model.js (Finding 1: the original C=wtf/rfo
 *   attribution this headword qualifies)
 * @see imp-96995-minimiser-coeff-spectrum-supercubic.js (residFO/residMeas driver, stops at
 *   N=124 -- the source of the untestable-range gap)
 *
 * Ticket: imp-97046 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The C-drift/gap-overexplained headword, baked verbatim (no re-import of imp-97018).
const C_DRIFT_GAP_OVEREXPLAINED_HEADWORD = Object.freeze({
  key: 'c-drift-residmeas-gap-directionally-correct-not-quantitative',
  term:
    'the imp-96997 attribution of the imp-96997 C = weightedTailFrac/residFirstOrder decline ' +
    'to the residMeasured-vs-residFirstOrder gap is DIRECTIONALLY correct (imp-97018) but ' +
    'over-explains the measured 1/C rise by 2.29x and is untestable where the bulk of the ' +
    'decline actually lives',
  definition:
    'By the Rayleigh identity 1/C = lam_min(A_full)/scaleB + (residFirstOrder - residMeasured), ' +
    'the residMeas gap is a genuine additive ingredient of 1/C with the correct sign: as the ' +
    'gap grows with N, 1/C grows and C declines. imp-97018 tested this over the overlap grid ' +
    '{88,100,112,124} where imp-96995 supplies residMeasured and found the gap alone predicts a ' +
    '2.29x LARGER 1/C rise than is observed, offset by a compensating fall in the derived ' +
    'lam_min(A_full)/scaleB (0.581017 -> 0.579688).',
  mechanism:
    'C is a two-regime accelerating profile: a near-flat plateau ~1.721 over {88..124} (0.18% ' +
    'drift) then an accelerating per-rung decline (-0.20%, -0.57%, -1.42%, -3.60%) over ' +
    '{124,136,148,160}, so essentially the entire 5.68% net decline lives at the three high-N ' +
    'rungs. imp-96995 provides residMeasured only up to N=124, so the gap attribution is ' +
    'untestable exactly where the decline occurs -- the named residual sub-gap is ' +
    'imp-97018-residmeas-high-N-unmeasured, requiring the imp-96995 lam_min(A_full)/' +
    'lam_min(A_lo) driver to be extended to {136,148,160}.',
  verificationStatus:
    'Consolidates the imp-97018 measurement into one glossary entry; adds no new computation. ' +
    'Establishes nothing new; moves no bound; no operator positivity claimed or refuted. ' +
    'Interval-rigorous reach stays 2a<=0.96; no refereed bound is changed; RH open; ' +
    'NO QED.',
});

export const IMP97046_C_DRIFT_GAP_OVEREXPLAINED_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97046',
  proofSection: 'Route-I-Route-M',
  glosses: 'imp-97018',
  question:
    'imp-97018 found the imp-96997 C-decline "second-order minimiser shift" attribution is ' +
    'directionally correct but 2.29x over-explained by the residMeas gap. Is this a confirmed ' +
    'attribution, a refuted one, or something in between that needs its own headword?',
  headword: C_DRIFT_GAP_OVEREXPLAINED_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Neither confirmed nor refuted: the ' +
    'residMeas gap is a genuine, correctly-signed additive ingredient of 1/C (by the Rayleigh ' +
    'identity), so the imp-96997 attribution is directionally right. But quantitatively the gap ' +
    'over-explains the measured 1/C rise by 2.29x (offset by a compensating lam_min(A_full) ' +
    'fall), C itself stays flat (0.18% drift) over the only range where the gap is measured, ' +
    'and the bulk 5.68% decline sits at N in {136,148,160} where imp-96995 provides no ' +
    'residMeasured value at all -- so the attribution is untestable exactly where it matters. ' +
    'Establishes nothing; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-97018 (C-drift vs residMeas-gap measurement, verdict and all cited constants); ' +
    'imp-96997 (Finding 1, the original attribution); imp-96995 (residFO/residMeas driver, ' +
    'stops at N=124).',
});

export default IMP97046_C_DRIFT_GAP_OVEREXPLAINED_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97046_C_DRIFT_GAP_OVEREXPLAINED_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97046-headword-states-directional-not-quantitative',
    why: 'The headword must state both halves of the imp-97018 verdict: directionally correct ' +
      'by the Rayleigh identity, but quantitatively over-explained (2.29x) -- the whole point ' +
      'of not collapsing this to a simple "confirmed."',
    holds: () => {
      const h = IMP97046_C_DRIFT_GAP_OVEREXPLAINED_GLOSSARY_HEADWORD.headword;
      return (
        /DIRECTIONALLY correct/.test(h.term) &&
        /2\.29x/.test(h.term) &&
        /lam_min\(A_full\)\/scaleB \+ \(residFirstOrder - residMeasured\)/.test(h.definition) &&
        /2\.29x/.test(h.definition)
      );
    },
  },
  {
    id: 'imp97046-headword-names-untestable-range-and-subgap',
    why: 'The headword must record that the bulk of the C decline sits outside the measured ' +
      'residMeas range, and name the residual sub-gap so future scouts do not re-attempt a ' +
      'closed attribution without extending the imp-96995 driver first.',
    holds: () => {
      const h = IMP97046_C_DRIFT_GAP_OVEREXPLAINED_GLOSSARY_HEADWORD.headword;
      return (
        /N=124/.test(h.mechanism) &&
        /imp-97018-residmeas-high-N-unmeasured/.test(h.mechanism) &&
        /5\.68%/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97046-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97046_C_DRIFT_GAP_OVEREXPLAINED_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97046_C_DRIFT_GAP_OVEREXPLAINED_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97046_C_DRIFT_GAP_OVEREXPLAINED_GLOSSARY_HEADWORD.verdict) &&
      IMP97046_C_DRIFT_GAP_OVEREXPLAINED_GLOSSARY_HEADWORD.glosses === 'imp-97018',
  },
];

for (const assertion of IMP97046_C_DRIFT_GAP_OVEREXPLAINED_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97046-c-drift-gap-overexplained-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
