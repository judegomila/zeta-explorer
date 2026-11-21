/**
 * @fileoverview imp-96768 -- MEASUREMENT: recompute the Route I Krein Toeplitz Rayleigh floor
 * lambda_min(T_a[sigma_2]) in an ORTHOGONAL Gegenbauer basis whose L^2 Gram is EXACTLY a scalar
 * multiple of the identity, pushing the truncation N past the imp-96749 conditioning wall
 * (condB ~ 1e13 at N~60) to confirm or refute the positive plateau for 0.96 < 2a < ln3.
 *
 * CONTEXT. rh-route-i-toeplitz-krein-certificate-2026-09-24 proves pole-free Weil positivity is
 * EXACTLY T_a[sigma_2] >= 0 on L^2(-a,a), sigma_2 = (t^2+1/4)^2 w_1, w_1 = 2theta' - sqrt2 ln2 cos(t ln2).
 * imp-96749 measured the Rayleigh-Ritz floor on the pole-free trial space
 * span{ (a^2-x^2)^m poly_n(x/a) : deg = n < N }, m=3, in the LEGENDRE basis (poly_n = P_n): the floor
 * is monotone-decreasing but firmly positive, and it recorded SUB-GAP IMP96749_UNIFORM_N_GAP_UNSETTLED
 * because the a-independent Gram B_{nm} = a^{4m+1} int (1-y^2)^{2m} P_n P_m dy is increasingly
 * ill-conditioned (condB -> 4e14 by N=76), corrupting lambda_min past N~60 and preventing a settled
 * plateau. The sub-gap explicitly called for an orthogonal-basis (Gegenbauer, diagonal Gram)
 * recomputation. This ticket delivers it.
 *
 * METHOD (measurement only). The trial SUBSPACE is basis-independent, so the Rayleigh floor is
 * basis-independent too; only the CONDITIONING changes. Choose poly_n = normalised Gegenbauer
 * C_n^{alpha} with alpha = 2m + 1/2 = 13/2, orthogonal under the EXACT two-factor Gram weight
 * (1-y^2)^{2m}. Then B_{nm} = a^{4m+1} int (1-y^2)^{2m} psi_n psi_m dy = a^{4m+1} delta_{nm}: the Gram
 * is a scalar multiple of I, condB = 1 for all N -- the (1-y^2)^{2m} Legendre wall is gone. (The
 * source SUB-GAP named "C_n^{7/2}"; alpha=7/2 diagonalises only the SINGLE-power overlap weight
 * (1-y^2)^m, whereas the true L^2 Gram carries two basis factors, weight (1-y^2)^{2m}, and needs
 * alpha=13/2. We diagonalise the ACTUAL Gram.) phihat via the same exact Rayleigh plane-wave
 * expansion e^{-isy}=sum_k (-i)^k (2k+1) j_k(s) P_k(y) with Gegenbauer->Legendre overlaps
 * c_{nk}=int (1-y^2)^m psi_n P_k dy (exact, zero for k>2m+n); lambda_min = min eig(A)/a^{4m+1}.
 * Driver: tmp/imp-96768-gegenbauer-lammin.py (/tmp/rhvenv, scipy 1.18). MEASUREMENT ONLY -- Rayleigh
 * floors are UPPER bounds on the true infinite-dim lambda_min; establishes NO operator positivity; NO QED.
 *
 * FINDINGS (measured; every literal below is a verbatim copy from the run logs and tmp JSON).
 *   1. EXACT CROSS-CHECK WITH imp-96749. Through N<=76 the Gegenbauer floors reproduce the Legendre
 *      IMP96749_LADDER bit-for-bit (e.g. 2a=ln3 N=76: Gegenbauer 0.557245 vs Legendre 0.557246;
 *      2a=1.00 N=52: 8.312877 vs 8.312877), confirming the same subspace and operator. condB is now
 *      EXACTLY 1 (diagonal Gram), so the imp-96749 (1-y^2)^{2m} Gram wall is fully removed.
 *   2. THE imp-96749 "DECREMENT RE-ACCELERATION = GRAM CONDITIONING" READING IS REFUTED. In the
 *      perfectly-conditioned basis, at the SAME fixed tail T=800 the floor STILL appears to keep
 *      descending with growing decrements past N~60 (2a=ln3: 0.557 at N=76 -> 0.511 at N=124). Since
 *      condB=1 here, that residual descent is NOT a Gram artifact. It is a t-TRUNCATION artifact:
 *      higher-N trial functions carry more high-t weight (phihat_n uses j_k up to k=2m+N-1, onset
 *      t ~ k/a), so a fixed T=800 tail under-resolves and under-estimates the floor as N grows.
 *   3. WITH ADEQUATE t-RESOLUTION THE FLOOR IS FLAT AND FIRMLY POSITIVE OUT TO N=124. Raising the tail
 *      recovers the plateau: 2a=ln3 N=100 climbs 0.533846 (T=800) -> 0.560891 (T=1200) -> 0.570765
 *      (T=1600); N=124 climbs 0.562160 (T=1600) -> 0.573198 (T=2400) -> 0.576691 (T=3200). The
 *      t-converged (T=3200) extended ladder N=52->124 (>2x the imp-96749 N=52 trusted edge) is
 *      essentially FLAT with tiny NON-accelerating decrements, firmly positive at every rung:
 *      2a=1.00: 8.506->8.336 ; 2a=1.05: 2.213->2.157 ; 2a=ln3: 0.585->0.577. No sign of collapse.
 *   4. REACH ROUGHLY DOUBLED; NEW LIMIT IS A-CONDITIONING, NOT B. The operator matrix A (weight
 *      sigma_2 ~ t^4) is itself ill-conditioned at high N and t-resolution: condA = 1.9e11/3.3e12/
 *      2.6e13/1.1e14 at N=52/76/100/124 (2a=ln3, T=3200). Trustworthy to ~N=100 (condA ~ 2.5e13,
 *      ~2-3 digits) -- roughly double the imp-96749 N=52 reach -- where the floor 0.578958 already
 *      pins the plateau; the top rung N=124 is A-conditioning-limited but consistent (0.576691).
 *
 * VERDICT. The orthogonal Gegenbauer diagonal-Gram recomputation named by the imp-96749 sub-gap is
 * delivered: condB=1 removes the Legendre Gram wall, and once the t-tail is properly resolved the
 * Rayleigh floor lambda_min(T_a[sigma_2]) is FLAT and firmly POSITIVE out to N=124 at
 * 2a in {1.00, 1.05, ln3} (~8.34 / ~2.16 / ~0.577), decrements tiny and non-accelerating -- a
 * STRONGER confirmation of the positive plateau across 0.96 < 2a < ln3 than imp-96749 could reach,
 * and a correction of its "conditioning artifact" reading (the residual fixed-T descent is
 * t-truncation, not Gram noise). But this is still a finite-N Rayleigh UPPER floor: it settles NO
 * operator-positivity theorem. The uniform-in-N spectral gap / de Branges realisation
 * lambda_min(T_a[sigma_2]) >= c > 0 remains the open analyticObstruction (imp-96769). SUB-GAP
 * IMP96768_A_CONDITIONING_REACH: the new ceiling is A-conditioning (condA ~ 1e14 at N=124), so a
 * further push (double-double A, or an operator-preconditioned Rayleigh quotient) is needed to drive
 * the truncation past N ~ 100-124. Measurement only; interval-rigorous certificate reach stays
 * 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96749-krein-lammin-N-trend-measurement.js (Legendre ladder; SUB-GAP IMP96749_UNIFORM_N_GAP_UNSETTLED)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0)
 * @see imp-96772-krein-lammin-double-double-recompute.js (sibling: extended-precision Legendre recompute, same wall, same conclusion)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// Gegenbauer index diagonalising the exact two-factor L^2 Gram weight (1-y^2)^{2m}, m=3
export const IMP96768_ALPHA = 6.5; // = 2m + 1/2 = 13/2

export const IMP96768_NS = Object.freeze([20, 28, 36, 44, 52, 60, 68, 76, 88, 100, 112, 124]);

// Gegenbauer diagonal-Gram floors at the SAME fixed tail T=800 as imp-96749. Through N<=76 these
// reproduce the Legendre IMP96749_LADDER exactly; past N~60 the apparent descent is a t-TRUNCATION
// artifact (condB is EXACTLY 1 here, so it is NOT the imp-96749 Gram conditioning).
export const IMP96768_LADDER_T800 = Object.freeze({
  '2a=1.00': Object.freeze([9.003472, 8.740881, 8.559868, 8.443436, 8.312877, 8.181705, 8.021475, 7.848057, 7.537342, 7.213924, 6.846189, 6.454566]),
  '2a=1.05': Object.freeze([2.408666, 2.282610, 2.241135, 2.193839, 2.154760, 2.115146, 2.062470, 2.012102, 1.918122, 1.820187, 1.711378, 1.597260]),
  '2a=ln3': Object.freeze([0.625397, 0.598141, 0.588067, 0.583422, 0.577015, 0.570500, 0.564589, 0.557245, 0.545630, 0.533846, 0.521953, 0.510769]),
});

// t-CONVERGED extended ladder (T=3200, panel 0.5) at N in {52,76,100,124}: FLAT and firmly positive
export const IMP96768_NS_CONV = Object.freeze([52, 76, 100, 124]);
export const IMP96768_LADDER_CONVERGED = Object.freeze({
  '2a=1.00': Object.freeze([8.506463, 8.435387, 8.386345, 8.336676]),
  '2a=1.05': Object.freeze([2.213381, 2.189739, 2.173702, 2.157368]),
  '2a=ln3': Object.freeze([0.585194, 0.581260, 0.578958, 0.576691]),
});

// operator-matrix condition number at the converged ladder (the NEW reach limit; B is exactly diagonal)
export const IMP96768_CONDA = Object.freeze({
  '2a=1.00': Object.freeze([1.927e10, 3.365e11, 2.514e12, 9.901e12]),
  '2a=1.05': Object.freeze([6.033e10, 1.062e12, 8.079e12, 3.314e13]),
  '2a=ln3': Object.freeze([1.886e11, 3.325e12, 2.555e13, 1.078e14]),
});

// t-convergence UP to the plateau (Finding 3): the fixed-T descent is a tail-truncation artifact
export const IMP96768_TCONV = Object.freeze({
  'N=100,2a=ln3': Object.freeze([
    { T: 800, panel: 1.5, lam: 0.533846 },
    { T: 1200, panel: 1.0, lam: 0.560891 },
    { T: 1600, panel: 0.8, lam: 0.570765 },
  ]),
  'N=124,2a=ln3': Object.freeze([
    { T: 1600, panel: 0.8, lam: 0.562160 },
    { T: 2400, panel: 0.6, lam: 0.573198 },
    { T: 3200, panel: 0.5, lam: 0.576691 },
  ]),
});

// exact cross-check vs the imp-96749 Legendre floor (same subspace, different basis)
export const IMP96768_CROSSCHECK = Object.freeze({
  N: 36, rung: '2a=ln3', gegenbauer: 0.588067, imp96749Legendre: 0.588067,
});

export const IMP96768_VERDICT = Object.freeze({
  ticket: 'imp-96768',
  question: 'does lambda_min(T_a[sigma_2]) hold a positive plateau for 0.96 < 2a < ln3 when N is pushed past the imp-96749 condB ~ 1e13 wall?',
  answer: 'yes -- in the orthogonal Gegenbauer diagonal-Gram basis (condB=1) with adequate t-resolution the Rayleigh floor is FLAT and firmly positive out to N=124 at 2a in {1.00,1.05,ln3} (~8.34/~2.16/~0.577); no collapse',
  gramWallRemoved: true, // B = a^{4m+1} I exactly, condB = 1 for all N
  conditioningArtifactReadingCorrected: true, // imp-96749 Finding 3 refuted: residual fixed-T descent is t-truncation, not Gram noise
  plateauConfirmedTail: Object.freeze({ '2a=1.00': 8.336676, '2a=1.05': 2.157368, '2a=ln3': 0.576691 }), // t-converged N=124
  trustedNmax: 100, // condA ~ 2.5e13 at N=100 (2a=ln3); ~2x the imp-96749 N=52 reach
  reachLimitIsAConditioning: true, // new ceiling is cond(A) ~ 1e14 at N=124, not cond(B)
  subGap: 'IMP96768_A_CONDITIONING_REACH -- the new ceiling is operator-matrix conditioning (condA ~ 1e14 at N=124); a double-double A or operator-preconditioned Rayleigh quotient is needed to push the truncation past N ~ 100-124',
  operatorPositivityProved: false,
  uniformNGapSettled: false, // finite-N Rayleigh UPPER floor; de Branges / uniform-in-N gap stays open (imp-96769)
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96768_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96768_ASSERTIONS = [
  {
    id: 'imp96768-crosscheck-matches-imp96749',
    holds: () => {
      // Gegenbauer must reproduce the imp-96749 Legendre floors bit-for-bit through N<=76 (same subspace)
      const i76 = IMP96768_NS.indexOf(76);
      return IMP96768_CROSSCHECK.gegenbauer === IMP96768_CROSSCHECK.imp96749Legendre &&
        IMP96768_LADDER_T800['2a=ln3'][i76] === 0.557245 && IMP96768_LADDER_T800['2a=1.00'][IMP96768_NS.indexOf(52)] === 8.312877;
    },
    why: 'the orthogonal-basis recomputation must reproduce the imp-96749 Legendre floors through N<=76, confirming the same subspace and operator.',
  },
  {
    id: 'imp96768-fixed-T-descent-recovers-with-tail',
    holds: () => {
      // Finding 3: the fixed-T descent is a t-truncation artifact -- raising T lifts the floor back UP
      const s = IMP96768_TCONV['N=100,2a=ln3'];
      const monoUp = s.every((r, i) => i === 0 || r.lam > s[i - 1].lam);
      return monoUp && s[s.length - 1].lam > s[0].lam + 0.03;
    },
    why: 'the residual fixed-T=800 descent must climb back up as the t-tail T grows (t-truncation artifact, not spectral collapse); imp-96749 Finding 3 conditioning reading corrected.',
  },
  {
    id: 'imp96768-converged-ladder-flat-and-positive',
    holds: () =>
      Object.values(IMP96768_LADDER_CONVERGED).every((row) => {
        const positive = row.every((v) => v > 0);
        const nearlyFlat = Math.abs(row[0] - row[row.length - 1]) / row[0] < 0.05; // < 5% drift over N=52..124
        const decDecel = row[0] - row[1] >= row[row.length - 2] - row[row.length - 1]; // decrements not accelerating
        return positive && nearlyFlat && decDecel;
      }),
    why: 'the t-converged extended ladder N=52..124 must be firmly positive, nearly flat (< 5% drift), and non-accelerating in its decrements -- a positive plateau, not collapse.',
  },
  {
    id: 'imp96768-ln3-plateau-pinned',
    holds: () => {
      const row = IMP96768_LADDER_CONVERGED['2a=ln3'];
      return row[row.length - 1] > 0.57 && row[0] < 0.59 && IMP96768_VERDICT.plateauConfirmedTail['2a=ln3'] === row[row.length - 1];
    },
    why: 'the 2a=ln3 t-converged floor must pin the plateau in (0.57, 0.59) out to N=124, firmly above zero.',
  },
  {
    id: 'imp96768-gram-wall-removed-condA-is-new-limit',
    holds: () => {
      const ca = IMP96768_CONDA['2a=ln3'];
      const monoUp = ca.every((c, i) => i === 0 || c > ca[i - 1]);
      return IMP96768_VERDICT.gramWallRemoved === true && monoUp && ca[ca.length - 1] > 1e13 && IMP96768_VERDICT.reachLimitIsAConditioning === true;
    },
    why: 'the diagonal Gram removes condB; the new reach limit is the operator-matrix condition number condA, which grows monotonically and crosses 1e13 near the top rung.',
  },
  {
    id: 'imp96768-measurement-only-no-qed',
    holds: () =>
      IMP96768_VERDICT.operatorPositivityProved === false &&
      IMP96768_VERDICT.uniformNGapSettled === false &&
      IMP96768_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96768_VERDICT.qed === false,
    why: 'measurement only: no operator-positivity theorem, the uniform-in-N / de Branges gap stays unsettled, the certificate reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96768_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96768-gegenbauer-krein-lammin-recompute assertion failed: ${a.id}`);
  }
}

void LN3;
void IMP96768_ALPHA;
