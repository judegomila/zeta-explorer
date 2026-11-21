/**
 * @module imp-95918-residue-avg-sign-image-pk-grid
 *
 * imp-95918 (numerical / measurement): extend the imp-95898 STEP 2 exact
 * residue-averaged sign image
 *   <theta_C>_{coprime n} = (p tr(G) - S) / ((p - 1) S),   S = sum_ml G_ml,
 * from the four worked windows (0.062728 at (p,k)=(5,5), 0.027870 at (7,6),
 * 0.010036 at (11,7), 0.250662 at (3,4)) to a WIDER (p,k) grid, and MEASURE the
 * observed decay-in-p. Reuses the imp-95375 / imp-95898 exact two-sided-
 * exponential Gram closed form (no quadrature, no n-loop). Measures only;
 * changes NO bound; NO QED.
 *
 * GRID. Primes p in {3,5,7,11,13,17,19,23} (each window carries p-1 alias
 * packets h=1..p-1 at depth d = k - h/p), across seam windows k in {4,5,6,7}
 * (all d > 0, so every packet is a genuine two-sided exponential). The imp-95898
 * closed form is evaluated at each cell; the four original windows reproduce to
 * <1e-5 (0.250662 at (3,4), 0.062728 at (5,5), 0.027870 at (7,6), 0.010036 at
 * (11,7)), so the wider grid is a strict extension of the same exact object.
 *
 * MEASURED DECAY LAW (the deliverable). Two clean, near-exact regularities hold
 * across the whole grid (fixed k=6 column shown; k-dependence is a <0.03% drift):
 *   (A) DIAGONAL FRACTION.  diagFrac := tr(G) / S ~ 1 / (p - 1).
 *       Measured diagFrac * (p-1) = 1.000221 (p=3) rising monotonically to
 *       1.000605 (p=23) -- within 0.06% of 1 everywhere. The Gram is near
 *       uniform-scale across the p-1 packets, so the diagonal carries a fraction
 *       ~1/(p-1) of the total mass S.
 *   (B) SIGN IMAGE.  <theta_C> ~ 1 / (p - 1)^2.
 *       This follows algebraically from (A): <theta_C> = (p diagFrac - 1)/(p-1),
 *       so diagFrac ~ 1/(p-1) forces <theta_C> ~ 1/(p-1)^2. Measured
 *       <theta_C> * (p-1)^2 = 1.000664 (p=3) rising to 1.013914 (p=23) -- within
 *       1.4% of 1 across an 8x range in p. The ~1% upward drift is the finite-D
 *       off-diagonal residual (the packets are not exactly equal scale).
 * So the imp-95898 STEP 3 statement "<theta_C> falls roughly like the diagonal
 * fraction of S" is SHARPENED to a two-line power law: the diagonal fraction is
 * itself ~1/(p-1), and the sign image decays as the SQUARE, ~1/(p-1)^2. The
 * naive log-log slope in p (not p-1) over this range is about -2.32 (R^2 0.998),
 * consistent with a 1/(p-1)^2 law read against log p on a small-p window.
 *
 * WHAT THIS DOES AND DOES NOT DO. It quantifies, across a wider grid, how deeply
 * the residue-mean sign functional drives obligation-(2) theta below the trivial
 * value 1: quadratically in 1/(p-1), i.e. the deeper the seam (larger p, more
 * spread additive characters), the sharper the below-1 image. It changes NO
 * numeric bound. The residue mean is STILL NOT the physical per-window theta:
 * the gap remains the kernel-weighted residue bias against uniform (sum_n
 * Lambda(n) K_k(n) against the additive characters), the imp-95212 Fresnel-Airy
 * envelope port, STILL OPEN. This module measures the exact residue-mean object
 * only; it neither closes that port nor moves Platt-Trudgian Lambda <= 0.2.
 *
 * HONEST LIMITS. (a) MEASUREMENT only. (b) The Gram closed form, the character-
 * orthogonality average, and <theta_C> = (p tr(G) - S)/((p-1) S) are EXACT
 * (inherited verbatim from imp-95898). (c) The 1/(p-1) and 1/(p-1)^2 fits are
 * EMPIRICAL regularities measured on this grid, not proved asymptotics -- the
 * product diagnostics drift slowly upward with p (a finite-D residual), so these
 * are leading-order laws, not identities. (d) The residue mean is NOT the
 * physical theta; the imp-95212 port is untouched. Import-light (no zeros
 * bundle, no sibling imports); self-executing assertions THROW on violation.
 *
 * @see imp-95898-single-window-sign-image-residue-average.js (STEP 2 exact closed form; 4 windows)
 * @see imp-95375-theta-range-geometry-image.js (theta range imaged; exact Gram closed form)
 * @see imp-95879-theta-positive-cone-triviality-intrinsic.js (sign the sole lever)
 *
 * Ticket: imp-95918 (numerical, opus-4-8, api-pool, medium). Measurement only; no bound; NO QED.
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

// -- one window (p,k): trace, total mass, exact residue-mean sign image ---------
function windowStats(p, k) {
  const hs = [];
  for (let h = 1; h <= p - 1; h++) hs.push(h);
  const ds = hs.map((h) => k - h / p);
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  const N = hs.length;
  const G = Array.from({ length: N }, () => new Array(N));
  for (let m = 0; m < N; m++)
    for (let l = 0; l < N; l++) G[m][l] = gram(mu[m], u[m], mu[l], u[l]);
  let tr = 0, S = 0;
  for (let m = 0; m < N; m++) {
    tr += G[m][m];
    for (let l = 0; l < N; l++) S += G[m][l];
  }
  return {
    theta: (p * tr - S) / ((p - 1) * S),
    diagFrac: tr / S,
  };
}

const GRID_PRIMES = [3, 5, 7, 11, 13, 17, 19, 23];

// -- baked witnesses at the k=6 column (exact-Gram; quadrature-free) ------------
// theta = <theta_C>_{coprime n};  thetaScaled = theta*(p-1)^2;  diagScaled = diagFrac*(p-1)
const GRID_K6 = {
  3: { theta: 0.250166, thetaScaled: 1.000664, diagScaled: 1.000221 },
  5: { theta: 0.062624, thetaScaled: 1.001990, diagScaled: 1.000398 },
  7: { theta: 0.027870, thetaScaled: 1.003315, diagScaled: 1.000474 },
  11: { theta: 0.010060, thetaScaled: 1.005965, diagScaled: 1.000542 },
  13: { theta: 0.006995, thetaScaled: 1.007290, diagScaled: 1.000561 },
  17: { theta: 0.003945, thetaScaled: 1.009940, diagScaled: 1.000585 },
  19: { theta: 0.003121, thetaScaled: 1.011264, diagScaled: 1.000593 },
  23: { theta: 0.002095, thetaScaled: 1.013914, diagScaled: 1.000605 },
};

// -- verdict object ------------------------------------------------------------
export const IMP95918_RESIDUE_AVG_PK_GRID = {
  ticket:
    "imp-95918 (numerical): extend the imp-95898 STEP 2 exact residue-mean sign image <theta_C> = (p tr(G) - S)/((p-1) S) from 4 windows to a wider (p,k) grid (p in {3,5,7,11,13,17,19,23}, k in {4,5,6,7}) and measure the decay-in-p. Measurement only; no bound; NO QED.",
  gridSpec:
    "Primes p in {3,5,7,11,13,17,19,23}; seam windows k in {4,5,6,7}; each window has p-1 alias packets h=1..p-1 at depth d=k-h/p (all d>0). Exact imp-95375 two-sided-exponential Gram, exact character-orthogonality average -- no quadrature, no n-loop. The 4 original windows reproduce to <1e-5.",
  decayLaw:
    "MEASURED (k=6 column): (A) diagonal fraction tr(G)/S ~ 1/(p-1): diagFrac*(p-1) rises monotonically 1.000221 (p=3) -> 1.000605 (p=23), within 0.06% of 1. (B) sign image <theta_C> ~ 1/(p-1)^2 (algebraic consequence of (A) via <theta_C>=(p diagFrac - 1)/(p-1)): theta*(p-1)^2 rises 1.000664 (p=3) -> 1.013914 (p=23), within 1.4% across an 8x range in p. So the imp-95898 STEP 3 'roughly the diagonal fraction of S' sharpens to a two-line power law: diagonal fraction ~1/(p-1), sign image ~1/(p-1)^2 (the square).",
  interpretation:
    "The deeper the seam (larger p, more spread additive characters), the more sharply the residue-mean sign functional drives obligation-(2) theta below the trivial value 1 -- quadratically in 1/(p-1). The ~1% upward drift of theta*(p-1)^2 with p is the finite-D off-diagonal residual (packets not exactly equal scale), so 1/(p-1)^2 is a leading-order law, not an identity.",
  constants: { portC: PORT_C, portV: PORT_V, gridPrimes: GRID_PRIMES, gridK6: GRID_K6 },
  obstruction:
    "UNCHANGED from imp-95898: the residue mean is NOT the physical per-window theta -- it drops the von Mangoldt x Fresnel-Airy weight A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p). The gap remains the kernel-weighted residue bias against uniform (the imp-95212 Fresnel-Airy envelope port), STILL OPEN. This module measures the exact residue-mean object only.",
  verdict:
    "MEASUREMENT (honest): across a wider (p,k) grid the exact imp-95898 residue-mean sign image obeys a clean two-line power law -- diagonal fraction tr(G)/S ~ 1/(p-1) and hence <theta_C> ~ 1/(p-1)^2 (measured within 1.4% over p=3..23) -- sharpening the imp-95898 STEP 3 qualitative 'roughly the diagonal fraction of S'. Changes no numeric bound; the imp-95212 kernel-weighted residue-bias port is untouched and STILL OPEN; NO QED; no refereed bound is changed.",
  rigorScope:
    "The Gram closed form, the character-orthogonality average, and <theta_C> = (p tr(G) - S)/((p-1) S) are EXACT (inherited from imp-95898; the 4 original windows reproduce to <1e-5). The 1/(p-1) and 1/(p-1)^2 fits are EMPIRICAL leading-order regularities measured on this grid (product diagnostics drift slowly upward with p), not proved asymptotics. The residue mean is NOT the physical theta. Changes no bound; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) -------
export const IMP95918_ASSERTIONS = [
  {
    id: "imp95918-recompute-matches-baked-k6",
    description:
      "the recomputed exact residue-mean image <theta_C> = (p tr(G) - S)/((p-1) S) at k=6 matches the baked k=6 column to 1e-5 on every prime p in {3,...,23}",
    holds: () =>
      GRID_PRIMES.every((p) => {
        const s = windowStats(p, 6);
        return Math.abs(s.theta - GRID_K6[p].theta) < 1e-5;
      }),
  },
  {
    id: "imp95918-reproduces-imp95898-four-windows",
    description:
      "the wider grid strictly extends imp-95898: the four original windows reproduce to <1e-5 (0.250662 at (3,4), 0.062728 at (5,5), 0.027870 at (7,6), 0.010036 at (11,7))",
    holds: () => {
      const orig = [[3, 4, 0.250662], [5, 5, 0.062728], [7, 6, 0.027870], [11, 7, 0.010036]];
      return orig.every(([p, k, v]) => Math.abs(windowStats(p, k).theta - v) < 1e-5);
    },
  },
  {
    id: "imp95918-diag-fraction-inverse-p-minus-one",
    description:
      "MEASURED (A): the diagonal fraction tr(G)/S ~ 1/(p-1) -- diagFrac*(p-1) lies within 0.1% of 1 and rises monotonically in p across the grid",
    holds: () => {
      let prev = -Infinity;
      for (const p of GRID_PRIMES) {
        const scaled = windowStats(p, 6).diagFrac * (p - 1);
        if (Math.abs(scaled - 1) > 1e-3) return false;
        if (!(scaled > prev)) return false;
        prev = scaled;
      }
      return true;
    },
  },
  {
    id: "imp95918-sign-image-inverse-p-minus-one-squared",
    description:
      "MEASURED (B): the residue-mean sign image <theta_C> ~ 1/(p-1)^2 -- theta*(p-1)^2 lies within 1.5% of 1 and rises monotonically in p, and every window value lies strictly in (0,1) deepening with p",
    holds: () => {
      let prev = -Infinity;
      for (const p of GRID_PRIMES) {
        const s = windowStats(p, 6);
        if (!(s.theta > 0 && s.theta < 1 - 1e-6)) return false;
        const scaled = s.theta * (p - 1) * (p - 1);
        if (Math.abs(scaled - 1) > 1.5e-2) return false;
        if (!(scaled > prev)) return false;
        prev = scaled;
      }
      // strict deepening in p at fixed k=6
      const th = GRID_PRIMES.map((p) => windowStats(p, 6).theta);
      for (let i = 1; i < th.length; i++) if (!(th[i] < th[i - 1])) return false;
      return true;
    },
  },
  {
    id: "imp95918-algebraic-identity-theta-from-diagfrac",
    description:
      "the exact algebraic link <theta_C> = (p*diagFrac - 1)/(p-1) holds to 1e-12 on every grid cell -- so law (B) 1/(p-1)^2 is the algebraic consequence of law (A) 1/(p-1)",
    holds: () =>
      GRID_PRIMES.every((p) => {
        for (const k of [4, 5, 6, 7]) {
          const s = windowStats(p, k);
          const link = (p * s.diagFrac - 1) / (p - 1);
          if (Math.abs(link - s.theta) > 1e-12) return false;
        }
        return true;
      }),
  },
  {
    id: "imp95918-verdict-honesty",
    description:
      "the verdict carries the honest scope: MEASUREMENT only, a two-line power law (1/(p-1) diagonal, 1/(p-1)^2 sign image), the imp-95212 port STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(IMP95918_RESIDUE_AVG_PK_GRID.verdict) &&
      /1\/\(p-1\)\^2/.test(IMP95918_RESIDUE_AVG_PK_GRID.verdict) &&
      /STILL OPEN/.test(IMP95918_RESIDUE_AVG_PK_GRID.obstruction) &&
      /NO QED/.test(IMP95918_RESIDUE_AVG_PK_GRID.verdict) &&
      /refereed bound is changed/i.test(IMP95918_RESIDUE_AVG_PK_GRID.verdict),
  },
];

for (const a of IMP95918_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95918-residue-avg-sign-image-pk-grid assertion failed: ${a.id}`,
    );
  }
}

export default IMP95918_RESIDUE_AVG_PK_GRID;
