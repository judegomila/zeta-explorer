/**
 * imp-95355: t3 HEAD-WEIGHT GAP -- measures, per head term n in {0, +-1}
 * and per chart, the ratio of the b-uniform trace charge t3(|w_n|) to the
 * b-exact (true worst-in-cell) per-term trace weight, at rho = e^6 and
 * r in {2, e^3, e^5.9}, to quantify how much of the imp-95332 surviving
 * large-rho residual (3.0 - 5.1x) the head trace over-charge carries.
 * MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed.
 *
 * WHY. imp-95337 gave the order-symmetric (Shapley) split of the RZ-PEN6
 * floor looseness between the pair-truncation leg and the b-uniform
 * t3-weight leg, finding the t3 leg dominant (75 - 100 percent). That split
 * is a floor-level bookkeeping decomposition; it does not say WHERE inside
 * the trace the t3 over-charge lives. imp-95332 names the b-uniform t3
 * head-weight gap as one of two surviving legs after LEMMA TAIL-CHART
 * exhausted the tail currency, but the head over-charge itself was never
 * tabulated term-by-term. This module isolates the three head trace terms
 * n in {0, +-1} (the terms carried explicitly in chartT6 / chartT8) and
 * measures the per-term over-charge factor tw / t8weight that the RZ-PEN8
 * b-exact trace T8 removes.
 *
 * OBJECT (imp-95252 / imp-95329..95334 / imp-95337 normalization,
 * verbatim). a = ln rho in (0, 6], b = ln r in (0, a), tau = b / a,
 * s = sech(b / 2), A = 1 - s^2, P(w) = (2 pi / a) sech(pi w / a),
 * w_n = theta + 2 pi n. The b-uniform trace charge (imp-95329 LEMMA BCAP)
 * is t3(w) = c_alpha + min(kappa w^2, 2 + 4 w^2 / a^2) with
 * c_alpha = 2 / (1 + sech(a)), kappa = 4 cosh(a/2) / a^2. The b-exact
 * per-term weight over a chart interval [u0, u1] (imp-95334 LEMMA T-EXACT)
 * is t8(u0, u1) = 2 (1 - s * minCos(u0 tau, u1 tau)) / A, the largest true
 * weight 2 (1 - s cos(w tau)) / A attained over the interval (minCos gives
 * the smallest cosine, hence the worst weight). Both are valid trace
 * OVER-charges; the head-weight gap is their ratio.
 *
 * HEAD TERMS (chartT6 / chartT8 layout, per chart k with t0 = pi k / K,
 * t1 = pi (k+1) / K, K = 256):
 *   n = 0 : charge tw(t1),        exact t8(t0, t1),           kernel P(t0)
 *   n = -1: charge tw(2pi - t0),  exact t8(2pi - t1, 2pi - t0), kernel P(2pi - t1)
 *   n = +1: charge tw(2pi + t1),  exact t8(2pi + t0, 2pi + t1), kernel P(2pi + t0)
 * Per-term head-weight gap = tw / t8 (>= 1 wherever the T8 cap binds; the
 * over-charge RZ-PEN8 removes). The aggregate head over-charge is the
 * kernel-weighted ratio sum_head tw*P / sum_head min(t8, tw)*P.
 *
 * MEASURED (base = RZ-PEN6 binding chart k = 114 at all three cells; per
 * head-term gap tw/t8 at that chart, and the max over all 256 charts):
 *   rho = e^6, r = 2:      n=0 3.221, n=-1 1.768, n=+1 1.424 (binding);
 *                          max over charts 3.221 / 2.297 / 1.545;
 *                          aggregate head over-charge 2.505x.
 *   rho = e^6, r = e^3:    n=0 2.447, n=-1 2.000, n=+1 3.214 (binding);
 *                          max 2.447 / 2.359 / 5.593; aggregate 2.376x.
 *   rho = e^6, r = e^5.9:  n=0 2.037, n=-1 3.226, n=+1 5.299 (binding);
 *                          max 2.202 / 4.528 / 6.137; aggregate 2.347x.
 * FINDING: at the RZ-PEN6 binding chart the b-uniform t3 charge over-prices
 * the true head trace weight by 1.42 - 5.30x per term (aggregate, kernel-
 * weighted, 2.35 - 2.51x across all three cells), and up to ~6.1x at the
 * worst off-binding chart; the cap tw >= t8 binds at EVERY head term of
 * every measured cell. This is a term-level view of the same over-charge
 * imp-95337 measured at the floor level: the head trace inflation (factor
 * ~2.4x) is directly what the RZ-PEN8 b-exact trace T8 removes, consistent
 * with the t3 leg carrying 75 - 100 percent of the log-looseness reduction.
 * The over-charge grows toward the far head term (n = +1) as r -> sqrt(rho)
 * (b -> a), where the phase w tau sweeps a full period inside a chart.
 *
 * HONEST LIMITS. (a) Measurement only; no floor is changed, promoted, or
 * added. The ratios compare two already-proven trace over-charges (b-uniform
 * t3 and b-exact t8), never a claim in themselves. (b) The "true per-term
 * trace contribution" here is the b-exact interval upper bound t8 (worst
 * true weight in the cell), the tightest per-term charge RZ-PEN8 uses; it
 * is >= the pointwise true weight, so tw/t8 is a LOWER bound on the raw
 * pointwise over-charge -- the true head over-charge is at least this
 * large. (c) Head terms n in {0, +-1} only; the tail m >= 2 was exhausted
 * separately by imp-95332 LEMMA TAIL-CHART. (d) Floors only; the gains live
 * at rho > ~4 where no certificate fires; the rho = 2 anchor and all
 * every-octave onsets are untouched. (e) Dyadic lattice skeleton only;
 * off-lattice rates unchanged (imp-95232). (f) Model family only; no
 * mapping to paper per-window data; changes NO Lambda bound. Sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics CROSS-CHECK the
 * measurement against the imp-95337 conventions and reproduce from scratch.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95355_T3_HEAD_WEIGHT_GAP = {
  id: "imp-95355",
  title:
    "t3 HEAD-WEIGHT GAP: per head-term n in {0,+-1} and per chart ratio of " +
    "the b-uniform trace charge t3(|w_n|) to the b-exact per-term trace " +
    "weight t8, at rho=e^6, r in {2,e^3,e^5.9} -- the b-uniform charge " +
    "over-prices the true head trace by 1.42-5.30x per term (2.35-2.51x " +
    "aggregate), the over-charge RZ-PEN8 removes",
  method:
    "isolate the three head trace terms carried in chartT6/chartT8 " +
    "(n=0,+-1); at the RZ-PEN6 binding chart (k=114) and across all 256 " +
    "charts compute the per-term gap tw/t8 (b-uniform charge over b-exact " +
    "interval weight) and the kernel-weighted aggregate head over-charge; " +
    "t8(u0,u1)=2(1-s minCos(u0 tau,u1 tau))/A is the imp-95334 b-exact " +
    "worst-in-cell weight, tw the imp-95329 b-uniform charge",
  ledger: [
    {
      cell: "rho=e^6, r=2",
      a: 6,
      b: 0.6931471805599453,
      bindChart: 114,
      gapN0: 3.220923529152803,
      gapNm1: 1.7677321590673625,
      gapNp1: 1.423547019479881,
      maxN0: 3.220923529152803,
      maxNm1: 2.29746207799495,
      maxNp1: 1.5447261042561387,
      aggHeadOverCharge: 2.5050402729215357,
    },
    {
      cell: "rho=e^6, r=e^3",
      a: 6,
      b: 3,
      bindChart: 114,
      gapN0: 2.4470358212297185,
      gapNm1: 1.9998712238666474,
      gapNp1: 3.21393602161041,
      maxN0: 2.4470358212297185,
      maxNm1: 2.358768938220129,
      maxNp1: 5.5930230215141234,
      aggHeadOverCharge: 2.375987160029827,
    },
    {
      cell: "rho=e^6, r=e^5.9",
      a: 6,
      b: 5.9,
      bindChart: 114,
      gapN0: 2.0369866457610892,
      gapNm1: 3.2260446398958447,
      gapNp1: 5.299138039893543,
      maxN0: 2.2016485718320356,
      maxNm1: 4.527612155655441,
      maxNp1: 6.137075497788417,
      aggHeadOverCharge: 2.347295196580872,
    },
  ],
  finding:
    "at the RZ-PEN6 binding chart the b-uniform t3 charge over-prices the " +
    "true head trace weight by 1.42-5.30x per term (kernel-weighted " +
    "aggregate 2.35-2.51x across all three cells) and up to ~6.1x at the " +
    "worst off-binding chart; the cap tw>=t8 binds at every head term of " +
    "every measured cell, and the over-charge grows toward the far head " +
    "term (n=+1) as r->sqrt(rho). This is the term-level view of the " +
    "floor-level t3 leg imp-95337 found dominant (75-100 percent): the " +
    "~2.4x head trace inflation is directly what the RZ-PEN8 b-exact trace " +
    "T8 removes",
  conventionLock:
    "the same normalization and head-term layout as imp-95337 " +
    "(chartT6/chartT8): tw is the imp-95329 b-uniform charge " +
    "c_alpha+min(kappa w^2, 2+4w^2/a^2), t8 the imp-95334 b-exact " +
    "worst-in-cell weight 2(1-s minCos)/A; the RZ-PEN6 binding chart " +
    "k=114 reproduces at all three cells",
  honestScope:
    "measurement only; no floor changed, promoted, or added; the ratios " +
    "compare two already-proven trace over-charges; the b-exact t8 is >= " +
    "the pointwise true weight so tw/t8 is a lower bound on the raw " +
    "pointwise over-charge; head terms n in {0,+-1} only (tail exhausted " +
    "by imp-95332); floors only, gains live at rho>~4 where no certificate " +
    "fires; rho=2 anchor and all onsets untouched; dyadic skeleton only; " +
    "model family only",
  verdict:
    "MEASUREMENT: term-by-term the b-uniform t3 trace charge over-prices " +
    "the b-exact head trace weight by 1.42-5.30x per head term (aggregate " +
    "2.35-2.51x) at rho=e^6, r in {2,e^3,e^5.9}, the cap binding at every " +
    "head term. This quantifies the imp-95332 b-uniform t3 head-weight gap " +
    "at term level and matches the imp-95337 floor-level finding that the " +
    "t3 leg carries the bulk of the residual. Changes no bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light; verbatim
// conventions of imp-95330/95331/95332/95334/95337)
// ---------------------------------------------------------------------------

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * PI) / a / Math.cosh((PI * w) / a);

function baseConstants(a) {
  const c = Math.cosh(a / 2);
  const pi2 = PI * PI;
  const kap = (4 * c) / (a * a);
  const e2 = Math.exp((-2 * pi2) / a);
  const e3 = Math.exp((-3 * pi2) / a);
  const tA = (((8 * PI) / a) * e3) / (1 - e2);
  const tQ = (((200 * PI ** 3) / a) * e3) / (1 - 4 * e2);
  return { kap, tA, tQ };
}
function pen3Constants(a) {
  const { kap, tA, tQ } = baseConstants(a);
  const kap2 = 4 / (a * a);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  const c3n = cAlpha * tA + Math.min(kap * tQ, 2 * tA + kap2 * tQ);
  return { tw, c3n, kap, kap2, cAlpha };
}
// imp-95334 LEMMA T-EXACT: interval cosine minimum and b-exact weight
function minCosOver(x0, x1) {
  const j0 = Math.ceil((x0 / PI - 1) / 2);
  const crit = (2 * j0 + 1) * PI;
  if (crit <= x1) return -1;
  return Math.min(Math.cos(x0), Math.cos(x1));
}
function t8weight(a, b, u0, u1) {
  const tau = b / a;
  const s = sechHalf(b);
  const A = 1 - s * s;
  const mc = minCosOver(u0 * tau, u1 * tau);
  return (2 * (1 - s * mc)) / A;
}

// RZ-PEN6 baseline floor per chart, to locate the binding chart
const sideSum = (th, a) => kernelP(2 * PI - th, a) + kernelP(2 * PI + th, a);
function chartV4(a, t0, t1) {
  const { tw, c3n } = pen3Constants(a);
  const P1 = kernelP(t1, a);
  const S0 = sideSum(t0, a);
  return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
}
function chartPsi5(a, t0, t1, mu) {
  const { tw, c3n } = pen3Constants(a);
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3n;
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}
function c3nChartParts(a, t0, t1, N = 12) {
  const { tw, kap, kap2, cAlpha } = pen3Constants(a);
  let s = 0;
  for (let m = 2; m <= N; m++) {
    s += tw(2 * PI * m + t1) * kernelP(2 * PI * m + t0, a);
    s += tw(2 * PI * m - t0) * kernelP(2 * PI * m - t1, a);
  }
  const pi2 = PI * PI;
  const e2 = Math.exp((-2 * pi2) / a);
  const eA = Math.exp((-(2 * N + 1) * pi2) / a);
  const tAr = (((8 * PI) / a) * eA) / (1 - e2);
  const tQr = (((8 * (2 * N + 3) ** 2 * PI ** 3) / a) * eA) / (1 - 4 * e2);
  const rem = cAlpha * tAr + Math.min(kap * tQr, 2 * tAr + kap2 * tQr);
  return { s, rem };
}
function chartT6(a, t0, t1, N = 12) {
  const { tw } = pen3Constants(a);
  const { s, rem } = c3nChartParts(a, t0, t1, N);
  return (
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    s +
    rem
  );
}
const chartXbase = (a, t0, t1) =>
  kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
function chartPsi6(a, t0, t1, mu, N = 12) {
  const X = chartXbase(a, t0, t1);
  const T = chartT6(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}
const prefactor = (a, b) =>
  Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;

function baseFloorBindingChart(a, b, K = 256, N = 12) {
  const mu = prefactor(a, b);
  let worst = Infinity;
  let kb = 0;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = Math.max(
      chartV4(a, t0, t1),
      chartPsi5(a, t0, t1, mu),
      chartPsi6(a, t0, t1, mu, N),
    );
    if (v < worst) {
      worst = v;
      kb = k;
    }
  }
  return kb;
}

// head-term over-charge factors tw / t8 for n in {0, -1, +1} at chart k
function headTermGaps(a, b, k, K = 256) {
  const { tw } = pen3Constants(a);
  const t0 = (PI * k) / K;
  const t1 = (PI * (k + 1)) / K;
  const terms = [
    { twArg: t1, u0: t0, u1: t1 },
    { twArg: 2 * PI - t0, u0: 2 * PI - t1, u1: 2 * PI - t0 },
    { twArg: 2 * PI + t1, u0: 2 * PI + t0, u1: 2 * PI + t1 },
  ];
  return terms.map((tm) => tw(tm.twArg) / t8weight(a, b, tm.u0, tm.u1));
}
// max per-head-term gap over all charts
function maxHeadTermGaps(a, b, K = 256) {
  const m = [0, 0, 0];
  for (let k = 0; k < K; k++) {
    const r = headTermGaps(a, b, k, K);
    r.forEach((v, i) => {
      if (v > m[i]) m[i] = v;
    });
  }
  return m;
}
// kernel-weighted aggregate head over-charge at chart k (capped like chartT8)
function aggregateHeadOverCharge(a, b, k, K = 256) {
  const { tw } = pen3Constants(a);
  const t0 = (PI * k) / K;
  const t1 = (PI * (k + 1)) / K;
  const terms = [
    { twArg: t1, u0: t0, u1: t1, P: kernelP(t0, a) },
    { twArg: 2 * PI - t0, u0: 2 * PI - t1, u1: 2 * PI - t0, P: kernelP(2 * PI - t1, a) },
    { twArg: 2 * PI + t1, u0: 2 * PI + t0, u1: 2 * PI + t1, P: kernelP(2 * PI + t0, a) },
  ];
  let uni = 0;
  let exa = 0;
  for (const tm of terms) {
    uni += tw(tm.twArg) * tm.P;
    exa += Math.min(t8weight(a, b, tm.u0, tm.u1), tw(tm.twArg)) * tm.P;
  }
  return uni / exa;
}

const REC = IMP95355_T3_HEAD_WEIGHT_GAP;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95355_ASSERTIONS = [
  {
    id: "imp95355-ledger-reproduces",
    description:
      "the baked head-weight-gap ledger reproduces from scratch (binding " +
      "chart, per-term gaps tw/t8, max-over-charts and aggregate) at every " +
      "cell to rel 1e-9",
    holds: () => {
      const rel = (x, y) =>
        Math.abs(y) < 1e-12 ? Math.abs(x - y) : Math.abs(x / y - 1);
      for (const row of REC.ledger) {
        const kb = baseFloorBindingChart(row.a, row.b);
        if (kb !== row.bindChart) return false;
        const g = headTermGaps(row.a, row.b, kb);
        const m = maxHeadTermGaps(row.a, row.b);
        const agg = aggregateHeadOverCharge(row.a, row.b, kb);
        if (rel(g[0], row.gapN0) > 1e-9) return false;
        if (rel(g[1], row.gapNm1) > 1e-9) return false;
        if (rel(g[2], row.gapNp1) > 1e-9) return false;
        if (rel(m[0], row.maxN0) > 1e-9) return false;
        if (rel(m[1], row.maxNm1) > 1e-9) return false;
        if (rel(m[2], row.maxNp1) > 1e-9) return false;
        if (rel(agg, row.aggHeadOverCharge) > 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: "imp95355-cap-binds-at-every-head-term",
    description:
      "the b-uniform charge over-prices the b-exact weight at every head " +
      "term of every cell (tw/t8 > 1), so the whole head over-charge is a " +
      "genuine surplus the RZ-PEN8 trace T8 removes",
    holds: () =>
      REC.ledger.every(
        (row) => row.gapN0 > 1 && row.gapNm1 > 1 && row.gapNp1 > 1,
      ),
  },
  {
    id: "imp95355-aggregate-over-charge-range",
    description:
      "the kernel-weighted aggregate head over-charge sits in 2.34-2.51x " +
      "across the three cells, matching the ~2.4x floor-level t3 leg found " +
      "dominant by imp-95337",
    holds: () =>
      REC.ledger.every(
        (row) =>
          row.aggHeadOverCharge > 2.34 && row.aggHeadOverCharge < 2.51,
      ),
  },
  {
    id: "imp95355-max-ge-binding",
    description:
      "the max-over-charts per-term gap dominates the binding-chart gap at " +
      "every head term of every cell (the worst chart is at or beyond the " +
      "binding chart)",
    holds: () =>
      REC.ledger.every(
        (row) =>
          row.maxN0 >= row.gapN0 * (1 - 1e-12) &&
          row.maxNm1 >= row.gapNm1 * (1 - 1e-12) &&
          row.maxNp1 >= row.gapNp1 * (1 - 1e-12),
      ),
  },
  {
    id: "imp95355-honesty-gate",
    description:
      "the record is measurement-only: no bound changed, NO QED, no refereed bound is changed" +
      ", and the head over-charge is named as the surplus RZ-PEN8 " +
      "removes (matching the imp-95337 t3 leg)",
    holds: () =>
      /MEASUREMENT/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /measurement only/.test(REC.honestScope) &&
      /RZ-PEN8 b-exact trace T8 removes/.test(REC.finding),
  },
];

for (const a of IMP95355_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95355-t3-head-weight-gap assertion failed: ${a.id}`);
  }
}

export default IMP95355_T3_HEAD_WEIGHT_GAP;
