# e1-euler-anchor-heat-certificate: Euler-anchored heat-time certificate

**Verdict: precise obstruction. The decisive test 2π²c > C fails; no zero-free statement results; nothing below 7/8 or
0.874886647. NO QED.** The anchor of the heat family is known to power precision, but the quantity the certificate
needs small is not an error. It is the true compression deficit 1 − q of adjacent pairs at the anchor time, and the
Euler product fixes its size at ≍ 1/L², both signs, at every height. The effective exponent is
c_eff(L) = (2 log L + O(1))/L → 0. Measured: 4 of 246 pairs at γ ≈ 7.56·10⁶ already violate the certificate condition
at the κ = 2 anchor.

Labels: PROVED / CLASSICAL / ARGUED (leading-order model) / MEASURED / OPEN.

## 0. Sources and a naming correction

* Proposal: `formalization/rh-attempts/2026-11-01-r3-synthesis.md` §4 item 5 (never run before this file).
* "Prop L" in that proposal is **Proposition L of `2026-11-01-r3-theta-collision.md` §3.2** (anchor precision against
  the backward Lyapunov exponent of a zero pair of H_t). It is not Lemma L of `2026-11-01-contradiction.md` (Landau
  transport of the sinh direction). The graph node `landau-transport-lemma-l` and `offline-zero-visibility-law` are
  the Weil-side counterparts; they enter here only through the dictionary of §5. The assignment's formula
  "depth 2π²c/L against T* = C/L" is the theta-collision one, and that is what is tested.
* Heat-evolved von Mangoldt node (Lean, route 40): G_t(n) = exp(t log²n/4), β(t) ∗ G_t = D G_t, β_n(t) ≥ Λ(n) ≥ 0,
  nondecreasing for t ≥ 0. G_t(n) is exactly the Polymath15 coefficient b_n^t, so β_n(t) are the coefficients of
  −Z_t′/Z_t for Z_t(s) = Σ b_n^t n^{−s}. This is the object that controls the anchor (§2).

Notation as in the source: H_t(z) = ∫ e^{tu²}Φ(u)cos(zu)du, x = 2γ, L = log(x/4π), mean spacing s = 4π/L,
adjacent zeros a < b, d = b − a, y = d², y′ = 8 − 4Sy, q = Sy/2, κ = tL, saddle σ* = ½ + κ/4.

## 1. First lemma: certified depth against required depth

**Lemma 1 (PROVED given constant S; this is Prop N + Prop L of the source rearranged).** Let all zeros be real and
simple on (Λ, T], let the pair (a, b) collide at time Λ, and suppose S ≡ S₀ on (Λ, T]. Then
q(T) = 1 − e^{−4S₀(T−Λ)}. Hence if the anchor gives 1 − q(T) ≤ ε, no collision of that pair occurs in
(T − Δ, T], Δ = log(1/ε)/(4S₀). With the lattice value S₀ = L²/(8π²) and ε = (x/4π)^{−c} = e^{−cL}:

    Δ_cert = 2π² c / L.

**Required depth.** The anchor sits where the saddle σ* reaches the line used: Re s = B + η gives κ = C = 4(B − ½) + 4η,
T* = C/L, and the certificate has to reach t = 0. So the test is c > C/(2π²):

| anchor line | C | required c = C/(2π²) |
|---|---|---|
| (i) Re s = 1 + η (Euler product, \|ζ\| ≥ ζ(2σ)/ζ(σ)) | 2 + 4η | 0.101321·(1 + 2η) |
| (ii) Re s = 7/8 + η (Lean half-plane as input) | 3/2 + 4η | 0.075991·(1 + 8η/3) |
| Xu–Sang boundary 0.874886647 + η | 1.499547 + 4η | 0.075968 + … |
| first-term dominance (ζ(σ*) < 2, source Remark 2.3) | 4.9 | 0.248237 |

What "precision ε" has to mean: by Lemma 1 it is the bound on the **compression deficit 1 − q(T*)** of every adjacent
pair, not the accuracy with which the zero positions are known.

## 2. What the anchor gives: the deficit identity

**Lemma 2 (PROVED, exact).** At adjacent real simple zeros a < b of H_t, with v = H_t″/H_t′,

    1 − q = (d/4)·(v(b) − v(a)).

*Proof.* Lemma 1.3 of the source: ẋ_k = v(x_k), S = 2/d² − ḋ/(2d), so q = Sd²/2 = 1 − dḋ/4. ∎

**Lemma 3 (ARGUED; leading order in the Polymath15 form H_t = 2 Re A + small, A = M_t·Z_t(s*)).** With
Θ = arg A, a zero is a point where cos Θ = 0, and v = (2 log|A| + log Θ′)′ there. Since Θ′ = L/4 + O(1) and
ds*/dx = i/2 + O(t/x),

    1 − q = −(2π²/L²)·Re Σ_n β_n(t) (log n) n^{−s*}  + O(L^{−3}).

So the deficit is (2π²/L²)·a(x), where a(x) is a mean-zero almost periodic function of the height whose
coefficients β_n(t) log n are nonnegative (heat-evolved von Mangoldt positivity).

**Consequence (ARGUED from Lemma 3; CLASSICAL Fejér step).** A real almost periodic F(x) = Re Σ a_n n^{−ix/2} with
a_n ≥ 0 has mean of F·(1 − cos((x/2) log 2)) equal to −a_2/2, with a nonnegative weight of mean 1. Hence
inf F ≤ −a_2/2, on a relatively dense set. With a_2 = β_2(t) log 2 · 2^{−σ*} ≥ (log 2)² 2^{−σ*}:

    1 − q ≥ (π²/L²)(log 2)² 2^{−σ*}   for some pair in every sufficiently long window of heights.

Positivity of β_n(t) therefore **guarantees** compressed pairs at the anchor; it does not help the certificate. The
supremum over heights (all p^{−ix/2} = −1) is a_sup = g(σ*) − 4g(2σ*), g = (ζ′/ζ)′; values in `thresholds.json`
(3.17, 14.4, 97.5, 397 at η = 0.5, 0.25, 0.1, 0.05).

## 3. First decisive test

c_eff(L) := log(1/(1 − q))/L for the most compressed pair. By §2, c_eff = (2 log L − log(2π²a))/L → 0. The test
2π²c_eff > C reads 2 log L − log(2π²a) > CL/(2π²): the left side grows like log L, the right like L.

**Finite computation (`thresholds.py`, `thresholds.json`).**

| η | C | required c | L₀ with a = guaranteed (½ a_2) | L₀ with a = a_sup |
|---|---|---|---|---|
| 0.5 | 4.0 | 0.2026 | 31.5 | fails at every L |
| 0.25 | 3.0 | 0.1520 | 45.8 | fails at every L |
| 0.1 | 2.4 | 0.1216 | 61.1 | fails at every L |
| 0.05 | 2.2 | 0.1115 | 68.4 | fails at every L |

L₀ is the height (in L = log(x/4π)) above which the test fails for the stated a. For the guaranteed lower bound on
the deficit the test fails for all L > L₀ on a relatively dense set of heights; for the Kronecker extremal heights
it fails at every L. (For comparison, the source's Polymath-type precision 2^{−σ*} gives failure for L > 6.84 at
C = 2, 7.98 at C = 3/2, 4.82 at C = 4.9.)

**Answer: 2π²c > C is not attainable for any explicit anchor with a height-independent c > 0.** Any fixed c > 0
requires 1 − q ≤ x^{−c} for all pairs, and Lemma 3 gives 1 − q ≥ k/L² on a relatively dense set.

**Measured on the actual H_t (`anchor_deficit.py`; H_t from Lemma 1.5 as a Gaussian average of ξ, trapezoid rule,
40 and 80 nodes agree to all printed digits; q from Lemma 2 with the pair's own S; no model).** Condition tested
per pair: 1 − q < e^{−4S·T*} (the certificate reaches t = 0).

| L | γ | C | pairs | q range | a = (1−q)L²/2π² range | min depth/T* | min c_eff | required c | failing pairs |
|---|---|---|---|---|---|---|---|---|---|
| 6 | 2.5·10³ | 2 | 26 | 0.568..2.738 | −3.17..0.79 | 1.340 | 0.1400 | 0.1013 | 0 |
| 6 | 2.5·10³ | 1.5 | 26 | 0.492..3.048 | −3.74..0.93 | 1.449 | 0.1130 | 0.0760 | 0 |
| 10 | 1.4·10⁵ | 2 | 26 | 0.658..1.639 | −3.24..1.74 | 1.066 | 0.1072 | 0.1013 | 0 |
| 10 | 1.4·10⁵ | 1.5 | 26 | 0.563..1.828 | −4.20..2.22 | 1.102 | 0.0827 | 0.0760 | 0 |
| 14 | 7.56·10⁶ | 2 | 246 (5 windows) | 0.747..2.063 | −10.56..2.51 | 0.938 | 0.0982 | 0.1013 | **4** |
| 14 | 7.56·10⁶ | 1.5 | 16 | 0.768..1.404 | −4.01..2.30 | 1.237 | 0.1045 | 0.0760 | 0 |
| 18 | 4.1·10⁸ | 2 | 10 | 0.876..1.202 | −3.32..2.03 | 1.060 | 0.1161 | 0.1013 | 0 |
| 18 | 4.1·10⁸ | 1.5 | 10 | 0.819..1.304 | −4.98..2.97 | 1.132 | 0.0949 | 0.0760 | 0 |

Failing pairs at C = 2 (left zero x; 1 − q; threshold e^{−4ST*}): x = 15116951.6026 (0.20676 vs 0.19523);
15116952.3475 (0.20227 vs 0.18478); 15121485.0882 (0.18847 vs 0.18802); 15130545.7545 (0.23227 vs 0.21108).
The deficit scales as predicted: a stays O(1) of both signs (compressed side 0.8 to 2.5; at σ* = 1 the series is on
its abscissa and a grows slowly), so 1 − q ≍ 1/L². Two of the L = 14 windows returned 58 zeros where 59 were
expected (grid s/6): a missed close pair, if present, is more compressed than those listed.

The test kills the combination as stated: the anchor's "precision exponent" is zero.

## 4. Second, independent failure: the certificate is unsound without S transport

The proposal says "no S transport". Lemma 1 needs S ≥ S₀ on (Λ, T*], which is Claim 5 of the source (exact form
Claim M: measured false for ζ). The depth is not small on the scale of the dynamics: 4S·T* = CL/(2π²) (1.4 at
C = 2, L = 27), so S is not constant over it. The control E_a makes this structural (§6): there every pair has
collided below its anchor, yet the anchor deficits have both signs, and Lemma 1 with constant S would "certify" the
pairs with q ≥ 1.

## 5. If it had worked: the reach, and the fixed point

Granting Claim 5, the lattice S and the source's absorption law (zero at depth δ ↔ collision at κ = 4δ), a deficit
bound ε certifies collisions only down to κ = C − (2π²/L)log(1/ε), i.e. excludes zeros with

    Re s > B + η − (π²/2L)·log(1/ε).

* (i) B = 1, worst-case bound from the Euler product ε = 2π²/(ηL)² (a ≤ g(1+η) ≈ 1/η²): reach
  1 + η − (π²/2L)log(η²L²/2π²), interior minimum at η = π²/L equal to **1 + 1.992/L**; for η < √2·π/L the bound is
  ≥ 1 and the certified depth is 0. Reach > 1 for every η. (ARGUED)
* (ii) B = 7/8, bound under ZF(7/8) from the zero sum, |(ζ′/ζ)′| ≤ L/(2η) + O(L), ε = π²/(ηL): reach
  7/8 + η − (π²/2L)log(ηL/π²), increasing for η ≥ π²/L where it equals 7/8 + π²/L; below that the depth is 0.
  Reach > 7/8 for every η. (ARGUED; CLASSICAL zero-sum bound)

So the loop map is f(θ) = θ at θ = 1 and at θ = 7/8 (rows Z16, P14): the anchor returns the half-plane it was given.
**No zero-free statement results; nothing to compare with 0.874886647 except that the output is ≥ the input.**
Weil-side dictionary (Lemma L / visibility law of the contradiction file): a zero at depth δ becomes visible at
support (2δ log γ)^{1/δ}, and a one-height all-support floor with exponent δ + θ is the half-plane ½ + θ; the
heat-side statement above is the same exchange, with κ = 4δ in place of the exponent.

## 6. Controls

| control | step that fails | status |
|---|---|---|
| ζ_W (route-42 window replacement; no Euler product) | Lemma 3: its anchor is not given by nonnegative β_n. Its off-line quadruple (Λ_W ≈ 2δ²) leaves at T* a deficit e^{−4S(T*−Λ_W)} ≈ x^{−C/2π²}, a power of x, which is **smaller** than ζ's own Euler-induced deficit 2π²a/L² once L > L₀. The anchor cannot separate ζ from ζ_W above L₀: the signal of a past collision is below the arithmetic modulation. | ARGUED |
| DH (zeros to Re s = 1.1203625) | No anchor at κ = 2 + 4η for η < 0.12: non-real zeros of the DH heat family persist to κ ≈ 4(1.1203625 − ½) = 2.48 by the absorption law; no bound \|L\| ≥ ζ(2σ)/ζ(σ); coefficients of −L′/L not ≥ 0. | ARGUED (absorption law heuristic) |
| E_a = ζ(s+a)ζ(s−a) | Anchor moves to C_a = 2 + 4a + 4η with nonnegative coefficients Λ(n)(n^a + n^{−a}); Lemmas 2–3 hold verbatim. All pairs collided at κ ≈ 4a < C_a, yet a(x) has both signs, so pairs with q ≥ 1 exist and the constant-S certificate would certify them. Fails at Claim 5, not at the anchor: the anchor step does not see the size normalisation. | ARGUED |
| backward heat Φ_ε = e^{−εu²}Φ | Anchor data at time t are ζ's at t − ε; nothing in Lemmas 1–3 locates t = 0. Required depth becomes C/L + ε; coefficients G_{−ε}(n) are not multiplicative at t = 0 (Euler product destroyed) and β_n(t) ≥ 0 is not available for t < 0. A certificate with open margin would also hold for small ε, where vortices exist in (0, ε]. | ARGUED |
| sign twist Λ → ε_nΛ, ε completely multiplicative | The Euler lower bound \|F(s)\| ≥ ζ(2σ)/ζ(σ) holds. What fails: no functional equation, so B = conj A and H_t = 2 Re A (real zeros = phase crossings) are not available, i.e. there is no heat family with a real-zero anchor; also β_n(t) ≥ 0 is lost. For a Dirichlet character (functional equation present) everything in §§1–3 holds with the same failure of the test. | ARGUED |

Requirement check. All primes: yes, through Z_t and β_n(t). Per-height with height-independent constants: **no**,
c_eff ~ 2 log L / L. Fails for controls structurally: E_a passes the anchor step, so the anchor step alone separates
nothing; the separation would have to come from Claim 5.

## 7. Pivot (one, adjacent): use the Euler product for the exact anchor deficit instead of a bound

Since q(T*) is computable from primes (Lemma 3), compare the exact identity q(T) = 1 − e^{−4∫_Λ^T S} (source (★))
with the exact prime-side value instead of a bound. A collision at Λ then requires
∫_Λ^{T*} S = (1/4) log(1/(1 − q(T*))) for a pair with q < 1, and is excluded outright for a pair with q(T*) ≥ 1
**only if** S is nonincreasing backward, which is Claim M (measured false). For q < 1 the condition asks for
∫S to relative precision e^{−4∫S}·q (Prop N), i.e. zero positions below the anchor. The pivot stops at the same
place as the source: wall 3 (zero positions at the vortex height), not at the anchor. Not pursued further.

## 8. What is established

1. Lemma 1 and the table of required exponents (PROVED given constant S).
2. Lemma 2, the exact deficit identity 1 − q = (d/4)(v(b) − v(a)) (PROVED).
3. Lemma 3 and the lower bound 1 − q ≥ (π²/L²)(log 2)² 2^{−σ*} on a relatively dense set (ARGUED, leading order).
4. The test 2π²c > C fails for every fixed c > 0; thresholds L₀ in §3 (finite computation on 3).
5. MEASURED: deficits ≍ 1/L² of both signs at L = 6, 10, 14, 18; 4 failing pairs of 246 at L = 14, C = 2.
6. Reach ≥ input half-plane for anchors (i) and (ii) (ARGUED): f(θ) = θ.

Nothing here changes a zero-free region or a Λ bound.

## 9. Three weakest steps

1. **Lemma 3 is leading-order, not proved.** It uses H_t = 2 Re A with the Polymath15 A and drops the truncation at
   n ≤ √(x/4π) and the growth of b_n^t (the series Z_t diverges; with the truncation the effective abscissa of term
   n is σ* − (t/4) log n ≥ ½ + κ/8, so absolute convergence needs κ > 4, not κ > 2 as in the source's saddle
   heuristic). The measured a(x) is O(1) with both signs, consistent with Lemma 3, but Lemma 3 was not compared
   term by term with the measurement.
2. **The measurement is small.** 246 pairs at one height for the failing case; no failure was seen at L = 18 in 10
   pairs or at C = 1.5 in any sample (the C = 1.5 threshold is weaker, and its predicted crossing is at larger L).
   Float arithmetic at 30 digits with finite-difference derivatives (step 10⁻⁴ s); not interval-certified. Margins
   of the four failures are 0.2% to 10% of the threshold.
3. **The reach computation of §5 and the DH/ζ_W rows rest on the source's heuristic absorption law** (κ = 4δ) and
   on the lattice value of S. They are stated as ARGUED. The conclusion f(θ) = θ does not depend on the constants
   (any bound ε ≥ k/L^m gives certified depth O(log L / L) in κ, hence O(log L / L) in δ after an anchor offset
   η ≳ 1/L), but the numbers 1.992/L and π²/L do.

## 10. Files

* `anchor_deficit.py` (args: L C pairs nodes) and `anchor_L*_C*_n*.json`: measured q, S, deficit per pair.
* `thresholds.py`, `thresholds.json`: required exponents, L₀ table, reach.
Runs: `scripts/memcap.sh 8 .venv-arb/bin/python <script>`; each under 20 minutes, single process.
