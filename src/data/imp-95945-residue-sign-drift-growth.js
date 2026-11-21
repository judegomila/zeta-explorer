/**
 * @module imp-95945-residue-sign-drift-growth
 *
 * imp-95945 (numerical / measurement): extend the imp-95918 exact residue-mean
 * sign image
 *   <theta_C> = (p tr(G) - S) / ((p - 1) S),   S = sum_ml G_ml,
 * from primes p in {3..23} to a WIDER prime range p up to 101, across seam
 * windows k in {4,5,6,7}, and DECIDE whether the ~1.4% upward drift in
 * theta*(p-1)^2 (imp-95918 finding B, 1.000664 at p=3 rising to 1.013914 at
 * p=23) SATURATES (bounded finite-D residual) or KEEPS GROWING (a genuine
 * correction term). Reuses the imp-95375 / imp-95898 exact two-sided-exponential
 * Gram closed form (no quadrature, no n-loop). Measures only; changes NO bound;
 * NO QED.
 *
 * VERDICT: THE DRIFT DOES NOT SATURATE -- IT KEEPS GROWING, LINEARLY IN p.
 * Extending the k=6 column to p=101 gives theta*(p-1)^2 = 1.013914 (p=23) ->
 * 1.019214 (p=31) -> 1.033787 (p=53) -> 1.045710 (p=71) -> 1.065582 (p=101),
 * strictly monotone up with no sign of a plateau. The exact shape is a
 * near-perfect straight line in p:
 *   theta*(p-1)^2  =  A_k  +  B_k * p,    R^2 = 1.0000000 (max residual < 5e-6)
 * with an intercept A_k ~ 1 and a small positive slope B_k that shrinks with the
 * seam window k:
 *   k=4: A=0.994749, B=2.63412e-3   (crossover p* = A/B ~ 378)
 *   k=5: A=0.997575, B=1.21619e-3   (crossover p* ~ 820)
 *   k=6: A=0.998678, B=6.62420e-4   (crossover p* ~ 1508)
 *   k=7: A=0.999196, B=4.02746e-4   (crossover p* ~ 2481)
 *
 * CONSEQUENCE FOR THE ASYMPTOTIC. Because theta*(p-1)^2 grows linearly in p, the
 * finite-D off-diagonal residual is a GENUINE growing correction term, not a
 * bounded one. The exact behaviour is theta = (A_k + B_k p)/(p-1)^2. For small
 * primes p << p*_k the constant A_k ~ 1 dominates and theta ~ 1/(p-1)^2 -- the
 * imp-95918 measured law. But for p >> p*_k the linear term dominates and
 *   theta  ~  B_k / p,
 * so the TRUE deep-p leading asymptotic is ~1/p (with a k-dependent coefficient),
 * NOT 1/(p-1)^2. The imp-95918 1/(p-1)^2 fit is a small-p pre-asymptotic regime;
 * the crossover to the ~1/p tail sits at p ~ A_k/B_k (~378 at k=4, ~1508 at k=6),
 * far above the p=23 top of the imp-95918 window. This is precisely the
 * saturation-vs-growth question the imp-95918 HONEST LIMITS (c) flagged as
 * undecidable from an 8x range in p; the wider p-range settles it as GROWTH.
 *
 * WHAT THIS DOES AND DOES NOT DO. It characterizes the finite-D residue-mean
 * residual as a linear-in-p growing correction and identifies the resulting ~1/p
 * deep-p tail, sharpening (and correcting the asymptotic reading of) the
 * imp-95918 1/(p-1)^2 leading-order law. It changes NO numeric bound. The residue
 * mean is STILL NOT the physical per-window theta: the gap remains the
 * kernel-weighted residue bias against uniform (sum_n Lambda(n) K_k(n) against
 * the additive characters), the imp-95212 Fresnel-Airy envelope port, STILL OPEN.
 * This module measures the exact residue-mean object only; it neither closes that
 * port nor moves Platt-Trudgian Lambda <= 0.2.
 *
 * HONEST LIMITS. (a) MEASUREMENT only. (b) The Gram closed form, the character-
 * orthogonality average, and <theta_C> = (p tr(G) - S)/((p-1) S) are EXACT
 * (inherited verbatim from imp-95898/imp-95918; the imp-95918 k=6 column
 * reproduces to <1e-5). (c) The linear law theta*(p-1)^2 = A_k + B_k p is an
 * EMPIRICAL fit over p in [3,101] (R^2 = 1.0000000 here), extremely straight on
 * this range but not a proved identity; the ~1/p tail and the p ~ A_k/B_k
 * crossover are its numerical implication, not an analytic theorem. (d) The
 * residue mean is NOT the physical theta; the imp-95212 port is untouched.
 * Import-light (no zeros bundle, no sibling imports); self-executing assertions
 * THROW on violation.
 *
 * @see imp-95918-residue-avg-sign-image-pk-grid.js (the p in {3..23} grid whose drift this decides)
 * @see imp-95898-single-window-sign-image-residue-average.js (STEP 2 exact closed form)
 * @see imp-95375-theta-range-geometry-image.js (exact two-sided-exponential Gram closed form)
 *
 * Ticket: imp-95945 (numerical, opus-4-8, api-pool, medium). Measurement only; no bound; NO QED.
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

// -- one window (p,k): exact residue-mean sign image and diagonal fraction ------
function windowStats(p, k) {
  const N = p - 1;
  const mu = new Array(N), u = new Array(N);
  for (let h = 1; h <= N; h++) {
    const d = k - h / p;
    mu[h - 1] = muPort(d);
    u[h - 1] = uPort(d);
  }
  let tr = 0, S = 0;
  for (let m = 0; m < N; m++) {
    for (let l = 0; l < N; l++) {
      const g = gram(mu[m], u[m], mu[l], u[l]);
      S += g;
      if (m === l) tr += g;
    }
  }
  return { theta: (p * tr - S) / ((p - 1) * S), diagFrac: tr / S };
}

// -- ordinary-least-squares slope/intercept/R^2 of y vs x ----------------------
function ols(xs, ys) {
  const n = xs.length;
  let sx = 0, sy = 0, sxx = 0, sxy = 0;
  for (let i = 0; i < n; i++) { sx += xs[i]; sy += ys[i]; sxx += xs[i] * xs[i]; sxy += xs[i] * ys[i]; }
  const slope = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const icpt = (sy - slope * sx) / n;
  const ybar = sy / n;
  let ssr = 0, sst = 0, maxResid = 0;
  for (let i = 0; i < n; i++) {
    const pred = icpt + slope * xs[i];
    ssr += (ys[i] - pred) * (ys[i] - pred);
    sst += (ys[i] - ybar) * (ys[i] - ybar);
    maxResid = Math.max(maxResid, Math.abs(ys[i] - pred));
  }
  return { slope, icpt, r2: 1 - ssr / sst, maxResid };
}

// -- extended prime range p up to 101 ------------------------------------------
const EXT_PRIMES = [
  3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73,
  79, 83, 89, 97, 101,
];

// -- baked k=6 witnesses: thetaScaled = theta*(p-1)^2 (exact-Gram, quadrature-free)
const EXT_K6_THETASCALED = {
  3: 1.000664, 5: 1.001990, 7: 1.003315, 11: 1.005965, 13: 1.007290,
  17: 1.009940, 19: 1.011264, 23: 1.013914, 29: 1.017889, 31: 1.019214,
  37: 1.023188, 41: 1.025838, 43: 1.027163, 47: 1.029812, 53: 1.033787,
  59: 1.037761, 61: 1.039086, 67: 1.043060, 71: 1.045710, 73: 1.047035,
  79: 1.051009, 83: 1.053659, 89: 1.057634, 97: 1.062933, 101: 1.065582,
};

// -- baked linear-law fit coefficients theta*(p-1)^2 = A_k + B_k*p, per k -------
const LINEAR_FIT_K = {
  4: { A: 0.994749, B: 2.63412e-3, crossover: 377.6 },
  5: { A: 0.997575, B: 1.21619e-3, crossover: 820.2 },
  6: { A: 0.998678, B: 6.62420e-4, crossover: 1507.6 },
  7: { A: 0.999196, B: 4.02746e-4, crossover: 2481.0 },
};

// -- verdict object ------------------------------------------------------------
export const IMP95945_RESIDUE_SIGN_DRIFT_GROWTH = {
  ticket:
    "imp-95945 (numerical): extend the imp-95918 exact residue-mean sign image <theta_C> = (p tr(G) - S)/((p-1) S) from p in {3..23} to p up to 101 across k in {4,5,6,7}, and decide whether the theta*(p-1)^2 drift saturates or keeps growing. Measurement only; no bound; NO QED.",
  question:
    "imp-95918 finding (B) measured theta*(p-1)^2 drifting monotonically upward 1.000664 (p=3) -> 1.013914 (p=23), a finite-D residual on top of the 1/(p-1)^2 law, and flagged (HONEST LIMITS c) that whether it SATURATES or KEEPS GROWING is undecidable from an 8x range in p. This extends the exact imp-95898 closed form to p up to 101 to settle it.",
  finding:
    "THE DRIFT DOES NOT SATURATE -- IT KEEPS GROWING, LINEARLY IN p. At k=6, theta*(p-1)^2 rises monotonically 1.013914 (p=23) -> 1.019214 (p=31) -> 1.033787 (p=53) -> 1.045710 (p=71) -> 1.065582 (p=101), no plateau. The exact shape is a near-perfect straight line theta*(p-1)^2 = A_k + B_k*p with R^2 = 1.0000000 (max residual < 5e-6) across all k in {4,5,6,7}: intercept A_k ~ 1, small positive slope B_k shrinking with k (2.63412e-3 at k=4 down to 4.02746e-4 at k=7).",
  asymptotic:
    "Because theta*(p-1)^2 grows linearly in p, the finite-D off-diagonal residual is a GENUINE growing correction term. The exact behaviour is theta = (A_k + B_k p)/(p-1)^2: for p << p*_k = A_k/B_k the constant dominates and theta ~ 1/(p-1)^2 (the imp-95918 law), but for p >> p*_k the linear term dominates and theta ~ B_k/p, so the TRUE deep-p leading asymptotic is ~1/p (k-dependent coefficient), NOT 1/(p-1)^2. The crossover sits at p ~ 378 (k=4), 820 (k=5), 1508 (k=6), 2481 (k=7) -- far above the p=23 top of the imp-95918 window, so the 1/(p-1)^2 fit is a small-p pre-asymptotic regime.",
  constants: {
    portC: PORT_C,
    portV: PORT_V,
    extPrimes: EXT_PRIMES,
    extK6ThetaScaled: EXT_K6_THETASCALED,
    linearFitK: LINEAR_FIT_K,
  },
  obstruction:
    "UNCHANGED from imp-95918/imp-95898: the residue mean is NOT the physical per-window theta -- it drops the von Mangoldt x Fresnel-Airy weight A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p). The gap remains the kernel-weighted residue bias against uniform (the imp-95212 Fresnel-Airy envelope port), STILL OPEN. This module measures the exact residue-mean object only.",
  verdict:
    "MEASUREMENT (honest): extending the exact imp-95898 residue-mean sign image to p up to 101 SETTLES the imp-95918 saturation-vs-growth question -- the theta*(p-1)^2 drift KEEPS GROWING, following a near-perfect linear law theta*(p-1)^2 = A_k + B_k*p (R^2 = 1.0000000) with a small positive k-dependent slope. So the finite-D residual is a genuine growing correction and the true deep-p asymptotic is ~1/p (crossover at p ~ A_k/B_k, ~1508 at k=6), NOT the small-p 1/(p-1)^2 law. Changes no numeric bound; the imp-95212 kernel-weighted residue-bias port is untouched and STILL OPEN; NO QED; no refereed bound is changed.",
  rigorScope:
    "The Gram closed form, the character-orthogonality average, and <theta_C> = (p tr(G) - S)/((p-1) S) are EXACT (inherited from imp-95898/imp-95918; the imp-95918 k=6 column reproduces to <1e-5). The linear law theta*(p-1)^2 = A_k + B_k*p is an EMPIRICAL fit over p in [3,101] (R^2 = 1.0000000 here), extremely straight but not a proved identity; the ~1/p tail and the p ~ A_k/B_k crossover are its numerical implication, not an analytic theorem. The residue mean is NOT the physical theta. Changes no bound; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) -------
export const IMP95945_ASSERTIONS = [
  {
    id: "imp95945-recompute-matches-baked-k6",
    description:
      "the recomputed exact theta*(p-1)^2 at k=6 matches the baked extended column to 2e-6 on every prime p up to 101",
    holds: () =>
      EXT_PRIMES.every((p) => {
        const scaled = windowStats(p, 6).theta * (p - 1) * (p - 1);
        return Math.abs(scaled - EXT_K6_THETASCALED[p]) < 2e-6;
      }),
  },
  {
    id: "imp95945-reproduces-imp95918-subgrid",
    description:
      "the extension is a strict superset of the imp-95918 window: the p in {3..23} k=6 values reproduce the imp-95918 baked column (1.000664 at p=3, 1.013914 at p=23) to 2e-6",
    holds: () => {
      const sub = { 3: 1.000664, 5: 1.001990, 7: 1.003315, 11: 1.005965, 13: 1.007290, 17: 1.009940, 19: 1.011264, 23: 1.013914 };
      return Object.keys(sub).every((p) => {
        const P = Number(p);
        const scaled = windowStats(P, 6).theta * (P - 1) * (P - 1);
        return Math.abs(scaled - sub[p]) < 2e-6;
      });
    },
  },
  {
    id: "imp95945-drift-does-not-saturate",
    description:
      "MAIN FINDING: the theta*(p-1)^2 drift KEEPS GROWING -- strictly monotone up over the whole p in [3,101] range and clearly past the imp-95918 p=23 top value (1.065582 at p=101 >> 1.013914 at p=23), no plateau",
    holds: () => {
      let prev = -Infinity;
      for (const p of EXT_PRIMES) {
        const scaled = windowStats(p, 6).theta * (p - 1) * (p - 1);
        if (!(scaled > prev)) return false;
        prev = scaled;
      }
      const top = windowStats(101, 6).theta * 100 * 100;
      const p23 = windowStats(23, 6).theta * 22 * 22;
      return top > p23 + 0.05;
    },
  },
  {
    id: "imp95945-linear-law-in-p",
    description:
      "the drift follows a near-perfect linear law theta*(p-1)^2 = A_k + B_k*p across k in {4,5,6,7}: recomputed OLS gives R^2 > 0.99999, max residual < 1e-5, and a strictly positive slope, matching the baked coefficients to 2e-4",
    holds: () =>
      [4, 5, 6, 7].every((k) => {
        const ys = EXT_PRIMES.map((p) => windowStats(p, k).theta * (p - 1) * (p - 1));
        const fit = ols(EXT_PRIMES, ys);
        if (!(fit.r2 > 0.99999)) return false;
        if (!(fit.maxResid < 1e-5)) return false;
        if (!(fit.slope > 0)) return false;
        return (
          Math.abs(fit.icpt - LINEAR_FIT_K[k].A) < 2e-4 &&
          Math.abs(fit.slope - LINEAR_FIT_K[k].B) < 2e-4
        );
      }),
  },
  {
    id: "imp95945-crossover-to-one-over-p-tail",
    description:
      "the implied crossover p* = A_k/B_k (where the linear term overtakes the constant, so theta turns from ~1/(p-1)^2 to ~1/p) sits far above the imp-95918 p=23 window: p* ~ 378 (k=4) rising to ~2481 (k=7), matching the baked crossovers to 2%",
    holds: () =>
      [4, 5, 6, 7].every((k) => {
        const ys = EXT_PRIMES.map((p) => windowStats(p, k).theta * (p - 1) * (p - 1));
        const fit = ols(EXT_PRIMES, ys);
        const cross = fit.icpt / fit.slope;
        if (!(cross > 23)) return false;
        return Math.abs(cross - LINEAR_FIT_K[k].crossover) / LINEAR_FIT_K[k].crossover < 0.02;
      }),
  },
  {
    id: "imp95945-slope-shrinks-with-k",
    description:
      "the linear-law slope B_k shrinks monotonically with the seam window k (deeper seams drift more slowly), so the crossover to the ~1/p tail recedes to larger p as k grows",
    holds: () => {
      const bs = [4, 5, 6, 7].map((k) => LINEAR_FIT_K[k].B);
      for (let i = 1; i < bs.length; i++) if (!(bs[i] < bs[i - 1])) return false;
      const cs = [4, 5, 6, 7].map((k) => LINEAR_FIT_K[k].crossover);
      for (let i = 1; i < cs.length; i++) if (!(cs[i] > cs[i - 1])) return false;
      return true;
    },
  },
  {
    id: "imp95945-verdict-honesty",
    description:
      "the verdict carries the honest scope: MEASUREMENT only, drift KEEPS GROWING via a linear law, true deep-p asymptotic ~1/p not 1/(p-1)^2, the imp-95212 port STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /MEASUREMENT/.test(IMP95945_RESIDUE_SIGN_DRIFT_GROWTH.verdict) &&
      /KEEPS GROWING/.test(IMP95945_RESIDUE_SIGN_DRIFT_GROWTH.verdict) &&
      /1\/\(p-1\)\^2/.test(IMP95945_RESIDUE_SIGN_DRIFT_GROWTH.verdict) &&
      /STILL OPEN/.test(IMP95945_RESIDUE_SIGN_DRIFT_GROWTH.obstruction) &&
      /NO QED/.test(IMP95945_RESIDUE_SIGN_DRIFT_GROWTH.verdict) &&
      /refereed bound is changed/i.test(IMP95945_RESIDUE_SIGN_DRIFT_GROWTH.verdict),
  },
];

for (const a of IMP95945_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95945-residue-sign-drift-growth assertion failed: ${a.id}`,
    );
  }
}

export default IMP95945_RESIDUE_SIGN_DRIFT_GROWTH;
