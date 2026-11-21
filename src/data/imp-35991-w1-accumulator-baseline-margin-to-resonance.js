/**
 * @module imp-35991-w1-accumulator-baseline-margin-to-resonance
 *
 * imp-35991 (numerical, S-frontier): MEASURE the margin in (alpha, beta) frequency space
 * from the imp-35812 baseline (0.618.., 2.400..) to the nearest q=1 resonant breakdown
 * corner (alpha -> multiple of 2 pi, beta -> 0) at which the imp-35890 O(1) running-accumulator
 * ratio r = max_i|S_i| / Sum|t_k| departs from its ~1.2e-3 strong-cancellation value toward 1.
 *
 * imp-35949 IDENTIFIED the breakdown corner -- at the q=1 resonance (alpha = 2 pi, beta = 0)
 * cos(alpha k) = 1 for every integer k, so the partial sums build coherently and r -> 1 (the
 * imp-35890 run-max bound gamma_{N-1} * r collapses onto the classic pessimistic Higham
 * gamma_{N-1}); a moderate sqrt-drift beta at the SAME alpha restores cancellation. But
 * imp-35949 never measured HOW FAR the imp-35812 baseline sits from that corner. This module
 * answers that at fixed N ~ 488602 by locating the r < 1e-2 basin edge along BOTH axes:
 *   (A) the ALPHA / resonance-proximity axis -- fix beta = 0 and detune alpha away from the
 *       nearest resonance (2 pi); find the smallest detuning |delta| = |alpha - 2 pi| at which
 *       r first drops below the O(1) threshold r_TH = 1e-2.
 *   (B) the BETA / sqrt-drift axis -- fix alpha = 2 pi (exact resonance) and grow beta; find
 *       the smallest beta at which r first drops below r_TH.
 * Each edge is then compared to the imp-35812 baseline's own detuning / drift to report the
 * baseline's margin (as a multiple of the edge width) to the corner.
 *
 * MEASUREMENT ONLY. Instantiates no directed-rounding interval; evaluates no true H_0;
 * verifies no inequality; changes no bound; establishes no positivity; the certified
 * length-N interval sum stays MECHANICAL / GREENFIELD (imp-35725 / imp-35681 Part A);
 * C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * FINDING (at fixed N ~ 488602; r_TH = 1e-2) -- MEASURED, corrects a naive 1/N intuition
 * -----------------------------------------------------------------------------
 * The 1/sqrt(k) weighting concentrates the sum-magnitude at LOW k, where the phase (linear or
 * sqrt-drift) has barely wound, so cancellation sets in only SLOWLY as the detuning/drift grows:
 * r decays as a slow power law of the perturbation, NOT with a razor-thin 1/N resonance width.
 *   - ALPHA axis (beta = 0): the r < 1e-2 edge sits at a detuning |delta| ~ 0.0356 rad, i.e. a
 *     LARGE total winding delta * N ~ 1.7e4 of the linear phase across the sum. The baseline's
 *     detuning from the nearest resonance, min(|alpha_base|, |2 pi - alpha_base|) ~ 0.618 rad
 *     (~3.0e5 windings), is ~17x past that edge -- roughly ONE decade of margin, not many.
 *   - BETA axis (alpha = 2 pi): the r < 1e-2 edge sits at beta ~ 0.269, a total sqrt-drift span
 *     beta sqrt(N) ~ 188 rad. The baseline beta ~ 2.400 (drift span ~1.7e3 rad) is ~9x past that
 *     edge -- again about one decade of margin.
 *   - the baseline's r ~ 1.2e-3 is carried almost ENTIRELY by the alpha detuning: at beta = 0
 *     the baseline alpha alone already gives r ~ 1.18e-3 (essentially the full baseline value),
 *     whereas the golden-angle drift at exact resonant alpha gives only r ~ 1.95e-3. The generic
 *     off-resonance placement of alpha, not the sqrt drift, is what buys the baseline its O(1)
 *     accumulator here.
 * CONCLUSION: the imp-35812 baseline sits roughly ONE DECADE of margin (not orders of magnitude)
 * from the q=1 resonant breakdown corner along each frequency axis, and its strong-cancellation
 * r ~ 1.2e-3 is dominated by the alpha detuning. The resonance basin is BROAD (a slow power law),
 * so moderate frequency perturbations stay safely inside it -- but the corner is reachable within
 * one decade, confirming the imp-35949 verdict that the O(1) accumulator must be MONITORED at run
 * time, not assumed a priori. Precision is not the binding constraint anywhere on the map (even
 * the r = 1 corner leaves gamma_{N-1} ~ 5.4e-11 well under the imp-35760 barrier margin).
 *
 * @see imp-35949-w1-accumulator-frequency-grid-robustness (located the corner; this measures the margin to it)
 * @see imp-35890-w1-running-accumulator-apriori-bound (the O(1) accumulator + run-max bound)
 * @see imp-35812-w1-summation-scheme-measured-cost (baseline (alpha,beta) term family)
 * @see imp-35761-w1-certified-rounding-cost-scope (classic pessimistic gamma_{N-1} bound)
 * @see imp-35760-w1-margin-allocation-scope (the O(1) barrier margin all bounds sit under)
 * @see Higham 2002, Accuracy and Stability of Numerical Algorithms, sec 4.2 (running error bound)
 */

// -- Anchor + operative constants (import-light; matching imp-35761 / imp-35812 / imp-35949) --
const T_PT = 3e12; // Platt-Trudgian 2021 verified height (external barrier base)
const L_PT = 0.2; // Platt-Trudgian 2021 bound; unchanged by this measurement
const N_TERMS = (x) => Math.floor(Math.sqrt(x / (4 * Math.PI))); // Polymath15 retained-term count
const N_AT_TPT = N_TERMS(T_PT); // ~488602 terms per mollified sum at T_PT (imp-35674 Part D)

const U_ROUNDOFF = 2 ** -53; // unit roundoff u (half ulp); Higham gamma uses u

// imp-35812 / imp-35890 baseline frequencies (golden-ratio fraction, golden angle).
const ALPHA_BASE = 0.6180339887498949;
const BETA_BASE = 2.3999632297286533;

const TWO_PI = 2 * Math.PI; // nearest q=1 resonance above the baseline alpha
const R_THRESHOLD = 1e-2; // O(1) accumulator threshold: r < r_TH = "still strong cancellation"

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

// Locate the smallest x in [0, xHi] at which f(x) < r_TH, given f(0) = 1 (exact resonance,
// r >= r_TH) and f(xHi) < r_TH (de-phased). r decays MONOTONICALLY as the phase winds (the
// 1/sqrt(k) weighting makes it a slow but monotone power-law decay away from the corner), so
// bisection pins the basin edge. Fixed 44 iterations -> residual bracket xHi * 2^-44.
function locateEdge(f, xHi) {
  let lo = 0; // resonance side: f(lo) >= r_TH
  let hi = xHi; // de-phased side: f(hi) < r_TH
  for (let i = 0; i < 44; i++) {
    const mid = 0.5 * (lo + hi);
    if (f(mid) < R_THRESHOLD) hi = mid;
    else lo = mid;
  }
  return 0.5 * (lo + hi);
}

// Baseline detuning from the NEAREST resonance (0 or 2 pi) sets the alpha-axis bracket top: the
// baseline alpha itself lies below r_TH at beta = 0, so [0, baselineAlphaDetuning] brackets the edge.
const baselineAlphaDetuning = Math.min(ALPHA_BASE, TWO_PI - ALPHA_BASE);

// -- (A) ALPHA / resonance-proximity axis: fix beta = 0, detune alpha above 2 pi ---------------
const alphaEdgeDelta = locateEdge((delta) => ratioAt(TWO_PI + delta, 0, N_AT_TPT), baselineAlphaDetuning);
const alphaEdgeWindings = alphaEdgeDelta * N_AT_TPT; // linear-phase windings across the sum at the edge
const baselineAlphaWindings = baselineAlphaDetuning * N_AT_TPT;
const alphaMarginFactor = baselineAlphaDetuning / alphaEdgeDelta; // baseline margin in edge-widths

// -- (B) BETA / sqrt-drift axis: fix alpha = 2 pi (exact resonance), grow beta ------------------
const betaEdge = locateEdge((beta) => ratioAt(TWO_PI, beta, N_AT_TPT), BETA_BASE);
const betaEdgeDriftSpan = betaEdge * Math.sqrt(N_AT_TPT); // total sqrt-drift phase span (rad) at the edge
const baselineDriftSpan = BETA_BASE * Math.sqrt(N_AT_TPT); // baseline drift span (rad)
const betaMarginFactor = BETA_BASE / betaEdge; // baseline margin in edge-widths

// -- Baseline ratio, per-axis decomposition, and the resonant-corner ratio ---------------------
const baselineRatio = ratioAt(ALPHA_BASE, BETA_BASE, N_AT_TPT); // ~1.18e-3 (strong cancellation)
const baselineRatioAlphaOnly = ratioAt(ALPHA_BASE, 0, N_AT_TPT); // ~1.18e-3: detuning alone carries it
const baselineRatioBetaOnly = ratioAt(TWO_PI, BETA_BASE, N_AT_TPT); // ~1.95e-3: drift alone at resonant alpha
const cornerRatio = ratioAt(TWO_PI, 0, N_AT_TPT); // ~1 (full breakdown)

export const IMP35991_W1_ACCUMULATOR_BASELINE_MARGIN_TO_RESONANCE = {
  id: 'imp-35991',
  proofSection: 'S-frontier',
  question:
    'MEASURE the margin in (alpha, beta) frequency space from the imp-35812 baseline (0.618.., 2.400..) ' +
    'to the nearest q=1 resonant breakdown corner (alpha -> 2 pi, beta -> 0) at which the imp-35890 ' +
    'running-accumulator ratio r = max_i|S_i| / Sum|t_k| departs from its ~1.2e-3 strong-cancellation ' +
    'value toward 1, at fixed N ~ 488602. Measurement only; changes no bound; NO QED.',
  fixedN: N_AT_TPT,
  threshold: {
    r_TH: R_THRESHOLD,
    note: 'r < r_TH = 1e-2 defines "still O(1) / strong cancellation"; the basin edge is where r crosses it',
  },
  baselinePoint: {
    alpha: ALPHA_BASE,
    beta: BETA_BASE,
    ratio: baselineRatio,
    ratioAlphaOnly: baselineRatioAlphaOnly,
    ratioBetaOnly: baselineRatioBetaOnly,
    note:
      'imp-35812 baseline reproduces r ~ 1.18e-3 (STRONG cancellation, O(1) accumulator), carried almost ' +
      'entirely by the alpha detuning: beta = 0 at the baseline alpha already gives r ~ 1.18e-3, while the ' +
      'golden-angle drift alone at resonant alpha gives only ~1.95e-3',
  },
  resonantCorner: {
    alpha: TWO_PI,
    beta: 0,
    ratio: cornerRatio,
    note: 'q=1 resonance alpha = 2 pi with beta = 0: cos(2 pi k) = 1 all k, r -> 1 (full breakdown)',
  },
  alphaAxis: {
    fixedBeta: 0,
    edgeDetuning: alphaEdgeDelta,
    edgeWindings: alphaEdgeWindings,
    baselineDetuning: baselineAlphaDetuning,
    baselineWindings: baselineAlphaWindings,
    marginFactor: alphaMarginFactor,
    note:
      'with no sqrt drift the r < 1e-2 edge sits at a detuning ~0.0356 rad (~1.7e4 linear-phase windings ' +
      'across the sum) -- BROAD, a slow power law, not a razor-thin 1/N resonance (the 1/sqrt(k) weight ' +
      'concentrates magnitude at low k where the phase has barely wound). The baseline detuning from the ' +
      'nearest resonance (~0.618 rad, ~3.0e5 windings) is ~17x past that edge: about one decade of margin',
  },
  betaAxis: {
    fixedAlpha: TWO_PI,
    edgeBeta: betaEdge,
    edgeDriftSpan: betaEdgeDriftSpan,
    baselineBeta: BETA_BASE,
    baselineDriftSpan: baselineDriftSpan,
    marginFactor: betaMarginFactor,
    note:
      'at exact resonant alpha the r < 1e-2 edge sits at beta ~0.269 (drift span beta sqrt(N) ~188 rad). ' +
      'The baseline beta ~2.400 (drift span ~1.7e3 rad) is ~9x past the edge: again about one decade of margin',
  },
  classicPessimisticBoundAtR1: {
    value: GAMMA_AT_TPT,
    form: 'gamma_{N-1} (the r = 1 limit of the running-accumulator bound)',
    note:
      'even at the full-breakdown corner r = 1 the classic gamma_{N-1} ~ 5.4e-11 stays ~4 orders under ' +
      'the imp-35760 O(1) barrier margin, so precision is NOT the binding constraint anywhere on the map',
  },
  conclusion: {
    oneDecadeMargin:
      'the imp-35812 baseline sits roughly ONE DECADE of margin from the q=1 resonant breakdown corner ' +
      'along each frequency axis (~17x past the alpha resonance edge, ~9x past the beta drift edge), not ' +
      'the many orders of magnitude a razor-thin 1/N resonance would give; the basin is a BROAD slow power ' +
      'law because the 1/sqrt(k) weighting concentrates sum-magnitude at low k',
    alphaDominated:
      'the baseline r ~ 1.18e-3 is carried almost ENTIRELY by the alpha detuning (beta = 0 at the baseline ' +
      'alpha already gives r ~ 1.18e-3), not the sqrt drift (drift alone at resonant alpha gives ~1.95e-3): ' +
      'the generic off-resonance placement of alpha is what buys the baseline its O(1) accumulator here',
    basinReachable:
      'the corner is reachable within one decade of frequency perturbation, confirming the imp-35949 verdict ' +
      'that the O(1) accumulator must be MONITORED at run time, not assumed a priori as a family-level constant',
    precisionNotBinding:
      'even at the r = 1 corner the classic gamma_{N-1} stays ~4 orders under the imp-35760 barrier ' +
      'margin, so precision is NOT the binding constraint at any (alpha, beta); the obstruction stays ' +
      'the ENGINEERING of the certified length-N interval sum (MECHANICAL, imp-35725)',
    staysGreenfield:
      'this module measures accumulator ratios and basin edges only; it instantiates no directed-rounding ' +
      'interval and verifies no inequality, so the W1 A + B - C certificate at T_PT stays GREENFIELD ' +
      '(imp-35681 Part A) and MECHANICAL (imp-35725)',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL MEASUREMENT (frontier-direction, NOT a certified bound). Locating the r < 1e-2 basin edge ' +
    'for t_k = cos(alpha k + beta sqrt(k)) / sqrt(k) at fixed N ~ 488602 along both axes from the q=1 ' +
    'resonant corner: the resonance basin is BROAD (a slow power law, not a razor-thin 1/N width, because ' +
    'the 1/sqrt(k) weight concentrates magnitude at low k) -- the r < 1e-2 edge sits at an alpha detuning ' +
    '~0.0356 rad (~1.7e4 linear-phase windings) and, at exact resonant alpha, at beta ~0.269 (drift span ' +
    '~188 rad). The imp-35812 baseline (0.618.., 2.400..) sits roughly ONE DECADE of margin from that corner ' +
    'along each axis (~17x past the alpha edge, ~9x past the beta edge), and its strong-cancellation ' +
    'r ~ 1.18e-3 is carried almost entirely by the alpha detuning (beta = 0 at the baseline alpha already ' +
    'gives ~1.18e-3; drift alone at resonant alpha gives ~1.95e-3). The corner is reachable within one decade ' +
    'of frequency perturbation, confirming the imp-35949 verdict that the O(1) accumulator must be MONITORED ' +
    'at run time, not assumed a priori. Even at the r = 1 corner the classic gamma_{N-1} ~ 5.4e-11 stays ' +
    '~4 orders under the imp-35760 O(1) barrier margin, so precision is NOT the binding constraint at any ' +
    '(alpha, beta); the obstruction stays the ENGINEERING of the certified length-N interval sum ' +
    '(MECHANICAL, imp-35725). Instantiates no directed-rounding interval; evaluates no true H_0; verifies ' +
    'no inequality; changes no bound; establishes no positivity; the W1 A + B - C certificate at T_PT stays ' +
    'GREENFIELD; C_mb GUE-conditional (imp-486) untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-35949 (located the q=1 resonant corner this measures the margin to); imp-35890 (O(1) ' +
    'running-accumulator a-priori bound); imp-35812 (baseline (alpha,beta) term family); imp-35761 ' +
    '(classic pessimistic gamma_{N-1} bound); imp-35760 (barrier-margin allocation); imp-35725 (mechanical ' +
    'N-term certified cost); imp-35681 Part A (A+B-C interval bound greenfield); imp-35674 Part D ' +
    '(N(x)=floor(sqrt(x/4 pi)) retained terms); Higham 2002 sec 4.2 (recursive-sum running error bound); ' +
    'Platt-Trudgian 2021 (barrier base).',
};

export const IMP35991_W1_ACCUMULATOR_BASELINE_MARGIN_TO_RESONANCE_ASSERTIONS = [
  {
    // N anchored at floor(sqrt(T_PT/4 pi)) ~ 488602 (shared with imp-35812 / imp-35890 / imp-35949).
    id: 'imp35991-n-anchor',
    description: 'N = floor(sqrt(T_PT/4 pi)) ~ 488602, fixed for every scan',
    holds: () =>
      N_AT_TPT === Math.floor(Math.sqrt(3e12 / (4 * Math.PI))) &&
      N_AT_TPT > 4.8e5 &&
      N_AT_TPT < 4.9e5,
  },
  {
    // Endpoints bracket the measurement: baseline strongly cancels (r << r_TH), corner fully breaks down.
    id: 'imp35991-endpoints-bracket',
    description: 'Baseline r < 1e-2 (strong cancellation) and resonant corner r ~ 1 (full breakdown)',
    holds: () => baselineRatio < R_THRESHOLD && baselineRatio < 0.01 && cornerRatio > 0.99,
  },
  {
    // ALPHA axis: the resonance basin is BROAD (slow power law), edge at detuning ~0.0356 rad.
    id: 'imp35991-alpha-edge-broad',
    description: 'Alpha resonance basin edge is broad: detuning ~0.0356 rad, ~1.7e4 linear-phase windings',
    holds: () =>
      alphaEdgeDelta > 0.02 &&
      alphaEdgeDelta < 0.06 &&
      alphaEdgeWindings > 5e3 &&
      alphaEdgeWindings < 5e4,
  },
  {
    // ALPHA axis: the baseline sits ~1 decade past the resonance edge (a modest margin, not many orders).
    id: 'imp35991-alpha-margin-one-decade',
    description: 'Baseline alpha detuning (~0.618 rad) is ~17x past the resonance edge (about one decade)',
    holds: () =>
      baselineAlphaDetuning > 0.6 &&
      baselineAlphaWindings > 1e5 &&
      alphaMarginFactor > 5 &&
      alphaMarginFactor < 100,
  },
  {
    // BETA axis: drift basin edge at beta ~0.269 (drift span ~188 rad).
    id: 'imp35991-beta-edge-order-hundred-rad',
    description: 'Beta drift basin edge at beta ~0.269 (drift span beta*sqrt(N) ~188 rad)',
    holds: () =>
      betaEdge > 0.1 &&
      betaEdge < 0.5 &&
      betaEdgeDriftSpan > 100 &&
      betaEdgeDriftSpan < 300,
  },
  {
    // BETA axis: the baseline drift span (~1.7e3 rad) is ~9x past the edge (about one decade).
    id: 'imp35991-beta-margin-one-decade',
    description: 'Baseline drift span (~1.7e3 rad) is ~9x past the drift basin edge (about one decade)',
    holds: () =>
      baselineDriftSpan > 1e3 &&
      betaMarginFactor > 3 &&
      betaMarginFactor < 50,
  },
  {
    // The baseline cancellation is alpha-detuning-dominated, not drift-dominated.
    id: 'imp35991-baseline-alpha-dominated',
    description: 'Baseline r is carried by alpha detuning: alpha-only r ~ full r, both well under drift-only r',
    holds: () =>
      Math.abs(baselineRatioAlphaOnly - baselineRatio) / baselineRatio < 0.1 &&
      baselineRatioAlphaOnly < baselineRatioBetaOnly,
  },
  {
    // Precision still not binding even at the corner: classic gamma stays well under the margin.
    id: 'imp35991-precision-not-binding',
    description: 'Even at the r = 1 corner the classic gamma_{N-1} ~ 5.4e-11 stays orders under the margin',
    holds: () => GAMMA_AT_TPT > 1e-12 && GAMMA_AT_TPT < 1e-9,
  },
  {
    // Honesty gate: measurement only; obstruction MECHANICAL/greenfield; no QED; no refereed bound is changed.
    id: 'imp35991-honesty-gate',
    description: 'Measurement only; obstruction stays engineering/greenfield; no QED; no refereed bound is changed',
    holds: () =>
      IMP35991_W1_ACCUMULATOR_BASELINE_MARGIN_TO_RESONANCE.isRigorous === false &&
      Math.abs(L_PT - 0.2) < 1e-15 &&
      /GREENFIELD/.test(IMP35991_W1_ACCUMULATOR_BASELINE_MARGIN_TO_RESONANCE.conclusion.staysGreenfield) &&
      /NO QED/.test(IMP35991_W1_ACCUMULATOR_BASELINE_MARGIN_TO_RESONANCE.verdict) &&
      /refereed bound is changed/i.test(IMP35991_W1_ACCUMULATOR_BASELINE_MARGIN_TO_RESONANCE.verdict),
  },
];

for (const a of IMP35991_W1_ACCUMULATOR_BASELINE_MARGIN_TO_RESONANCE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-35991-w1-accumulator-baseline-margin-to-resonance assertion failed: ${a.id}`);
  }
}
