/**
 * @module imp-3625-skew-toeplitz-pair56-krylov-depth
 * @fileoverview imp-3625 -- ASSESS whether the imp-3602 lambda_5 = lambda_6
 *   third-pair degeneracy LOSS at deep N (relative gap 2e-14 -> 1.01e-11 between
 *   N = 1200 and N = 2000) is a Lanczos KRYLOV reorthogonalization limit -- and
 *   whether growing the reorthogonalized Krylov depth restores the degeneracy in
 *   the imp-3575 manner -- or whether it FLOORS (a genuine near-degeneracy
 *   splitting of the third pair).
 *
 *   CONTEXT
 *   -------
 *   imp-3602 measured the SECOND skew-Toeplitz gap sigma_2 = lambda_5/lambda_1 and
 *   reported the third-pair degeneracy lambda_5 = lambda_6 holding to relative
 *   < 2e-14 at every rung THROUGH N = 1200 but LOOSENING to 1.01e-11 at the deepest
 *   rung N = 2000. That N = 2000 measurement used a Lanczos Krylov depth m = 440.
 *   The signature -- a pair degeneracy that is tight at small N and loosens at deep
 *   N at a FIXED Krylov depth -- is qualitatively identical to the one imp-3575
 *   traced to an m = 200 Krylov UNDER-resolution deficit in lambda_3 that grew with
 *   N (m = 200 sufficed at N = 1200 but was 4.03e-4 short at N = 1600, locking only
 *   at m >= 280). Whether the imp-3602 pair56 loss is likewise a converged-depth
 *   artifact was untested: imp-3602 measured only at m = 440.
 *
 *   THIS MODULE re-runs the IDENTICAL imp-3505/imp-3575/imp-3596/imp-3602 assembly
 *   Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, midpoint quadrature) at
 *   N = 2000 (U = 50) with a SINGLE symmetric Lanczos to Krylov depth m = 640 under
 *   FULL reorthogonalization, and reads off the top-6 Gram Ritz values at the
 *   sub-depths m in {440, 480, 560, 640} (each shorter depth is the leading
 *   tridiagonal sub-block of the m = 640 run under full reorthogonalization).
 *   From the top-6 Ritz values it forms, in the imp-3602 SINGULAR-VALUE convention
 *   (sigma_i = sqrt(lambda_i)), the third-pair relative splitting
 *     pair56(m) = |sigma_5 - sigma_6| / sigma_5
 *   and the second gap sigma_2(m) = lambda_5/lambda_1. The measurement ran once
 *   offline (scripts/compute-imp3625-pair56-krylov.mjs, ~50 s: build Ttilde +
 *   Lanczos to m = 640); the per-depth top Ritz LITERALS (lambda_1, lambda_5,
 *   lambda_6) are BAKED so this module stays import-light and the pair56 / sigma_2
 *   arithmetic is self-checking against them.
 *
 *   FINDING
 *   -------
 *   (1) THE imp-3602 pair56 LOSS AT N = 2000 IS A KRYLOV REORTHOGONALIZATION LIMIT,
 *       NOT A GENUINE SPLITTING. At the imp-3602 depth m = 440 the third-pair
 *       splitting is pair56 = 1.0102e-11, reproducing the imp-3602 baked value
 *       (1.010245749617736e-11) to 6 significant figures -- a self-check that this is
 *       the imp-3602 assembly. Growing the Krylov depth to m = 480 CONTRACTS pair56
 *       to 6.06e-15 -- a factor of ~1667 -- and it then stays at the machine floor
 *       for all deeper depths (m = 560: 1.88e-14, m = 640: 7.31e-15), i.e. it does
 *       NOT floor at 1.01e-11 but returns to the < 2e-14 level imp-3602 saw at every
 *       rung through N = 1200. So the third pair is genuinely degenerate at N = 2000
 *       too; the imp-3602 m = 440 pair56 = 1.01e-11 was Krylov-UNDER-resolved, EXACTLY
 *       the imp-3575 pattern one gap and one ladder-rung deeper.
 *   (2) THE SECOND GAP sigma_2 = lambda_5/lambda_1 IS UNAFFECTED BY THE DEPTH. Across
 *       m = 440..640 sigma_2 = 0.99958651049280 is INVARIANT to relative < 2e-14
 *       (0.9995865104928129 at m = 440 vs 0.9995865104927951 at m = 640). So the
 *       m = 440 pair56 under-resolution did NOT corrupt the imp-3602 second-gap value
 *       or its exponent q_2 = -1.9813: the pair-INTERNAL splitting reorthogonalizes
 *       away without moving the pair's DISTANCE from the first pair. The imp-3602
 *       sigma_2 ladder and its -2 heuristic are robust to the depth artifact.
 *   (3) THE DEFICIT IS DEPTH-SPECIFIC AND RESTORES IN THE imp-3575 MANNER. Just as
 *       imp-3575 found lambda_3 under-resolved at (N = 1600, m = 200) and locked at
 *       m >= 280, here lambda_5 = lambda_6 is under-resolved at (N = 2000, m = 440)
 *       and locks at m >= 480. Higher reorthogonalized Krylov depth restores the
 *       degeneracy; the loss was a truncation limit of the fixed-m reference, not a
 *       genuine near-degeneracy splitting.
 *
 *   @see imp-3602-skew-toeplitz-second-gap-exponent.js (the pair56 2e-14 -> 1.01e-11 loss assessed here)
 *   @see imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js (the lambda_3 Krylov under-resolution pattern this mirrors)
 *   @see imp-3596-skew-toeplitz-gap-dense-crossval.js (dense certification that the spectrum is adjacent-paired)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly + Lanczos routine)
 *
 *   Ticket: imp-3625 (numerical, medium). MEASUREMENT ONLY: attributes the imp-3602
 *   deep-N pair56 loss to a Krylov reorthogonalization limit and shows deeper depth
 *   restores it, leaving sigma_2 unchanged. Does NOT construct the missing magnitude
 *   and does NOT attempt the imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. NO RH
 *   verdict, NO QED. No refereed bound is changed.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3575 / imp-3602)
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3505 / imp-3602 ladder
const MACHINE_FLOOR = 2e-14; // the < 2e-14 lambda_5=lambda_6 floor imp-3602 saw at N <= 1200
const IMP3602_M440_PAIR56 = 1.010245749617736e-11; // imp-3602 baked N=2000 pair56 (m=440)
const IMP3602_M440_SIGMA2 = 0.999586510492813; // imp-3602 baked N=2000 sigma_2 (m=440)

// --- BAKED top Gram Ritz values (lambda_i = Ritz eigenvalue of S = T^T T = sigma_i^2)
//     at N = 2000 (U = 50) as a function of Lanczos Krylov depth m. Single Lanczos to
//     m = 640 with FULL reorthogonalization; shorter depths are leading tridiagonal
//     sub-blocks. Measured offline with the identical imp-3505/imp-3575/imp-3602
//     assembly (scripts/compute-imp3625-pair56-krylov.mjs); literals baked,
//     import-light. pair56 and sigma_2 are derived arithmetically below. ------------ */
const KRYLOV_DEPTH_SWEEP = Object.freeze([
  { m: 440, role: 'imp3602-reference', lambda1: 4.214729052177117e-9, lambda5: 4.212986305938405e-9, lambda6: 4.212986305853281e-9 },
  { m: 480, role: 'reconverged', lambda1: 4.214729052177226e-9, lambda5: 4.21298630593846e-9, lambda6: 4.21298630593841e-9 },
  { m: 560, role: 'locked', lambda1: 4.2147290521773905e-9, lambda5: 4.2129863059386936e-9, lambda6: 4.212986305938536e-9 },
  { m: 640, role: 'locked', lambda1: 4.214729052177599e-9, lambda5: 4.212986305938812e-9, lambda6: 4.21298630593875e-9 },
]);

// --- derive per-depth pair56 (imp-3602 SINGULAR-VALUE convention) and sigma_2 -------
const depthRows = KRYLOV_DEPTH_SWEEP.map((r) => {
  const s5 = Math.sqrt(r.lambda5);
  const s6 = Math.sqrt(r.lambda6);
  const pair56 = Math.abs(s5 - s6) / s5; // |sigma_5 - sigma_6|/sigma_5 (imp-3602 convention)
  const sigma2 = r.lambda5 / r.lambda1; // second gap lambda_5/lambda_1
  return { m: r.m, role: r.role, pair56, sigma2 };
});

const m440 = depthRows.find((r) => r.m === 440);
const converged = depthRows.filter((r) => r.m >= 480); // the reconverged / locked depths
const worstConvergedPair56 = Math.max(...converged.map((r) => r.pair56)); // largest at m >= 480
const bestConvergedPair56 = Math.min(...converged.map((r) => r.pair56));

// (self-check) the m=440 reference reproduces the imp-3602 baked pair56 and sigma_2
const m440ReproducesImp3602Pair56 = Math.abs(m440.pair56 - IMP3602_M440_PAIR56) / IMP3602_M440_PAIR56 < 1e-3;
const m440ReproducesImp3602Sigma2 = Math.abs(m440.sigma2 - IMP3602_M440_SIGMA2) < 1e-12;

// (1) the pair56 CONTRACTS back to the machine floor at deeper depth (Krylov-limited)
const pair56ContractsToFloor = worstConvergedPair56 < MACHINE_FLOOR && m440.pair56 > 1e-11;
const contractionFactor = m440.pair56 / worstConvergedPair56; // ~ 540 (worst) .. ~1667 (best)
// it does NOT floor at ~1e-11 -- rules out a genuine third-pair near-degeneracy splitting
const notAGenuineSplitting = worstConvergedPair56 < 1e-11 / 100;

// (2) sigma_2 is INVARIANT across the depth sweep (the pair56 loss did not corrupt it)
const sigma2Values = depthRows.map((r) => r.sigma2);
const sigma2Spread = Math.max(...sigma2Values) - Math.min(...sigma2Values);
// ~2.1e-14 across the sweep -- machine-floor rounding of a lambda_5/lambda_1 ratio of
// two ~4.2e-9 Ritz values, three orders of magnitude below the 1e-11 pair56 loss.
const SIGMA2_INVARIANCE_TOL = 5e-14;
const sigma2InvariantAcrossDepth = sigma2Spread < SIGMA2_INVARIANCE_TOL;
const sigma2ReproducesImp3602 = depthRows.every((r) => Math.abs(r.sigma2 - IMP3602_M440_SIGMA2) < 1e-12);

// (3) restored in the imp-3575 manner: under-resolved at the fixed m, locks at deeper m
const restoresInImp3575Manner = m440.pair56 > 1e-11 && pair56ContractsToFloor && bestConvergedPair56 < 1e-14;

const verdict =
  m440ReproducesImp3602Pair56 &&
  m440ReproducesImp3602Sigma2 &&
  pair56ContractsToFloor &&
  notAGenuineSplitting &&
  sigma2InvariantAcrossDepth &&
  sigma2ReproducesImp3602 &&
  restoresInImp3575Manner
    ? 'IMP3602-PAIR56-LOSS-AT-N2000-IS-A-KRYLOV-REORTHOGONALIZATION-LIMIT:-m=440-pair56=1.01e-11-UNDER-RESOLVED;-GROWING-TO-m>=480-CONTRACTS-IT-~1667x-TO-THE-<2e-14-MACHINE-FLOOR-(RESTORED-IN-THE-imp-3575-MANNER),-NOT-A-GENUINE-THIRD-PAIR-SPLITTING;-sigma_2=lambda_5/lambda_1-INVARIANT-TO-<2e-14-SO-THE-imp-3602-SECOND-GAP-AND-ITS-q_2=-1.9813-ARE-UNAFFECTED'
    : 'INDETERMINATE';

export const IMP3625_SKEW_TOEPLITZ_PAIR56_KRYLOV_DEPTH = Object.freeze({
  id: 'imp-3625-skew-toeplitz-pair56-krylov-depth',
  ticket: 'imp-3625',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  assessesArtifactOf: 'imp-3602-skew-toeplitz-second-gap-exponent.js',
  mirrorsPattern: 'imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js',

  summary:
    'ASSESSES whether the imp-3602 lambda_5 = lambda_6 third-pair degeneracy LOSS at deep N (relative gap 2e-14 -> ' +
    '1.01e-11 between N = 1200 and N = 2000, measured at Lanczos Krylov depth m = 440) is a KRYLOV reorthogonalization ' +
    'limit that deeper depth restores in the imp-3575 manner, or a genuine third-pair near-degeneracy splitting. IT IS ' +
    'A KRYLOV LIMIT. Re-running the IDENTICAL imp-3505/imp-3575/imp-3596/imp-3602 assembly Ttilde(u,v)=a(v-u)R (NPHI=10, ' +
    'H0=0.025, midpoint) at N = 2000 with a single full-reorthogonalization Lanczos to m = 640 and reading the top-6 ' +
    'Gram Ritz values at m in {440,480,560,640} (leading tridiagonal sub-blocks): at m = 440 the third-pair splitting ' +
    'pair56 = |sigma_5-sigma_6|/sigma_5 = 1.0102e-11 reproduces the imp-3602 baked value (1.010245749617736e-11) to 6 ' +
    'significant figures, but growing to m = 480 CONTRACTS it ~1667x to 6.06e-15 and it stays at the machine floor for ' +
    'all deeper depths (m = 560: 1.88e-14, m = 640: 7.31e-15) -- returning to the < 2e-14 level imp-3602 saw at every ' +
    'rung through N = 1200, NOT flooring at 1.01e-11. So lambda_5 = lambda_6 is genuinely degenerate at N = 2000 too; ' +
    'the imp-3602 m = 440 pair56 was Krylov-under-resolved, exactly the imp-3575 lambda_3 pattern one gap and one ' +
    'ladder-rung deeper (lambda_3 under-resolved at (1600,200), locked at m>=280; lambda_5=lambda_6 under-resolved at ' +
    '(2000,440), locked at m>=480). The second gap sigma_2 = lambda_5/lambda_1 = 0.99958651049280 is INVARIANT across ' +
    'm = 440..640 to relative < 2e-14, so the pair56 under-resolution did NOT corrupt the imp-3602 sigma_2 value or its ' +
    'q_2 = -1.9813 exponent: the pair-internal splitting reorthogonalizes away without moving the pair distance from ' +
    'the first pair. Measurement only; does NOT construct the missing magnitude and does NOT attempt the imp-3066 ' +
    'K_a >= 0 positivity; RH-EQUIVALENT; NO RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    quantityAssessed: 'third-pair degeneracy pair56 = |sigma_5-sigma_6|/sigma_5 (imp-3602 singular-value convention, sigma_i=sqrt(lambda_i)) at N=2000 vs Lanczos Krylov depth m',
    secondGapTracked: 'sigma_2(N) = lambda_5/lambda_1 (the imp-3602 second gap) at each depth, to test whether the pair56 loss corrupted it',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3575/imp-3602: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    eigensolver: 'symmetric Lanczos on S=T^T T with FULL reorthogonalization; top-6 Ritz values by cyclic Jacobi on the tridiagonal',
    krylovDepthsSwept: [440, 480, 560, 640],
    krylovSubBlocks: 'a single Lanczos run to m=640 at N=2000; shorter Krylov depths are leading tridiagonal sub-blocks (full reorthogonalization makes the leading m-block identical to a length-m run)',
    N: 2000,
    U: 50,
    h0: H0,
    computeScript: 'scripts/compute-imp3625-pair56-krylov.mjs (offline, ~50 s: build Ttilde + Lanczos to m=640)',
    measuredOffline: 'the N=2000 Lanczos to m=640 ran once offline; per-depth top Ritz literals (lambda_1, lambda_5, lambda_6) baked; import-light, no Lanczos re-run at import; pair56/sigma_2 arithmetic self-checks against the baked Ritz values',
    selfComputing: false,
  }),

  measured: Object.freeze({
    krylovDepthSweep: KRYLOV_DEPTH_SWEEP, // per-depth baked top Ritz values (lambda_1, lambda_5, lambda_6)
    depthRows, // per-depth derived pair56 (sigma convention) and sigma_2
    m440Pair56: m440.pair56, // ~1.0102e-11 (reproduces imp-3602)
    worstConvergedPair56, // largest pair56 at m>=480 (< 2e-14 machine floor)
    bestConvergedPair56, // smallest pair56 at m>=480 (~6e-15)
    contractionFactor, // m=440 pair56 / worst converged pair56 (~540..1667)
    m440ReproducesImp3602Pair56, // true -- m=440 pair56 reproduces the imp-3602 baked 1.01e-11 to <1e-3 rel
    m440ReproducesImp3602Sigma2, // true -- m=440 sigma_2 reproduces the imp-3602 baked value
    pair56ContractsToFloor, // true -- pair56 falls below 2e-14 at m>=480 (Krylov-limited)
    notAGenuineSplitting, // true -- converged pair56 << 1e-11, so not a real near-degeneracy splitting
    sigma2Spread, // < 2e-14 across the depth sweep
    sigma2InvariantAcrossDepth, // true -- sigma_2 unchanged m=440..640
    sigma2ReproducesImp3602, // true -- every depth sigma_2 reproduces the imp-3602 baked value
    restoresInImp3575Manner, // true -- under-resolved at fixed m, locks at deeper m (the imp-3575 signature)
    machineFloor: MACHINE_FLOOR,
    imp3602M440Pair56: IMP3602_M440_PAIR56,
    imp3602M440Sigma2: IMP3602_M440_SIGMA2,
    verdict,
  }),

  interpretation: Object.freeze({
    pair56LossIsKrylovNotPhysical:
      'imp-3602 measured lambda_5=lambda_6 tight to < 2e-14 through N=1200 but loosening to 1.01e-11 at N=2000, all at ' +
      'a fixed Krylov depth m=440. This module shows the loss is a reorthogonalization limit: at m=440 pair56=1.01e-11 ' +
      '(reproducing imp-3602), but m=480 contracts it ~1667x to 6.06e-15 and it stays at the < 2e-14 machine floor for ' +
      'all deeper depths. The third pair is genuinely degenerate at N=2000; the m=440 value was Krylov-under-resolved.',
    sameAsImp3575OneGapDeeper:
      'This is the imp-3575 pattern one gap and one ladder-rung deeper. imp-3575 found lambda_3 under-resolved at ' +
      '(N=1600, m=200) and locking at m>=280; here lambda_5=lambda_6 is under-resolved at (N=2000, m=440) and locks at ' +
      'm>=480. The fixed-depth reference under-resolves the finer level of the deeper section, and higher ' +
      'reorthogonalized Krylov depth restores it -- a depth-specific truncation limit, not a genuine gap change.',
    secondGapUnaffected:
      'The second gap sigma_2=lambda_5/lambda_1 is invariant across m=440..640 to relative < 2e-14, reproducing the ' +
      'imp-3602 baked value at every depth. So the pair56 under-resolution at m=440 did NOT corrupt the imp-3602 ' +
      'second-gap measurement or its q_2=-1.9813 exponent: the pair-internal splitting reorthogonalizes away without ' +
      'moving the pair distance from the first pair. The imp-3602 sigma_2 ladder is robust to this artifact.',
    whatItAddsOverImp3602:
      'imp-3602 reported the pair56 loss to 1.01e-11 at N=2000 as a NOTED caveat measured only at m=440. This module ' +
      're-measures at m up to 640 and IDENTIFIES the loss as a Krylov reorthogonalization limit that deeper depth ' +
      'restores to the < 2e-14 floor, and certifies the imp-3602 sigma_2 value is unaffected -- upgrading the caveat ' +
      'from an unexplained deep-N loosening to a measured, restored depth artifact.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    convergenceIsNumericalNotSymbolic:
      'The pair56 contraction and sigma_2 invariance are finite-N numerical measurements of a converged Krylov ' +
      'reference at a single deep rung N=2000; the adjacent-paired structure is corroborated (imp-3596 dense), not ' +
      'derived, and no asymptotic in N is proven.',
    assessesNotConstructs:
      'This assesses and restores a Krylov reorthogonalization limit in a previously baked degeneracy measurement; it ' +
      'does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    bakedOfflineLiterals:
      'The per-depth top Ritz values are BAKED offline literals (the Lanczos to m=640 at N=2000 is O(N^2) per matvec, ' +
      '~50 s); this module derives pair56 and sigma_2 arithmetically from the baked Ritz values and does NOT re-run ' +
      'the heavy assembly at import. scripts/compute-imp3625-pair56-krylov.mjs reproduces them.',
    supersedesImp3602Pair56AtN2000:
      'The imp-3602 N=2000 pair56=1.010245749617736e-11 was a Krylov-under-resolved value (m=440). The converged ' +
      '(m>=480) value is < 2e-14, at the same machine floor as the N<=1200 rungs. The imp-3602 sigma_2 value at N=2000 ' +
      'is unchanged and remains valid.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3625_SKEW_TOEPLITZ_PAIR56_KRYLOV_DEPTH_ASSERTIONS = [
  {
    id: 'imp3625-m440-reproduces-imp3602-reference',
    why: 'Self-check: at the imp-3602 Krylov depth m=440 the third-pair splitting pair56 and the second gap sigma_2 ' +
      'must reproduce the imp-3602 baked values (pair56 1.010245749617736e-11 to < 1e-3 relative, sigma_2 to < 1e-12) ' +
      '-- confirming this is the imp-3602 assembly and isolating the depth as the only varied quantity.',
    holds: () => m440ReproducesImp3602Pair56 && m440ReproducesImp3602Sigma2,
  },
  {
    id: 'imp3625-pair56-contracts-to-machine-floor-at-deeper-krylov',
    why: 'THE PRIMARY DELIVERABLE: the imp-3602 pair56 loss (m=440 value > 1e-11) must CONTRACT below the 2e-14 machine ' +
      'floor at m>=480 (a factor of hundreds), proving it is a Krylov reorthogonalization limit restored by deeper ' +
      'depth in the imp-3575 manner, NOT a genuine third-pair near-degeneracy splitting.',
    holds: () => pair56ContractsToFloor && restoresInImp3575Manner && contractionFactor > 100,
  },
  {
    id: 'imp3625-converged-pair56-not-a-genuine-splitting',
    why: 'The converged (m>=480) pair56 must be far below the m=440 loss (< 1e-13, in fact ~1e-14), ruling out a ' +
      'genuine near-degeneracy splitting of the third pair that would have FLOORED near 1e-11.',
    holds: () => notAGenuineSplitting && worstConvergedPair56 < 2e-14,
  },
  {
    id: 'imp3625-sigma2-invariant-across-depth',
    why: 'The second gap sigma_2=lambda_5/lambda_1 must be INVARIANT across m=440..640 (spread ~2e-14, at the ' +
      'lambda-ratio machine floor and three orders below the 1e-11 pair56 loss) and reproduce ' +
      'the imp-3602 baked value at every depth -- so the pair56 under-resolution did NOT corrupt the imp-3602 ' +
      'second-gap measurement or its q_2=-1.9813 exponent.',
    holds: () => sigma2InvariantAcrossDepth && sigma2ReproducesImp3602,
  },
  {
    id: 'imp3625-verdict-krylov-limit-located',
    why: 'The classified verdict must be the confirming Krylov-reorthogonalization-limit result, not indeterminate; a ' +
      'flip means the m=440 reproduction, the pair56 contraction, or the sigma_2 invariance failed.',
    holds: () => verdict.startsWith('IMP3602-PAIR56-LOSS-AT-N2000-IS-A-KRYLOV-REORTHOGONALIZATION-LIMIT'),
  },
  {
    id: 'imp3625-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- assesses and restores a Krylov limit in a baked degeneracy, positivity ' +
      'not attempted, RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3625_SKEW_TOEPLITZ_PAIR56_KRYLOV_DEPTH.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.assessesNotConstructs === 'string' &&
        typeof c.supersedesImp3602Pair56AtN2000 === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3625_SKEW_TOEPLITZ_PAIR56_KRYLOV_DEPTH_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3625-skew-toeplitz-pair56-krylov-depth assertion failed: ${assertion.id}`);
  }
}

export default IMP3625_SKEW_TOEPLITZ_PAIR56_KRYLOV_DEPTH;
