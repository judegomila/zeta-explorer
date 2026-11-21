/**
 * @module imp-124983-inverse-roundoff-law-glossary-headword
 * @fileoverview imp-124983 -- import-light glossary/Concepts headword recording the imp-124811
 *   inverse round-off law: the pair-ratio cross-check |reldiff| of the imp-97665 EXACT identity
 *   E_CF/E_ET = E_flow/E_trunc obeys |reldiff| ~ R/|E_CF| (log-log slope ~ -1.085, within ~9% of
 *   the predicted -1), and the invariant product P = |reldiff|*|E_CF| stays flat (not decreasing)
 *   down the L2..L7 landmark ladder -- the discriminator that rules out a genuine identity drift.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-124770 M2 noted that the direct 5-point cross-check of the imp-97665
 *   EXACT pair-ratio identity has |reldiff| growing monotonically down the landmark ladder
 *   (5.8e-12 at L2 to 6.8e-4 at L7) and attributed that growth to |E_CF| collapsing into the
 *   landmark-bisection round-off floor, but never tabulated or fit the relationship. imp-124811
 *   tabulates |reldiff| directly against the measured |E_CF| across L2..L7 and fits the inverse
 *   law |reldiff| ~ R/|E_CF| by a log-log OLS: slope ~ -1.085 (within ~9% of the predicted -1).
 *   Equivalently, the invariant PRODUCT P = |reldiff|*|E_CF| stays bounded within
 *   [9.4e-13, 7.9e-12] (max/min ~ 8.5, geomean round-off floor R ~ 2.34e-12) and does NOT decrease
 *   down the ladder as |E_CF| collapses -- the discriminator against a genuine, |E_CF|-independent
 *   identity drift D, which would instead make P = D*|E_CF| + R decrease toward the deep tail.
 *   The flow-heavy L2 rung caps any residual drift D <= 5.80e-12, consistent with the imp-124808
 *   mpmath dps=100 result D = 0; imp-124850 later sharpens this to a full OLS slope fit
 *   D = -8.05e-12 +/- 1.27e-11 (t = -0.64), statistically indistinguishable from zero.
 *   (b) WHY IT IS NEW. imp-124770 M2 only asserted the round-off attribution; imp-124811 built
 *   the tabulate-and-fit chain that names the inverse-|E_CF| law and its invariant product; recent
 *   siblings imp-124900/124801/124802/124980 set the precedent of adding a glossary headword once
 *   a measurement chain like this stabilizes.
 *   (c) WHY IT MATTERS. It gives later citations a single name for "the pair-ratio inverse
 *   round-off law" instead of re-deriving the |reldiff| ~ R/|E_CF| fit and the flat-product
 *   drift-discriminator argument from the imp-124811 module each time the double-precision
 *   cross-check of the E_CF/E_ET = E_flow/E_trunc identity is invoked.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a naming/cross-reference headword over an already
 *   measured conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation
 *   surrogate. The C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the
 *   pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED; establishes no operator
 *   positivity; imp-3066 K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; no new coefficient pinned beyond re-citing the
 *   imp-124811 measurement; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement chain. Not a new derivation. NO QED.
 *
 * @see imp-124811-pairratio-reldiff-ecf-roundoff-law.js (source: |reldiff| ~ R/|E_CF| log-log fit,
 *   flat invariant product P, L2 drift cap)
 * @see imp-124769-ecf-stencil-noise-floor-crossover.js (the E_CF round-off-vs-truncation crossover
 *   that the round-off floor R is drawn from)
 * @see imp-124770-pair-ratio-identity-landmark-ladder.js (the double-precision |reldiff| ladder
 *   L2..L7 that imp-124811 reuses and tabulates)
 * @see imp-124850-pairratio-drift-slope-fit.js (full six-rung OLS drift-slope fit sharpening the
 *   single-rung L2 cap into D = -8.05e-12 +/- 1.27e-11)
 *
 * Ticket: imp-124983 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The inverse round-off law headword, baked verbatim (no re-import of the heavy zeros bundle).
const INVERSE_ROUNDOFF_LAW_HEADWORD = Object.freeze({
  key: 'pairratio-inverse-roundoff-law-imp124811',
  term:
    'imp-124811 pair-ratio inverse round-off law: |reldiff| ~ R / |E_CF| (log-log slope ~ -1.085) ' +
    'and the flat invariant product P = |reldiff| * |E_CF|',
  definition:
    'The direct 5-point cross-check of the imp-97665 EXACT pair-ratio identity ' +
    'E_CF/E_ET = E_flow/E_trunc has |reldiff| growing monotonically down the imp-97520 landmark ' +
    'ladder L2..L7 (5.8e-12 at L2 to 6.8e-4 at L7) as the measured |E_CF| collapses across eight ' +
    'decades (2.5e-1 -> 1.2e-8). A log-log OLS regression of |reldiff| against |E_CF| has slope ' +
    '~ -1.085, within ~9% of the predicted -1, confirming the inverse law |reldiff| ~ R/|E_CF|. ' +
    'Equivalently the invariant product P = |reldiff| * |E_CF| stays bounded within ' +
    '[9.4e-13, 7.9e-12] (max/min ~ 8.5, geomean round-off floor R ~ 2.34e-12) without decreasing ' +
    'down the ladder.',
  mechanism:
    'The pair-ratio reldiff decomposes as reldiff = D + R/|E_CF|, where R is the landmark-bisection ' +
    'round-off floor of the 5-point stencil and D is any genuine, |E_CF|-independent identity drift. ' +
    'Multiplying by |E_CF| linearises this to P = D*|E_CF| + R: a constant drift D would make P ' +
    'DECREASE toward the deep tail as |E_CF| collapses, while a flat (non-decreasing) P pins reldiff ' +
    'to the round-off floor R alone. The flow-heavy L2 rung (largest |E_CF|, smallest round-off ' +
    'contribution) caps any residual drift at D <= 5.80e-12, below R in scale; imp-124850 sharpens ' +
    'this single-rung cap into a full six-rung OLS slope fit D = -8.05e-12 +/- 1.27e-11 (t = -0.64, ' +
    'statistically indistinguishable from zero), consistent with the imp-124808 mpmath dps=100 ' +
    'result D = 0.',
  verificationStatus:
    'Re-cited from the imp-124811 measurement module (log-log slope -1.085 against the predicted ' +
    '-1, flat product max/min ~ 8.5 over L2..L7, L2 drift cap 5.80e-12), reusing the imp-124770 ' +
    'pair-ratio machinery verbatim and cross-checked against the imp-124850 six-rung drift-slope ' +
    'fit and the imp-124808 extended-precision D = 0 result. Naming / glossary headword only; ' +
    'supplies no new bound; the C_C 1/8 ansatz and E_trunc/E_flow component model are untouched; ' +
    'RH open; no refereed bound is changed; NO QED.',
});

export const IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124983',
  proofSection: 'S-frontier',
  glosses: 'imp-124811',
  question:
    'imp-124811 fit the direct 5-point cross-check of the imp-97665 pair-ratio identity as the ' +
    'inverse round-off law |reldiff| ~ R/|E_CF| and reported the flat invariant product ' +
    'P = |reldiff|*|E_CF| with no systematic drift -- what is the headword for that finding?',
  headword: INVERSE_ROUNDOFF_LAW_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124811 result: the ' +
    'pair-ratio cross-check |reldiff| obeys the inverse-|E_CF| round-off law (log-log slope ' +
    '~ -1.085, predicted -1), and the invariant product P = |reldiff|*|E_CF| stays flat ' +
    '(max/min ~ 8.5) rather than decreasing, discriminating pure round-off precision loss from a ' +
    'genuine identity drift. No bound moved; the component model and all pinned surrogate ' +
    'constants are untouched; imp-3066 K_a >= 0 untouched; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-124811 (|reldiff| ~ R/|E_CF| log-log fit, flat invariant product, L2 drift cap); ' +
    'imp-124769 (E_CF round-off-vs-truncation crossover); imp-124770 (double-precision |reldiff| ' +
    'ladder L2..L7 reused here); imp-124850 (six-rung OLS drift-slope fit); imp-124808 (mpmath ' +
    'dps=100 proof that identity drift D = 0).',
});

export default IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124983-headword-names-slope-and-product',
    why: 'The headword must name the inverse-|E_CF| law log-log slope and the flat invariant ' +
      'product -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD.headword;
      return (
        /slope ~ -1\.085/.test(h.definition) &&
        /R\/\|E_CF\|/.test(h.definition) &&
        /\[9\.4e-13, 7\.9e-12\]/.test(h.definition) &&
        /without decreasing/.test(h.definition)
      );
    },
  },
  {
    id: 'imp124983-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124811.',
    holds: () =>
      IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD.verdict) &&
      IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD.glosses === 'imp-124811',
  },
  {
    id: 'imp124983-citation-covers-full-chain',
    why: 'The headword must cross-link all source modules (imp-124811/124769/124770/124850/124808) ' +
      'so the glossary entry is discoverable from any of them.',
    holds: () => {
      const c = IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD.citation;
      return (
        /imp-124811/.test(c) &&
        /imp-124769/.test(c) &&
        /imp-124770/.test(c) &&
        /imp-124850/.test(c) &&
        /imp-124808/.test(c)
      );
    },
  },
  {
    id: 'imp124983-imp3066-untouched-citation',
    why: 'Honesty-banner audit precedent (imp-124979): the imp-3066 K_a >= 0 untouched citation ' +
      'must survive a live-export audit in the verdict field, not just a raw file grep.',
    holds: () =>
      /imp-3066 K_a >= 0 untouched/.test(IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD.verdict),
  },
];

for (const assertion of IMP124983_INVERSE_ROUNDOFF_LAW_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124983-inverse-roundoff-law-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
