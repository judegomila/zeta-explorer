# b-alpoge-furman: Route 16 pushed (Alpöge–Furman mechanism with the 7/8 half-plane)

Date 2026-11-16. Labels: PROVED / CLASSICAL / DERIVED (main-term algebra on top of the AF preprint) / MEASURED / QUOTED / OPEN.
RH is open. Nothing here moves a Λ bound. No QED.

## 0. Verdict

**Precise obstruction, with one measured lead.**

1. With the zero-free half-plane Re s > 7/8 (or any fixed Θ > 1/2) as an extra input, the AF mechanism still gives
   **0.672500704** (= 3/2 − cot(1/√2)/√2) simple on-line zeros. The half-plane changes no main term.
2. Exact ceilings:
   - AF chain (Gram window + rank–trace + inertia), bandwidth λ ≤ 1: **C(λ) = 2 − λ/2 − cot(λ/√2)/√2** (PROVED optimal over all
     real windows). C(1) = 0.672500704; C vanishes at λ₀ = 0.550193965.
   - All linear bandwidth-one certificates: **≤ 0.6818287** (QUOTED from the AF Lean artifact; its extremal law is on the line:
     real positions, marks 1 and 2). Reproduced independently here at comb level N ≤ 16 (MEASURED; extrapolation 0.6817 ± 0.0002).
   - Because the extremal law is on the line, the ceiling is the same under RH, under any zero-free half-plane, and under
     any depth bound δ > 0 (PROVED given the law, §3). It caps the proportion "on the line" as well as "simple and on the line".
3. Signature counting cannot be upgraded to every zero in any window by a zero-free half-plane (§5). The half-plane removes
   deep zeros; every extremal configuration has depth 0 or depth → 0.
4. Lead (MEASURED): off-line pairs never lower the comb ceiling (N ≤ 16). The 0.0093 gap between 0.6725 and 0.6818 is
   slack in the Gram/inertia proof method, not an obstruction created by off-line zeros. An unconditional certificate above
   0.6725 is not excluded.

## 1. Plan; what is new against the atlas, the walls and earlier files

- Atlas (PR #27) has no proportion route. Route 16 (`src/data/route-16-alpoge-furman-twin-ladder-2026-10-10.js`) reproduced
  AF at heights 1e3–2.9e5 and left "reproduce the 0.682 ceiling" open. W100 (`formalization/rh-attempts/2026-11-01-window-100.md`)
  already proved: every-window certification needs a depth bound shrinking with T; no fixed half-plane supplies it; short-window
  corollary 2 − 1/θ − θ/3 for the flat window. None of that is redone here.
- New here: (a) optimal-window chain ceiling at every bandwidth with a convexity proof; (b) the exact criterion for a
  bandwidth extension to beat 2/3 and why 7/8 does not meet it; (c) the Θ-blind ceiling statement, resting on the on-line
  nature of the AF ceiling law (checked in the public Lean file header); (d) an independent comb-level LP reproducing the
  ceiling and testing whether off-line pairs lower it.
- Walls. MV-CAP: respected (all statements are proportions or ceilings). DH: §6. Flow-blindness: not engaged (prime-side
  second moment, NS-RIGID's open class). Verified height: not used.

Setting (AF arXiv:2608.13637, preprint; text in `tmp/routes-b5-r16-src/af.txt`). G̃ = Gabor compression of Weil's form,
bandwidth L = λ log(T/2π). Zero side: tr G̃ = N(1+o(1)); on-line zero → rank-one PSD; off-line pair → signature (1,1).
Prime side: ‖G̃‖²_HS = (R_λ(ψ)+o(1))N. Lemma 3.2 + inertia: N₀ˢ/N ≥ 2 − R_λ(ψ) − o(1).

## 2. The chain's exact ceiling at each bandwidth

**Proposition 1 (PROVED).** For 0 < λ < π/√2 and real ψ ∈ L²[−1/2,1/2] with ∫ψ ≠ 0 put

    R_λ(ψ) = ( (1/λ)∫ψ² + λ∬|u−v|ψ(u)ψ(v) du dv ) / (∫ψ)².

Then min_ψ R_λ = λ/2 + cot(λ/√2)/√2, attained only at multiples of cos(√2 λ u).

*Proof.* Normalise ∫ψ = 1. For f with ∫f = 0 let F(u) = ∫_{−1/2}^u f, so F(±1/2) = 0. Two integrations by parts
(∂_u∂_v|u−v| = −2δ) give ∬|u−v| f f = −2∫F². Wirtinger: ∫F² ≤ π⁻²∫f². So the quadratic form on mean-zero f is
≥ (1/λ − 2λ/π²)∫f² > 0: strictly convex, unique minimiser = the stationary point. Euler–Lagrange:
ψ/λ + λ∫|u−v|ψ(v)dv = μ, hence ψ″ + 2λ²ψ = 0, ψ even: ψ = cos(√2λu). Then R = μ/∫ψ with
μ = cos(λ/√2)/λ + (λ/2)∫ψ and ∫ψ = √2 sin(λ/√2)/λ. ∎

- λ = 1: 1.327499296 (Montgomery–Taylor; CLASSICAL, CCLM17). Checked by direct quadrature at λ = 0.7 to 30 digits.
- R_λ is strictly decreasing in λ (derivative ½ − ½csc²(λ/√2) < 0). So C(λ) = 2 − R_λ increases; no λ < 1 helps.
- Values C(λ) (optimal window / flat window): 0.6: 0.13455 / 0.13333; 0.7: 0.34005 / 0.33810; 0.8: 0.48627 / 0.48333;
  0.9: 0.59310 / 0.58889; 1: 0.67250 / 0.66667. Threshold λ₀ = 0.550193965 (flat: 3 − √6 = 0.550510).
- Short windows (DERIVED; W100 Cor. 3b with the optimal window): in [T, T + T^θ] the chain certifies C(θ), and nothing for θ ≤ λ₀.

**Proposition 2 (DERIVED; bandwidth beyond 1).** The zero side (trace, block structure, Lemma 3.2) holds for every λ.
With the flat window and F the (bilinear, unconditional) form factor,

    N₀ˢ/N ≥ 2 − 2/λ + 2/(3λ²) − (2/λ²)∫₁^λ (λ−α)F(α)dα − o(1),

so bandwidth λ > 1 beats 2/3 iff ∫₁^λ (λ−α)F(α)dα < (λ−1)(2λ−1)/3. If F ≤ C on [1,λ] the optimum is 2/3 + 1/(9C−6)
(C = 1: 100%).

What the criterion needs from primes: the variance of ψ(x+h) − ψ(x) − h for h = x^{1−1/λ} within a constant factor of
h x log x. What is available:
- Montgomery–Vaughan: F(α) ≪ T^{α−1} (useless for fixed α > 1; gives O(1/log T) gain at λ = 1 + c/log T).
- Zero-free half-plane Θ: variance ≪ h x^{2Θ} log²x, short of the target by x^{2Θ−1} (x^{3/4} at Θ = 7/8).
- Sieve upper bounds for prime pairs lose the leading-term cancellation (factor 4 on a term of relative size T^{α−1}).
So the 7/8 input does not extend the bandwidth. This is the first failing step for "use the half-plane on the prime side". OPEN:
any O(1) bound for F on (1, 1+ε).

Places where depth ≤ 1/2 is used in AF: only error terms (X^{1/2} in Props 4.2–4.3). Θ = 7/8 turns these into X^{3/8}.
The rate stays O(log log T / log T) (it comes from Prop 5.2).

## 3. The ceiling is blind to every zero-free half-plane

Definition (AF §7.2): a linear bandwidth-one certificate is (c₀, r), r on [0,1], with c₀ + ∫r dF_Z ≤ N₀ˢ(Z)/N
for every configuration Z in a class 𝒞; on ζ it certifies c₀ + ∫₀¹ r(x) x dx.

QUOTED (github.com/anthropics/zeta-23-lean, tag v1.0, `Zeta23/PairCeiling/LawN256.lean`, header read from the file; the
certificate JSON is not public): a 256-periodic law of *marked configurations*, rational real positions, marks in {1,2},
grid form factor |256·S(j) − j| ≤ 3e-40 for 0 < j < 256, simple fraction p₀ = 0.68182868746. With the Lean stability
inequality: every certificate certifies ≤ 0.6818287 + 2.55e-6(|r′(1)| + ∫|r″|) (+0.824|r(1)|). One displayed hypothesis
(EnclOK, interval arithmetic outside the kernel).

**Proposition 3 (PROVED given the quoted law).** Let 𝒞_δ be the symmetric configurations with all depths ≤ δ (in mean
spacings), δ ≥ 0 arbitrary; 𝒞₀ = on-line (RH) configurations.
(i) Every certificate valid on 𝒞₀ certifies at most 0.6818287 + stab(r) simple zeros. So the ceiling holds under RH,
    hence under every zero-free half-plane.
(ii) For δ > 0, every certificate of the *on-line count* N₀/N valid on 𝒞_δ certifies at most the same number.

*Proof.* (i) The law is supported in 𝒞₀ ⊂ 𝒞_δ; average the certificate inequality over it. (ii) Replace each double at x
by a pair x ± iη, η ≤ δ. Amplitudes 2 → 2cosh(2πjη/N) are continuous in η, so the grid form factor moves by O(η²) and the
certificate value on the law by O(η²‖r‖); the on-line fraction of the modified law is p₀. Let η → 0. ∎

Consequences.
- The hypothesis "no zeros with Re s > Θ" removes no extremal configuration, for any Θ > 1/2. The same holds for a box
  |β − ½| ≤ c/log T with any c > 0.
- The matrix-level statement is the same: Lemma 3.2's hypotheses (P ⪰ 0, rank, n₊) do not see depth, and its equality case
  Q = 2Π₂ is the η → 0 limit of pair blocks 2(aaᵀ − bbᵀ).

## 4. Independent reproduction of the ceiling; do off-line pairs lower it?

Script `comb_lp.py` (column generation, scipy HiGHS, L-BFGS pricing with random restarts; run on the motherbox, 8 cores,
seconds per N). Period-N configurations with N points: simple points, doubles, and (mode `sym`) off-line pairs x ± iy,
0 ≤ y ≤ 2 mean spacings. Constraints E[s_j] = j/N for 0 < j < N, s_j = |Σ a_k(j)e^{2πijx_k/N}|²/N, a = 1, 2, 2cosh(2πjy/N).
Objective: minimise E[simple fraction]. Any feasible law is an upper bound for all certificates at comb level N.

| N | on-line only | with off-line pairs | max pair depth in optimum |
|---|---|---|---|
| 2 | 0.750000000 (exact 3/4) | 0.750000000 | 0 |
| 3 | 0.711347768 | 0.711347763 | 0 |
| 4 | 0.698231077 | 0.698231080 | 0 |
| 5 | 0.692204568 | 0.692204547 | 0 |
| 6 | 0.688934552 | 0.688934551 | 0 |
| 7 | 0.687112658 | 0.687112656 | 0 |
| 8 | 0.685996223 | 0.685996222 | 0 |
| 10 | 0.684570102 | 0.684570101 | 0 |
| 12 | 0.683679862 | 0.683679862 | 0 |
| 14 | 0.683167989 | 0.683167985 | 0 |
| 16 | 0.682843501 | 0.682843500 | 0 |

MEASURED:
- V(N) ≈ V_∞ + 0.27/N². Fits: (12,16) → 0.681768; (14,16) → 0.681784; three-term fits 0.68135–0.68184. So
  V_∞ = 0.6817 ± 0.0002, consistent with the AF value 0.6818287 at N = 256 (an upper bound from their restricted LP).
  Non-simple fraction of the N = 16 law: 0.3172. Edge mass S(N)/N ≈ 0.85–0.91 (AF: |D(1)| ≤ 0.824); invisible when r(1) = 0.
- Off-line pairs: in every run (warm starts N ≤ 16; cold starts with initial depths up to 1.2, seeds 2 and 3, N = 4, 6, 8, 10)
  the optimum equals the on-line optimum to 1e-8, and every pair in the support sits at depth exactly 0. Depth > 0 was
  never profitable.
- N = 2 by hand (PROVED): doubles (s₁ = 2) with weight 1/4 and antipodal simple pairs (s₁ = 0) with weight 3/4 give 3/4;
  a pair at depth y has s₁ = 2cosh²(πy) ≥ 2, so it is dominated by the double. Dual: c₀ = 1, r₁ = 1/2.
- Dual solution at N = 16 (certificate N₀ˢ/N ≥ c₀ − (2/N)Σ r(j/N)s_j): c₀ = 0.99921, r(j/16) = 1.0343, 0.9848, 0.9167,
  0.8411, 0.7622, 0.6778, 0.5908, 0.5013, 0.4147, 0.3337, 0.2584, 0.1898, 0.1271, 0.0735, 0.0321. The flat AF certificate is
  c₀ = 1, r = 1 − α. The LP kernel is larger below α = 1/2 and smaller above; it is not a Gram kernel ψ⋆ψ/(∫ψ)² (else
  Proposition 1 would cap it at 0.6725).

Reading. By LP duality at fixed N, a certificate with value V(N) exists that is valid on all N-periodic on-line
configurations, and (MEASURED, heuristic pricing) on all N-periodic symmetric configurations of depth ≤ 2. So the comb-level
unconditional ceiling equals the RH ceiling. Under RH the known pair-correlation value is 0.6792 (Chirre–Gonçalves–de Laat
2020, recalled, not re-derived), already above the unconditional 0.6725. The data say the same room exists unconditionally.

Why AF's proof cannot reach it (PROVED, short): the Gram construction forces the pair kernel to be r̂ = K² with
K̂ = |κ̂|² ≥ 0, i.e. r = ψ⋆ψ with ψ = |κ̂|² ≥ 0, and Proposition 1 (all real ψ) caps that class at 0.6725. A second-variation
computation gives the condition any better kernel must meet at a tight configuration containing a double at x_p:
S″ := 2R₁″(0) + Σ_{k≠p} m_k R₁″(x_k − x_p) ≤ 0 (R₁ = Fourier transform of r on [−1,1]); splitting the double off the line
changes the certificate defect by −S″y². RH-validity alone does not imply S″ ≤ 0. OPEN: a positivity proof for a non-Gram
kernel on symmetric configurations.

## 5. Proportion → every zero in a window

Not possible with this mechanism under any zero-free half-plane. Reasons, each sufficient:
1. Proposition 3: bandwidth-one data are consistent with an on-line law in which 31.8% of the points are doubles, and with
   the same law carrying depth-η pairs for any η > 0. No depth hypothesis short of "pairs are absent" changes this.
2. Bandwidth > 1 needs prime-pair input (Proposition 2). With all bandwidths (AF §7.2(f), HL*(k) for all k) the output is
   100%, with o(N) exceptions allowed.
3. Windows: the chain is empty below length T^{0.5502} (Proposition 1), and exact window certification needs depth control
   O(log log T / log T) at the edges (W100 line 5.3, already refereed).
4. The half-plane is a statement at depth 3/8; the mechanism's resolution in depth is 1/log T. At Θ = 7/8 the allowed depth is
   (3/8)·log T/(2π) mean spacings.

## 6. Davenport–Heilbronn control

- AF state (§1.4, QUOTED, not re-verified here) that their inputs hold for Davenport–Heilbronn and Epstein zeta functions. So
  the mechanism yields a proportion for functions where RH fails, and cannot yield every zero. Nothing in §§2–5 contradicts
  this: all statements are ceilings, obstructions or comb-level LP values.
- Where the Euler product would have to enter: Proposition 2. Bandwidth > 1 needs correlations of Λ(n) with Λ(n+h), which
  do not exist for a function without an Euler product. The zero-free half-plane itself is false for DH (zeros in Re s > 1),
  so "half-plane + mechanism" is not testable on DH; Proposition 3 gives the reason it fails anyway.
- The lead in §4 (a better bandwidth-one kernel) would, if proved, also hold for DH-type controls with the same form factor.
  It is a proportion statement and does not conflict with the wall.

## 7. Three weakest steps

1. §4 "off-line pairs never lower the ceiling" is MEASURED: local-search pricing, depths ≤ 2 mean spacings, N ≤ 16,
   float LP. No proof that depth 0 is optimal; no continuum statement.
2. The 0.6818287 ceiling is QUOTED: the law file is not public, EnclOK is checked outside the Lean kernel, and the AF paper
   is a preprint. The independent reproduction here is an extrapolation from N ≤ 16 with spread 2e-4.
3. Proposition 2 is main-term algebra on AF's Remark 6.1 extended to λ > 1; the error terms for λ > 1 were not re-derived,
   and the statement about what a half-plane gives for short-interval variance is the standard explicit-formula estimate,
   not a theorem proved here. The CGdL value 0.6792 is from memory.

## 8. Next step

Prove or refute the comb-level finding in the continuum: find a kernel r on [−1,1] (start from the N = 16 dual above)
and a proof of ∫r|A_Z|² ≥ c(2N − s₁) for all symmetric Z, where A_Z(α) = Σ_on m e(αx) + Σ_pairs 2cosh(2παy)e(αx).
A two-kernel Gram decomposition r̂ = K₁² + K₂² with indefinite metric J is the natural attempt; the obstruction is that
tr((GJ)²) is not controlled by Lemma 3.2. A proof gives an unconditional proportion in (0.6725, 0.6818]. It does not
approach RH.

## Files

- `comb_lp.py` — LP; `out/comb_N*_{on,sym}_s1.json` — laws, duals, histories; `out/log_N1[06]_*.txt`.
- `dl/LawN256.lean`, `dl/README.md` — public AF Lean artifact files (read as data only).
