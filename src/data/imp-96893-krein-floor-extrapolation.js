/**
 * @fileoverview imp-96893 -- EXTRAPOLATION (ESTIMATE, NOT A CERTIFIED INTERVAL): Aitken/Richardson
 * extrapolation of the imp-96876 direct seven-point N=100, 2a=ln3 Route I Krein floor sweep
 * f(800)=0.53384558 .. f(12800)=0.58044615 (increments still positive and shrinking:
 * +2.71e-4, +1.56e-4, +3.19e-5 over the last three rungs). Goal: estimate the plateau limit L and a
 * data-driven convergence-rate tail bound, and decide whether the resulting best-estimate window is
 * materially tighter than the imp-96827 fit-based enclosure [0.579666, 0.581292] (width 1.626e-3).
 *
 * METHOD (data-driven; all literals verbatim from tmp/imp-96893-out.json).
 *   (A) LOCAL POWER-LAW tail fit L - f(T) = C T^{-p} on the last three points {6400,9600,12800},
 *       minimising the log-linear residual over L: gives L3 = 0.58046473, p = 3.4715, C = 3.368e9,
 *       with a near-perfect fit (log-residual SS = 1.11e-11). Model residual beyond T=12800 = 1.86e-5.
 *   (B) RICHARDSON geometric-tail sum: with the per-doubling increment ratio geo-mean qgeo = 0.3428
 *       (last two ratios), the remaining tail beyond T=12800 is d_last*qgeo/(1-qgeo) = 1.662e-5,
 *       giving L_rich = f(12800)+tail = 0.58046277.
 *   (C) AITKEN Delta^2 on the EARLY doubling triple {800,1600,3200}: 0.5812925 -- this is a DIAGNOSTIC,
 *       not the estimate: it coincides (to 5e-7) with the imp-96827 geometric-per-doubling UPPER envelope
 *       LGeom = 0.581292, confirming that early-window Aitken reproduces the conservative upper end and
 *       that only the TAIL triples carry the true-limit signal.
 *
 * FINDINGS.
 *   1. TWO INDEPENDENT TAIL EXTRAPOLATIONS AGREE TO 2.0e-6. The local power-law (A) L3 = 0.58046473 and
 *      the Richardson geometric tail (B) L_rich = 0.58046277 differ by only 1.96e-6; their mean
 *      L_center = 0.58046375 is the best-estimate limit, with tail-beyond-12800 ~ 1.76e-5.
 *   2. THE BEST-ESTIMATE WINDOW IS ~88x TIGHTER THAN THE imp-96827 ENCLOSURE. Bracketing the estimate
 *      between the highest measured floor f(12800)=0.58044615 (a lower fence, since the floor still
 *      climbs) and the extrapolated limit 0.58046473 gives a window of width 1.858e-5 -- a factor 87.5
 *      narrower than the imp-96827 fit enclosure width 1.626e-3. The estimate lands INSIDE that enclosure
 *      (1.5e-5 below its center 0.580479), so extrapolation and the earlier fit are mutually consistent.
 *   3. THE NON-UNIFORM T-GRID CAPS THE RATE MODEL AT "DATA-DRIVEN ESTIMATE". The increment ratios are
 *      non-monotone (0.2219, 0.1259, 0.2628, 0.5743, 0.2047) because the sweep interleaves x2 doublings
 *      with x1.5 and x1.333 steps; a single geometric-rate / power-law model therefore fits the tail
 *      well locally but cannot be promoted to a certified rate. The window is a best ESTIMATE, not an
 *      enclosure.
 *
 * VERDICT. Aitken/Richardson extrapolation of the imp-96876 sweep yields a best-estimate plateau limit
 * L ~ 0.580464 with a ~1.86e-5-wide best-estimate window -- about 88x tighter than the imp-96827
 * enclosure, inside which it sits -- but this is an EXTRAPOLATION, not a certified interval: the
 * non-uniform T-grid makes the increment ratios non-monotone, so the convergence-rate tail (p~3.47 /
 * qgeo~0.34) is data-driven only. Rayleigh floors are UPPER bounds on the true lambda_min; establishes
 * NO operator positivity; the certified enclosure remains the imp-96827 [0.579666, 0.581292];
 * IMP96749_UNIFORM_N_GAP_UNSETTLED stays open; interval-rigorous reach stays 2a <= 0.96; RH open;
 * no refereed bound is changed; NO QED.
 *
 * @see imp-96876-krein-tresidual-crossval-measurement.js (source seven-point sweep IMP96876_FLOOR)
 * @see imp-96827-krein-tresidual-envelope-extrapolation.js (fit enclosure [0.579666,0.581292]; LGeom)
 * @see imp-96806-krein-tconv-plateau-2a-ln3.js (build()/lam_min() solver the sweep descends from)
 * @see imp-96749-krein-lammin-N-trend-measurement.js (IMP96749_UNIFORM_N_GAP_UNSETTLED)
 */

// the seven-point source sweep (verbatim from imp-96876 IMP96876_FLOOR, N=100, 2a=ln3)
export const IMP96893_TS = Object.freeze([800, 1600, 3200, 4800, 6400, 9600, 12800]);
export const IMP96893_FLOOR = Object.freeze({
  800: 0.53384558,
  1600: 0.57076391,
  3200: 0.57895618,
  4800: 0.57998757,
  6400: 0.58025863,
  9600: 0.58041429,
  12800: 0.58044615,
});

// (A) local power-law tail fit L - f(T) = C * T^{-p} on {6400,9600,12800}
export const IMP96893_POWERLAW = Object.freeze({
  points: [6400, 9600, 12800],
  L: 0.58046473,
  p: 3.4715, // measured local convergence exponent
  C: 3.36754835e9,
  logResidualSS: 1.11322466e-11, // near-perfect log-linear fit
  modelTailBeyond12800: 1.8575e-5,
});

// (B) Richardson geometric-tail sum from the per-doubling increment ratios
export const IMP96893_RICHARDSON = Object.freeze({
  qgeo: 0.3428, // geometric mean of the last two increment ratios
  tailBeyond12800: 1.662e-5,
  L: 0.58046277,
});

// (C) Aitken Delta^2 on the EARLY doubling triple {800,1600,3200} -- DIAGNOSTIC only
export const IMP96893_AITKEN_EARLY = Object.freeze({
  triple: [800, 1600, 3200],
  value: 0.5812925,
  matchesImp96827LGeom: 0.581292, // coincides to 5e-7 with the imp-96827 geometric upper envelope
  note: 'early-window Aitken reproduces the conservative UPPER end, not the true limit; only tail triples carry the limit signal',
});

// consolidated best-estimate and the tightness comparison against imp-96827
export const IMP96893_ESTIMATE = Object.freeze({
  LCenter: 0.58046375, // mean of the two tail extrapolations (A,B)
  LSpread: 1.959e-6, // |L_powerlaw - L_richardson|
  tailBeyond12800: 1.76e-5, // L_center - f(12800)
  window: Object.freeze([0.58044615, 0.58046473]), // [f(12800) lower fence, power-law limit]
  windowWidth: 1.858e-5,
  enclosure: Object.freeze([0.579666, 0.581292]), // imp-96827 fit enclosure
  enclosureWidth: 1.626e-3,
  tightenFactor: 87.5, // enclosureWidth / windowWidth
  estimateInsideEnclosure: true, // 0.579666 < 0.58046375 < 0.581292
  distToEnclosureCenter: 1.5e-5, // |L_center - 0.580479|
});

// honest caveats (increment ratios non-monotone => estimate not certified)
export const IMP96893_CAVEATS = Object.freeze({
  incrementRatios: Object.freeze([0.2219, 0.1259, 0.2628, 0.5743, 0.2047]),
  ratiosNonMonotone: true, // non-uniform T-grid (x2, x1.5, x1.333 interleaved)
  isCertifiedInterval: false, // EXTRAPOLATION / ESTIMATE only
  rayleighFloorsAreUpperBounds: true,
  operatorPositivityProved: false,
  certifiedEnclosureRemains: 'imp-96827 [0.579666, 0.581292]',
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});

export const IMP96893_VERDICT = Object.freeze({
  ticket: 'imp-96893',
  question:
    'Aitken/Richardson-extrapolate the imp-96876 seven-point N=100, 2a=ln3 Krein floor sweep: estimate the plateau limit L and a data-driven tail bound, and is the best-estimate window materially tighter than the imp-96827 enclosure?',
  answer:
    'two independent tail extrapolations (local power-law L=0.58046473 with p~3.47 and near-perfect fit, and Richardson geometric tail L=0.58046277) agree to 2.0e-6; best-estimate limit L~0.580464 with a ~1.86e-5-wide best-estimate window -- about 88x tighter than the imp-96827 enclosure width 1.626e-3, and inside that enclosure (1.5e-5 below its center). But this is an EXTRAPOLATION not a certified interval: the non-uniform T-grid makes the increment ratios non-monotone (0.22,0.13,0.26,0.57,0.20), so the rate tail is data-driven only. Aitken on the EARLY doubling triple returns 0.5812925, coinciding with the imp-96827 geometric UPPER envelope -- a diagnostic that early windows over-estimate.',
  LCenter: 0.58046375,
  windowWidth: 1.858e-5,
  tightenFactor: 87.5,
  estimateInsideEnclosure: true,
  isCertifiedInterval: false,
  certifiedEnclosureRemains: 'imp-96827 [0.579666, 0.581292]',
  operatorPositivityProved: false,
  uniformNGapSettled: false,
  intervalRigorousReachUnchanged: 0.96,
  qed: false,
});
export default IMP96893_VERDICT;

// -- self-executing assertions (imp-3715 convention): any failure throws at import --

const IMP96893_ASSERTIONS = [
  {
    id: 'imp96893-tail-extrapolations-agree',
    holds: () => Math.abs(IMP96893_POWERLAW.L - IMP96893_RICHARDSON.L) < 5e-6,
    why: 'the local power-law and Richardson geometric-tail limit estimates agree to under 5e-6, so the best-estimate limit is robust across two independent extrapolation models.',
  },
  {
    id: 'imp96893-estimate-inside-imp96827-enclosure',
    holds: () => {
      const [lo, hi] = IMP96893_ESTIMATE.enclosure;
      return IMP96893_ESTIMATE.LCenter > lo && IMP96893_ESTIMATE.LCenter < hi;
    },
    why: 'the extrapolated limit lands strictly inside the imp-96827 fit enclosure [0.579666,0.581292], so extrapolation corroborates the earlier fit rather than contradicting it.',
  },
  {
    id: 'imp96893-window-materially-tighter',
    holds: () => {
      const factor = IMP96893_ESTIMATE.enclosureWidth / IMP96893_ESTIMATE.windowWidth;
      return factor > 50 && Math.abs(factor - IMP96893_ESTIMATE.tightenFactor) < 1;
    },
    why: 'the best-estimate window is more than 50x narrower than the imp-96827 enclosure (measured 87.5x), i.e. the extrapolation materially tightens the point estimate.',
  },
  {
    id: 'imp96893-lower-fence-is-highest-measured-floor',
    holds: () => IMP96893_ESTIMATE.window[0] === IMP96893_FLOOR[12800],
    why: 'the window lower fence is the highest DIRECTLY-measured floor f(12800); since the floor still climbs this is a genuine lower bound on the estimate, keeping the window honest.',
  },
  {
    id: 'imp96893-aitken-early-matches-imp96827-upper',
    holds: () => Math.abs(IMP96893_AITKEN_EARLY.value - IMP96893_AITKEN_EARLY.matchesImp96827LGeom) < 1e-6,
    why: 'Aitken on the early doubling triple reproduces the imp-96827 geometric UPPER envelope to under 1e-6 -- a cross-check that early-window acceleration returns the conservative upper end, not the true limit.',
  },
  {
    id: 'imp96893-not-a-certified-interval',
    holds: () => IMP96893_CAVEATS.isCertifiedInterval === false && IMP96893_VERDICT.qed === false,
    why: 'the extrapolation is an ESTIMATE not a certified interval (non-monotone increment ratios on a non-uniform T-grid); Rayleigh floors are upper bounds; NO QED.',
  },
];

for (const a of IMP96893_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`[imp-96893] assertion failed: ${a.id} -- ${a.why}`);
  }
}
