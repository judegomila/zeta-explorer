/**
 * rh-route-a-reflection-positivity-primon-gas (2026-09-23) — FIRST TEST of
 * Route A of src/data/rh-novel-routes-roadmap-2026-09-23.js: "reflection
 * positivity (RP) of the primon gas about sigma = 1/2 -> Osterwalder-Schrader
 * (OS) reconstruction of a Hilbert-Polya operator". Exact setup, computed
 * reflection Gram spectra on first-N-prime truncations, verdict. RH OPEN;
 * no refereed bound is changed; NO QED.
 *
 * SETUP. Euclidean time tau = sigma - 1/2. Reflection theta: s -> 1 - conj(s)
 * (fixes the critical line pointwise), acting on observables by
 * (theta f)(s) = conj(f(1 - conj(s))). One-sided observables = functions of s
 * "at Euclidean times tau > 0", the OS-natural class being point evaluations
 * f_i(s) = 1/(s_i - s) at nodes s_i = 1/2 + nu_i, nu_i > 0 (equivalently
 * one-sided exponentials e^{-nu_i u} 1_{u>0} in the dual variable u = log x).
 * The pairing carrying the ZEROS as spectrum is the Weil (bilinear) zero
 * pairing <g, f>_W = sum_rho g(rho) f(rho), computed by the explicit formula
 * (Iwaniec-Kowalski normalisation, as in imp-95520). The reflection Gram is
 *   G_ij = <theta f_i, f_j>_W = sum_rho conj-bar f_i(1 - rho) f_j(rho),
 * and for the Cauchy class this is EXACTLY the Caratheodory Pick matrix
 *   G_ij = [F(s_i) + F(s_j)] / (s_i + s_j - 1),   F = xi'/xi,
 * because 1/((s_i - rho)(s_j - (1 - rho))) partial-fractions to
 * [1/(s_i - rho) + 1/(s_j - rho')]/(s_i + s_j - 1) with rho' = 1 - rho, and
 * the zero set is theta-symmetric. RP := G PSD for every finite one-sided
 * family. Under RH, G = Gram of the vectors (1/(s_i - rho))_rho, hence PSD;
 * conversely RP for all node sets <=> F Caratheodory on Re s > 1/2 <=> RH
 * (Lagarias 1999; Pick form in imp-95520). So in the zero pairing
 *   RP about sigma = 1/2  <=>  Weil positivity  <=>  RH,
 * an exact equivalence, NOT a stronger statement. OS reconstruction here is
 * the GNS construction of the Weil form: the reconstructed unitary group is
 * multiplication by e^{i gamma u} (translations in u = log x), whose
 * generator has spectrum {gamma}; the Euclidean-time generator (translations
 * in tau) is multiplication by u >= 0 on the Laplace side. The zeros sit on
 * the REAL-time (dilation) axis, not on the Euclidean axis; there is no
 * second "space" direction, so none of the OS-specific tools (Markov
 * property, transfer matrix, infrared bounds) has a domain to act on.
 *
 * THE ROADMAP'S FINITE-N TEST (the go/no-go). Truncate the GAS: the
 * completed N-prime partition function
 *   xi_N(s) = (1/2) s (s-1) pi^{-s/2} Gamma(s/2) prod_{p <= p_N} (1 - p^{-s})^{-1},
 *   F_N = xi_N'/xi_N = A(s) - sum_{p <= p_N} log p / (p^s - 1),
 *   A(s) = 1/s + 1/(s-1) - (ln pi)/2 + psi(s/2)/2,
 * and form the reflection Gram G^(N) = Pick matrix of F_N. RESULT: NOT PSD at
 * ANY N, and lambda_min -> -infinity. Mechanism (exact): on the strip
 * 1/2 < sigma < 1 the Euler product diverges; the partial sum grows like
 * p_N^{1-sigma}/(1-sigma), so
 *   F_N(1/2 + nu) - xi'/xi(1/2 + nu) = -p_N^{1/2 - nu}/(1/2 - nu) (1 + o(1)),
 * verified numerically (ratio 1.02 / 1.006 / 1.002 at nu = 0.1 / 0.25 / 0.4,
 * p_N = 9973). Hence the DIAGONAL entry G_ii = F_N(s_i)/nu_i is negative for
 * every node in the strip at every N (sup_{strip} F_N = -2.69 at N=0, -25.1
 * at N=1229), lambda_min on the node set nu in {0.05..1.5} runs
 * -143 (N=0) -> -4213 (N=1229, p_N=9973), monotone in N, scaling like
 * -p_N^{1/2 - nu_min}. The pure gas (no archimedean factor) is worse; the
 * zero/pole-free completion pi^{-s/2} Gamma(s/2+1) Z_N is negative on
 * sigma < 5.5 for all N. On sigma > 1 the finite gas is positive on the
 * diagonal (F_N > xi'/xi > 0) but its Pick matrix is still indefinite for
 * node sets near sigma = 1 at all N computed (truncation error
 * p_N^{1-s}/(s-1) is not Caratheodory); it becomes PSD only far out
 * (nodes s = 2.5, 4.5, 8.5 from N ~ 10), where positivity is the
 * UNCONDITIONAL sigma > 1 positivity and carries no RH information. So the
 * RP region of the N-prime gas converges to the CONVERGENCE region of the
 * Euler product (sigma > 1), never to the critical half-plane. Precisely:
 * the reflection s -> 1-s maps the gas's existence region sigma > 1 to
 * sigma < 0, where the finite gas has poles (Matsubara frequencies
 * 2 pi i k / log p, k in Z, on Re s = 0 — each an anti-Caratheodory term
 * -1/(s - i omega)); the critical strip is sandwiched between the
 * Bost-Connes phase boundary sigma = 1 and its reflection, and the ONLY
 * input that makes the strip reflection-positive is the analytic
 * continuation of the infinite product — which is not a property of any
 * finite gas.
 *
 * GAUSSIAN-REGULARISED PRIMON OBSERVABLES (the other natural class).
 * f_i(s) = p_i^{-s} e^{(t/2)(s-1/2)^2}: (theta f_i)(s) = p_i^{s-1} e^{(t/2)(s-1/2)^2},
 *   G_ij = (p_i p_j)^{-1/2} D_t(log p_i - log p_j),  D_t(u) = sum_rho e^{i gamma u} e^{-t gamma^2},
 * D_t computed by the explicit formula (2 cosh(u/2) e^{t/4} + archimedean
 * integral - prime side with Gaussian g_t(v) = e^{-v^2/4t}/sqrt(4 pi t));
 * cross-checked against the first 5000 Odlyzko zeros to 5e-12 at u = 0,
 * ln 2, ln 3/2, 2, 5 (literals baked; zeros bundle NOT imported). Under RH
 * G = sum_rho e^{-t gamma^2} v(gamma) v(gamma)^* with v_i = p_i^{-1/2+i gamma},
 * so PSD with rank <= 2 x (#zeros with e^{-t gamma^2} above noise). MEASURED
 * (t = 0.02): lambda_min >= -3e-15 (noise) at N = 10..250 primes, numerical
 * rank 12 = 2 x 6 zeros — the Gram saturates at the verified low zeros. This
 * class DOES detect a hypothetical off-line first zero: replacing the pair
 * 1/2 +- i gamma_1 by the quadruple beta +- i gamma_1, 1-beta +- i gamma_1
 * gives lambda_min = -1.2e-4 (beta = 0.55, N = 10), -9.7e-4 (0.6, N = 20),
 * -1.9e-2 (0.9, N = 20) versus +4.7e-12 at beta = 1/2 (double weight) — the
 * opposite of the Weil-blind native span of imp-95520 — but only for zeros
 * below height ~ 1/sqrt(t), i.e. exactly the verified range. Truncating the
 * GAS here too (prime side cut at p <= p_N) makes G^(N) indefinite,
 * lambda_min = -9e-5 (N=10) -> -3.8e-4 (N=250), NOT improving with N: the
 * dropped primes carry the mean density e^{v/2} that cancels the pole term
 * 2 cosh(u/2) in a boundary layer of log-width ~3 sqrt(4t) below log p_N, an
 * O(1)/sqrt(p_i p_j) entry error at the truncation edge for every N.
 * Observables kept out of that layer (p_i <= p_N e^{-3 sqrt(4t)}) see the
 * truncation exactly (entry error < 1e-12) and the Gram is PSD — with the
 * content of the verified zeros.
 *
 * RP TRANSCRIPTIONS THAT ARE TRUE — WITH THE WRONG SPECTRUM (computed rows
 * A0, A1; A-KMS is literature). Reflection about sigma = 0 with the Fock
 * (Gibbs) pairing: K(s_i,s_j) = zeta(s_i + s_j) = Gram of (n^{-s_i})_n, PSD,
 * reconstructed H = log N (spectrum {log n}; Bost-Connes Hamiltonian).
 * Polya kernel xi(1/2 + tau_i + tau_j) = int Phi(u) e^{tau_i u} e^{tau_j u} du
 * with Riemann's Phi > 0: PSD for ALL real tau, reconstructed generator =
 * multiplication by u on L^2(Phi du), spectrum R (zeros are where the Fourier
 * transform of Phi vanishes, not spectrum). KMS/Tomita-Takesaki: every KMS_beta
 * state is RP about beta/2 (Klein-Landau); at beta = 1 the reflection is
 * s -> 1-s exactly, but the Bost-Connes KMS_1 state is type III_1 with
 * modular spectrum R, again not the zeros. Every RP that is provable from the
 * gas STRUCTURE (independence of primes, positivity of Gibbs/KMS states,
 * Phi > 0) has continuous or arithmetic-progression spectrum; the RP whose
 * spectrum is the zeros is the Weil form, and its positivity is RH.
 *
 * VERDICT. (1) Finite-N gas RP about sigma = 1/2: REFUTED with a precise
 * mechanism and rate (lambda_min ~ -p_N^{1/2 - nu}, boundary-layer failure
 * in the smoothed class). (2) Infinite-N (analytically continued) RP: holds
 * numerically on every family computed, EQUIVALENT to Weil positivity =
 * RH, not stronger; OS reconstruction = GNS of the Weil form = the known
 * spectral realisation. (3) The route's premise "primon gas RP" conflates
 * the gas (RP-true, spectrum log n / R) with the completed zeta (RP <=> RH);
 * the Euler product is a SUM of indefinite mean-zero local densities
 * (log p)[1 - Poisson kernel P_{p^{-1/2}}(gamma log p)] on the line, so
 * independence of primes gives no positivity. Literature anchor for what IS
 * unconditional: positivity of the Weil form for test functions with
 * u-support inside the prime-free window |u| < (ln 2)/2 (Yoshida 1992;
 * Connes-Consani 2021 archimedean-place theorem; in-repo: imp-95520 class II
 * T = 0.3 rung) — conditionality begins at the first prime shift log 2.
 * NEXT TEST worth doing: none numerical in this class beyond verified height;
 * the only structural opening is a Euclidean theory with a genuine second
 * direction (e.g. the adelic/scaling-site geometry of Connes-Consani) in
 * which the archimedean vs prime-side comparison acquires a Markov/transfer
 * structure — not available from the primon gas itself.
 *
 * Import-free; assertions recompute everything cheap and compare baked
 * zero-side literals. Changes no Lambda bound; RH open; NO QED.
 */

const LNPI = Math.log(Math.PI);
const B2K = [1 / 6, -1 / 30, 1 / 42, -1 / 30, 5 / 66, -691 / 2730, 7 / 6];

// ---- complex helpers, digamma, lgamma
const cmul = (a, b) => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const csub = (a, b) => [a[0] - b[0], a[1] - b[1]];
const cinv = (a) => { const d = a[0] * a[0] + a[1] * a[1]; return [a[0] / d, -a[1] / d]; };
const clog = (a) => [Math.log(Math.hypot(a[0], a[1])), Math.atan2(a[1], a[0])];
function digammaC(z) {
  let x = [z[0], z[1]]; let acc = [0, 0];
  while (Math.hypot(x[0], x[1]) < 12) { acc = csub(acc, cinv(x)); x = [x[0] + 1, x[1]]; }
  let s = clog(x); s = csub(s, cmul([0.5, 0], cinv(x)));
  const x2 = cinv(cmul(x, x)); let p = x2;
  for (let k = 1; k <= 7; k++) { s = csub(s, cmul([B2K[k - 1] / (2 * k), 0], p)); p = cmul(p, x2); }
  return [s[0] + acc[0], s[1] + acc[1]];
}
const digammaR = (x) => digammaC([x, 0])[0];
function lgamma(x) {
  let acc = 0; while (x < 15) { acc -= Math.log(x); x += 1; }
  let s = (x - 0.5) * Math.log(x) - x + 0.5 * Math.log(2 * Math.PI);
  let p = 1 / x; const x2 = 1 / (x * x);
  for (let k = 1; k <= 7; k++) { s += B2K[k - 1] / (2 * k * (2 * k - 1)) * p; p *= x2; }
  return s + acc;
}
// zeta, zeta' at real s > 0, s != 1 (Euler-Maclaurin, N = 60, 7 Bernoulli terms)
function zetaAndDeriv(s) {
  const N = 60; let z = 0, dz = 0;
  for (let n = 1; n < N; n++) { const t = Math.pow(n, -s); z += t; dz -= Math.log(n) * t; }
  const lnN = Math.log(N), N1s = Math.pow(N, 1 - s);
  z += N1s / (s - 1) + 0.5 * Math.pow(N, -s);
  dz += -lnN * N1s / (s - 1) - N1s / ((s - 1) * (s - 1)) - 0.5 * lnN * Math.pow(N, -s);
  let fact = 1;
  for (let k = 1; k <= 7; k++) {
    fact *= (2 * k - 1) * (2 * k);
    let P = 1, dlogP = 0;
    for (let j = 0; j <= 2 * k - 2; j++) { P *= (s + j); dlogP += 1 / (s + j); }
    const term = (B2K[k - 1] / fact) * P * Math.pow(N, -s - 2 * k + 1);
    z += term; dz += term * (dlogP - lnN);
  }
  return { z, dz };
}
export const zetaLogDeriv = (s) => { const { z, dz } = zetaAndDeriv(s); return dz / z; };
export const archLogDeriv = (s) => 1 / s + 1 / (s - 1) - 0.5 * LNPI + 0.5 * digammaR(s / 2); // xi_inf'/xi_inf
export const xiLogDeriv = (s) => archLogDeriv(s) + zetaLogDeriv(s);
export const xiReal = (s) => 0.5 * s * (s - 1) * Math.exp(-0.5 * s * LNPI + lgamma(s / 2)) * zetaAndDeriv(s).z;

// ---- Jacobi eigenvalues (symmetric), primes
function jacobiVals(Ain) {
  const n = Ain.length; const A = Ain.map((r) => r.slice());
  for (let sweep = 0; sweep < 300; sweep++) {
    let off = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) off += A[i][j] ** 2;
    if (off < 1e-30) break;
    for (let p = 0; p < n; p++) for (let q = p + 1; q < n; q++) {
      if (Math.abs(A[p][q]) < 1e-300) continue;
      const th = (A[q][q] - A[p][p]) / (2 * A[p][q]);
      const t = Math.sign(th || 1) / (Math.abs(th) + Math.sqrt(th * th + 1));
      const c = 1 / Math.sqrt(t * t + 1), sn = t * c;
      for (let k = 0; k < n; k++) { const akp = A[k][p], akq = A[k][q]; A[k][p] = c * akp - sn * akq; A[k][q] = sn * akp + c * akq; }
      for (let k = 0; k < n; k++) { const apk = A[p][k], aqk = A[q][k]; A[p][k] = c * apk - sn * aqk; A[q][k] = sn * apk + c * aqk; }
    }
  }
  return A.map((r, i) => r[i]).sort((a, b) => a - b);
}
function primesUpTo(M) { const s = new Uint8Array(M + 1); const P = []; for (let i = 2; i <= M; i++) { if (!s[i]) { P.push(i); for (let j = i * i; j <= M; j += i) s[j] = 1; } } return P; }
const PR = primesUpTo(10000); // 1229 primes

// ---- A3: finite-N gas log-derivatives and Pick reflection Gram
export const gasSum = (s, N) => { let acc = 0; for (let i = 0; i < N; i++) { const p = PR[i]; acc += Math.log(p) / (Math.pow(p, s) - 1); } return acc; };
export const finiteGasLogDeriv = (N) => (s) => archLogDeriv(s) - gasSum(s, N);           // completed N-prime gas
export const pureGasLogDeriv = (N) => (s) => -gasSum(s, N);                                // no archimedean factor
export const zeroFreeGasLogDeriv = (N) => (s) => -0.5 * LNPI + 0.5 * digammaR(s / 2 + 1) - gasSum(s, N); // pi^{-s/2}Gamma(s/2+1)Z_N
export const pickGram = (F, nus) => nus.map((a) => nus.map((b) => (F(0.5 + a) + F(0.5 + b)) / (a + b)));
export const lamMin = (G) => jacobiVals(G)[0];
export const lamMax = (G) => { const e = jacobiVals(G); return e[e.length - 1]; };

export const ROUTE_A_NODES = Object.freeze([0.05, 0.1, 0.2, 0.3, 0.4, 0.6, 1.0, 1.5]);
export const ROUTE_A_N_LADDER = Object.freeze([0, 1, 2, 3, 5, 10, 25, 50, 100, 200, 400, 800, 1229]);

// ---- A4: Gaussian-regularised primon class, D_t(u) by the explicit formula
export const ROUTE_A_T = 0.02;
const GAMMA1 = 14.134725142;
const PP = []; for (const p of PR) { for (let q = p; q <= 10000; q *= p) PP.push({ ln: Math.log(q), w: Math.log(p) * Math.pow(q, -0.5), p }); }
let PSI_CACHE = null;
function psiGrid(t) {
  if (PSI_CACHE && PSI_CACHE.t === t) return PSI_CACHE;
  const rmax = 60, h = 0.01, K = Math.round(rmax / h); const psi = new Float64Array(K + 1);
  for (let k = 0; k <= K; k++) psi[k] = (digammaC([0.25, k * h / 2])[0] - LNPI) * Math.exp(-t * (k * h) ** 2);
  PSI_CACHE = { t, h, K, psi }; return PSI_CACHE;
}
/** D_t(u) = sum_rho e^{i gamma u} e^{-t gamma^2} via the explicit formula; pmax truncates the prime side to p <= pmax. */
export function heatSpectralFunction(u, t = ROUTE_A_T, pmax = Infinity) {
  const { h, K, psi } = psiGrid(t);
  let acc = 0;
  for (let k = 0; k <= K; k++) { const w = (k === 0 || k === K) ? 1 : (k % 2 ? 4 : 2); acc += w * Math.cos(k * h * u) * psi[k]; }
  const arch = acc * h / 3 / Math.PI;
  const norm = 1 / Math.sqrt(4 * Math.PI * t);
  let pr = 0;
  for (const q of PP) { if (q.p > pmax) continue; const a = q.ln - u, b = q.ln + u; pr += q.w * (Math.exp(-a * a / (4 * t)) + Math.exp(-b * b / (4 * t))) * norm; }
  return 2 * Math.cosh(u / 2) * Math.exp(t / 4) + arch - pr;
}
// replace the on-line pair 1/2 +- i gamma_1 by the quadruple beta +- i gamma_1, 1-beta +- i gamma_1
function offLinePerturbation(beta, u, t) {
  const d = beta - 0.5; let s = -2 * Math.cos(GAMMA1 * u) * Math.exp(-t * GAMMA1 * GAMMA1);
  for (const gi of [d, -d]) s += 2 * Math.exp(-gi * u) * Math.exp(-t * (GAMMA1 * GAMMA1 - gi * gi)) * Math.cos(GAMMA1 * u - 2 * t * GAMMA1 * gi);
  return s;
}
/** Reflection Gram on the first M primes with observables p^{-s} e^{(t/2)(s-1/2)^2}; opts: pmax (gas truncation), beta (off-line first zero). */
export function primonGaussianGram(M, { t = ROUTE_A_T, pmax = Infinity, beta = null } = {}) {
  const cache = new Map();
  const D = (u) => {
    const key = u.toFixed(12);
    if (!cache.has(key)) cache.set(key, heatSpectralFunction(u, t, pmax) + (beta === null ? 0 : offLinePerturbation(beta, u, t)));
    return cache.get(key);
  };
  return Array.from({ length: M }, (_, i) => Array.from({ length: M }, (_, j) => D(Math.abs(Math.log(PR[i]) - Math.log(PR[j]))) / Math.sqrt(PR[i] * PR[j])));
}
const numRank = (G) => { const e = jacobiVals(G); const mx = e[e.length - 1]; return e.filter((v) => v > 1e-12 * mx).length; };

// ---- imp-96018: height sweep of the off-line detector (nextTest[0]) — does its
// sensitivity extend past the 1/sqrt(t) verified-height cap? Generalise the fixed
// first-zero perturbation to a hypothetical off-line quadruple beta +- i gamma,
// 1-beta +- i gamma placed at ARBITRARY height gamma, and measure lambda_min vs gamma.
export const ROUTE_A_HEIGHT_LADDER = Object.freeze([14.134725142, 20, 25, 30, 35, 40, 50]);
function offLinePerturbationAtHeight(beta, gamma, u, t) {
  const d = beta - 0.5; let s = -2 * Math.cos(gamma * u) * Math.exp(-t * gamma * gamma);
  for (const gi of [d, -d]) s += 2 * Math.exp(-gi * u) * Math.exp(-t * (gamma * gamma - gi * gi)) * Math.cos(gamma * u - 2 * t * gamma * gi);
  return s;
}
/** off-line detection signal lambda_min for a hypothetical off-line quadruple at HEIGHT gamma (Gaussian class, first M primes). */
export function offLineDetectionAtHeight(gamma, M = 20, { t = ROUTE_A_T, beta = 0.9 } = {}) {
  const cache = new Map();
  const D = (u) => { const key = u.toFixed(12); if (!cache.has(key)) cache.set(key, heatSpectralFunction(u, t) + offLinePerturbationAtHeight(beta, gamma, u, t)); return cache.get(key); };
  const G = Array.from({ length: M }, (_, i) => Array.from({ length: M }, (_, j) => D(Math.abs(Math.log(PR[i]) - Math.log(PR[j]))) / Math.sqrt(PR[i] * PR[j])));
  return lamMin(G);
}

// ---- baked literals (scratch tmp/route-a-rp-scratch*.mjs; zero side = first 5000 Odlyzko ordinates)
export const ROUTE_A_LITERALS = Object.freeze({
  xiAtHalf: 0.4971207781883,
  zetaLogDerivAtHalf: 2.6860917096,
  twoSumInvGammaSq: 0.04620998, // lim xi'/xi(1/2+nu)/nu = 2 sum_{gamma>0} 1/gamma^2
  heatSpectralZeroSide: { t: 0.02, u0: 0.037082583457, uLn2: -0.034381792216, uLn3over2: 0.031135171712, u2: -0.036881730034, u5: 0.000416637413 },
  finiteGasLamMin: [-142.669, -187.972, -229.350, -264.837, -324.077, -436.463, -660.115, -912.146, -1266.349, -1762.904, -2457.733, -3428.239, -4213.156],
  finiteGasSupOnStrip: { N0: -2.6898, N1: -4.3585, N10: -10.0414, N100: -17.2510, N1229: -25.0611 },
  zeroFreeCompletionCrossoverSigma: 5.4962,
  gaussianClass: { t: 0.02, fullLamMinFloor: -3e-15, numRank: 12, truncatedLamMin: { N10: -9.016e-5, N20: -1.314e-4, N250: -3.806e-4 }, offLine: { b055_N10: -1.158e-4, b06_N20: -9.725e-4, b09_N20: -1.871e-2 } },
});

// imp-96018: off-line detector sensitivity vs HEIGHT (beta = 0.9, N = 20, t = 0.02).
// lamMin(gamma) at the ROUTE_A_HEIGHT_LADDER heights; noiseFloor = eps x lamMax = the
// beta = 1/2 baseline lamMin. Confirms the 1/sqrt(t) cap: signal ~ -e^{-t gamma^2}.
export const ROUTE_A_HEIGHT_SWEEP = Object.freeze({
  t: 0.02, beta: 0.9, M: 20, cap: 7.0711, noiseFloor: -6.29e-16,
  lamMin: [-1.8706e-2, -1.3498e-4, -3.4811e-6, -7.8924e-9, -6.7903e-12, -4.2653e-15, -6.2852e-16],
  law: 'lamMin(gamma) = -Theta(1) e^{-t gamma^2}: the off-line signal is Gaussian-damped in HEIGHT; -lamMin/e^{-t gamma^2} stays O(1) (0.3..1.0) until it reaches the double-precision noise floor ~ -6.3e-16 (= eps x lamMax) near gamma ~ 40 (= 5.6/sqrt(t)); by gamma = 50 lamMin is indistinguishable from the beta = 1/2 baseline',
  verdict: 'DOES NOT extend past the cap. Detection sensitivity decays as e^{-t gamma^2} -- the exact Gaussian regulator weight of the observable class p^{-s} e^{(t/2)(s-1/2)^2}, NOT a prime-truncation effect. The effective ceiling gamma_max ~ sqrt(ln(1/eps)/t) is a fixed multiple of 1/sqrt(t) set by that weight; lowering t to reach higher zeros reopens the O(1)/sqrt(p) truncation boundary layer (the finite-N gas failure). So off-line detection is confined to verified height; changes no bound; RH open; NO QED',
});

// ---- imp-96022: CROSS-VALIDATE the finite-N Pick-Gram scaling law
// lambda_min ~ -p_N^{1/2 - nu_min}. Extend the N-prime sweep, fit the log-log
// exponent of -lamMin vs p_N, and compare to the predicted 1/2 - nu_min across
// node sets. loglogSlope = ordinary least squares of ln|y| on ln x with R^2.
function loglogSlope(xs, ys) {
  const lx = xs.map(Math.log), ly = ys.map((v) => Math.log(Math.abs(v)));
  const n = lx.length; const mx = lx.reduce((a, b) => a + b) / n, my = ly.reduce((a, b) => a + b) / n;
  let sxy = 0, sxx = 0; for (let i = 0; i < n; i++) { sxy += (lx[i] - mx) * (ly[i] - my); sxx += (lx[i] - mx) ** 2; }
  const slope = sxy / sxx, b = my - slope * mx;
  let ssr = 0, sst = 0; for (let i = 0; i < n; i++) { const pr = b + slope * lx[i]; ssr += (ly[i] - pr) ** 2; sst += (ly[i] - my) ** 2; }
  return { slope, r2: 1 - ssr / sst };
}
// p_N for the k-th prime index (1-based N): PR[N-1].
export const finiteGasLamMinScaling = (nodes, Ns) => {
  const xs = Ns.map((N) => PR[N - 1]), ys = Ns.map((N) => lamMin(pickGram(finiteGasLogDeriv(N), nodes)));
  return { xs, ys, ...loglogSlope(xs, ys) };
};
// MEASURED (dense ladder N up to 1229, p_N up to 9973; scratch tmp/imp-96022-scratch*.mjs).
// Result: the power law is CONFIRMED (R^2 >= 0.996 on every node set), but the
// GLOBAL fitted exponent sits ~0.06-0.08 BELOW the predicted 1/2 - nu_min. That
// gap is the finite-size o(1) tail of -p_N^{1/2-nu}/(1/2-nu)(1+o(1)): the LOCAL
// log-log slope climbs MONOTONICALLY 0.3796 -> 0.4225 as p_N: 173 -> 9973 and the
// tail fit (p_N >= 541) is 0.4125 -- the exponent approaches 0.45 from below.
export const ROUTE_A_LAMMIN_SCALING = Object.freeze({
  nodes: ROUTE_A_NODES, denseLadderTopP: 9973,
  globalFit: { nuMin: 0.05, exponent: 0.3807, predicted: 0.45, drift: -0.0693, r2: 0.99800 },
  tailFit: { pMin: 541, exponent: 0.4125, predicted: 0.45, r2: 0.99996 },
  localSlopeTop: { pFrom: 4751, pTo: 9973, slope: 0.4225 },
  crossNodeSets: [
    { nuMin: 0.025, exponent: 0.4183, predicted: 0.4750, drift: -0.0567, r2: 0.99879 },
    { nuMin: 0.05, exponent: 0.3807, predicted: 0.4500, drift: -0.0693, r2: 0.99800 },
    { nuMin: 0.1, exponent: 0.3158, predicted: 0.4000, drift: -0.0842, r2: 0.99649 },
    { nuMin: 0.2, exponent: 0.2196, predicted: 0.3000, drift: -0.0804, r2: 0.99647 },
  ],
  law: 'lamMin ~ -p_N^{1/2 - nu_min}: CONFIRMED as a power law (R^2 >= 0.996 every node set). The global fitted exponent is ~0.06-0.08 BELOW 1/2-nu_min, a finite-size o(1) correction; the local log-log slope climbs monotonically 0.3796 -> 0.4225 as p_N: 173 -> 9973 and the tail fit (p_N >= 541) reaches 0.4125, so the measured exponent converges to the predicted 1/2-nu_min FROM BELOW as p_N grows. The drift has the same sign on every node set and shrinks with nu_min (0.057 at 0.025, 0.084 at 0.1).',
  verdict: 'AGREEMENT with a finite-size drift: the -p_N^{1/2-nu_min} scaling holds and the exponent approaches the predicted value from below; the residual gap at p_N=9973 is the divergent-Euler-product o(1) tail, not a different power. Measurement only; changes no bound; RH open; NO QED',
});

export const RH_ROUTE_A_REFLECTION_POSITIVITY = Object.freeze({
  id: 'rh-route-a-reflection-positivity-primon-gas-2026-09-23',
  route: 'A — reflection positivity of the primon gas about sigma = 1/2 (Osterwalder-Schrader)',
  roadmap: 'src/data/rh-novel-routes-roadmap-2026-09-23.js',
  status: 'FIRST TEST DONE — finite-N gas RP REFUTED (lambda_min -> -infinity ~ -p_N^{1/2-nu}); infinite-N RP holds numerically but is EQUIVALENT to Weil positivity = RH (Lagarias-Pick), not stronger; RH open; no refereed bound is changed; NO QED',
  setup: {
    reflection: 'theta: s -> 1 - conj(s); (theta f)(s) = conj(f(1 - conj(s)))',
    pairing: 'Weil zero pairing <g,f>_W = sum_rho g(rho) f(rho) via the explicit formula (Iwaniec-Kowalski normalisation)',
    observablesI: 'Cauchy/point evaluations f_i = 1/(s_i - s), s_i = 1/2 + nu_i, nu_i > 0 (OS one-sided in Euclidean time tau = sigma - 1/2)',
    gramI: 'G_ij = [xi\'/xi(s_i) + xi\'/xi(s_j)]/(s_i + s_j - 1) — the Caratheodory Pick matrix; RP for all node sets <=> RH (Lagarias 1999)',
    observablesII: 'f_i = p_i^{-s} e^{(t/2)(s-1/2)^2}; G_ij = (p_i p_j)^{-1/2} D_t(log p_i - log p_j), D_t(u) = sum_rho e^{i gamma u} e^{-t gamma^2}',
    rpCondition: 'G PSD for every finite one-sided family; under RH G = sum_rho w_rho v v^* (Gram); RP for all families <=> RH',
  },
  finiteNGas: {
    object: 'xi_N = (1/2)s(s-1)pi^{-s/2}Gamma(s/2) prod_{p<=p_N}(1-p^{-s})^{-1}; F_N = A(s) - sum_{p<=p_N} log p/(p^s-1)',
    result: 'Pick Gram of F_N on nu in {0.05,...,1.5}: lambda_min -143 (N=0) -> -4213 (N=1229); negative at every N, monotone; diagonal F_N(s)/nu < 0 on the whole strip 1/2<sigma<1 for every N',
    law: 'F_N(1/2+nu) - xi\'/xi(1/2+nu) = -p_N^{1/2-nu}/(1/2-nu) (1+o(1)) (Euler product diverges on the strip); ratio 1.02/1.006/1.002 at nu 0.1/0.25/0.4, p_N 9973',
    sigmaGt1: 'diagonal positive (F_N > xi\'/xi > 0) but Pick indefinite near sigma=1 at all N (truncation term p_N^{1-s}/(s-1) is not Caratheodory); PSD only far out (s = 2.5,4.5,8.5 from N~10) = unconditional sigma>1 positivity, no RH content',
    mechanism: 'reflection maps the gas region sigma>1 to sigma<0 where the finite gas has Matsubara poles 2 pi i k/log p (anti-Caratheodory); the strip is reflection-positive only through the analytic continuation of the INFINITE product',
  },
  gaussianClass: {
    full: 'PSD to noise (lambda_min >= -3e-15) at N=10..250, rank 12 = 2 x 6 effective zeros at t=0.02; content = verified zeros below ~1/sqrt(t)',
    detection: 'off-line first zero detected: lambda_min -1.2e-4 (beta 0.55, N 10), -9.7e-4 (0.6, N 20), -1.9e-2 (0.9, N 20); +4.7e-12 at beta=1/2',
    truncatedGas: 'indefinite, lambda_min -9e-5 (N=10) -> -3.8e-4 (N=250), not improving: boundary layer of log-width ~3 sqrt(4t) at log p_N where the dropped prime mean density e^{v/2} no longer cancels the pole term 2cosh(u/2)',
  },
  trueButWrongSpectrum: {
    fock: 'zeta(s_i+s_j) Gram (reflection about sigma=0), PSD, H = log N, spectrum {log n}',
    polya: 'xi(1/2+tau_i+tau_j) = int Phi e^{tau_i u} e^{tau_j u}, Phi>0, PSD for all tau, generator = u on L^2(Phi), spectrum R',
    kms: 'KMS_beta states are RP about beta/2 (Klein-Landau); at beta=1 the Bost-Connes KMS_1 state is type III_1, modular spectrum R (literature, not computed)',
  },
  weilRelation: 'RP in the zero pairing IS Weil positivity on the cone spanned by the chosen observables; the Cauchy class gives Lagarias\' criterion in Pick form (imp-95520 THEOREM PICK-WEIL); the p^{-s} Gaussian class gives Bochner positivity of D_t on the log-prime lattice. Equivalent to RH, not stronger; OS reconstruction = GNS of the Weil form (the known spectral realisation).',
  unconditionalAnchor: 'Weil positivity is a theorem for u-support inside the prime-free window |u| < (ln 2)/2 (Yoshida 1992; Connes-Consani 2021, archimedean place; in-repo imp-95520 class II T=0.3) — conditionality begins at the first prime shift ln 2',
  nextTest: 'no numerical test in these classes exceeds verified-height content; structural opening only via a Euclidean geometry with a second direction (adelic / scaling site) where archimedean-vs-prime comparison acquires transfer/Markov structure — not available from the primon gas',
  heightSweep: 'imp-96018 (nextTest[0] MEASURED): sweeping a hypothetical off-line quadruple over height gamma, the Gaussian-class detector lambda_min(gamma) decays as -Theta(1) e^{-t gamma^2} (ratio 0.3..1.0), reaching the double-precision noise floor -6.3e-16 (= eps x lamMax = the beta=1/2 baseline) near gamma ~ 40 = 5.6/sqrt(t); gamma=50 is undetectable. The detector does NOT extend past the cap: the ceiling gamma_max ~ sqrt(ln(1/eps)/t) is a fixed multiple of 1/sqrt(t) set by the observable Gaussian weight e^{-t gamma^2} itself, not by prime truncation; smaller t reopens the truncation boundary layer. Off-line detection is confined to verified height (ROUTE_A_HEIGHT_SWEEP)',
  honestLimits: 'double-precision finite configurations; explicit-formula constants cross-checked to 5e-12 against 5000 zeros; the finite-N refutation is exact in mechanism (divergent Euler product on the strip) and measured in rate; nothing here moves any Lambda bound or verified height',
});

// ---- assertions
const rel = (x, lit, tol) => Math.abs(x - lit) <= tol * Math.max(Math.abs(lit), 1e-300);
export const RH_ROUTE_A_REFLECTION_POSITIVITY_ASSERTIONS = Object.freeze([
  {
    id: 'A0-polya-gram-psd',
    description: 'Polya kernel xi(1/2+tau_i+tau_j) on 10 taus is PSD (to noise) and xi(1/2) matches 0.49712077818',
    holds: () => {
      const taus = [0.05, 0.1, 0.2, 0.35, 0.5, 0.75, 1, 1.5, 2, 3];
      const G = taus.map((a) => taus.map((b) => xiReal(0.5 + a + b)));
      return lamMin(G) >= -1e-12 * lamMax(G) && rel(xiReal(0.5), ROUTE_A_LITERALS.xiAtHalf, 1e-8);
    },
  },
  {
    id: 'A1-fock-gram-psd',
    description: 'Fock/Gibbs kernel zeta(s_i+s_j) (reflection about sigma=0) is PSD — the trivially RP transcription with spectrum {log n}',
    holds: () => { const ss = [0.6, 0.8, 1, 1.5, 2, 3]; const G = ss.map((a) => ss.map((b) => zetaAndDeriv(a + b).z)); return lamMin(G) > 0; },
  },
  {
    id: 'A2-full-pick-gram-psd-and-half-line-limits',
    description: 'Pick reflection Gram of xi\'/xi on nu in {0.05..1.5} is PSD to noise; xi\'/xi(1/2)=0 (A(1/2) = -zeta\'/zeta(1/2) = -2.68609171); slope at 1/2 = 2 sum 1/gamma^2 = 0.04620998',
    holds: () => {
      const G = pickGram(xiLogDeriv, ROUTE_A_NODES);
      return lamMin(G) >= -1e-12 * lamMax(G)
        && rel(zetaLogDeriv(0.5), ROUTE_A_LITERALS.zetaLogDerivAtHalf, 1e-8)
        && Math.abs(archLogDeriv(0.5) + zetaLogDeriv(0.5)) < 1e-8
        && rel(xiLogDeriv(0.5 + 1e-6) / 1e-6, ROUTE_A_LITERALS.twoSumInvGammaSq, 1e-4);
    },
  },
  {
    id: 'A3-finite-gas-gram-negative-monotone',
    description: 'the roadmap test: Pick Gram of the completed N-prime gas is NOT PSD at any N on the ladder, lambda_min monotone decreasing in N, matches baked table to 1e-3',
    holds: () => {
      const lam = ROUTE_A_N_LADDER.map((N) => lamMin(pickGram(finiteGasLogDeriv(N), ROUTE_A_NODES)));
      return lam.every((v) => v < 0)
        && lam.every((v, i) => i === 0 || v < lam[i - 1])
        && lam.every((v, i) => rel(v, ROUTE_A_LITERALS.finiteGasLamMin[i], 1e-3));
    },
  },
  {
    id: 'A3-strip-diagonal-negative-all-N',
    description: 'F_N(1/2+nu) < 0 on a 499-point grid of the strip for N = 0, 1, 10, 100, 1229 (sup matches baked); pure gas and zero-free completion also negative on the node set',
    holds: () => {
      const sup = (N) => { let mx = -Infinity; const f = finiteGasLogDeriv(N); for (let k = 1; k < 500; k++) mx = Math.max(mx, f(0.5 + 0.5 * k / 500)); return mx; };
      const lit = ROUTE_A_LITERALS.finiteGasSupOnStrip;
      return rel(sup(0), lit.N0, 1e-3) && rel(sup(1), lit.N1, 1e-3) && rel(sup(10), lit.N10, 1e-3) && rel(sup(100), lit.N100, 1e-3) && rel(sup(1229), lit.N1229, 1e-3)
        && lamMin(pickGram(pureGasLogDeriv(10), ROUTE_A_NODES)) < 0
        && lamMin(pickGram(zeroFreeGasLogDeriv(1229), ROUTE_A_NODES)) < 0;
    },
  },
  {
    id: 'A3-truncation-law',
    description: 'F_N - xi\'/xi = -p_N^{1/2-nu}/(1/2-nu)(1+o(1)) at p_N = 9973: ratio within [0.98, 1.05] at nu = 0.1, 0.25, 0.4',
    holds: () => [0.1, 0.25, 0.4].every((nu) => {
      const s = 0.5 + nu; const d = finiteGasLogDeriv(1229)(s) - xiLogDeriv(s); const pred = -Math.pow(9973, 0.5 - nu) / (0.5 - nu);
      return d / pred > 0.98 && d / pred < 1.05;
    }),
  },
  {
    id: 'A3-sigma-gt-1-region',
    description: 'finite gas on sigma>1 nodes: diagonal positive and above xi\'/xi, Pick indefinite for nodes [1,2,4] at N=1229 but PSD for far nodes [2,4,8] at N=1229; full xi\'/xi PSD on both',
    holds: () => {
      const F = finiteGasLogDeriv(1229);
      const diag = [0.55, 1, 2].every((nu) => F(0.5 + nu) > xiLogDeriv(0.5 + nu) && xiLogDeriv(0.5 + nu) > 0);
      return diag && lamMin(pickGram(F, [1, 2, 4])) < 0 && lamMin(pickGram(F, [2, 4, 8])) > 0
        && lamMin(pickGram(xiLogDeriv, [1, 2, 4])) > 0 && lamMin(pickGram(xiLogDeriv, [2, 4, 8])) > 0;
    },
  },
  {
    id: 'A4-explicit-formula-matches-zero-side',
    description: 'D_t(u) by the explicit formula matches the 5000-zero sum at u = 0, ln2, ln(3/2), 2, 5 to 1e-9 (t=0.02)',
    holds: () => {
      const L = ROUTE_A_LITERALS.heatSpectralZeroSide; const t = L.t;
      return Math.abs(heatSpectralFunction(0, t) - L.u0) < 1e-9 && Math.abs(heatSpectralFunction(Math.log(2), t) - L.uLn2) < 1e-9
        && Math.abs(heatSpectralFunction(Math.log(1.5), t) - L.uLn3over2) < 1e-9 && Math.abs(heatSpectralFunction(2, t) - L.u2) < 1e-9
        && Math.abs(heatSpectralFunction(5, t) - L.u5) < 1e-9;
    },
  },
  {
    id: 'A4-gaussian-primon-gram-psd-rank-saturated',
    description: 'full (analytically continued) Gaussian-class Gram on 20 primes: PSD to noise with numerical rank 12 (= 2 x 6 effective zeros)',
    // measured rank 12; +-1 window guards the 1e-12 relative threshold against platform float drift (memory: browser-only divergence trap)
    holds: () => { const G = primonGaussianGram(20); const r = numRank(G); return lamMin(G) >= -1e-12 * lamMax(G) && Math.abs(r - ROUTE_A_LITERALS.gaussianClass.numRank) <= 1; },
  },
  {
    id: 'A4-gaussian-class-truncated-gas-indefinite',
    description: 'cutting the prime side at p <= p_N makes the N=10 and N=20 Grams indefinite (boundary-layer failure), matching baked lambda_min to 2%; observables kept out of the layer (M=20 inside gas N=100) see the truncation exactly and stay PSD',
    holds: () => {
      const l = ROUTE_A_LITERALS.gaussianClass.truncatedLamMin;
      const a = lamMin(primonGaussianGram(10, { pmax: PR[9] })), b = lamMin(primonGaussianGram(20, { pmax: PR[19] }));
      const Gfull = primonGaussianGram(20), Gin = primonGaussianGram(20, { pmax: PR[99] });
      let md = 0; for (let i = 0; i < 20; i++) for (let j = 0; j < 20; j++) md = Math.max(md, Math.abs(Gfull[i][j] - Gin[i][j]));
      return rel(a, l.N10, 2e-2) && rel(b, l.N20, 2e-2) && md < 1e-12 && lamMin(Gin) >= -1e-12 * lamMax(Gin);
    },
  },
  {
    id: 'A4-off-line-detection',
    description: 'moving the first zero pair off the line breaks RP in the Gaussian class: lambda_min < 0 at beta 0.55 (N=10), 0.6 and 0.9 (N=20), while beta=1/2 stays PSD; magnitudes match baked to 2%',
    holds: () => {
      const l = ROUTE_A_LITERALS.gaussianClass.offLine;
      const G5 = primonGaussianGram(10, { beta: 0.5 });
      return lamMin(G5) >= -1e-12 * lamMax(G5)
        && rel(lamMin(primonGaussianGram(10, { beta: 0.55 })), l.b055_N10, 2e-2)
        && rel(lamMin(primonGaussianGram(20, { beta: 0.6 })), l.b06_N20, 2e-2)
        && rel(lamMin(primonGaussianGram(20, { beta: 0.9 })), l.b09_N20, 2e-2);
    },
  },
  {
    id: 'A5-off-line-detection-height-decay',
    description: 'imp-96018: the off-line detector signal lamMin(gamma) is Gaussian-damped in height (-lamMin/e^{-t gamma^2} = O(1)) and reaches the noise floor by gamma ~ 40, confirming the 1/sqrt(t) cap; above-noise entries match the baked ladder to 5%',
    // near-noise entries (gamma >= 35) are NOT asserted tightly (memory: browser-only sub-noise float divergence); only the O(1)-signal entries carry literal checks
    holds: () => {
      const L = ROUTE_A_HEIGHT_SWEEP; const t = L.t;
      const lam = ROUTE_A_HEIGHT_LADDER.map((g) => offLineDetectionAtHeight(g, L.M, { t, beta: L.beta }));
      const negOrNoise = lam.every((v) => v < 1e-13);                                   // never spuriously positive above noise
      const ratioOK = [0, 1, 2, 3].every((i) => { const g = ROUTE_A_HEIGHT_LADDER[i]; const r = -lam[i] / Math.exp(-t * g * g); return r > 0.2 && r < 1.2; });
      const baked = [0, 1, 2, 3].every((i) => rel(lam[i], L.lamMin[i], 5e-2));           // above-noise ladder entries
      const decaysToFloor = lam[0] < lam[3] && Math.abs(lam[6]) < 1e-14 && Math.abs(lam[6]) <= Math.abs(lam[0]); // |lamMin| shrinks; buried by gamma=50
      return negOrNoise && ratioOK && baked && decaysToFloor;
    },
  },
  {
    id: 'A3-lammin-scaling-law-crossvalidated',
    description: 'imp-96022: -lamMin ~ p_N^{1/2-nu_min} is a power law (R^2 > 0.99), fitted exponent below the predicted 0.45, and the LOCAL log-log slope climbs monotonically toward 0.45 (approach from below); larger nu_min gives smaller predicted and fitted exponents',
    holds: () => {
      const Ns = [40, 80, 160, 320, 640, 1229];
      const f = finiteGasLamMinScaling(ROUTE_A_NODES, Ns);           // fit slope ~0.404, R^2 ~0.9997
      const locs = []; for (let i = 1; i < Ns.length; i++) locs.push((Math.log(Math.abs(f.ys[i])) - Math.log(Math.abs(f.ys[i - 1]))) / (Math.log(f.xs[i]) - Math.log(f.xs[i - 1])));
      const monotone = locs.every((v, i) => i === 0 || v > locs[i - 1] - 1e-9);
      const topOK = locs[locs.length - 1] > 0.40 && locs[locs.length - 1] < 0.45;   // below predicted, converging up
      const powerLaw = f.r2 > 0.99 && f.slope > 0.35 && f.slope < 0.45;
      // predicted exponent decreases with nu_min: fitted must too
      const g1 = finiteGasLamMinScaling([0.1, 0.2, 0.3, 0.4, 0.6, 1.0, 1.5], Ns).slope;
      const g2 = finiteGasLamMinScaling([0.2, 0.3, 0.4, 0.6, 1.0, 1.5], Ns).slope;
      return monotone && topOK && powerLaw && f.slope > g1 && g1 > g2;
    },
  },
  {
    id: 'verdict-honesty',
    description: 'status says RH open / NO QED, refutes the finite-N test, and states equivalence (not strength) to Weil positivity',
    holds: () => /RH open/.test(RH_ROUTE_A_REFLECTION_POSITIVITY.status) && /NO QED/.test(RH_ROUTE_A_REFLECTION_POSITIVITY.status)
      && /REFUTED/.test(RH_ROUTE_A_REFLECTION_POSITIVITY.status) && /EQUIVALENT/.test(RH_ROUTE_A_REFLECTION_POSITIVITY.status),
  },
]);

export default RH_ROUTE_A_REFLECTION_POSITIVITY;
