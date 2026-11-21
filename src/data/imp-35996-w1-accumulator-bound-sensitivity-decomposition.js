/**
 * @module imp-35996-w1-accumulator-bound-sensitivity-decomposition
 *
 * imp-35996 (numerical, S-frontier): DECOMPOSE the frequency-sensitivity of the imp-35890
 * normalized running-accumulator a-priori bound gamma_{N-1} * max_i|S_i| / Sum|t_k| into its
 * NUMERATOR (max_i|S_i|) and DENOMINATOR (Sum|t_k|) contributions across the imp-35949
 * (alpha, beta) frequency grid at fixed N ~ 488602, so it is clear WHICH factor drives the
 * bound's frequency dependence.
 *
 * imp-35949 swept t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) across an (alpha, beta) grid and
 * reported the COMPOSITE ratio r = max_i|S_i| / Sum|t_k| (the imp-35890 recovered-pessimism
 * fraction), noting that at the q=1 resonant corner (alpha = 2 pi, beta = 0) BOTH the accumulator
 * peak max_i|S_i| climbs to Sum|t_k| AND the Higham normalization Sum|t_k| itself grows (~889
 * generic to ~1398 resonant). But it never split the bound's frequency-sensitivity into its
 * numerator vs denominator log-contributions -- so it was not clear whether the ~3.5-decade swing
 * in the bound is driven by the accumulator peak (numerator) or the normalization (denominator).
 * This module answers that.
 *
 * MEASUREMENT ONLY. Instantiates no directed-rounding interval; evaluates no true H_0; verifies no
 * inequality; changes no bound; establishes no positivity; the certified length-N interval sum stays
 * MECHANICAL / GREENFIELD (imp-35725 / imp-35681 Part A); C_mb GUE-conditional (imp-486) untouched;
 * no RH verdict, NO QED. No refereed bound is changed.
 *
 * THE DECOMPOSITION (why the split is exact and clean)
 * -----------------------------------------------------------------------------
 * The bound is B(alpha, beta) = gamma_{N-1} * max_i|S_i| / Sum|t_k|. At FIXED N the Higham factor
 * gamma_{N-1} is frequency-INDEPENDENT, so the entire (alpha, beta) dependence lives in the ratio,
 * and in log space it splits additively and exactly:
 *     log10 B = log10 gamma_{N-1} + log10(max_i|S_i|) - log10(Sum|t_k|).
 * The frequency-sensitivity of the bound is therefore delta[log10(max_i|S_i|)] MINUS
 * delta[log10(Sum|t_k|)]. Measuring the spread (peak-to-trough log-range and cross-grid std) of
 * each of the two terms SEPARATELY isolates which factor drives the bound's frequency dependence.
 *
 * FINDING (at fixed N ~ 488602 across the imp-35949 24-point (alpha, beta) grid)
 * -----------------------------------------------------------------------------
 *   - the NUMERATOR max_i|S_i| swings from ~0.42 (deepest cancellation) to ~1396.5 (q=1 resonant
 *     coherence) -- a log-range of ~3.52 DECADES (cross-grid std ~1.02 dex);
 *   - the DENOMINATOR Sum|t_k| swings only from ~888 (generic |cos| ~ 2/pi) to ~1396.5 (resonant
 *     |cos| ~ 1) -- a log-range of ~0.20 DECADES (cross-grid std ~0.054 dex);
 *   - so the NUMERATOR dominates the bound's frequency-sensitivity ~18x by log-range and accounts
 *     for ~95% of it (~0.947 by range, ~0.949 by std). The accumulator PEAK, not the normalization,
 *     is what drives the ~3.5-decade frequency swing of the imp-35890 bound.
 * The two factors are mildly positively correlated across the grid (corr(log num, log den) ~ 0.43):
 * at the q=1 resonance the coherence that lifts the accumulator peak also lifts Sum|t_k| (|cos| -> 1),
 * but the denominator's dynamic range is bounded (Sum|t_k| can only range between the |cos| ~ 2/pi
 * generic average and the |cos| = 1 fully-coherent ceiling, a fixed ~1.57x = ~0.20 dex), whereas the
 * numerator's range is essentially unbounded on this scale (it collapses to O(1) under cancellation
 * and climbs to the full Sum|t_k| under coherence).
 * CONCLUSION: the imp-35890 bound's frequency dependence is a NUMERATOR (accumulator-peak) story.
 * The denominator's ~0.2-dex swing that imp-35949 flagged is real but SECOND-ORDER (~5% of the total
 * log-sensitivity); the run-time monitor imp-35890 requires is essentially a monitor of the ACCUMULATOR
 * PEAK max_i|S_i|, since Sum|t_k| barely moves. Precision is still NOT the binding constraint anywhere
 * on the grid (imp-35949): even the fully-collapsed r = 1 corner leaves gamma_{N-1} ~ 5.4e-11 ~4 orders
 * under the imp-35760 O(1) barrier margin; this decomposition only attributes the recovered-pessimism
 * variability to its dominant factor.
 *
 * @see imp-35949-w1-accumulator-frequency-grid-robustness (the composite-r grid this decomposes)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the normalized bound whose sensitivity is split)
 * @see imp-35991-w1-accumulator-baseline-margin-to-resonance (margin from baseline to the resonant corner)
 * @see imp-35761-w1-certified-rounding-cost-scope (classic pessimistic gamma_{N-1} bound)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin all bounds sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2 (running error bound)
 */

// -- Anchor + operative constants (import-light; matching imp-35761 / imp-35812 / imp-35890 / imp-35949) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp); Higham gamma uses u

// imp-35812 / imp-35890 baseline frequencies (golden-ratio fraction, golden angle).
const ALPHA_BASE = 0.6180339887498949;
const BETA_BASE = 2.3999632297286533;

// gamma_n = n u / (1 - n u) ~ n u (Higham worst-case recursive-sum factor); frequency-INDEPENDENT.
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF);
const GAMMA_AT_TPT = gamma(N_AT_TPT - 1); // classic pessimistic normalized bound (r = 1 limit)

// Scan the running accumulator for one (alpha, beta) at fixed N (matching imp-35949 scan()).
function scan(alpha, beta, N) {
  let s = 0; // running partial sum S_i
  let sumAbs = 0; // Sum |t_k| (Higham magnitude scale; = numerator normalization = the DENOMINATOR)
  let maxPartial = 0; // max_i |S_i| (running accumulator magnitude = the NUMERATOR)
  for (let k = 1; k <= N; k++) {
    const t = Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);
    s += t;
    sumAbs += Math.abs(t);
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
  }
  return {
    alpha,
    beta,
    N,
    numerator: maxPartial, // max_i|S_i| -- the accumulator-peak factor of the bound
    denominator: sumAbs, // Sum|t_k| -- the Higham normalization factor of the bound
    ratio: maxPartial / sumAbs, // r = composite imp-35890 recovered-pessimism fraction
    runMaxNorm: GAMMA_AT_TPT * (maxPartial / sumAbs), // gamma_{N-1} * r (the full normalized bound)
  };
}

// -- imp-35949 (alpha, beta) grid, reproduced verbatim so the decomposition uses the SAME points --
const ALPHA_GRID = [2 * Math.PI, 2 * Math.PI + 1e-4, Math.PI, ALPHA_BASE, 1.3, 2.0];
const BETA_GRID = [0, 0.002, 0.5, BETA_BASE];
const GRID = [];
for (const alpha of ALPHA_GRID) {
  for (const beta of BETA_GRID) {
    GRID.push(scan(alpha, beta, N_AT_TPT));
  }
}

// Log10 of each factor per grid point (the additive terms of log10 B).
const LOG_NUM = GRID.map((g) => Math.log10(g.numerator));
const LOG_DEN = GRID.map((g) => Math.log10(g.denominator));

const mean = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;
const std = (arr) => {
  const m = mean(arr);
  return Math.sqrt(mean(arr.map((x) => (x - m) ** 2)));
};
const range = (arr) => Math.max(...arr) - Math.min(...arr);

// Peak-to-trough log-range (dex) of each factor across the grid.
const NUM_LOG_RANGE = range(LOG_NUM); // ~3.52 dex (numerator dominates)
const DEN_LOG_RANGE = range(LOG_DEN); // ~0.20 dex (denominator second-order)
// Cross-grid std (dex) of each factor -- a range-independent dispersion measure.
const NUM_LOG_STD = std(LOG_NUM); // ~1.02 dex
const DEN_LOG_STD = std(LOG_DEN); // ~0.054 dex

// Numerator share of the total log-sensitivity (both metrics; ~0.95).
const NUM_DOMINANCE_BY_RANGE = NUM_LOG_RANGE / (NUM_LOG_RANGE + DEN_LOG_RANGE);
const NUM_DOMINANCE_BY_STD = NUM_LOG_STD / (NUM_LOG_STD + DEN_LOG_STD);
const RANGE_RATIO_NUM_OVER_DEN = NUM_LOG_RANGE / DEN_LOG_RANGE; // ~18x

// Correlation of the two log-factors across the grid (mildly positive at the resonance).
const CORR_NUM_DEN = (() => {
  const mn = mean(LOG_NUM);
  const md = mean(LOG_DEN);
  const cov = mean(GRID.map((_, i) => (LOG_NUM[i] - mn) * (LOG_DEN[i] - md)));
  return cov / (NUM_LOG_STD * DEN_LOG_STD);
})();

// Numerator / denominator extremes (for the reported swing endpoints).
const NUM_MIN = Math.min(...GRID.map((g) => g.numerator));
const NUM_MAX = Math.max(...GRID.map((g) => g.numerator));
const DEN_MIN = Math.min(...GRID.map((g) => g.denominator));
const DEN_MAX = Math.max(...GRID.map((g) => g.denominator));

export const IMP35996_W1_ACCUMULATOR_BOUND_SENSITIVITY_DECOMPOSITION = {
  id: 'imp-35996',
  proofSection: 'S-frontier',
  question:
    'DECOMPOSE the frequency-sensitivity of the imp-35890 normalized running-accumulator a-priori ' +
    'bound gamma_{N-1} * max_i|S_i| / Sum|t_k| into its numerator (max_i|S_i|) and denominator ' +
    '(Sum|t_k|) contributions across the imp-35949 (alpha, beta) grid at fixed N ~ 488602, so it is ' +
    'clear which factor drives the bound frequency dependence. Measurement only; changes no bound; NO QED.',
  fixedN: N_AT_TPT,
  decompositionIdentity:
    'at fixed N the Higham factor gamma_{N-1} is frequency-independent, so log10 B = log10 gamma_{N-1} ' +
    '+ log10(max_i|S_i|) - log10(Sum|t_k|); the bound frequency-sensitivity is exactly ' +
    'delta[log10(max_i|S_i|)] - delta[log10(Sum|t_k|)], split additively into numerator and denominator',
  numerator: {
    factor: 'max_i|S_i| (running accumulator peak)',
    min: NUM_MIN,
    max: NUM_MAX,
    logRangeDex: NUM_LOG_RANGE,
    logStdDex: NUM_LOG_STD,
    note:
      'swings ~0.42 (deepest cancellation) to ~1396.5 (q=1 resonant coherence): a ~3.52-decade span, ' +
      'essentially unbounded on this scale (O(1) under cancellation, full Sum|t_k| under coherence)',
  },
  denominator: {
    factor: 'Sum|t_k| (Higham normalization)',
    min: DEN_MIN,
    max: DEN_MAX,
    logRangeDex: DEN_LOG_RANGE,
    logStdDex: DEN_LOG_STD,
    note:
      'swings ~888 (generic |cos| ~ 2/pi) to ~1396.5 (resonant |cos| ~ 1): only a ~0.20-decade span, ' +
      'dynamic range hard-bounded by the fixed ~1.57x = ~pi/2 ratio of coherent to generic |cos| average',
  },
  dominance: {
    numeratorShareByRange: NUM_DOMINANCE_BY_RANGE,
    numeratorShareByStd: NUM_DOMINANCE_BY_STD,
    rangeRatioNumOverDen: RANGE_RATIO_NUM_OVER_DEN,
    correlationLogNumLogDen: CORR_NUM_DEN,
    note:
      'the numerator max_i|S_i| dominates the bound frequency-sensitivity ~18x by log-range and carries ' +
      '~95% of it (~0.947 by range, ~0.949 by std); the two factors are mildly positively correlated ' +
      '(~0.43) because the q=1 coherence that lifts the accumulator peak also lifts Sum|t_k|, but the ' +
      'denominator swing is second-order (~5%)',
  },
  grid: GRID.map((g) => ({
    alpha: g.alpha,
    beta: g.beta,
    numerator: g.numerator,
    denominator: g.denominator,
    ratio: g.ratio,
    runMaxNorm: g.runMaxNorm,
  })),
  conclusion: {
    numeratorDriven:
      'the imp-35890 bound frequency dependence is a NUMERATOR (accumulator-peak) story: max_i|S_i| ' +
      'contributes ~3.52 decades of log-swing vs the denominator Sum|t_k| ~0.20 decades, so ~95% of the ' +
      'bound frequency-sensitivity is the accumulator peak, not the normalization',
    denominatorSecondOrder:
      'the ~0.2-decade Sum|t_k| swing imp-35949 flagged at the q=1 resonance is real but SECOND-ORDER ' +
      '(~5% of the total log-sensitivity), because Sum|t_k| is dynamic-range-bounded between the |cos| ~ ' +
      '2/pi generic average and the |cos| = 1 coherent ceiling (a fixed ~pi/2 = ~1.57x = ~0.20 dex)',
    monitorImplication:
      'the run-time monitor imp-35890 requires is essentially a monitor of the ACCUMULATOR PEAK max_i|S_i|; ' +
      'Sum|t_k| barely moves across frequencies, so tracking the numerator suffices to track the bound',
    precisionNotBinding:
      'this decomposition only attributes the recovered-pessimism variability to its dominant factor; ' +
      'precision is still NOT the binding constraint anywhere on the grid (imp-35949) -- even the collapsed ' +
      'r = 1 corner leaves gamma_{N-1} ~ 5.4e-11 ~4 orders under the imp-35760 O(1) barrier margin',
    staysGreenfield:
      'this module measures numerator/denominator magnitudes only; it instantiates no directed-rounding ' +
      'interval and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Decomposing the frequency-sensitivity ' +
    'of the imp-35890 normalized running-accumulator a-priori bound gamma_{N-1} * max_i|S_i| / Sum|t_k| across ' +
    'the imp-35949 24-point (alpha, beta) grid at fixed N ~ 488602 (where gamma_{N-1} is frequency-independent, ' +
    'so log10 B splits additively into log10(max_i|S_i|) - log10(Sum|t_k|)): the NUMERATOR max_i|S_i| swings ' +
    '~0.42 to ~1396.5 (~3.52-decade log-range, cross-grid std ~1.02 dex) while the DENOMINATOR Sum|t_k| swings ' +
    'only ~888 to ~1396.5 (~0.20-decade log-range, std ~0.054 dex). The numerator therefore DOMINATES the ' +
    'bound frequency-sensitivity ~18x by log-range and carries ~95% of it (~0.947 by range, ~0.949 by std); the ' +
    'two factors are mildly positively correlated (~0.43) because the q=1 coherence that lifts the accumulator ' +
    'peak also lifts Sum|t_k|, but the denominator swing is second-order because Sum|t_k| is dynamic-range-bounded ' +
    'between the |cos| ~ 2/pi generic and |cos| = 1 coherent extremes (a fixed ~pi/2 = ~1.57x = ~0.20 dex). ' +
    'So the imp-35890 bound frequency dependence is an ACCUMULATOR-PEAK story, and the run-time monitor it ' +
    'requires is essentially a monitor of max_i|S_i|. Precision is still NOT the binding constraint anywhere on ' +
    'the grid (imp-35949): even the collapsed r = 1 corner leaves gamma_{N-1} ~ 5.4e-11 ~4 orders under the ' +
    'imp-35760 O(1) barrier margin. Instantiates no directed-rounding interval; evaluates no true H_0; verifies ' +
    'no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays ' +
    'GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35949 (composite-r (alpha,beta) grid this decomposes into numerator vs denominator); imp-35890 (O(1) ' +
    'running-accumulator normalized a-priori bound whose sensitivity is split); imp-35991 (baseline-to-resonance ' +
    'margin); imp-35812 (baseline (alpha,beta) term family); imp-35761 (classic pessimistic gamma_{N-1} bound); ' +
    'imp-35760 (barrier-margin allocation); imp-35725 (mechanical N-term certified cost); imp-35681 Part A (A+B-C ' +
    'interval bound greenfield); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained terms); Higham 2002 sec 4.2 ' +
    '(recursive-sum running error bound); Platt-Trudgian 2021 (barrier base).',
};

export const IMP35996_W1_ACCUMULATOR_BOUND_SENSITIVITY_DECOMPOSITION_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602; the whole grid shares this fixed N.
    id: 'imp35996-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 fixed across the whole (alpha,beta) grid',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5 &&
      GRID.length === 24 &&
      GRID.every((g) => g.N === N_AT_TPT),
  },
  {
    // Decomposition identity: at fixed N, gamma_{N-1} is frequency-independent so runMaxNorm = gamma * r exactly.
    id: 'imp35996-log-split-exact',
    description: 'runMaxNorm = gamma_{N-1} * (numerator/denominator) exactly (gamma frequency-independent)',
    holds: () =>
      GRID.every(
        (g) => Math.abs(g.runMaxNorm - GAMMA_AT_TPT * (g.numerator / g.denominator)) < 1e-18,
      ) && GAMMA_AT_TPT > 1e-12 && GAMMA_AT_TPT < 1e-9,
  },
  {
    // Numerator max_i|S_i| swings by ~3.5 decades: O(1) at deepest cancellation, ~1396 at q=1 coherence.
    id: 'imp35996-numerator-wide-swing',
    description: 'Numerator max_i|S_i| spans ~0.42 to ~1396.5, a log-range > 3 decades',
    holds: () =>
      NUM_MIN < 1 &&
      NUM_MAX > 1300 &&
      NUM_LOG_RANGE > 3.0 &&
      NUM_LOG_RANGE < 4.0,
  },
  {
    // Denominator Sum|t_k| swings only ~0.2 decades: bounded between |cos| ~ 2/pi and |cos| = 1.
    id: 'imp35996-denominator-narrow-swing',
    description: 'Denominator Sum|t_k| spans ~888 to ~1396.5, a log-range < 0.3 decades',
    holds: () =>
      DEN_MIN > 800 &&
      DEN_MIN < 1000 &&
      DEN_MAX > 1300 &&
      DEN_MAX < 1500 &&
      DEN_LOG_RANGE > 0.1 &&
      DEN_LOG_RANGE < 0.3,
  },
  {
    // Core finding: the numerator dominates the bound frequency-sensitivity by >10x (log-range).
    id: 'imp35996-numerator-dominates',
    description: 'Numerator log-range exceeds denominator log-range >10x; numerator share > 90% (range and std)',
    holds: () =>
      RANGE_RATIO_NUM_OVER_DEN > 10 &&
      NUM_DOMINANCE_BY_RANGE > 0.9 &&
      NUM_DOMINANCE_BY_STD > 0.9 &&
      NUM_LOG_STD > 10 * DEN_LOG_STD,
  },
  {
    // The two log-factors are mildly positively correlated (q=1 coherence lifts both), not anti-correlated.
    id: 'imp35996-factors-mildly-correlated',
    description: 'corr(log num, log den) is mildly positive (~0.43), not anti-correlated: coherence lifts both',
    holds: () => CORR_NUM_DEN > 0.2 && CORR_NUM_DEN < 0.8,
  },
  {
    // Denominator dynamic range is hard-bounded by the coherent/generic |cos|-average ratio ~ pi/2.
    id: 'imp35996-denominator-bounded-by-pi-over-2',
    description: 'Denominator max/min ratio ~ pi/2 (|cos| = 1 coherent over |cos| = 2/pi generic average)',
    holds: () => {
      const r = DEN_MAX / DEN_MIN;
      return r > 1.45 && r < 1.65; // pi/2 ~ 1.5708
    },
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35996-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35996_W1_ACCUMULATOR_BOUND_SENSITIVITY_DECOMPOSITION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP35996_W1_ACCUMULATOR_BOUND_SENSITIVITY_DECOMPOSITION.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35996_W1_ACCUMULATOR_BOUND_SENSITIVITY_DECOMPOSITION.verdict) &&
      /refereed bound is changed/i.test(IMP35996_W1_ACCUMULATOR_BOUND_SENSITIVITY_DECOMPOSITION.verdict),
  },
];

for (const a of IMP35996_W1_ACCUMULATOR_BOUND_SENSITIVITY_DECOMPOSITION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35996-w1-accumulator-bound-sensitivity-decomposition assertion failed: ${a.id}`);
  }
}
