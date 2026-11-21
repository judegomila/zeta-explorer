/**
 * @fileoverview imp-97012 -- VERIFICATION (numerical): re-run the imp-96970 round-12 kmax=5
 * 2a=1.00 interval verify with the imp-96992 CELL-LOCAL |w1-prime-prime| enclosure substituted
 * for the constant W1PP=32.80 in the C2 curvature guard, and decide whether the rigorous lower
 * bound clears zero across the t~35 band over the full [0,40] domain.
 *
 * This closes the imp-96970 sub-gap IMP96970_FINER_HC_OR_BOUND_SWAP_UNRUN and the imp-96992
 * sub-gap IMP96992_LARGET_ONLY_RERUN_NOT_RUN. Import-light: all values below are frozen literals
 * from tmp/imp-97012-verify4-celllocal.py (a byte-identical copy of tmp/toeplitz-krein-verify4.py
 * whose ONLY functional edit is the q^2*W1PP term of C2 in the power==2 branch), run against
 * tmp/imp-96970/iterate-snap.json (the same round-12 iterate imp-96970 Finding 2 verified) at
 * hc=5e-4 over the full [0,40] domain on /tmp/rhvenv (mpmath 1.4.1, numpy 2.5.3, scipy 1.18.1).
 *
 * THE SWAP. verify4 bounds the sigma_2 second-derivative on each cell by C2 = (12 t^2+1)|w1| +
 * 8 t (t^2+1/4)|w1-prime| + (t^2+1/4)^2 * B, where B is the |w1-prime-prime| bound. The baseline
 * B is the CONSTANT W1PP = 0.5 zeta(3,1/4) + sqrt2(ln2)^3 + 1e-6 = 32.803, set by the t=0 peak of
 * the digamma piece. This run replaces B with the imp-96992 cell-local upper bound evaluated at the
 * cell lower endpoint t_lo (its supremum over the cell):
 *   B(t_lo) = sqrt2(ln2)^3 + (1/2) sum_n 1/((n+1/4)^2 + (t_lo/2)^2)^{3/2} + 1e-6.
 * This is a rigorous tightening of the SAME quantity: it recovers 32.803 exactly at t_lo=0 (so it can
 * never be less safe than the constant near the origin) and decays to ~0.4725 (a 69.4x reduction) out
 * in the t~35-40 band where the digamma piece is negligible and only the cosine floor sqrt2(ln2)^3
 * survives. Because |psi-prime-prime(1/4+it/2)| is monotone decreasing in t, using t_lo gives the
 * sup of B over each cell -- the bound stays a rigorous upper bound of |w1-prime-prime| on the cell.
 *
 * FINDING 1 -- THE SWAP CLEARS THE COLLAPSE: FULL [0,40] VERIFY PASSES AT 2a=1.00.
 * With the cell-local B, the round-12 iterate (59 atoms, l1=7.030) interval-verifies F = sigma_2 + nu
 * >= 0 over the WHOLE [0,40] domain at hc=5e-4: 0 failing cells (down from 59), CERTIFICATE VERIFIED,
 * tail bracket +0.458135, worst pointwise F +1.0000000175 at t=0.3398. The t~35 curvature-guard band
 * that produced 59 failing cells with the constant B is fully cleared -- every high-t cell now returns
 * a positive rigorous lower bound. The fine-grid count drops from 3,897,895 to 192,808 points (~20x
 * fewer) because the smaller C2 admits a larger safe step rf; runtime 281.5s.
 *
 * FINDING 2 -- CONTROLLED A/B: THE SAME SCRIPT WITH THE CONSTANT B REPRODUCES THE 59 FAILS.
 * Re-running the identical script with celllocal=False (constant W1PP) reproduces the imp-96970
 * Finding 2 collapse EXACTLY: 59 failing cells, tail bracket +0.458135, worst pointwise F
 * +1.0000000175 at t=0.3398, deepest rigorous lower bound -0.954364 at t=37.809 (C2=6.735e7, ~99%
 * the q^2*W1PP term), with the printed t~35.20 / t~35.85 band fails matching the original
 * verify-hc5em4.log to the digit (e.g. -0.6150786833 at t=35.856). So the ONLY difference between
 * PASS and FAIL is the |w1-prime-prime| bound: the collapse was a constant-B verifier artifact, not a
 * sign change (imp-96970 Finding 3), and the cell-local enclosure removes it.
 *
 * VERDICT. The imp-96992 cell-local |w1-prime-prime| swap (44.6x smaller C2 at t~16.7, 69.4x smaller
 * B out at t~35-40) does what imp-96970/96978/96992 predicted: it clears the t~35 curvature-guard
 * band and the round-12 kmax=5 iterate now interval-verifies over the full [0,40] domain at 2a=1.00.
 *
 * HONEST RESIDUAL -- SUB-GAP IMP97012_CELLLOCAL_PASS_NEEDS_INDEPENDENT_REVERIFY. This is a SINGLE
 * in-pool verifier run. Per the ticket, the certified reach is NOT upgraded from it: promoting 2a=1.00
 * to the project certified reach requires (a) independent adversarial re-verification of the cell-local
 * enclosure soundness and the verify4 tail / cell-edge machinery on a second implementation, and
 * (b) the separate interpretive step from a verified T_a[sigma_2] >= 0 certificate to any Weil /
 * operator-positivity statement -- the operator floor here is a Rayleigh UPPER bound, and the semilocal
 * Sonine port is independently obstructed at 2a=ln2 (the excess carries half the rho=2 log cusp).
 * So certified reach stays 2a<=0.96 pending that verification; operator positivity not proved; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96992-w1pp-celllocal-enclosure.js (the cell-local bound; sub-gap IMP96992_LARGET_ONLY_RERUN_NOT_RUN)
 * @see imp-96970-krein-kmax5-100-converged-solve-verify.js (Finding 2/3; the round-12 iterate and the 59-fail collapse)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (interval-rigorous reach 2a <= 0.96)
 */

// Constant |w1-prime-prime| bound (verify4.py line 21): 0.5 zeta(3,1/4) + sqrt2(ln2)^3 + 1e-6.
export const IMP97012_W1PP_CONST = 32.802904;
// Cell-local B evaluated at representative cell lower endpoints t_lo (the sup over the cell), with the
// reduction factor W1PP_CONST / B. Values from tmp/imp-97012-verify4-celllocal.py. Note t_lo=0 recovers
// the constant EXACTLY (the swap is never less safe than the baseline near the origin).
export const IMP97012_CELLBOUND_SCAN = Object.freeze([
  { tLo: 0.0, cellBound: 32.802904, reduction: 1.0 },
  { tLo: 1.0, cellBound: 3.610191, reduction: 9.09 },
  { tLo: 5.0, cellBound: 0.559098, reduction: 58.67 },
  { tLo: 16.7, cellBound: 0.478355, reduction: 68.57 },
  { tLo: 35.0, cellBound: 0.472625, reduction: 69.41 },
  { tLo: 35.855, cellBound: 0.472546, reduction: 69.42 },
  { tLo: 40.0, cellBound: 0.472235, reduction: 69.46 },
]);

// The full-domain [0,40] verify at 2a=1.00, hc=5e-4, on the imp-96970 round-12 iterate.
// A/B: identical script; the only difference is the |w1-prime-prime| bound in C2.
export const IMP97012_VERIFY = Object.freeze({
  iterate: 'tmp/imp-96970/iterate-snap.json',
  symbol: 'sigma2',
  twoA: 1.0,
  atoms: 59,
  l1: 7.03019892113048,
  hc: 5.0e-4,
  domain: [0, 40],
  T: 40.0,
  tailBracket: 0.4581347780747981, // rigorous tail lower-bound bracket, t > 40; identical in both runs
  worstPointF: 1.0000000175343908, // true pointwise F minimum, at t=0.3398; identical in both runs
  worstPointT: 0.3397500000000002,
  // constant-B control (celllocal=False) -- reproduces imp-96970 Finding 2 exactly
  constB: Object.freeze({
    B: 32.802903963831554,
    ncells: 80000,
    nfine: 3897895,
    nfails: 59,
    deepestLowerBound: -0.954363556514616, // deepest rigorous lower bound across the 59 fails
    deepestAtT: 37.808968749998506,
    deepestC2: 67349733.08771612, // ~99% the q^2 * W1PP curvature term
    verified: false,
    secs: 384.2,
  }),
  // cell-local-B run (celllocal=True) -- the swap
  cellLocalB: Object.freeze({
    ncells: 80000,
    nfine: 192808, // ~20x fewer fine points: smaller C2 admits a larger safe step
    nfails: 0,
    verified: true,
    secs: 281.5,
  }),
});

export const IMP97012_VERDICT = Object.freeze({
  ticket: 'imp-97012',
  question:
    'does substituting the imp-96992 cell-local |w1-prime-prime| enclosure for the constant W1PP=32.80 in C2 clear the t~35 curvature-guard band over the full [0,40] domain at 2a=1.00?',
  // Finding 1: yes -- full-domain verify passes
  clearsHighTBand: true,
  fullDomainVerifies: true,
  failsConst: 59,
  failsCellLocal: 0,
  // Finding 2: controlled A/B isolates the bound as the sole cause
  controlReproducesCollapse: true,
  soleDifferenceIsW1ppBound: true,
  collapseWasVerifierArtifact: true, // pointwise F stays +1.0000000175; not a sign change
  reductionAtHighT: 69.42,
  // Honest residual + guardrails
  subGap:
    'IMP97012_CELLLOCAL_PASS_NEEDS_INDEPENDENT_REVERIFY -- a single in-pool verifier run passes; promoting 2a=1.00 to the certified reach needs independent adversarial re-verification of the cell-local enclosure soundness and the verify4 tail/edge machinery, plus the interpretive step from a T_a[sigma_2]>=0 certificate to Weil/operator positivity (operator floor is a Rayleigh UPPER bound; Sonine port obstructed at 2a=ln2).',
  certifiedReachUnchanged: 0.96,
  operatorPositivityProved: false,
  rhResolved: false,
  qed: false,
});

// --- self-executing assertions (pure literals; import-light) ---
const IMP97012_ASSERTIONS = [
  {
    id: 'imp97012-cellbound-recovers-constant-at-origin-and-decays',
    holds: () => {
      const s = IMP97012_CELLBOUND_SCAN;
      const at0 = s.find((c) => c.tLo === 0.0);
      const atHi = s.find((c) => c.tLo === 35.855);
      return (
        Math.abs(at0.cellBound - IMP97012_W1PP_CONST) < 1e-4 && // recovers the constant at t=0
        Math.abs(at0.reduction - 1.0) < 1e-6 &&
        atHi.cellBound < 0.48 &&
        atHi.reduction > 69 &&
        atHi.reduction < 70 &&
        s.every((c) => Math.abs(c.reduction - IMP97012_W1PP_CONST / c.cellBound) < 0.05)
      );
    },
    why: 'the cell-local |w1-prime-prime| bound recovers the constant 32.80 exactly at t_lo=0 (never less safe near the origin) and decays to ~0.4725 out at t~35.9, a 69.4x reduction where only the cosine floor survives.',
  },
  {
    id: 'imp97012-cellocal-swap-clears-full-domain-verify',
    holds: () => {
      const v = IMP97012_VERIFY;
      return (
        v.constB.nfails === 59 &&
        v.constB.verified === false &&
        v.constB.deepestLowerBound < -0.9 && // constant B: deep negative rigorous lower bound at high t
        v.cellLocalB.nfails === 0 &&
        v.cellLocalB.verified === true && // cell-local B: full [0,40] verify passes
        v.cellLocalB.nfine < v.constB.nfine && // smaller C2 -> fewer fine points
        v.tailBracket > 0 &&
        Math.abs(v.worstPointF - 1.0) < 1e-6 // true pointwise F unchanged -- the collapse was a verifier artifact
      );
    },
    why: 'with the constant B the full [0,40] verify has 59 failing cells (deepest -0.954 at t=37.8); swapping in the cell-local B clears all of them (0 fails, CERTIFICATE VERIFIED) while the tail bracket +0.458 and the true pointwise F +1.0000000175 are unchanged -- the only difference is the |w1-prime-prime| bound.',
  },
  {
    id: 'imp97012-pass-but-no-qed',
    holds: () =>
      IMP97012_VERDICT.clearsHighTBand === true &&
      IMP97012_VERDICT.fullDomainVerifies === true &&
      IMP97012_VERDICT.controlReproducesCollapse === true &&
      IMP97012_VERDICT.certifiedReachUnchanged === 0.96 &&
      IMP97012_VERDICT.operatorPositivityProved === false &&
      IMP97012_VERDICT.rhResolved === false &&
      IMP97012_VERDICT.qed === false &&
      typeof IMP97012_VERDICT.subGap === 'string' &&
      IMP97012_VERDICT.subGap.includes('IMP97012_CELLLOCAL_PASS_NEEDS_INDEPENDENT_REVERIFY'),
    why: 'the cell-local swap makes the round-12 kmax=5 iterate interval-verify over the full [0,40] domain at 2a=1.00, but from a single in-pool run the certified reach stays 2a<=0.96 pending independent re-verification and the interpretive step to operator positivity -- RH open, NO QED.',
  },
];

for (const a of IMP97012_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97012 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
