/**
 * @module imp-36192-step2-g-step-error-apriori-truncation-scope
 *
 * imp-36192 (proof/scoping, S-frontier): enumerate -- WITHOUT claiming any is
 * discharged -- the concrete analytic ingredients a CERTIFIED a-priori RK4/DP5
 * step-budget truncation bound (local + accumulated error as a function of the
 * step dt and the ordinate count N) would require, and show WHY that obligation
 * is DISTINCT from the empirical two-method gap |t_c_RK4 - t_c_DP5| (imp-2466,
 * measured dt/N-scaled in imp-36077).
 *
 * lambda-roadmap.js Step-2 rigorousUpgradeGap lists G-step-error as OPEN with the
 * central caveat: the DP5-vs-RK4 agreement is a CROSS-CHECK, not a certificate --
 * it bounds scheme DISAGREEMENT, so a systematic error SHARED by both the RK4 and
 * the RK5(4)/Dormand-Prince tableaux (a common-mode truncation error, or a shared
 * 1e-4 spacing-threshold stopping bias) cancels in the difference and is invisible
 * to it (imp-36077 named GAP-36077-common-mode-uncertified, and showed the gap is
 * quantization-dominated and NON-monotone in dt, so refining dt does not shrink the
 * blind spot). A certified a-priori bound must instead bound the ABSOLUTE error of a
 * single integrator, common-mode included.
 *
 * SCOPING / ASSESSMENT ONLY. Certifies nothing; bounds no truncation error;
 * integrates no flow; verifies no inequality; changes no bound; establishes no
 * positivity; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * THE OBJECT TO BE BOUNDED
 * -----------------------------------------------------------------------------
 * The backward N-particle Dyson flow x_k'(t) = -sum_{j != k} 1/(x_k - x_j), run
 * from the verified zero ordinates toward the first collision time t_c(N). A
 * fixed-step RK4 (4 stages, order 4) advances it in steps of dt. The certified
 * quantity we want is E_step(dt, N) with |x_num(t) - x_exact(t)| <= E_step, valid
 * up to the collision front, NOT the two-method difference.
 *
 * WHY THE TWO-METHOD GAP IS NOT SUCH A BOUND
 * -----------------------------------------------------------------------------
 * Write x_RK4 = x_exact + e4, x_DP5 = x_exact + e5. Then t_c_RK4 - t_c_DP5 reads
 * off (e4 - e5): the COMMON part of e4 and e5 (same sign, same near-front bias)
 * cancels. A clean truncation-order disagreement would decay as a power of dt;
 * imp-36077 measured instead a quantization-dominated, non-monotone gap (spikes to
 * O(10-21%) relative at isolated (N, dt) rungs, exact zeros where both schemes
 * cross the 1e-4 threshold on the same step). So the visible gap is a POOR proxy
 * for the absolute error and cannot be sharpened into an absolute certificate by
 * refining dt.
 *
 * THE INGREDIENTS AN ABSOLUTE A-PRIORI BOUND WOULD REQUIRE (all OPEN)
 * -----------------------------------------------------------------------------
 * I1 (vector-field / Lipschitz bounds on a tube): a quantitative bound on the RHS
 *    f and a Lipschitz constant L on a tube around the trajectory. Since
 *    f_k ~ 1/(x_k - x_j), both |f| and L scale like 1/delta with delta = min gap.
 * I2 (elementary-differential / high-derivative bound -- the CRUX): the RK4 local
 *    truncation error per step is C * dt^5 * (order-5 elementary differentials of
 *    f). For a 1/delta field the m-th total derivative of the solution scales like
 *    delta^{-(2m-1)}, so the order-5 term scales like delta^{-9}. Local error per
 *    step therefore scales like dt^5 * delta^{-9}: fine in the bulk (delta ~ O(1)),
 *    VACUOUS in the boundary layer as delta -> 0 at the collision front.
 * I3 (accumulated error via discrete Gronwall): global error <=
 *    (local-per-step / dt) * (exp(L T) - 1) / L, needing the N-uniform L of I1 --
 *    which is exactly the SEPARATE open obligation G-gronwall (imp-2520 supplies the
 *    propagation lemma but its per-N consequence is Gronwall-vacuous at the true
 *    nearest-pair front). So I3 inherits the same blow-up.
 * I4 (certified lower bound on the min gap delta(t) along the trajectory): the
 *    constants in I1/I2 can only be instantiated on a tube where delta stays above a
 *    certified delta_lo(t) up to just-before t_c. Producing delta_lo(t) rigorously is
 *    the SEPARATE open obligation G-interval-enclosure (imp-362 gives a single-N
 *    one-ULP interval-RK4 witness only). So I2 and I4 are CIRCULARLY COUPLED: the
 *    truncation bound needs a gap floor, and the gap floor needs a certified flow.
 * I5 (per-step floating-point rounding, distinct from truncation): outward-rounded
 *    interval evaluation of the 4 RK stages contributes an arithmetic error
 *    ~ O(stages * N * eps) per step on top of the truncation term -- the
 *    imp-35761-class arithmetic ceiling, small relative to I2 near the front.
 *
 * READING: G-step-error is NOT independently dischargeable. An absolute a-priori
 * truncation bound is the RIGHT object (unlike the two-method gap it sees common-mode
 * error), but instantiating it needs the N-uniform Lipschitz constant of G-gronwall
 * (I3) and the certified gap floor of G-interval-enclosure (I4); and its leading term
 * dt^5 * delta^{-9} is VACUOUS in the boundary layer near t_c unless dt shrinks faster
 * than delta^{9/5} -- the same collision-front blow-up that makes the Gronwall reading
 * vacuous. Discharging all three Step-2 obligations changes NO Lambda bound on its own
 * (Step 2 feeds the E(N) bridge constants at Step 4, not the headline inequality).
 *
 * @see lambda-roadmap.js Step-2 rigorousUpgradeGap obligation G-step-error (closed:false, imp-35058)
 * @see imp-36077-tc-rk4-dp5-gap-dt-n-scaling (measured gap quantization-dominated / non-monotone in dt; GAP-36077-common-mode-uncertified)
 * @see imp-2466 (DP5 cross-integrator), imp-357 (cross-integrator check)
 * @see backward-flow-stability-gronwall.js (imp-2520; Gronwall-vacuous at the nearest-pair front) -- obligation G-gronwall
 * @see interval-dyson-collision.js / imp-362 (LAMBDA_INTERVAL_DYSON single-N interval-RK4 witness) -- obligation G-interval-enclosure
 * @see imp-35761 (O(N*eps) directed-rounding arithmetic ceiling)
 * @see Hairer-Norsett-Wanner, Solving ODEs I (RK local truncation error via elementary differentials; discrete Gronwall)
 * @see Polymath15 2019; Platt-Trudgian 2021 (verified height / SOTA barrier base)
 */

// -- Anchor + operative constants (import-light; matching imp-36120 / imp-36077) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 ordinate count anchor at T_PT

const EPS_DOUBLE = 2 ** -52; // binary64 machine epsilon (~2.22e-16)

// RK4 (classical): order p = 4, so the LOCAL truncation error per step is O(dt^{p+1}) = O(dt^5),
// carried by order-(p+1) = order-5 elementary differentials of the vector field. RK5(4)/DP5
// (imp-2466 cross-integrator) uses 7 stages; the SHARED (common-mode) part of both cancels in
// the two-method difference and is invisible to the imp-2466 cross-check.
const RK4_ORDER = 4;
const RK4_LOCAL_ORDER = RK4_ORDER + 1; // 5: local truncation error exponent in dt
const RK4_STAGES = 4;
const DP5_STAGES = 7;

// Collision-front scaling. For a 1/delta field (delta = min particle gap) the m-th total
// time-derivative of the solution scales like delta^{-(2m-1)}; the order-5 elementary
// differential therefore scales like delta^{-(2*5-1)} = delta^{-9}. Local truncation error
// per step ~ dt^5 * delta^{-9}: bounded in the bulk, VACUOUS as delta -> 0 at the front.
const DERIV_POWER = (m) => 2 * m - 1; // m-th derivative exponent on 1/delta
const CRUX_DELTA_POWER = DERIV_POWER(RK4_LOCAL_ORDER); // 9

// The imp-36077 finders stop at the first step whose minimum spacing falls below this
// threshold; near the front delta ~ DELTA_FRONT, where the crux factor delta^{-9} is huge.
const DELTA_FRONT = 1e-4; // spacing-threshold stopping scale (imp-36077)

// Illustrative near-front local-truncation SCALE at a representative dt: dt^5 * delta^{-9}.
// This is a SCALE, not a certificate -- it exhibits the boundary-layer blow-up, nothing more.
const DT_ILLUSTRATIVE = 1e-5; // one rung of the imp-36077 dt ladder
const LOCAL_TRUNC_SCALE_FRONT =
  DT_ILLUSTRATIVE ** RK4_LOCAL_ORDER * DELTA_FRONT ** -CRUX_DELTA_POWER; // ~1e11 (vacuous)
const LOCAL_TRUNC_SCALE_BULK = DT_ILLUSTRATIVE ** RK4_LOCAL_ORDER; // delta ~ O(1) bulk: ~1e-25 (tiny)

// The dt-shrink rate that would tame the crux: dt^5 * delta^{-9} bounded needs dt <~ delta^{9/5}.
const DT_TAMING_EXPONENT = CRUX_DELTA_POWER / RK4_LOCAL_ORDER; // 9/5 = 1.8

export const IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE = {
  id: 'imp-36192',
  proofSection: 'S-frontier',
  question:
    'Enumerate the concrete analytic ingredients a CERTIFIED a-priori RK4/DP5 step-budget ' +
    'truncation bound (local + accumulated error as a function of dt and N) would require, and ' +
    'show why that is DISTINCT from the empirical two-method gap |t_c_RK4 - t_c_DP5| (imp-2466), ' +
    'which bounds scheme-DISAGREEMENT and is blind to a shared systematic error. Scoping only; ' +
    'certifies nothing; changes no bound; NO QED.',
  objectToBound: {
    flow: "backward N-particle Dyson flow x_k' = -sum_{j != k} 1/(x_k - x_j), run to first collision t_c(N)",
    integrator: 'fixed-step classical RK4 (4 stages, order 4), step dt; DP5 = RK5(4)/Dormand-Prince, 7 stages',
    target:
      'E_step(dt, N) with |x_num(t) - x_exact(t)| <= E_step up to the collision front -- an ABSOLUTE ' +
      'single-integrator bound, NOT the two-method difference',
  },
  whyTwoMethodGapIsNotABound: {
    decomposition: 'x_RK4 = x_exact + e4, x_DP5 = x_exact + e5; the gap reads off (e4 - e5)',
    commonModeCancels:
      'the common-mode part of e4, e5 shared by both tableaux (same sign, same near-front bias, same ' +
      '1e-4 threshold stopping bias) cancels in the difference and is INVISIBLE to the cross-check',
    empiricalEvidence:
      'imp-36077 measured the gap QUANTIZATION-DOMINATED and NON-MONOTONE in dt (spikes O(10-21%) ' +
      'relative at isolated rungs, exact zeros where both cross the threshold on the same step), so ' +
      'refining dt does NOT shrink the common-mode blind spot -- GAP-36077-common-mode-uncertified',
  },
  ingredients: {
    I1_vectorFieldLipschitz:
      'a quantitative bound on the RHS f and a Lipschitz constant L on a tube around the trajectory; ' +
      'since f_k ~ 1/(x_k - x_j), both |f| and L scale like 1/delta (delta = min gap)',
    I2_elementaryDifferentials:
      'THE CRUX: RK4 local truncation error per step = C * dt^5 * (order-5 elementary differentials of ' +
      'f); for a 1/delta field the m-th solution derivative scales like delta^{-(2m-1)}, so order 5 ~ ' +
      'delta^{-9}; local error per step ~ dt^5 * delta^{-9}, VACUOUS as delta -> 0 at the front',
    I3_accumulatedGronwall:
      'global error <= (local-per-step / dt) * (exp(L T) - 1) / L, needing the N-uniform L of I1 -- the ' +
      'SEPARATE open obligation G-gronwall (imp-2520 lemma is Gronwall-vacuous at the nearest-pair front), ' +
      'so I3 inherits the blow-up',
    I4_certifiedGapFloor:
      'a certified lower bound delta_lo(t) on the min gap along the trajectory up to just-before t_c, so ' +
      'the I1/I2 constants can be instantiated on a real tube -- the SEPARATE open obligation ' +
      'G-interval-enclosure (imp-362 is a single-N witness); I2 and I4 are CIRCULARLY COUPLED',
    I5_perStepRounding:
      'outward-rounded interval evaluation of the 4 RK stages adds ~O(stages * N * eps) arithmetic error ' +
      'per step (imp-35761 class), distinct from truncation and small relative to I2 near the front',
  },
  cruxNumbers: {
    localTruncExponentDt: RK4_LOCAL_ORDER, // 5
    cruxDeltaPower: CRUX_DELTA_POWER, // 9
    localTruncScaleBulk: LOCAL_TRUNC_SCALE_BULK, // ~1e-25 at dt=1e-5, delta~O(1)
    localTruncScaleFront: LOCAL_TRUNC_SCALE_FRONT, // ~1e11 at dt=1e-5, delta~1e-4 (VACUOUS)
    dtTamingExponent: DT_TAMING_EXPONENT, // 9/5: need dt <~ delta^{1.8} to tame the crux
    note:
      'these are SCALES exhibiting the boundary-layer blow-up, NOT certified error bounds; the a-priori ' +
      'RK4 bound is comfortable in the bulk and vacuous near t_c unless dt shrinks faster than delta^{9/5}',
  },
  couplingToOtherObligations: {
    G_gronwall: 'I3 needs the N-uniform Lipschitz constant that G-gronwall must supply (imp-2520)',
    G_interval_enclosure: 'I4 needs the certified gap floor that G-interval-enclosure must supply (imp-362)',
    reading:
      'G-step-error is NOT independently dischargeable: an absolute a-priori truncation bound is the ' +
      'right object but its constants are exactly the two OTHER open Step-2 obligations, and its leading ' +
      'term is vacuous in the collision boundary layer -- the same front blow-up seen in the Gronwall reading',
  },
  conclusion: {
    rightObjectWrongProxy:
      'an ABSOLUTE a-priori single-integrator truncation bound (common-mode included) is the correct ' +
      'certificate; the imp-2466 two-method gap is a disagreement proxy that cancels the common mode',
    obstructionIsCoupledAndFrontBlowup:
      'the obstruction is the coupling to G-gronwall (I3) and G-interval-enclosure (I4) plus the ' +
      'dt^5 * delta^{-9} boundary-layer blow-up at t_c; none of I1-I5 is discharged here',
    noBoundMovesOnItsOwn:
      'discharging all three Step-2 obligations elevates Step 2 to rigorous but changes NO Lambda bound ' +
      'directly -- Step 2 feeds the E(N) bridge constants at Step 4, not the headline inequality',
  },
  isRigorous: false,
  verdict:
    'SCOPING / ASSESSMENT (frontier-direction, NOT rigorous). A CERTIFIED a-priori RK4/DP5 step-budget ' +
    'truncation bound is DISTINCT from the imp-2466 two-method gap: the gap reads off (e4 - e5) and so ' +
    'CANCELS any common-mode error shared by the RK4 and RK5(4)/DP5 tableaux (imp-36077 measured that gap ' +
    'quantization-dominated and non-monotone in dt, GAP-36077-common-mode-uncertified). An absolute bound ' +
    'requires FIVE ingredients, all OPEN: I1 vector-field/Lipschitz bounds on a tube (~1/delta), I2 the ' +
    'order-5 elementary-differential bound whose local error per step ~ dt^5 * delta^{-9} is VACUOUS as the ' +
    'min gap delta -> 0 at the collision front (the crux), I3 accumulated error via discrete Gronwall ' +
    '(needs the N-uniform L of the SEPARATE open G-gronwall, imp-2520 Gronwall-vacuous at the front), I4 a ' +
    'certified gap floor delta_lo(t) (the SEPARATE open G-interval-enclosure, imp-362 single-N witness -- ' +
    'circularly coupled to I2), and I5 the per-step outward-rounded arithmetic ~O(stages*N*eps) (imp-35761 ' +
    'class). G-step-error is thus NOT independently dischargeable and its leading term blows up in the ' +
    'collision boundary layer unless dt shrinks faster than delta^{9/5}. Certifies nothing; bounds no ' +
    'truncation error; integrates no flow; verifies no inequality; changes no bound; establishes no ' +
    'positivity; discharging all three Step-2 obligations feeds the E(N) bridge constants (Step 4), not the ' +
    'headline inequality; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'lambda-roadmap.js Step-2 rigorousUpgradeGap G-step-error (imp-35058); imp-36077 (gap dt/N scaling, ' +
    'quantization-dominated/non-monotone, GAP-36077-common-mode-uncertified); imp-2466 (DP5 cross-integrator); ' +
    'imp-357 (cross-integrator check); imp-2520 (Gronwall propagation lemma, vacuous at the front); imp-362 ' +
    '(LAMBDA_INTERVAL_DYSON single-N interval-RK4 witness); imp-35761 (O(N*eps) arithmetic ceiling); ' +
    'Hairer-Norsett-Wanner (RK local truncation via elementary differentials); Polymath15 2019; ' +
    'Platt-Trudgian 2021 (barrier base / SOTA).',
};

export const IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-36120 / imp-36077.
    id: 'imp36192-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 ordinate count anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // RK4 order 4 -> local truncation error exponent 5; order-5 elementary differentials of a
    // 1/delta field scale like delta^{-9}. Both the crux exponents must be exactly right.
    id: 'imp36192-crux-exponents',
    description: 'RK4 local order = dt^5; order-5 elementary differential of 1/delta field ~ delta^{-9}',
    holds: () =>
      RK4_LOCAL_ORDER === 5 &&
      CRUX_DELTA_POWER === 9 &&
      DERIV_POWER(RK4_LOCAL_ORDER) === 2 * 5 - 1 &&
      DP5_STAGES > RK4_STAGES,
  },
  {
    // The near-front local-truncation SCALE dt^5 * delta^{-9} is vacuous (>> 1) at delta~1e-4,
    // while the bulk scale (delta ~ O(1)) is tiny -- the boundary-layer blow-up headline.
    id: 'imp36192-front-blowup-vs-bulk',
    description: 'Near-front local-trunc scale (~1e11) is vacuous; bulk scale (~1e-25) is tiny',
    holds: () =>
      LOCAL_TRUNC_SCALE_FRONT > 1e9 &&
      LOCAL_TRUNC_SCALE_BULK < 1e-20 &&
      LOCAL_TRUNC_SCALE_FRONT / LOCAL_TRUNC_SCALE_BULK > 1e30 &&
      Math.abs(DT_TAMING_EXPONENT - 1.8) < 1e-12,
  },
  {
    // Five named ingredients I1-I5, with I3/I4 explicitly coupled to the OTHER two open Step-2
    // obligations (G-gronwall, G-interval-enclosure).
    id: 'imp36192-five-coupled-ingredients',
    description: 'Five ingredients I1-I5; I3 couples to G-gronwall, I4 to G-interval-enclosure',
    holds: () => {
      const ing = IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE.ingredients;
      return (
        Object.keys(ing).length === 5 &&
        /G-gronwall/.test(IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE.ingredients.I3_accumulatedGronwall) &&
        /G-interval-enclosure/.test(
          IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE.ingredients.I4_certifiedGapFloor
        )
      );
    },
  },
  {
    // Honesty gate: scoping only; distinct-from-two-method-gap; no bound moved; no QED; no refereed bound is changed.
    id: 'imp36192-honesty-gate',
    description: 'Scoping only; distinct from two-method gap; changes no bound; no QED; no refereed bound is changed',
    holds: () =>
      IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /common-mode/.test(IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE.whyTwoMethodGapIsNotABound.commonModeCancels) &&
      /changes NO Lambda bound/.test(IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE.conclusion.noBoundMovesOnItsOwn) &&
      /NO QED/.test(IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE.verdict),
  },
];

for (const a of IMP36192_STEP2_G_STEP_ERROR_APRIORI_TRUNCATION_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36192-step2-g-step-error-apriori-truncation-scope assertion failed: ${a.id}`);
  }
}
