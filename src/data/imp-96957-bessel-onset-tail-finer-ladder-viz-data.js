/**
 * @module imp-96957-bessel-onset-tail-finer-ladder-viz-data
 * @fileoverview imp-96957 -- MEASUREMENT: extend the imp-96934 Bessel onset-mass vs measured
 *   tail-residual tabulation from the three-N grid {76,100,124} to the imp-96768 tail rungs
 *   N in {88,100,112,124} at 2a=ln3, and decide (i) whether the measured super-cubic per-N growth
 *   (imp-96928 power law p~3.27) continues to hold on the finer ladder and (ii) whether the k/a
 *   onset gap keeps widening.
 *
 * CONTEXT. imp-96934 tabulated, per N in {76,100,124}, the spherical-Bessel onset t_onset=(2m+N-1)/a
 * against the sigma_2-weighted Krein-floor residual beyond T=3200, and found the residual IS
 * sigma_2-weighted Bessel mass beyond T=3200 (first-order Rayleigh tail residual reproduces the
 * measured floor lift in sign and order) but that the literal uniform-j_k^2 (2k+1)/(pi*T) onset-mass
 * model both over-predicts the absolute fraction and under-predicts the super-linear N-growth. That
 * table had only three rungs; the imp-96768 build reaches the finer tail ladder {88,100,112,124}.
 * This leaf fills the two intermediate rungs {88,112} and re-tests the growth law and the onset gap.
 *
 * METHOD (driver tmp/imp-96957-bessel-onset-tail-finer.py, ~70s, reuses the imp-96934 / imp-96768
 * orthogonal Gegenbauer build VERBATIM: sigma_2=(t^2+1/4)^2 w_1, pole-free m=3 trial space,
 * normalised C_n^{13/2}). At 2a=ln3, per N in {88,100,112,124}:
 *   (a) t_onset = (2m+N-1)/a, k_max = 2m+N-1.
 *   (b) FIRST-ORDER (Rayleigh) tail residual: minimiser phi of A on [0,3200]; residFirstOrder =
 *       phi^T A_tail phi / scaleB over t in [3200,12800] (the sigma_2-weighted Bessel mass beyond
 *       T=3200). The split check lam_min(A_lo + A_tail) reproduces the direct A_full T=12800 floor
 *       to <=3e-6 at every rung.
 *   (c) residMeasured = floor(T=12800) - floor(T=3200); at the two overlapping rungs it reproduces
 *       the imp-96934 baked residuals EXACTLY (100 -> 0.0014900, 124 -> 0.0029994).
 *   (d) weightedTailFrac = phi^T A_tail phi / phi^T A_full phi; onsetFracUnweighted =
 *       (2k+1)/(pi*T3200) (literal uniform-j_k^2 onset-mass prediction); onsetGapRatio =
 *       onsetFracUnweighted / weightedTailFrac (how far the literal onset over-predicts).
 * The Rayleigh floor is an UPPER bound on the true infinite-dim lam_min; NO operator positivity;
 * RH open; NO QED.
 *
 * FINDINGS (measured).
 *   1. THE SUPER-CUBIC GROWTH CONTINUES ON THE FINER LADDER. The measured floor lift grows
 *      0.0009976 -> 0.0014900 -> 0.0021885 -> 0.0029994 across {88,100,112,124}; a log-log OLS fit
 *      gives p_global=3.228, squarely on the imp-96928 p~3.27 power law, and the per-step local
 *      exponents are 3.14 / 3.39 / 3.10 -- no roll-off, no sign of the growth flattening toward the
 *      2a=0.96 endpoint of the interval-verified reach.
 *   2. THE ONSETS KEEP CREEPING TOWARD THE CUTOFF BUT STAY FAR BELOW IT. t_onset/T3200 rises
 *      monotonically 0.0529 -> 0.0597 -> 0.0666 -> 0.0734, so every rung is still 14-19x below
 *      T=3200; the residual remains the far oscillatory j_k tail, never the onset crossing the cutoff.
 *   3. THE k/a ONSET GAP DOES NOT KEEP WIDENING -- IT NARROWS. The literal-onset over-prediction
 *      ratio onsetFracUnweighted/weightedTailFrac COLLAPSES 9.63 -> 6.55 -> 4.26 -> 2.74 as N grows,
 *      because the measured sigma_2-weighted tail fraction grows super-linearly (0.00193 -> 0.00942,
 *      x4.9) while the literal onset fraction grows only linearly (0.0186 -> 0.0258, x1.4). A
 *      log-linear extrapolation of the collapsing ratio projects a crossover near N~153 (the measured
 *      weighted tail fraction would OVERTAKE the linear onset fraction there) -- past the 2a<=0.96
 *      interval-verified reach and UNVERIFIED. So the literal onset model flips from over-predicting
 *      (small N) toward under-predicting (large N); the N-growth mismatch (measured x~1.4-1.5 per step
 *      vs onset-linear x~1.1) persists throughout.
 *
 * VERDICT. On the finer {88,100,112,124} ladder the imp-96928 super-cubic residual growth holds
 * (p_global=3.228; local exponents 3.10-3.39, no roll-off), CONFIRMING the finding was not an
 * artifact of the coarse three-N grid. The k/a onset gap does NOT keep widening: the literal
 * uniform-j_k^2 over-prediction NARROWS from 9.6x to 2.7x and is projected to cross over near N~153,
 * so the bare onset model is a poor absolute predictor in BOTH directions (over then under). The
 * open item is unchanged: SUB-GAP imp-96957-sigma2-weighted-tail-superlinear-unmodelled -- the
 * super-cubic component must fold in the sigma_2 ~ t^4 tail weighting and the minimiser's growing
 * high-k coefficient amplitudes, not just the bare Bessel onset. Measurement only; the floor is a
 * Rayleigh UPPER bound; no operator positivity; interval-rigorous certificate reach stays 2a<=0.96;
 * no refereed bound is changed; RH open; NO QED.
 *
 * @see imp-96934-bessel-onset-tail-residual-viz-data.js (the three-N table this extends)
 * @see imp-96928-krein-residual-vs-floor-uniform-N-extrap.js (the p~3.27 super-cubic residual growth)
 * @see imp-96768-gegenbauer-krein-lammin-recompute.js (the tail rungs {88,100,112,124} reused here)
 */

const LN3 = Math.log(3); // 1.0986122886681098
const A_LN3 = LN3 / 2; // 0.5493061443340549 (2a=ln3)
const M_POLE = 3; // pole-free trial-space order m; k_max = 2m + N - 1

export const IMP96957_NS = Object.freeze([88, 100, 112, 124]);
export const IMP96957_T3200 = 3200;
export const IMP96957_TFULL = 12800;

// per-N measured row (2a=ln3), from tmp/imp-96957-bessel-onset-tail-finer.py
//   kmax = 2m+N-1; tOnset = kmax/a; residFirstOrder = phi^T A_tail phi / scaleB (sigma_2-weighted
//   Bessel mass beyond T=3200); residMeasured = floor(T=12800) - floor(T=3200); weightedTailFrac =
//   phi^T A_tail phi / phi^T A_full phi; onsetFracUnweighted = (2*kmax+1)/(pi*T3200); onsetGapRatio =
//   onsetFracUnweighted / weightedTailFrac (literal-onset over-prediction factor).
export const IMP96957_ROWS = Object.freeze({
  88: Object.freeze({
    kmax: 93, tOnset: 169.304, tOnsetOverT3200: 0.052908,
    residMeasured: 0.0009976, residFirstOrder: 0.0011223,
    weightedTailFrac: 0.0019312, onsetFracUnweighted: 0.0186012, onsetGapRatio: 9.6319,
  }),
  100: Object.freeze({
    kmax: 105, tOnset: 191.150, tOnsetOverT3200: 0.059734,
    residMeasured: 0.0014900, residFirstOrder: 0.0018621,
    weightedTailFrac: 0.0032059, onsetFracUnweighted: 0.0209886, onsetGapRatio: 6.5468,
  }),
  112: Object.freeze({
    kmax: 117, tOnset: 212.996, tOnsetOverT3200: 0.066561,
    residMeasured: 0.0021885, residFirstOrder: 0.0031859,
    weightedTailFrac: 0.0054835, onsetFracUnweighted: 0.0233759, onsetGapRatio: 4.2630,
  }),
  124: Object.freeze({
    kmax: 129, tOnset: 234.842, tOnsetOverT3200: 0.073388,
    residMeasured: 0.0029994, residFirstOrder: 0.0054813,
    weightedTailFrac: 0.0094153, onsetFracUnweighted: 0.0257632, onsetGapRatio: 2.7363,
  }),
});

// per-step N-growth: measured floor lift vs the LINEAR-in-kmax onset prediction; pLocal is the local
// power-law exponent p = ln(ratioMeasured) / ln(Nb/Na).
export const IMP96957_GROWTH = Object.freeze({
  '88->100': Object.freeze({ ratioMeasured: 1.494, ratioFirstOrder: 1.659, ratioOnsetLinear: 1.128, pLocal: 3.138 }),
  '100->112': Object.freeze({ ratioMeasured: 1.469, ratioFirstOrder: 1.711, ratioOnsetLinear: 1.114, pLocal: 3.393 }),
  '112->124': Object.freeze({ ratioMeasured: 1.371, ratioFirstOrder: 1.720, ratioOnsetLinear: 1.102, pLocal: 3.097 }),
});

// global log-log OLS power law of residMeasured vs N over {88,100,112,124} (imp-96928 predicts ~3.27)
export const IMP96957_P_GLOBAL = 3.228;
// log-linear extrapolation of the collapsing onsetGapRatio to 1 (EXTRAPOLATION, past 2a<=0.96 reach)
export const IMP96957_PROJECTED_ONSET_CROSSOVER_N = 153;

export const IMP96957_VERDICT = Object.freeze({
  ticket: 'imp-96957',
  question:
    'extend the imp-96934 Bessel onset-mass vs measured tail-residual tabulation to the imp-96768 tail rungs N in {88,100,112,124} and decide whether the measured super-cubic per-N growth (imp-96928 p~3.27) continues and whether the k/a onset gap keeps widening',
  answer:
    'the super-cubic growth continues on the finer ladder (log-log OLS p_global=3.228, local exponents 3.10-3.39, no roll-off) confirming it was not a coarse-grid artifact; but the k/a onset gap does NOT keep widening -- the literal uniform-j_k^2 over-prediction ratio NARROWS 9.63->6.55->4.26->2.74 because the measured sigma_2-weighted tail fraction grows super-linearly while the onset fraction grows only linearly, projecting a crossover near N~153 (unverified) where the bare onset model flips from over- to under-predicting; the per-step N-growth mismatch (measured x~1.4-1.5 vs onset-linear x~1.1) persists',
  superCubicGrowthContinues: true, // p_global=3.228, local 3.10-3.39, consistent with imp-96928 p~3.27
  onsetGapKeepsWidening: false, // over-prediction ratio COLLAPSES 9.63 -> 2.74 as N grows
  onsetsStayFarBelowCutoff: true, // tOnset/T3200 = 0.053-0.073, still 14-19x below T=3200
  firstOrderTailResidualTracksMeasured: true, // residFirstOrder within [0.5,2]x residMeasured at every rung
  reproducesImp96934: true, // residMeasured at N=100/124 equals the imp-96934 baked values exactly
  subGap: 'imp-96957-sigma2-weighted-tail-superlinear-unmodelled',
  pGlobalMeasured: 3.228,
  projectedOnsetCrossoverN: 153,
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96957_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96957_ASSERTIONS = [
  {
    id: 'imp96957-tonset-equals-kmax-over-a',
    holds: () =>
      IMP96957_NS.every((N) => {
        const r = IMP96957_ROWS[N];
        return (
          r.kmax === 2 * M_POLE + N - 1 &&
          Math.abs(r.tOnset - r.kmax / A_LN3) < 1e-2 &&
          Math.abs(r.tOnsetOverT3200 - r.tOnset / IMP96957_T3200) < 1e-4
        );
      }),
    why: 'the tabulated onset is exactly t_onset = k_max/a with k_max = 2m+N-1 at every rung of the finer ladder, the object imp-96917/imp-96934 named for the residual.',
  },
  {
    id: 'imp96957-onsets-far-below-cutoff-and-creeping-up',
    holds: () => {
      let prev = -1;
      return IMP96957_NS.every((N) => {
        const f = IMP96957_ROWS[N].tOnsetOverT3200;
        const ok = f > 0.03 && f < 0.1 && f > prev; // 14-19x below T=3200, monotone creeping up
        prev = f;
        return ok;
      });
    },
    why: 'every onset sits at 5.3-7.3% of T=3200 (14-19x below the cutoff) and creeps monotonically toward it with N, so the residual beyond T=3200 stays the far oscillatory j_k tail, never the onset crossing.',
  },
  {
    id: 'imp96957-residual-grows-monotonically-with-N',
    holds: () => {
      let prev = -1;
      return IMP96957_NS.every((N) => {
        const r = IMP96957_ROWS[N].residMeasured;
        const ok = r > prev;
        prev = r;
        return ok;
      });
    },
    why: 'the measured floor lift beyond T=3200 grows monotonically 0.0009976 -> 0.0029994 across {88,100,112,124}, the growth this leaf tests for super-cubicity.',
  },
  {
    id: 'imp96957-super-cubic-growth-continues',
    holds: () =>
      IMP96957_P_GLOBAL > 3.0 && IMP96957_P_GLOBAL < 3.4 &&
      Object.values(IMP96957_GROWTH).every((g) => g.pLocal > 2.9 && g.pLocal < 3.5),
    why: 'the global log-log OLS exponent p_global=3.228 lands on the imp-96928 p~3.27 super-cubic law and every per-step local exponent stays in 3.10-3.39 (no roll-off), so the super-cubic growth is not a coarse-grid artifact.',
  },
  {
    id: 'imp96957-firstorder-tail-residual-tracks-measured',
    holds: () =>
      IMP96957_NS.every((N) => {
        const r = IMP96957_ROWS[N];
        return r.residFirstOrder > 0.5 * r.residMeasured && r.residFirstOrder < 2 * r.residMeasured;
      }),
    why: 'the first-order Rayleigh tail residual (sigma_2-weighted Bessel mass beyond T=3200) reproduces the measured floor lift in sign and order at every finer rung, so the residual object is the same as in imp-96934.',
  },
  {
    id: 'imp96957-onset-gap-narrows-not-widens',
    holds: () => {
      let prev = Infinity;
      return IMP96957_NS.every((N) => {
        const g = IMP96957_ROWS[N].onsetGapRatio;
        const ok = g > 1 && g < prev; // strictly decreasing (narrowing), still >1 across the reach
        prev = g;
        return ok;
      });
    },
    why: 'the literal-onset over-prediction ratio onsetFracUnweighted/weightedTailFrac collapses strictly 9.63 -> 2.74 as N grows, so the k/a onset gap NARROWS rather than widens -- the measured weighted tail fraction grows super-linearly while the onset fraction grows only linearly.',
  },
  {
    id: 'imp96957-reproduces-imp96934-baked-residuals',
    holds: () =>
      IMP96957_ROWS[100].residMeasured === 0.0014900 &&
      IMP96957_ROWS[124].residMeasured === 0.0029994,
    why: 'at the two overlapping rungs the measured floor lift reproduces the imp-96934 baked residuals exactly (same subspace and operator), so the finer-ladder extension is apples-to-apples with the three-N table.',
  },
  {
    id: 'imp96957-measurement-only-no-qed',
    holds: () =>
      IMP96957_VERDICT.superCubicGrowthContinues === true &&
      IMP96957_VERDICT.onsetGapKeepsWidening === false &&
      IMP96957_VERDICT.firstOrderTailResidualTracksMeasured === true &&
      IMP96957_VERDICT.operatorPositivityProved === false &&
      IMP96957_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP96957_VERDICT.qed === false,
    why: 'measurement only: the super-cubic growth continues and the onset gap narrows (does not widen), but no operator positivity is established, the certificate reach stays 2a<=0.96, and no QED is claimed.',
  },
];

for (const a of IMP96957_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-96957-bessel-onset-tail-finer-ladder-viz-data assertion failed: ${a.id}`);
  }
}

void LN3;
