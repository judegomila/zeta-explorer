/**
 * imp-96712 -- BASIS-C accelerating-local-exponent MODEL. imp-96690 extended the above-anchor floor
 * ladder to five rungs and fit a SINGLE log-log OLS exponent p ~ 2.42, re-bisecting the corroboration
 * reach to L* ~ 8.1e7. Its HONEST CAVEAT flagged that p ~ 2.42 is a summary, not a law: the consecutive
 * two-point LOCAL exponents accelerate (1.81, 2.81, 2.08, 2.65) as the optimum panels-per-period shifts
 * 3 -> 2, "if anything ... suggesting L* could be tighter still". That caveat was never modeled. This
 * module fits accelerating-exponent floor models to the SAME five committed imp-96690 floor values (no
 * new heavy quadrature runs) and re-bisects L* under each, to BRACKET whether L* actually tightens below
 * ~8.1e7. Measurement / projection only.
 *
 * INPUT (verbatim from imp-96690, the five above-anchor best-achievable floors; theoretical GUE, not real
 * zeros). (L, floor): (5.9e6, 2.8414e-5), (1e7, 7.3978e-5), (2e7, 5.173078e-4), (3e7, 1.203644e-3),
 * (5e7, 4.657430e-3). Local two-point exponents p_i = dlog(floor)/dlog(L): 1.8135, 2.8059, 2.0827, 2.6489.
 *
 * MODELS (all fit here at import; no offline runs). The single OLS power law has a CONSTANT log-log slope
 * p; an accelerating exponent means the slope p(x) = dlog(floor)/dlog(L) rises with x = log L. Three ways
 * to capture that from five points:
 *   A. QUADRATIC-in-log-log: y = a + b x + c x^2 (least squares, 5 rungs). Local exponent p(x) = b + 2 c x
 *      is linear-rising when c > 0. Floor taken raw from the fit.
 *   B. QUADRATIC-in-log-log, ANCHORED so floor(anchor) = 2.8414e-5 exactly (same b, c shape).
 *   C. LINEAR-LOCAL-EXPONENT: p(x) = alpha + beta x fit (OLS) to the four local exponents at their
 *      geometric-midpoint abscissae, then floor(x) = anchorFloor * exp(integral_{x0}^{x} p(u) du),
 *      integral = alpha (x - x0) + (beta/2)(x^2 - x0^2). Anchored at the anchor floor.
 * Each floor(L) rises while the sine-kernel signal |rho + 1/2| shrinks logarithmically, so
 * floor(L) - signal(L) is monotone increasing and has a unique crossover L*, found by bisection (identical
 * signal + bisection to imp-96690).
 *
 * FINDINGS (all re-derived here, not asserted).
 *  1. THE ACCELERATION IS REAL BUT MILD IN L*. Model A gives L* ~ 7.80e7, Model B ~ 7.63e7, Model C
 *     ~ 8.20e7. The imp-96690 constant-OLS baseline is L* ~ 8.08e7. So the three accelerating-exponent
 *     models BRACKET L* in ~[7.6e7, 8.2e7] -- within about +/-6% of the imp-96690 8.1e7 projection. The
 *     "could be tighter still" caveat is therefore BOUNDED: it does not blow the reach down by a decade.
 *  2. QUADRATIC MODELS TIGHTEN MODESTLY; THE INTEGRATED-EXPONENT MODEL DOES NOT. The quadratic-in-log-log
 *     fits (A, B) tighten L* to ~7.6-7.8e7 because their extrapolated local exponent keeps rising past
 *     5e7 (p(5e7) ~ 2.68, p(8e7) ~ 2.80). The linear-local-exponent model (C) instead lands slightly
 *     LOOSER at ~8.20e7: fitting p(x) to the noisy local exponents (which dip to 2.08 at the 2e7 -> 3e7
 *     rung) pulls the near-anchor exponent BELOW 2.42, and the anchored integral of that lower early slope
 *     offsets the steeper late slope. So the direction of the correction depends on the model, and the
 *     honest reading is a BRACKET, not a one-sided tightening.
 *  3. ALL MODELS AGREE ON THE DECADE. Every model puts L* ~1.11-1.14 decades past the PT anchor
 *     L = 5.9e6, at rho ~ -0.484 and floor = signal ~ 1.6e-2. The exponent-shape uncertainty moves L* by
 *     ~6%, i.e. ~0.03 decade -- far smaller than the ~1.5-decade span between the imp-96531 L-linear
 *     (~2.86e9), imp-96568 two-rung (~1.9e8) and imp-96690 five-rung (~8.1e7) projections (that span is
 *     driven by the exponent LEVEL p = 1.0 vs 1.81 vs 2.42, imp-96711, not by its acceleration).
 *
 * HONEST CAVEAT. Every floor is a double-precision quadrature/cancellation artifact of the basis-C direct
 * integral for the THEORETICAL GUE (sine-kernel) two-interval correlation; there are no computed Riemann
 * zeros behind any value. Fitting a three-parameter model to five points (with an optimum-ppp shift baked
 * into them) is itself over-parameterized; the bracket [7.6e7, 8.2e7] is a projection band, not a measured
 * reach. This changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma
 * excursion confidence.
 *
 * VERDICT. Modeling the imp-96690 accelerating local exponent (1.81 -> 2.81 -> 2.08 -> 2.65) explicitly --
 * quadratic-in-log-log (raw and anchored) and integrated linear-local-exponent, all fit to the SAME five
 * committed floors -- brackets the corroboration reach at L* ~ [7.6e7, 8.2e7], within ~+/-6% of the
 * imp-96690 constant-OLS 8.1e7. The acceleration tightens L* only modestly under the quadratic models
 * (~7.6-7.8e7) and slightly loosens it under the integrated-exponent model (~8.2e7); all agree L* is
 * ~1.11-1.14 decades past the PT anchor. The "could be tighter still" caveat is bounded, not a decade.
 * Measurement / projection only; theoretical GUE, not real zeros; changes no bound; RH open; NO QED;
 * no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96690-basis-c-above-anchor-rung-ladder (the five-rung OLS p ~ 2.42 / L* ~ 8.1e7 this models)
 * @see imp-96711-basis-c-corroboration-reach-cross-tab (the three L* figures as one anchored crossover)
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder (the two-rung p ~ 1.81 / L* ~ 1.9e8)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, and the crossover
 * bisection are re-derived verbatim here (identical to imp-96430/imp-96568/imp-96690) so the model is
 * independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const ANCHOR_FLOOR = 2.8414e-5; // imp-96690 best-achievable direct floor at the anchor (ppp = 3)
const IMP96690_OLS_LSTAR = 8.08e7; // imp-96690 constant-OLS five-rung crossover (baseline)
const IMP96690_OLS_EXPONENT = 2.4212; // imp-96690 log-log OLS above-anchor exponent

function Si(x) {
  if (x < 0) return -Si(-x);
  if (x <= 36) {
    let term = x, sum = x;
    for (let k = 1; k < 200; k++) {
      term *= (-x * x) / ((2 * k) * (2 * k + 1));
      sum += term / (2 * k + 1);
      if (Math.abs(term) < 1e-18 * Math.abs(sum) && k > 5) break;
    }
    return sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return PI / 2 - f * Math.cos(x) - g * Math.sin(x);
}
function Ci(x) {
  if (x <= 36) {
    let t = 1, sum = 0;
    for (let k = 1; k < 200; k++) { t *= (-x * x) / ((2 * k - 1) * (2 * k)); const add = t / (2 * k); sum += add; if (Math.abs(add) < 1e-18 * Math.abs(sum) && k > 5) break; }
    return EULER + Math.log(x) + sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return f * Math.sin(x) - g * Math.cos(x);
}

const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;
const signalOf = (L) => Math.abs(rhoExact(L) - RIGIDITY_LIMIT); // |rho + 1/2|

// The five committed imp-96690 above-anchor best-achievable floors (verbatim; theoretical GUE).
const rungs = [
  { L: PT_ANCHOR_L, floor: ANCHOR_FLOOR },
  { L: 1e7, floor: 7.3978e-5 },
  { L: 2e7, floor: 5.173078e-4 },
  { L: 3e7, floor: 1.203644e-3 },
  { L: 5e7, floor: 4.657430e-3 },
];
const xs = rungs.map((r) => Math.log(r.L));
const ys = rungs.map((r) => Math.log(r.floor));

// Consecutive two-point local exponents at geometric-midpoint abscissae.
const localExponents = [];
for (let i = 1; i < rungs.length; i++) {
  localExponents.push({
    xMid: (xs[i] + xs[i - 1]) / 2,
    p: (ys[i] - ys[i - 1]) / (xs[i] - xs[i - 1]),
  });
}

// --- Model A: quadratic-in-log-log least squares y = a + b x + c x^2 over five rungs.
function quadFit(px, py) {
  const n = px.length;
  let S0 = n, S1 = 0, S2 = 0, S3 = 0, S4 = 0, T0 = 0, T1 = 0, T2 = 0;
  for (let i = 0; i < n; i++) {
    const x = px[i], y = py[i];
    S1 += x; S2 += x * x; S3 += x ** 3; S4 += x ** 4;
    T0 += y; T1 += x * y; T2 += x * x * y;
  }
  const M = [[S0, S1, S2], [S1, S2, S3], [S2, S3, S4]];
  const v = [T0, T1, T2];
  for (let i = 0; i < 3; i++) {
    const piv = M[i][i];
    for (let j = i; j < 3; j++) M[i][j] /= piv;
    v[i] /= piv;
    for (let k = 0; k < 3; k++) {
      if (k === i) continue;
      const f = M[k][i];
      for (let j = i; j < 3; j++) M[k][j] -= f * M[i][j];
      v[k] -= f * v[i];
    }
  }
  return { a: v[0], b: v[1], c: v[2] };
}
const quad = quadFit(xs, ys);
const floorQuad = (L) => { const x = Math.log(L); return Math.exp(quad.a + quad.b * x + quad.c * x * x); };
const localExpQuadAt = (L) => { const x = Math.log(L); return quad.b + 2 * quad.c * x; }; // linear-rising if c > 0

// --- Model B: same quadratic shape, anchored so floor(anchor) = ANCHOR_FLOOR exactly.
const x0 = Math.log(PT_ANCHOR_L);
const floorQuadAnchored = (L) => {
  const x = Math.log(L);
  return ANCHOR_FLOOR * Math.exp(quad.b * (x - x0) + quad.c * (x * x - x0 * x0));
};

// --- Model C: linear-local-exponent p(x) = alpha + beta x fit to the four local exponents, then
// anchored floor(x) = ANCHOR_FLOOR * exp( integral_{x0}^{x} p(u) du ).
function linFit(px, py) {
  const n = px.length;
  const mx = px.reduce((a, b) => a + b, 0) / n;
  const my = py.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (px[i] - mx) * (py[i] - my); sxx += (px[i] - mx) ** 2; }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}
const expFit = linFit(localExponents.map((l) => l.xMid), localExponents.map((l) => l.p));
const localExpLinAt = (x) => expFit.intercept + expFit.slope * x;
const floorLinExp = (L) => {
  const x = Math.log(L);
  const integ = expFit.intercept * (x - x0) + (expFit.slope / 2) * (x * x - x0 * x0);
  return ANCHOR_FLOOR * Math.exp(integ);
};

// Crossover bisection (identical signal + bracket to imp-96690).
function crossoverL(floorFn) {
  let lo = PT_ANCHOR_L, hi = 1e14;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (floorFn(mid) - signalOf(mid) > 0) hi = mid;
    else lo = mid;
  }
  return Math.sqrt(lo * hi);
}

const lstarQuad = crossoverL(floorQuad);
const lstarQuadAnchored = crossoverL(floorQuadAnchored);
const lstarLinExp = crossoverL(floorLinExp);
const bracketLo = Math.min(lstarQuad, lstarQuadAnchored, lstarLinExp);
const bracketHi = Math.max(lstarQuad, lstarQuadAnchored, lstarLinExp);
const spanVsOls = (bracketHi - bracketLo) / IMP96690_OLS_LSTAR; // ~0.07 (fraction of the OLS L*)
const decadesLo = Math.log10(bracketLo / PT_ANCHOR_L);
const decadesHi = Math.log10(bracketHi / PT_ANCHOR_L);

export const IMP96712_BASIS_C_ACCELERATING_EXPONENT_MODEL = {
  ticket: 'imp-96712',
  source:
    'imp-96690 fit a SINGLE log-log OLS exponent p ~ 2.42 to five above-anchor basis-C floors and bisected '
    + 'the corroboration reach to L* ~ 8.1e7, but its honest caveat flagged that the consecutive LOCAL '
    + 'exponents accelerate (1.81, 2.81, 2.08, 2.65), suggesting L* could be tighter still. This module fits '
    + 'accelerating-exponent floor models (quadratic-in-log-log raw/anchored, and integrated linear-local-'
    + 'exponent) to the SAME five committed floors -- no new heavy quadrature runs -- and re-bisects L* under '
    + 'each to BRACKET whether L* actually tightens below ~8.1e7. Measurement / projection only; theoretical '
    + 'GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  anchorFloor: ANCHOR_FLOOR,
  rungs,
  localExponents: localExponents.map((l) => l.p), // 1.8135, 2.8059, 2.0827, 2.6489
  models: {
    quadRaw: {
      coeffs: quad, // a, b, c of y = a + b x + c x^2
      floorAtAnchor: floorQuad(PT_ANCHOR_L),
      localExpAt5e7: localExpQuadAt(5e7),
      localExpAt8e7: localExpQuadAt(8e7),
      lstar: lstarQuad, // ~7.80e7
    },
    quadAnchored: {
      floorAtAnchor: floorQuadAnchored(PT_ANCHOR_L), // = ANCHOR_FLOOR by construction
      lstar: lstarQuadAnchored, // ~7.63e7
    },
    linLocalExponent: {
      pOfX: { alpha: expFit.intercept, beta: expFit.slope }, // p(x) = alpha + beta x
      localExpAt8e7: localExpLinAt(Math.log(8e7)),
      lstar: lstarLinExp, // ~8.20e7
    },
  },
  bracket: {
    lo: bracketLo, // ~7.63e7
    hi: bracketHi, // ~8.20e7
    imp96690OlsBaseline: IMP96690_OLS_LSTAR, // ~8.08e7 (inside the bracket)
    spanFractionOfOls: spanVsOls, // ~0.07 (~+/-6% band)
    decadesPastAnchorLo: decadesLo, // ~1.11
    decadesPastAnchorHi: decadesHi, // ~1.14
    note:
      'The three accelerating-exponent models bracket L* in ~[7.6e7, 8.2e7], within ~+/-6% of the imp-96690 '
      + 'constant-OLS 8.1e7. The quadratic-in-log-log fits (raw, anchored) tighten L* modestly to ~7.6-7.8e7 '
      + 'because their extrapolated local exponent keeps rising past 5e7 (p(8e7) ~ 2.80); the integrated linear-'
      + 'local-exponent model lands slightly LOOSER at ~8.2e7 because fitting p(x) to the noisy local exponents '
      + 'pulls the near-anchor slope below 2.42 and the anchored integral offsets the steeper late slope. So the '
      + 'direction of the correction is model-dependent -- an honest BRACKET, not a one-sided tightening. All '
      + 'models agree L* is ~1.11-1.14 decades past the PT anchor; the ~6% exponent-shape uncertainty (~0.03 '
      + 'decade) is far smaller than the ~1.5-decade span between the imp-96531/imp-96568/imp-96690 projections, '
      + 'which is driven by the exponent LEVEL (p = 1.0 vs 1.81 vs 2.42), not its acceleration.',
  },
  caveat:
    'Every floor is a double-precision quadrature/cancellation artifact of the basis-C direct integral for the '
    + 'theoretical GUE (sine-kernel) two-interval correlation; there are no computed Riemann zeros behind any '
    + 'value. Fitting a three-parameter model to five points (with an optimum-ppp shift baked into them) is '
    + 'over-parameterized; the bracket [7.6e7, 8.2e7] is a projection band, not a measured reach. Changes no '
    + 'bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Modeling the imp-96690 accelerating local exponent (1.81 -> 2.81 -> 2.08 -> 2.65) explicitly -- quadratic-'
    + 'in-log-log (raw and anchored) and integrated linear-local-exponent, all fit to the SAME five committed '
    + 'floors -- brackets the corroboration reach at L* ~ [7.6e7, 8.2e7], within ~+/-6% of the imp-96690 '
    + 'constant-OLS 8.1e7. The acceleration tightens L* only modestly under the quadratic models (~7.6-7.8e7) '
    + 'and slightly loosens it under the integrated-exponent model (~8.2e7); all agree L* is ~1.11-1.14 decades '
    + 'past the PT anchor. The "could be tighter still" caveat is bounded, not a decade. Measurement / '
    + 'projection only; theoretical GUE, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed'
    + '; the zero-side route stays PCC/GRH-gated.',
};

export const IMP96712_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement / projection only: rho is the theoretical GUE '
  + 'two-interval correlation, not computed from real zeros. Modeling the imp-96690 accelerating local exponent '
  + '(quadratic-in-log-log raw/anchored + integrated linear-local-exponent, fit to the same five committed '
  + 'floors) brackets the projected corroboration reach at L* ~ [7.6e7, 8.2e7] -- within ~+/-6% of the '
  + 'constant-OLS 8.1e7; the "could be tighter still" caveat is bounded, not a decade. Changes no bound.';

// --- self-executing internal-consistency assertions (local-exponent recompute + fits + bisection) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96712: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96712: Ci(1) drifted from reference');

  // the recomputed local exponents reproduce the imp-96690 caveat values 1.81, 2.81, 2.08, 2.65
  const ref = [1.8135, 2.8059, 2.0827, 2.6489];
  for (let i = 0; i < ref.length; i++) {
    if (!approx(localExponents[i].p, ref[i], 1e-3))
      throw new Error('imp-96712: recomputed local exponent drifted from the imp-96690 value');
  }

  // the quadratic is accelerating (c > 0) and its extrapolated exponent rises past 5e7
  if (!(quad.c > 0)) throw new Error('imp-96712: quadratic-in-log-log should be convex (accelerating, c > 0)');
  if (!(localExpQuadAt(8e7) > localExpQuadAt(5e7)))
    throw new Error('imp-96712: extrapolated quadratic local exponent should rise with L');

  // all three model crossovers land in the [7.6e7, 8.2e7] band, bracketing the imp-96690 OLS baseline
  for (const Ls of [lstarQuad, lstarQuadAnchored, lstarLinExp]) {
    if (!(Ls > 7e7 && Ls < 8.5e7)) throw new Error('imp-96712: a model crossover fell outside the ~[7.6e7,8.2e7] band');
  }
  if (!(bracketLo <= IMP96690_OLS_LSTAR && IMP96690_OLS_LSTAR <= bracketHi))
    throw new Error('imp-96712: the imp-96690 OLS baseline should sit inside the accelerating-model bracket');
  if (!(spanVsOls < 0.12))
    throw new Error('imp-96712: the exponent-shape bracket should be a narrow ~+/-6% band, not a decade');
  if (!(decadesLo > 1.0 && decadesHi < 1.2))
    throw new Error('imp-96712: all models should place L* ~1.11-1.14 decades past the PT anchor');

  // the quadratic models tighten below the OLS baseline; the integrated-exponent model does not
  if (!(lstarQuad < IMP96690_OLS_LSTAR && lstarQuadAnchored < IMP96690_OLS_LSTAR))
    throw new Error('imp-96712: quadratic models should tighten L* below the OLS baseline');
  if (!(lstarLinExp > IMP96690_OLS_LSTAR))
    throw new Error('imp-96712: integrated linear-local-exponent model should not tighten below the OLS baseline');

  // honesty gates
  if (!/NO QED/.test(IMP96712_BASIS_C_ACCELERATING_EXPONENT_MODEL.verdict))
    throw new Error('imp-96712: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96712_BASIS_C_ACCELERATING_EXPONENT_MODEL.verdict))
    throw new Error('imp-96712: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96690/.test(IMP96712_BASIS_C_ACCELERATING_EXPONENT_MODEL.source))
    throw new Error('imp-96712: source dropped the imp-96690 reference');
  if (!(/RH open/.test(IMP96712_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96712_HONEST_BANNER) && /NO QED/.test(IMP96712_HONEST_BANNER)))
    throw new Error('imp-96712: IMP96712_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96712_BASIS_C_ACCELERATING_EXPONENT_MODEL;
