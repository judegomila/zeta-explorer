/**
 * @module imp-97163-krein-ln3-floor-conditioning-vs-real
 * @fileoverview imp-97163 -- MEASUREMENT (numerical): separate conditioning contamination from a REAL
 *   decrement plateau in the imp-97135 FINDING 1 compression-defect breakdown at N=52. imp-97135 read
 *   the 2a=ln3 Legendre-Galerkin Rayleigh floors (stored to 6 decimals) as collapsing geometrically for
 *   two steps (r1=0.3696, r2=0.4611) then BREAKING DOWN at the step N=44->52 with r3=d4/d3=1.3793>1,
 *   INSIDE the double-precision-trustworthy window (condB(52)=4.6e12), and claimed the breakdown is NOT
 *   a conditioning artifact. But that claim rested on 6-decimal floors, where the decrements d~0.005
 *   carry only ~3-4 significant figures, so a sub-1e-6 conditioning wobble is not resolved. This leaf
 *   re-solves the SAME committed operator in extended precision (mpmath dps=40) at N=36,44,52,60 and
 *   compares the extended floors against the double-precision floors to decide the question with margin.
 *
 *   Measurement only. The Rayleigh-Ritz floor is an UPPER bound on the true infinite-dim lambda_min, so
 *   these floors and their decrements bound only how much the UPPER estimate is still improving, NOT the
 *   true compression defect from below. Produces no lower-bound certificate; no operator positivity; no
 *   bound moves; interval-rigorous reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.
 *
 * METHOD. The build() (A = T_a[sigma_2] Galerkin block, B = Legendre Gram, tail-inclusive T=800, panel
 *   1.5) is reused verbatim from imp-96772/imp-96749 with the SAME double-precision A,B ENTRIES; only the
 *   generalized-eigenvalue solve is promoted to mpmath dps=40 (Cholesky of B, symmetric reduction, eigsy).
 *   The double-vs-extended floor gap maxAbsDelta bounds the conditioning contamination of each floor; the
 *   decrements d_k = floor(N_k)-floor(N_{k+1}) and the ratio r3 = d(44->52)/d(36->44) are recomputed from
 *   the extended floors and compared against the imp-97135 double-precision values.
 *
 * FINDING -- THE r3>1 BREAKDOWN IS GENUINE, NOT A CONDITIONING ARTIFACT. The extended-precision floors
 *   (dps=40) reproduce the double-precision floors to within maxAbsDelta = 7.71e-9 across N=36..60 (the
 *   worst gap at N=52, condB 4.57e12); that gap is ~1000x smaller than the decrements d~0.005-0.0065, so
 *   conditioning perturbs any single decrement by at most ~2*7.71e-9 = 1.5e-8, i.e. ~2e-6 of a decrement.
 *   The extended-precision ratio r3 = d(44->52)/d(36->44) = 1.37913 lands on top of the imp-97135
 *   double-precision r3 = 1.3793 (agreeing to 4 significant figures); its excess above 1 (0.379) exceeds
 *   the conditioning-induced uncertainty in r3 (~1e-5) by more than four orders of magnitude. The break-
 *   down therefore survives extended precision with enormous margin: it is a REAL decrement plateau/
 *   re-acceleration, not a double-precision conditioning artifact. This CONFIRMS imp-97135 FINDING 1 and
 *   its sub-gap IMP97135_COMPRESSION_DEFECT_DESCENT_HAS_NO_EXTRACTABLE_RATE with certified numerical
 *   margin, and matches imp-96772 (the ln3 descent is real t-truncation, not conditioning).
 *
 * @see imp-97135-krein-compression-defect-descent-no-rate.js (FINDING 1: r3=1.3793>1 breakdown at N=52; this leaf certifies it is real)
 * @see imp-96772-krein-lammin-double-double-recompute.js (extended precision: the ln3 descent is real t-truncation, not conditioning)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_LADDER: the Legendre floor ladder; trusted window N<=52)
 * @see imp-97121-krein-uniform-n-floor-certificate-scope.js (Finding 3 names the compression defect; the object this descent probes)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; reach 2a<=0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein floor

// interval-rigorous certificate reach (unchanged by this measurement)
export const IMP97163_RIGOROUS_REACH_2A = 0.96;
export const IMP97163_BINDING_2A = LN3;

// N ladder recomputed in extended precision (mpmath dps=40); N=36 is needed so r3=d(44->52)/d(36->44)
// is available. condB grows past the trusted-window edge N=52 (condB 4.57e12) into N=60 (condB 2.43e13).
export const IMP97163_NS = Object.freeze([36, 44, 52, 60]);

// Double-precision generalized-eigenvalue floors (scipy eigh) -- the imp-96749/imp-97135 solve.
export const IMP97163_FLOORS_DOUBLE = Object.freeze([
  0.5880671757598133, // N=36
  0.5834217910217809, // N=44
  0.5770152012501052, // N=52
  0.5704996493401963, // N=60
]);
// Extended-precision floors (mpmath dps=40; SAME double-precision A,B entries, extended solve only).
export const IMP97163_FLOORS_EXTENDED = Object.freeze([
  0.588067175822108, // N=36
  0.583421789011707, // N=44
  0.577015208957496, // N=52
  0.570499642845587, // N=60
]);
export const IMP97163_CONDB = Object.freeze([7.0085e10, 6.6907e11, 4.5654e12, 2.4300e13]);

// Worst double-vs-extended floor gap across the ladder (at N=52); bounds the conditioning contamination
// of any single floor. ~1000x below the decrements d~0.005-0.0065, so it cannot manufacture r3>1.
export const IMP97163_MAX_ABS_DELTA = 7.707390836664274e-9;

// Extended-precision decrements d_k = floor(N_k)-floor(N_{k+1}) and the breakdown ratio r3.
export const IMP97163_D_36_44 = 0.0046453868104; // d3
export const IMP97163_D_44_52 = 0.00640658005421; // d4 (the r3 breakdown step)
export const IMP97163_D_52_60 = 0.00651556611191; // d5
export const IMP97163_R3_EXTENDED = 1.379127361; // d(44->52)/d(36->44); imp-97135 double-precision r3=1.3793
export const IMP97163_R4_EXTENDED = 1.017011581; // d(52->60)/d(44->52)
export const IMP97135_R3_DOUBLE = 1.3793; // imp-97135 stored double-precision value being audited

export const IMP97163_VERDICT = Object.freeze({
  ticket: 'imp-97163',
  question: 'is the imp-97135 FINDING 1 r3=1.3793>1 decrement breakdown at N=44->52 (2a=ln3, inside condB(52)=4.6e12) a genuine plateau/re-acceleration or a double-precision conditioning artifact?',
  binding_2a: LN3,
  method: 'recompute the 2a=ln3 Legendre-Galerkin Rayleigh floors at N=36,44,52,60 in extended precision (mpmath dps=40; same double-precision A,B entries, extended generalized-eigenvalue solve) and compare against the double-precision floors; conditioning contamination is bounded by the double-vs-extended floor gap',
  // Finding: the breakdown survives extended precision with enormous margin.
  maxAbsFloorDelta: 7.707390836664274e-9,     // worst double-vs-extended floor gap (at N=52)
  conditioningNegligibleVsDecrements: true,   // 7.71e-9 gap vs d~0.005-0.0065 decrements (~1000x smaller)
  r3ExtendedReproducesDouble: true,           // extended r3=1.37913 vs double r3=1.3793 (4 sig figs)
  r3ExceedsOne: true,                         // extended r3=1.37913 > 1 (excess 0.379)
  breakdownIsGenuine: true,                   // real decrement plateau/re-acceleration
  breakdownIsConditioningArtifact: false,     // conditioning cannot manufacture the 0.379 excess above 1
  confirmsImp97135Finding1: true,
  matchesImp96772: true,                      // ln3 descent is real t-truncation, not conditioning
  // unchanged program state
  operatorPositivityProved: false,
  lowerBoundCertificateProduced: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP97163_LN3_R3_BREAKDOWN_IS_REAL_NOT_CONDITIONING -- the imp-97135 FINDING 1 decrement breakdown r3=d(44->52)/d(36->44)=1.3793>1 at 2a=ln3 (the last trusted step N=44->52, condB(52)=4.6e12) is a GENUINE plateau/re-acceleration, not a double-precision conditioning artifact. Re-solving the SAME committed operator (T_a[sigma_2] Galerkin block A, Legendre Gram B, tail-inclusive T=800, panel 1.5; verbatim double-precision entries from imp-96772/imp-96749) in extended precision (mpmath dps=40) at N=36,44,52,60 reproduces the double-precision floors to within maxAbsDelta=7.71e-9 (worst gap at N=52), ~1000x smaller than the decrements d~0.005-0.0065; the extended-precision ratio r3=1.37913 lands on the double-precision r3=1.3793 (agreeing to 4 significant figures) with an excess above 1 (0.379) exceeding the ~1e-5 conditioning-induced uncertainty in r3 by more than four orders of magnitude. So the geometric collapse (r1=0.3696, r2=0.4611) genuinely breaks down inside the trusted window and the compression-defect descent carries no extractable algebraic rate, confirming imp-97135 FINDING 1 and its sub-gap IMP97135_COMPRESSION_DEFECT_DESCENT_HAS_NO_EXTRACTABLE_RATE with certified numerical margin, and matching imp-96772 (the ln3 descent is real t-truncation). The Rayleigh-Ritz floor stays an UPPER bound on the true lambda_min, so these decrements bound only the improvement of the upper estimate, never the true defect from below. Measurement only; no operator positivity, no lower-bound certificate, no bound moves; interval-rigorous reach stays 2a<=0.96',
  qed: false,
});
export default IMP97163_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97163_ASSERTIONS = [
  {
    id: 'imp97163-extended-decrements-match-floor-differences',
    holds: () => {
      // The baked extended-precision decrements must reproduce the extended floor differences and be
      // non-negative (monotone-decreasing floors).
      const f = IMP97163_FLOORS_EXTENDED;
      const d = [IMP97163_D_36_44, IMP97163_D_44_52, IMP97163_D_52_60];
      for (let i = 0; i < f.length - 1; i++) {
        const diff = f[i] - f[i + 1];
        if (Math.abs(diff - d[i]) > 1e-9) return false;
        if (diff < 0) return false;
      }
      return true;
    },
    why: 'the baked extended-precision decrements must equal floor(N_k)-floor(N_{k+1}) and be non-negative (monotone-decreasing floors).',
  },
  {
    id: 'imp97163-r3-reproduces-double-and-exceeds-one',
    holds: () => {
      // Extended r3 must equal the recomputed ratio, reproduce the imp-97135 double-precision r3 to the
      // 4-significant-figure precision at which it was stored, and exceed 1.
      const r3 = IMP97163_D_44_52 / IMP97163_D_36_44;
      return (
        Math.abs(r3 - IMP97163_R3_EXTENDED) < 1e-6 &&
        Math.abs(IMP97163_R3_EXTENDED - IMP97135_R3_DOUBLE) < 5e-4 &&
        IMP97163_R3_EXTENDED > 1 &&
        IMP97163_VERDICT.r3ExtendedReproducesDouble === true &&
        IMP97163_VERDICT.r3ExceedsOne === true
      );
    },
    why: 'the extended-precision r3 must equal d(44->52)/d(36->44), agree with the imp-97135 double-precision r3=1.3793 to 4 significant figures, and exceed 1.',
  },
  {
    id: 'imp97163-conditioning-negligible-so-breakdown-is-real',
    holds: () => {
      // The worst double-vs-extended floor gap must be far below the decrements (so conditioning cannot
      // manufacture r3>1), and the verdict must record the breakdown as genuine, not a conditioning artifact.
      const minDecrement = Math.min(IMP97163_D_36_44, IMP97163_D_44_52, IMP97163_D_52_60);
      return (
        IMP97163_MAX_ABS_DELTA < minDecrement / 1e5 &&
        IMP97163_VERDICT.conditioningNegligibleVsDecrements === true &&
        IMP97163_VERDICT.breakdownIsGenuine === true &&
        IMP97163_VERDICT.breakdownIsConditioningArtifact === false &&
        IMP97163_VERDICT.confirmsImp97135Finding1 === true
      );
    },
    why: 'the worst double-vs-extended floor gap (7.71e-9) must be at least 1e5x below the smallest decrement, so conditioning cannot manufacture the r3>1 breakdown; the verdict records it as genuine.',
  },
  {
    id: 'imp97163-measurement-only-no-qed',
    holds: () =>
      IMP97163_VERDICT.operatorPositivityProved === false &&
      IMP97163_VERDICT.lowerBoundCertificateProduced === false &&
      IMP97163_VERDICT.boundMoves === false &&
      IMP97163_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97163_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97163_BINDING_2A - LN3) < 1e-12 &&
      IMP97163_VERDICT.qed === false,
    why: 'measurement only: no operator positivity, no lower-bound certificate, no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97163_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97163 assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
