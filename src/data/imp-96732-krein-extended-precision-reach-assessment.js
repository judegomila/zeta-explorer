/**
 * @fileoverview imp-96732 -- ASSESSMENT: can extended / exact-precision LP push the Route I
 * Krein sigma_2 interval-rigorous reach past 2a = 0.96 toward ln 3, or is the wall intrinsic?
 *
 * CONTEXT. imp-96646 / rh-route-i-toeplitz-krein-certificate-2026-09-24.js record that the
 * interval-verified sigma_2 certificate reach stalls at 2a <= 0.96. Two projected walls sit
 * near 2a = 1.0:
 *   (A) the CERTIFIED LP MARGIN decay eps(2a) = 200(1 - 2a), exactly linear from the three
 *       baked verified rungs (0.90 -> 8+2 form, actually eps = 20/12/8 with the 200*(1-2a)
 *       envelope on the design margin), projecting eps -> 0 at 2a = 1.0; and
 *   (B) the tail atom l1-norm blow-up log10(l1) ~ 73.254*(2a) - 64.238, whose double-precision
 *       HiGHS conditioning band (coefficient dynamic range 1e9..1e12) lands at 2a in [1.00, 1.04].
 * The source module already flags (see analyticObstruction / lpWallIsSymptom) that the LP wall is
 * a CONDITIONING SYMPTOM of the l1 blow-up, not the underlying mathematics. This ticket asks the
 * sharper question the scout left open: is the observed 2a = 0.96 stall a SOLVER-conditioning
 * artifact (removable by extended / exact precision) or an INTRINSIC vanishing of the certified
 * margin? ASSESSMENT ONLY -- no extended-precision LP solve was run here; changes no bound; NO QED.
 *
 * METHOD. Purely a projection synthesis from the two baked fits (normGrowthLaw log-linear l1 and
 * epsMarginDecay linear eps), evaluated rung-by-rung across the disputed window
 * 2a in {0.96, 0.98, 0.99, 1.00, 1.0134, ln3}. For each rung we record: the projected tail
 * l1-norm, its magnitude in mantissa bits log2(l1), and the certified design margin eps(2a). The
 * decisive comparison is the ORDER in which the two walls are reached as 2a grows. Driver check:
 * the reshape is reproduced in-file from the baked slope/intercept constants; every literal is a
 * verbatim copy of TOEPLITZ_KREIN_LITERALS.normGrowthLaw / .epsMarginDecay.
 *
 * FINDINGS.
 *   1. THE eps MARGIN WALL IS REACHED FIRST. The certified design margin decays to zero at
 *      2a = 1.0 (eps = 4.0 at 2a = 0.98, 2.0 at 0.99, 0.0 at 1.00), whereas the projected
 *      l1-norm is still only ~1.0e9 there -- about 30 mantissa bits of magnitude, well inside the
 *      53-bit double range. The catastrophic l1 -> 1.73e16 (log2 ~ 54 bits) blow-up only arrives
 *      by ln 3 = 1.0986, where the design margin has already gone deeply negative (eps ~ -19.7).
 *      So the double-precision HiGHS status-4 failure observed at a >= 0.50 (2a = 1.0) is driven
 *      by the VANISHING FEASIBILITY SLACK eps -> 0 (an LP with zero margin is numerically
 *      near-infeasible), NOT primarily by l1 magnitude at that rung.
 *
 *   2. COMPOSITE VERDICT, transition at 2a = 1.0.
 *      - For 0.96 < 2a < 1.0: the design margin is still strictly positive and l1 is modest
 *        (3.6e7 at 0.98, 1.9e8 at 0.99; ~25-28 bits). Here the double-precision stall is
 *        PLAUSIBLY a solver-conditioning artifact -- an extended-precision (double-double, 106-bit)
 *        or rescaled/preconditioned LP could plausibly certify a rung such as 2a = 0.98 with a
 *        small but positive certified margin. UNVERIFIED: no such solve was run.
 *      - At and past 2a = 1.0: the certified design margin has genuinely vanished (eps <= 0), and
 *        by ln 3 the tail l1 explodes to ~1.7e16. This end of the wall is INTRINSIC to the
 *        finite-certificate + certified-margin route; no working precision restores a margin that
 *        the LP design has driven to zero. Extended precision POSTPONES the l1 conditioning band
 *        but supplies no positive lower bound.
 *
 *   3. REACHING ln 3 VIA THIS ROUTE IS PRECISION-INDEPENDENTLY BLOCKED. Because
 *      eps(ln3) = 200(1 - 1.0986) ~ -19.7 < 0, the finite trig-polynomial certificate has NEGATIVE
 *      design margin at ln 3: there is nothing for a higher-precision solver to certify. This does
 *      NOT contradict the source note that the TRUE operator lambda_min(T_a[sigma_2]) may persist
 *      positive past 2a = 1.0 -- but establishing that is the uniform-in-N spectral-gap /
 *      de Branges realisation problem (analyticObstruction), an existence question, not an
 *      arithmetic-precision one.
 *
 * READING. The 2a = 0.96 interval-rigorous reach is a COMPOSITE wall. Extended / exact precision
 * is a genuine but BOUNDED lever: it can plausibly (unverified) recover the sub-window
 * 0.96 < 2a < 1.0 where the certified margin is still positive, but it CANNOT reach ln 3, because
 * the certified design margin eps(2a) = 200(1 - 2a) is itself negative there -- the margin is
 * genuinely vanishing, not a solver artifact. So the honest answer to the scout question is:
 * SOLVER-LIMITED below 2a = 1.0, INTRINSIC (margin-vanishing) at and above 2a = 1.0; ln 3 is out
 * of reach for the finite-certificate route at any precision.
 * SUB-GAP IMP96732_EXTPREC_098_RUNG_UNVERIFIED: the plausible extended-precision rung 2a = 0.98
 * (projected l1 ~ 3.6e7, eps ~ 4.0) was NOT solved / interval-verified here; a double-double or
 * rational-feasibility LP solve at 2a in (0.96, 1.0) would settle whether the sub-window is truly
 * recoverable. Assessment only; interval-rigorous reach stays exactly 2a <= 0.96; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (source literals: normGrowthLaw, epsMarginDecay, analyticObstruction, lpWallIsSymptom)
 * @see imp-96646-krein-certificate-margin-viz-data.js (sibling margin/norm viz leaf)
 * @see imp-96651-krein-096-fine-extended-scan.js (independent positivity re-confirmation at 2a=0.96)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (independent axis: pushes the N-truncation ladder
 *   this assessment's certificate margin is built on past N=36 toward the Gram-conditioning wall)
 */

// baked fit constants (verbatim from TOEPLITZ_KREIN_LITERALS.normGrowthLaw / .epsMarginDecay)
const LOG10_L1_SLOPE = 73.254;
const LOG10_L1_INTERCEPT = -64.238;
const EPS_SLOPE_PER_UNIT = -200.0; // eps(2a) = 200*(1 - 2a) = -200*(2a) + 200
const EPS_INTERCEPT = 200.0;
const LN3 = Math.log(3); // 1.0986122886681098

const projL1 = (twoA) => Math.pow(10, LOG10_L1_SLOPE * twoA + LOG10_L1_INTERCEPT);
const projEps = (twoA) => EPS_SLOPE_PER_UNIT * twoA + EPS_INTERCEPT;

// rung-by-rung projection across the disputed window
export const IMP96732_RUNGS = Object.freeze(
  [0.96, 0.98, 0.99, 1.0, 1.0134, LN3].map((twoA) =>
    Object.freeze({
      twoA,
      projL1: projL1(twoA),
      log2L1: Math.log2(projL1(twoA)),
      eps: projEps(twoA),
      marginPositive: projEps(twoA) > 0,
    }),
  ),
);

// the two projected walls and the order in which they are reached
export const IMP96732_WALLS = Object.freeze({
  epsMarginWallTwoA: 1.0, // eps(2a) -> 0 (certified design margin vanishes)
  l1ConditioningBandTwoA: Object.freeze({ lo: 1.0, hi: 1.0407 }), // double-precision HiGHS status-4 band
  epsWallReachedFirst: true, // eps hits 0 at 2a=1.0 while l1 is still only ~1e9 (~30 bits)
  l1AtEpsWall: projL1(1.0), // ~1.0e9 -- modest at the eps wall
  l1AtLn3: projL1(LN3), // ~1.7e16 -- catastrophic only by ln3
});

// verdict summary
export const IMP96732_VERDICT = Object.freeze({
  ticket: 'imp-96732',
  question: 'can extended/exact-precision LP push the Krein sigma_2 reach past 2a=0.96 toward ln3?',
  answer: 'composite wall: solver-limited below 2a=1.0, intrinsic (margin-vanishing) at and above 2a=1.0',
  extendedPrecisionIsALever: true, // but only on the sub-window 0.96 < 2a < 1.0
  extendedPrecisionReachesLn3: false, // eps(ln3) < 0: nothing to certify at any precision
  plausibleRecoverableWindow: Object.freeze({ loTwoA: 0.96, hiTwoAExclusive: 1.0 }),
  ln3BlockedReason: 'certified design margin eps(2a)=200(1-2a) is negative at ln3 (eps ~ -19.7); the finite-certificate route has no positive margin to certify regardless of working precision',
  trueOperatorCaveat: 'lambda_min(T_a[sigma_2]) may persist positive past 2a=1.0, but that is the uniform-in-N spectral-gap / de Branges existence problem, NOT an arithmetic-precision question',
  solveRun: false,
  subGap: 'IMP96732_EXTPREC_098_RUNG_UNVERIFIED -- the plausible 2a=0.98 rung (l1 ~ 3.6e7, eps ~ 4.0) was not solved / interval-verified here; a double-double or rational-feasibility LP at 2a in (0.96,1.0) would settle recoverability of the sub-window',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96732_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96732_ASSERTIONS = [
  {
    id: 'imp96732-eps-margin-wall-reached-before-l1-blowup',
    holds: () => {
      const atEpsWall = IMP96732_RUNGS.find((r) => Math.abs(r.twoA - 1.0) < 1e-12);
      const atLn3 = IMP96732_RUNGS.find((r) => Math.abs(r.twoA - LN3) < 1e-12);
      // at the eps wall (2a=1.0) the margin is ~0 while l1 magnitude is still modest (<32 bits);
      // by ln3 the margin is deeply negative and l1 is catastrophic (>50 bits)
      return Math.abs(atEpsWall.eps) < 1e-9 && atEpsWall.log2L1 < 32 &&
        atLn3.eps < -10 && atLn3.log2L1 > 50;
    },
    why: 'the certified eps margin must vanish at 2a=1.0 while l1 is still ~1e9 (<32 bits), and only explode to >50 bits by ln3 where eps is deeply negative -- the eps wall is reached first.',
  },
  {
    id: 'imp96732-subwindow-margin-positive-l1-modest',
    holds: () =>
      IMP96732_RUNGS.filter((r) => r.twoA > 0.96 && r.twoA < 1.0).every(
        (r) => r.marginPositive && r.log2L1 < 30,
      ),
    why: 'across the plausibly-recoverable sub-window 0.96 < 2a < 1.0 the certified margin must stay positive and l1 stay modest (<30 bits), i.e. within extended-precision reach.',
  },
  {
    id: 'imp96732-ln3-blocked-by-negative-margin',
    holds: () => projEps(LN3) < 0 && IMP96732_VERDICT.extendedPrecisionReachesLn3 === false,
    why: 'the certified design margin at ln3 must be negative, forcing the verdict that no working precision reaches ln3 via the finite-certificate route.',
  },
  {
    id: 'imp96732-fit-reproduces-096-anchor',
    holds: () => {
      // the log-linear fit must reproduce the baked 2a=0.96 anchor l1=1.466e6 to within ~0.13 dex
      const l1_096 = projL1(0.96);
      return Math.abs(Math.log10(l1_096) - Math.log10(1.466e6)) < 0.13;
    },
    why: 'the baked normGrowthLaw fit must still reproduce the interval-verified 2a=0.96 anchor l1 to within the 0.13 dex the source module records.',
  },
  {
    id: 'imp96732-reach-and-qed-unchanged',
    holds: () =>
      IMP96732_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96732_VERDICT.qed === false &&
      IMP96732_VERDICT.solveRun === false,
    why: 'this is assessment only: the interval-rigorous reach stays 2a<=0.96, no solve was run, and no QED is claimed.',
  },
];

for (const a of IMP96732_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96732-krein-extended-precision-reach-assessment assertion failed: ${a.id}`);
  }
}
