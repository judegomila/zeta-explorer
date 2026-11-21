/**
 * @module imp-95246-reflected-ladder-residual-concept-note
 * @fileoverview imp-95246 -- import-light concept note explaining the imp-95210
 *   reflected-ladder residual rr_j = q_p RefG_j - RefH_j: what it is, why it
 *   does not telescope, and why it is the piece the imp-95244 alias-decomposed
 *   Lipschitz ledger (44.476493) leaves out.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95210 derives the exact three-way split of the window-1 pilot
 *   certifier's per-term quantity and measures every piece in full
 *   (native/gate2-interval/envprobe.c, cross-validated to 2.9e-14 per term).
 *   imp-95244 already bakes a companion note for the two pieces that DO make
 *   it into the adopted ledger (o_j overhang, mm_j mismatch). This note is
 *   the promised companion for the third piece, rr_j, which imp-95244
 *   explicitly leaves for imp-95246 -- no re-import of the source module, to
 *   stay import-light.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   The window-1 pilot certifier bounds each telescoping term D_j =
 *   A_{<j}(q_p G_j - H_j). Using ln-additivity theta_{pn} = theta_p +
 *   theta_n, imp-95210 splits the bracket into three EXACT pieces:
 *     q_p G_j - H_j = o_j + mm_j + rr_j
 *   The first two (o_j overhang, mm_j mismatch) are each bounded by their own
 *   per-term Lipschitz constant and summed into the 44.476493 alias-decomposed
 *   ledger (imp-95244). The third,
 *     rr_j = q_p RefG_j - RefH_j,
 *   is the REFLECTED-LADDER RESIDUAL: the piece built from the "reflected"
 *   generating sums RefG_j and RefH_j (the mirror-image ladder counterparts
 *   of G_j and H_j under the same p*n <= M truncation) rather than from the
 *   direct ladder. Unlike o_j and mm_j, rr_j does NOT telescope across j --
 *   it has no cancelling structure against neighboring terms of the sum --
 *   so it cannot be folded into a per-term Lipschitz bound the way the other
 *   two pieces are; imp-95210 leaves it OUT of the alias-decomposed ledger
 *   entirely.
 *
 *   WHY IT MATTERS (the dominant broadband piece)
 *   -----------------------------------------------
 *   rr_j is not a minor omission -- it is measured to be the FASTEST-varying
 *   of the three pieces. At p=2 (the j=25 term), max d|rr_25|/du = 2.8893 per
 *   q-unit, versus max d|mm_25|/du = 1.264 and max d|o_j|/du <= 0.0029 for
 *   the alias piece. So rr_j varies ~996x faster than o_j and roughly 2.3x
 *   faster than mm_j -- it is the single largest driver of imp-95210's
 *   FINDING 2 scale/rigor obstruction (the pilot's true derivative turns 78x
 *   finer than one ladder-phase cycle, ruling out envelope-scale cells for
 *   the undecomposed pilot).
 *
 *   WHY THE PILOT STILL PASSES DESPITE rr_j's SIZE
 *   -----------------------------------------------
 *   rr_j is large and fast on its own, but the pilot sup (0.2437626739528982,
 *   0 sampled exceedances) only clears the target Rex = 0.2796881955526244
 *   through a JOINT phase cancellation between mm_j and rr_j inside the
 *   combined quantity |mm_j + rr_j|. Split apart into a modulus-triangle
 *   envelope, sum_j |A_{<j}|(|o_j|+|mm_j|+|rr_j|) has sampled sup
 *   0.3441713029308129 -- ABOVE Rex, with exceedances on 0.30% of sampled
 *   points. That is imp-95210's FINDING 1 slack obstruction: rr_j cannot be
 *   bounded separately (its own modulus is too large), and it cannot be
 *   bounded jointly with mm_j at envelope scale either (the pair varies at
 *   full phase speed). This is exactly why the alias-decomposed ledger only
 *   ever touches o_j and mm_j and always leaves rr_j to the undecomposed,
 *   phase-resolving part of the certifier.
 *
 *   WHAT THIS DOES NOT DO
 *   ------------------------
 *   This note restates and glosses imp-95210's measurements of rr_j; it does
 *   not re-derive RefG_j/RefH_j from first principles (that construction
 *   lives in native/gate2-interval/envprobe.c) and establishes no new bound.
 *   rr_j remains the reason the window-1 pilot certifier cannot shed its
 *   phase-resolving ~1.1e10 cell count via decomposition -- the residual is
 *   handled instead by the tier-P/B/S batching design (imp-95213), not by
 *   any further per-term ledger split. No new certificate fires here;
 *   no refereed bound is changed.
 *
 * @see imp-95210-window1-pilot-certificate.js (source: EXACT STRUCTURE USED,
 *   FINDING 1/2)
 * @see imp-95244-alias-decomposed-lipschitz-ledger-concept-note.js (companion
 *   note for the o_j/mm_j pieces that DO enter the ledger)
 * @see imp-95213 (tier certifier that must absorb rr_j via batching, not
 *   decomposition)
 *
 * Ticket: imp-95246 (content, low). Documentation only; establishes no new
 * bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95210).
const REFLECTED_LADDER_RESIDUAL_HEADWORD = Object.freeze({
  key: 'reflected-ladder-residual',
  term:
    'Reflected-ladder residual rr_j = q_p RefG_j - RefH_j, the imp-95210 ' +
    'piece left out of the 44.476493 alias-decomposed ledger (imp-95244)',
  whatIsRrj:
    'The third of three EXACT pieces in the split q_p G_j - H_j = o_j + ' +
    'mm_j + rr_j (from ln-additivity theta_{pn} = theta_p + theta_n). ' +
    'rr_j = q_p RefG_j - RefH_j is built from the reflected generating ' +
    'sums RefG_j and RefH_j -- the mirror-image ladder counterparts of ' +
    'G_j and H_j under the same p*n <= M truncation -- rather than from ' +
    'the direct ladder.',
  whyItDoesNotTelescope:
    'Unlike o_j (overhang) and mm_j (mismatch), rr_j has no cancelling ' +
    'structure against neighboring terms of the telescoping sum, so it ' +
    'cannot be folded into a per-term Lipschitz bound the way the other ' +
    'two pieces are. imp-95210 therefore leaves it OUT of the ' +
    'alias-decomposed ledger entirely.',
  whyItMatters:
    'rr_j is the FASTEST-varying of the three pieces: max d|rr_25|/du = ' +
    '2.8893 per q-unit versus max d|mm_25|/du = 1.264 and max d|o_j|/du ' +
    '<= 0.0029 for the alias piece -- about 996x faster than o_j and ' +
    '~2.3x faster than mm_j. It is the single largest driver of the ' +
    'imp-95210 FINDING 2 scale/rigor obstruction (true derivative turns ' +
    '78x finer than one ladder-phase cycle).',
  whyThePilotStillPasses:
    'The pilot sup (0.2437626739528982, 0 sampled exceedances) clears ' +
    'Rex = 0.2796881955526244 only through a JOINT phase cancellation ' +
    'between mm_j and rr_j. Split into a modulus-triangle envelope, ' +
    'sum_j |A_{<j}|(|o_j|+|mm_j|+|rr_j|) has sampled sup ' +
    '0.3441713029308129 -- ABOVE Rex (0.30% sampled exceedance rate). ' +
    'rr_j can neither be bounded alone (too large) nor jointly with mm_j ' +
    'at envelope scale (the pair varies at full phase speed) -- ' +
    'imp-95210 FINDING 1.',
  whatItDoesNotDo:
    'Restates imp-95210 measurements only; does not re-derive RefG_j/' +
    'RefH_j from first principles (native/gate2-interval/envprobe.c owns ' +
    'that) and establishes no new bound. rr_j remains why the window-1 ' +
    'pilot cannot shed its ~1.1e10 phase-resolving cell count via ' +
    'decomposition alone -- absorbed instead by the imp-95213 tier-P/B/S ' +
    'batching design.',
});

export const IMP95246_REFLECTED_LADDER_RESIDUAL_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95246',
  proofSection: 'S-frontier',
  glosses: 'imp-95210',
  scopes: 'reflected-ladder residual rr_j = q_p RefG_j - RefH_j',
  question:
    'What is the imp-95210 reflected-ladder residual rr_j, why does it not ' +
    'telescope, and why is it left out of the imp-95244 alias-decomposed ' +
    'Lipschitz ledger?',
  headword: REFLECTED_LADDER_RESIDUAL_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the imp-95210 ' +
    'reflected-ladder residual rr_j = q_p RefG_j - RefH_j, why it does not ' +
    'telescope, why it is the fastest-varying and largest piece driving ' +
    'FINDING 1/2, and why it is left out of the 44.476493 alias-decomposed ' +
    'ledger. Establishes nothing new; fires no certificate; no refereed bound is changed' +
    '.',
  citation:
    'imp-95210-window1-pilot-certificate.js (EXACT STRUCTURE USED, FINDING ' +
    '1/2); imp-95244-alias-decomposed-lipschitz-ledger-concept-note.js ' +
    '(companion note for o_j/mm_j); imp-95213 (tier certifier absorbing ' +
    'rr_j via batching).',
});

export default IMP95246_REFLECTED_LADDER_RESIDUAL_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95246_REFLECTED_LADDER_RESIDUAL_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95246-headword-has-required-fields',
    why:
      'The concept note must define rr_j, state why it does not telescope, ' +
      'state why it matters (speed vs o_j/mm_j), and state what it does ' +
      'not do -- the entire point of the note.',
    holds: () => {
      const h = IMP95246_REFLECTED_LADDER_RESIDUAL_CONCEPT_NOTE.headword;
      return (
        /RefG_j/.test(h.whatIsRrj) &&
        /RefH_j/.test(h.whatIsRrj) &&
        /does not telescope|no cancelling structure/i.test(
          h.whyItDoesNotTelescope
        ) &&
        /2\.8893/.test(h.whyItMatters) &&
        /0\.3441713029308129/.test(h.whyThePilotStillPasses)
      );
    },
  },
  {
    id: 'imp95246-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95246_REFLECTED_LADDER_RESIDUAL_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(
        IMP95246_REFLECTED_LADDER_RESIDUAL_CONCEPT_NOTE.verdict
      ) &&
      IMP95246_REFLECTED_LADDER_RESIDUAL_CONCEPT_NOTE.glosses === 'imp-95210' &&
      IMP95246_REFLECTED_LADDER_RESIDUAL_CONCEPT_NOTE.scopes ===
        'reflected-ladder residual rr_j = q_p RefG_j - RefH_j',
  },
];

for (const assertion of IMP95246_REFLECTED_LADDER_RESIDUAL_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95246-reflected-ladder-residual-concept-note assertion failed: ${assertion.id}`
    );
  }
}
