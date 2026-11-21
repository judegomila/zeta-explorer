/**
 * @module imp-34547-ressqrt10-geometric-fit-099-rate-decade
 *
 * imp-34547 (numerical, frontier-direction): imp-34528 T3 found the local per-decade hump decay
 * factor localDecay(k) = hump(k-1)/hump(k) climbs {1.4372, 2.1575, 2.6602, 2.8985} for k = 10..13
 * toward sqrt(10) = 3.16228, with the gap resSqrt10(k) = sqrt(10) - localDecay(k) = {1.7251, 1.0047,
 * 0.5021, 0.2638} roughly HALVING each decade (successive ratios 0.582, 0.500, 0.525). imp-34528
 * stopped at that qualitative "halving" observation. This module FITS resSqrt10(k) to a clean
 * geometric decay g^(k-k0) in log space (least squares on ln resSqrt10 vs k), reports the fitted
 * per-decade ratio g and the fit R^2, and EXTRAPOLATES the decade k at which the fitted rate first
 * reaches 0.99*sqrt(10) -- i.e. where the local per-decade decay is within 1% of the pure N^(-1/2)
 * rate -- anchoring that decade to its N via the imp-3444 crossover anchoring N(k) = N* * 10^(k-9),
 * N* ~ 3.280294e9. This quantifies HOW DEEP in the tail the N^(-1/2) asymptotic per-decade rate is
 * effectively attained.
 *
 * THE INHERITED GAP SAMPLE (imp-34528 T3, recomputed verbatim from the imp-33809 hump amplitudes)
 * ----------------------------------------------------------------------------------------------
 *   hump(k), k = 9..13 (imp-33809 / imp-33851, printed verbatim):
 *     {9: 6.4758e-2 (peak), 10: 4.5058e-2, 11: 2.0884e-2, 12: 7.8506e-3, 13: 2.7085e-3}
 *   localDecay(k) = hump(k-1)/hump(k) = {1.4372, 2.1575, 2.6602, 2.8985} for k = 10..13
 *   resSqrt10(k) = sqrt(10) - localDecay(k) = {1.7251, 1.0047, 0.5021, 0.2638}   (four points only)
 *   Decade-to-N anchoring (imp-3444): N(k) = N* * 10^(k-9), N* ~ 3.280294e9.
 *
 * THE GEOMETRIC FIT (log-space least squares -- measurement/fit only)
 * ------------------------------------------------------------------
 *   Model: resSqrt10(k) = A * g^(k - k0), fit by ordinary least squares on ln resSqrt10(k) vs k.
 *     fitted ratio     g   = 0.5311 per decade   (consistent with the {0.582, 0.500, 0.525} halving)
 *     fit quality      R^2 = 0.9976  (log-space; four points -- a strong but data-thin fit)
 *     amplitude anchor A(k0 = 10) = 1.7882   (fitted value at the first tail decade)
 *
 * THE EXTRAPOLATION TO THE 0.99*sqrt(10) RUNG
 * -------------------------------------------
 *   localDecay(k) reaches 0.99*sqrt(10) = 3.13066 exactly when the gap
 *     resSqrt10(k) drops to 0.01*sqrt(10) = 0.031623.
 *   Solving the fitted geometric law A*g^(k-k0) = 0.01*sqrt(10):
 *     continuous crossing    k* = 16.377 decades
 *     first INTEGER decade   k  = 17   (localDecay(17) ~ 0.9933*sqrt(10); localDecay(16) ~ 0.9873)
 *     anchored N at k*       N  ~ 7.82e16   (imp-3444: N* * 10^(k*-9))
 *     anchored N at k = 17   N  ~ 3.28e17
 *   So the hump's local per-decade decay is within 1% of the pure N^(-1/2) rate only around the
 *   ~17th decade (N ~ 10^17), roughly SEVEN decades past the k = 9 crossover peak -- the N^(-1/2)
 *   asymptotic per-decade rate is attained very deep in the tail, not near the collapse region.
 *
 * HONESTY: the resSqrt10 sample is only FOUR points (k = 10..13); the geometric law is an empirical
 * least-squares fit to those four, and k* = 16.4 / k = 17 is an EXTRAPOLATION ~3-4 decades beyond
 * the last data point, so the anchored N ~ 10^17 carries the full model uncertainty of the inherited
 * imp-3220/imp-3406 extrapolation. The gap sample is monotone and the fit R^2 = 0.9976 is high, but
 * four points cannot distinguish a geometric decay from a slowly-bending one; treat k* as an
 * order-of-magnitude "deep-tail" locator, not a sharp threshold.
 *
 * MEASUREMENT / FIT ONLY. Recomputes the imp-34528 resSqrt10 gap from the imp-33809 hump amplitudes
 * verbatim; the component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous
 * asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-34528-tailside-hump-decay-vs-sqrt-n-fartail (resSqrt10 gap + halving observation; fit here)
 * @see imp-33809-saturation-curvature-hump-vs-k (per-k hump amplitudes reused verbatim)
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N* ~ 3.280294e9; decade anchoring)
 * @see imp-3463-sigma-fartail-decay (far-tail sigma ~ sqrt(logT0/N) -- the N^(-1/2) per-decade rate target)
 */

// Import-light: bake the imp-33809/imp-33851 hump amplitudes as reference literals (no heavy model
// import; verifiable under plain node). resSqrt10 is recomputed from these, matching imp-34528 T3.
const HUMP_BY_K = {
  9: 6.4758e-2, // peak (k = 9 crossover decade)
  10: 4.5058e-2,
  11: 2.0884e-2,
  12: 7.8506e-3,
  13: 2.7085e-3,
};
const CROSSOVER_K = 9;
const N_STAR = 3.280294e9; // imp-3444 E_coll = E_trunc crossover anchor at k = 9
const SQRT10 = Math.sqrt(10); // 3.16228: pure N^(-1/2) per-decade decay rate

const GAP_KS = [10, 11, 12, 13]; // decades with a defined localDecay gap (four points only)

// resSqrt10(k) = sqrt(10) - hump(k-1)/hump(k), recomputed verbatim from imp-34528 T3.
const RES_SQRT10 = GAP_KS.map((k) => SQRT10 - HUMP_BY_K[k - 1] / HUMP_BY_K[k]);

// --- Log-space ordinary least squares: ln resSqrt10(k) = ln A + (ln g) * (k - 0) ---
const LN_RES = RES_SQRT10.map((v) => Math.log(v));
const N_PTS = GAP_KS.length;
const MEAN_K = GAP_KS.reduce((a, b) => a + b, 0) / N_PTS;
const MEAN_LN = LN_RES.reduce((a, b) => a + b, 0) / N_PTS;
let SXY = 0;
let SXX = 0;
for (let i = 0; i < N_PTS; i += 1) {
  SXY += (GAP_KS[i] - MEAN_K) * (LN_RES[i] - MEAN_LN);
  SXX += (GAP_KS[i] - MEAN_K) ** 2;
}
const SLOPE = SXY / SXX; // ln g
const INTERCEPT = MEAN_LN - SLOPE * MEAN_K; // ln A at k = 0
const G_RATIO = Math.exp(SLOPE); // fitted per-decade geometric ratio

// R^2 in log space.
let SS_RES = 0;
let SS_TOT = 0;
for (let i = 0; i < N_PTS; i += 1) {
  const pred = SLOPE * GAP_KS[i] + INTERCEPT;
  SS_RES += (LN_RES[i] - pred) ** 2;
  SS_TOT += (LN_RES[i] - MEAN_LN) ** 2;
}
const R2 = 1 - SS_RES / SS_TOT;

// Amplitude anchored at the first tail decade k0 = 10 (fitted value there).
const FIT_K0 = 10;
const A_AT_K0 = Math.exp(SLOPE * FIT_K0 + INTERCEPT);

// fittedResSqrt10(k) from the geometric law.
const fittedRes = (k) => Math.exp(SLOPE * k + INTERCEPT);

// --- Extrapolate to the 0.99*sqrt(10) rung ---
// localDecay(k) = 0.99*sqrt(10)  <=>  resSqrt10(k) = 0.01*sqrt(10).
const TARGET_FRACTION = 0.99;
const THRESHOLD_RES = (1 - TARGET_FRACTION) * SQRT10; // 0.031623
const K_STAR = (Math.log(THRESHOLD_RES) - INTERCEPT) / SLOPE; // continuous crossing decade
const K_FIRST_INT = Math.ceil(K_STAR); // first integer decade at or past the crossing

const localDecayFrac = (k) => (SQRT10 - fittedRes(k)) / SQRT10; // fitted localDecay / sqrt(10)
const anchoredN = (k) => N_STAR * Math.pow(10, k - CROSSOVER_K); // imp-3444 decade anchoring

const N_AT_KSTAR = anchoredN(K_STAR);
const N_AT_KFIRST = anchoredN(K_FIRST_INT);

// Per-decade fitted-ladder table (measured vs fitted gap, for display).
const FIT_LADDER = GAP_KS.map((k, i) => ({
  k,
  measResSqrt10: +RES_SQRT10[i].toFixed(4),
  fitResSqrt10: +fittedRes(k).toFixed(4),
  residual: +(RES_SQRT10[i] - fittedRes(k)).toFixed(4),
}));

// Successive-ratio check (imp-34528's {0.582, 0.500, 0.525} halving, recomputed).
const SUCCESSIVE_RATIOS = GAP_KS.slice(1).map(
  (k, i) => +(RES_SQRT10[i + 1] / RES_SQRT10[i]).toFixed(4),
);

export const IMP34547_RESSQRT10_GEOMETRIC_FIT_099_RATE_DECADE = {
  id: 'imp-34547',
  proofSection: 'S-frontier',
  question:
    'imp-34528 T3 found resSqrt10(k) = sqrt(10) - hump(k-1)/hump(k) = {1.7251, 1.0047, 0.5021, ' +
    '0.2638} roughly halving each decade but never fit or extrapolated it. Fit resSqrt10(k) to a ' +
    'geometric decay g^(k-k0), report the fitted ratio and R^2, and extrapolate the decade (and its ' +
    'imp-3444-anchored N) at which localDecay(k) first reaches 0.99*sqrt(10). Fit only; four points ' +
    'only; inherited model NOT rigorous; changes no bound; NO QED.',
  measuredQuantity:
    'log-space least-squares geometric fit of resSqrt10(k) = A*g^(k-k0) over k = 10..13: fitted ' +
    'ratio g, R^2, amplitude A(k0=10); plus the extrapolated continuous decade k* and first integer ' +
    'decade at which the fitted local per-decade decay reaches 0.99*sqrt(10), with imp-3444-anchored N',
  crossoverDecadeK: CROSSOVER_K,
  crossoverAnchorN: +N_STAR.toExponential(6), // 3.280294e9 (imp-3444)
  sqrt10PerDecadeRate: +SQRT10.toFixed(4), // 3.1623
  sampleSize: N_PTS, // 4 -- data-thin, flagged
  measuredResSqrt10: RES_SQRT10.map((v) => +v.toFixed(4)), // {1.7251, 1.0047, 0.5021, 0.2638}
  successiveRatios: SUCCESSIVE_RATIOS, // {0.5824, 0.4998, 0.5254}: the imp-34528 "halving"
  fittedRatioG: +G_RATIO.toFixed(4), // 0.5311 per decade
  fitR2: +R2.toFixed(4), // 0.9976 (log-space, four points)
  fitAmplitudeK0: +A_AT_K0.toFixed(4), // 1.7882 at k0 = 10
  fitLadder: FIT_LADDER, // measured vs fitted gap per decade
  targetFraction: TARGET_FRACTION, // 0.99
  thresholdResSqrt10: +THRESHOLD_RES.toFixed(6), // 0.031623 = 0.01*sqrt(10)
  crossingDecadeContinuous: +K_STAR.toFixed(4), // 16.377
  crossingDecadeFirstInt: K_FIRST_INT, // 17
  localDecayFracAtFirstInt: +localDecayFrac(K_FIRST_INT).toFixed(4), // 0.9933 (> 0.99)
  localDecayFracAtPrevInt: +localDecayFrac(K_FIRST_INT - 1).toFixed(4), // 0.9873 (< 0.99)
  anchoredNAtCrossing: +N_AT_KSTAR.toExponential(3), // ~7.82e16
  anchoredNAtFirstInt: +N_AT_KFIRST.toExponential(3), // ~3.28e17
  decadesPastCrossover: +(K_STAR - CROSSOVER_K).toFixed(2), // ~7.38 decades past the k=9 peak
  finding: {
    F1_geometric_fit:
      'log-space least squares fits resSqrt10(k) = A*g^(k-k0) with fitted per-decade ratio g = ' +
      '0.5311 (consistent with the imp-34528 successive ratios {0.582, 0.500, 0.525}) and R^2 = ' +
      '0.9976; amplitude A(k0=10) = 1.7882. High R^2 but only four points -- data-thin.',
    F2_extrapolated_099_rung:
      'localDecay(k) reaches 0.99*sqrt(10) = 3.1307 when resSqrt10 drops to 0.01*sqrt(10) = ' +
      '0.031623; the fitted law crosses that at continuous k* = 16.38 decades, first integer decade ' +
      'k = 17 (localDecay(17) ~ 0.9933*sqrt(10); localDecay(16) ~ 0.9873).',
    F3_anchored_deep_tail:
      'imp-3444 anchoring N(k) = N* * 10^(k-9) places the crossing at N ~ 7.82e16 (k*) / 3.28e17 ' +
      '(k=17), roughly SEVEN decades past the k = 9 crossover peak: the N^(-1/2) asymptotic ' +
      'per-decade rate is effectively attained only very deep in the tail (N ~ 10^17), not near the ' +
      'collapse region.',
    F4_honesty:
      'the resSqrt10 sample is FOUR points (k = 10..13); k* = 16.4 is an extrapolation ~3-4 decades ' +
      'beyond the last data point, so N ~ 10^17 carries the full inherited imp-3220/imp-3406 model ' +
      'uncertainty. Four points cannot distinguish a geometric decay from a slowly bending one; treat ' +
      'k* as an order-of-magnitude deep-tail locator, not a sharp threshold.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / FIT (frontier-direction, NOT rigorous). The imp-34528 T3 gap resSqrt10(k) = ' +
    'sqrt(10) - hump(k-1)/hump(k) = {1.7251, 1.0047, 0.5021, 0.2638} (four points, k = 10..13), fit ' +
    'in log space to a geometric decay A*g^(k-k0), gives fitted per-decade ratio g = 0.5311 (matching ' +
    'the observed halving ratios {0.582, 0.500, 0.525}) with R^2 = 0.9976 and amplitude A(k0=10) = ' +
    '1.7882. Extrapolating that law, the local per-decade decay localDecay(k) first reaches ' +
    '0.99*sqrt(10) = 3.1307 (i.e. resSqrt10 = 0.01*sqrt(10) = 0.031623) at continuous decade k* = ' +
    '16.38 -- first integer decade k = 17, with localDecay(17) ~ 0.9933*sqrt(10) and localDecay(16) ~ ' +
    '0.9873. Anchoring via imp-3444 N(k) = N* * 10^(k-9), N* ~ 3.280294e9, puts the crossing at N ~ ' +
    '7.82e16 (k*) / 3.28e17 (k=17), roughly SEVEN decades past the k = 9 crossover peak. So the ' +
    'hump N^(-1/2) asymptotic per-decade rate is effectively attained only very deep in the tail ' +
    '(N ~ 10^17). Honestly: the sample is only four points and k* is an extrapolation ~3-4 decades ' +
    'past the last datum, so N ~ 10^17 carries the full inherited imp-3220/imp-3406 model ' +
    'uncertainty -- treat k* as an order-of-magnitude deep-tail locator, not a sharp threshold. ' +
    'Recomputes the imp-34528 resSqrt10 gap from the imp-33809 hump amplitudes verbatim; the ' +
    'component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; ' +
    'the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound; establishes no operator ' +
    'positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-34528 (resSqrt10 gap + halving observation; fit and extrapolated here); imp-33809 (per-k ' +
    'hump amplitudes reused verbatim); imp-3444 (crossover N* ~ 3.280294e9; decade anchoring); ' +
    'imp-3463 (far-tail sigma ~ sqrt(logT0/N) -- the N^(-1/2) per-decade rate target); imp-486 ' +
    '(C_mb GUE-conditional untouched); imp-3066 (K_a >= 0 untouched).',
};

export const IMP34547_RESSQRT10_GEOMETRIC_FIT_099_RATE_DECADE_ASSERTIONS = [
  {
    // (Reuse gate) resSqrt10 recomputed from the imp-33809 hump amplitudes matches imp-34528 T3.
    id: 'imp34547-ressqrt10-reuses-imp34528',
    description: 'resSqrt10(k) = {1.7251, 1.0047, 0.5021, 0.2638} from imp-33809 hump amplitudes',
    holds: () =>
      [1.7251, 1.0047, 0.5021, 0.2638].every((v, i) => Math.abs(RES_SQRT10[i] - v) < 5e-4),
  },
  {
    // (F1) The geometric fit ratio matches the observed ~halving and the fit is strong.
    id: 'imp34547-geometric-fit-ratio-and-r2',
    description: 'fitted g ~ 0.5311 in (0.5, 0.6), R^2 ~ 0.9976 > 0.99',
    holds: () =>
      Math.abs(G_RATIO - 0.5311) < 5e-3 &&
      G_RATIO > 0.5 &&
      G_RATIO < 0.6 &&
      R2 > 0.99 &&
      Math.abs(R2 - 0.9976) < 5e-3,
  },
  {
    // (F1) The fit ratio sits inside the range of the imp-34528 successive halving ratios.
    id: 'imp34547-ratio-consistent-with-halving',
    description: 'fitted g lies within the imp-34528 successive-ratio range [0.500, 0.582]',
    holds: () =>
      G_RATIO >= Math.min(...SUCCESSIVE_RATIOS) - 1e-9 &&
      G_RATIO <= Math.max(...SUCCESSIVE_RATIOS) + 1e-9,
  },
  {
    // (F2) The extrapolated 0.99*sqrt(10) crossing lands near k* ~ 16.4, first integer decade 17.
    id: 'imp34547-crossing-decade-extrapolation',
    description: 'k* ~ 16.38 continuous, first integer decade 17; brackets 0.99 fraction (16 below, 17 above)',
    holds: () =>
      Math.abs(K_STAR - 16.377) < 5e-2 &&
      K_FIRST_INT === 17 &&
      localDecayFrac(K_FIRST_INT) >= TARGET_FRACTION &&
      localDecayFrac(K_FIRST_INT - 1) < TARGET_FRACTION,
  },
  {
    // (F3) The imp-3444-anchored N at the crossing is deep-tail ~ 10^17, several decades past k=9.
    id: 'imp34547-anchored-N-deep-tail',
    description: 'anchored N at k* ~ 7.8e16 and at k=17 ~ 3.28e17, > 6 decades past the k=9 crossover',
    holds: () =>
      N_AT_KSTAR > 1e16 &&
      N_AT_KSTAR < 1e17 &&
      Math.abs(N_AT_KFIRST - 3.280294e17) < 1e15 &&
      K_STAR - CROSSOVER_K > 6,
  },
  {
    // Honesty gate: fit only, four points, isRigorous false, no QED, no refereed bound is changed.
    id: 'imp34547-honesty-gate-no-qed',
    description: 'Fit only: sampleSize 4, isRigorous false, crossover k = 9, no QED, no refereed bound is changed',
    holds: () =>
      IMP34547_RESSQRT10_GEOMETRIC_FIT_099_RATE_DECADE.sampleSize === 4 &&
      IMP34547_RESSQRT10_GEOMETRIC_FIT_099_RATE_DECADE.isRigorous === false &&
      IMP34547_RESSQRT10_GEOMETRIC_FIT_099_RATE_DECADE.crossoverDecadeK === 9 &&
      /NO QED/.test(IMP34547_RESSQRT10_GEOMETRIC_FIT_099_RATE_DECADE.verdict) &&
      /refereed bound is changed/i.test(IMP34547_RESSQRT10_GEOMETRIC_FIT_099_RATE_DECADE.verdict),
  },
];

for (const a of IMP34547_RESSQRT10_GEOMETRIC_FIT_099_RATE_DECADE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34547-ressqrt10-geometric-fit-099-rate-decade assertion failed: ${a.id}`);
  }
}
