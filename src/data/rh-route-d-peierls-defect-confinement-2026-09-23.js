/**
 * @fileoverview RH novel Route D (roadmap rh-novel-routes-roadmap-2026-09-23, key 'D'):
 * PEIERLS DOMAIN-WALL CONFINEMENT of the zero log-gas — first test executed.
 *
 * FRAME. An off-line zero ρ = ½+δ+it (δ = σ−½ ≠ 0) is a "defect"; the functional
 * equation + conjugation force the mirror quadruple Q(δ) = {½±δ±it}. In γ-coordinates
 * (ρ = ½+iγ) the quadruple is {±t ± iδ}. Q(δ) is INVARIANT under δ ↦ −δ, so every
 * defect free energy F(δ) is EVEN in δ; the roadmap's "prime-field cost odd in δ"
 * applies to the FORCE dF/dδ, not to F. As δ → 0 the quadruple degenerates to a
 * DOUBLE zero at ½±it: a simple on-line zero cannot leave the line by itself; leaving
 * requires two on-line zeros to collide and split off. So the correct competitor of the
 * off-line pair at ±δ (perpendicular split) is the on-line pair at heights t±δ (along-line
 * split of the same double zero).
 *
 * THREE CANDIDATE F(δ), each written out and computed:
 *
 * (1) PURE 2D-COULOMB (log-gas) ENERGY, E = −Σ_{i<j} log|ρ_i−ρ_j| over the zeros of ξ
 *     (Hadamard: log|ξ(s)| is exactly the potential of unit charges at the zeros; there is
 *     NO separate external field — the primes are the VALUE of this same potential for σ>1,
 *     log|ξ(s)| = log|Γ-factor| + Re Σ_{p,k} p^{−ks}/k, not an extra source).
 *     Perpendicular vs along-line split of the doubled k-th zero, other zeros fixed:
 *       F_C(δ) := E_perp(δ) − E_along(δ)
 *               = Σ_{γ'≠γ_k, γ'>0} [ log(|u₋²−δ²|/(u₋²+δ²)) + log(|u₊²−δ²|/(u₊²+δ²)) ]
 *                 + log((t²−δ²)/(t²+δ²)),     u∓ = t ∓ γ',  t = γ_k
 *     (the intra-pair terms −log 2δ are identical in both splits and cancel; the last term
 *     is the pair's own conjugate image). EVERY summand is < 0 since |u²−δ²| < u²+δ² for
 *     uδ ≠ 0 — an elementary inequality, no arithmetic. Hence F_C(δ) < 0 for all δ > 0 and
 *       F_C''(0) = −4·S(t) < 0,   S(t) = Σ_{γ'≠γ_k} [1/(t−γ')² + 1/(t+γ')²] + 1/t².
 *     Also E_perp(δ) alone is strictly DECREASING in δ (all pairwise distances grow with δ).
 *     Structural reason: the potential is harmonic off the charges (Earnshaw): a critical
 *     point that is stable along the line is unstable perpendicular to it. So the Coulomb
 *     self-energy is ANTI-confining, and no electrostatic "prime field" can fix it because
 *     the prime field IS the same harmonic potential.
 *
 * (2) WEIL-PROBE FUNCTIONAL. For a test function h (even, real-analytic), the zero side
 *     of the explicit formula changes under the split by
 *       F_h(δ) = 2[h(t+iδ)+h(t−iδ)] − 4h(t) = −2δ²h''(t) + (δ⁴/6)h''''(t) − …,
 *     equivalently (h = ĝ) F_h(δ) = 4∫ g(x)(cosh δx − 1)cos(tx)dx, F_h''(0) = 4∫x²g(x)cos(tx)dx.
 *     For a Gaussian probe centred at the defect, F_h(δ) = 4(e^{δ²/2σ²}−1), F_h''(0) = 4/σ² > 0.
 *     This positivity is PROBE GEOMETRY (an analytic function with a real local maximum grows
 *     in the imaginary direction — the same harmonic saddle as (1), seen from the probe), NOT
 *     Weil positivity. Weil's form is Σ_ρ ĝ(ρ) over the ACTUAL zeros = prime side; it is fixed
 *     by the primes and does not move when a hypothetical zero moves. So F_h''(0) ≥ 0 is not
 *     the Weil form; the arithmetic enters only through the CONSTRAINT that Σ_ρ h(γ_ρ) equals
 *     the prime side. No canonical F exists: sign(F_h''(0)) = −sign(h''(t)) is a choice.
 *
 * (3) EXPLICIT-FORMULA BUDGET (the only version with arithmetic content). Take
 *       h(r) = e^{−(r−t)²/2σ²} + e^{−(r+t)²/2σ²}   (Bombieri normalisation, as in
 *       src/math/weil-explicit-formula-opt.js):
 *       Σ_γ h(γ) = A_σ(t) + P_σ(t),
 *       A_σ(t) = h(i/2)+h(−i/2) + (1/2π)∫h(r)[Re ψ(¼+ir/2) − log π]dr   (archimedean/density),
 *       P_σ(t) = −2σ√(2/π) Σ_n Λ(n) n^{−1/2} e^{−σ²log²n/2} cos(t log n)  (primes).
 *     Define the prime-computable local budget R_σ(t) := ½[A_σ(t)+P_σ(t)]. If all zeros lie on
 *     the line, R_σ(t) = Σ_{γ>0} e^{−(γ−t)²/2σ²} (Gaussian-smoothed zero mass at t). A lone
 *     quadruple centred at t contributes 2e^{δ²/2σ²} to R_σ(t); with the other zeros near t
 *     on the line (each contributing ≥ 0) this gives the confinement radius
 *       δ ≤ δ_max(t;σ) := σ√(2 log(R_σ(t)/2))   if R_σ(t) > 2,
 *       and NO lone quadruple (nor double zero) centred at t if R_σ(t) < 2.
 *     Unconditional form (removes the lone-defect hypothesis by σ → 0): pick an off-line
 *     quadruple maximising δ over a unit height window; its own term 2e^{δ₀²/2σ²} dominates all
 *     others as σ → 0 (others are ≤ 2e^{(δ_j²−u_j²)/2σ²} with δ_j²−u_j² < δ₀², and the far tail is
 *     summable by N(T) ≪ T log T). Hence
 *       RH  ⟺  for every t, R_σ(t) stays bounded as σ → 0⁺
 *     (under RH, R_σ(t) ↑ in σ and → multiplicity(t) ≤ R_1(t)); RH + simple zeros ⟺
 *     liminf_{σ→0} R_σ(t) < 2 for every t. This is Weil's criterion restricted to Gaussian
 *     probes — a REFORMULATION, not a new lever: R_σ(t) bounded as σ → 0 needs the prime sum
 *     Σ_{n≲e^{1/2σ²}} Λ(n)n^{−1/2−it} to cancel to O(1) — partial-sum cancellation ⟺ RH again.
 *     WORST-CASE budget: B(σ) := 2σ√(2/π) Σ_n Λ(n)n^{−1/2}e^{−σ²log²n/2} → 4e^{1/8σ²} as σ → 0
 *     (PNT + Gaussian integral). Since the quadruple costs 4e^{δ²/2σ²} on the same side,
 *     4e^{δ²/2σ²} ≤ 4e^{1/8σ²} ⟺ δ ≤ ½ AT EVERY RESOLUTION: without phase cancellation in
 *     cos(t log n) the Peierls budget reproduces exactly the trivial strip. All confinement
 *     below ½ is the arithmetic cancellation at height t — the whole difficulty, unchanged.
 *
 * NUMERICS (this module; scratch tmp/route-d-peierls-scratch.py, mpmath zeros + numpy sieve
 * of Λ(n) to 3·10⁷, ~1 min): (1) F_C''(0) = −4S < 0 and F_C(δ) < 0 decreasing at
 * k = 1,2,3,10,30,100,200. (3) Explicit formula validated against the first 260 zeros to
 * |diff| ≤ 3e-14 (σ ≥ 0.5) and ≤ 6e-9 (σ = 0.4, prime truncation 2.5e-7 tail). R_σ(γ₁) = 1.0000
 * at all σ (the lone zero contributes exactly 1). Lone-defect exclusion (R < 2) holds at 100% of
 * grid points on [50,150] for σ ∈ {1, .7, .5, .4}; on [10⁴, 10⁴+50] it degrades to 1%/46%/92%/98%
 * because the density term D = ½A_σ ≈ (σ/√2π)log(t/2π) grows: at σ = 1 the budget stops
 * confining below ½ at t ≳ 3000 (δ_max = 0.57) — the bound is NOT uniform in height at fixed σ;
 * keeping it needs σ ≲ spacing ~ 2π/log t, i.e. primes up to t^{O(1)} (Riemann–Siegel-scale work),
 * and the binding scale becomes the local zero gap (Lehmer pairs = near-violations, R ≈ 2).
 * B(σ)/(4e^{1/8σ²}) = 0.472, 0.622, 0.761, 0.845 for σ = 1, .7, .5, .4 (→ 1).
 * All heights computed are inside the numerically verified RH range; the radii are a test of the
 * machinery's power, not new information about ζ.
 *
 * TOOLS ASSESSMENT. GKS/FKG need non-negative couplings; the prime side has indefinite signs
 * cos(t log n) — inapplicable as stated. Lee–Yang / transfer-matrix work finite-volume first:
 * partial Euler products have no zeros; partial sums Σ_{n≤N} n^{−s} have zeros with Re s > 1
 * (Montgomery 1983), so no finite-volume zero-location theorem exists to pass to the limit.
 * Reflection positivity (θ: s ↦ 1−s̄) is the Osterwalder–Schrader reading of Weil positivity
 * = roadmap Route A; small-support archimedean positivity (Connes–Consani 2021) is the one
 * proven partial confinement at coarse resolution.
 *
 * VERDICT. Route D's F(δ) splits into a probe-geometry factor (trivially "confining") times a
 * fixed prime budget; the Coulomb self-energy is exactly anti-confining; the only arithmetic
 * inequality is the boundedness of R_σ(t) as σ → 0, which is Weil's criterion on Gaussian
 * probes. Status: REFORMULATION, no lever. NOT a proof; no refereed bound is changed; RH open; NO QED.
 * Import-light; literals baked to 7 significant figures (assertion tolerances ~1e-6).
 */

const ID = 'rh-route-d-peierls-defect-confinement-2026-09-23';

// First 12 zeros (mpmath.zetazero, 9 dp) used only for the in-module recomputation of the
// elementary Coulomb inequality; the full runs used 260 zeros + a mean-density tail.
export const ZEROS_12 = Object.freeze([
  14.134725142, 21.022039639, 25.01085758, 30.424876126, 32.935061588, 37.586178159,
  40.918719012, 43.327073281, 48.005150881, 49.773832478, 52.970321478, 56.446247697,
]);

/** F_C(δ) = E_perp − E_along for the doubled k-th zero (0-based k) against a zero table. */
export function coulombSplitEnergy(zeros, k, delta) {
  const g = zeros[k];
  let s = Math.log((g * g - delta * delta) / (g * g + delta * delta)); // own conjugate image
  for (let j = 0; j < zeros.length; j++) {
    if (j === k) continue;
    for (const u of [g - zeros[j], g + zeros[j]]) {
      s += Math.log(Math.abs(u * u - delta * delta) / (u * u + delta * delta));
    }
  }
  return s;
}

/** S(t) = Σ_{γ'≠γ_k}[1/(t−γ')² + 1/(t+γ')²] + 1/t² over a zero table (no tail). */
export function coulombStiffness(zeros, k) {
  const g = zeros[k];
  let s = 1 / (g * g);
  for (let j = 0; j < zeros.length; j++) {
    if (j === k) continue;
    s += 1 / (g - zeros[j]) ** 2 + 1 / (g + zeros[j]) ** 2;
  }
  return s;
}

/** Gaussian-probe zero-side change F_h(δ) = 2[h(t+iδ)+h(t−iδ)] − 4h(t), h = e^{−(r−t)²/2σ²}. */
export function gaussianProbeF(delta, sigma) {
  return 4 * (Math.exp((delta * delta) / (2 * sigma * sigma)) - 1);
}

/** δ_max(t;σ) = σ√(2 log(R/2)) if R > 2 else null. */
export function deltaMaxFromBudget(R, sigma) {
  return R > 2 ? sigma * Math.sqrt(2 * Math.log(R / 2)) : null;
}

// (1) Coulomb rows: 260 zeros + analytic mean-density tail; splitE keyed by δ (d0_05 = δ=0.05 ...).
export const COULOMB_ROWS = Object.freeze([
  { k: 1, gamma: 14.1347251, S: 0.07144049, Fpp0: -0.285762, S_picket: 0.054777, halfGap: 3.444, splitE: { d0_05: -0.0003572024, d0_1: -0.00142881, d0_2: -0.00571524, d0_3: -0.01285929 } },
  { k: 2, gamma: 21.0220396, S: 0.1405844, Fpp0: -0.5623376, S_picket: 0.12154, halfGap: 1.994, splitE: { d0_05: -0.000702922, d0_1: -0.002811688, d0_2: -0.01124676, d0_3: -0.02530532 } },
  { k: 3, gamma: 25.0108576, S: 0.166172, Fpp0: -0.6646878, S_picket: 0.15903, halfGap: 1.994, splitE: { d0_05: -0.0008308598, d0_1: -0.003323439, d0_2: -0.01329377, d0_3: -0.02991109 } },
  { k: 10, gamma: 49.7738325, S: 0.5518421, Fpp0: -2.207368, S_picket: 0.35694, halfGap: 0.8843, splitE: { d0_05: -0.002759211, d0_1: -0.01103686, d0_2: -0.0441488, d0_3: -0.09934793 } },
  { k: 30, gamma: 101.317851, S: 0.5889716, Fpp0: -2.355887, S_picket: 0.64421, halfGap: 1.204, splitE: { d0_05: -0.002944858, d0_1: -0.01177944, d0_2: -0.04711814, d0_3: -0.1060196 } },
  { k: 100, gamma: 236.52423, S: 1.205313, Fpp0: -4.821251, S_picket: 1.097, halfGap: 0.6228, splitE: { d0_05: -0.006026566, d0_1: -0.02410643, d0_2: -0.09643659, d0_3: -0.2170884 } },
  { k: 200, gamma: 396.381854, S: 2.53082, Fpp0: -10.12328, S_picket: 1.4314, halfGap: 0.3995, splitE: { d0_05: -0.01265414, d0_1: -0.05061902, d0_2: -0.2026333, d0_3: -0.4574764 } },
]);
// S_picket = π²/(3 s̄²) for a picket fence at the mean spacing s̄ = 2π/log(γ/2π) — scale reference only.

// (3) Explicit-formula validation: zeroSide = 2Σ_{γ≤γ_260} e^{−(γ−t)²/2σ²}; rhs = arch + prime.
export const EF_VALIDATION = Object.freeze([
  { sigma: 1.0, t: 30.0, zeroSide: 1.85433523036, arch: 1.24686806221, prime: 0.607467168155, diff: -2.22e-16 },
  { sigma: 1.0, t: 60.0, zeroSide: 3.03477908689, arch: 1.80028047041, prime: 1.23449861647, diff: 0.0 },
  { sigma: 1.0, t: 100.0, zeroSide: 1.8517538762, arch: 2.20793722954, prime: -0.356183353338, diff: -2.22e-15 },
  { sigma: 1.0, t: 150.0, zeroSide: 3.39422141681, arch: 2.53147559531, prime: 0.862745821501, diff: -5.77e-15 },
  { sigma: 0.7, t: 30.0, zeroSide: 1.66383692389, arch: 0.872966329684, prime: 0.79087059421, diff: 1.33e-15 },
  { sigma: 0.7, t: 60.0, zeroSide: 2.28172041575, arch: 1.26023591841, prime: 1.02148449734, diff: 4.44e-16 },
  { sigma: 0.7, t: 100.0, zeroSide: 0.836095972567, arch: 1.54557030646, prime: -0.70947433389, diff: -8.99e-15 },
  { sigma: 0.7, t: 150.0, zeroSide: 2.8315317065, arch: 1.7720392473, prime: 1.0594924592, diff: -7.99e-15 },
  { sigma: 0.5, t: 30.0, zeroSide: 1.39390307967, arch: 0.62360065124, prime: 0.770302428432, diff: -3.11e-14 },
  { sigma: 0.5, t: 60.0, zeroSide: 1.35381565628, arch: 0.900181816251, prime: 0.453633840027, diff: -1.22e-14 },
  { sigma: 0.5, t: 100.0, zeroSide: 0.192169064964, arch: 1.10398357829, prime: -0.911814513322, diff: -8.49e-15 },
  { sigma: 0.5, t: 150.0, zeroSide: 2.34951390041, arch: 1.26574444732, prime: 1.08376945309, diff: -4.44e-16 },
  { sigma: 0.4, t: 30.0, zeroSide: 1.13771634629, arch: 0.498896494046, prime: 0.638819846771, diff: 5.47e-09 },
  { sigma: 0.4, t: 60.0, zeroSide: 0.757891949484, arch: 0.720149443383, prime: 0.0377425043998, diff: 1.7e-09 },
  { sigma: 0.4, t: 100.0, zeroSide: 0.0367792081974, arch: 0.883188298945, prime: -0.846409090838, diff: 9.11e-11 },
  { sigma: 0.4, t: 150.0, zeroSide: 2.11994705554, arch: 1.01259619619, prime: 1.10735085922, diff: 1.32e-10 },
]);

// Worst-case prime budget B(σ) vs the σ→0 asymptote 4e^{1/8σ²}; trunc = weight beyond n≈3e7·e^{-1/2}.
export const WORST_CASE_BUDGET = Object.freeze([
  { sigma: 1.0, B: 2.1399, fourExp: 4.532594, ratio: 0.47211, trunc: 5.5e-59 },
  { sigma: 0.7, B: 3.208638, fourExp: 5.162373, ratio: 0.62154, trunc: 1e-27 },
  { sigma: 0.5, B: 5.016319, fourExp: 6.594885, ratio: 0.76064, trunc: 6.5e-13 },
  { sigma: 0.4, B: 7.383821, fourExp: 8.736803, ratio: 0.84514, trunc: 2.5e-07 },
]);

// Lone-defect confinement at sampled heights: D = ½A_σ(t), Phalf = ½P_σ(t), R = D + Phalf.
export const CONFINEMENT_ROWS = Object.freeze([
  { sigma: 1.0, t: 14.134725, D: 0.3223548, Phalf: 0.6776452, R: 1.0, excluded: true, deltaMax: null },
  { sigma: 1.0, t: 21.02204, D: 0.4813095, Phalf: 0.5190412, R: 1.000351, excluded: true, deltaMax: null },
  { sigma: 1.0, t: 30.0, D: 0.623434, Phalf: 0.3037336, R: 0.9271676, excluded: true, deltaMax: null },
  { sigma: 1.0, t: 60.0, D: 0.9001402, Phalf: 0.6172493, R: 1.51739, excluded: true, deltaMax: null },
  { sigma: 1.0, t: 100.0, D: 1.103969, Phalf: -0.1780917, R: 0.9258769, excluded: true, deltaMax: null },
  { sigma: 1.0, t: 300.0, D: 1.542271, Phalf: -0.1420816, R: 1.400189, excluded: true, deltaMax: null },
  { sigma: 1.0, t: 1000.0, D: 2.022589, Phalf: -0.0324667, R: 1.990122, excluded: true, deltaMax: null },
  { sigma: 1.0, t: 3000.0, D: 2.460872, Phalf: -0.1035491, R: 2.357323, excluded: false, deltaMax: 0.573375 },
  { sigma: 1.0, t: 10000.0, D: 2.941187, Phalf: 0.290078, R: 3.231265, excluded: false, deltaMax: 0.979517 },
  { sigma: 1.0, t: 100000.0, D: 3.859786, Phalf: -0.444813, R: 3.414973, excluded: false, deltaMax: 1.03443 },
  { sigma: 1.0, t: 1000000.0, D: 4.778384, Phalf: 0.03958314, R: 4.817968, excluded: false, deltaMax: 1.32605 },
  { sigma: 0.7, t: 14.134725, D: 0.2260094, Phalf: 0.7739906, R: 1.0, excluded: true, deltaMax: null },
  { sigma: 0.7, t: 21.02204, D: 0.3370787, Phalf: 0.6629214, R: 1.0, excluded: true, deltaMax: null },
  { sigma: 0.7, t: 30.0, D: 0.4364832, Phalf: 0.3954353, R: 0.8319185, excluded: true, deltaMax: null },
  { sigma: 0.7, t: 60.0, D: 0.630118, Phalf: 0.5107422, R: 1.14086, excluded: true, deltaMax: null },
  { sigma: 0.7, t: 100.0, D: 0.7727852, Phalf: -0.3547372, R: 0.418048, excluded: true, deltaMax: null },
  { sigma: 0.7, t: 300.0, D: 1.07959, Phalf: -0.02686799, R: 1.052722, excluded: true, deltaMax: null },
  { sigma: 0.7, t: 1000.0, D: 1.415812, Phalf: -0.05273063, R: 1.363081, excluded: true, deltaMax: null },
  { sigma: 0.7, t: 3000.0, D: 1.72261, Phalf: -0.222863, R: 1.499747, excluded: true, deltaMax: null },
  { sigma: 0.7, t: 10000.0, D: 2.058831, Phalf: 0.2974203, R: 2.356251, excluded: false, deltaMax: 0.400807 },
  { sigma: 0.7, t: 100000.0, D: 2.70185, Phalf: -0.5544794, R: 2.147371, excluded: false, deltaMax: 0.26396 },
  { sigma: 0.7, t: 1000000.0, D: 3.344869, Phalf: -0.08701642, R: 3.257853, excluded: false, deltaMax: 0.691493 },
  { sigma: 0.5, t: 14.134725, D: 0.1615559, Phalf: 0.8384441, R: 1.0, excluded: true, deltaMax: null },
  { sigma: 0.5, t: 21.02204, D: 0.2408249, Phalf: 0.7591751, R: 1.0, excluded: true, deltaMax: null },
  { sigma: 0.5, t: 30.0, D: 0.3118003, Phalf: 0.3851512, R: 0.6969515, excluded: true, deltaMax: null },
  { sigma: 0.5, t: 60.0, D: 0.4500909, Phalf: 0.2268169, R: 0.6769078, excluded: true, deltaMax: null },
  { sigma: 0.5, t: 100.0, D: 0.5519918, Phalf: -0.4559073, R: 0.09608453, excluded: true, deltaMax: null },
  { sigma: 0.5, t: 300.0, D: 0.7711362, Phalf: 0.1837721, R: 0.9549083, excluded: true, deltaMax: null },
  { sigma: 0.5, t: 1000.0, D: 1.011294, Phalf: -0.004330306, R: 1.006964, excluded: true, deltaMax: null },
  { sigma: 0.5, t: 3000.0, D: 1.230436, Phalf: -0.3898662, R: 0.8405696, excluded: true, deltaMax: null },
  { sigma: 0.5, t: 10000.0, D: 1.470594, Phalf: 0.2055081, R: 1.676102, excluded: true, deltaMax: null },
  { sigma: 0.5, t: 100000.0, D: 1.929893, Phalf: -0.5986548, R: 1.331238, excluded: true, deltaMax: null },
  { sigma: 0.5, t: 1000000.0, D: 2.389192, Phalf: -0.2010826, R: 2.18811, excluded: false, deltaMax: 0.212003 },
  { sigma: 0.4, t: 14.134725, D: 0.1292808, Phalf: 0.8707192, R: 1.0, excluded: true, deltaMax: null },
  { sigma: 0.4, t: 21.02204, D: 0.1926762, Phalf: 0.8073238, R: 1.0, excluded: true, deltaMax: null },
  { sigma: 0.4, t: 30.0, D: 0.2494482, Phalf: 0.3194099, R: 0.5688582, excluded: true, deltaMax: null },
  { sigma: 0.4, t: 60.0, D: 0.3600747, Phalf: 0.01887125, R: 0.378946, excluded: true, deltaMax: null },
  { sigma: 0.4, t: 100.0, D: 0.4415941, Phalf: -0.4232045, R: 0.0183896, excluded: true, deltaMax: null },
  { sigma: 0.4, t: 300.0, D: 0.616909, Phalf: 0.3067142, R: 0.9236232, excluded: true, deltaMax: null },
  { sigma: 0.4, t: 1000.0, D: 0.8090355, Phalf: 0.0810213, R: 0.8900568, excluded: true, deltaMax: null },
  { sigma: 0.4, t: 3000.0, D: 0.9843487, Phalf: -0.4624551, R: 0.5218936, excluded: true, deltaMax: null },
  { sigma: 0.4, t: 10000.0, D: 1.176475, Phalf: 0.1631697, R: 1.339645, excluded: true, deltaMax: null },
  { sigma: 0.4, t: 100000.0, D: 1.543914, Phalf: -0.5729595, R: 0.9709549, excluded: true, deltaMax: null },
  { sigma: 0.4, t: 1000000.0, D: 1.911354, Phalf: -0.2766764, R: 1.634677, excluded: true, deltaMax: null },
]);

// Window scans (grid step 0.1; archimedean term linearly interpolated from a 5.0 grid, ~4e-4 abs
// error, which is why Rmin can print marginally negative at σ=0.4).
export const WINDOW_SCANS = Object.freeze([
  { sigma: 1.0, a: 50.0, b: 150.0, n: 1000, fracExcluded: 1.0, Rmin: 0.20389, Rmax: 1.8462, supDeltaMax: 0.0 },
  { sigma: 1.0, a: 1000.0, b: 1050.0, n: 500, fracExcluded: 0.448, Rmin: 1.1895, Rmax: 2.6498, supDeltaMax: 0.75009 },
  { sigma: 1.0, a: 10000.0, b: 10050.0, n: 500, fracExcluded: 0.01, Rmin: 1.9573, Rmax: 3.6313, supDeltaMax: 1.0922 },
  { sigma: 0.7, a: 50.0, b: 150.0, n: 1000, fracExcluded: 1.0, Rmin: 0.018567, Rmax: 1.6646, supDeltaMax: 0.0 },
  { sigma: 0.7, a: 1000.0, b: 1050.0, n: 500, fracExcluded: 0.972, Rmin: 0.45321, Rmax: 2.1446, supDeltaMax: 0.26157 },
  { sigma: 0.7, a: 10000.0, b: 10050.0, n: 500, fracExcluded: 0.458, Rmin: 0.88146, Rmax: 2.8056, supDeltaMax: 0.57593 },
  { sigma: 0.5, a: 50.0, b: 150.0, n: 1000, fracExcluded: 1.0, Rmin: 6.2916e-05, Rmax: 1.3975, supDeltaMax: 0.0 },
  { sigma: 0.5, a: 1000.0, b: 1050.0, n: 500, fracExcluded: 1.0, Rmin: 0.09733, Rmax: 1.8136, supDeltaMax: 0.0 },
  { sigma: 0.5, a: 10000.0, b: 10050.0, n: 500, fracExcluded: 0.924, Rmin: 0.29164, Rmax: 2.3817, supDeltaMax: 0.29551 },
  { sigma: 0.4, a: 50.0, b: 150.0, n: 1000, fracExcluded: 1.0, Rmin: -0.0001222, Rmax: 1.1545, supDeltaMax: 0.0 },
  { sigma: 0.4, a: 1000.0, b: 1050.0, n: 500, fracExcluded: 1.0, Rmin: 0.017762, Rmax: 1.716, supDeltaMax: 0.0 },
  { sigma: 0.4, a: 10000.0, b: 10050.0, n: 500, fracExcluded: 0.984, Rmin: 0.092691, Rmax: 2.139, supDeltaMax: 0.14664 },
]);

export const ROUTE_D_PEIERLS = Object.freeze({
  id: ID,
  date: '2026-09-23',
  roadmap: 'src/data/rh-novel-routes-roadmap-2026-09-23.js (route D)',
  status:
    'FIRST TEST EXECUTED — Route D is a REFORMULATION of Weil positivity (Gaussian probes), not a lever. '
    + 'NOT a proof; no bound changes; no refereed bound is changed; RH open; NO QED.',
  defectQuadruple: 'ρ = ½+δ+it ⇒ Q(δ) = {½±δ±it}; in γ-coordinates {±t±iδ}; Q(δ) = Q(−δ) so F is EVEN in δ; '
    + 'δ→0 is a DOUBLE zero (an on-line simple zero cannot leave the line alone).',
  freeEnergies: {
    coulomb: {
      formula: 'F_C(δ) = E_perp − E_along = Σ_{γ′≠γ_k}[log(|(t−γ′)²−δ²|/((t−γ′)²+δ²)) + log(|(t+γ′)²−δ²|/((t+γ′)²+δ²))] + log((t²−δ²)/(t²+δ²))',
      secondDerivative: "F_C''(0) = −4 S(t), S(t) = Σ_{γ′≠γ_k}[1/(t−γ′)² + 1/(t+γ′)²] + 1/t²",
      verdict: 'ANTI-confining at every height, by the elementary inequality |u²−δ²| < u²+δ² (uδ≠0); '
        + 'E_perp(δ) strictly decreasing in δ; Earnshaw: the potential log|ξ| is harmonic, the primes are its '
        + 'value for σ>1, not an external field — no electrostatic dressing can confine.',
    },
    weilProbe: {
      formula: "F_h(δ) = 2[h(t+iδ)+h(t−iδ)] − 4h(t) = −2δ²h''(t) + O(δ⁴) = 4∫g(x)(cosh δx − 1)cos(tx)dx",
      gaussian: "F_h(δ) = 4(e^{δ²/2σ²} − 1), F_h''(0) = 4/σ² > 0",
      verdict: "F_h''(0) ≥ 0 is probe geometry (real local max of an analytic function ⇒ growth in the imaginary "
        + 'direction), NOT Weil positivity; Weil’s form Σ_ρ ĝ(ρ) is fixed by the primes and does not move with a '
        + 'hypothetical zero. No canonical F: sign F_h″(0) = −sign h″(t).',
    },
    explicitFormulaBudget: {
      identity: 'Σ_γ h(γ) = A_σ(t) + P_σ(t), h = e^{−(r−t)²/2σ²}+e^{−(r+t)²/2σ²}; '
        + 'P_σ(t) = −2σ√(2/π) Σ_n Λ(n)n^{−1/2}e^{−σ²log²n/2}cos(t log n); R_σ(t) := ½(A+P)',
      loneDefect: 'quadruple at t contributes 2e^{δ²/2σ²} to R_σ(t) ⇒ δ ≤ δ_max = σ√(2 log(R/2)) if R>2; excluded if R<2 '
        + '(conditional: other zeros near t on the line)',
      unconditional: 'RH ⟺ ∀t: R_σ(t) bounded as σ→0⁺ (¬RH ⇒ R_σ(t₀) ≳ 2e^{δ₀²/2σ²} at a window-maximal defect); '
        + 'RH ∧ simple ⟺ ∀t: liminf_{σ→0} R_σ(t) < 2. Weil’s criterion on Gaussian probes.',
      worstCase: 'B(σ) → 4e^{1/8σ²} (σ→0) and the quadruple costs 4e^{δ²/2σ²} ⇒ without phase cancellation the budget '
        + 'gives exactly δ ≤ ½ at every resolution (the trivial strip).',
      uniformInequalityNeeded: 'sup_{σ∈(0,1]} R_σ(t) < ∞ for every t, i.e. |Σ_{n≲e^{1/2σ²}} Λ(n)n^{−1/2−it}·w_σ(n)| ≪ 1/σ '
        + 'uniformly — partial-sum cancellation of −ζ′/ζ on the line, equivalent to RH; not deliverable by GKS/FKG '
        + '(indefinite couplings cos(t log n)), nor Lee–Yang/transfer-matrix (finite-volume zeros are off-line: '
        + 'Montgomery 1983); reflection positivity = Route A (OS reading of Weil positivity).',
    },
  },
  numerics: {
    zerosUsed: 260, gammaMax: 485.5391, primesUpTo: 3e7, scratch: 'tmp/route-d-peierls-scratch.py',
    efValidationMaxAbsDiff: { sigmaGe05: 3.11e-14, sigma04: 5.47e-9 },
    coulombFpp0AllNegative: true,
    loneDefectExclusionFraction: { window50to150: 1.0, window1e4: { s1: 0.01, s07: 0.458, s05: 0.924, s04: 0.984 } },
    budgetStopsConfiningBelowHalf: 'σ=1: t≳3000 (δ_max=0.573 at t=3000); σ=0.7: sup over [1e4,1e4+50] = 0.576; '
      + 'σ=0.4: sup over [1e4,1e4+50] = 0.147 — not uniform in height at fixed σ',
    caveat: 'all heights are inside the numerically verified RH range; radii test the machinery, not ζ',
  },
  nextTest:
    'The only non-tautological content is the σ→0 boundedness of R_σ(t). Concrete next test: at a Lehmer pair '
    + '(e.g. γ≈7005.06, gap 0.0035) compute R_σ(t) from primes at σ down to the local gap (needs Λ(n) to ~e^{1/2σ²}) '
    + 'and record how close R comes to 2 — quantifies how near the budget is to admitting a defect. Any route to '
    + 'PROVE boundedness must bound the twisted von Mangoldt partial sums themselves; do not re-attempt Coulomb-energy '
    + 'or probe-convexity arguments (both settled here: anti-confining / content-free).',
});

const near = (a, b, tol) => Math.abs(a - b) <= tol;

export const RH_ROUTE_D_PEIERLS_ASSERTIONS = Object.freeze([
  {
    id: 'coulomb-split-inequality-recomputed-negative-and-decreasing',
    holds: () => {
      for (const k of [0, 1, 2]) {
        let prev = 0;
        for (const d of [0.05, 0.1, 0.2, 0.3]) {
          const v = coulombSplitEnergy(ZEROS_12, k, d);
          if (!(v < 0) || !(v < prev)) return false;
          prev = v;
        }
      }
      return true;
    },
    why: 'F_C(δ) = E_perp − E_along is termwise negative (|u²−δ²| < u²+δ²) and strictly decreasing in δ; recomputed live on 12 zeros.',
  },
  {
    id: 'coulomb-stiffness-matches-baked-within-tail',
    holds: () => {
      // 12-zero truncation vs 260-zero + tail: difference must be small and of the right sign (truncation lowers S).
      const r = COULOMB_ROWS[0];
      const s12 = coulombStiffness(ZEROS_12, 0);
      return s12 < r.S && r.S - s12 < 0.02 && near(r.Fpp0, -4 * r.S, 1e-6);
    },
    why: 'S(γ₁) from the first 12 zeros is below the 260-zero+tail value by less than 0.02; Fpp0 = −4S exactly.',
  },
  {
    id: 'coulomb-Fpp0-negative-at-every-sampled-height',
    holds: () => COULOMB_ROWS.length === 7
      && COULOMB_ROWS.every((r) => r.Fpp0 < 0 && r.S > 0 && near(r.Fpp0, -4 * r.S, 1e-5)
        && Object.values(r.splitE).every((v) => v < 0)),
    why: 'The pure log-gas free energy of the mirror mode is concave at δ=0 at k=1,2,3,10,30,100,200: anti-confining.',
  },
  {
    id: 'coulomb-split-energy-small-delta-law',
    holds: () => COULOMB_ROWS.every((r) => near(r.splitE.d0_05, -2 * 0.05 ** 2 * r.S, 2e-5 * Math.max(1, r.S))),
    why: 'F_C(δ) ≈ −2δ²S(t) at small δ (δ=0.05) — consistency between the split-energy table and the stiffness.',
  },
  {
    id: 'gaussian-probe-F-is-even-positive-with-Fpp0-4-over-sigma2',
    holds: () => {
      const s = 0.7; const h = 1e-3;
      const fpp = (gaussianProbeF(h, s) - 2 * gaussianProbeF(0, s) + gaussianProbeF(-h, s)) / (h * h);
      return gaussianProbeF(0, s) === 0 && gaussianProbeF(0.3, s) > 0
        && gaussianProbeF(0.3, s) === gaussianProbeF(-0.3, s) && near(fpp, 4 / (s * s), 1e-3);
    },
    why: 'Probe-geometry positivity: F_h(δ)=4(e^{δ²/2σ²}−1) is even, ≥0, F_h″(0)=4/σ² — content-free, not Weil positivity.',
  },
  {
    id: 'explicit-formula-validated-against-zeros',
    holds: () => EF_VALIDATION.length === 16 && EF_VALIDATION.every((r) => {
      const tol = r.sigma >= 0.5 ? 1e-9 : 1e-7;
      return near(r.zeroSide, r.arch + r.prime, tol) && Math.abs(r.diff) <= tol;
    }),
    why: 'Σ_γ h(γ) from 260 zeros equals archimedean + prime side to 1e-14 (σ≥0.5) / 6e-9 (σ=0.4, prime truncation at 3e7).',
  },
  {
    id: 'lone-zero-contributes-exactly-one-to-budget',
    holds: () => CONFINEMENT_ROWS.filter((r) => r.t === 14.134725 || r.t === 21.02204)
      .every((r) => near(r.R, 1, 4e-4) && near(r.R, r.D + r.Phalf, 2e-6)),
    why: 'At γ₁, γ₂ the prime-computed R_σ(t) is 1.000 at every σ: the local budget counts one simple zero (D + P/2 = R).',
  },
  {
    id: 'delta-max-reconstructs-from-R-and-exclusion-flag-consistent',
    holds: () => CONFINEMENT_ROWS.length === 44 && CONFINEMENT_ROWS.every((r) => {
      const dm = deltaMaxFromBudget(r.R, r.sigma);
      if (r.excluded !== (r.R < 2)) return false;
      return dm === null ? r.deltaMax === null : near(dm, r.deltaMax, 2e-5);
    }),
    why: 'δ_max = σ√(2 log(R/2)) when R>2, null otherwise; the excluded flag is exactly R<2 (7-sig-fig storage tolerance).',
  },
  {
    id: 'budget-confinement-not-uniform-in-height',
    holds: () => {
      const s1 = CONFINEMENT_ROWS.filter((r) => r.sigma === 1.0);
      const t3000 = s1.find((r) => r.t === 3000); const t1e6 = s1.find((r) => r.t === 1e6);
      const s04 = CONFINEMENT_ROWS.filter((r) => r.sigma === 0.4);
      return s1.filter((r) => r.t <= 1000).every((r) => r.excluded)
        && t3000.deltaMax > 0.5 && t1e6.deltaMax > 1 && s04.every((r) => r.excluded);
    },
    why: 'At σ=1 the budget excludes lone defects up to t=1000 but allows δ_max>½ from t=3000 (density term ∝ σ log t); at σ=0.4 all sampled heights to 1e6 stay excluded.',
  },
  {
    id: 'window-exclusion-fraction-decreases-with-height-and-increases-with-resolution',
    holds: () => {
      const byS = {};
      for (const r of WINDOW_SCANS) (byS[r.sigma] ||= []).push(r);
      for (const rows of Object.values(byS)) {
        rows.sort((x, y) => x.a - y.a);
        if (!(rows[0].fracExcluded >= rows[1].fracExcluded && rows[1].fracExcluded >= rows[2].fracExcluded)) return false;
        if (rows.some((r) => r.Rmin < -1e-3)) return false; // interpolation error ~4e-4 only
      }
      const at1e4 = WINDOW_SCANS.filter((r) => r.a === 10000).sort((x, y) => y.sigma - x.sigma).map((r) => r.fracExcluded);
      return at1e4.every((v, i) => i === 0 || v > at1e4[i - 1]);
    },
    why: 'Excluded fraction is monotone: 100% on [50,150], then decreasing with height for every σ; at t≈1e4 it rises as σ shrinks (1%→46%→92%→98%).',
  },
  {
    id: 'worst-case-budget-approaches-4exp-one-eighth-sigma2',
    holds: () => WORST_CASE_BUDGET.every((r) => near(r.fourExp, 4 * Math.exp(1 / (8 * r.sigma ** 2)), 1e-5)
      && near(r.ratio, r.B / r.fourExp, 1e-4) && r.ratio < 1)
      && WORST_CASE_BUDGET.every((r, i) => i === 0 || r.ratio > WORST_CASE_BUDGET[i - 1].ratio),
    why: 'B(σ)/(4e^{1/8σ²}) = 0.47, 0.62, 0.76, 0.85 increasing toward 1 as σ→0: the phase-free budget tends to exactly the trivial strip δ≤½.',
  },
  {
    id: 'honest-status-no-proof-claimed',
    holds: () => /NOT a proof/.test(ROUTE_D_PEIERLS.status) && /RH open/.test(ROUTE_D_PEIERLS.status)
      && /REFORMULATION/.test(ROUTE_D_PEIERLS.status) && /Λ≤0\.2|refereed bound is changed/.test(ROUTE_D_PEIERLS.status),
    why: 'No false QED: Route D is recorded as a reformulation of Weil positivity; no refereed bound is changed; RH open.',
  },
]);

export default ROUTE_D_PEIERLS;
