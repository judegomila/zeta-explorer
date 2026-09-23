/**
 * imp-95673 -- propagate the imp-95661 factor (1/2)->(1/4) prefactor correction
 * into the imp-95621 analytic delta* prediction and reconcile it against the
 * direct condition-number bisection value 0.30068.
 *
 * BACKGROUND. imp-95621 located the double-precision crossover delta* below which
 * the alternating off-lattice Riesz-floor form
 *   A_opt(delta) = 1 + 2 sum_(n>=1) (-1)^n sech(n delta/2)
 * loses more than 1 percent relative precision, by solving
 *   kappa(delta) * EPS = 0.01,   kappa(delta) = (sum|term|)/|A_opt| ~ c exp(pi^2/delta).
 * imp-95621 used the prefactor c = 1/2 and reported the ANALYTIC leading-order
 *   delta*_analytic = pi^2 / ln(0.02/EPS) = 0.30716,
 * while a direct bisection on the MEASURED condition number landed at 0.30068 --
 * a ~2 percent analytic-vs-numeric gap it could only bracket.
 *
 * CORRECTION (imp-95661). The measured condition number is (1/4) exp(pi^2/delta),
 * not (1/2): the leading theta-dual term is sech(pi^2/delta) ~ 2 exp(-pi^2/delta),
 * so |A_opt| ~ (8 pi/delta) exp(-pi^2/delta) and kappa = (2 pi/delta)/|A_opt|
 * = (1/4) exp(pi^2/delta). imp-95661 measured kappa/[(1/2)exp(pi^2/delta)] = 0.5000
 * flat across delta in [0.15, 0.75].
 *
 * THIS MODULE (derivation/measurement only, import-light, NO bound, NO QED).
 * Recompute the analytic threshold with the corrected c = 1/4:
 *   delta*_quarter = pi^2 / ln(0.01/((1/4) EPS)) = pi^2 / ln(0.04/EPS).
 * Changing c from 1/2 to 1/4 adds exactly ln 2 to the log denominator
 *   pi^2/delta* = ln(0.01/(c EPS)) = ln(0.04/EPS) = ln(0.02/EPS) + ln 2,
 * which is the promised "ln 2 shift in the denominator".
 *
 * RESULT. delta*_quarter = 0.3006754389 reproduces the independent bisection value
 * 0.3006754389 to machine precision (relative gap ~1.8e-16). The ln 2 shift
 * therefore FULLY accounts for the previously-recorded ~2 percent analytic-vs-
 * numeric gap: the residual after correction is at the floating-point floor, not
 * a modelling discrepancy. The old 0.30716 was a factor-of-2 artefact in c.
 *
 * @see imp-95621-alt-form-precision-threshold (source derivation, 1/2 prefactor)
 * @see imp-95661-condition-number-law-verification (the 1/2 -> 1/4 correction)
 */

const EPS = Number.EPSILON; // 2.220446049250313e-16
const PI = Math.PI;
const sech = (x) => 1 / Math.cosh(x);

// Analytic leading-order threshold: kappa*EPS = 0.01 with kappa = c exp(pi^2/delta).
//   c exp(pi^2/delta*) EPS = 0.01  =>  delta* = pi^2 / ln(0.01/(c EPS)).
const deltaStarAnalytic = (c) => (PI * PI) / Math.log(0.01 / (c * EPS));
const deltaStarHalf = deltaStarAnalytic(0.5); // imp-95621 (1/2): 0.30716
const deltaStarQuarter = deltaStarAnalytic(0.25); // corrected (1/4): 0.30068

// Independent bisection on the MEASURED condition number (standalone kernel).
function aOptTheta(delta) {
  let s = 0;
  for (let n = 0; n < 8000; n++) {
    const t = sech((PI * PI * (2 * n + 1)) / delta);
    s += t;
    if (n > 4 && t < 1e-45 * (s || 1)) break;
  }
  return ((4 * PI) / delta) * s;
}
function aOptAbsSum(delta) {
  let s = 1;
  for (let n = 1; n < 400000; n++) {
    const t = 2 * sech((n * delta) / 2);
    s += t;
    if (n > 10 && t < 1e-30) break;
  }
  return s;
}
const kappaMeasured = (delta) => aOptAbsSum(delta) / aOptTheta(delta);
function deltaStarNumeric() {
  let lo = 0.1;
  let hi = 0.6;
  for (let it = 0; it < 200; it++) {
    const mid = 0.5 * (lo + hi);
    if (kappaMeasured(mid) * EPS > 0.01) lo = mid;
    else hi = mid;
  }
  return 0.5 * (lo + hi);
}
const deltaStarNum = deltaStarNumeric();

// The correction adds exactly ln 2 to the log denominator (pi^2/delta*).
const denomShift = PI * PI / deltaStarQuarter - PI * PI / deltaStarHalf;
const LN2 = Math.log(2);

// Residual gaps to the bisection value 0.30068.
const relGapHalfToNum = Math.abs(deltaStarHalf - deltaStarNum) / deltaStarNum;
const relGapQuarterToNum =
  Math.abs(deltaStarQuarter - deltaStarNum) / deltaStarNum;

export const IMP95673_ANALYTIC_DELTA_STAR_QUARTER_RECONCILIATION = {
  id: "imp-95673",
  title:
    "Propagate the imp-95661 (1/2)->(1/4) prefactor correction into the imp-95621 " +
    "analytic delta*: corrected delta* = 0.30068 matches the bisection to machine " +
    "precision (the ln 2 shift fully closes the ~2 percent gap)",
  method:
    "Recompute delta* = pi^2/ln(0.01/(c EPS)) with the corrected c = 1/4; the " +
    "change adds exactly ln 2 to the log denominator; compare to a standalone " +
    "bisection on the measured condition number kappa*EPS = 1 percent.",
  results: {
    eps: EPS,
    // old (1/2)-prefactor analytic value
    deltaStarHalf, // 0.30716
    // corrected (1/4)-prefactor analytic value
    deltaStarQuarter, // 0.30068
    ratioStarQuarter: Math.exp(deltaStarQuarter), // ~1.35077
    // independent bisection on measured kappa
    deltaStarNumeric: deltaStarNum, // 0.30068
    // the correction adds exactly ln 2 to the log denominator
    denomShift, // == ln 2
    ln2: LN2,
    denomShiftMinusLn2: denomShift - LN2, // ~0 to machine precision
    // residual gaps to the bisection value
    relGapHalfToNum, // ~2.16e-2 (the recorded ~2 percent gap)
    relGapQuarterToNum, // ~1.8e-16 (closed to the floating-point floor)
  },
  verdict:
    "RECONCILED: swapping the imp-95661-corrected prefactor c = 1/4 into the " +
    "imp-95621 analytic threshold moves delta* from 0.30716 to 0.30068, which " +
    "reproduces the direct condition-number bisection 0.30068 to a relative gap " +
    "of ~1.8e-16 (machine precision). The correction adds exactly ln 2 to the " +
    "log denominator pi^2/delta*, so the ln 2 shift FULLY accounts for the " +
    "previously-recorded ~2 percent analytic-vs-numeric gap -- that gap was a " +
    "factor-of-2 artefact in the leading |A_opt| magnitude, not a modelling " +
    "discrepancy. The theta-dual mandate boundary (delta below delta* ~ 0.301, " +
    "ratio r below ~1.351) is unchanged; this refines only the analytic value.",
  boundChange: false,
  qed: false,
  closesTickets: ["imp-95673"],
};

// -- assertions (import-light; tight numeric, reproducible) -------------------
export const IMP95673_ASSERTIONS = [
  {
    id: "imp-95673-quarter-analytic-value",
    holds: () => Math.abs(deltaStarQuarter - 0.30068) < 5e-4,
    why: "the corrected (1/4)-prefactor analytic delta* = pi^2/ln(0.04/EPS) must land near 0.30068.",
  },
  {
    id: "imp-95673-quarter-matches-bisection",
    holds: () => relGapQuarterToNum < 1e-12,
    why: "the corrected analytic delta* must match the independent condition-number bisection to machine precision (the ln 2 shift fully closes the gap).",
  },
  {
    id: "imp-95673-denominator-shift-is-ln2",
    holds: () => Math.abs(denomShift - LN2) < 1e-12,
    why: "changing the prefactor 1/2 -> 1/4 must add exactly ln 2 to the log denominator pi^2/delta*.",
  },
  {
    id: "imp-95673-half-carried-the-two-percent-gap",
    holds: () => relGapHalfToNum > 0.02 && relGapHalfToNum < 0.03,
    why: "the old (1/2)-prefactor analytic delta* = 0.30716 must sit ~2 percent above the bisection (the gap the correction closes).",
  },
  {
    id: "imp-95673-not-a-bound",
    holds: () =>
      IMP95673_ANALYTIC_DELTA_STAR_QUARTER_RECONCILIATION.boundChange === false &&
      IMP95673_ANALYTIC_DELTA_STAR_QUARTER_RECONCILIATION.qed === false,
    why: "this is a numerical reconciliation; it moves no Lambda bound and proves no QED.",
  },
];

for (const a of IMP95673_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95673-analytic-delta-star-quarter-reconciliation assertion failed: ${a.id}`
    );
  }
}

export default IMP95673_ANALYTIC_DELTA_STAR_QUARTER_RECONCILIATION;
