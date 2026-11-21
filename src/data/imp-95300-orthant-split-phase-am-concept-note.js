/**
 * @module imp-95300-orthant-split-phase-am-concept-note
 * @fileoverview imp-95300 -- import-light concept note restating the
 *   imp-95254 orthant-split THEOREM PHASE-AM and its three refutation
 *   results (PROP LIN-NOGO, COROLLARY NO-UNIF, PROP CEIL-X) in plain terms,
 *   for readers landing on the phase-priced seam-certificate ledger without
 *   wanting to read the full three-strip / orthant-drop proof.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95254 already proves LEMMA ENT, LEMMA ODROP, THEOREM PHASE-AM,
 *   COROLLARY NO-UNIF, PROP LIN-NOGO and PROP CEIL-X in full (exact
 *   three-strip evaluation + entrywise orthant-cross-term drop + explicit
 *   rational witnesses). This note bakes a plain-language restatement of
 *   what PHASE-AM improves, and why each of the three companion results
 *   refutes a natural but false simplification -- no re-import of the
 *   source module, to stay import-light.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   THEOREM PHASE-AM sharpens the imp-95233 COROLLARY PHASE-CERT bound
 *     R(f) <= e^(-y_min) / (2*theta)
 *   to the strictly stronger
 *     R(f) <= (e^(-y_min)/4) * (1 + 1/theta),
 *   where theta = T(f)/T(g) in (0,1] is the "phase currency" comparing a
 *   signed seam family f to its conjugate g, and y_min is the usual
 *   min-pairwise seam floor. The improvement is an exact arithmetic-mean
 *   factor (1+theta)/2 <= 1/theta, tight at theta = 1, and it lowers the
 *   vacuity frontier from theta > e^(-y_min) to the smaller threshold
 *   theta > e^(-y_min)/(2 - e^(-y_min)). It is built from LEMMA ENT
 *   (entrywise seam-mass domination L_mn <= (1/2) e^(-y_min) M_mn) and
 *   LEMMA ODROP (splitting a signed quadratic form by orthant sign pattern
 *   only ever drops cross terms, since L is entrywise positive), applied
 *   separately to the positive and negative parts f_plus, f_minus of the
 *   family.
 *
 *   The three companion results each refute a plausible-looking
 *   simplification of the phase-priced picture:
 *
 *   - PROP LIN-NOGO refutes the guess that the sharp phase price is LINEAR
 *     in theta. A natural linear interpolation between the theta -> 0 and
 *     theta = 1 endpoints, R <= (1/2)(1 - theta(1 - e^(-y_min))), is
 *     violated by an explicit rational witness (rates 3 and 1/4, center
 *     1/2): the true R = 0.4779782262235292 exceeds the linear bound's
 *     0.4476319952609633. So no linear-in-theta formula can be sharp.
 *
 *   - COROLLARY NO-UNIF refutes the guess that SOME phase-priced bound
 *     could stay strictly below 1/2 uniformly as theta -> 0. The imp-95224
 *     SGN-SAT co-centered family phi_K has y_min fixed, theta_K -> 0, and
 *     R_K -> 1/2 for every K, so any valid bound F(theta, y_min) must
 *     satisfy limsup_{theta -> 0} F >= 1/2 at that y. Only pointwise (not
 *     uniform) sub-1/2 control is possible, which is exactly what
 *     PHASE-AM supplies on the region theta > e^(-y_min)/(2 - e^(-y_min)).
 *
 *   - PROP CEIL-X refutes the guess that 1/2 is a general ceiling on R at
 *     all. It exhibits a non-co-centered signed family (rates 1 and 1/2,
 *     centers 1 and 1/4) with R = 0.6961749688026323, strictly above 1/2,
 *     within 2e-4 of that geometry's pencil optimum. So the DC-NOGO 1/2
 *     saturation value is an artifact of the co-centered class, not a
 *     universal bound; PHASE-AM itself evaluates to a consistent (much
 *     looser) 1.9663 at that witness's (theta, y_min), so there is no
 *     contradiction between CEIL-X and PHASE-AM.
 *
 *   WHAT THIS DOES NOT DO
 *   ------------------------
 *   Nothing here fires a new certificate or changes any bound of the
 *   Lambda program. PHASE-AM is a within-class sharpening of PHASE-CERT,
 *   not a resolution of the exact sharp frontier F(theta, y_min) between
 *   the PHASE-AM region and the CEIL-X exceedance region -- that gap is
 *   the separate open item imp-95289. The imp-95212 sub-gap this ledger
 *   feeds stays OPEN.
 *
 *   WHAT THIS IS AND IS NOT
 *   ------------------------
 *   A plain-language restatement of the imp-95254 module verdict scope
 *   for quick reference. It establishes nothing new, fires no
 *   certificate, and does not decide the exact sharp phase-price
 *   frontier, which REMAINS OPEN; NO QED. No refereed bound is changed.
 *
 * @see imp-95254-orthant-split-phase-certificate.js (source: LEMMA ENT,
 *   LEMMA ODROP, THEOREM PHASE-AM, COROLLARY NO-UNIF, PROP LIN-NOGO,
 *   PROP CEIL-X, all proven there)
 * @see imp-95233 (COROLLARY PHASE-CERT baseline that PHASE-AM sharpens)
 * @see imp-95289 (exact sharp frontier F(theta, y_min) between the
 *   PHASE-AM region and the CEIL-X exceedance; open)
 *
 * Ticket: imp-95300 (content, medium). Documentation only; establishes no
 * new bound; imp-95289 exact-frontier question stays OPEN; NO QED;
 * no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95254).
const ORTHANT_SPLIT_PHASE_AM_HEADWORD = Object.freeze({
  key: 'orthant-split-phase-am',
  term:
    'Orthant-split THEOREM PHASE-AM and its three refutations ' +
    '(imp-95254, seam-chain phase-price leg)',
  whatIsPhaseAM:
    'THEOREM PHASE-AM sharpens the imp-95233 bound R(f) <= e^(-y_min)/(2*theta) ' +
    'to R(f) <= (e^(-y_min)/4)*(1 + 1/theta), an exact arithmetic-mean ' +
    'improvement (1+theta)/2 <= 1/theta that is tight at theta = 1 and lowers ' +
    'the vacuity frontier to theta > e^(-y_min)/(2 - e^(-y_min)). Built from ' +
    'LEMMA ENT (entrywise seam-mass domination) and LEMMA ODROP (orthant-sign ' +
    'quadratic-form splitting only drops cross terms) applied to the positive ' +
    'and negative parts of the family separately.',
  linNogo:
    'PROP LIN-NOGO refutes a linear-in-theta guess: the interpolation ' +
    'R <= (1/2)(1 - theta(1 - e^(-y_min))) is violated by an explicit ' +
    'rational witness (rates 3, 1/4, center 1/2) giving true R = ' +
    '0.4779782262235292 above the linear bound 0.4476319952609633.',
  noUnif:
    'COROLLARY NO-UNIF refutes a uniform-sub-1/2 guess as theta -> 0: the ' +
    'imp-95224 SGN-SAT co-centered family has fixed y_min, theta_K -> 0, and ' +
    'R_K -> 1/2, so any valid bound F(theta,y_min) must satisfy ' +
    'limsup_{theta->0} F >= 1/2 -- only pointwise sub-1/2 control is possible, ' +
    'which is what PHASE-AM supplies on its region.',
  ceilX:
    'PROP CEIL-X refutes 1/2 as a universal ceiling: a non-co-centered ' +
    'witness (rates 1, 1/2, centers 1, 1/4) gives R = 0.6961749688026323, ' +
    'above 1/2, within 2e-4 of that geometry pencil optimum -- the DC-NOGO ' +
    '1/2 value is an artifact of the co-centered class, and PHASE-AM ' +
    'consistently evaluates to a looser 1.9663 there, so there is no ' +
    'contradiction.',
  whatItDoesNotDo:
    'PHASE-AM is a within-class sharpening, not a resolution of the exact ' +
    'sharp frontier F(theta,y_min) between the PHASE-AM region and the ' +
    'CEIL-X exceedance region -- that gap is the separate open item ' +
    'imp-95289. Fires no new certificate, changes no bound.',
});

export const IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95300',
  proofSection: 'S-frontier',
  glosses: 'imp-95254',
  scopes: 'orthant-split PHASE-AM theorem and its three refutations',
  question:
    'What does the imp-95254 THEOREM PHASE-AM improve over PHASE-CERT, and ' +
    'what does each of its three companion results (LIN-NOGO, NO-UNIF, ' +
    'CEIL-X) refute?',
  headword: ORTHANT_SPLIT_PHASE_AM_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the ' +
    'imp-95254 THEOREM PHASE-AM sharpening and its three refutations ' +
    '(PROP LIN-NOGO, COROLLARY NO-UNIF, PROP CEIL-X) in plain terms. ' +
    'Establishes nothing new; fires no certificate; the imp-95289 exact ' +
    'sharp-frontier question REMAINS OPEN; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-95254 (LEMMA ENT, LEMMA ODROP, THEOREM PHASE-AM, COROLLARY ' +
    'NO-UNIF, PROP LIN-NOGO, PROP CEIL-X, all proven there); imp-95233 ' +
    '(PHASE-CERT baseline); imp-95289 (exact sharp frontier, open).',
});

export default IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95300-headword-has-required-fields',
    why:
      'The concept note must state the PHASE-AM sharpening and all three ' +
      'refutations (LIN-NOGO, NO-UNIF, CEIL-X) -- the entire point of the note.',
    holds: () => {
      const h = IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE.headword;
      return (
        /PHASE-AM/.test(h.whatIsPhaseAM) &&
        /LIN-NOGO/.test(h.linNogo) &&
        /NO-UNIF/.test(h.noUnif) &&
        /CEIL-X/.test(h.ceilX) &&
        /imp-95289/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95300-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, imp-95289 ' +
      'stays OPEN, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /NO QED/.test(IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE.verdict) &&
      /refereed bound is changed/i.test(
        IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE.verdict
      ) &&
      /REMAINS OPEN/.test(
        IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE.verdict
      ) &&
      IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE.glosses === 'imp-95254' &&
      IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE.scopes ===
        'orthant-split PHASE-AM theorem and its three refutations',
  },
];

for (const assertion of IMP95300_ORTHANT_SPLIT_PHASE_AM_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95300-orthant-split-phase-am-concept-note assertion failed: ${assertion.id}`
    );
  }
}
