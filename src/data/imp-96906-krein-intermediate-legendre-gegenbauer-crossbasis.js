/**
 * @fileoverview imp-96906 -- MEASUREMENT: cross-basis numeric agreement of the Route I Krein
 * Rayleigh floor lambda_min(T_a[sigma_2]) at the INTERMEDIATE rungs 2a in {0.98, 1.00, 1.05}
 * between the imp-96835 Gegenbauer C_n^{13/2} condB=1 basis and an INDEPENDENT Legendre-basis
 * computation with an explicit (non-identity) Gram.
 *
 * CONTEXT. imp-96852 cross-validated the Krein Rayleigh floor at 2a=0.96 only (|G-L| <= 6.5e-6,
 * rel <= 3.2e-7) and a separate ticket covers the binding 2a=ln3 rung, but the intermediate rungs
 * 0.98/1.00/1.05 -- climbing from the certified-adjacent 0.96 toward the binding ln3=1.0986 plateau
 * -- were never compared as a basis-independence cross-check. The Rayleigh floor
 * min_x (x^T A x)/(x^T B x) over the degree-<N polynomial span is BASIS-INDEPENDENT: a Legendre
 * basis spans the SAME space, so eigh(A_leg, B_leg) MUST reproduce the Gegenbauer condB=1 floor up
 * to numerical conditioning. Any divergence would be a conditioning/resolution flag, not a genuine
 * spectral disagreement.
 *
 * METHOD (measurement only). Reuse the imp-96852 build()/lam_min() machinery VERBATIM for the
 * sigma_2 quadratic form A; only the trial basis and the Gram change. Gegenbauer path:
 * psi_n = C_n^{13/2}/norm, Gram B = a^{4m+1} I (condB=1). Legendre path: psi_n = plain P_n(y)
 * (un-normalized -> NON-diagonal, increasingly ill-conditioned Gram B = a^{4m+1} <P_i,P_j>_{(1-y^2)^{2m}}),
 * solved as a genuine generalized eigenproblem eigh(A_leg, B_leg). Both swept at 2a in
 * {0.98,1.00,1.05}, N in {52,76,100}, T in {3200,4800}. Driver:
 * tmp/imp-96906-intermediate-crossbasis.py (/tmp/rhvenv, scipy). Every literal below is a verbatim
 * copy from tmp/imp-96906-out.json.
 * NOTE the Rayleigh floor is an UPPER bound on the true infinite-dim lambda_min; agreement is a
 * basis-independence consistency check, NOT an operator positivity theorem; NO QED.
 *
 * FINDINGS (measured).
 *   1. THE TWO BASES AGREE TO THE EXPECTED DOUBLE-PRECISION FLOOR AT EVERY INTERMEDIATE RUNG. The
 *      per-rung absolute difference |Gegenbauer - Legendre| runs 3.366e-9 (2a=0.98,N=52,T=3200) ..
 *      5.106e-6 (2a=0.98,N=100,T=4800); relative difference 2.161e-9 .. 1.928e-6. No rung diverges:
 *      the independent Legendre-basis floor reproduces the Gegenbauer condB=1 floor to <=5.2e-6
 *      absolute everywhere, a clean basis-independence confirmation right across the intermediate band
 *      and fully consistent with the imp-96852 2a=0.96 result (<=6.5e-6).
 *   2. THE FLOOR DECREASES MONOTONICALLY AS 2a INCREASES, MATCHING imp-96835. The measured floor
 *      drops 13.39 (2a=0.98) -> 8.41 (2a=1.00) -> 2.18 (2a=1.05) at N=100,T=4800, extending the
 *      imp-96835 monotone-in-2a signature (0.96 largest, ln3 smallest) through the intermediate rungs.
 *      All floors stay strongly positive (>2), so the positivity reading is basis-robust across the band.
 *   3. THE DISAGREEMENT GROWS MONOTONICALLY WITH N -- A MILD CONDITIONING SIGNATURE, NOT A DIVERGENCE.
 *      At each (2a,T) the Legendre Gram condition number climbs 4.57e12 (N=52) -> 4.03e14 (N=76) ->
 *      1.13e16 (N=100), and |G-L| tracks it upward (e.g. 4.605e-8 -> 6.719e-7 -> 5.106e-6 at
 *      2a=0.98,T=4800). The Gegenbauer condB=1 Gram has none of this growth, so the diff is
 *      Cholesky-of-B round-off, not a spectral discrepancy. Even the worst rung (rel 1.928e-6) stays
 *      ~500x below the ~1e-3 floor-vs-plateau margin at 2a=ln3, so the reading is basis-robust.
 *
 * VERDICT. The intermediate-band Krein Rayleigh floors are CROSS-BASIS CONSISTENT: the Legendre-basis
 * floor reproduces the Gegenbauer condB=1 floor to <=5.1e-6 absolute (rel <=1.9e-6) at every
 * (2a,N,T) in {0.98,1.00,1.05} x {52,76,100} x {3200,4800}, with the same mild N-monotone conditioning
 * growth attributable to the non-diagonal Legendre Gram that imp-96852 saw at 2a=0.96. The floors
 * across the whole 0.96 <= 2a <= 1.05 band are therefore genuinely basis-independent, not Gegenbauer
 * artifacts. Measurement / cross-validation only; the floor stays a Rayleigh UPPER bound; no operator
 * positivity; the uniform-in-N spectral gap (imp-96749 IMP96749_UNIFORM_N_GAP_UNSETTLED) stays the open
 * obstruction; interval-rigorous certificate reach stays 2a <= 0.96; RH open; no refereed bound is changed
 * ; NO QED.
 *
 * @see imp-96852-krein-096-legendre-gegenbauer-crossbasis.js (the 2a=0.96 cross-basis check this extends)
 * @see imp-96835-krein-2a-monotonicity-cross-check.js (Gegenbauer condB=1 monotone-in-2a floor table)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (the binding 2a=ln3 plateau ~0.579)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED open obstruction)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0)
 */

export const IMP96906_TWO_A = Object.freeze([0.98, 1.0, 1.05]);
export const IMP96906_NS = Object.freeze([52, 76, 100]);
export const IMP96906_TS = Object.freeze([3200, 4800]);

// per-rung cross-basis table at the intermediate 2a (verbatim from tmp/imp-96906-out.json).
// gegen = Gegenbauer condB=1 in-run recompute; leg = independent Legendre explicit-Gram floor;
// absDiff = |gegen - leg|; relDiff = absDiff/|gegen|; condBleg = cond(B_leg) (Legendre Gram).
export const IMP96906_CROSSBASIS = Object.freeze([
  Object.freeze({ twoA: 0.98, T: 3200, N: 52, gegen: 13.387765, leg: 13.387765, absDiff: 3.366e-9, relDiff: 2.514e-10, condBleg: 4.566e12 }),
  Object.freeze({ twoA: 0.98, T: 3200, N: 76, gegen: 13.290788, leg: 13.290788, absDiff: 7.663e-8, relDiff: 5.766e-9, condBleg: 4.03e14 }),
  Object.freeze({ twoA: 0.98, T: 3200, N: 100, gegen: 13.222837, leg: 13.222837, absDiff: 6.773e-7, relDiff: 5.122e-8, condBleg: 1.127e16 }),
  Object.freeze({ twoA: 0.98, T: 4800, N: 52, gegen: 13.392193, leg: 13.392193, absDiff: 4.605e-8, relDiff: 3.439e-9, condBleg: 4.566e12 }),
  Object.freeze({ twoA: 0.98, T: 4800, N: 76, gegen: 13.305627, leg: 13.305626, absDiff: 6.719e-7, relDiff: 5.05e-8, condBleg: 4.03e14 }),
  Object.freeze({ twoA: 0.98, T: 4800, N: 100, gegen: 13.25977, leg: 13.259765, absDiff: 5.106e-6, relDiff: 3.851e-7, condBleg: 1.127e16 }),
  Object.freeze({ twoA: 1.0, T: 3200, N: 52, gegen: 8.506463, leg: 8.506463, absDiff: 6.53e-9, relDiff: 7.676e-10, condBleg: 4.565e12 }),
  Object.freeze({ twoA: 1.0, T: 3200, N: 76, gegen: 8.435387, leg: 8.435387, absDiff: 1.298e-7, relDiff: 1.539e-8, condBleg: 4.022e14 }),
  Object.freeze({ twoA: 1.0, T: 3200, N: 100, gegen: 8.386345, leg: 8.386344, absDiff: 9.406e-7, relDiff: 1.122e-7, condBleg: 1.149e16 }),
  Object.freeze({ twoA: 1.0, T: 4800, N: 52, gegen: 8.50938, leg: 8.50938, absDiff: 2.439e-8, relDiff: 2.867e-9, condBleg: 4.565e12 }),
  Object.freeze({ twoA: 1.0, T: 4800, N: 76, gegen: 8.445334, leg: 8.445334, absDiff: 4.046e-7, relDiff: 4.791e-8, condBleg: 4.022e14 }),
  Object.freeze({ twoA: 1.0, T: 4800, N: 100, gegen: 8.411471, leg: 8.411468, absDiff: 3.464e-6, relDiff: 4.118e-7, condBleg: 1.149e16 }),
  Object.freeze({ twoA: 1.05, T: 3200, N: 52, gegen: 2.213381, leg: 2.213381, absDiff: 5.059e-9, relDiff: 2.286e-9, condBleg: 4.566e12 }),
  Object.freeze({ twoA: 1.05, T: 3200, N: 76, gegen: 2.189738, leg: 2.189738, absDiff: 1.577e-7, relDiff: 7.202e-8, condBleg: 4.025e14 }),
  Object.freeze({ twoA: 1.05, T: 3200, N: 100, gegen: 2.173701, leg: 2.173703, absDiff: 1.799e-6, relDiff: 8.278e-7, condBleg: 1.153e16 }),
  Object.freeze({ twoA: 1.05, T: 4800, N: 52, gegen: 2.214269, leg: 2.214269, absDiff: 4.785e-9, relDiff: 2.161e-9, condBleg: 4.566e12 }),
  Object.freeze({ twoA: 1.05, T: 4800, N: 76, gegen: 2.192704, leg: 2.192704, absDiff: 4.562e-7, relDiff: 2.081e-7, condBleg: 4.025e14 }),
  Object.freeze({ twoA: 1.05, T: 4800, N: 100, gegen: 2.181173, leg: 2.181169, absDiff: 4.205e-6, relDiff: 1.928e-6, condBleg: 1.153e16 }),
]);

// headline: worst-case absolute / relative cross-basis disagreement across all intermediate rungs
export const IMP96906_MAX_ABS_DIFF = 5.106e-6;
export const IMP96906_MAX_REL_DIFF = 1.928e-6;

export const IMP96906_VERDICT = Object.freeze({
  ticket: 'imp-96906',
  question:
    'do the imp-96835 Gegenbauer condB=1 basis and an independent Legendre explicit-Gram basis give the SAME Krein Rayleigh floor lambda_min(T_a[sigma_2]) at the intermediate rungs 2a in {0.98,1.00,1.05} across (N,T), filling the gap between imp-96852 (2a=0.96) and the ticketed 2a=ln3 check?',
  answer:
    'yes: the Legendre-basis floor reproduces the Gegenbauer condB=1 floor to <=5.1e-6 absolute (rel <=1.9e-6) at every (2a,N,T), the floor decreases monotonically as 2a increases (13.4 -> 8.4 -> 2.2, extending the imp-96835 signature), and the diff grows monotonically with N tracking the Legendre Gram cond(B) climb 4.57e12 -> 1.13e16 -- a mild conditioning fingerprint, not a spectral divergence, fully consistent with the imp-96852 2a=0.96 result',
  basisA: 'Gegenbauer C_n^{13/2}, Gram B = a^{4m+1} I, condB=1',
  basisB: 'Legendre P_n, explicit non-diagonal Gram B = a^{4m+1} <P_i,P_j>_{(1-y^2)^{2m}}',
  maxAbsDiff: 5.106e-6,
  maxRelDiff: 1.928e-6,
  floorDecreasesWith2a: true, // 13.4 (0.98) -> 8.4 (1.00) -> 2.2 (1.05), extends imp-96835
  basisIndependenceConfirmed: true, // agreement at the expected double-precision floor
  diffMonotoneInN: true, // |G-L| increases with N -> Legendre-Gram conditioning, not divergence
  consistentWithImp96852: true, // <=5.1e-6 here vs <=6.5e-6 at 2a=0.96, same conditioning signature
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
const IMP96906_ASSERTIONS = [
  {
    id: 'imp96906-bases-agree-to-precision',
    holds: () =>
      IMP96906_CROSSBASIS.every((r) => r.absDiff < 1e-5 && r.relDiff < 1e-5),
    why: 'the independent Legendre-basis floor must reproduce the Gegenbauer condB=1 floor to <1e-5 absolute and <1e-5 relative at every (2a,N,T) -- a genuine basis-independence confirmation across the intermediate band.',
  },
  {
    id: 'imp96906-diff-monotone-in-N',
    holds: () =>
      IMP96906_TWO_A.every((ta) =>
        IMP96906_TS.every((T) => {
          const rows = IMP96906_CROSSBASIS.filter((r) => r.twoA === ta && r.T === T).sort((a, b) => a.N - b.N);
          for (let i = 0; i < rows.length - 1; i++) {
            if (!(rows[i].absDiff < rows[i + 1].absDiff)) return false;
          }
          return true;
        }),
      ),
    why: 'the cross-basis disagreement must grow monotonically with N at each (2a,T) -- the fingerprint of the non-diagonal Legendre Gram becoming more ill-conditioned, confirming the diff is conditioning round-off not a spectral divergence.',
  },
  {
    id: 'imp96906-floor-decreases-with-2a',
    holds: () =>
      IMP96906_TS.every((T) =>
        IMP96906_NS.every((N) => {
          const rows = IMP96906_TWO_A.map((ta) => IMP96906_CROSSBASIS.find((r) => r.twoA === ta && r.T === T && r.N === N).gegen);
          for (let i = 0; i < rows.length - 1; i++) {
            if (!(rows[i] > rows[i + 1])) return false;
          }
          return true;
        }),
      ),
    why: 'the floor must decrease as 2a increases (0.98 > 1.00 > 1.05) at each (N,T), extending the imp-96835 monotone-in-2a signature through the intermediate rungs.',
  },
  {
    id: 'imp96906-floor-positive-both-bases',
    holds: () =>
      IMP96906_CROSSBASIS.every((r) => r.gegen > 2 && r.leg > 2),
    why: 'both bases must report a strongly-positive floor (>2) at every intermediate rung, so the positivity reading is basis-robust across the 0.98..1.05 band.',
  },
  {
    id: 'imp96906-measurement-only-no-qed',
    holds: () =>
      IMP96906_VERDICT.rayleighFloorIsUpperBound === true &&
      IMP96906_VERDICT.operatorPositivityProved === false &&
      IMP96906_VERDICT.uniformNGapSettled === false &&
      IMP96906_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96906_VERDICT.qed === false,
    why: 'measurement only: the floor is an UPPER bound, no operator positivity is proved, the uniform-in-N gap stays unsettled, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96906_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96906-krein-intermediate-legendre-gegenbauer-crossbasis assertion failed: ${a.id}`);
  }
}
