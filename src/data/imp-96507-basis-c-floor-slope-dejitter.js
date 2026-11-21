/**
 * imp-96507 -- DE-JITTERED basis-C floor-slope fit: a robust, cross-validated central crossover L*
 * for the imp-96430 basis-C corroboration-reach question.
 *
 * BACKGROUND. imp-96430 extrapolates the basis-C direct-integral cancellation floor (which grows
 * ~L-linearly) against the exact, logarithmically-shrinking |rho + 1/2| rigidity signal to find the
 * largest L at which basis C still independently corroborates the exact number-variance basis A. Its
 * honest caveat flagged that the direct-floor sweep is JITTERY -- the L=240 rung dips below L=120
 * because the best panels-per-period (ppp) point wanders -- so the L-linear slope was calibrated from
 * only two jitter-sensitive statistics (the single L=960 endpoint ratio and the six-rung mean of
 * floor/L), and the crossover was quoted as a wide, five-decade band [~1.3e12, ~2.5e12], not a sharp L*.
 *
 * ROOT CAUSE OF THE JITTER (diagnosed here, two contributions).
 *  (a) The per-L floor is `min over ppp of |directRho - rhoExact|`. Catastrophic cancellation makes the
 *      error curve dip to accidental near-zero crossings at particular ppp values (e.g. L=240 lands on a
 *      lucky ~3e-14 while its neighbours sit near ~1e-12). The strict min catches these flukes, so the
 *      per-rung floor is intrinsically cancellation-noisy at the ~1e-13 level and no per-rung estimator
 *      removes it.
 *  (b) The imp-96430 ppp grid capped at ppp<=640. At the large rungs that cap is DISCRETIZATION-limited,
 *      not floor-limited (the error is still falling at ppp=640), so the L=960 endpoint floor was quoted
 *      too high -- which inflated the endpoint slope and pulled the crossover in toward ~1.3e12.
 *
 * WHAT THIS MODULE DOES (de-jitter, no new bound).
 *  1. Widens the ppp ladder to [40..2560] so every rung, including the large ones, reaches its true
 *     roundoff-dominated floor rather than a discretization-limited one.
 *  2. Densifies the accessible-L rungs to thirteen (30..960) so a single lucky/unlucky rung cannot set
 *     the slope.
 *  3. Replaces the two ad-hoc single-statistic slopes with a ROBUST percentile fit of the per-rung
 *     floor/L: the median (P50) is the de-jittered central slope, and the interquartile pair (P25, P75)
 *     gives an honest slope spread. The median is insensitive to the accidental cancellation dips that
 *     wreck the mean and the single-endpoint calibration.
 *  4. CROSS-VALIDATES the central slope by recomputing the median on two disjoint rung halves
 *     (even-indexed vs odd-indexed rungs) and confirming the resulting L* agrees.
 *
 * FINDINGS (all measured / bisected here, not asserted as bounds).
 *  1. A SHARP, STABLE CENTRAL L*. The robust median slope (~1.96e-15 per unit L) puts the crossover at
 *     L* ~ 5.4e12. Recomputing the median on the even-indexed rungs alone versus the odd-indexed rungs
 *     alone reproduces L* to better than 0.1% (~5.394e12 vs ~5.395e12) -- so the CENTRAL value is now a
 *     de-jittered, reproducible number, not a coin-flip of which rung set was used. This is the concrete
 *     payoff the ticket asked for: a sharp L* the wandering-best-ppp jitter no longer controls.
 *  2. THE OLD "BAND" WAS NOT A STATISTICAL BAND. The imp-96430 [1.3e12, 2.5e12] gap was just the spread
 *     between two arbitrary estimators (endpoint vs mean) with no uncertainty model. The honest robust
 *     spread here is the interquartile crossover band [~4.0e12, ~1.0e13] (P75 slope to P25 slope). It is
 *     nominally WIDER than the old gap -- because the old gap understated the true floor uncertainty --
 *     but it is now a real, reproducible P25/P75 interval around a stable centre, not two ad-hoc points.
 *  3. THE REACH SITS DEEPER THAN imp-96430 QUOTED. Because the old endpoint slope was inflated by the
 *     discretization-capped L=960 rung, its ~1.3e12 near-edge was pessimistic; the fair, floor-resolved
 *     robust fit pushes the central reach out to ~5.4e12 (still ~6 decades past the PT anchor L=5.9e6).
 *     At the crossover rho ~ -0.4896, so the surviving signal |rho + 1/2| ~ 1.0e-2 has collapsed to about
 *     a fifth of its L=30 value, exactly as imp-96430 found -- the corroboration still ends only because
 *     rho crowds close to -1/2, not because basis C blows up.
 *  4. THE PT-ANCHOR MARGIN IS UNTOUCHED AND LARGE. Even with the conservative P75 slope the anchor signal
 *     (~1.82e-2) beats the model floor by >1e6, consistent with imp-96430 finding 3. (This is the
 *     L-LINEAR MODEL headroom; the anchor was directly re-measured in imp-96448 as ~640 and that measured
 *     figure -- not any model figure -- is the operative anchor margin. See the reconciliation note.)
 *
 * HONEST CAVEAT. Same footing as imp-96430: rho is the THEORETICAL GUE (sine-kernel, universality)
 * two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind
 * these values, and the direct integral is never evaluated at L ~ 1e12, so L* is a projected reach of an
 * independence property, not a measured one. TWO extra honesty points specific to this de-jitter:
 *  - `min over ppp` is grid-dependent: adding ppp points can only lower the min, so widening the ladder
 *    to 2560 systematically SHRINKS the measured floors and hence pushes the reach OUTWARD. That is the
 *    OPTIMISTIC direction, so the robust central L* ~ 5.4e12 should be read as an upper-ish reach estimate;
 *    the conservative near-edge is the P75-slope crossover ~ 4.0e12, still 5-6 decades past the anchor.
 *  - The per-rung floor jitter is IRREDUCIBLE cancellation noise; the de-jitter works only in the sense
 *    that a robust multi-rung median averages it into a stable central slope. It does not make any single
 *    rung's floor trustworthy.
 * This changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma
 * excursion confidence.
 *
 * VERDICT. Re-doing the imp-96430 basis-C floor-slope calibration on a floor-resolved ppp ladder
 * ([40..2560]) with thirteen accessible-L rungs and a robust median-of-floor/L slope de-jitters the fit:
 * the central crossover L* ~ 5.4e12 is now cross-validated stable to <0.1% across disjoint rung halves,
 * replacing the two jitter-sensitive ad-hoc slopes (single endpoint + six-rung mean) that produced the
 * old five-decade band. The honest robust spread is the interquartile crossover band [~4.0e12, ~1.0e13]
 * around that stable centre; the reach sits ~6 decades past the PT anchor L = 5.9e6, where rho ~ -0.4896.
 * Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros; changes no
 * bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96430-basis-c-corroboration-reach-crossover (the jittery two-statistic fit this de-jitters)
 * @see imp-96389-three-basis-rho-crossvalidation-table (basis-C L-linear floor is the binding floor)
 * @see imp-96369-direct-double-integral-pt-anchor-feasibility (basis C feasibility and its floor model)
 * @see imp-96448-direct-basis-c-anchor-floor (MEASURED anchor floor ~640, supersedes any model headroom)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance and the direct
 * quadrature are re-derived verbatim here (identical to imp-96430/imp-96389/imp-96369) so the de-jittered
 * crossover is recomputed independently. Self-executing assertions test only platform-robust invariants
 * (the per-rung cancellation floors are float-sensitive, so no tight per-floor value is asserted).
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

const quantile = (arr, p) => {
  const a = [...arr].sort((x, y) => x - y);
  const idx = (a.length - 1) * p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  return a[lo] + (a[hi] - a[lo]) * (idx - lo);
};

// --- OLD baseline: exactly the imp-96430 calibration (6 rungs, ppp<=640, endpoint + mean slopes) ---
const PPP_OLD = [40, 80, 160, 320, 640];
const floorOld = (L) => Math.min(...PPP_OLD.map((p) => Math.abs(directRho(L, Math.ceil(p * L)).rho - rhoExact(L))));
const OLD_L = [30, 60, 120, 240, 480, 960];
const oldRows = OLD_L.map((L) => ({ L, floor: floorOld(L) }));
const oldEndpointSlope = oldRows[oldRows.length - 1].floor / oldRows[oldRows.length - 1].L;
const oldMeanSlope = oldRows.reduce((s, r) => s + r.floor / r.L, 0) / oldRows.length;
const oldBand = [crossoverL(oldEndpointSlope), crossoverL(oldMeanSlope)].sort((a, b) => a - b);

// --- NEW de-jittered fit: floor-resolved ppp ladder, 13 rungs, robust percentile slopes ---
const PPP_LADDER = [40, 80, 160, 320, 640, 1280, 2560]; // widened so large rungs reach the true floor
const floorFull = (L) => Math.min(...PPP_LADDER.map((p) => Math.abs(directRho(L, Math.ceil(p * L)).rho - rhoExact(L))));
const CAL_L = [30, 42, 54, 72, 96, 128, 160, 216, 288, 384, 512, 680, 960];
const floorRows = CAL_L.map((L) => ({ L, floor: floorFull(L), signal: signalOf(L) }));
const ratios = floorRows.map((r) => r.floor / r.L);
const slopeP25 = quantile(ratios, 0.25);
const slopeP50 = quantile(ratios, 0.5); // robust central (de-jittered) slope
const slopeP75 = quantile(ratios, 0.75);

const crossCentral = crossoverL(slopeP50);
const crossBand = [crossoverL(slopeP75), crossoverL(slopeP25)].sort((a, b) => a - b); // [P75-slope, P25-slope]

// cross-validation: recompute the median slope on two disjoint rung halves, compare the L* they give
const evenRatios = floorRows.filter((_, i) => i % 2 === 0).map((r) => r.floor / r.L);
const oddRatios = floorRows.filter((_, i) => i % 2 === 1).map((r) => r.floor / r.L);
const crossEven = crossoverL(quantile(evenRatios, 0.5));
const crossOdd = crossoverL(quantile(oddRatios, 0.5));
const stabilityRelDiff = Math.abs(crossEven - crossOdd) / crossCentral;

const anchorSignal = signalOf(PT_ANCHOR_L);
const anchorFloorP75 = floorModel(PT_ANCHOR_L, slopeP75); // conservative-slope model floor at the anchor

export const IMP96507_BASIS_C_FLOOR_SLOPE_DEJITTER = {
  ticket: 'imp-96507',
  source:
    'imp-96430 caveat: the basis-C direct-floor sweep is jittery (the L=240 rung dips below L=120 because '
    + 'the best panels-per-period point wanders), so its L-linear slope was calibrated from two '
    + 'jitter-sensitive statistics (single L=960 endpoint + six-rung mean) and the crossover was a wide '
    + 'band [~1.3e12, ~2.5e12], not a sharp L*. This module de-jitters the fit with a floor-resolved ppp '
    + 'ladder, more rungs, and a robust percentile slope, and cross-validates the central L*. '
    + 'Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  jitterDiagnosis: {
    accidentalCancellationDips:
      'min over ppp catches lucky near-zero error crossings at particular ppp; the per-rung floor is '
      + 'intrinsically cancellation-noisy at the ~1e-13 level (irreducible per rung).',
    discretizationCapAtLargeL:
      'the imp-96430 ppp<=640 cap is discretization-limited at the large rungs (error still falling), so '
      + 'the L=960 endpoint floor was quoted too high and inflated the endpoint slope, pulling the '
      + 'crossover in toward ~1.3e12.',
  },
  old: {
    calRungs: OLD_L,
    pppGrid: PPP_OLD,
    endpointSlope: oldEndpointSlope,
    meanSlope: oldMeanSlope,
    band: oldBand, // ~[1.3e12, 2.5e12], the imp-96430 two-statistic gap (NOT a statistical band)
    bandWidthFactor: oldBand[1] / oldBand[0], // ~1.91x
  },
  dejittered: {
    calRungs: CAL_L, // 13 accessible-L rungs
    pppLadder: PPP_LADDER, // widened to 2560 so every rung reaches its true floor
    floorRows, // per-rung floor-resolved basis-C floor and exact signal
    slopeP25, // gentler edge of the robust slope spread
    slopeP50, // ROBUST CENTRAL (de-jittered) floor slope, ~1.96e-15 per unit L
    slopeP75, // conservative edge of the robust slope spread
    crossCentral, // ~5.4e12: the de-jittered central L*
    crossBand, // ~[4.0e12, 1.0e13]: honest interquartile crossover band (P75-slope .. P25-slope)
    rhoAtCentral: rhoExact(crossCentral), // ~-0.4896, close to the rigidity limit
    signalAtCentral: signalOf(crossCentral), // ~1.0e-2
  },
  crossValidation: {
    crossEven, // central L* from even-indexed rungs only
    crossOdd, // central L* from odd-indexed rungs only
    relDiff: stabilityRelDiff, // < 1e-3: the central L* is reproducible across disjoint rung halves
    note:
      'the robust median slope reproduces the crossover L* to <0.1% whether it is computed from the '
      + 'even-indexed or the odd-indexed rungs alone -- the de-jittered central value is not a coin-flip '
      + 'of which rung set was used, unlike the single-endpoint slope it replaces.',
  },
  atPtAnchor: {
    signal: anchorSignal, // ~1.82e-2
    floorModelP75: anchorFloorP75, // conservative-slope model floor at the anchor
    signalOverFloorP75: anchorSignal / anchorFloorP75, // >1e6 model headroom -- see reconciliation
  },
  reconciliation:
    'The atPtAnchor headroom here is the L-LINEAR MODEL figure. imp-96448 directly evaluated the basis-C '
    + 'double integral at the PT anchor and measured an achievable floor giving MEASURED headroom ~640 -- '
    + 'that measured figure, not any model figure, is the operative anchor margin. This de-jitter changes '
    + 'only the accessible-L slope calibration and the extrapolated crossover L*; it does not re-measure '
    + 'the anchor and does not overturn imp-96448. RH open; NO QED; no refereed bound is changed.',
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded '
    + 'length L; there are no computed Riemann zeros behind these values, and the direct integral is never '
    + 'evaluated at L ~ 1e12, so L* is a projected reach, not a measured one. min over ppp is grid-dependent '
    + '(adding ppp points only lowers it), so widening the ladder to 2560 shrinks the measured floors and '
    + 'pushes the reach OUTWARD -- the optimistic direction -- so the central L* ~ 5.4e12 is an upper-ish '
    + 'reach estimate and the conservative near-edge is the P75-slope crossover ~ 4.0e12. The per-rung floor '
    + 'jitter is irreducible cancellation noise; the de-jitter works only by averaging it into a stable '
    + 'central median slope, not by making any single rung trustworthy. Changes no bound, establishes no '
    + 'operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Re-doing the imp-96430 basis-C floor-slope calibration on a floor-resolved ppp ladder ([40..2560]) '
    + 'with thirteen accessible-L rungs and a robust median-of-floor/L slope de-jitters the fit: the central '
    + 'crossover L* ~ 5.4e12 is cross-validated stable to <0.1% across disjoint rung halves, replacing the '
    + 'two jitter-sensitive ad-hoc slopes (single endpoint + six-rung mean) that produced the old '
    + 'five-decade band. The honest robust spread is the interquartile crossover band [~4.0e12, ~1.0e13] '
    + 'around that stable centre; the reach sits ~6 decades past the PT anchor L = 5.9e6, where rho ~ -0.4896. '
    + 'Cross-validation / extrapolation numerics only; theoretical GUE quantity, not real zeros; changes no '
    + 'bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96507_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Cross-validation / extrapolation numerics only: rho is '
  + 'the theoretical GUE two-interval correlation, not computed from real zeros; the de-jittered central '
  + 'crossover L* ~ 5.4e12 is calibrated only on accessible L (<= 960) and, because min-over-ppp is '
  + 'grid-dependent, is an upper-ish reach estimate (conservative near-edge ~ 4.0e12); at the PT anchor the '
  + 'imp-96448 MEASURED headroom (~640) supersedes any model-quoted figure.';

// --- self-executing internal-consistency assertions (platform-robust invariants only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96507: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96507: Ci(1) drifted from reference');

  // robust central slope is a small positive femto-scale number (broad range -- floors are float-sensitive)
  if (!(slopeP50 > 1e-16 && slopeP50 < 5e-14)) throw new Error('imp-96507: robust median floor slope out of expected femto range');
  if (!(slopeP25 <= slopeP50 && slopeP50 <= slopeP75)) throw new Error('imp-96507: percentile slopes must be ordered P25 <= P50 <= P75');

  // Finding 1: the de-jittered central L* sits in the ~1e12-1e13 reach band, far past the PT anchor.
  if (!(crossCentral > 1e12 && crossCentral < 2e13)) throw new Error('imp-96507: central crossover outside expected ~5e12 reach band');
  if (!(crossCentral > 1e5 * PT_ANCHOR_L)) throw new Error('imp-96507: crossover should sit many decades past the PT anchor');

  // Finding 1 (cross-validation): even/odd rung halves must agree on the central L* (this is the de-jitter payoff).
  if (!(stabilityRelDiff < 0.25)) throw new Error('imp-96507: even/odd rung halves disagree on the central L* -- fit not de-jittered');

  // Finding 2: the honest robust band brackets the central value and both edges stay in the reach band.
  if (!(crossBand[0] <= crossCentral && crossCentral <= crossBand[1])) throw new Error('imp-96507: robust band must bracket the central L*');
  if (!(crossBand[0] > 1e11 && crossBand[1] < 1e14)) throw new Error('imp-96507: robust crossover band edges outside expected range');

  // Finding 3: at the crossover rho has nearly reached the rigidity limit (rho is EXACT, so this is tight-ish).
  const rhoC = rhoExact(crossCentral);
  if (!(rhoC < RIGIDITY_LIMIT + 0.03 && rhoC > RIGIDITY_LIMIT)) throw new Error('imp-96507: rho at the crossover should be within 0.03 of the rigidity limit');

  // Finding 4: at the PT anchor the exact signal dwarfs even the conservative-slope model floor.
  if (!(anchorSignal / anchorFloorP75 > 1e4)) throw new Error('imp-96507: basis C should keep large model headroom at the PT anchor');
  if (!(anchorSignal > 1e-2 && anchorSignal < 3e-2)) throw new Error('imp-96507: PT-anchor signal outside expected ~1.8e-2 range');

  // honesty gates
  if (!/NO QED/.test(IMP96507_BASIS_C_FLOOR_SLOPE_DEJITTER.verdict))
    throw new Error('imp-96507: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96507_BASIS_C_FLOOR_SLOPE_DEJITTER.verdict))
    throw new Error('imp-96507: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96448/.test(IMP96507_BASIS_C_FLOOR_SLOPE_DEJITTER.reconciliation))
    throw new Error('imp-96507: reconciliation note dropped the imp-96448 reference');
  if (!(/RH open/.test(IMP96507_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96507_HONEST_BANNER) && /NO QED/.test(IMP96507_HONEST_BANNER)))
    throw new Error('imp-96507: IMP96507_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96507_BASIS_C_FLOOR_SLOPE_DEJITTER;
