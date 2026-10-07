# MV-CAP as a theorem: window-replacement counter-models for the lane hypothesis H_desc

Date: 2026-10-07. Route 42 of `formalization/routes/fifty-routes-2026-10-06.md`. Branch `editorial-redesign`; working
files only, nothing committed. Scripts and outputs: `tmp/routes-b5-r42-*.py`, `tmp/routes-b5-r42-out/`.

Grades used below: PROVED (complete argument written here, internal referee only); CERTIFIED-FLOAT (a finite
computation inside a proof, done in IEEE double with a stated safety margin, not interval arithmetic); CONDITIONAL;
MEASURED (floating point at a proxy height, or a model); HEURISTIC.

RH is open. PT Λ ≤ 0.2 is the accepted benchmark. Nothing here changes any Λ bound. NO QED.

> **Referee corrections (internal referee, 2026-10-10; severity MAJOR; recorded in
> `src/data/route-42-formal-mv-cap-2026-10-10.js`). These override the text below where they conflict.**
> 1. *Proposition E is false as stated for the Theorem A model.* By (R5), ζ_W/ζ → κ = Q_W(1)/Q_{W′}(1) ≠ 1 as t → ∞, so
>    the unshifted ζ_W changes a mean square by ≈ |κ² − 1|·T log T and fails every O-form premise with error o(T log T).
>    m₁ = 0 does not give κ = 1 (m₁-matched proxy: log κ = 3.78e-9). Corrected: the κ = 1 shifted variant (all of W′
>    shifted so Q_{W′}(1) = Q_W(1); zeros move ≤ |m₁|/n ≈ 3–4.2, window ≈ ±54) satisfies every O-form premise with
>    E(T) ≥ const, but lies in 𝒜(≈ 19), not 𝒜(1.4936); its p_viol ≈ 3.014. Inside the window the Theorem C / Corollary D
>    sensitivities rise from 19.3 to ≈ 36 zeros (outside: N₀ still 2, density still 1).
> 2. *Scope.* MV-CAP is proved (internal) for zero-side statistics (N₀, simple-critical counts, N(σ,T), N(T) bounds, linear
>    statistics, normalised pair/form-factor sums) and, via the κ = 1 variant, for O-form premises. It is NOT established
>    for explicit function-side L² / large-sieve mean values — and the Theorem A construction is itself excluded at the
>    proxy height (MEASURED, c₀ = 5e5) by an explicit σ = 2 Montgomery–Vaughan short-interval mean value
>    (Δ∫_{c₀±150}|ζ(2+it)|² ≈ +2.18e4 against baseline 324 and error ≈ 10; even (100,1,0.17) gives 123) and by
>    |ζ(1+it)| ≤ ¾ log t (|ζ_W(1+ic)| ≈ 187 vs 9.8). "H_desc-mirror is cheap to violate on the function side" is withdrawn.
> 3. *Heat-flow threshold at N1\** is truncation-dependent: at L = 300 the 13-spacing case gives Y(t₀) = 0.1666
>    (marginal); read "≥ 13, possibly 15". The seam threshold (7 spacings, y* = 0.99) is confirmed at L = 300.
> 4. *Overstatements in PROVED sections:* Theorem C's Weil/Hermitian-compression row (Alpöge–Furman, Lamzouri) has no
>    argument; Corollary D's Levinson example (q undefined, "errors ≥ T^{1/2}") is unsupported; Levinson/Conrey/PRZZ are
>    effective but not explicit (not "ineffective"); (R5) second-order term is O(nh²/a²); ⌊σ/2⌋ holds only for T outside
>    every window; "slack < 1.4935" for explicit-bound premises also needs B̃ nondecreasing and slowly varying.
> 5. Theorem A numbers reproduced independently (lattice max 2.9906 at n = 605, K = 1.4934, outer 0.0213, p_viol 3.0119;
>    B×2 / B×3: 3.1601 / 3.3218). H_desc-mirror failure for t > 0 remains conditional on Lemma 5.

---

## 0. Outcome

The informal MV-CAP of `proportion-to-all-bridge-2026-09-22` / `lane-arithmetic-input-audit-2026-09-22` ("no mean
value certifies an every-window statement") is replaced by four precise statements. Theorem C and Proposition E
narrow the original claim.

1. **Counter-model at every window (Theorem A, PROVED + CERTIFIED-FLOAT).** Take any centre c in the lane
   [3.1·10^12, 7.50·10^16] (zeta ordinates; x = 2c ∈ [X, 4πN₁*²]). There is an explicit function ζ_W with these
   properties:
   * it has the functional equation, reality, order 1 and residue 1 of ζ;
   * its zeros agree with those of ζ outside the ordinate window (c−50, c+50];
   * it preserves the classical explicit zero-free region;
   * it keeps every explicit bound on the zero-counting error, up to an additive K = 1.4935;
   * for every p > 3.0119 it violates H_desc(p) of the lane audit, and the inequality of H_desc-mirror(p) of the
     mirror-descent record evaluated at t = 0. Failure of the mirror statement itself (t > 0) is Corollary A″,
     conditional on a continuity lemma.

   The lane hypothesis needs p_req = 4.3743. The bound p_viol ≤ 3.0119 holds uniformly in c. With the N(T)-error
   constant tripled it becomes 3.3218.
2. **Formal MV-CAP (Theorem B, PROVED; elementary once Theorem A is in hand).** Let 𝒫 be any set of premises
   about ζ. If ζ_W satisfies every premise in 𝒫 for one window of the lane, then no argument that is valid for all
   admissible functions derives H_desc(p_req) on the lane from 𝒫. The condition holds when each premise's slack at ζ
   exceeds its window sensitivity s_Π(W).
3. **Explicit sensitivities (Theorem C, PROVED).** For the zero-side mean-value premises used anywhere in the
   project the sensitivities are:

   | Premise | Sensitivity |
   | --- | --- |
   | critical-zero counts N₀, simple-critical counts (Levinson, Conrey, PRZZ, Alpöge–Furman, Lamzouri) | decrease by at most 2 zeros for T outside the window, and by at most 19.3 inside it (4 in the proxy realisation) |
   | density counts N(σ,T), σ > 1/2 (Guth–Maynard and all density theorems) | increase by at most 1 |
   | N(T) | moves by at most 2B + K ≤ 17.3 inside the window and not at all outside; every explicit bound \|E_N\| ≤ B̃ survives as B̃ + 1.4935 |
   | Montgomery pair-correlation sums, normalised | change by at most 9.3·10⁻⁹ at T = 3.1·10^12 and 3.6·10⁻¹³ at T = 7.5·10^16 |

   So a certificate of H_desc on the lane built from such premises must contain one that ζ satisfies with slack
   below 19.3 zeros (below 2 if the premise only concerns T outside the window) out of N(T) ≈ 1.3·10^13 to
   4.3·10^17. That is relative precision ≤ 1.5·10⁻¹² down to 4.5·10⁻¹⁷, i.e.
   resolution at the level of one window (≤ 20 zeros), which is RH-to-height information (MV-CAP (H2)).
4. **Function-side moments (Proposition E, PROVED for O-form premises; MEASURED otherwise).**
   * Asymptotic (O/o-form) premises carry no information at any finite height. ζ_W satisfies every such premise
     whose error function grows faster than log² T (every known error term does).
   * For premises with explicit constants the obstruction is **quantitative and depends on the gap**. The
     deficits that defeat H_desc-mirror cost little: at the proxy height 5·10^5 the minimal one-pair modification
     changes ∫|ζ|² locally by −2.4, against a true-error RMS of 104.
   * The holes that defeat the lane target (iii) itself are larger. In the heat-flow model they span 7–17 mean
     spacings, and they raise |ζ| on the critical line by factors e^{≈ deficit}: 38× to 8·10^7× measured at the
     proxy height. Explicit second-moment information at the window height can see the large ones.
   * Hence "mean values cannot certify the lane" is proved here only for zero-side and O-form premises. For
     explicit function-side moments it is **not established** and is partly false for large holes.
5. **Sharpness and non-vacuity (sections 7–8).**
   * Premises that do resolve a single window certify H_desc or exclude ζ_W: RH to Γ₁ has slack 0, and direct
     Euler-product evaluation at s = 3 + ic gives |log ζ_W/ζ| = 0.33–3.6 measured.
   * The violated hypothesis is not an artefact of a loose sufficient condition. In the polynomial heat-flow model
     the counter-model's off-line pair stays above y₀ at t₀ = 0.1314 once the hole is ≥ 7 mean spacings at the seam
     or ≥ 13 at N₁*. The time it stays nonreal tends to y*²/2, de Bruijn's value, as the hole grows (MEASURED).

---

## 1. Setting

**Conventions** (as in the lane audit and the mirror-descent record):
* H_0(z) = ξ((1+iz)/2)/8, and H_t(z) = ∫_0^∞ e^{tu²} Φ(u) cos(zu) du.
* A zero ρ = β + iγ of ζ corresponds to z = x + iy with x = 2γ and y = 1 − 2β. A conjugate pair x ± iy is the pair
  ρ, 1 − ρ̄ (same ordinate, β = 1/2 ∓ y/2).
* Real zeros of H_0 have density ln N/(2π) per unit x at x = 4πN². Zeros move by dz_k/dt = 2 Σ_{j≠k} 1/(z_k − z_j).

**Lane** (lane audit, row U = 0.145: t₀ = 0.1314, y₀ = 0.165):
* ln N₁* = (2c₀ − y₀)/t₀ + L₀ = 18.50934, where c₀ = 1.2218525 and L₀ = 1.1676005 (imp-95218).
* In ordinates the lane is T ∈ [X/2, Γ₁] = [3.0·10^12, 7.502·10^16], with N_seam = 690988.
* Window centres below are taken in [3.1·10^12, 7.50·10^16]. The scripts run to 7.54·10^16, and the bounds are
  monotone in c.

**Counting.**
* M(T) = (T/2π) log(T/2πe) + 7/8, M′(T) = log(T/2π)/(2π), and E_N(T) = N(T) − M(T).
* Input (Trudgian 2014, Cor. 1; constants as quoted, not re-derived): for T ≥ e,
  |E_N(T)| ≤ B(T) := 0.112 log T + 0.278 log log T + 2.510.
* B(3.1·10^12) = 6.665 and B(7.5·10^16) = 7.879. Table A (section 4) shows that the main configuration
  (h, k₀) = (50, 2) survives replacing B by 3B; two auxiliary rows do not.

**Zero-free region.** β < 1 − 1/(5.558691 log T) (Mossinghoff–Trudgian–Yang). On the lane this means β < 0.99375.

**H_desc(p)** (lane audit 3(A)). For every t ∈ [0, t₀] and every nonreal zero z = x + iy, y > 0, of H_t such that:
* x ≥ X and 4πN_seam² ≤ x ≤ 4πN₁*², and
* z is topmost within horizontal distance 2 (y ≥ y_j whenever |x − x_j| ≤ 2),

the real zeros satisfy P(z) := Σ_{x_j real} 2y/((x − x_j)² + y²) ≥ p.

**H_desc-mirror(p)** (mirror descent B1). The same statement for t ∈ (0, t₀], y ≥ y₀, x ≥ X + 1, with P replaced by
M_t(z) = Σ_real 2y/(D² + y²) + Σ_{nonreal, |D|<2} 2y/(D² + 4y²) + Σ_{nonreal, |D|≥2} K_Y(D),
where K_Y(D) = f(Y + y) − f(Y − y) and f(h) = h/(D² + h²).

H_desc(p) implies H_desc-mirror(p) because M_t ≥ P termwise. Either one yields Λ ≤ 0.145 with
p = p_req(0.1314, 0.165) = 4.3743, which solves ∫_{y₀}^1 Y/(1 + pY) dY = t₀. This also needs P15 Thm 1.2 (i)–(ii)
and the technical residuals flagged in those records.

**Elementary kernel bound used throughout.** For |D| ≥ 2 and 0 < y ≤ Y ≤ 1:
* 2y/(D² + y²) ≤ 2y/D², and
* K_Y(D) ≤ 2y · sup_h f′(h) ≤ 2y/D², since f′(h) = (D² − h²)/(D² + h²)² ≤ 1/D².

So the kernel k(D) := 2y/D² dominates both the real-zero term and every far nonreal term of M_t.

---

## 2. Window replacement (realisation lemma)

**Lemma 1 (PROVED).** Setup:
* Let W be a finite multiset of zeros of ξ, with multiplicity, all with ordinates in an interval (a, b] ⊂ (0, ∞),
  closed under ρ ↦ 1 − ρ̄. Let W̄ be its conjugate.
* Let W′ be any multiset of the same cardinality n, with ordinates in a bounded set, real parts in (0, 1), and closed
  under ρ ↦ 1 − ρ̄.
* Set Q_V(s) := Π_{ρ ∈ V ∪ V̄} (s − ρ), κ := Q_W(1)/Q_{W′}(1), and ξ_W := κ ξ Q_{W′}/Q_W.

Then:

* (R1) ξ_W is entire of order 1, and ξ_W(s) = ξ_W(1 − s).
* (R2) ξ_W(s̄) = conj ξ_W(s). In particular ξ_W is real on R and on the critical line.
* (R3) ξ_W(1) = ξ(1) = 1/2. Hence ζ_W := ξ_W / (½ s(s−1) π^{−s/2} Γ(s/2)) has a simple pole at s = 1 with residue 1,
  the trivial zeros of ζ, and the functional equation of ζ.
* (R4) The zero multiset of ξ_W is (Z(ξ) ∖ (W ∪ W̄)) ∪ W′ ∪ W̄′.
* (R5) Q_{W′}/Q_W → 1 as |s| → ∞, uniformly off a neighbourhood of the window. So ζ_W(s)/ζ(s) → κ. If
  m₁ := Σ_{W′} γ − Σ_W γ is the first-moment difference, then |log κ| ≤ 2|m₁|/a + O(n/a²). For Theorem A,
  |m₁| ≤ 2h(K + 2B), so |log κ| ≤ 2·10⁻⁹.
* Alternatively, shift all of W′ by one real amount so that Q_{W′}(1) = Q_W(1); then κ = 1, and m₁ = 0 to first order.
  log Q_{W′}(1) is strictly increasing in the shift, so the amount is unique. The shift moves every new zero by the
  same amount, so the internal geometry and the pull bounds do not change. The count inflation K can, however, grow
  by up to ρ|shift|; this is a rigorous worst case of ≈ 18, and 2 in the proxy realisation. Theorem A uses the
  unshifted version.

*Proof.*
* Q_W divides ξ: every root of Q_W is a zero of ξ of at least that multiplicity. So ξ_W is entire, and (R4) holds.
* Order: |Q_{W′}/Q_W| is bounded off a compact set and tends to 1, so ξ_W has the order and type of ξ.
* Reality: W ∪ W̄ is closed under conjugation, so Q_W has real coefficients.
* Symmetry: it is closed under ρ ↦ 1 − ρ, since 1 − ρ = conj(1 − ρ̄). Hence Q_W(1 − s) = (−1)^{2n} Q_W(s) = Q_W(s).
  The same holds for W′. This gives (R1) and (R2).
* (R3) is the choice of κ.
* (R5): pairing each ρ with ρ̄ gives log Q_V(1) = Σ_{ρ∈V} log((1 − β)² + γ²). Moving a zero changes a term by
  2Δγ/γ + O(1/γ²). Summing over the n zeros gives the bound for log κ, with an O(n/a²) error. ∎

ζ_W is not a Dirichlet series. That is intended: any deduction using a Dirichlet-series or Euler-product identity at
the window height lies outside the premise class of section 5.

---

## 3. The regularised window W(c; h, k₀, y*)

**Definition.**
* Fix h > 0, k₀ ≥ 1 and y* ∈ (0, 0.9]. Choose a = c₀ − h and b = c₀ + h with no zero ordinate at a or b.
* Let W be all zeros of ξ with ordinate in (a, b], with multiplicity, real or not. Let n = |W| = N(b) − N(a).
* Put n′ = n + 2k₀ − 2 and λ′ = n′/(M(b) − M(a)). Define slots t_1 < … < t_{n′} by λ′(M(t_k) − M(a)) = k − ½.
* Let c be the midpoint of the two central slots. Delete the 2k₀ slots nearest c (k₀ on each side).
* W′ = the remaining n − 2 slots, as zeros on the critical line, together with the pair ½ ± y*/2 + ic. In H_0
  coordinates the pair is z* = 2c + iy* and its conjugate.

The count is n′ − 2k₀ + 2 = n. The pair has β = ½ ± y*/2 ≤ 0.95, inside the zero-free region.

M is linear on the window to relative accuracy ≤ h²/(4πa M′) < 10⁻¹⁰. The scripts place the slots linearly and carry
a safety margin of 10⁻⁶ in every pull bound.

**Lemma 2 (counting; PROVED + CERTIFIED-FLOAT).** Let I(T) be the interpolation between E_N(a) and E_N(b) that is
linear in M. Then for all T:

  E_{N_W}(T) − I(T) = #{w ∈ W′: γ(w) ≤ T} − n (M(T) − M(a))/(M(b) − M(a)).

This is independent of the unknown values N(a) and E_N(a). Hence

  |E_{N_W}(T)| ≤ max(|E_N(a)|, |E_N(b)|) + K ≤ B(T) + K + 10⁻¹⁰ for T ∈ (a, b],

where the 10⁻¹⁰ covers B(b) − B(T) ≤ 0.112·2h/a. Relative to ζ, |N_W(T) − N(T)| ≤ |E_N − I| + K ≤ 2B(b) + K. Here
K = sup_T |E_{N_W} − I| is a finite computation over the jump points.

* For k₀ = 1, K = 1 (lattice rounding ½ plus pair ½).
* For (h, k₀) = (50, 2), K ≤ 1.4935 over the whole admissible n-range.
* Outside (a, b], N_W = N.

So ζ_W satisfies every explicit bound |E_N| ≤ B with B replaced by B + K.

The admissible range of n is [M(b) − M(a) − 2B(b), M(b) − M(a) + 2B(b)]. Every bound below is a maximum over all
integers n in that range, because n is not known at these heights.

**Lemma 3 (outer zeros; PROVED).** Let F(u) = y/(2u²), which is the kernel k(D) at D = 2u in ordinate units. Then
for the zeros of ζ outside (a, b]:

  Σ_{γ ∉ (a,b], γ > 0} F(γ − c) + Σ_{γ > 0} F(γ + c)
   ≤ M′(2c)·y/(2(b − c)) + M′(c)·y/(2(c − a)) + B(2c)·y·[(b − c)^{−2} + (c − a)^{−2}] + 10⁻⁹.

*Proof.* Right side, over (b, 2c]:
* Write N = M + E_N and integrate by parts in the Stieltjes integral.
* ∫ F dM ≤ M′(2c) ∫_{b−c}^∞ F.
* Since F is decreasing, |∫ F dE_N| ≤ F(U)|E(U)| + F(b − c)|E(b)| + sup|E|·(F(b − c) − F(U)) ≤ 2 sup_{[b,2c]} |E| · F(b − c).
* sup|E| ≤ B(2c), because B is increasing.

Left side over [c/2, a]: the same argument with M′ ≤ M′(c).

Tails:
* γ > 2c contributes ≤ Σ 2y/γ² ≤ 4y(ln 2c + 1)/(2c).
* γ < c/2 contributes ≤ N(c/2)·2y/c² ≤ y ln c / c.
* Negative ordinates contribute ≤ (y/2) ∫ dN/(c + γ)².

On the lane all three are < 10⁻¹⁰. ∎

A floating-point check against 1600 random windows at heights 2·10^5–5.5·10^5 with the actual zeros gives exact/bound
≤ 0.819 (`checks.json`; MEASURED sanity check, not part of the proof).

**Lemma 4 (inner sum; CERTIFIED-FLOAT).** The lattice part Σ_{w ∈ W′ real} 2y*/((2(γ_w − c))² + y*²) depends only on
(n, h, k₀, y*). It is computed exactly in double precision for every admissible n (`routes-b5-r42-pviol.py`,
`routes-b5-r42-uniform.py`).

The nearest kept slot lies at x-distance 0.82 from z* in the main configuration, and at least 0.57 in every row of Table A. This exceeds y* in each row. So the sum is increasing in y* on (0, y*], and a bound at
y* = Y covers every y* ≤ Y.

---

## 4. Theorem A: H_desc fails for ζ_W at every window of the lane

**Theorem A (PROVED, modulo the double-precision finite computation of Lemma 4 with margin 10⁻⁶).** Let
(h, k₀, y*) = (50, 2, 0.17) and c₀ ∈ [3.1·10^12, 7.50·10^16]. Let ζ_W be built from W(c; 50, 2, 0.17) by Lemma 1.

Properties of ζ_W:
* It satisfies (R1)–(R5).
* Its zeros coincide with those of ζ outside the ordinate window (c₀ − 50, c₀ + 50].
* Its window holds 416 ≤ n ≤ 605 zeros.
* |E_{N_W}| ≤ B + 1.4935.
* Its new zeros are simple. N_W(σ, T) ≤ N(σ, T) + 1 for every σ > ½. N₀(T) decreases by at most 2 for T outside the
  window and by at most 2B + K + 2 ≤ 19.3 inside it (section 5).

The zero z* = 2c + 0.17i of H_0^W satisfies the hypotheses of H_desc and H_desc-mirror:
* nonreal, with y = 0.17 > y₀;
* in the lane;
* topmost within horizontal distance 2, since inside x-distance 100 the only other zeros are real slots and z̄*.

And

  P_0(z*) ≤ M_0(z*) ≤ 3.0119 < 4.3743 = p_req.

Hence H_desc(p) fails for ζ_W for every p > 3.0119, and so does the t = 0 instance of the mirror statement.

*Proof.* By the kernel bound of section 1, P_0(z*) and M_0(z*) are bounded by the lattice sum (Lemma 4) plus the
outer sum (Lemma 3). Both are nondecreasing in c₀:
* the admissible n-range only grows with c₀;
* M′ and B increase with c₀.

So the bound at the top of the lane covers all of it. Take every integer n between the smallest admissible count
at c₀ = 3.1·10^12 and the largest at 7.54·10^16, i.e. n ∈ [416, 605]:

  max_n [lattice(n) + outer(n; 7.54·10^16)] + 10⁻⁶ = 2.9906 + 0.0213 + 10⁻⁶ ≤ 3.0119

(script output; the maximum is attained at n = 605).

Topmost: the window's real zeros have y = 0 < 0.17. The zeros of ζ outside the window lie at x-distance
≥ 2·min(c − a, b − c) ≥ 98 > 2. ∎

**Table A (CERTIFIED-FLOAT; `uniform.json`, `checks.json`).** Uniform over the stated centre range. The last three
columns repeat the bound with B scaled by 1, 2 and 3.

| centres c₀ | (h, k₀, Y) | n range | K | p_viol (B) | p_viol (2B) | p_viol (3B) |
|---|---|---|---|---|---|---|
| [3.1e12, 7.5e16] | (50, 2, 0.17) | 416–605 | 1.494 | **3.0119** | 3.1601 | 3.3218 |
| [3.1e12, 7.5e16] | (25, 2, 0.17) | 201–310 | 1.487 | 3.1811 | 3.5102 | 3.8325 |
| [3.1e12, 1e15] | (100, 1, 0.17) | 844–1055 | 1.000 | 4.2151 | 4.3303 | 4.4468 (> 4.3743) |
| [3.1e12, 7.5e16] | (50, 9, 0.9) | 416–605 | 8.27 | 3.7369 | 3.9170 | 4.1127 |
| [3.1e12, 7.5e16] | (25, 9, 0.9) | 201–310 | 8.06 | 4.1082 | 4.5179 (> 4.3743) | 4.9184 (> 4.3743) |

Notes on the rows:
* k₀ = 1 means only two slots are given to the pair, with no extra hole. It suffices up to 10^15. Above that,
  neutral-lattice pull at y = 0.17 exceeds p_req (5.3 at ln N₁*), which is the mirror-descent C1 observation
  (4.42 > 4.37).
* For the P15 headline row (p_req = 2.17), the bound drops below 2.17 at y* = 0.9 only with k₀ = 10 (seam) and
  k₀ = 20 (top), using h = 25. That row is not needed here.

**Remark A′ (literal H_desc is weaker than needed; PROVED).** For the real-only P of H_desc at t = 0, a cheaper
counter-model exists.
* Pair consecutive window zeros (γ_a ≤ γ_b). Replace each pair by a nonreal pair at a common ordinate c_g ∈ [γ_a, γ_b]
  at height ε_g < y*.
* Choose c_g where E_N changes sign on [γ_a, γ_b), or else at the endpoint in the direction that reduces |E_N|. This
  gives |E_{N_W}(T)| ≤ max(|E_N(T)|, 1) for all T. So **every explicit N(T) bound with B ≥ 1 is preserved
  exactly**.
* If n is odd, extend the window by one zero.
* Give the central pair height y*. Then P(z*) is only the outer sum. The central ordinate lies within two gaps of
  the window centre, and gaps are ≤ 3.1 by the B-bound, so the outer zeros are at ordinate distance ≥ h − 6.2. Lemma 3
  then gives P(z*) ≤ 0.06 at y* = 0.17 and ≤ 0.3 at y* = 0.9, for h = 50.

The low pairs collapse onto the real axis within time ε_g²/2 and then act like real zeros. So this violates the
letter of H_desc but not H_desc-mirror for t > 0. Theorem A's construction is the robust one.

**Corollary A″ (t > 0; CONDITIONAL on Lemma 5).** For the ζ_W of Theorem A, H_desc-mirror(p) fails for every
p > 3.0119: it fails at the zero z*(t) for all sufficiently small t > 0.

**Lemma 5 (continuity; sketch, not written in full).**
* What is proved here. Write H_0^W = H_0 q with q rational and even. By partial fractions, H_0^W is a combination of
  H_0 and the functions H_0(z)/(z − v) at zeros v of H_0. Each of these is the Fourier transform of
  Ψ(s) = i·sgn(s) ∫_{|u|>|s|} Φ(u) e^{iv(u−s)} du. Here the exponential tail cancels because H_0(v) = 0, and
  |Im v| < 1. So Ψ inherits the super-exponential decay of Φ.
* Consequences. H_t^W := ∫ e^{tu²} Φ_W(u) e^{izu} du is defined for all t ≥ 0 and tends to H_0^W locally uniformly
  as t → 0+. By Hurwitz, z*(t) is continuous and stays simple, and simple real zeros stay real.
* What is not written. M_t(z*(t)) → M_0(z*) needs uniform tail control. That would follow from a zero count of H_t^W
  in unit intervals of size O(log x), uniform for t ∈ [0, t₁]. This is the Ki–Kim–Lee / Rodgers–Tao counting
  argument transported to H_t^W; it is not written here.

---

## 5. Premises, sensitivity, slack: the formal MV-CAP

**Admissible functions 𝒜(K₀).** These are the functions F for which ξ_F := ½ s(s−1) π^{−s/2} Γ(s/2) F satisfies:
* (R1)–(R3);
* all zeros have 0 < β < 1 and obey the zero-free region of section 1;
* |E_{N_F}| ≤ B + K₀.

Then ζ ∈ 𝒜(0), and ζ_W ∈ 𝒜(1.4936) for the Theorem A windows (by Remark A′ the real-only variant is in 𝒜(0)). Both
agree with ζ in every zero outside the window. So ζ_W also satisfies every premise that depends only on zeros outside
the window. Examples: RH verified to 3·10^12, and any finite table of zeros below c₀ − 50.

**Premises.** A premise Π is a statement "Φ_T(F) ∈ I_T for all T ∈ 𝒯_Π", where Φ_T : 𝒜 → R and I_T ⊂ R. Its
**window sensitivity** at W is s_Π(W) := sup_T |Φ_T(ζ_W) − Φ_T(ζ)|. Its **slack** is
σ_Π := inf_T dist(Φ_T(ζ), R ∖ I_T).

**Theorem B (formal MV-CAP for the lane; PROVED).** Let 𝒫 be a set of premises true for ζ. Suppose some centre
c₀ ∈ [3.1·10^12, 7.50·10^16] makes ζ_W (Theorem A) satisfy every Π ∈ 𝒫; for instance σ_Π > s_Π(W) for all Π. Then
there is no derivation of H_desc(p), for any p > 3.0119 (in particular p_req = 4.3743), from 𝒫 together with the
axioms defining 𝒜(1.4936). The same holds for H_desc-mirror(p), conditional on Lemma 5. Formally,
𝒫 ∪ Ax(𝒜) ⊬ H_desc(p).

*Proof.* ζ_W satisfies Ax(𝒜(1.4936)) (Lemmas 1, 2) and 𝒫 (hypothesis), and violates H_desc(p) (Theorem A). A valid
derivation would be true in every model of its premises. ∎

Theorem B is a soundness statement. Its content is in the existence and explicitness of the model (Theorem A) and in
the sensitivities below. It applies unchanged to any **window-local** statement 𝒮 that ζ_W violates. Examples are the
frontier (ZR) zero-repulsion object and local anti-clustering of off-line zeros. Such statements depend only on the
zeros within a bounded distance of each point, apart from a far field controlled by Lemma 3.

**Theorem C (explicit sensitivities of zero-side premises; PROVED).** For the windows of Theorem A (n ≤ 605) and
every T:

| Premise statistic | s_Π(W) | Note |
|---|---|---|
| N(T) | 0 for T ∉ (a, b]; ≤ 2B(b) + K ≤ 17.3 inside (rigorous), 2 in the proxy realisation | Lemma 2 |
| explicit bound \|E_N(T)\| ≤ B̃(T) | preserved as B̃ + K, K = 1.4935; preserved exactly in Remark A′ | Lemma 2 |
| N₀(T) = #critical zeros, and N₀ˢ(T) = #simple critical zeros | decrease ≤ 2 for T ≥ b; ≤ 2B(b) + K + 2 ≤ 19.3 for T ∈ (a, b] (4 in the proxy realisation) | for T ≥ b, ΔN₀ = (n − 2) − n_on(W) ≥ −2; it can only increase if ζ had off-line or multiple zeros in W. Inside, ΔN₀(T) ≥ ΔN(T) − 2 |
| N(σ, T), any σ > ½ | increase ≤ 1 | only the zero ½ + y*/2 + ic is added off the line; removed off-line zeros only lower the count |
| Linear statistic Σ_ρ g(ρ), \|g\| ≤ G | ≤ 2nG ≤ 1210 G | |
| Montgomery F(α) = (2π/(T log T)) Σ_{γ,γ′≤T} T^{iα(γ−γ′)} w(γ−γ′), w(u) = 4/(4+u²) | ≤ 4n·sup_γ Σ_{γ′} w(γ−γ′) · 2π/(T log T) | sup Σ w ≤ 2π M′(2T) + 4B(2T) by Lemma 3's argument; gives 9.3·10⁻⁹ at T = 3.1·10^12 and 3.6·10⁻¹³ at 7.5·10^16 |
| Weil / Hermitian-form compressions built on these sums (Alpöge–Furman, Lamzouri) | same order as the pair sum | AF and Lamzouri consume the form factor |

**Corollary D (what a certificate of H_desc on the lane must contain; PROVED from B + C).** Suppose an argument that
is valid on 𝒜(1.4936) derives H_desc(p_req) on the lane from zero-side mean-value premises (counts, densities,
pair/form-factor sums, linear statistics). Then at least one premise is satisfied by ζ with slack:
* < 19.3 zeros, for a critical-count premise (< 2 if it only concerns T outside the window, e.g. counts over
  dyadic ranges [T, 2T] whose endpoints avoid the window);
* < 1, for a density premise;
* < 1.4935, for an explicit N(T)-bound premise (< 17.3 for a two-sided N(T) premise);
* < 1210·G, for a linear statistic;
* < 10⁻⁸, for normalised pair sums.

On the lane N(T) = 1.28·10^13 at T = 3.1·10^12 and 4.30·10^17 at 7.5·10^16. So the critical-count premise must hold
to relative precision ≤ 19.3/N(T): 1.5·10⁻¹² at T = 3.1·10^12 and 4.5·10⁻¹⁷ at 7.5·10^16. Such a premise pins
N₀(T) to within the zero count of one window. It is RH-to-height
information, which is MV-CAP (H2) of the proportion bridge in exact form.

*Many windows (MV-CAP (H1) in exact form).* The windows of Theorem A can be placed at any centres more than 100
apart, and their effects on zero-side statistics add. So a premise of slack σ is consistent with ⌊σ/2⌋ (critical
counts) or ⌊σ⌋ (density counts) simultaneously violating windows. Two examples:
* Levinson-type: one-zero quantum q = 2πR/log T ≈ 0.28 at T = 3.1·10^12 and 0.21 at 7.5·10^16, with errors
  ≥ T^{1/2} = 1.8·10⁶ to 2.7·10⁸. The certified exception count E/q ≥ 6·10⁶ to 1.3·10⁹ zeros is slack for ⌊E/(2q)⌋
  simultaneously undetectable bad windows.
* Asymptotic proportions: if the truth is N₀ ≥ 0.6725 N (Alpöge–Furman, unrefereed) and the premise is N₀ ≥ (5/12)N,
  then σ ≥ 0.256 N(T) eventually.

---

## 6. Function-side premises

**Proposition E (PROVED; routine).** Take a premise of the form ∫ w_T(t) |A_T(½ + it) F(½ + it)|² dt = main(T) +
O(E(T)) with an unspecified constant. Typical cases: A_T a Dirichlet polynomial of length T^θ, θ < 1; w_T supported
in [T, 2T] or [0, T]. If ζ satisfies the premise, then so does ζ_W, provided:
* E(T)/log² T → ∞, for the unshifted ζ_W of Theorem A (every known error term satisfies this); or
* E(T) ≥ const > 0, for the κ = 1 shifted version of (R5).

*Proof.*
* Expansion of R = Q_{W′}/Q_W on the line at distance u = t − c from the window:
  log|R| = −m₁/u + O(nh²/u²).
* Premises localised to [T, 2T] with T > 2(c₀ + 100). The change is ∫_T^{2T} w_T |A_Tζ|²(|R|² − 1). With m₁ = 0 it is
  O(nh²T^{−2})·∫_T^{2T}|A_Tζ|² = O(T^{−1+ε}) → 0. With m₁ ≠ 0 it is ≈ 2|m₁| log 2 times the mean of
  |A_Tζ|² on [T, 2T]. That is O(|m₁| log T) for the plain mean square and O(|m₁|) for mollified moments.
* Sharp [0, T] weights with T beyond the window. The change is the fixed local integral plus a far field. With
  m₁ = 0 the far field is O(Σ_k mass(2^k-shell)/4^k) = O(1). With m₁ ≠ 0 it is O(|m₁| log² T).
* Finitely many T near c₀. The unspecified constant absorbs these.

An asymptotic premise therefore says nothing at any finite height. This is the precise sense in which the
ineffective Levinson, Conrey, PRZZ and Bettin–Chandee–Radziwiłł moments, Guth–Maynard (o(1) in the exponent) and
Alpöge–Furman (liminf statements) cannot reach a finite range such as [3·10^12, 7.5·10^16]. ∎

**Explicit-constant function-side premises: MEASURED, not proved.** The sensitivity is a property of the specific
counter-model. Measured at the proxy height c₀ = 5·10^5 with the actual zeros there (RH verified), and Z(t) from
mpmath.siegelz on a 0.01 grid over [c₀ − 75, c₀ + 75] (`proxy_*.json`, `mingap.json`).

| model at c₀ = 5e5 | max\|Z_W\| / max\|Z\| near c | Δ∫Z² (local) | Δ∫\|A\|²Z² (mollifier length T^{1/2}) | exact pull P(z*) |
|---|---|---|---|---|
| lattice, h = 25, k₀ = 1, y = 0.17, m₁ matched | 2.7 / 13.0 | −220 (abs 559; ∫Z² = 1785) | +96 (of 382) | 0.51 |
| lattice, h = 25, k₀ = 2 | 580 / 12.3 | +3.7·10⁵ | +5.6·10⁵ | 0.28 |
| lattice, h = 50, k₀ = 2 | 1856 / 12.3 | +3.9·10⁶ | +5.8·10⁶ | 0.28 |
| lattice, h = 50, k₀ = 9, y = 0.9 | 8.5·10^15 / 12.3 | +2·10^32 | – | 0.38 |
| minimal (2k₀ nearest zeros moved), k₀ = 1, hole 2.9 sp. | 12.6 / 12.3 | −2.4 | – | 0.45 |
| minimal, k₀ = 2, hole 4.4 sp. | 84 / 12.3 | +4.7·10³ | – | 0.31 |
| minimal, k₀ = 3, hole 6.6 sp. | 472 | +1.8·10⁵ | – | 0.23 |
| minimal, k₀ = 4, hole 9.1 sp. | 2792 | +7.2·10⁶ | – | 0.19 |
| minimal, k₀ = 6, hole 11.7 sp. | 4.5·10⁵ | +2.3·10^11 | – | 0.13 |
| minimal, k₀ = 9, hole 17.9 sp. | 9.9·10⁸ | +1.6·10^18 | – | 0.09 |

For comparison, the true error of ∫_0^T |ζ|² has RMS ≈ 3.93 T^{1/4}: 104 at 5·10^5, 5.2·10³ at 3.1·10^12, and
6.5·10⁴ at 7.5·10^16. This uses Heath-Brown's ∫_2^T E² = cT^{3/2} + O(T log⁵ T) with c = 10.3, asymptotic only.

Reading (HEURISTIC where it extrapolates):
1. **Holes cost exponentially on the line.** A deficit of m zeros around c raises log|ζ| on the line near c by about
   m. Removing the zeros in |u| < G and displacing them to ±G changes log|Z(c)| by ρ·2G = m. This is intrinsic, not
   an artefact of the lattice regularisation (compare the minimal rows).
2. **H_desc-mirror is cheap to violate on the function side.**
   * Up to c₀ = 10^15 the k₀ = 1 deficit suffices (Table A). Its function-side signature is O(10²) or less: −2.4
     in minimal form at the proxy height.
   * Above 10^15, k₀ = 2 is needed: about 5·10³ in minimal form at the proxy height, or about 10⁴ after the log T
     scaling (heuristic). This exceeds T^{1/4}-size fluctuations but not T^{1/2} log T.
   * The lattice-regularised versions used for the rigorous bound carry a larger long-range signature (10⁵–10⁶).
     The rigorous construction is therefore not the function-side-optimal one.
3. **The lane target (iii) needs large holes** (section 8): 7–9 mean spacings at the seam and 13–17 at N₁*. Such
   holes raise local ∫|ζ|² by ≈ 2·10⁵–7·10⁶ (seam) and 2·10^11–10^18 (N₁*), on the proxy scale. Error terms of
   order T^{1/2} log T (≈ 5·10⁷ at the seam, 10^10 at N₁*), used as a reference scale and not as a cited explicit
   theorem, would not see the seam holes but would see the N₁* holes.

   So the claim of the lane audit (B) — every mean-value input is dominated in the lane — is established here for
   zero-side and asymptotic inputs, and not for explicit function-side moments at the window height. Whether
   explicit moments could certify (iii) on part of the lane is open. The counter-models of this note do not exclude
   it near N₁*.

---

## 7. Sharpness: the premise class boundary

These premises resolve one window and do exclude ζ_W:

* **Zero-side, zero slack.** "N₀(T) = N(T) for T ≤ Γ₁" (RH to Γ₁) has σ = 0 < 2. It certifies H_desc vacuously:
  without nonreal zeros at t = 0 none exist for t > 0. This is the verified-height lever of `pt-floor-binds`.
* **Pointwise Dirichlet-series data at the window height.** ζ_W is not a Dirichlet series. Measured
  |log(ζ_W/ζ)(3 + ic)| = |log R(3 + ic)| at the proxy height (`proxy_*.json`):

  | model | at the centre | at +30 |
  | --- | --- | --- |
  | lattice k₀ = 1 | 0.33 | 0.11 |
  | lattice k₀ = 2, h = 50 | 3.55 | – |
  | lattice k₀ = 9 | 26.9 | – |

  Numerical evaluation of the Euler product at 3 + ic, to 10⁻¹⁵, separates ζ_W from ζ in all cases. The a priori
  bound |log ζ(3 + it)| ≤ log ζ(3) = 0.1840 is violated outright when |log R| > 0.368 (k₀ ≥ 2 lattice). It is not
  necessarily violated for k₀ = 1.

  Distinguishing is not certifying. The mirror-descent record (A5) shows that the Euler product gives only an
  instantaneous rate at t = 0, about 0.85 at y₀ against 4.37 needed. This is consistent with NS-RIGID and with
  item 2(c) of the lane audit: the missing input is pointwise arithmetic at the window height.
* **Bettin–Gonek long mollifiers** (θ > 1). Their implication uses 1 − M_Nζ ≈ Σ_{n>N} at σ ≥ 2, a Dirichlet-series
  identity that ζ_W fails (|1 − R| = O(1) at σ = 2 near the window). So the loophole recorded in the proportion
  bridge is outside the class, as recorded there.
* **Explicit function-side moments with error below the hole signature** (section 6, item 3). These are the only
  mean-value-type premises found that exclude some of the counter-models. They do so for large holes only.

The classical analogue for "Dirichlet series + functional equation" premises is the Davenport–Heilbronn function. It
has a Dirichlet series and the functional equation but no Euler product, and it has zeros off the line.

---

## 8. Non-vacuity of the violated hypothesis: model of the lane target and of Λ(ζ_W)

H_desc is a sufficient condition. To check that ζ_W is not merely exploiting slack in it, we model the heat flow of
the counter-model's window. Zeros of p_t = e^{−t∂²}p obey the same ODE exactly for polynomials.

**Model.** Real lattice of density ln N/(2π), ±L (L = 100–460, checked at L = 300 and 600: change ≤ 0.003 in t).
The 2k₀ central slots are removed and a pair is placed at ±iy*. Integration by RK45 (rtol 1e-7)
(`routes-b5-r42-heatflow.py`, `heatflow.jsonl`). MEASURED, model only.

| ln N | y* | smallest hole (mean spacings) with Im z*(t₀) > y₀ | Im z*(t₀) at that hole | nonreal persistence, 129-sp. hole | nonreal persistence, 257-sp. hole |
|---|---|---|---|---|---|
| 13.446 (seam) | 0.99 | 7 (k₀ = 3) | 0.208 | 0.435 | 0.462 |
| 13.446 | 0.90 | 9 (k₀ = 4) | 0.256 | 0.367 | 0.385 |
| 18.509 (N₁*) | 0.99 | 13 (k₀ = 6) | 0.177 | 0.395 | 0.439 |
| 18.509 | 0.90 | 17 (k₀ = 8) | 0.253 | 0.338 | 0.369 |
| either | 0.50 | never | – | 0.12 | 0.12 |

The y* = 0.5 row agrees with de Bruijn's bound: from y ≤ (y₀² + 2t₀)^{1/2} = 0.539 every zero reaches y₀ by t₀ even
with no pull.

Readings:
* (MEASURED, model) A counter-model with a hole of 7–17 mean spacings around a pair at y* ∈ [0.9, 0.99] violates
  the lane target (iii) itself, not only H_desc.
* The time the pair stays nonreal increases with the hole toward y*²/2 (de Bruijn): 0.462 at 257 spacings,
  y* = 0.99. In the model, counter-models of this type have Λ(ζ_W) ≳ 0.38–0.46.
* (HEURISTIC, not claimed) This suggests that zero-side mean-value premises plus Ax(𝒜) cannot prove any Λ bound
  below y_max²/2 ≈ 0.487. Here y_max = 1 − 2/(5.5587 log T) comes from the zero-free region. The suggestion rests on
  two unproved steps: a rigorous lower bound for the descent time of H_t^W, and Lemma 5. Section 6 item 3 shows
  that explicit function-side moments would exclude the large holes needed near N₁*.

---

## 9. Verdict and corrections to earlier records

* **Proved.**
  * The realisation lemma (Lemma 1).
  * The counting and outer lemmas (Lemmas 2–3).
  * Theorem A: an explicit counter-model at every window of [3.1·10^12, 7.50·10^16], with p_viol ≤ 3.0119 < 4.3743,
    count inflation K ≤ 1.4935 and n_W ≤ 605. The inner lattice sum is a double-precision finite computation with
    margin 10⁻⁶.
  * Theorem B: formal MV-CAP.
  * Theorem C: explicit sensitivities.
  * Corollary D: slack < 19.3 zeros (< 2 outside the window), relative precision ≤ 1.5·10⁻¹².
  * Proposition E: asymptotic premises are void at finite height.
* **Conditional.** Failure of H_desc-mirror for t > 0 (Lemma 5 sketched).
* **Measured.**
  * Function-side sensitivities at the proxy height 5·10^5.
  * Euler detection |log R(3 + ic)| = 0.33–27.
  * Heat-flow model: (iii) fails for holes ≥ 7 (seam) / ≥ 13 (N₁*) mean spacings; nonreal persistence up to 0.46.
* **Heuristic.**
  * Extrapolation of the proxy sensitivities to the lane by log T scaling.
  * The suggestion that de Bruijn's 1/2 (or y_max²/2) is the limit for zero-side mean-value methods.
* **Corrections.**
  1. *Lane audit, MV-CAP / obstruction (B).* "No mean value certifies an every-window statement" is now a theorem for
     zero-side and asymptotic premises. For explicit function-side moments the obstruction is quantitative. The
     deficits needed for H_desc-mirror are cheap (≤ 10⁴ heuristic signature), but the holes needed to defeat (iii)
     near N₁* produce local ∫|ζ|² changes ≥ 10^11 at the proxy scale. The audit's sentence should carry this
     qualification. The B-side statement (E2 < 1/(4πN) versus the triangle inequality) is a different object and is
     not affected.
  2. *Proportion bridge MV-CAP (H1).* The "certified exception count ≥ E/q" is exactly a count of simultaneously
     undetectable bad windows (section 5). (H2) per-zero resolution is Corollary D.
  3. *Literal H_desc includes t = 0 with real-only P.* It fails for a counter-model that preserves every explicit
     N(T) bound exactly (Remark A′), so it is strictly stronger than needed. H_desc-mirror is the robust form.
* **Not claimed.** Nothing about ζ itself: H_desc holds vacuously under RH. No Λ bound changes. No statement about
  arguments that use the Euler product, the approximate functional equation, or computed zeros at the window height.

---

## 10. Reproduction

All scripts run with `.venv-arb/bin/python`, one process each, under 1 GB, seconds to about 2 minutes (Z grid: two
processes, about 90 s each).

* `tmp/routes-b5-r42-pviol.py` — construction and bound per height, plus Table A rows (`pviol.json`).
* `tmp/routes-b5-r42-uniform.py` — uniform-in-c bounds (`uniform.json`).
* `tmp/routes-b5-r42-checks.py` — robustness to B×2 and B×3, and the outer-lemma sanity check (`checks.json`).
* `tmp/routes-b5-r42-proxy.py c0 h k0 y K step part nparts [match]`. Run parts 0..n−1 for the siegelz grid
  (`proxyZ_*.npy`), then part −1 for the analysis (`proxy_*.json`).
* `tmp/routes-b5-r42-profile.py k0 y` — where Z_W is large.
* `tmp/routes-b5-r42-mingap.py` — minimal-perturbation hole costs (`mingap.json`).
* `tmp/routes-b5-r42-heatflow.py lnN ystar k0 L tmax` — heat-flow model (`heatflow.jsonl`).

Zeros 1..10⁶ come from `src/data/zeros-to-1e6.js`, parsed to `tmp/routes-b5-r16-out/zeros.npy` by
`tmp/routes-b5-r16-loadzeros.py`.

## References

* T. Trudgian, An improved upper bound for the argument of the Riemann zeta-function on the critical line II,
  J. Number Theory 134 (2014) 280–292. Explicit N(T) bound; constants as quoted, not re-derived.
* M. Mossinghoff, T. Trudgian, A. Yang, Explicit zero-free regions for the Riemann zeta-function (2022/24). Constant
  5.558691, as quoted.
* D. Platt, T. Trudgian, The Riemann hypothesis is true up to 3·10^12, Bull. LMS 53 (2021).
* D. R. Heath-Brown, The mean value theorem for the Riemann zeta-function, Mathematika 25 (1978) 177–184. Mean square
  of E(T).
* H. Ki, Y.-O. Kim, J. Lee, On the de Bruijn–Newman constant, Adv. Math. 222 (2009).
* B. Rodgers, T. Tao, The de Bruijn–Newman constant is non-negative, Forum Math. Pi 8 (2020).
* D.H.J. Polymath, Effective approximation of heat flow evolution of the Riemann ξ function, and a new upper bound
  for the de Bruijn–Newman constant, Res. Math. Sci. 6 (2019).
* S. Bettin, S. M. Gonek, The θ = ∞ conjecture implies the Riemann hypothesis, Mathematika 63 (2017).
* L. Alpöge, R. Furman, arXiv:2608.13637 (unrefereed); Y. Lamzouri, arXiv:2609.02882 (unrefereed), as described in
  `src/data/critical-line-proportion.js`.
* H. Davenport, H. Heilbronn, On the zeros of certain Dirichlet series, J. London Math. Soc. 11 (1936).
* Project records: `lane-arithmetic-input-audit-2026-09-22`, `proportion-to-all-bridge-2026-09-22`,
  `rh-bridge-mirror-descent-2026-09-25`, `ns3-locallev-2026-09-29`.
