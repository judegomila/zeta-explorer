/**
 * @module imp-3633-twin-skew-toeplitz-gap-ladder-viz-data
 *
 * imp-3633 (ux): lightweight, import-light viz-data module for a chart of the TWIN
 * imp-3602 skew-Toeplitz gaps -log rho = -log(lambda_3/lambda_1) and
 * -log sigma_2 = -log(lambda_5/lambda_1) across N=160..2000, both climbing toward the
 * -2 section-gap exponent, with the near-constant amplitude ratio
 * -log sigma_2 / -log rho ~ 8/3 drawn as the fixed-multiple signature.
 *
 * Reference literals are baked from the imp-3602 SECOND_GAP_LADDER -- no re-derivation.
 *
 * @see imp-3602-skew-toeplitz-second-gap-exponent.js (source module: SECOND_GAP_LADDER)
 */

export const IMP3633_TWIN_GAP_LADDER = [
  { N: 160, logInvRho1: 0.02299479449754021, logInvSigma2: 0.06137468003985347 },
  { N: 240, logInvRho1: 0.010412511115183086, logInvSigma2: 0.02777827309052956 },
  { N: 320, logInvRho1: 0.005912775566738589, logInvSigma2: 0.01577117012387603 },
  { N: 400, logInvRho1: 0.003805915043645302, logInvSigma2: 0.010150676343681372 },
  { N: 480, logInvRho1: 0.0026531601039376093, logInvSigma2: 0.007075858864687542 },
  { N: 640, logInvRho1: 0.0014996127973934837, logInvSigma2: 0.003999212879995552 },
  { N: 800, logInvRho1: 0.0009625430796462755, logInvSigma2: 0.0025668828768283134 },
  { N: 1000, logInvRho1: 0.0006174642590372331, logInvSigma2: 0.00164661312669183 },
  { N: 1200, logInvRho1: 0.00042946243853075395, logInvSigma2: 0.0011452533976304342 },
  { N: 1600, logInvRho1: 0.0002420438871706336, logInvSigma2: 0.0006454567995634987 },
  { N: 2000, logInvRho1: 0.00015508964022665903, logInvSigma2: 0.0004135750175458504 },
];

export const IMP3633_HEURISTIC_Q = -2; // shared skew-Toeplitz section-gap exponent
export const IMP3633_A3_OVER_A2 = 8 / 3; // -log sigma_2 / -log rho target (imp-3602)

export const IMP3633_RATIO_LADDER = IMP3633_TWIN_GAP_LADDER.map((r) => ({
  N: r.N,
  ratioSigma2ToRho: r.logInvSigma2 / r.logInvRho1,
}));
