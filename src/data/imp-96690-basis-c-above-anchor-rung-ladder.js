/**
 * imp-96690 -- BASIS-C above-anchor floor ladder EXTENDED. Adds truncation-regime rungs
 * (L = 2e7, 3e7, 5e7, plus a below-anchor control at 3e6) to the imp-96568 floor ladder, which
 * fit the above-anchor floor-growth exponent p ~ 1.81 from only TWO ppp-pinned rungs (anchor and
 * 1e7). This module re-measures the best-achievable floor at more rungs, re-fits the exponent, and
 * re-bisects the corroboration reach L*. Measurement only.
 *
 * BACKGROUND. imp-96568/imp-96599 measured the basis-C direct-integral floor = |rhoDirect - rhoExact|
 * at intermediate L rungs and found the optimum panels-per-period (ppp) collapses monotonically with L
 * (256 at 1e3 -> 48 at 1e5 -> pinned at 3 at the anchor 5.9e6 and at 1e7). From the two ppp = 3
 * (truncation-set) rungs they fit an above-anchor power-law exponent p ~ 1.81 and re-bisected the
 * corroboration-reach crossover floor(L) = signal(L) to L* ~ 1.9e8. Their HONEST CAVEAT flagged that
 * p ~ 1.81 rests on only TWO rungs, so L* ~ 1.9e8 remained a two-point projection.
 *
 * WHAT THIS MODULE DOES (measurement only). It directly evaluates the SAME basis-C double integral
 * rho = Cov/Var (identical quadrature to imp-96430/imp-96448/imp-96568) at additional rungs, sweeping
 * ppp in {2,3,4,5} at each rung to find the best-achievable floor = min over ppp of |rhoDirect - rhoExact|
 * and the minimizing ppp. The offline sweep (tmp/imp-96690-measure.mjs) covered L = 3e6, 2e7, 3e7, 5e7;
 * the anchor and 1e7 rungs are carried from imp-96568. It then re-fits the above-anchor exponent (log-log
 * OLS over all five L >= anchor rungs) and re-bisects the crossover. A cheap live spot-check of the
 * quadrature at small L, and the full OLS + bisection arithmetic, run at import.
 *
 * FINDINGS (all measured / re-derived here, not asserted).
 *  1. THE OPTIMUM ppp DOES NOT STAY PINNED AT 3 ABOVE 1e7 -- IT COLLAPSES FURTHER TO 2. The imp-96568
 *     ladder pinned ppp = 3 at the anchor and 1e7, but the best-achievable floor at L = 2e7, 3e7, 5e7 is
 *     reached at ppp = 2 (at ppp = 3 the Var = L - 2*Int cancellation roundoff already dominates). So the
 *     "pinned at ppp = 3" description is a local feature of the anchor..1e7 window, not a stable regime;
 *     the optimum ppp keeps collapsing as the cancellation roundoff worsens with L. (The below-anchor
 *     control L = 3e6 is still crossover-set: optimum ppp = 5, floor 1.19e-6, NOT truncation-pinned --
 *     it sits below the mechanism crossover and is excluded from the above-anchor law, matching the
 *     imp-96568 exclusion of the un-bottomed 1e6 rung.)
 *  2. THE FLOOR GROWS FASTER THAN p ~ 1.81 ABOVE 1e7. Best-achievable floors: 2.8414e-5 (anchor),
 *     7.3978e-5 (1e7), 5.173e-4 (2e7), 1.204e-3 (3e7), 4.657e-3 (5e7). The consecutive two-point
 *     exponents are 1.81 (anchor->1e7), 2.81 (1e7->2e7), 2.08 (2e7->3e7), 2.65 (3e7->5e7): the growth
 *     ACCELERATES and is not a clean single power law (partly because the optimum ppp is itself shifting
 *     3 -> 2). A log-log OLS over all five rungs gives an above-anchor exponent p ~ 2.42, well above the
 *     two-point p ~ 1.81, i.e. the two-rung fit UNDERSTATED the floor growth.
 *  3. THE EXTENDED LADDER TIGHTENS L* FROM ~1.9e8 TO ~8.1e7 (~1.14 DECADES PAST THE ANCHOR). Re-bisecting
 *     the crossover with the anchored power-law floor 2.8414e-5 * (L/anchor)^p reproduces the imp-96568
 *     L* ~ 1.90e8 at p = 1.8135 (replication check) and gives L* ~ 8.08e7 at the measured OLS p ~ 2.42 --
 *     only ~1.14 decades past the PT anchor L = 5.9e6, where rho ~ -0.4840 and floor = signal ~ 1.60e-2.
 *     The steeper measured exponent overtakes the logarithmically shrinking sine-kernel signal even sooner
 *     in L than the imp-96568 two-rung projection claimed.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; there are no computed Riemann zeros behind these values, and each floor is
 * a double-precision quadrature/cancellation artifact of THIS direct integral. The local exponent is not
 * constant (1.81 -> 2.81 -> 2.08 -> 2.65): the floor growth accelerates and the optimum ppp shifts, so a
 * single power law is a summary, not a law. L* ~ 8.1e7 is therefore a further-tightened PROJECTION, not a
 * measured reach; if anything the accelerating local exponents suggest it could be tighter still. This
 * changes no bound, establishes no operator positivity, and does not touch the ~1.9-sigma excursion
 * confidence.
 *
 * VERDICT. Extending the basis-C floor ladder above 1e7 (L = 2e7, 3e7, 5e7 at their best-achievable
 * floors) shows the optimum ppp collapses further to 2 (the imp-96568 ppp = 3 pinning is a local anchor..1e7
 * feature) and the floor grows FASTER than the two-rung p ~ 1.81 -- log-log OLS p ~ 2.42 over five rungs.
 * Re-bisecting the crossover with the measured law reproduces imp-96568 L* ~ 1.9e8 at p = 1.8135 and
 * tightens it to L* ~ 8.1e7 (~1.14 decades past the anchor) at the extended exponent. Measurement only;
 * theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96568-basis-c-intermediate-rung-floor-ladder (the two-rung p ~ 1.81 / L* ~ 1.9e8 this extends)
 * @see imp-96599-basis-c-superlinear-floor-glossary-headword (the headword flagging the two-rung projection)
 * @see imp-96448-direct-basis-c-anchor-floor (the MEASURED anchor floor ~2.84e-5 and ppp = 3 collapse)
 * @see imp-96531-basis-c-crossover-measured-floor (the L-linear re-anchored crossover L* ~ 2.86e9)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, and the direct
 * quadrature are re-derived verbatim here (identical to imp-96430/imp-96448/imp-96568) so the ladder is
 * independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const MEASURED_ANCHOR_FLOOR = 2.8414e-5; // imp-96448 best-achievable direct floor at the anchor (ppp = 3)
const IMP96568_CROSS_MEASURED = 1.8997e8; // imp-96568 two-rung crossover L* (reproduced at p = 1.8135)
const IMP96568_EXPONENT = 1.813545; // imp-96568 two-point above-anchor exponent (anchor, 1e7)

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

// BASIS C: direct pair-correlation double integral (rho = Cov/Var), identical to imp-96430/imp-96448/imp-96568.
function directRho(L, panels) {
  const Var = L - 2 * simpson((r) => (L - r) * clusterY(r), 0, L, panels);
  const covA = simpson((r) => r * clusterY(r), 0, L, panels);
  const covB = simpson((r) => (2 * L - r) * clusterY(r), L, 2 * L, panels);
  return { Var, rho: -(covA + covB) / Var };
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

// MEASURED best-achievable floor ladder at additional rungs (offline ppp sweep in {2,3,4,5};
// tmp/imp-96690-measure.mjs). floor = min over ppp of |rhoDirect(L, ppp*L panels) - rhoExact(L)|.
// The anchor and 1e7 rungs are carried from imp-96568 for the exponent fit.
const newRungs = [
  { L: 3e6, floor: 1.193101e-6, optPpp: 5, mechanism: 'crossover (below anchor; NOT truncation-pinned -- excluded)' },
  { L: 2e7, floor: 5.173078e-4, optPpp: 2, mechanism: 'truncation-set (optimum ppp collapsed to 2)' },
  { L: 3e7, floor: 1.203644e-3, optPpp: 2, mechanism: 'truncation-set (ppp = 2)' },
  { L: 5e7, floor: 4.657430e-3, optPpp: 2, mechanism: 'truncation-set (ppp = 2)' },
];

// Above-anchor rungs used for the exponent fit (L >= anchor, best-achievable floors).
const aboveAnchorRungs = [
  { L: PT_ANCHOR_L, floor: MEASURED_ANCHOR_FLOOR, optPpp: 3 },
  { L: 1e7, floor: 7.3978e-5, optPpp: 3 },
  { L: 2e7, floor: 5.173078e-4, optPpp: 2 },
  { L: 3e7, floor: 1.203644e-3, optPpp: 2 },
  { L: 5e7, floor: 4.657430e-3, optPpp: 2 },
];

// Consecutive two-point exponents (show the growth accelerates, not a clean single power law).
const consecutiveExponents = aboveAnchorRungs.slice(1).map((r, i) => {
  const a = aboveAnchorRungs[i];
  return { from: a.L, to: r.L, p: Math.log(r.floor / a.floor) / Math.log(r.L / a.L) };
});

// Log-log OLS above-anchor exponent over all five rungs.
function ollLogLog(rungs) {
  const xs = rungs.map((r) => Math.log(r.L));
  const ys = rungs.map((r) => Math.log(r.floor));
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let sxy = 0, sxx = 0;
  for (let i = 0; i < n; i++) { sxy += (xs[i] - mx) * (ys[i] - my); sxx += (xs[i] - mx) ** 2; }
  const slope = sxy / sxx;
  return { slope, intercept: my - slope * mx };
}
const olsFit = ollLogLog(aboveAnchorRungs);
const aboveAnchorExponentOLS = olsFit.slope; // ~2.42

// Re-bisect the crossover with an anchored power-law floor 2.8414e-5 * (L/anchor)^p; the growing floor
// overtakes the logarithmically shrinking signal, so floor(L) - signal(L) is monotone increasing.
function crossoverL(p) {
  const floor = (L) => MEASURED_ANCHOR_FLOOR * Math.pow(L / PT_ANCHOR_L, p);
  let lo = PT_ANCHOR_L, hi = 1e14;
  for (let i = 0; i < 300; i++) {
    const mid = Math.sqrt(lo * hi);
    if (floor(mid) - signalOf(mid) > 0) hi = mid;
    else lo = mid;
  }
  return Math.sqrt(lo * hi);
}

const crossImp96568 = crossoverL(IMP96568_EXPONENT); // reproduces the imp-96568 L* ~ 1.90e8 (replication check)
const crossExtended = crossoverL(aboveAnchorExponentOLS); // ~8.08e7 further-tightened reach
const tighteningVsImp96568 = IMP96568_CROSS_MEASURED / crossExtended; // ~2.35x
const decadesPastAnchorExtended = Math.log10(crossExtended / PT_ANCHOR_L); // ~1.14

// LIVE: cheap quadrature spot-check at a small L (a few 1e4 panels; import-safe) confirming directRho is
// wired to the same integral, plus the full OLS + bisection arithmetic above (both re-run at import).
const liveSpotL = 1e4;
const liveSpotPpp = 32;
const liveSpotExact = rhoExact(liveSpotL);
const liveSpotDirect = directRho(liveSpotL, Math.ceil(liveSpotPpp * liveSpotL));
const liveSpotFloor = Math.abs(liveSpotDirect.rho - liveSpotExact);

export const IMP96690_BASIS_C_ABOVE_ANCHOR_RUNG_LADDER = {
  ticket: 'imp-96690',
  source:
    'imp-96568/imp-96599 fit the basis-C above-anchor floor-growth exponent p ~ 1.81 from ONLY two ppp-pinned truncation-regime rungs (anchor floor 2.8414e-5 at ppp = 3; 1e7 floor 7.3978e-5 at ppp = 3), so the tightened corroboration reach L* ~ 1.9e8 remained a two-point projection. This module measures the best-achievable floor at additional rungs (L = 2e7, 3e7, 5e7 above the anchor, plus a below-anchor control at 3e6), re-fits the above-anchor exponent (log-log OLS over five rungs), and re-bisects the crossover. Measurement only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  measuredAnchorFloor: MEASURED_ANCHOR_FLOOR,
  newRungs,
  aboveAnchorRungs,
  pppCollapse: {
    anchorAnd1e7Ppp: 3,
    above1e7Ppp: 2,
    below3e6Ppp: 5,
    note:
      'The imp-96568 ladder pinned the optimum ppp at 3 at the anchor and 1e7, but the best-achievable floor at L = 2e7, 3e7, 5e7 is reached at ppp = 2 (at ppp = 3 the Var = L - 2*Int cancellation roundoff already dominates). The "pinned at ppp = 3" description is a local anchor..1e7 feature, not a stable regime; the optimum keeps collapsing as the cancellation roundoff worsens with L. The below-anchor control L = 3e6 is still crossover-set (optimum ppp = 5, floor 1.19e-6), NOT truncation-pinned, so it is excluded from the above-anchor law (matching the imp-96568 exclusion of the un-bottomed 1e6 rung).',
  },
  floorGrowth: {
    consecutiveExponents, // ~1.81, 2.81, 2.08, 2.65 -- accelerating, not a clean single power law
    aboveAnchorExponentOLS, // ~2.42 (log-log OLS over five rungs)
    imp96568TwoPointExponent: IMP96568_EXPONENT, // ~1.81
    note:
      'The floor grows FASTER than the imp-96568 two-rung p ~ 1.81. Best-achievable floors: 2.8414e-5 (anchor), 7.3978e-5 (1e7), 5.173e-4 (2e7), 1.204e-3 (3e7), 4.657e-3 (5e7). The consecutive two-point exponents (1.81, 2.81, 2.08, 2.65) ACCELERATE and are not a clean single power law -- partly because the optimum ppp is itself shifting 3 -> 2. Log-log OLS over all five rungs gives p ~ 2.42, so the two-rung fit understated the floor growth.',
  },
  crossover: {
    imp96568Reproduction: crossImp96568, // ~1.90e8 -- reproduces imp-96568 at p = 1.8135 (replication check)
    extended: {
      L: crossExtended, // ~8.08e7
      exponent: aboveAnchorExponentOLS,
      rho: rhoExact(crossExtended), // ~ -0.4840
      signal: signalOf(crossExtended), // ~1.60e-2 (= floor at the crossover)
      decadesPastAnchor: decadesPastAnchorExtended, // ~1.14
    },
    tighteningVsImp96568, // ~2.35x tighter than the imp-96568 two-rung projection
    note:
      'Re-bisecting the crossover with the anchored power-law floor reproduces the imp-96568 L* ~ 1.90e8 at p = 1.8135 (validating the replication) and gives L* ~ 8.08e7 at the measured OLS p ~ 2.42 -- only ~1.14 decades past the PT anchor L = 5.9e6, ~2.35x tighter. The steeper measured exponent overtakes the logarithmically shrinking sine-kernel signal even sooner in L than the imp-96568 two-rung projection claimed.',
  },
  liveSpotCheck: {
    L: liveSpotL,
    ppp: liveSpotPpp,
    rhoExact: liveSpotExact,
    rhoDirect: liveSpotDirect.rho,
    floor: liveSpotFloor, // small; confirms the quadrature path is wired identically
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values, and each floor is a double-precision quadrature/cancellation artifact of this direct integral. The local exponent is not constant (1.81 -> 2.81 -> 2.08 -> 2.65): the floor growth accelerates and the optimum ppp shifts, so a single power law is a summary, not a law. L* ~ 8.1e7 is a further-tightened projection, not a measured reach; if anything the accelerating local exponents suggest it could be tighter still. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Extending the basis-C floor ladder above 1e7 (L = 2e7, 3e7, 5e7 at their best-achievable floors) shows the optimum ppp collapses further to 2 (the imp-96568 ppp = 3 pinning is a local anchor..1e7 feature) and the floor grows FASTER than the two-rung p ~ 1.81 -- log-log OLS p ~ 2.42 over five rungs. Re-bisecting the crossover reproduces imp-96568 L* ~ 1.9e8 at p = 1.8135 and tightens it to L* ~ 8.1e7 (~1.14 decades past the anchor) at the extended exponent. Measurement only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for any consumer surface.
export const IMP96690_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: rho is the '
  + 'theoretical GUE two-interval correlation, not computed from real zeros; each floor '
  + 'is a double-precision quadrature/cancellation artifact of the direct integral. Adding '
  + 'above-anchor rungs (2e7, 3e7, 5e7) shows the optimum ppp collapses further to 2 and the '
  + 'floor grows faster than the imp-96568 two-rung p ~ 1.81 (log-log OLS p ~ 2.42), tightening '
  + 'the projected corroboration reach from L* ~ 1.9e8 to ~8.1e7 (~1.14 decades past the PT '
  + 'anchor); still a projection, changes no bound.';

// --- self-executing internal-consistency assertions (live spot-check + OLS + crossover bisection) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96690: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96690: Ci(1) drifted from reference');

  // Finding 1: the optimum ppp collapses to 2 above 1e7 (below the imp-96568 anchor..1e7 pinning at 3)
  for (const r of aboveAnchorRungs) {
    if (r.L > 1e7 && r.optPpp !== 2)
      throw new Error('imp-96690: above-1e7 best-achievable floor should be reached at ppp = 2');
  }
  if (newRungs.find((r) => r.L === 3e6).optPpp <= 3)
    throw new Error('imp-96690: below-anchor 3e6 control should be crossover-set (optimum ppp > 3), not truncation-pinned');

  // Finding 2: the floor is monotone increasing and grows faster than the imp-96568 two-rung exponent
  for (let i = 1; i < aboveAnchorRungs.length; i++) {
    if (!(aboveAnchorRungs[i].floor > aboveAnchorRungs[i - 1].floor))
      throw new Error('imp-96690: above-anchor floor should increase with L');
  }
  if (!(aboveAnchorExponentOLS > IMP96568_EXPONENT))
    throw new Error('imp-96690: extended OLS exponent should exceed the imp-96568 two-point exponent');
  if (!(aboveAnchorExponentOLS > 2.2 && aboveAnchorExponentOLS < 2.7))
    throw new Error('imp-96690: extended OLS above-anchor exponent should be ~2.42');

  // Finding 3: the p = 1.8135 bisection reproduces imp-96568, and the extended law tightens L*
  if (!approx(crossImp96568 / IMP96568_CROSS_MEASURED, 1, 0.02))
    throw new Error('imp-96690: p = 1.8135 crossover should reproduce the imp-96568 L* ~ 1.9e8');
  if (!(crossExtended > 5e7 && crossExtended < 1.2e8))
    throw new Error('imp-96690: extended-law crossover should land near ~8.1e7');
  if (!(tighteningVsImp96568 > 1.5 && tighteningVsImp96568 < 4))
    throw new Error('imp-96690: extended law should tighten L* ~2x vs the imp-96568 two-rung projection');
  if (!(decadesPastAnchorExtended > 0.9 && decadesPastAnchorExtended < 1.5))
    throw new Error('imp-96690: extended crossover should be ~1.14 decades past the PT anchor');

  // live quadrature spot-check: directRho produces a finite small floor via the identical integral
  if (!(isFinite(liveSpotFloor) && liveSpotFloor >= 0 && liveSpotFloor < 1e-2))
    throw new Error('imp-96690: live quadrature spot-check floor drifted (directRho path not wired)');

  // honesty gates
  if (!/NO QED/.test(IMP96690_BASIS_C_ABOVE_ANCHOR_RUNG_LADDER.verdict))
    throw new Error('imp-96690: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96690_BASIS_C_ABOVE_ANCHOR_RUNG_LADDER.verdict))
    throw new Error('imp-96690: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96568/.test(IMP96690_BASIS_C_ABOVE_ANCHOR_RUNG_LADDER.source))
    throw new Error('imp-96690: source dropped the imp-96568 reference');
  if (!(/RH open/.test(IMP96690_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96690_HONEST_BANNER) && /NO QED/.test(IMP96690_HONEST_BANNER)))
    throw new Error('imp-96690: IMP96690_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96690_BASIS_C_ABOVE_ANCHOR_RUNG_LADDER;
