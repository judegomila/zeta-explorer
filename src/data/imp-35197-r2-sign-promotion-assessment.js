/**
 * @module imp-35197-r2-sign-promotion-assessment
 * @fileoverview imp-35197: ASSESS whether the imp-2528 N-independent map-to-flow
 * overshoot SIGN (backward RK4 collides LATER than the true Dyson flow, so
 * t_c_flow <= t_c_map) can be PROMOTED into a certified R2 one-sided true-flow
 * bound t_c_flow(N) <= t_c_hi(N) uniformly in N WITHOUT a per-N order-robust
 * flow reference -- and enumerate what such an analytic sign argument would
 * still need. SCOPING / ASSESSMENT ONLY: this module certifies nothing,
 * establishes NO bound, removes NO conditional (C_mb stays GUE-conditional per
 * imp-486), and claims NO QED. R2 stays OPEN past N=200.
 *
 * THE PROMOTION QUESTION
 * ----------------------
 * imp-35150 found the R2 one-sided true-flow bound holds at every rung WITH an
 * order-robust flow reference (N in {50,100,200}; largest MET = 200) but is
 * UNTESTED at N >= 500 because no DP8 / directed-rounding flow reference has
 * been computed there. The map-to-flow truncation carries a DEFINITE,
 * N-independent overshoot SIGN (imp-2510/imp-2528: the fixed-dt backward RK4
 * underestimates the sharpening attraction, so its collision LAGS the flow),
 * making t_c_flow <= t_c_map EXPECTED to persist up the ladder. The question
 * this ticket scopes: could that sign be turned into an ANALYTIC certificate
 * that discharges R2 uniformly in N, sidestepping the flow-reference gate?
 *
 * THE LINKAGE THAT WOULD MAKE IT WORK (why the sign is the right lever)
 * --------------------------------------------------------------------
 * R1/imp-857 already certifies the interval-map bracket
 *     t_c_lo(N) <= t_c_map(N) <= t_c_hi(N)
 * on the closable set (the one-ULP interval RK4 encloses ROUNDOFF of the
 * fixed-dt discrete MAP). So an analytic, N-uniform sign fact
 *     (S)  t_c_flow(N) <= t_c_map(N)
 * would chain with the certified upper bracket endpoint to give exactly R2:
 *     t_c_flow(N) <= t_c_map(N) <= t_c_hi(N)  =>  R2(N) MET.
 * Crucially this chain needs NO per-N flow reference -- only the map bracket
 * (which imp-857 already extends to {1000..100000}) plus the analytic sign (S).
 * So IF (S) were certified uniformly in N, R2 would extend for FREE up the
 * imp-857 map ladder. The entire R2 residual therefore reduces to certifying
 * the single sign statement (S).
 *
 * WHAT (S) STILL NEEDS -- the un-supplied ingredients
 * ---------------------------------------------------
 * The overshoot direction is today a MECHANISTIC / empirical observation, not a
 * theorem. Promoting it to a certified uniform sign requires all of:
 *
 *   I1  A certified per-step RK4 truncation-error SIGN on the imp-362
 *       desingularized Dyson pole form: that one backward RK4 step from a given
 *       state lands at or beyond (later-colliding side of) the exact flow map,
 *       for the specific vector field, at every admissible state on the
 *       collision approach. imp-35170 scoped an ABSOLUTE Butcher error-constant
 *       bound (a MAGNITUDE), which does NOT fix the SIGN; the local truncation
 *       error direction is a separate, un-supplied object.
 *
 *   I2  An order-preservation / monotone-comparison lemma lifting the per-step
 *       ordering (I1) to a COLLISION-TIME ordering. A per-step lag does not
 *       automatically imply a later collision unless the discrete map and the
 *       flow are order-preserving in the relevant scalar (min-gap or its
 *       proxy). This is a discrete-vs-continuous comparison-principle
 *       obligation, not supplied by a magnitude bound.
 *
 *   I3  N-UNIFORMITY of both I1 and I2 as the field STIFFENS toward collision:
 *       the per-step sign must not flip and the comparison must not degrade as
 *       N grows and the smallest gap sharpens (where the desingularized pole
 *       steepens). Absent an N-uniform modulus, I1/I2 certify at fixed N only,
 *       which is no better than the existing per-N flow-reference gate.
 *
 *   I4  The interval-bracket linkage t_c_map(N) <= t_c_hi(N). This is the ONLY
 *       ingredient already MET (R1 / imp-857 one-ULP interval bracket), and it
 *       is what makes (S) sufficient rather than merely necessary.
 *
 * VERDICT (honest partial)
 * ------------------------
 * The sign IS the right lever: IF (S) were certified uniformly in N, R2 would
 * discharge for free up the imp-857 map ladder with NO per-N flow reference.
 * But the sign argument does NOT close R2 by itself today -- it REPLACES the
 * flow-reference-availability gate (imp-35150) with an ANALYTIC-sign-certificate
 * gate wanting I1+I2+I3 (I4 already met). Net: R2 stays OPEN past N=200; the
 * residual is reclassified, not removed. NO bound changes; no refereed bound is changed.
 *
 * SYNTAX NOTE: avoid star-slash sequences in JSDoc; use "dt^4" / "t_c_flow" etc.
 *
 * @see imp-35150  R2 ladder assessment (flow-reference-availability gate)
 * @see imp-35104  C_MB_WEAKER_K_INTERVAL_SCOPE (requirement R2)
 * @see imp-2528   mapVsFlowSemantics one-sided-flow-bound reclassification
 * @see imp-2510   RK4 low-order overshoot direction (dp8_tc <= rk4_tc)
 * @see imp-35170  ABSOLUTE per-scheme RK4 Butcher error-constant bound (magnitude, not sign)
 * @see imp-362    desingularized pole form of the backward Dyson field
 */

// ── The sign statement (S) and the chain that would discharge R2. ─────────────
const SIGN_STATEMENT = {
  label: 'S',
  claim: 't_c_flow(N) <= t_c_map(N)  (uniform in N)',
  statusToday: 'mechanistic/empirical (imp-2510/imp-2528), NOT certified',
  wouldDischargeR2Via:
    't_c_flow(N) <= t_c_map(N) <= t_c_hi(N)  (chain with the R1/imp-857 upper bracket endpoint)',
  needsNoFlowReference: true,
};

// ── The ingredients an analytic promotion of (S) would still need. ────────────
// I4 is the ONLY one already met (R1 / imp-857 interval bracket).
const REQUIRED_INGREDIENTS = [
  {
    id: 'I1',
    name: 'certified-per-step-truncation-error-sign',
    statement:
      'One backward RK4 step on the imp-362 desingularized Dyson pole form lands ' +
      'on the later-colliding side of the exact flow map, for the specific field, ' +
      'at every admissible state on the collision approach.',
    met: false,
    note: 'imp-35170 bounds the Butcher error MAGNITUDE, not its SIGN; direction is a separate object.',
  },
  {
    id: 'I2',
    name: 'order-preservation-per-step-to-collision-time',
    statement:
      'A monotone-comparison lemma lifting the per-step ordering (I1) to a ' +
      'collision-time ordering (later step => later collision) in the min-gap scalar.',
    met: false,
    note: 'discrete-vs-continuous comparison principle; NOT implied by a magnitude bound.',
  },
  {
    id: 'I3',
    name: 'N-uniformity-under-stiffening',
    statement:
      'I1 and I2 hold with an N-UNIFORM modulus as the field stiffens toward ' +
      'collision (smallest gap sharpens, desingularized pole steepens).',
    met: false,
    note: 'without N-uniformity the promotion is fixed-N only -- no better than the flow-reference gate.',
  },
  {
    id: 'I4',
    name: 'interval-bracket-linkage',
    statement: 't_c_map(N) <= t_c_hi(N) from the R1/imp-857 one-ULP interval bracket.',
    met: true,
    note: 'the ONLY ingredient already supplied; it is what makes (S) sufficient for R2.',
  },
];

const OUTSTANDING = REQUIRED_INGREDIENTS.filter((i) => i.met === false);

export const IMP_35197_R2_SIGN_PROMOTION_ASSESSMENT = {
  id: 'imp-35197',
  title:
    'Assess whether the imp-2528 N-independent overshoot sign can be promoted to ' +
    'a certified R2 one-sided true-flow bound without an order-robust flow reference',
  kind: 'assessment-scoping-only',
  changesNoBound: true,
  cMbStaysGueConditional: 'imp-486',
  noQED: true,

  r2Predicate: 't_c_flow(N) <= t_c_hi(N)  (imp-2528 one-sided true-flow bound)',
  signStatement: SIGN_STATEMENT,
  requiredIngredients: REQUIRED_INGREDIENTS,
  outstandingIngredientIds: OUTSTANDING.map((i) => i.id),

  verdict: {
    signIsTheRightLever: true,
    signAloneClosesR2: false,
    ifSignCertifiedThenR2ExtendsForFree:
      'IF (S) t_c_flow(N) <= t_c_map(N) were certified uniformly in N, the chain ' +
      't_c_flow <= t_c_map <= t_c_hi discharges R2 up the imp-857 map ladder with ' +
      'NO per-N order-robust flow reference. The whole R2 residual reduces to (S).',
    whatPromotionReplaces:
      'The sign argument REPLACES the imp-35150 flow-reference-availability gate ' +
      'with an ANALYTIC-sign-certificate gate wanting I1 (per-step truncation-error ' +
      'SIGN, distinct from the imp-35170 magnitude), I2 (per-step => collision-time ' +
      'order-preservation), and I3 (N-uniformity under stiffening). I4 (map <= hi) ' +
      'is already met by R1/imp-857.',
    doesNotAchieve:
      'Does NOT certify (S); does NOT close R2 at N >= 500; does NOT extend the ' +
      'C_mb certificate; does NOT remove the imp-486 GUE conditional; changes NO ' +
      'Lambda bound. R2 stays OPEN past N=200. No refereed bound is changed.',
  },
};

// ── Build-time assertions (honest-scope tripwires). ───────────────────────────
export const IMP_35197_R2_SIGN_PROMOTION_ASSESSMENT_ASSERTIONS = [
  {
    id: 'imp35197-sign-not-certified',
    holds: () =>
      IMP_35197_R2_SIGN_PROMOTION_ASSESSMENT.signStatement.statusToday.includes('NOT certified') &&
      IMP_35197_R2_SIGN_PROMOTION_ASSESSMENT.verdict.signAloneClosesR2 === false,
    why:
      'HONEST-SCOPE TRIPWIRE: the sign (S) is mechanistic/empirical, not a theorem, ' +
      'and must never be recorded as closing R2 by itself. Flipping signAloneClosesR2 ' +
      'to true would falsely discharge the R2 residual without certifying (S).',
  },
  {
    id: 'imp35197-three-outstanding-ingredients',
    holds: () =>
      IMP_35197_R2_SIGN_PROMOTION_ASSESSMENT.outstandingIngredientIds.length === 3 &&
      ['I1', 'I2', 'I3'].every((k) =>
        IMP_35197_R2_SIGN_PROMOTION_ASSESSMENT.outstandingIngredientIds.includes(k)),
    why:
      'Exactly three ingredients (I1 per-step sign, I2 order-preservation, I3 ' +
      'N-uniformity) remain un-supplied. I4 (interval-bracket linkage) is the only ' +
      'one met; if this count drifts an ingredient was silently marked closed.',
  },
  {
    id: 'imp35197-i4-is-the-only-met-ingredient',
    holds: () =>
      IMP_35197_R2_SIGN_PROMOTION_ASSESSMENT.requiredIngredients.filter((i) => i.met === true)
        .length === 1 &&
      IMP_35197_R2_SIGN_PROMOTION_ASSESSMENT.requiredIngredients.find((i) => i.met === true).id ===
        'I4',
    why:
      'Only I4 (t_c_map <= t_c_hi, R1/imp-857) is supplied. I1 (a SIGN) must stay ' +
      'distinct from the imp-35170 MAGNITUDE bound; conflating them would falsely ' +
      'mark I1 met.',
  },
  {
    id: 'imp35197-no-qed-no-bound-change',
    holds: () =>
      IMP_35197_R2_SIGN_PROMOTION_ASSESSMENT.noQED === true &&
      IMP_35197_R2_SIGN_PROMOTION_ASSESSMENT.changesNoBound === true,
    why:
      'This ticket is assessment/scoping only: it must never assert a QED or a bound ' +
      'change. C_mb stays GUE-conditional (imp-486); no refereed bound is changed.',
  },
];
