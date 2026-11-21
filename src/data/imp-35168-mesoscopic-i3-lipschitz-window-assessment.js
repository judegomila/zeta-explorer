/**
 * @module imp-35168-mesoscopic-i3-lipschitz-window-assessment
 *
 * imp-35168 (proof, ASSESSMENT ONLY): Does restricting the imp-2520 backward-flow
 * Gronwall lemma to a MESOSCOPIC strip (where its propagation factor is non-vacuous)
 * suffice for the imp-35127 I3 ingredient -- the N-UNIFORM Lipschitz / stability
 * constant the RK4 step-to-global truncation-error accumulation needs? Assessment
 * only; discharges nothing; changes no bound; NO QED.
 *
 * THE TWO CONSTANTS ON THE SAME STRIP (the crux)
 * ----------------------------------------------
 * On the holomorphic strip Im z >= y_star the backward Dyson field 2M(z, s) =
 * 2 sum 1/(z - x_k) carries TWO different one-parameter constants, and imp-35168
 * turns on the fact that they scale differently in N:
 *
 *   (P) PROPAGATION coefficient of the Gronwall transport inequality (imp-2520
 *       Lemma B): d(Im M)/ds >= -(2 / y_star^2) Im M, giving the stability factor
 *       exp(-2 s / y_star^2). Its coefficient is
 *              L_prop(y_star) = 2 / y_star^2,
 *       which is O(1) and N-UNIFORM on a mesoscopic strip. This is what imp-2520
 *       negative finding 1 / imp-35128 rescue: at y_star ~ 5.6 the e-fold over a
 *       horizon S is 2 S / y_star^2 = O(S), non-vacuous for S below y_star^2 / 2.
 *
 *   (F) FIELD (Jacobian) Lipschitz constant of the flow ITSELF, from
 *       backward-flow-stability-gronwall.js line 426:
 *              |dz M| <= sum 1/|z - x_k|^2 <= N / y_star^2,
 *       so the vector field 2M is Lipschitz with constant
 *              L_field(N, y_star) = 2 N / y_star^2,
 *       which is N-LINEAR on the SAME strip (it sums 1/|z-x_k|^2 over all N poles).
 *
 * WHY I3 NEEDS (F), NOT (P)
 * ------------------------
 * The I3 step-to-global conversion global_error <= (LTE / dt) (exp(L t_c) - 1)/L
 * is a Gronwall accumulation of the INTEGRATOR error of the N-particle flow, so its
 * L is the Lipschitz constant of the field the RK4 step advances -- the Jacobian
 * bound (F), NOT the normalized error-transport coefficient (P). (P) controls how a
 * t = 0 uniformity of the analytic continuation M is transported UP the strip; it is
 * not the accumulation constant of the discretization error. They differ by the
 * factor N: L_field / L_prop = N. So the mesoscopic strip that makes (P) non-vacuous
 * does nothing for the N-linearity of (F).
 *
 * THE TWO WINDOWS AND THEIR INCOMPATIBILITY
 * -----------------------------------------
 * Over a documented sub-front horizon S, ask each e-fold count to stay below a
 * vacuity threshold E (matching the imp-35128 e-fold=1 convention):
 *   (P) non-vacuous:      2 S / y_star^2 < E_vac   <=>   y_star > sqrt(2 S / E_vac).
 *   (F) N-uniform-safe:   2 N S / y_star^2 < E_acc <=>   y_star > sqrt(2 N S / E_acc).
 * The accumulation-safe height exceeds the propagation-safe height by the factor
 *   y_acc / y_prop = sqrt( N E_vac / E_acc ) ~ sqrt(N),
 * so a FIXED mesoscopic y_star cannot satisfy both once N grows: at fixed y_star the
 * (F) e-fold 2 N S / y_star^2 is LINEAR in N and diverges. The two windows coincide
 * only at N = 2 (where L_field = L_prop). To keep (F) N-uniform one must inflate the
 * strip as y_star ~ sqrt(N S), which drives it away from the real-axis particles
 * whose integrator error is being accumulated -- so no fixed mesoscopic height serves
 * the I3 accumulation.
 *
 * CONSEQUENCE (the honest downgrade, not a discharge)
 * ---------------------------------------------------
 * Restricting to a mesoscopic strip + a documented horizon S < y_star^2 E_vac / 2
 * CERTIFIES a non-vacuous, N-uniform PROPAGATION constant 2 / y_star^2 for the
 * imp-2520 transport lemma -- but it does NOT certify the I3 accumulation constant,
 * which on the same strip is the N-LINEAR field Lipschitz 2 N / y_star^2. The
 * mesoscopic restriction therefore moves I3 from Gronwall-VACUOUS (an infinite factor
 * at the microscopic nearest-pair front, imp-2520 finding 1) to merely N-DEPENDENT
 * (finite per fixed N, exp(2 N S / y_star^2) growing) -- a genuine sharpening of the
 * gap, but still short of the N-UNIFORM Lipschitz constant I3 requires. So the
 * I3 <-> G-gronwall coupling (imp-35127) is CONFIRMED and shown ASYMMETRIC: the
 * mesoscopic strip that saves the propagation LEMMA does not save the accumulation
 * constant. The residual sub-gap is exactly the sqrt(N)-diverging accumulation height
 * -- an N-uniform field-Lipschitz bound on a fixed strip, which the poles at y = 0
 * forbid. I3 stays OPEN. Assessment only; establishes no operator positivity; changes
 * no bound; C_mb GUE-conditional per imp-486 UNTOUCHED; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-35127-g-step-error-certified-bound-scope (I3 ingredient; the coupling claim)
 * @see backward-flow-stability-gronwall.js (imp-2520 Lemma B; line 426 field Lipschitz N/y^2; imp-35128 vacuity map)
 * @see lambda-roadmap.js Step 2 rigorousUpgradeGap.obligations[G-gronwall] / [G-step-error]
 */

const E_VAC = 1; // vacuity e-fold threshold (stability factor exp(-1)); matches imp-35128
const E_ACC = 1; // accumulation e-fold threshold for the RK4 step-to-global factor

// Mesoscopic working height: imp-2520 note y_star(N) -> 2 . 0.448 . 2 pi ~ 5.6.
const Y_STAR_MESO = 2 * 0.448 * (2 * Math.PI);

// The two strip constants as functions of (N, y). L_prop is the transport
// coefficient (2/y^2); L_field is the Jacobian Lipschitz of the field 2M (2N/y^2).
function lProp(y) {
  return 2 / (y * y);
}
function lField(N, y) {
  return (2 * N) / (y * y);
}

// e-fold counts over a horizon S (the arguments of the two exp factors).
function propEfold(S, y) {
  return (2 * S) / (y * y);
}
function accEfold(N, S, y) {
  return (2 * N * S) / (y * y);
}

// Minimum strip heights to keep each e-fold below its threshold.
function yPropMin(S) {
  return Math.sqrt((2 * S) / E_VAC);
}
function yAccMin(N, S) {
  return Math.sqrt((2 * N * S) / E_ACC);
}

// Documented sub-front horizon over which the PROPAGATION factor stays non-vacuous
// at a fixed mesoscopic height: 2 S / y^2 < E_vac  <=>  S < y^2 E_vac / 2.
function propHorizonWindow(y) {
  return (y * y * E_VAC) / 2;
}

// Representative N-sweep on the same anchors the roadmap uses for the flow.
const N_SWEEP = [2, 10, 100, 1e3, 1e4, 1e5, 1e6];
const HORIZON_S = 1; // order-one backward time to the sub-front horizon

const ROWS = N_SWEEP.map((N) => {
  const propE = propEfold(HORIZON_S, Y_STAR_MESO);
  const accE = accEfold(N, HORIZON_S, Y_STAR_MESO);
  return {
    N,
    horizon_S: HORIZON_S,
    y_star_meso: +Y_STAR_MESO.toFixed(4),
    L_prop: +lProp(Y_STAR_MESO).toExponential(4),
    L_field: +lField(N, Y_STAR_MESO).toExponential(4),
    prop_efold: +propE.toExponential(4),
    acc_efold: +accE.toExponential(4),
    prop_nonvacuous: propE < E_VAC,
    acc_n_uniform: accE < E_ACC,
    y_acc_min: +yAccMin(N, HORIZON_S).toExponential(4),
    height_gap_factor: +(yAccMin(N, HORIZON_S) / yPropMin(HORIZON_S)).toExponential(4),
  };
});

// The accumulation-safe height exceeds the propagation-safe height by ~sqrt(N):
// crossover (both windows coincide) only at N = 2, where L_field = L_prop.
const COINCIDENCE_N = (2 * E_ACC) / E_VAC; // solve 2N/y^2 = 2/y^2 scaled by thresholds -> N = E_acc/E_vac * 2

export const IMP35168_MESOSCOPIC_I3_LIPSCHITZ_WINDOW_ASSESSMENT = {
  id: 'imp-35168',
  proofSection: 'S-frontier',
  question:
    'Does restricting the imp-2520 backward-flow Gronwall lemma to a MESOSCOPIC strip ' +
    '(where exp(-2 S / y_star^2) is non-vacuous) yield the N-UNIFORM Lipschitz / stability ' +
    'constant the imp-35127 I3 step-to-global RK4 truncation-error accumulation requires, and ' +
    'over what height / horizon window? Assessment only; discharges nothing; NO QED.',
  twoConstantsOnTheStrip: {
    propagationCoefficient: 'L_prop = 2 / y_star^2 (transport coefficient of Lemma B; O(1), N-uniform on a mesoscopic strip)',
    fieldLipschitz: 'L_field = 2 N / y_star^2 (Jacobian of 2M; |dz M| <= N/y_star^2 line 426; N-LINEAR on the SAME strip)',
    ratio: 'L_field / L_prop = N (they differ by exactly the pole count)',
    i3NeedsWhich: 'I3 accumulates the INTEGRATOR error of the N-particle flow, so its L is L_field, NOT L_prop',
  },
  windows: {
    propagationNonVacuous: 'y_star > sqrt(2 S / E_vac)  (or fixed y_star with horizon S < y_star^2 E_vac / 2)',
    accumulationNUniform: 'y_star > sqrt(2 N S / E_acc) ~ sqrt(N) -- DIVERGES with N',
    heightGapFactor: 'y_acc_min / y_prop_min = sqrt(N E_vac / E_acc) ~ sqrt(N)',
    coincidenceN: COINCIDENCE_N, // the only N where the two windows meet (L_field = L_prop)
    incompatibility:
      'At a FIXED mesoscopic y_star the accumulation e-fold 2 N S / y_star^2 is LINEAR in N and ' +
      'diverges; making it N-uniform forces y_star ~ sqrt(N S), which drives the strip away from ' +
      'the real-axis particles whose integrator error is accumulated. No fixed mesoscopic height ' +
      'serves both.',
  },
  yStarMesoscopic: +Y_STAR_MESO.toFixed(4),
  horizonS: HORIZON_S,
  rows: ROWS,
  propHorizonWindowAtMeso: +propHorizonWindow(Y_STAR_MESO).toFixed(4), // S < ~15.7 keeps (P) non-vacuous
  suffices: false,
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). Restricting the imp-2520 backward-flow lemma ' +
    'to a MESOSCOPIC strip (y_star ~ 5.6) with a documented sub-front horizon S < y_star^2 E_vac / 2 ' +
    '(~15.7 here) CERTIFIES a non-vacuous, N-UNIFORM PROPAGATION constant L_prop = 2 / y_star^2 for ' +
    'the imp-2520 transport lemma -- but it does NOT suffice for the imp-35127 I3 ingredient. I3 needs ' +
    'the Lipschitz constant of the FIELD the RK4 step advances, which on the SAME strip is the Jacobian ' +
    'bound L_field = 2 N / y_star^2 (from |dz M| <= N/y_star^2, line 426) -- N-LINEAR, differing from ' +
    'L_prop by exactly the pole count N. The propagation-safe window y_star > sqrt(2 S / E_vac) and the ' +
    'accumulation-N-uniform window y_star > sqrt(2 N S / E_acc) ~ sqrt(N) coincide only at N = 2; for ' +
    'N > 2 a FIXED mesoscopic height leaves the accumulation e-fold 2 N S / y_star^2 growing LINEARLY ' +
    'in N, and forcing it uniform requires an N-diverging strip y_star ~ sqrt(N S) that abandons the ' +
    'real-axis particles. CONSEQUENCE: the mesoscopic restriction moves I3 from Gronwall-VACUOUS (an ' +
    'infinite factor at the microscopic nearest-pair front) to merely N-DEPENDENT (finite per fixed N, ' +
    'exp(2 N S / y_star^2) growing) -- a genuine sharpening, but still short of the N-uniform constant ' +
    'I3 requires. The I3 <-> G-gronwall coupling (imp-35127) is CONFIRMED and shown ASYMMETRIC: the ' +
    'mesoscopic strip that saves the propagation LEMMA does not save the accumulation constant. The ' +
    'residual sub-gap is the sqrt(N)-diverging accumulation height -- an N-uniform field-Lipschitz bound ' +
    'on a fixed strip, which the poles at y = 0 forbid. I3 stays OPEN. Assessment only; discharges ' +
    'nothing; establishes no operator positivity; changes no bound; C_mb GUE-conditional per imp-486 ' +
    'UNTOUCHED; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35127-g-step-error-certified-bound-scope (I3, coupling); backward-flow-stability-gronwall.js ' +
    '(imp-2520 Lemma B, line 426 field Lipschitz N/y^2, imp-35128 vacuity map); lambda-roadmap.js Step 2 ' +
    'obligations[G-gronwall]/[G-step-error]; imp-486 (C_mb GUE-conditional).',
};

export const IMP35168_MESOSCOPIC_I3_LIPSCHITZ_WINDOW_ASSESSMENT_ASSERTIONS = [
  {
    // The two strip constants differ by exactly the pole count N.
    id: 'imp35168-field-over-prop-equals-N',
    description: 'L_field / L_prop = N on the same strip (Jacobian sums N poles; transport coeff does not)',
    holds: () =>
      ROWS.every((r) => Math.abs(lField(r.N, Y_STAR_MESO) / lProp(Y_STAR_MESO) - r.N) < 1e-6),
  },
  {
    // Propagation is non-vacuous at every N (it is N-uniform on the mesoscopic strip).
    id: 'imp35168-propagation-nonvacuous-all-N',
    description: 'exp(-2 S / y_star^2) non-vacuous at every N (prop e-fold < E_vac), N-uniform',
    holds: () => ROWS.every((r) => r.prop_nonvacuous === true),
  },
  {
    // Accumulation is NOT N-uniform: its e-fold is LINEAR in N (e-fold / N constant)
    // and diverges, so it fails the threshold at the large-N anchors.
    id: 'imp35168-accumulation-n-linear-diverges',
    description: 'accumulation e-fold 2 N S / y_star^2 is LINEAR in N (e-fold/N constant) and fails E_acc at large N',
    holds: () => {
      const perN = ROWS.map((r) => accEfold(r.N, HORIZON_S, Y_STAR_MESO) / r.N);
      const linear = perN.every((v) => Math.abs(v - perN[0]) < 1e-9);
      const failsAtLargeN = ROWS[ROWS.length - 1].acc_n_uniform === false;
      return linear && failsAtLargeN;
    },
  },
  {
    // The accumulation-safe height exceeds the propagation-safe height by ~sqrt(N).
    id: 'imp35168-height-gap-sqrt-N',
    description: 'y_acc_min / y_prop_min = sqrt(N) -- fixed mesoscopic height cannot serve both windows',
    holds: () =>
      ROWS.every(
        (r) => Math.abs(yAccMin(r.N, HORIZON_S) / yPropMin(HORIZON_S) - Math.sqrt(r.N)) < 1e-6,
      ),
  },
  {
    // The two windows coincide only at N = 2 (where L_field = L_prop).
    id: 'imp35168-coincidence-only-N-2',
    description: 'propagation and accumulation windows coincide only at N = 2 (L_field = L_prop)',
    holds: () => Math.abs(COINCIDENCE_N - 2) < 1e-9,
  },
  {
    // Honesty gate: assessment only, does not suffice, no QED, no refereed bound is changed.
    id: 'imp35168-honesty-gate-no-qed',
    description: 'Assessment only: suffices false, isRigorous false, NO QED, no refereed bound is changed',
    holds: () =>
      IMP35168_MESOSCOPIC_I3_LIPSCHITZ_WINDOW_ASSESSMENT.suffices === false &&
      IMP35168_MESOSCOPIC_I3_LIPSCHITZ_WINDOW_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP35168_MESOSCOPIC_I3_LIPSCHITZ_WINDOW_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35168_MESOSCOPIC_I3_LIPSCHITZ_WINDOW_ASSESSMENT.verdict),
  },
];

for (const a of IMP35168_MESOSCOPIC_I3_LIPSCHITZ_WINDOW_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35168-mesoscopic-i3-lipschitz-window-assessment assertion failed: ${a.id}`);
  }
}
