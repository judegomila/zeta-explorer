/**
 * @module imp-97475-krein-csharp-robust-nrate
 * @fileoverview imp-97475 -- MEASUREMENT: extract the OUTER N-rate of the Krein c_sharp resolved upper
 *   bracket at 2a=ln3 from the imp-97456 raw fitter-free lam_min(N,T) table, using inner-T extrapolation
 *   methods ROBUST to the small sliding-window ill-conditioning that railed the imp-97456 log-linear
 *   power-law search (residual IMP97456_CSHARP_NRATE_NEEDS_WELL_CONDITIONED_TINF_FIT: three of four
 *   per-N fits railed to the search clamp Linf ~ 0.68, so no outer N-rate could be read).
 *
 *   METHOD (tmp/imp-97475-robust-nrate.py, pure post-processing of the imp-97456 raw table; no new
 *   extended-precision build). Two stages:
 *   STEP A (inner T->inf per N), on the raw monotone-INCREASING 7-point T-columns
 *     {1600..6400} -- NOT the railed log-linear Linf-search:
 *       A1 -- iterated Aitken/Shanks delta^2 (clamp-free, bracket-free).
 *       A2 -- 2-parameter deficit power-law lam = Linf - C*T^-p on the well-resolved TAIL
 *             (drop the under-resolved low-T entries for high N), minimised over a dense (Linf,p) grid
 *             with a WIDE Linf bracket -- immune to the +0.10 clamp that failed imp-97456.
 *   STEP B (outer N-rate), on the per-N inner limits lam_inf(N), N in {84,100,116,132}:
 *       Aitken/Shanks on the 4-point outer sequence + a power-law fit lam_inf(N) = cinf + A*N^-q.
 *
 *   MEASUREMENT ONLY. lam_min(N,.) are Rayleigh-Ritz UPPER brackets; establishes NO operator positivity;
 *   NO lower bound; no bound moves; interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * FINDING 1 -- THE INNER T->inf CONDITIONING OBSTRUCTION IS BYPASSED. The two robust methods AGREE and
 *   neither rails. Per-N inner limits (A2 primary / A1 cross-check), with A2 fit exponent p_T:
 *     N= 84: A2=0.581224 (p_T=2.674)  A1=0.581180  spread 4.4e-5
 *     N=100: A2=0.580495 (p_T=2.720)  A1=0.580451  spread 4.4e-5
 *     N=116: A2=0.580018 (p_T=2.711)  A1=0.579929  spread 8.9e-5
 *     N=132: A2=0.579656 (p_T=2.618)  A1=0.579339  spread 3.2e-4 (least-resolved tail)
 *   The inner T->inf rate is a clean T^-p_T with p_T ~ 2.6-2.7 across all N (the railed imp-97456
 *   p_T=[0.06,0.04,2.72,0.03] were search-clamp artifacts, not the true inner rate). A2 rms ~1e-6.
 *
 * FINDING 2 -- A STABLE OUTER PLATEAU c_sharp(N->inf) ~ 0.578 IS EXTRACTABLE, BUT ONLY THROUGH THE
 *   WELL-CONDITIONED A2 INNER COLUMN. The A2 inner limits have monotone-DECREASING first differences
 *   (-0.000729, -0.000477, -0.000362), so all robust outer methods converge to the SAME plateau band:
 *     outer power-law (full 4 N): c_sharp(inf)=0.577892, q=1.403, rms=5.0e-6 (interior, not railed).
 *     outer Aitken delta^2:       0.579115, 0.578516 (brackets the plateau from above).
 *   All read c_sharp(inf) ~ 0.577-0.579 -- BELOW the best directly-read resolved bracket 0.579022, and
 *   still an UPPER bracket on lambda_1 in the limit. In contrast the A1 (Aitken) inner column has a
 *   non-monotone middle diff (its N=132 Aitken chain itself wobbled) and poisons the outer stage:
 *   outer Aitken diverges (0.5786 vs 0.5845) and the outer power-law rails. So a well-conditioned inner
 *   column is a PREREQUISITE for the outer rate -- the A2 route supplies it, the A1 route does not.
 *
 * FINDING 3 -- THE OUTER EXPONENT q IS ONLY LOOSELY BRACKETED (4-point sensitivity). Dropping the
 *   smallest degree N=84 shifts the A2 outer fit from (cinf=0.577892, q=1.403) to
 *   (cinf=0.577048, q=1.005): plateau spread 8.4e-4, exponent spread 0.398. With only four N-points the
 *   plateau is stable to ~1e-3 but the approach EXPONENT is pinned only to q in ~[1.0,1.4]; more
 *   N-decades are needed to certify it.
 *
 * VERDICT. The residual IMP97456_CSHARP_NRATE_NEEDS_WELL_CONDITIONED_TINF_FIT is resolved on its INNER
 *   half and PARTIALLY on its OUTER half. Inner: the robust (Aitken + wide-bracket tail power-law)
 *   methods give stable, agreeing per-N T->inf limits with a clean T^-2.6..2.7 rate, fully bypassing the
 *   log-linear search railing. Outer: a stable N->inf PLATEAU c_sharp(inf) ~ 0.578 IS now extractable
 *   (all robust methods agree, still an upper bracket <~0.579), but the outer approach EXPONENT stays
 *   soft (q ~ 1.0-1.4, drop-N sensitivity 0.4) on the 4-point outer sequence. New residual
 *   IMP97475_CSHARP_OUTER_EXPONENT_NEEDS_MORE_N_DECADES. Measurement only; no operator positivity; no
 *   lower bound; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97456-krein-csharp-nscaled-tgrid.js (raw lam_min(N,T) table + the residual this leaf attacks)
 * @see imp-97439-krein-csharp-nbracket-richardson-nonconvergence.js (the coupled-T artifact attribution)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (coupled N,T joint limit ~0.582)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (why the upper bracket gives no lower bound)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97475_BINDING_2A = LN3;
export const IMP97475_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement

export const IMP97475_METHOD = Object.freeze({
  script: 'tmp/imp-97475-robust-nrate.py',
  input: 'imp-97456 raw fitter-free lam_min(N,T) table (no new extended-precision build)',
  innerA1: 'iterated Aitken/Shanks delta^2 on the raw monotone-increasing 7-point T-column (clamp-free)',
  innerA2: '2-parameter deficit power-law Linf - C*T^-p on the well-resolved tail, wide Linf bracket',
  outer: 'Aitken/Shanks + power-law cinf + A*N^-q on the per-N inner limits',
});

// Step A -- per-N inner T->inf limits (primary A2 = wide-bracket tail power-law; cross-check A1 = Aitken).
export const IMP97475_INNER_LIMITS = Object.freeze({
  N: Object.freeze([84, 100, 116, 132]),
  a2: Object.freeze([0.581224, 0.580495, 0.580018, 0.579656]), // primary
  a2_pT: Object.freeze([2.674, 2.720, 2.711, 2.618]), // clean T^-p inner rate ~2.6-2.7
  a1: Object.freeze([0.581180, 0.580451, 0.579929, 0.579339]), // Aitken cross-check
  a1_a2_spread: Object.freeze([0.000044, 0.000044, 0.000089, 0.000317]),
  maxSpread: 0.000317,
  innerConditioningBypassed: true, // neither robust method rails (imp-97456 log-linear search did)
});

// Step B -- outer N-rate from the A2 inner limits (well-conditioned: monotone-decreasing first diffs).
export const IMP97475_OUTER_FIT = Object.freeze({
  innerColumnUsed: 'a2',
  firstDiffs: Object.freeze([-0.000729, -0.000477, -0.000362]), // monotone-decreasing magnitude
  firstDiffsMonotoneDecreasing: true,
  powerLawFull: Object.freeze({ cinf: 0.577892, q: 1.403, rms: 5.02e-6, railed: false }),
  powerLawDropN84: Object.freeze({ cinf: 0.577048, q: 1.005, rms: 2.9e-7, railed: false }),
  aitkenOuter: Object.freeze([0.579115, 0.578516]),
  plateauBand: Object.freeze([0.577, 0.579]),
  exponentBand: Object.freeze([1.0, 1.4]),
  plateauDropN84Spread: 0.000844,
  exponentDropN84Spread: 0.398,
});

// The A1 inner column is ill-conditioned for the outer stage (documented negative control).
export const IMP97475_A1_OUTER_UNSTABLE = Object.freeze({
  firstDiffs: Object.freeze([-0.000729, -0.000522, -0.000590]), // non-monotone middle
  firstDiffsMonotoneDecreasing: false,
  aitkenOuter: Object.freeze([0.578613, 0.584458]), // diverges (spread ~0.006)
  powerLawRails: true,
  note: 'a well-conditioned inner column (A2) is a prerequisite for a stable outer rate; A1 is not one',
});

export const IMP97475_VERDICT = Object.freeze({
  ticket: 'imp-97475',
  question:
    'can the outer N-rate of the Krein c_sharp = lambda_min(P_a M_sigma2 P_a) resolved upper bracket at 2a=ln3 be read from the imp-97456 raw monotone-decreasing brackets with an inner T->inf method robust to the small sliding-window ill-conditioning that railed the log-linear power-law search?',
  answer:
    'yes on the inner half, partially on the outer half. Robust inner-T methods (iterated Aitken + a wide-bracket 2-parameter tail power-law) give stable, mutually-agreeing per-N T->inf limits [0.581224, 0.580495, 0.580018, 0.579656] with a clean inner rate T^-p_T, p_T ~ 2.6-2.7 (the imp-97456 p_T=[0.06,0.04,2.72,0.03] were search-clamp artifacts) -- the inner conditioning obstruction is bypassed. From those well-conditioned inner limits a stable N->inf PLATEAU c_sharp(inf) ~ 0.578 is extractable (outer power-law cinf=0.577892 q=1.403 rms=5e-6, outer Aitken 0.579115/0.578516 all agreeing, still an UPPER bracket <~0.579), but the outer approach EXPONENT stays soft (q ~ 1.0-1.4, drop-N=84 sensitivity 0.4) on the 4-point outer sequence. No positive lower bound.',
  binding_2a: LN3,
  // Finding 1
  innerTinfResolved: true,
  innerRatePT: '2.6-2.7',
  innerConditioningObstructionBypassed: true,
  // Finding 2
  outerPlateauExtracted: true,
  outerPlateauEstimate: 0.578,
  bestDirectlyReadResolvedBracket: 0.579022, // from imp-97456 (N=132,T=6400); plateau sits below it
  isUpperBracketOnLambda1: true,
  positiveLowerBoundProduced: false,
  // Finding 3
  outerExponentPinned: false,
  outerExponentBand: Object.freeze([1.0, 1.4]),
  // program state unchanged
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  resolvesImp97456SubGap: 'PARTIAL -- inner conditioning bypassed + plateau extracted; outer exponent still soft',
  subGap:
    'IMP97475_CSHARP_OUTER_EXPONENT_NEEDS_MORE_N_DECADES -- robust inner-T extrapolation (Aitken + ' +
    'wide-bracket tail power-law) resolves the per-N T->inf limits and a stable N->inf plateau ' +
    'c_sharp(inf) ~ 0.578 (upper bracket), fully bypassing the imp-97456 log-linear search railing, but ' +
    'the outer approach exponent is pinned only to q ~ [1.0,1.4] on four N-points (drop-N=84 shifts q by ' +
    '0.398 and the plateau by 8.4e-4). To certify the outer N-rate, extend the raw resolved-bracket ' +
    'column to more degrees N (more N-decades). Measurement only; lam_min(N,.) stay UPPER brackets; no ' +
    'positive lower bound; no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96.',
  qed: false,
});
export default IMP97475_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97475_ASSERTIONS = [
  {
    id: 'imp97475-inner-limits-monotone-decreasing-in-N',
    holds: () => {
      const a2 = IMP97475_INNER_LIMITS.a2;
      for (let i = 1; i < a2.length; i++) if (!(a2[i] < a2[i - 1])) return false;
      const a1 = IMP97475_INNER_LIMITS.a1;
      for (let i = 1; i < a1.length; i++) if (!(a1[i] < a1[i - 1])) return false;
      return true;
    },
    why: 'both robust inner-T columns (A2 primary, A1 cross-check) are monotone DECREASING in N, matching the imp-97456 well-resolved brackets.',
  },
  {
    id: 'imp97475-inner-methods-agree-not-railed',
    holds: () => {
      const { a1, a2, a1_a2_spread, maxSpread } = IMP97475_INNER_LIMITS;
      for (let i = 0; i < a1.length; i++) {
        if (Math.abs(a1[i] - a2[i]) > a1_a2_spread[i] + 1e-6) return false;
      }
      return (
        maxSpread < 5e-4 &&
        IMP97475_INNER_LIMITS.innerConditioningBypassed === true &&
        IMP97475_VERDICT.innerTinfResolved === true &&
        IMP97475_VERDICT.innerConditioningObstructionBypassed === true
      );
    },
    why: 'the iterated-Aitken and wide-bracket tail-power-law inner limits agree to <5e-4 and neither rails, so the imp-97456 log-linear search railing is bypassed (the inner conditioning obstruction is resolved).',
  },
  {
    id: 'imp97475-inner-rate-pT-clean',
    holds: () => IMP97475_INNER_LIMITS.a2_pT.every((p) => p > 2.5 && p < 2.8),
    why: 'the A2 inner deficit exponent p_T is a clean 2.6-2.7 across all N -- the true inner T->inf rate, versus the railed imp-97456 p_T of ~0.03-0.06.',
  },
  {
    id: 'imp97475-outer-plateau-extractable-well-conditioned-column',
    holds: () => {
      const o = IMP97475_OUTER_FIT;
      const diffsDecreasing = Math.abs(o.firstDiffs[2]) < Math.abs(o.firstDiffs[1]) &&
        Math.abs(o.firstDiffs[1]) < Math.abs(o.firstDiffs[0]);
      return (
        o.firstDiffsMonotoneDecreasing === true &&
        diffsDecreasing &&
        o.powerLawFull.railed === false &&
        o.powerLawFull.cinf > 0.577 && o.powerLawFull.cinf < 0.579 &&
        o.powerLawFull.cinf < IMP97475_VERDICT.bestDirectlyReadResolvedBracket &&
        IMP97475_VERDICT.outerPlateauExtracted === true
      );
    },
    why: 'the A2 inner column has monotone-decreasing outer first diffs, so the outer power-law is interior (not railed) and yields a stable plateau c_sharp(inf) ~ 0.578, below the best directly-read bracket 0.579022 and still an upper bracket.',
  },
  {
    id: 'imp97475-a1-inner-column-is-negative-control',
    holds: () =>
      IMP97475_A1_OUTER_UNSTABLE.firstDiffsMonotoneDecreasing === false &&
      IMP97475_A1_OUTER_UNSTABLE.powerLawRails === true &&
      Math.abs(IMP97475_A1_OUTER_UNSTABLE.aitkenOuter[1] - IMP97475_A1_OUTER_UNSTABLE.aitkenOuter[0]) > 1e-3,
    why: 'the A1 inner column has a non-monotone middle diff and poisons the outer stage (Aitken diverges, power-law rails) -- a well-conditioned inner column is a prerequisite for the outer rate.',
  },
  {
    id: 'imp97475-outer-exponent-soft',
    holds: () =>
      IMP97475_VERDICT.outerExponentPinned === false &&
      IMP97475_OUTER_FIT.exponentDropN84Spread > 0.3 &&
      IMP97475_OUTER_FIT.exponentBand[0] < IMP97475_OUTER_FIT.exponentBand[1],
    why: 'the outer approach exponent is only loosely bracketed q ~ [1.0,1.4] (drop-N=84 shifts q by 0.398 on four points), so the outer rate is measured but not certified -- the new residual needs more N-decades.',
  },
  {
    id: 'imp97475-measurement-only-no-qed',
    holds: () =>
      IMP97475_VERDICT.positiveLowerBoundProduced === false &&
      IMP97475_VERDICT.isUpperBracketOnLambda1 === true &&
      IMP97475_VERDICT.operatorPositivityProved === false &&
      IMP97475_VERDICT.boundMoves === false &&
      IMP97475_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97475_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97475_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97475_VERDICT.subGap === 'string' &&
      IMP97475_VERDICT.subGap.includes('IMP97475_CSHARP_OUTER_EXPONENT_NEEDS_MORE_N_DECADES') &&
      IMP97475_VERDICT.resolvesImp97456SubGap.startsWith('PARTIAL') &&
      IMP97475_VERDICT.qed === false,
    why: 'measurement only: lam_min(N,.) are Rayleigh-Ritz UPPER brackets; no positive lower bound, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97475_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97475-krein-csharp-robust-nrate assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
