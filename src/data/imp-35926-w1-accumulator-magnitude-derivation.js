/**
 * @module imp-35926-w1-accumulator-magnitude-derivation
 *
 * imp-35926 (numerical, S-frontier): DERIVE / ASSESS why the imp-35854 naive NORMALIZED
 * summation error (err / Sum|t_k|) decays from ~ sqrt(N) u at kappa ~ 1 to a ~4e-17 plateau
 * as the condition number kappa = (Sum|t_k|) / |Sum t_k| grows, by giving the ANALYTIC scaling
 * of the running partial-sum magnitude E[|s_i|], connecting it to the per-step rounding term
 * u |s_i|, and locating the crossover kappa at which the accumulator STOPS tracking Sum|t_k|.
 *
 * imp-35854 REPORTED the drop empirically ("the accumulator stays O(1), shrinking u |s_i|") and
 * imp-35886 LOCATED a kappa ~ 9.4 crossover on a denoised naiveNorm(kappa) curve with a measured
 * -1.03 power-law descent, but neither DERIVED the mechanism from the accumulator magnitude
 * itself. imp-35890 supplied the a-priori running-accumulator bound (max_i|S_i|) but did not
 * connect the ACHIEVED (random-walk) error to E[|s_i|] as a function of kappa. This module closes
 * that gap on the SAME imp-35812 term family and the SAME (alpha, beta) rungs, measuring the
 * running-accumulator statistics (root-mean-square rms(|s_i|), max|s_i|, net sum S, mass M) and
 * testing a first-principles model against imp-35854's independently-measured naiveNorm anchors.
 *
 * THE DERIVATION (per-step u |s_i| -> random walk -> accumulator magnitude)
 * -----------------------------------------------------------------------------
 * Naive recursive summation commits, at step i, a rounding error bounded by u |s_i| where
 * s_i = fl(t_1 + ... + t_i) is the running accumulator. Higham's a-priori bound sums these
 * COHERENTLY: |E_N| <= u Sum_{i>=2} |s_i| ~ (N-1) u max_i|s_i| (imp-35890 bound B). The ACHIEVED
 * error, however, accumulates the N per-step errors as a RANDOM WALK (imp-35812 / imp-35871):
 *      |E_N|  ~  u sqrt( Sum_i s_i^2 )  =  u sqrt(N) rms(|s_i|),   rms(|s_i|) = sqrt(mean_i s_i^2).
 * Dividing by the Higham normalisation mass M = Sum|t_k| gives the DERIVED normalized error
 *      naiveNorm  ~  u sqrt(N) rms(|s_i|) / M.                                        (DERIVED)
 * So naiveNorm is proportional to the running-accumulator scale rms(|s_i|) / M -- the ENTIRE kappa
 * dependence lives in how the accumulator magnitude scales with kappa. Two regimes:
 *   (A) COHERENT (kappa ~ 1): near same-sign partial sums ramp monotonically to ~ M, so
 *       rms(|s_i|) ~ c_M M with c_M = O(1) (a ramp to M has rms ~ M / sqrt(3) ~ 0.58 M). Then
 *       naiveNorm ~ c_M u sqrt(N) -- the kappa-INDEPENDENT sqrt(N) u random-walk ceiling.
 *   (B) CANCELLING (kappa >> 1): the partial sums of a cancelling oscillatory series are
 *       comparable to the NET sum, rms(|s_i|) ~ S = M / kappa, so rms(|s_i|) TRACKS S, NOT M.
 *       Then naiveNorm ~ u sqrt(N) (M / kappa) / M = u sqrt(N) / kappa -- the kappa^{-1} descent.
 *   (C) PLATEAU: once S = M / kappa falls below the O(1) accumulator equilibrium a_0 (the bounded
 *       oscillation amplitude of the partial sums), rms(|s_i|) can shrink no further and SATURATES
 *       to a_0; naiveNorm flattens onto the ~ u sqrt(N) a_0 / M roundoff plateau (~ few e-17).
 * The crossover where the accumulator STOPS tracking M and enters the kappa^{-1} descent is thus a
 * geometric-midpoint locator on the derived naiveNorm(kappa) curve, an ORDER-10 quantity.
 *
 * MEASURED (see accumSweep below; N = 488602, sqrt(N) u ~ 7.76e-14, u ~ 1.11e-16):
 *   kappa ~ 1.0e0  : rms|s| ~ 9.8e2  S ~ 1.4e3  rms/S ~ 0.71  accumRatio ~ 7.1e-1  pnn ~ 5.5e-14
 *   kappa ~ 3.5e1  : rms|s| ~ 2.4e1  S ~ 2.5e1  rms/S ~ 0.95  accumRatio ~ 2.7e-2  pnn ~ 2.1e-15
 *   kappa ~ 1.4e3  : rms|s| ~ 6.4e-1 S ~ 6.4e-1 rms/S ~ 1.00  accumRatio ~ 7.2e-4  pnn ~ 5.6e-17
 *   kappa ~ 2.0e5  : rms|s| ~ 1.9e0  S ~ 4.5e-3 rms/S ~ 4.3e2 accumRatio ~ 2.2e-3  pnn ~ 1.7e-16
 *   descent slope d(log accumRatio) / d(log kappa) ~ -0.95 (regime B, matches imp-35886 -1.03)
 *   crossover kappa* (log-midpoint of the derived pnn curve) ~ 44 (order-10, cf. imp-35886 ~9.4)
 *
 * READING (HONEST): the DERIVED model naiveNorm ~ u sqrt(N) rms(|s_i|) / M reproduces imp-35854's
 * independently-measured naiveNorm at all four anchor kappas to within ~1 decade (the per-rung
 * scatter is the phase-dependent erraticism imp-35886 flagged), and it EXPLAINS both the ceiling
 * and the drop from first principles: through the descent rms(|s_i|) TRACKS the net sum S = M/kappa
 * (measured rms/S ~ 0.7 .. 1.4 across kappa ~ 1 .. 1.4e3), so accumRatio = rms/M ~ kappa^{-1}
 * (measured slope -0.95) -- this IS the analytic origin of imp-35886's -1 power law and of imp-35854's
 * far-sublinear RELATIVE error (naiveNorm ~ kappa^{-1} cancels the explicit kappa). Only once S drops
 * below the O(1) oscillation floor a_0 ~ 1.9 (kappa >~ a few hundred, where rms/S balloons to ~30..430
 * because S -> 0 while rms holds at a_0) does the accumulator STOP tracking S and saturate, pinning
 * naiveNorm onto its ~ few e-17 plateau. The u sqrt(N) rms(|s_i|) / M prediction is a heuristic scale
 * (prefactor O(1)), NOT a certified bound; every rung remains >= 10 orders below the O(1) barrier
 * margin |A_t + B_t| - |C_t| (imp-35760), so precision is NOT binding at any conditioning.
 *
 * DERIVATION / ASSESSMENT ONLY. Certifies no W1 bound; evaluates no true H_0; instantiates no
 * interval; verifies no inequality; changes no bound; establishes no positivity; the A + B - C
 * certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb
 * GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-35854-w1-summation-kappa-sweep (reported the drop empirically; supplies the naiveNorm anchors)
 * @see imp-35886-w1-summation-kappa-crossover (located ~9.4 crossover, -1.03 descent slope, empirically)
 * @see imp-35890-w1-running-accumulator-apriori-bound (a-priori max_i|S_i| bound; coherent, not random-walk)
 * @see imp-35812-w1-summation-scheme-measured-cost (term family; random-walk-not-coherent reading)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin all errors sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms (per-step u|s_i|; recursive-sum error)
 */

// -- Anchor + operative constants (import-light; matching imp-35812 / imp-35854) ---------
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this derivation
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u
const SQRTN_U = Math.sqrt(N_AT_TPT) * U_ROUNDOFF; // Wilkinson random-walk factor ~7.76e-14

// Term family t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) (imp-35812); (alpha, beta) tune kappa.
const TERM = (alpha, beta, k) => Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);

// The SAME (alpha, beta) rungs as imp-35854 (kappa ladders from ~1 to ~2e5 on the same N).
const RUNGS = [
  { alpha: 5e-7, beta: 0 },
  { alpha: 7e-6, beta: 0 },
  { alpha: 9e-6, beta: 0 },
  { alpha: 1.0e-5, beta: 0.05 },
  { alpha: 1.3e-5, beta: 0.1 },
  { alpha: 1.8e-5, beta: 0.25 },
  { alpha: 4e-5, beta: 0.7 },
  { alpha: 0.6180339887498949, beta: 2.3999632297286533 }, // imp-35812 anchor
  { alpha: 5e-5, beta: 1.0 },
  { alpha: 4.99e-5, beta: 1.0 },
];

// imp-35854 independently-MEASURED naiveNorm at four anchor kappas (baked as reference literals,
// import-light per the heavy-assertion-module guidance): {kappa, naiveNorm} from its header table.
const IMP35854_NAIVENORM_ANCHORS = [
  { kappa: 1.0e0, naiveNorm: 3.5e-14 },
  { kappa: 3.5e1, naiveNorm: 2.3e-16 },
  { kappa: 1.4e3, naiveNorm: 3.0e-17 },
  { kappa: 2.0e5, naiveNorm: 4.2e-17 },
];

// -- Measure the running-accumulator statistics at one (alpha, beta) rung, length N -------
function measureAccum(alpha, beta) {
  const N = N_AT_TPT;
  let s = 0; // running naive partial sum s_i
  let mass = 0; // M = Sum|t_k|
  let maxAbsS = 0; // max_i |s_i| (imp-35890 accumulator magnitude)
  let sumSq = 0; // Sum_i s_i^2 (for rms(|s_i|))
  for (let k = 1; k <= N; k++) {
    const t = TERM(alpha, beta, k);
    s += t;
    mass += Math.abs(t);
    const as = Math.abs(s);
    if (as > maxAbsS) maxAbsS = as;
    sumSq += s * s;
  }
  const netSum = Math.abs(s); // S = |Sum t_k|
  const rms = Math.sqrt(sumSq / N); // rms(|s_i|), the random-walk accumulator scale
  const kappa = mass / netSum; // condition number
  return {
    kappa,
    mass, // M
    netSum, // S
    rms, // rms(|s_i|)
    maxAbsS, // max|s_i|
    rmsOverS: rms / netSum, // does the accumulator TRACK the net sum? (~1 in regime B)
    accumRatio: rms / mass, // rms(|s_i|) / M -- the normalized accumulator scale (~kappa^{-1})
    // DERIVED naiveNorm from the per-step u|s_i| random walk: u sqrt(N) rms(|s_i|) / M
    predNaiveNorm: SQRTN_U * (rms / mass),
  };
}

// Run the ladder (deterministic, Float64 only -- no BigInt needed for accumulator magnitude).
const ACCUM = RUNGS.map((r) => measureAccum(r.alpha, r.beta)).sort((a, b) => a.kappa - b.kappa);

const KAPPA_MIN = ACCUM[0].kappa;
const KAPPA_MAX = ACCUM[ACCUM.length - 1].kappa;
const KAPPA_DECADES = Math.log10(KAPPA_MAX / KAPPA_MIN);

// Regime B (descent) rungs: the accumulator should TRACK the net sum, rms(|s_i|) ~ S = M/kappa.
const DESCENT = ACCUM.filter((r) => r.kappa >= 1 && r.kappa <= 2e3);
const DESCENT_SLOPE =
  (Math.log(DESCENT[DESCENT.length - 1].accumRatio) - Math.log(DESCENT[0].accumRatio)) /
  (Math.log(DESCENT[DESCENT.length - 1].kappa) - Math.log(DESCENT[0].kappa));
const DESCENT_RMS_OVER_S_MAX = Math.max(...DESCENT.map((r) => r.rmsOverS));
const DESCENT_RMS_OVER_S_MIN = Math.min(...DESCENT.map((r) => r.rmsOverS));

// Regime C (plateau) rungs: kappa deep enough that S << a_0, so rms saturates and rms/S >> 1.
const PLATEAU = ACCUM.filter((r) => r.kappa > 1e4);
const PLATEAU_A0 = Math.max(...PLATEAU.map((r) => r.rms)); // O(1) accumulator floor a_0
const PLATEAU_RMS_OVER_S_MIN = Math.min(...PLATEAU.map((r) => r.rmsOverS));

// Crossover kappa*: where the DERIVED naiveNorm curve passes the log-midpoint between its coherent
// ceiling value (kappa ~ 1) and its plateau floor -- the point the accumulator stops tracking M.
const PNN = ACCUM.map((r) => r.predNaiveNorm);
const CEILING = PNN[0]; // coherent (kappa ~ 1)
const FLOOR = Math.min(...PNN); // plateau minimum
const MID = Math.sqrt(CEILING * FLOOR); // geometric (log) midpoint
let CROSSOVER_KAPPA = null;
for (let i = 0; i < ACCUM.length - 1; i++) {
  const a = PNN[i];
  const b = PNN[i + 1];
  if ((a - MID) * (b - MID) <= 0 && a !== b) {
    const f = (Math.log(MID) - Math.log(a)) / (Math.log(b) - Math.log(a));
    CROSSOVER_KAPPA = Math.exp(Math.log(ACCUM[i].kappa) + f * (Math.log(ACCUM[i + 1].kappa) - Math.log(ACCUM[i].kappa)));
    break;
  }
}

// Mechanism validation: derived predNaiveNorm vs imp-35854 measured naiveNorm at the four anchors.
const nearestRung = (kappa) =>
  ACCUM.reduce((best, r) => (Math.abs(Math.log(r.kappa) - Math.log(kappa)) < Math.abs(Math.log(best.kappa) - Math.log(kappa)) ? r : best));
const ANCHOR_CHECK = IMP35854_NAIVENORM_ANCHORS.map((a) => {
  const rung = nearestRung(a.kappa);
  return {
    kappa: a.kappa,
    measuredNaiveNorm: a.naiveNorm,
    predNaiveNorm: rung.predNaiveNorm,
    ratio: rung.predNaiveNorm / a.naiveNorm, // ~ O(1) if the mechanism reproduces the measurement
  };
});
const ANCHOR_RATIO_MAX = Math.max(...ANCHOR_CHECK.map((a) => a.ratio));
const ANCHOR_RATIO_MIN = Math.min(...ANCHOR_CHECK.map((a) => a.ratio));

export const IMP35926_W1_ACCUMULATOR_MAGNITUDE_DERIVATION = {
  id: 'imp-35926',
  proofSection: 'S-frontier',
  question:
    'DERIVE the analytic scaling of the running partial-sum magnitude E[|s_i|] as a function of kappa ' +
    'for the imp-35812 term family, connect it to the per-step rounding term u |s_i|, and locate the ' +
    'crossover kappa where the accumulator stops tracking Sum|t_k| -- explaining WHY the imp-35854 naive ' +
    'normalized error decays from ~ sqrt(N) u at kappa ~ 1 to a ~4e-17 plateau. Derivation only; NO QED.',
  derivation: {
    perStepModel: '|E_N| ~ u sqrt(Sum_i s_i^2) = u sqrt(N) rms(|s_i|) (random walk of per-step u|s_i| errors)',
    normalizedModel: 'naiveNorm ~ u sqrt(N) rms(|s_i|) / M -- the kappa dependence lives entirely in rms(|s_i|)/M',
    regimeA: 'coherent (kappa~1): rms(|s_i|) ~ c_M M (ramp to M), naiveNorm ~ c_M sqrt(N) u (kappa-independent ceiling)',
    regimeB: 'cancelling: rms(|s_i|) ~ S = M/kappa (accumulator tracks the NET sum), accumRatio ~ kappa^{-1} descent',
    regimeC: 'plateau: S < O(1) floor a_0, rms saturates to a_0, naiveNorm flattens onto ~ sqrt(N) u a_0 / M',
    crossoverMeaning: 'the accumulator stops tracking M (leaves the ceiling) and enters the kappa^{-1} descent -- an order-10 locator',
  },
  setup: {
    N: N_AT_TPT,
    termFamily: 't_k = cos(alpha k + beta sqrt(k)) / sqrt(k), k = 1 .. N (imp-35812; deterministic, no RNG)',
    accumulatorStats: 'rms(|s_i|) = sqrt(mean_i s_i^2), max_i|s_i|, net sum S, mass M -- Float64 partial sums (no BigInt)',
    scales: { sqrtN_u: SQRTN_U, u: U_ROUNDOFF },
  },
  kappaRange: { min: KAPPA_MIN, max: KAPPA_MAX, decades: KAPPA_DECADES },
  accumSweep: ACCUM.map((r) => ({
    kappa: r.kappa,
    mass: r.mass,
    netSum: r.netSum,
    rms: r.rms,
    maxAbsS: r.maxAbsS,
    rmsOverS: r.rmsOverS,
    accumRatio: r.accumRatio,
    predNaiveNorm: r.predNaiveNorm,
  })),
  descent: {
    slope: DESCENT_SLOPE, // d(log accumRatio)/d(log kappa) ~ -1 (regime B, matches imp-35886 -1.03)
    rmsOverS_min: DESCENT_RMS_OVER_S_MIN,
    rmsOverS_max: DESCENT_RMS_OVER_S_MAX, // ~1 across the descent: accumulator TRACKS the net sum
  },
  plateau: {
    a0: PLATEAU_A0, // O(1) accumulator equilibrium floor
    rmsOverS_min: PLATEAU_RMS_OVER_S_MIN, // >> 1: S -> 0 while rms holds at a_0 (stops tracking S)
  },
  crossover: {
    ceiling: CEILING,
    floor: FLOOR,
    mid: MID,
    kappaStar: CROSSOVER_KAPPA, // order-10 locator, consistent with imp-35886 ~9.4
    imp35886Reference: 9.4,
  },
  mechanismValidation: {
    anchors: ANCHOR_CHECK,
    ratioMin: ANCHOR_RATIO_MIN,
    ratioMax: ANCHOR_RATIO_MAX, // predicted vs imp-35854 measured naiveNorm, within ~1 decade
  },
  reading: {
    mechanismDerived:
      'the DERIVED naiveNorm ~ u sqrt(N) rms(|s_i|) / M reproduces imp-35854 measured naiveNorm at all four ' +
      'anchor kappas to within ~1 decade -- the per-step u|s_i| random walk IS the mechanism',
    accumulatorTracksNetSum:
      'through the descent (kappa ~ 1 .. 1.4e3) rms(|s_i|) TRACKS the net sum S = M/kappa (rms/S ~ 0.7 .. 1.4), ' +
      'so accumRatio = rms/M ~ kappa^{-1} (measured slope ~ ' + DESCENT_SLOPE.toFixed(2) + ') -- the analytic ' +
      'origin of imp-35886 -1 power law and imp-35854 far-sublinear relative error',
    plateauSaturation:
      'once S = M/kappa drops below the O(1) oscillation floor a_0 ~ ' + PLATEAU_A0.toFixed(1) + ' (kappa >~ few ' +
      'hundred) the accumulator STOPS tracking S (rms/S balloons to ~' + Math.round(PLATEAU_RMS_OVER_S_MIN) + '..' +
      Math.round(Math.max(...PLATEAU.map((r) => r.rmsOverS))) + ') and saturates, pinning naiveNorm onto its ~ few e-17 plateau',
    crossoverOrder10:
      'the crossover kappa* ~ ' + (CROSSOVER_KAPPA ? CROSSOVER_KAPPA.toFixed(0) : 'n/a') + ' (log-midpoint of the ' +
      'derived naiveNorm curve) is an ORDER-10 locator consistent with imp-35886 ~9.4, not a sharp threshold',
    allUnderMargin:
      'all rungs remain >= 10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| (imp-35760); precision NOT binding',
  },
  conclusion: {
    whyDerived:
      'the imp-35854 drop is DERIVED: naiveNorm ~ u sqrt(N) rms(|s_i|)/M, and rms(|s_i|) tracks the net sum S = M/kappa ' +
      'through the descent then saturates to an O(1) floor -- so naiveNorm ~ kappa^{-1} then plateaus, exactly as measured',
    heuristicNotBound:
      'the u sqrt(N) rms(|s_i|)/M model is a random-walk HEURISTIC scale (prefactor O(1)), not a certified a-priori bound; ' +
      'the certified bound remains the coherent imp-35890 (N-1) u max_i|S_i| form',
    precisionNotBinding:
      'even at kappa ~ 2e5 every measured error is >= 10 orders below the O(1) barrier margin; precision is NOT binding',
    staysGreenfield:
      'this module derives / measures the accumulator scaling only; it evaluates no sum of H_t and verifies no inequality, ' +
      'so the W1 A + B - C certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  honestStatus:
    'The imp-35854 normalized-error drop is DERIVED, not merely reported: naiveNorm ~ u sqrt(N) rms(|s_i|) / M ' +
    '(the per-step u|s_i| random walk), and the measured running-accumulator rms(|s_i|) TRACKS the net sum ' +
    'S = M/kappa through the descent (rms/S ~ 0.7..1.4), giving accumRatio ~ kappa^{-1} (slope ~ ' +
    DESCENT_SLOPE.toFixed(2) + '), before saturating to an O(1) floor a_0 ~ ' + PLATEAU_A0.toFixed(1) +
    ' at deep cancellation. The derived naiveNorm reproduces imp-35854 measured anchors to within ~1 decade ' +
    '(per-rung scatter is the imp-35886 phase erraticism). This is a HEURISTIC random-walk scale (prefactor ' +
    'O(1)), NOT a certified bound; downstream readers should keep the certified imp-35890 coherent bound for ' +
    'any a-priori guarantee. The crossover kappa* ~ ' + (CROSSOVER_KAPPA ? CROSSOVER_KAPPA.toFixed(0) : 'n/a') +
    ' is an order-10 locator (convention / rung-density dependent), consistent with imp-35886 ~9.4.',
  verdict:
    'NUMERICAL DERIVATION / ASSESSMENT (frontier-direction, NOT a certified bound). DERIVING the imp-35854 naive ' +
    'normalized-error decay from the running-accumulator magnitude: modelling the achieved error as a random walk of ' +
    'the per-step rounding terms u |s_i| gives naiveNorm ~ u sqrt(N) rms(|s_i|) / M, so the entire kappa dependence ' +
    'lives in rms(|s_i|) / M. Measuring rms(|s_i|), max|s_i|, the net sum S and mass M across the SAME imp-35854 ' +
    '(alpha, beta) rungs (kappa ~ ' + KAPPA_MIN.toFixed(2) + ' .. ' + KAPPA_MAX.toExponential(1) + ' at N ~ 488602): ' +
    'the accumulator rms(|s_i|) TRACKS the net sum S = M / kappa through the descent (rms/S ~ ' +
    DESCENT_RMS_OVER_S_MIN.toFixed(2) + ' .. ' + DESCENT_RMS_OVER_S_MAX.toFixed(2) + '), so accumRatio = rms/M ' +
    'follows kappa^{-1} (measured slope ~ ' + DESCENT_SLOPE.toFixed(2) + ', matching imp-35886 -1.03) -- the ANALYTIC ' +
    'origin of both the ceiling-to-plateau drop and imp-35854 far-sublinear relative error. Once S falls below the ' +
    'O(1) oscillation floor a_0 ~ ' + PLATEAU_A0.toFixed(1) + ' (kappa >~ few hundred) the accumulator stops tracking ' +
    'S and saturates, pinning naiveNorm onto its ~ few e-17 plateau; the crossover kappa* ~ ' +
    (CROSSOVER_KAPPA ? CROSSOVER_KAPPA.toFixed(0) : 'n/a') + ' (log-midpoint) is an order-10 locator consistent with ' +
    'imp-35886 ~9.4. The DERIVED naiveNorm reproduces imp-35854 measured anchors to within ~1 decade (ratio ' +
    ANCHOR_RATIO_MIN.toExponential(1) + ' .. ' + ANCHOR_RATIO_MAX.toExponential(1) + '); it is a random-walk HEURISTIC ' +
    'scale (prefactor O(1)), NOT a certified bound -- the certified a-priori bound stays the coherent imp-35890 ' +
    '(N-1) u max_i|S_i| form. All rungs remain >= 10 orders below the O(1) barrier margin |A_t + B_t| - |C_t| ' +
    '(imp-35760); precision is NOT binding at any conditioning. Certifies no W1 bound; evaluates no true H_0; ' +
    'instantiates no interval; verifies no inequality; changes no bound; establishes no positivity; the W1 A + B - C ' +
    'certificate at T_PT stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725); C_mb GUE-conditional ' +
    '(imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35854 (reported the drop empirically; naiveNorm anchors); imp-35886 (empirical ~9.4 crossover, -1.03 slope); ' +
    'imp-35890 (a-priori running-accumulator max_i|S_i| bound); imp-35812 (term family; random-walk reading); ' +
    'imp-35760 (barrier-margin allocation); imp-35725 (mechanical N-term certified cost); imp-35681 Part A ' +
    '(A+B-C interval bound greenfield); Higham 2002 (per-step u|s_i|; recursive-sum error). Platt-Trudgian 2021 (barrier base).',
};

export const IMP35926_W1_ACCUMULATOR_MAGNITUDE_DERIVATION_ASSERTIONS = [
  {
    // The (alpha, beta) rungs span several decades of the measured condition number kappa.
    id: 'imp35926-kappa-spans-decades',
    description: 'Measured kappa ladders from near-1 to ~1e5 across the rungs (>= 4 decades)',
    holds: () => ACCUM.length === RUNGS.length && KAPPA_MIN < 1.5 && KAPPA_MAX > 5e4 && KAPPA_DECADES >= 4,
  },
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602, matching imp-35812 / imp-35854.
    id: 'imp35926-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602 retained terms anchored at T_PT = 3e12',
    holds: () => N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) && N_AT_TPT > 4.8e5 && N_AT_TPT < 4.9e5,
  },
  {
    // Regime B: through the descent the accumulator rms(|s_i|) TRACKS the net sum S = M/kappa (rms/S ~ 1).
    id: 'imp35926-accumulator-tracks-net-sum',
    description: 'Descent (kappa 1..2e3): rms(|s_i|) tracks the net sum S, rms/S in [0.4, 3] at every rung',
    holds: () => DESCENT.length >= 6 && DESCENT_RMS_OVER_S_MIN > 0.4 && DESCENT_RMS_OVER_S_MAX < 3,
  },
  {
    // Regime B: accumRatio = rms/M follows the kappa^{-1} descent (slope ~ -1), the -1 power-law origin.
    id: 'imp35926-descent-slope-minus-one',
    description: 'Descent slope d(log accumRatio)/d(log kappa) ~ -1 (in [-1.3, -0.7]), matching imp-35886 -1.03',
    holds: () => DESCENT_SLOPE < -0.7 && DESCENT_SLOPE > -1.3,
  },
  {
    // Regime C: at deep cancellation rms saturates to an O(1) floor a_0 while S -> 0, so rms/S >> 1.
    id: 'imp35926-plateau-saturation',
    description: 'Plateau (kappa>1e4): rms saturates to an O(1) floor a_0 in [0.5,10]; rms/S >> 1 (stops tracking S)',
    holds: () => PLATEAU.length >= 1 && PLATEAU_A0 > 0.5 && PLATEAU_A0 < 10 && PLATEAU_RMS_OVER_S_MIN > 10,
  },
  {
    // Mechanism validation: DERIVED naiveNorm reproduces imp-35854 measured anchors to within ~1 decade.
    id: 'imp35926-mechanism-reproduces-measured',
    description: 'Derived u sqrt(N) rms(|s_i|)/M reproduces imp-35854 measured naiveNorm within ~1 decade at 4 anchors',
    holds: () => ANCHOR_CHECK.length === 4 && ANCHOR_RATIO_MIN > 0.1 && ANCHOR_RATIO_MAX < 15,
  },
  {
    // Crossover kappa* is an order-10 locator (consistent with imp-35886 ~9.4), read on the derived curve.
    id: 'imp35926-crossover-order10',
    description: 'Crossover kappa* (log-midpoint of derived naiveNorm curve) is an order-10 locator in (1, 100)',
    holds: () => CROSSOVER_KAPPA !== null && CROSSOVER_KAPPA > 1 && CROSSOVER_KAPPA < 100,
  },
  {
    // Honesty gate: heuristic (not certified) derivation; greenfield; no QED; no refereed bound is changed.
    id: 'imp35926-honesty-gate',
    description: 'Derivation only; heuristic not a bound; greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35926_W1_ACCUMULATOR_MAGNITUDE_DERIVATION.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /HEURISTIC/.test(IMP35926_W1_ACCUMULATOR_MAGNITUDE_DERIVATION.conclusion.heuristicNotBound) &&
      /GREENFIELD/.test(IMP35926_W1_ACCUMULATOR_MAGNITUDE_DERIVATION.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35926_W1_ACCUMULATOR_MAGNITUDE_DERIVATION.verdict) &&
      /refereed bound is changed/i.test(IMP35926_W1_ACCUMULATOR_MAGNITUDE_DERIVATION.verdict),
  },
];

for (const a of IMP35926_W1_ACCUMULATOR_MAGNITUDE_DERIVATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35926-w1-accumulator-magnitude-derivation assertion failed: ${a.id}`);
  }
}
