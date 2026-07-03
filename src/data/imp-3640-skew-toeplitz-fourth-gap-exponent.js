/**
 * @module imp-3640-skew-toeplitz-fourth-gap-exponent
 * @fileoverview imp-3640 -- MEASURE the FOURTH skew-Toeplitz gap
 *   sigma_4(N) = lambda_9/lambda_1 (the fifth-pair / first-pair Gram-Ritz ratio)
 *   across N = 160..2000 and TEST the imp-3619 empirical amplitude law
 *   a_j proportional to (j^2 - 1): does the fifth-pair / second-pair -log ratio
 *   -log sigma_4 / -log rho tend to a_5/a_2 = (25-1)/(4-1) = 8?
 *
 *   CONTEXT
 *   -------
 *   imp-3619 measured the THIRD gap sigma_3 = lambda_7/lambda_1 (fourth-pair /
 *   first-pair Gram-Ritz ratio), found it converges to the SAME -2 section-gap
 *   exponent as the first gap rho = lambda_3/lambda_1, and corroborated the empirical
 *   amplitude law a_j proportional to (j^2 - 1) at pair j = 4 (two ratios:
 *   -log sigma_3 / -log rho -> a_4/a_2 = 5 and -log sigma_3 / -log sigma_2 -> a_4/a_3 =
 *   15/8). That law was flagged EMPIRICAL, not derived, and tested through pair j = 4.
 *   The next prediction of the same law is a_5/a_2 = (25-1)/(4-1) = 8 for the FIFTH
 *   pair (lambda_9 = lambda_10), which imp-3619 did not test.
 *
 *   THIS MODULE re-runs the IDENTICAL imp-3505/imp-3575/imp-3602/imp-3619/imp-3625
 *   assembly Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, midpoint quadrature)
 *   and a symmetric Lanczos with FULL reorthogonalization at converged Krylov depth,
 *   extracting the TOP-TEN Gram Ritz values at each rung of the imp-3555 ladder N in
 *   {160, 240, 320, 400, 480, 640, 800, 1000, 1200, 1600, 2000}. Mindful of the imp-3625
 *   depth-vs-N under-resolution, the depth GROWS with N (m = min(N, 560) at N = 2000)
 *   so the FIFTH pair lambda_9 = lambda_10 is resolved at every rung. From the top-10
 *   spectrum it forms the FOURTH gap in the SAME Gram-eigenvalue convention
 *   (lambda_i = Ritz eigenvalue of S = T^T T = sigma_i^2):
 *     sigma_4(N) = lambda_9(N) / lambda_1(N).
 *   The measurement ran once offline (scripts/compute-imp3640-fourth-gap.mjs); the
 *   per-rung sigma_4 and -log sigma_4 literals are BAKED so this module stays
 *   import-light and the exponent/ratio arithmetic is self-checking. The third-gap
 *   -log sigma_3, second-gap -log sigma_2 and first-gap -log rho literals are the
 *   imp-3619 baked ladder, reproduced here to < 3e-12 by the same assembly (a
 *   cross-check that the fourth gap is read off the SAME converged spectrum).
 *
 *   FINDING
 *   -------
 *   (1) THE FOURTH GAP ALSO CONVERGES TO THE -2 HEURISTIC. The local pairwise log-log
 *       exponent of -log sigma_4(N) climbs MONOTONICALLY toward -2 from above --
 *       -1.9588 (160->240), -1.9696 (240->320), ..., -1.9933 (1200->1600),
 *       -1.9948 (1600->2000) -- essentially INDISTINGUISHABLE from the first-gap
 *       exponents at every step (they agree to < 5e-3, both reaching -1.9948 at
 *       1600->2000). The global log-log fit gives q_4 = -1.9822 (R^2 = 0.99999),
 *       versus the first-gap q_1 = -1.9811 (R^2 = 0.99999): the -2 section-gap
 *       heuristic governs the FOURTH gap just as cleanly, so it holds across the top
 *       FIVE pairs of the leading spectrum.
 *   (2) THE j^2-1 AMPLITUDE LAW HOLDS THROUGH PAIR j = 5. The ratio
 *       -log sigma_4(N) / -log rho(N) is nearly CONSTANT across the whole ladder and
 *       tends CLEANLY to 8 (8.0296 at N=160 down to 8.00022 at N=2000, mean 8.0060),
 *       matching the a_j proportional to (j^2 - 1) prediction a_5/a_2 = (25-1)/(4-1) =
 *       8 to 2.2e-4 at the finest rung. As two further independent checks of the same
 *       law, -log sigma_4 / -log sigma_2 tends to 3.00006 (= a_5/a_3 = 24/8 = 3) and
 *       -log sigma_4 / -log sigma_3 tends to 1.60002 (= a_5/a_4 = 24/15 = 1.6) at
 *       N = 2000. So the imp-3619 j^2-1 amplitude ordering, previously corroborated
 *       through pair j = 4, is now confirmed at j = 5 by three independent pair-ratios.
 *       (Still reported as an EMPIRICAL structural observation, not a derived law.)
 *   (3) lambda_9 IS A GENUINE FIFTH-PAIR LEVEL. The lambda_9 = lambda_10 pair
 *       degeneracy holds to relative < 2e-14 at EVERY rung through N = 2000 (the
 *       deeper Krylov depth keeps the fifth pair tighter than the imp-3619 fourth
 *       pair at the deepest rung), matching the imp-3596/imp-3602 adjacent-paired
 *       certification -- so lambda_9 is the top of the FIFTH degenerate pair, a real
 *       level, not a Lanczos reorthogonalization ghost.
 *
 *   @see imp-3619-skew-toeplitz-third-gap-exponent.js (the third gap sigma_3=lambda_7/lambda_1 and the j^2-1 law this tests at j=5)
 *   @see imp-3625-skew-toeplitz-pair56-krylov-depth.js (the Krylov depth-vs-N resolution study this heeds)
 *   @see imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js (the first gap rho=lambda_3/lambda_1 whose -2 exponent this extends)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly + Lanczos routine)
 *
 *   Ticket: imp-3640 (numerical, medium). MEASUREMENT ONLY: measures the fourth gap
 *   exponent across the ladder and confirms the imp-3619 j^2-1 amplitude law at
 *   pair j = 5. Does NOT construct the missing magnitude and does NOT attempt the
 *   imp-3066 K_a >= 0 positivity. RH-EQUIVALENT. NO RH verdict, NO QED. Platt-Trudgian
 *   Lambda <= 0.2 remains the rigorous SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3575 / imp-3619)
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3505 / imp-3619 ladder
const HEURISTIC_Q = -2; // the skew-Toeplitz section-gap heuristic exponent
const KRYLOV_LOCK = 5e-13; // sigma_4 change vs the m-40 sub-block below this = converged

// --- BAKED fourth-gap ladder. Per rung: sigma_4 = lambda_9/lambda_1 (Gram Ritz-value
//     ratio, i.e. sigma_9^2/sigma_1^2 -- the SAME eigenvalue convention imp-3575/imp-3619
//     used for rho=lambda_3/lambda_1, sigma_2=lambda_5/lambda_1 and sigma_3=lambda_7/lambda_1),
//     its -log, the imp-3619 baked THIRD-gap -log sigma_3, SECOND-gap -log sigma_2 and
//     FIRST-gap -log rho for comparison (all reproduced here to < 3e-12 by the same
//     assembly), the lambda_9=lambda_10 pair-degeneracy relative gap, and the Krylov lock
//     residual (sigma_4 vs the m-40 leading sub-block). Measured offline with the identical
//     imp-3505/imp-3575/imp-3619 assembly at a depth that grows with N (m=min(N,560) at
//     N=2000, mind imp-3625); literals baked, import-light. ------------------------------ */
const FOURTH_GAP_LADDER = Object.freeze([
  { N: 160, U: 4, sigma4: 0.8314041411699363, logInvSigma4: 0.1846392712162547, logInvSigma3: 0.11522021760361348, logInvSigma2: 0.061374680039853705, logInvRho1: 0.022994794497539984, pair910: 2.378605742919045e-16, lockResidual: 2.6645352591003757e-15 },
  { N: 240, U: 6, sigma4: 0.9199420300489223, logInvSigma4: 0.08344462174070477, logInvSigma3: 0.05211444490809804, logInvSigma2: 0.02777827309052956, logInvRho1: 0.010412511115177814, pair910: 7.278360298693291e-15, lockResidual: 3.3306690738754696e-15 },
  { N: 320, U: 8, sigma4: 0.9537540522140782, logInvSigma4: 0.04734944767524504, logInvSigma3: 0.02958079911915263, logInvSigma2: 0.015771170123875914, logInvRho1: 0.005912775566738589, pair910: 2.8863943913657947e-15, lockResidual: 4.440892098500626e-15 },
  { N: 400, U: 10, sigma4: 0.969992409522957, logInvSigma4: 0.030467032749390843, logInvSigma3: 0.019036628273014087, logInvSigma2: 0.01015067634368126, logInvRho1: 0.0038059150436360522, pair910: 2.8360822962532386e-15, lockResidual: 4.440892098500626e-16 },
  { N: 480, U: 12, sigma4: 0.9789889717012328, logInvSigma4: 0.021234901375920656, logInvSigma3: 0.013269240789315562, logInvSigma2: 0.0070758588646843, logInvRho1: 0.0026531601039491864, pair910: 5.617880765670587e-15, lockResidual: 1.2434497875801753e-14 },
  { N: 640, U: 16, sigma4: 0.9880717219830988, logInvSigma4: 0.011999990768718423, logInvSigma3: 0.007499167768940895, logInvSigma2: 0.0039992128800121615, logInvRho1: 0.001499612797393039, pair910: 1.1525634376572169e-14, lockResidual: 1.2212453270876722e-14 },
  { N: 800, U: 20, sigma4: 0.9923279611117625, logInvSigma4: 0.00770162037593437, logInvSigma3: 0.004813171226894313, logInvSigma2: 0.002566882876832654, logInvRho1: 0.0009625430796858375, pair910: 1.3056785798171931e-14, lockResidual: 2.3314683517128287e-15 },
  { N: 1000, U: 25, sigma4: 0.9950719428234351, logInvSigma4: 0.004940240092216508, logInvSigma3: 0.0030875092142409505, logInvSigma2: 0.0016466131266812656, logInvRho1: 0.0006174642590326784, pair910: 4.339761071261049e-15, lockResidual: 5.440092820663267e-15 },
  { N: 1200, U: 30, sigma4: 0.9965699418447446, logInvSigma4: 0.0034359542913169824, logInvSigma3: 0.002147403205072017, logInvSigma2: 0.001145253397615429, logInvRho1: 0.0004294624385230901, pair910: 6.105543286978951e-15, lockResidual: 3.241851231905457e-14 },
  { N: 1600, U: 40, sigma4: 0.9980654415282122, logInvSigma4: 0.0019364321469075457, logInvSigma3: 0.0012102483854322702, logInvSigma2: 0.0006454567995764967, logInvRho1: 0.00024204388718096118, pair910: 8.455761232353147e-15, lockResidual: 1.176836406102666e-14 },
  { N: 2000, U: 50, sigma4: 0.9987600189865374, logInvSigma4: 0.0012407504260231836, logInvSigma3: 0.000775460096432096, logInvSigma2: 0.0004135750175424073, logInvRho1: 0.00015508964027440602, pair910: 1.9060806449198212e-14, lockResidual: 2.042810365310288e-14 },
]);

// --- ordinary least-squares log-log fit -log y = A N^q (imp-3619 verbatim) -----------
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

// --- (1) global fit of the FOURTH gap and the FIRST gap on the same ladder -----------
const fourthGapFit = powerLawFit(FOURTH_GAP_LADDER.map((r) => ({ N: r.N, y: r.logInvSigma4 })));
const firstGapFit = powerLawFit(FOURTH_GAP_LADDER.map((r) => ({ N: r.N, y: r.logInvRho1 })));
// both global exponents sit just above the -2 heuristic and agree to ~1.2e-3
const fourthGapConvergesToMinusTwo = fourthGapFit.q > HEURISTIC_Q && fourthGapFit.q < -1.97 && fourthGapFit.r2 > 0.9999;
const gapsShareSameExponent = Math.abs(fourthGapFit.q - firstGapFit.q) < 1.5e-3;

// --- local pairwise log-log exponents of -log sigma_4 (the fourth gap) ---------------
const localExponents = [];
for (let i = 1; i < FOURTH_GAP_LADDER.length; i++) {
  const a = FOURTH_GAP_LADDER[i - 1];
  const b = FOURTH_GAP_LADDER[i];
  localExponents.push({
    fromN: a.N,
    toN: b.N,
    qFourth: Math.log(b.logInvSigma4 / a.logInvSigma4) / Math.log(b.N / a.N),
    qFirst: Math.log(b.logInvRho1 / a.logInvRho1) / Math.log(b.N / a.N),
  });
}
// the local fourth-gap exponent climbs MONOTONICALLY toward -2 from above -- it
// approaches -2 by becoming MORE negative, so each rung is smaller than the previous
const localFourthClimbsMonotone = localExponents.every(
  (e, i) => (i === 0 || e.qFourth < localExponents[i - 1].qFourth) && e.qFourth < HEURISTIC_Q + 0.06 && e.qFourth > HEURISTIC_Q,
);
// fourth-gap and first-gap local exponents are essentially indistinguishable
const localExponentsMatchFirstGap = localExponents.every((e) => Math.abs(e.qFourth - e.qFirst) < 5e-3);
const finestFourthExponent = localExponents[localExponents.length - 1].qFourth; // ~ -1.9948 at 1600->2000

// --- (2) amplitude law a_j proportional to (j^2-1): test a_5/a_2=8, a_5/a_3=3, a_5/a_4=8/5
const amplitudeRatios52 = FOURTH_GAP_LADDER.map((r) => r.logInvSigma4 / r.logInvRho1); // -> a_5/a_2 = 8
const ratio52Mean = amplitudeRatios52.reduce((s, v) => s + v, 0) / amplitudeRatios52.length;
const ratio52Min = Math.min(...amplitudeRatios52);
const ratio52Max = Math.max(...amplitudeRatios52);
const A5_OVER_A2 = (25 - 1) / (4 - 1); // = 8 (pair index j: a_j proportional to j^2-1)
const amplitudeRatio52NearlyConstant = ratio52Max - ratio52Min < 3.1e-2; // spread ~ 2.94e-2 over N=160..2000
const amplitudeRatio52TendsToEight = Math.abs(amplitudeRatios52[amplitudeRatios52.length - 1] - A5_OVER_A2) < 1e-3;
// second, independent check of the SAME law: fifth-pair / third-pair ratio -> 3
const amplitudeRatios53 = FOURTH_GAP_LADDER.map((r) => r.logInvSigma4 / r.logInvSigma2); // -> a_5/a_3 = 3
const A5_OVER_A3 = (25 - 1) / (9 - 1); // = 3
const amplitudeRatio53TendsToThree = Math.abs(amplitudeRatios53[amplitudeRatios53.length - 1] - A5_OVER_A3) < 1e-3;
// third, independent check: fifth-pair / fourth-pair ratio -> 24/15 = 1.6
const amplitudeRatios54 = FOURTH_GAP_LADDER.map((r) => r.logInvSigma4 / r.logInvSigma3); // -> a_5/a_4 = 8/5
const A5_OVER_A4 = (25 - 1) / (16 - 1); // = 24/15 = 1.6
const amplitudeRatio54TendsToEightFifths = Math.abs(amplitudeRatios54[amplitudeRatios54.length - 1] - A5_OVER_A4) < 1e-3;

// --- lower-gap -log literals reproduce the imp-3619 baked ladder ---------------------
// (a cross-check that the fourth gap is read off the SAME converged spectrum)
const IMP3619_LOWER_GAPS = Object.freeze({
  160: { logInvSigma3: 0.11522021760361348, logInvSigma2: 0.06137468003985359, logInvRho1: 0.022994794497539755 },
  1200: { logInvSigma3: 0.002147403205083366, logInvSigma2: 0.0011452533976152068, logInvRho1: 0.0004294624385316425 },
  2000: { logInvSigma3: 0.0007754600964098744, logInvSigma2: 0.00041357501754696113, logInvRho1: 0.00015508964024853381 },
});
const lowerGapsReproduceImp3619 = Object.entries(IMP3619_LOWER_GAPS).every(([N, v]) => {
  const row = FOURTH_GAP_LADDER.find((r) => r.N === Number(N));
  return (
    row &&
    Math.abs(row.logInvSigma3 - v.logInvSigma3) < 3e-12 &&
    Math.abs(row.logInvSigma2 - v.logInvSigma2) < 3e-12 &&
    Math.abs(row.logInvRho1 - v.logInvRho1) < 3e-12
  );
});

// --- (3) lambda_9 = lambda_10 pairing (fifth-pair level, not a ghost) ----------------
const worstPair910 = Math.max(...FOURTH_GAP_LADDER.map((r) => r.pair910));
const lambda9IsGenuinePairLevel = worstPair910 < 5e-11; // adjacent-paired (imp-3596 mechanism)
// every rung is Krylov-locked (sigma_4 vs the m-40 sub-block < 5e-13)
const worstLockResidual = Math.max(...FOURTH_GAP_LADDER.map((r) => r.lockResidual));
const allRungsKrylovLocked = worstLockResidual < KRYLOV_LOCK;

const verdict =
  fourthGapConvergesToMinusTwo &&
  gapsShareSameExponent &&
  localFourthClimbsMonotone &&
  localExponentsMatchFirstGap &&
  amplitudeRatio52NearlyConstant &&
  amplitudeRatio52TendsToEight &&
  amplitudeRatio53TendsToThree &&
  amplitudeRatio54TendsToEightFifths &&
  lowerGapsReproduceImp3619 &&
  lambda9IsGenuinePairLevel &&
  allRungsKrylovLocked
    ? 'FOURTH-GAP-lambda_9/lambda_1-ALSO-CONVERGES-TO-THE--2-HEURISTIC-(GLOBAL-q_4=-1.9822-R^2=0.99999-MATCHES-q_1=-1.9811);-AND-THE-imp-3619-j^2-1-AMPLITUDE-LAW-HOLDS-AT-PAIR-j=5:--logSigma4/-logRho->8.00022=a_5/a_2,--logSigma4/-logSigma2->3.00006=a_5/a_3,--logSigma4/-logSigma3->1.60002=a_5/a_4'
    : 'INDETERMINATE';

export const IMP3640_SKEW_TOEPLITZ_FOURTH_GAP_EXPONENT = Object.freeze({
  id: 'imp-3640-skew-toeplitz-fourth-gap-exponent',
  ticket: 'imp-3640',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  testsAmplitudeLawOf: 'imp-3619-skew-toeplitz-third-gap-exponent.js',
  extendsExponentOf: 'imp-3575-skew-toeplitz-gap-N1600-krylov-reconverge.js',
  reusesAssembly: 'imp-3505-power-iteration-budget-convergence-sweep.js',
  computeScript: 'scripts/compute-imp3640-fourth-gap.mjs',

  summary:
    'MEASURES the FOURTH skew-Toeplitz gap sigma_4(N) = lambda_9/lambda_1 (fifth-pair / first-pair Gram Ritz-value ' +
    'ratio) across N = 160..2000 and TESTS the imp-3619 empirical amplitude law a_j proportional to (j^2-1): does the ' +
    'fifth-pair / second-pair ratio -log sigma_4 / -log rho tend to a_5/a_2 = (25-1)/(4-1) = 8? IT DOES. Reusing the ' +
    'IDENTICAL imp-3505/imp-3575/imp-3619 assembly Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, midpoint) and ' +
    'full-reorthogonalization Lanczos top-10 Ritz extraction at a depth that GROWS with N (m=min(N,560) at N=2000, ' +
    'mind the imp-3625 depth-vs-N under-resolution; every rung LOCKS vs the m-40 sub-block to < 4e-14; the third/second/' +
    'first-gap -log literals reproduce the imp-3619 baked ladder to < 3e-12), the FOURTH gap converges to the SAME -2 ' +
    'heuristic as the first: the local log-log exponent of -log sigma_4 climbs monotonically from -1.9588 (160->240) ' +
    'to -1.9948 (1600->2000), indistinguishable from the first-gap exponents at every step (< 5e-3 apart), and the ' +
    'global fit gives q_4 = -1.9822 (R^2=0.99999) vs q_1 = -1.9811 (R^2=0.99999). The amplitude ratio ' +
    '-log sigma_4 / -log rho is nearly constant and tends CLEANLY to 8 (8.0296 at N=160 down to 8.00022 at N=2000, ' +
    'mean 8.0060), matching the j^2-1 prediction a_5/a_2 = 8 to 2.2e-4 at the finest rung; independently ' +
    '-log sigma_4 / -log sigma_2 -> 3.00006 = a_5/a_3 = 3 and -log sigma_4 / -log sigma_3 -> 1.60002 = a_5/a_4 = 8/5. ' +
    'So the imp-3619 j^2-1 amplitude ordering, corroborated through pair j=4, is now confirmed at j=5 by three ' +
    'pair-ratios. The lambda_9 = lambda_10 pairing holds to < 2e-14 at every rung, matching the imp-3596/imp-3602 ' +
    'certification, so lambda_9 is a genuine fifth-pair level, not a reorthogonalization ghost. Measurement only; ' +
    'does NOT construct the missing magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity; RH-EQUIVALENT; ' +
    'NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    gapQuantity: 'sigma_4(N) = lambda_9/lambda_1 of the Gram S = T^T T of Ttilde(u,v)=a(v-u)R(|v-u|) (Gram-eigenvalue convention = sigma_9^2/sigma_1^2, same as imp-3575/imp-3619)',
    lowerGapsForComparison: 'rho(N) = lambda_3/lambda_1 (first gap), sigma_2(N) = lambda_5/lambda_1 (second gap), sigma_3(N) = lambda_7/lambda_1 (third gap); all three -log reproduced here to < 3e-12',
    amplitudeLawTested: 'imp-3619 a_j proportional to (j^2-1): predicts -log sigma_4 / -log rho -> a_5/a_2 = 8, -log sigma_4 / -log sigma_2 -> a_5/a_3 = 3, and -log sigma_4 / -log sigma_3 -> a_5/a_4 = 8/5',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3575/imp-3619: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    eigensolver: 'symmetric Lanczos on S=T^T T with FULL reorthogonalization; top-10 Ritz values by cyclic Jacobi on the tridiagonal',
    krylovDepth: 'm grows with N (min(N,560) at N=2000, mind imp-3625) so the FIFTH pair lambda_9=lambda_10 is resolved; every rung LOCKS -- sigma_4 agrees with the m-40 leading tridiagonal sub-block to < 4e-14',
    ladderN: FOURTH_GAP_LADDER.map((r) => r.N),
    lambda9Identification: 'top-10 Ritz spectrum is skew-symmetry PAIRED (lambda_9=lambda_10 to < 2e-14); lambda_9 is the top of the FIFTH degenerate pair (imp-3596 dense-certified pairing)',
    measuredOffline: 'the 11 rungs were measured once offline by scripts/compute-imp3640-fourth-gap.mjs (N=2000 Lanczos to m=560); sigma_4 / -log sigma_4 literals baked; import-light, no Lanczos re-run at import; exponent/ratio arithmetic self-checks against the baked gaps',
    h0: H0,
    selfComputing: false,
  }),

  measured: Object.freeze({
    fourthGapLadder: FOURTH_GAP_LADDER, // per-N sigma_4, -log sigma_4, -log sigma_3/2, -log rho, pair910, lock residual
    fourthGapFit, // global log-log fit of -log sigma_4 (q ~ -1.9822, R^2 ~ 0.99999)
    firstGapFit, // global log-log fit of -log rho (q ~ -1.9811, R^2 ~ 0.99999) on the same ladder
    fourthGapConvergesToMinusTwo, // true -- q_4 in (-2, -1.97) with R^2 > 0.9999
    gapsShareSameExponent, // true -- |q_4 - q_1| < 1.5e-3
    localExponents, // per-pair local q for the fourth and first gaps
    localFourthClimbsMonotone, // true -- local fourth-gap exponent climbs monotonically toward -2
    localExponentsMatchFirstGap, // true -- local q_4 and q_1 agree to < 5e-3 at every step
    finestFourthExponent, // ~ -1.9948 at 1600->2000 (nearest to -2)
    amplitudeRatios52, // -log sigma_4 / -log rho at each rung (-> a_5/a_2 = 8)
    ratio52Mean, // ~ 8.0060
    ratio52Min, // ~ 8.00022
    ratio52Max, // ~ 8.0296
    a5OverA2: A5_OVER_A2, // = 8
    amplitudeRatio52NearlyConstant, // true -- spread < 3.1e-2 over N=160..2000
    amplitudeRatio52TendsToEight, // true -- N=2000 ratio within 1e-3 of 8
    amplitudeRatios53, // -log sigma_4 / -log sigma_2 at each rung (-> a_5/a_3 = 3)
    a5OverA3: A5_OVER_A3, // = 3
    amplitudeRatio53TendsToThree, // true -- N=2000 ratio within 1e-3 of 3
    amplitudeRatios54, // -log sigma_4 / -log sigma_3 at each rung (-> a_5/a_4 = 8/5)
    a5OverA4: A5_OVER_A4, // = 1.6
    amplitudeRatio54TendsToEightFifths, // true -- N=2000 ratio within 1e-3 of 8/5
    lowerGapsReproduceImp3619, // true -- third/second/first-gap -log reproduce imp-3619 to < 3e-12
    worstPair910, // largest lambda_9=lambda_10 relative gap (< 2e-14)
    lambda9IsGenuinePairLevel, // true -- adjacent-paired fifth-pair level, not a ghost
    worstLockResidual, // largest sigma_4 vs m-40 sub-block residual (< 4e-14)
    allRungsKrylovLocked, // true -- every rung converged
    heuristicQ: HEURISTIC_Q,
    verdict,
  }),

  interpretation: Object.freeze({
    fourthGapObeysTheSameHeuristic:
      'The fourth gap sigma_4 = lambda_9/lambda_1 converges to the same -2 section-gap heuristic as the first three ' +
      'gaps: its local log-log exponent climbs monotonically toward -2 (from -1.9588 at 160->240 to -1.9948 at ' +
      '1600->2000), indistinguishable from the first-gap exponents at every rung, and the global fit q_4 = -1.9822 ' +
      'matches q_1 = -1.9811 to ~1.2e-3 (both R^2 = 0.99999). So the -2 heuristic governs at least the top FIVE pairs ' +
      'of the leading spectrum.',
    j2minus1LawHoldsAtPairFive:
      'The imp-3619 empirical amplitude law a_j proportional to (j^2-1), previously corroborated through pair j=4, is ' +
      'confirmed at pair j=5: -log sigma_4 / -log rho tends to 8 (8.0296 -> 8.00022, mean 8.0060) matching ' +
      'a_5/a_2 = (25-1)/(4-1) = 8, and independently -log sigma_4 / -log sigma_2 -> 3.00006 = a_5/a_3 = 3 and ' +
      '-log sigma_4 / -log sigma_3 -> 1.60002 = a_5/a_4 = 8/5. Three independent pair-ratios now support the j^2-1 ' +
      'ordering at pair five -- but it remains an EMPIRICAL structural observation of the paired leading spectrum, not ' +
      'a derived law.',
    lambda9IsReal:
      'The lambda_9 = lambda_10 degeneracy holds to relative < 2e-14 at every rung through N=2000 (the deeper Krylov ' +
      'depth keeps the fifth pair tighter than the imp-3619 fourth pair at its deepest rung), matching the ' +
      'imp-3596/imp-3602 certification that the skew-Toeplitz section spectrum is adjacent-paired. So lambda_9 is the ' +
      'top of the FIFTH real pair -- a genuine level whose gap is a meaningful spectral quantity, not a Lanczos ' +
      'reorthogonalization ghost.',
    whatItAddsOverImp3619:
      'imp-3619 measured the third gap sigma_3 = lambda_7/lambda_1 and corroborated the j^2-1 amplitude law at pair ' +
      'j=4. This module measures the fourth gap sigma_4 = lambda_9/lambda_1 across the full N=160..2000 ladder and ' +
      'tests the law at the NEXT pair, finding the predicted a_5/a_2 = 8, a_5/a_3 = 3 and a_5/a_4 = 8/5 all hold to ' +
      '~1e-4 -- a third, independent confirmation that extends the -2 heuristic and the j^2-1 ordering from the top ' +
      'four gaps to the top five.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    convergenceIsNumericalNotSymbolic:
      'The fourth-gap q_4 -> -2 convergence and the a_5/a_2 = 8 amplitude ratio are finite-N numerical measurements of ' +
      'a converged Krylov reference, not a proven asymptotic; the -2 heuristic and the j^2-1 amplitude ordering are ' +
      'corroborated, not derived.',
    measuresNotConstructs:
      'This measures a fourth spectral gap and its exponent; it does NOT construct the missing magnitude and does NOT ' +
      'attempt the imp-3066 K_a >= 0 positivity.',
    bakedOfflineLiterals:
      'The per-rung sigma_4 and -log sigma_4 tables are BAKED offline literals (the Lanczos to m=560 at N=2000 is ' +
      'O(N^2) per matvec); this module re-derives the fits, local exponents and amplitude ratios arithmetically from ' +
      'the baked gaps and does NOT re-run the heavy assembly at import.',
    amplitudeLawIsEmpirical:
      'The j^2-1 amplitude ordering is an empirical structural observation of the paired leading spectrum; it is now ' +
      'corroborated by four pair-ratios (a_3/a_2 = 8/3 from imp-3602, a_4/a_2 = 5 and a_4/a_3 = 15/8 from imp-3619, ' +
      'and a_5/a_2 = 8, a_5/a_3 = 3, a_5/a_4 = 8/5 here), tested through pair j = 5 only, and is offered as a candidate ' +
      'law, NOT a derived one.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3640_SKEW_TOEPLITZ_FOURTH_GAP_EXPONENT_ASSERTIONS = [
  {
    id: 'imp3640-fourth-gap-global-fit-converges-to-minus-two',
    why: 'The global log-log fit of the fourth gap -log(lambda_9/lambda_1) must give an exponent in (-2, -1.97) with ' +
      'R^2 > 0.9999 and must match the first-gap exponent to < 1.5e-3 -- so the -2 section-gap heuristic governs the ' +
      'fourth gap, not only the first three.',
    holds: () => fourthGapConvergesToMinusTwo && gapsShareSameExponent,
  },
  {
    id: 'imp3640-local-fourth-gap-exponent-climbs-toward-minus-two',
    why: 'The local pairwise log-log exponent of the fourth gap must climb MONOTONICALLY toward -2 from above (each ' +
      'in (-2, -1.94)) and be indistinguishable from the first-gap local exponent (< 5e-3 apart) at every rung.',
    holds: () => localFourthClimbsMonotone && localExponentsMatchFirstGap && finestFourthExponent < -1.99 && finestFourthExponent > HEURISTIC_Q,
  },
  {
    id: 'imp3640-amplitude-law-a5-over-a2-tends-to-eight',
    why: 'THE PRIMARY DELIVERABLE: the ratio -log sigma_4 / -log rho must be nearly constant across the ladder ' +
      '(spread < 3.1e-2) and tend to a_5/a_2 = 8 at the finest rung -- the imp-3619 j^2-1 amplitude law tested at ' +
      'pair j=5.',
    holds: () => amplitudeRatio52NearlyConstant && amplitudeRatio52TendsToEight && ratio52Min > 8.0 && ratio52Max < 8.05,
  },
  {
    id: 'imp3640-amplitude-law-a5-over-a3-and-a5-over-a4',
    why: 'Two independent checks of the SAME j^2-1 law: -log sigma_4 / -log sigma_2 must tend to a_5/a_3 = 3 and ' +
      '-log sigma_4 / -log sigma_3 must tend to a_5/a_4 = 8/5 = 1.6 at the finest rung, confirming the amplitude ' +
      'ordering across three distinct pair-ratios.',
    holds: () => amplitudeRatio53TendsToThree && amplitudeRatio54TendsToEightFifths,
  },
  {
    id: 'imp3640-lower-gaps-reproduce-imp3619-ladder',
    why: 'Self-check: the third/second/first-gap -log read off the SAME converged spectrum must reproduce the ' +
      'imp-3619 baked ladder (N=160/1200/2000) to < 3e-12, confirming the fourth gap is measured on the imp-3619 ' +
      'assembly.',
    holds: () => lowerGapsReproduceImp3619,
  },
  {
    id: 'imp3640-lambda9-is-a-genuine-fifth-pair-level',
    why: 'The lambda_9=lambda_10 pair degeneracy must hold to relative < 5e-11 at every rung (adjacent-paired, the ' +
      'imp-3596 dense-certified mechanism), so lambda_9 is a real fifth-pair level and every rung is Krylov-locked.',
    holds: () => lambda9IsGenuinePairLevel && allRungsKrylovLocked,
  },
  {
    id: 'imp3640-verdict-fourth-gap-obeys-minus-two-and-j2minus1-law',
    why: 'The classified verdict must be the confirming full-leading-spectrum result, not indeterminate; a flip means ' +
      'the fourth-gap convergence, the exponent match, the j^2-1 amplitude ratios, or the pairing failed.',
    holds: () => verdict.startsWith('FOURTH-GAP-lambda_9/lambda_1-ALSO-CONVERGES-TO-THE--2-HEURISTIC'),
  },
  {
    id: 'imp3640-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- measures a fourth gap exponent and tests the j^2-1 amplitude law at ' +
      'pair j=5, positivity not attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3640_SKEW_TOEPLITZ_FOURTH_GAP_EXPONENT.honestCaveat;
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

for (const assertion of IMP3640_SKEW_TOEPLITZ_FOURTH_GAP_EXPONENT_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3640-skew-toeplitz-fourth-gap-exponent assertion failed: ${assertion.id}`);
  }
}

export default IMP3640_SKEW_TOEPLITZ_FOURTH_GAP_EXPONENT;
