/**
 * imp-95661 -- independent verification of the imp-95647 / imp-95621 summation
 * condition number law kappa(delta) ~ (1/2) exp(pi^2/delta) that predicts the
 * alternating off-lattice Riesz-floor form
 *   A_opt(delta) = 1 + 2 sum_(n>=1) (-1)^n sech(n delta/2)
 * losing precision at IEEE double precision vs the theta-dual positive-term form
 *   A_opt(delta) = (4 pi/delta) sum_(n>=0) sech(pi^2 (2n+1)/delta).
 *
 * This module recomputes the condition number, the measured relative error, the
 * TRAP/CLEAN verdicts, and the delta* ~ 0.307 crossover from a STANDALONE kernel
 * (it imports NOTHING -- import-light, no 16.7MB zeros bundle) and cross-checks
 * them against the analytic law.
 *
 * VERIFIED (this run):
 *   - delta = ln(1.3) = 0.26236 is a TRAP: measured alt-form relErr = 7.30e-2.
 *   - delta = ln(2)   = 0.69315 is CLEAN: measured alt-form relErr = 3.16e-12.
 *   - the exp(pi^2/delta) SCALING of the condition number is confirmed exactly:
 *     the measured kappa(delta) = (sum|term|)/|A_opt| tracks C * exp(pi^2/delta)
 *     across delta in [0.15, 0.75] with a constant prefactor.
 *   - the delta* threshold (kappa*EPS = 1 percent) is confirmed at ~0.307.
 *
 * CORRECTION (honest finding): the stated analytic PREFACTOR (1/2) is a factor of
 * 2 too large. The measured condition number equals (1/4) exp(pi^2/delta), not
 * (1/2) exp(pi^2/delta): the ratio kappaMeasured / [(1/2)exp(pi^2/delta)] = 0.5000
 * to 4 significant figures at every sampled delta. Root cause -- the imp-95621
 * derivation wrote |A_opt| ~ (4 pi/delta) exp(-pi^2/delta), but the leading
 * theta-dual term is sech(pi^2/delta) ~ 2 exp(-pi^2/delta), so the true leading
 * magnitude is (8 pi/delta) exp(-pi^2/delta) and, with sum|term| ~ 2 pi/delta,
 *   kappa = (2 pi/delta) / [(8 pi/delta) exp(-pi^2/delta)] = (1/4) exp(pi^2/delta).
 * The delta* location and the TRAP/CLEAN verdicts are ROBUST to this factor: it
 * shifts delta* only logarithmically (by ln 2 in the denominator), which is
 * precisely the ~2 percent analytic-vs-numeric gap imp-95621 already recorded
 * (analytic 0.30716 with the 1/2 prefactor vs bisection 0.30068 on measured kappa).
 *
 * GRADE: numerical verification only. Imports no bundle. Changes NO bound and
 * asserts NO new theorem; no refereed bound is changed. NO QED.
 *
 * @see imp-95647-condition-number-viz-data (the re-plot verified here)
 * @see imp-95621-alt-form-precision-threshold (source derivation)
 */

const sech = (x) => 1 / Math.cosh(x);
const EPS = Number.EPSILON;
const PI = Math.PI;

// Stable reference: theta-dual positive-term Poisson form.
function aOptTheta(delta) {
  let s = 0;
  for (let n = 0; n < 8000; n++) {
    const term = sech((PI * PI * (2 * n + 1)) / delta);
    s += term;
    if (n > 4 && term < 1e-45 * (s || 1)) break;
  }
  return ((4 * PI) / delta) * s;
}

// Cancellation-limited alternating form (the trapped evaluator).
function aOptAlt(delta) {
  let s = 1;
  for (let n = 1; n < 400000; n++) {
    const term = 2 * (n % 2 ? -1 : 1) * sech((n * delta) / 2);
    s += term;
    if (n > 10 && Math.abs(term) < 1e-30) break;
  }
  return s;
}

// Sum of absolute term magnitudes -- numerator of the condition number.
function aOptAbsSum(delta) {
  let s = 1;
  for (let n = 1; n < 400000; n++) {
    const term = 2 * sech((n * delta) / 2);
    s += term;
    if (n > 10 && term < 1e-30) break;
  }
  return s;
}

const kappaMeasured = (delta) => aOptAbsSum(delta) / aOptTheta(delta);
const kappaStated = (delta) => 0.5 * Math.exp((PI * PI) / delta); // imp-95621 (1/2) prefactor
const kappaCorrected = (delta) => 0.25 * Math.exp((PI * PI) / delta); // verified (1/4) prefactor
const measuredRelErr = (delta) =>
  Math.abs(aOptAlt(delta) - aOptTheta(delta)) / Math.abs(aOptTheta(delta));

const GRID = [0.15, 0.2, 0.25, 0.3, 0.35, 0.45, 0.6, 0.75];
const LN13 = Math.log(1.3);
const LN2 = Math.log(2);

// Independent bisection of the measured condition number: kappa*EPS = 1 percent.
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

const deltaStarAnalytic = (PI * PI) / Math.log(0.02 / EPS);
const deltaStarNum = deltaStarNumeric();

// Max relative deviation of measured kappa from the CORRECTED (1/4) law over the grid.
const maxCorrectedDev = Math.max(
  ...GRID.map((d) => Math.abs(kappaMeasured(d) / kappaCorrected(d) - 1))
);
// Constant ratio of measured kappa to the STATED (1/2) law (should be ~0.5 everywhere).
const statedRatios = GRID.map((d) => kappaMeasured(d) / kappaStated(d));
const maxStatedRatioSpread =
  Math.max(...statedRatios) - Math.min(...statedRatios);

export const IMP95661_CONDITION_NUMBER_LAW_VERIFICATION = {
  id: "imp-95661",
  title:
    "Independent verification of the imp-95647/imp-95621 condition number law " +
    "kappa(delta) ~ (1/2) exp(pi^2/delta) and the ln(1.3)=TRAP / ln(2)=CLEAN verdicts",
  method:
    "Standalone (import-light) recomputation of kappa(delta) = (sum|term|)/|A_opt| " +
    "and the measured alternating-form relative error across delta in [0.15, 0.75], " +
    "compared to the analytic exp(pi^2/delta) scaling; delta* by bisection.",
  results: {
    eps: EPS,
    // exp(pi^2/delta) SCALING confirmed; PREFACTOR corrected 1/2 -> 1/4.
    maxRelDevFromCorrectedLaw: maxCorrectedDev,
    measuredOverStatedRatio: statedRatios[0], // ~0.5000 (stated prefactor is 2x too large)
    measuredOverStatedRatioSpread: maxStatedRatioSpread, // ~0 (constant across the grid)
    // TRAP/CLEAN verdicts
    ln13: LN13,
    ln2: LN2,
    relErrLn13: measuredRelErr(LN13),
    relErrLn2: measuredRelErr(LN2),
    // delta* crossover
    deltaStarAnalytic,
    deltaStarNumeric: deltaStarNum,
    ratioStarAnalytic: Math.exp(deltaStarAnalytic),
    ratioStarNumeric: Math.exp(deltaStarNum),
  },
  verdict:
    "CONFIRMED: the exp(pi^2/delta) scaling of the summation condition number, the " +
    "delta* ~ 0.307 one-percent crossover, and the ln(1.3)=TRAP (7.30e-2) / " +
    "ln(2)=CLEAN (3.16e-12) verdicts all reproduce independently. CORRECTED: the " +
    "measured condition number is (1/4) exp(pi^2/delta), not (1/2) -- the imp-95621 " +
    "derivation dropped the sech(pi^2/delta) ~ 2 exp(-pi^2/delta) factor of 2 in " +
    "|A_opt|; the measured/stated ratio is 0.5000 flat across the grid. The factor " +
    "shifts delta* only by ln 2 in the log denominator (the ~2 percent analytic-vs- " +
    "numeric gap imp-95621 already bracketed), so the mandate boundary is unchanged.",
  boundChange: false,
  qed: false,
  closesTickets: ["imp-95661"],
};

// -- assertions (import-light; qualitative + tight numeric, reproducible) -----
export const IMP95661_ASSERTIONS = [
  {
    id: "imp-95661-exp-scaling-confirmed",
    holds: () => maxCorrectedDev < 1e-3,
    why: "measured kappa(delta) must track (1/4)exp(pi^2/delta) to < 0.1 percent across the grid (exp(pi^2/delta) scaling verified).",
  },
  {
    id: "imp-95661-stated-prefactor-is-2x-too-large",
    holds: () => {
      const r = IMP95661_CONDITION_NUMBER_LAW_VERIFICATION.results;
      return Math.abs(r.measuredOverStatedRatio - 0.5) < 1e-3 && r.measuredOverStatedRatioSpread < 1e-3;
    },
    why: "measured kappa / [(1/2)exp(pi^2/delta)] must be a flat 0.5000 across the grid -- the stated prefactor is exactly a factor of 2 too large (corrected to 1/4).",
  },
  {
    id: "imp-95661-ln13-trap-confirmed",
    holds: () => {
      const r = IMP95661_CONDITION_NUMBER_LAW_VERIFICATION.results;
      return r.ln13 < r.deltaStarAnalytic && r.relErrLn13 > 0.01;
    },
    why: "delta = ln 1.3 must sit below delta* AND show > 1 percent alternating-form error (TRAP verdict).",
  },
  {
    id: "imp-95661-ln2-clean-confirmed",
    holds: () => {
      const r = IMP95661_CONDITION_NUMBER_LAW_VERIFICATION.results;
      return r.ln2 > r.deltaStarAnalytic && r.relErrLn2 < 1e-9;
    },
    why: "delta = ln 2 must sit above delta* AND agree with the theta-dual form to < 1e-9 rel (CLEAN verdict).",
  },
  {
    id: "imp-95661-delta-star-near-0307",
    holds: () => {
      const r = IMP95661_CONDITION_NUMBER_LAW_VERIFICATION.results;
      return (
        Math.abs(r.deltaStarAnalytic - 0.30716) < 5e-4 &&
        Math.abs(r.deltaStarNumeric - 0.30068) < 5e-3 &&
        Math.abs(r.deltaStarAnalytic - r.deltaStarNumeric) / r.deltaStarNumeric < 0.05
      );
    },
    why: "analytic delta* ~ 0.30716 and the independent bisection on measured kappa ~ 0.30068 must both land near 0.307 and agree to < 5 percent (the residual = the corrected factor of 2 = ln 2 log-shift).",
  },
  {
    id: "imp-95661-not-a-bound",
    holds: () =>
      IMP95661_CONDITION_NUMBER_LAW_VERIFICATION.boundChange === false &&
      IMP95661_CONDITION_NUMBER_LAW_VERIFICATION.qed === false,
    why: "this is a numerical verification; it moves no Lambda bound and proves no QED.",
  },
];

for (const a of IMP95661_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95661-condition-number-law-verification assertion failed: ${a.id}`);
  }
}

export default IMP95661_CONDITION_NUMBER_LAW_VERIFICATION;
