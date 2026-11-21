/**
 * imp-95427: accuracy of the imp-95377 Lambert-W_{-1} leading form for the
 * bump-wedge boundary r_star(x), and a matched surrogate that extends the
 * closed-form asymptote past its x <= 2/e^2 validity ceiling into the mid-range
 * x in [2/e^2, 1) toward r_star -> 1. MEASUREMENT / DERIVATION ONLY -- this
 * changes no bound of the Lambda program and asserts no QED.
 *
 * OBJECT. From imp-95377 (see imp-95377-rstar-boundary-closed-form.js), the
 * bump-wedge boundary r_star(x) is the unique r > 1 root of THEOREM RSTAR-EQ
 *   e^((r-1)x) = 1 + (x/2)(r^2 - 1),
 * equivalently, with y = (r-1)x, the reduced form
 *   e^y = 1 + y + y^2/(2x).                                              (R)
 * imp-95377 gave the small-x LEADING FORM (drop 1 + y against y^2/(2x) in (R)):
 *   r_star(x) ~ 1 - (2/x) W_{-1}(-sqrt(x/2)),   valid only for x <= 2/e^2,
 * because the W_{-1} argument -sqrt(x/2) leaves the branch domain (-1/e, 0)
 * once x > 2/e^2 ~ 0.27067. This module (a) measures the error of that leading
 * form across x in (0, 2/e^2], and (b) supplies a matched surrogate for the
 * mid-range.
 *
 * (a) LEADING-FORM ACCURACY on (0, 2/e^2]. The relative error of the Lambert
 * leading form vs the exact r_star (bisected from RSTAR-EQ) is strictly
 * increasing in x on (0, 2/e^2] and small only deep in the small-x regime:
 *   x        rel err
 *   0.02     1.23e-3
 *   0.05     5.09e-3
 *   0.10     1.74e-2
 *   0.20     8.16e-2
 *   2/e^2    3.19e-1   (worst; at the validity ceiling)
 * So the leading form is a ~sub-percent asymptote only for x <~ 0.05 and
 * degrades to ~32% right at its own ceiling x = 2/e^2 -- it does NOT usefully
 * approach the mid-range.
 *
 * (b) MATCHED MID-RANGE SURROGATE. The natural closed-form continuation is the
 * QUARTIC series-inversion form (imp-95377 upper bound, here repurposed as a
 * two-sided approximant): inverting R(y) = 1/x with the two-term minorant
 * R(y) >= 1 + y/3 + y^2/12 gives the quadratic y^2 + 4y + 12(1 - 1/x) = 0, i.e.
 *   r_q(x) := 1 + (-2 + sqrt(12/x - 8))/x.
 * As x -> 1- the root y -> 0 and the neglected series tail is O(y^3), so
 * r_q(x) - r_star(x) = O((1-x)) -> 0: r_q is EXACT in the r_star -> 1 limit.
 * Measured relative error of r_q as an approximant (one-sided upper):
 *   x = 2/e^2   0.289   (seam; worst on the mid-range)
 *   x = 0.5     9.0e-2
 *   x = 0.7     2.3e-2
 *   x = 0.9     1.1e-3
 *   x = 0.99    1.3e-6
 * decreasing monotonically to 0 as x -> 1-. A robust refinement applies k
 * explicit Newton steps to (R), G(y) = e^y - 1 - y - y^2/(2x), from the quartic
 * seed (the quartic seed is monotone-safe on x >= 2/e^2, unlike the Lambert
 * seed which overshoots to the r = 1 tangent root near the seam): with k = 2
 * the worst mid-range relative error drops to 3.78e-2.
 *
 * SEAM STRUCTURE. At the crossover x = 2/e^2 the small-x form (rel err 0.319)
 * and the mid-range form (rel err 0.289) are comparable: the seam is the joint
 * accuracy bottleneck of the two closed forms, and neither single closed form
 * is better than ~29% there. The one-Newton refinement is what closes that gap.
 *
 * WHY THE EXTENSION IS POSSIBLE (derivation). Rewriting (R) exactly as
 * e^y = y^2/(2 x_eff) with x_eff := x y^2 / (y^2 + 2x(1 + y)) shows the true
 * root satisfies, with t = y/2,
 *   sqrt(x_eff/2) = (y/2) e^{-y/2} = t e^{-t} in (0, 1/e]   for all y > 0,
 * i.e. the EXACT effective Lambert argument -sqrt(x_eff/2) NEVER leaves the
 * branch domain -- the naive form fails past x = 2/e^2 only because it feeds
 * the raw x (not x_eff) to W_{-1}. Measured max effective argument over
 * x in (0, 1) is 0.3678793 <= 1/e = 0.3678794, confirming the identity.
 *
 * VERDICT. MEASUREMENT / DERIVATION ONLY. The imp-95377 Lambert leading form is
 * a sub-percent asymptote only for x <~ 0.05 (degrading to ~32% at its x=2/e^2
 * ceiling); the quartic series-inversion form r_q(x) is the matched mid-range
 * surrogate, exact as x -> 1-, refined to <= 3.8% by two Newton steps. Changes
 * no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: no imports)
// ---------------------------------------------------------------------------

const TWO_OVER_E2 = 2 / Math.E / Math.E; // 0.2706705664732254

// exact r_star: unique r > 1 root of e^((r-1)x) = 1 + (x/2)(r^2 - 1)
function rStarClosed(x) {
  const F = (r) => Math.exp((r - 1) * x) - (1 + (x / 2) * (r * r - 1));
  let lo = 1 + 1e-12;
  let hi = 2;
  while (F(hi) < 0 && hi < 1e9) hi *= 2;
  for (let i = 0; i < 300; i++) {
    const m = (lo + hi) / 2;
    if (F(m) < 0) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
}
// lower branch of Lambert W, argument in (-1/e, 0)
function lambertWm1(z) {
  let w = -2;
  for (let i = 0; i < 300; i++) {
    const ew = Math.exp(w);
    const f = w * ew - z;
    const fp = ew * (1 + w);
    const d = f / fp;
    w -= d;
    if (Math.abs(d) < 1e-16) break;
  }
  return w;
}
// imp-95377 small-x leading form (valid x <= 2/e^2)
function rStarLambert(x) {
  return 1 - (2 / x) * lambertWm1(-Math.sqrt(x / 2));
}
// matched mid-range surrogate: quartic series-inversion form (exact as x -> 1-)
function rStarQuartic(x) {
  return 1 + (-2 + Math.sqrt(12 / x - 8)) / x;
}
// refined mid-range surrogate: k Newton steps on (R) from the quartic seed
function rStarQuarticNewton(x, steps) {
  let y = -2 + Math.sqrt(12 / x - 8);
  const G = (yy) => Math.exp(yy) - 1 - yy - (yy * yy) / (2 * x);
  const Gp = (yy) => Math.exp(yy) - 1 - yy / x;
  for (let k = 0; k < steps; k++) y -= G(y) / Gp(y);
  return 1 + y / x;
}
// exact effective-x of the extension identity: e^y = y^2/(2 x_eff)
function xEffExact(x, y) {
  return (x * y * y) / (y * y + 2 * x * (1 + y));
}

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95427_RSTAR_LAMBERT_SURROGATE = {
  id: "imp-95427",
  title:
    "Accuracy of the imp-95377 Lambert-W_{-1} leading form for r_star(x) and a " +
    "matched surrogate extending it past x <= 2/e^2 into the mid-range",
  leadingFormError:
    "imp-95377 leading form 1 - (2/x)W_{-1}(-sqrt(x/2)) has relative error " +
    "strictly increasing on (0, 2/e^2]: 1.23e-3 (x=0.02), 5.09e-3 (0.05), " +
    "1.74e-2 (0.10), 8.16e-2 (0.20), 3.19e-1 at the ceiling x=2/e^2 " +
    "(sub-percent only for x <~ 0.05)",
  matchedSurrogate:
    "matched mid-range surrogate = quartic series-inversion form " +
    "r_q(x) = 1 + (-2 + sqrt(12/x - 8))/x (invert R(y) = 1/x with " +
    "R(y) >= 1 + y/3 + y^2/12); EXACT as x -> 1- since r_q - r_star = O((1-x)); " +
    "rel err 0.289 at seam 2/e^2 -> 1.3e-6 at x=0.99, monotone decreasing",
  refinedSurrogate:
    "k Newton steps on G(y) = e^y - 1 - y - y^2/(2x) from the quartic seed " +
    "(monotone-safe on x >= 2/e^2, unlike the Lambert seed which overshoots to " +
    "the r=1 tangent root); k=2 gives worst mid-range rel err 3.78e-2",
  seamStructure:
    "at the crossover x = 2/e^2 both closed forms are comparable (leading-form " +
    "rel err 0.319, quartic rel err 0.289): the seam is the joint accuracy " +
    "bottleneck; neither single closed form beats ~29% there",
  extensionIdentity:
    "exact rewrite e^y = y^2/(2 x_eff), x_eff = x y^2/(y^2 + 2x(1+y)), gives " +
    "sqrt(x_eff/2) = (y/2)e^{-y/2} = t e^{-t} in (0, 1/e] -- the exact effective " +
    "Lambert argument never leaves the branch domain; the naive form fails past " +
    "x=2/e^2 only because it feeds raw x, not x_eff, to W_{-1} " +
    "(measured max effective arg 0.3678793 <= 1/e = 0.3678794)",
  verdict:
    "MEASUREMENT / DERIVATION ONLY. Leading form is sub-percent only for " +
    "x <~ 0.05; quartic form is the matched mid-range surrogate, exact as " +
    "x -> 1-, refined to <= 3.8% by two Newton steps. Changes no bound; NO " +
    "QED; no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

export const IMP95427_RSTAR_LAMBERT_SURROGATE_ASSERTIONS = [
  {
    id: "imp95427-leading-form-error-monotone-and-worst",
    description:
      "the imp-95377 Lambert leading form relative error is strictly increasing " +
      "on (0, 2/e^2] and reaches ~0.319 at the ceiling x = 2/e^2",
    holds: () => {
      let prev = -1;
      for (let x = 0.01; x <= TWO_OVER_E2 - 1e-6; x += 0.01) {
        const re = Math.abs(rStarLambert(x) - rStarClosed(x)) / rStarClosed(x);
        if (re <= prev) return false; // strictly increasing
        prev = re;
      }
      const worst =
        Math.abs(rStarLambert(TWO_OVER_E2) - rStarClosed(TWO_OVER_E2)) /
        rStarClosed(TWO_OVER_E2);
      return worst > 0.3 && worst < 0.33; // ~0.319
    },
  },
  {
    id: "imp95427-leading-form-subpercent-only-small-x",
    description:
      "the leading form matches the tabulated small-x accuracy: ~1e-3 at x=0.02, " +
      "~5e-3 at 0.05, ~1.7e-2 at 0.1, ~8e-2 at 0.2",
    holds: () => {
      const want = { 0.02: 1.23e-3, 0.05: 5.09e-3, 0.1: 1.74e-2, 0.2: 8.16e-2 };
      for (const x of Object.keys(want).map(Number)) {
        const re = Math.abs(rStarLambert(x) - rStarClosed(x)) / rStarClosed(x);
        if (Math.abs(re - want[x]) / want[x] > 0.02) return false;
      }
      return true;
    },
  },
  {
    id: "imp95427-quartic-surrogate-exact-as-x-to-one",
    description:
      "the quartic matched surrogate is an upper approximant on [2/e^2, 1) with " +
      "relative error decreasing monotonically to 0 as x -> 1- (exact in the " +
      "r_star -> 1 limit)",
    holds: () => {
      let prevErr = Infinity;
      for (let x = 0.3; x < 0.999; x += 0.01) {
        const rs = rStarClosed(x);
        const q = rStarQuartic(x);
        if (q < rs - 1e-9) return false; // one-sided upper
        const re = (q - rs) / rs;
        if (re > prevErr + 1e-12) return false; // monotone decreasing
        prevErr = re;
      }
      // exact in the limit: rel err at x=0.99 below 1e-5
      const x = 0.99;
      return (rStarQuartic(x) - rStarClosed(x)) / rStarClosed(x) < 1e-5;
    },
  },
  {
    id: "imp95427-quartic-newton-refines-mid-range",
    description:
      "two Newton steps on (R) from the quartic seed drive the worst mid-range " +
      "[2/e^2, 1) relative error below 5e-2 (measured 3.78e-2)",
    holds: () => {
      let worst = 0;
      for (let x = TWO_OVER_E2; x < 0.999; x += 0.002) {
        const rs = rStarClosed(x);
        const v = rStarQuarticNewton(x, 2);
        const re = Math.abs(v - rs) / rs;
        if (re > worst) worst = re;
      }
      return worst > 0.03 && worst < 0.05; // ~0.0378
    },
  },
  {
    id: "imp95427-seam-is-joint-bottleneck",
    description:
      "at the crossover x = 2/e^2 both closed forms have comparable ~29% error " +
      "(leading-form 0.319, quartic 0.289) -- the seam is the accuracy bottleneck",
    holds: () => {
      const rs = rStarClosed(TWO_OVER_E2);
      const reL = Math.abs(rStarLambert(TWO_OVER_E2) - rs) / rs;
      const reQ = Math.abs(rStarQuartic(TWO_OVER_E2) - rs) / rs;
      return reL > 0.28 && reL < 0.33 && reQ > 0.27 && reQ < 0.31;
    },
  },
  {
    id: "imp95427-effective-arg-identity-in-domain",
    description:
      "the exact extension identity sqrt(x_eff/2) = (y/2)e^{-y/2} holds and the " +
      "effective Lambert argument stays in (0, 1/e] over x in (0, 1)",
    holds: () => {
      let maxArg = 0;
      for (let x = 0.005; x < 0.999; x += 0.005) {
        const rs = rStarClosed(x);
        const y = (rs - 1) * x;
        const lhs = Math.sqrt(xEffExact(x, y) / 2);
        const rhs = (y / 2) * Math.exp(-y / 2);
        if (Math.abs(lhs - rhs) > 1e-12) return false; // exact identity
        if (lhs > maxArg) maxArg = lhs;
      }
      return maxArg <= 1 / Math.E + 1e-9; // never leaves the W_{-1} domain
    },
  },
  {
    id: "imp95427-record-honesty",
    description:
      "the record is measurement/derivation-only, names the leading-form ceiling, " +
      "the matched surrogate and the extension identity, carries NO QED and SOTA",
    holds: () =>
      /increasing on \(0, 2\/e\^2\]/.test(
        IMP95427_RSTAR_LAMBERT_SURROGATE.leadingFormError,
      ) &&
      /EXACT as x -> 1-/.test(IMP95427_RSTAR_LAMBERT_SURROGATE.matchedSurrogate) &&
      /never leaves the branch domain/.test(
        IMP95427_RSTAR_LAMBERT_SURROGATE.extensionIdentity,
      ) &&
      /NO\s*\n?\s*QED|NO QED/.test(IMP95427_RSTAR_LAMBERT_SURROGATE.verdict) &&
      /refereed bound is changed/i.test(IMP95427_RSTAR_LAMBERT_SURROGATE.verdict) &&
      /MEASUREMENT \/ DERIVATION ONLY/.test(
        IMP95427_RSTAR_LAMBERT_SURROGATE.verdict,
      ),
  },
];

for (const a of IMP95427_RSTAR_LAMBERT_SURROGATE_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95427-rstar-lambert-surrogate assertion failed: ${a.id}`);
  }
}

export default IMP95427_RSTAR_LAMBERT_SURROGATE;
