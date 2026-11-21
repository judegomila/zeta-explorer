/**
 * @module imp-33745-h0-provenance-independence-scoping
 *
 * imp-33745 (proof, frontier-scoping): SCOPE the imp-33706 open-residual-tower H0 rung. imp-33706
 * folded the k = 0 value-level SELECTION member of the Stieltjes boundary tower INTO the H3/H4
 * derivative rows (isDistinctFourthObligation = false), leaving four open catalogue rows H0, H3, H4,
 * H5 with H4 (strip-height-uniformity) the load-bearing residual. It left H0 (provenance of the
 * Lemma-5.2-type Holder-1/2 blow-up modulus) OPEN and unexamined. This module ASSESSES whether H0 can
 * be discharged INDEPENDENTLY of H3/H4 -- i.e. whether the imp-33668 selection-fold has any bearing on
 * H0 -- or whether H0 is a GENUINELY DISTINCT standing obligation on its own axis. Bookkeeping /
 * scoping only. G6a stays OPEN; no positivity; imp-3066 untouched; no QED.
 *
 * PROVENANCE (honesty note)
 * -------------------------
 * All inputs are already RECORDED in the repo, not new derivations. imp-33603 catalogues the six
 * G6a_shock_lipschitz obligations {H0 provenance, H1 smoothness, H2 simple fold, H3 uniform curvature,
 * H4 strip-height perturbation control, H5 RH transcription}, marks H1/H2 SATISFIED and H0/H3/H4/H5
 * OPEN, and names H4 the single load-bearing residual. imp-33706 established that the part-(b)
 * selection quantity is the ZEROTH-derivative (k = 0) member of the SAME Stieltjes boundary tower whose
 * k = 1 (H4 fold-reading) and k = 2 (H3 curvature) members are the open derivative residual, and folded
 * it INTO H3/H4. imp-33637 already exercised H0 directly against the arXiv source. This module only
 * RECONCILES those records at the axis level; it asserts nothing new about the mathematics.
 *
 * THE AXIS QUESTION (is H0 in the analytic tower at all?)
 * ------------------------------------------------------
 * The imp-33706 open-residual TOWER is a chain of Stieltjes boundary quantities indexed by derivative
 * order k, each with an N-growth weight (2 pi / N)^{1/4 + k/2} at the reading strip eps = sqrt(2 pi/N):
 *     selection (k = 0): 1/4,   H4 (k = 1): 3/4,   H3 (k = 2): 5/4.
 * H0 has NO derivative order k and NO N-exponent: it is not a boundary-value quantity at all. H0 is a
 * PROVENANCE / bibliographic obligation -- "is the H1..H5 catalogue a faithful transcription of the
 * cited published lemma?" -- which lives on a DIFFERENT axis from the analytic derivative tower. The
 * imp-33668 fold operated ENTIRELY WITHIN that tower (it re-attached the k = 0 value weight to the
 * k = 1, k = 2 derivative weights that dominate it a fortiori). A fold within the analytic tower cannot
 * touch a rung that is not a tower member. So the selection-fold has ZERO bearing on H0.
 *
 * THE INDEPENDENCE QUESTION (does H0 discharge decouple from H3/H4?)
 * -----------------------------------------------------------------
 * H3/H4 are discharged (if ever) by an ANALYTIC act: a strip-height-UNIFORM lower bound on the RvM fold
 * curvature at heights y_N^sharp = sqrt(2 pi / N) -> 0 (the still-missing y2-adapted-flow-depth object,
 * imp-3708). H0 is discharged by a DOCUMENT-VERIFICATION act: confirming the reconstructed hypothesis
 * list against the arXiv text. These two acts share no inputs -- no curvature bound, no strip height, no
 * perturbation control feeds the citation check, and no bibliographic fact feeds the uniformity bound.
 * H0 is therefore INDEPENDENTLY DISCHARGEABLE: it can be settled (in either direction) without moving
 * H3 or H4, and settling H3/H4 would not settle H0. This is not hypothetical -- imp-33637 ALREADY ran
 * the H0 channel in isolation and returned a result (a DOUBLE mis-citation: wrong arXiv id 1802.05390,
 * and no Lemma 5.2 in the correct paper 1904.12438), upgrading H0 from "provenance unconfirmed" to
 * "citation identified as incorrect" WITHOUT touching H3/H4 at all. That an isolated pass moved H0 on
 * its own axis is direct evidence of the independence.
 *
 * DOES imp-394 DISCHARGE H0? No. imp-394 (RvM cusp density / Privalov-Sokhotski pointwise boundary
 * value, g6a-sub-hyperbolic-closure) discharges the k = 0 VALUE term POINTWISE -- an analytic-tower act
 * in the same channel as H3/H4, not the bibliographic channel. It says nothing about whether the cited
 * lemma exists or matches. So imp-394 covers the k = 0 value quantity but leaves H0 provenance OPEN,
 * exactly as the ticket notes.
 *
 * IS H0 LOAD-BEARING FOR THE BOUND? No -- distinct is not the same as load-bearing. H0 is a distinct
 * standing obligation on the PROVENANCE axis, but it is NOT on the analytic load path of the per-N
 * Holder-1/2 bound: imp-33637 records that "a correct citation would still leave H3/H4/H5 open on the
 * repo own analysis" and the H4 strip-height-uniformity residual is unaffected by which paper is cited.
 * So H0 is DISTINCT-BUT-ORTHOGONAL: a separate honesty / citation obligation, not an analytic-load one.
 *
 * VERDICT: H0 IS A GENUINELY DISTINCT, INDEPENDENTLY-DISCHARGEABLE STANDING OBLIGATION -- NOT foldable
 * into H3/H4. It is not a member of the imp-33706 analytic derivative tower (it has no k-index and no
 * N-exponent), so the imp-33668 selection-fold (k = 0 -> H3/H4) has zero bearing on it. Its discharge
 * is a document-verification act sharing no inputs with the H3/H4 strip-height-uniformity curvature
 * bound, and imp-33637 already exercised that channel in isolation (returning a double mis-citation,
 * H0 upgraded to citation-error, NOT closed) without moving H3/H4 -- direct evidence of the
 * independence. imp-394 discharges the k = 0 VALUE term pointwise but NOT the provenance. H0 is distinct
 * on the provenance axis yet NOT on the analytic load path (a correct citation would still leave
 * H3/H4/H5 open), so it is DISTINCT-BUT-ORTHOGONAL, not load-bearing. The open catalogue stays FOUR rows
 * (H0, H3, H4, H5); H0 remains OPEN as its own obligation. Bookkeeping / assessment only;
 * G6a_shock_lipschitz stays OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel K_a >= 0
 * UNTOUCHED; C_mb share untouched; NO QED. No refereed bound is changed.
 *
 * @see imp-33706-selection-catalogue-count-scoping (the k = 0 selection fold + the open-residual tower)
 * @see imp-33603-lemma52-port-scoping (the H0..H5 catalogue; H0 the provenance rung; H4 the residual)
 * @see imp-33637-h0-provenance-verification (the isolated H0 channel: double mis-citation, upgraded not closed)
 * @see imp-33668-part-b-selection-residual-scoping (the SUBSUMED-BY-H3/H4 verdict on the k = 0 selection)
 * @see g6a-sub-hyperbolic-closure (imp-394: Privalov-Sokhotski pointwise boundary value, k = 0 value term)
 */

// The imp-33706 open-residual analytic tower: Stieltjes boundary quantities indexed by derivative order
// k with N-growth exponent 1/4 + k/2 at the reading strip eps = sqrt(2 pi / N). H0 is NOT in this list.
const ANALYTIC_TOWER = [
  { member: 'selection', k: 0, nExponent: 0.25, row: null }, // k = 0 value member, folded into H3/H4
  { member: 'H4', k: 1, nExponent: 0.75, row: 'H4' }, // k = 1 fold-reading, the load-bearing residual
  { member: 'H3', k: 2, nExponent: 1.25, row: 'H3' }, // k = 2 curvature
];

// H0 characterised as a rung: it has no derivative order and no N-exponent -- it is off the tower axis.
const H0_RUNG = {
  id: 'H0',
  axis: 'provenance', // bibliographic, NOT analytic
  derivativeOrderK: null, // no k-index -> not a Stieltjes boundary-value quantity
  nExponent: null, // no N-growth weight
  dischargeAct: 'document-verification (confirm the reconstructed hypothesis list against the arXiv source)',
  sharesInputsWithH3H4: false, // no curvature bound / strip height / perturbation control feeds it
  foldedByImp33668: false, // the selection-fold operates within the analytic tower, not on H0
  dischargedByImp394: false, // imp-394 covers the k = 0 VALUE term pointwise, not provenance
  onAnalyticLoadPath: false, // a correct citation still leaves H3/H4/H5 open (imp-33637)
};

const H0_IS_TOWER_MEMBER = ANALYTIC_TOWER.some((m) => m.row === H0_RUNG.id);
const H0_INDEPENDENTLY_DISCHARGEABLE =
  H0_RUNG.derivativeOrderK === null &&
  H0_RUNG.sharesInputsWithH3H4 === false &&
  H0_RUNG.foldedByImp33668 === false;

// The isolated H0 pass already run (imp-33637): it moved H0 on its own axis without touching H3/H4.
const IMP33637_H0_PASS = {
  ranInIsolation: true,
  touchedH3orH4: false,
  result: 'double-mis-citation (wrong arXiv id 1802.05390 + no Lemma 5.2 in 1904.12438)',
  h0Resolution: 'upgraded-to-citation-error', // NOT "closed" / NOT "confirmed"
};

// The open catalogue is unchanged by this scoping: still four rows H0, H3, H4, H5 (H0 stays open).
const OPEN_ROWS_BEFORE = ['H0', 'H3', 'H4', 'H5'];
const OPEN_ROWS_AFTER = ['H0', 'H3', 'H4', 'H5'];

export const IMP33745_H0_PROVENANCE_INDEPENDENCE_SCOPING = {
  id: 'imp-33745',
  proofSection: 'S-frontier',
  scopes:
    'Whether the imp-33706 open-residual-tower H0 (Lemma-5.2 provenance) rung can be discharged ' +
    'independently of H3/H4 given imp-33668 folded the k = 0 selection member into H3/H4, or whether ' +
    'H0 is a genuinely distinct standing obligation',
  question:
    'Is H0 a member of the imp-33706 analytic derivative tower (and hence touched by the imp-33668 ' +
    'selection-fold), or is it a distinct provenance obligation independently dischargeable of H3/H4? ' +
    'Bookkeeping / assessment only; G6a OPEN; no QED.',

  // The axis result.
  analyticTower: ANALYTIC_TOWER.map((m) => ({ member: m.member, k: m.k, nExponent: m.nExponent })),
  h0Rung: H0_RUNG,
  h0IsAnalyticTowerMember: H0_IS_TOWER_MEMBER, // false -- no k-index, no N-exponent
  imp33668FoldTouchesH0: H0_RUNG.foldedByImp33668, // false -- fold is within the analytic tower
  imp394DischargesH0: H0_RUNG.dischargedByImp394, // false -- covers the k = 0 value term, not provenance

  // The independence result.
  h0IndependentlyDischargeable: H0_INDEPENDENTLY_DISCHARGEABLE, // true
  h0IsGenuinelyDistinctObligation: true, // distinct standing obligation, its own axis
  h0OnAnalyticLoadPath: H0_RUNG.onAnalyticLoadPath, // false -- distinct-but-orthogonal, not load-bearing
  isolatedH0Pass: IMP33637_H0_PASS, // imp-33637 already moved H0 without touching H3/H4

  openRowsBefore: OPEN_ROWS_BEFORE, // H0, H3, H4, H5
  openRowsAfter: OPEN_ROWS_AFTER, // H0, H3, H4, H5 -- unchanged; H0 stays open as its own obligation

  residualObstruction: 'G6a_shock_lipschitz::strip-height-uniformity',
  residualStatement:
    'H0 is a genuinely distinct standing obligation on the PROVENANCE axis: it is not a member of the ' +
    'imp-33706 analytic derivative tower {selection k = 0, H4 k = 1, H3 k = 2} (it has no derivative ' +
    'order and no N-exponent), so the imp-33668 selection-fold (k = 0 -> H3/H4) has zero bearing on it, ' +
    'and imp-394 discharges the k = 0 VALUE term pointwise but not provenance. H0 discharge is a ' +
    'document-verification act sharing no inputs with the H3/H4 strip-height-uniformity curvature bound, ' +
    'so it is independently dischargeable -- as witnessed by imp-33637 running the channel in isolation ' +
    '(double mis-citation, H0 upgraded to citation-error, not closed) without touching H3/H4. H0 is ' +
    'distinct-but-orthogonal, NOT on the analytic load path (a correct citation would still leave ' +
    'H3/H4/H5 open). The open catalogue stays four rows (H0, H3, H4, H5); H0 remains OPEN.',

  isRigorous: false,
  verdict:
    'BOOKKEEPING / ASSESSMENT ONLY (frontier-direction, NOT rigorous): the imp-33706 open-residual-tower ' +
    'H0 (Lemma-5.2 provenance) rung is a GENUINELY DISTINCT, INDEPENDENTLY-DISCHARGEABLE standing ' +
    'obligation -- it is NOT foldable into H3/H4. H0 is not a member of the imp-33706 analytic ' +
    'derivative tower {selection k = 0 (1/4), H4 k = 1 (3/4), H3 k = 2 (5/4)}: it carries no derivative ' +
    'order k and no N-growth exponent, so the imp-33668 selection-fold, which re-attached the k = 0 ' +
    'value weight to the k = 1/k = 2 derivative weights WITHIN that tower, has ZERO bearing on it. H0 ' +
    'discharge is a document-verification act (confirm the reconstructed hypothesis list against the ' +
    'arXiv source) sharing NO inputs with the analytic H3/H4 strip-height-uniformity curvature bound ' +
    '(the y2-adapted-flow-depth object, imp-3708), so the two decouple -- as directly witnessed by ' +
    'imp-33637 exercising the H0 channel in ISOLATION and returning a double mis-citation (wrong arXiv ' +
    'id 1802.05390 and no Lemma 5.2 in the correct paper 1904.12438), upgrading H0 to citation-error ' +
    '(NOT closed) without moving H3 or H4. imp-394 discharges the k = 0 VALUE term pointwise ' +
    '(Privalov-Sokhotski boundary value, same analytic channel as H3/H4) but NOT the provenance, so it ' +
    'does not discharge H0 either. H0 is DISTINCT-BUT-ORTHOGONAL: a separate honesty / citation ' +
    'obligation, NOT on the analytic load path of the per-N Holder-1/2 bound (a correct citation would ' +
    'still leave H3/H4/H5 open on the repo own analysis). The open catalogue stays four rows ' +
    '(H0, H3, H4, H5) and H0 remains OPEN as its own standing obligation. Bookkeeping / assessment ' +
    'only; G6a_shock_lipschitz stays OPEN; no positivity; imp-3066 off-diagonal endpoint-Hankel ' +
    'K_a >= 0 UNTOUCHED; C_mb share untouched; NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33706-selection-catalogue-count-scoping (the k = 0 selection fold + the open-residual tower ' +
    '{1/4, 3/4, 5/4}); imp-33603-lemma52-port-scoping (the H0..H5 catalogue; H0 the provenance rung; ' +
    'H4 the strip-height-uniformity residual); imp-33637-h0-provenance-verification (the isolated H0 ' +
    'channel: double mis-citation, H0 upgraded to citation-error not closed); imp-33668-part-b-' +
    'selection-residual-scoping (the SUBSUMED-BY-H3/H4 verdict on the k = 0 selection); ' +
    'g6a-sub-hyperbolic-closure (imp-394: Privalov-Sokhotski pointwise boundary value, k = 0 value term).',
};

export const IMP33745_H0_PROVENANCE_INDEPENDENCE_SCOPING_ASSERTIONS = [
  {
    // H0 is not a member of the imp-33706 analytic derivative tower: no k-index, no N-exponent.
    id: 'imp33745-h0-not-a-tower-member',
    description: 'H0 is not a member of the imp-33706 analytic tower (no derivative order k, no N-exponent)',
    holds: () =>
      H0_IS_TOWER_MEMBER === false &&
      H0_RUNG.derivativeOrderK === null &&
      H0_RUNG.nExponent === null &&
      ANALYTIC_TOWER.length === 3,
  },
  {
    // The imp-33668 selection-fold operates within the analytic tower and does NOT touch H0.
    id: 'imp33745-fold-does-not-touch-h0',
    description: 'the imp-33668 k = 0 selection-fold operates within the analytic tower and has zero bearing on H0',
    holds: () =>
      H0_RUNG.foldedByImp33668 === false &&
      IMP33745_H0_PROVENANCE_INDEPENDENCE_SCOPING.imp33668FoldTouchesH0 === false,
  },
  {
    // H0 is independently dischargeable: it shares no inputs with the H3/H4 curvature bound.
    id: 'imp33745-h0-independently-dischargeable',
    description: 'H0 is independently dischargeable of H3/H4 (document-verification act, no shared inputs)',
    holds: () =>
      H0_INDEPENDENTLY_DISCHARGEABLE === true &&
      H0_RUNG.sharesInputsWithH3H4 === false &&
      IMP33745_H0_PROVENANCE_INDEPENDENCE_SCOPING.h0IsGenuinelyDistinctObligation === true,
  },
  {
    // imp-33637 already ran the H0 channel in isolation without touching H3/H4 -- witness of independence.
    id: 'imp33745-isolated-h0-pass-witness',
    description: 'imp-33637 exercised the H0 channel in isolation (upgraded to citation-error) without touching H3/H4',
    holds: () =>
      IMP33637_H0_PASS.ranInIsolation === true &&
      IMP33637_H0_PASS.touchedH3orH4 === false &&
      IMP33637_H0_PASS.h0Resolution === 'upgraded-to-citation-error',
  },
  {
    // imp-394 discharges the k = 0 value term pointwise but NOT H0 provenance; H0 is not load-bearing.
    id: 'imp33745-h0-orthogonal-not-load-bearing',
    description: 'imp-394 does not discharge H0 provenance and H0 is off the analytic load path (distinct-but-orthogonal)',
    holds: () =>
      H0_RUNG.dischargedByImp394 === false &&
      H0_RUNG.onAnalyticLoadPath === false &&
      OPEN_ROWS_AFTER.length === 4 &&
      OPEN_ROWS_AFTER.includes('H0'),
  },
  {
    // Honesty gate: scoping only, not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched.
    id: 'imp33745-honesty-gate-no-qed',
    description: 'Bookkeeping only: not rigorous, G6a stays OPEN, no QED, no refereed bound is changed, imp-3066 untouched',
    holds: () =>
      IMP33745_H0_PROVENANCE_INDEPENDENCE_SCOPING.isRigorous === false &&
      /NO QED/.test(IMP33745_H0_PROVENANCE_INDEPENDENCE_SCOPING.verdict) &&
      /stays OPEN/.test(IMP33745_H0_PROVENANCE_INDEPENDENCE_SCOPING.verdict) &&
      /refereed bound is changed/i.test(IMP33745_H0_PROVENANCE_INDEPENDENCE_SCOPING.verdict) &&
      /imp-3066[^.]*UNTOUCHED/.test(IMP33745_H0_PROVENANCE_INDEPENDENCE_SCOPING.verdict),
  },
];

for (const a of IMP33745_H0_PROVENANCE_INDEPENDENCE_SCOPING_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33745-h0-provenance-independence-scoping assertion failed: ${a.id}`);
  }
}
