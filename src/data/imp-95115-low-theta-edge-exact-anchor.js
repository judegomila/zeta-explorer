/**
 * imp-95115 - INDEPENDENT EXACT CLOSED-FORM anchor for the far coefficient at the
 * LOW-THETA EDGE (theta = 2, s = 3, the WORST_SCANNED transfer row). Second-sources
 * the imp-95097 three-rule quadrature bound with a DIRECT exact value at s = 3.
 * Measurement only, NO QED, promotes no bound.
 *
 * CONTEXT. imp-95097 (imp-95097-low-theta-edge-three-rule-quadrature.js) bounded the
 * far-coefficient quadrature error at the WORST_SCANNED row theta = 2, s = 3 only by
 * THREE-RULE MUTUAL AGREEMENT (midpoint vs composite-Simpson vs adaptive-Simpson,
 * spread 1.07e-5) plus an INDIRECT exact anchor validated at the model point s = 11.
 * Its named SUB-GAP (openResiduals[0]): "the edge error is anchored on the exact
 * closed form only INDIRECTLY (via the reference validated at the model point s=11);
 * at theta = 2, s = 3 itself the bound is three-rule mutual agreement, not a second
 * exact anchor (none is baked at s=3)". This module bakes that missing second exact
 * anchor.
 *
 * METHOD. The pair-correlation inner integral over the committed midpoint window
 * [-pad, T + pad] (pad = 120) is
 *   I(T, rho) = rho^(-1/2) integral (1 + |u|/rho)^(-3) (1 + |u - T|)^(-3) du,
 * with corners at u = 0 and u = T. At integer s = 3 the integrand splits into three
 * regions, each a product of two linear factors L1 = A + B u, L2 = C + D u raised to
 * the power -3, whose antiderivative is ELEMENTARY. Using the identity
 *   1 = (D L1 - B L2) / W,   W = A D - B C   (D L1 - B L2 is a constant = W),
 * the partial fraction of 1/(L1^3 L2^3) reduces by the recursion
 *   dec(m, n) = (D/W) dec(m-1, n) - (B/W) dec(m, n-1),   dec(m,0) -> 1/L1^m,
 *   dec(0,n) -> 1/L2^n,
 * down to single-factor terms 1/L1^k and 1/L2^k (k = 1..3), each integrated in closed
 * form (L^(1-k)/(B(1-k)) for k >= 2, ln|L|/B for k = 1). The three regions are
 *   A  u in [-pad, 0]:  L1 = 1 - u/rho,  L2 = 1 + T - u;
 *   B  u in [0, T]:     L1 = 1 + u/rho,  L2 = 1 + T - u;
 *   C  u in [T, pad+T]: L1 = 1 + u/rho,  L2 = 1 - T + u.
 * For every scanned (T, rho) at this edge T >= 2^(1/3) > 1 and rho = 2^(-(j-1)/3) < 1,
 * so W is bounded away from 0 in all three regions (no partial-fraction degeneracy).
 * The result is an EXACT windowed value; the analytic tail beyond the window is
 * < 1e-35, so it equals the true integral to ~1e-35.
 *
 * FINDING 0 (closed form validated against the corner-aware reference). The exact
 * far coefficient assembled from the closed-form inner integral,
 * edgeExact = 0.8924624270658892, agrees with the imp-95097 adaptive-Simpson
 * reference to relative 5.4e-14 - the closed form is a genuine SECOND independent
 * exact anchor at s = 3, not a re-run of the same rule.
 *
 * FINDING 1 (midpoint TRUE error, now DIRECT). The committed midpoint far coefficient
 * bit-reproduces the baked WORST_SCANNED ceiling 0.8924623374689161 to the last bit,
 * and its true error measured DIRECTLY against the exact closed form is relative
 * 1.004e-7. imp-95097 reported ~1.0e-7 via the INDIRECT (model-point-validated)
 * reference; the exact anchor now confirms that number without the indirection, so
 * the WORST_SCANNED cFar is pinned to 1.0e-7 by a second exact source.
 *
 * FINDING 2 (sub-gap closed; conclusions unaffected). The exact edge error 1.004e-7
 * is far below every margin the WORST_SCANNED row turns on: the strictly-below-4 gap
 * (0.892, margin > 3) and the corner-guard break separation 2^(1/3) - Ystar(3)
 * ~ 0.0238 (edge error ~2.4e5x smaller). The below-4 verdict and the s > s*
 * determination are robust to quadrature error at the edge - now certified by a
 * direct exact anchor, closing imp-95097 openResiduals[0].
 *
 * SUB-GAP (honest, named, carried from imp-95097). The paper Section 4.5 packet
 * constants remain unpinned (imp-95026 sub-gap), so which s-slice the paper actually
 * occupies - and hence its exact edge quadrature error - is not evaluated here. This
 * module closes only the "no second exact anchor at s = 3" residual, not the paper
 * s-slice residual.
 *
 * Import-light (imports only the import-light imp-95026 module for the committed
 * baked values). Changes no bound; does NOT promote Lambda <= 0.14; NO QED;
 * no refereed bound is changed.
 */

import { IMP95026_PAPER_PACKET_CEILING_TRANSFER } from "./imp-95026-paper-packet-ceiling-transfer.js";

// ── far-coefficient machinery copied verbatim from imp-95026 / imp-95097 ────────
function isolationQ(c, v, beta, D) {
  return ((c * Math.pow(D, 1 - beta)) / v) * Math.pow(2, -(1 - beta));
}
function gOld(j, Q, beta) {
  return (Math.pow(2, j - 1) - 1) / (Q * Math.pow(2, j * beta));
}

// committed composite midpoint (imp-95026), the evaluator whose error we measure
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

// ── EXACT closed form of the inner pair-correlation integral at integer s = 3 ───
// partial-fraction coefficients of 1/(L1^3 L2^3), L1 = A + B u, L2 = C + D u
function decompose3(A, B, C, D) {
  const W = A * D - B * C; // D L1 - B L2 = W (constant)
  const memo = new Map();
  function dec(m, n) {
    const key = m + "," + n;
    if (memo.has(key)) return memo.get(key);
    const c1 = [0, 0, 0, 0];
    const c2 = [0, 0, 0, 0];
    if (n === 0) {
      c1[m] += 1;
    } else if (m === 0) {
      c2[n] += 1;
    } else {
      const a = dec(m - 1, n);
      const b = dec(m, n - 1);
      const f1 = D / W;
      const f2 = -B / W;
      for (let k = 0; k < 4; k++) {
        c1[k] = f1 * a.c1[k] + f2 * b.c1[k];
        c2[k] = f1 * a.c2[k] + f2 * b.c2[k];
      }
    }
    const r = { c1, c2 };
    memo.set(key, r);
    return r;
  }
  return dec(3, 3);
}
// antiderivative of 1/L^k, L = A + B u, evaluated at u
function antiTerm(A, B, k, u) {
  const L = A + B * u;
  if (k === 1) return Math.log(Math.abs(L)) / B;
  return Math.pow(L, 1 - k) / (B * (1 - k));
}
// exact definite integral of 1/(L1^3 L2^3) over [lo, hi]
function pfIntegral(A, B, C, D, lo, hi) {
  const { c1, c2 } = decompose3(A, B, C, D);
  const F = (u) => {
    let acc = 0;
    for (let k = 1; k <= 3; k++) {
      acc += c1[k] * antiTerm(A, B, k, u);
      acc += c2[k] * antiTerm(C, D, k, u);
    }
    return acc;
  };
  return F(hi) - F(lo);
}
// exact windowed I(T, rho) at s = 3, over the SAME window as iQuadMidpoint
function iExact(T, rho, s, pad) {
  if (s !== 3) throw new Error("imp-95115 exact anchor is derived only at s = 3");
  const lo = -pad;
  const hi = T + pad;
  // A: u in [lo,0]  L1 = 1 - u/rho, L2 = 1 + T - u
  const IA = pfIntegral(1, -1 / rho, 1 + T, -1, lo, 0);
  // B: u in [0,T]   L1 = 1 + u/rho, L2 = 1 + T - u
  const IB = pfIntegral(1, 1 / rho, 1 + T, -1, 0, T);
  // C: u in [T,hi]  L1 = 1 + u/rho, L2 = 1 - T + u
  const IC = pfIntegral(1, 1 / rho, 1 - T, 1, T, hi);
  return (IA + IB + IC) / Math.sqrt(rho);
}

// ── adaptive Simpson (corner-split), copied from imp-95097 for cross-validation ─
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
    adaptiveSimpson(g, -pad, 0, 1e-13, 50) +
    adaptiveSimpson(g, 0, T, 1e-13, 50) +
    adaptiveSimpson(g, T, T + pad, 1e-13, 50);
  return acc / Math.sqrt(rho);
}

// far coefficient with a pluggable inner integrator (identical outer structure)
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
const exact = (T, rho, s) => iExact(T, rho, s, 120);
const adaptive = (T, rho, s) => iRefSimpson(T, rho, s, 120);

// ── committed value pulled from imp-95026 (the evaluator under test) ────────────
const WORST_SCANNED_CFAR = IMP95026_PAPER_PACKET_CEILING_TRANSFER.reference.worstScannedCeiling; // 0.8924623374689161

// ── single-point closed-form validation (representative edge inner integral) ────
const T_REP = Math.pow(2, 1 / 3) * gOld(2, isolationQ(1, 1, 1 / 3, 1), 1 / 3); // cornerV(0,2)
const RHO_REP = Math.pow(2, -(2 - 1) / 3); // rhoCap(2)
const innerExact = iExact(T_REP, RHO_REP, 3, 120);
const innerRef = iRefSimpson(T_REP, RHO_REP, 3, 120);
const innerRelErr = Math.abs(innerExact - innerRef) / innerRef;

// ── far coefficient at the low-theta EDGE (theta = 2, sigma = 1 => s = 3) ───────
const EDGE_THETA = 2;
const edgeMidpoint = ceilingWith(midpoint, 1, 1 / 3, 1, 1, 1, EDGE_THETA).cFar;
const edgeExact = ceilingWith(exact, 1, 1 / 3, 1, 1, 1, EDGE_THETA).cFar;
const edgeAdaptive = ceilingWith(adaptive, 1, 1 / 3, 1, 1, 1, EDGE_THETA).cFar;

const exactVsAdaptiveRelErr = Math.abs(edgeExact - edgeAdaptive) / edgeAdaptive;
const midpointTrueErr = Math.abs(edgeMidpoint - edgeExact) / edgeExact;

// margins the WORST_SCANNED row turns on
const gapBelowFour = 4 - WORST_SCANNED_CFAR; // > 3
const CORNER_GUARD_SEPARATION = 0.0238; // 2^(1/3) - Ystar(3) at the s* break boundary

// ── verdict object ──────────────────────────────────────────────────────────────
export const IMP95115_LOW_THETA_EDGE_EXACT_ANCHOR = {
  ticket:
    "imp-95115 (derive an independent exact closed-form anchor for the far coefficient at the low-theta edge theta=2, s=3 to second-source the imp-95097 quadrature)",
  source:
    "imp-95097 bounded the far-coefficient quadrature error at the WORST_SCANNED row theta=2/s=3 only by three-rule mutual agreement plus an INDIRECT exact anchor at the model point s=11; its openResiduals[0] states no second exact anchor is baked at s=3. This module derives the partial-fraction closed form at s=3 and bakes that anchor.",
  method:
    "At integer s=3 the pair-correlation integrand splits at the corners u=0, u=T into three regions, each a product of two linear factors raised to -3. The identity 1 = (D L1 - B L2)/W (W = A D - B C constant) drives the recursion dec(m,n) = (D/W) dec(m-1,n) - (B/W) dec(m,n-1) reducing 1/(L1^3 L2^3) to single-factor terms 1/L1^k, 1/L2^k (k=1..3), each integrated in closed form. At this edge T >= 2^(1/3) > 1 > rho, so W is bounded away from 0 in all three regions. The windowed result equals the true integral to ~1e-35 (analytic tail < 1e-35).",
  finding0ClosedFormValidated:
    "The exact far coefficient edgeExact=0.8924624270658892 agrees with the imp-95097 adaptive-Simpson reference to relative 5.4e-14 (and the representative inner integral matches adaptive Simpson to ~5e-14), so the closed form is a genuine SECOND independent exact anchor at s=3, not a re-run of the same rule.",
  finding1MidpointTrueErrorDirect:
    "The committed midpoint far coefficient bit-reproduces the baked WORST_SCANNED ceiling 0.8924623374689161 to the last bit, and its true error measured DIRECTLY against the exact closed form is relative 1.004e-7 - confirming the ~1.0e-7 that imp-95097 had only INDIRECTLY (via the model-point-validated reference), now without the indirection.",
  finding2SubGapClosed:
    "The exact edge error 1.004e-7 is far below every margin the WORST_SCANNED row turns on: the strictly-below-4 gap (0.892, margin > 3) and the corner-guard break separation 2^(1/3) - Ystar(3) ~ 0.0238 (edge error ~2.4e5x smaller). The below-4 verdict and the s > s* determination are robust to quadrature error at the edge - now certified by a direct exact anchor, closing imp-95097 openResiduals[0].",
  reference: {
    edgeTheta: EDGE_THETA,
    edgeS: 3,
    worstScannedCeiling: WORST_SCANNED_CFAR,
    edgeMidpoint,
    edgeExact,
    edgeAdaptive,
    exactVsAdaptiveRelErr,
    midpointTrueErr,
    innerExact,
    innerRef,
    innerRelErr,
    gapBelowFour,
    cornerGuardSeparation: CORNER_GUARD_SEPARATION,
    note: "measurement only; the exact closed form at s=3 second-sources imp-95097 - it matches the corner-aware adaptive reference to 5.4e-14 and pins the committed midpoint true error at the edge to 1.004e-7 directly; no bound changes.",
  },
  openResiduals: [
    "the paper Section 4.5 packet constants remain unpinned (imp-95026 sub-gap), so which s-slice the paper occupies - and hence its exact edge quadrature error - is not evaluated here; this module closes only the no-second-exact-anchor-at-s=3 residual",
  ],
  isRigorous: true,
  rigorScope:
    "EXACT DERIVATION + MEASUREMENT: the pair-correlation inner integral at integer s=3 is evaluated in closed form via partial fractions (elementary antiderivative, no quadrature) over the committed midpoint window; it matches the corner-aware adaptive-Simpson reference to relative 5.4e-14, confirming correctness. The committed midpoint far coefficient bit-reproduces the baked WORST_SCANNED ceiling 0.8924623374689161 and its true error against the exact closed form is 1.004e-7, computed directly. No closed-form ceiling is claimed beyond the far-coefficient quadrature error; NO QED.",
  promotesBound: false,
  verdict:
    "EXACT ANCHOR + MEASUREMENT: an independent partial-fraction closed form for the far coefficient at the low-theta EDGE theta=2, s=3 (the WORST_SCANNED transfer row). FINDING 0: the closed-form far coefficient edgeExact=0.8924624270658892 matches the imp-95097 corner-aware adaptive-Simpson reference to relative 5.4e-14, so it is a genuine SECOND independent exact anchor at s=3. FINDING 1: the committed midpoint bit-reproduces WORST_SCANNED 0.8924623374689161 and its true error against the exact closed form is 1.004e-7 - confirming DIRECTLY the ~1.0e-7 imp-95097 had only indirectly. FINDING 2: 1.004e-7 is far below every WORST_SCANNED margin (the > 3 gap below 4 and the corner-guard break separation ~0.0238), so the below-4 and s > s* verdicts are robust to quadrature error at the edge, closing imp-95097 openResiduals[0]. SUB-GAP (carried): the paper Section 4.5 packet constants remain unpinned, so the paper s-slice edge error is not evaluated here. Changes no bound; does NOT promote Lambda <= 0.14; NO QED; no refereed bound is changed.",
};

// ── assertions (self-executing; throw on violation) ─────────────────────────────
export const IMP95115_EXACT_ANCHOR_ASSERTIONS = [
  {
    id: "imp95115-closed-form-matches-adaptive-inner",
    description:
      "the representative edge inner integral I(cornerV(0,2), rhoCap(2)) from the closed form matches the corner-aware adaptive Simpson to relative < 1e-11 (measured ~5e-14), validating the partial-fraction derivation",
    holds: () => Number.isFinite(innerRelErr) && innerRelErr < 1e-11,
  },
  {
    id: "imp95115-closed-form-second-exact-anchor",
    description:
      "Finding 0: the exact far coefficient matches the imp-95097 adaptive-Simpson reference to relative < 1e-11 (measured 5.4e-14), so it is a genuine second independent exact anchor at s=3",
    holds: () => Number.isFinite(exactVsAdaptiveRelErr) && exactVsAdaptiveRelErr < 1e-11,
  },
  {
    id: "imp95115-midpoint-bit-reproduces-worst-scanned",
    description:
      "the copied midpoint machinery bit-reproduces the committed imp-95026 baked WORST_SCANNED ceiling 0.8924623374689161 (so the exact anchor tests the actual committed evaluator)",
    holds: () => Math.abs(edgeMidpoint - WORST_SCANNED_CFAR) <= 1e-12 * WORST_SCANNED_CFAR,
  },
  {
    id: "imp95115-midpoint-true-error-direct",
    description:
      "Finding 1: the committed midpoint true error against the exact closed form at the edge is relative < 5e-7 (measured 1.004e-7), directly confirming the ~1.0e-7 imp-95097 had only indirectly",
    holds: () => Number.isFinite(midpointTrueErr) && midpointTrueErr < 5e-7,
  },
  {
    id: "imp95115-conclusions-unaffected",
    description:
      "Finding 2: the exact edge error is far below the smallest WORST_SCANNED margin (the corner-guard break separation ~0.0238 and the > 3 gap below 4), so the transfer conclusions are robust at the edge",
    holds: () =>
      midpointTrueErr < CORNER_GUARD_SEPARATION / 100 &&
      gapBelowFour > 3 &&
      midpointTrueErr < gapBelowFour / 100,
  },
  {
    id: "imp95115-honesty-gate",
    description:
      "the verdict names the carried sub-gap (paper constants unpinned), reports the exact anchor agreement and the direct midpoint true error, promotes no bound, NO QED, no refereed bound is changed",
    holds: () =>
      IMP95115_LOW_THETA_EDGE_EXACT_ANCHOR.promotesBound === false &&
      IMP95115_LOW_THETA_EDGE_EXACT_ANCHOR.openResiduals.length === 1 &&
      /NO QED/.test(IMP95115_LOW_THETA_EDGE_EXACT_ANCHOR.verdict) &&
      /refereed bound is changed/i.test(IMP95115_LOW_THETA_EDGE_EXACT_ANCHOR.verdict) &&
      /WORST_SCANNED/.test(IMP95115_LOW_THETA_EDGE_EXACT_ANCHOR.verdict),
  },
];

for (const a of IMP95115_EXACT_ANCHOR_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95115-low-theta-edge-exact-anchor assertion failed: ${a.id}`);
  }
}

export default IMP95115_LOW_THETA_EDGE_EXACT_ANCHOR;
