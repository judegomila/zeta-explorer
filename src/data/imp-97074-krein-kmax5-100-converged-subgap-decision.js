/**
 * @module imp-97074-krein-kmax5-100-converged-subgap-decision
 * @fileoverview imp-97074 -- DECISION (numerical, synthesis): decide the imp-96956 sub-gap
 *   IMP96956_CONVERGED_KMAX5_100_UNPRODUCED -- whether a fully-converged (guarded-residual >= 0) OR
 *   finer-FINEH kmax=5 Route I Krein iterate at 2a=1.00 could interval-verify. imp-96956 left this
 *   open, having tested ONLY the round-cap lean VIOLTOL=0.4 iterate (guarded residual stalled at
 *   -0.166 at FINEH=3e-4), which collapsed under rigor with 226 interior fails (worst -0.271). The
 *   deciding runs were subsequently produced by the imp-96970 -> imp-97012 -> imp-97050 chain; this
 *   leaf reads their COMMITTED frozen literals and records the two-branch decision so the sub-gap is
 *   not re-scouted as open. Index/synthesis only; re-runs NO heavy compute; changes no bound; NO QED.
 *
 * THE SUB-GAP HAS TWO BRANCHES; THEY DECIDE DIFFERENTLY.
 *
 *   BRANCH A -- "fully-converged (guarded-residual >= 0)" iterate: NOT PRODUCED (branch stays
 *     negative, now with a named mechanism). imp-96970 drove the kmax=5 cutting-plane solve at
 *     FINEH=1e-4 / HP=0.05 / VIOLTOL=0 (guard ~9x tighter than the imp-96956 lean grid). The
 *     fine-grid worst guarded residual improved from -0.166 to -0.069 but NEVER reached 0: over
 *     rounds 3-12 it cycled in [-0.148, -0.046] (non-monotone), the signature of a cutting-plane
 *     WALL rather than convergence. The binding point is the tail (t~36.4) where the
 *     (FINEH^2/8)*x^2 t^5 top-family guard exceeds F - eps. So a genuinely converged iterate could
 *     not be produced at 2a=1.00 -- the tail t^5 design guard is the wall (sub-gap
 *     IMP96970_LP_CONVERGENCE_NOT_REACHED).
 *
 *   BRANCH B -- "finer-FINEH / finer-guard" iterate: RESOLVED IN THE AFFIRMATIVE. The imp-96970
 *     round-12 BEST near-converged iterate (worst guarded residual -0.069, l1=7.030, 59 atoms,
 *     tmp/imp-96970/iterate-snap.json) DOES interval-verify F = sigma_2 + nu >= 0 over the WHOLE
 *     [0,40] domain at 2a=1.00 once the verifier's constant curvature bound W1PP=32.80 is replaced
 *     by the imp-96992 CELL-LOCAL |w1-prime-prime| enclosure (imp-97012: 0 failing cells, CERTIFICATE
 *     VERIFIED, hc=5e-4), a result independently reproduced on a second from-scratch interval library
 *     (imp-97050: 0 fails, worst rigorous lower bound +0.913). The A/B control (same script, constant
 *     bound) reproduces the collapse EXACTLY (59 fails, deepest -0.954 at t=37.8), so the collapse
 *     imp-96956 read as iterate non-convergence was a VERIFIER GUARD ARTIFACT, not a sign change: the
 *     true pointwise F stays +1.0000000175 throughout in every run.
 *
 * THE DECISION. IMP96956_CONVERGED_KMAX5_100_UNPRODUCED is DECIDED. A kmax=5 iterate at 2a=1.00
 * interval-verifies over the full [0,40] domain -- NOT via LP guarded-residual convergence (Branch A
 * is walled by the tail t^5 guard and stays unreached), but via the finer-guard branch (Branch B):
 * the near-converged round-12 iterate verifies once the constant-W1PP curvature guard is swapped for
 * the cell-local |w1-prime-prime| enclosure. The premise imp-96956 rested on -- that the 2a=1.00
 * collapse reflected a missing converged iterate -- dissolves: the obstruction was the verifier
 * curvature guard, and the available near-converged iterate verifies with the corrected guard.
 *
 * WHAT THIS DOES NOT DO. The verified pass is a single in-pool run plus ONE independent-library
 * reproduction; it is a numerical cross-implementation reproduction, not a machine-checked proof.
 * The project certified interval-rigorous reach is NOT upgraded from it: it stays 2a <= 0.96 pending
 * (a) further adversarial re-verification of the cell-local enclosure soundness and the verify4
 * tail / cell-edge machinery, and (b) the separate interpretive step from a verified
 * T_a[sigma_2] >= 0 certificate to any Weil / operator-positivity statement -- the operator floor is
 * a Rayleigh UPPER bound, and the semilocal Sonine port is independently obstructed at 2a=ln2 (the
 * excess carries half the rho=2 log cusp). RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96956-krein-kmax5-100-interval-verify.js (the open sub-gap; lean VIOLTOL=0.4 iterate collapse, 226 interior fails)
 * @see imp-96970-krein-kmax5-100-converged-solve-verify.js (Branch A: LP walled at -0.069; the round-12 best iterate + 59-fail constant-guard collapse)
 * @see imp-96992-w1pp-celllocal-enclosure.js (the cell-local |w1-prime-prime| enclosure)
 * @see imp-97012-krein-kmax5-100-celllocal-w1pp-verify.js (Branch B: cell-local swap -> full [0,40] verify passes at 2a=1.00)
 * @see imp-97050-independent-fullpipeline-sweep.js (Branch B reproduced on a second interval library)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous certified reach 2a <= 0.96)
 */

// Branch A -- fully-converged (guarded-residual >= 0) iterate: NOT produced (imp-96970 measured).
export const IMP97074_BRANCH_A = Object.freeze({
  question: 'can the kmax=5 cutting-plane LP reach guarded design residual F - guard - eps >= 0 at 2a=1.00?',
  produced: false,
  bestWorstGuardedResidual: -0.068914, // imp-96970 FINEH=1e-4/HP=0.05/VIOLTOL=0 (vs imp-96956 lean -0.166)
  worstResidualLocation: 36.416, // tail t^5 guard wall
  residualCycles: true, // non-monotone over rounds 3-12 -> cutting-plane wall, not convergence
  wallMechanism: 'tail (FINEH^2/8) x^2 t^5 top-family design guard exceeds F - eps',
  subGap: 'IMP96970_LP_CONVERGENCE_NOT_REACHED',
});

// Branch B -- finer-guard iterate: RESOLVED affirmative (imp-97012 verify, imp-97050 reproduction).
export const IMP97074_BRANCH_B = Object.freeze({
  question: 'does a kmax=5 iterate at 2a=1.00 interval-verify with a finer (cell-local) curvature guard?',
  resolved: true,
  intervalVerifies: true,
  iterate: 'tmp/imp-96970/iterate-snap.json (round-12 near-converged, worst residual -0.069, l1=7.030, 59 atoms)',
  guardSwap: 'constant W1PP=32.80 -> imp-96992 cell-local |w1-prime-prime| enclosure',
  hc: 5.0e-4,
  domain: [0, 40],
  failsCellLocal: 0, // imp-97012 / imp-97050
  failsConstControl: 59, // A/B control reproduces the collapse exactly
  worstRigLowerBoundCellLocal: 0.9131441750506937, // imp-97050 min over 80000 cells (positive)
  deepestConstControl: -0.954363556514616, // imp-97012 deepest across the 59 fails
  truePointFMin: 1.0000000175343908, // pointwise F positive across [0,40] in every run
  collapseWasVerifierArtifact: true, // constant-guard collapse, not a sign change in F
  independentlyReproduced: true, // imp-97050 second from-scratch interval library
});

export const IMP97074_VERDICT = Object.freeze({
  ticket: 'imp-97074',
  decides: 'IMP96956_CONVERGED_KMAX5_100_UNPRODUCED',
  decided: true,
  branchAConvergedIterateProduced: false, // LP walled by the tail t^5 guard
  branchBFinerGuardIterateVerifies: true, // cell-local swap -> full [0,40] verify passes at 2a=1.00
  answer:
    'DECIDED: a kmax=5 iterate at 2a=1.00 interval-verifies over the full [0,40] domain -- NOT via LP guarded-residual convergence (Branch A stays walled by the tail t^5 guard, worst -0.069), but via the finer-guard branch (Branch B: the round-12 near-converged iterate verifies once the constant-W1PP curvature guard is swapped for the imp-96992 cell-local |w1-prime-prime| enclosure; 0 fails, independently reproduced). The imp-96956 collapse was a verifier guard artifact, not a missing converged iterate.',
  // Guardrails: certified reach NOT upgraded from this decision.
  certifiedReachUnchanged: 0.96,
  stillNeeds:
    'further adversarial re-verification of the cell-local enclosure + verify4 tail/edge machinery, and the interpretive step from T_a[sigma_2] >= 0 to Weil/operator positivity (operator floor is a Rayleigh UPPER bound; Sonine port obstructed at 2a=ln2)',
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});
export default IMP97074_VERDICT;

// --- self-executing assertions (pure literals; import-light) ---
const IMP97074_ASSERTIONS = [
  {
    id: 'imp97074-branch-a-converged-iterate-not-produced',
    holds: () =>
      IMP97074_BRANCH_A.produced === false &&
      IMP97074_BRANCH_A.bestWorstGuardedResidual < 0 &&
      IMP97074_BRANCH_A.bestWorstGuardedResidual > -0.166 && // improves over imp-96956 lean -0.166
      IMP97074_BRANCH_A.residualCycles === true &&
      IMP97074_BRANCH_A.worstResidualLocation > 30 &&
      IMP97074_BRANCH_A.subGap === 'IMP96970_LP_CONVERGENCE_NOT_REACHED',
    why: 'Branch A -- the kmax=5 LP guarded residual improves to -0.069 but cycles without reaching 0, walled by the tail t^5 design guard; a fully-converged iterate was not produced at 2a=1.00.',
  },
  {
    id: 'imp97074-branch-b-finer-guard-iterate-verifies',
    holds: () =>
      IMP97074_BRANCH_B.resolved === true &&
      IMP97074_BRANCH_B.intervalVerifies === true &&
      IMP97074_BRANCH_B.failsCellLocal === 0 &&
      IMP97074_BRANCH_B.failsConstControl === 59 &&
      IMP97074_BRANCH_B.worstRigLowerBoundCellLocal > 0 &&
      IMP97074_BRANCH_B.deepestConstControl < 0 &&
      Math.abs(IMP97074_BRANCH_B.truePointFMin - 1.0) < 1e-6 &&
      IMP97074_BRANCH_B.collapseWasVerifierArtifact === true &&
      IMP97074_BRANCH_B.independentlyReproduced === true,
    why: 'Branch B -- the round-12 near-converged iterate interval-verifies over [0,40] at 2a=1.00 with the cell-local |w1-prime-prime| guard (0 fails, worst rigorous lb +0.913), the constant-guard control reproduces the 59-fail collapse, and the true pointwise F stays +1.0000000175 -- the collapse was a verifier artifact, independently reproduced.',
  },
  {
    id: 'imp97074-subgap-decided-two-branches-differ',
    holds: () =>
      IMP97074_VERDICT.decides === 'IMP96956_CONVERGED_KMAX5_100_UNPRODUCED' &&
      IMP97074_VERDICT.decided === true &&
      IMP97074_VERDICT.branchAConvergedIterateProduced === false &&
      IMP97074_VERDICT.branchBFinerGuardIterateVerifies === true,
    why: 'the sub-gap is DECIDED with its two branches distinguished: no converged (guarded-residual >= 0) iterate exists (Branch A), but a finer-guard iterate DOES interval-verify (Branch B).',
  },
  {
    id: 'imp97074-reach-unchanged-no-qed',
    holds: () =>
      IMP97074_VERDICT.certifiedReachUnchanged === 0.96 &&
      IMP97074_VERDICT.operatorPositivityProved === false &&
      IMP97074_VERDICT.rhResolved === false &&
      IMP97074_VERDICT.qed === false &&
      typeof IMP97074_VERDICT.stillNeeds === 'string' &&
      IMP97074_VERDICT.stillNeeds.includes('Weil'),
    why: 'the decision does NOT upgrade the certified reach (stays 2a<=0.96); the verified pass still needs further re-verification and the interpretive step to Weil/operator positivity; RH open; NO QED.',
  },
];

for (const a of IMP97074_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97074 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
