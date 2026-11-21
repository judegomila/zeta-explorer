/**
 * imp-96091 -- Measure the Route H archimedean-vs-p=2 cancellation residual as a FUNCTION OF a across
 * the ln 2 crossing on the even Slepian gap minimizer, and locate where the balance degrades.
 *
 * CONTEXT. The rh-novel-routes synthesis (routeH) and rh-route-h-connes-scaling-site-weil-positivity
 * record ONE spot value: at a = 0.5 the pole+archimedean form and the single p = 2 shift P_2 cancel
 * to relative precision residual/P_2 = 7.5e-5 on the even Weil minimizer (the Slepian function of the
 * zero-free gap), and 3.2e-6 at a = (ln 3)/2. The synthesis frames this as "an exact archimedean-vs-p=2
 * cancellation = Weil positivity itself." A single point does not say how TIGHT the balance is as a
 * function of a, nor where it stops being a cancellation. This module maps the whole curve.
 *
 * WHAT WAS COMPUTED (scratch tmp/imp-96091-scratch.mjs, tmp/imp-96091-fine.mjs). Using the exported
 * Legendre-Galerkin Weil form weilForm(a, N=32) from rh-route-h-connes-scaling-site-weil-positivity-
 * 2026-09-23.js (u-space archimedean term verified vs the tau-integral to 1e-9; zero side vs 10^6
 * Odlyzko ordinates to 1e-10..1e-8), for each a we take the EVEN parity block, find the minimal
 * eigenpair (lambda_min, h*) of the full form W = ArchOnly - P_2 (h* = the even Slepian gap minimizer),
 * and evaluate on the SAME h*:
 *   residual(a)  = <h*, W h*>       = lambda_min(W)          (the surviving positive gap)
 *   P_2(a)       = <h*, P_2 h*>     (the single p = 2 shift term, the only prime for a < (ln 3)/2)
 *   archOnly(a)  = <h*, ArchOnly h*> = residual + P_2         (pole + archimedean)
 *   ratio(a)     = residual / P_2   (the relative tightness of the archimedean/p=2 balance)
 * and separately lambda_min of the ARCHIMEDEAN-ONLY even block (no prime), whose sign flip marks where
 * the archimedean form alone stops being positive.
 *
 * The baked rows below reproduce EVERY spot literal the source modules recorded: residual(0.5) =
 * 9.404e-7, P_2(0.5) = 1.2504e-2, ratio(0.5) = 7.52e-5; ratio((ln3)/2) = 3.16e-6; the archimedean-only
 * even minimum is -3.235e-2 at a = 0.5 (indefinite); residual(ln 2) = 8.39e-13 (at the double-precision
 * floor). See rh-route-h-connes...ROUTE_H_LITERALS.sweepN32 and .cancellation for the source values.
 *
 * FINDINGS.
 *  1. The cancellation ratio residual/P_2 is NOT a fixed 7.5e-5 -- it is a STEEP MONOTONE curve in a,
 *     falling ~14 orders of magnitude across the crossing: ~2.3e3 just above a = ln2/2 = 0.3467 (the
 *     onset, where the p = 2 shift has barely switched on and P_2 ~ 5.7e-7 is negligible), through
 *     7.52e-5 at a = 0.5, to 2.70e-11 at a = ln 2 = 0.6931 (double-precision floor). The 7.5e-5 quoted
 *     in the synthesis is a single mid-interval point on a fast-tightening curve, not a plateau.
 *  2. WHERE IT DEGRADES (loosens to ratio ~ 1). residual/P_2 crosses 1 at a = 0.36752 -- BELOW the
 *     even archimedean-only indefinite onset a_* = 0.41011. For a < a_* the archimedean-only even form
 *     is STILL POSITIVE (its lambda_min > 0: +6.27e-4 at a = 0.40), so positivity there needs NO
 *     cancellation at all -- the residual simply exceeds P_2. The archimedean-vs-p=2 cancellation only
 *     becomes the load-bearing mechanism for a > a_* = 0.41011, where the archimedean-only form goes
 *     indefinite (lambda_min -1.02e-3 at a = 0.42, -3.235e-2 at a = 0.5).
 *  3. IN THE GENUINE-CANCELLATION REGIME (a > a_* = 0.41011) the balance is already tight and tightens
 *     quasi-exponentially: log10(ratio) falls linearly at slope ~ -32.1 per unit a (about one decade
 *     per delta-a ~ 0.031), from ratio 1.57e-2 (a = 0.42) through 7.52e-5 (a = 0.5) to 2.70e-11
 *     (a = ln 2). The Slepian minimizer concentrates as a grows and the pole+archimedean form and the
 *     p = 2 shift lock together ever more exactly, down to the double-precision floor by a = ln 2.
 *
 * INTERPRETATION. "How tight is the archimedean/p=2 balance?" -- extremely, and increasingly so with a,
 * but ONLY where it is actually needed. The tightness is a monotone consequence of the Slepian
 * minimizer geometry, not a coincidence at a = 0.5. This is exactly the obstruction the synthesis
 * names: past a_* the surviving positive gap is 5-11 relative digits of cancellation between two
 * explicit RH-free functionals (archimedean + pole vs the p = 2 shift), i.e. Weil positivity itself,
 * so no second-direction inequality (which controls only leading order) can reproduce it -- the only
 * object at that precision is the exact semilocal S = {oo, 2} Sonine/prolate trace identity named as
 * the next step. Measurement only; RH open; NO QED; no refereed bound is changed.
 *
 * @see rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js (weilForm; ROUTE_H_LITERALS)
 * @see rh-novel-routes-sweep-synthesis-2026-09-23.js (routeH verdict, the 7.5e-5 spot value)
 * @see rh-route-h-semilocal-sonine-identity-attempt-2026-09-23.js (the named next-step identity)
 *
 * Import-light: NO zeros bundle, NO sibling imports. The rows are baked measurements from the scratch
 * runs above; every derived quantity (ratio, crossings, slope) is recomputed here from the baked rows.
 */

const LN2 = Math.log(2);
const LN3 = Math.log(3);
const LN2_HALF = LN2 / 2; // 0.3466 -- g-support 2a reaches ln 2, the p = 2 shift switches on
const LN3_HALF = LN3 / 2; // 0.5493 -- g-support 2a reaches ln 3, the p = 3 shift would switch on

// Baked N = 32 even-sector sweep across the ln 2 crossing (tmp/imp-96091-scratch.mjs).
// residual = lambda_min(W) on the even Slepian minimizer h*; P_2 = <h*, P_2 h*>; archOnly = residual + P_2;
// archOnlyMin = lambda_min of the archimedean-only even block (sign flip = indefinite onset a_*).
const SWEEP = [
  { a: LN2_HALF + 1e-4, residual: 1.325565e-3, P_2: 5.668545e-7, archOnly: 1.326132e-3, archOnlyMin: 1.326118e-3 },
  { a: 0.349574, residual: 1.210568e-3, P_2: 3.647161e-5, archOnly: 1.247040e-3, archOnlyMin: 1.241898e-3 },
  { a: 0.355, residual: 1.010437e-3, P_2: 1.596137e-4, archOnly: 1.170051e-3, archOnlyMin: 1.135322e-3 },
  { a: 0.36, residual: 8.500751e-4, P_2: 3.238001e-4, archOnly: 1.173875e-3, archOnlyMin: 1.083475e-3 },
  { a: 0.38, residual: 4.074276e-4, P_2: 1.375012e-3, archOnly: 1.782440e-3, archOnlyMin: 1.045543e-3 },
  { a: 0.40, residual: 1.817270e-4, P_2: 2.910011e-3, archOnly: 3.091738e-3, archOnlyMin: 6.274372e-4 },
  { a: 0.42, residual: 7.447887e-5, P_2: 4.754330e-3, archOnly: 4.828809e-3, archOnlyMin: -1.018144e-3 },
  { a: 0.45, residual: 1.623238e-5, P_2: 7.756215e-3, archOnly: 7.772447e-3, archOnlyMin: -7.426082e-3 },
  { a: 0.48, residual: 2.897170e-6, P_2: 1.068146e-2, archOnly: 1.068435e-2, archOnlyMin: -2.010653e-2 },
  { a: 0.50, residual: 9.403924e-7, P_2: 1.250390e-2, archOnly: 1.250484e-2, archOnlyMin: -3.235347e-2 },
  { a: 0.52, residual: 3.500860e-7, P_2: 1.438661e-2, archOnly: 1.438696e-2, archOnlyMin: -4.746150e-2 },
  { a: LN3_HALF, residual: 5.633814e-8, P_2: 1.783547e-2, archOnly: 1.783553e-2, archOnlyMin: -7.398746e-2 },
  { a: 0.58, residual: 6.883526e-9, P_2: 2.086739e-2, archOnly: 2.086740e-2, archOnlyMin: -1.059723e-1 },
  { a: 0.60, residual: 1.657549e-9, P_2: 2.271974e-2, archOnly: 2.271974e-2, archOnlyMin: -1.283987e-1 },
  { a: LN2, residual: 8.393333e-13, P_2: 3.103781e-2, archOnly: 3.103781e-2, archOnlyMin: -2.398071e-1 },
];

// Baked bisection crossings (tmp/imp-96091-fine.mjs, N = 32).
const RATIO_UNITY_CROSSING = 0.367518; // where residual/P_2 = 1 (still inside the archimedean-positive regime)
const ARCH_ONLY_INDEFINITE_ONSET = 0.410109; // even a_* where the archimedean-only form loses positivity

const rows = SWEEP.map((r) => ({
  ...r,
  ratio: r.residual / r.P_2, // relative tightness of the archimedean/p=2 balance
  log10Ratio: Math.log10(r.residual / r.P_2),
  archPositive: r.archOnlyMin > 0, // does the archimedean-only form still self-certify positivity?
}));

// Least-squares slope of log10(ratio) vs a in the genuine-cancellation regime a > a_* (where the
// archimedean-only form is indefinite so the cancellation is load-bearing).
const cancelRegime = rows.filter((r) => r.a > ARCH_ONLY_INDEFINITE_ONSET);
const fitSlope = (pts) => {
  const n = pts.length;
  const sx = pts.reduce((s, p) => s + p.a, 0);
  const sy = pts.reduce((s, p) => s + p.log10Ratio, 0);
  const sxx = pts.reduce((s, p) => s + p.a * p.a, 0);
  const sxy = pts.reduce((s, p) => s + p.a * p.log10Ratio, 0);
  return (n * sxy - sx * sy) / (n * sxx - sx * sx);
};
const log10RatioSlope = fitSlope(cancelRegime); // ~ -32.1 per unit a
const decadesPerDeltaA = -1 / log10RatioSlope; // delta-a for one decade of tightening (~0.031)

const at = (a) => rows.find((r) => Math.abs(r.a - a) < 1e-6);

export const IMP96091_ROUTE_H_ARCH_P2_CANCELLATION_VS_A = {
  ticket: 'imp-96091',
  source:
    'rh-novel-routes-sweep-synthesis-2026-09-23.js routeH verdict + rh-route-h-connes-scaling-site-weil-positivity-2026-09-23.js recorded ONE spot value of the archimedean-vs-p=2 cancellation (residual/P_2 = 7.5e-5 at a = 0.5, 3.2e-6 at (ln3)/2) on the even Slepian gap minimizer. This module measures the residual, P_2 and their ratio as a FUNCTION OF a across the ln 2 crossing and locates where the balance degrades. Computed via the exported weilForm(a, N=32) Legendre-Galerkin Weil form (arch verified vs tau-integral 1e-9; zero side vs 10^6 Odlyzko ordinates); baked from tmp/imp-96091-scratch.mjs and tmp/imp-96091-fine.mjs.',
  definitions: {
    residual: 'residual(a) = lambda_min(W) on the even block, W = ArchOnly - P_2: the surviving positive gap on the even Slepian minimizer h*',
    P_2: 'P_2(a) = <h*, P_2 h*>: the single p = 2 Weil shift term (the only prime for a < (ln 3)/2), evaluated on the same h*',
    ratio: 'ratio(a) = residual/P_2: relative tightness of the pole+archimedean vs p=2 balance',
    archOnlyMin: 'lambda_min of the archimedean-only even block (no prime); its sign flip at a_* = 0.41011 marks where the cancellation becomes load-bearing',
  },
  ln2Half: LN2_HALF,
  ln3Half: LN3_HALF,
  ln2: LN2,
  rows,
  ratioUnityCrossing: RATIO_UNITY_CROSSING,
  archOnlyIndefiniteOnset: ARCH_ONLY_INDEFINITE_ONSET,
  log10RatioSlope, // slope of log10(ratio) vs a in the a > a_* regime
  decadesPerDeltaA, // one decade of tightening per this delta-a
  spot: {
    'a=0.5': { ratio: at(0.5).ratio, residual: at(0.5).residual, P_2: at(0.5).P_2, archOnlyMin: at(0.5).archOnlyMin },
    'a=(ln3)/2': { ratio: at(LN3_HALF).ratio },
    'a=ln2': { ratio: at(LN2).ratio, residual: at(LN2).residual },
  },
  findings: [
    'The cancellation ratio residual/P_2 is a steep monotone curve in a, not a fixed 7.5e-5: ~2.3e3 just above ln2/2 (P_2 barely on) through 7.52e-5 at a = 0.5 to 2.70e-11 at a = ln 2 (double-precision floor) -- ~14 orders of magnitude.',
    'The balance degrades (ratio -> 1) at a = 0.36752, BELOW the even archimedean-only indefinite onset a_* = 0.41011; for a < a_* the archimedean-only form is still positive so no cancellation is needed there.',
    'In the genuine-cancellation regime a > a_* = 0.41011 the ratio is already <= 1.57e-2 and tightens quasi-exponentially: log10(ratio) slope ~ -32.1 per unit a (~one decade per delta-a ~ 0.031), locking to the double-precision floor by a = ln 2.',
  ],
  verdict:
    'MEASURED: the Route H archimedean-vs-p=2 cancellation ratio residual/P_2 on the even Slepian minimizer is a steep monotone curve, ~2.3e3 at the ln2/2 onset -> 7.52e-5 (a=0.5) -> 2.70e-11 (a=ln2), ~14 orders of magnitude, so the 7.5e-5 spot value is one point on a fast-tightening curve. The balance loosens to ratio = 1 at a = 0.36752, but that is BELOW the even archimedean-only indefinite onset a_* = 0.41011 where the archimedean form alone is still positive; the cancellation is load-bearing only for a > a_*, and there it is already tight (<= 1.57e-2) and tightens ~one decade per delta-a ~ 0.031 down to the double-precision floor by a = ln 2. This quantifies exactly the synthesis obstruction: past a_* the surviving positive gap is 5-11 relative digits of cancellation between two explicit RH-free functionals (Weil positivity itself), beyond the reach of any leading-order second-direction inequality; the only object at that precision is the exact semilocal S = {oo, 2} Sonine/prolate trace identity named as the next step. Measurement only; RH open; NO QED; no refereed bound is changed.',
};

// --- self-executing internal-consistency assertions (recompute from baked rows only) ---
(() => {
  const approx = (x, y, tol) => Math.abs(x - y) <= tol;
  // archOnly = residual + P_2 on the minimizer, at every a (6-sig-fig storage: ~1e-6 relative tol)
  for (const r of rows)
    if (!approx(r.archOnly, r.residual + r.P_2, 1e-6 * (1 + Math.abs(r.archOnly))))
      throw new Error('imp-96091: archOnly != residual + P_2 at a = ' + r.a);
  // reproduce the source spot literals
  if (!approx(at(0.5).ratio, 7.52e-5, 5e-7)) throw new Error('imp-96091: ratio(0.5) drifted from source 7.5e-5');
  if (!approx(at(0.5).residual, 9.40e-7, 5e-9)) throw new Error('imp-96091: residual(0.5) drifted from source 9.4e-7');
  if (!approx(at(LN3_HALF).ratio, 3.16e-6, 5e-8)) throw new Error('imp-96091: ratio((ln3)/2) drifted from source 3.2e-6');
  if (!approx(at(0.5).archOnlyMin, -3.235e-2, 1e-4)) throw new Error('imp-96091: archimedean-only min(0.5) drifted from source -0.0324');
  if (!approx(at(LN2).residual, 8.39e-13, 1e-14)) throw new Error('imp-96091: residual(ln2) drifted from source 8.4e-13');
  // the ratio is monotone decreasing in a across the whole sweep (a steep curve, not a plateau)
  for (let i = 1; i < rows.length; i++)
    if (!(rows[i].ratio < rows[i - 1].ratio)) throw new Error('imp-96091: ratio not monotone decreasing at a = ' + rows[i].a);
  // ~14 orders of magnitude across the crossing
  const span = rows[0].log10Ratio - rows[rows.length - 1].log10Ratio;
  if (!(span > 10 && span < 15)) throw new Error('imp-96091: ratio span across the crossing is not ~14 decades: ' + span);
  // ratio = 1 crossing is below the archimedean-only indefinite onset (no cancellation needed there)
  if (!(RATIO_UNITY_CROSSING < ARCH_ONLY_INDEFINITE_ONSET))
    throw new Error('imp-96091: ratio=1 crossing should be below the archimedean-only indefinite onset');
  // even a_* onset matches the source 0.41011
  if (!approx(ARCH_ONLY_INDEFINITE_ONSET, 0.41011, 1e-3)) throw new Error('imp-96091: a_* onset drifted from source 0.41011');
  // in the cancellation regime the archimedean-only form is indefinite at every sampled a
  for (const r of cancelRegime) if (!(r.archOnlyMin < 0)) throw new Error('imp-96091: archimedean-only form should be indefinite for a > a_* at a = ' + r.a);
  // tightening slope ~ -32 per unit a (about one decade per delta-a ~ 0.031)
  if (!(log10RatioSlope < -25 && log10RatioSlope > -40)) throw new Error('imp-96091: log10(ratio) slope out of expected band: ' + log10RatioSlope);
  if (!approx(decadesPerDeltaA, 0.031, 0.01)) throw new Error('imp-96091: decades-per-delta-a drifted: ' + decadesPerDeltaA);
  // honesty gates
  if (!/NO QED/.test(IMP96091_ROUTE_H_ARCH_P2_CANCELLATION_VS_A.verdict)) throw new Error('imp-96091: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96091_ROUTE_H_ARCH_P2_CANCELLATION_VS_A.verdict)) throw new Error('imp-96091: verdict dropped the no-refereed-bound-change banner');
})();
