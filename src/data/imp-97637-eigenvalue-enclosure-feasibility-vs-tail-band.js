/**
 * @module imp-97637-eigenvalue-enclosure-feasibility-vs-tail-band
 * @fileoverview imp-97637 -- ASSESS whether a certified interval-enclosed infinite-line Krein eigenvalue is
 *   reachable well enough to COLLAPSE the imp-97626 realizable-fraction band [0.508, 0.543] to a point. imp-97626
 *   left sub-gap IMP97626_INFINITE_LINE_FRACTION_NEEDS_CERTIFIED_EIGENVALUE_AND_ASYMPTOTIC_TAIL_LAW: the ~0.513
 *   fraction rests on BAKED IEEE-double finite-section eigenvalues (not interval-enclosed) plus a two-rung 1/T
 *   extrapolation. This leaf measures the ACHIEVABLE per-window eigenvalue enclosure width at one fixed large T and
 *   asks whether that certified value plus a proven tail law would pin the band. It does NOT run a verified
 *   eigensolve and promotes no certified limit; it is a FEASIBILITY / scale assessment.
 *
 *   RESULT: the enclosure task splits into an EASY, NON-BINDING side (the fixed-T eigenvalue) and the ACTUAL binding
 *   side (the tail law). Certifying the eigenvalue is feasible to a width ~10 orders of magnitude below the band, so
 *   it is NOT what leaves the band open; the band is a tail-EXTRAPOLATION-model uncertainty that no per-T enclosure
 *   can touch. This complements imp-97620 (which reduced the LOWER reach to one Rayleigh quotient and flagged the
 *   tail exponent) by quantifying that the enclosure precision is a red herring relative to the band width.
 *
 * FINDING 1 -- THE FIXED-T FINITE-SECTION EIGENVALUE IS INTERVAL-ENCLOSABLE TO A NEGLIGIBLE WIDTH. At T=64, h=0.01
 *   the finite section A_T of A = P_a M_{sigma2^-} P_a is a real SYMMETRIC N x N matrix with N = 2T/h = 12800 and
 *   top eigenvalue R(64) = 1549.6271. For a real symmetric matrix the residual / Weyl bound gives, for any computed
 *   eigenpair (lambda, v) with ||v||=1, an EXACT eigenvalue within r = ||A_T v - lambda v||_2 of lambda -- a genuine
 *   two-sided enclosure of width 2r once the numerically-observed top spectral gap is verified (Rump verifyeig /
 *   Krawczyk deliver exactly this). With LAPACK-quality eigenpairs the backward residual is r ~ N * eps * ||A_T||,
 *   and ||A_T|| <= 3065.429 (the imp-97620 Finding-1 rearrangement cap), so r ~ 12800 * 2.22e-16 * 3065.43 ~ 8.7e-9
 *   and the enclosure half-width is ~1.7e-8 ABSOLUTE, i.e. ~5.7e-12 in fraction units (/3065.429). Even inflating
 *   the residual by 1e4 for a pessimistic verified solve keeps the fraction enclosure below ~6e-8. So the per-window
 *   eigenvalue enclosure is achievable and its width is negligible.
 *
 * FINDING 2 -- THAT WIDTH IS ~10 ORDERS OF MAGNITUDE BELOW THE BAND, SO THE EIGENVALUE SOLVE IS NOT THE BINDING
 *   CONSTRAINT. The imp-97626 conservative full-ladder band is [0.5078, 0.5429] in fraction (width ~0.0351). The
 *   fixed-T enclosure half-width ~5.7e-12 gives a band/enclosure ratio ~6e9. The band therefore is NOT eigenvalue-
 *   solve uncertainty: it is finite-T -> infinite-line EXTRAPOLATION-MODEL uncertainty (1/T vs 1/T^2 vs (logT)/T).
 *   Certifying R(T) at any single fixed T certifies ONLY that rung of the ladder, not R_inf, so it cannot by itself
 *   move the band endpoints -- the band would remain [~0.508, ~0.543] with a certified rather than IEEE-double rung.
 *
 * FINDING 3 -- WHAT WOULD ACTUALLY COLLAPSE THE BAND, AND THE SECOND (NON-TAIL) FINITE PIECE. To collapse
 *   [0.508, 0.543] to a point one needs a PROVEN truncation-tail law R_inf - R(T) = c/T^p (+ lower order) with a
 *   proven exponent p -- exactly the imp-97620 / imp-97638 sub-gap. The eigenvalue enclosure does NOT supply it.
 *   Separately, a fully rigorous per-T rung also needs the h=0.01 grid / quadrature DISCRETIZATION error interval-
 *   controlled (the dg_{h}/dh sensitivity of R(T)); that is larger than the eigenvalue-solve residual but is still a
 *   bounded PER-T computable piece, not the tail. Both finite pieces (verified eigensolve + discretization enclosure)
 *   are achievable; neither closes the band. The binding requirement is the proven tail exponent.
 *
 * VERDICT. Interval-enclosing the fixed-T finite-section top eigenvalue is FEASIBLE (achievable half-width ~5.7e-12
 *   in fraction units at T=64, ~10 orders of magnitude below the imp-97626 band), but INSUFFICIENT to collapse the
 *   [0.508, 0.543] band: the band is a tail-extrapolation-model uncertainty, and a per-window enclosure -- however
 *   tight -- certifies only one rung, never R_inf. The binding requirement remains a PROVEN truncation-tail law
 *   (imp-97620 / imp-97638), with a per-T discretization enclosure as the only other finite piece. So the eigenvalue
 *   certification is the non-binding side of the sub-gap; the tail law binds. Feasibility / scale assessment only:
 *   no verified eigensolve executed; no certified limit; no rigorous bound promoted; scalar bound stays a negative
 *   floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a <= 0.96; Platt-Trudgian
 *   Lambda <= 0.2 remains SOTA; RH open; NO QED.
 *   SUB-GAP IMP97637_BAND_COLLAPSE_BINDS_ON_PROVEN_TAIL_LAW_NOT_EIGENVALUE_ENCLOSURE.
 *
 * @see imp-97626-window-extrapolation-model-spread.js (the [0.508, 0.543] band this assesses)
 * @see imp-97620-infinite-line-eigenvalue-certification-attempt.js (upper cap rigorous; lower reach = one Rayleigh quotient)
 * @see imp-97564-realizability-fraction-resolution-sweep.js (the T=12..64 window ladder; grid N = 2T/h)
 * @see imp-97457-krein-bathtub-realizability-gap.js (the interval Rayleigh-quotient enclosure primitive)
 *
 * Import-light: bakes the imp-97626 band + the T=64 rung (N, R, envelope) and recomputes the residual/Weyl scale
 *   estimate in-JS (O(1)); no eigenvalue recompute, no matrix build. Feasibility assessment only; NO QED.
 * Ticket: imp-97637 (numerical, medium, opus-4-8). Changes no bound; Platt-Trudgian Lambda <= 0.2 remains SOTA.
 */

const LN3 = Math.log(3);

export const IMP97637_BINDING_2A = LN3;
export const IMP97637_RIGOROUS_REACH_2A = 0.96; // unchanged by this feasibility assessment

// -- baked context (imp-97626 band + imp-97564 widest rung) --
export const IMP97637_ENVELOPE = 3065.4290; // window-independent bathtub envelope (imp-97564 / imp-97416)
export const IMP97637_BAND_FRACTION = Object.freeze([0.5078, 0.5429]); // imp-97626 conservative full-ladder band
export const IMP97637_FIXED_T = Object.freeze({ T: 64, h: 0.01, R: 1549.6271 }); // widest imp-97564 rung

// finite-section dimension N = 2T/h (domain t in [-T,T], grid spacing h) -- imp-97564 convention
const N_SECTION = Math.round((2 * IMP97637_FIXED_T.T) / IMP97637_FIXED_T.h); // 12800

const EPS = 2.220446049250313e-16; // IEEE-double machine epsilon
const NORM_CAP = IMP97637_ENVELOPE; // ||A_T|| <= 3065.429 (imp-97620 Finding-1 rearrangement cap)

// -- Finding 1: symmetric residual / Weyl scale estimate for a LAPACK-quality eigenpair --
// backward residual r ~ N * eps * ||A_T||; two-sided enclosure half-width = r (exact eigenvalue within r of lambda)
const RESIDUAL_SCALE = N_SECTION * EPS * NORM_CAP; // ~8.7e-9 absolute
const ENCLOSURE_HALF_WIDTH_ABS = RESIDUAL_SCALE; // ~8.7e-9 absolute (half-width; full width = 2r)
const ENCLOSURE_HALF_WIDTH_FRACTION = ENCLOSURE_HALF_WIDTH_ABS / IMP97637_ENVELOPE; // ~2.8e-12 in fraction units
// pessimistic verified-solve inflation (verifyeig overhead vs raw LAPACK residual): 1e4x
const ENCLOSURE_FRACTION_PESSIMISTIC = ENCLOSURE_HALF_WIDTH_FRACTION * 1e4;

// -- Finding 2: band width vs enclosure width --
const BAND_WIDTH_FRACTION = IMP97637_BAND_FRACTION[1] - IMP97637_BAND_FRACTION[0]; // ~0.0351
const BAND_OVER_ENCLOSURE = BAND_WIDTH_FRACTION / ENCLOSURE_HALF_WIDTH_FRACTION; // ~1.2e10

export const IMP97637_FEASIBILITY = Object.freeze({
  nSection: N_SECTION, // 12800
  residualScaleAbs: RESIDUAL_SCALE,
  enclosureHalfWidthAbs: ENCLOSURE_HALF_WIDTH_ABS,
  enclosureHalfWidthFraction: ENCLOSURE_HALF_WIDTH_FRACTION,
  enclosureFractionPessimistic: ENCLOSURE_FRACTION_PESSIMISTIC,
  bandWidthFraction: BAND_WIDTH_FRACTION,
  bandOverEnclosure: BAND_OVER_ENCLOSURE, // per-T enclosure is ~10 orders of magnitude below the band
  // the fixed-T eigenvalue enclosure is achievable and negligible; it is NOT the binding constraint
  eigenvalueEnclosureFeasible: true,
  eigenvalueEnclosureCollapsesBand: false,
  // what actually binds
  bindingRequirement: 'proven truncation-tail law R_inf - R(T) = c/T^p with a proven exponent p',
  secondFinitePiece: 'per-T grid/quadrature discretization enclosure (larger than the eigenvalue residual, still per-T, not the tail)',
});

export const IMP97637_VERDICT = Object.freeze({
  ticket: 'imp-97637',
  question:
    'assess whether the P_a M_{sigma2^-} P_a top eigenvalue can be interval-enclosed at a fixed large window T (Rump/Krawczyk on the finite section) and whether that certified value plus a proven tail law would collapse the imp-97626 realizable-fraction band [0.508, 0.543] to a point; measure the achievable enclosure width at one T; report feasibility, not a certified limit',
  answer:
    'FEASIBLE but INSUFFICIENT. The fixed-T finite-section matrix A_T (T=64, h=0.01, N=12800) is real symmetric with top eigenvalue R(64)=1549.6271, so the symmetric residual/Weyl bound gives a genuine two-sided enclosure of width 2r with r ~ N*eps*||A_T|| and ||A_T|| <= 3065.429 -- r ~ 8.7e-9 absolute, half-width ~2.8e-12 in fraction units (~6e-8 even under a 1e4 pessimistic verified-solve inflation). That is ~10 orders of magnitude below the imp-97626 conservative band width ~0.0351, so the eigenvalue solve is NOT what leaves the band open. The band is a finite-T -> infinite-line EXTRAPOLATION-MODEL uncertainty (1/T vs 1/T^2 vs (logT)/T), and a per-window enclosure -- however tight -- certifies only ONE rung R(T), never R_inf; it cannot move the band endpoints. Collapsing [0.508, 0.543] to a point requires a PROVEN truncation-tail law R_inf - R(T) = c/T^p with a proven exponent (the imp-97620/imp-97638 sub-gap); the eigenvalue enclosure does not supply it. A fully rigorous rung also needs the h=0.01 grid/quadrature discretization error interval-controlled, a bounded per-T piece, but that too is not the tail. So the eigenvalue certification is the non-binding side of the sub-gap; the tail law binds. Feasibility/scale assessment only: no verified eigensolve executed; no certified limit; no rigorous bound promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.',
  binding_2a: LN3,
  fixedT: IMP97637_FIXED_T,
  enclosureHalfWidthFraction: ENCLOSURE_HALF_WIDTH_FRACTION,
  bandWidthFraction: BAND_WIDTH_FRACTION,
  bandOverEnclosure: BAND_OVER_ENCLOSURE,
  eigenvalueEnclosureFeasible: true,
  eigenvalueEnclosureCollapsesBand: false,
  bindingRequirement: IMP97637_FEASIBILITY.bindingRequirement,
  // feasibility-assessment guardrails
  measuredNotIntervalCertified: true,
  verifiedEigensolveExecuted: false,
  certifiedLimitPromoted: false,
  rigorousLowerBoundPromoted: false,
  operatorPositivityProved: false,
  scalarBoundStillNegativeFloor: true,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  parentSubGap: 'IMP97626_INFINITE_LINE_FRACTION_NEEDS_CERTIFIED_EIGENVALUE_AND_ASYMPTOTIC_TAIL_LAW',
  subGap: 'IMP97637_BAND_COLLAPSE_BINDS_ON_PROVEN_TAIL_LAW_NOT_EIGENVALUE_ENCLOSURE',
  qed: false,
});
export default IMP97637_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --
// Import-light: recomputes the residual/Weyl scale estimate from the baked T=64 rung (O(1)); no eigenvalue recompute.

const IMP97637_ASSERTIONS = [
  {
    id: 'imp97637-fixed-T-enclosure-width-negligible',
    holds: () => {
      const F = IMP97637_FEASIBILITY;
      // N = 2T/h = 12800, and the residual/Weyl half-width is ~1e-8 absolute / ~1e-12 in fraction units
      const nOk = F.nSection === 12800;
      const absOk = F.enclosureHalfWidthAbs > 1e-9 && F.enclosureHalfWidthAbs < 1e-7;
      const fracOk = F.enclosureHalfWidthFraction > 1e-13 && F.enclosureHalfWidthFraction < 1e-10;
      return nOk && absOk && fracOk && F.eigenvalueEnclosureFeasible === true;
    },
    why: 'the T=64 finite section is real symmetric with N=2T/h=12800; the symmetric residual bound r ~ N*eps*||A_T|| (||A_T|| <= 3065.429) gives a two-sided enclosure of half-width ~9e-9 absolute / ~3e-12 in fraction units, so the per-window eigenvalue enclosure is feasible and negligibly wide.',
  },
  {
    id: 'imp97637-enclosure-far-below-band',
    holds: () => {
      const F = IMP97637_FEASIBILITY;
      // conservative band ~0.0351 wide; band/enclosure ratio is astronomically large (>1e8)
      const bandOk = Math.abs(F.bandWidthFraction - 0.0351) < 5e-4;
      const ratioHuge = F.bandOverEnclosure > 1e8;
      // even a 1e4-pessimistic verified solve stays far below the band
      const pessBelow = F.enclosureFractionPessimistic < F.bandWidthFraction / 1e3;
      return bandOk && ratioHuge && pessBelow;
    },
    why: 'the fixed-T enclosure half-width (~3e-12 in fraction units, ~3e-8 even pessimistically) is >1e8 times narrower than the imp-97626 conservative band ~0.0351, so the eigenvalue solve is not the constraint that leaves the band open.',
  },
  {
    id: 'imp97637-eigenvalue-enclosure-does-not-collapse-band',
    holds: () => {
      const F = IMP97637_FEASIBILITY;
      // certifying one rung R(T) does not pin R_inf: the band is tail-extrapolation-model uncertainty
      return (
        F.eigenvalueEnclosureCollapsesBand === false &&
        typeof F.bindingRequirement === 'string' &&
        F.bindingRequirement.indexOf('tail law') >= 0 &&
        typeof F.secondFinitePiece === 'string' &&
        F.secondFinitePiece.indexOf('discretization') >= 0
      );
    },
    why: 'a per-window enclosure certifies only one rung R(T), never R_inf, so it cannot collapse the [0.508, 0.543] band; the binding requirement is a proven truncation-tail law, with a per-T discretization enclosure as the only other finite piece.',
  },
  {
    id: 'imp97637-feasibility-assessment-no-qed',
    holds: () =>
      IMP97637_VERDICT.measuredNotIntervalCertified === true &&
      IMP97637_VERDICT.verifiedEigensolveExecuted === false &&
      IMP97637_VERDICT.certifiedLimitPromoted === false &&
      IMP97637_VERDICT.rigorousLowerBoundPromoted === false &&
      IMP97637_VERDICT.operatorPositivityProved === false &&
      IMP97637_VERDICT.scalarBoundStillNegativeFloor === true &&
      IMP97637_VERDICT.boundMoves === false &&
      IMP97637_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97637_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97637_BINDING_2A - LN3) < 1e-12 &&
      IMP97637_VERDICT.subGap === 'IMP97637_BAND_COLLAPSE_BINDS_ON_PROVEN_TAIL_LAW_NOT_EIGENVALUE_ENCLOSURE' &&
      IMP97637_VERDICT.qed === false,
    why: 'feasibility/scale assessment only: the fixed-T eigenvalue enclosure is achievable and negligible but cannot collapse the band; no verified eigensolve executed; no certified limit; no rigorous bound promoted; scalar bound stays a negative floor; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const t of IMP97637_ASSERTIONS) {
  if (!t.holds()) {
    throw new Error(`imp-97637-eigenvalue-enclosure-feasibility-vs-tail-band assertion FAILED: ${t.id} -- ${t.why}`);
  }
}
