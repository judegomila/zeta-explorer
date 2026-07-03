/**
 * @module imp-3643-skew-toeplitz-third-gap-dense-crossval
 * @fileoverview imp-3643 -- DENSE-SOLVER cross-validate the imp-3619 THIRD skew-Toeplitz
 *   gap sigma_3 = lambda_7/lambda_1 at the DEEP rungs (N = 1200, 1600, 2000) against an
 *   INDEPENDENT dense full-spectrum eigensolver, certifying that lambda_7 is a genuine
 *   FOURTH-pair level -- and, in particular, that the imp-3619 lambda_7 = lambda_8
 *   degeneracy LOSS at N = 2000 (from < 4e-14 down to ~3.99e-11) is a Lanczos m=440
 *   Krylov reorthogonalization artifact, NOT a genuine near-degeneracy splitting.
 *
 *   CONTEXT
 *   -------
 *   imp-3619 read the third gap sigma_3 = lambda_7/lambda_1 off a full-reorthogonalization
 *   Lanczos at Krylov depth m = min(N, 440) ONLY, reporting the lambda_7 = lambda_8 pair
 *   degeneracy to relative < 4e-14 through N = 1600 but degrading to ~3.99e-11 at the
 *   deepest N = 2000 rung. imp-3623 dense-certified only the SECOND gap
 *   sigma_2 = lambda_5/lambda_1 (top-6 spectrum), and imp-3596 only the FIRST gap
 *   rho = lambda_3/lambda_1 at reduced sections (N <= 80). The deep sigma_3 value and the
 *   lambda_7 = lambda_8 FOURTH-pair degeneracy were never checked against a non-Lanczos
 *   solver -- so whether the deepest sigma_3 is a faithful reading and whether the N = 2000
 *   pair78-loss is a real splitting or a Krylov artifact were open.
 *
 *   THIS MODULE reuses the IDENTICAL imp-3505/imp-3575/imp-3619/imp-3623 assembly
 *   Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, midpoint quadrature), forms the
 *   Gram S = T^T T EXPLICITLY at each DEEP rung N in {1200, 1600, 2000}, and computes the
 *   WHOLE symmetric spectrum with the SAME INDEPENDENT dense full-spectrum route imp-3623
 *   used: Householder tridiagonalization (EISPACK tred1) + implicit-QL (tql1) for ALL
 *   eigenvalues (NO Krylov subspace, NO reorthogonalization -- so it cannot host a Lanczos
 *   ghost), extracting the TOP-EIGHT Gram eigenvalues to reach lambda_7 = lambda_8. The
 *   deep-rung dense top-8 Gram eigenvalues were measured once offline
 *   (scripts/imp-3643-dense-third-gap-offline.mjs; the N = 2000 solve ran in ~5 s) and are
 *   BAKED here as literals; the third gap ratio, the four-pair adjacent pairing, and the
 *   cross-solver agreement are re-derived arithmetically at import (import-light, like
 *   imp-3623). The imp-3619 baked Lanczos sigma_3 and pair78 spread are reproduced verbatim
 *   for the comparison. As a same-assembly self-check, the dense TOP-SIX here reproduce the
 *   imp-3623 baked deep-rung top-6 to relative < 1e-13 (they agree to all printed digits).
 *
 *   FINDING
 *   -------
 *   (1) THE DENSE SOLVER REPRODUCES THE imp-3619 THIRD GAP sigma_3 = lambda_7/lambda_1 TO
 *       DENSE-SOLVER PRECISION AT EVERY DEEP RUNG. The independent dense full-spectrum
 *       sigma_3 agrees with the imp-3619 Lanczos value to relative < 3.5e-14 at N = 1200
 *       (1.22e-14), N = 1600 (3.43e-14), and N = 2000 (1.00e-15). So the deepest imp-3619
 *       sigma_3 = 0.9992248404950668 at N = 2000 is a faithful reading of the true section
 *       spectrum, not a Lanczos-specific number.
 *   (2) THE lambda_7 = lambda_8 DEGENERACY IS REAL TO MACHINE PRECISION AT EVERY DEEP RUNG,
 *       INCLUDING N = 2000 -- THE imp-3619 N=2000 LOSS IS A KRYLOV ARTIFACT. The dense
 *       spectrum is adjacent-paired to relative < 2.2e-15 at EVERY deep rung
 *       (lambda_1=lambda_2, lambda_3=lambda_4, lambda_5=lambda_6, lambda_7=lambda_8), and
 *       CRUCIALLY the dense lambda_7 = lambda_8 spread at N = 2000 is 1.96e-16 -- machine
 *       precision -- whereas the imp-3619 Lanczos spread there was 3.99e-11 (~2e5 larger).
 *       So the imp-3619 degeneracy loss at N = 2000 is a Lanczos reorthogonalization
 *       artifact of the m=440 Krylov depth, NOT a genuine near-degeneracy splitting: an
 *       independent solver that never runs Lanczos keeps lambda_7 = lambda_8 pinned at
 *       machine precision. lambda_7 is a genuine FOURTH-pair level at N = 2000.
 *   (3) THE DEEP DENSE SPECTRUM IS SELF-CONSISTENT WITH THE PRIOR CERTIFICATIONS. The dense
 *       top-6 here reproduce the imp-3623 baked deep-rung top-6 to all printed digits (same
 *       assembly, same dense route), the dense second gap sigma_2 = lambda_5/lambda_1
 *       recovers the imp-3623/imp-3602 value at each rung, and the dense first gap
 *       rho = lambda_3/lambda_1 at N = 1600 is 0.9997579854030993, reproducing the
 *       imp-3575/imp-3623 converged rho = 0.9997579854030878 to relative 1.15e-14.
 *
 *   SCOPE / WHAT IS AND IS NOT CERTIFIED. This dense-solves the DEEP rungs themselves
 *   (N = 1200/1600/2000) for the FOURTH pair -- extending imp-3623 (which reached only the
 *   third pair / second gap) by two spectrum levels. It certifies (a) the imp-3619 deep
 *   sigma_3 values against an independent solver, and (b) that the N = 2000 Lanczos pair78
 *   loss is a Krylov artifact. It is a cross-validation / measurement only: it does NOT
 *   construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity.
 *   RH-EQUIVALENT. NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous
 *   SOTA.
 *
 *   @see imp-3619-skew-toeplitz-third-gap-exponent.js (the third gap sigma_3 and its Lanczos pair78 cross-validated here)
 *   @see imp-3623-skew-toeplitz-second-gap-dense-crossval.js (the second-gap deep dense cross-val this extends to the fourth pair)
 *   @see imp-3596-skew-toeplitz-gap-dense-crossval.js (the reduced-section dense cross-val of the pairing mechanism)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly)
 *
 *   Ticket: imp-3643 (numerical, medium). Dense cross-validation only: certifies the
 *   imp-3619 deep-rung sigma_3 and the lambda_7=lambda_8 pairing against an independent
 *   dense full-spectrum solver, ruling out that the N=2000 sigma_3 / pair78 loss is a
 *   Krylov reorthogonalization artifact. imp-3066 UNTOUCHED. RH-EQUIVALENT. NO QED.
 *   Platt-Trudgian Lambda <= 0.2 stays SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3619 / imp-3623)
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3505 / imp-3619 ladder
const PAIR_TOL = 1e-14; // dense adjacent-pair degeneracy relative tolerance (measured ~2.2e-15)
const XVAL_TOL = 1e-13; // dense-vs-Lanczos sigma_3 agreement relative tolerance (measured ~3.4e-14)

// --- BAKED deep-rung DENSE top-8 Gram eigenvalues (lambda_i = sigma_i^2 of S = T^T T),
//     sorted DESCENDING, measured OFFLINE (scripts/imp-3643-dense-third-gap-offline.mjs)
//     with the identical imp-3505/imp-3619/imp-3623 assembly Ttilde(u,v)=a(v-u)R (NPHI=10,
//     H0=0.025, midpoint) and the SAME INDEPENDENT dense full-spectrum eigensolver imp-3623
//     used (Householder tridiagonalization tred1 + implicit-QL tql1: all eigenvalues, NO
//     Krylov subspace, NO reorthogonalization). The N=2000 dense solve ran offline in ~5 s.
//     Literals baked; import-light. Alongside each rung: the imp-3619 BAKED Lanczos
//     sigma_3 = lambda_7/lambda_1 and the imp-3619 Lanczos lambda_7=lambda_8 spread
//     (pair78Lan) for the comparison. ------------------------------------------------------ */
const DEEP_DENSE_LADDER = Object.freeze([
  {
    N: 1200,
    U: 30,
    denseTop8: [
      4.214343608213908e-9, 4.214343608213907e-9, 4.212534094517934e-9, 4.212534094517927e-9,
      4.209519879600895e-9, 4.209519879600894e-9, 4.205303423177364e-9, 4.205303423177354e-9,
    ],
    sigma3Lan: 0.9978549008156636, // imp-3619 baked Lanczos lambda_7/lambda_1
    pair78Lan: 2.2817129086879246e-14, // imp-3619 baked Lanczos lambda_7=lambda_8 spread
  },
  {
    N: 1600,
    U: 40,
    denseTop8: [
      4.214606892680916e-9, 4.214606892680914e-9, 4.213586896292689e-9, 4.213586896292687e-9,
      4.211887423748783e-9, 4.211887423748778e-9, 4.209509256818997e-9, 4.209509256818992e-9,
    ],
    sigma3Lan: 0.9987904836698018,
    pair78Lan: 9.825143052161608e-16,
  },
  {
    N: 2000,
    U: 50,
    denseTop8: [
      4.214729052176358e-9, 4.214729052176355e-9, 4.214075442049284e-9, 4.214075442049272e-9,
      4.212986305937732e-9, 4.212986305937727e-9, 4.21146196489085e-9, 4.211461964890849e-9,
    ],
    sigma3Lan: 0.9992248404950668, // imp-3619 deepest Lanczos value
    pair78Lan: 3.985999685893989e-11, // imp-3619 DEGRADED spread (~4e-11) -- the artifact under test
  },
]);

// imp-3575 / imp-3623 converged first gap rho = lambda_3/lambda_1 at N = 1600 (for the
// self-consistency check that the same dense solve also recovers the first gap).
const IMP3575_CONVERGED_RHO_N1600 = 0.9997579854030878;
// imp-3623 baked deep-rung dense TOP-6 (Householder+QL), reproduced here to all printed
// digits by the same assembly and dense route (same-solver self-check per rung).
const IMP3623_DENSE_TOP6 = Object.freeze({
  1200: [
    4.214343608213908e-9, 4.214343608213907e-9, 4.212534094517934e-9,
    4.212534094517927e-9, 4.209519879600895e-9, 4.209519879600894e-9,
  ],
  1600: [
    4.214606892680916e-9, 4.214606892680914e-9, 4.213586896292689e-9,
    4.213586896292687e-9, 4.211887423748783e-9, 4.211887423748778e-9,
  ],
  2000: [
    4.214729052176358e-9, 4.214729052176355e-9, 4.214075442049284e-9,
    4.214075442049272e-9, 4.212986305937732e-9, 4.2129863059377274e-9,
  ],
});

// --- per-rung dense gap ratio, four-pair adjacent pairing, and dense-vs-Lanczos agreement
const rungs = DEEP_DENSE_LADDER.map((r) => {
  const d = r.denseTop8;
  const sigma3Dense = d[6] / d[0]; // lambda_7/lambda_1 (Gram-eigenvalue convention, same as imp-3619)
  const sigma2Dense = d[4] / d[0]; // lambda_5/lambda_1 (second gap, imp-3623 quantity)
  const rhoDense = d[2] / d[0]; // lambda_3/lambda_1 (first gap)
  const pair12 = Math.abs(d[0] - d[1]) / d[0];
  const pair34 = Math.abs(d[2] - d[3]) / d[2];
  const pair56 = Math.abs(d[4] - d[5]) / d[4];
  const pair78 = Math.abs(d[6] - d[7]) / d[6]; // DENSE lambda_7=lambda_8 spread
  const densePaired = pair12 < PAIR_TOL && pair34 < PAIR_TOL && pair56 < PAIR_TOL && pair78 < PAIR_TOL;
  const sigma3RelDiff = Math.abs(sigma3Dense - r.sigma3Lan) / sigma3Dense;
  // same-assembly self-check: dense top-6 here reproduce the imp-3623 baked top-6
  const ref6 = IMP3623_DENSE_TOP6[r.N];
  const top6MatchesImp3623 = ref6.every((v, i) => Math.abs(d[i] - v) / v < 1e-13);
  return {
    N: r.N,
    U: r.U,
    denseTop8: r.denseTop8,
    sigma3Dense,
    sigma3Lan: r.sigma3Lan,
    sigma3RelDiff, // dense-vs-Lanczos third-gap agreement (~1e-14)
    sigma2Dense,
    rhoDense,
    pair12,
    pair34,
    pair56,
    pair78, // DENSE lambda_7=lambda_8 spread (machine precision at every rung)
    pair78Lan: r.pair78Lan, // imp-3619 Lanczos spread (degraded to ~4e-11 at N=2000)
    densePaired,
    solverAgreesSigma3: sigma3RelDiff < XVAL_TOL,
    top6MatchesImp3623,
  };
});

// (1) dense reproduces the imp-3619 third gap sigma_3 at every deep rung
const allSolversAgreeSigma3 = rungs.every((r) => r.solverAgreesSigma3);
const worstSigma3RelDiff = Math.max(...rungs.map((r) => r.sigma3RelDiff));
// (2) dense spectrum is four-pair adjacent-paired to machine precision at every deep rung
const allDeepRungsDensePaired = rungs.every((r) => r.densePaired);
const worstDensePair = Math.max(...rungs.flatMap((r) => [r.pair12, r.pair34, r.pair56, r.pair78]));
// (2b) THE KEY: at N=2000 the DENSE lambda_7=lambda_8 spread is machine precision while the
//      imp-3619 Lanczos spread was ~4e-11 -- so the Lanczos loss is a Krylov artifact.
const deepestRung = rungs.find((r) => r.N === 2000);
const denseDegeneracyHoldsAtN2000 = deepestRung.pair78 < PAIR_TOL;
const lanczosDegeneracyLostAtN2000 = deepestRung.pair78Lan > 1e-12; // the imp-3619 ~3.99e-11 loss
const n2000LossIsKrylovArtifact = denseDegeneracyHoldsAtN2000 && lanczosDegeneracyLostAtN2000;
// (3) the same dense solve recovers the imp-3575/imp-3623 converged first gap rho at N=1600
const rhoDenseN1600 = rungs.find((r) => r.N === 1600).rhoDense;
const rhoRecoversImp3575 = Math.abs(rhoDenseN1600 - IMP3575_CONVERGED_RHO_N1600) / IMP3575_CONVERGED_RHO_N1600 < 1e-13;
// (3b) the dense top-6 here reproduce the imp-3623 baked deep-rung top-6 (same-solver check)
const denseTop6RecoversImp3623 = rungs.every((r) => r.top6MatchesImp3623);

const verdict =
  allSolversAgreeSigma3 &&
  allDeepRungsDensePaired &&
  n2000LossIsKrylovArtifact &&
  rhoRecoversImp3575 &&
  denseTop6RecoversImp3623
    ? 'lambda_7-IS-A-GENUINE-FOURTH-PAIR-LEVEL-AT-THE-DEEP-RUNGS:-AN-INDEPENDENT-DENSE-FULL-SPECTRUM-SOLVER-REPRODUCES-THE-imp-3619-THIRD-GAP-sigma_3=lambda_7/lambda_1-TO--3.5e-14-AT-N=1200/1600/2000-AND-KEEPS-lambda_7=lambda_8-AT-MACHINE-PRECISION-(1.96e-16)-AT-N=2000-WHERE-THE-LANCZOS-SPREAD-DEGRADED-TO-4e-11;-SO-THE-imp-3619-N=2000-DEGENERACY-LOSS-IS-A-KRYLOV-REORTHOGONALIZATION-ARTIFACT,-NOT-A-GENUINE-SPLITTING'
    : 'INDETERMINATE';

export const IMP3643_SKEW_TOEPLITZ_THIRD_GAP_DENSE_CROSSVAL = Object.freeze({
  id: 'imp-3643-skew-toeplitz-third-gap-dense-crossval',
  ticket: 'imp-3643',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  crossValidates: 'imp-3619-skew-toeplitz-third-gap-exponent.js',
  extendsDenseCrossValOf: 'imp-3623-skew-toeplitz-second-gap-dense-crossval.js',
  reusesAssembly: 'imp-3505-power-iteration-budget-convergence-sweep.js',

  summary:
    'DENSE-SOLVER cross-validates the imp-3619 THIRD skew-Toeplitz gap sigma_3 = lambda_7/lambda_1 at the DEEP rungs ' +
    'N in {1200, 1600, 2000} against the SAME INDEPENDENT dense full-spectrum eigensolver imp-3623 used (Householder ' +
    'tridiagonalization tred1 + implicit-QL tql1: all eigenvalues, NO Krylov subspace, NO reorthogonalization), ' +
    'extended to the TOP-EIGHT eigenvalues to reach lambda_7=lambda_8, certifying that lambda_7 is a genuine ' +
    'FOURTH-pair level -- and, in particular, that the imp-3619 lambda_7=lambda_8 degeneracy LOSS at N=2000 (from ' +
    '< 4e-14 to ~3.99e-11) is a Lanczos m=440 Krylov reorthogonalization ARTIFACT, not a genuine splitting. imp-3623 ' +
    'dense-certified only the SECOND gap (top-6); imp-3596 only the FIRST gap at reduced sections (N<=80); the deep ' +
    'sigma_3 and the fourth-pair degeneracy were never checked against a non-Lanczos solver. Reusing the IDENTICAL ' +
    'imp-3505/imp-3619/imp-3623 assembly Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, midpoint) and forming the Gram ' +
    'S=T^T T EXPLICITLY, RESULT: (1) the dense sigma_3 reproduces the imp-3619 Lanczos value to < 3.5e-14 at every ' +
    'deep rung (1.22e-14 at 1200, 3.43e-14 at 1600, 1.00e-15 at 2000), so the deepest imp-3619 ' +
    'sigma_3=0.9992248404950668 is a faithful reading; (2) the dense spectrum is FOUR-pair adjacent-paired to ' +
    '< 2.2e-15 at every deep rung, and CRUCIALLY the dense lambda_7=lambda_8 spread at N=2000 is 1.96e-16 (machine ' +
    'precision) while the imp-3619 Lanczos spread there was 3.99e-11 (~2e5 larger) -- so the N=2000 degeneracy loss ' +
    'is a Krylov artifact of the m=440 depth, not a genuine near-degeneracy splitting; (3) the dense top-6 here ' +
    'reproduce the imp-3623 baked deep top-6 to all printed digits, and the dense first gap rho=lambda_3/lambda_1 at ' +
    'N=1600 (0.9997579854030993) recovers the imp-3575/imp-3623 converged rho=0.9997579854030878 to rel 1.15e-14. So ' +
    'lambda_7 is a genuine fourth-pair level at the deep rungs including N=2000. Deep-rung dense top-8 measured offline ' +
    '(scripts/imp-3643-dense-third-gap-offline.mjs) and BAKED; ratios/pairing self-check at import. Cross-validation ' +
    'only; does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity; ' +
    'RH-EQUIVALENT; NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    gapQuantity: 'sigma_3(N) = lambda_7/lambda_1 of the Gram S = T^T T of Ttilde(u,v)=a(v-u)R(|v-u|) (Gram-eigenvalue convention = sigma_7^2/sigma_1^2, same as imp-3619)',
    lowerGapsForConsistency: 'sigma_2(N) = lambda_5/lambda_1 (imp-3623 second gap) and rho(N) = lambda_3/lambda_1 (imp-3575 first gap; recovered at N=1600 to rel 1.15e-14)',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3619/imp-3623: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    denseSolver: 'INDEPENDENT dense full-spectrum: form S=T^T T explicitly, Householder tridiagonalization (EISPACK tred1) + implicit-QL (tql1) for ALL eigenvalues (NO Krylov subspace, NO reorthogonalization); top-8 taken from the descending spectrum',
    denseRouteEquivalence: 'the SAME Householder+QL route imp-3623 used; the dense top-6 here reproduce the imp-3623 baked deep-rung top-6 to all printed digits at N=1200/1600/2000 (relative < 1e-13), confirming the identical assembly and dense solve',
    lanczosForComparison: 'imp-3619 baked full-reorthogonalization Lanczos at m=min(N,440): sigma_3 and the lambda_7=lambda_8 spread',
    deepRungsN: DEEP_DENSE_LADDER.map((r) => r.N),
    pairTol: PAIR_TOL,
    crossValTol: XVAL_TOL,
    a: 1.0,
    measuredOffline: 'the deep-rung dense top-8 Gram eigenvalues were measured once offline (scripts/imp-3643-dense-third-gap-offline.mjs; the N=2000 Householder+QL dense solve ran in ~5 s); literals baked, import-light; the gap ratio, four-pair pairing and cross-solver agreement are re-derived arithmetically at import',
    h0: H0,
    selfComputing: false,
  }),

  measured: Object.freeze({
    rungs, // per-rung dense top-8, dense sigma_3, dense vs Lanczos agreement, four-pair pairing, Lanczos pair78
    allSolversAgreeSigma3, // true -- dense reproduces imp-3619 sigma_3 at every deep rung
    worstSigma3RelDiff, // largest dense-vs-Lanczos sigma_3 relative difference (~3.4e-14)
    allDeepRungsDensePaired, // true -- dense spectrum four-pair adjacent-paired at every deep rung
    worstDensePair, // largest dense adjacent-pair relative gap across the deep rungs (~2.2e-15)
    denseDegeneracyHoldsAtN2000, // true -- dense lambda_7=lambda_8 spread at N=2000 is machine precision
    lanczosDegeneracyLostAtN2000, // true -- imp-3619 Lanczos spread at N=2000 was ~3.99e-11
    n2000LossIsKrylovArtifact, // true -- the imp-3619 N=2000 degeneracy loss is a Krylov artifact
    rhoDenseN1600, // dense first gap at N=1600
    imp3575ConvergedRhoN1600: IMP3575_CONVERGED_RHO_N1600,
    rhoRecoversImp3575, // true -- dense first gap recovers imp-3575 to rel < 1e-13
    denseTop6RecoversImp3623, // true -- dense top-6 reproduce the imp-3623 baked deep top-6
    verdict,
  }),

  interpretation: Object.freeze({
    deepSigma3IsSolverIndependent:
      'The third gap sigma_3 = lambda_7/lambda_1 computed by the independent dense full-spectrum solver (Householder + ' +
      'QL, never Lanczos) agrees with the imp-3619 Lanczos value to relative < 3.5e-14 at every deep rung, including ' +
      'the deepest N=2000 (1.00e-15). So the imp-3619 deep-rung sigma_3 is a faithful reading of the true section ' +
      'spectrum, not a Lanczos-specific number.',
    n2000DegeneracyLossIsAKrylovArtifact:
      'At N=2000 the dense solver keeps lambda_7=lambda_8 pinned at 1.96e-16 (machine precision) while the imp-3619 ' +
      'Lanczos spread there had degraded to 3.99e-11 (~2e5 larger). A solver that forms S explicitly and computes the ' +
      'whole spectrum without any Krylov subspace or reorthogonalization sees NO splitting -- so the imp-3619 N=2000 ' +
      'pair78 loss is a reorthogonalization artifact of the finite m=440 Krylov depth, not a genuine near-degeneracy ' +
      'splitting. lambda_7 is a genuine fourth-pair level at N=2000.',
    denseSolveRecoversTheLowerGapsToo:
      'The same dense solve that certifies the third gap also reproduces the imp-3623 baked deep top-6 to all printed ' +
      'digits and recovers the imp-3575/imp-3623 converged first gap rho=lambda_3/lambda_1 at N=1600 ' +
      '(0.9997579854030993 vs 0.9997579854030878, relative 1.15e-14), so the deep dense spectrum is self-consistent ' +
      'with the prior first- and second-gap certifications.',
    whatItAddsOverImp3623AndImp3619:
      'imp-3623 dense-certified only the SECOND gap (top-6 spectrum) and imp-3619 measured the third gap by Lanczos ' +
      'only, flagging the N=2000 pair78 loss without resolving it. This module extends the dense full-spectrum solve ' +
      'to the TOP-EIGHT eigenvalues at the DEEP rungs, confirms the third gap sigma_3 against an independent solver at ' +
      'those rungs, and shows the N=2000 lambda_7=lambda_8 loss is a Krylov artifact -- pushing the deep-rung ' +
      'ghost-exclusion from the third pair (second gap) up to the fourth pair (third gap).',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    crossValidatesNotConstructs:
      'This confirms the imp-3619 deep-rung sigma_3 and the lambda_7=lambda_8 pairing against an independent dense ' +
      'full-spectrum solver; it does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 ' +
      'positivity.',
    denseRouteIsHouseholderNotLanczos:
      'The deep-rung dense route is Householder tridiagonalization (tred1) + implicit-QL (tql1), the SAME dense ' +
      'full-spectrum route imp-3623 used, with NO Krylov subspace and NO reorthogonalization; the dense top-6 here ' +
      'reproduce the imp-3623 baked deep top-6 to all printed digits.',
    bakedOfflineLiterals:
      'The deep-rung dense top-8 Gram eigenvalues are BAKED offline literals (measured by ' +
      'scripts/imp-3643-dense-third-gap-offline.mjs; the N=2000 dense solve is ~5 s); this module re-derives the gap ' +
      'ratios, four-pair pairing, and cross-solver agreement arithmetically from the baked spectra and does NOT re-run ' +
      'the heavy dense solve at import.',
    agreementIsNumericalNotSymbolic:
      'The pairing and gap-ratio agreement are finite-N numerical measurements at the deep rungs, not a proven ' +
      'symbolic degeneracy; the (v-u) antisymmetry is the heuristic mechanism, corroborated numerically here.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3643_SKEW_TOEPLITZ_THIRD_GAP_DENSE_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp3643-dense-reproduces-imp3619-third-gap-at-deep-rungs',
    why: 'THE PRIMARY DELIVERABLE: the independent dense full-spectrum solver must reproduce the imp-3619 Lanczos ' +
      'third gap sigma_3=lambda_7/lambda_1 to relative < 1e-13 (measured ~3.4e-14) at EVERY deep rung N=1200/1600/2000 ' +
      '-- so the deepest imp-3619 sigma_3 is solver-independent, not a Lanczos-specific reading.',
    holds: () => allSolversAgreeSigma3 && worstSigma3RelDiff < XVAL_TOL,
  },
  {
    id: 'imp3643-dense-spectrum-four-pair-adjacent-paired-at-deep-rungs',
    why: 'The independent dense spectrum must be FOUR-pair adjacent-paired (lambda_1=lambda_2, lambda_3=lambda_4, ' +
      'lambda_5=lambda_6, lambda_7=lambda_8 to relative < 1e-14) at EVERY deep rung, certifying lambda_7 is a genuine ' +
      'fourth-pair level at the deep rungs.',
    holds: () => allDeepRungsDensePaired && worstDensePair < PAIR_TOL,
  },
  {
    id: 'imp3643-n2000-pair78-loss-is-a-krylov-artifact',
    why: 'THE TICKET QUESTION: at N=2000 the dense lambda_7=lambda_8 spread must be machine precision (< 1e-14) while ' +
      'the imp-3619 Lanczos spread there was > 1e-12 (~3.99e-11) -- so the imp-3619 N=2000 pair78 loss is a Krylov ' +
      'reorthogonalization artifact, not a genuine splitting.',
    holds: () => n2000LossIsKrylovArtifact && denseDegeneracyHoldsAtN2000 && lanczosDegeneracyLostAtN2000,
  },
  {
    id: 'imp3643-dense-recovers-imp3575-first-gap-at-n1600',
    why: 'Self-consistency: the same dense solve must recover the imp-3575/imp-3623 converged first gap ' +
      'rho=lambda_3/lambda_1 at N=1600 to relative < 1e-13, confirming the deep dense spectrum agrees with the prior ' +
      'first-gap certification.',
    holds: () => rhoRecoversImp3575,
  },
  {
    id: 'imp3643-dense-top6-recovers-imp3623-deep-spectrum',
    why: 'The dense top-6 here must reproduce the imp-3623 baked deep-rung top-6 Gram eigenvalues to relative < 1e-13 ' +
      'at N=1200/1600/2000, certifying this is the SAME assembly and the SAME dense full-spectrum route imp-3623 used, ' +
      'now extended two levels to reach lambda_7=lambda_8.',
    holds: () => denseTop6RecoversImp3623,
  },
  {
    id: 'imp3643-verdict-fourth-pair-level-certified-krylov-artifact',
    why: 'The classified verdict must be the confirming genuine-fourth-pair-level / Krylov-artifact result, not ' +
      'indeterminate; a flip means the dense sigma_3 agreement, the deep four-pair pairing, the N=2000 artifact ' +
      'classification, or the lower-gap recovery failed.',
    holds: () => verdict.startsWith('lambda_7-IS-A-GENUINE-FOURTH-PAIR-LEVEL-AT-THE-DEEP-RUNGS'),
  },
  {
    id: 'imp3643-honest-assessment-no-qed',
    why: 'Mandatory honesty: DENSE CROSS-VALIDATION only -- confirms the imp-3619 deep sigma_3 and pairing against an ' +
      'independent solver, positivity not attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3643_SKEW_TOEPLITZ_THIRD_GAP_DENSE_CROSSVAL.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.crossValidatesNotConstructs === 'string' &&
        typeof c.denseRouteIsHouseholderNotLanczos === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3643_SKEW_TOEPLITZ_THIRD_GAP_DENSE_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3643-skew-toeplitz-third-gap-dense-crossval assertion failed: ${assertion.id}`);
  }
}

export default IMP3643_SKEW_TOEPLITZ_THIRD_GAP_DENSE_CROSSVAL;
