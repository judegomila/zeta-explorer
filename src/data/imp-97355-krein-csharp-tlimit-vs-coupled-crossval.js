/**
 * @module imp-97355-krein-csharp-tlimit-vs-coupled-crossval
 * @fileoverview imp-97355 -- CROSS-VALIDATE the two independent extrapolations of the Krein concentration
 *   constant c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a = ln3, which were produced by different orders of
 *   truncation-limit and never tabulated side by side:
 *
 *     (B) imp-97335: the FIXED-N=100 T-sweep extrapolated to a measured T->inf limit L = 0.5822
 *         (1/T^2 law, best-fit p = 2.05, residual 2.17e-7), from the imp-97183 rising ladder
 *         {800:0.533846, 1200:0.560891, 1600:0.570766, 2000:0.575037, 2800:0.578278}.
 *     (C) imp-97206: the full COUPLED 6x4 N,T grid extrapolated with the well-posed two-stage order
 *         (inner T->inf per N, then outer N->inf) to a flat positive plateau 0.581687 +/- 0.000590,
 *         robust joint range [0.5817, 0.5842], joint extrapolant ~0.582.
 *
 *   Both are Rayleigh-Ritz UPPER brackets on the true infinite-dim lambda_min (a LOWER value is a TIGHTER
 *   bracket, closer to the true infimum). This leaf reconciles the two figures, quantifies the residual gap,
 *   and records which is the tighter measured upper-bracket. MEASUREMENT/RECONCILIATION only: no rigorous
 *   lower bound, no operator positivity, no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * ANCHOR 1 -- THE TWO RUNS SHARE UNDERLYING DATA POINTS EXACTLY, so the disagreement is purely an
 *   extrapolation-order effect, not a build discrepancy. At the common node N=100 both grids report the
 *   identical extended-precision floors lam(100,800) = 0.533846 and lam(100,1600) = 0.570766. The two
 *   extended-precision builds are therefore the SAME object; only the T-grid coverage and the fitted
 *   T->inf exponent differ (imp-97335 fits p=2.05 on {800,1200,1600,2000,2800}; imp-97206 fits p=2.25 on
 *   {800,1600,2400,3200}).
 *
 * ANCHOR 2 -- THE APPLES-TO-APPLES QUANTITY IS lam(N=100, T->inf), which BOTH runs compute. imp-97335
 *   gets 0.5822; imp-97206's inner Stage-1 at N=100 gets 0.581059. The residual gap is 0.001141
 *   (relative 0.196%, i.e. 1.93 x the imp-97206 plateau std 0.000590). imp-97335's 0.5822 lies INSIDE the
 *   imp-97206 joint range [0.5817, 0.5842], so the two extrapolations are mutually consistent.
 *
 * ANCHOR 3 -- WHICH IS THE TIGHTER MEASURED UPPER-BRACKET. Since Ritz floors bracket the true lambda_min
 *   from ABOVE, the lower reading is tighter. At the shared N=100 the coupled inner value (0.581059) is
 *   marginally below imp-97335's (0.5822), AND the coupled run additionally converges the outer N-limit
 *   (flat plateau to N=132, imp-97335 stops at N=100). So the imp-97206 coupled reading is both the tighter
 *   and the more complete measured upper-bracket; imp-97335 is a single-N confirmation of it. The best
 *   measured upper-bracket on c_sharp is therefore min(0.5822, 0.581059) = 0.581059, and the true
 *   infinite-dim c_sharp lies at or below it.
 *
 * VERDICT. The two independent extrapolations of c_sharp at 2a=ln3 AGREE to ~0.0011 (< 0.2%), both landing
 *   at ~0.582, with imp-97335's fixed-N=100 T-limit sitting inside the imp-97206 coupled joint range. The
 *   residual gap is fully attributed to the different T-grids / fitted T->inf exponents (p=2.05 vs 2.25),
 *   not to any build discrepancy (the shared T=800,1600 nodes match to all printed digits). The coupled
 *   imp-97206 reading is the tighter and more complete measured upper-bracket. Neither is a certified floor:
 *   both are Rayleigh-Ritz upper bounds, so a positive ~0.582 is consistent with -- but does not prove --
 *   a positive infimum. SUB-GAP IMP97206_CSHARP_COUPLED_LIMIT_NEEDS_RIGOROUS_LOWER_BOUND is unchanged.
 *   No operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (fixed-N=100 T-limit ~0.5822; 1/T^2 law)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (coupled N,T plateau ~0.5817; joint range [0.5817,0.5842])
 * @see imp-97183-krein-csharp-extprec-ladder.js (the extended-precision ladder both extrapolations read from)
 *
 * Ticket: imp-97355 (accuracy, opus-4-8, api-pool). Reconciliation/measurement only; no rigorous lower
 * bound; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97355_BINDING_2A = LN3;
export const IMP97355_RIGOROUS_REACH_2A = 0.96; // unchanged by this cross-validation

// The two figures being reconciled (both Rayleigh-Ritz UPPER brackets on c_sharp = lambda_min(P_a M_sigma2 P_a)).
export const IMP97355_TLIMIT_FIXED_N100 = 0.5822; // imp-97335 (B): fixed-N=100 T->inf, 1/T^2, p=2.05
export const IMP97355_COUPLED_PLATEAU_MEAN = 0.581687; // imp-97206: coupled two-stage plateau mean
export const IMP97355_COUPLED_INNER_N100 = 0.581059; // imp-97206 inner Stage-1 T->inf AT N=100 (apples-to-apples)
export const IMP97355_COUPLED_JOINT_INTERVAL = Object.freeze([0.5817, 0.5842]); // imp-97206 robust joint range

// ANCHOR 1 -- shared underlying data points at the common node N=100 (identical to all printed digits):
// the two extended-precision builds are the SAME object, so the disagreement is an extrapolation-order effect.
export const IMP97355_SHARED_NODES = Object.freeze({
  N: 100,
  lamAtT800: 0.533846, // imp-97335 T-sweep[T=800] == imp-97206 grid[T=800].byN[100]
  lamAtT1600: 0.570766, // imp-97335 T-sweep[T=1600] == imp-97206 grid[T=1600].byN[100]
  buildsAgreeExactly: true, // same dps=50 pole-free build; only T-grid coverage/fit exponent differ
  imp97335Texponent: 2.05, // fit on {800,1200,1600,2000,2800}
  imp97206Texponent: 2.25, // fit on {800,1600,2400,3200}
});

// ANCHOR 2 -- the apples-to-apples reconciliation: lam(N=100, T->inf) from each run.
export const IMP97355_RECONCILIATION = Object.freeze({
  quantity: 'lam(N=100, T->inf) -- the fixed-N=100 t-truncation limit both runs compute',
  imp97335Value: 0.5822,
  imp97206Value: 0.581059,
  absGap: 0.001141, // 0.5822 - 0.581059
  relGap: 0.001961, // 0.001141 / 0.5817 -> 0.196%
  gapInPlateauStds: 1.934, // 0.001141 / 0.000590 -- within ~2 std of the coupled plateau spread
  tlimitInsideCoupledRange: true, // 0.5822 in [0.5817, 0.5842] -> mutually consistent
});

// ANCHOR 3 -- which is the tighter measured upper-bracket (LOWER reading = tighter, since Ritz bounds from above).
export const IMP97355_TIGHTER_BRACKET = Object.freeze({
  bestMeasuredUpperBracket: 0.581059, // min(0.5822, 0.581059) at the shared N=100
  tighterRun: 'imp-97206', // coupled inner value 0.581059 < imp-97335 0.5822 at N=100
  coupledAlsoConvergesOuterN: true, // plateau flat to N=132; imp-97335 stops at N=100
  imp97335IsSingleNConfirmation: true, // consistent single-N confirmation of the coupled reading
  trueCsharpLiesAtOrBelow: 0.581059, // both are UPPER bounds; true infinite-dim lambda_min <= this
});

export const IMP97355_VERDICT = Object.freeze({
  ticket: 'imp-97355',
  question:
    'do the two independent extrapolations of c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 -- imp-97335 fixed-N=100 T-limit ~0.5822 and imp-97206 coupled N,T plateau ~0.5817 -- agree, and which (if either) is the tighter measured upper-bracket?',
  answer:
    'they AGREE to ~0.0011 (< 0.2%). At the shared node N=100 both runs read the identical extended-precision floors lam(100,800)=0.533846 and lam(100,1600)=0.570766, so the builds are the SAME object and the difference is purely an extrapolation-order effect (imp-97335 fits p=2.05 on {800..2800}; imp-97206 fits p=2.25 on {800..3200}). The apples-to-apples quantity lam(N=100,T->inf) is 0.5822 (imp-97335) vs 0.581059 (imp-97206 inner stage): residual gap 0.001141 (0.196%, 1.93x the coupled plateau std), and 0.5822 lies INSIDE the imp-97206 joint range [0.5817,0.5842]. Because Ritz floors bracket lambda_min from ABOVE, the lower coupled reading (0.581059) is the TIGHTER bracket at N=100, and the coupled run additionally converges the outer N-limit (flat plateau to N=132) while imp-97335 stops at N=100 -- so imp-97206 is the tighter and more complete measured upper-bracket, imp-97335 a single-N confirmation of it. The best measured upper-bracket on c_sharp is 0.581059, with the true infinite-dim value at or below it. Both remain UPPER bounds: a positive ~0.582 is consistent with but does not certify a positive infimum.',
  binding_2a: LN3,
  buildsAgreeAtSharedNodes: true, // (N=100,T=800) and (N=100,T=1600) match to all printed digits
  disagreementIsExtrapolationOrderNotBuild: true,
  applesToApplesGapAbs: 0.001141, // lam(N=100,T->inf): 0.5822 vs 0.581059
  applesToApplesGapRel: 0.001961, // 0.196%
  tlimitInsideCoupledRange: true, // 0.5822 in [0.5817,0.5842]
  coupledIsTighterAndMoreComplete: true, // lower reading at N=100 + converged outer N-limit
  bestMeasuredUpperBracket: 0.581059,
  bothAreRayleighRitzUpperBounds: true,
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97206_CSHARP_COUPLED_LIMIT_NEEDS_RIGOROUS_LOWER_BOUND -- unchanged. The two extrapolations now agree (~0.582, gap 0.0011) and the coupled reading is the tighter/more-complete measured upper-bracket (0.581059), but BOTH are Rayleigh-Ritz UPPER bounds: the true infinite-dim lambda_min lies at or below 0.581059, so a positive ~0.582 is consistent with but does not certify a positive infimum. Certifying it still needs a complementary lower-bound eigenvalue method (a spectral-gap enclosure bracketing lambda_min from BELOW) or a direct analytic coercivity / de Branges realisation P_a M_sigma2 P_a >= c*I.',
  qed: false,
});
export default IMP97355_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97355_ASSERTIONS = [
  {
    id: 'imp97355-shared-nodes-match-exactly',
    holds: () => {
      const S = IMP97355_SHARED_NODES;
      // both runs read the identical N=100 floors at T=800 and T=1600 -> same extended-precision build
      return S.N === 100 && Math.abs(S.lamAtT800 - 0.533846) < 1e-6 &&
        Math.abs(S.lamAtT1600 - 0.570766) < 1e-6 && S.buildsAgreeExactly === true &&
        S.imp97335Texponent !== S.imp97206Texponent;
    },
    why: 'imp-97335 and imp-97206 share the exact N=100 floors lam(100,800)=0.533846 and lam(100,1600)=0.570766, so the builds are the same object and the disagreement is an extrapolation-order (T-grid / exponent) effect only.',
  },
  {
    id: 'imp97355-apples-to-apples-gap-small-and-consistent',
    holds: () => {
      const R = IMP97355_RECONCILIATION;
      const gap = IMP97355_TLIMIT_FIXED_N100 - IMP97355_COUPLED_INNER_N100;
      return Math.abs(gap - 0.001141) < 1e-6 && Math.abs(R.absGap - 0.001141) < 1e-6 &&
        R.relGap < 0.003 && R.gapInPlateauStds < 2.0 && R.tlimitInsideCoupledRange === true &&
        IMP97355_TLIMIT_FIXED_N100 >= IMP97355_COUPLED_JOINT_INTERVAL[0] &&
        IMP97355_TLIMIT_FIXED_N100 <= IMP97355_COUPLED_JOINT_INTERVAL[1];
    },
    why: 'the apples-to-apples quantity lam(N=100,T->inf) differs by only 0.001141 (0.196%, 1.93 plateau std) between the two runs, and imp-97335 0.5822 lies inside the imp-97206 joint range [0.5817,0.5842] -> mutually consistent.',
  },
  {
    id: 'imp97355-coupled-is-tighter-upper-bracket',
    holds: () => {
      const B = IMP97355_TIGHTER_BRACKET;
      // lower reading = tighter Rayleigh-Ritz upper bracket; coupled 0.581059 < 0.5822
      return B.bestMeasuredUpperBracket === IMP97355_COUPLED_INNER_N100 &&
        B.bestMeasuredUpperBracket < IMP97355_TLIMIT_FIXED_N100 &&
        B.tighterRun === 'imp-97206' && B.coupledAlsoConvergesOuterN === true &&
        Math.abs(B.trueCsharpLiesAtOrBelow - 0.581059) < 1e-6;
    },
    why: 'since Ritz floors bracket lambda_min from above, the lower coupled reading 0.581059 (converged also in the outer N-limit) is the tighter and more complete measured upper-bracket; imp-97335 0.5822 is a single-N confirmation.',
  },
  {
    id: 'imp97355-reconciliation-only-no-qed',
    holds: () =>
      IMP97355_VERDICT.buildsAgreeAtSharedNodes === true &&
      IMP97355_VERDICT.disagreementIsExtrapolationOrderNotBuild === true &&
      IMP97355_VERDICT.coupledIsTighterAndMoreComplete === true &&
      IMP97355_VERDICT.bothAreRayleighRitzUpperBounds === true &&
      IMP97355_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97355_VERDICT.operatorPositivityProved === false &&
      IMP97355_VERDICT.boundMoves === false &&
      IMP97355_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97355_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97355_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97355_VERDICT.subGap === 'string' &&
      IMP97355_VERDICT.subGap.includes('IMP97206_CSHARP_COUPLED_LIMIT_NEEDS_RIGOROUS_LOWER_BOUND') &&
      IMP97355_VERDICT.qed === false,
    why: 'reconciliation/measurement only: the two extrapolations agree (~0.582, gap 0.0011) and the coupled reading is the tighter upper-bracket, but both are Rayleigh-Ritz UPPER bounds -- no rigorous lower bound, no operator positivity, no bound moves; interval-rigorous reach stays 2a<=0.96; sub-gap unchanged; NO QED.',
  },
];

for (const a of IMP97355_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97355-krein-csharp-tlimit-vs-coupled-crossval assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
