/**
 * @module imp-97842-kernel-decade-growth-sqrt10-glossary-headword
 * @fileoverview imp-97842 -- import-light glossary/Concepts headword recording the imp-97823
 *   inverse-square-root kernel-fold law: the shared reconstruction kernel |K| = |1/(N sigma_N)|
 *   near the imp-97520 L1 sigma peak grows EXACTLY sqrt(10) = 10^(1/2) per decade that the
 *   near-peak gap g = sigma_max - sigma shrinks, in the deep-limit measurement.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE RESULT. Near the interior sigma peak (quadratic fold sigma = sigma_max -
 *   A*(x - x_peak)^2 + ..., x = ln N), the kernel K = -1/(d sigma / d ln N) obeys
 *   |K| = 1/(2 sqrt(A g)) ~ g^(-1/2). imp-97823 pinned this precisely on both arms: the
 *   deep-window (g = 1e-5..1e-8) least-squares slope of log10|K| vs log10(g) is p = -0.4994
 *   (upslope) / -0.5006 (downslope), i.e. per-decade growth 3.158 / 3.167 against
 *   sqrt(10) = 3.162278, log-linear residual ~4e-4.
 *   (b) WHY IT IS NEW. imp-97721 reported the |K| decade growth only QUALITATIVELY
 *   (~sqrt(10)). imp-97823 tests and confirms the EXACT exponent -1/2 hypothesis to the
 *   deep-limit measurement floor and separates it from the far-from-peak apparent departure.
 *   (c) WHY IT MATTERS. The far-from-peak naive full-ladder growth (2.90 upslope / 3.36
 *   downslope over g = 1e-1..1e-7) is NOT sqrt(10); imp-97823 shows this is an O(sqrt(g))
 *   running correction (the cubic-fold term) that decays by ~1/sqrt(10) per decade and is
 *   opposite-signed on the two arms, not a distinct exponent -- so the sqrt(10) fold law is
 *   an asymptotic (deep-limit) statement, not a global one.
 *   (d) WHY IT DOES NOT MOVE ANY BOUND. This is a reconstruction-kernel Jacobian-scaling
 *   fact about the imp-97520 conditional-share diagnostic. DIAG3 == 0 (the three-axis
 *   cancellation) is untouched; the C_C 1/8 ansatz, E_trunc, and C_F prefactor are all
 *   fixed surrogate inputs, unchanged; no operator positivity established; no RH verdict.
 *   (e) STATUS: documentation only. No bound moved; no coefficient pinned beyond re-citing
 *   the imp-97823 fit; the rigorous anchor stays the trace ceiling; NO QED.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an already-established
 *   measurement. Not a new derivation. NO QED.
 *
 * @see imp-97823-kernel-decade-growth-sqrt10.js (source: the deep-limit sqrt(10) fit this
 *   headword names)
 * @see imp-97721-diag3-peak-upslope-crossvalidation (kernel |K| ~ sqrt(10) per decade,
 *   reported qualitatively)
 * @see imp-97520-sigma-conditional-share-landmark-ladder (L1 peak sigma_max ~ 0.949429,
 *   N_peak ~ 9.22e5)
 *
 * Ticket: imp-97842 (content, low, sonnet-4-6). Documentation only; establishes nothing new;
 * NO QED; Platt-Trudgian Lambda <= 0.2 SOTA.
 */

// The kernel-fold sqrt(10) headword, baked verbatim (no re-import of the heavy zeros bundle).
const KERNEL_DECADE_GROWTH_SQRT10_HEADWORD = Object.freeze({
  key: 'kernel-decade-growth-sqrt10-imp97823',
  term:
    'Inverse-square-root kernel-fold law: the reconstruction kernel |K| = |1/(N sigma_N)| grows ' +
    'exactly sqrt(10) per decade of gap approaching the imp-97520 L1 sigma peak',
  definition:
    'Near the interior sigma peak (quadratic fold sigma(x) = sigma_max - A*(x - x_peak)^2 + ..., ' +
    'x = ln N), the shared reconstruction kernel K = -1/(d sigma / d ln N) satisfies ' +
    '|K| = 1/(2 sqrt(A) sqrt(g)) ~ g^(-1/2), where g = sigma_max - sigma is the near-peak gap. ' +
    'A pure inverse-square-root law means |K| multiplies by sqrt(10) = 3.162278 for every decade ' +
    'that g shrinks. imp-97823 confirms this to the deep-limit (g = 1e-5..1e-8) measurement floor: ' +
    'per-decade growth 3.158 (upslope) / 3.167 (downslope), log-linear residual ~4e-4.',
  mechanism:
    'The far-from-peak apparent departure (naive full-ladder growth 2.90 upslope / 3.36 downslope ' +
    'over g = 1e-1..1e-7) is NOT a distinct exponent: it is an O(sqrt(g)) running correction from ' +
    'the cubic term in the peak expansion, injecting opposite-signed amplitude drift on the two ' +
    'arms. The per-decade deviation |ratio - sqrt(10)| decays geometrically by ~1/sqrt(10) per ' +
    'decade, and the two arms bracket sqrt(10) from opposite sides as the gap shrinks toward the ' +
    'deep-limit floor.',
  verificationStatus:
    'Re-cited from the imp-97823 measurement module ' +
    '(src/data/imp-97823-kernel-decade-growth-sqrt10.js): deep-window LS slope p = -0.4994 ' +
    '(upslope) / -0.5006 (downslope) brackets -1/2 to ~1e-3 on both arms, log-linear residual ' +
    '~4e-4. Naming / glossary headword only; supplies no new bound; DIAG3 == 0 and the C_C 1/8 ' +
    'ansatz are untouched; RH open; Platt-Trudgian Lambda <= 0.2 remains SOTA; NO QED.',
});

export const IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97842',
  proofSection: 'S-frontier',
  glosses: 'imp-97823',
  question:
    'imp-97823 pinned the imp-97721 reconstruction-kernel |K| = |1/(N sigma_N)| per-decade growth ' +
    'precisely at exactly sqrt(10) = 10^(1/2) in the deep-limit near the imp-97520 L1 sigma peak -- ' +
    'what is the headword for this result?',
  headword: KERNEL_DECADE_GROWTH_SQRT10_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Names the imp-97823 deep-limit result: ' +
    'the reconstruction kernel |K| = |1/(N sigma_N)| grows sqrt(10) = 3.162278 per decade of ' +
    'near-peak gap (deep-window slope p = -0.4994 / -0.5006, residual ~4e-4), with the far-from-peak ' +
    'apparent departure identified as an O(sqrt(g)) running correction, not an exponent shift. No ' +
    'bound moved; DIAG3 == 0 and all pinned surrogate constants untouched; NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-97823 (the deep-limit sqrt(10) fit this glosses); imp-97721 (the qualitative kernel ' +
    'observation refined here); imp-97520 (the L1 sigma peak this measurement straddles).',
});

export default IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97842-headword-names-sqrt10-and-slopes',
    why: 'The headword must name the sqrt(10) constant and the deep-window fit slopes -- the ' +
      'entire content of the glossary entry.',
    holds: () => {
      const h = IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD.headword;
      return (
        /sqrt\(10\)/.test(h.definition) &&
        /3\.162278/.test(h.definition) &&
        /g\^\(-1\/2\)/.test(h.definition) &&
        /-0\.4994/.test(h.verificationStatus) &&
        /-0\.5006/.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp97842-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, PT SOTA line present, glosses imp-97823.',
    holds: () =>
      IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD.verdict) &&
      /remains SOTA/.test(IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD.verdict) &&
      IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD.glosses === 'imp-97823',
  },
];

for (const assertion of IMP97842_KERNEL_DECADE_GROWTH_SQRT10_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97842-kernel-decade-growth-sqrt10-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
