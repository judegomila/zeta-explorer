/**
 * @module imp-96974-bessel-onset-crossover-viz-data
 * @fileoverview imp-96974 -- MEASUREMENT: extend the imp-96957 Bessel onset-mass vs measured
 *   tail-residual finer ladder from N in {88,100,112,124} to N in {136,148,160} at 2a=ln3, and
 *   DECIDE whether the imp-96957-projected N~153 crossover -- where the sigma_2-weighted measured
 *   tail fraction OVERTAKES the literal uniform-j_k^2 onset fraction (onsetGapRatio crosses 1) --
 *   actually occurs, or whether the collapsing over-prediction ratio flattens first.
 *
 * CONTEXT. imp-96957 tabulated, per N in {88,100,112,124} at 2a=ln3, the literal-onset
 * over-prediction ratio onsetGapRatio = onsetFracUnweighted / weightedTailFrac and found it
 * COLLAPSES 9.63 -> 6.55 -> 4.26 -> 2.74 as N grows (the measured sigma_2-weighted tail fraction
 * grows super-linearly while the literal (2k+1)/(pi*T) onset fraction grows only linearly). A
 * log-linear extrapolation of the collapsing ratio PROJECTED a crossover near N~153 -- past the
 * 2a<=0.96 interval-verified reach and UNVERIFIED. This leaf directly measures the three finer rungs
 * that bracket that projection and decides whether the crossover is real.
 *
 * METHOD (driver tmp/imp-96974-bessel-onset-crossover.py, ~51s, reuses the imp-96934 / imp-96957 /
 * imp-96768 orthogonal Gegenbauer build VERBATIM: sigma_2=(t^2+1/4)^2 w_1, pole-free m=3 trial
 * space, normalised C_n^{13/2}). At 2a=ln3, per N in {136,148,160}: minimiser phi of A on [0,3200];
 * weightedTailFrac = phi^T A_tail phi / phi^T A_full phi over t in [3200,12800]; onsetFracUnweighted
 * = (2k+1)/(pi*T3200) with k_max = 2m+N-1; onsetGapRatio = onsetFracUnweighted / weightedTailFrac.
 * The split check lam_min(A_lo + A_tail) reproduces the direct A_full T=12800 floor to <=7e-5 at
 * every rung. The Rayleigh floor is an UPPER bound on the true infinite-dim lam_min; NO operator
 * positivity; interval-rigorous certificate reach stays 2a<=0.96; RH open; NO QED.
 *
 * FINDINGS (measured).
 *   1. THE CROSSOVER IS REAL. The measured onsetGapRatio crosses 1 between N=136 (gap=1.6253) and
 *      N=148 (gap=0.9107): the sigma_2-weighted tail fraction OVERTAKES the literal uniform-j_k^2
 *      onset fraction, exactly the flip imp-96957 projected. The first measured rung with gap<1 is
 *      N=148 (weightedTailFrac 0.03353 > onsetFracUnweighted 0.03054).
 *   2. IT OCCURS SLIGHTLY EARLIER THAN PROJECTED, BECAUSE THE RATIO DECAYS FASTER THAN LOG-LINEAR.
 *      A joined log-linear fit over all seven rungs {88..160} gives N_cross = 145.3, EARLIER than
 *      the imp-96957 four-rung projection N_cross = 153.1: the collapsing over-prediction ratio does
 *      NOT flatten first -- it keeps collapsing (2.74 -> 1.63 -> 0.91 -> 0.46), even accelerating, so
 *      the log-linear extrapolation from the coarser ladder slightly UNDER-shot the collapse rate.
 *   3. BEYOND CROSSOVER THE WEIGHTED TAIL DOMINATES. At N=160 the gap is 0.4644 (weightedTailFrac
 *      0.07090 vs onsetFracUnweighted 0.03293): the sigma_2-weighted tail fraction is now >2x the
 *      literal onset fraction, so the bare uniform-j_k^2 onset model UNDER-predicts by the same order
 *      it over-predicted at small N. The onsets themselves stay far below the cutoff (t_onset/T3200 =
 *      0.080 -> 0.094, still 11-12x below T=3200), so the crossover is driven by the weighted tail
 *      mass, not by the onset crossing the cutoff.
 *
 * VERDICT. The imp-96957 projected N~153 crossover IS confirmed to occur -- the measured
 * onsetFracUnweighted/weightedTailFrac ratio crosses 1 between N=136 and N=148 (joined-fit N_cross =
 * 145.3), a bit earlier than the four-rung log-linear projection N=153.1 because the ratio collapse
 * accelerates rather than flattens. The literal uniform-j_k^2 onset model, an over-predictor at small
 * N, becomes an UNDER-predictor past N~145; the underlying sub-gap is unchanged
 * (imp-96957-sigma2-weighted-tail-superlinear-unmodelled: the super-linear weighted-tail growth is
 * not captured by the bare Bessel onset). All rungs sit at 2a=ln3, PAST the 2a<=0.96 interval-verified
 * reach and UNVERIFIED for positivity; the Rayleigh floor is a numerical UPPER bound; no operator
 * positivity is established; no refereed bound is changed; changes no bound; RH open; NO QED.
 *
 * @see imp-96957-bessel-onset-tail-finer-ladder-viz-data.js (the {88..124} ladder + N~153 projection)
 * @see imp-96934-bessel-onset-tail-residual-viz-data.js (the original three-N onset/tail table)
 * @see imp-96928-krein-residual-vs-floor-uniform-N-extrap.js (the p~3.27 super-cubic residual growth)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the Gegenbauer build reused here)
 */

const LN3 = Math.log(3); // 1.0986122886681098
const A_LN3 = LN3 / 2; // 0.5493061443340549 (2a=ln3)
const M_POLE = 3; // pole-free trial-space order m; k_max = 2m + N - 1

export const IMP96974_NS = Object.freeze([136, 148, 160]);
export const IMP96974_T3200 = 3200;
export const IMP96974_TFULL = 12800;

// per-N measured row (2a=ln3), from tmp/imp-96974-bessel-onset-crossover.py
//   kmax = 2m+N-1; tOnset = kmax/a; residMeasured = floor(T=12800) - floor(T=3200); weightedTailFrac
//   = phi^T A_tail phi / phi^T A_full phi; onsetFracUnweighted = (2*kmax+1)/(pi*T3200); onsetGapRatio
//   = onsetFracUnweighted / weightedTailFrac (literal-onset over/under-prediction factor; <1 = onset
//   fraction now UNDER-predicts the sigma_2-weighted tail fraction).
export const IMP96974_ROWS = Object.freeze({
  136: Object.freeze({
    kmax: 141, tOnset: 256.6875, tOnsetOverT3200: 0.080215,
    residMeasured: 0.0041354, residFirstOrder: 0.0101415,
    weightedTailFrac: 0.0173207, onsetFracUnweighted: 0.0281505, onsetGapRatio: 1.6253,
  }),
  148: Object.freeze({
    kmax: 153, tOnset: 278.5332, tOnsetOverT3200: 0.087042,
    residMeasured: 0.0052718, residFirstOrder: 0.0199155,
    weightedTailFrac: 0.0335326, onsetFracUnweighted: 0.0305379, onsetGapRatio: 0.9107,
  }),
  160: Object.freeze({
    kmax: 165, tOnset: 300.3789, tOnsetOverT3200: 0.093868,
    residMeasured: 0.0064152, residFirstOrder: 0.0436825,
    weightedTailFrac: 0.0708992, onsetFracUnweighted: 0.0329252, onsetGapRatio: 0.4644,
  }),
});

// joined onsetGapRatio ladder (imp-96957 rungs {88..124} + this leaf {136,148,160}); strictly
// collapsing and accelerating, crossing 1 between N=136 and N=148.
export const IMP96974_JOINED_GAP_LADDER = Object.freeze({
  88: 9.6319, 100: 6.5468, 112: 4.2630, 124: 2.7363, 136: 1.6253, 148: 0.9107, 160: 0.4644,
});

// log-linear ln(gap) = c + s*N fits: joined seven-rung fit lands the crossover EARLIER than the
// imp-96957 four-rung projection, because the collapse accelerates (does not flatten).
export const IMP96974_CROSSOVER_ALL_RUNGS_N = 145.34; // fit over {88,100,112,124,136,148,160}
export const IMP96974_CROSSOVER_PRIOR_ONLY_N = 153.10; // imp-96957 four-rung projection reproduced
export const IMP96974_FIRST_MEASURED_CROSSING_N = 148; // first rung with onsetGapRatio < 1

export const IMP96974_VERDICT = Object.freeze({
  ticket: 'imp-96974',
  question:
    'extend the imp-96957 Bessel onset-mass vs measured tail-residual finer ladder to N in {136,148,160} at 2a=ln3 and decide whether the projected N~153 crossover (sigma_2-weighted tail fraction overtakes the literal uniform-onset fraction, onsetGapRatio crosses 1) actually occurs or whether the collapsing over-prediction ratio flattens first',
  answer:
    'the crossover IS real: the measured onsetGapRatio crosses 1 between N=136 (1.6253) and N=148 (0.9107), so the sigma_2-weighted tail fraction overtakes the literal uniform-j_k^2 onset fraction; it occurs slightly EARLIER than the imp-96957 four-rung projection (joined seven-rung log-linear fit N_cross=145.3 vs prior-only 153.1) because the collapsing ratio does NOT flatten -- it keeps collapsing (2.74->1.63->0.91->0.46) and even accelerates; past N~145 the bare onset model flips from over- to under-predicting, and by N=160 the weighted tail fraction is >2x the onset fraction (gap 0.4644)',
  crossoverOccurs: true, // onsetGapRatio crosses 1 between N=136 and N=148
  ratioFlattensFirst: false, // the collapse accelerates rather than flattens
  crossoverEarlierThanProjected: true, // joined fit 145.3 < imp-96957 projection 153.1
  onsetsStayFarBelowCutoff: true, // tOnset/T3200 = 0.080-0.094, still 11-12x below T=3200
  onsetModelUnderpredictsPastCrossover: true, // gap<1 at N=148,160 (onset fraction under-predicts)
  subGap: 'imp-96957-sigma2-weighted-tail-superlinear-unmodelled',
  crossoverAllRungsN: 145.34,
  crossoverPriorOnlyN: 153.10,
  firstMeasuredCrossingN: 148,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96974_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96974_ASSERTIONS = [
  {
    id: 'imp96974-tonset-equals-kmax-over-a',
    holds: () =>
      IMP96974_NS.every((N) => {
        const r = IMP96974_ROWS[N];
        return (
          r.kmax === 2 * M_POLE + N - 1 &&
          Math.abs(r.tOnset - r.kmax / A_LN3) < 1e-2 &&
          Math.abs(r.tOnsetOverT3200 - r.tOnset / IMP96974_T3200) < 1e-4
        );
      }),
    why: 'the tabulated onset is exactly t_onset = k_max/a with k_max = 2m+N-1 at every finer-finer rung, the object imp-96917/imp-96934/imp-96957 named for the residual.',
  },
  {
    id: 'imp96974-onsets-far-below-cutoff-and-creeping-up',
    holds: () => {
      let prev = 0.073; // continues above the imp-96957 top rung (N=124 -> 0.0734)
      return IMP96974_NS.every((N) => {
        const f = IMP96974_ROWS[N].tOnsetOverT3200;
        const ok = f > 0.073 && f < 0.1 && f > prev; // 11-12x below T=3200, monotone creeping up
        prev = f;
        return ok;
      });
    },
    why: 'every onset sits at 8.0-9.4% of T=3200 (11-12x below the cutoff) and creeps monotonically upward with N, so the crossover is driven by the weighted tail mass, not by the onset crossing the cutoff.',
  },
  {
    id: 'imp96974-gap-collapses-through-one',
    holds: () => {
      let prev = 2.7363; // continues below the imp-96957 top rung (N=124 -> 2.7363)
      let crossed = false;
      IMP96974_NS.forEach((N) => {
        const g = IMP96974_ROWS[N].onsetGapRatio;
        if (g >= prev) throw new Error('gap not strictly decreasing');
        if (g < 1) crossed = true;
        prev = g;
      });
      return crossed && IMP96974_ROWS[136].onsetGapRatio > 1 && IMP96974_ROWS[148].onsetGapRatio < 1;
    },
    why: 'the onsetGapRatio collapses strictly 2.74 -> 1.63 -> 0.91 -> 0.46 and crosses 1 between N=136 (>1) and N=148 (<1), the real crossover imp-96957 projected.',
  },
  {
    id: 'imp96974-crossover-earlier-than-projected',
    holds: () =>
      IMP96974_CROSSOVER_ALL_RUNGS_N > 140 &&
      IMP96974_CROSSOVER_ALL_RUNGS_N < IMP96974_CROSSOVER_PRIOR_ONLY_N &&
      Math.abs(IMP96974_CROSSOVER_PRIOR_ONLY_N - 153) < 1 &&
      IMP96974_FIRST_MEASURED_CROSSING_N === 148,
    why: 'the joined seven-rung log-linear fit lands the crossover at N=145.3, earlier than the imp-96957 four-rung projection N=153.1 (reproduced here), because the collapsing ratio accelerates rather than flattens; the first measured rung with gap<1 is N=148.',
  },
  {
    id: 'imp96974-weighted-tail-overtakes-onset-fraction',
    holds: () =>
      IMP96974_ROWS[148].weightedTailFrac > IMP96974_ROWS[148].onsetFracUnweighted &&
      IMP96974_ROWS[160].weightedTailFrac > 2 * IMP96974_ROWS[160].onsetFracUnweighted,
    why: 'past the crossover the sigma_2-weighted tail fraction overtakes the literal uniform-j_k^2 onset fraction (>2x at N=160), so the bare onset model flips from over- to under-predicting.',
  },
  {
    id: 'imp96974-residual-grows-monotonically-with-N',
    holds: () => {
      let prev = 0.0029994; // continues above the imp-96957 top rung (N=124)
      return IMP96974_NS.every((N) => {
        const r = IMP96974_ROWS[N].residMeasured;
        const ok = r > prev;
        prev = r;
        return ok;
      });
    },
    why: 'the measured floor lift beyond T=3200 keeps growing monotonically 0.0041354 -> 0.0064152 across {136,148,160}, continuing the imp-96957 ladder.',
  },
  {
    id: 'imp96974-measurement-only-no-qed',
    holds: () =>
      IMP96974_VERDICT.crossoverOccurs === true &&
      IMP96974_VERDICT.ratioFlattensFirst === false &&
      IMP96974_VERDICT.crossoverEarlierThanProjected === true &&
      IMP96974_VERDICT.operatorPositivityProved === false &&
      IMP96974_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96974_VERDICT.qed === false,
    why: 'measurement only: the crossover occurs (earlier than projected, ratio does not flatten), but no operator positivity is established, the certificate reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96974_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96974-bessel-onset-crossover-viz-data assertion failed: ${a.id}`);
  }
}

void LN3;
