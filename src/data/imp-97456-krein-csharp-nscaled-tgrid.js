/**
 * @module imp-97456-krein-csharp-nscaled-tgrid
 * @fileoverview imp-97456 -- MEASUREMENT: re-run the Krein c_sharp(N) upper bracket at 2a=ln3 on an
 *   N-SCALED inner T-grid to test the imp-97439 FINDING-3 attribution that the apparent late-N RISE of the
 *   bracket (N=116:0.581624, N=132:0.582646) is a COUPLED-T-TRUNCATION artifact rather than genuine
 *   N-behaviour. imp-97439 tied the rise to a monotonically DEGRADING inner-T fit exponent
 *   p_T (2.44 -> 1.77 across N=84..132, corr(p_T, lam) = -0.826) on the FIXED T-grid {800,1600,2400,3200},
 *   and named the residual sub-gap IMP97439_CSHARP_NBRACKET_RATE_NEEDS_N_UNIFORM_INNER_T_LIMIT -- decide the
 *   N-rate only after the inner T->inf limit is made N-uniform (T-grid scaled with N so p_T stays ~2+).
 *
 *   METHOD (tmp/imp-97456-nscaled-Tgrid.py, dps=50, Nmax=132, panel=1.5, gl=24). The A entry
 *   A_{nm}(T) = (1/pi) int_0^T sigma2 R_n R_m dt is a CUMULATIVE integral in T, so ONE extended-precision
 *   build to T_max snapshotting A at a checkpoint ladder {1600,2400,3200,4000,4800,5600,6400} yields
 *   lam_min(N,T) for every (N, checkpoint). Each N then reads a T-window that slides right with N (inner-T
 *   center ~ 50*N): N=84 -> {1600,2400,3200,4000}, N=100 -> {2400,3200,4000,4800},
 *   N=116 -> {3200,4000,4800,5600}, N=132 -> {4000,4800,5600,6400}, so higher-degree phi_n (whose R_n
 *   support reaches larger t) are integrated over a correspondingly larger t-window. Uses the exact-entry
 *   extended-precision machinery of imp-97183 (exact GL overlaps, Miller/forward spherical Bessel,
 *   sigma2 = (t^2+1/4)^2 w_1). Build time 712s. Raw output tmp/imp-97456-run.log, /tmp/imp-97456-out.json.
 *
 *   MEASUREMENT ONLY. lam_min(N,.) are Rayleigh-Ritz UPPER brackets; establishes NO operator positivity; NO
 *   lower bound; no bound moves; interval-rigorous certificate reach stays 2a<=0.96; no refereed bound is changed
 *   ; RH open; NO QED.
 *
 * THE RAW lam_min(N,T) TABLE (fitter-free, the trustworthy object). Each column is monotone INCREASING in T
 *   (cumulative T resolves the inner limit from below); each row of a well-resolved column is monotone
 *   DECREASING in N:
 *     N\T     1600     2400     3200     4000     4800     5600     6400
 *      84  0.575381 0.579247 0.580315 0.580724 0.580915 0.581016 0.581074
 *     100  0.570766 0.577134 0.578954 0.579658 0.579986 0.580160 0.580261
 *     116  0.565204 0.574650 0.577514 0.578649 0.579184 0.579469 0.579634
 *     132  0.558884 0.571618 0.575779 0.577492 0.578318 0.578762 0.579022
 *
 * FINDING 1 -- ON THE WELL-RESOLVED GRID THE DRIFT-UP IS GONE AND REVERSES TO MONOTONE-DECREASING IN N.
 *   Reading each fixed high-resolution column (T=4000,4800,5600,6400) top-to-bottom, lam_min(N) is strictly
 *   DECREASING in N at every such T (e.g. at T=6400: 0.581074 -> 0.580261 -> 0.579634 -> 0.579022, first
 *   diffs -0.000813, -0.000627, -0.000612). This is the OPPOSITE of the imp-97439 fixed-grid late-N RISE at
 *   N=116,132, and it DIRECTLY CONFIRMS imp-97439 FINDING 3: the earlier upward drift was contamination from
 *   an under-resolved inner limit, not genuine c_sharp(N) growth. Under N-uniform (high-T) resolution the
 *   bracket falls with N as a well-behaved Rayleigh-Ritz sequence should.
 *
 * FINDING 2 -- BUT THE T->inf EXTRAPOLATION FIT IS STILL NUMERICALLY UNSTABLE ON THE SLIDING WINDOWS, SO NO
 *   CLEAN RATE. The per-N deficit fit lam(N,T) = Linf - C*T^-p_T (residual-minimising Linf search, mirrors
 *   imp-97206) does NOT stabilise: on the N-scaled windows p_T = [0.06, 0.04, 2.72, 0.03] and three of the
 *   four fits RAIL to the search-clamp upper boundary Linf = lam_last + 0.10 (~0.68, a failed-fit signature),
 *   only N=116 finding an interior fit (Linf=0.580013, p_T=2.72). corr(p_T, lam_inf) = -1.000. The fixed-grid
 *   control on {1600,2400,3200,4000} fares better for N>=100 (p_T = 2.63, 2.48, 2.28; lam_inf 0.580535,
 *   0.580194, 0.580148, monotone decreasing) but still fails at N=84 (clamp). So a stable N-scaled inner-T
 *   extrapolation admitting Richardson/Aitken was NOT achieved: the small sliding-window deficits are
 *   ill-conditioned for the log-linear power-law fit, and a convergence RATE for the outer N-sequence remains
 *   unextractable.
 *
 * VERDICT. The N-scaled inner-T grid CONFIRMS the imp-97439 coupled-T-truncation attribution: raising T with N
 *   removes the artifactual late-N rise entirely, leaving a fitter-free bracket that is monotone DECREASING in
 *   N at every well-resolved T (Finding 1). This PARTIALLY resolves
 *   IMP97439_CSHARP_NBRACKET_RATE_NEEDS_N_UNIFORM_INNER_T_LIMIT -- the artifact half is settled. The RATE half
 *   is NOT: the T->inf extrapolation stays numerically unstable on the sliding windows (Finding 2), so
 *   Richardson/Aitken still return no reliable limit or rate. The best directly-read resolved bracket is
 *   c_sharp <= 0.579022 at (N=132, T=6400), still slowly decreasing, so the plateau reading is if anything a
 *   touch lower than the imp-97439 0.581687 +/- 0.000590 but stays an UPPER bracket <~0.581. Residual sub-gap
 *   IMP97456_CSHARP_NRATE_NEEDS_WELL_CONDITIONED_TINF_FIT: extract the outer N-rate from the raw
 *   monotone-decreasing resolved brackets by a method robust to the small sliding-window deficits (more
 *   T-decades, or a fit not railed by the log-linear power-law search). Measurement only; no operator
 *   positivity; no lower bound; no bound moves; interval-rigorous reach stays 2a<=0.96; RH open; NO QED.
 *
 * @see imp-97439-krein-csharp-nbracket-richardson-nonconvergence.js (the FINDING-3 artifact attribution + sub-gap this leaf tests)
 * @see imp-97183-csharp-extprec-ladder.py (extended-precision Rayleigh-Ritz ladder reused for exact entries)
 * @see imp-97206-krein-csharp-coupled-nt-jointlimit.js (coupled N,T joint limit ~0.582; inner T->inf Stage 1)
 * @see imp-97350-krein-csharp-lower-bound-routes-shared-obstruction.js (why the upper bracket does not give a lower bound)
 */

const LN3 = Math.log(3); // 1.0986122886681098 -- the binding 2a for the Krein / c_sharp floor
export const IMP97456_BINDING_2A = LN3;
export const IMP97456_RIGOROUS_REACH_2A = 0.96; // unchanged by this measurement

export const IMP97456_BUILD = Object.freeze({
  script: 'tmp/imp-97456-nscaled-Tgrid.py',
  dps: 50,
  Nmax: 132,
  panel: 1.5,
  gl: 24,
  checkpoints: Object.freeze([1600, 2400, 3200, 4000, 4800, 5600, 6400]),
  buildSeconds: 712,
});

// The raw lam_min(N,T) table (fitter-free). Keyed "N,T"; values are Rayleigh-Ritz UPPER brackets.
export const IMP97456_LAM_TABLE = Object.freeze({
  '84,1600': 0.575381, '84,2400': 0.579247, '84,3200': 0.580315, '84,4000': 0.580724, '84,4800': 0.580915, '84,5600': 0.581016, '84,6400': 0.581074,
  '100,1600': 0.570766, '100,2400': 0.577134, '100,3200': 0.578954, '100,4000': 0.579658, '100,4800': 0.579986, '100,5600': 0.580160, '100,6400': 0.580261,
  '116,1600': 0.565204, '116,2400': 0.574650, '116,3200': 0.577514, '116,4000': 0.578649, '116,4800': 0.579184, '116,5600': 0.579469, '116,6400': 0.579634,
  '132,1600': 0.558884, '132,2400': 0.571618, '132,3200': 0.575779, '132,4000': 0.577492, '132,4800': 0.578318, '132,5600': 0.578762, '132,6400': 0.579022,
});

// N-scaled sliding inner-T windows (center ~ 50*N).
export const IMP97456_WINDOWS = Object.freeze({
  84: Object.freeze([1600, 2400, 3200, 4000]),
  100: Object.freeze([2400, 3200, 4000, 4800]),
  116: Object.freeze([3200, 4000, 4800, 5600]),
  132: Object.freeze([4000, 4800, 5600, 6400]),
});

// Finding 1 -- the well-resolved columns are monotone DECREASING in N (drift-up removed / reversed).
export const IMP97456_RESOLVED_IS_MONOTONE_DECREASING_IN_N = Object.freeze({
  columnsChecked: Object.freeze([4000, 4800, 5600, 6400]),
  rowAtT6400: Object.freeze([0.581074, 0.580261, 0.579634, 0.579022]), // N=84,100,116,132
  firstDiffsAtT6400: Object.freeze([-0.000813, -0.000627, -0.000612]),
  monotoneDecreasingAtEveryResolvedT: true,
  confirmsImp97439Finding3CoupledTArtifact: true,
});

// Finding 2 -- the T->inf extrapolation fit is unstable on the sliding windows (no clean rate).
export const IMP97456_NSCALED_FIT = Object.freeze({
  pT: Object.freeze([0.057276, 0.040733, 2.723563, 0.032358]), // N=84,100,116,132
  lamInf: Object.freeze([0.680724, 0.679986, 0.580013, 0.679022]),
  railedToClampCount: 3, // N=84,100,132 hit Linf = lam_last + 0.10 (~0.68), a failed-fit signature
  interiorFitOnly: 116,
  corrPTvsLamInf: -1.0,
  allPTge2: false,
  stable: false,
});

// Fixed-grid control on {1600,2400,3200,4000} (same T-grid for all N).
export const IMP97456_FIXED_CONTROL = Object.freeze({
  grid: Object.freeze([1600, 2400, 3200, 4000]),
  pT: Object.freeze([0.057276, 2.631307, 2.483505, 2.275392]), // N=84 rails; N>=100 clean-ish
  lamInf: Object.freeze([0.680724, 0.580535, 0.580194, 0.580148]),
  monotoneDecreasingForNge100: true,
});

export const IMP97456_VERDICT = Object.freeze({
  ticket: 'imp-97456',
  question:
    'does re-running the c_sharp = lambda_min(P_a M_sigma2 P_a) upper bracket at 2a=ln3 on an N-SCALED inner T-grid (T-window sliding right with N so the inner T->inf limit stays N-uniform) remove the imp-97439 late-N drift-up and let the bracket sequence become monotone/flat with a Richardson/Aitken limit?',
  answer:
    'partially. The artifact half of the imp-97439 sub-gap is CONFIRMED and settled: on the well-resolved grid the drift-up is gone -- at every high checkpoint T (4000,4800,5600,6400) lam_min(N) is monotone DECREASING in N (at T=6400: 0.581074, 0.580261, 0.579634, 0.579022; first diffs -0.000813, -0.000627, -0.000612), the OPPOSITE of the fixed-grid rise imp-97439 saw at N=116,132, so that rise was indeed a coupled-T-truncation artifact. The RATE half is NOT resolved: the per-N T->inf power-law fit stays numerically unstable on the sliding windows (p_T=[0.06,0.04,2.72,0.03], three of four rail to the search-clamp Linf~0.68, only N=116 interior), so Richardson/Aitken still return no reliable outer-N limit or rate. Best directly-read resolved bracket c_sharp <= 0.579022 at (N=132,T=6400), still slowly decreasing; stays an UPPER bracket <~0.581, no positive lower bound.',
  binding_2a: LN3,
  // Finding 1
  driftUpRemovedByNScaledGrid: true,
  resolvedBracketMonotoneDecreasingInN: true,
  confirmsImp97439CoupledTArtifact: true,
  // Finding 2
  tinfFitStableOnSlidingWindows: false,
  outerNRateMeasured: false,
  // measurable output
  bestResolvedUpperBracket: 0.579022,
  bestResolvedAt: 'N=132, T=6400',
  isUpperBracketOnLambda1: true,
  positiveLowerBoundProduced: false,
  // program state unchanged
  operatorPositivityProved: false,
  boundMoves: false,
  intervalRigorousReachUnchanged: 0.96,
  resolvesImp97439SubGap: 'PARTIAL -- artifact half settled, rate half open',
  subGap:
    'IMP97456_CSHARP_NRATE_NEEDS_WELL_CONDITIONED_TINF_FIT -- the N-scaled T-grid confirms the imp-97439 ' +
    'FINDING-3 coupled-T-truncation artifact (the late-N rise disappears and the well-resolved bracket is ' +
    'monotone DECREASING in N at every high T), but a convergence RATE for the outer N-sequence still cannot ' +
    'be extracted: the per-N deficit fit lam(N,T)=Linf-C*T^-p_T is ill-conditioned on the small sliding ' +
    'windows (p_T=[0.06,0.04,2.72,0.03], three of four rail to the log-linear search clamp Linf~0.68). To ' +
    'decide the N-rate, fit the raw monotone-decreasing resolved brackets with a method robust to the small ' +
    'sliding-window deficits (more T-decades per window, or a fit not railed by the log-linear power-law ' +
    'search). Measurement only; lam_min(N,.) stay UPPER brackets; no positive lower bound; no operator ' +
    'positivity; no bound moves; interval-rigorous reach stays 2a<=0.96.',
  qed: false,
});
export default IMP97456_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97456_ASSERTIONS = [
  {
    id: 'imp97456-resolved-columns-monotone-decreasing-in-N',
    holds: () => {
      const Ns = [84, 100, 116, 132];
      for (const T of [4000, 4800, 5600, 6400]) {
        const row = Ns.map((N) => IMP97456_LAM_TABLE[`${N},${T}`]);
        for (let i = 1; i < row.length; i++) {
          if (!(row[i] < row[i - 1])) return false;
        }
      }
      return (
        IMP97456_RESOLVED_IS_MONOTONE_DECREASING_IN_N.monotoneDecreasingAtEveryResolvedT === true &&
        IMP97456_VERDICT.resolvedBracketMonotoneDecreasingInN === true
      );
    },
    why: 'on the N-scaled/high-resolution grid the bracket lam_min(N) is monotone DECREASING in N at every well-resolved T (4000..6400), removing the imp-97439 late-N drift-up -- the opposite of the fixed-grid rise.',
  },
  {
    id: 'imp97456-columns-increase-with-T',
    holds: () => {
      const Ts = IMP97456_BUILD.checkpoints;
      for (const N of [84, 100, 116, 132]) {
        for (let i = 1; i < Ts.length; i++) {
          if (!(IMP97456_LAM_TABLE[`${N},${Ts[i]}`] > IMP97456_LAM_TABLE[`${N},${Ts[i - 1]}`])) return false;
        }
      }
      return true;
    },
    why: 'each fixed-N column is monotone INCREASING in T -- cumulative-T quadrature resolves the inner limit from below, as expected for a well-posed Rayleigh-Ritz bracket.',
  },
  {
    id: 'imp97456-tinf-fit-unstable-no-rate',
    holds: () =>
      IMP97456_NSCALED_FIT.stable === false &&
      IMP97456_NSCALED_FIT.railedToClampCount === 3 &&
      IMP97456_NSCALED_FIT.allPTge2 === false &&
      IMP97456_VERDICT.tinfFitStableOnSlidingWindows === false &&
      IMP97456_VERDICT.outerNRateMeasured === false,
    why: 'the per-N T->inf power-law fit rails to the search clamp on three of four sliding windows (only N=116 interior), so no reliable Richardson/Aitken limit or outer-N convergence rate is extractable.',
  },
  {
    id: 'imp97456-confirms-imp97439-coupled-t-artifact',
    holds: () =>
      IMP97456_RESOLVED_IS_MONOTONE_DECREASING_IN_N.confirmsImp97439Finding3CoupledTArtifact === true &&
      IMP97456_VERDICT.confirmsImp97439CoupledTArtifact === true &&
      IMP97456_VERDICT.driftUpRemovedByNScaledGrid === true &&
      typeof IMP97456_VERDICT.resolvesImp97439SubGap === 'string' &&
      IMP97456_VERDICT.resolvesImp97439SubGap.startsWith('PARTIAL'),
    why: 'raising T with N removes the imp-97439 late-N rise entirely, confirming its FINDING-3 coupled-T-truncation attribution and partially resolving the sub-gap (artifact half settled, rate half open).',
  },
  {
    id: 'imp97456-measurement-only-no-qed',
    holds: () =>
      IMP97456_VERDICT.positiveLowerBoundProduced === false &&
      IMP97456_VERDICT.isUpperBracketOnLambda1 === true &&
      IMP97456_VERDICT.bestResolvedUpperBracket < 0.581 &&
      IMP97456_VERDICT.operatorPositivityProved === false &&
      IMP97456_VERDICT.boundMoves === false &&
      IMP97456_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97456_RIGOROUS_REACH_2A === 0.96 &&
      Math.abs(IMP97456_BINDING_2A - LN3) < 1e-12 &&
      typeof IMP97456_VERDICT.subGap === 'string' &&
      IMP97456_VERDICT.subGap.includes('IMP97456_CSHARP_NRATE_NEEDS_WELL_CONDITIONED_TINF_FIT') &&
      IMP97456_VERDICT.qed === false,
    why: 'measurement only: lam_min(N,.) are Rayleigh-Ritz UPPER brackets; no positive lower bound, no operator positivity; no bound moves; interval-rigorous reach stays 2a<=0.96; NO QED.',
  },
];

for (const a of IMP97456_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97456-krein-csharp-nscaled-tgrid assertion FAILED: ${a.id} -- ${a.why}`);
  }
}
