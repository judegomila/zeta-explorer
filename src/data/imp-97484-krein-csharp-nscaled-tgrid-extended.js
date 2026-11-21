/**
 * @module imp-97484-krein-csharp-nscaled-tgrid-extended
 * @fileoverview imp-97484 -- MEASUREMENT: extend the imp-97456 well-resolved lam_min(N,T) table for the
 *   Krein c_sharp upper bracket at 2a=ln3 to N=148 and N=164 on correspondingly slid inner-T windows, to
 *   test whether the imp-97456 FINDING-1 artifact-free monotone-DECREASE-in-N of the directly-read
 *   high-T bracket PERSISTS past N=132 (or re-reverses), and to push the best directly-read resolved
 *   upper bracket below the imp-97456 value 0.579022.
 *
 *   METHOD (tmp/imp-97484-nscaled-tgrid.py, dps=50, Nmax=164, panel=1.5, gl=24). One extended-precision
 *   build to T_max=8000 snapshotting the cumulative A entry A_{nm}(T) = (1/pi) int_0^T sigma2 R_n R_m dt at
 *   a checkpoint ladder {1600,...,6400,7200,8000} yields lam_min(N,T) for every (N, checkpoint). Each N
 *   reads a T-window that slides right with N (inner-T center ~ 50*N): the two NEW rows are
 *   N=148 -> {4800,5600,6400,7200} and N=164 -> {5600,6400,7200,8000}. Reuses the exact-entry
 *   extended-precision machinery of imp-97183 (exact GL overlaps, Miller/forward spherical Bessel,
 *   sigma2 = (t^2+1/4)^2 w_1) and the checkpointed build of imp-97456. Build time 1281s. Raw output
 *   tmp/imp-97484-run.log.
 *
 *   CROSS-CHECK. Every cell shared with the imp-97456 table (N in {84,100,116,132}, T in {4800,5600,6400})
 *   reproduces EXACTLY to the printed six digits (e.g. N=132,T=6400 = 0.579022; N=84,T=4800 = 0.580915),
 *   validating that the Nmax=164 build reproduces the Nmax=132 build on its leading slices.
 *
 *   MEASUREMENT ONLY. lam_min(N,.) are Rayleigh-Ritz UPPER brackets; establishes NO operator positivity; NO
 *   lower bound; no bound moves; interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * THE EXTENDED WELL-RESOLVED lam_min(N,T) TABLE (fitter-free, the trustworthy object). Each column is
 *   monotone INCREASING in T (cumulative T resolves the inner limit from below); each column is monotone
 *   DECREASING in N. The two NEW rows N=148,164 extend the imp-97456 rows N=84..132:
 *     N\T     4800     5600     6400     7200     8000
 *      84  0.580915 0.581016 0.581074 0.581110 0.581134
 *     100  0.579986 0.580160 0.580261 0.580324 0.580365
 *     116  0.579184 0.579469 0.579634 0.579736 0.579804
 *     132  0.578318 0.578762 0.579022 0.579184 0.579291
 *     148  0.577530 0.578166 0.578541 0.578776 0.578930   <- NEW
 *     164  0.576636 0.577508 0.578029 0.578357 0.578574   <- NEW
 *
 * FINDING 1 -- THE ARTIFACT-FREE MONOTONE-DECREASE-IN-N PERSISTS THROUGH N=148 AND N=164. Reading each
 *   well-resolved column (T=4800,5600,6400,7200,8000) top-to-bottom over all six N, lam_min(N) is strictly
 *   DECREASING in N at every such T, with no re-reversal at the two new rows. At T=8000 the full column is
 *   0.581134 -> 0.580365 -> 0.579804 -> 0.579291 -> 0.578930 -> 0.578574 (first diffs -0.000769, -0.000561,
 *   -0.000513, -0.000361, -0.000356; the two right-most diffs are the NEW N=132->148 and N=148->164 steps,
 *   both negative). This continues the imp-97456 FINDING-1 behaviour: under N-uniform (high-T) resolution the
 *   bracket keeps falling with N as a well-behaved Rayleigh-Ritz sequence should, and the coupled-T-truncation
 *   attribution stands out to N=164.
 *
 * FINDING 2 -- NEW BEST DIRECTLY-READ RESOLVED UPPER BRACKET c_sharp <= 0.578574 (N=164, T=8000). The
 *   most-resolved reading (largest N at the largest T) is 0.578574, below the imp-97456 best 0.579022 at
 *   (N=132,T=6400) by 0.000448. The correct directly-read bracket is the RIGHT (largest-T) edge of a slid
 *   window (or a common largest T), NOT a global minimum over all (N,T): because every column INCREASES in T,
 *   the small-T cells are UNDER-resolved and read spuriously low (e.g. N=164,T=4800 = 0.576636 is the least
 *   resolved cell, not a valid tighter bracket). The bracket is still slowly decreasing in N and slowly
 *   increasing in T, so it is NOT converged and stays an UPPER bracket <~0.581, not interval-certified and
 *   not a positive lower bound.
 *
 * FINDING 3 -- THE T->inf EXTRAPOLATION FIT REMAINS UNSTABLE ON THE NEW SLIDING WINDOWS (no clean rate),
 *   matching imp-97456 FINDING 2. The per-N deficit fit lam(N,T)=Linf-C*T^-p_T again rails to the log-linear
 *   search clamp on the new rows (N=148: p_T=0.03, Linf~0.6788; N=164: p_T=0.03, Linf~0.6786), so no reliable
 *   Richardson/Aitken outer-N limit or rate is extractable -- the residual sub-gap
 *   IMP97456_CSHARP_NRATE_NEEDS_WELL_CONDITIONED_TINF_FIT stays open.
 *
 * VERDICT. Extending the well-resolved table to N=148,164 CONFIRMS that the imp-97456 artifact-free monotone
 *   decrease in N persists (Finding 1) with no re-reversal, and pushes the best directly-read resolved upper
 *   bracket to c_sharp <= 0.578574 at (N=164,T=8000), below the previous 0.579022 (Finding 2). The T->inf
 *   fit stays ill-conditioned on the sliding windows so no convergence rate is obtained (Finding 3): the
 *   residual sub-gap IMP97456_CSHARP_NRATE_NEEDS_WELL_CONDITIONED_TINF_FIT is unchanged. Measurement only;
 *   lam_min(N,.) stay UPPER brackets; no positive lower bound; no operator positivity; no bound moves;
 *   interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97456-krein-csharp-nscaled-tgrid.js (FINDING 1 this leaf extends; N=84..132 well-resolved table)
 * @see imp-97439-krein-csharp-nbracket-richardson-nonconvergence.js (the coupled-T-truncation attribution)
 * @see imp-97183-csharp-extprec-ladder.py (extended-precision Rayleigh-Ritz ladder reused for exact entries)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (coupled N,T joint limit; inner T->inf Stage 1)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (why the upper bracket gives no lower bound)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97484_BINDING_2A = LN3;
export const IMP97484_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement

export const IMP97484_BUILD = Object.freeze({
  script: 'tmp/imp-97484-nscaled-tgrid.py',
  dps: 50,
  Nmax: 164,
  panel: 1.5,
  gl: 24,
  checkpoints: Object.freeze([1600, 2400, 3200, 4000, 4800, 5600, 6400, 7200, 8000]),
  buildSeconds: 1281,
});

// The extended well-resolved lam_min(N,T) table (fitter-free). Keyed "N,T"; values are Rayleigh-Ritz UPPER
// brackets. Columns 4800..8000 for N in {84,100,116,132} match imp-97456 exactly (cross-check); N=148,164
// are new. All six N are rows; the two right-most T (7200,8000) are new for the imp-97456 N as well.
export const IMP97484_LAM_TABLE = Object.freeze({
  '84,4800': 0.580915, '84,5600': 0.581016, '84,6400': 0.581074, '84,7200': 0.581110, '84,8000': 0.581134,
  '100,4800': 0.579986, '100,5600': 0.580160, '100,6400': 0.580261, '100,7200': 0.580324, '100,8000': 0.580365,
  '116,4800': 0.579184, '116,5600': 0.579469, '116,6400': 0.579634, '116,7200': 0.579736, '116,8000': 0.579804,
  '132,4800': 0.578318, '132,5600': 0.578762, '132,6400': 0.579022, '132,7200': 0.579184, '132,8000': 0.579291,
  '148,4800': 0.577530, '148,5600': 0.578166, '148,6400': 0.578541, '148,7200': 0.578776, '148,8000': 0.578930,
  '164,4800': 0.576636, '164,5600': 0.577508, '164,6400': 0.578029, '164,7200': 0.578357, '164,8000': 0.578574,
});

// The two NEW N-scaled sliding inner-T windows (center ~ 50*N).
export const IMP97484_NEW_WINDOWS = Object.freeze({
  148: Object.freeze([4800, 5600, 6400, 7200]),
  164: Object.freeze([5600, 6400, 7200, 8000]),
});

export const IMP97484_RESOLVED_COLUMNS = Object.freeze([4800, 5600, 6400, 7200, 8000]);
export const IMP97484_N_ROWS = Object.freeze([84, 100, 116, 132, 148, 164]);

// Finding 1 -- the well-resolved columns stay monotone DECREASING in N through the two new rows.
export const IMP97484_RESOLVED_IS_MONOTONE_DECREASING_IN_N = Object.freeze({
  columnsChecked: IMP97484_RESOLVED_COLUMNS,
  Ns: IMP97484_N_ROWS,
  columnAtT8000: Object.freeze([0.581134, 0.580365, 0.579804, 0.579291, 0.578930, 0.578574]),
  firstDiffsAtT8000: Object.freeze([-0.000769, -0.000561, -0.000513, -0.000361, -0.000356]),
  monotoneDecreasingAtEveryResolvedT: true,
  persistsThroughN148AndN164: true,
  reReversalDetected: false,
});

// Finding 2 -- new best directly-read resolved upper bracket.
export const IMP97484_BEST_BRACKET = Object.freeze({
  value: 0.578574,
  atN: 164,
  atT: 8000,
  previousBest: 0.579022, // imp-97456, at N=132,T=6400
  previousBestAt: 'N=132, T=6400',
  improvement: 0.000448,
  belowPrevious: true,
  // WHY the global-min-over-(N,T) reading is NOT a valid tighter bracket:
  underResolvedMinCell: Object.freeze({ N: 164, T: 4800, value: 0.576636 }),
  note: 'columns increase in T so small-T cells are under-resolved and read spuriously low; the valid directly-read bracket is the largest-T (most-resolved) reading, not the global minimum.',
  isUpperBracket: true,
  intervalCertified: false,
  positiveLowerBound: false,
});

// Finding 3 -- the T->inf fit stays unstable on the new sliding windows (no rate), as in imp-97456.
export const IMP97484_NSCALED_FIT_NEW = Object.freeze({
  N148: Object.freeze({ pT: 0.03, lamInf: 0.678776, railedToClamp: true }),
  N164: Object.freeze({ pT: 0.03, lamInf: 0.678574, railedToClamp: true }),
  stable: false,
  outerNRateMeasured: false,
});

export const IMP97484_VERDICT = Object.freeze({
  ticket: 'imp-97484',
  question:
    'extending the imp-97456 well-resolved lam_min(N,T) table (c_sharp = lambda_min(P_a M_sigma2 P_a) at 2a=ln3) to N=148 and N=164 on correspondingly slid inner-T windows, does the artifact-free monotone-DECREASE-in-N of the directly-read high-T bracket persist past N=132, and does the best directly-read resolved upper bracket fall below the imp-97456 value 0.579022?',
  answer:
    'yes on both. The monotone decrease in N PERSISTS: at every well-resolved column T=4800..8000 lam_min(N) is strictly decreasing across all six N=84..164, with no re-reversal at the two new rows (at T=8000: 0.581134, 0.580365, 0.579804, 0.579291, 0.578930, 0.578574; the two new first-diffs -0.000361, -0.000356 stay negative). The best directly-read resolved upper bracket falls to c_sharp <= 0.578574 at (N=164, T=8000), below the previous 0.579022 at (N=132, T=6400) by 0.000448. The bracket is still slowly decreasing in N and slowly increasing in T so it is NOT converged; it stays an UPPER bracket, not interval-certified and not a positive lower bound. The per-N T->inf extrapolation fit again rails to the log-linear search clamp on the new sliding windows (N=148,164: p_T=0.03, Linf~0.679), so no convergence rate is extractable and the residual sub-gap IMP97456_CSHARP_NRATE_NEEDS_WELL_CONDITIONED_TINF_FIT is unchanged.',
  binding_2a: LN3,
  // Finding 1
  monotoneDecreaseInNPersists: true,
  reReversalAtNewRows: false,
  // Finding 2
  newBestResolvedUpperBracket: 0.578574,
  newBestResolvedAt: 'N=164, T=8000',
  belowImp97456Best: true,
  isUpperBracketOnLambda1: true,
  positiveLowerBoundProduced: false,
  intervalCertified: false,
  // Finding 3
  tinfFitStableOnSlidingWindows: false,
  outerNRateMeasured: false,
  // cross-check
  reproducesImp97456SharedCells: true,
  // program state unchanged
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  residualSubGap: 'IMP97456_CSHARP_NRATE_NEEDS_WELL_CONDITIONED_TINF_FIT (unchanged: the N-scaled T->inf fit stays ill-conditioned on the sliding windows so no outer-N convergence rate is extractable).',
  qed: false,
});
export default IMP97484_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97484_ASSERTIONS = [
  {
    id: 'imp97484-resolved-columns-monotone-decreasing-in-N-through-164',
    holds: () => {
      for (const T of IMP97484_RESOLVED_COLUMNS) {
        const col = IMP97484_N_ROWS.map((N) => IMP97484_LAM_TABLE[`${N},${T}`]);
        for (let i = 1; i < col.length; i++) {
          if (!(col[i] < col[i - 1])) return false;
        }
      }
      return (
        IMP97484_RESOLVED_IS_MONOTONE_DECREASING_IN_N.monotoneDecreasingAtEveryResolvedT === true &&
        IMP97484_RESOLVED_IS_MONOTONE_DECREASING_IN_N.persistsThroughN148AndN164 === true &&
        IMP97484_RESOLVED_IS_MONOTONE_DECREASING_IN_N.reReversalDetected === false &&
        IMP97484_VERDICT.monotoneDecreaseInNPersists === true
      );
    },
    why: 'at every well-resolved column T=4800..8000 the bracket lam_min(N) is strictly DECREASING across all six N=84..164, so the imp-97456 artifact-free monotone decrease persists through the two new rows with no re-reversal.',
  },
  {
    id: 'imp97484-columns-increase-with-T',
    holds: () => {
      for (const N of IMP97484_N_ROWS) {
        for (let i = 1; i < IMP97484_RESOLVED_COLUMNS.length; i++) {
          const Ti = IMP97484_RESOLVED_COLUMNS[i];
          const Tp = IMP97484_RESOLVED_COLUMNS[i - 1];
          if (!(IMP97484_LAM_TABLE[`${N},${Ti}`] > IMP97484_LAM_TABLE[`${N},${Tp}`])) return false;
        }
      }
      return true;
    },
    why: 'each fixed-N column is monotone INCREASING in T -- cumulative-T quadrature resolves the inner limit from below, so small-T cells are under-resolved (why the global-min-over-T reading is not a valid bracket).',
  },
  {
    id: 'imp97484-new-best-bracket-below-97456',
    holds: () => {
      const v = IMP97484_LAM_TABLE['164,8000'];
      return (
        Math.abs(v - IMP97484_BEST_BRACKET.value) < 1e-9 &&
        IMP97484_BEST_BRACKET.value < IMP97484_BEST_BRACKET.previousBest &&
        Math.abs(IMP97484_BEST_BRACKET.previousBest - 0.579022) < 1e-9 &&
        IMP97484_BEST_BRACKET.belowPrevious === true &&
        IMP97484_VERDICT.newBestResolvedUpperBracket === IMP97484_BEST_BRACKET.value &&
        IMP97484_VERDICT.belowImp97456Best === true
      );
    },
    why: 'the most-resolved reading (N=164, T=8000) = 0.578574 is below the imp-97456 best directly-read resolved bracket 0.579022, an improvement of 0.000448.',
  },
  {
    id: 'imp97484-reproduces-imp97456-shared-cells',
    holds: () =>
      Math.abs(IMP97484_LAM_TABLE['132,6400'] - 0.579022) < 1e-9 &&
      Math.abs(IMP97484_LAM_TABLE['84,4800'] - 0.580915) < 1e-9 &&
      Math.abs(IMP97484_LAM_TABLE['116,5600'] - 0.579469) < 1e-9 &&
      IMP97484_VERDICT.reproducesImp97456SharedCells === true,
    why: 'the Nmax=164 build reproduces the imp-97456 Nmax=132 cells exactly on the shared (N,T), validating the extended computation.',
  },
  {
    id: 'imp97484-tinf-fit-unstable-no-rate',
    holds: () =>
      IMP97484_NSCALED_FIT_NEW.stable === false &&
      IMP97484_NSCALED_FIT_NEW.N148.railedToClamp === true &&
      IMP97484_NSCALED_FIT_NEW.N164.railedToClamp === true &&
      IMP97484_NSCALED_FIT_NEW.outerNRateMeasured === false &&
      IMP97484_VERDICT.tinfFitStableOnSlidingWindows === false &&
      IMP97484_VERDICT.outerNRateMeasured === false,
    why: 'the per-N T->inf power-law fit again rails to the log-linear search clamp on the new sliding windows, so no reliable outer-N convergence rate is extractable (residual sub-gap unchanged).',
  },
  {
    id: 'imp97484-measurement-only-no-qed',
    holds: () =>
      IMP97484_VERDICT.positiveLowerBoundProduced === false &&
      IMP97484_VERDICT.isUpperBracketOnLambda1 === true &&
      IMP97484_VERDICT.intervalCertified === false &&
      IMP97484_VERDICT.newBestResolvedUpperBracket < 0.581 &&
      IMP97484_VERDICT.operatorPositivityProved === false &&
      IMP97484_VERDICT.boundMoves === false &&
      IMP97484_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97484_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97484_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97484_VERDICT.residualSubGap === 'string' &&
      IMP97484_VERDICT.residualSubGap.includes('IMP97456_CSHARP_NRATE_NEEDS_WELL_CONDITIONED_TINF_FIT') &&
      IMP97484_VERDICT.qed === false,
    why: 'measurement only: lam_min(N,.) are Rayleigh-Ritz UPPER brackets; no positive lower bound, no operator positivity, not interval-certified; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97484_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97484-krein-csharp-nscaled-tgrid-extended assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
