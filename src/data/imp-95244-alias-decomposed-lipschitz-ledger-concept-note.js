/**
 * @module imp-95244-alias-decomposed-lipschitz-ledger-concept-note
 * @fileoverview imp-95244 -- import-light concept note explaining the imp-95210
 *   alias-decomposed Lipschitz ledger aliasDecomposed = 44.476493, what its
 *   "overhang" and "mismatch" pieces are, and why the imp-95213 tier
 *   certifier adopted it in place of the direct ledger 84.769080.
 *
 *   WHY A CONCEPT NOTE (not a re-derivation)
 *   -----------------------------------------------
 *   imp-95210 already derives the decomposition and measures both ledgers in
 *   full (native/gate2-interval/envprobe.c cross-validated to 2.9e-14 per
 *   term). This note bakes a plain-language restatement of what the
 *   overhang and mismatch masses are and why replacing the direct-ladder
 *   bulk with them is rigorous and adoptable -- no re-import of the source
 *   module, to stay import-light.
 *
 *   THE NOTE
 *   -----------------------------------------------
 *   The window-1 pilot certifier bounds each term D_j = A_{<j}(q_p G_j -
 *   H_j) of the telescoping sum by a per-term Lipschitz constant. The
 *   DIRECT ledger bounds q_p G_j - H_j as one undifferentiated broadband
 *   quantity, giving 84.769080 per x-unit. The ALIAS-DECOMPOSED ledger
 *   instead splits it, using ln-additivity theta_{pn} = theta_p + theta_n,
 *   into three exact pieces:
 *     q_p G_j - H_j = o_j + mm_j + rr_j
 *   and bounds only the first two with a per-term Lipschitz constant:
 *     - o_j (OVERHANG): the alias sum over n in Gset_j with p*n > M, i.e.
 *       terms that "overhang" past the truncation point M. It is NARROWBAND
 *       (confined to the frequency band [ln M, ln pM]/2, width (ln p)/2)
 *       and small: |o_j| <= 3.0e-3 with d|o_j|/du <= 0.0029.
 *     - mm_j (MISMATCH): the amplitude-mismatch chirp over the surviving
 *       terms p*n <= M. It is BROADBAND (oscillates at ladder-phase scale,
 *       max d|mm_25|/du = 1.264) but its own Lipschitz constant is smaller
 *       than bounding the undecomposed q_p G_j - H_j directly.
 *     - rr_j (REFLECTED RESIDUAL): q_p RefG_j - RefH_j, the piece that does
 *       NOT telescope; it is left OUT of this ledger and is the separate
 *       imp-95246 concept note's subject.
 *   Summing the rigorous per-term bounds on o_j and mm_j over the ladder
 *   gives aliasDecomposed = 44.476493 per x-unit, versus the direct
 *   ledger's 84.769080 -- a 1.906x reduction (84.76908 / 44.476493 =
 *   1.90595), because the decomposition avoids double-counting the
 *   narrowband overhang mass inside a broadband bound.
 *
 *   WHY IT IS RIGOROUS AND ADOPTABLE
 *   -----------------------------------------------
 *   The decomposition is an EXACT algebraic identity (not an approximation),
 *   so bounding its pieces separately and summing still yields a valid
 *   upper Lipschitz ledger for q_p G_j - H_j -- no soundness is traded away.
 *   Cutting the ledger by 1.906x directly cuts the certifier's required
 *   cell count by the same factor (cellsTotal scales with ledger for a
 *   fixed target Rex): 1.115e10 cells / 1.64e5 CPU-days at 84.769080 versus
 *   5.848e9 cells / 8.6e4 CPU-days at 44.476493. This is why the imp-95213
 *   tiered certifier adopted the alias-decomposed ledger: a free ~1.9x cell
 *   reduction with no loss of rigor.
 *
 *   WHAT THIS DOES NOT DO
 *   ------------------------
 *   The alias-decomposed ledger 44.476493 still sits ~190x above the TRUE
 *   measured max derivative 0.234494 (the gap is sqrt-cancellation across
 *   ~7e5-term derivative sums that no triangle ledger can capture). It does
 *   not make the window-1 certificate feasible on its own -- imp-95210
 *   found the further envelope-scale pivot (subdividing cells at a slower
 *   modulus scale) is REFUTED by two independent obstructions (a slack
 *   obstruction and a scale/rigor obstruction). The 1.9x gain from this
 *   ledger is real and adopted, but it is one factor inside a design whose
 *   total cell count still requires the tier-P/B/S batching plan, not a
 *   standalone fix. No new certificate fires here; no refereed bound is changed.
 *
 * @see imp-95210-window1-pilot-certificate.js (source: FINDING 1/2,
 *   RIGOROUS LEDGER LANDSCAPE, FEASIBILITY ARITHMETIC)
 * @see imp-95213 (tier certifier that adopts the 44.476 alias ledger)
 * @see imp-95246 (concept note for the rr_j reflected-ladder residual left
 *   out of this ledger)
 *
 * Ticket: imp-95244 (content, low). Documentation only; establishes no new
 * bound; NO QED; no refereed bound is changed.
 */

// The concept-note content, baked verbatim (no re-import of imp-95210).
const ALIAS_DECOMPOSED_LEDGER_HEADWORD = Object.freeze({
  key: 'alias-decomposed-lipschitz-ledger',
  term:
    'Alias-decomposed Lipschitz ledger 44.476/x replacing the direct ' +
    '84.769/x (imp-95210, adopted by imp-95213)',
  whatIsTheLedger:
    'A per-x-unit Lipschitz constant bounding the window-1 pilot certifier '  +
    'term D_j = A_{<j}(q_p G_j - H_j). The DIRECT ledger (84.769080) bounds ' +
    'q_p G_j - H_j as one undifferentiated quantity; the ALIAS-DECOMPOSED ' +
    'ledger (44.476493) uses the exact identity q_p G_j - H_j = o_j + mm_j ' +
    '+ rr_j (from ln-additivity theta_{pn} = theta_p + theta_n) and bounds ' +
    'only the overhang and mismatch pieces, leaving the non-telescoping ' +
    'reflected residual rr_j out of this ledger.',
  overhangAndMismatch:
    'o_j (OVERHANG) is the alias sum over n in Gset_j with p*n > M -- ' +
    'NARROWBAND (frequency band [ln M, ln pM]/2) and small, |o_j| <= ' +
    '3.0e-3. mm_j (MISMATCH) is the amplitude-mismatch chirp over the ' +
    'surviving terms p*n <= M -- BROADBAND but with a smaller per-term ' +
    'Lipschitz constant than bounding q_p G_j - H_j undecomposed.',
  whyRigorousAndAdoptable:
    'The split is an EXACT algebraic identity, so bounding o_j and mm_j ' +
    'separately and summing still yields a valid upper Lipschitz ledger -- ' +
    'no soundness is traded away. The 1.906x smaller ledger (84.76908 / ' +
    '44.476493 = 1.90595) directly cuts required cell count by the same ' +
    'factor (1.115e10 -> 5.848e9 cells, 1.64e5 -> 8.6e4 CPU-days), which is ' +
    'why the imp-95213 tier certifier adopted it.',
  whatItDoesNotDo:
    'Still ~190x above the TRUE measured max derivative 0.234494 (sqrt- ' +
    'cancellation across ~7e5-term sums no triangle ledger captures). Does ' +
    'not make window-1 feasible alone -- imp-95210 found the further ' +
    'envelope-scale pivot REFUTED by two independent obstructions; the 1.9x ' +
    'gain is one factor inside the tier-P/B/S batching design, not a ' +
    'standalone fix.',
});

export const IMP95244_ALIAS_DECOMPOSED_LEDGER_CONCEPT_NOTE = Object.freeze({
  id: 'imp-95244',
  proofSection: 'S-frontier',
  glosses: 'imp-95210',
  scopes: 'alias-decomposed Lipschitz ledger 44.476/x',
  question:
    'What is the imp-95210 alias-decomposed Lipschitz ledger, what do its ' +
    'overhang and mismatch pieces mean, and why is it rigorous and ' +
    'adoptable by the imp-95213 tier certifier?',
  headword: ALIAS_DECOMPOSED_LEDGER_HEADWORD,
  anyEnclosureEstablished: false,
  verdict:
    'CONCEPT NOTE ONLY (documentation, not a proof). Restates the imp-95210 ' +
    'alias-decomposed ledger 44.476493 (vs direct 84.769080), its overhang ' +
    '(o_j) and mismatch (mm_j) pieces, and why the exact-identity split ' +
    'keeps it rigorous. Establishes nothing new; fires no certificate; ' +
    'no refereed bound is changed.',
  citation:
    'imp-95210-window1-pilot-certificate.js (FINDING 1/2, RIGOROUS LEDGER ' +
    'LANDSCAPE, FEASIBILITY ARITHMETIC); imp-95213 (tier certifier adopting ' +
    'the ledger); imp-95246 (rr_j reflected-residual companion note).',
});

export default IMP95244_ALIAS_DECOMPOSED_LEDGER_CONCEPT_NOTE;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95244_ALIAS_DECOMPOSED_LEDGER_CONCEPT_NOTE_ASSERTIONS = [
  {
    id: 'imp95244-headword-has-required-fields',
    why:
      'The concept note must define the ledger, state the overhang/mismatch ' +
      'pieces, state why it is rigorous, and state what it does not do -- ' +
      'the entire point of the note.',
    holds: () => {
      const h = IMP95244_ALIAS_DECOMPOSED_LEDGER_CONCEPT_NOTE.headword;
      return (
        /44.476493/.test(h.whatIsTheLedger) &&
        /OVERHANG/.test(h.overhangAndMismatch) &&
        /MISMATCH/.test(h.overhangAndMismatch) &&
        /EXACT algebraic identity/.test(h.whyRigorousAndAdoptable) &&
        /0.234494/.test(h.whatItDoesNotDo)
      );
    },
  },
  {
    id: 'imp95244-honesty-gate-no-qed',
    why:
      'Documentation only: no enclosure claimed established, no QED, no-refereed-bound-change line present.',
    holds: () =>
      IMP95244_ALIAS_DECOMPOSED_LEDGER_CONCEPT_NOTE.anyEnclosureEstablished ===
        false &&
      /refereed bound is changed/i.test(
        IMP95244_ALIAS_DECOMPOSED_LEDGER_CONCEPT_NOTE.verdict
      ) &&
      IMP95244_ALIAS_DECOMPOSED_LEDGER_CONCEPT_NOTE.glosses === 'imp-95210' &&
      IMP95244_ALIAS_DECOMPOSED_LEDGER_CONCEPT_NOTE.scopes ===
        'alias-decomposed Lipschitz ledger 44.476/x',
  },
];

for (const assertion of IMP95244_ALIAS_DECOMPOSED_LEDGER_CONCEPT_NOTE_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95244-alias-decomposed-lipschitz-ledger-concept-note assertion failed: ${assertion.id}`
    );
  }
}
