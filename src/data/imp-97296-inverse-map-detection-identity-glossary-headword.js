/**
 * @module imp-97296-inverse-map-detection-identity-glossary-headword
 * @fileoverview imp-97296 -- import-light glossary/Concepts headword recording the imp-97267
 *   inverse-map (Kloosterman-type) character-detection identity: the exact, unconditional
 *   decomposition M2w * Sum_a a = DIAG + OFFDIAG obtained by detecting the single inverse
 *   residue h_a = b-inverse mod a via additive characters mod a. DIAG is the phi-weighted
 *   aggregate of tractable full-residue second moments (the m=0 term); OFFDIAG is the real
 *   Kloosterman/Estermann-type twisted-moment defect (the m != 0 terms), measured to carry
 *   ~HALF of M2w (net positive, stable across b=101..401) -- so the transfer is an EVALUATION
 *   problem, not a Weil-bound problem.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   (a) THE IDENTITY. Detecting 1[h == h_a] mod a via additive characters and folding the
 *   inverse-line weight gives, for the full-residue second moment M2w = (Sum_a c_0(h_a/a)^2/a)
 *   / (Sum_a a):
 *       M2w * Sum_a a = DIAG + OFFDIAG,
 *       DIAG    = Sum_a phi(a) E_h[(c_0(h/a)/a)^2]                                (m = 0 term)
 *       OFFDIAG = Sum_a a^{-2} Sum_{m=1}^{a-1} e(-m/a) T_a(m),
 *       T_a(m)  = Sum_{h mod a}* c_0(h/a)^2 e(mbh/a)   (Kloosterman/Estermann-type twisted sum).
 *   The identity is exact and unconditional, closing to ~1e-8 (cot precision), with OFFDIAG
 *   real to ~1e-13 imaginary residual, as required.
 *   (b) OFFDIAG IS CO-LEADING, NOT A REMAINDER. Measured (b = 101..401): OFFDIAG/DIAG stays in
 *   0.94..1.05 (net positive), i.e. OFFDIAG carries ~half of M2w at every sampled b -- M2w ~ 2
 *   DIAG. A Weil/Kloosterman BOUND on |T_a(m)| that treats OFFDIAG as a lower-order error term
 *   would therefore discard half the mass; it cannot certify M2w below the target 0.32546.
 *   (c) SHARPENED OBSTRUCTION. The open input is reframed from "absorb a bounded ~1.25
 *   oversampling" (imp-97203/imp-97225) to "EVALUATE the net off-diagonal twisted second
 *   moment" -- establish OFFDIAG's sign and size relative to DIAG, not merely bound |T_a(m)|.
 *   (d) STATUS: measurement + an exact identity, not a certification. M2w stays MEASURED ~0.16,
 *   sqrt(M2w) ~ 0.40 stays below kappa_arith = 0.5705, but this is unchanged from imp-97203/
 *   imp-97225 -- no bound moved. The evaluation sub-gap stays open.
 *
 *   STATUS: documentation only -- a Concepts glossary headword recording an exact identity plus
 *   a measured co-leading term. Not a proof, not a certified bound, no uniform remainder
 *   supplied. NO QED.
 *
 * @see imp-97267-route-m-inverse-map-kloosterman-transfer.js (source: the identity, the
 *   DIAG/OFFDIAG ladder b=101..401, the sharpened evaluation-not-bound obstruction)
 * @see imp-97203-route-m-cotangent-absvalue-first-moment-cauchy-schwarz.js (parent: c_1 <=
 *   sqrt(M2w), the Cauchy-Schwarz ceiling this identity feeds)
 * @see imp-97210-route-m-kappa-obligation-ledger.js (ledger: M2w is the sole open scalar)
 * @see imp-97225-route-m-inverse-oversampling-ratio-ladder.js (sibling: OVR ~1.25 single-
 *   modulus reference, a different comparison, unchanged)
 *
 * Ticket: imp-97296 (content, low, sonnet-4-6). Documentation only; establishes nothing;
 * NO QED; no refereed bound is changed.
 */

// The inverse-map detection-identity headword, baked verbatim (no re-import).
const INVERSE_MAP_DETECTION_IDENTITY_HEADWORD = Object.freeze({
  key: 'inverse-map-detection-identity-imp97267-diag-offdiag',
  term:
    'imp-97267 inverse-map character-detection identity: the exact unconditional decomposition ' +
    'M2w * Sum_a a = DIAG + OFFDIAG obtained by detecting the inverse residue h_a mod a via ' +
    'additive characters, with OFFDIAG the real Kloosterman-type twisted-moment defect measured ' +
    'to carry ~half of M2w',
  definition:
    'For the full-residue second moment M2w = (Sum_{a=2,(a,b)=1}^{b-1} c_0(h_a/a)^2/a) / ' +
    '(Sum_a a) (h_a = b-inverse mod a, c_0 the Vasyunin/Bettin-Conrey cotangent sum), detecting ' +
    '1[h == h_a] mod a via additive characters gives M2w * Sum_a a = DIAG + OFFDIAG, where ' +
    'DIAG = Sum_a phi(a) E_h[(c_0(h/a)/a)^2] is the m=0 phi-weighted aggregate of tractable ' +
    'full-residue second moments, and OFFDIAG = Sum_a a^{-2} Sum_{m=1}^{a-1} e(-m/a) T_a(m), ' +
    'T_a(m) = Sum_{h mod a}* c_0(h/a)^2 e(mbh/a), is the real Kloosterman/Estermann-type ' +
    'twisted-moment sum over m != 0. The identity closes to ~1e-8 (cot precision) and OFFDIAG ' +
    'is real to ~1e-13 imaginary residual, at every measured b = 101..401.',
  mechanism:
    'OFFDIAG is NOT a lower-order remainder: measured OFFDIAG/DIAG stays in 0.94..1.05 (net ' +
    'positive) across b = 101, 151, 211, 301, 401, i.e. OFFDIAG carries ~half of M2w (M2w ~ 2 ' +
    'DIAG) at every sampled b. Because the off-diagonal sits at the SAME order as the diagonal, ' +
    'a Weil/Kloosterman BOUND on |T_a(m)| -- estimating it as a negligible error on top of DIAG ' +
    '-- would discard half the mass and cannot certify M2w. The open obligation is therefore an ' +
    'EVALUATION of the net off-diagonal (its sign and size relative to DIAG), sharper than the ' +
    'earlier "absorb a bounded ~1.25 oversampling" framing (imp-97203/imp-97225).',
  verificationStatus:
    'Re-cited from the imp-97267 measurement module ' +
    '(src/data/imp-97267-route-m-inverse-map-kloosterman-transfer.js), exact O(b^3) kernels, ' +
    'b = 101..401, identity residual ~1e-8, OFFDIAG imaginary residual ~1e-13. Naming / glossary ' +
    'headword only; supplies no certification of M2w (M2w stays MEASURED ~0.16); no bound moved; ' +
    'RH open; no refereed bound is changed; NO QED.',
});

export const IMP97296_INVERSE_MAP_DETECTION_IDENTITY_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-97296',
  proofSection: 'Route-M',
  glosses: 'imp-97267',
  question:
    'imp-97267 wrote the inverse-map (Kloosterman-type) equidistribution transfer as an exact ' +
    'character-detection identity M2w * Sum_a a = DIAG + OFFDIAG and measured OFFDIAG ~ DIAG. ' +
    'What is the headword for this identity, and does it move any bound?',
  headword: INVERSE_MAP_DETECTION_IDENTITY_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Records the imp-97267 exact ' +
    'unconditional identity M2w * Sum_a a = DIAG + OFFDIAG (DIAG the m=0 phi-weighted ' +
    'full-residue aggregate, OFFDIAG the real m != 0 Kloosterman-type twisted-moment defect), ' +
    'plus the measurement that OFFDIAG carries ~half of M2w (net positive, co-leading, not a ' +
    'remainder) -- sharpening the open obligation from a Weil-bound absorption to an EVALUATION ' +
    'of the net off-diagonal. No bound moved; M2w stays measured ~0.16; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-97267 (the identity, the DIAG/OFFDIAG ladder b=101..401, the sharpened obstruction this ' +
    'glosses); imp-97203 (the parent Cauchy-Schwarz ceiling c_1 <= sqrt(M2w)); imp-97210 (the ' +
    'obligation ledger naming M2w as the sole open scalar); imp-97225 (the OVR ~1.25 ' +
    'single-modulus sibling comparison, unchanged).',
});

export default IMP97296_INVERSE_MAP_DETECTION_IDENTITY_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP97296_INVERSE_MAP_DETECTION_IDENTITY_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp97296-headword-cites-identity-and-measurement',
    why: 'The headword must name the exact DIAG+OFFDIAG identity and the measured co-leading ' +
      'ratio -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP97296_INVERSE_MAP_DETECTION_IDENTITY_GLOSSARY_HEADWORD.headword;
      return (
        /DIAG \+ OFFDIAG/.test(h.definition) &&
        /Kloosterman/i.test(h.definition) &&
        /0\.94\.\.1\.05/.test(h.mechanism) &&
        /EVALUATION/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp97296-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, M2w left measured (not certified), no ' +
      'QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP97296_INVERSE_MAP_DETECTION_IDENTITY_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP97296_INVERSE_MAP_DETECTION_IDENTITY_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP97296_INVERSE_MAP_DETECTION_IDENTITY_GLOSSARY_HEADWORD.verdict) &&
      IMP97296_INVERSE_MAP_DETECTION_IDENTITY_GLOSSARY_HEADWORD.glosses === 'imp-97267',
  },
];

for (const assertion of IMP97296_INVERSE_MAP_DETECTION_IDENTITY_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-97296-inverse-map-detection-identity-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
