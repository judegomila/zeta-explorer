/**
 * @module imp-3619-skew-toeplitz-third-gap-exponent
 * @fileoverview imp-3619 -- MEASURE the THIRD skew-Toeplitz gap
 *   sigma_3(N) = lambda_7/lambda_1 (the fourth-pair / first-pair Gram-Ritz ratio)
 *   across N = 160..2000 and TEST the imp-3602 empirical amplitude law
 *   a_j proportional to (j^2 - 1): does the fourth-pair / second-pair -log ratio
 *   -log sigma_3 / -log rho tend to a_4/a_2 = (16-1)/(4-1) = 5?
 *
 *   CONTEXT
 *   -------
 *   imp-3602 measured the SECOND gap sigma_2 = lambda_5/lambda_1 (third-pair /
 *   first-pair Gram-Ritz ratio), found it converges to the SAME -2 section-gap
 *   exponent as the first gap rho = lambda_3/lambda_1, and reported the near-constant
 *   ratio -log sigma_2 / -log rho ~ 8/3 as the signature of a common N^-2 law with a
 *   pair-index amplitude a_j proportional to (j^2 - 1) (giving a_3/a_2 = 8/3). That
 *   law was flagged EMPIRICAL, not derived, and tested only through pair j = 3. The
 *   next prediction of the same law is a_4/a_2 = (16-1)/(4-1) = 5 for the FOURTH pair
 *   (lambda_7 = lambda_8), which imp-3602 did not test.
 *
 *   THIS MODULE re-runs the IDENTICAL imp-3505/imp-3575/imp-3602 assembly
 *   Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, midpoint quadrature) and a
 *   symmetric Lanczos with FULL reorthogonalization at converged Krylov depth
 *   m = min(N, 440), extracting the TOP-EIGHT Gram Ritz values at each rung of the
 *   imp-3555 ladder N in {160, 240, 320, 400, 480, 640, 800, 1000, 1200, 1600, 2000}.
 *   From those it forms the THIRD gap in the SAME Gram-eigenvalue convention
 *   (lambda_i = Ritz eigenvalue of S = T^T T = sigma_i^2):
 *     sigma_3(N) = lambda_7(N) / lambda_1(N).
 *   The measurement ran once offline; the per-rung sigma_3 and -log sigma_3 literals
 *   are BAKED so this module stays import-light and the exponent/ratio arithmetic is
 *   self-checking. The second-gap -log sigma_2 and first-gap -log rho literals are the
 *   imp-3602 baked ladder, reproduced here to < 3e-12 by the same assembly (a
 *   cross-check that the third gap is read off the SAME converged spectrum).
 *
 *   FINDING
 *   -------
 *   (1) THE THIRD GAP ALSO CONVERGES TO THE -2 HEURISTIC. The local pairwise log-log
 *       exponent of -log sigma_3(N) climbs MONOTONICALLY toward -2 from above --
 *       -1.9568 (160->240), -1.9686 (240->320), ..., -1.9933 (1200->1600),
 *       -1.9948 (1600->2000) -- essentially INDISTINGUISHABLE from the first-gap
 *       exponents at every step (they agree to < 3e-3, both reaching -1.9948 at
 *       1600->2000). The global log-log fit gives q_3 = -1.9817 (R^2 = 0.99999),
 *       versus the first-gap q_1 = -1.9811 (R^2 = 0.99999): the -2 section-gap
 *       heuristic governs the THIRD gap just as cleanly, so it is a property of the
 *       FULL leading spectrum, not only of the first two gaps.
 *   (2) THE j^2-1 AMPLITUDE LAW HOLDS THROUGH PAIR j = 4. The ratio
 *       -log sigma_3(N) / -log rho(N) is nearly CONSTANT across the whole ladder and
 *       tends CLEANLY to 5 (5.0107 at N=160 down to 5.00008 at N=2000, mean 5.0022),
 *       matching the a_j proportional to (j^2 - 1) prediction a_4/a_2 = (16-1)/(4-1)
 *       = 5 to 8e-5 at the finest rung. As a second, independent check of the same
 *       law, -log sigma_3 / -log sigma_2 tends to 1.87502 at N=2000, matching
 *       a_4/a_3 = 15/8 = 1.875. So the imp-3602 j^2-1 amplitude ordering, previously
 *       tested only to j = 3 (a single ratio 8/3), is now corroborated at j = 4 by
 *       two independent pair-ratios. (Still reported as an EMPIRICAL structural
 *       observation, not a derived law.)
 *   (3) lambda_7 IS A GENUINE FOURTH-PAIR LEVEL. The lambda_7 = lambda_8 pair
 *       degeneracy holds to relative < 4e-14 at every rung through N = 1600 (< 4e-11
 *       at the deepest gap N = 2000), matching the imp-3596/imp-3602 adjacent-paired
 *       certification -- so lambda_7 is the top of the FOURTH degenerate pair, a real
 *       level, not a Lanczos reorthogonalization ghost.
 *
 *   @see imp-3602-skew-toeplitz-second-gap-exponent.js (the second gap sigma_2=lambda_5/lambda_1 and the j^2-1 law this tests at j=4)
 *   @see imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js (the first gap rho=lambda_3/lambda_1 whose -2 exponent this extends)
 *   @see imp-3555-skew-toeplitz-gap-exponent-convergence.js (the N=160..1600 ladder and the -2 heuristic)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly + Lanczos routine)
 *
 *   Ticket: imp-3619 (numerical, medium). MEASUREMENT ONLY: measures the third gap
 *   exponent across the ladder and confirms the imp-3602 j^2-1 amplitude law at
 *   pair j = 4. Does NOT construct the missing magnitude and does NOT attempt the
 *   imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. NO RH verdict, NO QED. Platt-Trudgian
 *   Lambda <= 0.2 remains the rigorous SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3575 / imp-3602)
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3505 / imp-3602 ladder
const HEURISTIC_Q = -2; // the skew-Toeplitz section-gap heuristic exponent
const KRYLOV_LOCK = 2e-13; // sigma_3 change vs the m=400 sub-block below this = converged

// --- BAKED third-gap ladder. Per rung: sigma_3 = lambda_7/lambda_1 (Gram Ritz-value
//     ratio, i.e. sigma_7^2/sigma_1^2 -- the SAME eigenvalue convention imp-3575/imp-3602
//     used for rho=lambda_3/lambda_1 and sigma_2=lambda_5/lambda_1), its -log, the
//     imp-3602 baked SECOND-gap -log sigma_2 and FIRST-gap -log rho for comparison
//     (both reproduced here to < 3e-12 by the same assembly), the lambda_7=lambda_8
//     pair-degeneracy relative gap, and the Krylov lock residual (sigma_3 vs the m=400
//     tridiagonal sub-block). Measured offline with the identical imp-3505/imp-3575/imp-3602
//     assembly at Krylov depth m=min(N,440); literals baked, import-light. --------------- */
const THIRD_GAP_LADDER = Object.freeze([
  { N: 160, U: 4, sigma3: 0.8911698710028455, logInvSigma3: 0.11522021760361348, logInvSigma2: 0.06137468003985359, logInvRho1: 0.022994794497539755, pair78: 0, lockResidual: 0 },
  { N: 240, U: 6, sigma3: 0.9492202272047147, logInvSigma3: 0.052114444908097565, logInvSigma2: 0.027778273090528532, logInvRho1: 0.010412511115177478, pair78: 1.2655460294400305e-14, lockResidual: 0 },
  { N: 320, U: 8, sigma3: 0.9708524304507964, logInvSigma3: 0.02958079911915366, logInvSigma2: 0.015771170123876705, logInvRho1: 0.005912775566738924, pair78: 1.924130020523829e-14, lockResidual: 0 },
  { N: 400, U: 10, sigma3: 0.9811434239954381, logInvSigma3: 0.019036628273007866, logInvSigma2: 0.010150676343677334, logInvRho1: 0.0038059150436303684, pair78: 9.813472541363257e-15, lockResidual: 0 },
  { N: 480, U: 12, sigma3: 0.9868184074825985, logInvSigma3: 0.0132692407893222, logInvSigma2: 0.007075858864687542, logInvRho1: 0.0026531601039626557, pair78: 1.0350429874848683e-14, lockResidual: 0 },
  { N: 640, U: 16, sigma3: 0.9925288808322003, logInvSigma3: 0.00749916776889671, logInvSigma2: 0.003999212879991317, logInvRho1: 0.0014996127973944844, pair78: 3.7191184603481235e-14, lockResidual: 5.928590951498336e-14 },
  { N: 800, U: 20, sigma3: 0.9951983935199348, logInvSigma3: 0.004813171226886281, logInvSigma2: 0.0025668828768265323, logInvRho1: 0.0009625430796918385, pair78: 3.609848670112236e-14, lockResidual: 1.0436096431476471e-14 },
  { N: 1000, U: 25, sigma3: 0.9969172522407009, logInvSigma3: 0.003087509214267233, logInvSigma2: 0.0016466131266931645, logInvRho1: 0.0006174642590511195, pair78: 2.1067950332174918e-14, lockResidual: 1.4876988529977098e-14 },
  { N: 1200, U: 30, sigma3: 0.9978549008156636, logInvSigma3: 0.002147403205083366, logInvSigma2: 0.0011452533976152068, logInvRho1: 0.0004294624385316425, pair78: 2.2817129086879246e-14, lockResidual: 1.1879386363489175e-14 },
  { N: 1600, U: 40, sigma3: 0.9987904836698018, logInvSigma3: 0.0012102483854227106, logInvSigma2: 0.0006454567995726084, logInvRho1: 0.00024204388718173853, pair78: 9.825143052161608e-16, lockResidual: 1.9761969838327786e-14 },
  { N: 2000, U: 50, sigma3: 0.9992248404950668, logInvSigma3: 0.0007754600964098744, logInvSigma2: 0.00041357501754696113, logInvRho1: 0.00015508964024853381, pair78: 3.985999685893989e-11, lockResidual: 2.6645352591003757e-15 },
]);

// --- ordinary least-squares log-log fit -log y = A N^q (imp-3602 verbatim) -----------
function powerLawFit(pts) {
  const n = pts.length;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (const p of pts) {
    const x = Math.log(p.N);
    const y = Math.log(p.y);
    sx += x;
    sy += y;
    sxx += x * x;
    sxy += x * y;
    syy += y * y;
  }
  const denomX = n * sxx - sx * sx;
  const q = (n * sxy - sx * sy) / denomX;
  const A = Math.exp((sy - q * sx) / n);
  const cov = n * sxy - sx * sy;
  const r2 = (cov * cov) / (denomX * (n * syy - sy * sy));
  return { n, q, A, r2 };
}

// --- (1) global fit of the THIRD gap and the FIRST gap on the same ladder ------------
const thirdGapFit = powerLawFit(THIRD_GAP_LADDER.map((r) => ({ N: r.N, y: r.logInvSigma3 })));
const firstGapFit = powerLawFit(THIRD_GAP_LADDER.map((r) => ({ N: r.N, y: r.logInvRho1 })));
// both global exponents sit just above the -2 heuristic and agree to < 1e-3
const thirdGapConvergesToMinusTwo = thirdGapFit.q > HEURISTIC_Q && thirdGapFit.q < -1.97 && thirdGapFit.r2 > 0.9999;
const gapsShareSameExponent = Math.abs(thirdGapFit.q - firstGapFit.q) < 1e-3;

// --- local pairwise log-log exponents of -log sigma_3 (the third gap) ----------------
const localExponents = [];
for (let i = 1; i < THIRD_GAP_LADDER.length; i++) {
  const a = THIRD_GAP_LADDER[i - 1];
  const b = THIRD_GAP_LADDER[i];
  localExponents.push({
    fromN: a.N,
    toN: b.N,
    qThird: Math.log(b.logInvSigma3 / a.logInvSigma3) / Math.log(b.N / a.N),
    qFirst: Math.log(b.logInvRho1 / a.logInvRho1) / Math.log(b.N / a.N),
  });
}
// the local third-gap exponent climbs MONOTONICALLY toward -2 from above -- it
// approaches -2 by becoming MORE negative, so each rung is smaller than the previous
const localThirdClimbsMonotone = localExponents.every(
  (e, i) => (i === 0 || e.qThird < localExponents[i - 1].qThird) && e.qThird < HEURISTIC_Q + 0.06 && e.qThird > HEURISTIC_Q,
);
// third-gap and first-gap local exponents are essentially indistinguishable
const localExponentsMatchFirstGap = localExponents.every((e) => Math.abs(e.qThird - e.qFirst) < 3e-3);
const finestThirdExponent = localExponents[localExponents.length - 1].qThird; // ~ -1.9948 at 1600->2000

// --- (2) amplitude law a_j proportional to (j^2-1): test a_4/a_2 = 5 and a_4/a_3 = 15/8
const amplitudeRatios42 = THIRD_GAP_LADDER.map((r) => r.logInvSigma3 / r.logInvRho1); // -> a_4/a_2 = 5
const ratio42Mean = amplitudeRatios42.reduce((s, v) => s + v, 0) / amplitudeRatios42.length;
const ratio42Min = Math.min(...amplitudeRatios42);
const ratio42Max = Math.max(...amplitudeRatios42);
const A4_OVER_A2 = (16 - 1) / (4 - 1); // = 5 (pair index j: a_j proportional to j^2-1)
const amplitudeRatio42NearlyConstant = ratio42Max - ratio42Min < 1.1e-2; // spread ~ 1.06e-2 over N=160..2000
const amplitudeRatio42TendsToFive = Math.abs(amplitudeRatios42[amplitudeRatios42.length - 1] - A4_OVER_A2) < 1e-3;
// second, independent check of the SAME law: fourth-pair / third-pair ratio -> 15/8
const amplitudeRatios43 = THIRD_GAP_LADDER.map((r) => r.logInvSigma3 / r.logInvSigma2); // -> a_4/a_3 = 15/8
const A4_OVER_A3 = (16 - 1) / (9 - 1); // = 15/8 = 1.875
const amplitudeRatio43TendsToFifteenEighths = Math.abs(amplitudeRatios43[amplitudeRatios43.length - 1] - A4_OVER_A3) < 1e-3;

// --- second-gap / first-gap -log literals reproduce the imp-3602 baked ladder --------
// (a cross-check that the third gap is read off the SAME converged spectrum)
const IMP3602_LOWER_GAPS = Object.freeze({
  160: { logInvSigma2: 0.06137468003985347, logInvRho1: 0.02299479449754021 },
  1200: { logInvSigma2: 0.0011452533976304342, logInvRho1: 0.00042946243853075395 },
  2000: { logInvSigma2: 0.0004135750175458504, logInvRho1: 0.00015508964022665903 },
});
const lowerGapsReproduceImp3602 = Object.entries(IMP3602_LOWER_GAPS).every(([N, v]) => {
  const row = THIRD_GAP_LADDER.find((r) => r.N === Number(N));
  return row && Math.abs(row.logInvSigma2 - v.logInvSigma2) < 3e-12 && Math.abs(row.logInvRho1 - v.logInvRho1) < 3e-12;
});

// --- (3) lambda_7 = lambda_8 pairing (fourth-pair level, not a ghost) ----------------
const worstPair78 = Math.max(...THIRD_GAP_LADDER.map((r) => r.pair78));
const lambda7IsGenuinePairLevel = worstPair78 < 5e-11; // adjacent-paired (imp-3596 mechanism)
// every rung is Krylov-locked (sigma_3 vs the m=400 sub-block < 2e-13)
const worstLockResidual = Math.max(...THIRD_GAP_LADDER.map((r) => r.lockResidual));
const allRungsKrylovLocked = worstLockResidual < KRYLOV_LOCK;

const verdict =
  thirdGapConvergesToMinusTwo &&
  gapsShareSameExponent &&
  localThirdClimbsMonotone &&
  localExponentsMatchFirstGap &&
  amplitudeRatio42NearlyConstant &&
  amplitudeRatio42TendsToFive &&
  amplitudeRatio43TendsToFifteenEighths &&
  lowerGapsReproduceImp3602 &&
  lambda7IsGenuinePairLevel &&
  allRungsKrylovLocked
    ? 'THIRD-GAP-lambda_7/lambda_1-ALSO-CONVERGES-TO-THE--2-HEURISTIC-(GLOBAL-q_3=-1.9817-R^2=0.99999-MATCHES-q_1=-1.9811);-AND-THE-imp-3602-j^2-1-AMPLITUDE-LAW-HOLDS-AT-PAIR-j=4:--logSigma3/-logRho->5.00008=a_4/a_2-AND--logSigma3/-logSigma2->1.87502=a_4/a_3=15/8'
    : 'INDETERMINATE';

export const IMP3619_SKEW_TOEPLITZ_THIRD_GAP_EXPONENT = Object.freeze({
  id: 'imp-3619-skew-toeplitz-third-gap-exponent',
  ticket: 'imp-3619',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  testsAmplitudeLawOf: 'imp-3602-skew-toeplitz-second-gap-exponent.js',
  extendsExponentOf: 'imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js',
  reusesAssembly: 'imp-3505-power-iteration-budget-convergence-sweep.js',

  summary:
    'MEASURES the THIRD skew-Toeplitz gap sigma_3(N) = lambda_7/lambda_1 (fourth-pair / first-pair Gram Ritz-value ' +
    'ratio) across N = 160..2000 and TESTS the imp-3602 empirical amplitude law a_j proportional to (j^2-1): does the ' +
    'fourth-pair / second-pair ratio -log sigma_3 / -log rho tend to a_4/a_2 = (16-1)/(4-1) = 5? IT DOES. Reusing the ' +
    'IDENTICAL imp-3505/imp-3575/imp-3602 assembly Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, midpoint) and ' +
    'full-reorthogonalization Lanczos top-8 Ritz extraction at converged Krylov depth m=min(N,440) (every rung LOCKS ' +
    'vs the m=400 sub-block to < 6e-14; the second-gap -log sigma_2 and first-gap -log rho reproduce the imp-3602 ' +
    'baked ladder to < 3e-12), the THIRD gap converges to the SAME -2 heuristic as the first: the local log-log ' +
    'exponent of -log sigma_3 climbs monotonically from -1.9568 (160->240) to -1.9948 (1600->2000), indistinguishable ' +
    'from the first-gap exponents at every step (< 3e-3 apart), and the global fit gives q_3 = -1.9817 (R^2=0.99999) ' +
    'vs q_1 = -1.9811 (R^2=0.99999). The amplitude ratio -log sigma_3 / -log rho is nearly constant and tends CLEANLY ' +
    'to 5 (5.0107 at N=160 down to 5.00008 at N=2000, mean 5.0022), matching the j^2-1 prediction a_4/a_2 = 5 to 8e-5 ' +
    'at the finest rung; independently -log sigma_3 / -log sigma_2 -> 1.87502 = a_4/a_3 = 15/8. So the imp-3602 j^2-1 ' +
    'amplitude ordering, previously tested only to j=3 (a single ratio 8/3), is now corroborated at j=4 by two ' +
    'pair-ratios. The lambda_7 = lambda_8 pairing holds to < 4e-14 (< 4e-11 at N=2000), matching the imp-3596/imp-3602 ' +
    'certification, so lambda_7 is a genuine fourth-pair level, not a reorthogonalization ghost. Measurement only; ' +
    'does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity; RH-EQUIVALENT; ' +
    'NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    gapQuantity: 'sigma_3(N) = lambda_7/lambda_1 of the Gram S = T^T T of Ttilde(u,v)=a(v-u)R(|v-u|) (Gram-eigenvalue convention = sigma_7^2/sigma_1^2, same as imp-3575/imp-3602)',
    lowerGapsForComparison: 'rho(N) = lambda_3/lambda_1 (first gap) and sigma_2(N) = lambda_5/lambda_1 (second gap); -log sigma_2 and -log rho reproduced here to < 3e-12',
    amplitudeLawTested: 'imp-3602 a_j proportional to (j^2-1): predicts -log sigma_3 / -log rho -> a_4/a_2 = 5 and -log sigma_3 / -log sigma_2 -> a_4/a_3 = 15/8',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3575/imp-3602: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    eigensolver: 'symmetric Lanczos on S=T^T T with FULL reorthogonalization; top-8 Ritz values by cyclic Jacobi on the tridiagonal',
    krylovDepth: 'm = min(N, 440); every rung LOCKS -- sigma_3 agrees with the m=400 leading tridiagonal sub-block to < 6e-14',
    ladderN: THIRD_GAP_LADDER.map((r) => r.N),
    lambda7Identification: 'top-8 Ritz spectrum is skew-symmetry PAIRED (lambda_7=lambda_8 to < 4e-14); lambda_7 is the top of the FOURTH degenerate pair (imp-3596 dense-certified pairing)',
    measuredOffline: 'the 11 rungs were measured once offline (N=2000 Lanczos to m=440); sigma_3 / -log sigma_3 literals baked; import-light, no Lanczos re-run at import; exponent/ratio arithmetic self-checks against the baked gaps',
    h0: H0,
    selfComputing: false,
  }),

  measured: Object.freeze({
    thirdGapLadder: THIRD_GAP_LADDER, // per-N sigma_3, -log sigma_3, -log sigma_2, -log rho, pair78, lock residual
    thirdGapFit, // global log-log fit of -log sigma_3 (q ~ -1.9817, R^2 ~ 0.99999)
    firstGapFit, // global log-log fit of -log rho (q ~ -1.9811, R^2 ~ 0.99999) on the same ladder
    thirdGapConvergesToMinusTwo, // true -- q_3 in (-2, -1.97) with R^2 > 0.9999
    gapsShareSameExponent, // true -- |q_3 - q_1| < 1e-3
    localExponents, // per-pair local q for the third and first gaps
    localThirdClimbsMonotone, // true -- local third-gap exponent climbs monotonically toward -2
    localExponentsMatchFirstGap, // true -- local q_3 and q_1 agree to < 3e-3 at every step
    finestThirdExponent, // ~ -1.9948 at 1600->2000 (nearest to -2)
    amplitudeRatios42, // -log sigma_3 / -log rho at each rung (-> a_4/a_2 = 5)
    ratio42Mean, // ~ 5.0022
    ratio42Min, // ~ 5.00008
    ratio42Max, // ~ 5.0107
    a4OverA2: A4_OVER_A2, // = 5
    amplitudeRatio42NearlyConstant, // true -- spread < 1.1e-2 over N=160..2000
    amplitudeRatio42TendsToFive, // true -- N=2000 ratio within 1e-3 of 5
    amplitudeRatios43, // -log sigma_3 / -log sigma_2 at each rung (-> a_4/a_3 = 15/8)
    a4OverA3: A4_OVER_A3, // = 1.875
    amplitudeRatio43TendsToFifteenEighths, // true -- N=2000 ratio within 1e-3 of 15/8
    lowerGapsReproduceImp3602, // true -- second-gap/first-gap -log reproduce imp-3602 to < 3e-12
    worstPair78, // largest lambda_7=lambda_8 relative gap (~4e-11 at N=2000)
    lambda7IsGenuinePairLevel, // true -- adjacent-paired fourth-pair level, not a ghost
    worstLockResidual, // largest sigma_3 vs m=400 sub-block residual (< 6e-14)
    allRungsKrylovLocked, // true -- every rung converged
    heuristicQ: HEURISTIC_Q,
    verdict,
  }),

  interpretation: Object.freeze({
    thirdGapObeysTheSameHeuristic:
      'The third gap sigma_3 = lambda_7/lambda_1 converges to the same -2 section-gap heuristic as the first gap ' +
      'rho = lambda_3/lambda_1 and the second gap sigma_2 = lambda_5/lambda_1: its local log-log exponent climbs ' +
      'monotonically toward -2 (from -1.9568 at 160->240 to -1.9948 at 1600->2000), indistinguishable from the ' +
      'first-gap exponents at every rung, and the global fit q_3 = -1.9817 matches q_1 = -1.9811 to < 7e-4 (both ' +
      'R^2 = 0.99999). So the -2 heuristic governs at least the top FOUR pairs of the leading spectrum.',
    j2minus1LawHoldsAtPairFour:
      'The imp-3602 empirical amplitude law a_j proportional to (j^2-1), previously tested only to pair j=3 through the ' +
      'single ratio -log sigma_2 / -log rho ~ 8/3, is corroborated at pair j=4: -log sigma_3 / -log rho tends to 5 ' +
      '(5.0107 -> 5.00008, mean 5.0022) matching a_4/a_2 = (16-1)/(4-1) = 5, and independently ' +
      '-log sigma_3 / -log sigma_2 -> 1.87502 matching a_4/a_3 = 15/8 = 1.875. Two independent pair-ratios now support ' +
      'the j^2-1 ordering, upgrading it from a single-ratio suggestion to a two-ratio corroboration -- but it remains ' +
      'an EMPIRICAL structural observation of the paired leading spectrum, not a derived law.',
    lambda7IsReal:
      'The lambda_7 = lambda_8 degeneracy holds to relative < 4e-14 through N=1600 (< 4e-11 at N=2000), matching the ' +
      'imp-3596/imp-3602 certification that the skew-Toeplitz section spectrum is adjacent-paired. So lambda_7 is the ' +
      'top of the FOURTH real pair -- a genuine level whose gap is a meaningful spectral quantity, not a Lanczos ' +
      'reorthogonalization ghost.',
    whatItAddsOverImp3602:
      'imp-3602 measured only the second gap sigma_2 = lambda_5/lambda_1 and could test the j^2-1 amplitude law with ' +
      'a SINGLE ratio (a_3/a_2 = 8/3). This module measures the third gap sigma_3 = lambda_7/lambda_1 across the full ' +
      'N=160..2000 ladder and tests the law at the NEXT pair, finding the predicted a_4/a_2 = 5 and a_4/a_3 = 15/8 ' +
      'both hold to ~1e-4 -- a second, independent confirmation that extends the -2 heuristic and the j^2-1 ordering ' +
      'from the top two gaps to the top four.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    convergenceIsNumericalNotSymbolic:
      'The third-gap q_3 -> -2 convergence and the a_4/a_2 = 5 amplitude ratio are finite-N numerical measurements of ' +
      'a converged Krylov reference, not a proven asymptotic; the -2 heuristic and the j^2-1 amplitude ordering are ' +
      'corroborated, not derived.',
    measuresNotConstructs:
      'This measures a third spectral gap and its exponent; it does NOT construct the missing magnitude and does NOT ' +
      'attempt the imp-3066 K_a >= 0 positivity.',
    bakedOfflineLiterals:
      'The per-rung sigma_3 and -log sigma_3 tables are BAKED offline literals (the Lanczos to m=440 at N=2000 is ' +
      'O(N^2) per matvec); this module re-derives the fits, local exponents and amplitude ratios arithmetically from ' +
      'the baked gaps and does NOT re-run the heavy assembly at import.',
    amplitudeLawIsEmpirical:
      'The j^2-1 amplitude ordering is an empirical structural observation of the paired leading spectrum; it is now ' +
      'corroborated by two pair-ratios (a_3/a_2 = 8/3 from imp-3602 and a_4/a_2 = 5, a_4/a_3 = 15/8 here), tested ' +
      'through pair j = 4 only, and is offered as a candidate law, NOT a derived one.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3619_SKEW_TOEPLITZ_THIRD_GAP_EXPONENT_ASSERTIONS = [
  {
    id: 'imp3619-third-gap-global-fit-converges-to-minus-two',
    why: 'The global log-log fit of the third gap -log(lambda_7/lambda_1) must give an exponent in (-2, -1.97) with ' +
      'R^2 > 0.9999 and must match the first-gap exponent to < 1e-3 -- so the -2 section-gap heuristic governs the ' +
      'third gap, not only rho = lambda_3/lambda_1 and sigma_2 = lambda_5/lambda_1.',
    holds: () => thirdGapConvergesToMinusTwo && gapsShareSameExponent,
  },
  {
    id: 'imp3619-local-third-gap-exponent-climbs-toward-minus-two',
    why: 'The local pairwise log-log exponent of the third gap must climb MONOTONICALLY toward -2 from above (each ' +
      'in (-2, -1.94)) and be indistinguishable from the first-gap local exponent (< 3e-3 apart) at every rung.',
    holds: () => localThirdClimbsMonotone && localExponentsMatchFirstGap && finestThirdExponent < -1.99 && finestThirdExponent > HEURISTIC_Q,
  },
  {
    id: 'imp3619-amplitude-law-a4-over-a2-tends-to-five',
    why: 'THE PRIMARY DELIVERABLE: the ratio -log sigma_3 / -log rho must be nearly constant across the ladder ' +
      '(spread < 1.1e-2) and tend to a_4/a_2 = 5 at the finest rung -- the imp-3602 j^2-1 amplitude law tested at ' +
      'pair j=4.',
    holds: () => amplitudeRatio42NearlyConstant && amplitudeRatio42TendsToFive && ratio42Min > 5.0 && ratio42Max < 5.02,
  },
  {
    id: 'imp3619-amplitude-law-a4-over-a3-tends-to-fifteen-eighths',
    why: 'Independent second check of the SAME j^2-1 law: -log sigma_3 / -log sigma_2 must tend to a_4/a_3 = 15/8 = ' +
      '1.875 at the finest rung, confirming the amplitude ordering across two distinct pair-ratios.',
    holds: () => amplitudeRatio43TendsToFifteenEighths,
  },
  {
    id: 'imp3619-lower-gaps-reproduce-imp3602-ladder',
    why: 'Self-check: the second-gap -log sigma_2 and first-gap -log rho read off the SAME converged spectrum must ' +
      'reproduce the imp-3602 baked ladder (N=160/1200/2000) to < 3e-12, confirming the third gap is measured on the ' +
      'imp-3602 assembly.',
    holds: () => lowerGapsReproduceImp3602,
  },
  {
    id: 'imp3619-lambda7-is-a-genuine-fourth-pair-level',
    why: 'The lambda_7=lambda_8 pair degeneracy must hold to relative < 5e-11 at every rung (adjacent-paired, the ' +
      'imp-3596 dense-certified mechanism), so lambda_7 is a real fourth-pair level and every rung is Krylov-locked.',
    holds: () => lambda7IsGenuinePairLevel && allRungsKrylovLocked,
  },
  {
    id: 'imp3619-verdict-third-gap-obeys-minus-two-and-j2minus1-law',
    why: 'The classified verdict must be the confirming full-leading-spectrum result, not indeterminate; a flip means ' +
      'the third-gap convergence, the exponent match, the j^2-1 amplitude ratios, or the pairing failed.',
    holds: () => verdict.startsWith('THIRD-GAP-lambda_7/lambda_1-ALSO-CONVERGES-TO-THE--2-HEURISTIC'),
  },
  {
    id: 'imp3619-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- measures a third gap exponent and tests the j^2-1 amplitude law at ' +
      'pair j=4, positivity not attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3619_SKEW_TOEPLITZ_THIRD_GAP_EXPONENT.honestCaveat;
      return (
        c.isProof === false &&
        c.isReductionBelowRH === false &&
        c.rhEquivalent === true &&
        c.didNotAttemptPositivity === true &&
        typeof c.measuresNotConstructs === 'string' &&
        typeof c.amplitudeLawIsEmpirical === 'string' &&
        /Platt-Trudgian/.test(c.sota)
      );
    },
  },
];

for (const assertion of IMP3619_SKEW_TOEPLITZ_THIRD_GAP_EXPONENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3619-skew-toeplitz-third-gap-exponent assertion failed: ${assertion.id}`);
  }
}

export default IMP3619_SKEW_TOEPLITZ_THIRD_GAP_EXPONENT;
