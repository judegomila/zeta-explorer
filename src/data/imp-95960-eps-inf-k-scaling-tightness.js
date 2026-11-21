/**
 * @module imp-95960-eps-inf-k-scaling-tightness
 *
 * imp-95960 (numerical / measurement): quantify how TIGHT the imp-95944 analytic
 * p-independent residual bound
 *   eps_p < (a*D)_max^2/2 = PORT_V^2/(2 PORT_C^2 k^{4/3}(k-1)^2)
 * is against the MEASURED saturation eps_inf(k), across a range of k. imp-95944
 * proved the bound and quoted the slack only at k=6 (analytic 3.358e-3 vs measured
 * eps_inf(6) ~ 6.62e-4, ~5x). The k-dependence of the tightness was never
 * tabulated. This module MEASURES eps_inf(k) for k in 4..12 at a plateaued p
 * (p=1009), reports the analytic bound, the ratio bound/measured, and checks
 * whether the k^{-4/3}(k-1)^{-2} scaling of the bound matches the measured
 * eps_inf(k) decay. Measurement only; changes NO bound; NO QED; no refereed bound is changed.
 *
 * SETUP (verbatim from imp-95898 / imp-95944). A seam window (p,k) carries p-1
 * alias packets h=1..p-1 at depth d_h = k - h/p; packet h is a two-sided
 * exponential of rate mu_h = d_h^{1/3}/PORT_C centred at u_h = PORT_V/d_h. With
 * the exact Gram closed form G_ml, tr = sum_m G_mm, S = sum_ml G_ml, the relative
 * residual on law (A) is eps_p := diagFrac*(p-1) - 1, diagFrac = tr/S. As p grows
 * the depths fill (k-1,k) uniformly and eps_p SATURATES to eps_inf(k) > 0.
 *
 * MEASURED TABLE (exact-Gram, quadrature-free; eps at p=1009, plateau increment
 * from p=601 is O(1e-7) so p=1009 is a faithful proxy for eps_inf).
 *   k    eps_inf(k)     bound (a*D)_max^2/2   ratio bound/measured
 *   4    2.628871e-3    1.601543e-2           6.0921
 *   5    1.213772e-3    6.690335e-3           5.5120
 *   6    6.611019e-4    3.357785e-3           5.0791   (imp-95944 k=6 witness)
 *   7    4.019447e-4    1.898576e-3           4.7235
 *   8    2.642819e-4    1.167379e-3           4.4172
 *   9    1.842214e-4    7.638789e-4           4.1465
 *   10   1.343433e-4    5.244565e-4           3.9039
 *   12   7.901617e-5    2.753177e-4           3.4843
 *
 * FINDINGS.
 *   (1) The imp-95944 bound is loose by a factor 3.5x .. 6.1x over k=4..12, and it
 *       TIGHTENS monotonically as k grows: the ratio bound/measured falls from
 *       6.0921 at k=4 to 3.4843 at k=12 (never below ~3.5, never above ~6.1 on
 *       this range). The k=6 slack ~5.08 reproduces the imp-95944 quote (~5x).
 *   (2) The bound and the measurement share the SAME qualitative decay but the
 *       bound OVER-predicts the decay rate: the measured consecutive-k ratio of
 *       eps_inf exceeds the bound ratio (= the k^{-4/3}(k-1)^{-2} prediction) at
 *       every step (e.g. k 4->5 measured 0.4617 vs predicted 0.4177), so eps_inf
 *       decays SLOWER than the analytic law. Over k=4..12 the log-log slope of the
 *       measured eps_inf is ~ -3.19, vs the bound slope ~ -3.70 (bound asymptote
 *       -10/3 = -3.333). That is exactly why the ratio bound/measured shrinks with
 *       k: the bound falls off faster than what it bounds.
 *
 * WHY (mechanism, no new bound). The bound uses the WORST-case packet separation
 * (a*D)_max = PORT_V/(PORT_C k^{2/3}(k-1)) with the deficit majorised by x^2/2 for
 * a single extreme equal-rate pair. The TYPICAL pair is closer than the extreme and
 * the depths are not exactly equal-rate, so the mean deficit rho_p (hence eps_inf)
 * sits well below (a*D)_max^2/2 and its k-decay is gentler than the pure
 * k^{-4/3}(k-1)^{-2} envelope of the worst pair. The bound stays valid (eps_inf(k)
 * < bound at every k, strictly) -- it is a correct upper bound that is a few times
 * loose and self-tightening in k.
 *
 * WHAT THIS DOES AND DOES NOT DO. It tabulates the k-dependent tightness of an
 * already-proved bound and reports the measured decay law. It changes NO numeric
 * bound; it establishes nothing new about the residue mean; the residue mean is
 * STILL NOT the physical per-window theta (the imp-95212 von Mangoldt x
 * Fresnel-Airy kernel weight A_{k,h} is untouched and STILL OPEN). NO QED.
 *
 * HONEST LIMITS. (a) MEASUREMENT of the exact residue-mean object only. (b) The
 * Gram closed form and eps_p = diagFrac*(p-1)-1 are EXACT (imp-95898/imp-95944).
 * (c) eps_inf(k) is read at p=1009 as a saturated proxy (plateau increment O(1e-7));
 * it is not extrapolated to p=infinity. (d) The k-decay slope is an empirical fit
 * over k=4..12, not a proved asymptotic. Import-light (no zeros bundle, no sibling
 * imports); self-executing assertions THROW on violation.
 *
 * @see imp-95944-residue-avg-sign-image-pminus1-asymptotic.js (the bound quantified here)
 * @see imp-95898-single-window-sign-image-residue-average.js (STEP 2 exact closed form)
 * @see imp-95918-residue-avg-sign-image-pk-grid.js (the empirical fits upgraded by imp-95944)
 *
 * Ticket: imp-95960 (numerical, opus-4-8, api-pool, medium). Measurement only; no bound; NO QED.
 */

// -- width-law port geometry (imp-95220 / imp-95898) ---------------------------
const PORT_C = 1.7;
const PORT_V = 2.3;
const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;

// -- exact Gram of two-sided exponentials (imp-95375 / imp-95898 closed form) ---
function gram(a, p, b, q) {
  if (p > q) {
    const ta = a, tp = p;
    a = b; p = q; b = ta; q = tp;
  }
  const D = q - p;
  if (a === b) return Math.exp(-a * D) * (D + 1 / a);
  const I1 = (Math.exp(-a * p - b * q) * Math.exp((a + b) * p)) / (a + b);
  const I3 = (Math.exp(a * p + b * q) * Math.exp(-(a + b) * q)) / (a + b);
  const I2 =
    (Math.exp(a * p - b * q) * (Math.exp((b - a) * q) - Math.exp((b - a) * p))) /
    (b - a);
  return I1 + I2 + I3;
}

// -- one window (p,k): relative residual eps_p = diagFrac*(p-1) - 1 -------------
function epsResidual(p, k) {
  const N = p - 1;
  const ds = [];
  for (let h = 1; h <= N; h++) ds.push(k - h / p);
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  let tr = 0, S = 0;
  for (let m = 0; m < N; m++)
    for (let l = 0; l < N; l++) {
      const g = gram(mu[m], u[m], mu[l], u[l]);
      S += g;
      if (m === l) tr += g;
    }
  return (tr / S) * (p - 1) - 1;
}

// -- p-independent residual bound (proved, imp-95944): (a*D)_max^2 / 2 at fixed k
function residualBound(k) {
  const aD = PORT_V / (PORT_C * Math.pow(k, 2 / 3) * (k - 1));
  return (aD * aD) / 2;
}

// -- baked measured table (eps at plateaued p=1009; exact-Gram, quadrature-free) -
const PLATEAU_P = 1009;
const K_GRID = [4, 5, 6, 7, 8, 9, 10, 12];
// epsInf: measured eps_p at p=1009; bound: (a*D)_max^2/2; ratio: bound/epsInf.
const TIGHTNESS = [
  { k: 4, epsInf: 2.628871e-3, bound: 1.601543e-2, ratio: 6.0921 },
  { k: 5, epsInf: 1.213772e-3, bound: 6.690335e-3, ratio: 5.5120 },
  { k: 6, epsInf: 6.611019e-4, bound: 3.357785e-3, ratio: 5.0791 },
  { k: 7, epsInf: 4.019447e-4, bound: 1.898576e-3, ratio: 4.7235 },
  { k: 8, epsInf: 2.642819e-4, bound: 1.167379e-3, ratio: 4.4172 },
  { k: 9, epsInf: 1.842214e-4, bound: 7.638789e-4, ratio: 4.1465 },
  { k: 10, epsInf: 1.343433e-4, bound: 5.244565e-4, ratio: 3.9039 },
  { k: 12, epsInf: 7.901617e-5, bound: 2.753177e-4, ratio: 3.4843 },
];
// empirical log-log slopes over k=4..12: measured eps_inf vs the analytic bound.
const MEASURED_SLOPE_K4_12 = -3.1901;
const BOUND_SLOPE_K4_12 = -3.6987; // asymptote -10/3 = -3.3333

// -- verdict object ------------------------------------------------------------
export const IMP95960_EPS_INF_K_TIGHTNESS = {
  ticket:
    "imp-95960 (numerical): measure eps_inf(k) against the imp-95944 analytic p-independent bound (a*D)_max^2/2 = PORT_V^2/(2 PORT_C^2 k^{4/3}(k-1)^2) across k in 4..12, reporting the ratio bound/measured and whether the k^{-4/3}(k-1)^{-2} scaling matches the measured eps_inf(k) decay. Measurement only; no bound; NO QED.",
  tightness:
    "The imp-95944 residual bound is loose by 3.5x..6.1x over k=4..12 and TIGHTENS monotonically as k grows: ratio bound/eps_inf falls 6.0921 (k=4) -> 5.0791 (k=6, reproducing the imp-95944 ~5x quote) -> 3.4843 (k=12). eps_inf(6)=6.611e-4 matches the imp-95944 measured plateau 6.62e-4.",
  scaling:
    "The bound and the measurement share the same qualitative decay but the bound OVER-predicts the rate: the measured consecutive-k ratio of eps_inf exceeds the k^{-4/3}(k-1)^{-2} prediction at every step (k 4->5 measured 0.4617 vs 0.4177), so eps_inf decays SLOWER than the analytic law. Over k=4..12 the log-log slope of measured eps_inf is ~-3.19 vs the bound slope ~-3.70 (bound asymptote -10/3). That gap is exactly why the ratio bound/measured shrinks with k.",
  mechanism:
    "The bound uses the worst-case packet separation (a*D)_max = PORT_V/(PORT_C k^{2/3}(k-1)) with the deficit majorised by x^2/2 for one extreme equal-rate pair. Typical pairs are closer and not exactly equal-rate, so the mean deficit (hence eps_inf) sits several-fold below the bound and decays more gently in k. The bound stays a correct strict upper bound at every k; it is a few times loose and self-tightening.",
  constants: {
    portC: PORT_C,
    portV: PORT_V,
    plateauP: PLATEAU_P,
    kGrid: K_GRID,
    tightness: TIGHTNESS,
    measuredSlopeK4to12: MEASURED_SLOPE_K4_12,
    boundSlopeK4to12: BOUND_SLOPE_K4_12,
  },
  obstruction:
    "UNCHANGED from imp-95944/imp-95898: the residue mean is NOT the physical per-window theta -- it drops the von Mangoldt x Fresnel-Airy weight A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p). The imp-95212 Fresnel-Airy envelope port is untouched and STILL OPEN. This module measures the tightness of an already-proved bound on the exact residue-mean object only.",
  verdict:
    "MEASUREMENT (honest): the imp-95944 p-independent bound eps_p < (a*D)_max^2/2 is confirmed strict at every k=4..12 and quantified -- loose by 3.5x..6.1x, tightening monotonically with k (5.08x at k=6, reproducing the imp-95944 ~5x). The measured eps_inf(k) decays slightly SLOWER than the bound (log-log slope -3.19 vs -3.70 over k=4..12) because the bound is a worst-pair envelope. Changes no numeric bound; the imp-95212 kernel-weighted residue-bias port is untouched and STILL OPEN; NO QED; no refereed bound is changed.",
  rigorScope:
    "The Gram closed form and eps_p = diagFrac*(p-1)-1 are EXACT (imp-95898/imp-95944). eps_inf(k) is read at p=1009 as a saturated proxy (plateau increment from p=601 is O(1e-7)); it is not extrapolated to p=infinity. The k-decay slope is an empirical log-log fit over k=4..12, not a proved asymptotic. Measurement only; changes no bound; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) --------
export const IMP95960_ASSERTIONS = [
  {
    id: "imp95960-baked-table-matches-exact-gram",
    description:
      "each baked eps_inf(k) reproduces the live exact-Gram eps_p at p=1009 to 1e-4 relative, and each baked bound reproduces residualBound(k) to 1e-5 relative (6-sig-fig storage), for every k in the grid",
    holds: () =>
      TIGHTNESS.every((row) => {
        const eLive = epsResidual(PLATEAU_P, row.k);
        const bLive = residualBound(row.k);
        return (
          Math.abs(eLive - row.epsInf) < 1e-4 * row.epsInf &&
          Math.abs(bLive - row.bound) < 1e-5 * row.bound &&
          Math.abs(row.ratio - row.bound / row.epsInf) < 1e-3 * row.ratio
        );
      }),
  },
  {
    id: "imp95960-bound-strictly-holds-every-k",
    description:
      "the imp-95944 bound is a strict upper bound at every k=4..12: 0 < eps_inf(k) < residualBound(k) (recomputed live, not from the baked table)",
    holds: () =>
      K_GRID.every((k) => {
        const e = epsResidual(PLATEAU_P, k);
        return e > 0 && e < residualBound(k);
      }),
  },
  {
    id: "imp95960-ratio-tightens-monotonically-in-k",
    description:
      "the ratio bound/eps_inf DECREASES monotonically as k grows (bound self-tightens), staying within [3.4, 6.1] over k=4..12 with the k=6 slack reproducing the imp-95944 ~5x quote",
    holds: () => {
      for (let i = 1; i < TIGHTNESS.length; i++)
        if (!(TIGHTNESS[i].ratio < TIGHTNESS[i - 1].ratio)) return false;
      const r4 = TIGHTNESS[0].ratio, r12 = TIGHTNESS[TIGHTNESS.length - 1].ratio;
      const r6 = TIGHTNESS.find((r) => r.k === 6).ratio;
      return r4 < 6.1 && r12 > 3.4 && r6 > 5.0 && r6 < 5.2;
    },
  },
  {
    id: "imp95960-measured-decays-slower-than-bound",
    description:
      "at every consecutive-k step the measured eps_inf ratio EXCEEDS the bound ratio (= the k^{-4/3}(k-1)^{-2} prediction), so eps_inf decays slower than the analytic law -- computed live from exact-Gram eps and residualBound",
    holds: () =>
      K_GRID.slice(1).every((k, i) => {
        const kPrev = K_GRID[i];
        const measRatio = epsResidual(PLATEAU_P, k) / epsResidual(PLATEAU_P, kPrev);
        const boundRatio = residualBound(k) / residualBound(kPrev);
        return measRatio > boundRatio;
      }),
  },
  {
    id: "imp95960-plateau-is-faithful",
    description:
      "eps_p is plateaued at p=1009: for every k the increment from p=601 to p=1009 is positive and below 5e-6, so the baked eps_inf(k) is a faithful saturated proxy",
    holds: () =>
      K_GRID.every((k) => {
        const inc = epsResidual(1009, k) - epsResidual(601, k);
        return inc > 0 && inc < 5e-6;
      }),
  },
  {
    id: "imp95960-loglog-slopes-bracket-the-gap",
    description:
      "the empirical log-log slopes over k=4..12 confirm eps_inf falls slower than the bound: measured slope ~-3.19 is above (less steep than) the bound slope ~-3.70, both recomputed live from the k=4 and k=12 endpoints",
    holds: () => {
      const lo = 4, hi = 12;
      const mSlope = Math.log(epsResidual(PLATEAU_P, hi) / epsResidual(PLATEAU_P, lo)) / Math.log(hi / lo);
      const bSlope = Math.log(residualBound(hi) / residualBound(lo)) / Math.log(hi / lo);
      return (
        Math.abs(mSlope - MEASURED_SLOPE_K4_12) < 1e-2 &&
        Math.abs(bSlope - BOUND_SLOPE_K4_12) < 1e-2 &&
        mSlope > bSlope
      );
    },
  },
  {
    id: "imp95960-verdict-honesty",
    description:
      "the verdict carries the honest scope: MEASUREMENT only, the bound confirmed strict and tightening, eps_inf decays slower, the imp-95212 port STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(IMP95960_EPS_INF_K_TIGHTNESS.verdict) &&
      /tightening/.test(IMP95960_EPS_INF_K_TIGHTNESS.verdict) &&
      /SLOWER/.test(IMP95960_EPS_INF_K_TIGHTNESS.verdict) &&
      /STILL OPEN/.test(IMP95960_EPS_INF_K_TIGHTNESS.obstruction) &&
      /NO QED/.test(IMP95960_EPS_INF_K_TIGHTNESS.verdict) &&
      /refereed bound is changed/i.test(IMP95960_EPS_INF_K_TIGHTNESS.verdict),
  },
];

for (const a of IMP95960_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95960-eps-inf-k-scaling-tightness assertion failed: ${a.id}`,
    );
  }
}

export default IMP95960_EPS_INF_K_TIGHTNESS;
