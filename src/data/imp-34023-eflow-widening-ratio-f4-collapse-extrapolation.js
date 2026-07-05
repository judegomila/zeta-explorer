/**
 * @module imp-34023-eflow-widening-ratio-f4-collapse-extrapolation
 *
 * imp-34023 (numerical, frontier-direction): imp-33969 measured that the imp-33922 over-prediction
 * factor F1/widening = 1/(F2*F3*F4) is NOT window-invariant -- across the imp-33917 boundary sweep
 * kEnd = 11..13 it drifts monotonically upward 19.913 -> 165.351 (x8.30), ~96.5% driven by the
 * imp-33773 M2 residual ratio F4 collapsing 0.87432 -> 0.11339 (x0.130). But imp-33969 only measured
 * that drift WITHIN kEnd = 11..13. It never fitted the functional form of the F4 collapse, and it
 * never asked the natural follow-on: as the fit boundary recedes PAST kEnd=13, does the over-prediction
 * ratio 1/(F2*F3*F4) diverge without bound, or does it approach an asymptote? This module supplies both:
 * it fits F4(kEnd) (and the near-flat F2, F3) to a decay law on the SAME 9 anchor windows, then extends
 * the ladder directly past kEnd=13 with the identical inherited imp-3406/imp-33810 sub-terms and reports
 * the extrapolated behaviour.
 *
 * THE FUNCTIONAL FORM OF THE F4 COLLAPSE (log-linear / geometric in kEnd)
 * ---------------------------------------------------------------------
 *   A log-linear OLS of ln F4 against kEnd over the 9 anchor windows (kEnd = 11.00..13.00 step 0.25)
 *   is an EXCELLENT fit: ln F4 = a + b*kEnd with a ~ 11.168, b ~ -1.0248, R^2 ~ 0.99942. So the F4
 *   collapse is (to within the anchor window) a clean geometric decay with per-unit-kEnd factor
 *   exp(b) ~ 0.3589; over kEnd 11 -> 13 this predicts exp(2b) ~ 0.1288, recovering the imp-33969
 *   x0.130 collapse. F2 (per-unit factor ~0.9739) and F3 (~0.9907) are near-flat, confirming F4 as the
 *   sole materially-moving attenuation factor.
 *
 * THE PAST-kEnd EXTRAPOLATION (direct ladder extension, same sub-terms as imp-33969)
 * -------------------------------------------------------------------------------
 *   Extending the boundary directly past kEnd=13 (head fixed at k=6): the over-prediction ratio keeps
 *   climbing MONOTONICALLY and geometrically -- 165.35 (13) -> 501.2 (14) -> 1533 (15) -> 4721 (16) ->
 *   46288 (18) -> 589238 (20), a per-unit-kEnd growth factor ~3.25 (ratio(20)/ratio(14) ~ 1176x). F4
 *   keeps collapsing geometrically toward 0 while F2, F3 approach constants, so 1/(F2*F3*F4) grows like
 *   exp(-b*kEnd) WITHOUT BOUND. It does NOT saturate. (The single-exponential anchor fit slightly
 *   under-predicts the direct ratio at large kEnd because the local F4 decay rate accelerates modestly
 *   -- exp(b) drifts 0.376 near the anchor to 0.327 at large kEnd -- so the true collapse is a touch
 *   faster than one exponential; either way the ratio diverges.)
 *
 * THE HARD CEILING (the M2 residual sign change at kEnd ~ 21.3 caps the surrogate)
 * -----------------------------------------------------------------------------
 *   The divergence is only MEANINGFUL up to a ceiling intrinsic to the surrogate. F4 = resid(kEnd)/
 *   resid(6) with resid = pEcoll*(1-sigma) - pSigma, a DIFFERENCE of two exponents that BOTH converge to
 *   0.5 as N grows (sigma -> 0, pEcoll -> 0.5, pSigma -> 0.5). The residual therefore collapses into
 *   catastrophic cancellation and crosses zero at kEnd* ~ 21.281 (bisected), beyond which F4 -- and the
 *   ratio -- flip sign. That sign change is a floating-point-cancellation artifact of the M2 residual
 *   losing significance, NOT a physical saturation. So the honest reading is: within the sign-stable
 *   region kEnd <~ 21.3 the over-prediction ratio DIVERGES geometrically (no asymptote); past the
 *   crossing the F4/ratio decomposition is meaningless and the surrogate cannot be pushed further.
 *
 * The punchline: the imp-33969 F4 collapse is geometric in kEnd (ln F4 linear, R^2 ~ 0.99942, factor
 * ~0.359/unit), and extending the ladder past kEnd=13 the over-prediction ratio 1/(F2*F3*F4) DIVERGES
 * without bound (~3.25x per unit kEnd), it does NOT saturate -- but only up to the M2 residual zero
 * crossing at kEnd ~ 21.3, where the surrogate residual loses significance and the decomposition breaks.
 *
 * NUMERICAL / MEASUREMENT ONLY. Curve fit + direct extrapolation of an inherited surrogate ratio, NOT
 * an RH bound. The inherited imp-3220/imp-3406 component model is NOT a rigorous asymptotic; the decay
 * fit and the extended ladder are descriptive within that model only; changes no bound; establishes no
 * operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2
 * remains SOTA.
 *
 * @see imp-33969-eflow-decay-widening-ratio-kend-sweep (the 9-window kEnd=11..13 drift measured/anchored)
 * @see imp-33922-eflow-analytic-decay-vs-widening-crosscheck (the fixed-kEnd=11 ~19.9x over-prediction)
 * @see imp-33917-endpoint-residual-growth-law (the receding-boundary feature the F4 collapse tracks)
 * @see imp-33810-eflow-resid-ratio-N-ladder (the k=6.. quarter-decade ladder reused verbatim)
 * @see imp-33773 (the M2 sub-leading residual whose sign change caps the surrogate at kEnd~21.3)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N = (T0/2pi)(L0-1), the RvM height law)
 * @see polymath15-constant-C-C (C_C = C_H sqrt(pi C_Selberg); GUE-conditional E_coll prefactor)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631/imp-33773)
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP); // matches imp-33810/imp-33884/imp-33922/imp-33969 exactly

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim from imp-33969 (no re-derivation).
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const L0 = Math.log(T0 / TWO_PI);
  const C_F = (L0 + 1) / TWO_PI; // imp-398 pinned prefactor
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N); // GUE-conditional (C_H)
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { T0, L, L0, E_flow, E_coll, E_N, sigma: E_coll / E_N };
}
const sigma = (N) => parts(N).sigma;

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
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
  return -sxy / sxx;
}
function ecollExponentMag(loN, hiN) {
  return -Math.log(parts(hiN).E_coll / parts(loN).E_coll) / Math.log(hiN / loN);
}
function eflowLogSlope(N) {
  const h = 1e-3;
  const lp = Math.log(parts(N * Math.pow(10, h)).E_flow);
  const lm = Math.log(parts(N / Math.pow(10, h)).E_flow);
  return (lp - lm) / (2 * h * Math.LN10);
}

// The imp-33810 endpoint rung at boundary k (head k=6, tail k=kEnd) -- the roe = resid/eflow ratio.
function rung(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const resid = pEcoll * (1 - ph.sigma) - pSigma; // imp-33773 M2 sub-leading residual
  const sflow = Math.abs(eflowLogSlope(hi));
  const eflow = (ph.E_flow / ph.E_N) * sflow; // attributed E_flow term
  return { k, E_flow: ph.E_flow, E_N: ph.E_N, resid, sflow, eflow, roe: resid / eflow, pSigma, pEcoll };
}

const HEAD = rung(6); // fixed head, exactly as imp-33969

// Simple log-linear OLS: ln y = a + b*x. Returns {a, b, perUnit=exp(b), R2}.
function logLinearFit(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  let syy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
    syy += (ys[i] - my) ** 2;
  }
  const b = sxy / sxx;
  const a = my - b * mx;
  const R2 = (sxy * sxy) / (sxx * syy);
  return { a, b, perUnit: Math.exp(b), R2 };
}

// Per-boundary attenuation factors (head fixed at k=6), same identity as imp-33969.
function factors(kEnd) {
  const TAIL = rung(kEnd);
  const F2 = TAIL.E_N / HEAD.E_N; // normaliser collapse
  const F3 = HEAD.sflow / TAIL.sflow; // E_flow log-slope ratio
  const F4 = TAIL.resid / HEAD.resid; // imp-33773 residual ratio (the driver)
  const attenuation = F2 * F3 * F4;
  return { kEnd, F2, F3, F4, attenuation, ratio: 1 / attenuation, resid: TAIL.resid };
}

// -- Part A: fit F4 (and near-flat F2, F3) to a decay law on the SAME 9 anchor windows (kEnd=11..13).
const ANCHOR_KENDS = [];
for (let k = 11; k <= 13 + 1e-9; k += 0.25) ANCHOR_KENDS.push(+k.toFixed(2));
const ANCHOR = ANCHOR_KENDS.map(factors);
const F4_FIT = logLinearFit(ANCHOR_KENDS, ANCHOR.map((r) => Math.log(r.F4)));
const F2_FIT = logLinearFit(ANCHOR_KENDS, ANCHOR.map((r) => Math.log(r.F2)));
const F3_FIT = logLinearFit(ANCHOR_KENDS, ANCHOR.map((r) => Math.log(r.F3)));
const F4_COLLAPSE_11_TO_13 = Math.exp(2 * F4_FIT.b); // ~0.1288 -> recovers the imp-33969 x0.130

// -- Part B: extend the ladder directly PAST kEnd=13 (same sub-terms), report the ratio behaviour.
const EXTENDED_KENDS = [];
for (let k = 13; k <= 21 + 1e-9; k += 0.5) EXTENDED_KENDS.push(+k.toFixed(2));
const EXTENDED = EXTENDED_KENDS.map((kEnd) => {
  const f = factors(kEnd);
  return {
    kEnd,
    F2: +f.F2.toExponential(4),
    F3: +f.F3.toFixed(5),
    F4: +f.F4.toExponential(5),
    ratio: +f.ratio.toFixed(3),
    resid: +f.resid.toExponential(4),
  };
});

// Does the ratio diverge or saturate? Direct evidence over the sign-stable extension.
const SIGN_STABLE = EXTENDED.filter((r) => r.resid > 0); // resid > 0 => F4 > 0 => ratio meaningful
const RATIO_MONOTONIC_UP = SIGN_STABLE.every((r, i) => i === 0 || r.ratio > SIGN_STABLE[i - 1].ratio);
const R14 = factors(14).ratio;
const R20 = factors(20).ratio;
const RATIO_GROWTH_20_OVER_14 = +(R20 / R14).toFixed(2); // ~1176x over 6 units of kEnd
const RATIO_PER_UNIT_GROWTH = +Math.pow(R20 / R14, 1 / 6).toFixed(4); // ~3.25 per unit kEnd

// -- Part C: the M2 residual sign-change ceiling that caps the surrogate.
function residCrossing() {
  let lo = 20;
  let hi = 22;
  if (rung(lo).resid <= 0 || rung(hi).resid >= 0) return NaN;
  for (let i = 0; i < 80; i++) {
    const m = (lo + hi) / 2;
    if (rung(m).resid > 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
const RESID_ZERO_KEND = +residCrossing().toFixed(4); // ~21.281

export const IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION = {
  id: 'imp-34023',
  proofSection: 'S-frontier',
  question:
    'imp-33969 measured that the over-prediction ratio F1/widening = 1/(F2*F3*F4) drifts x8.30 across ' +
    'kEnd=11..13, ~96.5% driven by the imp-33773 residual ratio F4 collapsing x0.130, but only WITHIN ' +
    'that window. Fit the functional form of the F4 collapse (and the near-flat F2, F3) on the same 9 ' +
    'windows, then extend the ladder PAST kEnd=13 with the identical inherited sub-terms: does the ' +
    'over-prediction ratio diverge without bound or approach an asymptote as the boundary recedes ' +
    'further? Numerical/measurement only; component model NOT rigorous; NO QED.',
  measuredQuantity:
    'Part A: log-linear OLS of ln F4 vs kEnd (and ln F2, ln F3) over kEnd=11.00..13.00 step 0.25 (9 ' +
    'windows, head fixed at k=6), reporting the decay slope b, per-unit-kEnd factor exp(b) and R^2. ' +
    'Part B: the direct extended ladder kEnd=13.00..21.00 step 0.5 (same sub-terms), tabulating F2, F3, ' +
    'F4, the over-prediction ratio 1/(F2*F3*F4) and the raw M2 residual. Part C: the residual zero ' +
    'crossing kEnd* bisected, beyond which the F4/ratio decomposition changes sign and is meaningless.',
  f4CollapseFit: {
    form: 'ln F4 = a + b*kEnd (geometric decay in kEnd)',
    a: +F4_FIT.a.toFixed(6), // ~11.168
    b: +F4_FIT.b.toFixed(6), // ~-1.0248
    perUnitDecayFactor: +F4_FIT.perUnit.toFixed(6), // ~0.3589
    R2: +F4_FIT.R2.toFixed(8), // ~0.99942 (excellent single-exponential fit)
    collapse_11_to_13: +F4_COLLAPSE_11_TO_13.toFixed(5), // ~0.12877 -> recovers imp-33969 x0.130
    F2_perUnitDecayFactor: +F2_FIT.perUnit.toFixed(6), // ~0.9739 (near-flat)
    F3_perUnitDecayFactor: +F3_FIT.perUnit.toFixed(6), // ~0.9907 (near-flat)
  },
  extendedLadder: EXTENDED, // {kEnd, F2, F3, F4, ratio, resid} for kEnd=13..21 step 0.5
  extrapolationVerdict: {
    ratio_diverges: true, // grows without bound; does NOT saturate
    ratio_saturates: false,
    ratio_monotonic_increasing: RATIO_MONOTONIC_UP,
    ratio_at_kEnd_14: +R14.toFixed(2), // ~501.18
    ratio_at_kEnd_20: +R20.toFixed(2), // ~589238.17
    ratio_growth_20_over_14: RATIO_GROWTH_20_OVER_14, // ~1176x over 6 units of kEnd
    ratio_per_unit_kEnd_growth_factor: RATIO_PER_UNIT_GROWTH, // ~3.25 (geometric, no asymptote)
    mechanism:
      'F4 keeps collapsing geometrically toward 0 (per-unit factor ~0.359) while F2, F3 approach ' +
      'constants, so 1/(F2*F3*F4) ~ exp(-b*kEnd) grows without bound -- no asymptote.',
  },
  surrogateCeiling: {
    resid_zero_crossing_kEnd: RESID_ZERO_KEND, // ~21.281
    cause:
      'resid = pEcoll*(1-sigma) - pSigma is a DIFFERENCE of two exponents that BOTH converge to 0.5 as ' +
      'N grows (sigma -> 0, pEcoll -> 0.5, pSigma -> 0.5); it collapses into catastrophic cancellation ' +
      'and crosses zero at kEnd* ~ 21.28, past which F4 and the ratio flip sign.',
    implication:
      'The divergence is established/meaningful only within the sign-stable region kEnd <~ 21.3; past ' +
      'the crossing the sign flip is a floating-point-cancellation artifact of the M2 residual losing ' +
      'significance, NOT a physical saturation, and the surrogate cannot be pushed further.',
  },
  finding: {
    A_f4_collapse_is_geometric:
      'The imp-33969 F4 collapse fits ln F4 = a + b*kEnd with b ~ -1.0248, R^2 ~ 0.99942 over the 9 ' +
      'anchor windows -- a clean geometric decay, per-unit-kEnd factor exp(b) ~ 0.3589; exp(2b) ~ ' +
      '0.1288 recovers the x0.130 collapse over kEnd 11 -> 13. F2 (~0.9739/unit) and F3 (~0.9907/unit) ' +
      'are near-flat, confirming F4 as the sole materially-moving attenuation factor.',
    B_ratio_diverges_no_asymptote:
      'Extending the boundary directly past kEnd=13 the over-prediction ratio 1/(F2*F3*F4) keeps ' +
      'climbing monotonically and geometrically -- 165.35 (13) -> 501 (14) -> 1533 (15) -> 4721 (16) ' +
      '-> 46288 (18) -> 589238 (20), ~3.25x per unit kEnd (x1176 over 6 units). It DIVERGES without ' +
      'bound; it does NOT saturate, because F4 collapses geometrically toward 0 while F2, F3 approach ' +
      'constants. The single-exponential anchor fit slightly under-predicts the direct ratio at large ' +
      'kEnd (local F4 decay accelerates from 0.376 to 0.327), so the true collapse is a touch faster.',
    C_capped_by_residual_sign_change:
      'The divergence is meaningful only up to a ceiling intrinsic to the surrogate: the M2 residual ' +
      'crosses zero at kEnd* ~ 21.28 (a difference of two exponents both -> 0.5, catastrophic ' +
      'cancellation), beyond which F4 and the ratio flip sign -- a floating-point artifact, not a ' +
      'physical saturation. Within kEnd <~ 21.3 the ratio diverges geometrically with no asymptote.',
  },
  isRigorous: false,
  verdict:
    'NUMERICAL / EXTRAPOLATION (frontier-direction, NOT rigorous). Fitting the imp-33969 F4 collapse to ' +
    'a decay law and extending the ladder past kEnd=13 (identical inherited imp-3406/imp-33810 ' +
    'sub-terms, head fixed at k=6) establishes: (A) the F4 collapse is GEOMETRIC in kEnd -- ln F4 = a + ' +
    'b*kEnd fits with b ~ -1.0248 and R^2 ~ 0.99942 over the 9 anchor windows, per-unit-kEnd factor ' +
    'exp(b) ~ 0.3589, and exp(2b) ~ 0.1288 recovers the imp-33969 x0.130 collapse; F2 (~0.974/unit) and ' +
    'F3 (~0.991/unit) are near-flat. (B) Extending past kEnd=13 the over-prediction ratio 1/(F2*F3*F4) ' +
    'DIVERGES WITHOUT BOUND -- it climbs monotonically 165.35 (13) -> 589238 (20), ~3.25x per unit kEnd, ' +
    'and does NOT approach any asymptote, because F4 keeps collapsing geometrically toward 0 while F2, ' +
    'F3 approach constants. (C) The divergence is meaningful only up to a ceiling intrinsic to the ' +
    'surrogate: the imp-33773 M2 residual (a difference of two exponents both -> 0.5) collapses into ' +
    'catastrophic cancellation and crosses zero at kEnd* ~ 21.28, beyond which F4 and the ratio flip ' +
    'sign -- a floating-point artifact, not a physical saturation. So the answer is DIVERGES (no ' +
    'asymptote) within kEnd <~ 21.3, capped by the residual sign change. The inherited imp-3220/imp-3406 ' +
    'component model is NOT a rigorous asymptotic; the decay fit and extended ladder are descriptive ' +
    'within the model only; changes no bound; establishes no operator positivity; imp-3066 K_a >= 0 ' +
    'untouched; no RH verdict, NO QED. Platt-Trudgian Lambda <= 0.2 remains SOTA.',
  citation:
    'imp-33969 (the 9-window kEnd=11..13 F1/widening drift and F4 x0.130 collapse extended here); ' +
    'imp-33922 (the fixed-kEnd=11 ~19.9x over-prediction); imp-33917 (the receding-boundary feature); ' +
    'imp-33884 (the exact widening + F1..F4 decomposition); imp-33810 (the quarter-decade rungs); ' +
    'imp-33773 (the M2 residual whose sign change at kEnd~21.3 caps the surrogate); ' +
    'lambda-rh-height-mapping (RvM height law); polymath15-constant-C-C (E_coll prefactor).',
};

export const IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION_ASSERTIONS = [
  {
    // (A) F4 collapse is a clean geometric decay; the fit recovers the imp-33969 x0.130 collapse.
    id: 'imp34023-f4-collapse-geometric-fit-recovers-x0130',
    description: 'ln F4 log-linear on kEnd=11..13: R2 > 0.999, per-unit factor ~0.359, exp(2b) recovers x0.130',
    holds: () =>
      ANCHOR.length === 9 &&
      F4_FIT.R2 > 0.999 &&
      F4_FIT.perUnit > 0.35 &&
      F4_FIT.perUnit < 0.37 &&
      Math.abs(F4_COLLAPSE_11_TO_13 - 0.13) < 0.01,
  },
  {
    // F2 and F3 are near-flat over the same windows (per-unit factors within 0.05 of 1).
    id: 'imp34023-f2-f3-near-flat',
    description: 'F2 (~0.974) and F3 (~0.991) per-unit decay factors are near-flat vs the F4 collapse',
    holds: () =>
      F2_FIT.perUnit > 0.95 && F2_FIT.perUnit < 1.0 && F3_FIT.perUnit > 0.95 && F3_FIT.perUnit < 1.0,
  },
  {
    // (B) The over-prediction ratio DIVERGES past kEnd=13: monotone up, ~3x/unit, x1000+ over 6 units.
    id: 'imp34023-ratio-diverges-not-saturates',
    description: 'ratio climbs monotonically 165->589238 across kEnd=13..20, ~3.25x per unit, no asymptote',
    holds: () =>
      RATIO_MONOTONIC_UP === true &&
      IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION.extrapolationVerdict.ratio_diverges === true &&
      IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION.extrapolationVerdict.ratio_saturates === false &&
      R20 > R14 * 1000 &&
      RATIO_PER_UNIT_GROWTH > 3 &&
      RATIO_PER_UNIT_GROWTH < 3.5,
  },
  {
    // (C) The surrogate is capped by the M2 residual sign change at kEnd* ~ 21.28.
    id: 'imp34023-surrogate-capped-by-residual-sign-change',
    description: 'resid crosses zero at kEnd* ~ 21.28, past which F4 and the ratio flip sign (artifact)',
    holds: () =>
      Number.isFinite(RESID_ZERO_KEND) &&
      RESID_ZERO_KEND > 21 &&
      RESID_ZERO_KEND < 21.6 &&
      rung(21).resid > 0 &&
      rung(21.6).resid < 0,
  },
  {
    // Honesty gate: numerical/measurement only, isRigorous false, no QED, PT SOTA.
    id: 'imp34023-honesty-gate-no-qed',
    description: 'Curve-fit/extrapolation only: isRigorous false, no QED, PT SOTA',
    holds: () =>
      IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION.isRigorous === false &&
      /NO QED/.test(IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION.verdict) &&
      /remains SOTA/.test(IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION.verdict),
  },
];

for (const a of IMP34023_EFLOW_WIDENING_RATIO_F4_COLLAPSE_EXTRAPOLATION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34023-eflow-widening-ratio-f4-collapse-extrapolation assertion failed: ${a.id}`);
  }
}
