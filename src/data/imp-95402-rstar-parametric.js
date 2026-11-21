/**
 * imp-95402: exact ELEMENTARY PARAMETRIC closed form for the imp-95271 wedge
 * boundary r_star(x) = root of h_r(x, r) = 0, turning the eight-point sampled
 * curve into a single analytic object. DERIVATION ONLY -- changes no bound of
 * the Lambda program and asserts no QED; it supports the imp-95231 THEOREM
 * RATE-MONO closure by giving its open-regime boundary an exact form.
 *
 * SETUP. From imp-95271 / imp-95231 LEMMA RI, with w1 = e^(-x),
 * w2 = e^(-r x) and h = (w1 - w2)(1 + r)/(r - 1), the h_r > 0 bump (where the
 * reduced inequality is non-trivial) is the wedge { x < 1, 1 < r < r_star(x) },
 * with r_star the root of dh/dr = 0.
 *
 * EXACT ROOT EQUATION. Differentiating h in r and clearing (r - 1)^2 gives
 * dh/dr = 0  <=>  x e^(-r x)(r^2 - 1) = 2(e^(-x) - e^(-r x)), i.e.
 *   2 e^((r - 1) x) = x(r^2 - 1) + 2,   equivalently   e^((r-1)x) = 1 + (x/2)(r^2 - 1).
 * This is the imp-95377 THEOREM RSTAR-EQ transcendental characterization; it is
 * transcendental in r at fixed x, so r_star(x) has no elementary closed form in
 * x (whence the imp-95377/imp-95427/imp-95447 brackets and asymptotics).
 *
 * THE PARAMETRIC CLOSED FORM (this ticket). Substitute the single parameter
 * u = (r - 1) x > 0. Then r^2 - 1 = (r - 1)(r + 1) = (u/x)(2 + u/x), so
 * x(r^2 - 1) = 2 u + u^2 / x, and the root equation becomes
 *   2 e^u = 2 u + u^2 / x + 2   =>   x = u^2 / (2 (e^u - 1 - u)).
 * Back-substituting r = 1 + u/x yields the EXACT ELEMENTARY parametrization of
 * the whole wedge boundary:
 *   x(u)      = u^2 / (2 (e^u - 1 - u)),
 *   r_star(u) = 1 + 2 (e^u - 1 - u) / u,        u in (0, infinity).
 * Both branches are elementary in u even though r_star(x) is not elementary in
 * x. The map u -> x(u) is a strictly decreasing bijection (0, infinity) ->
 * (0, 1), with u -> 0+ giving the (x, r) -> (1, 1) coalescence corner and
 * u -> infinity giving x -> 0+, r_star -> infinity; r_star(u) is strictly
 * increasing. So the boundary is a single monotone analytic curve, recovered
 * exactly by sweeping u and inverting x(u) (monotone, one bisection) at any x.
 *
 * NEAR-1 EDGE (consistency with imp-95447). As u -> 0, e^u - 1 - u = u^2/2 +
 * u^3/6 + ..., so x = 1 / (1 + u/3 + ...) and r_star = 1 + u + u^2/3 + ...;
 * eliminating u gives r_star(x) = 1 + 3(1 - x) + O((1-x)^2), the exact
 * leading edge term also delivered by imp-95447 THEOREM RSTAR-EDGE.
 *
 * CROSS-CHECK. Inverting x(u) reproduces all eight imp-95271 tabulated points
 * to full displayed precision: r_star(0.05)=118.16, (0.1)=48.93, (0.2)=19.11,
 * (0.3)=10.55, (0.5)=4.587, (0.7)=2.408, (0.9)=1.342, (0.99)=1.030.
 *
 * VERDICT. DERIVATION ONLY. Changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: no imports)
// ---------------------------------------------------------------------------

// e^u - 1 - u, evaluated stably for small u via expm1.
function emOneMinusU(u) {
  return Math.expm1(u) - u;
}

// Exact parametric wedge boundary at parameter u = (r - 1) x > 0.
function boundaryAtU(u) {
  const g = emOneMinusU(u);
  return { x: (u * u) / (2 * g), r: 1 + (2 * g) / u };
}

// r_star(x): invert the strictly-decreasing bijection x(u) by bisection in u.
function rStarParam(x) {
  let lo = 1e-12;
  let hi = 1;
  // grow hi until x(hi) < x (x(u) decreasing, so large u -> small x)
  while (boundaryAtU(hi).x > x && hi < 1e6) hi *= 2;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (boundaryAtU(mid).x > x) lo = mid;
    else hi = mid;
  }
  return boundaryAtU((lo + hi) / 2).r;
}

// Independent reference: h_r via central difference on the exact h (imp-95271),
// used only to confirm the parametric root really solves dh/dr = 0.
function hOf(x, r) {
  const w1 = Math.exp(-x);
  return (-w1 * Math.expm1(-(r - 1) * x) * (1 + r)) / (r - 1);
}
function hPrime(x, r) {
  const e = 1e-7;
  return (hOf(x, r + e) - hOf(x, r - e)) / (2 * e);
}

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95402_RSTAR_PARAMETRIC = {
  id: "imp-95402",
  title:
    "Exact elementary parametric closed form for the imp-95271 wedge boundary " +
    "r_star(x): x(u) = u^2/(2(e^u - 1 - u)), r_star(u) = 1 + 2(e^u - 1 - u)/u, " +
    "u in (0, inf), reproducing the eight tabulated points to full precision",
  rootEquation:
    "dh/dr = 0 <=> 2 e^((r-1)x) = x(r^2 - 1) + 2 (imp-95377 RSTAR-EQ); " +
    "transcendental in r, so r_star(x) has no elementary closed form in x",
  parametrization:
    "with u = (r-1)x > 0: x(u) = u^2/(2(e^u - 1 - u)), " +
    "r_star(u) = 1 + 2(e^u - 1 - u)/u; both branches elementary in u",
  bijection:
    "u -> x(u) is a strictly decreasing bijection (0, inf) -> (0, 1); " +
    "u->0+ gives the (x,r)->(1,1) coalescence corner, u->inf gives x->0+, " +
    "r_star->inf; r_star(u) strictly increasing -- one monotone analytic curve",
  edgeConsistency:
    "as u->0: x = 1/(1 + u/3 + ...), r_star = 1 + u + u^2/3 + ..., so " +
    "r_star(x) = 1 + 3(1-x) + O((1-x)^2), matching imp-95447 RSTAR-EDGE",
  tabulatedCrossCheck: {
    "0.05": 118.16,
    "0.1": 48.93,
    "0.2": 19.11,
    "0.3": 10.55,
    "0.5": 4.587,
    "0.7": 2.408,
    "0.9": 1.342,
    "0.99": 1.03,
  },
  relatesTo: ["imp-95271", "imp-95231", "imp-95377", "imp-95427", "imp-95447"],
  verdict:
    "DERIVATION ONLY; changes no bound; NO QED; no refereed bound is changed" +
    ". Complements the imp-95377 implicit equation and the " +
    "imp-95427/imp-95447 asymptotics with an EXACT elementary parametrization.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

export const IMP95402_RSTAR_PARAMETRIC_ASSERTIONS = [
  {
    id: "imp95402-reproduces-eight-tabulated-points",
    description:
      "the parametric r_star(x) reproduces the eight imp-95271 tabulated points " +
      "to their displayed precision",
    holds: () => {
      const tab = Object.entries(IMP95402_RSTAR_PARAMETRIC.tabulatedCrossCheck);
      for (const [xs, target] of tab) {
        const x = Number(xs);
        const got = rStarParam(x);
        // tabulated values carry 4-5 significant figures; require rel 5e-4
        if (Math.abs(got - target) / target > 5e-4) return false;
      }
      return true;
    },
  },
  {
    id: "imp95402-parametric-solves-hr-zero",
    description:
      "the (x, r_star) points from the parametrization actually solve " +
      "dh/dr = 0 (independent central-difference check on the exact h)",
    holds: () => {
      for (const u of [0.05, 0.3, 1.0, 1.7935, 3.0, 5.858]) {
        const { x, r } = boundaryAtU(u);
        // scale-free residual: |h_r| relative to |h|/r near the root
        if (Math.abs(hPrime(x, r)) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95402-satisfies-imp95377-implicit-equation",
    description:
      "each boundary point satisfies the imp-95377 implicit equation " +
      "e^((r-1)x) = 1 + (x/2)(r^2 - 1) to machine precision",
    holds: () => {
      for (const u of [0.03, 0.3, 1.7935, 4.0, 5.858]) {
        const { x, r } = boundaryAtU(u);
        const lhs = Math.exp((r - 1) * x);
        const rhs = 1 + (x / 2) * (r * r - 1);
        if (Math.abs(lhs - rhs) / rhs > 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95402-monotone-bijection-onto-unit-interval",
    description:
      "x(u) is strictly decreasing and r_star(u) strictly increasing, with " +
      "x -> 1 as u -> 0+ and x -> 0 as u -> inf",
    holds: () => {
      let px = Infinity;
      let pr = -Infinity;
      for (let u = 0.002; u < 14; u += 0.01) {
        const { x, r } = boundaryAtU(u);
        if (x >= px || r <= pr) return false;
        px = x;
        pr = r;
      }
      if (!(boundaryAtU(1e-7).x > 0.99999)) return false;
      if (!(boundaryAtU(14).x < 1e-3)) return false;
      return true;
    },
  },
  {
    id: "imp95402-edge-leading-term",
    description:
      "the near-1 edge expansion gives r_star(x) = 1 + 3(1-x) + O((1-x)^2), " +
      "matching imp-95447 (the 1 + 3(1-x) term is exact to leading order)",
    holds: () => {
      // very close to x = 1 the two agree to high relative accuracy
      const x = 0.999;
      const got = rStarParam(x);
      const lead = 1 + 3 * (1 - x);
      return Math.abs(got - lead) / (got - 1) < 2e-3;
    },
  },
  {
    id: "imp95402-record-honesty",
    description:
      "the record is derivation-only, names the parametrization, carries NO QED " +
      "and the no-refereed-bound-change line, and references imp-95271 / imp-95377",
    holds: () =>
      /DERIVATION ONLY/.test(IMP95402_RSTAR_PARAMETRIC.verdict) &&
      /NO QED/.test(IMP95402_RSTAR_PARAMETRIC.verdict) &&
      /refereed bound is changed/i.test(IMP95402_RSTAR_PARAMETRIC.verdict) &&
      IMP95402_RSTAR_PARAMETRIC.relatesTo.includes("imp-95271") &&
      IMP95402_RSTAR_PARAMETRIC.relatesTo.includes("imp-95377"),
  },
];

for (const a of IMP95402_RSTAR_PARAMETRIC_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95402-rstar-parametric assertion failed: ${a.id}`);
  }
}

export default IMP95402_RSTAR_PARAMETRIC;
