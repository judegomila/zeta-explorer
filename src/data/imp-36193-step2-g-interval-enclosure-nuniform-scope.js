/**
 * @module imp-36193-step2-g-interval-enclosure-nuniform-scope
 *
 * imp-36193 (proof/scoping, S-frontier): enumerate -- WITHOUT claiming any is
 * discharged -- the concrete N-dependence extension needed to lift the imp-362
 * single-N one-ULP LAMBDA_INTERVAL_DYSON interval-RK4 witness toward an
 * N-UNIFORM enclosure [t_c_lo(N), t_c_hi(N)] of the backward-Dyson collision
 * time, with the 1/(x_k - x_j) pole reduction carried through in interval form.
 *
 * lambda-roadmap.js Step-2 rigorousUpgradeGap lists G-interval-enclosure as OPEN.
 * imp-362 delivers a genuine interval certificate BUT ONLY AT A SINGLE N: the
 * PATH_C_BASELINE_FIT witness table runs off the bundled ZETA_ZEROS table (870
 * zeros), emulates IEEE-754 directed rounding with one-ULP outward inflation on
 * every Float64 op (strictly weaker than Arb / MPFI / CAPD), and closes 4 of 5
 * rows with a bracket half-width strictly below the 0.01 heuristic pm already
 * absorbed into the Lambda bound; the N = 2458 row is OUT OF SCOPE for lack of
 * bundled zeros. The roadmap need is an enclosure "valid at the measured N and
 * extensible with a documented N-dependence". This module scopes EXACTLY that
 * extension -- the gap between the single-N witness and an N-uniform certificate.
 *
 * SCOPING / ASSESSMENT ONLY. Certifies nothing; encloses no collision time at a
 * new N; integrates no flow; verifies no inequality; changes no bound;
 * establishes no positivity; C_mb GUE-conditional (imp-486) untouched; no RH
 * verdict, NO QED. No refereed bound is changed.
 *
 * THE OBJECT TO BE PRODUCED
 * -----------------------------------------------------------------------------
 * A rigorous interval-arithmetic (or ball-arithmetic) enclosure [t_c_lo(N),
 * t_c_hi(N)] of the first collision time of the backward N-particle Dyson flow
 * x_k'(t) = -sum_{j != k} 1/(x_k - x_j), with a DOCUMENTED N-dependence of the
 * bracket half-width, so the certificate can be instantiated at ANY ordinate
 * count N (not only the bundled table), with the 1/(x_k - x_j) pole reduction
 * carried through in interval form (denominator gap bounded away from 0).
 *
 * WHAT THE imp-362 WITNESS ALREADY DELIVERS (single-N)
 * -----------------------------------------------------------------------------
 * A closed bracket [t_c_lo, t_c_hi] with t_c_lo > 0 and width < 0.01 at the
 * bundled ordinates, via dysonDriftInterval / rk4IntervalStep /
 * backwardCollisionInterval with one-ULP outward inflation. It is a real
 * interval enclosure -- but its inputs (the seed ordinate intervals) are a fixed
 * 870-zero table, its arithmetic soundness rests on the one-ULP emulation, and
 * its width is reported only at those N, so it does NOT vary N nor bound the
 * width as a function of N.
 *
 * THE INGREDIENTS AN N-UNIFORM ENCLOSURE WOULD REQUIRE (all OPEN)
 * -----------------------------------------------------------------------------
 * E1 (N-uniform certified seed intervals): the witness seeds from a bundled
 *    870-zero table, so any N whose ordinate count exceeds the table (e.g. the
 *    N = 2458 row) is out of scope. An N-uniform enclosure needs rigorous
 *    interval inputs x_k(0) in [x_k_lo, x_k_hi] for ARBITRARY N -- either a
 *    certified zero-computation (Platt-style rigorous ordinate enclosures) or a
 *    certified surrogate spacing law -- not a finite bundled table.
 * E2 (true directed rounding, not one-ULP emulation): JavaScript does not expose
 *    IEEE-754 directed-rounding modes, so imp-362 inflates by one ULP outward per
 *    op. That is a heuristic emulation, strictly weaker than Arb / MPFI / CAPD.
 *    An N-uniform certificate needs either genuine directed rounding or a PROVEN
 *    one-ULP-suffices lemma, uniformly over the growing op count at large N.
 * E3 (interval pole reduction of 1/(x_k - x_j) -- the CRUX): the drift term is a
 *    reciprocal of a particle gap. In interval form 1/[g_lo, g_hi] is a valid
 *    enclosure ONLY when g_lo > 0; once the gap interval straddles 0 near the
 *    collision front the division is not an enclosure (blows up to an unbounded
 *    interval). Even with g_lo > 0 the reciprocal interval WIDTH scales like
 *    gapWidth / g_lo^2 ~ delta_lo^{-2}, so it explodes as the min gap delta -> 0.
 *    Carrying the pole reduction in interval form therefore needs a CERTIFIED gap
 *    floor delta_lo(t) > 0 up to just-before t_c -- the SAME object as the open
 *    G-gronwall floor (imp-2520, Gronwall-vacuous at the nearest-pair front) and
 *    the imp-36192 truncation crux I4. So E3 is CIRCULARLY COUPLED to G-gronwall.
 * E4 (N-uniform interval-width control / wrapping): each RK4 interval step inflates
 *    the enclosure (dependency / wrapping effect), and the drift sums N(N-1)
 *    pairwise pole terms per stage, so the per-step width growth compounds BOTH in
 *    the step count to reach t_c AND in the O(N^2) term count. An N-uniform bracket
 *    needs a documented bound on total accumulated width as a function of N --
 *    coupling to the G-step-error step budget (imp-36192) and again to G-gronwall.
 * E5 (documented N-dependence of the half-width -- the deliverable): the endpoint
 *    is a monotone, extensible law halfWidth(N) with [t_c_lo(N), t_c_hi(N)]
 *    instantiable at any N, assembled from E1-E4. imp-362 reports width only at the
 *    bundled N; converting that to an N-parametrised certificate IS the obligation.
 *
 * READING: G-interval-enclosure is a REAL interval certificate stuck at a single
 * N. The barrier to N-uniformity is not the interval machinery (imp-362 has it)
 * but (E1) certified seed intervals at arbitrary N, (E2) sound rounding over a
 * growing op count, and above all (E3) the pole reduction 1/(x_k - x_j), whose
 * interval width ~ delta_lo^{-2} blows up at the collision front and needs the
 * SAME certified gap floor that G-gronwall must supply -- so the three Step-2
 * obligations are circularly coupled. Discharging G-interval-enclosure changes NO
 * Lambda bound on its own (Step 2 feeds the E(N) bridge constants at Step 4, not
 * the headline inequality).
 *
 * @see lambda-roadmap.js Step-2 rigorousUpgradeGap obligation G-interval-enclosure (closed:false, imp-35058)
 * @see lambda-interval-dyson.js / interval-dyson-integrator.mjs (imp-362 LAMBDA_INTERVAL_DYSON single-N witness; one-ULP outward inflation; 870-zero bundle; N=2458 out of scope)
 * @see imp-36192-step2-g-step-error-apriori-truncation-scope.js (companion; its ingredient I4 = this gap floor)
 * @see backward-flow-stability-gronwall.js (imp-2520; Gronwall-vacuous at the nearest-pair front) -- obligation G-gronwall
 * @see imp-35761 (O(N*eps) directed-rounding arithmetic ceiling)
 * @see Platt (rigorous ordinate enclosures); Arb / MPFI / CAPD (true interval arithmetic)
 * @see Polymath15 2019; Platt-Trudgian 2021 (verified height / SOTA barrier base)
 */

// -- Anchor + operative constants (import-light; matching imp-36192 / imp-36077) --------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this scope
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 ordinate count anchor at T_PT (target N-uniform scale)

const EPS_DOUBLE = 2 ** -52; // binary64 machine epsilon (~2.22e-16); one-ULP inflation unit

// imp-362 witness facts (documented on LAMBDA_INTERVAL_DYSON / lambda-interval-dyson.js).
const ZEROS_BUNDLED = 870; // ZETA_ZEROS table size the witness seeds from
const HEURISTIC_HALFWIDTH = 0.01; // heuristic pm the closed bracket must beat (and does, 4 of 5 rows)
const WITNESS_CLOSED_ROWS = 4; // of 5 PATH_C_BASELINE_FIT rows (N=2458 out of scope)

// Pairwise pole-term count: the drift x_k' = -sum_{j != k} 1/(x_k - x_j) has N(N-1) ordered
// reciprocal terms per evaluation. Interval width accumulates across all of them.
const POLE_TERMS = (N) => N * (N - 1);
const POLE_TERMS_AT_TPT = POLE_TERMS(N_AT_TPT); // ~2.39e11 pole terms at the target scale

// Interval pole-reduction crux. For a gap enclosure [g_lo, g_hi] with g_lo > 0, the reciprocal
// interval 1/[g_lo, g_hi] = [1/g_hi, 1/g_lo] has width (g_hi - g_lo)/(g_lo*g_hi) ~ gapWidth/g_lo^2.
// As the min gap delta -> 0 at the collision front, the per-pole interval width scales like
// delta_lo^{-2}: bounded in the bulk (delta ~ O(1)), VACUOUS at the front. If the gap interval
// straddles 0, 1/[g] is not even an enclosure. This is why E3 needs a CERTIFIED gap floor.
const DELTA_FRONT = 1e-4; // near-front min-gap scale (matching imp-36192 spacing-threshold)
const POLE_WIDTH_POWER = 2; // reciprocal-interval width exponent on 1/delta_lo
const POLE_WIDTH_SCALE_FRONT = DELTA_FRONT ** -POLE_WIDTH_POWER; // ~1e8 per pole term (vacuous)
const POLE_WIDTH_SCALE_BULK = 1; // delta ~ O(1) bulk: per-pole reciprocal width ~ O(1)

// Aggregate near-front drift-interval width SCALE: per-pole blow-up times the O(N^2) term count.
// A SCALE exhibiting the two-fold N-uniformity obstruction, NOT a certified width.
const DRIFT_WIDTH_SCALE_FRONT_AT_TPT = POLE_WIDTH_SCALE_FRONT * POLE_TERMS_AT_TPT; // ~2.4e19

export const IMP36193_STEP2_G_INTERVAL_ENCLOSURE_NUNIFORM_SCOPE = {
  id: 'imp-36193',
  proofSection: 'S-frontier',
  question:
    'Enumerate the concrete N-dependence extension needed to lift the imp-362 single-N one-ULP ' +
    'LAMBDA_INTERVAL_DYSON interval-RK4 witness toward an N-UNIFORM enclosure [t_c_lo(N), t_c_hi(N)] ' +
    'of the backward-Dyson collision time, with the 1/(x_k - x_j) pole reduction carried through in ' +
    'interval form. Scoping only; certifies nothing; changes no bound; NO QED.',
  objectToProduce: {
    flow: "backward N-particle Dyson flow x_k' = -sum_{j != k} 1/(x_k - x_j), enclosed to first collision t_c(N)",
    machinery: 'interval / ball arithmetic RK4 (dysonDriftInterval, rk4IntervalStep, backwardCollisionInterval)',
    target:
      'a rigorous enclosure [t_c_lo(N), t_c_hi(N)] with a DOCUMENTED N-dependence of the bracket ' +
      'half-width, instantiable at ANY ordinate count N, with the 1/(x_k - x_j) pole reduction carried ' +
      'in interval form (denominator gap bounded away from 0) -- NOT a fixed-table single-N witness',
  },
  whatWitnessDelivers: {
    scope: 'a genuine interval enclosure but only at the bundled ordinates (single N)',
    closedRows:
      WITNESS_CLOSED_ROWS + ' of 5 PATH_C_BASELINE_FIT rows close a bracket with t_c_lo > 0 and ' +
      'width < 0.01 heuristic; the N = 2458 row is OUT OF SCOPE (ZETA_ZEROS bundles only 870 zeros)',
    rounding: 'one-ULP outward inflation per Float64 op EMULATES directed rounding (weaker than Arb/MPFI/CAPD)',
    limitation:
      'inputs are a fixed 870-zero table, arithmetic soundness rests on the one-ULP emulation, and the ' +
      'width is reported only at those N -- it does NOT vary N nor bound the width as a function of N',
  },
  ingredients: {
    E1_certifiedSeedIntervals:
      'rigorous interval seeds x_k(0) in [x_k_lo, x_k_hi] for ARBITRARY N (certified ordinate enclosures ' +
      'a la Platt, or a certified surrogate spacing law) -- not the bundled 870-zero table that puts ' +
      'N = 2458 out of scope',
    E2_soundRounding:
      'true IEEE-754 directed rounding OR a PROVEN one-ULP-suffices lemma, uniformly over the op count ' +
      'that grows with N; imp-362 one-ULP outward inflation is a heuristic emulation (weaker than Arb/MPFI/CAPD)',
    E3_intervalPoleReduction:
      'THE CRUX (interval pole reduction): 1/[g_lo, g_hi] is an enclosure only for g_lo > 0, and its width ~ gapWidth/g_lo^2 ~ ' +
      'delta_lo^{-2} blows up as the min gap delta -> 0 at the front; needs a CERTIFIED gap floor ' +
      'delta_lo(t) > 0 up to just-before t_c -- the SAME object as the open G-gronwall floor (imp-2520), ' +
      'so E3 is CIRCULARLY COUPLED to G-gronwall',
    E4_widthControl:
      'N-uniform control of accumulated interval width: each RK4 interval step inflates by wrapping and ' +
      'the drift sums N(N-1) pole terms per stage, so width compounds in BOTH the step count and the ' +
      'O(N^2) term count; needs a documented total-width bound in N (couples to G-step-error, imp-36192)',
    E5_documentedNDependence:
      'THE DELIVERABLE: a monotone extensible half-width law halfWidth(N) with [t_c_lo(N), t_c_hi(N)] ' +
      'instantiable at any N, assembled from E1-E4; imp-362 reports width only at the bundled N',
  },
  cruxNumbers: {
    zerosBundled: ZEROS_BUNDLED, // 870
    heuristicHalfWidth: HEURISTIC_HALFWIDTH, // 0.01
    poleTermsAtTPT: POLE_TERMS_AT_TPT, // ~2.39e11 pairwise reciprocal terms at N ~ 488602
    poleWidthPower: POLE_WIDTH_POWER, // 2: reciprocal-interval width ~ delta_lo^{-2}
    poleWidthScaleBulk: POLE_WIDTH_SCALE_BULK, // ~1 per pole term (delta ~ O(1))
    poleWidthScaleFront: POLE_WIDTH_SCALE_FRONT, // ~1e8 per pole term at delta ~ 1e-4 (VACUOUS)
    driftWidthScaleFrontAtTPT: DRIFT_WIDTH_SCALE_FRONT_AT_TPT, // ~2.4e19: per-pole blow-up x O(N^2) count
    note:
      'these are SCALES exhibiting the two-fold N-uniformity obstruction (pole blow-up at the front x ' +
      'O(N^2) term count), NOT certified interval widths; the reciprocal reduction is comfortable in the ' +
      'bulk and vacuous near t_c unless the gap floor delta_lo stays bounded away from 0',
  },
  couplingToOtherObligations: {
    G_gronwall: 'E3 needs the certified gap floor delta_lo(t) > 0 that G-gronwall must supply (imp-2520)',
    G_step_error: 'E4 width control needs the N-uniform step budget of G-step-error (imp-36192)',
    reading:
      'G-interval-enclosure is a real interval certificate stuck at a single N; its pole reduction (E3) ' +
      'and width control (E4) require exactly the two OTHER open Step-2 obligations, so all three are ' +
      'circularly coupled through the same collision-front gap floor',
  },
  conclusion: {
    machineryExistsScaleMissing:
      'the interval machinery already exists (imp-362); the missing piece is N-uniformity -- certified ' +
      'seeds at arbitrary N (E1), sound rounding over a growing op count (E2), and above all the pole ' +
      'reduction (E3) whose reciprocal-interval width ~ delta_lo^{-2} blows up at the front',
    obstructionIsCoupledFrontFloor:
      'the obstruction is the collision-front gap floor shared with G-gronwall (E3) and the O(N^2) ' +
      'width compounding shared with G-step-error (E4); none of E1-E5 is discharged here',
    noBoundMovesOnItsOwn:
      'discharging G-interval-enclosure elevates Step 2 toward rigorous but changes NO Lambda bound ' +
      'directly -- Step 2 feeds the E(N) bridge constants at Step 4, not the headline inequality',
  },
  isRigorous: false,
  verdict:
    'SCOPING / ASSESSMENT (frontier-direction, NOT rigorous). Lifting the imp-362 single-N one-ULP ' +
    'LAMBDA_INTERVAL_DYSON interval-RK4 witness (a genuine enclosure, 4 of 5 PATH_C_BASELINE_FIT rows ' +
    'closed with width < 0.01 heuristic, but seeded from a bundled 870-zero table with N=2458 out of ' +
    'scope) to an N-UNIFORM [t_c_lo(N), t_c_hi(N)] requires FIVE ingredients, all OPEN: E1 certified seed ' +
    'intervals x_k(0) at ARBITRARY N (not the bundled table), E2 true directed rounding or a proven ' +
    'one-ULP-suffices lemma over the growing op count (imp-362 emulates with one-ULP outward inflation, ' +
    'weaker than Arb/MPFI/CAPD), E3 the CRUX interval pole reduction of 1/(x_k - x_j) whose reciprocal ' +
    'interval width ~ delta_lo^{-2} blows up as the min gap delta -> 0 at the collision front and needs the ' +
    'SAME certified gap floor as the open G-gronwall (imp-2520, Gronwall-vacuous at the front) -- so E3 is ' +
    'CIRCULARLY COUPLED to G-gronwall, E4 N-uniform interval-width control against wrapping and the O(N^2) ' +
    'pole-term count (couples to the G-step-error step budget, imp-36192), and E5 the documented N-dependence ' +
    'of the half-width that IS the deliverable. G-interval-enclosure is a real interval certificate stuck at ' +
    'a single N; the barrier is N-uniformity, not the interval machinery. Certifies nothing; encloses no ' +
    'collision time at a new N; integrates no flow; verifies no inequality; changes no bound; establishes no ' +
    'positivity; discharging all three Step-2 obligations feeds the E(N) bridge constants (Step 4), not the ' +
    'headline inequality; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'lambda-roadmap.js Step-2 rigorousUpgradeGap G-interval-enclosure (imp-35058); imp-362 ' +
    '(LAMBDA_INTERVAL_DYSON single-N interval-RK4 witness; one-ULP outward inflation; 870-zero bundle; ' +
    'N=2458 out of scope; 4 of 5 rows width < 0.01 heuristic); imp-36192 (companion G-step-error scope; ' +
    'its ingredient I4 = this gap floor); imp-2520 (Gronwall propagation lemma, vacuous at the front); ' +
    'imp-35761 (O(N*eps) arithmetic ceiling); Platt (rigorous ordinate enclosures); Arb/MPFI/CAPD (true ' +
    'interval arithmetic); Polymath15 2019; Platt-Trudgian 2021 (barrier base / SOTA).',
};

export const IMP36193_STEP2_G_INTERVAL_ENCLOSURE_NUNIFORM_SCOPE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-36192 / imp-36077.
    id: 'imp36193-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 ordinate count anchored at T_PT = 3e12',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // imp-362 witness facts: 870-zero bundle, 0.01 heuristic half-width to beat, 4 of 5 rows closed.
    id: 'imp36193-witness-facts',
    description: 'imp-362 witness: 870-zero bundle, 0.01 heuristic half-width, 4 of 5 rows closed',
    holds: () =>
      ZEROS_BUNDLED === 870 &&
      Math.abs(HEURISTIC_HALFWIDTH - 0.01) < 1e-15 &&
      WITNESS_CLOSED_ROWS === 4 &&
      EPS_DOUBLE === 2 ** -52,
  },
  {
    // Pole-reduction crux: per-pole reciprocal-interval width ~ delta_lo^{-2} = 1e8 near the front,
    // ~1 in the bulk; times the O(N^2) pole count it compounds to a huge drift-width scale.
    id: 'imp36193-pole-blowup-vs-bulk',
    description: 'Near-front reciprocal-interval width ~1e8 (vacuous); bulk ~1; O(N^2) pole count compounds it',
    holds: () =>
      POLE_WIDTH_POWER === 2 &&
      Math.abs(POLE_WIDTH_SCALE_FRONT - 1e8) / 1e8 < 1e-9 &&
      POLE_WIDTH_SCALE_BULK === 1 &&
      POLE_TERMS_AT_TPT > 1e11 &&
      DRIFT_WIDTH_SCALE_FRONT_AT_TPT > 1e18,
  },
  {
    // Five named ingredients E1-E5, with E3/E4 explicitly coupled to the OTHER two open Step-2
    // obligations (G-gronwall via the gap floor, G-step-error via the step budget).
    id: 'imp36193-five-coupled-ingredients',
    description: 'Five ingredients E1-E5; E3 couples to G-gronwall, E4 to G-step-error',
    holds: () => {
      const ing = IMP36193_STEP2_G_INTERVAL_ENCLOSURE_NUNIFORM_SCOPE.ingredients;
      return (
        Object.keys(ing).length === 5 &&
        /G-gronwall/.test(ing.E3_intervalPoleReduction) &&
        /G-step-error/.test(ing.E4_widthControl) &&
        /pole reduction/i.test(ing.E3_intervalPoleReduction)
      );
    },
  },
  {
    // Honesty gate: scoping only; single-N witness only; no bound moved; no QED; no refereed bound is changed.
    id: 'imp36193-honesty-gate',
    description: 'Scoping only; single-N witness; changes no bound; no QED; no refereed bound is changed',
    holds: () =>
      IMP36193_STEP2_G_INTERVAL_ENCLOSURE_NUNIFORM_SCOPE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /single N/.test(IMP36193_STEP2_G_INTERVAL_ENCLOSURE_NUNIFORM_SCOPE.whatWitnessDelivers.scope) &&
      /changes NO Lambda bound/.test(
        IMP36193_STEP2_G_INTERVAL_ENCLOSURE_NUNIFORM_SCOPE.conclusion.noBoundMovesOnItsOwn
      ) &&
      /NO QED/.test(IMP36193_STEP2_G_INTERVAL_ENCLOSURE_NUNIFORM_SCOPE.verdict) &&
      /refereed bound is changed/i.test(IMP36193_STEP2_G_INTERVAL_ENCLOSURE_NUNIFORM_SCOPE.verdict),
  },
];

for (const a of IMP36193_STEP2_G_INTERVAL_ENCLOSURE_NUNIFORM_SCOPE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36193-step2-g-interval-enclosure-nuniform-scope assertion failed: ${a.id}`);
  }
}
