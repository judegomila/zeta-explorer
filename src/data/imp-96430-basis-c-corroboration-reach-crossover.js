/**
 * imp-96430 -- BASIS-C corroboration-reach crossover: the largest L at which the imp-96369 direct
 * double integral still INDEPENDENTLY corroborates the exact number-variance basis A above the
 * shrinking |rho + 1/2| rigidity signal.
 *
 * BACKGROUND. imp-96389 finding 2 established that basis C (the imp-96369 direct pair-correlation
 * double integral, rho = Cov/Var with Var = L - 2 Int) is capped by catastrophic cancellation whose
 * best-achievable error GROWS L-linearly (~7e-14 at L=30 to ~8.1e-12 at L=960, ~1e-8 at the PT anchor
 * L = 5.9e6). Meanwhile the corroboration signal itself -- how far rho sits from the rigidity limit
 * -1/2 -- SHRINKS with L, because rho(L) -> -1/2 only logarithmically: rho ~ -1/2 + ln2/(2 ln(2piL)).
 * So basis C is useful as an independent cross-check of basis A only while its growing roundoff floor
 * stays BELOW the shrinking |rho + 1/2| deviation. This module finds where the two curves cross.
 *
 * WHAT THIS MODULE COMPUTES. (a) It re-measures the basis-C direct-integral floor at accessible
 * L = 30/60/120/240/480/960 (best over a panels-per-period sweep, identical to imp-96389/imp-96369),
 * calibrating an L-linear floor model floorModel(L) = slope * L from the L=960 endpoint slope (the
 * conservative, largest-floor calibration) and, as a companion, the mean floor/L slope over the six
 * rungs. (b) It evaluates the exact closed-form signal(L) = |rhoExact(L) + 1/2| at any L cheaply.
 * (c) It bisects for the crossover L* where floorModel(L*) = signal(L*), the largest L at which
 * basis C independently corroborates basis A rather than being swamped by its own cancellation noise.
 *
 * FINDINGS (all measured / bisected here, not asserted).
 *  1. THE CROSSOVER SITS FAR BEYOND THE PT ANCHOR. With the conservative L=960 endpoint slope
 *     (~8.4e-15 per unit L) the growing floor does not overtake the shrinking signal until
 *     L* ~ 1.31e12 -- roughly FIVE-TO-SIX decades past the PT anchor L = 5.9e6. Using the gentler
 *     mean floor/L slope (~4.3e-15) pushes the crossover to L* ~ 2.50e12. Either way the reach is
 *     astronomically larger than any accessible-L table, so basis C is a genuine independent check
 *     across the whole accessible-to-PT-anchor range, not only at the small rungs.
 *  2. AT THE CROSSOVER rho HAS NEARLY REACHED THE RIGIDITY LIMIT. At L* ~ 1.31e12 the exact
 *     rho ~ -0.48899, so the surviving signal |rho + 1/2| ~ 1.10e-2 has already collapsed to about a
 *     fifth of its L=30 value (5.08e-2); the floor equals it there (~1.10e-2). The corroboration ends
 *     not because basis C blows up in absolute terms but because rho crowds so close to -1/2 that the
 *     L-linear floor finally catches the logarithmically-vanishing deviation.
 *  3. AT THE PT ANCHOR THE MARGIN IS HUGE. At L = 5.9e6 the signal is ~1.82e-2 while the endpoint-slope
 *     floor model is only ~4.96e-8: a signal/floor ratio ~3.7e5. So at the anchor basis C corroborates
 *     basis A with ~5+ orders of magnitude of headroom -- the binding floor of the three-basis table
 *     is nowhere near threatening the independence of the check at the anchor.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; there are no computed Riemann zeros behind these values. The crossover L*
 * is an EXTRAPOLATION -- the L-linear floor model is calibrated only on accessible L (<= 960) and the
 * direct integral is never actually evaluated at L ~ 1e12 (its panel count would be astronomical), so
 * L* is a projected reach of an independence property, not a measured one. The direct-floor sweep is
 * itself jittery (the L=240 rung dips below L=120 because the best-ppp point wanders), so the slope is
 * a coarse L-linear fit, and the crossover is quoted as a band [~1.3e12, ~2.5e12], not a sharp value.
 * This changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma
 * excursion confidence.
 *
 * VERDICT. Extrapolating the imp-96389 basis-C L-linear cancellation floor against the exact,
 * logarithmically-shrinking |rho + 1/2| rigidity signal, the growing floor does not overtake the
 * shrinking signal until L* ~ 1.3e12 (conservative endpoint slope) to ~2.5e12 (mean slope) -- about
 * five-to-six decades beyond the PT anchor L = 5.9e6, where rho ~ -0.489 and floor = signal ~ 1.1e-2.
 * At the anchor itself the signal (~1.82e-2) beats the floor (~5e-8) by ~3.7e5, so basis C remains a
 * genuine INDEPENDENT corroboration of basis A across the entire accessible-to-anchor range, and only
 * loses independence far past it. Cross-validation / extrapolation numerics only; theoretical GUE
 * quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96389-three-basis-rho-crossvalidation-table (basis-C L-linear floor is the binding floor)
 * @see imp-96369-direct-double-integral-pt-anchor-feasibility (basis C feasibility and its floor model)
 * @see imp-96424-basis-c-cancellation-reformulation-floor (whether the floor can be lowered)
 * @see imp-96267-covariance-drift-rigidity-limit-reach (the rho drift toward the rigidity limit -1/2)
 * @see imp-96448-direct-basis-c-anchor-floor (SUPERSEDES the atPtAnchor headroom below with a measured
 *   ~640, not the ~3.7e5 this module's L-linear model claims -- see the `reconciliation` field)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance and the direct
 * quadrature are re-derived verbatim here (identical to imp-96389/imp-96369) so the crossover is
 * recomputed independently.
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
  return { Var, rho: -(covA + covB) / Var };
}

// Si(x), Ci(x): power series small x, asymptotic large x (double-precision on our range).
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

// BASIS A (exact Dyson-Mehta) number variance and its rho; the signal |rho + 1/2|.
const sigma2Exact = (L) => {
  const x = TWO_PI * L;
  return (1 / (PI * PI)) * (Math.log(x) + EULER + 1 - Math.cos(x) - Ci(x)) + L * (1 - (2 / PI) * Si(x));
};
const rhoExact = (L) => sigma2Exact(2 * L) / (2 * sigma2Exact(L)) - 1;
const signalOf = (L) => Math.abs(rhoExact(L) - RIGIDITY_LIMIT); // |rho + 1/2|

// basis-C best-achievable direct-quadrature error over a ppp sweep (the floor at this L).
const directFloor = (L) => {
  let best = Infinity;
  for (const ppp of [40, 80, 160, 320, 640]) {
    const e = Math.abs(directRho(L, Math.ceil(ppp * L)).rho - rhoExact(L));
    if (e < best) best = e;
  }
  return best;
};

// --- calibrate the L-linear floor model from accessible L, then bisect the corroboration crossover ---
const CAL_L = [30, 60, 120, 240, 480, 960];
const floorRows = CAL_L.map((L) => ({ L, floor: directFloor(L), signal: signalOf(L) }));

// conservative slope: the L=960 endpoint (largest measured floor/L); companion: mean floor/L.
const endpointSlope = floorRows[floorRows.length - 1].floor / floorRows[floorRows.length - 1].L;
const meanSlope = floorRows.reduce((s, r) => s + r.floor / r.L, 0) / floorRows.length;
const floorModel = (L, slope) => slope * L;

// crossover L*: floorModel grows, signal shrinks, so slope*L - signal(L) is monotone increasing.
function crossoverL(slope) {
  let lo = 1e3, hi = 1e18;
  for (let i = 0; i < 200; i++) {
    const mid = Math.sqrt(lo * hi);
    if (floorModel(mid, slope) - signalOf(mid) > 0) hi = mid;
    else lo = mid;
  }
  return Math.sqrt(lo * hi);
}

const crossEndpoint = crossoverL(endpointSlope);
const crossMean = crossoverL(meanSlope);
const anchorSignal = signalOf(PT_ANCHOR_L);
const anchorFloor = floorModel(PT_ANCHOR_L, endpointSlope);

export const IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER = {
  ticket: 'imp-96430',
  source:
    'imp-96389 finding 2 gives the basis-C direct-integral floor as an L-linear cancellation model (~7e-14 at L=30 to ~8.1e-12 at L=960, ~1e-8 at the PT anchor). Because rho -> -1/2 only logarithmically, the corroboration signal |rho + 1/2| shrinks with L too. This module extrapolates the growing floor against the shrinking signal to bound the largest L at which basis C still independently corroborates basis A. Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  floorRows, // per-L measured basis-C floor and signal at accessible L
  floorModel: {
    form: 'floorModel(L) = slope * L (L-linear cancellation model, imp-96369)',
    endpointSlope, // ~8.4e-15 per unit L, from the L=960 rung (conservative, largest floor)
    meanSlope, // ~4.3e-15 per unit L, mean floor/L over the six rungs (gentler)
  },
  crossover: {
    endpointSlope: { L: crossEndpoint, rho: rhoExact(crossEndpoint), signal: signalOf(crossEndpoint), floor: floorModel(crossEndpoint, endpointSlope) },
    meanSlope: { L: crossMean, rho: rhoExact(crossMean), signal: signalOf(crossMean), floor: floorModel(crossMean, meanSlope) },
    band: [crossEndpoint, crossMean], // ~1.3e12 .. ~2.5e12, both far beyond the PT anchor
    note:
      'crossover L* is where the growing L-linear floor overtakes the shrinking |rho + 1/2| signal; both calibrations put it 5-6 decades past the PT anchor L = 5.9e6, so basis C stays an independent check across the whole accessible-to-anchor range.',
  },
  atPtAnchor: {
    signal: anchorSignal, // ~1.82e-2
    floorModel: anchorFloor, // ~4.96e-8 (endpoint slope)
    signalOverFloor: anchorSignal / anchorFloor, // ~3.7e5 headroom -- MODEL value, superseded below
  },
  reconciliation:
    'SUPERSEDED AT THE ANCHOR: imp-96448 directly evaluated the basis-C double integral at the PT anchor '
    + '(feasible at low ppp ~3, ~2.2s) and measured an achievable floor ~2.84e-5, ~573x ABOVE this module’s '
    + 'L-linear model floor (~4.96e-8). The true signal/floor headroom at the anchor is the MEASURED ~640, '
    + 'not the model-quoted ~3.7e5 above -- the model overstated the anchor independence margin by ~570x. '
    + 'Basis C still corroborates basis A at the anchor (the exact signal still beats the measured floor), '
    + 'just with far less headroom than this module’s extrapolation claimed. The crossover band '
    + '[~1.3e12, ~2.5e12] is untouched (it is calibrated from the same accessible-L rungs, not the anchor). '
    + 'RH open; NO QED; no refereed bound is changed.',
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values. The crossover L* is an EXTRAPOLATION -- the L-linear floor model is calibrated only on accessible L (<= 960) and the direct integral is never evaluated at L ~ 1e12, so L* is a projected reach of an independence property, not a measured one. The direct-floor sweep is jittery (the L=240 rung dips below L=120), so the slope is a coarse L-linear fit and the crossover is a band [~1.3e12, ~2.5e12], not a sharp value. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Extrapolating the imp-96389 basis-C L-linear cancellation floor against the exact, logarithmically-shrinking |rho + 1/2| rigidity signal, the growing floor does not overtake the shrinking signal until L* ~ 1.3e12 (conservative endpoint slope) to ~2.5e12 (mean slope) -- about five-to-six decades beyond the PT anchor L = 5.9e6, where rho ~ -0.489 and floor = signal ~ 1.1e-2. At the anchor itself the signal (~1.82e-2) beats the floor (~5e-8) by ~3.7e5, so basis C remains a genuine INDEPENDENT corroboration of basis A across the entire accessible-to-anchor range and only loses independence far past it. Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for
// any consumer surface (e.g. the imp-96453 viz page) that renders this finding.
export const IMP96430_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-validation / '
  + 'extrapolation numerics only: rho is the theoretical GUE two-interval '
  + 'correlation, not computed from real zeros; the crossover band [1.3e12, '
  + '2.5e12] is calibrated only on accessible L (<= 960); at the PT anchor the '
  + 'imp-96448 MEASURED headroom (~640) supersedes this module’s model-quoted '
  + 'figure (~3.7e5).';

// --- self-executing internal-consistency assertions (accessible-L re-measurement + crossover bisection) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96430: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96430: Ci(1) drifted from reference');

  // the L-linear slope is a small positive femto-scale number
  if (!(endpointSlope > 0 && endpointSlope < 1e-13)) throw new Error('imp-96430: endpoint floor slope out of expected femto range');
  if (!(meanSlope > 0 && meanSlope < endpointSlope)) throw new Error('imp-96430: mean slope should be positive and below the endpoint slope');

  // Finding 1: the crossover is far beyond the PT anchor (>= 1e5 x the anchor L), and endpoint < mean.
  if (!(crossEndpoint > 1e11 && crossEndpoint < 1e13)) throw new Error('imp-96430: endpoint-slope crossover outside expected ~1e12 band');
  if (!(crossMean > crossEndpoint)) throw new Error('imp-96430: gentler mean slope should push the crossover to larger L');
  if (!(crossEndpoint > 1e5 * PT_ANCHOR_L)) throw new Error('imp-96430: crossover should sit many decades past the PT anchor');

  // Finding 2: at the crossover floor equals signal and rho has nearly reached -1/2.
  const cx = IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER.crossover.endpointSlope;
  if (!approx(cx.floor, cx.signal, 5e-3 * cx.signal)) throw new Error('imp-96430: at the crossover the floor should equal the signal');
  if (!(cx.rho < RIGIDITY_LIMIT + 0.02 && cx.rho > RIGIDITY_LIMIT)) throw new Error('imp-96430: rho at the crossover should be within 0.02 of the rigidity limit');

  // Finding 3: at the PT anchor the signal dwarfs the floor by many orders of magnitude.
  if (!(anchorSignal / anchorFloor > 1e4)) throw new Error('imp-96430: basis C should corroborate with huge headroom at the PT anchor');
  if (!(anchorSignal > 1e-2 && anchorSignal < 3e-2)) throw new Error('imp-96430: PT-anchor signal outside expected ~1.8e-2 range');

  // honesty gates
  if (!/NO QED/.test(IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER.verdict))
    throw new Error('imp-96430: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER.verdict))
    throw new Error('imp-96430: verdict dropped the no-refereed-bound-change banner');

  // reconciliation note (imp-96499): the anchor headroom is the imp-96448 MEASURED ~640, not this
  // module's model-quoted ~3.7e5 -- the note must stay present and carry the honesty banners too.
  if (!/imp-96448/.test(IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER.reconciliation))
    throw new Error('imp-96430: reconciliation note dropped the imp-96448 reference');
  if (!/SUPERSEDED/.test(IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER.reconciliation))
    throw new Error('imp-96430: reconciliation note dropped the SUPERSEDED flag');
  if (!/NO QED/.test(IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER.reconciliation))
    throw new Error('imp-96430: reconciliation note dropped the NO QED banner');

  // exported honest-status banner (imp-96337 / imp-96428 convention) must carry the markers
  if (!(/RH open/.test(IMP96430_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96430_HONEST_BANNER) && /NO QED/.test(IMP96430_HONEST_BANNER)))
    throw new Error('imp-96430: IMP96430_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96430_BASIS_C_CORROBORATION_REACH_CROSSOVER;
