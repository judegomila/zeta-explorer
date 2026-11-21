/**
 * @module imp-95957-sign-image-scope-note-glossary-headword
 * @fileoverview imp-95957 -- import-light Concepts scope note: the imp-95917 physical
 *   weighted image theta_phys and the imp-95918 residue-uniform mean <theta_C> are BOTH
 *   images of the residue-mean / kernel-sign object, NOT the true physical per-window
 *   theta -- the imp-95212 Fresnel-Airy envelope port stays open.
 *
 *   WHY A SCOPE NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95918 measures the residue-UNIFORM mean <theta_C> = (p tr(G) - S)/((p-1) S), an
 *   exact closed form that averages the cosine UNIFORMLY over residues n = 1..p-1. imp-95917
 *   derives a "physical weighted" image theta_phys that folds the cosine against the true
 *   von-Mangoldt x Fresnel-Airy weight w(n) = Lambda(n) K_k(n) instead of the uniform
 *   average. It is tempting to read imp-95917's label "physical" as meaning theta_phys IS
 *   the true per-window theta -- it is not. imp-95917 STEP 4/5 is explicit that its
 *   numerical witnesses use a NONNEGATIVE Gaussian PROXY for |K_k|, not the true signed
 *   Fresnel-Airy kernel, and its strict-below-1 conclusion is CONDITIONAL on the unproven
 *   hypothesis K_k >= 0. So theta_phys as evaluated is itself an IMAGE of the kernel-sign
 *   object under a proxy substitution, exactly as <theta_C> is an image of the residue-mean
 *   object under the uniform-average substitution. Neither is the true physical theta with
 *   the honest signed Fresnel-Airy envelope; a reader landing on either module cold could
 *   otherwise conflate imp-95917's "physical" label with a closed evaluation.
 *
 *   THE SCOPE NOTE
 *   -----------------------------------------------
 *   Both reported sign images -- <theta_C> (imp-95918, residue-uniform mean, exact,
 *   decays ~1/(p-1)^2) and theta_phys (imp-95917, kernel-weighted mean under a nonnegative
 *   proxy for |K_k|, numerically below 1 at every witness window) -- are IMAGES of the
 *   SAME underlying residue-mean / kernel-sign object <cos>_w(D), evaluated under two
 *   different substitutions for the true weight w(n) = Lambda(n) K_k(n): the uniform
 *   substitution (imp-95918) and a nonnegative-proxy substitution (imp-95917). NEITHER
 *   substitutes the true signed Fresnel-Airy kernel K_k, whose sign is exactly the
 *   imp-95212 envelope port (still OPEN per imp-95970's Airy-zero reconciliation:
 *   K_k >= 0 iff collar depth d >= a_1/mu, unestablished at any witness window). So the
 *   physical per-window theta -- folded against the TRUE signed K_k -- remains
 *   uncomputed by either imp-95917 or imp-95918.
 *
 *   STATUS: both images are exact/well-defined AS IMAGES (the closed form <theta_C> is
 *   exact; theta_phys is exact given a choice of |K_k| proxy and its sign hypothesis).
 *   Neither closes the imp-95212 port. No bound moves; NO QED; no refereed bound is changed.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style scope note preventing conflation of "physical weighted" (imp-95917's
 *   label for its proxy-evaluated image) with "the true physical per-window theta". It
 *   establishes nothing new, instantiates no interval, closes no sub-gap, moves no bound.
 *   imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95917-vonmangoldt-weighted-sign-image (theta_phys under a nonnegative |K_k| proxy)
 * @see imp-95918-residue-avg-sign-image-pk-grid (<theta_C>, the residue-uniform mean, wider grid)
 * @see imp-95212-fresnel-airy-envelope-port (the still-open true-kernel-sign port)
 * @see imp-95970-sign-reconciliation-glossary-headword (K_k >= 0 iff d >= a_1/mu, unestablished)
 *
 * Ticket: imp-95957 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The scope-note headword, baked verbatim (no re-import).
const SIGN_IMAGE_SCOPE_NOTE_HEADWORD = Object.freeze({
  key: 'sign-image-both-images-not-physical-theta',
  term: 'imp-95917 theta_phys and imp-95918 <theta_C> are both IMAGES, not the physical per-window theta',
  definition:
    '<theta_C> = (p tr(G) - S)/((p-1) S) (imp-95918) averages the cosine UNIFORMLY over ' +
    'residues n = 1..p-1. theta_phys (imp-95917) folds the cosine against a NONNEGATIVE ' +
    'Gaussian PROXY for |K_k|, conditional on the unproven hypothesis K_k >= 0 -- it is not ' +
    'evaluated against the true signed von-Mangoldt x Fresnel-Airy kernel. Both are therefore ' +
    'IMAGES of the same residue-mean / kernel-sign object <cos>_w(D) under two different ' +
    'substitutions for the true weight w(n) = Lambda(n) K_k(n); neither equals the true ' +
    'physical per-window theta.',
  mechanism:
    'The physical reduction theta_phys(p,k) = (sum_ml G_ml <cos>_w(h_m - h_l))/S (imp-95917 ' +
    'STEP 1) is exact IN FORM but requires <cos>_w(D), the mean of cos(2 pi D n/p) weighted ' +
    'by the true w(n) = Lambda(n) K_k(n). imp-95918 substitutes the UNIFORM mean ' +
    '(avg_n cos = 1 for D=0, -1/(p-1) else) in place of <cos>_w, giving the exact closed form ' +
    '<theta_C>. imp-95917 substitutes a NONNEGATIVE Gaussian/cosine-Gaussian PROXY for |K_k| ' +
    'in place of the true signed kernel, giving theta_phys conditional on K_k >= 0. Both ' +
    'substitutions avoid evaluating the true signed Fresnel-Airy kernel, whose SIGN is ' +
    'exactly the imp-95212 envelope port.',
  verificationStatus:
    'Both <theta_C> and theta_phys are well-defined AS IMAGES: <theta_C> is an EXACT closed ' +
    'form; theta_phys is exact given a choice of |K_k| proxy and the K_k >= 0 hypothesis. ' +
    'Neither is the true physical per-window theta folded against the genuine signed K_k. ' +
    'The imp-95212 port -- and per imp-95970, the equivalent unestablished collar-depth ' +
    'condition d >= a_1/mu -- remains OPEN.',
});

export const IMP95957_SIGN_IMAGE_SCOPE_NOTE_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95957',
  proofSection: 'S-frontier',
  glosses: ['imp-95917', 'imp-95918'],
  question:
    'imp-95917 labels theta_phys "physical weighted" and imp-95918 reports the residue-uniform ' +
    'mean <theta_C>, both strictly below 1 -- does either equal the true physical per-window ' +
    'theta, for a reader landing on either module cold?',
  headword: SIGN_IMAGE_SCOPE_NOTE_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'SCOPE NOTE ONLY (documentation, not a proof). Neither imp-95917 theta_phys (evaluated ' +
    'under a nonnegative proxy for |K_k|, conditional on K_k >= 0) nor imp-95918 <theta_C> ' +
    '(the residue-uniform mean) is the true physical per-window theta folded against the ' +
    'genuine signed Fresnel-Airy kernel. Both are images of the residue-mean/kernel-sign ' +
    'object under different substitutions; the imp-95212 envelope port stays OPEN. ' +
    'Establishes nothing; instantiates no interval; moves no bound; NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-95917 (theta_phys under a nonnegative |K_k| proxy, conditional on K_k >= 0); ' +
    'imp-95918 (<theta_C>, the exact residue-uniform mean, wider grid); imp-95212 (the still-open ' +
    'true-kernel-sign port); imp-95970 (K_k >= 0 iff d >= a_1/mu, unestablished at any window).',
});

export default IMP95957_SIGN_IMAGE_SCOPE_NOTE_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95957_SIGN_IMAGE_SCOPE_NOTE_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95957-headword-has-required-fields',
    why: 'The headword must name both source images (theta_phys, <theta_C>), record that ' +
      'neither is the true physical theta, and cite the still-open imp-95212 port -- the ' +
      'entire point of the scope note.',
    holds: () => {
      const h = IMP95957_SIGN_IMAGE_SCOPE_NOTE_GLOSSARY_HEADWORD.headword;
      return (
        /theta_C/.test(h.definition) &&
        /theta_phys/.test(h.definition) &&
        /IMAGES/.test(h.definition) &&
        /nonnegative-proxy|NONNEGATIVE/.test(h.definition) &&
        /still-open Section|imp-95212|OPEN/i.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95957-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95957_SIGN_IMAGE_SCOPE_NOTE_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95957_SIGN_IMAGE_SCOPE_NOTE_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95957_SIGN_IMAGE_SCOPE_NOTE_GLOSSARY_HEADWORD.verdict) &&
      IMP95957_SIGN_IMAGE_SCOPE_NOTE_GLOSSARY_HEADWORD.glosses.includes('imp-95917') &&
      IMP95957_SIGN_IMAGE_SCOPE_NOTE_GLOSSARY_HEADWORD.glosses.includes('imp-95918'),
  },
];

for (const assertion of IMP95957_SIGN_IMAGE_SCOPE_NOTE_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95957-sign-image-scope-note-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
