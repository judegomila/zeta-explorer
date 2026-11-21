/**
 * @fileoverview imp-96806 -- MEASUREMENT: pin the t-converged plateau of the Route I Krein Rayleigh
 * floor lambda_min(T_a[sigma_2]) at 2a=ln3 by sweeping the t-truncation T from 800 to 4800 in the
 * well-conditioned (condB=1) orthogonal Gegenbauer basis, resolving the imp-96772 SUB-GAP
 * IMP96772_ENTRY_PRECISION_AND_TCONV.
 *
 * CONTEXT. imp-96772 recomputed the Legendre-Galerkin floor in extended precision (mp.dps=40) but
 * upgraded only the linear-algebra SOLVE, keeping the matrix ENTRIES double precision at a FIXED
 * t-truncation T=800, so the true t-converged plateau stayed unpinned (0.533846 at N=100 for 2a=ln3).
 * Its sub-gap IMP96772_ENTRY_PRECISION_AND_TCONV named (a) a full extended-precision entry rebuild and
 * (b) t-convergence to T>=3200 as the residual needed to pin the plateau VALUE itself.
 *
 * METHOD (measurement only). Two observations collapse the sub-gap:
 *   (1) The Rayleigh floor is BASIS-INDEPENDENT (same pole-free trial subspace); imp-96768 realises it
 *       in the Gegenbauer C_n^{13/2} basis whose Gram B = a^{4m+1} I EXACTLY, so condB=1 for all N and
 *       there is NO near-singular Cholesky reduction to amplify the ~1e-16 double-precision entries.
 *       Extended-precision ENTRIES are therefore unnecessary IN THIS BASIS -- confirmed here by a
 *       finer-t-quadrature entry recompute (the entries are quadrature-converged, not precision-capped).
 *   (2) The remaining freedom is the t-truncation T. We sweep T in {800,1600,3200,4800} at 2a=ln3 and
 *       watch the N=52,76,100 floors climb OFF their T=800 values toward a T-converged plateau.
 * Driver: tmp/imp-96806-tconv-plateau.py (/tmp/rhvenv, scipy 1.18, numpy). Every literal below is a
 * verbatim copy from the run log / tmp/imp-96806-out.json.
 * NOTE the Rayleigh floor is an UPPER bound on the true infinite-dim lambda_min; establishes NO
 * operator positivity theorem; NO QED.
 *
 * FINDINGS (measured).
 *   1. THE FIXED-T=800 FLOOR IS T-TRUNCATION-LIMITED; T>=3200 PINS THE PLATEAU AT ~0.579. At N=100 the
 *      2a=ln3 floor climbs 0.533846 (T=800) -> 0.570764 (T=1600) -> 0.578956 (T=3200) -> 0.579988
 *      (T=4800): the entire ~0.045 descent below the 0.55-0.57 band at fixed T=800 was a t-truncation
 *      artifact. The T=3200 value 0.578956 reproduces the imp-96768 t-converged estimate ~0.579, and
 *      the T=3200->4800 increment has shrunk to +1.0e-3, so T>=3200 pins the plateau to ~1e-3.
 *   2. THE PLATEAU IS N-STABLE ACROSS THE TESTED REACH. At T=4800 the floor is 0.585319 (N=52),
 *      0.581679 (N=76), 0.579988 (N=100): once t-converged the N-descent flattens to ~-2.7e-3 per
 *      24-rung step (vs the spurious ~-4e-2 at fixed T=800), sitting firmly in the 0.58-0.585 band.
 *   3. ENTRY PRECISION IS A NON-ISSUE IN THE condB=1 BASIS. Refining the t-quadrature at N=52,T=3200
 *      from panel1.5/gl24 (0.58519384) to panel0.5/gl40 (0.58519386) moves the floor by only +1.6e-8 --
 *      ~6 orders below the ~4.5e-2 t-truncation effect. The entries are quadrature-converged to ~1e-8,
 *      and with condB=1 double precision carries them faithfully: no extended-precision entry rebuild
 *      is needed once the basis is well conditioned.
 *
 * VERDICT. The imp-96772 sub-gap IMP96772_ENTRY_PRECISION_AND_TCONV is RESOLVED: (a) the entry-precision
 * half is a non-issue in the condB=1 Gegenbauer basis (quadrature spread ~1.6e-8 << the physical
 * effect), and (b) the t-convergence half pins the 2a=ln3 plateau at ~0.579 (T=3200: 0.578956 at N=100,
 * matching imp-96768), with the T=800 value 0.533846 confirmed as a pure t-truncation artifact. The
 * plateau stays firmly positive (0.58-0.585 across N=52..100 at T=4800), consistent with a positive
 * N->infinity limit but NOT establishing it: the Rayleigh floor is an UPPER bound, and the uniform-in-N
 * spectral gap lambda_min(T_a[sigma_2]) >= c > 0 (imp-96749 IMP96749_UNIFORM_N_GAP_UNSETTLED) remains
 * the open analyticObstruction. Measurement only; operator positivity for 0.96 < 2a < ln3 stays OPEN;
 * interval-rigorous certificate reach stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96772-krein-lammin-double-double-recompute.js (SUB-GAP IMP96772_ENTRY_PRECISION_AND_TCONV; T=800 solve-only recompute)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (orthogonal Gegenbauer condB=1 basis; t-converged estimate ~0.579)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (Legendre ladder + condB wall; IMP96749_UNIFORM_N_GAP_UNSETTLED)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; analyticObstruction)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// t-truncation ladder swept at the binding 2a=ln3 rung
export const IMP96806_TS = Object.freeze([800, 1600, 3200, 4800]);
export const IMP96806_NS = Object.freeze([52, 76, 100]);

// floor lambda_min(T_a[sigma_2]) at 2a=ln3 vs (N, T), Gegenbauer condB=1 basis, double entries
// (verbatim from tmp/imp-96806-out.json). Rows indexed by N; columns by IMP96806_TS.
export const IMP96806_TSWEEP_LN3 = Object.freeze({
  52: Object.freeze([0.577015, 0.584110, 0.585194, 0.585319]),
  76: Object.freeze([0.557245, 0.577719, 0.581260, 0.581679]),
  100: Object.freeze([0.533846, 0.570764, 0.578956, 0.579988]),
});

// the two anchors bridged by this measurement (2a=ln3, N=100)
export const IMP96806_FIXED_T800_FLOOR = 0.533846; // imp-96772 fixed-T=800 value (unpinned plateau)
export const IMP96806_TCONV_PLATEAU = 0.578956; // T=3200 value, pinning the imp-96768 estimate ~0.579
export const IMP96806_T4800_FLOOR = 0.579988; // T=4800: T3200->T4800 increment +1.03e-3
export const IMP96806_T3200_T4800_INCREMENT = 0.001032; // residual t-truncation at N=100, T=3200->4800

// entry-precision / quadrature cross-check at N=52, T=3200 (verbatim)
export const IMP96806_ENTRY_CHECK = Object.freeze({
  panel1p5_gl24: 0.58519384,
  panel0p75_gl32: 0.58519383,
  panel0p5_gl40: 0.58519386,
  spread: 1.61e-8, // finest - base; ~6 orders below the ~4.5e-2 t-truncation effect
});

export const IMP96806_VERDICT = Object.freeze({
  ticket: 'imp-96806',
  question: 'does pushing the t-truncation to T>=3200 (with a well-conditioned entry basis) pin the 2a=ln3 plateau of lambda_min(T_a[sigma_2]) at the imp-96768 t-converged estimate ~0.579, resolving the imp-96772 sub-gap?',
  answer: 'yes: at N=100 the 2a=ln3 floor climbs 0.533846 (T=800) -> 0.578956 (T=3200) -> 0.579988 (T=4800), pinning the plateau at ~0.579 (matching imp-96768) with a T=3200->4800 residual of only +1.0e-3; the fixed-T=800 value was a pure t-truncation artifact; entry precision is a non-issue in the condB=1 Gegenbauer basis (t-quadrature spread ~1.6e-8)',
  basis: 'Gegenbauer C_n^{13/2}, Gram B = a^{4m+1} I, condB=1',
  binding2a: 'ln3',
  fixedT800Floor: 0.533846, // N=100
  tConvPlateauT3200: 0.578956, // N=100
  floorT4800: 0.579988, // N=100
  t3200t4800Increment: 0.001032, // pinned to ~1e-3
  entryPrecisionSpread: 1.61e-8, // quadrature-converged; extended-precision entries unnecessary in condB=1 basis
  confirmsImp96768Estimate: true, // ~0.579
  subGapResolved: 'IMP96772_ENTRY_PRECISION_AND_TCONV', // both halves (entry precision + t-convergence) addressed
  plateauFirmlyPositive: true, // 0.58-0.585 across N=52..100 at T=4800
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED remains the open analyticObstruction
  extrapolatedLimitBaked: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96806_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96806_ASSERTIONS = [
  {
    id: 'imp96806-t800-climbs-to-plateau',
    holds: () => {
      const row = IMP96806_TSWEEP_LN3[100];
      // T=800 value matches the imp-96772 fixed-T floor, climbs monotonically to ~0.58 at T=4800
      return Math.abs(row[0] - IMP96806_FIXED_T800_FLOOR) < 1e-6 &&
        row.every((v, i) => i === 0 || v > row[i - 1]) &&
        row[row.length - 1] > 0.579;
    },
    why: 'at N=100 the 2a=ln3 floor must start at the imp-96772 fixed-T=800 value 0.533846 and climb monotonically in T to > 0.579 at T=4800 (t-truncation, not a spectral effect).',
  },
  {
    id: 'imp96806-plateau-pins-imp96768-estimate',
    holds: () =>
      Math.abs(IMP96806_TCONV_PLATEAU - 0.579) < 2e-3 &&
      IMP96806_T3200_T4800_INCREMENT > 0 && IMP96806_T3200_T4800_INCREMENT < 2e-3,
    why: 'the T=3200 plateau must reproduce the imp-96768 t-converged estimate ~0.579 to < 2e-3, and the T=3200->4800 increment must be small (< 2e-3), i.e. T>=3200 pins the plateau.',
  },
  {
    id: 'imp96806-entry-precision-non-issue',
    holds: () => {
      const e = IMP96806_ENTRY_CHECK;
      return e.spread < 1e-6 &&
        Math.abs(e.panel0p5_gl40 - e.panel1p5_gl24) < 1e-6;
    },
    why: 'refining the t-quadrature must move the floor by < 1e-6 (measured ~1.6e-8), i.e. the entries are quadrature-converged and extended-precision entries are unnecessary in the condB=1 basis.',
  },
  {
    id: 'imp96806-plateau-firmly-positive-N-stable',
    holds: () =>
      IMP96806_NS.every((N) => {
        const v = IMP96806_TSWEEP_LN3[N][IMP96806_TS.length - 1]; // T=4800
        return v > 0.578 && v < 0.59;
      }),
    why: 'once t-converged the 2a=ln3 floor sits firmly in the 0.58-0.585 band across N=52..100 (no collapse; N-descent flattened by t-convergence).',
  },
  {
    id: 'imp96806-measurement-only-no-qed',
    holds: () =>
      IMP96806_VERDICT.operatorPositivityProved === false &&
      IMP96806_VERDICT.uniformNGapSettled === false &&
      IMP96806_VERDICT.extrapolatedLimitBaked === false &&
      IMP96806_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96806_VERDICT.qed === false,
    why: 'measurement only: no operator positivity theorem, the uniform-in-N gap stays unsettled, no extrapolated limit is baked, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP96806_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96806-krein-tconv-plateau-2a-ln3 assertion failed: ${a.id}`);
  }
}

void LN3;
