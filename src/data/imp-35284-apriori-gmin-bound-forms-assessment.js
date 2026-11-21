/**
 * @module imp-35284-apriori-gmin-bound-forms-assessment
 *
 * imp-35284 (proof, ASSESSMENT ONLY): imp-35214 Q3 named the ONE OPEN piece of the min-gap
 * field-Lipschitz surrogate -- an a-priori g_min(t) > 0 lower bound along the WHOLE backward-Dyson
 * trajectory to the collision front -- and identified it as EXACTLY the imp-35167 M2/M5 separation
 * certificate. The imp-35239-confirmed sub-linear min-gap surrogate still lacks precisely this bound.
 * THIS module ENUMERATES the concrete candidate FORMS such an a-priori bound could take (the constant-
 * beta Gronwall lower branch, the self-referential beta ~ 1/g_min front-coupling, a re-seeded bridge
 * chain, the SG1 monotonicity handle) and assesses, for each, whether it CLOSES ON ITSELF into a
 * strictly-positive floor or merely RELOCATES the imp-35167 M5 horizon obstruction. Assessment only;
 * discharges nothing; I3/M5 stay OPEN; NO QED.
 *
 * THE OBLIGATION (from imp-35214 Q3 / imp-35167 M2-M5)
 * ---------------------------------------------------
 * Adjacent pair a = x_lo < b = x_hi, gap r = b - a, squared gap u = r^2, background field
 * B_p(s) = sum_{j != lo,hi} 1 / ((b - x_j)(a - x_j)). The exact linearised gap ODE (imp-2563) is
 *
 *     du/ds = -8 + 4 B_p(s) u.                                                            (U)
 *
 * A whole-trajectory a-priori bound must produce g_min(s) = sqrt(u(s)) >= floor > 0 for all s in
 * [0, t_c), N-uniformly. Q3 is OPEN because B_p is self-referential with the very g_min it feeds:
 * imp-35215 DERIVED the near-front identity beta * g_min -> 1 exactly (unit ambient spacing), i.e.
 * beta = sup |B_p| ~ 1 / g_min diverges as the front approaches.
 *
 * THE CANDIDATE BOUND FORMS (C1..C4), with closes-on-itself verdicts
 * -----------------------------------------------------------------
 *   C1  CONSTANT-beta GRONWALL LOWER BRANCH (imp-2563 M1 as-is).
 *          g_min(s) >= sqrt(m(s)),  m(s) = (g0^2 + 2/beta) e^{-4 beta s} - 2/beta,
 *       valid on s < T_-(g0, beta) = (1/(4 beta)) log(1 + beta g0^2 / 2).
 *       CLOSES? NO. It needs a CONSTANT N-uniform beta over the whole [0, t_c); but beta ~ 1/g_min
 *       (imp-35215) so no finite beta exists to the front, and forcing the honest self-referential
 *       value beta = 1/g0 shrinks the window to T_-(g0, 1/g0) ~ g0^2/8 ~ O(1/N^2) -- below the O(1)
 *       front. This IS the imp-35167 M2 -> M5 relocation; it does not close.
 *   C2  SELF-REFERENTIAL AUTONOMOUS COUPLING beta = 1/g_min (the ticket-named candidate).
 *       Substitute the imp-35215 near-front identity beta = 1/g = 1/sqrt(u) into (U):
 *          du/ds = -8 + 4 (1/sqrt(u)) u = -8 + 4 sqrt(u).                                 (SR)
 *       This DOES close on itself -- an AUTONOMOUS ODE with NO external beta input. But its dynamics
 *       REPRODUCE the collision: unstable fixed point at u* = 4 (g = 2; RHS'(u) = 2/sqrt(u) > 0), and
 *       for any front gap u0 < 4 the collapse term -8 dominates while the feedback 4 sqrt(u) -> 0, so
 *       u(s) reaches 0 in FINITE time
 *          T_SR(u0) = log( 2 / (2 - sqrt(u0)) ) - sqrt(u0) / 2,
 *       which -> u0 / 8 as u0 -> 0 -- EXACTLY the imp-2563 horizon g^2/8. So the self-referential form
 *       is self-CONSISTENT but yields g_min(s) -> 0 at the front (it REPRODUCES the collision), NOT a
 *       floor bounded away from 0. Closing on itself lands on the front, not on a separation bound.
 *   C3  RE-SEEDED / BRIDGED COMPARISON CHAIN (the imp-35167 M5 bridge form).
 *       Restart the Gronwall comparison from a certified interior gap at 0 = s0 < s1 < ... -> t_c,
 *       chaining sub-horizon windows. CLOSES? NO -- each re-seed needs a certified interior lower gap
 *       g(s_i) > 0, which is the very a-priori g_min it aims to produce (circular) unless supplied by
 *       an independent bound (absent). It directly RESTATES M5.
 *   C4  SG1 LOCAL-VIRIAL MONOTONICITY HANDLE (imp-2520 Lemma B, sup-independent, imp-35167 M4).
 *       A monotone gap functional from |dz^2 M| <= (2/y^2) Im M. CLOSES? NO -- Gronwall-VACUOUS at the
 *       microscopic front strip y_N ~ sqrt(2 pi / N); it does not reach the front.
 *
 * THE VERDICT (relocation, not removal -- sharpened at candidate-form resolution)
 * ------------------------------------------------------------------------------
 * NO candidate form closes on itself into an a-priori g_min(t) > 0 floor. C1 fails because the constant
 * beta it needs does not exist (beta ~ 1/g_min, imp-35215). C2 -- the self-referential beta ~ 1/g_min
 * front-coupling the ticket names -- DOES close into an autonomous ODE, but the closed ODE reproduces
 * the finite-time collision (collapse time T_SR(u0) -> g0^2/8, the imp-2563 horizon), so self-
 * consistency yields the FRONT itself, not a floor. C3 is circular (restates M5). C4 is vacuous at the
 * front. So the min-gap route RELOCATES the imp-35167 M5 horizon obstruction rather than removing it,
 * confirming the imp-35214 Q3 verdict at the finer resolution of candidate-form enumeration and
 * SHARPENING why: the one form that genuinely closes (C2) closes onto the collision, not onto a
 * separation certificate. Assessment only; discharges nothing; establishes no operator positivity;
 * changes no bound; the imp-2563 sandwich stays a valid CONDITIONAL bracket; C_mb GUE-conditional per
 * imp-486 UNTOUCHED; I3/M5 stay OPEN; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35214-min-gap-field-lipschitz-surrogate-assessment (Q3 named this OPEN piece; parent)
 * @see imp-35167-g-min-non-collision-certificate-scope (M1..M5 machinery; M2/M5 the OPEN pieces)
 * @see imp-35215-beta-gmin-near-front-limit (beta * g_min -> 1 exactly; beta ~ 1/g_min diverges)
 * @see imp-35239-min-gap-prefactor-real-spacing-reassessment (sub-linear surrogate still lacking Q3)
 * @see imp-2563-min-gap-sandwich-theorem (gap ODE du/ds = -8 + 4 B(s) u; Gronwall lower branch)
 */

// ---------------------------------------------------------------------------
// C1: imp-2563 constant-beta Gronwall lower branch (used AS-IS; derives nothing new).
//   m(s) = (g0^2 + 2/beta) e^{-4 beta s} - 2/beta ;  T_- = (1/(4 beta)) log(1 + beta g0^2 / 2)
// ---------------------------------------------------------------------------
function horizonTminus(g0, beta) {
  return (1 / (4 * beta)) * Math.log(1 + (beta * g0 * g0) / 2);
}

// ---------------------------------------------------------------------------
// C2: self-referential autonomous ODE du/ds = -8 + 4 sqrt(u) (beta = 1/g = 1/sqrt(u), imp-35215).
//   RHS, its derivative (stability), and the closed-form collapse time to u = 0 from u0 < 4.
// ---------------------------------------------------------------------------
function srRhs(u) {
  return -8 + 4 * Math.sqrt(u);
}
function srRhsPrime(u) {
  return 2 / Math.sqrt(u); // > 0 for u > 0: the fixed point u* = 4 is UNSTABLE (repelling)
}
// T_SR(u0) = integral_0^{u0} du / (8 - 4 sqrt(u)) = log(2 / (2 - sqrt(u0))) - sqrt(u0) / 2.
function srCollapseTime(u0) {
  const a = Math.sqrt(u0);
  return Math.log(2 / (2 - a)) - a / 2;
}
// Independent numeric cross-check of the collapse time by composite-Simpson quadrature.
function srCollapseTimeQuad(u0, panels) {
  const n = panels % 2 === 0 ? panels : panels + 1;
  const h = u0 / n;
  let acc = 0;
  for (let i = 0; i <= n; i += 1) {
    const u = i * h;
    const f = 1 / (8 - 4 * Math.sqrt(u));
    const w = i === 0 || i === n ? 1 : i % 2 === 1 ? 4 : 2;
    acc += w * f;
  }
  return (acc * h) / 3;
}

const SR_FIXED_POINT_U = 4; // u* where -8 + 4 sqrt(u) = 0 (g = 2)

// (D1) The self-referential collapse time reproduces the imp-2563 horizon g^2/8 as u0 -> 0.
const D1_U0_SWEEP = [1, 0.25, 1e-2, 1e-4, 1e-6];
const D1_ROWS = D1_U0_SWEEP.map((u0) => {
  const tSR = srCollapseTime(u0);
  return {
    u0,
    g0: +Math.sqrt(u0).toExponential(3),
    tSR: +tSR.toExponential(6),
    horizonGapEighth: +(u0 / 8).toExponential(6), // the imp-2563 small-g horizon g0^2/8
    ratioToHorizon: +(tSR / (u0 / 8)).toFixed(6), // -> 1 from above as u0 -> 0
    quadCheck: +srCollapseTimeQuad(u0, 20000).toExponential(6),
  };
});

// (D2) C1 with the honest self-referential beta = 1/g0: the certified window collapses O(1/N^2).
const D2_N_SWEEP = [10, 100, 1e3, 1e4, 1e5];
const D2_FRONT = 1; // O(1) collision-front proxy (NOT the physical t_c(N))
const D2_ROWS = D2_N_SWEEP.map((N) => {
  const g0 = 1 / N; // empirical initial gap scaling ~O(1/N)
  const beta = 1 / g0; // the imp-35215 self-referential value beta ~ 1/g_min
  const T = horizonTminus(g0, beta);
  return {
    N,
    g0: +g0.toExponential(3),
    beta: +beta.toExponential(3),
    Tminus: +T.toExponential(4),
    ratioToGapEighth: +(T / ((g0 * g0) / 8)).toFixed(6), // -> 1 as g0 -> 0
    horizonOverFront: +(T / D2_FRONT).toExponential(4), // -> 0 like 1/(8 N^2)
  };
});
const D2_perDecadeShrink =
  D2_ROWS[D2_ROWS.length - 2].horizonOverFront / D2_ROWS[D2_ROWS.length - 1].horizonOverFront;

const CANDIDATE_FORMS = [
  {
    id: 'C1',
    name: 'constant-beta-gronwall-lower-branch',
    form: 'g_min(s) >= sqrt((g0^2 + 2/beta) e^{-4 beta s} - 2/beta), valid on s < T_-(g0, beta)',
    closesOnItself: false,
    whyNot:
      'Needs a CONSTANT N-uniform beta over [0, t_c); but beta ~ 1/g_min (imp-35215) so none exists to ' +
      'the front. Forcing the honest beta = 1/g0 shrinks T_- ~ g0^2/8 ~ O(1/N^2) below the O(1) front ' +
      '-- the imp-35167 M2 -> M5 relocation.',
  },
  {
    id: 'C2',
    name: 'self-referential-autonomous-coupling',
    form: 'du/ds = -8 + 4 sqrt(u) (beta = 1/g = 1/sqrt(u), imp-35215 near-front identity)',
    closesOnItself: true, // autonomous, no external beta input
    yieldsPositiveFloor: false,
    whyNot:
      'The autonomous ODE closes but REPRODUCES the collision: unstable fixed point u* = 4, and for any ' +
      'front gap u0 < 4 the collapse term -8 drives u to 0 in finite time T_SR(u0) = log(2/(2-sqrt(u0))) ' +
      '- sqrt(u0)/2 -> u0/8, EXACTLY the imp-2563 horizon g^2/8. Self-consistent, but g_min -> 0: it ' +
      'lands on the front, not on a floor bounded away from 0.',
  },
  {
    id: 'C3',
    name: 're-seeded-bridged-comparison-chain',
    form: 'piecewise Gronwall restart from a certified interior gap at 0 = s0 < s1 < ... -> t_c',
    closesOnItself: false,
    whyNot:
      'Each re-seed needs a certified interior lower gap g(s_i) > 0 -- the very a-priori g_min it aims ' +
      'to produce (circular) unless supplied by an independent bound (absent). Directly RESTATES the ' +
      'imp-35167 M5 bridge.',
  },
  {
    id: 'C4',
    name: 'sg1-local-virial-monotonicity-handle',
    form: 'monotone gap functional from the imp-2520 |dz^2 M| <= (2/y^2) Im M local virial',
    closesOnItself: false,
    whyNot:
      'Gronwall-VACUOUS at the microscopic front strip y_N ~ sqrt(2 pi / N) (imp-35167 M4); it does not ' +
      'reach the front.',
  },
];

export const IMP35284_APRIORI_GMIN_BOUND_FORMS_ASSESSMENT = {
  id: 'imp-35284',
  proofSection: 'S-frontier',
  question:
    'Enumerate the candidate FORMS an a-priori g_min(t) > 0 lower bound along the whole backward-Dyson ' +
    'trajectory to the front (imp-35214 Q3 / imp-35167 M2-M5) could take -- the OPEN requirement the ' +
    'imp-35239-confirmed sub-linear min-gap surrogate still needs -- and assess, for each, whether it ' +
    'CLOSES ON ITSELF into a strictly-positive floor or merely RELOCATES the imp-35167 M5 horizon ' +
    'obstruction. Assessment only; discharges nothing; I3/M5 stay OPEN; NO QED.',
  candidateForms: CANDIDATE_FORMS,
  selfReferentialCoupling: {
    identity: 'imp-35215: beta * g_min -> 1 exactly (unit ambient spacing), so beta = 1/g = 1/sqrt(u)',
    autonomousOde: 'du/ds = -8 + 4 sqrt(u)',
    fixedPointU: SR_FIXED_POINT_U, // g = 2; unstable (RHS'(u) = 2/sqrt(u) > 0)
    reproducesHorizon: 'T_SR(u0) -> u0/8 as u0 -> 0 -- EXACTLY the imp-2563 horizon g^2/8',
  },
  d1_srCollapseReproducesHorizon: D1_ROWS,
  d2_constantBetaWindowCollapses: {
    frontProxy: D2_FRONT, // O(1) proxy, NOT the physical t_c(N)
    rows: D2_ROWS, // horizonOverFront -> 0 like 1/(8 N^2) under beta = 1/g0
    perDecadeHorizonShrink: +D2_perDecadeShrink.toFixed(4), // ~100 (O(1/N^2))
  },
  // The one form that genuinely closes (C2) closes onto the COLLISION, not a floor ...
  anyFormClosesToPositiveFloor: false,
  selfReferentialFormReproducesFront: true,
  // ... so the min-gap route RELOCATES M5 rather than removing it.
  relocatesM5Obstruction: true,
  suppliesAprioriGminBound: false,
  isRigorous: false,
  verdict:
    'ASSESSMENT (frontier-direction, NOT rigorous). NO candidate FORM of an a-priori g_min(t) > 0 bound ' +
    'closes on itself into a strictly-positive floor. (C1) The imp-2563 constant-beta Gronwall lower ' +
    'branch needs a CONSTANT N-uniform beta over [0, t_c), but beta ~ 1/g_min (imp-35215 derived ' +
    'beta * g_min -> 1 exactly) so none exists to the front; forcing the honest beta = 1/g0 shrinks its ' +
    'window T_-(g0, 1/g0) ~ g0^2/8 ~ O(1/N^2) below the O(1) front -- the imp-35167 M2 -> M5 relocation. ' +
    '(C2) The self-referential beta ~ 1/g_min front-coupling the ticket names DOES close: substituting ' +
    'beta = 1/sqrt(u) into du/ds = -8 + 4 B_p u gives the AUTONOMOUS ODE du/ds = -8 + 4 sqrt(u) with NO ' +
    'external input. But its dynamics reproduce the collision -- unstable fixed point u* = 4, and for ' +
    'any front gap u0 < 4 the collapse term -8 drives u to 0 in finite time T_SR(u0) = ' +
    'log(2/(2-sqrt(u0))) - sqrt(u0)/2, which -> u0/8 as u0 -> 0, EXACTLY the imp-2563 horizon g^2/8. So ' +
    'the self-referential form is self-CONSISTENT but yields g_min(s) -> 0 at the front: closing on ' +
    'itself lands on the FRONT, not on a separation floor. (C3) A re-seeded bridge chain is circular -- ' +
    'each restart needs a certified interior gap, the very bound sought; it restates M5. (C4) The SG1 ' +
    'local-virial monotonicity handle is Gronwall-vacuous at the front strip y_N ~ sqrt(2 pi / N). ' +
    'CONSEQUENCE: the min-gap route RELOCATES the imp-35167 M5 horizon obstruction rather than removing ' +
    'it, confirming the imp-35214 Q3 verdict at the finer resolution of candidate-form enumeration and ' +
    'SHARPENING why -- the one form that genuinely closes (C2) closes onto the collision, not onto a ' +
    'separation certificate. Assessment only; discharges nothing; establishes no operator positivity; ' +
    'changes no bound; the imp-2563 sandwich stays a valid CONDITIONAL bracket; C_mb GUE-conditional ' +
    'per imp-486 UNTOUCHED; I3/M5 stay OPEN; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35214-min-gap-field-lipschitz-surrogate-assessment (Q3 named this OPEN piece; parent); ' +
    'imp-35167-g-min-non-collision-certificate-scope (M1..M5; M2/M5 OPEN); ' +
    'imp-35215-beta-gmin-near-front-limit (beta * g_min -> 1; beta ~ 1/g_min); ' +
    'imp-35239-min-gap-prefactor-real-spacing-reassessment (sub-linear surrogate still lacking Q3); ' +
    'imp-2563-min-gap-sandwich-theorem (gap ODE + Gronwall lower branch); imp-486 (C_mb GUE-conditional).',
};

export const IMP35284_APRIORI_GMIN_BOUND_FORMS_ASSESSMENT_ASSERTIONS = [
  {
    // C2 fixed point: RHS(4) = 0, RHS(u) < 0 for a front gap u < 4 (u collapses), RHS' > 0 (unstable).
    id: 'imp35284-sr-fixed-point-unstable',
    description: 'du/ds = -8 + 4 sqrt(u) has RHS(4) = 0, RHS(u<4) < 0 (front gaps collapse), RHS-prime = 2/sqrt(u) > 0 (unstable)',
    holds: () =>
      Math.abs(srRhs(SR_FIXED_POINT_U)) < 1e-12 &&
      srRhs(1) < 0 &&
      srRhs(0.01) < 0 &&
      srRhsPrime(1) > 0 &&
      srRhsPrime(0.01) > 0,
  },
  {
    // The self-referential closed-form collapse time matches an independent Simpson quadrature.
    id: 'imp35284-sr-collapse-time-closed-form-matches-quadrature',
    description: 'T_SR(u0) = log(2/(2-sqrt(u0))) - sqrt(u0)/2 agrees with composite-Simpson quadrature of int du/(8-4 sqrt u)',
    holds: () =>
      D1_U0_SWEEP.every((u0) => {
        const closed = srCollapseTime(u0);
        const quad = srCollapseTimeQuad(u0, 20000);
        return Math.abs(closed - quad) < 1e-7 * Math.max(closed, 1e-9);
      }),
  },
  {
    // The self-referential form REPRODUCES the imp-2563 horizon g^2/8 (ratio -> 1 from above as u0 -> 0).
    id: 'imp35284-sr-collapse-reproduces-imp2563-horizon',
    description: 'T_SR(u0)/(u0/8) -> 1 monotonically from above as u0 -> 0: the self-referential form closes onto the imp-2563 collision horizon, not a floor',
    holds: () => {
      // Ratio strictly above 1 (approaches from above) and monotonically decreasing toward 1.
      for (const r of D1_ROWS) if (!(r.ratioToHorizon > 1)) return false;
      for (let i = 1; i < D1_ROWS.length; i += 1) {
        if (!(D1_ROWS[i].ratioToHorizon < D1_ROWS[i - 1].ratioToHorizon)) return false;
      }
      // The finest rung is within 1% of the g^2/8 horizon.
      return D1_ROWS[D1_ROWS.length - 1].ratioToHorizon < 1.01;
    },
  },
  {
    // C1 under the honest self-referential beta = 1/g0: the certified window collapses ~O(1/N^2).
    id: 'imp35284-constant-beta-window-collapses-order-n-squared',
    description: 'C1 with beta = 1/g0 gives T_-(g0, 1/g0) ~ g0^2/8, horizon/front ratio shrinking ~100x per decade of N (below the O(1) front)',
    holds: () =>
      Math.abs(D2_ROWS[D2_ROWS.length - 1].ratioToGapEighth - 1) < 1e-3 &&
      D2_perDecadeShrink > 90 &&
      D2_perDecadeShrink < 110,
  },
  {
    // Candidate-form mapping: C2 closes but yields NO floor; C1/C3/C4 do not close at all.
    id: 'imp35284-candidate-form-mapping',
    description: 'Only C2 closesOnItself, and its yieldsPositiveFloor is FALSE; C1/C3/C4 closesOnItself FALSE; no form supplies an a-priori g_min floor',
    holds: () => {
      const c1 = CANDIDATE_FORMS.find((c) => c.id === 'C1');
      const c2 = CANDIDATE_FORMS.find((c) => c.id === 'C2');
      const c3 = CANDIDATE_FORMS.find((c) => c.id === 'C3');
      const c4 = CANDIDATE_FORMS.find((c) => c.id === 'C4');
      return (
        c1.closesOnItself === false &&
        c2.closesOnItself === true &&
        c2.yieldsPositiveFloor === false &&
        c3.closesOnItself === false &&
        c4.closesOnItself === false &&
        IMP35284_APRIORI_GMIN_BOUND_FORMS_ASSESSMENT.anyFormClosesToPositiveFloor === false
      );
    },
  },
  {
    // Honesty gate: relocates M5, supplies no a-priori bound, assessment only, NO QED, no refereed bound is changed.
    id: 'imp35284-honesty-gate-no-qed',
    description: 'Assessment only: relocatesM5 true, self-referential form reproduces front true, supplies a-priori g_min bound FALSE, isRigorous false, NO QED, no refereed bound is changed',
    holds: () =>
      IMP35284_APRIORI_GMIN_BOUND_FORMS_ASSESSMENT.relocatesM5Obstruction === true &&
      IMP35284_APRIORI_GMIN_BOUND_FORMS_ASSESSMENT.selfReferentialFormReproducesFront === true &&
      IMP35284_APRIORI_GMIN_BOUND_FORMS_ASSESSMENT.suppliesAprioriGminBound === false &&
      IMP35284_APRIORI_GMIN_BOUND_FORMS_ASSESSMENT.isRigorous === false &&
      /NO QED/.test(IMP35284_APRIORI_GMIN_BOUND_FORMS_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP35284_APRIORI_GMIN_BOUND_FORMS_ASSESSMENT.verdict),
  },
];

for (const a of IMP35284_APRIORI_GMIN_BOUND_FORMS_ASSESSMENT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35284-apriori-gmin-bound-forms-assessment assertion failed: ${a.id}`);
  }
}
