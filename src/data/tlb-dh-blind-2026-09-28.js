/**
 * @fileoverview tlb-dh-blind-2026-09-28 — DH-BLIND (twin-ladder + bridge wave, pick 2): Euler-blindness radius of
 * the Davenport–Heilbronn twin. Two adversarial referee passes; referee corrections applied (headline scope, onset
 * lower end basis-limited, novelty relative to NS-RIGID (d) / Route C). Supersedes the unrefereed draft
 * rh-tlb-2-dh-euler-blindness-radius-2026-09-28.
 *
 * Question. The Davenport–Heilbronn function F_DH = ((1−iκ)/2) L(s,χ) + ((1+iκ)/2) L(s,χ̄)
 * (χ the odd quartic character mod 5, κ = (√(10−2√5)−2)/(√5−1)) has the same completed bridge
 * (5/π)^{s/2} Γ((s+1)/2) as its Euler arm L(s,χ), satisfies Λ_F(s) = Λ_F(1−s) with root number 1,
 * and has zeros off the critical line (first: 0.8085171825 + 85.6993484854i). In twin-ladder terms it
 * is a "same-bridge, no-cascade" twin: identical bridge factor, lossless on σ = 1/2, but its direct arm
 * is not an Euler product (no cascade of prime sections T_p). For even real g supported in [−a,a] the
 * Weil form is
 *   W_F(g) = (1/2π) ∫ Ω(t) |ĝ(t)|² dt − 2 Σ_{n ≤ e^{2a}} c(n) n^{−1/2} (g∗g)(log n),
 *   Ω(t) = log(5/π) + Re ψ(3/4 + it/2),   −F'/F(s) = Σ c(n) n^{−s}.
 * a*_F = inf{a : W_F(g) < 0 for some g supported in [−a,a]}. How large is a*_DH compared with the
 * Route I support 2a ≤ ln 3?
 *
 * Results (see TLB_DH_BLIND.tiers for the proved / certified / measured / heuristic split):
 *  - explicit formula for F_DH validated against its computed zero set (71 on-line zeros + 2 off-line
 *    pairs below t = 130, argument-principle total 75) on 5 test functions, residuals ≤ 1.2e-13;
 *  - PROVED: W_DH ≥ 0 for 2a ≤ 0.78306 (past ln 2) by a closed-form bound; the Euler-arm form is
 *    unconditionally ≥ 0 for 2a ≤ 0.93850;
 *  - CERTIFIED (Arb ball arithmetic, explicit rational g0): W_DH(g0) < 0 at A = 1.72, 1.74, 1.76, 1.78, 1.8, 2,
 *    so a*_DH ≤ 1.72;
 *  - MEASURED: in exact 95–106-function Rayleigh–Ritz bases λ_min(W_DH) = +3.0e-18, +4.8e-23, +8.5e-26,
 *    +1.1e-28, +4.4e-30, −8.0e-30 at a = 1.50, 1.60, 1.65, 1.70, 1.71, 1.72. A positive finite-basis λ_min is an
 *    upper bound on the infimum, so only a*_DH ≤ 1.72 is established: λ_min > 0 at a ≤ 1.70 for N ≤ 122, and a = 1.71
 *    is basis-unsettled (λ_min 4.45e-30 → 3.01e-30 for N 106 → 123, still falling). Positive with resolved margin
 *    in double precision for a ≤ 1.3. λ_min(W_DH) at a = (ln 3)/2 is +0.2098 (measured, not certified; referees
 *    reproduced 0.2124–0.2132 in independent bases, trending down to it). The Euler arm's λ_min ≥ −7.6e-13
 *    (double-precision floor) on a ∈ [0.3, 4] and ≥ 0 in exact near-null-subspace checks at a = 2.5, 3;
 *  - the negative direction is carried by the first off-line zero (its Re ĝ(γ₁)² term cancels the on-line sum).
 * DECISION (on measured evidence past 2a = 0.783): a*_DH > (ln 3)/2, by a factor ≈ 3.1 in a. At conductor 5, Weil
 * positivity is PROVED Euler-blind on 2a ≤ 0.78306 (the RH-false same-bridge F_DH passes) and MEASURED Euler-blind on
 * 0.78306 < 2a ≤ ln 3 (λ_min = 0.21 at 2a = ln 3). The first certified failure is at a = 1.72, carried by the
 * off-line zero 0.8085+85.699i. NOVELTY: the qualitative point (functional equation + Dirichlet series do not give
 * RH) is already recorded in NS-RIGID (d) (imp-95530) and the Route C verdict, and small-support Euler-blindness is
 * structurally expected (below ln 2 it is trivial for any Dirichlet series with a(1) = 1 and the same gamma factor;
 * support a only registers off-line zeros up to height ~e^{2a}). What is new is the quantified radius, the certified
 * negative witness, the c(2) interval and the hybrid attribution. The ζ analogy is a heuristic, labelled as such.
 * No bound on Λ moves; no refereed bound is changed; NO QED.
 *
 * Scripts: tmp/tlb-2-zeros-validate.py, tmp/tlb-2-weil.py, tmp/tlb-2-certify.py, tmp/tlb-2-refine.py,
 * tmp/tlb-2-verify-coeffs.py, tmp/tlb-2-exactfull.py, tmp/tlb-2-attrib.py, tmp/tlb-2-lowerbound.py,
 * tmp/tlb-2-c2interval.py, tmp/tlb-2-zeroside.py (outputs tmp/tlb-2-*.json|log).
 * Import-free. holds() assertions recompute κ, the c(n) recursion, the Euler-arm identity, the closed-form
 * lower bound B(a), and the zero-count / certificate / decision consistency from baked literals.
 */

const LN2 = Math.log(2);
const LN3 = Math.log(3);
const EULER_GAMMA = 0.5772156649015329;
const KAPPA = (Math.sqrt(10 - 2 * Math.sqrt(5)) - 2) / (Math.sqrt(5) - 1);
const A_PERIODIC = Object.freeze([0, 1, KAPPA, -KAPPA, -1]); // a(n) by n mod 5: F_DH = Σ a(n) n^{-s}
const RE_CHI = Object.freeze([0, 1, 0, 0, -1]); // Re χ(n) by n mod 5 (χ(2) = i)

/** c(n) of −F'/F for a periodic-mod-5 coefficient pattern, via a(n) log n = Σ_{d|n} c(d) a(n/d). */
export function logDerivCoeffs(aPer, nMax) {
  const c = new Array(nMax + 1).fill(0);
  for (let n = 2; n <= nMax; n++) {
    let s = aPer[n % 5] * Math.log(n);
    for (let d = 2; d < n; d++) if (n % d === 0) s -= c[d] * aPer[(n / d) % 5];
    c[n] = s;
  }
  return c;
}
function vonMangoldt(n) {
  for (let p = 2; p <= n; p++) {
    if (n % p === 0) { let m = n; while (m % p === 0) m /= p; return m === 1 ? Math.log(p) : 0; }
  }
  return 0;
}
/** Closed-form lower bound: Q(g) ≥ B(a)‖g‖² for supp g ⊂ [−a,a] (archimedean-only form). */
export function archLowerBound(a) {
  const psi34 = -EULER_GAMMA + Math.PI / 2 - 3 * LN2;
  let tau = 0;
  for (let m = 0; m < 200; m++) { const b = 2 * m + 1.5; tau += (2 * Math.exp(-2 * a * b)) / b; }
  const k2a = Math.exp(-a) / Math.sinh(2 * a);
  return Math.log(5 / Math.PI) + psi34 + tau + a * k2a;
}

// ---------------------------------------------------------------------------------------------
// Baked figures (tmp/tlb-2-*.json). Floats are double; Arb enclosures are quoted as strings.
// ---------------------------------------------------------------------------------------------
const COEFF_HEAD = Object.freeze([
  // [n, c_DH(n), Re c_chi(n) = Lambda(n) Re chi(n)]
  [2, 0.196908588294, 0], [3, -0.312092728516, 0], [4, -1.442231964606, -0.69314718056], [5, 0, 0],
  [6, 1.936356076621, 0], [7, 0.552792294543, 0], [8, 0.015890700913, 0], [9, -2.285883581243, -1.098612288668],
  [10, 0, 0], [11, 2.397895272798, 2.397895272798], [12, -0.762877471988, 0], [13, -0.728648360967, 0],
  [14, -2.852031639578, 0], [15, 0, 0], [16, 1.381780145999, 0.69314718056], [17, 0.804856537775, 0],
  [18, 0.887357076355, 0], [19, -2.944438979166, -2.944438979166], [20, 0, 0], [21, 3.290218148106, 0],
  [22, 0, 0], [23, -0.890728198828, 0], [24, 0.277169321418, 0], [25, 0, 0], [26, 3.521027871187, 0],
  [27, -0.025186165058, 0], [28, 1.023001710381, 0], [29, -3.367295829986, -3.367295829986],
]);

export const TLB_DH_BLIND = Object.freeze({
  id: 'tlb-dh-blind-2026-09-28',
  supersedesDraft: 'rh-tlb-2-dh-euler-blindness-radius-2026-09-28 (unrefereed draft, removed)',
  date: '2026-09-28',
  title: 'DH-BLIND: certified Euler-blindness radius of the Davenport–Heilbronn twin',
  status:
    'PROVED W_DH ≥ 0 for 2a ≤ 0.78306 (closed-form Arb bound B(a) − β/2 > 0). CERTIFIED a*_DH ≤ 1.72 (explicit rational g0, '
    + 'W/‖g0‖² = −8.0474645199628e-30, reproduced independently twice). MEASURED: λ_min(W_DH) ≈ 0.21 at 2a = ln 3 (not certified), '
    + 'so a*_DH > (ln 3)/2 is decided on measured evidence only; exact Rayleigh–Ritz gives λ_min > 0 for a ≤ 1.70 with N ≤ 122, '
    + 'a = 1.71 basis-unsettled. Λ unaffected (PT Λ ≤ 0.2 accepted benchmark; project candidate Λ ≤ 0.1758354 not yet '
    + 'peer-reviewed; Rodgers–Tao Λ ≥ 0). NO QED.',
  verdict:
    'SUCCESS with scope corrections: at conductor 5, Weil positivity at support 2a ≤ 0.783 is PROVED Euler-blind (the RH-false '
    + 'same-bridge F_DH passes it); up to 2a ≤ ln 3 this is MEASURED with margin 0.21; the first certified failure is at a = 1.72, '
    + 'caused by the off-line zero 0.8085+85.699i. Quantifies the known qualitative DH remark in NS-RIGID (d) and Route C. The ζ '
    + 'transfer is an analogy. No new Lambda bound. No refereed bound is changed. NO QED.',
  twinLadderLink: {
    glossaryTerm: 'Davenport–Heilbronn twin (same-bridge, no-cascade)',
    reading:
      'Same bridge factor (5/π)^{s/2}Γ((s+1)/2) as L(s,χ), lossless (|bridge| = 1) on σ = 1/2, root number 1, but the '
      + 'direct arm is a two-character superposition with no Euler product (no T_p cascade). The bridge alone therefore '
      + 'fixes the archimedean part of the Weil form (identical Ω(t) for both functions); everything that distinguishes '
      + 'the twin from the Euler arm sits in the coefficients c(n) of −F\'/F.',
  },
  setup: {
    kappa: KAPPA,
    kappaDecimal: '0.284079043840412296028291832393',
    aPeriodic: '(a(1..5)) = (1, κ, −κ, −1, 0)',
    completedFunction: 'Λ_F(s) = (5/π)^{s/2} Γ((s+1)/2) F(s) = Λ_F(1−s) (root number 1, checked to 1e-30 at s = 0.3+7.1i)',
    explicitFormula:
      'Σ_ρ ĝ(γ_ρ) = (1/2π)∫Ω(t)ĝ(t)dt − 2Σ_n c(n) n^{−1/2} g(log n) for even g (ρ = 1/2 + iγ, all zeros incl. off-line). '
      + 'Derivation: contour integral of Λ_F\'/Λ_F·h over the rectangle Re s ∈ [1−c, c] with c beyond every zero and '
      + 'beyond the absolute-convergence abscissa of −F\'/F (h(s) = ∫g(x)e^{(s−1/2)x}dx is entire and decays faster than '
      + 'any power on vertical strips); the left edge is mapped to the right by Λ_F(s) = Λ_F(1−s), giving h(s)+h(1−s) = 2h(s) '
      + 'for even g; F has real coefficients (F̄ = F), so no Re/conj pairing is needed for F_DH. For L(s,χ) (non-self-dual) '
      + 'the same derivation pairs c(n) with conj c(n) and the even-g form carries Re c(n) = Λ(n) Re χ(n).',
    xSpaceForm:
      'W(g) = ‖g‖²[log(5/π) + ψ(3/4) + τ(a)] + ∫_0^{2a} k(x)(G(0) − G(x))dx − 2Σ c(n) n^{−1/2} G(log n), '
      + 'G = g∗g, k(x) = e^{−x/2}/sinh x, τ(a) = ∫_{2a}^∞ k; from ψ(z) = −γ + ∫_0^∞(e^{−u} − e^{−zu})/(1−e^{−u})du. '
      + 'Cross-checked against the Fourier side to 3e-12 (tmp/tlb-2-weil.py check).',
    omegaAtZero: -0.621152853202,
  },
  coefficients: {
    head: COEFF_HEAD,
    eulerArmCheck: 'c for L(s,χ) from the same recursion equals Λ(n)χ(n) to 2.8e-30 for n ≤ 3000 (mpmath, 30 digits)',
    vanishOnMultiplesOf5: true,
    growthMaxAbs: [[10, 100, 5.9477], [100, 1000, 18.452], [1000, 10000, 74.858], [10000, 20000, 157.80]],
    reading: 'c_DH(n) is real (F_DH has real coefficients); it differs from Re c_χ(n) already at n = 2 (κ ln 2 vs 0) and '
      + 'n = 3 (−κ ln 3 vs 0), and is non-zero on non-prime-powers (n = 6, 12, 14, …), which an Euler product forbids.',
  },
  zeros: {
    height: 130,
    totalArgumentPrinciple: 75,
    onLine: 71,
    offLinePairs: 2,
    offLineSigmaGtHalf: [[0.808517182456637, 85.6993484853776], [0.650830080609737, 114.163342730757]],
    countSigmaGt1: 0,
    firstOnLine: [5.09416, 8.939914, 12.133545, 14.404003, 17.130239, 19.3088],
    method: 'Hardy-type Z(t) = e^{iθ(t)}F(1/2+it) real (max rel. imaginary part 3.6e-28), sign changes step 0.05 + Anderson '
      + 'refinement; total count N(130) = [θ(130) + arg F(1/2+130i)]/π with arg tracked from σ = 3; rectangle counts '
      + '[0.52,3]×[0.5,130] = 2 and [1,3]×[0.5,130] = 0; Newton on F for the off-line pair members.',
  },
  validation: {
    tolerance: 1e-8,
    rows: [
      { test: 'Gaussian s=0.5', zeroSide: 0.0979111427510886, residual: 1.2e-32, offLineContribution: 0 },
      { test: 'Gaussian s=0.5 modulated cos(85.7x)', zeroSide: 4.384995912131484, residual: 2.3e-30, offLineContribution: 2.5366297639 },
      { test: 'Gaussian s=0.7 modulated cos(114.16x)', zeroSide: 4.906784057168864, residual: -4.5e-29, offLineContribution: 3.5288840275 },
      { test: 'bump (1−x²/A²)^8, A=1.5 (compact; n ≤ 4)', zeroSide: 0.3344282460142205, residual: -1.13e-13, offLineContribution: 4.3e-13, zeroTailBound: 4.34e-12 },
      { test: 'bump (1−x²/A²)^8, A=3 (compact; n ≤ 20)', zeroSide: -0.002724274519113132, residual: -9.8e-16, offLineContribution: -2.6e-14, zeroTailBound: 1.7e-14 },
    ],
    archimedeanTwoWays: 'Fourier-side ∫Ω ĝ and x-space kernel form agree to ≤ 5e-28 on all five rows',
    reading: 'The modulated rows put O(1) weight on the off-line zeros (2.54 and 3.53); dropping those zeros breaks the '
      + 'identity by that amount, so the off-line zeros and the normalisation are both confirmed.',
  },
  tiers: {
    proved: [
      'For 2a < ln 2 the arithmetic sides of F_DH and L(s,χ) are empty (first rung n = 2), so W_DH = W_χ = Q (archimedean only).',
      'Q(g) ≥ B(a)‖g‖², B(a) = log(5/π) + ψ(3/4) + τ(a) + a·k(2a): uses G(0) − G(x) ≥ 0, k decreasing, and (∫g)² ≤ 2a‖g‖². '
        + 'Arb: B(0.3455) = 0.239924820562567 ± 2e-16 (2a = 0.691 < ln 2); B > 0 for a ≤ 0.469248 (2a ≤ 0.93850). '
        + 'Hence the Euler-arm form is unconditionally ≥ 0 for 2a ≤ 0.93850 (its arithmetic side is empty for 2a < ln 4).',
      'For ln 2 ≤ 2a and a < ln 2: W_DH(g) = Q(g) − β G(ln 2), β = √2 κ ln 2 = 0.278470796113, |G(ln 2)| ≤ ‖g‖²/2 (the two '
        + 'overlap windows are disjoint), so W_DH ≥ (B(a) − β/2)‖g‖² > 0 for a ≤ 0.391530 (2a ≤ 0.78306).',
    ],
    certified: [
      'W_DH(g0) < 0 for explicit rational g0 = Σ q_k C^{(13/2)}_{2k}(x/A)(1 − x²/A²)^3 (q_k, A rational): exact rational '
        + 'autocorrelation G = g0∗g0, archimedean integral as Σ_m 2∫_0^{2A} e^{−(2m+3/2)x}(G(0)−G(x))dx (exact moments for '
        + 'm < 1000, Hurwitz-ζ closed form plus a rigorous remainder bound for m ≥ 1000), prime side with ball c(n); Arb 4000–6000 bits.',
    ],
    measured: [
      'λ_min of the Weil matrix (orthonormal Gegenbauer-weighted even basis, Gram = I) on a ∈ [0.3, 4] for DH, L(s,χ), archimedean-only.',
      'Exact Rayleigh–Ritz on the double-precision near-null subspace (tmp/tlb-2-refine.py) to resolve |λ| below the 3e-13 floor.',
    ],
    heuristic: [
      'Landau-count estimate: an off-line zero at height γ becomes visible once the even Paley–Wiener dimension a·Ω/π exceeds '
        + 'the zero count (Ω/2π)log(qΩ/2πe), i.e. a ≳ ½ log(qγ/2πe): 1.611 for γ₁ = 85.70 (certified a*_DH ≤ 1.72; finite-basis positivity through 1.70).',
      'ζ analogy (heuristic only): the same count suggests Weil positivity at support 2a can only register an off-line zero '
        + 'below height ≈ 2πe·e^{2a}/q; Route I supports 2a ≤ ln 3 sit far below any height not already verified on-line.',
    ],
  },
  lowerBound: {
    aArchPositiveProved: 0.469248653145,
    twoAArchPositiveProved: 0.938497306291,
    aDHPositiveProved: 0.391529569078,
    twoADHPositiveProved: 0.783059138156,
    beta: 0.278470796113,
    B_at_03455: 0.239924820562567,
    measuredArchOnlyZeroCrossing: [0.8, 0.9], // λ_min(Q) = +0.0347 at 0.8, −0.0378 at 0.9
  },
  certificates: [
    { A: '43/25', a: 1.72, N: 106, degG0: 216, WoverNorm: -8.04746451996276e-30, rad: 2.8e-42, route: 'exact full-basis Rayleigh–Ritz (106×106 exact Weil matrix, mpmath 110 digits), re-verified independently at 7000 bits / 1500 direct terms: [−8.0474645199627598811e-30 ± 4.1e-50]' },
    // A, basis size, deg g0, W(g0)/‖g0‖² Arb midpoint and radius, source
    { A: '87/50', a: 1.74, N: 107, degG0: 218, WoverNorm: -1.80781641371684e-23, rad: 3.6e-38, route: 'exact near-null Rayleigh–Ritz (d=4), re-verified independently at 6000 bits / 1500 direct terms: [−1.8078164137168435838e-23 ± 4.1e-44]' },
    { A: '44/25', a: 1.76, N: 108, degG0: 220, WoverNorm: -1.62829254957118e-18, rad: 1.8e-33, route: 'exact near-null Rayleigh–Ritz (d=4)' },
    { A: '89/50', a: 1.78, N: 145, degG0: 294, WoverNorm: -5.470668450705124e-11, rad: 4.3e-31, route: 'double eigenvector rounded to dyadic rationals' },
    { A: '9/5', a: 1.8, N: 146, degG0: 296, WoverNorm: -2.66284745891492e-7, rad: 8.7e-28, route: 'double eigenvector rounded to dyadic rationals' },
    { A: '2', a: 2.0, N: 80, degG0: 164, WoverNorm: -0.5729577781750873, rad: 3.9e-21, route: 'double eigenvector rounded to dyadic rationals' },
  ],
  certifiedUpperBound: 1.72,
  measured: {
    gridSelected: [
      // a, lamDH (w=140), lamCH (w=140), lamARCH (w=140)
      [0.3, 0.7793, 0.7793, 0.7793], [0.3466, 0.6573, 0.6573, 0.6573], [0.5, 0.3004, 0.3642, 0.3642],
      [0.5493, 0.2098, 0.2935, 0.2935], [0.6931, 0.04148, 0.1285, 0.1285], [0.8, 6.666e-3, 6.633e-2, 3.444e-2],
      [1.0, 3.497e-5, 1.503e-2, -9.896e-2], [1.2, 7.484e-9, 9.840e-4, -0.1952], [1.3, 2.382e-11, 2.217e-4, -0.2337],
      [1.4, 1.9e-13, 4.392e-5, -0.2672], [1.6, -2.2e-13, 6.997e-7, -0.3225], [1.7, -1.6e-14, 7.006e-8, -0.3455],
      [1.8, -2.663e-7, 4.722e-9, -0.3660], [1.9, -0.2682, 1.728e-10, -0.3843], [2.0, -0.7082, 7.6e-12, -0.4007],
      [2.5, -1.857, 3.3e-13, -0.4621], [3.0, -3.695, 2.6e-14, -0.5012], [4.0, -10.66, -4.4e-13, -0.5462],
    ],
    doublePrecisionFloor: 3e-13,
    eulerArmMinOverGrid: { w100: -7.597577557240198e-13, w140: -5.084484978312995e-13 },
    basisConvergence: 'λ_min(DH) at a = 1.80: −2.513e-7 / −2.663e-7 / −2.684e-7 for 110 / 146 / 182 functions; at a = 1.78: −4.85e-11 / −5.48e-11 / −5.57e-11',
    exactSubspace: [
      // a, basis N, near-null dim d, lowest exact eigenvalue of W on that subspace
      [1.6, 100, 3, 4.854e-23], [1.62, 101, 3, 9.019e-24], [1.64, 102, 3, 5.348e-23], [1.66, 103, 3, 8.109e-23],
      [1.68, 104, 3, 1.048e-22], [1.7, 105, 4, 1.334e-26], [1.72, 106, 4, 1.356e-25], [1.73, 142, 4, 1.578e-25],
      [1.74, 107, 4, -1.808e-23], [1.74, 142, 4, -8.288e-26], [1.76, 108, 4, -1.628e-18],
    ],
    exactSubspaceCaveat: 'Positive subspace minima at a ≤ 1.73 are not a proof of positivity: the float near-null subspace '
      + 'couples to its complement at ~1e-13. Confirmed at a = 1.72: subspace minimum +1.36e-25, full exact basis −8.05e-30.',
    exactFullBasis: [
      // a, N (w=100), lowest eigenvalue of the exact N×N Weil matrix (Arb 6000 bits -> mpmath 110 digits, Gram-normalised)
      [1.5, 95, 3.03748867e-18], [1.6, 100, 4.78496998e-23], [1.65, 103, 8.54010831e-26], [1.7, 105, 1.06187949e-28],
      [1.71, 106, 4.44838135e-30], [1.72, 106, -8.04746452e-30],
      [1.7, 122, 9.86999878e-29], [1.71, 123, 3.01428166e-30], // w=120 basis-size check
    ],
    exactFullBasisReading: 'Within each basis the minimum is exact (a Rayleigh–Ritz upper bound on the true infimum). It '
      + 'decays super-exponentially toward the onset; larger bases can only lower it, so the true a*_DH may lie below 1.71 (N 105→122 lowers λ_min(1.70) by 7%, N 106→123 lowers λ_min(1.71) by 32%). '
      + 'REFEREE CORRECTION: the lower end of the onset is NOT converged; only a*_DH ≤ 1.72 is established, λ_min > 0 at a ≤ 1.70 for N ≤ 122, a = 1.71 unsettled.',
    eulerArmExactSubspace: [[2.5, 2, 8.595e-20], [3.0, 5, 6.375e-26]], // a=3 at 9000 bits (4000 bits left the sign unresolved)
    onsetReading: { certifiedUpper: 1.72, positiveInFiniteBasisThrough: 1.70, basisUnsettled: 1.71, converged: false },
    lambdaMinAtLn3RefereeIndependent: [0.2212, 0.2124, 0.2132], // referee bases (Legendre nb=10/20; Legendre x (1-x^2/a^2)^2 M=18), trending to 0.2098
  },
  attribution: {
    zeroSide: [
      // A, off-line term of ρ₁ = 0.8085+85.699i, on-line sum (t < 130), second off-line term (114.16)
      ['87/50', -3.1155e-22, 2.9005e-22, -8.2e-25], ['89/50', -5.0117e-9, 4.9250e-9, -4.4e-12],
      ['9/5', -5.7469e-6, 5.4169e-6, -3.1e-9], ['2', -0.94886, 0.33901, 0.00258],
    ],
    zeroSideReading: 'Every certified negative direction is carried by the first off-line zero ρ₁: 4 Re ĝ(γ₁)² is negative '
      + 'and exceeds the whole on-line sum below t = 130; the second off-line zero contributes < 0.3%. The remainder is the '
      + 'positive contribution of zeros above t = 130.',
    forwardHybridOnset: [
      // N: smallest a (grid 0.025, w=60, resolved |λ| > 1e-10) where c = c_DH (n ≤ N), Re c_χ (n > N) turns negative
      [2, 0.7], [3, 0.775], [4, 1.025], [6, 1.1], [7, 1.125], [9, 1.275], [12, 1.325], [14, 1.425], [16, 1.45],
      [19, 1.55], [23, 1.625], [26, 1.7], [28, 1.775], [34, 1.8], [44, 1.9], [54, 2.0],
    ],
    singleRungSwapOnset: [
      // n: smallest a where c = Re c_χ except c(n) := c_DH(n) turns negative
      [2, 0.7], [6, 0.975], [7, 1.1], [4, 1.3], [8, 1.325], [9, 1.35], [3, 1.425], [14, 1.45], [12, 1.475],
    ],
    plainTruncationNote: 'The plan\'s plain truncation (c_DH for n ≤ N, 0 beyond) is uninformative at a ≈ a*_DH: the '
      + 'archimedean-only form is already negative for a ≳ 0.85 (λ_min(Q) = −0.366 at a = 1.8), so truncated forms are '
      + 'negative for small N irrespective of the coefficients. Hybrids with the Euler-arm tail are used instead.',
    c2PositivityIntervalAtLn3: { a: 0.549306, interval: [-2.920238, 0.637232], eulerArm: 0, dh: 0.196908588294 },
    reading: 'No single rung triggers the DH sign change. The first Euler-sensitive rung is n = 2 (c_DH(2) = κ ln 2 vs 0): '
      + 'replacing only c(2) in the Euler arm is detected at a ≈ 0.70 (2a ≈ 1.40 > ln 3). Each longer DH head with an '
      + 'Euler-arm tail is detected later (onset rises from 0.70 at N = 2 to 1.80 at N = 34); the full, functional-equation-'
      + 'consistent DH sequence stays positive in finite bases through a ≈ 1.70 (certified negative at 1.72), where the off-line zero ρ₁ becomes resolvable. At 2a = ln 3 '
      + 'the form reads only c(2), and every c(2) in [−2.92, 0.637] passes, including both 0 (Euler arm) and κ ln 2 (DH).',
  },
  decision: {
    branch: 'a*_DH > (ln 3)/2',
    aStarProvedLower: 0.391529569078,
    aStarCertifiedUpper: 1.72,
    aStarMeasuredBasisLimited: 1.71, // finite-basis Rayleigh–Ritz reading (N ≤ 123), not converged; can only move down
    aStarLandauHeuristic: 1.611,
    routeIHalfSupport: LN3 / 2,
    wording:
      'Euler-blindness at conductor 5: the Weil form of the RH-false same-bridge function F_DH is positive semi-definite for '
      + 'every support 2a ≤ 0.78306 (PROVED) and, on measured evidence, through 2a = ln 3 (λ_min = 0.2098) and in finite bases up to '
      + 'a ≈ 1.70 (2a ≈ 3.4; basis-limited). A positivity certificate of Route I type at 2a ≤ 0.783 is therefore provably satisfied by '
      + 'a function with off-line zeros, and at 2a ≤ ln 3 measurably so; such a certificate cannot by itself encode the Euler '
      + 'product. This quantifies the qualitative DH remark of NS-RIGID (d) / Route C. The transfer to ζ (q = 1, Route I '
      + '2a ≤ ln 3 / 0.9) is an analogy, not a theorem. No bound on Λ moves. NO QED.',
    novelty: 'Qualitative content known (Davenport–Heilbronn 1936; NS-RIGID (d); Route C). New: proved radius 0.78306, certified '
      + 'a*_DH ≤ 1.72 with explicit rational witness, measured margin 0.21 at ln 3, c(2) positivity interval, hybrid attribution.',
  },
  scripts: [
    'tmp/tlb-2-zeros-validate.py', 'tmp/tlb-2-weil.py', 'tmp/tlb-2-certify.py', 'tmp/tlb-2-refine.py',
    'tmp/tlb-2-verify-coeffs.py', 'tmp/tlb-2-exactfull.py', 'tmp/tlb-2-attrib.py', 'tmp/tlb-2-lowerbound.py',
    'tmp/tlb-2-c2interval.py', 'tmp/tlb-2-zeroside.py',
  ],
});

export const TLB_DH_BLIND_ASSERTIONS = Object.freeze([
  {
    id: 'tlb2-kappa-closed-form',
    holds: () => Math.abs(KAPPA - 0.2840790438404123) < 1e-15 && Math.abs(TLB_DH_BLIND.setup.kappa - KAPPA) < 1e-15,
    why: 'κ = (√(10−2√5)−2)/(√5−1) = 0.28407904384041 (the value that gives root number 1 for the mixed function).',
  },
  {
    id: 'tlb2-cDH-recursion-reproduces-baked-head',
    holds: () => {
      const c = logDerivCoeffs(A_PERIODIC, 29);
      return COEFF_HEAD.every(([n, cd]) => Math.abs(c[n] - cd) < 5e-12);
    },
    why: 'c_DH(n) for n ≤ 29 recomputed from a(n) log n = Σ_{d|n} c(d) a(n/d) with a = (1, κ, −κ, −1, 0) mod 5.',
  },
  {
    id: 'tlb2-euler-arm-recursion-is-vonmangoldt-times-re-chi',
    holds: () => {
      // complex recursion for chi, then compare Re c with Lambda(n) Re chi(n)
      const chiRe = [0, 1, 0, 0, -1], chiIm = [0, 0, 1, -1, 0], N = 200;
      const cr = new Array(N + 1).fill(0), ci = new Array(N + 1).fill(0);
      for (let n = 2; n <= N; n++) {
        let sr = chiRe[n % 5] * Math.log(n), si = chiIm[n % 5] * Math.log(n);
        for (let d = 2; d < n; d++) if (n % d === 0) {
          const ar = chiRe[(n / d) % 5], ai = chiIm[(n / d) % 5];
          sr -= cr[d] * ar - ci[d] * ai; si -= cr[d] * ai + ci[d] * ar;
        }
        cr[n] = sr; ci[n] = si;
      }
      let ok = true;
      for (let n = 2; n <= N; n++) ok = ok && Math.abs(cr[n] - vonMangoldt(n) * RE_CHI[n % 5]) < 1e-9;
      return ok && COEFF_HEAD.every(([n, , ce]) => Math.abs(ce - vonMangoldt(n) * RE_CHI[n % 5]) < 1e-9);
    },
    why: 'The Euler arm L(s,χ) has c(n) = Λ(n)χ(n), so its even-g Weil form carries Re c(n) = Λ(n) Re χ(n) (zero at n = 2, 3).',
  },
  {
    id: 'tlb2-zero-count-consistent',
    holds: () => {
      const z = TLB_DH_BLIND.zeros;
      return z.onLine + 2 * z.offLinePairs === z.totalArgumentPrinciple && z.countSigmaGt1 === 0
        && Math.abs(z.offLineSigmaGtHalf[0][0] - 0.8085171825) < 1e-9 && Math.abs(z.offLineSigmaGtHalf[0][1] - 85.6993484854) < 1e-9;
    },
    why: 'N(130) = 75 = 71 on-line + 2 mirrored off-line pairs; none with σ > 1 below t = 130; ρ₁ matches Spira (1994).',
  },
  {
    id: 'tlb2-explicit-formula-validated-1e-8',
    holds: () => {
      const r = TLB_DH_BLIND.validation.rows;
      return r.length >= 3 && r.every((x) => Math.abs(x.residual) <= 1e-8)
        && r.filter((x) => Math.abs(x.offLineContribution) > 1).length >= 2;
    },
    why: 'Five test functions (three Gaussian-type, two compact bumps) close the explicit formula to ≤ 1.2e-13, two of them with O(1) off-line weight.',
  },
  {
    id: 'tlb2-proved-lower-bound-recomputed',
    holds: () => {
      const lb = TLB_DH_BLIND.lowerBound;
      const b1 = archLowerBound(0.3455), b2 = archLowerBound(lb.aDHPositiveProved - 1e-9) - lb.beta / 2;
      const b3 = archLowerBound(lb.aArchPositiveProved - 1e-9);
      const betaJs = Math.SQRT2 * KAPPA * LN2;
      return Math.abs(b1 - lb.B_at_03455) < 1e-12 && b2 > -1e-11 && b3 > -1e-11 && Math.abs(betaJs - lb.beta) < 1e-11
        && 2 * 0.3455 < LN2 && 2 * lb.aDHPositiveProved > LN2 && 2 * lb.aDHPositiveProved < LN3;
    },
    why: 'B(a) = log(5/π)+ψ(3/4)+τ(a)+a k(2a) recomputed in double: B(0.3455) = 0.23992 > 0 (2a < ln 2) and B − β/2 ≥ 0 up to 2a = 0.78306 (past ln 2, short of ln 3). Arb enclosures in tmp/tlb-2-lowerbound.json.',
  },
  {
    id: 'tlb2-certificates-negative-and-ordered',
    holds: () => {
      const cs = TLB_DH_BLIND.certificates;
      const allNeg = cs.every((c) => c.WoverNorm + c.rad < 0);
      const best = Math.min(...cs.map((c) => c.a));
      return allNeg && best === TLB_DH_BLIND.certifiedUpperBound && best > LN3 / 2;
    },
    why: 'Each certified W_DH(g0)/‖g0‖² has upper endpoint < 0; the smallest certified support A = 1.72 bounds a*_DH ≤ 1.72.',
  },
  {
    id: 'tlb2-euler-arm-psd-on-grid-bug-flag',
    holds: () => {
      const m = TLB_DH_BLIND.measured;
      return m.eulerArmMinOverGrid.w100 > -1e-12 && m.eulerArmMinOverGrid.w140 > -1e-12
        && m.eulerArmExactSubspace.every(([, , l]) => l >= 0) && m.gridSelected.every(([, , ch]) => ch > -1e-12);
    },
    why: 'The Euler-arm form stays ≥ −7.6e-13 (double floor) on a ∈ [0.3, 4] and ≥ 0 in exact near-null checks: no bug flag.',
  },
  {
    id: 'tlb2-attribution-first-offline-zero',
    holds: () => TLB_DH_BLIND.attribution.zeroSide.every(([, off1, on, off2]) => off1 < 0 && -off1 > on && Math.abs(off2) < 0.01 * Math.abs(off1)),
    why: 'For every certified direction, the ρ₁ = 0.8085+85.699i term is negative and larger than the on-line sum below t = 130.',
  },
  {
    id: 'tlb2-decision-branch',
    holds: () => {
      const d = TLB_DH_BLIND.decision;
      return d.aStarProvedLower < d.routeIHalfSupport && d.routeIHalfSupport < d.aStarMeasuredBasisLimited
        && d.aStarMeasuredBasisLimited <= d.aStarCertifiedUpper && d.aStarLandauHeuristic < d.aStarMeasuredBasisLimited
        && d.branch === 'a*_DH > (ln 3)/2' && /NO QED/.test(d.wording) && /analogy/.test(d.wording) && /PROVED/.test(d.wording)
        && /measured/.test(d.wording) && TLB_DH_BLIND.measured.onsetReading.converged === false
        && TLB_DH_BLIND.measured.gridSelected.find(([a]) => Math.abs(a - 0.5493) < 1e-3)[1] > 0.2
        && TLB_DH_BLIND.measured.lambdaMinAtLn3RefereeIndependent.every((x) => x > 0.2);
    },
    why: 'Ordering proved-lower 0.3915 < (ln 3)/2 = 0.5493 < basis-limited reading 1.71 ≤ certified 1.72; λ_min(DH) = 0.2098 at 2a = ln 3 (measured; referees 0.212–0.213).',
  },
  {
    id: 'tlb2-honest-scope',
    holds: () => {
      const m = TLB_DH_BLIND;
      return /refereed bound is changed/i.test(m.verdict) && /NO QED/.test(m.verdict) && /NO QED/.test(m.status)
        && /measured evidence only/.test(m.status) && /No new Lambda bound/.test(m.verdict) && /NS-RIGID/.test(m.decision.novelty)
        && !/DECIDED/.test(m.status);
    },
    why: 'Referee corrections: Euler-blindness at 2a ≤ ln 3 is measured past 0.783, onset lower end not converged, novelty is quantitative only.',
  },
]);

export default TLB_DH_BLIND;
