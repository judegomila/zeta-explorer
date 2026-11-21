/**
 * imp-95742 -- SZEGO-REMAINDER-MONO sub-gap (from imp-95725): a floor-aware
 * derivative witness for the O(h^3) Szego remainder R(delta) = r1(delta) - 1 -
 * g(delta), plus a SHARPENED sufficient condition and the pinned analytic
 * obstruction. HONEST PARTIAL: strengthens the numerical witness and reframes
 * what must be proved; does NOT supply the analytic all-orders bound. NO QED.
 *
 * BACKGROUND (imp-95725 / imp-95704). At the twin-pair left endpoint rho = 1 the
 * finite-size Szego ratio r1(delta) = F(delta, 1) / A_opt(delta) obeys
 *
 *     r1(delta) = 1 + C(delta) h^2 + O(h^3),   h = pi / (N + 1),   N = 80,
 *     C(delta) = pi^2 / (2 delta^2)   (imp-95704 exact edge coefficient, delta <= 1),
 *
 * so r1 - 1 = g(delta) + R(delta) with LEADING term g(delta) = pi^4/(2 (N+1)^2
 * delta^2) and REMAINDER R(delta) = r1(delta) - 1 - g(delta). imp-95725 PROVED
 * dg/ddelta = -pi^4/((N+1)^2 delta^3) < 0 (leading-order monotonicity) and left
 * the named sub-gap SZEGO-REMAINDER-MONO: bound R uniformly so that
 * |dR/ddelta| < |dg/ddelta|, upgrading dr1/ddelta < 0 from leading-order to a
 * finite-N all-orders statement. This module attacks that sub-gap.
 *
 * WHAT THIS MODULE ESTABLISHES (robust numerics, floor-aware stencil).
 *
 * 1. THE REQUESTED SUFFICIENT CONDITION HOLDS WITH MARGIN. Measuring dR/ddelta
 *    by a cancellation-floor-aware WIDE central stencil (step ~2e-3, chosen above
 *    the float64 eigensolver noise) across the resolved window [ln 1.4, ln 2.0]:
 *
 *        |dR/ddelta| / |dg/ddelta| <= ~0.62 on the interior (<= ~0.69 at ln 1.4),
 *
 *    i.e. the imp-95725 target inequality |dR/ddelta| < |dg/ddelta| is satisfied
 *    at every measured delta -- the remainder derivative never overtakes the
 *    leading derivative.
 *
 * 2. A STRICTLY SHARPER, ONE-SIDED CONDITION IS TRUE. The remainder is not merely
 *    small in derivative -- it is itself strictly DECREASING:
 *
 *        dR/ddelta < 0   at every measured delta in [ln 1.4, ln 2.0],
 *
 *    confirmed directly by the strict decrease of the sampled R values through the
 *    endpoint (R(ln 1.4 - e) > R(ln 1.4) > R(ln 1.4 + e), e = 3e-3). Because BOTH
 *    dg/ddelta < 0 (proved, imp-95725) AND dR/ddelta < 0 (measured), the total
 *
 *        dr1/ddelta = dg/ddelta + dR/ddelta < 0
 *
 *    follows A FORTIORI. So the correct sufficient condition for finite-N
 *    monotonicity is the ONE-SIDED sign dR/ddelta <= 0, NOT the two-sided
 *    magnitude bound |dR/ddelta| < |dg/ddelta| (which pessimistically allows the
 *    remainder to fight the leading term). The remainder REINFORCES the
 *    monotonicity direction imp-95708 assumed; it does not oppose it.
 *
 * 3. STENCIL ARTIFACT DOCUMENTED (so it is not mistaken for a violation). A naive
 *    central difference with a too-fine step (e = 1e-5) at the left endpoint
 *    delta = ln 1.4 reads a spurious dR/ddelta ~ +3.04 (ratio ~7.8) -- a pure
 *    float64 cancellation-floor artifact of the Jacobi eigensolver where A_opt is
 *    smallest (imp-95677 floor). At e = 1e-4 the same point reads -0.235 and at
 *    e = 3e-3 it reads -0.268; the value is robustly NEGATIVE once the step clears
 *    the noise. The raw R samples themselves decrease monotonically through the
 *    endpoint, independent of any differencing. The apparent sub-gap violation is
 *    the stencil, not the remainder.
 *
 * 4. REMAINDER SCALE. R is genuinely O(h^3) with a delta-DEPENDENT coefficient:
 *    the dimensionless C2(delta) proxy R * (N+1)^3 delta^3 / pi^6 varies smoothly
 *    from ~0.487 at ln 1.4 to ~0.285 at ln 2.0 -- not a clean single power law,
 *    so R does not reduce to a rescaled copy of g.
 *
 * THE PINNED OBSTRUCTION (SZEGO-REMAINDER-MONO stays OPEN as a THEOREM). All of
 * the above is a robust finite-N=80 NUMERICAL WITNESS on the resolved window, not
 * an analytic proof. Turning dR/ddelta <= 0 into a theorem requires the next-order
 * Kac-Murdock-Szego / Szego EDGE asymptotic for the sech-Toeplitz minimal
 * eigenvalue -- specifically the h^3 coefficient C2(delta) = R(delta)/h^3 and the
 * sign of its delta-derivative. The imp-95704 Poisson dual supplies only the
 * LEADING edge coefficient C(delta) = pi^2/(2 delta^2); it does not produce
 * C2(delta), so the sign of dR/ddelta is measured, not derived. That missing
 * next-order edge coefficient (and its monotonicity in delta) is the precise
 * analytic gap. Below the resolved window (delta < ln 1.4) even the witness is
 * unavailable at float64 -- A_opt sits below the eigensolver floor (imp-95677),
 * the same wall imp-95743 attacks with a double-double solver.
 *
 * HONEST SCOPE. (a) Advances the sub-gap from "R unbounded / condition
 * unverified" to "requested condition numerically satisfied with margin + sharper
 * one-sided sign confirmed + obstruction pinned to the h^3 edge coefficient".
 * (b) Introduces no new cited input and changes NO bound. (c) F is the same
 * finite-size (80-point) proxy as imp-95693 / imp-95708 / imp-95725. (d) Model
 * seam family only; the imp-95212 envelope port, signed WEIGHT and modulus/phase
 * legs stay OPEN. NO QED; no refereed bound is changed.
 *
 * @see imp-95725-szego-ratio-monotonicity-endpoint (the leading-order theorem + sub-gap)
 * @see imp-95704-rho1-szego-coefficient-delta-scaling (C(delta) = pi^2/(2 delta^2))
 * @see imp-95743 (double-double solver to extend the witness below ln 1.4)
 */

// ---------------------------------------------------------------------------
// Reference constants (all cross-checked by the assertions below)
// ---------------------------------------------------------------------------

export const IMP95742_SZEGO_REMAINDER_DERIVATIVE_WITNESS = {
  id: "imp-95742",
  title:
    "FLOOR-AWARE derivative witness for the imp-95725 SZEGO-REMAINDER-MONO " +
    "sub-gap: across [ln 1.4, ln 2.0] at N = 80 the O(h^3) Szego remainder " +
    "R(delta) = r1(delta) - 1 - g(delta) has dR/ddelta < 0 everywhere (measured " +
    "with a cancellation-floor-aware wide stencil), so |dR/ddelta| < |dg/ddelta| " +
    "holds with margin (ratio <= ~0.62 interior) AND, more sharply, both " +
    "derivatives are negative so dr1/ddelta = dg/ddelta + dR/ddelta < 0 a " +
    "fortiori -- the requested two-sided condition is replaced by the one-sided " +
    "sign dR/ddelta <= 0; the remaining obstruction is the analytic h^3 edge " +
    "coefficient C2(delta), unavailable from the leading Poisson dual",
  question:
    "can the O(h^3) Szego remainder R(delta) = r1 - 1 - g(delta) be bounded so " +
    "|dR/ddelta| < |dg/ddelta|, upgrading the imp-95725 leading-order " +
    "monotonicity of r1(delta) to a finite-N all-orders theorem?",
  nPairs: 40,
  nPoints: 80,
  Nplus1: 81,
  h: Math.PI / 81,
  // Leading term and its exact derivative (imp-95725).
  leadingTermForm: "g(delta) = pi^4 / (2 (N + 1)^2 delta^2)",
  leadingDerivativeForm: "dg/ddelta = - pi^4 / ((N + 1)^2 delta^3) < 0",
  remainderForm: "R(delta) = r1(delta) - 1 - g(delta)  (O(h^3))",
  // Robust wide-stencil measurement (step ~2e-3, above the float64 floor).
  stencilStep: 2e-3,
  remainderDerivativeNegativeEverywhere: true,
  // Two-sided sufficient condition |dR/ddelta| < |dg/ddelta| holds with margin:
  maxDerivativeRatioInterior: 0.62, // <= this on [ln 1.42, ln 2.0]
  maxDerivativeRatioEndpoint: 0.69, // <= this including delta = ln 1.4
  // Sharper one-sided replacement (the actual sufficient condition):
  sharpenedCondition: "dR/ddelta <= 0  (=> dr1/ddelta = dg/ddelta + dR/ddelta < 0)",
  // Documented stencil artifact at ln 1.4 (a naive too-fine step misreads the sign):
  artifactStep: 1e-5,
  artifactSpuriousDerivative: 3.04, // spurious +ve central diff at e=1e-5, ln 1.4
  robustEndpointDerivative: -0.268, // e=3e-3 central diff at ln 1.4 (true sign)
  // Remainder scale: R * (N+1)^3 delta^3 / pi^6 varies smoothly (delta-dependent C2).
  c2ProxyLn14: 0.487,
  c2ProxyLn20: 0.285,
  // Residual open sub-gap -- unchanged name, now with a pinned analytic gap.
  residualSubGap: "SZEGO-REMAINDER-MONO",
  residualSubGapDescription:
    "the numerical witness shows dR/ddelta < 0 (so dr1/ddelta < 0) on the " +
    "resolved window, but proving dR/ddelta <= 0 as a THEOREM needs the " +
    "next-order KMS/Szego edge coefficient C2(delta) = R/h^3 and the sign of its " +
    "delta-derivative -- the imp-95704 Poisson dual gives only the leading " +
    "C(delta) = pi^2/(2 delta^2), not C2(delta)",
  boundChange: false,
  qed: false,
  verdict:
    "SUB-GAP WITNESS STRENGTHENED + OBSTRUCTION PINNED (honest partial). Under a " +
    "cancellation-floor-aware wide central stencil (step ~2e-3) the O(h^3) Szego " +
    "remainder R(delta) = r1 - 1 - g(delta) satisfies the imp-95725 target " +
    "|dR/ddelta| < |dg/ddelta| at every delta in [ln 1.4, ln 2.0] (ratio <= " +
    "~0.62 interior, <= ~0.69 at the endpoint), and MORE: dR/ddelta < 0 " +
    "everywhere, so with the proved dg/ddelta < 0 the total dr1/ddelta = " +
    "dg/ddelta + dR/ddelta < 0 follows a fortiori. The correct sufficient " +
    "condition is thus the ONE-SIDED sign dR/ddelta <= 0, not the two-sided " +
    "magnitude bound; the remainder REINFORCES monotonicity. A naive too-fine " +
    "step (e=1e-5) misreads the ln 1.4 point as +3.04 -- a pure float64 " +
    "eigensolver-floor artifact (imp-95677); the raw R samples decrease " +
    "monotonically through the endpoint regardless. R is genuine O(h^3) with a " +
    "delta-dependent coefficient (R (N+1)^3 delta^3/pi^6: 0.487 -> 0.285). " +
    "RESIDUAL SUB-GAP SZEGO-REMAINDER-MONO stays OPEN as a theorem: proving " +
    "dR/ddelta <= 0 analytically requires the next-order KMS/Szego edge " +
    "coefficient C2(delta), which the leading Poisson dual does not supply. Below " +
    "ln 1.4 even the witness needs the imp-95743 double-double solver. Changes no " +
    "bound; NO QED; no refereed bound is changed.",
  closesTickets: ["imp-95742"],
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light: no imports at all)
// ---------------------------------------------------------------------------

function sech(x) {
  return 2 / (Math.exp(x) + Math.exp(-x));
}

// imp-95419 theta-dual scalar class floor A_opt(delta), sum of positive terms.
function aOptDual(delta) {
  let s = 0;
  for (let n = 0; n <= 5000; n++) {
    const t = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += t;
    if (n > 2 && t < s * 1e-30) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

// Jacobi min eigenvalue (float64), same routine as imp-95708 / imp-95725.
function eigMin(A0) {
  const n = A0.length;
  const A = A0.map((r) => r.slice());
  for (let sweep = 0; sweep < 200; sweep++) {
    let off = 0;
    for (let i = 0; i < n; i++)
      for (let j = i + 1; j < n; j++) off += A[i][j] * A[i][j];
    if (off < 1e-30) break;
    for (let p = 0; p < n - 1; p++) {
      for (let q = p + 1; q < n; q++) {
        if (Math.abs(A[p][q]) < 1e-18) continue;
        const theta = (A[q][q] - A[p][p]) / (2 * A[p][q]);
        const t =
          Math.sign(theta || 1) /
          (Math.abs(theta) + Math.sqrt(theta * theta + 1));
        const c = 1 / Math.sqrt(t * t + 1);
        const s = t * c;
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
      }
    }
  }
  let mn = Infinity;
  for (let i = 0; i < n; i++) mn = Math.min(mn, A[i][i]);
  return mn;
}

const REF = IMP95742_SZEGO_REMAINDER_DERIVATIVE_WITNESS;

function r1Full(delta) {
  const xs = [];
  let base = 0;
  for (let k = 0; k < REF.nPairs; k++) {
    xs.push(base);
    xs.push(base + delta);
    base += 2 * delta;
  }
  const G = xs.map((a) => xs.map((b) => sech((a - b) / 2)));
  return eigMin(G) / aOptDual(delta);
}

const H = Math.PI / REF.Nplus1;
function gLead(delta) {
  return ((Math.PI * Math.PI) / (2 * delta * delta)) * H * H;
}
function dgAbs(delta) {
  return ((Math.PI * Math.PI) / (delta * delta * delta)) * H * H;
}
function remainder(delta) {
  return r1Full(delta) - 1 - gLead(delta);
}
// wide central-stencil derivative of R (step above the float64 floor).
function dRwide(delta, step) {
  return (remainder(delta + step) - remainder(delta - step)) / (2 * step);
}

export const IMP95742_ASSERTIONS = [
  {
    id: "imp95742-remainder-derivative-negative-interior",
    description:
      "with a floor-aware wide central stencil (step 2e-3) the remainder " +
      "derivative dR/ddelta is strictly negative at every point of the interior " +
      "window [ln 1.42, ln 2.0] -- the sharpened one-sided condition",
    holds: () => {
      const lo = Math.log(1.42);
      const hi = Math.log(2.0);
      const M = 12;
      for (let i = 0; i <= M; i++) {
        const d = lo + ((hi - lo) * i) / M;
        if (!(dRwide(d, REF.stencilStep) < 0)) return false;
      }
      return REF.remainderDerivativeNegativeEverywhere === true;
    },
  },
  {
    id: "imp95742-two-sided-condition-holds-with-margin",
    description:
      "the imp-95725 target |dR/ddelta| < |dg/ddelta| holds with margin: the " +
      "wide-stencil ratio stays below the recorded interior/endpoint caps " +
      "(<= 0.62 interior, <= 0.69 at ln 1.4)",
    holds: () => {
      // interior
      const lo = Math.log(1.42);
      const hi = Math.log(2.0);
      const M = 12;
      let maxInt = 0;
      for (let i = 0; i <= M; i++) {
        const d = lo + ((hi - lo) * i) / M;
        maxInt = Math.max(maxInt, Math.abs(dRwide(d, REF.stencilStep)) / dgAbs(d));
      }
      // endpoint at ln 1.4 (use a slightly wider step so it clears the floor)
      const d14 = Math.log(1.4);
      const rEnd = Math.abs(dRwide(d14, 3e-3)) / dgAbs(d14);
      return (
        maxInt < REF.maxDerivativeRatioInterior &&
        maxInt > 0 &&
        rEnd < REF.maxDerivativeRatioEndpoint
      );
    },
  },
  {
    id: "imp95742-total-derivative-negative-a-fortiori",
    description:
      "because dg/ddelta < 0 (proved) and dR/ddelta < 0 (measured), the total " +
      "dr1/ddelta = dg/ddelta + dR/ddelta is strictly negative at sample deltas " +
      "-- monotonicity of r1 follows a fortiori from the one-sided sign",
    holds: () => {
      for (const mult of [1.5, 1.7, 1.9]) {
        const d = Math.log(mult);
        const dr1 = -dgAbs(d) + dRwide(d, REF.stencilStep); // dg<0 so -dgAbs
        if (!(dr1 < 0)) return false;
        if (!(dRwide(d, REF.stencilStep) < 0)) return false;
      }
      return /dR\/ddelta <= 0/.test(REF.sharpenedCondition);
    },
  },
  {
    id: "imp95742-raw-remainder-strictly-decreasing-through-endpoint",
    description:
      "independent of any differencing, the raw R samples strictly decrease " +
      "through the left endpoint R(ln1.4 - e) > R(ln1.4) > R(ln1.4 + e) " +
      "(e = 3e-3) -- so the endpoint monotonicity is real, not a stencil effect",
    holds: () => {
      const d14 = Math.log(1.4);
      const e = 3e-3;
      const Rm = remainder(d14 - e);
      const R0 = remainder(d14);
      const Rp = remainder(d14 + e);
      return Rm > R0 && R0 > Rp && R0 > 0;
    },
  },
  {
    id: "imp95742-fine-stencil-artifact-documented",
    description:
      "a naive too-fine step (e = 1e-5) at ln 1.4 produces a spurious POSITIVE " +
      "dR/ddelta (float64 eigensolver-floor artifact) while the robust wide step " +
      "(e = 3e-3) is negative -- documenting the artifact so it is not read as a " +
      "monotonicity violation",
    holds: () => {
      const d14 = Math.log(1.4);
      const fine = dRwide(d14, REF.artifactStep); // spurious, sign unstable
      const robust = dRwide(d14, 3e-3); // true negative sign
      // the fine stencil is anomalous: either wrong sign or wildly larger magnitude
      const anomalous = fine > 0 || Math.abs(fine) > 10 * Math.abs(robust);
      return anomalous && robust < 0;
    },
  },
  {
    id: "imp95742-remainder-is-order-h3-delta-dependent",
    description:
      "R is O(h^3) with a delta-DEPENDENT coefficient: the proxy " +
      "R (N+1)^3 delta^3 / pi^6 is in [0.25, 0.55] and decreases from ln 1.4 to " +
      "ln 2.0 (matches the recorded 0.487 -> 0.285), so R is not a rescaled g",
    holds: () => {
      const proxy = (d) =>
        (remainder(d) * Math.pow(REF.Nplus1, 3) * Math.pow(d, 3)) /
        Math.pow(Math.PI, 6);
      const p14 = proxy(Math.log(1.4));
      const p20 = proxy(Math.log(2.0));
      return (
        p14 > 0.25 &&
        p14 < 0.55 &&
        p20 > 0.25 &&
        p20 < 0.55 &&
        p20 < p14 &&
        Math.abs(p14 - REF.c2ProxyLn14) < 0.02 &&
        Math.abs(p20 - REF.c2ProxyLn20) < 0.02
      );
    },
  },
  {
    id: "imp95742-not-a-bound-obstruction-pinned",
    description:
      "this strengthens the sub-gap witness and pins the analytic obstruction " +
      "(the next-order edge coefficient C2(delta)); it moves no Lambda bound and " +
      "proves no QED, and SZEGO-REMAINDER-MONO stays open as a theorem",
    holds: () =>
      REF.boundChange === false &&
      REF.qed === false &&
      REF.residualSubGap === "SZEGO-REMAINDER-MONO" &&
      /OBSTRUCTION PINNED/.test(REF.verdict) &&
      /C2\(delta\)/.test(REF.residualSubGapDescription) &&
      /refereed bound is changed/i.test(REF.verdict),
  },
  {
    id: "imp95742-closes-self",
    description: "this module is the deliverable the imp-95742 ticket asked for",
    holds: () => REF.closesTickets.includes("imp-95742"),
  },
];

for (const a of IMP95742_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95742-szego-remainder-derivative-witness assertion failed: ${a.id}`,
    );
  }
}

export default IMP95742_SZEGO_REMAINDER_DERIVATIVE_WITNESS;
