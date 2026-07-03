/**
 * @module imp-3698-fifth-pair-adjacent-pairing-viz-data
 *
 * imp-3698 (ux): lightweight, import-light viz-data module for a chart of the imp-3668
 * dense fifth-pair adjacent-pairing cross-check: the top-10 skew-Toeplitz Gram
 * eigenvalues degenerate pairwise (lambda_1=lambda_2, ..., lambda_9=lambda_10) to
 * < 1.4e-15 at the deep rungs N in {1200, 1600, 2000}, and the fifth-pair amplitude
 * sigma_4 = lambda_9/lambda_1 climbs 0.99657 -> 0.99807 -> 0.99876 toward 1 with depth.
 *
 * Reference literals are baked from the imp-3668 measured.rungs table (self-computing
 * at import) -- no re-derivation here.
 *
 * @see imp-3668-skew-toeplitz-fifth-pair-dense-crossval.js (source module: denseTop10, sigma4Ladder, verdict)
 */

export const IMP3698_RUNGS = [
  {
    N: 1200,
    denseTop10: [
      4.214343608213908e-9, 4.214343608213907e-9, 4.212534094517934e-9, 4.212534094517927e-9,
      4.209519879600895e-9, 4.209519879600894e-9, 4.205303423177364e-9, 4.205303423177354e-9,
      4.19988816455154e-9, 4.19988816455154e-9,
    ],
    worstPairSpread: 0,
    sigma4: 0.9965699418447529,
  },
  {
    N: 1600,
    denseTop10: [
      4.214606892680916e-9, 4.214606892680914e-9, 4.213586896292689e-9, 4.213586896292687e-9,
      4.211887423748783e-9, 4.211887423748778e-9, 4.209509256818997e-9, 4.209509256818992e-9,
      4.206453489211553e-9, 4.206453489211553e-9,
    ],
    worstPairSpread: 0,
    sigma4: 0.9980654415282425,
  },
  {
    N: 2000,
    denseTop10: [
      4.214729052176358e-9, 4.214729052176355e-9, 4.214075442049284e-9, 4.214075442049272e-9,
      4.212986305937732e-9, 4.212986305937727e-9, 4.21146196489085e-9, 4.211461964890849e-9,
      4.209502868174942e-9, 4.209502868174936e-9,
    ],
    worstPairSpread: 1.38e-15,
    sigma4: 0.9987600189865782,
  },
];

export const IMP3698_PAIR_LABELS = ['lambda_1=2', 'lambda_3=4', 'lambda_5=6', 'lambda_7=8', 'lambda_9=10'];

export const IMP3698_WORST_FIFTH_PAIR = 1.38e-15;
export const IMP3698_SIGMA4_FIRST = 0.99657;
export const IMP3698_SIGMA4_LAST = 0.99876;
