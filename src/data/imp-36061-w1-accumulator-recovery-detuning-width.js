/**
 * @module imp-36061-w1-accumulator-recovery-detuning-width
 *
 * imp-36061 (numerical, S-frontier): MEASURE the phase-detuning WIDTH from the q=1
 * resonance at which the imp-35890 running-accumulator ratio r = max_i|S_i| / Sum|t_k|
 * RECOVERS to within 10% (and 1%) of the imp-35812 strong-cancellation baseline
 * r_base ~ 1.18e-3, for the oscillatory term family t_k = cos(alpha k + beta sqrt k)/sqrt k
 * at fixed N ~ 488602. This quantifies the concrete run-time-monitoring safety margin that
 * imp-36004 / imp-35949 said a certified engine needs, since the imp-35890 O(1) accumulator
 * flatness is FREQUENCY-CONTINGENT and collapses (r -> 1) at the resonance.
 *
 * imp-35949 LOCATED the q=1 resonant corner (alpha = 2 pi, beta = 0: cos(2 pi k) = 1 for
 * every integer k, so r -> 1 and the imp-35890 run-max bound gamma_{N-1} * r degenerates
 * onto the classic pessimistic Higham gamma_{N-1}). imp-35991 measured the r < 1e-2 basin
 * EDGE (a modest threshold: "still O(1)"): alpha detuning ~0.0356 rad, beta drift ~0.269.
 * But "under 1e-2" is a weak recovery; neither measured the detuning needed to bring r back
 * DOWN CLOSE TO the actual baseline value r_base ~ 1.18e-3 -- the quantity a run-time monitor
 * comparing against the baseline would key on. This module answers that on BOTH axes by
 * locating, from the resonance, the smallest perturbation at which r first drops to within
 * 10% and within 1% of r_base:
 *   (A) ALPHA / resonance-proximity axis -- fix beta = 0, detune alpha above 2 pi (note
 *       cos((2 pi + delta) k) = cos(delta k), so this is a pure linear-phase oscillation of
 *       frequency delta); find the smallest |delta| at which r <= 1.10 r_base and <= 1.01 r_base.
 *   (B) BETA / sqrt-drift axis -- fix alpha = 2 pi (exact resonance) and grow beta; find the
 *       smallest beta at which r <= 1.10 r_base and <= 1.01 r_base.
 *
 * MEASUREMENT ONLY. Instantiates no directed-rounding interval; evaluates no true H_0;
 * verifies no inequality; changes no bound; establishes no positivity; the certified
 * length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 / imp-35681 Part A);
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * FINDING (at fixed N ~ 488602; r_base ~ 1.18e-3) -- the recovery window is an ORDER wider
 * than the imp-35991 r < 1e-2 basin edge, and the two axes are ASYMMETRIC
 * -----------------------------------------------------------------------------
 *   - ALPHA axis (beta = 0): r recovers to within 10% of r_base at a detuning |delta| ~ 0.560
 *     rad (~2.74e5 linear-phase windings across the sum) and to within 1% at ~0.611 rad
 *     (~2.99e5 windings). Both edges sit JUST INSIDE the imp-35812 baseline alpha detuning
 *     from the nearest resonance (~0.618 rad): the 10% edge is ~0.91x it and the 1% edge is
 *     ~0.99x it. The baseline alpha detuning alone therefore already sits essentially AT the
 *     1%-recovery edge -- consistent with imp-35991's alpha-dominated baseline.
 *   - BETA axis (alpha = 2 pi): r recovers to within 10% of r_base at beta ~ 3.19 (drift span
 *     beta sqrt(N) ~ 2.2e3 rad) and to within 1% at beta ~ 3.32. Both edges lie BEYOND the
 *     imp-35812 baseline beta ~ 2.400 (the 10% edge is ~1.33x it): the pure sqrt drift at the
 *     baseline's OWN beta does NOT bring r within 10% of the joint baseline (at beta = 2.400,
 *     alpha = 2 pi, r ~ 1.95e-3 ~ 1.65 r_base). So recovering the baseline r on the drift axis
 *     alone requires OVERSHOOTING the baseline drift by ~1/3 -- again confirming the baseline's
 *     cancellation is carried by the alpha detuning, not the drift.
 *   - Both recovery edges are ~16x (alpha: 0.560 / 0.0356) and ~12x (beta: 3.19 / 0.269) WIDER
 *     than the imp-35991 r < 1e-2 basin edge, because recovering to r_base ~ 1.18e-3 is a far
 *     tighter target than merely dropping under 1e-2. So a run-time monitor keyed on RECOVERING
 *     the baseline ratio (not just "under 1e-2") needs a correspondingly wider detuning margin.
 * CONCLUSION: the concrete run-time safety margin -- the detuning at which the imp-35890
 * running-accumulator ratio recovers to within 10% (1%) of the imp-35812 baseline -- is
 * |delta| ~ 0.560 (0.611) rad on the alpha axis and beta ~ 3.19 (3.32) on the sqrt-drift axis
 * at fixed N ~ 488602, an order of magnitude wider than the imp-35991 r < 1e-2 basin edge and
 * markedly asymmetric between the two axes. This only sizes the run-time-monitor window that
 * imp-36004 / imp-35949 flagged; precision is not the binding constraint anywhere (even the
 * r = 1 corner leaves gamma_{N-1} ~ 5.4e-11 well under the imp-35760 barrier margin).
 *
 * @see imp-35949-w1-accumulator-frequency-grid-robustness (located the q=1 resonant corner)
 * @see imp-35991-w1-accumulator-baseline-margin-to-resonance (the r < 1e-2 basin edge this widens)
 * @see imp-36004-w1-accumulator-frequency-contingent-honest-status (the run-time-monitor caveat)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the O(1) accumulator + run-max bound)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 * @see imp-35761-w1-certified-rounding-cost-scope (classic pessimistic gamma_{N-1} bound)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2 (running error bound)
 */

// -- Anchor + operative constants (import-light; matching imp-35761 / imp-35812 / imp-35991) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp); Higham gamma uses u

// imp-35812 / imp-35890 baseline frequencies (golden-ratio fraction, golden angle).
const ALPHA_BASE = 0.6180339887498949;
const BETA_BASE = 2.3999632297286533;

const TWO_PI = 2 * Math.PI; // nearest q=1 resonance above the baseline alpha

// gamma_n = n u / (1 - n u) ~ n u (Higham worst-case recursive-sum factor).
const gamma = (n) => (n * U_ROUNDOFF) / (1 - n * U_ROUNDOFF);
const GAMMA_AT_TPT = gamma(N_AT_TPT - 1); // classic pessimistic normalized bound (r = 1 limit)

// Running-accumulator ratio r = max_i|S_i| / Sum|t_k| for t_k = cos(alpha k + beta sqrt k)/sqrt k.
function ratioAt(alpha, beta, N) {
  let s = 0;
  let sumAbs = 0;
  let maxPartial = 0;
  for (let k = 1; k <= N; k++) {
    const t = Math.cos(alpha * k + beta * Math.sqrt(k)) / Math.sqrt(k);
    s += t;
    sumAbs += Math.abs(t);
    const a = Math.abs(s);
    if (a > maxPartial) maxPartial = a;
  }
  return maxPartial / sumAbs;
}

// Baseline ratio (both frequencies): the strong-cancellation target the accumulator must recover to.
const baselineRatio = ratioAt(ALPHA_BASE, BETA_BASE, N_AT_TPT); // ~1.181e-3
const RECOVER_10 = 1.1 * baselineRatio; // within 10% of the baseline ratio
const RECOVER_1 = 1.01 * baselineRatio; // within 1% of the baseline ratio

// Smallest x in [0, xHi] at which f(x) <= target, given f(0) = 1 (exact resonance, r >= target)
// and f(xHi) < target. On both axes r decays MONOTONICALLY over the bracketing interval used
// below (alpha: [0, 1.0]; beta: [0, 4.0] -- the non-monotone revivals at larger beta stay OUT
// of the bracket), so bisection pins the first crossing. Fixed 40 iterations -> bracket * 2^-40.
function locateEdge(f, target, xHi) {
  let lo = 0; // resonance side: f(lo) >= target
  let hi = xHi; // recovered side: f(hi) < target
  for (let i = 0; i < 40; i++) {
    const mid = 0.5 * (lo + hi);
    if (f(mid) <= target) hi = mid;
    else lo = mid;
  }
  return 0.5 * (lo + hi);
}

const ALPHA_HI = 1.0; // f(ALPHA_HI) = r at delta 1 rad ~ 7.3e-4 < RECOVER_1 (valid bracket top)
const BETA_HI = 4.0; // f(BETA_HI) = r at beta 4 ~ 7.4e-4 < RECOVER_1 (below the beta>4 revivals)

const alphaFn = (delta) => ratioAt(TWO_PI + delta, 0, N_AT_TPT);
const betaFn = (beta) => ratioAt(TWO_PI, beta, N_AT_TPT);

// -- (A) ALPHA / resonance-proximity axis: fix beta = 0, detune alpha above 2 pi -----------------
const alphaEdge10 = locateEdge(alphaFn, RECOVER_10, ALPHA_HI); // ~0.560 rad
const alphaEdge1 = locateEdge(alphaFn, RECOVER_1, ALPHA_HI); // ~0.611 rad
const alphaWindings10 = alphaEdge10 * N_AT_TPT; // linear-phase windings across the sum at the edge
const alphaWindings1 = alphaEdge1 * N_AT_TPT;
const baselineAlphaDetuning = Math.min(ALPHA_BASE, TWO_PI - ALPHA_BASE); // ~0.618 rad
const alphaEdge10VsBaseline = alphaEdge10 / baselineAlphaDetuning; // ~0.91 (edge inside the baseline)
const alphaEdge1VsBaseline = alphaEdge1 / baselineAlphaDetuning; // ~0.99 (baseline ~ AT the 1% edge)

// -- (B) BETA / sqrt-drift axis: fix alpha = 2 pi (exact resonance), grow beta -------------------
const betaEdge10 = locateEdge(betaFn, RECOVER_10, BETA_HI); // ~3.19
const betaEdge1 = locateEdge(betaFn, RECOVER_1, BETA_HI); // ~3.32
const sqrtN = Math.sqrt(N_AT_TPT);
const betaDriftSpan10 = betaEdge10 * sqrtN; // total sqrt-drift phase span (rad) at the edge
const betaDriftSpan1 = betaEdge1 * sqrtN;
const betaEdge10VsBaseline = betaEdge10 / BETA_BASE; // ~1.33 (edge BEYOND the baseline beta)
const ratioAtBaselineBetaOnly = betaFn(BETA_BASE); // ~1.95e-3 ~ 1.65 r_base (drift alone under-recovers)

// Bracket-validity endpoints (recorded so the assertions can confirm the bisection was well-posed).
const alphaResonanceRatio = alphaFn(0); // r = 1 (exact resonance)
const alphaHiRatio = alphaFn(ALPHA_HI); // < RECOVER_1
const betaResonanceRatio = betaFn(0); // r = 1
const betaHiRatio = betaFn(BETA_HI); // < RECOVER_1

// imp-35991 published r < 1e-2 basin edges (context literals only; not re-measured here).
const BASIN_EDGE_ALPHA_1E2 = 0.0356; // imp-35991 alpha r<1e-2 edge (rad)
const BASIN_EDGE_BETA_1E2 = 0.269; // imp-35991 beta r<1e-2 edge

export const IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH = {
  id: 'imp-36061',
  proofSection: 'S-frontier',
  question:
    'MEASURE the phase-detuning WIDTH from the q=1 resonance (alpha = 2 pi, beta = 0) at which ' +
    'the imp-35890 running-accumulator ratio r = max_i|S_i| / Sum|t_k| recovers to within 10% ' +
    '(and 1%) of the imp-35812 strong-cancellation baseline r_base ~ 1.18e-3, for ' +
    't_k = cos(alpha k + beta sqrt(k)) / sqrt(k) at fixed N ~ 488602, giving the concrete ' +
    'run-time-monitoring safety margin imp-36004 / imp-35949 said a certified engine needs. ' +
    'Measurement only; changes no bound; NO QED.',
  fixedN: N_AT_TPT,
  baseline: {
    alpha: ALPHA_BASE,
    beta: BETA_BASE,
    ratio: baselineRatio,
    note:
      'imp-35812 / imp-35890 frequencies reproduce r_base ~ 1.18e-3 (STRONG cancellation, O(1) ' +
      'accumulator); this is the ratio the detuned accumulator must recover to',
  },
  recoveryTargets: {
    within10pct: RECOVER_10,
    within1pct: RECOVER_1,
    note:
      'recovery = the smallest perturbation from the resonance at which r first drops to <= 1.10 ' +
      'r_base (10%) and <= 1.01 r_base (1%); r starts at 1 at the resonance and decays as the phase winds',
  },
  alphaAxis: {
    fixedBeta: 0,
    edge10: alphaEdge10,
    edge1: alphaEdge1,
    windings10: alphaWindings10,
    windings1: alphaWindings1,
    baselineDetuning: baselineAlphaDetuning,
    edge10VsBaseline: alphaEdge10VsBaseline,
    edge1VsBaseline: alphaEdge1VsBaseline,
    note:
      'with no sqrt drift (cos((2 pi + delta) k) = cos(delta k), a pure linear-phase oscillation) r ' +
      'recovers to within 10% of r_base at |delta| ~ 0.560 rad (~2.74e5 windings) and within 1% at ' +
      '~0.611 rad (~2.99e5 windings). Both edges sit JUST INSIDE the baseline alpha detuning ~0.618 ' +
      'rad (~0.91x and ~0.99x): the baseline detuning already lands essentially AT the 1%-recovery edge',
  },
  betaAxis: {
    fixedAlpha: TWO_PI,
    edge10: betaEdge10,
    edge1: betaEdge1,
    driftSpan10: betaDriftSpan10,
    driftSpan1: betaDriftSpan1,
    baselineBeta: BETA_BASE,
    edge10VsBaseline: betaEdge10VsBaseline,
    ratioAtBaselineBetaOnly,
    note:
      'at exact resonant alpha r recovers to within 10% of r_base at beta ~ 3.19 (drift span ~2.2e3 ' +
      'rad) and within 1% at beta ~ 3.32. Both edges lie BEYOND the baseline beta ~ 2.400 (~1.33x): ' +
      'the pure drift at the baselines OWN beta gives only r ~ 1.95e-3 ~ 1.65 r_base, so recovering the ' +
      'baseline ratio on the drift axis alone needs OVERSHOOTING the baseline drift by ~1/3',
  },
  comparisonToBasinEdge: {
    basinEdgeAlpha1e2: BASIN_EDGE_ALPHA_1E2,
    basinEdgeBeta1e2: BASIN_EDGE_BETA_1E2,
    alphaWideningFactor: alphaEdge10 / BASIN_EDGE_ALPHA_1E2, // ~16x
    betaWideningFactor: betaEdge10 / BASIN_EDGE_BETA_1E2, // ~12x
    note:
      'the recover-to-baseline edges are ~16x (alpha) and ~12x (beta) WIDER than the imp-35991 ' +
      'r < 1e-2 basin edge, because recovering to r_base ~ 1.18e-3 is a far tighter target than ' +
      'merely dropping under 1e-2 -- a monitor keyed on the baseline needs the wider margin',
  },
  bracketValidity: {
    alphaResonanceRatio, // 1
    alphaHiRatio, // < RECOVER_1
    betaResonanceRatio, // 1
    betaHiRatio, // < RECOVER_1
    note:
      'each bisection is well-posed: f(0) = 1 (resonance, above target) and f(xHi) < RECOVER_1 ' +
      '(recovered, below target), with r monotone-decaying over the bracket so the first crossing is unique',
  },
  classicPessimisticBoundAtR1: {
    value: GAMMA_AT_TPT,
    form: 'gamma_{N-1} (the r = 1 limit of the running-accumulator bound)',
    note:
      'even at the full-breakdown corner r = 1 the classic gamma_{N-1} ~ 5.4e-11 stays ~4 orders ' +
      'under the imp-35760 O(1) barrier margin, so precision is NOT the binding constraint anywhere',
  },
  conclusion: {
    recoveryWidth:
      'the run-time safety margin -- the detuning at which the imp-35890 running-accumulator ratio ' +
      'recovers to within 10% (1%) of the imp-35812 baseline -- is |delta| ~ 0.560 (0.611) rad on the ' +
      'alpha axis and beta ~ 3.19 (3.32) on the sqrt-drift axis at fixed N ~ 488602',
    orderWiderThanBasin:
      'these recover-to-baseline edges are an order of magnitude wider (~16x alpha, ~12x beta) than ' +
      'the imp-35991 r < 1e-2 basin edge: recovering the baseline ratio is a far tighter target than ' +
      'merely dropping under 1e-2, so a monitor keyed on the baseline needs the wider margin',
    axisAsymmetry:
      'the two axes are ASYMMETRIC: the alpha-recovery edges sit just INSIDE the baseline detuning ' +
      '(the baseline alpha alone already reaches the 1% recovery), while the beta-recovery edges lie ' +
      'BEYOND the baseline beta (the drift alone under-recovers at the baselines own beta), reconfirming ' +
      'the imp-35991 finding that the baseline cancellation is carried by the alpha detuning, not the drift',
    precisionNotBinding:
      'even at the r = 1 corner the classic gamma_{N-1} stays ~4 orders under the imp-35760 barrier ' +
      'margin, so precision is NOT the binding constraint at any (alpha, beta); the obstruction stays ' +
      'the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725)',
    staysGreenfield:
      'this module measures accumulator ratios and recovery edges only; it instantiates no ' +
      'directed-rounding interval and verifies no inequality, so the W1 A + B - C certificate at T_PT ' +
      'stays GREENFIELD (imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Locating from the q=1 ' +
    'resonance the phase-detuning width at which the imp-35890 running-accumulator ratio ' +
    'r = max_i|S_i| / Sum|t_k| for t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) recovers to within 10% ' +
    '(1%) of the imp-35812 baseline r_base ~ 1.18e-3 at fixed N ~ 488602: on the ALPHA axis (beta = 0) ' +
    'r recovers to within 10% at |delta| ~ 0.560 rad (~2.74e5 windings) and within 1% at ~0.611 rad, ' +
    'both JUST INSIDE the baseline alpha detuning ~0.618 rad; on the BETA axis (alpha = 2 pi) r recovers ' +
    'to within 10% at beta ~ 3.19 (drift span ~2.2e3 rad) and within 1% at beta ~ 3.32, both BEYOND the ' +
    'baseline beta ~ 2.400 (~1.33x) -- the drift alone at the baselines own beta gives only r ~ 1.95e-3 ' +
    '~ 1.65 r_base. These recover-to-baseline edges are ~16x (alpha) / ~12x (beta) wider than the ' +
    'imp-35991 r < 1e-2 basin edge, and the axis asymmetry reconfirms the baseline cancellation is ' +
    'carried by the alpha detuning, not the sqrt drift. So the concrete run-time-monitor window imp-36004 ' +
    '/ imp-35949 flagged is an order of magnitude wider than the 1e-2 basin and markedly asymmetric. ' +
    'Even at the r = 1 corner the classic gamma_{N-1} ~ 5.4e-11 stays ~4 orders under the imp-35760 O(1) ' +
    'barrier margin, so precision is NOT the binding constraint at any (alpha, beta); the obstruction ' +
    'stays the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725). Instantiates ' +
    'no directed-rounding interval; evaluates no true H_0; verifies no inequality; changes no bound; ' +
    'establishes no positivity; the W1 A + B - C certificate at T_PT stays GREENFIELD; C_mb ' +
    'GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.',
  citation:
    'imp-35949 (located the q=1 resonant corner); imp-35991 (r < 1e-2 basin edge this widens); ' +
    'imp-36004 (run-time-monitor caveat); imp-35890 (O(1) running-accumulator a-priori bound); ' +
    'imp-35812 (baseline (alpha,beta) term family); imp-35761 (classic pessimistic gamma_{N-1} bound); ' +
    'imp-35760 (barrier-margin allocation); imp-35725 (mechanical N-term certified cost); imp-35681 ' +
    'Part A (A+B-C interval bound greenfield); imp-35674 Part D (N(x)=floor(sqrt(x/4 pi)) retained ' +
    'terms); Higham 2002 sec 4.2 (recursive-sum running error bound); Platt-Trudgian 2021 (barrier base).',
};

export const IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602 (shared with imp-35812 / imp-35890 / imp-35991).
    id: 'imp36061-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602, fixed for every scan',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // Baseline reproduces imp-35890 / imp-35991: strong-cancellation r_base ~ 1.18e-3.
    id: 'imp36061-baseline-ratio',
    description: 'Baseline (alpha,beta) reproduces r_base ~ 1.18e-3 (strong cancellation)',
    holds: () => baselineRatio > 1.0e-3 && baselineRatio < 1.4e-3,
  },
  {
    // Bisection brackets are well-posed on both axes: f(0) = 1 (resonance) and f(xHi) < RECOVER_1.
    id: 'imp36061-brackets-valid',
    description: 'Both bisections bracketed: f(0) ~ 1 (resonance) and f(xHi) < 1.01 r_base (recovered)',
    holds: () =>
      alphaResonanceRatio > 0.999 &&
      betaResonanceRatio > 0.999 &&
      alphaHiRatio < RECOVER_1 &&
      betaHiRatio < RECOVER_1,
  },
  {
    // ALPHA axis: recovery edges ~0.560 (10%) and ~0.611 (1%) rad, both O(1e5) windings.
    id: 'imp36061-alpha-recovery-edges',
    description: 'Alpha recovery edges ~0.560 rad (10%) and ~0.611 rad (1%), ~2.7-3.0e5 windings',
    holds: () =>
      alphaEdge10 > 0.4 &&
      alphaEdge10 < 0.65 &&
      alphaEdge1 > alphaEdge10 && // tighter target => larger detuning needed
      alphaEdge1 < 0.7 &&
      alphaWindings10 > 1e5 &&
      alphaWindings1 < 1e6,
  },
  {
    // ALPHA axis: both recovery edges sit just INSIDE the baseline alpha detuning (~0.618 rad).
    id: 'imp36061-alpha-edges-inside-baseline',
    description: 'Alpha recovery edges are just inside the baseline detuning (~0.91x 10%, ~0.99x 1%)',
    holds: () =>
      baselineAlphaDetuning > 0.6 &&
      alphaEdge10VsBaseline < 1 &&
      alphaEdge10VsBaseline > 0.7 &&
      alphaEdge1VsBaseline < 1.02 &&
      alphaEdge1VsBaseline > 0.9,
  },
  {
    // BETA axis: recovery edges ~3.19 (10%) and ~3.32 (1%), drift span O(1e3) rad.
    id: 'imp36061-beta-recovery-edges',
    description: 'Beta recovery edges ~3.19 (10%) and ~3.32 (1%), drift span ~2.2-2.4e3 rad',
    holds: () =>
      betaEdge10 > 2.5 &&
      betaEdge10 < 4.0 &&
      betaEdge1 > betaEdge10 && // tighter target => larger drift needed
      betaEdge1 < 4.0 &&
      betaDriftSpan10 > 1e3 &&
      betaDriftSpan1 < 1e4,
  },
  {
    // BETA axis asymmetry: recovery edge lies BEYOND the baseline beta; drift-only under-recovers.
    id: 'imp36061-beta-edge-beyond-baseline',
    description: 'Beta 10% edge exceeds baseline beta (~1.33x); drift alone at baseline beta under-recovers',
    holds: () =>
      betaEdge10VsBaseline > 1.1 &&
      betaEdge10VsBaseline < 2 &&
      ratioAtBaselineBetaOnly > RECOVER_10 && // beta=2.4 at resonant alpha still above the 10% target
      ratioAtBaselineBetaOnly > 1.4 * baselineRatio,
  },
  {
    // Recover-to-baseline edges are an order wider than the imp-35991 r < 1e-2 basin edge.
    id: 'imp36061-order-wider-than-basin',
    description: 'Recover-to-baseline edges ~16x (alpha) / ~12x (beta) wider than the imp-35991 1e-2 basin edge',
    holds: () =>
      alphaEdge10 / BASIN_EDGE_ALPHA_1E2 > 8 &&
      betaEdge10 / BASIN_EDGE_BETA_1E2 > 5,
  },
  {
    // Precision still not binding: classic gamma_{N-1} ~ 5.4e-11 stays well under the margin.
    id: 'imp36061-precision-not-binding',
    description: 'Even at the r = 1 corner the classic gamma_{N-1} ~ 5.4e-11 stays orders under the margin',
    holds: () => GAMMA_AT_TPT > 1e-12 && GAMMA_AT_TPT < 1e-9,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp36061-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.verdict) &&
      /refereed bound is changed/i.test(IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH.verdict),
  },
];

for (const a of IMP36061_W1_ACCUMULATOR_RECOVERY_DETUNING_WIDTH_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-36061-w1-accumulator-recovery-detuning-width assertion failed: ${a.id}`);
  }
}
