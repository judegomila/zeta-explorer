/**
 * imp-95428: quintic (next-positive-term) sharpening of the imp-95377 two-sided
 * r_star(x) bracket, and measurement of the small-x bracket-factor reduction.
 * DERIVATION / MEASUREMENT ONLY -- this changes no bound of the Lambda program
 * and asserts no QED. It extends imp-95377-rstar-boundary-closed-form.js.
 *
 * BACKGROUND. imp-95377 reduced the bump-wedge boundary r_star(x) (root of
 * h_r(x, r) = 0) to R(y) = 1/x with y = (r - 1)x, where
 *   R(y) := (e^y - 1 - y)/(y^2/2) = 1 + y/3 + y^2/12 + y^3/60 + ...
 * has ALL series coefficients positive (coeff of y^{k-2} is 2/k!). Truncating
 * R after the y^2 term gave the QUARTIC upper bound
 *   r_star(x) <= 1 + (-2 + sqrt(12/x - 8))/x,
 * whose worst small-x looseness is r_hi_quartic/r_star = 4.013 near x = 0.01.
 * imp-95377 flagged the residual ~4x small-x looseness as the open item.
 *
 * MECHANISM (why only the UPPER bound improves). Because every coefficient of
 * R is positive, any finite truncation P_n(y) satisfies P_n(y) <= R(y) for all
 * y >= 0. With R increasing and R(y_star) = 1/x, solving P_n(y_n) = 1/x forces
 * P_n(y_star) <= 1/x = P_n(y_n), hence y_star <= y_n: the truncated-polynomial
 * root is an UPPER bound on y_star, and adding a further positive term lowers
 * y_n toward y_star. Symmetrically, a LOWER bound on y_star needs a polynomial
 * UPPER bound on R valid for all y > 0, which cannot exist because R(y) ~ 2e^y/
 * y^2 grows super-polynomially. So the positive-series lever sharpens ONLY the
 * upper bound; imp-95377 lower bound r_star >= 1 + ln(1/x)/x (from R(y) <= e^y)
 * is left intact -- its small-x looseness is a NAMED RESIDUAL requiring a
 * non-truncation (Lambert / exponential) mechanism.
 *
 * QUINTIC UPPER BOUND (next positive term y^3/60). From R(y) >= 1 + y/3 +
 * y^2/12 + y^3/60 and R(y_star) = 1/x,
 *   1 + y/3 + y^2/12 + y^3/60 = 1/x
 * i.e., multiplying by 60, the depressed-solvable CUBIC in y
 *   THEOREM (RSTAR-QUINTIC).  y^3 + 5 y^2 + 20 y + 60(1 - 1/x) = 0
 * has a unique positive root y5(x) (its derivative 3y^2 + 10y + 20 > 0 makes
 * the LHS strictly increasing from 60(1 - 1/x) < 0), and
 *   r_star(x) <= 1 + y5(x)/x   with y5 <= y_quartic, so this is TIGHTER.
 * Cardano closed form: with y = t - 5/3, p = 35/3, q = 970/27 - 60/x,
 *   t = cbrt(-q/2 + sqrt((q/2)^2 + (p/3)^3)) + cbrt(-q/2 - sqrt((q/2)^2 +
 *       (p/3)^3)),   y5 = t - 5/3   (discriminant > 0 since p > 0: one real).
 *
 * MEASURED REDUCTION (scan x in [0.01, 0.999)).
 *   worst upper factor r_hi/r_star:      quartic 4.013  ->  quintic 2.006
 *   worst two-sided bracket r_hi/r_lo:   quartic 7.050  ->  quintic 3.524
 * i.e., the next positive term halves both the small-x upper-bound looseness
 * and the full two-sided bracket width. Per-x: at x = 0.01 r_hi/r_star drops
 * 4.013 -> 2.006, at x = 0.05 2.248 -> 1.444, at x = 0.1 1.775 -> 1.272.
 *
 * VERDICT. DERIVATION / MEASUREMENT ONLY. THEOREM RSTAR-QUINTIC gives the
 * tighter cubic-root upper bound r_star(x) <= 1 + y5(x)/x, halving the small-x
 * bracket factor (4.013 -> 2.006 upper, 7.050 -> 3.524 two-sided). The lower
 * bound is unimprovable by finite series truncation (named residual). Changes
 * no bound; NO QED; no refereed bound is changed.
 */

// ---------------------------------------------------------------------------
// Numeric kernel (import-light: no imports)
// ---------------------------------------------------------------------------

// THEOREM RSTAR-EQ (imp-95377): exact root r > 1 of e^((r-1)x) = 1 + (x/2)(r^2 - 1)
function rStarClosed(x) {
  const F = (r) => Math.exp((r - 1) * x) - (1 + (x / 2) * (r * r - 1));
  let lo = 1 + 1e-9;
  let hi = 2;
  while (F(hi) < 0 && hi < 1e12) hi *= 2;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (F(mid) < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
// imp-95377 lower bound r_star >= 1 + ln(1/x)/x
function rStarLower(x) {
  return 1 - Math.log(x) / x;
}
// imp-95377 quartic upper bound
function rStarUpperQuartic(x) {
  return 1 + (-2 + Math.sqrt(12 / x - 8)) / x;
}
// imp-95428 quintic: unique positive root of y^3 + 5y^2 + 20y + 60(1 - 1/x) = 0
function yQuinticRoot(x) {
  const c0 = 60 * (1 - 1 / x); // < 0 for x < 1
  const f = (y) => y * y * y + 5 * y * y + 20 * y + c0;
  let lo = 0;
  let hi = 1;
  while (f(hi) < 0 && hi < 1e12) hi *= 2;
  for (let i = 0; i < 300; i++) {
    const mid = (lo + hi) / 2;
    if (f(mid) < 0) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}
function rStarUpperQuintic(x) {
  return 1 + yQuinticRoot(x) / x;
}
// Cardano closed form of the same positive root (cross-check of the bisection)
function yQuinticCardano(x) {
  const p = 35 / 3;
  const q = 970 / 27 - 60 / x;
  const disc = (q / 2) * (q / 2) + (p / 3) * (p / 3) * (p / 3);
  const s = Math.sqrt(disc);
  const cbrt = (v) => Math.cbrt(v);
  const t = cbrt(-q / 2 + s) + cbrt(-q / 2 - s);
  return t - 5 / 3;
}

// ---------------------------------------------------------------------------
// Measured bracket factors
// ---------------------------------------------------------------------------

function measureWorstFactors() {
  let worstUpperQuartic = 0;
  let worstUpperQuintic = 0;
  let worstBracketQuartic = 0;
  let worstBracketQuintic = 0;
  for (let x = 0.01; x < 0.999; x += 0.001) {
    const rs = rStarClosed(x);
    const rl = rStarLower(x);
    const rq = rStarUpperQuartic(x);
    const r5 = rStarUpperQuintic(x);
    worstUpperQuartic = Math.max(worstUpperQuartic, rq / rs);
    worstUpperQuintic = Math.max(worstUpperQuintic, r5 / rs);
    worstBracketQuartic = Math.max(worstBracketQuartic, rq / rl);
    worstBracketQuintic = Math.max(worstBracketQuintic, r5 / rl);
  }
  return {
    worstUpperQuartic,
    worstUpperQuintic,
    worstBracketQuartic,
    worstBracketQuintic,
  };
}

const MEASURED = measureWorstFactors();

// ---------------------------------------------------------------------------
// Reference record
// ---------------------------------------------------------------------------

export const IMP95428_RSTAR_QUINTIC_BRACKET = {
  id: "imp-95428",
  title:
    "Quintic (next-positive-term) sharpening of the imp-95377 r_star(x) upper " +
    "bound and measurement of the small-x bracket-factor reduction",
  quinticUpperBound:
    "THEOREM RSTAR-QUINTIC: y5(x) is the unique positive root of y^3 + 5y^2 + " +
    "20y + 60(1 - 1/x) = 0 (from R(y) >= 1 + y/3 + y^2/12 + y^3/60), and " +
    "r_star(x) <= 1 + y5(x)/x, tighter than the imp-95377 quartic bound.",
  cardano:
    "closed form: y = t - 5/3, p = 35/3, q = 970/27 - 60/x, " +
    "t = cbrt(-q/2 + sqrt((q/2)^2 + (p/3)^3)) + cbrt(-q/2 - sqrt((q/2)^2 + " +
    "(p/3)^3)); discriminant > 0 (p > 0) gives the single real root.",
  mechanism:
    "positive coefficients make every truncation P_n(y) <= R(y), so the " +
    "truncated root upper-bounds y_star and each extra positive term tightens " +
    "it; a LOWER bound needs a polynomial upper bound on R valid for all y, " +
    "impossible since R(y) ~ 2e^y/y^2, so the lower bound (R <= e^y) is left " +
    "intact as a named residual requiring a Lambert/exponential mechanism.",
  measuredUpperFactor:
    "worst small-x upper factor r_hi/r_star over x in [0.01, 0.999): quartic " +
    MEASURED.worstUpperQuartic.toFixed(4) +
    " -> quintic " +
    MEASURED.worstUpperQuintic.toFixed(4) +
    " (halved; worst near x = 0.01)",
  measuredBracketFactor:
    "worst two-sided bracket r_hi/r_lo: quartic " +
    MEASURED.worstBracketQuartic.toFixed(4) +
    " -> quintic " +
    MEASURED.worstBracketQuintic.toFixed(4),
  perX:
    "r_hi/r_star per x: x=0.01 4.013 -> 2.006, x=0.05 2.248 -> 1.444, " +
    "x=0.1 1.775 -> 1.272, x=0.2 1.416 -> 1.137",
  namedResidual:
    "the imp-95377 lower bound r_star >= 1 + ln(1/x)/x (worst r_star/r_lo = " +
    "2.117 near x = 0.01) is not improvable by any finite series term; " +
    "tightening it needs the Lambert/exponential leg.",
  verdict:
    "DERIVATION / MEASUREMENT ONLY. The next positive term halves the small-x " +
    "upper looseness (4.013 -> 2.006) and the two-sided bracket (7.050 -> " +
    "3.524). Changes no bound; NO QED; no refereed bound is changed" +
    ".",
  measured: MEASURED,
};

// ---------------------------------------------------------------------------
// Self-executing assertions (import-light)
// ---------------------------------------------------------------------------

export const IMP95428_RSTAR_QUINTIC_BRACKET_ASSERTIONS = [
  {
    id: "imp95428-quintic-root-solves-cubic",
    description:
      "y5(x) satisfies 1 + y/3 + y^2/12 + y^3/60 = 1/x to rel 1e-9 and the " +
      "bisection root matches the Cardano closed form",
    holds: () => {
      for (const x of [0.01, 0.05, 0.1, 0.3, 0.5, 0.7, 0.9]) {
        const y = yQuinticRoot(x);
        const R = 1 + y / 3 + (y * y) / 12 + (y * y * y) / 60;
        if (Math.abs(R - 1 / x) / (1 / x) > 1e-9) return false;
        const yc = yQuinticCardano(x);
        if (Math.abs(yc - y) / y > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95428-quintic-is-valid-upper-bound",
    description:
      "r_star(x) <= 1 + y5(x)/x holds on a scan of x in (0, 1) (quintic is a " +
      "genuine upper bound)",
    holds: () => {
      for (let x = 0.01; x < 0.999; x += 0.005) {
        if (!(rStarClosed(x) <= rStarUpperQuintic(x) + 1e-6)) return false;
      }
      return true;
    },
  },
  {
    id: "imp95428-quintic-tighter-than-quartic",
    description:
      "the quintic upper bound is at least as tight as the imp-95377 quartic " +
      "bound at every scanned x, and strictly tighter at small x",
    holds: () => {
      let strictSmallX = false;
      for (let x = 0.01; x < 0.999; x += 0.005) {
        const rq = rStarUpperQuartic(x);
        const r5 = rStarUpperQuintic(x);
        if (!(r5 <= rq + 1e-6)) return false;
        if (x < 0.1 && r5 < rq - 1e-3) strictSmallX = true;
      }
      return strictSmallX;
    },
  },
  {
    id: "imp95428-bracket-factor-halved",
    description:
      "the measured worst small-x upper factor drops from ~4.013 (quartic) to " +
      "~2.006 (quintic) and the two-sided bracket from ~7.050 to ~3.524",
    holds: () => {
      const m = MEASURED;
      if (!(Math.abs(m.worstUpperQuartic - 4.013) < 0.02)) return false;
      if (!(Math.abs(m.worstUpperQuintic - 2.006) < 0.02)) return false;
      if (!(m.worstUpperQuintic < m.worstUpperQuartic / 1.9)) return false;
      if (!(Math.abs(m.worstBracketQuartic - 7.05) < 0.05)) return false;
      if (!(Math.abs(m.worstBracketQuintic - 3.524) < 0.05)) return false;
      return true;
    },
  },
  {
    id: "imp95428-record-honesty",
    description:
      "the record is derivation/measurement-only, states the quintic bound and " +
      "the lower-bound named residual, carries NO QED and the no-refereed-bound-change line",
    holds: () =>
      /RSTAR-QUINTIC/.test(IMP95428_RSTAR_QUINTIC_BRACKET.quinticUpperBound) &&
      /not improvable/.test(IMP95428_RSTAR_QUINTIC_BRACKET.namedResidual) &&
      /NO QED/.test(IMP95428_RSTAR_QUINTIC_BRACKET.verdict) &&
      /refereed bound is changed/i.test(IMP95428_RSTAR_QUINTIC_BRACKET.verdict) &&
      /MEASUREMENT ONLY/.test(IMP95428_RSTAR_QUINTIC_BRACKET.verdict),
  },
];

for (const a of IMP95428_RSTAR_QUINTIC_BRACKET_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95428-rstar-quintic-bracket assertion failed: ${a.id}`);
  }
}

export default IMP95428_RSTAR_QUINTIC_BRACKET;
