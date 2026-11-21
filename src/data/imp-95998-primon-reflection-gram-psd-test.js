/**
 * @module imp-95998-primon-reflection-gram-psd-test
 * @fileoverview imp-95998 -- Novel route A (rh-novel-routes-roadmap-2026-09-23) first test:
 *   build the finite-prime primon REFLECTION Gram matrix under theta: s -> 1-s at the
 *   self-dual point sigma=1/2 and test whether it is PSD as the truncation N grows.
 *
 *   CONSTRUCTION (one concrete realization)
 *   ---------------------------------------
 *   Elementary primon amplitudes over the first N primes: f_i(s) = p_i^{-s}, i = 1..N.
 *   Sesquilinear Gaussian-regularized pairing along the critical line s = 1/2 + i t:
 *     <g, f> = (1/2pi) integral conj(g(1/2+it)) f(1/2+it) exp(-t^2 / (2 sig^2)) dt.
 *   Ordinary Gram (control)   M_ij = <f_i, f_j>       = (p_i p_j)^{-1/2} exp(-c a^2), a=log(p_i/p_j)
 *   Reflection Gram (test)    G_ij = <theta(f_i), f_j> = (p_i p_j)^{-1/2} exp(-c b^2), b=log(p_i)+log(p_j)
 *   with c = sig^2/2, theta the functional-equation reflection s -> 1-s. PSD of G is
 *   congruent (positive diagonal) to PSD of H_ij = exp(-2 c x_i x_j), x_i = log p_i; the
 *   kernel exp(-u v) has a sign-alternating Mercer expansion, so its positivity is the
 *   nontrivial go/no-go the roadmap asks for.
 *
 *   MEASURED RESULT (Jacobi eigensolver; tmp/imp-95998-scratch.mjs, 2026-09-23)
 *   --------------------------------------------------------------------------
 *   Control M is PSD at every N (lambda_min ~ 0 down to machine epsilon: a Gaussian kernel
 *   in log-primes). Reflection G is NOT PSD: lambda_min(G) < 0 already at the SMALLEST
 *   truncation N=4 and SATURATES to a stable negative floor as N grows -- it does not shrink
 *   toward 0. At window sig=1: lambda_min(G) = -6.1807e-3 (N=4) -> -6.2109e-3 (N>=8, flat to
 *   N=48), against lambda_max(G) ~ 0.2283. The negative eigenvalue is a fixed feature of the
 *   reflected coupling, not a truncation artifact that heals with N.
 *
 *   Window-width sensitivity at N=24: lambda_min(G) = -5.6e-2 (sig=0.25), -3.4e-2 (0.5),
 *   -6.2e-3 (1.0), -2.0e-5 (2.0), -7e-17 (4.0). PSD is recovered only in the degenerate
 *   large-window (sig >~ 4) diagonal-dominant limit, where the wide Gaussian sends c large and
 *   suppresses the off-diagonal reflected cross-couplings -- a trivial recovery, not OS positivity.
 *
 *   VERDICT: NO-GO for this concrete primon-Gram truncation. The naive reflection Gram is not
 *   reflection-positive at sigma=1/2 across all moderate regularization widths; the failure is
 *   present at N=4 and stable as N -> infinity.
 *
 *   SUB-GAP (honest scope)
 *   ----------------------
 *   imp-95998-osp-construction-dependence: this tests ONE concrete pairing (sesquilinear
 *   Gaussian-windowed critical-line pairing of elementary amplitudes f_i = p_i^{-s}). Route A's
 *   Osterwalder-Schrader program envisions the FULL primon transfer operator and the correct
 *   ANTILINEAR OS reflection (reflection + complex conjugation), which on the critical line can
 *   reduce to the trivially-positive form. A not-PSD result here refutes the naive amplitude-
 *   truncation Gram test but does NOT settle route A: the transfer-operator basis and the exact
 *   OS reflection functional remain untested. Measurement only; no bound; NO QED.
 *
 * @see rh-novel-routes-roadmap-2026-09-23.js (route A firstTest)
 * @see project_flow_blindness_and_T3_strip (soft-flow no-go context)
 *
 * Ticket: imp-95998 (numerical, medium). Measurement only; no bound moved; NO QED; no refereed bound is changed.
 */

// Reflection Gram lambda_min vs N at window sig=1 (measured, tmp/imp-95998-scratch.mjs).
const PSD_LADDER_SIG1 = Object.freeze([
  Object.freeze({ N: 4, lminControlM: 3.9589e-4, lminReflG: -6.1807e-3, lmaxReflG: 2.2828e-1, psdG: false }),
  Object.freeze({ N: 8, lminControlM: 3.5725e-9, lminReflG: -6.2108e-3, lmaxReflG: 2.2830e-1, psdG: false }),
  Object.freeze({ N: 12, lminControlM: 4.6289e-15, lminReflG: -6.2109e-3, lmaxReflG: 2.2830e-1, psdG: false }),
  Object.freeze({ N: 16, lminControlM: -6.5863e-18, lminReflG: -6.2109e-3, lmaxReflG: 2.2830e-1, psdG: false }),
  Object.freeze({ N: 20, lminControlM: -1.4249e-18, lminReflG: -6.2109e-3, lmaxReflG: 2.2830e-1, psdG: false }),
  Object.freeze({ N: 24, lminControlM: -1.3692e-17, lminReflG: -6.2109e-3, lmaxReflG: 2.2830e-1, psdG: false }),
  Object.freeze({ N: 28, lminControlM: -2.2816e-17, lminReflG: -6.2109e-3, lmaxReflG: 2.2830e-1, psdG: false }),
  Object.freeze({ N: 32, lminControlM: -3.2270e-17, lminReflG: -6.2109e-3, lmaxReflG: 2.2830e-1, psdG: false }),
  Object.freeze({ N: 40, lminControlM: -3.7699e-17, lminReflG: -6.2109e-3, lmaxReflG: 2.2830e-1, psdG: false }),
  Object.freeze({ N: 48, lminControlM: -4.2310e-17, lminReflG: -6.2109e-3, lmaxReflG: 2.2830e-1, psdG: false }),
]);

// Window-width sensitivity of lambda_min(G) at fixed N=24 (measured).
const SIG_SENSITIVITY_N24 = Object.freeze([
  Object.freeze({ sig: 0.25, lminReflG: -5.6302e-2, psdG: false }),
  Object.freeze({ sig: 0.5, lminReflG: -3.3691e-2, psdG: false }),
  Object.freeze({ sig: 1.0, lminReflG: -6.2109e-3, psdG: false }),
  Object.freeze({ sig: 2.0, lminReflG: -1.9795e-5, psdG: false }),
  Object.freeze({ sig: 4.0, lminReflG: -7.2328e-17, psdG: true }), // degenerate diagonal-dominant limit
]);

export const IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST = Object.freeze({
  id: 'imp-95998',
  proofSection: 'S-frontier',
  tests: 'rh-novel-routes-roadmap-2026-09-23 route A (Osterwalder-Schrader reflection positivity)',
  measuredAt: '2026-09-23',
  construction:
    'Elementary primon amplitudes f_i(s)=p_i^{-s} over the first N primes; sesquilinear ' +
    'Gaussian-windowed critical-line pairing at sigma=1/2; reflection theta: s -> 1-s giving ' +
    'G_ij = (p_i p_j)^{-1/2} exp(-c b^2), b = log(p_i)+log(p_j), c = sig^2/2.',
  psdLadderSig1: PSD_LADDER_SIG1,
  sigSensitivityN24: SIG_SENSITIVITY_N24,
  controlIsPSD: true,
  reflectionIsPSD: false,
  lminReflSaturationSig1: -6.2109e-3,
  negativityHealsWithN: false,
  goNoGo: 'NO-GO',
  verdict:
    'NO-GO for this concrete primon-Gram truncation. The reflection Gram G under theta: s -> 1-s ' +
    'at sigma=1/2 is NOT PSD: lambda_min(G) is negative already at the smallest truncation N=4 ' +
    'and saturates to a stable floor ~-6.2109e-3 (sig=1) as N grows to 48 -- it does not heal ' +
    'toward 0. The control Gram M is PSD at every N. PSD is recovered only in the degenerate ' +
    'large-window (sig >~ 4) diagonal-dominant limit where the reflected cross-couplings are ' +
    'suppressed, which is not OS positivity. Measurement only; no bound moved; NO QED. ' +
    'No refereed bound is changed.',
  subGap:
    'imp-95998-osp-construction-dependence: only ONE concrete pairing tested (Gaussian-windowed ' +
    'sesquilinear critical-line pairing of elementary amplitudes f_i = p_i^{-s}). Route A wants ' +
    'the full primon TRANSFER operator with the correct ANTILINEAR OS reflection; the not-PSD ' +
    'result here refutes the naive amplitude-truncation test but does not settle route A.',
  citation:
    'tmp/imp-95998-scratch.mjs (Jacobi eigensolver, first-N-primes reflection Gram, N in ' +
    '{4,8,12,16,20,24,28,32,40,48}, sig in {0.25,0.5,1,2,4}); ' +
    'rh-novel-routes-roadmap-2026-09-23.js route A firstTest.',
});

export default IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST;

// -- Tripwire assertions ------------------------------------------------------
export const IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST_ASSERTIONS = [
  {
    id: 'imp95998-reflection-gram-not-psd',
    why: 'The reflection Gram must be recorded as not-PSD at every N in the ladder (the measured go/no-go).',
    holds: () =>
      IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.reflectionIsPSD === false &&
      IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.goNoGo === 'NO-GO' &&
      IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.psdLadderSig1.every((r) => r.psdG === false && r.lminReflG < 0),
  },
  {
    id: 'imp95998-control-psd-and-saturation',
    why: 'Control Gram PSD (lambda_min ~ 0), and reflection lambda_min saturates to a stable negative floor that does not heal with N.',
    holds: () =>
      IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.controlIsPSD === true &&
      IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.negativityHealsWithN === false &&
      Math.abs(
        IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.psdLadderSig1.at(-1).lminReflG -
          IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.lminReflSaturationSig1,
      ) < 1e-6,
  },
  {
    id: 'imp95998-honesty-gate-no-qed',
    why: 'Measurement only: sub-gap named, NO QED, no-refereed-bound-change line present, route A recorded as tested.',
    holds: () =>
      /osp-construction-dependence/.test(IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.subGap) &&
      /NO QED/.test(IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.verdict) &&
      /refereed bound is changed/i.test(IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.verdict) &&
      /route A/.test(IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST.tests),
  },
];

for (const assertion of IMP95998_PRIMON_REFLECTION_GRAM_PSD_TEST_ASSERTIONS) {
  if (!assertion.holds()) {
    throw new Error(`imp-95998-primon-reflection-gram-psd-test assertion failed: ${assertion.id}`);
  }
}
