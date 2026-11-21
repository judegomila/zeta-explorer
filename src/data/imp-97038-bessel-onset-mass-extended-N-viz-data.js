/**
 * @module imp-97038-bessel-onset-mass-extended-N-viz-data
 * @fileoverview imp-97038 -- MEASUREMENT: extend the imp-96934 spherical-Bessel onset-mass vs
 *   measured-tail-residual comparison at 2a=ln3 to N beyond the committed {76,100,124} rungs
 *   (here {148,172,196}) and decide whether the uniform-j_k^2 (2k+1)/(pi*T) onset-mass prediction
 *   tracks, over- or under-predicts the measured tail residual as N grows.
 *
 * CONTEXT. imp-96934 tabulated, per N in {76,100,124} at 2a=ln3, the Bessel onset mass t_onset=k/a
 * (k_max=2m+N-1), the measured floor lift beyond T=3200, the first-order (Rayleigh) tail residual,
 * and the literal uniform-j_k^2 onset-mass prediction (2k+1)/(pi*T). It found the model OVER-predicts
 * the absolute fraction (1.6-2.6% vs measured weighted 0.11-0.94%) and UNDER-predicts the N-growth
 * (x1.29/x1.23 vs measured x2.46/x2.01), leaving an unexplained super-linear component. This leaf
 * pushes the same comparison three rungs further to test the model past the committed reach.
 *
 * METHOD (driver tmp/imp-97038-bessel-onset-tail-extended.py, ~70s, reuses the imp-96934 build
 * verbatim: orthogonal Gegenbauer C_n^{13/2}, sigma_2=(t^2+1/4)^2 w_1, pole-free m=3; the driver
 * reproduces the imp-96934 baked floor lifts at {76,100,124} to all digits, so the extension is
 * apples-to-apples). Per N in {148,172,196} at 2a=ln3:
 *   (a) t_onset=k_max/a, k_max=2m+N-1.
 *   (b) residMeasured = lam_min(A on [0,12800]) - lam_min(A on [0,3200]) -- the DIRECT floor lift.
 *   (c) residFirstOrder = phi^T A_tail phi / scaleB with phi the [0,3200] minimiser (un-readjusted).
 *   (d) weightedTailFrac = phi^T A_tail phi / phi^T A_full phi.
 *   (e) onsetFracUnweighted = (2*k_max+1)/(pi*T3200) -- the literal uniform-j_k^2 prediction.
 *   (f) split check: lam_min(A_lo + A_tail) should equal lam_min(A_full) by construction.
 *
 * FINDINGS (measured).
 *   1. THE DIRECT FLOOR LIFT KEEPS GROWING BUT DECELERATES. residMeasured = 0.00527 / 0.00804 /
 *      0.01119 at N=148/172/196; the per-step growth ratio FALLS 2.457, 2.013 (committed) -> 1.758,
 *      1.526, 1.391 (extended), converging toward the onset-linear ratio (~1.13-1.19). So the
 *      measured/onset ratio-of-ratios drops 1.90 -> 1.64 -> 1.48 -> 1.32 -> 1.23: the onset model's
 *      linear-in-k N-growth, badly under-predicting at the committed rungs, is progressively
 *      APPROACHED (not diverged from) as N grows. The super-linear excess is fading, not compounding.
 *   2. THE ONSETS CROSS TOWARD (BUT STAY BELOW) T=3200. t_onset/T3200 = 0.087 / 0.101 / 0.114 at
 *      N=148/172/196 (vs 0.046-0.073 committed): still an order of magnitude below the cutoff, so
 *      the residual remains the far oscillatory j_k tail, never the onset crossing T=3200.
 *   3. THE FIRST-ORDER DECOMPOSITION BREAKS DOWN PAST N~148 -- the onset-fraction flip is an
 *      ARTIFACT. residFirstOrder over-predicts residMeasured by 3.8x / 12.9x / 72.5x (vs ~1.06-1.83x
 *      at the committed rungs), weightedTailFrac becomes unphysical (0.034 / 0.154 / 0.589 -- a
 *      first-order tail "fraction" above 1/2 for a minimiser whose mass sits near t=0), and the
 *      operator split-check |lam_split - lam_full| degrades from <=2e-6 (committed) to 1.2e-5 / 2.5e-4
 *      / 6.1e-4. So the apparent flip of onsetFracUnweighted from OVER-predicting weightedTailFrac
 *      (committed) to UNDER-predicting it (0.911x / 0.229x / 0.068x here) is NOT a physical crossover:
 *      it is the un-readjusted-minimiser first-order picture inflating without bound while the true
 *      (second-order) eigenvalue shift stays modest and decelerating.
 *
 * VERDICT. Extended three rungs, the ROBUST measurement (the direct floor lift) shows the onset
 * model's linear-in-k N-growth is progressively APPROACHED, not escaped -- the super-linear excess
 * decelerates (ratio-of-ratios 1.90 -> 1.23). The absolute-fraction comparison, which rests on the
 * first-order un-readjusted-minimiser tail residual, becomes numerically UNRELIABLE past N~148
 * (split-check degrades to 6e-4, weighted fraction unphysical), so the apparent over->under flip of
 * the onset fraction is an artifact, not a physical crossover. SUB-GAP
 * imp-97038-firstorder-tail-decomp-breaks-past-N148: a trustworthy absolute-fraction comparison past
 * N~148 needs a resolved tail (larger T, finer panels, or higher-precision assembly) so A_lo+A_tail
 * reproduces A_full to the residual scale. Measurement only; the floor is a Rayleigh UPPER bound; no
 * operator positivity; interval-rigorous certificate reach stays 2a <= 0.96; no refereed bound is changed
 * ; RH open; NO QED.
 *
 * @see imp-96934-bessel-onset-tail-residual-viz-data.js (the committed {76,100,124} comparison)
 * @see imp-96917-krein-tladder-plateau-viz-data.js (the beyond-T=3200 residual this decomposes)
 * @see imp-96928-krein-residual-vs-floor-uniform-N-extrap.js (the p~3.27 super-cubic residual growth)
 */

const LN3 = Math.log(3); // 1.0986122886681098
const A_LN3 = LN3 / 2; // 0.5493061443340549 (2a=ln3)
const M_POLE = 3; // pole-free trial-space order m; k_max = 2m + N - 1

export const IMP97038_NS = Object.freeze([148, 172, 196]);
export const IMP97038_T3200 = 3200;
export const IMP97038_TFULL = 12800;

// per-N measured row (2a=ln3), from tmp/imp-97038-bessel-onset-tail-extended.py
//   kmax=2m+N-1; tOnset=kmax/a; residMeasured=lam(12800)-lam(3200) (direct floor lift, ROBUST);
//   residFirstOrder=phi^T A_tail phi/scaleB (un-readjusted minimiser, first-order, UNRELIABLE at
//   high N); weightedTailFrac=phi^T A_tail phi/phi^T A_full phi; onsetFracUnweighted=(2k+1)/(pi*T);
//   lamFull=lam_min(A on [0,12800]); lamSplit=lam_min(A_lo+A_tail); splitDiscrep=|lamSplit-lamFull|.
export const IMP97038_ROWS = Object.freeze({
  148: Object.freeze({
    kmax: 153, tOnset: 278.533, tOnsetOverT3200: 0.087042,
    residMeasured: 0.0052718, residFirstOrder: 0.0199155,
    weightedTailFrac: 0.0335326, onsetFracUnweighted: 0.0305379,
    lamFull: 0.5792297, lamSplit: 0.5792178, splitDiscrep: 1.19e-5,
  }),
  172: Object.freeze({
    kmax: 177, tOnset: 322.225, tOnsetOverT3200: 0.100695,
    residMeasured: 0.0080429, residFirstOrder: 0.1041077,
    weightedTailFrac: 0.1542500, onsetFracUnweighted: 0.0353125,
    lamFull: 0.5788382, lamSplit: 0.5790892, splitDiscrep: 2.51e-4,
  }),
  196: Object.freeze({
    kmax: 201, tOnset: 365.916, tOnsetOverT3200: 0.114349,
    residMeasured: 0.0111861, residFirstOrder: 0.8116781,
    weightedTailFrac: 0.5886400, onsetFracUnweighted: 0.0400872,
    lamFull: 0.5783394, lamSplit: 0.5789514, splitDiscrep: 6.12e-4,
  }),
});

// N-growth of the ROBUST direct floor lift: measured vs the LINEAR-in-kmax onset prediction.
// The bridge rung 124->148 uses the imp-96934 baked residMeasured=0.0029994 at N=124.
// ratioOnsetLinear = (2*kmax_b+1)/(2*kmax_a+1); ratioOfRatios = ratioMeasured/ratioOnsetLinear.
export const IMP97038_GROWTH = Object.freeze({
  '124->148': Object.freeze({ ratioMeasured: 1.758, ratioOnsetLinear: 1.185, ratioOfRatios: 1.484 }),
  '148->172': Object.freeze({ ratioMeasured: 1.526, ratioOnsetLinear: 1.156, ratioOfRatios: 1.320 }),
  '172->196': Object.freeze({ ratioMeasured: 1.391, ratioOnsetLinear: 1.135, ratioOfRatios: 1.226 }),
});

// committed-rung ratio-of-ratios (from imp-96934) for the deceleration trend: 1.899 -> 1.226
export const IMP97038_RATIO_OF_RATIOS_TREND = Object.freeze([1.899, 1.640, 1.484, 1.320, 1.226]);

export const IMP97038_VERDICT = Object.freeze({
  ticket: 'imp-97038',
  question:
    'extend the imp-96934 uniform-j_k^2 onset-mass vs measured-tail-residual comparison to N beyond {76,100,124} (here {148,172,196}) at 2a=ln3 and decide whether the onset-mass prediction tracks, over- or under-predicts the measured tail residual as N grows',
  answer:
    'the robust direct floor lift keeps growing but DECELERATES (per-step x1.758/1.526/1.391, down from x2.457/2.013), so the onset model linear-in-k N-growth is progressively APPROACHED not escaped (measured/onset ratio-of-ratios falls 1.90->1.23); the absolute-fraction comparison, which rests on the first-order un-readjusted-minimiser tail residual, becomes numerically UNRELIABLE past N~148 (split-check |lam_split-lam_full| degrades to 6e-4, weighted tail fraction unphysical at 0.589), so the apparent over->under flip of the onset fraction is an ARTIFACT not a physical crossover',
  directFloorLiftDecelerates: true, // per-step growth ratio falls 2.457->1.391 across the five rungs
  onsetLinearGrowthApproached: true, // measured/onset ratio-of-ratios drops 1.90->1.23
  onsetsStayBelowCutoff: true, // tOnset/T3200 = 0.087-0.114 < 1 at every extended N
  firstOrderDecompUnreliablePastN148: true, // split-check degrades to 6e-4, weighted frac unphysical
  onsetFractionFlipIsArtifact: true, // over->under flip is the first-order picture breaking, not physics
  subGap: 'imp-97038-firstorder-tail-decomp-breaks-past-N148',
  reproducesImp96934AtCommittedRungs: true, // driver reproduces the baked floor lifts to all digits
  operatorPositivityProved: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP97038_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP97038_ASSERTIONS = [
  {
    id: 'imp97038-tonset-equals-kmax-over-a',
    holds: () =>
      IMP97038_NS.every((N) => {
        const r = IMP97038_ROWS[N];
        return (
          r.kmax === 2 * M_POLE + N - 1 &&
          Math.abs(r.tOnset - r.kmax / A_LN3) < 1e-2 &&
          Math.abs(r.tOnsetOverT3200 - r.tOnset / IMP97038_T3200) < 1e-4
        );
      }),
    why: 'the tabulated onset is exactly t_onset = k_max/a with k_max = 2m+N-1, the imp-96934 object, at the extended N.',
  },
  {
    id: 'imp97038-onsets-stay-below-cutoff',
    holds: () =>
      IMP97038_NS.every((N) => {
        const f = IMP97038_ROWS[N].tOnsetOverT3200;
        return f > 0.08 && f < 0.15; // grows past the committed 0.046-0.073 but still well below T=3200
      }),
    why: 'the onsets rise to 8.7-11.4% of T=3200 at the extended N but stay an order of magnitude below the cutoff, so the residual is still the far j_k tail, never the onset crossing T=3200.',
  },
  {
    id: 'imp97038-direct-floor-lift-decelerates',
    holds: () =>
      IMP97038_GROWTH['124->148'].ratioMeasured > IMP97038_GROWTH['148->172'].ratioMeasured &&
      IMP97038_GROWTH['148->172'].ratioMeasured > IMP97038_GROWTH['172->196'].ratioMeasured &&
      IMP97038_GROWTH['172->196'].ratioMeasured < 2.013, // below the last committed 100->124 ratio
    why: 'the robust direct floor-lift per-step growth ratio falls monotonically across the extended rungs (1.758 -> 1.526 -> 1.391), decelerating below the committed 2.013.',
  },
  {
    id: 'imp97038-onset-linear-growth-approached',
    holds: () => {
      const tr = IMP97038_RATIO_OF_RATIOS_TREND;
      // measured/onset ratio-of-ratios decreases monotonically toward 1 across all five rungs
      return tr.every((v, i) => i === 0 || v < tr[i - 1]) && tr[tr.length - 1] < 1.3 && tr[0] > 1.8;
    },
    why: 'the measured-vs-onset ratio-of-ratios drops monotonically 1.90 -> 1.23, so the onset model linear-in-k N-growth is progressively approached, not escaped, as N grows.',
  },
  {
    id: 'imp97038-firstorder-decomp-breaks-past-N148',
    holds: () => {
      const r172 = IMP97038_ROWS[172], r196 = IMP97038_ROWS[196];
      // split-check consistency degrades and the weighted tail fraction goes unphysical (>1/2)
      return (
        r172.splitDiscrep > IMP97038_ROWS[148].splitDiscrep &&
        r196.splitDiscrep > r172.splitDiscrep &&
        r196.splitDiscrep > 1e-4 &&
        r196.weightedTailFrac > 0.5 &&
        r196.residFirstOrder > 10 * r196.residMeasured
      );
    },
    why: 'the operator split-check |lam_split-lam_full| grows to 6e-4 and the first-order weighted tail fraction becomes unphysical (>1/2) with residFirstOrder over 70x residMeasured, so the first-order un-readjusted-minimiser decomposition is unreliable past N~148.',
  },
  {
    id: 'imp97038-onset-fraction-flip-is-artifact',
    holds: () =>
      IMP97038_VERDICT.onsetFractionFlipIsArtifact === true &&
      IMP97038_VERDICT.firstOrderDecompUnreliablePastN148 === true &&
      // the flip itself: onset fraction was < weighted (under-predicts) only where the decomp broke
      IMP97038_ROWS[196].onsetFracUnweighted < IMP97038_ROWS[196].weightedTailFrac,
    why: 'the onset fraction only appears to flip to under-predicting the weighted tail fraction where the first-order decomposition has already broken down, so the flip is a numerical artifact, not a physical crossover.',
  },
  {
    id: 'imp97038-measurement-only-no-qed',
    holds: () =>
      IMP97038_VERDICT.directFloorLiftDecelerates === true &&
      IMP97038_VERDICT.onsetLinearGrowthApproached === true &&
      IMP97038_VERDICT.reproducesImp96934AtCommittedRungs === true &&
      IMP97038_VERDICT.operatorPositivityProved === false &&
      IMP97038_VERDICT.intervalRigorousReachUnchanged === 0.96 &&
      IMP97038_VERDICT.qed === false,
    why: 'measurement only: the driver reproduces imp-96934 at the committed rungs, the extended direct floor lift decelerates toward the onset-linear growth, no operator positivity is established, the certificate reach stays 2a <= 0.96, and no QED is claimed.',
  },
];

for (const a of IMP97038_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-97038-bessel-onset-mass-extended-N-viz-data assertion failed: ${a.id}`);
  }
}

void LN3;
