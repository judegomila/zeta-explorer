/**
 * @module imp-97206-krein-csharp-coupled-nt-jointlimit
 * @fileoverview imp-97206 -- MEASUREMENT: a COUPLED N,T joint-limit extrapolation of the Krein Rayleigh
 *   floor c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3, to decide whether the finite-N/finite-T
 *   brackets stabilise at a positive limit (coercivity plausible) or descend toward 0. imp-97183 found the
 *   two truncations push lambda_min in OPPOSITE directions -- at fixed T=800 the N-ladder keeps descending
 *   0.625 -> 0.504 (still moving at N=132), but a T-sweep at N=100 LIFTS the floor 0.534 -> 0.578 toward
 *   ~0.58 -- and left SUB-GAP IMP97183_CSHARP_LIMIT_NEEDS_COUPLED_NT_LOWER_BOUND: no coupled N,T
 *   extrapolation was attempted. This leaf runs one.
 *
 *   MEASUREMENT ONLY. Rayleigh-Ritz floors are UPPER bounds on the true infinite-dim lambda_min; a coupled
 *   extrapolant is still a measured value, NOT a certified floor. Establishes NO operator positivity and
 *   produces NO rigorous lower bound; interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * WHAT WAS RUN (tmp/imp-97206-coupled-NT-jointlimit.py, reusing the imp-97183 extended-precision build).
 *   The pole-free basis phi_n(x) = (a^2-x^2)^m P_n(x/a), m=3, at a=ln3/2, mpmath dps=50 entries (past
 *   condB ~ 1e30). The nested basis lets A,B be built ONCE at Nmax=132 per T and sliced to every N, so the
 *   whole 6x4 grid N in {52,68,84,100,116,132} x T in {800,1600,2400,3200} costs just four
 *   extended-precision builds. Two-stage coupled extrapolation in the well-posed order (inner T first
 *   removes the t-truncation artifact, so the outer N-sequence is a genuine Rayleigh-Ritz sequence):
 *     Stage 1 (inner, per N): fit lambda_min(N,T) = Linf_N - C_N T^{-p} -> lambda_min(N,inf).
 *     Stage 2 (outer): extrapolate lambda_min(N,inf) as N -> inf.
 *
 * FINDING 1 -- THE FULL N x T GRID SHOWS THE t-ARTIFACT SHRINKING UNIFORMLY IN N. At each fixed N the
 *   floor RISES with T; at each fixed T it descends with N, but the descent FLATTENS as T grows: the
 *   N=52..132 spread at fixed T collapses from 0.0732 (T=800) to 0.0094 (T=3200). Raising T removes the
 *   positive sigma_2-tail mass the higher modes concentrate at large t, which was the entire source of the
 *   imp-97183 fixed-T=800 N-descent.
 *
 * FINDING 2 -- ONCE T -> inf IS TAKEN FIRST, lambda_min(N,inf) STABILISES AT A FLAT POSITIVE PLATEAU
 *   ~0.582, WITH NO DESCENT. The inner-extrapolated values on the reliable band (N=84,100,116,132, where
 *   the T-deficit exponent p in [1.77,2.44] is a genuine power law) are 0.581418, 0.581059, 0.581624,
 *   0.582646 -- essentially constant (plateau 0.581687 +/- 0.000590) and if anything slightly INCREASING
 *   in N, not descending. The imp-97183 worry that the fixed-T descent might head to 0 is thus resolved as
 *   a pure t-truncation artifact: with the t-tail removed, the Ritz upper-bound sequence does NOT descend
 *   toward 0 -- it settles at ~0.582. (The N=52,68 inner fits are DISCARDED: their T-convergence is too
 *   flat, p in {0.09,0.19}, so the power fit degenerates and reports a spurious ~0.64.)
 *
 * FINDING 3 -- THE TWO TRUNCATIONS ARE NON-SEPARABLE, WHICH IS WHY THE COUPLED RUN WAS NEEDED. A naive
 *   separable corner estimate lam(inf,T0)+lam(N0,inf)-lam(N0,T0) reads only 0.5149, because it attributes
 *   the fixed-T=800 N-descent to a genuine f(N) and extrapolates the still-t-artifacted T=800 ladder to a
 *   too-low lam(inf,800)=0.4676. Its disagreement with the coupled two-stage plateau (0.582) is the
 *   quantitative signature of coupling: a one-truncation-at-a-time reading is biased LOW by ~0.07. A
 *   power-law outer fit N^{-q} degenerates (q ~ -0.01) precisely because the plateau is flat, so it is not
 *   used either; the defensible outer estimates are the plateau mean and the linear-in-1/N intercept.
 *
 * VERDICT. The coupled N,T joint limit of c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 EXTRAPOLATES
 *   TO ~0.582 (robust range [0.5817, 0.5842] from the plateau mean and the linear-in-1/N intercept),
 *   clearly POSITIVE and far from any zero-crossing. Coercivity is PLAUSIBLE and the imp-97183
 *   still-descending-at-fixed-T signal is explained away as a t-truncation artifact. This remains a
 *   MEASUREMENT: the finite-(N,T) floors are Rayleigh-Ritz UPPER bounds on the true lambda_min (true value
 *   lies at or below the plateau, so a positive plateau is consistent with -- but does not certify --
 *   positivity). A rigorous lower bound still needs a complementary lower-bound eigenvalue method
 *   (spectral-gap enclosure) or a direct analytic coercivity / de Branges realisation P_a M_sigma2 P_a >=
 *   c*I. SUB-GAP IMP97206_CSHARP_COUPLED_LIMIT_NEEDS_RIGOROUS_LOWER_BOUND (the coupled limit is now
 *   MEASURED positive; certifying it stays open). No operator positivity; no bound moves; interval-rigorous
 *   reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97183-krein-csharp-extprec-ladder.js (the opposite-direction N/T brackets; SUB-GAP this leaf addresses)
 * @see imp-97161-krein-concentration-lower-bound-assessment.js (c_sharp = lambda_min(P_a M_sigma2 P_a) is the extremal quantity)
 * @see imp-97121-krein-uniform-n-floor-certificate-scope.js (floors are Rayleigh-Ritz upper bounds; coupled N/T tails)
 * @see rh-route-i-toeplitz-krein-certificate-2026-09-24.js (pole-free Weil positivity = T_a[sigma_2] >= 0; reach 2a<=0.96)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97206_BINDING_2A = LN3;
export const IMP97206_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement
export const IMP97206_DPS = 50; // mpmath extended-precision entries -- past condB ~ 1e30

// FINDING 1 -- the full N x T grid of Rayleigh-Ritz floors (UPPER bounds on c_sharp), dps=50, panel=1.5.
// Rows are fixed T; columns are N. At fixed N the floor rises with T; at fixed T it descends with N, but
// the N-descent FLATTENS as T grows (the N-spread collapses 0.0732 -> 0.0094).
export const IMP97206_GRID = Object.freeze([
  { T: 800, byN: { 52: 0.577015, 68: 0.564589, 84: 0.549347, 100: 0.533846, 116: 0.518312, 132: 0.503767 } },
  { T: 1600, byN: { 52: 0.584110, 68: 0.579897, 84: 0.575381, 100: 0.570766, 116: 0.565204, 132: 0.558884 } },
  { T: 2400, byN: { 52: 0.584967, 68: 0.581848, 84: 0.579247, 100: 0.577134, 116: 0.574650, 132: 0.571618 } },
  { T: 3200, byN: { 52: 0.585194, 68: 0.582371, 84: 0.580315, 100: 0.578954, 116: 0.577514, 132: 0.575779 } },
]);

// FINDING 2 -- Stage-1 inner T -> inf extrapolant per N (fit lam = Linf - C T^{-p}). The reliable band is
// N>=84 (deficit a genuine power law, p in [1.77,2.44]); N=52,68 are DISCARDED (flat T-convergence,
// p<0.2, fit degenerates to a spurious ~0.64). The reliable values form a flat positive plateau ~0.582.
export const IMP97206_STAGE1_LAM_N_INF = Object.freeze([
  { N: 52, lamNinf: 0.645194, deficitExp: 0.09, reliable: false }, // T-convergence too flat -> fit degenerate
  { N: 68, lamNinf: 0.642371, deficitExp: 0.19, reliable: false }, // T-convergence too flat -> fit degenerate
  { N: 84, lamNinf: 0.581418, deficitExp: 2.44, reliable: true },
  { N: 100, lamNinf: 0.581059, deficitExp: 2.25, reliable: true },
  { N: 116, lamNinf: 0.581624, deficitExp: 1.99, reliable: true },
  { N: 132, lamNinf: 0.582646, deficitExp: 1.77, reliable: true }, // slightly ABOVE N=84, not below
]);

export const IMP97206_PLATEAU_MEAN = 0.581687; // mean of the reliable-band lam(N,inf), N=84..132
export const IMP97206_PLATEAU_STD = 0.000590; // spread of the plateau -- tight, no trend
export const IMP97206_LSTAR_LINEAR_1OVER_N = 0.584182; // outer linear-in-1/N intercept (slight upward drift)

// Cross-checks that are DISCARDED, with the reason -- both confirm the coupled two-stage reading:
export const IMP97206_CROSSCHECKS = Object.freeze({
  powerLawOuter: 0.281059, // q ~ -0.01: DEGENERATE because the plateau is flat -> power model inapplicable
  powerLawExponentQ: -0.01,
  separableCorner: 0.514862, // UNDER-reads: attributes the t-artifact N-descent to a genuine f(N)
  separableLamInfT800: 0.4676, // the too-low T=800 ladder extrapolant that biases the separable estimate
  separableBiasVsCoupled: -0.067, // ~-0.07 low -> the quantitative signature of NON-separability
});

// robust joint extrapolant: the plateau mean and the linear-in-1/N intercept (the two defensible outer
// estimates); the power-law and separable readings are diagnostics, not part of the range.
export const IMP97206_JOINT_INTERVAL = Object.freeze([0.5817, 0.5842]);
export const IMP97206_JOINT_EXTRAPOLANT = 0.582;

export const IMP97206_VERDICT = Object.freeze({
  ticket: 'imp-97206',
  question:
    'does a COUPLED N,T joint-limit extrapolation of c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 stabilise at a positive limit (coercivity plausible) or continue toward 0, given that imp-97183 found the N- and T-truncations push lambda_min in OPPOSITE directions?',
  answer:
    'a 6x4 grid (N in {52..132} x T in {800..3200}, dps=50) with the well-posed two-stage extrapolation (inner T->inf per N, then outer N->inf) gives a joint extrapolant ~0.582 (robust range [0.5817,0.5842]), clearly POSITIVE and far from any zero-crossing. Once T->inf is taken FIRST -- removing the t-truncation artifact that was the entire source of the imp-97183 fixed-T=800 N-descent -- the inner-extrapolated lambda_min(N,inf) on the reliable band N=84..132 is a FLAT plateau 0.581687 +/- 0.000590, if anything slightly INCREASING in N (0.581418 -> 0.582646), NOT descending toward 0. The two truncations are NON-separable: a naive separable corner reads only 0.5149 (biased ~0.07 low), and a power-law outer fit degenerates (q ~ -0.01) precisely because the plateau is flat -- both confirm the coupled reading is required. Coercivity is PLAUSIBLE, but this stays a MEASUREMENT: Rayleigh-Ritz floors are UPPER bounds, so the positive plateau is consistent with -- not proof of -- a positive infimum.',
  binding_2a: LN3,
  dps: 50,
  gridBuiltOncePerT_thenSliced: true, // nested basis: four builds cover the whole 6x4 grid
  nSpreadCollapsesAsTgrows: true, // 0.0732 (T=800) -> 0.0094 (T=3200)
  innerTinfPlateauIsFlatPositive: true, // lam(N,inf) ~0.582 over N=84..132, std 0.00059
  plateauSlightlyIncreasingNotDescending: true, // 0.581418 (N=84) -> 0.582646 (N=132)
  fixedTdescentExplainedAsTruncationArtifact: true, // resolves the imp-97183 head-to-0 worry
  smallNInnerFitsDiscarded: true, // N=52,68: T-convergence too flat (p<0.2), fit degenerate
  truncationsAreNonSeparable: true, // separable corner 0.5149 vs coupled 0.582
  powerLawOuterFitDegenerate: true, // q ~ -0.01 on flat plateau data -> not used
  jointExtrapolant: 0.582,
  jointInterval: [0.5817, 0.5842],
  zeroCrossingObserved: false, // neither observed nor approached
  coercivityPlausible: true, // measured joint limit ~0.582 > 0
  rigorousLowerBoundProduced: false, // Rayleigh-Ritz gives UPPER bounds only
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97206_CSHARP_COUPLED_LIMIT_NEEDS_RIGOROUS_LOWER_BOUND -- the coupled N,T joint limit of c_sharp is now MEASURED positive (~0.582, range [0.5817,0.5842]) with the imp-97183 fixed-T descent explained away as a t-truncation artifact, but this is still an UPPER-bound extrapolation, not a certified floor: the true infinite-dim lambda_min lies at or below the plateau, so a positive plateau is consistent with but does not certify a positive infimum. Certifying it needs a complementary lower-bound eigenvalue method (a spectral-gap enclosure that brackets lambda_min from BELOW) or a direct analytic coercivity / de Branges realisation P_a M_sigma2 P_a >= c*I. Measurement only; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96.',
  qed: false,
});
export default IMP97206_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97206_ASSERTIONS = [
  {
    id: 'imp97206-grid-fixedN-rises-fixedT-descends-spread-collapses',
    holds: () => {
      const G = IMP97206_GRID;
      const Ns = [52, 68, 84, 100, 116, 132];
      // at fixed N the floor rises with T
      const risesInT = Ns.every((N) => G.every((r, i) => i === 0 || r.byN[N] > G[i - 1].byN[N]));
      // at fixed T the floor descends with N
      const descendsInN = G.every((r) => Ns.every((N, j) => j === 0 || r.byN[N] < r.byN[Ns[j - 1]]));
      // the N-spread collapses as T grows (t-artifact shrinking)
      const spread = (r) => r.byN[52] - r.byN[132];
      const spreadCollapses = spread(G[0]) > 0.07 && spread(G[G.length - 1]) < 0.011;
      return risesInT && descendsInN && spreadCollapses;
    },
    why: 'the N x T grid rises with T at fixed N, descends with N at fixed T, and the N-spread collapses 0.0732 (T=800) -> 0.0094 (T=3200) as the t-truncation artifact shrinks.',
  },
  {
    id: 'imp97206-inner-Tinf-plateau-flat-positive-not-descending',
    holds: () => {
      const rel = IMP97206_STAGE1_LAM_N_INF.filter((r) => r.reliable);
      // reliable band is N>=84, all near 0.582, tight, NOT descending (N=132 >= N=84)
      const allNear = rel.every((r) => Math.abs(r.lamNinf - 0.582) < 0.003 && r.lamNinf > 0);
      const notDescending = rel[rel.length - 1].lamNinf >= rel[0].lamNinf - 1e-6;
      return allNear && notDescending && rel.length === 4 &&
        Math.abs(IMP97206_PLATEAU_MEAN - 0.581687) < 1e-5 &&
        IMP97206_PLATEAU_STD < 1e-3 &&
        IMP97206_VERDICT.innerTinfPlateauIsFlatPositive === true &&
        IMP97206_VERDICT.fixedTdescentExplainedAsTruncationArtifact === true;
    },
    why: 'after the inner T->inf extrapolation the reliable-band lam(N,inf) (N=84..132) is a flat positive plateau 0.581687 +/- 0.000590, slightly increasing not descending -- the imp-97183 fixed-T descent was a t-truncation artifact.',
  },
  {
    id: 'imp97206-truncations-nonseparable-crosschecks-discarded',
    holds: () =>
      IMP97206_CROSSCHECKS.separableCorner < IMP97206_JOINT_EXTRAPOLANT - 0.05 &&
      Math.abs(IMP97206_CROSSCHECKS.separableBiasVsCoupled - (-0.067)) < 1e-3 &&
      Math.abs(IMP97206_CROSSCHECKS.powerLawExponentQ) < 0.05 &&
      IMP97206_VERDICT.truncationsAreNonSeparable === true &&
      IMP97206_VERDICT.powerLawOuterFitDegenerate === true &&
      IMP97206_JOINT_INTERVAL[0] > 0.5 && IMP97206_JOINT_INTERVAL[1] < 0.6,
    why: 'the separable corner (0.5149) under-reads the coupled plateau (0.582) by ~0.07 and the power-law outer fit degenerates (q ~ -0.01 on flat data), so both are discarded -- confirming the two truncations are non-separable and the coupled two-stage reading is required.',
  },
  {
    id: 'imp97206-measurement-only-no-qed',
    holds: () =>
      IMP97206_VERDICT.coercivityPlausible === true &&
      IMP97206_VERDICT.zeroCrossingObserved === false &&
      IMP97206_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97206_VERDICT.operatorPositivityProved === false &&
      IMP97206_VERDICT.boundMoves === false &&
      IMP97206_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97206_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97206_BINDING_2A - LN3) < 1e-12 &&
      IMP97206_VERDICT.qed === false,
    why: 'measurement only: the coupled joint limit ~0.582 is a Rayleigh-Ritz UPPER-bound extrapolation (coercivity plausible, not certified); no rigorous lower bound, no operator positivity, no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97206_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97206-krein-csharp-coupled-nt-jointlimit assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
