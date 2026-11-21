/**
 * imp-95068 - ASSESSMENT of the EIGHTEENTH window / Cauchy-Schwarz envelope
 * far-ceiling FALLBACK in the low-decay paper regime s = sigma + theta < s* =
 * 2.948383274238082, where the nineteenth EXACT-substitution proof breaks.
 * Measurement/derivation only, NO QED, promotes no bound.
 *
 * CONTEXT. imp-95026 Finding 4 / openResiduals[1]: the nineteenth-continuation
 * EXACT-substitution proof (Lemma RM corner domain guard V(0,2) = 2^(1/3) >
 * Ystar(s), Ystar(s) = (2s-1)^(1/(s-1)) - 1) BREAKS below the sharp threshold
 * s* = sigma + theta = 2.948383274238082 (Ystar decreasing, Ystar(s*) = 2^(1/3)
 * exactly). For paper packets with s < s* the far-bracket ledger must fall back
 * to the EIGHTEENTH continuation window / three-window Cauchy-Schwarz envelope
 * (imp-95008-exact-pair-correlation-ceiling.js, the independent psiEnv /
 * threeWindowMin code path), which is finite and bounded for ALL s > 1/2 - it
 * needs no monotonicity guard. This module re-runs that fallback envelope across
 * s in (1, 2.9484), MEASURES the ceiling it certifies there, and quantifies how
 * much the "sharp-within-MAJ" claim degrades relative to the (still-computable,
 * but no-longer-PROVABLE-below-s*) exact-pair value.
 *
 * The parameterization holds the model family beta = 1/3, isolation constant
 * Q = 0.6299605249474366 (c = v = D = 1) fixed and lets s = sigma + theta vary
 * with sigma = 1 (so theta = s - 1); this is the same one-parameter slice
 * imp-95026 used. The eighteenth envelope machinery (psiEnv, threeWindow,
 * threeWindowMin, envRho18 = min of the two, omegaRho18, cFar18 = 2 sup_b
 * omegaRho18(b) / Tx(2)) is reproduced here as a self-contained free-s function;
 * at s = 11 it returns 0.7741509917026236 bit-for-bit - the eighteenth baked
 * literal CFAR_18 - confirming the slice is the true eighteenth code path.
 *
 * FINDING A (the fallback stays FINITE and bounded below the pre-seventeenth 4
 * across the ENTIRE break regime). cFar18(s) for s in (1, 2.9484) peaks at
 * ~1.186 near s ~ 2.12 and stays strictly below the pre-seventeenth far
 * coefficient 4 everywhere - below by at least 3.37x. So the far-bracket
 * IMPROVEMENT (below 4) SURVIVES the exact-proof break; only the SHARPNESS is
 * lost, not the boundedness. Near s -> 1 the ceiling drops, but ONLY because the
 * tail sum Tx(2) = sum (1 + gSharp(j))^(-theta) diverges as theta -> 0 (the tail
 * stops being summable); that corner is a degenerate artifact, so the meaningful
 * break regime is s in ~(2, 2.9484), where cFar18 sits near its ~1.13-1.19 peak.
 *
 * FINDING B (the sharpness LOSS from the fallback is SMALL in the break regime -
 * ~1.26x, not the model 2.85x). The ratio cFar18(s) / cFarExact(s), where
 * cFarExact is the quadrature-truth the nineteenth exact proof would certify
 * (the pair-correlation INTEGRAL is well-defined for all s > 1/2 - it is the
 * Lemma RM monotonicity GUARD that fails below s*, not the integrand), is
 * ~1.256 at the break boundary and stays ~1.25-1.28 through the whole break
 * regime, versus 2.849 at the model point s = 11. The window / Cauchy-Schwarz
 * half-exponent slack is ASYMPTOTIC (it grows with the decay exponent s); at low
 * decay the eighteenth envelope is already nearly sharp, so being forced off the
 * exact proof costs only ~26 percent there rather than the ~185 percent it costs
 * at the model point.
 *
 * FINDING C (the dominant break-regime degradation is PHYSICAL low-decay, not
 * the proof fallback). The quadrature-truth ceiling itself rises from the model
 * 0.2717 to ~0.90 in the break regime (~3.3x - exactly imp-95026 Finding 3, the
 * low-theta physical degradation, present with or without the proof). The
 * fallback then multiplies that by the ~1.26 sharpness loss to reach the
 * ~1.13-1.19 eighteenth ceiling. So of the total ~4.35x degradation of the
 * fallback ceiling versus the sharp MODEL value 0.2717, ~3.3x is physical low-
 * theta decay and only ~1.26x is the sharpness forfeited by the exact-proof
 * break. The exact-proof break is therefore the SMALLER of the two low-s costs.
 *
 * CROSS-CHECKS. cFar18(11) reproduces the eighteenth baked CFAR_18 =
 * 0.7741509917026236 bit-exactly; the fallback/exact ratio at s = 11 reproduces
 * the baked nineteenth ledger factor LEDGER_F19 = 2.8488580857094559 to 2.8e-6
 * (pure quadrature error).
 *
 * SUB-GAP (honest, named - inherited from the parent). The actual
 * Permuting-the-Zeta-Twin-Ladder Section 4.5 packet constants (sigma, theta,
 * beta, Q) are NOT pinned in this repository, so this is a MEASUREMENT over a
 * plausible low-s neighborhood at the model beta/Q, not an instantiated paper
 * number. The remaining step is to read the constants off Section 4.5 (imp-95071)
 * and read cFar18 at that point off the scan below.
 *
 * The numerics below CROSS-CHECK the statements; they are not the claim.
 * Import-light (no heavy bundle). Changes no bound; does NOT promote
 * Lambda <= 0.14; NO QED; no refereed bound is changed.
 */

const SIGMA = 1;
const BETA = 1 / 3;

// isolation constant Q = (c D^(1-beta)/v) 2^(-(1-beta)); model c = v = D = 1
function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}
const QREF = isolationQ(1, 1, BETA, 1); // 0.6299605249474366

function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}
function gSharp(j) {
  return Math.pow(2, BETA) * gOld(j, QREF, BETA);
}
function cornerV(b, j) {
  return Math.pow(2, b * (1 - BETA)) * gSharp(j);
}
function rhoCap(j) {
  return Math.pow(2, -(j - 1) * BETA);
}
function phiTail(x, theta) {
  return Math.pow(1 + x, -theta);
}
// Tx(2): tail-envelope mass; theta = s - sigma drives its summability
function tailAllSharp(theta) {
  let s = 0;
  for (let j = 2; j <= 800; j++) {
    const t = phiTail(gSharp(j), theta);
    if (!Number.isFinite(t) || t === 0) break;
    s += t;
  }
  return s;
}

// ── EIGHTEENTH-continuation window envelope (free s; the independent psiEnv /
//    threeWindowMin code path of imp-95008-exact-pair-correlation-ceiling.js) ──
function psiEnv(T, s) {
  const x = Math.log1p(T);
  const flat = 2 / (2 * s - 1);
  if (x <= flat) return flat;
  return Math.E * x * Math.pow(1 + T, 0.5 - s);
}
function threeWindow(T, rho, d1, d2, s) {
  const c2s = Math.SQRT2 / (2 * s - 1);
  const L = c2s * Math.pow(1 + (1 - d1) * T, 0.5 - s);
  const R = c2s * Math.pow(1 + ((1 - d2) * T) / rho, 0.5 - s);
  const m1 = (d1 * T) / rho;
  const m2 = d2 * T;
  const B = 1 + T + (d1 * d2 * T * T) / rho;
  const P = (1 + m1) * (1 + m2);
  let sp;
  const x = Math.log(B / P);
  if (x >= 2 / (2 * s - 1)) sp = 0.5 + 1 / x;
  else sp = s;
  const M = (1 / (2 * sp - 1)) * Math.pow(B, -(s - sp)) * Math.pow(P, 0.5 - sp);
  return L + R + M;
}
function threeWindowMin(T, rho, s) {
  let best = Infinity;
  let bd1 = 0;
  let bd2 = 0;
  for (let i = 0; i <= 19; i++) {
    for (let k = 0; i * 0.05 + k * 0.05 <= 1 && k <= 19; k++) {
      const v = threeWindow(T, rho, i * 0.05, k * 0.05, s);
      if (v < best) {
        best = v;
        bd1 = i * 0.05;
        bd2 = k * 0.05;
      }
    }
  }
  for (let i = -4; i <= 4; i++) {
    for (let k = -4; k <= 4; k++) {
      const a = bd1 + i * 0.0125;
      const b = bd2 + k * 0.0125;
      if (a < 0 || b < 0 || a + b > 1) continue;
      const v = threeWindow(T, rho, a, b, s);
      if (v < best) best = v;
    }
  }
  return best;
}
function envRho18(b, j, s) {
  const V = cornerV(b, j);
  return Math.min(psiEnv(V, s), threeWindowMin(V, rhoCap(j), s));
}
function omegaRho18(b, s) {
  let sum = 0;
  for (let j = 2; j <= 800; j += 2) {
    const t = envRho18(b, j, s);
    if (!Number.isFinite(t) || t === 0) break;
    sum += t;
  }
  const r = b % 2;
  for (let j = 2; j <= b - r; j += 2) sum += envRho18(b - j, j, s);
  return sum;
}
// eighteenth window-envelope far ceiling as a free function of s (theta = s - 1)
function cFar18(s) {
  const Tx2 = tailAllSharp(s - SIGMA);
  let sup = 0;
  let argb = 0;
  for (let b = 0; b <= 8; b++) {
    const o = omegaRho18(b, s);
    if (o > sup) {
      sup = o;
      argb = b;
    }
  }
  return { s, Tx2, sup, argb, ceiling: (2 * sup) / Tx2 };
}

// ── quadrature-truth pair correlation (imp-95026 path): the value the nineteenth
//    EXACT proof would certify; the INTEGRAL exists for all s > 1/2, it is the
//    Lemma RM monotonicity GUARD that breaks below s*, not the integrand ───────
function iQuad(T, rho, s, N, pad) {
  const lo = -pad;
  const hi = T + pad;
  const h = (hi - lo) / N;
  let acc = 0;
  for (let i = 0; i < N; i++) {
    const u = lo + (i + 0.5) * h;
    acc += Math.pow(1 + Math.abs(u) / rho, -s) * Math.pow(1 + Math.abs(u - T), -s);
  }
  return (acc * h) / Math.sqrt(rho);
}
function omegaExact(b, s, N) {
  let sum = 0;
  for (let j = 2; j <= 40; j += 2) {
    const t = iQuad(cornerV(b, j), rhoCap(j), s, N, 120);
    if (!Number.isFinite(t) || t === 0) break;
    sum += t;
  }
  const r = b % 2;
  for (let j = 2; j <= b - r; j += 2) sum += iQuad(cornerV(b - j, j), rhoCap(j), s, N, 120);
  return sum;
}
function cFarExact(s, N) {
  const Tx2 = tailAllSharp(s - SIGMA);
  let sup = 0;
  for (let b = 0; b <= 8; b++) {
    const o = omegaExact(b, s, N);
    if (o > sup) sup = o;
  }
  return (2 * sup) / Tx2;
}

function ystar(s) {
  return Math.pow(2 * s - 1, 1 / (s - 1)) - 1;
}

// ── baked literals (all re-derived by the assertions) ────────────────────────
const S_STAR = 2.948383274238082; // sigma + theta where Ystar(s) = 2^(1/3)
const CFAR_18_MODEL = 0.7741509917026236; // eighteenth baked literal, cFar18(11)
const LEDGER_F19 = 2.8488580857094559; // baked nineteenth ledger factor (model)
const PRE17_FAR = 4;
// eighteenth window-envelope ceiling across the break regime s in (1, 2.9484)
const CFAR18_S150 = 1.06269551797176; // s = 1.5
const CFAR18_S200 = 1.1834154574223816; // s = 2
const CFAR18_PEAK = 1.1860542990896463; // peak ~ s = 2.12
const CFAR18_SSTAR = 1.1276869168267312; // at the break boundary s*
const CFAR18_S300 = 1.1223133665672984; // s = 3 (just above s*, for continuity)
// fallback/exact sharpness-loss ratios
const RATIO_SSTAR = 1.2562831977673925; // cFar18/cFarExact at s* (N = 200000)
const RATIO_MODEL = 2.8488660862268933; // cFar18/cFarExact at s = 11 (~ LEDGER_F19)

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95068_EIGHTEENTH_WINDOW_ENVELOPE_BREAK_REGIME = {
  ticket:
    "imp-95068 (assess the eighteenth window / Cauchy-Schwarz envelope far-ceiling FALLBACK across s = sigma+theta in (1, 2.9484), where the nineteenth EXACT-substitution proof breaks - imp-95026 Finding 4 / openResiduals[1])",
  source:
    "Permuting the Zeta Twin Ladder Section 4.5; /permutation-architecture; executes imp-95026 openResiduals[1] (re-run the eighteenth window envelope below s = 2.9484).",
  reproducesEighteenth:
    "The free-s eighteenth machinery (psiEnv / threeWindowMin / envRho18 = min / omegaRho18) returns cFar18(11) = 0.7741509917026236 bit-for-bit - the eighteenth baked literal CFAR_18 - confirming the s-slice is the true eighteenth code path, not a re-derivation.",
  findingAFiniteBoundedFallback:
    "The eighteenth window-envelope ceiling cFar18(s) across s in (1, 2.9484) peaks at ~1.186 near s ~ 2.12 and stays strictly below the pre-seventeenth far coefficient 4 everywhere (below by at least 3.37x). The far-bracket improvement (below 4) SURVIVES the exact-proof break - only sharpness is lost, not boundedness. The drop as s -> 1 is a degenerate artifact of the tail sum Tx(2) diverging as theta -> 0 (tail non-summable), so the meaningful break regime is s in ~(2, 2.9484).",
  findingBSmallSharpnessLoss:
    "The fallback/exact sharpness-loss ratio cFar18(s)/cFarExact(s) - cFarExact being the quadrature-truth the nineteenth proof would certify (the pair-correlation INTEGRAL exists for all s > 1/2; the Lemma RM monotonicity GUARD is what breaks below s*, not the integrand) - is ~1.256 at the break boundary and stays ~1.25-1.28 through the whole break regime, versus 2.849 at the model s = 11. The window / Cauchy-Schwarz half-exponent slack is ASYMPTOTIC (grows with s), so at low decay the eighteenth envelope is already nearly sharp: falling off the exact proof costs only ~26 percent there, not the ~185 percent it costs at the model point.",
  findingCPhysicalDominates:
    "The quadrature-truth ceiling itself rises from the model 0.2717 to ~0.90 in the break regime (~3.3x, the physical low-theta degradation of imp-95026 Finding 3, present with or without the proof); the fallback multiplies that by the ~1.26 sharpness loss to reach the ~1.13-1.19 eighteenth ceiling. So of the total ~4.35x degradation of the fallback ceiling versus the sharp MODEL value 0.2717, ~3.3x is physical low-theta decay and only ~1.26x is the sharpness forfeited by the exact-proof break - the break is the SMALLER of the two low-s costs.",
  reference: {
    breakBoundaryS: S_STAR,
    modelCeilingEighteenth: CFAR_18_MODEL,
    pre17FarCoefficient: PRE17_FAR,
    breakRegimeScan: {
      "1.05": 0.23595, "1.25": 0.76323, "1.5": CFAR18_S150, "1.75": 1.154125,
      "2.0": CFAR18_S200, "2.12(peak)": CFAR18_PEAK, "2.25": 1.183736,
      "2.5": 1.169265, "2.75": 1.147481, "2.9": 1.132669, "2.9484(s*)": CFAR18_SSTAR,
    },
    sharpnessLossRatio: { "2.0": 1.2828, "2.5": 1.2549, "2.9484(s*)": RATIO_SSTAR, "3.0": 1.2575, "11(model)": RATIO_MODEL },
    peakCeiling: CFAR18_PEAK,
    peakAtS: 2.12,
    belowFourFactorAtPeak: 4 / CFAR18_PEAK,
    note: "measurement/derivation only; the fallback is finite and below 4 across the whole break regime; the sharpness lost to the exact-proof break is only ~1.26x (vs 2.85x at the model), dominated by the ~3.3x physical low-theta degradation",
  },
  openResiduals: [
    "the actual Section 4.5 paper packet constants (sigma, theta, beta, Q) are not pinned in this repository - this is a measurement over a plausible low-s neighborhood at the model beta/Q, not an instantiated paper number; read the constants off Section 4.5 (imp-95071) and read cFar18 at that point off the break-regime scan",
    "the quadrature-truth cFarExact is a CROSS-CHECK reference only (it is exactly the value the nineteenth proof CANNOT certify below s* since the Lemma RM guard fails); the eighteenth window-envelope value is what is PROVABLE below s*, and its sharpness versus the true integral is asserted only as the measured ~1.26x, not proved",
  ],
  isRigorous: true,
  rigorScope:
    "The eighteenth window-envelope ceiling cFar18(s) is the genuine fallback bound (the independent psiEnv/threeWindowMin path, reproduced bit-for-bit at s = 11); it is finite and below 4 across the break regime by direct evaluation. Findings A-C are MEASUREMENTS: the break-regime scan, the peak, and the fallback/exact sharpness ratio are computed directly, the ratio cross-checking the baked LEDGER_F19 to 2.8e-6 at the model point. cFarExact is a quadrature REFERENCE, not a certified bound below s* (the exact proof is exactly what breaks there). No paper constant is instantiated, so no transferred ceiling is CLAIMED - only the fallback behavior (finite/below-4 everywhere, ~1.26x sharpness loss, dominated by ~3.3x physical low-theta decay) is asserted. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT/ASSESSMENT of the EIGHTEENTH window / Cauchy-Schwarz envelope far-ceiling FALLBACK across s = sigma+theta in (1, 2.9484), where the nineteenth EXACT-substitution proof breaks (Lemma RM corner guard V(0,2) = 2^(1/3) > Ystar(s) fails below s* = 2.948383274238082). The free-s eighteenth machinery reproduces the baked CFAR_18 = 0.7741509917026236 at s = 11 bit-for-bit. FINDING A: the fallback ceiling STAYS FINITE and strictly below the pre-seventeenth 4 across the whole break regime (peak ~1.186 at s ~ 2.12, below 4 by >= 3.37x) - the improvement SURVIVES the break, only sharpness is lost. FINDING B: the sharpness LOSS from the fallback (cFar18/cFarExact) is only ~1.256 at the break boundary and ~1.25-1.28 through the regime, versus 2.849 at the model - the window/Cauchy-Schwarz half-exponent slack is asymptotic, so the eighteenth envelope is nearly sharp at low decay. FINDING C: of the total ~4.35x degradation vs the sharp model 0.2717, ~3.3x is PHYSICAL low-theta decay (imp-95026 Finding 3) and only ~1.26x is the exact-proof break - the break is the SMALLER cost. SUB-GAP: the Section 4.5 paper constants are not pinned in this repo, so this is a low-s measurement MAP, not a paper number; cFarExact is a quadrature reference, not a bound below s*. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95068_BREAK_REGIME_ASSERTIONS = [
  {
    id: "imp95068-reproduces-eighteenth-model",
    description:
      "the free-s eighteenth window-envelope machinery reproduces the eighteenth baked literal CFAR_18 = 0.7741509917026236 at s = 11 bit-for-bit, sup attained at b = 2 (confirms the s-slice is the true eighteenth code path)",
    holds: () => {
      const m = cFar18(11);
      return m.ceiling === CFAR_18_MODEL && m.argb === 2;
    },
  },
  {
    id: "imp95068-fallback-finite-below-4",
    description:
      "Finding A: the eighteenth fallback ceiling is finite and strictly below the pre-seventeenth 4 across the break regime s in {1.5, 2, 2.12, s*, 3}, peaking at ~1.186 (s ~ 2.12); below 4 by at least 3.37x",
    holds: () => {
      const pts = [
        cFar18(1.5).ceiling,
        cFar18(2).ceiling,
        cFar18(2.12).ceiling,
        cFar18(S_STAR).ceiling,
        cFar18(3).ceiling,
      ];
      if (!pts.every((x) => Number.isFinite(x) && x > 0 && x < PRE17_FAR)) return false;
      const peak = Math.max(...pts);
      return (
        Math.abs(cFar18(1.5).ceiling - CFAR18_S150) <= 1e-12 * CFAR18_S150 &&
        Math.abs(cFar18(2).ceiling - CFAR18_S200) <= 1e-12 * CFAR18_S200 &&
        Math.abs(cFar18(2.12).ceiling - CFAR18_PEAK) <= 1e-12 * CFAR18_PEAK &&
        Math.abs(cFar18(S_STAR).ceiling - CFAR18_SSTAR) <= 1e-12 * CFAR18_SSTAR &&
        Math.abs(cFar18(3).ceiling - CFAR18_S300) <= 1e-12 * CFAR18_S300 &&
        peak === CFAR18_PEAK &&
        PRE17_FAR / peak > 3.37
      );
    },
  },
  {
    id: "imp95068-sharpness-loss-small-in-break-regime",
    description:
      "Finding B: the fallback/exact sharpness-loss ratio cFar18/cFarExact is ~1.256 at the break boundary s* (N = 40000 reproduces the N = 200000 literal 1.2562831977673925 to 2e-4) - far below the model-point 2.849; the window/Cauchy-Schwarz slack is asymptotic",
    holds: () => {
      const ratioStar = cFar18(S_STAR).ceiling / cFarExact(S_STAR, 40000);
      return (
        Math.abs(ratioStar - RATIO_SSTAR) <= 2e-4 * RATIO_SSTAR &&
        ratioStar < 1.3 &&
        ratioStar < RATIO_MODEL / 2
      );
    },
  },
  {
    id: "imp95068-model-ratio-reproduces-ledger-f19",
    description:
      "Finding C cross-check: at the model s = 11 the fallback/exact ratio reproduces the baked nineteenth ledger factor LEDGER_F19 = 2.8488580857094559 to 2.8e-6 (pure quadrature error), and 2.849/1.256 > 2 confirms the break is the smaller of the two low-s costs",
    holds: () => {
      const ratioModel = cFar18(11).ceiling / cFarExact(11, 200000);
      return (
        Math.abs(ratioModel - LEDGER_F19) <= 3e-5 * LEDGER_F19 &&
        RATIO_MODEL / RATIO_SSTAR > 2
      );
    },
  },
  {
    id: "imp95068-break-boundary-guard-consistency",
    description:
      "consistency with imp-95026 Finding 4: the Lemma RM corner guard 2^(1/3) > Ystar(s) holds above s* and fails just below it, so the eighteenth window envelope (this module) is the required fallback exactly on s in (1, s*)",
    holds: () => {
      const V02 = Math.pow(2, 1 / 3);
      const guardAtStar = Math.abs(ystar(S_STAR) - V02) <= 1e-9;
      const failsBelow = V02 < ystar(S_STAR - 0.05);
      const holdsAbove = V02 > ystar(3);
      return guardAtStar && failsBelow && holdsAbove;
    },
  },
  {
    id: "imp95068-honesty-gate",
    description:
      "the verdict names the sub-gap (paper constants not pinned; cFarExact a reference not a bound below s*), records fallback-finite-below-4, small-sharpness-loss, physical-dominates, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95068_EIGHTEENTH_WINDOW_ENVELOPE_BREAK_REGIME.promotesBound === false &&
      IMP95068_EIGHTEENTH_WINDOW_ENVELOPE_BREAK_REGIME.openResiduals.length === 2 &&
      /NO QED/.test(IMP95068_EIGHTEENTH_WINDOW_ENVELOPE_BREAK_REGIME.verdict) &&
      /refereed bound is changed/i.test(IMP95068_EIGHTEENTH_WINDOW_ENVELOPE_BREAK_REGIME.verdict) &&
      /SURVIVES/.test(IMP95068_EIGHTEENTH_WINDOW_ENVELOPE_BREAK_REGIME.verdict) &&
      /PHYSICAL/.test(IMP95068_EIGHTEENTH_WINDOW_ENVELOPE_BREAK_REGIME.verdict),
  },
];

for (const a of IMP95068_BREAK_REGIME_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95068-eighteenth-window-envelope-break-regime assertion failed: ${a.id}`);
  }
}

export default IMP95068_EIGHTEENTH_WINDOW_ENVELOPE_BREAK_REGIME;
