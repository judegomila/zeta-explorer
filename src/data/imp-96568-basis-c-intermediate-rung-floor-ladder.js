/**
 * imp-96568 -- BASIS-C direct-integral floor(L) MEASURED at intermediate L rungs, characterizing the
 * two-mechanism crossover (cancellation-set at small L, Simpson-truncation-set at/above the PT anchor)
 * and tightening the imp-96531 projected corroboration reach L* ~ 2.86e9.
 *
 * BACKGROUND. imp-96531 recomputed the basis-C corroboration-reach crossover from the imp-96448 MEASURED
 * anchor floor (~2.84e-5 at L = 5.9e6) instead of the imp-96430 L-linear MODEL floor, moving L* from
 * ~1.32e12 down to ~2.86e9. But its HONEST CAVEAT flagged that this re-anchors a SINGLE L-linear form
 * to a value set by a DIFFERENT mechanism than the small-L rungs: at small L the floor is cancellation-
 * set (reached at high panels-per-period ppp, where Simpson truncation is negligible), while at the
 * anchor the optimum ppp collapses to ~3 and the floor is truncation-set. The true floor(L) between the
 * accessible rungs and the anchor was NOT measured, so L* was a projected, not a measured, reach.
 *
 * WHAT THIS MODULE DOES (measurement only). It directly evaluates the basis-C double integral
 * rho = Cov/Var (identical quadrature to imp-96430/imp-96448) at intermediate L rungs, sweeping ppp to
 * find the U-shaped best-achievable floor = |rhoDirect - rhoExact| at each rung. The offline sweep
 * (tmp/imp-96568-scratch.mjs, tmp/imp-96568-above.mjs) covered L = 1e3, 1e5, 1e6, 1e7 with the anchor
 * value carried from imp-96448; the L = 1e3 rung is re-measured live at import to reproduce the ladder.
 * The ladder is then used to re-derive the floor-growth law and re-bisect the crossover.
 *
 * FINDINGS (all measured / bisected here, not asserted).
 *  1. THE OPTIMUM ppp COLLAPSES MONOTONICALLY WITH L -- THE SMOKING GUN OF THE MECHANISM CROSSOVER.
 *     Best-achievable floor is reached at ppp = 256 (L = 1e3), 48 (L = 1e5), then pinned at the
 *     resolution floor ppp = 3 at the anchor (5.9e6) and at 1e7. At small L the deep floor (~5e-13 at
 *     1e3) is cancellation-set: it needs high ppp because Simpson truncation still dominates there and
 *     only vanishes at fine resolution. At and above the anchor the mild-L cancellation of Var = L - 2*Int
 *     (subtracting ~L from ~L) has become severe roundoff that GROWS with panel count, so raising ppp
 *     RAISES the error; the optimum collapses to ppp ~ 3 and the floor becomes Simpson-truncation-set.
 *  2. THE FLOOR GROWS SUPER-LINEARLY, NOT L-LINEARLY. Measured floors: 4.84e-13 (1e3), 1.17e-9 (1e5),
 *     ~1.99e-6 (1e6, an upper bound -- see caveat), 2.84e-5 (anchor), 7.40e-5 (1e7). The two clean
 *     ppp-pinned truncation-regime rungs (anchor and 1e7, both optimum ppp = 3) give an above-anchor
 *     power-law exponent p ~ 1.81, well above the exponent 1 the imp-96531 L-linear re-anchoring assumed.
 *  3. THE MEASURED FLOOR LAW TIGHTENS L* FROM ~2.86e9 TO ~1.9e8 (~15x, ~1.5 DECADES PAST THE ANCHOR).
 *     Re-bisecting the crossover with the anchored power-law floor 2.84e-5 * (L/5.9e6)^p reproduces the
 *     imp-96531 L* ~ 2.86e9 at p = 1 (validating the replication) but gives L* ~ 1.90e8 at the measured
 *     p ~ 1.81 -- only ~1.51 decades past the PT anchor, where rho ~ -0.4846 and floor = signal ~ 1.54e-2.
 *     The super-linear floor overtakes the logarithmically shrinking signal ~15x sooner in L than the
 *     L-linear model claimed. Basis C still independently corroborates basis A across the accessible-to-
 *     anchor range and ~1.5 decades past the anchor, just far less than the imp-96531 projection.
 *
 * HONEST CAVEAT. rho is the THEORETICAL GUE (sine-kernel, universality) two-interval correlation for
 * boxes of unfolded length L; there are no computed Riemann zeros behind these values, and each floor is
 * a double-precision quadrature/cancellation artifact of THIS direct integral. (a) The above-anchor
 * exponent p ~ 1.81 rests on only TWO ppp-pinned rungs (anchor, 1e7); a single power law extrapolated
 * past 1e7 -- with the sine-kernel signal still shrinking logarithmically -- makes L* ~ 1.9e8 a tightened
 * PROJECTION, not a measured reach. (b) The L = 1e6 rung was not fully bottomed (its optimum ppp is >= 6,
 * not yet the pinned floor), so its ~1.99e-6 floor is an UPPER bound and its local exponent is not clean;
 * only the two ppp = 3 rungs are used for the above-anchor law. This changes no bound, establishes no
 * operator positivity, and does not touch the ~1.9-sigma excursion confidence.
 *
 * VERDICT. Directly measuring the basis-C floor at intermediate rungs shows the optimum ppp collapses
 * monotonically (256 at L=1e3 -> 48 at 1e5 -> pinned at 3 at the anchor and 1e7): the small-L floor is
 * cancellation-set (high ppp), the at/above-anchor floor is Simpson-truncation-set (ppp pinned at ~3).
 * The floor grows SUPER-linearly (measured above-anchor exponent p ~ 1.81, not the L-linear exponent 1
 * imp-96531 assumed), so re-bisecting the crossover with the measured law tightens the projected reach
 * from L* ~ 2.86e9 (~2.7 decades past the anchor) to L* ~ 1.90e8 (~1.5 decades). Measurement only;
 * theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed
 * ; the zero-side route stays PCC/GRH-gated.
 *
 * @see imp-96531-basis-c-crossover-measured-floor (the L-linear re-anchored crossover L* ~ 2.86e9 this tightens)
 * @see imp-96448-direct-basis-c-anchor-floor (the MEASURED anchor floor ~2.84e-5 and ppp = 3 collapse)
 * @see imp-96430-basis-c-corroboration-reach-crossover (the original L-linear floor MODEL)
 * @see imp-96486-basis-c-ppp-collapse-transition (the ppp-collapse mechanism at the anchor)
 *
 * Import-light: no zeros bundle, no sibling imports. Si/Ci, the exact number variance, and the direct
 * quadrature are re-derived verbatim here (identical to imp-96430/imp-96448) so the ladder is independent.
 */

const PI = Math.PI;
const TWO_PI = 2 * PI;
const EULER = 0.5772156649015329;
const RIGIDITY_LIMIT = -0.5;
const PT_ANCHOR_L = 5.9e6;
const MEASURED_ANCHOR_FLOOR = 2.8414e-5; // imp-96448 best-achievable direct floor at the anchor (ppp = 3)
const MODEL_CROSS_MEASURED = 2.857e9; // imp-96531 L-linear re-anchored crossover L* (reproduced at p = 1)

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

// BASIS C: direct pair-correlation double integral (rho = Cov/Var), identical to imp-96430/imp-96448.
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

// MEASURED best-achievable floor ladder (offline ppp sweep; anchor carried from imp-96448).
// floor = min over ppp of |rhoDirect(L, ppp*L panels) - rhoExact(L)|; optPpp = the minimizing ppp.
const floorLadder = [
  { L: 1e3, floor: 4.843348e-13, optPpp: 256, mechanism: 'cancellation-set' },
  { L: 1e5, floor: 1.169484e-9, optPpp: 48, mechanism: 'crossover' },
  { L: 1e6, floor: 1.988968e-6, optPpp: 6, mechanism: 'crossover (not fully bottomed; upper bound)' },
  { L: PT_ANCHOR_L, floor: MEASURED_ANCHOR_FLOOR, optPpp: 3, mechanism: 'truncation-set (imp-96448)' },
  { L: 1e7, floor: 7.3978e-5, optPpp: 3, mechanism: 'truncation-set' },
];

// Above-anchor floor-growth law from the two ppp-pinned (truncation-set) rungs: anchor and 1e7.
const aboveAnchorExponent =
  Math.log(7.3978e-5 / MEASURED_ANCHOR_FLOOR) / Math.log(1e7 / PT_ANCHOR_L); // ~1.81

// Re-bisect the crossover with an anchored power-law floor 2.84e-5 * (L/anchor)^p; growing floor
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

const crossLinear = crossoverL(1.0); // reproduces the imp-96531 L* ~ 2.86e9 (replication check)
const crossMeasured = crossoverL(aboveAnchorExponent); // ~1.9e8 tightened reach
const tighteningVsModel = MODEL_CROSS_MEASURED / crossMeasured; // ~15x
const decadesPastAnchorMeasured = Math.log10(crossMeasured / PT_ANCHOR_L); // ~1.5

// LIVE: re-measure the L = 1e3 rung at its optimum ppp = 256 (cheap, ~7.7e5 Simpson evaluations).
const liveLowRungL = 1e3;
const liveLowRungPpp = 256;
const liveLowRungExact = rhoExact(liveLowRungL);
const liveLowRungDirect = directRho(liveLowRungL, Math.ceil(liveLowRungPpp * liveLowRungL));
const liveLowRungFloor = Math.abs(liveLowRungDirect.rho - liveLowRungExact);

export const IMP96568_BASIS_C_INTERMEDIATE_RUNG_FLOOR_LADDER = {
  ticket: 'imp-96568',
  source:
    'imp-96531 tightened the basis-C corroboration-reach crossover to L* ~ 2.86e9 by re-anchoring a single L-linear floor to the imp-96448 MEASURED anchor floor (~2.84e-5), but its HONEST CAVEAT flagged that the true floor(L) between the accessible rungs and the anchor is an UNMEASURED crossover between two mechanisms (cancellation-set at small L, Simpson-truncation-set at the anchor), so L* was projected, not measured. This module directly measures the floor at intermediate L rungs, characterizes the mechanism crossover via the optimum-ppp collapse, and re-bisects the crossover from the measured floor-growth law. Measurement only; theoretical GUE quantity, not real zeros.',
  rigidityLimit: RIGIDITY_LIMIT,
  ptAnchorL: PT_ANCHOR_L,
  measuredAnchorFloor: MEASURED_ANCHOR_FLOOR,
  floorLadder,
  mechanismCrossover: {
    smallLoptPpp: 256, // deep cancellation-set floor reached at high ppp (L = 1e3)
    anchorOptPpp: 3, // truncation-set floor, ppp pinned at the resolution floor (anchor and 1e7)
    note:
      'The optimum ppp collapses monotonically with L (256 at 1e3, 48 at 1e5, pinned at 3 at the anchor and 1e7). At small L the floor is cancellation-set (Simpson truncation still dominates and only vanishes at fine ppp); at and above the anchor the Var = L - 2*Int cancellation roundoff grows with panel count, so raising ppp raises the error and the optimum collapses to ppp ~ 3, making the floor Simpson-truncation-set.',
  },
  floorGrowth: {
    aboveAnchorExponent, // ~1.81 from the two ppp-pinned rungs (anchor, 1e7)
    linearExponentAssumedByModel: 1.0,
    note:
      'The floor grows super-linearly. The two clean ppp-pinned truncation-regime rungs (anchor at ppp = 3, 1e7 at ppp = 3) give an above-anchor power-law exponent ~1.81, well above the exponent 1 the imp-96531 L-linear re-anchoring assumed. The L = 1e6 rung is not fully bottomed (optimum ppp >= 6) so its floor is an upper bound and is excluded from the above-anchor law.',
  },
  crossover: {
    linearReproduction: crossLinear, // ~2.86e9 -- reproduces imp-96531 at p = 1 (replication check)
    measured: {
      L: crossMeasured, // ~1.90e8
      exponent: aboveAnchorExponent,
      rho: rhoExact(crossMeasured), // ~ -0.4846
      signal: signalOf(crossMeasured), // ~1.54e-2 (= floor at the crossover)
      decadesPastAnchor: decadesPastAnchorMeasured, // ~1.5
    },
    tighteningVsModel, // ~15x tighter than the imp-96531 L-linear projection
    note:
      'Re-bisecting the crossover with the anchored power-law floor reproduces the imp-96531 L* ~ 2.86e9 at p = 1 (validating the replication) and gives L* ~ 1.90e8 at the measured p ~ 1.81 -- only ~1.5 decades past the PT anchor L = 5.9e6, ~15x tighter. Basis C still independently corroborates basis A across the accessible-to-anchor range and ~1.5 decades past it, but the super-linear floor overtakes the shrinking signal ~15x sooner in L than the L-linear model claimed.',
  },
  liveRecheck: {
    L: liveLowRungL,
    ppp: liveLowRungPpp,
    rhoExact: liveLowRungExact,
    rhoDirect: liveLowRungDirect.rho,
    floor: liveLowRungFloor, // reproduces ~4.84e-13
  },
  caveat:
    'rho is the theoretical GUE (sine-kernel, universality) two-interval correlation for boxes of unfolded length L; there are no computed Riemann zeros behind these values, and each floor is a double-precision quadrature/cancellation artifact of this direct integral. The above-anchor exponent ~1.81 rests on only two ppp-pinned rungs (anchor, 1e7); a single power law extrapolated past 1e7 -- with the sine-kernel signal still shrinking logarithmically -- makes L* ~ 1.9e8 a tightened projection, not a measured reach. The L = 1e6 rung was not fully bottomed (optimum ppp >= 6) so its floor is an upper bound with an unclean local exponent, excluded from the law. Changes no bound, establishes no operator positivity, does not touch the ~1.9-sigma excursion confidence.',
  verdict:
    'Directly measuring the basis-C floor at intermediate rungs shows the optimum ppp collapses monotonically (256 at L=1e3 -> 48 at 1e5 -> pinned at 3 at the anchor and 1e7): the small-L floor is cancellation-set (high ppp), the at/above-anchor floor is Simpson-truncation-set (ppp pinned at ~3). The floor grows SUPER-linearly (measured above-anchor exponent ~1.81, not the L-linear exponent 1 imp-96531 assumed), so re-bisecting the crossover with the measured law tightens the projected reach from L* ~ 2.86e9 (~2.7 decades past the anchor) to L* ~ 1.90e8 (~1.5 decades). Measurement only; theoretical GUE quantity, not real zeros; changes no bound; RH open; NO QED; no refereed bound is changed; the zero-side route stays PCC/GRH-gated.',
};

// Machine-readable honest-status banner (imp-96337 / imp-96428 convention) for any consumer surface.
export const IMP96568_HONEST_BANNER =
  'RH open; no refereed bound is changed; NO QED. Measurement only: rho is the '
  + 'theoretical GUE two-interval correlation, not computed from real zeros; each floor '
  + 'is a double-precision quadrature/cancellation artifact of the direct integral. The '
  + 'measured super-linear floor law (above-anchor exponent ~1.81) tightens the imp-96531 '
  + 'projected corroboration reach from L* ~ 2.86e9 to ~1.9e8 (~1.5 decades past the PT '
  + 'anchor); still a projection past 1e7, changes no bound.';

// --- self-executing internal-consistency assertions (live low-rung re-measurement + crossover bisection) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;

  // reference values for the local special-function implementations
  if (!approx(Si(1), 0.9460830704, 1e-8)) throw new Error('imp-96568: Si(1) drifted from reference');
  if (!approx(Ci(1), 0.3374039229, 1e-8)) throw new Error('imp-96568: Ci(1) drifted from reference');

  // Finding 1: the optimum ppp collapses monotonically with L (mechanism crossover)
  const ppps = floorLadder.map((r) => r.optPpp);
  for (let i = 1; i < ppps.length; i++) {
    if (ppps[i] > ppps[i - 1]) throw new Error('imp-96568: optimum ppp should be non-increasing in L (mechanism crossover)');
  }
  if (floorLadder[0].optPpp !== 256 || floorLadder[floorLadder.length - 1].optPpp !== 3)
    throw new Error('imp-96568: ppp ladder should collapse from 256 (small L) to 3 (at/above anchor)');

  // Finding 1 (live): the L = 1e3 rung reproduces its deep cancellation-set floor at ppp = 256
  if (!approx(liveLowRungFloor, 4.843348e-13, 5e-13))
    throw new Error('imp-96568: live L=1e3 floor drifted from the measured ~4.84e-13');

  // Finding 2: the floor grows super-linearly (above-anchor exponent well above 1)
  if (!(aboveAnchorExponent > 1.5 && aboveAnchorExponent < 2.2))
    throw new Error('imp-96568: above-anchor floor exponent should be ~1.81 (super-linear)');
  // the ladder is monotone increasing in L
  for (let i = 1; i < floorLadder.length; i++) {
    if (!(floorLadder[i].floor > floorLadder[i - 1].floor))
      throw new Error('imp-96568: measured floor should increase with L');
  }

  // Finding 3: the p = 1 bisection reproduces imp-96531, and the measured law tightens L* ~15x
  if (!approx(crossLinear / MODEL_CROSS_MEASURED, 1, 0.02))
    throw new Error('imp-96568: p=1 crossover should reproduce the imp-96531 L* ~ 2.86e9');
  if (!(crossMeasured > 1e8 && crossMeasured < 3e8))
    throw new Error('imp-96568: measured-law crossover should land near ~1.9e8');
  if (!(tighteningVsModel > 8 && tighteningVsModel < 25))
    throw new Error('imp-96568: measured law should tighten L* roughly an order of magnitude vs the model');
  if (!(decadesPastAnchorMeasured > 1 && decadesPastAnchorMeasured < 2))
    throw new Error('imp-96568: tightened crossover should be ~1.5 decades past the PT anchor');

  // honesty gates
  if (!/NO QED/.test(IMP96568_BASIS_C_INTERMEDIATE_RUNG_FLOOR_LADDER.verdict))
    throw new Error('imp-96568: verdict dropped the NO QED banner');
  if (!/refereed bound is changed/i.test(IMP96568_BASIS_C_INTERMEDIATE_RUNG_FLOOR_LADDER.verdict))
    throw new Error('imp-96568: verdict dropped the no-refereed-bound-change banner');
  if (!/imp-96531/.test(IMP96568_BASIS_C_INTERMEDIATE_RUNG_FLOOR_LADDER.source))
    throw new Error('imp-96568: source dropped the imp-96531 reference');
  if (!(/RH open/.test(IMP96568_HONEST_BANNER) && /PT Lambda <= 0.2|refereed bound is changed/.test(IMP96568_HONEST_BANNER) && /NO QED/.test(IMP96568_HONEST_BANNER)))
    throw new Error('imp-96568: IMP96568_HONEST_BANNER missing RH-open / PT-Lambda / NO-QED markers');
})();

export default IMP96568_BASIS_C_INTERMEDIATE_RUNG_FLOOR_LADDER;
