/**
 * imp-96735 -- MODEL-SELECTION ROBUSTNESS of the imp-96712 L* bracket [7.6e7, 8.2e7] under LEAVE-ONE-OUT
 * on the five committed imp-96690 above-anchor floor rungs.
 *
 * imp-96712 fit three accelerating-exponent floor models (A quadratic-in-log-log raw, B quadratic anchored,
 * C integrated linear-local-exponent) to the SAME five imp-96690 floors and re-bisected the corroboration
 * reach to a ~+/-6% band L* ~ [7.6e7, 8.2e7] around the imp-96690 constant-OLS baseline 8.08e7. Its HONEST
 * CAVEAT flagged that fitting a three-parameter model to only five points (with an optimum-ppp shift baked
 * in) is over-parameterized. That over-parameterization was never quantified. This module re-analyses the
 * SAME baked floors (no new heavy quadrature) by (1) leave-one-out / jackknife -- dropping each of the five
 * rungs, refitting models A/B/C on the remaining four, and recording the induced L* spread -- and (2) an
 * AIC/BIC/AICc comparison of the three-parameter quadratic against the single-slope OLS baseline.
 *
 * INPUT (verbatim from imp-96690 / imp-96712; theoretical GUE sine-kernel, NOT real zeros). (L, floor):
 * (5.9e6, 2.8414e-5), (1e7, 7.3978e-5), (2e7, 5.173078e-4), (3e7, 1.203644e-3), (5e7, 4.657430e-3).
 * Local two-point log-log exponents: 1.8135, 2.8059, 2.0827, 2.6489.
 *
 * FINDINGS (all re-derived here at import; the same Si/Ci/sigma2/rho/crossover machinery as imp-96712).
 *  1. THE [7.6e7, 8.2e7] BAND UNDERSTATES THE MODEL-SELECTION UNCERTAINTY. Across the 15 leave-one-out
 *     refits (5 drops x 3 models) L* spans ~[6.96e7, 8.71e7] -- a hi/lo ratio of ~1.25 (~0.10 decade),
 *     roughly 4x wider than the ~+/-6% full-data bracket. The reach is therefore NOT robust to dropping a
 *     single rung; the tight full-data band is an artifact of using all five points at once.
 *  2. THE DOMINANT LEVERAGE POINT IS THE ANCHOR RUNG (5.9e6), NOT THE 2e7 -> 3e7 DIP. The ticket
 *     hypothesized the 2e7 -> 3e7 rung (local exponent dips to 2.08) as the likely leverage point; the data
 *     says otherwise. Dropping the 2e7 or 3e7 rung leaves L* near [7.3e7, 7.9e7] (mild). The WIDE
 *     excursions come from the endpoints: dropping the ANCHOR rung flips the quadratic curvature from
 *     accelerating (c = +0.12) to DECELERATING (c = -0.13), pushing model A UP to ~8.71e7 while the anchored
 *     models B/C collapse to ~6.96e7-7.16e7; dropping the TOP rung (5e7) splits the models the other way
 *     (A/B down to ~7.1e7, C up to ~8.63e7). So the endpoints, not the mid dip, drive the spread.
 *  3. AIC/BIC DO NOT JUSTIFY THE THREE-PARAMETER QUADRATIC OVER THE OLS BASELINE. On the five points, the
 *     quadratic lowers RSS only modestly (6.58e-2 -> 4.96e-2). Plain AIC and BIC BOTH slightly prefer the
 *     simpler single-slope OLS (dAIC = +0.59, dBIC = +0.20, both favouring OLS), and the small-sample
 *     corrected AICc (n = 5, k = 3 leaves n-k-1 = 1) REJECTS the quadratic outright (dAICc = +18.6). This
 *     quantifies the imp-96712 over-parameterization caveat: the acceleration is not statistically
 *     supported at five points; the OLS L* ~ 8.08e7 is the defensible point estimate.
 *  4. THE ~1-DECADE REACH CONCLUSION SURVIVES; THE TIGHT BAND DOES NOT. Every one of the 15 refits still
 *     places L* at ~1.07-1.17 decades past the PT anchor L = 5.9e6. So imp-96712 FINDING 3 ("all models
 *     agree on the decade") is robust to leave-one-out, but its FINDING 1 tight +/-6% bracket is not -- the
 *     honest model-selection band is ~[7.0e7, 8.7e7] (~+/-9% around 8.08e7), not [7.6e7, 8.2e7].
 *
 * HONEST CAVEAT. Same as imp-96712: every floor is a double-precision quadrature/cancellation artifact of
 * the basis-C direct integral for the THEORETICAL GUE two-interval correlation; no computed Riemann zeros
 * back any value. Leave-one-out on five points is itself statistically thin (each refit uses four points),
 * so the [7.0e7, 8.7e7] envelope is a sensitivity band, not a confidence interval. This changes no bound,
 * establishes no operator positivity, and does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. Leave-one-out / jackknife over the five committed imp-96690 floors, refitting models A/B/C each
 * time, spreads L* across ~[6.96e7, 8.71e7] (hi/lo ~1.25), ~4x wider than the imp-96712 full-data +/-6%
 * band [7.6e7, 8.2e7]; the dominant leverage is the ANCHOR and TOP rungs (dropping the anchor flips the
 * quadratic to decelerating), NOT the 2e7 -> 3e7 dip the ticket suspected. AIC, BIC and especially the
 * small-sample AICc all prefer the single-slope OLS baseline over the three-parameter quadratic
 * (dAIC = +0.6, dBIC = +0.2, dAICc = +18.6), confirming the imp-96712 over-parameterization caveat. The
 * ~1.07-1.17-decade-past-anchor reach conclusion is robust; the tight +/-6% bracket is not. Re-analysis of
 * baked data only; theoretical GUE, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96712-basis-c-accelerating-exponent-model (the +/-6% bracket this stress-tests)
 * @see imp-96690-basis-c-above-anchor-rung-ladder (the five committed floors + OLS L* ~ 8.08e7)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, and the crossover
 * bisection are re-derived verbatim here (identical to imp-96712) so the re-analysis is independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const ANCHOR_FLOOR = 2.8414e-5;
const IMP96690_OLS_LSTAR = 8.08e7;
const IMP96712_BRACKET_LO = 7.63e7;
const IMP96712_BRACKET_HI = 8.20e7;

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
const signalOf = (L) => Math.abs(rhoExact(L) - RIGIDITY_LIMIT);

// The five committed imp-96690 above-anchor best-achievable floors (verbatim; theoretical GUE).
const rungs = [
  { L: PT_ANCHOR_L, floor: ANCHOR_FLOOR },
  { L: 1e7, floor: 7.3978e-5 },
  { L: 2e7, floor: 5.173078e-4 },
  { L: 3e7, floor: 1.203644e-3 },
  { L: 5e7, floor: 4.657430e-3 },
];

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
function linFit(px, py) {
  const n = px.length;
  const mx = px.reduce((a, b) => a + b, 0) / n;
  const my = py.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (px[i] - mx) * (py[i] - my); sxx += (px[i] - mx) ** 2; }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}
function crossoverL(floorFn) {
  let lo = PT_ANCHOR_L, hi = 1e14;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (floorFn(mid) - signalOf(mid) > 0) hi = mid;
    else lo = mid;
  }
  return Math.sqrt(lo * hi);
}

// Fit all three accelerating-exponent models on a given rung subset and re-bisect L* for each.
function fitModels(subset) {
  const xs = subset.map((r) => Math.log(r.L));
  const ys = subset.map((r) => Math.log(r.floor));
  const x0 = Math.log(PT_ANCHOR_L);
  const quad = quadFit(xs, ys);
  const floorA = (L) => { const x = Math.log(L); return Math.exp(quad.a + quad.b * x + quad.c * x * x); };
  const floorB = (L) => { const x = Math.log(L); return ANCHOR_FLOOR * Math.exp(quad.b * (x - x0) + quad.c * (x * x - x0 * x0)); };
  const le = [];
  for (let i = 1; i < subset.length; i++) le.push({ xMid: (xs[i] + xs[i - 1]) / 2, p: (ys[i] - ys[i - 1]) / (xs[i] - xs[i - 1]) });
  const ef = linFit(le.map((l) => l.xMid), le.map((l) => l.p));
  const floorC = (L) => { const x = Math.log(L); const integ = ef.intercept * (x - x0) + (ef.slope / 2) * (x * x - x0 * x0); return ANCHOR_FLOOR * Math.exp(integ); };
  return { A: crossoverL(floorA), B: crossoverL(floorB), C: crossoverL(floorC), quadC: quad.c };
}

// Full-data models (reproduce the imp-96712 A/B/C L*).
const full = fitModels(rungs);

// --- Leave-one-out / jackknife: drop each rung, refit A/B/C on the remaining four ---
const loo = [];
const allLstar = [];
for (let d = 0; d < rungs.length; d++) {
  const subset = rungs.filter((_, i) => i !== d);
  const m = fitModels(subset);
  loo.push({ droppedL: rungs[d].L, A: m.A, B: m.B, C: m.C, quadC: m.quadC });
  allLstar.push(m.A, m.B, m.C);
}
const looLo = Math.min(...allLstar);
const looHi = Math.max(...allLstar);
const looRatio = looHi / looLo;
const looFullRatio = (IMP96712_BRACKET_HI - IMP96712_BRACKET_LO) / IMP96690_OLS_LSTAR; // ~0.07 full band
const looBandFraction = (looHi - looLo) / IMP96690_OLS_LSTAR; // ~0.22 leave-one-out band
const decadesLo = Math.log10(looLo / PT_ANCHOR_L);
const decadesHi = Math.log10(looHi / PT_ANCHOR_L);

// --- AIC / BIC / AICc: single-slope OLS (k=2) vs quadratic-in-log-log (k=3), on all five points ---
const xsAll = rungs.map((r) => Math.log(r.L));
const ysAll = rungs.map((r) => Math.log(r.floor));
const nAll = xsAll.length;
const lin = linFit(xsAll, ysAll);
let rssLin = 0;
for (let i = 0; i < nAll; i++) { const pred = lin.intercept + lin.slope * xsAll[i]; rssLin += (ysAll[i] - pred) ** 2; }
const quadAll = quadFit(xsAll, ysAll);
let rssQuad = 0;
for (let i = 0; i < nAll; i++) { const pred = quadAll.a + quadAll.b * xsAll[i] + quadAll.c * xsAll[i] * xsAll[i]; rssQuad += (ysAll[i] - pred) ** 2; }
function infoCriteria(rss, k) {
  const aic = nAll * Math.log(rss / nAll) + 2 * k;
  const aicc = aic + (2 * k * (k + 1)) / (nAll - k - 1);
  const bic = nAll * Math.log(rss / nAll) + k * Math.log(nAll);
  return { aic, aicc, bic };
}
const icLin = infoCriteria(rssLin, 2);
const icQuad = infoCriteria(rssQuad, 3);
const dAIC = icQuad.aic - icLin.aic;   // > 0 favours OLS
const dAICc = icQuad.aicc - icLin.aicc; // > 0 favours OLS
const dBIC = icQuad.bic - icLin.bic;    // > 0 favours OLS

export const IMP96735_BASIS_C_LSTAR_BRACKET_LOO = {
  ticket: 'imp-96735',
  source:
    'imp-96712 bracketed the basis-C corroboration reach at L* ~ [7.6e7, 8.2e7] by fitting three accelerating-'
    + 'exponent floor models to five committed imp-96690 floors, but flagged that a three-parameter model on '
    + 'five points is over-parameterized. This module re-analyses the SAME baked floors -- leave-one-out / '
    + 'jackknife (drop each rung, refit A/B/C) plus AIC/BIC/AICc vs the single-slope OLS baseline -- to '
    + 'quantify how stable the bracket is. No new quadrature; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  rungs,
  fullModelLstar: { A: full.A, B: full.B, C: full.C }, // reproduces imp-96712 7.80e7 / 7.63e7 / 8.20e7
  imp96712Bracket: { lo: IMP96712_BRACKET_LO, hi: IMP96712_BRACKET_HI, olsBaseline: IMP96690_OLS_LSTAR },
  leaveOneOut: {
    perDrop: loo, // {droppedL, A, B, C, quadC} for each of the five rungs
    envelope: { lo: looLo, hi: looHi, ratioHiLo: looRatio }, // ~[6.96e7, 8.71e7], ~1.25
    fullBandFractionOfOls: looFullRatio,  // ~0.07 (imp-96712 +/-6% band)
    looBandFractionOfOls: looBandFraction, // ~0.22 (leave-one-out ~4x wider)
    decadesPastAnchorLo: decadesLo, // ~1.07
    decadesPastAnchorHi: decadesHi, // ~1.17
    dominantLeverage:
      'The wide excursions come from the ENDPOINT rungs, not the 2e7 -> 3e7 dip the ticket suspected: dropping '
      + 'the anchor rung (5.9e6) flips the quadratic curvature from accelerating (c=+0.12) to decelerating '
      + '(c=-0.13), pushing model A up to ~8.71e7 while anchored B/C collapse to ~6.96e7-7.16e7; dropping the '
      + 'top rung (5e7) splits them the other way. Dropping either mid rung (2e7 or 3e7) leaves L* near '
      + '[7.3e7, 7.9e7] -- mild.',
  },
  modelSelection: {
    ols: { k: 2, slope: lin.slope, rss: rssLin, aic: icLin.aic, aicc: icLin.aicc, bic: icLin.bic },
    quad: { k: 3, c: quadAll.c, rss: rssQuad, aic: icQuad.aic, aicc: icQuad.aicc, bic: icQuad.bic },
    dAIC, dAICc, dBIC, // all > 0 => favour the simpler OLS baseline
    verdict:
      'AIC (dAIC=+0.6), BIC (dBIC=+0.2) and especially the small-sample AICc (dAICc=+18.6, since n-k-1=1 for '
      + 'the quadratic) all prefer the single-slope OLS baseline. The acceleration is not statistically '
      + 'supported at five points; the OLS L* ~ 8.08e7 is the defensible point estimate.',
  },
  caveat:
    'Every floor is a double-precision quadrature/cancellation artifact of the basis-C direct integral for the '
    + 'theoretical GUE two-interval correlation; no computed Riemann zeros back any value. Leave-one-out on five '
    + 'points is statistically thin (four points per refit), so the [7.0e7, 8.7e7] envelope is a sensitivity '
    + 'band, not a confidence interval. Changes no bound, establishes no operator positivity, does not touch the '
    + '~1.9-sigma excursion confidence.',
  verdict:
    'Leave-one-out / jackknife over the five committed imp-96690 floors spreads L* across ~[6.96e7, 8.71e7] '
    + '(hi/lo ~1.25), ~4x wider than the imp-96712 full-data +/-6% band [7.6e7, 8.2e7]; the dominant leverage '
    + 'is the ANCHOR and TOP rungs (dropping the anchor flips the quadratic to decelerating), NOT the 2e7 -> 3e7 '
    + 'dip. AIC, BIC and the small-sample AICc all prefer the single-slope OLS baseline over the three-parameter '
    + 'quadratic (dAIC=+0.6, dBIC=+0.2, dAICc=+18.6), confirming the imp-96712 over-parameterization caveat. '
    + 'The ~1.07-1.17-decade-past-anchor reach is robust; the tight +/-6% bracket is not. Re-analysis of baked '
    + 'data only; theoretical GUE, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed'
    + '; the zero-side route stays PCC/GRH-gated.',
};

export const IMP96735_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Re-analysis of baked data only: rho is the theoretical GUE '
  + 'two-interval correlation, not computed from real zeros. Leave-one-out on the five imp-96690 floors spreads '
  + 'the imp-96712 reach across ~[7.0e7, 8.7e7] (~4x wider than the tight +/-6% band [7.6e7, 8.2e7]); AIC/BIC/'
  + 'AICc all prefer the single-slope OLS baseline over the three-parameter quadratic. Changes no bound.';

// --- self-executing internal-consistency assertions ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96735: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96735: Ci(1) drifted from reference');

  // the full-data refit reproduces the imp-96712 A/B/C crossovers
  if (!approx(full.A, 7.804e7, 5e5)) throw new Error('imp-96735: full-data model A drifted from imp-96712 7.80e7');
  if (!approx(full.B, 7.631e7, 5e5)) throw new Error('imp-96735: full-data model B drifted from imp-96712 7.63e7');
  if (!approx(full.C, 8.201e7, 5e5)) throw new Error('imp-96735: full-data model C drifted from imp-96712 8.20e7');

  // the leave-one-out envelope is materially WIDER than the full-data band
  if (!(looBandFraction > 2 * looFullRatio))
    throw new Error('imp-96735: leave-one-out band should be materially wider than the full-data +/-6% band');
  if (!(looRatio > 1.15 && looRatio < 1.4))
    throw new Error('imp-96735: leave-one-out hi/lo ratio should be ~1.25');
  if (!(looLo > 6.5e7 && looLo < 7.2e7 && looHi > 8.4e7 && looHi < 9.0e7))
    throw new Error('imp-96735: leave-one-out envelope drifted from ~[6.96e7, 8.71e7]');

  // dropping the anchor rung flips the quadratic curvature negative (the dominant leverage)
  const dropAnchor = loo.find((r) => r.droppedL === PT_ANCHOR_L);
  if (!(dropAnchor && dropAnchor.quadC < 0))
    throw new Error('imp-96735: dropping the anchor rung should flip the quadratic curvature negative');
  // dropping a mid rung (2e7 or 3e7) stays mild -- endpoint leverage, not the mid dip
  const drop3e7 = loo.find((r) => r.droppedL === 3e7);
  if (!(drop3e7 && drop3e7.quadC > 0))
    throw new Error('imp-96735: dropping the 3e7 rung should keep the quadratic accelerating (mild leverage)');

  // AIC/BIC/AICc all favour the simpler OLS baseline (positive deltas)
  if (!(dAIC > 0)) throw new Error('imp-96735: AIC should favour the single-slope OLS baseline');
  if (!(dBIC > 0)) throw new Error('imp-96735: BIC should favour the single-slope OLS baseline');
  if (!(dAICc > 10)) throw new Error('imp-96735: small-sample AICc should strongly reject the quadratic');
  if (!(rssQuad < rssLin)) throw new Error('imp-96735: the quadratic should lower RSS (more parameters)');

  // the ~1-decade reach conclusion survives leave-one-out
  if (!(decadesLo > 1.0 && decadesHi < 1.25))
    throw new Error('imp-96735: every refit should still place L* ~1.07-1.17 decades past the PT anchor');

  // honesty gates
  if (!/NO QED/.test(IMP96735_BASIS_C_LSTAR_BRACKET_LOO.verdict))
    throw new Error('imp-96735: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96735_BASIS_C_LSTAR_BRACKET_LOO.verdict))
    throw new Error('imp-96735: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96712/.test(IMP96735_BASIS_C_LSTAR_BRACKET_LOO.source))
    throw new Error('imp-96735: source dropped the imp-96712 reference');
  if (!(/RH open/.test(IMP96735_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96735_HONEST_BANNER) && /NO QED/.test(IMP96735_HONEST_BANNER)))
    throw new Error('imp-96735: IMP96735_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96735_BASIS_C_LSTAR_BRACKET_LOO;
