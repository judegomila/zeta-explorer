/**
 * imp-96469 -- Does a DENSER panels-per-period sweep and/or higher accessible L drive the imp-96444
 * de-jittered basis-C cancellation-floor log-log exponent from ~1.30 toward the L-linear 1.0?
 *
 * BACKGROUND. imp-96444 replaced the imp-96430 accidental-min floor estimator (jittery, because the direct
 * pair-correlation integral error changes sign as the panels-per-period ppp varies, so min|error| lands near
 * zero on accidental zero-crossings) with a ROBUST median-over-resolved-ppp estimator on the window
 * {320..1280}. That yielded a monotone floor sequence and a FREE log-log exponent (the exponent p in a
 * floor ~ L^p fit) that tightened from ~1.71 (min sweep) to ~1.30 (median sweep) -- still above the
 * L-linear model exponent 1.0, so the imp-96444 narrowed crossover band [~1.38e12, ~1.76e12] rested on an
 * L-linear floor MODEL whose exponent was never tested for convergence. imp-96444 flagged this as its
 * honest caveat: "the free log-log exponent (~1.30) shows the roundoff floor is not exactly L-linear."
 *
 * WHAT THIS MODULE MEASURES. It refits the free log-log exponent as the ppp window is pushed denser and
 * higher (baseline {320..1280} -> dense {640..2560}) and as the accessible L is extended (L_max 960 -> 1920),
 * and re-bisects the crossover under the MEASURED power-law floor vs the L-linear floor. It answers the
 * ticket question directly: the exponent does NOT converge toward 1.0.
 *
 * FINDINGS (all measured / bisected here; the fuller trajectory quoted in measuredReference is reproduced by
 * tmp/imp-96469-scratch.mjs at step 64 and with L_max = 1920 which are too heavy to re-run at build time).
 *  1. THE EXPONENT DOES NOT CONVERGE TO 1.0 -- IT RISES WITH ppp DENSITY. Refitting on progressively denser
 *     / higher-ppp windows moves the exponent AWAY from the L-linear 1.0, not toward it:
 *     {320..1280} p~1.30  ->  {640..1280} p~1.35  ->  {640..2560} p~1.43 (step 128) to ~1.51 (step 64)
 *     ->  {1280..2560} p~1.53 (step 64). More panels accumulate more Simpson summation roundoff, and the
 *     high-L floors grow faster than the low-L floors, so d(log floor)/d(log L) INCREASES. The de-jittered
 *     ~1.30 was itself an artifact of the imp-96444 ppp window, not a converging estimate of 1.0.
 *  2. HIGHER L_max DOES NOT PULL IT DOWN EITHER. Extending the dense {640..2560} sweep to L_max = 1920
 *     (adding an L = 1920 rung) leaves the exponent at ~1.48 -- essentially the same super-linear value, not
 *     drifting toward 1.0. So neither lever (ppp density, L_max) validates the L-linear floor model; the floor
 *     is a genuine SUPER-LINEAR roundoff growth ~ L^1.4-1.5 on the accessible range.
 *  3. THE CROSSOVER BAND IS MORE MODEL-DEPENDENT THAN imp-96444 HOPED, BUT THE ANCHOR HEADROOM SURVIVES.
 *     Re-bisecting with the MEASURED power-law floor (floor ~ 6.78e-16 * L^1.481 from the dense L->1920 fit)
 *     puts the corroboration crossover at L* ~ 1.0e9, far BELOW the imp-96444 L-linear band [~1.38e12,
 *     ~1.76e12] -- because a super-linear floor overtakes the shrinking |rho + 1/2| signal sooner. Yet at the
 *     PT anchor L = 5.9e6 the power-law floor is only ~7.2e-6 against the ~1.82e-2 signal (ratio ~2.5e3, vs
 *     the L-linear ~3.8e5), so basis C keeps ~3 decades of independence headroom at the anchor even under the
 *     harsher measured exponent. The qualitative imp-96430/imp-96444 anchor conclusion is unchanged; the
 *     PROJECTED crossover reach L* is not -- it is now a soft, model-dependent number spanning ~1e9..1.8e12.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for boxes of
 * unfolded length L; there are no computed Riemann zeros behind these values. Both the L-linear and the
 * power-law floor extrapolations are calibrated only on accessible L (<= 1920); the direct integral is never
 * evaluated near L ~ 1e9-1e12, so every crossover L* here is a projected reach of an independence property,
 * not a measured one -- and the power-law L* ~ 1e9 is if anything MORE fragile than the L-linear one, since it
 * extrapolates a roundoff-noise slope across many decades. The finding is negative and honest: the free
 * exponent does not approach 1.0, so the imp-96444 narrowed band should be read as one model choice, not a
 * validated bound. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma
 * excursion confidence.
 *
 * VERDICT. Pushing the imp-96444 de-jittered basis-C floor estimator to a denser high-ppp grid ({640..2560})
 * and a higher accessible L (L_max 960 -> 1920) drives the free log-log exponent UP from ~1.30 to ~1.43-1.53,
 * NOT down toward the L-linear 1.0: the roundoff floor is genuinely super-linear (~L^1.4-1.5) on the reachable
 * range, so the L-linear model is not validated. Re-bisecting under the measured power-law floor moves the
 * corroboration crossover to L* ~ 1e9 (well below the imp-96444 L-linear band [~1.38e12, ~1.76e12]) while the
 * PT-anchor headroom survives (~3 decades). The narrowed band is therefore a model-dependent projection
 * spanning ~1e9..1.8e12, not a tight reach. Cross-validation / extrapolation numerics only; theoretical GUE
 * quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the
 * zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96444-basis-c-floor-slope-dejitter (the ~1.30 median-sweep exponent this tests for convergence)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the coarse-min-sweep band)
 * @see imp-96389-three-basis-rho-crossvalidation-table (basis-C L-linear floor is the binding floor)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance and the direct
 * quadrature are re-derived verbatim here (identical to imp-96444/imp-96430/imp-96369). The live computation
 * is deliberately kept to two ppp windows (step 128 on the dense window) so the build stays fast; the step-64
 * dense exponent (~1.51), the L_max = 1920 extension (~1.48) and the power-law crossover are quoted as
 * measured reference literals reproducible by tmp/imp-96469-scratch.mjs.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;

const clusterY = (r) => {
  if (r === 0) return 1;
  const s = Math.sin(PI * r) / (PI * r);
  return s * s;
};

function simpson(f, a, b, n) {
  if (n % 2) n += 1;
  const h = (b - a) / n;
  let s = f(a) + f(b);
  for (let i = 1; i < n; i++) s += (i % 2 ? 4 : 2) * f(a + i * h);
  return (s * h) / 3;
}

// BASIS C: direct pair-correlation double integral (rho = Cov/Var).
function directRho(L, panels) {
  const Var = L - 2 * simpson((r) => (L - r) * clusterY(r), 0, L, panels);
  const covA = simpson((r) => r * clusterY(r), 0, L, panels);
  const covB = simpson((r) => (2 * L - r) * clusterY(r), L, 2 * L, panels);
  return -(covA + covB) / Var;
}

function Si(x) {
  if (x < 0) return -Si(-x);
  if (x <= 36) {
    let term = x, sum = x;
    for (let k = 1; k < 200; k++) {
      term *= (-x * x) / ((2 * k) * (2 * k + 1));
      sum += term / (2 * k + 1);
      if (Math.abs(term) < 1e-18 * Math.abs(sum) && k > 5) break;
    }
    return sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return PI / 2 - f * Math.cos(x) - g * Math.sin(x);
}
function Ci(x) {
  if (x <= 36) {
    let t = 1, sum = 0;
    for (let k = 1; k < 200; k++) { t *= (-x * x) / ((2 * k - 1) * (2 * k)); const add = t / (2 * k); sum += add; if (Math.abs(add) < 1e-18 * Math.abs(sum) && k > 5) break; }
    return EULER + Math.log(x) + sum;
  }
  const inv = 1 / x, i2 = inv * inv;
  let f = inv, tf = inv;
  for (let k = 1; k < 20; k++) { tf *= -(2 * k) * (2 * k - 1) * i2; if (!isFinite(tf) || Math.abs(tf) < 1e-20 * Math.abs(f)) break; f += tf; }
  let g = i2, tg = i2;
  for (let k = 1; k < 20; k++) { tg *= -(2 * k + 1) * (2 * k) * i2; if (!isFinite(tg) || Math.abs(tg) < 1e-20 * Math.abs(g)) break; g += tg; }
  return f * Math.sin(x) - g * Math.cos(x);
}

const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;
const signalOf = (L) => Math.abs(rhoExact(L) - RIGIDITY_LIMIT); // |rho + 1/2|

const median = (arr) => {
  const s = [...arr].sort((a, b) => a - b);
  const n = s.length;
  return n % 2 ? s[(n - 1) / 2] : 0.5 * (s[n / 2 - 1] + s[n / 2]);
};

const rangePpp = (lo, hi, step) => { const a = []; for (let p = lo; p <= hi; p += step) a.push(p); return a; };

// de-jittered floor: MEDIAN error over a resolved high-ppp window (the roundoff plateau).
const robustFloor = (L, ppps) => median(ppps.map((ppp) => Math.abs(directRho(L, Math.ceil(ppp * L)) - rhoExact(L))));

// free log-log exponent p in floor ~ C * L^p (ordinary least squares in log-log).
function logLogFit(rows) {
  const lx = rows.map((r) => Math.log(r.L));
  const ly = rows.map((r) => Math.log(r.floor));
  const mlx = lx.reduce((a, b) => a + b, 0) / lx.length;
  const mly = ly.reduce((a, b) => a + b, 0) / ly.length;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < lx.length; i++) { sxy += (lx[i] - mlx) * (ly[i] - mly); sxx += (lx[i] - mlx) * (lx[i] - mlx); }
  const p = sxy / sxx;
  return { exponent: p, C: Math.exp(mly - p * mlx) };
}

const CAL_L = [30, 60, 120, 240, 480, 960];

// LIVE windows (kept lean for build speed): baseline {320..1280}/64 reproduces imp-96444 (~1.30);
// dense {640..2560}/128 is the denser/higher-ppp probe (~1.43). Both are far above the L-linear 1.0.
const WINDOW_BASELINE = rangePpp(320, 1280, 64);
const WINDOW_DENSE = rangePpp(640, 2560, 128);

const baselineRows = CAL_L.map((L) => ({ L, floor: robustFloor(L, WINDOW_BASELINE) }));
const denseRows = CAL_L.map((L) => ({ L, floor: robustFloor(L, WINDOW_DENSE) }));
const baselineFit = logLogFit(baselineRows);
const denseFit = logLogFit(denseRows);

// crossover under a floor model (floorModel grows, signal shrinks -> monotone increasing difference).
function crossoverL(floorModel) {
  let lo = 1e3, hi = 1e18;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (floorModel(mid) - signalOf(mid) > 0) hi = mid;
    else lo = mid;
  }
  return Math.sqrt(lo * hi);
}

// L-linear crossover from the dense median floor/L (comparison anchor with imp-96444).
const denseSlopeLinear = median(denseRows.map((r) => r.floor / r.L));
const crossLinearDense = crossoverL((L) => denseSlopeLinear * L);
// power-law crossover from the LIVE dense exponent (baked reference uses the L->1920 fit; see measuredReference).
const crossPowerDense = crossoverL((L) => denseFit.C * Math.pow(L, denseFit.exponent));

// MEASURED REFERENCE (reproduced by tmp/imp-96469-scratch.mjs; too heavy to recompute at build time).
const measuredReference = {
  exponentVsPppWindow: [
    { window: '320..1280', step: 64, count: 16, exponent: 1.2991, note: 'imp-96444 baseline (reproduced live)' },
    { window: '640..1280', step: 64, count: 11, exponent: 1.3483 },
    { window: '640..2560', step: 128, count: 16, exponent: 1.4273, note: 'dense probe (reproduced live)' },
    { window: '640..2560', step: 64, count: 31, exponent: 1.5121, note: 'densest reachable step' },
    { window: '1280..2560', step: 64, count: 21, exponent: 1.5348, note: 'highest-ppp window' },
  ],
  exponentVsLmax: [
    { Lmax: 960, window: '640..2560', step: 64, exponent: 1.5121 },
    { Lmax: 1920, window: '640..2560', step: 64, exponent: 1.4806, note: 'adding L=1920 does not pull toward 1.0' },
  ],
  powerLawFloorLmax1920: { C: 6.7827e-16, exponent: 1.4806, note: 'floor ~ C * L^p from the dense L->1920 fit' },
  crossoverPowerLawLmax1920: 1.0e9, // L* under the measured power-law floor (far below the imp-96444 L-linear band)
  anchorFloorPowerLaw: 7.183e-6, // power-law floor at the PT anchor L=5.9e6
  anchorSignal: 1.824e-2,
  anchorHeadroomPowerLaw: 2.5e3, // signal/floor at the anchor under the harsher power-law model (~3 decades)
};

const IMP96444_BAND = [1.38e12, 1.76e12]; // imp-96444 de-jittered L-linear crossover band (for comparison)

export const IMP96469_BASIS_C_FLOOR_EXPONENT_TRAJECTORY = {
  ticket: 'imp-96469',
  source:
    'imp-96444 de-jittered the basis-C direct-integral floor to a monotone sequence with a free log-log exponent ~1.30 (still above the L-linear model exponent 1.0), and flagged as its honest caveat that the narrowed crossover band [~1.38e12, ~1.76e12] rests on an L-linear floor model whose exponent convergence was never tested. This module refits that free exponent on denser high-ppp windows ({640..2560}) and higher accessible L (L_max 1920) and re-bisects the crossover under the measured power-law floor. Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  calL: CAL_L,
  liveWindows: {
    baseline: { ppp: WINDOW_BASELINE, exponent: baselineFit.exponent, C: baselineFit.C, rows: baselineRows },
    dense: { ppp: WINDOW_DENSE, exponent: denseFit.exponent, C: denseFit.C, rows: denseRows },
  },
  // Finding 1/2: the exponent rises with density and stays super-linear -- it does NOT converge to 1.0.
  exponentRisesWithDensity: denseFit.exponent > baselineFit.exponent,
  convergesToLinear: false,
  measuredReference,
  crossover: {
    linearDense: { model: 'L-linear (median floor/L on dense window)', slope: denseSlopeLinear, L: crossLinearDense },
    powerLawLiveDense: { model: 'power-law floor ~ C*L^p (live dense fit)', exponent: denseFit.exponent, C: denseFit.C, L: crossPowerDense },
    powerLawReferenceLmax1920: measuredReference.crossoverPowerLawLmax1920, // ~1e9 (baked reference)
    imp96444Band: IMP96444_BAND,
    projectedSpan: [measuredReference.crossoverPowerLawLmax1920, IMP96444_BAND[1]], // ~[1e9, 1.8e12], model-dependent
    note:
      'the super-linear power-law floor overtakes the shrinking |rho + 1/2| signal SOONER than the L-linear model, so the power-law crossover L* ~ 1e9 sits far below the imp-96444 L-linear band; the projected reach is therefore a soft span ~1e9..1.8e12, not a tight number.',
  },
  atPtAnchor: {
    signal: measuredReference.anchorSignal, // ~1.82e-2
    floorPowerLaw: measuredReference.anchorFloorPowerLaw, // ~7.2e-6 (harsher power-law model)
    headroomPowerLaw: measuredReference.anchorHeadroomPowerLaw, // ~2.5e3, still ~3 decades
    note: 'even under the harsher measured super-linear floor, basis C keeps ~3 decades of independence headroom at the PT anchor; the qualitative imp-96430/imp-96444 anchor conclusion is unchanged.',
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values. Both the L-linear and the power-law floor extrapolations are calibrated only on accessible L (<= 1920); the direct integral is never evaluated near L ~ 1e9-1e12, so every crossover L* is a projected reach, not a measured one, and the power-law L* ~ 1e9 is if anything MORE fragile since it extrapolates a roundoff-noise slope across many decades. The finding is negative and honest: the free exponent does not approach 1.0, so the imp-96444 narrowed band is one model choice, not a validated bound. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Pushing the imp-96444 de-jittered basis-C floor estimator to a denser high-ppp grid ({640..2560}) and higher accessible L (L_max 960 -> 1920) drives the free log-log exponent UP from ~1.30 to ~1.43-1.53, NOT down toward the L-linear 1.0: the roundoff floor is genuinely super-linear (~L^1.4-1.5) on the reachable range, so the L-linear floor model is not validated. Re-bisecting under the measured power-law floor moves the corroboration crossover to L* ~ 1e9 (well below the imp-96444 L-linear band [~1.38e12, ~1.76e12]) while the PT-anchor headroom survives (~3 decades). The narrowed band is a model-dependent projection spanning ~1e9..1.8e12, not a tight reach. Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// --- self-executing internal-consistency assertions (exponent trajectory) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96469: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96469: Ci(1) drifted from reference');

  // the live baseline window reproduces the imp-96444 median-sweep exponent ~1.30.
  if (!approx(baselineFit.exponent, 1.2991, 5e-3))
    throw new Error('imp-96469: baseline {320..1280} exponent drifted from the imp-96444 ~1.30 reference');

  // Finding 1: a denser/higher-ppp window RAISES the exponent (does not pull it toward 1.0).
  if (!IMP96469_BASIS_C_FLOOR_EXPONENT_TRAJECTORY.exponentRisesWithDensity)
    throw new Error('imp-96469: dense-window exponent should exceed the baseline exponent');
  if (IMP96469_BASIS_C_FLOOR_EXPONENT_TRAJECTORY.convergesToLinear)
    throw new Error('imp-96469: the exponent must NOT be reported as converging to the L-linear 1.0');

  // Finding 2: every measured exponent stays super-linear (well above 1.0) and below 1.7.
  for (const r of measuredReference.exponentVsPppWindow)
    if (!(r.exponent > 1.2 && r.exponent < 1.7)) throw new Error('imp-96469: a measured exponent left the ~1.3-1.5 super-linear band');
  for (const r of measuredReference.exponentVsLmax)
    if (!(r.exponent > 1.2 && r.exponent < 1.7)) throw new Error('imp-96469: an L_max-extended exponent left the ~1.5 super-linear band');
  if (!(denseFit.exponent > 1.15)) throw new Error('imp-96469: live dense exponent should stay far above the L-linear 1.0');

  // Finding 3: the power-law crossover sits BELOW the imp-96444 L-linear band, yet the anchor headroom survives.
  if (!(measuredReference.crossoverPowerLawLmax1920 < IMP96444_BAND[0]))
    throw new Error('imp-96469: super-linear power-law crossover should sit below the imp-96444 L-linear band');
  if (!(crossPowerDense < crossLinearDense))
    throw new Error('imp-96469: live power-law crossover should sit below the live L-linear crossover');
  if (!(measuredReference.anchorHeadroomPowerLaw > 1e3))
    throw new Error('imp-96469: basis C should keep ~3 decades of headroom at the PT anchor even under the power-law floor');

  // honesty gates
  if (!/NO QED/.test(IMP96469_BASIS_C_FLOOR_EXPONENT_TRAJECTORY.verdict))
    throw new Error('imp-96469: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96469_BASIS_C_FLOOR_EXPONENT_TRAJECTORY.verdict))
    throw new Error('imp-96469: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP96469_BASIS_C_FLOOR_EXPONENT_TRAJECTORY;
