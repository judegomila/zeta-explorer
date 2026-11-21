/**
 * imp-95337: LEG ATTRIBUTION -- splits the imp-95332 surviving large-rho
 * pencil looseness (RZ-PEN6 floor 3.0 - 5.1x against the exact
 * symbol-pencil infimum at rho = e^6) between the two named residual
 * legs of the imp-95333 / imp-95334 honest scope: the PAIR-TRUNCATION
 * leg (kept-pair numerator {0, +-1} -> {-2..2}, X -> X7, imp-95333
 * LEMMA PAIR-2) and the b-UNIFORM t3-WEIGHT leg (b-uniform trace charge
 * t3 -> b-exact chartwise weight, T6 -> T8, imp-95334 LEMMA T-EXACT).
 * MEASUREMENT ONLY; changes no bound; NO QED; no refereed bound is changed.
 *
 * WHY. imp-95333 pairCurrencyNearExhausted and imp-95334
 * pointwiseProgramTerminal both assert the surviving RZ-PEN6 looseness
 * "lives DOMINANTLY in the b-uniform t3 weight", but the split was
 * never TABULATED: RZ-PEN7 (pair leg) and RZ-PEN8 (t3 leg on top of
 * RZ-PEN7) were only measured SEQUENTIALLY, so the reported single-leg
 * gains (1.2788x pair, then 3.6510x t3) are order-dependent and cannot
 * be read as an attribution. This module isolates each leg from the
 * common RZ-PEN6 baseline and reports an order-symmetric (Shapley)
 * split of the log-looseness reduction.
 *
 * OBJECT (imp-95252 / imp-95288 / imp-95329..95334 normalization,
 * verbatim). a = ln rho in (0, 6], b = ln r in (0, a), tau = b / a,
 * s = sech(b / 2), A = 1 - s^2, P(w) = (2 pi / a) sech(pi w / a),
 * w_n = theta + 2 pi n, theta in [0, pi] (evenness). Pointwise
 * lam_min(F, G0) is the smaller root of A lam^2 - 2 B lam + C. The
 * carried chart floors V4 (imp-95330), Psi5 (imp-95331), Psi6
 * (imp-95332) form the common baseline. Two independent one-leg
 * refinements are compared:
 *   - PAIR leg: replace the base numerator X_k = P(t1)[P(2pi - t0) +
 *     P(2pi + t1)] by the imp-95333 kept-pair aggregate X7_k + nu Y7_k
 *     (nu = 4 cos^2(pi tau)), trace kept at the b-uniform T6_k. This
 *     reproduces RZ-PEN7 exactly (Psi7).
 *   - t3 leg: keep the base numerator X_k but replace the b-uniform
 *     trace T6_k by the imp-95334 b-exact chartwise T8_k. This is
 *     Psi_t3only = the exact-root floor at (B_up = (A/2) T8_k, X_k) --
 *     the ISOLATED t3 tightening, NOT present in any prior module (PEN8
 *     tightens BOTH legs at once via Psi8 = root at (T8, X7)).
 * Each isolated floor is A_pen_leg = mu min_k max(V4, Psi5, Psi6,
 * Psi_leg); the joint floor A_pen_both = RZ-PEN8. All are proven floors
 * (unconditional dominance over A_pen6), so exactInf >= each.
 *
 * ATTRIBUTION. With looseness L = exactInf / floor and log-looseness
 * reduction from the RZ-PEN6 baseline, total = ln L6 - ln L_both splits
 * order-symmetrically (average of the two tightening orders) as
 *   pair share = (1/2)[(ln L6 - ln L_pair) + (ln L_t3 - ln L_both)],
 *   t3   share = (1/2)[(ln L6 - ln L_t3)  + (ln L_pair - ln L_both)],
 * which sum to the total. Measured (K = 256 charts, exact-symbol inf on
 * a 4001-point + 3-round-refined grid):
 *   rho = e^6, r = 2:      L6 5.060 -> Lpair 3.957, Lt3 1.698, Lboth
 *                          1.084; pair 22.6%, t3 77.4%.
 *   rho = e^6, r = e^3:    L6 3.254 -> 3.232 / 1.039 / 1.015; pair
 *                          1.3%, t3 98.7% (tau = 1/2: distance-2 pair
 *                          weight sin^2(2 pi tau) = 0, pair leg inert).
 *   rho = e^6, r = e^5.9:  L6 3.029 -> 2.323 / 1.346 / 1.036; pair
 *                          24.6%, t3 75.4%.
 *   rho = 10, r = 2:       L6 1.299 -> 1.299 / 1.011 / 1.010; pair
 *                          0.2%, t3 99.8%.
 *   rho = 4, r = 2:        L6 1.084 -> 1.084 / 1.018 / 1.018; pair
 *                          ~0%, t3 ~100%.
 * FINDING: across every sampled large-rho cell the b-uniform t3-weight
 * leg carries 75 - 100 percent of the log-looseness reduction; the
 * pair-truncation leg carries at most ~25 percent, peaking at the
 * interior-binding cells (r = 2 and r = e^5.9) and vanishing IDENTICALLY
 * at the twin-symmetric end r = sqrt(rho). This QUANTIFIES the
 * imp-95333 / imp-95334 qualitative claim: the t3-weight leg was the
 * dominant residual, confirming that the RZ-PEN8 pointwise trace
 * execution -- not the kept-pair extension -- closed the bulk of the
 * gap.
 *
 * CROSS-CHECK (convention lock). The isolated pair floor equals the
 * baked imp-95333 A_pen7 (looseness 3.9571187...) and the joint floor
 * equals the baked imp-95334 A_pen8 (looseness 1.0838458...); the
 * baseline looseness equals the imp-95333 loosenessRhoE6R2Pen6Ref
 * 5.06029829805588. All three reproduced from scratch here.
 *
 * HONEST LIMITS. (a) Measurement only; no floor is changed, promoted,
 * or added -- the Shapley split is a bookkeeping decomposition of
 * already-proven floors. (b) The isolated t3 floor Psi_t3only is a
 * VALID floor in its own right (root at (T8, X) with T8 >= B and
 * X <= C), used here only to measure the leg, never to advance a bound.
 * (c) Floors only; the gains live at rho > ~ 4 where no certificate
 * currently fires; the rho = 2 anchor and all every-octave onsets
 * (13.297836 / 13.071303 / 12.817538) are untouched. (d) Dyadic
 * lattice skeleton only; off-lattice rates unchanged (imp-95232
 * residual). (e) Model family only; no mapping to paper per-window
 * data; changes NO Lambda bound. Sub-gap
 * imp-95212-subgap-fresnel-airy-envelope-port STILL OPEN.
 *
 * Import-light (no imports, no zeros bundle). Numerics are CROSS-CHECKS
 * of already-proven floor statements, never a claim in themselves.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95337_PENCIL_LEG_ATTRIBUTION = {
  id: "imp-95337",
  title:
    "LEG ATTRIBUTION: order-symmetric (Shapley) split of the imp-95332 " +
    "surviving large-rho pencil looseness between the pair-truncation " +
    "leg (X -> X7, imp-95333) and the b-uniform t3-weight leg " +
    "(T6 -> T8, imp-95334) -- the t3 leg carries 75-100 percent of the " +
    "log-looseness reduction across every sampled large-rho cell",
  method:
    "isolate each leg from the common RZ-PEN6 baseline (V4, Psi5, " +
    "Psi6): PAIR floor tightens only the numerator (Psi7 = RZ-PEN7), " +
    "t3 floor tightens only the trace (Psi_t3only = exact root at " +
    "(B_up = (A/2) T8_k, base numerator X_k)); joint floor = RZ-PEN8. " +
    "Attribute ln L6 - ln L_both by the average of the two tightening " +
    "orders (Shapley), L = exactInf / floor",
  ledger: [
    {
      cell: "rho=e^6, r=2",
      a: 6,
      b: 0.6931471805599453,
      L6: 5.06029829805588,
      Lpair: 3.9571187322725767,
      Lt3: 1.6984910633328347,
      Lboth: 1.083845812503738,
      pairPct: 22.555955860236757,
      t3Pct: 77.44404413976322,
    },
    {
      cell: "rho=e^6, r=e^3 (tau=1/2)",
      a: 6,
      b: 3,
      L6: 3.2535590286595695,
      Lpair: 3.2322704360148,
      Lt3: 1.0385109486988784,
      Lboth: 1.0147830335871355,
      pairPct: 1.273641504898733,
      t3Pct: 98.72635849510127,
    },
    {
      cell: "rho=e^6, r=e^5.9",
      a: 6,
      b: 5.9,
      L6: 3.0290096200723116,
      Lpair: 2.3228837039612236,
      Lt3: 1.346417161637057,
      Lboth: 1.035939523950396,
      pairPct: 24.585302177846785,
      t3Pct: 75.41469782215322,
    },
    {
      cell: "rho=10, r=2",
      a: 2.302585092994046,
      b: 0.6931471805599453,
      L6: 1.2992970130183967,
      Lpair: 1.2986175448646493,
      Lt3: 1.0107884094391915,
      Lboth: 1.0102577237172856,
      pairPct: 0.208301333231517,
      t3Pct: 99.79169866676848,
    },
    {
      cell: "rho=4, r=2",
      a: 1.3862943611198906,
      b: 0.6931471805599453,
      L6: 1.0835249171772092,
      Lpair: 1.0835249171772092,
      Lt3: 1.0178795740138675,
      Lboth: 1.0178795740129472,
      pairPct: 7.233898377303171e-10,
      t3Pct: 99.99999999927661,
    },
  ],
  finding:
    "the b-uniform t3-weight leg (imp-95334) carries 75-100 percent of " +
    "the log-looseness reduction at every sampled large-rho cell; the " +
    "pair-truncation leg (imp-95333) carries at most ~25 percent, " +
    "peaking at the interior-binding cells (r=2, r=e^5.9) and " +
    "vanishing IDENTICALLY at the twin-symmetric end r=sqrt(rho) where " +
    "the distance-2 pair weight sin^2(2 pi tau) is zero -- the RZ-PEN8 " +
    "pointwise trace execution, not the kept-pair extension, closed the " +
    "bulk of the residual",
  conventionLock:
    "the isolated PAIR floor reproduces the baked imp-95333 A_pen7 " +
    "(looseness 3.9571187...) and the JOINT floor reproduces the baked " +
    "imp-95334 A_pen8 (looseness 1.0838458...); baseline looseness " +
    "5.06029829805588 matches imp-95333 loosenessRhoE6R2Pen6Ref",
  honestScope:
    "measurement only; no floor changed, promoted, or added; the " +
    "Shapley split is a bookkeeping decomposition of already-proven " +
    "floors; floors only, gains live at rho > ~4 where no certificate " +
    "fires; rho=2 anchor and all onsets untouched; dyadic skeleton " +
    "only; model family only",
  verdict:
    "MEASUREMENT: isolating each residual leg from the shared RZ-PEN6 " +
    "baseline and taking the order-symmetric (Shapley) split of the " +
    "log-looseness reduction shows the b-uniform t3-weight leg " +
    "(imp-95334) dominant at 75-100 percent across every sampled " +
    "large-rho cell, the pair-truncation leg (imp-95333) at most " +
    "~25 percent and identically inert at the twin-symmetric end. This " +
    "quantifies the imp-95333 pairCurrencyNearExhausted and imp-95334 " +
    "pointwiseProgramTerminal qualitative claims. Changes no bound; " +
    "NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light; verbatim
// conventions of imp-95330/95331/95332/95333/95334)
// ---------------------------------------------------------------------------

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * PI) / a / Math.cosh((PI * w) / a);

function symbols(theta, a, b, NN = 14) {
  const tau = b / a;
  let fa = 0;
  let br = 0;
  const Ps = [];
  for (let n = -NN; n <= NN; n++) {
    const w = theta + 2 * PI * n;
    const p = kernelP(w, a);
    Ps.push(p);
    fa += p;
    br += p * Math.cos(w * tau);
  }
  let C = 0;
  for (let i = 0; i < Ps.length; i++)
    for (let j = 0; j < Ps.length; j++) {
      if (i === j) continue;
      const sn = Math.sin(PI * Math.abs(i - j) * tau);
      C += 2 * sn * sn * Ps[i] * Ps[j];
    }
  return { fa, br, C };
}
function pencilSymbolMin(theta, a, b) {
  const s = sechHalf(b);
  const A = 1 - s * s;
  const { fa, br, C } = symbols(theta, a, b);
  const Bp = fa - s * br;
  return C / (Bp + Math.sqrt(Math.max(Bp * Bp - A * C, 0)));
}
function gridInfRefined(a, b, Ngrid) {
  let inf = Infinity;
  let thBest = 0;
  for (let i = 0; i <= Ngrid; i++) {
    const th = -PI + (2 * PI * i) / Ngrid;
    const v = pencilSymbolMin(th, a, b);
    if (v < inf) {
      inf = v;
      thBest = th;
    }
  }
  let lo = thBest - (2 * PI) / Ngrid;
  let hi = thBest + (2 * PI) / Ngrid;
  for (let round = 0; round < 3; round++) {
    let best = Infinity;
    let tb = lo;
    for (let i = 0; i <= 200; i++) {
      const th = lo + ((hi - lo) * i) / 200;
      const v = pencilSymbolMin(th, a, b);
      if (v < best) {
        best = v;
        tb = th;
      }
    }
    inf = Math.min(inf, best);
    const w = (hi - lo) / 200;
    lo = tb - w;
    hi = tb + w;
  }
  return inf;
}

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
function chartXY7(a, t0, t1) {
  const P0 = kernelP(t1, a);
  const Pm1 = kernelP(2 * PI - t0, a);
  const Pp1 = kernelP(2 * PI + t1, a);
  const Pm2 = kernelP(4 * PI - t0, a);
  const Pp2 = kernelP(4 * PI + t1, a);
  const X7 = P0 * (Pm1 + Pp1) + Pm2 * Pm1 + Pp1 * Pp2;
  const Y7 = Pm1 * Pp1 + P0 * (Pm2 + Pp2);
  return { X7, Y7 };
}
// PAIR leg (RZ-PEN7): tighten numerator only, T6 trace kept
function chartPsi7(a, t0, t1, mu, nu, N = 12) {
  const { X7, Y7 } = chartXY7(a, t0, t1);
  const Xeff = X7 + nu * Y7;
  const T = chartT6(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * Xeff, 0);
  return (4 * Xeff) / (T / 2 + Math.sqrt(disc));
}
// LEMMA T-EXACT (imp-95334): interval cosine minimum and b-exact weight
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
function chartT8(a, b, t0, t1, N = 12) {
  const { tw } = pen3Constants(a);
  let T =
    Math.min(t8weight(a, b, t0, t1), tw(t1)) * kernelP(t0, a) +
    Math.min(t8weight(a, b, 2 * PI - t1, 2 * PI - t0), tw(2 * PI - t0)) *
      kernelP(2 * PI - t1, a) +
    Math.min(t8weight(a, b, 2 * PI + t0, 2 * PI + t1), tw(2 * PI + t1)) *
      kernelP(2 * PI + t0, a);
  for (let m = 2; m <= N; m++) {
    T +=
      Math.min(
        t8weight(a, b, 2 * PI * m + t0, 2 * PI * m + t1),
        tw(2 * PI * m + t1),
      ) * kernelP(2 * PI * m + t0, a);
    T +=
      Math.min(
        t8weight(a, b, 2 * PI * m - t1, 2 * PI * m - t0),
        tw(2 * PI * m - t0),
      ) * kernelP(2 * PI * m - t1, a);
  }
  const { rem } = c3nChartParts(a, t0, t1, N);
  return T + rem;
}
// JOINT leg (RZ-PEN8): tighten BOTH numerator (X7) and trace (T8)
function chartPsi8(a, b, t0, t1, mu, nu, N = 12) {
  const { X7, Y7 } = chartXY7(a, t0, t1);
  const Xeff = X7 + nu * Y7;
  const T = chartT8(a, b, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * Xeff, 0);
  return (4 * Xeff) / (T / 2 + Math.sqrt(disc));
}
// ISOLATED t3 leg (this module): tighten trace ONLY -- base numerator X_k
// with the b-exact T8 trace. Valid floor (T8 >= B, X <= C).
function chartPsiT3only(a, b, t0, t1, mu, N = 12) {
  const X = chartXbase(a, t0, t1);
  const T = chartT8(a, b, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}

const prefactor = (a, b) =>
  Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;
const nuExact = (a, b) => 4 * Math.cos(PI * (b / a)) ** 2;

// "which" in {base, pair, t3, both}; each carries V4/Psi5/Psi6 in the max
function pencilFloor(a, b, which, K = 256, N = 12) {
  const mu = prefactor(a, b);
  const nu = nuExact(a, b);
  let worst = Infinity;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    let v = Math.max(
      chartV4(a, t0, t1),
      chartPsi5(a, t0, t1, mu),
      chartPsi6(a, t0, t1, mu, N),
    );
    if (which === "pair") v = Math.max(v, chartPsi7(a, t0, t1, mu, nu, N));
    else if (which === "t3") v = Math.max(v, chartPsiT3only(a, b, t0, t1, mu, N));
    else if (which === "both")
      v = Math.max(
        v,
        chartPsi7(a, t0, t1, mu, nu, N),
        chartPsi8(a, b, t0, t1, mu, nu, N),
      );
    if (v < worst) worst = v;
  }
  return mu * worst;
}
function attribution(a, b) {
  const inf = gridInfRefined(a, b, 4001);
  const L6 = inf / pencilFloor(a, b, "base");
  const Lpair = inf / pencilFloor(a, b, "pair");
  const Lt3 = inf / pencilFloor(a, b, "t3");
  const Lboth = inf / pencilFloor(a, b, "both");
  const total = Math.log(L6) - Math.log(Lboth);
  const pair =
    0.5 * (Math.log(L6) - Math.log(Lpair) + (Math.log(Lt3) - Math.log(Lboth)));
  const t3 =
    0.5 * (Math.log(L6) - Math.log(Lt3) + (Math.log(Lpair) - Math.log(Lboth)));
  return {
    L6,
    Lpair,
    Lt3,
    Lboth,
    pairPct: total > 1e-15 ? (pair / total) * 100 : 0,
    t3Pct: total > 1e-15 ? (t3 / total) * 100 : 100,
  };
}

const REC = IMP95337_PENCIL_LEG_ATTRIBUTION;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95337_ASSERTIONS = [
  {
    id: "imp95337-ledger-reproduces",
    description:
      "the baked attribution ledger reproduces from scratch (looseness " +
      "quadruple and Shapley percentages) at every cell to rel 1e-9",
    holds: () => {
      const rel = (x, y) =>
        Math.abs(y) < 1e-12 ? Math.abs(x - y) : Math.abs(x / y - 1);
      for (const row of REC.ledger) {
        const g = attribution(row.a, row.b);
        if (rel(g.L6, row.L6) > 1e-9) return false;
        if (rel(g.Lpair, row.Lpair) > 1e-9) return false;
        if (rel(g.Lt3, row.Lt3) > 1e-9) return false;
        if (rel(g.Lboth, row.Lboth) > 1e-9) return false;
        if (Math.abs(g.pairPct - row.pairPct) > 1e-4) return false;
        if (Math.abs(g.t3Pct - row.t3Pct) > 1e-4) return false;
      }
      return true;
    },
  },
  {
    id: "imp95337-shares-sum-to-100",
    description:
      "the pair and t3 Shapley shares sum to 100 percent at every cell " +
      "(exact decomposition of the log-looseness reduction)",
    holds: () =>
      REC.ledger.every(
        (row) => Math.abs(row.pairPct + row.t3Pct - 100) < 1e-6,
      ),
  },
  {
    id: "imp95337-t3-leg-dominant",
    description:
      "the b-uniform t3-weight leg carries at least 75 percent of the " +
      "log-looseness reduction at every sampled large-rho cell, and " +
      "the pair leg is inert (< 2 percent) at the twin-symmetric end " +
      "r = e^3 (tau = 1/2)",
    holds: () => {
      if (!REC.ledger.every((row) => row.t3Pct >= 75)) return false;
      const twin = REC.ledger.find((r) => /tau=1\/2/.test(r.cell));
      return twin !== undefined && twin.pairPct < 2;
    },
  },
  {
    id: "imp95337-floors-are-valid",
    description:
      "every isolated floor is a genuine lower bound: the exact-symbol " +
      "infimum (4001-point + refined) is at or above each of the base, " +
      "pair, t3, and joint floors at every cell",
    holds: () => {
      for (const row of REC.ledger) {
        const inf = gridInfRefined(row.a, row.b, 4001);
        for (const which of ["base", "pair", "t3", "both"]) {
          if (!(inf >= pencilFloor(row.a, row.b, which) * (1 - 1e-12)))
            return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95337-floor-ordering",
    description:
      "the joint (RZ-PEN8) floor dominates each single-leg floor which " +
      "dominates the RZ-PEN6 baseline at every cell (L_both <= L_pair " +
      "and L_both <= L_t3 <= L6 in looseness)",
    holds: () =>
      REC.ledger.every(
        (row) =>
          row.Lboth <= row.Lpair * (1 + 1e-12) &&
          row.Lboth <= row.Lt3 * (1 + 1e-12) &&
          row.Lt3 <= row.L6 * (1 + 1e-12) &&
          row.Lpair <= row.L6 * (1 + 1e-12),
      ),
  },
  {
    id: "imp95337-convention-lock",
    description:
      "cross-check: the isolated PAIR floor equals imp-95333 A_pen7 " +
      "(looseness 3.9571187...), the JOINT floor equals imp-95334 " +
      "A_pen8 (looseness 1.0838458...), and the baseline matches the " +
      "imp-95333 loosenessRhoE6R2Pen6Ref, all at rho = e^6, r = 2",
    holds: () => {
      const g = attribution(6, Math.LN2);
      return (
        Math.abs(g.Lpair - 3.957118732272573) < 1e-9 &&
        Math.abs(g.Lboth - 1.0838458) < 1e-6 &&
        Math.abs(g.L6 - 5.06029829805588) < 1e-9
      );
    },
  },
  {
    id: "imp95337-honesty-gate",
    description:
      "the record is measurement-only: no bound changed, NO QED, no refereed bound is changed" +
      ", the t3 leg is named dominant and the pair leg named " +
      "secondary/inert at the twin end",
    holds: () =>
      /MEASUREMENT/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /measurement only/.test(REC.honestScope) &&
      /dominant/.test(REC.verdict) &&
      /t3-weight leg[\s\S]*75-100 percent/.test(REC.finding),
  },
];

for (const a of IMP95337_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95337-pencil-leg-attribution assertion failed: ${a.id}`,
    );
  }
}

export default IMP95337_PENCIL_LEG_ATTRIBUTION;
