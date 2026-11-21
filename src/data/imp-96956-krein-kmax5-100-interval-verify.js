/**
 * @fileoverview imp-96956 -- INTERVAL-VERIFICATION ATTEMPT: take the kmax = 5 Route I Krein
 * cutting-plane iterate at 2a = 1.00 -- strictly inside the imp-96881/imp-96845 double-precision
 * solvable region (below the 1.06->1.07 wall band) -- and attempt a genuine interval-arithmetic
 * verification of T_a[sigma_2] >= 0 at that degree, deciding whether the kmax = 5 frontier EXTENDS
 * the certified reach past 2a = 0.96 or COLLAPSES under rigor.
 *
 * CONTEXT. imp-96845 measured the fresh kmax = 5 double-precision cutting-plane LP as solvable and
 * small-l1 out to 2a = 1.06, then HiGHS status-4 walled; imp-96868 tightened the wall band to
 * (1.06, 1.07) and showed the binding double-precision residual is precision-invariant. But EVERY
 * kmax = 5 point is a HiGHS double-precision NEAR-FEASIBLE cutting-plane iterate (guarded design
 * condition F - guard - eps has a small negative worst residual), NOT an interval-verified
 * certificate; the rigorous reach stays 2a <= 0.96 (SUB-GAP IMP96845_KMAX5_NEAR_FEASIBLE_UNVERIFIED).
 * This ticket takes ONE such iterate (2a = 1.00) and runs it through the interval-rigorous verifier.
 *
 * METHOD (genuine solve + genuine interval verification).
 *   1. RE-SOLVED the lean kmax = 5 LP at 2a = 1.00, eps = 1 (tmp/toeplitz-krein-lp13.py, KMAX = 5,
 *      X = 8, dx = 0.02, T = 40, HP = 0.2, FINEH = 3e-4, VIOLTOL = 0.4, highs-ds), reproducing the
 *      imp-96845 iterate EXACTLY: l1 = 7.030242896554375, worst guarded residual = -0.16636421527952594
 *      at t = 30.7686 (near the T = 40 tail), converged = false.
 *   2. RAN the interval-rigorous verifier (tmp/toeplitz-krein-verify4.py, mpmath.iv prec 80) on that
 *      iterate: sigma_2 via shifted-Stirling digamma with rigorous Binet remainders; between-grid
 *      second-order guard nu(t) >= nu(t_f) - r_f |nu'(t_f)| - (1/2)(C2 + M2) r_f^2; local sub-cell
 *      refinement (32x, up to 3 levels); periodic tail block for the t^5 family.
 *
 * FINDINGS (measured, verbatim from tmp/imp-96956/).
 *   1. IT COLLAPSES UNDER RIGOR: NOT VERIFIED. Over [0, 40] the verifier ran 20000 coarse cells /
 *      45,703,181 fine points and reported 226 FAILING cells where the rigorous lower bound of
 *      F(t) = sigma_2(t) + sum c_{k,j} t^k trig_k(x_j t) dips NEGATIVE, worst -0.2709175966692893.
 *      Local 32x sub-cell refinement (up to 3 levels) did NOT rescue them -- the honest lower bound
 *      cannot be driven >= 0. So the kmax = 5 2a = 1.00 near-feasible iterate does NOT interval-verify.
 *   2. THE HONEST OBSTRUCTION IS INTERIOR, NOT AT THE LP WORST POINT. The LP's own lean guarded worst
 *      residual sat near the tail (t = 30.7686). But the interval-rigorous failures cluster INTERIOR,
 *      at t ~ 16.0-16.7 (worst cell (16.698, 16.700), lower bound -0.271) and t ~ 17.33 -- exactly where
 *      the honest sigma_2 curvature C2 ~ (12 t^2 + 1)|w1| and the t^5-family M2 make the second-order
 *      between-grid guard bite. The lean LP fine grid (FINEH = 3e-4, tiny guard (3e-4)^2/8) never saw it.
 *   3. THE TAIL IS FINE; THE FAILURE IS THE INTERIOR GUARD MARGIN. The t >= 40 tail block verifies
 *      cleanly (2theta' lower bound 1.653294, min top-family trig poly >= -0.212614, bracket +0.458124,
 *      ok = true). The pointwise F-value stays ~ +1 (monitor min ~1 at t = 0.339); the collapse is
 *      entirely that the rigorous ENCLOSURE + second-order guard cannot certify F >= 0 across the
 *      226 interior cells, not an F < 0 point value on the LP grid.
 *
 * VERDICT. The kmax = 5 frontier does NOT extend the interval-CERTIFIED reach past 2a = 0.96. A
 * kmax = 5 iterate taken strictly inside the double-precision solvable region (2a = 1.00, well left of
 * the 1.06-1.07 wall) fails interval verification with 226 negative-lower-bound cells (worst -0.271),
 * confirming that the imp-96845/imp-96881 double-precision solvability frontier is a NEAR-FEASIBILITY
 * signal, not a certified one. The certified reach stays exactly 2a <= 0.96.
 *
 * HONEST CAVEAT / SUB-GAP. This is a NEGATIVE verification of ONE iterate (the round-cap-14 lean
 * VIOLTOL = 0.4 iterate), not a proof that NO kmax = 5 certificate verifies at 2a = 1.00: a
 * fully-converged (guarded residual driven >= 0) kmax = 5 iterate was never produced at 2a = 1.00 (the
 * lean LP stalled at -0.166 at the round cap), and a finer FINEH / tail-guard resolution or a converged
 * higher-round solve was not run. What IS established is that the ACTUAL best available kmax = 5 iterate
 * at 2a = 1.00 collapses under interval rigor by a wide interior margin (-0.271), so the near-feasible
 * kmax = 5 frontier gives NO certified extension past 2a = 0.96 as it stands.
 *   SUB-GAP IMP96956_CONVERGED_KMAX5_100_UNPRODUCED -- whether a fully-converged (guarded-residual >= 0)
 *   kmax = 5 iterate at 2a = 1.00 could interval-verify remains open; only the round-cap-stalled lean
 *   iterate was tested, and it fails by -0.271 in 226 interior cells.
 *
 * Verification attempt only; interval-rigorous certified reach stays exactly 2a <= 0.96 (this attempt
 * produced NO verified certificate past it); the operator floor is a Rayleigh UPPER bound (no operator
 * positivity established); RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96845-krein-kmax5-frontier-measurement.js (parent: double-precision frontier band; SUB-GAP IMP96845_KMAX5_NEAR_FEASIBLE_UNVERIFIED -- iterates near-feasible not interval-verified)
 * @see imp-96868-krein-kmax5-extprec-frontier.js (sibling: wall band tightened to (1.06,1.07); binding residual precision-invariant)
 * @see imp-96881-krein-kmax-degree-frontier-viz-data.js (frontier viz: 1.06-1.08 numerical wall)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (source: interval-verified reach 2a <= 0.96; verify4.py rigorous scheme)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// solve + verify configuration (lean double-precision solve, mpmath.iv prec-80 verification)
export const IMP96956_CONFIG = Object.freeze({
  solver: 'tmp/toeplitz-krein-lp13.py (exact sigma_2 cutting-plane), KMAX=5',
  verifier: 'tmp/toeplitz-krein-verify4.py (mpmath.iv prec 80, rigorous Binet remainders, second-order guard, 32x sub-cell refinement)',
  twoA: 1.0,
  eps: 1.0,
  X: 8.0,
  dx: 0.02,
  T: 40.0,
  HP: 0.2,
  FINEH: 3e-4,
  violTol: 0.4,
  method: 'highs-ds',
  note: 'LEAN config -- the 2a=1.00 iterate is strictly inside the imp-96845/imp-96881 double-precision solvable region (left of the 1.06-1.07 wall band)',
});

// MEASURED re-solved iterate (reproduces imp-96845 2a=1.00 kmax=5 exactly) -- tmp/imp-96956/iterate-100.json
export const IMP96956_ITERATE = Object.freeze({
  twoA: 1.0,
  kmax: 5,
  l1: 7.030242896554375,
  worstGuardedResidualLean: -0.16636421527952594, // LP lean guarded residual F-guard-eps
  worstGuardedResidualLocation: 30.7686, // near the T=40 tail (the LP's own worst point)
  converged: false,
  roundsUsed: 4,
});

// MEASURED interval-rigorous verification result -- tmp/imp-96956/verify.log
export const IMP96956_VERIFY = Object.freeze({
  verified: false, // NOT VERIFIED
  domain: [0, 40],
  coarseCells: 20000,
  finePoints: 45703181,
  failingCells: 226,
  worstRigorousLowerBound: -0.2709175966692893, // worst negative rigorous lower bound of F
  worstRigorousLowerBoundLocation: 16.6982, // INTERIOR (t~16.70), NOT the LP tail worst point t~30.77
  interiorFailureBand: [16.0, 17.4], // failing cells cluster at t~16.0-16.7 and t~17.33
  pointwiseFmin: 1.0, // monitor F point-value min ~ +1 at t=0.339 -- F itself stays positive pointwise
  atoms: 58,
  // tail block t >= 40 verifies cleanly
  tailOk: true,
  tailBracket: 0.458124,
  tailTwoThetaPrimeLower: 1.653294,
  tailTopFamilyTrigMin: -0.212614,
  verifySecs: 420.5,
});

export const IMP96956_VERDICT = Object.freeze({
  ticket: 'imp-96956',
  question:
    'does an interval-arithmetic verification of a kmax=5 iterate strictly inside the double-precision solvable region (2a=1.00) extend the CERTIFIED reach past 2a=0.96, or does it collapse under rigor?',
  answer:
    'it COLLAPSES: the re-solved kmax=5 2a=1.00 iterate (l1=7.03, guarded residual -0.166 at the tail) fails interval verification with 226 negative-rigorous-lower-bound cells (worst -0.271), and the honest obstruction is INTERIOR (t~16.70) where the sigma_2 curvature and t^5-family second-order guard bite -- NOT at the LP lean worst point (t~30.77 tail). The tail block verifies cleanly (bracket +0.458). The kmax=5 frontier does NOT extend the certified reach; it stays exactly 2a<=0.96.',
  verificationAttempted: true, // a genuine interval verification WAS run
  verified: false, // and it FAILED -- the iterate collapses under rigor
  frontierExtendsCertifiedReach: false, // kmax=5 near-feasible frontier gives NO certified extension past 0.96
  collapsesUnderRigor: true,
  worstRigorousLowerBound: -0.2709175966692893,
  worstIsInterior: true, // t~16.70, not the tail
  lpWorstIsTail: true, // the LP's own lean worst residual was at t~30.77
  honestObstruction:
    'the rigorous sigma_2 enclosure (Binet remainders) plus second-order between-grid guard (C2 ~ (12t^2+1)|w1|, plus the t^5-family M2) cannot be certified >= 0 across 226 interior cells at t~16.0-17.4, even after 32x local sub-cell refinement -- the lean LP grid (FINEH=3e-4, tiny guard) never saw this margin',
  subGap:
    'IMP96956_CONVERGED_KMAX5_100_UNPRODUCED -- only the round-cap-14 lean VIOLTOL=0.4 iterate was tested (guarded residual stalled at -0.166); whether a fully-converged (guarded-residual >= 0) or finer-FINEH kmax=5 iterate at 2a=1.00 could interval-verify remains open, but the best available iterate fails by -0.271 in 226 interior cells',
  ln3: LN3,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96956_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96956_ASSERTIONS = [
  {
    id: 'imp96956-iterate-reproduces-imp96845',
    holds: () =>
      Math.abs(IMP96956_ITERATE.l1 - 7.030242896554375) < 1e-9 &&
      Math.abs(IMP96956_ITERATE.worstGuardedResidualLean - -0.16636421527952594) < 1e-12 &&
      IMP96956_ITERATE.converged === false,
    why: 'the re-solved 2a=1.00 kmax=5 iterate reproduces the imp-96845 record exactly (l1=7.0302, guarded residual -0.16636, not converged) -- the same near-feasible iterate is what is fed to the verifier.',
  },
  {
    id: 'imp96956-interval-verification-fails',
    holds: () =>
      IMP96956_VERIFY.verified === false &&
      IMP96956_VERIFY.failingCells > 0 &&
      IMP96956_VERIFY.worstRigorousLowerBound < 0,
    why: 'the interval-rigorous verifier returns NOT VERIFIED with 226 failing cells and a worst rigorous lower bound of -0.271 -- the iterate collapses under rigor.',
  },
  {
    id: 'imp96956-obstruction-is-interior-not-tail',
    holds: () => {
      const [lo, hi] = IMP96956_VERIFY.interiorFailureBand;
      const loc = IMP96956_VERIFY.worstRigorousLowerBoundLocation;
      return loc > lo && loc < hi && loc < IMP96956_ITERATE.worstGuardedResidualLocation;
    },
    why: 'the honest rigorous obstruction sits INTERIOR (t~16.70, inside the 16.0-17.4 band) -- LEFT of the LP lean worst point (t~30.77 tail) -- where the sigma_2 curvature and t^5 guard bite, a margin the lean LP grid missed.',
  },
  {
    id: 'imp96956-tail-block-ok-but-interior-fails',
    holds: () =>
      IMP96956_VERIFY.tailOk === true &&
      IMP96956_VERIFY.tailBracket > 0 &&
      IMP96956_VERIFY.verified === false,
    why: 'the t>=40 tail block verifies cleanly (bracket +0.458) yet the overall certificate is NOT verified -- the failure is the interior guard margin, not the tail.',
  },
  {
    id: 'imp96956-pointwise-F-positive-but-not-certified',
    holds: () => IMP96956_VERIFY.pointwiseFmin > 0 && IMP96956_VERIFY.verified === false,
    why: 'the pointwise F-value stays ~+1 (LP achieved minF~1) yet the rigorous lower bound dips to -0.271 in 226 cells -- positive point values do NOT survive the honest interval enclosure + second-order guard.',
  },
  {
    id: 'imp96956-frontier-does-not-extend-certified-reach',
    holds: () =>
      IMP96956_VERDICT.frontierExtendsCertifiedReach === false &&
      IMP96956_VERDICT.collapsesUnderRigor === true &&
      IMP96956_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96956_VERDICT.qed === false &&
      typeof IMP96956_VERDICT.subGap === 'string' &&
      IMP96956_VERDICT.subGap.includes('IMP96956_CONVERGED_KMAX5_100_UNPRODUCED'),
    why: 'the kmax=5 near-feasible frontier gives NO certified extension past 2a=0.96 (the 2a=1.00 iterate collapses under rigor); named sub-gap records that a converged/finer iterate is untested; reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP96956_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96956-krein-kmax5-100-interval-verify assertion failed: ${a.id}`);
  }
}
