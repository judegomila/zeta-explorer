/**
 * @fileoverview imp-96970 -- CONVERGED-ITERATE SOLVE + RE-VERIFICATION (numerical): attempt to drive
 * the kmax=5 Route I Krein cutting-plane solve to FULL convergence (guarded design residual
 * F - guard - eps >= 0 on the fine grid) at 2a=1.00, then re-run the interval-rigorous verifier on the
 * best-available iterate, deciding whether ANY kmax=5 certificate interval-verifies at 2a=1.00. This
 * targets the imp-96956 sub-gap IMP96956_CONVERGED_KMAX5_100_UNPRODUCED: imp-96956 tested only the
 * round-cap lean VIOLTOL=0.4 iterate (guarded residual stalled at -0.166 at FINEH=3e-4) and it
 * collapsed under rigor. Import-light: all values below are frozen literals from a direct
 * scipy-HiGHS cutting-plane solve (tmp/imp-96970/solve-converge-100.py, FINEH=1e-4, HP=0.05,
 * VIOLTOL=0, kmax=5) and a subsequent mpmath.iv prec-80 verify4 run at hc=5e-4 over the full [0,40]
 * domain (tmp/imp-96970/verify-hc5em4.log). No bound moves; certified reach stays 2a<=0.96; RH open;
 * NO QED.
 *
 * SETUP. The cutting-plane LP minimises the atom l1 subject to the guarded design condition
 *   F(t_f) - guard(t_f) - eps >= 0,  F(t) = sigma_2(t) + sum_k sum_j c_{k,j} t^k trig_k(x_j t),
 * sigma_2 = (t^2+1/4)^2 w_1, guard = (FINEH^2/8)(sum |c| |t^k trig|-prime-prime bound + |sigma_2-prime-prime| bound),
 * over a fine grid of spacing FINEH plus a periodic tail block (spacing HP) for the top t^5 family.
 * Convergence = worst fine-grid guarded residual >= 0. VIOLTOL=0 keeps adding cutting planes until
 * that holds (or the round cap of 40 is hit); imp-96956 used VIOLTOL=0.4 (stops early) at FINEH=3e-4.
 *
 * FINDING 1 -- THE LP DOES NOT CONVERGE AT 2a=1.00; THE GUARDED RESIDUAL CYCLES NEAR -0.069. With the
 * lean grid refined (FINEH 3e-4 -> 1e-4, guard ~9x smaller) and the tail block tightened (HP 0.2 -> 0.05)
 * and VIOLTOL=0, the fine-grid worst guarded residual improves from the imp-96956 -0.166 to -0.069 but
 * NEVER reaches 0: over rounds 3-12 it CYCLES in [-0.148, -0.046] (0.231, 0.148, 0.069, 0.148, 0.147,
 * 0.073, 0.148, 0.046, 0.098, 0.069 -- all negative, non-monotone), the signature of a cutting-plane
 * WALL rather than convergence. The binding point is the tail: worst residual -0.068914 at t=36.416,
 * where F=1.1026 but guard=0.17155 exceeds F-eps=0.1026 (the (FINEH^2/8)*(x^2 t^5) top-family guard).
 * l1 holds at ~7.0302 throughout (61 nonzero atoms). So a fully-converged (guarded-residual >= 0)
 * kmax=5 iterate at 2a=1.00 was NOT produced -- the tail t^5 guard is the wall.
 *
 * FINDING 2 -- THE BEST NEAR-CONVERGED ITERATE STILL DOES NOT INTERVAL-VERIFY (hc=5e-4, worst -0.615).
 * Running verify4 (mpmath.iv prec 80) on the round-12 iterate (worst residual -0.069, l1=7.030, 59
 * non-zero atoms) over the whole [0,40] domain at coarse cell width hc=5e-4 (80000 cells, 3.90M fine
 * points, ~330s) returns NOT VERIFIED: 59 failing cells with a negative rigorous lower bound, worst
 * -0.615 at t~35.855, ALL clustered at high t (bands t~35.20 and t~35.85). The tail (t>=40) bracket
 * stays positive (+0.4581). The verifier point-value diagnostic shows the true pointwise F minimum is
 * +1.0000000175 at t=0.340, positive across [0,40] -- the negative rigorous lower bounds are the
 * coarse-cell second-order guard penalty, not a sign change in F.
 *
 * FINDING 3 -- THE OBSTRUCTION IS THE VERIFIER CURVATURE GUARD, NOT THE ITERATE; IT PERSISTS/RELOCATES.
 * This is the SAME high-t (t^2+1/4)^2 W1PP curvature mechanism imp-96991 found at hc=1e-3 (91 cells at
 * t~24-38, deepest -4.19). Refining BOTH the iterate (imp-96956 -0.166 -> this -0.069) AND the verifier
 * grid (hc 1e-3 -> 5e-4, r^2 penalty ~4x smaller: deepest -4.19 -> -0.615) shrinks but does NOT clear
 * the collapse: it relocates to the highest resolvable t-band (t~35, near the T=40 edge). This confirms
 * imp-96978/imp-96992: the binding penalty is -0.5 C2 d^2 with C2 dominated (~99%) by (t^2+1/4)^2 W1PP
 * (the CONSTANT bound W1PP=32.80 of |w1-prime-prime|), and the tractable fix is the imp-96992 cell-local
 * |w1-prime-prime| enclosure swap (~0.478 at large t, 44.6x smaller C2) -- NOT iterate convergence and
 * NOT hc refinement alone (each hc halving doubles the cell count while q^2 W1PP grows ~t^4).
 *
 * VERDICT. NO kmax=5 certificate interval-verifies at 2a=1.00 with the current verifier machinery.
 * A fully-converged (guarded-residual >= 0) kmax=5 iterate could NOT be produced (the LP guarded
 * residual cycles at ~-0.069, walled by the tail t^5 guard even at FINEH=1e-4/HP=0.05), and the best
 * near-converged iterate does NOT interval-verify at hc=5e-4 (59 high-t cells, worst -0.615). The true
 * pointwise F stays positive throughout, so the collapse is the constant-W1PP coarse-cell curvature
 * guard (imp-96992 lever), not a genuine sign change. The certified interval-rigorous reach stays
 * exactly 2a<=0.96. SUB-GAP IMP96970_LP_CONVERGENCE_NOT_REACHED -- the LP guarded residual was not
 * driven >= 0 at 2a=1.00 (cycles at -0.069); a much finer FINEH / different tail parametrisation is
 * untested. SUB-GAP IMP96970_FINER_HC_OR_BOUND_SWAP_UNRUN -- whether a much finer hc (2e-4 and below,
 * the hc=2e-4 run did not complete) or the imp-96992 cell-local |w1-prime-prime| swap clears the t~35
 * band over the full [0,40] domain remains open. RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96956-krein-kmax5-100-interval-verify.js (parent: lean VIOLTOL=0.4 iterate collapse; sub-gap IMP96956_CONVERGED_KMAX5_100_UNPRODUCED)
 * @see imp-96991-krein-fulldomain-hc1em3-rerun.js (sibling: hc=1e-3 on the lean iterate, 91 cells at t~24-38, deepest -4.19)
 * @see imp-96992-w1pp-celllocal-enclosure.js (the cell-local |w1-prime-prime| enclosure fix this run motivates)
 * @see imp-96978-krein-kmax5-100-guard-resolution.js (diagnosed C2 ~ 99% q^2 W1PP)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Solve configuration driving toward convergence (finer than the imp-96956 lean grid).
export const IMP96970_SOLVE_CONFIG = Object.freeze({
  solver: 'tmp/imp-96970/solve-converge-100.py (lp13 exact sigma_2 cutting-plane, KMAX=5)',
  twoA: 1.0,
  eps: 1.0,
  X: 8.0,
  dx: 0.02,
  T: 40.0,
  FINEH: 1.0e-4, // vs imp-96956 lean 3e-4 (guard ~9x smaller)
  HP: 0.05, // vs imp-96956 lean 0.2 (tighter periodic tail block)
  violTol: 0.0, // require guarded residual >= 0 (imp-96956 used 0.4, stops early)
  roundCap: 40,
  method: 'highs-ds',
});

// MEASURED solve result -- the LP does NOT converge; the guarded residual cycles near -0.069.
export const IMP96970_SOLVE = Object.freeze({
  converged: false,
  l1: 7.030231791602745,
  worstGuardedResidual: -0.068914, // fine-grid worst F - guard - eps
  worstGuardedResidualLocation: 36.416, // tail region (t^5 guard wall)
  worstF: 1.102637,
  worstGuard: 0.171551, // guard 0.1716 > F-eps 0.1026 => residual negative
  nNonzeroAtoms: 61,
  minPointwiseF: 1.00000002, // pointwise F stays above eps=1 (min at t~0.34)
  // rounds 3-12 worst-residual trajectory (non-monotone => cutting-plane wall, not convergence)
  residualCycle: [-0.23102, -0.14777, -0.06862, -0.14776, -0.14693, -0.07316, -0.14834, -0.04636, -0.09816, -0.06891],
  improvesOverImp96956Lean: true, // -0.166 (FINEH=3e-4) -> -0.069 (FINEH=1e-4), still not >= 0
});

// MEASURED interval-rigorous verification of the round-12 near-converged iterate (verify4, prec 80).
export const IMP96970_VERIFY = Object.freeze({
  verifier: 'tmp/toeplitz-krein-verify4.py (mpmath.iv prec 80)',
  iterate: 'tmp/imp-96970/iterate-snap.json (round-12 near-converged, worst residual -0.069)',
  twoA: 1.0,
  hc: 5.0e-4, // finer than imp-96991 hc=1e-3
  domain: [0, 40],
  coarseCells: 80000,
  finePoints: 3897895,
  verified: false,
  failingCells: 59,
  worstRigorousLowerBound: -0.6149795629431712,
  worstRigorousLowerBoundLocation: 35.855, // high t, near the T=40 edge
  failTBands: [35], // failures cluster at t~35.20 and t~35.85 (both floor 35)
  truePointFMin: 1.0000000175343908, // pointwise F positive across [0,40]
  truePointFMinLocation: 0.33975,
  tailOk: true,
  tailBracket: 0.4581347780747981,
  verifySecs: 330.3,
  nAtoms: 59,
});

export const IMP96970_VERDICT = Object.freeze({
  ticket: 'imp-96970',
  question: 'can a fully-converged (guarded-residual >= 0) kmax=5 iterate be produced at 2a=1.00, and does ANY kmax=5 certificate interval-verify there, extending the certified reach past 2a=0.96?',
  twoA: 1.0,
  // Finding 1: LP convergence NOT reached
  lpConverges: false,
  lpWorstGuardedResidual: IMP96970_SOLVE.worstGuardedResidual,
  lpResidualCycles: true, // non-monotone -> wall, not convergence
  lpWallIsTailGuard: true,
  // Finding 2: best near-converged iterate does NOT interval-verify
  intervalVerifies: false,
  verifyWorstRigorousLowerBound: IMP96970_VERIFY.worstRigorousLowerBound,
  verifyFailingCells: IMP96970_VERIFY.failingCells,
  // Finding 3: obstruction is the verifier constant-W1PP curvature guard, not the iterate
  truePointFStaysPositive: true,
  collapseIsGuardResolutionArtifact: true,
  collapseIsGenuineObstruction: false,
  obstructionIsVerifierCurvatureGuardNotIterate: true,
  tractableFix: 'imp-96992 cell-local |w1-prime-prime| enclosure swap (44.6x smaller C2), not iterate convergence or hc refinement alone',
  // Decision
  anyKmax5CertificateVerifiesAt100: false, // NOT with the current verifier and the best available iterate
  frontierExtendsCertifiedReach: false,
  intervalRigorousReachUnchanged: 0.96,
  // Honest sub-gaps + guardrails
  subGapLpConvergence: 'IMP96970_LP_CONVERGENCE_NOT_REACHED -- the kmax=5 LP guarded residual cycles at ~-0.069 at 2a=1.00 (FINEH=1e-4, HP=0.05, VIOLTOL=0), walled by the tail t^5 guard; not driven >= 0.',
  subGapFinerHcOrSwap: 'IMP96970_FINER_HC_OR_BOUND_SWAP_UNRUN -- whether a much finer hc (2e-4 and below; the hc=2e-4 run did not complete) or the imp-96992 cell-local |w1-prime-prime| swap clears the t~35 band over the full [0,40] domain is open.',
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});
export default IMP96970_VERDICT;

// --- self-executing assertions (pure literals; import-light) ---
const IMP96970_ASSERTIONS = [
  {
    id: 'imp96970-lp-does-not-converge-residual-cycles',
    holds: () =>
      IMP96970_SOLVE.converged === false &&
      IMP96970_SOLVE.worstGuardedResidual < 0 &&
      IMP96970_SOLVE.worstGuardedResidual > -0.166 && // improves over imp-96956 lean -0.166
      IMP96970_SOLVE.residualCycle.every((v) => v < 0) &&
      // non-monotone: a later round is worse than an earlier one -> cutting-plane wall
      IMP96970_SOLVE.residualCycle.some((v, i) => i > 0 && v < IMP96970_SOLVE.residualCycle[i - 1]) &&
      IMP96970_VERDICT.lpConverges === false,
    why: 'at FINEH=1e-4/HP=0.05/VIOLTOL=0 the kmax=5 LP guarded residual improves to -0.069 (from imp-96956 -0.166) but cycles in [-0.148,-0.046] over rounds 3-12 without reaching 0 -- a cutting-plane wall, not convergence.',
  },
  {
    id: 'imp96970-lp-wall-is-tail-guard',
    holds: () =>
      IMP96970_SOLVE.worstGuardedResidualLocation > 30 &&
      IMP96970_SOLVE.worstGuard > IMP96970_SOLVE.worstF - IMP96970_SOLVE_CONFIG.eps &&
      IMP96970_SOLVE.minPointwiseF > IMP96970_SOLVE_CONFIG.eps,
    why: 'the LP worst residual sits at t~36.4 where the (FINEH^2/8)*x^2 t^5 top-family guard (0.1716) exceeds F-eps (0.1026); the pointwise F itself stays above eps=1, so the wall is the tail second-order guard, not an F sign change.',
  },
  {
    id: 'imp96970-best-iterate-does-not-interval-verify',
    holds: () =>
      IMP96970_VERIFY.verified === false &&
      IMP96970_VERIFY.failingCells === 59 &&
      IMP96970_VERIFY.worstRigorousLowerBound < 0 &&
      IMP96970_VERIFY.worstRigorousLowerBoundLocation > 30 &&
      IMP96970_VERIFY.hc < 1.0e-3 && // finer than imp-96991
      IMP96970_VERIFY.tailOk === true &&
      IMP96970_VERDICT.intervalVerifies === false,
    why: 'verify4 at hc=5e-4 (finer than imp-96991 hc=1e-3) on the best near-converged iterate returns NOT VERIFIED with 59 high-t failing cells (worst -0.615 at t~35.86), the tail block still clean -- no kmax=5 certificate interval-verifies at 2a=1.00.',
  },
  {
    id: 'imp96970-collapse-shrinks-but-relocates-high-t',
    holds: () =>
      // hc 1e-3 -> 5e-4 shrinks the deepest failure (imp-96991 -4.19 -> here -0.615) but does not clear it
      IMP96970_VERIFY.worstRigorousLowerBound > -4.189 &&
      IMP96970_VERIFY.worstRigorousLowerBound < 0 &&
      IMP96970_VERIFY.failTBands.every((b) => b >= 24) &&
      IMP96970_VERIFY.truePointFMin > 1.0 &&
      IMP96970_VERDICT.collapseIsGuardResolutionArtifact === true &&
      IMP96970_VERDICT.collapseIsGenuineObstruction === false,
    why: 'refining the iterate and halving hc (r^2 penalty ~4x smaller) shrinks the deepest rigorous lower bound from imp-96991 -4.19 to -0.615 but relocates the collapse to the highest resolvable t-band (t~35); true pointwise F stays +1.0000000175, so it is the constant-W1PP curvature guard, not a sign change.',
  },
  {
    id: 'imp96970-no-verified-cert-reach-unchanged-no-qed',
    holds: () =>
      IMP96970_VERDICT.anyKmax5CertificateVerifiesAt100 === false &&
      IMP96970_VERDICT.obstructionIsVerifierCurvatureGuardNotIterate === true &&
      IMP96970_VERDICT.frontierExtendsCertifiedReach === false &&
      IMP96970_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96970_VERDICT.subGapLpConvergence.includes('IMP96970_LP_CONVERGENCE_NOT_REACHED') &&
      IMP96970_VERDICT.subGapFinerHcOrSwap.includes('IMP96970_FINER_HC_OR_BOUND_SWAP_UNRUN') &&
      IMP96970_VERDICT.operatorPositivityProved === false &&
      IMP96970_VERDICT.rhResolved === false &&
      IMP96970_VERDICT.qed === false,
    why: 'no kmax=5 certificate interval-verifies at 2a=1.00 (LP does not converge; best iterate fails at hc=5e-4); the obstruction is the verifier constant-W1PP curvature guard (imp-96992 lever), the certified reach stays 2a<=0.96, both sub-gaps are named, and NO QED.',
  },
];

for (const a of IMP96970_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96970 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
