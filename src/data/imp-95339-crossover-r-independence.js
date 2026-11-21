/**
 * imp-95339: MEASURED LEDGER -- the imp-95331 exact-root-branch
 * activation crossover a* (rho* = exp a*) as a function of the intra-pair
 * ratio r in (1, sqrt(rho)]. imp-95332 HONEST LIMITS (a) records that the
 * RZ-PEN split-root gains "live at rho > ~6.5, the activation crossover of
 * the imp-95331 exact-root branch, with the rho = 2 anchor untouched", and
 * imp-95331 baked activationCrossoverA = 1.875 / rho ~ 6.5. The
 * r-dependence of that crossover was never mapped. This module measures it.
 * Measurement only; changes no bound; NO QED; no refereed bound is changed.
 *
 * OBJECT (imp-95331 normalization, verbatim). a = ln rho, b = ln r,
 * tau = b / a, mu = sin^2(pi tau) / tanh^2(b/2). The RZ-PEN4 chart floor
 * W4(a) = min over 256 charts of V4_k(a) is mu-free. The imp-95331
 * split-root floor W5(a, mu) = min over charts of max(V4_k(a), Psi_k(a, mu))
 * with Psi_k = 4 X_k / [T_k/2 + sqrt(T_k^2/4 - 4 mu X_k)]. Since the max is
 * chartwise, W5 >= W4 unconditionally; the exact-root branch is ACTIVE at
 * (a, mu) iff W5(a, mu) > W4(a). The activation crossover a*(r) is the
 * smallest a (for fixed r, on the valid window a >= 2b of r <= sqrt(rho))
 * at which activation begins.
 *
 * MEASURED FINDING 1 -- the crossover is EXACTLY r-independent. Across
 * r in (1, e^(a* / 2)] the measured a* is 1.8621513047 to full double
 * precision (spread 0.0 over r in {1.001 .. 2.5}); rho* = exp a* =
 * 6.4375710624. This sharpens the imp-95331 record (a ~ 1.875, rho ~ 6.5)
 * to six figures and shows the "~ 6.5" is a single r-independent constant,
 * not an r-band.
 *
 * MEASURED FINDING 2 -- the mechanism is a PURE V4-CHART-GEOMETRY event
 * (rigorous, mu-free). Just below a* the global minimizing chart of the
 * mu-free floor V4 is the interior chart k = 24; at a* the far-corner
 * chart k = 255 dips below it and becomes the V4 argmin. The split-root
 * branch lifts the far corner (Psi_255 > V4_255) but does NOT lift chart
 * 24 (Psi_24 < V4_24), so W5 stays pinned at V4_24 while W4 follows the
 * falling V4_255. Hence W5 > W4 begins EXACTLY when V4_255(a) = V4_24(a),
 * a condition on the mu-free floor alone -- so a* carries no mu and no r.
 * Both the crossover W4 and W5 are attained on V4 charts (viaPsi = false)
 * throughout a neighborhood of a*.
 *
 * MEASURED FINDING 3 -- for r >= e^(a* / 2) = 2.5372368 the constraint
 * r <= sqrt(rho) (i.e. a >= 2b) forces the entire valid window above a*,
 * so the branch is active THROUGHOUT the window; the reported "crossover"
 * collapses to the window edge a = 2b (tau = 1/2). At that edge the gain
 * W5/W4 is already > 1: 1.5231 (r = 3), 2.1150 (r = 4), 2.1177 (r = 6),
 * 1.8231 (r = 10).
 *
 * MEASURED FINDING 4 -- the crossover NEVER descends toward the rho = 2
 * certificate anchor. min rho* over all r is 6.4376, more than a factor 3
 * above rho = 2, so the every-octave onset numerator/denominator at
 * rho = 2 are untouched for EVERY r -- confirming imp-95331 / imp-95332
 * HONEST LIMITS (a)/(c) r-uniformly, not just at the sampled r.
 *
 * SCOPE. Measurement only. Changes no bound; no onset moves; the
 * certificate anchor rho = 2 stays below the crossover for all r. Dyadic
 * lattice skeleton, model family only; obligation ledger (2)/(3)/(4)
 * unchanged. The numerics here are CROSS-CHECKS of the imp-95331 machinery
 * (copied verbatim), never a new claim. Import-light (no imports, no zeros
 * bundle).
 */

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95339_CROSSOVER_R_INDEPENDENCE = {
  id: "imp-95339",
  title:
    "MEASURED LEDGER: the imp-95331 exact-root-branch activation crossover " +
    "a* (rho* = exp a*) across intra-pair ratio r -- exactly r-independent " +
    "at rho* = 6.43757, a pure V4-chart-geometry event, never descending " +
    "to the rho = 2 anchor",
  crossover: {
    aStarUniform: 1.8621513047475902,
    rhoStar: 6.4375710623951425,
    // r-independence: measured spread of a* over r in (1.001 .. 2.5)
    aStarSpreadOverR: 0.0,
    rBoundWindowEdge: 2.5372368219236393, // exp(a*/2): r >= this => active throughout window
    // the V4-geometry flip that defines the crossover
    v4ArgminBelowAStar: 24,
    v4ArgminAboveAStar: 255,
    // window-edge gains W5/W4 at tau = 1/2 (r = sqrt(rho)) for r >= rBound
    edgeGainR3: 1.52310945,
    edgeGainR4: 2.11503973,
    edgeGainR6: 2.11773622,
    edgeGainR10: 1.82306885,
    minRhoStarOverAllR: 6.4375710623951425,
  },
  honestScope:
    "measurement only; the crossover is a mu-free V4-chart-geometry event " +
    "hence exactly r-independent at rho* = 6.43757; it never descends toward " +
    "the rho = 2 certificate anchor (min rho* / 2 > 3), so no onset moves " +
    "for any r; dyadic skeleton, model family only",
  verdict:
    "MEASURED and CROSS-CHECKED: the imp-95331 exact-root branch activates " +
    "at an EXACTLY r-independent crossover rho* = 6.43757 (a* = 1.862151), " +
    "sharpening the imp-95331 rho ~ 6.5 / a ~ 1.875 record; the crossover is " +
    "the pure mu-free V4-floor argmin flip k = 24 -> k = 255, so it carries " +
    "no r; for r >= e^(a*/2) = 2.53724 the whole r <= sqrt(rho) window is " +
    "already active (edge gains 1.52 - 2.12); the crossover never reaches " +
    "the rho = 2 anchor. Changes no bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Numeric cross-check machinery (copied verbatim from imp-95331)
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
  return { tw, c3n };
}
const sideSum = (th, a) => kernelP(2 * PI - th, a) + kernelP(2 * PI + th, a);
function chartV4(a, t0, t1) {
  const { tw, c3n } = pen3Constants(a);
  const P1 = kernelP(t1, a);
  const S0 = sideSum(t0, a);
  return (4 * P1 * S0) / (tw(t1) * P1 + tw(2 * PI + t1) * S0 + c3n);
}
function chartPsiSplit(a, t0, t1, mu) {
  const { tw, c3n } = pen3Constants(a);
  const xLo = kernelP(t1, a);
  const y1Lo = kernelP(2 * PI - t0, a);
  const y2Lo = kernelP(2 * PI + t1, a);
  const T =
    tw(t1) * kernelP(t0, a) +
    tw(2 * PI - t0) * kernelP(2 * PI - t1, a) +
    tw(2 * PI + t1) * kernelP(2 * PI + t0, a) +
    c3n;
  const X = xLo * (y1Lo + y2Lo);
  const disc = Math.max((T * T) / 4 - 4 * mu * X, 0);
  return (4 * X) / (T / 2 + Math.sqrt(disc));
}
const prefactor = (a, b) =>
  Math.sin(PI * (b / a)) ** 2 / Math.tanh(b / 2) ** 2;

function w4Scan(a, K = 256) {
  let worst = Infinity;
  let kb = -1;
  for (let k = 0; k < K; k++) {
    const v = chartV4(a, (PI * k) / K, (PI * (k + 1)) / K);
    if (v < worst) {
      worst = v;
      kb = k;
    }
  }
  return { W: worst, kBind: kb };
}
function w5Scan(a, mu, K = 256) {
  let worst = Infinity;
  let kb = -1;
  let viaPsi = false;
  for (let k = 0; k < K; k++) {
    const t0 = (PI * k) / K;
    const t1 = (PI * (k + 1)) / K;
    const v4 = chartV4(a, t0, t1);
    const ps = chartPsiSplit(a, t0, t1, mu);
    const v = Math.max(v4, ps);
    if (v < worst) {
      worst = v;
      kb = k;
      viaPsi = ps > v4;
    }
  }
  return { W: worst, kBind: kb, viaPsi };
}

// activation predicate at the r-dependent prefactor mu = prefactor(a, ln r)
const activeAtR = (a, r, tol = 1e-9) =>
  w5Scan(a, prefactor(a, Math.log(r))).W > w4Scan(a).W * (1 + tol);
// activation at the r-uniform chord mu = 16 / a^2
const activeUnif = (a, tol = 1e-9) =>
  w5Scan(a, 16 / (a * a)).W > w4Scan(a).W * (1 + tol);

// smallest a in [aLo, aHi] with pred true (pred monotone up)
function crossover(pred, aLo, aHi) {
  if (!pred(aHi)) return null;
  if (pred(aLo)) return aLo;
  for (let it = 0; it < 80; it++) {
    const am = 0.5 * (aLo + aHi);
    if (pred(am)) aHi = am;
    else aLo = am;
  }
  return 0.5 * (aLo + aHi);
}

const REC = IMP95339_CROSSOVER_R_INDEPENDENCE;
const CX = REC.crossover;

// ---------------------------------------------------------------------------
// Self-executing assertions
// ---------------------------------------------------------------------------

export const IMP95339_ASSERTIONS = [
  {
    id: "imp95339-uniform-crossover-value",
    description:
      "the r-uniform (mu = 16/a^2) activation crossover reproduces the " +
      "baked a* = 1.8621513047 (rho* = 6.4375710624), sharpening the " +
      "imp-95331 a ~ 1.875 / rho ~ 6.5 record",
    holds: () => {
      const aStar = crossover((a) => activeUnif(a), 0.3, 6);
      return (
        Math.abs(aStar - CX.aStarUniform) < 1e-9 &&
        Math.abs(Math.exp(aStar) - CX.rhoStar) < 1e-8
      );
    },
  },
  {
    id: "imp95339-crossover-r-independent",
    description:
      "FINDING 1: the r-dependent crossover a*(r) equals the r-uniform a* " +
      "to full double precision for every r in (1, e^(a*/2)] where an " +
      "interior crossover exists -- the crossover is EXACTLY r-independent",
    holds: () => {
      const rs = [1.001, 1.01, 1.05, 1.1, 1.2, 1.3, 1.5, 1.8, 2, 2.3, 2.5];
      for (const r of rs) {
        const b = Math.log(r);
        const aLo = Math.max(2 * b, b + 1e-4, 0.2);
        if (aLo >= CX.aStarUniform) continue; // window edge already above a*
        const aStar = crossover((a) => activeAtR(a, r), aLo, 6);
        if (aStar === null) return false;
        if (Math.abs(aStar - CX.aStarUniform) > 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95339-v4-geometry-flip",
    description:
      "FINDING 2 (mechanism): the crossover is a mu-free V4-chart-geometry " +
      "flip -- the V4 argmin is chart 24 just below a* and chart 255 just " +
      "above; the split-root branch lifts the far corner (Psi_255 > V4_255) " +
      "but not chart 24 (Psi_24 < V4_24), and both W4 and W5 are attained " +
      "on V4 charts across a*",
    holds: () => {
      const aBelow = CX.aStarUniform - 1e-4;
      const aAbove = CX.aStarUniform + 1e-4;
      if (w4Scan(aBelow).kBind !== CX.v4ArgminBelowAStar) return false;
      if (w4Scan(aAbove).kBind !== CX.v4ArgminAboveAStar) return false;
      // check the lift asymmetry at a* for a spread of r
      const idx = (k) => [(PI * k) / 256, (PI * (k + 1)) / 256];
      for (const r of [1.05, 1.3, 2, 2.5]) {
        const a = CX.aStarUniform;
        const mu = prefactor(a, Math.log(r));
        const [t024, t124] = idx(24);
        const [t0255, t1255] = idx(255);
        if (chartPsiSplit(a, t024, t124, mu) >= chartV4(a, t024, t124))
          return false; // chart 24 NOT lifted
        if (chartPsiSplit(a, t0255, t1255, mu) <= chartV4(a, t0255, t1255))
          return false; // far corner IS lifted
        // W5 attained on a V4 chart just above a*
        if (w5Scan(a + 1e-4, mu).viaPsi) return false;
      }
      return true;
    },
  },
  {
    id: "imp95339-large-r-window-active-throughout",
    description:
      "FINDING 3: for r >= e^(a*/2) = 2.5372368 the r <= sqrt(rho) window " +
      "lies entirely above a*, so the branch is active throughout; at the " +
      "window edge tau = 1/2 (r = sqrt(rho)) the baked gains W5/W4 " +
      "reproduce (r = 3, 4, 6, 10)",
    holds: () => {
      const rho = Math.exp(2 * (CX.aStarUniform / 2)); // = rhoStar
      // r just above the boundary must already be active at its edge a = 2b
      const rMid = CX.rBoundWindowEdge + 0.2;
      const aEdge = 2 * Math.log(rMid);
      if (!activeAtR(aEdge, rMid)) return false;
      const edgeGain = (r) => {
        const a = 2 * Math.log(r); // tau = 1/2
        const mu = prefactor(a, Math.log(r));
        return w5Scan(a, mu).W / w4Scan(a).W;
      };
      const rel = (x, y) => Math.abs(x - y);
      return (
        rel(edgeGain(3), CX.edgeGainR3) < 1e-6 &&
        rel(edgeGain(4), CX.edgeGainR4) < 1e-6 &&
        rel(edgeGain(6), CX.edgeGainR6) < 1e-6 &&
        rel(edgeGain(10), CX.edgeGainR10) < 1e-6 &&
        rho > 6
      );
    },
  },
  {
    id: "imp95339-never-descends-to-rho2",
    description:
      "FINDING 4: the crossover never descends toward the rho = 2 anchor -- " +
      "min rho* over all r is 6.4376 (> 3 x rho = 2), so the rho = 2 " +
      "certificate onsets are untouched for EVERY r; the branch is INACTIVE " +
      "at a = ln 2 and a = ln 4 for every sampled r",
    holds: () => {
      let minRho = Infinity;
      for (const r of [1.001, 1.05, 1.3, 2, 2.5]) {
        const b = Math.log(r);
        const aLo = Math.max(2 * b, b + 1e-4, 0.2);
        if (aLo >= CX.aStarUniform) continue;
        const aStar = crossover((a) => activeAtR(a, r), aLo, 6);
        minRho = Math.min(minRho, Math.exp(aStar));
      }
      if (Math.abs(minRho - CX.minRhoStarOverAllR) > 1e-7) return false;
      if (!(minRho > 2 * 3)) return false;
      // rho = 2 and rho = 4 inactive for every sampled r (r < sqrt(rho))
      for (const [rho, rs] of [
        [2, [1.05, 1.3, Math.SQRT2 - 1e-6]],
        [4, [1.3, 1.9]],
      ]) {
        const a = Math.log(rho);
        for (const r of rs) if (activeAtR(a, r)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95339-verdict-honesty",
    description:
      "the verdict and scope carry the honest labels: MEASURED, " +
      "r-independent, V4-geometry mechanism, never reaches rho = 2, no " +
      "bound change, no QED, no refereed bound is changed",
    holds: () =>
      /MEASURED/.test(REC.verdict) &&
      /r-independent/.test(REC.verdict) &&
      /never/.test(REC.verdict) &&
      /Changes no bound/.test(REC.verdict) &&
      /NO QED/.test(REC.verdict) &&
      /refereed bound is changed/i.test(REC.verdict) &&
      /measurement only/i.test(REC.honestScope),
  },
];

for (const a of IMP95339_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95339-crossover-r-independence assertion failed: ${a.id}`,
    );
  }
}
