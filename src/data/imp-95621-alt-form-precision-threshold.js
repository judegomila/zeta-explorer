/**
 * imp-95621 -- locate the delta threshold delta* below which the alternating
 * class-optimal off-lattice Riesz floor form
 *   A_opt(delta) = sum_(n in Z) (-1)^n sech(n delta/2)
 *               = 1 + 2 sum_(n>=1) (-1)^n sech(n delta/2)
 * loses more than 1 percent relative precision at IEEE double precision,
 * hardening the imp-95419 / imp-95601 FLOAT TRAP that mandates the
 * theta-dual positive-term Poisson form
 *   A_opt(delta) = (4 pi/delta) sum_(n>=0) sech(pi^2 (2n+1)/delta)
 * for small delta.
 *
 * GRADE: numerical only. Imports no heavy bundle. Changes NO bound and
 * asserts NO new theorem; no refereed bound is changed. NO QED.
 *
 * DERIVATION (term-size vs sum-size ratio = summation condition number):
 *   The true value is exponentially small, A_opt ~ (4 pi/delta) exp(-pi^2/delta),
 *   while the alternating series sums O(1) terms whose absolute magnitudes total
 *     sum |term| = 1 + 2 sum_(n>=1) sech(n delta/2) ~ 1 + 2 pi/delta.
 *   The summation condition number is therefore
 *     kappa(delta) = (sum |term|) / |A_opt| ~ (1/2) exp(pi^2/delta),
 *   and the alternating form carries relative error ~ kappa(delta) * EPS.
 *   Setting kappa * EPS = 1 percent gives the leading-order threshold
 *     delta* = pi^2 / ln(0.02 / EPS) ~ 0.30716   (ratio r = exp(delta*) ~ 1.3596).
 *   A direct condition-number bisection using the measured abs-sum and the
 *   stable theta-dual value lands at delta* ~ 0.30068 (ratio ~ 1.3508),
 *   bracketing the leading-order estimate to ~2 percent.
 *
 * BOUNDARY CHECK (explains the two imp-95601 sampled points):
 *   delta = ln 1.3 = 0.26236 < delta*  -> alternating rel error ~ 7.3e-2  (TRAP)
 *   delta = ln 2   = 0.69315 > delta*  -> alternating rel error ~ 3.2e-12 (CLEAN)
 *   The mandate "use the theta-dual form for delta below delta* ~ 0.307
 *   (ratio r below ~1.36)" now has a quantified boundary rather than two
 *   sampled points.
 */

const sech = (x) => 1 / Math.cosh(x);
const EPS = Number.EPSILON; // 2.220446049250313e-16

// Stable reference: theta-dual positive-term Poisson form.
function aOptTheta(delta) {
  let s = 0;
  for (let n = 0; n < 5000; n++) {
    const term = sech((Math.PI * Math.PI * (2 * n + 1)) / delta);
    s += term;
    if (n > 4 && term < 1e-40 * (s || 1)) break;
  }
  return ((4 * Math.PI) / delta) * s;
}

// Cancellation-limited alternating form (the trapped evaluator).
function aOptAlt(delta) {
  let s = 1;
  for (let n = 1; n < 200000; n++) {
    const term = 2 * (n % 2 ? -1 : 1) * sech((n * delta) / 2);
    s += term;
    if (n > 10 && Math.abs(term) < 1e-25) break;
  }
  return s;
}

// Sum of absolute term magnitudes -- numerator of the condition number.
function aOptAbsSum(delta) {
  let s = 1;
  for (let n = 1; n < 200000; n++) {
    const term = 2 * sech((n * delta) / 2);
    s += term;
    if (n > 10 && term < 1e-25) break;
  }
  return s;
}

// Measured relative error of the alternating form vs the stable reference.
function altRelErr(delta) {
  const t = aOptTheta(delta);
  return Math.abs(aOptAlt(delta) - t) / Math.abs(t);
}

// Condition-number predictor kappa(delta) * EPS (monotone decreasing in delta).
function predErr(delta) {
  return (aOptAbsSum(delta) / aOptTheta(delta)) * EPS;
}

// Analytic leading-order threshold.
const deltaStarAnalytic = (Math.PI * Math.PI) / Math.log(0.02 / EPS);

// Condition-number bisection of predErr = 1 percent.
function deltaStarNumeric() {
  let lo = 0.1;
  let hi = 0.6;
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (predErr(mid) > 0.01) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}

const LN2 = Math.log(2);
const LN13 = Math.log(1.3);
const deltaStarNum = deltaStarNumeric();

export const IMP95621_ALT_FORM_PRECISION_THRESHOLD = {
  id: "imp-95621",
  title:
    "Delta threshold below which the alternating A_opt(delta) form loses " +
    ">1 percent precision at double precision (theta-dual mandate boundary)",
  method:
    "Summation condition number kappa(delta) = (sum of |terms|)/|A_opt| ~ " +
    "(1/2) exp(pi^2/delta); alternating rel error ~ kappa * EPS; solve " +
    "kappa * EPS = 1 percent for delta*.",
  results: {
    eps: EPS,
    // delta* = pi^2 / ln(0.02/EPS)
    deltaStarAnalytic,
    ratioStarAnalytic: Math.exp(deltaStarAnalytic),
    // condition-number bisection of kappa*EPS = 1 percent
    deltaStarNumeric: deltaStarNum,
    ratioStarNumeric: Math.exp(deltaStarNum),
    // boundary check at the two imp-95601 sampled deltas
    ln13: LN13,
    ln2: LN2,
    altRelErrLn13: altRelErr(LN13),
    altRelErrLn2: altRelErr(LN2),
  },
  verdict:
    "The alternating A_opt(delta) form crosses 1 percent relative error at " +
    "delta* ~ 0.307 (ratio r ~ 1.36): below it the O(1) alternating terms " +
    "cancel down to the exponentially small (4 pi/delta) exp(-pi^2/delta) " +
    "faster than EPS allows, above it the form is safe. delta = ln 1.3 " +
    "(0.2624) sits below delta* (7.3 percent error, TRAP); delta = ln 2 " +
    "(0.6931) sits above it (3.2e-12 error, CLEAN). Mandate: use the " +
    "theta-dual positive-term form for delta below delta*.",
  boundChange: false,
  qed: false,
  closesTickets: ["imp-95621"],
};

// -- assertions (import-light; qualitative thresholds, reproducible) --------
export const IMP95621_ASSERTIONS = [
  {
    id: "imp-95621-analytic-threshold-value",
    holds: () => {
      const d = IMP95621_ALT_FORM_PRECISION_THRESHOLD.results.deltaStarAnalytic;
      return Math.abs(d - 0.30716) < 5e-4;
    },
    why: "delta* = pi^2/ln(0.02/EPS) must land near 0.30716 at IEEE double precision.",
  },
  {
    id: "imp-95621-analytic-numeric-bracket-agree",
    holds: () => {
      const a = IMP95621_ALT_FORM_PRECISION_THRESHOLD.results.deltaStarAnalytic;
      const n = IMP95621_ALT_FORM_PRECISION_THRESHOLD.results.deltaStarNumeric;
      return Math.abs(a - n) / n < 0.05;
    },
    why: "the leading-order analytic delta* and the direct condition-number bisection must agree to < 5 percent.",
  },
  {
    id: "imp-95621-ln13-below-threshold-is-trapped",
    holds: () => {
      const r = IMP95621_ALT_FORM_PRECISION_THRESHOLD.results;
      return r.ln13 < r.deltaStarAnalytic && r.altRelErrLn13 > 0.01;
    },
    why: "delta = ln 1.3 must sit below delta* AND exhibit > 1 percent alternating-form error (the imp-95419 FLOAT TRAP).",
  },
  {
    id: "imp-95621-ln2-above-threshold-is-clean",
    holds: () => {
      const r = IMP95621_ALT_FORM_PRECISION_THRESHOLD.results;
      return r.ln2 > r.deltaStarAnalytic && r.altRelErrLn2 < 1e-9;
    },
    why: "delta = ln 2 must sit above delta* AND agree with the theta-dual form to < 1e-9 rel (no cancellation).",
  },
  {
    id: "imp-95621-not-a-bound",
    holds: () =>
      IMP95621_ALT_FORM_PRECISION_THRESHOLD.boundChange === false &&
      IMP95621_ALT_FORM_PRECISION_THRESHOLD.qed === false,
    why: "this is a numerical precision-threshold audit; it moves no Lambda bound and proves no QED.",
  },
];

for (const a of IMP95621_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95621-alt-form-precision-threshold assertion failed: ${a.id}`);
  }
}

export default IMP95621_ALT_FORM_PRECISION_THRESHOLD;
