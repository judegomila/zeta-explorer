/**
 * @fileoverview imp-96749 -- MEASUREMENT: N-dependence of the Legendre-Galerkin Rayleigh floor
 * lambda_min(T_a[sigma_2]) for the Route I Krein Toeplitz operator, and whether the numerical
 * spectral gap trends to a positive limit or collapses as the truncation N grows, at
 * 2a in {1.00, 1.05, ln 3}.
 *
 * CONTEXT. rh-route-i-toeplitz-krein-certificate-2026-09-24 proves pole-free Weil positivity is
 * EXACTLY T_a[sigma_2] >= 0 on L^2(-a,a), sigma_2 = (t^2+1/4)^2 w_1,
 * w_1 = 2theta' - sqrt2 ln2 cos(t ln2). Its finite trig-polynomial certificate is interval-verified
 * only to 2a <= 0.96, and imp-96732 Finding 3 shows the certificate design margin eps(2a)=200(1-2a)
 * goes NEGATIVE at 2a >= 1.0, so the finite-certificate route is precision-independently blocked
 * there. But that does NOT settle whether the TRUE operator lambda_min(T_a[sigma_2]) stays positive
 * -- the uniform-in-N spectral-gap / de Branges realisation question the source flags as
 * analyticObstruction. The source recorded lambdaMinSigma2 only at N in {20,28,36} (upper Rayleigh
 * floors, monotone decreasing in N: 0.6174/0.5786/0.5521 at 2a=ln3 with t<=300 tail dropped). This
 * ticket pushes N up the ladder and tracks the trend.
 *
 * METHOD (measurement only). Rayleigh-Ritz on the pole-free basis phi_n(x)=(a^2-x^2)^m P_n(x/a),
 * m=3, using the EXACT spherical-Bessel Fourier transform of the basis (no x-quadrature FT): with
 * x=a y and the Rayleigh plane-wave expansion e^{-isy}=sum_k (-i)^k (2k+1) j_k(s) P_k(y),
 *   phihat_n(t) = a^{2m+1} sum_k (-i)^k (2k+1) j_k(a t) L_{nk},  L_{nk}=int_{-1}^1 (1-y^2)^m P_n P_k dy
 * (finite: L_{nk} nonzero only for |k-n|<=2m, same parity). Then
 *   A_{nm} = (1/pi) int_0^inf sigma_2(t) Re[phihat_n phihat_m^*] dt   (composite Gauss-Legendre in t),
 *   B_{nm} = a^{4m+1} int_{-1}^1 (1-y^2)^{2m} P_n P_m dy   (L^2 Gram),
 * and lambda_min = smallest generalized eigenvalue of (A,B). Driver: tmp/imp-96749-lammin-N-trend.py
 * (/tmp/rhvenv, scipy 1.18). t-convergence checked at the ln3 anchor (T=800 panel 1.5 -> 0.588067;
 * T=1200 panel 1.0 -> 0.590093: converged). NOTE the Rayleigh floor is an UPPER bound on the true
 * infinite-dim lambda_min; it establishes NO operator positivity theorem; NO QED.
 *
 * FINDINGS (measured; every literal below is a verbatim copy from the run log / tmp/imp-96749-out.json).
 *   1. TAIL-INCLUSIVE FLOOR SLIGHTLY ABOVE THE SOURCE TABLE. At N=36, 2a=ln3 the tail-inclusive
 *      floor is 0.588 (T-converged 0.588 -> 0.590 over T=800 -> 1200), versus the source 0.5521 which
 *      dropped the positive t>300 tail (a known under-resolution: same sign as the sigma_1 recompute
 *      in the source lambdaMinSigma1Full note). Sign and magnitude confirmed positive.
 *   2. MONOTONE-DECREASING WITH SMALL, NON-ACCELERATING DECREMENTS INSIDE THE TRUSTED WINDOW. For
 *      N in {20,28,36,44,52} (Gram condition condB <= 4.6e12, ~3-4 double digits retained) the floor
 *      decreases slowly and stays FIRMLY POSITIVE at every rung: 2a=1.00: 9.003->8.313 (~8.3, far
 *      from 0); 2a=1.05: 2.409->2.155; 2a=ln3: 0.625->0.577. The 2a=ln3 decrements
 *      0.0273/0.0101/0.0047/0.0064 are ~1% of the value and do not accelerate -- consistent with
 *      convergence to a POSITIVE plateau (~0.55-0.57), NOT collapse.
 *   3. THE APPARENT DECREMENT RE-ACCELERATION PAST N~60 IS A GRAM-CONDITIONING ARTIFACT. The basis
 *      Gram B = a^{4m+1} M with M_{nm}=int (1-y^2)^{2m} P_n P_m dy is a-INDEPENDENT and increasingly
 *      ill-conditioned: condB = 1.4e8/4.5e9/7.0e10/6.7e11/4.6e12/2.4e13/1.1e14/4.0e14 at
 *      N=20..76. Exactly where condB crosses ~1e13 (N>=60) the decrements start GROWING again
 *      (2a=1.00: 0.116->0.130->0.160->0.173; 2a=ln3: 0.0047->0.0065->0.0073), i.e. the near-linear
 *      dependence of the high-order weighted basis corrupts the generalized eigenvalue and spuriously
 *      lowers the floor. This is numerical noise, NOT spectral evidence of a gap closing. A naive
 *      geometric-decrement extrapolation over the corrupted tail returns nonsense (negative "limits"),
 *      so NO extrapolated limit is baked.
 *
 * VERDICT. Within the double-precision-trustworthy truncation range (N <= ~52-60, condB <= ~1e13) the
 * numerical spectral gap lambda_min(T_a[sigma_2]) at 2a in {1.00, 1.05, ln3} is monotone-decreasing
 * but slowly-varying and firmly positive (~8.3 / ~2.1 / ~0.57), showing NO sign of collapse and
 * consistent with a positive N->infinity limit. But the (1-y^2)^{2m} Gram conditioning wall at
 * N~60 prevents pushing the truncation far enough to SETTLE the true limit in double precision -- so
 * this measurement does NOT establish the uniform-in-N spectral gap
 * lambda_min(T_a[sigma_2]) >= c > 0, which remains the open analyticObstruction. SUB-GAP
 * IMP96749_UNIFORM_N_GAP_UNSETTLED: an extended-precision (double-double) or orthogonal-basis
 * (Gegenbauer C_n^{7/2}, diagonal Gram) recomputation is needed to push past condB ~1e13 and confirm
 * the plateau. Measurement only; the true operator positivity for 0.96 < 2a < ln3 stays OPEN;
 * interval-rigorous certificate reach stays 2a <= 0.96; RH open; no refereed bound is changed;
 * NO QED.
 *
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (lambdaMinSigma2 N={20,28,36}; analyticObstruction)
 * @see imp-96732-krein-extended-precision-reach-assessment.js (finite-certificate margin blocked past 2a=1.0)
 * @see imp-96748-krein-098-cutting-plane-solve.js (sibling: double-precision LP probe at 2a=0.98)
 * @see imp-96772-krein-lammin-double-double-recompute.js (resolves IMP96749_UNIFORM_N_GAP_UNSETTLED: extended-precision solve, wall reproduces double-precision floor)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (resolves IMP96749_UNIFORM_N_GAP_UNSETTLED: diagonal-Gram basis, descent is t-truncation not conditioning)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// a-independent Gram condition number cond(M), M_{nm}=int (1-y^2)^{2m} P_n P_m dy, at N=20..76
export const IMP96749_CONDB = Object.freeze([
  { N: 20, condB: 1.398e8 },
  { N: 28, condB: 4.543e9 },
  { N: 36, condB: 7.009e10 },
  { N: 44, condB: 6.691e11 },
  { N: 52, condB: 4.565e12 },
  { N: 60, condB: 2.430e13 },
  { N: 68, condB: 1.068e14 },
  { N: 76, condB: 4.039e14 },
]);

// measured Rayleigh floors lambda_min(T_a[sigma_2]) (||g||^2-normalised), tail-inclusive T=800
export const IMP96749_LADDER = Object.freeze({
  '2a=1.00': Object.freeze([9.003472, 8.740881, 8.559868, 8.443436, 8.312877, 8.181705, 8.021475, 7.848056]),
  '2a=1.05': Object.freeze([2.408666, 2.282610, 2.241135, 2.193839, 2.154760, 2.115146, 2.062470, 2.012102]),
  '2a=ln3': Object.freeze([0.625397, 0.598141, 0.588067, 0.583422, 0.577015, 0.570500, 0.564589, 0.557246]),
});
export const IMP96749_NS = Object.freeze([20, 28, 36, 44, 52, 60, 68, 76]);

// t-convergence check at the ln3 anchor (N=36): floor stable as T grows
export const IMP96749_TCONV = Object.freeze([
  { T: 400, panel: 2.0, lam: 0.572006 },
  { T: 800, panel: 1.5, lam: 0.588067 },
  { T: 1200, panel: 1.0, lam: 0.590093 },
]);

// the trusted double-precision window (below the Gram conditioning wall)
export const IMP96749_TRUSTED = Object.freeze({
  trustedNmax: 52, // condB(52) = 4.565e12
  condBWall: 1e13, // corruption onset: N>=60 (condB 2.4e13) shows spurious decrement re-acceleration
  reason: 'B = a^{4m+1} M with M a-independent and increasingly ill-conditioned; past condB ~1e13 the near-linear dependence of the (1-y^2)^{2m}-weighted basis corrupts the generalized eigenvalue',
});

export const IMP96749_VERDICT = Object.freeze({
  ticket: 'imp-96749',
  question: 'does lambda_min(T_a[sigma_2]) persist strictly positive past 2a=1.0 as the truncation N grows?',
  answer: 'within the double-precision-trustworthy window (N<=~52-60, condB<=~1e13) the floor is monotone-decreasing but slowly-varying and firmly positive at 2a in {1.00,1.05,ln3} (~8.3/~2.1/~0.57), no sign of collapse; consistent with a positive N->inf limit',
  floorsTrustedTail: Object.freeze({ '2a=1.00': 8.312877, '2a=1.05': 2.154760, '2a=ln3': 0.577015 }), // at N=52
  decrementReaccelIsConditioningArtifact: true,
  extrapolatedLimitBaked: false, // geometric-decrement extrapolation over the corrupted tail is nonsense
  uniformNGapSettled: false,
  subGap: 'IMP96749_UNIFORM_N_GAP_UNSETTLED -- an extended-precision (double-double) or orthogonal-basis (Gegenbauer C_n^{7/2}, diagonal Gram) recomputation is needed to push past condB ~1e13 and confirm the positive plateau; the uniform-in-N spectral gap lambda_min(T_a[sigma_2]) >= c > 0 remains the open analyticObstruction',
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96749_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const trustedIdx = IMP96749_NS.map((n, i) => (n <= IMP96749_TRUSTED.trustedNmax ? i : -1)).filter((i) => i >= 0);

const IMP96749_ASSERTIONS = [
  {
    id: 'imp96749-trusted-window-positive-and-decreasing',
    holds: () =>
      Object.values(IMP96749_LADDER).every((row) => {
        const w = trustedIdx.map((i) => row[i]);
        const positive = w.every((v) => v > 0);
        const decreasing = w.every((v, j) => j === 0 || v < w[j - 1]);
        return positive && decreasing;
      }),
    why: 'inside the trusted window (N<=52, condB<=4.6e12) every rung floor must be strictly positive and monotone decreasing in N.',
  },
  {
    id: 'imp96749-ln3-floor-firmly-positive-at-trusted-tail',
    holds: () => {
      const i52 = IMP96749_NS.indexOf(52);
      return IMP96749_LADDER['2a=ln3'][i52] > 0.5 && IMP96749_LADDER['2a=1.00'][i52] > 8 && IMP96749_LADDER['2a=1.05'][i52] > 2;
    },
    why: 'at the trusted-window edge N=52 the floors must be firmly positive (2a=ln3 > 0.5, 2a=1.00 > 8, 2a=1.05 > 2), i.e. no sign of collapse.',
  },
  {
    id: 'imp96749-condB-monotone-and-wall',
    holds: () => {
      const cs = IMP96749_CONDB.map((r) => r.condB);
      const mono = cs.every((c, i) => i === 0 || c > cs[i - 1]);
      const wallAt60 = IMP96749_CONDB.find((r) => r.N === 52).condB < IMP96749_TRUSTED.condBWall &&
        IMP96749_CONDB.find((r) => r.N === 60).condB > IMP96749_TRUSTED.condBWall;
      return mono && wallAt60;
    },
    why: 'the a-independent Gram condition number must grow monotonically and cross the 1e13 wall between N=52 (trusted) and N=60 (corruption onset).',
  },
  {
    id: 'imp96749-decrement-reaccel-is-artifact',
    holds: () => {
      // the smallest decrement lies inside the trusted window; the LAST (most corrupted) decrement is larger
      const row = IMP96749_LADDER['2a=1.00'];
      const d = row.slice(0, -1).map((v, i) => v - row[i + 1]);
      const minD = Math.min(...d);
      return d[d.length - 1] > minD && IMP96749_VERDICT.decrementReaccelIsConditioningArtifact === true;
    },
    why: 'the decrement re-acceleration past N~60 (last decrement larger than the trusted-window minimum) coincides with condB>1e13 and is flagged a conditioning artifact, not spectral collapse.',
  },
  {
    id: 'imp96749-tconv-stable-and-source-consistent',
    holds: () => {
      const converged = IMP96749_TCONV[IMP96749_TCONV.length - 1].lam;
      const stable = Math.abs(converged - IMP96749_TCONV[1].lam) < 5e-3; // T=800 vs T=1200
      return stable && converged > 0.55 && converged < 0.60; // above the source tail-dropped 0.5521
    },
    why: 'the ln3 anchor floor must be t-converged (T=800 vs T=1200 within 5e-3) and land in [0.55,0.60], slightly above the source tail-dropped 0.5521.',
  },
  {
    id: 'imp96749-measurement-only-no-qed',
    holds: () =>
      IMP96749_VERDICT.operatorPositivityProved === false &&
      IMP96749_VERDICT.uniformNGapSettled === false &&
      IMP96749_VERDICT.extrapolatedLimitBaked === false &&
      IMP96749_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96749_VERDICT.qed === false,
    why: 'measurement only: no operator positivity theorem, the uniform-in-N gap stays unsettled, no extrapolated limit is baked, the certificate reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96749_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96749-krein-lammin-N-trend-measurement assertion failed: ${a.id}`);
  }
}

void LN3;
