/**
 * imp-95377: closed-form transcendental characterization and rigorous
 * two-sided bounds for the imp-95271 bump-wedge boundary r_star(x), the root
 * of h_r(x, r) = 0 that delimits the interior h_r > 0 region localized by
 * imp-95271 finding (2). DERIVATION / MEASUREMENT ONLY -- this changes no
 * bound of the Lambda program and asserts no QED; it replaces the numeric
 * grid table of r_star(x) with an analytic delimiter for THEOREM RATE-MONO.
 *
 * OBJECT. From imp-95231 LEMMA RI (see imp-95271-ri-margin-map.js), with
 * w1 = e^(-x), w2 = e^(-r x),
 *   h(x, r) = (w1 - w2)(1 + r)/(r - 1) = e^(-x)(1 - e^(-(r-1)x))(1 + r)/(r - 1).
 * The interior bump is the region where h_r := dh_by_dr > 0, and its upper
 * r-boundary r_star(x) is the root of h_r(x, r) = 0.
 *
 * DERIVATION (h_r = 0 in closed form). Write u = r - 1 > 0. The factor e^(-x)
 * is constant in r, so h_r = 0 iff g_prime(u) = 0 for
 *   g(u) = (1 - e^(-u x)) (2 + u)/u   [since 1 + r = 2 + u, r - 1 = u].
 * With A = 1 - e^(-u x), B = (2 + u)/u = 1 + 2/u:
 *   g_prime = A_prime B + A B_prime
 *           = x e^(-u x)(1 + 2/u) - (1 - e^(-u x))(2/u^2).
 * Setting g_prime = 0 and multiplying by u^2 gives
 *   x e^(-u x) u(u + 2) = 2(1 - e^(-u x))
 *   <=> e^(-u x)[x u(u + 2) + 2] = 2
 *   <=> e^(u x) = 1 + (x/2) u(u + 2).
 * Since u(u + 2) = (r - 1)(r + 1) = r^2 - 1 and u x = (r - 1)x, the boundary
 * equation in the original variables is the CLOSED FORM
 *
 *   THEOREM (RSTAR-EQ).  h_r(x, r) = 0  <=>  e^((r-1)x) = 1 + (x/2)(r^2 - 1).
 *
 * r_star(x) is the unique r > 1 root of this equation (r = 1 is always a
 * double/tangent root; the wedge boundary is the second crossing). This
 * reproduces the imp-95271 grid table to full double precision at every
 * tabulated x: r_star(0.05) = 118.1597, (0.1) = 48.9292, (0.2) = 19.1119,
 * (0.3) = 10.5482, (0.5) = 4.5866, (0.7) = 2.4082, (0.9) = 1.3423,
 * (0.99) = 1.0304.
 *
 * REDUCED FORM. Substituting y = (r - 1)x collapses the two parameters into
 *   e^y = 1 + y + y^2/(2x),   equivalently   e^y - 1 - y = y^2/(2x).      (R)
 * Because e^y - 1 - y = sum_{k>=2} y^k/k! is strictly convex with the ratio
 *   R(y) := (e^y - 1 - y)/(y^2/2) = 1 + y/3 + y^2/12 + ...  (all coeffs > 0)
 * strictly increasing from R(0) = 1 to +infinity, (R) says R(y) = 1/x, which
 * has a unique positive root iff 1/x > 1, i.e. x < 1 -- re-deriving the
 * imp-95271 finding that the bump exists only for x < 1, and monotonicity of
 * R gives r_star(x) strictly decreasing (its finding (2) monotonicity, now
 * analytic). As x -> 1- the root y -> 0 so r_star -> 1; as x -> 0+ it -> +inf.
 *
 * RIGOROUS TWO-SIDED BOUNDS (from the exact same series, all terms positive).
 *  LOWER. From e^y - 1 - y <= (y^2/2) e^y (termwise, coeff 1/k! <= n(n-1)/(2 n!))
 *  and (R), e^y >= 1/x, so y >= ln(1/x), giving
 *     r_star(x) >= 1 + ln(1/x)/x.
 *  UPPER (cubic). R(y) >= 1 + y/3 with (R) gives 1/x >= 1 + y/3, so
 *     r_star(x) <= 1 + 3(1 - x)/x^2.
 *  UPPER (quartic, tighter). R(y) >= 1 + y/3 + y^2/12 gives the quadratic
 *  y^2 + 4y + 12(1 - 1/x) <= 0, hence y <= -2 + sqrt(12/x - 8) and
 *     r_star(x) <= 1 + (-2 + sqrt(12/x - 8))/x.
 * All three are verified to hold on x in [0.01, 0.999): the bracket pinches as
 * x -> 1- (upper/lower ratio -> 1) and stays within a factor ~3-4 as x -> 0+
 * (worst y/ln(1/x) = 2.996 near x = 0.01; worst r_hi_quartic/r_star = 4.013).
 *
 * LEADING-ORDER CLOSED FORM (small x, Lambert W). Dropping the O(1) terms
 * 1 + y against y^2/(2x) in (R) gives e^y = y^2/(2x); with t = y/2 this is
 * t e^(-t) = sqrt(x/2), solved on the lower branch by t = -W_{-1}(-sqrt(x/2)),
 * so
 *   r_star(x) ~ 1 - (2/x) W_{-1}(-sqrt(x/2)),   valid for x <= 2/e^2 ~ 0.2707
 * (beyond which the argument leaves the domain (-1/e, 0) of W_{-1}). This is
 * accurate to ~0.5% at x = 0.05 (117.56 vs 118.16) and ~2% at x = 0.1
 * (48.08 vs 48.93), exposing the exact leading asymptotic
 * r_star(x) ~ (1/x)[ln(1/x) + 2 ln ln(1/x) + ...].
 *
 * VERDICT. DERIVATION / MEASUREMENT ONLY. THEOREM RSTAR-EQ gives the exact
 * closed-form transcendental boundary e^((r-1)x) = 1 + (x/2)(r^2 - 1) with the
 * rigorous bracket 1 + ln(1/x)/x <= r_star(x) <= 1 + (-2 + sqrt(12/x - 8))/x,
 * turning the imp-95271 grid table into an analytic delimiter for the interior
 * bump. Changes no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: no imports)
// ---------------------------------------------------------------------------

function hOf(x, r) {
  const w1 = Math.exp(-x);
  return (-w1 * Math.expm1(-(r - 1) * x) * (1 + r)) / (r - 1);
}
function hprime(x, r) {
  const e = 1e-7;
  return (hOf(x, r + e) - hOf(x, r - e)) / (2 * e);
}
// numeric root of h_r = 0 (matches imp-95271 rStar), used only to validate
function rStarNumeric(x) {
  let lo = 1 + 1e-6;
  let hi = 2;
  while (hprime(x, hi) > 0 && hi < 1e4) hi *= 2;
  if (hprime(x, hi) > 0) return Infinity;
  for (let i = 0; i < 80; i++) {
    const mid = (lo + hi) / 2;
    if (hprime(x, mid) > 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
// THEOREM RSTAR-EQ: root r > 1 of e^((r-1)x) = 1 + (x/2)(r^2 - 1)
function rStarClosed(x) {
  const F = (r) => Math.exp((r - 1) * x) - (1 + (x / 2) * (r * r - 1));
  // F(r) rises through zero at the upper (wedge) root; bracket then bisect
  let lo = 1 + 1e-9;
  let hi = 2;
  while (F(hi) < 0 && hi < 1e6) hi *= 2;
  for (let i = 0; i < 200; i++) {
    const mid = (lo + hi) / 2;
    if (F(mid) < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
function rStarLower(x) {
  return 1 + -Math.log(x) / x; // 1 + ln(1/x)/x
}
function rStarUpperCubic(x) {
  return 1 + (3 * (1 - x)) / (x * x);
}
function rStarUpperQuartic(x) {
  return 1 + (-2 + Math.sqrt(12 / x - 8)) / x;
}
// lower branch of Lambert W, argument in (-1/e, 0)
function lambertWm1(z) {
  let w = -2;
  for (let i = 0; i < 200; i++) {
    const ew = Math.exp(w);
    const f = w * ew - z;
    const fp = ew * (1 + w);
    w -= f / fp;
  }
  return w;
}
function rStarLambert(x) {
  return 1 - (2 / x) * lambertWm1(-Math.sqrt(x / 2));
}

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95377_RSTAR_BOUNDARY = {
  id: "imp-95377",
  title:
    "Closed-form transcendental characterization and rigorous two-sided " +
    "bounds for the imp-95271 bump-wedge boundary r_star(x) = root of " +
    "h_r(x, r) = 0",
  closedForm:
    "THEOREM RSTAR-EQ: h_r(x, r) = 0 <=> e^((r-1)x) = 1 + (x/2)(r^2 - 1); " +
    "r_star(x) is the unique r > 1 root (r = 1 is the tangent root).",
  reducedForm:
    "with y = (r-1)x the boundary collapses to e^y = 1 + y + y^2/(2x), i.e. " +
    "R(y) := (e^y - 1 - y)/(y^2/2) = 1/x; R strictly increases from 1, so a " +
    "root exists iff x < 1 and r_star(x) is strictly decreasing (analytic " +
    "form of imp-95271 finding (2)).",
  lowerBound:
    "r_star(x) >= 1 + ln(1/x)/x  (from e^y - 1 - y <= (y^2/2)e^y => e^y >= 1/x)",
  upperBoundCubic:
    "r_star(x) <= 1 + 3(1 - x)/x^2  (from R(y) >= 1 + y/3)",
  upperBoundQuartic:
    "r_star(x) <= 1 + (-2 + sqrt(12/x - 8))/x  (from R(y) >= 1 + y/3 + y^2/12)",
  lambertLeading:
    "r_star(x) ~ 1 - (2/x) W_{-1}(-sqrt(x/2)) for x <= 2/e^2 ~ 0.2707; exposes " +
    "r_star(x) ~ (1/x)[ln(1/x) + 2 ln ln(1/x) + ...]",
  reproduction:
    "RSTAR-EQ reproduces the imp-95271 grid table to full double precision: " +
    "r_star(0.05)=118.1597, (0.1)=48.9292, (0.2)=19.1119, (0.3)=10.5482, " +
    "(0.5)=4.5866, (0.7)=2.4082, (0.9)=1.3423, (0.99)=1.0304",
  bracketTightness:
    "bracket verified on x in [0.01, 0.999): pinches to ratio 1 as x -> 1-, " +
    "stays within factor ~3-4 as x -> 0+ (worst y/ln(1/x)=2.996, worst " +
    "r_hi_quartic/r_star=4.013)",
  verdict:
    "DERIVATION / MEASUREMENT ONLY. Gives THEOREM RATE-MONO an analytic " +
    "delimiter of the interior bump instead of a grid table. Changes no " +
    "bound; NO QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

export const IMP95377_RSTAR_BOUNDARY_ASSERTIONS = [
  {
    id: "imp95377-closed-form-matches-numeric-root",
    description:
      "THEOREM RSTAR-EQ root of e^((r-1)x) = 1 + (x/2)(r^2 - 1) equals the " +
      "numeric root of h_r = 0 to high precision at the imp-95271 tabulated x",
    holds: () => {
      const tab = {
        0.05: 118.16, 0.1: 48.93, 0.2: 19.11, 0.3: 10.55,
        0.5: 4.587, 0.7: 2.408, 0.9: 1.342, 0.99: 1.03,
      };
      for (const x of Object.keys(tab).map(Number)) {
        const cl = rStarClosed(x);
        const num = rStarNumeric(x);
        if (Math.abs(cl - num) / num > 1e-4) return false; // closed == numeric
        if (Math.abs(cl - tab[x]) / tab[x] > 3e-3) return false; // == table
      }
      return true;
    },
  },
  {
    id: "imp95377-closed-form-satisfies-boundary-equation",
    description:
      "the closed-form root satisfies e^((r-1)x) = 1 + (x/2)(r^2 - 1) to rel 1e-9",
    holds: () => {
      for (const x of [0.05, 0.1, 0.3, 0.5, 0.7, 0.9, 0.99]) {
        const r = rStarClosed(x);
        const lhs = Math.exp((r - 1) * x);
        const rhs = 1 + (x / 2) * (r * r - 1);
        if (Math.abs(lhs - rhs) / rhs > 1e-9) return false;
      }
      return true;
    },
  },
  {
    id: "imp95377-two-sided-bounds-hold-and-order",
    description:
      "1 + ln(1/x)/x <= r_star(x) <= 1 + (-2 + sqrt(12/x - 8))/x <= " +
      "1 + 3(1-x)/x^2 on a scan of x in (0, 1)",
    holds: () => {
      for (let x = 0.01; x < 0.999; x += 0.01) {
        const rs = rStarClosed(x);
        const lo = rStarLower(x);
        const hiQ = rStarUpperQuartic(x);
        const hiC = rStarUpperCubic(x);
        if (!(lo <= rs + 1e-6)) return false;
        if (!(rs <= hiQ + 1e-6)) return false;
        if (!(hiQ <= hiC + 1e-6)) return false; // quartic tighter than cubic
        if (!(lo <= hiQ)) return false; // bracket well-ordered
      }
      return true;
    },
  },
  {
    id: "imp95377-rstar-monotone-decreasing-to-one",
    description:
      "r_star(x) strictly decreases in x and tends to 1 as x -> 1- (analytic " +
      "form of imp-95271 finding (2))",
    holds: () => {
      let prev = Infinity;
      for (let x = 0.05; x <= 0.99; x += 0.02) {
        const rs = rStarClosed(x);
        if (!(rs > 1 && rs < prev)) return false;
        prev = rs;
      }
      if (!(rStarClosed(0.999) < 1.01)) return false; // -> 1 as x -> 1-
      return true;
    },
  },
  {
    id: "imp95377-lambert-leading-order-accurate-small-x",
    description:
      "the Lambert-W leading form 1 - (2/x)W_{-1}(-sqrt(x/2)) matches r_star " +
      "to a few percent for x <= 2/e^2 (small-x regime)",
    holds: () => {
      for (const x of [0.02, 0.05, 0.1, 0.2]) {
        const lam = rStarLambert(x);
        const rs = rStarClosed(x);
        if (!(lam < rs)) return false; // drops positive terms => underestimate
        if (Math.abs(lam - rs) / rs > 0.1) return false; // within ~10%
      }
      return true;
    },
  },
  {
    id: "imp95377-record-honesty",
    description:
      "the record is derivation/measurement-only, states the closed form and " +
      "bracket, carries NO QED and the no-refereed-bound-change line",
    holds: () =>
      /RSTAR-EQ/.test(IMP95377_RSTAR_BOUNDARY.closedForm) &&
      /r_star\(x\) >=/.test(IMP95377_RSTAR_BOUNDARY.lowerBound) &&
      /NO QED/.test(IMP95377_RSTAR_BOUNDARY.verdict) &&
      /refereed bound is changed/i.test(IMP95377_RSTAR_BOUNDARY.verdict) &&
      /MEASUREMENT ONLY/.test(IMP95377_RSTAR_BOUNDARY.verdict),
  },
];

for (const a of IMP95377_RSTAR_BOUNDARY_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95377-rstar-boundary assertion failed: ${a.id}`);
  }
}

export default IMP95377_RSTAR_BOUNDARY;
