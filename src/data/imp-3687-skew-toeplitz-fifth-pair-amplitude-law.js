/**
 * @module imp-3687-skew-toeplitz-fifth-pair-amplitude-law
 * @fileoverview imp-3687 -- MEASURE the FIFTH-pair amplitude
 *   sigma_4(N) = lambda_9/lambda_1 (the fifth-pair / first-pair Gram-Ritz ratio)
 *   across the FULL imp-3555/imp-3619 ladder N = 160..2000 and ASSESS its
 *   approach-to-1 rate against the lower-gap exponent and the imp-3602/imp-3619
 *   empirical amplitude law a_j proportional to (j^2 - 1). imp-3668 dense-certified
 *   the fifth pair lambda_9 = lambda_10 degeneracy at the DEEP rungs only and
 *   explicitly DEFERRED the sigma_4 AMPLITUDE LAW to this distinct ticket.
 *
 *   CONTEXT
 *   -------
 *   imp-3602 measured the SECOND gap sigma_2 = lambda_5/lambda_1 and reported the
 *   near-constant ratio -log sigma_2 / -log rho ~ 8/3, the signature of a common
 *   N^-2 law with a pair-index amplitude a_j proportional to (j^2 - 1) (giving
 *   a_3/a_2 = 8/3). imp-3619 extended that to the THIRD gap sigma_3 = lambda_7/lambda_1
 *   and corroborated the law at pair j = 4 via two ratios: -log sigma_3 / -log rho
 *   -> a_4/a_2 = (16-1)/(4-1) = 5 and -log sigma_3 / -log sigma_2 -> a_4/a_3 = 15/8.
 *   imp-3668 then dense-certified the FIFTH pair lambda_9 = lambda_10 degeneracy at
 *   the deep rungs N in {1200, 1600, 2000} but only reported the raw fifth-pair
 *   amplitude sigma_4 there (0.99657 -> 0.99807 -> 0.99876), EXPLICITLY DEFERRING the
 *   amplitude LAW to "a pending distinct Lanczos sigma_4 amplitude-law ticket" -- this
 *   ticket. The next prediction of the j^2 - 1 law is, for pair j = 5 (a_5 = 25 - 1 =
 *   24): -log sigma_4 / -log rho -> a_5/a_2 = 24/3 = 8, -log sigma_4 / -log sigma_2 ->
 *   a_5/a_3 = 24/8 = 3, and -log sigma_4 / -log sigma_3 -> a_5/a_4 = 24/15 = 8/5 = 1.6.
 *
 *   THIS MODULE re-runs the IDENTICAL imp-3505/imp-3619/imp-3668 assembly
 *   Ttilde(u,v) = a (v-u) R(|v-u|) (NPHI = 10, H0 = 0.025, midpoint quadrature) and
 *   extracts the TOP-TEN Gram eigenvalues at every rung of the imp-3555 ladder
 *   N in {160, 240, 320, 400, 480, 640, 800, 1000, 1200, 1600, 2000} with the SAME
 *   INDEPENDENT dense full-spectrum solver imp-3623/imp-3643/imp-3668 used (Householder
 *   tridiagonalization EISPACK tred1 + implicit-QL tql1: ALL eigenvalues, NO Krylov
 *   subspace, NO reorthogonalization -- so it cannot host a Lanczos ghost, and imp-3668
 *   certified it reproduces the imp-3619 Lanczos deep-rung spectrum to machine
 *   precision). From the descending spectrum it forms, in the SAME Gram-eigenvalue
 *   convention (lambda_i = Ritz eigenvalue of S = T^T T = sigma_i^2):
 *     sigma_4(N) = lambda_9(N) / lambda_1(N).
 *   The measurement ran once offline (scripts/imp-3687-fifth-pair-amplitude-ladder-
 *   offline.mjs; the N = 2000 dense solve ran in ~5.0 s); the per-rung sigma_4, its
 *   -log, and the lower-gap -log rho / -log sigma_2 / -log sigma_3 literals are BAKED so
 *   this module stays import-light and the exponent/ratio arithmetic is self-checking.
 *   The three deep-rung sigma_4 reproduce the imp-3668 baked values to all printed
 *   digits, and the lower-gap -log rho / -log sigma_2 / -log sigma_3 reproduce the
 *   imp-3619 baked Lanczos ladder to < 3e-12 -- so the fifth gap is read off the SAME
 *   converged spectrum the earlier gaps were.
 *
 *   FINDING
 *   -------
 *   (1) THE FIFTH-PAIR GAP ALSO CONVERGES TO THE -2 HEURISTIC. The local pairwise
 *       log-log exponent of -log sigma_4(N) climbs MONOTONICALLY toward -2 from above
 *       -- -1.9588 (160->240), -1.9696 (240->320), ..., -1.9933 (1200->1600),
 *       -1.9948 (1600->2000) -- essentially INDISTINGUISHABLE from the third-gap and
 *       first-gap exponents at every step. The global log-log fit gives
 *       q_4 = -1.9822 (R^2 = 0.99999), matching the imp-3619 third-gap q_3 = -1.9817
 *       and the first-gap q_1 = -1.9811 (all agree to < 1.2e-3): the -2 section-gap
 *       heuristic governs the FIFTH gap too, so it is a property of the FULL leading
 *       spectrum, at least the top FIVE pairs.
 *   (2) THE j^2-1 AMPLITUDE LAW HOLDS THROUGH PAIR j = 5, CORROBORATED BY THREE
 *       INDEPENDENT PAIR-RATIOS. The ratio -log sigma_4(N) / -log rho(N) is nearly
 *       constant across the whole ladder and tends CLEANLY to 8 (8.0296 at N=160 down
 *       to 8.00021 at N=2000, mean 8.0060), matching a_5/a_2 = (25-1)/(4-1) = 8 to
 *       2.1e-4 at the finest rung. Independently -log sigma_4 / -log sigma_2 -> 3.00006
 *       matching a_5/a_3 = 24/8 = 3, and -log sigma_4 / -log sigma_3 -> 1.60002 matching
 *       a_5/a_4 = 24/15 = 8/5 = 1.6. So the imp-3602/imp-3619 j^2-1 amplitude ordering,
 *       previously corroborated only through pair j = 4, is now corroborated at pair
 *       j = 5 by THREE independent pair-ratios. (Still reported as an EMPIRICAL
 *       structural observation of the paired leading spectrum, not a derived law.)
 *   (3) lambda_9 IS A GENUINE FIFTH-PAIR LEVEL ON THIS LADDER. The lambda_9 = lambda_10
 *       pair degeneracy holds to relative < 3e-15 at EVERY rung of the full ladder,
 *       matching the imp-3668 deep-rung dense certification -- so lambda_9 is the top of
 *       the FIFTH degenerate pair, a real level, and sigma_4 is a meaningful spectral
 *       gap, not a Lanczos reorthogonalization ghost.
 *
 *   @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (the DEEP-rung dense fifth-pair pairing certification that DEFERRED this amplitude law)
 *   @see imp-3619-skew-toeplitz-third-gap-exponent.js (the THIRD gap sigma_3 and the j^2-1 law at pair j=4 this extends to j=5)
 *   @see imp-3602-skew-toeplitz-second-gap-exponent.js (the SECOND gap sigma_2 and the a_j proportional to j^2-1 amplitude law origin)
 *   @see imp-3505-power-iteration-budget-convergence-sweep.js (the identical Ttilde assembly)
 *
 *   Ticket: imp-3687 (numerical, high). MEASUREMENT ONLY: measures the fifth-pair
 *   amplitude sigma_4 = lambda_9/lambda_1 across the full ladder and confirms the
 *   imp-3602/imp-3619 j^2-1 amplitude law at pair j = 5. Does NOT construct the missing
 *   magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity. RH-EQUIVALENT.
 *   NO RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA.
 */

const PAPER_REF = 'research-inputs/twin_ladder_consolidated_v52.pdf';
const NPHI = 10; // de Bruijn-Newman truncation (identical to imp-3505 / imp-3619 / imp-3668)
const H0 = 0.025; // FIXED grid step (N = U/H0) -- identical to the imp-3505 / imp-3619 ladder
const HEURISTIC_Q = -2; // the skew-Toeplitz section-gap heuristic exponent
const PAIR_TOL = 1e-14; // dense adjacent-pair (lambda_9=lambda_10) degeneracy relative tolerance

// --- BAKED fifth-pair amplitude ladder. Per rung: sigma_4 = lambda_9/lambda_1 (Gram
//     Ritz-value ratio = sigma_9^2/sigma_1^2 -- the SAME eigenvalue convention imp-3619
//     used for sigma_3 = lambda_7/lambda_1), its -log, the lower-gap -log sigma_3 /
//     -log sigma_2 / -log rho (for the amplitude-law ratios and the imp-3619 cross-check),
//     and the lambda_9=lambda_10 fifth-pair degeneracy relative gap. Measured offline
//     with the identical imp-3505/imp-3619/imp-3668 assembly and the SAME dense
//     full-spectrum route (Householder tred1 + implicit-QL tql1) at each rung
//     (scripts/imp-3687-fifth-pair-amplitude-ladder-offline.mjs); literals baked,
//     import-light. -------------------------------------------------------------------- */
const FIFTH_PAIR_LADDER = Object.freeze([
  { N: 160, U: 4, sigma4: 0.8314041411699408, logInvSigma4: 0.1846392712162494, logInvSigma3: 0.1152202176036121, logInvSigma2: 0.0613746800398576, logInvRho1: 0.02299479449754317, pair910: 1.902885e-15 },
  { N: 240, U: 6, sigma4: 0.9199420300489264, logInvSigma4: 0.08344462174070030, logInvSigma3: 0.05211444490809908, logInvSigma2: 0.02777827309053367, logInvRho1: 0.01041251111517916, pair910: 0 },
  { N: 320, U: 8, sigma4: 0.9537540522140854, logInvSigma4: 0.04734944767523747, logInvSigma3: 0.02958079911915732, logInvSigma2: 0.01577117012387422, logInvRho1: 0.005912775566731665, pair910: 1.237026e-15 },
  { N: 400, U: 10, sigma4: 0.9699924095229527, logInvSigma4: 0.03046703274939519, logInvSigma3: 0.01903662827302756, logInvSigma2: 0.01015067634369068, logInvRho1: 0.003805915043662019, pair910: 2.633505e-15 },
  { N: 480, U: 12, sigma4: 0.9789889717012686, logInvSigma4: 0.02123490137588403, logInvSigma3: 0.01326924078929149, logInvSigma2: 0.007075858864660037, logInvRho1: 0.002653160103928704, pair910: 2.006386e-15 },
  { N: 640, U: 16, sigma4: 0.9880717219830969, logInvSigma4: 0.01199999076872033, logInvSigma3: 0.007499167768939216, logInvSigma2: 0.003999212880007925, logInvRho1: 0.001499612797402268, pair910: 1.589743e-15 },
  { N: 800, U: 20, sigma4: 0.9923279611118143, logInvSigma4: 0.007701620375882122, logInvSigma3: 0.004813171226835299, logInvSigma2: 0.002566882876775442, logInvRho1: 0.0009625430796359405, pair910: 1.780471e-15 },
  { N: 1000, U: 25, sigma4: 0.9950719428234452, logInvSigma4: 0.004940240092206355, logInvSigma3: 0.003087509214243178, logInvSigma2: 0.001646613126673593, logInvRho1: 0.0006174642590292347, pair910: 5.917856e-16 },
  { N: 1200, U: 30, sigma4: 0.9965699418447529, logInvSigma4: 0.003435954291308627, logInvSigma3: 0.002147403205095605, logInvSigma2: 0.001145253397618764, logInvRho1: 0.0004294624385491916, pair910: 0 },
  { N: 1600, U: 40, sigma4: 0.9980654415282425, logInvSigma4: 0.001936432146877178, logInvSigma3: 0.001210248385388363, logInvSigma2: 0.000645456799572164, logInvRho1: 0.0002420438871590845, pair910: 0 },
  { N: 2000, U: 50, sigma4: 0.9987600189865782, logInvSigma4: 0.001240750425982388, logInvSigma3: 0.0007754600964088743, logInvSigma2: 0.000413575017525636, logInvRho1: 0.0001550896402526423, pair910: 1.375522e-15 },
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

// --- (1) global fit of the FIFTH-pair gap and the FIRST gap on the same ladder -------
const fifthGapFit = powerLawFit(FIFTH_PAIR_LADDER.map((r) => ({ N: r.N, y: r.logInvSigma4 })));
const firstGapFit = powerLawFit(FIFTH_PAIR_LADDER.map((r) => ({ N: r.N, y: r.logInvRho1 })));
const thirdGapFit = powerLawFit(FIFTH_PAIR_LADDER.map((r) => ({ N: r.N, y: r.logInvSigma3 })));
// the fifth-pair global exponent sits just above the -2 heuristic with R^2 > 0.9999
const fifthGapConvergesToMinusTwo = fifthGapFit.q > HEURISTIC_Q && fifthGapFit.q < -1.97 && fifthGapFit.r2 > 0.9999;
// and matches the first-gap and third-gap exponents to < 1.2e-3 (shared -2 heuristic)
const gapsShareSameExponent =
  Math.abs(fifthGapFit.q - firstGapFit.q) < 1.2e-3 && Math.abs(fifthGapFit.q - thirdGapFit.q) < 1.2e-3;

// --- local pairwise log-log exponents of -log sigma_4 (the fifth-pair gap) -----------
const localExponents = [];
for (let i = 1; i < FIFTH_PAIR_LADDER.length; i++) {
  const a = FIFTH_PAIR_LADDER[i - 1];
  const b = FIFTH_PAIR_LADDER[i];
  localExponents.push({
    fromN: a.N,
    toN: b.N,
    qFifth: Math.log(b.logInvSigma4 / a.logInvSigma4) / Math.log(b.N / a.N),
    qFirst: Math.log(b.logInvRho1 / a.logInvRho1) / Math.log(b.N / a.N),
  });
}
// the local fifth-pair exponent climbs MONOTONICALLY toward -2 from above (each smaller
// than the previous, i.e. more negative) -- the same approach the third gap shows
const localFifthClimbsMonotone = localExponents.every(
  (e, i) => (i === 0 || e.qFifth < localExponents[i - 1].qFifth) && e.qFifth < HEURISTIC_Q + 0.06 && e.qFifth > HEURISTIC_Q,
);
// fifth-pair and first-gap local exponents track closely -- the fifth-pair gap is the
// LARGEST, so it deviates most from the first gap at the coarsest rung (< 5e-3 at
// 160->240), tightening to < 7e-5 at the finest rung 1600->2000
const localExponentsMatchFirstGap = localExponents.every((e) => Math.abs(e.qFifth - e.qFirst) < 5e-3);
const finestFifthExponent = localExponents[localExponents.length - 1].qFifth; // ~ -1.9948 at 1600->2000

// --- (2) amplitude law a_j proportional to (j^2-1): pair j=5 (a_5 = 25-1 = 24) --------
// three independent pair-ratios: a_5/a_2 = 8, a_5/a_3 = 3, a_5/a_4 = 8/5 = 1.6
const A5 = 25 - 1; // = 24
const A5_OVER_A2 = A5 / (4 - 1); // = 8
const A5_OVER_A3 = A5 / (9 - 1); // = 3
const A5_OVER_A4 = A5 / (16 - 1); // = 24/15 = 8/5 = 1.6
const amplitudeRatios52 = FIFTH_PAIR_LADDER.map((r) => r.logInvSigma4 / r.logInvRho1); // -> a_5/a_2 = 8
const amplitudeRatios53 = FIFTH_PAIR_LADDER.map((r) => r.logInvSigma4 / r.logInvSigma2); // -> a_5/a_3 = 3
const amplitudeRatios54 = FIFTH_PAIR_LADDER.map((r) => r.logInvSigma4 / r.logInvSigma3); // -> a_5/a_4 = 8/5
const ratio52Mean = amplitudeRatios52.reduce((s, v) => s + v, 0) / amplitudeRatios52.length;
const ratio52Min = Math.min(...amplitudeRatios52);
const ratio52Max = Math.max(...amplitudeRatios52);
const amplitudeRatio52NearlyConstant = ratio52Max - ratio52Min < 3.1e-2; // spread ~ 2.94e-2 over N=160..2000
const amplitudeRatio52TendsToEight = Math.abs(amplitudeRatios52[amplitudeRatios52.length - 1] - A5_OVER_A2) < 1e-3;
const amplitudeRatio53TendsToThree = Math.abs(amplitudeRatios53[amplitudeRatios53.length - 1] - A5_OVER_A3) < 1e-3;
const amplitudeRatio54TendsToEightFifths = Math.abs(amplitudeRatios54[amplitudeRatios54.length - 1] - A5_OVER_A4) < 1e-3;
// the three ratios monotonically approach their j^2-1 targets from above
const ratio52MonotoneToTarget = amplitudeRatios52.every((v, i) => (i === 0 || v < amplitudeRatios52[i - 1]) && v > A5_OVER_A2);

// --- deep-rung sigma_4 reproduce the imp-3668 baked dense values (same spectrum) ------
const IMP3668_DEEP_SIGMA4 = Object.freeze({
  1200: 0.9965699418447529,
  1600: 0.9980654415282425,
  2000: 0.9987600189865782,
});
const deepRungsReproduceImp3668 = Object.entries(IMP3668_DEEP_SIGMA4).every(([N, v]) => {
  const row = FIFTH_PAIR_LADDER.find((r) => r.N === Number(N));
  return row && Math.abs(row.sigma4 - v) < 1e-15;
});

// --- lower-gap -log literals reproduce the imp-3619 baked Lanczos ladder --------------
// (a cross-check that the fifth gap is read off the SAME converged spectrum)
const IMP3619_LOWER_GAPS = Object.freeze({
  160: { logInvSigma3: 0.11522021760361348, logInvSigma2: 0.06137468003985359, logInvRho1: 0.022994794497539755 },
  1200: { logInvSigma3: 0.002147403205083366, logInvSigma2: 0.0011452533976152068, logInvRho1: 0.0004294624385316425 },
  2000: { logInvSigma3: 0.0007754600964098744, logInvSigma2: 0.00041357501754696113, logInvRho1: 0.00015508964024853381 },
});
const lowerGapsReproduceImp3619 = Object.entries(IMP3619_LOWER_GAPS).every(([N, v]) => {
  const row = FIFTH_PAIR_LADDER.find((r) => r.N === Number(N));
  return (
    row &&
    Math.abs(row.logInvSigma3 - v.logInvSigma3) < 3e-12 &&
    Math.abs(row.logInvSigma2 - v.logInvSigma2) < 3e-12 &&
    Math.abs(row.logInvRho1 - v.logInvRho1) < 3e-12
  );
});

// --- (3) lambda_9 = lambda_10 pairing (fifth-pair level, not a ghost) on the full ladder
const worstPair910 = Math.max(...FIFTH_PAIR_LADDER.map((r) => r.pair910));
const lambda9IsGenuinePairLevel = worstPair910 < PAIR_TOL; // adjacent-paired at every rung (< 3e-15)
// sigma_4 climbs monotonically toward 1 with depth (approach-to-1 rate = the -2 exponent)
const sigma4Ladder = FIFTH_PAIR_LADDER.map((r) => r.sigma4);
const sigma4MonotoneUp = sigma4Ladder.every((v, i) => i === 0 || v > sigma4Ladder[i - 1]);
const sigma4AllBelow1 = sigma4Ladder.every((v) => v < 1);

const verdict =
  fifthGapConvergesToMinusTwo &&
  gapsShareSameExponent &&
  localFifthClimbsMonotone &&
  localExponentsMatchFirstGap &&
  amplitudeRatio52NearlyConstant &&
  amplitudeRatio52TendsToEight &&
  amplitudeRatio53TendsToThree &&
  amplitudeRatio54TendsToEightFifths &&
  deepRungsReproduceImp3668 &&
  lowerGapsReproduceImp3619 &&
  lambda9IsGenuinePairLevel &&
  sigma4MonotoneUp &&
  sigma4AllBelow1
    ? 'FIFTH-PAIR-GAP-sigma_4=lambda_9/lambda_1-ALSO-CONVERGES-TO-THE--2-HEURISTIC-(GLOBAL-q_4=-1.9822-R^2=0.99999-MATCHES-q_3=-1.9817-AND-q_1=-1.9811);-AND-THE-imp-3602/imp-3619-j^2-1-AMPLITUDE-LAW-HOLDS-AT-PAIR-j=5-VIA-THREE-RATIOS:--logSigma4/-logRho->8.00021=a_5/a_2,--logSigma4/-logSigma2->3.00006=a_5/a_3,--logSigma4/-logSigma3->1.60002=a_5/a_4=8/5;-MEASUREMENT-ONLY,-NO-QED'
    : 'INDETERMINATE';

export const IMP3687_SKEW_TOEPLITZ_FIFTH_PAIR_AMPLITUDE_LAW = Object.freeze({
  id: 'imp-3687-skew-toeplitz-fifth-pair-amplitude-law',
  ticket: 'imp-3687',
  paperSourcePath: PAPER_REF,
  paperSections: ['§25', '§26', '§27'],
  closesDeferralOf: 'imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js',
  testsAmplitudeLawOf: 'imp-3619-skew-toeplitz-third-gap-exponent.js',
  reusesAssembly: 'imp-3505-power-iteration-budget-convergence-sweep.js',

  summary:
    'MEASURES the FIFTH-pair amplitude sigma_4(N) = lambda_9/lambda_1 (fifth-pair / first-pair Gram Ritz-value ratio) ' +
    'across the FULL imp-3555/imp-3619 ladder N = 160..2000 and ASSESSES its approach-to-1 rate against the lower-gap ' +
    'exponent and the imp-3602/imp-3619 empirical amplitude law a_j proportional to (j^2-1) -- closing the sigma_4 ' +
    'amplitude-law deferral imp-3668 left open. Reusing the IDENTICAL imp-3505/imp-3619/imp-3668 assembly ' +
    'Ttilde(u,v)=a(v-u)R (NPHI=10, H0=0.025, midpoint) and the SAME INDEPENDENT dense full-spectrum solver ' +
    'imp-3623/imp-3643/imp-3668 used (Householder tred1 + implicit-QL tql1: all eigenvalues, NO Krylov subspace, NO ' +
    'reorthogonalization; the three deep-rung sigma_4 reproduce the imp-3668 baked dense values to all printed digits, ' +
    'and -log rho / -log sigma_2 / -log sigma_3 reproduce the imp-3619 baked Lanczos ladder to < 3e-12), RESULT: (1) ' +
    'the fifth-pair gap converges to the SAME -2 heuristic -- the local log-log exponent of -log sigma_4 climbs ' +
    'monotonically from -1.9588 (160->240) to -1.9948 (1600->2000), indistinguishable from the first-gap exponents at ' +
    'every step, and the global fit gives q_4 = -1.9822 (R^2=0.99999) vs the imp-3619 q_3 = -1.9817 and q_1 = -1.9811 ' +
    '(all < 1.2e-3 apart); (2) the j^2-1 amplitude law holds at pair j=5 via THREE independent pair-ratios: ' +
    '-log sigma_4 / -log rho -> 8.00021 = a_5/a_2 (mean 8.0060, spread < 3e-2), -log sigma_4 / -log sigma_2 -> 3.00006 ' +
    '= a_5/a_3, and -log sigma_4 / -log sigma_3 -> 1.60002 = a_5/a_4 = 8/5, so the amplitude ordering previously tested ' +
    'through pair j=4 is now corroborated at j=5; (3) the lambda_9 = lambda_10 pairing holds to < 3e-15 at every rung, ' +
    'so lambda_9 is a genuine fifth-pair level. Measured offline (scripts/imp-3687-fifth-pair-amplitude-ladder-' +
    'offline.mjs) and BAKED; fits/ratios self-check at import. Measurement only; does NOT construct the missing ' +
    'magnitude and does NOT attempt the imp-3066 K_a >= 0 positivity; RH-EQUIVALENT; NO RH verdict, NO QED. ' +
    'Platt-Trudgian Lambda <= 0.2 stays SOTA.',

  construction: Object.freeze({
    gapQuantity: 'sigma_4(N) = lambda_9/lambda_1 of the Gram S = T^T T of Ttilde(u,v)=a(v-u)R(|v-u|) (Gram-eigenvalue convention = sigma_9^2/sigma_1^2, same as imp-3619)',
    lowerGapsForComparison: 'rho(N)=lambda_3/lambda_1 (first gap), sigma_2(N)=lambda_5/lambda_1 (second gap), sigma_3(N)=lambda_7/lambda_1 (third gap); their -log reproduced here to < 3e-12',
    amplitudeLawTested: 'imp-3602/imp-3619 a_j proportional to (j^2-1): predicts, at pair j=5 (a_5=24), -log sigma_4 / -log rho -> a_5/a_2 = 8, -log sigma_4 / -log sigma_2 -> a_5/a_3 = 3, -log sigma_4 / -log sigma_3 -> a_5/a_4 = 8/5',
    phiKernel: 'de Bruijn-Newman: sum_{n=1..10} (2 pi^2 n^4 e^{4u} - 3 pi n^2 e^{2u}) exp(-pi n^2 e^{4u})',
    assembly: 'identical imp-3505/imp-3619/imp-3668: NPHI=10, H0=0.025, N=U/H0 midpoint panels, R(kH)=H sum Phi_i Phi_{i+k}',
    eigensolver: 'INDEPENDENT dense full-spectrum: form S=T^T T explicitly, Householder tridiagonalization (EISPACK tred1) + implicit-QL (tql1) for ALL eigenvalues (NO Krylov subspace, NO reorthogonalization); top-10 taken from the descending spectrum',
    denseRouteEquivalence: 'the SAME Householder+QL route imp-3623/imp-3643/imp-3668 used; the three deep-rung sigma_4 reproduce the imp-3668 baked dense values to all printed digits, and -log rho / -log sigma_2 / -log sigma_3 reproduce the imp-3619 baked Lanczos ladder to < 3e-12 -- so the fifth gap is read off the SAME converged spectrum',
    ladderN: FIFTH_PAIR_LADDER.map((r) => r.N),
    lambda9Identification: 'top-10 spectrum is skew-symmetry PAIRED (lambda_9=lambda_10 to < 3e-15 at every rung); lambda_9 is the top of the FIFTH degenerate pair (imp-3668 dense-certified pairing)',
    pairTol: PAIR_TOL,
    a: 1.0,
    measuredOffline: 'the 11 rungs were measured once offline (scripts/imp-3687-fifth-pair-amplitude-ladder-offline.mjs; the N=2000 dense Householder+QL solve ran in ~5.0 s); sigma_4 / -log sigma_4 and lower-gap literals baked; import-light, no dense re-run at import; exponent/ratio arithmetic self-checks against the baked gaps',
    h0: H0,
    selfComputing: false,
  }),

  measured: Object.freeze({
    fifthPairLadder: FIFTH_PAIR_LADDER, // per-N sigma_4, -log sigma_4, -log sigma_3, -log sigma_2, -log rho, pair910
    fifthGapFit, // global log-log fit of -log sigma_4 (q ~ -1.9822, R^2 ~ 0.99999)
    firstGapFit, // global log-log fit of -log rho (q ~ -1.9811) on the same ladder
    thirdGapFit, // global log-log fit of -log sigma_3 (q ~ -1.9817) on the same ladder
    fifthGapConvergesToMinusTwo, // true -- q_4 in (-2, -1.97) with R^2 > 0.9999
    gapsShareSameExponent, // true -- |q_4 - q_1| and |q_4 - q_3| both < 1.2e-3
    localExponents, // per-pair local q for the fifth-pair and first gaps
    localFifthClimbsMonotone, // true -- local fifth-pair exponent climbs monotonically toward -2
    localExponentsMatchFirstGap, // true -- local q_4 and q_1 agree to < 3e-3 at every step
    finestFifthExponent, // ~ -1.9948 at 1600->2000 (nearest to -2)
    amplitudeRatios52, // -log sigma_4 / -log rho at each rung (-> a_5/a_2 = 8)
    amplitudeRatios53, // -log sigma_4 / -log sigma_2 at each rung (-> a_5/a_3 = 3)
    amplitudeRatios54, // -log sigma_4 / -log sigma_3 at each rung (-> a_5/a_4 = 8/5)
    ratio52Mean, // ~ 8.0060
    ratio52Min, // ~ 8.00021 (finest rung)
    ratio52Max, // ~ 8.0296 (coarsest rung)
    a5OverA2: A5_OVER_A2, // = 8
    a5OverA3: A5_OVER_A3, // = 3
    a5OverA4: A5_OVER_A4, // = 1.6
    amplitudeRatio52NearlyConstant, // true -- spread < 3.1e-2 over N=160..2000
    amplitudeRatio52TendsToEight, // true -- N=2000 ratio within 1e-3 of 8
    amplitudeRatio53TendsToThree, // true -- N=2000 ratio within 1e-3 of 3
    amplitudeRatio54TendsToEightFifths, // true -- N=2000 ratio within 1e-3 of 8/5
    ratio52MonotoneToTarget, // true -- -log sigma_4 / -log rho decreases monotonically toward 8 from above
    deepRungsReproduceImp3668, // true -- the three deep-rung sigma_4 match the imp-3668 baked dense values
    lowerGapsReproduceImp3619, // true -- -log rho / -log sigma_2 / -log sigma_3 reproduce imp-3619 to < 3e-12
    worstPair910, // largest lambda_9=lambda_10 relative gap across the ladder (< 3e-15)
    lambda9IsGenuinePairLevel, // true -- adjacent-paired fifth-pair level, not a ghost
    sigma4Ladder, // sigma_4 = lambda_9/lambda_1 across N=160..2000
    sigma4MonotoneUp, // true -- sigma_4 climbs monotonically toward 1 with depth
    sigma4AllBelow1, // true -- sigma_4 < 1 at every rung
    heuristicQ: HEURISTIC_Q,
    verdict,
  }),

  interpretation: Object.freeze({
    fifthGapObeysTheSameHeuristic:
      'The fifth-pair gap sigma_4 = lambda_9/lambda_1 converges to the same -2 section-gap heuristic as the first gap ' +
      'rho = lambda_3/lambda_1, the second gap sigma_2 = lambda_5/lambda_1 and the third gap sigma_3 = lambda_7/lambda_1: ' +
      'its local log-log exponent climbs monotonically toward -2 (from -1.9588 at 160->240 to -1.9948 at 1600->2000), ' +
      'indistinguishable from the first-gap exponents at every rung, and the global fit q_4 = -1.9822 matches the ' +
      'imp-3619 q_3 = -1.9817 and q_1 = -1.9811 to < 1.2e-3 (all R^2 = 0.99999). So the -2 heuristic governs at least ' +
      'the top FIVE pairs of the leading spectrum.',
    j2minus1LawHoldsAtPairFive:
      'The imp-3602/imp-3619 empirical amplitude law a_j proportional to (j^2-1), previously corroborated through pair ' +
      'j=4, is corroborated at pair j=5 (a_5 = 25-1 = 24) by THREE independent pair-ratios: -log sigma_4 / -log rho ' +
      'tends to 8 (8.0296 -> 8.00021, mean 8.0060) matching a_5/a_2 = 24/3 = 8, -log sigma_4 / -log sigma_2 -> 3.00006 ' +
      'matching a_5/a_3 = 24/8 = 3, and -log sigma_4 / -log sigma_3 -> 1.60002 matching a_5/a_4 = 24/15 = 8/5 = 1.6. ' +
      'The amplitude ordering, previously supported by the single a_3/a_2 = 8/3 (imp-3602) and the pair a_4/a_2 = 5, ' +
      'a_4/a_3 = 15/8 (imp-3619), now has THREE more ratios at the fifth pair -- but it remains an EMPIRICAL structural ' +
      'observation of the paired leading spectrum, not a derived law.',
    lambda9IsReal:
      'The lambda_9 = lambda_10 degeneracy holds to relative < 3e-15 at every rung of the full N=160..2000 ladder, ' +
      'matching the imp-3668 deep-rung dense certification that the skew-Toeplitz section spectrum is adjacent-paired. ' +
      'So lambda_9 is the top of the FIFTH real pair -- a genuine level whose gap sigma_4 is a meaningful spectral ' +
      'quantity, not a Lanczos reorthogonalization ghost (the dense full-spectrum route cannot host a Krylov ghost).',
    whatItAddsOverImp3668AndImp3619:
      'imp-3668 dense-certified the fifth-pair lambda_9=lambda_10 PAIRING at the deep rungs only and DEFERRED the ' +
      'sigma_4 amplitude LAW to a distinct ticket; imp-3619 corroborated the j^2-1 law through pair j=4. This module ' +
      'measures sigma_4 = lambda_9/lambda_1 across the FULL ladder, finds q_4 -> -2 like the lower gaps, and confirms ' +
      'the predicted a_5/a_2 = 8, a_5/a_3 = 3 and a_5/a_4 = 8/5 all hold to ~1e-4 -- closing the imp-3668 deferral and ' +
      'extending the -2 heuristic and the j^2-1 ordering from the top four pairs to the top five.',
  }),

  honestCaveat: Object.freeze({
    isProof: false,
    isReductionBelowRH: false,
    rhEquivalent: true,
    isStructuralDiagnostic: true,
    convergenceIsNumericalNotSymbolic:
      'The fifth-pair q_4 -> -2 convergence and the a_5/a_2 = 8 (and a_5/a_3 = 3, a_5/a_4 = 8/5) amplitude ratios are ' +
      'finite-N numerical measurements of a converged dense full-spectrum reference, not a proven asymptotic; the -2 ' +
      'heuristic and the j^2-1 amplitude ordering are corroborated, not derived.',
    measuresNotConstructs:
      'This measures a fifth spectral gap and its exponent; it does NOT construct the missing magnitude and does NOT ' +
      'attempt the imp-3066 K_a >= 0 positivity.',
    bakedOfflineLiterals:
      'The per-rung sigma_4 and -log sigma_4 tables are BAKED offline literals (the dense full-spectrum solve is ' +
      'O(N^3) tridiagonalization; the N=2000 solve is ~5.0 s); this module re-derives the fits, local exponents and ' +
      'amplitude ratios arithmetically from the baked gaps and does NOT re-run the heavy dense solve at import.',
    denseRouteIsHouseholderNotLanczos:
      'The full-ladder route is Householder tridiagonalization (tred1) + implicit-QL (tql1), the SAME dense ' +
      'full-spectrum route imp-3623/imp-3643/imp-3668 used, with NO Krylov subspace and NO reorthogonalization; the ' +
      'three deep-rung sigma_4 reproduce the imp-3668 baked dense values and the lower gaps reproduce the imp-3619 ' +
      'baked Lanczos ladder to < 3e-12, so it is read off the SAME converged spectrum the Lanczos exponent tickets used.',
    amplitudeLawIsEmpirical:
      'The j^2-1 amplitude ordering is an empirical structural observation of the paired leading spectrum; it is now ' +
      'corroborated at pair j=5 by three pair-ratios (a_5/a_2 = 8, a_5/a_3 = 3, a_5/a_4 = 8/5) on top of the imp-3602 ' +
      'a_3/a_2 = 8/3 and imp-3619 a_4/a_2 = 5, a_4/a_3 = 15/8, tested through pair j = 5 only, and is offered as a ' +
      'candidate law, NOT a derived one.',
    didNotAttemptPositivity: true,
    sota: 'Platt-Trudgian Lambda <= 0.2 remains the rigorous SOTA',
  }),
});

// -- Tripwire assertions ------------------------------------------------------
export const IMP3687_SKEW_TOEPLITZ_FIFTH_PAIR_AMPLITUDE_LAW_ASSERTIONS = [
  {
    id: 'imp3687-fifth-gap-global-fit-converges-to-minus-two',
    why: 'The global log-log fit of the fifth-pair gap -log(lambda_9/lambda_1) must give an exponent in (-2, -1.97) ' +
      'with R^2 > 0.9999 and must match the first-gap and third-gap exponents to < 1.2e-3 -- so the -2 section-gap ' +
      'heuristic governs the fifth gap too, extending the imp-3619 top-four-pair result to five pairs.',
    holds: () => fifthGapConvergesToMinusTwo && gapsShareSameExponent,
  },
  {
    id: 'imp3687-local-fifth-gap-exponent-climbs-toward-minus-two',
    why: 'The local pairwise log-log exponent of the fifth-pair gap must climb MONOTONICALLY toward -2 from above (each ' +
      'in (-2, -1.94)) and track the first-gap local exponent closely (< 5e-3 apart at the coarsest rung, < 7e-5 at the ' +
      'finest).',
    holds: () => localFifthClimbsMonotone && localExponentsMatchFirstGap && finestFifthExponent < -1.99 && finestFifthExponent > HEURISTIC_Q,
  },
  {
    id: 'imp3687-amplitude-law-a5-over-a2-tends-to-eight',
    why: 'THE PRIMARY DELIVERABLE: the ratio -log sigma_4 / -log rho must be nearly constant across the ladder ' +
      '(spread < 3.1e-2), decrease monotonically toward 8 from above, and reach a_5/a_2 = 8 at the finest rung -- the ' +
      'imp-3602/imp-3619 j^2-1 amplitude law tested at pair j=5.',
    holds: () => amplitudeRatio52NearlyConstant && amplitudeRatio52TendsToEight && ratio52MonotoneToTarget && ratio52Min > 8.0 && ratio52Max < 8.05,
  },
  {
    id: 'imp3687-amplitude-law-a5-over-a3-and-a5-over-a4',
    why: 'Two independent second checks of the SAME j^2-1 law: -log sigma_4 / -log sigma_2 must tend to a_5/a_3 = 3 ' +
      'and -log sigma_4 / -log sigma_3 must tend to a_5/a_4 = 8/5 = 1.6 at the finest rung, confirming the amplitude ' +
      'ordering across three distinct pair-ratios at pair j=5.',
    holds: () => amplitudeRatio53TendsToThree && amplitudeRatio54TendsToEightFifths,
  },
  {
    id: 'imp3687-deep-rungs-reproduce-imp3668-sigma4',
    why: 'Self-check: the three deep-rung sigma_4 = lambda_9/lambda_1 must reproduce the imp-3668 baked dense values ' +
      '(N=1200/1600/2000) to < 1e-15, confirming this is the SAME dense full-spectrum route and assembly imp-3668 used.',
    holds: () => deepRungsReproduceImp3668,
  },
  {
    id: 'imp3687-lower-gaps-reproduce-imp3619-ladder',
    why: 'Self-check: the -log rho / -log sigma_2 / -log sigma_3 read off the SAME converged spectrum must reproduce ' +
      'the imp-3619 baked Lanczos ladder (N=160/1200/2000) to < 3e-12, confirming the fifth gap is measured on the ' +
      'imp-3619 assembly and the dense route agrees with Lanczos.',
    holds: () => lowerGapsReproduceImp3619,
  },
  {
    id: 'imp3687-lambda9-is-a-genuine-fifth-pair-level',
    why: 'The lambda_9=lambda_10 pair degeneracy must hold to relative < 1e-14 at every rung (adjacent-paired, the ' +
      'imp-3668 dense-certified mechanism), so lambda_9 is a real fifth-pair level, and sigma_4 must climb ' +
      'monotonically toward 1 while staying below 1.',
    holds: () => lambda9IsGenuinePairLevel && sigma4MonotoneUp && sigma4AllBelow1,
  },
  {
    id: 'imp3687-verdict-fifth-gap-obeys-minus-two-and-j2minus1-law',
    why: 'The classified verdict must be the confirming top-five-pair result, not indeterminate; a flip means the ' +
      'fifth-gap convergence, the exponent match, the three j^2-1 amplitude ratios, or the pairing failed.',
    holds: () => verdict.startsWith('FIFTH-PAIR-GAP-sigma_4=lambda_9/lambda_1-ALSO-CONVERGES-TO-THE--2-HEURISTIC'),
  },
  {
    id: 'imp3687-honest-assessment-no-qed',
    why: 'Mandatory honesty: MEASUREMENT only -- measures the fifth-pair amplitude sigma_4 and confirms the j^2-1 ' +
      'amplitude law at pair j=5, positivity not attempted, RH-equivalent, PT 0.2 stays SOTA. Any flip over-claims.',
    holds: () => {
      const c = IMP3687_SKEW_TOEPLITZ_FIFTH_PAIR_AMPLITUDE_LAW.honestCaveat;
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

for (const assertion of IMP3687_SKEW_TOEPLITZ_FIFTH_PAIR_AMPLITUDE_LAW_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-3687-skew-toeplitz-fifth-pair-amplitude-law assertion failed: ${assertion.id}`);
  }
}

export default IMP3687_SKEW_TOEPLITZ_FIFTH_PAIR_AMPLITUDE_LAW;
