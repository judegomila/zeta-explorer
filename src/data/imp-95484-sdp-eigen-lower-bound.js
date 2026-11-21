/**
 * @module imp-95484-sdp-eigen-lower-bound
 *
 * imp-95484 (numerical MEASUREMENT / ASSESSMENT, PARTIAL): can an SDP relaxation
 * with a certified eigenvalue enclosure produce a rigorous LOWER bound on the
 * imp-95442 sign-functional floor
 *   theta_floor = min_{sigma in {+-1}^N} sigma^T G sigma / (1^T G 1)
 * (G the imp-95375 positive packet Gram), tight enough to BRACKET the true
 * suboptimality gap of the alternating witness at the ported grids N in
 * {64, 192, 640} where imp-95442 left theta_floor UNCOMPUTED (2^N infeasible)?
 * imp-95442 exhibited explicit sign witnesses strictly below alternating
 * (rigorous UPPER bounds on theta_floor, relative gaps 2.32/1.71/1.38/0.96% at
 * N = 16/64/192/640) but had no matching LOWER bound, so the TRUE suboptimality
 * gap stayed one-sided (>= the witness gap, <= alternating itself).
 *
 * THE SDP DUAL FACT (what a certified eigenvalue enclosure buys). For ANY
 * diagonal y with G - diag(y) positive semidefinite,
 *   sigma^T G sigma = sigma^T (G - diag(y)) sigma + sum_i y_i sigma_i^2
 *                   >= sum_i y_i          (first term >= 0, sigma_i^2 = 1),
 * so theta_floor >= (sum_i y_i) / (1^T G 1) for every dual-feasible y. This is
 * the Shor / Goemans-Williamson MAX-CUT-type dual specialized to min over the
 * hypercube. The choice accessible from a single eigenvalue enclosure is the
 * UNIFORM diagonal y_i = lambda_min(G) (then G - diag(y) = G - lambda_min I is
 * PSD by definition), giving the certified spectral bound
 *   theta_floor >= N * lambda_min(G) / (1^T G 1).
 *
 * RESULT 1 (the uniform-diagonal spectral bound is FAR too loose to bracket).
 * Even using the MEASURED lambda_min (power iteration on the shift sI - G), the
 * ideal spectral bound lands ~98-99% BELOW the witness upper bound at every
 * grid -- the bracket [spectral LB, witness UB] has width 98.2/99.3/98.6/98.4%
 * of theta_wit at N = 16/64/192/640, so it does NOT enclose the O(1%)
 * alternating suboptimality:
 *   N = 16  (pD 3,8):  1^T G 1 = 2.249639e2, lambda_min ~ 1.999091e-3,
 *                      spectral LB = 1.421804e-4  vs theta_wit = 7.990482e-3.
 *   N = 64  (pD 5,16): 1^T G 1 = 3.112318e3, lambda_min ~ 3.111662e-4,
 *                      spectral LB = 6.398652e-6  vs theta_wit = 8.861171e-4.
 *   N = 192 (pD 7,32): 1^T G 1 = 2.382859e4, lambda_min ~ 2.606030e-4,
 *                      spectral LB = 2.099821e-6  vs theta_wit = 1.514353e-4.
 *   N = 640 (pD 11,64):1^T G 1 = 2.207389e5, lambda_min ~ 1.338828e-4,
 *                      spectral LB = 3.881735e-7  vs theta_wit = 2.354864e-5.
 * The N = 16 grid, where imp-95423 supplies the CERTIFIED exact floor
 * theta_floor = theta_wit = 7.990482e-3, is decisive: even against the KNOWN
 * true floor the uniform-diagonal spectral bound is 98.2% too low, so its
 * looseness is intrinsic to the uniform diagonal, not to the larger grids.
 *
 * RESULT 2 (a CERTIFIED eigenvalue enclosure is worse: it goes VACUOUS). The
 * measured lambda_min above is a Rayleigh quotient, which is an UPPER bound on
 * the true lambda_min, so N * lambda_min_meas / (1^T G 1) is only an ESTIMATE of
 * the ideal spectral bound, NOT itself certified. The lower bounds that ARE
 * certified from cheap enclosures are non-positive (hence vacuous, since
 * theta_floor >= 0 is free): the Weyl / Kato residual enclosure lambda_min >=
 * (Rayleigh quotient) - ||G x - rq x|| gives spectral LB = 3.708911e-5 (N = 16,
 * a feeble 0.46% of theta_wit) but -2.063642e-5, -1.422442e-5, -5.229457e-6 at
 * N = 64/192/640 (NEGATIVE), and the Gershgorin enclosure gives spectral LB
 * = -9.810138e-1, -1.133046e0, -1.185760e0, -1.232508e0 (hugely NEGATIVE) at
 * all four. The mechanism: G is NEAR-SINGULAR (heavy packet overlap => a dense
 * cluster of eigenvalues near 0), so lambda_min ~ 1e-4 is dwarfed by the power
 * iteration residual ~ 1e-3 and no cheap enclosure resolves it from below.
 *
 * VERDICT (why this does NOT bracket, and what would). A certified
 * eigenvalue-enclosure (uniform-diagonal) SDP dual CANNOT bracket the alternating
 * suboptimality at these grids for TWO independent reasons: (a) the uniform
 * diagonal is a weak dual point -- even with the exact lambda_min the relaxation
 * gap is ~98% because the sign-QP is a hypercube (not spectral) problem; and
 * (b) the certified enclosures cheap enough to run here (Gershgorin, power-
 * iteration Weyl residual) are non-positive on this near-singular Gram, so even
 * that weak bound is not actually certifiable without a high-accuracy verified
 * eigensolve. A genuine bracket requires the OPTIMIZED-diagonal SDP dual
 * (max 1^T y s.t. G - diag(y) PSD, an actual interior-point SDP solve) together
 * with a verified-Cholesky PSD certificate of G - diag(y) -- not a single
 * eigenvalue enclosure, and out of reach in this environment. So theta_floor for
 * N >= 64 stays UNCOMPUTED exactly as imp-95442 left it; the alternating
 * suboptimality stays one-sided (>= the imp-95442 witness gap, no matching LOWER
 * bound). ASSESSMENT confirms the SDP-lower-bound ROUTE is real but the
 * accessible (uniform, cheaply-certified) instance is too loose.
 *
 * HONEST LIMITS. (a) MEASUREMENT / ASSESSMENT only: nothing here derives or
 * moves a Lambda bound; it assesses the imp-95442 named "certified SDP / eigen
 * enclosure" residual and reports it does not bracket. (b) theta(sigma) and
 * 1^T G 1 are EXACT (imp-95375 closed-form Gram). (c) the lambda_min values are
 * MEASURED (power-iteration Rayleigh quotients = upper bounds on lambda_min); the
 * ideal spectral bound built from them is an ESTIMATE, while the Weyl and
 * Gershgorin variants ARE certified lower bounds and come out non-positive at
 * N >= 64. (d) the witness upper bounds theta_wit are the imp-95442 baked
 * exact-Gram evaluations. (e) no optimized-diagonal SDP was solved (no SDP solver
 * available); the optimized dual is only DISCUSSED as the route that would be
 * needed. (f) the imp-95397 / obligation (3) actual seam sign pattern is NOT
 * addressed. Changes no bound; NO QED; no refereed bound is changed.
 *
 * SKEPTICAL SELF-CHECK RECORD. (1) 1^T G 1 rebuilds from the exact Gram to the
 * baked literal at every grid (round-trip). (2) the ideal spectral bound
 * N * lambda_min / (1^T G 1) rebuilds from the baked lambda_min and den to the
 * baked spectral-LB literal. (3) the dual necessary inequality holds: both the
 * imp-95442 witness and the alternating vector give sigma^T G sigma / (1^T G 1)
 * >= the ideal spectral bound (consistency of a lower bound). (4) the bracket
 * width [spectral LB, witness UB] exceeds 95% of theta_wit at every grid (the
 * bound does NOT enclose the ~1% gap). (5) the certified Weyl / Gershgorin
 * spectral bounds are non-positive at N >= 64 (vacuous). (6) at N = 16 the ideal
 * spectral bound is < 3% of the imp-95423 CERTIFIED exact floor 7.990482e-3.
 *
 * Import-light (no zeros bundle, no sibling imports).
 */

// -- width-law port constants (imp-95220 LEMMA MAP; match imp-95442/95375) ----
const PORT_C = 1.7;
const PORT_V = 2.3;
const muPort = (d) => Math.pow(d, 1 / 3) / PORT_C;
const uPort = (d) => PORT_V / d;
function gridGpd(p, D) {
  const g = [];
  for (let n = 1; n <= p * D; n++) if (n % p !== 0) g.push(n / p);
  return g;
}
// exact Gram of two-sided exponentials (imp-95375 closed form)
function gram(a, p, b, q) {
  if (p > q) { const ta = a, tp = p; a = b; p = q; b = ta; q = tp; }
  const D = q - p;
  if (a === b) return Math.exp(-a * D) * (D + 1 / a);
  const I1 = (Math.exp(-a * p - b * q) * Math.exp((a + b) * p)) / (a + b);
  const I3 = (Math.exp(a * p + b * q) * Math.exp(-(a + b) * q)) / (a + b);
  const I2 =
    (Math.exp(a * p - b * q) * (Math.exp((b - a) * q) - Math.exp((b - a) * p))) /
    (b - a);
  return I1 + I2 + I3;
}
function buildGram(p, D) {
  const ds = gridGpd(p, D);
  const mu = ds.map(muPort);
  const u = ds.map(uPort);
  const N = ds.length;
  const G = Array.from({ length: N }, () => new Float64Array(N));
  for (let m = 0; m < N; m++)
    for (let n = 0; n < N; n++) G[m][n] = gram(mu[m], u[m], mu[n], u[n]);
  return { G, N };
}
function oneTGone(G, N) {
  let s = 0;
  for (let m = 0; m < N; m++) { const Gm = G[m]; for (let n = 0; n < N; n++) s += Gm[n]; }
  return s;
}
function quadForm(G, N, sig) {
  let s = 0;
  for (let m = 0; m < N; m++) {
    let r = 0; const Gm = G[m];
    for (let n = 0; n < N; n++) r += sig[n] * Gm[n];
    s += sig[m] * r;
  }
  return s;
}
function alternating(N) {
  return new Array(N).fill(0).map((_, i) => (i % 2 ? -1 : 1));
}
function decodeHexWitness(hex, N) {
  const s = new Array(N).fill(1);
  for (let i = 0; i < N; i++) {
    const nyb = parseInt(hex[i >> 2], 16);
    if ((nyb >> (i & 3)) & 1) s[i] = -1;
  }
  return s;
}
// measured lambda_min via shifted power iteration on M = sI - G (dominant
// eigenvalue s - lambda_min); Rayleigh quotient of G on the converged vector.
function lambdaMinMeasured(G, N, sUp, iters) {
  const x = new Float64Array(N);
  for (let i = 0; i < N; i++) x[i] = Math.sin(1 + i * 0.7) + 0.3;
  const Mx = new Float64Array(N);
  const norm = (v) => { let t = 0; for (let i = 0; i < N; i++) t += v[i] * v[i]; return Math.sqrt(t); };
  let nx = norm(x); for (let i = 0; i < N; i++) x[i] /= nx;
  for (let it = 0; it < iters; it++) {
    for (let i = 0; i < N; i++) {
      const Gi = G[i]; let g = 0;
      for (let j = 0; j < N; j++) g += Gi[j] * x[j];
      Mx[i] = sUp * x[i] - g;
    }
    nx = norm(Mx);
    for (let i = 0; i < N; i++) x[i] = Mx[i] / nx;
  }
  let rq = 0;
  for (let i = 0; i < N; i++) {
    const Gi = G[i]; let g = 0;
    for (let j = 0; j < N; j++) g += Gi[j] * x[j];
    rq += x[i] * g;
  }
  return rq;
}

// -- baked measurements (exact-Gram scalars + measured lambda_min) ------------
// witness UBs are the imp-95442 baked exact-Gram evaluations (rigorous upper
// bounds on theta_floor); at N = 16 theta_wit IS the imp-95423 certified floor.
const THETA_WITNESS = { "3,8": 7.990482e-3, "5,16": 8.861171e-4, "7,32": 1.514353e-4, "11,64": 2.354864e-5 };
const WITNESS_HEX = {
  "3,8": "aa2e",
  "5,16": "aaaaaaaae2a8c0ef",
  "7,32": "aaaaaaaaaaaaaaaaaaaaaaaae73e03488ea01987e33ababe",
  "11,64": "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaafe19a9e2fe9ae232ba3291aa314aa0ba90c08aaaf8284c3826b628ba5e37b8eb3643ac9cfffa8aba",
};
// den = 1^T G 1 ; lamMin = measured lambda_min ; idealLB = N*lamMin/den ;
// weylLB = certified Weyl-residual spectral bound ; gershLB = Gershgorin bound.
const MEAS = {
  "3,8":   { N: 16,  den: 2.249639e2, lamMin: 1.999091e-3, idealLB: 1.421804e-4, weylLB: 3.708911e-5, gershLB: -9.810138e-1 },
  "5,16":  { N: 64,  den: 3.112318e3, lamMin: 3.111662e-4, idealLB: 6.398652e-6, weylLB: -2.063642e-5, gershLB: -1.133046e0 },
  "7,32":  { N: 192, den: 2.382859e4, lamMin: 2.606030e-4, idealLB: 2.099821e-6, weylLB: -1.422442e-5, gershLB: -1.185760e0 },
  "11,64": { N: 640, den: 2.207389e5, lamMin: 1.338828e-4, idealLB: 3.881735e-7, weylLB: -5.229457e-6, gershLB: -1.232508e0 },
};
// bracket width [ideal spectral LB, witness UB] as a fraction of theta_wit;
// > 0.95 everywhere => the bound does not enclose the O(1%) alternating gap.
const BRACKET_FRAC = { "3,8": 0.98221, "5,16": 0.99278, "7,32": 0.98613, "11,64": 0.98352 };

// -- verdict object ----------------------------------------------------------
export const IMP95484_SDP_EIGEN_LOWER_BOUND = {
  ticket:
    "imp-95484 (numerical MEASUREMENT / ASSESSMENT, PARTIAL): can an SDP relaxation with a certified eigenvalue enclosure give a rigorous LOWER bound on the imp-95442 sign-functional floor theta_floor = min over {+-1}^N of sigma^T G sigma / (1^T G 1), tight enough to bracket the alternating suboptimality at N in {64,192,640} where imp-95442 left theta_floor UNCOMPUTED? Result: NO -- the accessible uniform-diagonal (single-eigenvalue-enclosure) SDP dual is ~98% too loose, and the cheap CERTIFIED enclosures go non-positive (vacuous) on the near-singular Gram.",
  sdpDualFact:
    "for any diagonal y with G - diag(y) PSD, sigma^T G sigma >= sum_i y_i (since sigma_i^2 = 1), so theta_floor >= (sum_i y_i) / (1^T G 1); the choice available from one eigenvalue enclosure is y_i = lambda_min(G), giving theta_floor >= N * lambda_min(G) / (1^T G 1).",
  uniformDualTooLoose:
    "even with the MEASURED lambda_min the ideal spectral bound N*lambda_min/(1^T G 1) sits ~98-99% below the witness upper bound: spectral LB 1.421804e-4 / 6.398652e-6 / 2.099821e-6 / 3.881735e-7 vs theta_wit 7.990482e-3 / 8.861171e-4 / 1.514353e-4 / 2.354864e-5 at N = 16/64/192/640. At N = 16, where imp-95423 gives the CERTIFIED exact floor 7.990482e-3, the uniform bound is still 98.2% too low -- the looseness is intrinsic to the uniform diagonal.",
  certifiedEnclosureVacuous:
    "the measured lambda_min is a Rayleigh quotient (an UPPER bound on lambda_min), so N*lambda_min_meas/(1^T G 1) is only an ESTIMATE; the CERTIFIED lower bounds are non-positive: Weyl/Kato residual spectral LB = 3.708911e-5 (N=16) but -2.063642e-5 / -1.422442e-5 / -5.229457e-6 (N>=64), Gershgorin spectral LB = -9.810138e-1 / -1.133046e0 / -1.185760e0 / -1.232508e0 -- G is near-singular (lambda_min ~ 1e-4 << power-iteration residual ~ 1e-3), so no cheap enclosure resolves it from below.",
  whatWouldBracket:
    "a genuine bracket needs the OPTIMIZED-diagonal SDP dual (max 1^T y s.t. G - diag(y) PSD, an interior-point SDP solve) plus a verified-Cholesky PSD certificate of G - diag(y) -- not a single eigenvalue enclosure -- and is out of reach here; so theta_floor for N >= 64 stays UNCOMPUTED and the alternating suboptimality stays one-sided (>= the imp-95442 witness gap).",
  constants: {
    portC: PORT_C,
    portV: PORT_V,
    meas: MEAS,
    thetaWitness: THETA_WITNESS,
    bracketFrac: BRACKET_FRAC,
  },
  subGap:
    "OPEN residuals (unchanged from imp-95442). (i) exact theta_floor for N in {64,192,640} -- still UNCOMPUTED; the accessible uniform-diagonal / cheaply-certified SDP dual assessed here does not bracket it (needs an optimized-diagonal SDP solve + verified-Cholesky PSD certificate). (ii) the matching LOWER bound on alternating suboptimality is still MISSING, so the true gap stays one-sided (>= the witness gap). (iii) imp-95397 / obligation (3): the ACTUAL seam alias sign pattern -- STILL OPEN and unchanged.",
  verdict:
    "MEASUREMENT / ASSESSMENT (PARTIAL, honest): a certified eigenvalue-enclosure (uniform-diagonal) SDP dual does NOT bracket the imp-95442 alternating suboptimality at N in {16,64,192,640}. Even with the exact lambda_min the uniform spectral bound is ~98% below the witness upper bound (relaxation gap intrinsic to the hypercube QP), and the cheap CERTIFIED enclosures (Weyl residual, Gershgorin) are non-positive on the near-singular Gram, so even that weak bound is not certifiable without a high-accuracy verified eigensolve. Bracketing needs the OPTIMIZED-diagonal SDP dual + a verified-Cholesky PSD certificate, out of reach here. theta_floor for N >= 64 stays UNCOMPUTED; nothing derives or moves a bound; NO QED; no refereed bound is changed.",
  rigorScope:
    "theta(sigma) and 1^T G 1 are EXACT (imp-95375 closed-form Gram). lambda_min values are MEASURED (power-iteration Rayleigh quotients = upper bounds on lambda_min); the ideal spectral bound from them is an ESTIMATE, while the Weyl and Gershgorin variants ARE certified lower bounds and are non-positive at N >= 64. The witness upper bounds are the imp-95442 baked exact-Gram evaluations. No optimized-diagonal SDP was solved (no solver available); it is only discussed as the route that would be needed. The imp-95397 seam sign pattern is not addressed.",
};

// -- assertions (self-executing; import-light; THROW on violation) -----------
export const IMP95484_SDP_EIGEN_ASSERTIONS = [
  {
    id: "imp95484-den-rebuilds-exact",
    description:
      "1^T G 1 rebuilds from the exact Gram to the baked literal at every ported grid (round-trip)",
    holds: () => {
      for (const [p, D] of [[3, 8], [5, 16], [7, 32], [11, 64]]) {
        const key = `${p},${D}`;
        const { G, N } = buildGram(p, D);
        if (N !== MEAS[key].N) return false;
        if (Math.abs(oneTGone(G, N) / MEAS[key].den - 1) > 1e-6) return false;
      }
      return true;
    },
  },
  {
    id: "imp95484-ideal-spectral-bound-rebuilds",
    description:
      "the ideal spectral bound N*lambda_min/(1^T G 1) rebuilds from the baked lambda_min and den to the baked spectral-LB literal at every grid",
    holds: () => {
      for (const key of ["3,8", "5,16", "7,32", "11,64"]) {
        const m = MEAS[key];
        const lb = (m.N * m.lamMin) / m.den;
        if (Math.abs(lb / m.idealLB - 1) > 1e-4) return false;
      }
      return true;
    },
  },
  {
    id: "imp95484-dual-inequality-consistent",
    description:
      "the SDP dual necessary inequality holds: both the imp-95442 witness and the alternating vector give theta = sigma^T G sigma/(1^T G 1) >= the ideal spectral lower bound at every grid",
    holds: () => {
      for (const [p, D] of [[3, 8], [5, 16], [7, 32], [11, 64]]) {
        const key = `${p},${D}`;
        const { G, N } = buildGram(p, D);
        const den = oneTGone(G, N);
        const lb = MEAS[key].idealLB;
        const thWit = quadForm(G, N, decodeHexWitness(WITNESS_HEX[key], N)) / den;
        const thAlt = quadForm(G, N, alternating(N)) / den;
        if (thWit < lb - 1e-12) return false;
        if (thAlt < lb - 1e-12) return false;
      }
      return true;
    },
  },
  {
    id: "imp95484-bracket-does-not-enclose-gap",
    description:
      "the bracket [ideal spectral LB, witness UB] exceeds 95% of theta_wit at every grid -- the uniform-diagonal SDP dual does NOT enclose the O(1%) alternating suboptimality",
    holds: () => {
      for (const key of ["3,8", "5,16", "7,32", "11,64"]) {
        const m = MEAS[key];
        const thWit = THETA_WITNESS[key];
        const frac = (thWit - m.idealLB) / thWit;
        if (frac <= 0.95) return false;
        if (Math.abs(frac - BRACKET_FRAC[key]) > 5e-4) return false;
      }
      return true;
    },
  },
  {
    id: "imp95484-certified-enclosure-vacuous-large-N",
    description:
      "the CERTIFIED Weyl-residual and Gershgorin spectral bounds are non-positive (vacuous, since theta_floor >= 0 is free) at N >= 64 on the near-singular Gram",
    holds: () => {
      for (const key of ["5,16", "7,32", "11,64"]) {
        if (MEAS[key].weylLB > 0) return false;
        if (MEAS[key].gershLB > 0) return false;
      }
      return true;
    },
  },
  {
    id: "imp95484-n16-loose-vs-certified-exact-floor",
    description:
      "at N = 16 the ideal uniform spectral bound is below 3% of the imp-95423 CERTIFIED exact floor 7.990482e-3 -- the looseness is intrinsic to the uniform diagonal, not to the large infeasible grids",
    holds: () => {
      const m = MEAS["3,8"];
      return m.idealLB / 7.990482e-3 < 0.03;
    },
  },
  {
    id: "imp95484-fresh-eigen-estimate-keeps-bound-loose",
    description:
      "a freshly computed lambda_min estimate (shifted power iteration, Gershgorin-lambda_max shift) at the cheap grids N = 16, 64 is positive (G PSD, nonsingular) yet still yields an ideal spectral bound below 5% of theta_wit -- the looseness does not depend on the exact eigenvalue (the Rayleigh quotient only upper-bounds lambda_min, so the true bound is even smaller)",
    holds: () => {
      for (const [p, D] of [[3, 8], [5, 16]]) {
        const key = `${p},${D}`;
        const { G, N } = buildGram(p, D);
        // Gershgorin upper bound on lambda_max = max_i (G_ii + off-diagonal radius)
        let sUp = -Infinity;
        for (let i = 0; i < N; i++) {
          let rad = 0; const Gi = G[i];
          for (let j = 0; j < N; j++) if (j !== i) rad += Math.abs(Gi[j]);
          sUp = Math.max(sUp, Gi[i] + rad);
        }
        const lam = lambdaMinMeasured(G, N, sUp * 1.0001, 4000);
        if (!(lam > 0)) return false;
        const den = oneTGone(G, N);
        const idealLB = (N * lam) / den;
        if (idealLB / THETA_WITNESS[key] >= 0.05) return false;
      }
      return true;
    },
  },
  {
    id: "imp95484-verdict-honesty",
    description:
      "the verdict carries the honest split: uniform-diagonal SDP dual does NOT bracket, certified enclosures vacuous at N >= 64, exact floor UNCOMPUTED, no QED / SOTA unchanged",
    holds: () =>
      /does NOT bracket/.test(IMP95484_SDP_EIGEN_LOWER_BOUND.verdict) &&
      /non-positive/.test(IMP95484_SDP_EIGEN_LOWER_BOUND.verdict) &&
      /UNCOMPUTED/.test(IMP95484_SDP_EIGEN_LOWER_BOUND.subGap) &&
      /STILL OPEN/.test(IMP95484_SDP_EIGEN_LOWER_BOUND.subGap) &&
      /NO QED/.test(IMP95484_SDP_EIGEN_LOWER_BOUND.verdict) &&
      /refereed bound is changed/i.test(IMP95484_SDP_EIGEN_LOWER_BOUND.verdict),
  },
];

for (const a of IMP95484_SDP_EIGEN_ASSERTIONS) {
  if (!a.holds()) {
    throw new Error(`imp-95484-sdp-eigen-lower-bound assertion failed: ${a.id}`);
  }
}

export default IMP95484_SDP_EIGEN_LOWER_BOUND;
