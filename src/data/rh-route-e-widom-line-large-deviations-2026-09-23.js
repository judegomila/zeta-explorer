/**
 * @module rh-route-e-widom-line-large-deviations-2026-09-23
 *
 * RH novel Route E (src/data/rh-novel-routes-roadmap-2026-09-23.js, key 'E'):
 * "supercritical Widom line + large deviations for the primon gas". First test executed.
 * Import-free; every live number below is recomputed by holds() from a sieve to 1e5 and
 * from baked mpmath literals (30 digits, tmp/route-e-widom-scratch.py) and a node scan
 * (tmp/route-e-finiteN.mjs). Nothing here is a bound or a proof: PT Lambda <= 0.2 is SOTA,
 * RH is open, NO QED.
 *
 * ---------------------------------------------------------------------------------------
 * 0. DICTIONARY (exact, sigma > 1)
 * ---------------------------------------------------------------------------------------
 * Primon gas: bosonic modes, one per prime p, energy log p, occupation k_p. Inverse
 * temperature sigma. log Z(sigma) = -sum_p log(1 - p^{-sigma}) = log zeta(sigma).
 * Gibbs measure on integers P_sigma(n) = n^{-sigma}/zeta(sigma), energy E = log n.
 *   zeta(sigma + i t) / zeta(sigma) = E_sigma[ e^{-i t log n} ]           (exact, sigma>1)
 * i.e. the partition function at complex inverse temperature sigma+it is the CHARACTERISTIC
 * FUNCTION of the Gibbs energy at frequency t. A zero at sigma+it = the characteristic
 * function vanishing = a Fisher zero (complex-temperature zero) of the primon gas. This is
 * the precise sense of "zeros = extreme fluctuations".
 *
 * ---------------------------------------------------------------------------------------
 * 1. RESPONSE FUNCTIONS AND THE WIDOM LOCUS
 * ---------------------------------------------------------------------------------------
 * Regularisation A (finite-N): Z_N = prod_{p <= P} (1-p^{-sigma})^{-1}, converges for all
 * sigma > 0. Heat capacity Cv_N = sigma^2 (log Z_N)'' = sum_p u^2/(4 sinh^2(u/2)), u = sigma
 * log p (Einstein-mode form). Compressibility proxy = Var(Omega) = sum_p p^{-s}/(1-p^{-s})^2
 * (number-of-primons variance; chemical potential conjugate to Omega(n)). MEASURED (P = 200,
 * 1e3, 1e4, 1e5, 1e6): both are MONOTONE DECREASING on sigma in [0.05, 3]; Cv_N(0+) = N
 * (equipartition); no interior maximum anywhere. The only structure is the smeared Hagedorn
 * critical point at sigma = 1 (Cv_N(1) ~ (log P)^2/2: 95.26 at P=1e6 vs 95.4). Nothing at 1/2.
 *
 * Regularisation B (analytic continuation): Cv_cont(sigma) = sigma^2 (zeta'/zeta)'(sigma) on
 * (0,1). MEASURED (mpmath, 37-point grid): (zeta'/zeta)' is MONOTONE INCREASING on (0,1),
 * 0.7575 at 0.05 -> 3.7469 at 1/2 -> 399.8 at 0.95 -> +inf at 1 (double pole). No interior
 * extremum; nothing at 1/2. (The 1/sigma^2 pole term is cancelled by (1/4) psi'(sigma/2).)
 *
 * Regularisation C (completed, functional-equation symmetric): (log xi)''(sigma) =
 * -sum_rho 1/(sigma-rho)^2 = (zeta'/zeta)' + (1/4) psi'(sigma/2) - 1/sigma^2 - 1/(sigma-1)^2.
 * MEASURED: symmetric about 1/2 to 4e-31; (log xi)''(1/2) = 0.046209986230838 = sum_rho
 * 1/gamma^2 = 2 sum_{gamma>0} gamma^{-2} (2000 zeros + tail: 0.0462102, match 4e-7);
 * (log xi)''''(1/2) = -4.4607e-4 < 0 => a LOCAL MAXIMUM at exactly sigma = 1/2. But the
 * profile is flat to 1e-3 relative across (0,1) (0.046165 at 0.05), and the maximum is
 * SYMMETRY-FORCED and RH-BLIND: each zero quadruple contributes -4 Re (a+i gamma)^{-4} to
 * the 4th derivative, which is negative whenever (a/gamma)^2 < 3 - 2 sqrt 2 = 0.1716, i.e. for
 * EVERY zero configuration in the strip (|a| < 1/2, gamma > 14). So sigma = 1/2 is the
 * response-maximum locus of the completed heat capacity, with or without RH.
 *
 * Regularisation D (imaginary-temperature FLUCTUATION sector). Over the height ensemble
 * t ~ U[T,2T], log|zeta(sigma+it)| has variance V_T(sigma). Bohr-Jessen (sigma > 1/2,
 * unconditional): V_T -> V(sigma) = (1/2) sum_{k>=1} P(2 k sigma)/k^2, P = prime zeta.
 * Selberg (unconditional): V_T(1/2) ~ (1/2) log log T -> infinity. Functional equation:
 * V_T(sigma) = V_T(1-sigma) + o(1). So the fluctuation susceptibility V(sigma) is finite off
 * 1/2 and DIVERGES exactly at 1/2: THIS is the response function whose maximum locus is the
 * critical line. MEASURED at T in [1000,3000] (600 samples): Var log|zeta| = 0.518 (0.3),
 * 0.749 (0.4), 0.966 (0.45), 1.439 (0.5), 0.965 (0.55), 0.747 (0.6), 0.512 (0.7), 0.380 (0.8);
 * Bohr-Jessen limits 0.805 (0.6), 0.530 (0.7), 0.389 (0.8). Finite-N: V_N(sigma) =
 * (1/2) sum_{p<=P} sum_k p^{-2k sigma}/k^2 is N-CONVERGENT for sigma > 1/2 (0.4493 -> 0.4500
 * -> 0.4502 at 0.75 for P = 1e4,1e5,1e6) and N-DIVERGENT for sigma <= 1/2 (1.3113 -> 1.4224
 * -> 1.5134 at 1/2, increments 0.111/0.091 vs (1/2) log(log P'/log P) = 0.112/0.091; growth
 * exponent d log V_N / d log P -> max(0, 1-2 sigma) with 1/log P corrections: 0.118 at 0.4).
 * WHY 1/2: Parseval -- the t-mean-square of a Dirichlet series in sigma is the series in 2
 * sigma, so the fluctuation critical point sits at HALF the mean-thermodynamic critical point
 * (Hagedorn sigma = 1 -> 1/2). Independent of, and consistent with, the reflection symmetry.
 *
 * Roadmap claim correction. "|zeta(1/2+it)| moments peak on sigma = 1/2" is imprecise. MEASURED:
 * the raw second moment (1/T) int |zeta|^2 is MONOTONE DECREASING in sigma (28.76 at 0.3 ->
 * 6.85 at 0.5 -> 1.64 at 1.0); the functional-equation-symmetrised moment |zeta|^2
 * (t/2pi)^{sigma-1/2} is symmetric (7.381 at 0.4 and 0.6; 9.110 at 0.3 and 0.7) and has a
 * MINIMUM at 1/2 (6.85). What peaks at 1/2 is the VARIANCE of log|zeta| (and the near-zero
 * depth: min|zeta| = 0.0019 at 1/2 vs 0.05 at 1/2 +- 0.05), i.e. the fluctuation sector D.
 *
 * ---------------------------------------------------------------------------------------
 * 2. LARGE-DEVIATION RATE FUNCTION FOR A ZERO AT ABSCISSA sigma
 * ---------------------------------------------------------------------------------------
 * Finite-N Bohr model: phases theta_p i.i.d. uniform (Kronecker: {t log p} equidistribute),
 * log|Z_N| = sum_p X_p, X_p = -log|1 - p^{-sigma} e^{i theta_p}|, independent, mean 0.
 * EXACT FLOOR: |Z_N| >= prod_p (1+p^{-sigma})^{-1} = exp(-L_N(sigma)), L_N = sum_p log(1+p^{-s}),
 * attained only at theta_p = pi for all p (all p^{-it} = -1: the extreme configuration).
 * The finite-N primon gas has NO Fisher zeros at any sigma: the rate function of a zero
 * is +infinity at every finite N. L_N(sigma) -> log(zeta(sigma)/zeta(2 sigma)) for sigma > 1
 * (0.7757 at P=1e5 vs 0.77623: inf_t |zeta(1.5+it)| = zeta(3)/zeta(1.5), the classical Bohr
 * infimum, so the zero-free half-plane sigma > 1 IS the finite-floor statement), and
 * L_N(sigma) -> infinity like P^{1-sigma}/((1-sigma) log P) for sigma < 1 (68.9 at
 * sigma = 1/2, P = 1e5): zeros can only appear in the N -> infinity limit for sigma <= 1.
 *
 * Cramer rate for a near-zero of depth L (log|Z_N| <= -L):
 *   J_N(sigma; L) = sup_lambda [ lambda L - sum_p log 2F1(-lambda/2, -lambda/2; 1; p^{-2 sigma}) ]
 * using the exact E|1 - r e^{i theta}|^{lambda} = 2F1(-lambda/2,-lambda/2;1;r^2). MEASURED (P=1e4):
 *   J(L=2): 0.742 (0.4) < 1.712 (0.5) < 3.361 (0.6) < 8.660 (0.75) < 147.3 (1.0)
 * i.e. the near-zero cost is MONOTONE INCREASING in sigma -- the finite-N rate function is
 * NOT minimised at 1/2; it is cheapest to the LEFT of 1/2, because the Euler product knows
 * nothing about the reflection (true zeta has |zeta(sigma+it)| = |chi| |zeta(1-sigma-it)| with
 * |chi| ~ t^{1/2-sigma} large for sigma < 1/2: measured min|zeta| = 0.408 at 0.3 vs 0.147 at
 * 0.7). At 1/2 the cost is Gaussian for small L (J(1/2; L=1) = 0.401 vs L^2/(2 V_N) = 0.381)
 * and diverges at the floor (J(0.99 L_N) = 2166 >> J(0.5 L_N) = 185 >> J(0.1 L_N) = 3.6).
 * As P grows, J(sigma; L) at fixed L DEcreases for sigma <= 1/2 (variance grows) and freezes
 * for sigma > 1/2 (variance converges): depth-L near-zeros at sigma > 1/2 have an
 * N-independent, strictly positive cost; at sigma <= 1/2 they become free as N -> infinity.
 *
 * N = infinity, sigma in (1/2,1) (Bohr-Jessen law, Lamzouri tails): P(log|zeta| <= -tau) ~
 * exp(-c tau^{1/(1-sigma)} (log tau)^{sigma/(1-sigma)}): stretched-exponential, cost exponent
 * alpha(sigma) = 1/(1-sigma) rising from 2 (Gaussian, 1/2+) to infinity (1-). The deepest
 * excursion at height T is tau ~ (log T)^{1-sigma}/(log log T)^{sigma} (Montgomery-type
 * extreme values), never a zero. The model cannot produce a zero at any sigma: actual zeros
 * are not Euler-product fluctuations. On sigma = 1/2 they are forced by the REALITY of
 * Hardy's Z(t) (codimension-1 sign changes, the Lee-Yang mechanism); off the line a zero is a
 * codimension-2 coincidence Re = Im = 0 the random model assigns probability 0 at finite N.
 *
 * ---------------------------------------------------------------------------------------
 * 3. THE CONCENTRATION STATEMENT, SHARPEST FORM
 * ---------------------------------------------------------------------------------------
 * Littlewood's lemma (exact bookkeeping, unconditional):
 *   int_0^T log|zeta(sigma+it)| dt = 2 pi sum_{beta > sigma, 0<gamma<T} (beta - sigma) + O(log T).
 * The height-mean of the log partition function OFF the Widom line is a nonnegative sum over
 * off-line zeros. Chain: (i) Bohr-Jessen mean-zero law => mean log|zeta| -> 0 for sigma > 1/2
 * (measured 0.0019 at 0.6, -0.0014 at 0.7, -0.0023 at 0.8) => sum (beta - sigma) = o(T) =>
 * Bohr-Landau 1914: N(sigma,T) = O(T), an o(1) fraction of zeros lies off any epsilon-strip
 * about 1/2. This IS "zeros concentrate on the Widom line" and it is a 1914 theorem.
 * (ii) Quantitative rate function: fraction of zeros with beta > sigma <= T^{-I(sigma)+eps},
 *   I(sigma) >= 1 - A(sigma)(1-sigma), A = 3/(2-sigma) (Ingham 1940), 12/5 (Huxley 1972,
 *   sigma >= 3/4), 30/13 (Guth-Maynard 2024, all sigma; beats Ingham iff sigma > 0.7),
 *   A = 2 (density hypothesis; known for sigma >= 25/32, Bourgain 2000; sigma >= 11/14 Jutila).
 *   I(1/2) = 0; I > 0 on (1/2,1]. (iii) RH <=> I = +infinity <=> int_0^T log|zeta(sigma+it)| dt
 *   = O(log T) for every sigma > 1/2 (Littlewood's criterion).
 * The primon-gas fluctuation model reproduces (i) exactly (each X_p has mean 0) and the
 * variance V(sigma), but is structurally blind to the O(log T) vs T^{1-I} refinement: at finite
 * N it has no zeros, at N = infinity it is a limit law that does not control the rate at
 * which the mean vanishes. The Widom-line route adds no lever to the zero-density program.
 *
 * ---------------------------------------------------------------------------------------
 * 4. VERDICT
 * ---------------------------------------------------------------------------------------
 * sigma = 1/2 IS the response-maximum locus -- of the FLUCTUATION susceptibility Var log|Z|
 * (Selberg divergence, Bohr-Jessen finiteness, Parseval 2 sigma) and of the completed heat
 * capacity (log xi)'' (symmetry-forced, flat to 1e-3). Both are UNCONDITIONAL and RH-BLIND:
 * they hold for any zero configuration. The mean-thermodynamic responses (Cv, compressibility)
 * never see 1/2 in any regularisation. The finite-N rate function of a zero is +infinity
 * everywhere (no Fisher zeros), and the near-zero cost is monotone in sigma, not minimised
 * at 1/2. "Zeros = extreme fluctuations confined to the Widom line" as a concentration
 * statement is Bohr-Landau (1914) via Littlewood's lemma; its quantitative form is the
 * zero-density exponent; its RH form is Littlewood's criterion. Route E is ABSORBED into
 * this classical chain; it yields heuristic framing, not a new mechanism. Status: tested,
 * absorbed, no lever. No refereed bound is changed; RH open; NO QED.
 *
 * NEXT TEST (the one nontrivial residual). The mean-vanishing RATE: measure
 * m_T(sigma) = (1/T) int_T^{2T} log|zeta(sigma+it)| dt at sigma = 0.6, 0.75 for T = 1e3..1e6 and
 * compare with the O(log T / T) Littlewood scaling; any T^{-I} tail with I < 1 is an off-line
 * zero signal. This verifies RH in a window, it does not prove anything -- recorded so the
 * route is not re-opened as "untested".
 */

// ---------------------------------------------------------------------------------------
// live finite-N primon gas (import-free)
// ---------------------------------------------------------------------------------------
function sieve(P) {
  const s = new Uint8Array(P + 1);
  const out = [];
  for (let i = 2; i <= P; i++) {
    if (!s[i]) { out.push(i); for (let j = i * i; j <= P; j += i) s[j] = 1; }
  }
  return out;
}
const PRIMES_1E5 = sieve(100000);
const upTo = (P) => PRIMES_1E5.filter((p) => p <= P);
const P1E2 = upTo(100), P1E3 = upTo(1000), P1E4 = upTo(10000), P46 = upTo(199);

/** Cv_N(sigma) = sigma^2 (log Z_N)'' = sum_p u^2/(4 sinh^2(u/2)), u = sigma log p. */
export function cvN(ps, s) {
  let acc = 0;
  for (const p of ps) { const u = s * Math.log(p); acc += (u * u) / (4 * Math.sinh(u / 2) ** 2); }
  return acc;
}
/** compressibility proxy Var(Omega) = sum_p p^{-s}/(1-p^{-s})^2. */
export function varOmegaN(ps, s) {
  let acc = 0;
  for (const p of ps) { const x = Math.pow(p, -s); acc += x / (1 - x) ** 2; }
  return acc;
}
/** fluctuation variance V_N(sigma) = (1/2) sum_p sum_k p^{-2k sigma}/k^2 = Var_theta log|Z_N|. */
export function fluctVarN(ps, s) {
  let acc = 0;
  for (const p of ps) {
    const x = Math.pow(p, -2 * s);
    let xk = x;
    for (let k = 1; k <= 60 && xk > 1e-18; k++) { acc += xk / (k * k); xk *= x; }
  }
  return acc / 2;
}
/** Bohr floor L_N(sigma) = sum_p log(1+p^{-sigma}); inf over phases of |Z_N| = exp(-L_N). */
export function floorLN(ps, s) {
  let acc = 0;
  for (const p of ps) acc += Math.log(1 + Math.pow(p, -s));
  return acc;
}
/** log|Z_N(sigma, theta)| = -sum_p log|1 - p^{-sigma} e^{i theta_p}|. */
export function logAbsZ(ps, s, th) {
  let acc = 0;
  for (let i = 0; i < ps.length; i++) {
    const r = Math.pow(ps[i], -s);
    const re = 1 - r * Math.cos(th[i]), im = -r * Math.sin(th[i]);
    acc -= 0.5 * Math.log(re * re + im * im);
  }
  return acc;
}
/** log 2F1(a,a;1;x) = log sum_k ((a)_k/k!)^2 x^k  (E|1-re^{i theta}|^{-2a} with x=r^2). */
function log2F1(a, x) {
  let term = 1, sum = 1;
  for (let k = 0; k < 600; k++) {
    term *= ((a + k) / (k + 1)) ** 2 * x;
    sum += term;
    if (Math.abs(term) < 1e-17 * Math.abs(sum)) break;
  }
  return Math.log(sum);
}
/** Cramer rate J_N(sigma; L) = sup_lambda [lambda L - sum_p log E e^{-lambda X_p}]. */
export function cramerJ(ps, s, L) {
  let best = 0;
  for (let lam = 0.05; lam <= 400; lam *= 1.05) {
    let cgf = 0;
    for (const p of ps) cgf += log2F1(-lam / 2, Math.pow(p, -2 * s));
    const v = lam * L - cgf;
    if (v > best) best = v;
  }
  return best;
}

// ---------------------------------------------------------------------------------------
// baked mpmath literals (tmp/route-e-widom-scratch.py, dps=30)
// ---------------------------------------------------------------------------------------
/** (zeta'/zeta)'(sigma) and (log xi)''(sigma) on the real axis, sigma in (0,1). */
export const CONTINUED_RESPONSE_ROWS = Object.freeze([
  // [sigma, (zeta'/zeta)', Cv_cont = sigma^2 (zeta'/zeta)', (log xi)'']
  [0.05, 0.75750, 0.00189, 0.046165],
  [0.10, 0.89765, 0.00898, 0.046174],
  [0.20, 1.25037, 0.05001, 0.046190],
  [0.30, 1.75063, 0.15756, 0.046201],
  [0.40, 2.50714, 0.40114, 0.046208],
  [0.45, 3.04414, 0.61644, 0.046209],
  [0.50, 3.74688, 0.93672, 0.046210],
  [0.55, 4.69324, 1.41970, 0.046209],
  [0.60, 6.01264, 2.16455, 0.046208],
  [0.70, 10.88801, 5.33513, 0.046201],
  [0.80, 24.78985, 15.86550, 0.046190],
  [0.90, 99.80165, 80.83934, 0.046174],
  [0.95, 399.80717, 360.82597, 0.046165],
]);
export const DLOGZETA2_HALF = 3.74687769760406; // (zeta'/zeta)'(1/2)
export const LOGXI2_HALF = 0.0462099862308379; // (log xi)''(1/2) = sum_rho 1/gamma^2
export const LOGXI4_HALF = -4.4607119e-4; // (log xi)''''(1/2) < 0: local max
export const SUM_INV_GAMMA2_2000 = 0.02266265500367867; // sum_{k<=2000} gamma_k^{-2}
export const SUM_INV_GAMMA2_TAIL = 0.00044243609341407; // (log(g/2pi)+1)/(2 pi g), g = gamma_2000
export const CATALAN_G = 0.915965594177219;
/** Bohr-Jessen fluctuation variance V(sigma) = (1/2) sum_k P(2k sigma)/k^2. */
export const BOHR_JESSEN_V = Object.freeze({
  0.51: 1.87785114, 0.52: 1.540949071, 0.55: 1.110260913, 0.6: 0.8051746256, 0.7: 0.5301301632,
  0.75: 0.4502154042, 0.8: 0.3886586466, 0.9: 0.2991503996, 1.0: 0.2368471726, 1.5: 0.08963479829,
  2.0: 0.0390184112,
});
/** empirical height-ensemble statistics, t in [1000,3000], 600 midpoint samples (mpmath dps 15). */
export const MOMENT_ROWS = Object.freeze([
  // [sigma, mean|zeta|^2, mean|zeta|^2 (t/2pi)^{sigma-1/2}, mean log|zeta|, var log|zeta|, min|zeta|]
  [0.30, 28.75833, 9.10962, 1.14213, 0.51762, 0.40827],
  [0.40, 13.10170, 7.38117, 0.57367, 0.74934, 0.12559],
  [0.45, 9.30108, 6.98252, 0.29159, 0.96608, 0.05131],
  [0.50, 6.85250, 6.85250, 0.01816, 1.43909, 0.00188],
  [0.55, 5.24305, 6.98252, 0.00570, 0.96509, 0.03971],
  [0.60, 4.16191, 7.38117, 0.00189, 0.74697, 0.07524],
  [0.70, 2.89551, 9.10962, -0.00143, 0.51164, 0.14653],
  [0.80, 2.23950, 12.50944, -0.00230, 0.38039, 0.22064],
  [1.00, 1.63624, 28.89355, -0.00207, 0.23419, 0.35062],
]);
export const ZETA_1P5 = 2.6123753486854883;
export const ZETA_3 = 1.2020569031595942;

// ---------------------------------------------------------------------------------------
// zero-density rate-function ladder: fraction of zeros with beta > sigma <= T^{-I(sigma)+eps}
// ---------------------------------------------------------------------------------------
export const RATE_LADDER = Object.freeze({
  ingham: (s) => 1 - (3 * (1 - s)) / (2 - s), // Ingham 1940
  huxley: (s) => 1 - (12 * (1 - s)) / 5, // Huxley 1972, sigma >= 3/4
  guthMaynard: (s) => 1 - (30 * (1 - s)) / 13, // Guth-Maynard 2024
  densityHyp: (s) => 2 * s - 1, // A = 2; known for sigma >= 25/32 (Bourgain 2000)
  dhKnownFrom: 25 / 32,
  /** best unconditional lower bound on I(sigma) from the ladder. */
  best: (s) => {
    const c = [RATE_LADDER.ingham(s), RATE_LADDER.guthMaynard(s)];
    if (s >= 0.75) c.push(RATE_LADDER.huxley(s));
    if (s >= RATE_LADDER.dhKnownFrom) c.push(RATE_LADDER.densityHyp(s));
    return Math.max(0, ...c);
  },
});

// ---------------------------------------------------------------------------------------
// verdict object
// ---------------------------------------------------------------------------------------
export const RH_ROUTE_E_WIDOM_LD = Object.freeze({
  id: 'rh-route-e-widom-line-large-deviations',
  date: '2026-09-23',
  route: 'E',
  dictionary:
    'zeta(sigma+it)/zeta(sigma) = characteristic function of the Gibbs energy log n at inverse '
    + 'temperature sigma (exact for sigma>1). A zero = vanishing characteristic function = Fisher '
    + 'zero of the primon gas.',
  responseFunctions: {
    meanThermo:
      'Cv_N and Var(Omega)_N monotone decreasing on (0,3] for P=2e2..1e6, Cv_N(0+)=N; continued '
      + 'Cv_cont = sigma^2 (zeta\'/zeta)\' monotone increasing on (0,1), +inf at 1. Single critical '
      + 'point sigma=1 (Hagedorn); no extremum at 1/2 in any regularisation.',
    completed:
      '(log xi)\'\'(sigma) = -sum_rho (sigma-rho)^{-2}: symmetric, local MAX at 1/2 (4th derivative '
      + '-4.46e-4), value sum_rho gamma^{-2} = 0.0462100; flat to 1e-3; symmetry-forced and RH-blind '
      + '(each zero quadruple contributes negatively whenever (a/gamma)^2 < 0.1716, always in the strip).',
    fluctuation:
      'V(sigma) = lim Var_t log|zeta(sigma+it)| = (1/2) sum_k P(2k sigma)/k^2 finite for sigma>1/2 '
      + '(Bohr-Jessen), ~ (1/2) log log T at 1/2 (Selberg), symmetric by the functional equation: the '
      + 'unique divergence of the fluctuation susceptibility is sigma=1/2. Finite-N: V_N converges '
      + 'for sigma>1/2, grows like (1/2) log log P at 1/2 and like P^{1-2sigma} below. Reason: '
      + 'Parseval puts the t-mean-square at 2 sigma, halving the Hagedorn point 1 -> 1/2.',
    correlationLengthProxy:
      'xi_mean = 1/(sigma-1) (Euler-product convergence gap), xi_fluct = 1/(2 sigma-1) (Parseval '
      + 'gap); V(sigma) = (1/2) log xi_fluct + O(1) near 1/2 (1.878 at 0.51 vs 1.956; 1.541 at 0.52 vs 1.609).',
  },
  widomLocus:
    'sigma = 1/2 is the response-maximum locus of the FLUCTUATION susceptibility and of the '
    + 'completed heat capacity; NOT of the mean-thermodynamic responses. Both identifications are '
    + 'unconditional and RH-blind (they hold for any zero configuration).',
  momentsCorrection:
    'Raw (1/T) int |zeta|^2 is monotone decreasing in sigma (28.76 at 0.3 -> 1.64 at 1.0), not '
    + 'peaked at 1/2; the symmetrised moment |zeta|^2 (t/2pi)^{sigma-1/2} has a MINIMUM at 1/2 (6.85 '
    + 'vs 7.38 at 0.4/0.6). The quantity that peaks at 1/2 is Var log|zeta| (1.439 vs 0.966 at 1/2 +- 0.05).',
  rateFunction: {
    finiteN:
      'Exact floor |Z_N| >= exp(-L_N(sigma)), L_N = sum_p log(1+p^{-sigma}), attained at all '
      + 'theta_p = pi. No Fisher zeros at any finite N: the rate of a zero is +infinity. L_N -> '
      + 'log(zeta(sigma)/zeta(2sigma)) for sigma>1 (Bohr infimum; zero-free half-plane), -> infinity '
      + 'for sigma<=1.',
    cramer:
      'J_N(sigma;L) = sup_lambda [lambda L - sum_p log 2F1(-lambda/2,-lambda/2;1;p^{-2sigma})]. At '
      + 'P=1e4, J(L=2) = 0.742 (0.4) < 1.712 (0.5) < 3.361 (0.6) < 8.660 (0.75) < 147.3 (1.0): the '
      + 'near-zero cost is monotone INCREASING in sigma. The finite-N rate function is NOT minimised '
      + 'at 1/2; the Euler product has no reflection and is qualitatively wrong for sigma<1/2.',
    nInfinity:
      'sigma in (1/2,1): stretched-exponential tail with exponent 1/(1-sigma) (Bohr-Jessen/Lamzouri), '
      + 'deepest excursion (log T)^{1-sigma}/(log log T)^sigma, never a zero. Zeros on 1/2 come from '
      + 'the reality of Z(t) (codimension 1), off-line zeros are codimension-2 coincidences.',
  },
  concentrationStatement:
    'Littlewood: int_0^T log|zeta(sigma+it)| dt = 2 pi sum_{beta>sigma,gamma<T} (beta-sigma) + O(log T). '
    + 'Bohr-Jessen mean-zero => sum = o(T) => Bohr-Landau 1914 N(sigma,T)=O(T): zeros concentrate on '
    + 'sigma=1/2 (an o(1) fraction off any epsilon-strip). Quantitative: fraction with beta>sigma <= '
    + 'T^{-I(sigma)}, I >= 1-A(1-sigma), A = 3/(2-sigma) Ingham, 30/13 Guth-Maynard (beats Ingham iff '
    + 'sigma>0.7), 12/5 Huxley (sigma>=3/4), 2 = density hypothesis (known sigma>=25/32). RH <=> I = '
    + '+infinity <=> the integral is O(log T) for every sigma>1/2 (Littlewood criterion).',
  verdict:
    'TESTED, ABSORBED, NO LEVER. sigma=1/2 is the Widom line of the primon gas in the fluctuation '
    + 'sense (Var log|Z| diverges only there) and of the completed heat capacity, but both are '
    + 'unconditional, RH-blind consequences of Parseval (2 sigma) and the functional equation. The '
    + 'mean-thermodynamic responses never see 1/2. The finite-N rate function of a zero is +infinity '
    + '(no Fisher zeros) and the near-zero cost is monotone in sigma, not minimised at 1/2. "Zeros = '
    + 'extreme fluctuations confined to the Widom line" as a concentration statement is Bohr-Landau '
    + '(1914) through Littlewood\'s lemma; its quantitative form is the zero-density exponent, its RH '
    + 'form is Littlewood\'s criterion. The primon-gas fluctuation model reproduces the mean and the '
    + 'variance but is blind to the O(log T) vs T^{1-I} refinement that is RH. Heuristic framing only; '
    + 'no refereed bound is changed; RH open; NO QED.',
  nextTest:
    'Measure m_T(sigma) = (1/T) int_T^{2T} log|zeta(sigma+it)| dt at sigma = 0.6, 0.75 for T = '
    + '1e3..1e6 against the O(log T / T) Littlewood scaling; a T^{-I} tail with I<1 would be an '
    + 'off-line zero signal. Window verification only, not a proof route.',
  sources: {
    scratch: ['tmp/route-e-widom-scratch.py', 'tmp/route-e-finiteN.mjs'],
    page: 'src/pages/SupercriticalPage.jsx (46-prime Euler-product thermodynamics)',
    roadmap: 'src/data/rh-novel-routes-roadmap-2026-09-23.js (route E)',
  },
});

// ---------------------------------------------------------------------------------------
// assertions
// ---------------------------------------------------------------------------------------
const GRID = Array.from({ length: 60 }, (_, k) => (k + 1) / 20); // 0.05 .. 3
const monoDec = (arr) => arr.every((v, i) => i === 0 || v <= arr[i - 1]);
const monoInc = (arr) => arr.every((v, i) => i === 0 || v >= arr[i - 1]);

export const RH_ROUTE_E_WIDOM_LD_ASSERTIONS = Object.freeze([
  {
    id: 'routeE-finiteN-Cv-monotone-no-widom-max',
    holds: () => {
      const ok4 = monoDec(GRID.map((s) => cvN(P1E4, s)));
      const ok5 = monoDec(GRID.map((s) => cvN(PRIMES_1E5, s)));
      const eq = Math.abs(cvN(P1E4, 1e-3) - P1E4.length) < 0.01 * P1E4.length;
      const hag = Math.abs(cvN(PRIMES_1E5, 1) - 66.138) < 0.05;
      return ok4 && ok5 && eq && hag;
    },
    why: 'finite-N heat capacity is monotone decreasing on (0,3] for P=1e4 and 1e5 (no interior maximum, so no Widom locus at 1/2), Cv_N(0+) = N, Cv_N(1) = 66.14 at P=1e5.',
  },
  {
    id: 'routeE-finiteN-compressibility-monotone',
    holds: () => monoDec(GRID.map((s) => varOmegaN(P1E4, s))) && monoDec(GRID.map((s) => varOmegaN(PRIMES_1E5, s))),
    why: 'compressibility proxy Var(Omega) is monotone decreasing in sigma; its only structure is the sigma=1 divergence.',
  },
  {
    id: 'routeE-continued-Cv-monotone-on-strip',
    holds: () => monoInc(CONTINUED_RESPONSE_ROWS.map((r) => r[1])) && monoInc(CONTINUED_RESPONSE_ROWS.map((r) => r[2]))
      && Math.abs(CONTINUED_RESPONSE_ROWS[6][1] - DLOGZETA2_HALF) < 1e-5,
    why: 'analytically continued (zeta\'/zeta)\' and Cv_cont are monotone increasing on (0,1): no interior extremum, nothing at 1/2.',
  },
  {
    id: 'routeE-completed-heat-capacity-symmetric-max-at-half',
    holds: () => {
      const rows = CONTINUED_RESPONSE_ROWS;
      const at = (s) => rows.find((r) => Math.abs(r[0] - s) < 1e-9)[3];
      const sym = [[0.3, 0.7], [0.4, 0.6], [0.45, 0.55], [0.2, 0.8], [0.1, 0.9], [0.05, 0.95]]
        .every(([a, b]) => Math.abs(at(a) - at(b)) < 1e-6);
      const max = rows.every((r) => r[3] <= at(0.5) + 1e-9);
      const flat = (at(0.5) - at(0.05)) / at(0.5) < 1e-3;
      return sym && max && LOGXI4_HALF < 0 && flat;
    },
    why: '(log xi)\'\' is symmetric about 1/2, maximal at 1/2 with negative 4th derivative, and flat to 1e-3: a symmetry-forced, RH-blind maximum.',
  },
  {
    id: 'routeE-logxi2-half-identity-and-zero-sum',
    holds: () => {
      const psi1Quarter = Math.PI ** 2 + 8 * CATALAN_G; // psi'(1/4)
      const viaIdentity = DLOGZETA2_HALF + psi1Quarter / 4 - 8;
      const viaZeros = 2 * (SUM_INV_GAMMA2_2000 + SUM_INV_GAMMA2_TAIL);
      return Math.abs(viaIdentity - LOGXI2_HALF) < 1e-12 && Math.abs(viaZeros - LOGXI2_HALF) < 1e-6;
    },
    why: '(log xi)\'\'(1/2) = (zeta\'/zeta)\'(1/2) + psi\'(1/4)/4 - 8 = sum_rho gamma^{-2}: identity to 1e-12, 2000-zero Hadamard sum + tail to 1e-6.',
  },
  {
    id: 'routeE-fluctuation-variance-critical-at-half',
    holds: () => {
      const v = (ps, s) => fluctVarN(ps, s);
      const conv75 = Math.abs(v(PRIMES_1E5, 0.75) - v(P1E4, 0.75)) / v(P1E4, 0.75) < 1e-2;
      const conv1 = Math.abs(v(PRIMES_1E5, 1.0) - v(P1E4, 1.0)) / v(P1E4, 1.0) < 1e-3;
      const bj75 = Math.abs(v(PRIMES_1E5, 0.75) - BOHR_JESSEN_V[0.75]) < 2e-3;
      const bj1 = Math.abs(v(PRIMES_1E5, 1.0) - BOHR_JESSEN_V[1.0]) < 2e-4;
      const inc = v(PRIMES_1E5, 0.5) - v(P1E4, 0.5);
      const selberg = Math.abs(inc - 0.5 * Math.log(Math.log(1e5) / Math.log(1e4))) < 0.05 * inc;
      const g04 = Math.log(v(PRIMES_1E5, 0.4) / v(P1E4, 0.4)) / Math.log(10);
      const g06 = Math.log(v(PRIMES_1E5, 0.6) / v(P1E4, 0.6)) / Math.log(10);
      return conv75 && conv1 && bj75 && bj1 && selberg && g04 > 0.08 && g04 < 0.2 && g06 < 0.01;
    },
    why: 'V_N converges for sigma>1/2 (to Bohr-Jessen), grows by (1/2) log(log P\'/log P) at 1/2 (Selberg), and with exponent ~1-2sigma below: the fluctuation critical point is exactly 1/2.',
  },
  {
    id: 'routeE-empirical-variance-peaks-at-half-moments-do-not',
    holds: () => {
      const rows = MOMENT_ROWS;
      const raw = rows.map((r) => r[1]);
      const rawMono = raw.every((v, i) => i === 0 || v < raw[i - 1]);
      const at = (s) => rows.find((r) => Math.abs(r[0] - s) < 1e-9);
      const symPairs = [[0.3, 0.7], [0.4, 0.6], [0.45, 0.55]];
      const symOk = symPairs.every(([a, b]) => Math.abs(at(a)[2] - at(b)[2]) / at(a)[2] < 1e-3);
      const minAtHalf = rows.every((r) => r[2] >= at(0.5)[2]);
      const varMax = rows.every((r) => r[4] <= at(0.5)[4]);
      const varSym = symPairs.every(([a, b]) => Math.abs(at(a)[4] - at(b)[4]) / at(a)[4] < 0.03);
      const meanZero = [0.6, 0.7, 0.8, 1.0].every((s) => Math.abs(at(s)[3]) < 0.01);
      const bj = [0.6, 0.7, 0.8].every((s) => Math.abs(at(s)[4] - BOHR_JESSEN_V[s]) / BOHR_JESSEN_V[s] < 0.1);
      return rawMono && symOk && minAtHalf && varMax && varSym && meanZero && bj;
    },
    why: 'height-ensemble data: raw |zeta|^2 moment monotone in sigma, symmetrised moment minimal at 1/2, Var log|zeta| maximal at 1/2 and within 10% of Bohr-Jessen for sigma>=0.6, mean log|zeta| ~ 0 off the line.',
  },
  {
    id: 'routeE-bohr-floor-no-finiteN-zeros',
    holds: () => {
      const target = Math.log(ZETA_1P5 / ZETA_3);
      const floorOk = Math.abs(floorLN(PRIMES_1E5, 1.5) - target) < 1e-3;
      const grows = floorLN(PRIMES_1E5, 0.5) > 2 * floorLN(P1E4, 0.5);
      const allPi = logAbsZ(P46, 0.5, P46.map(() => Math.PI));
      const attain = Math.abs(allPi + floorLN(P46, 0.5)) < 1e-10;
      let seed = 12345;
      const rnd = () => { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; };
      let above = true;
      for (let k = 0; k < 500; k++) {
        const th = P46.map(() => 2 * Math.PI * rnd());
        if (logAbsZ(P46, 0.5, th) < -floorLN(P46, 0.5) - 1e-12) above = false;
      }
      return floorOk && grows && attain && above;
    },
    why: 'inf over phases of |Z_N| = exp(-L_N): L_N(1.5) -> log(zeta(1.5)/zeta(3)) (Bohr infimum), L_N(1/2) diverges with P, the all-pi configuration attains the floor and random phases never cross it: no Fisher zeros at finite N.',
  },
  {
    id: 'routeE-cramer-rate-monotone-not-min-at-half',
    holds: () => {
      const J = [0.4, 0.5, 0.6, 0.75, 1.0].map((s) => cramerJ(P1E4, s, 2));
      const inc = J.every((v, i) => i === 0 || v > J[i - 1]);
      const baked = Math.abs(J[1] - 1.712) < 0.02 && Math.abs(J[3] - 8.660) < 0.05;
      const gauss = Math.abs(cramerJ(P1E4, 0.5, 1) - 1 / (2 * fluctVarN(P1E4, 0.5))) < 0.15 / (2 * fluctVarN(P1E4, 0.5));
      const L = floorLN(P1E4, 0.5);
      const a = cramerJ(P1E4, 0.5, 0.1 * L), b = cramerJ(P1E4, 0.5, 0.5 * L), c = cramerJ(P1E4, 0.5, 0.99 * L);
      return inc && baked && gauss && a < b && b < c && c > 1000;
    },
    why: 'near-zero cost J_N(sigma; L=2) increases monotonically 0.4 -> 1.0 (rate not minimised at 1/2), is Gaussian for small L at 1/2, and diverges toward the floor.',
  },
  {
    id: 'routeE-cramer-freezes-above-half-relaxes-below',
    holds: () => {
      const j = (ps, s) => cramerJ(ps, s, 2);
      const rel = (a, b) => Math.abs(a - b) / b;
      const frozen1 = rel(j(P1E4, 1.0), j(P1E3, 1.0)) < 0.05;
      const frozen75 = rel(j(P1E4, 0.75), j(P1E3, 0.75)) < 0.05;
      const relax4 = j(P1E4, 0.4) < 0.8 * j(P1E3, 0.4);
      const relax5 = j(P1E4, 0.5) < 0.9 * j(P1E3, 0.5);
      return frozen1 && frozen75 && relax4 && relax5;
    },
    why: 'depth-2 near-zero cost is N-independent for sigma>1/2 (positive, frozen) and decreases with N for sigma<=1/2: only on/left of 1/2 do near-zeros become free as N grows.',
  },
  {
    id: 'routeE-zero-density-rate-ladder',
    holds: () => {
      const R = RATE_LADDER;
      const half = Math.abs(R.ingham(0.5)) < 1e-12 && Math.abs(R.densityHyp(0.5)) < 1e-12;
      const gmVsIngham = R.guthMaynard(0.75) > R.ingham(0.75) && R.guthMaynard(0.65) < R.ingham(0.65)
        && Math.abs(R.guthMaynard(0.7) - R.ingham(0.7)) < 1e-12;
      const gmVsHuxley = [0.75, 0.8, 0.9].every((s) => R.guthMaynard(s) > R.huxley(s));
      const pos = [0.51, 0.6, 0.7, 0.75, 0.8, 0.9, 0.99].every((s) => R.best(s) > 0);
      const mono = monoInc([0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95, 1].map(R.best));
      const dh = R.best(0.8) === R.densityHyp(0.8) && R.best(0.75) === R.guthMaynard(0.75);
      return half && gmVsIngham && gmVsHuxley && pos && mono && dh && Math.abs(R.best(1) - 1) < 1e-12;
    },
    why: 'rate function ladder I(sigma): 0 at 1/2, positive on (1/2,1], monotone; Guth-Maynard beats Ingham iff sigma>0.7 and beats Huxley everywhere; density hypothesis binds for sigma>=25/32.',
  },
  {
    id: 'routeE-verdict-honesty',
    holds: () => {
      const v = RH_ROUTE_E_WIDOM_LD.verdict;
      return /ABSORBED/.test(v) && /NO LEVER/.test(v) && /RH-blind/.test(v) && /Bohr-Landau/.test(v)
        && /NO QED/.test(v) && /RH open/.test(v) && /refereed bound is changed/i.test(v)
        && !/prov(e|ed|es) RH/i.test(v) && typeof RH_ROUTE_E_WIDOM_LD.nextTest === 'string';
    },
    why: 'verdict states the route is absorbed into the classical Bohr-Landau/Littlewood/zero-density chain, RH-blind, no lever, NO QED, RH open, and records a next test.',
  },
]);

for (const a of RH_ROUTE_E_WIDOM_LD_ASSERTIONS) {
  if (!a.holds()) throw new Error(`rh-route-e-widom-line-large-deviations assertion failed: ${a.id}`);
}

export default RH_ROUTE_E_WIDOM_LD;
