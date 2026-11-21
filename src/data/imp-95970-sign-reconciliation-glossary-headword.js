/**
 * @module imp-95970-sign-reconciliation-glossary-headword
 * @fileoverview imp-95970 -- import-light glossary/Concepts headword for the imp-95942
 *   reconciliation: the imp-95917 STEP-5 Fresnel-Airy envelope-sign obligation (K_k >= 0)
 *   is EQUIVALENT to the imp-95336 MAP-4 collar-past-caustic depth condition d >= a_1/mu,
 *   both conditional on the still-open Section 4.5 turning-point geometry.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95917 STEP 5 and imp-95336 MAP 4 were tracked as two separate open sub-gaps until
 *   imp-95942 showed they are the SAME condition. A reader landing on either module cold has
 *   no quick-lookup entry recording that the Airy envelope sign law makes this equivalence
 *   exact, or that both still hinge on the same unresolved Section 4.5 packet geometry. This
 *   headword bakes those facts VERBATIM (no re-import of imp-95942, to stay import-light) as
 *   a standalone lookup entry.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   The local Fresnel-Airy envelope near a Section 4.5 turning point is K_k(t) = Ai(mu(t-c))
 *   (imp-95336 envelopeFacts). Because Ai is entire with all real zeros negative, the largest
 *   being -a_1 (a_1 = 2.338107410459767, A&S 10.4.94), the sign is an EXACT support condition:
 *   K_k(t) >= 0 iff t >= c - a_1/mu. Across a full imp-95917 witness window (worst alias =
 *   smallest mu) this becomes: K_k >= 0 everywhere on the window iff the collar depth
 *   d >= a_1/mu -- PRECISELY the imp-95336 MAP-4 collar-past-caustic hypothesis. So the
 *   imp-95917 STEP-5 envelope-sign obligation and the imp-95336 MAP-4 hypothesis are ONE
 *   condition, not two, and both remain CONDITIONAL on the still-open Section 4.5
 *   turning-point-depth geometry (leg (i), the unextracted packet constants).
 *
 *   STATUS: the equivalence itself is EXACT (Airy zero structure); the underlying depth
 *   condition d >= a_1/mu is NOT established at any witness window, so K_k >= 0 remains open.
 *   No bound moves; NO QED; no refereed bound is changed.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-95942 reconciliation for quick reference.
 *   It establishes nothing, instantiates no interval, closes no sub-gap, moves no bound.
 *   imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-95942-fresnel-airy-envelope-sign-assessment (source: the reconciliation this glosses)
 * @see imp-95917-vonmangoldt-weighted-sign-image (STEP 5: the envelope-sign obligation)
 * @see imp-95336-fresnel-airy-envelope-port-assessment (MAP 4: collar-past-caustic hypothesis)
 *
 * Ticket: imp-95970 (content, medium). Documentation only; establishes nothing; NO QED;
 * no refereed bound is changed.
 */

// The sign-reconciliation headword, baked verbatim (no re-import).
const SIGN_RECONCILIATION_HEADWORD = Object.freeze({
  key: 'fresnel-airy-envelope-sign-map4-reconciliation',
  term: 'imp-95917 STEP-5 envelope-sign obligation == imp-95336 MAP-4 collar-past-caustic condition',
  definition:
    'The Fresnel-Airy envelope K_k(t) = Ai(mu(t-c)) is nonnegative iff t >= c - a_1/mu, where ' +
    'a_1 = 2.338107410459767 is the first (largest) Airy zero -- all real zeros of Ai are ' +
    'negative. Across a full witness window (worst = smallest-mu alias) this makes K_k >= 0 ' +
    'EQUIVALENT to the collar depth satisfying d >= a_1/mu, which is PRECISELY the imp-95336 ' +
    'MAP-4 collar-past-caustic hypothesis. The two previously separate open sub-gaps -- imp-95917 ' +
    'STEP-5 envelope-sign and imp-95336 MAP-4 -- are therefore the SAME condition.',
  mechanism:
    'Ai is entire; its real zeros are all negative with the largest at -a_1. So Ai(x) > 0 for ' +
    'x > -a_1 and Ai(x) < 0 on the first pre-caustic lobe (-a_2,-a_1). A seam window places ' +
    'aliases at offsets spanning a range of scales mu = d^(1/3)/1.7 (imp-95917 buildG), so the ' +
    'sign across the whole window is controlled by the worst (smallest-mu) alias -- the sign is ' +
    'NOT free, it requires the depth guarantee d >= a_1/mu at that worst alias.',
  verificationStatus:
    'The equivalence K_k >= 0 <=> d >= a_1/mu <=> MAP-4 is EXACT (Airy zero structure). The ' +
    'underlying depth condition itself is NOT established at any imp-95917 witness window -- ' +
    'both sub-gaps remain CONDITIONAL on the still-open Section 4.5 turning-point-depth geometry ' +
    '(leg (i), the unextracted packet constants); the imp-95212 physical envelope port stays OPEN.',
});

export const IMP95970_SIGN_RECONCILIATION_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-95970',
  proofSection: 'S-frontier',
  glosses: 'imp-95942',
  question:
    'imp-95942 showed the imp-95917 STEP-5 Fresnel-Airy envelope-sign obligation (K_k >= 0) and ' +
    'the imp-95336 MAP-4 collar-past-caustic hypothesis are the SAME condition. What is that ' +
    'shared condition, why is the equivalence exact, and what does it still depend on, for a ' +
    'reader landing on either module cold?',
  headword: SIGN_RECONCILIATION_HEADWORD,
  anyBoundMoved: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-95942 reconciliation: ' +
    'K_k(t) = Ai(mu(t-c)) >= 0 iff d >= a_1/mu (a_1 = 2.338107410459767), which is EXACTLY the ' +
    'imp-95336 MAP-4 collar-past-caustic depth condition -- so the imp-95917 STEP-5 obligation ' +
    'is not independent of MAP-4. Both remain conditional on the still-open Section 4.5 ' +
    'turning-point geometry; K_k >= 0 is NOT established at any witness window. Establishes ' +
    'nothing; instantiates no interval; moves no bound; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95942 (the sign-transcription and MAP-4 reconciliation this glosses); imp-95917 (STEP 5, ' +
    'the envelope-sign obligation); imp-95336 (MAP 4, the collar-past-caustic hypothesis and ' +
    'Airy envelope facts).',
});

export default IMP95970_SIGN_RECONCILIATION_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95970_SIGN_RECONCILIATION_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp95970-headword-has-required-fields',
    why: 'The headword must name the exact Airy sign law, the d >= a_1/mu equivalence to MAP-4, and the still-open dependency -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP95970_SIGN_RECONCILIATION_GLOSSARY_HEADWORD.headword;
      return (
        /a_1 = 2.338107410459767/.test(h.definition) &&
        /d >= a_1\/mu/.test(h.definition) &&
        /MAP-4/.test(h.definition) &&
        /worst \(smallest-mu\) alias/i.test(h.mechanism) &&
        /still-open Section 4.5/i.test(h.verificationStatus)
      );
    },
  },
  {
    id: 'imp95970-honesty-gate-no-qed',
    why: 'Documentation only: no bound claimed moved, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95970_SIGN_RECONCILIATION_GLOSSARY_HEADWORD.anyBoundMoved === false &&
      /NO QED/.test(IMP95970_SIGN_RECONCILIATION_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP95970_SIGN_RECONCILIATION_GLOSSARY_HEADWORD.verdict) &&
      IMP95970_SIGN_RECONCILIATION_GLOSSARY_HEADWORD.glosses === 'imp-95942',
  },
];

for (const assertion of IMP95970_SIGN_RECONCILIATION_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95970-sign-reconciliation-glossary-headword assertion failed: ${assertion.id}`,
    );
  }
}
