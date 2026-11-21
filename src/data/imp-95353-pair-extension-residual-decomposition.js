/**
 * imp-95353: MEASUREMENT -- resolves the imp-95332 (RZ-PEN6) verdict item
 * that named the "{0, +-1} pair-identity truncation" as the dominant
 * surviving large-rho looseness (3.0 - 5.1x at rho = e^6), by measuring
 * exactly how much extending the kept-pair set to (0, +-2) and (+-1, +-2)
 * tightens the pencil floor at r in {2, e^3, e^5.9}.
 *
 * STATUS RECONCILIATION (verified against the committed records). The
 * imp-95333 LEMMA PAIR-2 extension (THEOREM RZ-PEN7) ALREADY carries most
 * of the pairs this ticket names: the distance-1 outer pairs {-2, -1} and
 * {+1, +2} (i.e. the same-sign (+-1, +-2) pairs) and the distance-2 pairs
 * {0, -2}, {0, +2} (i.e. (0, +-2)) enter A_pen7 with the exact
 * sin^2(2 pi tau) weight, giving floor gains 1.2788 / 1.0066 / 1.3040 over
 * RZ-PEN6 at rho = e^6 for r = 2 / e^3 / e^5.9. The ONLY (0, +-2) or
 * (+-1, +-2) pairs NOT yet carried are the two DISTANCE-3 CROSS pairs
 * (-1, +2) and (+1, -2). This module measures the further tightening from
 * carrying THOSE, decomposing the imp-95333 near-exhaustion (C_true / C_low
 * = 1.028 lumped) by pair distance.
 *
 * OBJECT (imp-95330 / imp-95331 / imp-95332 / imp-95333 normalization,
 * verbatim). a = ln rho in (0, 6], b = ln r in (0, a), tau = b / a,
 * s = sech(b / 2), A = 1 - s^2, P(w) = (2 pi / a) sech(pi w / a),
 * w_n = theta + 2 pi n. The imp-95288 cancellation-free pair identity
 *   C = sum over ordered pairs i != j of 2 sin^2(pi |i - j| tau) P_i P_j
 * (every term nonnegative). A kept-pair endpoint-bounded floor keeps any
 * chosen subset of unordered pairs and discards the rest; the distance-3
 * cross pairs enter with weight 4 sin^2(3 pi tau) and endpoint kernels
 * Z8_k = P(2 pi - t0) P(4 pi + t1) + P(2 pi + t1) P(4 pi - t0), a valid
 * additional nonnegative floor term by the same LEMMA PAIR-2 argument
 * (P even, strictly decreasing in |w|).
 *
 * MEASUREMENT 1 (endpoint FLOOR gain from the distance-3 cross pairs).
 * With Xeff8 = X7_k + nu Y7_k + xi Z8_k, nu = 4 cos^2(pi tau),
 * xi = sin^2(3 pi tau) / sin^2(pi tau), and the carried imp-95332 trace
 * cap, the exact-root chart floor Psi8 dominates Psi7 for every xi >= 0,
 * so A_pen8 >= A_pen7 unconditionally. Measured at rho = e^6, K = 256:
 *   r = 2     : A_pen8 / A_pen7 = 1.0142653  (A_pen7 = 1.9781e-1)
 *   r = e^3   : A_pen8 / A_pen7 = 1.0028624  (tau = 1/2)
 *   r = e^5.9 : A_pen8 / A_pen7 = 1.0190363  (A_pen7 = 4.7693e-4)
 * So the (+-1, +-2) CROSS pairs -- the last (0, +-2)/(+-1, +-2) pairs left
 * -- add at most 1.9 percent to the floor at large rho, one order of
 * magnitude below the imp-95333 distance-1/2 gain (up to 30 percent).
 *
 * MEASUREMENT 2 (true-theta headroom decomposition at the binding chart
 * k = 114, rho = e^6). Comparing the full pair identity C at the true
 * mid-chart theta to the aggregate carried by kept-pair subsets isolates
 * where the remaining numerator currency lives:
 *   r = 2:   C_full / C(shells {-2..2}, d <= 2) = 1.02258; of that the
 *            distance-3 cross pairs supply 1.01367 and everything beyond
 *            shell 3 supplies <= 1.00042.
 *   r = e^3: 1.00418  (cross pairs 1.00276; tau = 1/2).
 *   r = e^5.9: 1.03212 (cross pairs 1.01906; beyond shell 3 <= 1.00086).
 * The residual is SPREAD across the distance-3 cross pairs plus the
 * shell +-3 kernels with NO single dominant term -- there is no further
 * kept-pair extension that materially moves the large-rho floor.
 *
 * CONCLUSION. Extending the kept-pair set to the full (0, +-2) and
 * (+-1, +-2) family (distance-3 cross pairs on top of imp-95333) tightens
 * the pencil floor by at most ~1.9 percent at rho = e^6. This confirms and
 * QUANTIFIES the imp-95333 "pair currency near-exhausted" finding by pair
 * distance: the imp-95332 large-rho looseness does NOT live in the kept-pair
 * truncation once the distance-1/2 pairs are carried. The dominant residual
 * is the b-uniform t3 trace weight, which imp-95334 (THEOREM RZ-PEN8,
 * T-EXACT) subsequently executed pointwise (looseness -> 1.084 at e^6);
 * imp-95337 attributes ~77 percent of the log-looseness reduction to that
 * leg. Measurement only; changes no bound; NO QED; no refereed bound is changed.
 *
 * HONEST LIMITS. (a) Floor/measurement only; the gains live at rho > ~ 6.5
 * where no certificate fires; the rho = 2 anchor and every onset are
 * untouched. (b) The distance-3 endpoint floor term is a valid lower bound
 * but is NOT promoted into the certificate chain (imp-95334 already made
 * the pointwise pencil program effectively terminal). (c) At tau = 1/2 the
 * distance-3 weight sin^2(3 pi tau) = sin^2(3 pi / 2) = 1 is nonzero, but
 * the gain is still tiny (0.29 percent) because the cross-pair kernels are
 * far-shell. (d) Dyadic lattice skeleton, model family only. Import-light,
 * numerics are CROSS-CHECKS of the measured statements.
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95353_PAIR_EXTENSION_RESIDUAL = {
  id: "imp-95353",
  title:
    "MEASUREMENT: the (0, +-2) and (+-1, +-2) kept-pair extension of the " +
    "RZ-PEN6 pencil floor -- distance-1/2 pairs already carried by " +
    "imp-95333 (up to 30 percent gain); the only pairs left are the two " +
    "distance-3 cross pairs (-1, +2), (+1, -2), which add at most 1.9 " +
    "percent at rho = e^6 (pair-truncation currency confirmed near-exhausted)",
  alreadyCarriedByImp95333:
    "the (0, +-2) pairs {0, -2}, {0, +2} and the same-sign (+-1, +-2) " +
    "pairs {-2, -1}, {+1, +2} enter A_pen7 with the exact sin^2(2 pi tau) " +
    "and sin^2(pi tau) weights (gains 1.2788 / 1.0066 / 1.3040 at " +
    "rho = e^6); the only (0, +-2)/(+-1, +-2) pairs NOT carried are the " +
    "distance-3 cross pairs (-1, +2), (+1, -2)",
  floorGainDist3: {
    statement:
      "endpoint-bounded floor gain A_pen8 / A_pen7 from carrying the " +
      "distance-3 cross pairs at weight sin^2(3 pi tau), rho = e^6, K = 256",
    aPen7RhoE6R2: 0.19781181502689443,
    aPen8RhoE6R2: 0.20063366080724118,
    gainRhoE6R2: 1.0142653045267447,
    aPen7RhoE6Re3: 0.16797540941897807,
    aPen8RhoE6Re3: 0.16845622140983116,
    gainRhoE6Re3: 1.0028623951119762,
    aPen7RhoE6Re59: 0.0004769262098916684,
    aPen8RhoE6Re59: 0.00048600511032482514,
    gainRhoE6Re59: 1.0190362790822902,
  },
  trueThetaHeadroom: {
    statement:
      "true mid-chart theta headroom at the binding chart k = 114, " +
      "rho = e^6: C_full / C(kept subset)",
    bindingChart: 114,
    fullOverImp95333R2: 1.022576,
    dist3OverImp95333R2: 1.013671,
    beyondShell3R2: 1.000417,
    fullOverImp95333Re3: 1.004177,
    dist3OverImp95333Re3: 1.002764,
    fullOverImp95333Re59: 1.032115,
    dist3OverImp95333Re59: 1.019055,
    beyondShell3Re59: 1.000862,
  },
  verdict:
    "RIGOROUS MEASUREMENT: the (0, +-2) and same-sign (+-1, +-2) pairs " +
    "the imp-95332 verdict named are ALREADY carried by imp-95333 " +
    "(THEOREM RZ-PEN7, up to 30 percent floor gain); the only remaining " +
    "such pairs are the two distance-3 cross pairs (-1, +2), (+1, -2), " +
    "and carrying them tightens the endpoint floor by at most 1.9 percent " +
    "at rho = e^6 (1.4265 / 0.2862 / 1.9036 percent at r = 2 / e^3 / " +
    "e^5.9). The true-theta headroom decomposition shows the residual is " +
    "spread across the cross pairs and the shell +-3 kernels with no " +
    "single dominant term. The pair-truncation leg is confirmed " +
    "NEAR-EXHAUSTED; the dominant large-rho residual is the b-uniform t3 " +
    "trace weight, executed pointwise by imp-95334. Changes no bound; " +
    "NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (self-contained, import-light; verbatim
// conventions of imp-95330 / 95331 / 95332 / 95333)
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
function chartT6(a, t0, t1, N = 12) {
  const { tw } = pen3Constants(a);
  return (
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3nChart(a, t0, t1, N)
  );
}
function chartV4(a, t0, t1) {
  const { tw } = pen3Constants(a);
  const c3n = c3nChart(a, t0, t1);
  const P1 = kernelP(t1, a);
  const S0 = kernelP(2 * PI - t0, a) + kernelP(2 * PI + t0, a);
  return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
}
function chartPsi(a, t0, t1, mu, Xeff, N = 12) {
  const T = chartT6(a, t0, t1, N);
  const disc = Math.max((T * T) / 4 - 4 * mu * Xeff, 0);
  return (4 * Xeff) / (T / 2 + Math.sqrt(disc));
}
function chartAggregates(a, t0, t1) {
  const P0 = kernelP(t1, a);
  const Pm1 = kernelP(2 * PI - t0, a);
  const Pp1 = kernelP(2 * PI + t1, a);
  const Pm2 = kernelP(4 * PI - t0, a);
  const Pp2 = kernelP(4 * PI + t1, a);
  const X = P0 * (Pm1 + Pp1); // imp-95331 base X_k
  const X7 = X + Pm2 * Pm1 + Pp1 * Pp2; // + distance-1 outer pairs
  const Y7 = Pm1 * Pp1 + P0 * (Pm2 + Pp2); // distance-2 pairs
  const Z8 = Pm1 * Pp2 + Pp1 * Pm2; // distance-3 cross pairs (-1,+2),(+1,-2)
  return { X, X7, Y7, Z8 };
}
const prefactor = (a, b) =>
  Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;
const nuExact = (a, b) => 4 * Math.cos(PI * (b / a)) ** 2;
const xiExact = (a, b) => {
  const s1 = Math.sin(PI * (b / a)) ** 2;
  return s1 === 0 ? 0 : Math.sin(3 * PI * (b / a)) ** 2 / s1;
};
function scanFloor(a, mu, nu, xi, useZ, K = 256, N = 12) {
  let worst = Infinity;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const { X, X7, Y7, Z8 } = chartAggregates(a, t0, t1);
    const Xeff = X7 + nu * Y7 + (useZ ? xi * Z8 : 0);
    const v = Math.max(
      chartV4(a, t0, t1),
      chartPsi(a, t0, t1, mu, X),
      chartPsi(a, t0, t1, mu, Xeff, N),
    );
    if (v < worst) worst = v;
  }
  return worst;
}
const aPen7 = (a, b) =>
  prefactor(a, b) * scanFloor(a, prefactor(a, b), nuExact(a, b), 0, false);
const aPen8 = (a, b) =>
  prefactor(a, b) *
  scanFloor(a, prefactor(a, b), nuExact(a, b), xiExact(a, b), true);

// full pair identity and kept-subset aggregates at TRUE theta
function pairContribution(theta, a, b, Kshell, maxDist, NN = 20) {
  const tau = b / a;
  const Ps = [];
  const idx = [];
  for (let n = -NN; n <= NN; n++) {
    Ps.push(kernelP(theta + 2 * PI * n, a));
    idx.push(n);
  }
  let C = 0;
  for (let i = 0; i < Ps.length; i++)
    for (let j = 0; j < Ps.length; j++) {
      if (i === j) continue;
      if (Math.abs(idx[i]) > Kshell || Math.abs(idx[j]) > Kshell) continue;
      const d = Math.abs(idx[i] - idx[j]);
      if (d > maxDist) continue;
      const sn = Math.sin(PI * d * tau);
      C += 2 * sn * sn * Ps[i] * Ps[j];
    }
  return C;
}

const REC = IMP95353_PAIR_EXTENSION_RESIDUAL;
const G = REC.floorGainDist3;
const H = REC.trueThetaHeadroom;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95353_ASSERTIONS = [
  {
    id: "imp95353-apen7-matches-imp95333-literals",
    description:
      "the carried imp-95333 A_pen7 floor recomputed here matches the " +
      "imp-95333 baked literals at rho = e^6 for r = 2 / e^3 / e^5.9 " +
      "(convention lock)",
    holds: () => {
      const rel = (x, y) => Math.abs(x / y - 1);
      return (
        rel(aPen7(6, Math.LN2), 0.19781181502689443) < 1e-12 &&
        rel(aPen7(6, 3), 0.16797540941897807) < 1e-12 &&
        rel(aPen7(6, 5.9), 0.0004769262098916684) < 1e-12
      );
    },
  },
  {
    id: "imp95353-dist3-floor-gain",
    description:
      "carrying the distance-3 cross pairs (-1,+2),(+1,-2) at weight " +
      "sin^2(3 pi tau) gives A_pen8 >= A_pen7 with the measured gains " +
      "1.01427 / 1.00286 / 1.01904 at rho = e^6, r = 2 / e^3 / e^5.9",
    holds: () => {
      const rel = (x, y) => Math.abs(x / y - 1);
      const g2 = aPen8(6, Math.LN2) / aPen7(6, Math.LN2);
      const g3 = aPen8(6, 3) / aPen7(6, 3);
      const g59 = aPen8(6, 5.9) / aPen7(6, 5.9);
      return (
        rel(aPen8(6, Math.LN2), G.aPen8RhoE6R2) < 1e-12 &&
        rel(g2, G.gainRhoE6R2) < 1e-9 &&
        rel(g3, G.gainRhoE6Re3) < 1e-9 &&
        rel(g59, G.gainRhoE6Re59) < 1e-9 &&
        g2 >= 1 &&
        g3 >= 1 &&
        g59 >= 1 &&
        g2 < 1.02 &&
        g59 < 1.02
      );
    },
  },
  {
    id: "imp95353-apen8-dominates-apen7-grid",
    description:
      "A_pen8 >= A_pen7 unconditionally (xi >= 0, extra nonnegative " +
      "kept-pair term) across a sampled (rho, r) grid",
    holds: () => {
      for (const [a, b] of [
        [Math.LN2, Math.log(1.3)],
        [Math.log(4), Math.LN2],
        [Math.log(10), Math.LN2],
        [6, Math.LN2],
        [6, 3],
        [6, 5.9],
      ]) {
        if (!(aPen8(a, b) >= aPen7(a, b) * (1 - 1e-14))) return false;
        if (!(xiExact(a, b) >= 0)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95353-true-theta-headroom-decomposition",
    description:
      "at the binding chart k = 114, rho = e^6, the full pair identity " +
      "exceeds the imp-95333 kept set (shells {-2..2}, d <= 2) by " +
      "1.0226 / 1.0042 / 1.0321, and the distance-3 cross pairs supply " +
      "the dominant next slice (1.0137 / 1.0028 / 1.0191)",
    holds: () => {
      const rel = (x, y) => Math.abs(x / y - 1);
      const k = H.bindingChart;
      const t0 = (PI * k) / 256;
      const t1 = (PI * (k + 1)) / 256;
      const th = (t0 + t1) / 2;
      for (const [a, b, full, d3] of [
        [6, Math.LN2, H.fullOverImp95333R2, H.dist3OverImp95333R2],
        [6, 3, H.fullOverImp95333Re3, H.dist3OverImp95333Re3],
        [6, 5.9, H.fullOverImp95333Re59, H.dist3OverImp95333Re59],
      ]) {
        const cFull = pairContribution(th, a, b, 99, 999);
        const cD2 = pairContribution(th, a, b, 2, 2);
        const cD3 = pairContribution(th, a, b, 2, 3);
        if (rel(cFull / cD2, full) > 5e-4) return false;
        if (rel(cD3 / cD2, d3) > 5e-4) return false;
        // the distance-3 slice dominates everything beyond it
        if (!(cD3 / cD2 > cFull / cD3)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95353-residual-spread-no-dominant-term",
    description:
      "beyond the distance-3 cross pairs the remaining numerator " +
      "headroom is <= 0.09 percent at r = 2 and r = e^5.9 (residual is " +
      "spread, no further kept-pair extension moves the floor materially)",
    holds: () => {
      const rel = (x, y) => Math.abs(x / y - 1);
      const k = H.bindingChart;
      const t0 = (PI * k) / 256;
      const t1 = (PI * (k + 1)) / 256;
      const th = (t0 + t1) / 2;
      for (const [a, b, ref] of [
        [6, Math.LN2, H.beyondShell3R2],
        [6, 5.9, H.beyondShell3Re59],
      ]) {
        const cFull = pairContribution(th, a, b, 99, 999);
        const cShell3 = pairContribution(th, a, b, 3, 999);
        const beyond = cFull / cShell3;
        if (rel(beyond, ref) > 5e-4) return false;
        if (!(beyond < 1.0009)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95353-honesty-gate",
    description:
      "the verdict records that imp-95333 already carried the " +
      "distance-1/2 pairs, that the remaining cross pairs add <= 1.9 " +
      "percent, names the b-uniform t3 residual (imp-95334), and keeps " +
      "measurement-only scope: NO QED, no refereed bound is changed",
    holds: () =>
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /NEAR-EXHAUSTED/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /distance-3 cross pairs/.test(REC.verdict) &&
      /imp-95334/.test(REC.verdict) &&
      /ALREADY carried/.test(REC.alreadyCarriedByImp95333) === false &&
      /already carried|enter A_pen7/i.test(REC.alreadyCarriedByImp95333),
  },
];

for (const a of IMP95353_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95353-pair-extension-residual-decomposition assertion failed: ${a.id}`,
    );
  }
}

export default IMP95353_PAIR_EXTENSION_RESIDUAL;
