/**
 * @module imp-3699-fit-bias-decay-viz-data
 *
 * imp-3699 (ux): lightweight, import-light viz-data module for a chart of the imp-3670
 * observable fit-bias decay: |p_fit-2| across n=3..18 matching |D_n| cov(a^2,ln a)/var(ln a)
 * to <= 2e-9 at every rung, the naive (ln n)^2/n^3 ratio drifting up ~2.9x (not yet constant),
 * and the saddle-corrected |D_n|/|D_n^saddle| falling monotonically to 1 from above.
 *
 * Reference literals are baked from the imp-3670 measured.rungs table (self-computing
 * at import) -- no re-derivation here.
 *
 * @see imp-3670-fit-bias-decay-rate-vs-lnsq.js (source module: rungs, ratios, verdict)
 */

export const IMP3699_RUNGS = [
  { n: 3, fitBias: 1.15751e-5, ratioToLnRate: 2.58940e-4, saddleDnRatio: 3.64422 },
  { n: 4, fitBias: 8.8592e-6, ratioToLnRate: 2.95028e-4, saddleDnRatio: 2.27278 },
  { n: 5, fitBias: 6.9853e-6, ratioToLnRate: 3.37092e-4, saddleDnRatio: 1.80924 },
  { n: 6, fitBias: 5.6390e-6, ratioToLnRate: 3.79398e-4, saddleDnRatio: 1.57932 },
  { n: 7, fitBias: 4.6399e-6, ratioToLnRate: 4.20302e-4, saddleDnRatio: 1.44333 },
  { n: 8, fitBias: 3.8789e-6, ratioToLnRate: 4.59286e-4, saddleDnRatio: 1.35419 },
  { n: 9, fitBias: 3.2863e-6, ratioToLnRate: 4.96232e-4, saddleDnRatio: 1.29167 },
  { n: 10, fitBias: 2.8163e-6, ratioToLnRate: 5.31179e-4, saddleDnRatio: 1.24564 },
  { n: 11, fitBias: 2.4375e-6, ratioToLnRate: 5.64231e-4, saddleDnRatio: 1.21052 },
  { n: 12, fitBias: 2.1280e-6, ratioToLnRate: 5.95514e-4, saddleDnRatio: 1.18295 },
  { n: 13, fitBias: 1.8721e-6, ratioToLnRate: 6.25161e-4, saddleDnRatio: 1.16081 },
  { n: 14, fitBias: 1.6581e-6, ratioToLnRate: 6.53296e-4, saddleDnRatio: 1.14271 },
  { n: 15, fitBias: 1.4777e-6, ratioToLnRate: 6.80038e-4, saddleDnRatio: 1.12767 },
  { n: 16, fitBias: 1.3241e-6, ratioToLnRate: 7.05497e-4, saddleDnRatio: 1.11501 },
  { n: 17, fitBias: 1.1923e-6, ratioToLnRate: 7.29771e-4, saddleDnRatio: 1.10424 },
  { n: 18, fitBias: 1.0786e-6, ratioToLnRate: 7.52951e-4, saddleDnRatio: 1.09498 },
];

export const IMP3699_FIT_BIAS_FIRST = 1.15751e-5;
export const IMP3699_FIT_BIAS_LAST = 1.0786e-6;
export const IMP3699_RATIO_LN_FIRST = 2.58940e-4;
export const IMP3699_RATIO_LN_LAST = 7.52951e-4;
export const IMP3699_SADDLE_RATIO_FIRST = 3.64422;
export const IMP3699_SADDLE_RATIO_LAST = 1.09498;
export const IMP3699_LAW_ERR_MAX = 2e-9;
