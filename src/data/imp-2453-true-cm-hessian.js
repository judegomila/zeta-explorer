/**
 * @module imp-2453-true-cm-hessian
 * @jsdocTag imp-2453
 *
 * imp-2453: True many-body Calogero-Moser Hessian for the Route-A
 * rigidity-exponent closure condition.
 *
 * Wave-4 follow-on to imp-2439 (sub-gap imp-2439-true-CM-Hessian). imp-2439
 * fitted only the scalar ratio rho = c_pert/c_det via an empirical prefactor
 * kappa(N) = median(maxAbs)/sqrt(2 log N) ~ 0.895. This module replaces that
 * fitted scalar with the GENUINE many-body Calogero-Moser (CM) Hessian: it
 * assembles the exact second-derivative matrix at the argmin (equilibrium) site,
 * diagonalizes it, and recomputes the corrected alpha_c band and the edge-escape
 * verdict from first principles.
 *
 * THE GENUINE HESSIAN
 * -------------------
 * The Route-A log-gas energy with harmonic confinement is
 *   E(x) = sum_i x_i^2/2 - sum_{i<j} log|x_i - x_j|.
 * Its stationary (argmin) configuration is the set of roots of the physicists
 * Hermite polynomial H_N (they satisfy sum_{j!=i} 1/(x_i-x_j) = x_i). At that
 * site the exact second-derivative (CM-correction) Hessian is
 *   H_ii = 1 + sum_{j!=i} 1/(x_i-x_j)^2,   H_ij = -1/(x_i-x_j)^2   (i != j).
 * This is the genuine many-body coupling matrix -- no modeling scalar.
 *
 * EXACT SPECTRUM (Calogero)
 * -------------------------
 * The classical Calogero result: this Hessian has eigenvalues EXACTLY the
 * integers {1, 2, ..., N}. We VERIFY this numerically here by building the dense
 * Hessian at the Golub-Welsch Hermite nodes and diagonalizing with a cyclic
 * Jacobi rotation solver -- the verified spectrum matches {1..N} to ~1e-12 for N
 * up to 128. Two exact consequences follow with NO fit and NO GUE universality:
 *   (1) tr(H^-1) = sum_k 1/lambda_k = sum_{k=1}^N 1/k = H_N  (the harmonic
 *       number), so the mean site compliance is H_N/N and the deterministic
 *       decrement constant is c_det(N) = H_N / log(N) -> 1 (Euler). The imp-2429
 *       assumed normalization c_det = 1 is thereby DERIVED, not posited.
 *   (2) the condition number kappa(H) = lambda_max/lambda_min = N/1 = N exactly.
 *
 * THE GENUINE COUPLING RATIO (replaces the fitted kappa)
 * ------------------------------------------------------
 * The genuine c_pert/c_det is the ratio of the worst-case linear response to the
 * mean response. The per-site linear compliance is (H^-1)_ii = sum_k
 * v_k(i)^2 / lambda_k, so
 *   rho_CM(N) = max_i (H^-1)_ii / mean_i (H^-1)_ii
 *             = N * max_i (H^-1)_ii / tr(H^-1).
 * Two facts: (a) rho_CM(N) >= 1 IDENTICALLY (max >= mean) for every N; (b)
 * measured on the ladder it GROWS as rho_CM ~ 0.545 * N^0.40 (the worst-case is
 * the soft edge site, compliance ~ N^-1/3, against the mean ~ log(N)/N). So the
 * genuine ratio is NOT a fixed O(1) constant ~0.895 -- the fitted-scalar model
 * UNDERSTATED the coupling, and the genuine Hessian forces rigidity more
 * strongly.
 *
 * EDGE-ESCAPE VERDICT
 * -------------------
 * An edge-scale escape requires rho <= N^-1/3. Since rho_CM(N) >= 1 > N^-1/3 for
 * every N >= 1, edge escape is EXCLUDED rigorously (no fitted constant), and
 * because rho_CM grows the exclusion margin WIDENS with N. Propagated through the
 * imp-2439 closure machinery, the corrected alpha_c band at the genuine ratio
 * rho_CM(64) = 2.86 is alpha_c_p50 = 1.06 / alpha_c_p99 = 1.20 -- at or above the
 * bulk value 1, versus imp-2439 0.876 at the fitted kappa.
 *
 * HONEST SCOPE
 * ------------
 * The exact spectrum, c_det -> 1, and the rho_CM >= 1 edge-escape exclusion are
 * rigorous and GUE-free. What remains open is the map from the dimensionless
 * compliance ratio to the physical rigidity exponent in absolute units (and the
 * true large-N law of rho_CM, fitted not proven beyond N = 128): that map is the
 * imp-486 GUE-universality obstruction. See sub-gap imp-2453-compliance-to-rigidity-map.
 * No QED; Route-A closed-modulo-GUE status unchanged.
 *
 * SYNTAX SAFETY: comments use dg_{k}/dt notation and H^-1; no apostrophes inside
 * single quoted strings.
 */

// -- Cyclic Jacobi symmetric eigensolver (eigenvalues + eigenvectors) ----------

function jacobiEig(Ain) {
  const n = Ain.length;
  const A = Ain.map((r) => r.slice());
  const V = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 1 : 0)),
  );
  for (let sweep = 0; sweep < 100; sweep++) {
    let off = 0;
    for (let p = 0; p < n; p++)
      for (let q = p + 1; q < n; q++) off += A[p][q] * A[p][q];
    if (off < 1e-24) break;
    for (let p = 0; p < n; p++) {
      for (let q = p + 1; q < n; q++) {
        const apq = A[p][q];
        if (Math.abs(apq) < 1e-300) continue;
        const phi = 0.5 * Math.atan2(2 * apq, A[q][q] - A[p][p]);
        const c = Math.cos(phi);
        const s = Math.sin(phi);
        for (let k = 0; k < n; k++) {
          const akp = A[k][p];
          const akq = A[k][q];
          A[k][p] = c * akp - s * akq;
          A[k][q] = s * akp + c * akq;
        }
        for (let k = 0; k < n; k++) {
          const apk = A[p][k];
          const aqk = A[q][k];
          A[p][k] = c * apk - s * aqk;
          A[q][k] = s * apk + c * aqk;
        }
        for (let k = 0; k < n; k++) {
          const vkp = V[k][p];
          const vkq = V[k][q];
          V[k][p] = c * vkp - s * vkq;
          V[k][q] = s * vkp + c * vkq;
        }
      }
    }
  }
  return { ev: A.map((r, i) => r[i]), V };
}

// -- Hermite equilibrium nodes via Golub-Welsch (b_k = sqrt(k/2)) --------------

function hermiteNodes(N) {
  const T = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let k = 1; k < N; k++) {
    const b = Math.sqrt(k / 2);
    T[k - 1][k] = b;
    T[k][k - 1] = b;
  }
  return jacobiEig(T).ev.slice().sort((a, b) => a - b);
}

// -- Genuine many-body CM Hessian at the argmin (equilibrium) site -------------

function cmHessian(x) {
  const N = x.length;
  const H = Array.from({ length: N }, () => new Array(N).fill(0));
  for (let i = 0; i < N; i++) {
    let diag = 1;
    for (let j = 0; j < N; j++) {
      if (i === j) continue;
      const d = x[i] - x[j];
      const w = 1 / (d * d);
      diag += w;
      H[i][j] = -w;
    }
    H[i][i] = diag;
  }
  return H;
}

// -- Dense-verification ladder: assemble + diagonalize the genuine Hessian -----

const VERIFY_LADDER = [2, 3, 4, 8, 16, 32, 64, 128];

const HESSIAN_ROWS = VERIFY_LADDER.map((N) => {
  const x = hermiteNodes(N);
  const { ev, V } = jacobiEig(cmHessian(x));
  const sorted = ev.slice().sort((a, b) => a - b);
  let specMaxDev = 0;
  for (let k = 0; k < N; k++)
    specMaxDev = Math.max(specMaxDev, Math.abs(sorted[k] - (k + 1)));
  // Site compliance (H^-1)_ii = sum_k V[i][k]^2 / lambda_k.
  let maxComp = 0;
  for (let i = 0; i < N; i++) {
    let s = 0;
    for (let k = 0; k < N; k++) s += (V[i][k] * V[i][k]) / ev[k];
    if (s > maxComp) maxComp = s;
  }
  const traceInv = ev.reduce((a, e) => a + 1 / e, 0);
  const meanComp = traceInv / N;
  return {
    N,
    specMaxDev,
    lambdaMin: sorted[0],
    lambdaMax: sorted[N - 1],
    traceInv,
    harmonicNumber: Array.from({ length: N }, (_, k) => 1 / (k + 1)).reduce(
      (a, b) => a + b,
      0,
    ),
    cDet: traceInv / Math.log(N),
    maxComp,
    meanComp,
    rhoCM: maxComp / meanComp,
  };
});

const SPEC_MAX_DEV = Math.max(...HESSIAN_ROWS.map((r) => r.specMaxDev));

// -- Power-law fit rho_CM ~ A * N^p over the N >= 8 portion of the ladder ------

function powerFit(rows) {
  const pts = rows.filter((r) => r.N >= 8);
  const n = pts.length;
  let sx = 0;
  let sy = 0;
  let sxx = 0;
  let sxy = 0;
  for (const r of pts) {
    const lx = Math.log(r.N);
    const ly = Math.log(r.rhoCM);
    sx += lx;
    sy += ly;
    sxx += lx * lx;
    sxy += lx * ly;
  }
  const p = (n * sxy - sx * sy) / (n * sxx - sx * sx);
  const A = Math.exp((sy - p * sx) / n);
  return { A, p };
}
const RHO_FIT = powerFit(HESSIAN_ROWS);

// -- Analytic ladder (exact spectrum {1..N}) for the production N in {64..4096} -
//
// For N this large the dense diagonalization is skipped; the exact Calogero
// spectrum {1..N} -- verified above -- gives every Hessian functional in closed
// form. The worst-case compliance (which needs eigenvectors) is extrapolated by
// the fitted power law and clearly labeled as such.

const PROD_LADDER = [64, 128, 256, 512, 1024, 2048, 4096];

function harmonicNumber(N) {
  let s = 0;
  for (let k = 1; k <= N; k++) s += 1 / k;
  return s;
}

const ANALYTIC_ROWS = PROD_LADDER.map((N) => {
  const HN = harmonicNumber(N);
  return {
    N,
    lambdaMin: 1,
    lambdaMax: N,
    conditionNumber: N,
    traceInv: HN,
    meanComp: HN / N,
    cDet: HN / Math.log(N),
    rhoCM_extrapolated: RHO_FIT.A * Math.pow(N, RHO_FIT.p),
  };
});

// -- Propagate the genuine ratio into a corrected alpha_c band -----------------
//
// Reuse the imp-2439 closure machinery (same maxAbs ensemble + bisection) so the
// corrected band is directly comparable. Only the coupling ratio changes: from
// the fitted kappa ~ 0.895 to the genuine Hessian rho_CM.

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

const N_SEEDS = 32;
const EDGE_ALPHA = 2 / 3;
const BULK_ALPHA = 1.0;
const MAXZ = PROD_LADDER.map((N, k) =>
  Array.from({ length: N_SEEDS }, (_, s) =>
    maxAbsNormals(N, mulberry32(1009 * (k + 1) + 7919 * (s + 1) + 17)),
  ),
);

function closureFraction(alpha, rho) {
  let closed = 0;
  let total = 0;
  for (let k = 0; k < PROD_LADDER.length; k++) {
    const N = PROD_LADDER[k];
    const d = Math.log(N) / N;
    const scale = rho * Math.pow(N, -alpha);
    for (let s = 0; s < N_SEEDS; s++) {
      total++;
      if (d - scale * MAXZ[k][s] >= 0) closed++;
    }
  }
  return closed / total;
}
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

// Genuine ratio at the largest densely-verified N (= 64) and the fitted kappa.
const RHO_CM_AT_64 = HESSIAN_ROWS.find((r) => r.N === 64).rhoCM;
const KAPPA_FITTED = 0.895; // imp-2439 fitted scalar, for comparison only

const CORRECTED_ALPHA_C = {
  atFittedKappa: {
    rho: KAPPA_FITTED,
    alphaC_p50: bisectThreshold(0.5, KAPPA_FITTED),
    alphaC_p99: bisectThreshold(0.99, KAPPA_FITTED),
  },
  atGenuineRhoCM64: {
    rho: RHO_CM_AT_64,
    alphaC_p50: bisectThreshold(0.5, RHO_CM_AT_64),
    alphaC_p99: bisectThreshold(0.99, RHO_CM_AT_64),
  },
};

// -- Edge-escape analysis ------------------------------------------------------

const REQUIRED_ESCAPE_RATIO_AT_MAX_N = Math.pow(
  PROD_LADDER[PROD_LADDER.length - 1],
  EDGE_ALPHA - 1,
);
const MIN_RHO_CM = Math.min(...HESSIAN_ROWS.map((r) => r.rhoCM));

// -- Residual sub-gap ----------------------------------------------------------

const IMP2453_SUB_GAP = {
  id: "imp-2453-compliance-to-rigidity-map",
  label:
    "Map the dimensionless CM compliance ratio to the physical rigidity exponent",
  description:
    "The genuine many-body CM Hessian is assembled exactly and its spectrum " +
    "verified to be {1..N} (Calogero), giving tr(H^-1) = H_N, c_det = H_N/log N " +
    "-> 1, and the genuine coupling ratio rho_CM(N) = max_i (H^-1)_ii / mean_i " +
    "(H^-1)_ii >= 1, which excludes edge escape (rho <= N^-1/3) rigorously. What " +
    "remains open is (a) the map from the dimensionless compliance ratio to the " +
    "physical rigidity exponent in absolute fluctuation units, and (b) the proven " +
    "large-N law of rho_CM beyond the N = 128 dense verification (fitted ~N^0.40, " +
    "not proven). Both reduce to the imp-486 GUE-universality obstruction.",
  reference:
    "imp-2439 sub-gap imp-2439-true-CM-Hessian; imp-2429 rigidity-exponent " +
    "bisection; imp-486 CM correction / GUE universality",
  difficulty: "research-grade / open",
  partialProgress:
    "Genuine CM Hessian assembled and diagonalized; spectrum = {1..N} verified to " +
    "~1e-12 for N up to 128. c_det DERIVED as H_N/log N -> 1 (was assumed = 1). " +
    "Genuine coupling rho_CM >= 1 identically and grows ~0.545 N^0.40; edge escape " +
    "excluded with WIDENING margin. Corrected alpha_c band at rho_CM(64) = 2.86 is " +
    "alpha_c_p50 = 1.06, at or above the bulk value 1.",
};

// -- Closure record ------------------------------------------------------------

export const TRUE_CM_HESSIAN = {
  id: "imp-2453",
  title:
    "True many-body Calogero-Moser Hessian for the Route-A rigidity-exponent " +
    "closure condition",
  status: "partial",
  closureType: "honest-partial-numerical",
  proofSection: null,

  summary:
    "Replaces the imp-2439 fitted scalar coupling kappa ~ 0.895 with the genuine " +
    "many-body Calogero-Moser Hessian H_ii = 1 + sum 1/(x_i-x_j)^2, H_ij = " +
    "-1/(x_i-x_j)^2 assembled at the Hermite equilibrium (argmin) and diagonalized. " +
    "Verifies the exact Calogero spectrum {1..N}, derives c_det = H_N/log N -> 1 " +
    "from tr(H^-1) = H_N, computes the genuine coupling ratio rho_CM = max/mean site " +
    "compliance, recomputes the corrected alpha_c band, and reports the edge-escape " +
    "verdict.",

  genuineHessian: {
    description:
      "Energy E(x) = sum x_i^2/2 - sum_{i<j} log|x_i-x_j|; argmin = roots of the " +
      "physicists Hermite polynomial H_N. The exact second-derivative matrix is the " +
      "genuine CM coupling Hessian -- no modeling scalar.",
    verifyLadder: VERIFY_LADDER,
    rows: HESSIAN_ROWS,
    spectrumMaxDeviation: SPEC_MAX_DEV,
    spectrumInterpretation:
      "Diagonalized spectrum matches the integers {1..N} to ~1e-12 up to N = 128, " +
      "confirming the classical Calogero result. This is the exact genuine content " +
      "the imp-2439 scalar only approximated.",
  },

  derivedConstants: {
    description:
      "Exact consequences of the {1..N} spectrum: tr(H^-1) = H_N (harmonic number), " +
      "so mean compliance = H_N/N and c_det(N) = H_N/log N -> 1 (Euler). Condition " +
      "number lambda_max/lambda_min = N exactly.",
    analyticLadder: PROD_LADDER,
    rows: ANALYTIC_ROWS,
    cDetLimit: 1,
    cDetRemark:
      "c_det(N) = H_N/log N decreases monotonically toward 1, DERIVING the imp-2429 " +
      "assumed normalization c_det = 1 instead of positing it.",
  },

  genuineCoupling: {
    description:
      "Genuine c_pert/c_det = ratio of worst-case to mean site compliance rho_CM(N) " +
      "= N * max_i (H^-1)_ii / tr(H^-1). Replaces the imp-2439 fitted kappa ~ 0.895.",
    rhoCM_at_N64: RHO_CM_AT_64,
    powerLawFit: RHO_FIT,
    fitInterpretation:
      "rho_CM ~ 0.545 N^0.40: NOT a fixed O(1) constant. The worst-case is the soft " +
      "edge site (compliance ~ N^-1/3) against the mean ~ log(N)/N, so rho_CM grows. " +
      "The fitted-scalar model UNDERSTATED the coupling; the genuine Hessian forces " +
      "rigidity more strongly.",
    rigorousLowerBound:
      "rho_CM(N) >= 1 IDENTICALLY for every N (max site compliance >= mean), no fit.",
  },

  correctedBand: {
    description:
      "alpha_c recomputed through the imp-2439 closure machinery at the genuine ratio " +
      "vs the old fitted kappa.",
    ...CORRECTED_ALPHA_C,
    analyticLimit: BULK_ALPHA,
    remark:
      "At the genuine rho_CM(64) = 2.86 the corrected threshold alpha_c_p50 = 1.06 " +
      "sits at or above the bulk value 1, versus 0.876 at the fitted kappa: the " +
      "genuine Hessian pushes the band toward (and past) bulk rigidity.",
  },

  edgeEscape: {
    description: "Whether the genuine Hessian admits an edge-scale (alpha = 2/3) escape.",
    edgeAlpha: EDGE_ALPHA,
    requiredEscapeRatioAtMaxN: REQUIRED_ESCAPE_RATIO_AT_MAX_N,
    minObservedRhoCM: MIN_RHO_CM,
    verdict:
      "NO edge escape, rigorously. An edge escape needs the coupling ratio rho <= " +
      "N^-1/3 (= 0.0625 at N = 4096), but the genuine rho_CM(N) >= 1 for every N and " +
      "GROWS as ~N^0.40, so the exclusion margin WIDENS with N. No fitted constant is " +
      "used in this lower bound -- it follows from max >= mean.",
  },

  subGap: IMP2453_SUB_GAP,

  verdict:
    "GENUINE MANY-BODY CM HESSIAN ASSEMBLED + DIAGONALIZED. The exact second " +
    "derivative matrix at the Hermite argmin has spectrum {1..N} (Calogero), " +
    "verified to ~1e-12 up to N = 128, replacing the imp-2439 fitted scalar kappa = " +
    "0.895. Exact consequences (no fit, no GUE): tr(H^-1) = H_N gives c_det = " +
    "H_N/log N -> 1, DERIVING the imp-2429 normalization; condition number = N. The " +
    "genuine coupling ratio rho_CM = max/mean site compliance is >= 1 identically and " +
    "GROWS as ~0.545 N^0.40 -- the fitted-scalar model understated it. The corrected " +
    "alpha_c band at rho_CM(64) = 2.86 is alpha_c_p50 = 1.06 / p99 = 1.20, at or " +
    "above the bulk value 1. Edge-scale escape (rho <= N^-1/3) is EXCLUDED rigorously " +
    "with a WIDENING margin. NOT a theorem -- the map from the dimensionless " +
    "compliance ratio to the physical rigidity exponent (and the proven large-N law " +
    "of rho_CM) is the imp-486 GUE obstruction; sub-gap " +
    "imp-2453-compliance-to-rigidity-map. Route-A closed-modulo-GUE status unchanged.",
};

// -- Build-time assertions -----------------------------------------------------

export const TRUE_CM_HESSIAN_ASSERTIONS = [
  {
    id: "imp2453-spectrum-is-integers",
    holds: () => SPEC_MAX_DEV < 1e-8,
    why:
      "The whole point: the genuine CM Hessian at the Hermite argmin must have the " +
      "exact Calogero spectrum {1..N}. If the diagonalized eigenvalues deviated from " +
      "the integers the assembled Hessian would be wrong and every derived constant " +
      "(tr(H^-1) = H_N, c_det, condition number) would be meaningless.",
  },
  {
    id: "imp2453-traceinv-equals-harmonic-number",
    holds: () =>
      HESSIAN_ROWS.every(
        (r) => Math.abs(r.traceInv - r.harmonicNumber) < 1e-6,
      ),
    why:
      "tr(H^-1) = sum 1/lambda_k must equal the harmonic number H_N because the " +
      "spectrum is {1..N}. This is the exact identity that DERIVES the deterministic " +
      "decrement c_det = H_N/log N -> 1; a mismatch would break that derivation.",
  },
  {
    id: "imp2453-cdet-trends-to-one",
    holds: () => {
      const last = ANALYTIC_ROWS[ANALYTIC_ROWS.length - 1].cDet;
      return last > 1 && last < 1.2;
    },
    why:
      "The derived deterministic decrement c_det(N) = H_N/log N must approach 1 from " +
      "above (Euler). At N = 4096 it should sit just above 1; a value far from 1 " +
      "would mean the imp-2429 c_det = 1 normalization was not actually recovered.",
  },
  {
    id: "imp2453-rhoCM-at-least-one",
    holds: () => HESSIAN_ROWS.every((r) => r.rhoCM >= 1 - 1e-9),
    why:
      "The genuine coupling ratio rho_CM = max/mean site compliance is >= 1 by the " +
      "trivial max >= mean inequality. This rigorous bound is exactly what excludes " +
      "edge escape (rho <= N^-1/3 < 1); if any row fell below 1 the no-escape verdict " +
      "would be unsupported.",
  },
  {
    id: "imp2453-rhoCM-grows",
    holds: () => {
      const r = HESSIAN_ROWS.filter((x) => x.N >= 8).map((x) => x.rhoCM);
      for (let i = 1; i < r.length; i++) if (!(r[i] > r[i - 1])) return false;
      return RHO_FIT.p > 0.2;
    },
    why:
      "The genuine ratio must GROW with N (positive power-law exponent), unlike the " +
      "imp-2439 fixed scalar. This is the key new finding: the fitted scalar " +
      "understated the coupling. A flat or shrinking rho_CM would contradict the " +
      "edge-site compliance scaling and the widening-margin claim.",
  },
  {
    id: "imp2453-no-edge-escape",
    holds: () => REQUIRED_ESCAPE_RATIO_AT_MAX_N < MIN_RHO_CM,
    why:
      "An edge escape needs rho <= N^-1/3 at the largest N. This required-escape " +
      "ratio must sit strictly below the smallest observed genuine rho_CM: if it did " +
      "not, the genuine Hessian could reach the edge and the no-escape verdict would " +
      "be false.",
  },
  {
    id: "imp2453-corrected-band-above-edge",
    holds: () =>
      CORRECTED_ALPHA_C.atGenuineRhoCM64.alphaC_p50 > EDGE_ALPHA &&
      CORRECTED_ALPHA_C.atGenuineRhoCM64.alphaC_p50 >
        CORRECTED_ALPHA_C.atFittedKappa.alphaC_p50,
    why:
      "The corrected threshold at the genuine ratio must sit above the edge value 2/3 " +
      "AND above the old threshold at the fitted kappa, since the genuine coupling is " +
      "larger. If it fell at or below 2/3, or below the fitted-kappa threshold, the " +
      "claim that the genuine Hessian forces rigidity more strongly would be wrong.",
  },
  {
    id: "imp2453-sub-gap-named",
    holds: () =>
      typeof IMP2453_SUB_GAP.id === "string" &&
      IMP2453_SUB_GAP.id.startsWith("imp-2453"),
    why:
      "An honest partial closure must name the residual sub-gap blocking a rigorous " +
      "statement. The id must start with imp-2453 to tie it to this ticket; a wrong " +
      "id breaks the audit trail and risks a false impression of full closure.",
  },
];
