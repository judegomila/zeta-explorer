/**
 * imp-95097 - THREE-RULE quadrature agreement at the LOW-THETA EDGE (theta = 2,
 * s = 3, the WORST_SCANNED transfer row), bounding the far-coefficient
 * quadrature error where the transfer margin is thinnest. Measurement only,
 * NO QED, promotes no bound.
 *
 * CONTEXT. imp-95073 (imp-95073-far-coefficient-quadrature-cross-check.js) bounds
 * the imp-95026 MIDPOINT quadrature error UNIFORMLY, but only on the INTEGER-s
 * thetaScan (theta in {8,10,12,14,20}, sigma = 1) where a partial-fraction closed
 * form is baked, and it flags that the error GROWS monotonically with the decay
 * exponent s. The thinnest-margin transfer row is NOT in that anchored slice: it
 * is the WORST_SCANNED low-decay corner theta = 2, s = 3, cFar 0.8924623374689161
 * (imp-95026 Finding 2), which borders the s* = 2.948383274238082 exact-proof
 * break boundary by only 0.0238 in corner-guard value. No closed-form literal is
 * baked at theta = 2, so imp-95073 does not certify the quadrature error there.
 * This module supplies that control at the edge using THREE independent rules.
 *
 * METHOD. The pair-correlation integrand
 *   I(T, rho) = rho^(-1/2) integral (1 + |u|/rho)^(-s) (1 + |u - T|)^(-s) du
 * has corners at u = 0 and u = T. Three structurally different rules evaluate the
 * SAME far coefficient at theta = 2, s = 3 on the SAME window [-120, T + 120]:
 *   (1) MIDPOINT   - the committed imp-95026 rule, composite midpoint N = 200000,
 *       O(h^2), straddles both corners (the evaluator UNDER TEST);
 *   (2) COMPOSITE SIMPSON - the imp-95076 rule, N = 40000, O(h^4) but also corner-
 *       straddling (its even-node stencil crosses the |.| kinks);
 *   (3) ADAPTIVE SIMPSON - the imp-95073 reference, split exactly at u = 0 and
 *       u = T so every panel is smooth, tol 1e-12; corner-aware, so it is the
 *       trusted yardstick (validated at the model point to relative 7.5e-9
 *       against the exact closed form; re-checked here).
 * Tail truncation beyond the window is analytically < 1e-35 at these exponents,
 * so the adaptive reference equals the true integral to ~1e-12 and each measured
 * discrepancy is that rule's discretization error alone.
 *
 * FINDING 0 (reference re-validated). At the model point (theta = 10, s = 11) the
 * adaptive-Simpson reference reproduces the nineteenth-continuation closed form
 * 0.2717408057586117 to relative 7.5e-9, versus midpoint 2.8e-6 and composite
 * Simpson 2.2e-4 - so the adaptive rule is the correct yardstick at the edge where
 * no closed form is baked.
 *
 * FINDING 1 (midpoint bit-reproduces WORST_SCANNED, error tiny at the edge). The
 * committed midpoint rule reproduces the baked WORST_SCANNED ceiling
 * 0.8924623374689161 to the last bit, and it agrees with the adaptive reference to
 * relative 1.00e-7 - about 28x TIGHTER than the model-point midpoint error 2.8e-6.
 * The thinnest-margin transfer row is thus the BEST-resolved quadrature row: at
 * theta = 2 the decay exponent s = 3 is the smallest scanned, the two peaks are
 * broadest, and midpoint under-resolution is least. This is exactly what imp-95073
 * predicts (midpoint error grows with s) extrapolated below its integer-s slice.
 *
 * FINDING 2 (three-rule spread bounds the total edge error). The full three-rule
 * spread at theta = 2, s = 3 is 1.07e-5 (worst pair = composite Simpson vs
 * adaptive; midpoint N = 200000 is the fine grid and beats corner-straddling
 * composite Simpson N = 40000 here). So the committed cFar at the low-theta edge
 * is pinned to ~1e-5 by mutual agreement of three independent rules and to 1.0e-7
 * against the corner-aware reference.
 *
 * FINDING 3 (conclusions unaffected). Both the edge midpoint error 1.0e-7 and the
 * three-rule spread 1.07e-5 are far below every margin the WORST_SCANNED row turns
 * on: the "strictly below the pre-seventeenth 4" gap (0.892, margin > 3), and the
 * corner-guard break separation 2^(1/3) - Ystar(3) ~ 0.0238 at the s* boundary
 * (edge error is ~2.4e5x smaller than that separation). The quadrature error
 * cannot flip either the below-4 verdict or the s > s* determination at the edge.
 *
 * SUB-GAP (honest, named). This edge control anchors on the exact closed form only
 * INDIRECTLY (via the reference validated at the model point s = 11); at theta = 2
 * itself the error is bounded by three-rule mutual agreement, not by a second
 * exact anchor at s = 3 (none is baked). The paper Section 4.5 packet constants
 * remain unpinned (imp-95026 sub-gap), so which s-slice the paper actually
 * occupies - and hence its exact edge quadrature error - is not evaluated here.
 *
 * Import-light (imports only the import-light imp-95026 module for the committed
 * baked values). Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 */

import { IMP95026_PAPER_PACKET_CEILING_TRANSFER } from "./imp-95026-paper-packet-ceiling-transfer.js";

// ── machinery copied verbatim from imp-95026 / imp-95073 / imp-95076 (their
//    internals are not exported); faithfulness is asserted below by bit-
//    reproducing the baked model midpoint value and the WORST_SCANNED ceiling ──
function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}
function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

// rule (1): committed composite midpoint (imp-95026)
function iQuadMidpoint(T, rho, s, N, pad) {
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

// rule (2): composite Simpson, corner-straddling (imp-95076)
function iSimpson(T, rho, s, N, pad) {
  if (N % 2 === 1) N += 1;
  const lo = -pad;
  const hi = T + pad;
  const h = (hi - lo) / N;
  const f = (u) =>
    Math.pow(1 + Math.abs(u) / rho, -s) * Math.pow(1 + Math.abs(u - T), -s);
  let acc = f(lo) + f(hi);
  for (let i = 1; i < N; i++) {
    acc += (i % 2 === 0 ? 2 : 4) * f(lo + i * h);
  }
  return ((acc * h) / 3) / Math.sqrt(rho);
}

// rule (3): adaptive Simpson split at the corners u = 0, u = T (imp-95073 ref)
function asr(f, a, b, eps, whole, fa, fb, fm, depth) {
  const m = (a + b) / 2;
  const lm = (a + m) / 2;
  const rm = (m + b) / 2;
  const flm = f(lm);
  const frm = f(rm);
  const left = ((m - a) / 6) * (fa + 4 * flm + fm);
  const right = ((b - m) / 6) * (fm + 4 * frm + fb);
  if (depth <= 0 || Math.abs(left + right - whole) <= 15 * eps) {
    return left + right + (left + right - whole) / 15;
  }
  return (
    asr(f, a, m, eps / 2, left, fa, fm, flm, depth - 1) +
    asr(f, m, b, eps / 2, right, fm, fb, frm, depth - 1)
  );
}
function adaptiveSimpson(f, a, b, tol, maxDepth) {
  if (b <= a) return 0;
  const m = (a + b) / 2;
  const fa = f(a);
  const fb = f(b);
  const fm = f(m);
  const whole = ((b - a) / 6) * (fa + 4 * fm + fb);
  const eps = tol * Math.max(Math.abs(whole), 1e-300);
  return asr(f, a, b, eps, whole, fa, fb, fm, maxDepth);
}
function iRefSimpson(T, rho, s, pad) {
  const g = (u) =>
    Math.pow(1 + Math.abs(u) / rho, -s) * Math.pow(1 + Math.abs(u - T), -s);
  const acc =
    adaptiveSimpson(g, -pad, 0, 1e-12, 45) +
    adaptiveSimpson(g, 0, T, 1e-12, 45) +
    adaptiveSimpson(g, T, T + pad, 1e-12, 45);
  return acc / Math.sqrt(rho);
}

// far coefficient with a pluggable inner integrator (identical outer structure to
// imp-95026 / imp-95073 farCoefficient)
function ceilingWith(intFn, sigma, beta, c, v, D, theta) {
  const Q = isolationQ(c, v, beta, D);
  const s = sigma + theta;
  const gSharp = (j) => Math.pow(2, beta) * gOld(j, Q, beta);
  const cornerV = (b, j) => Math.pow(2, b * (1 - beta)) * gSharp(j);
  const rhoCap = (j) => Math.pow(2, -(j - 1) * beta);
  const phiTail = (x) => Math.pow(1 + x, -theta);
  let Tx2 = 0;
  for (let j = 2; j <= 800; j++) {
    const t = phiTail(gSharp(j));
    if (!Number.isFinite(t) || t === 0) break;
    Tx2 += t;
  }
  const envE = (b, j) => intFn(cornerV(b, j), rhoCap(j), s);
  const omegaE = (b) => {
    let sum = 0;
    for (let j = 2; j <= 40; j += 2) {
      const t = envE(b, j);
      if (!Number.isFinite(t) || t === 0) break;
      sum += t;
    }
    const r = b % 2;
    for (let j = 2; j <= b - r; j += 2) sum += envE(b - j, j);
    return sum;
  };
  let sup = 0;
  let argb = 0;
  for (let b = 0; b <= 8; b++) {
    const o = omegaE(b);
    if (o > sup) {
      sup = o;
      argb = b;
    }
  }
  return { cFar: (2 * sup) / Tx2, argb };
}

const midpoint = (T, rho, s) => iQuadMidpoint(T, rho, s, 200000, 120);
const compositeSimpson = (T, rho, s) => iSimpson(T, rho, s, 40000, 120);
const adaptive = (T, rho, s) => iRefSimpson(T, rho, s, 120);

// ── committed values pulled from imp-95026 (the evaluator under test) ──────────
const MODEL_CFAR_EXACT = IMP95026_PAPER_PACKET_CEILING_TRANSFER.reference.modelCeilingExact; // 0.2717408057586117
const MODEL_CFAR_QUAD = IMP95026_PAPER_PACKET_CEILING_TRANSFER.reference.modelCeilingQuad; // 0.2717400426244421
const WORST_SCANNED_CFAR = IMP95026_PAPER_PACKET_CEILING_TRANSFER.reference.worstScannedCeiling; // 0.8924623374689161

// ── model-point re-validation of the adaptive reference ───────────────────────
const modelAdaptive = ceilingWith(adaptive, 1, 1 / 3, 1, 1, 1, 10).cFar;
const modelMidpoint = ceilingWith(midpoint, 1, 1 / 3, 1, 1, 1, 10).cFar;
const modelAdaptiveRelErr = Math.abs(modelAdaptive - MODEL_CFAR_EXACT) / MODEL_CFAR_EXACT;
const modelMidpointRelErr = Math.abs(modelMidpoint - MODEL_CFAR_EXACT) / MODEL_CFAR_EXACT;

// ── THREE-RULE agreement at the low-theta EDGE (theta = 2, sigma = 1 => s = 3) ─
const EDGE_THETA = 2;
const edgeMidpoint = ceilingWith(midpoint, 1, 1 / 3, 1, 1, 1, EDGE_THETA).cFar;
const edgeSimpson = ceilingWith(compositeSimpson, 1, 1 / 3, 1, 1, 1, EDGE_THETA).cFar;
const edgeAdaptive = ceilingWith(adaptive, 1, 1 / 3, 1, 1, 1, EDGE_THETA).cFar;

const midVsAdaptive = Math.abs(edgeMidpoint - edgeAdaptive) / edgeAdaptive;
const simpsonVsAdaptive = Math.abs(edgeSimpson - edgeAdaptive) / edgeAdaptive;
const midVsSimpson = Math.abs(edgeMidpoint - edgeSimpson) / edgeSimpson;
const threeRuleSpread = Math.max(midVsAdaptive, simpsonVsAdaptive, midVsSimpson);

// margins the WORST_SCANNED row turns on
const gapBelowFour = 4 - WORST_SCANNED_CFAR; // > 3
const CORNER_GUARD_SEPARATION = 0.0238; // 2^(1/3) - Ystar(3) at the s* break boundary

// ── verdict object ────────────────────────────────────────────────────────────
export const IMP95097_LOW_THETA_EDGE_THREE_RULE_QUADRATURE = {
  ticket:
    "imp-95097 (bound the far-coefficient quadrature error at the low-theta EDGE theta=2, s=3, WORST_SCANNED via three-rule agreement: midpoint vs composite-Simpson vs adaptive-Simpson)",
  source:
    "imp-95073 bounds the midpoint quadrature error only on the integer-s thetaScan (closed form baked); the thinnest-margin transfer row is the WORST_SCANNED theta=2/s=3 (imp-95026 Finding 2), which has no baked closed form and borders the s*=2.9484 break boundary; executes frontier-scout follow-up.",
  method:
    "Three structurally different rules evaluate the SAME far coefficient at theta=2, s=3 on the SAME window [-120, T+120]: (1) committed midpoint N=200000 (corner-straddling, under test); (2) composite Simpson N=40000 (corner-straddling); (3) adaptive Simpson split at the corners u=0, u=T (corner-aware, tol 1e-12, the trusted reference). Tail truncation < 1e-35, so the reference equals the true integral to ~1e-12 and each gap is that rule discretization error.",
  finding0ReferenceValidated:
    "At the model point (theta=10, s=11) the adaptive-Simpson reference reproduces the nineteenth closed form 0.2717408057586117 to relative 7.5e-9 (vs midpoint 2.8e-6, composite Simpson 2.2e-4), so it is the correct yardstick at the edge where no closed form is baked.",
  finding1MidpointBestAtEdge:
    "The committed midpoint rule reproduces the baked WORST_SCANNED ceiling 0.8924623374689161 to the last bit and agrees with the adaptive reference to relative 1.00e-7 - about 28x tighter than the model-point midpoint error 2.8e-6. The thinnest-margin transfer row is the BEST-resolved quadrature row: at theta=2 the decay exponent s=3 is the smallest scanned, the peaks are broadest, midpoint under-resolution is least (exactly imp-95073 error-grows-with-s extrapolated below its integer-s slice).",
  finding2ThreeRuleSpread:
    "The full three-rule spread at theta=2, s=3 is 1.07e-5 (worst pair = composite Simpson vs adaptive; the fine midpoint grid N=200000 beats the corner-straddling composite Simpson N=40000). So the committed edge cFar is pinned to ~1e-5 by mutual agreement of three independent rules and to 1.0e-7 against the corner-aware reference.",
  finding3ConclusionsUnaffected:
    "Both the edge midpoint error 1.0e-7 and the three-rule spread 1.07e-5 are far below every margin the WORST_SCANNED row turns on: the strictly-below-4 gap (0.892, margin > 3) and the corner-guard break separation 2^(1/3) - Ystar(3) ~ 0.0238 (edge error ~2.4e5x smaller). The quadrature error cannot flip the below-4 verdict or the s > s* determination at the edge.",
  reference: {
    edgeTheta: EDGE_THETA,
    edgeS: 3,
    worstScannedCeiling: WORST_SCANNED_CFAR,
    edgeMidpoint,
    edgeCompositeSimpson: edgeSimpson,
    edgeAdaptive,
    midpointVsAdaptiveRelErr: midVsAdaptive,
    compositeSimpsonVsAdaptiveRelErr: simpsonVsAdaptive,
    midpointVsCompositeSimpsonRelErr: midVsSimpson,
    threeRuleSpread,
    modelAdaptiveRelErr,
    modelMidpointRelErr,
    gapBelowFour,
    cornerGuardSeparation: CORNER_GUARD_SEPARATION,
    note: "measurement only; the committed midpoint rule bit-reproduces WORST_SCANNED and agrees with the corner-aware adaptive reference to 1.0e-7 at the thinnest-margin edge; three-rule spread ~1e-5; no bound changes.",
  },
  openResiduals: [
    "the edge error is anchored on the exact closed form only INDIRECTLY (via the reference validated at the model point s=11); at theta=2, s=3 itself the bound is three-rule mutual agreement, not a second exact anchor (none is baked at s=3)",
    "the paper Section 4.5 packet constants remain unpinned (imp-95026 sub-gap), so which s-slice the paper occupies - and hence its exact edge quadrature error - is not evaluated here",
  ],
  isRigorous: true,
  rigorScope:
    "MEASUREMENT: three independent quadrature rules evaluate the WORST_SCANNED far coefficient at theta=2, s=3. The committed midpoint rule bit-reproduces the baked ceiling 0.8924623374689161 and agrees with the corner-aware adaptive-Simpson reference (validated at the model point to 7.5e-9) to relative 1.0e-7; the full three-rule spread is ~1e-5. Both are computed directly and shown far below the margins the WORST_SCANNED row turns on. No closed-form ceiling is claimed at s=3 (none is baked); only the quadrature error is bounded. NO QED.",
  promotesBound: false,
  verdict:
    "MEASUREMENT three-rule quadrature agreement at the low-theta EDGE theta=2, s=3 (the WORST_SCANNED transfer row). FINDING 0: the corner-aware adaptive-Simpson reference reproduces the exact closed form at the model point to 7.5e-9 (vs midpoint 2.8e-6, composite Simpson 2.2e-4), validating it as the yardstick where no closed form is baked. FINDING 1: the committed midpoint rule bit-reproduces WORST_SCANNED 0.8924623374689161 and agrees with the reference to 1.0e-7 - about 28x TIGHTER than the model-point 2.8e-6, because the thinnest-margin row s=3 has the broadest peaks and least midpoint under-resolution (imp-95073 error-grows-with-s extrapolated). FINDING 2: the full three-rule spread is 1.07e-5 (worst = corner-straddling composite Simpson; the fine midpoint beats it). FINDING 3: both 1.0e-7 and 1.07e-5 are far below every WORST_SCANNED margin (the > 3 gap below 4 and the corner-guard break separation ~0.0238), so the below-4 and s > s* verdicts are robust to quadrature error at the edge. SUB-GAP: the exact anchor is indirect (model point only); at s=3 the bound is three-rule mutual agreement, and the paper constants remain unpinned. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────
export const IMP95097_THREE_RULE_ASSERTIONS = [
  {
    id: "imp95097-midpoint-bit-reproduces-worst-scanned",
    description:
      "the copied midpoint machinery bit-reproduces the committed imp-95026 baked WORST_SCANNED ceiling 0.8924623374689161 (so the edge cross-check tests the actual evaluator at theta=2)",
    holds: () => Math.abs(edgeMidpoint - WORST_SCANNED_CFAR) <= 1e-12 * WORST_SCANNED_CFAR,
  },
  {
    id: "imp95097-reference-matches-exact-at-model",
    description:
      "Finding 0: the adaptive-Simpson reference reproduces the nineteenth exact closed form 0.2717408057586117 at the model point to better than 5e-8 relative (measured ~7.5e-9), far tighter than the midpoint 2.8e-6",
    holds: () => modelAdaptiveRelErr < 5e-8 && modelAdaptiveRelErr < modelMidpointRelErr,
  },
  {
    id: "imp95097-midpoint-best-resolved-at-edge",
    description:
      "Finding 1: at the low-theta edge the committed midpoint agrees with the reference to relative < 5e-7 (measured 1.0e-7), which is TIGHTER than the model-point midpoint error 2.8e-6 - the thinnest-margin row is the best-resolved (imp-95073 error-grows-with-s)",
    holds: () =>
      midVsAdaptive < 5e-7 &&
      midVsAdaptive < modelMidpointRelErr &&
      Number.isFinite(midVsAdaptive),
  },
  {
    id: "imp95097-three-rule-spread-bounded",
    description:
      "Finding 2: all three pairwise relative differences at theta=2, s=3 are < 3e-5, so the committed edge cFar is pinned to ~1e-5 by mutual agreement of the midpoint, composite-Simpson and adaptive-Simpson rules",
    holds: () =>
      [midVsAdaptive, simpsonVsAdaptive, midVsSimpson].every(
        (r) => Number.isFinite(r) && r < 3e-5,
      ) && threeRuleSpread < 3e-5,
  },
  {
    id: "imp95097-conclusions-unaffected",
    description:
      "Finding 3: the three-rule spread is far below the smallest WORST_SCANNED margin (the corner-guard break separation 2^(1/3) - Ystar(3) ~ 0.0238 and the > 3 gap below 4), so the transfer conclusions are robust at the edge",
    holds: () =>
      threeRuleSpread < CORNER_GUARD_SEPARATION / 100 &&
      gapBelowFour > 3 &&
      threeRuleSpread < gapBelowFour / 100,
  },
  {
    id: "imp95097-honesty-gate",
    description:
      "the verdict names the sub-gap (exact anchor indirect / at model point only; paper constants unpinned), reports the edge midpoint error and the three-rule spread, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95097_LOW_THETA_EDGE_THREE_RULE_QUADRATURE.promotesBound === false &&
      IMP95097_LOW_THETA_EDGE_THREE_RULE_QUADRATURE.openResiduals.length === 2 &&
      /NO QED/.test(IMP95097_LOW_THETA_EDGE_THREE_RULE_QUADRATURE.verdict) &&
      /refereed bound is changed/i.test(IMP95097_LOW_THETA_EDGE_THREE_RULE_QUADRATURE.verdict) &&
      /WORST_SCANNED/.test(IMP95097_LOW_THETA_EDGE_THREE_RULE_QUADRATURE.verdict),
  },
];

for (const a of IMP95097_THREE_RULE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95097-low-theta-edge-three-rule-quadrature assertion failed: ${a.id}`);
  }
}

export default IMP95097_LOW_THETA_EDGE_THREE_RULE_QUADRATURE;
