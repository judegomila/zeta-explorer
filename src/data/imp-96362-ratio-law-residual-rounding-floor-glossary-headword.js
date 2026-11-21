/**
 * @module imp-96362-ratio-law-residual-rounding-floor-glossary-headword
 * @fileoverview imp-96362 -- import-light glossary/Concepts headword for the imp-96327
 *   verdict: the E_coll cross-column ratio-law residual (9.558e-7) between the two
 *   independently baked imp-96290 anchors and their imp-96311 target ratio is a
 *   7-sig-fig ROUNDING-FLOOR ARTIFACT, not a genuine discrepancy -- and this tight
 *   agreement does NOT close G6_polymath15_bridge.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-96327 measured that the anchor ratio E_coll(0.127,1e4)/E_coll(1/8,1e4) =
 *   1.0160009558 matches the imp-96311 target C_H ratio 0.127/0.125 = 1.016 to a
 *   residual of 9.558e-7, comfortably inside the ~9.26e-6 rounding band the two
 *   7-sig-fig anchors carry. A reader landing on that result cold could read the
 *   tight agreement as evidence FOR the conditional bound C_H<=0.127, or as
 *   progress toward closing G6_polymath15_bridge. Neither is true: the agreement
 *   is exactly what 7-significant-figure storage predicts, and the bound status is
 *   untouched. This headword bakes that distinction verbatim (no re-import of the
 *   imp-96327 module, to stay import-light) as a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The imp-96327 anchor-ratio residual (9.558e-7 against a target of 1.016) is a
 *   7-sig-fig ROUNDING-FLOOR ARTIFACT: each of the two independently baked
 *   imp-96290 anchors is stored to 7 significant figures, so their ratio inherits
 *   a rounding-limited slack of ~9.26e-6 (half-ULP in each operand), and the
 *   measured residual sits well inside that band. This is NOT independent
 *   corroboration of the conditional bound C_H<=0.127, and it does NOT close
 *   G6_polymath15_bridge.
 *
 *   MECHANISM: the imp-96311 ratio law E_coll(C_H_a,N)/E_coll(C_H_b,N) =
 *   C_H_a/C_H_b is structurally guaranteed by the identity E_coll = C_H * R(N),
 *   under which the C_H factor cancels the N-dependence in the ratio identically.
 *   Checking that identity against two anchors stored to finite precision can
 *   only ever measure the storage precision itself, not add new evidence for the
 *   unproven bound.
 *
 *   STATUS: an ACCURACY-AUDIT gloss, not a bound move. C_H<=0.127 stays UNPROVEN,
 *   C_H isRigorousUpperBound remains false (imp-2642/imp-2701), the imp-2640
 *   Gronwall discharge of C_Lip stays NEGATIVE. G6_polymath15_bridge stays open.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-96327 verdict for quick reference.
 *   It establishes nothing, instantiates no interval, closes no sub-gap, moves no
 *   bound. NO QED. No refereed bound is changed.
 *
 * @see imp-96327-ecoll-ratio-law-vs-anchor-crossvalidation (source: the residual this glosses)
 * @see imp-96311-ecoll-rate-ch-independence-tabulation (the ratio law and C_H values)
 * @see imp-96290-step4-bridge-subconstant-inventory (the two independently baked anchors)
 *
 * Ticket: imp-96362 (content, low). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The rounding-floor-artifact-vs-G6-still-open headword, baked verbatim (no re-import).
const RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_HEADWORD = Object.freeze({
  key: 'ecoll-ratio-law-residual-is-rounding-floor-artifact-not-g6-progress',
  term:
    'imp-96327 verdict: the E_coll cross-column ratio-law residual (9.558e-7) between the ' +
    'two independently baked imp-96290 anchors is a 7-sig-fig rounding-floor artifact, not ' +
    'a discrepancy, and does not close G6_polymath15_bridge',
  definition:
    'imp-96327 measured that the anchor ratio E_coll(0.127,1e4)/E_coll(1/8,1e4) = ' +
    '1.0160009558 matches the imp-96311 target C_H ratio 0.127/0.125 = 1.016 to a ' +
    'residual of 9.558e-7. Each anchor is stored to only 7 significant figures, so the ' +
    'ratio carries a rounding-limited slack of ~9.26e-6 (half-ULP in each operand) -- the ' +
    'measured residual sits well inside that band, so the tight agreement is exactly what ' +
    'finite-precision storage predicts, not a new independent confirmation.',
  mechanism:
    'The imp-96311 ratio law E_coll(C_H_a,N)/E_coll(C_H_b,N) = C_H_a/C_H_b is structurally ' +
    'guaranteed by the identity E_coll = C_H * R(N): the C_H factor cancels the N-dependent ' +
    'rate term identically in the ratio, for ANY C_H. Checking that identity against two ' +
    'finite-precision anchors can only measure the storage precision itself -- it cannot ' +
    'supply new evidence for or against the unproven conditional bound C_H<=0.127.',
  verificationStatus:
    'ACCURACY-AUDIT gloss, not a bound move. C_H<=0.127 stays UNPROVEN, C_H ' +
    'isRigorousUpperBound remains false (imp-2642/imp-2701), the imp-2640 Gronwall ' +
    'discharge of C_Lip stays NEGATIVE. G6_polymath15_bridge stays open either way. No refereed bound is changed' +
    '; RH open; NO QED.',
});

export const IMP96362_RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-96362',
  proofSection: 'S-frontier',
  glosses: 'imp-96327',
  question:
    'imp-96327 found the E_coll cross-column ratio-law residual (9.558e-7) sits inside the ' +
    'anchors\' 7-sig-fig rounding band. Should a reader take that tight agreement as ' +
    'evidence toward the conditional bound C_H<=0.127 or as progress on ' +
    'G6_polymath15_bridge?',
  headword: RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-96327 verdict: ' +
    'the anchor-ratio residual (9.558e-7 against target 1.016) is a 7-sig-fig ' +
    'ROUNDING-FLOOR ARTIFACT -- structurally guaranteed by E_coll = C_H * R(N) -- and NOT ' +
    'independent corroboration of the conditional bound. C_H<=0.127 stays UNPROVEN, C_H ' +
    'isRigorousUpperBound = false, G6_polymath15_bridge stays open. Establishes nothing; ' +
    'instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-96327 (the residual this glosses); imp-96311 (the ratio law and C_H values); ' +
    'imp-96290 (the two independently baked anchors).',
});

export default IMP96362_RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP96362_RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp96362-headword-has-required-fields',
    why: 'The headword must name the measured residual, the target ratio, the rounding ' +
      'band, and the structural E_coll = C_H * R(N) mechanism -- the entire point of the ' +
      'glossary entry.',
    holds: () => {
      const h = IMP96362_RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_GLOSSARY_HEADWORD.headword;
      return (
        /9\.558e-7|9\.56e-7/.test(h.definition) &&
        /1\.016/.test(h.definition) &&
        /9\.26e-6/.test(h.definition) &&
        /E_coll = C_H \* R\(N\)/.test(h.mechanism)
      );
    },
  },
  {
    id: 'imp96362-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present, G6 ' +
      'stays open.',
    holds: () =>
      IMP96362_RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP96362_RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP96362_RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_GLOSSARY_HEADWORD.verdict) &&
      /G6_polymath15_bridge stays open/.test(
        IMP96362_RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_GLOSSARY_HEADWORD.verdict,
      ) &&
      IMP96362_RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_GLOSSARY_HEADWORD.glosses === 'imp-96327',
  },
];

for (const assertion of IMP96362_RATIO_LAW_RESIDUAL_ROUNDING_FLOOR_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-96362-ratio-law-residual-rounding-floor-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
