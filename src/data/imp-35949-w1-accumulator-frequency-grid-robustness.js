/**
 * @module imp-35949-w1-accumulator-frequency-grid-robustness
 *
 * imp-35949 (numerical, S-frontier): MEASURE the robustness of the imp-35890 O(1)
 * running-accumulator magnitude max_i|S_i| ~ 1.05 across an (alpha, beta) FREQUENCY GRID
 * for the oscillatory term family t_k = cos(alpha * k + beta * sqrt(k)) / sqrt(k), and
 * locate any (alpha, beta) where the accumulator ceases to stay O(1) so the Sum|t_k|-scale
 * cancellation breaks down and the imp-35890 running-accumulator a-priori bound approaches
 * the pessimistic Sum|t_k| scale.
 *
 * imp-35890 reported that at the SINGLE fixed (alpha, beta) = (golden-ratio fraction,
 * golden angle) inherited from imp-35812, the running accumulator max_i|S_i| ~ 1.05 is O(1)
 * and FLAT across the N = 1e3 .. 4.886e5 ladder while Sum|t_k| grows ~ sqrt(N) to ~889 --
 * which is why the certified running-accumulator bound gamma_{N-1} * max_i|S_i| / Sum|t_k|
 * recovers ~3.2 orders of magnitude-scale pessimism below the imp-35761 N * eps ceiling.
 * imp-35890 never tested whether that O(1) flatness is GENERIC or a special property of the
 * chosen frequencies. This module answers that at fixed N ~ 488602.
 *
 * MEASUREMENT ONLY. Instantiates no directed-rounding interval; evaluates no true H_0;
 * verifies no inequality; changes no bound; establishes no positivity; the certified
 * length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 / imp-35681 Part A);
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * WHY THE ACCUMULATOR CAN GROW (the recovered pessimism is fragile)
 * -----------------------------------------------------------------------------
 * The imp-35890 recovered pessimism is exactly the ratio r = max_i|S_i| / Sum|t_k|: the
 * run-max a-priori bound is gamma_{N-1} * r, so r = 1 means the running-accumulator bound
 * collapses back onto the classic pessimistic Higham bound gamma_{N-1} (NO magnitude-scale
 * gain), while r << 1 (strong cancellation) means the accumulator stays O(1) and the bound
 * is far tighter. Two mechanisms create cancellation in t_k = cos(alpha k + beta sqrt k)/sqrt k:
 *   (i)  the linear phase alpha k -- a pure oscillation of frequency alpha; when alpha is a
 *        multiple of 2 pi (the q=1 resonance) cos(alpha k) = 1 for every integer k, so the
 *        cosine stays fully coherent, the partial sums build up, and r -> 1 (higher-order
 *        resonances alpha = 2 pi p/q instead alternate and CANCEL, e.g. alpha = pi gives (-1)^k);
 *   (ii) the sqrt drift beta sqrt k -- a slowly-varying phase (d/dk = beta / (2 sqrt k))
 *        that de-phases even the q=1 resonant alpha; small beta (beta sqrt N < pi) leaves the
 *        coherence intact, a moderate beta destroys it.
 * So the WEAK-cancellation corner is alpha at (or near) a multiple of 2 pi AND small beta,
 * where r -> 1.
 *
 * FINDING (at fixed N ~ 488602; Sum|t_k| = Sum |cos(alpha k + beta sqrt k)|/sqrt k is itself
 *          frequency-dependent -- ~889 for a generic phase, ~1398 at the q=1 resonance)
 * -----------------------------------------------------------------------------
 *   - the imp-35812 baseline (alpha, beta) = (0.618.., 2.400..) reproduces r ~ 1.2e-3
 *     (max_i|S_i| ~ 1.05, Sum|t_k| ~ 889): STRONG cancellation, O(1) accumulator confirmed;
 *   - the q=1 resonant corner (alpha = 2 pi, beta = 0) drives r -> 1 (all terms same sign,
 *     cos(2 pi k) = 1): max_i|S_i| = Sum|t_k| ~ 1398, the accumulator STOPS being O(1), and
 *     the imp-35890 running-accumulator bound COLLAPSES onto the pessimistic classic-Higham
 *     gamma_{N-1};
 *   - restoring a moderate beta at the SAME resonant alpha restores cancellation (r drops by
 *     orders): the sqrt drift, NOT any special alpha, is what buys the O(1) accumulator.
 * CONCLUSION: the imp-35890 O(1) flatness is NOT a generic property of the term family -- it
 * is contingent on the frequencies (alpha away from 2 pi rationals and/or a non-trivial beta
 * sqrt-drift). The running-accumulator a-priori bound is only tighter than classic Higham
 * insofar as the specific summand actually cancels; a certified engine cannot ASSUME r << 1
 * a priori and must MONITOR the accumulator at run time (exactly the "run-time monitor"
 * caveat in imp-35890's bound (B)). Precision is still NOT the binding constraint even at
 * r = 1 (the classic gamma_{N-1} ~ 5.4e-11 stays ~4 orders under the imp-35760 barrier margin);
 * this only bounds how much the running-accumulator refinement can be relied on.
 *
 * @see imp-35890-w1-running-accumulator-apriori-bound (the O(1)/flat claim this stress-tests)
 * @see imp-35854-w1-summation-kappa-sweep (kappa = Sum|t_k|/|Sum t_k| sweep; complementary)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 * @see imp-35761-w1-certified-rounding-cost-scope (classic pessimistic gamma_{N-1} bound)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin all bounds sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2 (running error bound)
 */

// -- Anchor + operative constants (import-light; matching imp-35761 / imp-35812 / imp-35890) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp); Higham gamma uses u

// imp-35812 / imp-35890 baseline frequencies (golden-ratio fraction, golden angle).
const ALPHA_BASE = 0.6180339887498949;
const BETA_BASE = 2.3999632297286533;

// gamma_n = n u / (1 - n u) ~ n u (Higham worst-case recursive-sum factor).
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF);
const GAMMA_AT_TPT = gamma(N_AT_TPT - 1); // classic pessimistic normalized bound (r = 1 limit)

// Scan the running accumulator for one (alpha, beta) at fixed N: track Sum|t_k|, max_i|S_i|.
function scan(alpha, beta, N) {
  let s = 0; // running partial sum S_i
  let sumAbs = 0; // Sum |t_k| (Higham magnitude scale; = Sum 1/sqrt(k), family-independent)
  let maxPartial = 0; // max_i |S_i| (running accumulator magnitude)
  for (let k = 1; k <= N; k++) {
    const t = Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);
    s += t;
    sumAbs += Math.abs(t);
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
  }
  const ratio = maxPartial / sumAbs; // r = recovered-pessimism fraction (imp-35890 bound = gamma * r)
  return {
    alpha,
    beta,
    N,
    finalSum: s,
    sumAbs,
    maxPartial,
    ratio,
    // imp-35890 run-max normalized a-priori bound = gamma_{N-1} * max_i|S_i| / Sum|t_k| = gamma * r.
    runMaxNorm: GAMMA_AT_TPT * ratio,
    // fraction of the classic-Higham pessimistic bound RETAINED (1 = no gain, ~0 = full gain).
    fractionOfClassicBound: ratio,
  };
}

// -- Frequency grid at fixed N ~ 488602 -------------------------------------------------
// alpha values from an exact q=1 resonance (multiple of 2 pi, cos(alpha k) coherent for all
// integer k) through a slightly detuned q=1, the q=2 alternating resonance, and generic
// irrationals; beta values from 0 (no sqrt drift) through the imp-35812 golden angle. The
// q=1 resonance is the weak-cancellation corner: only the sqrt drift beta sqrt(k) can de-phase
// it, so small beta keeps the accumulator large while a moderate beta collapses it.
const ALPHA_GRID = [
  { alpha: 2 * Math.PI, label: '2pi (exact q=1 resonance: cos(2pi k) coherent for all k)' },
  { alpha: 2 * Math.PI + 1e-4, label: '2pi + 1e-4 (slightly detuned q=1)' },
  { alpha: Math.PI, label: 'pi (q=2 resonance: alternating (-1)^k, strong cancellation)' },
  { alpha: ALPHA_BASE, label: 'golden-ratio fraction (imp-35812 baseline)' },
  { alpha: 1.3, label: '1.3 (generic irrational)' },
  { alpha: 2.0, label: '2.0 (generic, faster)' },
];
const BETA_GRID = [
  { beta: 0, label: '0 (no sqrt drift)' },
  { beta: 0.002, label: '0.002 (small: beta*sqrt(N) ~ 1.4 rad, sub-pi, coherence preserved)' },
  { beta: 0.5, label: '0.5 (moderate: strong sqrt de-phasing)' },
  { beta: BETA_BASE, label: 'golden angle (imp-35812 baseline)' },
];

// Full grid scan at fixed N (deterministic; ~24 rungs x 488602 terms, cheap ~1.5 s).
const GRID = [];
for (const a of ALPHA_GRID) {
  for (const b of BETA_GRID) {
    const r = scan(a.alpha, b.beta, N_AT_TPT);
    GRID.push({ ...r, alphaLabel: a.label, betaLabel: b.label });
  }
}

// Baseline point (imp-35812 / imp-35890 frequencies) and grid extremes by accumulator ratio.
const BASELINE = GRID.find((g) => g.alpha === ALPHA_BASE && g.beta === BETA_BASE);
const WORST = GRID.reduce((m, g) => (g.ratio > m.ratio ? g : m), GRID[0]); // weakest cancellation
const BEST = GRID.reduce((m, g) => (g.ratio < m.ratio ? g : m), GRID[0]); // strongest cancellation

// Resonant corner (alpha = 2 pi exact q=1, beta = 0): the "cancellation breaks down" point.
const RESONANT_NO_DRIFT = GRID.find((g) => g.alpha === 2 * Math.PI && g.beta === 0);
// Same resonant alpha, moderate beta: the sqrt-drift restoring cancellation.
const RESONANT_WITH_DRIFT = GRID.find((g) => g.alpha === 2 * Math.PI && g.beta === 0.5);

// Orders of accumulator-scale pessimism recovered at baseline vs at the resonant corner.
const ORDERS_RECOVERED_BASELINE = -Math.log10(BASELINE.ratio); // ~2.9 (strong cancellation)
const ORDERS_RECOVERED_RESONANT = -Math.log10(RESONANT_NO_DRIFT.ratio); // ~0 (none; r -> 1)

export const IMP35949_W1_ACCUMULATOR_FREQUENCY_GRID_ROBUSTNESS = {
  id: 'imp-35949',
  proofSection: 'S-frontier',
  question:
    'MEASURE the robustness of the imp-35890 O(1) running-accumulator magnitude max_i|S_i| ~ 1.05 ' +
    'across an (alpha, beta) frequency grid for t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) at fixed ' +
    'N ~ 488602, locating any (alpha, beta) where the accumulator ceases to stay O(1) so the ' +
    'Sum|t_k|-scale cancellation breaks down and the imp-35890 running-accumulator bound approaches ' +
    'the pessimistic Sum|t_k| scale. Measurement only; changes no bound; NO QED.',
  fixedN: N_AT_TPT,
  recoveredPessimismDefinition:
    'r = max_i|S_i| / Sum|t_k| is the imp-35890 recovered-pessimism fraction: the run-max a-priori ' +
    'bound is gamma_{N-1} * r, so r -> 1 collapses it onto the classic pessimistic Higham bound ' +
    'gamma_{N-1} (no magnitude-scale gain) and r << 1 keeps the accumulator O(1) (bound far tighter)',
  baseline: {
    alpha: BASELINE.alpha,
    beta: BASELINE.beta,
    maxPartial: BASELINE.maxPartial,
    sumAbs: BASELINE.sumAbs,
    ratio: BASELINE.ratio,
    runMaxNorm: BASELINE.runMaxNorm,
    note:
      'imp-35812 / imp-35890 frequencies reproduce max_i|S_i| ~ 1.05 (O(1)) and Sum|t_k| ~ 889, ' +
      'r ~ 1.2e-3 -- STRONG cancellation; the recovered pessimism this baseline enjoys',
  },
  weakestCancellation: {
    alpha: WORST.alpha,
    beta: WORST.beta,
    alphaLabel: WORST.alphaLabel,
    betaLabel: WORST.betaLabel,
    maxPartial: WORST.maxPartial,
    sumAbs: WORST.sumAbs,
    ratio: WORST.ratio,
    runMaxNorm: WORST.runMaxNorm,
    note:
      'the (alpha, beta) where the accumulator grows most: near-resonant alpha (mod 2 pi -> 0) with ' +
      'no sqrt drift, r -> 1, so max_i|S_i| reaches Sum|t_k| and the running-accumulator bound ' +
      'collapses onto the classic pessimistic gamma_{N-1}',
  },
  strongestCancellation: {
    alpha: BEST.alpha,
    beta: BEST.beta,
    ratio: BEST.ratio,
    note: 'the (alpha, beta) with the smallest accumulator ratio on the grid (most O(1) accumulator)',
  },
  resonantCornerBreakdown: {
    alphaNearZeroNoDrift: {
      alpha: RESONANT_NO_DRIFT.alpha,
      beta: RESONANT_NO_DRIFT.beta,
      maxPartial: RESONANT_NO_DRIFT.maxPartial,
      sumAbs: RESONANT_NO_DRIFT.sumAbs,
      ratio: RESONANT_NO_DRIFT.ratio,
      note: 'alpha = 2 pi (q=1), beta = 0: cos(2 pi k) = 1 all k, max_i|S_i| = Sum|t_k|, r = 1 (no cancellation)',
    },
    alphaNearZeroWithDrift: {
      alpha: RESONANT_WITH_DRIFT.alpha,
      beta: RESONANT_WITH_DRIFT.beta,
      maxPartial: RESONANT_WITH_DRIFT.maxPartial,
      sumAbs: RESONANT_WITH_DRIFT.sumAbs,
      ratio: RESONANT_WITH_DRIFT.ratio,
      note: 'SAME resonant alpha but moderate beta = 0.5: the sqrt drift restores cancellation, r drops sharply',
    },
    reading:
      'the O(1) accumulator is CONTINGENT on the frequencies: it is the sqrt drift beta sqrt(k) (and/or ' +
      'alpha away from 2 pi rationals) that de-phases the sum. At the resonant no-drift corner the ' +
      'imp-35890 running-accumulator refinement buys NOTHING over the classic pessimistic Higham bound',
  },
  ordersRecoveredBaselineVsResonant: {
    baseline: ORDERS_RECOVERED_BASELINE,
    resonant: ORDERS_RECOVERED_RESONANT,
    note:
      'orders of accumulator-scale pessimism recovered = -log10(r): ~2.9 at the imp-35812 baseline, ' +
      '~0 at the resonant no-drift corner where the recovered pessimism vanishes',
  },
  classicPessimisticBoundAtR1: {
    value: GAMMA_AT_TPT,
    form: 'gamma_{N-1} (the r = 1 limit of the running-accumulator bound)',
    note:
      'even at full breakdown r = 1 the classic gamma_{N-1} ~ 5.4e-11 stays ~4 orders under the ' +
      'imp-35760 O(1) barrier margin, so precision is NOT the binding constraint at any (alpha, beta) -- ' +
      'this measurement only bounds how much the running-accumulator REFINEMENT can be relied upon',
  },
  grid: GRID.map((g) => ({
    alpha: g.alpha,
    beta: g.beta,
    alphaLabel: g.alphaLabel,
    betaLabel: g.betaLabel,
    maxPartial: g.maxPartial,
    sumAbs: g.sumAbs,
    ratio: g.ratio,
    runMaxNorm: g.runMaxNorm,
  })),
  conclusion: {
    notGeneric:
      'the imp-35890 O(1) running-accumulator flatness is NOT a generic property of the oscillatory ' +
      'term family -- it is contingent on the frequencies (alpha away from 2 pi rationals and/or a ' +
      'non-trivial beta sqrt-drift); the near-resonant no-drift corner drives max_i|S_i| to Sum|t_k|',
    boundCollapses:
      'where cancellation breaks down (r -> 1) the imp-35890 running-accumulator a-priori bound ' +
      'gamma_{N-1} * r collapses onto the classic pessimistic Higham bound gamma_{N-1}, recovering ' +
      'none of the ~3.2 magnitude-scale orders it recovers at the imp-35812 baseline',
    engineImplication:
      'a certified length-N interval sum cannot ASSUME the O(1) accumulator a priori; it must MONITOR ' +
      'the running accumulator magnitude at run time (the imp-35890 bound (B) run-time-monitor caveat), ' +
      'so the recovered pessimism is a measured run-time quantity, not a family-level constant',
    precisionNotBinding:
      'even at r = 1 the classic gamma_{N-1} stays ~4 orders under the imp-35760 O(1) barrier margin, ' +
      'so precision is NOT the binding constraint at any grid point; the obstruction stays the ' +
      'ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725)',
    staysGreenfield:
      'this module measures accumulator magnitudes only; it instantiates no directed-rounding interval ' +
      'and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Sweeping the running accumulator ' +
    'max_i|S_i| across an (alpha, beta) grid for t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) at fixed ' +
    'N ~ 488602, the imp-35890 O(1) flatness is CONFIRMED at the imp-35812 baseline (max_i|S_i| ~ 1.05, ' +
    'r = max_i|S_i|/Sum|t_k| ~ 1.2e-3) but is NOT generic: the q=1 resonant corner (alpha = 2 pi ' +
    'with beta = 0) drives r -> 1, so max_i|S_i| reaches Sum|t_k| ~ 1398 and the imp-35890 ' +
    'running-accumulator a-priori bound gamma_{N-1} * r COLLAPSES onto the classic pessimistic Higham ' +
    'gamma_{N-1}, recovering none of the ~3.2 magnitude-scale orders it enjoys at baseline. Restoring a ' +
    'moderate sqrt drift beta at the SAME resonant alpha restores cancellation (r drops by orders): the ' +
    'sqrt drift, not any special alpha, buys the O(1) accumulator. The O(1) flatness is therefore ' +
    'CONTINGENT on the frequencies and must be MONITORED at run time (imp-35890 bound (B) caveat), not ' +
    'assumed. Even at r = 1 the classic gamma_{N-1} ~ 5.4e-11 stays ~4 orders under the imp-35760 O(1) ' +
    'barrier margin, so precision is NOT the binding constraint at any (alpha, beta); the obstruction stays ' +
    'the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). Instantiates no ' +
    'directed-rounding interval; evaluates no true H_0; verifies no inequality; changes no bound; ' +
    'establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb GUE-conditional ' +
    '(imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35890 (O(1) running-accumulator a-priori bound this stress-tests); imp-35812 (baseline (alpha,beta) ' +
    'term family + exact-BigInt achieved error); imp-35854 (kappa sweep, complementary conditioning axis); ' +
    'imp-35761 (classic pessimistic gamma_{N-1} bound); imp-35760 (barrier-margin allocation); imp-35725 ' +
    '(mechanical N-term certified cost); imp-35681 Part A (A+B-C interval bound greenfield); imp-35674 Part D ' +
    '(N(x)=floor(sqrt(x/4 pi)) retained terms); Higham 2002 sec 4.2 (recursive-sum running error bound); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP35949_W1_ACCUMULATOR_FREQUENCY_GRID_ROBUSTNESS_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602; every grid point shares this fixed N.
    id: 'imp35949-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 fixed across the whole (alpha,beta) grid',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5 &&
      GRID.every((g) => g.N === N_AT_TPT),
  },
  {
    // Baseline reproduces imp-35890: O(1) accumulator (~1.05), Sum|t_k| ~ 889, r << 1.
    id: 'imp35949-baseline-reproduces-imp35890',
    description: 'imp-35812 baseline (alpha,beta) reproduces max_i|S_i| ~ 1.05 (O(1)), Sum|t_k| ~ 889, r < 0.01',
    holds: () =>
      BASELINE.maxPartial > 0.5 &&
      BASELINE.maxPartial < 5 &&
      BASELINE.sumAbs > 800 &&
      BASELINE.sumAbs < 1000 &&
      BASELINE.ratio < 0.01,
  },
  {
    // At the q=1 resonance Sum|t_k| itself climbs (|cos| ~ 1) while a generic (alpha,beta)
    // averages |cos| ~ 2/pi; the accumulator max_i|S_i| is the dramatic mover, not Sum|t_k|.
    id: 'imp35949-resonant-sumabs-climbs',
    description: 'At the q=1 resonance Sum|t_k| ~ 1398 (|cos|~1) exceeds the generic-baseline ~889 (|cos|~2/pi)',
    holds: () =>
      RESONANT_NO_DRIFT.sumAbs > 1300 &&
      RESONANT_NO_DRIFT.sumAbs < 1500 &&
      RESONANT_NO_DRIFT.sumAbs > 1.4 * BASELINE.sumAbs,
  },
  {
    // Resonant no-drift corner: cancellation fully breaks down, r = 1, accumulator = Sum|t_k|.
    id: 'imp35949-resonant-breakdown-r-to-1',
    description: 'alpha=2pi (q=1), beta=0 drives r -> 1: max_i|S_i| = Sum|t_k| (accumulator no longer O(1))',
    holds: () =>
      RESONANT_NO_DRIFT.ratio > 0.999 &&
      Math.abs(RESONANT_NO_DRIFT.maxPartial - RESONANT_NO_DRIFT.sumAbs) < 1e-6 &&
      RESONANT_NO_DRIFT.maxPartial > 1000, // grew far past the O(1) baseline ~1.05
  },
  {
    // O(1) flatness is NOT generic: the worst grid ratio is >100x the baseline ratio.
    id: 'imp35949-o1-not-generic',
    description: 'The accumulator O(1) flatness is NOT generic: worst grid r is >100x the baseline r',
    holds: () =>
      WORST.ratio / BASELINE.ratio > 100 &&
      WORST.ratio > 0.5 && // weak-cancellation corner really does approach the Sum|t_k| scale
      BEST.ratio < 0.01, // strongly-cancelling points (incl. the baseline) also exist on the grid
  },
  {
    // The sqrt drift restores cancellation: moderate beta at the SAME resonant alpha cuts r by >=10x.
    id: 'imp35949-sqrt-drift-restores-cancellation',
    description: 'A moderate beta at the resonant alpha restores cancellation: r drops >=10x vs beta=0',
    holds: () =>
      RESONANT_WITH_DRIFT.ratio < RESONANT_NO_DRIFT.ratio / 10 &&
      RESONANT_WITH_DRIFT.maxPartial < RESONANT_NO_DRIFT.maxPartial / 10,
  },
  {
    // Bound collapse: at the worst point the run-max bound approaches the classic pessimistic gamma.
    id: 'imp35949-bound-collapses-to-pessimistic',
    description: 'At the weakest-cancellation corner the imp-35890 run-max bound approaches classic gamma_{N-1}',
    holds: () =>
      WORST.runMaxNorm > 0.5 * GAMMA_AT_TPT && // run-max = gamma * r -> gamma when r -> 1
      BASELINE.runMaxNorm < 0.01 * GAMMA_AT_TPT && // baseline still recovers >=2 orders
      ORDERS_RECOVERED_BASELINE > 2 &&
      ORDERS_RECOVERED_RESONANT < 0.1,
  },
  {
    // Precision still not binding even at full collapse: classic gamma stays well under the margin.
    id: 'imp35949-precision-not-binding-at-r1',
    description: 'Even at r = 1 the classic gamma_{N-1} ~ 5.4e-11 stays orders under the O(1) barrier margin',
    holds: () => GAMMA_AT_TPT > 1e-12 && GAMMA_AT_TPT < 1e-9,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35949-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35949_W1_ACCUMULATOR_FREQUENCY_GRID_ROBUSTNESS.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP35949_W1_ACCUMULATOR_FREQUENCY_GRID_ROBUSTNESS.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35949_W1_ACCUMULATOR_FREQUENCY_GRID_ROBUSTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP35949_W1_ACCUMULATOR_FREQUENCY_GRID_ROBUSTNESS.verdict),
  },
];

for (const a of IMP35949_W1_ACCUMULATOR_FREQUENCY_GRID_ROBUSTNESS_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35949-w1-accumulator-frequency-grid-robustness assertion failed: ${a.id}`);
  }
}
