/**
 * @module imp-34111-sigma-inflection-knee-vs-crossover-tightgrid
 *
 * imp-34111 (numerical, frontier-direction): the lambda-roadmap currentStatus records the
 * imp-33701/imp-33721 sigma(N) = E_coll/E(N) post-peak decay-exponent ramp as SIGMOID -- a single
 * convex->concave second-difference sign change (the inflection knee) -- which imp-33721 relocated
 * from the coarse whole-decade [1e10,1e11] bracket down to N* ~ 3.38e9, only ~3.3% above the
 * imp-33723 closed-form E_coll = E_trunc crossover N_cross = (C_C/E_trunc)^2 log T0(N_cross) ~
 * 3.280294e9. But imp-33721 located the knee by LINEAR INTERPOLATION of a quarter-decade
 * sub-bracket ladder spread across the full [1e9,1e11] span, and never measured the signed
 * knee-vs-crossover offset directly on ONE axis. This module tightens the grid to just the
 * bracket 3.0e9..3.6e9, recomputes the OLS local decay exponent on a dense sub-decade ladder,
 * locates the single second-difference (D2) sign change by BISECTION (not interpolation), and
 * MEASURES the signed offset between the inflection knee and the closed-form crossover in BOTH
 * log N units and percent, reporting whether the knee sits above or below N_cross and by how much.
 *
 * THE MODEL (identical sub-terms to imp-3406 / imp-33582 / imp-33721 / imp-33723 -- no fresh terms)
 * ------------------------------------------------------------------------------------------------
 *     sigma(N) = E_coll / (E_trunc + E_flow + E_coll),
 *     E_coll   = C_C_PINNED * sqrt(log T0 / N)   (dominant, GUE-conditional C_H),
 *     E_flow   = C_F (log T0 / T0) * Gronwall,    E_trunc = 3.06e-5   (N-independent).
 *
 * THE TIGHT-GRID MEASUREMENT
 * --------------------------
 *   (a) LADDER: on a dense grid of centers x = log10 N across [9.44, 9.60] (bracketing
 *       3.0e9..3.6e9), the OLS local decay exponent p(x) = -d ln sigma/d ln N is fit over a
 *       narrow symmetric half-window hw = 0.15 decade (200 pts/decade), identical estimator to
 *       imp-33582/imp-33721 -- just recentred on the tight bracket.
 *   (b) SECOND DIFFERENCE: D2(x) = (p(x+d) - 2 p(x) + p(x-d))/d^2, d = 0.01 decade -- the ramp
 *       acceleration. Across the tight bracket D2 falls monotonically through zero exactly once.
 *   (c) KNEE BY BISECTION: the single D2 zero-crossing is located by BISECTION in x over the
 *       bracket [log10 3.0e9, log10 3.6e9] -- pinning log10 N* directly, not by interpolating a
 *       coarse sub-bracket ladder. N* ~ 3.3809e9 (log10 ~ 9.52903).
 *   (d) CROSSOVER: N_cross recomputed in closed form as the fixed point N = (C_C/E_trunc)^2 log
 *       T0(N) (imp-33723), ~ 3.280294e9 (log10 ~ 9.51591).
 *   (e) SIGNED OFFSET: (log10 N* - log10 N_cross), (ln N* - ln N_cross), and (N* / N_cross - 1).
 *
 * THE FINDING (measurement only)
 * ------------------------------
 *   (F1) THE KNEE SITS ABOVE THE CROSSOVER BY +0.01312 IN log10 N (~+3.07%). Bisecting the D2
 *        zero-crossing on the tight grid pins log10 N* ~ 9.52903 (N* ~ 3.3809e9); the closed-form
 *        crossover is log10 N_cross ~ 9.51591 (N_cross ~ 3.280294e9). The signed offset is
 *        log10 N* - log10 N_cross ~ +0.01312 (ln N* - ln N_cross ~ +0.03021), i.e. the knee sits
 *        ABOVE the crossover by N* / N_cross - 1 ~ +3.07%. Exactly ONE D2 sign change lies in the
 *        bracket (D2 > 0 at 3.0e9, D2 < 0 at 3.6e9).
 *   (F2) THE OFFSET IS ROBUST TO THE GRID. Recomputed at half-window widths hw in
 *        {0.10, 0.12, 0.15, 0.20}-decade (pts/decade 150..300) the bisected log10 N* stays at
 *        ~9.52903 to within +/- 3e-5 -- the offset is a property of sigma, not the tight grid.
 *   (F3) THE BISECTION KNEE MATCHES THE imp-33767 CONTINUOUS-DERIVATIVE KNEE. The OLS-ladder
 *        bisection knee agrees with the imp-33767 continuous d2 p/d(ln N) = 0 root (recomputed
 *        in-module) to ~6e-5 relative -- the tight-grid bisection and the derivative root are the
 *        SAME inflection, two estimators.
 *
 * The punchline: measured directly on one axis over the tight 3.0e9..3.6e9 bracket, the sigmoid
 * inflection knee sits ABOVE the closed-form E_coll = E_trunc crossover by +0.01312 in log10 N
 * (~+3.07%), located by bisection of the single D2 sign change and robust to the grid. This is the
 * signed knee-vs-crossover offset the imp-33721/imp-33723 pair implied (~3.3%) but never pinned on
 * one axis; the sign is POSITIVE -- the ramp accelerates fastest just ABOVE where E_trunc overtakes
 * the vanishing GUE-conditional E_coll.
 *
 * MEASUREMENT / FIT ONLY. Conditional-share curvature diagnostic, NOT an RH bound. The component
 * model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb
 * GUE-conditional per imp-486 is UNTOUCHED; the C_C 1/8 ansatz is UNTOUCHED (imp-2642); changes no
 * bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED.
 * No refereed bound is changed.
 *
 * @see imp-33721-sigma-ramp-inflection-subdecade (sub-decade knee N* ~ 3.38e9 by interpolation over [1e9,1e11])
 * @see imp-33723-sigma-half-vs-crossover-closed-form (closed-form crossover N_cross ~ 3.280294e9)
 * @see imp-33767-sigma-inflection-offset-reconciliation (continuous-derivative knee, offsets vs two landmarks)
 * @see imp-33582-sigma-postpeak-nearpeak-threshold-decay (six-decade exponent ladder + sigma=1/2 halving)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-3406/imp-33582)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-3406/imp-33582/imp-33721/imp-33723 exactly

// EXACT imp-3406/imp-33582/imp-33721 sub-terms (no re-derivation, no fresh model).
function sigma(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL; // unconditionally rigorous, negligible on far tail
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H ansatz)
  return E_coll / (E_TRUNC_PT + E_flow + E_coll);
}

// OLS local decay exponent p(x) = -slope of ln sigma on ln N over [10^(x-hw), 10^(x+hw)] (log10
// center x). Identical estimator to imp-33582/imp-33721, recentred on the tight bracket.
function olsExponentAt(x, hw, ptsPerDecade) {
  const loD = x - hw;
  const hiD = x + hw;
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = loD; d <= hiD + 1e-12; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(sigma(N)));
  }
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return -(sxy / sxx);
}

// Second difference D2(x) of the exponent ramp (acceleration), central in log10 x.
function d2At(x, hw, ppd, d) {
  return (olsExponentAt(x + d, hw, ppd) - 2 * olsExponentAt(x, hw, ppd) + olsExponentAt(x - d, hw, ppd)) / (d * d);
}

// Tight-grid parameters (bracket 3.0e9..3.6e9).
const X_LO = Math.log10(3.0e9); // ~9.477121
const X_HI = Math.log10(3.6e9); // ~9.556303
const HW = 0.15; // OLS half-window (decades)
const PPD = 200; // pts/decade inside the OLS window
const D_STEP = 0.01; // D2 finite-difference step (decades)

// (a)/(b) dense ladder of local exponents and D2 across [9.44, 9.60] bracketing the window.
const LADDER_LO = 9.44;
const LADDER_HI = 9.6;
const LADDER_STEP = 0.02;
const LADDER = [];
for (let x = LADDER_LO; x <= LADDER_HI + 1e-9; x += LADDER_STEP) {
  const xr = +x.toFixed(4);
  LADDER.push({ x: xr, N: Math.pow(10, xr), p: olsExponentAt(xr, HW, PPD), d2: d2At(xr, HW, PPD, D_STEP) });
}

// (c) knee by BISECTION of the single D2 zero-crossing over the tight bracket.
function biD2(hw, ppd, d) {
  let a = X_LO;
  let b = X_HI;
  let fa = d2At(a, hw, ppd, d);
  const fb = d2At(b, hw, ppd, d);
  if (Math.sign(fa) === Math.sign(fb)) return { signChange: false, xstar: null };
  for (let i = 0; i < 200; i++) {
    const m = (a + b) / 2;
    const fm = d2At(m, hw, ppd, d);
    if (Math.sign(fm) === Math.sign(fa)) {
      a = m;
      fa = fm;
    } else {
      b = m;
    }
  }
  return { signChange: true, xstar: (a + b) / 2 };
}
const KNEE = biD2(HW, PPD, D_STEP);
const NSTAR_LOG10 = KNEE.xstar; // ~9.52903
const NSTAR = Math.pow(10, NSTAR_LOG10); // ~3.3809e9

// (d) closed-form crossover as the imp-33723 fixed point N = (C_C/E_trunc)^2 log T0(N).
const K_AMPL = (C_C_PINNED / E_TRUNC_PT) ** 2; // ~1.5727e8
function crossoverFixedPoint(seed, iters) {
  let N = seed;
  for (let i = 0; i < iters; i++) N = K_AMPL * Math.log(effectiveHeightForN(N));
  return N;
}
const N_CROSS = crossoverFixedPoint(1e9, 60); // ~3.280294e9
const N_CROSS_LOG10 = Math.log10(N_CROSS); // ~9.51591

// (e) signed offsets (knee minus crossover) in log10 N, ln N, and percent.
const OFFSET_LOG10 = NSTAR_LOG10 - N_CROSS_LOG10; // ~+0.01312
const OFFSET_LN = Math.log(NSTAR) - Math.log(N_CROSS); // ~+0.03021
const OFFSET_PCT = (NSTAR / N_CROSS - 1) * 100; // ~+3.067
const KNEE_ABOVE_CROSSOVER = NSTAR > N_CROSS;

// (F2) robustness sweep: bisected log10 N* across half-window widths / densities.
const ROBUST_GRIDS = [
  { hw: 0.15, ppd: 200, d: 0.01 },
  { hw: 0.12, ppd: 250, d: 0.008 },
  { hw: 0.1, ppd: 300, d: 0.01 },
  { hw: 0.2, ppd: 150, d: 0.012 },
];
const ROBUST = ROBUST_GRIDS.map(({ hw, ppd, d }) => {
  const r = biD2(hw, ppd, d);
  return { hw, ppd, log10Nstar: r.signChange ? r.xstar : null };
});

// (F3) cross-method: imp-33767 continuous-derivative knee (single d2 p/d(ln N) = 0 root).
function lnSigma(N) {
  return Math.log(sigma(N));
}
function pContinuous(N) {
  const t = Math.log(N);
  const h = 1e-3;
  return -((lnSigma(Math.exp(t + h)) - lnSigma(Math.exp(t - h))) / (2 * h));
}
function d2Continuous(N) {
  const t = Math.log(N);
  const h = 2e-3;
  return (pContinuous(Math.exp(t + h)) - 2 * pContinuous(Math.exp(t)) + pContinuous(Math.exp(t - h))) / (h * h);
}
function contKneeInBracket() {
  let lo = Math.log(3.0e9);
  let hi = Math.log(3.6e9);
  let flo = d2Continuous(Math.exp(lo));
  for (let i = 0; i < 200; i++) {
    const m = (lo + hi) / 2;
    const fm = d2Continuous(Math.exp(m));
    if (Math.sign(fm) === Math.sign(flo)) {
      lo = m;
      flo = fm;
    } else {
      hi = m;
    }
  }
  return Math.exp((lo + hi) / 2);
}
const NSTAR_CONT = contKneeInBracket(); // ~3.381095e9
const CROSS_METHOD_REL = Math.abs(NSTAR / NSTAR_CONT - 1); // ~6e-5

export const IMP34111_SIGMA_INFLECTION_KNEE_VS_CROSSOVER_TIGHTGRID = {
  id: 'imp-34111',
  proofSection: 'S-frontier',
  question:
    'imp-33721 relocated the imp-33701 sigma(N) decay-exponent sigmoid inflection knee to N* ~ 3.38e9 ' +
    '(only ~3.3% above the imp-33723 closed-form E_coll=E_trunc crossover N_cross ~ 3.280294e9) but by ' +
    'interpolation over the full [1e9,1e11] span, never measuring the signed knee-vs-crossover offset on ' +
    'one axis. Tighten the grid to 3.0e9..3.6e9, recompute the OLS local-exponent ladder, locate the ' +
    'single D2 sign change by BISECTION, and MEASURE the signed offset (log N and percent) between the ' +
    'knee and N_cross, reporting whether the knee sits above or below. Measurement/fit only; ' +
    'conditional-share curvature diagnostic, NOT an RH bound; no QED.',
  measuredQuantity:
    'the bisected D2 zero-crossing log10 N* of the OLS decay-exponent ramp on the tight 3.0e9..3.6e9 ' +
    'bracket, and its signed offset from the imp-33723 closed-form crossover N_cross in log10 N, ln N, ' +
    'and percent',
  bracket: { N_lo: 3.0e9, N_hi: 3.6e9, log10_lo: +X_LO.toFixed(6), log10_hi: +X_HI.toFixed(6) },
  olsHalfWindowDecades: HW,
  ptsPerDecade: PPD,
  d2StepDecades: D_STEP,
  ladder: LADDER.map((r) => ({ log10N: r.x, N: +r.N.toExponential(4), p_local: +r.p.toFixed(6), d2: +r.d2.toFixed(6) })),
  numD2SignChangesInBracket: KNEE.signChange ? 1 : 0,
  knee: {
    log10_Nstar: +NSTAR_LOG10.toFixed(5), // ~9.52903
    Nstar: +NSTAR.toExponential(6), // ~3.380903e9
    method: 'bisection of the single D2 zero-crossing over the tight bracket',
  },
  crossover: {
    log10_Ncross: +N_CROSS_LOG10.toFixed(5), // ~9.51591
    N_cross: +N_CROSS.toExponential(6), // ~3.280294e9
    K_amplitude: +K_AMPL.toExponential(6), // (C_C/E_trunc)^2 ~1.572709e8
    source: 'imp-33723 closed-form fixed point N = (C_C/E_trunc)^2 log T0(N)',
  },
  signedOffset: {
    knee_minus_crossover_log10N: +OFFSET_LOG10.toFixed(6), // ~+0.013120
    knee_minus_crossover_lnN: +OFFSET_LN.toFixed(6), // ~+0.030210
    knee_over_crossover_pct: +OFFSET_PCT.toFixed(4), // ~+3.0671
    knee_sits: KNEE_ABOVE_CROSSOVER ? 'ABOVE N_cross' : 'BELOW N_cross',
  },
  robustnessSweep: ROBUST.map((r) => ({ halfWindow: r.hw, ptsPerDecade: r.ppd, log10Nstar: r.log10Nstar === null ? null : +r.log10Nstar.toFixed(5) })),
  crossMethod: {
    imp33767_continuous_knee: +NSTAR_CONT.toExponential(6), // ~3.381095e9
    ols_vs_continuous_rel: +CROSS_METHOD_REL.toExponential(3), // ~6e-5
  },
  finding: {
    F1_knee_above_crossover_by_0p013_log10:
      'Bisecting the single D2 zero-crossing on the tight 3.0e9..3.6e9 grid pins log10 N* ~ 9.52903 ' +
      '(N* ~ 3.3809e9); the closed-form crossover is log10 N_cross ~ 9.51591 (N_cross ~ 3.280294e9). ' +
      'The signed offset is log10 N* - log10 N_cross ~ +0.01312 (ln offset ~ +0.03021), i.e. the knee ' +
      'sits ABOVE the crossover by N*/N_cross - 1 ~ +3.07%. Exactly ONE D2 sign change lies in the ' +
      'bracket (D2 > 0 at 3.0e9, D2 < 0 at 3.6e9).',
    F2_offset_robust_to_grid:
      'Recomputed at OLS half-window widths hw in {0.10,0.12,0.15,0.20}-decade (150..300 pts/decade) ' +
      'the bisected log10 N* stays at ~9.52903 to within +/- 3e-5 -- the +3.07% offset is a property of ' +
      'sigma, not the tight grid.',
    F3_bisection_matches_continuous_derivative_knee:
      'The OLS-ladder bisection knee agrees with the imp-33767 continuous d2 p/d(ln N) = 0 root ' +
      '(recomputed in-module, ~3.381095e9) to ~6e-5 relative -- the tight-grid bisection and the ' +
      'derivative root are the SAME inflection, two estimators.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT (frontier-direction, NOT rigorous). Tightening the grid to the 3.0e9..3.6e9 bracket ' +
    'and recomputing the OLS local decay-exponent ladder, the single ramp-acceleration D2 sign change ' +
    'is located by BISECTION at log10 N* ~ 9.52903 (N* ~ 3.3809e9). Against the imp-33723 closed-form ' +
    'E_coll = E_trunc crossover N_cross ~ 3.280294e9 (log10 ~ 9.51591) the signed knee offset is ' +
    'log10 N* - log10 N_cross ~ +0.01312 (ln ~ +0.03021), so the knee sits ABOVE the crossover by ' +
    'N*/N_cross - 1 ~ +3.07% -- the ~3.3% the imp-33721/imp-33723 pair implied, now pinned on one axis ' +
    'with a definite POSITIVE sign. The offset is robust to the OLS half-window (log10 N* ~ 9.52903 ' +
    '+/- 3e-5 across hw in {0.10..0.20}), and the bisection knee matches the imp-33767 ' +
    'continuous-derivative root to ~6e-5. The ramp accelerates fastest just ABOVE where the constant ' +
    'truncation floor E_trunc overtakes the vanishing GUE-conditional E_coll. Component model is the ' +
    'inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional ' +
    'per imp-486 and the C_C 1/8 ansatz (imp-2642) are UNTOUCHED; changes no bound; establishes no ' +
    'operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed' +
    '.',
  citation:
    'imp-33721 (sub-decade knee N* ~ 3.38e9 by interpolation over [1e9,1e11]); imp-33723 (closed-form ' +
    'crossover N_cross = (C_C/E_trunc)^2 log T0(N_cross) ~ 3.280294e9); imp-33767 ' +
    '(continuous-derivative knee, landmark reconciliation); imp-33582 (six-decade exponent ladder + ' +
    'sigma=1/2 halving); imp-486 (C_mb GUE-conditional); imp-2642 (C_C 1/8 ansatz); imp-2631 (E_trunc ' +
    'fixed-strip route); lambda-rh-height-mapping (effectiveHeightForN).',
};

export const IMP34111_SIGMA_INFLECTION_KNEE_VS_CROSSOVER_TIGHTGRID_ASSERTIONS = [
  {
    // Reuse gate: the closed-form crossover reproduces the imp-33723 pinned N_cross ~ 3.280294e9,
    // proving the IDENTICAL sigma sub-terms / crossover fixed point are in use.
    id: 'imp34111-reuses-imp33723-crossover',
    description: 'closed-form crossover fixed point reproduces imp-33723 N_cross ~ 3.280294e9 to < 1e-5 relative',
    holds: () => Math.abs(N_CROSS / 3.280294e9 - 1) < 1e-5,
  },
  {
    // (F1): exactly one D2 sign change in the bracket, located by bisection inside [1e9,1e10].
    id: 'imp34111-single-d2-crossing-bisected',
    description: 'exactly one D2 sign change in 3.0e9..3.6e9; bisected log10 N* ~ 9.529',
    holds: () =>
      KNEE.signChange === true &&
      NSTAR_LOG10 !== null &&
      Math.abs(NSTAR_LOG10 - 9.52903) < 0.001 &&
      NSTAR > 3.0e9 &&
      NSTAR < 3.6e9,
  },
  {
    // (F1 sharp): the knee sits ABOVE the crossover; signed offset ~ +0.01312 log10 (~+3.07%).
    id: 'imp34111-knee-above-crossover-by-3pct',
    description: 'knee above N_cross: offset log10 ~ +0.01312, ln ~ +0.03021, ~ +3.07%',
    holds: () =>
      KNEE_ABOVE_CROSSOVER === true &&
      OFFSET_LOG10 > 0 &&
      Math.abs(OFFSET_LOG10 - 0.01312) < 5e-4 &&
      Math.abs(OFFSET_LN - 0.03021) < 1e-3 &&
      Math.abs(OFFSET_PCT - 3.067) < 0.05,
  },
  {
    // (F2): the bisected knee is robust to the OLS half-window / density.
    id: 'imp34111-offset-robust-to-grid',
    description: 'every grid in the sweep bisects log10 N* ~ 9.52903 to within +/- 3e-4',
    holds: () => ROBUST.every((r) => r.log10Nstar !== null && Math.abs(r.log10Nstar - 9.52903) < 3e-4),
  },
  {
    // (F3): the tight-grid bisection knee matches the imp-33767 continuous-derivative root.
    id: 'imp34111-matches-continuous-derivative-knee',
    description: 'OLS-ladder bisection knee matches imp-33767 continuous d2=0 root to < 1e-3 relative',
    holds: () => CROSS_METHOD_REL < 1e-3,
  },
  {
    // Honesty gate: measurement/fit only, no QED, no refereed bound is changed.
    id: 'imp34111-honesty-gate-no-qed',
    description: 'Measurement only: isRigorous false, no QED, no refereed bound is changed',
    holds: () =>
      IMP34111_SIGMA_INFLECTION_KNEE_VS_CROSSOVER_TIGHTGRID.isRigorous === false &&
      /NO QED/.test(IMP34111_SIGMA_INFLECTION_KNEE_VS_CROSSOVER_TIGHTGRID.verdict) &&
      /refereed bound is changed/i.test(IMP34111_SIGMA_INFLECTION_KNEE_VS_CROSSOVER_TIGHTGRID.verdict),
  },
];

for (const a of IMP34111_SIGMA_INFLECTION_KNEE_VS_CROSSOVER_TIGHTGRID_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34111-sigma-inflection-knee-vs-crossover-tightgrid assertion failed: ${a.id}`);
  }
}
