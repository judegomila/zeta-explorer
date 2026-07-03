/**
 * @module imp-3656-skew-toeplitz-triple-gap-ladder-viz-data
 *
 * imp-3656 (ux): lightweight, import-light viz-data module for a chart of the THREE
 * skew-Toeplitz section gaps -log rho, -log sigma_2, -log sigma_3 across N=160..2000,
 * all climbing toward the -2 section-gap exponent, plus the near-constant amplitude
 * ratios -log sigma_2/-log rho -> 8/3 and -log sigma_3/-log rho -> 5 that signature the
 * imp-3602 a_j proportional to (j^2-1) law (a_2:a_3:a_4 = 3:8:15).
 *
 * Reference literals are baked from the imp-3619 THIRD_GAP_LADDER (which itself
 * reproduces the imp-3602 second-gap/first-gap ladder to < 3e-12) -- no re-derivation.
 *
 * @see imp-3619-skew-toeplitz-third-gap-exponent.js (source module: THIRD_GAP_LADDER)
 * @see imp-3602-skew-toeplitz-second-gap-exponent.js (the second gap and the j^2-1 law origin)
 */

export const IMP3656_TRIPLE_GAP_LADDER = [
  { N: 160, logInvRho1: 0.022994794497539755, logInvSigma2: 0.06137468003985359, logInvSigma3: 0.11522021760361348 },
  { N: 240, logInvRho1: 0.010412511115177478, logInvSigma2: 0.027778273090528532, logInvSigma3: 0.052114444908097565 },
  { N: 320, logInvRho1: 0.005912775566738924, logInvSigma2: 0.015771170123876705, logInvSigma3: 0.02958079911915366 },
  { N: 400, logInvRho1: 0.0038059150436303684, logInvSigma2: 0.010150676343677334, logInvSigma3: 0.019036628273007866 },
  { N: 480, logInvRho1: 0.0026531601039626557, logInvSigma2: 0.007075858864687542, logInvSigma3: 0.0132692407893222 },
  { N: 640, logInvRho1: 0.0014996127973944844, logInvSigma2: 0.003999212879991317, logInvSigma3: 0.00749916776889671 },
  { N: 800, logInvRho1: 0.0009625430796918385, logInvSigma2: 0.0025668828768265323, logInvSigma3: 0.004813171226886281 },
  { N: 1000, logInvRho1: 0.0006174642590511195, logInvSigma2: 0.0016466131266931645, logInvSigma3: 0.003087509214267233 },
  { N: 1200, logInvRho1: 0.0004294624385316425, logInvSigma2: 0.0011452533976152068, logInvSigma3: 0.002147403205083366 },
  { N: 1600, logInvRho1: 0.00024204388718173853, logInvSigma2: 0.0006454567995726084, logInvSigma3: 0.0012102483854227106 },
  { N: 2000, logInvRho1: 0.00015508964024853381, logInvSigma2: 0.00041357501754696113, logInvSigma3: 0.0007754600964098744 },
];

export const IMP3656_HEURISTIC_Q = -2; // shared skew-Toeplitz section-gap exponent

// j^2-1 amplitude signature: a_j proportional to (j^2-1) for pair index j = 2, 3, 4
export const IMP3656_AMPLITUDE_SIGNATURE = Object.freeze({ a2: 3, a3: 8, a4: 15 });
export const IMP3656_A3_OVER_A2 = 8 / 3; // -log sigma_2 / -log rho target (imp-3602)
export const IMP3656_A4_OVER_A2 = 5; // -log sigma_3 / -log rho target (imp-3619)

export const IMP3656_RATIO_LADDER = IMP3656_TRIPLE_GAP_LADDER.map((r) => ({
  N: r.N,
  ratioSigma2ToRho: r.logInvSigma2 / r.logInvRho1,
  ratioSigma3ToRho: r.logInvSigma3 / r.logInvRho1,
}));
