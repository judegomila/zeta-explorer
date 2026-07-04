/**
 * @module imp-33291-sigma-fartail-two-parameter-lnN-lnlogT0-fit
 *
 * imp-33291 (numerical, frontier-direction): imp-33274 slid a FIXED-span window past the
 * imp-3444 crossover and showed the SINGLE-regressor OLS exponent p_eff = -slope of
 * ln sigma on ln N converges monotonely to the imp-3463 far-tail 1/2, attributing the
 * residual imp-3529 drift to the crossover ramp. But the far-tail leading form
 *     sigma ~ (C_C / E_trunc) sqrt(log T0 / N)
 * carries TWO powers, not one: a -1/2 power of N AND a +1/2 power of log T0. A single
 * ln N slope cannot separate them -- it folds the slow sqrt(log T0) half-power into the
 * ln N slope and the residual drift. This module runs the TWO-regressor fit
 *     ln sigma = a + b1 * ln N + b2 * ln(log T0)
 * across the SAME imp-33274 sliding windows and reports whether the recovered
 * (b1, b2) match the analytic (-1/2, +1/2) pair, isolating the sqrt(log T0)
 * coefficient the single-slope fit could not see.
 *
 * THE QUANTITY (identical sub-terms to imp-3529 / imp-33255 / imp-33274)
 * ---------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     T0     = effectiveHeightForN(N)              (Riemann-von Mangoldt inverse)
 *     E_coll = C_C_PINNED * sqrt(log T0 / N)       (dominant, GUE-conditional C_H)
 *     E_flow = C_F (log T0 / T0) * Gronwall,  C_F = (log(T0/2pi)+1)/2pi  (imp-398)
 *     E_trunc = 3.06e-5                            (N-independent, imp-2631)
 * For N > N_cross the constant floor E_trunc OUTLIVES the vanishing E_coll, so
 *     sigma ~ (C_C/E_trunc) sqrt(log T0 / N)  =  const * N^(-1/2) * (log T0)^(+1/2),
 * i.e. ln sigma = const - (1/2) ln N + (1/2) ln(log T0) + o(1).
 *
 * THE MEASUREMENT: two-regressor fit on the imp-33274 sliding windows
 * ------------------------------------------------------------------
 * Same fixed 12-decade span, same 4 points/decade, same START offsets s = 0, 3, 6,
 * 12, 24, 48 decades past N_cross. Regress ln sigma JOINTLY on ln N and ln(log T0)
 * by the closed-form two-predictor normal equations. Report the ln N coefficient b1
 * (should -> -1/2), the ln(log T0) coefficient b2 (should -> +1/2), the ln N / ln(log T0)
 * predictor collinearity, and R^2.
 *
 * THE FINDING (measurement / fit only)
 * ------------------------------------
 *   (F1) THE ANALYTIC PAIR IS RECOVERED. Sliding the window START later, the two-regressor
 *        coefficients converge onto (-1/2, +1/2): b1 goes ~-0.6026 -> -0.5059 -> -0.5002 ->
 *        -0.5000 and b2 goes ~+4.42 -> +0.763 -> +0.513 -> +0.5000 as s = 0,3,6,12. By
 *        s = 24-48 decades past the crossover both sit on (-1/2, +1/2) to the arithmetic
 *        floor (|b1+1/2| ~ 2e-13, |b2-1/2| ~ 3e-11). The far-tail law is confirmed as the
 *        joint (-1/2, +1/2) power pair, NOT a single effective exponent.
 *   (F2) THE HALF-POWER THE SINGLE FIT FOLDED IS THE +1/2 log T0 COEFFICIENT. b2 converging
 *        to +1/2 is exactly the sqrt(log T0) factor imp-33274 absorbed into its ln N slope
 *        and residual drift: with only ln N as a regressor the +1/2 * ln(log T0) growth term
 *        biases the slope. The two-regressor fit measures it directly and it lands on +1/2.
 *   (F3) HIGH ln N / ln(log T0) COLLINEARITY EXPLAINS WHY THE SINGLE FIT COULD HIDE IT.
 *        Over every window the two predictors are ~0.994-0.9997 correlated (log T0 is a slow
 *        monotone function of N), so the single-slope fit can trade the +1/2 log T0 power for
 *        a shift in the ln N slope with little R^2 penalty -- which is precisely how the
 *        half-power hid inside imp-33274 s residual drift. At the crossover-anchored window
 *        the collinearity plus the ramp send b1, b2 wild (-0.60, +4.42); sliding past the
 *        ramp resolves them onto (-1/2, +1/2).
 *
 * The punchline: the imp-3463 far-tail sigma ~ sqrt(log T0 / N) is a TWO-power law, and the
 * two-regressor fit recovers BOTH powers -- ln N coefficient -1/2 and ln(log T0) coefficient
 * +1/2 -- to the arithmetic floor once the window slides past the crossover ramp. The
 * sqrt(log T0) half-power that imp-33274 s single ln N slope folded into residual drift is
 * measured here as the +1/2 ln(log T0) coefficient, further localising the imp-3529 drift.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share diagnostic, NOT an RH bound. The C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; changes no bound; no positivity, no bridge
 * closure, no RH claim, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.
 *
 * @see imp-33274-sigma-postpeak-later-window-decay-exponent (single-regressor p_eff -> 1/2, the fit extended here)
 * @see imp-33255-sigma-postpeak-regime-effective-exponent (crossover-anchored single exponent, window-dependent)
 * @see imp-3529-sigma-postpeak-decay-exponent (LOCAL pointwise exponent p(N), residual drift)
 * @see imp-3463-sigma-fartail-decay (far-tail leading form sqrt(log T0 / N))
 * @see imp-3444-sigma-nshape-landmark-ladder (E_coll = E_trunc crossover N ~ 3.280e9)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); C_H = 1/8 ansatz)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3529/imp-33255/imp-33274)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3529/imp-33255/imp-33274 exactly

// EXACT imp-3529/imp-33255/imp-33274 sub-terms (no re-derivation, no fresh model).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, super-poly negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

// The E_coll = E_trunc crossover (reproduces imp-3444 / imp-33255 / imp-33274 N ~ 3.280e9).
function ecollEqualsEtrunc() {
  let a = Math.log(1e6);
  let b = Math.log(1e12);
  for (let i = 0; i < 300; i++) {
    const m = (a + b) / 2;
    if (parts(Math.exp(m)).E_coll > E_TRUNC_PT) a = m;
    else b = m;
  }
  return Math.exp((a + b) / 2);
}
const N_CROSS = ecollEqualsEtrunc(); // ~3.280294e9

// Closed-form two-predictor OLS: ln sigma = a + b1 * ln N + b2 * ln(log T0) over [loN, hiN],
// sampled uniformly in log10 N (4 pts/decade). Returns the ln N coefficient b1 (-> -1/2), the
// ln(log T0) coefficient b2 (-> +1/2), R^2, max |log residual|, and the predictor collinearity.
function ols2(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const x1 = []; // ln N
  const x2 = []; // ln(log T0)
  const ys = []; // ln sigma
  const dLo = Math.log10(loN);
  const dHi = Math.log10(hiN);
  for (let d = dLo; d <= dHi + 1e-9; d += step) {
    const N = Math.pow(10, d);
    const p = parts(N);
    x1.push(Math.log(N));
    x2.push(Math.log(p.L));
    ys.push(Math.log(p.sigma));
  }
  const n = x1.length;
  const m1 = x1.reduce((a, b) => a + b, 0) / n;
  const m2 = x2.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let c11 = 0;
  let c22 = 0;
  let c12 = 0;
  let c1y = 0;
  let c2y = 0;
  let cyy = 0;
  for (let i = 0; i < n; i++) {
    const d1 = x1[i] - m1;
    const d2 = x2[i] - m2;
    const dy = ys[i] - my;
    c11 += d1 * d1;
    c22 += d2 * d2;
    c12 += d1 * d2;
    c1y += d1 * dy;
    c2y += d2 * dy;
    cyy += dy * dy;
  }
  const det = c11 * c22 - c12 * c12;
  const b1 = (c22 * c1y - c12 * c2y) / det;
  const b2 = (c11 * c2y - c12 * c1y) / det;
  const a = my - b1 * m1 - b2 * m2;
  let ssRes = 0;
  let maxResLn = 0;
  for (let i = 0; i < n; i++) {
    const pred = a + b1 * x1[i] + b2 * x2[i];
    ssRes += (ys[i] - pred) ** 2;
    maxResLn = Math.max(maxResLn, Math.abs(ys[i] - pred));
  }
  const R2 = 1 - ssRes / cyy;
  const collinearity = c12 / Math.sqrt(c11 * c22); // corr(ln N, ln(log T0)) in the window
  return { b1, b2, R2, maxResLn, collinearity, nPoints: n };
}

// Same imp-33274 sliding-START ladder: FIXED 12-decade span, START slid past the crossover.
const SPAN_DECADES = 12;
const START_OFFSETS = [0, 3, 6, 12, 24, 48]; // decades past N_cross (identical to imp-33274)
const B1_ANALYTIC = -0.5; // ln N coefficient: sqrt(1/N) power
const B2_ANALYTIC = 0.5; //  ln(log T0) coefficient: sqrt(log T0) half-power
const TWO_PARAM_LADDER = START_OFFSETS.map((s) => {
  const lo = N_CROSS * Math.pow(10, s);
  const hi = N_CROSS * Math.pow(10, s + SPAN_DECADES);
  const f = ols2(lo, hi);
  return {
    startOffsetDecades: s,
    spanDecades: SPAN_DECADES,
    b1_lnN: +f.b1.toFixed(6),
    b2_lnLogT0: +f.b2.toFixed(6),
    gapB1: +Math.abs(f.b1 - B1_ANALYTIC).toExponential(3),
    gapB2: +Math.abs(f.b2 - B2_ANALYTIC).toExponential(3),
    R2: +f.R2.toFixed(9),
    maxResidualLn: +f.maxResLn.toExponential(3),
    collinearity: +f.collinearity.toFixed(6),
    nPoints: f.nPoints,
  };
});

export const IMP33291_SIGMA_FARTAIL_TWO_PARAMETER_LNN_LNLOGT0_FIT = {
  id: 'imp-33291',
  proofSection: 'S-frontier',
  question:
    'Extend the imp-33274 SINGLE-regressor (ln N) fit of the sigma(N) = E_coll/E(N) far-tail ' +
    'regime to a TWO-regressor fit ln sigma = a + b1 ln N + b2 ln(log T0) across the same ' +
    'sliding windows, and report whether the recovered (b1, b2) match the analytic (-1/2, +1/2) ' +
    'power pair -- isolating the sqrt(log T0) half-power the single-slope fit folds into ' +
    'residual drift. Measurement/fit only; conditional-share diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'Two-predictor OLS (b1, b2) of ln sigma on (ln N, ln(log T0)) over [N_cross*10^s, ' +
    'N_cross*10^(s+12)] (fixed 12-decade span, 4 points/decade) as the start offset s slides ' +
    '0, 3, 6, 12, 24, 48 decades past the crossover; analytic target (b1, b2) = (-1/2, +1/2)',
  crossover: {
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9 (imp-3444 / imp-33255 / imp-33274)
  },
  analyticPair: { b1_lnN: B1_ANALYTIC, b2_lnLogT0: B2_ANALYTIC },
  spanDecades: SPAN_DECADES,
  twoParamLadder: TWO_PARAM_LADDER,
  finding: {
    F1_analytic_pair_recovered:
      'Sliding the fixed-12-decade window START later (s = 0,3,6,12,24,48 decades past the ' +
      'crossover), the two-regressor coefficients converge onto (-1/2, +1/2): b1 ~-0.6026 -> ' +
      '-0.5059 -> -0.5002 -> -0.5000 and b2 ~+4.42 -> +0.763 -> +0.513 -> +0.5000 as s = 0,3,6,12. ' +
      'By s = 24-48 both sit on (-1/2, +1/2) to the arithmetic floor (|b1+1/2| ~ 2e-13, ' +
      '|b2-1/2| ~ 3e-11). The far-tail law is a joint (-1/2, +1/2) power pair, not one exponent.',
    F2_half_power_is_the_logT0_coefficient:
      'b2 converging to +1/2 is exactly the sqrt(log T0) factor imp-33274 absorbed into its ' +
      'single ln N slope and residual drift: with only ln N as a regressor the +1/2 * ln(log T0) ' +
      'growth term biases the slope. The two-regressor fit measures it directly and it lands on +1/2.',
    F3_collinearity_explains_the_single_fit:
      'Over every window ln N and ln(log T0) are ~0.994-0.9997 correlated (log T0 is a slow ' +
      'monotone function of N), so the single-slope fit can trade the +1/2 log T0 power for a shift ' +
      'in the ln N slope with little R^2 penalty -- precisely how the half-power hid inside ' +
      'imp-33274 s residual drift. At the crossover-anchored window the collinearity plus the ramp ' +
      'send (b1, b2) wild (-0.60, +4.42); sliding past the ramp resolves them onto (-1/2, +1/2).',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Running the two-regressor fit ' +
    'ln sigma = a + b1 ln N + b2 ln(log T0) across the imp-33274 sliding windows (fixed ' +
    '12-decade span, START slid 0,3,6,12,24,48 decades past the imp-3444 crossover), the ' +
    'recovered coefficients converge from (-0.6026, +4.42) at the crossover anchor onto the ' +
    'analytic (-1/2, +1/2) pair -- |b1+1/2| ~ 2e-13 and |b2-1/2| ~ 3e-11 by s = 24-48 -- ' +
    'confirming sigma ~ sqrt(log T0 / N) is a JOINT (-1/2, +1/2) power law. The +1/2 ' +
    'ln(log T0) coefficient is exactly the sqrt(log T0) half-power imp-33274 s single ln N slope ' +
    'folded into residual drift; the ~0.994-0.9997 ln N / ln(log T0) collinearity explains why ' +
    'the single fit could hide it. This further localises the imp-3529 residual drift. The C_mb ' +
    'GUE-conditional per imp-486 is UNTOUCHED; no positivity, no bridge closure, no RH claim, ' +
    'NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33274 (single-regressor p_eff -> 1/2, the fit extended here); imp-33255 ' +
    '(crossover-anchored single exponent, window-dependent); imp-3529 (LOCAL pointwise exponent ' +
    'p(N), residual drift); imp-3463 (far-tail leading form sqrt(log T0 / N)); imp-3444 ' +
    '(E_coll = E_trunc crossover N ~ 3.280e9); imp-486 (C_mb GUE-conditional); imp-2631 ' +
    '(E_trunc fixed-strip route); lambda-rh-height-mapping.',
};

export const IMP33291_SIGMA_FARTAIL_TWO_PARAMETER_LNN_LNLOGT0_FIT_ASSERTIONS = [
  {
    // Reuse gate: N_cross reproduces imp-3444 / imp-33274, and the ladder uses the same
    // START offsets / span -- proving the identical imp-33274 model and windows are in use.
    id: 'imp33291-reuses-imp33274-crossover-and-windows',
    description: 'N_cross ~ 3.280294e9 (imp-3444/imp-33274) and same fixed 12-decade START-offset ladder',
    holds: () =>
      Math.abs(N_CROSS / 3.280294e9 - 1) < 1e-3 &&
      TWO_PARAM_LADDER.length === START_OFFSETS.length &&
      TWO_PARAM_LADDER[0].startOffsetDecades === 0 &&
      TWO_PARAM_LADDER.every((r) => r.spanDecades === SPAN_DECADES),
  },
  {
    // (F1): the latest window recovers the analytic (-1/2, +1/2) pair to the arithmetic floor.
    id: 'imp33291-latest-window-recovers-analytic-pair',
    description: 'latest window b1 within 1e-9 of -1/2 and b2 within 1e-8 of +1/2',
    holds: () => {
      const last = TWO_PARAM_LADDER[TWO_PARAM_LADDER.length - 1];
      return Math.abs(last.b1_lnN - B1_ANALYTIC) < 1e-9 && Math.abs(last.b2_lnLogT0 - B2_ANALYTIC) < 1e-8;
    },
  },
  {
    // (F1): as the window slides past the ramp, BOTH coefficient gaps shrink monotonely
    // toward zero -- the fit converges onto (-1/2, +1/2), not an intermediate pair.
    id: 'imp33291-both-gaps-shrink-monotonely',
    description: 'gapB1 and gapB2 both monotone non-increasing across the sliding windows',
    holds: () => {
      for (let i = 1; i < TWO_PARAM_LADDER.length; i++) {
        if (!(TWO_PARAM_LADDER[i].gapB1 <= TWO_PARAM_LADDER[i - 1].gapB1)) return false;
        if (!(TWO_PARAM_LADDER[i].gapB2 <= TWO_PARAM_LADDER[i - 1].gapB2)) return false;
      }
      // and the crossover-anchored window is genuinely far off (collinearity + ramp wildness)
      return TWO_PARAM_LADDER[0].gapB1 > 5e-2 && TWO_PARAM_LADDER[0].gapB2 > 1;
    },
  },
  {
    // (F3): the two predictors ln N and ln(log T0) are highly collinear in EVERY window --
    // the reason the single-slope fit could fold the +1/2 log T0 half-power into its ln N slope.
    id: 'imp33291-high-lnN-lnlogT0-collinearity',
    description: 'ln N / ln(log T0) collinearity > 0.99 in every window',
    holds: () => TWO_PARAM_LADDER.every((r) => r.collinearity > 0.99 && r.collinearity < 1),
  },
  {
    // Honesty gate: measurement/fit only, analytic pair is (-1/2, +1/2), no QED, PT SOTA.
    id: 'imp33291-honesty-gate-no-qed',
    description: 'Measurement only: analytic pair (-1/2, +1/2), no QED, PT stays SOTA',
    holds: () =>
      IMP33291_SIGMA_FARTAIL_TWO_PARAMETER_LNN_LNLOGT0_FIT.isRigorous === false &&
      IMP33291_SIGMA_FARTAIL_TWO_PARAMETER_LNN_LNLOGT0_FIT.analyticPair.b1_lnN === -0.5 &&
      IMP33291_SIGMA_FARTAIL_TWO_PARAMETER_LNN_LNLOGT0_FIT.analyticPair.b2_lnLogT0 === 0.5 &&
      /NO QED/.test(IMP33291_SIGMA_FARTAIL_TWO_PARAMETER_LNN_LNLOGT0_FIT.verdict) &&
      /remains SOTA/.test(IMP33291_SIGMA_FARTAIL_TWO_PARAMETER_LNN_LNLOGT0_FIT.verdict),
  },
];

for (const a of IMP33291_SIGMA_FARTAIL_TWO_PARAMETER_LNN_LNLOGT0_FIT_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-33291-sigma-fartail-two-parameter-lnN-lnlogT0-fit assertion failed: ${a.id}`);
  }
}
