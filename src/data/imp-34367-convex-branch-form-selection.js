/**
 * @module imp-34367-convex-branch-form-selection
 *
 * imp-34367 (numerical, frontier-direction): imp-34268 established that the imp-34196/imp-34169 fixed-band
 * (k <= 10) peak re-acceleration branch is genuinely CONVEX (strictly positive and growing peak third
 * differences) but left SUB-GAP-imp-34268-convex-branch-form OPEN: it did NOT identify WHICH convex functional
 * form the branch follows, and the branch terminates at the imp-34169 resid_exp surrogate pole k* ~ 21.28095 so
 * no asymptotic was accessible. This module CLOSES that sub-gap as a form-SELECTION measurement: it recomputes
 * the post-minimum branch peak on the identical imp-34268 machinery (the increment-minimum node kEnd = 18.75
 * through the last computable quarter-rung kEnd = 21.25; 11 nodes) and fits the three competing convex forms the
 * ticket names against the branch data --
 *
 *   (A) QUADRATIC       peak ~ a + b*kEnd + c*kEnd^2
 *   (B) EXPONENTIAL     peak ~ exp(a + b*kEnd)                 (log-linear OLS in kEnd)
 *   (C) SIMPLE POLE     peak ~ a + b/(k* - kEnd)               (order-1 blow-up toward k* ~ 21.28095)
 *
 * plus two reference forms that connect to the sibling cohort: (D) a LOGARITHMIC pole peak ~ a - b*ln(k* - kEnd)
 * (the imp-34253 log-peak / imp-34346 sub-power family) and (E) a FREE-exponent power pole peak ~ a + b*(k* -
 * kEnd)^(-p) whose best-fit exponent p is searched over (0, 2].
 *
 * THE ANSWER: AMONG THE THREE TICKET-NAMED FORMS THE QUADRATIC IS DECISIVELY FAVORED, AND THE SIMPLE 1/(k* -
 * kEnd) POLE IS THE WORST -- IT DOES NOT DOMINATE NEAR k*. On the full 11-node branch the quadratic gives
 * SSE ~ 2.43e-3 (R2 ~ 0.9753), the exponential SSE ~ 6.83e-3 (R2 ~ 0.9307), and the simple pole SSE ~ 3.95e-2
 * (R2 ~ 0.5993) -- the pole is ~16x worse than the quadratic. The near-pole tail (last 5 nodes, kEnd 20.25 ..
 * 21.25) tells the SAME story: tail SSE quad ~ 2.80e-4 < exp ~ 1.88e-3 < pole ~ 4.87e-3, so the pole form does
 * NOT take over as k* is approached -- it OVER-predicts the blow-up. Consistently, the free-exponent power-pole
 * search drives p -> ~0 (the logarithmic limit, SSE ~ 6.27e-3), and the explicit LOG-pole (SSE ~ 5.64e-3, R2 ~
 * 0.9427) beats every genuine power pole. That is the imp-34346 signature (sub-unity effective pole order p ~
 * 0.937 in the third difference, decreasing toward the pole) and the imp-34253 logarithmic-peak reading:
 * the near-pole growth is MILDER than any order-1 pole.
 *
 * HONEST CAVEAT (why this is form SELECTION, not a derived asymptotic): the branch is only 11 nodes on a
 * bounded 2.5-wide kEnd interval truncated at the pole; the quadratic that wins is a LOCAL best-fit descriptor
 * over the computable domain and CANNOT literally be the true asymptotic (a finite quadratic stays finite at
 * kEnd = k*, whereas the peak must diverge/terminate at the imp-34169 surrogate pole). The measurement ranks
 * the three candidate forms on the accessible branch and rules the simple pole OUT as the near-pole dominant
 * form; it does NOT decide the true k* -> asymptotic class, which stays open as
 * SUB-GAP-imp-34287-asymptotic-class-undecidable. What it DOES close: SUB-GAP-imp-34268-convex-branch-form is
 * answered -- of {quadratic, exponential, 1/(k*-kEnd) pole}, the quadratic is favored and the simple pole is
 * disfavored and does not dominate near k*.
 *
 * MEASUREMENT / FORM-SELECTION PROBE ONLY. A descriptive least-squares ranking of inherited surrogate fits, NOT
 * an RH bound. The component model is the inherited imp-3220/imp-3406 extrapolation, NOT a rigorous asymptotic;
 * the fits are descriptive, not derived; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no bound;
 * establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. No refereed bound is changed.
 *
 * @see imp-34268-fixed-band-peak-reaccel-convexity-stitch (the convex branch this selects a form for; hosts SUB-GAP-imp-34268-convex-branch-form)
 * @see imp-34346-fixed-band-peak-third-diff-pole-order (sub-unity effective pole order p ~ 0.937 in the third difference; agrees the pole is sub-order-1)
 * @see imp-34287-fixed-band-peak-growth-exponent-pole-reconciliation (SUB-GAP-imp-34287-asymptotic-class-undecidable, the true k* asymptotic left open)
 * @see imp-34196-fixed-band-peak-increment-minimum-subwindow-refine (the increment-minimum node kEnd = 18.75 anchoring the branch)
 * @see imp-34169-fixed-band-peak-extended-decade-surrogate-zero (the resid_exp pole k* ~ 21.28095 the branch terminates at)
 * @see lambda-rh-height-mapping (effectiveHeightForN: N -> T0 = gamma_N)
 * @see polymath15-constant-C-C (C_C_PINNED constant in E_coll)
 */

import { effectiveHeightForN } from './lambda-rh-height-mapping.js';
import { C_C_PINNED } from './polymath15-constant-C-C.js';

const TWO_PI = 2 * Math.PI;
const E_TRUNC_PT = 3.06e-5; // N-independent fixed-strip route (imp-2631), verbatim imp-34268
const TC_A1_TRAP = 2.37e-4;
const GRONWALL = Math.exp(1.0 * TC_A1_TRAP);

// EXACT inherited imp-3406/imp-33810 sub-terms -- verbatim imp-34268/imp-34196/imp-34169.
function parts(N) {
  const T0 = effectiveHeightForN(N);
  const L = Math.log(T0);
  const C_F = (Math.log(T0 / TWO_PI) + 1) / TWO_PI;
  const E_flow = C_F * (L / T0) * GRONWALL;
  const E_coll = C_C_PINNED * Math.sqrt(L / N);
  const E_N = E_TRUNC_PT + E_flow + E_coll;
  return { E_flow, E_coll, E_N, sigma: E_coll / E_N };
}

function olsSlope(xs, ys) {
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxx = 0;
  let sxy = 0;
  for (let i = 0; i < n; i++) {
    sxx += (xs[i] - mx) ** 2;
    sxy += (xs[i] - mx) * (ys[i] - my);
  }
  return sxy / sxx;
}
function ols(xs, ys) {
  const b = olsSlope(xs, ys);
  const mx = xs.reduce((a, c) => a + c, 0) / xs.length;
  const my = ys.reduce((a, c) => a + c, 0) / ys.length;
  return { a: my - b * mx, b };
}

function olsSigmaExponent(loN, hiN, ptsPerDecade = 4) {
  const step = 1 / ptsPerDecade;
  const xs = [];
  const ys = [];
  for (let d = Math.log10(loN); d <= Math.log10(hiN) + 1e-9; d += step) {
    const N = Math.pow(10, d);
    xs.push(Math.log(N));
    ys.push(Math.log(parts(N).sigma));
  }
  return -olsSlope(xs, ys);
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
function eflowOverResidAt(k) {
  const lo = Math.pow(10, k);
  const hi = Math.pow(10, k + 1);
  const pSigma = olsSigmaExponent(lo, hi);
  const pEcoll = ecollExponentMag(lo, hi);
  const ph = parts(hi);
  const residExp = pEcoll * (1 - ph.sigma) - pSigma;
  const eflowAttr = (ph.E_flow / ph.E_N) * Math.abs(eflowLogSlope(hi));
  return +(eflowAttr / residExp).toExponential(4);
}
function buildLadder(kEnd) {
  const R = [];
  for (let k = 6; k <= kEnd + 1e-9; k += 0.25) {
    const kk = +k.toFixed(2);
    R.push({ k: kk, eflow_over_resid: eflowOverResidAt(kk) });
  }
  return R;
}
function fixedBandPeak(R, kMax) {
  const KS = R.map((r) => r.k);
  const Y = R.map((r) => Math.log(r.eflow_over_resid));
  const F = ols(KS, Y);
  const RES = KS.map((k, i) => Y[i] - (F.a + F.b * k));
  let mi = -1;
  for (let i = 0; i < RES.length; i++) {
    if (KS[i] <= kMax + 1e-9 && (mi < 0 || RES[i] > RES[mi])) mi = i;
  }
  return +RES[mi].toFixed(6);
}

// Generic linear least squares against arbitrary basis columns (normal equations + Gaussian elimination).
function lstsq(cols, y) {
  const m = cols.length;
  const n = y.length;
  const M = [];
  for (let i = 0; i < m; i++) {
    const row = new Array(m + 1).fill(0);
    for (let j = 0; j < m; j++) {
      let s = 0;
      for (let r = 0; r < n; r++) s += cols[i][r] * cols[j][r];
      row[j] = s;
    }
    let sy = 0;
    for (let r = 0; r < n; r++) sy += cols[i][r] * y[r];
    row[m] = sy;
    M.push(row);
  }
  for (let p = 0; p < m; p++) {
    let mx = p;
    for (let r = p + 1; r < m; r++) if (Math.abs(M[r][p]) > Math.abs(M[mx][p])) mx = r;
    const tmp = M[p];
    M[p] = M[mx];
    M[mx] = tmp;
    for (let r = 0; r < m; r++) {
      if (r === p) continue;
      const f = M[r][p] / M[p][p];
      for (let c = p; c <= m; c++) M[r][c] -= f * M[p][c];
    }
  }
  return M.map((row, i) => row[m] / M[i][i]);
}
function fitBasis(xs, y, basisFns) {
  const cols = basisFns.map((f) => xs.map(f));
  const c = lstsq(cols, y);
  const pred = xs.map((_, r) => basisFns.reduce((s, _f, j) => s + c[j] * cols[j][r], 0));
  const my = y.reduce((a, b) => a + b, 0) / y.length;
  let ssr = 0;
  let sst = 0;
  for (let i = 0; i < y.length; i++) {
    ssr += (y[i] - pred[i]) ** 2;
    sst += (y[i] - my) ** 2;
  }
  return { c, sse: ssr, r2: 1 - ssr / sst };
}
function sseOf(y, pred) {
  let s = 0;
  for (let i = 0; i < y.length; i++) s += (y[i] - pred[i]) ** 2;
  return s;
}

// ---- The post-minimum re-acceleration branch (imp-34196 increment-minimum node 18.75 .. last rung 21.25) ----
const KSTAR = 21.280947; // imp-34169 resid_exp surrogate pole k* ~ 21.28095
const FIXED_BAND_KMAX = 10.0; // identical band to imp-33940 / imp-34109 / imp-34196 / imp-34169 / imp-34268

const BRANCH_KENDS = [];
for (let k = 18.75; k <= 21.25 + 1e-9; k += 0.25) BRANCH_KENDS.push(+k.toFixed(2));
const BRANCH_PEAKS = BRANCH_KENDS.map((ke) => fixedBandPeak(buildLadder(ke), FIXED_BAND_KMAX));

// (A) Quadratic, (B) Exponential (log-linear), (C) Simple pole 1/(k*-kEnd)
const QUAD = fitBasis(BRANCH_KENDS, BRANCH_PEAKS, [() => 1, (k) => k, (k) => k * k]);
const LOGY = BRANCH_PEAKS.map((v) => Math.log(v));
const EXP_LL = ols(BRANCH_KENDS, LOGY); // log(peak) ~ a + b*kEnd
const EXP_PRED = BRANCH_KENDS.map((k) => Math.exp(EXP_LL.a + EXP_LL.b * k));
const EXP_SSE = sseOf(BRANCH_PEAKS, EXP_PRED);
const EXP_R2 = (() => {
  const my = BRANCH_PEAKS.reduce((a, b) => a + b, 0) / BRANCH_PEAKS.length;
  let sst = 0;
  for (const v of BRANCH_PEAKS) sst += (v - my) ** 2;
  return 1 - EXP_SSE / sst;
})();
const POLE = fitBasis(BRANCH_KENDS, BRANCH_PEAKS, [() => 1, (k) => 1 / (KSTAR - k)]);

// (D) Logarithmic pole peak ~ a - b*ln(k*-kEnd) (imp-34253 / imp-34346 sub-power family)
const LOGPOLE = fitBasis(BRANCH_KENDS, BRANCH_PEAKS, [() => 1, (k) => -Math.log(KSTAR - k)]);

// (E) Free-exponent power pole peak ~ a + b*(k*-kEnd)^(-p); grid-search p in (0,2].
let FREE_POLE = { p: null, sse: Infinity, r2: null };
for (let p = 0.02; p <= 2.0 + 1e-9; p += 0.02) {
  const fit = fitBasis(BRANCH_KENDS, BRANCH_PEAKS, [() => 1, (k) => Math.pow(KSTAR - k, -p)]);
  if (fit.sse < FREE_POLE.sse) FREE_POLE = { p: +p.toFixed(2), sse: fit.sse, r2: fit.r2 };
}

// Near-pole tail: last 5 nodes (kEnd 20.25 .. 21.25) -- does the simple pole take over near k*?
const TAIL_IDX = BRANCH_KENDS.map((_, i) => i).slice(-5);
const TX = TAIL_IDX.map((i) => BRANCH_KENDS[i]);
const TY = TAIL_IDX.map((i) => BRANCH_PEAKS[i]);
const TAIL_QUAD_SSE = fitBasis(TX, TY, [() => 1, (k) => k, (k) => k * k]).sse;
const TAIL_POLE_SSE = fitBasis(TX, TY, [() => 1, (k) => 1 / (KSTAR - k)]).sse;
const TAIL_EXP_SSE = (() => {
  const F = ols(TX, TY.map((v) => Math.log(v)));
  return sseOf(TY, TX.map((k) => Math.exp(F.a + F.b * k)));
})();

// Rank the three ticket-named forms by SSE (lower is better).
const RANKING = [
  { form: 'quadratic', sse: +QUAD.sse.toExponential(4), r2: +QUAD.r2.toFixed(6) },
  { form: 'exponential', sse: +EXP_SSE.toExponential(4), r2: +EXP_R2.toFixed(6) },
  { form: 'simple-pole', sse: +POLE.sse.toExponential(4), r2: +POLE.r2.toFixed(6) },
].sort((a, b) => a.sse - b.sse);
const FAVORED_FORM = RANKING[0].form; // 'quadratic'
const WORST_FORM = RANKING[RANKING.length - 1].form; // 'simple-pole'
const POLE_DOMINATES_NEAR_KSTAR = TAIL_POLE_SSE < TAIL_QUAD_SSE && TAIL_POLE_SSE < TAIL_EXP_SSE; // false

// Reuse anchors (imp-34268 baked peaks) for the continuation gate.
const IMP34196_INCREMENT_MINIMUM_PEAK = 0.770259; // imp-34268 peak at kEnd = 18.75
const IMP34169_PEAK_AT_KEND_20 = 0.865303; // imp-34268/imp-34169 shared anchor
const IMP34268_PEAK_AT_KEND_2125 = 1.100487; // imp-34268 last computable quarter-rung

export const IMP34367_CONVEX_BRANCH_FORM_SELECTION = {
  id: 'imp-34367',
  proofSection: 'S-frontier',
  question:
    'imp-34268 showed the imp-34196/imp-34169 fixed-band (k <= 10) peak re-acceleration branch is CONVEX ' +
    '(positive growing third differences) but left SUB-GAP-imp-34268-convex-branch-form OPEN: WHICH convex ' +
    'form does the branch follow -- quadratic, exponential in kEnd, or a 1/(k* - kEnd) pole blow-up toward the ' +
    'imp-34169 resid_exp pole k* ~ 21.28095 -- and does the pole form dominate near k*? Form-selection ' +
    'measurement only; changes no bound; NO QED.',
  branchKEnds: BRANCH_KENDS, // 11 nodes kEnd = 18.75 .. 21.25 (0.25 step); post-minimum re-acceleration branch
  branchPeaks: BRANCH_PEAKS.map((v) => +v.toFixed(6)),
  kStar: KSTAR,
  fixedBandKMax: FIXED_BAND_KMAX,
  fits: {
    quadratic: { coeffs: QUAD.c.map((x) => +x.toExponential(6)), sse: +QUAD.sse.toExponential(4), r2: +QUAD.r2.toFixed(6) }, // SSE ~ 2.43e-3, R2 ~ 0.9753
    exponential: { a: +EXP_LL.a.toFixed(6), b: +EXP_LL.b.toFixed(6), sse: +EXP_SSE.toExponential(4), r2: +EXP_R2.toFixed(6) }, // SSE ~ 6.83e-3, R2 ~ 0.9307
    simplePole: { a: +POLE.c[0].toFixed(6), b: +POLE.c[1].toFixed(6), sse: +POLE.sse.toExponential(4), r2: +POLE.r2.toFixed(6) }, // SSE ~ 3.95e-2, R2 ~ 0.5993
    logPole: { a: +LOGPOLE.c[0].toFixed(6), b: +(-LOGPOLE.c[1]).toFixed(6), sse: +LOGPOLE.sse.toExponential(4), r2: +LOGPOLE.r2.toFixed(6) }, // SSE ~ 5.64e-3, R2 ~ 0.9427
    freePoleExponent: { p: FREE_POLE.p, sse: +FREE_POLE.sse.toExponential(4), r2: +FREE_POLE.r2.toFixed(6) }, // best p -> ~0 (log limit)
  },
  ranking: RANKING, // three ticket-named forms sorted by SSE ascending: quadratic < exponential < simple-pole
  favoredForm: FAVORED_FORM, // 'quadratic'
  worstForm: WORST_FORM, // 'simple-pole'
  nearPoleTail: {
    tailKEnds: TX, // 20.25 .. 21.25 (last 5 nodes)
    quadSSE: +TAIL_QUAD_SSE.toExponential(4), // ~ 2.80e-4
    expSSE: +TAIL_EXP_SSE.toExponential(4), // ~ 1.88e-3
    poleSSE: +TAIL_POLE_SSE.toExponential(4), // ~ 4.87e-3
  },
  poleDominatesNearKStar: POLE_DOMINATES_NEAR_KSTAR, // false -- the simple pole is WORST even on the near-pole tail
  imp34196IncrementMinimumPeak: IMP34196_INCREMENT_MINIMUM_PEAK,
  imp34169PeakAtKEnd20: IMP34169_PEAK_AT_KEND_20,
  imp34268PeakAtKEnd2125: IMP34268_PEAK_AT_KEND_2125,
  finding: {
    F1_quadratic_favored_among_three_named_forms:
      'Fitting the three ticket-named forms to the 11-node post-minimum branch (kEnd 18.75 .. 21.25): the ' +
      'QUADRATIC peak ~ a + b*kEnd + c*kEnd^2 gives SSE ~ 2.43e-3 (R2 ~ 0.9753), the EXPONENTIAL ' +
      'peak ~ exp(a + b*kEnd) gives SSE ~ 6.83e-3 (R2 ~ 0.9307), and the SIMPLE POLE peak ~ a + b/(k* - kEnd) ' +
      'gives SSE ~ 3.95e-2 (R2 ~ 0.5993). The quadratic is decisively favored -- ~2.8x better than the ' +
      'exponential and ~16x better than the simple pole.',
    F2_simple_pole_does_not_dominate_near_kstar:
      'The simple 1/(k* - kEnd) pole does NOT take over as k* is approached. On the near-pole tail (last 5 ' +
      'nodes, kEnd 20.25 .. 21.25) the SSEs are quad ~ 2.80e-4 < exp ~ 1.88e-3 < pole ~ 4.87e-3 -- the same ' +
      'ordering as the full branch. The order-1 pole OVER-predicts the blow-up; the actual near-pole growth ' +
      'is milder.',
    F3_growth_is_sub_order_1_log_family:
      'Consistently, a free-exponent power pole peak ~ a + b*(k* - kEnd)^(-p) is best fit as p -> ~0 (the ' +
      'logarithmic limit, SSE ~ 6.27e-3), and an explicit LOG pole peak ~ a - b*ln(k* - kEnd) (SSE ~ 5.64e-3, ' +
      'R2 ~ 0.9427) beats every genuine power pole. This matches the imp-34346 sub-unity effective pole order ' +
      '(p ~ 0.937 in the third difference, decreasing toward the pole) and the imp-34253 logarithmic-peak ' +
      'reading: the near-pole divergence is sub-order-1, of the logarithmic family, not an integer pole.',
  },
  isRigorous: false,
  verdict:
    'MEASUREMENT / FORM-SELECTION PROBE (frontier-direction, NOT rigorous). Fitting the three ticket-named ' +
    'convex forms to the imp-34268 post-minimum fixed-band (k <= 10) peak re-acceleration branch (11 nodes, ' +
    'kEnd 18.75 .. 21.25, reproducing the imp-34196 increment-minimum peak 0.770259 at 18.75, the imp-34169 ' +
    'anchor 0.865303 at 20.0, and the imp-34268 last rung 1.100487 at 21.25) ANSWERS ' +
    'SUB-GAP-imp-34268-convex-branch-form: of {quadratic, exponential in kEnd, 1/(k* - kEnd) pole} the ' +
    'QUADRATIC is decisively favored (SSE ~ 2.43e-3, R2 ~ 0.9753) over the exponential (SSE ~ 6.83e-3, R2 ~ ' +
    '0.9307), and the SIMPLE POLE is the WORST (SSE ~ 3.95e-2, R2 ~ 0.5993, ~16x worse than the quadratic). ' +
    'The pole form does NOT dominate near k*: on the last 5 nodes the SSE ordering is quad ~ 2.80e-4 < exp ~ ' +
    '1.88e-3 < pole ~ 4.87e-3, so the order-1 pole OVER-predicts the blow-up. A free-exponent power pole is ' +
    'best fit as p -> ~0 (the log limit) and an explicit log pole peak ~ a - b*ln(k* - kEnd) (SSE ~ 5.64e-3) ' +
    'beats every genuine power pole -- the imp-34346 sub-unity-order and imp-34253 logarithmic-peak signature. ' +
    'HONEST CAVEAT: the branch is 11 nodes on a bounded 2.5-wide interval truncated at the pole; the winning ' +
    'quadratic is a LOCAL best-fit descriptor over the computable domain, NOT the true asymptotic (a finite ' +
    'quadratic stays finite at kEnd = k*, whereas the peak must diverge/terminate at the imp-34169 surrogate ' +
    'pole). This ranks the three candidate forms and rules the simple pole OUT as the near-pole dominant ' +
    'form; the true k* -> asymptotic class stays open as SUB-GAP-imp-34287-asymptotic-class-undecidable. The ' +
    'least-squares ranking is descriptive, not derived; the component model is the inherited imp-3220/imp-3406 ' +
    'extrapolation, NOT a rigorous asymptotic; the C_mb GUE-conditional per imp-486 is UNTOUCHED; changes no ' +
    'bound; establishes no operator positivity; imp-3066 K_a >= 0 untouched; no RH verdict, NO QED. ' +
    'No refereed bound is changed.',
  citation:
    'imp-34268 (the convex branch this selects a form for; SUB-GAP-imp-34268-convex-branch-form); imp-34346 ' +
    '(sub-unity effective pole order p ~ 0.937 in the third difference); imp-34253 (logarithmic peak); ' +
    'imp-34287 (SUB-GAP-imp-34287-asymptotic-class-undecidable); imp-34196 (increment-minimum node 18.75); ' +
    'imp-34169 (resid_exp pole k* ~ 21.28095); imp-486 (C_mb GUE-conditional); imp-2631 (E_trunc fixed-strip); ' +
    'lambda-rh-height-mapping (effectiveHeightForN); polymath15-constant-C-C (C_C_PINNED).',
};

export const IMP34367_CONVEX_BRANCH_FORM_SELECTION_ASSERTIONS = [
  {
    // Reuse / continuation gate: the 11-node post-minimum branch reproduces the imp-34268 anchors exactly.
    id: 'imp34367-reuse-gate-branch-reproduces-imp34268-anchors',
    description: '11-node branch kEnd 18.75..21.25 reproduces imp-34268 peaks 0.770259 (18.75), 0.865303 (20.0), 1.100487 (21.25)',
    holds: () =>
      BRANCH_KENDS.length === 11 &&
      BRANCH_KENDS[0] === 18.75 &&
      BRANCH_KENDS[BRANCH_KENDS.length - 1] === 21.25 &&
      Math.abs(BRANCH_PEAKS[0] - IMP34196_INCREMENT_MINIMUM_PEAK) < 1e-4 &&
      Math.abs(fixedBandPeak(buildLadder(20.0), FIXED_BAND_KMAX) - IMP34169_PEAK_AT_KEND_20) < 1e-4 &&
      Math.abs(BRANCH_PEAKS[BRANCH_PEAKS.length - 1] - IMP34268_PEAK_AT_KEND_2125) < 1e-4,
  },
  {
    // (F1) Among the three ticket-named forms the quadratic is favored (lowest SSE) and the simple pole worst.
    id: 'imp34367-quadratic-favored-simple-pole-worst',
    description: 'quadratic SSE ~ 2.43e-3 (R2 ~ 0.9753) < exponential SSE ~ 6.83e-3 < simple-pole SSE ~ 3.95e-2 (R2 ~ 0.5993)',
    holds: () =>
      FAVORED_FORM === 'quadratic' &&
      WORST_FORM === 'simple-pole' &&
      QUAD.sse < EXP_SSE &&
      EXP_SSE < POLE.sse &&
      QUAD.r2 > 0.97 &&
      POLE.r2 < 0.65 &&
      POLE.sse / QUAD.sse > 10,
  },
  {
    // (F2) The simple pole does NOT dominate near k* -- on the near-pole tail it is still the worst of the three.
    id: 'imp34367-simple-pole-not-dominant-near-kstar',
    description: 'near-pole tail (last 5 nodes) SSE ordering quad ~ 2.80e-4 < exp ~ 1.88e-3 < pole ~ 4.87e-3; poleDominatesNearKStar false',
    holds: () =>
      POLE_DOMINATES_NEAR_KSTAR === false &&
      TAIL_QUAD_SSE < TAIL_EXP_SSE &&
      TAIL_EXP_SSE < TAIL_POLE_SSE,
  },
  {
    // (F3) The near-pole growth is sub-order-1 / logarithmic: free power-pole exponent p -> ~0, log pole beats power.
    id: 'imp34367-growth-sub-order-1-log-family',
    description: 'free power-pole best exponent p -> ~0 (log limit); explicit log pole SSE ~ 5.64e-3 beats every genuine power pole',
    holds: () =>
      FREE_POLE.p !== null &&
      FREE_POLE.p < 0.5 &&
      LOGPOLE.sse < POLE.sse &&
      LOGPOLE.sse < FREE_POLE.sse * 1.05,
  },
  {
    // Honesty gate: form-selection only, isRigorous false, imp-34268 sub-gap answered, asymptotic class still open,
    // no QED, no refereed bound is changed, imp-3066 K_a>=0 & imp-486 C_mb untouched.
    id: 'imp34367-honesty-gate-no-qed',
    description: 'Form-selection only: isRigorous false, SUB-GAP-imp-34268-convex-branch-form answered, asymptotic class open, no QED, no refereed bound is changed, imp-3066 K_a>=0 & imp-486 C_mb untouched',
    holds: () =>
      IMP34367_CONVEX_BRANCH_FORM_SELECTION.isRigorous === false &&
      /SUB-GAP-imp-34268-convex-branch-form/.test(IMP34367_CONVEX_BRANCH_FORM_SELECTION.verdict) &&
      /SUB-GAP-imp-34287-asymptotic-class-undecidable/.test(IMP34367_CONVEX_BRANCH_FORM_SELECTION.verdict) &&
      /NOT a rigorous asymptotic/.test(IMP34367_CONVEX_BRANCH_FORM_SELECTION.verdict) &&
      /LOCAL best-fit descriptor/.test(IMP34367_CONVEX_BRANCH_FORM_SELECTION.verdict) &&
      /NO QED/.test(IMP34367_CONVEX_BRANCH_FORM_SELECTION.verdict) &&
      /refereed bound is changed/i.test(IMP34367_CONVEX_BRANCH_FORM_SELECTION.verdict) &&
      /imp-3066 K_a >= 0 untouched/i.test(IMP34367_CONVEX_BRANCH_FORM_SELECTION.verdict) &&
      /C_mb GUE-conditional per imp-486 is UNTOUCHED/i.test(IMP34367_CONVEX_BRANCH_FORM_SELECTION.verdict),
  },
];

for (const a of IMP34367_CONVEX_BRANCH_FORM_SELECTION_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-34367-convex-branch-form-selection assertion failed: ${a.id}`);
  }
}
