/**
 * @module imp-97325-m2w-rw-mbar-factorization-glossary-headword
 * @fileoverview imp-97325 -- import-light glossary/Concepts headword recording the imp-97285
 *   exact factorization M2w = Rw * Mbar: the Route M inverse-line mean square M2w splits into a
 *   pure full-residue-averaged Bettin-Conrey surrogate Mbar (no inverse map, no Kloosterman
 *   selection, bounded by the same even-moment estimate that bounds DIAG) times a single open
 *   oversampling scalar Rw = X/Xbar measuring how much the inverse residues h_a = b-inverse mod a
 *   oversample the c_0^2 weight relative to a typical residue.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE FACTORIZATION. Writing X = Sum_{a,(a,b)=1} c_0(h_a/a)^2/a for the inverse-line sum and
 *   Xbar = Sum_a E_h[c_0(h/a)^2]/a for the residue-averaged surrogate (drop the inverse map
 *   entirely), M2w = X/Sum_a a and Mbar = Xbar/Sum_a a satisfy the exact identity M2w = Rw * Mbar
 *   with Rw = X/Xbar. This isolates WHICH factor is tractable (Mbar, Bettin-Conrey-bounded) from
 *   WHICH factor is the sole open scalar (Rw, an inverse-residue equidistribution ratio).
 *   (b) MEASURED LEVEL. Rw plateaus at ~1.1..1.25 (b=61..401), numerically level with the
 *   imp-97271 single-modulus OVR ~1.254 plateau (verified to b=64001) -- identifying the imp-97267
 *   OFFDIAG evaluation with the SAME bounded oversampling already named by imp-97203/imp-97225,
 *   not a new co-leading object. Mbar climbs slowly 0.103 -> 0.130, consistent with convergence to
 *   a Bettin-Conrey constant.
 *   (c) SUFFICIENT TARGET. A rigorous certificate M2w < kappa_arith^2 = 0.32546 follows from a
 *   uniform Mbar <= Mbar_max together with Rw <= 0.32546/Mbar_max (~2.5 at measured Mbar ~ 0.13);
 *   measured Rw ~ 1.2 sits ~2x below that target at every measured scale.
 *   (d) STATUS: the residual reduces entirely to one interpretable scalar (Rw, the inverse-map
 *   equidistribution transfer of the imp-97210 ledger) rather than to the whole OFFDIAG object; no
 *   bound moves.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an exact factorization
 *   plus its measured plateau. Not a proof, no uniform Rw bound supplied, NO QED.
 *
 * @see imp-97285-route-m-offdiag-oversampling-factorization.js (source: the exact factorization,
 *   the measured Rw/Mbar ladder, and the refuted resonance-main-term evaluation route)
 * @see imp-97271-route-m-inverse-oversampling-ladder-extended.js (the OVR ~1.254 plateau Rw is
 *   numerically level with)
 * @see imp-97210-route-m-kappa-obligation-ledger.js (ledger naming M2w the sole open scalar)
 *
 * Ticket: imp-97325 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The M2w = Rw*Mbar factorization headword, baked verbatim (no re-import).
const M2W_RW_MBAR_FACTORIZATION_HEADWORD = Object.freeze({
  key: 'm2w-rw-mbar-factorization-imp97285-offdiag-oversampling',
  term:
    'imp-97285 exact factorization M2w = Rw * Mbar: the Route M inverse-line mean square splits ' +
    'into the full-residue-averaged Bettin-Conrey surrogate Mbar (no inverse map) times the single ' +
    'open inverse-residue oversampling scalar Rw = X/Xbar',
  definition:
    'X = Sum_{a,(a,b)=1} c_0(h_a/a)^2/a is the inverse-line sum (h_a = b-inverse mod a) and Xbar = ' +
    'Sum_a E_h[c_0(h/a)^2]/a the residue-averaged surrogate that drops the inverse map entirely. ' +
    'Then M2w = X/Sum_a a and Mbar = Xbar/Sum_a a satisfy the exact identity M2w = Rw * Mbar with ' +
    'Rw = X/Xbar. Mbar is bounded by the same Bettin-Conrey even-moment estimate that bounds DIAG ' +
    '(measured 0.103 -> 0.130 over b=61..401); Rw is the sole open scalar.',
  mechanism:
    'Rw measures how much the inverse residues h_a = b-inverse mod a oversample the c_0(h/a)^2 ' +
    'weight relative to a typical residue mod a. MEASURED Rw plateaus at ~1.1..1.25 (b=61..401), ' +
    'numerically level with the imp-97271 single-modulus OVR ~1.254 plateau (verified to b=64001) ' +
    '-- identifying the imp-97267 OFFDIAG evaluation with the SAME bounded oversampling already ' +
    'named by imp-97203/imp-97225, not a strictly harder new object. A rigorous certificate ' +
    'M2w < kappa_arith^2 = 0.32546 follows from a uniform Mbar <= Mbar_max together with ' +
    'Rw <= 0.32546/Mbar_max (~2.5 at measured Mbar ~ 0.13); measured Rw ~ 1.2 sits ~2x below that ' +
    'sufficient target at every measured scale.',
  verificationStatus:
    'Re-cited from the imp-97285 measurement module ' +
    '(src/data/imp-97285-route-m-offdiag-oversampling-factorization.js), exact O(b^3) kernels ' +
    '(factorization residual M2w - Rw*Mbar < 1e-9 at b=101,151). Naming / glossary headword only; ' +
    'supplies no uniform Rw bound (the imp-97210 ledger sub-gap stays open); no bound moved; RH ' +
    'open; no refereed bound is changed; NO QED.',
});

export const IMP97325_M2W_RW_MBAR_FACTORIZATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97325',
  proofSection: 'Route-M',
  glosses: 'imp-97285',
  question:
    'imp-97285 factored the imp-97267 OFFDIAG evaluation into M2w = Rw * Mbar, isolating the ' +
    'certified full-residue surrogate Mbar from the single open oversampling scalar Rw. What is ' +
    'the headword for this factorization, and does it move any bound?',
  headword: M2W_RW_MBAR_FACTORIZATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97285 exact ' +
    'factorization M2w = Rw * Mbar: Mbar the residue-averaged, inverse-map-free Bettin-Conrey ' +
    'surrogate (certified bounded), Rw = X/Xbar the single open oversampling scalar (measured ' +
    '~1.1..1.25, level with the imp-97271 OVR ~1.254 plateau). No bound moved; the imp-97210 ' +
    'ledger sub-gap stays open; NO QED. No refereed bound is changed.',
  citation:
    'imp-97285 (the exact factorization, measured Rw/Mbar ladder, and refuted resonance-main-term ' +
    'route this glosses); imp-97271 (the OVR ~1.254 plateau Rw is level with); imp-97210 (the ' +
    'ledger naming M2w the sole open scalar).',
});

export default IMP97325_M2W_RW_MBAR_FACTORIZATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97325_M2W_RW_MBAR_FACTORIZATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97325-headword-cites-factorization-and-plateau',
    why: 'The headword must name the exact factorization identity and the measured Rw plateau ' +
      'level with the imp-97271 OVR -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97325_M2W_RW_MBAR_FACTORIZATION_GLOSSARY_HEADWORD.headword;
      return (
        /M2w = Rw \* Mbar/.test(h.definition) &&
        /Rw = X\/Xbar/.test(h.definition) &&
        /1\.254/.test(h.mechanism) &&
        /0\.32546/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97325-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, sub-gap left open, no QED, no-refereed-bound-change line ' +
      'present.',
    holds: () =>
      IMP97325_M2W_RW_MBAR_FACTORIZATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97325_M2W_RW_MBAR_FACTORIZATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97325_M2W_RW_MBAR_FACTORIZATION_GLOSSARY_HEADWORD.verdict) &&
      IMP97325_M2W_RW_MBAR_FACTORIZATION_GLOSSARY_HEADWORD.glosses === 'imp-97285',
  },
];

for (const assertion of IMP97325_M2W_RW_MBAR_FACTORIZATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97325-m2w-rw-mbar-factorization-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
