/**
 * @module imp-97379-krein-csharp-2d-richardson-third-order
 * @fileoverview imp-97379 -- attempt a THIRD, independent extrapolation ORDER of the Krein concentration
 *   constant c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3, on the SAME shared imp-97206 6x4 N,T grid,
 *   to test whether the measured UPPER bracket can be pushed below the imp-97206 coupled reading (best
 *   measured upper bracket 0.581059, coupled plateau mean 0.581687) and to quantify the residual gap to
 *   the true infinite-dim infimum.
 *
 *   Context. imp-97355 reconciled the two prior extrapolation orders -- (B) imp-97335 fixed-N=100 T-limit
 *   ~0.5822 and (C) imp-97206 coupled two-stage (inner T->inf per N, then outer N->inf) plateau ~0.5817 --
 *   and found both are Rayleigh-Ritz UPPER brackets, the coupled one tighter (best 0.581059). This leaf runs
 *   a genuinely different order: (D1) a simultaneous 2D additive-error fit lam = L + A*N^-q + B*T^-p, (D3)
 *   its constrained variant lam = L + a/N + B*T^-p, and (D2) a diagonal coupled-node Richardson that pairs
 *   increasing N with increasing T. MEASUREMENT ONLY: no rigorous lower bound; no operator positivity; no
 *   bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * WHAT WAS RUN (tmp/imp-97379-2d-richardson.py, reusing the shared imp-97206 dps=50 grid verbatim).
 *   The 6x4 grid N in {52..132} x T in {800..3200} of Rayleigh-Ritz floors (UPPER bounds on c_sharp), on
 *   the reliable band N>=84 (the imp-97206 small-N inner fits were already discarded as degenerate).
 *
 * FINDING 1 -- THE SIMULTANEOUS 2D ADDITIVE FIT DEGENERATES, exactly like the imp-97206 power-law OUTER
 *   fit. lam = L + A*N^-q + B*T^-p returns q = 0.0006 (a near-constant N-power) and an unphysical
 *   L = -63.12 with A = 63.9 -- the flat-in-N plateau has no genuine N power law, so the free N-exponent
 *   collapses and the fit is meaningless. Constraining the N-term to linear-in-1/N (D3, lam = L + a/N +
 *   B*T^-p) still misfits badly (rms 6.2e-3, more than 10x the plateau std) with a runaway B ~ -2.7e4 and
 *   L = 0.541706. A single additive T^-p term cannot simultaneously describe the T-rise at all N.
 *
 * FINDING 2 -- THE DIAGONAL COUPLED-NODE RICHARDSON UNDERSHOOTS: its lower readings are NOT valid tighter
 *   upper brackets. Pairing increasing N with increasing T -- (84,1600)->(100,2400)->(116,3200) and
 *   (100,1600)->(116,2400)->(132,3200) -- and geometric-Richardson extrapolating gives 0.577619 and
 *   0.576242, both BELOW the best coupled reading 0.581059. But every diagonal endpoint is still below its
 *   OWN inner T->inf limit: lam(116,3200)=0.577514 < lam(116,inf)=0.581624, lam(132,3200)=0.575779 <
 *   lam(132,inf)=0.582646, lam(100,2400)=0.577134 < lam(100,inf)=0.581059. Because the T-truncation biases
 *   the floor DOWN (missing positive sigma_2 tail mass), any order that does NOT take T->inf FIRST reads
 *   T-biased-low values, so the diagonal extrapolant undershoots the true finite-N Ritz value. Its lower
 *   number is an UNDER-estimate, not a tighter upper bound -- the same non-separability signature imp-97206
 *   already found in its separable corner (biased ~0.07 low).
 *
 * VERDICT. A third independent extrapolation order does NOT push the measured UPPER bracket below the
 *   imp-97206 coupled reading. The free-exponent 2D fit degenerates (flat-plateau, no N power law), the
 *   constrained 2D fit misfits, and the diagonal Richardson only appears lower because it undershoots --
 *   its inputs are still T-biased low (every endpoint below its own T->inf limit), so it violates the
 *   upper-bracket property. This CONFIRMS the imp-97206 two-stage order (inner T->inf, then outer N) is the
 *   well-posed one; the best measured UPPER bracket on c_sharp stays 0.581059. The residual gap to the true
 *   infimum cannot be bracketed from below by any of these orders (all are upper bounds or undershoots): the
 *   inner-T plateau is flat / slightly INCREASING (0.581418 -> 0.582646 over N=84..132), giving NO measured
 *   evidence of descent, so the residual gap is MEASURED consistent with <= the plateau spread ~6e-4 but is
 *   NOT rigorously bounded below. SUB-GAP IMP97206_CSHARP_COUPLED_LIMIT_NEEDS_RIGOROUS_LOWER_BOUND unchanged
 *   -- certifying positivity still needs a complementary lower-bound eigenvalue method (a spectral-gap
 *   enclosure bracketing lambda_min from BELOW) or a direct analytic coercivity / de Branges realisation
 *   P_a M_sigma2 P_a >= c*I. No operator positivity; no bound moves; interval-rigorous reach stays
 *   2a<=0.96; RH open; NO QED.
 *
 * @see imp-97355-krein-csharp-tlimit-vs-coupled-crossval.js (reconciled the two prior orders; best 0.581059)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (the shared 6x4 grid + two-stage plateau ~0.5817)
 * @see imp-97335-krein-csharp-naive-lowerbound-tlimit.js (fixed-N=100 T-limit ~0.5822)
 *
 * Ticket: imp-97379 (numerical, opus-4-8, api-pool). Measurement only; no rigorous lower bound; no operator
 * positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97379_BINDING_2A = LN3;
export const IMP97379_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement

// The reference UPPER brackets from the two prior extrapolation orders (imp-97355 reconciliation).
export const IMP97379_IMP97335_TLIMIT = 0.5822;    // fixed-N=100 T->inf
export const IMP97379_IMP97206_PLATEAU = 0.581687; // coupled two-stage plateau mean
export const IMP97379_BEST_UPPER_BRACKET = 0.581059; // coupled inner N=100 -- best measured upper bracket

// FINDING 1 -- the third-order simultaneous 2D fits (band N>=84), both defective.
export const IMP97379_2D_FITS = Object.freeze({
  additiveFreeExp: Object.freeze({ // lam = L + A*N^-q + B*T^-p
    L: -63.124741, A: 63.9, qN: 0.0006, B: -27040, pT: 1.9588, rms: 6.093e-3,
    degenerate: true, // q -> 0: flat plateau has no N power law (same as imp-97206 outer power fit)
  }),
  linear1overN: Object.freeze({ // lam = L + a/N + B*T^-p
    L: 0.541706, a: 4.224, B: -27040, pT: 1.9588, rms: 6.155e-3,
    misfits: true, // rms ~10x plateau std; runaway B; single additive T-term cannot fit the T-rise at all N
  }),
});

// FINDING 2 -- the diagonal coupled-node Richardson extrapolants and the undershoot proof.
export const IMP97379_DIAGONAL = Object.freeze({
  diagA: Object.freeze({ nodes: [[84, 1600], [100, 2400], [116, 3200]],
    values: [0.575381, 0.577134, 0.577514], ratio: 0.2168, extrapolant: 0.577619 }),
  diagB: Object.freeze({ nodes: [[100, 1600], [116, 2400], [132, 3200]],
    values: [0.570766, 0.574650, 0.575779], ratio: 0.2907, extrapolant: 0.576242 }),
});

// the undershoot proof: every diagonal endpoint is still BELOW its own inner T->inf limit, so the
// diagonal reads T-biased-low values and its extrapolant under-estimates the true finite-N Ritz value.
export const IMP97379_INNER_TINF = Object.freeze({ 84: 0.581418, 100: 0.581059, 116: 0.581624, 132: 0.582646 });
export const IMP97379_UNDERSHOOT_CHECK = Object.freeze([
  { N: 116, T: 3200, lam: 0.577514, lamNinf: 0.581624, belowOwnTinf: true },
  { N: 132, T: 3200, lam: 0.575779, lamNinf: 0.582646, belowOwnTinf: true },
  { N: 100, T: 2400, lam: 0.577134, lamNinf: 0.581059, belowOwnTinf: true },
]);

export const IMP97379_VERDICT = Object.freeze({
  ticket: 'imp-97379',
  question:
    'can a THIRD, independent extrapolation ORDER (a simultaneous 2D Richardson / diagonal N,T sequence on the shared imp-97206 grid) push the measured UPPER bracket on c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3 below the imp-97206 coupled reading (best 0.581059), and how large is the residual gap to the true infimum?',
  answer:
    'no. The free-exponent 2D additive fit lam = L + A*N^-q + B*T^-p DEGENERATES (q=0.0006, unphysical L=-63.12) exactly like the imp-97206 power-law outer fit, because the inner-T plateau is flat in N with no genuine N power law; the constrained lam = L + a/N + B*T^-p variant misfits (rms 6.2e-3, ~10x the plateau std, runaway B). The diagonal coupled-node Richardson returns lower numbers (0.577619, 0.576242) but these are UNDERSHOOTS, not tighter upper brackets: every diagonal endpoint is still below its OWN inner T->inf limit (lam(116,3200)=0.577514<0.581624, lam(132,3200)=0.575779<0.582646, lam(100,2400)=0.577134<0.581059), so a diagonal that does not take T->inf FIRST reads T-biased-low values and under-estimates the true finite-N Ritz floor -- the same non-separability signature as the imp-97206 separable corner (biased ~0.07 low). The imp-97206 two-stage order (inner T->inf, then outer N) remains the well-posed one; the best measured UPPER bracket stays 0.581059. The residual gap to the true infimum cannot be bracketed from below by any of these orders (all upper bounds or undershoots); the inner-T plateau is flat / slightly INCREASING (0.581418 -> 0.582646), giving no measured evidence of descent, so the gap is consistent with <= ~6e-4 but is not rigorously bounded below.',
  binding_2a: LN3,
  thirdOrderAttempted: true,
  additive2DFitDegenerate: true, // q -> 0 on the flat plateau
  constrained2DFitMisfits: true, // rms ~10x plateau std
  diagonalRichardsonUndershoots: true, // endpoints below their own T->inf limits
  everyDiagonalEndpointBelowOwnTinf: true,
  bracketPushedBelowCoupled: false, // no VALID tighter upper bracket produced
  bestMeasuredUpperBracketUnchanged: 0.581059,
  twoStageOrderConfirmedWellPosed: true,
  residualGapRigorouslyBoundedBelow: false, // all orders are upper bounds or undershoots
  residualGapMeasuredConsistentWith: 6e-4, // plateau spread; NOT a rigorous bound
  rigorousLowerBoundProduced: false,
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  subGap:
    'IMP97206_CSHARP_COUPLED_LIMIT_NEEDS_RIGOROUS_LOWER_BOUND -- unchanged. A third independent extrapolation order does not produce a valid tighter UPPER bracket (the 2D fits degenerate/misfit on the flat plateau; the diagonal Richardson only looks lower because it undershoots, its inputs still T-biased low). The best measured upper bracket stays 0.581059 and all three orders are upper bounds or undershoots, so the residual gap to the true infimum is not rigorously bounded below. Certifying positivity still needs a complementary lower-bound eigenvalue method (a spectral-gap enclosure bracketing lambda_min from BELOW) or a direct analytic coercivity / de Branges realisation P_a M_sigma2 P_a >= c*I.',
  qed: false,
});
export default IMP97379_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97379_ASSERTIONS = [
  {
    id: 'imp97379-2d-additive-fit-degenerate',
    holds: () => {
      const f = IMP97379_2D_FITS.additiveFreeExp;
      // free N-exponent collapses toward 0 and L goes unphysical -> flat plateau has no N power law
      return f.qN < 0.01 && f.L < 0 && f.degenerate === true &&
        IMP97379_2D_FITS.linear1overN.misfits === true &&
        IMP97379_2D_FITS.linear1overN.rms > 5e-3;
    },
    why: 'the simultaneous 2D additive fit degenerates (q=0.0006, L=-63.12) exactly like the imp-97206 outer power-law fit, and the constrained linear-in-1/N variant misfits (rms 6.2e-3) -- the flat inner-T plateau carries no genuine N power law.',
  },
  {
    id: 'imp97379-diagonal-richardson-undershoots',
    holds: () => {
      // the diagonal extrapolants are LOWER than the best coupled reading ...
      const lower = IMP97379_DIAGONAL.diagA.extrapolant < IMP97379_BEST_UPPER_BRACKET &&
        IMP97379_DIAGONAL.diagB.extrapolant < IMP97379_BEST_UPPER_BRACKET;
      // ... but every diagonal endpoint is still below its OWN inner T->inf limit (T-biased low) ->
      // the lower reading is an UNDERSHOOT, not a valid tighter upper bracket.
      const allBelowOwnTinf = IMP97379_UNDERSHOOT_CHECK.every(
        (c) => c.belowOwnTinf === true && c.lam < IMP97379_INNER_TINF[c.N],
      );
      return lower && allBelowOwnTinf && IMP97379_VERDICT.diagonalRichardsonUndershoots === true &&
        IMP97379_VERDICT.bracketPushedBelowCoupled === false;
    },
    why: 'the diagonal Richardson extrapolants (0.577619, 0.576242) are numerically lower than 0.581059 but each diagonal endpoint is still below its own T->inf limit, so the diagonal reads T-biased-low values and its extrapolant undershoots the true finite-N Ritz floor -- it is not a valid tighter upper bracket.',
  },
  {
    id: 'imp97379-best-upper-bracket-unchanged',
    holds: () =>
      IMP97379_VERDICT.bestMeasuredUpperBracketUnchanged === IMP97379_BEST_UPPER_BRACKET &&
      Math.abs(IMP97379_BEST_UPPER_BRACKET - 0.581059) < 1e-6 &&
      IMP97379_VERDICT.twoStageOrderConfirmedWellPosed === true &&
      IMP97379_BEST_UPPER_BRACKET < IMP97379_IMP97335_TLIMIT,
    why: 'no valid tighter upper bracket was produced, so the best measured upper bracket stays 0.581059 (the imp-97206 coupled inner N=100 reading) and the two-stage order is confirmed well-posed.',
  },
  {
    id: 'imp97379-measurement-only-no-qed',
    holds: () =>
      IMP97379_VERDICT.residualGapRigorouslyBoundedBelow === false &&
      IMP97379_VERDICT.rigorousLowerBoundProduced === false &&
      IMP97379_VERDICT.operatorPositivityProved === false &&
      IMP97379_VERDICT.boundMoves === false &&
      IMP97379_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97379_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97379_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97379_VERDICT.subGap === 'string' &&
      IMP97379_VERDICT.subGap.includes('IMP97206_CSHARP_COUPLED_LIMIT_NEEDS_RIGOROUS_LOWER_BOUND') &&
      IMP97379_VERDICT.qed === false,
    why: 'measurement only: the third order produced no valid tighter upper bracket and no lower bound, so the residual gap is not rigorously bounded below; no operator positivity, no bound moves; interval-rigorous reach stays 2a<=0.96; sub-gap unchanged; NO QED.',
  },
];

for (const a of IMP97379_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97379-krein-csharp-2d-richardson-third-order assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
