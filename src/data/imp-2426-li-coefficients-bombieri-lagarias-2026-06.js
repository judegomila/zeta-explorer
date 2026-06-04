/**
 * @module data/imp-2426-li-coefficients-bombieri-lagarias-2026-06
 * @fileoverview imp-2426 (Wave-2 fan-out, Li-criterion direction) -- numerical
 * computation of the Li / Keiper coefficients lambda_n for n up to 300 via the
 * Bombieri-Lagarias arithmetic expression over the nontrivial zeta zeros, a
 * positivity check (RH-equivalent), and a comparison of the growth rate to the
 * conjectured (n/2)(log n - 1 + gamma_E) asymptotic. NUMERICAL EVIDENCE ONLY --
 * no proof claim. Precomputed (no heavy zeros-bundle import in this file); the
 * generator reads ZEROS_EXTENDED from src/data/zeros-to-1e6.js offline.
 * @see imp-2426
 */
// imp-2426 -- Li coefficients via Bombieri-Lagarias.
//
// CONTEXT
// -------
// Li (1997) showed RH is equivalent to lambda_n > 0 for every n >= 1, where
//     lambda_n := sum_rho [ 1 - (1 - 1/rho)^n ]
// the sum running over the nontrivial zeros rho of zeta (Bombieri-Lagarias
// 1999 gave this arithmetic form). Pairing each zero with its conjugate and
// assuming RH (rho = 1/2 + i*gamma, gamma real) the pair contribution is real:
//     [1 - (1-1/rho)^n] + [1 - (1-1/conj rho)^n] = 2 - 2*Re((1-1/rho)^n).
// So the finite-zero partial sum used here is
//     lambda_n(N) = sum_{k=1..N, gamma_k>0} [ 2 - 2*Re((1 - 1/rho_k)^n) ],
// with 1 - 1/rho_k = (1 - 0.5/d_k) + i*(gamma_k/d_k), d_k = 0.25 + gamma_k^2.
//
// METHOD
// ------
// Generator (offline, double precision): iterate over the first N Odlyzko
// ordinates from src/data/zeros-to-1e6.js, accumulating (1 - 1/rho_k)^n by
// repeated complex multiplication for n = 1..300. Convergence in N was checked
// at N in {1e2, 1e3, 1e4, 1e5, 1e6}; values below use N = 1e6 (zeros up to
// height ~6e5). lambda_1(1e6) = 0.0230924034 versus the closed-form
// lambda_1 = 1 + gamma_E/2 - (1/2)log(4*pi) = 0.0230957090, agreeing to ~3.3e-6
// (the residual is the truncated-tail bias, see SUB-GAP below).
//
// RESULT
// ------
//  - POSITIVITY: every lambda_n (1 <= n <= 300) is strictly positive; the
//    minimum over the range is lambda_1 ~ 0.0231. This is consistent with RH;
//    it is of course NOT a proof (only finitely many n, finite zero set).
//  - GROWTH: lambda_n rises monotonically and superlinearly. The ratio
//    lambda_n / [ (n/2)(log n - 1 + gamma_E) ] climbs from ~0.19 (n=5) through
//    ~0.57 (n=100) to ~0.66 (n=300): the partial sums track the conjectured
//    Keiper-Li trend qualitatively but the asymptotic constant is approached
//    only slowly (the secondary log-term dominates well past n=300).
//  - LAMBDA-FRAMEWORK LINK: the per-zero kernel 2 - 2*Re((1-1/rho)^n) ~
//    4*sin^2(n/(2*gamma)) for gamma >> n weights low zeros most, the same
//    low-lying gamma that dominate the project heat-flow / Dyson picture; no
//    sharper correlation is asserted here.
//
// SUB-GAP (honest partial)
// ------------------------
// The pure zero-sum truncation is not fully converged at large n: the gap
// |lambda_n(1e6) - lambda_n(1e5)| reaches ~1.69 near n=300, so high-n values
// carry O(1) absolute uncertainty. Two compounding causes: (i) the ~10-digit
// precision of the bulk Odlyzko ordinates in zeros-to-1e6.js, and (ii) the
// slowly-decaying n^2/gamma^2 tail of the kernel. A rigorously controlled
// high-n computation would use the explicit archimedean + prime form of the
// Bombieri-Lagarias formula (or higher-precision zeros) rather than the bare
// partial sum -- left as the named follow-on sub-gap.

export const LI_COEFFICIENTS_BL_2026_06 = Object.freeze({
  id: "imp-2426",
  method: "Bombieri-Lagarias zero-sum partial sum, N=1e6 Odlyzko ordinates, double precision",
  nMax: 300,
  zerosUsed: 1000000,
  lambda1Computed: 0.0230924034,
  lambda1ClosedForm: 0.0230957090, // 1 + gamma_E/2 - (1/2)log(4*pi)
  allPositive: true,
  minLambda: 0.02309240,
  minLambdaAtN: 1,
  // worst-case partial-sum drift between N=1e5 and N=1e6 over 1<=n<=300
  tailUncertaintyAbs: 1.688,
  gammaEuler: 0.5772156649015329,
  // asymptotic compared against: g(n) = (n/2)*(log n - 1 + gamma_E)
  // sampled values: { n, lambda_n(1e6), g(n), ratio }
  samples: Object.freeze([
    { n: 1, lambda: 0.023092, asymptotic: -0.2114, ratio: -0.1092 },
    { n: 2, lambda: 0.092333, asymptotic: 0.2704, ratio: 0.3415 },
    { n: 3, lambda: 0.207609, asymptotic: 1.0137, ratio: 0.2048 },
    { n: 4, lambda: 0.368738, asymptotic: 1.9270, ratio: 0.1914 },
    { n: 5, lambda: 0.575460, asymptotic: 2.9666, ratio: 0.1940 },
    { n: 10, lambda: 2.279009, asymptotic: 9.3990, ratio: 0.2425 },
    { n: 20, lambda: 8.767955, asymptotic: 25.7295, ratio: 0.3408 },
    { n: 50, lambda: 43.522833, asymptotic: 87.2310, ratio: 0.4989 },
    { n: 100, lambda: 118.570720, asymptotic: 209.1193, ratio: 0.5670 },
    { n: 150, lambda: 207.602999, asymptotic: 344.0888, ratio: 0.6033 },
    { n: 200, lambda: 306.523543, asymptotic: 487.5533, ratio: 0.6287 },
    { n: 250, lambda: 407.489304, asymptotic: 637.3346, ratio: 0.6394 },
    { n: 300, lambda: 519.404466, asymptotic: 792.1497, ratio: 0.6557 },
  ]),
  proofClaim: false,
  note: "RH-consistent positivity over a finite range; not a proof. High-n values carry O(1) tail uncertainty (see SUB-GAP).",
});
