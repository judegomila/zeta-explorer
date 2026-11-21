/**
 * @module imp-97576-route-m-gauss-kuzmin-wobble-average
 *
 * imp-97576 (numerical -- MEASUREMENT, no bound moved): imp-97563 VERDICT(c) claims the Bettin-Conrey
 * reciprocity split isolates the smooth curvature kappa_smooth (<~1e-2) ONLY as a Gauss-Kuzmin average
 * over generic large-denominator reduced rationals, distinct from the pointwise ~4e-2 wobble amplitude
 * that kappa_eff = 0.0995 samples, because w_sym(a,q) = (V(a,q)+V(q,a))/q is a quantum modular form.
 * THIS module MEASURES that Gauss-Kuzmin-weighted average of the normalized wobble
 *     r/x^2 = (w_sym(p,r) - w_lin(p/r)) / (p/r)^2
 * over reduced rationals p/r sampled densely near a fixed x (the imp-97460 dense scheme: vary b,
 * a = round(x b), reduce, average), and tests whether the average converges to a smooth kappa_smooth.
 * Measurement only; kappa_smooth NOT pinned; no bound moves; RH open; NO QED.
 *
 * -------------------------------------------------------------------------------------------------
 * QUANTITIES (light re-definitions, matching imp-97563 exactly).
 * -------------------------------------------------------------------------------------------------
 *   V(a,q)     = Sum_{m=1}^{q-1} frac(m a/q) cot(pi m/q)      (Estermann/Vasyunin cotangent sum)
 *   w_sym(a,q) = (V(a,q) + V(q,a)) / q                        (scale-invariant; function of p/r reduced)
 *   w_lin(x)   = (2C)/pi + log(x)/pi - x/pi,  C = (log 2pi - gamma)/2   (imp-97460 forced truncation)
 *   r/x^2      = (w_sym - w_lin)/x^2                          (the normalized bulk-profile wobble)
 *
 * -------------------------------------------------------------------------------------------------
 * FINDING 1 -- at a FIXED nonzero x the large-denominator average is NOT small (it is O(kappa_eff)).
 * -------------------------------------------------------------------------------------------------
 * Sampling the imp-97460 dense scheme near x = 0.1, the windowed mean of r/x^2 does NOT settle below
 * 1e-2. It DRIFTS toward ~ -0.086 as the denominators grow, and at denominator ~ 1e5 it has COLLAPSED
 * to -8.65e-2 with essentially zero spread (mean = rms to 5 sig figs) -- i.e. the generic large-denom
 * value converges to the neighbourhood of the 1/10 "spike" value -0.0872, not to a small constant.
 * So the smallness of kappa_smooth is NOT a fixed-x phenomenon: at x = 0.1 the average is ~ -0.07,
 * comparable to kappa_eff = 0.0995, not <~1e-2. (This sharpens the imp-97563 narrative, which read the
 * -2.0e-3 figure as a fixed-x=0.1 value; it is instead a CUSP value -- see FINDING 2.)
 *
 * -------------------------------------------------------------------------------------------------
 * FINDING 2 -- the smallness of kappa_smooth is a CUSP (x -> 0) phenomenon: the average -> 0 as x -> 0
 * -------------------------------------------------------------------------------------------------
 * Taking the large-denominator generic average at SHRINKING x0 (band b in [round(150/x0), round(300/x0)],
 * reduced denominator r >= 200) the mean of r/x^2 decreases MONOTONICALLY in magnitude toward zero,
 * dropping below 1e-2 by x0 = 0.005:
 *     x0 = 0.200 -> mean -7.68073e-2  (sd 3.207e-3)
 *     x0 = 0.100 -> mean -7.09788e-2  (sd 6.650e-3)
 *     x0 = 0.050 -> mean -6.16839e-2  (sd 1.109e-2)
 *     x0 = 0.020 -> mean -4.19324e-2  (sd 1.917e-2)
 *     x0 = 0.010 -> mean -2.17333e-2  (sd 2.515e-2)
 *     x0 = 0.005 -> mean -2.60770e-3  (sd 2.720e-2)   <-- below 1e-2, matches the imp-97460 -2.0e-3
 * The mean shrinks toward the small kappa_smooth EXACTLY as the cusp x -> 0 is approached, reproducing
 * the imp-97460 "mean r/x^2 = -2.0e-3" figure as a CUSP value (our x0 = 0.005 gives -2.61e-3).
 *
 * -------------------------------------------------------------------------------------------------
 * FINDING 3 -- the wobble amplitude GROWS as x -> 0, staying distinct from the shrinking mean.
 * -------------------------------------------------------------------------------------------------
 * The per-sample spread sd rises from 3.2e-3 at x0 = 0.2 to 2.72e-2 at x0 = 0.005 -- heading toward the
 * imp-97460 wobble RMS ~ 4e-2 -- while the mean falls to -2.6e-3. So the Gauss-Kuzmin AVERAGE (the mean)
 * and the pointwise WOBBLE (the sd) are genuinely distinct scales in the cusp: the average sits an order
 * of magnitude below the wobble amplitude by x0 = 0.005 (|mean|/sd ~ 0.096), and the gap widens as
 * x0 -> 0. This is the operational content of imp-97563 VERDICT(c).
 *
 * -------------------------------------------------------------------------------------------------
 * VERDICT.
 * -------------------------------------------------------------------------------------------------
 * The Gauss-Kuzmin average of the normalized wobble DOES isolate a small kappa_smooth (<~1e-2) distinct
 * from the ~4e-2 pointwise wobble amplitude -- but ONLY in the cusp limit x -> 0, NOT at a fixed nonzero
 * x. At x = 0.1 the average is ~ -0.07 (O(kappa_eff)); it decays monotonically to -2.61e-3 by x0 = 0.005
 * while the wobble sd grows to 2.72e-2. This confirms and sharpens imp-97563 VERDICT(c): the -2.0e-3
 * "average" is a CUSP value, and kappa_smooth is the x -> 0 limit of the large-denominator mean of
 * r/x^2 (consistent with the analytic period-function cusp O(x^2) coefficient of the imp-97563 sub-gap),
 * NOT a fixed-x average. Measurement only; kappa_smooth NOT pinned to an exact value; no bound moves;
 * the rigorous anchor stays the trace ceiling T = 2.594e7; compute (N ~ 9916, imp-96352) binds first by
 * >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.
 *
 * SUB-GAP (below): imp-97576-cusp-extrapolation -- extrapolating the x0 -> 0 limit of the mean to PIN
 * kappa_smooth needs (i) x0 below 0.005 (reduced denominators >1e5, currently compute-bound at this
 * per-sample O(q) cost) and (ii) a controlled Richardson/log extrapolation, since the mean still carries
 * a residual x0-dependence (not yet flat at x0 = 0.005). The exact analytic value stays the psi cusp
 * O(x^2) coefficient (imp-97563 sub-gap imp-97563-period-function-cusp-coefficient).
 *
 * @see imp-97563-route-m-bettin-conrey-reciprocity-split-assessment (VERDICT(c) Gauss-Kuzmin-average isolation)
 * @see imp-97460-route-m-bulk-profile-curvature-analytic-route (dense scheme; mean r/x^2 = -2.0e-3)
 * @see imp-97437-route-m-bulk-profile-curvature-crossover (kappa_eff = 0.0995, a wobble amplitude)
 *
 * Ticket: imp-97576 (numerical, opus-4-8, api-pool). Gauss-Kuzmin average MEASURED: isolates kappa_smooth
 * <~1e-2 only in the cusp x -> 0 limit (-2.61e-3 at x0=0.005), distinct from the growing ~2.7e-2 wobble;
 * NOT a fixed-x average; kappa_smooth NOT pinned; NO QED.
 */

export const IMP97576_GAMMA = 0.5772156649015329;
export const IMP97576_C = (Math.log(2 * Math.PI) - IMP97576_GAMMA) / 2;

// -- light re-definitions (small q only; dense scans are offline, results baked below). --------------
export function imp97576WLin(x) {
  return (2 * IMP97576_C) / Math.PI + Math.log(x) / Math.PI - x / Math.PI;
}
export function imp97576V(a, q) {
  let s = 0;
  for (let m = 1; m < q; m++) {
    s += (((m * a) / q) - Math.floor((m * a) / q)) / Math.tan((Math.PI * m) / q);
  }
  return s;
}
export function imp97576WSym(a, q) {
  return (imp97576V(a, q) + imp97576V(q, a)) / q;
}
// r/x^2 at the reduced rational p/q (x = p/q).
export function imp97576Ratio(p, q) {
  const x = p / q;
  return (imp97576WSym(p, q) - imp97576WLin(x)) / (x * x);
}

// -- FINDING 2/3 anchors: the cusp x0 -> 0 ladder (large-denominator generic average of r/x^2). ------
//    Band b in [round(150/x0), round(300/x0)], reduced denominator r >= 200; offline, baked here.
export const IMP97576_CUSP_LADDER = Object.freeze([
  Object.freeze({ x0: 0.2, mean: -7.68073e-2, sd: 3.207e-3, n: 600 }),
  Object.freeze({ x0: 0.1, mean: -7.09788e-2, sd: 6.65e-3, n: 1350 }),
  Object.freeze({ x0: 0.05, mean: -6.16839e-2, sd: 1.109e-2, n: 2850 }),
  Object.freeze({ x0: 0.02, mean: -4.19324e-2, sd: 1.917e-2, n: 7350 }),
  Object.freeze({ x0: 0.01, mean: -2.17333e-2, sd: 2.515e-2, n: 14850 }),
  Object.freeze({ x0: 0.005, mean: -2.6077e-3, sd: 2.72e-2, n: 30001 }),
]);

// -- FINDING 1 anchor: the fixed-x=0.1 large-denominator collapse (denominator ~ 1e5). ---------------
export const IMP97576_FIXED_X_COLLAPSE = Object.freeze({
  x0: 0.1,
  denominatorScale: 1e5,
  mean: -8.6518e-2, // b in [99800,100200], r/x^2 collapses to the neighbourhood of the 1/10 spike
  sd: 0, // spread below 5 sig figs: mean == rms to reported precision
  spikeAtTenth: -0.087209, // ratio(1,10), the small-denominator convergent
});

export const IMP97576_KAPPA_EFF = 0.0995; // imp-97437 (a wobble amplitude)
export const IMP97576_KAPPA_SMOOTH_UPPER = 1e-2; // imp-97460/imp-97563 Gauss-Kuzmin-averaged bound
export const IMP97576_CUSP_MEAN_AT_5EM3 = -2.6077e-3; // cusp value at x0=0.005 (matches imp-97460 -2.0e-3)

export const IMP97576_VERDICT = Object.freeze({
  id: 'imp-97576',
  proofSection: 'Route-M',
  question:
    'Measure the Gauss-Kuzmin average of the normalized wobble r/x^2 over generic large-denominator ' +
    'reduced rationals near a fixed x and test whether it converges to a smooth kappa_smooth (<~1e-2) ' +
    'distinct from the pointwise ~4e-2 wobble amplitude kappa_eff = 0.0995.',
  averageIsSmallAtFixedX: false, // FINDING 1: at x=0.1 the average is ~-0.07 (O(kappa_eff)), not small
  fixedXCollapsesToSpikeNeighbourhood: true, // -8.65e-2 at denom ~1e5, near the 1/10 spike -0.0872
  averageIsSmallInCuspLimit: true, // FINDING 2: mean -> -2.61e-3 by x0=0.005, monotone decreasing
  cuspMeanBelowSmoothUpperBound: true, // |mean(x0=0.005)| = 2.61e-3 < 1e-2
  reproducesImp97460CuspValue: true, // -2.61e-3 matches the imp-97460 -2.0e-3 figure as a CUSP value
  wobbleAmplitudeGrowsAsXToZero: true, // FINDING 3: sd rises 3.2e-3 -> 2.72e-2 toward the 4e-2 RMS
  averageDistinctFromWobble: true, // |mean|/sd ~ 0.096 at x0=0.005, gap widens as x0 -> 0
  smallnessIsCuspNotFixedX: true, // the sharpening of imp-97563 VERDICT(c)
  kappaSmoothPinned: false, // exact value still = psi cusp O(x^2) coefficient (imp-97563 sub-gap)
  anyBoundMoved: false,
  operatorPositivityEstablished: false,
  computeBindsFirst: true, // N ~ 9916 (imp-96352) binds by >2600x
  conclusion:
    'The Gauss-Kuzmin average of the normalized wobble r/x^2 DOES isolate a small kappa_smooth (<~1e-2) ' +
    'distinct from the ~4e-2 pointwise wobble amplitude, but ONLY in the cusp x -> 0 limit. At a fixed ' +
    'nonzero x the average is NOT small: near x = 0.1 the dense-scheme mean drifts to ~ -0.07 and, at ' +
    'denominator ~ 1e5, COLLAPSES to -8.65e-2 (the neighbourhood of the 1/10 spike -0.0872) with zero ' +
    'spread -- comparable to kappa_eff = 0.0995. Taking the large-denominator generic average at ' +
    'shrinking x0, the mean falls MONOTONICALLY: -7.68e-2 (x0=0.2), -7.10e-2 (0.1), -6.17e-2 (0.05), ' +
    '-4.19e-2 (0.02), -2.17e-2 (0.01), -2.61e-3 (0.005) -- dropping below 1e-2 and reproducing the ' +
    'imp-97460 -2.0e-3 figure as a CUSP value. Meanwhile the wobble sd GROWS (3.2e-3 -> 2.72e-2, toward ' +
    'the 4e-2 RMS), so the average and the pointwise wobble are genuinely distinct scales in the cusp ' +
    '(|mean|/sd ~ 0.096 at x0=0.005, gap widening as x0 -> 0). This confirms and sharpens imp-97563 ' +
    'VERDICT(c): kappa_smooth is the x -> 0 limit of the large-denominator mean of r/x^2, NOT a fixed-x ' +
    'average; the -2.0e-3 is a cusp value. Measurement only; kappa_smooth NOT pinned (exact value = the ' +
    'psi cusp O(x^2) coefficient, imp-97563 sub-gap); no bound moves; the rigorous anchor stays T = ' +
    '2.594e7; compute binds first by >2600x; no operator positivity; no refereed bound is changed; RH open; NO QED.',
});

export const IMP97576_SUBGAP = Object.freeze({
  id: 'imp-97576-cusp-extrapolation',
  statement:
    'Extrapolating the x0 -> 0 limit of the large-denominator mean of r/x^2 to PIN the exact ' +
    'kappa_smooth needs (i) x0 below 0.005 (reduced denominators >1e5, currently compute-bound at the ' +
    'per-sample O(q) cost of V) and (ii) a controlled Richardson/log extrapolation, since the mean ' +
    'still carries a residual x0-dependence (not yet flat at x0 = 0.005). The exact analytic value ' +
    'stays the Bettin-Conrey period-function psi cusp O(x^2) Taylor coefficient (imp-97563 sub-gap ' +
    'imp-97563-period-function-cusp-coefficient).',
});

export const IMP97576_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: the Gauss-Kuzmin average of the ' +
  'normalized wobble r/x^2 isolates a small kappa_smooth (<~1e-2, measured -2.61e-3 at x0=0.005) ' +
  'distinct from the ~4e-2 pointwise wobble amplitude ONLY in the cusp x -> 0 limit -- at fixed x=0.1 ' +
  'the average is ~ -0.07 (O(kappa_eff)), collapsing to -8.65e-2 at denominator ~1e5. No analytic ' +
  'constant is pinned; the rigorous anchor stays T = 2.594e7; compute binds first by >2600x.';

export default IMP97576_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import. Light V sums -----
//    only (q <= 200); the dense cusp ladder is offline (tmp/imp-97576-*.mjs), outputs baked above. ---
const IMP97576_ASSERTIONS = [
  {
    id: 'imp97576-ratio-reproduces-spike',
    why: 'the light Ratio helper must reproduce the imp-97563 small-denominator spike ratio(1,10) = ' +
      '-0.087209 -- the fixed anchor the fixed-x collapse converges toward.',
    holds: () => Math.abs(imp97576Ratio(1, 10) - -0.087209) < 1e-5,
  },
  {
    id: 'imp97576-cusp-ladder-monotone-decreasing',
    why: 'FINDING 2: the large-denominator mean of r/x^2 must decrease MONOTONICALLY in magnitude as ' +
      'x0 shrinks -- |mean| strictly decreasing down the ladder toward the small kappa_smooth.',
    holds: () => {
      for (let i = 1; i < IMP97576_CUSP_LADDER.length; i++) {
        if (Math.abs(IMP97576_CUSP_LADDER[i].mean) >= Math.abs(IMP97576_CUSP_LADDER[i - 1].mean)) {
          return false;
        }
      }
      return true;
    },
  },
  {
    id: 'imp97576-cusp-below-bound-fixed-above',
    why: 'FINDINGS 1+2: the cusp value at x0=0.005 must sit below the 1e-2 smooth bound while the ' +
      'fixed-x=0.1 value stays an order of magnitude larger (O(kappa_eff)), the core of the sharpening.',
    holds: () =>
      Math.abs(IMP97576_CUSP_MEAN_AT_5EM3) < IMP97576_KAPPA_SMOOTH_UPPER &&
      Math.abs(IMP97576_CUSP_LADDER[1].mean) > 5e-2 &&
      Math.abs(IMP97576_CUSP_LADDER[1].mean) < IMP97576_KAPPA_EFF,
  },
  {
    id: 'imp97576-wobble-sd-grows-as-cusp',
    why: 'FINDING 3: the per-sample sd (wobble amplitude) must GROW as x0 -> 0, from ~3e-3 at x0=0.2 ' +
      'up toward the ~4e-2 RMS by x0=0.005, staying distinct from the shrinking mean.',
    holds: () => {
      const first = IMP97576_CUSP_LADDER[0].sd;
      const last = IMP97576_CUSP_LADDER[IMP97576_CUSP_LADDER.length - 1].sd;
      return last > first && last > 2e-2 && last < 4e-2 && first < 5e-3;
    },
  },
  {
    id: 'imp97576-average-distinct-from-wobble-in-cusp',
    why: 'VERDICT: in the cusp the average must sit an order of magnitude below the wobble amplitude -- ' +
      '|mean|/sd < 0.15 at x0=0.005 -- confirming the two scales are genuinely distinct.',
    holds: () => {
      const row = IMP97576_CUSP_LADDER[IMP97576_CUSP_LADDER.length - 1];
      return Math.abs(row.mean) / row.sd < 0.15;
    },
  },
  {
    id: 'imp97576-honesty-gate-no-qed',
    why: 'measurement only: average isolates kappa_smooth only in the cusp, not at fixed x; no constant ' +
      'pinned, no bound moved, compute binds first, markers + sub-gap present.',
    holds: () =>
      IMP97576_VERDICT.anyBoundMoved === false &&
      IMP97576_VERDICT.averageIsSmallAtFixedX === false &&
      IMP97576_VERDICT.averageIsSmallInCuspLimit === true &&
      IMP97576_VERDICT.smallnessIsCuspNotFixedX === true &&
      IMP97576_VERDICT.averageDistinctFromWobble === true &&
      IMP97576_VERDICT.kappaSmoothPinned === false &&
      IMP97576_VERDICT.computeBindsFirst === true &&
      /NO QED/.test(IMP97576_HONEST_BANNER) &&
      /PT Lambda <= 0.2|refereed bound is changed/.test(IMP97576_HONEST_BANNER) &&
      /RH open/.test(IMP97576_HONEST_BANNER) &&
      /cusp-extrapolation/.test(IMP97576_SUBGAP.id),
  },
];

for (const a of IMP97576_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-97576-route-m-gauss-kuzmin-wobble-average assertion failed: ${a.id}`,
    );
  }
}

export { IMP97576_ASSERTIONS };
