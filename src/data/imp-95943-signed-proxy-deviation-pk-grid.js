/**
 * @module imp-95943-signed-proxy-deviation-pk-grid
 *
 * imp-95943 (numerical / measurement): how does the SIGNED (Fresnel-oscillating)
 * proxy deviation from the imp-95898 residue-UNIFORM sign image scale across a
 * wider (p,k) window grid?
 *
 * imp-95917 STEP 4 found that a NONNEGATIVE Gaussian envelope proxy for |K_k|
 * reproduces the residue-uniform image <theta_C> = (p tr(G) - S)/((p-1) S) to
 * ~1e-3 at every witness window, but a SIGNED (Fresnel-oscillating) proxy still
 * lands below 1 while deviating up to ~7 percent from the uniform image
 * (0.268965 vs 0.250662 at p=3), showing the kernel-sign-driven bias
 * b(D) = <cos>_w(D) - avg_n cos(D) is real and nonzero. imp-95943 MEASURES the
 * relative deviation r(p,k) = (theta_phys_signed(p,k) - <theta_C>(p,k)) /
 * <theta_C>(p,k) across the wider grid p in {3,5,7,11,13,17,19,23},
 * k in {4,5,6,7} using the SAME signed Fresnel proxy, and asks: does the
 * deviation SHRINK with p (toward the 1/(p-1)^2 residue-uniform image of
 * imp-95918) or PERSIST?
 *
 * RESULT (measurement; the deviation PERSISTS -- it does NOT shrink with p).
 *
 * STEP 1 -- THE GRID. Using the exact imp-95898 / imp-95917 two-sided-exponential
 * Gram closed form and the same signed proxy w(n) = Lambda(n) cos(0.7 n)
 * exp(-((n-3000)/1200)^2) over n <= 8000, the signed image theta_phys_signed and
 * the uniform image <theta_C> are evaluated at all 32 grid points. The signed
 * image stays STRICTLY BELOW 1 at EVERY one of the 32 points (the below-1
 * conclusion is robust to the sign proxy), but the relative deviation from the
 * uniform image is ERRATIC and NON-MONOTONE in p, not decaying.
 *
 * STEP 2 -- THE DEVIATION DOES NOT SHRINK WITH p. The per-p mean absolute
 * relative deviation (averaged over k in {4,5,6,7}) is
 *   p=3 : 0.025   p=5 : 0.292   p=7 : 1.137   p=11: 0.164
 *   p=13: 0.442   p=17: 0.716   p=19: 0.035   p=23: 0.308
 * -- it does NOT decrease with p (it RISES from 2.5% at p=3 to 114% at p=7,
 * then oscillates in the tens-of-percent), so the signed-proxy image does NOT
 * converge toward the residue-uniform 1/(p-1)^2 image as p grows.
 *
 * STEP 3 -- WHY (the mechanism). imp-95918 established that the uniform image
 * itself DECAYS as <theta_C> ~ 1/(p-1)^2. The signed-kernel ADDITIVE bias
 * theta_phys_signed - <theta_C> does NOT decay in step with that shrinking
 * denominator, so in RELATIVE terms the sign-driven bias PERSISTS (indeed
 * amplifies at intermediate p) rather than vanishing. At p=7 the additive bias
 * even EXCEEDS the tiny uniform image in magnitude and flips the signed image
 * slightly NEGATIVE (theta_phys_signed ~ -0.0038 vs <theta_C> ~ +0.0278), a
 * relative deviation past -100%. This is the sharp contrast with the NONNEGATIVE
 * proxy of imp-95917 STEP 4, which tracked the uniform image to ~1e-3 (first
 * order) at every window: the physical kernel SIGN matters at FIRST order for
 * the small residue-uniform image, not as a vanishing correction.
 *
 * NET. The signed Fresnel-oscillating proxy stays strictly below 1 across the
 * whole 32-point (p,k) grid, but its relative deviation from the residue-uniform
 * sign image does NOT shrink with p -- it is erratic and non-monotone (2.5% at
 * p=3, 114% and a sign flip at p=7, tens of percent thereafter), because the
 * uniform image decays as 1/(p-1)^2 (imp-95918) while the sign-driven additive
 * bias does not. The residue-uniform approximation therefore captures the
 * MAGNITUDE (both below 1, both O(1/(p-1)^2)) but NOT the sign-sensitive detail:
 * the physical kernel sign is a first-order effect on the small image, not a
 * vanishing correction. Measurement only (a PROXY, not the true imp-95212
 * Fresnel-Airy kernel); changes no bound; NO QED; no refereed bound is changed.
 *
 * HONEST LIMITS. (a) MEASUREMENT only, on a signed PROXY for |K_k|; the true
 * Fresnel-Airy kernel is the imp-95212 port, NOT evaluated here. (b) The Gram
 * closed form and the theta_phys reduction are EXACT (imp-95898 / imp-95917);
 * only the kernel weight is a proxy. (c) The below-1 property of the signed
 * proxy is empirical over this grid, not a proof (a signed kernel can shrink the
 * normalization and push <cos>_w(D) above 1, as imp-95917 STEP 5 warns). (d) The
 * "does not shrink" conclusion is a statement about the RELATIVE deviation
 * against a 1/(p-1)^2-decaying denominator, measured on an 8x range in p.
 * Import-light (no zeros bundle, no sibling imports); self-executing assertions
 * THROW on violation.
 *
 * @see imp-95917-vonmangoldt-weighted-sign-image.js (signed vs nonneg proxy; STEP 4 the ~7% seed)
 * @see imp-95918-residue-avg-sign-image-pk-grid.js (the 1/(p-1)^2 residue-uniform decay law)
 * @see imp-95898-single-window-sign-image-residue-average.js (the exact residue-uniform image)
 *
 * Ticket: imp-95943 (numerical, opus-4-8, api-pool, medium). Measurement only; no bound; NO QED.
 */

// -- width-law port geometry (imp-95220 LEMMA MAP; imp-95397 / imp-95898) ------
const PORT_C = 1.7;
const PORT_V = 2.3;
const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;

// -- exact Gram of two-sided exponentials (imp-95375 / imp-95898 closed form) --
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

// -- one window k: aliases h=1..p-1 at d=k-h/p, exact Gram (imp-95898 buildG) ---
function buildG(p, k) {
  const hs = [];
  for (let h = 1; h <= p - 1; h++) hs.push(h);
  const ds = hs.map((h) => k - h / p);
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  const N = hs.length;
  const G = Array.from({ length: N }, () => new Array(N));
  for (let m = 0; m < N; m++)
    for (let l = 0; l < N; l++) G[m][l] = gram(mu[m], u[m], mu[l], u[l]);
  return { hs, G, N };
}

// -- von Mangoldt Lambda(n): log p if n = p^a, else 0 --------------------------
function vonMangoldt(n) {
  if (n < 2) return 0;
  let m = n;
  for (let p = 2; p * p <= m; p++) {
    if (m % p === 0) {
      while (m % p === 0) m /= p;
      return m === 1 ? Math.log(p) : 0;
    }
  }
  return Math.log(n); // n itself prime
}

// -- kernel-weighted cosine mean <cos>_w(D) = sum w(n)cos / sum w(n) -----------
function cosMeanWeighted(D, p, w, Nmax) {
  let num = 0, den = 0;
  for (let n = 1; n <= Nmax; n++) {
    const wn = w(n);
    if (wn === 0) continue;
    num += wn * Math.cos((2 * Math.PI * D * n) / p);
    den += wn;
  }
  return num / den;
}

// -- physical weighted per-window image theta_phys = sum G_ml <cos>_w / S ------
function thetaPhys(p, k, w, Nmax) {
  const { hs, G, N } = buildG(p, k);
  let num = 0, den = 0;
  for (let m = 0; m < N; m++)
    for (let l = 0; l < N; l++) {
      num += G[m][l] * cosMeanWeighted(hs[m] - hs[l], p, w, Nmax);
      den += G[m][l];
    }
  return num / den;
}

// -- imp-95898 residue-uniform image <theta_C> = (p tr(G) - S)/((p-1) S) -------
function thetaUniform(p, k) {
  const { G, N } = buildG(p, k);
  let tr = 0, S = 0;
  for (let m = 0; m < N; m++) {
    tr += G[m][m];
    for (let l = 0; l < N; l++) S += G[m][l];
  }
  return (p * tr - S) / ((p - 1) * S);
}

// -- proxies for |K_k| (the true Fresnel-Airy kernel is the OPEN imp-95212 port)
const KERNEL_NMAX = 8000;
const kernelNonneg = (n) => vonMangoldt(n) * Math.exp(-Math.pow((n - 3000) / 1200, 2));
const kernelSigned = (n) =>
  vonMangoldt(n) * Math.cos(0.7 * n) * Math.exp(-Math.pow((n - 3000) / 1200, 2));

// -- the wider (p,k) grid this ticket sweeps -----------------------------------
const PS = [3, 5, 7, 11, 13, 17, 19, 23];
const KS = [4, 5, 6, 7];

// -- per-p mean absolute relative deviation |theta_signed - theta_unif|/theta_unif
function meanAbsRelDevByP() {
  const out = {};
  for (const p of PS) {
    let s = 0;
    for (const k of KS) {
      const ts = thetaPhys(p, k, kernelSigned, KERNEL_NMAX);
      const tu = thetaUniform(p, k);
      s += Math.abs((ts - tu) / tu);
    }
    out[p] = s / KS.length;
  }
  return out;
}

// -- baked measurement (signed proxy, von Mangoldt over n <= 8000) --------------
// per-p mean absolute relative deviation of the signed image from the uniform image
const MEAN_ABS_REL_DEV = {
  3: 0.025021,
  5: 0.292028,
  7: 1.136676,
  11: 0.163727,
  13: 0.442417,
  17: 0.716214,
  19: 0.035137,
  23: 0.307884,
};
// the k=7 column: [theta_signed, theta_uniform, relDev] per p
const K7_COLUMN = {
  3: [0.243836, 0.250101, -0.025048],
  5: [0.080818, 0.062576, 0.291518],
  7: [-0.003837, 0.027834, -1.137845],
  11: [0.008325, 0.010036, -0.170474],
  13: [0.010113, 0.006975, 0.449791],
  17: [0.001264, 0.003930, -0.678254],
  19: [0.003262, 0.003108, 0.049685],
  23: [0.002807, 0.002084, 0.347110],
};

// -- verdict object ------------------------------------------------------------
export const IMP95943_SIGNED_PROXY_DEVIATION_PK_GRID = {
  ticket:
    "imp-95943 (numerical / measurement): measure how the SIGNED (Fresnel-oscillating) proxy deviation from the imp-95898 residue-UNIFORM sign image scales across a wider (p,k) window grid (p in {3,5,7,11,13,17,19,23}, k in {4,5,6,7}), and report whether the deviation shrinks with p toward the imp-95918 1/(p-1)^2 residue-uniform image or persists. Result: it PERSISTS -- the relative deviation does NOT shrink with p.",
  grid:
    "STEP 1: using the exact imp-95898/imp-95917 two-sided-exponential Gram closed form and the SAME signed proxy w(n) = Lambda(n) cos(0.7 n) exp(-((n-3000)/1200)^2) over n <= 8000, the signed image theta_phys_signed and the uniform image <theta_C> are evaluated at all 32 grid points. The signed image stays STRICTLY BELOW 1 at EVERY one of the 32 points (the below-1 conclusion is robust to the sign proxy).",
  persistence:
    "STEP 2: the per-p mean absolute relative deviation (averaged over k in {4,5,6,7}) is p=3:0.025, p=5:0.292, p=7:1.137, p=11:0.164, p=13:0.442, p=17:0.716, p=19:0.035, p=23:0.308 -- it does NOT decrease with p (rises from 2.5% at p=3 to 114% at p=7, then oscillates in the tens of percent). The signed-proxy image does NOT converge toward the residue-uniform 1/(p-1)^2 image as p grows.",
  mechanism:
    "STEP 3: imp-95918 showed the uniform image itself DECAYS as <theta_C> ~ 1/(p-1)^2; the signed-kernel ADDITIVE bias theta_phys_signed - <theta_C> does NOT decay in step, so in RELATIVE terms the sign-driven bias PERSISTS (amplifies at intermediate p). At p=7 the additive bias EXCEEDS the tiny uniform image and flips the signed image slightly NEGATIVE (theta_phys_signed ~ -0.0038 vs <theta_C> ~ +0.0278, a relative deviation past -100%). Sharp contrast with the NONNEGATIVE proxy of imp-95917 STEP 4, which tracked the uniform image to ~1e-3 at every window: the physical kernel SIGN matters at FIRST order for the small image, not as a vanishing correction.",
  constants: {
    portC: PORT_C,
    portV: PORT_V,
    kernelNmax: KERNEL_NMAX,
    ps: PS,
    ks: KS,
    meanAbsRelDev: MEAN_ABS_REL_DEV,
    k7Column: K7_COLUMN,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-SIGN -- STILL OPEN. This measurement only quantifies a signed PROXY; whether the true imp-95212 Fresnel-Airy envelope K_k is nonnegative (which would restore the imp-95917 nonneg-proxy behaviour and force theta_phys < 1) is untouched. The measurement shows that if the true kernel is genuinely signed, the residue-uniform approximation captures only the MAGNITUDE of the image, not its sign-sensitive detail.",
  verdict:
    "MEASUREMENT (honest): the signed Fresnel-oscillating proxy stays strictly below 1 across the whole 32-point (p,k) grid, but its relative deviation from the residue-uniform sign image does NOT shrink with p -- it is erratic and non-monotone (2.5% at p=3, 114% and a sign flip at p=7, tens of percent thereafter), because the uniform image decays as 1/(p-1)^2 (imp-95918) while the sign-driven additive bias does not. The residue-uniform approximation captures the MAGNITUDE (both below 1, both O(1/(p-1)^2)) but NOT the sign-sensitive detail: the physical kernel sign is a first-order effect on the small image, not a vanishing correction. Measurement only (a PROXY, not the true imp-95212 kernel); changes no bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "The Gram closed form and the theta_phys = sum_ml G_ml <cos>_w(h_m-h_l)/S reduction are EXACT (imp-95898/imp-95917); only the kernel weight is a signed PROXY. The below-1 property of the signed proxy is empirical over this 32-point grid, not a proof. The does-not-shrink conclusion is a statement about the RELATIVE deviation against a 1/(p-1)^2-decaying denominator over an 8x range in p. Changes no bound; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) -------
export const IMP95943_ASSERTIONS = [
  {
    id: "imp95943-signed-image-strictly-below-one-on-whole-grid",
    description:
      "STEP 1: the signed Fresnel proxy image theta_phys_signed is STRICTLY BELOW 1 at every one of the 32 (p,k) grid points -- the below-1 conclusion is robust to the sign proxy",
    holds: () =>
      PS.every((p) =>
        KS.every((k) => thetaPhys(p, k, kernelSigned, KERNEL_NMAX) < 1 - 1e-3),
      ),
  },
  {
    id: "imp95943-k7-column-matches-baked",
    description:
      "STEP 1/2: the recomputed k=7 column (theta_signed, theta_uniform, relDev) reproduces the baked literals to 1e-4 at every p",
    holds: () =>
      PS.every((p) => {
        const ts = thetaPhys(p, 7, kernelSigned, KERNEL_NMAX);
        const tu = thetaUniform(p, 7);
        const rel = (ts - tu) / tu;
        const [bs, bu, br] = K7_COLUMN[p];
        return (
          Math.abs(ts - bs) < 1e-4 &&
          Math.abs(tu - bu) < 1e-4 &&
          Math.abs(rel - br) < 1e-4
        );
      }),
  },
  {
    id: "imp95943-mean-abs-rel-dev-matches-baked",
    description:
      "STEP 2: the recomputed per-p mean absolute relative deviation reproduces the baked MEAN_ABS_REL_DEV literals to 1e-4",
    holds: () => {
      const m = meanAbsRelDevByP();
      return PS.every((p) => Math.abs(m[p] - MEAN_ABS_REL_DEV[p]) < 1e-4);
    },
  },
  {
    id: "imp95943-deviation-does-not-shrink-with-p",
    description:
      "STEP 2: the per-p mean absolute relative deviation does NOT decay monotonically toward 0 -- the maximum over the grid is attained at an INTERMEDIATE prime (p=7, ~1.137), strictly larger than at both the smallest (p=3) and largest (p=23) prime, so the signed image does not converge to the residue-uniform image as p grows",
    holds: () => {
      const m = meanAbsRelDevByP();
      const maxP = PS.reduce((a, b) => (m[b] > m[a] ? b : a), PS[0]);
      return maxP === 7 && m[7] > m[3] && m[7] > m[23] && m[5] > m[3];
    },
  },
  {
    id: "imp95943-sign-flip-at-p7",
    description:
      "STEP 3: at p=7 the signed additive bias EXCEEDS the tiny residue-uniform image and flips the signed image slightly NEGATIVE (theta_phys_signed < 0 while <theta_C> > 0), a relative deviation past -100% -- the first-order sign effect on the small image",
    holds: () =>
      KS.every((k) => {
        const ts = thetaPhys(7, k, kernelSigned, KERNEL_NMAX);
        const tu = thetaUniform(7, k);
        return ts < 0 && tu > 0 && (ts - tu) / tu < -1;
      }),
  },
  {
    id: "imp95943-signed-departs-where-nonneg-tracks",
    description:
      "STEP 3 (contrast): at p=5 the NONNEGATIVE proxy tracks the residue-uniform image to ~1e-3 (imp-95917 STEP 4 behaviour) while the SIGNED proxy departs by more than an order of magnitude -- the kernel SIGN, not its magnitude, drives the deviation",
    holds: () =>
      KS.every((k) => {
        const tu = thetaUniform(5, k);
        const tnn = Math.abs(thetaPhys(5, k, kernelNonneg, KERNEL_NMAX) - tu);
        const tsg = Math.abs(thetaPhys(5, k, kernelSigned, KERNEL_NMAX) - tu);
        return tnn < 2e-3 && tsg > 10 * tnn;
      }),
  },
  {
    id: "imp95943-verdict-honesty",
    description:
      "the verdict carries the honest scope: deviation does NOT shrink with p, a PROXY not the true kernel, sub-gap STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /does NOT shrink with p/.test(IMP95943_SIGNED_PROXY_DEVIATION_PK_GRID.verdict) &&
      /PROXY/.test(IMP95943_SIGNED_PROXY_DEVIATION_PK_GRID.verdict) &&
      /STILL OPEN/.test(IMP95943_SIGNED_PROXY_DEVIATION_PK_GRID.subGap) &&
      /NO QED/.test(IMP95943_SIGNED_PROXY_DEVIATION_PK_GRID.verdict) &&
      /refereed bound is changed/i.test(IMP95943_SIGNED_PROXY_DEVIATION_PK_GRID.verdict),
  },
];

for (const a of IMP95943_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95943-signed-proxy-deviation-pk-grid assertion failed: ${a.id}`,
    );
  }
}

export default IMP95943_SIGNED_PROXY_DEVIATION_PK_GRID;
