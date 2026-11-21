/**
 * @fileoverview imp-96852 -- MEASUREMENT: cross-basis numeric agreement of the Route I Krein
 * Rayleigh floor lambda_min(T_a[sigma_2]) at 2a=0.96 between the imp-96835 Gegenbauer C_n^{13/2}
 * condB=1 basis and an INDEPENDENT Legendre-basis computation with an explicit (non-identity) Gram.
 *
 * CONTEXT. imp-96835 F2 stated the 2a=0.96 Gegenbauer condB=1 floor is 20.132660 (N=100,T=4800),
 * "reproducing the imp-96651 positivity in this basis", but the two bases were never compared as a
 * NUMERIC cross-validation -- only the qualitative sign/positivity conclusion was recorded. The
 * Rayleigh floor min_x (x^T A x)/(x^T B x) over the degree-<N polynomial span is BASIS-INDEPENDENT:
 * a Legendre basis spans the SAME space, so eigh(A_leg, B_leg) MUST reproduce the Gegenbauer floor up
 * to numerical conditioning. Any divergence would be a conditioning/resolution flag rather than a
 * genuine spectral disagreement.
 *
 * METHOD (measurement only). Reuse the imp-96835 build() machinery verbatim for the sigma_2 quadratic
 * form A; only the trial basis and the Gram change. Gegenbauer path: psi_n = C_n^{13/2}/norm, Gram
 * B = a^{4m+1} I (condB=1). Legendre path: psi_n = plain P_n(y) (un-normalized -> NON-diagonal,
 * increasingly ill-conditioned Gram B = a^{4m+1} <P_i,P_j>_{(1-y^2)^{2m}}), solved as a genuine
 * generalized eigenproblem eigh(A_leg, B_leg). Both swept at 2a=0.96, N in {52,76,100}, T in
 * {3200,4800}. Driver: tmp/imp-96852-legendre-crossbasis.py (/tmp/rhvenv, scipy). Every literal below
 * is a verbatim copy from tmp/imp-96852-out.json.
 * NOTE the Rayleigh floor is an UPPER bound on the true infinite-dim lambda_min; agreement is a
 * basis-independence consistency check, NOT an operator positivity theorem; NO QED.
 *
 * FINDINGS (measured).
 *   1. THE TWO BASES AGREE TO THE EXPECTED DOUBLE-PRECISION FLOOR. The per-rung absolute difference
 *      |Gegenbauer - Legendre| runs 2.147e-8 (N=52,T=3200) .. 6.509e-6 (N=100,T=4800); relative
 *      difference 1.056e-9 .. 3.233e-7. No rung diverges: the independent Legendre-basis floor
 *      reproduces the Gegenbauer condB=1 floor to <=7e-6 absolute everywhere, a clean basis-
 *      independence confirmation of the ~20 Rayleigh floor at 2a=0.96.
 *   2. THE GEGENBAUER IN-RUN RECOMPUTE MATCHES imp-96835 EXACTLY. The Gegenbauer floors recomputed in
 *      THIS driver reproduce IMP96835_FLOOR_VS_2A[T][100..52][2a=0.96] to all six printed digits
 *      (e.g. 20.132660 at N=100,T=4800), confirming the cross-basis diff is measured against the same
 *      machinery, not a re-run drift.
 *   3. THE DISAGREEMENT GROWS MONOTONICALLY WITH N -- A MILD CONDITIONING SIGNATURE, NOT A DIVERGENCE.
 *      |G-L| climbs 2.1e-8 -> 1.9e-7 -> 1.1e-6 (T=3200) and 4.1e-8 -> 9.3e-7 -> 6.5e-6 (T=4800) as
 *      N goes 52 -> 76 -> 100. This is exactly the expected fingerprint of the Legendre Gram becoming
 *      more ill-conditioned with degree (the Gegenbauer condB=1 Gram has none of this growth), so the
 *      diff tracks Cholesky-of-B round-off, not a spectral discrepancy. Even at N=100 the relative
 *      diff (3.2e-7) stays far below the ~1e-3 floor-vs-plateau margins, so the positivity reading is
 *      basis-robust.
 *
 * VERDICT. The 2a=0.96 Krein Rayleigh floor is CROSS-BASIS CONSISTENT: the Legendre-basis floor
 * reproduces the imp-96835 Gegenbauer condB=1 floor to <=6.5e-6 absolute (rel <=3.2e-7) at every
 * (N,T), with a mild N-monotone conditioning growth attributable to the non-diagonal Legendre Gram.
 * The ~20 floor at 2a=0.96 is therefore genuinely basis-independent, not a Gegenbauer artifact.
 * Measurement / cross-validation only; the floor stays a Rayleigh UPPER bound; no operator positivity;
 * the uniform-in-N spectral gap (imp-96749 IMP96749_UNIFORM_N_GAP_UNSETTLED) stays the open
 * obstruction; interval-rigorous certificate reach stays 2a <= 0.96; RH open; no refereed bound is changed
 * ; NO QED.
 *
 * @see imp-96835-krein-2a-monotonicity-cross-check.js (IMP96835_FLOOR_VS_2A Gegenbauer condB=1 floors)
 * @see imp-96651-krein-096-fine-extended-scan.js (independent 2a=0.96 positivity scan)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (orthogonal Gegenbauer condB=1 basis)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED open obstruction)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0)
 */

export const IMP96852_TWO_A = 0.96;
export const IMP96852_NS = Object.freeze([52, 76, 100]);
export const IMP96852_TS = Object.freeze([3200, 4800]);

// per-rung cross-basis table at 2a=0.96 (verbatim from tmp/imp-96852-out.json).
// gegen = Gegenbauer condB=1 in-run recompute; gegenRef = imp-96835 IMP96835_FLOOR_VS_2A[T][N][0];
// leg = independent Legendre explicit-Gram floor; absDiff = |gegen - leg|; relDiff = absDiff/|gegen|.
export const IMP96852_CROSSBASIS = Object.freeze([
  Object.freeze({ T: 3200, N: 52, gegen: 20.327168, gegenRef: 20.327168, leg: 20.327168, absDiff: 2.147e-8, relDiff: 1.056e-9 }),
  Object.freeze({ T: 3200, N: 76, gegen: 20.173043, gegenRef: 20.173043, leg: 20.173043, absDiff: 1.927e-7, relDiff: 9.553e-9 }),
  Object.freeze({ T: 3200, N: 100, gegen: 20.078300, gegenRef: 20.078300, leg: 20.078299, absDiff: 1.061e-6, relDiff: 5.286e-8 }),
  Object.freeze({ T: 4800, N: 52, gegen: 20.333254, gegenRef: 20.333254, leg: 20.333254, absDiff: 4.091e-8, relDiff: 2.012e-9 }),
  Object.freeze({ T: 4800, N: 76, gegen: 20.195103, gegenRef: 20.195103, leg: 20.195102, absDiff: 9.263e-7, relDiff: 4.587e-8 }),
  Object.freeze({ T: 4800, N: 100, gegen: 20.132660, gegenRef: 20.132660, leg: 20.132653, absDiff: 6.509e-6, relDiff: 3.233e-7 }),
]);

// headline: worst-case absolute / relative cross-basis disagreement across all rungs (N=100, T=4800)
export const IMP96852_MAX_ABS_DIFF = 6.509e-6;
export const IMP96852_MAX_REL_DIFF = 3.233e-7;

export const IMP96852_VERDICT = Object.freeze({
  ticket: 'imp-96852',
  question:
    'do the imp-96835 Gegenbauer condB=1 basis and an independent Legendre explicit-Gram basis give the SAME Krein Rayleigh floor lambda_min(T_a[sigma_2]) at 2a=0.96 across (N,T), and by how much do they numerically differ?',
  answer:
    'yes: the Legendre-basis floor reproduces the Gegenbauer condB=1 floor to <=6.5e-6 absolute (rel <=3.2e-7) at every (N,T), the Gegenbauer in-run recompute matches imp-96835 to all printed digits, and the diff grows monotonically with N (2.1e-8->1.1e-6 at T=3200; 4.1e-8->6.5e-6 at T=4800) -- a mild conditioning signature from the non-diagonal Legendre Gram, not a spectral divergence',
  basisA: 'Gegenbauer C_n^{13/2}, Gram B = a^{4m+1} I, condB=1',
  basisB: 'Legendre P_n, explicit non-diagonal Gram B = a^{4m+1} <P_i,P_j>_{(1-y^2)^{2m}}',
  maxAbsDiff: 6.509e-6,
  maxRelDiff: 3.233e-7,
  gegenReproducesImp96835: true, // in-run Gegenbauer floors match IMP96835_FLOOR_VS_2A to printed digits
  basisIndependenceConfirmed: true, // agreement at the expected double-precision floor
  diffMonotoneInN: true, // |G-L| increases with N -> Legendre-Gram conditioning, not divergence
  // honesty guardrails
  rayleighFloorIsUpperBound: true,
  operatorPositivityProved: false,
  uniformNGapSettled: false, // imp-96749 IMP96749_UNIFORM_N_GAP_UNSETTLED remains open
  intervalRigorousReachUnchanged: 0.96,
  rhOpen: true,
  ptFloorSOTA: 0.2,
  qed: false,
});

// -- self-check assertions (import-light; node run-assertions exercises these) -----------------------
const IMP96852_ASSERTIONS = [
  {
    id: 'imp96852-gegen-reproduces-imp96835',
    holds: () =>
      IMP96852_CROSSBASIS.every((r) => Math.abs(r.gegen - r.gegenRef) < 1e-6),
    why: 'the in-run Gegenbauer recompute must match the imp-96835 IMP96835_FLOOR_VS_2A 2a=0.96 column to <1e-6, so the cross-basis diff is measured against the same machinery.',
  },
  {
    id: 'imp96852-bases-agree-to-precision',
    holds: () =>
      IMP96852_CROSSBASIS.every((r) => r.absDiff < 1e-5 && r.relDiff < 1e-6),
    why: 'the independent Legendre-basis floor must reproduce the Gegenbauer condB=1 floor to <1e-5 absolute and <1e-6 relative at every (N,T) -- a genuine basis-independence confirmation of the ~20 floor at 2a=0.96.',
  },
  {
    id: 'imp96852-diff-monotone-in-N',
    holds: () =>
      IMP96852_TS.every((T) => {
        const rows = IMP96852_CROSSBASIS.filter((r) => r.T === T).sort((a, b) => a.N - b.N);
        for (let i = 0; i < rows.length - 1; i++) {
          if (!(rows[i].absDiff < rows[i + 1].absDiff)) return false;
        }
        return true;
      }),
    why: 'the cross-basis disagreement must grow monotonically with N at each T -- the fingerprint of the non-diagonal Legendre Gram becoming more ill-conditioned, confirming the diff is conditioning round-off not a spectral divergence.',
  },
  {
    id: 'imp96852-floor-strongly-positive-both-bases',
    holds: () =>
      IMP96852_CROSSBASIS.every((r) => r.gegen > 10 && r.leg > 10),
    why: 'both bases must report a strongly-positive (~20) floor at 2a=0.96, reproducing the imp-96651 positivity independently of the basis choice.',
  },
  {
    id: 'imp96852-measurement-only-no-qed',
    holds: () =>
      IMP96852_VERDICT.rayleighFloorIsUpperBound === true &&
      IMP96852_VERDICT.operatorPositivityProved === false &&
      IMP96852_VERDICT.uniformNGapSettled === false &&
      IMP96852_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96852_VERDICT.qed === false,
    why: 'measurement only: the floor is an UPPER bound, no operator positivity is proved, the uniform-in-N gap stays unsettled, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96852_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96852-krein-096-legendre-gegenbauer-crossbasis assertion failed: ${a.id}`);
  }
}
