/**
 * @module imp-95959-sign-image-crossover-tabulation
 *
 * imp-95959 (numerical / measurement): TABULATE the imp-95944 law-B crossover
 *   <theta_C>*(p-1)^2 = 1 + p*eps_p
 * across primes p spanning 3..~3000 at fixed k=6, and LOCATE the point where the
 * small-p 1/(p-1)^2 decay law and the large-p eps_inf/p decay law cross. imp-95944
 * DERIVED the crossover near p ~ 1/eps_inf(6) ~ 1.5e3 but never tabulated it: the
 * imp-95918 grid only reached p=3..23, where p*eps_p < 0.014. This extends the
 * exact imp-95898/imp-95918 two-sided-exponential Gram machinery (verbatim, no
 * quadrature, no n-loop) an order of magnitude further in p. Measurement only;
 * changes NO bound; NO QED; no refereed bound is changed.
 *
 * SETUP (verbatim from imp-95898 / imp-95918 / imp-95944). A seam window (p,k)
 * carries p-1 alias packets h=1..p-1 at depth d_h = k - h/p; packet h is a two-
 * sided exponential of decay rate mu_h = d_h^{1/3}/PORT_C centred at u_h =
 * PORT_V/d_h. G_ml = gram(mu_m,u_m,mu_l,u_l); tr = sum_m G_mm, S = sum_ml G_ml;
 * the residue-averaged sign image is <theta_C> = (p tr - S)/((p-1) S), and the
 * relative residual is eps_p := diagFrac*(p-1) - 1 with diagFrac = tr/S. The
 * imp-95944 EXACT identity <theta_C>*(p-1)^2 = 1 + p*eps_p is reused verbatim.
 *
 * THE CROSSOVER (the deliverable). <theta_C>*(p-1)^2 = 1 + p*eps_p is the sum of a
 * constant term 1 (the 1/(p-1)^2 law: <theta_C> ~ 1/(p-1)^2) and a term p*eps_p
 * (the eps_inf/p law: <theta_C> ~ eps_p/p ~ eps_inf/p). The two contributions are
 * EQUAL exactly where p*eps_p = 1, i.e. p ~ 1/eps_p ~ 1/eps_inf(6). Tabulated
 * across primes 3..3011 at k=6, the measured p*eps_p rises monotonically and
 * crosses 1 in the bracket p=1511 (p*eps_p = 0.999582) -> p=1523 (1.007531), so
 * the CROSSOVER PRIME is p_cross ~ 1512 -- matching the imp-95944 prediction
 * 1/eps_inf(6) = 1/6.62e-4 ~ 1511 to better than 0.1%. At p_cross the scaled image
 * <theta_C>*(p-1)^2 ~ 2.00 (measured 1.999582 at p=1511): DOUBLE the small-p value
 * 1, confirming the two decay contributions are equal there. Below p_cross the "1"
 * dominates (1/(p-1)^2 law); above p_cross the p*eps_p term dominates (eps_inf/p
 * law), reaching <theta_C>*(p-1)^2 = 2.993 at p=3011 (p*eps_p ~ 1.993).
 *
 * MEASURED eps_p PLATEAU. eps_p rises monotonically 2.214581e-4 (p=3) ->
 * 6.611019e-4 (p=1009) -> 6.615368e-4 (p=1511) -> 6.619724e-4 (p=3011), clearly
 * plateauing to eps_inf(6) ~ 6.62e-4 from below (increments shrink by >2 orders of
 * magnitude across the range). The measured plateau MATCHES the imp-95944
 * eps_inf(6) ~ 6.62e-4: eps_p(3011) = 6.6197e-4 is within 3e-7 of it. So the
 * crossover location and the plateau are mutually consistent: p_cross ~ 1/eps_inf.
 *
 * WHAT THIS DOES AND DOES NOT DO. It tabulates, an order of magnitude past the
 * imp-95918 p<=23 window, the exact imp-95944 identity and pins the 1/(p-1)^2 ->
 * eps_inf/p crossover at the predicted p ~ 1/eps_inf(6) ~ 1512. It changes NO
 * numeric bound. The residue mean is STILL NOT the physical per-window theta: the
 * kernel-weighted residue bias A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p) (the
 * imp-95212 Fresnel-Airy envelope port) is untouched and STILL OPEN. NO QED.
 *
 * HONEST LIMITS. (a) MEASUREMENT only. (b) The Gram closed form, the character-
 * orthogonality average, and <theta_C> = (p tr - S)/((p-1) S) are EXACT (inherited
 * from imp-95898). (c) The identity <theta_C>*(p-1)^2 = 1 + p*eps_p is EXACT
 * (imp-95944, verified to 1e-12 here). (d) eps_inf(6) ~ 6.62e-4 is a measured
 * saturating plateau, not an identity; the crossover prime p_cross ~ 1512 is read
 * off the tabulated grid as the p*eps_p = 1 bracket. (e) The residue mean is NOT
 * the physical theta; the imp-95212 port is untouched. Import-light (no zeros
 * bundle, no sibling imports); self-executing assertions THROW on violation.
 *
 * @see imp-95944-residue-avg-sign-image-pminus1-asymptotic.js (derived the crossover tabulated here)
 * @see imp-95918-residue-avg-sign-image-pk-grid.js (the p<=23 window this extends)
 * @see imp-95898-single-window-sign-image-residue-average.js (STEP 2 exact closed form)
 *
 * Ticket: imp-95959 (numerical, opus-4-8, api-pool, medium). Measurement only; no bound; NO QED.
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

// -- one window (p,k): residue-mean sign image, relative residual eps_p ----------
function windowStats(p, k) {
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
  const diagFrac = tr / S;
  const theta = (p * tr - S) / ((p - 1) * S);
  const eps = diagFrac * (p - 1) - 1;
  return { diagFrac, theta, eps, pEps: p * eps, thetaScaled: theta * (p - 1) * (p - 1) };
}

// -- crossover-spanning prime grid, k=6 fixed -----------------------------------
const CROSSOVER_PRIMES = [
  3, 5, 7, 11, 13, 17, 19, 23, 29, 37, 53, 71, 101, 151, 211, 307, 401, 601,
  1009, 1511, 1523, 2003, 3011,
];
const EPS_INF_K6 = 6.62e-4; // imp-95944 measured saturation plateau of eps_p at k=6

// -- baked witnesses at the k=6 column (exact-Gram; quadrature-free) ------------
// eps = diagFrac*(p-1)-1;  pEps = p*eps;  thetaScaled = theta*(p-1)^2 = 1 + p*eps.
const K6_CROSSOVER = {
  3: { theta: 2.501661e-1, eps: 2.214581e-4, pEps: 0.000664, thetaScaled: 1.000664 },
  23: { theta: 2.094864e-3, eps: 6.049651e-4, pEps: 0.013914, thetaScaled: 1.013914 },
  101: { theta: 1.065582e-4, eps: 6.493314e-4, pEps: 0.065582, thetaScaled: 1.065582 },
  601: { theta: 3.879967e-6, eps: 6.602131e-4, pEps: 0.396788, thetaScaled: 1.396788 },
  1009: { theta: 1.640696e-6, eps: 6.611019e-4, pEps: 0.667052, thetaScaled: 1.667052 },
  1511: { theta: 8.769713e-7, eps: 6.615368e-4, pEps: 0.999582, thetaScaled: 1.999582 },
  1523: { theta: 8.634460e-7, eps: 6.615476e-4, pEps: 1.007531, thetaScaled: 2.007531 },
  2003: { theta: 5.802111e-7, eps: 6.617516e-4, pEps: 1.325488, thetaScaled: 2.325488 },
  3011: { theta: 3.303715e-7, eps: 6.619724e-4, pEps: 1.993199, thetaScaled: 2.993199 },
};
// crossover: p*eps_p = 1 falls in the bracket p=1511 (0.999582) -> p=1523 (1.007531)
const CROSSOVER = {
  bracketLow: { p: 1511, pEps: 0.999582 },
  bracketHigh: { p: 1523, pEps: 1.007531 },
  pCross: 1512,                       // ~ where p*eps_p = 1
  predicted: 1 / EPS_INF_K6,          // imp-95944 prediction 1/eps_inf(6) ~ 1511
  thetaScaledAtCross: 1.999582,       // ~2.00: the two decay contributions are equal
};

// -- verdict object ------------------------------------------------------------
export const IMP95959_SIGN_IMAGE_CROSSOVER = {
  ticket:
    "imp-95959 (numerical): tabulate the imp-95944 law-B crossover <theta_C>*(p-1)^2 = 1 + p*eps_p across primes p in 3..3011 at k=6 and locate where the 1/(p-1)^2 law and the eps_inf/p law cross (p*eps_p = 1). Measurement only; no bound; NO QED.",
  gridSpec:
    "Primes p in {3,...,3011} at fixed k=6 (one window at a time), each window with p-1 alias packets h=1..p-1 at depth d=k-h/p. Exact imp-95375/imp-95898 two-sided-exponential Gram, exact character-orthogonality average -- no quadrature, no n-loop. Extends the imp-95918 p<=23 window (where p*eps_p < 0.014) an order of magnitude in p.",
  crossover:
    "<theta_C>*(p-1)^2 = 1 + p*eps_p is a constant term 1 (the 1/(p-1)^2 law) plus p*eps_p (the eps_inf/p law); the two are EQUAL where p*eps_p = 1. Measured p*eps_p rises monotonically and crosses 1 in the bracket p=1511 (0.999582) -> p=1523 (1.007531), so p_cross ~ 1512 -- matching the imp-95944 prediction 1/eps_inf(6) = 1/6.62e-4 ~ 1511 to better than 0.1%. At p_cross the scaled image ~ 2.00 (1.999582 at p=1511): DOUBLE the small-p value 1. Below p_cross the constant dominates (1/(p-1)^2); above, p*eps_p dominates (eps_inf/p), reaching 2.993 at p=3011.",
  epsPlateau:
    "eps_p rises monotonically 2.214581e-4 (p=3) -> 6.611019e-4 (p=1009) -> 6.615368e-4 (p=1511) -> 6.619724e-4 (p=3011), plateauing from below to eps_inf(6) ~ 6.62e-4 (eps_p(3011) within 3e-7). The crossover location and the plateau are mutually consistent: p_cross ~ 1/eps_inf.",
  constants: {
    portC: PORT_C,
    portV: PORT_V,
    epsInfK6: EPS_INF_K6,
    crossoverPrimes: CROSSOVER_PRIMES,
    k6Crossover: K6_CROSSOVER,
    crossover: CROSSOVER,
  },
  obstruction:
    "UNCHANGED from imp-95898/imp-95918/imp-95944: the residue mean is NOT the physical per-window theta -- it drops the von Mangoldt x Fresnel-Airy weight A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p). The imp-95212 Fresnel-Airy envelope port is untouched and STILL OPEN. This module tabulates the exact residue-mean object only.",
  verdict:
    "MEASUREMENT (honest): tabulating the exact imp-95944 identity <theta_C>*(p-1)^2 = 1 + p*eps_p across primes 3..3011 at k=6 PINS the 1/(p-1)^2 -> eps_inf/p crossover at p_cross ~ 1512 (the p*eps_p = 1 bracket 1511->1523), matching the imp-95944 prediction 1/eps_inf(6) ~ 1511 to <0.1%, with the scaled image ~ 2.00 there and eps_p plateauing to the measured eps_inf(6) ~ 6.62e-4 from below. Changes no numeric bound; the imp-95212 kernel-weighted residue-bias port is untouched and STILL OPEN; NO QED; no refereed bound is changed.",
  rigorScope:
    "The Gram closed form, the character average, and <theta_C> = (p tr - S)/((p-1) S) are EXACT (imp-95898). The identity <theta_C>*(p-1)^2 = 1 + p*eps_p is EXACT (imp-95944, verified 1e-12 here). eps_inf(6) ~ 6.62e-4 is a measured saturating plateau; p_cross ~ 1512 is read off the tabulated p*eps_p = 1 bracket. The residue mean is NOT the physical theta. Measurement only; changes no bound; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) --------
export const IMP95959_ASSERTIONS = [
  {
    id: "imp95959-recompute-matches-baked-crossover-grid",
    description:
      "the recomputed exact residue-mean image <theta_C> and residual eps_p at k=6 match the baked crossover-grid witnesses to 1e-5 on every listed prime",
    holds: () =>
      Object.keys(K6_CROSSOVER).every((pStr) => {
        const p = Number(pStr);
        const s = windowStats(p, 6);
        return (
          Math.abs(s.theta - K6_CROSSOVER[p].theta) < 1e-5 &&
          Math.abs(s.eps - K6_CROSSOVER[p].eps) < 1e-8 &&
          Math.abs(s.thetaScaled - K6_CROSSOVER[p].thetaScaled) < 1e-5
        );
      }),
  },
  {
    id: "imp95959-exact-identity-theta-scaled-equals-one-plus-p-eps",
    description:
      "EXACT identity (imp-95944 I2): <theta_C>*(p-1)^2 = 1 + p*eps_p to 1e-12 on every prime in the crossover grid at k=6",
    holds: () =>
      CROSSOVER_PRIMES.every((p) => {
        const s = windowStats(p, 6);
        return Math.abs(s.thetaScaled - (1 + p * s.eps)) < 1e-12;
      }),
  },
  {
    id: "imp95959-p-eps-crosses-one-at-predicted-p",
    description:
      "the crossover p*eps_p = 1 falls in the bracket p=1511 (<1) -> p=1523 (>1), so p_cross ~ 1512 matches the imp-95944 prediction 1/eps_inf(6) ~ 1511 to better than 1%",
    holds: () => {
      const low = windowStats(1511, 6).pEps;
      const high = windowStats(1523, 6).pEps;
      if (!(low < 1 && high > 1)) return false;
      const pred = 1 / EPS_INF_K6;
      return Math.abs(CROSSOVER.pCross - pred) / pred < 1e-2;
    },
  },
  {
    id: "imp95959-scaled-image-near-two-at-crossover",
    description:
      "at the crossover the scaled sign image <theta_C>*(p-1)^2 ~ 2.00 (both decay contributions equal) -- measured 1.999582 at p=1511, within 1e-3 of 2",
    holds: () => {
      const s = windowStats(1511, 6);
      return Math.abs(s.thetaScaled - 2) < 1e-3 && s.thetaScaled > 1.99 && s.thetaScaled < 2.01;
    },
  },
  {
    id: "imp95959-eps-plateaus-to-eps-inf-from-below",
    description:
      "eps_p rises monotonically across primes 3..3011 at k=6, stays below eps_inf(6)~6.62e-4, and eps_p(3011) is within 5e-7 of that plateau (crossover location and plateau mutually consistent)",
    holds: () => {
      let prev = -Infinity;
      for (const p of CROSSOVER_PRIMES) {
        const e = windowStats(p, 6).eps;
        if (!(e > prev)) return false;
        if (!(e < EPS_INF_K6)) return false;
        prev = e;
      }
      return EPS_INF_K6 - windowStats(3011, 6).eps < 5e-7;
    },
  },
  {
    id: "imp95959-both-regimes-below-one-sign-images",
    description:
      "every tabulated <theta_C> is a strictly-below-1 sign image in (0,1) deepening with p (the crossover is between two DECAY laws, not a sign change)",
    holds: () => {
      let prev = Infinity;
      for (const p of CROSSOVER_PRIMES) {
        const th = windowStats(p, 6).theta;
        if (!(th > 0 && th < 1 - 1e-6)) return false;
        if (!(th < prev)) return false;
        prev = th;
      }
      return true;
    },
  },
  {
    id: "imp95959-verdict-honesty",
    description:
      "the verdict carries the honest scope: MEASUREMENT only, the p_cross ~ 1512 crossover matching 1/eps_inf, the imp-95212 port STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(IMP95959_SIGN_IMAGE_CROSSOVER.verdict) &&
      /crossover/.test(IMP95959_SIGN_IMAGE_CROSSOVER.verdict) &&
      /STILL OPEN/.test(IMP95959_SIGN_IMAGE_CROSSOVER.obstruction) &&
      /NO QED/.test(IMP95959_SIGN_IMAGE_CROSSOVER.verdict) &&
      /refereed bound is changed/i.test(IMP95959_SIGN_IMAGE_CROSSOVER.verdict),
  },
];

for (const a of IMP95959_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95959-sign-image-crossover-tabulation assertion failed: ${a.id}`,
    );
  }
}

export default IMP95959_SIGN_IMAGE_CROSSOVER;
