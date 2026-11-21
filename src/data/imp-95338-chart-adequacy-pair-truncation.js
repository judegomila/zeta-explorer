/**
 * imp-95338: chart-cover adequacy under a RELAXED pair truncation --
 * measures whether the imp-95332 K = 256 chart cover
 * (k4096OverK256RhoE6 = 1.0085260227061528, "CHART currency
 * EXHAUSTED") stays adequate once the {0, +-1} pair-identity
 * truncation in the numerator floor is relaxed, or whether a
 * pair-truncation-sharpened pencil floor (the imp-95333 direction)
 * would re-open chart sensitivity and force finer charts before the
 * pair leg. MEASUREMENT ONLY: changes no bound, moves no onset, NO
 * QED, no refereed bound is changed.
 *
 * OBJECT (imp-95332 normalization, verbatim). a = ln rho in (0, 6],
 * b = ln r in (0, a), tau = b / a, s = sech(b / 2), A = 1 - s^2,
 * P(w) = (2 pi / a) sech(pi w / a), w_n = theta + 2 pi n, theta in
 * [0, pi] (evenness). Pointwise lam_min(F, G0) is the smaller root of
 * A lam^2 - 2 B lam + C = 0, i.e. lam_min = C / (B + sqrt(B^2 - A C)).
 * Since that smaller root is nondecreasing in C and nonincreasing in
 * B > 0, charging an UPPER bound Bup and a LOWER bound Clow per chart
 * yields a valid per-chart floor -- this is the imp-95332 LEMMA
 * ROOT-MONO monotonicity, applied here without the mu-uniform
 * repackaging so the numerator is carried with its exact tau weights.
 *
 * TRACE CAP (carried, imp-95332). B <= (A / 2) T6_k with T6_k =
 * t3(t1) P(t0) + t3(2 pi - t0) P(2 pi - t1) + t3(2 pi + t1) P(2 pi +
 * t0) + c3nChart(t0, t1); this is used verbatim for both the
 * truncated and the relaxed floor (the tail leg is imp-95332-exhausted
 * and unchanged by the pair experiment).
 *
 * NUMERATOR FLOORS (the pair-truncation lever). C = sum over i != j of
 * 2 sin^2(pi |i - j| tau) P_i P_j has all-nonnegative terms, so any
 * subset charged with each P-factor lower-bounded over the chart is a
 * valid Clow.
 *   truncated ({0, +-1}, imp-95332):
 *     Clow_trunc = 4 sin^2(pi tau) X_k,
 *     X_k = P(t1) [P(2 pi - t0) + P(2 pi + t1)].
 *   relaxed (+ the distance-2 unordered pairs {0, +-2} and {-1, +1}):
 *     Clow_relax = Clow_trunc + 4 sin^2(2 pi tau) Y_k,
 *     Y_k = P(t1) [P(4 pi - t0) + P(4 pi + t1)]
 *         + P(2 pi - t0) P(2 pi + t1).
 * Each P-factor is charged at the LARGER-|w| chart endpoint (P
 * decreasing), so Clow_relax <= C for every theta in the chart --
 * checked below against the exact symbol.
 *
 * MEASUREMENT (rho = e^6; per-chart floor = min over K charts of
 * Clow / (Bup + sqrt(Bup^2 - A Clow))). Reported quantity: the
 * K = 4096 / K = 256 floor ratio for each numerator, i.e. how much a
 * 16x chart refinement still buys.
 *   r = 2 (tau = ln 2 / 6): truncated ratio 1.00852602 (reproduces the
 *     imp-95332 k4096OverK256RhoE6 = 1.0085260227061528 to ~15 digits
 *     -- convention lock), RELAXED ratio 1.00876744; relax lifts the
 *     floor 1.2724x (looseness inf/floor 5.018 -> 3.943) but the chart
 *     sensitivity moves only +0.024 percentage point.
 *   r = e^5.9 (near-coalescence): truncated ratio 1.00813856, RELAXED
 *     ratio 1.00827298; relax lifts the floor 1.2978x (looseness
 *     3.005 -> 2.315), chart sensitivity moves +0.013 pp.
 *   r = e^3 (tau = 1 / 2): the distance-2 weight sin^2(2 pi tau) =
 *     sin^2(pi) = 0 exactly, so the relaxed floor EQUALS the truncated
 *     floor bitwise (ratio 1.00855862 for both) -- the distance-2
 *     pairs are silent at the half-lattice ratio, an honest artifact.
 * Binding chart at K = 4096 is k = 1836 for BOTH numerators (the same
 * interior theta window as the imp-95332 k = 114 of 256:
 * 1836 / 4096 = 0.4482 vs 114 / 256 = 0.4453), i.e. relaxing the pair
 * truncation does not migrate the floor-controlling chart.
 *
 * FINDING. Relaxing the {0, +-1} truncation to include the distance-2
 * pairs raises the floor LEVEL by ~1.27 - 1.30x at rho = e^6 but
 * shifts the K = 4096/256 refinement ratio by at most +0.024
 * percentage point (1.008526 -> 1.008768 at r = 2). The K = 256 chart
 * cover therefore stays ADEQUATE for the pair-truncation sharpening:
 * the pair leg (imp-95333) is a numerator-currency lever, essentially
 * ORTHOGONAL to chart resolution, so finer charts are NOT required
 * before executing it. This is a measurement of a valid lower-bound
 * proxy, not a bound of the program: the ~1.27x relaxed lift is what
 * the two extra pair families are worth as a floor proxy, NOT a proven
 * A_pen improvement (a real pair extension must carry these pairs with
 * their exact monotone endpoint charges and re-close dominance, which
 * is imp-95333, not this ticket).
 *
 * HONEST LIMITS. (a) Measurement only; the floors here are valid
 * per-chart lower bounds (verified <= the exact symbol infimum) but
 * the reported relaxed lift is a PROXY for the pair leg, not a baked
 * program bound -- no A_pen / A_unif literal changes and no certificate
 * onset moves. (b) rho = e^6 only (where the imp-95332 chart-currency
 * figure lives); rho = 2 floors and all every-octave onsets
 * (13.297836 / 13.071303 / 12.817538) are untouched. (c) Distance-2
 * pairs only ({0, +-2}, {-1, +1}); higher pairs unmeasured. (d) Dyadic
 * lattice skeleton, model family only; changes NO Lambda bound.
 *
 * Import-light (no imports, no zeros bundle). Numerics are
 * CROSS-CHECKS of the stated measurement, computed from the verbatim
 * imp-95332 machinery.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95338_CHART_ADEQUACY_PAIR_TRUNCATION = {
  id: "imp-95338",
  title:
    "chart-cover adequacy under a relaxed pair truncation: whether the " +
    "imp-95332 K = 256 cover (k4096/k256 = 1.0085) stays adequate once " +
    "the {0, +-1} numerator truncation is relaxed to the distance-2 " +
    "pairs, or whether finer charts are required before the pair leg",
  object:
    "imp-95332 normalization; per-chart floor = smaller pencil root " +
    "Clow / (Bup + sqrt(Bup^2 - A Clow)) with Bup = (A/2) T6_k the " +
    "carried trace cap and Clow a nonnegative-subset numerator lower " +
    "bound (LEMMA ROOT-MONO monotonicity, exact-tau, no mu repackaging)",
  numeratorFloors:
    "truncated Clow = 4 sin^2(pi tau) X_k, X_k = P(t1)[P(2pi - t0) + " +
    "P(2pi + t1)]; relaxed Clow += 4 sin^2(2 pi tau) Y_k, Y_k = " +
    "P(t1)[P(4pi - t0) + P(4pi + t1)] + P(2pi - t0) P(2pi + t1); each " +
    "P-factor charged at the larger-|w| chart endpoint => Clow <= C",
  measurementRhoE6: {
    // r = 2
    truncRatioK4096OverK256R2: 1.0085260227061523,
    relaxRatioK4096OverK256R2: 1.0087674435069465,
    truncFloorK256R2: 0.1546874892747912,
    truncFloorK4096R2: 0.15600635832070578,
    relaxFloorK256R2: 0.19677683575601165,
    relaxFloorK4096R2: 0.19850206554697816,
    relaxOverTruncK4096R2: 1.2723972771604155,
    loosenessTruncK4096R2: 5.0175,
    loosenessRelaxK4096R2: 3.9434,
    // r = e^5.9 (near-coalescence)
    truncRatioK4096OverK256Re59: 1.0081385595578023,
    relaxRatioK4096OverK256Re59: 1.0082729829381858,
    relaxOverTruncK4096Re59: 1.297806504843581,
    // r = e^3 (tau = 1/2): distance-2 weight sin^2(pi) = 0
    truncRatioK4096OverK256Re3: 1.0085586172,
    relaxEqualsTruncAtRe3: true,
    bindingChartK4096: 1836,
    bindingChartK4096Note:
      "same interior window for both numerators; 1836 / 4096 = 0.4482 " +
      "vs the imp-95332 k = 114 / 256 = 0.4453",
    imp95332K4096OverK256Ref: 1.0085260227061528,
  },
  finding:
    "relaxing {0, +-1} to the distance-2 pairs raises the floor LEVEL " +
    "1.2724x (r = 2) / 1.2978x (r = e^5.9) at rho = e^6 but shifts the " +
    "K = 4096/256 refinement ratio by at most +0.024 percentage point " +
    "(1.008526 -> 1.008767 at r = 2); the binding chart does not " +
    "migrate. The K = 256 chart cover stays ADEQUATE for the " +
    "pair-truncation sharpening -- the pair leg is a numerator-currency " +
    "lever essentially orthogonal to chart resolution, so finer charts " +
    "are NOT required before executing it (imp-95333)",
  honestLimits:
    "measurement only; the floors are valid per-chart lower bounds " +
    "(verified <= exact symbol infimum) but the ~1.27x relaxed lift is " +
    "a PROXY for the pair leg, not a proven A_pen improvement; rho = e^6 " +
    "only; distance-2 pairs only; dyadic skeleton / model family; NO " +
    "A_pen / A_unif literal changes, NO onset moves, NO QED; " +
    "no refereed bound is changed",
  verdict:
    "RIGOROUS MEASUREMENT: the truncated K = 4096/256 ratio reproduces " +
    "the imp-95332 k4096OverK256RhoE6 = 1.0085260227061528 to ~15 " +
    "digits (convention lock); under the relaxed distance-2 numerator " +
    "the ratio changes by <= +0.024 pp while the floor level rises " +
    "~1.27 - 1.30x. Conclusion: chart currency stays EXHAUSTED under a " +
    "relaxed pair truncation -- K = 256 is adequate and finer charts " +
    "are not needed before the pair leg. Changes no bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light; verbatim
// imp-95332 conventions)
// ---------------------------------------------------------------------------

const PI = Math.PI;
const sechHalf = (u) => 1 / Math.cosh(u / 2);
const kernelP = (w, a) => (2 * PI) / a / Math.cosh((PI * w) / a);

function symbols(theta, a, b, NN = 16) {
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

// imp-95332 carried constants (verbatim)
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
  const { kap } = baseConstants(a);
  const kap2 = 4 / (a * a);
  const cAlpha = 2 / (1 + sechHalf(a));
  const tw = (w) => cAlpha + Math.min(kap * w * w, 2 + kap2 * w * w);
  return { tw, kap, kap2, cAlpha };
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
// carried trace cap: B <= (A / 2) T6cap
function T6cap(a, t0, t1) {
  const { tw } = pen3Constants(a);
  return (
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3nChart(a, t0, t1)
  );
}

// numerator lower bounds (P decreasing in |w|: lower-bound each factor
// at the larger-|w| chart endpoint)
function Xtrunc(a, t0, t1) {
  return kernelP(t1, a) * (kernelP(2 * PI - t0, a) + kernelP(2 * PI + t1, a));
}
function Ypair2(a, t0, t1) {
  const P0 = kernelP(t1, a);
  const Pm2 = kernelP(4 * PI - t0, a);
  const Pp2 = kernelP(4 * PI + t1, a);
  const Pm1 = kernelP(2 * PI - t0, a);
  const Pp1 = kernelP(2 * PI + t1, a);
  return P0 * (Pm2 + Pp2) + Pm1 * Pp1;
}

// per-chart floor via the exact smaller root with Bup, Clow
function chartFloor(a, b, t0, t1, relax) {
  const s = sechHalf(b);
  const A = 1 - s * s;
  const tau = b / a;
  const sin1 = Math.sin(PI * tau) ** 2;
  const sin2 = Math.sin(2 * PI * tau) ** 2;
  let Clow = 4 * sin1 * Xtrunc(a, t0, t1);
  if (relax) Clow += 4 * sin2 * Ypair2(a, t0, t1);
  const Bup = (A / 2) * T6cap(a, t0, t1);
  const disc = Math.max(Bup * Bup - A * Clow, 0);
  return Clow / (Bup + Math.sqrt(disc));
}
function floorScan(a, b, K, relax) {
  let worst = Infinity;
  let kBind = -1;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v = chartFloor(a, b, t0, t1, relax);
    if (v < worst) {
      worst = v;
      kBind = k;
    }
  }
  return { W: worst, kBind };
}

const REC = IMP95338_CHART_ADEQUACY_PAIR_TRUNCATION;
const M = REC.measurementRhoE6;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95338_ASSERTIONS = [
  {
    id: "imp95338-truncated-ratio-convention-lock",
    description:
      "the truncated K = 4096/256 floor ratio at rho = e^6, r = 2 " +
      "reproduces the imp-95332 k4096OverK256RhoE6 = 1.0085260227061528 " +
      "to rel 1e-12 (convention lock), and matches the baked literal",
    holds: () => {
      const t256 = floorScan(6, Math.LN2, 256, false).W;
      const t4096 = floorScan(6, Math.LN2, 4096, false).W;
      const ratio = t4096 / t256;
      if (Math.abs(ratio / M.imp95332K4096OverK256Ref - 1) > 1e-12)
        return false;
      if (Math.abs(ratio / M.truncRatioK4096OverK256R2 - 1) > 1e-12)
        return false;
      return true;
    },
  },
  {
    id: "imp95338-relaxed-ratio-adequacy",
    description:
      "under the relaxed distance-2 numerator the K = 4096/256 ratio at " +
      "rho = e^6 shifts by at most +0.03 percentage point vs truncated " +
      "at r = 2 and r = e^5.9, i.e. chart currency stays exhausted",
    holds: () => {
      for (const [b, keyT, keyR] of [
        [Math.LN2, "truncRatioK4096OverK256R2", "relaxRatioK4096OverK256R2"],
        [
          5.9,
          "truncRatioK4096OverK256Re59",
          "relaxRatioK4096OverK256Re59",
        ],
      ]) {
        const t = floorScan(6, b, 4096, false).W / floorScan(6, b, 256, false).W;
        const r = floorScan(6, b, 4096, true).W / floorScan(6, b, 256, true).W;
        if (Math.abs(t / M[keyT] - 1) > 1e-10) return false;
        if (Math.abs(r / M[keyR] - 1) > 1e-10) return false;
        // adequacy: relaxed ratio within +0.0003 (0.03 pp) of truncated
        if (!(r - t <= 3e-4 && r >= t - 1e-12)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95338-relaxed-floor-lift-and-validity",
    description:
      "the relaxed floor lifts the level 1.27 - 1.30x at rho = e^6 " +
      "(r = 2 and r = e^5.9), both truncated and relaxed floors are " +
      "valid lower bounds (<= the exact symbol infimum), and the " +
      "distance-2 numerator dominates the truncated one chartwise",
    holds: () => {
      for (const [b, key] of [
        [Math.LN2, "relaxOverTruncK4096R2"],
        [5.9, "relaxOverTruncK4096Re59"],
      ]) {
        const t = floorScan(6, b, 4096, false).W;
        const r = floorScan(6, b, 4096, true).W;
        if (Math.abs(r / t / M[key] - 1) > 1e-10) return false;
        if (!(r >= t * (1 - 1e-14))) return false;
        const inf = gridInfRefined(6, b, 2001);
        if (!(t <= inf && r <= inf)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95338-half-lattice-distance2-silent",
    description:
      "at r = e^3 (tau = 1/2) the distance-2 weight sin^2(2 pi tau) = " +
      "sin^2(pi) vanishes exactly, so the relaxed floor equals the " +
      "truncated floor bitwise at K = 256 and K = 4096",
    holds: () => {
      if (Math.abs(Math.sin(2 * PI * (3 / 6))) > 1e-15) return false;
      for (const K of [256, 4096]) {
        const t = floorScan(6, 3, K, false).W;
        const r = floorScan(6, 3, K, true).W;
        if (t !== r) return false;
      }
      return true;
    },
  },
  {
    id: "imp95338-binding-chart-stable",
    description:
      "the K = 4096 binding chart is k = 1836 for BOTH the truncated " +
      "and the relaxed numerator at rho = e^6, r = 2 -- relaxing the " +
      "pair truncation does not migrate the floor-controlling chart",
    holds: () => {
      const kt = floorScan(6, Math.LN2, 4096, false).kBind;
      const kr = floorScan(6, Math.LN2, 4096, true).kBind;
      return kt === M.bindingChartK4096 && kr === M.bindingChartK4096;
    },
  },
  {
    id: "imp95338-numerator-lower-bound-validity",
    description:
      "the relaxed numerator Clow (distance-1 + distance-2 pairs, each " +
      "factor charged at the larger-|w| chart endpoint) never exceeds " +
      "the exact all-pairs C at 11-point in-chart grids over charts " +
      "{0, 114, 255} of K = 256 for a in {ln 2, ln 10, 6}, r = 2",
    holds: () => {
      const b = Math.LN2;
      for (const a of [Math.LN2, Math.log(10), 6]) {
        const tau = b / a;
        const sin1 = Math.sin(PI * tau) ** 2;
        const sin2 = Math.sin(2 * PI * tau) ** 2;
        for (const k of [0, 114, 255]) {
          const t0 = (PI * k) / 256;
          const t1 = (PI * (k + 1)) / 256;
          const Clow = 4 * sin1 * Xtrunc(a, t0, t1) + 4 * sin2 * Ypair2(a, t0, t1);
          for (let i = 0; i <= 10; i++) {
            const th = t0 + ((t1 - t0) * i) / 10;
            const { C } = symbols(th, a, b);
            if (Clow > C * (1 + 1e-12)) return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95338-honesty-gate",
    description:
      "the verdict records the measurement-only scope, the convention " +
      "lock, the adequacy conclusion, promotes no bound, NO QED, no refereed bound is changed" +
      "",
    holds: () =>
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /convention lock/.test(REC.verdict) &&
      /K = 256 is adequate/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /measurement only/i.test(REC.honestLimits) &&
      /NO onset moves/i.test(REC.honestLimits) &&
      REC.measurementRhoE6.bindingChartK4096 === 1836,
  },
];

for (const a of IMP95338_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95338-chart-adequacy-pair-truncation assertion failed: ${a.id}`,
    );
  }
}

export default IMP95338_CHART_ADEQUACY_PAIR_TRUNCATION;
