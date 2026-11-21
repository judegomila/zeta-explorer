/**
 * @module imp-95968-rcap-envelope-self-consistency-glossary-headword
 * @fileoverview imp-95968 -- import-light glossary/Concepts headword for the imp-95946
 *   r_cap(T) envelope overlap check: it is a SELF-CONSISTENCY test (C0 max-anchored from the
 *   same six imp-95710 points), NOT an out-of-sample validation, and the dead-zone
 *   conservatism above 5e5 (out to the imp-95519 window bottom 3e12) stays reliant on the
 *   derived envelope (imp-95750 F3).
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95946 tabulated the imp-95722 derived envelope r_cap(T) against the six imp-95710
 *   directly-measured ratios over the only overlap T = 1e4..5e5, finding r_cap >= r at every
 *   sampled height. A reader landing on that VERDICT cold can easily mistake "uniformly
 *   conservative against six measurements" for an independent out-of-sample validation of the
 *   envelope. It is not: the offset C0 baked into r_cap was itself pinned as the MAX per-height
 *   offset FROM those same six points, so residual >= 0 is guaranteed by construction at the
 *   anchor and only genuinely informative as a slack measurement elsewhere. This headword bakes
 *   that caveat VERBATIM (no re-import of the imp-95946 module, to stay import-light) as a
 *   standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   Over T = 1e4..5e5, the imp-95722 envelope r_cap(T) = [(1/2pi^2) log log(T/2pi) + C0] /
 *   Sigma^2(L(T)) sits at or above the imp-95710 measured ratio r(T) at all six overlap
 *   heights (min residual 0). But C0 = max over those same six heights of (measuredVar -
 *   Selberg term), so the envelope is guaranteed to touch (not fall below) the argmax point
 *   T = 1.5e5 -- residual = 0 there is a tautology of the max-anchor construction, not a
 *   coincidence the data confirmed. What the check actually measures is the SLACK the max
 *   anchor buys at the OTHER five heights: 0 at the anchor, rising to a worst case +0.133
 *   (~+38.1% relative) at T = 7e4, mean absolute residual ~+0.077 (~+20.4%).
 *
 *   Because every one of the six overlap heights was also used to CONSTRUCT C0, none of them
 *   is a held-out check on the envelope's shape; the exercise is a self-consistency /
 *   slack-quantification pass, not a predictive test. imp-95750 (F3) already established that
 *   the dead-zone above the ceiling gamma_1e6 = 6.003e5 -- which is where essentially all of
 *   the conservatism the bound needs (out to the imp-95519 window bottom T = 3e12, 6.8 decades
 *   further) actually lives -- cannot be measured with in-repo zero data at all, so it remains
 *   entirely reliant on the derived envelope, untouched by this or any check built from the
 *   same six points.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95946 self-consistency caveat for quick
 *   reference. It establishes nothing, instantiates no interval, closes no sub-gap, moves no
 *   bound. imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95946-number-variance-envelope-vs-measured-crossvalidation (source: the overlap
 *   residual table and self-consistency caveat this glosses)
 * @see imp-95750-number-variance-dead-zone-audit (source of the F3 dead-zone-reliance finding)
 *
 * Ticket: imp-95968 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The self-consistency-not-out-of-sample headword, baked verbatim (no re-import).
const RCAP_ENVELOPE_SELF_CONSISTENCY_HEADWORD = Object.freeze({
  key: 'rcap-envelope-self-consistency-not-out-of-sample',
  term: 'imp-95946 r_cap(T) overlap check (self-consistency, not out-of-sample validation)',
  definition:
    'Over T = 1e4..5e5, the imp-95722 derived envelope r_cap(T) sits at or above the six ' +
    'imp-95710 directly-measured ratios r(T) (residual = r_cap - r >= 0 at all six heights, ' +
    'min residual 0). This looks like an out-of-sample validation but is NOT one: the offset ' +
    'C0 baked into r_cap was itself pinned as the MAX over those same six heights of ' +
    '(measuredVar - Selberg term), so residual >= 0 at the argmax height T = 1.5e5 is ' +
    'guaranteed by the max-anchor construction, not confirmed by independent data.',
  whatItActuallyMeasures:
    'The SLACK the max anchor buys over the measured band at the other five heights: 0 at ' +
    'the T = 1.5e5 anchor, rising to a worst-case +0.133 (~+38.1% relative) at T = 7e4, mean ' +
    'absolute residual ~+0.077 (~+20.4%). This is consistent with the imp-95787/imp-95800 ' +
    'finding that the max anchor over-estimates the central offset relative to a mean-based C0.',
  deadZoneReliance:
    'imp-95750 (F3) established that the conservatism above the measurement ceiling ' +
    'gamma_1e6 = 6.003e5 -- which carries the bound out to the imp-95519 window bottom ' +
    'T = 3e12, 6.8 decades further -- cannot be measured with in-repo zero data at all. Since ' +
    'every point used by the imp-95946 overlap check is at or below T = 5e5, that dead-zone ' +
    'conservatism remains entirely reliant on the derived envelope, untouched by this check.',
});

export const IMP95968_RCAP_ENVELOPE_SELF_CONSISTENCY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95968',
  proofSection: 'S-frontier',
  glosses: 'imp-95946',
  question:
    'imp-95946 found the imp-95722 envelope r_cap(T) uniformly at or above the six imp-95710 ' +
    'measured ratios over their overlap T = 1e4..5e5. Is that an out-of-sample validation of ' +
    'the envelope, and what does it say about the conservatism above the T = 5e5 measurement ' +
    'ceiling, for a reader landing on the imp-95946 VERDICT cold?',
  headword: RCAP_ENVELOPE_SELF_CONSISTENCY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95946 caveat: the ' +
    'r_cap(T) vs measured-r(T) overlap check is a SELF-CONSISTENCY test, because C0 was ' +
    'pinned as the max per-height offset from the same six points being checked against -- ' +
    'residual = 0 at the T = 1.5e5 anchor is a tautology of that construction, not an ' +
    'independent confirmation. It quantifies max-anchor slack (0 at the anchor, up to ~38.1% ' +
    'at T = 7e4), and the dead-zone conservatism above 5e5, out to the 3e12 window bottom, ' +
    'stays reliant on the derived envelope (imp-95750 F3), untouched by this check. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95946 (the overlap residual table and self-consistency caveat this glosses); ' +
    'imp-95750 (F3, the dead-zone measurement-ceiling finding this headword restates); ' +
    'imp-95722 (the derived envelope r_cap(T) and max-anchor C0 construction); ' +
    'imp-95787/imp-95800 (the mean-vs-max anchor over-estimation finding this is consistent with).',
});

export default IMP95968_RCAP_ENVELOPE_SELF_CONSISTENCY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95968_RCAP_ENVELOPE_SELF_CONSISTENCY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95968-headword-has-required-fields',
    why: 'The headword must name the self-consistency mechanism, the max-anchor tautology at ' +
      'T = 1.5e5, and the dead-zone reliance above T = 5e5 -- the entire point of the entry.',
    holds: () => {
      const h = IMP95968_RCAP_ENVELOPE_SELF_CONSISTENCY_GLOSSARY_HEADWORD.headword;
      return (
        /residual >= 0/.test(h.definition) &&
        /NOT one/.test(h.definition) &&
        /1\.5e5/.test(h.definition) &&
        /38\.1%/.test(h.whatItActuallyMeasures) &&
        /gamma_1e6 = 6\.003e5/.test(h.deadZoneReliance) &&
        /3e12/.test(h.deadZoneReliance)
      );
    },
  },
  {
    id: 'imp95968-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95968_RCAP_ENVELOPE_SELF_CONSISTENCY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95968_RCAP_ENVELOPE_SELF_CONSISTENCY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95968_RCAP_ENVELOPE_SELF_CONSISTENCY_GLOSSARY_HEADWORD.verdict) &&
      IMP95968_RCAP_ENVELOPE_SELF_CONSISTENCY_GLOSSARY_HEADWORD.glosses === 'imp-95946',
  },
];

for (const assertion of IMP95968_RCAP_ENVELOPE_SELF_CONSISTENCY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95968-rcap-envelope-self-consistency-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
