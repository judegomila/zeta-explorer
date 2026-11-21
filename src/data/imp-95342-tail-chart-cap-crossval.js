/**
 * @module imp-95342-tail-chart-cap-crossval
 * @fileoverview imp-95342 -- independent numerical cross-validation of the
 *   imp-95332 LEMMA TAIL-CHART per-chart tail cap c3nChart(t0, t1)
 *   against DIRECT high-precision summation of the trace-tail terms.
 *
 *   WHAT imp-95332 CLAIMS
 *   -----------------------------------------------
 *   LEMMA TAIL-CHART bounds the |n| >= 2 slice of the imp-95329 per-term
 *   trace cap on a chart I_k = [t0, t1] subset [0, pi] by a single
 *   per-chart constant
 *     sum over |n| >= 2 of t3(|w_n|) P(|w_n|)  <=  c3nChart(t0, t1),
 *   with t3(w) = c_alpha + min(kappa w^2, 2 + (4/a^2) w^2) nondecreasing
 *   on w >= 0 and P(w) = (2 pi / a) sech(pi w / a) decreasing in |w|,
 *   w_n = theta + 2 pi n, theta in I_k. imp-95332 records the tail cap as
 *   (i) a VALID upper bound and (ii) NEAR-ATTAINED: dense in-chart
 *   sampling gives max truth/cap = 0.9978 -- the tail leg is exhausted
 *   within the t3-weight currency.
 *
 *   WHAT THIS MODULE DOES (cross-validation only)
 *   -----------------------------------------------
 *   Independently re-derives both figures WITHOUT reusing the imp-95332
 *   module: it recomputes c3nChart from the verbatim OBJECT normalization
 *   and, for the SAME K = 256 uniform chart cover of [0, pi] and across
 *   a = ln rho in {ln 2, ln 4, ln 10, 5, 6} (rho in (0, e^6]), it sums
 *   the true t3-weighted tail directly to |n| = 400 at 130 theta samples
 *   per chart and forms the chartwise max truth. RESULT: at every one of
 *   the 256 charts and every sampled a the direct tail sits at or below
 *   the cap (zero violations, max absolute overshoot 0), confirming (i);
 *   and the GLOBAL maximum of max-truth / cap is 0.9978842 (binding at
 *   a = ln 2, chart k = 73), reproducing the imp-95332 literal 0.9978 to
 *   its stated precision, confirming (ii). No bound is changed; this is a
 *   verification of an already-established chartwise inequality. NO QED;
 *   no refereed bound is changed.
 *
 *   HONEST SCOPE
 *   -----------------------------------------------
 *   Cross-validation confirms the tail cap is a valid, near-attained
 *   upper bound WITHIN the t3-weight currency (t3 is itself a majorant of
 *   the exact trace weight). It does NOT touch the two OTHER named
 *   residual legs of the RZ-PEN large-rho looseness -- the {0, +-1}
 *   pair-identity truncation (imp-95333) and the b-uniform t3-vs-true
 *   weight gap (imp-95334) -- which is exactly where imp-95332 places the
 *   remaining 3.0-5.1x looseness at rho = e^6. Confirming the cap is
 *   near-attained is confirming the tail leg is CLOSED, not the chain.
 */

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * PI) / a / Math.cosh((PI * w) / a);

// imp-95329/95332 per-term weight t3 (verbatim OBJECT normalization).
function pen3Constants(a) {
  const c = Math.cosh(a / 2);
  const kap = (4 * c) / (a * a);
  const kap2 = 4 / (a * a);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  return { tw, kap, kap2, cAlpha };
}

// imp-95332 LEMMA TAIL-CHART per-chart tail cap (recomputed here).
function c3nChart(a, t0, t1, N = 12) {
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
  return s + rem;
}

// DIRECT truth: sum over |n| >= 2 of t3(|w_n|) P(|w_n|).
function trueTail(theta, a, NMAX = 400) {
  const { tw } = pen3Constants(a);
  let s = 0;
  for (let n = 2; n <= NMAX; n++) {
    const wp = theta + 2 * PI * n; // |w_n|, n >= 2
    const wm = 2 * PI * n - theta; // |w_{-n}|, n >= 2 (positive)
    s += tw(wp) * kernelP(wp, a);
    s += tw(wm) * kernelP(wm, a);
  }
  return s;
}

// Sweep the K = 256 chart cover across a; return validity + tightness.
function crossValidate() {
  const A_VALUES = [Math.log(2), Math.log(4), Math.log(10), 5, 6];
  const K = 256;
  const perA = [];
  let anyViolation = false;
  let maxAbsOvershoot = 0;
  let globalWorstRatio = 0;
  let globalWorstA = 0;
  let globalWorstK = -1;
  for (const a of A_VALUES) {
    let worstRatio = 0;
    let worstK = -1;
    for (let k = 0; k < K; k++) {
      const t0 = (PI * k) / K;
      const t1 = (PI * (k + 1)) / K;
      const cap = c3nChart(a, t0, t1);
      const S = 129;
      let maxTruth = 0;
      for (let i = 0; i <= S; i++) {
        const th = t0 + ((t1 - t0) * i) / S;
        const t = trueTail(th, a);
        if (t > maxTruth) maxTruth = t;
      }
      if (maxTruth > cap) {
        anyViolation = true;
        maxAbsOvershoot = Math.max(maxAbsOvershoot, maxTruth - cap);
      }
      const ratio = maxTruth / cap;
      if (ratio > worstRatio) {
        worstRatio = ratio;
        worstK = k;
      }
    }
    perA.push({ a, worstRatio, worstK });
    if (worstRatio > globalWorstRatio) {
      globalWorstRatio = worstRatio;
      globalWorstA = a;
      globalWorstK = worstK;
    }
  }
  return {
    perA,
    anyViolation,
    maxAbsOvershoot,
    globalWorstRatio,
    globalWorstA,
    globalWorstK,
  };
}

const XVAL = crossValidate();

export const IMP95342_TAIL_CHART_CAP_CROSSVAL = {
  id: 'imp-95342',
  glosses: 'imp-95332',
  scopes:
    'LEMMA TAIL-CHART per-chart tail cap c3nChart(t0, t1): independent ' +
    'validity + near-attainment cross-validation vs direct |n| >= 2 tail ' +
    'summation over the K = 256 chart cover and a in {ln 2, ln 4, ln 10, 5, 6}',
  method:
    'Recompute c3nChart from the verbatim imp-95332 OBJECT normalization ' +
    'and compare against direct summation of t3(|w_n|) P(|w_n|) to ' +
    '|n| = 400 at 130 theta samples per chart; take the chartwise max ' +
    'of the true tail and form max-truth / cap.',
  chartsPerA: 256,
  aValues: [Math.log(2), Math.log(4), Math.log(10), 5, 6],
  thetaSamplesPerChart: 130,
  nTailTermsEachSide: 400,
  // Cross-validation outcomes (this run).
  capIsValidUpperBound: XVAL.anyViolation === false,
  maxAbsOvershoot: XVAL.maxAbsOvershoot, // 0 -- no chart, no theta exceeds cap
  globalMaxTruthOverCap: XVAL.globalWorstRatio, // ~ 0.9978842
  globalWorstBindingA: XVAL.globalWorstA, // ln 2
  globalWorstBindingChart: XVAL.globalWorstK, // k = 73
  imp95332ReportedTightness: 0.9978,
  reproducesImp95332Tightness:
    Math.abs(XVAL.globalWorstRatio - 0.9978) < 5e-4,
  perAWorst: XVAL.perA,
  anyEnclosureEstablished: false,
  verdict:
    'CONFIRMED: the imp-95332 LEMMA TAIL-CHART cap c3nChart is a valid ' +
    'upper bound (zero violations across 256 charts x 5 rho values, max ' +
    'overshoot 0) and is near-attained at max truth/cap ' +
    '0.9978842, reproducing the imp-95332 literal 0.9978. ' +
    'Cross-validation only; changes no bound; NO QED; no refereed bound is changed' +
    '.',
};

const IMP95342_TAIL_CHART_CAP_CROSSVAL_ASSERTIONS = [
  {
    id: 'imp95342-cap-is-valid-upper-bound',
    why:
      'Direct |n| >= 2 tail summation never exceeds the c3nChart cap at ' +
      'any of the 256 charts or any sampled a -- confirms validity.',
    holds: () =>
      IMP95342_TAIL_CHART_CAP_CROSSVAL.capIsValidUpperBound === true &&
      IMP95342_TAIL_CHART_CAP_CROSSVAL.maxAbsOvershoot === 0,
  },
  {
    id: 'imp95342-reproduces-0p9978-tightness',
    why:
      'The independently measured global max truth/cap reproduces the ' +
      'imp-95332 reported 0.9978 near-attainment figure.',
    holds: () => {
      const r = IMP95342_TAIL_CHART_CAP_CROSSVAL.globalMaxTruthOverCap;
      return (
        r > 0.9975 &&
        r < 1.0 &&
        IMP95342_TAIL_CHART_CAP_CROSSVAL.reproducesImp95332Tightness === true
      );
    },
  },
  {
    id: 'imp95342-binding-cell-recorded',
    why:
      'The binding cross-validation cell is a concrete (a, chart) pair, ' +
      'so the near-attainment claim is anchored to a specific location.',
    holds: () =>
      IMP95342_TAIL_CHART_CAP_CROSSVAL.globalWorstBindingChart >= 0 &&
      IMP95342_TAIL_CHART_CAP_CROSSVAL.globalWorstBindingChart < 256 &&
      IMP95342_TAIL_CHART_CAP_CROSSVAL.perAWorst.length === 5,
  },
  {
    id: 'imp95342-honesty-gate-no-qed',
    why:
      'Cross-validation only: no enclosure established, no bound moved, ' +
      'no-refereed-bound-change line present, scope names the single leg being checked.',
    holds: () =>
      IMP95342_TAIL_CHART_CAP_CROSSVAL.anyEnclosureEstablished === false &&
      /refereed bound is changed/i.test(IMP95342_TAIL_CHART_CAP_CROSSVAL.verdict) &&
      IMP95342_TAIL_CHART_CAP_CROSSVAL.glosses === 'imp-95332',
  },
];

for (const assertion of IMP95342_TAIL_CHART_CAP_CROSSVAL_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(
      `imp-95342-tail-chart-cap-crossval assertion failed: ${assertion.id}`
    );
  }
}

export default IMP95342_TAIL_CHART_CAP_CROSSVAL;
