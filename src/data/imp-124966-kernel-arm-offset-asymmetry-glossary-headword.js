/**
 * @module imp-124966-kernel-arm-offset-asymmetry-glossary-headword
 * @fileoverview imp-124966 -- import-light glossary/Concepts headword recording the imp-124852
 *   reconstruction-kernel arm-offset asymmetry: the up-arm and down-arm signed offsets of the
 *   imp-97823 |K| per-decade growth ratio from sqrt(10), about the imp-97520 L1 sigma peak, obey
 *   an asymmetry ratio |up|/|down| that climbs to 1 as the near-peak gap g -> 0 because the
 *   leading finite-gap correction is ANTISYMMETRIC (odd, ~g^(1/2), opposite sign per arm) while
 *   the symmetric residual is strictly higher order (~g^1, per imp-124893).
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. imp-97823 showed the two arms of the kernel |K| decade-growth ratio bracket
 *   sqrt(10) = 3.162278 from opposite sides near the L1 sigma peak. imp-124852 quantified the
 *   signed offsets: the up-arm offset from sqrt(10) is always negative, the down-arm offset is
 *   always positive, the asymmetry ratio |up|/|down| runs UP toward 1 as g -> 0 (deep window
 *   0.9912 -> 0.9974 -> 1.0000), and each arm offset shrinks as |offset| ~ g^(1/2) (deep-window
 *   slopes 0.498960 upslope / 0.500881 downslope).
 *   (b) WHY IT IS NEW. imp-124776 only charted that the two arms bracket sqrt(10); it never
 *   measured how close to symmetric the bracketing is or how the asymmetry behaves as g -> 0.
 *   imp-124852 is the first module to isolate the SIGNED offsets, the asymmetry ratio, and its
 *   g -> 0 limit.
 *   (c) WHY IT MATTERS. Because |up|/|down| -> 1, the leading finite-gap correction term is
 *   ANTISYMMETRIC between the two arms (equal magnitude, opposite sign, each ~g^(1/2)) -- so it
 *   exactly cancels in the symmetric sum up + down. imp-124893 confirmed this directly: the
 *   summed residual decays at slope ~1.036 (~g^1), one full extra half-power of g faster than
 *   either arm alone (slope_ratio ~2.073, excess_power ~+0.537, extra shrink/decade ~0.291 ~
 *   1/sqrt(10)), because the g^(1/2) antisymmetric term cancels and only the next symmetric
 *   order survives.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a finer-grained decomposition of the same
 *   imp-97823 kernel-fold Jacobian-scaling fact feeding the imp-97520 conditional-share
 *   diagnostic. DIAG3 == 0 is untouched; the C_C 1/8 ansatz, E_trunc, and C_F prefactor are all
 *   fixed surrogate inputs, unchanged; no operator positivity established; no RH verdict.
 *   (e) STATUS: documentation only. No bound moved; no coefficient pinned beyond re-citing the
 *   imp-124852 / imp-124893 measurements; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-124852-kernel-arm-offset-asymmetry-viz-data.js (source: the signed arm-offset and
 *   asymmetry-ratio measurement this headword names)
 * @see imp-124893 (the symmetric-residual collapse-slope fit confirming the antisymmetric
 *   leading-order cancellation)
 * @see imp-97823-kernel-decade-growth-sqrt10.js (the deep-limit sqrt(10) fold law whose two
 *   arms this asymmetry measures)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429,
 *   N_peak ~ 9.22e5)
 *
 * Ticket: imp-124966 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The arm-offset-asymmetry headword, baked verbatim (no re-import of the heavy zeros bundle).
const KERNEL_ARM_OFFSET_ASYMMETRY_HEADWORD = Object.freeze({
  key: 'kernel-arm-offset-asymmetry-imp124852',
  term:
    'Reconstruction-kernel arm-offset asymmetry: the up-arm and down-arm signed offsets of the ' +
    'imp-97823 |K| decade-growth ratio from sqrt(10) become symmetric (|up|/|down| -> 1) as the ' +
    'near-peak gap g -> 0, because the leading finite-gap correction is antisymmetric',
  definition:
    'Near the imp-97520 L1 sigma peak, the imp-97823 kernel |K| = |1/(N sigma_N)| per-decade ' +
    'growth ratio brackets sqrt(10) = 3.162278 from opposite sides: the up-arm offset from ' +
    'sqrt(10) is always negative, the down-arm offset always positive. imp-124852 measured the ' +
    'asymmetry ratio |up_offset|/|down_offset| and found it climbs toward 1 as the near-peak gap ' +
    'g shrinks (deep window 0.9912 -> 0.9974 -> 1.0000), with each arm offset itself shrinking ' +
    'as |offset| ~ g^(1/2) (deep-window slopes 0.498960 upslope / 0.500881 downslope).',
  mechanism:
    'The asymmetry ratio tending to 1 means the leading O(sqrt(g)) finite-gap correction term ' +
    'has EQUAL magnitude and OPPOSITE sign on the two arms, i.e. it is antisymmetric -- so it ' +
    'exactly cancels in the symmetric sum offset_sum = up_offset + down_offset. imp-124893 ' +
    'confirmed this directly by fitting the collapse slope of offset_sum itself: it decays at ' +
    'slope ~1.036 (~g^1), a full extra half-power of g faster than either arm alone (slope_ratio ' +
    '~2.073, excess_power ~+0.537, extra shrink per decade ~0.291 ~ 1/sqrt(10)), confirming only ' +
    'the next, strictly symmetric order survives once the antisymmetric g^(1/2) term cancels.',
  verificationStatus:
    'Re-cited from the imp-124852 measurement module ' +
    '(src/data/imp-124852-kernel-arm-offset-asymmetry-viz-data.js) and its imp-124893 extension: ' +
    'deep-window asymmetry ratio 0.9912 -> 0.9974 -> 1.0000, per-arm slopes 0.498960 / 0.500881, ' +
    'symmetric-residual collapse slope 1.036429. Naming / glossary headword only; supplies no ' +
    'new bound; DIAG3 == 0 and the C_C 1/8 ansatz are untouched; RH open; Platt-Trudgian ' +
    'Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP124966_KERNEL_ARM_OFFSET_ASYMMETRY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-124966',
  proofSection: 'S-frontier',
  glosses: 'imp-124852',
  question:
    'imp-124852 measured the signed up-arm/down-arm offsets of the imp-97823 kernel |K| ' +
    'decade-growth ratio from sqrt(10) and found the asymmetry ratio climbs toward 1 as the ' +
    'near-peak gap g -> 0 -- what is the headword for this antisymmetric-leading-correction result?',
  headword: KERNEL_ARM_OFFSET_ASYMMETRY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-124852 result: the ' +
    'up-arm/down-arm offsets of the imp-97823 |K| decade-growth ratio from sqrt(10) have an ' +
    'asymmetry ratio |up|/|down| that climbs to 1 as g -> 0 (deep window 0.9912 -> 0.9974 -> ' +
    '1.0000), identifying the leading finite-gap correction as ANTISYMMETRIC (each arm ~g^(1/2), ' +
    'opposite sign) with a strictly higher-order (~g^1) symmetric residual, per the imp-124893 ' +
    'collapse-slope fit. No bound moved; DIAG3 == 0 and all pinned surrogate constants untouched; ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-124852 (the signed arm-offset and asymmetry-ratio measurement this glosses); imp-124893 ' +
    '(the symmetric-residual collapse-slope confirmation); imp-97823 (the sqrt(10) decade-growth ' +
    'fit whose two arms this asymmetry measures); imp-97520 (the L1 sigma peak this straddles).',
});

export default IMP124966_KERNEL_ARM_OFFSET_ASYMMETRY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP124966_KERNEL_ARM_OFFSET_ASYMMETRY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp124966-headword-names-asymmetry-ratio-and-slopes',
    why: 'The headword must name the asymmetry ratio limit and the deep-window fit slopes -- the ' +
      'entire content of the glossary entry.',
    holds: () => {
      const h = IMP124966_KERNEL_ARM_OFFSET_ASYMMETRY_GLOSSARY_HEADWORD.headword;
      return (
        /0\.9912/.test(h.definition) &&
        /1\.0000/.test(h.definition) &&
        /g\^\(1\/2\)/.test(h.definition) &&
        /0\.498960/.test(h.definition) &&
        /1\.036429/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp124966-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-124852.',
    holds: () =>
      IMP124966_KERNEL_ARM_OFFSET_ASYMMETRY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP124966_KERNEL_ARM_OFFSET_ASYMMETRY_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP124966_KERNEL_ARM_OFFSET_ASYMMETRY_GLOSSARY_HEADWORD.verdict) &&
      IMP124966_KERNEL_ARM_OFFSET_ASYMMETRY_GLOSSARY_HEADWORD.glosses === 'imp-124852',
  },
];

for (const assertion of IMP124966_KERNEL_ARM_OFFSET_ASYMMETRY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-124966-kernel-arm-offset-asymmetry-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
