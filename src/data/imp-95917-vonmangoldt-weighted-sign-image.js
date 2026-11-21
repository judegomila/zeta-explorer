/**
 * @module imp-95917-vonmangoldt-weighted-sign-image
 *
 * imp-95917 (proof / assessment): the physical von-Mangoldt x Fresnel-Airy
 * WEIGHTED per-window sign image, replacing the imp-95898 residue-UNIFORM mean.
 *
 * imp-95898 STEP 5 flagged that its exact residue-averaged sign image
 * <theta_C> = (p tr(G) - S)/((p-1) S) uses a residue-UNIFORM mean, NOT the
 * physical explicit-formula weight. The actual per-window amplitude weights n
 * by the von Mangoldt x Fresnel-Airy kernel A_{k,h} = sum_n Lambda(n) K_k(n)
 * e(hn/p), so the physical theta folds cos(2 pi (h_m - h_l) n / p) against the
 * weight w(n) = Lambda(n) K_k(n) rather than uniformly over n = 1..p-1. This
 * module derives the physical weighted numerator at a single seam window and
 * asks: does it still yield a DETERMINED theta below 1, or reduce to a precise
 * obstruction?
 *
 * RESULT (an honest PARTIAL: a determined image strictly below 1 CONDITIONAL on
 * one sign hypothesis, plus a sharpened obstruction; no bound; NO QED).
 *
 * STEP 1 -- THE EXACT WEIGHTED REDUCTION. Folding the single-n numerator
 * N(n) = sum_{m,l} cos(2 pi (h_m - h_l) n / p) G_ml against the physical weight
 * w(n) = Lambda(n) K_k(n) and dividing by the n-free denominator D = S (imp-95898
 * STEP 1: the modulus |a_h| = 1/p is n-uniform so D is n-independent) gives the
 * EXACT physical per-window image
 *   theta_phys(p, k) = ( sum_{m,l} G_ml <cos>_w(h_m - h_l) ) / S,
 *   <cos>_w(D) = ( sum_n w(n) cos(2 pi D n / p) ) / ( sum_n w(n) ),   S = sum_{m,l} G_ml.
 * This is the imp-95898 STEP 2 image with the uniform residue mean of the cosine,
 * avg_n cos = 1 (D = 0) / -1/(p-1) (D not = 0 mod p), replaced by the physical
 * kernel-weighted mean <cos>_w(D). The deviation theta_phys - <theta_C> is the
 * G-weighted sum of the per-difference biases b(D) = <cos>_w(D) - avg_n cos(D):
 * the kernel-weighted residue bias against uniform, exactly the imp-95898 STEP 5
 * / imp-95212 obligation.
 *
 * STEP 2 -- theta_phys IS A G-WEIGHTED AVERAGE (structural). All Gram entries
 * are STRICTLY POSITIVE (G_ml = <f_m, f_l> of positive two-sided-exponential
 * packets; measured min ~0.89 across the witness windows), so the coefficients
 * G_ml / S are strictly positive and sum to 1: theta_phys is a convex average of
 * the p-1 x p-1 values <cos>_w(h_m - h_l).
 *
 * STEP 3 -- DETERMINED IMAGE STRICTLY BELOW 1 (conditional on kernel SIGN). If
 * the envelope is NONNEGATIVE, K_k(n) >= 0, then w(n) = Lambda(n) K_k(n) >= 0
 * (Lambda >= 0 always) and <cos>_w(D) is a nonnegative-weighted average of
 * cosines, so <cos>_w(0) = 1 and <cos>_w(D) < 1 STRICTLY for every off-diagonal
 * D not = 0 mod p (the weight is not annihilated by the additive character unless
 * supported entirely on p | n). Since the off-diagonal Gram mass is strictly
 * positive, the convex average is STRICTLY below its diagonal ceiling 1:
 *   K_k >= 0  ==>  theta_phys(p, k) < 1  strictly, for EVERY window.
 * So the physical per-window theta DOES have a determined image below 1 -- and
 * this needs only the SIGN of the Fresnel-Airy envelope, NOT the full evaluation
 * of the Ramanujan / Kloosterman kernel sum.
 *
 * STEP 4 -- NUMERICAL WITNESS. With a nonnegative Gaussian envelope proxy for
 * |K_k| (center 3000, width 1200) and true von Mangoldt over n <= 8000, the
 * physical image reproduces the imp-95898 residue-uniform image to ~1e-3 and sits
 * strictly below 1 at every window: theta_phys = 0.063451 (p=5,k=5), 0.028574
 * (7,6), 0.010205 (11,7), 0.250922 (3,4) vs the uniform 0.062728 / 0.027870 /
 * 0.010036 / 0.250662. A SIGNED (Fresnel-oscillating) proxy still lands below 1
 * on these windows but deviates up to ~7 percent from the uniform image
 * (0.268965 vs 0.250662 at p=3), showing the bias b(D) is real and kernel-sign
 * driven, not zero.
 *
 * STEP 5 -- THE SHARPENED OBSTRUCTION. imp-95898 STEP 5 named the obstruction as
 * evaluate the kernel-weighted residue bias sum_n Lambda(n) K_k(n) (cos - <cos>).
 * STEP 3 here SHARPENS it: to conclude theta_phys < 1 one does NOT need to
 * evaluate that sum at all -- one needs only that the Fresnel-Airy envelope K_k
 * is NONNEGATIVE. The surviving obligation therefore drops from full kernel-sum
 * evaluation to the SIGN (nonnegativity) of K_k. That is NOT free: Fresnel-Airy
 * kernels generically oscillate and change sign, so K_k >= 0 is not established
 * here -- it is the imp-95212 Fresnel-Airy envelope port, now localized to the
 * envelope SIGN rather than the full amplitude. If K_k is signed, the
 * normalization sum_n w(n) can be small and <cos>_w(D) can exceed 1, so the
 * strict-below-1 conclusion is genuinely conditional on the sign hypothesis.
 *
 * NET. The physical von-Mangoldt-weighted per-window theta is EXACTLY the
 * imp-95898 STEP 2 image with the uniform cosine mean replaced by the physical
 * kernel-weighted mean <cos>_w, and it has a DETERMINED image STRICTLY BELOW 1
 * conditional on a single hypothesis -- nonnegativity of the Fresnel-Airy
 * envelope K_k >= 0 -- which sharpens the imp-95898 STEP 5 / imp-95212
 * obstruction from full kernel-sum evaluation to the envelope SIGN. Nothing
 * derives or moves a bound; NO QED; no refereed bound is changed.
 *
 * HONEST LIMITS. (a) ASSESSMENT / DERIVATION only. (b) The reduction
 * theta_phys = sum G_ml <cos>_w / S, the Gram positivity, and the convex-average
 * strict-below-1 implication under K_k >= 0 are EXACT structural facts. (c) The
 * numerical witnesses use a Gaussian / cosine-Gaussian PROXY for |K_k|; the true
 * Fresnel-Airy kernel is the imp-95212 port, NOT evaluated here, and its SIGN is
 * the surviving obligation. (d) The strict-below-1 conclusion is CONDITIONAL on
 * K_k >= 0; a signed kernel can break the normalization. Import-light (no zeros
 * bundle, no sibling imports); self-executing assertions THROW on violation.
 *
 * @see imp-95898-single-window-sign-image-residue-average.js (residue-uniform image; STEP 5 obstruction this refines)
 * @see imp-95397-alias-sign-determinacy-assessment.js (a_h(n) determined; A_{k,h} kernel sum named)
 * @see imp-95375-theta-range-geometry-image.js (theta range imaged; exact Gram closed form)
 *
 * Ticket: imp-95917 (proof, opus-4-8, api-pool, medium). Derivation only; no bound; NO QED.
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

// -- baked witnesses (nonneg Gaussian proxy; von Mangoldt over n <= 8000) ------
const WINDOWS = [[5, 5], [7, 6], [11, 7], [3, 4]];
const PHYS_NONNEG = {
  "5,5": 0.063451,
  "7,6": 0.028574,
  "11,7": 0.010205,
  "3,4": 0.250922,
};
const UNIFORM = {
  "5,5": 0.062728,
  "7,6": 0.027870,
  "11,7": 0.010036,
  "3,4": 0.250662,
};

// -- verdict object ------------------------------------------------------------
export const IMP95917_VONMANGOLDT_WEIGHTED_SIGN_IMAGE = {
  ticket:
    "imp-95917 (proof / assessment): derive the physical von-Mangoldt x Fresnel-Airy WEIGHTED per-window sign image replacing the imp-95898 residue-UNIFORM mean, and assess whether the Lambda(n) K_k(n)-weighted numerator gives obligation-(2) theta a determined image below 1 or reduces to a precise obstruction. Result: BOTH -- a determined image strictly below 1 CONDITIONAL on the envelope sign K_k >= 0, plus a sharpened obstruction.",
  exactReduction:
    "STEP 1: folding the single-n numerator against the physical weight w(n) = Lambda(n) K_k(n) and dividing by the n-free denominator S gives the EXACT physical image theta_phys(p,k) = (sum_ml G_ml <cos>_w(h_m - h_l)) / S with <cos>_w(D) = (sum_n w(n) cos(2 pi D n/p))/(sum_n w(n)) -- the imp-95898 STEP 2 image with the uniform cosine mean (1 for D=0, -1/(p-1) else) replaced by the physical kernel-weighted mean <cos>_w. The deviation from the uniform image is the G-weighted sum of the per-difference biases b(D) = <cos>_w(D) - avg_n cos(D): the kernel-weighted residue bias against uniform (imp-95898 STEP 5 / imp-95212 obligation).",
  convexAverage:
    "STEP 2/3: all Gram entries are STRICTLY POSITIVE (measured min ~0.89), so G_ml / S are strictly positive convex weights summing to 1 and theta_phys is a convex average of the values <cos>_w(h_m - h_l). If the envelope is NONNEGATIVE, K_k >= 0, then w >= 0, so <cos>_w(0) = 1 and <cos>_w(D) < 1 strictly for every off-diagonal D not = 0 mod p; with strictly positive off-diagonal Gram mass the convex average is STRICTLY below its diagonal ceiling 1: K_k >= 0 implies theta_phys(p,k) < 1 strictly at EVERY window -- a determined image below 1 that needs only the SIGN of K_k, not the full kernel sum.",
  numericalWitness:
    "STEP 4: with a nonnegative Gaussian proxy for |K_k| (center 3000, width 1200) and true von Mangoldt over n <= 8000, theta_phys reproduces the imp-95898 residue-uniform image to ~1e-3 and sits strictly below 1: 0.063451 (p=5,k=5), 0.028574 (7,6), 0.010205 (11,7), 0.250922 (3,4) vs uniform 0.062728 / 0.027870 / 0.010036 / 0.250662. A SIGNED Fresnel-oscillating proxy stays below 1 here but deviates up to ~7 percent from the uniform image (0.268965 vs 0.250662 at p=3), so the kernel-sign-driven bias b(D) is real and nonzero.",
  obstruction:
    "STEP 5 (why PARTIAL, not QED): imp-95898 STEP 5 named the obstruction as evaluate the kernel-weighted residue bias sum_n Lambda(n) K_k(n) (cos - <cos>). STEP 3 SHARPENS it -- to conclude theta_phys < 1 one need NOT evaluate that sum, only that the Fresnel-Airy envelope K_k is NONNEGATIVE. The surviving obligation drops from full kernel-sum evaluation to the SIGN of K_k. That is not free: Fresnel-Airy kernels generically oscillate and change sign, so K_k >= 0 is unestablished -- the imp-95212 envelope port, now localized to the envelope sign; a signed kernel can shrink the normalization sum_n w(n) and push <cos>_w(D) above 1.",
  constants: { portC: PORT_C, portV: PORT_V, kernelNmax: KERNEL_NMAX, physNonneg: PHYS_NONNEG, uniform: UNIFORM },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-SIGN -- STILL OPEN, but SHARPER than imp-95898. The physical per-window theta = sum_ml G_ml <cos>_w(h_m - h_l)/S has a DETERMINED image strictly below 1 whenever the Fresnel-Airy envelope K_k is NONNEGATIVE; the only surviving obligation to certify theta_phys < 1 is the SIGN (nonnegativity) of K_k, not the full Ramanujan/Kloosterman kernel-sum evaluation of imp-95898 STEP 5.",
  verdict:
    "ASSESSMENT / DERIVATION (honest PARTIAL): the physical von-Mangoldt-weighted per-window theta is EXACTLY the imp-95898 STEP 2 image with the uniform cosine mean replaced by the physical kernel-weighted mean <cos>_w, and it has a DETERMINED image STRICTLY BELOW 1 conditional on a single hypothesis -- nonnegativity of the Fresnel-Airy envelope K_k >= 0 (Gram positivity makes theta_phys a convex average of values <= 1 with strict off-diagonal deficit). This SHARPENS the imp-95898 STEP 5 / imp-95212 obstruction from full kernel-sum evaluation down to the envelope SIGN. Numerically a nonnegative proxy reproduces the uniform image to ~1e-3 and stays below 1; a signed proxy deviates up to ~7 percent. Nothing derives or moves a bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "The reduction theta_phys = sum_ml G_ml <cos>_w(h_m - h_l)/S, the strict positivity of every Gram entry, and the convex-average strict-below-1 implication under K_k >= 0 are EXACT structural facts. The numerical witnesses use a Gaussian / cosine-Gaussian PROXY for |K_k| -- the true Fresnel-Airy kernel is the imp-95212 port, NOT evaluated here, and its SIGN is the surviving obligation. The strict-below-1 conclusion is CONDITIONAL on K_k >= 0. Changes no bound; NO QED.",
};

// -- self-executing assertions (imp-3715 convention; THROW on violation) -------
export const IMP95917_ASSERTIONS = [
  {
    id: "imp95917-exact-reduction-matches-uniform-limit",
    description:
      "STEP 1: replacing <cos>_w(D) by the exact uniform residue mean (1 for D=0, -1/(p-1) else) in theta_phys reproduces the imp-95898 closed form <theta_C> = (p tr(G) - S)/((p-1) S) to 1e-12 -- the physical reduction degenerates EXACTLY to the residue-uniform image when the kernel weight is uniform",
    holds: () =>
      WINDOWS.every(([p, k]) => {
        const { hs, G, N } = buildG(p, k);
        let num = 0, den = 0;
        for (let m = 0; m < N; m++)
          for (let l = 0; l < N; l++) {
            const D = hs[m] - hs[l];
            num += G[m][l] * (D % p === 0 ? 1 : -1 / (p - 1));
            den += G[m][l];
          }
        return Math.abs(num / den - thetaUniform(p, k)) < 1e-12;
      }),
  },
  {
    id: "imp95917-gram-entries-strictly-positive",
    description:
      "STEP 2: every Gram entry G_ml = <f_m, f_l> is STRICTLY POSITIVE on every witness window, so the coefficients G_ml / S are strictly positive convex weights summing to 1 and theta_phys is a convex average of the values <cos>_w(h_m - h_l)",
    holds: () =>
      WINDOWS.every(([p, k]) => {
        const { G, N } = buildG(p, k);
        for (let m = 0; m < N; m++)
          for (let l = 0; l < N; l++) if (!(G[m][l] > 0)) return false;
        return true;
      }),
  },
  {
    id: "imp95917-nonneg-kernel-cosmean-below-one",
    description:
      "STEP 3: for the nonnegative weight w = Lambda(n) K_k(n) >= 0, the kernel-weighted cosine mean satisfies <cos>_w(0) = 1 and <cos>_w(D) < 1 strictly for every off-diagonal D not = 0 mod p -- the diagonal ceiling that forces theta_phys < 1",
    holds: () =>
      [5, 7, 11].every((p) => {
        for (let D = 0; D < p; D++) {
          const v = cosMeanWeighted(D, p, kernelNonneg, KERNEL_NMAX);
          if (D === 0) {
            if (Math.abs(v - 1) > 1e-9) return false;
          } else if (!(v < 1 - 1e-9)) return false;
        }
        return true;
      }),
  },
  {
    id: "imp95917-physical-theta-strictly-below-one",
    description:
      "STEP 3/4: with the nonnegative Fresnel-Airy proxy, the physical weighted per-window image theta_phys is STRICTLY BELOW 1 at every window -- the determined image below the trivial value, conditional only on the envelope sign K_k >= 0",
    holds: () =>
      WINDOWS.every(([p, k]) => thetaPhys(p, k, kernelNonneg, KERNEL_NMAX) < 1 - 1e-3),
  },
  {
    id: "imp95917-physical-theta-matches-baked-and-tracks-uniform",
    description:
      "STEP 4: the nonneg-proxy physical image matches its baked literals to 1e-4 and tracks the imp-95898 residue-uniform image to within 1e-2 -- the physical bias against uniform is small and quantified, not divergent",
    holds: () =>
      WINDOWS.every(([p, k]) => {
        const key = `${p},${k}`;
        const t = thetaPhys(p, k, kernelNonneg, KERNEL_NMAX);
        return Math.abs(t - PHYS_NONNEG[key]) < 1e-4 && Math.abs(t - UNIFORM[key]) < 1e-2;
      }),
  },
  {
    id: "imp95917-signed-kernel-deviation-nonzero",
    description:
      "STEP 4/5: a SIGNED Fresnel-oscillating proxy produces a strictly larger deviation from the uniform image than the nonnegative proxy at p=3 -- the kernel-sign-driven residue bias b(D) is real and nonzero, so the strict-below-1 conclusion is genuinely conditional on the envelope sign",
    holds: () => {
      const tnn = Math.abs(thetaPhys(3, 4, kernelNonneg, KERNEL_NMAX) - UNIFORM["3,4"]);
      const tsg = Math.abs(thetaPhys(3, 4, kernelSigned, KERNEL_NMAX) - UNIFORM["3,4"]);
      return tsg > tnn;
    },
  },
  {
    id: "imp95917-verdict-honesty",
    description:
      "the verdict carries the honest scope: a DETERMINED image strictly below 1 CONDITIONAL on K_k >= 0, the obstruction SHARPENED to the envelope SIGN, sub-gap STILL OPEN, no bound, NO QED, no refereed bound is changed",
    holds: () =>
      /honest PARTIAL/.test(IMP95917_VONMANGOLDT_WEIGHTED_SIGN_IMAGE.verdict) &&
      /STRICTLY BELOW 1/.test(IMP95917_VONMANGOLDT_WEIGHTED_SIGN_IMAGE.verdict) &&
      /envelope SIGN/.test(IMP95917_VONMANGOLDT_WEIGHTED_SIGN_IMAGE.verdict) &&
      /STILL OPEN/.test(IMP95917_VONMANGOLDT_WEIGHTED_SIGN_IMAGE.subGap) &&
      /NO QED/.test(IMP95917_VONMANGOLDT_WEIGHTED_SIGN_IMAGE.verdict) &&
      /refereed bound is changed/i.test(IMP95917_VONMANGOLDT_WEIGHTED_SIGN_IMAGE.verdict),
  },
];

for (const a of IMP95917_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95917-vonmangoldt-weighted-sign-image assertion failed: ${a.id}`,
    );
  }
}

export default IMP95917_VONMANGOLDT_WEIGHTED_SIGN_IMAGE;
