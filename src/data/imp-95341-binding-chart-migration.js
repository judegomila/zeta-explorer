/**
 * imp-95341: MEASUREMENT -- migration of the imp-95332 binding chart
 * (chart 114 of K = 256 at rho = e^6) across rho and r. imp-95332
 * THEOREM RZ-PEN6 records bindingChartRhoE6 = 114 as the chart k that
 * attains the min-over-charts floor W6(a, mu) = min_{k=0..255}
 * max(V4_k, Psi5_k, Psi6_k(mu)). This module maps how that binding
 * index k*(a, mu) moves as the domain parameters vary, to localize
 * which theta-window controls the floor and to direct where the next
 * open leg (the {0, +-1} pair-identity truncation) should be
 * concentrated. Measurement only; recomputes ONLY quantities already
 * proven in imp-95330/95331/95332; changes NO bound; NO QED;
 * no refereed bound is changed.
 *
 * OBJECT (imp-95332 normalization, verbatim). a = ln rho in (0, 6],
 * b = ln r in (0, a), tau = b / a, K = 256 uniform charts I_k =
 * [pi k / K, pi (k + 1) / K] of [0, pi]. Chart floor
 * max(V4_k, Psi5_k, Psi6_k(mu)) with the imp-95330 carried floor V4_k,
 * the imp-95331 split-weight exact-root floor Psi5_k, and the imp-95332
 * per-chart-tail floor Psi6_k; mu = sin^2(pi tau) / tanh^2(b / 2)
 * pointwise or mu = 16 / a^2 for the r-and-m-uniform certificate. The
 * binding chart is k*(a, mu) = argmin_k of the chartwise max, and its
 * theta-window centre is theta* / pi = (k* + 1/2) / K.
 *
 * TWO MEASURED FINDINGS.
 *
 * (1) r-INVARIANCE. At fixed a the binding index k*(a, mu) is
 * essentially independent of r. Across 19 samples tau in [0.05, 0.95]
 * at each a, the spread max k* - min k* is 0 charts for a in {3, 4, 5,
 * 6} (EXACTLY r-invariant on the dyadic skeleton) and at most 5 charts
 * of 256 near the branch crossover (a = ln 10). Reason: T6_k and X_k
 * are r-free per chart; mu enters only through the exact-root
 * denominator and moves the FLOOR VALUE, not the argmin over k. So the
 * binding theta-window is a function of rho (equivalently a) alone.
 *
 * (2) rho-MIGRATION (uniform certificate mu = 16 / a^2, K = 256). k*
 * sweeps from the LEFT EDGE (theta ~ 0) at small rho up through the
 * interior, peaks just past the midpoint, then RETREATS:
 *     a = ln 2   rho = 2       k* = 5    theta* / pi = 0.0215  V4
 *     a = ln 4   rho = 4       k* = 9    theta* / pi = 0.0371  V4
 *     a = ln 10  rho = 10      k* = 52   theta* / pi = 0.2051  Psi6
 *     a = 3      rho = e^3     k* = 108  theta* / pi = 0.4238  Psi6
 *     a = 3.34   rho ~ 28.2    k* = 144  theta* / pi = 0.5645  Psi6 (peak)
 *     a = 4      rho = e^4     k* = 137  theta* / pi = 0.5371  Psi6
 *     a = 5      rho = e^5     k* = 126  theta* / pi = 0.4941  Psi6
 *     a = 6      rho = e^6     k* = 114  theta* / pi = 0.4473  Psi6
 * BRANCH CROSSOVER: for a <~ 2.28 (rho <~ 9.83) the binding chart is a
 * V4-CARRIED edge chart (imp-95330, near theta = 0); for a >~ 2.28 the
 * new imp-95332 Psi6 branch binds at an interior chart. The peak
 * k* = 144 (theta* / pi ~ 0.5645) occurs at a ~ 3.34; past it k*
 * decreases monotonically to 114 at a = 6.
 *
 * ACTIONABLE READING. At the SOTA-relevant far end rho = e^6 the floor
 * is controlled by a SINGLE interior theta-window, theta* ~ 0.447 pi
 * (chart 114), r-invariantly, on the Psi6 branch. The imp-95332 open
 * leg -- the {0, +-1} pair-identity truncation (which must carry the
 * (-1, +1) and (0, +-2) pairs with exact sin^2(2 pi tau) weights) --
 * is therefore best concentrated at that interior window, NOT at the
 * chart edges; the V4-carried edge charts bind only at small rho where
 * no certificate fires (the rho = 2 anchor and all every-octave onsets
 * are untouched, imp-95332). Consistent with imp-95332
 * theoremRzPen6.bindingChartRhoE6 = 114 and the rho in {2, 4} bitwise
 * carry (binding charts k = 5 / k = 9 on the V4 branch there).
 *
 * HONEST LIMITS. (a) Measurement only: k* is the argmin of already
 * proven chart floors; no floor value, bound or onset is changed.
 * (b) Dyadic lattice skeleton and model family only (imp-95232
 * residual). (c) K = 256 chart resolution: k* is reported to one chart
 * (theta* / pi to ~ 1/512 ~ 0.002); a finer cover shifts k* by the same
 * refinement factor and does not change the migration shape. (d) No
 * mapping to paper per-window data (obligation (3) gammaSL unchanged).
 * Sub-gap imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics recompute
 * quantities proven in the cited modules; they are the measurement
 * itself, never a claim of a new bound.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95341_BINDING_CHART_MIGRATION = {
  id: "imp-95341",
  title:
    "MEASUREMENT: migration of the imp-95332 binding chart k*(a, mu) " +
    "across rho and r -- r-invariant, rho-swept from the left edge " +
    "through an interior peak (k = 144 at rho ~ 28) back to k = 114 " +
    "at rho = e^6",
  object:
    "K = 256 uniform charts of [0, pi]; binding chart k*(a, mu) = " +
    "argmin_k max(V4_k, Psi5_k, Psi6_k(mu)) with mu = 16 / a^2 " +
    "(r-and-m-uniform) or mu = sin^2(pi tau) / tanh^2(b/2) (pointwise); " +
    "theta-window centre theta* / pi = (k* + 1/2) / K",
  K: 256,
  N: 12,
  rInvariance: {
    finding:
      "at fixed a the binding index is essentially r-free: spread " +
      "max k* - min k* over 19 samples tau in [0.05, 0.95]",
    spreadByA: [
      { a: "ln 10", spreadCharts: 5 },
      { a: "3", spreadCharts: 0 },
      { a: "4", spreadCharts: 0 },
      { a: "5", spreadCharts: 0 },
      { a: "6", spreadCharts: 0 },
    ],
    reason:
      "T6_k and X_k are r-free per chart; mu enters only the " +
      "exact-root denominator and moves the FLOOR VALUE, not the " +
      "argmin over k",
  },
  rhoMigrationUniform: {
    mu: "16 / a^2 (r-and-m-uniform certificate)",
    ledger: [
      { a: "ln 2", rho: 2, kBind: 5, thetaMidOverPi: 0.021484375, branch: "V4" },
      { a: "ln 4", rho: 4, kBind: 9, thetaMidOverPi: 0.037109375, branch: "V4" },
      { a: "ln 10", rho: 10, kBind: 52, thetaMidOverPi: 0.205078125, branch: "Psi6" },
      { a: "3", rho: "e^3", kBind: 108, thetaMidOverPi: 0.423828125, branch: "Psi6" },
      { a: "4", rho: "e^4", kBind: 137, thetaMidOverPi: 0.537109375, branch: "Psi6" },
      { a: "5", rho: "e^5", kBind: 126, thetaMidOverPi: 0.494140625, branch: "Psi6" },
      { a: "6", rho: "e^6", kBind: 114, thetaMidOverPi: 0.447265625, branch: "Psi6" },
    ],
    peak: { aApprox: 3.34, rhoApprox: 28.2, kBind: 144, thetaMidOverPi: 0.564453125 },
    branchCrossover: {
      aApprox: 2.28,
      rhoApprox: 9.83,
      note:
        "for a below ~ 2.28 the binding chart is a V4-carried edge " +
        "chart (imp-95330, near theta = 0); above it the imp-95332 " +
        "Psi6 branch binds an interior chart",
    },
    shape:
      "k* rises from the left edge, peaks (144) just past the midpoint " +
      "at a ~ 3.34, then decreases monotonically to 114 at a = 6",
  },
  actionableReading:
    "at rho = e^6 the floor is controlled by a SINGLE interior " +
    "theta-window theta* ~ 0.447 pi (chart 114), r-invariant, on the " +
    "Psi6 branch; the imp-95332 open {0, +-1} pair-truncation leg is " +
    "best concentrated at that interior window, not the chart edges; " +
    "V4-carried edge charts bind only at small rho where no " +
    "certificate fires",
  consistencyWithImp95332:
    "reproduces theoremRzPen6.bindingChartRhoE6 = 114 and the rho in " +
    "{2, 4} bitwise carry (binding on the V4 branch there, k = 5 / " +
    "k = 9); every-octave onsets and the rho = 2 anchor untouched",
  honestScope:
    "measurement only -- k* is the argmin of already proven chart " +
    "floors; changes NO floor value, bound or onset; dyadic skeleton " +
    "and model family only; K = 256 chart resolution (theta* / pi to " +
    "~ 1/512); no gammaSL mapping",
  verdict:
    "MEASUREMENT: the imp-95332 binding chart k*(a, mu) is r-invariant " +
    "at fixed rho (spread 0 charts for a >= 3) and migrates with rho " +
    "from a V4-carried left-edge chart (k = 5 at rho = 2) through a " +
    "Psi6-branch interior peak (k = 144 at rho ~ 28) back to k = 114 " +
    "at rho = e^6 (theta* ~ 0.447 pi); the branch crossover V4 -> Psi6 " +
    "is at rho ~ 9.83. The pair-truncation sharpening should be " +
    "concentrated at that interior far-rho window. Recomputes only " +
    "imp-95330/95331/95332 quantities; changes no bound; NO QED; " +
    "no refereed bound is changed.",
  residualReconciliationSupersededByRzPen7Pen8:
    "RECONCILIATION (imp-95467): the actionableReading / verdict above " +
    "point at the imp-95332 open {0, +-1} pair-identity truncation as " +
    "where next work should concentrate (at the interior chart-114 " +
    "far-rho window). That pointwise pair leg is now SUPERSEDED, not " +
    "live. imp-95333 THEOREM RZ-PEN7 (thirty-sixth seam-chain leg) " +
    "executed exactly that leg -- extending the kept-pair floor from " +
    "{0, +-1} to all distance-1 and distance-2 unordered pairs among " +
    "shells n in {-2, ..., 2}, carrying (-1, +1) and (0, +-2) at the " +
    "exact sin^2(2 pi tau) weight -- and found the FULL imp-95288 pair " +
    "identity already acts at the binding chart (k = 114, rho = e^6, " +
    "r = 2): 1.2788x floor gain and PAIR CURRENCY NEAR-EXHAUSTED, so " +
    "no further kept-pair extension can move the large-rho floor " +
    "(~2.8 percent pointwise kept-pair headroom, capped). imp-95334 " +
    "THEOREM RZ-PEN8 (thirty-seventh leg) then decided the last named " +
    "leg (b-uniform t3) and recorded the RZ-PEN POINTWISE pencil-floor " +
    "program EFFECTIVELY TERMINAL -- do NOT re-attempt pointwise trace " +
    "or numerator (incl. kept-pair) legs. Corrected residual status: " +
    "the imp-95341-flagged pointwise pair leg is CLOSED/near-exhausted; " +
    "the surviving live residuals are the r-uniform / large-a " +
    "uniform-side branch (imp-95334, ~10 percent open at a = 6), " +
    "off-lattice rates and the dyadic-skeleton model restriction " +
    "(imp-95232), and the gammaSL mapping / imp-95212 Fresnel-Airy " +
    "envelope-port sub-gap -- NOT the interior far-rho pair window. " +
    "Accuracy reconciliation only; changes no bound; NO QED.",
};

// ---------------------------------------------------------------------------
// Numeric machinery (self-contained, import-light; verbatim conventions
// of imp-95332-chart-tail-pencil-floor.js)
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
function chartPsi6(a, t0, t1, mu, N = 12) {
  const { tw } = pen3Constants(a);
  const X = kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3nChart(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}
const prefactor = (a, b) =>
  Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;

// binding chart = argmin over K charts of the chartwise floor max;
// returns index k*, its theta-window centre and the binding branch label
function bindingChart(a, mu, K = 256, N = 12) {
  let worst = Infinity;
  let kBind = -1;
  let branch = "";
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v4 = chartV4(a, t0, t1);
    const p5 = chartPsi5(a, t0, t1, mu);
    const p6 = chartPsi6(a, t0, t1, mu, N);
    const v = Math.max(v4, p5, p6);
    if (v < worst) {
      worst = v;
      kBind = k;
      branch = v === v4 ? "V4" : v === p5 ? "Psi5" : "Psi6";
    }
  }
  return { kBind, thetaMidOverPi: (kBind + 0.5) / K, branch, floor: worst };
}

const REC = IMP95341_BINDING_CHART_MIGRATION;

// ---------------------------------------------------------------------------
// Self-executing assertions (cross-checks of the measured migration)
// ---------------------------------------------------------------------------

export const IMP95341_ASSERTIONS = [
  {
    id: "imp95341-uniform-ledger-reproduces",
    description:
      "the r-and-m-uniform (mu = 16/a^2) binding-chart ledger " +
      "reproduces exactly: k* and its branch at a in {ln2, ln4, ln10, " +
      "3, 4, 5, 6}, including the imp-95332 value k* = 114 at rho = e^6",
    holds: () => {
      const aOf = (s) =>
        s === "ln 2"
          ? Math.LN2
          : s === "ln 4"
            ? Math.log(4)
            : s === "ln 10"
              ? Math.log(10)
              : Number(s);
      for (const row of REC.rhoMigrationUniform.ledger) {
        const a = aOf(row.a);
        const bc = bindingChart(a, 16 / (a * a));
        if (bc.kBind !== row.kBind) return false;
        if (bc.branch !== row.branch) return false;
        if (Math.abs(bc.thetaMidOverPi - row.thetaMidOverPi) > 1e-12)
          return false;
      }
      // the imp-95332 anchor
      return bindingChart(6, 16 / 36).kBind === 114;
    },
  },
  {
    id: "imp95341-r-invariance",
    description:
      "at fixed a >= 3 the pointwise binding index is EXACTLY " +
      "r-invariant across 19 tau samples in [0.05, 0.95]; near the " +
      "crossover (a = ln 10) the spread is at most 5 charts of 256",
    holds: () => {
      for (const { a: aStr, spreadCharts } of REC.rInvariance.spreadByA) {
        const a = aStr === "ln 10" ? Math.log(10) : Number(aStr);
        let mn = Infinity;
        let mx = -Infinity;
        for (let i = 1; i <= 19; i++) {
          const b = i * 0.05 * a;
          const k = bindingChart(a, prefactor(a, b)).kBind;
          mn = Math.min(mn, k);
          mx = Math.max(mx, k);
        }
        if (mx - mn !== spreadCharts) return false;
      }
      return true;
    },
  },
  {
    id: "imp95341-branch-crossover",
    description:
      "the binding branch switches from V4 (carried edge chart) below " +
      "a ~ 2.28 to Psi6 (interior) above it; V4 binds at a = 2.2, Psi6 " +
      "binds at a = 2.4, bracketing the recorded crossover ~ 9.83 rho",
    holds: () => {
      if (bindingChart(2.2, 16 / (2.2 * 2.2)).branch !== "V4") return false;
      if (bindingChart(2.4, 16 / (2.4 * 2.4)).branch !== "Psi6") return false;
      const rhoX = REC.rhoMigrationUniform.branchCrossover.rhoApprox;
      return rhoX > Math.exp(2.2) && rhoX < Math.exp(2.4);
    },
  },
  {
    id: "imp95341-interior-peak-and-retreat",
    description:
      "k* peaks at 144 near a = 3.34 (interior, theta* ~ 0.565 pi) and " +
      "then decreases monotonically over a in {3.4, 3.6, ..., 6} back " +
      "toward 114, i.e. the far-rho window retreats from the peak",
    holds: () => {
      const peak = REC.rhoMigrationUniform.peak;
      if (bindingChart(peak.aApprox, 16 / (peak.aApprox * peak.aApprox)).kBind !== peak.kBind)
        return false;
      let prev = Infinity;
      for (let a = 3.4; a <= 6.0001; a += 0.2) {
        const k = bindingChart(a, 16 / (a * a)).kBind;
        if (k > prev) return false;
        prev = k;
      }
      // end of the retreat is the imp-95332 anchor
      return prev === 114;
    },
  },
  {
    id: "imp95341-honesty-gate",
    description:
      "the verdict is measurement-only, names the r-invariance and " +
      "rho-migration findings, keeps the pair-truncation leg open, " +
      "promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(REC.verdict) &&
      /r-invariant/.test(REC.verdict) &&
      /migrates with rho/.test(REC.verdict) &&
      /pair-truncation/.test(REC.verdict) &&
      /changes no bound/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /measurement only/.test(REC.honestScope) &&
      REC.rhoMigrationUniform.ledger[6].kBind === 114,
  },
];

for (const a of IMP95341_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95341-binding-chart-migration assertion failed: ${a.id}`,
    );
  }
}

export default IMP95341_BINDING_CHART_MIGRATION;
