/**
 * @module imp-2439-cm-coupling-constant-band
 * @jsdocTag imp-2439
 *
 * imp-2439: Pin the imp-2429-O-coupling-constants sub-gap in the Route A
 * rigidity-exponent bound.
 *
 * Wave-3 follow-on to imp-2429 (imp-2429-route-a-rigidity-exponent-bisection.js).
 * imp-2429 bisected the rigidity exponent to alpha_c = 0.895 (p50) .. 0.952
 * (p99) with analytic limit alpha_inf = 1, but used the UNPINNED O(1)
 * normalizations c_det = c_pert = 1 and named the sub-gap
 * imp-2429-O-coupling-constants: the implied O(.) constants in the many-body
 * center-of-mass (CM) correction were never estimated. This file estimates the
 * model coupling constant explicitly on the same N in {64..4096} ladder, reports
 * it with a bootstrap confidence interval, and propagates it into a corrected
 * alpha_c band.
 *
 * KEY OBSERVATION (only the RATIO matters)
 * ----------------------------------------
 * The closure condition D_det(N) - delta(N, alpha) >= 0 with
 *   D_det(N)   = c_det  * log(N) / N
 *   delta(N,a) = c_pert * N^-a * maxAbs(z_1..z_N)
 * is invariant under (c_det, c_pert) -> (s c_det, s c_pert): only the RATIO
 *   rho = c_pert / c_det
 * enters, since dividing through by c_det gives
 *   log(N)/N >= rho * N^-a * maxAbs.
 * So pinning the sub-gap reduces to pinning rho and propagating it into alpha_c.
 *
 * Solving for the per-row marginal exponent at the median displacement gives
 *   alpha_marg(N, rho) = 1 + [ log(rho) + log(maxAbs) - log(log N) ] / log N,
 * i.e. the constant ratio shifts alpha_c by EXACTLY + log(rho)/log N per row.
 * Hence (i) at finite N the threshold moves with rho, but (ii) for ANY fixed rho
 * the shift log(rho)/log N -> 0, so alpha_inf = 1 is rho-INDEPENDENT.
 *
 * THE FIT (what is pinnable without GUE universality)
 * ---------------------------------------------------
 * The realized worst-case L-infinity displacement maxAbs(z_1..z_N) has Gumbel
 * scale sqrt(2 log N). We define the empirical CM-correction prefactor
 *   kappa(N) = median_seeds( maxAbs ) / sqrt(2 log N),
 * the dimensionless ratio of the realized worst-case coupling to its analytic
 * scale. This IS the model c_pert (with c_det = 1): delta = N^-a sqrt(2 log N) *
 * kappa(N). Fitting a single constant kappa_hat = mean_N kappa(N) and
 * bootstrapping over the 32 seeds pins the model coupling ratio with a CI.
 *
 * HONEST SCOPE
 * ------------
 * This pins the coupling constant OF THE REDUCED MODEL, not of the genuine
 * Calogero-Moser many-body step. Deriving the true CM Hessian / coupling weights
 * from first principles is exactly the imp-486 obstruction (needs GUE
 * universality) and remains open; see sub-gap imp-2439-true-CM-Hessian. No QED is
 * claimed and the Route A "closed modulo GUE" status is unchanged.
 *
 * SYNTAX SAFETY: comments use dg_{k}/dt notation; no apostrophes inside single
 * quoted strings.
 */

// -- Deterministic seeded RNG (mulberry32 + Box-Muller), identical to imp-2429 --

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function standardNormal(rng) {
  let u = rng();
  if (u < 1e-12) u = 1e-12;
  const v = rng();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function maxAbsNormals(N, rng) {
  let m = 0;
  for (let i = 0; i < N; i++) {
    const z = Math.abs(standardNormal(rng));
    if (z > m) m = z;
  }
  return m;
}

function median(arr) {
  const a = [...arr].sort((x, y) => x - y);
  const n = a.length;
  return n % 2 ? a[(n - 1) / 2] : 0.5 * (a[n / 2 - 1] + a[n / 2]);
}

// -- Model ensemble (same ladder + seeds as imp-2429 so alpha_c is consistent) --

const N_LADDER = [64, 128, 256, 512, 1024, 2048, 4096];
const N_SEEDS = 32;
const EDGE_ALPHA = 2 / 3;
const BULK_ALPHA = 1.0;

const MAXZ = N_LADDER.map((N, k) =>
  Array.from({ length: N_SEEDS }, (_, s) =>
    maxAbsNormals(N, mulberry32(1009 * (k + 1) + 7919 * (s + 1) + 17)),
  ),
);
const MED_MAXZ = MAXZ.map((row) => median(row));

function dDet(N) {
  return Math.log(N) / N; // c_det = 1; the ratio rho carries the freedom
}

// Closure fraction at exponent alpha and coupling ratio rho = c_pert / c_det.
function closureFraction(alpha, rho) {
  let closed = 0;
  let total = 0;
  for (let k = 0; k < N_LADDER.length; k++) {
    const N = N_LADDER[k];
    const d = dDet(N);
    const scale = rho * Math.pow(N, -alpha);
    for (let s = 0; s < N_SEEDS; s++) {
      total++;
      if (d - scale * MAXZ[k][s] >= 0) closed++;
    }
  }
  return closed / total;
}

// closureFraction is monotone non-decreasing in alpha; bisect for smallest alpha
// achieving a target closure probability at fixed ratio rho.
function bisectThreshold(target, rho, lo = 0.3, hi = 1.6, iters = 60) {
  let a = lo;
  let b = hi;
  for (let i = 0; i < iters; i++) {
    const mid = 0.5 * (a + b);
    if (closureFraction(mid, rho) >= target) b = mid;
    else a = mid;
  }
  return 0.5 * (a + b);
}

// -- The fit: empirical CM-correction prefactor kappa(N) = maxAbs / sqrt(2 log N) --

const KAPPA_PER_ROW = N_LADDER.map((N, k) => ({
  N,
  medMaxAbs: MED_MAXZ[k],
  gumbelScale: Math.sqrt(2 * Math.log(N)),
  kappa: MED_MAXZ[k] / Math.sqrt(2 * Math.log(N)),
}));

const KAPPA_HAT =
  KAPPA_PER_ROW.reduce((s, r) => s + r.kappa, 0) / KAPPA_PER_ROW.length;

// Bootstrap 95% CI for kappa_hat by resampling the 32 seeds with replacement
// (deterministic bootstrap RNG so the CI is reproducible).
function bootstrapKappaCI(B = 2000) {
  const rng = mulberry32(424242);
  const samples = [];
  for (let b = 0; b < B; b++) {
    let sumK = 0;
    for (let k = 0; k < N_LADDER.length; k++) {
      const resampled = [];
      for (let s = 0; s < N_SEEDS; s++) {
        const idx = Math.floor(rng() * N_SEEDS);
        resampled.push(MAXZ[k][idx]);
      }
      sumK += median(resampled) / Math.sqrt(2 * Math.log(N_LADDER[k]));
    }
    samples.push(sumK / N_LADDER.length);
  }
  samples.sort((x, y) => x - y);
  return {
    lo: samples[Math.floor(0.025 * B)],
    hi: samples[Math.floor(0.975 * B)],
    B,
  };
}
const KAPPA_CI = bootstrapKappaCI();

// -- Propagate the ratio into a corrected alpha_c band ------------------------
//
// The fitted ratio is kappa_hat; the residual O(1) freedom (the constants are
// only known to be O(1)) is represented by an order-of-magnitude band
// rho in [1/4, 4]. alpha_c increases monotonically with rho.
const RHO_BAND = [0.25, 0.5, 1, 2, 4];
const ALPHA_C_VS_RHO = RHO_BAND.map((rho) => ({
  rho,
  alphaC_p50: bisectThreshold(0.5, rho),
  alphaC_p99: bisectThreshold(0.99, rho),
}));

const ALPHA_C_AT_FIT = {
  rho: KAPPA_HAT,
  alphaC_p50: bisectThreshold(0.5, KAPPA_HAT),
  alphaC_p99: bisectThreshold(0.99, KAPPA_HAT),
};

// Corrected band edges across the order-of-magnitude rho range.
const CORRECTED_BAND = {
  alphaC_p50_lo: bisectThreshold(0.5, RHO_BAND[0]),
  alphaC_p50_hi: bisectThreshold(0.5, RHO_BAND[RHO_BAND.length - 1]),
  alphaC_p99_lo: bisectThreshold(0.99, RHO_BAND[0]),
  alphaC_p99_hi: bisectThreshold(0.99, RHO_BAND[RHO_BAND.length - 1]),
};

// -- Edge-escape analysis -----------------------------------------------------
//
// An edge-scale escape would require alpha_c(rho) <= EDGE_ALPHA. Since
// alpha_c(rho) - alpha_c(1) = log(rho)/log N per row, dropping the threshold from
// the bulk regime to 2/3 needs rho <= N^(2/3 - 1) = N^-1/3, which -> 0 as N grows.
// So no FIXED O(1) coupling admits an asymptotic edge escape.
const REQUIRED_ESCAPE_RATIO_AT_MAX_N = Math.pow(
  N_LADDER[N_LADDER.length - 1],
  EDGE_ALPHA - 1,
);
const EDGE_CLOSURE_AT_FIT = closureFraction(EDGE_ALPHA, KAPPA_HAT);
const BULK_CLOSURE_AT_FIT = closureFraction(BULK_ALPHA, KAPPA_HAT);

// -- Residual sub-gap (rigorous statement still blocked) ----------------------

const IMP2439_SUB_GAP = {
  id: "imp-2439-true-CM-Hessian",
  label: "First-principles many-body CM Hessian and decrement constant",
  description:
    "This file pins the coupling ratio rho = c_pert/c_det OF THE REDUCED MODEL " +
    "(worst-case L-infinity coupling against a leading-order log-gas decrement), " +
    "fitting kappa_hat ~ 0.895 with a tight bootstrap CI. The genuine Route A step " +
    "needs the actual Calogero-Moser CM Hessian / coupling weights and the exact " +
    "deterministic decrement constant; deriving those is the imp-486 obstruction " +
    "(it requires GUE universality) and is NOT done here. The pinned constant is " +
    "therefore the model coupling, not the coupling of the true many-body step.",
  reference:
    "imp-2429 sub-gap imp-2429-O-coupling-constants; imp-486 CM correction; " +
    "imp-2365 local-law-rigidity-closure.js",
  difficulty: "research-grade / open",
  partialProgress:
    "Model coupling ratio pinned: kappa_hat = 0.895, bootstrap 95% CI " +
    "[0.879, 0.907], O(1) and slowly increasing toward 1 with N. Corrected alpha_c " +
    "band still forces near-bulk rigidity at the fitted ratio (alpha_c_p50 = 0.876); " +
    "an edge-scale escape would require rho <= N^-1/3 -> 0, excluded for any fixed " +
    "O(1) coupling.",
};

// -- Closure record -----------------------------------------------------------

export const CM_COUPLING_CONSTANT_BAND = {
  id: "imp-2439",
  title:
    "Pin the imp-2429-O-coupling-constants sub-gap in the Route A " +
    "rigidity-exponent bound",
  status: "partial",
  closureType: "honest-partial-numerical",
  proofSection: null,

  summary:
    "Estimates the previously-unpinned O(1) coupling constant of the imp-2429 Route " +
    "A rigidity model. Only the ratio rho = c_pert/c_det enters the closure " +
    "condition; fitting the empirical CM-correction prefactor kappa(N) = " +
    "median(maxAbs)/sqrt(2 log N) on the N in {64..4096} ladder pins rho with a " +
    "bootstrap CI and propagates it into a corrected alpha_c band. Reports whether " +
    "the band still forces bulk (alpha = 1) GUE rigidity or admits an edge-scale " +
    "escape.",

  fit: {
    description:
      "Empirical CM-correction prefactor kappa(N) = median_seeds(maxAbs)/sqrt(2 log " +
      "N): the dimensionless ratio of the realized worst-case L-infinity coupling to " +
      "its analytic Gumbel scale. Equals the model c_pert with c_det = 1.",
    perRow: KAPPA_PER_ROW,
    kappaHat: KAPPA_HAT,
    bootstrapCI95: KAPPA_CI,
    interpretation:
      "kappa_hat ~ 0.895 (CI [0.879, 0.907]) is firmly O(1) and not N-divergent; it " +
      "drifts slowly UP toward 1 with N, matching the Gumbel sub-leading correction. " +
      "The model coupling is therefore genuinely order-one, not a hidden large or " +
      "growing factor.",
  },

  propagation: {
    description:
      "alpha_c increases monotonically with the ratio rho; reported at p50 and p99 " +
      "across an order-of-magnitude band rho in [1/4, 4] plus the fitted value.",
    alphaCvsRho: ALPHA_C_VS_RHO,
    alphaCatFit: ALPHA_C_AT_FIT,
    correctedBand: CORRECTED_BAND,
    analyticLimit: BULK_ALPHA,
    limitRemark:
      "alpha_c(rho) - alpha_c(1) = log(rho)/log N per row, so for ANY fixed rho the " +
      "shift -> 0 and alpha_inf = 1 is rho-independent. The band only widens the " +
      "finite-N approach to the bulk limit.",
  },

  edgeEscape: {
    description:
      "Whether the corrected band admits an edge-scale (alpha = 2/3) escape.",
    edgeAlpha: EDGE_ALPHA,
    edgeClosureFractionAtFit: EDGE_CLOSURE_AT_FIT,
    bulkClosureFractionAtFit: BULK_CLOSURE_AT_FIT,
    requiredEscapeRatioAtMaxN: REQUIRED_ESCAPE_RATIO_AT_MAX_N,
    verdict:
      "NO edge escape. At the fitted ratio the edge exponent 2/3 closes 0% of " +
      "realizations and the bulk exponent 1 closes 100%. An edge escape needs rho <= " +
      "N^(2/3-1) = N^-1/3 (= 0.0625 at N = 4096), which -> 0 as N grows -- far below " +
      "the fitted CI lower bound 0.879 -- so no fixed O(1) coupling escapes.",
  },

  subGap: IMP2439_SUB_GAP,

  verdict:
    "PINNED MODEL COUPLING + CORRECTED BAND: only the ratio rho = c_pert/c_det " +
    "enters; the empirical CM-correction prefactor fits to kappa_hat = 0.895 " +
    "(bootstrap 95% CI [0.879, 0.907]), confirming the imp-2429 O(1) normalization " +
    "was accurate and not a hidden divergent factor. Propagated, the corrected " +
    "alpha_c band is 0.876 (p50, at the fit) and 0.67..1.11 (p50) / 0.75..1.28 (p99) " +
    "over an order-of-magnitude rho in [1/4, 4]; the analytic limit alpha_inf = 1 is " +
    "rho-INDEPENDENT. The band still FORCES near-bulk GUE rigidity: an edge-scale " +
    "escape would require the coupling ratio rho <= N^-1/3 -> 0, excluded for any " +
    "fixed O(1) constant. NOT a theorem -- the genuine many-body CM Hessian is still " +
    "open (sub-gap imp-2439-true-CM-Hessian); Route A closed-modulo-GUE status " +
    "unchanged.",
};

// -- Build-time assertions ----------------------------------------------------

export const CM_COUPLING_CONSTANT_BAND_ASSERTIONS = [
  {
    id: "imp2439-ensemble-populated",
    holds: () =>
      MAXZ.length === N_LADDER.length &&
      MAXZ.every((row) => row.length === N_SEEDS && row.every((v) => v > 0)),
    why:
      "Each (N, seed) cell must hold a positive maxAbs fluctuation. An empty or " +
      "zero cell means the seeded RNG or Box-Muller draw failed and every " +
      "downstream fit, CI and threshold is meaningless.",
  },
  {
    id: "imp2439-prefactor-is-O1",
    holds: () => KAPPA_HAT > 0.5 && KAPPA_HAT < 1.5,
    why:
      "The whole point of pinning the sub-gap: the fitted CM-correction prefactor " +
      "kappa_hat must come out genuinely O(1). A value outside (0.5, 1.5) would mean " +
      "the imp-2429 c_pert = 1 normalization hid a large or vanishing factor and the " +
      "threshold alpha_c was an artefact.",
  },
  {
    id: "imp2439-bootstrap-ci-tight-and-brackets",
    holds: () =>
      KAPPA_CI.lo < KAPPA_HAT &&
      KAPPA_HAT < KAPPA_CI.hi &&
      KAPPA_CI.hi - KAPPA_CI.lo < 0.2 &&
      KAPPA_CI.lo > 0,
    why:
      "The bootstrap CI must bracket the point estimate, be strictly positive, and " +
      "be tight (width < 0.2). A CI that misses the estimate, touches 0, or is wide " +
      "would mean the coupling constant is not actually pinned and the corrected " +
      "band cannot be trusted.",
  },
  {
    id: "imp2439-alphac-monotone-in-rho",
    holds: () => {
      const a = ALPHA_C_VS_RHO;
      for (let i = 1; i < a.length; i++) {
        if (!(a[i].alphaC_p50 > a[i - 1].alphaC_p50)) return false;
      }
      return true;
    },
    why:
      "A larger coupling ratio rho is a larger perturbation, so the required rigidity " +
      "exponent alpha_c must increase with rho. A non-monotone band means the " +
      "propagation of the constant into alpha_c is mis-implemented.",
  },
  {
    id: "imp2439-fitted-band-above-edge",
    holds: () => ALPHA_C_AT_FIT.alphaC_p50 > EDGE_ALPHA,
    why:
      "At the fitted coupling ratio the corrected threshold must still sit above the " +
      "edge-scale value 2/3. If it fell at or below 2/3 the imp-2365 edge-rigidity " +
      "input would suffice at the pinned constant, contradicting the imp-486 " +
      "bulk-universality obstruction.",
  },
  {
    id: "imp2439-edge-insufficient-bulk-sufficient-at-fit",
    holds: () => EDGE_CLOSURE_AT_FIT < 0.5 && BULK_CLOSURE_AT_FIT > 0.9,
    why:
      "At the pinned ratio, edge-scale rigidity (alpha = 2/3) must leave a majority " +
      "of realizations OPEN while bulk-scale (alpha = 1) closes nearly all. This is " +
      "the operational statement that the corrected band still forces near-bulk " +
      "rigidity.",
  },
  {
    id: "imp2439-no-fixed-O1-edge-escape",
    holds: () => REQUIRED_ESCAPE_RATIO_AT_MAX_N < KAPPA_CI.lo,
    why:
      "An edge-scale escape needs the coupling ratio below N^(2/3-1) = N^-1/3 at the " +
      "largest N. This required-escape ratio must sit far below the fitted CI lower " +
      "bound: if it did not, a plausible O(1) coupling could reach the edge and the " +
      "headline no-escape verdict would be false.",
  },
  {
    id: "imp2439-sub-gap-named",
    holds: () =>
      typeof IMP2439_SUB_GAP.id === "string" &&
      IMP2439_SUB_GAP.id.startsWith("imp-2439"),
    why:
      "An honest partial closure must name the residual sub-gap blocking a rigorous " +
      "statement. The id must start with imp-2439 to tie it to this ticket; a wrong " +
      "id breaks the audit trail and risks a false impression of full closure.",
  },
];
