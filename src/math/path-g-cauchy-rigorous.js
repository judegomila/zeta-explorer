/**
 * Path G Cauchy Rigorization -- imp-427 partial closure of skp-007 (NAMED).
 *
 * skp-007 CONCERN (paper-skeptic-review.js):
 *   Path G claims ||S_{N+1} - S_N||_F decays as N^{-2*sigma} (R^2 = 1.0).
 *   R^2 = 1.0 is a numerical-fit coefficient on finite data -- not a proof.
 *   A referee requires an analytical upper bound on ||S_{N+1} - S_N||_F
 *   or a Cauchy criterion with explicit N-independent error bounds.
 *
 * WHAT THIS FILE PROVIDES:
 *
 * (A) EXPLICIT ANALYTICAL UPPER BOUND (Section 1):
 *       ||T_p - I||_F  <=  C_0(sigma) * p^{-sigma}
 *     where  C_0(sigma) = 2 / sqrt(1 - 4^{-sigma})   [exact, computable, sigma > 0]
 *
 *     Proof sketch (full proof in DERIVATION below):
 *       Let x = p^{-2*sigma} = |rho_p|^2,  tau = sqrt(1 - x).
 *       ||T_p - I||_F^2 = 4*(1-tau)/tau^2.
 *       Since (1-tau) = x/(1+tau) and tau^2 = 1-x:
 *         = 4*x / ((1+tau)*(1-x))   <=   4*x / (1-4^{-sigma})   [p >= 2, 1+tau >= 1]
 *         = C_0(sigma)^2 * p^{-2*sigma}.
 *     The bound is PHASE-INDEPENDENT: depends only on |rho_p| = p^{-sigma},
 *     not on arg(rho_p) = -t*log(p). Holds for all t (all frequencies).
 *
 * (B) CASCADE OPERATOR NORM BOUND (Section 2):
 *       ||S_N||_op  <=  exp( L_N(sigma) )
 *     where  L_N(sigma) = Sigma_{k<=N} atanh(p_k^{-sigma}).
 *     Proof: ||S_N||_op <= Product ||T_{p_k}||_op;
 *            log ||T_p||_op = atanh(p^{-sigma})  [exact: singular values of T_p].
 *
 * (C) RIGOROUS CAUCHY CONVERGENCE FOR sigma > 1 (Section 3):
 *     Combined: Sigma_N ||S_{N+1}-S_N||_F  <=  exp(L_inf)*C_0*Sigma_p p^{-sigma}.
 *     For sigma > 1: both L_inf = Sigma_p atanh(p^{-sigma}) < inf
 *                    and Sigma_p p^{-sigma} < inf (prime zeta, abs. convergent).
 *     -> {S_N} is Cauchy in Frobenius norm -> S_inf = lim S_N exists.  [RIGOROUS]
 *
 * (D) NAMED RESIDUAL SUB-GAPS (Section 4):
 *
 *   Gap G-1 (sigma in (1/2, 1]):
 *     L_N(sigma) -> inf as N -> inf (Sigma_p p^{-sigma} diverges for sigma <= 1).
 *     The naive bound exp(L_N)*C_0*p^{-sigma} diverges. Convergence for this
 *     range requires PHASE-MIXING: the imaginary-part phases -t*log(p) are
 *     Weyl-equidistributed (for irrational t), producing oscillatory cancellation
 *     that effectively upgrades the decay p^{-sigma} -> p^{-2*sigma}. This
 *     cancellation is numerically observed (R^2 = 1.0) but not yet analytically
 *     bounded via equidistribution rates.
 *
 *   Gap G-2 (sigma = 1/2, the RH case):
 *     Even granting the phase-mixing upgrade p^{-sigma} -> p^{-2*sigma},
 *     the sum Sigma_p p^{-1} ~ Sigma 1/(N*log N) DIVERGES (log-log, Mertens).
 *     Path G does NOT establish ABSOLUTE Cauchy convergence at sigma = 1/2.
 *     If S_N converges at sigma = 1/2, the convergence is CONDITIONAL (partial
 *     sum cancellation), not absolute (Sigma ||D_N|| < inf). The R^2 = 1.0
 *     regression cannot distinguish sigma = 1/2 from sigma = 1/2 + epsilon
 *     at finite N since both have slowly growing partial sums over N <= 10^4.
 *
 * CORRECTED PAPER TEXT:
 *   Path G (rigorous form): ||T_p-I||_F <= C_0(sigma)*p^{-sigma} [ANALYTICAL].
 *   For sigma > 1: {S_N} is Cauchy in Frobenius norm [UNCONDITIONAL].
 *   For sigma in (1/2,1]: convergence requires phase-mixing cancellation [Gap G-1].
 *   For sigma = 1/2: absolute convergence NOT established by this route [Gap G-2].
 *   The R^2 = 1.0 regression is corroborating evidence, not a proof.
 */

import { getPrimes } from './primes.js';

// ── Section 1: Explicit analytical upper bound on transfer matrix deviation ───

/**
 * Explicit constant C_0(sigma) = 2 / sqrt(1 - 4^{-sigma}).
 * Theorem: ||T_p - I||_F <= C_0(sigma) * p^{-sigma} for all p >= 2, sigma > 0.
 */
export function computeC0(sigma) {
  const base = 1 - Math.pow(4, -sigma);
  if (base <= 0) return Infinity;
  return 2 / Math.sqrt(base);
}

/**
 * Exact ||T_p - I||_F for the physical ZPO transfer matrix.
 *   T_p = (1/tau_p) [[1, -rho_p], [-rhoBar_p, 1]]
 *   rho_p = p^{-s},  tau_p = sqrt(1 - p^{-2*sigma})
 *
 * Result depends ONLY on |rho_p| = p^{-sigma} (phase cancels in the Frobenius norm).
 * Formula: sqrt(4*(1 - tau) / tau^2)   where tau = sqrt(1 - p^{-2*sigma}).
 */
export function transferDeviation(p, sigma) {
  const x = Math.pow(p, -2 * sigma);        // |rho_p|^2
  const tau = Math.sqrt(Math.max(0, 1 - x));
  if (tau < 1e-300) return Infinity;
  return Math.sqrt(4 * (1 - tau) / (tau * tau));
}

/**
 * Verify the analytical bound holds for prime p at given sigma.
 * Returns { p, sigma, exact, bound, holds, ratio }.
 */
export function verifyDevBound(p, sigma) {
  const exact = transferDeviation(p, sigma);
  const bound = computeC0(sigma) * Math.pow(p, -sigma);
  const ratio = exact / bound;
  return {
    p, sigma,
    exact:  +exact.toFixed(8),
    bound:  +bound.toFixed(8),
    ratio:  +ratio.toFixed(6),
    holds:  exact <= bound * (1 + 1e-9),
  };
}

// ── Section 2: Cascade operator norm bound ────────────────────────────────────

/**
 * log ||T_p||_op = atanh(p^{-sigma}).
 * Exact: singular values of T_p are {sqrt((1+r)/(1-r)), sqrt((1-r)/(1+r))}
 * where r = p^{-sigma}. Max singular value = exp(atanh(r)).
 */
export function transferLogOpNorm(p, sigma) {
  const r = Math.pow(p, -sigma);
  if (r >= 1) return Infinity;
  return Math.atanh(r);
}

/**
 * Upper bound on log||S_N||_op:
 *   L_N(sigma) = Sigma_{k=1}^{N} atanh(p_k^{-sigma})  >= log ||S_N||_op.
 * From submultiplicativity: ||S_N||_op <= Product_{k<=N} ||T_{p_k}||_op = exp(L_N).
 */
export function cascadeLogNormBound(primes, N, sigma) {
  let L = 0;
  const limit = Math.min(N, primes.length);
  for (let k = 0; k < limit; k++) {
    const r = Math.pow(primes[k], -sigma);
    if (r >= 1) return Infinity;
    L += Math.atanh(r);
  }
  return L;
}

// ── Section 3: Rigorous Cauchy sum bound for sigma > 1 ────────────────────────

/**
 * Computes the Cauchy bound Sigma_{k=1}^{maxN} exp(L_k) * C_0 * p_k^{-sigma}.
 * For sigma > 1 this sum converges as maxN -> inf.
 * Returns samples at selected indices and total.
 */
export function cauchySumBound(maxN, sigma) {
  const primes = getPrimes(maxN + 1);
  const c0 = computeC0(sigma);
  let L = 0;
  let total = 0;
  const samples = [];
  const sampleIdx = new Set([4, 9, 24, 49, 99]);

  for (let k = 0; k < Math.min(maxN, primes.length); k++) {
    const p = primes[k];
    const r = Math.pow(p, -sigma);
    if (r >= 1) break;
    L += Math.atanh(r);
    const term = Math.exp(L) * c0 * r;
    total += term;
    if (sampleIdx.has(k)) {
      samples.push({
        k: k + 1, p, L_k: +L.toFixed(6),
        term: +term.toExponential(4),
        cumulative: +total.toExponential(4),
      });
    }
  }
  return { sigma, c0: +c0.toFixed(6), L_N: +L.toFixed(6), totalBound: +total.toFixed(4), samples };
}

// ── Section 4: Named residual sub-gaps ────────────────────────────────────────

export const RESIDUAL_SUB_GAPS = [
  {
    id: "G-1",
    domain: "sigma in (1/2, 1]",
    statement:
      "Naive bound exp(L_N)*C_0*p^{-sigma} diverges: L_N -> inf since "
      + "prime-zeta P(sigma) = Sigma_p p^{-sigma} diverges for sigma <= 1. "
      + "Convergence in this range requires a PHASE-MIXING argument: the "
      + "Weyl equidistribution of phases -t*log(p) mod 2*pi provides oscillatory "
      + "cancellation upgrading p^{-sigma} -> p^{-2*sigma} effective decay. "
      + "Analytically plausible from Weyl's theorem; not yet quantitatively bounded.",
    rigorousFor: "sigma > 1 (unconditional)",
    openSubproblem: "Bound E[||S_N*(T_p-I)||_F] <= C*p^{-2*sigma} via equidistribution rate.",
  },
  {
    id: "G-2",
    domain: "sigma = 1/2 (critical line, RH case)",
    statement:
      "Even granting the phase-mixing upgrade, Sigma_p p^{-1} ~ Sigma 1/(N*log N) "
      + "diverges (Mertens second theorem: log-log divergence). Path G does NOT "
      + "establish absolute Cauchy convergence at sigma = 1/2. If S_N converges "
      + "at sigma = 1/2, the convergence is CONDITIONAL (cancellation within "
      + "partial sums) rather than absolute (Sigma ||D_N|| < inf). "
      + "The R^2 = 1.0 fit cannot distinguish sigma = 1/2 from sigma > 1/2 "
      + "at finite N since both give slowly growing partial sums over N <= 10^4.",
    rigorousFor: "sigma > 1/2 + epsilon for any epsilon > 0 (conditional on G-1 resolution)",
    openSubproblem: "Does S_N converge conditionally at sigma = 1/2? Which summability method applies?",
  },
];

// ── Module-level witnesses (computed once at load time) ───────────────────────

const _P30 = getPrimes(30);
const _devChecks075 = _P30.slice(0, 10).map((p) => verifyDevBound(p, 0.75));
const _devChecks150 = _P30.slice(0, 10).map((p) => verifyDevBound(p, 1.5));
const _cauchy150 = cauchySumBound(100, 1.5);
const _cauchy200 = cauchySumBound(100, 2.0);

// ── Main export ───────────────────────────────────────────────────────────────

export const PATH_G_CAUCHY_RIGOROUS = {
  id:       "imp-427",
  closes:   "skp-007 (NAMED gap, paper-skeptic-review.js) -- PARTIAL closure",
  severity: "NAMED -> PARTIAL-CLOSED (sub-gaps G-1 and G-2 remain open)",

  analyticalBound: {
    formula:   "||T_p - I||_F <= C_0(sigma) * p^{-sigma}",
    constant:  "C_0(sigma) = 2 / sqrt(1 - 4^{-sigma})",
    derivation: [
      "1. ||T_p-I||_F^2 = 2*(1/tau-1)^2 + 2*|rho/tau|^2 where tau=sqrt(1-|rho|^2)",
      "2. Algebraic simplification: = 4*(1-tau)/tau^2",
      "3. Since (1-tau) = |rho|^2/(1+tau) and tau^2 = 1-|rho|^2:",
      "   = 4*p^{-2*sigma} / ((1+tau)*(1-p^{-2*sigma}))",
      "4. For p >= 2: 1+tau >= 1 and 1-p^{-2*sigma} >= 1-4^{-sigma}",
      "   => <= 4*p^{-2*sigma}/(1-4^{-sigma}) = C_0(sigma)^2 * p^{-2*sigma}",
    ],
    phaseIndependence:
      "||T_p-I||_F depends only on |rho_p| = p^{-sigma}, not arg(rho_p) = -t*log(p). "
      + "The bound is valid for all t simultaneously.",
    selectedC0: [0.5, 0.75, 1.0, 1.5, 2.0].map((s) => ({
      sigma: s,
      C0: +computeC0(s).toFixed(6),
    })),
  },

  cascadeOpNormBound: {
    formula:  "log ||S_N||_op <= L_N(sigma) = Sigma_{k<=N} atanh(p_k^{-sigma})",
    derivation:
      "||S_N||_op <= Product ||T_{p_k}||_op (submultiplicativity). "
      + "log ||T_p||_op = atanh(p^{-sigma}) [exact from singular value formula]. "
      + "For sigma > 1: L_inf = Sigma_p atanh(p^{-sigma}) < inf.",
  },

  rigorousCase: {
    condition: "sigma > 1 (unconditional)",
    argument:
      "For sigma > 1: L_inf = Sigma_p atanh(p^{-sigma}) <= (zeta(sigma)-1)/(1-4^{-sigma}) < inf. "
      + "||S_N||_op <= exp(L_inf) < inf for ALL N. "
      + "Combined: Sigma_N ||S_{N+1}-S_N||_F <= exp(L_inf)*C_0*(zeta(sigma)-1) < inf. "
      + "{S_N} is Cauchy in Frobenius norm -> S_inf = lim S_N exists in M(2,C). [RIGOROUS]",
    sigma15Witness: _cauchy150,
    sigma20Witness: _cauchy200,
  },

  residualSubGaps: RESIDUAL_SUB_GAPS,

  correctedPaperText:
    "Path G (corrected, rigorous form):\n"
    + "  Analytical bound: ||T_p-I||_F <= C_0(sigma)*p^{-sigma} with C_0=2/sqrt(1-4^{-sigma}).\n"
    + "  For sigma > 1: {S_N} is Cauchy in Frobenius norm [UNCONDITIONAL PROOF].\n"
    + "  For sigma in (1/2,1]: convergence requires phase-mixing bound [Gap G-1, open].\n"
    + "  For sigma = 1/2: absolute convergence NOT established by this path [Gap G-2, open].\n"
    + "  Status: strong corroborating evidence; not a proof at sigma = 1/2.",

  verdict: "PARTIAL-CLOSED",
};

// ── Build-time assertions ─────────────────────────────────────────────────────

export const PATH_G_CAUCHY_ASSERTIONS = [
  {
    id: "imp427-c0-half-exact-value",
    holds: () => Math.abs(computeC0(0.5) - 2 * Math.SQRT2) < 1e-10,
    why:
      "C_0(1/2) must equal 2*sqrt(2) ~ 2.828. "
      + "Derived from: 2/sqrt(1 - 4^{-1/2}) = 2/sqrt(1-1/2) = 2/sqrt(1/2) = 2*sqrt(2). "
      + "Any future edit that changes the formula will immediately fail this check.",
  },
  {
    id: "imp427-dev-bound-holds-sigma075",
    holds: () => _devChecks075.every((r) => r.holds),
    why:
      "The analytical bound ||T_p-I||_F <= C_0(0.75)*p^{-0.75} must hold for "
      + "each of the first 10 primes at sigma=0.75. This is the central claim of "
      + "the imp-427 closure. Failure means the C_0 formula is incorrect.",
  },
  {
    id: "imp427-dev-bound-holds-sigma150",
    holds: () => _devChecks150.every((r) => r.holds),
    why:
      "Same bound check at sigma=1.5 (the rigorous-case range). "
      + "Confirms the bound works in the regime where the Cauchy sum is proven finite.",
  },
  {
    id: "imp427-cauchy-sum-finite-sigma20",
    holds: () => Number.isFinite(_cauchy200.totalBound) && _cauchy200.totalBound < 20,
    why:
      "At sigma=2.0 the Cauchy sum bound over 100 primes must be finite and < 20. "
      + "Verifies the rigorous case (sigma > 1) gives a numerically usable bound. "
      + "The exact value ~ 2.65 from the explicit zeta(2)-1 formula.",
  },
];
