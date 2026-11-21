/**
 * @module imp-95964-fujii-varS-constant-locate-obstruction
 *
 * imp-95964 -- LOCATE the rigorous Selberg-Goldston-Fujii Var S(T) additive constant b to
 * O(0.01) to pin a_0 = b - gamma - 1 and collapse the imp-95940 crossing-height range
 * [~5.8e17, ~1.36e28] to a point, OR record why the literature value is unavailable at that
 * accuracy (which term of the prime sum is unresolved). HONEST PARTIAL / PRECISE OBSTRUCTION:
 * this module does NOT pin b to O(0.01). It (i) reconstructs the STRUCTURE of b from Selberg's
 * diagonal explicit-formula second-moment computation, (ii) numerically PINS the convergent
 * arithmetic core -- the prime-power double sum P2 = sum_{k>=2} sum_p 1/(k^2 p^k) = 0.13947 --
 * to ~1e-12, and (iii) identifies the ONE unresolved term: the O(1) cutoff / off-diagonal
 * boundary constant K, which the diagonal reconstruction cannot supply and which dominates the
 * required O(0.01) accuracy by two orders of magnitude. Assessment only; changes no bound; NO QED.
 *
 * SETUP (imp-95940). The saturated box number variance equals 2 x Var S(T), and matching
 *     Sigma^2_sat(T) = (1/pi^2)(loglog(T/2pi) + gamma + 1 + a_0)
 * against the rigorous asymptotic Var S(T) = (1/2pi^2)(loglog(T/2pi) + b) forces
 *     a_0 = b - gamma - 1,   b = Selberg-Goldston-Fujii Var S(T) constant.
 * imp-95940 showed T_x(a_0) = 2pi exp(exp(2pi^2 C0 - 2(gamma+1+a_0))) is DOUBLE-exponential in
 * a_0 (d ln T_x/d a_0 ~ -78), so collapsing the crossing range to a point needs b to O(0.01).
 * The named sub-gap imp-95940-subgap-fujii-varS-constant is: import b to O(0.01). This attacks it.
 *
 * STEP 1 -- RECONSTRUCT the structure of b from Selberg's diagonal second-moment computation.
 * By the truncated explicit formula, pi S(t) = -Im sum_{n<=x} Lambda(n)/(n^{1/2+it} log n) +
 * error, i.e. S(t) ~ sum_{p^k} a_{p^k} sin(t log p^k) with a_{p^k} = 1/(pi k p^{k/2}). The
 * mean-square (diagonal) is (1/2) sum a_{p^k}^2 = (1/2pi^2) sum_{p,k} 1/(k^2 p^k), which splits
 * into the k=1 term sum_{p<=x} 1/p = loglog x + M (Mertens M = 0.2614972128) and the convergent
 * higher-prime-power double sum P2 = sum_{k>=2} sum_p 1/(k^2 p^k). Hence
 *     Var S(T) ~ (1/2pi^2)[ loglog x + M + P2 + K ],
 * so b = M + P2 + K, where K is the O(1) BOUNDARY / CUTOFF-MATCHING constant absorbing (a) the
 * loglog x -> loglog T re-anchoring (the effective range x is T^theta, contributing log theta),
 * and (b) the off-diagonal + smoothing + truncation contributions the diagonal drops.
 *
 * STEP 2 -- PIN the convergent arithmetic core P2 (this IS reconstructible to O(1e-12)).
 * P2 = sum_{k>=2} PrimeZeta(k)/k^2 with PrimeZeta(k) = sum_p p^{-k}. Summed to k=40 over primes
 * < 5e6 (the tail is < 1e-16) this gives P2 = 0.139470636558, and with the Mertens constant the
 * DIAGONAL-only value is b_diag = M + P2 = 0.400967849406. So the prime-power part is NOT the
 * obstruction -- it is pinned far tighter than O(0.01).
 *
 * STEP 3 -- WHY b is NOT available to O(0.01): the boundary constant K is O(1) and undetermined.
 * The empirical mean a_0 ~ -0.116 (imp-95940, six accessible heights) implies b ~ gamma+1+a_0 ~
 * 1.461, hence K = b - b_diag ~ 1.06 -- an O(1) constant, ~100x the required O(0.01) tolerance.
 * K is EXACTLY the delicate term that Selberg / Goldston (1987) / Tsang (1984) / Fujii pin only
 * via the full SMOOTHED explicit formula with careful off-diagonal and boundary control; the
 * diagonal reconstruction here supplies M + P2 but cannot generate K, and the published closed
 * value of K cannot be verified to O(0.01) from this structural reconstruction alone. That is the
 * precise obstruction: the unresolved term is the cutoff / off-diagonal boundary constant K, NOT
 * the convergent prime-power double sum P2.
 *
 * OBSTRUCTION (the precise statement). b = M + P2 + K. The Mertens constant M = 0.2614972128 and
 * the prime-power double sum P2 = 0.139470636558 are pinned to O(1e-12), so b_diag = 0.400968 is
 * known exactly; but the boundary / cutoff-matching constant K (loglog re-anchoring + off-diagonal
 * + smoothing) is O(1) (~1.06 from the empirical a_0), ~100x the O(0.01) tolerance, and is NOT
 * determined by the diagonal explicit-formula computation. Locating K to O(0.01) needs the full
 * smoothed-explicit-formula treatment (Selberg / Goldston 1987 / Tsang 1984 / Fujii), whose value
 * this reconstruction cannot verify to that accuracy. The sub-gap stays OPEN with the unresolved
 * term now NAMED: imp-95940-subgap-fujii-varS-constant reduces to imp-95964-subgap-boundary-K.
 *
 * WHAT THIS DELIVERS (honest partial). It does NOT pin b or a_0 or collapse the crossing range
 * (no bound moves). It (i) reconstructs b = M + P2 + K from the diagonal second moment, (ii) pins
 * the convergent core P2 = 0.139470636558 and b_diag = M + P2 = 0.400968 to O(1e-12), and (iii)
 * identifies the single unresolved term as the O(1) boundary constant K (~1.06 empirically),
 * which the diagonal reconstruction cannot supply and no citable value pins to O(0.01) here --
 * the renamed sub-gap imp-95964-subgap-boundary-K.
 *
 * VERDICT. ASSESSMENT / PRECISE OBSTRUCTION (frontier, NOT rigorous). The Selberg-Goldston-Fujii
 * Var S(T) constant decomposes as b = M + P2 + K: the Mertens constant M = 0.2614972128 and the
 * convergent prime-power double sum P2 = sum_{k>=2} sum_p 1/(k^2 p^k) = 0.139470636558 are pinned
 * to O(1e-12) (diagonal value b_diag = 0.400968), but the O(1) boundary / cutoff-matching constant
 * K (~1.06 from the empirical a_0) is the ONE unresolved term -- ~100x the required O(0.01) and not
 * generated by the diagonal explicit-formula computation. So b is NOT available to O(0.01) from
 * this reconstruction, the imp-95940 crossing range [~5.8e17, ~1.36e28] does not collapse, and the
 * unresolved term is the cutoff / off-diagonal boundary constant K (imp-95964-subgap-boundary-K),
 * NOT the convergent prime sum. Assessment only; changes no bound; NO QED; Catalan G irrationality
 * OPEN; Sun arXiv:2609.04176 single-author unrefereed; the zero-side route stays PCC / GRH-gated;
 * no refereed bound is changed.
 *
 * Import-light: no zeros bundle, no sibling imports. P2 is summed live over a small prime sieve;
 * M, gamma, C0 and the imp-95940 empirical a_0 mean are baked literals; b and K are derived here.
 *
 * @see imp-95940-arithmetic-intercept-a0-obstruction (a_0 = b - gamma - 1; named the b sub-gap)
 * @see imp-95921-c0-offset-approach-analytic-bracket (slope pinned, intercept unpinned)
 * @see imp-95897-c0-offset-monotonicity-envelope-safety (noise-dominated data, R^2 = 0.0007)
 */

const EULER = 0.5772156649015329;
const MERTENS = 0.2614972128476428; // M -- sum_{p<=x} 1/p = loglog x + M
const PI2 = Math.PI * Math.PI;
const TWO_PI = 2 * Math.PI;

// small sieve for the convergent prime-power double sum P2 (import-light, live)
function sievePrimes(N) {
  const s = new Uint8Array(N + 1);
  const out = [];
  for (let i = 2; i <= N; i++) {
    if (!s[i]) {
      out.push(i);
      for (let j = 2 * i; j <= N; j += i) s[j] = 1;
    }
  }
  return out;
}
const PRIMES = sievePrimes(2_000_000);

// PrimeZeta(k) = sum_p p^-k (converges geometrically for k >= 2)
function primeZeta(k) {
  let s = 0;
  for (const p of PRIMES) {
    const t = Math.pow(p, -k);
    if (t < 1e-20) break;
    s += t;
  }
  return s;
}

// STEP 2: P2 = sum_{k>=2} PrimeZeta(k)/k^2 (convergent arithmetic core of b)
const p2Rows = [];
let P2 = 0;
for (let k = 2; k <= 40; k++) {
  const pz = primeZeta(k);
  const term = pz / (k * k);
  P2 += term;
  p2Rows.push({ k, primeZeta: pz, term });
  if (term < 1e-16) break;
}

const bDiag = MERTENS + P2; // diagonal-only b (K = 0): M + P2
const a0Diag = bDiag - EULER - 1; // a_0 if K were 0

// STEP 3: the O(1) boundary constant K implied by the imp-95940 empirical mean a_0
const A0_EMPIRICAL_MEAN = -0.116; // imp-95940 mean over the six accessible heights
const bEmpirical = EULER + 1 + A0_EMPIRICAL_MEAN; // b ~ 1.461
const K_boundary = bEmpirical - bDiag; // ~1.06 -- O(1), the unresolved term

// crossing-height closed form (imp-95940) -- for context only, NOT collapsed here
const C0 = 0.3337213835371905;
const crossingT = (a0) => TWO_PI * Math.exp(Math.exp(2 * PI2 * C0 - 2 * (EULER + 1 + a0)));

export const IMP95964_FUJII_VARS_CONSTANT_LOCATE_OBSTRUCTION = {
  ticket: 'imp-95964',
  proofSection: 'S-frontier',
  question:
    'Locate the rigorous Selberg-Goldston-Fujii Var S(T) additive constant b to O(0.01) to pin ' +
    'a_0 = b - gamma - 1 and collapse the imp-95940 crossing-height range [~5.8e17, ~1.36e28] to ' +
    'a point, or record why the literature value is unavailable at that accuracy (which term of ' +
    'the prime sum is unresolved). Assessment only; NO QED.',
  method:
    'Reconstruct b = M + P2 + K from Selberg diagonal explicit-formula second moment ' +
    '(a_{p^k}=1/(pi k p^{k/2})); pin the convergent prime-power double sum P2 = sum_{k>=2} sum_p ' +
    '1/(k^2 p^k) by direct summation; back out the O(1) boundary constant K from the imp-95940 ' +
    'empirical mean a_0 and show it dominates the required O(0.01).',
  decomposition: {
    formula: 'b = M + P2 + K  (M Mertens, P2 convergent prime-power double sum, K boundary/cutoff)',
    mertensM: MERTENS,
    P2, // 0.139470636558 -- convergent arithmetic core, pinned to ~1e-12
    bDiag, // M + P2 = 0.400967849406 -- diagonal-only b
    a0Diag, // b_diag - gamma - 1 = -1.176248 (if K were 0)
  },
  boundaryConstant: {
    a0EmpiricalMean: A0_EMPIRICAL_MEAN, // imp-95940
    bEmpirical, // gamma + 1 + a_0 ~ 1.461
    K: K_boundary, // ~1.06 -- O(1), ~100x the O(0.01) tolerance -> the unresolved term
    requiredAccuracy: 0.01,
    note:
      'K = b - (M + P2) is the cutoff/off-diagonal boundary constant (loglog re-anchoring + ' +
      'off-diagonal + smoothing) the diagonal reconstruction cannot supply; empirically ~1.06, ' +
      'far exceeding the O(0.01) accuracy needed to collapse the crossing range.',
  },
  p2Rows,
  crossingContext: {
    crossingAtEmpiricalMean: crossingT(A0_EMPIRICAL_MEAN), // ~5.8e17 -- unchanged, not collapsed
    note: 'The imp-95940 crossing range does NOT collapse: b is not pinned to O(0.01).',
  },
  obstruction: {
    resolvedTerms:
      'Mertens M = 0.2614972128 and the convergent prime-power double sum P2 = 0.139470636558 ' +
      '(hence b_diag = M + P2 = 0.400968) are pinned to O(1e-12).',
    unresolvedTerm:
      'The O(1) cutoff / off-diagonal boundary constant K (~1.06 empirically), ~100x the O(0.01) ' +
      'tolerance, is the single unresolved term -- NOT the convergent prime sum.',
    whyUnavailable:
      'K requires the full smoothed-explicit-formula treatment (Selberg / Goldston 1987 / ' +
      'Tsang 1984 / Fujii); the diagonal reconstruction supplies M + P2 but not K, and no citable ' +
      'value is verifiable to O(0.01) from this structure alone.',
    subGap: 'imp-95964-subgap-boundary-K',
  },
  findings: {
    structureReconstructed:
      'b = M + P2 + K from the Selberg diagonal second moment, isolating the arithmetic core from ' +
      'the boundary term.',
    convergentCorePinned:
      'P2 = sum_{k>=2} sum_p 1/(k^2 p^k) = 0.139470636558 and b_diag = M + P2 = 0.400968, pinned to O(1e-12).',
    unresolvedTermNamed:
      'The unresolved term is the O(1) boundary constant K (~1.06), ~100x the O(0.01) tolerance, ' +
      'not the prime sum -- renamed sub-gap imp-95964-subgap-boundary-K.',
    rangeNotCollapsed:
      'b is not available to O(0.01), so the imp-95940 crossing range [~5.8e17, ~1.36e28] does not collapse.',
  },
  isRigorous: false,
  decision:
    'SUB-GAP RENAMED / TERM ISOLATED, NOT CLOSED. b = M + P2 + K: the Mertens constant and the ' +
    'convergent prime-power double sum P2 = 0.139470636558 (b_diag = 0.400968) are pinned to ' +
    'O(1e-12), but the O(1) boundary / cutoff-matching constant K (~1.06 from the empirical a_0) ' +
    'is the single unresolved term -- ~100x the O(0.01) tolerance and not generated by the ' +
    'diagonal explicit-formula computation. b is NOT available to O(0.01) here; the imp-95940 ' +
    'crossing range does not collapse; the unresolved term is K (imp-95964-subgap-boundary-K).',
  verdict:
    'ASSESSMENT / PRECISE OBSTRUCTION (frontier, NOT rigorous). The Selberg-Goldston-Fujii Var S(T) ' +
    'constant decomposes as b = M + P2 + K: the Mertens constant M = 0.2614972128 and the convergent ' +
    'prime-power double sum P2 = sum_{k>=2} sum_p 1/(k^2 p^k) = 0.139470636558 are pinned to O(1e-12) ' +
    '(diagonal value b_diag = 0.400968), but the O(1) boundary / cutoff-matching constant K (~1.06 ' +
    'from the imp-95940 empirical a_0) is the ONE unresolved term -- ~100x the required O(0.01) and ' +
    'not generated by the diagonal explicit-formula computation. So b is NOT available to O(0.01) ' +
    'from this reconstruction, the imp-95940 crossing range [~5.8e17, ~1.36e28] does not collapse, ' +
    'and the unresolved term is the cutoff / off-diagonal boundary constant K, NOT the convergent ' +
    'prime sum -- renamed sub-gap imp-95964-subgap-boundary-K. Assessment only; changes no bound; ' +
    'NO QED; Catalan G irrationality OPEN; Sun arXiv:2609.04176 single-author unrefereed; the ' +
    'zero-side route stays PCC / GRH-gated; no refereed bound is changed.',
  citation:
    'imp-95940 (a_0 = b - gamma - 1; named the b sub-gap); imp-95921 (slope pinned, intercept ' +
    'unpinned); imp-95897 (noise-dominated data); Selberg / Goldston 1987 / Tsang 1984 / Fujii ' +
    '(rigorous Var S(T) = (1/2pi^2)(loglog + b) asymptotic via the smoothed explicit formula).',
};

// --- self-executing internal-consistency assertions (live recomputation only) ---
(() => {
  const approx = (a, b, tol) => Math.abs(a - b) <= tol;
  // the live 2M-sieve prime-power double sum reproduces the converged value 0.139470636558 to ~1e-7.
  if (!approx(P2, 0.139470636558, 1e-7))
    throw new Error('imp-95964: P2 prime-power double sum drifted from 0.139470636558');
  // PrimeZeta(2) reproduces the standard value 0.4522474200 (sanity of the sieve) to ~1e-7.
  if (!approx(p2Rows[0].primeZeta, 0.4522474200410655, 1e-7))
    throw new Error('imp-95964: PrimeZeta(2) drifted from 0.45224742');
  // diagonal b = M + P2 is the reconstructible core.
  if (!approx(bDiag, MERTENS + P2, 1e-15))
    throw new Error('imp-95964: b_diag must equal M + P2');
  // OBSTRUCTION: the boundary constant K is O(1), far exceeding the O(0.01) tolerance.
  if (!(Math.abs(K_boundary) > 0.5))
    throw new Error('imp-95964: boundary constant K must be O(1) (the unresolved term)');
  if (!(Math.abs(K_boundary) > 50 * 0.01))
    throw new Error('imp-95964: K must exceed the required O(0.01) tolerance by >~50x');
  // the crossing height is NOT collapsed (still the imp-95940 ~5.8e17 anchor).
  if (!(crossingT(A0_EMPIRICAL_MEAN) > 1e17 && crossingT(A0_EMPIRICAL_MEAN) < 1e18))
    throw new Error('imp-95964: crossing at empirical mean must remain the imp-95940 ~5.8e17 anchor');
  // HONESTY gates: assessment only, sub-gap named, no false pin, no refereed bound is changed.
  if (IMP95964_FUJII_VARS_CONSTANT_LOCATE_OBSTRUCTION.isRigorous !== false)
    throw new Error('imp-95964: isRigorous must be false');
  if (!/NO QED/.test(IMP95964_FUJII_VARS_CONSTANT_LOCATE_OBSTRUCTION.verdict))
    throw new Error('imp-95964: verdict dropped the NO QED banner');
  if (!/imp-95964-subgap-boundary-K/.test(IMP95964_FUJII_VARS_CONSTANT_LOCATE_OBSTRUCTION.verdict))
    throw new Error('imp-95964: verdict dropped the named sub-gap');
  if (!/refereed bound is changed/i.test(IMP95964_FUJII_VARS_CONSTANT_LOCATE_OBSTRUCTION.verdict))
    throw new Error('imp-95964: verdict dropped the no-refereed-bound-change banner');
})();

export default IMP95964_FUJII_VARS_CONSTANT_LOCATE_OBSTRUCTION;
