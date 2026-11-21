/**
 * @fileoverview imp-96953 -- MEASUREMENT: GENUINE (N,T) Route I Krein solve at INTERMEDIATE
 * N in {50,150,250,400} (2a=ln3, orthogonal Gegenbauer C_n^{13/2} basis, condB=1) to add fit points
 * BETWEEN the imp-96847 three-point law (52,76,100) and the imp-96867 large-N run (200,400,800),
 * resolving the sub-gap IMP96847_TVSN_LAW_THREE_POINT_ONLY: the T-truncation-vs-N law
 * T_req(N;eps)=tau(N) ln(A(N)/eps) had been fit from only three small-N points, so the location of the
 * monotone-climb-in-T breakdown and the validity of the sub-linear decay exponent p=0.28 (tau~N^0.28)
 * were unmeasured across the intermediate range.
 *
 * PREMISE (from the ticket). imp-96847 fit tau(N) ~ 133.1773 N^0.2793 from N in {52,76,100} and
 * extrapolated "T=4800 suffices to N~800 at eps=1e-3"; imp-96867 then genuinely solved N in {200,400,800}
 * and REFUTED that (floor at (800,4800) is -1.1686, N=400 already non-monotone in T). This leaf fills the
 * GAP between those runs. Driver: tmp/imp-96953-tvsn-intermediate-solve.py (/tmp/rhvenv, scipy 1.18)
 * reuses the imp-96806/imp-96867 build()/lam_min() solver VERBATIM (Gegenbauer basis, panel=1.5
 * t-quadrature, dense eigh), sweeping T in {800,1600,3200,4800} at each of N in {50,150,250,400}. Every
 * literal is a verbatim copy from /tmp/imp-96953-out.json.
 *
 * FINDINGS (measured; every literal verbatim from the run).
 *   1. THE MONOTONE-CLIMB PICTURE BREAKS BETWEEN N=250 AND N=400. N=50/150/250 all monotone-climb in T
 *      (mono=True), while N=400 DIPS negative (-0.001490 at T=800 -> -0.013923 at T=1600) before climbing
 *      to 0.553928. This N=400 row reproduces the imp-96867 genuine solve to full precision
 *      (-0.0014898327224142551 / 0.5539278144855775), a cross-check of the reused solver.
 *   2. THE T=800 BASE FLOOR CROSSES ZERO BETWEEN N=150 AND N=250. The under-resolved T=800 floor drops
 *      0.577970 (N=50) -> 0.490330 (N=150) -> -0.000530 (N=250) -> -0.001490 (N=400): by N=250 the base
 *      truncation height is already too low to keep even the SIGN correct, though the higher-T climb still
 *      recovers a monotone positive floor.
 *   3. THE SUB-LINEAR p=0.28 DECAY LAW IS REFUTED ACROSS THE FILLED RANGE. Measured tau(N) is NON-MONOTONE
 *      and scatters wildly (408.7 -> 660.5 -> 351.3 -> 4146.2) against the smooth power prediction
 *      (397.1 / 539.8 / 622.6 / 709.9): meas/power = 1.03 / 1.22 / 0.56 / 5.84. The exp-decay refit is
 *      unstable once the T=800 base goes negative (N=250 A blows to 5.5, N=400 tau=4146), so the
 *      three-point tau~N^0.28 law does NOT extrapolate -- the DECAY route (and its "T=4800 suffices to
 *      N~800" claim) is a small-N (N<=150) artifact.
 *
 * VERDICT. The intermediate fill DISCRIMINATES the sub-gap: the DECAY (sub-linear tau~N^0.28) route holds
 * only while the T=800 base floor stays positive (N<=150); the breakdown onset is now located -- the base
 * floor crosses zero in (150,250] and the T-monotone-climb picture itself fails in (250,400]. Past that
 * the required truncation height diverges (measured T_req(1e-3) jumps 1625 -> 3746 -> 3026 -> 29735 as the
 * fit destabilises), consistent with the imp-96867 super-geometric (N,T) coupling. The genuine N=400 row
 * matching imp-96867 to full precision confirms the reused solver. Measurement only: Rayleigh floors are
 * UPPER bounds on the true lambda_min; establishes NO operator positivity; IMP96749_UNIFORM_N_GAP_UNSETTLED
 * stays open; interval-rigorous reach stays 2a <= 0.96; RH open; no refereed bound is changed; NO QED.
 *
 * @see imp-96847-krein-tconv-tvsn-scaling-law.js (source three-point law; IMP96847_TVSN_LAW_THREE_POINT_ONLY resolved here)
 * @see imp-96867-krein-tvsn-genuine-solve.js (large-N genuine solve N in {200,400,800}; N=400 cross-check)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (reused build()/lam_min() solver; IMP96806_TSWEEP_LN3)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

const LN3 = Math.log(3); // 1.0986122886681098

// GENUINE (N,T) floor grid at 2a=ln3 (verbatim from tmp/imp-96953-out.json; new solve, panel=1.5)
export const IMP96953_TS = Object.freeze([800, 1600, 3200, 4800]);
export const IMP96953_NS = Object.freeze([50, 150, 250, 400]);
export const IMP96953_FLOOR = Object.freeze({
  50: Object.freeze([0.5779704978576162, 0.5844375722287403, 0.5854289000115789, 0.58554298189552]),
  150: Object.freeze([0.4903301045230973, 0.551357378257507, 0.5737755774537097, 0.5774374949565644]),
  250: Object.freeze([-0.0005303686600541871, 0.5066264397242184, 0.5577843035512089, 0.5701735299343736]),
  400: Object.freeze([-0.0014898327224142551, -0.013923177828574692, 0.5250652877757914, 0.5539278144855775]),
});

// per-N exponential refit f(T)=L - A exp(-T/tau), monotone-in-T flag, and DECAY-route T_req (verbatim)
export const IMP96953_FIT = Object.freeze({
  50: Object.freeze({ A: 0.053290, tau: 408.7416, monotone: true, r12: 0.1533, r23: 0.1151, Treq_1em3: 1625.0575 }),
  150: Object.freeze({ A: 0.290662, tau: 660.4606, monotone: true, r12: 0.3673, r23: 0.1633, Treq_1em3: 3746.2383 }),
  250: Object.freeze({ A: 5.508193, tau: 351.2841, monotone: true, r12: 0.1009, r23: 0.2422, Treq_1em3: 3025.9580 }),
  400: Object.freeze({ A: 1.302204, tau: 4146.1501, monotone: false, r12: -43.3502, r23: 0.0535, Treq_1em3: 29735.4154 }),
});

// measured tau(N) vs the imp-96847 power law tau = 133.1773 N^0.2793 (verbatim) -- ratio scatters, not ~1
export const IMP96953_TAU_VS_POWER = Object.freeze({
  50: Object.freeze({ tauMeas: 408.7416, powerPred: 397.1481, ratio: 1.029 }),
  150: Object.freeze({ tauMeas: 660.4606, powerPred: 539.7747, ratio: 1.224 }),
  250: Object.freeze({ tauMeas: 351.2841, powerPred: 622.5509, ratio: 0.564 }),
  400: Object.freeze({ tauMeas: 4146.1501, powerPred: 709.8810, ratio: 5.841 }),
});

export const IMP96953_VERDICT = Object.freeze({
  ticket: 'imp-96953',
  question:
    'do the imp-96847 three-point T-vs-N scaling law and its sub-linear tau~N^0.28 exponent survive when genuine (N,T) Krein solves are added at intermediate N in {50,150,250,400}, and where does the monotone-climb-in-T picture break down?',
  answer:
    'No. The monotone-climb picture holds only through N=250 (though the under-resolved T=800 base floor already crosses zero between N=150 and N=250: 0.490330 -> -0.000530) and fails by N=400 (non-monotone: dips to -0.013923 at T=1600). Measured tau(N) is non-monotone and scatters against the power prediction (meas/power = 1.03/1.22/0.56/5.84), so the sub-linear tau~N^0.28 DECAY law is a small-N (N<=150) artifact and does NOT extrapolate. The genuine N=400 row reproduces the imp-96867 solve to full precision, confirming the reused solver.',
  binding2a: 'ln3',
  monotoneBreaksBetween: Object.freeze([250, 400]), // last monotone N and first non-monotone N
  baseFloorT800CrossesZeroBetween: Object.freeze([150, 250]),
  subLinearPowerLawHolds: false, // measured tau non-monotone, ratio to power pred scatters 0.56..5.84
  n400CrossCheckMatchesImp96867: true, // -0.0014898327224142551 / 0.5539278144855775 to full precision
  treqDivergesPastBreakdown: true, // T_req(1e-3) 1625 -> 3746 -> 3026 -> 29735 as the fit destabilises
  operatorPositivityProved: false, // Rayleigh floor is an UPPER bound
  uniformNGapSettled: false, // IMP96749_UNIFORM_N_GAP_UNSETTLED stays open
  newSolvePerformed: true, // genuine (N,T) solve at N in {50,150,250,400}
  resolvesSubGap: 'IMP96847_TVSN_LAW_THREE_POINT_ONLY', // three-point law now filled and refuted mid-range
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96953_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96953_ASSERTIONS = [
  {
    id: 'imp96953-n400-cross-checks-imp96867',
    holds: () => {
      const row = IMP96953_FLOOR[400];
      // reproduce the imp-96867 genuine solve at N=400 to full precision
      return row[0] === -0.0014898327224142551 && row[3] === 0.5539278144855775;
    },
    why: 'the genuine N=400 row must reproduce the imp-96867 (N,T) solve, cross-checking the reused build()/lam_min() solver.',
  },
  {
    id: 'imp96953-monotone-breaks-between-250-and-400',
    holds: () => {
      const mono = (N) => IMP96953_FLOOR[N].every((v, i) => i === 0 || v > IMP96953_FLOOR[N][i - 1]);
      // N=50/150/250 monotone-climb in T; N=400 is non-monotone (dips at T=1600)
      return mono(50) && mono(150) && mono(250) && !mono(400);
    },
    why: 'the monotone-climb-in-T picture must hold through N=250 and fail by N=400 -- the located breakdown onset.',
  },
  {
    id: 'imp96953-base-floor-t800-crosses-zero-mid-range',
    holds: () => {
      // T=800 base floor drops positive -> negative between N=150 and N=250
      return IMP96953_FLOOR[150][0] > 0 && IMP96953_FLOOR[250][0] < 0 && IMP96953_FLOOR[400][0] < 0;
    },
    why: 'the under-resolved T=800 base floor must cross zero in (150,250], the first sign the three-point law leaves its valid range.',
  },
  {
    id: 'imp96953-sublinear-power-law-refuted',
    holds: () => {
      const r = IMP96953_TAU_VS_POWER;
      // measured tau non-monotone in N AND meas/power ratio scatters far from 1
      const tauNonMono = !(r[50].tauMeas < r[150].tauMeas && r[150].tauMeas < r[250].tauMeas);
      const ratioScatters = r[250].ratio < 0.7 && r[400].ratio > 5;
      return tauNonMono && ratioScatters && IMP96953_VERDICT.subLinearPowerLawHolds === false;
    },
    why: 'the measured tau(N) must be non-monotone and scatter against the power prediction -- the tau~N^0.28 DECAY law does not extrapolate.',
  },
  {
    id: 'imp96953-measurement-only-no-qed',
    holds: () =>
      IMP96953_VERDICT.operatorPositivityProved === false &&
      IMP96953_VERDICT.uniformNGapSettled === false &&
      IMP96953_VERDICT.newSolvePerformed === true &&
      IMP96953_VERDICT.resolvesSubGap === 'IMP96847_TVSN_LAW_THREE_POINT_ONLY' &&
      IMP96953_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96953_VERDICT.qed === false,
    why: 'measurement only: genuine solve fills the three-point sub-gap, no operator positivity, uniform-in-N gap open, certificate reach stays 2a <= 0.96, no QED.',
  },
];

for (const a of IMP96953_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96953-krein-tvsn-intermediate-solve assertion failed: ${a.id}`);
  }
}

void LN3;
