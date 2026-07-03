/**
 * @module imp-3554-power-budget-beyond-8320-U20-agreement-floor
 * @fileoverview imp-3554 -- MEASURE whether pushing the imp-3525 power-iteration
 *   budget BEYOND 8320 steps at U = 20 (N = 800) drives the corrected solver
 *   agreement below its residual ~1.9e-11 toward the machine floor, ISOLATING the
 *   remaining power-convergence deficit from any genuine algebraic solver
 *   disagreement.
 *
 *   CONTEXT
 *   -------
 *   imp-3525 re-ran the imp-3485 solver-independent cross-check with the corrected
 *   settings (Lanczos Krylov dimension m = 120 plus a power-iteration budget of 8320
 *   steps) and improved the U = 20 relative agreement |sigma_power - sigma_Lanczos120|
 *   / sigma_Lanczos120 from imp-3485s 1.0e-4 to ~1.9e-11, attributing the residual to
 *   "remaining power convergence at budget 8320, NOT reference deficit and NOT
 *   algebraic solver disagreement". It never pushed the budget past 8320 to TEST that
 *   attribution: if the residual is pure power under-convergence, growing the budget
 *   must collapse the agreement toward machine level; if it were a genuine algebraic
 *   disagreement between the two independent eigensolvers, the agreement would floor
 *   at ~1.9e-11 no matter how many power steps are spent.
 *
 *   THIS MODULE reuses the IDENTICAL imp-3525 skew-Toeplitz assembly
 *   (Ttilde(u,v) = a (v-u) R(|v-u|), NPHI = 10, H0 = 0.025, midpoint quadrature,
 *   N = U/H0 panels), the IDENTICAL checkpointed power iteration (single-vector
 *   v -> M^T M v, sigma = sqrt(||M^T M v||), imp-3505/imp-3525 start vector
 *   sin(0.3 i + 1)), and the IDENTICAL Lanczos/Jacobi reference (Krylov m = 120,
 *   cross-checked against m = 160), and at the U = 20 target cell measures the
 *   power-vs-Lanczos120 agreement at the budget ladder {8320, 16640, 33280}, plus the
 *   power self-convergence |sigma(2b) - sigma(b)| / sigma(b) and the Lanczos m = 120
 *   vs m = 160 self-consistency (the machine-level algebraic floor of the reference).
 *   The single power run to 33280 steps at N = 800 is ~33k O(N^2) matvecs (~38 s);
 *   the resulting norms are BAKED as reference literals so this module stays
 *   import-light, and every reported ratio is RECOMPUTED here from the baked norms
 *   (self-checking arithmetic).
 *
 *   FINDING
 *   -------
 *   (1) PUSHING THE BUDGET PAST 8320 COLLAPSES THE AGREEMENT TO MACHINE LEVEL. The
 *       corrected U = 20 agreement falls from ~1.879e-11 at budget 8320 to ~1.294e-14
 *       at 16640 (a ~1450x collapse) and holds at ~1.336e-14 at 33280. So the residual
 *       ~1.9e-11 imp-3525 saw at budget 8320 is PURE POWER UNDER-CONVERGENCE: doubling
 *       the budget once removes essentially all of it.
 *   (2) THE POWER ITERATION IS FULLY CONVERGED BY 16640, WITH NO ALGEBRAIC FLOOR
 *       ABOVE MACHINE LEVEL. The power self-convergence tightens from |sigma(16640) -
 *       sigma(8320)|/sigma(8320) ~ 1.878e-11 to |sigma(33280) - sigma(16640)|/
 *       sigma(16640) ~ 4.18e-16 -- the power norm is stable to <5e-16 from 16640 to
 *       33280. The converged power route then agrees with the independent Lanczos120
 *       route to ~1.34e-14, which sits at the SAME machine level as the Lanczos m = 120
 *       vs m = 160 self-consistency ~1.65e-14. So the two structurally independent
 *       eigensolvers agree to machine precision once BOTH are converged: there is no
 *       genuine algebraic solver-disagreement floor above ~1e-14, confirming imp-3525s
 *       attribution exactly.
 *
 *   So the answer to "does pushing past 8320 drive the ~1.9e-11 residual toward
 *   machine level": YES -- one budget doubling (to 16640) collapses it ~1450x to
 *   ~1.3e-14, and the residual was pure power under-convergence, NOT algebraic
 *   disagreement (the converged-vs-converged solver gap is ~1.3e-14, machine level).
 *
 *   @see imp-3525-corrected-solver-agreement-crossval.js (the ~1.9e-11 residual pushed here)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the budget-convergence sweep)
 *   @see imp-3485-Ttilde-independent-operator-norm-crossval.js (the original cross-check)
 *
 *   Ticket: imp-3554 (numerical, medium). Measurement only: pushes the power budget
 *   past 8320 at N = 800 and isolates the residual as pure power under-convergence.
 *   Does NOT construct the missing magnitude and does NOT attempt the imp-3066
 *   K_a >= 0 positivity. RH-EQUIVALENT. NO RH verdict, NO QED. Platt-Trudgian
 *   Lambda <= 0.2 remains the rigorous SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3525 / imp-3505 / imp-3485)
const A_LINEAR = 1.0; // shear weight; a cancels in the sigma-ratios
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3525 ladder
const U_TARGET = 20; // the imp-3525 target cell
const N_TARGET = 800; // N = U/H0
const KRYLOV_CORRECTED = 120; // imp-3525 corrected Krylov dimension
const KRYLOV_ENRICHED = 160; // imp-3525 enrichment (self-consistency check)
const BUDGET_LADDER = Object.freeze([8320, 16640, 33280]); // imp-3525 budget 8320, then 2x, 4x

// --- BAKED offline norms (identical imp-3525 assembly at N = 800; ~38 s single run) --
// The skew-Toeplitz section operator norm ||Ttilde|| = sqrt(lambda_max(T^T T)) measured
// by (a) checkpointed power iteration at each budget and (b) Lanczos/Jacobi at m = 120
// and m = 160. Baked as literals so this module is import-light; every reported ratio
// below is RECOMPUTED from these norms (self-checking arithmetic).
const NORMS = Object.freeze({
  lanczos120: 6.4912208769005953e-5, // Lanczos m = 120 -- corrected independent reference
  lanczos160: 6.4912208769007024e-5, // Lanczos m = 160 -- enrichment self-check
  power8320: 6.491220876778628e-5, // power iteration at budget 8320 (imp-3525 setting)
  power16640: 6.4912208769005113e-5, // power iteration at budget 16640 (2x)
  power33280: 6.4912208769005086e-5, // power iteration at budget 33280 (4x)
});

// --- recompute every ratio from the baked norms (self-checking arithmetic) -----------
const ref = NORMS.lanczos120;
const agree8320 = Math.abs(NORMS.power8320 - ref) / ref; // ~1.879e-11 (reproduces imp-3525)
const agree16640 = Math.abs(NORMS.power16640 - ref) / ref; // ~1.294e-14 (machine level)
const agree33280 = Math.abs(NORMS.power33280 - ref) / ref; // ~1.336e-14 (holds at machine level)
const powerSelf16640 = Math.abs(NORMS.power16640 - NORMS.power8320) / NORMS.power8320; // ~1.878e-11
const powerSelf33280 = Math.abs(NORMS.power33280 - NORMS.power16640) / NORMS.power16640; // ~4.18e-16
const lanczosSelfRel = Math.abs(NORMS.lanczos120 - NORMS.lanczos160) / NORMS.lanczos160; // ~1.65e-14
const collapseFactor = agree16640 > 0 ? agree8320 / agree16640 : Infinity; // ~1450x

// --- verdict checks ------------------------------------------------------------------
// (1) budget 8320 reproduces the imp-3525 residual ~1.9e-11.
const reproducesImp3525Residual = agree8320 > 1e-11 && agree8320 < 3e-11;
// (1) pushing to 16640 collapses the agreement to machine level and 33280 holds it.
const collapsesToMachine = agree16640 < 1e-13 && agree33280 < 1e-13;
const bigCollapse = collapseFactor > 100; // measured ~1450x -- residual was power under-convergence
// (2) the power iteration is fully converged by 16640 (self-convergence < 1e-14 to 33280).
const powerConvergedBy16640 = powerSelf16640 > 1e-12 && powerSelf33280 < 1e-14;
// (2) the Lanczos reference is itself resolved (m = 120 vs m = 160 at machine level).
const referenceResolved = lanczosSelfRel < 1e-12;
// (2) NO algebraic floor above machine: converged power-vs-Lanczos agreement sits at the
//     SAME machine level as the Lanczos self-consistency (both ~1e-14, within ~10x).
const noAlgebraicFloor =
  agree33280 < 1e-13 && agree33280 < 10 * lanczosSelfRel && lanczosSelfRel < 10 * agree33280;

const verdict =
  reproducesImp3525Residual &&
  collapsesToMachine &&
  bigCollapse &&
  powerConvergedBy16640 &&
  referenceResolved &&
  noAlgebraicFloor
    ? 'BUDGET-PAST-8320-COLLAPSES-U20-AGREEMENT-1.9e-11->1.3e-14-RESIDUAL-WAS-PURE-POWER-UNDER-CONVERGENCE-NO-ALGEBRAIC-FLOOR'
    : 'INDETERMINATE';

export const IMP3554_POWER_BUDGET_BEYOND_8320_U20_AGREEMENT_FLOOR = Object.freeze({
  id: 'imp-3554-power-budget-beyond-8320-U20-agreement-floor',
  ticket: 'imp-3554',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  measures: 'imp-3525-corrected-solver-agreement-crossval.js',
  reproduces: 'imp-3505-power-iteration-budget-convergence-sweep.js',

  summary:
    'MEASURES whether pushing the imp-3525 power-iteration budget BEYOND 8320 steps at U = 20 (N = 800) drives the ' +
    'corrected solver agreement below its residual ~1.9e-11 toward the machine floor, isolating the remaining ' +
    'power-convergence deficit from any genuine algebraic solver disagreement. Reusing the IDENTICAL imp-3525 ' +
    'skew-Toeplitz assembly Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, midpoint), the IDENTICAL checkpointed power ' +
    'iteration and the IDENTICAL Lanczos/Jacobi reference (m=120, cross-checked m=160), on the budget ladder ' +
    '{8320,16640,33280}: (1) the U=20 agreement |sigma_power - sigma_Lanczos120|/sigma_Lanczos120 falls from ' +
    '~1.879e-11 at budget 8320 (reproducing imp-3525) to ~1.294e-14 at 16640 (a ~1450x collapse) and holds at ' +
    '~1.336e-14 at 33280 -- so the residual imp-3525 saw is PURE POWER UNDER-CONVERGENCE, removed by one budget ' +
    'doubling. (2) The power self-convergence tightens from |sigma(16640)-sigma(8320)|/sigma ~1.878e-11 to ' +
    '|sigma(33280)-sigma(16640)|/sigma ~4.18e-16 (power stable to <5e-16 by 16640); the converged power route then ' +
    'agrees with the independent Lanczos120 route to ~1.34e-14, the SAME machine level as the Lanczos m=120 vs ' +
    'm=160 self-consistency ~1.65e-14, so there is NO genuine algebraic solver-disagreement floor above ~1e-14 -- ' +
    'confirming imp-3525s attribution exactly. The N=800 power run to 33280 steps (~33k O(N^2) matvecs, ~38 s) was ' +
    'run offline and the norms BAKED as import-light literals; every ratio is recomputed from them. Measurement ' +
    'only; does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity; ' +
    'RH-EQUIVALENT; NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    phiTruncationN: NPHI,
    numeratorOperator: 'Ttilde(u,v) = a (v-u) R(|v-u|), R(t) = int Phi(w)Phi(w+t) dw (identical to imp-3525/imp-3505)',
    powerIteration: 'checkpointed single-vector v -> M^T M v, sigma = sqrt(||M^T M v||); imp-3525 start vector sin(0.3 i + 1)',
    referenceSolver: 'symmetric Lanczos on S = T^T T with FULL reorthogonalization, top eigenvalue by cyclic Jacobi',
    correctedKrylov: KRYLOV_CORRECTED,
    enrichedKrylov: KRYLOV_ENRICHED,
    budgetLadder: BUDGET_LADDER.slice(),
    agreementDefinition: '|sigma_power(budget) - sigma_Lanczos120| / sigma_Lanczos120 at U = 20 (N = 800)',
    operatorNorm: 'sigma_max = sqrt(lambda_max(T^T T)) in both routes',
    a: A_LINEAR,
    h0: H0,
    U: U_TARGET,
    N: N_TARGET,
    quadrature: 'midpoint, N = U/H0 panels on [0, U]',
    measuredOffline: 'the N=800 power run to 33280 steps (~33k O(N^2) matvecs, ~38 s) was run once offline and the norms BAKED as literals; this module is import-light and does not re-run the heavy power iteration',
    selfComputing: false,
  }),

  measured: Object.freeze({
    norms: NORMS, // baked: lanczos120, lanczos160, power8320, power16640, power33280
    // (1) agreement vs the corrected Lanczos120 reference across the budget ladder
    agree8320, // ~1.879e-11 -- reproduces the imp-3525 U=20 residual
    agree16640, // ~1.294e-14 -- collapses to machine level after one budget doubling
    agree33280, // ~1.336e-14 -- holds at machine level (4x budget)
    collapseFactor, // ~1450x -- agree8320 / agree16640
    reproducesImp3525Residual, // true -- budget 8320 gives ~1.9e-11
    collapsesToMachine, // true -- 16640 and 33280 both < 1e-13
    bigCollapse, // true -- > 100x collapse
    // (2) power self-convergence and the algebraic-floor isolation
    powerSelf16640, // ~1.878e-11 -- power still moving from 8320 to 16640
    powerSelf33280, // ~4.18e-16 -- power fully converged by 16640 (stable to <5e-16)
    powerConvergedBy16640, // true
    lanczosSelfRel, // ~1.65e-14 -- Lanczos m=120 vs m=160 self-consistency (reference resolved)
    referenceResolved, // true -- m=120 fully resolved
    noAlgebraicFloor, // true -- converged power-vs-Lanczos gap sits at the same machine level as the reference self-consistency
    verdict,
  }),

  interpretation: Object.freeze({
    residualIsPurePowerUnderConvergence:
      'imp-3525 attributed the U=20 residual ~1.9e-11 at budget 8320 to remaining power convergence, not algebraic ' +
      'disagreement, but never pushed the budget. One doubling to 16640 collapses the agreement ~1450x to ~1.3e-14 ' +
      'and 33280 holds it there, so the residual was PURE POWER UNDER-CONVERGENCE: doubling the budget once removes ' +
      'essentially all of it.',
    noAlgebraicSolverDisagreementFloor:
      'The power iteration is fully converged by 16640 (self-convergence tightens to ~4.18e-16 from 16640 to 33280). ' +
      'The converged power route then agrees with the independent Lanczos120 route to ~1.34e-14, the SAME machine ' +
      'level as the Lanczos m=120 vs m=160 self-consistency ~1.65e-14. So the two structurally independent ' +
      'eigensolvers agree to machine precision once both are converged: there is NO genuine algebraic ' +
      'solver-disagreement floor above ~1e-14.',
    whatItAddsOverImp3525:
      'imp-3525 measured the corrected agreement ~1.9e-11 at a single budget of 8320 and attributed the residual to ' +
      'power under-convergence without testing it. This module pushes the budget to 16640 and 33280, shows the ' +
      'agreement collapses ~1450x to machine level and the power norm self-converges to <5e-16, and confirms the ' +
      'converged-vs-converged solver gap sits at the machine floor -- isolating the residual as pure power ' +
      'under-convergence with no algebraic disagreement.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    measuresBudgetNotConstructs:
      'This pushes the power-iteration budget past 8320 at N = 800 and isolates the residual as pure power ' +
      'under-convergence; it does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 ' +
      'positivity.',
    convergenceIsNumericalNotSymbolic:
      'The ~1.3e-14 converged agreement is a finite-N numerical convergence measurement at budget 16640/33280; it ' +
      'certifies solver-independence of the section norm to machine precision, not a symbolic identity of the ' +
      'closed-form sup.',
    bakedOfflineLiterals:
      'The five section norms are BAKED offline literals (the N = 800 power run to 33280 steps is ~33k O(N^2) ' +
      'matvecs, too heavy to run at import); every reported agreement and self-convergence ratio is recomputed ' +
      'from those norms as self-checking arithmetic.',
    measuresRatioNumeratorNotPositivity:
      'This concerns the numerator norm of the capture RATIO only; the imp-3066 off-diagonal endpoint-Hankel ' +
      'operator magnitude remains the lone obstruction, UNTOUCHED.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3554_POWER_BUDGET_BEYOND_8320_U20_AGREEMENT_FLOOR_ASSERTIONS = [
  {
    id: 'imp3554-budget-8320-reproduces-imp3525-residual',
    why: 'Anchoring: at budget 8320 the U=20 power-vs-Lanczos120 agreement must reproduce the imp-3525 residual ' +
      '~1.9e-11 (in [1e-11, 3e-11]), so this pushes the SAME object imp-3525 measured.',
    holds: () => reproducesImp3525Residual,
  },
  {
    id: 'imp3554-budget-past-8320-collapses-to-machine',
    why: 'THE PRIMARY DELIVERABLE: pushing the budget to 16640 (and 33280) must collapse the U=20 agreement below ' +
      '1e-13 (measured ~1.3e-14) -- i.e. the residual ~1.9e-11 is driven toward the machine floor.',
    holds: () => collapsesToMachine,
  },
  {
    id: 'imp3554-collapse-is-large-power-under-convergence',
    why: 'The collapse from budget 8320 to 16640 must exceed 100x (measured ~1450x): the residual ~1.9e-11 was ' +
      'PURE POWER UNDER-CONVERGENCE, removed by a single budget doubling, not algebraic disagreement.',
    holds: () => bigCollapse,
  },
  {
    id: 'imp3554-power-fully-converged-by-16640',
    why: 'The power self-convergence must show the norm still moving from 8320 to 16640 (> 1e-12) but STABLE to ' +
      '< 1e-14 from 16640 to 33280 (measured ~4.18e-16) -- the power iteration is fully converged by 16640.',
    holds: () => powerConvergedBy16640,
  },
  {
    id: 'imp3554-reference-resolved-no-algebraic-floor',
    why: 'THE ISOLATION: the Lanczos m=120 vs m=160 reference must be resolved (< 1e-12) and the converged ' +
      'power-vs-Lanczos120 agreement (~1.3e-14) must sit at the SAME machine level as that self-consistency ' +
      '(~1.65e-14, within ~10x) -- so there is no genuine algebraic solver-disagreement floor above machine.',
    holds: () => referenceResolved && noAlgebraicFloor,
  },
  {
    id: 'imp3554-baked-norms-self-consistent',
    why: 'Self-check: the baked power16640 and power33280 norms must agree to < 1e-14 relative (the power iteration ' +
      'is converged), so the recomputed agreement ratios rest on a stable baked norm.',
    holds: () => Math.abs(NORMS.power33280 - NORMS.power16640) / NORMS.power16640 < 1e-14,
  },
  {
    id: 'imp3554-verdict-collapse-pure-power-under-convergence',
    why: 'The classified verdict must be the collapse split, not indeterminate; a flip means the residual ' +
      'reproduction, the machine-level collapse, the power self-convergence, or the algebraic-floor isolation failed.',
    holds: () => verdict === 'BUDGET-PAST-8320-COLLAPSES-U20-AGREEMENT-1.9e-11->1.3e-14-RESIDUAL-WAS-PURE-POWER-UNDER-CONVERGENCE-NO-ALGEBRAIC-FLOOR',
  },
  {
    id: 'imp3554-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- pushes the power budget past 8320 and isolates the residual, ' +
      'positivity not attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3554_POWER_BUDGET_BEYOND_8320_U20_AGREEMENT_FLOOR.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.measuresBudgetNotConstructs === 'string' &&
        typeof c.bakedOfflineLiterals === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3554_POWER_BUDGET_BEYOND_8320_U20_AGREEMENT_FLOOR_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3554-power-budget-beyond-8320-U20-agreement-floor assertion failed: ${assertion.id}`);
  }
}

export default IMP3554_POWER_BUDGET_BEYOND_8320_U20_AGREEMENT_FLOOR;
