/**
 * @module imp-33706-selection-catalogue-count-scoping
 *
 * imp-33706 (proof, frontier-scoping): SCOPE whether FORMALIZING the imp-33668 SUBSUMED-BY-H3/H4
 * verdict on the part-(b) real-critical-value SELECTION residual REDUCES the imp-33603 H1..H5 (H0..H5)
 * obligation-catalogue COUNT, and ASSESS whether the MILDEST tower member (the zeroth-derivative
 * value-level selection quantity, k = 0) can be DROPPED from the open-residual list WITHOUT weakening
 * the H3/H4 strip-height-uniformity obligation. Bookkeeping / assessment only. G6a stays OPEN; no
 * positivity; imp-3066 untouched; no QED.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * Both inputs are already RECORDED in the repo, not new derivations. imp-33603 catalogues the six
 * hypotheses {H0 provenance, H1 smoothness, H2 simple fold, H3 uniform curvature, H4 strip-height
 * perturbation control, H5 RH transcription} of a Lemma-5.2-type Holder-1/2 blow-up modulus, marks H1
 * and H2 SATISFIED by the port and H0, H3, H4, H5 OPEN, and names H4 (strip-height-uniformity) the
 * single load-bearing residual. imp-33668 measured the part-(b) selection quantity -- the critical
 * value tau_c = -1/m_prime(z_0*) reads the Stieltjes transform ITSELF, the ZEROTH-derivative (k = 0)
 * member of the same boundary tower whose k = 1 (H4 fold-reading m_prime, eps^{-3/2}) and k = 2 (H3
 * curvature m_prime_prime, eps^{-5/2}) members are the open residual -- and returned the verdict
 * isDistinctFourthObligation = false / SUBSUMED-BY-H3-H4 / dischargedPointwiseByImp394 = true. This
 * module only RECONCILES those two records at the catalogue-count level; it asserts nothing new about
 * the mathematics.
 *
 * THE COUNTING QUESTION (was the selection ever a catalogue row?)
 * --------------------------------------------------------------
 * The imp-33603 catalogue enumerates SIX structural/provenance hypotheses H0..H5. The selection
 * residual is NOT among them: it is the k = 0 (value-level) member of the SAME Stieltjes boundary tower
 * that the H3 (k = 2) and H4 (k = 1) rows already carry, and imp-33668 explicitly found it is NOT a
 * distinct fourth obligation. So there was never a seventh "selection" row (call it H6) in the
 * catalogue to begin with. Formalizing the SUBSUMED verdict therefore CANNOT reduce a count that never
 * included the selection as a separate entry: the total stays SIX (H0..H5) and the OPEN count stays
 * FOUR (H0, H3, H4, H5). The formalization is a WITHIN-ROW annotation on H3/H4 (recording the value
 * term as the lowest-order member they already dominate), not the addition or removal of any row.
 *
 * COULD IT REDUCE THE COUNT BY REMOVING H3 or H4? No. The SUBSUMED verdict folds the selection INTO
 * H3/H4; it does not discharge H3 or H4. H4 (strip-height-uniformity) remains the load-bearing residual
 * and H3 (uniform curvature) remains open, so neither open row is removed. Net catalogue-count delta on
 * BOTH the total (6) and the open list (4) is EXACTLY ZERO. The correct bookkeeping is to record the
 * selection as "discharged-conditional-on-H3/H4" -- a standing NOTE under H3/H4, not a standing
 * OBLIGATION and not a catalogue row.
 *
 * THE DROP QUESTION (can the mildest member leave the open-residual list harmlessly?)
 * ----------------------------------------------------------------------------------
 * The open-residual TOWER at the reading strip eps = y_N^sharp = sqrt(2 pi / N) has N-growth exponents
 *     selection (k = 0): 1/4,   H4 (k = 1): 3/4,   H3 (k = 2): 5/4     [exponent = 1/4 + k/2].
 * The uniformity OBLIGATION is governed by the LARGEST exponent (the fastest-growing weight the
 * back-conversion must carry uniformly), which is the H3 curvature term at 5/4 with H4 at 3/4 the
 * load-bearing strip-height residual. The selection exponent 1/4 is the SMALLEST -- the mildest rung.
 * Dropping the k = 0 member from the open list removes only the term that is dominated a fortiori by
 * both derivative weights: max{1/4, 3/4, 5/4} = 5/4 = max{3/4, 5/4}. The governing (max) exponent, and
 * hence the H3/H4 uniformity obligation, is UNCHANGED by deleting k = 0. So the mildest member CAN be
 * dropped from the open-residual list without weakening H3/H4 -- indeed it was never carrying load:
 * once the derivative weights (2 pi / N)^{3/4}, (2 pi / N)^{5/4} are controlled uniformly, the
 * (2 pi / N)^{1/4} value weight rides along, and it is separately discharged POINTWISE by imp-394.
 *
 * VERDICT: NO-COUNT-CHANGE / MILDEST-MEMBER-DROPPABLE. Formalizing the imp-33668 SUBSUMED-BY-H3/H4
 * result does NOT reduce the imp-33603 obligation-catalogue count: the catalogue is six rows (H0..H5)
 * with four open (H0, H3, H4, H5), the selection was never a distinct row (imp-33668
 * isDistinctFourthObligation = false), and the SUBSUMED verdict folds it INTO H3/H4 rather than
 * discharging H3 or H4 -- so the total (6) and open (4) counts are BOTH unchanged, delta zero. The
 * correct record is the selection as a discharged-conditional-on-H3/H4 NOTE under H3/H4, not an
 * obligation. And the mildest tower member (k = 0, N-exponent 1/4) CAN be dropped from the
 * open-residual list without weakening the H3/H4 uniformity obligation, because that obligation is
 * governed by the LARGEST derivative exponent (H3 5/4, H4 3/4) and max{1/4, 3/4, 5/4} = max{3/4, 5/4}:
 * removing the smallest exponent leaves the governing weight -- and the load-bearing H4
 * strip-height-uniformity residual -- untouched. Bookkeeping / assessment only; G6a_shock_lipschitz
 * stays OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb share
 * untouched; NO QED. No refereed bound is changed.
 *
 * @see imp-33668-part-b-selection-residual-scoping (the SUBSUMED-BY-H3/H4 verdict being formalized)
 * @see imp-33603-lemma52-port-scoping (the H1..H5 + H0 obligation catalogue, H4 the residual)
 * @see imp-33646-h4-privalov-sokhotski-constant-scoping (the H4 fold-reading derivative, exponent 3/2)
 * @see imp-33645-h3-curvature-divergence-scoping (the H3 curvature member, exponent 5/2)
 * @see g6a-sub-hyperbolic-closure (imp-394: RvM cusp density, Privalov-Sokhotski pointwise boundary value)
 */

// The imp-33603 catalogue rows, reproduced as the bookkeeping ground truth (status only; the full
// mapping lives in imp-33603-lemma52-port-scoping). Six rows: two satisfied (H1, H2), four open.
const CATALOGUE = [
  { id: 'H0', status: 'open' }, // provenance
  { id: 'H1', status: 'satisfied' }, // smoothness away from the fold
  { id: 'H2', status: 'satisfied' }, // non-degenerate simple fold => exponent 1/2 forced
  { id: 'H3', status: 'open' }, // uniform curvature lower bound (k = 2 tower member)
  { id: 'H4', status: 'open' }, // strip-height perturbation control (k = 1 tower member) -- the residual
  { id: 'H5', status: 'open' }, // real-scalar / Riemann-Hilbert transcription
];
const TOTAL_BEFORE = CATALOGUE.length; // 6
const OPEN_BEFORE = CATALOGUE.filter((h) => h.status === 'open').length; // 4

// Formalizing imp-33668 records the selection as a discharged-conditional-on-H3/H4 NOTE under H3/H4,
// NOT a new catalogue row and NOT a discharge of H3 or H4. So the catalogue is unchanged.
const CATALOGUE_AFTER = CATALOGUE; // no row added, none removed
const TOTAL_AFTER = CATALOGUE_AFTER.length; // 6
const OPEN_AFTER = CATALOGUE_AFTER.filter((h) => h.status === 'open').length; // 4
const TOTAL_DELTA = TOTAL_AFTER - TOTAL_BEFORE; // 0
const OPEN_DELTA = OPEN_AFTER - OPEN_BEFORE; // 0

// The Stieltjes boundary tower at the reading strip eps = y_N^sharp = sqrt(2 pi / N): N-growth exponent
// is 1/4 + k/2 for derivative order k (imp-33668: k = 0 selection 1/4, imp-33646: k = 1 H4 3/4,
// imp-33645: k = 2 H3 5/4). The uniformity obligation is governed by the LARGEST exponent.
const TOWER = [
  { member: 'selection', k: 0, nExponent: 0.25, row: null }, // k = 0 value member; not a catalogue row
  { member: 'H4', k: 1, nExponent: 0.75, row: 'H4' }, // fold-reading m_prime -- the load-bearing residual
  { member: 'H3', k: 2, nExponent: 1.25, row: 'H3' }, // curvature m_prime_prime
];
function governingExponent(members) {
  return members.reduce((mx, m) => Math.max(mx, m.nExponent), -Infinity);
}
const GOVERNING_WITH_SELECTION = governingExponent(TOWER); // 5/4
const GOVERNING_WITHOUT_SELECTION = governingExponent(TOWER.filter((m) => m.k >= 1)); // 5/4
const DROPPING_SELECTION_WEAKENS_H3H4 = GOVERNING_WITHOUT_SELECTION < GOVERNING_WITH_SELECTION;

export const IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING = {
  id: 'imp-33706',
  proofSection: 'S-frontier',
  scopes:
    'Whether formalizing the imp-33668 SUBSUMED-BY-H3/H4 selection-residual verdict reduces the ' +
    'imp-33603 H0..H5 obligation-catalogue count, and whether the mildest (k = 0) tower member can be ' +
    'dropped from the open-residual list without weakening the H3/H4 uniformity obligation',
  question:
    'Does recording the imp-33668 value-level selection residual as discharged-conditional-on-H3/H4 ' +
    'reduce the imp-33603 catalogue count, and can the k = 0 mildest tower member leave the ' +
    'open-residual list without weakening H3/H4? Bookkeeping / assessment only; G6a OPEN; no QED.',

  // The counting result.
  catalogueRows: CATALOGUE.map((h) => h.id), // H0..H5
  totalBefore: TOTAL_BEFORE, // 6
  openBefore: OPEN_BEFORE, // 4 (H0, H3, H4, H5)
  totalAfter: TOTAL_AFTER, // 6 -- no row added or removed
  openAfter: OPEN_AFTER, // 4
  totalCountDelta: TOTAL_DELTA, // 0
  openCountDelta: OPEN_DELTA, // 0
  selectionWasNeverACatalogueRow: true, // imp-33668 isDistinctFourthObligation = false
  formalizationIsWithinRowNote: true, // discharged-conditional-on-H3/H4 note under H3/H4, not a row
  reducesCatalogueCount: false, // the load-bearing outcome: count is UNCHANGED

  // The drop result.
  towerExponents: TOWER.map((m) => ({ member: m.member, k: m.k, nExponent: m.nExponent })),
  governingExponentWithSelection: GOVERNING_WITH_SELECTION, // 5/4 (H3)
  governingExponentWithoutSelection: GOVERNING_WITHOUT_SELECTION, // 5/4 (H3) -- unchanged
  mildestMember: 'selection', // k = 0, N-exponent 1/4 -- the smallest
  mildestMemberDroppable: true, // removing the smallest exponent leaves the governing (max) intact
  droppingWeakensH3H4: DROPPING_SELECTION_WEAKENS_H3H4, // false

  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity',
  residualStatement:
    'Formalizing the imp-33668 SUBSUMED-BY-H3/H4 result leaves the imp-33603 catalogue at six rows ' +
    '(H0..H5) with four open (H0, H3, H4, H5): the selection was never a distinct row (it is the k = 0 ' +
    'member of the H3/H4 tower) and the SUBSUMED verdict folds it INTO H3/H4 rather than discharging ' +
    'either, so total delta 0 and open delta 0. The mildest (k = 0, N-exponent 1/4) tower member can ' +
    'be dropped from the open-residual list without weakening H3/H4 because the uniformity obligation ' +
    'is governed by the largest derivative exponent (H3 5/4, H4 3/4) and max{1/4, 3/4, 5/4} = ' +
    'max{3/4, 5/4}: deleting the smallest exponent leaves the governing weight and the load-bearing H4 ' +
    'strip-height-uniformity residual untouched.',

  isRigorous: false,
  verdict:
    'BOOKKEEPING / ASSESSMENT ONLY (frontier-direction, NOT rigorous): formalizing the imp-33668 ' +
    'SUBSUMED-BY-H3/H4 verdict on the part-(b) real-critical-value SELECTION residual does NOT reduce ' +
    'the imp-33603 obligation-catalogue count. The catalogue is SIX rows (H0..H5) with FOUR open ' +
    '(H0, H3, H4, H5); the selection is the ZEROTH-derivative (k = 0) member of the same Stieltjes ' +
    'boundary tower whose k = 1 (H4) and k = 2 (H3) members are already catalogued, so it was never a ' +
    'distinct row (imp-33668 isDistinctFourthObligation = false) and the SUBSUMED verdict folds it INTO ' +
    'H3/H4 rather than discharging H3 or H4 -- total-count delta 0 and open-count delta 0. The correct ' +
    'record is the selection as a discharged-conditional-on-H3/H4 NOTE under H3/H4, not a standing ' +
    'obligation. And the MILDEST tower member (k = 0, N-exponent 1/4) CAN be dropped from the ' +
    'open-residual list without weakening the H3/H4 uniformity obligation, because that obligation is ' +
    'governed by the LARGEST derivative exponent (H3 5/4, H4 3/4) and max{1/4, 3/4, 5/4} = ' +
    'max{3/4, 5/4} = 5/4 -- removing the smallest exponent leaves the governing weight and the ' +
    'load-bearing H4 strip-height-uniformity residual untouched, and the value term is separately ' +
    'discharged pointwise by imp-394. Bookkeeping / assessment only; G6a_shock_lipschitz stays OPEN; no ' +
    'positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0 UNTOUCHED; C_mb share untouched; NO ' +
    'QED. No refereed bound is changed.',
  citation:
    'imp-33668-part-b-selection-residual-scoping (the SUBSUMED-BY-H3/H4 verdict, isDistinctFourthObligation = false); ' +
    'imp-33603-lemma52-port-scoping (the H0..H5 catalogue, H4 the strip-height-uniformity residual); ' +
    'imp-33646-h4-privalov-sokhotski-constant-scoping (H4 fold-reading, exponent 3/2 / N-exponent 3/4); ' +
    'imp-33645-h3-curvature-divergence-scoping (H3 curvature, exponent 5/2 / N-exponent 5/4); ' +
    'g6a-sub-hyperbolic-closure (imp-394: Privalov-Sokhotski pointwise boundary value in the Holder-1/2 class).',
};

export const IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING_ASSERTIONS = [
  {
    // The catalogue is six rows H0..H5, exactly four open (H0, H3, H4, H5), two satisfied (H1, H2).
    id: 'imp33706-catalogue-six-rows-four-open',
    description: 'the imp-33603 catalogue is six rows (H0..H5) with four open (H0, H3, H4, H5)',
    holds: () =>
      TOTAL_BEFORE === 6 &&
      OPEN_BEFORE === 4 &&
      ['H0', 'H3', 'H4', 'H5'].every(
        (id) => CATALOGUE.find((h) => h.id === id).status === 'open',
      ) &&
      ['H1', 'H2'].every((id) => CATALOGUE.find((h) => h.id === id).status === 'satisfied'),
  },
  {
    // Formalizing the SUBSUMED verdict changes NEITHER the total NOR the open count: both deltas zero.
    id: 'imp33706-count-unchanged-delta-zero',
    description: 'formalizing the imp-33668 SUBSUMED verdict leaves total (6) and open (4) counts unchanged, delta 0',
    holds: () =>
      TOTAL_DELTA === 0 &&
      OPEN_DELTA === 0 &&
      TOTAL_AFTER === TOTAL_BEFORE &&
      OPEN_AFTER === OPEN_BEFORE &&
      IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.reducesCatalogueCount === false,
  },
  {
    // The selection was never a distinct catalogue row; the formalization is a within-row H3/H4 note.
    id: 'imp33706-selection-never-a-row',
    description: 'the selection was never a distinct catalogue row (imp-33668 isDistinctFourthObligation = false); it is a within-row H3/H4 note',
    holds: () =>
      IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.selectionWasNeverACatalogueRow === true &&
      IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.formalizationIsWithinRowNote === true &&
      // neither H3 nor H4 is discharged by the SUBSUMED verdict
      CATALOGUE_AFTER.find((h) => h.id === 'H3').status === 'open' &&
      CATALOGUE_AFTER.find((h) => h.id === 'H4').status === 'open',
  },
  {
    // The tower N-exponents follow 1/4 + k/2: selection 1/4 (k=0) < H4 3/4 (k=1) < H3 5/4 (k=2).
    id: 'imp33706-tower-exponents-ordered',
    description: 'tower N-exponents 1/4 + k/2: selection 1/4 < H4 3/4 < H3 5/4, the selection the mildest',
    holds: () =>
      TOWER.every((m) => Math.abs(m.nExponent - (0.25 + m.k / 2)) < 1e-12) &&
      TOWER[0].nExponent < TOWER[1].nExponent &&
      TOWER[1].nExponent < TOWER[2].nExponent &&
      IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.mildestMember === 'selection',
  },
  {
    // Dropping the mildest (k=0) member leaves the governing (max) exponent unchanged: 5/4 either way.
    id: 'imp33706-mildest-droppable-governing-unchanged',
    description: 'dropping the k=0 selection member leaves the governing exponent (5/4) unchanged, so H3/H4 is not weakened',
    holds: () =>
      Math.abs(GOVERNING_WITH_SELECTION - 1.25) < 1e-12 &&
      Math.abs(GOVERNING_WITHOUT_SELECTION - GOVERNING_WITH_SELECTION) < 1e-12 &&
      DROPPING_SELECTION_WEAKENS_H3H4 === false &&
      IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.mildestMemberDroppable === true,
  },
  {
    // Honesty gate: scoping only, not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33706-honesty-gate-no-qed',
    description: 'Bookkeeping only: not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.verdict) &&
      /stays OPEN/.test(IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING.verdict),
  },
];

for (const a of IMP33706_SELECTION_CATALOGUE_COUNT_SCOPING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33706-selection-catalogue-count-scoping assertion failed: ${a.id}`);
  }
}
