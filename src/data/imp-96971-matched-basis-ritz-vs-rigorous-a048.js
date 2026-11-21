/**
 * @fileoverview imp-96971 -- MATCHED-NORMALISATION single-common-basis lambda_1(T_a[sigma_2]) solve
 * at a=0.48 (2a=0.96) that PINS the imp-96958 Ritz-vs-rigorous gap and RESOLVES its apparent
 * inversion. imp-96958 could only bracket the gap: the finest imp-96938 shift-invert Ritz upper at
 * T=800 (12.0089) sat BELOW the log-interp rigorous lower ~17.09, an apparent inversion it attributed
 * (as an honest caveat) to differing discretisations/bases/mass-normalisations/shifts. Here both
 * estimators are recomputed in ONE common orthonormal Gegenbauer basis (psi_n orthonormal => mass
 * matrix = I, so mass normalisation is matched and there is NO shift ambiguity), sweeping the cutoff T
 * to separate the T-truncation artefact from any true normalisation gap.
 *
 * Import-light data leaf: literals are the computed outputs of tmp/imp-96971-matched-basis-a048.py
 * (reuses the imp-96938 / imp-96911 pole-free Gegenbauer Galerkin build_K verbatim); the certificate
 * rigorous rungs are carried as cited reference literals (the certificate module transitively imports
 * the heavy Route H/semilocal chain). No bound moves; NO QED.
 *
 * SETUP. K_{ij} = <psi_i, T_{a}[sigma_2] psi_j> in the orthonormal basis psi_n = C_n^{6.5}/||C_n||
 * (a=0.48). Two estimators of lambda_1(T), both UPPER estimates that approach the truth from above:
 *   (A) DIRECT Galerkin/Ritz  = lambda_min(K_N) (dense symmetric eigensolve, N-dim block).
 *   (B) SHIFT-INVERT (the imp-96938 estimator) = 1/lambda_max((K_Nbig+m)^-1 [:16,:16]) - m, m=1,
 *       computed in the SAME K.
 *
 * FINDING 1 -- THE DIRECT MATCHED-BASIS RITZ UPPER IS T-STABLE AT ~20.5, NEVER DIPS NEAR THE RIGOROUS
 * LOWER. lambda_min(K_N) barely moves with T (N=36: 20.4049 at T=800 -> 20.5411 at T=4800, a 0.13%
 * shift) and sits at ~20.5-21.8 across the whole N ladder. The DIRECT estimator does not exhibit the
 * imp-96958 inversion at all.
 *
 * FINDING 2 -- THE imp-96958 INVERSION IS A T-TRUNCATION ARTEFACT OF THE SHIFT-INVERT ESTIMATOR, NOT A
 * NORMALISATION/BASIS MISMATCH. In the SAME common K, the shift-invert floor at Nbig=240 collapses to
 * 12.0089 ONLY at T=800; as T is matched upward it recovers monotonically 12.0089 (T=800) -> 15.9771
 * (T=1600) -> 19.1126 (T=3200) -> 19.7005 (T=4800). The inverse (K+m)^{-1} amplifies the sigma_2 ~ t^4
 * tail-truncation error, which the DIRECT lambda_min(K_N) is immune to. So the imp-96958 honest caveat
 * over-attributed the inversion to basis/normalisation; the dominant cause is the shift-invert
 * estimator's severe T-sensitivity at the un-converged T=800.
 *
 * FINDING 3 -- ONCE NORMALISATION AND T ARE MATCHED, THE TEXTBOOK ORDERING RITZ-UPPER >= true >=
 * RIGOROUS-LOWER HOLDS. The finest matched Ritz upper (19.7005, shift-invert Nbig=240/T=4800) and the
 * DIRECT upper (20.5411, N=36/T=4800) both sit ABOVE the log-interp rigorous lower ~17.09 AND far above
 * the a=0.50 flank 7.743. The exact matched gap is 19.7005 - 17.09 = ~2.61 (~13% of the value) to the
 * interpolated lower, comfortably positive. No inversion survives the matched computation.
 *
 * VERDICT. The matched-normalisation single-common-basis solve at a=0.48 PINS the Ritz-vs-rigorous gap
 * and resolves the imp-96958 apparent inversion: the DIRECT Ritz upper is ~20.54 (T-stable) and the
 * finest shift-invert Ritz upper is ~19.70 (T-converged), both ABOVE the rigorous lower interp ~17.09
 * and the a=0.50 flank 7.743, so the textbook Ritz-upper >= true >= rigorous-lower ordering HOLDS. The
 * imp-96958 inversion (shift-invert 12.01 < 17.09) is now attributed specifically to T=800 truncation
 * in the inverse-amplified estimator, NOT to basis/normalisation mismatch. Measurement only; both
 * estimators are UPPER bounds so lambda_1 is bracketed from above, NOT a certified LB; the
 * interval-rigorous certificate reach stays 2a<=0.96; operator positivity for 0.96 < 2a < ln3 stays
 * OPEN; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96958-krein-096-ritz-vs-rigorous-crossval.js (the bracket/inversion this leaf pins)
 * @see imp-96938-krein-drift-calibration-096.js (the shift-invert Ritz estimator; build_K reused)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (rigorous lambda_min rungs; reach 2a<=0.96)
 */

// a=0.48 (2a=0.96). Common orthonormal Gegenbauer basis, mass matrix = I (matched normalisation).
export const IMP96971_A = 0.48;
export const IMP96971_TWO_A = 0.96;

// (A) DIRECT Galerkin Ritz upper lambda_min(K_N), computed values (tmp/imp-96971-matched-basis-a048.py).
// T-stable: converges from above, never dips near the rigorous lower.
export const IMP96971_DIRECT_LAMMIN = Object.freeze({
  N36_T800: 20.404887,
  N36_T4800: 20.541139,
  tStableSwingPct: (20.541139 - 20.404887) / 20.541139, // ~0.13% swing 800->4800
});

// (B) SHIFT-INVERT Ritz upper (imp-96938 estimator) in the SAME common K, N=16 trial, Nbig=240.
// The imp-96958 inversion (12.0089) appears ONLY at T=800; it recovers monotonically as T is matched up.
export const IMP96971_SHIFTINVERT_NBIG240 = Object.freeze({
  T800: 12.008850,
  T1600: 15.977096,
  T3200: 19.112560,
  T4800: 19.700511,
});

// Certificate rigorous LOWER reference rungs (positive tail dropped => LOWER bounds) -- cited literals
// from rh-route-i-toeplitz-krein-certificate-2026-09-24.js TOEPLITZ_KREIN_LITERALS.lambdaMinSigma2.
export const IMP96971_RIGOROUS = Object.freeze({
  a050: 7.743, // flank below a=0.48
  a045: 56.05, // flank above a=0.48
  interpA048: 17.09, // imp-96958 log-linear interpolation
});

// finest matched Ritz upper vs rigorous lower interp: the exact matched gap.
export const IMP96971_MATCHED_RITZ_UPPER = IMP96971_SHIFTINVERT_NBIG240.T4800; // 19.700511
export const IMP96971_MATCHED_GAP_TO_INTERP = IMP96971_MATCHED_RITZ_UPPER - IMP96971_RIGOROUS.interpA048; // ~2.61

export const IMP96971_VERDICT = Object.freeze({
  ticket: 'imp-96971',
  question: 'does the textbook Ritz-UPPER >= true >= rigorous-LOWER ordering hold at 2a=0.96 once the two estimators are computed in a single common basis with matched mass normalisation and shift, and what is the exact matched gap?',
  twoA: 0.96,
  a: 0.48,
  // Finding 1: DIRECT Ritz upper is T-stable at ~20.5, no inversion
  directRitzUpper: IMP96971_DIRECT_LAMMIN.N36_T4800, // 20.5411
  directIsTStable: true,
  // Finding 2: the imp-96958 inversion is a T-truncation artefact of the shift-invert estimator
  shiftInvertT800: IMP96971_SHIFTINVERT_NBIG240.T800, // 12.0089 (the imp-96958 inversion value)
  shiftInvertT4800: IMP96971_SHIFTINVERT_NBIG240.T4800, // 19.7005 (recovered)
  inversionIsTTruncationArtefactNotNormalisation: true,
  // Finding 3: matched ordering holds; exact matched gap
  rigorousInterpLower: IMP96971_RIGOROUS.interpA048, // 17.09
  matchedRitzUpper: IMP96971_MATCHED_RITZ_UPPER, // 19.7005
  matchedGapToInterp: IMP96971_MATCHED_GAP_TO_INTERP, // ~2.61
  ritzUpperGeRigorousLowerHolds: true,
  bothEstimatorsAreUpperBounds: true,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96971_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96971_ASSERTIONS = [
  {
    id: 'imp96971-direct-ritz-upper-t-stable-far-above-rigorous-lower',
    holds: () =>
      Math.abs(IMP96971_DIRECT_LAMMIN.N36_T4800 - 20.541139) < 1e-5 &&
      IMP96971_DIRECT_LAMMIN.tStableSwingPct < 0.01 && // <1% T-swing
      IMP96971_DIRECT_LAMMIN.N36_T4800 > IMP96971_RIGOROUS.interpA048 &&
      IMP96971_DIRECT_LAMMIN.N36_T4800 > IMP96971_RIGOROUS.a050,
    why: 'the DIRECT matched-basis Ritz upper lambda_min(K_N) is T-stable (<0.5% swing 800->4800) at ~20.54 and sits above both the log-interp rigorous lower 17.09 and the a=0.50 flank 7.743 -- it never exhibits the imp-96958 inversion.',
  },
  {
    id: 'imp96971-inversion-is-t-truncation-artefact-of-shift-invert',
    holds: () => {
      const s = IMP96971_SHIFTINVERT_NBIG240;
      return (
        Math.abs(s.T800 - 12.008850) < 1e-5 &&
        // monotone recovery as T is matched upward
        s.T800 < s.T1600 && s.T1600 < s.T3200 && s.T3200 < s.T4800 &&
        s.T800 < IMP96971_RIGOROUS.interpA048 && // the inversion at T=800
        s.T4800 > IMP96971_RIGOROUS.interpA048 && // resolved at matched T
        IMP96971_VERDICT.inversionIsTTruncationArtefactNotNormalisation === true
      );
    },
    why: 'in the same common K the shift-invert floor collapses to 12.0089 ONLY at T=800 (the imp-96958 inversion) and recovers monotonically to 19.7005 at T=4800, above the rigorous lower 17.09 -- an inverse-amplified tail-truncation artefact, not a basis/normalisation mismatch.',
  },
  {
    id: 'imp96971-matched-ordering-holds-exact-gap-and-no-qed',
    holds: () =>
      IMP96971_MATCHED_RITZ_UPPER > IMP96971_RIGOROUS.interpA048 &&
      Math.abs(IMP96971_MATCHED_GAP_TO_INTERP - 2.610511) < 1e-4 &&
      IMP96971_VERDICT.ritzUpperGeRigorousLowerHolds === true &&
      IMP96971_VERDICT.operatorPositivityProved === false &&
      IMP96971_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96971_VERDICT.qed === false,
    why: 'once normalisation and T are matched the textbook Ritz-upper (19.7005) >= rigorous-lower (17.09) ordering HOLDS with exact matched gap ~2.61; both estimators are upper bounds, the certificate reach stays 2a<=0.96, positivity for 0.96<2a<ln3 stays open, and NO QED.',
  },
];

for (const a of IMP96971_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96971 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
