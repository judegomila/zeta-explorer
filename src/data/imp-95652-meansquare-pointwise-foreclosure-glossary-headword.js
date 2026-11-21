/**
 * @module imp-95652-meansquare-pointwise-foreclosure-glossary-headword
 * @fileoverview imp-95652 -- import-light glossary/Concepts headword for the imp-95604 verdict:
 *   the imp-95526 T2 Kronecker continuum-sup saturation forecloses the TRANSFER MECHANISM from a
 *   mean-square (L^2-in-T) pair-correlation input to the pointwise (L^infinity-in-T) Hilbert-transform
 *   bound the sub-0.14 contract needs -- because the Kronecker-sharp sqrt(H) transfer constant
 *   exactly cancels the H^{-1/2} mean-square saving -- but this leaves the contract value AT THE
 *   ANCHOR height UNDECIDED, not refuted: Kronecker exhibits a saturating set without locating it at
 *   the anchor, so the anchor stays PCC-gated.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95604 assembled the L^2 -> L^infinity transfer-constant argument and the Kronecker/Weyl
 *   sharpness witness, but a reader landing on that module cold has no quick-lookup definition of
 *   what "the transfer constant", "the mean-square saving", and the FORECLOSED-vs-UNDECIDED split
 *   name. This headword bakes those facts VERBATIM (no re-import of the imp-95604 module, to stay
 *   import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The two objects: Montgomery F(alpha) is a MEAN SQUARE over gamma in [0, T] (an L^2-in-T average
 *   of the local zero counting, giving for-most-T statements at the Selberg-CLT scale). The contract
 *   needs the local zero sum POINTWISE at the single anchor height T-star = heightT(690988), i.e. an
 *   L^infinity-in-T Hilbert-transform bound, i.e. a zero-free half-strip sigma > sigma_B = 0.59045 at
 *   T-star. The question: does a mean-square bound transfer to a pointwise bound at a prescribed
 *   height. The cancellation: the L^2 -> L^infinity transfer for a packet of H ~ 6.70e7 essentially-
 *   independent frequencies loses a factor up to sqrt(H) ~ 8.19e3; the mean-square saving is
 *   H^{-1/2} ~ 1.22e-4; their product is EXACTLY 1 -- a perfect mean-square input transfers to the
 *   TRIVIAL size. Kronecker sharpness (imp-95526 T2, Q-linear independence of {log n}) forces this
 *   sqrt(H) transfer constant to be ATTAINED (sup_T attains the triangle bound while the time-average
 *   of |g|^2 stays exactly the L^2 baseline), so no special packet structure can beat it -- this is
 *   confirmed by a numerical witness (measured sup/rms tracking the theoretical transfer constant to
 *   ~1pct across prime-set sizes). Verdict split: the TRANSFER ROUTE is FORECLOSED (no gap: Kronecker
 *   sharpness rules out a smaller transfer constant), but the CONTRACT AT THE ANCHOR is UNDECIDED,
 *   not refuted (Kronecker's saturating set is not located at T-star, so it gives no pointwise lower
 *   bound there, just as PCC gives no pointwise upper bound there); the anchor stays PCC-gated, and
 *   the only residual lever is pointwise zero-location (RH-hard, out of reach) at T-star.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95604 transfer-cancellation argument and the
 *   FORECLOSED/UNDECIDED split for quick reference. It establishes nothing, instantiates no interval,
 *   closes no sub-gap, moves no bound. imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95604-meansquare-pointwise-upgrade-foreclosure (source: the transfer-constant argument and FORECLOSED/UNDECIDED verdict this glosses)
 * @see imp-95526-kronecker-continuum-sup-t2 (source: the Kronecker continuum-sup saturation, T2)
 * @see imp-95519-localized-barrier-sum-prime-zero-nogo (the sub-0.14 contract and sigma_B = 0.59045 anchor)
 * @see imp-95581 (the demand-side dual: the for-most-T contract relaxation, also FORECLOSED)
 *
 * Ticket: imp-95652 (content, medium). Documentation only; establishes nothing; transfer route stays
 * FORECLOSED / anchor stays UNDECIDED per imp-95604; NO QED; no refereed bound is changed.
 */

// The mean-square -> pointwise transfer-foreclosure glossary headword, baked verbatim (no re-import).
const MEANSQUARE_POINTWISE_FORECLOSURE_HEADWORD = Object.freeze({
  key: 'meansquare-pointwise-transfer-foreclosure',
  term: 'imp-95604 verdict: the mean-square -> pointwise transfer is FORECLOSED, the anchor contract is UNDECIDED',
  definition:
    'The L^2 -> L^infinity (Bernstein / Nikolskii) transfer for a Fresnel packet of H ~ 6.70e7 ' +
    'essentially-independent frequencies loses a factor up to sqrt(H) ~ 8.19e3, while the mean-' +
    'square "square-root cancellation" saving is H^{-1/2} ~ 1.22e-4. Their product is EXACTLY 1: a ' +
    'perfect mean-square (Montgomery F(alpha)) input transfers to a pointwise Hilbert-transform ' +
    'bound of exactly the TRIVIAL size.',
  kroneckerSharpness:
    'imp-95526 T2 (Kronecker/Weyl, using the Q-linear independence of {log n}) forces the sqrt(H) ' +
    'transfer constant to be ATTAINED, not merely an upper bound: sup_T of the packet reaches the ' +
    'triangle bound while its time-average |g|^2 stays exactly the L^2 baseline, so no special ' +
    'packet structure can transfer with a smaller constant. A numerical witness confirms measured ' +
    'sup/rms tracks the theoretical transfer constant to ~1pct across prime-set sizes.',
  transferRouteForeclosed:
    'No gap: Kronecker sharpness rules out a smaller transfer constant, so a mean-square PCC input ' +
    'can never be leveraged into the pointwise bound the sub-0.14 contract needs. The upgrade ' +
    'mechanism is genuinely FORECLOSED.',
  anchorUndecided:
    'Kronecker exhibits a positive-measure saturating set but does NOT locate it at the anchor ' +
    'height T-star = heightT(690988): no pointwise lower bound at T-star from Kronecker, no ' +
    'pointwise upper bound at T-star from PCC. The contract value at the anchor is UNDECIDED, not ' +
    'refuted, and stays PCC-gated; the only residual lever is pointwise zero-location (a zero-free ' +
    'half-strip sigma > sigma_B, RH-hard, out of reach) at T-star.',
});

export const IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95652',
  proofSection: 'S-frontier',
  glosses: 'imp-95604',
  scopes: 'imp-95526',
  question:
    'imp-95604 decided that the imp-95526 T2 Kronecker continuum-sup saturation forecloses the ' +
    'mean-square -> pointwise transfer mechanism but leaves the anchor contract undecided. What is ' +
    'the transfer constant, why does it cancel the mean-square saving, and why is the verdict a ' +
    'FORECLOSED/UNDECIDED split rather than a single verdict, for a reader landing cold?',
  headword: MEANSQUARE_POINTWISE_FORECLOSURE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95604 transfer-constant ' +
    'argument: the Kronecker-sharp sqrt(H) L^2 -> L^infinity transfer constant exactly cancels the ' +
    'H^{-1/2} mean-square saving, so the transfer mechanism is FORECLOSED, while the contract value ' +
    'at the anchor remains UNDECIDED (not refuted) and PCC-gated. Establishes nothing; instantiates ' +
    'no interval; moves no bound; NO QED. No refereed bound is changed.',
  citation:
    'imp-95604 (transfer-constant argument and FORECLOSED/UNDECIDED verdict); imp-95526 T2 ' +
    '(Kronecker continuum-sup saturation); imp-95519 sec 4 (the sub-0.14 contract and sigma_B ' +
    'abscissa); imp-95581 (the demand-side dual, also FORECLOSED).',
});

export default IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95652-headword-has-required-fields',
    why: 'The headword must name the transfer constant, the mean-square saving, and both the FORECLOSED route and UNDECIDED anchor reasons -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD.headword;
      return (
        /sqrt\(H\)/.test(h.definition) &&
        /H\^\{-1\/2\}/.test(h.definition) &&
        /FORECLOSED/.test(h.transferRouteForeclosed) &&
        /UNDECIDED/.test(h.anchorUndecided)
      );
    },
  },
  {
    id: 'imp95652-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, transfer route stays FORECLOSED, anchor stays UNDECIDED, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD.verdict) &&
      /FORECLOSED/.test(IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD.verdict) &&
      /UNDECIDED/.test(IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD.verdict) &&
      IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD.glosses === 'imp-95604' &&
      IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD.scopes === 'imp-95526',
  },
];

for (const assertion of IMP95652_MEANSQUARE_POINTWISE_FORECLOSURE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95652-meansquare-pointwise-foreclosure-glossary-headword assertion failed: ${assertion.id}`);
  }
}
