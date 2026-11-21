/**
 * @fileoverview imp-96910 -- SCOUT (numerical): sweep the shift m in the imp-96889 bounded
 * shift-invert / resolvent R=(K+m)^{-1} Kato-Temple reformulation of lambda_1(T_a[sigma_2]) at
 * 2a=ln3, to LOCATE the optimal shift that maximizes the Kato-Temple correction margin and DECIDE
 * whether any m escapes the imp-96827 (N,T) truncation-rate dependence. imp-96889 tested a SINGLE
 * shift m=1 and found the KT correction eps^2/(eta-beta) ~ 1e-12 negligible, so the floor collapsed
 * onto the Ritz UPPER bound and re-expressed the open (N,T) rate. This leaf measures the whole m axis.
 * Scouting / measurement only; provisional beta is a Ritz value (NOT a certified bound); NO QED.
 *
 * METHOD (reuses the imp-96768/imp-96875/imp-96889 pole-free Gegenbauer Galerkin build, exactly-diagonal
 * L^2 Gram; operator matrix in the orthonormal basis is K = A/scaleB; driver
 * tmp/imp-96910-shift-sweep.py, /tmp/rhvenv scipy 1.18). At fixed N=36, Nbig=72, T=800 the big-space
 * operator matrix K is built ONCE (lambda_min Ritz = 0.561112). For each shift m the resolvent
 * R=(K+m)^{-1} is formed; eta=top eigenvalue of the compression R_N=R[:N,:N] (unit trial g), the
 * out-of-space residual eps=||(I-P_N)Rg|| is the tail (Rg)[N:Nbig], and beta is the provisional Ritz
 * second-largest of R in the big space. Kato-Temple on the TOP eigenvalue of the bounded self-adjoint R:
 *     Lambda_1 <= eta + eps^2/(eta - beta),   lam1_LB = 1/Lambda_1^ub - m.
 * The KT correction is eps^2/(eta-beta); its relative size is (eps^2/(eta-beta))/eta.
 *
 * FINDING 1 -- THE KT CORRECTION IS NEGLIGIBLE FOR EVERY SHIFT m IN [0.05, 64]. The absolute
 * correction eps^2/(eta-beta) shrinks from 9.05e-12 (m=0.05) to 1.46e-13 (m=64); the RELATIVE margin
 * (correction/eta) rises only from 5.53e-12 to 9.42e-12 across the same sweep. So the "optimal" shift
 * (largest relative margin) is the LARGEST m tested, but even there the margin ~9.4e-12 is ~8 orders
 * of magnitude below the 1e-4 negligibility threshold -- NO shift makes the KT correction matter.
 *
 * FINDING 2 -- THE FLOOR STAYS PINNED TO THE RITZ VALUE 0.561112 FOR EVERY m (SHIFT IS A NO-OP LEVER).
 * lam1_LB = 0.561112 to 6 digits at every shift; the max separation |lam1_LB - lam1_ritz| over the
 * whole sweep is 6.08e-10. This is algebraic: shift-invert on a symmetric matrix is exact up to the
 * KT correction, so 1/eta - m = (lam1 + m) - m = lam1 for ANY m -- the shift merely rescales the
 * spectrum of R and cannot add lower-bound content. 0.561112 is exactly the imp-96827/imp-96889
 * T=800 Ritz value, so the floor inherits the SAME open (N,T) resolvent-truncation dependence (it
 * would climb onto the imp-96827 plateau ~0.5805 +/- 8e-4 as T grows) for every m.
 *
 * VERDICT. Sweeping the shift m over [0.05, 64] LOCATES the optimal shift (largest relative KT margin)
 * at the LARGEST m, but the KT correction eps^2/(eta-beta) is negligible (relative margin <= 9.4e-12,
 * ~8 decades below any usable threshold) for EVERY m, and the floor lam1_LB stays PINNED to the Ritz
 * value 0.561112 (max separation 6.08e-10) throughout. NO shift escapes the imp-96827 (N,T)
 * truncation-rate dependence: the shift is a no-op lever on the lower-bound content, confirming and
 * strengthening the imp-96889 single-shift finding across the whole m axis. SUB-GAP
 * IMP96910_SHIFT_IS_NOOP_LEVER. Provisional beta is a Ritz value, NOT a certified bound;
 * interval-rigorous certificate reach stays 2a<=0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96889-krein-shiftinvert-katotemple-scout.js (single shift m=1; this leaf sweeps the whole m axis)
 * @see imp-96875-krein-katotemple-residual-scout.js (DIRECT residual diverges; bounded reformulation cures it)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (the open (N,T) t-truncation rate the floor tracks: plateau ~0.5805 +/- 8e-4)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the pole-free Gegenbauer Galerkin build reused here)
 */

const LN2 = Math.log(2); // 0.6931471805599453
const LN3 = Math.log(3); // 1.0986122886681098

// interval-rigorous certificate reach (unchanged by this scout)
export const IMP96910_RIGOROUS_REACH_2A = 0.96;

// the direct Ritz value of lambda_1 at N=36, Nbig=72, T=800 (imp-96827/imp-96889 T=800 plateau seed)
export const IMP96910_RITZ_FLOOR_T800 = 0.561112;

// FINDING 1+2: shift sweep at N=36, Nbig=72, T=800. lam1_LB pinned to 0.561112 for every m; the KT
// correction eps^2/(eta-beta) and its relative margin (kt/eta) are negligible (<= 9.4e-12) throughout.
export const IMP96910_SHIFT_SWEEP = Object.freeze([
  Object.freeze({ m: 0.05, eta: 1.636362, beta: 0.010998, gap: 1.625364, eps: 3.8350e-6, kt_corr: 9.0486e-12, kt_rel: 5.530e-12, lam1_lb: 0.561112 }),
  Object.freeze({ m: 0.1, eta: 1.512603, beta: 0.010992, gap: 1.501612, eps: 3.5450e-6, kt_corr: 8.3688e-12, kt_rel: 5.533e-12, lam1_lb: 0.561112 }),
  Object.freeze({ m: 0.25, eta: 1.232876, beta: 0.010974, gap: 1.221902, eps: 2.8894e-6, kt_corr: 6.8324e-12, kt_rel: 5.542e-12, lam1_lb: 0.561112 }),
  Object.freeze({ m: 0.5, eta: 0.942408, beta: 0.010944, gap: 0.931464, eps: 2.2086e-6, kt_corr: 5.2370e-12, kt_rel: 5.557e-12, lam1_lb: 0.561112 }),
  Object.freeze({ m: 1.0, eta: 0.640569, beta: 0.010884, gap: 0.629685, eps: 1.5012e-6, kt_corr: 3.5792e-12, kt_rel: 5.587e-12, lam1_lb: 0.561112 }),
  Object.freeze({ m: 2.0, eta: 0.390455, beta: 0.010767, gap: 0.379689, eps: 9.1508e-7, kt_corr: 2.2054e-12, kt_rel: 5.648e-12, lam1_lb: 0.561112 }),
  Object.freeze({ m: 4.0, eta: 0.219245, beta: 0.010540, gap: 0.208705, eps: 5.1383e-7, kt_corr: 1.2650e-12, kt_rel: 5.770e-12, lam1_lb: 0.561112 }),
  Object.freeze({ m: 8.0, eta: 0.116807, beta: 0.010113, gap: 0.106694, eps: 2.7375e-7, kt_corr: 7.0238e-13, kt_rel: 6.013e-12, lam1_lb: 0.561112 }),
  Object.freeze({ m: 16.0, eta: 0.060382, beta: 0.009356, gap: 0.051026, eps: 1.4151e-7, kt_corr: 3.9247e-13, kt_rel: 6.500e-12, lam1_lb: 0.561112 }),
  Object.freeze({ m: 32.0, eta: 0.030711, beta: 0.008138, gap: 0.022573, eps: 7.1976e-8, kt_corr: 2.2950e-13, kt_rel: 7.473e-12, lam1_lb: 0.561112 }),
  Object.freeze({ m: 64.0, eta: 0.015489, beta: 0.006457, gap: 0.009033, eps: 3.6301e-8, kt_corr: 1.4589e-13, kt_rel: 9.419e-12, lam1_lb: 0.561112 }),
]);

// optimal shift = largest relative KT margin over the sweep (still hopelessly negligible)
export const IMP96910_OPTIMAL_SHIFT = Object.freeze({
  m: 64.0,
  kt_rel: 9.419e-12,             // max relative KT correction over the sweep
  negligibleThreshold: 1e-4,     // ~8 decades above the observed margin
  maxSepFromRitz: 6.081e-10,     // max |lam1_LB - lam1_ritz| over m (floor pinned to Ritz value)
});

export const IMP96910_VERDICT = Object.freeze({
  ticket: 'imp-96910',
  question: 'does the optimal shift m in the bounded shift-invert (K+m)^{-1} Kato-Temple reformulation maximize the KT correction margin enough to matter, and does any m escape the imp-96827 (N,T) truncation-rate dependence ?',
  sweepRange: [0.05, 64.0],
  fixed: { N: 36, Nbig: 72, T: 800 },
  // Finding 1: the KT correction is negligible for every shift
  ktCorrectionNegligibleEveryM: true,   // relative margin <= 9.4e-12 across [0.05,64]
  optimalShiftM: 64.0,                   // largest relative margin (still ~1e-11)
  optimalKtRelMargin: 9.419e-12,
  // Finding 2: the floor is pinned to the Ritz value; the shift is a no-op lever
  floorPinnedToRitzValue: true,          // lam1_LB = 0.561112 for every m (max sep 6.08e-10)
  ritzFloorT800: 0.561112,
  shiftIsNoopLever: true,                // 1/eta - m = lam1 for any m (algebraic)
  anyMEscapesNTrate: false,              // no shift escapes the imp-96827 (N,T) truncation envelope
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap: 'IMP96910_SHIFT_IS_NOOP_LEVER -- sweeping the shift m over [0.05, 64] in the bounded shift-invert (K+m)^{-1} Kato-Temple reformulation LOCATES the optimal shift (largest relative KT correction margin) at the LARGEST m, but the KT correction eps^2/(eta-beta) is negligible (relative margin <= 9.42e-12, ~8 decades below any usable threshold) for EVERY m, and the floor lam1_LB stays PINNED to the Ritz value 0.561112 (max separation 6.08e-10) throughout -- because shift-invert on a symmetric matrix is exact up to the KT correction (1/eta - m = lam1 for any m), the shift merely rescales the spectrum of R and adds no lower-bound content; NO shift escapes the imp-96827 (N,T) resolvent-truncation-rate dependence, confirming and strengthening the imp-96889 single-shift m=1 finding across the whole m axis',
  qed: false,
});
export default IMP96910_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96910_ASSERTIONS = [
  {
    id: 'imp96910-kt-correction-negligible-every-shift',
    holds: () =>
      IMP96910_SHIFT_SWEEP.every((r) => r.kt_rel < 1e-4) &&               // negligible for every m
      IMP96910_SHIFT_SWEEP.every((r) => r.kt_corr > 0) &&
      IMP96910_OPTIMAL_SHIFT.kt_rel < 1e-4 &&
      IMP96910_VERDICT.ktCorrectionNegligibleEveryM === true,
    why: 'the relative KT correction (eps^2/(eta-beta))/eta stays below 9.5e-12 across m in [0.05,64] -- ~8 decades below the 1e-4 negligibility threshold, so no shift makes the KT correction matter.',
  },
  {
    id: 'imp96910-optimal-shift-is-largest-m',
    holds: () => {
      const g = IMP96910_SHIFT_SWEEP;
      const maxRel = Math.max(...g.map((r) => r.kt_rel));
      const argmax = g.find((r) => r.kt_rel === maxRel);
      // the relative margin rises monotonically with m (optimal shift = largest m)
      let mono = true;
      for (let i = 1; i < g.length; i++) if (!(g[i].kt_rel > g[i - 1].kt_rel)) mono = false;
      return mono && argmax.m === IMP96910_OPTIMAL_SHIFT.m &&
        Math.abs(maxRel - IMP96910_OPTIMAL_SHIFT.kt_rel) < 1e-13 &&
        IMP96910_VERDICT.optimalShiftM === IMP96910_OPTIMAL_SHIFT.m;
    },
    why: 'the relative KT margin rises monotonically with the shift (5.53e-12 at m=0.05 -> 9.42e-12 at m=64), so the optimal shift is the largest m tested -- yet it is still hopelessly negligible.',
  },
  {
    id: 'imp96910-floor-pinned-to-ritz-value-every-shift',
    holds: () =>
      IMP96910_SHIFT_SWEEP.every((r) => Math.abs(r.lam1_lb - IMP96910_RITZ_FLOOR_T800) < 1e-6) &&
      IMP96910_OPTIMAL_SHIFT.maxSepFromRitz < 1e-6 &&
      IMP96910_VERDICT.floorPinnedToRitzValue === true &&
      IMP96910_VERDICT.shiftIsNoopLever === true &&
      IMP96910_VERDICT.anyMEscapesNTrate === false,
    why: 'lam1_LB = 0.561112 to 6 digits for every m (max separation from the Ritz value 6.08e-10): shift-invert is exact up to the negligible KT correction, so the shift is a no-op lever and no m escapes the imp-96827 (N,T) truncation-rate dependence.',
  },
  {
    id: 'imp96910-scout-only-no-qed',
    holds: () =>
      IMP96910_VERDICT.operatorPositivityProved === false &&
      IMP96910_VERDICT.intervalRigorousReachUnchanged === IMP96910_RIGOROUS_REACH_2A &&
      IMP96910_RIGOROUS_REACH_2A === 0.96 &&
      IMP96910_VERDICT.subGap.indexOf('IMP96910_SHIFT_IS_NOOP_LEVER') === 0 &&
      LN2 < LN3 &&
      IMP96910_VERDICT.qed === false,
    why: 'scouting only: no operator-positivity theorem, provisional beta is not a certified bound, the interval-rigorous reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96910_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96910-krein-shiftinvert-shift-sweep assertion failed: ${a.id}`);
  }
}

void LN2;
void LN3;
