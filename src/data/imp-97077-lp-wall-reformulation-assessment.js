/**
 * @fileoverview imp-97077 -- ASSESSMENT (numerical): can a REFORMULATION that decouples the interval
 * certificate from the eps <= lambda_min HiGHS status-4 conditioning cliff extend the interval-rigorous
 * reach of the pole-free Toeplitz certificate T_a[sigma_2] >= 0 past 2a = 0.96 (Axis I of imp-97049)?
 *
 * CONTEXT -- imp-97049 Axis I (I-a), SUB-GAP IMP97049_AXIS_LEVEL_ONLY. imp-97049 sorted the gap
 * between the certified object and full Weil positivity into three orthogonal axes; Axis I (REACH) holds
 * the 0.96-1.00 LP double-precision conditioning wall (HiGHS status 4 / infeasible once eps <=
 * lambda_min) and the Rayleigh/Courant-Fischer direction problem (I-b), and named them two FACES of one
 * obstruction. It left open, WITHIN Axis I, whether a "survives-past-the-LP-wall interval certificate"
 * exists via a reformulation. This leaf resolves that open instance at the CLASS level: it takes the
 * three reformulations named in the ticket (scaled/preconditioned Toeplitz form; dual feasibility
 * certificate; extended-precision interval LP), locates the precise sub-mechanism each attacks, and
 * shows -- against the MEASURED imp-97055 binding-floor decomposition at 2a = 1.00 -- that none has been
 * shown to extend the interval-rigorous reach past 2a = 0.96.
 *
 * ALL VALUES ARE CITATIONAL LITERALS drawn from committed sibling modules (no new computation):
 *   @see imp-97049-polefree-to-weil-obstruction-enumeration.js  (Axis I; I-a LP wall / I-b direction;
 *        SUB-GAP AXIS_LEVEL_ONLY: a survives-past-the-LP-wall interval certificate stays open within Axis I)
 *   @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js  (sigma_2 = (t^2+1/4)^2 w_1; pole-free Weil
 *        positivity == T_a[sigma_2] >= 0 on {hhat(+-i/2) = 0}; interval-verified reach 2a <= X0 = 0.96)
 *   @see imp-97055-krein-windowed-design-lever.js  (MEASURED binding floor at 2a = 1.00, kmax=5, X=8,
 *        dx=0.02, T=40, eps=1.0, 40 rounds: BASE worst guarded residual -0.007665 at t=37.809; EDGEW
 *        -0.008533 at t=34.826; TAPER -0.003383 at t=30.754; FINDING 3 -- the no-guard design F reaches
 *        eps EVERYWHERE (BASE/TAPER 1.00000, EDGEW 1.00000005; tail-band min F >= 1.075) so the binding
 *        deficit is the between-grid second-order GUARD, not the design F; finer FINEH=3e-5 introduces
 *        cutting-plane NON-MONOTONICITY, worst residual cycling -0.004 to -0.052 over rounds, full-stall
 *        untested)
 *   @see imp-96169-route-i-rayleigh-variational-topstate-assessment.js  (I-b direction problem: fractal
 *        Zygmund extremal state, no dyadic-grid convergence rate)
 *
 * ---------------------------------------------------------------------------------------------------
 * WHAT THE STATUS-4 CLIFF ACTUALLY IS. The interval certificate is produced by a cutting-plane LP
 * (tmp/toeplitz-krein-lp13.py): find atom coefficients c so that the DESIGN F(t) = sigma_2(t) + sum_k
 * sum_j c_{k,j} t^k trig_k(x_j t) satisfies the GUARDED pointwise condition F(t) - guard(t) - eps >= 0
 * on a fine grid, where guard(t) is the rigorous second-order between-grid enclosure (proportional to
 * FINEH^2). A converged, guard-clearing certificate is then re-checked by the interval verifier. As
 * 2a -> 1.00 the certifiable margin shrinks; HiGHS returns status 4 (infeasible) once the demanded eps
 * falls at or below the LP optimum eps*. The cliff therefore superposes TWO distinct causes, and any
 * reformulation must be scored on WHICH it attacks:
 *   (a) TRUE MARGIN: eps* = (form margin, i.e. lambda_min of T_a[sigma_2]) MINUS (guard budget). This is
 *       a genuine feasibility boundary, not a floating-point artifact.
 *   (b) NUMERICAL CONDITIONING: fixed double precision plus HiGHS tolerances limit how accurately the
 *       solver can approach eps*.
 * imp-97055 FINDING 3 MEASURED the decomposition at 2a = 1.00: the no-guard design F already reaches eps
 * EVERYWHERE (>= 1.0; tail-band min F >= 1.075), so the binding deficit is the between-grid GUARD term
 * inside (a) -- NOT raw matrix conditioning (b) and NOT the design F falling below eps. The cliff at the
 * frontier is dominated by the guard budget, so a reformulation that only sharpens (b) cannot cross it.
 *
 * ENUMERATION OF THE THREE NAMED REFORMULATIONS (each decoupled from a different part of the cliff):
 *
 *   (R1) SCALED / PRECONDITIONED TOEPLITZ FORM. Rescale coordinates / row-normalise the constraint
 *        matrix to improve conditioning. PRECISE OBSTRUCTION: lp13 ALREADY row-scales (rs = 1/max(1,|S|)
 *        applied to every constraint row). Preconditioning changes only cause (b): it lets HiGHS approach
 *        the feasibility boundary more accurately in fixed precision, but a certificate must satisfy the
 *        SAME guarded condition F - guard - eps >= 0 in every coordinate frame, so scaling cannot certify
 *        an eps that a well-conditioned exact solve rejects. It does not touch the guard-dominated binding
 *        floor. No reach extension; the status-4 cliff is NOT mainly a raw matrix-conditioning artifact.
 *
 *   (R2) DUAL FEASIBILITY CERTIFICATE. Instead of a high-precision primal solve, exhibit a dual-feasible
 *        point that rigorously LOWER-bounds the LP optimum eps*. This IS rigor-preserving and legitimate.
 *        PRECISE OBSTRUCTION: it certifies a bound on the SAME optimisation whose optimum is eps* =
 *        (form margin) - (guard). Since imp-97055 measured the binding deficit at 2a = 1.00 to be the
 *        guard (eps* < 0 there), a dual certificate rigorously confirms that eps* is negative -- it
 *        certifies INFEASIBILITY at positive eps, it does not create feasibility. A dual certificate is a
 *        rigor tool for a FIXED formulation, not a route past the wall. No reach extension.
 *
 *   (R3) EXTENDED-PRECISION INTERVAL LP. Solve (and verify) at higher than double precision, which also
 *        permits a finer FINEH and hence a SMALLER between-grid guard (proportional to FINEH^2). This is
 *        the ONLY one of the three that touches the actual binding floor (the guard inside cause (a)).
 *        PRECISE OBSTRUCTION: extended precision lowers the guard MAGNITUDE but does not remove the
 *        cutting-plane NON-MONOTONICITY that imp-97055 already measured at FINEH = 3e-5 (worst residual
 *        cycling -0.004 to -0.052 over rounds; full-stall confirmation untested). The non-monotonicity is
 *        a property of the cutting-plane cover iteration (point-selection vs between-grid guard), not of
 *        arithmetic precision, so extra digits alone do not deliver a converged iterate. R3 is the most
 *        promising lever but has NOT been shown to extend the reach, and its success is CONTINGENT on the
 *        true form margin lambda_min(T_a[sigma_2]) staying positive on (0.96, 1.00] -- which is exactly
 *        the Axis I-b variational-direction question (fractal Zygmund extremal state, no dyadic-grid
 *        rate). This ties the two faces of Axis I together precisely as imp-97049 asserted.
 *
 * COMMON MECHANISM. The binding floor at the 2a = 1.00 frontier is the between-grid GUARD inside the true
 * margin (cause (a)), not the raw LP matrix conditioning (cause (b)). R1 and R2 attack only (b) or the
 * rigor of the fixed formulation; neither touches the guard. R3 attacks the guard but inherits a
 * cutting-plane stability problem that precision does not fix and is contingent on the I-b direction. So
 * "decouple the certificate from the eps <= lambda_min cliff" does not, for any of the three named
 * reformulations, translate into a demonstrated reach past 2a = 0.96. This UPGRADES imp-97049 Axis I (I-a)
 * from "the LP halts at status 4 past 0.96" to "the frontier binding floor is the guard budget, and none
 * of the three named reformulations has been shown to clear it -- R1/R2 attack the wrong cause, R3 faces
 * a distinct cutting-plane obstruction contingent on the I-b direction."
 *
 * VERDICT. No named reformulation has been shown to extend the interval-rigorous reach past 2a = 0.96:
 * R1 (preconditioning) attacks matrix conditioning, which lp13 already applies and which is not the
 * binding floor; R2 (dual certificate) rigorously certifies the SAME optimum -- confirming infeasibility,
 * not creating feasibility; R3 (extended precision) shrinks the guard but inherits a cutting-plane
 * non-monotonicity precision does not fix and is contingent on the open I-b direction. The status-4 cliff
 * is NOT a pure double-precision-conditioning artifact removable by scaling; at the frontier the binding
 * floor is the between-grid guard. The assessment establishes NO positivity theorem and moves NO bound;
 * certified reach stays 2a <= 0.96; no refereed bound is changed; RH open; NO QED.
 *
 * HONEST RESIDUAL -- SUB-GAP IMP97077_EXTENDED_PRECISION_GUARD_STABLE_CUTTING_PLANE_UNTESTED. The
 * refutation covers the three named reformulations as attempted. The single untried-to-completion
 * instance is R3 done RIGHT: an extended-precision interval LP combined with a MONOTONE (guard-stable)
 * cutting-plane cover at fine FINEH (e.g. 3e-5 to full stall). Whether that certifies a positive eps on
 * (0.96, 1.00] is the open measurement, and it presupposes lambda_min(T_a[sigma_2]) stays positive there
 * -- itself the Axis I-b direction problem. So R3-done-right stays open and, absent a rigorous positive
 * lower bound on the form margin (the I-b Zygmund obstruction), cannot be promoted to a certificate.
 * Assessment only; no bound moves.
 */

const CERTIFIED_REACH_2A = 0.96;

// The status-4 cliff decomposed into its two superposed causes, with the MEASURED (imp-97055) binder.
export const IMP97077_CLIFF_DECOMPOSITION = Object.freeze({
  certifiedObject: 'interval-verified pole-free positivity T_a[sigma_2] >= 0, sigma_2 = (t^2+1/4)^2 w_1',
  certifiedReach2a: CERTIFIED_REACH_2A,
  causeA_trueMargin: 'eps* = lambda_min(T_a[sigma_2]) (form margin) MINUS the between-grid guard budget; a genuine feasibility boundary',
  causeB_conditioning: 'fixed double precision + HiGHS tolerances limit how accurately the solver approaches eps*',
  measuredBinderAt2a1: 'between-grid second-order GUARD inside cause (a) -- the no-guard design F already reaches eps everywhere (imp-97055 FINDING 3)',
  cliffIsPureConditioningArtifact: false, // it is guard-dominated at the frontier, not raw matrix conditioning
  source: 'imp-97049 Axis I; imp-97055 FINDING 3; rh-route-i-toeplitz-krein-certificate-2026-09-24.js',
});

// MEASURED imp-97055 literals at the 2a = 1.00 frontier (kmax=5, X=8, dx=0.02, T=40, eps=1.0, 40 rounds).
export const IMP97077_MEASURED_FRONTIER = Object.freeze({
  twoA: 1.0,
  baseWorstGuardedResidual: -0.007665, // at t = 37.809
  edgeWeightedWorstGuardedResidual: -0.008533, // at t = 34.826 (inert: objective reweighting cannot change feasibility)
  taperWorstGuardedResidual: -0.003383, // at t = 30.754 (dip suppressed ~2.3x and moved off the cutoff; but inadmissible)
  noGuardDesignFReachesEps: true, // BASE/TAPER 1.00000, EDGEW 1.00000005; tail-band min F >= 1.075
  bindingDeficitIsGuardNotDesignF: true, // FINDING 3
  fineFINEHnonMonotonicity: Object.freeze([-0.052, -0.004]), // FINEH=3e-5 worst residual cycles over rounds
  fineFINEHfullStallTested: false,
  source: 'imp-97055-krein-windowed-design-lever.js',
});

// The three named reformulations and the precise sub-mechanism each attacks / fails on.
export const IMP97077_REFORMULATIONS = Object.freeze([
  Object.freeze({
    tag: 'R1',
    name: 'SCALED / PRECONDITIONED TOEPLITZ FORM',
    attacksCause: 'b (numerical conditioning)',
    extendsReach: false,
    obstruction: 'lp13 ALREADY row-scales (rs = 1/max(1,|S|)); the guarded feasibility condition is coordinate-frame invariant, so scaling cannot certify an eps a well-conditioned exact solve rejects; it does not touch the guard-dominated binding floor',
  }),
  Object.freeze({
    tag: 'R2',
    name: 'DUAL FEASIBILITY CERTIFICATE',
    attacksCause: 'rigor of the fixed formulation (not the binding floor)',
    extendsReach: false,
    rigorPreserving: true,
    obstruction: 'a dual-feasible point rigorously lower-bounds the SAME optimum eps* = (form margin) - (guard); at 2a=1.00 eps* < 0 (guard-bound, imp-97055 F3), so a dual certificate confirms INFEASIBILITY at positive eps -- it does not create feasibility',
  }),
  Object.freeze({
    tag: 'R3',
    name: 'EXTENDED-PRECISION INTERVAL LP',
    attacksCause: 'a (the between-grid guard, via smaller FINEH)',
    extendsReach: false, // not yet demonstrated
    mostPromising: true,
    obstruction: 'extra precision lowers the guard MAGNITUDE but does not remove the cutting-plane NON-MONOTONICITY measured at FINEH=3e-5 (worst residual cycling -0.052 to -0.004; full-stall untested); success is contingent on lambda_min(T_a[sigma_2]) staying positive on (0.96,1.00] -- the open Axis I-b direction problem',
  }),
]);

// The class-level verdict and honest residual.
export const IMP97077_VERDICT = Object.freeze({
  ticket: 'imp-97077',
  question:
    'can a reformulation that decouples the interval certificate from the eps <= lambda_min HiGHS status-4 cliff (scaled/preconditioned Toeplitz form; dual feasibility certificate; extended-precision interval LP) extend the interval-rigorous reach past 2a = 0.96?',
  reformulationCount: 3,
  anyReformulationExtendsReach: false,
  frontierBindingFloor: 'between-grid second-order guard (cause a), NOT raw matrix conditioning (cause b)',
  cliffIsPureConditioningArtifact: false,
  r1AttacksWrongCause: true, // conditioning, already applied, not the binder
  r2CertifiesSameOptimum: true, // confirms infeasibility, does not create feasibility
  r3ContingentOnAxisIbDirection: true, // needs lambda_min > 0 on (0.96,1.00], the Zygmund direction problem
  upgradesAxisIa:
    'from "the LP halts at status 4 past 0.96" to "the frontier binding floor is the guard budget; R1/R2 attack the wrong cause, R3 faces a distinct cutting-plane obstruction contingent on the I-b direction"',
  certifiedReachUnchanged: CERTIFIED_REACH_2A,
  positivityTheoremEstablished: false,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
  subGap:
    'IMP97077_EXTENDED_PRECISION_GUARD_STABLE_CUTTING_PLANE_UNTESTED -- R3 done right (extended-precision interval LP + a MONOTONE guard-stable cutting-plane cover at fine FINEH to full stall) stays open; it presupposes lambda_min(T_a[sigma_2]) > 0 on (0.96,1.00], itself the Axis I-b Zygmund direction problem, and cannot be promoted to a certificate without a rigorous positive lower bound on the form margin.',
});

// --- self-executing internal-consistency assertions (pure literals; import-light) ---
const IMP97077_ASSERTIONS = [
  {
    id: 'imp97077-cliff-decomposes-into-two-causes-guard-dominated',
    holds: () =>
      IMP97077_CLIFF_DECOMPOSITION.certifiedReach2a === CERTIFIED_REACH_2A &&
      IMP97077_CLIFF_DECOMPOSITION.cliffIsPureConditioningArtifact === false &&
      IMP97077_CLIFF_DECOMPOSITION.measuredBinderAt2a1.includes('GUARD'),
    why: 'the status-4 cliff superposes a true-margin cause (a) and a conditioning cause (b); the measured frontier binder is the between-grid guard inside (a), so it is not a pure conditioning artifact.',
  },
  {
    id: 'imp97077-measured-frontier-guard-not-designF',
    holds: () =>
      IMP97077_MEASURED_FRONTIER.twoA === 1.0 &&
      IMP97077_MEASURED_FRONTIER.noGuardDesignFReachesEps === true &&
      IMP97077_MEASURED_FRONTIER.bindingDeficitIsGuardNotDesignF === true &&
      IMP97077_MEASURED_FRONTIER.baseWorstGuardedResidual < 0 &&
      IMP97077_MEASURED_FRONTIER.fineFINEHfullStallTested === false,
    why: 'imp-97055 measured that at 2a=1.00 the no-guard design F reaches eps everywhere, so the binding deficit is the between-grid guard; the fine-FINEH full-stall run was not completed.',
  },
  {
    id: 'imp97077-three-reformulations-none-extend-reach',
    holds: () =>
      IMP97077_REFORMULATIONS.length === 3 &&
      IMP97077_REFORMULATIONS.every((r) => r.extendsReach === false) &&
      IMP97077_REFORMULATIONS[0].tag === 'R1' &&
      IMP97077_REFORMULATIONS[1].tag === 'R2' &&
      IMP97077_REFORMULATIONS[2].tag === 'R3' &&
      IMP97077_REFORMULATIONS[2].mostPromising === true &&
      IMP97077_VERDICT.reformulationCount === 3 &&
      IMP97077_VERDICT.anyReformulationExtendsReach === false,
    why: 'the three named reformulations (preconditioning; dual certificate; extended precision) have none been shown to extend the interval-rigorous reach past 0.96; R3 is the most promising but untested to completion.',
  },
  {
    id: 'imp97077-r3-contingent-on-axisIb-direction',
    holds: () =>
      IMP97077_VERDICT.r1AttacksWrongCause === true &&
      IMP97077_VERDICT.r2CertifiesSameOptimum === true &&
      IMP97077_VERDICT.r3ContingentOnAxisIbDirection === true &&
      IMP97077_REFORMULATIONS[2].obstruction.includes('Axis I-b'),
    why: 'R1 attacks conditioning (already applied); R2 certifies the same optimum (infeasibility, not feasibility); R3 is contingent on lambda_min > 0 on (0.96,1.00], the Axis I-b direction problem -- tying the two faces of Axis I together.',
  },
  {
    id: 'imp97077-assessment-no-theorem-no-qed-with-subgap',
    holds: () =>
      IMP97077_VERDICT.certifiedReachUnchanged === CERTIFIED_REACH_2A &&
      IMP97077_VERDICT.positivityTheoremEstablished === false &&
      IMP97077_VERDICT.operatorPositivityProved === false &&
      IMP97077_VERDICT.rhResolved === false &&
      IMP97077_VERDICT.qed === false &&
      typeof IMP97077_VERDICT.subGap === 'string' &&
      IMP97077_VERDICT.subGap.includes('IMP97077_EXTENDED_PRECISION_GUARD_STABLE_CUTTING_PLANE_UNTESTED'),
    why: 'this leaf is an assessment; it establishes no positivity theorem, moves no bound, certified reach stays 2a <= 0.96, RH open, NO QED; residual named as a sub-gap.',
  },
];

for (const a of IMP97077_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97077 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
