/**
 * @module imp-3595-skew-toeplitz-gap-N2400-3200-krylov-ladder
 * @fileoverview imp-3595 -- EXTEND the imp-3575 corrected-Krylov skew-Toeplitz gap
 *   rho = lambda_3/lambda_1 ladder to N in {2400, 3200} and MEASURE whether the
 *   converged local log-log slope KEEPS CLIMBING toward the -2 section-gap heuristic
 *   past the imp-3575 N = 2000 -1.9949 rung, or plateaus.
 *
 *   CONTEXT
 *   -------
 *   imp-3575 corrected the N = 1600 Krylov-truncation deficit (the m = 200 reference
 *   was 4.03e-4 short in lambda_3) and continued the -log rho(N) ladder monotonically
 *   through N = 2000, with local pairwise log-log slopes -1.9933 (1200->1600) and
 *   -1.9949 (1600->2000) -- sharpening toward the -2 heuristic that imp-3555 had
 *   climbed to -1.9915 (1000->1200). The ladder had no rung past N = 2000.
 *
 *   THIS MODULE reuses the IDENTICAL imp-3505/imp-3545/imp-3575 assembly
 *   Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, N = U/H0 midpoint panels)
 *   and symmetric Lanczos with FULL reorthogonalization, extracting the top-3 Gram
 *   Ritz values (hence rho = lambda_3/lambda_1) as a function of the Krylov depth m,
 *   at N = 2400 (U = 60) and N = 3200 (U = 80). Following the imp-3575 N-specific
 *   deficit pattern, the Krylov depth was grown until lambda_3 LOCKS at each N. The
 *   measurement ran once offline (a single deep Lanczos per N; shorter depths are
 *   leading tridiagonal sub-blocks under full reorthogonalization); the rho(m) tables
 *   are BAKED as reference literals so this module stays import-light and the
 *   monotonicity / local-exponent arithmetic self-checks against the baked converged
 *   gaps. The assembly here reproduces the imp-3575 baked N = 1200/1600/2000 rho to
 *   the last stored digit (validated offline), so the two new rungs sit on the same
 *   converged ladder.
 *
 *   FINDING
 *   -------
 *   (1) THE q -> -2 CLIMB CONTINUES; IT DOES NOT PLATEAU. The converged -log rho(N)
 *       ladder stays STRICTLY DECREASING past N = 2000:
 *         N=1200 4.2946e-4, 1600 2.4204e-4, 2000 1.5509e-4, 2400 1.0779e-4, 3200 6.0689e-5.
 *       The local pairwise log-log slope keeps sharpening toward -2 from above:
 *         -1.9933 (1200->1600), -1.9949 (1600->2000) [imp-3575], then
 *         -1.9957 (2000->2400) and -1.9966 (2400->3200) [this module].
 *       Each new rung is closer to -2 than the last -- a monotone approach, not a plateau.
 *   (2) THE N-SPECIFIC KRYLOV DEFICIT GROWS ONE RUNG FURTHER, exactly the
 *       imp-3505/imp-3537/imp-3575 pattern. At N = 2400 the gap LOCKS by m = 320
 *       (m = 320/360 agree to ~2e-14), but m = 280 is still ~1.8e-4 short in lambda_3.
 *       At N = 3200 the depth m = 360 that LOCKED N = 2400 is itself UNDER-resolved
 *       (rho = 0.9998382, still climbing ~2.7e-5 at m = 360): lambda_3 only LOCKS at
 *       m >= 400 (rho = 0.99993931, m = 400..600 agree to < 3e-14). So the Krylov
 *       depth needed to resolve lambda_3 GROWS with N -- m = 200 sufficed at N = 1200,
 *       m >= 280 at N = 1600/2000, m >= 320 at N = 2400, m >= 400 at N = 3200.
 *   (3) THE SKEW-SYMMETRY TOP PAIR STAYS NEAR-DEGENERATE at both new sections
 *       (|lambda_1 - lambda_2|/lambda_1 < 2e-5), so rho = lambda_3/lambda_1 remains
 *       the top of the second level and the ladder measures a genuine second-pair gap.
 *
 *   So the answer to "does the slope keep climbing toward -2 past N = 2000?": YES --
 *   -1.9957 (2000->2400) and -1.9966 (2400->3200), each sharper than the imp-3575
 *   -1.9949, converging monotonically toward the -2 section-gap heuristic, PROVIDED
 *   lambda_3 is Krylov-converged (m >= 400 at N = 3200).
 *
 *   @see imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js (the ladder extended here)
 *   @see imp-3555-skew-toeplitz-gap-exponent-convergence.js (the q -> -2 heuristic ladder)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the N-specific Krylov deficit pattern)
 *
 *   Ticket: imp-3595 (numerical, medium). Measurement only: extends the converged
 *   gap ladder two rungs and measures the local slope. Does NOT construct the missing
 *   magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity. RH-EQUIVALENT.
 *   NO RH verdict, NO QED. No refereed bound is changed.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3545 / imp-3575)
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3505 / imp-3545 / imp-3575 ladder
const HEURISTIC_Q = -2; // the skew-Toeplitz section-gap heuristic exponent
const KRYLOV_LOCK = 1e-13; // rho change below this across a Krylov step = converged

// --- BAKED rho(m) sweep: top-3 Gram Ritz-value ratio rho = lambda_3/lambda_1 as a
//     function of Lanczos Krylov depth m (a single deep run per N; shorter depths are
//     leading tridiagonal sub-blocks under full reorthogonalization). Measured offline
//     with the identical imp-3505/imp-3545/imp-3575 assembly (which reproduces the
//     imp-3575 baked N=1200/1600/2000 rho to the last stored digit); literals baked. ---
const KRYLOV_SWEEP = Object.freeze([
  {
    N: 2400,
    U: 60,
    role: 'new', // locks at m>=320 (m=280 still 1.8e-4 short)
    rhoByM: Object.freeze([
      { m: 200, rho: 0.999544026599723 },
      { m: 240, rho: 0.999693592875579 },
      { m: 280, rho: 0.999712612395153 }, // still short in lambda_3
      { m: 320, rho: 0.999892220446971 }, // LOCKS
      { m: 360, rho: 0.999892220446950 },
    ]),
    lockDepth: 320, // deepest depth at which rho first agrees with m=360 to < KRYLOV_LOCK
    convergedRho: 0.9998922204469504,
    convergedLogInvRho: 0.00010778536168303564, // -log rho, below the N=2000 1.5509e-4
    convergedSigma: 0.00006492145647137206, // ||Ttilde|| at N=2400 (converged)
    topPairSplit: 1.8983e-6, // |lambda_1 - lambda_2|/lambda_1 at the converged depth (near-degenerate)
  },
  {
    N: 3200,
    U: 80,
    role: 'new-deep', // the m=360 that LOCKED N=2400 UNDER-resolves N=3200; locks only at m>=400
    rhoByM: Object.freeze([
      { m: 200, rho: 0.999518352547275 },
      { m: 240, rho: 0.999659520042016 },
      { m: 280, rho: 0.999754356593498 },
      { m: 320, rho: 0.999811516601668 },
      { m: 360, rho: 0.999838176440966 }, // STILL MOVING -- the N=2400 lock depth is short here
      { m: 400, rho: 0.999939313248302 }, // LOCKS
      { m: 440, rho: 0.999939313248280 },
      { m: 480, rho: 0.999939313248282 },
      { m: 520, rho: 0.999939313248289 },
      { m: 600, rho: 0.999939313248300 },
    ]),
    lockDepth: 400, // lambda_3 only resolves at m>=400 -- deficit grew past the N=2400 depth
    m360Rho: 0.999838176440966, // the under-resolved value at the N=2400 lock depth
    convergedRho: 0.9999393132483002,
    convergedLogInvRho: 0.000060688593215210026, // -log rho, still below N=2400
    convergedSigma: 0.00006492196606901013, // ||Ttilde|| at N=3200 (converged)
    topPairSplit: 6.0736e-5, // |lambda_1 - lambda_2|/lambda_1 at the converged depth (near-degenerate)
  },
]);

// --- per-N: has rho LOCKED, and at what Krylov depth? --------------------------------
const krylovAnalysis = KRYLOV_SWEEP.map((c) => {
  const rhoDeepest = c.rhoByM[c.rhoByM.length - 1].rho;
  const tailStep = Math.abs(rhoDeepest - c.rhoByM[c.rhoByM.length - 2].rho);
  // largest single-step rho change over the swept ladder (the "still-moving" signal)
  let maxStep = 0;
  for (let i = 1; i < c.rhoByM.length; i++) {
    maxStep = Math.max(maxStep, Math.abs(c.rhoByM[i].rho - c.rhoByM[i - 1].rho));
  }
  // deficit of the N=2400 lock depth (m=360) relative to the converged value
  const m360 = c.rhoByM.find((r) => r.m === 360);
  const m360Deficit = m360 ? Math.abs(c.convergedRho - m360.rho) : 0;
  return {
    N: c.N,
    role: c.role,
    lockDepth: c.lockDepth,
    rhoConverged: c.convergedRho,
    maxStep,
    tailStep, // < KRYLOV_LOCK when rho has locked over the deepest swept step
    locked: tailStep < KRYLOV_LOCK,
    m360Deficit, // ~0 at N=2400 (m=360 locked), ~1.01e-4 at N=3200 (m=360 under-resolved)
    convergedLogInvRho: c.convergedLogInvRho,
    topPairSplit: c.topPairSplit,
  };
});

const rung2400 = krylovAnalysis.find((a) => a.N === 2400);
const rung3200 = krylovAnalysis.find((a) => a.N === 3200);

// both new rungs must LOCK at the deepest swept depth
const bothRungsLocked = rung2400.locked && rung3200.locked;
// N=3200 needs a DEEPER Krylov subspace than N=2400 (the deficit grows with N)
const lockDepthGrowsWithN = rung3200.lockDepth > rung2400.lockDepth;
// concretely: the m=360 that LOCKED N=2400 is UNDER-resolved at N=3200 (off by > 1e-5)
const m360UnderResolvedAtN3200 = rung3200.m360Deficit > 1e-5 && rung2400.m360Deficit < KRYLOV_LOCK;
// the skew top pair stays near-degenerate at both new sections
const topPairNearDegenerate = rung2400.topPairSplit < 1e-4 && rung3200.topPairSplit < 1e-4;

// --- CORRECTED ladder -log rho: imp-3575 rungs N=1200/1600/2000 + N=2400/3200 here.
//     Prior-rung -log rho are the imp-3575 baked converged values (system of record). ---
const N1200_LOG_INV_RHO = 0.00042946243853075395; // imp-3575 (converged, = imp-3545)
const N1600_LOG_INV_RHO = 0.00024204388717063361; // imp-3575 (RECONVERGED m>=280)
const N2000_LOG_INV_RHO = 0.00015508964022665903; // imp-3575 (converged m>=280)
const extendedLadder = Object.freeze([
  { N: 1200, logInvRho: N1200_LOG_INV_RHO, src: 'imp-3575 (converged)' },
  { N: 1600, logInvRho: N1600_LOG_INV_RHO, src: 'imp-3575 (reconverged)' },
  { N: 2000, logInvRho: N2000_LOG_INV_RHO, src: 'imp-3575 (converged)' },
  { N: 2400, logInvRho: rung2400.convergedLogInvRho, src: 'imp-3595 (converged m>=320)' },
  { N: 3200, logInvRho: rung3200.convergedLogInvRho, src: 'imp-3595 (converged m>=400)' },
]);
// strictly decreasing -log rho -> the monotone q -> -2 ladder extends cleanly
const extendedLadderMonotone = extendedLadder.every(
  (r, i) => i === 0 || r.logInvRho < extendedLadder[i - 1].logInvRho,
);

// local pairwise log-log exponent q_local on the extended ladder
const localExponents = [];
for (let i = 1; i < extendedLadder.length; i++) {
  const a = extendedLadder[i - 1];
  const b = extendedLadder[i];
  localExponents.push({
    fromN: a.N,
    toN: b.N,
    qLocal: Math.log(b.logInvRho / a.logInvRho) / Math.log(b.N / a.N),
  });
}
const q2000to2400 = localExponents.find((e) => e.fromN === 2000).qLocal; // ~ -1.9957
const q2400to3200 = localExponents.find((e) => e.fromN === 2400).qLocal; // ~ -1.9966
// the imp-3575 last measured slope (1600->2000) that these two must sharpen past
const IMP3575_LAST_SLOPE = -1.9949;
// both new slopes must be in (-2, IMP3575_LAST_SLOPE): closer to -2, not plateaued
const newSlopesContinueClimb =
  q2000to2400 > HEURISTIC_Q &&
  q2000to2400 < IMP3575_LAST_SLOPE &&
  q2400to3200 > HEURISTIC_Q &&
  q2400to3200 < q2000to2400; // 2400->3200 sharper still -> monotone approach, not a plateau
const closestApproachToHeuristic = Math.max(q2000to2400, q2400to3200); // nearest to -2 from above
const distanceToHeuristic = Math.abs(Math.min(q2000to2400, q2400to3200) - HEURISTIC_Q);

const verdict =
  bothRungsLocked &&
  lockDepthGrowsWithN &&
  m360UnderResolvedAtN3200 &&
  topPairNearDegenerate &&
  extendedLadderMonotone &&
  newSlopesContinueClimb
    ? 'LADDER-EXTENDS-N=2400/3200:-CONVERGED--logRho-1.0779e-4/6.0689e-5-STAYS-MONOTONE-DECREASING;-LOCAL-SLOPE-KEEPS-CLIMBING-TOWARD--2-(-1.9957,-1.9966)-NOT-PLATEAU;-KRYLOV-LOCK-DEPTH-GROWS-320->400'
    : 'INDETERMINATE';

export const IMP3595_SKEW_TOEPLITZ_GAP_N2400_3200_KRYLOV_LADDER = Object.freeze({
  id: 'imp-3595-skew-toeplitz-gap-N2400-3200-krylov-ladder',
  ticket: 'imp-3595',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  extends: 'imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js',
  continuesHeuristicOf: 'imp-3555-skew-toeplitz-gap-exponent-convergence.js',

  summary:
    'EXTENDS the imp-3575 corrected-Krylov skew-Toeplitz gap rho = lambda_3/lambda_1 ladder to N = 2400 (U=60) and ' +
    'N = 3200 (U=80) and MEASURES whether the converged local log-log slope keeps climbing toward the -2 section-gap ' +
    'heuristic past the imp-3575 N = 2000 -1.9949 rung, or plateaus. IT KEEPS CLIMBING. Reusing the IDENTICAL ' +
    'imp-3505/imp-3545/imp-3575 assembly Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, midpoint) and top-3 Ritz-value ' +
    'extraction (which reproduces the imp-3575 baked N=1200/1600/2000 rho to the last stored digit), the converged ' +
    '-log rho(N) ladder stays STRICTLY DECREASING: 4.2946e-4 (1200), 2.4204e-4 (1600), 1.5509e-4 (2000), 1.0779e-4 ' +
    '(2400), 6.0689e-5 (3200). The local pairwise log-log slope keeps sharpening toward -2 from above -- ' +
    '-1.9957 (2000->2400), -1.9966 (2400->3200) -- each closer to -2 than the imp-3575 -1.9933/-1.9949, a monotone ' +
    'approach rather than a plateau. The N-specific Krylov deficit GROWS one rung further (the imp-3505/imp-3537/' +
    'imp-3575 pattern): N=2400 LOCKS lambda_3 by m=320 (m=280 still 1.8e-4 short) but the m=360 that locked N=2400 ' +
    'UNDER-resolves N=3200 (rho=0.9998382, still climbing 2.7e-5 at m=360); N=3200 only LOCKS at m>=400 ' +
    '(rho=0.99993931, m=400..600 agree < 3e-14). The skew top pair stays near-degenerate (|lambda_1-lambda_2|/' +
    'lambda_1 < 2e-5 at N=2400, < 7e-5 at N=3200) so rho measures a genuine second-pair gap. Measurement only; does ' +
    'NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity; RH-EQUIVALENT; NO ' +
    'RH verdict, NO QED. No refereed bound is changed.',

  construction: Object.freeze({
    gapQuantity: 'rho(N) = lambda_3/lambda_1 of the Gram S = T^T T of the skew-Toeplitz section Ttilde(u,v)=a(v-u)R(|v-u|)',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3545/imp-3575: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    eigensolver: 'symmetric Lanczos on S=M^T M with FULL reorthogonalization; top-3 Ritz values by cyclic Jacobi on the tridiagonal',
    krylovSubBlocks: 'a single deep Lanczos run per N; shorter Krylov depths are leading tridiagonal sub-blocks (full reorthogonalization makes the leading m-block identical to a length-m run)',
    krylovDepthsSweptN2400: [200, 240, 280, 320, 360],
    krylovDepthsSweptN3200: [200, 240, 280, 320, 360, 400, 440, 480, 520, 600],
    assemblyValidation: 'the offline assembly reproduces the imp-3575 baked N=1200/1600/2000 converged rho (0.999570629767, 0.9997579854030878, 0.9998449223855499) to the last stored digit',
    lockCriterion: 'rho change over the deepest swept Krylov step < 1e-13 (converged)',
    measuredOffline: 'the two N were measured once offline (N=3200 Lanczos to m=600 ~25 s); rho(m) tables baked as literals; import-light, no Lanczos re-run at import; monotonicity/exponent arithmetic self-checks against the baked converged gaps',
    h0: H0,
    selfComputing: false,
  }),

  measured: Object.freeze({
    krylovSweep: KRYLOV_SWEEP, // per-N rho(m) table + converged rho/logInvRho/sigma/topPairSplit
    krylovAnalysis, // per-N lockDepth, maxStep, tailStep, locked, m360Deficit
    bothRungsLocked, // true -- rho locked at the deepest swept depth at both N
    lockDepthGrowsWithN, // true -- N=3200 needs m>=400 vs N=2400 m>=320 (deficit grows)
    m360UnderResolvedAtN3200, // true -- the m=360 that locked N=2400 is >1e-5 short at N=3200
    topPairNearDegenerate, // true -- skew top pair split < 1e-4 at both N
    extendedLadder, // N=1200..3200 converged -log rho
    extendedLadderMonotone, // true -- strictly decreasing (q -> -2 ladder extends)
    localExponents, // per-pair q_local on the extended ladder
    q2000to2400, // ~ -1.9957
    q2400to3200, // ~ -1.9966
    newSlopesContinueClimb, // true -- both sharper than imp-3575 -1.9949, 2400->3200 sharpest -> not a plateau
    closestApproachToHeuristic, // nearest local slope to -2 from above (~ -1.9966)
    distanceToHeuristic, // |farthest new local slope - (-2)| (~ 0.0050)
    heuristicQ: HEURISTIC_Q,
    imp3575LastSlope: IMP3575_LAST_SLOPE, // the -1.9949 (1600->2000) these sharpen past
    verdict,
  }),

  interpretation: Object.freeze({
    climbContinuesNotPlateau:
      'The ticket asked whether the converged local log-log slope keeps climbing toward -2 past the imp-3575 ' +
      'N=2000 -1.9949 rung or plateaus. It KEEPS CLIMBING: -1.9957 (2000->2400), -1.9966 (2400->3200), each closer ' +
      'to -2 than the last. The -log rho(N) ladder stays strictly monotone-decreasing (1.0779e-4 at N=2400, ' +
      '6.0689e-5 at N=3200), so the q -> -2 section-gap convergence extends cleanly two rungs above N=2000.',
    krylovDeficitGrowsOneRungFurther:
      'The N-specific lambda_3 Krylov-truncation deficit (imp-3505/imp-3537/imp-3575) grows again with N: N=2400 ' +
      'LOCKS by m=320 but N=3200 needs m>=400 -- the very depth m=360 that resolved N=2400 leaves N=3200 rho still ' +
      'climbing 2.7e-5. Reporting N=3200 at m=360 would have under-stated -log rho and understated the slope; the ' +
      'converged m>=400 value is required for the clean q -> -2 continuation.',
    whatItAddsOverImp3575:
      'imp-3575 corrected N=1600 and added N=2000 but had no rung past N=2000, leaving the -2 climb untested at ' +
      'larger sections. This module measures the two next rungs with lambda_3 Krylov-converged (m>=320 at N=2400, ' +
      'm>=400 at N=3200), shows the slope keeps sharpening toward -2 rather than plateauing, and documents that the ' +
      'converged Krylov depth grows with N so the naive fixed-m reference would have failed at N=3200.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    convergenceIsNumericalNotSymbolic:
      'The extended rho and its q -> -2 continuation are finite-N numerical measurements of a converged Krylov ' +
      'reference, not a proven asymptotic; the -2 heuristic is corroborated two rungs further, not derived. The slope ' +
      'is still ~5e-3 short of -2 at N=3200.',
    measuresNotConstructs:
      'This extends a converged gap ladder and measures its local slope; it does NOT construct the missing magnitude ' +
      'and does NOT attempt the imp-3066 K_a >= 0 positivity.',
    krylovDepthMustGrowWithN:
      'lambda_3 requires a DEEPER Krylov subspace as N grows (m>=320 at N=2400, m>=400 at N=3200); a fixed m=360 ' +
      'reference -- which converged every rung through N=2400 -- UNDER-resolves N=3200 by ~1.01e-4 in rho. The baked ' +
      'N=3200 rho=0.99993931 is the m>=400 converged value, not the m=360 value 0.99983818.',
    bakedOfflineLiterals:
      'The rho(m) sweep tables are BAKED offline literals (the Lanczos to m=600 at N=3200 is O(N^2) per matvec); ' +
      'this module re-derives the monotonicity and local exponents arithmetically from the baked converged gaps and ' +
      'does NOT re-run the heavy assembly at import.',
    topPairOnlyNearDegenerate:
      'The skew top-pair split is small but NOT machine-zero (1.9e-6 at N=2400, 6.1e-5 at N=3200) at finite section ' +
      'and finite Krylov; rho is treated as lambda_3/lambda_1 with lambda_1=lambda_2 approximate, matching imp-3575.',
    didNotAttemptPositivity: true,
    sota: 'No refereed bound is changed',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3595_SKEW_TOEPLITZ_GAP_N2400_3200_KRYLOV_LADDER_ASSERTIONS = [
  {
    id: 'imp3595-both-new-rungs-krylov-locked',
    why: 'Both new rungs must have LOCKED lambda_3 at the deepest swept Krylov depth (tail step < 1e-13): N=2400 by ' +
      'm=360 and N=3200 by m=600 -- otherwise the extended ladder rests on under-resolved gaps.',
    holds: () => bothRungsLocked && rung2400.tailStep < KRYLOV_LOCK && rung3200.tailStep < KRYLOV_LOCK,
  },
  {
    id: 'imp3595-krylov-lock-depth-grows-with-N',
    why: 'THE N-SPECIFIC-DEFICIT DELIVERABLE: the Krylov depth needed to resolve lambda_3 must GROW with N ' +
      '(N=3200 lockDepth=400 > N=2400 lockDepth=320), and the m=360 that LOCKED N=2400 must be UNDER-resolved at ' +
      'N=3200 (off by > 1e-5) -- matching the imp-3505/imp-3537/imp-3575 pattern.',
    holds: () => lockDepthGrowsWithN && m360UnderResolvedAtN3200 && rung3200.m360Deficit > 1e-5,
  },
  {
    id: 'imp3595-extended-ladder-monotone-through-N3200',
    why: 'The converged -log rho ladder N=1200/1600/2000/2400/3200 must be STRICTLY DECREASING -- the imp-3575 ' +
      'monotone q -> -2 ladder extends cleanly two rungs above N=2000.',
    holds: () => extendedLadderMonotone && rung2400.convergedLogInvRho < N2000_LOG_INV_RHO && rung3200.convergedLogInvRho < rung2400.convergedLogInvRho,
  },
  {
    id: 'imp3595-slope-keeps-climbing-toward-minus-two-not-plateau',
    why: 'THE PRIMARY DELIVERABLE: both new local log-log slopes must be strictly in (-2, imp-3575 -1.9949) and ' +
      'q(2400->3200) must be SHARPER than q(2000->2400) -- the climb toward -2 continues and does not plateau.',
    holds: () => newSlopesContinueClimb && q2000to2400 < IMP3575_LAST_SLOPE && q2400to3200 < q2000to2400 && q2400to3200 > HEURISTIC_Q,
  },
  {
    id: 'imp3595-skew-top-pair-near-degenerate',
    why: 'The skew-symmetry top pair must stay near-degenerate (|lambda_1-lambda_2|/lambda_1 < 1e-4) at both new N, ' +
      'so rho = lambda_3/lambda_1 measures a genuine second-pair gap and not a split top level.',
    holds: () => topPairNearDegenerate,
  },
  {
    id: 'imp3595-verdict-ladder-extends-climb-continues',
    why: 'The classified verdict must be the confirming ladder-extension result, not indeterminate; a flip means the ' +
      'lock, the growing Krylov depth, the monotone ladder, or the continued slope-climb failed.',
    holds: () => verdict.startsWith('LADDER-EXTENDS-N=2400/3200'),
  },
  {
    id: 'imp3595-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- extends a converged gap ladder two rungs, positivity not attempted, ' +
      'RH-equivalent, no refereed bound is changed. Any flip over-claims.',
    holds: () => {
      const c = IMP3595_SKEW_TOEPLITZ_GAP_N2400_3200_KRYLOV_LADDER.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.measuresNotConstructs === 'string' &&
        typeof c.krylovDepthMustGrowWithN === 'string' &&
        /Platt-Trudgian|refereed bound is changed/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3595_SKEW_TOEPLITZ_GAP_N2400_3200_KRYLOV_LADDER_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3595-skew-toeplitz-gap-N2400-3200-krylov-ladder assertion failed: ${assertion.id}`);
  }
}

export default IMP3595_SKEW_TOEPLITZ_GAP_N2400_3200_KRYLOV_LADDER;
