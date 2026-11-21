/**
 * @module imp-36242-g-interval-enclosure-e1-e5-glossary-headword
 * @fileoverview imp-36242 -- import-light glossary/Concepts headword for the
 *   imp-36193 G-interval-enclosure five-ingredient E1-E5 requirement list: what
 *   an N-uniform enclosure [t_c_lo(N), t_c_hi(N)] of the backward-Dyson
 *   collision time needs beyond the imp-362 single-N witness.
 *
 *   WHY A GLOSSARY HEADWORD (not a re-derivation)
 *   -----------------------------------------------
 *   imp-36193 enumerated five concrete ingredients (E1-E5) an N-uniform
 *   interval enclosure needs, but a reader landing on that module cold has
 *   no quick-lookup definition of what each letter names or which one is the
 *   crux. This headword bakes those facts VERBATIM (no re-import of the
 *   imp-36193 module, to stay import-light) as a standalone lookup entry,
 *   mirroring the existing imp-35127 I-list / imp-36230 R1-R6 headword
 *   pattern.
 *
 *   THE HEADWORD
 *   -----------------------------------------------
 *   E1 (N-uniform certified seed intervals): certified x_k(0) at ARBITRARY N,
 *   not the bundled 870-zero table. E2 (sound directed rounding): true
 *   IEEE-754 directed rounding or a proven one-ULP-suffices lemma over a
 *   growing op count. E3 (interval pole reduction -- THE CRUX): 1/[g_lo,
 *   g_hi] is an enclosure only for g_lo > 0 and its width ~ delta_lo^{-2}
 *   blows up at the collision front; needs the SAME certified gap floor as
 *   the open G-gronwall obligation (imp-2520), so E3 is CIRCULARLY COUPLED
 *   to G-gronwall. E4 (N-uniform width control): total accumulated interval
 *   width bounded against wrapping and the O(N^2) pole-term count, coupling
 *   to the G-step-error step budget (imp-36192). E5 (documented
 *   N-dependence): the deliverable itself, a monotone halfWidth(N) law
 *   assembled from E1-E4.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A glossary-style lookup restating the imp-36193 E1-E5 ingredient names
 *   for quick reference. It establishes nothing, encloses no collision time
 *   at any new N, certifies no seed. G-interval-enclosure stays OPEN;
 *   imp-2519 no-overclaim guard preserved; NO QED. No refereed bound is changed.
 *
 * @see imp-36193-step2-g-interval-enclosure-nuniform-scope (source: the E1-E5 requirements this glosses)
 * @see imp-36192-step2-g-step-error-apriori-truncation-scope (companion Step-2 scope; E4 couples to its step budget)
 * @see backward-flow-stability-gronwall.js (imp-2520; E3 couples to the same gap floor obligation, G-gronwall)
 * @see imp-36230-krawczyk-residual-node-glossary-headword.js (sibling glossary-headword pattern for an S-frontier requirement list)
 *
 * Ticket: imp-36242 (content, medium). Documentation only; establishes no
 * enclosure; G-interval-enclosure stays OPEN; NO QED; no refereed bound is changed.
 */

// The G-interval-enclosure E1-E5 glossary headword, baked verbatim (no re-import).
const G_INTERVAL_ENCLOSURE_E1_E5_HEADWORD = Object.freeze({
  key: 'g-interval-enclosure-e1-e5',
  term: 'G-interval-enclosure N-uniform requirement list E1-E5 (imp-36193)',
  definition:
    'The five ingredients an N-UNIFORM interval enclosure [t_c_lo(N), t_c_hi(N)] of the ' +
    'backward N-particle Dyson collision time would need, beyond the imp-362 single-N ' +
    'one-ULP LAMBDA_INTERVAL_DYSON witness (a genuine bracket, but seeded from a bundled ' +
    '870-zero table with the N=2458 row out of scope).',
  e1ToE5List:
    'E1 N-uniform certified seed intervals x_k(0) at ARBITRARY N (Platt-style ordinate ' +
    'enclosures or a certified surrogate spacing law, not the bundled 870-zero table); ' +
    'E2 true IEEE-754 directed rounding or a proven one-ULP-suffices lemma over a growing ' +
    'op count (imp-362 only emulates one-ULP outward inflation); E3 interval pole ' +
    'reduction of 1/(x_k - x_j) -- THE CRUX, width ~ delta_lo^{-2} blows up at the ' +
    'collision front, needs a certified gap floor; E4 N-uniform control of accumulated ' +
    'interval width against wrapping and the O(N^2) pole-term count; E5 the documented ' +
    'N-dependence law halfWidth(N) itself -- the deliverable assembled from E1-E4.',
  crux:
    'E3 (interval pole reduction) is circularly coupled to the open G-gronwall obligation ' +
    '(imp-2520, Gronwall-vacuous at the nearest-pair front) -- both need the identical ' +
    'certified gap floor delta_lo(t) > 0 up to just-before the collision time.',
  couplings:
    'E3 couples to G-gronwall (imp-2520) via the shared gap floor; E4 couples to the ' +
    'G-step-error step budget (imp-36192) -- all three Step-2 obligations are therefore ' +
    'circularly coupled through the same collision-front gap floor.',
});

export const IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD = Object.freeze({
  id: 'imp-36242',
  proofSection: 'S-frontier',
  glosses: 'imp-36193',
  scopes: 'G-interval-enclosure',
  question:
    'imp-36193 enumerated the E1-E5 requirements for an N-uniform interval enclosure of ' +
    'the backward-Dyson collision time. What does each letter name for a reader, and ' +
    'which one is the crux?',
  headword: G_INTERVAL_ENCLOSURE_E1_E5_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'GLOSSARY HEADWORD ONLY (documentation, not a proof). Restates the imp-36193 ' +
    'G-interval-enclosure E1-E5 ingredient list -- certified seed intervals (E1), sound ' +
    'directed rounding (E2), the interval pole-reduction crux (E3, circularly coupled to ' +
    'G-gronwall), N-uniform width control (E4, coupled to G-step-error), and the ' +
    'documented N-dependence deliverable (E5) -- for quick reference. Establishes ' +
    'nothing; encloses no collision time at any new N; certifies no seed; ' +
    'G-interval-enclosure stays OPEN; NO QED. No refereed bound is changed.',
  citation:
    'imp-36193 (source E1-E5 requirements); imp-36192 (companion G-step-error scope, ' +
    'E4 coupling); imp-2520 (G-gronwall, E3 coupling); imp-362 (single-N witness).',
});

export default IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD;

// -- Tripwire assertions ------------------------------------------------------
export const IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD_ASSERTIONS = [
  {
    id: 'imp36242-headword-has-required-fields',
    why: 'The headword must name all five E1-E5 ingredients and identify E3 as the crux -- the entire point of the glossary entry.',
    holds: () => {
      const h = IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD.headword;
      return (
        /E1/.test(h.e1ToE5List) &&
        /E2/.test(h.e1ToE5List) &&
        /E3/.test(h.e1ToE5List) &&
        /E4/.test(h.e1ToE5List) &&
        /E5/.test(h.e1ToE5List) &&
        /E3/.test(h.crux) &&
        /G-gronwall/.test(h.crux) &&
        /G-step-error/.test(h.couplings)
      );
    },
  },
  {
    id: 'imp36242-honesty-gate-no-qed',
    why: 'Documentation only: no enclosure claimed established, G-interval-enclosure stays OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD.anyEnclosureEstablished === false &&
      /NO QED/.test(IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD.verdict) &&
      /refereed bound is changed/i.test(IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD.verdict) &&
      /G-interval-enclosure stays OPEN/.test(IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD.verdict) &&
      IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD.glosses === 'imp-36193' &&
      IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD.scopes === 'G-interval-enclosure',
  },
];

for (const assertion of IMP36242_G_INTERVAL_ENCLOSURE_E1_E5_GLOSSARY_HEADWORD_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-36242-g-interval-enclosure-e1-e5-glossary-headword assertion failed: ${assertion.id}`);
  }
}
