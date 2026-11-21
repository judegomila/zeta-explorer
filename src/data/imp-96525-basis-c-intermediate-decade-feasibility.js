/**
 * imp-96525 -- FEASIBILITY of a direct basis-C floor evaluation at an intermediate decade
 * (L ~ 1e8-1e9), between the PT anchor L = 5.9e6 and the imp-96507 projected crossover L* ~ 5.4e12.
 *
 * BACKGROUND. imp-96507 de-jittered the basis-C direct-integral floor slope (robust median
 * floor/L ~ 1.96e-15 per unit L) and projected the corroboration crossover to L* ~ 5.4e12, but
 * its honest caveat is explicit: the direct (brute-quadrature) integral is NEVER evaluated near
 * L ~ 1e12, so L* is a PROJECTED reach of an extrapolation calibrated only on the accessible rungs
 * (L <= 960), not a measured one. This ticket asks the prior question the projection depends on:
 * is a SINGLE direct basis-C floor evaluation feasible at an intermediate decade (L ~ 1e8-1e9), and
 * if so does the achieved floor land on the de-jittered floor-slope line or depart it -- the first
 * test of the extrapolation OFF the anchor.
 *
 * WHAT THIS MODULE DOES (feasibility / measurement only, no new bound).
 *  1. Costs the panel budget. The direct basis-C floor is min-over-ppp of |directRho - rhoExact|,
 *     where directRho does three composite-Simpson integrals over [0,L], [0,L], [L,2L]. The integrand
 *     clusterY(r) = (sin(pi r)/(pi r))^2 oscillates with period 1 in r, so resolving it needs
 *     panels = ceil(ppp * L) per integral -- LINEAR in L. The budget is computed here for L = 1e8, 1e9
 *     at the smallest rung (ppp = 40) and across the full imp-96507 ppp ladder [40..2560].
 *  2. Estimates the double-precision roundoff floor. A composite-Simpson sum over N panels accumulates
 *     ~N floating-point additions; the statistical roundoff growth is ~sqrt(N) * eps. This is compared
 *     against the ~1e-13 cancellation floor the measurement is trying to resolve.
 *  3. Supplies the only feasible in-sample proxy for the extrapolation. Since the direct integral cannot
 *     be run at the intermediate decade, the best available test of whether the floor/L slope drifts with
 *     L is the drift ACROSS the accessible rungs: the median floor/L on the low half (L <= 160) versus
 *     the high half (L > 160). These rungs ARE re-evaluated directly here (small L, feasible).
 *
 * FINDINGS (all measured / costed here, not asserted as bounds).
 *  1. THE DIRECT EVALUATION IS INFEASIBLE ON PANEL BUDGET. At L = 1e8 the smallest rung (ppp = 40) already
 *     needs ~4.0e9 Simpson panels per integral (~1.2e10 clusterY evaluations across the three integrals),
 *     and the full de-jitter ladder [40..2560] needs ~1.5e12; at L = 1e9 those become ~1.2e11 and ~1.5e13.
 *     A single accessible rung in imp-96507 costs ~1e5-1e6 evaluations, so the intermediate decade is
 *     4-7 orders of magnitude more expensive per rung -- outside any single-evaluation budget.
 *  2. IT IS ALSO INFEASIBLE ON PRECISION -- the harder wall. Even setting wall-time aside, the statistical
 *     roundoff floor of an N ~ 4e9-panel Simpson sum is ~sqrt(N) * eps ~ 1.4e-11 at L = 1e8 (worse, ~4.4e-11,
 *     at L = 1e9). That already exceeds the ~1e-13 cancellation floor being measured by ~100x, so the number
 *     the direct integral WOULD return is dominated by accumulated roundoff, not by the true basis-C
 *     cancellation floor. The evaluation is therefore doubly infeasible: even a heroic panel budget returns a
 *     roundoff-limited value that cannot test the de-jittered line.
 *  3. THE EXTRAPOLATION STAYS UNTESTED OFF THE ANCHOR. Because no trustworthy direct floor can be obtained at
 *     L ~ 1e8-1e9 in double precision, the imp-96507 crossover L* ~ 5.4e12 remains a projected reach; this
 *     module confirms rather than removes that caveat. Closing it would need extended-precision (double-double
 *     or Arb) quadrature, which is out of scope for a feasibility pass.
 *  4. THE ONLY FEASIBLE PROXY SHOWS NO STRONG IN-SAMPLE DEPARTURE. The median floor/L across the accessible
 *     rungs rises only mildly from ~1.88e-15 (low half, L <= 160) to ~2.35e-15 (high half, L > 160) -- a
 *     ~1.25x drift over ~1.5 decades, well inside the imp-96507 P25/P75 slope spread. So the accessible data
 *     is CONSISTENT with the L-linear floor-slope line and shows no in-sample curvature that would forecast a
 *     departure at 1e8; but a 1.25x-per-1.5-decade proxy cannot certify the line 4+ decades further out, so
 *     this is a weak positive, not corroboration.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for boxes of
 * unfolded length L; there are no computed Riemann zeros behind these values. This is a feasibility/measurement
 * pass: it evaluates NO direct integral at the intermediate decade (it proves that cannot be done usefully in
 * double precision) and changes no bound. The per-rung accessible floors are irreducible cancellation noise at
 * the ~1e-13 level (imp-96507), so the in-sample drift proxy is itself jittery and is read only through robust
 * medians. Establishes no operator positivity; does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. A single direct basis-C floor evaluation at an intermediate decade L ~ 1e8-1e9 is doubly infeasible:
 * the composite-Simpson panel budget scales linearly in L (~1.2e10 to ~1.5e13 integrand evaluations for one
 * rung/ladder), and, more bindingly, the double-precision roundoff floor of that many additions (~1.4e-11 to
 * ~4.4e-11) already swamps the ~1e-13 cancellation floor being measured -- so even a heroic run would return a
 * roundoff-limited value, not a test of the de-jittered line. The imp-96507 crossover L* ~ 5.4e12 therefore
 * stays a projected reach, untested off the anchor without extended precision. The one feasible proxy -- the
 * floor/L drift across the accessible rungs -- rises only ~1.25x from L <= 160 to L > 160, inside the P25/P75
 * spread, so the accessible data is consistent with the L-linear line but cannot certify the 4+-decade
 * extrapolation. Feasibility / measurement only; theoretical GUE quantity, not real zeros; changes no bound;
 * RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96507-basis-c-floor-slope-dejitter (the de-jittered slope + projected crossover this feasibility-tests)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the original jittery crossover band)
 * @see imp-96448-direct-basis-c-anchor-floor (the MEASURED anchor floor, the one directly-evaluated rung)
 * @see imp-96369-direct-double-integral-pt-anchor-feasibility (basis C feasibility and its floor model)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance and the direct quadrature
 * are re-derived verbatim here (identical to imp-96507/imp-96430) so the accessible-rung floors and the budget
 * are recomputed independently. Self-executing assertions test only platform-robust invariants (the per-rung
 * cancellation floors are float-sensitive, so no tight per-floor value is asserted).
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const EPS = Number.EPSILON; // 2.220446049250313e-16
const CANCELLATION_FLOOR = 1e-13; // the ~1e-13 basis-C cancellation floor imp-96507 measures per rung

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

// BASIS C: direct pair-correlation double integral (rho = Cov/Var). Three Simpson integrals per L.
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

const quantile = (arr, p) => {
  const a = [...arr].sort((x, y) => x - y);
  const idx = (a.length - 1) * p;
  const lo = Math.floor(idx), hi = Math.ceil(idx);
  return a[lo] + (a[hi] - a[lo]) * (idx - lo);
};

// --- accessible-rung floors (feasible; identical construction to imp-96507) ---
const PPP_LADDER = [40, 80, 160, 320, 640, 1280, 2560];
const floorFull = (L) => Math.min(...PPP_LADDER.map((p) => Math.abs(directRho(L, Math.ceil(p * L)).rho - rhoExact(L))));
const CAL_L = [30, 42, 54, 72, 96, 128, 160, 216, 288, 384, 512, 680, 960];
const floorRows = CAL_L.map((L) => ({ L, floor: floorFull(L), ratio: floorFull(L) / L }));
const ratios = floorRows.map((r) => r.ratio);
const slopeP50 = quantile(ratios, 0.5); // de-jittered central slope (recomputed, ~1.96e-15)

// in-sample floor/L drift: low half (L <= 160) vs high half (L > 160)
const lowHalf = floorRows.filter((r) => r.L <= 160).map((r) => r.ratio);
const highHalf = floorRows.filter((r) => r.L > 160).map((r) => r.ratio);
const medRatioLow = quantile(lowHalf, 0.5);
const medRatioHigh = quantile(highHalf, 0.5);
const driftFactor = medRatioHigh / medRatioLow;

// --- panel budget + roundoff floor at the intermediate decades (costed, not run) ---
const PPP_MIN = PPP_LADDER[0]; // 40, the cheapest rung
const budgetAt = (L) => {
  const panelsSmallest = Math.ceil(PPP_MIN * L); // panels per Simpson integral at the cheapest rung
  const evalsSmallestRung = 3 * panelsSmallest; // three integrals in directRho
  const evalsFullLadder = 3 * PPP_LADDER.reduce((s, p) => s + Math.ceil(p * L), 0);
  const roundoffStat = Math.sqrt(panelsSmallest) * EPS; // ~sqrt(N)*eps statistical roundoff growth
  return { L, panelsSmallest, evalsSmallestRung, evalsFullLadder, roundoffStat };
};
const budget1e8 = budgetAt(1e8);
const budget1e9 = budgetAt(1e9);
// the precision wall: statistical roundoff already exceeds the cancellation floor being measured
const roundoffExceedsFloorAt1e8 = budget1e8.roundoffStat / CANCELLATION_FLOOR; // ~100x

export const IMP96525_BASIS_C_INTERMEDIATE_DECADE_FEASIBILITY = {
  ticket: 'imp-96525',
  source:
    'imp-96507 de-jittered the basis-C direct-floor slope (robust median floor/L ~ 1.96e-15) and projected '
    + 'the corroboration crossover to L* ~ 5.4e12, but flagged that the direct integral is never evaluated near '
    + 'L ~ 1e12 -- so L* is a projected reach. This module costs the panel budget and precision of a single '
    + 'direct basis-C floor evaluation at an intermediate decade (L ~ 1e8-1e9) and supplies the only feasible '
    + 'in-sample proxy for the floor-slope extrapolation. Feasibility / measurement only; theoretical GUE '
    + 'quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  cancellationFloor: CANCELLATION_FLOOR,
  machineEps: EPS,
  slopeP50Recomputed: slopeP50, // ~1.96e-15, reproduces the imp-96507 de-jittered central slope
  panelBudget: {
    note:
      'directRho does three composite-Simpson integrals with panels = ceil(ppp * L) each; the integrand '
      + 'oscillates with period 1 in r, so the panel count is LINEAR in L. Budgets below are integrand '
      + 'evaluations, not asserted wall-time.',
    at1e8: budget1e8, // panelsSmallest ~4.0e9, evalsSmallestRung ~1.2e10, evalsFullLadder ~1.5e12
    at1e9: budget1e9, // panelsSmallest ~4.0e10, evalsSmallestRung ~1.2e11, evalsFullLadder ~1.5e13
  },
  precisionWall: {
    roundoffStatAt1e8: budget1e8.roundoffStat, // ~1.4e-11, statistical roundoff of the cheapest-rung Simpson sum
    roundoffStatAt1e9: budget1e9.roundoffStat, // ~4.4e-11
    roundoffOverCancellationFloorAt1e8: roundoffExceedsFloorAt1e8, // ~100x: roundoff already swamps the ~1e-13 floor
    verdict:
      'even setting wall-time aside, the statistical double-precision roundoff of an N ~ 4e9-panel Simpson '
      + 'sum (~1.4e-11 at L=1e8) already exceeds the ~1e-13 cancellation floor being measured by ~100x, so a '
      + 'direct evaluation would return a roundoff-limited value, not a test of the de-jittered line. The '
      + 'intermediate decade is doubly infeasible in double precision (budget AND precision).',
  },
  inSampleProxy: {
    note:
      'since the direct integral cannot be run at the intermediate decade, the only feasible test of a floor/L '
      + 'slope drift is the drift across the accessible rungs (small L, feasible), read through robust medians '
      + 'because the per-rung floors are irreducible cancellation noise.',
    medRatioLow, // median floor/L for L <= 160, ~1.88e-15
    medRatioHigh, // median floor/L for L > 160, ~2.35e-15
    driftFactor, // ~1.25x over ~1.5 decades -- inside the imp-96507 P25/P75 slope spread
    reading:
      'a ~1.25x drift over the accessible ~1.5 decades is inside the P25/P75 slope spread, so the accessible '
      + 'data is CONSISTENT with the L-linear floor-slope line and shows no in-sample curvature forecasting a '
      + 'departure at 1e8; but a 1.25x-per-1.5-decade proxy cannot certify the line 4+ decades further out. '
      + 'Weak positive, not corroboration.',
  },
  floorRows, // accessible-rung floor-resolved basis-C floors and floor/L ratios (feasible rungs only)
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded '
    + 'length L; there are no computed Riemann zeros behind these values. This is a feasibility / measurement '
    + 'pass: NO direct integral is evaluated at the intermediate decade (it is proven that cannot be done '
    + 'usefully in double precision) and no bound changes. The per-rung accessible floors are irreducible '
    + 'cancellation noise at the ~1e-13 level, so the in-sample drift proxy is itself jittery and is read only '
    + 'through robust medians. Establishes no operator positivity; does not touch the ~1.9-sigma excursion '
    + 'confidence. Closing the projected-reach caveat would need extended-precision (double-double / Arb) '
    + 'quadrature, out of scope here.',
  verdict:
    'A single direct basis-C floor evaluation at an intermediate decade L ~ 1e8-1e9 is doubly infeasible: the '
    + 'composite-Simpson panel budget scales linearly in L (~1.2e10 to ~1.5e13 integrand evaluations for one '
    + 'rung/ladder), and, more bindingly, the double-precision roundoff floor of that many additions '
    + '(~1.4e-11 to ~4.4e-11) already swamps the ~1e-13 cancellation floor being measured -- so even a heroic '
    + 'run would return a roundoff-limited value, not a test of the de-jittered line. The imp-96507 crossover '
    + 'L* ~ 5.4e12 therefore stays a projected reach, untested off the anchor without extended precision. The '
    + 'one feasible proxy -- the floor/L drift across the accessible rungs -- rises only ~1.25x from L <= 160 to '
    + 'L > 160, inside the P25/P75 spread, so the accessible data is consistent with the L-linear line but '
    + 'cannot certify the 4+-decade extrapolation. Feasibility / measurement only; theoretical GUE quantity, '
    + 'not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the '
    + 'zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention).
export const IMP96525_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Feasibility / measurement only: rho is the theoretical GUE '
  + 'two-interval correlation, not computed from real zeros. A direct basis-C floor at L ~ 1e8-1e9 is doubly '
  + 'infeasible (panel budget ~1.2e10-1.5e13, roundoff floor ~1.4e-11 swamps the ~1e-13 cancellation floor), so '
  + 'the imp-96507 crossover L* ~ 5.4e12 stays a projected reach; the only feasible proxy (in-sample floor/L '
  + 'drift ~1.25x) is consistent with the L-linear line but does not certify the extrapolation.';

// --- self-executing internal-consistency assertions (platform-robust invariants only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96525: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96525: Ci(1) drifted from reference');

  // the recomputed de-jittered slope must reproduce the imp-96507 femto-scale central slope
  if (!(slopeP50 > 1e-16 && slopeP50 < 5e-14)) throw new Error('imp-96525: recomputed median floor slope out of expected femto range');

  // Finding 1: the panel budget is linear in L and enormous at the intermediate decade.
  if (!(budget1e8.panelsSmallest > 1e9)) throw new Error('imp-96525: L=1e8 cheapest-rung panel count should exceed 1e9');
  if (!(budget1e9.evalsFullLadder > 1e13)) throw new Error('imp-96525: L=1e9 full-ladder budget should exceed 1e13 evaluations');
  if (!(budget1e9.panelsSmallest > 10 * budget1e8.panelsSmallest * 0.99)) throw new Error('imp-96525: panel budget must scale ~linearly in L');

  // Finding 2 (the binding wall): the statistical roundoff floor exceeds the cancellation floor being measured.
  if (!(budget1e8.roundoffStat > CANCELLATION_FLOOR)) throw new Error('imp-96525: roundoff floor at 1e8 should already exceed the ~1e-13 cancellation floor');
  if (!(roundoffExceedsFloorAt1e8 > 10)) throw new Error('imp-96525: roundoff should swamp the cancellation floor by more than 10x at 1e8');
  if (!(budget1e9.roundoffStat > budget1e8.roundoffStat)) throw new Error('imp-96525: roundoff floor should grow with L');

  // Finding 4: the in-sample floor/L drift proxy is a mild, ordered factor (weak positive, not corroboration).
  if (!(medRatioLow > 0 && medRatioHigh > 0)) throw new Error('imp-96525: median floor/L halves must be positive');
  if (!(driftFactor > 1 && driftFactor < 3)) throw new Error('imp-96525: in-sample floor/L drift should be a mild factor (>1x, <3x)');

  // honesty gates
  if (!/NO QED/.test(IMP96525_BASIS_C_INTERMEDIATE_DECADE_FEASIBILITY.verdict))
    throw new Error('imp-96525: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96525_BASIS_C_INTERMEDIATE_DECADE_FEASIBILITY.verdict))
    throw new Error('imp-96525: verdict dropped the no-refereed-bound-change banner');
  if (!/projected reach/.test(IMP96525_BASIS_C_INTERMEDIATE_DECADE_FEASIBILITY.verdict))
    throw new Error('imp-96525: verdict dropped the projected-reach conclusion');
  if (!(/RH open/.test(IMP96525_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96525_HONEST_BANNER) && /NO QED/.test(IMP96525_HONEST_BANNER)))
    throw new Error('imp-96525: IMP96525_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96525_BASIS_C_INTERMEDIATE_DECADE_FEASIBILITY;
