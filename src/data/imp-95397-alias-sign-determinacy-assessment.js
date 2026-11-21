/**
 * @module imp-95397-alias-sign-determinacy-assessment
 *
 * imp-95397 (proof-scoping, ASSESSMENT): imp-95375 foreclosed the "geometry
 * forbids theta < 1" branch of the imp-95255 LEG 2 wall and localized the
 * residual entirely onto THIS ticket -- "recover the paper alias sign pattern
 * sigma": the OPEN question was which point of the geometrically imaged range
 * [theta_floor, 1] the REAL seam realizes. imp-95375 modelled the seam
 * amplitudes as a REAL sign vector sigma in {+-1}^N left FREE by the
 * transcription. This module reads the paper structure behind eq (14)/(15) and
 * settles the ticket's binary -- are the alias signs DETERMINED by the
 * explicit-formula / additive-character / alias structure, or genuinely FREE?
 *
 * THE PAPER COEFFICIENTS (read from Section 4.5 eq (14)/(15), imp-95071).
 * Eq (14) is the additive-character (Ramanujan) expansion of the prime sieve:
 *   1_{p does not divide n} = 1 - 1/p - (1/p) sum_{h=1}^{p-1} e(h n / p),
 * with e(x) = exp(2 pi i x). So the coefficient of the h-th alias is EXACTLY
 *   a_h(n) = -(1/p) e(h n / p),
 * modulus 1/p (the value imp-95220 already carried as the pinned amplitude
 * modulus) AND phase the additive character e(h n / p), an explicit p-th root
 * of unity fixed by (h, n). Eq (15) attaches alias h to the depth grid point
 * d = k - h/p, so within each unit depth interval (k-1, k] the p-1 grid points
 * of G(p, D) carry, for fixed n, the p-1 nontrivial p-th roots of unity -- a
 * DETERMINED, maximally spread phase set whose sum is -1 (the Ramanujan-sum
 * identity sum_{h=1}^{p-1} e(hn/p) = -1 for p not dividing n, = p-1 for p | n).
 *
 * VERDICT (resolves the ticket's dichotomy to NEITHER pure horn).
 *
 *   (A) The signs are NOT genuinely free. Eq (14) pins each per-alias
 *       coefficient EXACTLY as a_h(n) = -(1/p) e(hn/p). The imp-95375 picture
 *       of a free real sign vector sigma in {+-1}^N is therefore incorrect as
 *       stated: the transcription does specify the per-window phase pattern --
 *       it is the additive character e(hn/p), arithmetically determined, not a
 *       free choice. The horn "signs genuinely free / indeterminate at
 *       transcription" is REFUTED.
 *
 *   (B) But the determination does NOT hand theta a point value; the residual
 *       RELOCATES rather than closes, for two structural reasons:
 *       (1) COMPLEX, not REAL. imp-95375 theta(sigma) = sigma^T G sigma /
 *           (1^T G 1) is a REAL-sign functional (sigma in {+-1}^N). The paper
 *           coefficients are COMPLEX phases; only for p = 2 does e(hn/2) =
 *           (-1)^n collapse to a real +-1. For every p >= 3 the per-window
 *           coefficients are genuinely complex p-th roots of unity, so the
 *           real-sign theta has no direct preimage even though the coefficients
 *           are fully determined. The correct paper object is the COMPLEX
 *           energy ratio theta_C = int |f|^2 / int |g|^2 with f = sum a_h(n) f_h
 *           and g = sum |a_h| f_h; using G real symmetric this is the exact
 *           determined form
 *             theta_C = (sum_{m,l} cos(2 pi (h_m - h_l) n / p) G_ml)
 *                       / (sum_{m,l} G_ml)  in [0, 1]
 *           (|f| <= g pointwise gives theta_C <= 1). It is the imp-95375
 *           quadratic form with cos(2 pi (h_m - h_l) n / p) in place of
 *           sigma_m sigma_l -- determined once (p, window, n) are fixed, NOT a
 *           free real sign vector.
 *       (2) The n-DEPENDENCE (the explicit-formula summation). a_h(n) still
 *           carries the summation variable n; the ACTUAL per-window amplitude
 *           is the explicit-formula sum A_{k,h} = sum_n Lambda(n) K_k(n)
 *           e(hn/p) -- a Ramanujan/Kloosterman-weighted sum against the
 *           Fresnel-Airy kernel K_k -- whose magnitude and phase are the
 *           arithmetic content Section 4.5 estimates STRUCTURALLY rather than
 *           pins. Consistently, theta_C VARIES with n (measured
 *           theta_C(p=5, k=5) = 0.062951 at n=1 vs 0.062506 at n=2; theta_C(
 *           p=7, k=6) = 0.028019 at n=1 vs 0.027812 at n=2), so no single
 *           per-window theta value survives before the n-sum is performed.
 *
 * NET. The imp-95375 residual "which point of [theta_floor, 1] the seam sits
 * at" is IDENTIFIED, not eliminated: it is the value of the complex energy
 * ratio theta_C determined by the additive characters e(hn/p) folded through
 * the explicit-formula n-sum -- an arithmetic (Ramanujan/Kloosterman)
 * evaluation, NOT a missing real sign vector to be guessed. The signs are
 * determined (foreclosing "indeterminate at transcription"); the surviving
 * obligation is to evaluate that per-window arithmetic sum's residual, which is
 * exactly the class of input Section 4.5 leaves structural. A phase-priced
 * theta bound therefore requires the n-summed alias amplitude, not a better
 * certificate and not a recovered sign pattern.
 *
 * HONEST LIMITS. (a) ASSESSMENT only: nothing derives or moves a Lambda bound;
 * it resolves the ticket's dichotomy and re-localizes the imp-95375 residual.
 * (b) a_h(n) = -(1/p) e(hn/p) and the Ramanujan identity are EXACT readings of
 * eq (14). (c) theta_C is the EXACT complex energy ratio on the transcribed
 * width-law geometry for a SINGLE window's aliases (closed-form Gram, no
 * quadrature); it demonstrates determinacy-given-n and n-dependence, it is NOT
 * the full seam theta (which needs the explicit-formula n-sum over all windows,
 * left OPEN). (d) The kernel K_k and the von Mangoldt weighting are NOT
 * evaluated here; A_{k,h} is named, not computed. Changes no bound; NO QED;
 * no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) Ramanujan identity sum_{h=1}^{p-1}
 * e(hn/p) = -1 (p not | n) and = p-1 (p | n) verified for several (p, n).
 * (2) |a_h(n)| = 1/p exact. (3) {e(hn/p) : h=1..p-1} is a permutation of the
 * p-1 nontrivial p-th roots of unity when p not | n (verified as a set).
 * (4) p = 2 alias phase is REAL ((-1)^n); p >= 3 carries a genuinely complex
 * alias (nonzero imaginary part), so the real-sign theta has no direct
 * preimage. (5) eq (15) grid: within (k-1, k] the denominators k - h/p
 * (h=1..p-1) are exactly the p-1 grid points of G(p, D) in that interval.
 * (6) theta_C in [0, 1] and n-dependent, matching the baked literals.
 *
 * Import-light (no zeros bundle, no sibling imports).
 */

// -- width-law port constants (imp-95220 LEMMA MAP; illustrative (c, v)) ------
const PORT_C = 1.7;
const PORT_V = 2.3;

const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;

// -- eq (14) alias coefficient a_h(n) = -(1/p) e(hn/p) (complex) --------------
function aliasCoeff(p, h, n) {
  const arg = (2 * Math.PI * h * n) / p;
  return { re: -Math.cos(arg) / p, im: -Math.sin(arg) / p };
}
// sum_{h=1}^{p-1} e(hn/p) (the Ramanujan sum: -1 if p not | n, p-1 if p | n)
function ramanujanSum(p, n) {
  let re = 0, im = 0;
  for (let h = 1; h <= p - 1; h++) {
    const arg = (2 * Math.PI * h * n) / p;
    re += Math.cos(arg);
    im += Math.sin(arg);
  }
  return { re, im };
}

// -- eq (15) grid: G(p, D) = { n/p : 1<=n<=pD, p not | n } --------------------
function gridGpd(p, D) {
  const g = [];
  for (let n = 1; n <= p * D; n++) if (n % p !== 0) g.push(n / p);
  return g;
}

// -- exact Gram of two-sided exponentials (imp-95375 closed form) -------------
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

// -- complex energy ratio theta_C on ONE window's aliases (h=1..p-1 at d=k-h/p)
// theta_C = (sum_ml cos(2pi (h_m - h_l) n / p) G_ml) / (sum_ml G_ml)  in [0,1]
function thetaC(p, k, n) {
  const hs = [];
  for (let h = 1; h <= p - 1; h++) hs.push(h);
  const ds = hs.map((h) => k - h / p);
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  const N = hs.length;
  const G = Array.from({ length: N }, () => new Array(N));
  for (let m = 0; m < N; m++)
    for (let l = 0; l < N; l++) G[m][l] = gram(mu[m], u[m], mu[l], u[l]);
  let num = 0, den = 0;
  for (let m = 0; m < N; m++)
    for (let l = 0; l < N; l++) {
      num += Math.cos((2 * Math.PI * (hs[m] - hs[l]) * n) / p) * G[m][l];
      den += G[m][l];
    }
  return num / den;
}

// -- baked witnesses (exact-Gram / exact-character; quadrature-free) ----------
const THETA_C = {
  "5,5,1": 0.062951,
  "5,5,2": 0.062506,
  "7,6,1": 0.028019,
  "7,6,2": 0.027812,
};

// -- verdict object ----------------------------------------------------------
export const IMP95397_ALIAS_SIGN_DETERMINACY_ASSESSMENT = {
  ticket:
    "imp-95397 (ASSESSMENT): are the paper alias signs DETERMINED by the eq (14)/(15) explicit-formula/additive-character structure, or genuinely FREE at transcription (the imp-95375 residual)? Result: NEITHER pure horn -- the per-alias coefficient is pinned EXACTLY at a_h(n) = -(1/p) e(hn/p) (determined, complex phase, modulus 1/p), so the signs are NOT free; but the real-sign theta gets no point value because the coefficients are complex (p>=3) and n-dependent, so the residual relocates to evaluating the explicit-formula n-sum, not to recovering a free sign vector.",
  paperCoefficients:
    "eq (14): 1_{p not | n} = 1 - 1/p - (1/p) sum_{h=1}^{p-1} e(hn/p), e(x)=exp(2 pi i x). Coefficient of alias h is a_h(n) = -(1/p) e(hn/p): modulus 1/p (the imp-95220 pinned modulus) AND phase the additive character e(hn/p), an explicit p-th root of unity fixed by (h, n). eq (15) attaches alias h to depth grid point d = k - h/p, so within (k-1, k] the p-1 grid points of G(p, D) carry (for fixed n) the p-1 nontrivial p-th roots of unity, sum = -1 (Ramanujan-sum identity).",
  hornA_notFree:
    "the signs are NOT genuinely free. Eq (14) pins each per-alias coefficient exactly at a_h(n) = -(1/p) e(hn/p); the imp-95375 free real sign vector sigma in {+-1}^N is incorrect as stated -- the transcription DOES specify the per-window phase pattern (the additive character e(hn/p)), arithmetically determined. The 'indeterminate at transcription' horn is REFUTED.",
  hornB_residualRelocates:
    "but the determination does NOT hand theta a point value. (1) COMPLEX not REAL: imp-95375 theta(sigma) is a real-sign functional; the paper coefficients are complex, and only p = 2 collapses e(hn/2) = (-1)^n to a real +-1. For p >= 3 the correct object is the complex energy ratio theta_C = int|f|^2/int|g|^2 = (sum_ml cos(2 pi (h_m-h_l) n/p) G_ml)/(sum_ml G_ml) in [0,1], the imp-95375 quadratic form with cos(2 pi (h_m-h_l) n/p) replacing sigma_m sigma_l -- determined given (p, window, n), not a free vector. (2) n-DEPENDENCE: a_h(n) carries the explicit-formula variable n; the actual per-window amplitude is A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p) (a Ramanujan/Kloosterman-weighted kernel sum), the arithmetic content Section 4.5 leaves structural. theta_C VARIES with n (0.062951 vs 0.062506 at p=5,k=5; 0.028019 vs 0.027812 at p=7,k=6), so no per-window theta survives before the n-sum.",
  net:
    "the imp-95375 residual 'which point of [theta_floor, 1] the seam sits at' is IDENTIFIED, not eliminated: it is the value of theta_C determined by the additive characters e(hn/p) folded through the explicit-formula n-sum -- an arithmetic (Ramanujan/Kloosterman) evaluation, NOT a missing real sign vector to be guessed. A phase-priced theta bound requires the n-summed alias amplitude, not a better certificate and not a recovered sign pattern.",
  constants: {
    portC: PORT_C,
    portV: PORT_V,
    thetaC: THETA_C,
  },
  subGap:
    "imp-95212-subgap-fresnel-airy-envelope-port -- STILL OPEN. This note re-localizes the theta residual precisely: eq (14) determines the per-alias coefficients a_h(n) = -(1/p) e(hn/p), so the OPEN ingredient is NOT a free sign vector (imp-95375) but the explicit-formula n-sum A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p) that converts the determined additive characters into the per-window real theta image. Evaluating that Ramanujan/Kloosterman-weighted sum's residual sign/magnitude is the surviving obligation (the same class of arithmetic input Section 4.5 estimates structurally).",
  verdict:
    "ASSESSMENT (honest, resolves the ticket dichotomy to NEITHER pure horn): the paper alias signs are DETERMINED, not free -- eq (14) pins each per-alias coefficient at a_h(n) = -(1/p) e(hn/p) (modulus 1/p, phase the additive character e(hn/p), a p-th root of unity), so the imp-95375 free-real-sign picture is REFUTED. But the determination gives theta no point value: the coefficients are COMPLEX (real only at p = 2) so the correct object is the complex energy ratio theta_C (the imp-95375 quadratic form with cos(2 pi (h_m-h_l) n/p) for sigma_m sigma_l), and theta_C is n-DEPENDENT, so the per-window value requires the explicit-formula n-sum A_{k,h} = sum_n Lambda(n) K_k(n) e(hn/p). The imp-95375 residual therefore RELOCATES from 'recover a free sign vector' to 'evaluate the arithmetic n-sum of determined additive characters' -- the class of input Section 4.5 leaves structural. Nothing derives or moves a bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "a_h(n) = -(1/p) e(hn/p) and sum_{h=1}^{p-1} e(hn/p) = -1 (p not | n) / p-1 (p | n) are EXACT readings of eq (14). theta_C is the EXACT complex energy ratio on the transcribed width-law geometry for a SINGLE window's aliases (closed-form Gram, no quadrature) -- it witnesses determinacy-given-n and n-dependence, it is NOT the full seam theta (needs the explicit-formula n-sum over all windows, OPEN). The kernel K_k and von Mangoldt weighting are NOT evaluated; A_{k,h} is named, not computed. p = 2 real-vs p >= 3 complex is exact.",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95397_ALIAS_SIGN_ASSERTIONS = [
  {
    id: "imp95397-alias-coeff-modulus-is-one-over-p",
    description:
      "eq (14) alias coefficient a_h(n) = -(1/p) e(hn/p) has modulus exactly 1/p for every (p, h, n) -- the amplitude modulus imp-95220 already carried, now with an explicit phase",
    holds: () => {
      for (const p of [2, 3, 5, 7]) {
        for (let h = 1; h <= p - 1; h++) {
          for (const n of [1, 2, 3, 5, 8]) {
            const a = aliasCoeff(p, h, n);
            if (Math.abs(Math.hypot(a.re, a.im) - 1 / p) > 1e-12) return false;
          }
        }
      }
      return true;
    },
  },
  {
    id: "imp95397-ramanujan-sum-identity",
    description:
      "the alias phase sum sum_{h=1}^{p-1} e(hn/p) is exactly -1 when p does not divide n and p-1 when p divides n (Ramanujan-sum identity) -- the alias phases are arithmetically pinned, not free, and cancel completely",
    holds: () => {
      for (const p of [3, 5, 7, 11]) {
        for (const n of [1, 2, 3, 4]) {
          if (n % p === 0) continue; // p | n handled separately below
          const s = ramanujanSum(p, n);
          if (Math.abs(s.re - (-1)) > 1e-9 || Math.abs(s.im) > 1e-9) return false;
        }
        // p | n branch
        const sMult = ramanujanSum(p, p);
        if (Math.abs(sMult.re - (p - 1)) > 1e-9 || Math.abs(sMult.im) > 1e-9)
          return false;
      }
      return true;
    },
  },
  {
    id: "imp95397-aliases-are-nontrivial-roots-of-unity",
    description:
      "for p not dividing n the multiset { e(hn/p) : h=1..p-1 } is a permutation of the p-1 NONTRIVIAL p-th roots of unity -- the per-window phase set is determined and maximally spread, not a free sign choice",
    holds: () => {
      for (const [p, n] of [[5, 1], [5, 2], [7, 3], [11, 4]]) {
        // collect the p-1 alias phases as (re, im), match to nontrivial roots
        const roots = [];
        for (let j = 1; j <= p - 1; j++)
          roots.push([Math.cos((2 * Math.PI * j) / p), Math.sin((2 * Math.PI * j) / p)]);
        for (let h = 1; h <= p - 1; h++) {
          const arg = (2 * Math.PI * h * n) / p;
          const pt = [Math.cos(arg), Math.sin(arg)];
          const idx = roots.findIndex(
            (r) => Math.abs(r[0] - pt[0]) < 1e-9 && Math.abs(r[1] - pt[1]) < 1e-9,
          );
          if (idx < 0) return false;
          roots.splice(idx, 1); // each root used once => permutation
        }
        if (roots.length !== 0) return false;
      }
      return true;
    },
  },
  {
    id: "imp95397-p2-real-but-p-ge-3-complex",
    description:
      "the p = 2 alias phase e(hn/2) = (-1)^n is REAL (in {+-1}), but for p >= 3 some alias carries a genuinely complex phase (nonzero imaginary part) -- so the imp-95375 real-sign theta has no direct preimage for p >= 3",
    holds: () => {
      // p = 2: only h = 1, phase (-1)^n, imaginary part zero
      for (const n of [1, 2, 3, 4, 5]) {
        const a = aliasCoeff(2, 1, n);
        if (Math.abs(a.im) > 1e-12) return false;
        if (Math.abs(Math.abs(a.re) - 1 / 2) > 1e-12) return false;
      }
      // p >= 3: exists an alias with nonzero imaginary part
      for (const p of [3, 5, 7]) {
        let sawComplex = false;
        for (let h = 1; h <= p - 1; h++) {
          if (Math.abs(aliasCoeff(p, h, 1).im) > 1e-6) sawComplex = true;
        }
        if (!sawComplex) return false;
      }
      return true;
    },
  },
  {
    id: "imp95397-eq15-grid-fills-unit-interval",
    description:
      "eq (15): within the unit depth interval (k-1, k] the denominators d = k - h/p (h=1..p-1) are exactly the p-1 grid points of G(p, D) lying in that interval -- the alias index h and the depth grid point are in bijection",
    holds: () => {
      for (const [p, D, k] of [[5, 8, 5], [7, 8, 6], [3, 8, 4]]) {
        const inInterval = gridGpd(p, D).filter((d) => d > k - 1 + 1e-12 && d <= k + 1e-12);
        const aliasDs = [];
        for (let h = 1; h <= p - 1; h++) aliasDs.push(k - h / p);
        if (inInterval.length !== p - 1) return false;
        for (const d of aliasDs) {
          if (!inInterval.some((x) => Math.abs(x - d) < 1e-12)) return false;
        }
      }
      return true;
    },
  },
  {
    id: "imp95397-thetaC-determined-in-unit-interval-and-n-dependent",
    description:
      "the complex energy ratio theta_C on one window's determined aliases lies in [0, 1], matches the baked literals, and VARIES with n (theta_C(5,5,1) != theta_C(5,5,2)) -- determined given n, but n-dependent, so the per-window value needs the explicit-formula n-sum",
    holds: () => {
      for (const key of Object.keys(THETA_C)) {
        const [p, k, n] = key.split(",").map(Number);
        const t = thetaC(p, k, n);
        if (!(t >= -1e-12 && t <= 1 + 1e-12)) return false;
        if (Math.abs(t - THETA_C[key]) > 1e-5) return false;
      }
      // n-dependence is real (not a rounding artifact)
      if (!(Math.abs(thetaC(5, 5, 1) - thetaC(5, 5, 2)) > 1e-4)) return false;
      if (!(Math.abs(thetaC(7, 6, 1) - thetaC(7, 6, 2)) > 1e-4)) return false;
      return true;
    },
  },
  {
    id: "imp95397-verdict-honesty",
    description:
      "the verdict carries the honest scope: signs DETERMINED (not free), residual RELOCATES to the arithmetic n-sum, sub-gap STILL OPEN, no bound moved, no QED, no refereed bound is changed",
    holds: () =>
      /DETERMINED, not free/.test(IMP95397_ALIAS_SIGN_DETERMINACY_ASSESSMENT.verdict) &&
      /RELOCATES/.test(IMP95397_ALIAS_SIGN_DETERMINACY_ASSESSMENT.verdict) &&
      /STILL OPEN/.test(IMP95397_ALIAS_SIGN_DETERMINACY_ASSESSMENT.subGap) &&
      /NO QED/.test(IMP95397_ALIAS_SIGN_DETERMINACY_ASSESSMENT.verdict) &&
      /refereed bound is changed/i.test(IMP95397_ALIAS_SIGN_DETERMINACY_ASSESSMENT.verdict),
  },
];

for (const a of IMP95397_ALIAS_SIGN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(
      `imp-95397-alias-sign-determinacy-assessment assertion failed: ${a.id}`,
    );
  }
}

export default IMP95397_ALIAS_SIGN_DETERMINACY_ASSESSMENT;
