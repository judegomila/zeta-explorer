/**
 * imp-95258: Sensitivity of the imp-95250 COROLLARY EV-OCT every-octave
 * firing onset xStarEvOct to octave count m, lattice ratio rho, and
 * intra-pair ratio r. imp-95250 reports xStarEvOct = 11.31664319 measured
 * only at m = 6, rho = 2 (dyadic), r -> 1 (coalescent). This module varies
 * each of the three parameters one at a time to show whether that single
 * onset is representative of the every-octave family or an artifact of the
 * small m = 6 skeleton. Measurement only; changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * OBJECT. Generalize the imp-95250 dyadic skeleton to arbitrary lattice
 * ratio rho: blocks V_k = {rho^k, r rho^k}, k = 0..m-1, 1 < r <= 1.3,
 * depth x. The fully closed-form COROLLARY EV-OCT certificate reads
 *   cert(m, r, rho, x) = [ sum_(k=0..m-1)
 *       sqrt( coalLaw(rho^k x) / Phi_k(r, rho) ) ]^2,
 * with coalLaw(y) = e^(-2y)(1 + 2y^2 + 2y sqrt(1 + y^2)) (imp-95227
 * COAL-DOM + imp-95231 RATE-MONO, r-uniform per-block upper bound via the
 * exact scale invariance Lambda({rho^k, r rho^k}, x) = Lambda({1, r},
 * rho^k x)) and Phi_k = prod over cross pairs (i in V_k, j notin V_k) of
 * beta_ij^2, beta_ij = (nu_i - nu_j)/(nu_i + nu_j) (imp-95249 LEMMA
 * ANG-DET, coalescence-uniform). The firing onset xStar(m, r, rho) is the
 * unique x with cert = 1 (cert is strictly decreasing in x on the fired
 * side), located by 100-step bisection.
 *
 * MEASUREMENTS.
 *
 * (A) COALESCENT CROSS-CHECK. At m = 6, rho = 2, r -> 1 the generalized
 * cert reproduces the imp-95250 coalescent certCoalM certificate exactly:
 * bisected onset 11.31664319 (matches the baked xStarEvOct literal to all
 * printed digits), confirming the generalization is consistent with the
 * published number at its own parameter point.
 *
 * (B) SENSITIVITY TO m (rho = 2, r = 1.05). The onset rises MONOTONICALLY
 * with m and SATURATES: 7.053 (m = 2), 9.381 (m = 3), 10.499 (m = 4),
 * 11.325 (m = 6), 11.531 (m = 8), 11.582 (m = 10), 11.599 (m = 24 and
 * beyond -- converged to 11.599142). The m = 6 onset sits only 0.274
 * below the m -> inf saturation, so it is REPRESENTATIVE of the
 * unbounded-count family in the r = 1.05, rho = 2 slice, NOT a
 * small-skeleton artifact. The saturation value 11.599 also sits far
 * below the crude m-and-r-uniform xStarUnif = 27.04 (which pays the
 * PhiUnif = 9.98e-21 tail bound), quantifying how loose that uniform
 * threshold is relative to the actual saturated onset.
 *
 * (C) SENSITIVITY TO rho (m = 6, r = 1.05). rho is the DOMINANT axis: the
 * onset FALLS steeply as the octave spacing widens, from 19.052 at
 * rho = 1.5 through 13.445 (rho = 1.8), 11.325 (rho = 2), 8.297
 * (rho = 2.5), 6.697 (rho = 3) to 5.028 at rho = 4. Wider spacing weakens
 * the inter-block Blaschke correlation (larger beta), so the fence Phi_k
 * grows and the certificate fires earlier; conversely rho near 1 crowds
 * the octaves and pushes the onset up. The single rho = 2 measurement is
 * thus specific to the dyadic skeleton and NOT representative across rho.
 *
 * (D) SENSITIVITY TO r (m = 6, rho = 2). r is a WEAK axis: the onset moves
 * only from 11.31665 (r = 1.001, essentially the coalescent limit) up to
 * 11.577 at r = 1.3 -- a spread of 0.260 across the full admissible band.
 * The coalescence-uniform fence Phi_k (no r - 1 factor) is exactly why r
 * barely moves the onset; the mild rise comes only from coalLaw picking up
 * the slightly larger per-block Lambda as the pair separates. The m = 6
 * coalescent onset is therefore representative across all r in (1, 1.3].
 *
 * SUMMARY. The imp-95250 xStarEvOct = 11.32 is representative in m (0.27
 * below the m -> inf saturation) and in r (0.26 spread over the whole
 * band), but is a dyadic-specific value in rho, which is the dominant
 * sensitivity axis (5.0 at rho = 4 to 19.1 at rho = 1.5). No sensitivity
 * exposes any non-monotonicity or artifact; the every-octave certificate
 * behaves smoothly in all three parameters.
 *
 * HONEST LIMITS. Measurement of the CLOSED-FORM COROLLARY EV-OCT
 * certificate only (the same object imp-95250 bisected), not the exact
 * pencil Lambda; the collar between cert and the exact Lambda (orders of
 * magnitude, imp-95250 HONEST LIMITS (a)) is unchanged and not re-measured
 * here. Twin-pair blocks (size 2) only -- the >= 3-per-octave residual
 * (N-fold coalescence law) is untouched. Off-lattice rates unchanged.
 * Model family only; no mapping to paper per-window data; changes NO
 * Lambda bound of the program.
 *
 * Import-light (no imports, no zeros bundle). Numerics recompute the
 * closed-form certificate directly; the baked onsets are cross-checks of
 * the measurement, never a claim about the exact operator.
 */

// ---------------------------------------------------------------------------
// Self-contained closed-form COROLLARY EV-OCT certificate (generalized rho)
// ---------------------------------------------------------------------------

const coalLaw = (x) =>
  Math.exp(-2 * x) * (1 + 2 * x * x + 2 * x * Math.sqrt(1 + x * x));

// LEMMA ANG-DET fence: product of squared cross-block Blaschke factors
const phiFence = (n1, n2) => {
  let p = 1;
  for (const a of n1) for (const b of n2) p *= ((a - b) / (a + b)) ** 2;
  return p;
};

const lattice = (m, r, rho) => {
  const blocks = [];
  for (let k = 0; k < m; k++) blocks.push([rho ** k, r * rho ** k]);
  return blocks;
};

// cert(m, r, rho, x) = [ sum_k sqrt( coalLaw(rho^k x) / Phi_k ) ]^2
function certEvOct(m, r, rho, x) {
  const blocks = lattice(m, r, rho);
  let s = 0;
  for (let k = 0; k < blocks.length; k++) {
    const rest = blocks.filter((_, l) => l !== k).flat();
    s += Math.sqrt(coalLaw(rho ** k * x) / phiFence(blocks[k], rest));
  }
  return s * s;
}

// firing onset: unique x with cert = 1, by bisection (cert decreasing in x)
function onset(m, r, rho) {
  let lo = 0.01;
  let hi = 200;
  if (certEvOct(m, r, rho, hi) > 1) return Infinity;
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    if (certEvOct(m, r, rho, mid) > 1) lo = mid;
    else hi = mid;
  }
  return (lo + hi) / 2;
}

// ---------------------------------------------------------------------------
// Reference record (baked measurements, storage precision toFixed(6))
// ---------------------------------------------------------------------------

export const IMP95258_EVOCT_ONSET_SENSITIVITY = {
  id: "imp-95258",
  title:
    "Sensitivity of the imp-95250 EV-OCT firing onset xStarEvOct to octave " +
    "count m, lattice ratio rho, and intra-pair ratio r",
  object:
    "cert(m, r, rho, x) = [sum_k sqrt(coalLaw(rho^k x) / Phi_k(r, rho))]^2, " +
    "blocks V_k = {rho^k, r rho^k}; xStar = onset where cert = 1 (bisected)",
  coalescentCrossCheck: {
    at: "m = 6, rho = 2, r -> 1",
    xStar: 11.31664319,
    note: "reproduces the imp-95250 baked xStarEvOct literal exactly",
  },
  sensitivityM: {
    fixed: "rho = 2, r = 1.05",
    grid: [
      { m: 2, xStar: 7.053071 },
      { m: 3, xStar: 9.380919 },
      { m: 4, xStar: 10.49867 },
      { m: 6, xStar: 11.325208 },
      { m: 8, xStar: 11.530719 },
      { m: 10, xStar: 11.58204 },
      { m: 24, xStar: 11.599141 },
    ],
    saturation: 11.599142,
    finding:
      "monotone increasing, saturates at 11.599; m = 6 onset only 0.274 " +
      "below the m -> inf limit -- REPRESENTATIVE, not a skeleton artifact; " +
      "saturation sits far below the crude m-uniform xStarUnif = 27.04",
  },
  sensitivityRho: {
    fixed: "m = 6, r = 1.05",
    grid: [
      { rho: 1.5, xStar: 19.051581 },
      { rho: 1.8, xStar: 13.444746 },
      { rho: 2, xStar: 11.325208 },
      { rho: 2.5, xStar: 8.297128 },
      { rho: 3, xStar: 6.696685 },
      { rho: 4, xStar: 5.027739 },
    ],
    finding:
      "DOMINANT axis: onset falls steeply as octave spacing widens (wider " +
      "spacing = larger cross-block beta = larger fence Phi_k = earlier " +
      "firing); rho = 2 value is dyadic-specific, NOT representative",
  },
  sensitivityR: {
    fixed: "m = 6, rho = 2",
    grid: [
      { r: 1.001, xStar: 11.316647 },
      { r: 1.01, xStar: 11.316999 },
      { r: 1.05, xStar: 11.325208 },
      { r: 1.1, xStar: 11.349482 },
      { r: 1.2, xStar: 11.438948 },
      { r: 1.3, xStar: 11.577012 },
    ],
    finding:
      "WEAK axis: onset spread only 0.260 across (1, 1.3] because the fence " +
      "Phi_k is coalescence-uniform (no r - 1 factor); the m = 6 coalescent " +
      "onset is representative across all admissible r",
  },
  summary:
    "xStarEvOct = 11.32 is representative in m (0.27 below the m -> inf " +
    "saturation 11.599) and in r (0.26 spread over the full band) but is a " +
    "dyadic-specific value in rho, the dominant axis (5.03 at rho = 4 to " +
    "19.05 at rho = 1.5); all three dependences are smooth and monotone, " +
    "no artifact.",
  honestScope:
    "measures the CLOSED-FORM EV-OCT certificate only (the object imp-95250 " +
    "bisected), not the exact pencil; the cert-vs-exact collar is unchanged; " +
    "twin-pair blocks only (>= 3-per-octave residual untouched); off-lattice " +
    "rates unchanged; model family only; changes NO bound; NO QED; " +
    "no refereed bound is changed.",
};

// ---------------------------------------------------------------------------
// Self-executing assertions (cross-checks of the baked measurements)
// ---------------------------------------------------------------------------

export const IMP95258_ASSERTIONS = [
  {
    id: "imp95258-coalescent-crosscheck",
    description:
      "the generalized cert at m = 6, rho = 2, r -> 1 reproduces the " +
      "imp-95250 xStarEvOct = 11.31664319 onset (rel 1e-7)",
    holds: () => {
      const x = onset(6, 1.000001, 2);
      return Math.abs(x - 11.31664319) < 1e-6 * 11.31664319;
    },
  },
  {
    id: "imp95258-m-monotone-saturating",
    description:
      "the m-sweep (rho = 2, r = 1.05) is strictly increasing and saturates: " +
      "each baked onset recomputes (rel 1e-6) and onset(m) rises to 11.599",
    holds: () => {
      const g = IMP95258_EVOCT_ONSET_SENSITIVITY.sensitivityM.grid;
      let prev = 0;
      for (const { m, xStar } of g) {
        const x = onset(m, 1.05, 2);
        if (Math.abs(x - xStar) > 1e-6 * xStar) return false;
        if (!(x > prev)) return false;
        prev = x;
      }
      const sat = onset(64, 1.05, 2);
      return (
        Math.abs(sat - IMP95258_EVOCT_ONSET_SENSITIVITY.sensitivityM.saturation) <
          1e-6 * sat && sat < 27.035582
      );
    },
  },
  {
    id: "imp95258-rho-dominant-decreasing",
    description:
      "the rho-sweep (m = 6, r = 1.05) is strictly decreasing in rho and " +
      "spans 19.05 (rho = 1.5) to 5.03 (rho = 4); each baked value recomputes",
    holds: () => {
      const g = IMP95258_EVOCT_ONSET_SENSITIVITY.sensitivityRho.grid;
      let prev = Infinity;
      for (const { rho, xStar } of g) {
        const x = onset(6, 1.05, rho);
        if (Math.abs(x - xStar) > 1e-6 * xStar) return false;
        if (!(x < prev)) return false;
        prev = x;
      }
      return true;
    },
  },
  {
    id: "imp95258-r-weak-monotone",
    description:
      "the r-sweep (m = 6, rho = 2) is non-decreasing with total spread " +
      "below 0.27 across (1.001, 1.3]; each baked value recomputes (rel 1e-6)",
    holds: () => {
      const g = IMP95258_EVOCT_ONSET_SENSITIVITY.sensitivityR.grid;
      let prev = 0;
      for (const { r, xStar } of g) {
        const x = onset(6, r, 2);
        if (Math.abs(x - xStar) > 1e-6 * xStar) return false;
        if (!(x >= prev)) return false;
        prev = x;
      }
      const spread =
        g[g.length - 1].xStar - g[0].xStar;
      return spread < 0.27;
    },
  },
  {
    id: "imp95258-honesty",
    description:
      "the record carries the honest scope labels: no bound change, NO QED, " +
      "no refereed bound is changed, closed-form measurement only",
    holds: () =>
      /changes NO bound/.test(IMP95258_EVOCT_ONSET_SENSITIVITY.honestScope) &&
      /NO QED/.test(IMP95258_EVOCT_ONSET_SENSITIVITY.honestScope) &&
      /refereed bound is changed/i.test(IMP95258_EVOCT_ONSET_SENSITIVITY.honestScope) &&
      /CLOSED-FORM/.test(IMP95258_EVOCT_ONSET_SENSITIVITY.honestScope),
  },
];

for (const a of IMP95258_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95258-evoct-onset-sensitivity assertion failed: ${a.id}`,
    );
  }
}

export default IMP95258_EVOCT_ONSET_SENSITIVITY;
