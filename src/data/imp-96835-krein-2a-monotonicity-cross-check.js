/**
 * @fileoverview imp-96835 -- MEASUREMENT: cross-check that the imp-96806 condB=1 Gegenbauer Krein
 * Rayleigh floor lambda_min(T_a[sigma_2]) is monotone-INCREASING as 2a DECREASES from ln3 to 0.96,
 * confirming the 2a=ln3 plateau ~0.579 is the SMALLEST value across the certified-adjacent window
 * 0.96 <= 2a <= ln3.
 *
 * CONTEXT. imp-96806 pinned only the 2a=ln3 (largest / binding) plateau at ~0.579 in the
 * well-conditioned (condB=1) Gegenbauer basis; imp-96651 independently re-confirmed positivity at
 * 2a=0.96 via a different (Legendre) scan. A direct monotonicity-in-2a cross-check WITHIN the same
 * t-converged Gegenbauer machinery -- tabulating the floor across 0.96 < 2a < ln3 -- was never done.
 *
 * METHOD (measurement only). Reuse the imp-96806 driver verbatim (Gegenbauer C_n^{13/2} basis, Gram
 * B = a^{4m+1} I so condB=1 for all N, Rayleigh floor basis-independent). Sweep 2a in {0.96, 1.00,
 * 1.05, ln3} at N in {52,76,100}, T-truncation T in {3200,4800}, and read the floor-vs-2a table.
 * Driver: tmp/imp-96835-2a-monotonicity.py (/tmp/rhvenv, scipy, numpy). Every literal below is a
 * verbatim copy from tmp/imp-96835-out.json.
 * NOTE the Rayleigh floor is an UPPER bound on the true infinite-dim lambda_min; a positive floor is
 * NECESSARY-consistency, NOT an operator positivity theorem; NO QED.
 *
 * FINDINGS (measured).
 *   1. THE FLOOR IS STRICTLY MONOTONE-INCREASING AS 2a DECREASES, ACROSS EVERY (N, T). At N=100,
 *      T=4800 the floor descends 20.132660 (2a=0.96) -> 8.411471 (2a=1.00) -> 2.181170 (2a=1.05) ->
 *      0.579988 (2a=ln3) as 2a increases; identical strict ordering holds at N=52,76 and at T=3200.
 *      So the 2a=ln3 value ~0.579 is the SMALLEST across the whole 0.96 <= 2a <= ln3 band -- positivity
 *      at ln3 (the binding rung) would dominate the entire certified-adjacent window.
 *   2. THE 2a=0.96 FLOOR IS ~20, STRONGLY POSITIVE, REPRODUCING imp-96651 IN THIS BASIS. At N=100,
 *      T=4800 the 2a=0.96 floor is 20.132660 -- ~34.7x the ln3 plateau -- confirming the imp-96651
 *      2a=0.96 positivity scan inside the SAME condB=1 Gegenbauer machinery (different basis, same
 *      sign/positivity conclusion).
 *   3. THE ln3 ANCHOR REPRODUCES imp-96806 EXACTLY. The 2a=ln3 floors (T=3200: 0.585194/0.581260/
 *      0.578956 at N=52/76/100; T=4800: 0.585319/0.581679/0.579988) match imp-96806 IMP96806_TSWEEP_LN3
 *      to all printed digits, so this sweep is a consistent extension of that machinery, not a new run.
 *
 * VERDICT. The floor-vs-2a monotonicity is CONFIRMED: lambda_min(T_a[sigma_2]) increases monotonically
 * as 2a decreases from ln3 to 0.96 (strictly, at every tested N and T), so the imp-96806 2a=ln3 plateau
 * ~0.579 is the smallest floor in the window and the imp-96651 2a=0.96 positivity is reproduced (~20)
 * in the condB=1 basis. This is CONSISTENT with positivity dominating the whole 0.96 < 2a < ln3 band
 * but does NOT establish it: the Rayleigh floor is an UPPER bound and the uniform-in-N spectral gap
 * (imp-96749 IMP96749_UNIFORM_N_GAP_UNSETTLED) stays the open obstruction. Measurement only; operator
 * positivity for 0.96 < 2a < ln3 stays OPEN; interval-rigorous certificate reach stays 2a <= 0.96; RH
 * open; no refereed bound is changed; NO QED.
 *
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (2a=ln3 t-converged plateau ~0.579; IMP96806_TSWEEP_LN3)
 * @see imp-96651-krein-096-fine-extended-scan.js (independent 2a=0.96 positivity scan)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (orthogonal Gegenbauer condB=1 basis)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED open obstruction)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// 2a rungs swept across the certified-adjacent window (0.96 = imp-96651 anchor .. ln3 = binding rung)
export const IMP96835_TWO_A = Object.freeze([0.96, 1.0, 1.05, LN3]);
export const IMP96835_TWO_A_LABELS = Object.freeze(['0.96', '1.00', '1.05', 'ln3']);
export const IMP96835_NS = Object.freeze([52, 76, 100]);
export const IMP96835_TS = Object.freeze([3200, 4800]);

// floor lambda_min(T_a[sigma_2]) vs 2a, Gegenbauer condB=1 basis (verbatim from tmp/imp-96835-out.json).
// Keyed by T, then N; each row is [floor@2a=0.96, floor@2a=1.00, floor@2a=1.05, floor@2a=ln3].
export const IMP96835_FLOOR_VS_2A = Object.freeze({
  3200: Object.freeze({
    52: Object.freeze([20.327168, 8.506463, 2.213381, 0.585194]),
    76: Object.freeze([20.173043, 8.435387, 2.189739, 0.581260]),
    100: Object.freeze([20.078300, 8.386345, 2.173703, 0.578956]),
  }),
  4800: Object.freeze({
    52: Object.freeze([20.333254, 8.509380, 2.214269, 0.585319]),
    76: Object.freeze([20.195103, 8.445334, 2.192704, 0.581679]),
    100: Object.freeze([20.132660, 8.411471, 2.181170, 0.579988]),
  }),
});

// headline bridge (N=100, T=4800): 2a=0.96 floor vs the 2a=ln3 plateau
export const IMP96835_FLOOR_096_N100_T4800 = 20.132660; // strongly positive, ~34.7x the ln3 plateau
export const IMP96835_FLOOR_LN3_N100_T4800 = 0.579988; // matches imp-96806 IMP96806_T4800_FLOOR
export const IMP96835_096_TO_LN3_RATIO = 34.7; // floor@0.96 / floor@ln3 at N=100, T=4800

export const IMP96835_VERDICT = Object.freeze({
  ticket: 'imp-96835',
  question:
    'within the same condB=1 Gegenbauer machinery, is the Krein Rayleigh floor lambda_min(T_a[sigma_2]) monotone-increasing as 2a decreases from ln3 to 0.96, so the 2a=ln3 plateau ~0.579 is the smallest in the window, and is the imp-96651 2a=0.96 positivity reproduced?',
  answer:
    'yes on both: the floor strictly increases as 2a decreases at every tested (N,T) -- at N=100,T=4800 it runs 0.579988 (ln3) -> 2.181170 (1.05) -> 8.411471 (1.00) -> 20.132660 (0.96) -- so 2a=ln3 is the smallest floor across 0.96<=2a<=ln3, and the 2a=0.96 floor ~20 reproduces the imp-96651 positivity in this basis; the ln3 anchors match imp-96806 to all printed digits',
  basis: 'Gegenbauer C_n^{13/2}, Gram B = a^{4m+1} I, condB=1',
  monotoneIncreasingAs2aDecreases: true, // strict, all N in {52,76,100} and T in {3200,4800}
  ln3IsSmallestInWindow: true,
  floor096N100T4800: 20.132660,
  floorLn3N100T4800: 0.579988,
  ratio096ToLn3: 34.7,
  imp96651PositivityReproduced: true, // 2a=0.96 floor strongly positive (~20) in the condB=1 basis
  imp96806Ln3AnchorMatches: true, // ln3 floors identical to IMP96806_TSWEEP_LN3 to printed digits
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
const IMP96835_ASSERTIONS = [
  {
    id: 'imp96835-strict-monotone-in-2a',
    holds: () =>
      IMP96835_TS.every((T) =>
        IMP96835_NS.every((N) => {
          const row = IMP96835_FLOOR_VS_2A[T][N];
          // floor must strictly DECREASE as 2a increases (i.e. increase as 2a decreases)
          for (let i = 0; i < row.length - 1; i++) {
            if (!(row[i] > row[i + 1])) return false;
          }
          return true;
        })
      ),
    why: 'the condB=1 Gegenbauer floor must strictly increase as 2a decreases (0.96 largest, ln3 smallest) at every tested N and T -- the monotonicity cross-check.',
  },
  {
    id: 'imp96835-ln3-smallest-in-window',
    holds: () =>
      IMP96835_TS.every((T) =>
        IMP96835_NS.every((N) => {
          const row = IMP96835_FLOOR_VS_2A[T][N];
          const ln3Val = row[row.length - 1];
          return row.slice(0, -1).every((v) => v > ln3Val);
        })
      ),
    why: 'the 2a=ln3 floor must be the smallest entry in every row, so positivity at the binding ln3 rung would dominate the whole 0.96<=2a<=ln3 band.',
  },
  {
    id: 'imp96835-096-strongly-positive',
    holds: () => IMP96835_FLOOR_096_N100_T4800 > 10 && IMP96835_096_TO_LN3_RATIO > 10,
    why: 'the 2a=0.96 floor (~20, N=100,T=4800) must be strongly positive and >>x the ln3 plateau, reproducing the imp-96651 2a=0.96 positivity in the condB=1 basis.',
  },
  {
    id: 'imp96835-ln3-anchor-matches-imp96806',
    holds: () => {
      // ln3, N=100 anchors must match imp-96806 IMP96806_TSWEEP_LN3 (T=3200:0.578956, T=4800:0.579988)
      return (
        Math.abs(IMP96835_FLOOR_VS_2A[3200][100][3] - 0.578956) < 1e-6 &&
        Math.abs(IMP96835_FLOOR_VS_2A[4800][100][3] - 0.579988) < 1e-6
      );
    },
    why: 'the 2a=ln3, N=100 floors must reproduce imp-96806 IMP96806_TSWEEP_LN3 to <1e-6, confirming this sweep is a consistent extension of the same machinery.',
  },
  {
    id: 'imp96835-measurement-only-no-qed',
    holds: () =>
      IMP96835_VERDICT.rayleighFloorIsUpperBound === true &&
      IMP96835_VERDICT.operatorPositivityProved === false &&
      IMP96835_VERDICT.uniformNGapSettled === false &&
      IMP96835_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96835_VERDICT.qed === false,
    why: 'measurement only: the floor is an UPPER bound, no operator positivity is proved, the uniform-in-N gap stays unsettled, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96835_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96835-krein-2a-monotonicity-cross-check assertion failed: ${a.id}`);
  }
}

void LN3;
