/**
 * @module imp-124980-kernel-arm-asymmetry-glossary-headword
 * @fileoverview imp-124980 -- import-light glossary/Concepts headword recording the imp-124852
 *   reconstruction-kernel arm-asymmetry finding: the imp-97823 |K| = |1/(N sigma_N)| per-decade
 *   growth ratio brackets sqrt(10) from opposite sides (upslope below, downslope above), the
 *   arm-asymmetry ratio |up_offset| / |down_offset| runs up to 1 as the near-peak gap g -> 0, and
 *   each arm offset shrinks as the antisymmetric O(sqrt(g)) leading finite-gap correction.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-124776 charted that the imp-97823 kernel |K| per-decade growth ratio
 *   brackets sqrt(10) = 3.162278 from opposite sides near the imp-97520 L1 sigma peak, but did not
 *   measure the asymmetry. imp-124852 measured the SIGNED offset of each arm from sqrt(10): the
 *   upslope offset is always negative, the downslope offset always positive, and the
 *   arm-asymmetry ratio |up_offset| / |down_offset| climbs toward 1 as the near-peak gap g -> 0
 *   (deep window ~0.991 -> ~0.997 -> ~1.000). Each arm offset shrinks as |offset| ~ g^(1/2)
 *   (deep-window log-log slope ~+0.499 upslope / ~+0.501 downslope), the leading finite-gap
 *   correction being antisymmetric (an odd cubic-fold term); the summed residual up + down
 *   collapses at roughly double that slope (~g^1), one extra half-power of g.
 *   (b) WHY IT IS NEW. imp-124776 drew the bracketing but never measured it; imp-124852 built the
 *   signed-offset / asymmetry-ratio / convergence-slope measurement chain but did not name it;
 *   recent siblings imp-124800/124801/124802 set the precedent of adding a glossary headword once
 *   a measurement chain like this stabilizes.
 *   (c) WHY IT MATTERS. It gives later citations a single name for "the kernel arm-asymmetry law"
 *   instead of re-deriving the signed-offset bracketing, the ->1 asymmetry ratio and the
 *   sqrt(g) convergence rate from the imp-124852 module each time the two-sided approach of the
 *   per-decade ratio to sqrt(10) is invoked.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a naming/cross-reference headword over an already
 *   measured conditional-share diagnostic on the inherited imp-3220/imp-3406 extrapolation
 *   surrogate. The C_mb GUE-conditional per imp-486, the C_C 1/8 ansatz (imp-2642/imp-2643), the
 *   pinned E_trunc 3.06e-5 and the imp-398 C_F prefactor are UNTOUCHED; establishes no operator
 *   positivity; imp-3066 K_a >= 0 untouched.
 *   (e) STATUS: documentation only. No bound moved; no new coefficient pinned beyond re-citing the
 *   imp-124852 measurement; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement chain. Not a new derivation. NO QED.
 *
 * @see imp-124852-kernel-arm-offset-asymmetry-viz-data.js (source: signed offsets, asymmetry
 *   ratio -> 1, |offset| ~ g^(1/2) convergence, symmetric-residual collapse)
 * @see imp-124776-kernel-decade-ratio-vs-gap-viz-data.js (gap-keyed ratio tables, source of the
 *   frozen rows the offsets are formed from)
 * @see imp-97823-kernel-decade-growth-sqrt10.js (root measurement: |K| ~ sqrt(10) per decade,
 *   both arms)
 *
 * Ticket: imp-124980 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; no refereed bound is changed.
 */

// The kernel arm-asymmetry headword, baked verbatim (no re-import of the heavy zeros bundle).
const KERNEL_ARM_ASYMMETRY_HEADWORD = Object.freeze({
  key: 'kernel-arm-asymmetry-imp124852',
  term:
    'imp-124852 reconstruction-kernel arm asymmetry: up/down |K| arms bracket sqrt(10) from ' +
    'opposite sides, asymmetry ratio |up_offset| / |down_offset| -> 1 as the near-peak gap ' +
    'g -> 0, leading correction antisymmetric and O(sqrt(g))',
  definition:
    'Near the imp-97520 L1 sigma peak, the imp-97823 reconstruction-kernel |K| = |1/(N sigma_N)| ' +
    'per-decade growth ratio brackets sqrt(10) = 3.162278 from opposite sides: the upslope arm ' +
    'sits strictly below sqrt(10) (signed offset < 0) and the downslope arm strictly above ' +
    '(signed offset > 0), at every near-peak gap g. The arm-asymmetry ratio ' +
    '|up_offset| / |down_offset| runs up toward 1 as g -> 0 (deep window ~0.991 -> ~0.997 -> ' +
    '~1.000), and each signed offset shrinks as |offset| ~ g^(1/2) (deep-window log-log slope ' +
    '~+0.499 upslope / ~+0.501 downslope). The summed offset up + down (the symmetric residual) ' +
    'collapses at roughly double that slope (~g^1), one extra half-power of g beyond either arm.',
  mechanism:
    'The ratio-1 convergence is governed by the leading finite-gap correction, which is an odd ' +
    '(antisymmetric) cubic-fold term of imp-97823: equal magnitude, opposite sign on the two arms, ' +
    'so it cancels in the sum up + down and drives the asymmetry ratio |up|/|down| to exactly 1 ' +
    'as g -> 0 while leaving each individual arm offset at O(sqrt(g)). Because the leading ' +
    'antisymmetric term cancels in the sum, the next, SYMMETRIC order (~g^1) survives there, ' +
    'explaining why the summed residual collapses roughly twice as fast (in log-log slope) as ' +
    'either arm alone.',
  verificationStatus:
    'Re-cited from the imp-124852 measurement module (deep-window asymmetry ratio sequence ' +
    'rising to ~1.000, per-arm sqrt(g) log-log slopes 0.499/0.501 with max residual < 1e-3, ' +
    'symmetric-residual slope ratio ~2 over the two genuine deep rows), built from the frozen ' +
    'imp-97823 tables via the imp-124776 gap-keyed leaf. Naming / glossary headword only; ' +
    'supplies no new bound; the C_C 1/8 ansatz and E_trunc/E_flow component model are untouched; ' +
    'RH open; no refereed bound is changed; NO QED.',
});

export const IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124980',
  proofSection: 'S-frontier',
  glosses: 'imp-124852',
  question:
    'imp-124852 measured, for the imp-97823 reconstruction-kernel per-decade ratio bracketing ' +
    'sqrt(10), the signed up/down arm offsets, their asymmetry ratio -> 1 as the near-peak gap ' +
    'g -> 0, and the antisymmetric O(sqrt(g)) convergence law -- what is the headword for that ' +
    'arm-asymmetry finding?',
  headword: KERNEL_ARM_ASYMMETRY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124852 result: the ' +
    'imp-97823 kernel |K| per-decade ratio brackets sqrt(10) from opposite sides, the ' +
    'arm-asymmetry ratio |up_offset| / |down_offset| runs to 1 as the near-peak gap g -> 0, and ' +
    'each arm offset shrinks as the antisymmetric O(sqrt(g)) leading finite-gap correction. No ' +
    'bound moved; the component model and all pinned surrogate constants are untouched; ' +
    'imp-3066 K_a >= 0 untouched; NO QED. No refereed bound is changed.',
  citation:
    'imp-124852 (signed offsets, asymmetry ratio -> 1, |offset| ~ g^(1/2) convergence, symmetric ' +
    'residual collapse); imp-124776 (gap-keyed ratio tables, source of the frozen rows); ' +
    'imp-97823 (root measurement: |K| ~ sqrt(10) per decade, both arms).',
});

export default IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124980-headword-names-bracket-and-asymmetry',
    why: 'The headword must name the opposite-sided bracketing of sqrt(10), the asymmetry ratio ' +
      '-> 1, and the sqrt(g) convergence law -- the entire content of the glossary entry.',
    holds: () => {
      const h = IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD.headword;
      return (
        /sqrt\(10\) = 3\.162278/.test(h.definition) &&
        /signed offset < 0/.test(h.definition) &&
        /offset\| ~ g\^\(1\/2\)/.test(h.definition) &&
        /toward 1 as g -> 0/.test(h.definition)
      );
    },
  },
  {
    id: 'imp124980-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, glosses imp-124852.',
    holds: () =>
      IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD.verdict) &&
      IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD.glosses === 'imp-124852',
  },
  {
    id: 'imp124980-citation-covers-full-chain',
    why: 'The headword must cross-link all source modules (imp-124852/124776/97823) so the ' +
      'glossary entry is discoverable from any of them.',
    holds: () => {
      const c = IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD.citation;
      return /imp-124852/.test(c) && /imp-124776/.test(c) && /imp-97823/.test(c);
    },
  },
  {
    id: 'imp124980-imp3066-untouched-citation',
    why: 'Honesty-banner audit precedent (imp-124979): the imp-3066 K_a >= 0 untouched citation ' +
      'must survive a live-export audit in the verdict field, not just a raw file grep.',
    holds: () =>
      /imp-3066 K_a >= 0 untouched/.test(IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD.verdict),
  },
];

for (const assertion of IMP124980_KERNEL_ARM_ASYMMETRY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124980-kernel-arm-asymmetry-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
