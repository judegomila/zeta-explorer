/**
 * @module imp-96658-gmin-two-sided-oscillation-glossary-headword
 * @fileoverview imp-96658 -- import-light glossary/Concepts headword for the imp-96637
 *   finding: the imp-96616 running-min ratio g_min(N)/y_N vs the GUE median envelope
 *   0.8582 N^{-1/3} is a TWO-SIDED oscillation (dips below 1 at N=5000 and N=5e5), not
 *   the one-sided upper bound the smooth single-power fit A N^b (A=2.1147, b=-0.3953)
 *   suggests over the tabulated N=50..1e6 ladder.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96637 reconciled two readings of the same imp-96616 table: the smooth fitted
 *   power law stays strictly above the GUE median (ratioOverGue_fit falls monotonically
 *   from 1.93 to 1.05 but never crosses 1) across the tabulated range, while the raw
 *   14-rung running-min ladder itself dips below the median twice (0.9223 at N=5000,
 *   0.8966 at N=500000) before climbing back above it. This headword bakes that
 *   distinction verbatim (no re-import of the imp-96637 module, to stay import-light) so
 *   a reader does not mistake the smooth fit's one-sided appearance for a property of the
 *   actual running-min statistic.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) TWO FITTED CURVES CROSS ONCE, LATE. The measured fit A N^b (A=2.1147,
 *   b=-0.3953) and the GUE median envelope C N^c (C=0.8582, c=-1/3) cross at
 *   N* = (A/C)^{1/(c-b)} = 2.0917e6 (log10 N* = 6.3205), just beyond the tabulated
 *   max N=1e6 -- so the smooth fit is a one-sided upper envelope over the whole
 *   data range (ratioOverGue_fit: 1.9337 at N=50 down to 1.0468 at N=1e6, never < 1).
 *   (b) THE RAW LADDER ALREADY OSCILLATES. The actual 14-rung ratioOverGue table dips
 *   BELOW 1 twice inside the tabulated range -- at N=5000 (0.9223) and N=500000
 *   (0.8966) -- while climbing as high as 2.2105 at N=200 elsewhere, so it is a
 *   two-sided oscillation about the median, not a strict upper bound.
 *   (c) CAUSE: RUNNING-MIN SAWTOOTH. The oscillation is an artifact of g_min(N) being
 *   a running minimum: it freezes at the last record gap while the GUE median
 *   C N^{-1/3} keeps shrinking, so ratioOverGue climbs on each plateau then snaps down
 *   when a new smaller normalized gap sets a fresh record (argmin index jumps
 *   33 -> 185 -> ... -> 420890).
 *   (d) NO CHANGE TO THE imp-96616 CONSEQUENCE. Neither reading (smooth one-sided fit
 *   vs raw two-sided oscillation) affects the underlying conclusion: beating the
 *   1/log^2 fold-law surrogate still requires the unproved GUE cube-root small-gaps
 *   law g_min(N)/y_N -> 0.
 *
 *   STATUS: an analytic + tabular reconciliation of a single finite dataset, not a
 *   proof about the running-min process. NO QED. No refereed bound is changed.
 *
 * @see imp-96637-gmin-fit-gue-crossover.js (source: the crossover and classification
 *   this glosses)
 * @see imp-96616-gmin-ratio-extreme-gap-decay.js (the underlying measurement)
 * @see imp-96639-gmin-ratio-gue-envelope-glossary-headword.js (sibling headword for the
 *   imp-96616 envelope-tracking finding itself)
 *
 * Ticket: imp-96658 (content, low, sonnet-4-6). Documentation only; establishes
 * nothing; NO QED; no refereed bound is changed.
 */

// The two-sided-oscillation headword, baked verbatim (no re-import).
const GMIN_TWO_SIDED_OSCILLATION_HEADWORD = Object.freeze({
  key: 'gmin-running-min-two-sided-oscillation-not-one-sided-bound',
  term:
    'imp-96637 finding: the imp-96616 g_min(N)/y_N running-min ladder is a TWO-SIDED ' +
    'oscillation about the GUE median envelope 0.8582 N^{-1/3} (dips below 1 at ' +
    'N=5000 and N=5e5), not the one-sided upper bound the smooth single-power fit ' +
    'A N^{-0.3953} suggests over N=50..1e6',
  definition:
    'imp-96616 tabulates ratioOverGue(N) = g_min(N)/y_N divided by the GUE median ' +
    '0.8582 N^{-1/3} at 14 rungs N=50..1e6. The smooth fitted power law A N^b ' +
    '(A=2.1147, b=-0.3953) and the GUE envelope C N^c (C=0.8582, c=-1/3) cross once, ' +
    'analytically, at N* = (A/C)^{1/(c-b)} = 2.0917e6 (log10 N* = 6.3205) -- just past ' +
    'the tabulated data -- so the fitted curve ratioOverGue_fit = (A/C) N^{b-c} stays ' +
    'strictly above 1 across N=50..1e6, falling monotonically from 1.9337 to 1.0468. ' +
    'The RAW tabular ratioOverGue, however, dips below 1 twice within that same range: ' +
    '0.9223 at N=5000 and 0.8966 at N=500000, while reaching as high as 2.2105 at ' +
    'N=200 -- a two-sided oscillation, not a one-sided bound.',
  mechanism:
    'The oscillation is a sawtooth artifact of the running minimum: g_min(N) is frozen ' +
    'at the value of the last record-setting gap until a new smaller normalized gap ' +
    'appears (argmin index jumps 33 -> 185 -> ... -> 420890 across the ladder), while ' +
    'the GUE median C N^{-1/3} shrinks continuously with N. Between records, ' +
    'ratioOverGue = g_min(N)/(C N^{-1/3} y_N) climbs as the denominator shrinks under a ' +
    'frozen numerator; when a new record hits, it snaps back down, occasionally below ' +
    '1. The smooth single-power fit averages over this sawtooth, which is why it reads ' +
    'as one-sided (fit crosses the median only past the data, at N*=2.09e6) even though ' +
    'the underlying statistic already crosses it twice by N=1e6. Neither description ' +
    'changes the imp-96616 consequence: beating the 1/log^2 fold-law surrogate still ' +
    'requires the unproved GUE cube-root small-gaps law.',
  verificationStatus:
    'Analytic crossover solve (N* = (A/C)^{1/(c-b)}) plus a re-read of the imp-96616 ' +
    '14-rung tabular ladder (2,001,052 Odlyzko zeros). Reconciles two consistent ' +
    'descriptions of one finite dataset; not an asymptotic theorem about the running-' +
    'min process. Changes no bound; establishes no operator positivity; no refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96658_GMIN_TWO_SIDED_OSCILLATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96658',
  proofSection: 'S-frontier',
  glosses: 'imp-96637',
  question:
    'imp-96616 fitted a smooth single power law A N^{-0.3953} to the running-min ratio ' +
    'g_min(N)/y_N and compared it against the GUE median envelope 0.8582 N^{-1/3}; that ' +
    'smooth fit never dips below the envelope over the tabulated N=50..1e6 range. Does ' +
    'the underlying running-min statistic itself stay above the envelope (a genuine ' +
    'one-sided bound), or does the smoothing hide sub-median excursions already present ' +
    'in the raw data?',
  headword: GMIN_TWO_SIDED_OSCILLATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96637 ' +
    'finding: the smooth fit is a one-sided upper envelope over N=50..1e6 (crossing the ' +
    'GUE median only past the data, at N*=2.09e6), but the raw running-min ladder is ' +
    'already a TWO-SIDED oscillation about the median, dipping below 1 at N=5000 ' +
    '(0.9223) and N=500000 (0.8966) -- a running-min sawtooth artifact, not a genuine ' +
    'one-sided bound. Does not change the imp-96616 consequence that beating the ' +
    '1/log^2 fold-law surrogate needs the unproved GUE cube-root small-gaps law. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-96637 (the crossover solve and two-sided-oscillation classification this ' +
    'glosses); imp-96616 (the underlying running-min measurement).',
});

export default IMP96658_GMIN_TWO_SIDED_OSCILLATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96658_GMIN_TWO_SIDED_OSCILLATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96658-headword-has-required-fields',
    why: 'The headword must name both sub-1 dips and the two-sided-vs-one-sided ' +
      'distinction -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP96658_GMIN_TWO_SIDED_OSCILLATION_GLOSSARY_HEADWORD.headword;
      return (
        /0\.9223/.test(h.definition) &&
        /0\.8966/.test(h.definition) &&
        /two-sided/i.test(h.term) &&
        /sawtooth/i.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96658-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP96658_GMIN_TWO_SIDED_OSCILLATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96658_GMIN_TWO_SIDED_OSCILLATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96658_GMIN_TWO_SIDED_OSCILLATION_GLOSSARY_HEADWORD.verdict) &&
      IMP96658_GMIN_TWO_SIDED_OSCILLATION_GLOSSARY_HEADWORD.glosses === 'imp-96637',
  },
];

for (const assertion of IMP96658_GMIN_TWO_SIDED_OSCILLATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96658-gmin-two-sided-oscillation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
